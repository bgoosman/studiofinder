# GitHub Actions Workflows

## Update Universe Data Workflow

The `update-universe.yml` workflow automatically generates the latest `universe.json` file and commits it to the repository.

### Features

- **Scheduled runs**: Executes every 6 hours automatically
- **Manual triggering**: Can be run manually via the GitHub Actions tab
- **Timezone handling**: Sets timezone to New York for consistent timestamps
- **Smart commits**: Only commits when there are actual changes

### Setup Requirements

1. **Google API Key**: You need to add your Google API key as a repository secret:

   - Go to your repository Settings → Secrets and variables → Actions
   - Add a new secret named `GOOGLE_KEY`
   - Set the value to your Google API key

2. **Repository Permissions**: The workflow needs write permissions to commit changes:
   - Go to your repository Settings → Actions → General
   - Under "Workflow permissions", select "Read and write permissions"
   - Check "Allow GitHub Actions to create and approve pull requests"

### How it Works

1. **Checkout**: Clones the repository with full history
2. **Environment Setup**: Installs Node.js 18 and Yarn with caching
3. **Dependencies**: Installs project dependencies in the `packages/finder` directory
4. **Timezone**: Sets the system timezone to New York
5. **Generation**: Runs `yarn resolve` to generate `universe.json`
6. **Processing**: Removes the first line from the generated file (as per original script)
7. **Commit**: Commits and pushes changes if any modifications are detected

### Manual Execution

To run the workflow manually:

1. Go to the Actions tab in your repository
2. Select "Update Universe Data" workflow
3. Click "Run workflow" button
4. Select the branch (usually `main`) and click "Run workflow"

### Troubleshooting

- **Permission errors**: Ensure the workflow has write permissions to the repository
- **API key issues**: Verify the `GOOGLE_KEY` secret is correctly set
- **Build failures**: Check the Actions logs for specific error messages
- **No commits**: The workflow only commits when there are actual changes to the data
