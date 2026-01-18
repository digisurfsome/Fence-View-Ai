# Fence Style Reference Images

This folder contains the reference images used by the AI to transform fences.

## Folder Structure

```
fence-styles/
├── wood-privacy/
│   ├── dog-ear-front.png        # Finished side (neighbor view)
│   ├── dog-ear-back.png         # Rail side (backyard view)
│   ├── flat-top-front.png
│   ├── flat-top-back.png
│   ├── board-on-board-front.png
│   └── board-on-board-back.png
│
├── wood-horizontal/
│   ├── cedar-slat-front.png
│   ├── cedar-slat-back.png
│   ├── modern-privacy-front.png
│   └── modern-privacy-back.png
│
├── vinyl-privacy/
│   ├── white.png                # Same both sides
│   ├── tan.png
│   └── gray.png
│
├── metal-aluminum/
│   ├── black-spear-top.png      # Same both sides
│   ├── black-flat-top.png
│   └── bronze.png
│
├── chain-link/
│   ├── galvanized.png           # Same both sides
│   └── black-vinyl-coated.png
│
├── picket/
│   ├── white-pointed.png        # Same both sides
│   ├── white-flat.png
│   └── wood-natural.png
│
└── shadow-box/
    ├── cedar-natural.png        # Same both sides (good neighbor)
    └── stained.png
```

## Naming Convention

```
{style}-{variant}-{side}.png

Examples:
- dog-ear-front.png
- dog-ear-back.png
- cedar-slat-front.png
- white.png (no side suffix = same both sides)
```

## Image Requirements

| Property | Requirement |
|----------|-------------|
| **Background** | Transparent (PNG) |
| **View** | Straight-on, perpendicular to fence |
| **Content** | Single panel/section (6-8ft wide) |
| **Quality** | Clean, well-lit, real photo (not render) |
| **Size** | At least 1024px on longest side |
| **Format** | PNG with transparency |

## Which Side to Use

The AI auto-detects based on what's visible in the customer photo:

| Customer Photo Shows | AI Uses |
|---------------------|---------|
| Horizontal rails visible | `*-back.png` (rail side) |
| Flat boards, no rails | `*-front.png` (finished side) |
| Metal/vinyl/chain link | Single image (same both sides) |

## Sourcing Images

Best sources for clean product shots:
1. Home Depot product pages (multiple angles)
2. Lowes product pages
3. Fence manufacturer sites (Veranda, Freedom, Ironcraft)
4. Remove background using remove.bg or Photoshop

## Adding New Styles

1. Add images to appropriate folder
2. Update `src/prompts/fence-styles.js` with new style definition
3. Include `promptHints` describing the visual details
4. Test with `node src/test-transformation.js transform <image> <style-id>`
