#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const PROJECT_TYPES = [
  'Next.js',
  'CLI Tool', 
  'React Native', 
  'Vercel Serverless', 
  'Node.js Backend'
];

const TEMPLATES_DIR = path.join(__dirname, 'templates');

program
  .name('bootstrap')
  .description('Quick project scaffolding CLI')
  .version('0.1.0');

program
  .command('new')
  .description('Create a new project')
  .action(async () => {
    try {
      const { projectType } = await inquirer.prompt([
        {
          type: 'list',
          name: 'projectType',
          message: 'Select project type:',
          choices: PROJECT_TYPES
        }
      ]);

      const { projectName } = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'Enter project name:',
          validate: input => input.length > 0 ? true : 'Project name cannot be empty'
        }
      ]);

      const projectPath = path.join(process.cwd(), projectName);
      
      // Create project directory
      await fs.ensureDir(projectPath);

      // Copy template files
      const templatePath = path.join(TEMPLATES_DIR, projectType.toLowerCase().replace(/\s+/g, '-'));
      await fs.copy(templatePath, projectPath);

      // Update package.json with project name
      const packageJsonPath = path.join(projectPath, 'package.json');
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = projectName;
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

      console.log(chalk.green(`✅ Project ${projectName} created successfully!`));
      console.log(chalk.blue(`cd ${projectName} && npm install`));
    } catch (error) {
      console.error(chalk.red('Failed to create project:'), error);
    }
  });

program.parse(process.argv);