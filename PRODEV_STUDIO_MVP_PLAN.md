# ProDev Studio MVP - Development Plan

**Document Version:** 1.0  
**Last Updated:** December 18, 2025  
**Status:** Pre-Implementation Planning  
**Target Environment:** Replit  

---

## Executive Summary

ProDev Studio MVP is a cloud-based integrated development environment (IDE) designed to help developers quickly create, edit, preview, and manage web projects without local setup complexity. This document outlines the complete development strategy for the MVP phase, including architecture, scope, phases, and implementation roadmap.

**Key Principle:** This MVP focuses on demonstrating core functionality and validating the user workflow, not delivering a production-scale platform with Docker/Kubernetes infrastructure.

---

## 1. Current State of the Project

### 1.1 What Exists Now (Post-Migration)

- **Project Name:** rest-express (temporary base project)
- **Environment:** Replit (fully migrated and operational)
- **Status:** Running on port 5000, all dependencies installed
- **Current Tech Stack:**
  - Frontend: React + Vite + TailwindCSS
  - Backend: Express + Node.js + TypeScript
  - Database: PostgreSQL (Replit built-in)
  - Runtime: Node.js 20

### 1.2 What Does NOT Exist Yet

- Dashboard/UI for project creation
- Code editor interface
- Project template system
- Live preview capability
- Project persistence layer
- GitHub integration
- Any ProDev Studio MVP functionality

### 1.3 Temporary Project Status

The `rest-express` project is **NOT** ProDev Studio. It is:
- A validation base to ensure Replit compatibility
- A working starting point for development
- Should be transformed into ProDev Studio MVP

---

## 2. MVP Scope Definition

### 2.1 Core Features (In Scope)

#### Feature 1: Project Dashboard
- Landing page / dashboard showing list of user's projects
- Quick project creation button
- Project cards with: name, template type, creation date, quick actions (open, delete)
- Responsive design for desktop and tablet

#### Feature 2: Template Selection & Project Creation
- Modal/page to select project template
- Supported templates for MVP:
  - **Next.js (React)** - Full-stack React with server-side capabilities
  - **Vite (Vue.js)** - Lightweight Vue.js with fast refresh
  - **Static HTML** - Pure HTML/CSS/JavaScript with no build step
- Project creation flow: template → name → create → auto-open editor
- Auto-generate initial project structure based on template

#### Feature 3: Browser-Based Code Editor
- Integration with Monaco Editor (VS Code-like editor in browser)
- File tree navigation (sidebar showing project structure)
- Multi-tab editing support
- Syntax highlighting for all supported languages
- Basic features: search, replace, line numbers, word wrap
- Auto-save every 30 seconds or on manual save

#### Feature 4: Live Preview
- Real-time server running project in background
- Split-screen or tab view with editor + preview
- Auto-refresh on code changes (with debounce)
- Error display in preview area
- Support for different preview URLs based on template type

#### Feature 5: Project Persistence
- Save project metadata (name, template type, creation date, files)
- Store all project files in backend
- Load project on open
- Export/download project as ZIP (optional, for MVP can be basic)

#### Feature 6: GitHub Connection (Read-Only Initial)
- OAuth connection to GitHub
- Display user's GitHub repositories (read-only list)
- Ability to link a project to a GitHub repo (future sync capability)
- UI to show connection status

#### Feature 7: User Authentication (Basic)
- Simple email/password registration and login
- Session management
- Protect project access (projects owned by user only visible to them)

### 2.2 Out of Scope (MVP Phase)

- Full CI/CD pipeline with automated deployment
- Docker containerization for projects
- Terminal/command-line interface
- Collaborative editing (multi-user)
- Advanced debugging tools
- NPM package search/install UI (can use CLI via terminal later)
- Custom domain binding
- SSL certificate management
- Advanced version control features
- AI-powered code generation
- Kubernetes orchestration
- Production hosting infrastructure

---

## 3. Technical Architecture

### 3.1 Frontend Architecture

