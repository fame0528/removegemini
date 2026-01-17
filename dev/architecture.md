# 🏗️ Architecture - RemoveGemini.com

**Last Updated:** January 17, 2026  
**Version:** 1.0.0  
**System Type:** Browser-based SPA with client-side processing

---

## 🎯 Architectural Principles

### 1. Privacy by Design
- **Zero uploads** - All image processing happens in browser
- **No tracking** - No analytics, cookies, or user identification
- **Local storage only** - Settings stay on device
- **Open source** - Transparent algorithms

### 2. Performance First
- **Web Workers** - Non-blocking background processing
- **Canvas API** - Hardware-accelerated pixel manipulation
- **Lazy loading** - Code splitting for faster initial load
- **Asset optimization** - Compressed images and fonts

### 3. Modern Architecture
- **TypeScript strict** - Type safety across entire codebase
- **React 19** - Latest React features and concurrent mode
- **Next.js 15** - App Router with server components
- **Tailwind CSS** - Utility-first styling system

### 4. AAA Quality Standards
- **Zero tech debt** - Fix immediately, never accumulate
- **Comprehensive docs** - JSDoc for all public functions
- **ECHO methodology** - Structured development tracking
- **DRY principle** - Maximum code reuse

---

## 🗂️ System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Client-Side)                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐         ┌──────────────────┐         │
│  │  React UI       │◄────────┤  State Manager   │         │
│  │  (Next.js App)  │         │  (SWR + Hooks)   │         │
│  └────────┬────────┘         └─────────┬────────┘         │
│           │                            │                   │
│           │                            │                   │
│           ▼                            ▼                   │
│  ┌─────────────────┐         ┌──────────────────┐         │
│  │  Canvas Renderer│◄────────┤  Image Queue     │         │
│  │  (Pixel Data)   │         │  Manager         │         │
│  └────────┬────────┘         └─────────┬────────┘         │
│           │                            │                   │
│           ▼                            ▼                   │
│  ┌──────────────────────────────────────────────┐         │
│  │         Watermark Engine (Core Logic)        │         │
│  │  • Alpha Map Detection                       │         │
│  │  • Reverse Blend Calculation                 │         │
│  │  • Pixel-by-Pixel Processing                 │         │
│  │  • Quality Optimization                      │         │
│  └──────────────────────────────────────────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Layer Architecture

### **Presentation Layer** (`src/app` + `src/components`)

**Responsibility:** User interface and interactions

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page (minimal, imports WatermarkRemover)
│   └── globals.css         # Global styles + animations
│
└── components/
    ├── Header.tsx          # Navigation + language switcher
    ├── Footer.tsx          # Links + branding
    ├── WatermarkRemover.tsx    # Main orchestrator
    ├── UploadArea.tsx      # Drag & drop interface
    ├── ImagePreview.tsx    # Side-by-side comparison
    └── BatchProgressBar.tsx    # Batch operation progress
```

**Key Decisions:**
- **Server Components disabled** - All processing client-side
- **Dynamic imports** - Code splitting for performance
- **Component composition** - Reusable, single-responsibility
- **CSS-in-JS avoided** - Tailwind utility classes only

---

### **Business Logic Layer** (`src/lib`)

**Responsibility:** Core algorithms and state management

```
src/lib/
├── core/                       # Watermark removal engine
│   ├── watermarkEngine.ts      # Main algorithm orchestrator
│   ├── alphaMap.ts             # Alpha channel detection
│   └── blendModes.ts           # Blend mode calculations
│
├── hooks/                      # React state management
│   └── useWatermarkEngine.ts   # Custom hook for state
│
├── utils/                      # Helper functions
│   └── imageUtils.ts           # Image processing utilities
│
└── i18n.ts                     # Internationalization
```

**Key Decisions:**
- **Pure functions** - No side effects in core logic
- **Web Workers ready** - Algorithm designed for background threads
- **Memory efficient** - Stream processing for large images
- **Type-safe** - Strict TypeScript across all files

---

### **Data Layer** (`src/types`)

**Responsibility:** Type definitions and interfaces

```
src/types/
├── index.ts            # Main type exports
└── images.d.ts         # Image-related type augmentation
```

**Key Decisions:**
- **Strict types** - No 'any' allowed
- **Interface over type** - For extensibility
- **Branded types** - Prevent primitive obsession
- **Utility types** - Reuse built-in TypeScript utilities

---

## 🔧 Core Components Deep Dive

### **WatermarkEngine** (`src/lib/core/watermarkEngine.ts`)

**Purpose:** Implements reverse alpha blending algorithm

```typescript
// Architecture
class WatermarkEngine {
  // Phase 1: Detection
  detectWatermark(imageData: ImageData): WatermarkMetadata
  
