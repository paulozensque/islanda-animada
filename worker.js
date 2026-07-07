// Cloudflare Worker - Proxy para fal.ai
// Deploy em: https://dash.cloudflare.com/ -> Workers & Pages -> Create
// Cole este codigo e publique. O URL gerado sera algo como:
// https://islanda-proxy.SEU-USUARIO.workers.dev

const FAL_KEY = '590b2c32-395d-47c1-a557-563e16175dae:b1069758d433feefcebe093c4b38adb9';

export default {
  async fetch(request) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.json();

      // Call fal.ai
      const falResp = await fetch('https://fal.run/fal-ai/fast-svd-lcm', {
        method: 'POST',
        headers: {
          'Authorization': 'Key ' + FAL_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await falResp.json();

      return new Response(JSON.stringify(data), {
        status: falResp.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
