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
      customers: {
        Row: {
          address: string | null
          created_at: string | null
          description: string | null
          email: string | null
          fax: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          fax?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          fax?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      expense_limits: {
        Row: {
          amount: number
          category: string | null
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          created_by: string | null
          date: string | null
          description: string
          id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          description: string
          id?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          description?: string
          id?: string
        }
        Relationships: []
      }
      inventory_thresholds: {
        Row: {
          id: string
          red_threshold: number
          updated_at: string | null
          yellow_threshold: number
        }
        Insert: {
          id?: string
          red_threshold?: number
          updated_at?: string | null
          yellow_threshold?: number
        }
        Update: {
          id?: string
          red_threshold?: number
          updated_at?: string | null
          yellow_threshold?: number
        }
        Relationships: []
      }
      items: {
        Row: {
          barcode: string | null
          cost_price: number
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          items_per_package: number
          name: string
          price: number
          quantity: number
          red_threshold: number | null
          updated_at: string | null
          vendor: string | null
          weight: number | null
          weight_unit: string | null
          yellow_threshold: number | null
        }
        Insert: {
          barcode?: string | null
          cost_price: number
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          items_per_package?: number
          name: string
          price: number
          quantity?: number
          red_threshold?: number | null
          updated_at?: string | null
          vendor?: string | null
          weight?: number | null
          weight_unit?: string | null
          yellow_threshold?: number | null
        }
        Update: {
          barcode?: string | null
          cost_price?: number
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          items_per_package?: number
          name?: string
          price?: number
          quantity?: number
          red_threshold?: number | null
          updated_at?: string | null
          vendor?: string | null
          weight?: number | null
          weight_unit?: string | null
          yellow_threshold?: number | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          item_id: string | null
          item_name: string | null
          item_number: string | null
          order_id: string | null
          quantity: number
          quantity_required: number | null
          unit_price: number
          weight_per_item: number | null
          weight_unit: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          item_id?: string | null
          item_name?: string | null
          item_number?: string | null
          order_id?: string | null
          quantity: number
          quantity_required?: number | null
          unit_price: number
          weight_per_item?: number | null
          weight_unit?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          item_id?: string | null
          item_name?: string | null
          item_number?: string | null
          order_id?: string | null
          quantity?: number
          quantity_required?: number | null
          unit_price?: number
          weight_per_item?: number | null
          weight_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount_paid: number | null
          comments: string | null
          created_at: string | null
          created_by: string | null
          credit_due_date: string | null
          customer_address: string
          customer_name: string
          customer_number: string | null
          customer_phone: string
          id: string
          invoice_number: string | null
          location: string | null
          payment_method: string
          payment_status: string | null
          salesperson: string | null
          ship_via: string | null
          shipping_address: string | null
          shipping_city: string | null
          shipping_country: string | null
          shipping_name: string | null
          shipping_phone: string | null
          status: string
          tax_number: string | null
          terms: string | null
          total_amount: number
        }
        Insert: {
          amount_paid?: number | null
          comments?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_due_date?: string | null
          customer_address: string
          customer_name: string
          customer_number?: string | null
          customer_phone: string
          id?: string
          invoice_number?: string | null
          location?: string | null
          payment_method?: string
          payment_status?: string | null
          salesperson?: string | null
          ship_via?: string | null
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_name?: string | null
          shipping_phone?: string | null
          status?: string
          tax_number?: string | null
          terms?: string | null
          total_amount: number
        }
        Update: {
          amount_paid?: number | null
          comments?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_due_date?: string | null
          customer_address?: string
          customer_name?: string
          customer_number?: string | null
          customer_phone?: string
          id?: string
          invoice_number?: string | null
          location?: string | null
          payment_method?: string
          payment_status?: string | null
          salesperson?: string | null
          ship_via?: string | null
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_name?: string | null
          shipping_phone?: string | null
          status?: string
          tax_number?: string | null
          terms?: string | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          backup_codes: string[] | null
          created_at: string | null
          email_code: string | null
          email_code_expires_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          two_factor_confirmed: boolean | null
          two_factor_secret: string | null
          two_factor_status:
            | Database["public"]["Enums"]["two_factor_status"]
            | null
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string | null
          email_code?: string | null
          email_code_expires_at?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          two_factor_confirmed?: boolean | null
          two_factor_secret?: string | null
          two_factor_status?:
            | Database["public"]["Enums"]["two_factor_status"]
            | null
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string | null
          email_code?: string | null
          email_code_expires_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          two_factor_confirmed?: boolean | null
          two_factor_secret?: string | null
          two_factor_status?:
            | Database["public"]["Enums"]["two_factor_status"]
            | null
        }
        Relationships: []
      }
      total_expense_limit: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string | null
          email: string | null
          fax: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          fax?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          fax?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_profit_margin: {
        Args: {
          selling_price: number
          cost_price: number
        }
        Returns: number
      }
      generate_backup_codes: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_item_frequency_status: {
        Args: {
          days_window: number
          frequency_threshold: number
        }
        Returns: {
          item_id: string
          item_name: string
          total_quantity: number
          last_sold: string
          is_frequent: boolean
          average_daily_sales: number
        }[]
      }
      get_item_sales_frequency: {
        Args: {
          days_window: number
        }
        Returns: {
          item_id: string
          item_name: string
          total_quantity: number
          last_sold: string
        }[]
      }
      get_revenue_summary: {
        Args: {
          start_date: string
          end_date: string
          period_type: string
        }
        Returns: {
          period_start: string
          period_end: string
          total_revenue: number
          total_cost: number
          net_profit: number
        }[]
      }
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
    }
    Enums: {
      two_factor_status: "disabled" | "enabled" | "pending" | "email"
      user_role: "admin" | "user" | "customer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