  // Phase 2: Analysis
  buildAlphaMap(imageData: ImageData, metadata: WatermarkMetadata): AlphaMap
  
  // Phase 3: Processing
  removeWatermark(imageData: ImageData, alphaMap: AlphaMap): ImageData
  
  // Phase 4: Optimization
  optimizeResult(imageData: ImageData): ImageData
}
```

**Algorithm Complexity:**
- **Time:** O(width × height) - Single pass pixel processing
- **Space:** O(width × height) - Alpha map storage
- **Parallelizable:** Yes - Can split into chunks for Web Workers

**Performance Characteristics:**
- **Small images (< 1MB):** ~100-200ms
- **Medium images (1-5MB):** ~500ms-1s
- **Large images (> 5MB):** ~2-5s

---

### **useWatermarkEngine Hook** (`src/lib/hooks/useWatermarkEngine.ts`)

**Purpose:** Manages application state and processing queue

```typescript
// State Management Architecture
interface WatermarkEngineState {
  // Queue Management
  imageQueue: ProcessedImage[];
  currentIndex: number;
  
  // Batch Processing
  batchState: 'idle' | 'processing' | 'paused';
  batchProgress: { total, completed, failed, pending };
  
  // Operations
  processFiles(files: FileList): Promise<void>;
  removeWatermark(index: number): Promise<void>;
  processBatch(): Promise<void>;
  cancelBatch(): void;
}
```

**State Flow:**
```
User uploads → processFiles() → imageQueue populated
             → Auto-process first image (if single)
             → User clicks "Remove All" → processBatch()
             → Sequential processing with progress updates
             → Final state: all completed or failed
```

---

## 🎨 UI Component Architecture

### **Component Hierarchy**

```
WatermarkRemover (Main Orchestrator)
├── Header
├── Hero Section (Static)
├── Features Grid (Static)
├── UploadArea (Conditional: !hasImages)
├── BatchProgressBar (Conditional: batchProcessing)
├── Thumbnail Navigation (Conditional: multiple images)
├── ImagePreview (Current image)
└── Footer
```

### **Styling Architecture**

**Design System Tokens:**
```css
/* Base Colors */
--primary: #3b82f6;    /* Blue */
--secondary: #8b5cf6;  /* Purple */
--accent: #ec4899;     /* Pink */
--background: #0a0a0f; /* Near black */

/* Glassmorphism */
--glass: backdrop-filter: blur(20px);
         background: rgba(255,255,255,0.05);

/* Gradients */
--gradient-primary: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
```

**Animation System:**
- **Float:** 6s vertical movement for hero badges
- **Glow:** 3s opacity pulse for status indicators
- **Shimmer:** Button hover effect with pseudo-element
- **Spin-slow:** 3s rotation for loading states

---

## 🚀 Performance Optimizations

### **1. Code Splitting**
```typescript
// Dynamic imports for large components
const HeavyComponent = dynamic(() => import('./Heavy'), {
  loading: () => <LoadingSpinner />
});
```

### **2. Image Optimization**
- **Canvas recycling** - Reuse canvas elements
- **Memory cleanup** - Revoke object URLs after use
- **Progressive loading** - Show thumbnails first

### **3. State Management**
- **SWR caching** - Avoid redundant processing
- **Memoization** - React.memo for expensive renders
- **Batch updates** - Queue state changes

### **4. Bundle Optimization**
- **Tree shaking** - Remove unused code
- **Asset compression** - Gzip/Brotli
- **Font subsetting** - Only load required glyphs

---

## 🔒 Security Architecture

### **1. Content Security Policy**
```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  connect-src 'self';
```

### **2. Data Privacy**
- **No external requests** - All processing local
- **No cookies** - Stateless application
- **No localStorage** - Session-only settings
- **No analytics** - Zero tracking

### **3. Input Validation**
```typescript
// File validation
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

