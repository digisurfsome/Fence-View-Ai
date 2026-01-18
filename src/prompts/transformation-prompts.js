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
 * HELPER: Detect shot type AND fence side from image analysis
 *
 * FENCE SIDE is critical for wood privacy fences:
 * - FRONT (finished side): Flat vertical boards visible, no horizontal rails
 * - BACK (rail side): Horizontal rails/stringers visible behind vertical boards
 * - SAME: Metal, vinyl, chain-link, picket - look identical from both sides
 */
const SHOT_DETECTION_PROMPT = `
Analyze this photograph and determine:

1. CAMERA ANGLE relative to the fence:
   - STRAIGHT-ON: Camera perpendicular to fence, fence appears flat/frontal
   - ANGLED: Camera at angle, fence shows perspective (one end closer than other)
   - CORNER: Multiple fence sections visible meeting at corners
   - AERIAL: Looking down at the fence from above
   - NO_FENCE: No fence visible in the image

2. FENCE SIDE being viewed (critical for wood fences):
   - FRONT: The "finished" side - flat vertical boards with NO horizontal rails visible
           This is what neighbors see, the "good side"
   - BACK: The "rail" side - horizontal support rails/stringers ARE visible
          This is what the homeowner sees from their backyard
   - SAME: Both sides look identical (metal, vinyl, chain-link, picket fences)

How to tell FRONT vs BACK for wood privacy fences:
- BACK (rail side): You can see 2-3 horizontal wooden rails running across,
  with vertical boards attached to them. Rails are typically at top, middle, bottom.
- FRONT (finished side): Only smooth vertical boards visible, no horizontal elements.

Also identify:
- Fence material (wood, metal, vinyl, chain-link, etc.)
- Approximate fence height
- Fence condition (good, weathered, damaged, rotting)
- Any gates visible
- Lighting direction
- Viewer location (inside backyard, outside/street, neighbor's yard)

Respond in JSON format:
{
  "shotType": "STRAIGHT-ON|ANGLED|CORNER|AERIAL|NO_FENCE",
  "fenceSide": "FRONT|BACK|SAME",
  "viewerLocation": "BACKYARD|STREET|NEIGHBOR|UNKNOWN",
  "fenceMaterial": "string",
  "estimatedHeight": "string",
  "condition": "string",
  "hasGate": boolean,
  "gateLocation": "string or null",
  "lightDirection": "string",
  "railsVisible": boolean,
  "confidence": 0.0-1.0
}
`;

/**
 * Get the appropriate reference image based on detected fence side
 */
function getReferenceSide(analysis, fenceStyle) {
  // If fence looks the same on both sides, no need to differentiate
  if (analysis.fenceSide === 'SAME' || fenceStyle.sameBothSides) {
    return 'front'; // Default to front image
  }

  // For wood fences, use the detected side
  if (analysis.fenceSide === 'BACK' || analysis.railsVisible) {
    return 'back';
  }

  return 'front';
}

/**
 * FENCE SIDE-AWARE PROMPTS
 * These add specific instructions based on which side of fence is being shown
 */
const FENCE_SIDE_INSTRUCTIONS = {
  front: `
FENCE SIDE: You are viewing the FRONT (finished/neighbor) side of the fence.
- Show only smooth, flat vertical boards
- NO horizontal rails should be visible
- This is the "good side" that faces outward
- Posts may have decorative caps visible
- Clean, uniform appearance`,

  back: `
FENCE SIDE: You are viewing the BACK (rail/homeowner) side of the fence.
- Horizontal support rails MUST be visible (typically 2-3 rails)
- Rails run horizontally at top, middle, and bottom
- Vertical boards are attached TO these rails
- Posts are visible with rails connecting them
- This is what the homeowner sees from their backyard`,
};

/**
 * CONDITION-BASED PROMPTS
 * For replacing damaged/rotting fences, acknowledge the transformation
 */
const CONDITION_PROMPTS = {
  damaged: `
NOTE: The existing fence appears damaged or deteriorating.
When replacing it with the new fence:
- The new fence should look PRISTINE and well-maintained
- Fill in any gaps or missing sections with the new style
- The transformation should feel like a dramatic upgrade
- Customer should feel excited seeing the improvement`,

  rotting: `
NOTE: The existing fence shows signs of rot and decay.
The new fence replacement should:
- Look brand new and freshly installed
- Show the contrast between old decay and new quality
- Complete all sections even where old fence is falling apart
- Represent a complete fresh start for the property`,
};

/**
 * SALES-OPTIMIZED PROMPTS
 * For generating images that help close deals
 */
const SALES_PROMPTS = {
  premium: `
SALES OPTIMIZATION:
Generate an image that makes the customer WANT this fence:
- Lighting should be warm and inviting (golden hour feel if possible)
- The fence should look substantial and high-quality
- Emphasize how it completes and enhances the property
- The yard should feel more private, secure, and valuable
- This image needs to close a sale`,

  comparison: `
This image will be shown alongside the customer's current fence.
Make the improvement OBVIOUS and DRAMATIC:
- New fence should look pristine
- Straight lines, consistent color
- Professional installation appearance
- The kind of fence that makes neighbors jealous`,
};

/**
 * STYLE-SPECIFIC DETAIL PROMPTS
 * Extra details for each major fence category
 */
