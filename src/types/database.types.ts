export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string;
          actor_id: string | null;
          created_at: string | null;
          entity_id: string;
          entity_type: string;
          id: string;
          ip_address: string | null;
          metadata: Json | null;
          new_state: Json | null;
          previous_state: Json | null;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          created_at?: string | null;
          entity_id: string;
          entity_type: string;
          id?: string;
          ip_address?: string | null;
          metadata?: Json | null;
          new_state?: Json | null;
          previous_state?: Json | null;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          created_at?: string | null;
          entity_id?: string;
          entity_type?: string;
          id?: string;
          ip_address?: string | null;
          metadata?: Json | null;
          new_state?: Json | null;
          previous_state?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      brand_profile: {
        Row: {
          billing_email: string | null;
          company_name: string;
          created_at: string | null;
          id: string;
          industry: string | null;
          kyb_status: Database["public"]["Enums"]["kyb_status"] | null;
          stripe_customer_id: string | null;
          updated_at: string | null;
          user_id: string;
          website: string | null;
        };
        Insert: {
          billing_email?: string | null;
          company_name: string;
          created_at?: string | null;
          id?: string;
          industry?: string | null;
          kyb_status?: Database["public"]["Enums"]["kyb_status"] | null;
          stripe_customer_id?: string | null;
          updated_at?: string | null;
          user_id: string;
          website?: string | null;
        };
        Update: {
          billing_email?: string | null;
          company_name?: string;
          created_at?: string | null;
          id?: string;
          industry?: string | null;
          kyb_status?: Database["public"]["Enums"]["kyb_status"] | null;
          stripe_customer_id?: string | null;
          updated_at?: string | null;
          user_id?: string;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "brand_profile_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      campaign: {
        Row: {
          attribution_window_days: number | null;
          brand_id: string;
          brief: string | null;
          budget: number;
          budget_spent_cents: number | null;
          cpm_rate_cents: number | null;
          created_at: string | null;
          end_date: string | null;
          escrow_status: Database["public"]["Enums"]["escrow_status"] | null;
          guidelines: Json | null;
          id: string;
          max_clippers: number | null;
          niche: string | null;
          payout_amount_cents: number | null;
          payout_type: Database["public"]["Enums"]["payout_type"] | null;
          start_date: string | null;
          status: Database["public"]["Enums"]["campaign_status"] | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          attribution_window_days?: number | null;
          brand_id: string;
          brief?: string | null;
          budget: number;
          budget_spent_cents?: number | null;
          cpm_rate_cents?: number | null;
          created_at?: string | null;
          end_date?: string | null;
          escrow_status?: Database["public"]["Enums"]["escrow_status"] | null;
          guidelines?: Json | null;
          id?: string;
          max_clippers?: number | null;
          niche?: string | null;
          payout_amount_cents?: number | null;
          payout_type?: Database["public"]["Enums"]["payout_type"] | null;
          start_date?: string | null;
          status?: Database["public"]["Enums"]["campaign_status"] | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          attribution_window_days?: number | null;
          brand_id?: string;
          brief?: string | null;
          budget?: number;
          budget_spent_cents?: number | null;
          cpm_rate_cents?: number | null;
          created_at?: string | null;
          end_date?: string | null;
          escrow_status?: Database["public"]["Enums"]["escrow_status"] | null;
          guidelines?: Json | null;
          id?: string;
          max_clippers?: number | null;
          niche?: string | null;
          payout_amount_cents?: number | null;
          payout_type?: Database["public"]["Enums"]["payout_type"] | null;
          start_date?: string | null;
          status?: Database["public"]["Enums"]["campaign_status"] | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "campaign_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      campaign_asset: {
        Row: {
          campaign_id: string | null;
          created_at: string | null;
          file_name: string | null;
          file_size_bytes: number | null;
          file_type: string | null;
          id: string;
          original_url: string;
          status: Database["public"]["Enums"]["asset_status"] | null;
          watermarked_url: string | null;
        };
        Insert: {
          campaign_id?: string | null;
          created_at?: string | null;
          file_name?: string | null;
          file_size_bytes?: number | null;
          file_type?: string | null;
          id?: string;
          original_url: string;
          status?: Database["public"]["Enums"]["asset_status"] | null;
          watermarked_url?: string | null;
        };
        Update: {
          campaign_id?: string | null;
          created_at?: string | null;
          file_name?: string | null;
          file_size_bytes?: number | null;
          file_type?: string | null;
          id?: string;
          original_url?: string;
          status?: Database["public"]["Enums"]["asset_status"] | null;
          watermarked_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "campaign_asset_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaign";
            referencedColumns: ["id"];
          },
        ];
      };
      claim: {
        Row: {
          campaign_id: string | null;
          claimed_at: string | null;
          clipper_id: string | null;
          expires_at: string;
          id: string;
          status: Database["public"]["Enums"]["claim_status"] | null;
          submitted_at: string | null;
        };
        Insert: {
          campaign_id?: string | null;
          claimed_at?: string | null;
          clipper_id?: string | null;
          expires_at: string;
          id?: string;
          status?: Database["public"]["Enums"]["claim_status"] | null;
          submitted_at?: string | null;
        };
        Update: {
          campaign_id?: string | null;
          claimed_at?: string | null;
          clipper_id?: string | null;
          expires_at?: string;
          id?: string;
          status?: Database["public"]["Enums"]["claim_status"] | null;
          submitted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "claim_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaign";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "claim_clipper_id_fkey";
            columns: ["clipper_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      clipper_profile: {
        Row: {
          bio: string | null;
          created_at: string | null;
          follower_count: number | null;
          id: string;
          ig_account_type: string | null;
          ig_handle: string | null;
          ig_token_encrypted: string | null;
          ig_token_expires_at: string | null;
          kyc_status: Database["public"]["Enums"]["kyc_status"] | null;
          niches: string[] | null;
          stripe_connect_id: string | null;
          tax_form_status: Database["public"]["Enums"]["tax_form_status"] | null;
          updated_at: string | null;
          user_id: string;
          verified: boolean | null;
        };
        Insert: {
          bio?: string | null;
          created_at?: string | null;
          follower_count?: number | null;
          id?: string;
          ig_account_type?: string | null;
          ig_handle?: string | null;
          ig_token_encrypted?: string | null;
          ig_token_expires_at?: string | null;
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null;
          niches?: string[] | null;
          stripe_connect_id?: string | null;
          tax_form_status?: Database["public"]["Enums"]["tax_form_status"] | null;
          updated_at?: string | null;
          user_id: string;
          verified?: boolean | null;
        };
        Update: {
          bio?: string | null;
          created_at?: string | null;
          follower_count?: number | null;
          id?: string;
          ig_account_type?: string | null;
          ig_handle?: string | null;
          ig_token_encrypted?: string | null;
          ig_token_expires_at?: string | null;
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null;
          niches?: string[] | null;
          stripe_connect_id?: string | null;
          tax_form_status?: Database["public"]["Enums"]["tax_form_status"] | null;
          updated_at?: string | null;
          user_id?: string;
          verified?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "clipper_profile_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      payout: {
        Row: {
          amount_cents: number;
          campaign_id: string;
          clipper_id: string;
          commission_cents: number;
          created_at: string | null;
          id: string;
          net_amount_cents: number;
          paid_at: string | null;
          status: Database["public"]["Enums"]["payout_status"] | null;
          stripe_transfer_id: string | null;
          submission_id: string | null;
        };
        Insert: {
          amount_cents: number;
          campaign_id: string;
          clipper_id: string;
          commission_cents: number;
          created_at?: string | null;
          id?: string;
          net_amount_cents: number;
          paid_at?: string | null;
          status?: Database["public"]["Enums"]["payout_status"] | null;
          stripe_transfer_id?: string | null;
          submission_id?: string | null;
        };
        Update: {
          amount_cents?: number;
          campaign_id?: string;
          clipper_id?: string;
          commission_cents?: number;
          created_at?: string | null;
          id?: string;
          net_amount_cents?: number;
          paid_at?: string | null;
          status?: Database["public"]["Enums"]["payout_status"] | null;
          stripe_transfer_id?: string | null;
          submission_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "payout_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaign";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payout_clipper_id_fkey";
            columns: ["clipper_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payout_submission_id_fkey";
            columns: ["submission_id"];
            isOneToOne: false;
            referencedRelation: "submission";
            referencedColumns: ["id"];
          },
        ];
      };
      submission: {
        Row: {
          caption: string | null;
          claim_id: string | null;
          content_url: string | null;
          created_at: string | null;
          id: string;
          paid_partnership_confirmed: boolean | null;
          review_comments: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          status: Database["public"]["Enums"]["submission_status"] | null;
          thumbnail_url: string | null;
          updated_at: string | null;
        };
        Insert: {
          caption?: string | null;
          claim_id?: string | null;
          content_url?: string | null;
          created_at?: string | null;
          id?: string;
          paid_partnership_confirmed?: boolean | null;
          review_comments?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: Database["public"]["Enums"]["submission_status"] | null;
          thumbnail_url?: string | null;
          updated_at?: string | null;
        };
        Update: {
          caption?: string | null;
          claim_id?: string | null;
          content_url?: string | null;
          created_at?: string | null;
          id?: string;
          paid_partnership_confirmed?: boolean | null;
          review_comments?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          status?: Database["public"]["Enums"]["submission_status"] | null;
          thumbnail_url?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "submission_claim_id_fkey";
            columns: ["claim_id"];
            isOneToOne: true;
            referencedRelation: "claim";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "submission_reviewed_by_fkey";
            columns: ["reviewed_by"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      tracked_link: {
        Row: {
          id: string;
          live_url: string;
          platform: string | null;
          post_id: string | null;
          status: Database["public"]["Enums"]["tracked_link_status"] | null;
          submission_id: string | null;
          tracking_ends_at: string | null;
          tracking_started_at: string | null;
          verified_at: string | null;
        };
        Insert: {
          id?: string;
          live_url: string;
          platform?: string | null;
          post_id?: string | null;
          status?: Database["public"]["Enums"]["tracked_link_status"] | null;
          submission_id?: string | null;
          tracking_ends_at?: string | null;
          tracking_started_at?: string | null;
          verified_at?: string | null;
        };
        Update: {
          id?: string;
          live_url?: string;
          platform?: string | null;
          post_id?: string | null;
          status?: Database["public"]["Enums"]["tracked_link_status"] | null;
          submission_id?: string | null;
          tracking_ends_at?: string | null;
          tracking_started_at?: string | null;
          verified_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tracked_link_submission_id_fkey";
            columns: ["submission_id"];
            isOneToOne: false;
            referencedRelation: "submission";
            referencedColumns: ["id"];
          },
        ];
      };
      tracking_snapshot: {
        Row: {
          captured_at: string | null;
          comments: number | null;
          id: string;
          likes: number | null;
          shares: number | null;
          tracked_link_id: string | null;
          views: number | null;
        };
        Insert: {
          captured_at?: string | null;
          comments?: number | null;
          id?: string;
          likes?: number | null;
          shares?: number | null;
          tracked_link_id?: string | null;
          views?: number | null;
        };
        Update: {
          captured_at?: string | null;
          comments?: number | null;
          id?: string;
          likes?: number | null;
          shares?: number | null;
          tracked_link_id?: string | null;
          views?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "tracking_snapshot_tracked_link_id_fkey";
            columns: ["tracked_link_id"];
            isOneToOne: false;
            referencedRelation: "tracked_link";
            referencedColumns: ["id"];
          },
        ];
      };
      transaction: {
        Row: {
          amount_cents: number;
          campaign_id: string | null;
          clipper_id: string | null;
          created_at: string | null;
          id: string;
          metadata: Json | null;
          status: Database["public"]["Enums"]["transaction_status"] | null;
          stripe_payment_intent_id: string | null;
          stripe_transfer_id: string | null;
          type: Database["public"]["Enums"]["transaction_type"];
        };
        Insert: {
          amount_cents: number;
          campaign_id?: string | null;
          clipper_id?: string | null;
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          status?: Database["public"]["Enums"]["transaction_status"] | null;
          stripe_payment_intent_id?: string | null;
          stripe_transfer_id?: string | null;
          type: Database["public"]["Enums"]["transaction_type"];
        };
        Update: {
          amount_cents?: number;
          campaign_id?: string | null;
          clipper_id?: string | null;
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          status?: Database["public"]["Enums"]["transaction_status"] | null;
          stripe_payment_intent_id?: string | null;
          stripe_transfer_id?: string | null;
          type?: Database["public"]["Enums"]["transaction_type"];
        };
        Relationships: [
          {
            foreignKeyName: "transaction_campaign_id_fkey";
            columns: ["campaign_id"];
            isOneToOne: false;
            referencedRelation: "campaign";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transaction_clipper_id_fkey";
            columns: ["clipper_id"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          },
        ];
      };
      user: {
        Row: {
          avatar_url: string | null;
          consent_accepted_at: string | null;
          created_at: string | null;
          deletion_requested_at: string | null;
          email: string;
          email_verified: boolean | null;
          id: string;
          name: string;
          password_hash: string | null;
          role: Database["public"]["Enums"]["role"];
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          consent_accepted_at?: string | null;
          created_at?: string | null;
          deletion_requested_at?: string | null;
          email: string;
          email_verified?: boolean | null;
          id?: string;
          name: string;
          password_hash?: string | null;
          role: Database["public"]["Enums"]["role"];
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          consent_accepted_at?: string | null;
          created_at?: string | null;
          deletion_requested_at?: string | null;
          email?: string;
          email_verified?: boolean | null;
          id?: string;
          name?: string;
          password_hash?: string | null;
          role?: Database["public"]["Enums"]["role"];
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      asset_status: "UPLOADING" | "PROCESSING" | "READY" | "FAILED";
      campaign_status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";
      claim_status:
        | "CLAIMED"
        | "EXPIRED"
        | "SUBMITTED"
        | "COMPLETED"
        | "CANCELLED";
      escrow_status:
        | "UNFUNDED"
        | "FUNDED"
        | "PARTIALLY_RELEASED"
        | "FULLY_RELEASED"
        | "REFUNDED";
      kyb_status: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
      kyc_status: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
      payout_status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
      payout_type: "PER_POST" | "CPM" | "HYBRID";
      role: "BRAND" | "CLIPPER" | "ADMIN";
      submission_status:
        | "PENDING"
        | "IN_REVIEW"
        | "APPROVED"
        | "REJECTED"
        | "PUBLISHED"
        | "PAID";
      tax_form_status: "NOT_SUBMITTED" | "PENDING" | "APPROVED";
      tracked_link_status:
        | "PENDING_VERIFICATION"
        | "VERIFIED"
        | "TRACKING"
        | "COMPLETED"
        | "FAILED";
      transaction_status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
      transaction_type: "DEPOSIT" | "HOLD" | "RELEASE" | "COMMISSION" | "REFUND";
    };
  };
};
