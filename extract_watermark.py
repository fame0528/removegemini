"""
Nano Banana Watermark Extractor
Extract watermark pattern from bottom-right corner of image
"""

from PIL import Image
import sys

def extract_watermark(image_path, output_path, size=48):
    """
    Extract watermark from bottom-right corner of image
    
    Args:
        image_path: Path to input image
        output_path: Path to save extracted watermark
        size: Size of watermark (48 or 96)
    """
    # Open image
    img = Image.open(image_path)
    width, height = img.size
    
    print(f"📸 Image size: {width}×{height}")
    
    # Determine margins based on size
    if size == 96:
        margin_right = 64
        margin_bottom = 64
    else:
        # For duck image (1024×558), use smaller margins
        margin_right = 24
        margin_bottom = 24
    
    # Calculate watermark position (bottom-right corner)
    x = width - margin_right - size
    y = height - margin_bottom - size
    
    print(f"🎯 Watermark position: ({x}, {y})")
    print(f"📏 Extracting {size}×{size} region with margins: right={margin_right}px, bottom={margin_bottom}px")
    
    # Extract watermark region
    watermark_region = img.crop((x, y, x + size, y + size))
    
    # Save extracted region
    watermark_region.save(output_path)
    print(f"✅ Saved watermark pattern to: {output_path}")
    
    # Also save a version with the region highlighted on the full image
    debug_img = img.copy()
    from PIL import ImageDraw
    draw = ImageDraw.Draw(debug_img)
    draw.rectangle([x, y, x + size, y + size], outline='red', width=3)
    debug_path = output_path.replace('.png', '_debug.png')
    debug_img.save(debug_path)
    print(f"🔍 Debug image saved to: {debug_path}")
    
    return watermark_region

if __name__ == "__main__":
    input_image = r"C:\dev\gemini-watermark-remover-main\b333927a-199c-4250-86f6-cd1f469c3ce3 (1).jpg"
    
    # Extract 48x48 watermark (for images with one dimension <= 1024)
    print("\n🍌 Extracting 48×48 watermark pattern...")
    extract_watermark(
        input_image,
        r"C:\dev\gemini-watermark-remover-main\public\nano_banana_48.png",
        size=48
    )
    
    print("\n" + "="*60)
    print("✨ Watermark extraction complete!")
    print("="*60)
    print("\nNext steps:")
    print("1. Check nano_banana_48_debug.png to see if the red box is around the watermark")
    print("2. If position is correct, the pattern file is ready to use")
    print("3. Restart the dev server to load the new pattern")
    print("4. Test with your duck image!")
