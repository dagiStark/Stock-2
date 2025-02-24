import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decode as base32Decode } from "https://deno.land/std@0.168.0/encoding/base32.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateTOTP(secret: string, window = 30) {
  const now = Math.floor(Date.now() / 1000);
  const counter = Math.floor(now / window);
  
  // Convert counter to buffer
  const counterBuffer = new ArrayBuffer(8);
  const view = new DataView(counterBuffer);
  view.setBigUint64(0, BigInt(counter));
  
  // Get HMAC-SHA1
  const key = base32Decode(secret.toUpperCase());
  const hmac = new Uint8Array(
    crypto.subtle.signSync(
      "HMAC",
      key,
      counterBuffer
    )
  );
  
  // Generate 6-digit code
  const offset = hmac[hmac.length - 1] & 0xf;
  const code = (
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)
  ) % 1000000;
  
  return code.toString().padStart(6, '0');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authorization = req.headers.get('Authorization')?.split(' ')[1];
    if (!authorization) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the request body
    const { token, secret } = await req.json();
    if (!token || !secret) {
      throw new Error('Token and secret are required');
    }

    // Generate TOTP codes for current and adjacent time windows
    const currentWindow = generateTOTP(secret);
    const previousWindow = generateTOTP(secret, -30);
    const nextWindow = generateTOTP(secret, 30);

    // Verify the token matches any of the windows
    const isValid = [currentWindow, previousWindow, nextWindow].includes(token);

    return new Response(
      JSON.stringify({ valid: isValid }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});