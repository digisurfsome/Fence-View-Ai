/**
 * HAIRSTYLE TRANSFORMATION PROMPT SYSTEM
 *
 * Same concept as fence transformation:
 * We're not generating a face from scratch.
 * We're REPLACING existing hair with a new style while preserving:
 * - The exact face, features, and skin
 * - Lighting and environment
 * - Head angle and position
 * - Facial expression
 */

const HAIRSTYLE_PROMPTS = {
  /**
   * FRONT-FACING / PORTRAIT SHOT
   * Standard selfie or portrait angle
   */
  portrait: {
    system: `You are an expert hairstyle visualization AI. Your task is to change
a person's hairstyle in a photograph while maintaining perfect photorealistic quality.
The transformation must:

1. Preserve the EXACT same face, skin, features, expression
2. Only change the HAIR - nothing else
3. Match the lighting and shadows appropriately for the new hairstyle
4. Look completely natural and realistic
5. Be appropriate for the person's face shape and features`,

    prompt: (hairstyle, additionalContext = '') => `
TASK: Transform this person's hair to a ${hairstyle.name} hairstyle.

HAIRSTYLE SPECIFICATIONS:
- Style: ${hairstyle.name}
- Category: ${hairstyle.category}
- Length: ${hairstyle.length}
- Description: ${hairstyle.description}

CRITICAL INSTRUCTIONS:
1. This is a front-facing/portrait photo
2. Change ONLY the hair - keep face, skin, eyes, expression IDENTICAL
3. The new hairstyle must look natural on this specific person
4. Match hair to the person's head shape and face proportions
5. Hair shadows should follow the existing lighting in the photo
6. Maintain the photo's background, clothing, and everything else
7. Hair color: Keep the person's natural hair color unless the style specifies otherwise
${additionalContext ? `\nADDITIONAL CONTEXT: ${additionalContext}` : ''}

STYLE DETAILS:
${hairstyle.promptHints}

OUTPUT: A photorealistic image of this person with the new ${hairstyle.name} hairstyle.`,
  },

  /**
   * ANGLED / THREE-QUARTER VIEW
   */
  angledView: {
    system: `You are an expert hairstyle visualization AI specializing in angled views.
When working with three-quarter or side-angled views, you must:

1. Maintain the EXACT face and features from the angle shown
2. Ensure the hairstyle wraps correctly around the head from this angle
3. Show proper depth and dimension of the hairstyle
4. Hair must follow the natural head contour visible from this angle`,

    prompt: (hairstyle, additionalContext = '') => `
TASK: Transform this person's hair to a ${hairstyle.name} in this ANGLED photo.

HAIRSTYLE: ${hairstyle.name}
LENGTH: ${hairstyle.length}

ANGLE-SPECIFIC INSTRUCTIONS:
1. This is a three-quarter or angled view
2. Show how the hairstyle looks from this specific angle
3. Hair volume and shape must be perspective-correct
4. Show proper hair fall and draping from this viewpoint
5. The side/back of the hairstyle should be visible where appropriate
6. Keep all facial features and expression unchanged

STYLE DETAILS:
${hairstyle.promptHints}
${additionalContext ? `\nADDITIONAL CONTEXT: ${additionalContext}` : ''}

OUTPUT: Photorealistic image with the ${hairstyle.name} from this angle.`,
  },

  /**
   * SIDE PROFILE
   */
  sideProfile: {
    system: `You are an expert at visualizing hairstyles from side profile views.
Profile views show the full silhouette of the hairstyle and are critical for
showing volume, layers, and back detail.`,

    prompt: (hairstyle, additionalContext = '') => `
TASK: Transform this person's hair to a ${hairstyle.name} as seen from the SIDE.

HAIRSTYLE: ${hairstyle.name}

PROFILE-SPECIFIC INSTRUCTIONS:
1. This is a side profile view
2. Show the full SILHOUETTE of the ${hairstyle.name} hairstyle
3. Volume, height, and back length should be clearly visible
4. Show how hair falls behind the ear from this angle
5. Neckline and back detail should be appropriate for this style
6. Keep all facial features and profile unchanged

STYLE DETAILS:
${hairstyle.promptHints}
${additionalContext ? `\nADDITIONAL CONTEXT: ${additionalContext}` : ''}

OUTPUT: Photorealistic side profile with the ${hairstyle.name}.`,
  },
};

