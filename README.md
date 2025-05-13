# World Demographics Visualization

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![D3.js](https://img.shields.io/badge/D3.js-F9A03C?style=for-the-badge&logo=d3.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

An interactive data visualization project built with Angular and D3.js that displays world demographics data using circle packing visualization techniques. The application allows users to explore population and land area statistics by continent, region, and country.

## Features

- **Interactive Circle Packing Visualization**: Explore hierarchical data with an intuitive, interactive interface
- **Continent Selection**: Filter data by continent to focus on specific geographical areas
- **Metric Toggle**: Switch between population and land area metrics
- **Responsive Design**: Optimized for various screen sizes with horizontal layout for wide screens
- **Loading & Error States**: User-friendly feedback during data loading and error handling

## Project Architecture

This project follows Domain-Driven Design principles within an Angular monorepo structure:

```
angular-monorepo/
├── apps/
│   └── angular-case-study/      # Main application
├── libs/
│   └── visualizations/
│       ├── domain/              # Domain layer (entities, interfaces)
│       ├── feature-world-demographics/  # Feature components (smart)
│       └── ui-circle-packging-visualization/  # UI components (dumb)
├── docs/
│   ├── adr/                     # Architecture Decision Records
│   └── tdr/                     # Technical Decision Records
└── Dockerfile                   # Docker configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- Docker (optional, for containerized deployment)

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

3. Start the development server:

   ```sh
   npx nx serve angular-case-study
   ```

4. Open your browser and navigate to `http://localhost:4200`

### Docker Deployment

To build and run the application using Docker:

1. Build the Docker image:

   ```sh
   docker build -t world-demographics-viz .
   ```

2. Run the container:

   ```sh
   docker run -p 4000:4000 world-demographics-viz
   ```

3. Access the application at `http://localhost:4000`

## Development

### Generate a new library

```sh
npx nx g @nx/angular:lib my-lib --directory=visualizations
```

### Generate a component

```sh
npx nx g @nx/angular:component my-component --project=visualizations-ui-circle-packging-visualization
```

### Running tests

```sh
# Run tests for all projects
npx nx run-many --target=test --all

# Run tests for a specific project
npx nx test visualizations-ui-circle-packging
```

## Documentation

For more detailed information about the project architecture and technical decisions, see:

- [Architecture Decision Records](./docs/adr/README.md)
- [Technical Decision Records](./docs/tdr/README.md)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

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
