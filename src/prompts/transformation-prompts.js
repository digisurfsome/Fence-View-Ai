/**
 * FENCE TRANSFORMATION PROMPT SYSTEM
 *
 * This is the CORE ENGINE that powers the fence visualization.
 * These prompts work with Gemini 1.5, GPT-4 Vision, or similar models.
 *
 * The key insight: We're not generating a fence from scratch.
 * We're REPLACING an existing fence with a new style while preserving:
 * - The exact angle/perspective of the photo
 * - The surrounding environment (house, yard, trees, etc.)
 * - Lighting and shadows
 * - The exact footprint/location of the fence
 */

const FENCE_PROMPTS = {
  /**
   * STRAIGHT-ON SHOT
   * Camera is perpendicular to the fence
   */
  straightShot: {
    system: `You are an expert architectural visualization AI. Your task is to replace
an existing fence in a photograph with a new fence style while maintaining perfect
photorealistic quality. The replacement must:

1. Cover the EXACT same area as the original fence
2. Maintain the same perspective and scale
3. Preserve all surroundings (house, yard, vegetation, sky)
4. Match the lighting and shadows of the original photo
5. Look completely natural and realistic`,

    prompt: (fenceStyle, additionalContext = '') => `
TASK: Replace the existing fence in this photograph with a ${fenceStyle.name} fence.

FENCE SPECIFICATIONS:
- Style: ${fenceStyle.name}
- Material: ${fenceStyle.material}
- Color: ${fenceStyle.color}
- Height: ${fenceStyle.height || 'Match original fence height'}
- Post style: ${fenceStyle.postStyle || 'Standard matching posts'}

CRITICAL INSTRUCTIONS:
1. This is a STRAIGHT-ON shot - the camera is perpendicular to the fence
2. Replace EVERY inch of the existing fence with the new ${fenceStyle.name} style
3. The new fence must occupy the EXACT same space as the old fence
4. Keep the gate (if any) in the same location, just in the new style
5. Preserve the ground, grass, concrete, or whatever is at the fence base
6. Match shadows to the existing light source in the photo
7. DO NOT change anything except the fence itself
${additionalContext ? `\nADDITIONAL CONTEXT: ${additionalContext}` : ''}

OUTPUT: A photorealistic image showing the property with the new ${fenceStyle.name} fence.`,
  },

  /**
   * ANGLED SHOT
   * Camera is at an angle to the fence (common for corner views, yard shots)
   */
  angledShot: {
    system: `You are an expert architectural visualization AI specializing in perspective-accurate
fence replacements. When working with angled shots, you must:

1. Maintain the EXACT perspective lines of the original photo
2. Apply proper foreshortening to the new fence
3. Ensure fence posts appear correctly spaced in perspective
4. Handle the vanishing point accurately
5. Keep depth and distance relationships intact`,

    prompt: (fenceStyle, additionalContext = '') => `
TASK: Replace the existing fence in this ANGLED photograph with a ${fenceStyle.name} fence.

FENCE SPECIFICATIONS:
- Style: ${fenceStyle.name}
- Material: ${fenceStyle.material}
- Color: ${fenceStyle.color}
- Height: ${fenceStyle.height || 'Match original fence height'}

CRITICAL PERSPECTIVE INSTRUCTIONS:
1. This is an ANGLED shot - maintain the exact camera angle and perspective
2. The new fence must follow the SAME perspective lines as the original
3. Fence boards/slats must show proper foreshortening (closer = larger, farther = smaller)
4. Posts must maintain correct spacing as they recede into distance
5. If fence turns a corner, maintain that corner at the exact same angle
6. Shadows must follow the perspective correctly

REPLACEMENT RULES:
1. Replace ALL visible fence sections with the new style
2. Preserve exact fence line/path through the yard
3. Keep any gates in their original positions
4. Maintain ground level and terrain exactly
5. DO NOT alter house, trees, yard, or any non-fence elements
${additionalContext ? `\nADDITIONAL CONTEXT: ${additionalContext}` : ''}

OUTPUT: A photorealistic image with the new ${fenceStyle.name} fence at the correct perspective.`,
  },

  /**
   * CORNER/MULTI-ANGLE SHOT
   * Shows fence from a corner where multiple fence sections are visible
   */
  cornerShot: {
    system: `You are an expert at visualizing fence replacements in complex corner views.
Corner shots show multiple fence sections at different angles and require careful handling
of perspective transitions and consistent styling across all visible sections.`,

    prompt: (fenceStyle, additionalContext = '') => `
TASK: Replace ALL visible fence sections in this CORNER photograph with a ${fenceStyle.name} fence.

FENCE SPECIFICATIONS:
- Style: ${fenceStyle.name}
- Material: ${fenceStyle.material}
- Color: ${fenceStyle.color}

CORNER-SPECIFIC INSTRUCTIONS:
1. This shows a CORNER view with multiple fence sections visible
2. Replace ALL fence sections consistently with the same style
3. Corner posts must show the new style meeting at correct angles
4. Each section maintains its own perspective while sharing consistent styling
5. Ensure the corner connection looks structurally correct for this fence type

CRITICAL RULES:
1. Every visible fence section gets replaced
2. Maintain exact positions of all corners and turns
3. Keep perspective accurate for each section
4. Uniform styling across all sections
${additionalContext ? `\nADDITIONAL CONTEXT: ${additionalContext}` : ''}

OUTPUT: Photorealistic corner view with all fence sections replaced with ${fenceStyle.name} style.`,
  },

  /**
   * PARTIAL/DAMAGED FENCE
   * For showing what a new fence would look like where there's partial or no fence
   */
  newInstallation: {
    system: `You are an expert at visualizing new fence installations. Your task is to
add a fence where one doesn't fully exist, using environmental cues to determine
the correct placement, scale, and integration with the property.`,

    prompt: (fenceStyle, fencePath, additionalContext = '') => `
TASK: Add a new ${fenceStyle.name} fence to this property photograph.

FENCE SPECIFICATIONS:
- Style: ${fenceStyle.name}
- Material: ${fenceStyle.material}
- Color: ${fenceStyle.color}
- Height: ${fenceStyle.height || '6 feet standard'}

FENCE PLACEMENT:
${fencePath || '- Along the property line visible in the photo\n- Standard setback from structures'}

INSTALLATION INSTRUCTIONS:
1. Add the fence along the specified path
2. Scale appropriately to surrounding elements (house, trees, people if visible)
3. Ground the fence posts realistically into the terrain
4. Add appropriate shadows based on lighting
5. Integrate naturally with existing landscaping

OUTPUT: Photorealistic image showing the property with the new ${fenceStyle.name} fence installed.`,
  },
};

