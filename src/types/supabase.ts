export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      music_preferences: {
        Row: {
          id: string
          user_id: string
          genres: string[] | null
          artists: string[] | null
          songs: string[] | null
          listening_frequency: string | null
          discovery_methods: string[] | null
          listening_moods: string[] | null
          creates_playlists: boolean | null
          playlist_themes: string[] | null
          concert_frequency: string | null
          best_concert_experience: string | null
          musical_milestones: string | null
          tempo_preference: number | null
          energy_level: number | null
          danceability: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          genres?: string[] | null
          artists?: string[] | null
          songs?: string[] | null
          listening_frequency?: string | null
          discovery_methods?: string[] | null
          listening_moods?: string[] | null
          creates_playlists?: boolean | null
          playlist_themes?: string[] | null
          concert_frequency?: string | null
          best_concert_experience?: string | null
          musical_milestones?: string | null
          tempo_preference?: number | null
          energy_level?: number | null
          danceability?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          genres?: string[] | null
          artists?: string[] | null
          songs?: string[] | null
          listening_frequency?: string | null
          discovery_methods?: string[] | null
          listening_moods?: string[] | null
          creates_playlists?: boolean | null
          playlist_themes?: string[] | null
          concert_frequency?: string | null
          best_concert_experience?: string | null
          musical_milestones?: string | null
          tempo_preference?: number | null
          energy_level?: number | null
          danceability?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "music_preferences_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      interest_form: {
        Row: {
          id: string
          email: string
          name: string
          music_service: string | null
          music_astro_balance: number | null
          match_importance: number | null
          expectations: string | null
          hear_about: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          music_service?: string | null
          music_astro_balance?: number | null
          match_importance?: number | null
          expectations?: string | null
          hear_about?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          music_service?: string | null
          music_astro_balance?: number | null
          match_importance?: number | null
          expectations?: string | null
          hear_about?: string | null
          created_at?: string
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
  }
}