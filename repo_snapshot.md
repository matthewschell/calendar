# Schell Family Calendar - Codebase Snapshot

*Generated on: 9/9/2026, 11:43:41 PM*

### `// .gitignore`

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

### `// .vscode/launch.json`

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Launch Chrome against localhost",
            "url": "http://localhost:8080",
            "webRoot": "${workspaceFolder}"
        }
    ]
}
```

### `// README.md`

```md
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

```

### `// eslint.config.js`

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])

```

### `// firebase.json`

```json
{
  "functions": [
    {
      "source": "functions",
      "codebase": "default",
      "disallowLegacyRuntimeConfig": true,
      "ignore": [
        "node_modules",
        ".git",
        "firebase-debug.log",
        "firebase-debug.*.log",
        "*.local"
      ]

    }
  ]
}

```

### `// functions/.eslintrc.js`

```js
module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 2018,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", {"allowTemplateLiterals": true}],
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};

```

### `// functions/.gitignore`

```
node_modules/
*.local
```

### `// functions/index.js`

```js
// functions/index.js
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.midnightRolloverEngine = onSchedule({
    schedule: "1 0 * * *", // 12:01 AM every day
    timeZone: "America/Toronto", // Ensures accurate midnight for Ontario
    timeoutSeconds: 60,
    memory: "256MiB"
}, async (event) => {
    logger.info("Starting Schell Family Calendar midnight rollover...");
    
    const batch = db.batch();
    const today = new Date();
    const isSaturday = today.getDay() === 6; // 0 is Sunday, 6 is Saturday
    
    try {
        // --- 1. ARCHIVE DAILY COMPLETIONS ---
        const completionsRef = db.collection('completions');
        const completionsSnap = await completionsRef.get();
        
        completionsSnap.forEach((docSnap) => {
            const data = docSnap.data();
            
            const historyRef = db.collection('history').doc(docSnap.id);
            batch.set(historyRef, {
                ...data,
                archivedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            
            batch.delete(docSnap.ref);
        });

        // --- 2. SATURDAY ALLOWANCE PAYOUT & WEEKLY RESET ---
        if (isSaturday) {
             logger.info("Saturday detected: Calculating weekly payouts...");
             
             // REFACTORED: Query anyone who has chore tracking enabled
             const membersRef = db.collection('familyMembers');
             const participantsQuery = await membersRef.where('participatesInChores', '==', true).get();
             
             participantsQuery.forEach((memberDoc) => {
                 const memberData = memberDoc.data();
                 const currentPoints = memberData.points || 0;
                 const payRate = memberData.payRate || 0.01;
                 
                 const payoutAmount = currentPoints * payRate; 
                 
                 if (currentPoints > 0) {
                     const payoutRef = db.collection('payouts').doc();
                     batch.set(payoutRef, {
                         memberId: memberDoc.id,
                         memberName: memberData.name,
                         amount: payoutAmount,
                         date: admin.firestore.FieldValue.serverTimestamp(),
                         pointsConverted: currentPoints,
                         status: 'unpaid' 
                     });

                     // Reset the member's points to 0
                     batch.update(memberDoc.ref, { points: 0 });
                 }
             });
        }
        
        // --- 3. COMMIT THE ATOMIC BATCH ---
        await batch.commit();
        logger.info(`Rollover complete! Archived ${completionsSnap.size} chores.`);
        
    } catch (error) {
        logger.error("CRITICAL: Rollover Engine Failed!", error);
    }
});
```

### `// functions/package.json`

```json
{
  "name": "functions",
  "description": "Cloud Functions for Firebase",
  "scripts": {
    "lint": "eslint .",
    "serve": "firebase emulators:start --only functions",
    "shell": "firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "24"
  },
  "main": "index.js",
  "dependencies": {
    "firebase-admin": "^13.6.0",
    "firebase-functions": "^7.0.0"
  },
  "devDependencies": {
    "eslint": "^8.15.0",
    "eslint-config-google": "^0.14.0",
    "firebase-functions-test": "^3.4.1"
  },
  "private": true
}

```

### `// index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>calendar</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

### `// package.json`

```json
{
  "name": "calendar",
  "private": true,
  "version": "patch",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "canvas-confetti": "^1.9.4",
    "firebase": "^12.12.1",
    "lucide-react": "^1.11.0",
    "react": "^19.2.5",
    "react-dom": "^19.2.5",
    "react-quill-new": "^3.8.3",
    "react-router-dom": "^7.14.2"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@tailwindcss/vite": "^4.2.4",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.5.0",
    "eslint": "^10.2.1",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.5.0",
    "postcss": "^8.5.10",
    "tailwindcss": "^4.2.4",
    "vite": "^8.0.10",
    "vite-plugin-pwa": "^1.3.0"
  }
}

```

### `// scripts/flattenRepo.cjs`

```javascript
const fs = require('fs');
const path = require('path');

// Configuration: Folders and files to completely ignore
// Added '.agents' to prevent capturing AI agent skill definitions
const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'public', '.firebase', '.agents', 'legacy_code', 'dev-dist'];
const IGNORE_FILES = ['package-lock.json', '.DS_Store', 'repo_snapshot.md'];

// Configuration: Only include files with these extensions to avoid binaries/images
// Added .ts and .tsx to support modern React components
const ALLOWED_EXTENSIONS = ['.js', '.jsx', '.cjs', '.mjs', '.html', '.css', '.md', '.json', '.ts', '.tsx'];

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
      if (ext === 'tsx') ext = 'typescript';
      
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
```

### `// scripts/setVersion.cjs`

```javascript
const fs = require('fs');
const path = require('path');

const newVersion = process.argv[2];
if (!newVersion) {
  console.error('❌ Please provide a version number. Usage: node setVersion.cjs <version>');
  process.exit(1);
}

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = require(packageJsonPath);

packageJson.version = newVersion;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
console.log(`✅ Version updated to ${newVersion} in package.json`);
```

### `// skills-lock.json`

```json
{
  "version": 1,
  "skills": {
    "developing-genkit-dart": {
      "source": "firebase/agent-skills",
      "sourceType": "github",
      "skillPath": "skills/developing-genkit-dart/SKILL.md",
      "computedHash": "aa92490e4db5038730c629477ad968796f329040433625cf9b7bb13e26a859e3"
    },
    "developing-genkit-go": {
      "source": "firebase/agent-skills",
      "sourceType": "github",
      "skillPath": "skills/developing-genkit-go/SKILL.md",
      "computedHash": "163d0bbfcb2a067d4cd56d6c27725c23cd628084df94409b31c803e1d24dc3b6"
    },
    "developing-genkit-js": {
      "source": "firebase/agent-skills",
      "sourceType": "github",
      "skillPath": "skills/developing-genkit-js/SKILL.md",
      "computedHash": "2fa9adb27f7cfc4635decebea65222cd56e36b5de34781f7862be888504c04f4"
    },
    "developing-genkit-python": {
      "source": "firebase/agent-skills",
      "sourceType": "github",
      "skillPath": "skills/developing-genkit-python/SKILL.md",
      "computedHash": "24576698f88f6b78bbbd9d3b455feab486637685432282cdb52a41ee1bc45dc1"
    },
    "firebase-ai-logic-basics": {
      "source": "firebase/agent-skills",
      "sourceType": "github",
      "skillPath": "skills/firebase-ai-logic-basics/SKILL.md",
      "computedHash": "fd86e139513b9460b38ccf34b1dae8efb3a45d9ac0681b8050b1f80eee9369b1"
    },
    "firebase-app-hosting-basics": {
      "source": "firebase/agent-skills",
      "sourceType": "github",
      "skillPath": "skills/firebase-app-hosting-basics/SKILL.md",
      "computedHash": "7f0e0330510b4e6b06bcede472cebb183a491b8a0098f92d7563454c40d78050"
    },
    "firebase-auth-basics": {
      "source": "firebase/agent-skills",
      "sourceType": "github",
      "skillPath": "skills/firebase-auth-basics/SKILL.md",
      "computedHash": "a68238619839f44f3b4c7d02d0c96bc05df2b018edd62dd299c964ce871d80a3"
    },
    "firebase-basics": {
      "source": "firebase/agent-skills",
      "sourceType": "github",
      "skillPath": "skills/firebase-basics/SKILL.md",
      "computedHash": "d26debb78b35f73eb03b7ba6bc57cb670484de3ddcc66d95889cb5f9d0c54f7c"
    },
    "firebase-crashlytics": {
      "source": "firebase/agent-skills",
      "sourceType": "github",
      "skillPath": "skills/firebase-crashlytics/SKILL.md",
      "computedHash": "2c2b5ad36eeea0910b2e335e84d678c6af75dad3ccf73033fcb7e5a8768cabbc"
    },
    "firebase-data-connect": {
      "source": "firebase/agent-skills",
      "sourceType": "github",
      "skillPath": "skills/firebase-data-connect-basics/SKILL.md",
      "computedHash": "a16755e052750ac7ab6a0aecc590ff44ce1829c83fd7251079bf911a5bee8c49"
    },
    "firebase-firestore": {
      "source": "firebase/agent-skills",
      "sourceType": "github",
      "skillPath": "skills/firebase-firestore/SKILL.md",
      "computedHash": "659c60ba81cb70c41a5d6b4ca33312a8e0461468510b2214fd185af9ac925174"
    },
    "firebase-hosting-basics": {
      "source": "firebase/agent-skills",
      "sourceType": "github",
      "skillPath": "skills/firebase-hosting-basics/SKILL.md",
      "computedHash": "fb86fd4035e8e6379931faeb443557ac6f2e43fde04b397433f287e69b6532a9"
    },
    "firebase-remote-config-basics": {
      "source": "firebase/agent-skills",
      "sourceType": "github",
      "skillPath": "skills/firebase-remote-config-basics/SKILL.md",
      "computedHash": "855963d0c979692811c8b0ea112aba94894ca4f538934268d33e7e4665e7412b"
    },
    "firebase-security-rules-auditor": {
      "source": "firebase/agent-skills",
      "sourceType": "github",
      "skillPath": "skills/firebase-security-rules-auditor/SKILL.md",
      "computedHash": "5a90e991bb9acfd3e43bfb570498dee60b9cef94cbb80cfb99257c7e4f61c1a0"
    },
    "xcode-project-setup": {
      "source": "firebase/agent-skills",
      "sourceType": "github",
      "skillPath": "skills/xcode-project-setup/SKILL.md",
      "computedHash": "65fc8ef640574e34cd315cef3a2e8ea6eb2d3b29d38eba18e1e749d812215161"
    }
  }
}

```

### `// src/App.jsx`

```javascript
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import Home from './pages/Home';
import KioskOverlay from './components/KioskOverlay';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Check if the device is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // We hardcode the email so the family only has to type the password
      await signInWithEmailAndPassword(auth, 'family@schell.ca', password);
    } catch (err) {
      console.error(err);
      setError('Incorrect password. Please try again.');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
  }

  // If not logged in, show the security lock screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            🔒
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Schell Family</h2>
          <p className="text-slate-500 mb-6 text-sm">Please enter the family password to access the calendar.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border-2 border-slate-200 rounded-xl text-center text-lg font-bold tracking-widest focus:border-indigo-500 focus:outline-none"
              placeholder="Password"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
            <button 
              type="submit" 
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-md cursor-pointer"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  // If logged in, show the actual app
  return (
    <BrowserRouter>
      <KioskOverlay />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### `// src/components/KioskOverlay.jsx`

```javascript
import { useKiosk } from '../hooks/useKiosk';

export default function KioskOverlay() {
  const { isDimmed, dimIntensity } = useKiosk();

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black transition-opacity duration-1000 ease-in-out ${
        isDimmed ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{ opacity: isDimmed ? dimIntensity : 0 }}
    />
  );
}
```

### `// src/components/admin/AdminModal.jsx`

```javascript
import { useState, useEffect } from 'react';
import { X, Settings, Users, ClipboardList, Palette, Database, LayoutGrid, CalendarDays, Monitor } from 'lucide-react';
import ThemeTab from './ThemeTab';
import FamilyMembersTab from './FamilyMembersTab';
import ChoresTab from './ChoresTab';
import WidgetsTab from './WidgetsTab';
import SystemToolsTab from './SystemToolsTab';
import ScheduleManager from './ScheduleManager';
import DeviceManagerTab from './DeviceManagerTab';
import { useAdminPin } from '../../hooks/useAdminPin';

export default function AdminModal({ isOpen, onClose }) {
  const adminPin = useAdminPin();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState('members');

  useEffect(() => {
    if (isOpen && sessionStorage.getItem('adminBypass') === 'true') {
      setIsAuthenticated(true);
      setActiveTab('chores'); 
    }
  }, [isOpen]);

  const handleClose = () => {
    sessionStorage.removeItem('adminBypass');
    sessionStorage.removeItem('draftChore');
    setIsAuthenticated(false); 
    onClose();
  };

  if (!isOpen) return null;

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === adminPin) {
      setIsAuthenticated(true);
      setPin('');
    } else {
      alert('Incorrect PIN');
      setPin('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center animate-in zoom-in-95 duration-200">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">🔒 Admin Access</h3>
          <p className="text-slate-500 mb-6 text-sm">Enter PIN to access settings</p>
          <form onSubmit={handlePinSubmit}>
            <input 
              type="password" 
              value={pin} 
              onChange={(e) => setPin(e.target.value)} 
              maxLength={8} 
              autoFocus 
              className="w-full text-center text-3xl tracking-[1em] font-bold p-4 border-2 border-slate-200 rounded-xl mb-4 focus:border-indigo-500 focus:outline-none transition-colors" 
              placeholder="••••" 
            />
            <div className="flex gap-3">
              <button type="button" onClick={handleClose} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors cursor-pointer">Cancel</button>
              <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md cursor-pointer">Unlock</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-modal-container" className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white shrink-0">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="text-indigo-600" /> Admin Panel
          </h2>
          <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 bg-slate-50 border-r border-slate-100 p-4 flex flex-col gap-2 shrink-0">
            <TabButton active={activeTab === 'members'} onClick={() => setActiveTab('members')} icon={<Users className="w-5 h-5" />} label="Family Members" />
            <TabButton active={activeTab === 'custody'} onClick={() => setActiveTab('custody')} icon={<CalendarDays className="w-5 h-5" />} label="Custody & Schedule" />
            <TabButton active={activeTab === 'chores'} onClick={() => setActiveTab('chores')} icon={<ClipboardList className="w-5 h-5" />} label="Chores & Points" />
            <TabButton active={activeTab === 'widgets'} onClick={() => setActiveTab('widgets')} icon={<LayoutGrid className="w-5 h-5" />} label="Dashboard Widgets" />
            <TabButton active={activeTab === 'theme'} onClick={() => setActiveTab('theme')} icon={<Palette className="w-5 h-5" />} label="Theme & Display" />
            <TabButton active={activeTab === 'devices'} onClick={() => setActiveTab('devices')} icon={<Monitor className="w-5 h-5" />} label="Display & Devices" />
            <TabButton active={activeTab === 'system'} onClick={() => setActiveTab('system')} icon={<Database className="w-5 h-5" />} label="System Tools" />
          </div>
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            {activeTab === 'members' && <FamilyMembersTab />}
            {activeTab === 'custody' && <ScheduleManager />}
            {activeTab === 'chores' && <ChoresTab />}
            {activeTab === 'widgets' && <WidgetsTab />}
            {activeTab === 'theme' && <ThemeTab />}
            {activeTab === 'devices' && <DeviceManagerTab />}
            {activeTab === 'system' && <SystemToolsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 p-3 rounded-xl font-semibold transition-all w-full text-left cursor-pointer ${active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50'}`}>
      {icon}{label}
    </button>
  );
}
```

### `// src/components/admin/ChoreForecaster.jsx`

```javascript
// src/components/admin/ChoreForecaster.jsx
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Calculator, AlertTriangle, CheckCircle2, CalendarDays } from 'lucide-react';

export default function ChoreForecaster() {
  const [kids, setKids] = useState([]);
  const [chores, setChores] = useState([]);
  const [overrides, setOverrides] = useState({});
  const [loading, setLoading] = useState(true);

  // 1. Fetch Kids, Chores, and Future Custody Overrides
  useEffect(() => {
    const kidsQuery = query(collection(db, 'familyMembers'), where('participatesInChores', '==', true));
    const unsubKids = onSnapshot(kidsQuery, (snap) => {
      setKids(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.name.localeCompare(b.name)));
    });

    const unsubChores = onSnapshot(collection(db, 'chores'), (snap) => {
      setChores(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listen to all overrides so we can see future manual adjustments
    const unsubOverrides = onSnapshot(collection(db, 'dailyOverrides'), (snap) => {
      const ov = {};
      snap.docs.forEach(doc => {
        ov[doc.id] = doc.data(); // doc.id is formatted "YYYY-MM-DD"
      });
      setOverrides(ov);
      setLoading(false);
    });

    return () => {
      unsubKids();
      unsubChores();
      unsubOverrides();
    };
  }, []);

  const getLocalIsoDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 2. Exact replication of your useCustody math
  const participatesInChoresHereOnDate = (kid, dateObj) => {
    const isoDate = getLocalIsoDate(dateObj);
    
    // Check manual override first
    if (overrides[isoDate] && overrides[isoDate][kid.id] !== undefined) {
      return overrides[isoDate][kid.id];
    }

    // Check base schedule pattern array
    if (!kid || !kid.schedule || !kid.schedule.pattern || kid.schedule.pattern.length === 0) return true;
    if (!kid.schedule.referenceDate) return true;

    const pattern = kid.schedule.pattern;
    const cycleLength = pattern.length;
    
    const target = new Date(dateObj);
    target.setHours(0, 0, 0, 0);
    
    const [refY, refM, refD] = kid.schedule.referenceDate.split('-');
    const refDate = new Date(refY, refM - 1, refD);
    refDate.setHours(0, 0, 0, 0);
    
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysDiff = Math.round((target - refDate) / msPerDay);
    const cycleDay = ((daysDiff % cycleLength) + cycleLength) % cycleLength;
    
    return pattern[cycleDay];
  };

  // 3. Generate the next 14 days
  const getNext14Days = () => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push({
        dateObj: d,
        dayName: dayNames[d.getDay()],
        dayString: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    return days;
  };

  const forecastDays = getNext14Days();

  // 4. Mathematical Engine: Matches your chore frequency schemas
  const calculateDailyPoints = (kid, day) => {
    let totalPoints = 0;
    
    // If the kid is away, they are assigned 0 chores/points that day
    if (!participatesInChoresHereOnDate(kid, day.dateObj)) {
      return 0;
    }

    chores.forEach(chore => {
      if (chore.isArchived) return;
      if (chore.assignedTo !== kid.id) return;

      const targetDay = day.dateObj.getDay();

      if (chore.frequency === 'today-only') {
        if (chore.createdDate === day.dateObj.toDateString()) {
          totalPoints += Number(chore.points || 0);
        }
      } else if (chore.frequency === 'daily' || !chore.frequency) {
        totalPoints += Number(chore.points || 0);
      } else if (chore.frequency === 'weekly') {
        if (chore.days && chore.days.includes(targetDay)) {
          totalPoints += Number(chore.points || 0);
        } else if (chore.weekDay !== null && chore.weekDay !== undefined && !chore.days && chore.weekDay === targetDay) {
          totalPoints += Number(chore.points || 0); // Legacy fallback
        }
      } else if (chore.frequency === 'bi-weekly' && chore.days && chore.days.includes(targetDay) && chore.startDate) {
        const start = new Date(chore.startDate + 'T00:00:00');
        start.setHours(0, 0, 0, 0);
        const startSun = new Date(start); 
        startSun.setDate(startSun.getDate() - startSun.getDay());
        
        const targetSun = new Date(day.dateObj); 
        targetSun.setDate(targetSun.getDate() - targetSun.getDay());
        
        const daysDiff = Math.round((targetSun - startSun) / (24 * 60 * 60 * 1000));
        const weeksDiff = Math.floor(daysDiff / 7);
        if (weeksDiff % 2 === 0) {
          totalPoints += Number(chore.points || 0);
        }
      }
    });

    return totalPoints;
  };

  if (loading) return <div className="p-8 text-center text-slate-400 animate-pulse font-medium">Booting mathematical forecaster...</div>;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      
      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">14-Day Forecaster Matrix</h3>
            <p className="text-xs text-slate-500">Cross-referencing custody schedules to ensure 100pt/day targets.</p>
          </div>
        </div>
        <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 className="w-4 h-4"/> Target (100)</span>
          <span className="flex items-center gap-1 text-amber-500"><AlertTriangle className="w-4 h-4"/> Under (&lt;100)</span>
          <span className="flex items-center gap-1 text-rose-500"><AlertTriangle className="w-4 h-4"/> Over (&gt;100)</span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-bold sticky left-0 bg-slate-50 z-10 shadow-[1px_0_0_0_#e2e8f0]">Family Member</th>
              {forecastDays.map((day, idx) => (
                <th key={idx} className={`px-2 py-3 text-center min-w-[70px] ${idx === 0 ? 'bg-indigo-50 text-indigo-700' : ''}`}>
                  <div className="font-bold">{day.dayName}</div>
                  <div className="text-[10px] font-medium opacity-70">{day.dayString}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {kids.map(kid => (
              <tr key={kid.id} className="hover:bg-slate-50 transition-colors">
                
                {/* Kid Name Column (Sticky) */}
                <td className="px-4 py-3 font-bold text-slate-800 sticky left-0 bg-white group-hover:bg-slate-50 transition-colors shadow-[1px_0_0_0_#e2e8f0] flex items-center gap-2 z-10">
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-white shadow-inner overflow-hidden shrink-0" style={{ backgroundColor: kid.color || '#6366f1' }}>
                     {kid.avatar ? <img src={kid.avatar} className="w-full h-full object-cover" alt={kid.name} /> : kid.name.charAt(0)}
                  </div>
                  <span className="truncate max-w-[100px]">{kid.name}</span>
                </td>

                {/* Day Columns */}
                {forecastDays.map((day, idx) => {
                  const isHere = participatesInChoresHereOnDate(kid, day.dateObj);
                  const pts = calculateDailyPoints(kid, day);
                  
                  // Color Logic
                  let cellBg = 'bg-slate-50';
                  let textColor = 'text-slate-400';
                  let fontWeight = 'font-medium';
                  let content = pts;
                  
                  if (!isHere) {
                    cellBg = 'bg-slate-100/50 border border-slate-200/50';
                    textColor = 'text-slate-400';
                    fontWeight = 'font-bold text-[9px] uppercase tracking-wider';
                    content = 'Away';
                  } else if (pts === 100) {
                    cellBg = 'bg-emerald-100 border border-emerald-200';
                    textColor = 'text-emerald-700';
                    fontWeight = 'font-black';
                  } else if (pts > 0 && pts < 100) {
                    cellBg = 'bg-amber-50 border border-amber-200';
                    textColor = 'text-amber-600';
                    fontWeight = 'font-bold';
                  } else if (pts > 100) {
                    cellBg = 'bg-rose-50 border border-rose-200';
                    textColor = 'text-rose-600';
                    fontWeight = 'font-black';
                  } else if (pts === 0) {
                    cellBg = 'bg-slate-50 border border-slate-200';
                    textColor = 'text-slate-400';
                    fontWeight = 'font-bold';
                  }

                  return (
                    <td key={idx} className="p-1.5 text-center">
                      <div 
                        className={`w-full h-full py-2 rounded-lg flex items-center justify-center transition-all ${cellBg} ${textColor} ${fontWeight}`}
                        title={!isHere ? `${kid.name} is scheduled to be away` : `${pts} points assigned`}
                      >
                        {content}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        
        {kids.length === 0 && (
          <div className="p-8 text-center text-slate-400 font-medium">
            No kids found in the roster. Add kids in the Family Members tab to view the forecast!
          </div>
        )}
      </div>
      
      <div className="bg-slate-50 p-3 text-[11px] text-slate-500 border-t border-slate-100 flex items-center gap-2">
         <CalendarDays className="w-4 h-4 shrink-0" />
         This matrix reads directly from your custody override schedule and automatically calculates points to ensure everyone hits exactly 100 points on the days they are home.
      </div>
    </div>
  );
}
```

### `// src/components/admin/ChoresTab.jsx`

