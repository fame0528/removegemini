# 📝 Decisions - RemoveGemini.com

**Last Updated:** January 17, 2026  
**Purpose:** Record important technical and strategic decisions

---

## Decision Log

### [DEC-001] Use Next.js over Vite/CRA
**Date:** 2024-11-15  
**Status:** ✅ ADOPTED  
**Category:** Technical Architecture

**Context:**
Choosing primary framework for client-side watermark removal application.

**Options Considered:**
1. **Create React App** - Simple, familiar, deprecated
2. **Vite** - Fast, modern, minimal
3. **Next.js** - Full-featured, optimized, future-proof

**Decision:**
Use **Next.js 15 with App Router**

**Reasoning:**
- ✅ Built-in optimizations (images, fonts, code splitting)
- ✅ File-based routing (clean structure)
- ✅ TypeScript first-class support
- ✅ Vercel deployment integration (zero-config)
- ✅ Future-proof for API routes (if needed)
- ✅ Excellent developer experience
- ❌ Slight overkill for pure SPA (no SSR needed)

**Consequences:**
- Faster development velocity
- Better performance out of the box
- Easier deployment
- Slightly larger bundle than Vite

**Outcome:** Success - Great DX, solid performance

---

### [DEC-002] Client-Side Processing Only
**Date:** 2024-11-15  
**Status:** ✅ ADOPTED  
**Category:** Architecture

**Context:**
How to implement watermark removal - server-side or client-side?

**Options Considered:**
1. **Server-side** - Upload images, process on backend, return result
2. **Client-side** - Process entirely in browser using Canvas API
3. **Hybrid** - Light processing client, heavy on server

**Decision:**
**100% client-side processing**

**Reasoning:**
- ✅ **Privacy:** Zero uploads, user data never leaves device
- ✅ **Cost:** No server infrastructure needed
- ✅ **Speed:** No network latency
- ✅ **Scalability:** Infinite users, zero server load
- ❌ **Limitations:** Constrained by browser capabilities
- ❌ **Performance:** Can't leverage GPU acceleration easily

**Consequences:**
- Must optimize algorithms for JavaScript performance
- Canvas API is the bottleneck
- Can't process extremely large images (> 50MB)
- Privacy is absolute (major selling point)

**Outcome:** Success - Privacy-first approach resonates with users

---

### [DEC-003] Tailwind CSS over styled-components
**Date:** 2024-11-16  
**Status:** ✅ ADOPTED  
**Category:** Styling

**Context:**
Choose styling approach for component library.

**Options Considered:**
1. **CSS Modules** - Scoped, familiar
2. **styled-components** - CSS-in-JS, dynamic
3. **Tailwind CSS** - Utility-first, rapid

**Decision:**
**Tailwind CSS 3.4**

**Reasoning:**
- ✅ Rapid development (no context switching)
- ✅ Consistent design system via tokens
- ✅ Excellent tree-shaking (small bundle)
- ✅ No runtime CSS-in-JS overhead
- ✅ Community plugins and ecosystem
- ❌ HTML can get verbose
- ❌ Learning curve for non-utility users

**Consequences:**
- Faster UI iteration
- Consistent spacing/colors
- Need to organize utility classes (avoid huge className strings)
- Some duplicate classes (acceptable trade-off)

**Outcome:** Success - Velocity increase, maintainable

---

### [DEC-004] MIT License with Single Copyright
**Date:** 2026-01-17  
**Status:** ✅ ADOPTED  
**Category:** Legal/Licensing

**Context:**
Repository rebrand from original MIT foundation to RemoveGemini.com.

**Options Considered:**
1. **Keep dual copyright** - Original + RemoveGemini.com
2. **Single copyright** - RemoveGemini.com only
3. **GPL** - Copyleft, forces open source

**Decision:**
**MIT License - RemoveGemini.com © 2026**

**Reasoning:**
- ✅ Clean ownership (single entity)
- ✅ Permissive (allows commercial use)
- ✅ Simple (easy to understand)
- ✅ Compatible with all dependencies
- ✅ Industry standard

**Consequences:**
- Complete severance from original foundation
- Full control over codebase direction
- Users can fork and modify freely
- Must maintain license notice in derivatives

**Outcome:** Success - Clear ownership, permissive use

---

### [DEC-005] ECHO Development Methodology
**Date:** 2026-01-17  
**Status:** ✅ ADOPTED  
**Category:** Development Process

**Context:**
Need structured approach for feature tracking and development.

**Options Considered:**
1. **Ad-hoc** - No formal tracking
2. **GitHub Projects** - Visual kanban
3. **ECHO** - Markdown-based FID system

**Decision:**
**ECHO v1.3.4 methodology**

**Reasoning:**
- ✅ Clear feature lifecycle (planned → progress → completed)
- ✅ Comprehensive tracking (time, LOC, metrics)
- ✅ Lessons learned capture
- ✅ Git-friendly (markdown files)
- ✅ Zero external dependencies
- ❌ More overhead than ad-hoc

**Consequences:**
- Must maintain /dev folder discipline
- Higher initial investment per feature
- Better project visibility
- Easier onboarding for contributors

**Outcome:** Success - Improved velocity, zero drift

---

### [DEC-006] No User Accounts/Authentication
**Date:** 2026-01-17  
**Status:** ✅ ADOPTED  
**Category:** Product Strategy

