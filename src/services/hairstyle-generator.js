/**
 * HAIRSTYLE IMAGE GENERATION SERVICE
 *
 * Same architecture as fence image-generator.js but for hairstyles.
 * Supports Gemini and OpenAI backends.
 *
 * Workflow:
 * 1. User uploads face/head photo
 * 2. Analyze face (shape, angle, current hair)
 * 3. For each hairstyle, generate transformed image
 * 4. Return results
 */

const fs = require('fs');
const path = require('path');
const { HAIRSTYLE_PROMPTS, FACE_DETECTION_PROMPT, buildHairstylePrompt } = require('../prompts/hairstyle-prompts');
const { getHairstyle } = require('../prompts/hairstyle-styles');

const CONFIG = {
  provider: process.env.AI_PROVIDER || 'gemini',

  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-2.0-flash-exp',
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4o',
    imageModel: 'dall-e-3',
  },

  quality: {
    low: { width: 512, height: 512 },
    medium: { width: 1024, height: 1024 },
    high: { width: 1536, height: 1536 },
  },
};

class HairstyleGeminiService {
  constructor(apiKey) {
    this.apiKey = apiKey || CONFIG.gemini.apiKey;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  }

  async analyzeFace(imageBase64) {
    const response = await fetch(
      `${this.baseUrl}/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: FACE_DETECTION_PROMPT },
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

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return JSON.parse(jsonMatch ? jsonMatch[0] : '{}');
    } catch {
      console.error('Failed to parse face analysis:', text);
      return { photoAngle: 'PORTRAIT', faceShape: 'OVAL', confidence: 0.5 };
    }
  }

  async transformHairstyle(imageBase64, hairstyleId, options = {}) {
    const hairstyle = getHairstyle(hairstyleId);
    if (!hairstyle) {
      throw new Error(`Unknown hairstyle: ${hairstyleId}`);
    }

    const analysis = await this.analyzeFace(imageBase64);
    console.log('Face analysis:', analysis);

    const { system, prompt } = buildHairstylePrompt(hairstyle, analysis, options);

    const response = await fetch(
      `${this.baseUrl}/models/${CONFIG.gemini.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: `${system}\n\n${prompt}` },
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
            responseModalities: ['TEXT', 'IMAGE'],
          },
        }),
      }
    );

    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(p => p.inline_data);
    const textPart = parts.find(p => p.text);

    return {
      success: !!imagePart,
      image: imagePart?.inline_data?.data || null,
      mimeType: imagePart?.inline_data?.mime_type || 'image/png',
      analysis,
      description: textPart?.text || null,
      hairstyle,
      provider: 'gemini',
    };
  }

  async generateAllStyles(imageBase64, styleIds, options = {}) {
    const results = [];

    for (const styleId of styleIds) {
      try {
        console.log(`Generating hairstyle: ${styleId}...`);
        const result = await this.transformHairstyle(imageBase64, styleId, options);
        results.push({ styleId, ...result });
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error generating ${styleId}:`, error);
        results.push({ styleId, success: false, error: error.message });
      }
    }

    return results;
  }
}

class HairstyleOpenAIService {
  constructor(apiKey) {
    this.apiKey = apiKey || CONFIG.openai.apiKey;
    this.baseUrl = 'https://api.openai.com/v1';
  }

  async analyzeFace(imageBase64) {
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
            { type: 'text', text: FACE_DETECTION_PROMPT },
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
      return { photoAngle: 'PORTRAIT', faceShape: 'OVAL', confidence: 0.5 };
    }
  }

  async transformHairstyle(imageBase64, hairstyleId, options = {}) {
    const hairstyle = getHairstyle(hairstyleId);
    if (!hairstyle) {
      throw new Error(`Unknown hairstyle: ${hairstyleId}`);
    }

    const analysis = await this.analyzeFace(imageBase64);
    const { system, prompt } = buildHairstylePrompt(hairstyle, analysis, options);

    const response = await fetch(`${this.baseUrl}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: `${system}\n\n${prompt}`,
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
      hairstyle,
      provider: 'openai',
    };
  }
}

function createHairstyleService(provider = CONFIG.provider) {
  switch (provider) {
    case 'openai':
      return new HairstyleOpenAIService();
    case 'gemini':
    default:
      return new HairstyleGeminiService();
  }
}

module.exports = {
  createHairstyleService,
  HairstyleGeminiService,
  HairstyleOpenAIService,
  CONFIG,
};