```javascript
// src/components/admin/ChoresTab.jsx
import { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { Plus, Trash2, Edit2, Save, CalendarDays, CheckSquare, X, Calculator, Settings } from 'lucide-react';
import { db } from '../../config/firebase';
import { useChores } from '../../hooks/useChores';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';
import ChoreForecaster from './ChoreForecaster';

export default function ChoresTab() {
  const { chores, loading: choresLoading } = useChores();
  const { members, loading: membersLoading } = useFamilyMembers();
  
  const [activeTab, setActiveTab] = useState('manage'); // 'manage', 'forecast', 'settings'
  
  const [isAdding, setIsAdding] = useState(false);
  const [newChore, setNewChore] = useState({ name: '', points: 10, frequency: 'daily', assignedTo: 'unassigned', days: [], startDate: '' });
  const [editingChore, setEditingChore] = useState(null);

  // Allowance Settings State
  const [allowanceConfig, setAllowanceConfig] = useState({ payDay: 5 }); // Default to Friday
  const [saving, setSaving] = useState(false);

  // Fetch Allowance Config
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'allowance'), (docSnap) => {
      if (docSnap.exists()) setAllowanceConfig(docSnap.data());
    });
    return () => unsub();
  }, []);

  // Catch the baton pass from Quick Add
  useEffect(() => {
    const draft = sessionStorage.getItem('draftChore');
    if (draft) {
      const parsedDraft = JSON.parse(draft);
      setNewChore(parsedDraft);
      setIsAdding(true);
      setActiveTab('manage');
      sessionStorage.removeItem('draftChore'); // Delete it so it doesn't stay open forever
    }
  }, []);

  // Save Allowance Config
  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'allowance'), allowanceConfig);
    } catch (err) {
      console.error("Failed to save allowance config:", err);
    }
    setSaving(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newChore.name) return;
    
    try {
      const choreId = Date.now().toString();
      const choreData = {
        ...newChore,
        points: Number(newChore.points)
      };
      
      if (choreData.frequency === 'today-only') {
         choreData.createdDate = new Date().toDateString();
         choreData.todayOnly = true;
      }
      
      if (choreData.frequency !== 'weekly' && choreData.frequency !== 'bi-weekly') {
         choreData.days = null;
         choreData.startDate = null;
      }

      await setDoc(doc(db, 'chores', choreId), choreData);
      setIsAdding(false);
      setNewChore({ name: '', points: 10, frequency: 'daily', assignedTo: 'unassigned', days: [], startDate: '' });
    } catch (err) {
      console.error("Error adding chore:", err);
      alert("Failed to add chore");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingChore.name) return;
    
    try {
      const choreData = {
        ...editingChore,
        points: Number(editingChore.points)
      };

      if (choreData.frequency !== 'weekly' && choreData.frequency !== 'bi-weekly') {
         choreData.days = null;
         choreData.startDate = null;
      }

      await setDoc(doc(db, 'chores', editingChore.id), choreData, { merge: true });
      setEditingChore(null);
    } catch (err) {
      console.error("Error updating chore:", err);
      alert("Failed to update chore");
    }
  };

  const handleDelete = async (choreId) => {
    if (window.confirm("Archive this chore? It will be removed from daily lists but kept to protect past score history.")) {
      try {
        await setDoc(doc(db, 'chores', choreId), { 
          isArchived: true, 
          archivedDate: new Date().toISOString().slice(0, 10) 
        }, { merge: true });
      } catch (err) {
        console.error("Error archiving chore:", err);
        alert("Failed to archive chore.");
      }
    }
  };

  const toggleDay = (dayIndex, isEditing = false) => {
    if (isEditing) {
      const currentDays = editingChore.days || [];
      const newDays = currentDays.includes(dayIndex) 
        ? currentDays.filter(d => d !== dayIndex)
        : [...currentDays, dayIndex];
      setEditingChore({ ...editingChore, days: newDays });
    } else {
      const currentDays = newChore.days || [];
      const newDays = currentDays.includes(dayIndex) 
        ? currentDays.filter(d => d !== dayIndex)
        : [...currentDays, dayIndex];
      setNewChore({ ...newChore, days: newDays });
    }
  };

  if (choresLoading || membersLoading) return <div className="p-4 animate-pulse font-medium text-slate-500">Loading chores...</div>;

  const kids = members.filter(m => m.participatesInChores === true || String(m.participatesInChores).toLowerCase() === 'true');
  const activeChores = chores.filter(c => !c.isArchived);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      
      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit mb-6 border border-slate-200 shadow-inner overflow-x-auto">
        <button 
          onClick={() => setActiveTab('manage')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'manage' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
        >
          <CheckSquare className="w-4 h-4" /> Manage Chores
        </button>
        <button 
          onClick={() => setActiveTab('forecast')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'forecast' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
        >
          <Calculator className="w-4 h-4" /> Forecaster Matrix
        </button>
        <button 
          onClick={() => setActiveTab('settings')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'settings' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
        >
          <Settings className="w-4 h-4" /> Allowance Settings
        </button>
      </div>

      {/* Tab Content: Forecast */}
      {activeTab === 'forecast' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <ChoreForecaster />
        </div>
      )}

      {/* Tab Content: Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-800 text-lg">Weekly Allowance Target</h3>
          </div>
          <p className="text-sm text-slate-500 mb-6">Select the day of the week your family distributes allowance. This helps the kid dashboards highlight when pay day is arriving.</p>
          
          <div className="flex items-end gap-4 max-w-md">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Weekly Pay Day</label>
              <select 
                value={allowanceConfig.payDay} 
                onChange={(e) => setAllowanceConfig({ ...allowanceConfig, payDay: Number(e.target.value) })}
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
              >
                <option value={0}>Sunday</option>
                <option value={1}>Monday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
                <option value={6}>Saturday</option>
              </select>
            </div>
            <button 
              onClick={handleSaveConfig}
              disabled={saving}
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 h-[50px] shadow-sm"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Config'}
            </button>
          </div>
        </div>
      )}

      {/* Tab Content: Manage */}
      {activeTab === 'manage' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-xl flex items-center gap-2">
              Active Task List
            </h3>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1 text-sm font-bold text-white bg-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
            >
              {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Chore</>}
            </button>
          </div>

          {isAdding && (
            <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 shadow-sm mb-8 animate-in slide-in-from-top-4 duration-300">
              <h4 className="font-bold text-indigo-900 mb-4">Create New Chore</h4>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Chore Name</label>
                    <input required type="text" value={newChore.name} onChange={e => setNewChore({...newChore, name: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl bg-white font-semibold focus:outline-none focus:border-indigo-500" placeholder="e.g. Empty Dishwasher" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Points Value</label>
                    <input required type="number" min="0" value={newChore.points} onChange={e => setNewChore({...newChore, points: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl bg-white font-semibold focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assign To</label>
                    <select value={newChore.assignedTo} onChange={e => setNewChore({...newChore, assignedTo: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl bg-white font-semibold focus:outline-none focus:border-indigo-500">
                      <option value="unassigned">⭐ Bonus / Anyone</option>
                      {kids.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Frequency</label>
                    <select value={newChore.frequency} onChange={e => setNewChore({...newChore, frequency: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl bg-white font-semibold focus:outline-none focus:border-indigo-500">
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-Weekly</option>
                      <option value="today-only">📅 Today Only</option>
                    </select>
                  </div>
                </div>

                {(newChore.frequency === 'weekly' || newChore.frequency === 'bi-weekly') && (
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Select Days</label>
                    <div className="flex gap-2">
                      {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day, i) => (
                        <button type="button" key={i} onClick={() => toggleDay(i)} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors border ${newChore.days?.includes(i) ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}>
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {newChore.frequency === 'bi-weekly' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Starting Week Of (Anchor Date)</label>
                    <input type="date" required value={newChore.startDate} onChange={e => setNewChore({...newChore, startDate: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl bg-white font-semibold focus:outline-none focus:border-indigo-500" />
                  </div>
                )}

                <button type="submit" className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-sm">
                  Save New Chore
                </button>
              </form>
            </div>
          )}

          {/* Group Chores by Kid */}
          <div className="space-y-4">
            {[...kids, { id: 'unassigned', name: '⭐ Bonus Chores', color: '#f59e0b' }].map(assignee => {
              const assigneeChores = activeChores.filter(c => c.assignedTo === assignee.id || (!c.assignedTo && assignee.id === 'unassigned')).sort((a, b) => a.name.localeCompare(b.name));
              
              if (assigneeChores.length === 0) return null;

              return (
                <div key={assignee.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between" style={{ backgroundColor: `${assignee.color}15` }}>
                    <h4 className="font-bold text-lg" style={{ color: assignee.color }}>{assignee.name}</h4>
                    <span className="text-xs font-bold opacity-60" style={{ color: assignee.color }}>{assigneeChores.length} Assigned</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {assigneeChores.map(chore => (
                      <div key={chore.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div>
                          <div className="font-bold text-slate-800 flex items-center gap-2">
                            {chore.name}
                            {chore.frequency === 'today-only' && <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md uppercase tracking-wider">Today Only</span>}
                          </div>
                          <div className="text-xs text-slate-500 font-medium mt-1">
                            {chore.points} points • {chore.frequency.replace('-', ' ')}
                            {(chore.frequency === 'weekly' || chore.frequency === 'bi-weekly') && chore.days && ` (${chore.days.map(d => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]).join(', ')})`}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingChore(chore)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(chore.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Editing Modal */}
      {editingChore && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-[1100]" onClick={() => setEditingChore(null)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Edit Chore</h3>
              <button onClick={() => setEditingChore(null)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Chore Name</label>
                <input required type="text" value={editingChore.name} onChange={e => setEditingChore({...editingChore, name: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Points</label>
                  <input required type="number" min="0" value={editingChore.points} onChange={e => setEditingChore({...editingChore, points: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assign To</label>
                  <select value={editingChore.assignedTo} onChange={e => setEditingChore({...editingChore, assignedTo: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:border-indigo-500">
                    <option value="unassigned">⭐ Bonus / Anyone</option>
                    {kids.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Frequency</label>
                <select value={editingChore.frequency} onChange={e => setEditingChore({...editingChore, frequency: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:border-indigo-500">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-Weekly</option>
                </select>
              </div>

              {(editingChore.frequency === 'weekly' || editingChore.frequency === 'bi-weekly') && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Select Days</label>
                  <div className="flex gap-1.5">
                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day, i) => (
                      <button type="button" key={i} onClick={() => toggleDay(i, true)} className={`flex-1 py-2 rounded-lg font-bold text-[11px] uppercase transition-colors border ${editingChore.days?.includes(i) ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'}`}>
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {editingChore.frequency === 'bi-weekly' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Starting Week Of (Anchor Date)</label>
                  <input type="date" required value={editingChore.startDate || ''} onChange={e => setEditingChore({...editingChore, startDate: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:border-indigo-500" />
                </div>
              )}

              <div className="pt-4 border-t border-slate-100">
                <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
```

### `// src/components/admin/DeviceManagerTab.jsx`

```javascript
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Monitor, Moon, VolumeX, Save, Sun, TabletSmartphone, CheckCircle2 } from 'lucide-react';
import { useKiosk } from '../../hooks/useKiosk';

export default function DeviceManagerTab() {
  const { isKioskDevice, toggleKioskMode } = useKiosk();
  
  const [config, setConfig] = useState({
    manualDim: false,
    manualMute: false,
    dimIntensity: 0.85,
    quietTimeEnabled: false,
    quietTimeStart: '20:00',
    quietTimeEnd: '07:00'
  });
  
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState('idle'); // 'idle' | 'saving' | 'saved'

  useEffect(() => {
    const fetchSettings = async () => {
      const docSnap = await getDoc(doc(db, 'settings', 'kiosk'));
      if (docSnap.exists()) {
        setConfig(prev => ({ ...prev, ...docSnap.data() }));
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaveState('saving');
    try {
      await setDoc(doc(db, 'settings', 'kiosk'), config, { merge: true });
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (error) {
      console.error("Error saving kiosk config:", error);
      alert(`Failed to save settings: ${error.message}`);
      setSaveState('idle');
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse text-slate-500">Loading device settings...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <Monitor className="text-indigo-600 w-6 h-6" /> Display & Devices
      </h3>

      {/* LOCAL DEVICE CONFIGURATION */}
      <div className="bg-sky-50 border-2 border-sky-200 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-sm font-bold text-sky-900 flex items-center gap-2">
              <TabletSmartphone className="w-5 h-5" /> Local Device Role
            </h4>
            <p className="text-xs text-sky-700 mt-1 max-w-sm">
              Enable this only on the wall-mounted calendar. If enabled, this specific screen will obey the auto-dimming and muting commands below.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input 
              type="checkbox" 
              checked={isKioskDevice}
              onChange={(e) => toggleKioskMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-sky-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-sky-600"></div>
          </label>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Manual Overrides */}
        <div>
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Push to all Kiosks</h4>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setConfig({ ...config, manualDim: !config.manualDim })}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                config.manualDim ? 'bg-slate-800 border-slate-900 text-amber-300' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {config.manualDim ? <Moon className="w-8 h-8 mb-2" /> : <Sun className="w-8 h-8 mb-2" />}
              <span className="font-bold">{config.manualDim ? 'Force Dimmed' : 'Force Bright'}</span>
            </button>

            <button 
              onClick={() => setConfig({ ...config, manualMute: !config.manualMute })}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                config.manualMute ? 'bg-red-50 border-red-200 text-red-600' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <VolumeX className="w-8 h-8 mb-2" />
              <span className="font-bold">{config.manualMute ? 'System Muted' : 'System Audio On'}</span>
            </button>
          </div>
        </div>

        <div className="w-full h-px bg-slate-100"></div>

        {/* Quiet Time Scheduler */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Automated Quiet Time</h4>
              <p className="text-xs text-slate-500">Automatically dims Kiosk screens and mutes sounds during sleeping hours.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={config.quietTimeEnabled}
                onChange={(e) => setConfig({...config, quietTimeEnabled: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {config.quietTimeEnabled && (
            <div className="grid grid-cols-2 gap-4 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 animate-in fade-in zoom-in-95 duration-200">
              <div>
                <label className="block text-xs font-bold text-indigo-900 mb-1">Start Time (Dim)</label>
                <input 
                  type="time" 
                  value={config.quietTimeStart}
                  onChange={(e) => setConfig({...config, quietTimeStart: e.target.value})}
                  className="w-full p-2.5 border border-indigo-200 rounded-lg text-sm font-bold text-indigo-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-indigo-900 mb-1">End Time (Wake)</label>
                <input 
                  type="time" 
                  value={config.quietTimeEnd}
                  onChange={(e) => setConfig({...config, quietTimeEnd: e.target.value})}
                  className="w-full p-2.5 border border-indigo-200 rounded-lg text-sm font-bold text-indigo-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        <div className="w-full h-px bg-slate-100"></div>

        {/* Dim Intensity */}
        <div>
          <label className="flex items-center justify-between text-sm font-bold text-slate-700 mb-2">
            <span>Dimming Intensity</span>
            <span className="text-indigo-600">{Math.round(config.dimIntensity * 100)}% Blackout</span>
          </label>
          <input 
            type="range" 
            min="0.1" 
            max="0.95" 
            step="0.05"
            value={config.dimIntensity}
            onChange={(e) => setConfig({...config, dimIntensity: Number(e.target.value)})}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <p className="text-xs text-slate-400 mt-2">Adjust how dark Kiosk screens get when Dim Mode or Quiet Time is active.</p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saveState !== 'idle'}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${
              saveState === 'saved' ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            } disabled:opacity-80`}
          >
            {saveState === 'saving' && 'Saving...'}
            {saveState === 'saved' && <><CheckCircle2 className="w-5 h-5" /> Saved!</>}
            {saveState === 'idle' && <><Save className="w-5 h-5" /> Save Kiosk Settings</>}
          </button>
        </div>
      </div>
    </div>
  );
}
```

### `// src/components/admin/FactsTab.jsx`

