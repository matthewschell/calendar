const fs = require('fs');
const path = require('path');

// Configuration: Folders and files to completely ignore
const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'public', '.firebase'];
const IGNORE_FILES = ['package-lock.json', '.DS_Store', 'repo_snapshot.md'];

// Configuration: Only include files with these extensions to avoid binaries/images
const ALLOWED_EXTENSIONS = ['.js', '.jsx', '.cjs', '.mjs', '.html', '.css', '.md', '.json'];

const OUTPUT_FILE = 'repo_snapshot.md';

/**
 * Checks if a file is an allowed text/code file based on its extension.
 */
function isAllowedFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  // Also explicitly allow dotfiles like .gitignore or .eslintrc if needed
  if (filename === '.gitignore' || filename.startsWith('.eslintrc')) return true;
  return ALLOWED_EXTENSIONS.includes(ext);
}

/**
 * Recursively walks the directory and returns an array of valid file paths.
 */
function readDirectory(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        readDirectory(filePath, fileList);
      }
    } else {
      if (!IGNORE_FILES.includes(file) && isAllowedFile(file)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Generates the Markdown file.
 */
function generateMarkdown() {
  const rootDir = process.cwd();
  
  console.log('Crawling repository...');
  const files = readDirectory(rootDir);
  
  let markdownContent = '# Schell Family Calendar - Codebase Snapshot\n\n';
  markdownContent += `*Generated on: ${new Date().toLocaleString()}*\n\n`;

  files.forEach((filePath) => {
    const relativePath = path.relative(rootDir, filePath);
    
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      let ext = path.extname(filePath).replace('.', '');
      
      // Map extensions for better markdown highlighting
      if (ext === 'jsx' || ext === 'cjs') ext = 'javascript';
      
      markdownContent += `### \`// ${relativePath}\`\n\n`;
      markdownContent += `\`\`\`${ext}\n`;
      markdownContent += content;
      markdownContent += `\n\`\`\`\n\n`;
    } catch (err) {
      console.warn(`⚠️ Could not read file: ${relativePath}`, err.message);
    }
  });

  fs.writeFileSync(OUTPUT_FILE, markdownContent);
  console.log(`✅ Successfully flattened ${files.length} files into ${OUTPUT_FILE}`);
}

generateMarkdown();