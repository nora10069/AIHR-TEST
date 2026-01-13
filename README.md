# HR Pro Event Toolbox

Frontend application for HR Pro Event Toolbox.

## Getting Started

### Prerequisites
- Node.js (v20 or higher recommended)
- npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

## Scripts

- `npm run dev`: Starts local development server.
- `npm run build`: Builds the project for production.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run lint:fix`: Runs ESLint and fixes auto-fixable issues.
- `npm run format`: Formats code using Prettier.

## Deployment

This project is configured to deploy automatically to **GitHub Pages** via GitHub Actions.

### Setup
1. Go to your GitHub repository **Settings**.
2. Navigate to **Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.

### Workflow
The deployment workflow is defined in `.github/workflows/deploy.yml`. It triggers on every push to the `main` or `master` branch.

## Troubleshooting

### Deployment Error: "HttpError: Not Found" (404)
If you see this error in your GitHub Actions logs: `Failed to create deployment (status: 404)`, it means GitHub Pages is not enabled.

**Fix:**
1.  Go to **Settings** > **Pages** in your GitHub repository.
2.  Under **Build and deployment**, ensure **Source** is set to **GitHub Actions** (NOT "Deploy from a branch").
3.  If it was already set, try toggling it: Select "Deploy from a branch", then switch back to "GitHub Actions".
4.  Re-run the failed workflow.
