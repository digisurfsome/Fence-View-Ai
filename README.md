# Fence View AI

AI-powered fence visualization system that transforms photos of existing fences into previews of new fence styles. Also includes lead generation landing pages for home services in Austin.

## The Core Engine

The heart of this system is the **prompt engineering** that makes AI image models (Gemini 1.5, GPT-4 Vision) accurately replace fences while preserving:
- Exact camera angle and perspective
- Surrounding environment
- Lighting and shadows
- Fence footprint and location

### Cost Breakdown

Using Gemini 1.5 Flash at low resolution:
- **~$0.04 per image generated**
- 10 fence styles = ~$0.40 per customer
- 1000 customers = ~$400

## Quick Start

### 1. Test the Prompts (No API Key Needed)

```bash
# See all available fence styles
node src/test-transformation.js list

# Preview the prompts that would be used
node src/test-transformation.js prompt wood-privacy
```

### 2. Test Image Analysis (Requires API Key)

```bash
# Set your API key
export GEMINI_API_KEY=your_key_here

# Analyze a fence photo
node src/test-transformation.js analyze ./path/to/fence.jpg
```

### 3. Transform a Fence

```bash
# Single style
node src/test-transformation.js transform ./fence.jpg wood-privacy

# Multiple styles at once
node src/test-transformation.js batch ./fence.jpg wood-privacy,wrought-iron,vinyl-privacy
```

Output images are saved to `./output/`

## Project Structure

```
├── src/
│   ├── prompts/
│   │   ├── transformation-prompts.js  # THE SECRET SAUCE - prompt templates
│   │   └── fence-styles.js            # Fence style definitions
│   ├── services/
│   │   ├── image-generator.js         # Gemini/OpenAI API integration
│   │   └── transformation-api.js      # High-level API for apps
│   └── test-transformation.js         # CLI test tool
│
├── public/                            # Landing pages for lead gen
│   ├── roofing/                       # Storm damage lead capture
│   └── fencing/                       # Fence visualization lead capture
│
├── assets/
│   ├── fence-styles/                  # Reference images for each style
│   └── test-images/                   # Test fence photos
│
└── output/                            # Generated images go here
```

## Available Fence Styles

| ID | Name | Material |
|----|------|----------|
| `wood-privacy` | Wood Privacy Fence | Cedar |
| `wood-privacy-white` | White Wood Privacy | Painted wood |
| `cedar-horizontal` | Modern Horizontal Cedar | Cedar |
| `picket` | Classic Picket | Wood/Vinyl |
| `shadow-box` | Shadow Box | Cedar/Pine |
| `wrought-iron` | Wrought Iron | Iron/Steel |
| `aluminum` | Aluminum Fence | Aluminum |
| `chain-link` | Chain Link | Galvanized steel |
| `chain-link-black` | Black Vinyl Chain Link | Vinyl-coated steel |
| `vinyl-privacy` | Vinyl Privacy | PVC |
| `vinyl-privacy-tan` | Tan Vinyl Privacy | PVC |
| `composite` | Composite Fence | Wood-plastic |
| `farm-ranch` | Farm/Ranch Rail | Wood |

## How the Prompting Works

### Shot Type Detection

First, the system analyzes the input image to detect:
- **STRAIGHT-ON**: Camera perpendicular to fence
- **ANGLED**: Camera at an angle (perspective visible)
- **CORNER**: Multiple fence sections visible
- **NO_FENCE**: New installation needed

### Prompt Selection

Based on shot type, different prompts are used:

```javascript
// For straight shots - simpler replacement
FENCE_PROMPTS.straightShot.prompt(fenceStyle)

// For angled shots - perspective-aware replacement
FENCE_PROMPTS.angledShot.prompt(fenceStyle)

// For corners - multi-section consistency
FENCE_PROMPTS.cornerShot.prompt(fenceStyle)
```

### Style-Specific Hints

Each fence style has detailed `promptHints` that help the AI understand:
- Board orientation and spacing
- Post style and placement
- Material texture
- Color and finish

## Usage in Your App

```javascript
const { TransformationSession } = require('./src/services/transformation-api');

// Create a session for a customer
const session = new TransformationSession({
  contractorId: 'my-fence-company',
  styleIds: ['wood-privacy', 'wrought-iron', 'vinyl-privacy'],
});

// Set the customer's fence photo
await session.setOriginalImage(imageBase64);

// Generate a single preview (on-demand, saves cost)
const preview = await session.generatePreview('wood-privacy');

// Or generate all at once
const allPreviews = await session.generateAllPreviews();

// Get cost tracking
console.log(session.getSummary());
```

## The Business Model

### For Fence Contractors (B2B)

1. Contractor uploads customer's fence photo during quote visit
2. System generates previews of all styles they offer
3. Customer sees their house with each fence option
4. Contractor closes the deal on-site

**Value**: Closes more deals, higher ticket prices

### For Lead Generation

1. Homeowner uploads photo on landing page
2. Sees fence previews, gets excited
3. Submits contact info
4. Sell the lead to fence contractors ($50-500/lead)

### For the Sales Bot Integration

1. AI analyzes photo
2. Generates previews
3. Sales bot walks customer through options
4. Closes the deal automatically
5. Deliver closed deal to contractor ($500+)

## Landing Pages

Landing pages are in the `public/` folder:

```bash
# Run local server
npm run dev

# Visit http://localhost:3000
```

### Connecting Lead Capture to Backend

Edit `public/js/form-handler.js` - supports Zapier, Google Sheets, Formspree, or custom API.

## Environment Variables

```bash
GEMINI_API_KEY=your_gemini_key    # For Google Gemini
OPENAI_API_KEY=your_openai_key    # For OpenAI (alternative)
AI_PROVIDER=gemini                 # 'gemini' or 'openai'
```

## Extending to Other Home Services

The same prompting system works for:
- **Paint**: Change house exterior colors (see `PAINT_PROMPTS`)
- **Roofing**: Visualize new roof materials (see `ROOFING_PROMPTS`)
- **Landscaping**: Add/modify landscaping
- **Windows**: Show new window styles

## License

MIT
