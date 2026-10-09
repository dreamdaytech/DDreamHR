export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          audience: Json
          business_id: string
          content: string
          created_at: string
          created_by: string | null
          id: string
          published: boolean
          title: string
          updated_at: string
        }
        Insert: {
          audience?: Json
          business_id: string
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          published?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          audience?: Json
          business_id?: string
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          published?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      attendance_breaks: {
        Row: {
          attendance_id: string
          break_type: string
          created_at: string
          end_time: string | null
          id: string
          is_paid: boolean
          notes: string | null
          start_time: string
        }
        Insert: {
          attendance_id: string
          break_type?: string
          created_at?: string
          end_time?: string | null
          id?: string
          is_paid?: boolean
          notes?: string | null
          start_time: string
        }
        Update: {
          attendance_id?: string
          break_type?: string
          created_at?: string
          end_time?: string | null
          id?: string
          is_paid?: boolean
          notes?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_breaks_attendance_id_fkey"
            columns: ["attendance_id"]
            isOneToOne: false
            referencedRelation: "attendance_records"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_policies: {
        Row: {
          active: boolean
          business_id: string
          created_at: string
          department: string | null
          early_departure_threshold_minutes: number
          grace_period_minutes: number
          half_day_hours: number
          id: string
          include_holidays: boolean
          include_weekends: boolean
          late_threshold_minutes: number
          mode: string
          name: string
          overtime_rate: number
          overtime_threshold_hours: number
          updated_at: string
          work_hours_per_day: number
          work_hours_per_week: number
        }
        Insert: {
          active?: boolean
          business_id: string
          created_at?: string
          department?: string | null
          early_departure_threshold_minutes?: number
          grace_period_minutes?: number
          half_day_hours?: number
          id?: string
          include_holidays?: boolean
          include_weekends?: boolean
          late_threshold_minutes?: number
          mode?: string
          name: string
          overtime_rate?: number
          overtime_threshold_hours?: number
          updated_at?: string
          work_hours_per_day?: number
          work_hours_per_week?: number
        }
        Update: {
          active?: boolean
          business_id?: string
          created_at?: string
          department?: string | null
          early_departure_threshold_minutes?: number
          grace_period_minutes?: number
          half_day_hours?: number
          id?: string
          include_holidays?: boolean
          include_weekends?: boolean
          late_threshold_minutes?: number
          mode?: string
          name?: string
          overtime_rate?: number
          overtime_threshold_hours?: number
          updated_at?: string
          work_hours_per_day?: number
          work_hours_per_week?: number
        }
        Relationships: [
          {
            foreignKeyName: "attendance_policies_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          business_id: string
          check_in: string | null
          check_in_notes: string | null
          check_out: string | null
          check_out_notes: string | null
          created_at: string
          device_check_in: string | null
          device_check_out: string | null
          employee_id: string
          id: string
          ip_address_check_in: unknown
          ip_address_check_out: unknown
          is_regularized: boolean
          location_check_in: string | null
          location_check_out: string | null
          location_id: string | null
          notes: string | null
          status: string
          total_hours: number | null
          updated_at: string
          work_date: string
        }
        Insert: {
          business_id: string
          check_in?: string | null
          check_in_notes?: string | null
          check_out?: string | null
          check_out_notes?: string | null
          created_at?: string
          device_check_in?: string | null
          device_check_out?: string | null
          employee_id: string
          id?: string
          ip_address_check_in?: unknown
          ip_address_check_out?: unknown
          is_regularized?: boolean
          location_check_in?: string | null
          location_check_out?: string | null
          location_id?: string | null
          notes?: string | null
          status?: string
          total_hours?: number | null
          updated_at?: string
          work_date?: string
        }
        Update: {
          business_id?: string
          check_in?: string | null
          check_in_notes?: string | null
          check_out?: string | null
          check_out_notes?: string | null
          created_at?: string
          device_check_in?: string | null
          device_check_out?: string | null
          employee_id?: string
          id?: string
          ip_address_check_in?: unknown
          ip_address_check_out?: unknown
          is_regularized?: boolean
          location_check_in?: string | null
          location_check_out?: string | null
          location_id?: string | null
          notes?: string | null
          status?: string
          total_hours?: number | null
          updated_at?: string
          work_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_report_feedback: {
        Row: {
          comment: string
          created_at: string
          id: string
          parent_comment_id: string | null
          report_id: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          report_id: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          report_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_report_feedback_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "attendance_report_feedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_report_feedback_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "attendance_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_report_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      attendance_reports: {
        Row: {
          attachment_paths: Json
          business_id: string
          created_at: string
          employee_id: string
          end_date: string
          id: string
          notes: string | null
          record_ids: string[]
          report_type: string
          reviewed_at: string | null
          reviewed_by: string | null
          start_date: string
          status: string
          submitted_at: string
          updated_at: string
        }
        Insert: {
          attachment_paths?: Json
          business_id: string
          created_at?: string
          employee_id: string
          end_date: string
          id?: string
          notes?: string | null
          record_ids?: string[]
          report_type: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          start_date: string
          status?: string
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          attachment_paths?: Json
          business_id?: string
          created_at?: string
          employee_id?: string
          end_date?: string
          id?: string
          notes?: string | null
          record_ids?: string[]
          report_type?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          start_date?: string
          status?: string
          submitted_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_reports_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_reports_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      attendance_settings: {
        Row: {
          allowed_ip_addresses: string[]
          biometric_required: boolean
          business_id: string
          created_at: string
          enable_break_tracking: boolean
          enable_location_validation: boolean
          enable_remote_checkin: boolean
          facial_recognition_required: boolean
          geo_fencing_enabled: boolean
          geo_fencing_locations: Json
          geo_fencing_radius: number
          grace_time_early: number
          grace_time_late: number
          id: string
          timezone: string
          updated_at: string
          working_hours_end: string
          working_hours_start: string
        }
        Insert: {
          allowed_ip_addresses?: string[]
          biometric_required?: boolean
          business_id: string
          created_at?: string
          enable_break_tracking?: boolean
          enable_location_validation?: boolean
          enable_remote_checkin?: boolean
          facial_recognition_required?: boolean
          geo_fencing_enabled?: boolean
          geo_fencing_locations?: Json
          geo_fencing_radius?: number
          grace_time_early?: number
          grace_time_late?: number
          id?: string
          timezone?: string
          updated_at?: string
          working_hours_end?: string
          working_hours_start?: string
        }
        Update: {
          allowed_ip_addresses?: string[]
          biometric_required?: boolean
          business_id?: string
          created_at?: string
          enable_break_tracking?: boolean
          enable_location_validation?: boolean
          enable_remote_checkin?: boolean
          facial_recognition_required?: boolean
          geo_fencing_enabled?: boolean
          geo_fencing_locations?: Json
          geo_fencing_radius?: number
          grace_time_early?: number
          grace_time_late?: number
          id?: string
          timezone?: string
          updated_at?: string
          working_hours_end?: string
          working_hours_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_settings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_invitations: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          auth_user_existed: boolean
          business_id: string
          created_at: string
          delivery_error: string | null
          delivery_status: string
          email: string
          employee_id: string
          expires_at: string
          id: string
          invited_by: string
          last_sent_at: string | null
          metadata: Json
          requires_password: boolean
          role: string
          status: string
          token_hash: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          auth_user_existed?: boolean
          business_id: string
          created_at?: string
          delivery_error?: string | null
          delivery_status?: string
          email: string
          employee_id: string
          expires_at?: string
          id?: string
          invited_by: string
          last_sent_at?: string | null
          metadata?: Json
          requires_password?: boolean
          role: string
          status?: string
          token_hash: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          auth_user_existed?: boolean
          business_id?: string
          created_at?: string
          delivery_error?: string | null
          delivery_status?: string
          email?: string
          employee_id?: string
          expires_at?: string
          id?: string
          invited_by?: string
          last_sent_at?: string | null
          metadata?: Json
          requires_password?: boolean
          role?: string
          status?: string
          token_hash?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_invitations_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "business_invitations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_invitations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      business_management_log: {
        Row: {
          action: string
          business_id: string | null
          created_at: string
          id: string
          new_values: Json | null
          notes: string | null
          old_values: Json | null
          super_admin_id: string | null
        }
        Insert: {
          action: string
          business_id?: string | null
          created_at?: string
          id?: string
          new_values?: Json | null
          notes?: string | null
          old_values?: Json | null
          super_admin_id?: string | null
        }
        Update: {
          action?: string
          business_id?: string | null
          created_at?: string
          id?: string
          new_values?: Json | null
          notes?: string | null
          old_values?: Json | null
          super_admin_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_management_log_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_management_log_super_admin_id_fkey"
            columns: ["super_admin_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      business_users: {
        Row: {
          business_id: string
          created_at: string
          id: string
          invited_at: string | null
          invited_by: string | null
          is_primary_admin: boolean
          joined_at: string | null
          permissions: Json
          role: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_primary_admin?: boolean
          joined_at?: string | null
          permissions?: Json
          role: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_primary_admin?: boolean
          joined_at?: string | null
          permissions?: Json
          role?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_users_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_users_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "business_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      businesses: {
        Row: {
          address: string | null
          admin_email: string
          admin_name: string
          brand_color: string | null
          company_size: string | null
          country: string | null
          created_at: string
          entity_type: string
          id: string
          industry: string | null
          logo_url: string | null
          monthly_revenue: number
          name: string
          phone: string | null
          settings: Json
          slug: string
          status: string
          subscription_plan: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          admin_email: string
          admin_name: string
          brand_color?: string | null
          company_size?: string | null
          country?: string | null
          created_at?: string
          entity_type?: string
          id?: string
          industry?: string | null
          logo_url?: string | null
          monthly_revenue?: number
          name: string
          phone?: string | null
          settings?: Json
          slug: string
          status?: string
          subscription_plan?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          admin_email?: string
          admin_name?: string
          brand_color?: string | null
          company_size?: string | null
          country?: string | null
          created_at?: string
          entity_type?: string
          id?: string
          industry?: string | null
          logo_url?: string | null
          monthly_revenue?: number
          name?: string
          phone?: string | null
          settings?: Json
          slug?: string
          status?: string
          subscription_plan?: string
          updated_at?: string
        }
        Relationships: []
      }
      direct_deposit_accounts: {
        Row: {
          account_last4: string | null
          account_number_encrypted: string
          account_type: string
          allocation_percentage: number
          bank_name: string
          created_at: string
          employee_id: string
          id: string
          is_active: boolean
          is_primary: boolean
          routing_number_encrypted: string | null
          updated_at: string
        }
        Insert: {
          account_last4?: string | null
          account_number_encrypted: string
          account_type: string
          allocation_percentage?: number
          bank_name: string
          created_at?: string
          employee_id: string
          id?: string
          is_active?: boolean
          is_primary?: boolean
          routing_number_encrypted?: string | null
          updated_at?: string
        }
        Update: {
          account_last4?: string | null
          account_number_encrypted?: string
          account_type?: string
          allocation_percentage?: number
          bank_name?: string
          created_at?: string
          employee_id?: string
          id?: string
          is_active?: boolean
          is_primary?: boolean
          routing_number_encrypted?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "direct_deposit_accounts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          access_level: string
          business_id: string
          category: string
          created_at: string
          employee_id: string | null
          expires_at: string | null
          id: string
          metadata: Json
          mime_type: string | null
          name: string
          size_bytes: number | null
          storage_bucket: string
          storage_path: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          access_level?: string
          business_id: string
          category?: string
          created_at?: string
          employee_id?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json
          mime_type?: string | null
          name: string
          size_bytes?: number | null
          storage_bucket?: string
          storage_path: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          access_level?: string
          business_id?: string
          category?: string
          created_at?: string
          employee_id?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json
          mime_type?: string | null
          name?: string
          size_bytes?: number | null
          storage_bucket?: string
          storage_path?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      employee_changes: {
        Row: {
          after_value: Json
          approved_at: string | null
          approved_by: string | null
          before_value: Json
          business_id: string
          change_type: string
          completed_at: string | null
          created_at: string
          effective_date: string
          employee_id: string
          id: string
          reason: string
          requested_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          after_value?: Json
          approved_at?: string | null
          approved_by?: string | null
          before_value?: Json
          business_id: string
          change_type: string
          completed_at?: string | null
          created_at?: string
          effective_date: string
          employee_id: string
          id?: string
          reason: string
          requested_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          after_value?: Json
          approved_at?: string | null
          approved_by?: string | null
          before_value?: Json
          business_id?: string
          change_type?: string
          completed_at?: string | null
          created_at?: string
          effective_date?: string
          employee_id?: string
          id?: string
          reason?: string
          requested_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_changes_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "employee_changes_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_changes_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_changes_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      employee_lifecycle_events: {
        Row: {
          business_id: string
          created_at: string
          created_by: string | null
          description: string | null
          employee_id: string
          event_date: string
          event_type: string
          id: string
          metadata: Json
          title: string
        }
        Insert: {
          business_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          employee_id: string
          event_date?: string
          event_type: string
          id?: string
          metadata?: Json
          title: string
        }
        Update: {
          business_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          employee_id?: string
          event_date?: string
          event_type?: string
          id?: string
          metadata?: Json
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_lifecycle_events_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_lifecycle_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "employee_lifecycle_events_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_onboarding: {
        Row: {
          business_id: string
          checklist_id: string
          completed_at: string | null
          completed_items: Json
          completion_percentage: number
          created_at: string
          employee_id: string
          id: string
          lifecycle_type: string
          started_at: string
          updated_at: string
        }
        Insert: {
          business_id: string
          checklist_id: string
          completed_at?: string | null
          completed_items?: Json
          completion_percentage?: number
          created_at?: string
          employee_id: string
          id?: string
          lifecycle_type?: string
          started_at?: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          checklist_id?: string
          completed_at?: string | null
          completed_items?: Json
          completion_percentage?: number
          created_at?: string
          employee_id?: string
          id?: string
          lifecycle_type?: string
          started_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_onboarding_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_onboarding_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "onboarding_checklists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_onboarding_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_recognitions: {
        Row: {
          business_id: string
          created_at: string
          from_employee_id: string | null
          id: string
          is_public: boolean
          message: string | null
          points_awarded: number
          recognition_type: string
          title: string
          to_employee_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          from_employee_id?: string | null
          id?: string
          is_public?: boolean
          message?: string | null
          points_awarded?: number
          recognition_type?: string
          title: string
          to_employee_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          from_employee_id?: string | null
          id?: string
          is_public?: boolean
          message?: string | null
          points_awarded?: number
          recognition_type?: string
          title?: string
          to_employee_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_recognitions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_recognitions_from_employee_id_fkey"
            columns: ["from_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_recognitions_to_employee_id_fkey"
            columns: ["to_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_salary_profiles: {
        Row: {
          basic_salary: number
          business_id: string
          created_at: string
          created_by: string | null
          currency: string
          effective_from: string
          effective_to: string | null
          employee_id: string
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          basic_salary: number
          business_id: string
          created_at?: string
          created_by?: string | null
          currency?: string
          effective_from: string
          effective_to?: string | null
          employee_id: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          basic_salary?: number
          business_id?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          effective_from?: string
          effective_to?: string | null
          employee_id?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_salary_profiles_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_salary_profiles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "employee_salary_profiles_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_shifts: {
        Row: {
          created_at: string
          effective_from: string
          effective_to: string | null
          employee_id: string
          id: string
          shift_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          effective_from: string
          effective_to?: string | null
          employee_id: string
          id?: string
          shift_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          employee_id?: string
          id?: string
          shift_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_shifts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_shifts_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          business_id: string
          created_at: string
          department: string
          email: string
          employee_id_number: string | null
          employment_condition: string
          employment_type: string
          first_name: string
          hire_date: string | null
          id: string
          last_name: string
          lifecycle_state: string
          location: string | null
          manager_id: string | null
          metadata: Json
          phone: string | null
          position: string
          profile_image_url: string | null
          start_date: string | null
          status: string
          termination_date: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          business_id: string
          created_at?: string
          department?: string
          email: string
          employee_id_number?: string | null
          employment_condition?: string
          employment_type?: string
          first_name: string
          hire_date?: string | null
          id?: string
          last_name: string
          lifecycle_state?: string
          location?: string | null
          manager_id?: string | null
          metadata?: Json
          phone?: string | null
          position?: string
          profile_image_url?: string | null
          start_date?: string | null
          status?: string
          termination_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string
          department?: string
          email?: string
          employee_id_number?: string | null
          employment_condition?: string
          employment_type?: string
          first_name?: string
          hire_date?: string | null
          id?: string
          last_name?: string
          lifecycle_state?: string
          location?: string | null
          manager_id?: string | null
          metadata?: Json
          phone?: string | null
          position?: string
          profile_image_url?: string | null
          start_date?: string | null
          status?: string
          termination_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      engagement_event_participants: {
        Row: {
          attended_at: string | null
          employee_id: string
          event_id: string
          id: string
          registered_at: string
          status: string
        }
        Insert: {
          attended_at?: string | null
          employee_id: string
          event_id: string
          id?: string
          registered_at?: string
          status?: string
        }
        Update: {
          attended_at?: string | null
          employee_id?: string
          event_id?: string
          id?: string
          registered_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_event_participants_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "engagement_events"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_events: {
        Row: {
          business_id: string
          created_at: string
          description: string | null
          end_datetime: string | null
          event_type: string
          id: string
          is_published: boolean
          is_virtual: boolean
          location: string | null
          max_participants: number | null
          organizer_id: string | null
          registration_required: boolean
          start_datetime: string
          title: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          description?: string | null
          end_datetime?: string | null
          event_type?: string
          id?: string
          is_published?: boolean
          is_virtual?: boolean
          location?: string | null
          max_participants?: number | null
          organizer_id?: string | null
          registration_required?: boolean
          start_datetime: string
          title: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          description?: string | null
          end_datetime?: string | null
          event_type?: string
          id?: string
          is_published?: boolean
          is_virtual?: boolean
          location?: string | null
          max_participants?: number | null
          organizer_id?: string | null
          registration_required?: boolean
          start_datetime?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_events_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      engagement_survey_responses: {
        Row: {
          completed_at: string | null
          created_at: string
          employee_id: string | null
          id: string
          responses: Json
          started_at: string | null
          status: string
          survey_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          employee_id?: string | null
          id?: string
          responses?: Json
          started_at?: string | null
          status?: string
          survey_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          employee_id?: string | null
          id?: string
          responses?: Json
          started_at?: string | null
          status?: string
          survey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_survey_responses_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_survey_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "engagement_surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_surveys: {
        Row: {
          business_id: string
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          is_anonymous: boolean
          questions: Json
          reminder_frequency: number | null
          start_date: string | null
          status: string
          survey_type: string
          target_audience: Json
          title: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_anonymous?: boolean
          questions?: Json
          reminder_frequency?: number | null
          start_date?: string | null
          status?: string
          survey_type?: string
          target_audience?: Json
          title: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_anonymous?: boolean
          questions?: Json
          reminder_frequency?: number | null
          start_date?: string | null
          status?: string
          survey_type?: string
          target_audience?: Json
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_surveys_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_surveys_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          created_at: string
          description: string | null
          enabled: boolean
          feature_key: string
          id: string
          name: string
          tags: string[]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          feature_key: string
          id?: string
          name: string
          tags?: string[]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          feature_key?: string
          id?: string
          name?: string
          tags?: string[]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_flags_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      leave_balances: {
        Row: {
          allocated: number
          business_id: string
          carried_over: number
          employee_id: string
          id: string
          leave_type_id: string
          pending: number
          updated_at: string
          used: number
          year: number
        }
        Insert: {
          allocated?: number
          business_id: string
          carried_over?: number
          employee_id: string
          id?: string
          leave_type_id: string
          pending?: number
          updated_at?: string
          used?: number
          year: number
        }
        Update: {
          allocated?: number
          business_id?: string
          carried_over?: number
          employee_id?: string
          id?: string
          leave_type_id?: string
          pending?: number
          updated_at?: string
          used?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "leave_balances_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_balances_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_balances_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_request_events: {
        Row: {
          action: string
          actor_user_id: string | null
          comment: string | null
          created_at: string
          id: string
          leave_request_id: string
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          leave_request_id: string
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          leave_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_request_events_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "leave_request_events_leave_request_id_fkey"
            columns: ["leave_request_id"]
            isOneToOne: false
            referencedRelation: "leave_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          applied_at: string
          approved_at: string | null
          approved_by: string | null
          attachment_paths: Json
          business_id: string
          created_at: string
          days: number
          employee_id: string
          end_date: string
          half_day: boolean
          id: string
          leave_type_id: string
          reason: string
          review_comment: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          applied_at?: string
          approved_at?: string | null
          approved_by?: string | null
          attachment_paths?: Json
          business_id: string
          created_at?: string
          days: number
          employee_id: string
          end_date: string
          half_day?: boolean
          id?: string
          leave_type_id: string
          reason: string
          review_comment?: string | null
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          applied_at?: string
          approved_at?: string | null
          approved_by?: string | null
          attachment_paths?: Json
          business_id?: string
          created_at?: string
          days?: number
          employee_id?: string
          end_date?: string
          half_day?: boolean
          id?: string
          leave_type_id?: string
          reason?: string
          review_comment?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "leave_requests_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_settings: {
        Row: {
          allow_half_days: boolean
          allow_negative_balance: boolean
          business_id: string
          created_at: string
          hr_approval_required: boolean
          id: string
          leave_year_start_month: number
          manager_approval_required: boolean
          require_attachment_after_days: number | null
          updated_at: string
        }
        Insert: {
          allow_half_days?: boolean
          allow_negative_balance?: boolean
          business_id: string
          created_at?: string
          hr_approval_required?: boolean
          id?: string
          leave_year_start_month?: number
          manager_approval_required?: boolean
          require_attachment_after_days?: number | null
          updated_at?: string
        }
        Update: {
          allow_half_days?: boolean
          allow_negative_balance?: boolean
          business_id?: string
          created_at?: string
          hr_approval_required?: boolean
          id?: string
          leave_year_start_month?: number
          manager_approval_required?: boolean
          require_attachment_after_days?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_settings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_types: {
        Row: {
          active: boolean
          annual_allowance: number
          business_id: string
          carry_forward: boolean
          code: string
          color: string | null
          created_at: string
          description: string | null
          id: string
          is_paid: boolean
          max_carry_forward: number | null
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          annual_allowance?: number
          business_id: string
          carry_forward?: boolean
          code: string
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_paid?: boolean
          max_carry_forward?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          annual_allowance?: number
          business_id?: string
          carry_forward?: boolean
          code?: string
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_paid?: boolean
          max_carry_forward?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_types_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          active: boolean
          address: string | null
          business_id: string
          created_at: string
          id: string
          ip_addresses: string[]
          latitude: number | null
          longitude: number | null
          name: string
          radius_meters: number
          type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          address?: string | null
          business_id: string
          created_at?: string
          id?: string
          ip_addresses?: string[]
          latitude?: number | null
          longitude?: number | null
          name: string
          radius_meters?: number
          type?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          address?: string | null
          business_id?: string
          created_at?: string
          id?: string
          ip_addresses?: string[]
          latitude?: number | null
          longitude?: number | null
          name?: string
          radius_meters?: number
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      off_cycle_payroll: {
        Row: {
          amount: number
          business_id: string
          created_at: string
          employee_id: string
          id: string
          payroll_period_id: string | null
          payroll_type: string
          processed_at: string | null
          processed_by: string | null
          reason: string | null
        }
        Insert: {
          amount: number
          business_id: string
          created_at?: string
          employee_id: string
          id?: string
          payroll_period_id?: string | null
          payroll_type: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
        }
        Update: {
          amount?: number
          business_id?: string
          created_at?: string
          employee_id?: string
          id?: string
          payroll_period_id?: string | null
          payroll_type?: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "off_cycle_payroll_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "off_cycle_payroll_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "off_cycle_payroll_payroll_period_id_fkey"
            columns: ["payroll_period_id"]
            isOneToOne: false
            referencedRelation: "payroll_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "off_cycle_payroll_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      onboarding_checklists: {
        Row: {
          business_id: string
          checklist_items: Json
          created_at: string
          id: string
          is_active: boolean
          lifecycle_type: string
          template_name: string
          updated_at: string
        }
        Insert: {
          business_id: string
          checklist_items?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          lifecycle_type?: string
          template_name: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          checklist_items?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          lifecycle_type?: string
          template_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_checklists_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_periods: {
        Row: {
          business_id: string
          created_at: string
          end_date: string
          id: string
          is_off_cycle: boolean
          pay_date: string
          period_name: string
          processed_at: string | null
          processed_by: string | null
          schedule_id: string | null
          start_date: string
          status: string
          total_amount: number
          total_employees: number
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          end_date: string
          id?: string
          is_off_cycle?: boolean
          pay_date: string
          period_name: string
          processed_at?: string | null
          processed_by?: string | null
          schedule_id?: string | null
          start_date: string
          status?: string
          total_amount?: number
          total_employees?: number
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          end_date?: string
          id?: string
          is_off_cycle?: boolean
          pay_date?: string
          period_name?: string
          processed_at?: string | null
          processed_by?: string | null
          schedule_id?: string | null
          start_date?: string
          status?: string
          total_amount?: number
          total_employees?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_periods_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_periods_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "payroll_periods_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "payroll_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_record_allowances: {
        Row: {
          allowance_id: string | null
          allowance_name: string
          amount: number
          created_at: string
          id: string
          payroll_record_id: string
        }
        Insert: {
          allowance_id?: string | null
          allowance_name: string
          amount: number
          created_at?: string
          id?: string
          payroll_record_id: string
        }
        Update: {
          allowance_id?: string | null
          allowance_name?: string
          amount?: number
          created_at?: string
          id?: string
          payroll_record_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_record_allowances_allowance_id_fkey"
            columns: ["allowance_id"]
            isOneToOne: false
            referencedRelation: "salary_allowances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_record_allowances_payroll_record_id_fkey"
            columns: ["payroll_record_id"]
            isOneToOne: false
            referencedRelation: "payroll_records"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_record_deductions: {
        Row: {
          amount: number
          created_at: string
          deduction_id: string | null
          deduction_name: string
          id: string
          payroll_record_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          deduction_id?: string | null
          deduction_name: string
          id?: string
          payroll_record_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          deduction_id?: string | null
          deduction_name?: string
          id?: string
          payroll_record_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_record_deductions_deduction_id_fkey"
            columns: ["deduction_id"]
            isOneToOne: false
            referencedRelation: "salary_deductions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_record_deductions_payroll_record_id_fkey"
            columns: ["payroll_record_id"]
            isOneToOne: false
            referencedRelation: "payroll_records"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_records: {
        Row: {
          actual_days_worked: number
          basic_salary: number
          created_at: string
          employee_id: string
          gross_salary: number
          id: string
          leave_days: number
          leave_deduction: number
          net_salary: number
          overtime_amount: number
          overtime_hours: number
          payment_date: string | null
          payment_reference: string | null
          payment_status: string
          payroll_period_id: string
          salary_profile_id: string
          total_allowances: number
          total_deductions: number
          updated_at: string
          working_days: number
        }
        Insert: {
          actual_days_worked?: number
          basic_salary?: number
          created_at?: string
          employee_id: string
          gross_salary?: number
          id?: string
          leave_days?: number
          leave_deduction?: number
          net_salary?: number
          overtime_amount?: number
          overtime_hours?: number
          payment_date?: string | null
          payment_reference?: string | null
          payment_status?: string
          payroll_period_id: string
          salary_profile_id: string
          total_allowances?: number
          total_deductions?: number
          updated_at?: string
          working_days?: number
        }
        Update: {
          actual_days_worked?: number
          basic_salary?: number
          created_at?: string
          employee_id?: string
          gross_salary?: number
          id?: string
          leave_days?: number
          leave_deduction?: number
          net_salary?: number
          overtime_amount?: number
          overtime_hours?: number
          payment_date?: string | null
          payment_reference?: string | null
          payment_status?: string
          payroll_period_id?: string
          salary_profile_id?: string
          total_allowances?: number
          total_deductions?: number
          updated_at?: string
          working_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "payroll_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_records_payroll_period_id_fkey"
            columns: ["payroll_period_id"]
            isOneToOne: false
            referencedRelation: "payroll_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_records_salary_profile_id_fkey"
            columns: ["salary_profile_id"]
            isOneToOne: false
            referencedRelation: "employee_salary_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_schedules: {
        Row: {
          active: boolean
          business_id: string
          created_at: string
          frequency: string
          id: string
          name: string
          pay_day: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          business_id: string
          created_at?: string
          frequency: string
          id?: string
          name: string
          pay_day?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          business_id?: string
          created_at?: string
          frequency?: string
          id?: string
          name?: string
          pay_day?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_schedules_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      payslips: {
        Row: {
          downloaded_at: string | null
          emailed_at: string | null
          employee_id: string
          file_path: string | null
          generated_at: string
          id: string
          payroll_record_id: string
        }
        Insert: {
          downloaded_at?: string | null
          emailed_at?: string | null
          employee_id: string
          file_path?: string | null
          generated_at?: string
          id?: string
          payroll_record_id: string
        }
        Update: {
          downloaded_at?: string | null
          emailed_at?: string | null
          employee_id?: string
          file_path?: string | null
          generated_at?: string
          id?: string
          payroll_record_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payslips_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payslips_payroll_record_id_fkey"
            columns: ["payroll_record_id"]
            isOneToOne: true
            referencedRelation: "payroll_records"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_announcements: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          published: boolean
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          published?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          published?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      projects: {
        Row: {
          business_id: string
          created_at: string
          created_by: string | null
          department: string | null
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          created_by?: string | null
          department?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          created_by?: string | null
          department?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      regularization_requests: {
        Row: {
          attendance_id: string | null
          business_id: string
          created_at: string
          employee_id: string
          id: string
          reason: string
          request_type: string
          requested_check_in: string | null
          requested_check_out: string | null
          requested_date: string
          review_comment: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          attendance_id?: string | null
          business_id: string
          created_at?: string
          employee_id: string
          id?: string
          reason: string
          request_type: string
          requested_check_in?: string | null
          requested_check_out?: string | null
          requested_date: string
          review_comment?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          attendance_id?: string | null
          business_id?: string
          created_at?: string
          employee_id?: string
          id?: string
          reason?: string
          request_type?: string
          requested_check_in?: string | null
          requested_check_out?: string | null
          requested_date?: string
          review_comment?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "regularization_requests_attendance_id_fkey"
            columns: ["attendance_id"]
            isOneToOne: false
            referencedRelation: "attendance_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regularization_requests_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regularization_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regularization_requests_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      salary_allowances: {
        Row: {
          allowance_type: string
          amount: number
          created_at: string
          id: string
          is_active: boolean
          is_taxable: boolean
          name: string
          salary_profile_id: string
        }
        Insert: {
          allowance_type: string
          amount: number
          created_at?: string
          id?: string
          is_active?: boolean
          is_taxable?: boolean
          name: string
          salary_profile_id: string
        }
        Update: {
          allowance_type?: string
          amount?: number
          created_at?: string
          id?: string
          is_active?: boolean
          is_taxable?: boolean
          name?: string
          salary_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "salary_allowances_salary_profile_id_fkey"
            columns: ["salary_profile_id"]
            isOneToOne: false
            referencedRelation: "employee_salary_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_deductions: {
        Row: {
          amount: number | null
          created_at: string
          deduction_type: string
          id: string
          is_active: boolean
          is_mandatory: boolean
          name: string
          percentage: number | null
          salary_profile_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          deduction_type: string
          id?: string
          is_active?: boolean
          is_mandatory?: boolean
          name: string
          percentage?: number | null
          salary_profile_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          deduction_type?: string
          id?: string
          is_active?: boolean
          is_mandatory?: boolean
          name?: string
          percentage?: number | null
          salary_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "salary_deductions_salary_profile_id_fkey"
            columns: ["salary_profile_id"]
            isOneToOne: false
            referencedRelation: "employee_salary_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      settings_audit_log: {
        Row: {
          action: string
          business_id: string | null
          created_at: string
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          business_id?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          business_id?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settings_audit_log_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "settings_audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      shifts: {
        Row: {
          active: boolean
          break_duration_minutes: number
          business_id: string
          created_at: string
          department: string | null
          end_time: string
          id: string
          name: string
          start_time: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          break_duration_minutes?: number
          business_id: string
          created_at?: string
          department?: string | null
          end_time: string
          id?: string
          name: string
          start_time: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          break_duration_minutes?: number
          business_id?: string
          created_at?: string
          department?: string | null
          end_time?: string
          id?: string
          name?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shifts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      super_admin_activities: {
        Row: {
          action: string
          business_id: string | null
          created_at: string
          details: Json
          id: string
          super_admin_id: string
        }
        Insert: {
          action: string
          business_id?: string | null
          created_at?: string
          details?: Json
          id?: string
          super_admin_id: string
        }
        Update: {
          action?: string
          business_id?: string | null
          created_at?: string
          details?: Json
          id?: string
          super_admin_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "super_admin_activities_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "super_admin_activities_super_admin_id_fkey"
            columns: ["super_admin_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      super_admin_dashboard_metrics: {
        Row: {
          created_at: string
          id: string
          metadata: Json
          metric_date: string
          metric_type: string
          metric_value: number
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json
          metric_date?: string
          metric_type: string
          metric_value: number
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json
          metric_date?: string
          metric_type?: string
          metric_value?: number
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assignee_user_id: string | null
          business_id: string | null
          closed_at: string | null
          created_at: string
          description: string
          id: string
          priority: string
          requester_email: string | null
          requester_user_id: string | null
          resolution: string | null
          status: string
          subject: string
          ticket_number: number
          updated_at: string
        }
        Insert: {
          assignee_user_id?: string | null
          business_id?: string | null
          closed_at?: string | null
          created_at?: string
          description: string
          id?: string
          priority?: string
          requester_email?: string | null
          requester_user_id?: string | null
          resolution?: string | null
          status?: string
          subject: string
          ticket_number?: never
          updated_at?: string
        }
        Update: {
          assignee_user_id?: string | null
          business_id?: string | null
          closed_at?: string | null
          created_at?: string
          description?: string
          id?: string
          priority?: string
          requester_email?: string | null
          requester_user_id?: string | null
          resolution?: string | null
          status?: string
          subject?: string
          ticket_number?: never
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assignee_user_id_fkey"
            columns: ["assignee_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "support_tickets_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_requester_user_id_fkey"
            columns: ["requester_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      system_integrations: {
        Row: {
          api_credentials_encrypted: string | null
          business_id: string | null
          created_at: string
          id: string
          integration_type: string
          is_active: boolean
          last_sync_at: string | null
          provider_name: string
          sync_frequency: string | null
          updated_at: string
        }
        Insert: {
          api_credentials_encrypted?: string | null
          business_id?: string | null
          created_at?: string
          id?: string
          integration_type: string
          is_active?: boolean
          last_sync_at?: string | null
          provider_name: string
          sync_frequency?: string | null
          updated_at?: string
        }
        Update: {
          api_credentials_encrypted?: string | null
          business_id?: string | null
          created_at?: string
          id?: string
          integration_type?: string
          is_active?: boolean
          last_sync_at?: string | null
          provider_name?: string
          sync_frequency?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_integrations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          business_id: string | null
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          business_id?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string
        }
        Update: {
          business_id?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_settings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      tasks: {
        Row: {
          actual_hours: number | null
          assigned_to: string | null
          business_id: string
          created_at: string
          description: string | null
          due_date: string | null
          estimated_hours: number
          id: string
          name: string
          priority: string
          project_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          actual_hours?: number | null
          assigned_to?: string | null
          business_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number
          id?: string
          name: string
          priority?: string
          project_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          actual_hours?: number | null
          assigned_to?: string | null
          business_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number
          id?: string
          name?: string
          priority?: string
          project_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_documents: {
        Row: {
          document_type: string
          downloaded_at: string | null
          employee_id: string
          file_path: string | null
          generated_at: string
          id: string
          tax_year: number
        }
        Insert: {
          document_type: string
          downloaded_at?: string | null
          employee_id: string
          file_path?: string | null
          generated_at?: string
          id?: string
          tax_year: number
        }
        Update: {
          document_type?: string
          downloaded_at?: string | null
          employee_id?: string
          file_path?: string | null
          generated_at?: string
          id?: string
          tax_year?: number
        }
        Relationships: [
          {
            foreignKeyName: "tax_documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      time_logs: {
        Row: {
          business_id: string
          created_at: string
          date: string
          description: string | null
          duration_seconds: number | null
          employee_id: string | null
          end_time: string | null
          id: string
          is_billable: boolean
          project_id: string | null
          start_time: string | null
          status: string
          task_id: string | null
          timesheet_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          date: string
          description?: string | null
          duration_seconds?: number | null
          employee_id?: string | null
          end_time?: string | null
          id?: string
          is_billable?: boolean
          project_id?: string | null
          start_time?: string | null
          status?: string
          task_id?: string | null
          timesheet_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          date?: string
          description?: string | null
          duration_seconds?: number | null
          employee_id?: string | null
          end_time?: string | null
          id?: string
          is_billable?: boolean
          project_id?: string | null
          start_time?: string | null
          status?: string
          task_id?: string | null
          timesheet_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_logs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_logs_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_logs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_logs_timesheet_id_fkey"
            columns: ["timesheet_id"]
            isOneToOne: false
            referencedRelation: "timesheets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      timesheets: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          business_id: string
          comments: string | null
          created_at: string
          employee_id: string
          id: string
          period_end: string
          period_start: string
          status: string
          submitted_at: string | null
          submitted_to: string | null
          total_hours: number
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          business_id: string
          comments?: string | null
          created_at?: string
          employee_id: string
          id?: string
          period_end: string
          period_start: string
          status?: string
          submitted_at?: string | null
          submitted_to?: string | null
          total_hours?: number
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          business_id?: string
          comments?: string | null
          created_at?: string
          employee_id?: string
          id?: string
          period_end?: string
          period_start?: string
          status?: string
          submitted_at?: string | null
          submitted_to?: string | null
          total_hours?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "timesheets_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "timesheets_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheets_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheets_submitted_to_fkey"
            columns: ["submitted_to"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          is_super_admin: boolean
          last_name: string | null
          phone: string | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          is_super_admin?: boolean
          last_name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          is_super_admin?: boolean
          last_name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          settings_data: Json
          settings_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          settings_data?: Json
          settings_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          settings_data?: Json
          settings_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      work_items: {
        Row: {
          assignee_role: string | null
          assignee_user_id: string | null
          business_id: string
          category: string
          completed_at: string | null
          created_at: string
          description: string | null
          due_at: string | null
          id: string
          priority: string
          source_id: string | null
          source_type: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assignee_role?: string | null
          assignee_user_id?: string | null
          business_id: string
          category: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: string
          priority?: string
          source_id?: string | null
          source_type: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assignee_role?: string | null
          assignee_user_id?: string | null
          business_id?: string
          category?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: string
          priority?: string
          source_id?: string | null
          source_type?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_items_assignee_user_id_fkey"
            columns: ["assignee_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "work_items_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_requests: {
        Row: {
          business_id: string
          completed_at: string | null
          created_at: string
          current_step: number
          employee_id: string | null
          id: string
          payload: Json
          request_type: string
          source_id: string | null
          source_type: string
          status: string
          submitted_at: string | null
          submitted_by: string | null
          updated_at: string
        }
        Insert: {
          business_id: string
          completed_at?: string | null
          created_at?: string
          current_step?: number
          employee_id?: string | null
          id?: string
          payload?: Json
          request_type: string
          source_id?: string | null
          source_type: string
          status?: string
          submitted_at?: string | null
          submitted_by?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          completed_at?: string | null
          created_at?: string
          current_step?: number
          employee_id?: string | null
          id?: string
          payload?: Json
          request_type?: string
          source_id?: string | null
          source_type?: string
          status?: string
          submitted_at?: string | null
          submitted_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_requests_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_requests_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      workflow_steps: {
        Row: {
          acted_at: string | null
          acted_by: string | null
          approver_role: string | null
          approver_user_id: string | null
          comment: string | null
          created_at: string
          id: string
          request_id: string
          status: string
          step_order: number
        }
        Insert: {
          acted_at?: string | null
          acted_by?: string | null
          approver_role?: string | null
          approver_user_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          request_id: string
          status?: string
          step_order: number
        }
        Update: {
          acted_at?: string | null
          acted_by?: string | null
          approver_role?: string | null
          approver_user_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          request_id?: string
          status?: string
          step_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "workflow_steps_acted_by_fkey"
            columns: ["acted_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "workflow_steps_approver_user_id_fkey"
            columns: ["approver_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "workflow_steps_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "workflow_requests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_employee_invitation: {
        Args: { invitation_token: string }
        Returns: Json
      }
      complete_my_onboarding_item: { Args: { item_id: string }; Returns: Json }
      get_business_growth_data: {
        Args: never
        Returns: {
          businesses: number
          month: string
          users: number
        }[]
      }
      get_my_tenant_context: {
        Args: never
        Returns: {
          business_id: string | null
          business_name: string | null
          employee_id: string | null
          employee_number: string | null
          employment_condition: string | null
          is_super_admin: boolean
          lifecycle_state: string | null
          role: string
          user_id: string
        } | null
      }
      get_recent_super_admin_activities: {
        Args: never
        Returns: {
          activity_timestamp: string
          description: string
          id: string
          status: string
          type: string
        }[]
      }
      get_revenue_data: {
        Args: never
        Returns: {
          month: string
          revenue: number
        }[]
      }
      get_super_admin_dashboard_metrics: { Args: never; Returns: Json }
      lookup_auth_user_for_invitation: {
        Args: { target_email: string }
        Returns: string
      }
      preview_employee_invitation: {
        Args: { invitation_token: string }
        Returns: Json
      }
      process_payroll_period: {
        Args: { target_period_id: string }
        Returns: Json
      }
      register_business_tenant: {
        Args: {
          business_company_size: string
          business_country: string
          business_entity_type: string
          business_industry: string
          business_name: string
          business_phone?: string
          business_slug: string
          business_timezone: string
          leave_year_start: number
          payroll_frequency: string
          payroll_pay_day: number
          selected_plan: string
          work_end: string
          work_start: string
        }
        Returns: Json
      }
      resubmit_workflow_request: {
        Args: { target_workflow_id: string }
        Returns: undefined
      }
      route_workflow_to_inbox: {
        Args: {
          preferred_assignee_role?: string
          preferred_assignee_user_id?: string
          target_workflow_id: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