```javascript
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Plus, Trash2, Star, Lightbulb, Edit2, X, Save } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { db } from '../../config/firebase';

export default function FactsTab() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ type: 'fact', text: '', date: '' });
  
  // State for the Edit Modal
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'dailyContent'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setContent(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    // Prevent saving empty quill strings
    if (!newItem.text || newItem.text === '<p><br></p>') return alert('Please enter some text.');

    try {
      if (newItem.type === 'override') {
        if (!newItem.date) return alert('Please enter a date for the special event.');
        // Parse "YYYY-MM-DD" from the date picker into "MM-DD"
        const [, month, day] = newItem.date.split('-');
        const dateId = `${month}-${day}`;
        
        await setDoc(doc(db, 'dailyContent', dateId), {
          type: 'override',
          text: newItem.text,
          date: dateId
        });
      } else {
        // Standard fact, auto-generate ID
        await setDoc(doc(collection(db, 'dailyContent')), {
          type: 'fact',
          text: newItem.text
        });
      }
      setNewItem({ type: 'fact', text: '', date: '' });
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to save. Are you offline?");
    }
  };

  const handleDelete = async (id, type) => {
    if (confirm(`Delete this ${type === 'override' ? 'special event' : 'fact'}?`)) {
      await deleteDoc(doc(db, 'dailyContent', id));
    }
  };

  const openEditModal = (item) => {
    setEditingItem({
      ...item,
      // Provide a dummy leap year (2024) so Feb 29th works flawlessly in the date picker!
      editDate: item.type === 'override' ? `2024-${item.date}` : ''
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem.text || editingItem.text === '<p><br></p>') return alert('Content cannot be empty.');

    try {
      if (editingItem.type === 'fact') {
        await updateDoc(doc(db, 'dailyContent', editingItem.id), {
          text: editingItem.text
        });
      } else {
        // Handle override changes (where the ID relies on the date)
        const [, month, day] = editingItem.editDate.split('-');
        const newDateId = `${month}-${day}`;
        
        if (newDateId !== editingItem.id) {
          // If the date changed, we must delete the old document and create a new one
          await deleteDoc(doc(db, 'dailyContent', editingItem.id));
          await setDoc(doc(db, 'dailyContent', newDateId), {
            type: 'override',
            text: editingItem.text,
            date: newDateId
          });
        } else {
          // If the date stayed the same, just update the text
          await updateDoc(doc(db, 'dailyContent', editingItem.id), {
            text: editingItem.text
          });
        }
      }
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update content.");
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium animate-pulse">Loading database...</div>;

  const overrides = content.filter(c => c.type === 'override').sort((a, b) => a.date.localeCompare(b.date));
  const facts = content.filter(c => c.type === 'fact');

  return (
    <div className="flex flex-col gap-6 relative">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">💡 Facts & Events Manager</h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-colors ${
            isAdding ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
          }`}
        >
          {isAdding ? 'Cancel' : <><Plus className="w-5 h-5" /> Add Content</>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-indigo-50 border-2 border-indigo-100 rounded-2xl p-5 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <h4 className="font-bold text-indigo-900">Add New Content</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Content Type</label>
              <select 
                value={newItem.type} 
                onChange={e => setNewItem({...newItem, type: e.target.value})} 
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value="fact">Random Daily Fact</option>
                <option value="override">⭐ Special Day / Birthday</option>
              </select>
            </div>

            {newItem.type === 'override' && (
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Date (Year is ignored)</label>
                <input 
                  type="date" 
                  value={newItem.date} 
                  onChange={e => setNewItem({...newItem, date: e.target.value})} 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white" 
                  required 
                />
              </div>
            )}
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-600 mb-1">Message / Fact Text</label>
              <div className="bg-white rounded-xl overflow-hidden border border-slate-200 focus-within:border-indigo-500 transition-colors">
                <ReactQuill 
                  theme="snow" 
                  value={newItem.text} 
                  onChange={(content) => setNewItem({...newItem, text: content})}
                  className="h-32 border-none [&_.ql-container]:border-none [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-100"
                  placeholder={newItem.type === 'override' ? "🎉 Happy Birthday! Did you know..." : "Honey never spoils!"}
                />
              </div>
            </div>
          </div>
          
          <button type="submit" className="mt-8 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-md">
            Save to Database
          </button>
        </form>
      )}

      {/* Overrides Section */}
      <div>
        <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500" /> Special Days & Birthdays ({overrides.length})
        </h4>
        <div className="flex flex-col gap-2">
          {overrides.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-xl hover:border-amber-300 transition-colors">
              <div className="flex items-center gap-3">
                <span className="bg-amber-100 text-amber-800 font-mono text-xs font-bold px-2 py-1 rounded-md shrink-0">{item.date}</span>
                <span className="text-sm text-slate-700 wrap-break-word [&>p]:inline" dangerouslySetInnerHTML={{ __html: item.text }} />
              </div>
              <div className="flex gap-1 shrink-0 pl-2">
                <button onClick={() => openEditModal(item)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item.id, 'override')} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {overrides.length === 0 && <span className="text-sm text-slate-400 italic px-2">No special days added yet.</span>}
        </div>
      </div>

      {/* Facts Section */}
      <div className="mt-4">
        <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-indigo-500" /> General Facts ({facts.length})
        </h4>
        <div className="flex flex-col gap-2">
          {facts.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors">
              <span className="text-sm text-slate-700 wrap-break-word pr-4 [&>p]:inline" dangerouslySetInnerHTML={{ __html: item.text }} />
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEditModal(item)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item.id, 'fact')} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {facts.length === 0 && <span className="text-sm text-slate-400 italic px-2">No facts added yet.</span>}
        </div>
      </div>

      {/* Edit Modal (Teleported to root) */}
      {editingItem && createPortal(
        <div 
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity"
          style={{ zIndex: 1100 }}
          onClick={() => setEditingItem(null)}
        >
          <div 
            className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-500" /> 
                Edit {editingItem.type === 'override' ? 'Special Day' : 'Fact'}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:bg-slate-100 hover:text-slate-600 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
              {editingItem.type === 'override' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={editingItem.editDate} 
                    onChange={e => setEditingItem({...editingItem, editDate: e.target.value})} 
                    className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 bg-slate-50 font-medium" 
                    required 
                  />
                  <p className="text-xs text-slate-500 mt-1">Year is ignored. Date locks to Month-Day.</p>
                </div>
              )}
              
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-700 mb-1">Message / Fact Text</label>
                <div className="bg-white rounded-xl overflow-hidden border border-slate-300 focus-within:border-indigo-500 transition-colors">
                  <ReactQuill 
                    theme="snow" 
                    value={editingItem.text} 
                    onChange={(content) => setEditingItem({...editingItem, text: content})}
                    className="h-40 border-none [&_.ql-container]:border-none [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setEditingItem(null)} className="px-5 py-2.5 font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
```

### `// src/components/admin/FamilyMembersTab.jsx`

```javascript
import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc, setDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Edit2, Trash2, Plus, X, Loader2, Image as ImageIcon, Music, PlayCircle, UserCircle, Play, Volume2, Users } from 'lucide-react';
import { compressImage } from '../../utils/imageCompression'; 
import { uploadToCloudflare } from '../../utils/cloudflareUploader';
import { playAudio } from '../../utils/audioPlayer';

export default function FamilyMembersTab() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // NEW: Tab Navigation State
  const [activeSubTab, setActiveSubTab] = useState('roster'); // 'roster' | 'avatars' | 'sounds'

  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState('');
  const [localSound, setLocalSound] = useState('');
  const [uploadingMemberAvatar, setUploadingMemberAvatar] = useState(false);

  const [avatarLibrary, setAvatarLibrary] = useState([]);
  const [soundLibrary, setSoundLibrary] = useState([]);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingSound, setUploadingSound] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'familyMembers'), (snapshot) => {
      const membersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(membersData.sort((a, b) => {
        if (a.participatesInChores === b.participatesInChores) {
          return (a.name || '').localeCompare(b.name || '');
        }
        return a.participatesInChores ? 1 : -1;
      }));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'avatars')).then(snap => { if (snap.exists()) setAvatarLibrary(snap.data().urls || []); });
    getDoc(doc(db, 'settings', 'sounds')).then(snap => { if (snap.exists()) setSoundLibrary(snap.data().items || []); });
  }, []);

  const openEditor = (member = null) => {
    setCurrentMember(member);
    setPreviewAvatar(member?.avatar || '');
    setLocalSound(member?.signatureSound || '');
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const memberData = {
        name: e.target.name.value,
        color: e.target.color.value,
        participatesInChores: e.target.role.value === 'kid',
        payRate: Number(e.target.payRate.value) || 0,
        pin: e.target.pin.value || '',
        avatar: previewAvatar,
        signatureSound: localSound
      };

      if (currentMember?.id) {
        await updateDoc(doc(db, 'familyMembers', currentMember.id), memberData);
      } else {
        await addDoc(collection(db, 'familyMembers'), { ...memberData, points: 0 });
      }
      setIsEditing(false);
      setCurrentMember(null);
    } catch (error) {
      alert("Failed to save family member.");
    }
  };

  const handleMemberAvatarUpload = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    setUploadingMemberAvatar(true);
    try {
      const optimizedBlob = await compressImage(file, 400, 400, 0.8);
      const url = await uploadToCloudflare(optimizedBlob, `avatar_${Date.now()}.jpg`);
      setPreviewAvatar(url);
    } catch (err) {
      alert("Upload failed.");
    }
    setUploadingMemberAvatar(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this member? All their data will be lost.")) await deleteDoc(doc(db, 'familyMembers', id));
  };

  const handleUploadToLibrary = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const optimizedBlob = await compressImage(file, 400, 400, 0.8);
      const url = await uploadToCloudflare(optimizedBlob, `library_${Date.now()}.jpg`);
      setAvatarLibrary(prev => [...prev, url]);
      await setDoc(doc(db, 'settings', 'avatars'), { urls: arrayUnion(url) }, { merge: true });
    } catch (error) {
      alert("Upload failed.");
    } 
    setUploadingAvatar(false);
  };

  const handleDeleteFromLibrary = async (url) => {
    if (!window.confirm("Remove this avatar from the library?")) return;
    setAvatarLibrary(prev => prev.filter(u => u !== url));
    await setDoc(doc(db, 'settings', 'avatars'), { urls: arrayRemove(url) }, { merge: true });
  };

  const handleUploadSound = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { 
      return alert("⚠️ Audio file is too large. Please keep custom sounds under 5MB.");
    }
    const soundName = window.prompt("Give this signature sound a short name:");
    if (!soundName) return;
    setUploadingSound(true);
    try {
      const url = await uploadToCloudflare(file, `sound_${Date.now()}_${file.name}`);
      setSoundLibrary(prev => [...prev, { name: soundName, url }]);
      await setDoc(doc(db, 'settings', 'sounds'), { items: arrayUnion({ name: soundName, url }) }, { merge: true });
    } catch (error) {
      alert("Upload failed.");
    }
    setUploadingSound(false);
  };

  const handleDeleteSound = async (soundObj) => {
    if (!window.confirm(`Remove "${soundObj.name}" from library?`)) return;
    setSoundLibrary(prev => prev.filter(s => s.url !== soundObj.url));
    await setDoc(doc(db, 'settings', 'sounds'), { items: arrayRemove(soundObj) }, { merge: true });
  };

  if (loading) return <div className="p-4 animate-pulse">Loading members...</div>;

  if (isEditing) {
    return (
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-slate-800 text-lg">{currentMember ? 'Edit Member' : 'New Member'}</h3>
          <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label><input name="name" defaultValue={currentMember?.name} required className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:border-indigo-500" /></div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
              <select name="role" defaultValue={currentMember?.participatesInChores ? 'kid' : 'parent'} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:border-indigo-500 cursor-pointer">
                <option value="kid">Kid</option><option value="parent">Parent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Profile Color</label><input type="color" name="color" defaultValue={currentMember?.color || '#6366f1'} className="w-full h-[50px] p-1 border border-slate-200 rounded-xl cursor-pointer" /></div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pay Rate ($/pt)</label><input type="number" step="0.01" name="payRate" defaultValue={currentMember?.payRate || 0} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:border-indigo-500" /></div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Profile PIN</label>
              <input type="text" maxLength="4" name="pin" defaultValue={currentMember?.pin || ''} placeholder="e.g. 1234" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:border-indigo-500" />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-5">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-2"><Volume2 className="w-4 h-4" /> Signature Sound</label>
            <div className="flex gap-2">
              <select value={localSound} onChange={(e) => setLocalSound(e.target.value)} className="flex-1 p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:border-indigo-500 cursor-pointer text-sm">
                <option value="">No Sound</option>
                {soundLibrary.map((s, idx) => <option key={idx} value={s.url}>{s.name}</option>)}
              </select>
              <button type="button" onClick={() => playAudio(localSound)} className="bg-indigo-100 text-indigo-600 px-4 rounded-xl hover:bg-indigo-200 transition-colors cursor-pointer"><Play className="w-5 h-5 fill-current" /></button>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-5">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-3"><ImageIcon className="w-4 h-4" /> Profile Avatar</label>
            
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-2xl border-4 border-slate-100 shadow-sm overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
                {previewAvatar ? <img src={previewAvatar} className="w-full h-full object-cover" /> : <UserCircle className="w-10 h-10 text-slate-300" />}
              </div>
              
              <div className="flex-1">
                {avatarLibrary.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 mb-2">
                    {avatarLibrary.map((url, idx) => (
                      <img key={idx} src={url} onClick={() => setPreviewAvatar(url)} className="w-12 h-12 rounded-lg cursor-pointer border-2 hover:border-indigo-500 object-cover shrink-0" />
                    ))}
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 w-full p-2 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50 text-indigo-600 font-bold cursor-pointer hover:bg-indigo-100 text-sm">
                  {uploadingMemberAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Upload Custom
                  <input type="file" accept="image/*" className="hidden" onChange={handleMemberAvatarUpload} disabled={uploadingMemberAvatar} />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer">Cancel</button>
            <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer">Save Member</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      
      {/* Sub-Tab Navigation */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit mb-6 border border-slate-200 shadow-inner overflow-x-auto hide-scrollbar">
        <button 
          onClick={() => setActiveSubTab('roster')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${activeSubTab === 'roster' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
        >
          <Users className="w-4 h-4" /> Family Roster
        </button>
        <button 
          onClick={() => setActiveSubTab('avatars')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${activeSubTab === 'avatars' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
        >
          <ImageIcon className="w-4 h-4" /> Avatar Library
        </button>
        <button 
          onClick={() => setActiveSubTab('sounds')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${activeSubTab === 'sounds' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
        >
          <Music className="w-4 h-4" /> Short Sound Library
        </button>
      </div>

      {activeSubTab === 'roster' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">Family Members</h3>
            <button onClick={() => openEditor(null)} className="flex items-center gap-1 text-sm font-bold text-white bg-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"><Plus className="w-4 h-4" /> Add Member</button>
          </div>
          <div className="grid gap-3">
            {members.map(member => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full shrink-0 shadow-sm border border-slate-100 object-cover overflow-hidden bg-slate-100 flex items-center justify-center font-bold text-white" style={{ backgroundColor: member.color || '#ccc' }}>
                    {member.avatar ? <img src={member.avatar} alt="avatar" className="w-full h-full object-cover" /> : member.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{member.name}</div>
                    <div className="text-xs font-medium text-slate-500 flex gap-2">
                      <span className="uppercase tracking-wider">{member.participatesInChores ? 'Kid' : 'Parent'}</span>
                      <span>&bull;</span>
                      <span>Rate: ${member.payRate?.toFixed(2) || '0.00'}</span>
                      {member.pin && <span className="text-amber-500 flex items-center gap-1">🔒 Locked</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEditor(member)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(member.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'avatars' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-indigo-500" /> Default Avatar Library</h3>
              <p className="text-xs text-slate-500 mt-1">Images uploaded here will be available for kids to choose from in their profile modal.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
            {avatarLibrary.map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl border-2 border-slate-200 overflow-hidden group bg-slate-50 shadow-sm">
                <img src={url} alt="Library Avatar" className="w-full h-full object-cover" />
                <button onClick={() => handleDeleteFromLibrary(url)} className="absolute top-1 right-1 bg-rose-500/90 text-white p-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600 cursor-pointer"><X className="w-3 h-3" /></button>
              </div>
            ))}
            <label className="aspect-square rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50 flex flex-col items-center justify-center text-indigo-600 cursor-pointer hover:bg-indigo-100 hover:border-indigo-400 transition-colors shadow-sm">
              {uploadingAvatar ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1">{uploadingAvatar ? '...' : 'Upload'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleUploadToLibrary} disabled={uploadingAvatar} />
            </label>
          </div>
        </div>
      )}

      {activeSubTab === 'sounds' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Music className="w-5 h-5 text-indigo-500" /> Signature Sound Library</h3>
              <p className="text-xs text-slate-500 mt-1">Short audio files (MP3/WAV) uploaded here can be selected by kids as their chore completion sound.</p>
            </div>
            <label className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold cursor-pointer hover:bg-indigo-100 transition-colors shadow-sm text-sm shrink-0">
              {uploadingSound ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {uploadingSound ? 'Uploading...' : 'Upload Sound (Max 5MB)'}
              <input type="file" accept="audio/*" className="hidden" onChange={handleUploadSound} disabled={uploadingSound} />
            </label>
          </div>
          
          <div className="space-y-2 mt-4">
            {soundLibrary.length === 0 && <div className="text-center p-6 text-slate-400 font-medium bg-slate-50 rounded-xl border border-slate-100">No custom sounds added yet. Use the System Tools tab to restore defaults!</div>}
            {soundLibrary.map((sound, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-200 transition-colors">
                <div className="flex items-center gap-3">
                  <button onClick={() => playAudio(sound.url)} className="text-indigo-500 hover:text-indigo-700 transition-colors cursor-pointer"><PlayCircle className="w-6 h-6" /></button>
                  <span className="font-bold text-slate-700">{sound.name}</span>
                </div>
                <button onClick={() => handleDeleteSound(sound)} className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer bg-white rounded-md shadow-sm border border-slate-100"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### `// src/components/admin/MessageTab.jsx`

```javascript
import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { MessageSquare, Save, Power } from 'lucide-react';
import { useMessageCentre } from '../../hooks/useMessageCentre';

export default function MessageTab() {
  const { messageData, loading, saveMessage } = useMessageCentre();
  const [formData, setFormData] = useState(messageData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(messageData);
  }, [messageData]);

  if (loading) return <div className="animate-pulse p-4">Loading Message Centre...</div>;

  const handleSave = async () => {
    setIsSaving(true);
    await saveMessage(formData);
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold mb-1 text-slate-800 flex items-center gap-2">
            <MessageSquare className="text-indigo-500" /> Message Centre Controls
          </h3>
          <p className="text-slate-500 text-sm">Pin a rich-text announcement to the top of the family dashboard.</p>
        </div>
        
        <button
          onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            formData.isActive 
              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          <Power className="w-5 h-5" />
          {formData.isActive ? 'Widget Active' : 'Widget Hidden'}
        </button>
      </div>

      <div className={`bg-white p-6 rounded-2xl border-2 transition-all shadow-sm space-y-5 ${formData.isActive ? 'border-indigo-100' : 'border-slate-100 opacity-60'}`}>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Message Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none font-bold text-slate-700"
              placeholder="e.g., Weekend Plans!"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Notice Type (Color)</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none font-bold text-slate-700 bg-white"
            >
              <option value="info">📘 Info (Blue)</option>
              <option value="important">📕 Important (Red)</option>
              <option value="warning">📙 Warning (Yellow)</option>
              <option value="success">📗 Success (Green)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Message Content</label>
          <div className="bg-white rounded-xl overflow-hidden border-2 border-slate-200 focus-within:border-indigo-500 transition-colors">
            <ReactQuill 
              theme="snow" 
              value={formData.content} 
              onChange={(content) => setFormData({ ...formData, content })}
              className="h-48 border-none"
            />
          </div>
        </div>

        <div className="pt-10">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
          >
            <Save className="w-5 h-5" /> {isSaving ? 'Saving to Database...' : 'Save & Publish Message'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

### `// src/components/admin/ScheduleManager.jsx`

```javascript
import { useState, useEffect } from 'react';
import { CalendarDays, ChevronDown, ChevronUp, AlertCircle, RefreshCcw, Check, X } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useCustody } from '../../hooks/useCustody';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';

export default function ScheduleManager() {
  const { isHereToday, overrides, toggleOverride, clearOverride } = useCustody();
  const { members, loading } = useFamilyMembers();
  
  const [expandedKid, setExpandedKid] = useState(null);
  
  // Draft states for the Pattern Builder
  const [draftAnchor, setDraftAnchor] = useState('');
  const [draftCycle, setDraftCycle] = useState(14);
  const [draftPattern, setDraftPattern] = useState([]);

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium animate-pulse">Loading schedules...</div>;

  const kids = members.filter(m => m.participatesInChores === true || String(m.participatesInChores).toLowerCase() === 'true');

  const openKidSettings = (kid) => {
    if (expandedKid === kid.id) {
      setExpandedKid(null);
      return;
    }
    
    setExpandedKid(kid.id);
    
    // Initialize draft state with their current schedule, or default to a blank 14-day cycle
    const today = new Date();
    const isoToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    setDraftAnchor(kid.schedule?.referenceDate || isoToday);
    
    const existingPattern = kid.schedule?.pattern;
    if (existingPattern && existingPattern.length > 0) {
      setDraftCycle(existingPattern.length);
      setDraftPattern(existingPattern);
    } else {
      setDraftCycle(14);
      setDraftPattern(Array(14).fill(true));
    }
  };

  const handleCycleChange = (newLength) => {
    setDraftCycle(newLength);
    // Expand or shrink the array while preserving existing choices where possible
    setDraftPattern(prev => {
      const newArray = Array(Number(newLength)).fill(true);
      for (let i = 0; i < Math.min(prev.length, newLength); i++) {
        newArray[i] = prev[i];
      }
      return newArray;
    });
  };

  const togglePatternDay = (index) => {
    setDraftPattern(prev => {
      const newPattern = [...prev];
      newPattern[index] = !newPattern[index];
      return newPattern;
    });
  };

  const handleSaveSchedule = async (kidId) => {
    try {
      await updateDoc(doc(db, 'familyMembers', kidId), { 
        schedule: {
          referenceDate: draftAnchor,
          pattern: draftPattern
        } 
      });
      setExpandedKid(null);
    } catch (error) {
      console.error("Error updating schedule:", error);
      alert("Failed to update schedule.");
    }
  };

  // Helper to generate the day names for the Pattern Builder UI
  const getDayLabel = (anchorString, offsetDays) => {
    if (!anchorString) return 'Day';
    const [y, m, d] = anchorString.split('-');
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + offsetDays);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-300">
      <div className="bg-slate-50 border-b-2 border-slate-200 p-4 flex items-center gap-3">
        <CalendarDays className="w-6 h-6 text-indigo-600" />
        <h3 className="font-bold text-lg text-slate-800">Custody & Schedules</h3>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-start gap-2 bg-indigo-50 text-indigo-700 p-3 rounded-xl border border-indigo-100">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-xs font-medium">
            Overrides are strictly for <b>today</b> and will automatically clear at midnight. The infinite schedule builder determines the baseline flow.
          </p>
        </div>

        {kids.map(kid => {
          const hereToday = isHereToday(kid);
          const hasOverride = overrides[kid.id] !== undefined;
          const displayColor = kid.color || '#6366f1';
          const isExpanded = expandedKid === kid.id;

          return (
            <div key={kid.id} className="border-2 rounded-xl overflow-hidden transition-colors" style={{ borderColor: `${displayColor}33` }}>
              
              {/* Main Status Row */}
              <div className="p-4 flex items-center justify-between" style={{ backgroundColor: hereToday ? `${displayColor}11` : '#fee2e2' }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0"
                    style={{ backgroundColor: displayColor }}
                  >
                    {kid.avatar ? <img src={kid.avatar} alt={kid.name} className="w-full h-full rounded-full object-cover" /> : kid.name[0]}
                  </div>
                  
                  <div className="min-w-0">
                    <div className="font-bold text-slate-800 truncate flex items-center gap-2">
                      {kid.name}
                      {hasOverride && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
                          OVERRIDDEN
                        </span>
                      )}
                    </div>
                    <div className={`text-xs font-bold ${hereToday ? 'text-emerald-600' : 'text-red-500'}`}>
                      {hereToday ? '✅ Scheduled: Here' : '❌ Scheduled: Away'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {hasOverride ? (
                    <button 
                      onClick={() => clearOverride(kid.id)}
                      className="flex items-center gap-1 bg-slate-600 hover:bg-slate-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                    >
                      <RefreshCcw className="w-3.5 h-3.5" /> Reset
                    </button>
                  ) : (
                    <button 
                      onClick={() => toggleOverride(kid.id, hereToday)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm text-white ${hereToday ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                    >
                      {hereToday ? 'Set Away' : 'Set Here'}
                    </button>
                  )}
                </div>
              </div>

              {/* Base Schedule Settings Accordion */}
              <button 
                onClick={() => openKidSettings(kid)}
                className="w-full flex items-center justify-center gap-1 py-2 bg-white border-t border-slate-100 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {isExpanded ? 'Close Builder' : 'Open Pattern Builder'}
              </button>

              {isExpanded && (
                <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col gap-6">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">1. Pick an Anchor Date</label>
                      <input 
                        type="date" 
                        value={draftAnchor}
                        onChange={(e) => setDraftAnchor(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">2. Cycle Length</label>
                      <select 
                        value={draftCycle}
                        onChange={(e) => handleCycleChange(Number(e.target.value))}
                        className="w-full p-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value={7}>7 Days (1 Week)</option>
                        <option value={14}>14 Days (2 Weeks)</option>
                        <option value={21}>21 Days (3 Weeks)</option>
                        <option value={28}>28 Days (4 Weeks)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-3 block flex items-center justify-between">
                      <span>3. Build the Repeating Pattern</span>
                      <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full normal-case">
                        Starts on {draftAnchor ? getDayLabel(draftAnchor, 0) : 'selected date'}
                      </span>
                    </label>
                    
                    <div className="grid grid-cols-7 gap-1.5 bg-white p-3 rounded-xl border border-slate-200 shadow-inner">
                      {draftPattern.map((isHere, index) => {
                        const dayName = getDayLabel(draftAnchor, index);
                        return (
                          <button
                            key={index}
                            onClick={() => togglePatternDay(index)}
                            className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all ${
                              isHere 
                                ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-sm' 
                                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <span className="text-[10px] font-bold uppercase mb-1">{dayName}</span>
                            {isHere ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => handleSaveSchedule(kid.id)}
                      className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors shadow-md"
                    >
                      Save Infinite Schedule
                    </button>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### `// src/components/admin/SystemToolsTab.jsx`

```javascript
import { useState, useEffect } from 'react';
import { Database, AlertTriangle, Trash2, CheckCircle2, Lock, Save, Music, PartyPopper } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { injectHistoricalData, removeTestData } from '../../utils/testDataHelpers';

const LEGACY_SOUNDS = [
  { name: '🍃 Animal Crossing NH', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Animal%20Crossing%20NH.mp3' },
  { name: '🐶 Bluey Hooray', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Bluey%20Bingo%20Hooray.mp3' },
  { name: '⚓ Bosun Whistle', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/BosunWhistle.mp3' },
  { name: '💵 Cash Register', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/CashRegister.mp3' },
  { name: '🚓 Chase is on the Case', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Chase%20is%20on%20the%20case.mp3' },
  { name: '🐦 Crow', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Crow%20.mp3' },
  { name: '🔔 Ding', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/ding.mp3' },
  { name: '🦆 Duck Hunt', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Duck%20hunt.mp3' },
  { name: '🚨 Fire Siren', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/FireSiren.mp3' },
  { name: '👻 Ghostbusters', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Ghostbusters%20.mp3' },
  { name: '🐐 Goat', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Goat.mp3' },
  { name: '🦉 Great Horned Owl', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Great%20Horned%20Owl.mp3' },
  { name: '💥 Laser Sound', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Laser%20Sound.mp3' },
  { name: '🍄 Mario Animal Crossing', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Mario%20Animal%20Crossing.mp3' },
  { name: '🪙 Mario Coin', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Mario%20Coin.mp3' },
  { name: '🍄 Mario Grow', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/MarioGrow.mp3' },
  { name: '🟩 Minecraft Level Up', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Minecraft%20level%20up%20sou.mp3' },
  { name: '🎮 Nintendo Switch', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Nintendo%20switch.mp3' },
  { name: '🐷 Peppa Pig', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Peppa.mp3' },
  { name: '⚡ Pikachu', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Picachu.mp3' },
  { name: '🏎️ Racing Car', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Racing%20car.mp3' },
  { name: '🟦 Roblox Celebration', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Roblox%20celebration.mp3' },
  { name: '🟦 Roblox Yay', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Roblox%20yay.mp3' },
  { name: '🐐 Screaming Goat', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Screaming%20goat.mp3' },
  { name: '🤪 Slide Whistle', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Slide%20whistle.mp3' },
  { name: '🖖 TNG Door', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/TNG_Door.mp3' },
  { name: '🚂 Train Horn', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Train%20horn.mp3' },
  { name: '🤖 Wall-E WHOA', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Wall-E%20WHOA%20.mp3' },
  { name: '🚨 Yeeps Alarm', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Yeeps%20alarm.mp3' },
  { name: '🏁 Yeeps Round Start', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Yeeps%20round%20start.mp3' },
  { name: '🦖 Yoshi', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/yoshi.mp3' },
  { name: '🕰️ Vecna\'s Clock', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/VecnaClock.mp3' }
];

// Added some robust longer sounds for the celebrations!
const LEGACY_CELEB_SOUNDS = [
  { name: '🏁 Mario Flagpole', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Mario%20Bros%20Flagpole.mp3' },
  { name: '🥳 Roblox Fanfare', url: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Roblox%20celebration.mp3' }
];

export default function SystemToolsTab() {
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState('8486');
  const [pinSaving, setPinSaving] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'admin')).then(snap => {
      if (snap.exists() && snap.data().pin) setPin(snap.data().pin);
    });
  }, []);

  const handleSavePin = async () => {
    if (pin.length < 4) return alert("PIN must be at least 4 digits.");
    setPinSaving(true);
    await setDoc(doc(db, 'settings', 'admin'), { pin }, { merge: true });
    setPinSaving(false);
    alert("✅ Admin PIN updated successfully!");
  };

  const handleRestoreSounds = async () => {
    if (!window.confirm("Restore original library?")) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'sounds'), { items: LEGACY_SOUNDS }, { merge: true });
      await setDoc(doc(db, 'settings', 'celebSounds'), { items: LEGACY_CELEB_SOUNDS }, { merge: true });
      alert("✅ Original sounds restored successfully!");
    } catch (e) {
      alert("❌ Failed to restore sounds.");
    }
    setLoading(false);
  };

  const handleInject = async () => {
    if (!window.confirm("Inject 60 days of fake chores?")) return;
    setLoading(true);
    await injectHistoricalData();
    setLoading(false);
  };

  const handleRemove = async () => {
    if (!window.confirm("Permanently delete injected data?")) return;
    setLoading(true);
    await removeTestData();
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
        <Database className="text-indigo-600" /> System & Security Tools
      </h3>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        
        <div className="border-b border-slate-100 pb-6">
          <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-indigo-500" /> Change Admin PIN
          </h4>
          <p className="text-sm text-slate-500 mb-4">
            Used to access the Admin Panel and Quick-Add Chores. Keep this hidden from the kids!
          </p>
          <div className="flex gap-3 max-w-sm">
            <input type="password" value={pin} onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))} maxLength={8} className="flex-1 p-3 border-2 border-slate-200 rounded-xl font-bold text-center tracking-widest text-lg focus:outline-none focus:border-indigo-500" />
            <button onClick={handleSavePin} disabled={pinSaving} className="bg-indigo-600 text-white px-6 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70">
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        </div>

        <div className="border-b border-slate-100 pb-6">
          <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
            <PartyPopper className="w-5 h-5 text-indigo-500" /> Restore Legacy Sounds
          </h4>
          <p className="text-sm text-slate-500 mb-4">Click here to instantly restore your original sound effects to both the Short Sound and Celebration libraries.</p>
          <button onClick={handleRestoreSounds} disabled={loading} className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl font-bold hover:bg-indigo-200 transition-colors shadow-sm">
            {loading ? 'Processing...' : 'Restore Sound Library'}
          </button>
        </div>

        <div className="border-b border-slate-100 pb-6">
          <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Inject Historical Test Data
          </h4>
          <p className="text-sm text-slate-500 mb-4">Populate the database with random chore completions for the past 60 days to test the bar charts.</p>
          <button onClick={handleInject} disabled={loading} className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-bold hover:bg-emerald-200 transition-colors shadow-sm">
            {loading ? 'Processing...' : 'Inject Past 60 Days Data'}
          </button>
        </div>

        <div>
          <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" /> Remove Test Data
          </h4>
          <p className="text-sm text-slate-500 mb-4">Surgically remove only the test data injected by the tool above.</p>
          <button onClick={handleRemove} disabled={loading} className="flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-xl font-bold hover:bg-rose-200 transition-colors shadow-sm">
            <Trash2 className="w-4 h-4" /> {loading ? 'Processing...' : 'Delete Test Data'}
          </button>
        </div>

      </div>
    </div>
  );
}
```

### `// src/components/admin/ThemeTab.jsx`

```javascript
import { useState, useEffect } from 'react';
import { Save, Play, Plus, Trash2, Type, Palette, Wand2, X, Loader2, CheckCircle2, Image as ImageIcon, Video, Music } from 'lucide-react';
import { doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useCelebration, EFFECTS, CELEB_PALETTES, DEFAULT_CELEBRATION } from '../../hooks/useCelebration';
import { useTheme, THEME_PRESETS, FONT_OPTIONS } from '../../hooks/useTheme';
import { compressImage } from '../../utils/imageCompression';
import { uploadToCloudflare } from '../../utils/cloudflareUploader';

export default function ThemeTab() {
  const { settings: celebSettings, loading: celebLoading, saveSettings: saveCeleb, triggerCelebration } = useCelebration();
  const { theme, loading: themeLoading, saveTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('theme');
  const [celebSoundOptions, setCelebSoundOptions] = useState([]);

  const [celebForm, setCelebForm] = useState(celebSettings || DEFAULT_CELEBRATION);
  const [themeForm, setThemeForm] = useState(theme);
  
  const [wallpaperFile, setWallpaperFile] = useState(null);
  const [wallpaperPreviewUrl, setWallpaperPreviewUrl] = useState(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingSound, setUploadingSound] = useState(false);
  
  const [isSavingCeleb, setIsSavingCeleb] = useState(false);
  const [celebSaved, setCelebSaved] = useState(false);
  
  const [isSavingTheme, setIsSavingTheme] = useState(false);
  const [themeSaved, setThemeSaved] = useState(false);

  const [localOverride, setLocalOverride] = useState(() => localStorage.getItem('bgPositionOverride'));

  useEffect(() => {
    getDoc(doc(db, 'settings', 'celebSounds')).then(snap => {
      if (snap.exists() && snap.data().items) setCelebSoundOptions(snap.data().items);
    });
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('themePreviewUpdate', { detail: { ...themeForm, bgPreview: wallpaperPreviewUrl } }));
    return () => window.dispatchEvent(new CustomEvent('themePreviewUpdate', { detail: null }));
  }, [themeForm, wallpaperPreviewUrl]);

  useEffect(() => { if (celebSettings) setCelebForm(celebSettings); }, [celebSettings]);
  useEffect(() => { setThemeForm(theme); }, [theme]);

  if (celebLoading && themeLoading && !themeForm?.bgColor) {
    return <div className="p-4 text-slate-500 font-medium animate-pulse">Loading settings...</div>;
  }

  const applyLocalOverride = (val) => {
    setLocalOverride(val);
    if (val !== null && val !== '') {
      localStorage.setItem('bgPositionOverride', val);
      window.dispatchEvent(new Event('localBgOverrideChanged'));
    } else {
      localStorage.removeItem('bgPositionOverride');
      window.dispatchEvent(new Event('localBgOverrideChanged'));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("⚠️ Invalid file type. Please select a JPG, PNG, or WEBP image.");
      e.target.value = '';
      return;
    }

    setWallpaperFile(file);
    setThemeForm(prev => ({ ...prev, preset: 'custom' }));
    if (wallpaperPreviewUrl) URL.revokeObjectURL(wallpaperPreviewUrl);
    setWallpaperPreviewUrl(URL.createObjectURL(file));
  };

  const handleSaveTheme = async () => {
    setIsSavingTheme(true);
    try {
      let finalUrl = themeForm.bgImageUrl;
      if (wallpaperFile) {
        const optimizedBlob = await compressImage(wallpaperFile, 1920, 1080, 0.85);
        finalUrl = await uploadToCloudflare(optimizedBlob, `bg_${Date.now()}.jpg`);
      }
      const updatedTheme = { ...themeForm, bgImageUrl: finalUrl, preset: (finalUrl || themeForm.bgColor) ? 'custom' : themeForm.preset };
      await saveTheme(updatedTheme);
      setThemeForm(updatedTheme);
      
      if (wallpaperPreviewUrl) URL.revokeObjectURL(wallpaperPreviewUrl);
      setWallpaperPreviewUrl(null);
      setWallpaperFile(null);
      
      const bgInput = document.getElementById('theme-bg-upload');
      if (bgInput) bgInput.value = '';

      setThemeSaved(true);
      setTimeout(() => setThemeSaved(false), 2000);
    } catch (e) {
      alert("Failed to save theme to the database.");
    }
    setIsSavingTheme(false);
  };

  // RESTORED THE MISSING FUNCTIONS HERE
  const handlePreviewStart = () => {
    const modal = document.getElementById('admin-modal-container');
    if (modal) modal.style.opacity = '0';
  };
  
  const handlePreviewEnd = () => {
    const modal = document.getElementById('admin-modal-container');
    if (modal) modal.style.opacity = '1';
  };

  const handleVideoUpload = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      return alert("⚠️ Video file is too large. Please keep celebration videos under 15MB.");
    }
    setUploadingVideo(true);
    try {
      const url = await uploadToCloudflare(file, `celeb_video_global_${Date.now()}_${file.name}`);
      setCelebForm({ ...celebForm, videoUrl: url, type: 'video' });
    } catch (err) {
      alert("Failed to upload video.");
    } finally {
      setUploadingVideo(false);
      e.target.value = '';
    }
  };

  const handleCustomAudioUpload = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { 
      return alert("⚠️ Audio file is too large. Please keep custom sounds under 5MB.");
    }
    setUploadingSound(true);
    try {
      const url = await uploadToCloudflare(file, `custom_sound_global_${Date.now()}_${file.name}`);
      const soundName = window.prompt("Name this Celebration Audio track:") || "Custom Audio";
      await setDoc(doc(db, 'settings', 'celebSounds'), { items: arrayUnion({ name: soundName, url }) }, { merge: true });
      
      setCelebSoundOptions(prev => [...prev, { name: soundName, url }]);
      setCelebForm({ ...celebForm, soundUrl: url });
    } catch (err) {
      alert("Failed to upload audio.");
    } finally {
      setUploadingSound(false);
      e.target.value = '';
    }
  };

  const handleSaveCeleb = async () => {
    setIsSavingCeleb(true);
    await saveCeleb(celebForm);
    setIsSavingCeleb(false);
    setCelebSaved(true);
    setTimeout(() => setCelebSaved(false), 2000);
  };

  const addLayer = () => {
    if ((celebForm.layers || []).length >= 4) return;
    setCelebForm(prev => ({ ...prev, layers: [...(prev.layers || []), { type: 'realistic-burst', colors: CELEB_PALETTES[0].colors, scale: 1, intensity: 1 }] }));
  };

  const updateLayer = (index, field, value) => {
    const newLayers = [...(celebForm.layers || [])];
    newLayers[index] = { ...newLayers[index], [field]: value };
    setCelebForm(prev => ({ ...prev, layers: newLayers }));
  };

  const removeLayer = (index) => {
    const newLayers = [...(celebForm.layers || [])];
    newLayers.splice(index, 1);
    setCelebForm(prev => ({ ...prev, layers: newLayers }));
  };

  const localOverrideActive = localOverride !== null && localOverride !== '';

  return (
    <div className="space-y-6 max-w-2xl pb-12">
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit mb-6 border border-slate-200 shadow-inner">
        <button onClick={() => setActiveTab('theme')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'theme' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}><Palette className="w-4 h-4" /> App Theme</button>
        <button onClick={() => setActiveTab('celebration')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'celebration' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}><Wand2 className="w-4 h-4" /> Celebration FX</button>
      </div>

      {activeTab === 'theme' && (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-start">
            <div><h3 className="text-xl font-bold mb-1 text-slate-800 flex items-center gap-2">Visual Customization</h3><p className="text-slate-500 text-sm">Select presets or upload a custom background.</p></div>
            
            {/* THIS BUTTON NOW WORKS! */}
            <button 
              onMouseDown={handlePreviewStart} 
              onMouseUp={handlePreviewEnd} 
              onMouseLeave={handlePreviewEnd}
              onTouchStart={handlePreviewStart}
              onTouchEnd={handlePreviewEnd}
              className="py-2 px-4 bg-slate-800 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-900 transition-colors shadow-lg cursor-pointer select-none"
            >
              👁️ Hold to Preview
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Presets</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {THEME_PRESETS.map(p => (
                  <button key={p.id} onClick={() => { setThemeForm({ ...themeForm, preset: p.id }); setWallpaperFile(null); if (wallpaperPreviewUrl) URL.revokeObjectURL(wallpaperPreviewUrl); setWallpaperPreviewUrl(null); }} className={`p-2 rounded-xl text-sm font-bold border-2 transition-all cursor-pointer ${themeForm.preset === p.id ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-transparent hover:border-slate-200'}`} style={{ background: p.bg || '#e2e8f0', color: p.font }}>{p.label}</button>
                ))}
              </div>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Custom Background Image</label>
                {(themeForm.bgImageUrl || wallpaperPreviewUrl) && (
                  <div className="relative aspect-video rounded-xl border-2 border-slate-200 overflow-hidden mb-4 shadow-sm bg-slate-100">
                    <img src={wallpaperPreviewUrl ? wallpaperPreviewUrl : themeForm.bgImageUrl} className="w-full h-full object-cover" alt="Background Preview" />
                    <button onClick={() => { setThemeForm({...themeForm, bgImageUrl: '', preset: 'default'}); setWallpaperFile(null); if (wallpaperPreviewUrl) URL.revokeObjectURL(wallpaperPreviewUrl); setWallpaperPreviewUrl(null); const el = document.getElementById('theme-bg-upload'); if (el) el.value = ''; }} className="absolute top-2 right-2 bg-rose-500/90 hover:bg-rose-600 text-white p-2 rounded-lg shadow-md backdrop-blur-sm transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:border-indigo-400 font-bold transition-colors cursor-pointer">
                  <ImageIcon className="w-5 h-5" /> {wallpaperPreviewUrl ? 'Select a Different Image' : 'Select Local Image'}
                  <input id="theme-bg-upload" type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleFileSelect} />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fallback Background Color</label><input type="color" value={themeForm.bgColor || '#667eea'} onChange={e => setThemeForm({ ...themeForm, bgColor: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer border-0 p-0" /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Calendar Font Color</label><input type="color" value={themeForm.fontColor || '#1f2937'} onChange={e => setThemeForm({ ...themeForm, fontColor: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer border-0 p-0" /></div>
              </div>
            </div>

            <div>
              <label className="flex text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 items-center gap-1"><Type className="w-4 h-4"/> Global Font Style</label>
              <div className="grid grid-cols-2 gap-2">
                {FONT_OPTIONS.map(f => (
                  <button key={f.id} onClick={() => setThemeForm({ ...themeForm, fontFamily: f.id })} className={`p-2 rounded-xl text-sm transition-all border-2 cursor-pointer ${themeForm.fontFamily === f.id ? 'border-indigo-500 bg-indigo-50 text-indigo-800 font-bold' : 'border-slate-100 text-slate-600 hover:bg-slate-50'}`} style={{ fontFamily: f.css }}>{f.label}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div><div className="flex justify-between"><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Panel Opacity</label><span className="text-xs font-bold text-indigo-500">{themeForm.panelOpacity}%</span></div><input type="range" min="10" max="100" step="5" value={themeForm.panelOpacity} onChange={(e) => setThemeForm({...themeForm, panelOpacity: parseInt(e.target.value)})} className="w-full accent-indigo-500"/></div>
              <div><div className="flex justify-between"><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Glass Blur</label><span className="text-xs font-bold text-indigo-500">{themeForm.panelBlur}px</span></div><input type="range" min="0" max="24" step="2" value={themeForm.panelBlur} onChange={(e) => setThemeForm({...themeForm, panelBlur: parseInt(e.target.value)})} className="w-full accent-indigo-500"/></div>

              {(themeForm.bgImageUrl || wallpaperPreviewUrl) && (
                <>
                  <div><div className="flex justify-between"><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Desktop Position</label><span className="text-xs font-bold text-indigo-500">{themeForm.bgPositionDesktop ?? 50}%</span></div><input type="range" min="0" max="100" value={themeForm.bgPositionDesktop ?? 50} onChange={(e) => setThemeForm({...themeForm, bgPositionDesktop: parseInt(e.target.value)})} className="w-full accent-indigo-500"/></div>
                  <div><div className="flex justify-between"><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mobile Position</label><span className="text-xs font-bold text-indigo-500">{themeForm.bgPositionMobile ?? 50}%</span></div><input type="range" min="0" max="100" value={themeForm.bgPositionMobile ?? 50} onChange={(e) => setThemeForm({...themeForm, bgPositionMobile: parseInt(e.target.value)})} className="w-full accent-indigo-500"/></div>
                  <div className="col-span-1 md:col-span-2 pt-4 mt-2 border-t border-slate-100 bg-slate-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-emerald-600">🖥️ Local Device Override</label>
                      {localOverrideActive && <button onClick={() => applyLocalOverride('')} className="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-200 px-2 py-1 rounded-md shadow-sm hover:bg-rose-100 transition-colors">✕ Clear Override</button>}
                    </div>
                    <input type="range" min="0" max="100" value={localOverrideActive ? localOverride : (themeForm.bgPositionDesktop ?? 50)} onChange={(e) => applyLocalOverride(e.target.value)} className={`w-full ${localOverrideActive ? 'accent-emerald-500' : 'accent-slate-300 opacity-60'}`}/>
                  </div>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button onClick={handleSaveTheme} disabled={isSavingTheme || themeSaved} className={`w-full py-3 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer ${themeSaved ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                {isSavingTheme ? <Loader2 className="w-5 h-5 animate-spin" /> : (themeSaved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />)} 
                {isSavingTheme ? 'Uploading & Saving...' : (themeSaved ? 'Theme Saved!' : 'Save App Theme')}
              </button>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'celebration' && (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div><h3 className="text-xl font-bold mb-1 text-slate-800 flex items-center gap-2">Global Reward Popup</h3><p className="text-slate-500 text-sm">Plays when anyone finishes their chores.</p></div>
          
          <div className="flex bg-slate-200/50 p-1 rounded-xl shrink-0">
            <button onClick={() => { const val = { ...celebForm, type: 'particles' }; setCelebForm(val); }} className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${(!celebForm.type || celebForm.type === 'particles') ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
              <Wand2 className="w-4 h-4" /> Particles
            </button>
            <button onClick={() => { const val = { ...celebForm, type: 'video' }; setCelebForm(val); }} className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${celebForm.type === 'video' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
              <Video className="w-4 h-4" /> Video
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            
            {celebForm.type === 'video' ? (
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Screen Video</label>
                {celebForm.videoUrl && (
                  <div className="relative aspect-video rounded-xl border-2 border-slate-200 overflow-hidden mb-4 shadow-sm bg-black">
                    <video src={celebForm.videoUrl} className="w-full h-full object-cover" controls />
                    <button onClick={() => setCelebForm({ ...celebForm, videoUrl: '' })} className="absolute top-2 right-2 bg-rose-500/90 hover:bg-rose-600 text-white p-2 rounded-lg shadow-md backdrop-blur-sm transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50 text-indigo-600 font-bold cursor-pointer hover:bg-indigo-100 hover:border-indigo-300 transition-colors">
                  {uploadingVideo ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                  {uploadingVideo ? 'Uploading...' : 'Upload Video (Max 15MB)'}
                  <input type="file" accept="video/mp4, video/webm, video/quicktime" className="hidden" onChange={handleVideoUpload} disabled={uploadingVideo} />
                </label>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Duration</label>
                  <select value={celebForm.duration} onChange={e => setCelebForm({ ...celebForm, duration: Number(e.target.value) })} className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 font-bold text-sm text-slate-700 bg-slate-50 focus:bg-white transition-colors cursor-pointer">
                    <option value={0}>Play until Media Finishes</option><option value={3}>3 Seconds</option><option value={5}>5 Seconds</option><option value={8}>8 Seconds</option><option value={15}>15 Seconds</option>
                  </select>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Long Audio Track</label>
                    <select value={celebForm.soundUrl || ''} onChange={e => setCelebForm({ ...celebForm, soundUrl: e.target.value })} className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 font-bold text-sm text-slate-700 bg-white transition-colors cursor-pointer">
                      <option value="">No Sound (Silent)</option>
                      {celebSoundOptions.map((s, idx) => <option key={idx} value={s.url}>{s.name}</option>)}
                      {celebForm.soundUrl && !celebSoundOptions.find(s => s.url === celebForm.soundUrl) && <option value={celebForm.soundUrl}>🎙️ Custom Uploaded Audio</option>}
                    </select>
                  </div>
                  
                  <label className="flex items-center justify-center gap-2 w-full p-3 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50 text-indigo-600 font-bold cursor-pointer hover:bg-indigo-100 hover:border-indigo-300 transition-colors">
                    {uploadingSound ? <Loader2 className="w-5 h-5 animate-spin" /> : <Music className="w-5 h-5" />}
                    {uploadingSound ? 'Uploading...' : 'Upload Own Audio (Max 5MB)'}
                    <input type="file" accept="audio/*" className="hidden" onChange={handleCustomAudioUpload} disabled={uploadingSound} />
                  </label>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Duration</label>
                    <select value={celebForm.duration} onChange={e => setCelebForm({ ...celebForm, duration: Number(e.target.value) })} className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 font-bold text-sm text-slate-700 bg-white transition-colors cursor-pointer">
                      <option value={0}>Play until Media Finishes</option><option value={3}>3 Seconds</option><option value={5}>5 Seconds</option><option value={8}>8 Seconds (Long)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Effect Layers ({celebForm.layers?.length || 0}/4)</label>
                  {(celebForm.layers || []).map((layer, index) => (
                    <div key={index} className="bg-white border border-slate-200 rounded-xl p-3 relative shadow-sm">
                      <button onClick={() => removeLayer(index)} className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
                      <div className="space-y-3 pr-6">
                        <div>
                          <select value={layer.type} onChange={(e) => updateLayer(index, 'type', e.target.value)} className="w-full p-2 rounded-lg border border-slate-200 font-bold text-sm text-slate-700 focus:border-indigo-500 cursor-pointer">
                            {EFFECTS.map(eff => <option key={eff.id} value={eff.id}>{eff.label}</option>)}
                          </select>
                        </div>
                        {layer.type === 'emoji' ? (
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Type an Emoji 🦄🐾🚗</label>
                            <input type="text" maxLength="2" value={layer.emojiChar || '😀'} onChange={(e) => updateLayer(index, 'emojiChar', e.target.value)} className="w-full p-2 text-2xl text-center border border-slate-200 rounded-lg focus:border-indigo-500" />
                          </div>
                        ) : (
                          <div>
                            <select value={JSON.stringify(layer.colors || CELEB_PALETTES[0].colors)} onChange={(e) => updateLayer(index, 'colors', JSON.parse(e.target.value))} className="w-full p-2 rounded-lg border border-slate-200 font-bold text-sm text-slate-700 focus:border-indigo-500 cursor-pointer mb-1.5">
                              {CELEB_PALETTES.map(pal => <option key={pal.id} value={JSON.stringify(pal.colors)}>{pal.label}</option>)}
                            </select>
                            <div className="flex h-1.5 rounded overflow-hidden">
                              {(layer.colors || CELEB_PALETTES[0].colors).map((c, i) => <div key={i} style={{ backgroundColor: c, flex: 1 }} />)}
                            </div>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div><div className="flex justify-between"><label className="text-[10px] font-bold text-slate-500">Size</label><span className="text-[10px] text-indigo-500">{layer.scale}x</span></div><input type="range" min="0.5" max="3" step="0.1" value={layer.scale} onChange={(e) => updateLayer(index, 'scale', parseFloat(e.target.value))} className="w-full accent-indigo-500"/></div>
                          <div><div className="flex justify-between"><label className="text-[10px] font-bold text-slate-500">Amount</label><span className="text-[10px] text-indigo-500">{layer.intensity * 100}%</span></div><input type="range" min="0.2" max="2.5" step="0.1" value={layer.intensity} onChange={(e) => updateLayer(index, 'intensity', parseFloat(e.target.value))} className="w-full accent-indigo-500"/></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(celebForm.layers || []).length < 4 && <button onClick={addLayer} className="w-full py-3 border-2 border-dashed border-indigo-200 text-indigo-500 font-bold rounded-xl flex items-center justify-center gap-1 hover:bg-indigo-50 hover:border-indigo-400 transition-colors text-sm cursor-pointer"><Plus className="w-4 h-4" /> Add Layer</button>}
                </div>
              </>
            )}
            
            <button onClick={() => triggerCelebration(celebForm)} className="w-full py-3 mt-4 bg-indigo-100 text-indigo-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-200 transition-colors cursor-pointer shadow-sm">
              <Play className="w-5 h-5 fill-current" /> Preview Full Blast
            </button>
            <button onClick={handleSaveCeleb} disabled={isSavingCeleb || celebSaved} className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer">
              {isSavingCeleb ? <Loader2 className="w-5 h-5 animate-spin" /> : (celebSaved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />)} 
              {isSavingCeleb ? 'Saving...' : (celebSaved ? 'Effects Saved!' : 'Save Effects')}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
```

### `// src/components/admin/WidgetsTab.jsx`

```javascript
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { MessageSquare, Lightbulb, Trophy, CloudSun, Save, MapPin, Sparkles, Search, CheckCircle2 } from 'lucide-react';
import MessageTab from './MessageTab';
import FactsTab from './FactsTab';

function LeaderboardSettings() {
  const [config, setConfig] = useState({
    enabledTimeframes: ['daily', 'weekly', 'yearly', 'lifetime'],
    defaultTimeframe: 'daily',
    autoRevertSeconds: 60
  });
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState('idle');

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, 'settings', 'leaderboard');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setConfig(docSnap.data());
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaveState('saving');
    try {
      await setDoc(doc(db, 'settings', 'leaderboard'), config, { merge: true });
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (error) {
      alert(`Failed to save settings: ${error.message}`);
      setSaveState('idle');
    }
  };

  const toggleTimeframe = (tf) => {
    setConfig(prev => {
      const enabled = prev.enabledTimeframes.includes(tf)
        ? prev.enabledTimeframes.filter(t => t !== tf)
        : [...prev.enabledTimeframes, tf];
      
      let newDefault = prev.defaultTimeframe;
      if (!enabled.includes(newDefault) && enabled.length > 0) {
        newDefault = enabled[0];
      }
      return { ...prev, enabledTimeframes: enabled, defaultTimeframe: newDefault };
    });
  };

  if (loading) return <div className="p-4 animate-pulse">Loading settings...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <Trophy className="text-indigo-600" /> Leaderboard Settings
      </h3>
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3">Enabled Leaderboard Views</label>
          <div className="flex flex-wrap gap-4">
            {['daily', 'weekly', 'monthly', 'yearly', 'lifetime'].map(tf => (
              <label key={tf} className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
                <input 
                  type="checkbox" 
                  checked={config.enabledTimeframes.includes(tf)}
                  onChange={() => toggleTimeframe(tf)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="capitalize font-semibold text-slate-700">{tf}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Default View</label>
          <select 
            value={config.defaultTimeframe}
            onChange={(e) => setConfig({...config, defaultTimeframe: e.target.value})}
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 capitalize focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {config.enabledTimeframes.map(tf => (
              <option key={tf} value={tf} className="capitalize">{tf}</option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-2">This is the view it will automatically revert back to.</p>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Auto-Revert Timer (Seconds)</label>
          <input 
            type="number" 
            min="10"
            max="300"
            value={config.autoRevertSeconds}
            onChange={(e) => setConfig({...config, autoRevertSeconds: Number(e.target.value)})}
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saveState !== 'idle'}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm cursor-pointer ${
              saveState === 'saved' ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            } disabled:opacity-80`}
          >
            {saveState === 'saving' && 'Saving...'}
            {saveState === 'saved' && <><CheckCircle2 className="w-5 h-5" /> Saved!</>}
            {saveState === 'idle' && <><Save className="w-5 h-5" /> Save Settings</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function WeatherSettings() {
  const [config, setConfig] = useState({
    city: 'Whitby, ON',
    lat: 43.8975,
    lon: -78.9429,
    units: 'celsius',
    displayMode: 'daily', // Keep for backend safety but remove from UI
    kidFriendly: true
  });
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState('idle');

  const [citySearch, setCitySearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, 'settings', 'weather');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setConfig(docSnap.data());
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSearchCity = async (e) => {
    e.preventDefault();
    if (!citySearch.trim()) return;
    setIsSearching(true);
    
    const cleanSearchTerm = citySearch.split(',')[0].trim();
    
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanSearchTerm)}&count=10&language=en&format=json`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error("Geocoding failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const selectCity = (city) => {
    const stateOrCountry = city.admin1 || city.country || '';
    setConfig({
      ...config,
      city: `${city.name}${stateOrCountry ? `, ${stateOrCountry}` : ''}`,
      lat: Number(city.latitude.toFixed(4)),
      lon: Number(city.longitude.toFixed(4))
    });
    setSearchResults([]);
    setCitySearch('');
  };

  const handleSave = async () => {
    setSaveState('saving');
    try {
      await setDoc(doc(db, 'settings', 'weather'), config, { merge: true });
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (error) {
      alert(`Failed to save settings: ${error.message}`);
      setSaveState('idle');
    }
  };

  if (loading) return <div className="p-4 animate-pulse">Loading settings...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <CloudSun className="text-indigo-600" /> Weather Settings
      </h3>
      
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Location Block */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" /> Set Location
          </h4>
          
          <form onSubmit={handleSearchCity} className="flex gap-2 mb-4 relative">
            <input 
              type="text" 
              placeholder="Search for a city (e.g. Whitby)..."
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              className="flex-1 p-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-indigo-500"
            />
            <button type="submit" disabled={isSearching} className="bg-indigo-600 text-white px-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer">
              <Search className="w-4 h-4" /> {isSearching ? '...' : 'Search'}
            </button>
            
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-20 max-h-64 overflow-y-auto">
                {searchResults.map((result) => (
                  <div 
                    key={result.id} 
                    onClick={() => selectCity(result)}
                    className="p-3 hover:bg-indigo-50 cursor-pointer border-b border-slate-100 last:border-0"
                  >
                    <div className="font-bold text-slate-800">{result.name}</div>
                    <div className="text-xs text-slate-500">{result.admin1 ? `${result.admin1}, ` : ''}{result.country}</div>
                  </div>
                ))}
              </div>
            )}
          </form>

          <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 flex justify-between items-center">
            <div>
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Current Widget Location</div>
              <div className="font-bold text-indigo-900 text-lg">{config.city}</div>
            </div>
            <div className="text-right text-xs text-slate-400 font-mono">
              <div>Lat: {config.lat}</div>
              <div>Lon: {config.lon}</div>
            </div>
          </div>
        </div>

        {/* Removed Display Mode Dropdown here per request */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Temperature Units</label>
          <select 
            value={config.units}
            onChange={(e) => setConfig({...config, units: e.target.value})}
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="celsius">Celsius (°C)</option>
            <option value="fahrenheit">Fahrenheit (°F)</option>
          </select>
        </div>

        {/* Kid Friendly Toggle */}
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-amber-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Kid-Friendly Smart Advice
            </h4>
            <p className="text-xs text-amber-700 mt-1">Shows bold, helpful hints (like 🧥 for cold, ☂️ for rain) right on the widget.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={config.kidFriendly}
              onChange={(e) => setConfig({...config, kidFriendly: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saveState !== 'idle'}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm cursor-pointer ${
              saveState === 'saved' ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            } disabled:opacity-80`}
          >
            {saveState === 'saving' && 'Saving...'}
            {saveState === 'saved' && <><CheckCircle2 className="w-5 h-5" /> Saved!</>}
            {saveState === 'idle' && <><Save className="w-5 h-5" /> Save Settings</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WidgetsTab() {
  const [activeSubTab, setActiveSubTab] = useState('leaderboard');

  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl shrink-0 overflow-x-auto hide-scrollbar">
        <SubTabButton active={activeSubTab === 'leaderboard'} onClick={() => setActiveSubTab('leaderboard')} icon={<Trophy className="w-4 h-4"/>} label="Leaderboard" />
        <SubTabButton active={activeSubTab === 'messages'} onClick={() => setActiveSubTab('messages')} icon={<MessageSquare className="w-4 h-4"/>} label="Message Centre" />
        <SubTabButton active={activeSubTab === 'facts'} onClick={() => setActiveSubTab('facts')} icon={<Lightbulb className="w-4 h-4"/>} label="Facts & Jokes" />
        <SubTabButton active={activeSubTab === 'weather'} onClick={() => setActiveSubTab('weather')} icon={<CloudSun className="w-4 h-4"/>} label="Weather" />
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {activeSubTab === 'leaderboard' && <LeaderboardSettings />}
        {activeSubTab === 'messages' && <MessageTab />}
        {activeSubTab === 'facts' && <FactsTab />}
        {activeSubTab === 'weather' && <WeatherSettings />}
      </div>
    </div>
  );
}

function SubTabButton({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick} 
      className={`flex-1 flex min-w-max items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold text-sm transition-all cursor-pointer ${
        active ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
      }`}
    >
      {icon}{label}
    </button>
  );
}
```

### `// src/components/calendar/CalendarGrid.jsx`

```javascript
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { useEvents } from '../../hooks/useEvents';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';
import { HOLIDAYS_DATA } from '../../utils/holidays';
import EventModal from './EventModal';
import DayViewModal from './DayViewModal';

export default function CalendarGrid() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // FIX: Track the real today string to force re-renders at midnight
  const [realTodayStr, setRealTodayStr] = useState(new Date().toDateString());

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDayViewOpen, setIsDayViewOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayViewDate, setDayViewDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  
  const { events, loading: eventsLoading, deleteEvent, deleteEventGroup } = useEvents();
  const { members, loading: membersLoading } = useFamilyMembers();

  // Midnight tick observer
  useEffect(() => {
    const interval = setInterval(() => {
      const current = new Date().toDateString();
      if (current !== realTodayStr) {
        setRealTodayStr(current);
        // If the user hasn't explicitly navigated away, auto-flip to the new month if the day crosses a month boundary
        const now = new Date();
        if (currentDate.getMonth() === now.getMonth() - 1 || currentDate.getMonth() === now.getMonth() + 11) {
            setCurrentDate(now);
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [realTodayStr, currentDate]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const startingDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const isCurrentMonth = new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();

  const getEventsForDate = (dateString) => {
    const calendarEvents = events.filter(e => e.date === dateString);
    const holidayEvents = HOLIDAYS_DATA.filter(h => h.date === dateString);
    return [...holidayEvents, ...calendarEvents];
  };

  const getEventBackground = (event) => {
    if (!event.member || !members.length) return '#cbd5e1'; 
    const memberIds = Array.isArray(event.member) ? event.member : [event.member];
    if (memberIds.includes('family')) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    if (memberIds.includes('misc')) return 'transparent';
    if (memberIds.length === 1) {
      const member = members.find(m => m.id === memberIds[0]);
      return member ? member.color : '#cbd5e1';
    }
    const colors = memberIds.filter(id => id !== 'family' && id !== 'misc').map(id => members.find(m => m.id === id)?.color || '#cbd5e1');
    if (colors.length > 0) return `linear-gradient(90deg, ${colors.join(', ')})`;
    return '#cbd5e1';
  };

  const handleDayClick = (dateObj) => { setDayViewDate(dateObj); setIsDayViewOpen(true); };
  const handleEditEventFromDayView = (event) => { setSelectedDate(null); setEditingEvent(event); setIsDayViewOpen(false); setIsEventModalOpen(true); };
  const handleAddEventFromDayView = (date) => { setSelectedDate(date); setEditingEvent(null); setIsDayViewOpen(false); setIsEventModalOpen(true); };
  const handleDeleteEventFromDayView = (eventId, title) => { if (window.confirm(`Delete "${title}"?`)) deleteEvent(eventId); };
  const handleDeleteGroupFromDayView = (groupId, title) => { if (window.confirm(`This is a multi-day event. This will delete ALL days for "${title}". Are you sure?`)) deleteEventGroup(groupId); };

  const handleFabClick = () => { setSelectedDate(new Date()); setEditingEvent(null); setIsEventModalOpen(true); };

  return (
    <>
      <div 
        className="flex flex-col rounded-2xl p-4 md:p-6 shadow-lg h-full min-h-0 relative transition-all duration-300"
        style={{ 
          backgroundColor: 'var(--glass-panel-bg)', 
          backdropFilter: 'var(--glass-panel-blur)', 
          WebkitBackdropFilter: 'var(--glass-panel-blur)' 
        }}
      >
        
        {/* Header Controls */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth} className="p-2 bg-white/20 hover:bg-white/40 rounded-xl transition-colors font-bold flex items-center justify-center" style={{ color: 'var(--theme-font-color)' }}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--theme-font-color)' }}>{monthName}</h2>
            <div className="h-6 mt-1 flex items-center justify-center">
              {!isCurrentMonth && (
                <button onClick={goToToday} className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-white/50 hover:bg-white/80 px-3 py-1 rounded-full transition-colors animate-in fade-in zoom-in duration-300">
                  <CalendarIcon className="w-3 h-3" /> Back to Today
                </button>
              )}
            </div>
          </div>

          <button onClick={nextMonth} className="p-2 bg-white/20 hover:bg-white/40 rounded-xl transition-colors font-bold flex items-center justify-center" style={{ color: 'var(--theme-font-color)' }}>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-7 text-center font-bold text-xs md:text-sm mb-2 shrink-0" style={{ color: 'var(--theme-font-color)', opacity: 0.8 }}>
          <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
        </div>

        <div className="grid grid-cols-7 gap-0.5 md:gap-1 flex-1 auto-rows-fr min-h-0">
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="rounded-xl border-2 border-transparent bg-white/5"></div>
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dateString = dateObj.toDateString();
            
            // FIX: Rely on the dynamically updating realTodayStr
            const isToday = dateString === realTodayStr;

            const dayEvents = getEventsForDate(dateString);

            return (
              <div 
                key={day} 
                onClick={() => handleDayClick(dateObj)}
                className={`relative flex flex-col p-1 md:p-2 rounded-xl border transition-colors cursor-pointer overflow-hidden ${
                  isToday 
                    ? 'bg-amber-50/90 border-amber-300 shadow-sm ring-2 ring-amber-100 ring-offset-1' 
                    : 'bg-white/20 border-white/30 hover:border-white/60 hover:bg-white/40'
                }`}
              >
                <span className={`text-xs md:text-sm font-bold w-fit ${
                  isToday ? 'text-amber-800 bg-amber-200 px-2 py-0.5 rounded-md shadow-sm' : 'px-1'
                }`} style={{ color: isToday ? '' : 'var(--theme-font-color)' }}>
                  {day}
                </span>
                
                <div className="flex-1 mt-1 overflow-y-auto hide-scrollbar flex flex-col gap-1">
                  {!eventsLoading && !membersLoading && dayEvents.map(event => {
                    const isMisc = Array.isArray(event.member) && event.member.includes('misc');
                    return (
                      <div 
                        key={event.id} 
                        onClick={(e) => { e.stopPropagation(); handleDayClick(dateObj); }}
                        className={`max-w-full overflow-hidden text-[10px] md:text-xs px-1.5 py-0.5 rounded text-white truncate font-medium shadow-sm transition-transform hover:scale-105 cursor-pointer`}
                        style={{ background: getEventBackground(event), color: isMisc ? '#475569' : 'white', border: isMisc ? '1px solid #cbd5e1' : 'none' }}
                        title={event.title}
                      >
                        {event.time && <span className="opacity-80 mr-1">{event.time}</span>}
                        {event.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={handleFabClick} className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform z-40">
        <Plus className="w-8 h-8" />
      </button>

      <EventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} selectedDate={selectedDate} existingEvent={editingEvent} members={members} />
      <DayViewModal isOpen={isDayViewOpen} onClose={() => setIsDayViewOpen(false)} date={dayViewDate} events={dayViewDate ? getEventsForDate(dayViewDate.toDateString()) : []} members={members} onAddEvent={handleAddEventFromDayView} onEditEvent={handleEditEventFromDayView} onDeleteEvent={handleDeleteEventFromDayView} onDeleteEventGroup={handleDeleteGroupFromDayView} />
    </>
  );
}
```

### `// src/components/calendar/DayViewModal.jsx`

```javascript
import { X, Plus, Edit2, Trash2 } from 'lucide-react';

export default function DayViewModal({ 
  isOpen, 
  onClose, 
  date, 
  events, 
  members, 
  onAddEvent, 
  onEditEvent, 
  onDeleteEvent,
  onDeleteEventGroup
}) {
  if (!isOpen || !date) return null;

  const dateString = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{dateString}</h2>
            <p className="text-slate-500 font-medium text-sm">{events.length} Events Scheduled</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Events List */}
        <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-3 hide-scrollbar">
          {events.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">Nothing scheduled for today!</p>
            </div>
          ) : (
            events.map(event => {
              const isMisc = Array.isArray(event.member) && event.member.includes('misc');
              let bgColor = '#cbd5e1'; // slate-300 default
              
              if (event.member?.includes('family')) {
                bgColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
              } else if (isMisc) {
                bgColor = '#f8fafc';
              } else if (event.member?.length === 1) {
                const member = members.find(m => m.id === event.member[0]);
                if (member) bgColor = member.color;
              } else if (event.member?.length > 1) {
                const colors = event.member
                  .filter(id => id !== 'family' && id !== 'misc')
                  .map(id => members.find(m => m.id === id)?.color || '#cbd5e1');
                if (colors.length > 0) bgColor = `linear-gradient(90deg, ${colors.join(', ')})`;
              }

              return (
                <div 
                  key={event.id} 
                  className={`p-4 rounded-2xl border-2 flex flex-col gap-2 transition-all hover:shadow-md ${isMisc ? 'border-slate-200' : 'border-transparent text-white'}`}
                  style={{ background: bgColor, color: isMisc ? '#334155' : 'white' }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <h4 className="font-bold text-lg leading-tight">{event.title}</h4>
                      {event.time && (
                        <span className="text-sm font-semibold opacity-90 flex items-center gap-1 mt-1">
                          🕒 {event.time} {event.endTime ? `- ${event.endTime}` : ''}
                        </span>
                      )}
                    </div>
                    
                    {/* Action Buttons (Hide for generated holidays) */}
                    {!event.isHoliday && (
                      <div className="flex gap-1 shrink-0 ml-4 bg-white/20 p-1 rounded-xl backdrop-blur-sm">
                        <button 
                          onClick={() => onEditEvent(event)} 
                          className="p-1.5 hover:bg-white/30 rounded-lg transition-colors"
                          title="Edit Event"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        
                        {event.isMultiDay ? (
                          <button 
                            onClick={() => onDeleteEventGroup(event.groupId, event.title)} 
                            className="p-1.5 hover:bg-red-500/80 rounded-lg transition-colors"
                            title="Delete Entire Multi-Day Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => onDeleteEvent(event.id, event.title)} 
                            className="p-1.5 hover:bg-red-500/80 rounded-lg transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Render the Rich Text Description */}
                  {event.description && event.description !== '<p><br></p>' && (
                    <div 
                      className={`mt-2 text-sm opacity-90 border-t pt-2 ${isMisc ? 'border-slate-200' : 'border-white/20'} [&>ul]:list-disc [&>ul]:ml-4 [&>ol]:list-decimal [&>ol]:ml-4`}
                      dangerouslySetInnerHTML={{ __html: event.description }}
                    />
                  )}
                  
                  {/* Assigned Members Bubbles */}
                  {Array.isArray(event.member) && event.member.length > 0 && !event.member.includes('family') && !isMisc && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {event.member.map(memberId => {
                        const m = members.find(x => x.id === memberId);
                        if (!m) return null;
                        return (
                          <span key={memberId} className="text-[10px] uppercase tracking-wider font-bold bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm">
                            {m.name}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Add Button */}
        <div className="pt-4 border-t border-slate-100 shrink-0">
          <button 
            onClick={() => onAddEvent(date)}
            className="w-full py-3.5 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add New Event Here
          </button>
        </div>

      </div>
    </div>
  );
}
```

### `// src/components/calendar/EventModal.jsx`

```javascript
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { collection, doc, writeBatch, getDocs, query, where } from 'firebase/firestore';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { db } from '../../config/firebase';

export default function EventModal({ isOpen, onClose, selectedDate, existingEvent, members }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    endDate: '',
    time: '',
    endTime: '',
    member: []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toISODate = (dateObj) => {
    if (!dateObj) return '';
    const d = new Date(dateObj);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isOpen) {
      if (existingEvent) {
        const rawStart = existingEvent.isMultiDay && existingEvent.startDate ? existingEvent.startDate : existingEvent.date;
        const rawEnd = existingEvent.isMultiDay && existingEvent.endDate ? existingEvent.endDate : '';
        
        setFormData({
          title: existingEvent.title || '',
          description: existingEvent.description || '',
          date: toISODate(rawStart),
          endDate: rawEnd ? toISODate(rawEnd) : '',
          time: existingEvent.time || '',
          endTime: existingEvent.endTime || '',
          member: Array.isArray(existingEvent.member) ? existingEvent.member : [existingEvent.member]
        });
      } else {
        setFormData({
          title: '',
          description: '',
          date: toISODate(selectedDate || new Date()),
          endDate: '',
          time: '',
          endTime: '',
          member: []
        });
      }
    }
  }, [isOpen, existingEvent, selectedDate]);

  if (!isOpen) return null;

  const handleMemberToggle = (id) => {
    setFormData(prev => {
      const newMembers = prev.member.includes(id)
        ? prev.member.filter(m => m !== id)
        : [...prev.member, id];
      return { ...prev, member: newMembers };
    });
  };

const handleSave = async () => {
    if (!formData.title || !formData.date || formData.member.length === 0) return;
    setIsSaving(true);

    try {
      const startDate = new Date(formData.date + 'T00:00:00');
      let endDate = formData.endDate ? new Date(formData.endDate + 'T00:00:00') : startDate;
      // Guard against end date being earlier than start date
      if (endDate < startDate) endDate = startDate;
      
      const isMultiDay = startDate.getTime() !== endDate.getTime();
      
      const batch = writeBatch(db);
      const eventsRef = collection(db, 'calendarEvents');

      if (existingEvent) {
        if (existingEvent.groupId) {
          const q = query(eventsRef, where('groupId', '==', existingEvent.groupId));
          const snap = await getDocs(q);
          snap.forEach(d => batch.delete(d.ref));
        } else {
          batch.delete(doc(db, 'calendarEvents', existingEvent.id));
        }
      }

      const groupId = existingEvent?.groupId || Date.now().toString();
      const iterDate = new Date(startDate);
      
      while (iterDate <= endDate) {
        const newDocRef = doc(eventsRef);
        batch.set(newDocRef, {
          groupId,
          title: formData.title,
          description: formData.description || '',
          date: iterDate.toDateString(),
          member: formData.member,
          time: formData.time,
          endTime: formData.endTime,
          isMultiDay,
          startDate: startDate.toDateString(),
          endDate: endDate.toDateString()
        });
        iterDate.setDate(iterDate.getDate() + 1);
      }

      await batch.commit();
      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event. Check connection.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    let confirmMsg = `Delete "${existingEvent.title}"?`;
    if (existingEvent.isMultiDay && existingEvent.groupId) {
      confirmMsg = `This is a multi-day event. This will delete ALL days for "${existingEvent.title}". Are you sure?`;
    }

    if (!window.confirm(confirmMsg)) return;
    
    setIsDeleting(true);
    try {
      const batch = writeBatch(db);
      const eventsRef = collection(db, 'calendarEvents');
      
      if (existingEvent.groupId) {
        const q = query(eventsRef, where('groupId', '==', existingEvent.groupId));
        const snap = await getDocs(q);
        snap.forEach(d => batch.delete(d.ref));
      } else {
        batch.delete(doc(db, 'calendarEvents', existingEvent.id));
      }

      await batch.commit();
      onClose();
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete. Check connection.");
    } finally {
      setIsDeleting(false);
    }
  };

  const isFormValid = formData.title && formData.date && formData.member.length > 0;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-lg rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {existingEvent ? '✏️ Edit Event' : '➕ Add Event'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Title Input */}
        <div className="mb-4">
          <input 
            type="text" 
            placeholder="Event Title" 
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            maxLength={40}
            className={`w-full p-3 text-lg rounded-xl border-2 focus:outline-none transition-colors ${
              formData.title.length >= 36 ? 'border-amber-400 focus:border-amber-500' : 'border-slate-200 focus:border-indigo-500'
            }`}
          />
          <div className="text-right text-xs mt-1 font-semibold text-slate-400">
            {formData.title.length}/40
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Start Date</label>
            <input 
              type="date" 
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">End Date (Optional)</label>
            <input 
              type="date" 
              value={formData.endDate}
              onChange={e => setFormData({ ...formData, endDate: e.target.value })}
              min={formData.date}
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Times */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Start Time (Optional)</label>
            <input 
              type="time" 
              value={formData.time}
              onChange={e => setFormData({ ...formData, time: e.target.value })}
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">End Time (Optional)</label>
            <input 
              type="time" 
              value={formData.endTime}
              onChange={e => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* BULLETPROOF WYSIWYG EDITOR */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-500 mb-1">Event Description & Notes</label>
          <div className="bg-white rounded-xl border-2 border-slate-200 focus-within:border-indigo-500 transition-colors">
            <ReactQuill 
              theme="snow" 
              value={formData.description || ''} 
              onChange={(content) => setFormData({ ...formData, description: content })}
              style={{ minHeight: '120px' }}
            />
          </div>
        </div>

        {/* Member Assignment */}
        <label className="block text-sm font-bold text-slate-700 mb-3">Assign To:</label>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button 
            onClick={() => handleMemberToggle('family')}
            className={`p-3 rounded-xl font-bold flex items-center gap-2 border-2 transition-all ${
              formData.member.includes('family') 
                ? 'bg-linear-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-md' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
            }`}
          >
            {formData.member.includes('family') ? '☑' : '☐'} Family
          </button>
          
          <button 
            onClick={() => handleMemberToggle('misc')}
            className={`p-3 rounded-xl font-bold flex items-center gap-2 border-2 transition-all ${
              formData.member.includes('misc') 
                ? 'bg-slate-200 text-slate-700 border-slate-300 shadow-inner' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {formData.member.includes('misc') ? '☑' : '☐'} Misc
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {members.map(m => {
            const isSelected = formData.member.includes(m.id);
            return (
              <button 
                key={m.id}
                onClick={() => handleMemberToggle(m.id)}
                className="p-3 rounded-xl font-bold flex items-center gap-2 border-2 transition-all"
                style={{
                  backgroundColor: isSelected ? m.color : 'white',
                  borderColor: isSelected ? m.color : '#e2e8f0',
                  color: isSelected ? 'white' : '#475569'
                }}
              >
                {isSelected ? '☑' : '☐'} {m.name}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-auto">
          <button 
            onClick={handleSave}
            disabled={!isFormValid || isSaving}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              !isFormValid 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : existingEvent 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg' 
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {isSaving ? 'Saving...' : existingEvent ? 'Update Event' : 'Save Event'}
          </button>

          {existingEvent && (
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full py-3 rounded-xl font-bold text-red-500 bg-red-50 border-2 border-red-100 hover:bg-red-100 transition-colors"
            >
              {isDeleting ? 'Deleting...' : '🗑 Delete Event'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

### `// src/components/chores/ChoresPanel.jsx`

```javascript
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Circle, Plus, X } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useChores } from '../../hooks/useChores';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';
import { useDailyCompletions } from '../../hooks/useDailyCompletions';
import { useCelebration } from '../../hooks/useCelebration';
import { useCustody } from '../../hooks/useCustody';
import { useKiosk } from '../../hooks/useKiosk';
import { useAdminPin } from '../../hooks/useAdminPin';
import { playAudio, preloadMedia } from '../../utils/audioPlayer';

export default function ChoresPanel() {
  const adminPin = useAdminPin();
  const { chores, loading: choresLoading } = useChores();
  const { members, loading: membersLoading } = useFamilyMembers();
  const { completions, loading: compsLoading, toggleCompletion } = useDailyCompletions();
  
  const { settings: globalCeleb, triggerCelebration } = useCelebration();
  const { isHereToday } = useCustody();
  const { isMuted } = useKiosk();
  
  const [claimingChore, setClaimingChore] = useState(null);
  const [celebratingKid, setCelebratingKid] = useState(null);
  const [quickAddState, setQuickAddState] = useState('hidden'); 
  const [pinInput, setPinInput] = useState('');
  const [quickAddForm, setQuickAddForm] = useState({ name: '', points: 10, assignedTo: 'unassigned' });

  // Intelligent Background Caching
  // Only downloads files that are actively assigned to kids or the global celebration
  useEffect(() => {
    // 1. Cache Global Celebration
    if (globalCeleb?.type === 'video' && globalCeleb?.videoUrl) preloadMedia(globalCeleb.videoUrl);
    if (globalCeleb?.type === 'particles' && globalCeleb?.soundUrl) preloadMedia(globalCeleb.soundUrl);

    // 2. Cache Kid Specific Sounds & Celebrations
    members.forEach(m => {
      if (m.signatureSound) preloadMedia(m.signatureSound);
      if (m.customCelebration?.enabled) {
        if (m.customCelebration.type === 'video' && m.customCelebration.videoUrl) preloadMedia(m.customCelebration.videoUrl);
        if (m.customCelebration.type === 'particles' && m.customCelebration.soundUrl) preloadMedia(m.customCelebration.soundUrl);
      }
    });
  }, [members, globalCeleb]);

  if (choresLoading || membersLoading || compsLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg flex-1 flex items-center justify-center shrink-0 min-h-[200px]">
        <span className="text-slate-400 font-medium animate-pulse">Loading today's chores...</span>
      </div>
    );
  }

  const isChoreScheduledForToday = (chore, today = new Date()) => {
    if (chore.isArchived) return false;
    const targetDay = today.getDay();
    const freq = chore.frequency || 'daily';

    if (freq === 'today-only') return chore.createdDate === today.toDateString();
    if (freq === 'daily') return true;
    if (freq === 'weekly') {
      if (chore.days && chore.days.length > 0) return chore.days.includes(targetDay);
      if (chore.weekDay !== null && chore.weekDay !== undefined) return chore.weekDay === targetDay;
      return false;
    }
    if (freq === 'bi-weekly' && chore.days && chore.days.length > 0 && chore.startDate) {
      if (!chore.days.includes(targetDay)) return false;
      const start = new Date(chore.startDate + 'T00:00:00');
      start.setHours(0, 0, 0, 0);
      const startSun = new Date(start);
      startSun.setDate(startSun.getDate() - startSun.getDay());
      const targetSun = new Date(today);
      targetSun.setHours(0, 0, 0, 0);
      targetSun.setDate(targetSun.getDate() - targetSun.getDay());
      const daysDiff = Math.round((targetSun - startSun) / (24 * 60 * 60 * 1000));
      return Math.floor(daysDiff / 7) % 2 === 0;
    }
    return true;
  };

  const kids = members.filter(m => m.participatesInChores && isHereToday(m));
  const todayActiveChores = chores.filter(c => isChoreScheduledForToday(c));
  const assignedChores = todayActiveChores.filter(c => c.assignedTo && c.assignedTo !== 'unassigned');
  const bonusChores = todayActiveChores.filter(c => !c.assignedTo || c.assignedTo === 'unassigned');

  const handleChoreClick = (chore) => {
    const isDone = Boolean(completions[chore.id]);
    if (!isDone && (chore.assignedTo === 'unassigned' || !chore.assignedTo)) {
      setClaimingChore(chore);
      return;
    }
    if (isDone && (chore.assignedTo === 'unassigned' || !chore.assignedTo)) {
      const claimerId = completions[`${chore.id}_claimer`];
      if (claimerId) toggleCompletion(chore, claimerId, true);
      return;
    }
    toggleCompletion(chore, chore.assignedTo, isDone);

    if (!isDone && chore.assignedTo) {
      const member = members.find(m => m.id === chore.assignedTo);
      
      if (!isMuted && member?.signatureSound) {
        playAudio(member.signatureSound);
      }
      
      const kidChores = assignedChores.filter(c => c.assignedTo === chore.assignedTo);
      const allDone = kidChores.every(c => c.id === chore.id ? true : completions[c.id]);
      
      if (allDone && kidChores.length > 0) {
        const celebConfig = member?.customCelebration?.enabled ? member.customCelebration : null;
        triggerCelebration(celebConfig);
        
        if (member) {
          setCelebratingKid({ ...member, points: Number(member.points || 0) + Number(chore.points || 0) });
          setTimeout(() => setCelebratingKid(null), 15000);
        }
      }
    }
  };

  const handleClaimBonus = (kidId) => {
    toggleCompletion(claimingChore, kidId, false);
    triggerCelebration({ layers: [{ type: 'fireworks', colors: ['#FFD700', '#FFA500'], scale: 1, intensity: 0.5 }], duration: 2, soundUrl: '' });
    setClaimingChore(null);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === adminPin) {
      setQuickAddState('form');
      setPinInput('');
    } else {
      alert('Incorrect PIN');
      setPinInput('');
    }
  };

  const handleSaveQuickAdd = async (e) => {
    e.preventDefault();
    if (!quickAddForm.name) return;
    try {
      const choreId = Date.now().toString();
      await setDoc(doc(db, 'chores', choreId), {
        name: quickAddForm.name,
        points: Number(quickAddForm.points),
        assignedTo: quickAddForm.assignedTo,
        frequency: 'today-only',
        createdDate: new Date().toDateString(),
        todayOnly: true
      });
      setQuickAddState('hidden');
      setQuickAddForm({ name: '', points: 10, assignedTo: 'unassigned' });
    } catch (error) {
      alert("Failed to add chore.");
    }
  };

  const renderChore = (chore) => {
    const isDone = Boolean(completions[chore.id]);
    const claimerId = completions[`${chore.id}_claimer`];
    const claimer = claimerId ? members.find(m => m.id === claimerId) : null;
    return (
      <div key={chore.id} onClick={() => handleChoreClick(chore)} className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${isDone ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50 border-slate-100 hover:border-indigo-200 hover:bg-white'}`}>
        <div className="flex items-center gap-3">
          {isDone ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> : <Circle className="w-5 h-5 text-slate-300 shrink-0" />}
          <div>
            <div className={`font-semibold text-sm transition-colors flex items-center gap-2 ${isDone ? 'text-emerald-700 line-through opacity-70' : 'text-slate-700'}`}>
              {chore.name}
              {chore.frequency === 'today-only' && <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-md uppercase tracking-wider no-underline">Today Only</span>}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {chore.assignedTo === 'unassigned' || !chore.assignedTo ? (isDone && claimer ? `Claimed by ${claimer.name}` : '⭐ Bonus (Anyone)') : members.find(m => m.id === chore.assignedTo)?.name}
            </div>
          </div>
        </div>
        <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded-lg text-sm font-bold shrink-0">{Number(chore.points) || 0}</div>
      </div>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg relative flex flex-col shrink-0">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><span>📋</span> Today's Chores</h2>
        <button onClick={() => setQuickAddState('pin')} className="p-1.5 bg-slate-100 hover:bg-indigo-100 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer" title="Quick Add Chore (Admin)"><Plus className="w-5 h-5" /></button>
      </div>
      
      <div className="flex flex-col gap-5">
        {kids.map(kid => {
          const kidChores = assignedChores.filter(c => c.assignedTo === kid.id);
          if (kidChores.length === 0) return null;
          return (
            <div key={kid.id}>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-2 border-b-2 pb-1" style={{ color: kid.color, borderColor: `${kid.color}33` }}>{kid.name}'s Chores</h3>
              <div className="flex flex-col gap-2">{kidChores.map(renderChore)}</div>
            </div>
          );
        })}
        {bonusChores.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 border-b-2 pb-1 text-amber-500 border-amber-200">⭐ Bonus Chores</h3>
            <div className="flex flex-col gap-2">{bonusChores.map(renderChore)}</div>
          </div>
        )}
        {todayActiveChores.length === 0 && <div className="text-center text-slate-400 py-8 font-medium">No chores scheduled for today! 🎉</div>}
      </div>

      {claimingChore && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl z-10 flex flex-col items-center justify-center p-4 text-center">
          <h3 className="text-xl font-bold text-slate-800 mb-1">Who did this?</h3>
          <p className="text-sm text-slate-500 mb-4 font-medium">{claimingChore.name}</p>
          <div className="grid grid-cols-2 gap-3 w-full max-w-[250px]">
            {kids.map(kid => (
              <button key={kid.id} onClick={() => handleClaimBonus(kid.id)} className="py-3 px-2 rounded-xl font-bold text-white shadow-sm transition-transform hover:scale-105 cursor-pointer" style={{ backgroundColor: kid.color }}>{kid.name}</button>
            ))}
          </div>
          <button onClick={() => setClaimingChore(null)} className="mt-4 text-sm font-bold text-slate-400 hover:text-slate-600 cursor-pointer">Cancel</button>
        </div>
      )}

      {quickAddState !== 'hidden' && createPortal(
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[1100] flex items-center justify-center p-4 transition-opacity" onClick={() => setQuickAddState('hidden')}>
          {quickAddState === 'pin' && (
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">🔒 Admin PIN</h3>
              <p className="text-slate-500 mb-6 text-sm">Required to add a chore</p>
              <form onSubmit={handlePinSubmit}>
                <input type="password" value={pinInput} onChange={(e) => setPinInput(e.target.value)} maxLength={8} autoFocus className="w-full text-center text-3xl tracking-[1em] font-bold p-4 border-2 border-slate-200 rounded-xl mb-4 focus:border-indigo-500 focus:outline-none transition-colors" placeholder="••••" />
                <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md cursor-pointer">Unlock</button>
              </form>
            </div>
          )}

          {quickAddState === 'form' && (
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-500" /> Quick Add Chore
                </h3>
                <button onClick={() => setQuickAddState('hidden')} className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSaveQuickAdd} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Chore Name</label>
                  <input required type="text" value={quickAddForm.name} onChange={e => setQuickAddForm({...quickAddForm, name: e.target.value})} className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white font-semibold focus:outline-none focus:border-indigo-500" placeholder="e.g. Rake Leaves" autoFocus />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Points</label>
                    <input required type="number" min="0" value={quickAddForm.points} onChange={e => setQuickAddForm({...quickAddForm, points: e.target.value})} className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white font-semibold focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assign To</label>
                    <select value={quickAddForm.assignedTo} onChange={e => setQuickAddForm({...quickAddForm, assignedTo: e.target.value})} className="w-full p-3 border-2 border-slate-200 rounded-xl bg-white font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer">
                      <option value="unassigned">⭐ Bonus / Anyone</option>
                      {kids.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex justify-between">
                    Frequency
                    <span className="text-[10px] text-indigo-500">Changes open Builder</span>
                  </label>
                  <select 
                    value="today-only"
                    onChange={(e) => {
                      const newFreq = e.target.value;
                      if (newFreq !== 'today-only') {
                         sessionStorage.setItem('adminBypass', 'true');
                         sessionStorage.setItem('draftChore', JSON.stringify({ ...quickAddForm, frequency: newFreq }));
                         window.dispatchEvent(new Event('openAdminToChores'));
                         setQuickAddState('hidden');
                         setQuickAddForm({ name: '', points: 10, assignedTo: 'unassigned' });
                      }
                    }}
                    className="w-full p-3 border-2 border-slate-200 rounded-xl bg-indigo-50 text-indigo-700 font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="today-only">📅 Today Only</option>
                    <option value="daily">🔄 Daily</option>
                    <option value="weekly">📅 Weekly</option>
                    <option value="bi-weekly">🗓️ Bi-Weekly</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-md mt-2 cursor-pointer">
                  Add to Today's List
                </button>
              </form>
            </div>
          )}

        </div>,
        document.body
      )}

      {celebratingKid && createPortal(
        <div onClick={() => setCelebratingKid(null)} className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center flex-col gap-6 p-8 cursor-pointer transition-opacity" style={{ zIndex: 100001 }}>
          <div className="text-center animate-bounce-in">
            <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-2xl transition-transform hover:scale-110" style={{ backgroundColor: celebratingKid.color || '#cbd5e1', boxShadow: `0 0 40px ${celebratingKid.color || '#cbd5e1'}` }}>
              {celebratingKid.avatar ? <img src={celebratingKid.avatar} className="w-full h-full object-cover" alt={celebratingKid.name} /> : <span className="text-5xl text-white font-bold">{celebratingKid.name.charAt(0).toUpperCase()}</span>}
            </div>
            <div className="text-2xl font-black text-amber-400 uppercase tracking-widest mb-2 drop-shadow-md">Mission Complete!</div>
            <div className="text-5xl font-black text-white mb-2 tracking-tight" style={{ textShadow: `0 0 30px ${celebratingKid.color || '#cbd5e1'}` }}>{celebratingKid.name}</div>
            <div className="text-xl text-emerald-200 mb-8 font-medium">All chores done for today! 🎉</div>
            <div className="inline-block text-white px-8 py-3 rounded-full text-2xl font-black shadow-xl border-2 border-white/20" style={{ backgroundColor: celebratingKid.color || '#64748b', boxShadow: `0 0 20px ${celebratingKid.color}88` }}>{celebratingKid.points || 0} ⭐ Total</div>
            <div className="mt-8 text-sm text-slate-300 font-medium opacity-70 tracking-widest uppercase">tap anywhere to dismiss</div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
```

### `// src/components/dashboard/DailyContent.jsx`

```javascript
import { useState, useEffect } from 'react';
import { CloudSun, Lightbulb, Star, Smile, ChevronDown, X, Droplets } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useDailyContent } from '../../hooks/useDailyContent';

export default function DailyContent() {
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherConfig, setWeatherConfig] = useState(null);
  
  const [isForecastExpanded, setIsForecastExpanded] = useState(false);
  const [selectedDateString, setSelectedDateString] = useState(null);
  
  const { content, loading: contentLoading } = useDailyContent();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'weather'), (docSnap) => {
      if (docSnap.exists()) {
        setWeatherConfig(docSnap.data());
      } else {
        setWeatherConfig({
          city: 'Whitby, ON',
          lat: 43.8975,
          lon: -78.9429,
          units: 'celsius',
          displayMode: 'daily',
          kidFriendly: true
        });
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!weatherConfig) return;

    const fetchWeather = async () => {
      setWeatherLoading(true);
      try {
        const unitParam = weatherConfig.units === 'fahrenheit' ? '&temperature_unit=fahrenheit' : '';
        
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${weatherConfig.lat}&longitude=${weatherConfig.lon}&current=temperature_2m,weather_code${unitParam}&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=7&timezone=auto&models=gem_seamless`
        );
        const weatherData = await weatherRes.json();
        setWeather(weatherData);
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
      } finally {
        setWeatherLoading(false);
      }
    };
    fetchWeather();
  }, [weatherConfig]);

  const getWeatherEmoji = (code) => {
    if (code === undefined || code === null) return '☁️';
    if (code === 0) return '☀️'; 
    if (code === 1) return '🌤️'; 
    if (code === 2) return '⛅'; 
    if (code === 3) return '☁️'; 
    if (code >= 45 && code <= 48) return '🌫️'; 
    if (code === 51 || code === 53 || code === 61 || code === 80) return '🌦️'; 
    if (code === 55 || code === 63 || code === 65 || code === 81 || code === 82) return '🌧️'; 
    if (code >= 71 && code <= 77) return '❄️'; 
    if (code >= 85 && code <= 86) return '🌨️'; 
    if (code >= 95) return '⛈️'; 
    return '☁️';
  };

  const getKidFriendlyAdvice = (code, temp) => {
    if (!weatherConfig?.kidFriendly || code === undefined || temp === undefined) return null;
    
    const isF = weatherConfig.units === 'fahrenheit';
    const t = isF ? ((temp - 32) * 5/9) : temp; 
    
    const isRain = (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || (code >= 95);
    const isSnow = (code >= 71 && code <= 77) || (code >= 85 && code <= 86);

    if (isSnow) {
      if (t <= -5) return { emoji: '⛄', text: 'Snow & freezing! Full snow gear.' };
      return { emoji: '⛄', text: 'Snow day! Wear boots & mitts.' };
    }
    
    if (isRain) {
      if (t <= 5) return { emoji: '🥶', text: 'Freezing rain! Warm raincoat.' };
      if (t <= 15) return { emoji: '☂️', text: 'Cold & rainy. Raincoat & boots.' };
      return { emoji: '☂️', text: 'Rainy! Time for an umbrella.' };
    }

    if (t <= -5) return { emoji: '🧣', text: 'Freezing! Coat, toque & mitts.' };
    if (t <= 5) return { emoji: '🧥', text: 'Very chilly! Wear a warm coat.' };
    if (t <= 12) return { emoji: '🧥', text: 'Cool out! Bring a light jacket.' };
    if (t <= 18) return { emoji: '👕', text: 'Nice out! Light sweater weather.' };
    if (t <= 24) return { emoji: '🩳', text: 'Warm! T-shirt & shorts weather.' };
    return { emoji: '😎', text: 'Hot! Sunscreen, hat & lots of water!' };
  };

  const formatDay = (isoString) => {
    const d = new Date(`${isoString}T12:00:00`); 
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatHourAmPm = (timeString) => {
    const d = new Date(timeString);
    let hour = d.getHours();
    const ampm = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12;
    hour = hour ? hour : 12; 
    return `${hour}${ampm}`;
  };

  if (weatherLoading || contentLoading || !weatherConfig) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg flex gap-4 min-h-24 animate-pulse">
        <div className="flex-1 bg-slate-100 rounded-xl"></div>
        <div className="flex-1 bg-slate-100 rounded-xl"></div>
      </div>
    );
  }

  let config = { icon: <Lightbulb className="w-4 h-4" />, title: 'Fact of the Day', border: 'border-indigo-400', text: 'text-indigo-400' };
  if (content.type === 'override') {
    config = { icon: <Star className="w-4 h-4" />, title: 'Special Day!', border: 'border-amber-400', text: 'text-amber-500' };
  } else if (content.type === 'joke') {
    config = { icon: <Smile className="w-4 h-4" />, title: 'Joke of the Day', border: 'border-emerald-400', text: 'text-emerald-500' };
  }

  const currentTemp = Math.round(weather?.current?.temperature_2m || 0);
  const todayMax = weather?.daily?.temperature_2m_max?.[0] !== undefined ? Math.round(weather.daily.temperature_2m_max[0]) : '--';
  const todayMin = weather?.daily?.temperature_2m_min?.[0] !== undefined ? Math.round(weather.daily.temperature_2m_min[0]) : '--';
  const todayPop = weather?.daily?.precipitation_probability_max?.[0] || 0;
  
  const tempUnit = weatherConfig.units === 'fahrenheit' ? '°F' : '°C';
  const advice = weather ? getKidFriendlyAdvice(weather?.current?.weather_code, currentTemp) : null;

  const dailyForecast = weather?.daily?.time.slice(1, 7).map((time, i) => ({
    dateString: time,
    label: formatDay(time),
    temp: Math.round(weather.daily.temperature_2m_max[i + 1]),
    code: weather.daily.weather_code[i + 1],
    pop: weather.daily.precipitation_probability_max?.[i + 1] || 0
  })) || [];

  let hourlyForecast = [];
  if (selectedDateString && weather?.hourly) {
    hourlyForecast = weather.hourly.time
      .map((t, idx) => ({
        time: t,
        temp: Math.round(weather.hourly.temperature_2m[idx]),
        code: weather.hourly.weather_code[idx],
        pop: weather.hourly.precipitation_probability?.[idx] || 0
      }))
      .filter(d => d.time.startsWith(selectedDateString))
      .filter(d => [8, 12, 16, 20].includes(new Date(d.time).getHours()));
  }

  return (
    <div className="flex flex-col gap-4">
      {/* WEATHER WIDGET */}
      <div className="bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl p-4 shadow-lg text-white relative overflow-hidden flex flex-col">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header - Inline Layout */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <h3 className="text-sky-100 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <CloudSun className="w-4 h-4" /> Local Weather
            </h3>
            <span className="text-white/30 text-[10px]">•</span>
            <span className="text-[10px] font-bold text-sky-100 uppercase tracking-wide">{weatherConfig.city}</span>
          </div>

          {/* Inline Expand Button with Invisible Padding */}
          {dailyForecast.length > 0 && (
            <button 
              onClick={() => {
                setIsForecastExpanded(!isForecastExpanded);
                if (isForecastExpanded) setSelectedDateString(null);
              }}
              className="p-3 -m-3 focus:outline-none group"
              aria-label="Toggle Forecast"
            >
              <div className="bg-white/10 group-hover:bg-white/20 px-2 py-1 rounded-md flex items-center gap-1.5 transition-colors text-sky-50 text-[10px] font-bold uppercase tracking-wider">
                {weatherConfig.displayMode === 'hourly' ? 'Hours' : '6-Day'}
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isForecastExpanded ? 'rotate-180' : ''}`} />
              </div>
            </button>
          )}
        </div>

        {/* PERFECT HORIZONTAL ALIGNMENT */}
        <div className="relative z-10 flex items-center w-full mt-1">
          
          {/* LEFT: Temp & High/Low */}
          <div className="flex flex-col justify-center shrink-0 w-[90px] md:w-[110px]">
            <div className="text-5xl md:text-6xl font-black tracking-tighter leading-none flex items-start">
              {currentTemp}<span className="text-xl md:text-2xl text-sky-200 font-bold ml-0.5 mt-1">{tempUnit}</span>
            </div>
            <div className="text-[10px] md:text-xs font-bold text-sky-200 mt-1.5 bg-white/10 w-fit px-1.5 py-0.5 rounded-md flex items-center">
              H:{todayMax}° L:{todayMin}°
              {todayPop >= 20 && (
                <span className="flex items-center ml-1 border-l border-sky-200/30 pl-1">
                  <Droplets className="w-2.5 h-2.5 mr-0.5" />{todayPop}%
                </span>
              )}
            </div>
          </div>

          {/* MIDDLE: Weather Emoji */}
          <div className="text-6xl drop-shadow-xl shrink-0 ml-4 md:ml-6 flex items-center justify-center">
            {getWeatherEmoji(weather?.current?.weather_code)}
          </div>

          {/* Vertical Divider & Smart Advice */}
          {advice && (
            <>
              <div className="w-px h-14 bg-white/30 mx-4 md:mx-6 shrink-0"></div>
              
              <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                <div className="text-6xl drop-shadow-md shrink-0">
                  {advice.emoji}
                </div>
                <div className="text-[10px] md:text-xs font-bold leading-tight text-center sm:text-left text-white max-w-[130px]">
                  {advice.text}
                </div>
              </div>
            </>
          )}

        </div>

        {/* EXPANDED FORECAST CONTAINER */}
        {isForecastExpanded && (
          <div className="mt-4 bg-white/10 rounded-xl p-3 overflow-hidden relative z-10 animate-in fade-in slide-in-from-top-2 duration-300">
            {selectedDateString ? (
              /* HOURLY DRILL-DOWN VIEW */
              <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-[10px] font-bold text-sky-100 uppercase tracking-wider">
                    Hourly • {formatDay(selectedDateString)}
                  </span>
                  <button 
                    onClick={() => setSelectedDateString(null)}
                    className="bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
                <div className="flex justify-between w-full px-1">
                  {hourlyForecast.map((data, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center">
                      <span className="text-[10px] text-sky-100 font-bold uppercase">{formatHourAmPm(data.time)}</span>
                      <span className="text-xl md:text-2xl mt-1.5 mb-0.5 drop-shadow-sm">{getWeatherEmoji(data.code)}</span>
                      {/* POP Indicator */}
                      {data.pop >= 20 ? (
                        <span className="text-[9px] font-bold text-sky-200 flex items-center mb-1">
                          <Droplets className="w-2.5 h-2.5 mr-0.5" />{data.pop}%
                        </span>
                      ) : (
                        <span className="h-[14px] mb-1"></span>
                      )}
                      <span className="text-sm font-bold text-white">{data.temp}°</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* DEFAULT 6-DAY VIEW */
              <div className="flex justify-between w-full animate-in fade-in slide-in-from-left-4 duration-300">
                {dailyForecast.map((data, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedDateString(data.dateString)}
                    className="flex flex-col items-center text-center cursor-pointer hover:bg-white/20 p-2 -m-1 rounded-xl transition-colors group flex-1"
                  >
                    <span className="text-[10px] text-sky-100 font-bold uppercase tracking-wider group-hover:text-white transition-colors">{data.label}</span>
                    <span className="text-xl md:text-2xl mt-1.5 mb-0.5 drop-shadow-sm group-hover:scale-110 transition-transform">{getWeatherEmoji(data.code)}</span>
                    {/* POP Indicator */}
                    {data.pop >= 20 ? (
                      <span className="text-[9px] font-bold text-sky-200 flex items-center mb-1">
                        <Droplets className="w-2.5 h-2.5 mr-0.5" />{data.pop}%
                      </span>
                    ) : (
                      <span className="h-[14px] mb-1"></span>
                    )}
                    <span className="text-sm font-bold text-white">{data.temp}°</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FACT OF THE DAY */}
      <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border-l-4 ${config.border}`}>
        <h3 className={`${config.text} font-semibold text-sm uppercase tracking-wider mb-2 flex items-center gap-2`}>
          {config.icon} {config.title}
        </h3>
        <div className="text-slate-700 font-medium text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: content.text }} />
      </div>
    </div>
  );
}
```

### `// src/components/dashboard/Leaderboard.jsx`

```javascript
import { useState, useEffect } from 'react';
import { Trophy, Medal, AlertCircle, Clock } from 'lucide-react';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';
import { useMidnightTick } from '../../hooks/useMidnightTick';
import MemberProfileModal from './MemberProfileModal';

export default function Leaderboard() {
  const { members, loading: membersLoading } = useFamilyMembers();
  const [scores, setScores] = useState({});
  const [scoresLoading, setScoresLoading] = useState(true);
  
  const [widgetConfig, setWidgetConfig] = useState({
    enabledTimeframes: ['daily', 'weekly', 'yearly', 'lifetime'],
    defaultTimeframe: 'daily',
    autoRevertSeconds: 60
  });
  
  const [timeframe, setTimeframe] = useState('daily');
  const [revertCountdown, setRevertCountdown] = useState(null);
  
  // FIX: Track the ID instead of the whole object so it stays live
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  const todayStr = useMidnightTick();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'leaderboard'), (docSnap) => {
      if (docSnap.exists()) setWidgetConfig(docSnap.data());
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!widgetConfig.enabledTimeframes.includes(timeframe)) {
      setTimeframe(widgetConfig.defaultTimeframe || 'daily');
    }
  }, [widgetConfig, timeframe]);

  useEffect(() => {
    if (timeframe !== widgetConfig.defaultTimeframe) {
      setRevertCountdown(widgetConfig.autoRevertSeconds);
      const interval = setInterval(() => {
        setRevertCountdown((prev) => {
          if (prev <= 1) {
            setTimeframe(widgetConfig.defaultTimeframe);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setRevertCountdown(null);
    }
  }, [timeframe, widgetConfig.defaultTimeframe, widgetConfig.autoRevertSeconds]);

  useEffect(() => {
    if (timeframe === 'lifetime') {
      setScoresLoading(false);
      return;
    }

    setScoresLoading(true);
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();
    
    if (timeframe === 'daily') {
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    } else if (timeframe === 'weekly') {
      startDate.setDate(now.getDate() - now.getDay());
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else if (timeframe === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (timeframe === 'yearly') {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    }

    const q = query(
      collection(db, 'completions'), 
      where('timestamp', '>=', startDate),
      where('timestamp', '<=', endDate)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const calculatedScores = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        const kidId = data.completedBy;
        const points = Number(data.points) || 0;
        if (kidId) calculatedScores[kidId] = (calculatedScores[kidId] || 0) + points;
      });
      setScores(calculatedScores);
      setScoresLoading(false);
    });

    return () => unsubscribe();
  }, [timeframe, todayStr]); 

  if (membersLoading) return null;

  const kids = members
    .filter(m => m.participatesInChores === true || String(m.participatesInChores).toLowerCase() === 'true')
    .map(kid => ({
      ...kid,
      displayPoints: timeframe === 'lifetime' ? (Number(kid.points) || 0) : (scores[kid.id] || 0)
    }))
    .sort((a, b) => b.displayPoints - a.displayPoints);

  const isDefaultView = timeframe === widgetConfig.defaultTimeframe;
  
  // Grab the live member object for the modal
  const liveSelectedMember = selectedMemberId ? kids.find(k => k.id === selectedMemberId) : null;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col min-h-100 shrink-0">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex flex-col mb-4 relative z-10 shrink-0 items-center text-center">
        <h2 className="text-2xl font-bold text-amber-600 flex items-center gap-2 capitalize">
          <Trophy className="text-amber-500 w-7 h-7" /> Live {timeframe} Leaderboard
        </h2>
        
        <div className="h-6 mt-1 flex items-center justify-center w-full">
          {!isDefaultView && revertCountdown !== null && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 animate-pulse">
              <Clock className="w-3 h-3" /> Reverting to {widgetConfig.defaultTimeframe} in {revertCountdown}s
            </div>
          )}
        </div>
      </div>

      {widgetConfig.enabledTimeframes.length > 1 && (
        <div className="flex p-1.5 bg-slate-100 rounded-xl mb-4 relative z-10 shrink-0 border border-slate-200 shadow-inner gap-1">
          {widgetConfig.enabledTimeframes.map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`flex-1 text-xs font-bold py-2 px-1 rounded-lg capitalize transition-all duration-300 cursor-pointer ${
                timeframe === t 
                  ? 'bg-indigo-600 text-white shadow-md scale-105 transform z-10 ring-2 ring-indigo-300/50' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 scale-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}
      
      <div className="flex flex-col gap-3 relative z-10 flex-1">
        {scoresLoading ? (
          <div className="flex-1 flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : kids.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <AlertCircle className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-sm font-bold text-slate-600">No kids found!</span>
          </div>
        ) : (
          kids.map((kid, index) => {
            let MedalIcon = null;
            let medalColor = '';
            
            if (kid.displayPoints > 0) {
              if (index === 0) { MedalIcon = Medal; medalColor = 'text-yellow-500'; }
              else if (index === 1) { MedalIcon = Medal; medalColor = 'text-slate-400'; }
              else if (index === 2) { MedalIcon = Medal; medalColor = 'text-amber-700'; }
            }

            const displayName = kid.name || 'Unknown';
            const displayColor = kid.color || '#cbd5e1';

            return (
              <div 
                key={kid.id || index}
                onClick={() => setSelectedMemberId(kid.id)}
                className="flex items-center justify-between p-3.5 rounded-xl border-2 transition-transform hover:scale-105 bg-white shadow-sm cursor-pointer hover:shadow-md group"
                style={{ borderColor: `${displayColor}40` }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-11 h-11 text-base rounded-full flex items-center justify-center font-bold text-white shadow-sm ring-2 ring-offset-1 shrink-0"
                    style={{ backgroundColor: displayColor, '--tw-ring-color': displayColor }}
                  >
                    {kid.avatar ? (
                      <img src={kid.avatar} alt={displayName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      displayName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="font-bold text-slate-700 truncate text-base group-hover:text-indigo-600 transition-colors">
                    {displayName}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 shrink-0">
                  <span className="font-black text-slate-800 text-xl">{kid.displayPoints}</span>
                  {MedalIcon && <MedalIcon className={`drop-shadow-sm w-6 h-6 ${medalColor}`} />}
                </div>
              </div>
            );
          })
        )}
      </div>

      <MemberProfileModal member={liveSelectedMember} onClose={() => setSelectedMemberId(null)} />
    </div>
  );
}
```

### `// src/components/dashboard/MemberProfileModal.jsx`

```javascript
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Image as ImageIcon, Wallet, Star, Loader2, UserCircle, History, BarChart3, LineChart, ChevronLeft, ChevronRight, RotateCcw, Volume2, Play, Music, Wand2, Trash2, Video, Plus } from 'lucide-react';
import { doc, updateDoc, getDoc, collection, query, where, onSnapshot, arrayUnion } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { compressImage } from '../../utils/imageCompression';
import { uploadToCloudflare } from '../../utils/cloudflareUploader';
import { playAudio } from '../../utils/audioPlayer';
import { EFFECTS, CELEB_PALETTES, DEFAULT_CELEBRATION, useCelebration } from '../../hooks/useCelebration';

const DEFAULT_DING_URL = "https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/ding.mp3";

export default function MemberProfileModal({ member, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTab, setEditTab] = useState('avatar'); 
  
  const [uploading, setUploading] = useState(false);
  const [uploadingSound, setUploadingSound] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  
  const [previewAvatar, setPreviewAvatar] = useState('');
  const [localSound, setLocalSound] = useState('');
  
  const [celebForm, setCelebForm] = useState(DEFAULT_CELEBRATION);
  const { triggerCelebration } = useCelebration();
  
  const [pinPrompt, setPinPrompt] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [defaultAvatars, setDefaultAvatars] = useState([]);
  const [soundOptions, setSoundOptions] = useState([]);
  const [celebSoundOptions, setCelebSoundOptions] = useState([]);
  const [allowanceConfig, setAllowanceConfig] = useState({ payDay: 5 }); 
  const [historyData, setHistoryData] = useState([]);
  const [timeframePoints, setTimeframePoints] = useState(0);
  const [chartType, setChartType] = useState('bar');
  const [historyTimeframe, setHistoryTimeframe] = useState('weekly');
  const [referenceDate, setReferenceDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  useEffect(() => { 
    if (member?.avatar) setPreviewAvatar(member.avatar); 
    if (member) setLocalSound(member.signatureSound || '');
    if (member?.customCelebration) setCelebForm({ ...DEFAULT_CELEBRATION, ...member.customCelebration });
  }, [member]);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'avatars')).then(snap => { if (snap.exists()) setDefaultAvatars(snap.data().urls || []); });
    getDoc(doc(db, 'settings', 'sounds')).then(snap => { if (snap.exists()) setSoundOptions(snap.data().items || []); });
    getDoc(doc(db, 'settings', 'celebSounds')).then(snap => { if (snap.exists()) setCelebSoundOptions(snap.data().items || []); });
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'allowance'), (docSnap) => { if (docSnap.exists()) setAllowanceConfig(docSnap.data()); });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!member) return;
    let startOfRange = new Date(referenceDate);
    let endOfRange = new Date(referenceDate);

    if (historyTimeframe === 'weekly') {
      startOfRange.setDate(referenceDate.getDate() - referenceDate.getDay());
      endOfRange = new Date(startOfRange);
      endOfRange.setDate(startOfRange.getDate() + 6);
    } else {
      startOfRange = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
      endOfRange = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0);
    }

    startOfRange.setHours(0, 0, 0, 0);
    endOfRange.setHours(23, 59, 59, 999);

    const q = query(collection(db, 'completions'), where('completedBy', '==', member.id));
    const unsub = onSnapshot(q, (snapshot) => {
      let currentRangePts = 0;
      const dailyMap = {};
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const daysInRange = historyTimeframe === 'weekly' ? 7 : endOfRange.getDate();

      for (let i = 0; i < daysInRange; i++) {
        const d = new Date(startOfRange);
        d.setDate(startOfRange.getDate() + i);
        const isPayDay = d.getDay() === (allowanceConfig.payDay ?? 5);
        const dayLabel = historyTimeframe === 'weekly' ? dayNames[d.getDay()] : d.getDate().toString();
        dailyMap[d.toDateString()] = { dayLabel, pts: 0, isPayDay, dateObj: d };
      }

      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        const date = data.timestamp?.toDate();
        if (!date) return;
        if (date >= startOfRange && date <= endOfRange) {
          const pts = Number(data.points) || 0;
          currentRangePts += pts;
          if (dailyMap[date.toDateString()]) dailyMap[date.toDateString()].pts += pts;
        }
      });

      setHistoryData(Object.values(dailyMap).sort((a, b) => a.dateObj - b.dateObj));
      setTimeframePoints(currentRangePts);
    });

    return () => unsub();
  }, [member?.id, referenceDate, historyTimeframe, allowanceConfig.payDay]);

  if (!member) return null;

  const handleEditClick = () => {
    if (member.pin) setPinPrompt(true);
    else setIsEditing(true);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === member.pin) {
      setPinPrompt(false);
      setIsEditing(true);
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleUpdateSetting = async (field, value) => {
    try {
      await updateDoc(doc(db, 'familyMembers', member.id), { [field]: value });
    } catch (error) {
      alert("Failed to save changes.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const optimizedBlob = await compressImage(file, 400, 400, 0.8);
      const safeName = `avatar_${member.id}_${Date.now()}.jpg`; 
      const downloadUrl = await uploadToCloudflare(optimizedBlob, safeName);
      setPreviewAvatar(downloadUrl); 
      await handleUpdateSetting('avatar', downloadUrl); 
    } catch (error) {
      alert("Failed to compress and upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleCustomAudioUpload = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { // INCREASED TO 5MB
      return alert("⚠️ Audio file is too large. Please keep custom sounds under 5MB.");
    }
    setUploadingSound(true);
    try {
      const url = await uploadToCloudflare(file, `custom_sound_${member.id}_${Date.now()}_${file.name}`);
      const soundName = window.prompt("Name this Celebration Audio track:") || "Custom Audio";
      await setDoc(doc(db, 'settings', 'celebSounds'), { items: arrayUnion({ name: soundName, url }) }, { merge: true });
      setCelebSoundOptions(prev => [...prev, { name: soundName, url }]);
      const newConfig = { ...celebForm, soundUrl: url };
      setCelebForm(newConfig);
      await handleUpdateSetting('customCelebration', newConfig);
    } catch (err) {
      alert("Failed to upload audio.");
    } finally {
      setUploadingSound(false);
      e.target.value = '';
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      return alert("⚠️ Video file is too large. Please keep celebration videos under 15MB.");
    }
    setUploadingVideo(true);
    try {
      const url = await uploadToCloudflare(file, `celeb_video_${member.id}_${Date.now()}_${file.name}`);
      const newConfig = { ...celebForm, videoUrl: url, type: 'video' };
      setCelebForm(newConfig);
      await handleUpdateSetting('customCelebration', newConfig);
    } catch (err) {
      alert("Failed to upload video.");
    } finally {
      setUploadingVideo(false);
      e.target.value = '';
    }
  };

  const shiftTimeframe = (offset) => {
    setReferenceDate(prev => {
      const next = new Date(prev);
      if (historyTimeframe === 'weekly') next.setDate(prev.getDate() + (offset * 7));
      else next.setMonth(prev.getMonth() + offset);
      return next;
    });
  };

  const addLayer = () => {
    if ((celebForm.layers || []).length >= 4) return;
    const newConfig = { ...celebForm, layers: [...(celebForm.layers || []), { type: 'realistic-burst', colors: CELEB_PALETTES[0].colors, scale: 1, intensity: 1 }] };
    setCelebForm(newConfig);
    handleUpdateSetting('customCelebration', newConfig);
  };

  const updateLayer = (index, field, value) => {
    const newLayers = [...(celebForm.layers || [])];
    newLayers[index] = { ...newLayers[index], [field]: value };
    const newConfig = { ...celebForm, layers: newLayers };
    setCelebForm(newConfig);
    handleUpdateSetting('customCelebration', newConfig);
  };

  const removeLayer = (index) => {
    const newLayers = [...(celebForm.layers || [])];
    newLayers.splice(index, 1);
    const newConfig = { ...celebForm, layers: newLayers };
    setCelebForm(newConfig);
    handleUpdateSetting('customCelebration', newConfig);
  };

  const toggleCustomCelebration = (enabled) => {
    const newConfig = { ...celebForm, enabled };
    setCelebForm(newConfig);
    handleUpdateSetting('customCelebration', newConfig);
  };

  const displayColor = member.color || '#6366f1';
  const payRate = member.payRate || 0;
  const timeframeEarned = (timeframePoints * payRate).toFixed(2);
  const maxPoints = Math.max(...historyData.map(d => d.pts), 10);
  const linePoints = historyData.map((d, i) => `${(i / (historyData.length - 1 || 1)) * 100},${95 - ((d.pts / maxPoints) * 90)}`).join(' ');

  let rangeLabel = '';
  const now = new Date();
  let isCurrentTimeframe = false;

  if (historyTimeframe === 'weekly') {
    const wStart = new Date(referenceDate); wStart.setDate(referenceDate.getDate() - referenceDate.getDay());
    const wEnd = new Date(wStart); wEnd.setDate(wStart.getDate() + 6);
    rangeLabel = `${wStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})} - ${wEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}`;
    isCurrentTimeframe = now >= wStart && now <= new Date(wEnd.setHours(23, 59, 59));
  } else {
    rangeLabel = referenceDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    isCurrentTimeframe = now.getMonth() === referenceDate.getMonth() && now.getFullYear() === referenceDate.getFullYear();
  }

  const shouldShowLabel = (index, total) => historyTimeframe === 'weekly' || index === 0 || index === total - 1 || index % 5 === 0;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      
      {pinPrompt && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setPinPrompt(false); }}>
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">🔒 Profile Locked</h3>
            <p className="text-slate-500 mb-6 text-sm">Enter PIN to edit {member.name}'s profile.</p>
            <form onSubmit={handlePinSubmit}>
              <input 
                type="password" value={pinInput} onChange={(e) => { setPinInput(e.target.value); setPinError(false); }} 
                maxLength={4} autoFocus 
                className={`w-full text-center text-3xl tracking-[1em] font-bold p-4 border-2 rounded-xl mb-4 focus:outline-none transition-colors ${pinError ? 'border-rose-500 bg-rose-50' : 'border-slate-200 focus:border-indigo-500'}`} 
                placeholder="••••" 
              />
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md cursor-pointer">Unlock</button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        <div className="p-5 text-center relative shrink-0" style={{ backgroundColor: displayColor }}>
          <button onClick={onClose} className="absolute top-3 right-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors focus:outline-none cursor-pointer" >
            <X className="w-5 h-5" />
          </button>
          
          <div className="relative inline-block mt-2 mb-2 group">
            <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover flex items-center justify-center text-3xl font-black text-white" style={{ backgroundColor: displayColor }} >
              {previewAvatar || member.avatar ? (
                <img src={previewAvatar || member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                member.name.charAt(0).toUpperCase()
              )}
            </div>
            {!isEditing && (
              <button onClick={handleEditClick} className="absolute bottom-0 right-0 bg-white text-indigo-600 p-1.5 rounded-full shadow-md hover:scale-110 transition-transform border border-slate-100 cursor-pointer" >
                <ImageIcon className="w-4 h-4" />
              </button>
            )}
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">{member.name}</h2>
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/20 text-white uppercase tracking-wider mt-1 inline-block">
            {member.participatesInChores === true || String(member.participatesInChores).toLowerCase() === 'true' ? 'Kid Profile' : 'Adult Profile'}
          </span>
        </div>

        <div className="p-5 overflow-y-auto custom-scrollbar flex flex-col gap-5 bg-slate-50/50">
          {isEditing ? (
            <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
              
              <div className="flex bg-slate-200/50 p-1 rounded-xl mb-4 shrink-0 overflow-x-auto hide-scrollbar">
                <button onClick={() => setEditTab('avatar')} className={`flex-1 min-w-max flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${editTab === 'avatar' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                  <ImageIcon className="w-4 h-4" /> Avatar
                </button>
                <button onClick={() => setEditTab('sound')} className={`flex-1 min-w-max flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${editTab === 'sound' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                  <Volume2 className="w-4 h-4" /> Ding
                </button>
                <button onClick={() => setEditTab('celeb')} className={`flex-1 min-w-max flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${editTab === 'celeb' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                  <Wand2 className="w-4 h-4" /> 🎉 Celeb
                </button>
              </div>

              {editTab === 'avatar' && (
                <div className="flex-1 overflow-hidden flex flex-col">
                  {defaultAvatars.length === 0 ? (
                    <div className="text-center p-4 bg-white rounded-xl border border-slate-200 mb-4">
                      <UserCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-500">No default avatars available.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 overflow-y-auto custom-scrollbar p-1 mb-4">
                      {defaultAvatars.map((url, idx) => (
                        <button key={idx} onClick={() => { setPreviewAvatar(url); handleUpdateSetting('avatar', url); }} className="aspect-square rounded-2xl bg-white border-2 border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all overflow-hidden focus:outline-none cursor-pointer" >
                          <img src={url} alt={`Avatar option ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  <label className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50 text-indigo-600 font-bold cursor-pointer hover:bg-indigo-100 hover:border-indigo-300 transition-colors mt-auto shrink-0">
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                    {uploading ? 'Uploading...' : 'Upload Custom Photo'}
                    <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                </div>
              )}

              {editTab === 'sound' && (
                <div className="flex-1">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                      Select Signature Sound
                    </label>
                    <select 
                      value={localSound || DEFAULT_DING_URL} 
                      onChange={(e) => { setLocalSound(e.target.value); handleUpdateSetting('signatureSound', e.target.value); }} 
                      className="w-full p-3 border-2 border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer text-sm mb-4" 
                    >
                      <option value={DEFAULT_DING_URL}>🔔 Default Ding</option>
                      {soundOptions.map((s, idx) => <option key={idx} value={s.url}>{s.name}</option>)}
                      {localSound && localSound !== DEFAULT_DING_URL && !soundOptions.find(s => s.url === localSound) && (
                        <option value={localSound}>🎙️ Custom Uploaded Sound</option>
                      )}
                    </select>
                    
                    <button onClick={() => playAudio(localSound || DEFAULT_DING_URL)} className="w-full bg-indigo-100 text-indigo-600 p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-200 transition-colors cursor-pointer shadow-sm">
                      <Play className="w-5 h-5 fill-current" /> Preview Sound
                    </button>
                    <p className="text-xs text-slate-400 mt-4 text-center">This tiny sound plays instantly when you check off a single chore.</p>
                  </div>
                </div>
              )}

              {editTab === 'celeb' && (
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-center justify-between mb-4 shrink-0">
                    <div>
                      <h4 className="font-bold text-amber-900 flex items-center gap-2">Custom Reward!</h4>
                      <p className="text-xs text-amber-700 mt-1">Override the global celebration.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" checked={celebForm.enabled || false} onChange={(e) => toggleCustomCelebration(e.target.checked)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>

                  {celebForm.enabled && (
                    <div className="space-y-4 animate-in fade-in duration-300 pb-2">
                      
                      <div className="flex bg-slate-200/50 p-1 rounded-xl shrink-0">
                        <button 
                          onClick={() => { const val = { ...celebForm, type: 'particles' }; setCelebForm(val); handleUpdateSetting('customCelebration', val); }} 
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${(!celebForm.type || celebForm.type === 'particles') ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          <Wand2 className="w-4 h-4" /> Particles
                        </button>
                        <button 
                          onClick={() => { const val = { ...celebForm, type: 'video' }; setCelebForm(val); handleUpdateSetting('customCelebration', val); }} 
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${celebForm.type === 'video' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          <Video className="w-4 h-4" /> Video
                        </button>
                      </div>

                      {celebForm.type === 'video' ? (
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Screen Video</label>
                          
                          {celebForm.videoUrl && (
                            <div className="relative aspect-video rounded-xl border-2 border-slate-200 overflow-hidden mb-4 shadow-sm bg-black">
                              <video src={celebForm.videoUrl} className="w-full h-full object-cover" controls />
                              <button onClick={() => { const val = { ...celebForm, videoUrl: '' }; setCelebForm(val); handleUpdateSetting('customCelebration', val); }} className="absolute top-2 right-2 bg-rose-500/90 hover:bg-rose-600 text-white p-2 rounded-lg shadow-md backdrop-blur-sm transition-colors cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                          <label className="flex items-center justify-center gap-2 w-full p-3 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50 text-indigo-600 font-bold cursor-pointer hover:bg-indigo-100 hover:border-indigo-300 transition-colors">
                            {uploadingVideo ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                            {uploadingVideo ? 'Uploading...' : 'Upload Video (Max 15MB)'}
                            <input type="file" accept="video/mp4, video/webm, video/quicktime" className="hidden" onChange={handleVideoUpload} disabled={uploadingVideo} />
                          </label>

                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Duration</label>
                            <select value={celebForm.duration} onChange={e => { const val = { ...celebForm, duration: Number(e.target.value) }; setCelebForm(val); handleUpdateSetting('customCelebration', val); }} className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 font-bold text-sm text-slate-700 bg-slate-50 focus:bg-white transition-colors cursor-pointer">
                              <option value={0}>Play until Media Finishes</option><option value={3}>3 Seconds</option><option value={5}>5 Seconds</option><option value={8}>8 Seconds</option><option value={15}>15 Seconds</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Long Audio Track</label>
                              <select value={celebForm.soundUrl || ''} onChange={e => { const val = { ...celebForm, soundUrl: e.target.value }; setCelebForm(val); handleUpdateSetting('customCelebration', val); }} className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 font-bold text-sm text-slate-700 bg-slate-50 focus:bg-white transition-colors cursor-pointer">
                                <option value="">No Sound (Silent)</option>
                                {celebSoundOptions.map((s, idx) => <option key={idx} value={s.url}>{s.name}</option>)}
                                {celebForm.soundUrl && !celebSoundOptions.find(s => s.url === celebForm.soundUrl) && (
                                  <option value={celebForm.soundUrl}>🎙️ Custom Uploaded Audio</option>
                                )}
                              </select>
                            </div>
                            
                            <label className="flex items-center justify-center gap-2 w-full p-3 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50 text-indigo-600 font-bold cursor-pointer hover:bg-indigo-100 hover:border-indigo-300 transition-colors">
                              {uploadingSound ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                              {uploadingSound ? 'Uploading...' : 'Upload Own Audio (Max 5MB)'}
                              <input type="file" accept="audio/*" className="hidden" onChange={handleCustomAudioUpload} disabled={uploadingSound} />
                            </label>

                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Duration</label>
                              <select value={celebForm.duration} onChange={e => { const val = { ...celebForm, duration: Number(e.target.value) }; setCelebForm(val); handleUpdateSetting('customCelebration', val); }} className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 font-bold text-sm text-slate-700 bg-slate-50 focus:bg-white transition-colors cursor-pointer">
                                <option value={0}>Play until Media Finishes</option><option value={3}>3 Seconds</option><option value={5}>5 Seconds</option><option value={8}>8 Seconds (Long)</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Effect Layers ({(celebForm.layers || []).length}/4)</label>
                            {(celebForm.layers || []).map((layer, index) => (
                              <div key={index} className="bg-white border border-slate-200 rounded-xl p-3 relative shadow-sm">
                                <button onClick={() => removeLayer(index)} className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
                                <div className="space-y-3 pr-6">
                                  <div>
                                    <select value={layer.type} onChange={(e) => updateLayer(index, 'type', e.target.value)} className="w-full p-2 rounded-lg border border-slate-200 font-bold text-sm text-slate-700 focus:border-indigo-500 cursor-pointer">
                                      {EFFECTS.map(eff => <option key={eff.id} value={eff.id}>{eff.label}</option>)}
                                    </select>
                                  </div>
                                  {layer.type === 'emoji' ? (
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Type an Emoji 🦄🐾🚗</label>
                                      <input type="text" maxLength="2" value={layer.emojiChar || '😀'} onChange={(e) => updateLayer(index, 'emojiChar', e.target.value)} className="w-full p-2 text-2xl text-center border border-slate-200 rounded-lg focus:border-indigo-500" />
                                    </div>
                                  ) : (
                                    <div>
                                      <select value={JSON.stringify(layer.colors || CELEB_PALETTES[0].colors)} onChange={(e) => updateLayer(index, 'colors', JSON.parse(e.target.value))} className="w-full p-2 rounded-lg border border-slate-200 font-bold text-sm text-slate-700 focus:border-indigo-500 cursor-pointer mb-1.5">
                                        {CELEB_PALETTES.map(pal => <option key={pal.id} value={JSON.stringify(pal.colors)}>{pal.label}</option>)}
                                      </select>
                                      <div className="flex h-1.5 rounded overflow-hidden">
                                        {(layer.colors || CELEB_PALETTES[0].colors).map((c, i) => <div key={i} style={{ backgroundColor: c, flex: 1 }} />)}
                                      </div>
                                    </div>
                                  )}
                                  <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div><div className="flex justify-between"><label className="text-[10px] font-bold text-slate-500">Size</label><span className="text-[10px] text-indigo-500">{layer.scale}x</span></div><input type="range" min="0.5" max="3" step="0.1" value={layer.scale} onChange={(e) => updateLayer(index, 'scale', parseFloat(e.target.value))} className="w-full accent-indigo-500"/></div>
                                    <div><div className="flex justify-between"><label className="text-[10px] font-bold text-slate-500">Amount</label><span className="text-[10px] text-indigo-500">{layer.intensity * 100}%</span></div><input type="range" min="0.2" max="2.5" step="0.1" value={layer.intensity} onChange={(e) => updateLayer(index, 'intensity', parseFloat(e.target.value))} className="w-full accent-indigo-500"/></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {(celebForm.layers || []).length < 4 && <button onClick={addLayer} className="w-full py-3 border-2 border-dashed border-indigo-200 text-indigo-500 font-bold rounded-xl flex items-center justify-center gap-1 hover:bg-indigo-50 hover:border-indigo-400 transition-colors text-sm cursor-pointer"><Plus className="w-4 h-4" /> Add Layer</button>}
                          </div>
                        </>
                      )}
                      
                      <button onClick={() => triggerCelebration(celebForm)} className="w-full py-3 mt-4 bg-indigo-100 text-indigo-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-200 transition-colors cursor-pointer shadow-sm">
                        <Play className="w-5 h-5 fill-current" /> Preview Full Blast
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button onClick={() => setIsEditing(false)} className="w-full py-4 mt-2 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors focus:outline-none cursor-pointer shrink-0 shadow-md" >
                Save & Close
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex bg-slate-100 p-1 rounded-lg shrink-0 border border-slate-200 shadow-inner">
                    <button onClick={() => { setHistoryTimeframe('weekly'); setReferenceDate(new Date()); }} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${historyTimeframe === 'weekly' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`} >
                      Week
                    </button>
                    <button onClick={() => { setHistoryTimeframe('monthly'); setReferenceDate(new Date()); }} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${historyTimeframe === 'monthly' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`} >
                      Month
                    </button>
                  </div>
                  <button onClick={() => setReferenceDate(new Date())} className={`flex items-center gap-1.5 py-1 px-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold text-xs rounded-lg border border-indigo-100 transition-all duration-300 cursor-pointer ${isCurrentTimeframe ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`} >
                    <RotateCcw className="w-3.5 h-3.5" /> Current {historyTimeframe === 'weekly' ? 'Week' : 'Month'}
                  </button>
                </div>

                <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm">
                  <button onClick={() => shiftTimeframe(-1)} className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-500 hover:text-slate-800 cursor-pointer" ><ChevronLeft className="w-5 h-5" /></button>
                  <h3 className="font-bold text-slate-700 text-sm text-center px-2">{rangeLabel}</h3>
                  <button onClick={() => shiftTimeframe(1)} className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-500 hover:text-slate-800 cursor-pointer" ><ChevronRight className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-3 shadow-sm relative overflow-hidden group">
                  <Star className="absolute -right-3 -bottom-3 w-16 h-16 text-amber-500 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                  <div className="text-[10px] font-black text-amber-600/80 uppercase tracking-widest mb-1 relative z-10">Stars</div>
                  <div className="text-2xl font-black text-amber-600 relative z-10">{timeframePoints}</div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-3 shadow-sm relative overflow-hidden group">
                  <Wallet className="absolute -right-3 -bottom-3 w-16 h-16 text-emerald-500 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                  <div className="text-[10px] font-black text-emerald-600/80 uppercase tracking-widest mb-1 relative z-10">Earnings</div>
                  <div className="text-2xl font-black text-emerald-600 relative z-10">${timeframeEarned}</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                    <History className="w-4 h-4 text-slate-400" /> Hustle History
                  </div>
                  <div className="flex bg-slate-100 p-0.5 rounded-lg shrink-0 border border-slate-200">
                    <button onClick={() => setChartType('bar')} className={`p-1 rounded-md transition-colors cursor-pointer ${chartType === 'bar' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} ><BarChart3 className="w-4 h-4" /></button>
                    <button onClick={() => setChartType('line')} className={`p-1 rounded-md transition-colors cursor-pointer ${chartType === 'line' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} ><LineChart className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="relative h-24 w-full mt-2">
                  {chartType === 'bar' ? (
                    <div className={`absolute inset-0 flex items-end justify-between px-1 ${historyTimeframe === 'weekly' ? 'gap-1' : 'gap-[1px]'}`}>
                      {historyData.map((dayData, i) => {
                        const heightPct = Math.max((dayData.pts / maxPoints) * 100, dayData.pts > 0 ? 4 : 0);
                        return (
                          <div key={i} className="flex flex-col items-center justify-end h-full flex-1 relative group">
                            <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded font-bold pointer-events-none transition-opacity z-20 shadow-md">
                              {dayData.pts}
                            </div>
                            <div 
                              className={`w-full rounded-t-sm transition-all duration-500 ease-out group-hover:opacity-80 relative ${dayData.isPayDay ? 'ring-1 ring-emerald-400 ring-offset-[1px]' : ''}`} 
                              style={{ height: `${heightPct}%`, backgroundColor: dayData.pts > 0 ? displayColor : '#e2e8f0', opacity: dayData.pts > 0 ? 0.9 : 1 }}
                            >
                                {dayData.isPayDay && dayData.pts > 0 && <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400"></div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="absolute inset-0 px-2">
                      <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-slate-200 pb-0.5">
                        <div className="w-full border-t border-dashed border-slate-200"></div>
                        <div className="w-full border-t border-dashed border-slate-200"></div>
                        <div className="w-full border-t border-dashed border-slate-200"></div>
                      </div>
                      <svg className="absolute inset-0 w-full h-full overflow-visible z-10" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <defs>
                          <linearGradient id={`grad-${member.id}`} x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={displayColor} stopOpacity="0.2"/>
                            <stop offset="100%" stopColor={displayColor} stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        <polygon points={`0,100 ${linePoints} 100,100`} fill={`url(#grad-${member.id})`} />
                        <polyline points={linePoints} fill="none" stroke={displayColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />
                      </svg>
                      <div className="absolute inset-0 flex justify-between pb-0.5">
                        {historyData.map((dayData, i) => (
                          <div key={i} className="h-full flex-1 relative group z-20 flex items-end justify-center">
                            <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[10px] py-1 px-2 rounded font-bold pointer-events-none transition-opacity -translate-x-1/2 whitespace-nowrap shadow-md">
                              {dayData.dayLabel}: {dayData.pts} pts
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-2 flex justify-between px-1 border-t border-slate-100 pt-2">
                  {historyData.map((dayData, i) => (
                    <div key={i} className={`font-bold uppercase flex-1 text-center truncate text-[9px] ${dayData.isPayDay ? 'text-emerald-600' : 'text-slate-400'}`} style={{ color: (historyTimeframe === 'monthly' && !shouldShowLabel(i, historyData.length)) ? 'transparent' : undefined }}>
                      {shouldShowLabel(i, historyData.length) ? dayData.dayLabel : '.'}
                    </div>
                  ))}
                </div>

              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
```

### `// src/components/dashboard/MessageCentre.jsx`

```javascript
import { Pin, AlertTriangle, Info, Star } from 'lucide-react';
import { useMessageCentre } from '../../hooks/useMessageCentre';

export default function MessageCentre() {
  const { messageData, loading } = useMessageCentre();

  if (loading) {
    return <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg h-24 animate-pulse"></div>;
  }

  // If inactive or completely empty, don't show
  if (!messageData || !messageData.isActive) return null;
  if (!messageData.content || messageData.content === '<p><br></p>' || messageData.content.trim() === '') return null;

  const themes = {
    info: { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-900', icon: <Info className="w-6 h-6 text-sky-500" /> },
    important: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-900', icon: <Pin className="w-6 h-6 text-rose-500 fill-rose-500" /> },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', icon: <AlertTriangle className="w-6 h-6 text-amber-500" /> },
    success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', icon: <Star className="w-6 h-6 text-emerald-500 fill-emerald-500" /> }
  };

  const activeTheme = themes[messageData.type] || themes.info;

  return (
    <div className={`${activeTheme.bg} border-2 ${activeTheme.border} rounded-2xl p-5 shadow-md relative overflow-hidden transition-colors min-h-24 flex flex-col`}>
      {messageData.title && (
        <div className="flex items-center gap-3 mb-2 shrink-0">
          {activeTheme.icon}
          <h3 className={`font-bold ${activeTheme.text} text-lg`}>{messageData.title}</h3>
        </div>
      )}
      
      <div 
        className={`${activeTheme.text} text-sm leading-relaxed flex-1 [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal [&>ol]:ml-5 [&>p]:mb-1`}
        dangerouslySetInnerHTML={{ __html: messageData.content }} 
      />
    </div>
  );
}
```

### `// src/components/dashboard/TodayChores.jsx`

```javascript
import { useState, useEffect } from 'react';
import { ClipboardList, Star, CheckCircle, Circle } from 'lucide-react';
import { collection, query, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';
import confetti from 'canvas-confetti';

export default function TodayChores() {
  const [chores, setChores] = useState([]);
  const [loading, setLoading] = useState(true);
  const { members } = useFamilyMembers();

  // 1. Listen for today's chores in the database
  useEffect(() => {
    const q = query(collection(db, 'dailyChores'));
    const unsub = onSnapshot(q, (snapshot) => {
      const choreData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChores(choreData);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // 2. The Mega Confetti Blast Function
  const triggerMegaConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#667eea', '#764ba2', '#fbbf24'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#667eea', '#764ba2', '#fbbf24'] });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  // 3. Handle Chore Click (Points + Database Sync)
  const handleToggleChore = async (chore) => {
    try {
      const newStatus = !chore.completed;
      
      // If we are checking it off, add points. If unchecking, subtract points.
      const pointDiff = newStatus ? chore.points : -chore.points;

      // Update the chore status in Firestore
      await updateDoc(doc(db, 'dailyChores', chore.id), { completed: newStatus });

      // Atomically add/subtract points from the family member's profile
      if (chore.memberId) {
        await updateDoc(doc(db, 'familyMembers', chore.memberId), { 
          points: increment(pointDiff) 
        });
      }

      // Check if this kid just finished ALL their chores for the Mega Blast!
      if (newStatus === true && chore.memberId) {
        const kidChores = chores.filter(c => c.memberId === chore.memberId);
        // We evaluate against the current state, assuming the clicked chore is now true
        const allDone = kidChores.every(c => c.id === chore.id ? true : c.completed);
        
        if (allDone && kidChores.length > 0) {
          triggerMegaConfetti();
        }
      }
    } catch (error) {
      console.error("Error updating chore:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg h-full animate-pulse min-h-62.5">
        <div className="h-6 w-1/3 bg-slate-200 rounded mb-4"></div>
        <div className="space-y-3"><div className="h-12 bg-slate-100 rounded-xl"></div></div>
      </div>
    );
  }

  // Group chores by Kid
  const choresByKid = chores.reduce((acc, chore) => {
    if (!acc[chore.memberId]) acc[chore.memberId] = [];
    acc[chore.memberId].push(chore);
    return acc;
  }, {});

  // Only show kids who actually have chores assigned today
  const kidsWithChores = members.filter(m => choresByKid[m.id] && choresByKid[m.id].length > 0);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg flex flex-col h-full min-h-0">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 shrink-0">
        <ClipboardList className="text-indigo-500 w-6 h-6" /> Today's Chores
      </h2>

      <div className="flex-1 overflow-y-auto hide-scrollbar pr-2 space-y-6">
        {kidsWithChores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <span className="text-4xl mb-2">✨</span>
            <span className="text-sm font-bold text-slate-500">No chores right now!</span>
          </div>
        ) : (
          kidsWithChores.map(kid => (
            <div key={kid.id}>
              <h3 className="text-xs font-black uppercase tracking-wider mb-2" style={{ color: kid.color || '#94a3b8' }}>
                {kid.name}'s Chores
              </h3>
              <div className="flex flex-col gap-2">
                {choresByKid[kid.id].map(chore => (
                  <div 
                    key={chore.id}
                    onClick={() => handleToggleChore(chore)}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      chore.completed ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white hover:border-indigo-300 hover:shadow-sm'
                    }`}
                    style={{ borderColor: !chore.completed ? `${kid.color}40` : '' }}
                  >
                    <div className="flex items-center gap-3">
                      {chore.completed ? (
                        <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-300 shrink-0" />
                      )}
                      <span className={`font-bold ${chore.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {chore.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-md text-xs font-bold shrink-0">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {chore.points}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

### `// src/config/firebase.js`

```js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth'; // <-- NEW

const firebaseConfig = {
  apiKey: "AIzaSyDg-I2BAuXt2sHDJa-ih-B6z5km8HlOl0U",
  authDomain: "family-calendar-ebf3b.firebaseapp.com",
  databaseURL: "https://family-calendar-ebf3b-default-rtdb.firebaseio.com",
  projectId: "family-calendar-ebf3b",
  storageBucket: "family-calendar-ebf3b.firebasestorage.app",
  messagingSenderId: "964895867498",
  appId: "1:964895867498:web:f69b0c636201303a3e4013"
};

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});

export const rtdb = getDatabase(app);
export const storage = getStorage(app);
export const auth = getAuth(app); // <-- NEW
```

### `// src/constants/defaults.js`

```js
export const DEFAULT_MEMBERS = [
  { id: 'dad', name: 'Dad', color: '#3B82F6', participatesInChores: false },
  { id: 'mom', name: 'Mom', color: '#EC4899', participatesInChores: false },
  { id: 'madison', name: 'Madison', color: '#8B5CF6', participatesInChores: true, age: 13, signatureSound: 'fairy-chimes', schedule: { type: 'alternating-weeks', referenceDate: '2025-02-11', offset: 0, description: 'Every other week (Tue-Tue)' } },
  { id: 'mason', name: 'Mason', color: '#10B981', participatesInChores: true, age: 11, signatureSound: 'level-up' },
  { id: 'hudson', name: 'Hudson', color: '#F59E0B', participatesInChores: true, age: 7, signatureSound: 'arcade-coin' },
  { id: 'hunter', name: 'Hunter', color: '#EF4444', participatesInChores: true, age: 5, signatureSound: 'victory-fanfare' }
];

export const DEFAULT_CHORES = [
  { id: 'dishwasher', name: 'Empty Dishwasher', assignedTo: 'mason', points: 10, frequency: 'daily' },
  { id: 'cat-litter', name: 'Clean Cat Litter', assignedTo: 'madison', points: 15, frequency: 'weekly' },
  { id: 'room-madison', name: 'Clean Room', assignedTo: 'madison', points: 5, frequency: 'daily' }
];
```

### `// src/hooks/useAdminPin.js`

```js
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useAdminPin() {
  const [adminPin, setAdminPin] = useState("8486");

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'admin'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().pin) {
        setAdminPin(docSnap.data().pin);
      }
    });
    return () => unsub();
  }, []);

  return adminPin;
}
```

### `// src/hooks/useCelebration.js`

```js
import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useKiosk } from './useKiosk';
import { playAudio } from '../utils/audioPlayer';
import confetti from 'canvas-confetti';

export const EFFECTS = [
  { id: 'realistic-burst', label: '💥 Realistic Burst' },
  { id: 'cannons', label: '🎉 Side Cannons' },
  { id: 'fireworks', label: '⭐ Fireworks' },
  { id: 'rain', label: '🎊 Confetti Rain' },
  { id: 'snow', label: '❄️ Drifting Snow' },
  { id: 'center-burst', label: '🎆 Center Spinner' },
  { id: 'emoji', label: '😀 Custom Emoji / Character' }
];

export const CELEB_PALETTES = [
  { id: 'rainbow', label: 'Rainbow', colors: ['#ef4444', '#f59e0b', '#eab308', '#10b981', '#3b82f6', '#8b5cf6', '#d946ef'] },
  { id: 'gold', label: 'Gold & Silver', colors: ['#FFD700', '#FFA500', '#DAA520', '#F8F8FF', '#C0C0C0'] },
  { id: 'neon', label: 'Neon Cyber', colors: ['#FF1493', '#00FFFF', '#39FF14', '#FF00FF'] },
  { id: 'pastel', label: 'Spring Pastels', colors: ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff'] },
  { id: 'blizzard', label: 'Winter Blizzard', colors: ['#ffffff', '#e0f2fe', '#bae6fd', '#7dd3fc'] },
  { id: 'schell', label: 'Schell Family', colors: ['#3B82F6', '#EC4899', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'] }
];

export const DEFAULT_CELEBRATION = {
  type: 'particles', 
  videoUrl: '',
  duration: 0, // 0 = Auto (Play until media finishes)
  soundUrl: '',
  layers: [
    { type: 'cannons', colors: CELEB_PALETTES[0].colors, scale: 1, intensity: 1 },
    { type: 'fireworks', colors: CELEB_PALETTES[1].colors, scale: 2.5, intensity: 1.5 }
  ]
};

export function useCelebration() {
  const [settings, setSettings] = useState(DEFAULT_CELEBRATION);
  const [loading, setLoading] = useState(true);
  const { isMuted } = useKiosk();

  useEffect(() => {
    let isMounted = true;
    const unsub = onSnapshot(doc(db, 'settings', 'celebrations'), (docSnap) => {
      if (!isMounted) return;
      if (docSnap.exists()) setSettings({ ...DEFAULT_CELEBRATION, ...docSnap.data() });
      setLoading(false);
    }, () => {
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; unsub(); };
  }, []);

  const saveSettings = async (newSettings) => {
    await setDoc(doc(db, 'settings', 'celebrations'), newSettings, { merge: true });
  };

  const triggerCelebration = (overrideConfig = null) => {
    const config = overrideConfig || settings;
    const isAuto = config.duration === 0;
    
    let isPlaying = true;
    let fallbackTimer;

    if (!isAuto) {
      fallbackTimer = setTimeout(() => { isPlaying = false; }, config.duration * 1000);
    }

    // --- VIDEO CELEBRATION ENGINE ---
    if (config.type === 'video' && config.videoUrl) {
      const vid = document.createElement('video');
      vid.src = config.videoUrl;
      vid.autoplay = true;
      vid.playsInline = true;
      vid.muted = isMuted; 
      vid.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; object-fit: cover; z-index: 100005; pointer-events: none; background: black;";
      
      document.body.appendChild(vid);
      
      vid.onended = () => {
        isPlaying = false;
        if (document.body.contains(vid)) vid.remove();
      };
      
      const maxTime = isAuto ? 30000 : (config.duration * 1000 + 1000);
      setTimeout(() => {
        isPlaying = false;
        if (document.body.contains(vid)) vid.remove();
      }, maxTime); 

      return; 
    }

    // --- PARTICLE CELEBRATION ENGINE ---
    let audioHandled = false;
    if (config.soundUrl && !isMuted) {
      audioHandled = true;
      playAudio(config.soundUrl, () => {
        if (isAuto) isPlaying = false;
      });
    }

    if (isAuto && !audioHandled) {
      setTimeout(() => { isPlaying = false; }, 4000);
    }

    const activeLayers = config.layers || [];

    activeLayers.forEach(layer => {
      const pCount = Math.max(1, Math.round(5 * layer.intensity)); 
      
      const customShape = layer.type === 'emoji' && layer.emojiChar 
        ? confetti.shapeFromText({ text: layer.emojiChar, scalar: layer.scale * 2 }) 
        : null;

      const launchConfetti = (opts) => {
        confetti({
          ...opts,
          colors: layer.colors,
          scalar: layer.type === 'emoji' ? 1 : layer.scale, 
          shapes: customShape ? [customShape] : (layer.type === 'fireworks' ? ['star'] : ['square', 'circle']),
          zIndex: 100002
        });
      };

      if (layer.type === 'cannons' || layer.type === 'emoji') {
        const frame = () => {
          launchConfetti({ particleCount: pCount, angle: 60, spread: 55, origin: { x: 0 } });
          launchConfetti({ particleCount: pCount, angle: 120, spread: 55, origin: { x: 1 } });
          if (isPlaying) requestAnimationFrame(frame);
        };
        frame();
      } 
      else if (layer.type === 'fireworks') {
        const r = (min, max) => Math.random() * (max - min) + min;
        const interval = setInterval(() => {
          if (!isPlaying) return clearInterval(interval);
          launchConfetti({ particleCount: Math.round(6 * layer.intensity), angle: r(55, 125), spread: 60, startVelocity: r(55, 75), decay: 0.92, gravity: 0.8, ticks: 200, origin: { x: r(0.1, 0.4), y: 0.9 } });
          launchConfetti({ particleCount: Math.round(6 * layer.intensity), angle: r(55, 125), spread: 60, startVelocity: r(55, 75), decay: 0.92, gravity: 0.8, ticks: 200, origin: { x: r(0.6, 0.9), y: 0.9 } });
        }, 400);
      }
      else if (layer.type === 'rain') {
        const frame = () => {
          launchConfetti({ particleCount: pCount, angle: 270, startVelocity: 25, origin: { y: -0.1, x: Math.random() }, spread: 45, gravity: 1 });
          if (isPlaying) requestAnimationFrame(frame);
        };
        frame();
      }
      else if (layer.type === 'snow') {
        const frame = () => {
          launchConfetti({ particleCount: pCount, startVelocity: 0, origin: { y: -0.1, x: Math.random() }, shapes: ['circle'], gravity: Math.random() * 0.3 + 0.2, drift: Math.random() * 1.2 - 0.6, ticks: 300 });
          if (isPlaying) requestAnimationFrame(frame);
        };
        frame();
      }
      else if (layer.type === 'realistic-burst') {
        const fireBurst = () => {
            const b = Math.round(150 * layer.intensity);
            const opts = { origin: { y: 0.6, x: 0.5 } };
            launchConfetti({ ...opts, particleCount: Math.floor(b * 0.25), spread: 26, startVelocity: 55 });
            launchConfetti({ ...opts, particleCount: Math.floor(b * 0.2), spread: 60 });
            launchConfetti({ ...opts, particleCount: Math.floor(b * 0.35), spread: 100, decay: 0.91 });
        };
        fireBurst();
        const interval = setInterval(() => {
          if (!isPlaying) return clearInterval(interval);
          fireBurst();
        }, 1500);
      }
      else if (layer.type === 'center-burst') {
        const interval = setInterval(() => {
          if (!isPlaying) return clearInterval(interval);
          launchConfetti({ particleCount: Math.round(50 * layer.intensity), spread: 360, startVelocity: 45, origin: { x: 0.5, y: 0.5 } });
        }, 800);
      }
    });
  };

  return { settings, loading, saveSettings, triggerCelebration };
}
```

### `// src/hooks/useChores.js`

```js
import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useChores() {
  const [chores, setChores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const choresRef = collection(db, 'chores');
    
    const unsubscribe = onSnapshot(choresRef, (snapshot) => {
      const fetchedChores = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChores(fetchedChores);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching chores:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { chores, loading };
}
```

### `// src/hooks/useCustody.js`

```js
import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, deleteField } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useMidnightTick } from './useMidnightTick';

export function useCustody() {
  const todayStr = useMidnightTick();
  const [overrides, setOverrides] = useState({});

  const getLocalIsoDate = (dateString) => {
    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayIso = getLocalIsoDate(todayStr);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'dailyOverrides', todayIso), (docSnap) => {
      if (docSnap.exists()) {
        setOverrides(docSnap.data());
      } else {
        setOverrides({});
      }
    });
    return () => unsub();
  }, [todayIso]);

  const checkBaseSchedule = (kid, targetDateStr) => {
    // If no schedule exists, default to always here
    if (!kid || !kid.schedule || !kid.schedule.pattern || kid.schedule.pattern.length === 0) return true;
    if (!kid.schedule.referenceDate) return true;

    const pattern = kid.schedule.pattern;
    const cycleLength = pattern.length;

    // Standardize target to local midnight
    const target = new Date(targetDateStr);
    target.setHours(0, 0, 0, 0);

    // Standardize the anchor string (YYYY-MM-DD) to local midnight
    const [refY, refM, refD] = kid.schedule.referenceDate.split('-');
    const refDate = new Date(refY, refM - 1, refD);
    refDate.setHours(0, 0, 0, 0);

    const msPerDay = 1000 * 60 * 60 * 24;
    // Difference in days. Math.round handles daylight savings time shifts safely.
    const daysDiff = Math.round((target - refDate) / msPerDay);

    // Calculate the exact index in the pattern array. 
    // The ((n % m) + m) % m formula ensures negative days (past dates) wrap correctly.
    const cycleDay = ((daysDiff % cycleLength) + cycleLength) % cycleLength; 
    
    return pattern[cycleDay];
  };

  const isHereToday = (kid) => {
    if (!kid) return false;
    if (overrides[kid.id] !== undefined) return overrides[kid.id];
    return checkBaseSchedule(kid, todayStr);
  };

  const toggleOverride = async (kidId, currentlyHere) => {
    const overrideRef = doc(db, 'dailyOverrides', todayIso);
    await setDoc(overrideRef, { [kidId]: !currentlyHere }, { merge: true });
  };

  const clearOverride = async (kidId) => {
    const overrideRef = doc(db, 'dailyOverrides', todayIso);
    await setDoc(overrideRef, { [kidId]: deleteField() }, { merge: true });
  };

  return { isHereToday, checkBaseSchedule, overrides, toggleOverride, clearOverride };
}
```

### `// src/hooks/useDailyCompletions.js`

```js
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, writeBatch, increment } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useMidnightTick } from './useMidnightTick';

export function useDailyCompletions() {
  const [completions, setCompletions] = useState({});
  const [loading, setLoading] = useState(true);
  
  const todayStr = useMidnightTick();

  useEffect(() => {
    const q = query(collection(db, 'completions'), where('date', '==', todayStr));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const comps = {};
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.choreId) {
          comps[data.choreId] = true;
          if (data.completedBy) {
            comps[`${data.choreId}_claimer`] = data.completedBy;
          }
        }
      });
      setCompletions(comps);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [todayStr]);

  const toggleCompletion = async (chore, memberId, isCurrentlyDone) => {
    if (!memberId) return;
    const currentTodayStr = new Date().toDateString();
    const compId = `${chore.id}-${currentTodayStr}`;
    const compRef = doc(db, 'completions', compId);
    const memberRef = doc(db, 'familyMembers', memberId);
    
    const batch = writeBatch(db);
    const numericPoints = Number(chore.points) || 0;

    if (isCurrentlyDone) {
      batch.delete(compRef);
      batch.set(memberRef, { points: increment(-numericPoints) }, { merge: true });
    } else {
      batch.set(compRef, {
        choreId: chore.id,
        date: currentTodayStr,
        completedBy: memberId,
        points: numericPoints,
        timestamp: new Date()
      });
      batch.set(memberRef, { points: increment(numericPoints) }, { merge: true });
    }

    try {
      await batch.commit();
    } catch (error) {
      console.error("Error toggling chore:", error);
      alert("Failed to update chore. Are you offline?");
    }
  };

  return { completions, loading, toggleCompletion };
}
```

### `// src/hooks/useDailyContent.js`

```js
// src/hooks/useDailyContent.js
import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useMidnightTick } from './useMidnightTick';

export function useDailyContent() {
  const [content, setContent] = useState({ text: '', type: 'loading' });
  const [loading, setLoading] = useState(true);
  const todayStr = useMidnightTick();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const dateId = `${month}-${day}`;
        
        // 1. HARD OVERRIDE: Check for Special Days / Birthdays FIRST
        const overrideRef = doc(db, 'dailyContent', dateId);
        const overrideSnap = await getDoc(overrideRef);
        if (overrideSnap.exists()) {
          setContent({ text: overrideSnap.data().text, type: 'override' });
          setLoading(false);
          return; // Skip the rest of the logic entirely!
        }

        // 2. BULLETPROOF DATE MATH: Calculate exact integer days since epoch
        // Using Date.UTC at local midnight prevents Daylight Savings Time shifts 
        // from causing fractions that flip the day over mid-afternoon.
        const localMidnightUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
        const daysSinceEpoch = Math.floor(localMidnightUTC / 86400000);
        
        // 3. Alternate Days: Even days = Facts, Odd days = Jokes
        const isJokeDay = daysSinceEpoch % 2 === 1;

        if (isJokeDay) {
          // Check if we already fetched a joke for TODAY (prevents refresh re-rolls)
          const cachedDate = localStorage.getItem('daily_joke_date');
          if (cachedDate === dateId) {
            setContent({ text: localStorage.getItem('daily_joke_text'), type: 'joke' });
          } else {
            // FIX: Added cache: 'no-store' so the browser doesn't feed us a repeating cached joke!
            const jokeRes = await fetch('https://icanhazdadjoke.com/', { 
              headers: { Accept: 'application/json' },
              cache: 'no-store'
            });
            const jokeData = await jokeRes.json();
            
            localStorage.setItem('daily_joke_date', dateId);
            localStorage.setItem('daily_joke_text', jokeData.joke);
            setContent({ text: jokeData.joke, type: 'joke' });
          }
        } else {
          // FETCH FACTS
          const factsRef = collection(db, 'dailyContent');
          const q = query(factsRef, where('type', '==', 'fact'));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            // Sort by ID to ensure all devices have the exact same array order
            const facts = querySnapshot.docs
              .sort((a, b) => a.id.localeCompare(b.id))
              .map(d => d.data().text);
            
            // FIX: Deterministic picking. Steps through the array 1 by 1 based on the date.
            // Never repeats until the entire list has been shown!
            const deterministicFact = facts[daysSinceEpoch % facts.length];
            setContent({ text: deterministicFact, type: 'fact' });
          } else {
            setContent({ text: "Did you know? Our database is currently empty! Add some facts in the admin panel.", type: 'fact' });
          }
        }
      } catch (error) {
        console.error("Error fetching daily content:", error);
        setContent({ text: "Why did the computer cross the road? To get to the other site!", type: 'joke' });
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [todayStr]);

  return { content, loading };
}
```

### `// src/hooks/useEvents.js`

```js
import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up a real-time listener on the calendarEvents collection
    const eventsRef = collection(db, 'calendarEvents');
    
    const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching calendar events:", error);
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Helper to delete a single event
  const deleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await deleteDoc(doc(db, 'calendarEvents', eventId));
    }
  };

  // Helper to delete a multi-day event group
  const deleteEventGroup = async (groupId) => {
    const groupEvents = events.filter(e => e.groupId === groupId);
    if (window.confirm(`This event spans ${groupEvents.length} days. Delete the entire event?`)) {
      const batch = writeBatch(db);
      groupEvents.forEach(event => {
        batch.delete(doc(db, 'calendarEvents', event.id));
      });
      await batch.commit();
    }
  };

  return { events, loading, deleteEvent, deleteEventGroup };
}
```

### `// src/hooks/useFamilyMembers.js`

```js
import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { DEFAULT_MEMBERS } from '../constants/defaults';

export function useFamilyMembers() {
  // We use your hardcoded defaults as the initial state so the screen is never blank
  const [members, setMembers] = useState(DEFAULT_MEMBERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const membersRef = collection(db, 'familyMembers');
    
    // onSnapshot sets up a real-time listener. Any time the database changes, 
    // this instantly runs and updates our React state.
    const unsubscribe = onSnapshot(membersRef, (snapshot) => {
      if (!snapshot.empty) {
        const fetchedMembers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMembers(fetchedMembers);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching family members:", error);
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return { members, loading };
}
```

### `// src/hooks/useKiosk.js`

```js
import { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useKiosk() {
  const [config, setConfig] = useState({
    manualDim: false,
    manualMute: false,
    dimIntensity: 0.85,
    quietTimeEnabled: false,
    quietTimeStart: '20:00',
    quietTimeEnd: '07:00'
  });
  
  const [isQuietTime, setIsQuietTime] = useState(false);
  const [isTemporarilyAwake, setIsTemporarilyAwake] = useState(false);
  
  const [isKioskDevice, setIsKioskDevice] = useState(() => localStorage.getItem('isKioskDevice') === 'true');

  const wakeTimerRef = useRef(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'kiosk'), (docSnap) => {
      if (docSnap.exists()) {
        setConfig(prev => ({ ...prev, ...docSnap.data() }));
      }
    });
    return () => unsub();
  }, []);

  // Minute-by-Minute schedule checker with safe fallbacks
  useEffect(() => {
    if (!config.quietTimeEnabled) {
      setIsQuietTime(false);
      return;
    }

    const checkTime = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const startTime = config.quietTimeStart || '20:00';
      const endTime = config.quietTimeEnd || '07:00';

      const [startH, startM] = startTime.split(':').map(Number);
      const startMinutes = startH * 60 + startM;

      const [endH, endM] = endTime.split(':').map(Number);
      const endMinutes = endH * 60 + endM;

      let active = false;
      if (startMinutes < endMinutes) {
        active = currentMinutes >= startMinutes && currentMinutes < endMinutes;
      } else {
        active = currentMinutes >= startMinutes || currentMinutes < endMinutes;
      }
      setIsQuietTime(active);
    };

    checkTime(); 
    const interval = setInterval(checkTime, 60000); 
    return () => clearInterval(interval);
  }, [config.quietTimeEnabled, config.quietTimeStart, config.quietTimeEnd]);

  useEffect(() => {
    if (!isKioskDevice) return; 

    const handleActivity = () => {
      setIsTemporarilyAwake(true);
      if (wakeTimerRef.current) clearTimeout(wakeTimerRef.current);
      wakeTimerRef.current = setTimeout(() => {
        setIsTemporarilyAwake(false);
      }, 60000); 
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('mousemove', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('mousemove', handleActivity);
      if (wakeTimerRef.current) clearTimeout(wakeTimerRef.current);
    };
  }, [isKioskDevice]);

  const toggleKioskMode = (enabled) => {
    localStorage.setItem('isKioskDevice', enabled);
    setIsKioskDevice(enabled);
  };

  const isBaseDimmed = config.manualDim || isQuietTime;
  const isDimmed = isKioskDevice ? (isBaseDimmed && !isTemporarilyAwake) : false;
  const isMuted = isKioskDevice ? (config.manualMute || isQuietTime) : false;

  return { isDimmed, isMuted, dimIntensity: config.dimIntensity, isKioskDevice, toggleKioskMode };
}
```

### `// src/hooks/useMessageCentre.js`

```js
import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const DEFAULT_MESSAGE = { 
  title: 'Family Notice', 
  content: '', 
  isActive: true,
  type: 'info'
};

export function useMessageCentre() {
  const [messageData, setMessageData] = useState(DEFAULT_MESSAGE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const primaryRef = doc(db, 'settings', 'messageCentre');
    const legacyRef = doc(db, 'systemSettings', 'messageCentre');

    const unsub = onSnapshot(primaryRef, 
      (docSnap) => {
        if (!isMounted) return;
        if (docSnap.exists()) {
          setMessageData(docSnap.data());
          setLoading(false);
        } else {
          // Check legacy path
          getDoc(legacyRef).then(legacySnap => {
            if (!isMounted) return;
            if (legacySnap.exists()) {
              setMessageData(legacySnap.data());
            }
            setLoading(false);
          }).catch(() => {
            if (isMounted) setLoading(false);
          });
        }
      },
      (error) => {
        console.warn("Message centre listener fallback:", error);
        getDoc(legacyRef).then(legacySnap => {
          if (!isMounted) return;
          if (legacySnap.exists()) {
            setMessageData(legacySnap.data());
          }
          setLoading(false);
        }).catch(() => {
          if (isMounted) setLoading(false);
        });
      }
    );

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  const saveMessage = async (newData) => {
    try {
      await setDoc(doc(db, 'settings', 'messageCentre'), newData, { merge: true });
    } catch (e) {
      console.error("Error saving message:", e);
    }
    try {
      await setDoc(doc(db, 'systemSettings', 'messageCentre'), newData, { merge: true });
    } catch (e) {}
  };

  return { messageData, loading, saveMessage };
}
```

### `// src/hooks/useMidnightTick.js`

```js
import { useState, useEffect } from 'react';

export function useMidnightTick() {
  const [todayStr, setTodayStr] = useState(() => new Date().toDateString());

  useEffect(() => {
    const checkDate = () => {
      const current = new Date().toDateString();
      setTodayStr((prev) => {
        if (prev !== current) return current;
        return prev;
      });
    };

    // 1. The Standard Heartbeat (every 60 seconds)
    const interval = setInterval(checkDate, 60000);

    // 2. The "Wake Up" Trigger (fires instantly when device screen turns on)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') checkDate();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', checkDate);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', checkDate);
    };
  }, []);

  return todayStr;
}
```

### `// src/hooks/useTheme.js`

```js
import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const THEME_PRESETS = [
  { id: 'default',   label: '🏠 Default',    bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', font: '#1f2937' },
  { id: 'spring',    label: '🌸 Spring',     bg: 'linear-gradient(135deg, #f9a8d4 0%, #86efac 100%)', font: '#1f2937' },
  { id: 'summer',    label: '☀️ Summer',    bg: 'linear-gradient(135deg, #fde68a 0%, #fb923c 100%)', font: '#1f2937' },
  { id: 'fall',      label: '🍂 Fall',       bg: 'linear-gradient(135deg, #d97706 0%, #7c2d12 100%)', font: '#1f2937' },
  { id: 'winter',    label: '❄️ Winter',    bg: 'linear-gradient(135deg, #bfdbfe 0%, #6366f1 100%)', font: '#1f2937' },
  { id: 'halloween', label: '🎃 Halloween',  bg: 'linear-gradient(135deg, #f97316 0%, #111827 100%)', font: '#ffffff' },
  { id: 'christmas', label: '🎄 Christmas',  bg: 'linear-gradient(135deg, #15803d 0%, #dc2626 100%)', font: '#ffffff' },
  { id: 'custom',    label: '🎨 Custom',     bg: '', font: '#1f2937' }
];

export const FONT_OPTIONS = [
  { id: 'system',    label: 'System Default', css: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' },
  { id: 'comic',     label: 'Comic Sans / Casual', css: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", sans-serif' },
  { id: 'serif',     label: 'Classic Serif',  css: 'Georgia, Cambria, "Times New Roman", Times, serif' },
  { id: 'mono',      label: 'Monospace',      css: '"Courier New", Courier, monospace' },
  { id: 'nunito',    label: 'Nunito (Friendly)', css: '"Nunito", sans-serif', google: 'Nunito:wght@400;600;700;800' },
  { id: 'poppins',   label: 'Poppins (Round)',   css: '"Poppins", sans-serif', google: 'Poppins:wght@400;500;600;700' },
  { id: 'rubik',     label: 'Rubik (Soft)',      css: '"Rubik", sans-serif', google: 'Rubik:wght@400;500;600;700' }
];

const DEFAULT_THEME = {
  preset: 'default',
  bgImageUrl: '',
  bgColor: '#667eea',
  fontColor: '#1f2937',
  fontFamily: 'system',
  bgPositionDesktop: 50,
  bgPositionMobile: 50,
  panelOpacity: 90,
  panelBlur: 8
};

export function useTheme() {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const primaryRef = doc(db, 'settings', 'theme');
    const legacyRef = doc(db, 'systemSettings', 'appTheme');

    // Listen to primary settings/theme first
    const unsub = onSnapshot(primaryRef, 
      (docSnap) => {
        if (!isMounted) return;
        if (docSnap.exists()) {
          setTheme(prev => ({ ...prev, ...docSnap.data() }));
          setLoading(false);
        } else {
          // Check legacy path if primary is empty
          getDoc(legacyRef).then(legacySnap => {
            if (!isMounted) return;
            if (legacySnap.exists()) {
              setTheme(prev => ({ ...prev, ...legacySnap.data() }));
            }
            setLoading(false);
          }).catch(() => {
            if (isMounted) setLoading(false);
          });
        }
      },
      (error) => {
        console.warn("Theme listener fallback:", error);
        getDoc(legacyRef).then(legacySnap => {
          if (!isMounted) return;
          if (legacySnap.exists()) {
            setTheme(prev => ({ ...prev, ...legacySnap.data() }));
          }
          setLoading(false);
        }).catch(() => {
          if (isMounted) setLoading(false);
        });
      }
    );

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  const saveTheme = async (newTheme) => {
    try {
      await setDoc(doc(db, 'settings', 'theme'), newTheme, { merge: true });
    } catch (e) {
      console.error("Error saving theme:", e);
    }
    try {
      await setDoc(doc(db, 'systemSettings', 'appTheme'), newTheme, { merge: true });
    } catch (e) {}
  };

  return { theme, loading, saveTheme };
}
```

### `// src/index.css`

```css
@import "tailwindcss";

/* Hide scrollbars for clean kiosk touch panels */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Slim custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.4);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.7);
}

@keyframes bounce-in {
  0% { transform: scale(0.8); opacity: 0; }
  60% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); }
}
.animate-bounce-in {
  animation: bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
```

### `// src/main.jsx`

```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```

### `// src/pages/Home.jsx`

```javascript
import { useState, useEffect, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import MessageCentre from '../components/dashboard/MessageCentre';
import DailyContent from '../components/dashboard/DailyContent';
import Leaderboard from '../components/dashboard/Leaderboard';
import CalendarGrid from '../components/calendar/CalendarGrid';
import ChoresPanel from '../components/chores/ChoresPanel';
import AdminModal from '../components/admin/AdminModal';
import { useTheme, THEME_PRESETS, FONT_OPTIONS } from '../hooks/useTheme';
import { preloadEntireLibrary } from '../utils/audioPlayer';

export default function Home() {
  const [showAdmin, setShowAdmin] = useState(false);
  const { theme } = useTheme();
  const [previewTheme, setPreviewTheme] = useState(null);

  // --- Silent Background Audio Caching ---
  useEffect(() => {
    const cacheLibrary = async () => {
      try {
        const shortSnap = await getDoc(doc(db, 'settings', 'sounds'));
        const celebSnap = await getDoc(doc(db, 'settings', 'celebSounds'));
        
        let urlsToCache = ["https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/ding.mp3"];
        
        if (shortSnap.exists() && shortSnap.data().items) {
          urlsToCache = [...urlsToCache, ...shortSnap.data().items.map(s => s.url)];
        }
        if (celebSnap.exists() && celebSnap.data().items) {
          urlsToCache = [...urlsToCache, ...celebSnap.data().items.map(s => s.url)];
        }
        
        preloadEntireLibrary(urlsToCache);
      } catch (e) {
        console.warn("Background sync paused:", e);
      }
    };
    
    const timer = setTimeout(cacheLibrary, 3000);
    return () => clearTimeout(timer);
  }, []);

  // --- Live Preview Listener ---
  useEffect(() => {
    const handlePreview = (e) => setPreviewTheme(e.detail);
    window.addEventListener('themePreviewUpdate', handlePreview);
    return () => window.removeEventListener('themePreviewUpdate', handlePreview);
  }, []);

  // --- Jump from Quick Add to Admin Chores ---
  useEffect(() => {
    const handleOpenAdmin = () => setShowAdmin(true);
    window.addEventListener('openAdminToChores', handleOpenAdmin);
    return () => window.removeEventListener('openAdminToChores', handleOpenAdmin);
  }, []);

  // --- Multi-tap invisible admin trigger (5 taps in 2.5s) ---
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef(null);

  const handleHiddenAdminTap = () => {
    tapCountRef.current += 1;
    
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 2500);

    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      clearTimeout(tapTimerRef.current);
      setShowAdmin(true);
    }
  };

  const activeTheme = previewTheme || theme;
  const activePreset = THEME_PRESETS.find(p => p.id === activeTheme?.preset) || THEME_PRESETS[0];
  const isCustom = activeTheme?.preset === 'custom';
  
  let bgStyle = '';
  const imgUrlToUse = previewTheme?.bgPreview || activeTheme?.bgImageUrl;

  if (imgUrlToUse) {
    bgStyle = `background-image: url("${imgUrlToUse}"); background-color: ${activeTheme?.bgColor || '#667eea'};`;
  } else if (isCustom) {
    bgStyle = `background: ${activeTheme?.bgColor || '#667eea'};`;
  } else {
    bgStyle = `background: ${activePreset.bg};`;
  }
  
  const activeFontColor = isCustom ? (activeTheme?.fontColor || '#1f2937') : activePreset.font;
  const activeFont = FONT_OPTIONS.find(f => f.id === activeTheme?.fontFamily) || FONT_OPTIONS[0];
  const panelRgba = `rgba(255, 255, 255, ${(activeTheme?.panelOpacity ?? 90) / 100})`;
  const panelBlur = `${activeTheme?.panelBlur ?? 8}px`;

  const [localOverride, setLocalOverride] = useState(() => localStorage.getItem('bgPositionOverride'));
  useEffect(() => {
    const handleOverrideChange = () => setLocalOverride(localStorage.getItem('bgPositionOverride'));
    window.addEventListener('localBgOverrideChanged', handleOverrideChange);
    return () => window.removeEventListener('localBgOverrideChanged', handleOverrideChange);
  }, []);

  const localOverrideActive = localOverride !== null && localOverride !== '';
  const effectiveDesktopPos = localOverrideActive ? localOverride : (activeTheme?.bgPositionDesktop ?? 50);
  const effectiveMobilePos = localOverrideActive ? localOverride : (activeTheme?.bgPositionMobile ?? 50);

  return (
    <>
      {activeFont.google && <link href={`https://fonts.googleapis.com/css2?family=${activeFont.google}&display=swap`} rel="stylesheet" />}
      <style>{`
        body {
          ${bgStyle}
          background-size: cover;
          background-attachment: fixed;
          font-family: ${activeFont.css};
          transition: background 0.3s ease;
        }
        @media (min-width: 768px) { body { background-position: center ${effectiveDesktopPos}%; } }
        @media (max-width: 767px) { body { background-position: ${effectiveMobilePos}% center; } }
        
        :root {
          --glass-panel-bg: ${panelRgba};
          --glass-panel-blur: blur(${panelBlur});
          --theme-font-color: ${activeFontColor};
        }
      `}</style>
      
      <div className="min-h-screen w-full p-4 md:p-6 flex flex-col h-screen overflow-hidden relative">
        <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-5">
          <div className="flex-[2] flex flex-col min-h-0">
            <CalendarGrid />
          </div>
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 pb-4 hide-scrollbar">
            <MessageCentre />
            <DailyContent />
            <Leaderboard />
            <ChoresPanel />
          </div>
        </div>

        <div 
          onClick={handleHiddenAdminTap}
          className="fixed bottom-0 left-0 w-16 h-16 z-40 cursor-default select-none bg-transparent"
          title=""
          aria-hidden="true"
        />

        <AdminModal isOpen={showAdmin} onClose={() => setShowAdmin(false)} />
      </div>
    </>
  );
}
```

### `// src/utils/audioPlayer.js`

```js
const activeAudios = {};

export const preloadMedia = (url) => {
  if (!url || activeAudios[url]) return;
  
  // Using native Audio object bypasses CORS restrictions entirely
  const audio = new Audio(url);
  audio.preload = 'auto'; 
  activeAudios[url] = audio;
};

export const playAudio = (url, onEnded = null) => {
  if (!url) {
    if (onEnded) onEnded();
    return;
  }
  
  if (!activeAudios[url]) {
    preloadMedia(url);
  }
  
  const audio = activeAudios[url];
  if (audio) {
    const playClone = audio.cloneNode();
    playClone.volume = 1.0;
    
    if (onEnded) {
      playClone.onended = onEnded;
    }
    
    playClone.play().catch(e => {
      console.warn('Audio play blocked:', e);
      if (onEnded) onEnded(); 
    });
  } else {
    if (onEnded) onEnded();
  }
};

export const preloadEntireLibrary = (urls) => {
  console.log(`[Media Engine] Native background caching of ${urls.length} files...`);
  urls.forEach(url => {
    if (url) preloadMedia(url);
  });
};
```

### `// src/utils/cloudflareUploader.js`

```js
// src/utils/cloudflareUploader.js

const IMAGE_WORKER_URL = "https://schell-calendar-images.matthew-schell.workers.dev";
const IMAGE_UPLOAD_SECRET = "schell-calendar-2026";

/**
 * Uploads a Blob/File to the custom Cloudflare Worker R2 bucket.
 * @param {Blob|File} blob - The file to upload (compressed or raw).
 * @param {string} filename - The target filename in the bucket.
 * @returns {Promise<string>} The public URL of the uploaded file.
 */
export const uploadToCloudflare = async (blob, filename) => {
  const formData = new FormData();
  formData.append('file', blob, filename);

  const response = await fetch(`${IMAGE_WORKER_URL}/upload`, {
    method: 'POST',
    headers: { 
      'X-Upload-Secret': IMAGE_UPLOAD_SECRET 
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Cloudflare upload failed with status ${response.status}`);
  }

  const data = await response.json();
  
  if (data.url) {
    return data.url;
  } else {
    throw new Error('Cloudflare worker did not return a valid URL.');
  }
};
```

### `// src/utils/dateHelpers.js`

```js
export function getCalendarData(currentDate) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get the number of days in the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Get the day of the week the month starts on (0 = Sunday, 6 = Saturday)
  const startingDayOfWeek = new Date(year, month, 1).getDay();
  
  // Get the full name of the month and year for the header
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  // Today's exact date string for highlighting the current day
  const todayStr = new Date().toDateString();

  return { daysInMonth, startingDayOfWeek, monthName, todayStr, year, month };
}

export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
```

### `// src/utils/holidays.js`

```js
// Math helpers to calculate floating holidays
const _nthWeekday = (y, month, weekday, n) => {
  const d = new Date(y, month, 1);
  let count = 0;
  while (true) {
    if (d.getDay() === weekday) {
      count++;
      if (count === n) return new Date(d);
    }
    d.setDate(d.getDate() + 1);
  }
};

const _lastWeekdayBefore = (y, month, day, weekday) => {
  const d = new Date(y, month, day);
  while (d.getDay() !== weekday) d.setDate(d.getDate() - 1);
  return d;
};

// Complex algorithm to calculate Easter Sunday
const _getEaster = (y) => {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100;
  const d2 = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d2 - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(y, month, day);
};

export const getHolidaysForYear = (year) => {
  const easter = _getEaster(year);
  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);
  
  const canadaDay = new Date(year, 6, 1); // July 1st
  if (canadaDay.getDay() === 0) canadaDay.setDate(2); // Observed on Monday if it falls on Sunday

  return [
    { date: new Date(year, 0, 1),                        name: "New Year's Day",   emoji: '🍁' },
    { date: _nthWeekday(year, 1, 1, 3),                  name: "Family Day",       emoji: '🍁' },
    { date: goodFriday,                                  name: "Good Friday",      emoji: '🍁' },
    { date: canadaDay,                                   name: "Canada Day",       emoji: '🍁' },
    { date: _lastWeekdayBefore(year, 4, 24, 1),          name: "Victoria Day",     emoji: '🍁' },
    { date: _nthWeekday(year, 7, 1, 1),                  name: "Civic Holiday",    emoji: '🍁' },
    { date: _nthWeekday(year, 8, 1, 1),                  name: "Labour Day",       emoji: '🍁' },
    { date: _nthWeekday(year, 9, 1, 2),                  name: "Thanksgiving",     emoji: '🍁' },
    { date: new Date(year, 11, 25),                      name: "Christmas Day",    emoji: '🍁' },
    { date: new Date(year, 11, 26),                      name: "Boxing Day",       emoji: '🍁' },
    { date: new Date(year, 1, 14),                       name: "Valentine's Day",  emoji: '💝' },
    { date: new Date(year, 2, 17),                       name: "St. Patrick's Day",emoji: '☘️' },
    { date: easter,                                      name: "Easter Sunday",    emoji: '🐣' },
    { date: _nthWeekday(year, 4, 0, 2),                  name: "Mother's Day",     emoji: '💐' },
    { date: _nthWeekday(year, 5, 0, 3),                  name: "Father's Day",     emoji: '👔' },
  ];
};

// Generate this year and next year so we have overlap
const currentYear = new Date().getFullYear();
export const HOLIDAYS_DATA = [
  ...getHolidaysForYear(currentYear),
  ...getHolidaysForYear(currentYear + 1)
].map(h => ({
  id: `hol-${h.date.toDateString()}-${h.name}`,
  title: `${h.emoji} ${h.name}`,
  date: h.date.toDateString(),
  member: ['misc'], // Tagged as misc so it gets the grey styling
  isHoliday: true
}));

```

### `// src/utils/imageCompression.js`

```js
// src/utils/imageCompression.js

/**
 * Compresses an image file using the browser's native Canvas API.
 * @param {File} file - The original image file from the input.
 * @param {number} maxWidth - Max width of the output image.
 * @param {number} maxHeight - Max height of the output image.
 * @param {number} quality - JPEG compression quality (0.0 to 1.0).
 * @returns {Promise<Blob>} A promise that resolves with the compressed Blob.
 */
export const compressImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      return reject(new Error('Invalid file type provided for compression.'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate aspect ratio preserving dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          // Draw image to canvas, resizing it
          ctx.drawImage(img, 0, 0, width, height);

          // Return the raw Blob directly (prevents 'new File()' crashes on iOS/WebViews)
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Canvas compression failed to generate a blob.'));
              }
            },
            'image/jpeg',
            quality
          );
        } catch (err) {
          reject(err);
        }
      };
      
      img.onerror = () => reject(new Error('Image failed to load onto canvas.'));
    };
    
    reader.onerror = () => reject(new Error('FileReader failed to read the file.'));
  });
};
```

### `// src/utils/seedDatabase.js`

```js
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { DEFAULT_MEMBERS, DEFAULT_CHORES } from '../constants/defaults';

export async function seedFirestore() {
  try {
    console.log("🌱 Seeding family members...");
    for (const member of DEFAULT_MEMBERS) {
      // Writes to the 'familyMembers' collection, using the member's ID as the document ID
      await setDoc(doc(db, 'familyMembers', member.id), member);
    }

    console.log("🌱 Seeding chores...");
    for (const chore of DEFAULT_CHORES) {
      // Writes to the 'chores' collection, using the chore's ID as the document ID
      await setDoc(doc(db, 'chores', chore.id), chore);
    }

    alert("✅ Database successfully seeded! Go check your Firebase Console.");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    alert("❌ Error seeding database. Check the developer console for details.");
  }
}
```

### `// src/utils/testDataHelpers.js`

```js
import { collection, getDocs, query, where, writeBatch, doc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const injectHistoricalData = async () => {
  try {
    // 1. Fetch only the kids
    const membersSnap = await getDocs(collection(db, 'familyMembers'));
    const kids = membersSnap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(m => m.participatesInChores === true || String(m.participatesInChores).toLowerCase() === 'true')
      .map(k => k.id);

    if (kids.length === 0) {
      alert("No kids found to inject data for. Please add kids in the Family Members tab first.");
      return;
    }

    const ops = [];
    
    // Inject data dynamically for the past 60 days ending today, 
    // so it shows up immediately in the history panel.
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date();
    start.setDate(end.getDate() - 60);
    start.setHours(0, 0, 0, 0);

    // 2. Loop through every day in the range
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      kids.forEach(kidId => {
        // ~75% chance a kid did chores on any given day
        if (Math.random() > 0.25) {
          const choreRef = doc(collection(db, 'completions'));
          
          // Set the completion time to 2:00 PM for consistency
          const completionDate = new Date(d);
          completionDate.setHours(14, 0, 0, 0);

          ops.push((batch) => {
            batch.set(choreRef, {
              completedBy: kidId,
              points: Math.floor(Math.random() * 40) + 10, // Random payout between 10-50 pts
              timestamp: Timestamp.fromDate(completionDate),
              isTestData: true // FLAG: Makes it easy to delete later
            });
          });
        }
      });
    }

    // 3. Commit to Firestore in chunks (Firestore limits batches to 500 operations)
    const BATCH_SIZE = 450;
    for (let i = 0; i < ops.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      ops.slice(i, i + BATCH_SIZE).forEach(op => op(batch));
      await batch.commit();
    }

    alert(`Successfully injected ${ops.length} test completions for the past 60 days!`);
  } catch (error) {
    console.error("Error injecting test data:", error);
    alert("Failed to inject test data.");
  }
};

export const removeTestData = async () => {
  try {
    // 1. Query ONLY records that have our test flag
    const q = query(collection(db, 'completions'), where('isTestData', '==', true));
    const snap = await getDocs(q);

    if (snap.empty) {
      alert("No test data found to remove.");
      return;
    }

    const ops = [];
    snap.forEach(docSnap => {
      ops.push((batch) => batch.delete(docSnap.ref));
    });

    // 2. Delete in chunks of 450
    const BATCH_SIZE = 450;
    for (let i = 0; i < ops.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      ops.slice(i, i + BATCH_SIZE).forEach(op => op(batch));
      await batch.commit();
    }

    alert(`Successfully removed ${ops.length} test completions! Your database is clean.`);
  } catch (error) {
    console.error("Error removing test data:", error);
    alert("Failed to remove test data.");
  }
};
```

### `// vite.config.js`

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true // This allows us to test offline mode right now in VS Code!
      },
      workbox: {
        // Cache all the app's code and layout files
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        
        runtimeCaching: [
          {
            // This regex targets your exact Cloudflare R2 bucket URLs
            urlPattern: /^https:\/\/pub-c502b7afe8da4d518eea03a57bdd6e60\.r2\.dev\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'schell-media-cache',
              expiration: {
                maxEntries: 200, // Can hold up to 200 sounds/videos
                maxAgeSeconds: 60 * 60 * 24 * 365 // Keep them for 1 entire year
              },
              cacheableResponse: {
                // Status 200 = Normal download. 
                // Status 0 = Magic CORS bypass. It tells the worker to save it even if Cloudflare complains.
                statuses: [0, 200] 
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Schell Family Calendar',
        short_name: 'Family Calendar',
        description: 'Family Chore and Schedule Tracker',
        theme_color: '#667eea',
        background_color: '#ffffff',
        display: 'standalone', // Makes it look like a real app on mobile (no browser bars)
        icons: [] // You can generate and add app icons here later!
      }
    })
  ],
})
```

