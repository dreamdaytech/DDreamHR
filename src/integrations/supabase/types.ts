export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      african_countries: {
        Row: {
          code: string
          created_at: string | null
          currency: string
          date_format: string
          id: string
          languages: string[]
          name: string
          timezone: string
          workweek_end: number
          workweek_start: number
        }
        Insert: {
          code: string
          created_at?: string | null
          currency: string
          date_format?: string
          id?: string
          languages?: string[]
          name: string
          timezone: string
          workweek_end?: number
          workweek_start?: number
        }
        Update: {
          code?: string
          created_at?: string | null
          currency?: string
          date_format?: string
          id?: string
          languages?: string[]
          name?: string
          timezone?: string
          workweek_end?: number
          workweek_start?: number
        }
        Relationships: []
      }
      approved_locations: {
        Row: {
          active: boolean
          created_at: string
          id: string
          ip_addresses: string[] | null
          latitude: number
          longitude: number
          name: string
          radius_meters: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          ip_addresses?: string[] | null
          latitude: number
          longitude: number
          name: string
          radius_meters?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          ip_addresses?: string[] | null
          latitude?: number
          longitude?: number
          name?: string
          radius_meters?: number
          updated_at?: string
        }
        Relationships: []
      }
      attendance_policies: {
        Row: {
          active: boolean
          business_id: string | null
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
          business_id?: string | null
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
          business_id?: string | null
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
          break_end: string | null
          break_start: string | null
          business_id: string | null
          check_in: string | null
          check_in_notes: string | null
          check_out: string | null
          check_out_notes: string | null
          created_at: string
          device_check_in: string | null
          device_check_out: string | null
          employee_id: string
          id: string
          ip_address_check_in: string | null
          ip_address_check_out: string | null
          location_check_in: string | null
          location_check_out: string | null
          location_id: string | null
          notes: string | null
          organization_id: string | null
          status: string
          total_hours: number | null
          updated_at: string
        }
        Insert: {
          break_end?: string | null
          break_start?: string | null
          business_id?: string | null
          check_in?: string | null
          check_in_notes?: string | null
          check_out?: string | null
          check_out_notes?: string | null
          created_at?: string
          device_check_in?: string | null
          device_check_out?: string | null
          employee_id: string
          id?: string
          ip_address_check_in?: string | null
          ip_address_check_out?: string | null
          location_check_in?: string | null
          location_check_out?: string | null
          location_id?: string | null
          notes?: string | null
          organization_id?: string | null
          status?: string
          total_hours?: number | null
          updated_at?: string
        }
        Update: {
          break_end?: string | null
          break_start?: string | null
          business_id?: string | null
          check_in?: string | null
          check_in_notes?: string | null
          check_out?: string | null
          check_out_notes?: string | null
          created_at?: string
          device_check_in?: string | null
          device_check_out?: string | null
          employee_id?: string
          id?: string
          ip_address_check_in?: string | null
          ip_address_check_out?: string | null
          location_check_in?: string | null
          location_check_out?: string | null
          location_id?: string | null
          notes?: string | null
          organization_id?: string | null
          status?: string
          total_hours?: number | null
          updated_at?: string
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
          {
            foreignKeyName: "attendance_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_settings: {
        Row: {
          created_at: string
          default_check_in_time: string
          enable_break_tracking: boolean
          enable_location_validation: boolean
          enable_remote_checkin: boolean
          id: string
          late_threshold_minutes: number
          timezone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_check_in_time?: string
          enable_break_tracking?: boolean
          enable_location_validation?: boolean
          enable_remote_checkin?: boolean
          id?: string
          late_threshold_minutes?: number
          timezone?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_check_in_time?: string
          enable_break_tracking?: boolean
          enable_location_validation?: boolean
          enable_remote_checkin?: boolean
          id?: string
          late_threshold_minutes?: number
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      benefits_plans: {
        Row: {
          business_id: string | null
          created_at: string | null
          employee_contribution_percentage: number | null
          employer_contribution_percentage: number | null
          id: string
          is_active: boolean | null
          monthly_cost: number | null
          plan_name: string
          plan_type: string
          provider_name: string | null
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          employee_contribution_percentage?: number | null
          employer_contribution_percentage?: number | null
          id?: string
          is_active?: boolean | null
          monthly_cost?: number | null
          plan_name: string
          plan_type: string
          provider_name?: string | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          employee_contribution_percentage?: number | null
          employer_contribution_percentage?: number | null
          id?: string
          is_active?: boolean | null
          monthly_cost?: number | null
          plan_name?: string
          plan_type?: string
          provider_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "benefits_plans_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_management_log: {
        Row: {
          action: string
          business_id: string | null
          created_at: string | null
          id: string
          new_values: Json | null
          notes: string | null
          old_values: Json | null
          super_admin_id: string | null
        }
        Insert: {
          action: string
          business_id?: string | null
          created_at?: string | null
          id?: string
          new_values?: Json | null
          notes?: string | null
          old_values?: Json | null
          super_admin_id?: string | null
        }
        Update: {
          action?: string
          business_id?: string | null
          created_at?: string | null
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
          created_at: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          is_primary_admin: boolean | null
          joined_at: string | null
          permissions: Json | null
          role: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_primary_admin?: boolean | null
          joined_at?: string | null
          permissions?: Json | null
          role?: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_primary_admin?: boolean | null
          joined_at?: string | null
          permissions?: Json | null
          role?: string
          status?: string | null
          updated_at?: string | null
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
        ]
      }
      businesses: {
        Row: {
          address: string | null
          admin_email: string
          admin_name: string
          brand_color: string | null
          company_size: string | null
          country_id: string | null
          created_at: string | null
          entity_type: Database["public"]["Enums"]["entity_type"]
          id: string
          industry: string | null
          logo_url: string | null
          monthly_revenue: number | null
          name: string
          phone: string | null
          settings: Json | null
          slug: string
          status: Database["public"]["Enums"]["business_status"]
          subscription_plan: Database["public"]["Enums"]["subscription_plan"]
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          admin_email: string
          admin_name: string
          brand_color?: string | null
          company_size?: string | null
          country_id?: string | null
          created_at?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          industry?: string | null
          logo_url?: string | null
          monthly_revenue?: number | null
          name: string
          phone?: string | null
          settings?: Json | null
          slug: string
          status?: Database["public"]["Enums"]["business_status"]
          subscription_plan?: Database["public"]["Enums"]["subscription_plan"]
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          admin_email?: string
          admin_name?: string
          brand_color?: string | null
          company_size?: string | null
          country_id?: string | null
          created_at?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          industry?: string | null
          logo_url?: string | null
          monthly_revenue?: number | null
          name?: string
          phone?: string | null
          settings?: Json | null
          slug?: string
          status?: Database["public"]["Enums"]["business_status"]
          subscription_plan?: Database["public"]["Enums"]["subscription_plan"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "african_countries"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_alerts: {
        Row: {
          alert_type: string
          business_id: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          is_resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string | null
          title: string
        }
        Insert: {
          alert_type: string
          business_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          title: string
        }
        Update: {
          alert_type?: string
          business_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_alerts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_alerts_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      direct_deposit_accounts: {
        Row: {
          account_number_encrypted: string
          account_type: string
          allocation_percentage: number | null
          bank_name: string
          created_at: string | null
          employee_id: string
          id: string
          is_active: boolean | null
          is_primary: boolean | null
          routing_number: string
          updated_at: string | null
        }
        Insert: {
          account_number_encrypted: string
          account_type: string
          allocation_percentage?: number | null
          bank_name: string
          created_at?: string | null
          employee_id: string
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          routing_number: string
          updated_at?: string | null
        }
        Update: {
          account_number_encrypted?: string
          account_type?: string
          allocation_percentage?: number | null
          bank_name?: string
          created_at?: string | null
          employee_id?: string
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          routing_number?: string
          updated_at?: string | null
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
      employee_badges: {
        Row: {
          awarded_at: string | null
          awarded_by: string | null
          badge_id: string | null
          employee_id: string | null
          id: string
          reason: string | null
        }
        Insert: {
          awarded_at?: string | null
          awarded_by?: string | null
          badge_id?: string | null
          employee_id?: string | null
          id?: string
          reason?: string | null
        }
        Update: {
          awarded_at?: string | null
          awarded_by?: string | null
          badge_id?: string | null
          employee_id?: string | null
          id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_badges_awarded_by_fkey"
            columns: ["awarded_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "engagement_badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_badges_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_benefits: {
        Row: {
          benefits_plan_id: string
          created_at: string | null
          dependents_count: number | null
          employee_id: string
          enrollment_date: string
          id: string
          is_active: boolean | null
          monthly_deduction: number | null
          updated_at: string | null
        }
        Insert: {
          benefits_plan_id: string
          created_at?: string | null
          dependents_count?: number | null
          employee_id: string
          enrollment_date: string
          id?: string
          is_active?: boolean | null
          monthly_deduction?: number | null
          updated_at?: string | null
        }
        Update: {
          benefits_plan_id?: string
          created_at?: string | null
          dependents_count?: number | null
          employee_id?: string
          enrollment_date?: string
          id?: string
          is_active?: boolean | null
          monthly_deduction?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_benefits_benefits_plan_id_fkey"
            columns: ["benefits_plan_id"]
            isOneToOne: false
            referencedRelation: "benefits_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_benefits_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_onboarding: {
        Row: {
          checklist_id: string
          completed_at: string | null
          completed_items: Json | null
          completion_percentage: number | null
          employee_id: string
          id: string
          started_at: string | null
        }
        Insert: {
          checklist_id: string
          completed_at?: string | null
          completed_items?: Json | null
          completion_percentage?: number | null
          employee_id: string
          id?: string
          started_at?: string | null
        }
        Update: {
          checklist_id?: string
          completed_at?: string | null
          completed_items?: Json | null
          completion_percentage?: number | null
          employee_id?: string
          id?: string
          started_at?: string | null
        }
        Relationships: [
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
          business_id: string | null
          created_at: string | null
          from_employee_id: string | null
          id: string
          is_public: boolean | null
          message: string | null
          points_awarded: number | null
          recognition_type: Database["public"]["Enums"]["recognition_type"]
          title: string
          to_employee_id: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          from_employee_id?: string | null
          id?: string
          is_public?: boolean | null
          message?: string | null
          points_awarded?: number | null
          recognition_type: Database["public"]["Enums"]["recognition_type"]
          title: string
          to_employee_id?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          from_employee_id?: string | null
          id?: string
          is_public?: boolean | null
          message?: string | null
          points_awarded?: number | null
          recognition_type?: Database["public"]["Enums"]["recognition_type"]
          title?: string
          to_employee_id?: string | null
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
          business_id: string | null
          created_at: string | null
          created_by: string | null
          currency: string
          effective_from: string
          effective_to: string | null
          employee_id: string
          id: string
          is_active: boolean
          updated_at: string | null
        }
        Insert: {
          basic_salary?: number
          business_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string
          effective_from: string
          effective_to?: string | null
          employee_id: string
          id?: string
          is_active?: boolean
          updated_at?: string | null
        }
        Update: {
          basic_salary?: number
          business_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string
          effective_from?: string
          effective_to?: string | null
          employee_id?: string
          id?: string
          is_active?: boolean
          updated_at?: string | null
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
          business_id: string | null
          created_at: string
          department: string
          direct_deposit_enabled: boolean | null
          email: string
          employee_id_number: string | null
          first_name: string
          hire_date: string | null
          id: string
          last_name: string
          organization_id: string | null
          position: string
          profile_image_url: string | null
          status: string
          termination_date: string | null
          updated_at: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          department: string
          direct_deposit_enabled?: boolean | null
          email: string
          employee_id_number?: string | null
          first_name: string
          hire_date?: string | null
          id?: string
          last_name: string
          organization_id?: string | null
          position: string
          profile_image_url?: string | null
          status?: string
          termination_date?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string | null
          created_at?: string
          department?: string
          direct_deposit_enabled?: boolean | null
          email?: string
          employee_id_number?: string | null
          first_name?: string
          hire_date?: string | null
          id?: string
          last_name?: string
          organization_id?: string | null
          position?: string
          profile_image_url?: string | null
          status?: string
          termination_date?: string | null
          updated_at?: string
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
            foreignKeyName: "employees_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_badges: {
        Row: {
          badge_type: Database["public"]["Enums"]["badge_type"]
          business_id: string | null
          created_at: string | null
          criteria: Json | null
          description: string | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          name: string
          points_value: number | null
        }
        Insert: {
          badge_type: Database["public"]["Enums"]["badge_type"]
          business_id?: string | null
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          points_value?: number | null
        }
        Update: {
          badge_type?: Database["public"]["Enums"]["badge_type"]
          business_id?: string | null
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          points_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "engagement_badges_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_communities: {
        Row: {
          admin_id: string | null
          business_id: string | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_private: boolean | null
          member_count: number | null
          name: string
        }
        Insert: {
          admin_id?: string | null
          business_id?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          member_count?: number | null
          name: string
        }
        Update: {
          admin_id?: string | null
          business_id?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_private?: boolean | null
          member_count?: number | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_communities_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_communities_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_community_members: {
        Row: {
          community_id: string | null
          employee_id: string | null
          id: string
          joined_at: string | null
          role: string | null
        }
        Insert: {
          community_id?: string | null
          employee_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
        }
        Update: {
          community_id?: string | null
          employee_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "engagement_community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "engagement_communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_community_members_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_event_participants: {
        Row: {
          attended_at: string | null
          employee_id: string | null
          event_id: string | null
          id: string
          registered_at: string | null
          status: string | null
        }
        Insert: {
          attended_at?: string | null
          employee_id?: string | null
          event_id?: string | null
          id?: string
          registered_at?: string | null
          status?: string | null
        }
        Update: {
          attended_at?: string | null
          employee_id?: string | null
          event_id?: string | null
          id?: string
          registered_at?: string | null
          status?: string | null
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
          business_id: string | null
          created_at: string | null
          description: string | null
          end_datetime: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          is_published: boolean | null
          is_virtual: boolean | null
          location: string | null
          max_participants: number | null
          organizer_id: string | null
          registration_required: boolean | null
          start_datetime: string
          title: string
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          description?: string | null
          end_datetime?: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          is_published?: boolean | null
          is_virtual?: boolean | null
          location?: string | null
          max_participants?: number | null
          organizer_id?: string | null
          registration_required?: boolean | null
          start_datetime: string
          title: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          description?: string | null
          end_datetime?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          is_published?: boolean | null
          is_virtual?: boolean | null
          location?: string | null
          max_participants?: number | null
          organizer_id?: string | null
          registration_required?: boolean | null
          start_datetime?: string
          title?: string
          updated_at?: string | null
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_goals: {
        Row: {
          business_id: string | null
          created_at: string | null
          created_by: string | null
          current_value: number | null
          department: string | null
          goal_type: string
          id: string
          is_active: boolean | null
          target_date: string | null
          target_value: number
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          created_by?: string | null
          current_value?: number | null
          department?: string | null
          goal_type: string
          id?: string
          is_active?: boolean | null
          target_date?: string | null
          target_value: number
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          created_by?: string | null
          current_value?: number | null
          department?: string | null
          goal_type?: string
          id?: string
          is_active?: boolean | null
          target_date?: string | null
          target_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "engagement_goals_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_goals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_metrics: {
        Row: {
          business_id: string | null
          created_at: string | null
          employee_id: string | null
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
          period_end: string
          period_start: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value: number
          period_end: string
          period_start: string
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
          period_end?: string
          period_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_metrics_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_metrics_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_post_comments: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          parent_comment_id: string | null
          post_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          post_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          post_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "engagement_post_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_post_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "engagement_post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "engagement_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_post_reactions: {
        Row: {
          created_at: string | null
          employee_id: string | null
          id: string
          post_id: string | null
          reaction_type: string
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          post_id?: string | null
          reaction_type: string
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          post_id?: string | null
          reaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_post_reactions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "engagement_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_posts: {
        Row: {
          attachments: Json | null
          author_id: string | null
          business_id: string | null
          content: string
          created_at: string | null
          id: string
          is_pinned: boolean | null
          post_type: Database["public"]["Enums"]["post_type"]
          title: string | null
          updated_at: string | null
          visibility: Json | null
        }
        Insert: {
          attachments?: Json | null
          author_id?: string | null
          business_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          post_type: Database["public"]["Enums"]["post_type"]
          title?: string | null
          updated_at?: string | null
          visibility?: Json | null
        }
        Update: {
          attachments?: Json | null
          author_id?: string | null
          business_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          post_type?: Database["public"]["Enums"]["post_type"]
          title?: string | null
          updated_at?: string | null
          visibility?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "engagement_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_posts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_survey_responses: {
        Row: {
          completed_at: string | null
          created_at: string | null
          employee_id: string | null
          id: string
          responses: Json
          started_at: string | null
          status:
            | Database["public"]["Enums"]["engagement_response_status"]
            | null
          survey_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          responses?: Json
          started_at?: string | null
          status?:
            | Database["public"]["Enums"]["engagement_response_status"]
            | null
          survey_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          responses?: Json
          started_at?: string | null
          status?:
            | Database["public"]["Enums"]["engagement_response_status"]
            | null
          survey_id?: string | null
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
          business_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          is_anonymous: boolean | null
          questions: Json
          reminder_frequency: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["engagement_survey_status"] | null
          survey_type: Database["public"]["Enums"]["engagement_survey_type"]
          target_audience: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_anonymous?: boolean | null
          questions?: Json
          reminder_frequency?: number | null
          start_date?: string | null
          status?:
            | Database["public"]["Enums"]["engagement_survey_status"]
            | null
          survey_type: Database["public"]["Enums"]["engagement_survey_type"]
          target_audience?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_anonymous?: boolean | null
          questions?: Json
          reminder_frequency?: number | null
          start_date?: string | null
          status?:
            | Database["public"]["Enums"]["engagement_survey_status"]
            | null
          survey_type?: Database["public"]["Enums"]["engagement_survey_type"]
          target_audience?: Json | null
          title?: string
          updated_at?: string | null
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          active: boolean
          address: string | null
          business_id: string | null
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          radius_meters: number | null
          type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          address?: string | null
          business_id?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          radius_meters?: number | null
          type: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          address?: string | null
          business_id?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          radius_meters?: number | null
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
          business_id: string | null
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
          business_id?: string | null
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
          business_id?: string | null
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
          business_id: string | null
          checklist_items: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          template_name: string
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          checklist_items?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          template_name: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          checklist_items?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          template_name?: string
          updated_at?: string | null
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
      organization_settings: {
        Row: {
          break_tracking_enabled: boolean | null
          created_at: string | null
          id: string
          location_tracking_enabled: boolean | null
          organization_id: string
          overtime_enabled: boolean | null
          updated_at: string | null
          working_days_per_week: number | null
          working_hours_per_day: number | null
        }
        Insert: {
          break_tracking_enabled?: boolean | null
          created_at?: string | null
          id?: string
          location_tracking_enabled?: boolean | null
          organization_id: string
          overtime_enabled?: boolean | null
          updated_at?: string | null
          working_days_per_week?: number | null
          working_hours_per_day?: number | null
        }
        Update: {
          break_tracking_enabled?: boolean | null
          created_at?: string | null
          id?: string
          location_tracking_enabled?: boolean | null
          organization_id?: string
          overtime_enabled?: boolean | null
          updated_at?: string | null
          working_days_per_week?: number | null
          working_hours_per_day?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          brand_color: string | null
          contact_email: string
          contact_person_name: string
          contact_phone: string | null
          country_id: string
          created_at: string | null
          entity_type: Database["public"]["Enums"]["entity_type"]
          id: string
          industry_sector: string | null
          is_active: boolean | null
          logo_url: string | null
          name: string
          subscription_plan: string | null
          updated_at: string | null
        }
        Insert: {
          brand_color?: string | null
          contact_email: string
          contact_person_name: string
          contact_phone?: string | null
          country_id: string
          created_at?: string | null
          entity_type: Database["public"]["Enums"]["entity_type"]
          id?: string
          industry_sector?: string | null
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          subscription_plan?: string | null
          updated_at?: string | null
        }
        Update: {
          brand_color?: string | null
          contact_email?: string
          contact_person_name?: string
          contact_phone?: string | null
          country_id?: string
          created_at?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          industry_sector?: string | null
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          subscription_plan?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "african_countries"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_periods: {
        Row: {
          business_id: string | null
          created_at: string | null
          end_date: string
          id: string
          is_off_cycle: boolean | null
          pay_date: string
          period_name: string
          processed_at: string | null
          processed_by: string | null
          schedule_id: string | null
          start_date: string
          status: Database["public"]["Enums"]["payroll_status"]
          total_amount: number | null
          total_employees: number | null
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          is_off_cycle?: boolean | null
          pay_date: string
          period_name: string
          processed_at?: string | null
          processed_by?: string | null
          schedule_id?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["payroll_status"]
          total_amount?: number | null
          total_employees?: number | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          is_off_cycle?: boolean | null
          pay_date?: string
          period_name?: string
          processed_at?: string | null
          processed_by?: string | null
          schedule_id?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["payroll_status"]
          total_amount?: number | null
          total_employees?: number | null
          updated_at?: string | null
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
          allowance_id: string
          amount: number
          created_at: string | null
          id: string
          payroll_record_id: string
        }
        Insert: {
          allowance_id: string
          amount: number
          created_at?: string | null
          id?: string
          payroll_record_id: string
        }
        Update: {
          allowance_id?: string
          amount?: number
          created_at?: string | null
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
          created_at: string | null
          deduction_id: string | null
          deduction_name: string
          id: string
          payroll_record_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          deduction_id?: string | null
          deduction_name: string
          id?: string
          payroll_record_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
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
          actual_days_worked: number | null
          basic_salary: number
          created_at: string | null
          employee_id: string
          gross_salary: number
          id: string
          leave_days: number | null
          leave_deduction: number | null
          net_salary: number
          overtime_amount: number | null
          overtime_hours: number | null
          payment_date: string | null
          payment_reference: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          payroll_period_id: string
          salary_profile_id: string
          total_allowances: number | null
          total_deductions: number | null
          updated_at: string | null
          working_days: number | null
        }
        Insert: {
          actual_days_worked?: number | null
          basic_salary: number
          created_at?: string | null
          employee_id: string
          gross_salary: number
          id?: string
          leave_days?: number | null
          leave_deduction?: number | null
          net_salary: number
          overtime_amount?: number | null
          overtime_hours?: number | null
          payment_date?: string | null
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          payroll_period_id: string
          salary_profile_id: string
          total_allowances?: number | null
          total_deductions?: number | null
          updated_at?: string | null
          working_days?: number | null
        }
        Update: {
          actual_days_worked?: number | null
          basic_salary?: number
          created_at?: string | null
          employee_id?: string
          gross_salary?: number
          id?: string
          leave_days?: number | null
          leave_deduction?: number | null
          net_salary?: number
          overtime_amount?: number | null
          overtime_hours?: number | null
          payment_date?: string | null
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          payroll_period_id?: string
          salary_profile_id?: string
          total_allowances?: number | null
          total_deductions?: number | null
          updated_at?: string | null
          working_days?: number | null
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
          business_id: string | null
          created_at: string | null
          frequency: string
          id: string
          is_active: boolean | null
          is_autopilot_enabled: boolean | null
          next_run_date: string | null
          pay_day: number
          schedule_name: string
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          frequency: string
          id?: string
          is_active?: boolean | null
          is_autopilot_enabled?: boolean | null
          next_run_date?: string | null
          pay_day: number
          schedule_name: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          is_autopilot_enabled?: boolean | null
          next_run_date?: string | null
          pay_day?: number
          schedule_name?: string
          updated_at?: string | null
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
          generated_at: string | null
          id: string
          payroll_record_id: string
        }
        Insert: {
          downloaded_at?: string | null
          emailed_at?: string | null
          employee_id: string
          file_path?: string | null
          generated_at?: string | null
          id?: string
          payroll_record_id: string
        }
        Update: {
          downloaded_at?: string | null
          emailed_at?: string | null
          employee_id?: string
          file_path?: string | null
          generated_at?: string | null
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
            isOneToOne: false
            referencedRelation: "payroll_records"
            referencedColumns: ["id"]
          },
        ]
      }
      project_templates: {
        Row: {
          created_at: string
          department: string
          description: string | null
          id: string
          name: string
          template_tasks: Json | null
        }
        Insert: {
          created_at?: string
          department: string
          description?: string | null
          id?: string
          name: string
          template_tasks?: Json | null
        }
        Update: {
          created_at?: string
          department?: string
          description?: string | null
          id?: string
          name?: string
          template_tasks?: Json | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          assigned_to: string[] | null
          business_id: string | null
          created_at: string
          created_by: string | null
          department: string
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          name: string
          organization_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string[] | null
          business_id?: string | null
          created_at?: string
          created_by?: string | null
          department: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          name: string
          organization_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string[] | null
          business_id?: string | null
          created_at?: string
          created_by?: string | null
          department?: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          name?: string
          organization_id?: string | null
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
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      regularization_requests: {
        Row: {
          attendance_id: string | null
          business_id: string | null
          created_at: string
          employee_id: string
          id: string
          reason: string
          request_type: string
          requested_check_in: string | null
          requested_check_out: string | null
          requested_date: string
          reviewed_at: string | null
          reviewer_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          attendance_id?: string | null
          business_id?: string | null
          created_at?: string
          employee_id: string
          id?: string
          reason: string
          request_type: string
          requested_check_in?: string | null
          requested_check_out?: string | null
          requested_date: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          attendance_id?: string | null
          business_id?: string | null
          created_at?: string
          employee_id?: string
          id?: string
          reason?: string
          request_type?: string
          requested_check_in?: string | null
          requested_check_out?: string | null
          requested_date?: string
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
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_allowances: {
        Row: {
          allowance_type: Database["public"]["Enums"]["allowance_type"]
          amount: number
          created_at: string | null
          id: string
          is_active: boolean
          is_taxable: boolean
          name: string
          salary_profile_id: string
        }
        Insert: {
          allowance_type: Database["public"]["Enums"]["allowance_type"]
          amount?: number
          created_at?: string | null
          id?: string
          is_active?: boolean
          is_taxable?: boolean
          name: string
          salary_profile_id: string
        }
        Update: {
          allowance_type?: Database["public"]["Enums"]["allowance_type"]
          amount?: number
          created_at?: string | null
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
          created_at: string | null
          deduction_type: Database["public"]["Enums"]["deduction_type"]
          id: string
          is_active: boolean
          is_mandatory: boolean
          name: string
          percentage: number | null
          salary_profile_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          deduction_type: Database["public"]["Enums"]["deduction_type"]
          id?: string
          is_active?: boolean
          is_mandatory?: boolean
          name: string
          percentage?: number | null
          salary_profile_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          deduction_type?: Database["public"]["Enums"]["deduction_type"]
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
          created_at: string | null
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          record_id: string
          table_name: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          record_id: string
          table_name: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string
          table_name?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      shifts: {
        Row: {
          break_duration_minutes: number
          business_id: string | null
          created_at: string
          department: string | null
          end_time: string
          id: string
          name: string
          start_time: string
          updated_at: string
        }
        Insert: {
          break_duration_minutes?: number
          business_id?: string | null
          created_at?: string
          department?: string | null
          end_time: string
          id?: string
          name: string
          start_time: string
          updated_at?: string
        }
        Update: {
          break_duration_minutes?: number
          business_id?: string | null
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
          created_at: string | null
          details: Json | null
          id: string
          super_admin_id: string
        }
        Insert: {
          action: string
          business_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          super_admin_id: string
        }
        Update: {
          action?: string
          business_id?: string | null
          created_at?: string | null
          details?: Json | null
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
        ]
      }
      super_admin_dashboard_metrics: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          metric_date: string
          metric_type: string
          metric_value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          metric_date?: string
          metric_type: string
          metric_value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          metric_date?: string
          metric_type?: string
          metric_value?: number
        }
        Relationships: []
      }
      system_integrations: {
        Row: {
          api_credentials_encrypted: string | null
          business_id: string | null
          created_at: string | null
          id: string
          integration_type: string
          is_active: boolean | null
          last_sync_at: string | null
          provider_name: string
          sync_frequency: string | null
          updated_at: string | null
        }
        Insert: {
          api_credentials_encrypted?: string | null
          business_id?: string | null
          created_at?: string | null
          id?: string
          integration_type: string
          is_active?: boolean | null
          last_sync_at?: string | null
          provider_name: string
          sync_frequency?: string | null
          updated_at?: string | null
        }
        Update: {
          api_credentials_encrypted?: string | null
          business_id?: string | null
          created_at?: string | null
          id?: string
          integration_type?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          provider_name?: string
          sync_frequency?: string | null
          updated_at?: string | null
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
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          actual_hours: number | null
          assigned_to: string | null
          created_at: string
          description: string | null
          due_date: string | null
          estimated_hours: number
          id: string
          name: string
          priority: string | null
          project_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          actual_hours?: number | null
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number
          id?: string
          name: string
          priority?: string | null
          project_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          actual_hours?: number | null
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number
          id?: string
          name?: string
          priority?: string | null
          project_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
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
          generated_at: string | null
          id: string
          tax_year: number
        }
        Insert: {
          document_type: string
          downloaded_at?: string | null
          employee_id: string
          file_path?: string | null
          generated_at?: string | null
          id?: string
          tax_year: number
        }
        Update: {
          document_type?: string
          downloaded_at?: string | null
          employee_id?: string
          file_path?: string | null
          generated_at?: string | null
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
          business_id: string | null
          created_at: string
          date: string
          description: string | null
          duration_seconds: number | null
          end_time: string | null
          id: string
          is_billable: boolean | null
          organization_id: string | null
          project_id: string | null
          start_time: string | null
          status: string | null
          task_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          duration_seconds?: number | null
          end_time?: string | null
          id?: string
          is_billable?: boolean | null
          organization_id?: string | null
          project_id?: string | null
          start_time?: string | null
          status?: string | null
          task_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          duration_seconds?: number | null
          end_time?: string | null
          id?: string
          is_billable?: boolean | null
          organization_id?: string | null
          project_id?: string | null
          start_time?: string | null
          status?: string | null
          task_id?: string | null
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
            foreignKeyName: "time_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          first_name: string | null
          id: string
          is_super_admin: boolean | null
          last_name: string | null
          phone: string | null
          role: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          is_super_admin?: boolean | null
          last_name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          is_super_admin?: boolean | null
          last_name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          id: string
          settings_data: Json
          settings_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          settings_data?: Json
          settings_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          settings_data?: Json
          settings_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_total_hours: {
        Args: {
          check_in: string
          check_out: string
          break_start: string
          break_end: string
        }
        Returns: number
      }
      get_all_platform_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          email: string
          role: string
          status: string
          avatar: string
          business: string
          businessId: string
          lastLogin: string
          createdAt: string
          permissions: Json
          loginCount: number
          country: string
        }[]
      }
      get_business_growth_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          month: string
          businesses: number
          users: number
        }[]
      }
      get_current_business_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_recent_super_admin_activities: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          type: string
          description: string
          activity_timestamp: string
          status: string
        }[]
      }
      get_revenue_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          month: string
          revenue: number
          subscriptions: number
        }[]
      }
      get_super_admin_dashboard_metrics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
    }
    Enums: {
      allowance_type:
        | "housing"
        | "transport"
        | "medical"
        | "communication"
        | "meal"
        | "other"
      badge_type:
        | "achievement"
        | "milestone"
        | "skill"
        | "leadership"
        | "collaboration"
        | "innovation"
      business_status: "active" | "suspended" | "trial" | "pending" | "inactive"
      deduction_type:
        | "tax"
        | "pension"
        | "insurance"
        | "loan"
        | "advance"
        | "other"
      engagement_response_status:
        | "pending"
        | "in_progress"
        | "completed"
        | "expired"
      engagement_survey_status:
        | "draft"
        | "active"
        | "paused"
        | "completed"
        | "archived"
      engagement_survey_type:
        | "pulse"
        | "onboarding"
        | "offboarding"
        | "annual"
        | "custom"
      entity_type: "company" | "organization" | "institution"
      event_type: "social" | "training" | "celebration" | "meeting" | "workshop"
      payment_status: "pending" | "processed" | "failed"
      payroll_status: "not_started" | "in_progress" | "completed" | "cancelled"
      post_type: "announcement" | "celebration" | "news" | "poll" | "story"
      recognition_type:
        | "peer_to_peer"
        | "manager_to_employee"
        | "team_recognition"
        | "milestone"
      subscription_plan:
        | "trial"
        | "basic"
        | "standard"
        | "premium"
        | "enterprise"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      allowance_type: [
        "housing",
        "transport",
        "medical",
        "communication",
        "meal",
        "other",
      ],
      badge_type: [
        "achievement",
        "milestone",
        "skill",
        "leadership",
        "collaboration",
        "innovation",
      ],
      business_status: ["active", "suspended", "trial", "pending", "inactive"],
      deduction_type: [
        "tax",
        "pension",
        "insurance",
        "loan",
        "advance",
        "other",
      ],
      engagement_response_status: [
        "pending",
        "in_progress",
        "completed",
        "expired",
      ],
      engagement_survey_status: [
        "draft",
        "active",
        "paused",
        "completed",
        "archived",
      ],
      engagement_survey_type: [
        "pulse",
        "onboarding",
        "offboarding",
        "annual",
        "custom",
      ],
      entity_type: ["company", "organization", "institution"],
      event_type: ["social", "training", "celebration", "meeting", "workshop"],
      payment_status: ["pending", "processed", "failed"],
      payroll_status: ["not_started", "in_progress", "completed", "cancelled"],
      post_type: ["announcement", "celebration", "news", "poll", "story"],
      recognition_type: [
        "peer_to_peer",
        "manager_to_employee",
        "team_recognition",
        "milestone",
      ],
      subscription_plan: [
        "trial",
        "basic",
        "standard",
        "premium",
        "enterprise",
      ],
    },
  },
} as const