function validateFile(file: File): boolean {
  return ALLOWED_TYPES.includes(file.type) && 
         file.size <= MAX_FILE_SIZE;
}
```

---

## 🧪 Testing Strategy

### **Unit Tests** (Target: 80% coverage)
- Core algorithm (watermarkEngine.ts)
- Utility functions (imageUtils.ts)
- Type definitions

### **Integration Tests**
- Component interactions
- State management flows
- File upload/download

### **E2E Tests** (Playwright)
- Complete user workflows
- Batch processing scenarios
- Error handling paths

---

## 📊 Monitoring & Observability

### **Performance Metrics**
- **Bundle size** - Track with next-bundle-analyzer
- **Load time** - Lighthouse CI
- **Processing speed** - Built-in performance API

### **Error Tracking** (Future)
- Client-side error boundary
- Sentry integration (privacy-preserving)
- Anonymous usage patterns

---

## 🔮 Future Architecture Considerations

### **Web Workers Implementation**
```typescript
// Offload heavy processing to background thread
const worker = new Worker('./watermarkWorker.ts');
worker.postMessage({ imageData, metadata });
worker.onmessage = (e) => {
  const processedData = e.data;
  // Update UI
};
```

### **WebAssembly (Potential)**
- **Use case:** Ultra-fast pixel processing
- **Trade-off:** Increased bundle size vs speed
- **Decision:** Evaluate if JS performance insufficient

### **Service Worker (Planned)**
- **Offline capability** - Cache app shell
- **Background processing** - Queue large batches
- **Progressive enhancement** - Graceful degradation

---

## 📝 Architectural Decision Records (ADRs)

### **ADR-001: Why Client-Side Processing?**
**Decision:** All image processing happens in browser  
**Reasoning:**
- ✅ User privacy (zero uploads)
- ✅ Zero server costs
- ✅ Instant processing (no network latency)
- ❌ Limited to browser capabilities
- ❌ Can't leverage GPU acceleration easily

**Outcome:** Accepted - Privacy > performance

---

### **ADR-002: Why Next.js over Vite/CRA?**
**Decision:** Use Next.js 15 with App Router  
**Reasoning:**
- ✅ Built-in optimizations (image, fonts)
- ✅ File-based routing
- ✅ TypeScript first-class support
- ✅ Vercel deployment integration
- ❌ Overkill for SPA (no SSR needed)

**Outcome:** Accepted - Future-proof for API routes

---

### **ADR-003: Why Tailwind CSS?**
**Decision:** Utility-first styling with Tailwind  
**Reasoning:**
- ✅ Rapid development
- ✅ Consistent design system
- ✅ Excellent tree-shaking
- ✅ No CSS-in-JS overhead
- ❌ HTML can get verbose

**Outcome:** Accepted - Developer velocity > verbosity

---

## 🎓 Key Learnings

1. **Privacy-first is hard** - Many libraries assume server-side processing
2. **Canvas performance varies** - Browser implementations differ significantly
3. **TypeScript strict mode pays off** - Caught many bugs early
4. **ECHO methodology works** - Clear tracking improved velocity
5. **Component composition scales** - Small, focused components = maintainable

---

**Document Maintained By:** RemoveGemini.com Core Team  
**Review Cadence:** Quarterly or on major architectural changes  
**Next Review:** April 1, 2026
