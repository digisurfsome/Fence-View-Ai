/**
 * IMAGE GENERATION SERVICE
 *
 * Supports:
 * - Google Gemini 1.5 Flash (cheapest at ~$0.04/image for low-res)
 * - Google Imagen 3 (higher quality)
 * - OpenAI GPT-4 Vision + DALL-E 3
 *
 * The workflow:
 * 1. Analyze the input image (detect shot type, fence type)
 * 2. Select appropriate prompt based on shot type
 * 3. Generate transformed image
 */

const fs = require('fs');
const path = require('path');
const { FENCE_PROMPTS, SHOT_DETECTION_PROMPT } = require('../prompts/transformation-prompts');
const { getStyle } = require('../prompts/fence-styles');

// Configuration
const CONFIG = {
  // Set your preferred provider: 'gemini' | 'openai'
  provider: process.env.AI_PROVIDER || 'gemini',

  // Gemini settings
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-2.0-flash-exp', // or 'gemini-1.5-pro' for better quality
    imageModel: 'imagen-3.0-generate-002', // For pure image generation
  },

  // OpenAI settings
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4o', // For analysis
    imageModel: 'dall-e-3', // For generation
  },

  // Quality settings
  quality: {
    low: { width: 512, height: 512 },    // ~$0.04 per image
    medium: { width: 1024, height: 1024 }, // ~$0.08 per image
    high: { width: 1536, height: 1536 },   // ~$0.12 per image
  },
};

/**
 * GEMINI IMAGE EDITING API
 * Uses Gemini's native image understanding + Imagen for output
 */
class GeminiService {
  constructor(apiKey) {
    this.apiKey = apiKey || CONFIG.gemini.apiKey;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  }