**Context:**
Should the app have user accounts for saving settings, history, etc.?

**Options Considered:**
1. **Full auth** - Accounts with email/password
2. **Optional auth** - Anonymous OR authenticated
3. **No auth** - Pure anonymous, localStorage only

**Decision:**
**No authentication - pure anonymous app**

**Reasoning:**
- ✅ **Privacy:** No user data collected at all
- ✅ **Simplicity:** No auth complexity
- ✅ **Speed:** Instant use, no signup friction
- ✅ **Trust:** Users don't need to trust us with data
- ❌ **Features:** Can't do cross-device sync
- ❌ **Monetization:** Harder to convert to paid

**Consequences:**
- Settings stored in localStorage only
- No history/favorites across devices
- Can't implement "saved presets" cloud sync
- Must explore privacy-preserving alternatives (end-to-end encrypted?)

**Outcome:** TBD - Strong differentiator, but limits future features

---

### [DEC-007] TypeScript Strict Mode Always
**Date:** 2024-11-15  
**Status:** ✅ ADOPTED  
**Category:** Code Quality

**Context:**
Should we use TypeScript strict mode or relaxed?

**Options Considered:**
1. **Relaxed** - Allow 'any', implicit any, etc.
2. **Strict** - Enforce all type safety rules

**Decision:**
**TypeScript strict mode enabled**

**Reasoning:**
- ✅ Catch bugs at compile time
- ✅ Better IDE autocomplete
- ✅ Self-documenting code
- ✅ Easier refactoring
- ❌ Slightly slower initial development

**Consequences:**
- Must define proper types for everything
- No 'any' escapes allowed
- More upfront type design
- Higher long-term code quality

**Outcome:** Success - Zero runtime type errors

---

### [DEC-008] No Analytics/Tracking
**Date:** 2026-01-17  
**Status:** ✅ ADOPTED  
**Category:** Privacy

**Context:**
Should we add analytics (Google Analytics, Plausible, etc.) to understand usage?

**Options Considered:**
1. **Google Analytics** - Industry standard, free
2. **Plausible** - Privacy-focused, paid
3. **Custom** - Self-hosted, full control
4. **None** - Zero tracking

**Decision:**
**No analytics - zero tracking**

**Reasoning:**
- ✅ **Privacy:** Matches core value proposition
- ✅ **Trust:** Users know they're not monitored
- ✅ **Legal:** No GDPR/cookie consent needed
- ✅ **Performance:** No tracking scripts
- ❌ **Blind:** No usage data for optimization
- ❌ **Product:** Can't measure feature success

**Consequences:**
- Must rely on GitHub stars/issues for feedback
- Can't do A/B testing easily
- Product decisions based on qualitative feedback
- Competitive disadvantage (less data than competitors)

**Outcome:** TBD - Aligns with privacy-first, but limits insights

---

### [DEC-009] Vercel for Deployment
**Date:** 2026-01-17  
**Status:** ✅ ADOPTED  
**Category:** Infrastructure

**Context:**
Where to host the Next.js application?

**Options Considered:**
1. **Vercel** - Native Next.js platform
2. **Netlify** - General static hosting
3. **Cloudflare Pages** - Global edge network
4. **Self-hosted** - VPS or bare metal

**Decision:**
**Vercel**

**Reasoning:**
- ✅ Zero-config Next.js deployment
- ✅ Automatic preview deployments
- ✅ Built-in CDN and edge functions
- ✅ Free tier sufficient
- ✅ Best DX for Next.js
- ❌ Vendor lock-in

**Consequences:**
- GitHub push → auto-deploy
- Can't easily migrate to other platforms
- Free tier limits (100GB bandwidth/month)
- Must optimize bundle size

**Outcome:** Success - Seamless deployment experience

---

### [DEC-010] Batch Processing Sequential (Not Parallel)
**Date:** 2026-01-16  
**Status:** ✅ ADOPTED  
**Category:** Technical Implementation

**Context:**
When processing multiple images, should we process them in parallel or sequentially?

**Options Considered:**
1. **Parallel** - Process all images simultaneously
2. **Sequential** - Process one at a time
3. **Chunked** - Process N at a time (e.g., 3)

**Decision:**
**Sequential processing**

**Reasoning:**
- ✅ Predictable memory usage
- ✅ Better progress visualization
- ✅ Easier error handling
- ✅ No browser tab freezing
- ❌ Slower total time

**Consequences:**
- User sees real-time progress
- Memory stays within safe limits
- Can cancel mid-batch cleanly
- Might add "chunked" mode later for power users

**Outcome:** Success - Stable, good UX

---

## Decision Categories

| Category | Decisions | Impact |
|----------|-----------|--------|
| **Architecture** | 3 | HIGH |
| **Privacy** | 2 | CRITICAL |
| **Development** | 2 | MEDIUM |
| **Infrastructure** | 2 | MEDIUM |
| **Code Quality** | 1 | HIGH |

---

## Decision Review Process

1. **Identify** - Major technical/strategic choice point
2. **Document** - Record context, options, reasoning
3. **Decide** - Choose option with team consensus
4. **Implement** - Execute decision
5. **Review** - Assess outcome after 30-90 days

---

**Maintained By:** RemoveGemini.com Core Team  
**Review Cadence:** Monthly (assess if decisions still valid)  
**Next Review:** February 1, 2026
