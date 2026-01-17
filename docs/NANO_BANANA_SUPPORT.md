# 🍌 Nano Banana API Watermark Support

## Overview

RemoveGemini.com now supports removing watermarks from both **Gemini AI** and **Nano Banana API** generated images.

## How to Capture Nano Banana Watermark Patterns

To enable Nano Banana watermark removal, you need to create the watermark pattern files:

### Steps:

1. **Generate a pure black image** (1024×1024 or larger) using Nano Banana API
2. **Extract the watermark region** from the bottom-right corner
3. **Crop to 48×48 or 96×96** depending on the watermark size
4. **Save as PNG** with transparency preserved

### Pattern Files Needed:

- `public/nano_banana_48.png` - For images ≤ 1024px in either dimension
- `public/nano_banana_96.png` - For images > 1024px in both dimensions

### Watermark Characteristics:

**Nano Banana API:**
- ✨ **Pattern**: Sparkle/star icon (4-point star)
- 📍 **Position**: Bottom-right corner
- 📏 **Sizes**: 48×48 or 96×96 pixels
- 🎨 **Color**: White/semi-transparent overlay
- 📐 **Margins**: Similar to Gemini (24-64px from edges)

**Gemini AI:**
- 🤖 **Pattern**: "Gemini" text with Google logo
- 📍 **Position**: Bottom-right corner
- 📏 **Sizes**: 48×48 or 96×96 pixels
- 🎨 **Color**: White/semi-transparent overlay
- 📐 **Margins**: 24-64px from edges based on image size

## Testing

Enable debug mode to see detection:

```javascript
// In browser console
window.__DEBUG_WATERMARK__ = true;
```

This will:
- Draw a red box around the detected watermark region
- Log detection details to console
- Show which pattern (Gemini vs Nano Banana) was used

## Current Status

✅ **Multi-provider support** - Code supports both Gemini and Nano Banana  
⚠️ **Pattern files needed** - Nano Banana patterns need to be captured from real images  
✅ **Automatic fallback** - Falls back to Gemini pattern if Nano Banana not available

## Implementation Details

The watermark engine now:

1. **Loads both pattern sets** on initialization
2. **Tries Nano Banana first** if patterns available
3. **Falls back to Gemini** if Nano Banana patterns not found
4. **Logs provider detection** for debugging

See `src/lib/core/watermarkEngine.ts` for implementation.
