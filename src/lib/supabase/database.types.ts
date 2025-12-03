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
      coupons: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string | null;
          valid_from: string;
          valid_to: string;
          is_active: boolean;
          usage_limit: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          image_url?: string | null;
          valid_from: string;
          valid_to: string;
          is_active?: boolean;
          usage_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          image_url?: string | null;
          valid_from?: string;
          valid_to?: string;
          is_active?: boolean;
          usage_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          last_login_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          last_login_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          last_login_at?: string;
        };
        Relationships: [];
      };
      user_coupons: {
        Row: {
          id: string;
          user_id: string;
          coupon_id: string;
          used_at: string | null;
          status: 'used' | 'unused';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          coupon_id: string;
          used_at?: string | null;
          status?: 'used' | 'unused';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          coupon_id?: string;
          used_at?: string | null;
          status?: 'used' | 'unused';
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_coupons_coupon_id_fkey';
            columns: ['coupon_id'];
            isOneToOne: false;
            referencedRelation: 'coupons';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_coupons_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
