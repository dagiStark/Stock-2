import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    
    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Get user from email
    const { data: { users }, error: userError } = await supabaseClient.auth.admin.listUsers();
    const user = users?.find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Store code in profile with 5-minute expiration
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    await supabaseClient
      .from('profiles')
      .update({
        email_code: code,
        email_code_expires_at: expiresAt.toISOString(),
      })
      .eq('id', user.id);

    // Send email
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Inventory App <onboarding@resend.dev>',
      to: [email],
      subject: '2FA Verification Code',
      html: `
        <h1>Your verification code</h1>
        <p>Here is your 2FA verification code: <strong>${code}</strong></p>
        <p>This code will expire in 5 minutes.</p>
      `,
    });

    if (emailError) throw emailError;

    console.log('2FA code sent successfully:', { email, code });

    return new Response(
      JSON.stringify({ message: 'Code sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending 2FA code:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});