/**
 * FACE ANALYSIS PROMPT
 * Detects face shape, current hairstyle, and photo angle
 */
const FACE_DETECTION_PROMPT = `
Analyze this photograph of a person and determine:

1. PHOTO ANGLE:
   - PORTRAIT: Front-facing, standard selfie or headshot
   - ANGLED: Three-quarter view, slightly turned
   - SIDE_PROFILE: Full side view
   - NO_FACE: No clear face visible

2. FACE SHAPE:
   - OVAL: Balanced proportions, slightly longer than wide
   - ROUND: Wide cheekbones, similar width and length
   - SQUARE: Strong jawline, equal width at forehead, cheeks, and jaw
   - HEART: Wider forehead, narrow chin
   - OBLONG: Significantly longer than wide
   - DIAMOND: Narrow forehead and jaw, wide cheekbones

3. CURRENT HAIR:
   - Current style description
   - Approximate length
   - Hair color
   - Hair texture (straight, wavy, curly, coily)

4. OTHER DETAILS:
   - Gender presentation
   - Approximate age range
   - Lighting direction
   - Background description

Respond in JSON format:
{
  "photoAngle": "PORTRAIT|ANGLED|SIDE_PROFILE|NO_FACE",
  "faceShape": "OVAL|ROUND|SQUARE|HEART|OBLONG|DIAMOND",
  "currentHair": {
    "style": "string",
    "length": "string",
    "color": "string",
    "texture": "straight|wavy|curly|coily"
  },
  "genderPresentation": "masculine|feminine|androgynous",
  "ageRange": "string",
  "lightDirection": "string",
  "confidence": 0.0-1.0
}
`;

/**
 * COLOR TRANSFORMATION PROMPTS
 * For when the hairstyle involves a color change
 */
const COLOR_PROMPTS = {
  keepNatural: `
HAIR COLOR: Keep the person's current natural hair color.
Do NOT change the hair color, only the style/cut.`,

  applyColor: (colorDesc) => `
HAIR COLOR CHANGE: Apply ${colorDesc} to the new hairstyle.
Ensure the color looks natural and well-applied.
Color should have depth and dimension, not flat/single-toned.`,
};

/**
 * Build complete prompt with all context
 */
function buildHairstylePrompt(hairstyle, analysis, options = {}) {
  const promptType = getPromptType(analysis);
  const basePrompt = HAIRSTYLE_PROMPTS[promptType];

  const colorInstruction = hairstyle.category === 'Color'
    ? COLOR_PROMPTS.applyColor(hairstyle.promptHints)
    : COLOR_PROMPTS.keepNatural;

  return {
    system: basePrompt.system,
    prompt: `${basePrompt.prompt(hairstyle, options.additionalContext)}

${colorInstruction}

FACE SHAPE CONSIDERATION:
The detected face shape is ${analysis.faceShape || 'unknown'}.
Adjust the hairstyle to flatter this face shape while staying true to the style.`.trim(),
  };
}

function getPromptType(analysis) {
  switch (analysis.photoAngle) {
    case 'ANGLED': return 'angledView';
    case 'SIDE_PROFILE': return 'sideProfile';
    default: return 'portrait';
  }
}

module.exports = {
  HAIRSTYLE_PROMPTS,
  FACE_DETECTION_PROMPT,
  COLOR_PROMPTS,
  buildHairstylePrompt,
  getPromptType,
};
