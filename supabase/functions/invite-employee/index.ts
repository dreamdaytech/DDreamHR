import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const bytesToBase64Url = (bytes: Uint8Array) => {
  let binary = "";
  bytes.forEach((value) => { binary += String.fromCharCode(value); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const sha256Hex = async (value: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const authHeader = req.headers.get("Authorization") ?? "";

    if (!supabaseUrl || !serviceRoleKey || !anonKey || !authHeader) {
      return json({ error: "Function environment is not configured" }, 500);
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const token = authHeader.replace(/^Bearer\s+/i, "");
    const { data: authData, error: authError } = await userClient.auth.getUser(token);
    if (authError || !authData.user) return json({ error: "Authentication required" }, 401);

    const { data: context, error: contextError } = await userClient.rpc("get_my_tenant_context");
    if (contextError || !context?.business_id) {
      return json({ error: "No tenant is assigned to this account" }, 403);
    }
    if (!["admin", "hr"].includes(context.role)) {
      return json({ error: "Only Admin or HR can invite staff" }, 403);
    }

    const body = await req.json();
    const employeeId = String(body.employee_id ?? "");
    const role = String(body.role ?? "employee").toLowerCase();
    if (!employeeId || !["admin", "hr", "manager", "employee"].includes(role)) {
      return json({ error: "A valid employee and role are required" }, 400);
    }

    const { data: employee, error: employeeError } = await userClient
      .from("employees")
      .select("id,business_id,user_id,first_name,last_name,email")
      .eq("business_id", context.business_id)
      .eq("id", employeeId)
      .single();

    if (employeeError || !employee) return json({ error: "Employee record not found" }, 404);
    if (!employee.email) return json({ error: "Employee work email is required" }, 400);

    const { data: existingUserId, error: lookupError } = await serviceClient.rpc(
      "lookup_auth_user_for_invitation",
      { target_email: employee.email },
    );
    if (lookupError) throw lookupError;

    if (existingUserId) {
      const { data: otherMembership } = await serviceClient
        .from("business_users")
        .select("business_id,status")
        .eq("user_id", existingUserId)
        .eq("status", "active")
        .neq("business_id", context.business_id)
        .maybeSingle();

      if (otherMembership) {
        return json({ error: "This email already belongs to another active DDreamHR business" }, 409);
      }

      const { data: sameMembership } = await serviceClient
        .from("business_users")
        .select("id,status")
        .eq("business_id", context.business_id)
        .eq("user_id", existingUserId)
        .eq("status", "active")
        .maybeSingle();

      if (sameMembership) {
        return json({ error: "This employee already has active workspace access" }, 409);
      }
    }

    await serviceClient
      .from("business_invitations")
      .update({ status: "revoked" })
      .eq("business_id", context.business_id)
      .eq("employee_id", employee.id)
      .eq("status", "pending");

    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    const invitationToken = bytesToBase64Url(randomBytes);
    const tokenHash = await sha256Hex(invitationToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const originHeader = req.headers.get("Origin");
    let siteUrl = String(body.site_url || originHeader || "https://ddreamhr.onrender.com").replace(/\/$/, "");
    try {
      const parsed = new URL(siteUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("invalid protocol");
      siteUrl = parsed.origin;
    } catch {
      siteUrl = "https://ddreamhr.onrender.com";
    }
    const inviteUrl = `${siteUrl}/invite/${invitationToken}`;

    const { data: invitation, error: invitationError } = await serviceClient
      .from("business_invitations")
      .insert({
        business_id: context.business_id,
        employee_id: employee.id,
        email: employee.email.toLowerCase(),
        role,
        token_hash: tokenHash,
        status: "pending",
        auth_user_existed: Boolean(existingUserId),
        delivery_status: "pending",
        invited_by: authData.user.id,
        expires_at: expiresAt,
        metadata: {
          employee_name: `${employee.first_name || ""} ${employee.last_name || ""}`.trim(),
        },
      })
      .select("id")
      .single();

    if (invitationError) throw invitationError;

    let deliveryStatus = "sent";
    let deliveryError: string | null = null;

    if (existingUserId) {
      const existingClient = createClient(supabaseUrl, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { error: magicLinkError } = await existingClient.auth.signInWithOtp({
        email: employee.email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: inviteUrl,
        },
      });

      if (magicLinkError) {
        deliveryStatus = "link_only";
        deliveryError = magicLinkError.message;
      }
    } else {
      const { error: inviteError } = await serviceClient.auth.admin.inviteUserByEmail(
        employee.email,
        {
          redirectTo: inviteUrl,
          data: {
            ddreamhr_invitation_id: invitation.id,
            ddreamhr_business_id: context.business_id,
            ddreamhr_employee_id: employee.id,
          },
        },
      );

      if (inviteError) {
        deliveryStatus = "failed";
        deliveryError = inviteError.message;
      }
    }

    await serviceClient
      .from("business_invitations")
      .update({
        delivery_status: deliveryStatus,
        delivery_error: deliveryError,
        last_sent_at: new Date().toISOString(),
      })
      .eq("id", invitation.id);

    if (deliveryStatus === "failed") {
      return json({
        error: deliveryError || "Invitation email could not be sent",
        invitation_id: invitation.id,
        invite_url: inviteUrl,
      }, 502);
    }

    return json({
      invitation_id: invitation.id,
      invite_url: inviteUrl,
      expires_at: expiresAt,
      delivery_status: deliveryStatus,
      existing_user: Boolean(existingUserId),
    });
  } catch (error) {
    console.error("invite-employee error", error);
    return json({ error: error instanceof Error ? error.message : "Unexpected error" }, 500);
  }
});
