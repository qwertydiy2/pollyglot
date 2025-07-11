// Utility to generate an image from a sentence using Stablecog API (browser only)
// Supports multiple models, all requests are done client-side.

const STABLECOG_MODELS = [
  { name: 'SDXL', id: 'SDXL' },
  { name: 'Stable Diffusion 1.5', id: 'SD15' },
  { name: 'Stable Diffusion 2.1', id: 'SD21' },
  { name: 'Realistic Vision', id: 'REALISTIC_VISION' },
];

export async function textToImage(prompt: string): Promise<string> {
  // Get model and API key from localStorage
  const modelIdx = parseInt(localStorage.getItem('image_model_idx') || '0', 10);
  const apiKey = localStorage.getItem('sc_api_key') || '';
  if (modelIdx === 4) {
    // DeepAI (non-SD, free, basic)
    const deepAiKey = localStorage.getItem('deepai_api_key') || '';
    if (!deepAiKey) throw new Error('DeepAI API key missing. Set it in settings.');
    const res = await fetch('https://api.deepai.org/api/text2img', {
      method: 'POST',
      headers: {
        'Api-Key': deepAiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `text=${encodeURIComponent(prompt)}`,
    });
    if (!res.ok) throw new Error('Image generation failed.');
    const data = await res.json();
    if (data && data.output_url) {
      return data.output_url;
    } else {
      throw new Error(data.err || 'Image generation failed.');
    }
  } else {
    // Stablecog
    const model = STABLECOG_MODELS[modelIdx % STABLECOG_MODELS.length].id;
    if (!apiKey) throw new Error('Stablecog API key missing. Set it in settings.');
    const res = await fetch('https://stablecog.com/api/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ prompt, model }),
    });
    if (!res.ok) throw new Error('Image generation failed.');
    const data = await res.json();
    if (data && data.url) {
      return data.url;
    } else {
      throw new Error(data.error || 'Image generation failed.');
    }
  }
}

export const STABLECOG_MODELS_LIST = [
  ...STABLECOG_MODELS,
  { name: 'DeepAI Text2Img (non-SD, free, basic)', id: 'DEEPAI' },
];
