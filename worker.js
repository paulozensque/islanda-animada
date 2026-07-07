// Cloudflare Worker - Proxy para fal.ai (Islanda Animada)
// ATUALIZE SEU WORKER COM ESTE CODIGO!
// Acesse: https://dash.cloudflare.com -> Workers -> islanda-proxy -> Edit Code
// Cole este codigo e clique "Save and Deploy"

export default {
  async fetch(request) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Islanda Animada Proxy - OK', { status: 200, headers: corsHeaders });
    }

    const FAL_KEY = '590b2c32-395d-47c1-a557-563e16175dae:b1069758d433feefcebe093c4b38adb9';

    try {
      const body = await request.json();

      // Usa o modelo SVD (Stable Video Diffusion) - boa qualidade
      const resp = await fetch('https://fal.run/fal-ai/fast-svd-lcm', {
        method: 'POST',
        headers: {
          'Authorization': 'Key ' + FAL_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const responseText = await resp.text();

      return new Response(responseText, {
        status: resp.status,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
