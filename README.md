# WTFToday.dev

A developer-focused desktop application that provides a daily briefing by pulling data from GitHub, email, and calendar accounts.

## MVP Development TODO List

### 1. Project Setup and Configuration

- [x] **Add Required Dependencies**
  - [x] Install TailwindCSS for styling
  - [x] Install React Router for navigation
  - [x] Install a state management library (Zustand recommended for simplicity)
  - [x] Install Axios for API requests
  - [x] Install React Query for data fetching and caching
  - [x] Install SQLite or another local storage solution

- [ ] **Configure TailwindCSS**
  - [ ] Set up tailwind.config.js
  - [ ] Create a base theme with colors, typography, and spacing
  - [x] Add Shadcn

- [x] **Set Up Project Structure**
  - [x] Create a components directory for reusable UI components
  - [x] Create a hooks directory for custom React hooks
  - [x] Create a utils directory for helper functions
  - [x] Create a types directory for TypeScript interfaces and types
  - [x] Create a services directory for API and data services
  - [x] Create a store directory for state management

### 2. Backend (Rust/Tauri) Implementation

- [ ] **Local Storage Setup**
  - [x] Implement SQLite database initialization
  - [ ] Create database schema for storing user credentials, tokens, and cached data
  - [ ] Implement CRUD operations for the database
  - [ ] Create Tauri commands for database access

- [ ] **GitHub Integration**
  - [ ] Implement GitHub OAuth flow or token storage
  - [ ] Create Tauri commands for fetching GitHub data (PRs, issues, notifications)
  - [ ] Implement caching mechanism for GitHub data

- [ ] **Email Integration**
  - [ ] Implement IMAP client for email access
  - [ ] Create Tauri commands for fetching and summarizing emails
  - [ ] Implement email credentials storage and management

- [ ] **Calendar Integration**
  - [ ] Implement Google Calendar API client or .ics file parser
  - [ ] Create Tauri commands for fetching calendar events
  - [ ] Implement calendar credentials storage and management

- [ ] **Data Synchronization**
  - [ ] Implement background data fetching and caching
  - [ ] Create a scheduler for periodic data updates
  - [ ] Implement error handling and retry mechanisms

### 3. Frontend (React/TypeScript) Implementation

- [ ] **Application Shell**
  - [ ] Create a responsive layout with sidebar and main content area
  - [ ] Implement navigation between different views
  - [ ] Add "Made by nock.ing" branding in the footer or about section

- [ ] **Onboarding/Setup Screen**
  - [ ] Create a multi-step onboarding flow
  - [ ] Implement GitHub authentication/token entry
  - [ ] Implement email credentials setup
  - [ ] Implement calendar integration setup
  - [ ] Create a settings page for managing integrations

- [ ] **Daily Brief View**
  - [ ] Create a dashboard layout with cards for different data sources
  - [ ] Implement GitHub section showing PRs, issues, and notifications
  - [ ] Implement Email section showing important emails
  - [ ] Implement Calendar section showing today's events
  - [ ] Add refresh functionality to update data manually

- [ ] **GitHub Integration UI**
  - [ ] Create components for displaying PRs, issues, and notifications
  - [ ] Implement filtering and sorting options
  - [ ] Add actions for common GitHub tasks (approve PR, comment, etc.)

- [ ] **Email Summary UI**
  - [ ] Create components for displaying email summaries
  - [ ] Implement filtering and sorting options
  - [ ] Add actions for common email tasks (reply, archive, etc.)

- [ ] **Calendar Events UI**
  - [ ] Create components for displaying calendar events
  - [ ] Implement time-based views (today, upcoming)
  - [ ] Add actions for common calendar tasks (join meeting, RSVP, etc.)

### 4. Testing and Refinement

- [ ] **Unit Testing**
  - [ ] Write tests for critical backend functions
  - [ ] Write tests for React components and hooks

- [ ] **Integration Testing**
  - [ ] Test the full application flow from setup to daily use
  - [ ] Test error handling and edge cases

- [ ] **Performance Optimization**
  - [ ] Optimize data fetching and caching
  - [ ] Reduce bundle size and improve load times

- [ ] **User Experience Refinement**
  - [ ] Implement loading states and error messages
  - [ ] Add animations and transitions for a polished feel
  - [ ] Ensure accessibility compliance

### 5. Packaging and Distribution

- [ ] **Application Packaging**
  - [ ] Configure Tauri for MacOS packaging
  - [ ] Create application icons and branding assets
  - [ ] Set up automatic updates (if needed)

- [ ] **Documentation**
  - [ ] Create user documentation
  - [ ] Create developer documentation for future maintenance

## Development Approach

1. **Modular Development**: Build each integration (GitHub, Email, Calendar) as a separate module that can be developed and tested independently.

2. **Iterative Implementation**: Start with a minimal implementation of each feature and refine it based on testing and feedback.

3. **Prioritize Core Functionality**: Focus on the GitHub integration and Daily Brief view first, as these provide the most immediate value.

4. **Reuse Components**: Design UI components to be reusable across different parts of the application.

5. **Local-First Approach**: Ensure the application works well offline by caching data locally and synchronizing when online.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run tauri dev

# Build for production
npm run tauri build
```
# wtftoday.dev