/**
 * PAINT TRANSFORMATION PROMPTS
 * For house exterior paint visualization
 */
const PAINT_PROMPTS = {
  exteriorPaint: {
    system: `You are an expert architectural visualization AI specializing in exterior paint
color changes. You must change the paint color while preserving:
- All architectural details (trim, shutters, etc.)
- Texture and material appearance
- Lighting, shadows, and highlights
- Surrounding environment`,

    prompt: (paintColor, surfaces = 'main siding', additionalContext = '') => `
TASK: Change the exterior paint color of this house to ${paintColor.name}.

COLOR SPECIFICATIONS:
- Color Name: ${paintColor.name}
- Hex Code: ${paintColor.hex || 'N/A'}
- Finish: ${paintColor.finish || 'Standard exterior'}

SURFACES TO PAINT:
${surfaces}

CRITICAL INSTRUCTIONS:
1. Change ONLY the specified surfaces to the new color
2. Preserve all architectural details - just change the color
3. Keep trim, shutters, doors in their original colors (unless specified)
4. Maintain realistic paint appearance (not flat/digital looking)
5. Shadows should still show depth - don't flatten the image
6. Preserve any texture in the siding (wood grain, stucco texture, etc.)
${additionalContext ? `\nADDITIONAL CONTEXT: ${additionalContext}` : ''}

OUTPUT: Photorealistic image of the house with the new ${paintColor.name} paint color.`,
  },

  multiColorScheme: {
    system: `You are an expert at visualizing complete exterior color schemes including
siding, trim, shutters, doors, and accents. You create cohesive, realistic color transformations.`,

    prompt: (colorScheme, additionalContext = '') => `
TASK: Apply this complete color scheme to the house exterior.

COLOR SCHEME:
- Main Siding: ${colorScheme.siding}
- Trim: ${colorScheme.trim}
- Shutters: ${colorScheme.shutters || 'Keep original'}
- Front Door: ${colorScheme.door || 'Keep original'}
- Accents: ${colorScheme.accents || 'Match trim'}

INSTRUCTIONS:
1. Apply each color to its designated surface
2. Ensure colors work together cohesively
3. Maintain all architectural details
4. Keep realistic paint finish and texture
5. Preserve lighting and shadow depth
${additionalContext ? `\nADDITIONAL CONTEXT: ${additionalContext}` : ''}

OUTPUT: Photorealistic image with the complete new color scheme applied.`,
  },
};

/**
 * ROOFING TRANSFORMATION PROMPTS
 * For roof style/material visualization
 */
const ROOFING_PROMPTS = {
  roofReplacement: {
    system: `You are an expert at visualizing roof replacements. You must change the roofing
material/style while maintaining the exact roof structure, pitch, and architectural details.`,

    prompt: (roofStyle, additionalContext = '') => `
TASK: Replace the roof on this house with ${roofStyle.name} roofing.

ROOF SPECIFICATIONS:
- Material: ${roofStyle.material}
- Color: ${roofStyle.color}
- Style: ${roofStyle.style || 'Standard'}

CRITICAL INSTRUCTIONS:
1. Replace ONLY the roofing material - keep exact roof shape/structure
2. Maintain all roof features (vents, skylights, chimneys, gutters)
3. Apply realistic texture for ${roofStyle.material}
4. Ensure proper light reflection/shadow for the material type
5. Keep all dormers, valleys, and ridges in place
${additionalContext ? `\nADDITIONAL CONTEXT: ${additionalContext}` : ''}

OUTPUT: Photorealistic image showing the house with new ${roofStyle.name} roof.`,
  },
};

/**
 * HELPER: Detect shot type from image analysis
 */
const SHOT_DETECTION_PROMPT = `
Analyze this photograph and determine the camera angle relative to the fence:

1. STRAIGHT-ON: Camera is perpendicular to the fence, fence appears flat/frontal
2. ANGLED: Camera is at an angle, fence shows perspective (one end closer than other)
3. CORNER: Multiple fence sections visible meeting at corners
4. AERIAL: Looking down at the fence from above
5. NO_FENCE: No fence visible in the image

Also identify:
- Fence material (wood, metal, vinyl, chain-link, etc.)
- Approximate fence height
- Fence condition (good, weathered, damaged)
- Any gates visible
- Lighting direction

Respond in JSON format:
{
  "shotType": "STRAIGHT-ON|ANGLED|CORNER|AERIAL|NO_FENCE",
  "fenceMaterial": "string",
  "estimatedHeight": "string",
  "condition": "string",
  "hasGate": boolean,
  "gateLocation": "string or null",
  "lightDirection": "string",
  "confidence": 0.0-1.0
}
`;

module.exports = {
  FENCE_PROMPTS,
  PAINT_PROMPTS,
  ROOFING_PROMPTS,
  SHOT_DETECTION_PROMPT,
};
