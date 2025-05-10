import { supabase } from '@/lib/supabase';
import { User, UserAttributes } from '@supabase/supabase-js';

// Profile interface for the profiles table
export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  birth_date: string | null;
  zodiac_sign: string | null;
  social_links?: Record<string, string> | null;
  created_at: string;
  updated_at: string;
}

/**
 * Gets the current user from Supabase Auth
 * @returns User or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error.message);
      return null;
    }
    
    return data.user;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

/**
 * Gets a user profile by ID
 * @param userId - Optional user ID (uses current user if not provided)
 * @returns User profile or null if not found
 */
export async function getUserProfile(userId?: string): Promise<Profile | null> {
  try {
    // If userId not provided, get current user
    if (!userId) {
      const user = await getCurrentUser();
      if (!user) return null;
      userId = user.id;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // No row found
        console.log(`No profile found for user ${userId}`);
        return null;
      }
      console.error('Error fetching profile:', error.message);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
}

/**
 * Updates a user profile
 * @param userId - Optional user ID (uses current user if not provided)
 * @param updates - Profile fields to update
 * @returns Updated profile or null on error
 */
export async function updateUserProfile(updates: Partial<Profile>, userId?: string): Promise<Profile | null> {
  try {
    // If userId not provided, get current user
    if (!userId) {
      const user = await getCurrentUser();
      if (!user) {
        console.error('No authenticated user found');
        return null;
      }
      userId = user.id;
    }
    
    // Add updated timestamp
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    // Update the profile
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error.message);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to update profile:', error);
    return null;
  }
}

/**
 * Creates a user profile if one doesn't exist
 * This should rarely be needed as profiles are created automatically via DB trigger,
 * but it's useful as a fallback or for testing
 * 
 * @param userId - Optional user ID (uses current user if not provided)
 * @returns Created profile or null on error
 */
export async function createUserProfile(userData: Partial<Profile>, userId?: string): Promise<Profile | null> {
  try {
    // If userId not provided, get current user
    if (!userId) {
      const user = await getCurrentUser();
      if (!user) {
        console.error('No authenticated user found');
        return null;
      }
      userId = user.id;
    }
    
    // Check if profile already exists
    const existingProfile = await getUserProfile(userId);
    if (existingProfile) {
      return existingProfile;
    }
    
    // Prepare timestamps
    const now = new Date().toISOString();
    
    // Create new profile
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        ...userData,
        created_at: now,
        updated_at: now
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating profile:', error.message);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to create profile:', error);
    return null;
  }
}

/**
 * Updates the user's name
 * @param fullName - User's full name
 * @returns Updated profile or null on error
 */
export async function updateUserName(fullName: string): Promise<Profile | null> {
  return updateUserProfile({ full_name: fullName });
}

/**
 * Updates the user's avatar URL
 * @param avatarUrl - URL to user's avatar image
 * @returns Updated profile or null on error
 */
export async function updateUserAvatar(avatarUrl: string): Promise<Profile | null> {
  return updateUserProfile({ avatar_url: avatarUrl });
}

/**
 * Sets the user's zodiac sign directly
 * @param sign - Zodiac sign
 * @returns Updated profile or null on error
 */
export async function setUserZodiacSign(sign: string): Promise<Profile | null> {
  return updateUserProfile({ zodiac_sign: sign });
}

/**
 * Sets the user's birth date and automatically calculates their zodiac sign
 * @param birthDate - The birth date as a string in ISO format (YYYY-MM-DD)
 * @param userId - Optional user ID (uses current user if not provided)
 * @returns Updated profile or null on error
 */
export async function setUserBirthDate(birthDate: string, userId?: string): Promise<Profile | null> {
  // Calculate zodiac sign based on birth date
  const zodiacSign = calculateZodiacSign(birthDate);
  
  return updateUserProfile({ 
    birth_date: birthDate,
    zodiac_sign: zodiacSign
  }, userId);
}

/**
 * Sets the user's bio description
 * @param bio - User bio text
 * @returns Updated profile or null on error
 */
export async function setUserBio(bio: string): Promise<Profile | null> {
  return updateUserProfile({ bio });
}

/**
 * Updates the user's social media links
 * @param links - Object containing social media platform names and profile URLs
 * @returns Updated profile or null on error
 */
export async function updateSocialMediaLinks(links: Record<string, string>): Promise<Profile | null> {
  return updateUserProfile({ social_links: links });
}

/**
 * Calculate zodiac sign from birth date
 * @param birthDate - Date string in ISO format (YYYY-MM-DD)
 * @returns The zodiac sign name
 */
function calculateZodiacSign(birthDate: string): string {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1; // JavaScript months are 0-based
  const day = date.getDate();

  // Determine zodiac sign based on month and day
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces'; // (month === 2 && day >= 19) || (month === 3 && day <= 20)
}
