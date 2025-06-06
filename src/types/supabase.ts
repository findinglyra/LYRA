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
      interest_form: {
        Row: {
          created_at: string | null
          email: string | null
          expectations: string | null
          hear_about: string | null
          id: string
          match_importance: number | null
          music_astro_balance: number | null
          music_service: string | null
          name: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          expectations?: string | null
          hear_about?: string | null
          id?: string
          match_importance?: number | null
          music_astro_balance?: number | null
          music_service?: string | null
          name?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          expectations?: string | null
          hear_about?: string | null
          id?: string
          match_importance?: number | null
          music_astro_balance?: number | null
          music_service?: string | null
          name?: string | null
        }
        Relationships: []
      }
      music_preferences: {
        Row: {
          artists: string[] | null
          best_concert_experience: string | null
          concert_frequency: string | null
          created_at: string | null
          creates_playlists: boolean | null
          danceability: number | null
          discovery_methods: string[] | null
          energy_level: number | null
          genres: string[] | null
          id: string
          listening_frequency: string | null
          listening_moods: string[] | null
          musical_milestones: string | null
          playlist_themes: string[] | null
          songs: string[] | null
          tempo_preference: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          artists?: string[] | null
          best_concert_experience?: string | null
          concert_frequency?: string | null
          created_at?: string | null
          creates_playlists?: boolean | null
          danceability?: number | null
          discovery_methods?: string[] | null
          energy_level?: number | null
          genres?: string[] | null
          id?: string
          listening_frequency?: string | null
          listening_moods?: string[] | null
          musical_milestones?: string | null
          playlist_themes?: string[] | null
          songs?: string[] | null
          tempo_preference?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          artists?: string[] | null
          best_concert_experience?: string | null
          concert_frequency?: string | null
          created_at?: string | null
          creates_playlists?: boolean | null
          danceability?: number | null
          discovery_methods?: string[] | null
          energy_level?: number | null
          genres?: string[] | null
          id?: string
          listening_frequency?: string | null
          listening_moods?: string[] | null
          musical_milestones?: string | null
          playlist_themes?: string[] | null
          songs?: string[] | null
          tempo_preference?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "music_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          created_at: string | null
          full_name: string | null
          id: string
          setup_complete: boolean | null
          social_links: Json | null
          updated_at: string | null
          username: string | null
          zodiac_sign: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          setup_complete?: boolean | null
          social_links?: Json | null
          updated_at?: string | null
          username?: string | null
          zodiac_sign?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          setup_complete?: boolean | null
          social_links?: Json | null
          updated_at?: string | null
          username?: string | null
          zodiac_sign?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