  /**
   * Analyze an image to detect shot type and fence details
   */
  async analyzeImage(imageBase64) {
    const response = await fetch(
      `${this.baseUrl}/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: SHOT_DETECTION_PROMPT },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: imageBase64,
                },
              },
            ],
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    // Parse JSON from response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return JSON.parse(jsonMatch ? jsonMatch[0] : '{}');
    } catch {
      console.error('Failed to parse analysis:', text);
      return { shotType: 'STRAIGHT-ON', confidence: 0.5 };
    }
  }

  /**
   * Transform a fence image using Gemini's image editing capabilities
   */
  async transformFence(imageBase64, fenceStyleId, options = {}) {
    const fenceStyle = getStyle(fenceStyleId);
    if (!fenceStyle) {
      throw new Error(`Unknown fence style: ${fenceStyleId}`);
    }

    // First, analyze the image to determine shot type
    const analysis = await this.analyzeImage(imageBase64);
    console.log('Image analysis:', analysis);

    // Select the right prompt based on shot type
    let promptTemplate;
    switch (analysis.shotType) {
      case 'ANGLED':
        promptTemplate = FENCE_PROMPTS.angledShot;
        break;
      case 'CORNER':
        promptTemplate = FENCE_PROMPTS.cornerShot;
        break;
      case 'NO_FENCE':
        promptTemplate = FENCE_PROMPTS.newInstallation;
        break;
      case 'STRAIGHT-ON':
      default:
        promptTemplate = FENCE_PROMPTS.straightShot;
    }

    // Build the full prompt
    const systemPrompt = promptTemplate.system;
    const userPrompt = promptTemplate.prompt(fenceStyle, options.additionalContext);

    // Add the fence style reference image hints
    const fullPrompt = `${userPrompt}

REFERENCE FENCE STYLE DETAILS:
${fenceStyle.promptHints}`;

    // Call Gemini to generate the edited image
    const response = await fetch(
      `${this.baseUrl}/models/${CONFIG.gemini.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: `${systemPrompt}\n\n${fullPrompt}` },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: imageBase64,
                },
              },
            ],
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
            // Request image output if supported
            responseModalities: ['TEXT', 'IMAGE'],
          },
        }),
      }
    );

    const data = await response.json();

    // Check for image in response
    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(p => p.inline_data);
    const textPart = parts.find(p => p.text);

    return {
      success: !!imagePart,
      image: imagePart?.inline_data?.data || null,
      mimeType: imagePart?.inline_data?.mime_type || 'image/png',
      analysis,
      description: textPart?.text || null,
      fenceStyle,
      provider: 'gemini',
    };
  }

  /**
   * Generate multiple fence style variations at once
   */
  async generateAllStyles(imageBase64, styleIds, options = {}) {
    const results = [];

    for (const styleId of styleIds) {
      try {
        console.log(`Generating ${styleId}...`);
        const result = await this.transformFence(imageBase64, styleId, options);
        results.push({ styleId, ...result });

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error generating ${styleId}:`, error);
        results.push({ styleId, success: false, error: error.message });
      }
    }

    return results;
  }
}

/**
 * OPENAI SERVICE
 * Uses GPT-4V for analysis and DALL-E 3 for generation
 */
class OpenAIService {
  constructor(apiKey) {
    this.apiKey = apiKey || CONFIG.openai.apiKey;
    this.baseUrl = 'https://api.openai.com/v1';
  }

  async analyzeImage(imageBase64) {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: CONFIG.openai.model,
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: SHOT_DETECTION_PROMPT },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
            },
          ],
        }],
        max_tokens: 1024,
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '{}';

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return JSON.parse(jsonMatch ? jsonMatch[0] : '{}');
    } catch {
      return { shotType: 'STRAIGHT-ON', confidence: 0.5 };
    }
  }

  async transformFence(imageBase64, fenceStyleId, options = {}) {
    const fenceStyle = getStyle(fenceStyleId);
    if (!fenceStyle) {
      throw new Error(`Unknown fence style: ${fenceStyleId}`);
    }

    const analysis = await this.analyzeImage(imageBase64);

    let promptTemplate;
    switch (analysis.shotType) {
      case 'ANGLED':
        promptTemplate = FENCE_PROMPTS.angledShot;
        break;
      case 'CORNER':
        promptTemplate = FENCE_PROMPTS.cornerShot;
        break;
      case 'NO_FENCE':
        promptTemplate = FENCE_PROMPTS.newInstallation;
        break;
      default:
        promptTemplate = FENCE_PROMPTS.straightShot;
    }

    const fullPrompt = `${promptTemplate.prompt(fenceStyle, options.additionalContext)}

REFERENCE FENCE STYLE DETAILS:
${fenceStyle.promptHints}

IMPORTANT: Generate a photorealistic image editing the input photo to show the new fence.`;

    // Use DALL-E 3 for image generation
    // Note: DALL-E 3 doesn't do true image editing, so we describe the scene
    const response = await fetch(`${this.baseUrl}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: fullPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'b64_json',
      }),
    });

    const data = await response.json();
    const imageData = data.data?.[0]?.b64_json;

    return {
      success: !!imageData,
      image: imageData || null,
      mimeType: 'image/png',
      analysis,
      fenceStyle,
      provider: 'openai',
    };
  }
}

/**
 * MAIN SERVICE FACTORY
 */
function createImageService(provider = CONFIG.provider) {
  switch (provider) {
    case 'openai':
      return new OpenAIService();
    case 'gemini':
    default:
      return new GeminiService();
  }
}

/**
 * UTILITY: Convert file to base64
 */
function fileToBase64(filePath) {
  const absolutePath = path.resolve(filePath);
  const buffer = fs.readFileSync(absolutePath);
  return buffer.toString('base64');
}

/**
 * UTILITY: Save base64 image to file
 */
function saveBase64Image(base64Data, outputPath, mimeType = 'image/png') {
  const extension = mimeType.split('/')[1] || 'png';
  const finalPath = outputPath.endsWith(`.${extension}`)
    ? outputPath
    : `${outputPath}.${extension}`;

  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(finalPath, buffer);
  return finalPath;
}

module.exports = {
  createImageService,
  GeminiService,
  OpenAIService,
  fileToBase64,
  saveBase64Image,
  CONFIG,
};
