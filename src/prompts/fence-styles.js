/**
 * FENCE STYLES LIBRARY
 *
 * Each style has:
 * - id: Unique identifier
 * - name: Display name
 * - material: What it's made of
 * - color: Default color
 * - height: Standard height
 * - description: For UI/sales purposes
 * - priceRange: Rough cost per linear foot
 * - promptHints: Extra details that help AI generate accurate images
 * - images: Paths to reference images (front and back if different)
 * - sameBothSides: true if fence looks identical from both sides
 * - salesPitch: Key selling points for the sales bot
 * - bestFor: Ideal use cases
 * - notFor: When to recommend something else
 */

const FENCE_STYLES = {
  // ============= WOOD PRIVACY FENCES =============
  woodPrivacyDogEar: {
    id: 'wood-privacy-dog-ear',
    name: 'Cedar Privacy Fence (Dog Ear)',
    material: 'Cedar wood',
    color: 'Natural cedar with light stain',
    height: '6 feet',
    postStyle: 'Square 4x4 wood posts with decorative caps',
    description: 'Classic solid wood privacy fence with dog-ear cut boards',
    priceRange: '$25-35 per linear foot installed',

    // Image references
    images: {
      front: 'wood-privacy/dog-ear-front.png',
      back: 'wood-privacy/dog-ear-back.png',
    },
    sameBothSides: false,

    // What the AI needs to know
    promptHints: `Vertical cedar boards placed tightly together with NO gaps (privacy fence).
Each board is approximately 5.5-6 inches wide.
DOG-EAR style: Top corners of each board are cut at 45° angles, creating a pointed appearance.
Natural wood grain clearly visible - golden-brown cedar color.
FRONT side: Smooth vertical boards only, no horizontal elements visible.
BACK side: 2-3 horizontal rails (stringers) visible - at top, middle, and bottom.
Posts are 4x4 cedar with pyramid or flat caps, spaced 8 feet apart.
Standard height is 6 feet from ground to top of boards.`,

    // Sales bot content
    salesPitch: {
      headline: 'The Classic Choice for Complete Privacy',
      benefits: [
        'Total privacy - no gaps between boards',
        'Natural cedar resists rot and insects',
        'Can be stained any color you want',
        'Timeless look that never goes out of style',
      ],
      objectionHandlers: {
        'too expensive': 'Cedar costs more upfront but lasts 15-20 years vs 5-7 for pine. You actually save money long-term.',
        'maintenance': 'Just re-stain every 3-5 years. Takes a weekend and keeps it looking brand new.',
        'will it rot': 'Cedar has natural oils that resist rot. That\'s why it\'s the #1 choice for outdoor wood.',
      },
      closingLine: 'This is the fence your neighbors will wish they had.',
    },
    bestFor: ['Backyards', 'Pool areas', 'Privacy from neighbors', 'Families with kids/pets'],
    notFor: ['Front yards (HOA may require different style)', 'Areas with extreme wind (solid = wind load)'],

    features: ['Full privacy', 'Natural look', 'Customizable stain colors', '15-20 year lifespan'],
  },

  woodPrivacyFlatTop: {
    id: 'wood-privacy-flat-top',
    name: 'Cedar Privacy Fence (Flat Top)',
    material: 'Cedar wood',
    color: 'Natural cedar',
    height: '6 feet',
    postStyle: 'Square 4x4 wood posts with flat caps',
    description: 'Modern solid wood privacy fence with flat-cut boards',
    priceRange: '$25-35 per linear foot installed',

    images: {
      front: 'wood-privacy/flat-top-front.png',
      back: 'wood-privacy/flat-top-back.png',
    },
    sameBothSides: false,

    promptHints: `Vertical cedar boards placed tightly together with NO gaps.
FLAT TOP style: Each board is cut straight across at the top - clean, horizontal line.
Creates a more modern, contemporary look than dog-ear style.
Natural cedar wood grain visible. Golden-brown color.
FRONT: Smooth vertical boards, clean top line.
BACK: Horizontal rails visible at top, middle, bottom.
Posts have flat caps (not pyramid) to match the flat-top aesthetic.`,

    salesPitch: {
      headline: 'Clean Lines, Modern Privacy',
      benefits: [
        'Sleek, contemporary appearance',
        'Same privacy as dog-ear, more modern look',
        'Clean horizontal line across the top',
        'Popular with newer homes',
      ],
      closingLine: 'The upgraded look without the upgraded price.',
    },
    bestFor: ['Modern homes', 'Contemporary landscaping', 'Clients who want "updated" look'],
    notFor: ['Traditional/historic homes'],

    features: ['Full privacy', 'Modern aesthetic', 'Clean lines'],
  },

  woodPrivacyWhite: {
    id: 'wood-privacy-white',
    name: 'White Painted Privacy Fence',
    material: 'Painted wood (pine or cedar)',
    color: 'Bright white paint',
    height: '6 feet',
    postStyle: 'Square 4x4 posts painted white with decorative caps',
    description: 'Classic white-painted solid privacy fence',
    priceRange: '$30-40 per linear foot installed',

    images: {
      front: 'wood-privacy/white-front.png',
      back: 'wood-privacy/white-back.png',
    },
    sameBothSides: false,

    promptHints: `Solid white-painted vertical boards with no gaps.
BRIGHT WHITE finish - clean and crisp, not cream or off-white.
Paint covers wood grain but may show subtle texture.
Classic traditional American look.
FRONT: Smooth white boards, uniform color.
BACK: Rails visible, also painted white.
Posts painted white with decorative caps (often flat or ball style).`,

    salesPitch: {
      headline: 'The All-American Classic',
      benefits: [
        'Bright, clean, classic look',
        'Makes yard feel bigger and brighter',
        'Traditional curb appeal',
        'Goes with any home style',
      ],
      objectionHandlers: {
        'maintenance': 'Yes, needs repainting every 5-7 years. But nothing beats that fresh white fence look.',
        'shows dirt': 'True, but it also cleans easily with a pressure washer.',
      },
      closingLine: 'The fence that says "welcome home."',
    },
    bestFor: ['Traditional homes', 'Colonial style', 'Clients who love classic look'],
    notFor: ['Low-maintenance seekers', 'Dusty/muddy areas'],

    features: ['Full privacy', 'Classic aesthetic', 'Bright appearance'],
  },

  boardOnBoard: {
    id: 'board-on-board',
    name: 'Board on Board Privacy Fence',
    material: 'Cedar wood',
    color: 'Natural cedar',
    height: '6 feet',
    postStyle: '4x4 wood posts',
    description: 'Overlapping boards for complete privacy with visual depth',
    priceRange: '$30-40 per linear foot installed',

    images: {
      front: 'wood-privacy/board-on-board-front.png',
      back: 'wood-privacy/board-on-board-back.png',
    },
    sameBothSides: false,

    promptHints: `Vertical boards OVERLAP each other by about 1 inch.
Creates a layered, dimensional look with shadows between boards.
Complete privacy - even more than standard privacy fence.
Alternating boards create depth and visual interest.
More material used = slightly thicker appearance.
Natural cedar color with visible wood grain.`,

    salesPitch: {
      headline: 'Premium Privacy with Character',
      benefits: [
        'Overlapping boards = zero gaps guaranteed',
        'Beautiful shadow lines add visual depth',
        'Handles wood shrinkage better (gaps don\'t appear)',
        'Premium look for premium properties',
      ],
      closingLine: 'For clients who want privacy done right.',
    },
    bestFor: ['Upscale properties', 'Clients concerned about gaps', 'Those who want visual interest'],
    notFor: ['Budget-conscious buyers'],

    features: ['Maximum privacy', 'Visual depth', 'Handles shrinkage'],
  },

  // ============= MODERN/HORIZONTAL FENCES =============
  cedarHorizontal: {
    id: 'cedar-horizontal',
    name: 'Modern Horizontal Cedar Fence',
    material: 'Cedar wood',
    color: 'Natural cedar or gray weathered',
    height: '6 feet',
    postStyle: 'Steel posts with wood sleeve or thick wood posts',
    description: 'Contemporary horizontal slat design',
    priceRange: '$40-55 per linear foot installed',

    images: {
      front: 'wood-horizontal/cedar-slat-front.png',
      back: 'wood-horizontal/cedar-slat-back.png',
    },
    sameBothSides: false,

    promptHints: `Boards run HORIZONTALLY (left to right), NOT vertically.
Boards are 1x6 or 1x8 cedar planks.
Small gaps (0.5-1 inch) between each horizontal board.
Creates modern, contemporary, high-end aesthetic.
FRONT: Clean horizontal lines, boards appear to float.
BACK: Vertical support posts/frame visible.
Posts often minimalist steel or hidden behind boards.
Natural cedar golden-brown OR weathered gray stain.
Think: modern architecture, Dwell magazine, high-end landscaping.`,

    salesPitch: {
      headline: 'The Designer\'s Choice',
      benefits: [
        'Striking modern appearance',
        'Featured in architecture magazines',
        'Makes any property look high-end',
        'Partial privacy with airflow',
        'Unique - neighbors won\'t have the same fence',
      ],
      objectionHandlers: {
        'too expensive': 'This is the fence you see on million-dollar homes. It transforms your property value.',
        'not private enough': 'We can adjust the gap size - or go with no gaps for full privacy horizontal.',
      },
      closingLine: 'This fence doesn\'t just contain your yard. It makes a statement.',
    },
    bestFor: ['Modern homes', 'Contemporary architecture', 'Design-conscious clients', 'High-end properties'],
    notFor: ['Traditional homes', 'Budget buyers', 'Full privacy needed'],

    features: ['Modern look', 'Airflow', 'High-end appearance', 'Architectural'],
  },

  // ============= GOOD NEIGHBOR / SHADOW BOX =============
  shadowBox: {
    id: 'shadow-box',
    name: 'Shadow Box Fence',
    material: 'Cedar or pine wood',
    color: 'Natural wood or stained',
    height: '6 feet',
    postStyle: '4x4 wood posts',
    description: 'Alternating boards on both sides - looks great from everywhere',
    priceRange: '$30-40 per linear foot installed',

    images: {
      front: 'shadow-box/cedar-natural.png',
    },
    sameBothSides: true, // Looks same from both sides!

    promptHints: `Vertical boards ALTERNATE on front and back of horizontal rails.
Board on front, gap, board on back, gap, board on front, etc.
Creates a woven/basket-weave appearance.
BOTH SIDES LOOK IDENTICAL - this is the key feature!
Partial visibility through gaps when viewed at angle.
"Good neighbor" fence - no "ugly side" for neighbors.
Natural wood appearance, cedar or pine.
Allows significant airflow while maintaining visual privacy.`,

    salesPitch: {
      headline: 'The Good Neighbor Fence',
      benefits: [
        'Looks beautiful from BOTH sides',
        'No "ugly side" facing neighbors',
        'Allows airflow (great for windy areas)',
        'Reduces wind load vs solid fence',
        'Unique woven appearance',
      ],
      objectionHandlers: {
        'not private enough': 'From straight on it\'s quite private. At angles you can see through - but so can you see out.',
        'neighbors': 'This is the fence that keeps neighbors happy. They get the same view you do.',
      },
      closingLine: 'Why make enemies when you can make your fence a feature?',
    },
    bestFor: ['Corner lots', 'Friendly neighbor situations', 'Windy areas', 'Shared fence lines'],
    notFor: ['Maximum privacy needs', 'Nosy neighbor situations'],

    features: ['Same both sides', 'Airflow', 'Good neighbor', 'Wind resistant'],
  },

  // ============= METAL FENCES =============
  wroughtIron: {
    id: 'wrought-iron',
    name: 'Wrought Iron Fence',
    material: 'Iron/Steel',
    color: 'Black',
    height: '4-6 feet',
    postStyle: 'Thick iron posts with decorative finials',
    description: 'Elegant traditional iron fence with decorative details',
    priceRange: '$30-50 per linear foot installed',

    images: {
      front: 'metal-aluminum/wrought-iron-black.png',
    },
    sameBothSides: true,

    promptHints: `Vertical iron bars (pickets) with pointed decorative tops.
FINIAL STYLES: spear point, fleur-de-lis, ball top, or trident.
Classic BLACK powder-coated finish.
Horizontal rails at top and bottom connecting pickets.
Pickets evenly spaced (typically 4 inches apart).
Posts are THICKER than pickets with decorative caps/finials.
Elegant, formal, upscale appearance.
TRANSPARENT fence - you see through it completely.
Often seen on historic homes, upscale neighborhoods, estates.`,

    salesPitch: {
      headline: 'Timeless Elegance',
      benefits: [
        'The most elegant fence option',
        'Lasts 50+ years with proper care',
        'Increases property value',
        'Security without blocking views',
        'Classic look that never dates',
      ],
      objectionHandlers: {
        'no privacy': 'Wrought iron is about elegance and security, not privacy. Perfect for front yards and showcasing landscaping.',
        'will it rust': 'Modern powder-coating prevents rust for decades. Just touch up any chips.',
        'expensive': 'This fence will outlive you. It\'s the last fence you\'ll ever buy.',
      },
      closingLine: 'Some things are worth the investment. This is one of them.',
    },
    bestFor: ['Front yards', 'Historic homes', 'Upscale properties', 'Pool enclosures', 'Security + views'],
    notFor: ['Privacy needs', 'Budget buyers', 'Casual/rustic aesthetics'],

    features: ['Elegant', '50+ year lifespan', 'Security', 'Visibility', 'Classic'],
  },

  aluminum: {
    id: 'aluminum',
    name: 'Aluminum Fence',
    material: 'Aluminum',
    color: 'Black',
    height: '4-6 feet',
    postStyle: 'Square aluminum posts with flat caps',
    description: 'Low-maintenance metal fence with clean modern look',
    priceRange: '$25-40 per linear foot installed',

    images: {
      front: 'metal-aluminum/aluminum-black.png',
    },
    sameBothSides: true,

    promptHints: `Vertical aluminum pickets with flat tops or minimal decorative tops.
CLEANER, more modern look than wrought iron.
Usually BLACK but can be bronze or white.
Hollow aluminum construction - lighter than iron.
Smooth, uniform, manufactured finish.
More uniform/consistent appearance than traditional iron.
Horizontal rails at top and bottom.
Pool-code compliant spacing available (closer pickets).`,

    salesPitch: {
      headline: 'Modern Metal, Zero Maintenance',
      benefits: [
        'Will NEVER rust (it\'s aluminum)',
        'Lighter and easier to install than iron',
        'Clean, modern appearance',
        'Pool code compliant options',
        'Costs less than wrought iron, similar look',
      ],
      objectionHandlers: {
        'looks cheap': 'Modern aluminum fences are indistinguishable from iron to most people.',
        'not as strong': 'For residential use, aluminum is more than strong enough. And it won\'t rust.',
      },
      closingLine: 'All the look of iron, none of the maintenance.',
    },
    bestFor: ['Pool areas', 'Front yards', 'Low-maintenance seekers', 'Modern homes'],
    notFor: ['Privacy needs', 'Historic authenticity'],

    features: ['Rust-proof', 'Low maintenance', 'Pool code compliant', 'Modern'],
  },

  // ============= CHAIN LINK =============
  chainLink: {
    id: 'chain-link',
    name: 'Chain Link Fence',
    material: 'Galvanized steel',
    color: 'Silver/Galvanized',
    height: '4-6 feet',
    postStyle: 'Round steel posts with dome caps',
    description: 'Affordable, functional, transparent fencing',
    priceRange: '$10-20 per linear foot installed',

    images: {
      front: 'chain-link/galvanized.png',
    },
    sameBothSides: true,

    promptHints: `Diamond/rhombus pattern woven wire mesh.
SILVER/METALLIC galvanized steel color.
Round posts at corners and every 10 feet.
Tension wire runs along top and bottom edges.
Top rail: horizontal pipe running along the top.
Very UTILITARIAN/INDUSTRIAL appearance.
FULLY TRANSPARENT - you see right through it.
The most affordable and functional fence option.`,

    salesPitch: {
      headline: 'Gets the Job Done',
      benefits: [
        'Most affordable fence option',
        'Extremely durable',
        'Quick installation',
        'Contains pets/kids effectively',
        'Easy to repair',
      ],
      objectionHandlers: {
        'looks ugly': 'It\'s functional, not decorative. For back yards or side yards, it does the job for half the price.',
        'no privacy': 'Add privacy slats if needed. Or consider it for areas where you want to see through.',
      },
      closingLine: 'Sometimes practical is the right choice.',
    },
    bestFor: ['Budget buyers', 'Pet containment', 'Sports areas', 'Temporary needs', 'Side/back yards'],
    notFor: ['Front yards', 'Privacy', 'Aesthetics-focused clients'],

    features: ['Affordable', 'Durable', 'Transparent', 'Quick install'],
  },

  chainLinkBlack: {
    id: 'chain-link-black',
    name: 'Black Vinyl-Coated Chain Link',
    material: 'Vinyl-coated steel',
    color: 'Black',
    height: '4-6 feet',
    postStyle: 'Black round posts',
    description: 'Chain link with black coating - blends into landscape',
    priceRange: '$15-25 per linear foot installed',

    images: {
      front: 'chain-link/black-vinyl.png',
    },
    sameBothSides: true,

    promptHints: `Same diamond pattern as regular chain link.
COATED IN BLACK VINYL - all black color.
Black posts and rails too.
Much less industrial looking than galvanized.
Blends into background/landscaping better.
Almost disappears visually from a distance.
Still fully transparent but less visually obtrusive.`,

    salesPitch: {
      headline: 'Chain Link That Disappears',
      benefits: [
        'Black color blends into landscape',
        'Much better looking than silver chain link',
        'Vinyl coating adds weather protection',
        'Still affordable',
        'Almost invisible from a distance',
      ],
      closingLine: 'The practical choice that doesn\'t look like it.',
    },
    bestFor: ['Wooded lots', 'Dark landscaping', 'Those who want chain link but better looking'],
    notFor: ['Same as regular chain link'],

    features: ['Blends in', 'Weather resistant', 'Affordable', 'Less visible'],
  },

  // ============= VINYL FENCES =============
  vinylPrivacy: {
    id: 'vinyl-privacy',
    name: 'White Vinyl Privacy Fence',
    material: 'PVC/Vinyl',
    color: 'White',
    height: '6 feet',
    postStyle: 'Square vinyl posts with flat or pyramid caps',
    description: 'Maintenance-free solid privacy fence',
    priceRange: '$25-40 per linear foot installed',

    images: {
      front: 'vinyl-privacy/white.png',
    },
    sameBothSides: true, // Vinyl looks same both sides

    promptHints: `Solid WHITE vinyl panels with tongue-and-groove boards.
VERY CLEAN, BRIGHT WHITE appearance - almost glowing.
NO visible wood grain - smooth plastic finish.
Posts are hollow vinyl with decorative caps.
Smooth, uniform, perfect finish.
Can look almost "too perfect" or plastic-like - this is correct.
Rails are HIDDEN inside the panels.
Looks the same from both sides.`,

    salesPitch: {
      headline: 'Set It and Forget It',
      benefits: [
        'ZERO maintenance - never paint or stain',
        'Just hose it off to clean',
        'Won\'t rot, warp, or get termites',
        'Looks new for 20+ years',
        'Bright white that stays white',
      ],
      objectionHandlers: {
        'looks fake': 'It\'s not trying to look like wood. It\'s vinyl and proud of it. That\'s why it lasts forever.',
        'cracks in cold': 'Modern vinyl is engineered for temperature changes. Just don\'t hit it with a baseball bat in winter.',
        'fades': 'Quality vinyl has UV inhibitors. It stays white, not yellow.',
      },
      closingLine: 'Twenty years from now, this fence will look exactly like it does today.',
    },
    bestFor: ['Low-maintenance seekers', 'Pool areas', 'Rental properties', 'Busy homeowners'],
    notFor: ['Natural aesthetic lovers', 'Historic homes'],

    features: ['Zero maintenance', 'Never paint', 'Stays white', '20+ year life'],
  },

  vinylPrivacyTan: {
    id: 'vinyl-privacy-tan',
    name: 'Tan Vinyl Privacy Fence',
    material: 'PVC/Vinyl',
    color: 'Tan/Almond',
    height: '6 feet',
    postStyle: 'Square vinyl posts with caps',
    description: 'Maintenance-free privacy fence in warm tan color',
    priceRange: '$25-40 per linear foot installed',

    images: {
      front: 'vinyl-privacy/tan.png',
    },
    sameBothSides: true,

    promptHints: `Same as white vinyl but in TAN/ALMOND/BEIGE color.
Slightly warmer appearance than bright white.
Blends better with earth tones and desert landscapes.
Smooth vinyl finish, no wood grain texture.
Still that clean, perfect vinyl look - just in tan.`,

    salesPitch: {
      headline: 'Warm Color, Zero Work',
      benefits: [
        'All the benefits of vinyl in a warmer color',
        'Hides dirt better than white',
        'Complements earth-tone homes',
        'Same zero maintenance',
      ],
      closingLine: 'For those who love vinyl but want warmer tones.',
    },
    bestFor: ['Earth-tone homes', 'Desert/southwestern style', 'Less stark than white'],
    notFor: ['Those wanting crisp white look'],

    features: ['Zero maintenance', 'Warm color', 'Hides dirt better'],
  },

  // ============= PICKET FENCES =============
  picket: {
    id: 'picket',
    name: 'White Picket Fence',
    material: 'Wood or vinyl',
    color: 'White',
    height: '3-4 feet',
    postStyle: 'Square posts with decorative caps',
    description: 'The classic American front yard fence',
    priceRange: '$15-25 per linear foot installed',

    images: {
      front: 'picket/white-pointed.png',
    },
    sameBothSides: true, // Picket fences look same both sides

    promptHints: `Vertical PICKETS with pointed or rounded tops.
Evenly spaced with GAPS roughly equal to picket width.
You can see through it - NOT a privacy fence.
Height typically 3-4 FEET (shorter than privacy fences).
Two horizontal rails (top and bottom).
Decorative post caps (ball, flat, or gothic style).
WHITE color - bright and clean.
Quintessential American front yard fence.
Think: Norman Rockwell, American dream, Welcome home.`,

    salesPitch: {
      headline: 'The American Dream in Fence Form',
      benefits: [
        'Instant curb appeal',
        'Defines property without blocking views',
        'Classic look that never goes out of style',
        'Welcoming, friendly appearance',
        'Contains pets while looking beautiful',
      ],
      objectionHandlers: {
        'no privacy': 'Picket fences aren\'t for privacy - they\'re for charm and curb appeal. Perfect for front yards.',
        'maintenance': 'Go with vinyl picket for zero maintenance with the same classic look.',
      },
      closingLine: 'There\'s a reason this fence is an American icon.',
    },
    bestFor: ['Front yards', 'Cottage-style homes', 'Pet containment with style', 'Curb appeal'],
    notFor: ['Privacy', 'Modern architecture', 'Back yards'],

    features: ['Classic look', 'Curb appeal', 'Defines boundaries', 'Welcoming'],
  },

  // ============= COMPOSITE =============
  composite: {
    id: 'composite',
    name: 'Composite Fence',
    material: 'Wood-plastic composite',
    color: 'Various browns/grays',
    height: '6 feet',
    postStyle: 'Composite or aluminum posts',
    description: 'Eco-friendly, durable, wood-look without the maintenance',
    priceRange: '$35-60 per linear foot installed',

    images: {
      front: 'composite/brown.png',
    },
    sameBothSides: true,

    promptHints: `Looks SIMILAR to wood but more UNIFORM in color and texture.
Made from recycled wood fibers and plastic.
Colors: browns, grays, and wood tones - very consistent.
May have simulated wood grain texture but very even/regular.
More CONSISTENT than real wood - no knots or variations.
Can be horizontal or vertical board patterns.
Posts often metal or matching composite.
Modern, clean, eco-friendly appearance.`,

    salesPitch: {
      headline: 'Wood Look Without Wood Problems',
      benefits: [
        'Made from recycled materials',
        'Zero maintenance like vinyl',
        'Looks more natural than vinyl',
        'Won\'t rot, warp, or splinter',
        'Lasts 25+ years',
      ],
      objectionHandlers: {
        'expensive': 'Compare total cost over 20 years including maintenance. Composite wins.',
        'doesn\'t look like real wood': 'It\'s meant to look better than real wood. Perfectly consistent, no flaws.',
      },
      closingLine: 'The best of wood and vinyl combined.',
    },
    bestFor: ['Eco-conscious buyers', 'Modern homes', 'Low maintenance + natural look'],
    notFor: ['Budget buyers', 'Traditional purists'],

    features: ['Eco-friendly', 'Zero maintenance', 'Natural look', '25+ year life'],
  },

  // ============= FARM/RANCH =============
  farmRanch: {
    id: 'farm-ranch',
    name: 'Ranch Rail Fence',
    material: 'Wood',
    color: 'Natural or white',
    height: '4-5 feet',
    postStyle: 'Round or square wood posts',
    description: 'Classic ranch style with horizontal rails only',
    priceRange: '$10-20 per linear foot installed',

    images: {
      front: 'picket/ranch-rail-white.png',
    },
    sameBothSides: true,

    promptHints: `2-4 HORIZONTAL wood rails mounted between posts.
NO vertical boards - just horizontal rails.
VERY OPEN design - you see completely through it.
Often WHITE-PAINTED or NATURAL wood.
Posts can be round or square, often 6x6 or round posts.
Classic RANCH/FARM appearance.
Also called split-rail or post-and-rail.
Think: horse pastures, rural properties, country estates.`,

    salesPitch: {
      headline: 'Country Character',
      benefits: [
        'Authentic rural/ranch aesthetic',
        'Safe for horses and livestock',
        'Affordable for large properties',
        'Defines boundaries without obstructing views',
        'Classic farmhouse look',
      ],
      closingLine: 'Bring a piece of the country to your property.',
    },
    bestFor: ['Large properties', 'Rural/country style', 'Horse properties', 'Front boundary definition'],
    notFor: ['Privacy', 'Pet containment (small pets)', 'Urban/suburban settings'],

    features: ['Rural aesthetic', 'Horse-friendly', 'Open views', 'Affordable'],
  },
};

