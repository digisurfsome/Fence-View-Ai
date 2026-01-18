#!/usr/bin/env node
/**
 * FENCE TRANSFORMATION TEST SCRIPT
 *
 * Tests the core prompting and image generation system.
 *
 * Usage:
 *   GEMINI_API_KEY=your_key node src/test-transformation.js path/to/fence-image.jpg
 *
 * Or for OpenAI:
 *   OPENAI_API_KEY=your_key AI_PROVIDER=openai node src/test-transformation.js path/to/fence-image.jpg
 */

const path = require('path');
const fs = require('fs');
const {
  createImageService,
  fileToBase64,
  saveBase64Image,
} = require('./services/image-generator');
const { getAllStyles, getStyle } = require('./prompts/fence-styles');

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * List all available fence styles
 */
function listStyles() {
  log('\n========== AVAILABLE FENCE STYLES ==========\n', 'bright');

  getAllStyles().forEach(style => {
    log(`${style.id}`, 'cyan');
    log(`  Name: ${style.name}`);
    log(`  Material: ${style.material}`);
    log(`  Color: ${style.color}`);
    log(`  Price: ${style.priceRange}`);
    log('');
  });
}

/**
 * Test image analysis only
 */
async function testAnalysis(imagePath) {
  log('\n========== IMAGE ANALYSIS TEST ==========\n', 'bright');

  if (!fs.existsSync(imagePath)) {
    log(`Error: Image not found: ${imagePath}`, 'red');
    return;
  }

  log(`Analyzing: ${imagePath}`, 'blue');
  const imageBase64 = fileToBase64(imagePath);

  const service = createImageService();
  log(`Using provider: ${service.constructor.name}`, 'yellow');

  try {
    const analysis = await service.analyzeImage(imageBase64);
    log('\nAnalysis Results:', 'green');
    console.log(JSON.stringify(analysis, null, 2));
  } catch (error) {
    log(`Error: ${error.message}`, 'red');
  }
}

/**
 * Test single fence transformation
 */
async function testSingleTransform(imagePath, styleId) {
  log('\n========== FENCE TRANSFORMATION TEST ==========\n', 'bright');

  if (!fs.existsSync(imagePath)) {
    log(`Error: Image not found: ${imagePath}`, 'red');
    return;
  }

  const style = getStyle(styleId);
  if (!style) {
    log(`Error: Unknown style: ${styleId}`, 'red');
    log('Available styles:', 'yellow');
    getAllStyles().forEach(s => log(`  - ${s.id}`));
    return;
  }

  log(`Input image: ${imagePath}`, 'blue');
  log(`Target style: ${style.name}`, 'blue');

  const imageBase64 = fileToBase64(imagePath);
  const service = createImageService();

  log(`\nUsing provider: ${service.constructor.name}`, 'yellow');
  log('Generating transformation...', 'yellow');

  const startTime = Date.now();

  try {
    const result = await service.transformFence(imageBase64, styleId);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    log(`\nCompleted in ${elapsed}s`, 'green');

    if (result.success && result.image) {
      const outputDir = path.join(__dirname, '../output');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const outputPath = path.join(
        outputDir,
        `${path.basename(imagePath, path.extname(imagePath))}_${styleId}`
      );

      const savedPath = saveBase64Image(result.image, outputPath, result.mimeType);
      log(`Output saved to: ${savedPath}`, 'green');
    } else {
      log('No image generated', 'red');
      if (result.description) {
        log(`Description: ${result.description}`, 'yellow');
      }
    }

    log('\nImage Analysis:', 'cyan');
    console.log(JSON.stringify(result.analysis, null, 2));

  } catch (error) {
    log(`Error: ${error.message}`, 'red');
    console.error(error);
  }
}

/**
 * Test batch transformation (multiple styles)
 */
async function testBatchTransform(imagePath, styleIds) {
  log('\n========== BATCH TRANSFORMATION TEST ==========\n', 'bright');

  if (!fs.existsSync(imagePath)) {
    log(`Error: Image not found: ${imagePath}`, 'red');
    return;
  }

  log(`Input image: ${imagePath}`, 'blue');
  log(`Styles: ${styleIds.join(', ')}`, 'blue');

  const imageBase64 = fileToBase64(imagePath);
  const service = createImageService();

  log(`\nUsing provider: ${service.constructor.name}`, 'yellow');
  log('Generating transformations...', 'yellow');

  const startTime = Date.now();

  try {
    const results = await service.generateAllStyles(imageBase64, styleIds);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    log(`\nCompleted ${results.length} transformations in ${elapsed}s`, 'green');

    const outputDir = path.join(__dirname, '../output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    results.forEach(result => {
      if (result.success && result.image) {
        const outputPath = path.join(
          outputDir,
          `${path.basename(imagePath, path.extname(imagePath))}_${result.styleId}`
        );
        const savedPath = saveBase64Image(result.image, outputPath, result.mimeType);
        log(`  ✓ ${result.styleId}: ${savedPath}`, 'green');
      } else {
        log(`  ✗ ${result.styleId}: ${result.error || 'Failed'}`, 'red');
      }
    });

  } catch (error) {
    log(`Error: ${error.message}`, 'red');
    console.error(error);
  }
}

