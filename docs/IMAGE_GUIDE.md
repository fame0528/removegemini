# 📸 Image Assets Guide - RemoveGemini.com

**Last Updated:** January 17, 2026  
**Purpose:** Instructions for placing rebrand images in correct locations

---

## 📂 Directory Structure

```
docs/
└── examples/            # Before/after watermark removal examples
    ├── example-1-before.png
    ├── example-1-after.png
    ├── example-2-before.png
    ├── example-2-after.png
    ├── example-3-before.png
    └── example-3-after.png
```

---

## 🎨 Google Gemini Image Prompts

> **Use these prompts with Google Gemini to generate images that will have watermarks automatically added**

### �️ Example Image Prompts for GitHub README

#### **Example 1: Neon Cityscape**
**📁 Save to:** `docs/examples/example-1-before.png`

```
Cyberpunk neon cityscape at night, towering skyscrapers with holographic advertisements, flying cars in the distance, rain-soaked streets reflecting neon lights, purple and blue color palette, futuristic Tokyo/Hong Kong aesthetic, high detail, 1200x800 resolution, cinematic composition
```

> **Note:** Generate this image with your AI tool (which will add watermark automatically), then process through RemoveGemini.com to create `example-1-after.png`

#### **Example 2: Hacker Portrait**
**📁 Save to:** `docs/examples/example-2-before.png`

```
Cyberpunk hacker in darkened room, multiple holographic screens floating in air, neon code streaming, face illuminated by blue-pink monitor glow, futuristic tech aesthetic, cables and circuits visible, matrix-style atmosphere, 1200x800, portrait photography style
```

> **Note:** Generate this image with your AI tool (which will add watermark automatically), then process through RemoveGemini.com to create `example-2-after.png`

#### **Example 3: Tech Product Shot**
**📁 Save to:** `docs/examples/example-3-before.png`

```
Futuristic holographic device floating in cyberpunk environment, neon accents, translucent glass panels, purple-blue gradient lighting, high-tech gadget product photography, sleek minimalist design, ambient glow, 1200x800, commercial product shot
```

> **Note:** Generate this image with your AI tool (which will add watermark automatically), then process through RemoveGemini.com to create `example-3-after.png`

---

## 🎨 Image Specifications

### Examples (`docs/examples/`)

#### **example-1-before.png / example-1-after.png**
- **Purpose:** Showcase watermark removal effectiveness
- **Size:** 1200×800 pixels minimum (maintain aspect ratio)
- **Format:** PNG for best quality comparison
- **Content:** 
  - **Before:** Image with visible watermark
  - **After:** Same image with watermark removed
- **Quality:** High resolution, lossless (< 800KB each)
- **Note:** Ensure you have rights to use example images

#### **example-2-before.png / example-2-after.png**
- **Purpose:** Second example (different watermark type)
- **Size:** 1200×800 pixels minimum
- **Format:** PNG
- **Content:** Different watermark style (corner logo, text overlay, etc.)

#### **example-3-before.png / example-3-after.png**
- **Purpose:** Third example (complex watermark)
- **Size:** 1200×800 pixels minimum
- **Format:** PNG
- **Content:** Complex watermark (pattern, multi-color, etc.)

---

## 📋 Image Creation Workflow

### Step 1: Prepare Your Images

- [ ] Create hero screenshot (desktop view)
- [ ] Create hero screenshot (mobile view)
- [ ] Prepare 3 before/after example sets
- [ ] Design logo (dark and light versions)
- [ ] Create app icon (simplified logo)
- [ ] Design Open Graph image

### Step 2: Process Through RemoveGemini.com

- [ ] Upload `example-1-before.png` to RemoveGemini.com
- [ ] Squoosh or TinyPNG to optimize file sizes

# Target sizes:
# Examples: < 800KB each
```

### Step 4: Place in Directory
# Screenshots: < 500KB
# Examples: < 800KB each
# Logos: < 100KB
# OG Image: < 300KB
```

### Step 3: Place in Correct Directories

```bash
# Place screenshots
docs/screenshots/hero-desktop.png
docs/screenshots/hero-mobile.png

# Place examples (before/after pairs)
docs/examples/example-1-before.png
docs/examples/example-1-after.png
docs/examples/example-2-before.png
docs/examples/example-2-after.png
docs/examples/example-3-before.png
docs/examples/example-3-after.png

# Place branding assets
docs/branding/logo-dark.png
docs/branding/logo-light.png
docs/branding/logo-icon.png
docs/branding/og-image.png
```