// ============= HELPER FUNCTIONS =============

/**
 * Get style by ID (supports both object key and id property)
 */
function getStyle(styleId) {
  // Direct key match
  if (FENCE_STYLES[styleId]) {
    return FENCE_STYLES[styleId];
  }
  // Search by id property
  return Object.values(FENCE_STYLES).find(s => s.id === styleId);
}

/**
 * Get all styles as array
 */
function getAllStyles() {
  return Object.values(FENCE_STYLES);
}

/**
 * Get styles by material type
 */
function getStylesByMaterial(material) {
  return Object.values(FENCE_STYLES).filter(
    s => s.material.toLowerCase().includes(material.toLowerCase())
  );
}

/**
 * Get styles that provide privacy
 */
function getPrivacyStyles() {
  return Object.values(FENCE_STYLES).filter(
    s => s.features?.includes('Full privacy') || s.features?.includes('Maximum privacy')
  );
}

/**
 * Get styles that look same from both sides
 */
function getSameBothSidesStyles() {
  return Object.values(FENCE_STYLES).filter(s => s.sameBothSides);
}

/**
 * Get styles for a specific use case
 */
function getStylesForUseCase(useCase) {
  return Object.values(FENCE_STYLES).filter(
    s => s.bestFor?.some(u => u.toLowerCase().includes(useCase.toLowerCase()))
  );
}

