#!/bin/bash
#
# Download test images for fence transformation testing
# Run: bash download.sh
#

echo "=== Downloading Test Images ==="
echo ""

# Create directory if needed
mkdir -p "$(dirname "$0")"
cd "$(dirname "$0")"

# Image URLs from manifest (Unsplash + Pexels - free for commercial use)
declare -A IMAGES=(
  ["backyard-weathered-01.jpg"]="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"
  ["wooden-fence-02.jpg"]="https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1200&q=80"
  ["privacy-fence-03.jpg"]="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80"
  ["backyard-view-04.jpg"]="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"
  ["residential-yard-05.jpg"]="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"
  ["pexels-backyard-06.jpg"]="https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?w=1200"
  ["pexels-house-07.jpg"]="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?w=1200"
  ["pexels-yard-08.jpg"]="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=1200"
  ["pexels-garden-09.jpg"]="https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?w=1200"
  ["pexels-property-10.jpg"]="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?w=1200"
)

SUCCESS=0
FAILED=0

for filename in "${!IMAGES[@]}"; do
  url="${IMAGES[$filename]}"

  if [ -f "$filename" ]; then
    echo "✓ $filename (already exists)"
    ((SUCCESS++))
  else
    echo "↓ Downloading $filename..."
    if curl -sL -o "$filename" "$url"; then
      echo "✓ $filename"
      ((SUCCESS++))
    else
      echo "✗ $filename (failed)"
      ((FAILED++))
    fi
  fi
done

echo ""
echo "=== Complete ==="
echo "Downloaded: $SUCCESS"
echo "Failed: $FAILED"
echo ""
echo "Images are in: $(pwd)"
