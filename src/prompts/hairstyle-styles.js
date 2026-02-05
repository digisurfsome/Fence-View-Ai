/**
 * HAIRSTYLE STYLES LIBRARY
 *
 * Each style has:
 * - id: Unique identifier
 * - name: Display name
 * - category: Style category (short, medium, long, color, etc.)
 * - gender: 'unisex', 'feminine', 'masculine'
 * - description: For UI display
 * - length: Approximate hair length
 * - promptHints: Extra details that help AI generate accurate transformations
 * - bestFor: Face shapes and hair types this works well with
 * - notFor: When to recommend something else
 * - maintenanceLevel: low, medium, high
 * - tags: Searchable tags
 */

const HAIRSTYLE_STYLES = {
  // ============= SHORT STYLES =============
  pixieCut: {
    id: 'pixie-cut',
    name: 'Pixie Cut',
    category: 'Short',
    gender: 'unisex',
    length: 'Very short (1-3 inches)',
    description: 'Bold, close-cropped style that frames the face beautifully',
    maintenanceLevel: 'low',

    promptHints: `Short cropped hairstyle close to the head.
Hair is 1-3 inches long on top, shorter on sides and back.
Textured layers on top for volume and movement.
Ears are fully exposed. Neckline is clean and tapered.
Can be styled with side-swept bangs or pushed forward.
Emphasizes facial features - cheekbones, eyes, jawline.
Think: Audrey Hepburn, Halle Berry classic pixie.`,

    bestFor: ['Oval faces', 'Heart-shaped faces', 'Strong cheekbones', 'Fine hair', 'Thick hair'],
    notFor: ['Round faces (may emphasize width)', 'Very curly hair (harder to maintain)'],
    tags: ['short', 'pixie', 'cropped', 'bold', 'low-maintenance'],
  },

  buzzCut: {
    id: 'buzz-cut',
    name: 'Buzz Cut',
    category: 'Short',
    gender: 'masculine',
    length: 'Very short (uniform 1/4 - 1/2 inch)',
    description: 'Clean, uniform ultra-short cut',
    maintenanceLevel: 'low',

    promptHints: `Uniform very short hair all over the head.
Clipped to approximately 1/4 to 1/2 inch length.
Shows the natural shape of the skull.
No distinct parting or styling.
Clean, neat, military-inspired look.
Hair appears as an even fuzz/stubble across the entire head.
Hairline and temples are clean and defined.`,

    bestFor: ['Well-shaped heads', 'Strong jawlines', 'Athletic build', 'Receding hairlines'],
    notFor: ['Irregularly shaped skulls', 'Large ears'],
    tags: ['short', 'buzz', 'military', 'minimal', 'ultra-short'],
  },

  classicTaper: {
    id: 'classic-taper',
    name: 'Classic Taper Fade',
    category: 'Short',
    gender: 'masculine',
    length: 'Short (2-4 inches on top)',
    description: 'Clean sides fading into longer top - the modern gentleman',
    maintenanceLevel: 'medium',

    promptHints: `Sides and back are faded/tapered from skin to short.
Top is 2-4 inches, styled back or to the side.
Gradient transition from very short at ears to longer at crown.
Clean, defined part line (optional).
Neat, professional appearance.
Can be styled with pomade for slick look or textured for casual.
Think: modern barbershop, clean-cut professional.`,

    bestFor: ['All face shapes', 'Professional settings', 'Thick hair', 'Straight to wavy hair'],
    notFor: ['Those wanting very low maintenance'],
    tags: ['short', 'fade', 'taper', 'professional', 'barbershop', 'clean'],
  },

  // ============= MEDIUM STYLES =============
  bob: {
    id: 'bob',
    name: 'Classic Bob',
    category: 'Medium',
    gender: 'feminine',
    length: 'Chin to shoulder length',
    description: 'Timeless chin-length cut with clean lines',
    maintenanceLevel: 'medium',

    promptHints: `Hair cut to chin length or slightly below.
Blunt, straight-across bottom edge creates a clean line.
Hair swings freely and has natural movement.
Can be parted in center or to the side.
Smooth, sleek appearance with slight inward curl at ends.
Face-framing layers optional.
Think: classic, polished, timeless sophistication.`,

    bestFor: ['Oval faces', 'Long faces', 'Fine hair (adds volume)', 'Straight hair'],
    notFor: ['Very round faces (blunt line can emphasize width)'],
    tags: ['medium', 'bob', 'classic', 'polished', 'timeless'],
  },

  longBob: {
    id: 'long-bob',
    name: 'Lob (Long Bob)',
    category: 'Medium',
    gender: 'feminine',
    length: 'Shoulder length',
    description: 'The universally flattering shoulder-length cut',
    maintenanceLevel: 'medium',

    promptHints: `Hair reaches the shoulders or collarbone area.
Longer than a classic bob but still structured.
Can be blunt cut or with soft layers.
Extremely versatile - works straight, wavy, or curled.
Often styled with beachy waves or smooth blowout.
The "safe but stylish" haircut - flatters everyone.
Think: modern, effortless, adaptable.`,

    bestFor: ['All face shapes', 'All hair types', 'First-time short hair', 'Versatility seekers'],
    notFor: ['Those wanting dramatic change'],
    tags: ['medium', 'lob', 'bob', 'versatile', 'universally-flattering'],
  },

  shaggyLayers: {
    id: 'shaggy-layers',
    name: 'Shaggy Layers',
    category: 'Medium',
    gender: 'unisex',
    length: 'Medium (chin to shoulder)',
    description: 'Textured, lived-in layers with effortless movement',
    maintenanceLevel: 'low',

    promptHints: `Multiple choppy, textured layers throughout.
Hair appears slightly tousled and lived-in.
Lots of movement and volume from layering.
Fringe/bangs often included - curtain bangs or choppy.
Intentionally imperfect, rock-and-roll aesthetic.
Pieces frame the face at different lengths.
Think: 70s inspired, effortless cool, bedhead chic.`,

    bestFor: ['Wavy hair', 'Thick hair', 'Square faces', 'Adding volume'],
    notFor: ['Very fine hair (may look thin)', 'Corporate settings'],
    tags: ['medium', 'shaggy', 'layers', 'textured', 'effortless', 'retro'],
  },

  curtainBangs: {
    id: 'curtain-bangs',
    name: 'Curtain Bangs',
    category: 'Medium',
    gender: 'feminine',
    length: 'Any length with face-framing bangs',
    description: 'Face-framing bangs that part in the center like curtains',
    maintenanceLevel: 'medium',

    promptHints: `Center-parted bangs that sweep to each side of the face.
Bangs are longest at the outer edges, shorter in center.
Creates a soft, face-framing effect.
Feathered edges blend into the rest of the hair.
Draws attention to eyes and cheekbones.
Works with any hair length behind the bangs.
Think: Brigitte Bardot, 70s glamour, soft and romantic.`,

    bestFor: ['All face shapes', 'High foreheads', 'Growing out bangs', 'Adding softness'],
    notFor: ['Very curly hair (bangs may shrink up)', 'Very oily foreheads'],
    tags: ['bangs', 'curtain', 'face-framing', 'romantic', 'versatile'],
  },

  // ============= LONG STYLES =============
  longLayers: {
    id: 'long-layers',
    name: 'Long Layers',
    category: 'Long',
    gender: 'feminine',
    length: 'Past shoulders (14-22 inches)',
    description: 'Flowing layers that add movement to long hair',
    maintenanceLevel: 'medium',

    promptHints: `Long hair past the shoulders with graduated layers.
Layers start around chin level and flow down.
Creates movement, volume, and dimension.
Bottom can be slightly V-shaped or U-shaped.
Hair moves and flows naturally, not heavy or flat.
Face-framing pieces around the jawline.
Think: classic long hair with structure and shape.`,

    bestFor: ['All face shapes', 'Thick hair', 'Wanting movement', 'Versatile styling'],
    notFor: ['Very fine/thin hair (layers may thin it out)'],
    tags: ['long', 'layers', 'flowing', 'classic', 'versatile'],
  },

  beachWaves: {
    id: 'beach-waves',
    name: 'Beach Waves',
    category: 'Long',
    gender: 'feminine',
    length: 'Medium to long',
    description: 'Effortless, sun-kissed waves like you just left the beach',
    maintenanceLevel: 'low',

    promptHints: `Loose, natural-looking waves throughout the hair.
Waves are relaxed and imperfect - not tight curls.
Often has lighter pieces or highlights for sun-kissed effect.
Volume at the roots, waves from mid-length to ends.
Tousled, wind-blown texture.
Looks effortless and undone in a deliberate way.
Think: California surfer girl, vacation hair, natural beauty.`,

    bestFor: ['Wavy hair', 'All face shapes', 'Casual lifestyle', 'Beachy vibes'],
    notFor: ['Very straight hair (hard to maintain)', 'Formal settings'],
    tags: ['long', 'waves', 'beach', 'casual', 'effortless', 'sun-kissed'],
  },

  slickBack: {
    id: 'slick-back',
    name: 'Slicked Back',
    category: 'Medium',
    gender: 'masculine',
    length: 'Medium (4-6 inches on top)',
    description: 'Polished, combed-back look with volume',
    maintenanceLevel: 'high',

    promptHints: `All hair combed backward from the forehead.
Smooth, sleek appearance with volume at the crown.
Sides can be tapered or faded.
Product (pomade/gel) gives a wet or matte finish.
Hairline is fully visible and exposed.
Creates a strong, confident, put-together look.
Think: Wall Street, James Bond, power style.`,

    bestFor: ['Oval faces', 'Square faces', 'Thick hair', 'Professional settings'],
    notFor: ['Receding hairlines', 'Very fine hair'],
    tags: ['medium', 'slick', 'polished', 'professional', 'power'],
  },

  // ============= TEXTURED/CURLY STYLES =============
  naturalCurls: {
    id: 'natural-curls',
    name: 'Natural Curls',
    category: 'Curly',
    gender: 'unisex',
    length: 'Medium to long',
    description: 'Embrace your natural curl pattern with defined, bouncy curls',
    maintenanceLevel: 'medium',

    promptHints: `Well-defined natural curl pattern throughout.
Curls are bouncy, hydrated, and have defined spiral shape.
Volume is distributed evenly - not flat on top.
Curls range from type 3A to 3C (loose to tight spirals).
Hair appears healthy, shiny, and moisturized.
Shape is rounded and balanced.
Think: natural beauty, curl power, healthy defined curls.`,

    bestFor: ['Naturally curly hair', 'All face shapes', 'Adding volume', 'Natural look'],
    notFor: ['Straight hair (would require permanent)'],
    tags: ['curly', 'natural', 'defined', 'textured', 'bouncy'],
  },

  afro: {
    id: 'afro',
    name: 'Natural Afro',
    category: 'Curly',
    gender: 'unisex',
    length: 'Varies (picked out to full volume)',
    description: 'Beautiful, voluminous natural hair at its fullest',
    maintenanceLevel: 'medium',

    promptHints: `Full, rounded shape of natural type 4 hair.
Hair is picked out or styled to maximum volume.
Creates a beautiful halo/crown effect around the head.
Symmetrical, rounded silhouette.
Hair texture is visible - tight coils or kinks.
Appears healthy, moisturized, and well-shaped.
Think: natural crown, powerful, beautiful texture.`,

    bestFor: ['Type 4 hair', 'Oval faces', 'Long faces', 'Making a statement'],
    notFor: ['Those wanting low maintenance'],
    tags: ['natural', 'afro', 'volume', 'textured', 'powerful'],
  },

  // ============= COLOR STYLES =============
  balayage: {
    id: 'balayage',
    name: 'Balayage Highlights',
    category: 'Color',
    gender: 'feminine',
    length: 'Any length',
    description: 'Hand-painted highlights that blend naturally from dark to light',
    maintenanceLevel: 'low',

    promptHints: `Gradual transition from darker roots to lighter ends.
Hand-painted highlight effect - not uniform foils.
Natural, sun-kissed graduation of color.
Roots are the natural darker color.
Mid-lengths transition to lighter shades.
Ends are the lightest - honey, caramel, or blonde tones.
Seamless blending with no harsh lines or stripes.
Think: expensive-looking, natural, low-maintenance color.`,

    bestFor: ['All hair types', 'Low maintenance color', 'Natural look', 'First-time color'],
    notFor: ['Wanting dramatic all-over color change'],
    tags: ['color', 'balayage', 'highlights', 'natural', 'low-maintenance'],
  },

  platinumBlonde: {
    id: 'platinum-blonde',
    name: 'Platinum Blonde',
    category: 'Color',
    gender: 'unisex',
    length: 'Any length',
    description: 'Ice-white, head-turning platinum blonde',
    maintenanceLevel: 'high',

    promptHints: `Very light, almost white blonde hair color.
Cool-toned - no yellow or warm brassiness.
Icy, silver-white appearance.
Uniform color from root to tip (or with slight shadow root).
Hair appears healthy despite the dramatic lightening.
Striking, attention-grabbing, bold color statement.
Think: Marilyn Monroe, ice queen, editorial fashion.`,

    bestFor: ['Cool skin tones', 'Bold personality', 'Short to medium hair', 'Making a statement'],
    notFor: ['Warm skin tones', 'Damaged hair', 'Low maintenance seekers'],
    tags: ['color', 'platinum', 'blonde', 'bold', 'dramatic', 'icy'],
  },

  redAuburn: {
    id: 'red-auburn',
    name: 'Rich Auburn',
    category: 'Color',
    gender: 'feminine',
    length: 'Any length',
    description: 'Warm, rich red-brown color with depth and dimension',
    maintenanceLevel: 'medium',

    promptHints: `Rich reddish-brown hair color.
Warm tones - mix of red, copper, and brown.
Catches light beautifully with red/copper highlights.
Deep and multidimensional - not flat or single-toned.
Has warmth and richness throughout.
Natural-looking red that complements warm skin tones.
Think: autumn leaves, warm copper, rich mahogany.`,

    bestFor: ['Warm skin tones', 'Green/hazel eyes', 'Fair to medium complexions', 'Adding warmth'],
    notFor: ['Very cool skin tones', 'Those who fade-test poorly with red'],
    tags: ['color', 'auburn', 'red', 'warm', 'rich', 'dimensional'],
  },

  // ============= TRENDING/SPECIALTY =============
  wolfCut: {
    id: 'wolf-cut',
    name: 'Wolf Cut',
    category: 'Trending',
    gender: 'unisex',
    length: 'Medium (shoulder length)',
    description: 'Shaggy mullet-inspired layers - the viral TikTok cut',
    maintenanceLevel: 'low',

    promptHints: `Heavy layers create a mullet-meets-shag silhouette.
Shorter, voluminous layers on top and around the face.
Longer pieces in the back.
Lots of texture and choppy layers throughout.
Face-framing pieces are prominent.
Intentionally messy, edgy, rock-and-roll aesthetic.
Volume concentrated at the crown and sides.
Think: modern mullet, 80s rock star meets TikTok.`,

    bestFor: ['Wavy/curly hair', 'Thick hair', 'Oval/long faces', 'Edgy style'],
    notFor: ['Conservative settings', 'Very fine hair', 'Round faces'],
    tags: ['trending', 'wolf', 'shaggy', 'edgy', 'tiktok', 'layers'],
  },

  undercut: {
    id: 'undercut',
    name: 'Undercut',
    category: 'Trending',
    gender: 'unisex',
    length: 'Short sides, medium-long top',
    description: 'Shaved sides with dramatic length on top',
    maintenanceLevel: 'medium',

    promptHints: `Dramatic contrast between top and sides.
Sides and back are buzzed/shaved very short (guard 1-2).
Top is significantly longer (4-8 inches).
Sharp, defined line where short meets long.
Top can be styled back, to the side, or textured.
Bold, fashion-forward, editorial look.
Think: edgy, dramatic contrast, fashion-forward.`,

    bestFor: ['Thick hair', 'Oval faces', 'Angular faces', 'Bold personality'],
    notFor: ['Conservative workplaces', 'Fine hair on top', 'Round faces'],
    tags: ['trending', 'undercut', 'edgy', 'contrast', 'bold', 'fashion'],
  },

  braids: {
    id: 'braids',
    name: 'Box Braids',
    category: 'Protective',
    gender: 'unisex',
    length: 'Long (waist length or customizable)',
    description: 'Individual braids sectioned in boxes - versatile protective style',
    maintenanceLevel: 'low',

    promptHints: `Individual braids sectioned into square/box sections at the scalp.
Braids are uniform in size (small, medium, or large).
Hang straight down, can be styled up or back.
Neat, clean parts between each braid visible at scalp.
Braids are tight and smooth with no flyaways.
Can be any length - typically medium to long.
Protective style that lasts 4-8 weeks.
Think: versatile, protective, beautiful, cultural.`,

    bestFor: ['Type 3-4 hair', 'Protective styling', 'Low daily maintenance', 'Versatility'],
    notFor: ['Very fine/thin hair', 'Sensitive scalps'],
    tags: ['protective', 'braids', 'box-braids', 'versatile', 'long-lasting'],
  },

  messyBun: {
    id: 'messy-bun',
    name: 'Textured Updo / Messy Bun',
    category: 'Updo',
    gender: 'feminine',
    length: 'Medium to long hair required',
    description: 'Effortlessly chic pulled-up style with loose pieces',
    maintenanceLevel: 'low',

    promptHints: `Hair pulled up into a loose, undone bun at the crown or nape.
Intentionally messy - pieces falling out artfully.
Face-framing tendrils around the temples and ears.
Bun is not perfectly round - slightly lopsided or textured.
Volume at the crown before the bun.
Looks like it was done in 30 seconds (but actually deliberate).
Think: effortless elegance, Sunday morning, French girl chic.`,

    bestFor: ['Medium to long hair', 'All face shapes', 'Casual elegance', 'Hot weather'],
    notFor: ['Very short hair', 'Formal events (too casual)'],
    tags: ['updo', 'bun', 'messy', 'casual', 'effortless', 'chic'],
  },
};

