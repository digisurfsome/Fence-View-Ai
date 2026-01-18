/**
 * FENCE STYLES LIBRARY
 *
 * Each style has:
 * - id: Unique identifier
 * - name: Display name
 * - material: What it's made of
 * - color: Default color
 * - description: For UI/sales purposes
 * - priceRange: Rough cost per linear foot
 * - promptHints: Extra details that help AI generate accurate images
 * - referenceImage: Path to clean reference photo (6ft section, front view)
 */

const FENCE_STYLES = {
  // ============= WOOD FENCES =============
  woodPrivacy: {
    id: 'wood-privacy',
    name: 'Wood Privacy Fence',
    material: 'Cedar wood',
    color: 'Natural cedar with light stain',
    height: '6 feet',
    postStyle: 'Square 4x4 wood posts with decorative caps',
    description: 'Classic solid wood privacy fence with vertical boards',
    priceRange: '$25-35 per linear foot installed',
    features: ['Full privacy', 'Natural look', 'Customizable stain colors'],
    promptHints: `Vertical cedar boards placed tightly together with no gaps.
Each board is approximately 6 inches wide. Horizontal rails visible on back side only.
Top can be flat cut or dog-ear style. Natural wood grain visible.
Posts are 4x4 cedar with pyramid or flat caps, spaced 8 feet apart.`,
    referenceImage: 'fence-styles/wood-privacy.jpg',
  },

  woodPrivacyWhite: {
    id: 'wood-privacy-white',
    name: 'White Wood Privacy Fence',
    material: 'Painted wood',
    color: 'Bright white paint',
    height: '6 feet',
    postStyle: 'Square 4x4 wood posts painted white with caps',
    description: 'Classic white-painted solid privacy fence',
    priceRange: '$30-40 per linear foot installed',
    features: ['Full privacy', 'Clean aesthetic', 'Requires maintenance'],
    promptHints: `Solid white-painted vertical boards with no gaps.
Clean, bright white finish. Posts painted white with decorative caps.
Crisp, traditional American look. May show subtle wood texture under paint.`,
    referenceImage: 'fence-styles/wood-privacy-white.jpg',
  },

  cedarHorizontal: {
    id: 'cedar-horizontal',
    name: 'Modern Horizontal Cedar',
    material: 'Cedar wood',
    color: 'Natural cedar or gray weathered',
    height: '6 feet',
    postStyle: 'Steel posts with wood sleeve or thick wood posts',
    description: 'Contemporary horizontal slat design',
    priceRange: '$40-55 per linear foot installed',
    features: ['Modern look', 'Partial privacy', 'High-end appearance'],
    promptHints: `Horizontal cedar boards running left to right.
Boards are 1x6 or 1x8 with small gaps (0.5-1 inch) between each board.
Creates a modern, contemporary aesthetic. Posts may be hidden or minimalist.
Often paired with modern architecture. Natural cedar color or gray stain.`,
    referenceImage: 'fence-styles/cedar-horizontal.jpg',
  },

  picket: {
    id: 'picket',
    name: 'Classic Picket Fence',
    material: 'Wood or vinyl',
    color: 'White',
    height: '3-4 feet',
    postStyle: 'Square posts with decorative caps',
    description: 'Traditional American picket fence',
    priceRange: '$15-25 per linear foot installed',
    features: ['Open design', 'Traditional charm', 'Front yard classic'],
    promptHints: `Vertical pickets with pointed or rounded tops, evenly spaced.
Gaps between pickets roughly equal to picket width. Usually white.
Height typically 3-4 feet. Two horizontal rails. Decorative post caps.
Quintessential American front yard fence.`,
    referenceImage: 'fence-styles/picket-white.jpg',
  },

  shadowBox: {
    id: 'shadow-box',
    name: 'Shadow Box Fence',
    material: 'Cedar or pine wood',
    color: 'Natural wood or stained',
    height: '6 feet',
    postStyle: '4x4 wood posts',
    description: 'Alternating boards on both sides for semi-privacy',
    priceRange: '$30-40 per linear foot installed',
    features: ['Good neighbor fence', 'Air flow', 'Attractive both sides'],
    promptHints: `Vertical boards alternating on front and back of horizontal rails.
Creates a woven appearance with partial visibility through gaps.
Looks the same from both sides - no "bad side." Natural wood appearance.
Allows airflow while providing significant privacy.`,
    referenceImage: 'fence-styles/shadow-box.jpg',
  },

  // ============= METAL FENCES =============
  wroughtIron: {
    id: 'wrought-iron',
    name: 'Wrought Iron Fence',
    material: 'Iron/Steel',
    color: 'Black',
    height: '4-6 feet',
    postStyle: 'Thick iron posts with decorative finials',
    description: 'Elegant traditional iron fence',
    priceRange: '$30-50 per linear foot installed',
    features: ['Elegant', 'Durable', 'Security', 'Visibility'],
    promptHints: `Vertical iron bars (pickets) with pointed finial tops, usually spear or fleur-de-lis style.
Classic black color. Horizontal rails top and bottom connecting the pickets.
Posts are thicker with decorative caps or ball finials.
Elegant, formal appearance. Often seen on upscale properties.
Shows the yard while providing security barrier.`,
    referenceImage: 'fence-styles/wrought-iron.jpg',
  },

  aluminum: {
    id: 'aluminum',
    name: 'Aluminum Fence',
    material: 'Aluminum',
    color: 'Black',
    height: '4-6 feet',
    postStyle: 'Square aluminum posts with flat caps',
    description: 'Low-maintenance metal fence',
    priceRange: '$25-40 per linear foot installed',
    features: ['Rust-proof', 'Low maintenance', 'Pool code compliant'],
    promptHints: `Vertical aluminum pickets with minimal decorative tops or flat tops.
Cleaner, more modern look than wrought iron. Hollow aluminum construction.
Usually black but can be bronze or white. Smooth finish.
More uniform and manufactured appearance than traditional iron.`,
    referenceImage: 'fence-styles/aluminum.jpg',
  },

  chainLink: {
    id: 'chain-link',
    name: 'Chain Link Fence',
    material: 'Galvanized steel',
    color: 'Silver/Galvanized',
    height: '4-6 feet',
    postStyle: 'Round steel posts with dome caps',
    description: 'Affordable and functional',
    priceRange: '$10-20 per linear foot installed',
    features: ['Affordable', 'Durable', 'Full visibility'],
    promptHints: `Diamond pattern woven wire mesh. Silver galvanized steel color.
Round posts at corners and intervals. Tension wire along top and bottom.
Top rail runs horizontally along the top. Very utilitarian appearance.
Transparent fence - full visibility through it.`,
    referenceImage: 'fence-styles/chain-link.jpg',
  },

  chainLinkBlack: {
    id: 'chain-link-black',
    name: 'Black Vinyl Chain Link',
    material: 'Vinyl-coated steel',
    color: 'Black',
    height: '4-6 feet',
    postStyle: 'Black round posts',
    description: 'Chain link with black vinyl coating',
    priceRange: '$15-25 per linear foot installed',
    features: ['Better appearance than standard', 'Durable', 'Affordable'],
    promptHints: `Same diamond pattern as regular chain link but coated in black vinyl.
Black posts and rails. Much less industrial looking than galvanized.
Blends into background better, especially with dark landscaping.`,
    referenceImage: 'fence-styles/chain-link-black.jpg',
  },

  // ============= VINYL FENCES =============
  vinylPrivacy: {
    id: 'vinyl-privacy',
    name: 'Vinyl Privacy Fence',
    material: 'PVC/Vinyl',
    color: 'White',
    height: '6 feet',
    postStyle: 'Square vinyl posts with flat or pyramid caps',
    description: 'Maintenance-free privacy fence',
    priceRange: '$25-40 per linear foot installed',
    features: ['No painting needed', 'Easy clean', 'Long lasting'],
    promptHints: `Solid white vinyl panels with tongue-and-groove boards.
Very clean, bright white appearance. No visible grain or texture.
Posts are hollow vinyl with decorative caps. Smooth, uniform finish.
Can look almost plastic-like. Rails hidden inside panels.`,
    referenceImage: 'fence-styles/vinyl-privacy.jpg',
  },

  vinylPrivacyTan: {
    id: 'vinyl-privacy-tan',
    name: 'Tan Vinyl Privacy Fence',
    material: 'PVC/Vinyl',
    color: 'Tan/Almond',
    height: '6 feet',
    postStyle: 'Square vinyl posts with caps',
    description: 'Tan vinyl for warmer appearance',
    priceRange: '$25-40 per linear foot installed',
    features: ['No painting needed', 'Warmer color than white', 'Low maintenance'],
    promptHints: `Same as white vinyl but in tan/almond/beige color.
Slightly warmer appearance, blends with desert/southwestern landscapes.
Smooth vinyl finish, no wood grain texture.`,
    referenceImage: 'fence-styles/vinyl-privacy-tan.jpg',
  },

  // ============= COMPOSITE FENCES =============
  composite: {
    id: 'composite',
    name: 'Composite Fence',
    material: 'Wood-plastic composite',
    color: 'Various browns/grays',
    height: '6 feet',
    postStyle: 'Composite or aluminum posts',
    description: 'Eco-friendly, durable composite material',
    priceRange: '$35-60 per linear foot installed',
    features: ['Eco-friendly', 'Lasts 25+ years', 'No maintenance'],
    promptHints: `Looks similar to wood but more uniform in color and texture.
Horizontal or vertical board patterns. Colors include browns, grays, and wood tones.
May have simulated wood grain texture. More consistent than real wood.
Often used in modern designs. Posts can be metal or matching composite.`,
    referenceImage: 'fence-styles/composite.jpg',
  },

  // ============= SPECIALTY =============
  farmRanch: {
    id: 'farm-ranch',
    name: 'Farm/Ranch Rail Fence',
    material: 'Wood',
    color: 'Natural or white',
    height: '4-5 feet',
    postStyle: 'Round or square wood posts',
    description: 'Classic ranch style with horizontal rails',
    priceRange: '$10-20 per linear foot installed',
    features: ['Rural aesthetic', 'Horse-friendly', 'Open design'],
    promptHints: `2-4 horizontal wood rails mounted on posts. No vertical boards.
Very open design - you can see through it completely.
Often white-painted or natural wood. Posts can be round or square.
Classic ranch/farm appearance. Sometimes called split-rail or post-and-rail.`,
    referenceImage: 'fence-styles/farm-ranch.jpg',
  },
};

/**
 * Get style by ID
 */
function getStyle(styleId) {
  return FENCE_STYLES[styleId] || Object.values(FENCE_STYLES).find(s => s.id === styleId);
}

/**
 * Get all styles as array
 */
function getAllStyles() {
  return Object.values(FENCE_STYLES);
}

/**
 * Get styles by material
 */
function getStylesByMaterial(material) {
  return Object.values(FENCE_STYLES).filter(
    s => s.material.toLowerCase().includes(material.toLowerCase())
  );
}

/**
 * Get styles for a contractor (they can customize this list)
 */
function getContractorStyles(styleIds) {
  return styleIds.map(id => getStyle(id)).filter(Boolean);
}

module.exports = {
  FENCE_STYLES,
  getStyle,
  getAllStyles,
  getStylesByMaterial,
  getContractorStyles,
};
