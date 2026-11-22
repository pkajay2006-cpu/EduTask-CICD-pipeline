# GitHub-Based Automated CI/CD Pipeline

[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue?logo=githubactions&logoColor=white)](.github/workflows/ci-cd.yml)
[![Framework](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tests](https://img.shields.io/badge/Tests-Vitest%20%2B%20RTL-success?logo=vitest&logoColor=white)](src/test/App.test.jsx)
[![Hosting](https://img.shields.io/badge/Deployment-GitHub%20Pages-22c55e?logo=github&logoColor=white)](https://pages.github.com/)

A complete, production-ready demonstration of an automated **Continuous Integration (CI) and Continuous Deployment (CD)** pipeline using **GitHub Actions**, deploying a real **Student Task Manager** web application to **GitHub Pages**.

---

## 🎯 Project Objective

Demonstrate how modern DevOps workflows automate code verification, testing, bundle building, and production deployment on every commit and pull request—eliminating manual deployments and catching bugs before code reaches production.

---

## 🚀 Application Overview: Student Task Manager ("EduTask")

The application is a modern, responsive web application designed for students to organize coursework, assignments, and exam deadlines.

### Features
1. **Interactive Metrics Dashboard**: Real-time counters for **Total Tasks**, **Pending Tasks**, **Completed Tasks**, and an animated **Completion Rate (%)** progress bar.
2. **Add New Tasks**: Complete modal form with client-side validation, subject selection (e.g., Computer Science, Data Structures, Operating Systems), 3-tier priority indicators (High, Medium, Low), due date picker, and optional assignment notes.
3. **Toggle Completion**: One-click task completion with strikethrough styling and live dashboard recalculation.
4. **Delete Tasks & Bulk Clean-up**: Individual task removal with confirmation styling and a "Clear Completed" batch action.
5. **Persistent Storage (`localStorage`)**: Automatic synchronization with browser `localStorage`, seeded with realistic coursework on first visit.
6. **Multi-dimensional Filtering & Search**: Instant full-text search across titles and notes, status tabs (`All`, `Pending`, `Completed`), subject filter, priority filter, and multiple sort orders (Due Date, Newest, Priority).
7. **CI/CD Pipeline Architecture View**: Built-in interactive banner detailing each stage of the automated GitHub Actions workflow.

---

## 🏗️ CI/CD Pipeline Architecture

The pipeline is defined in `.github/workflows/ci-cd.yml` and is broken into 3 decoupled stages:

```
                  ┌────────────────────────────────────────┐
                  │ Push to main / Pull Request to main    │
                  └──────────────────┬─────────────────────┘
                                     │
                                     ▼
               ┌──────────────────────────────────────────────┐
               │         STAGE 1: Automated Tests (CI)        │
               │  • Checkout code (actions/checkout@v4)       │
               │  • Setup Node.js 20 LTS                      │
               │  • Clean install dependencies (npm ci)       │
               │  • Execute Vitest test suite (npm test)      │
               └─────────────────────┬────────────────────────┘
                                     │ (Success)
                                     ▼
               ┌──────────────────────────────────────────────┐
               │         STAGE 2: Production Build (CI)       │
               │  • Needs: test passed                        │
               │  • Compile React bundle (npm run build)      │
               │  • Setup Pages (actions/configure-pages@v5)  │
               │  • Upload ./dist artifact (@v3)              │
               └─────────────────────┬────────────────────────┘
                                     │ (Success & push to main)
                                     ▼
               ┌──────────────────────────────────────────────┐
               │    STAGE 3: Deploy to GitHub Pages (CD)      │
               │  • Needs: build passed                       │
               │  • Trigger: github.ref == 'refs/heads/main'  │
               │  • Least privilege: pages:write, id-token    │
               │  • Deploy to live URL (actions/deploy-pages) │
               └──────────────────────────────────────────────┘
```

### Pipeline Key Highlights & Best Practices
- **Strict Quality Gate**: Build and deployment will **never** execute if automated unit tests fail.
- **Conditional Deployment**: Pull requests only trigger `test` and `build` to validate integrity; deployment to GitHub Pages triggers exclusively on pushes to the `main` branch.
- **Principle of Least Privilege**: Top-level workflow permissions default to `contents: read`. Elevated permissions (`pages: write`, `id-token: write` for OIDC) are restricted strictly to the `deploy` job.
- **Vite Base Path Resolution**: `vite.config.js` configures `base: process.env.VITE_BASE_PATH || './'`, generating relative asset URLs (`./assets/...`) so the app functions properly under project subpaths (`https://<username>.github.io/<repo-name>/`) as well as custom domains.
- **Concurrency Control**: Prevents race conditions with `concurrency: group: 'pages'`.

---

## 📂 Project Structure

```
pipeline/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions CI/CD workflow definition
├── public/
│   └── favicon.svg            # Application favicon
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx      # Metrics overview cards and progress bar
│   │   ├── FilterBar.jsx      # Search, tabs, priority/subject filters, and sorting
│   │   ├── Header.jsx         # App bar, live date, and reset button
│   │   ├── PipelineStatusBadge.jsx # Interactive CI/CD architecture breakdown
│   │   ├── TaskForm.jsx       # Task creation form with validation
│   │   ├── TaskItem.jsx       # Individual task item with actions
│   │   └── TaskList.jsx       # List container and empty state views
│   ├── data/
│   │   └── initialTasks.js    # Seed sample tasks for initial launch
│   ├── hooks/
│   │   └── useTasks.js        # State management and localStorage sync hook
│   ├── test/
│   │   ├── App.test.jsx       # Automated test suite (8 passing tests)
│   │   └── setup.js           # Test environment setup and storage polyfills
│   ├── App.css                # Polished modern slate/indigo stylesheet
│   ├── App.jsx                # Main application component
│   ├── index.css              # Global styles, variables, typography
│   └── main.jsx               # React entry point
├── .gitignore                 # Node, build, and environment ignores
├── index.html                 # HTML template
├── package.json               # Scripts and dependencies
├── vite.config.js             # Vite configuration with relative base path
└── README.md                  # Project documentation
```

---

## 🧪 Automated Testing

The project uses **Vitest** and **React Testing Library** to execute real unit and integration tests:

| Test Case | Description |
|:---|:---|
| `renders header and dashboard metrics` | Verifies brand, counters, and initial completion rate |
| `allows user to add a new task` | Validates form interactions, task insertion, and counter updates |
| `validates empty task titles` | Ensures required title validation displays an alert |
| `toggles task completion status` | Verifies completion status toggling and pending/completed metrics |
| `deletes a task` | Verifies DOM removal and total task counter decrement |
| `filters tasks by status` | Tests `Pending`, `Completed`, and `All` tabs |
| `filters tasks by search input` | Validates real-time fuzzy text search across titles and notes |
| `persists changes to localStorage` | Verifies JSON serialization in browser storage |

---

## 🛠️ Step-by-Step Execution Guide (Manual Actions)

Follow the steps below to initialize the Git repository, run local verification, push to GitHub, and enable GitHub Pages.

### 1. Local Verification (Run locally in terminal)

Run tests locally to verify quality gates:
```bash
# Run the automated test suite
npm test

# Verify production build compilation
npm run build

# (Optional) Preview production build locally
npm run preview
```

### 2. Initialize Git and Commit

```bash
# Initialize git repository with main branch
git init -b main

# Stage all files
git add .

# Create initial commit
git commit -m "feat: complete student task manager with github actions ci/cd"
```

### 3. Create a GitHub Repository and Push

1. Open your browser and go to [GitHub New Repository](https://github.com/new).
2. Name your repository (e.g. `student-task-manager` or `github-ci-cd-pipeline`).
3. Leave it Public (recommended for free GitHub Pages deployment) and do **not** initialize with README or .gitignore (these are already created).
4. Run the following commands in your project folder (replace `<your-username>` and `<repo-name>` with your actual values):

```bash
# Link your local repo to GitHub
git remote add origin https://github.com/<your-username>/<repo-name>.git

# Push code to main branch
git push -u origin main
```

---

## ⚙️ Configuring GitHub Pages in Repository Settings

To allow the GitHub Actions workflow to deploy your site, enable **GitHub Actions** as the Pages source:

1. In your GitHub repository, click on the **Settings** tab.
2. In the left navigation menu, under the **Code and automation** section, click on **Pages**.
3. Under **Build and deployment**:
   - Change **Source** from *"Deploy from a branch"* to **"GitHub Actions"**.
4. That's it! No secret tokens or manual branch management are required.

When you push code or merge a pull request to `main`, GitHub Actions will automatically:
1. Run your automated test suite.
2. Build your React Vite bundle into `./dist`.
3. Deploy the site live to `https://<your-username>.github.io/<repo-name>/`.

---

## 💻 Available Scripts

- `npm run dev`: Starts local Vite development server.
- `npm test`: Executes Vitest test suite in CI run mode.
- `npm run test:watch`: Runs Vitest in interactive watch mode.
- `npm run build`: Compiles production build to `dist/`.
- `npm run preview`: Previews the production build locally.