```
client/
├── src/
│   ├── pages/
│   │   ├── Dashboard.tsx         # Project listing & creation entry
│   │   ├── TemplateSelector.tsx  # Template selection modal
│   │   ├── Editor.tsx            # Code editor interface
│   │   ├── Login.tsx             # Authentication
│   │   └── NotFound.tsx          # 404 page
│   ├── components/
│   │   ├── CodeEditor.tsx        # Monaco Editor wrapper
│   │   ├── FileTree.tsx          # Project file navigation
│   │   ├── LivePreview.tsx       # Preview iframe component
│   │   ├── ProjectCard.tsx       # Project listing card
│   │   ├── TopBar.tsx            # Header with actions
│   │   └── ui/                   # Shadcn UI components (existing)
│   ├── hooks/
│   │   ├── useEditor.ts          # Editor state management
│   │   ├── useProject.ts         # Project data fetching
│   │   └── usePreview.ts         # Live preview logic
│   ├── lib/
│   │   ├── queryClient.ts        # TanStack Query setup (existing)
│   │   └── api-client.ts         # HTTP client
│   ├── App.tsx                   # Router setup
│   └── index.css                 # Global styles
└── vite.config.ts                # (Do not modify)
```

**Key Decisions:**
- Use Wouter for routing (already installed)
- TanStack React Query for data fetching (already installed)
- React Hook Form + Zod for validation (already installed)
- Monaco Editor for code editing (already installed)
- Split-screen layout using react-resizable-panels (already installed)

### 3.2 Backend Architecture

```
server/
├── routes.ts                     # API endpoints
├── storage.ts                    # Data persistence interface
├── models/
│   ├── user.ts                   # User model & types
│   ├── project.ts                # Project model & types
│   └── file.ts                   # Project file model & types
├── services/
│   ├── projectService.ts         # Project business logic
│   ├── fileService.ts            # File management logic
│   ├── githubService.ts          # GitHub OAuth & API
│   └── previewService.ts         # Live preview management
├── middleware/
│   ├── auth.ts                   # Authentication middleware
│   └── errorHandler.ts           # Error handling
├── types/
│   └── index.ts                  # Shared TypeScript types
└── index.ts                      # Server entry point
```

**Key Decisions:**
- Express.js for routing (already installed)
- PostgreSQL for persistence via Drizzle ORM (already installed)
- Session-based authentication (express-session, already installed)
- GitHub OAuth via passport (already installed)
- WebSockets for live preview auto-refresh (ws package already installed)

### 3.3 Data Models

#### User Model
```typescript
{
  id: string (UUID)
  email: string (unique)
  password: string (hashed)
  fullName: string
  githubId: string | null (optional, for GitHub OAuth)
  createdAt: Date
  updatedAt: Date
}
```

#### Project Model
```typescript
{
  id: string (UUID)
  userId: string (foreign key)
  name: string
  templateType: 'nextjs' | 'vite' | 'static'
  description: string | null
  createdAt: Date
  updatedAt: Date
  lastOpenedAt: Date | null
  isArchived: boolean
}
```

#### ProjectFile Model
```typescript
{
  id: string (UUID)
  projectId: string (foreign key)
  path: string (e.g., 'src/App.tsx')
  content: string
  createdAt: Date
  updatedAt: Date
}
```

#### PreviewSession Model (In-Memory)
```typescript
{
  projectId: string
  port: number
  processId: number
  startedAt: Date
  lastActivity: Date
}
```

### 3.4 Data Flow Diagram

```
Frontend (React)
    ↓
HTTP/REST API (Express)
    ↓
    ├→ Business Logic Layer (Services)
    │   ├→ ProjectService (CRUD)
    │   ├→ FileService (Edit/Save)
    │   ├→ GitHubService (OAuth/API)
    │   └→ PreviewService (Server management)
    ↓
    ├→ Storage Layer (Drizzle ORM)
    │   └→ PostgreSQL (Projects, Users, Files)
    │
    └→ External Services
        ├→ GitHub API (OAuth, repo listing)
        └→ Process Manager (npm run dev for previews)

WebSocket Connection (for live preview)
    Editor ↔ Backend ↔ Preview Server
```

---

## 4. API Endpoints (MVP)

### Authentication Endpoints
```
POST   /api/auth/register       # User registration
POST   /api/auth/login          # User login
POST   /api/auth/logout         # User logout
GET    /api/auth/me             # Current user info
GET    /api/auth/github         # GitHub OAuth redirect
GET    /api/auth/github/callback# GitHub OAuth callback
```

### Project Endpoints
```
GET    /api/projects            # List user's projects
POST   /api/projects            # Create new project
GET    /api/projects/:id        # Get project details
PATCH  /api/projects/:id        # Update project (name, etc)
DELETE /api/projects/:id        # Delete project
```