// ============= HELPER FUNCTIONS =============

function getHairstyle(styleId) {
  if (HAIRSTYLE_STYLES[styleId]) {
    return HAIRSTYLE_STYLES[styleId];
  }
  return Object.values(HAIRSTYLE_STYLES).find(s => s.id === styleId);
}

function getAllHairstyles() {
  return Object.values(HAIRSTYLE_STYLES);
}

function getHairstylesByCategory() {
  const categories = {};
  Object.values(HAIRSTYLE_STYLES).forEach(style => {
    if (!categories[style.category]) {
      categories[style.category] = [];
    }
    categories[style.category].push(style);
  });
  return categories;
}

function getHairstylesByGender(gender) {
  return Object.values(HAIRSTYLE_STYLES).filter(
    s => s.gender === gender || s.gender === 'unisex'
  );
}

function getHairstylesByTag(tag) {
  return Object.values(HAIRSTYLE_STYLES).filter(
    s => s.tags?.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
}

function getHairstylesForFaceShape(faceShape) {
  return Object.values(HAIRSTYLE_STYLES).filter(
    s => s.bestFor?.some(b => b.toLowerCase().includes(faceShape.toLowerCase()))
  );
}

module.exports = {
  HAIRSTYLE_STYLES,
  getHairstyle,
  getAllHairstyles,
  getHairstylesByCategory,
  getHairstylesByGender,
  getHairstylesByTag,
  getHairstylesForFaceShape,
};