const STYLE_DETAIL_PROMPTS = {
  woodPrivacy: `
WOOD PRIVACY FENCE DETAILS:
- Vertical boards should be tight together (privacy fence = no gaps)
- Dog-ear tops: Each board has corners cut at 45° angles
- Flat tops: Each board is cut straight across
- Natural wood grain should be visible
- Color: Natural cedar (golden-brown), pressure-treated (green tint), or stained
- Posts: 4x4 with flat or pyramid caps, spaced 8ft apart
- Height: Standard 6ft, boards extend from ground to top rail`,

  woodHorizontal: `
HORIZONTAL WOOD FENCE DETAILS:
- Boards run LEFT to RIGHT (horizontal, not vertical)
- Modern/contemporary style
- May have small gaps (1/2" - 1") between boards for airflow
- Boards are typically 1x6 or 1x8 cedar
- Posts may be hidden or minimal steel posts
- Creates a sleek, modern aesthetic
- Often paired with modern architecture`,

  wroughtIron: `
WROUGHT IRON FENCE DETAILS:
- Vertical iron bars (pickets) with decorative tops
- Common finial styles: spear point, fleur-de-lis, ball top
- Classic black powder-coated finish
- Pickets evenly spaced (typically 4" apart)
- Horizontal rails at top and bottom
- Thicker corner posts with decorative caps
- Elegant, formal appearance
- You can see through it - provides security, not privacy`,

  vinyl: `
VINYL FENCE DETAILS:
- Solid white (or tan) PVC panels
- Very clean, bright, uniform appearance
- Tongue-and-groove boards lock together
- NO visible wood grain - smooth plastic finish
- Posts are hollow vinyl with decorative caps
- Looks almost too perfect - that's correct for vinyl
- No painting, no staining, no weathering visible`,

  chainLink: `
CHAIN LINK FENCE DETAILS:
- Diamond/rhombus pattern woven wire mesh
- Galvanized = silver metallic color
- Black vinyl-coated = black color
- Round metal posts at corners and every 10ft
- Tension wire runs along top and bottom edges
- Top rail is a horizontal pipe along the top
- Very industrial/utilitarian appearance
- Fully transparent - you see right through it`,

  picket: `
PICKET FENCE DETAILS:
- Vertical pickets with pointed or rounded tops
- Evenly spaced with gaps roughly equal to picket width
- Usually 3-4 feet tall (shorter than privacy fences)
- Two horizontal rails (top and bottom)
- Classic American front-yard look
- Usually white, can be natural wood
- Decorative, not for privacy`,
};

/**
 * Build complete prompt with all context
 */
function buildCompletePrompt(fenceStyle, analysis, options = {}) {
  const basePrompt = FENCE_PROMPTS[getPromptTypeFromAnalysis(analysis)];
  const sideInstructions = FENCE_SIDE_INSTRUCTIONS[getReferenceSide(analysis, fenceStyle)] || '';
  const conditionPrompt = analysis.condition === 'damaged' || analysis.condition === 'rotting'
    ? CONDITION_PROMPTS[analysis.condition] || CONDITION_PROMPTS.damaged
    : '';
  const salesPrompt = options.salesOptimized ? SALES_PROMPTS.premium : '';
  const styleDetails = getStyleDetailPrompt(fenceStyle);

  return {
    system: basePrompt.system,
    prompt: `${basePrompt.prompt(fenceStyle, options.additionalContext)}

${sideInstructions}

${styleDetails}

${conditionPrompt}

${salesPrompt}

REFERENCE FENCE STYLE DETAILS:
${fenceStyle.promptHints}`.trim(),
  };
}

/**
 * Helper to get prompt type from analysis
 */
function getPromptTypeFromAnalysis(analysis) {
  switch (analysis.shotType) {
    case 'ANGLED': return 'angledShot';
    case 'CORNER': return 'cornerShot';
    case 'NO_FENCE': return 'newInstallation';
    default: return 'straightShot';
  }
}

/**
 * Helper to get style-specific details
 */
function getStyleDetailPrompt(fenceStyle) {
  const material = fenceStyle.material.toLowerCase();

  if (material.includes('cedar') || material.includes('wood') || material.includes('pine')) {
    if (fenceStyle.id.includes('horizontal')) {
      return STYLE_DETAIL_PROMPTS.woodHorizontal;
    }
    return STYLE_DETAIL_PROMPTS.woodPrivacy;
  }

  if (material.includes('iron') || material.includes('steel') || material.includes('aluminum')) {
    return STYLE_DETAIL_PROMPTS.wroughtIron;
  }

  if (material.includes('vinyl') || material.includes('pvc')) {
    return STYLE_DETAIL_PROMPTS.vinyl;
  }

  if (material.includes('chain')) {
    return STYLE_DETAIL_PROMPTS.chainLink;
  }

  if (fenceStyle.id.includes('picket')) {
    return STYLE_DETAIL_PROMPTS.picket;
  }

  return '';
}

module.exports = {
  FENCE_PROMPTS,
  PAINT_PROMPTS,
  ROOFING_PROMPTS,
  SHOT_DETECTION_PROMPT,
  FENCE_SIDE_INSTRUCTIONS,
  CONDITION_PROMPTS,
  SALES_PROMPTS,
  STYLE_DETAIL_PROMPTS,
  getReferenceSide,
  buildCompletePrompt,
  getPromptTypeFromAnalysis,
  getStyleDetailPrompt,
};