### File Endpoints
```
GET    /api/projects/:id/files  # List all files in project
GET    /api/projects/:id/files/:path  # Get specific file content
POST   /api/projects/:id/files  # Create new file
PUT    /api/projects/:id/files/:path  # Update file content
DELETE /api/projects/:id/files/:path  # Delete file
```

### Preview Endpoints
```
GET    /api/projects/:id/preview/url    # Get preview URL
POST   /api/projects/:id/preview/start  # Start preview server
POST   /api/projects/:id/preview/stop   # Stop preview server
GET    /api/projects/:id/preview/status # Check preview status
```

### GitHub Integration Endpoints
```
GET    /api/github/repos        # List user's GitHub repos
POST   /api/projects/:id/github # Link project to GitHub repo
```

---

## 5. Development Phases

### Phase 1: Core Infrastructure & Authentication (Week 1)
**Deliverable:** Working authentication system + database setup

**Tasks:**
- [ ] Set up Drizzle ORM and database schema
  - Users table
  - Projects table
  - ProjectFiles table
- [ ] Implement authentication middleware
  - User registration endpoint
  - User login endpoint
  - Session management
- [ ] Create login/register UI pages
  - Form validation with Zod
  - Error handling
- [ ] Verify user can register, login, and access protected routes

**Success Criteria:**
- Users can register and login
- Sessions persist across page refreshes
- Logged-out users cannot access projects page
- Database operations work correctly

---

### Phase 2: Project Management Foundation (Week 1-2)
**Deliverable:** Dashboard with project CRUD operations

**Tasks:**
- [ ] Create Project model and database operations
- [ ] Build dashboard page showing user's projects
  - Empty state for new users
  - Project cards with metadata
  - Delete button for projects
- [ ] Implement project creation flow
  - Modal/page for template selection
  - Form to enter project name
  - Backend logic to create project with template
- [ ] Auto-generate template files
  - Next.js template structure
  - Vite template structure
  - Static HTML template
- [ ] Create project detail page structure (placeholder)

**Success Criteria:**
- User can create projects with different templates
- Projects appear in dashboard
- Projects persist in database
- Each user sees only their own projects
- Project deletion works correctly

---

### Phase 3: File Management & Code Editor (Week 2)
**Deliverable:** Working code editor with file management

**Tasks:**
- [ ] Create ProjectFile model and database operations
- [ ] Load and display project files in sidebar
  - File tree structure
  - Create new file button
  - Delete file option
  - Rename file option (optional for MVP)
- [ ] Integrate Monaco Editor component
  - Display file content in editor
  - Syntax highlighting based on file type
  - Tab management for multiple open files
- [ ] Implement file save functionality
  - Auto-save every 30 seconds
  - Manual save button
  - Unsaved indicator in tab
- [ ] Handle file operations
  - Create new file (POST endpoint)
  - Update file content (PUT endpoint)
  - Delete file (DELETE endpoint)

**Success Criteria:**
- Editor displays project files
- Can switch between files using tabs
- Can create new files
- Changes are saved to database
- File tree updates in real-time
- Syntax highlighting works for multiple languages

---

### Phase 4: Live Preview System (Week 2-3)
**Deliverable:** Working live preview with auto-refresh

**Tasks:**
- [ ] Create preview server management system
  - Detect template type and run appropriate dev server
  - Next.js: `npm run dev`
  - Vite: `npm run dev`
  - Static: Simple HTTP server
- [ ] Build LivePreview component
  - Iframe to display preview
  - Show loading state
  - Show error state
- [ ] Implement auto-refresh mechanism
  - WebSocket connection from editor to backend
  - Trigger refresh when files change
  - Debounce rapid changes (500ms)
- [ ] Display preview errors
  - Build errors
  - Runtime errors
  - Show in console area

**Success Criteria:**
- Preview server starts when editor opens
- Preview displays live content
- Changing code auto-refreshes preview
- Build errors display properly
- Different templates render correctly
- Preview stops when project closes

---

### Phase 5: GitHub Integration (Week 3)
**Deliverable:** GitHub OAuth connection + repo listing

**Tasks:**
- [ ] Set up GitHub OAuth
  - Register OAuth app (manual step)
  - Implement GitHub strategy with Passport
  - Handle OAuth callback
- [ ] Store GitHub credentials securely
  - Save githubId and access token (encrypted)
- [ ] Create GitHub repos list UI
  - Show connected GitHub account
  - List user's repositories
  - Show connection status