/**
 * Get styles for a contractor (they can customize this list)
 */
function getContractorStyles(styleIds) {
  return styleIds.map(id => getStyle(id)).filter(Boolean);
}

/**
 * Get reference image path for a style and side
 */
function getReferenceImage(styleId, side = 'front') {
  const style = getStyle(styleId);
  if (!style) return null;

  if (style.sameBothSides || !style.images[side]) {
    return style.images.front;
  }

  return style.images[side];
}

/**
 * Get styles organized by category for UI
 */
function getStylesByCategory() {
  return {
    'Wood Privacy': [
      FENCE_STYLES.woodPrivacyDogEar,
      FENCE_STYLES.woodPrivacyFlatTop,
      FENCE_STYLES.woodPrivacyWhite,
      FENCE_STYLES.boardOnBoard,
    ],
    'Modern': [
      FENCE_STYLES.cedarHorizontal,
      FENCE_STYLES.composite,
    ],
    'Good Neighbor': [
      FENCE_STYLES.shadowBox,
    ],
    'Metal': [
      FENCE_STYLES.wroughtIron,
      FENCE_STYLES.aluminum,
    ],
    'Chain Link': [
      FENCE_STYLES.chainLink,
      FENCE_STYLES.chainLinkBlack,
    ],
    'Vinyl': [
      FENCE_STYLES.vinylPrivacy,
      FENCE_STYLES.vinylPrivacyTan,
    ],
    'Decorative': [
      FENCE_STYLES.picket,
      FENCE_STYLES.farmRanch,
    ],
  };
}

module.exports = {
  FENCE_STYLES,
  getStyle,
  getAllStyles,
  getStylesByMaterial,
  getPrivacyStyles,
  getSameBothSidesStyles,
  getStylesForUseCase,
  getContractorStyles,
  getReferenceImage,
  getStylesByCategory,
};
