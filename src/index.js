#!/usr/bin/env node
const { program } = require('commander');
const { prompt } = require('inquirer');
const fs = require('fs');
const path = require('path');

program
  .name('bootstrap')
  .description('CLI to bootstrap new projects')
  .version('0.1.0');

const PROJECT_TYPES = [
  'Next.js Web App',
  'CLI Tool',
  'React Native App',
  'Vercel Serverless',
  'Node.js Backend'
];

program
  .command('new')
  .description('Create a new project')
  .action(async () => {
    const { projectType } = await prompt([
      {
        type: 'list',
        name: 'projectType',
        message: 'Select project type:',
        choices: PROJECT_TYPES
      }
    ]);

    const { projectName } = await prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Enter project name:',
        validate: input => input.length > 0 ? true : 'Project name cannot be empty'
      }
    ]);

    const projectPath = path.join(process.cwd(), projectName);
    
    // Basic project structure and README
    fs.mkdirSync(projectPath, { recursive: true });
    fs.writeFileSync(
      path.join(projectPath, 'README.md'), 
      `# ${projectName}\n\n## About\n\n## Setup\n\n## Usage\n`
    );

    // Type-specific setup
    switch (projectType) {
      case 'Next.js Web App':
        // Create basic Next.js structure
        fs.mkdirSync(path.join(projectPath, 'pages'), { recursive: true });
        fs.mkdirSync(path.join(projectPath, 'components'), { recursive: true });
        break;
      case 'CLI Tool':
        fs.writeFileSync(
          path.join(projectPath, 'index.js'),
          `#!/usr/bin/env node\nconsole.log('Hello from ${projectName}!');\n`
        );
        break;
      // Add more project type scaffolding as needed
    }

    console.log(`✨ Project ${projectName} created successfully!`);
  });

program.parse(process.argv);