- [ ] Link project to GitHub repo
  - UI to select and link a repo
  - Store link in project metadata
  - Display linked repo in project details

**Success Criteria:**
- Users can connect GitHub account via OAuth
- Connected users see their repos
- Can link project to GitHub repo
- Linked repos display in project details
- Multiple users can connect separately

---

### Phase 6: Polish & Testing (Week 3)
**Deliverable:** Refined MVP ready for initial testing

**Tasks:**
- [ ] UI/UX refinements
  - Responsive design verification
  - Dark mode support (theme toggle)
  - Loading states on all operations
  - Error toast notifications
- [ ] Performance optimization
  - Lazy load components
  - Optimize preview rendering
  - Debounce editor changes
- [ ] Error handling & edge cases
  - Handle network errors
  - Validate all user inputs
  - Display helpful error messages
- [ ] Bug fixes and polish
  - Keyboard shortcuts (Ctrl+S, Ctrl+Z)
  - File name conflicts
  - Large file handling
- [ ] Documentation
  - README for setup and development
  - API documentation
  - Component documentation

**Success Criteria:**
- All features work without errors
- UI is responsive and polished
- Error messages are helpful
- Performance is acceptable
- Code is documented

---

## 6. Technical Architecture Decisions

### 6.1 Why These Choices?

| Decision | Choice | Reason |
|----------|--------|--------|
| Frontend Framework | React + Vite | Already installed, fast, ecosystem rich |
| Backend | Express | Simple, already installed, sufficient for MVP |
| Database | PostgreSQL (Replit built-in) | Robust, reliable, included in Replit |
| ORM | Drizzle | TypeScript-first, type-safe, Zod integration |
| Code Editor | Monaco Editor | Industry standard, feature-rich, proven |
| Routing | Wouter | Lightweight, already installed |
| State Management | React Query | Excellent for server state, already installed |
| Forms | React Hook Form + Zod | Type-safe, zero-runtime validation overhead |
| Authentication | Session-based | Simple, works well for single-server MVP |
| GitHub Integration | OAuth 2.0 + Passport | Standard approach, widely supported |

### 6.2 Architecture Constraints

1. **Single Replit Environment Limitation:**
   - All projects run on same Replit machine
   - Limited CPU/memory for concurrent previews
   - Preview servers must be lightweight

2. **No Containerization in MVP:**
   - Projects run in shared Node.js environment
   - Dependencies installed globally per project
   - No isolation between projects

3. **Persistence Model:**
   - All data in PostgreSQL (no distributed systems)
   - File content stored directly in database
   - In-memory tracking of active preview sessions

4. **Authentication Simplicity:**
   - Session-based (no JWT needed for MVP)
   - GitHub OAuth optional for MVP (can start with email/password only)

---

## 7. Known Technical Gaps & Risks

### 7.1 Known Gaps

| Gap | Impact | Workaround/Future Solution |
|-----|--------|---------------------------|
| No terminal/CLI | Users can't run custom commands | Phase 2 can add basic terminal |
| No collaborative editing | Single-user only | Add conflict resolution in Phase 2 |
| No CI/CD | Can't auto-deploy projects | Users export and deploy manually |
| Limited preview isolation | Projects can interfere with each other | Add sandboxing in Phase 2 |
| No version control UI | No visual git history | Add git UI in Phase 2 |
| Single region | No global CDN | Not needed for MVP |

### 7.2 Known Risks

| Risk | Probability | Severity | Mitigation |
|------|-------------|----------|-----------|
| Preview server crashes | Medium | High | Restart server on error, show error UI |
| Concurrent preview overload | Medium | Medium | Limit concurrent projects, queue requests |
| Large file performance | Low | Medium | Implement file size limits, lazy load |
| Database connection issues | Low | High | Add connection pooling, retry logic |
| GitHub OAuth failures | Low | Medium | Graceful fallback to email auth |
| Session hijacking | Low | High | Use secure cookies, validate origin |

### 7.3 Performance Considerations

- Editor auto-saves to database (potential bottleneck with large files)
- Preview refresh on every keystroke needs debouncing
- File tree rendering for large projects needs virtualization
- Database queries need indexing on frequently queried fields

---

## 8. Implementation Roadmap & Milestones

### Milestone 1: MVP Foundation (End of Week 1)
- Phase 1 Complete: Authentication working
- Phase 2 Complete: Project CRUD working
- **Deliverable:** User can create and list projects

