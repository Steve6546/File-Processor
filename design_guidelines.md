# ProDev Studio - Design Guidelines

## Design Approach

**Selected Approach**: Design System + Reference-Based Hybrid
- **Primary References**: VS Code (editor layout), GitHub (dashboard), Linear (modern developer UX)
- **Rationale**: Developer-focused productivity tool requiring familiar patterns with modern refinement
- **Key Principle**: Function over form - every pixel serves developer efficiency

---

## Layout Architecture

### Dashboard Layout
- **Container**: Full-width application with max-w-7xl centered content for project cards
- **Project Grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` for project cards
- **Sidebar Navigation**: Fixed left sidebar (w-64) with collapsible sections for navigation
- **Header**: Sticky top bar (h-16) with user profile, notifications, and global actions

### IDE Layout (Code Editor View)
- **Three-Panel Layout**:
  - Left: File Explorer (w-64, resizable)
  - Center: Monaco Editor (flex-1, primary focus)
  - Right: Live Preview (w-1/2, resizable, toggleable)
- **Bottom Panel**: Collapsible terminal/output area (h-48 when open)
- **Tab System**: Horizontal tabs for open files above editor

---

## Typography Hierarchy

**Font Stack**:
- **Primary**: 'Inter' (UI elements, labels, buttons)
- **Monospace**: 'JetBrains Mono' or 'Fira Code' (code editor, terminal, file names)

**Scale**:
- Headings: text-2xl (dashboard titles), text-lg (section headers)
- Body: text-sm (primary UI text, file explorer)
- Code: text-sm (editor content)
- Labels: text-xs (metadata, timestamps, file sizes)
- Buttons: text-sm font-medium

---

## Spacing System

**Tailwind Units**: Consistently use `2, 3, 4, 6, 8, 12, 16` for rhythm
- Component padding: `p-4` to `p-6`
- Card spacing: `p-6` internal, `gap-6` between cards
- Panel margins: `m-0` (panels are edge-to-edge)
- Button padding: `px-4 py-2` (standard), `px-6 py-3` (primary CTAs)
- Section spacing: `space-y-8` for dashboard sections

---

## Component Library

### Navigation & Headers
- **Top Bar**: Fixed header with search, notifications bell icon, user avatar dropdown
- **Sidebar**: Vertical navigation with icon + label, active state with border accent
- **Breadcrumbs**: Show project > file path in editor view

### Project Cards (Dashboard)
- **Structure**: Rounded borders, subtle elevation
- **Content**: Project name (text-lg font-semibold), tech stack badge, last modified timestamp, thumbnail preview area
- **Actions**: Three-dot menu (top-right), primary "Open" button
- **Hover State**: Slight elevation increase

### IDE Components
- **File Explorer Tree**: 
  - Folder icons (chevron right/down for expand/collapse)
  - File icons with type indicators
  - Right-click context menu support (visual affordance)
  - Nested indentation: pl-4 per level

- **Monaco Editor Integration**:
  - Full-height container with border
  - Line numbers, minimap (right side)
  - Tab bar above editor for open files
  - File tabs: rounded-t, closable with X icon

- **Live Preview Panel**:
  - iframe container with URL bar showing preview address
  - Refresh button, device width toggles (desktop/tablet/mobile)
  - Loading state with skeleton/spinner

- **Terminal Panel**:
  - Monospace font, command history
  - Tabs for multiple terminal instances
  - Clear button, maximize/minimize controls

### Forms & Inputs
- **Text Inputs**: Border with focus ring, placeholder text, label above
- **Select Dropdowns**: Tech stack selector with icon + name
- **Buttons**:
  - Primary: Solid background, medium font-weight, rounded
  - Secondary: Border outline, transparent background
  - Icon buttons: Square, subtle hover background
  - Size variants: px-4 py-2 (default), px-6 py-3 (large)

### Modals & Overlays
- **Create Project Modal**: Centered (max-w-2xl), template selection grid
- **Settings Panel**: Slide-out from right (w-96), organized sections
- **Confirmation Dialogs**: Compact (max-w-md), clear action buttons

---

## Visual Patterns

### Panels & Containers
- **Borders**: Subtle dividers between panels (border-r, border-b)
- **Elevation**: Minimal - only for modals and dropdowns
- **Corners**: Rounded-lg for cards, rounded for buttons, sharp corners for panels

### Interactive States
- **Hover**: Subtle background change for clickable items
- **Active/Selected**: Border accent or background tint
- **Focus**: Clear focus rings for keyboard navigation (ring-2)
- **Disabled**: Reduced opacity (opacity-50)

### Icons
- **Library**: Heroicons (outline style for navigation, solid for actions)
- **Sizes**: w-5 h-5 (standard UI), w-4 h-4 (compact areas)
- **File Type Icons**: Custom set for .js, .css, .html, .json, folders

---

## Responsive Behavior

- **Desktop (lg+)**: Full three-panel layout with all features visible
- **Tablet (md)**: Collapsible sidebar, stacked editor + preview (toggle between)
- **Mobile (base)**: Single-view mode, bottom navigation, simplified file explorer

---

## Animation Guidelines

**Minimize Animations** - developers prefer instant feedback:
- Panel resize: No transition (immediate)
- File tree expand/collapse: duration-150 (quick)
- Tab switching: No animation
- Modals: fade-in duration-200
- **Avoid**: Elaborate scroll effects, decorative animations

---

## Images

**No hero images** - this is a functional application, not a marketing site
- **Project Thumbnails**: 16:9 ratio placeholder for project preview screenshots
- **Empty States**: Simple illustrations for "no projects yet" (optional SVG graphics)
- **User Avatars**: Circular (w-8 h-8 in header, w-10 h-10 in profile)

---

## Accessibility

- High contrast text for readability during extended coding sessions
- Keyboard shortcuts displayed in tooltips
- Screen reader labels for icon-only buttons
- Resizable panels with drag handles (visible affordance)
- Focus management for modal dialogs

---

## Design Delivery Notes

This is a **complex, multi-view application** requiring:
- Dashboard view (project management)
- Full IDE view (editor workspace)
- Settings/configuration interfaces
- GitHub repository browser interface

Each view should feel cohesive while optimized for its specific purpose. The design must prioritize developer productivity - clean, distraction-free, and instantly familiar to users of modern code editors.