### Step 4: Update README

On 📋 Image Creation Workflow

### Step 1: Generate Images with Google Gemini

- [ ] Go to https://gemini.google.com
- [ ] Copy prompt for Example 1
- [ ] Generate image (Gemini adds watermark automatically)
- [ ] Save as `example-1-before.png`
- [ ] Repeat for Examples 2 and 3screenshots/hero-desktop.png)
```

---

## 🎨 Design Guidelines

### Color Palette

Ensure images match the existing Tailwind theme:

- **Primary:** Gradient (blue/purple/pink)
- **Background:** Dark (#0a0a0a) or Light (#ffffff)
- **Accent:** Bright colors for CTAs
- **Glassmorphism:** Frosted glass effects

### Typography

If adding text overlays:

- **Font:** System fonts (avoid custom fonts in images)
- **Size:** Large enough to read at 50% scale
- **Contrast:** High contrast for readability

### Screenshot Guidelines
AI Generation (Recommended):** Use the cyberpunk prompts above with:
   - **Midjourney** - High quality, best for product shots
   - **DALL-E 3** - Good for UI mockups and clean designs
   - **Stable Diffusion** - Customizable, free alternatives available
   - **Leonardo.ai** - Excellent for consistent style across images

2. **Screenshot Tool:** Use Windows Snipping Tool or Greenshot for interface captures

3. **Example Images:** Find royalty-free images on Unsplash/Pexels, add watermarks using:
   - **Canva** - Easy watermark overlay tool
   - **Photoshop** - Professional editing
   - **GIMP** - Free alternative to Photoshop

4. **Process through app:** Use RemoveGemini.com itself for real before/after examples

5. **Design Tools for Logos:**
   - **Figma** - Professional vector design (free tier)
   - **Canva** - Quick logo generation
   - **Adobe Illustrator** - Industry standard (paid)
3. **Realistic content:** Use appropriate test images
4. **Annotations:** Add arrows/callouts if needed (optional)
5. **Device frames:** Consider using device mockups (optional)

---

## 🚀 Quick Start

**Don't have images ready?**

1. **Use Placeholders:** Start with placeholder.com images
2. **Screenshot Tool:** Use Windows Snipping Tool or Greenshot
3. **Example Images:** Find royalty-free images on Unsplash/Pexels
4. **Add watermarks:** Use Canva or Photoshop to create test watermarks
5. **Process through app:** Use RemoveGemini.com itself for real examples

**Placeholder Example:**
```markdown
![Hero](https://via.placeholder.com/1920x1080/4f46e5/ffffff?text=RemoveGemini.com)
```

---

## ⚠️ Legal Considerations

### Image Rights
images from Google Gemini (they add watermarks automatically)
- ✅ **Generated content:** Google Gemini terms of service applyth attribution)
- ✅ **Created watermarks:** Add text/logos yourself
- ❌ **Copyrighted:** Don't use others' watermarked images without permission

### Privacy

- ✅ **Public images:** OK to use for examples
- ❌ **Personal photos:** Don't use identifiable people without consent
- ❌ **Sensitive content:** Avoid private/confidential information

---

## 📊 Image Metadata (Optional)
AI-generatedTracking

| Image | Status | Notes |
|-------|--------|-------|
| example-1-before.png | ✅ Complete | Neon cityscape (780 KB) |
| example-1-after.png | ✅ Complete | Processed (784 KB) |
| example-2-before.png | ✅ Complete | Hacker portrait (612 KB) |
| example-2-after.png | ✅ Complete | Processed (620 KB) |
| example-3-before.png | ✅ Complete | Tech product (465 KB) |
| example-3-after.png | ✅ Complete | Processed (475 KB) |

**Total:** 6 images, 3.7 MB (compressed from 10 MB - 62% reduction)

---

## 🆘 Need Help?

**Resources:**

- [Google Gemini](https://gemini.google.com/) - Generate images with automatic watermarks
- [Squoosh](https://squoosh.app/) - Optimize image file sizes
- [TinyPNG](https://tinypng.com/) - Compress PNG/JPG file

**Next Step:** After placing all images, run the README update to reference new paths!

---

**Maintained By:** RemoveGemini.com Core Team  
**Last Updated:** January 17, 2026
Generate 3 example pairs using Google Gemini, then process through RemoveGemini.com