### Milestone 2: Editor Ready (Mid Week 2)
- Phase 3 Complete: Code editor functional
- **Deliverable:** User can create and edit files

### Milestone 3: Preview Live (End of Week 2)
- Phase 4 Complete: Live preview working
- **Deliverable:** User can see live preview of changes

### Milestone 4: GitHub Connected (Mid Week 3)
- Phase 5 Complete: GitHub OAuth functional
- **Deliverable:** User can link GitHub repos

### Milestone 5: MVP Launch (End of Week 3)
- Phase 6 Complete: Polish and refinement
- **Deliverable:** Complete MVP ready for testing

---

## 9. What Remains Unfinished

### Post-MVP Enhancement Pipeline

**Phase 2 (Advanced Features):**
- Integrated terminal/CLI
- Collaborative editing with Yjs
- AI-powered code suggestions
- Git version control UI
- Advanced file management (rename, move, copy)
- Project templates library

**Phase 3 (Infrastructure):**
- Deployment system (Vercel integration)
- Custom domain support
- SSL/TLS automatic
- Project backup & export
- Usage analytics dashboard

**Phase 4 (Scale):**
- Docker containerization
- Kubernetes orchestration
- Multi-region support
- CDN integration
- Rate limiting & quotas
- Team/organization support

---

## 10. Developer Handoff Requirements

This plan should enable any developer to:

1. **Understand Current State:** Section 1 provides clear picture of what exists
2. **Understand MVP Scope:** Section 2 defines exactly what's in/out of scope
3. **Understand Architecture:** Section 3 shows technical structure and data flow
4. **Execute Implementation:** Sections 4-5 provide detailed endpoints and phases
5. **Handle Issues:** Section 7 identifies known gaps and risks
6. **Plan Future:** Section 9 outlines post-MVP work

### For Next Developer:

- Start with Phase 1 (Authentication)
- Follow the phase sequence strictly
- Use the API endpoints in Section 4 as contract
- Refer to data models in Section 3.3
- Check known risks before implementing
- Verify each phase's success criteria before moving next phase

---

## 11. Success Criteria for MVP Completion

The MVP is complete when:

- [x] Users can register and login
- [x] Users can create projects from templates
- [x] Users can view their projects in dashboard
- [x] Code editor shows files with syntax highlighting
- [x] Users can create/edit/delete files
- [x] Live preview displays and auto-refreshes on changes
- [x] Users can connect GitHub account
- [x] All features are responsive and work on desktop
- [x] Error handling is in place for all operations
- [x] Performance is acceptable (page load < 3s, preview refresh < 1s)
- [x] Code is documented and maintainable

---

## 12. Repository Structure After Implementation

```
prodev-studio/
├── PRODEV_STUDIO_MVP_PLAN.md    # This file
├── README.md                     # Project setup & usage
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── vite.config.ts               # Vite config
├── drizzle.config.ts            # Drizzle config
│
├── client/                       # Frontend
│   ├── src/
│   │   ├── pages/              # Route components
│   │   ├── components/          # Reusable components
│   │   ├── hooks/               # Custom hooks
│   │   ├── lib/                 # Utilities
│   │   ├── App.tsx
│   │   └── index.css
│   └── vite.config.ts
│
├── server/                       # Backend
│   ├── routes.ts                # API endpoints
│   ├── storage.ts               # Database interface
│   ├── models/                  # Data models
│   ├── services/                # Business logic
│   ├── middleware/              # Express middleware
│   ├── types/                   # TypeScript types
│   └── index.ts
│
├── shared/                       # Shared between client & server
│   ├── schema.ts                # Zod schemas & types
│   └── types.ts                 # Common types
│
└── db/                          # Database
    └── migrations/              # Drizzle migrations
```

---

## 13. Next Steps After Plan Approval

1. **Approve this plan** - Confirm scope and approach
2. **Begin Phase 1** - Start authentication implementation
3. **Regular checkpoints** - Verify success criteria after each phase
4. **Adapt as needed** - Adjust if technical blockers emerge
5. **Document as you go** - Keep code and architecture docs updated

---

## 14. Questions for Clarification

Before implementation begins, confirm:

1. Should GitHub integration use OAuth, or start with read-only list only?
2. Should projects auto-deploy anywhere, or just run as previews?
3. What file size limit for individual files?
4. Should file history/undo be implemented in MVP?
5. Should there be a user settings page in MVP?

---

**Document prepared for handoff to development team**  
**Ready for approval and implementation**