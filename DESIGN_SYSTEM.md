# Smart Campus Design System Documentation

## Overview

The Smart Campus Design System is a comprehensive UI framework built specifically for the Smart Campus Service Request System. It provides a consistent, professional, and accessible design language across all components and pages.

## 🎨 Color Themes

### 1. Campus Blue (Default)
**Professional and trustworthy theme perfect for educational institutions**

- **Primary**: Blue tones (#3b82f6) - Trust, stability, communication
- **Secondary**: Green tones (#22c55e) - Growth, success, completion
- **Accent**: Orange tones (#f97316) - Energy, action, urgency
- **Neutral**: Cool grays (#f8fafc to #0f172a)

**Best for**: General campus use, student-facing interfaces

### 2. Academic Purple
**Sophisticated theme emphasizing wisdom and innovation**

- **Primary**: Purple tones (#a855f7) - Wisdom, innovation, creativity
- **Secondary**: Teal tones (#14b8a6) - Knowledge, technology, precision
- **Accent**: Gold tones (#f59e0b) - Excellence, achievement, premium
- **Neutral**: Warm grays

**Best for**: Administrative interfaces, premium features

### 3. Modern Green
**Fresh and sustainable theme for forward-thinking institutions**

- **Primary**: Forest green (#22c55e) - Growth, sustainability, nature
- **Secondary**: Blue tones (#3b82f6) - Trust, communication, reliability
- **Accent**: Coral tones (#ef4444) - Attention, urgency, alerts
- **Neutral**: Light grays

**Best for**: Environmental initiatives, modern campuses

## 🎯 Role-Based Color Coding

### Student Role
- **Color**: Blue tones (#3b82f6)
- **Meaning**: Learning, growth, exploration
- **Usage**: Student dashboards, request creation, progress tracking

### Technician Role
- **Color**: Green tones (#10b981)
- **Meaning**: Action, service, resolution
- **Usage**: Work orders, completion status, service indicators

### Admin Role
- **Color**: Purple tones (#8b5cf6)
- **Meaning**: Authority, control, oversight
- **Usage**: Management interfaces, system controls, analytics

## 📊 Status & Priority System

### Request Status Colors
```css
--color-status-pending: #f59e0b     /* Amber - Waiting for action */
--color-status-in-progress: #3b82f6 /* Blue - Currently being worked on */
--color-status-completed: #10b981   /* Green - Successfully finished */
--color-status-cancelled: #ef4444   /* Red - Stopped or rejected */
```

### Priority Level Colors
```css
--color-priority-low: #10b981       /* Green - Can wait */
--color-priority-medium: #f59e0b    /* Amber - Normal urgency */
--color-priority-high: #f97316      /* Orange - Needs attention */
--color-priority-urgent: #ef4444    /* Red - Immediate action required */
```

## 🔧 CSS Custom Properties

### Typography Scale
```css
--font-size-xs: 0.75rem    /* 12px - Small labels, captions */
--font-size-sm: 0.875rem   /* 14px - Body text, form inputs */
--font-size-base: 1rem     /* 16px - Default body text */
--font-size-lg: 1.125rem   /* 18px - Subheadings */
--font-size-xl: 1.25rem    /* 20px - Card titles */
--font-size-2xl: 1.5rem    /* 24px - Section headings */
--font-size-3xl: 1.875rem  /* 30px - Page titles */
--font-size-4xl: 2.25rem   /* 36px - Hero headings */
--font-size-5xl: 3rem      /* 48px - Display headings */
```

### Spacing Scale
```css
--space-1: 0.25rem   /* 4px - Tight spacing */
--space-2: 0.5rem    /* 8px - Small gaps */
--space-3: 0.75rem   /* 12px - Default padding */
--space-4: 1rem      /* 16px - Standard spacing */
--space-5: 1.25rem   /* 20px - Comfortable spacing */
--space-6: 1.5rem    /* 24px - Section spacing */
--space-8: 2rem      /* 32px - Large spacing */
--space-10: 2.5rem   /* 40px - Extra large spacing */
--space-12: 3rem     /* 48px - Section dividers */
--space-16: 4rem     /* 64px - Page sections */
--space-20: 5rem     /* 80px - Major sections */
```

### Border Radius
```css
--radius-xs: 0.125rem   /* 2px - Subtle rounding */
--radius-sm: 0.25rem    /* 4px - Small elements */
--radius-md: 0.375rem   /* 6px - Default rounding */
--radius-lg: 0.5rem     /* 8px - Cards, modals */
--radius-xl: 0.75rem    /* 12px - Large cards */
--radius-2xl: 1rem      /* 16px - Hero sections */
--radius-3xl: 1.5rem    /* 24px - Special elements */
--radius-full: 9999px   /* Full rounding - badges, pills */
```

### Shadow Levels
```css
--shadow-xs: /* Subtle shadow for small elements */
--shadow-sm: /* Default card shadow */
--shadow-md: /* Hover states, dropdowns */
--shadow-lg: /* Modals, important elements */
--shadow-xl: /* Hero sections, overlays */
```

## 🧩 Component Library

### Buttons

#### Primary Button
```html
<button class="btn btn-primary">Primary Action</button>
```
- Use for main actions (Submit, Save, Create)
- Gradient background with hover effects
- High contrast for accessibility

#### Secondary Button
```html
<button class="btn btn-secondary">Secondary Action</button>
```
- Use for secondary actions (Cancel, Back, Edit)
- Solid background, less prominent than primary

#### Outline Button
```html
<button class="btn btn-outline">Outline Action</button>
```
- Use for tertiary actions or when background conflicts
- Transparent background with border

#### Button Sizes
```html
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary">Default</button>
<button class="btn btn-primary btn-lg">Large</button>
```

### Form Controls

#### Input Field
```html
<div class="form-group">
  <label class="form-label">Field Label</label>
  <input type="text" class="form-control" placeholder="Enter text">
</div>
```

#### Select Dropdown
```html
<div class="form-group">
  <label class="form-label">Select Option</label>
  <select class="form-control">
    <option>Option 1</option>
    <option>Option 2</option>
  </select>
</div>
```

### Status Badges

#### Status Badges
```html
<span class="badge badge-pending">Pending</span>
<span class="badge badge-in-progress">In Progress</span>
<span class="badge badge-completed">Completed</span>
<span class="badge badge-cancelled">Cancelled</span>
```

#### Priority Badges
```html
<span class="badge badge-low">Low</span>
<span class="badge badge-medium">Medium</span>
<span class="badge badge-high">High</span>
<span class="badge badge-urgent">Urgent</span>
```

#### Role Badges
```html
<span class="badge badge-student">Student</span>
<span class="badge badge-technician">Technician</span>
<span class="badge badge-admin">Admin</span>
```

### Cards

#### Basic Card
```html
<div class="card">
  <div class="card-header">
    <h3>Card Title</h3>
  </div>
  <div class="card-body">
    <p>Card content goes here.</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

### Alerts

#### Alert Types
```html
<div class="alert alert-success">Success message</div>
<div class="alert alert-warning">Warning message</div>
<div class="alert alert-danger">Error message</div>
<div class="alert alert-info">Information message</div>
```

### Tables

#### Responsive Table
```html
<div class="table-container">
  <table class="table">
    <thead>
      <tr>
        <th>Header 1</th>
        <th>Header 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Data 1</td>
        <td>Data 2</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Loading States

#### Spinner
```html
<div class="spinner"></div>
<div class="spinner spinner-sm"></div>
```

#### Loading Text
```html
<div class="loading">Content is loading...</div>
```

### Modals

#### Modal Structure
```html
<div class="modal-overlay">
  <div class="modal">
    <div class="modal-header">
      <h3 class="modal-title">Modal Title</h3>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <p>Modal content</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary">Cancel</button>
      <button class="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
@media (min-width: 640px)  { /* Small tablets */ }
@media (min-width: 768px)  { /* Tablets */ }
@media (min-width: 1024px) { /* Small desktops */ }
@media (min-width: 1280px) { /* Large desktops */ }
@media (min-width: 1536px) { /* Extra large screens */ }
```

### Container Sizes
```css
.container {
  max-width: 640px;  /* sm */
  max-width: 768px;  /* md */
  max-width: 1024px; /* lg */
  max-width: 1280px; /* xl */
  max-width: 1536px; /* 2xl */
}
```

### Responsive Utilities
```html
<!-- Hide on mobile -->
<div class="hidden-mobile">Desktop only content</div>

<!-- Hide on desktop -->
<div class="hidden-desktop">Mobile only content</div>

<!-- Show only on mobile -->
<div class="mobile-only">Mobile specific content</div>
```

## 🌙 Dark Mode Support

### Automatic Detection
The system automatically detects user's system preference for dark mode.

### Manual Toggle
Use the ThemeToggle component to allow users to manually switch between light and dark modes.

### Implementation
```css
/* Light mode (default) */
:root {
  --color-background-primary: #f8fafc;
  --color-text-primary: #0f172a;
}

/* Dark mode */
[data-theme="dark"] {
  --color-background-primary: #0f172a;
  --color-text-primary: #f8fafc;
}
```

## ♿ Accessibility Features

### WCAG 2.1 AA Compliance
- Color contrast ratios meet or exceed 4.5:1 for normal text
- Color contrast ratios meet or exceed 3:1 for large text
- Focus indicators are clearly visible
- Keyboard navigation is fully supported

### Focus Management
```css
:focus-visible {
  outline: 2px solid var(--color-border-accent);
  outline-offset: 2px;
}
```

### Screen Reader Support
```html
<!-- Use semantic HTML -->
<button aria-label="Close modal">×</button>

<!-- Provide context -->
<span class="sr-only">Status:</span>
<span class="badge badge-pending">Pending</span>
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 🚀 Implementation Guide

### Phase 1: Foundation
1. Import design-system.css in your main CSS file
2. Update global.css to use design tokens
3. Add Inter font from Google Fonts

### Phase 2: Component Updates
1. Update existing components to use new CSS classes
2. Replace hardcoded colors with CSS custom properties
3. Implement new button and form styles

### Phase 3: Advanced Features
1. Add ThemeToggle component
2. Implement dark mode support
3. Add loading skeletons and animations

### Phase 4: Testing & Optimization
1. Test across all breakpoints
2. Verify accessibility compliance
3. Optimize for performance

## 📋 Best Practices

### Color Usage
- Use semantic color tokens instead of hardcoded values
- Maintain consistent color meanings across the application
- Test color combinations for accessibility

### Typography
- Use the typography scale consistently
- Maintain proper heading hierarchy (h1 → h2 → h3)
- Ensure readable line heights and spacing

### Spacing
- Use the spacing scale for consistent layouts
- Maintain visual rhythm with consistent spacing
- Use white space effectively to improve readability

### Components
- Keep components focused and reusable
- Use consistent naming conventions
- Document component variations and usage

### Performance
- Minimize CSS bundle size
- Use efficient selectors
- Optimize for critical rendering path

## 🔧 Customization

### Adding New Colors
```css
:root {
  --color-custom-primary: #your-color;
  --color-custom-secondary: #your-color;
}
```

### Creating New Components
```css
.your-component {
  background-color: var(--color-background-secondary);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
}
```

### Theme Variations
```css
[data-theme="your-theme"] {
  --color-primary-500: #your-primary-color;
  --color-secondary-500: #your-secondary-color;
}
```

## 📞 Support

For questions or issues with the design system:
1. Check this documentation first
2. Review component examples
3. Test in different browsers and devices
4. Ensure accessibility compliance

## 🔄 Updates

The design system is continuously improved based on:
- User feedback
- Accessibility requirements
- Performance optimizations
- New feature requirements

Keep your implementation up to date with the latest version for the best experience.