// src/services/email.ts
import { supabase } from '@/lib/supabase';

export interface SendEmailParams {
  sender?: string;
  recipient: string;
  subject: string;
  htmlBody?: string;
  textBody?: string;
  senderName?: string;
  recipientName?: string;
}

export interface SendTemplatedEmailParams {
  templateKey: string;
  recipient: string;
  variables?: Record<string, string>;
  sender?: string;
}

export interface EmailResponse {
  success: boolean;
  status_code?: number;
  provider_response?: any;
  message_id?: string;
  provider_message_id?: string;
  error?: string;
}

/**
 * Send a custom email using the Mailersend integration
 */
export const sendEmail = async (params: SendEmailParams): Promise<EmailResponse> => {
  try {
    const { data, error } = await supabase.rpc('send_email_message', {
      message_json: {
        sender: params.sender || 'noreply@lyra.app',
        recipient: params.recipient,
        subject: params.subject,
        html_body: params.htmlBody,
        text_body: params.textBody,
        sender_name: params.senderName,
        recipient_name: params.recipientName,
      }
    });

    if (error) {
      console.error('Email sending error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return data as EmailResponse;
  } catch (err) {
    console.error('Unexpected email error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    };
  }
};

/**
 * Send an email using a pre-defined template
 */
export const sendTemplatedEmail = async (params: SendTemplatedEmailParams): Promise<EmailResponse> => {
  try {
    const { data, error } = await supabase.rpc('send_templated_email', {
      template_key_param: params.templateKey,
      recipient_email: params.recipient,
      variables_param: params.variables || {},
      sender_email: params.sender || 'noreply@lyra.app'
    });

    if (error) {
      console.error('Templated email sending error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return data as EmailResponse;
  } catch (err) {
    console.error('Unexpected templated email error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    };
  }
};

/**
 * Send welcome email to new users
 */
export const sendWelcomeEmail = async (
  userEmail: string, 
  userName: string, 
  appUrl: string = window.location.origin
): Promise<EmailResponse> => {
  return sendTemplatedEmail({
    templateKey: 'welcome_email',
    recipient: userEmail,
    variables: {
      user_name: userName,
      user_email: userEmail,
      app_url: appUrl
    }
  });
};

/**
 * Send email confirmation
 */
export const sendEmailConfirmation = async (
  userEmail: string,
  userName: string,
  confirmationUrl: string
): Promise<EmailResponse> => {
  return sendTemplatedEmail({
    templateKey: 'email_confirmation',
    recipient: userEmail,
    variables: {
      user_name: userName,
      confirmation_url: confirmationUrl
    }
  });
};

/**
 * Send password reset email
 */
export const sendPasswordReset = async (
  userEmail: string,
  userName: string,
  resetUrl: string
): Promise<EmailResponse> => {
  return sendTemplatedEmail({
    templateKey: 'password_reset',
    recipient: userEmail,
    variables: {
      user_name: userName,
      reset_url: resetUrl
    }
  });
};

/**
 * Get email templates available in the system
 */
export const getEmailTemplates = async () => {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .select('template_key, subject, variables, description')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching email templates:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Unexpected error fetching templates:', err);
    return [];
  }
};

/**
 * Get sent message history (for the current user)
 */
export const getMessageHistory = async (limit: number = 10) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.email) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('messages')
      .select('id, sender, recipient, subject, status_code, created_at, provider_message_id')
      .or(`recipient.eq.${user.email},sender.eq.${user.email}`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching message history:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Unexpected error fetching message history:', err);
    return [];
  }
};