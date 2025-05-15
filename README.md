# Angular Monorepo with Role-Based Access Control

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NgRx](https://img.shields.io/badge/NgRx-BA2BD2?style=for-the-badge&logo=redux&logoColor=white)
![D3.js](https://img.shields.io/badge/D3.js-F9A03C?style=for-the-badge&logo=d3.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![PrimeNG](https://img.shields.io/badge/PrimeNG-DD0031?style=for-the-badge&logo=primeng&logoColor=white)

A comprehensive Angular monorepo showcasing modern Angular development practices with multiple applications:

1. **User Management System** - A role-based access control system with user and permission management
2. **World Demographics Visualization** - An interactive data visualization application built with D3.js that displays world demographics data using circle packing visualization techniques

## Project Overview

This project demonstrates a well-structured Angular monorepo using Nx, with a focus on:

- Domain-Driven Design principles
- Smart/Dumb component architecture
- NgRx state management
- Modern Angular features (signals, control flow, etc.)
- Role-based access control
- Docker containerization

## Project Architecture

```
angular-monorepo/
├── apps/
│   ├── angular-case-study/      # World Demographics visualization app
│   │   └── Dockerfile           # App-specific Docker configuration
│   └── users-management/        # User Management application
│       └── Dockerfile           # App-specific Docker configuration
├── libs/                        # Shared libraries (domain-driven design)
│   ├── auth/                    # Authentication and authorization
│   │   ├── domain/              # Auth domain models and services
│   │   └── feature-login/       # Login feature components
│   ├── layout/                  # Layout components
│   │   ├── api/                 # Layout API interfaces
│   │   ├── domain/              # Layout domain models
│   │   ├── feature-landing/     # Landing page feature
│   │   └── feature-layout/      # Main layout with navigation
│   ├── roles/                   # Role management
│   │   ├── domain/              # Role domain models and state
│   │   ├── feature-manage/      # Role management components
│   │   ├── feature-shell/       # Role feature routing
│   │   └── ui-manage-form/      # Role form UI components
│   ├── users/                   # User management
│   │   ├── domain/              # User domain models and state
│   │   ├── feature-manage/      # User management components
│   │   ├── feature-shell/       # User feature routing
│   │   └── ui-user-form/        # User form UI components
│   └── visualizations/          # Data visualization components
│       ├── domain/              # Visualization domain models
│       ├── feature-world-demographics/  # World demographics feature
│       └── ui-circle-packging/  # Circle packing visualization UI
├── tools/
│   └── mock-api/               # Mock API server with JSON Server
│       ├── db.json             # Mock database
│       ├── auth-middleware.js  # Authentication middleware
│       └── Dockerfile          # Mock API Docker configuration
└── docker-compose.yml          # Docker Compose configuration for all services
```

## Features

### User Management System

- **User Management**: Create, view, edit, and delete users with role assignments
- **Role-Based Access Control**: Assign roles with specific permissions to users
- **Permission-Based UI**: Dynamic UI elements that show/hide based on user permissions
- **Form Validation**: Comprehensive validation including async username uniqueness checks
- **Secure Authentication**: JWT-based authentication with proper token management
- **Modern Angular Patterns**: Uses signals, computed values, and modern control flow syntax

### World Demographics Visualization

- **Interactive Circle Packing Visualization**: Explore hierarchical data with an intuitive, interactive interface built with D3.js
- **Continent Selection**: Filter data by continent to focus on specific geographical areas
- **Metric Toggle**: Switch between population and land area metrics
- **Responsive Design**: Optimized for various screen sizes with horizontal layout for wide screens
- **Loading & Error States**: User-friendly feedback during data loading and error handling

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- Docker and Docker Compose (optional, for containerized deployment)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/osamaalnuimi/angular-monorepo.git
   cd angular-monorepo
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

### Running the Applications

#### User Management System

1. Start the mock API server:

   ```sh
   npm run mock-api
   ```

2. In a separate terminal, start the user management application:

   ```sh
   npm run users-management
   ```

3. Open your browser and navigate to `http://localhost:4200`

4. Login with the following credentials:
   - Username: `admin`
   - Password: `password`

#### World Demographics Visualization

1. Start the application:

   ```sh
   npm run serve
   ```

2. Open your browser and navigate to `http://localhost:4200`

### Docker Deployment

The project includes Docker configuration for all applications:

1. Build and run all applications using Docker Compose:

   ```sh
   docker-compose up --build
   ```

2. Access the applications at:
   - User Management: `http://localhost:4200`
   - World Demographics: `http://localhost:4000`
   - Mock API Server: `http://localhost:3000`

To run individual applications:

```sh
# User Management
docker build -t user-management -f apps/users-management/Dockerfile .
docker run -p 4200:4200 user-management

# World Demographics
docker build -t world-demographics -f apps/angular-case-study/Dockerfile .
docker run -p 4000:4000 world-demographics

# Mock API
docker build -t mock-api -f tools/mock-api/Dockerfile .
docker run -p 3000:3000 mock-api
```

## Implementation Details

### NgRx State Management

The application uses NgRx for state management with:

- **State**: Well-defined interfaces for application state
- **Actions**: Strongly-typed action creators for all operations
- **Reducers**: Pure functions for state updates
- **Effects**: Side effects for API calls and notifications
- **Facades**: Clean API for components to interact with the store

### Component Architecture

The project follows a smart/dumb component pattern:

- **Smart Components**: Handle business logic, state management, and service dependencies
- **Dumb Components**: Focus on UI concerns, receive data via inputs, and emit events via outputs
- **Separation of Concerns**: Clear boundaries between presentation and business logic

### Modern Angular Features

The application showcases modern Angular features:

- **Signals**: For reactive state management within components
- **Control Flow**: Using @if/@for syntax in templates
- **Functional Guards**: For route protection
- **Standalone Components**: For better tree-shaking and modularity

## Mock API Server

The project uses JSON Server to provide a mock backend API with:

- User authentication with JWT tokens
- CRUD operations for users and roles
- Permission-based access control

The mock data is defined in `tools/mock-api/db.json` and can be customized as needed.

---

# Original Nx Workspace Documentation

<details>
<summary>Click to expand</summary>

# AngularMonorepo

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/tutorials/3-angular-monorepo/1a-introduction/1-welcome?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve angular-case-study
```

To create a production bundle:

```sh
npx nx build angular-case-study
```

To see all available targets to run for a project, run:

```sh
npx nx show project angular-case-study
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/angular:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/angular:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Set up CI!

### Step 1

To connect to Nx Cloud, run the following command:

```sh
npx nx connect
```

Connecting to Nx Cloud ensures a [fast and scalable CI](https://nx.dev/ci/intro/why-nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/ci/features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/ci/features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/ci/features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/ci/features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Step 2

Use the following command to configure a CI workflow for your workspace:

```sh
npx nx g ci-workflow
```

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/tutorials/3-angular-monorepo/1a-introduction/1-welcome?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:

- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
</details>
