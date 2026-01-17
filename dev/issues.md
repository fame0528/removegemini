# 🐛 Issues & Bugs - RemoveGemini.com

**Last Updated:** January 17, 2026  
**Status:** Tracking known issues and bug reports

---

## 📋 Active Issues

_No active issues at this time._

---

## ✅ Resolved Issues

### [BUG-001] Medium-zoom creating multiple instances
**Reported:** 2026-01-16  
**Severity:** HIGH  
**Status:** ✅ FIXED (2026-01-16)

**Description:**
Medium-zoom was creating multiple instances on component re-renders, causing black screen overlay when clicking images.

**Root Cause:**
Missing cleanup in useEffect, leading to accumulated zoom instances.

**Fix:**
Implemented proper lifecycle management:
```typescript
useEffect(() => {
  const zoom = mediumZoom(imgRef.current);
  return () => zoom.detach(); // Cleanup on unmount
}, [item.originalUrl]);
```

**Verification:**
- [x] Single zoom instance per image
- [x] No black screen issues
- [x] Proper cleanup confirmed

---

### [BUG-002] Black dead space around images
**Reported:** 2026-01-16  
**Severity:** MEDIUM  
**Status:** ✅ FIXED (2026-01-16)

**Description:**
Images had black letterboxing due to aspect-square containers forcing 1:1 ratio.

**Root Cause:**
CSS classes forcing aspect-square containers regardless of natural image dimensions.

**Fix:**
Removed aspect-square, used natural h-auto dimensions:
```typescript
// Before
<div className="aspect-square">
  <img ... />
</div>

// After
<img className="h-auto max-h-[600px]" />
```

**Verification:**
- [x] Zero dead space
- [x] Natural image proportions
- [x] Responsive on all screen sizes

---

## 🔮 Future Monitoring

### Performance Tracking
- [ ] Monitor processing times for large images (> 10MB)
- [ ] Track bundle size growth
- [ ] Lighthouse score regression testing

### Browser Compatibility
- [ ] Test on Safari (WebKit engine)
- [ ] Test on Firefox (Gecko engine)
- [ ] Test on older Chrome versions (v100+)

### Edge Cases
- [ ] Very large images (> 50MB)
- [ ] Corrupt image files
- [ ] Images with EXIF orientation
- [ ] AVIF/WebP format handling

---

## 📝 Issue Reporting Template

```markdown
## [BUG-XXX] Brief description

**Reported:** YYYY-MM-DD
**Severity:** LOW | MEDIUM | HIGH | CRITICAL
**Status:** OPEN | IN_PROGRESS | FIXED | WONTFIX

**Description:**
Clear description of the issue.

**Steps to Reproduce:**
1. Step one
2. Step two
3. Expected vs actual behavior

**Environment:**
- Browser: Chrome 121 / Firefox 122 / Safari 17
- OS: Windows 11 / macOS 14 / Ubuntu 22.04
- Screen: 1920x1080 / 2560x1440 / Mobile

**Root Cause:**
Technical explanation (if known).

**Fix:**
Description of the solution.

**Verification:**
- [ ] Criteria 1
- [ ] Criteria 2
```

---

## 🚨 Critical Issues Process

1. **Identify** - Log in this file immediately
2. **Assess** - Determine severity and impact
3. **Fix** - Create FID in planned.md if > 1 hour work
4. **Test** - Verify fix thoroughly
5. **Document** - Move to "Resolved" section with solution
6. **Monitor** - Watch for regression

---

**Maintained By:** RemoveGemini.com Core Team  
**Review Cadence:** Weekly (Monday mornings)  
**Next Review:** January 20, 2026
