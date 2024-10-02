# Automate Deployment using GitHub Actions and Google Cloud Run

This repository demonstrates how to automate the deployment of a web application built with **Vite**, **Vue 3**, and **TypeScript** using **GitHub Actions** and **Google Cloud Run**. It includes setup for managing separate **prod** and **dev** environments using **Google Cloud Run**, **Artifact Registry**, and **Workload Identity Federation** for keyless authentication.

## Features

- **Continuous Integration (CI)**: Ensures that every push to any branch triggers code checking (linting) and builds the project.
- **Continuous Deployment (CD)**: Automatically deploys the application to Google Cloud Run in **prod** or **dev** environments based on the branch (`main` for production, `develop` for development).
- **Workload Identity Federation**: Secure, keyless authentication from GitHub Actions to Google Cloud, eliminating the need to manage service account keys.
- **Containerization**: The project is built as a Docker container and pushed to **Google Artifact Registry**.
- **Separate Environments**: Deployments are handled in distinct **prod** and **dev** environments for **Cloud Run** and **Artifact Registry**.
- **Cloud Run**: The container is deployed to a **Cloud Run** service in the specified Google Cloud region.

## Workflow Overview

### GitHub Actions Workflow: `Build and Deploy to Cloud Run`

The GitHub Actions workflow consists of two jobs:

1. **Code-Check**:

   - Runs linting and ensures that the project builds successfully with the specified Node.js version.

2. **Build-and-Deploy**:
   - Builds the Docker container for the web app.
   - Pushes the container to **Google Artifact Registry**.
   - Deploys the container to **Google Cloud Run**, choosing between the `dev` or `prod` environment based on the branch (`main` for production, `develop` for development).

### Workload Identity Federation

This project uses **Workload Identity Federation** to authenticate GitHub Actions with Google Cloud in a secure, keyless manner. This removes the need to store service account keys in GitHub secrets, improving security.

To learn more about setting up **Workload Identity Federation**, refer to [this guide](https://cloud.google.com/blog/products/identity-security/enabling-keyless-authentication-from-github-actions).

### Trigger

- The workflow is triggered on every push to any branch, but deployment only occurs on pushes to the `main` or `develop` branches.

### Workflow Syntax

To learn more about GitHub Actions workflow syntax, visit the [official documentation](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions).

## Environments

- **Production**: When code is pushed to the `main` branch, the container is pushed to the **prod** repository in **Google Artifact Registry** and deployed to the **prod** Cloud Run service.
- **Development**: When code is pushed to the `develop` branch, the container is pushed to the **dev** repository in **Google Artifact Registry** and deployed to the **dev** Cloud Run service.

## Environment Variables

The following secrets and environment variables must be set in GitHub Secrets for the workflow to function:

- `PROJECT_ID`: Your Google Cloud Project ID.
- `REGION`: The Google Cloud region where the service will be deployed (e.g., `asia-southeast1`).
- `WORKLOAD_IDENTITY_PROVIDER`: Workload identity provider to authenticate to Google Cloud.
- `SERVICE_ACCOUNT`: The service account to be used for deployments.
- **Separate Artifact Repositories**:
  - Use different repositories for dev and prod, e.g., `cloud-run-source-deploy-dev` and `cloud-run-source-deploy`.

## GitHub Actions Configuration

```yaml
name: Build and Deploy to Cloud Run

on:
  push:
    branches:
      - "**"

env:
  PROJECT_ID: ${{ secrets.PROJECT_ID }}
  REGION: asia-southeast1
  WORKLOAD_IDENTITY_PROVIDER: ${{ secrets.WORKLOAD_IDENTITY_PROVIDER }}
  SERVICE_ACCOUNT: ${{ secrets.SERVICE_ACCOUNT }}

jobs:
  Code-Check:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]

    steps:
      - name: Check out repository code
        uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install dependencies
        run: npm install

      - name: Build Project
        run: npm run build

      - name: Run linting
        run: npm run lint

  Build-and-Deploy:
    needs: Code-Check
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'
    permissions:
      contents: read
      id-token: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - id: auth
        name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: "${{ env.WORKLOAD_IDENTITY_PROVIDER }}"
          service_account: "${{ env.SERVICE_ACCOUNT }}"

      - name: Configure Docker Client
        run: |-
          gcloud auth configure-docker --quiet
          gcloud auth configure-docker ${{ env.REGION }}-docker.pkg.dev --quiet

      - name: Set env SERVICE and ARTIFACT_REPO
        run: |
          if [[ "${GITHUB_REF##*/}" == "main" ]]; then
            echo "SERVICE=${{ github.event.repository.name }}" >> "$GITHUB_ENV"
            echo "ARTIFACT_REPO=cloud-run-source-deploy-prod" >> "$GITHUB_ENV"
          else
            echo "SERVICE=${{ github.event.repository.name }}-dev" >> "$GITHUB_ENV"
            echo "ARTIFACT_REPO=cloud-run-source-deploy-dev" >> "$GITHUB_ENV"

      - name: Build and Push Container
        run: |-
          DOCKER_TAG="${{ env.REGION }}-docker.pkg.dev/${{ env.PROJECT_ID }}/${{ env.ARTIFACT_REPO }}/${{ env.SERVICE }}:${{ github.sha }}"
          docker build --tag "${DOCKER_TAG}" .
          docker push "${DOCKER_TAG}"

      - name: Deploy to Cloud Run
        id: deploy
        uses: google-github-actions/deploy-cloudrun@v2
        with:
          service: "${{ env.SERVICE }}"
          region: "${{ env.REGION }}"
          image: "${{ env.REGION }}-docker.pkg.dev/${{ env.PROJECT_ID }}/${{ env.ARTIFACT_REPO }}/${{ env.SERVICE }}:${{ github.sha }}"

      - name: Show output
        run: |2-
          echo ${{ steps.deploy.outputs.url }}
```

## Prerequisites

Before using this workflow, ensure you have:

1. A **Google Cloud Project** with **Cloud Run**, **Artifact Registry**, and **Workload Identity Federation** enabled.
2. Separate **Artifact Registry** repositories for **prod** and **dev** containers (e.g., `cloud-run-source-deploy` and `cloud-run-source-deploy-dev`).
3. A **Google Cloud Service Account** with the required permissions for both Cloud Run and Artifact Registry.
4. Configured **GitHub Secrets** with your Google Cloud credentials.
5. Set up **Workload Identity Federation** following [this guide](https://cloud.google.com/blog/products/identity-security/enabling-keyless-authentication-from-github-actions).

## Getting Started

To get started with this repository, clone it and install dependencies:

```bash
git clone https://github.com/your-username/github-action-demo.git
cd github-action-demo
npm install
```

Then, modify the `GitHub Actions` workflow according to your project’s needs and push the changes to trigger the deployment.

---

Feel free to contribute or open an issue if you encounter any problems!
