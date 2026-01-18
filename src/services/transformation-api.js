/**
 * FENCE TRANSFORMATION API
 *
 * This module provides the high-level API that would be called
 * from your web app, mobile app, or sales bot.
 *
 * It handles:
 * - Processing customer uploads
 * - Generating multiple fence style previews
 * - Caching results
 * - Cost tracking
 */

const {
  createImageService,
  fileToBase64,
  saveBase64Image,
} = require('./image-generator');
const { getAllStyles, getStyle, getContractorStyles } = require('../prompts/fence-styles');

// Approximate costs (adjust based on actual API pricing)
const COST_PER_IMAGE = {
  gemini_low: 0.04,
  gemini_medium: 0.08,
  gemini_high: 0.12,
  openai: 0.04,
};

/**
 * TRANSFORMATION SESSION
 *
 * Represents a customer's fence visualization session.
 * Tracks the original image, generated previews, and costs.
 */
class TransformationSession {
  constructor(options = {}) {
    this.id = options.id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.createdAt = new Date();
    this.originalImage = null;
    this.analysis = null;
    this.previews = new Map(); // styleId -> { image, generatedAt, cost }
    this.totalCost = 0;
    this.contractorId = options.contractorId || null;
    this.availableStyles = options.styleIds
      ? getContractorStyles(options.styleIds)
      : getAllStyles();

    this.service = createImageService(options.provider);
  }

  /**
   * Set the customer's original fence photo
   */
  async setOriginalImage(imageBase64OrPath) {
    // If it's a file path, convert to base64
    if (typeof imageBase64OrPath === 'string' && imageBase64OrPath.includes('/')) {
      this.originalImage = fileToBase64(imageBase64OrPath);
    } else {
      this.originalImage = imageBase64OrPath;
    }

    // Analyze the image
    this.analysis = await this.service.analyzeImage(this.originalImage);

    return {
      sessionId: this.id,
      analysis: this.analysis,
      availableStyles: this.availableStyles.map(s => ({
        id: s.id,
        name: s.name,
        description: s.description,
        priceRange: s.priceRange,
      })),
    };
  }

  /**
   * Generate a single fence style preview
   */
  async generatePreview(styleId) {
    if (!this.originalImage) {
      throw new Error('No original image set. Call setOriginalImage first.');
    }

    // Check if already generated
    if (this.previews.has(styleId)) {
      return this.previews.get(styleId);
    }

    const style = getStyle(styleId);
    if (!style) {
      throw new Error(`Unknown style: ${styleId}`);
    }

    // Generate the transformed image
    const result = await this.service.transformFence(this.originalImage, styleId);

    const preview = {
      styleId,
      styleName: style.name,
      image: result.image,
      mimeType: result.mimeType,
      success: result.success,
      generatedAt: new Date(),
      cost: COST_PER_IMAGE.gemini_low, // Adjust based on quality
    };

    this.previews.set(styleId, preview);
    this.totalCost += preview.cost;

    return preview;
  }

  /**
   * Generate previews for multiple styles
   * Used when generating all options upfront
   */
  async generatePreviews(styleIds) {
    const results = [];

    for (const styleId of styleIds) {
      const preview = await this.generatePreview(styleId);
      results.push(preview);
    }

    return results;
  }

  /**
   * Generate ALL available styles (for contractors who want everything upfront)
   */
  async generateAllPreviews() {
    const styleIds = this.availableStyles.map(s => s.id);
    return this.generatePreviews(styleIds);
  }

  /**
   * Get session summary (for tracking/billing)
   */
  getSummary() {
    return {
      sessionId: this.id,
      createdAt: this.createdAt,
      contractorId: this.contractorId,
      analysis: this.analysis,
      previewsGenerated: this.previews.size,
      totalCost: this.totalCost,
      styles: Array.from(this.previews.keys()),
    };
  }

  /**
   * Export all previews for display/sharing
   */
  exportPreviews() {
    return Array.from(this.previews.entries()).map(([styleId, preview]) => ({
      styleId,
      styleName: preview.styleName,
      image: preview.image ? `data:${preview.mimeType};base64,${preview.image}` : null,
      success: preview.success,
    }));
  }
}

/**
 * QUICK TRANSFORMATION
 *
 * One-shot transformation for simple use cases.
 * Pass in an image and get back all style previews.
 */
async function quickTransform(imageBase64, styleIds = null, options = {}) {
  const session = new TransformationSession(options);
  await session.setOriginalImage(imageBase64);

  const styles = styleIds || session.availableStyles.map(s => s.id);
  await session.generatePreviews(styles);

  return {
    sessionId: session.id,
    analysis: session.analysis,
    previews: session.exportPreviews(),
    totalCost: session.totalCost,
  };
}

/**
 * CONTRACTOR SESSION
 *
 * For fence contractors doing on-site quotes.
 * Pre-configured with their available styles.
 */
function createContractorSession(contractorConfig) {
  return new TransformationSession({
    contractorId: contractorConfig.id,
    styleIds: contractorConfig.fenceStyles,
    provider: contractorConfig.preferredProvider || 'gemini',
  });
}

// Example contractor config
const EXAMPLE_CONTRACTOR_CONFIG = {
  id: 'austin-fence-co',
  name: 'Austin Fence Company',
  fenceStyles: [
    'wood-privacy',
    'wood-privacy-white',
    'cedar-horizontal',
    'wrought-iron',
    'vinyl-privacy',
    'chain-link-black',
  ],
  preferredProvider: 'gemini',
  costPerLead: 50,
  costPerClosedDeal: 500,
};

module.exports = {
  TransformationSession,
  quickTransform,
  createContractorSession,
  EXAMPLE_CONTRACTOR_CONFIG,
  COST_PER_IMAGE,
};
