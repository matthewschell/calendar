# Schell Family Calendar - Codebase Snapshot

*Generated on: 5/16/2026, 8:41:53 AM*

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

### `// legacy_code/facts.json`

```json
[
  "[01-01] <b>🎆 Happy New Year!</b> <br><br> Welcome to 2026! Did you know the first New Year's celebration dates back 4,000 years to ancient Babylon?",
  "[02-02] <b>🐿️ Happy Groundhog Day!</b> <br><br> Will Wiarton Willie see his shadow? Did you know groundhogs can whistle when they are alarmed?",
  "[02-14] <b>❤️ Happy Valentine's Day!</b> <br><br> Did you know that the heart symbol was first used to denote love in the 1250s?",
  "[02-16] <b>👨‍👩‍👧‍👦 Happy Family Day!</b> <br><br> Did you know a group of penguins in the water is called a raft, but on land they're called a waddle?",
 "[02-21] <b>🎉 Happy 42 and 2 weeks birthday Daddy!</b> <br><br> Did you know it has been exactly 2 weeks since Daddy's birthday? Sounds like a good reason to celebrate him!", 
  "[03-10] <b>🎮 Happy 12th Birthday Mason!</b> <br><br> Did you know Mason was born at 1:53pm on MAR10 day? He weighed 7lbs 14oz, about as heavy as King Giraffe!",
 "[04-03] <b>🎉 Happy 14th Birthday Madison!</b> <br><br> Did you know you share a birthday with Jane Goodall?",
  "[04-22] <b>🌍 Happy Earth Day!</b> <br><br> Did you know there are more trees on Earth than stars in the Milky Way galaxy?",
  "[05-18] <b>🏕️ Happy Victoria Day!</b> <br><br> It's the unofficial start to summer! Did you know the longest officially recorded flight of a chicken is 13 seconds?",
  "[06-11] <b>🎈 Happy 6th Birthday Hunter!</b> <br><br> Did you know that crocodiles cannot stick their tongues out?",
  "[07-01] <b>🍁 Happy Canada Day!</b> <br><br> Did you know Canada has more lakes than the rest of the world combined?",
  "[09-07] <b>🛠️ Happy Labour Day!</b> <br><br> Did you know the first Canadian Labour Day was celebrated right here in Ontario (Toronto) in 1872?",
  "[10-01] <b>🌟 Happy 8th Birthday Hudson!</b> <br><br> Did you know that astronauts can grow up to 2 inches taller in space?",
  "[10-12] <b>🍂 Happy Thanksgiving!</b> <br><br> Did you know wild turkeys can run up to 20 miles per hour?",
  "[10-31] <b>🎃 Happy Halloween!</b> <br><br> Did you know the heaviest pumpkin ever grown weighed 2,702 pounds?",
  "[11-11] <b>🌺 Remembrance Day</b> <br><br> Lest we forget. Did you know the red poppy became a symbol of remembrance because they were the first flowers to bloom on the battlefields?",
  "[12-31] <b>🥳 New Year's Eve!</b> <br><br> See you next year! Did you know the Times Square ball drop started in 1907?",

"Bananas are curved because they grow towards the sun!",
  "Octopuses have three hearts and blue blood.",
  "Honey never spoils. You could eat 3,000-year-old honey!",
  "Wombat poop is cube-shaped to stop it from rolling away.",
  "A single strand of spaghetti is called a 'spaghetto'.",
  "The unicorn is the national animal of Scotland.",
  "Sloths can hold their breath longer than dolphins can.",
  "Apples float in water because they are 25% air.",
  "Venus is the only planet in our solar system that spins clockwise.",
  "A jiffy is an actual unit of time: 1/100th of a second.",
  "Butterflies taste their food with their feet.",
  "It rains diamonds on Jupiter and Saturn.",
  "Cows have best friends and get sad if they are separated.",
  "A cloud can weigh as much as a million pounds!",
  "The Eiffel Tower gets up to 6 inches taller in the summer heat.",
  "Sharks existed before trees did.",
  "A group of flamingos is called a 'flamboyance'.",
  "Astronauts can grow up to 2 inches taller while in space.",
  "Strawberries are the only fruit with seeds on the outside.",
  "Sea otters hold hands while sleeping so they don't drift apart.",
  "Koalas sleep up to 22 hours a day.",
  "A day on Venus is longer than a year on Venus.",
  "Watermelons are both a fruit and a vegetable.",
  "A flock of crows is known as a 'murder'.",
  "There is a species of jellyfish that is biologically immortal.",
  "Polar bear skin is actually black, and their fur is clear.",
  "A sneeze travels out of your mouth at over 100 miles per hour!",
  "Penguins have an organ above their eyes that converts seawater to freshwater.",
  "Elephants are the only mammals that can't jump.",
  "The shortest commercial flight in the world lasts just 57 seconds.",
  "Pineapples take about two years to grow.",
  "Humans and giraffes have the exact same number of neck bones.",
  "A group of porcupines is called a 'prickle'.",
  "The moon has moonquakes.",
  "A crocodile cannot stick its tongue out.",
  "Tigers have striped skin, not just striped fur.",
  "Pigs can't look up into the sky.",
  "The inventor of the chocolate chip cookie sold the recipe for a lifetime supply of chocolate.",
  "Snails can sleep for up to three years.",
  "A group of owls is called a 'parliament'.",
  "Starfish do not have a brain.",
  "The world's largest desert is Antarctica, not the Sahara.",
  "Hippopotamus milk is pink.",
  "The core of a star can reach temperatures of 15 million degrees Celsius.",
  "A flea can jump 350 times its body length.",
  "Cheetahs can't roar, but they can purr like house cats.",
  "There are more trees on Earth than stars in the Milky Way.",
  "Bears have 42 teeth.",
  "The longest recorded flight of a chicken is 13 seconds.",
  "An ostrich's eye is bigger than its brain.",
  "Rabbits cannot vomit.",
  "The Hawaiian alphabet has only 12 letters.",
  "Armadillo shells are bulletproof.",
  "Some cats are allergic to humans.",
  "You can't hum while holding your nose.",
  "The King of Hearts is the only king in a deck of cards without a mustache.",
  "A blue whale's tongue weighs as much as an elephant.",
  "Ketchup was once sold as medicine.",
  "The first oranges weren't orange—they were green!",
  "Peanuts aren't technically nuts, they are legumes.",
  "Most elephants weigh less than the tongue of a blue whale.",
  "Turtles can breathe through their butts.",
  "Dolphins have names for each other.",
  "A baby puffin is called a 'puffling'.",
  "Squirrels forget where they hide about half of their nuts.",
  "Frogs can freeze solid in the winter and thaw out in the spring.",
  "An ant can carry 50 times its own body weight.",
  "Goats have rectangular pupils.",
  "Cats have 32 muscles in each ear.",
  "A chameleon's tongue is twice the length of its body.",
  "The tiny pocket in jeans was originally designed to hold pocket watches.",
  "Golf balls have on average 336 dimples.",
  "Bubble wrap was originally invented to be used as wallpaper.",
  "Cotton candy was invented by a dentist.",
  "The longest English word without a vowel is 'rhythm'.",
  "A group of hedgehogs is called a 'prickle'.",
  "If you leave a goldfish in a dark room, it will turn white.",
  "Fingernails grow nearly four times faster than toenails.",
  "Bees can fly higher than Mount Everest.",
  "The shortest war in history lasted only 38 minutes.",
  "There is a volcano on Mars that is three times taller than Mount Everest.",
  "Some worms can jump into the air to escape predators.",
  "A giant squid has eyes the size of frisbees.",
  "Kangaroos can't walk backwards.",
  "There are more fake flamingos in the world than real ones.",
  "Sloths are such strong swimmers they can hold their breath underwater for 40 minutes.",
  "A group of ferrets is called a 'business'.",
  "The speed of a computer mouse is measured in 'Mickeys'.",
  "The letter 'J' is the only letter that doesn't appear on the periodic table.",
  "A sneeze can travel up to 27 feet.",
  "Cows produce more milk when listening to calming music.",
  "There is a town in Norway called 'Hell', and it freezes over every winter.",
  "Apples, peaches, and raspberries are all members of the rose family.",
  "The fingerprints of a koala are almost indistinguishable from human fingerprints.",
  "A group of rhinos is called a 'crash'.",
  "In space, metal can weld itself together just by touching.",
  "Tears of joy look different under a microscope than tears of sadness.",
  "Owls don't have eyeballs; they have eye tubes.",
  "The dot over the letter 'i' is called a 'tittle'.",
  "Tornadoes can move as fast as 300 miles per hour.",
  "You share your birthday with at least 9 million other people in the world.",
  "The loudest animal on Earth is the sperm whale.",
  "Mantis shrimp can punch as fast as a bullet.",
  "An adult human is made of about 7 octillion atoms.",
  "A group of jellyfish is called a 'smack'.",
  "Vending machines are twice as likely to kill you as a shark is.",
  "The inventor of the frisbee was turned into a frisbee after he died.",
  "There is a species of spider that lives entirely underwater.",
  "You lose about 50 to 100 hairs a day.",
  "A standard pencil has enough graphite to draw a line 35 miles long.",
  "Banging your head against a wall burns 150 calories an hour (but don't do it!).",
  "Dogs' sense of smell is 10,000 to 100,000 times stronger than ours.",
  "Grapes light on fire if you microwave them.",
  "The longest hiccuping spree lasted 68 years.",
  "Your nose and ears never stop growing.",
  "A group of ravens is called an 'unkindness'.",
  "Some turtles can breathe through their cloaca (their rear end!).",
  "The average person spends 6 months of their life waiting for red lights to turn green.",
  "You can hear a blue whale's heartbeat from 2 miles away.",
  "The oldest known living land animal is a tortoise named Jonathan, born in 1832.",
  "A bolt of lightning is five times hotter than the surface of the sun.",
  "The first alarm clock could only ring at 4:00 AM.",
  "Caterpillars have 12 eyes.",
  "If you sneeze too hard, you can fracture a rib.",
  "A group of lemurs is called a 'conspiracy'.",
  "There are underwater lakes and rivers in the ocean.",
  "A snail breathes through a hole near the front of its body.",
  "Bats are the only mammals capable of sustained flight.",
  "The total weight of all the ants on Earth is about the same as the total weight of all the humans.",
  "Your bones are composed of 31% water.",
  "The original name for the search engine Google was 'Backrub'.",
  "A flock of pigeons is called a 'kit'.",
  "Flamingos are actually born gray, not pink.",
  "A hippo's jaw opens wide enough to fit a sports car inside.",
  "A group of frogs is called an 'army'.",
  "The tongue is the only muscle in the human body that is attached at just one end.",
  "If you drilled a tunnel straight through the Earth and jumped in, it would take exactly 42 minutes to reach the other side.",
  "Venus flytraps can count how many times an insect touches their hairs.",
  "A cluster of bananas is called a 'hand', and a single banana is called a 'finger'.",
  "There is a lake in Australia that is naturally bright pink.",
  "Some sharks glow in the dark.",
  "The average cloud is about the size of a small town.",
  "Hummingbirds are the only birds that can fly backwards.",
  "A newborn kangaroo is about the size of a lima bean.",
  "You take about 20,000 breaths a day.",
  "Some frogs can leap up to 20 times their body length.",
  "Jupiter has 95 officially recognized moons.",
  "There is enough gold in the Earth's core to coat its entire surface in a layer 1.5 feet thick."
]

```