/**
 * Show prompts without calling API (for testing prompt quality)
 */
function showPrompts(styleId) {
  const { FENCE_PROMPTS } = require('./prompts/transformation-prompts');
  const style = getStyle(styleId);

  if (!style) {
    log(`Error: Unknown style: ${styleId}`, 'red');
    return;
  }

  log('\n========== PROMPT PREVIEW ==========\n', 'bright');
  log(`Style: ${style.name}\n`, 'cyan');

  log('--- STRAIGHT SHOT PROMPT ---', 'yellow');
  log('\nSystem:', 'blue');
  console.log(FENCE_PROMPTS.straightShot.system);
  log('\nUser Prompt:', 'blue');
  console.log(FENCE_PROMPTS.straightShot.prompt(style));

  log('\n--- ANGLED SHOT PROMPT ---', 'yellow');
  log('\nSystem:', 'blue');
  console.log(FENCE_PROMPTS.angledShot.system);
  log('\nUser Prompt:', 'blue');
  console.log(FENCE_PROMPTS.angledShot.prompt(style));

  log('\n--- STYLE HINTS ---', 'yellow');
  console.log(style.promptHints);
}

// ===== CLI HANDLING =====
const args = process.argv.slice(2);
const command = args[0];

if (!command || command === '--help' || command === '-h') {
  console.log(`
${colors.bright}FENCE TRANSFORMATION TEST TOOL${colors.reset}

Usage:
  node src/test-transformation.js <command> [options]

Commands:
  list                          List all available fence styles
  analyze <image>               Analyze an image (detect shot type, fence type)
  transform <image> <style>     Transform fence to a specific style
  batch <image> <s1,s2,s3>      Transform to multiple styles
  prompt <style>                Show the prompts that would be used (no API call)

Environment Variables:
  GEMINI_API_KEY   Your Google Gemini API key
  OPENAI_API_KEY   Your OpenAI API key
  AI_PROVIDER      'gemini' (default) or 'openai'

Examples:
  node src/test-transformation.js list
  node src/test-transformation.js analyze ./my-fence.jpg
  node src/test-transformation.js transform ./my-fence.jpg wood-privacy
  node src/test-transformation.js batch ./my-fence.jpg wood-privacy,wrought-iron,vinyl-privacy
  node src/test-transformation.js prompt wood-privacy
`);
  process.exit(0);
}

// Check API key
const provider = process.env.AI_PROVIDER || 'gemini';
const apiKey = provider === 'openai' ? process.env.OPENAI_API_KEY : process.env.GEMINI_API_KEY;

if (command !== 'list' && command !== 'prompt' && !apiKey) {
  log(`\nError: ${provider.toUpperCase()}_API_KEY environment variable not set`, 'red');
  log(`Set it with: export ${provider.toUpperCase()}_API_KEY=your_key_here\n`, 'yellow');
  process.exit(1);
}

// Run command
switch (command) {
  case 'list':
    listStyles();
    break;

  case 'analyze':
    if (!args[1]) {
      log('Error: Please provide an image path', 'red');
      process.exit(1);
    }
    testAnalysis(args[1]);
    break;

  case 'transform':
    if (!args[1] || !args[2]) {
      log('Error: Please provide image path and style ID', 'red');
      log('Usage: transform <image> <style>', 'yellow');
      process.exit(1);
    }
    testSingleTransform(args[1], args[2]);
    break;

  case 'batch':
    if (!args[1] || !args[2]) {
      log('Error: Please provide image path and comma-separated style IDs', 'red');
      log('Usage: batch <image> <style1,style2,style3>', 'yellow');
      process.exit(1);
    }
    testBatchTransform(args[1], args[2].split(','));
    break;

  case 'prompt':
    if (!args[1]) {
      log('Error: Please provide a style ID', 'red');
      process.exit(1);
    }
    showPrompts(args[1]);
    break;

  default:
    log(`Unknown command: ${command}`, 'red');
    log('Use --help for usage information', 'yellow');
    process.exit(1);
}
