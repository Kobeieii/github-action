# GitHub Actions + Cloud Run Demo

This repository demonstrates how to automate deployments using **GitHub Actions** and **Google Cloud Run** for a web application built with **Vite**, **Vue 3**, and **TypeScript**.

## Table of Contents

- [Introduction](#introduction)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [GitHub Actions Configuration](#github-actions-configuration)
- [Cloud Run Deployment](#cloud-run-deployment)
- [Local Development](#local-development)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project automates the deployment process for a Vue 3 web application using GitHub Actions and Cloud Run. The application is built using **Vite** for fast development and bundling, and **TypeScript** for strong typing.

## Technologies Used

- **Vue 3**: Front-end framework for building user interfaces.
- **Vite**: Fast development server and bundler.
- **TypeScript**: For type safety in JavaScript.
- **GitHub Actions**: CI/CD pipeline for automating build and deployment.
- **Google Cloud Run**: A fully managed platform for running containerized applications.

## Prerequisites

Before you start, ensure you have the following:

- [Node.js](https://nodejs.org/) installed
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and authenticated
- A Google Cloud project with **Cloud Run** and **Artifact Registry** enabled
- Two environments for **Cloud Run** and **Artifact Registry**:
  - **Development (Dev)** environment (e.g., `my-app-dev`, `cloud-run-source-dev`)
  - **Production (Prod)** environment (e.g., `my-app`, `cloud-run-source`)
- A [GitHub repository](https://github.com/) for the project
- Enabled **Workload Identity Federation** between GitHub Actions and Google Cloud, you will need to grant an IAM principal permissions on Google Cloud

## Setup and Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Kobeieii/github-action-demo.git
   cd github-action-demo
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Google Cloud Setup**:

   - Create a Google Cloud project.
   - Enable **Cloud Run** and **Artifact Registry**.
   - Set up a **Workload Identity Federation** pool to allow GitHub Actions to authenticate with Google Cloud.

4. **Change the values in the "env" block in `.github/workflows/build-and-deploy.yml` to match your values**

## GitHub Actions Configuration

This repository uses GitHub Actions to automatically:

1. Build the Vite + Vue 3 application.
2. Push the Docker image to Google Artifact Registry.
3. Deploy the application to Google Cloud Run.

## Cloud Run Deployment

The deployment process is automated via GitHub Actions. When a commit is pushed to `main` or `develop`, the following occurs:

1. The application is built into a Docker container.
2. The container is pushed to Google Cloud Artifact Registry.
3. The container is deployed to Cloud Run.

## Local Development

To run the project locally:

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. The app will be available at `http://localhost:3000`.

## Contributing

Contributions are welcome! Please fork the repository, create a feature branch, commit your changes, and open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