### `// legacy_code/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Schell Family Calendar</title>
  <meta name="robots" content="noindex, nofollow">
  
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>
  
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  
  <script>
    const firebaseConfig = {
        apiKey: "AIzaSyDg-I2BAuXt2sHDJa-ih-B6z5km8HlOl0U",
        authDomain: "family-calendar-ebf3b.firebaseapp.com",
        databaseURL: "https://family-calendar-ebf3b-default-rtdb.firebaseio.com",
        projectId: "family-calendar-ebf3b",
        storageBucket: "family-calendar-ebf3b.firebasestorage.app",
        messagingSenderId: "964895867498",
        appId: "1:964895867498:web:f69b0c636201303a3e4013"
    };
    firebase.initializeApp(firebaseConfig);
    window.database = firebase.database();
  </script>
  
  <style>
    html, body { margin: 0; padding: 0; height: 100%; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { overflow: hidden; }
    * { box-sizing: border-box; }

    /* Desktop: entire app fits in viewport, no page scroll */
    .app-container { width: 100vw; height: 100dvh; overflow: hidden; display: flex; flex-direction: column; }
    .main-container { flex: 1; min-height: 0; display: grid; grid-template-columns: 2fr 1fr; gap: 20px; padding: 20px; overflow: hidden; }
    .calendar-section { display: flex; flex-direction: column; overflow: hidden; background: white; border-radius: 20px; padding: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    .calendar-grid { flex: 1; min-height: 0; display: grid; grid-template-columns: repeat(7, 1fr); grid-auto-rows: 1fr; gap: 0; overflow: hidden; }
    .calendar-day { overflow: hidden; padding: 5px; cursor: pointer; border: 1px solid #e5e7eb; position: relative; }
    .calendar-day-number { font-weight: 700; margin-bottom: 2px; font-size: 13px; }
    .sidebar { display: flex; flex-direction: column; gap: 16px; min-height: 0; overflow: hidden; }
    .sidebar-scroll { flex: 1; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
    
    /* Compact Calendar Events */
    .calendar-event { max-width: 100%; overflow: hidden; font-size: 10px; padding: 2px 4px; margin-bottom: 2px; border-radius: 3px; color: white; cursor: pointer; white-space: nowrap; text-overflow: ellipsis; display: block; }

    @media (max-width: 768px) {
      html, body { overflow: auto; height: auto; }
      body { overflow: auto; }
      .app-container { height: auto; min-height: 100dvh; overflow: auto; }
      .mobile-header { padding: 12px 15px !important; display: flex !important; justify-content: space-between; align-items: center; margin-bottom: 10px !important; }
      .hide-on-mobile { display: none !important; }
      .main-container { display: block !important; padding: 0 !important; gap: 0 !important; overflow: visible !important; height: auto !important; }
      .calendar-section { border-radius: 0 !important; padding: 12px !important; box-shadow: none !important; height: auto !important; min-height: 400px; overflow: visible !important; }
      .calendar-grid { height: auto !important; min-height: 0 !important; grid-auto-rows: 70px !important; overflow: visible !important; }
      .sidebar { overflow: visible !important; height: auto !important; }
      .sidebar-scroll { overflow: visible !important; height: auto !important; }
      .leaderboard-section, .chores-section { border-radius: 0 !important; margin: 0 !important; padding: 20px !important; background: white; }
      .fab-button { display: flex !important; }
      /* Fixed duplicate CSS rule here */
      .add-event-modal, .admin-modal, .edit-member-modal { width: 95% !important; max-width: 95% !important; padding: 20px !important; border-radius: 20px; background: white; }
    }
    /* Touch-friendly select options */
    select option { padding: 12px; font-size: 16px; }
  </style>
</head>
<body>
  <div id="root"></div>

    <script type="module">
    import htm from 'https://unpkg.com/htm?module';
    const html = htm.bind(React.createElement);
    const { useState, useEffect, useRef } = React;


    // Icons
    const Trophy = ({ size = 24, color = "currentColor" }) => (html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color} strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>`);
    const Star = ({ size = 24, color = "currentColor", fill = "none" }) => (html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill=${fill} stroke=${color} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`);
    const X = ({ size = 24, color = "currentColor", onClick, style }) => (html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color} strokeWidth="2" onClick=${onClick} style=${{ cursor: 'pointer', ...style }}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`);
    const Check = ({ size = 24, color = "currentColor" }) => (html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${color} strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`);
    
    const DEFAULT_MEMBERS = [
      { id: 'dad', name: 'Dad', color: '#3B82F6', participatesInChores: false },
      { id: 'mom', name: 'Mom', color: '#EC4899', participatesInChores: false },
      { id: 'madison', name: 'Madison', color: '#8B5CF6', participatesInChores: true, age: 13, signatureSound: 'fairy-chimes', schedule: { type: 'alternating-weeks', referenceDate: '2025-02-11', offset: 0, description: 'Every other week (Tue-Tue)' } },
      { id: 'mason', name: 'Mason', color: '#10B981', participatesInChores: true, age: 11, signatureSound: 'level-up' },
      { id: 'hudson', name: 'Hudson', color: '#F59E0B', participatesInChores: true, age: 7, signatureSound: 'arcade-coin' },
      { id: 'hunter', name: 'Hunter', color: '#EF4444', participatesInChores: true, age: 5, signatureSound: 'victory-fanfare' }
    ];
    
    const DEFAULT_CHORES = [
      { id: 'dishwasher', name: 'Empty Dishwasher', assignedTo: 'mason', points: 10, frequency: 'daily' },
      { id: 'cat-litter', name: 'Clean Cat Litter', assignedTo: 'madison', points: 15, frequency: 'weekly' },
      { id: 'room-madison', name: 'Clean Room', assignedTo: 'madison', points: 5, frequency: 'daily' }
    ];

    const IMAGE_WORKER_URL = "https://schell-calendar-images.matthew-schell.workers.dev";
    const IMAGE_UPLOAD_SECRET = "schell-calendar-2026"; 
    const ADMIN_PIN = "8486"; 
    const APP_VERSION = "v1.1.0";

    // --- Authentic MP3 Sound Library ---
    const AUDIO_BASE = "https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/";
    const SOUNDS = [
      { id: 'ac-nh',        label: '🍃 Animal Crossing NH',    file: 'Animal%20Crossing%20NH.mp3' },
      { id: 'bluey',        label: '🐶 Bluey Hooray',          file: 'Bluey%20Bingo%20Hooray.mp3' },
      { id: 'bosun',        label: '⚓ Bosun Whistle',         file: 'BosunWhistle.mp3' },
      { id: 'cash',         label: '💵 Cash Register',         file: 'CashRegister.mp3' },
      { id: 'chase',        label: '🚓 Chase is on the Case',  file: 'Chase%20is%20on%20the%20case.mp3' },
      { id: 'crow',         label: '🐦 Crow',                  file: 'Crow%20.mp3' },
      { id: 'ding',         label: '🔔 Ding',                  file: 'ding.mp3' },
      { id: 'duckhunt',     label: '🦆 Duck Hunt',             file: 'Duck%20hunt.mp3' },
      { id: 'siren',        label: '🚨 Fire Siren',            file: 'FireSiren.mp3' },
      { id: 'ghostbusters', label: '👻 Ghostbusters',          file: 'Ghostbusters%20.mp3' },
      { id: 'goat',         label: '🐐 Goat',                  file: 'Goat.mp3' },
      { id: 'owl',          label: '🦉 Great Horned Owl',      file: 'Great%20Horned%20Owl.mp3' },
      { id: 'laser',        label: '💥 Laser Sound',           file: 'Laser%20Sound.mp3' },
      { id: 'mario-ac',     label: '🍄 Mario Animal Crossing', file: 'Mario%20Animal%20Crossing.mp3' },
      { id: 'mario-coin',   label: '🪙 Mario Coin',            file: 'Mario%20Coin.mp3' },
      { id: 'mario-grow',   label: '🍄 Mario Grow',            file: 'MarioGrow.mp3' },
      { id: 'mc-levelup',   label: '🟩 Minecraft Level Up',    file: 'Minecraft%20level%20up%20sou.mp3' },
      { id: 'switch',       label: '🎮 Nintendo Switch',       file: 'Nintendo%20switch.mp3' },
      { id: 'peppa',        label: '🐷 Peppa Pig',             file: 'Peppa.mp3' },
      { id: 'pikachu',      label: '⚡ Pikachu',               file: 'Picachu.mp3' },
      { id: 'racing',       label: '🏎️ Racing Car',            file: 'Racing%20car.mp3' },
      { id: 'roblox-cel',   label: '🟦 Roblox Celebration',    file: 'Roblox%20celebration.mp3' },
      { id: 'roblox-yay',   label: '🟦 Roblox Yay',           file: 'Roblox%20yay.mp3' },
      { id: 'scream-goat',  label: '🐐 Screaming Goat',        file: 'Screaming%20goat.mp3' },
      { id: 'slide',        label: '🤪 Slide Whistle',         file: 'Slide%20whistle.mp3' },
      { id: 'tng-door',     label: '🖖 TNG Door',              file: 'TNG_Door.mp3' },
      { id: 'train',        label: '🚂 Train Horn',            file: 'Train%20horn.mp3' },
      { id: 'walle',        label: '🤖 Wall-E WHOA',           file: 'Wall-E%20WHOA%20.mp3' },
      { id: 'yeeps-alarm',  label: '🚨 Yeeps Alarm',           file: 'Yeeps%20alarm.mp3' },
      { id: 'yeeps-start',  label: '🏁 Yeeps Round Start',     file: 'Yeeps%20round%20start.mp3' },
      { id: 'yoshi',        label: '🦖 Yoshi',                 file: 'yoshi.mp3' },
      { id: 'vecna-clock',  label: '🕰️ Vecna\'s Clock',        file: 'VecnaClock.mp3' },
    ];

    let _soundMuted = false; // Kept in sync by the component via useEffect

    const playSignatureSound = (soundId) => {
      if (_soundMuted) return;
      const sound = SOUNDS.find(s => s.id === soundId);
      if (!sound) return;
      const audio = new Audio(`${AUDIO_BASE}${sound.file}`);
      audio.play().catch(e => console.log('Audio error:', e));
    };

    const triggerGrandConfetti = () => {
      const duration = 3000;
      const end = Date.now() + duration;
      const frame = () => {
        window.confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, zIndex: 100002 });
        window.confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, zIndex: 100002 });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    };

    const triggerFireworks = () => {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 6;

        // Left burst — large gold/yellow stars shooting upward
        window.confetti({
          particleCount,
          angle: randomInRange(55, 125),
          spread: 60,
          startVelocity: randomInRange(55, 75),
          decay: 0.92,
          scalar: 2.5,
          shapes: ['star'],
          colors: ['#FFD700','#FFA500','#FF4500','#FF69B4','#00BFFF','#7FFF00','#ffffff'],
          ticks: 200,
          gravity: 0.8,
          origin: { x: randomInRange(0.1, 0.4), y: 0.9 },
          zIndex: 100002,
        });

        // Right burst — same but offset
        window.confetti({
          particleCount,
          angle: randomInRange(55, 125),
          spread: 60,
          startVelocity: randomInRange(55, 75),
          decay: 0.92,
          scalar: 2.5,
          shapes: ['star'],
          colors: ['#FFD700','#FFA500','#FF4500','#FF69B4','#00BFFF','#7FFF00','#ffffff'],
          ticks: 200,
          gravity: 0.8,
          origin: { x: randomInRange(0.6, 0.9), y: 0.9 },
          zIndex: 100002,
        });
      }, 400);
    };

    const TouchDropdown = ({ options, initialValue, onChange, domId, color }) => {
      const [isOpen, setIsOpen] = useState(false);
      const [currentVal, setCurrentVal] = useState(initialValue || options[0].id);
      const [dropdownStyle, setDropdownStyle] = useState({});
      const triggerRef = useRef(null);
      const selectedLabel = options.find(o => o.id === currentVal)?.label || 'Select...';

      const openDropdown = () => {
        if (triggerRef.current) {
          const rect = triggerRef.current.getBoundingClientRect();
          const spaceBelow = window.innerHeight - rect.bottom;
          const listHeight = Math.min(250, options.length * 52);
          const openUpward = spaceBelow < listHeight && rect.top > listHeight;
          setDropdownStyle({
            position: 'fixed',
            left: rect.left,
            width: rect.width,
            zIndex: 99999,
            maxHeight: '250px',
            overflowY: 'auto',
            background: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            ...(openUpward
              ? { bottom: window.innerHeight - rect.top + 4 }
              : { top: rect.bottom + 4 })
          });
        }
        setIsOpen(true);
      };

      return (
        html`<div style=${{ position: 'relative', width: '100%' }}>
          ${domId && html`<input type="hidden" id=${domId} value=${currentVal} />`}
          <div
            ref=${triggerRef}
            onClick=${() => isOpen ? setIsOpen(false) : openDropdown()}
            style=${{ width: '100%', padding: '14px', fontSize: '16px', borderRadius: '8px', border: `2px solid ${color || '#e5e7eb'}`, background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', minHeight: '52px', boxSizing: 'border-box' }}
          >
            <span style=${{ color: '#374151', fontWeight: '500' }}>${selectedLabel}</span>
            <span style=${{ fontSize: '14px', color: '#6b7280' }}>${isOpen ? '▲' : '▼'}</span>
          </div>
          ${isOpen && (
            html`<${React.Fragment}>
              
              <div onClick=${() => setIsOpen(false)} style=${{ position: 'fixed', inset: 0, zIndex: 99998 }} />
              <div style=${dropdownStyle}>
                ${options.map(opt => (
                  html`<div
                    key=${opt.id}
                    onClick=${() => {
                      setCurrentVal(opt.id);
                      setIsOpen(false);
                      if (onChange) onChange(opt.id);
                    }}
                    style=${{ padding: '16px 14px', fontSize: '16px', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', background: currentVal === opt.id ? '#eef2ff' : 'white', color: '#1f2937', position: 'relative', zIndex: 99999 }}
                  >
                    ${opt.label}
                  </div>`
                ))}
              </div>
            <//>`
          )}
        </div>`
      );
    };

    // ── Ontario Holidays — computed once at module load, never on re-render ──
    const _nthWeekday = (y, month, weekday, n) => {
      const d = new Date(y, month, 1); let count = 0;
      while (true) { if (d.getDay() === weekday) { count++; if (count === n) return new Date(d); } d.setDate(d.getDate() + 1); }
    };
    const _lastWeekdayBefore = (y, month, day, weekday) => {
      const d = new Date(y, month, day);
      while (d.getDay() !== weekday) d.setDate(d.getDate() - 1);
      return d;
    };
    const _getEaster = (y) => {
      const a = y % 19, b = Math.floor(y/100), c = y % 100;
      const d2 = Math.floor(b/4), e = b % 4;
      const f = Math.floor((b+8)/25), g = Math.floor((b-f+1)/3);
      const h = (19*a + b - d2 - g + 15) % 30;
      const i = Math.floor(c/4), k = c % 4;
      const l = (32 + 2*e + 2*i - h - k) % 7;
      const m = Math.floor((a + 11*h + 22*l)/451);
      const month = Math.floor((h + l - 7*m + 114)/31) - 1;
      const day = ((h + l - 7*m + 114) % 31) + 1;
      return new Date(y, month, day);
    };
    const getHolidaysForYear = (year) => {
      const easter = _getEaster(year);
      const goodFriday = new Date(easter); goodFriday.setDate(easter.getDate() - 2);
      const canadaDay = new Date(year, 6, 1);
      if (canadaDay.getDay() === 0) canadaDay.setDate(2);
      return [
        { date: new Date(year, 0, 1),                        name: "New Year's Day",   emoji: '🍁' },
        { date: _nthWeekday(year, 1, 1, 3),                  name: "Family Day",        emoji: '🍁' },
        { date: goodFriday,                                   name: "Good Friday",       emoji: '🍁' },
        { date: canadaDay,                                    name: "Canada Day",        emoji: '🍁' },
        { date: _lastWeekdayBefore(year, 4, 24, 1),          name: "Victoria Day",      emoji: '🍁' },
        { date: _nthWeekday(year, 7, 1, 1),                  name: "Civic Holiday",     emoji: '🍁' },
        { date: _nthWeekday(year, 8, 1, 1),                  name: "Labour Day",        emoji: '🍁' },
        { date: _nthWeekday(year, 9, 1, 2),                  name: "Thanksgiving",      emoji: '🍁' },
        { date: new Date(year, 11, 25),                      name: "Christmas Day",     emoji: '🍁' },
        { date: new Date(year, 11, 26),                      name: "Boxing Day",        emoji: '🍁' },
        { date: new Date(year, 1, 14),                       name: "Valentine's Day",   emoji: '💝' },
        { date: new Date(year, 2, 17),                       name: "St. Patrick's Day", emoji: '☘️' },
        { date: easter,                                      name: "Easter Sunday",     emoji: '🐣' },
        { date: _nthWeekday(year, 4, 0, 2),                  name: "Mother's Day",      emoji: '💐' },
        { date: _nthWeekday(year, 5, 0, 3),                  name: "Father's Day",      emoji: '👔' },
      ];
    };
    const _currentYear = new Date().getFullYear();
    const HOLIDAYS_DATA = [
      ...getHolidaysForYear(_currentYear),
      ...getHolidaysForYear(_currentYear + 1)
    ].map(h => ({
      id: `hol-${h.date.toDateString()}-${h.name}`,
      title: `${h.emoji} ${h.name}`,
      date: h.date.toDateString(),
      member: ['misc'],
      isHoliday: true
    }));

    // ── Theme & font config — also module-level constants ─────────────────────
    const THEME_PRESETS = [
      { id: 'default',   label: '🏠 Default',    bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontColor: '#1f2937' },
      { id: 'spring',    label: '🌸 Spring',     bg: 'linear-gradient(135deg, #f9a8d4 0%, #86efac 100%)', fontColor: '#1f2937' },
      { id: 'summer',    label: '☀️ Summer',    bg: 'linear-gradient(135deg, #fde68a 0%, #fb923c 100%)', fontColor: '#1f2937' },
      { id: 'fall',      label: '🍂 Fall',       bg: 'linear-gradient(135deg, #d97706 0%, #7c2d12 100%)', fontColor: '#fff5eb' },
      { id: 'winter',    label: '❄️ Winter',    bg: 'linear-gradient(135deg, #bfdbfe 0%, #6366f1 100%)', fontColor: '#1e1b4b' },
      { id: 'halloween', label: '🎃 Halloween',  bg: 'linear-gradient(135deg, #f97316 0%, #111827 100%)', fontColor: '#fde68a' },
      { id: 'christmas', label: '🎄 Christmas',  bg: 'linear-gradient(135deg, #15803d 0%, #dc2626 100%)', fontColor: '#fef9c3' },
      { id: 'custom',    label: '🎨 Custom',     bg: '',                                                   fontColor: '#1f2937' },
    ];
    const FONT_OPTIONS = [
      { id: 'system',    label: 'System Default', css: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', google: null },
      { id: 'nunito',    label: 'Nunito',          css: '"Nunito", sans-serif',    google: 'Nunito:wght@400;600;700' },
      { id: 'poppins',   label: 'Poppins',         css: '"Poppins", sans-serif',   google: 'Poppins:wght@400;600;700' },
      { id: 'quicksand', label: 'Quicksand',       css: '"Quicksand", sans-serif', google: 'Quicksand:wght@400;600;700' },
      { id: 'lato',      label: 'Lato',            css: '"Lato", sans-serif',      google: 'Lato:wght@400;700' },
      { id: 'raleway',   label: 'Raleway',         css: '"Raleway", sans-serif',   google: 'Raleway:wght@400;600;700' },
      { id: 'montserrat',label: 'Montserrat',      css: '"Montserrat", sans-serif',google: 'Montserrat:wght@400;600;700' },
      { id: 'pacifico',  label: 'Pacifico ✦',     css: '"Pacifico", cursive',     google: 'Pacifico' },
      { id: 'caveat',    label: 'Caveat ✦',        css: '"Caveat", cursive',       google: 'Caveat:wght@400;700' },
      { id: 'comic',     label: 'Comic Neue ✦',   css: '"Comic Neue", cursive',   google: 'Comic+Neue:wght@400;700' },
    ];

    function FamilyCalendar() {
      const [currentDate, setCurrentDate] = useState(new Date());
      const [events, setEvents] = useState([]);
      const [holidays, setHolidays] = useState([]);
      const [choreCompletions, setChoreCompletions] = useState({});
      const [scores, setScores] = useState({});
      const [showAddEvent, setShowAddEvent] = useState(false);
      // Removed unused selectedDate state
      const [newEvent, setNewEvent] = useState({ title: '', member: [], time: '', endTime: '', date: '', endDate: '' });
      const [editingEvent, setEditingEvent] = useState(null);
      const [showAdmin, setShowAdmin] = useState(false);
      const [adminOpen, setAdminOpen] = useState({});
      const [familyMembers, setFamilyMembers] = useState(DEFAULT_MEMBERS);
      const [chores, setChores] = useState(DEFAULT_CHORES);
      const [editingMember, setEditingMember] = useState(null);
      const [showClaimChore, setShowClaimChore] = useState(null);
      const [celebratingKid, setCelebratingKid] = useState(null);
      const [scheduleOverrides, setScheduleOverrides] = useState({});
      const [isDimmed, setIsDimmed] = useState(false);
      const [alwaysOnDisplay, setAlwaysOnDisplay] = useState(() => localStorage.getItem('alwaysOnDisplay') === 'true');
      const [quietTimeStart, setQuietTimeStart] = useState('20:00');
      const [quietTimeEnd, setQuietTimeEnd] = useState('07:00');
      const [dimIntensity, setDimIntensity] = useState(() => parseInt(localStorage.getItem('dimIntensity') || '50', 10));
      const [isMuted, setIsMuted] = useState(false);
      const [autoMuteEnabled, setAutoMuteEnabled] = useState(() => localStorage.getItem('autoMuteEnabled') === 'true');
      const [isAutoMuted, setIsAutoMuted] = useState(false);
      const [isTempMuted, setIsTempMuted] = useState(false);
      const [isTempDimmed, setIsTempDimmed] = useState(false);
      const [pushConfirm, setPushConfirm] = useState(null);
      const [showAllowanceSummary, setShowAllowanceSummary] = useState(true);
      const [completionBonus, setCompletionBonus] = useState(25);
      const [selectedKidSummary, setSelectedKidSummary] = useState(null);
      const [scoreHistory, setScoreHistory] = useState([]);
      const [showDayView, setShowDayView] = useState(false);
      const [dayViewDate, setDayViewDate] = useState(null);
      const [imageUploadStatus, setImageUploadStatus] = useState('');
      const [editingChore, setEditingChore] = useState(null);
      const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
      const [showPinEntry, setShowPinEntry] = useState(false);
      const [selectedHistoryDate, setSelectedHistoryDate] = useState(null);
      const [isAutoDimmed, setIsAutoDimmed] = useState(false);
      const [isOffline, setIsOffline] = useState(!navigator.onLine);
      const [allowProfileEditing, setAllowProfileEditing] = useState(false);
      const [kidProfileUploading, setKidProfileUploading] = useState(false);
      const interactionTimerRef = useRef(null); // Fix: Using useRef for the timeout to prevent re-renders
      const [dailyContent, setDailyContent] = useState({ text: '', type: '', date: '' });
      const [weather, setWeather] = useState(null);
      const [weatherForecast, setWeatherForecast] = useState([]);
      const [showWeatherForecast, setShowWeatherForecast] = useState(false);
      const [theme, setTheme] = useState({
        preset: 'default',
        bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        bgColor: '',
        bgImageUrl: '',
        bgPosition: '50',
        bgMobilePosition: '50',
        fontFamily: 'system',
        fontColor: '#1f2937',
        greeting: ''
      });
      
      const lastConfigWriteTime = useRef(0);
      const lastDailyWriteTime = useRef(0);
      const lastLocalOverrideTime = useRef(Date.now());
      const firebaseHasLoaded = useRef(false);
      const dailyHasLoaded = useRef(false);
      const hasMigrated = useRef(false);
      const [bgHeight, setBgHeight] = useState(() => window.innerHeight); 

      // Online/Offline detection
      useEffect(() => {
        const goOffline = () => setIsOffline(true);
        const goOnline  = () => setIsOffline(false);
        window.addEventListener('offline', goOffline);
        window.addEventListener('online',  goOnline);
        return () => { window.removeEventListener('offline', goOffline); window.removeEventListener('online', goOnline); };
      }, []);

      // Ontario Holidays — seed from pre-computed module-level constant (runs once)
      useEffect(() => { setHolidays(HOLIDAYS_DATA); }, []);


      // Firebase Sync - Read
      // Three separate listeners with independent write-time guards so a config write
      // on one device never blocks incoming chore completions from another device.
      useEffect(() => {
        const dbRef    = window.database.ref('schellFamilyCalendar');
        const dailyRef = window.database.ref('schellFamilyDaily');
        const histRef  = window.database.ref('schellFamilyHistory');
        
        // Config listener — blocked only by recent config writes
        dbRef.on('value', (snapshot) => {
          if (Date.now() - lastConfigWriteTime.current < 3000) return;
          const data = snapshot.val();
          
          firebaseHasLoaded.current = true;
          
          if (data) {
            if (data.events) setEvents(data.events);
            if (data.familyMembers) setFamilyMembers(data.familyMembers);
            if (data.choresList) setChores(data.choresList);
            if (data.scheduleOverrides) setScheduleOverrides(data.scheduleOverrides);
            if (data.theme) setTheme(data.theme);
            if (data.showAllowanceSummary !== undefined) setShowAllowanceSummary(data.showAllowanceSummary);
            if (data.allowProfileEditing !== undefined) setAllowProfileEditing(data.allowProfileEditing);
            if (data.completionBonus !== undefined) setCompletionBonus(data.completionBonus);
            if (data.quietTimeStart !== undefined) setQuietTimeStart(data.quietTimeStart);
            if (data.quietTimeEnd !== undefined) setQuietTimeEnd(data.quietTimeEnd);

            // Targeted per-setting forced broadcasts — each key has its own timestamp
            // so pushing one setting never re-applies stale values for others
            if (data.forcedSettings) {
              const fs = data.forcedSettings;

              const applyIfNewer = (key, setter, storageKey) => {
                if (fs[key] && fs[key].ts > lastLocalOverrideTime.current) {
                  setter(fs[key].value);
                  if (storageKey) localStorage.setItem(storageKey, fs[key].value);
                  if (fs[key].ts > lastLocalOverrideTime.current) lastLocalOverrideTime.current = fs[key].ts;
                }
              };

              applyIfNewer('dimIntensity', setDimIntensity, 'dimIntensity');
              applyIfNewer('autoMuteEnabled', setAutoMuteEnabled, 'autoMuteEnabled');
              applyIfNewer('alwaysOnDisplay', setAlwaysOnDisplay, 'alwaysOnDisplay');
              applyIfNewer('isDimmed', setIsDimmed);
              applyIfNewer('isMuted', setIsMuted);

              // Temp mute/dim: time-limited commands, always apply regardless of local override time
              if (fs.mutedUntil !== undefined) {
                const until = fs.mutedUntil.value !== undefined ? fs.mutedUntil.value : fs.mutedUntil;
                localStorage.setItem('tempMutedUntil', until);
                setIsTempMuted(Date.now() < until);
              }
              if (fs.dimmedUntil !== undefined) {
                const until = fs.dimmedUntil.value !== undefined ? fs.dimmedUntil.value : fs.dimmedUntil;
                localStorage.setItem('tempDimmedUntil', until);
                setIsTempDimmed(Date.now() < until);
              }
            }

            // STRICT ONE-TIME MIGRATION: runs once per session, moves old data to
            // new dedicated nodes and deletes it from the root so it never runs again
            if (!hasMigrated.current) {
              hasMigrated.current = true;
              if (data.scoreHistory) {
                window.database.ref('schellFamilyHistory').set(data.scoreHistory);
                window.database.ref('schellFamilyCalendar/scoreHistory').remove();
              }
              if (data.choreCompletions || data.scores) {
                window.database.ref('schellFamilyDaily').update({
                  choreCompletions: data.choreCompletions || null,
                  scores: data.scores || null
                });
                window.database.ref('schellFamilyCalendar/choreCompletions').remove();
                window.database.ref('schellFamilyCalendar/scores').remove();
              }
            }
          }
        });

        // Daily listener — blocked only by recent daily writes, never by config changes
        dailyRef.on('value', (snapshot) => {
          dailyHasLoaded.current = true;
          const data = snapshot.val();
          if (data) {
            if (data.choreCompletions) setChoreCompletions(data.choreCompletions);
            if (data.scores) setScores(data.scores);
          }
        });

        // History listener — blocked only by recent daily writes
        histRef.on('value', (snapshot) => {
          const raw = snapshot.val();
          if (!raw) return;
          // Firebase may return an object with numeric keys instead of a true array
          const histData = Array.isArray(raw) ? raw : Object.values(raw);
          const todayStr = new Date().toDateString();
          const cleanedHistory = histData.filter(h => h && h.date && h.date !== todayStr);
          setScoreHistory(cleanedHistory);
        });

        return () => { dbRef.off(); dailyRef.off(); histRef.off(); };
      }, []);

      // Firebase Sync - Write
      // Config write: events, members, chores, theme, settings
      const saveConfigTimeoutRef = useRef(null);
      const isInitialConfigMount = useRef(true);
      useEffect(() => {
        if (isInitialConfigMount.current) { isInitialConfigMount.current = false; return; }
        lastConfigWriteTime.current = Date.now();
        if (saveConfigTimeoutRef.current) clearTimeout(saveConfigTimeoutRef.current);
        saveConfigTimeoutRef.current = setTimeout(() => {
          window.database.ref('schellFamilyCalendar').update({
            events, familyMembers, choresList: chores, scheduleOverrides, theme, showAllowanceSummary, allowProfileEditing, completionBonus, quietTimeStart, quietTimeEnd
          });
        }, 1000);
      }, [events, familyMembers, chores, scheduleOverrides, theme, showAllowanceSummary, allowProfileEditing, completionBonus, quietTimeStart, quietTimeEnd]);





      useEffect(() => {
        const font = FONT_OPTIONS.find(f => f.id === theme.fontFamily);
        if (!font || !font.google) return;
        const id = `gfont-${font.id}`;
        if (document.getElementById(id)) return;
        const link = document.createElement('link');
        link.id = id; link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;
        document.head.appendChild(link);
      }, [theme.fontFamily]);

      const appBg = (() => {
        if (theme.preset !== 'custom') {
          if (theme.bgImageUrl) return { backgroundImage: `url(${theme.bgImageUrl})`, backgroundSize: 'cover' };
          const preset = THEME_PRESETS.find(p => p.id === theme.preset);
          return { background: preset ? preset.bg : THEME_PRESETS[0].bg };
        }
        if (theme.bgImageUrl && theme.bgColor) return {
          backgroundColor: theme.bgColor,
          backgroundImage: `url(${theme.bgImageUrl})`,
          backgroundSize: 'cover'
        };
        if (theme.bgImageUrl) return { backgroundImage: `url(${theme.bgImageUrl})`, backgroundSize: 'cover' };
        if (theme.bgColor) return { background: theme.bgColor };
        return { background: THEME_PRESETS[0].bg };
      })();
      
      const appFontCss = FONT_OPTIONS.find(f => f.id === theme.fontFamily)?.css || FONT_OPTIONS[0].css;
      const panelBg = theme.bgImageUrl ? 'rgba(255,255,255,0.82)' : 'white';
      
      const navColor = (() => {
        if (theme.bgColor) return theme.bgColor;
        const preset = THEME_PRESETS.find(p => p.id === theme.preset) || THEME_PRESETS[0];
        const match = preset.bg.match(/#[0-9a-fA-F]{3,6}|rgb\([^)]+\)/);
        return match ? match[0] : '#667eea';
      })();

      // Keep track of the freshest state without triggering re-renders
      const latestState = useRef({ scores, choreCompletions, familyMembers, chores, scoreHistory, completionBonus, quietTimeStart, quietTimeEnd });
      useEffect(() => {
        latestState.current = { scores, choreCompletions, familyMembers, chores, scoreHistory, completionBonus, quietTimeStart, quietTimeEnd };
      });

      // Midnight Reset & Chore Cleanup (Bulletproof Multi-Day Catch-Up)
      const hasCheckedRollover = useRef(false);

      useEffect(() => {
        const checkRollover = async () => {
          if (!firebaseHasLoaded.current || !dailyHasLoaded.current) return;
          if (hasCheckedRollover.current) return;
          hasCheckedRollover.current = true;

          // Fetch absolute truth directly from Firebase — bypasses React state timing entirely
          const [dailySnap, calSnap, histSnap] = await Promise.all([
            window.database.ref('schellFamilyDaily').once('value'),
            window.database.ref('schellFamilyCalendar').once('value'),
            window.database.ref('schellFamilyHistory').once('value')
          ]);

          const dailyData = dailySnap.val() || {};
          const calData = calSnap.val() || {};
          const rawHist = histSnap.val();

          const curComps = dailyData.choreCompletions || {};
          const curScores = dailyData.scores || {};
          const curMembers = calData.familyMembers || [];
          const curChores = calData.choresList || [];
          const curBonus = calData.completionBonus !== undefined ? calData.completionBonus : 25;
          const curHist = !rawHist ? [] : Array.isArray(rawHist) ? rawHist : Object.values(rawHist);

          const now = new Date();
          now.setHours(0, 0, 0, 0);
          const todayStr = now.toDateString();
          const kids = curMembers.filter(m => m.participatesInChores);

          let latestArchiveStr = null;
          if (curHist.length > 0) {
            const latestEntry = curHist.reduce((latest, current) => {
              return new Date(current.date) > new Date(latest.date) ? current : latest;
            });
            latestArchiveStr = latestEntry.date;
          }

          const latestArchiveDate = new Date(latestArchiveStr);
          latestArchiveDate.setHours(0, 0, 0, 0);
          const expectedArchiveDate = new Date(now);
          expectedArchiveDate.setDate(expectedArchiveDate.getDate() - 1);

          if (latestArchiveDate < expectedArchiveDate) {
            let iterDate = new Date(latestArchiveDate);
            iterDate.setDate(iterDate.getDate() + 1);

            let newHistoryEntries = [];
            let isFirstMissedDay = true;

            while (iterDate <= expectedArchiveDate) {
              const dateStrToArchive = iterDate.toDateString();
              const archiveEntry = { date: dateStrToArchive, scores: {} };

              const dailyChoresDone = {};
              if (isFirstMissedDay) {
                Object.keys(curComps).forEach(key => {
                  if (key.endsWith(`-${dateStrToArchive}`) && !key.includes('-claimer') && curComps[key]) {
                    if (key.startsWith('bonus-')) {
                      const completedBy = key.replace('bonus-', '').replace(`-${dateStrToArchive}`, '');
                      if (!dailyChoresDone[completedBy]) dailyChoresDone[completedBy] = [];
                      dailyChoresDone[completedBy].push({ name: '🏆 Daily Completion Bonus', points: curBonus, wasBonus: true });
                    } else {
                      const choreId = key.replace(`-${dateStrToArchive}`, '');
                      const chore = curChores.find(c => c.id === choreId);
                      if (chore) {
                        const claimerId = curComps[`${key}-claimer`];
                        const completedBy = claimerId || chore.assignedTo;
                        if (!dailyChoresDone[completedBy]) dailyChoresDone[completedBy] = [];
                        dailyChoresDone[completedBy].push({ name: chore.name, points: chore.points, wasBonus: !chore.assignedTo || chore.assignedTo === 'unassigned' });
                      }
                    }
                  }
                });
              }

              kids.forEach(kid => {
                const kidPayRate = kid.payRate !== undefined ? kid.payRate : 0.01;
                archiveEntry.scores[kid.id] = {
                  name: kid.name,
                  score: isFirstMissedDay ? (curScores[kid.id] || 0) : 0,
                  payRate: kidPayRate,
                  choresDone: isFirstMissedDay ? (dailyChoresDone[kid.id] || []) : []
                };
              });

              if (iterDate.getDay() === 6) {
                kids.forEach(kid => {
                  let weeklyPoints = 0;
                  for (let i = 0; i < 7; i++) {
  const d = new Date(iterDate);
  d.setDate(d.getDate() - i);
  const dStr = d.toDateString();
  // FIX: Catch Saturday's data from the live archiveEntry before it hits the history array
  let entry = (i === 0) ? archiveEntry : (newHistoryEntries.find(h => h.date === dStr) || curHist.find(h => h.date === dStr));
  if (entry && entry.scores && entry.scores[kid.id]) {
    weeklyPoints += entry.scores[kid.id].score;
  }
}
                  const livePayRate = kid.payRate !== undefined ? kid.payRate : 0.01;
                  const weeklyTotal = weeklyPoints * livePayRate;
                  if (weeklyTotal > 0 || (archiveEntry.scores[kid.id].score > 0)) {
                    archiveEntry.scores[kid.id].choresDone.push({
                      name: `💰 Weekly Allowance Payout: $${weeklyTotal.toFixed(2)}`,
                      points: 0,
                      wasBonus: true
                    });
                  }
                });
              }

              newHistoryEntries.unshift(archiveEntry);
              isFirstMissedDay = false;
              iterDate.setDate(iterDate.getDate() + 1);
            }

            const newDates = new Set(newHistoryEntries.map(h => h.date));
            const finalHistory = [...newHistoryEntries, ...curHist.filter(h => !newDates.has(h.date))].slice(0, 365);
            setScoreHistory(finalHistory);
            window.database.ref('schellFamilyHistory').set(finalHistory);

            // Snapshot completions to backup before resetting — never overwritten
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            const backupKey = yesterday.toISOString().slice(0, 10);
            const compsToBackup = { ...curComps };
            window.database.ref(`schellFamilyBackup/${backupKey}`).once('value').then(snap => {
              if (!snap.exists()) {
                window.database.ref(`schellFamilyBackup/${backupKey}`).set(compsToBackup);
              }
              // Prune backups older than 365 days
              window.database.ref('schellFamilyBackup').once('value').then(allSnap => {
                const allBackups = allSnap.val();
                if (allBackups) {
                  const cutoffStr = new Date(Date.now() - 365 * 864e5).toISOString().slice(0, 10);
                  const cleanupUpdates = {};
                  Object.keys(allBackups).forEach(key => { if (key < cutoffStr) cleanupUpdates[key] = null; });
                  if (Object.keys(cleanupUpdates).length > 0) window.database.ref('schellFamilyBackup').update(cleanupUpdates);
                }
              });

              // Prune archived chores older than 365 days
              const choresCutoff = new Date(Date.now() - 365 * 864e5).toISOString().slice(0, 10);
              const prunedChores = curChores.filter(c => !(c.isArchived && c.archivedDate && c.archivedDate < choresCutoff));
              if (prunedChores.length !== curChores.length) {
                setChores(prunedChores);
              }
            });

            const resetScores = {};
            kids.forEach(kid => { resetScores[kid.id] = 0; });
            setScores(resetScores);
            window.database.ref('schellFamilyDaily/scores').set(resetScores);
          }

          // Cleanup old completions
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - 35);
          setChoreCompletions(prev => {
            const updated = { ...prev };
            Object.keys(updated).forEach(key => {
              const match = key.match(/([A-Z][a-z]{2} [A-Z][a-z]{2} \d{1,2} \d{4})/);
              if (match && new Date(match[1]) < cutoffDate) delete updated[key];
            });
            window.database.ref('schellFamilyDaily/choreCompletions').set(updated);
            return updated;
          });
        };

        // Poll until both DB nodes are loaded before running rollover on boot
        const bootInterval = setInterval(() => {
          if (firebaseHasLoaded.current && dailyHasLoaded.current && !hasCheckedRollover.current) {
            checkRollover().catch(e => console.error('Rollover error:', e));
            clearInterval(bootInterval);
          }
        }, 200);

        // Midnight clock checker
        const clockInterval = setInterval(() => {
          const now = new Date();
          if (now.getHours() === 0 && now.getMinutes() === 0) {
            hasCheckedRollover.current = false;
            checkRollover().catch(e => console.error('Rollover error:', e));
          }
        }, 60000);

        return () => { clearInterval(bootInterval); clearInterval(clockInterval); };
      }, []);


      const isQuietTimeActive = React.useCallback(() => {
        const startStr = quietTimeStart || '20:00';
        const endStr = quietTimeEnd || '07:00';
        const now = new Date();
        const currentStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        if (startStr > endStr) {
          return currentStr >= startStr || currentStr < endStr;
        } else {
          return currentStr >= startStr && currentStr < endStr;
        }
      }, [quietTimeStart, quietTimeEnd]);

      useEffect(() => {
        const checkTime = () => {
          if (!alwaysOnDisplay) { setIsAutoDimmed(false); return; }
          setIsAutoDimmed(isQuietTimeActive());
        };
        checkTime();
        const interval = setInterval(checkTime, 60000);
        return () => clearInterval(interval);
      }, [alwaysOnDisplay, isQuietTimeActive]);

      useEffect(() => {
        const checkMuteTime = () => {
          if (!autoMuteEnabled) { setIsAutoMuted(false); return; }
          setIsAutoMuted(isQuietTimeActive());
        };
        checkMuteTime();
        const interval = setInterval(checkMuteTime, 60000);
        return () => clearInterval(interval);
      }, [autoMuteEnabled, isQuietTimeActive]);

      // Keep module-level mute flag in sync with React state
      useEffect(() => {
        _soundMuted = isMuted || isAutoMuted || isTempMuted;
      }, [isMuted, isAutoMuted, isTempMuted]);

      // Poll every 10s to auto-clear expired temp mute/dim
      useEffect(() => {
        const interval = setInterval(() => {
          const mutedUntil = parseInt(localStorage.getItem('tempMutedUntil') || '0', 10);
          const dimmedUntil = parseInt(localStorage.getItem('tempDimmedUntil') || '0', 10);
          setIsTempMuted(Date.now() < mutedUntil);
          setIsTempDimmed(Date.now() < dimmedUntil);
        }, 10000);
        return () => clearInterval(interval);
      }, []);

      // Refactored handleInteraction using useRef
      const handleInteraction = () => {
        if (isAutoDimmed) {
          if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
          setIsAutoDimmed(false);
          interactionTimerRef.current = setTimeout(() => {
            const startStr = latestState.current.quietTimeStart || '20:00';
            const endStr = latestState.current.quietTimeEnd || '07:00';
            const now = new Date();
            const currentStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
            const shouldDim = startStr > endStr ? (currentStr >= startStr || currentStr < endStr) : (currentStr >= startStr && currentStr < endStr);
            if (shouldDim) setIsAutoDimmed(true);
          }, 30000);
        }
      };

      useEffect(() => {
        const events = ['click', 'touchstart', 'mousemove'];
        events.forEach(event => document.addEventListener(event, handleInteraction));
        return () => {
          events.forEach(event => document.removeEventListener(event, handleInteraction));
        };
      }, [isAutoDimmed]); 

      useEffect(() => {
        const fetchDailyContent = async () => {
          const now = new Date();
          const today = now.toDateString();
          const dayOfMonth = now.getDate();
          const isJokeDay = dayOfMonth % 2 === 1;
          
          // Create the MM-DD tag for today (e.g., "04-03" or "12-25")
          const mm = String(now.getMonth() + 1).padStart(2, '0');
          const dd = String(now.getDate()).padStart(2, '0');
          const dateTag = `[${mm}-${dd}]`;

          if (dailyContent.date === today) return;

          try {
            // 1. Always fetch the facts array first to check for a special date
            const factsRes = await fetch('https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/facts.json');
            const factsArray = await factsRes.json();
            
            // 2. Look for a fact that exactly matches today's tag
            const specialFact = factsArray.find(f => typeof f === 'string' && f.startsWith(dateTag));

            if (specialFact) {
              // Special date found! Override the joke/fact system entirely.
              // Strip the [MM-DD] tag off before displaying it.
              const cleanText = specialFact.replace(dateTag, '').trim();
              setDailyContent({ text: cleanText, type: 'fact', date: today });
            } else if (isJokeDay) {
              // Normal odd day: fetch a Dad Joke
              const res = await fetch('https://icanhazdadjoke.com/', { headers: { 'Accept': 'application/json' } });
              const data = await res.json();
              setDailyContent({ text: data.joke, type: 'joke', date: today });
            } else {
              // Normal even day: pick a consistent safe fact based on the day of the year
              // We filter out the special tagged facts so they don't show up randomly!
              const normalFacts = factsArray.filter(f => !f.match(/^\[\d{2}-\d{2}\]/));
              const dayOfYear = Math.floor((new Date() - new Date(now.getFullYear(), 0, 0)) / 86400000);
              const safeFact = normalFacts[dayOfYear % normalFacts.length];
              
              setDailyContent({ text: safeFact, type: 'fact', date: today });
            }
          } catch (err) {
            console.error('Failed to fetch daily content:', err);
          }
        };

        fetchDailyContent();
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const msUntilMidnight = tomorrow - now;
        const timeout = setTimeout(fetchDailyContent, msUntilMidnight);
        return () => clearTimeout(timeout);
      }, [dailyContent.date]);
      

      const fetchWeather = React.useCallback(async () => {
        try {
          const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=43.8975&longitude=-78.9429&current=temperature_2m,apparent_temperature,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&temperature_unit=celsius&timezone=America/Toronto&forecast_days=7');
          const data = await res.json();
          
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            feelsLike: Math.round(data.current.apparent_temperature),
            condition: getWeatherDescription(data.current.weather_code),
            icon: data.current.weather_code
          });
          
          const todayStr = new Date().toDateString();
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const forecast = data.daily.time.map((dateStr, idx) => {
            const dayDate = new Date(dateStr + 'T00:00:00'); 
            
            const formatTime = (isoTime) => {
              if (!isoTime) return null;
              const time = isoTime.split('T')[1]?.substring(0, 5);
              if (!time) return null;
              const [hour, min] = time.split(':');
              const h = parseInt(hour);
              const ampm = h >= 12 ? 'PM' : 'AM';
              const h12 = h % 12 || 12;
              return `${h12}:${min} ${ampm}`;
            };
            
            return {
              date: dateStr,
              dateObj: dayDate,
              isToday: dayDate.toDateString() === todayStr,
              maxTemp: Math.round(data.daily.temperature_2m_max[idx]),
              minTemp: Math.round(data.daily.temperature_2m_min[idx]),
              condition: getWeatherDescription(data.daily.weather_code[idx]),
              icon: data.daily.weather_code[idx],
              sunrise: formatTime(data.daily.sunrise[idx]),
              sunset: formatTime(data.daily.sunset[idx])
            };
          }).filter(day => day.dateObj >= today);
          
          setWeatherForecast(forecast);
        } catch (err) {
          console.error('Failed to fetch weather:', err);
        }
      }, []);

      useEffect(() => {
        fetchWeather();
        const interval = setInterval(fetchWeather, 1800000); 
        return () => clearInterval(interval);
      }, [fetchWeather]);
      const getWeatherEmoji = (code) => {
        if (code === 0 || code === 1) return '☀️';
        if (code === 2) return '🌤️';
        if (code === 3) return '☁️';
        if (code === 45 || code === 48) return '🌫️';
        if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return '🌧️';
        if ([56, 57, 66, 67, 71, 73, 75, 77, 85, 86].includes(code)) return '🌨️';
        if ([95, 96, 99].includes(code)) return '⛈️';
        return '🌤️';
      };

      const getWeatherDescription = (code) => {
        const codes = {
          0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
          45: 'Foggy', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
          55: 'Dense drizzle', 56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
          61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain', 66: 'Light freezing rain',
          67: 'Heavy freezing rain', 71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
          77: 'Snow grains', 80: 'Slight rain showers', 81: 'Moderate rain showers',
          82: 'Violent rain showers', 85: 'Slight snow showers', 86: 'Heavy snow showers',
          95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
        };
        return codes[code] || 'Unknown';
      };

      const isHereToday = (member) => {
        const override = scheduleOverrides[member.id];
        if (override && override.date === new Date().toDateString()) {
          return override.isHere;
        }

        if (!member.schedule || member.schedule.type !== 'alternating-weeks') {
          return true;
        }

        const today = new Date(); today.setHours(0,0,0,0);
        const refDate = new Date(member.schedule.referenceDate + 'T00:00:00'); refDate.setHours(0,0,0,0);

        const prevTuesday = (d) => { const r = new Date(d); const dow = r.getDay(); r.setDate(r.getDate() - (dow < 2 ? dow + 5 : dow - 2)); return r; };

        const todayTue = prevTuesday(today);
        const refTue = prevTuesday(refDate);

        const daysDiff = Math.round((todayTue - refTue) / 86400000);
        const weeksDiff = Math.floor(daysDiff / 7);

        return weeksDiff % 2 === (member.schedule.offset || 0);
      };

      const uploadImageToCloudflare = async (file, isBackground = false) => {
        // Compress the image before uploading
        const compressedBlob = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
              const maxWidth = isBackground ? 1920 : 400;
              const maxHeight = isBackground ? 1920 : 400;
              let width = img.width;
              let height = img.height;

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

              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);

              canvas.toBlob((blob) => {
                resolve(blob);
              }, 'image/jpeg', isBackground ? 0.85 : 0.8);
            };
            img.onerror = reject;
          };
          reader.onerror = reject;
        });

        const formData = new FormData();
        // Replace original extension with .jpg
        const safeName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
        formData.append('file', compressedBlob, safeName);
        
        const res = await fetch(`${IMAGE_WORKER_URL}/upload`, {
          method: 'POST',
          headers: { 'X-Upload-Secret': IMAGE_UPLOAD_SECRET },
          body: formData,
        });
        const data = await res.json();
        if (!data.url) throw new Error('Upload failed');
        return data.url;
      };

      const deleteImageFromCloudflare = async (imageUrl) => {
        if (!imageUrl || !imageUrl.includes('r2.dev')) return;
        try {
          await fetch(`${IMAGE_WORKER_URL}/delete`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'X-Upload-Secret': IMAGE_UPLOAD_SECRET
            },
            body: JSON.stringify({ url: imageUrl })
          });
        } catch (err) {
          console.error('Failed to delete old image:', err);
        }
      };

      const addFamilyMember = (memberData) => {
        setFamilyMembers([...familyMembers, { ...memberData, id: Date.now().toString() }]);
      };
      
      const updateFamilyMember = (id, updatedMember) => {
        setFamilyMembers(familyMembers.map(m => m.id === id ? { ...m, ...updatedMember } : m));
      };

      const deleteFamilyMember = (id) => {
        if (confirm(`Delete this member? Their calendar events will be kept.`)) {
          setFamilyMembers(familyMembers.filter(m => m.id !== id));
          const newScores = { ...scores }; delete newScores[id]; setScores(newScores);
        }
      };
      
      const addChore = (chore) => { setChores([...chores, { ...chore, id: Date.now().toString() }]); };
      const deleteChore = (id) => { if (confirm(`Archive this chore? It will be removed from your daily lists but kept in the background to protect past score history.`)) { setChores(chores.map(c => c.id === id ? { ...c, isArchived: true, archivedDate: new Date().toISOString().slice(0, 10) } : c)); } };

      useEffect(() => {
        const todayStr = new Date().toDateString();
        const expired = chores.filter(c => c.todayOnly && c.createdDate !== todayStr);
        if (expired.length > 0) {
          setChores(chores.filter(c => !(c.todayOnly && c.createdDate !== todayStr)));
        }
      }, [chores]);

      const openEditEvent = (event, e) => {
        if (e) e.stopPropagation();
        const rawStart = event.isMultiDay && event.startDate ? event.startDate : event.date;
        const rawEnd   = event.isMultiDay && event.endDate   ? event.endDate   : '';
        const toISO = (str) => { const d = new Date(str); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
        setEditingEvent(event);
        setNewEvent({
          title:   event.title,
          member:  Array.isArray(event.member) ? event.member : [event.member],
          time:    event.time    || '',
          endTime: event.endTime || '',
          date:    toISO(rawStart),
          endDate: rawEnd ? toISO(rawEnd) : ''
        });
        setShowAddEvent(true);
      };

      const confirmDeleteEvent = (event) => {
        if (event.isMultiDay && event.groupId) {
          const dayCount = events.filter(e => e.groupId === event.groupId).length;
          return confirm(`"${event.title}" spans ${dayCount} days. This will delete the entire event. Are you sure?`);
        }
        return confirm(`Delete "${event.title}"?`);
      };

      const closeEventModal = () => {
        setShowAddEvent(false);
        setEditingEvent(null);
        setNewEvent({ title: '', member: [], time: '', endTime: '', date: '', endDate: '' });
      };

      const openAdmin = () => {
        if (isAdminAuthenticated) {
          setShowAdmin(true);
        } else {
          setShowPinEntry(true);
        }
      };

      const getEventsForDate = (date) => {
        const dateStr = date.toDateString();
        const calendarEvents = events.filter(e => e.date === dateStr);
        const holidayEvents = holidays.filter(h => h.date === dateStr);
        return [...holidayEvents, ...calendarEvents];
      };
      const { daysInMonth, startingDayOfWeek } = (() => {
          const y = currentDate.getFullYear(), m = currentDate.getMonth();
          return { daysInMonth: new Date(y, m + 1, 0).getDate(), startingDayOfWeek: new Date(y, m, 1).getDay() };
      })();
      const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      const today = new Date().toDateString();
      const kids = familyMembers.filter(m => m.participatesInChores).sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));
      
      return (
        html`<${React.Fragment}>
          <style>${`
            .responsive-bg { background-position: center ${theme.bgPosition ?? 50}%; }
            @media (max-width: 768px) {
              .responsive-bg { background-position: ${theme.bgMobilePosition ?? 50}% center !important; }
            }
          `}</style>

        <div className="responsive-bg" style=${{ position: 'fixed', top: 0, left: 0, width: '100vw', height: `${bgHeight}px`, zIndex: -1, ...appBg }} />

        <div className="app-container" style=${{ fontFamily: appFontCss }}>

          ${(isDimmed || isAutoDimmed || isTempDimmed) && html`<div style=${{ position: 'fixed', inset: 0, background: `rgba(0,0,0,${(dimIntensity / 100).toFixed(2)})`, pointerEvents: 'none', zIndex: 999 }}></div>`}

          ${isOffline && (
            html`<div style=${{ position: 'sticky', top: 0, zIndex: 998, background: '#ef4444', color: 'white', textAlign: 'center', padding: '10px 16px', fontSize: '14px', fontWeight: '700', letterSpacing: '0.2px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              ⚠️ You are offline. Changes will not save until you reconnect.
            </div>`
          )}
          
          <div className="mobile-header" style=${{ display: 'none', padding: '15px', background: 'rgba(0,0,0,0.2)' }}>
            <h1 style=${{ fontSize: '19px', margin: 0, color: 'white', lineHeight: '1.2' }}>The Schells' Family Calendar</h1>
            <button onClick=${openAdmin} style=${{ background: 'rgba(255,255,255,0.2)', border: '2px solid white', borderRadius: '12px', padding: '8px 12px', fontSize: '20px' }}>⚙️</button>
          </div>

          <div className="main-container">
            
            <div className="calendar-section" style=${{ background: theme.bgImageUrl ? 'rgba(255,255,255,0.12)' : panelBg, backdropFilter: 'none' }}>
              <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <button onClick=${() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} style=${{ background: navColor, color: 'white', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>←</button>
                <div style=${{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <h1 style=${{ fontSize: '26px', margin: 0 }}>${monthName}</h1>
                  ${(currentDate.getFullYear() !== new Date().getFullYear() || currentDate.getMonth() !== new Date().getMonth()) && (
                    html`<button
                      onClick=${() => setCurrentDate(new Date())}
                      style=${{ background: navColor, color: 'white', border: 'none', borderRadius: '20px', padding: '3px 14px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', opacity: 0.9, letterSpacing: '0.3px' }}
                    >
                      ↩ Today
                    </button>`
                  )}
                </div>
                <div>
                    <button className="hide-on-mobile" onClick=${openAdmin} style=${{ background: navColor, color: 'white', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '18px', marginRight: '10px', cursor: 'pointer', opacity: 0.8 }}>⚙️</button>
                    <button onClick=${() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} style=${{ background: navColor, color: 'white', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>→</button>
                </div>
              </div>
              
              <div style=${{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #e5e7eb', marginBottom: '0' }}>
                ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => html`<div key=${d} style=${{ textAlign: 'center', fontWeight: '600', color: '#6b7280', padding: '4px', fontSize: '12px' }}>${d}</div>`)}
              </div>
              
              <div className="calendar-grid">
                ${[...Array(startingDayOfWeek)].map((_, i) => html`<div key=${`e-${i}`} style=${{ borderBottom: '1px solid rgba(200,200,200,0.4)', borderRight: '1px solid rgba(200,200,200,0.4)', background: theme.bgImageUrl ? 'rgba(255,255,255,0.12)' : 'transparent' }} />`)}
                ${[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const isToday = date.toDateString() === today;
                  return (
                    html`<div key=${day} className="calendar-day" onClick=${() => { 
                      setDayViewDate(date);
                      setShowDayView(true);
                    }} style=${{
                      background: theme.bgImageUrl
                        ? (isToday ? 'rgba(255, 254, 195, 0.95)' : 'rgba(255,255,255,0.80)')
                        : (isToday ? '#fef3c7' : 'white'),
                      border: isToday
                        ? '1px solid #808080'
                        : theme.bgImageUrl ? '1px solid rgba(180,180,180,0.8)' : '1px solid #e5e7eb',
                      margin: isToday ? '0px' : '0', zIndex: isToday ? 1 : 0
                    }}>
                      <div className="calendar-day-number" style=${{ textShadow: theme.bgImageUrl ? '0 1px 2px rgba(255,255,255,0.9)' : 'none', color: '#111827' }}>${day}</div>
                      ${getEventsForDate(date).map(e => (
                        html`<div key=${e.id} className="calendar-event" onClick=${(ev) => { if (!e.isHoliday) openEditEvent(e, ev); else ev.stopPropagation(); }} style=${{ 
                          background: (() => {
                            if (!e.member) return '#ccc';
                            if (typeof e.member === 'string') return familyMembers.find(m => m.id === e.member)?.color || '#ccc';
                            if (e.member.includes('family')) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                            if (e.member.includes('misc')) return 'transparent';
                            if (e.member.length === 1) return familyMembers.find(m => m.id === e.member[0])?.color || '#ccc';
                            return 'linear-gradient(90deg, ' + e.member.filter(m => m !== 'family' && m !== 'misc').map(mid => familyMembers.find(fm => fm.id === mid)?.color || '#ccc').join(', ') + ')';
                          })(),
                          color: e.member?.includes('misc') ? '#6b7280' : 'white',
                          border: e.member?.includes('misc') ? 'none' : 'none',
                        }}>${e.title}</div>`
                      ))}
                    </div>`
                  );
                })}
              </div>
            </div>
            <div className="sidebar">
              <div className="sidebar-scroll">
                ${theme.greeting ? (
                  html`<div style=${{ background: panelBg, backdropFilter: theme.bgImageUrl ? 'blur(2px)' : 'none', borderRadius: '16px', padding: '20px 22px', textAlign: 'center', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '12px' }}>
                    <div style=${{ fontSize: '24px', fontWeight: '700', color: '#374151', fontFamily: appFontCss, lineHeight: 1.3 }}>${theme.greeting}</div>
                  </div>`
                ) : null}

                
                ${(dailyContent.text || weather) && (
                  html`<div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px', alignItems: 'stretch' }}>
                    
                    
                    ${dailyContent.text && (
                      html`<div style=${{ background: panelBg, backdropFilter: theme.bgImageUrl ? 'blur(2px)' : 'none', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style=${{ fontSize: '11px', fontWeight: '700', color: '#667eea', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          ${dailyContent.type === 'joke' ? '😄 Joke' : '💡 Fact'}
                        </div>
                        <div 
                           style=${{ fontSize: '12px', color: '#374151', lineHeight: 1.4, fontFamily: appFontCss, textAlign: 'justify' }}
                           dangerouslySetInnerHTML=${{ __html: dailyContent.text }}
                           />
                      </div>`
                    )}

                    
                    ${weather && (
                      html`<div 
                        onClick=${() => setShowWeatherForecast(true)}
                        style=${{ background: panelBg, backdropFilter: theme.bgImageUrl ? 'blur(2px)' : 'none', borderRadius: '12px', padding: '14px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                        onMouseEnter=${e => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave=${e => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <div style=${{ fontSize: '11px', fontWeight: '700', color: '#667eea', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>🌤️ Whitby</span>
                          <button
                            onClick=${e => { e.stopPropagation(); fetchWeather(); }}
                            title="Refresh weather"
                            style=${{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', color: '#9ca3af', padding: '0 0 0 4px', lineHeight: 1 }}
                          >↻</button>
                        </div>
                        <div style=${{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style=${{ fontSize: '12px', color: '#374151', lineHeight: 1.3 }}>${weather.condition}</div>
                          <div style=${{ textAlign: 'right' }}>
                            <div style=${{ fontSize: '24px', fontWeight: '700', color: '#374151', lineHeight: 1 }}>${weather.temp}°</div>
                            <div style=${{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Feels ${weather.feelsLike}°</div>
                          </div>
                        </div>
                      </div>`
                    )}
                  </div>`
                )}

              <div className="leaderboard-section" style=${{ background: panelBg, backdropFilter: theme.bgImageUrl ? 'blur(2px)' : 'none', borderRadius: '20px', padding: '20px' }}>
                <h2 style=${{ fontSize: '20px', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><${Trophy} color="#f59e0b" size=${20} /> Leaderboard</h2>
                ${kids.map((kid, i) => (
                  html`<div key=${kid.id} onClick=${() => setSelectedKidSummary(kid)} style=${{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: i===0?'#fef3c7':'#f9fafb', borderRadius: '10px', marginBottom: '8px', border: i===0?'2px solid #f59e0b':'1px solid #eee', cursor: 'pointer' }}>
                    <div style=${{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                         <div style=${{ width:'55px', height:'55px', borderRadius:'50%', background: kid.color, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', color:'white', flexShrink: 0 }}>
                              ${kid.avatar ? html`<img src=${kid.avatar} style=${{width:'100%', height:'100%', objectFit: 'cover'}} alt=${kid.name} />` : kid.name[0]}
                         </div>
                         <div>${kid.name} ${!isHereToday(kid) && html`<span style=${{fontSize:'10px', background:'#fee2e2', color:'red', padding:'2px 5px', borderRadius:'4px'}}>Away</span>`}</div>
                    </div>
                    <div style=${{ fontWeight:'bold', color:'#f59e0b' }}>${scores[kid.id] || 0} ⭐</div>
                  </div>`
                ))}
              </div>
              <div className="chores-section" style=${{ background: panelBg, backdropFilter: theme.bgImageUrl ? 'blur(2px)' : 'none', borderRadius: '20px', padding: '20px' }}>
                <h2 style=${{ fontSize: '20px', marginTop: 0 }}>Today's Chores</h2>
                ${(() => {
                  // Helper: filter chores using a reference date for bi-weekly parity
                  const filterChoresForDate = (referenceDate) => chores.filter(c => {
                    if (c.isArchived) return false;
                    if (c.assignedTo && c.assignedTo !== 'unassigned') {
                      const member = familyMembers.find(m => m.id === c.assignedTo);
                      if (!member || !isHereToday(member)) return false;
                    }
                    const refDay = referenceDate.getDay();

                    // Legacy support for old weekly chores
                    if (c.frequency === 'weekly' && c.weekDay !== null && c.weekDay !== undefined && !c.days) {
                      if (refDay !== c.weekDay) return false;
                    }
                    // New Multi-day weekly chores
                    if (c.frequency === 'weekly' && c.days && c.days.length > 0) {
                      if (!c.days.includes(refDay)) return false;
                    }
                    // New Bi-weekly chores
                    if (c.frequency === 'bi-weekly' && c.days && c.days.length > 0 && c.startDate) {
                      if (!c.days.includes(refDay)) return false;
                      const start = new Date(c.startDate + 'T00:00:00');
                      start.setHours(0,0,0,0);
                      const refNorm = new Date(referenceDate); refNorm.setHours(0,0,0,0);
                      const startSun = new Date(start); startSun.setDate(startSun.getDate() - startSun.getDay());
                      const refSun = new Date(refNorm); refSun.setDate(refSun.getDate() - refSun.getDay());
                      const daysDiff = Math.round((refSun - startSun) / (24 * 60 * 60 * 1000));
                      const weeksDiff = Math.floor(daysDiff / 7);
                      if (weeksDiff % 2 !== 0) return false;

                    }
                    return true;
                  });

                  const todayDate = new Date(); todayDate.setHours(0,0,0,0);
                  let todayChores = filterChoresForDate(todayDate);

                  // For any kid with an active "Set Here" override who ended up with no chores
                  // today (because their bi-weekly parity is off), fall back to last week's
                  // parity — shows the chores they would have had on their normal "on" week
                  const lastWeekDate = new Date(todayDate);
                  lastWeekDate.setDate(lastWeekDate.getDate() - 7);
                  const overriddenKidsWithNoChores = familyMembers.filter(m => {
                    const override = scheduleOverrides[m.id];
                    const hasHereOverride = override && override.date === new Date().toDateString() && override.isHere === true;
                    if (!hasHereOverride) return false;
                    return !todayChores.some(c => c.assignedTo === m.id);
                  });
                  if (overriddenKidsWithNoChores.length > 0) {
                    const fallbackChores = filterChoresForDate(lastWeekDate);
                    const fallbackIds = new Set(overriddenKidsWithNoChores.map(m => m.id));
                    todayChores = [
                      ...todayChores,
                      ...fallbackChores.filter(c => fallbackIds.has(c.assignedTo))
                    ];
                  }

                  // Reusable chore card renderer
                  const renderChoreCard = (chore) => {
                    const key = `${chore.id}-${today}`;
                    const isDone = choreCompletions[key];
                    const claimerId = choreCompletions[`${key}-claimer`];
                    const claimer = claimerId ? familyMembers.find(m => m.id === claimerId) : null;
                    return (
                      html`<div key=${chore.id} onClick=${() => {
                        if (!chore.assignedTo || chore.assignedTo === 'unassigned') {
                          if (isDone && claimerId) {
                            const newComps = { ...choreCompletions };
                            delete newComps[key]; delete newComps[`${key}-claimer`];
                            setChoreCompletions(newComps);
                            setScores({ ...scores, [claimerId]: Math.max(0, (scores[claimerId] || 0) - chore.points) });

                            const updates = {};
                            updates[`choreCompletions/${key}`] = null;
                            updates[`choreCompletions/${key}-claimer`] = null;
                            updates[`scores/${claimerId}`] = firebase.database.ServerValue.increment(-chore.points);
                            lastDailyWriteTime.current = Date.now();
                            window.database.ref('schellFamilyDaily').update(updates);
                          } else {
                            setShowClaimChore(chore.id);
                          }
                          return;
                        }
                        const completed = !choreCompletions[key];
                        const bonusKey = `bonus-${chore.assignedTo}-${today}`;
                        const hadBonus = !!choreCompletions[bonusKey];

                        const newCompletions = { ...choreCompletions, [key]: completed };
                        let scoreDelta = completed ? chore.points : -chore.points;
                        const dailyUpdates = {};

                        // Refund bonus if unchecking a chore while bonus was already awarded
                        if (!completed && hadBonus && completionBonus > 0) {
                          delete newCompletions[bonusKey];
                          scoreDelta -= completionBonus;
                          dailyUpdates[`choreCompletions/${bonusKey}`] = null;
                        }

                        // 1. Optimistic UI — instant visual update
                        setChoreCompletions(newCompletions);
                        setScores({ ...scores, [chore.assignedTo]: Math.max(0, (scores[chore.assignedTo] || 0) + scoreDelta) });

                        // 2. Prepare deep-path updates targeting the Daily node
                        dailyUpdates[`choreCompletions/${key}`] = completed ? true : null;

                        if (completed) {
                          const member = familyMembers.find(m => m.id === chore.assignedTo);
                          playSignatureSound(member?.signatureSound || 'mario-coin');
                          
                          // Check if this was their last assigned chore for the day
                          const kidsChores = todayChores.filter(c => c.assignedTo === chore.assignedTo);
                          const allDone = kidsChores.every(c => {
                            if (c.id === chore.id) return true; // the one just clicked
                            return choreCompletions[`${c.id}-${today}`];
                          });
                          
                          if (allDone && kidsChores.length > 0) {
                            triggerGrandConfetti(); 
                            triggerFireworks();

                            // AUDIO: Play Mario Flagpole (Level Complete!) — respects mute settings
                            if (!_soundMuted) {
                              const audio = new Audio(`${AUDIO_BASE}Mario%20Bros%20Flagpole.mp3`);
                              audio.volume = 1.0; 
                              audio.play().catch(e => console.log('Audio error:', e));
                            }
                            
                            setCelebratingKid(member);
                            setTimeout(() => setCelebratingKid(null), 20000); 

                            // Award completion bonus if not already given
                            if (completionBonus > 0 && !hadBonus) {
                              setChoreCompletions(prev => ({ ...prev, [key]: true, [bonusKey]: true }));
                              setScores(prev => ({ ...prev, [chore.assignedTo]: (prev[chore.assignedTo] || 0) + completionBonus }));
                              dailyUpdates[`choreCompletions/${bonusKey}`] = true;
                              scoreDelta += completionBonus;
                            }
                          }
                        }

                        // 3. Surgical increment — completely bypasses the Stale Wake-Up bug
                        const newScore = Math.max(0, (scores[chore.assignedTo] || 0) + scoreDelta);
                        dailyUpdates[`scores/${chore.assignedTo}`] = newScore;
                        lastDailyWriteTime.current = Date.now();
                        window.database.ref('schellFamilyDaily').update(dailyUpdates);
                      }} style=${{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: isDone ? '#d1fae5' : '#f9fafb', borderRadius: '12px', marginBottom: '8px', border: isDone ? '2px solid #10b981' : '1px solid #eee', cursor: 'pointer' }}>
                        <div>
                          <div style=${{ fontWeight: '600', textDecoration: isDone ? 'line-through' : 'none', fontSize: '14px' }}>${chore.name}</div>
                          <div style=${{ fontSize: '11px', color: '#666' }}>${claimer ? `Claimed by ${claimer.name}` : (chore.assignedTo === 'unassigned' ? '⭐ Bonus' : familyMembers.find(m => m.id === chore.assignedTo)?.name)}</div>
                        </div>
                        <div style=${{ background: '#fef3c7', padding: '4px 8px', borderRadius: '8px', height: 'fit-content', fontSize: '13px' }}>${chore.points}</div>
                      </div>`
                    );
                  };

                  // Group assigned chores by kid; collect bonus chores
                  const assignedChores = todayChores.filter(c => c.assignedTo && c.assignedTo !== 'unassigned');
                  const bonusChores   = todayChores.filter(c => !c.assignedTo || c.assignedTo === 'unassigned');
                  const presentKids   = familyMembers.filter(m => m.participatesInChores && isHereToday(m));

                  return (
                    html`<${React.Fragment}>
                      ${presentKids.map(member => {
                        const memberChores = assignedChores.filter(c => c.assignedTo === member.id);
                        if (memberChores.length === 0) return null;
                        return (
                          html`<div key=${member.id}>
                            <div style=${{ fontSize: '14px', fontWeight: '700', color: member.color, marginTop: '12px', marginBottom: '8px', paddingBottom: '4px', borderBottom: `2px solid ${member.color}22` }}>
                              ${member.name}'s Chores
                            </div>
                            ${memberChores.map(renderChoreCard)}
                          </div>`
                        );
                      })}
                      ${bonusChores.length > 0 && (
                        html`<div>
                          <div style=${{ fontSize: '14px', fontWeight: '700', color: '#f59e0b', marginTop: '12px', marginBottom: '8px', paddingBottom: '4px', borderBottom: '2px solid #fde68a' }}>
                            ⭐ Bonus Chores
                          </div>
                          ${bonusChores.map(renderChoreCard)}
                        </div>`
                      )}
                      ${todayChores.length === 0 && (
                        html`<div style=${{ textAlign: 'center', color: '#9ca3af', padding: '20px 0', fontSize: '14px' }}>No chores today! 🎉</div>`
                      )}
                    <//>`
                  );
                })()}
              </div>
              </div>
            </div>
          </div>

          ${showAddEvent && (
            html`<div style=${{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick=${closeEventModal}>
              <div className="add-event-modal" onClick=${e=>e.stopPropagation()} style=${{ background: 'white', padding: '30px', borderRadius: '20px', width: '450px', maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style=${{ margin: 0 }}>${editingEvent ? '✏️ Edit Event' : '➕ Add Event'}</h2>
                  <button onClick=${closeEventModal} style=${{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#6b7280' }}>✕</button>
                </div>
                <input 
                  type="text" 
                  placeholder="Event Title" 
                  value=${newEvent.title} 
                  maxLength=${40}
                  onChange=${e=>setNewEvent({...newEvent, title: e.target.value})} 
                  style=${{ width: '100%', padding: '12px', marginBottom: '4px', fontSize: '16px', borderRadius: '8px', border: `2px solid ${newEvent.title.length >= 36 ? (newEvent.title.length === 40 ? '#ef4444' : '#f59e0b') : '#e5e7eb'}` }} 
                />
                <div style=${{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                  <span style=${{ fontSize: '11px', fontWeight: '600', color: newEvent.title.length === 40 ? '#ef4444' : newEvent.title.length >= 36 ? '#f59e0b' : '#9ca3af' }}>
                    ${newEvent.title.length}/40
                  </span>
                </div>

                <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style=${{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '600' }}>Start Date</label>
                    <input 
                      type="date" 
                      value=${newEvent.date} 
                      onChange=${e=>setNewEvent({...newEvent, date: e.target.value})} 
                      style=${{ width: '100%', padding: '12px', fontSize: '16px', borderRadius: '8px', border: '2px solid #e5e7eb' }} 
                    />
                  </div>
                  <div>
                    <label style=${{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '600' }}>End Date (Optional)</label>
                    <input 
                      type="date" 
                      value=${newEvent.endDate} 
                      onChange=${e=>setNewEvent({...newEvent, endDate: e.target.value})} 
                      style=${{ width: '100%', padding: '12px', fontSize: '16px', borderRadius: '8px', border: '2px solid #e5e7eb' }} 
                    />
                  </div>
                </div>

                <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                  <div>
                    <label style=${{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '600' }}>Start Time (Optional)</label>
                    <input 
                      type="time" 
                      value=${newEvent.time} 
                      onChange=${e=>setNewEvent({...newEvent, time: e.target.value})} 
                      style=${{ width: '100%', padding: '12px', fontSize: '16px', borderRadius: '8px', border: '2px solid #e5e7eb' }} 
                    />
                  </div>
                  <div>
                    <label style=${{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '600' }}>End Time (Optional)</label>
                    <input 
                      type="time" 
                      value=${newEvent.endTime} 
                      onChange=${e=>setNewEvent({...newEvent, endTime: e.target.value})} 
                      style=${{ width: '100%', padding: '12px', fontSize: '16px', borderRadius: '8px', border: '2px solid #e5e7eb' }} 
                    />
                  </div>
                </div>

                <label style=${{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '10px', fontWeight: '600' }}>Assign To:</label>

                <div style=${{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '10px' }}>
                  <button 
                    onClick=${()=>{
                      const isSelected = newEvent.member.includes('family');
                      if (isSelected) {
                        setNewEvent({...newEvent, member: newEvent.member.filter(m => m !== 'family')});
                      } else {
                        setNewEvent({...newEvent, member: [...newEvent.member, 'family']});
                      }
                    }}
                    style=${{ 
                      padding: '12px', 
                      background: newEvent.member.includes('family') ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white', 
                      color: newEvent.member.includes('family') ? 'white' : '#374151', 
                      border: '2px solid #667eea', 
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: newEvent.member.includes('family') ? 'bold' : 'normal',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>${newEvent.member.includes('family') ? '☑' : '☐'}</span> Family
                  </button>

                  <button 
                    onClick=${()=>{
                      const isSelected = newEvent.member.includes('misc');
                      if (isSelected) {
                        setNewEvent({...newEvent, member: newEvent.member.filter(m => m !== 'misc')});
                      } else {
                        setNewEvent({...newEvent, member: [...newEvent.member, 'misc']});
                      }
                    }}
                    style=${{ 
                      padding: '12px', 
                      background: newEvent.member.includes('misc') ? '#f3f4f6' : 'white', 
                      color: '#6b7280', 
                      border: '0px solid #d1d5db', 
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: newEvent.member.includes('misc') ? 'bold' : 'normal',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>${newEvent.member.includes('misc') ? '☑' : '☐'}</span> Misc
                  </button>
                </div>

                <div style=${{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
                  ${familyMembers.map(m => {
                    const isSelected = newEvent.member.includes(m.id);
                    return (
                      html`<button 
                        key=${m.id} 
                        onClick=${()=>{
                          if (isSelected) {
                            setNewEvent({...newEvent, member: newEvent.member.filter(mid => mid !== m.id)});
                          } else {
                            setNewEvent({...newEvent, member: [...newEvent.member, m.id]});
                          }
                        }}
                        style=${{ 
                          padding: '12px', 
                          background: isSelected ? m.color : 'white', 
                          color: isSelected ? 'white' : '#374151', 
                          border: `2px solid ${m.color}`, 
                          borderRadius: '8px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          fontWeight: isSelected ? 'bold' : 'normal',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>${isSelected ? '☑' : '☐'}</span> ${m.name}
                      </button>`
                    );
                  })}
                </div>

                <button 
                  onClick=${()=>{ 
                    if(!newEvent.title || !newEvent.date || newEvent.member.length === 0) return;

                    const startDate = new Date(newEvent.date + 'T00:00:00');
                    const endDate = newEvent.endDate ? new Date(newEvent.endDate + 'T00:00:00') : startDate;
                    const isMultiDay = startDate.getTime() !== endDate.getTime();

                    if (editingEvent) {
                      const filtered = editingEvent.groupId
                        ? events.filter(e => e.groupId !== editingEvent.groupId)
                        : events.filter(e => e.id !== editingEvent.id);
                      const groupId = editingEvent.groupId || Date.now().toString();
                      const eventsToAdd = [];
                      const iterDate = new Date(startDate);
                      while (iterDate <= endDate) {
                        eventsToAdd.push({
                          id: Date.now() + Math.random(),
                          groupId,
                          title: newEvent.title,
                          date: iterDate.toDateString(),
                          member: newEvent.member,
                          time: newEvent.time,
                          endTime: newEvent.endTime,
                          isMultiDay,
                          startDate: startDate.toDateString(),
                          endDate: endDate.toDateString()
                        });
                        iterDate.setDate(iterDate.getDate() + 1);
                      }
                      setEvents([...filtered, ...eventsToAdd]);
                    } else {
                      const eventsToAdd = [];
                      const groupId = Date.now().toString();
                      const iterDate = new Date(startDate);
                      while (iterDate <= endDate) {
                        eventsToAdd.push({
                          id: Date.now() + Math.random(),
                          groupId,
                          title: newEvent.title,
                          date: iterDate.toDateString(),
                          member: newEvent.member,
                          time: newEvent.time,
                          endTime: newEvent.endTime,
                          isMultiDay,
                          startDate: startDate.toDateString(),
                          endDate: endDate.toDateString()
                        });
                        iterDate.setDate(iterDate.getDate() + 1);
                      }
                      setEvents([...events, ...eventsToAdd]);
                    }

                    closeEventModal();
                  }} 
                  style=${{ 
                    width: '100%', 
                    padding: '15px', 
                    background: (!newEvent.title || !newEvent.date || newEvent.member.length === 0) ? '#d1d5db' : (editingEvent ? '#667eea' : '#10b981'), 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '10px', 
                    fontSize: '18px',
                    cursor: (!newEvent.title || !newEvent.date || newEvent.member.length === 0) ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ${editingEvent ? 'Update Event' : 'Save Event'}
                </button>

                ${editingEvent && (
                  html`<button
                    onClick=${() => {
                      if (confirmDeleteEvent(editingEvent)) {
                        if (editingEvent.groupId) {
                          setEvents(events.filter(e => e.groupId !== editingEvent.groupId));
                        } else {
                          setEvents(events.filter(e => e.id !== editingEvent.id));
                        }
                        closeEventModal();
                      }
                    }}
                    style=${{
                      width: '100%',
                      padding: '12px',
                      marginTop: '10px',
                      background: 'white',
                      color: '#ef4444',
                      border: '2px solid #ef4444',
                      borderRadius: '10px',
                      fontSize: '16px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    🗑 Delete Event
                  </button>`
                )}
              </div>
            </div>`
          )}
          
          ${showAdmin && (
            html`<div style=${{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflowY: 'auto', padding: '20px' }} onClick=${() => setShowAdmin(false)}>
              <div className="admin-modal" onClick=${(e) => e.stopPropagation()} style=${{ background: 'white', borderRadius: '20px', padding: '30px', width: '480px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                  <h2 style=${{ fontSize: '32px', margin: 0, color: '#1f2937' }}>⚙️ Admin Panel</h2>
                  <button onClick=${() => setShowAdmin(false)} style=${{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', fontWeight: '600' }}>Close</button>
                </div>

                <div style=${{ marginBottom: '8px', borderRadius: '12px', border: '2px solid #e5e7eb', overflow: 'hidden' }}>
                  <button onClick=${() => setAdminOpen(s => ({...s, members: !s.members}))} style=${{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: '#f9fafb', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>
                    <span>👨‍👩‍👧‍👦 Family Members</span>
                    <span style=${{ fontSize: '14px', color: '#9ca3af' }}>${adminOpen.members ? '▲' : '▼'}</span>
                  </button>
                  ${adminOpen.members && html`<div style=${{ padding: '16px' }}>
                  <div style=${{ marginBottom: '15px' }}>
                    ${familyMembers.map(member => (
                      html`<div key=${member.id} style=${{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: '#f9fafb', borderRadius: '10px', marginBottom: '8px', border: '2px solid #e5e7eb', minWidth: 0 }}>
                        <div style=${{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                          <div style=${{ width: '55px', height: '55px', flexShrink: 0, borderRadius: '50%', background: member.avatar ? 'transparent' : member.color, border: `2px solid ${member.color}`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            ${member.avatar ? html`<img src=${member.avatar} style=${{ width: '100%', height: '100%', objectFit: 'cover' }} alt=${member.name} />` : html`<span style=${{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>${member.name[0]}</span>`}
                          </div>
                          <div style=${{ minWidth: 0 }}>
                            <div style=${{ fontSize: '16px', fontWeight: '600', color: '#1f2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>${member.name}</div>
                            <div style=${{ fontSize: '12px', color: '#6b7280' }}>${member.participatesInChores ? 'Kid' : 'Adult'}</div>
                          </div>
                        </div>
                        <div style=${{ display: 'flex', gap: '8px', flexShrink: 0, marginLeft: '8px' }}>
                          <button onClick=${() => setEditingMember(member)} style=${{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>Edit</button>
                          <button onClick=${() => deleteFamilyMember(member.id)} style=${{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}> Del</button>
                        </div>
                      </div>`
                    ))}
                  </div>
                  
                  <div style=${{ padding: '15px', background: '#f0f9ff', borderRadius: '10px', border: '2px solid #3b82f6' }}>
                    <h4 style=${{ margin: '0 0 12px 0', fontSize: '16px', color: '#1f2937' }}>Add New Member</h4>
                    <input type="text" placeholder="Name" id="newMemberName" style=${{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '8px', border: '2px solid #e5e7eb', marginBottom: '8px', boxSizing: 'border-box' }} />
                    <div style=${{ marginBottom: '8px' }}>
                      <select id="newMemberType" style=${{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '8px', border: '2px solid #e5e7eb', boxSizing: 'border-box' }}><option value="adult">Adult</option><option value="kid">Kid</option></select>
                    </div>
                    <div style=${{ marginBottom: '8px' }}>
                      <label style=${{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', display: 'block' }}>Color:</label>
                      <input type="color" id="newMemberColor" defaultValue="#3B82F6" style=${{ width: '100%', height: '40px', borderRadius: '8px', border: '2px solid #e5e7eb', cursor: 'pointer' }} />
                    </div>
                    <div style=${{ marginBottom: '8px' }}>
                      <label style=${{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', display: 'block' }}>🎵 Signature Sound (for kids):</label>
                      <${TouchDropdown} options=${SOUNDS} initialValue="mario-coin" domId="newMemberSound" />
                    </div>
                    <div style=${{ marginBottom: '8px' }}>
                      <label style=${{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', display: 'block' }}>Avatar (optional):</label>
                      <input type="file" id="newMemberAvatar" accept="image/*" style=${{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '8px', border: '2px solid #e5e7eb', cursor: 'pointer' }} />
                    </div>
                    <button id="addMemberBtn" onClick=${async () => {
                        const name = document.getElementById('newMemberName').value;
                        const type = document.getElementById('newMemberType').value;
                        const color = document.getElementById('newMemberColor').value;
                        const soundId = document.getElementById('newMemberSound').value;
                        const avatarFile = document.getElementById('newMemberAvatar').files[0];
                        if (!name) return;
                        const btn = document.getElementById('addMemberBtn');
                        const newMemberData = { name, color, participatesInChores: type === 'kid', schedule: { type: 'always' }, signatureSound: soundId };
                        if (avatarFile) {
                          btn.textContent = 'Uploading...'; btn.disabled = true;
                          try {
                            const url = await uploadImageToCloudflare(avatarFile);
                            addFamilyMember({ ...newMemberData, avatar: url });
                          } catch(e) { alert('Avatar upload failed. Member added without photo.'); addFamilyMember(newMemberData); }
                          finally { btn.textContent = 'Add Member'; btn.disabled = false; }
                        } else {
                          addFamilyMember(newMemberData);
                        }
                        document.getElementById('newMemberName').value = '';
                      }} style=${{ width: '100%', padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Add Member</button>
                  </div>
                  </div>`}
                </div>

                <div style=${{ marginBottom: '8px', borderRadius: '12px', border: '2px solid #e5e7eb', overflow: 'hidden' }}>
                  <button onClick=${() => setAdminOpen(s => ({...s, schedule: !s.schedule}))} style=${{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: '#f9fafb', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>
                    <span>📅 Who's Here Today</span>
                    <span style=${{ fontSize: '14px', color: '#9ca3af' }}>${adminOpen.schedule ? '▲' : '▼'}</span>
                  </button>
                  ${adminOpen.schedule && html`<div style=${{ padding: '16px' }}>
                  <p style=${{ fontSize: '12px', color: '#6b7280', margin: '0 0 12px 0' }}>Override resets automatically tomorrow.</p>
                  ${familyMembers.map(member => {
                    const hereToday = isHereToday(member);
                    const hasOverride = scheduleOverrides[member.id]?.date === new Date().toDateString();
                    return (
                      html`<div key=${member.id} style=${{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: hereToday ? '#d1fae5' : '#fee2e2', borderRadius: '10px', marginBottom: '8px', border: `2px solid ${hereToday ? '#10b981' : '#ef4444'}`, minWidth: 0 }}>
                        <div style=${{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                          <span style=${{ fontSize: '16px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>${member.name}</span>
                          ${hasOverride && html`<span style=${{ fontSize: '10px', background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '4px', fontWeight: '600', flexShrink: 0 }}>overridden</span>`}
                        </div>
                        <div style=${{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0, marginLeft: '8px' }}>
                          ${hasOverride ? (
                            html`<button onClick=${() => { const n = {...scheduleOverrides}; delete n[member.id]; setScheduleOverrides(n); }}
                              style=${{ background: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
                              ↩ Reset
                            </button>`
                          ) : (
                            html`<button onClick=${() => setScheduleOverrides({...scheduleOverrides, [member.id]: { isHere: !hereToday, date: new Date().toDateString() }})}
                              style=${{ background: hereToday ? '#ef4444' : '#10b981', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
                              ${hereToday ? '✗ Set Away' : '✓ Set Here'}
                            </button>`
                          )}
                        </div>
                      </div>`
                    );
                  })}
                  </div>`}
                </div>

                <div style=${{ marginBottom: '8px', borderRadius: '12px', border: '2px solid #e5e7eb', overflow: 'hidden' }}>
                  <button onClick=${() => setAdminOpen(s => ({...s, chores: !s.chores}))} style=${{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: '#f9fafb', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>
                    <span>📋 Chores</span>
                    <span style=${{ fontSize: '14px', color: '#9ca3af' }}>${adminOpen.chores ? '▲' : '▼'}</span>
                  </button>
                  ${adminOpen.chores && html`<div style=${{ padding: '16px' }}>
                  
                  ${(() => {
                    const getPointsForKidOnDate = (kidId, targetDate) => {
                      return chores.filter(c => c.assignedTo === kidId && !c.isArchived).reduce((sum, c) => {
                        if (c.todayOnly) {
                           if (c.createdDate === targetDate.toDateString()) return sum + c.points;
                           return sum;
                        }
                        if (c.frequency === 'daily' || !c.frequency) return sum + c.points;
                        
                        const targetDay = targetDate.getDay();
                        
                        if (c.frequency === 'weekly') {
                          if (c.days && c.days.includes(targetDay)) return sum + c.points;
                          if (c.weekDay !== null && c.weekDay !== undefined && !c.days && c.weekDay === targetDay) return sum + c.points;
                        }
                        
                        if (c.frequency === 'bi-weekly' && c.days && c.days.includes(targetDay) && c.startDate) {
                          const start = new Date(c.startDate + 'T00:00:00');
                          start.setHours(0,0,0,0);
                          const startSun = new Date(start); startSun.setDate(startSun.getDate() - startSun.getDay());
                          const targetSun = new Date(targetDate); targetSun.setDate(targetSun.getDate() - targetSun.getDay());
                          const daysDiff = Math.round((targetSun - startSun) / (24 * 60 * 60 * 1000));
                          const weeksDiff = Math.floor(daysDiff / 7);
                          if (weeksDiff % 2 === 0) return sum + c.points;

                        }
                        return sum;
                      }, 0);
                    };

                    return (
                      html`<div style=${{ marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '2px solid #e2e8f0' }}>
                        <h4 style=${{ margin: '0 0 6px 0', fontSize: '16px', color: '#1e293b' }}>📅 14-Day Chore Forecaster</h4>
                        <p style=${{ fontSize: '12px', color: '#64748b', margin: '0 0 12px 0' }}>Ensure every kid is assigned exactly 100 points per day.</p>
                        
                        <div style=${{ overflowY: 'auto', maxHeight: '250px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white' }}>
                          <table style=${{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '13px' }}>
                            <thead style=${{ position: 'sticky', top: 0, background: '#f1f5f9', zIndex: 1 }}>
                              <tr>
                                <th style=${{ padding: '10px 8px', borderBottom: '2px solid #cbd5e1', textAlign: 'left', color: '#475569' }}>Date</th>
                                ${familyMembers.filter(m => m.participatesInChores).map(kid => (
                                  html`<th key=${kid.id} style=${{ padding: '10px 8px', borderBottom: '2px solid #cbd5e1', color: kid.color }}>${kid.name}</th>`
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              ${Array.from({length: 14}).map((_, i) => {
                                const d = new Date();
                                d.setDate(d.getDate() + i);
                                d.setHours(0,0,0,0);
                                const isToday = i === 0;
                                const dayStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                                
                                return (
                                  html`<tr key=${i} style=${{ borderBottom: '1px solid #e2e8f0', background: isToday ? '#f0fdf4' : 'white' }}>
                                    <td style=${{ padding: '10px 8px', textAlign: 'left', fontWeight: isToday ? '700' : '500', color: '#334155' }}>
                                      ${dayStr} ${isToday && '(Today)'}
                                    </td>
                                    ${familyMembers.filter(m => m.participatesInChores).map(kid => {
                                      const pts = getPointsForKidOnDate(kid.id, d);
                                      const is100 = pts === 100;
                                      return (
                                        html`<td key=${kid.id} style=${{ padding: '10px 8px', fontWeight: 'bold', color: is100 ? '#10b981' : (pts > 100 ? '#ef4444' : '#f59e0b') }}>
                                          ${pts}
                                        </td>`
                                      );
                                    })}
                                  </tr>`
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>`
                    );
                  })()}
                  <div style=${{ marginBottom: '15px' }}>
                    ${(() => {
                      const kids = familyMembers.filter(m => m.participatesInChores);
                      const bonusChores = chores.filter(c => (!c.assignedTo || c.assignedTo === 'unassigned') && !c.isArchived).sort((a, b) => a.name.localeCompare(b.name));
                      const renderChoreRow = (chore) => (
                        html`<div key=${chore.id} style=${{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', borderRadius: '10px', marginBottom: '8px', border: '2px solid #e5e7eb', minWidth: 0 }}>
                          <div style=${{ minWidth: 0, flex: 1 }}>
                            <div style=${{ fontSize: '16px', fontWeight: '600', color: '#1f2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              ${chore.name}
                              ${chore.todayOnly && html`<span style=${{ fontSize: '10px', background: '#ede9fe', color: '#7c3aed', padding: '2px 5px', borderRadius: '4px', marginLeft: '6px', fontWeight: '600' }}>today only</span>`}
                            </div>
                            <div style=${{ fontSize: '12px', color: '#6b7280' }}>
                              ${chore.points} pts • ${(() => {
                                const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
                                if ((chore.frequency === 'weekly' || chore.frequency === 'bi-weekly') && chore.days && chore.days.length > 0) {
                                  const label = chore.frequency === 'bi-weekly' ? 'Bi-weekly' : 'Weekly';
                                  return `${label}: ${chore.days.map(d => dayNames[d]).join('/')}`;
                                }
                                if (chore.frequency === 'weekly' && chore.weekDay !== null && chore.weekDay !== undefined) {
                                  return dayNames[chore.weekDay];
                                }
                                return chore.frequency || 'daily';
                              })()}
                            </div>
                          </div>
                          <div style=${{ display: 'flex', gap: '8px', flexShrink: 0, marginLeft: '8px' }}>
                            <button onClick=${() => setEditingChore(chore)} style=${{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>Edit</button>
                            <button onClick=${() => deleteChore(chore.id)} style=${{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>Del</button>
                          </div>
                        </div>`
                      );
                      return (
                        html`<${React.Fragment}>
                          ${kids.map(kid => {
                            const kidChores = chores.filter(c => c.assignedTo === kid.id && !c.isArchived).sort((a, b) => a.name.localeCompare(b.name));
                            if (kidChores.length === 0) return null;
                            const groupKey = `choreGroup-${kid.id}`;
                            const isExpanded = !!adminOpen[groupKey];
                            return (
                              html`<div key=${kid.id} style=${{ marginBottom: '8px', borderRadius: '10px', border: `2px solid ${kid.color}33`, overflow: 'hidden' }}>
                                <div
                                  onClick=${() => setAdminOpen(s => ({ ...s, [groupKey]: !s[groupKey] }))}
                                  style=${{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: `${kid.color}11`, cursor: 'pointer', userSelect: 'none' }}
                                >
                                  <div style=${{ width: '20px', height: '20px', borderRadius: '50%', background: kid.color, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: 'bold', flexShrink: 0 }}>
                                    ${kid.avatar ? html`<img src=${kid.avatar} style=${{ width: '100%', height: '100%', objectFit: 'cover' }} />` : kid.name[0]}
                                  </div>
                                  <span style=${{ fontSize: '13px', fontWeight: '700', color: kid.color }}>${kid.name}'s Chores</span>
                                  <span style=${{ fontSize: '11px', fontWeight: '500', color: '#9ca3af', marginLeft: 'auto', marginRight: '6px' }}>${kidChores.length} chore${kidChores.length !== 1 ? 's' : ''}</span>
                                  <span style=${{ fontSize: '12px', color: kid.color }}>${isExpanded ? '▲' : '▼'}</span>
                                </div>
                                ${isExpanded && (
                                  html`<div style=${{ padding: '10px 12px 4px' }}>
                                    ${kidChores.map(renderChoreRow)}
                                  </div>`
                                )}
                              </div>`
                            );
                          })}
                          ${bonusChores.length > 0 && (() => {
                            const isExpanded = !!adminOpen['choreGroup-bonus'];
                            return (
                              html`<div style=${{ marginBottom: '8px', borderRadius: '10px', border: '2px solid #fde68a', overflow: 'hidden' }}>
                                <div
                                  onClick=${() => setAdminOpen(s => ({ ...s, 'choreGroup-bonus': !s['choreGroup-bonus'] }))}
                                  style=${{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: '#fefce8', cursor: 'pointer', userSelect: 'none' }}
                                >
                                  <span style=${{ fontSize: '13px', fontWeight: '700', color: '#f59e0b' }}>⭐ Bonus Chores</span>
                                  <span style=${{ fontSize: '11px', fontWeight: '500', color: '#9ca3af', marginLeft: 'auto', marginRight: '6px' }}>${bonusChores.length} chore${bonusChores.length !== 1 ? 's' : ''}</span>
                                  <span style=${{ fontSize: '12px', color: '#f59e0b' }}>${isExpanded ? '▲' : '▼'}</span>
                                </div>
                                ${isExpanded && (
                                  html`<div style=${{ padding: '10px 12px 4px' }}>
                                    ${bonusChores.map(renderChoreRow)}
                                  </div>`
                                )}
                              </div>`
                            );
                          })()}
                          ${chores.length === 0 && (
                            html`<div style=${{ textAlign: 'center', color: '#9ca3af', padding: '16px 0', fontSize: '14px' }}>No chores yet — add one below!</div>`
                          )}
                        <//>`
                      );
                    })()}
                  </div>
                  <div style=${{ padding: '15px', background: '#fef3c7', borderRadius: '10px', border: '2px solid #f59e0b' }}>
                    <h4 style=${{ margin: '0 0 12px 0', fontSize: '16px', color: '#1f2937' }}>Add New Chore</h4>
                    <input type="text" placeholder="Chore name" id="newChoreName" style=${{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '8px', border: '2px solid #e5e7eb', marginBottom: '8px', boxSizing: 'border-box' }} />
                    <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <input type="number" placeholder="Points" id="newChorePoints" defaultValue="0" min="0" style=${{ padding: '10px', fontSize: '14px', borderRadius: '8px', border: '2px solid #e5e7eb', boxSizing: 'border-box', width: '100%' }} />
                      <select id="newChoreFrequency" onChange=${(e) => {
                        document.getElementById('newChoreDaysWrapper').style.display = (e.target.value === 'weekly' || e.target.value === 'bi-weekly') ? 'block' : 'none';
                        document.getElementById('newChoreStartDateWrapper').style.display = e.target.value === 'bi-weekly' ? 'block' : 'none';
                      }} style=${{ padding: '10px', fontSize: '14px', borderRadius: '8px', border: '2px solid #e5e7eb', boxSizing: 'border-box' }}>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="bi-weekly">Bi-Weekly</option>
                        <option value="today-only">📅 Today Only</option>
                      </select>
                    </div>
                    <div id="newChoreDaysWrapper" style=${{ display: 'none', marginBottom: '8px' }}>
                      <label style=${{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>Select Days</label>
                      <div id="newChoreDays" style=${{ display: 'flex', gap: '4px', justifyContent: 'space-between' }}>
                        ${['S','M','T','W','T','F','S'].map((day, i) => (
                          html`<label key=${i} style=${{ flex: 1, textAlign: 'center', background: 'white', border: '2px solid #e5e7eb', borderRadius: '6px', padding: '6px 0', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>
                            <input type="checkbox" value=${i} style=${{ display: 'none' }} onChange=${(e) => {
                              e.target.parentElement.style.background = e.target.checked ? '#eef2ff' : 'white';
                              e.target.parentElement.style.borderColor = e.target.checked ? '#667eea' : '#e5e7eb';
                              e.target.parentElement.style.color = e.target.checked ? '#667eea' : '#374151';
                            }}/>
                            ${day}
                          </label>`
                        ))}
                      </div>
                    </div>
                    <div id="newChoreStartDateWrapper" style=${{ display: 'none', marginBottom: '8px' }}>
                      <label style=${{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>Starting Week Of</label>
                      <input type="date" id="newChoreStartDate" style=${{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '8px', border: '2px solid #e5e7eb', boxSizing: 'border-box' }} />
                    </div>
                    <select id="newChoreAssign" style=${{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '8px', border: '2px solid #e5e7eb', marginBottom: '8px', boxSizing: 'border-box' }}>
                      <option value="unassigned">⭐ Bonus</option>
                      ${familyMembers.map(m => html`<option key=${m.id} value=${m.id}>${m.name}</option>`)}
                    </select>
                    <button onClick=${() => {
                       const name = document.getElementById('newChoreName').value;
                       const points = parseInt(document.getElementById('newChorePoints').value) || 0;
                       const frequency = document.getElementById('newChoreFrequency').value;
                       const todayOnly = frequency === 'today-only';
                       const days = Array.from(document.querySelectorAll('#newChoreDays input:checked')).map(cb => parseInt(cb.value));
                       const startDate = document.getElementById('newChoreStartDate').value;
                       const assignedTo = document.getElementById('newChoreAssign').value;
                       if (name) { 
                         addChore({ name, points, frequency: todayOnly ? 'daily' : frequency, days: days.length > 0 ? days : null, startDate: startDate || null, assignedTo, ...(todayOnly ? { todayOnly: true, createdDate: new Date().toDateString() } : {}) }); 
                         document.getElementById('newChoreName').value = '';
                         document.getElementById('newChoreDaysWrapper').style.display = 'none';
                         document.getElementById('newChoreStartDateWrapper').style.display = 'none';
                         document.getElementById('newChoreStartDate').value = '';
                         document.getElementById('newChoreFrequency').value = 'daily';
                         document.querySelectorAll('#newChoreDays input').forEach(cb => {
                           cb.checked = false;
                           cb.parentElement.style.background = 'white';
                           cb.parentElement.style.borderColor = '#e5e7eb';
                           cb.parentElement.style.color = '#374151';
                         });
                       }
                    }} style=${{ width: '100%', padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Add Chore</button>
                  </div>
                  </div>`}
                </div>

                <div style=${{ marginBottom: '8px', borderRadius: '12px', border: '2px solid #e5e7eb', overflow: 'hidden' }}>
                  <button onClick=${() => setAdminOpen(s => ({...s, history: !s.history}))} style=${{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: '#f9fafb', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>
                    <span>📊 Score History</span>
                    <span style=${{ fontSize: '14px', color: '#9ca3af' }}>${adminOpen.history ? '▲' : '▼'}</span>
                  </button>
                  ${adminOpen.history && html`<div style=${{ padding: '16px' }}>
                  <div style=${{ maxHeight: '150px', overflowY: 'auto', background: '#f9fafb', padding: '10px', borderRadius: '10px', border: '2px solid #e5e7eb' }}>
                   ${scoreHistory.map((h, i) => {
  const isSaturday = h.date && new Date(h.date).getDay() === 6;
  let payoutLabels = [];
  
  // If it's Saturday, dig out the hidden payout chores
  if (isSaturday) {
      Object.values(h.scores || {}).forEach(s => {
          const payout = (s.choresDone || []).find(c => c.name && c.name.startsWith('💰 Weekly Allowance Payout:'));
          if (payout) {
              const amountStr = payout.name.split(': ')[1]; 
              payoutLabels.push(`${s.name} (${amountStr})`);
          }
      });
  }

  return html`<${React.Fragment} key=${i}>
      ${isSaturday && payoutLabels.length > 0 && (
          html`<div style=${{ fontSize: '12px', background: '#ecfdf5', color: '#065f46', borderBottom: '1px solid #eee', marginTop: '8px', padding: '6px 8px', borderRadius: '4px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <b>💰 Weekly Allowance Earned:</b> 
              <span>${payoutLabels.join(', ')}</span>
          </div>`
      )}
      <div onClick=${() => setSelectedHistoryDate(h)} style=${{ fontSize: '12px', borderBottom: '1px solid #eee', padding: '8px 5px', cursor: 'pointer', borderRadius: '4px' }} onMouseEnter=${e => e.currentTarget.style.background = '#e5e7eb'} onMouseLeave=${e => e.currentTarget.style.background = 'transparent'}>
          <b>${h.date}</b>: ${Object.values(h.scores || {}).map(s => `${s.name} (${s.score})`).join(', ')}
      </div>
  </${React.Fragment}>`;
})}


                  </div>
                  <div style=${{ textAlign: 'center', marginTop: '8px' }}>
                    ${(() => {
                      const recoverHistory = async () => {
                        const [dailySnap, calSnap, backupSnap] = await Promise.all([
                          window.database.ref('schellFamilyDaily').once('value'),
                          window.database.ref('schellFamilyCalendar').once('value'),
                          window.database.ref('schellFamilyBackup').once('value')
                        ]);
                        const daily = dailySnap.val() || {};
                        const cal = calSnap.val() || {};
                        const backupRaw = backupSnap.val() || {};
                        const allChores = cal.choresList || chores;
                        const members = cal.familyMembers || familyMembers;
                        const bonus = cal.completionBonus !== undefined ? cal.completionBonus : completionBonus;
                        const kids = members.filter(m => m.participatesInChores);

                        // 1. Merge everything into a single flat object to absolutely guarantee no duplicates
                        const allUniqueCompletions = {};
                        
                        Object.values(backupRaw).forEach(snap => { 
                          if (snap && typeof snap === 'object') Object.assign(allUniqueCompletions, snap); 
                        });
                        
                        if (daily.choreCompletions) Object.assign(allUniqueCompletions, daily.choreCompletions);

                        // 2. Process the perfectly unique list
                        const byDate = {};
                        Object.keys(allUniqueCompletions).forEach(key => {
                          if (!allUniqueCompletions[key] || key.includes('-claimer')) return;
                          const match = key.match(/([A-Z][a-z]{2} [A-Z][a-z]{2} \d{1,2} \d{4})$/);
                          if (!match) return;
                          const d = match[1];
                          if (!byDate[d]) byDate[d] = { keys: [], completions: {} };
                          
                          byDate[d].keys.push(key);
                          byDate[d].completions[key] = allUniqueCompletions[key];
                          if (allUniqueCompletions[`${key}-claimer`]) {
                            byDate[d].completions[`${key}-claimer`] = allUniqueCompletions[`${key}-claimer`];
                          }
                        });

                        const todayStr = new Date().toDateString();
                        const liveScores = {};
                        kids.forEach(k => liveScores[k.id] = 0);

                        const historyEntries = Object.entries(byDate).map(([dateStr, { keys, completions }]) => {
                          const entry = { date: dateStr, scores: {} };
                          kids.forEach(kid => { entry.scores[kid.id] = { name: kid.name, score: 0, payRate: kid.payRate || 0.01, choresDone: [] }; });
                          keys.forEach(key => {
                            if (key.startsWith('bonus-')) {
                              const kidId = key.replace('bonus-', '').replace(`-${dateStr}`, '');
                              if (entry.scores[kidId]) {
                                entry.scores[kidId].score += bonus;
                                entry.scores[kidId].choresDone.push({ name: '🏆 Daily Completion Bonus', points: bonus, wasBonus: true });
                                if (dateStr === todayStr) liveScores[kidId] += bonus;
                              }
                            } else {
                              const choreId = key.replace(`-${dateStr}`, '');
                              const chore = allChores.find(c => c.id === choreId);
                              // Chore not found = hard-deleted before soft-delete existed, skip it
                              if (!chore) return;
                              const claimerId = completions[`${key}-claimer`];
                              const completedBy = claimerId || chore.assignedTo;
                              if (!completedBy || completedBy === 'unassigned' || !entry.scores[completedBy]) return;
                              entry.scores[completedBy].score += chore.points;
                              entry.scores[completedBy].choresDone.push({ name: chore.name, points: chore.points, wasBonus: !chore.assignedTo || chore.assignedTo === 'unassigned' });
                              // Sync recovered points for today into the live scoreboard
                              if (dateStr === todayStr) liveScores[completedBy] += chore.points;
                            }
                          });
                          return entry;
                        }).filter(entry => entry.date !== todayStr); // Prevent today from entering the history ledger early

                        historyEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
                        if (historyEntries.length === 0) { alert('No completion data found in daily or backup nodes.'); return; }

                        await window.database.ref('schellFamilyHistory').set(historyEntries);
                        await window.database.ref('schellFamilyDaily/scores').set(liveScores);
                        setScoreHistory(historyEntries);
                        setScores(liveScores);
                        alert(`✅ Recovered ${historyEntries.length} days of history (${Object.keys(backupRaw).length} backup days available) and re-synced today's live scores!`);
                      };
                      return html`<button onClick=${() => {
                        if (confirm('Rebuild history from backups? This will recalculate all scores based on past completions.')) recoverHistory();
                      }} style=${{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline', padding: '4px' }}>
                        recover history from backup
                      </button>`;
                    })()}
                  </div>
                  </div>`}
                </div>

                <div style=${{ marginBottom: '8px', borderRadius: '12px', border: '2px solid #e5e7eb', overflow: 'hidden' }}>
                  <button onClick=${() => setAdminOpen(s => ({...s, theme: !s.theme}))} style=${{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: '#f9fafb', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>
                    <span>🎨 Theme Customizer</span>
                    <span style=${{ fontSize: '14px', color: '#9ca3af' }}>${adminOpen.theme ? '▲' : '▼'}</span>
                  </button>
                  ${adminOpen.theme && html`<div style=${{ padding: '16px' }}>
                  <p style=${{ fontSize: '13px', color: '#6b7280', marginBottom: '16px', marginTop: 0 }}>Changes sync to all devices instantly.</p>

                  <div style=${{ marginBottom: '20px' }}>
                    <label style=${{ fontSize: '13px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '8px' }}>Quick Presets</label>
                    <div style=${{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      ${THEME_PRESETS.map(p => (
                        html`<button key=${p.id} onClick=${() => setTheme({ ...theme, preset: p.id, bgColor: '', bgImageUrl: '' })}
                          style=${{ padding: '8px 4px', background: theme.preset === p.id ? '#667eea' : '#f3f4f6', color: theme.preset === p.id ? 'white' : '#374151', border: theme.preset === p.id ? '2px solid #667eea' : '2px solid transparent', borderRadius: '8px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                          ${p.label}
                        </button>`
                      ))}
                    </div>
                  </div>

                  ${theme.preset === 'custom' && (
                    html`<div style=${{ background: '#f9fafb', borderRadius: '10px', padding: '14px', border: '2px solid #e5e7eb', marginBottom: '16px' }}>
                      <label style=${{ fontSize: '13px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '10px' }}>Custom Background</label>

                      <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                        <div>
                          <label style=${{ fontSize: '11px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Background Color</label>
                          <input type="color" value=${theme.bgColor || '#667eea'}
                            onChange=${e => setTheme({ ...theme, bgColor: e.target.value })}
                            style=${{ width: '100%', height: '40px', borderRadius: '8px', border: '2px solid #e5e7eb', cursor: 'pointer' }} />
                          <p style=${{ fontSize: '10px', color: '#9ca3af', margin: '4px 0 0' }}>Fallback if image fails & sets button colour</p>
                        </div>
                        <div>
                          <label style=${{ fontSize: '11px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Font Color</label>
                          <input type="color" value=${theme.fontColor || '#1f2937'}
                            onChange=${e => setTheme({ ...theme, fontColor: e.target.value })}
                            style=${{ width: '100%', height: '40px', borderRadius: '8px', border: '2px solid #e5e7eb', cursor: 'pointer' }} />
                        </div>
                      </div>

                      <label style=${{ fontSize: '11px', color: '#6b7280', display: 'block', marginBottom: '6px', fontWeight: '700' }}>Background Image</label>

                      ${theme.bgImageUrl && (
                        html`<div style=${{ marginBottom: '14px', background: '#f0f4ff', borderRadius: '10px', padding: '12px', border: '1px solid #c7d2fe' }}>
                          <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                            <div>
                              <label style=${{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                                🖥 Desktop — vertical
                              </label>
                              <input type="range" min="0" max="100"
                                value=${theme.bgPosition ?? 50}
                                onChange=${e => setTheme({ ...theme, bgPosition: e.target.value })}
                                style=${{ width: '100%', accentColor: '#667eea' }}
                              />
                            </div>
                            <div>
                              <label style=${{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>
                                📱 Mobile — horizontal
                              </label>
                              <input type="range" min="0" max="100"
                                value=${theme.bgMobilePosition ?? 50}
                                onChange=${e => setTheme({ ...theme, bgMobilePosition: e.target.value })}
                                style=${{ width: '100%', accentColor: '#667eea' }}
                              />
                            </div>
                          </div>
                          <div style=${{ display: 'grid', gridTemplateColumns: '1fr 60px', gap: '10px', alignItems: 'start' }}>
                            <div>
                              <div style=${{ fontSize: '10px', fontWeight: '700', color: '#6b7280', marginBottom: '4px' }}>Desktop Preview</div>
                              <div style=${{ width: '100%', aspectRatio: '16/9', borderRadius: '6px', overflow: 'hidden', border: '2px solid #e5e7eb',
                                backgroundImage: `url(${theme.bgImageUrl})`, backgroundSize: 'cover',
                                backgroundPosition: `center ${theme.bgPosition ?? 50}%` }} />
                            </div>
                            <div>
                              <div style=${{ fontSize: '10px', fontWeight: '700', color: '#6b7280', marginBottom: '4px' }}>Mobile</div>
                              <div style=${{ width: '60px', height: '120px', borderRadius: '6px', overflow: 'hidden', border: '2px solid #e5e7eb',
                                backgroundImage: `url(${theme.bgImageUrl})`, backgroundSize: 'cover',
                                backgroundPosition: `${theme.bgMobilePosition ?? 50}% center` }} />
                            </div>
                          </div>
                          <p style=${{ fontSize: '10px', color: '#9ca3af', margin: '8px 0 0', textAlign: 'center' }}>Desktop crops vertically · Mobile crops horizontally</p>
                        </div>`
                      )}

                      <div style=${{ marginBottom: '6px' }}>
                        <input type="file" id="bgImageUpload" accept="image/*" style=${{ display: 'none' }}
                          onChange=${async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            e.target.value = '';
                            setImageUploadStatus('uploading');
                            try {
                              const url = await uploadImageToCloudflare(file, true);
                              if (url) {
                                if (theme.bgImageUrl) {
                                  deleteImageFromCloudflare(theme.bgImageUrl);
                                }
                                setTheme(t => ({ ...t, bgImageUrl: url }));
                                setImageUploadStatus('done');
                                setTimeout(() => setImageUploadStatus(''), 3000);
                              } else {
                                setImageUploadStatus('error');
                              }
                            } catch (err) {
                              setImageUploadStatus('error');
                            }
                          }}
                        />
                        <button
                          onClick=${() => { setImageUploadStatus(''); document.getElementById('bgImageUpload').click(); }}
                          style=${{ width: '100%', padding: '12px', background: imageUploadStatus === 'uploading' ? '#9ca3af' : '#667eea', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: imageUploadStatus === 'uploading' ? 'wait' : 'pointer' }}
                          disabled=${imageUploadStatus === 'uploading'}
                        >
                          ${imageUploadStatus === 'uploading' ? '⏳ Uploading...' : imageUploadStatus === 'done' ? '✅ Uploaded!' : theme.bgImageUrl ? '📷 Replace Photo' : '📷 Upload Background Photo'}
                        </button>
                        ${imageUploadStatus === 'error' && html`<p style=${{ fontSize: '11px', color: '#ef4444', marginTop: '6px', marginBottom: 0 }}>Upload failed. Check the Worker is deployed correctly.</p>`}
                      </div>

                      <p style=${{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>JPG, PNG, or WEBP. Stored on your Cloudflare R2 account.</p>
                    </div>`
                  )}

                  <div style=${{ marginBottom: '16px' }}>
                    <label style=${{ fontSize: '13px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '8px' }}>Font</label>
                    <div style=${{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                      ${FONT_OPTIONS.map(f => (
                        html`<button key=${f.id} onClick=${() => setTheme({ ...theme, fontFamily: f.id })}
                          style=${{ padding: '10px', fontFamily: f.css, background: theme.fontFamily === f.id ? '#eef2ff' : 'white', color: theme.fontFamily === f.id ? '#4338ca' : '#374151', border: theme.fontFamily === f.id ? '2px solid #667eea' : '2px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', textAlign: 'left', fontWeight: theme.fontFamily === f.id ? '700' : '400' }}>
                          ${f.label}
                        </button>`
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style=${{ fontSize: '13px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>Greeting / Message</label>
                    <p style=${{ fontSize: '11px', color: '#9ca3af', marginTop: 0, marginBottom: '8px' }}>Shown above the leaderboard. Leave blank to hide.</p>
                    <input type="text" placeholder="e.g. Good morning Schells! 🌞" value=${theme.greeting || ''} maxLength=${80}
                      onChange=${e => setTheme({ ...theme, greeting: e.target.value })}
                      style=${{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '8px', border: '2px solid #e5e7eb', marginBottom: '4px' }} />
                    <div style=${{ textAlign: 'right', fontSize: '11px', color: '#9ca3af' }}>${(theme.greeting || '').length}/80</div>
                  </div>
                  </div>`}
                </div>

                <div style=${{ marginBottom: '8px', borderRadius: '12px', border: '2px solid #e5e7eb', overflow: 'hidden' }}>
                  <button onClick=${() => setAdminOpen(s => ({...s, settings: !s.settings}))} style=${{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: '#f9fafb', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>
                    <span>🔧 Settings</span>
                    <span style=${{ fontSize: '14px', color: '#9ca3af' }}>${adminOpen.settings ? '▲' : '▼'}</span>
                  </button>
                  ${adminOpen.settings && html`<div style=${{ padding: '16px' }}>
                  <div style=${{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                    <!-- CARD: GENERAL -->
                    <div style=${{ border: '2px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden' }}>
                      <div style=${{ background: '#f9fafb', padding: '8px 14px', borderBottom: '2px solid #e5e7eb' }}>
                        <span style=${{ fontSize: '11px', fontWeight: '800', color: '#6b7280', letterSpacing: '0.08em' }}>GENERAL</span>
                      </div>
                      <div style=${{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button onClick=${() => setShowAllowanceSummary(!showAllowanceSummary)} style=${{ padding: '12px', background: showAllowanceSummary ? '#10b981' : '#6b7280', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', textAlign: 'left' }}>
                          ${showAllowanceSummary ? '💰 Allowance Summary: ON' : '💰 Allowance Summary: OFF'}
                        </button>
                        <button onClick=${() => setAllowProfileEditing(!allowProfileEditing)} style=${{ padding: '12px', background: allowProfileEditing ? '#10b981' : '#6b7280', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', textAlign: 'left' }}>
                          ${allowProfileEditing ? '✏️ Kid Profile Editing: ON' : '✏️ Kid Profile Editing: OFF'}
                        </button>
                      </div>
                    </div>

                    <!-- CARD: COMPLETION BONUS -->
                    <div style=${{ border: '2px solid #bbf7d0', borderRadius: '16px', overflow: 'hidden' }}>
                      <div style=${{ background: '#f0fdf4', padding: '8px 14px', borderBottom: '2px solid #bbf7d0' }}>
                        <span style=${{ fontSize: '11px', fontWeight: '800', color: '#16a34a', letterSpacing: '0.08em' }}>COMPLETION BONUS</span>
                      </div>
                      <div style=${{ padding: '12px' }}>
                        <p style=${{ fontSize: '12px', color: '#16a34a', margin: '0 0 10px 0' }}>Bonus points when a kid finishes all their chores. Set to 0 to disable.</p>
                        <div style=${{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input type="number" min="0" value=${completionBonus} onChange=${e => setCompletionBonus(Math.max(0, parseInt(e.target.value) || 0))} style=${{ width: '90px', padding: '10px', fontSize: '18px', fontWeight: '700', borderRadius: '8px', border: '2px solid #86efac', textAlign: 'center', color: '#166534' }} />
                          <span style=${{ fontSize: '14px', color: '#16a34a', fontWeight: '600' }}>points on full completion</span>
                        </div>
                      </div>
                    </div>

                    <!-- CARD: DISPLAY & SLEEP -->
                    ${(() => {
                      const formatTime12 = (t) => {
                        if (!t) return '';
                        const [h, m] = t.split(':');
                        const hrs = parseInt(h, 10);
                        return `${hrs % 12 || 12}:${m} ${hrs >= 12 ? 'PM' : 'AM'}`;
                      };
                      const qtActive = isQuietTimeActive();
                      const qtString = `${formatTime12(quietTimeStart)} – ${formatTime12(quietTimeEnd)}`;
                      const dimmedUntil = parseInt(localStorage.getItem('tempDimmedUntil') || '0', 10);
                      const tempDimMinLeft = isTempDimmed ? Math.ceil((dimmedUntil - Date.now()) / 60000) : 0;

                      const splitRow = { display: 'flex', gap: '6px' };
                      const mainBtn = (color) => ({ flex: '0 0 75%', padding: '12px', background: color, color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textAlign: 'left' });
                      const castBtn = { flex: '0 0 calc(25% - 6px)', padding: '12px', background: '#374151', color: 'white', border: 'none', borderRadius: '10px', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
                      const durBtn = { flex: 1, padding: '8px 4px', background: '#ede9fe', color: '#4c1d95', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' };

                      const autoDimColor = alwaysOnDisplay ? '#10b981' : '#6b7280';
                      const manualDimColor = isDimmed ? '#10b981' : isAutoDimmed ? '#f59e0b' : isTempDimmed ? '#7c3aed' : '#6b7280';
                      const manualDimLabel = isDimmed ? '💡 Dim ON — This Device (tap to clear)' : isAutoDimmed ? `🌙 Auto-Dimmed by schedule — tap to brighten` : isTempDimmed ? `🌙 Temp Dimmed · ${tempDimMinLeft}m left — tap to clear` : '🌙 Dim This Device Manually';

                      return html`<div style=${{ border: '2px solid #c7d2fe', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style=${{ background: '#eef2ff', padding: '8px 14px', borderBottom: '2px solid #c7d2fe', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style=${{ fontSize: '11px', fontWeight: '800', color: '#4338ca', letterSpacing: '0.08em' }}>DISPLAY & SLEEP</span>
                          ${qtActive && html`<span style=${{ fontSize: '10px', fontWeight: '700', color: 'white', background: '#4338ca', padding: '2px 8px', borderRadius: '99px', boxShadow: '0 0 6px #818cf8' }}>● QUIET TIME LIVE</span>`}
                        </div>
                        <div style=${{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

                          <!-- Quiet Time schedule inputs -->
                          <div style=${{ display: 'flex', gap: '8px' }}>
                            <div style=${{ flex: 1 }}>
                              <label style=${{ fontSize: '11px', color: '#4338ca', fontWeight: '700', display: 'block', marginBottom: '3px' }}>Start</label>
                              <input type="time" value=${quietTimeStart} onChange=${e => setQuietTimeStart(e.target.value)} style=${{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '8px', border: '2px solid #a5b4fc', color: '#312e81' }} />
                            </div>
                            <div style=${{ flex: 1 }}>
                              <label style=${{ fontSize: '11px', color: '#4338ca', fontWeight: '700', display: 'block', marginBottom: '3px' }}>End</label>
                              <input type="time" value=${quietTimeEnd} onChange=${e => setQuietTimeEnd(e.target.value)} style=${{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '8px', border: '2px solid #a5b4fc', color: '#312e81' }} />
                            </div>
                          </div>

                          <!-- Dim Intensity slider -->
                          <div style=${{ background: '#f5f3ff', borderRadius: '10px', padding: '10px' }}>
                            <div style=${{ fontSize: '11px', color: '#4338ca', fontWeight: '700', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span>Dim Intensity</span><span>${dimIntensity}%</span>
                            </div>
                            <input type="range" min="10" max="90" value=${dimIntensity} onChange=${e => { const v = parseInt(e.target.value); setDimIntensity(v); localStorage.setItem('dimIntensity', v); lastLocalOverrideTime.current = Date.now(); }} style=${{ width: '100%', accentColor: '#4338ca' }} />
                            <div style=${{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#818cf8' }}>
                              <span>Subtle</span><span>Dark</span>
                            </div>
                            <button onClick=${() => setPushConfirm({ label: 'set dim intensity to ' + dimIntensity + '% on', action: () => window.database.ref('schellFamilyCalendar/forcedSettings/dimIntensity').set({ value: dimIntensity, ts: Date.now() }) })} style=${{ marginTop: '6px', width: '100%', padding: '7px', background: '#4338ca', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                              📡 Push Dim Level to All Devices
                            </button>
                          </div>

                          <!-- Auto-Dim split row -->
                          <div>
                            <div style=${{ fontSize: '11px', color: '#6b7280', fontWeight: '700', marginBottom: '4px' }}>AUTO-DIM SCHEDULE</div>
                            <div style=${splitRow}>
                              <button onClick=${() => { const next = !alwaysOnDisplay; setAlwaysOnDisplay(next); localStorage.setItem('alwaysOnDisplay', next); lastLocalOverrideTime.current = Date.now(); }} style=${mainBtn(autoDimColor)}>
                                ${alwaysOnDisplay ? '✅ Enabled — This Device' : '○ Disabled — This Device'}
                              </button>
                              <button title="Broadcast to all devices" onClick=${() => setPushConfirm({ label: 'turn Auto-Dim ' + (alwaysOnDisplay ? 'ON' : 'OFF') + ' on', action: () => window.database.ref('schellFamilyCalendar/forcedSettings/alwaysOnDisplay').set({ value: alwaysOnDisplay, ts: Date.now() }) })} style=${castBtn}>📡</button>
                            </div>
                          </div>

                          <!-- Manual Dim split row -->
                          <div>
                            <div style=${{ fontSize: '11px', color: '#6b7280', fontWeight: '700', marginBottom: '4px' }}>MANUAL DIM</div>
                            <div style=${splitRow}>
                              <button onClick=${() => setIsDimmed(!isDimmed)} style=${mainBtn(manualDimColor)}>
                                ${manualDimLabel}
                              </button>
                              <button title="Broadcast to all devices" onClick=${() => setPushConfirm({ label: (isDimmed ? 'clear manual dim on' : 'manually dim'), action: () => window.database.ref('schellFamilyCalendar/forcedSettings/isDimmed').set({ value: !isDimmed, ts: Date.now() }) })} style=${castBtn}>📡</button>
                            </div>
                          </div>

                          <!-- Temp Dim durations -->
                          <div>
                            <div style=${{ fontSize: '11px', color: '#6b7280', fontWeight: '700', marginBottom: '4px' }}>⏱ TEMP DIM ALL DEVICES</div>
                            <div style=${{ display: 'flex', gap: '6px' }}>
                              ${[15, 30, 60, 120].map(mins => html`<button key=${mins} onClick=${() => setPushConfirm({ label: 'dim all devices for ' + (mins >= 60 ? (mins/60) + 'h' : mins + 'm') + ' on', action: () => { const until = Date.now() + mins * 60000; window.database.ref('schellFamilyCalendar/forcedSettings/dimmedUntil').set({ value: until, ts: Date.now() }); } })} style=${durBtn}>
                                ${mins >= 60 ? (mins/60) + 'h' : mins + 'm'}
                              </button>`)}
                            </div>
                          </div>

                        </div>
                      </div>`;
                    })()}

                    <!-- CARD: SOUND -->
                    ${(() => {
                      const formatTime12 = (t) => {
                        if (!t) return '';
                        const [h, m] = t.split(':');
                        const hrs = parseInt(h, 10);
                        return `${hrs % 12 || 12}:${m} ${hrs >= 12 ? 'PM' : 'AM'}`;
                      };
                      const qtString = `${formatTime12(quietTimeStart)} – ${formatTime12(quietTimeEnd)}`;
                      const mutedUntil = parseInt(localStorage.getItem('tempMutedUntil') || '0', 10);
                      const tempMuteMinLeft = isTempMuted ? Math.ceil((mutedUntil - Date.now()) / 60000) : 0;

                      const splitRow = { display: 'flex', gap: '6px' };
                      const mainBtn = (color) => ({ flex: '0 0 75%', padding: '12px', background: color, color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textAlign: 'left' });
                      const castBtn = { flex: '0 0 calc(25% - 6px)', padding: '12px', background: '#374151', color: 'white', border: 'none', borderRadius: '10px', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
                      const durBtn = { flex: 1, padding: '8px 4px', background: '#fef3c7', color: '#92400e', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' };

                      const autoMuteColor = autoMuteEnabled ? '#10b981' : '#6b7280';
                      const manualMuteColor = isMuted ? '#10b981' : isAutoMuted ? '#f59e0b' : isTempMuted ? '#7c3aed' : '#6b7280';
                      const manualMuteLabel = isMuted ? '🔊 Muted — This Device (tap to unmute)' : isAutoMuted ? `🔇 Auto-Muted by schedule — tap to unmute` : isTempMuted ? `🔇 Temp Muted · ${tempMuteMinLeft}m left — tap to clear` : '🔇 Mute This Device Manually';

                      return html`<div style=${{ border: '2px solid #fde68a', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style=${{ background: '#fffbeb', padding: '8px 14px', borderBottom: '2px solid #fde68a' }}>
                          <span style=${{ fontSize: '11px', fontWeight: '800', color: '#92400e', letterSpacing: '0.08em' }}>SOUND</span>
                        </div>
                        <div style=${{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

                          <!-- Auto-Mute split row -->
                          <div>
                            <div style=${{ fontSize: '11px', color: '#6b7280', fontWeight: '700', marginBottom: '4px' }}>AUTO-MUTE SCHEDULE</div>
                            <div style=${splitRow}>
                              <button onClick=${() => { const next = !autoMuteEnabled; setAutoMuteEnabled(next); localStorage.setItem('autoMuteEnabled', next); lastLocalOverrideTime.current = Date.now(); }} style=${mainBtn(autoMuteColor)}>
                                ${autoMuteEnabled ? '✅ Enabled — This Device' : '○ Disabled — This Device'}
                              </button>
                              <button title="Broadcast to all devices" onClick=${() => setPushConfirm({ label: 'turn Auto-Mute ' + (autoMuteEnabled ? 'ON' : 'OFF') + ' on', action: () => window.database.ref('schellFamilyCalendar/forcedSettings/autoMuteEnabled').set({ value: autoMuteEnabled, ts: Date.now() }) })} style=${castBtn}>📡</button>
                            </div>
                          </div>

                          <!-- Manual Mute split row -->
                          <div>
                            <div style=${{ fontSize: '11px', color: '#6b7280', fontWeight: '700', marginBottom: '4px' }}>MANUAL MUTE</div>
                            <div style=${splitRow}>
                              <button onClick=${() => setIsMuted(!isMuted)} style=${mainBtn(manualMuteColor)}>
                                ${manualMuteLabel}
                              </button>
                              <button title="Broadcast to all devices" onClick=${() => setPushConfirm({ label: (isMuted ? 'unmute' : 'mute') + ' all', action: () => window.database.ref('schellFamilyCalendar/forcedSettings/isMuted').set({ value: !isMuted, ts: Date.now() }) })} style=${castBtn}>📡</button>
                            </div>
                          </div>

                          <!-- Temp Mute durations -->
                          <div>
                            <div style=${{ fontSize: '11px', color: '#6b7280', fontWeight: '700', marginBottom: '4px' }}>⏱ TEMP MUTE ALL DEVICES</div>
                            <div style=${{ display: 'flex', gap: '6px' }}>
                              ${[15, 30, 60, 120].map(mins => html`<button key=${mins} onClick=${() => setPushConfirm({ label: 'mute all devices for ' + (mins >= 60 ? (mins/60) + 'h' : mins + 'm') + ' on', action: () => { const until = Date.now() + mins * 60000; window.database.ref('schellFamilyCalendar/forcedSettings/mutedUntil').set({ value: until, ts: Date.now() }); } })} style=${durBtn}>
                                ${mins >= 60 ? (mins/60) + 'h' : mins + 'm'}
                              </button>`)}
                            </div>
                          </div>

                        </div>
                      </div>`;
                    })()}

                  </div>
                  </div>`}
                </div>
              </div>
            </div>`
          )}
          ${editingMember && (
            html`<div style=${{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }} onClick=${()=>setEditingMember(null)}>
               <div className="edit-member-modal" onClick=${e=>e.stopPropagation()} style=${{ background:'white', padding:'30px', borderRadius:'20px', width:'400px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }}>
                  <h3 style=${{ marginTop: 0, marginBottom: '20px', fontSize: '20px', color: '#1f2937' }}>Edit ${editingMember.name}</h3>

                  
                  <div style=${{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', padding: '14px', background: '#f9fafb', borderRadius: '10px', border: '2px solid #e5e7eb' }}>
                    <div style=${{ width: '55px', height: '55px', borderRadius: '50%', background: editingMember.color, border: `3px solid ${editingMember.color}`, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '22px', fontWeight: 'bold' }}>
                      ${(editingMember.previewAvatar || editingMember.avatar)
                        ? html`<img src=${editingMember.previewAvatar || editingMember.avatar} style=${{ width: '100%', height: '100%', objectFit: 'cover' }} alt=${editingMember.name} />`
                        : editingMember.name[0]}
                    </div>
                    <div style=${{ flex: 1 }}>
                      <label style=${{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '6px' }}>Profile Photo</label>
                      <input type="file" id="editMemberAvatar" accept="image/*"
                        onChange=${(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setEditingMember({ ...editingMember, previewAvatar: URL.createObjectURL(file) });
                          }
                        }}
                        style=${{ width: '100%', fontSize: '13px', cursor: 'pointer' }} />
                      ${(editingMember.avatar || editingMember.previewAvatar) && (
                        html`<button onClick=${() => {
                            document.getElementById('editMemberAvatar').value = '';
                            setEditingMember({ ...editingMember, avatar: null, previewAvatar: null });
                          }}
                          style=${{ marginTop: '6px', fontSize: '11px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                          ✕ Remove photo
                        </button>`
                      )}
                    </div>
                  </div>

                  <label style=${{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>Name</label>
                  <input id="editName" defaultValue=${editingMember.name} style=${{ width:'100%', marginBottom:'12px', padding:'10px', fontSize: '14px', borderRadius: '8px', border: '2px solid #e5e7eb' }} />

                  <label style=${{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>Colour</label>
                  <input id="editColor" type="color" defaultValue=${editingMember.color} style=${{ width:'100%', height:'40px', marginBottom:'12px', borderRadius: '8px', border: '2px solid #e5e7eb', cursor: 'pointer' }} />

                  ${editingMember.participatesInChores && (html`<${React.Fragment}>
                    <label style=${{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>💵 Pay Rate (per point)</label>
                    <div style=${{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style=${{ fontSize: '16px', color: '#6b7280', fontWeight: 'bold' }}>$</span>
                      <input id="editPayRate" type="number" step="0.01" min="0" defaultValue=${editingMember.payRate || 0.01} style=${{ width: '100px', padding: '10px', fontSize: '14px', borderRadius: '8px', border: '2px solid #e5e7eb' }} />
                      <span style=${{ fontSize: '12px', color: '#9ca3af' }}>e.g. 0.05 = $5 per 100 pts</span>
                    </div>

                    <label style=${{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>🎵 Signature Sound</label>
                    <div style=${{ marginBottom: '16px' }}><${TouchDropdown} options=${SOUNDS} initialValue=${editingMember.signatureSound || 'level-up'} domId="editMemberSound" /></div>
                    <button onClick=${() => playSignatureSound(document.getElementById('editMemberSound').value)} style=${{ width: '100%', padding: '8px', background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', marginBottom: '16px' }}>▶ Preview Sound</button>
                  <//>`)}

                  <button id="editMemberSaveBtn" onClick=${async ()=>{
                     const newName = document.getElementById('editName').value;
                     const newColor = document.getElementById('editColor').value;
                     const newSound = editingMember.participatesInChores ? document.getElementById('editMemberSound').value : editingMember.signatureSound;
                     const newPayRate = editingMember.participatesInChores ? parseFloat(document.getElementById('editPayRate').value) : null;
                     const avatarFile = document.getElementById('editMemberAvatar').files[0];
                     const btn = document.getElementById('editMemberSaveBtn');
                     // Always read the true original from the live familyMembers array
                     const originalAvatar = familyMembers.find(m => m.id === editingMember.id)?.avatar || null;
                     const applyUpdate = (avatar) => {
                       const update = { name: newName, color: newColor, signatureSound: newSound, payRate: newPayRate };
                       if (avatar !== undefined) update.avatar = avatar;
                       updateFamilyMember(editingMember.id, update);
                       setEditingMember(null);
                     };
                     if (avatarFile) {
                       btn.textContent = 'Uploading...'; btn.disabled = true;
                       try {
                         if (originalAvatar) deleteImageFromCloudflare(originalAvatar);
                         const url = await uploadImageToCloudflare(avatarFile);
                         applyUpdate(url);
                       } catch(e) { alert('Avatar upload failed. Saved without new photo.'); applyUpdate(editingMember.avatar ?? null); }
                       finally { btn.textContent = 'Save'; btn.disabled = false; }
                     } else {
                       // If photo was manually cleared but the original had a URL, delete it
                       if (editingMember.avatar === null && originalAvatar) {
                         deleteImageFromCloudflare(originalAvatar);
                       }
                       applyUpdate(editingMember.avatar ?? null);
                     }
                  }} style=${{ width:'100%', padding:'12px', background:'#10b981', color:'white', border:'none', borderRadius:'8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>Save</button>
               </div>
            </div>`
          )}

          
          ${showPinEntry && (
            html`<div style=${{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }} onClick=${() => setShowPinEntry(false)}>
              <div onClick=${e => e.stopPropagation()} style=${{ background: 'white', padding: '30px', borderRadius: '20px', width: '350px', maxWidth: '95vw', textAlign: 'center' }}>
                <h3 style=${{ marginTop: 0, fontSize: '20px', color: '#1f2937' }}>🔒 Admin Access</h3>
                <p style=${{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>Enter PIN to access admin panel</p>
                <input
                  type="password"
                  id="pinInput"
                  inputMode="numeric"
                  maxLength="4"
                  placeholder="••••"
                  autoFocus
                  style=${{ width: '100%', padding: '16px', fontSize: '24px', textAlign: 'center', letterSpacing: '8px', borderRadius: '10px', border: '2px solid #e5e7eb', marginBottom: '16px', fontWeight: 'bold' }}
                  onKeyPress=${e => {
                    if (e.key === 'Enter') {
                      const pin = document.getElementById('pinInput').value;
                      if (pin === ADMIN_PIN) {
                        setIsAdminAuthenticated(true);
                        setShowPinEntry(false);
                        setShowAdmin(true);
                      } else {
                        alert('Incorrect PIN');
                        document.getElementById('pinInput').value = '';
                      }
                    }
                  }}
                />
<button
                  onClick=${() => {
                    const pin = document.getElementById('pinInput').value;
                    if (pin === ADMIN_PIN) {
                      setIsAdminAuthenticated(true);
                      setShowPinEntry(false);
                      setShowAdmin(true);
                    } else {
                      alert('Incorrect PIN');
                      document.getElementById('pinInput').value = '';
                    }
                  }}
                  style=${{ width: '100%', padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Unlock
                </button>

                <div style=${{ textAlign: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '2px solid #e5e7eb', fontSize: '12px', color: '#9ca3af', fontWeight: '600' }}>
                  Calendar Version: ${APP_VERSION}
                </div>

              </div>
            </div>`
          )}

          
          ${showWeatherForecast && (
            html`<div style=${{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }} onClick=${() => setShowWeatherForecast(false)}>
              <div onClick=${e => e.stopPropagation()} style=${{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style=${{ padding: '24px 24px 16px', borderBottom: '2px solid #e5e7eb' }}>
                  <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style=${{ margin: 0, fontSize: '20px', color: '#1f2937' }}>🌤️ 7-Day Forecast</h3>
                    <button onClick=${() => setShowWeatherForecast(false)} style=${{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280', padding: 0 }}>✕</button>
                  </div>
                  <div style=${{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Whitby, Ontario</div>
                </div>
                
                <div style=${{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
                  ${weatherForecast.map((day, idx) => {
                    const dayName = day.isToday ? 'Today' : day.dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                    
                    return (
                      html`<div key=${day.date} style=${{ marginBottom: '12px', border: day.isToday ? '2px solid #667eea' : '2px solid #e5e7eb', borderRadius: '12px', padding: '14px 16px', background: day.isToday ? '#f0f4ff' : 'white' }}>
                        <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style=${{ flex: 1 }}>
                            <div style=${{ fontSize: '15px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>${dayName}</div>
                            <div style=${{ fontSize: '13px', color: '#6b7280' }}>${day.condition}</div>
                          </div>
                          <div style=${{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style=${{ textAlign: 'center' }}>
                              <div style=${{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>High</div>
                              <div style=${{ fontSize: '20px', fontWeight: '700', color: '#ef4444' }}>${day.maxTemp}°</div>
                            </div>
                            <div style=${{ textAlign: 'center' }}>
                              <div style=${{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>Low</div>
                              <div style=${{ fontSize: '20px', fontWeight: '700', color: '#3b82f6' }}>${day.minTemp}°</div>
                            </div>
                          </div>
                        </div>
                        ${day.sunrise && day.sunset && (
                          html`<div style=${{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '16px', fontSize: '11px', color: '#6b7280' }}>
                            <span>🌞 ${day.sunrise}</span>
                            <span>🌜 ${day.sunset}</span>
                          </div>`
                        )}
                      </div>`
                    );
                  })}
                </div>
              </div>
            </div>`
          )}

          
          ${editingChore && (
            html`<div style=${{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }} onClick=${() => setEditingChore(null)}>
              <div onClick=${e => e.stopPropagation()} style=${{ background: 'white', padding: '30px', borderRadius: '20px', width: '400px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }}>
                <h3 style=${{ marginTop: 0, marginBottom: '20px', fontSize: '20px', color: '#1f2937' }}>Edit ${editingChore.name}</h3>

                <label style=${{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>Chore Name</label>
                <input id="editChoreName" defaultValue=${editingChore.name} style=${{ width: '100%', marginBottom: '12px', padding: '10px', fontSize: '14px', borderRadius: '8px', border: '2px solid #e5e7eb' }} />

                <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style=${{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>Points</label>
                    <input id="editChorePoints" type="number" defaultValue=${editingChore.points} style=${{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '8px', border: '2px solid #e5e7eb' }} />
                  </div>
                  <div>
                    <label style=${{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>Frequency</label>
                    <select id="editChoreFrequency" defaultValue=${editingChore.frequency || 'daily'} onChange=${(e) => {
                      document.getElementById('editChoreDaysWrapper').style.display = (e.target.value === 'weekly' || e.target.value === 'bi-weekly') ? 'block' : 'none';
                      document.getElementById('editChoreStartDateWrapper').style.display = e.target.value === 'bi-weekly' ? 'block' : 'none';
                    }} style=${{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '8px', border: '2px solid #e5e7eb' }}>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-Weekly</option>
                    </select>
                  </div>
                </div>

                <div id="editChoreDaysWrapper" style=${{ display: (editingChore.frequency === 'weekly' || editingChore.frequency === 'bi-weekly') ? 'block' : 'none', marginBottom: '12px' }}>
                  <label style=${{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>Select Days</label>
                  <div id="editChoreDays" style=${{ display: 'flex', gap: '4px', justifyContent: 'space-between' }}>
                    ${['S','M','T','W','T','F','S'].map((day, i) => {
                      const isChecked = editingChore.days ? editingChore.days.includes(i) : (editingChore.weekDay === i);
                      return (
                        html`<label key=${i} style=${{ flex: 1, textAlign: 'center', background: isChecked ? '#eef2ff' : 'white', border: `2px solid ${isChecked ? '#667eea' : '#e5e7eb'}`, borderRadius: '6px', padding: '6px 0', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', color: isChecked ? '#667eea' : '#374151' }}>
                          <input type="checkbox" value=${i} defaultChecked=${isChecked} style=${{ display: 'none' }} onChange=${(e) => {
                            e.target.parentElement.style.background = e.target.checked ? '#eef2ff' : 'white';
                            e.target.parentElement.style.borderColor = e.target.checked ? '#667eea' : '#e5e7eb';
                            e.target.parentElement.style.color = e.target.checked ? '#667eea' : '#374151';
                          }}/>
                          ${day}
                        </label>`
                      );
                    })}
                  </div>
                </div>

                <div id="editChoreStartDateWrapper" style=${{ display: editingChore.frequency === 'bi-weekly' ? 'block' : 'none', marginBottom: '12px' }}>
                  <label style=${{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>Starting Week Of</label>
                  <input type="date" id="editChoreStartDate" defaultValue=${editingChore.startDate || ''} style=${{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '8px', border: '2px solid #e5e7eb', boxSizing: 'border-box' }} />
                </div>

                <label style=${{ fontSize: '12px', fontWeight: '700', color: '#374151', display: 'block', marginBottom: '4px' }}>Assigned To</label>
                <select id="editChoreAssign" defaultValue=${editingChore.assignedTo || 'unassigned'} style=${{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '8px', border: '2px solid #e5e7eb', marginBottom: '16px' }}>
                  <option value="unassigned">⭐ Bonus</option>
                  ${familyMembers.map(m => html`<option key=${m.id} value=${m.id}>${m.name}</option>`)}
                </select>

                <button
                  onClick=${() => {
                    const name = document.getElementById('editChoreName').value;
                    const points = parseInt(document.getElementById('editChorePoints').value) || 0;
                    const frequency = document.getElementById('editChoreFrequency').value;
                    const days = Array.from(document.querySelectorAll('#editChoreDays input:checked')).map(cb => parseInt(cb.value));
                    const startDate = document.getElementById('editChoreStartDate').value;
                    const assignedTo = document.getElementById('editChoreAssign').value;
                    const updatedChores = chores.map(c => c.id === editingChore.id ? { ...c, name, points, frequency, days: days.length > 0 ? days : null, startDate: startDate || null, weekDay: null, assignedTo } : c);
                    setChores(updatedChores);
                    setEditingChore(null);
                  }}
                  style=${{ width: '100%', padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Save
                </button>
              </div>
            </div>`
          )}

          
          ${selectedHistoryDate && (() => {
            const dateStr = selectedHistoryDate.date;
            const byMember = {};
            
            // Initialize with all kids so we can add chores even if they had 0 points that day
            familyMembers.filter(m => m.participatesInChores).forEach(kid => {
              byMember[kid.id] = {
                name: kid.name,
                color: kid.color,
                chores: [],
                total: 0
              };
            });
            
            Object.keys(selectedHistoryDate.scores || {}).forEach(kidId => {
              const kidData = selectedHistoryDate.scores[kidId];
              if (byMember[kidId]) {
                 byMember[kidId].name = kidData.name;
                 byMember[kidId].total = kidData.score || 0;
                 byMember[kidId].chores = kidData.choresDone ? [...kidData.choresDone] : [];
              } else if (kidData.score > 0 || (kidData.choresDone && kidData.choresDone.length > 0)) {
                 byMember[kidId] = {
                   name: kidData.name,
                   color: '#ccc',
                   chores: kidData.choresDone ? [...kidData.choresDone] : [],
                   total: kidData.score || 0
                 };
              }
            });

            const hasSnapshottedChores = Object.values(selectedHistoryDate.scores || {}).some(s => s.choresDone !== undefined);
            
            if (!hasSnapshottedChores) {
              Object.keys(choreCompletions).forEach(key => {
                if (key.endsWith(`-${dateStr}`) && !key.includes('-claimer') && choreCompletions[key]) {
                  if (key.startsWith('bonus-')) {
                    const completedBy = key.replace('bonus-', '').replace(`-${dateStr}`, '');
                    if (byMember[completedBy]) {
                      byMember[completedBy].chores.push({
                        name: '🏆 Daily Completion Bonus',
                        points: completionBonus,
                        wasBonus: true
                      });
                    }
                  } else {
                    const choreId = key.replace(`-${dateStr}`, '');
                    const chore = chores.find(c => c.id === choreId);
                    if (chore) {
                      const claimerId = choreCompletions[`${key}-claimer`];
                      const completedBy = claimerId || chore.assignedTo;
                      if (byMember[completedBy]) {
                        byMember[completedBy].chores.push({
                          name: chore.name,
                          points: chore.points,
                          wasBonus: !chore.assignedTo || chore.assignedTo === 'unassigned'
                        });
                      }
                    }
                  }
                }
              });

              Object.values(byMember).forEach(memberData => {
                const foundPoints = memberData.chores.reduce((sum, c) => sum + c.points, 0);
                if (memberData.total > foundPoints) {
                   memberData.chores.push({
                     name: 'One-Time / Deleted Chore',
                     points: memberData.total - foundPoints,
                     wasBonus: false
                   });
                }
              });
            }

            const updateHistoryEntry = (kidId, updatedChoresList, updatedTotal) => {
               // Build a fully-snapshotted scores object for ALL kids from byMember.
               // This prevents a partial snapshot bug where editing one kid causes
               // hasSnapshottedChores to flip true, wiping the other kids' chore lists.
               const updatedHistory = scoreHistory.map(h => {
                 if (h.date === dateStr) {
                   const allScores = {};
                   Object.entries(byMember).forEach(([id, memberData]) => {
                     // Preserve the existing payRate if it exists
                     const existingPayRate = h.scores && h.scores[id] && h.scores[id].payRate !== undefined 
                                             ? h.scores[id].payRate 
                                             : (familyMembers.find(m => m.id === id)?.payRate || 0.01);
                     allScores[id] = {
                       name: memberData.name,
                       score: id === kidId ? updatedTotal : memberData.total,
                       payRate: existingPayRate,
                       choresDone: id === kidId ? updatedChoresList : [...memberData.chores]
                     };
                   });
                   return { ...h, scores: allScores };
                 }
                 return h;
               });
               setScoreHistory(updatedHistory);
               setSelectedHistoryDate(updatedHistory.find(h => h.date === dateStr));
               
               // Save directly to the dedicated history bucket
               window.database.ref('schellFamilyHistory').set(updatedHistory);
            };

            return (
              html`<div style=${{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }} onClick=${() => setSelectedHistoryDate(null)}>
                <div onClick=${e => e.stopPropagation()} style=${{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style=${{ padding: '24px 24px 16px', borderBottom: '2px solid #e5e7eb' }}>
                    <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style=${{ margin: 0, fontSize: '20px', color: '#1f2937' }}>📊 ${dateStr}</h3>
                      <button onClick=${() => setSelectedHistoryDate(null)} style=${{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280', padding: 0 }}>✕</button>
                    </div>
                    <p style=${{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>Add or remove chores to retroactively fix allowances.</p>
                  </div>
                  
                  <div style=${{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
                    ${Object.keys(byMember).length === 0 ? (
                      html`<div style=${{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                        <div style=${{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
                        <div style=${{ fontSize: '16px', fontWeight: '600' }}>No kids found</div>
                      </div>`
                    ) : (
                      Object.entries(byMember).map(([kidId, member]) => (
                        html`<div key=${kidId} style=${{ marginBottom: '20px', border: '2px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                          <div style=${{ background: member.color, color: 'white', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style=${{ fontWeight: '700', fontSize: '16px' }}>${member.name}</span>
                            <span style=${{ fontWeight: '700', fontSize: '18px' }}>${member.total} ⭐</span>
                          </div>
                          <div style=${{ padding: '12px 16px', background: 'white' }}>
                            ${member.chores.length === 0 && (
                              html`<div style=${{ fontSize: '13px', color: '#9ca3af', fontStyle: 'italic', marginBottom: '8px' }}>No chores completed.</div>`
                            )}
                            ${member.chores.map((chore, i) => (
                              html`<div key=${i} style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < member.chores.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                <span style=${{ fontSize: '14px', color: '#374151' }}>
                                  ${chore.wasBonus && '⭐ '}${chore.name}
                                </span>
                                <div style=${{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style=${{ fontSize: '14px', fontWeight: '600', color: '#f59e0b' }}>+${chore.points}</span>
                                  <button onClick=${() => {
                                      if(confirm(`Remove "${chore.name}" from ${member.name}'s history?`)) {
                                          const newChores = [...member.chores];
                                          newChores.splice(i, 1);
                                          updateHistoryEntry(kidId, newChores, Math.max(0, member.total - chore.points));
                                      }
                                  }} style=${{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', padding: '4px 8px', fontWeight: 'bold' }}>✕</button>
                                </div>
                              </div>`
                            ))}
                            
                            <div style=${{ marginTop: '12px', paddingTop: '12px', borderTop: member.chores.length > 0 ? '2px dashed #e5e7eb' : 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                               <select 
                                 value=""
                                 onChange=${(e) => {
                                    if(!e.target.value) return;
                                    let choreToAdd = null;
                                    
                                    if (e.target.value === 'MANUAL_BONUS') {
                                        choreToAdd = { name: 'Daily Completion Bonus', points: completionBonus, wasBonus: true };
                                    } else {
                                        const selectedChore = chores.find(c => c.id === e.target.value);
                                        if(selectedChore) choreToAdd = { name: selectedChore.name, points: selectedChore.points, wasBonus: !selectedChore.assignedTo || selectedChore.assignedTo === 'unassigned' };
                                    }

                                    if(choreToAdd) {
                                       const newChores = [...member.chores, choreToAdd];
                                       updateHistoryEntry(kidId, newChores, member.total + choreToAdd.points);
                                    }
                                 }}
                                 style=${{ width: '100%', padding: '8px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#475569', background: '#f8fafc', cursor: 'pointer' }}
                               >
                                 <option value="">+ Add ${member.name}'s chore...</option>
                                 ${chores.filter(c => c.assignedTo === kidId && !c.isArchived).map(c => (
                                     html`<option key=${c.id} value=${c.id}>${c.name} (${c.points} pts)</option>`
                                 ))}
                                 ${completionBonus > 0 && (
                                     html`<option value="MANUAL_BONUS">🏆 Daily Completion Bonus (${completionBonus} pts)</option>`
                                 )}
                               </select>
                               <div style=${{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                 <div style=${{ display: 'flex', gap: '6px' }}>
                                   <input
                                     type="number"
                                     min="0"
                                     placeholder="Misc pts..."
                                     id=${`misc-pts-${kidId}`}
                                     style=${{ width: '90px', flexShrink: 0, padding: '8px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#475569', background: '#f8fafc' }}
                                   />
                                   <input
                                     type="text"
                                     placeholder="Label (optional)"
                                     id=${`misc-label-${kidId}`}
                                     style=${{ flex: 1, minWidth: 0, padding: '8px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#475569', background: '#f8fafc' }}
                                   />
                                 </div>
                                 <button
                                   onClick=${() => {
                                     const pts = parseInt(document.getElementById(`misc-pts-${kidId}`).value);
                                     if (!pts) return;
                                     const label = document.getElementById(`misc-label-${kidId}`).value.trim() || 'Miscellaneous';
                                     const choreToAdd = { name: label, points: pts, wasBonus: false };
                                     const newChores = [...member.chores, choreToAdd];
                                     updateHistoryEntry(kidId, newChores, member.total + pts);
                                     document.getElementById(`misc-pts-${kidId}`).value = '';
                                     document.getElementById(`misc-label-${kidId}`).value = '';
                                   }}
                                   style=${{ width: '100%', padding: '8px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                                 >+ Add Miscellaneous</button>
                               </div>
                            </div>
                          </div>
                        </div>`
                      ))
                    )}
                  </div>
                </div>
              </div>`
            );
          })()}
          
          
          ${celebratingKid && (
            html`<div
              onClick=${() => setCelebratingKid(null)}
              style=${{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100001, flexDirection: 'column', gap: '24px', padding: '30px', cursor: 'pointer' }}
            >
              <div style=${{ textAlign: 'center', animation: 'none' }}>
                
                <div style=${{ width: '120px', height: '120px', borderRadius: '50%', background: celebratingKid.color, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '6px solid white', boxShadow: `0 0 40px ${celebratingKid.color}` }}>
                  ${celebratingKid.avatar
                    ? html`<img src=${celebratingKid.avatar} style=${{ width: '100%', height: '100%', objectFit: 'cover' }} />`
                    : html`<span style=${{ fontSize: '52px', color: 'white', fontWeight: 'bold' }}>${celebratingKid.name[0]}</span>`
                  }
                </div>
                
                <div style=${{ fontSize: '22px', fontWeight: '900', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '8px' }}>Mission Complete!</div>
                <div style=${{ fontSize: '48px', fontWeight: '900', color: 'white', marginBottom: '8px', textShadow: `0 0 30px ${celebratingKid.color}` }}>${celebratingKid.name}</div>
                <div style=${{ fontSize: '18px', color: '#d1fae5', marginBottom: '24px' }}>All chores done for today! 🎉</div>
                
                <div style=${{ display: 'inline-block', background: celebratingKid.color, color: 'white', padding: '12px 32px', borderRadius: '50px', fontSize: '22px', fontWeight: '800', boxShadow: `0 0 20px ${celebratingKid.color}88` }}>
                  ${scores[celebratingKid.id] || 0} ⭐ Today
                </div>
                <div style=${{ marginTop: '32px', fontSize: '13px', color: '#6b7280' }}>tap to dismiss</div>
              </div>
            </div>`
          )}

          ${showClaimChore && (
            html`<div style=${{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1100 }} onClick=${()=>setShowClaimChore(null)}>
               <div style=${{ background:'white', padding:'30px', borderRadius:'20px', width:'400px' }}>
                  <h3>Who did this?</h3>
                  <div style=${{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                     ${familyMembers.filter(m=>m.participatesInChores).map(m=>{
                        const here = isHereToday(m);
                        return (
                        html`<button key=${m.id} disabled=${!here} onClick=${()=>{
                           if (!here) return;
                           const todayStr = new Date().toDateString();
                           const key = `${showClaimChore}-${todayStr}`;
                           const claimedChore = chores.find(c=>c.id===showClaimChore);
                           if (!claimedChore) { setShowClaimChore(null); return; }

                           setChoreCompletions({...choreCompletions, [key]: true, [`${key}-claimer`]: m.id});
                           setScores({...scores, [m.id]: (scores[m.id]||0) + claimedChore.points});

                           const updates = {};
                           updates[`choreCompletions/${key}`] = true;
                           updates[`choreCompletions/${key}-claimer`] = m.id;
                           updates[`scores/${m.id}`] = firebase.database.ServerValue.increment(claimedChore.points);
                           lastDailyWriteTime.current = Date.now();
                           window.database.ref('schellFamilyDaily').update(updates);

                           setShowClaimChore(null);
                        }} style=${{ padding:'15px', border:`2px solid ${here ? m.color : '#ef4444'}`, borderRadius:'10px', background: here ? 'white' : '#fee2e2', color: here ? '#1f2937' : '#ef4444', cursor: here ? 'pointer' : 'not-allowed' }}>
                           ${m.name}${!here && html`<div style=${{fontSize:'10px', marginTop:'4px'}}>Away</div>`}
                        </button>`
                        );
                     })}
                  </div>
               </div>
            </div>`
          )}

          ${showDayView && dayViewDate && (
             html`<div 
               style=${{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}
               onClick=${() => setShowDayView(false)}
             >
               <div 
                 onClick=${e => e.stopPropagation()}
                 style=${{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '560px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 60px rgba(0,0,0,0.4)', overflow: 'hidden' }}
               >
                 <div style=${{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px 24px', color: 'white', flexShrink: 0 }}>
                   <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                     <div>
                       <div style=${{ fontSize: '13px', fontWeight: '600', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                         ${dayViewDate.toLocaleDateString('default', { weekday: 'long' })}
                       </div>
                       <div style=${{ fontSize: '28px', fontWeight: '700' }}>
                         ${dayViewDate.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
                       </div>
                       <div style=${{ fontSize: '13px', opacity: 0.75, marginTop: '4px' }}>
                         ${getEventsForDate(dayViewDate).length === 0 ? 'No events' : `${getEventsForDate(dayViewDate).length} event${getEventsForDate(dayViewDate).length !== 1 ? 's' : ''}`}
                       </div>
                     </div>
                     <button 
                       onClick=${() => setShowDayView(false)}
                       style=${{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                     >✕</button>
                   </div>
                 </div>

                 <div style=${{ overflowY: 'auto', padding: '16px', flex: 1 }}>
                   ${getEventsForDate(dayViewDate).length === 0 ? (
                     html`<div style=${{ textAlign: 'center', color: '#9ca3af', padding: '40px 0' }}>
                       <div style=${{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
                       <div style=${{ fontSize: '16px', fontWeight: '600' }}>Nothing scheduled</div>
                       <div style=${{ fontSize: '13px', marginTop: '4px' }}>Click below to add an event</div>
                     </div>`
                   ) : (
                     getEventsForDate(dayViewDate).map(event => {
                       const memberIds = Array.isArray(event.member) ? event.member : [event.member];
                       const isFamilyEvent = memberIds.includes('family');
                       const isMisc = memberIds.includes('misc');
                       const memberColors = isFamilyEvent 
                         ? ['#667eea', '#764ba2']
                         : memberIds.filter(id => id !== 'misc').map(id => familyMembers.find(m => m.id === id)?.color || '#ccc');
                       const stripBg = memberColors.length === 1 
                         ? memberColors[0] 
                         : `linear-gradient(180deg, ${memberColors.join(', ')})`;
                       const memberNames = isFamilyEvent ? 'Family' : isMisc ? 'Misc' :
                         memberIds.map(id => familyMembers.find(m => m.id === id)?.name || '').filter(Boolean).join(', ');

                       return (
                         html`<div key=${event.id} style=${{ display: 'flex', gap: '0', borderRadius: '12px', overflow: 'hidden', marginBottom: '10px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                           <div style=${{ width: '6px', background: stripBg, flexShrink: 0 }} />
                           <div style=${{ flex: 1, padding: '14px 16px' }}>
                             <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                               <div style=${{ flex: 1 }}>
                                 <div style=${{ fontWeight: '700', fontSize: '15px', color: '#111827', marginBottom: '4px' }}>${event.title}</div>
                                 <div style=${{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                                   ${(event.time || event.endTime) && (
                                     html`<span style=${{ fontSize: '12px', color: '#6b7280', background: '#f3f4f6', padding: '2px 8px', borderRadius: '20px' }}>
                                       🕐 ${event.time}${event.time && event.endTime ? ' – ' : ''}${event.endTime}
                                     </span>`
                                   )}
                                   <span style=${{ fontSize: '12px', color: '#6b7280', background: '#f3f4f6', padding: '2px 8px', borderRadius: '20px' }}>
                                     👤 ${memberNames}
                                   </span>
                                   ${event.isMultiDay && (
                                     html`<span style=${{ fontSize: '12px', color: '#667eea', background: '#eef2ff', padding: '2px 8px', borderRadius: '20px' }}>
                                       📅 Multi-day
                                     </span>`
                                   )}
                                 </div>
                               </div>
                               ${!event.isHoliday && (
                                 html`<div style=${{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                   <button 
                                     onClick=${(e) => { setShowDayView(false); openEditEvent(event, e); }}
                                     style=${{ padding: '6px 12px', background: '#eef2ff', color: '#667eea', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}
                                   >✏️ Edit</button>
                                   <button 
                                     onClick=${() => { 
                                       if (confirmDeleteEvent(event)) {
                                         if (event.groupId) {
                                           setEvents(events.filter(e => e.groupId !== event.groupId));
                                         } else {
                                           setEvents(events.filter(e => e.id !== event.id));
                                         }
                                       }
                                     }}
                                     style=${{ padding: '6px 12px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}
                                   >🗑</button>
                                 </div>`
                               )}
                             </div>
                           </div>
                         </div>`
                       );
                     })
                   )}
                 </div>

                 <div style=${{ padding: '16px', borderTop: '1px solid #e5e7eb', flexShrink: 0 }}>
                   <button
                     onClick=${() => {
                       const dateStr = dayViewDate.toISOString().split('T')[0];
                       setEditingEvent(null);
                       setNewEvent({ title: '', member: [], time: '', endTime: '', date: dateStr, endDate: '' });
                       setShowDayView(false);
                       setShowAddEvent(true);
                     }}
                     style=${{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}
                   >
                     + Add Event
                   </button>
                 </div>
               </div>
             </div>`
          )}

          ${pushConfirm && html`
            <div onClick=${() => setPushConfirm(null)} style=${{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '30px' }}>
              <div onClick=${e => e.stopPropagation()} style=${{ background: 'white', borderRadius: '16px', padding: '24px', maxWidth: '340px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                <div style=${{ fontSize: '32px', marginBottom: '12px' }}>📡</div>
                <div style=${{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>Push to All Devices?</div>
                <div style=${{ fontSize: '14px', color: '#6b7280', marginBottom: '20px', lineHeight: '1.5' }}>This will ${pushConfirm.label} connected to the calendar.</div>
                <div style=${{ display: 'flex', gap: '10px' }}>
                  <button onClick=${() => setPushConfirm(null)} style=${{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                  <button onClick=${() => { pushConfirm.action(); setPushConfirm(null); }} style=${{ flex: 1, padding: '12px', background: '#4338ca', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>Yes, Push</button>
                </div>
              </div>
            </div>
          `}

          <button className="fab-button" onClick=${() => { setEditingEvent(null); setShowAddEvent(true); }} style=${{ display: 'none', position: 'fixed', bottom: '24px', right: '24px', width: '56px', height: '56px', borderRadius: '50%', background: '#667eea', color: 'white', border: 'none', fontSize: '28px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 900, alignItems: 'center', justifyContent: 'center' }}>+</button>

          
          ${selectedKidSummary && (() => {
            const kid = selectedKidSummary;
            const today = new Date();

            const sunday = new Date(today);
            sunday.setDate(today.getDate() - today.getDay());
            sunday.setHours(0,0,0,0);

            let totalPoints = scores[kid.id] || 0;
            let daysBreakdown = [];

            daysBreakdown.push({ date: today.toDateString(), points: scores[kid.id] || 0, isToday: true });

            // Declare live pay rate up front so it's available for the lastWeekPayRate fallback below
            const livePayRate = kid.payRate !== undefined ? kid.payRate : 0.01;

            const lastSaturday = new Date(sunday);
            lastSaturday.setDate(lastSaturday.getDate() - 1);
            const lastSunday = new Date(lastSaturday);
            lastSunday.setDate(lastSunday.getDate() - 6);
            let lastWeekAllowance = 0;
            let lastWeekPayRate = livePayRate; // fallback to live rate
            let foundPayoutStamp = false;

            scoreHistory.forEach(h => {
              const hDate = new Date(h.date);
              hDate.setHours(0,0,0,0);
              
              const s = h.scores && h.scores[kid.id];
              const pts = s ? s.score : 0;

              if (hDate >= sunday && hDate < today) {
                totalPoints += pts;
                daysBreakdown.push({ date: h.date, points: pts, isToday: false });
              }
              
              // Extract last week's exact payout from Saturday's chore list to prevent historical rewriting
              if (h.date === lastSaturday.toDateString() && s && s.choresDone) {
                 const payoutChore = s.choresDone.find(c => c.name && c.name.startsWith('💰 Weekly Allowance Payout: $'));
                 if (payoutChore) {
                    lastWeekAllowance = parseFloat(payoutChore.name.replace('💰 Weekly Allowance Payout: $', '')) || 0;
                    foundPayoutStamp = true;
                 }
                 // Grab snapshotted pay rate from Saturday entry for fallback calculation
                 if (s.payRate !== undefined) lastWeekPayRate = s.payRate;
              }
            });

            // Fallback: if no payout stamp exists (old data before this feature), calculate manually
            if (!foundPayoutStamp) {
              let lastWeekPoints = 0;
              scoreHistory.forEach(h => {
                const hDate = new Date(h.date);
                hDate.setHours(0,0,0,0);
                if (hDate >= lastSunday && hDate <= lastSaturday) {
                  const s = h.scores && h.scores[kid.id];
                  if (s) lastWeekPoints += s.score || 0;
                }
              });
              lastWeekAllowance = lastWeekPoints * lastWeekPayRate;
            }

            daysBreakdown.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // This week is calculated entirely at the CURRENT pay rate
            const allowanceValue = (totalPoints * livePayRate).toFixed(2);
            const lastWeekValue = lastWeekAllowance.toFixed(2);
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            return (
              html`<div style=${{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }} onClick=${() => setSelectedKidSummary(null)}>
                <div onClick=${e => e.stopPropagation()} style=${{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '400px', maxHeight: '90vh', overflowY: 'auto', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }}>

                  
                  <div style=${{ background: kid.color, padding: '20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
                    <div style=${{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style=${{ width: '55px', height: '55px', borderRadius: '50%', background: 'white', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: kid.color, fontSize: '20px', fontWeight: 'bold' }}>
                        ${kid.avatar ? html`<img src=${kid.avatar} style=${{ width: '100%', height: '100%', objectFit: 'cover' }} alt=${kid.name} />` : kid.name[0]}
                      </div>
                      <div>
                        <h3 style=${{ margin: 0, fontSize: '22px' }}>${kid.name}</h3>
                        ${showAllowanceSummary && html`<div style=${{ fontSize: '12px', opacity: 0.9 }}>This Week's Earnings</div>`}
                      </div>
                    </div>
                    <button onClick=${() => setSelectedKidSummary(null)} style=${{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
                  </div>

                  
                  ${showAllowanceSummary && (
                    html`<div style=${{ padding: '24px', textAlign: 'center', borderBottom: '2px solid #e5e7eb', flexShrink: 0 }}>
                      <div style=${{ fontSize: '42px', fontWeight: '800', color: '#10b981', lineHeight: '1' }}>$${allowanceValue}</div>
                      <div style=${{ fontSize: '14px', color: '#6b7280', marginTop: '4px', fontWeight: '600' }}>This Week: ${totalPoints} ⭐</div>
                      
                      <div style=${{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #d1d5db', display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '8px' }}>
                        <span style=${{ fontSize: '12px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase' }}>Last Week's Payout:</span>
                        <span style=${{ fontSize: '18px', fontWeight: '800', color: '#10b981' }}>$${lastWeekValue}</span>
                      </div>
                    </div>`
                  )}

                  
                  <div style=${{ padding: '16px 24px', background: '#f9fafb', maxHeight: '220px', overflowY: 'auto', flexShrink: 0 }}>
                    <div style=${{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Sun – Sat Breakdown</div>
                    ${daysBreakdown.map((day, idx) => {
                      const dateObj = new Date(day.date);
                      const dayName = dayNames[dateObj.getDay()];
                      return (
                        html`<div key=${idx} style=${{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: idx < daysBreakdown.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                          <span style=${{ fontSize: '14px', color: day.isToday ? kid.color : '#374151', fontWeight: day.isToday ? '700' : '500' }}>
                            ${dayName} ${day.isToday && '(Today)'}
                          </span>
                          <span style=${{ fontSize: '14px', fontWeight: '600', color: '#f59e0b' }}>${day.points} ⭐</span>
                        </div>`
                      );
                    })}
                  </div>

                  
                  ${allowProfileEditing && (
                    html`<div style=${{ padding: '20px 24px', borderTop: '2px solid #e5e7eb', flexShrink: 0 }}>
                      <div style=${{ fontSize: '12px', fontWeight: '700', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>✏️ Customize Profile</div>

                      
                      <div style=${{ marginBottom: '14px' }}>
                        <label style=${{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Profile Photo</label>
                        <input type="file" id="kidAvatarUpload" accept="image/*" style=${{ display: 'none' }}
                          onChange=${async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            e.target.value = '';
                            setKidProfileUploading(true);
                            try {
                              if (kid.avatar) deleteImageFromCloudflare(kid.avatar);
                              const url = await uploadImageToCloudflare(file);
                              updateFamilyMember(kid.id, { avatar: url });
                              setSelectedKidSummary({ ...kid, avatar: url });
                            } catch(err) { alert('Upload failed. Please try again.'); }
                            finally { setKidProfileUploading(false); }
                          }}
                        />
                        <button
                          onClick=${() => document.getElementById('kidAvatarUpload').click()}
                          disabled=${kidProfileUploading}
                          style=${{ width: '100%', padding: '10px', background: kidProfileUploading ? '#9ca3af' : kid.color, color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: kidProfileUploading ? 'wait' : 'pointer' }}>
                          ${kidProfileUploading ? '⏳ Uploading...' : kid.avatar ? '📷 Change Photo' : '📷 Add Photo'}
                        </button>
                      </div>

                      
                      <div>
                        <label style=${{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '6px', fontWeight: '600' }}>🎵 My Signature Sound</label>
                        <${TouchDropdown} 
                          options=${SOUNDS} 
                          initialValue=${kid.signatureSound || 'mario-coin'} 
                          color=${kid.color}
                          onChange=${(newSound) => {
                            updateFamilyMember(kid.id, { signatureSound: newSound });
                            setSelectedKidSummary({ ...kid, signatureSound: newSound });
                            playSignatureSound(newSound);
                          }} 
                        />
                      </div>
                    </div>`
                  )}

                </div>
              </div>`
            );
          })()}

        </div>
        <//>`
      );
    }
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(html`<${FamilyCalendar} />`);
  
  </script>
</body>
</html>


```

### `// package.json`

```json
{
  "name": "calendar",
  "private": true,
  "version": "1.40.2",
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
    "vite": "^8.0.10"
  }
}

```

### `// scripts/flattenRepo.cjs`

```javascript
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

### `// src/App.jsx`

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import KioskOverlay from './components/KioskOverlay';

function App() {
  return (
    <BrowserRouter>
      {/* The shield is now officially injected into the app */}
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
import { useState } from 'react';
import { X, Settings, Users, ClipboardList, Palette, Database, LayoutGrid, CalendarDays, Monitor } from 'lucide-react';
import ThemeTab from './ThemeTab';
import FamilyMembersTab from './FamilyMembersTab';
import ChoresTab from './ChoresTab';
import WidgetsTab from './WidgetsTab';
import SystemToolsTab from './SystemToolsTab';
import ScheduleManager from './ScheduleManager';
import DeviceManagerTab from './DeviceManagerTab'; // NEW IMPORT

const ADMIN_PIN = "8486";

export default function AdminModal({ isOpen, onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState('members');

  if (!isOpen) return null;

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
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
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">🔒 Admin Access</h3>
          <p className="text-slate-500 mb-6">Enter PIN to access settings</p>
          <form onSubmit={handlePinSubmit}>
            <input 
              type="password" 
              autoComplete="new-password" 
              value={pin} 
              onChange={(e) => setPin(e.target.value)} 
              maxLength={4} 
              autoFocus 
              className="w-full text-center text-3xl tracking-[1em] font-bold p-4 border-2 border-slate-200 rounded-xl mb-4 focus:border-indigo-500 focus:outline-none transition-colors" 
              placeholder="••••" 
            />
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">Cancel</button>
              <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">Unlock</button>
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
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
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
    <button onClick={onClick} className={`flex items-center gap-3 p-3 rounded-xl font-semibold transition-all w-full text-left ${active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200/50'}`}>
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
// src/components/admin/FamilyMembersTab.jsx
import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Edit2, Trash2, Plus, X, Loader2, Image as ImageIcon, Music, PlayCircle } from 'lucide-react';
import { compressImage } from '../../utils/imageCompression'; 
import { uploadToCloudflare } from '../../utils/cloudflareUploader';

export default function FamilyMembersTab() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);

  // Library States
  const [avatarLibrary, setAvatarLibrary] = useState([]);
  const [soundLibrary, setSoundLibrary] = useState([]);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingSound, setUploadingSound] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'familyMembers'), (snapshot) => {
      const membersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(membersData.sort((a, b) => {
        if (a.participatesInChores === b.participatesInChores) return a.name.localeCompare(b.name);
        return a.participatesInChores ? 1 : -1;
      }));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'avatars'), (docSnap) => {
      if (docSnap.exists()) {
        setAvatarLibrary(docSnap.data().urls || []);
      } else {
        setAvatarLibrary([]);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'sounds'), (docSnap) => {
      if (docSnap.exists()) {
        setSoundLibrary(docSnap.data().items || []);
      } else {
        setSoundLibrary([]);
      }
    });
    return () => unsub();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const memberData = {
        name: e.target.name.value,
        color: e.target.color.value,
        participatesInChores: e.target.role.value === 'kid',
        payRate: Number(e.target.payRate.value) || 0,
        pin: e.target.pin.value || ''
      };

      if (currentMember?.id) {
        await updateDoc(doc(db, 'familyMembers', currentMember.id), memberData);
      } else {
        await addDoc(collection(db, 'familyMembers'), { ...memberData, points: 0, avatar: '', signatureSound: '' });
      }
      setIsEditing(false);
      setCurrentMember(null);
    } catch (error) {
      console.error("Error saving member:", error);
      alert("Failed to save family member.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this member? All their data will be lost.")) {
      await deleteDoc(doc(db, 'familyMembers', id));
    }
  };

  // Avatar Library Handlers
  const handleUploadToLibrary = async (e) => {
    const file = e.target?.files?.[0];
    const inputElement = e.target;
    
    if (!file) return;
    
    setUploadingAvatar(true);
    try {
      const optimizedBlob = await compressImage(file, 400, 400, 0.8);
      
      const safeName = `library_${Date.now()}_${file.name.replace(/\.[^/.]+$/, ".jpg")}`;
      const url = await uploadToCloudflare(optimizedBlob, safeName);
      
      await setDoc(doc(db, 'settings', 'avatars'), { urls: arrayUnion(url) }, { merge: true });
    } catch (error) {
      console.error("Error uploading to library:", error);
      alert("Failed to upload default avatar to Cloudflare.");
    } finally {
      if (inputElement) inputElement.value = '';
      setUploadingAvatar(false);
    }
  };

  const handleDeleteFromLibrary = async (url) => {
    if (!window.confirm("Remove this avatar from the default choices?")) return;
    try {
      await setDoc(doc(db, 'settings', 'avatars'), { urls: arrayRemove(url) }, { merge: true });
    } catch (error) {
      console.error("Error removing avatar:", error);
    }
  };

  // Sound Library Handlers
  const handleUploadSound = async (e) => {
    const file = e.target?.files?.[0];
    const inputElement = e.target;
    if (!file) return;

    const soundName = window.prompt("Give this signature sound a short name (e.g., 'Magic Wand'):");
    if (!soundName) {
      if (inputElement) inputElement.value = '';
      return;
    }

    setUploadingSound(true);
    try {
      // Audio goes up raw, no compression needed
      const safeName = `sound_${Date.now()}_${file.name}`;
      const url = await uploadToCloudflare(file, safeName);
      
      await setDoc(doc(db, 'settings', 'sounds'), { items: arrayUnion({ name: soundName, url }) }, { merge: true });
    } catch (error) {
      console.error("Error uploading sound:", error);
      alert("Failed to upload signature sound to Cloudflare.");
    } finally {
      if (inputElement) inputElement.value = '';
      setUploadingSound(false);
    }
  };

  const handleDeleteSound = async (soundObj) => {
    if (!window.confirm(`Remove "${soundObj.name}" from the sound choices?`)) return;
    try {
      await setDoc(doc(db, 'settings', 'sounds'), { items: arrayRemove(soundObj) }, { merge: true });
    } catch (error) {
      console.error("Error removing sound:", error);
    }
  };

  const playPreview = (url) => {
    const audio = new Audio(url);
    audio.play().catch(e => console.error("Error playing sound:", e));
  };

  if (loading) return <div className="p-4 animate-pulse">Loading members...</div>;

  if (isEditing) {
    return (
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-slate-800 text-lg">
            {currentMember ? 'Edit Member' : 'New Member'}
          </h3>
          <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
            <input 
              name="name" 
              defaultValue={currentMember?.name} 
              required 
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
              <select 
                name="role" 
                defaultValue={currentMember?.participatesInChores ? 'kid' : 'parent'} 
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="kid">Kid</option>
                <option value="parent">Parent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Profile Color</label>
              <input 
                type="color" 
                name="color" 
                defaultValue={currentMember?.color || '#6366f1'} 
                className="w-full h-[50px] p-1 border border-slate-200 rounded-xl cursor-pointer" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pay Rate ($/pt)</label>
              <input 
                type="number" 
                step="0.01" 
                name="payRate" 
                defaultValue={currentMember?.payRate || 0} 
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:border-indigo-500" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Security PIN (Optional)</label>
              <input 
                type="text" 
                maxLength="4" 
                name="pin" 
                defaultValue={currentMember?.pin || ''} 
                placeholder="e.g. 1234" 
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:border-indigo-500" 
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)} 
              className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Save Member
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      
      {/* Existing Member List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">Family Roster</h3>
          <button 
            onClick={() => { setCurrentMember(null); setIsEditing(true); }}
            className="flex items-center gap-1 text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Member
          </button>
        </div>
        <div className="grid gap-3">
          {members.map(member => (
            <div key={member.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-indigo-300 transition-colors">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full shrink-0 shadow-sm border border-slate-100 object-cover overflow-hidden bg-slate-100 flex items-center justify-center font-bold text-white"
                  style={{ backgroundColor: member.color || '#ccc' }}
                >
                  {member.avatar ? (
                    <img src={member.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    member.name.charAt(0)
                  )}
                </div>
                <div>
                  <div className="font-bold text-slate-800">{member.name}</div>
                  <div className="text-xs font-medium text-slate-500 flex gap-2">
                    <span className="uppercase tracking-wider">{member.participatesInChores ? 'Kid' : 'Parent'}</span>
                    <span>&bull;</span>
                    <span>Rate: ${member.payRate?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setCurrentMember(member); setIsEditing(true); }}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(member.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Avatar Library Management */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <ImageIcon className="w-5 h-5 text-indigo-500" />
          <h3 className="font-bold text-slate-800">Default Avatar Library</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">Images uploaded here will be available for kids to choose from in their profile modal.</p>
        
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {avatarLibrary.map((url, idx) => (
            <div key={idx} className="relative aspect-square rounded-xl border-2 border-slate-200 overflow-hidden group bg-white shadow-sm">
              <img src={url} alt="Library Avatar" className="w-full h-full object-cover" />
              <button 
                onClick={() => handleDeleteFromLibrary(url)}
                className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                title="Remove from library"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <label className="aspect-square rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50 flex flex-col items-center justify-center text-indigo-600 cursor-pointer hover:bg-indigo-100 hover:border-indigo-400 transition-colors shadow-sm">
            {uploadingAvatar ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1">{uploadingAvatar ? '...' : 'Add'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleUploadToLibrary} disabled={uploadingAvatar} />
          </label>
        </div>
      </div>

      {/* Signature Sound Library Management */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Music className="w-5 h-5 text-indigo-500" />
          <h3 className="font-bold text-slate-800">Signature Sound Library</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">Audio files (MP3/WAV) uploaded here can be selected by kids as their chore completion sound.</p>
        
        <div className="space-y-2 mb-4">
          {soundLibrary.map((sound, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <button onClick={() => playPreview(sound.url)} className="text-indigo-500 hover:text-indigo-700 transition-colors">
                  <PlayCircle className="w-6 h-6" />
                </button>
                <span className="font-bold text-slate-700">{sound.name}</span>
              </div>
              <button 
                onClick={() => handleDeleteSound(sound)}
                className="text-slate-400 hover:text-rose-500 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <label className="flex items-center justify-center gap-2 w-full p-3 rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50 text-indigo-600 font-bold cursor-pointer hover:bg-indigo-100 hover:border-indigo-400 transition-colors shadow-sm">
          {uploadingSound ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          {uploadingSound ? 'Uploading...' : 'Upload New Sound'}
          <input type="file" accept="audio/*" className="hidden" onChange={handleUploadSound} disabled={uploadingSound} />
        </label>
      </div>

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
import { useState } from 'react';
import { Database, AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react';
import { injectHistoricalData, removeTestData } from '../../utils/testDataHelpers';

export default function SystemToolsTab() {
  const [loading, setLoading] = useState(false);

  const handleInject = async () => {
    if (!window.confirm("This will inject random chore completions for the past 60 days. Proceed?")) return;
    setLoading(true);
    await injectHistoricalData();
    setLoading(false);
  };

  const handleRemove = async () => {
    if (!window.confirm("This will permanently delete all injected test data. Proceed?")) return;
    setLoading(true);
    await removeTestData();
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
        <Database className="text-indigo-600" /> System & Data Tools
      </h3>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Inject Data Section */}
        <div className="border-b border-slate-100 pb-6">
          <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Inject Historical Test Data
          </h4>
          <p className="text-sm text-slate-500 mb-4">
            Populate the database with random chore completions for the past 60 days. This allows you to test the historical bar and line charts in the kids' profiles without manually entering months of data.
          </p>
          <button 
            onClick={handleInject}
            disabled={loading}
            className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-bold hover:bg-emerald-200 transition-colors disabled:opacity-50 shadow-sm"
          >
            {loading ? 'Processing...' : 'Inject Past 60 Days Data'}
          </button>
        </div>

        {/* Remove Data Section */}
        <div>
          <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" /> Remove Test Data
          </h4>
          <p className="text-sm text-slate-500 mb-4">
            Surgically remove only the test data injected by the tool above. Your real, manually entered chore completions will not be affected.
          </p>
          <button 
            onClick={handleRemove}
            disabled={loading}
            className="flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-xl font-bold hover:bg-rose-200 transition-colors disabled:opacity-50 shadow-sm"
          >
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
// src/components/admin/ThemeTab.jsx
import { useState, useEffect } from 'react';
import { PartyPopper, Save, Play, Plus, Trash2, Image as ImageIcon, UploadCloud, Type, Palette, Wand2, X, Loader2, CheckCircle2 } from 'lucide-react';
import { useCelebration } from '../../hooks/useCelebration';
import { useTheme, THEME_PRESETS, FONT_OPTIONS } from '../../hooks/useTheme';
import { compressImage } from '../../utils/imageCompression';
import { uploadToCloudflare } from '../../utils/cloudflareUploader';

const EFFECTS = [
  { id: 'realistic-burst', label: '💥 Realistic Burst (Explode & Fall)' },
  { id: 'cannons', label: '🎉 Side Cannons' },
  { id: 'fireworks', label: '⭐ Giant Stars' },
  { id: 'rain', label: '🎊 Confetti Rain' },
  { id: 'snow', label: '❄️ Drifting Snow' },
  { id: 'center-burst', label: '🎆 Center Spinner' }
];

const CELEB_PALETTES = [
  { id: 'rainbow', label: 'Rainbow', colors: ['#ef4444', '#f59e0b', '#eab308', '#10b981', '#3b82f6', '#8b5cf6', '#d946ef'] },
  { id: 'gold', label: 'Gold & Silver', colors: ['#FFD700', '#FFA500', '#DAA520', '#F8F8FF', '#C0C0C0'] },
  { id: 'neon', label: 'Neon Cyber', colors: ['#FF1493', '#00FFFF', '#39FF14', '#FF00FF'] },
  { id: 'pastel', label: 'Spring Pastels', colors: ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff'] },
  { id: 'blizzard', label: 'Winter Blizzard', colors: ['#ffffff', '#e0f2fe', '#bae6fd', '#7dd3fc'] },
  { id: 'schell', label: 'Schell Family Colors', colors: ['#3B82F6', '#EC4899', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'] }
];

export default function ThemeTab() {
  const { settings: celebSettings, loading: celebLoading, saveSettings: saveCeleb, triggerCelebration } = useCelebration();
  const { theme, loading: themeLoading, saveTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('theme');

  const [celebForm, setCelebForm] = useState(celebSettings);
  const [themeForm, setThemeForm] = useState(theme);
  const [wallpaperFile, setWallpaperFile] = useState(null);
  
  // Save States
  const [isSavingCeleb, setIsSavingCeleb] = useState(false);
  const [celebSaved, setCelebSaved] = useState(false);
  
  const [isSavingTheme, setIsSavingTheme] = useState(false);
  const [themeSaved, setThemeSaved] = useState(false);

  const [localOverride, setLocalOverride] = useState(() => localStorage.getItem('bgPositionOverride'));

  useEffect(() => { setCelebForm(celebSettings); }, [celebSettings]);
  useEffect(() => { setThemeForm(theme); }, [theme]);

  if (celebLoading || themeLoading) return <div className="animate-pulse">Loading settings...</div>;

  const activePreset = THEME_PRESETS.find(p => p.id === themeForm.preset) || THEME_PRESETS[0];
  const isCustom = themeForm.preset === 'custom';
  
  let bgStyle = '';
  if (isCustom) {
    if (themeForm.bgImageUrl || wallpaperFile) {
      const imgUrl = wallpaperFile ? URL.createObjectURL(wallpaperFile) : themeForm.bgImageUrl;
      bgStyle = `background-image: url(${imgUrl}); background-color: ${themeForm.bgColor || '#667eea'};`;
    } else {
      bgStyle = `background: ${themeForm.bgColor || '#667eea'};`;
    }
  } else {
    bgStyle = `background: ${activePreset.bg};`;
  }
  
  const activeFontColor = isCustom ? (themeForm.fontColor || '#1f2937') : activePreset.font;
  const activeFont = FONT_OPTIONS.find(f => f.id === themeForm.fontFamily) || FONT_OPTIONS[0];
  const panelRgba = `rgba(255, 255, 255, ${(themeForm.panelOpacity ?? 90) / 100})`;
  const panelBlur = `${themeForm.panelBlur ?? 8}px`;

  const localOverrideActive = localOverride !== null && localOverride !== '';
  const effectiveDesktopPos = localOverrideActive ? localOverride : (themeForm.bgPositionDesktop ?? 50);
  const effectiveMobilePos = localOverrideActive ? localOverride : (themeForm.bgPositionMobile ?? 50);

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

  const handleSaveTheme = async () => {
    setIsSavingTheme(true);
    try {
      let finalUrl = themeForm.bgImageUrl;
      
      if (wallpaperFile) {
        const optimizedBlob = await compressImage(wallpaperFile, 1920, 1080, 0.85);
        finalUrl = await uploadToCloudflare(optimizedBlob, `app_background_${Date.now()}.jpg`);
      }

      await saveTheme({ ...themeForm, bgImageUrl: finalUrl });
      
      setWallpaperFile(null);
      const bgInput = document.getElementById('theme-bg-upload');
      if (bgInput) bgInput.value = '';

      setThemeSaved(true);
      setTimeout(() => setThemeSaved(false), 2000);
    } catch (e) {
      console.error("Failed to upload background:", e);
      alert("Failed to upload wallpaper");
    }
    setIsSavingTheme(false);
  };

  const handlePreviewStart = () => {
    const modal = document.getElementById('admin-modal-container');
    if (modal) modal.style.opacity = '0';
  };
  
  const handlePreviewEnd = () => {
    const modal = document.getElementById('admin-modal-container');
    if (modal) modal.style.opacity = '1';
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

  return (
    <div className="space-y-6 max-w-2xl pb-12">
      <style>{`
        body {
          ${bgStyle}
          background-size: cover;
          background-attachment: fixed;
          font-family: ${activeFont.css};
        }
        @media (min-width: 768px) { body { background-position: center ${effectiveDesktopPos}%; } }
        @media (max-width: 767px) { body { background-position: ${effectiveMobilePos}% center; } }
        :root {
          --glass-panel-bg: ${panelRgba} !important;
          --glass-panel-blur: blur(${panelBlur}) !important;
          --theme-font-color: ${activeFontColor} !important;
        }
      `}</style>
      
      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit mb-6 border border-slate-200 shadow-inner">
        <button 
          onClick={() => setActiveTab('theme')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'theme' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
        >
          <Palette className="w-4 h-4" /> App Theme
        </button>
        <button 
          onClick={() => setActiveTab('celebration')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'celebration' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
        >
          <Wand2 className="w-4 h-4" /> Celebration FX
        </button>
      </div>

      {/* Tab Content: APP THEME BUILDER */}
      {activeTab === 'theme' && (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold mb-1 text-slate-800 flex items-center gap-2">
                Visual Customization
              </h3>
              <p className="text-slate-500 text-sm">Select presets or fully customize your family layout.</p>
            </div>
            
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
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Preset Themes</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {THEME_PRESETS.map(p => (
                  <button 
                    key={p.id} 
                    onClick={() => setThemeForm({ ...themeForm, preset: p.id })}
                    className={`p-2 rounded-xl text-sm font-bold border-2 transition-all ${themeForm.preset === p.id ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-transparent hover:border-slate-200'}`}
                    style={{ background: p.bg || '#e2e8f0', color: p.font }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {isCustom && (
              <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Custom Background Image</label>
                  <input 
                    id="theme-bg-upload"
                    type="file" accept="image/*" 
                    onChange={e => setWallpaperFile(e.target.files[0])} 
                    className="w-full p-2 border-2 border-white rounded-xl bg-white mb-2 focus:outline-none file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                  {(themeForm.bgImageUrl || wallpaperFile) && (
                     <button onClick={() => { 
                       setThemeForm({...themeForm, bgImageUrl: ''}); 
                       setWallpaperFile(null);
                       const el = document.getElementById('theme-bg-upload');
                       if(el) el.value = '';
                     }} className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1">
                       <X className="w-3 h-3" /> Remove Background
                     </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fallback Background Color</label>
                    <input type="color" value={themeForm.bgColor || '#667eea'} onChange={e => setThemeForm({ ...themeForm, bgColor: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer border-0 p-0" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Calendar Font Color</label>
                    <input type="color" value={themeForm.fontColor || '#1f2937'} onChange={e => setThemeForm({ ...themeForm, fontColor: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer border-0 p-0" />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="flex text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 items-center gap-1"><Type className="w-4 h-4"/> Global Font Style</label>
              <div className="grid grid-cols-2 gap-2">
                {FONT_OPTIONS.map(f => (
                  <button 
                    key={f.id} 
                    onClick={() => setThemeForm({ ...themeForm, fontFamily: f.id })}
                    className={`p-2 rounded-xl text-sm transition-all border-2 ${themeForm.fontFamily === f.id ? 'border-indigo-500 bg-indigo-50 text-indigo-800 font-bold' : 'border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                    style={{ fontFamily: f.css }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <div className="flex justify-between"><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Panel Opacity</label><span className="text-xs font-bold text-indigo-500">{themeForm.panelOpacity}%</span></div>
                <input type="range" min="10" max="100" step="5" value={themeForm.panelOpacity} onChange={(e) => setThemeForm({...themeForm, panelOpacity: parseInt(e.target.value)})} className="w-full accent-indigo-500"/>
                <p className="text-xs text-slate-400 mt-1">Lower = More transparent</p>
              </div>
              <div>
                <div className="flex justify-between"><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Glass Blur</label><span className="text-xs font-bold text-indigo-500">{themeForm.panelBlur}px</span></div>
                <input type="range" min="0" max="24" step="2" value={themeForm.panelBlur} onChange={(e) => setThemeForm({...themeForm, panelBlur: parseInt(e.target.value)})} className="w-full accent-indigo-500"/>
                <p className="text-xs text-slate-400 mt-1">Frosted effect to read text easily</p>
              </div>

              {(themeForm.bgImageUrl || wallpaperFile) && isCustom && (
                <>
                  <div>
                    <div className="flex justify-between"><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Global Desktop Position</label><span className="text-xs font-bold text-indigo-500">{themeForm.bgPositionDesktop ?? 50}%</span></div>
                    <input type="range" min="0" max="100" value={themeForm.bgPositionDesktop ?? 50} onChange={(e) => setThemeForm({...themeForm, bgPositionDesktop: parseInt(e.target.value)})} className="w-full accent-indigo-500"/>
                  </div>
                  <div>
                    <div className="flex justify-between"><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Global Mobile Position</label><span className="text-xs font-bold text-indigo-500">{themeForm.bgPositionMobile ?? 50}%</span></div>
                    <input type="range" min="0" max="100" value={themeForm.bgPositionMobile ?? 50} onChange={(e) => setThemeForm({...themeForm, bgPositionMobile: parseInt(e.target.value)})} className="w-full accent-indigo-500"/>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 pt-4 mt-2 border-t border-slate-100 bg-slate-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-emerald-600">🖥️ Local Device Override</label>
                      {localOverrideActive && (
                        <button onClick={() => applyLocalOverride('')} className="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-200 px-2 py-1 rounded-md shadow-sm hover:bg-rose-100 transition-colors">✕ Clear Override</button>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mb-4">Use this slider to adjust the vertical position <b>for this specific monitor only</b>. It writes directly to your browser's local storage and overrides the global position settings above.</p>
                    
                    <div className="flex justify-between mb-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">This Screen's Override Position</label>
                      <span className="text-xs font-bold text-emerald-600">{localOverrideActive ? localOverride + '%' : `Inactive`}</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" 
                      value={localOverrideActive ? localOverride : (themeForm.bgPositionDesktop ?? 50)} 
                      onChange={(e) => applyLocalOverride(e.target.value)} 
                      className={`w-full ${localOverrideActive ? 'accent-emerald-500' : 'accent-slate-300 opacity-60'}`}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button 
                onClick={handleSaveTheme} 
                disabled={isSavingTheme || themeSaved}
                className={`w-full py-3 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm ${
                  themeSaved ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isSavingTheme ? <Loader2 className="w-5 h-5 animate-spin" /> : (themeSaved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />)} 
                {isSavingTheme ? 'Uploading & Saving...' : (themeSaved ? 'Theme Saved!' : 'Save App Theme')}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Tab Content: CELEBRATION MIXER */}
      {activeTab === 'celebration' && (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div>
            <h3 className="text-xl font-bold mb-1 text-slate-800 flex items-center gap-2">
               Reward Popups
            </h3>
            <p className="text-slate-500 text-sm">Stack up to 4 effects for task completion celebrations.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Duration</label>
                <select value={celebForm.duration} onChange={e => setCelebForm({ ...celebForm, duration: Number(e.target.value) })} className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 font-bold text-slate-700 bg-slate-50 focus:bg-white transition-colors">
                  <option value={3}>3 Seconds</option>
                  <option value={5}>5 Seconds</option>
                  <option value={8}>8 Seconds (Long)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Audio Track</label>
                <select value={celebForm.soundUrl} onChange={e => setCelebForm({ ...celebForm, soundUrl: e.target.value })} className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-500 font-bold text-slate-700 bg-slate-50 focus:bg-white transition-colors">
                  <option value="">No Sound (Silent)</option>
                  <option value="https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Mario%20Bros%20Flagpole.mp3">Mario Level Complete</option>
                  <option value="https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Roblox%20celebration.mp3">Roblox Celebration</option>
                  <option value="https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/yoshi.mp3">Yoshi!</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Effect Layers ({celebForm.layers?.length || 0}/4)</label>
              {(celebForm.layers || []).map((layer, index) => (
                <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative shadow-sm">
                  <button onClick={() => removeLayer(index)} className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 transition-colors bg-white p-1 rounded-md shadow-sm border border-slate-100"><Trash2 className="w-4 h-4" /></button>
                  <div className="pr-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Effect Type</label>
                        <select value={layer.type} onChange={(e) => updateLayer(index, 'type', e.target.value)} className="w-full p-2 rounded-lg border border-slate-300 font-bold text-sm text-slate-700 focus:border-indigo-500 focus:outline-none">
                          {EFFECTS.map(eff => <option key={eff.id} value={eff.id}>{eff.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Color Palette</label>
                        <select value={JSON.stringify(layer.colors)} onChange={(e) => updateLayer(index, 'colors', JSON.parse(e.target.value))} className="w-full p-2 rounded-lg border border-slate-300 font-bold text-sm text-slate-700 focus:border-indigo-500 focus:outline-none">
                          {CELEB_PALETTES.map(pal => <option key={pal.id} value={JSON.stringify(pal.colors)}>{pal.label}</option>)}
                        </select>
                        <div className="flex h-2 mt-1 rounded overflow-hidden">
                          {layer.colors.map((c, i) => <div key={i} style={{ backgroundColor: c, flex: 1 }} />)}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between"><label className="block text-xs font-bold text-slate-500 mb-1">Particle Size</label><span className="text-xs font-bold text-indigo-500">{layer.scale}x</span></div>
                        <input type="range" min="0.5" max="3" step="0.1" value={layer.scale} onChange={(e) => updateLayer(index, 'scale', parseFloat(e.target.value))} className="w-full accent-indigo-500"/>
                      </div>
                      <div>
                        <div className="flex justify-between"><label className="block text-xs font-bold text-slate-500 mb-1">Particle Amount</label><span className="text-xs font-bold text-indigo-500">{layer.intensity * 100}%</span></div>
                        <input type="range" min="0.2" max="2.5" step="0.1" value={layer.intensity} onChange={(e) => updateLayer(index, 'intensity', parseFloat(e.target.value))} className="w-full accent-indigo-500"/>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {(celebForm.layers || []).length < 4 && (
                <button onClick={addLayer} className="w-full py-4 border-2 border-dashed border-indigo-200 text-indigo-500 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-50 hover:border-indigo-400 transition-colors">
                  <Plus className="w-5 h-5" /> Add Effect Layer
                </button>
              )}
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button onClick={() => triggerCelebration(celebForm)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
                <Play className="w-5 h-5 fill-current" /> Preview Blast
              </button>
              <button 
                onClick={handleSaveCeleb} 
                disabled={isSavingCeleb || celebSaved} 
                className={`flex-1 py-3 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm ${
                  celebSaved ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                {isSavingCeleb ? <Loader2 className="w-5 h-5 animate-spin" /> : (celebSaved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />)} 
                {isSavingCeleb ? 'Saving...' : (celebSaved ? 'Effects Saved!' : 'Save Effects')}
              </button>
            </div>
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
      console.error("Error saving leaderboard settings:", error);
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
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 capitalize focus:outline-none focus:border-indigo-500"
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
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${
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
    displayMode: 'daily',
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
      console.error("Error saving weather settings:", error);
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
            <button type="submit" disabled={isSearching} className="bg-indigo-600 text-white px-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2">
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

        {/* Display Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Default View</label>
            <select 
              value={config.displayMode}
              onChange={(e) => setConfig({...config, displayMode: e.target.value})}
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="daily">7-Day Forecast</option>
              <option value="hourly">Hourly Forecast</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Temperature Units</label>
            <select 
              value={config.units}
              onChange={(e) => setConfig({...config, units: e.target.value})}
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="celsius">Celsius (°C)</option>
              <option value="fahrenheit">Fahrenheit (°F)</option>
            </select>
          </div>
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
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${
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
      className={`flex-1 flex min-w-max items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold text-sm transition-all ${
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
      const endDate = formData.endDate ? new Date(formData.endDate + 'T00:00:00') : startDate;
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
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Circle } from 'lucide-react';
import { useChores } from '../../hooks/useChores';
import { useFamilyMembers } from '../../hooks/useFamilyMembers';
import { useDailyCompletions } from '../../hooks/useDailyCompletions';
import { useCelebration } from '../../hooks/useCelebration';
import { useCustody } from '../../hooks/useCustody';

export default function ChoresPanel() {
  const { chores, loading: choresLoading } = useChores();
  const { members, loading: membersLoading } = useFamilyMembers();
  const { completions, loading: compsLoading, toggleCompletion } = useDailyCompletions();
  
  const { triggerCelebration } = useCelebration();
  const { isHereToday } = useCustody();
  
  const [claimingChore, setClaimingChore] = useState(null);
  const [celebratingKid, setCelebratingKid] = useState(null);

  if (choresLoading || membersLoading || compsLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg flex-1 flex items-center justify-center min-h-0">
        <span className="text-slate-400 font-medium animate-pulse">Loading today's chores...</span>
      </div>
    );
  }

  // MATH FILTER: Completely strip out any kids who are scheduled as "Away" today
  const kids = members.filter(m => m.participatesInChores && isHereToday(m));
  
  const assignedChores = chores.filter(c => c.assignedTo && c.assignedTo !== 'unassigned');
  const bonusChores = chores.filter(c => !c.assignedTo || c.assignedTo === 'unassigned');

  const handleChoreClick = (chore) => {
    const isDone = completions[chore.id];

    if (!isDone && (chore.assignedTo === 'unassigned' || !chore.assignedTo)) {
      setClaimingChore(chore);
      return;
    }

    if (isDone && chore.assignedTo === 'unassigned') {
      alert("Bonus chores cannot currently be unchecked. Admin feature coming soon.");
      return;
    }

    toggleCompletion(chore, chore.assignedTo, isDone);

    if (!isDone && chore.assignedTo) {
      const kidChores = assignedChores.filter(c => c.assignedTo === chore.assignedTo);
      const allDone = kidChores.every(c => c.id === chore.id ? true : completions[c.id]);
      
      if (allDone && kidChores.length > 0) {
        triggerCelebration();
        
        const member = members.find(m => m.id === chore.assignedTo);
        if (member) {
          setCelebratingKid({
            ...member,
            points: Number(member.points || 0) + Number(chore.points || 0)
          });
          
          setTimeout(() => setCelebratingKid(null), 15000);
        }
      }
    }
  };

  const handleClaimBonus = (kidId) => {
    toggleCompletion(claimingChore, kidId, false);
    triggerCelebration({ 
      layers: [{ type: 'fireworks', colors: ['#FFD700', '#FFA500'], scale: 1, intensity: 0.5 }],
      duration: 2,
      soundUrl: '' 
    });
    setClaimingChore(null);
  };

  const renderChore = (chore) => {
    const isDone = completions[chore.id];
    
    return (
      <div 
        key={chore.id}
        onClick={() => handleChoreClick(chore)}
        className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
          isDone ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50 border-slate-100 hover:border-indigo-200 hover:bg-white'
        }`}
      >
        <div className="flex items-center gap-3">
          {isDone ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300 shrink-0" />
          )}
          <div>
            <div className={`font-semibold text-sm transition-colors ${isDone ? 'text-emerald-700 line-through opacity-70' : 'text-slate-700'}`}>
              {chore.name}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {chore.assignedTo === 'unassigned' ? '⭐ Bonus' : members.find(m => m.id === chore.assignedTo)?.name}
            </div>
          </div>
        </div>
        <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded-lg text-sm font-bold shrink-0">
          {Number(chore.points) || 0}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg relative h-full flex flex-col">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 shrink-0">
        <span>📋</span> Today's Chores
      </h2>
      
      <div className="flex flex-col gap-5 overflow-y-auto pr-2 pb-4">
        {kids.map(kid => {
          const kidChores = assignedChores.filter(c => c.assignedTo === kid.id);
          if (kidChores.length === 0) return null;
          
          return (
            <div key={kid.id}>
              <h3 
                className="text-xs font-bold uppercase tracking-wider mb-2 border-b-2 pb-1"
                style={{ color: kid.color, borderColor: `${kid.color}33` }}
              >
                {kid.name}'s Chores
              </h3>
              <div className="flex flex-col gap-2">
                {kidChores.map(renderChore)}
              </div>
            </div>
          );
        })}

        {bonusChores.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 border-b-2 pb-1 text-amber-500 border-amber-200">
              ⭐ Bonus Chores
            </h3>
            <div className="flex flex-col gap-2">
              {bonusChores.map(renderChore)}
            </div>
          </div>
        )}
      </div>

      {/* Mini "Who did this?" Modal for Bonus Chores */}
      {claimingChore && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl z-10 flex flex-col items-center justify-center p-4 text-center">
          <h3 className="text-xl font-bold text-slate-800 mb-1">Who did this?</h3>
          <p className="text-sm text-slate-500 mb-4 font-medium">{claimingChore.name}</p>
          <div className="grid grid-cols-2 gap-3 w-full max-w-62.5">
            {kids.map(kid => (
              <button
                key={kid.id}
                onClick={() => handleClaimBonus(kid.id)}
                className="py-3 px-2 rounded-xl font-bold text-white shadow-sm transition-transform hover:scale-105"
                style={{ backgroundColor: kid.color }}
              >
                {kid.name}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setClaimingChore(null)}
            className="mt-4 text-sm font-bold text-slate-400 hover:text-slate-600"
          >
            Cancel
          </button>
        </div>
      )}

      {/* THE NEW MISSION COMPLETE MODAL (Teleported via Portal) */}
      {celebratingKid && createPortal(
        <div
          onClick={() => setCelebratingKid(null)}
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center flex-col gap-6 p-8 cursor-pointer transition-opacity"
          style={{ zIndex: 100001 }}
        >
          <div className="text-center animate-bounce-in">
            {/* Glowing Avatar */}
            <div 
              className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-2xl transition-transform hover:scale-110"
              style={{ 
                backgroundColor: celebratingKid.color || '#cbd5e1', 
                boxShadow: `0 0 40px ${celebratingKid.color || '#cbd5e1'}` 
              }}
            >
              {celebratingKid.avatar ? (
                <img src={celebratingKid.avatar} className="w-full h-full object-cover" alt={celebratingKid.name} />
              ) : (
                <span className="text-5xl text-white font-bold">{celebratingKid.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            
            {/* Mission Complete Text */}
            <div className="text-2xl font-black text-amber-400 uppercase tracking-widest mb-2 drop-shadow-md">
              Mission Complete!
            </div>
            
            {/* Kid's Name with Glow */}
            <div 
              className="text-5xl font-black text-white mb-2 tracking-tight"
              style={{ textShadow: `0 0 30px ${celebratingKid.color || '#cbd5e1'}` }}
            >
              {celebratingKid.name}
            </div>
            
            <div className="text-xl text-emerald-200 mb-8 font-medium">
              All chores done for today! 🎉
            </div>
            
            {/* Points Pill (Accurately Synced) */}
            <div 
              className="inline-block text-white px-8 py-3 rounded-full text-2xl font-black shadow-xl border-2 border-white/20"
              style={{ 
                backgroundColor: celebratingKid.color || '#64748b', 
                boxShadow: `0 0 20px ${celebratingKid.color}88` 
              }}
            >
              {celebratingKid.points || 0} ⭐ Total
            </div>
            
            <div className="mt-8 text-sm text-slate-300 font-medium opacity-70 tracking-widest uppercase">
              tap anywhere to dismiss
            </div>
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
  const [selectedMember, setSelectedMember] = useState(null);

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

  if (membersLoading) return null; // Simplified for brevity

  const kids = members
    .filter(m => m.participatesInChores === true || String(m.participatesInChores).toLowerCase() === 'true')
    .map(kid => ({
      ...kid,
      displayPoints: timeframe === 'lifetime' ? (Number(kid.points) || 0) : (scores[kid.id] || 0)
    }))
    .sort((a, b) => b.displayPoints - a.displayPoints);

  const isDefaultView = timeframe === widgetConfig.defaultTimeframe;

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
              className={`flex-1 text-xs font-bold py-2 px-1 rounded-lg capitalize transition-all duration-300 ${
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
                onClick={() => setSelectedMember(kid)}
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

      <MemberProfileModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </div>
  );
}
```

### `// src/components/dashboard/MemberProfileModal.jsx`

```javascript
// src/components/dashboard/MemberProfileModal.jsx
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Image as ImageIcon, Wallet, Star, Loader2, UserCircle, History, BarChart3, LineChart, ChevronLeft, ChevronRight, RotateCcw, Volume2 } from 'lucide-react';
import { doc, updateDoc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { compressImage } from '../../utils/imageCompression';
import { uploadToCloudflare } from '../../utils/cloudflareUploader';

export default function MemberProfileModal({ member, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Instant visual update state for the avatar
  const [previewAvatar, setPreviewAvatar] = useState('');

  // Settings Data
  const [defaultAvatars, setDefaultAvatars] = useState([]);
  const [soundOptions, setSoundOptions] = useState([]);
  const [allowanceConfig, setAllowanceConfig] = useState({ payDay: 5 }); 

  // History State
  const [historyData, setHistoryData] = useState([]);
  const [timeframePoints, setTimeframePoints] = useState(0);

  // Chart Controls
  const [chartType, setChartType] = useState('bar');
  const [historyTimeframe, setHistoryTimeframe] = useState('weekly');
  const [referenceDate, setReferenceDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  useEffect(() => {
    if (member?.avatar) setPreviewAvatar(member.avatar);
  }, [member?.avatar]);

  useEffect(() => {
    if (!isEditing) return;
    const fetchLibraries = async () => {
      const avatarSnap = await getDoc(doc(db, 'settings', 'avatars'));
      if (avatarSnap.exists() && avatarSnap.data().urls) setDefaultAvatars(avatarSnap.data().urls);
      const soundSnap = await getDoc(doc(db, 'settings', 'sounds'));
      if (soundSnap.exists() && soundSnap.data().items) setSoundOptions(soundSnap.data().items);
    };
    fetchLibraries();
  }, [isEditing]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'allowance'), (docSnap) => {
      if (docSnap.exists()) setAllowanceConfig(docSnap.data());
    });
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

      snapshot.forEach(doc => {
        const data = doc.data();
        const date = data.timestamp?.toDate();
        if (!date) return;
        if (date >= startOfRange && date <= endOfRange) {
          const pts = Number(data.points) || 0;
          currentRangePts += pts;
          const dateString = date.toDateString();
          if (dailyMap[dateString]) {
            dailyMap[dateString].pts += pts;
          }
        }
      });

      const chartArray = Object.values(dailyMap).sort((a, b) => a.dateObj - b.dateObj);
      setTimeframePoints(currentRangePts);
      setHistoryData(chartArray);
    }, (error) => {
      console.error("Error fetching history:", error);
    });

    return () => unsub();
  }, [member, referenceDate, historyTimeframe, allowanceConfig.payDay]);

  if (!member) return null;

  const payRate = member.payRate || 0;
  const timeframeEarned = (timeframePoints * payRate).toFixed(2);
  const maxPoints = Math.max(...historyData.map(d => d.pts), 10);

  const linePoints = historyData.map((d, i) => {
    const x = (i / (historyData.length - 1 || 1)) * 100;
    const y = 95 - ((d.pts / maxPoints) * 90);
    return `${x},${y}`;
  }).join(' ');

  const handleUpdateSetting = async (field, value) => {
    try {
      await updateDoc(doc(db, 'familyMembers', member.id), { [field]: value });
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      alert("Failed to save changes.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target?.files?.[0];
    const inputElement = e.target;
    
    if (!file) return;

    setUploading(true);
    try {
      const optimizedBlob = await compressImage(file, 400, 400, 0.8);
      const safeName = `avatar_${member.id}_${Date.now()}.jpg`; 
      const downloadUrl = await uploadToCloudflare(optimizedBlob, safeName);
      
      setPreviewAvatar(downloadUrl); // Update visually instantly
      await handleUpdateSetting('avatar', downloadUrl); // Save to DB
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to compress and upload image to Cloudflare.");
    } finally {
      if (inputElement) inputElement.value = '';
      setUploading(false);
    }
  };

  const shiftTimeframe = (offset) => {
    setReferenceDate(prev => {
      const next = new Date(prev);
      if (historyTimeframe === 'weekly') {
        next.setDate(prev.getDate() + (offset * 7));
      } else {
        next.setMonth(prev.getMonth() + offset);
      }
      return next;
    });
  };

  let rangeLabel = '';
  const now = new Date();
  let isCurrentTimeframe = false;

  if (historyTimeframe === 'weekly') {
    const wStart = new Date(referenceDate);
    wStart.setDate(referenceDate.getDate() - referenceDate.getDay());
    const wEnd = new Date(wStart);
    wEnd.setDate(wStart.getDate() + 6);
    rangeLabel = `${wStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})} - ${wEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}`;
    
    isCurrentTimeframe = now >= wStart && now <= new Date(wEnd.setHours(23, 59, 59));
  } else {
    rangeLabel = referenceDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    isCurrentTimeframe = now.getMonth() === referenceDate.getMonth() && now.getFullYear() === referenceDate.getFullYear();
  }

  const shouldShowLabel = (index, total) => {
    if (historyTimeframe === 'weekly') return true;
    if (index === 0 || index === total - 1) return true;
    return index % 5 === 0;
  };

  const displayColor = member.color || '#6366f1';

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header Section */}
        <div className="p-6 text-center relative shrink-0" style={{ backgroundColor: displayColor }}>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors focus:outline-none" >
            <X className="w-5 h-5" />
          </button>
          
          <div className="relative inline-block mt-4 mb-3 group">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover flex items-center justify-center text-3xl font-black text-white" style={{ backgroundColor: displayColor }} >
              {previewAvatar || member.avatar ? (
                <img src={previewAvatar || member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                member.name.charAt(0).toUpperCase()
              )}
            </div>
            <button onClick={() => setIsEditing(!isEditing)} className="absolute bottom-0 right-0 bg-white text-indigo-600 p-2 rounded-full shadow-md hover:scale-110 transition-transform border border-slate-100" >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">{member.name}</h2>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white uppercase tracking-wider mt-2 inline-block">
            {member.participatesInChores === true || String(member.participatesInChores).toLowerCase() === 'true' ? 'Kid Profile' : 'Adult Profile'}
          </span>
        </div>

        {/* Content Section */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 bg-slate-50/50">
          {isEditing ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-2">
                  <Volume2 className="w-4 h-4" /> Signature Sound
                </label>
                <select value={member.signatureSound || ''} onChange={(e) => handleUpdateSetting('signatureSound', e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:border-indigo-500" >
                  <option value="">Default Pop</option>
                  {soundOptions.map((s, idx) => (
                    <option key={idx} value={s.url}>{s.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1 pl-1">This plays when you complete a chore!</p>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-3">
                  <ImageIcon className="w-4 h-4" /> Choose an Avatar
                </label>
                {defaultAvatars.length === 0 ? (
                  <div className="text-center p-4 bg-white rounded-xl border border-slate-200">
                    <UserCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-500">No default avatars available.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto custom-scrollbar p-1">
                    {defaultAvatars.map((url, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => {
                          setPreviewAvatar(url); // Instant Update!
                          handleUpdateSetting('avatar', url);
                        }} 
                        className="aspect-square rounded-2xl bg-white border-2 border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all overflow-hidden focus:outline-none" 
                      >
                        <img src={url} alt={`Avatar option ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-slate-50 px-2 text-slate-400 uppercase font-bold tracking-wider">Or</span>
                </div>
              </div>

              <label className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50 text-indigo-600 font-bold cursor-pointer hover:bg-indigo-100 hover:border-indigo-300 transition-colors">
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {uploading ? 'Uploading...' : 'Upload Custom Photo'}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
              </label>

              <button onClick={() => setIsEditing(false)} className="w-full py-3 bg-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-300 transition-colors focus:outline-none" >
                Done Editing
              </button>
            </div>
          ) : (
            <>
              {/* Top Controls: Timeframe Toggle & Date Navigation */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex bg-slate-100 p-1 rounded-lg shrink-0 border border-slate-200 shadow-inner">
                    <button onClick={() => { setHistoryTimeframe('weekly'); setReferenceDate(new Date()); }} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${historyTimeframe === 'weekly' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`} >
                      Week
                    </button>
                    <button onClick={() => { setHistoryTimeframe('monthly'); setReferenceDate(new Date()); }} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${historyTimeframe === 'monthly' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`} >
                      Month
                    </button>
                  </div>
                  <button onClick={() => setReferenceDate(new Date())} className={`flex items-center gap-1.5 py-1.5 px-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold text-xs rounded-lg border border-indigo-100 transition-all duration-300 ${isCurrentTimeframe ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`} >
                    <RotateCcw className="w-3.5 h-3.5" /> Current {historyTimeframe === 'weekly' ? 'Week' : 'Month'}
                  </button>
                </div>

                <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm">
                  <button onClick={() => shiftTimeframe(-1)} className="p-2.5 hover:bg-slate-50 rounded-lg transition-colors text-slate-500 hover:text-slate-800" >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 className="font-bold text-slate-700 text-sm sm:text-base text-center px-2">
                    {rangeLabel}
                  </h3>
                  <button onClick={() => shiftTimeframe(1)} className="p-2.5 hover:bg-slate-50 rounded-lg transition-colors text-slate-500 hover:text-slate-800" >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Dynamic Earnings Boxes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
                  <Star className="absolute -right-4 -bottom-4 w-20 h-20 text-amber-500 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                  <div className="text-xs font-black text-amber-600/80 uppercase tracking-widest mb-1 relative z-10">Stars</div>
                  <div className="text-3xl font-black text-amber-600 relative z-10">
                    {timeframePoints}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
                  <Wallet className="absolute -right-4 -bottom-4 w-20 h-20 text-emerald-500 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                  <div className="text-xs font-black text-emerald-600/80 uppercase tracking-widest mb-1 relative z-10">Earnings</div>
                  <div className="text-3xl font-black text-emerald-600 relative z-10">
                    ${timeframeEarned}
                  </div>
                </div>
              </div>

              {/* Advanced History Chart */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-sm uppercase tracking-wider">
                    <History className="w-4 h-4 text-slate-400" /> Hustle History
                  </div>
                  <div className="flex bg-slate-100 p-0.5 rounded-lg shrink-0 border border-slate-200">
                    <button onClick={() => setChartType('bar')} className={`p-1.5 rounded-md transition-colors ${chartType === 'bar' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} >
                      <BarChart3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setChartType('line')} className={`p-1.5 rounded-md transition-colors ${chartType === 'line' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} >
                      <LineChart className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="relative h-32 w-full mt-2">
                  {chartType === 'bar' ? (
                    <div className={`absolute inset-0 flex items-end justify-between px-1 ${historyTimeframe === 'weekly' ? 'gap-1' : 'gap-[1px]'}`}>
                      {historyData.map((dayData, i) => {
                        const heightPct = Math.max((dayData.pts / maxPoints) * 100, dayData.pts > 0 ? 4 : 0);
                        return (
                          <div key={i} className="flex flex-col items-center justify-end h-full flex-1 relative group">
                            <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[10px] py-1 px-2 rounded font-bold pointer-events-none transition-opacity z-20 shadow-md">
                              {dayData.pts}
                            </div>
                            <div 
                              className={`w-full rounded-t-sm transition-all duration-500 ease-out group-hover:opacity-80 relative ${dayData.isPayDay ? 'ring-1 ring-emerald-400 ring-offset-[1px]' : ''}`} 
                              style={{ 
                                height: `${heightPct}%`, 
                                backgroundColor: dayData.pts > 0 ? displayColor : '#e2e8f0',
                                opacity: dayData.pts > 0 ? 0.9 : 1
                              }}
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
                        <polyline 
                          points={linePoints} 
                          fill="none" 
                          stroke={displayColor} 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="drop-shadow-sm" 
                        />
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
                    <div key={i} className={`font-bold uppercase flex-1 text-center truncate text-[10px] ${dayData.isPayDay ? 'text-emerald-600' : 'text-slate-400'}`} style={{ color: (historyTimeframe === 'monthly' && !shouldShowLabel(i, historyData.length)) ? 'transparent' : undefined }}>
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
    return <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg h-32 animate-pulse"></div>;
  }

  if (!messageData || !messageData.isActive) return null;

  const themes = {
    info: { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-900', icon: <Info className="w-6 h-6 text-sky-500" /> },
    important: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-900', icon: <Pin className="w-6 h-6 text-rose-500 fill-rose-500" /> },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', icon: <AlertTriangle className="w-6 h-6 text-amber-500" /> },
    success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', icon: <Star className="w-6 h-6 text-emerald-500 fill-emerald-500" /> }
  };

  const activeTheme = themes[messageData.type] || themes.info;

  return (
    <div className={`${activeTheme.bg} border-2 ${activeTheme.border} rounded-2xl p-5 shadow-md relative overflow-hidden transition-colors min-h-32 flex flex-col`}>
      <div className="flex items-center gap-3 mb-2 shrink-0">
        {activeTheme.icon}
        <h3 className={`font-bold ${activeTheme.text} text-lg`}>{messageData.title}</h3>
      </div>
      
      {/* Renders WYSIWYG HTML directly while enforcing tailwind styling for lists/links */}
      <div 
        className={`${activeTheme.text} text-sm leading-relaxed flex-1 [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal [&>ol]:ml-5 [&>p]:mb-2`}
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
// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database'; // Old legacy DB
import { getFirestore } from 'firebase/firestore'; // New atomic DB
import { getStorage } from 'firebase/storage'; // Added for the new Avatar uploads

const firebaseConfig = {
  apiKey: "AIzaSyDg-I2BAuXt2sHDJa-ih-B6z5km8HlOl0U",
  authDomain: "family-calendar-ebf3b.firebaseapp.com",
  databaseURL: "https://family-calendar-ebf3b-default-rtdb.firebaseio.com",
  projectId: "family-calendar-ebf3b",
  storageBucket: "family-calendar-ebf3b.firebasestorage.app",
  messagingSenderId: "964895867498",
  appId: "1:964895867498:web:f69b0c636201303a3e4013"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export all database instances so our hooks can use them
export const rtdb = getDatabase(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
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

### `// src/hooks/useCelebration.js`

```js
import { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import confetti from 'canvas-confetti';

const DEFAULT_SETTINGS = {
  duration: 5,
  soundUrl: 'https://pub-c502b7afe8da4d518eea03a57bdd6e60.r2.dev/Soundfx/Mario%20Bros%20Flagpole.mp3',
  layers: [
    { type: 'cannons', colors: ['#667eea', '#764ba2', '#fbbf24', '#10b981', '#ef4444'], scale: 1, intensity: 1 },
    { type: 'fireworks', colors: ['#FFD700', '#FFA500', '#FF4500', '#ffffff'], scale: 2.5, intensity: 1.5 }
  ]
};

export function useCelebration() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'systemSettings', 'celebrations'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings({ ...DEFAULT_SETTINGS, ...docSnap.data() });
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const saveSettings = async (newSettings) => {
    await setDoc(doc(db, 'systemSettings', 'celebrations'), newSettings);
  };

  const triggerCelebration = (overrideSettings = null) => {
    const config = overrideSettings || settings;
    const durationMs = config.duration * 1000;
    const end = Date.now() + durationMs;

    if (config.soundUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      audioRef.current = new Audio(config.soundUrl);
      audioRef.current.volume = 1.0;
      audioRef.current.play().catch(e => console.log("Audio play blocked by browser:", e));
    }

    const activeLayers = config.layers || [];

    activeLayers.forEach(layer => {
      const pCount = Math.max(1, Math.round(5 * layer.intensity)); 
      
      if (layer.type === 'cannons') {
        const frame = () => {
          confetti({ particleCount: pCount, angle: 60, spread: 55, origin: { x: 0 }, colors: layer.colors, scalar: layer.scale, zIndex: 100002 });
          confetti({ particleCount: pCount, angle: 120, spread: 55, origin: { x: 1 }, colors: layer.colors, scalar: layer.scale, zIndex: 100002 });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
      } 
      
      else if (layer.type === 'fireworks') {
        const randomInRange = (min, max) => Math.random() * (max - min) + min;
        const interval = setInterval(() => {
          if (Date.now() > end) return clearInterval(interval);
          const fireworkCount = Math.round(6 * layer.intensity);
          confetti({
            particleCount: fireworkCount, angle: randomInRange(55, 125), spread: 60, startVelocity: randomInRange(55, 75),
            decay: 0.92, scalar: layer.scale, shapes: ['star'], colors: layer.colors,
            ticks: 200, gravity: 0.8, origin: { x: randomInRange(0.1, 0.4), y: 0.9 }, zIndex: 100002,
          });
          confetti({
            particleCount: fireworkCount, angle: randomInRange(55, 125), spread: 60, startVelocity: randomInRange(55, 75),
            decay: 0.92, scalar: layer.scale, shapes: ['star'], colors: layer.colors,
            ticks: 200, gravity: 0.8, origin: { x: randomInRange(0.6, 0.9), y: 0.9 }, zIndex: 100002,
          });
        }, 400);
      }

      else if (layer.type === 'rain') {
        const frame = () => {
          // Angle 270 shoots it straight down instead of up!
          confetti({ particleCount: pCount, angle: 270, startVelocity: 25, origin: { y: -0.1, x: Math.random() }, colors: layer.colors, scalar: layer.scale, zIndex: 100002, spread: 45, gravity: 1 });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
      }

      else if (layer.type === 'snow') {
        const randomInRange = (min, max) => Math.random() * (max - min) + min;
        const frame = () => {
          confetti({ 
            particleCount: pCount, 
            startVelocity: 0, // Set to 0 so it doesn't fly upwards off the screen!
            origin: { y: -0.1, x: Math.random() }, 
            colors: layer.colors, 
            scalar: layer.scale * randomInRange(0.6, 1.2), // Random sizes for realistic snowflakes
            shapes: ['circle'], 
            zIndex: 100002, 
            gravity: randomInRange(0.2, 0.5), // Random weight so they fall at different speeds
            drift: randomInRange(-0.6, 0.6), // Blow left and right in the wind
            ticks: 300 
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
      }

      else if (layer.type === 'realistic-burst') {
        const fireBurst = () => {
            const baseCount = Math.round(150 * layer.intensity);
            const burstParams = { origin: { y: 0.6, x: 0.5 }, colors: layer.colors, scalar: layer.scale, zIndex: 100002 };
            
            confetti({ ...burstParams, particleCount: Math.floor(baseCount * 0.25), spread: 26, startVelocity: 55 });
            confetti({ ...burstParams, particleCount: Math.floor(baseCount * 0.2), spread: 60 });
            confetti({ ...burstParams, particleCount: Math.floor(baseCount * 0.35), spread: 100, decay: 0.91, scalar: layer.scale * 0.8 });
            confetti({ ...burstParams, particleCount: Math.floor(baseCount * 0.1), spread: 120, startVelocity: 25, decay: 0.92, scalar: layer.scale * 1.2 });
            confetti({ ...burstParams, particleCount: Math.floor(baseCount * 0.1), spread: 120, startVelocity: 45 });
        };
        
        fireBurst();
        const interval = setInterval(() => {
          if (Date.now() > end) return clearInterval(interval);
          fireBurst();
        }, 1500);
      }

      else if (layer.type === 'center-burst') {
        const interval = setInterval(() => {
          if (Date.now() > end) return clearInterval(interval);
          confetti({
            particleCount: Math.round(50 * layer.intensity), spread: 360, startVelocity: 45,
            colors: layer.colors, scalar: layer.scale, origin: { x: 0.5, y: 0.5 }, zIndex: 100002
          });
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
import { DEFAULT_CHORES } from '../constants/defaults';

export function useChores() {
  const [chores, setChores] = useState(DEFAULT_CHORES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const choresRef = collection(db, 'chores');
    
    const unsubscribe = onSnapshot(choresRef, (snapshot) => {
      if (!snapshot.empty) {
        const fetchedChores = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setChores(fetchedChores);
      }
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
      snapshot.forEach(doc => {
        comps[doc.data().choreId] = true;
      });
      setCompletions(comps);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [todayStr]);

  const toggleCompletion = async (chore, memberId, isCurrentlyDone) => {
    const currentTodayStr = new Date().toDateString();
    const compId = `${chore.id}-${currentTodayStr}`;
    const compRef = doc(db, 'completions', compId);
    const memberRef = doc(db, 'familyMembers', memberId);
    
    const batch = writeBatch(db);
    const numericPoints = Number(chore.points) || 0;

    if (isCurrentlyDone) {
      batch.delete(compRef);
      batch.update(memberRef, { points: increment(-numericPoints) });
    } else {
      batch.set(compRef, {
        choreId: chore.id,
        date: currentTodayStr,
        completedBy: memberId,
        points: numericPoints,
        timestamp: new Date()
      });
      batch.update(memberRef, { points: increment(numericPoints) });
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
  
  // NEW: Check if this specific device is a designated Kiosk Receiver
  const [isKioskDevice, setIsKioskDevice] = useState(() => localStorage.getItem('isKioskDevice') === 'true');

  const wakeTimerRef = useRef(null);

  // Sync globally with Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'kiosk'), (docSnap) => {
      if (docSnap.exists()) {
        setConfig(prev => ({ ...prev, ...docSnap.data() }));
      }
    });
    return () => unsub();
  }, []);

  // Minute-by-Minute schedule checker
  useEffect(() => {
    if (!config.quietTimeEnabled) {
      setIsQuietTime(false);
      return;
    }

    const checkTime = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const [startH, startM] = config.quietTimeStart.split(':').map(Number);
      const startMinutes = startH * 60 + startM;

      const [endH, endM] = config.quietTimeEnd.split(':').map(Number);
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

  // Wake-on-Tap Inactivity Timer (Only runs if this is a Kiosk!)
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

  // Toggle this specific device's role
  const toggleKioskMode = (enabled) => {
    localStorage.setItem('isKioskDevice', enabled);
    setIsKioskDevice(enabled);
  };

  const isBaseDimmed = config.manualDim || isQuietTime;
  
  // The device ONLY dims or mutes if it has Kiosk Mode enabled locally
  const isDimmed = isKioskDevice ? (isBaseDimmed && !isTemporarilyAwake) : false;
  const isMuted = isKioskDevice ? (config.manualMute || isQuietTime) : false;

  return { isDimmed, isMuted, dimIntensity: config.dimIntensity, isKioskDevice, toggleKioskMode };
}
```

### `// src/hooks/useMessageCentre.js`

```js
import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useMessageCentre() {
  const [messageData, setMessageData] = useState({ 
    title: 'Family Notice', 
    content: 'Welcome to the Family Calendar!', 
    isActive: true,
    type: 'info' // info, warning, success, important
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'systemSettings', 'messageCentre'), (docSnap) => {
      if (docSnap.exists()) {
        setMessageData(docSnap.data());
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const saveMessage = async (newData) => {
    await setDoc(doc(db, 'systemSettings', 'messageCentre'), newData);
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
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
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

export function useTheme() {
  const [theme, setTheme] = useState({
    preset: 'default',
    bgImageUrl: '',
    bgColor: '#667eea',
    fontColor: '#1f2937',
    fontFamily: 'system',
    bgPositionDesktop: 50,
    bgPositionMobile: 50,
    panelOpacity: 90,
    panelBlur: 8
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'systemSettings', 'appTheme'), (docSnap) => {
      if (docSnap.exists()) {
        setTheme(prev => ({ ...prev, ...docSnap.data() }));
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const saveTheme = async (newTheme) => {
    await setDoc(doc(db, 'systemSettings', 'appTheme'), newTheme, { merge: true });
  };

  return { theme, loading, saveTheme };
}
```

### `// src/index.css`

```css
@import "tailwindcss";

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
// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import MessageCentre from '../components/dashboard/MessageCentre';
import DailyContent from '../components/dashboard/DailyContent';
import Leaderboard from '../components/dashboard/Leaderboard';
import CalendarGrid from '../components/calendar/CalendarGrid';
import ChoresPanel from '../components/chores/ChoresPanel';
import AdminModal from '../components/admin/AdminModal';
import { useTheme, THEME_PRESETS, FONT_OPTIONS } from '../hooks/useTheme';

export default function Home() {
  const [showAdmin, setShowAdmin] = useState(false);
  const { theme } = useTheme();

  // LOCAL OVERRIDE LISTENER
  const [localOverride, setLocalOverride] = useState(() => localStorage.getItem('bgPositionOverride'));

  useEffect(() => {
    // This allows Home to react instantly when the ThemeTab slider moves
    const handleOverrideChange = () => {
      setLocalOverride(localStorage.getItem('bgPositionOverride'));
    };
    window.addEventListener('localBgOverrideChanged', handleOverrideChange);
    return () => window.removeEventListener('localBgOverrideChanged', handleOverrideChange);
  }, []);

  // Resolve active theme settings globally
  const activePreset = THEME_PRESETS.find(p => p.id === theme?.preset) || THEME_PRESETS[0];
  const isCustom = theme?.preset === 'custom';
  
  let bgStyle = '';
  if (isCustom) {
    if (theme?.bgImageUrl) {
      bgStyle = `background-image: url(${theme.bgImageUrl}); background-color: ${theme.bgColor || '#667eea'};`;
    } else {
      bgStyle = `background: ${theme?.bgColor || '#667eea'};`;
    }
  } else {
    bgStyle = `background: ${activePreset.bg};`;
  }
  
  const activeFontColor = isCustom ? (theme?.fontColor || '#1f2937') : activePreset.font;
  const activeFont = FONT_OPTIONS.find(f => f.id === theme?.fontFamily) || FONT_OPTIONS[0];
  const panelRgba = `rgba(255, 255, 255, ${(theme?.panelOpacity ?? 90) / 100})`;
  const panelBlur = `${theme?.panelBlur ?? 8}px`;

  // Apply effective positions (Local Override trumps global Firebase theme)
  const localOverrideActive = localOverride !== null && localOverride !== '';
  const effectiveDesktopPos = localOverrideActive ? localOverride : (theme?.bgPositionDesktop ?? 50);
  const effectiveMobilePos = localOverrideActive ? localOverride : (theme?.bgPositionMobile ?? 50);

  return (
    <>
      {activeFont.google && <link href={`https://fonts.googleapis.com/css2?family=${activeFont.google}&display=swap`} rel="stylesheet" />}
      <style>{`
        body {
          ${bgStyle}
          background-size: cover;
          background-attachment: fixed;
          font-family: ${activeFont.css};
        }
        @media (min-width: 768px) { body { background-position: center ${effectiveDesktopPos}%; } }
        @media (max-width: 767px) { body { background-position: ${effectiveMobilePos}% center; } }
        
        /* Set CSS Glass Variables globally */
        :root {
          --glass-panel-bg: ${panelRgba};
          --glass-panel-blur: blur(${panelBlur});
          --theme-font-color: ${activeFontColor};
        }
      `}</style>
      
      <div className="min-h-screen w-full p-4 md:p-6 flex flex-col h-screen overflow-hidden relative">
        <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-5">
          <div className="flex-2 flex flex-col min-h-100">
            <CalendarGrid />
          </div>
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 pb-4 hide-scrollbar">
            <MessageCentre />
            <DailyContent />
            <Leaderboard />
            <ChoresPanel />
          </div>
        </div>

        <button 
          onClick={() => setShowAdmin(true)} 
          className="fixed bottom-3 left-3 p-2 text-white/30 hover:text-white/80 transition-all z-40 text-xl hover:rotate-90 drop-shadow-md"
          title="Admin Settings"
        >
          ⚙️
        </button>

        <AdminModal isOpen={showAdmin} onClose={() => setShowAdmin(false)} />
      </div>
    </>
  );
}
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

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

