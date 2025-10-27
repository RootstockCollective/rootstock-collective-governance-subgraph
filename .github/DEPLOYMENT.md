# GitHub Actions Deployment Guide

## Overview

This repository includes GitHub Actions workflows for automated deployment of the Rootstock Collective Governance Subgraph to different environments.

## Required Secrets

To enable automated deployment, you need to configure the following secrets in your GitHub repository:

### 1. GRAPH_STUDIO_ACCESS_TOKEN

This token is required for deploying to The Graph Studio.

**How to obtain:**
1. Go to [The Graph Studio](https://thegraph.com/studio/)
2. Sign in with your GitHub account
3. Navigate to your profile settings
4. Generate a new access token
5. Copy the token value

**How to configure in GitHub:**
1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `GRAPH_STUDIO_ACCESS_TOKEN`
5. Value: Paste your access token

## Workflows

### Deploy Dev Environment (`deploy-dev.yml`)

**Triggers:**
- Push to `main`, `develop`, or branches starting with `DAO-`
- Pull requests to `main` or `develop`
- Manual trigger via workflow_dispatch

**What it does:**
1. Checks out the code
2. Sets up Node.js 22
3. Installs dependencies
4. Generates TypeScript types from GraphQL schema
5. Builds the subgraph
6. Runs tests (optional, won't fail deployment)
7. Prepares the dev environment configuration
8. Deploys to The Graph Studio dev environment

**Deployment Details:**
- **Environment:** Dev
- **Network:** rootstock-testnet
- **Subgraph ID:** `rootstockcollective-governance-dev`
- **Deploy URL:** https://api.studio.thegraph.com/deploy/

## Environment Configuration

The deployment uses the following configuration files:
- `config/dev.json` - Dev environment settings
- `subgraph.template.yaml` - Template for subgraph configuration

The workflow automatically prepares the environment using:
```bash
npm run prepare:dev
```

This command uses mustache templating to generate the final `subgraph.yaml` from the template and dev configuration.

## Manual Deployment

You can also trigger deployments manually:

1. Go to the Actions tab in your GitHub repository
2. Select "Deploy Subgraph to Dev Environment"
3. Click "Run workflow"
4. Optionally check "Force deployment" to deploy even if no changes are detected

## Troubleshooting

### Common Issues

1. **Authentication Error**
   - Ensure `GRAPH_STUDIO_ACCESS_TOKEN` is correctly set
   - Verify the token has the necessary permissions

2. **Build Failures**
   - Check that all dependencies are properly installed
   - Verify the GraphQL schema is valid
   - Ensure all required files are present

3. **Deployment Failures**
   - Verify the subgraph configuration is correct
   - Check that the target network is accessible
   - Ensure the subgraph name is unique

### Logs and Debugging

- Check the Actions tab in GitHub for detailed logs
- Each step in the workflow provides detailed output
- Failed deployments will show specific error messages

## Security Notes

- Never commit access tokens or sensitive configuration to the repository
- Use GitHub Secrets for all sensitive data
- Regularly rotate access tokens
- Monitor deployment logs for any suspicious activity


