# Wordy — Frontend Prototype

## Project structure

```
wordy/
├── index.html                 # Scaffold (see note inside)
├── wordy-prototype.html       # Self-contained single-file version (just works)
├── css/
│   └── main.css               # All styles
├── js/
│   ├── router.js              # go() navigation + navIds
│   ├── home.js                # Slogan animation, carousel
│   ├── reading.js             # Typewriter animation
│   ├── session.js             # Web Speech API voice session
│   ├── lists.js               # Chapter list carousel
│   ├── words.js               # List mode + focus mode
│   ├── quiz.js                # Quiz setup, questions, results, review
│   ├── utils.js               # Shared helpers (goFocus)
│   └── flashcards.js          # Flashcard flip, hint, results
└── pages/
    ├── _nav.html              # Navigation bar
    ├── _overlays.html         # Global overlays (quiz popup, modals)
    ├── home.html
    ├── reading.html
    ├── session.html
    ├── library.html
    ├── lists.html
    ├── words.html
    ├── quiz.html
    ├── flashcards.html
    └── profile.html
```

## Running locally

```bash
cd wordy
npm install
npm run dev
```

The dev server opens the self-contained app at `wordy-prototype.html` (the root `index.html` is only a file-layout scaffold).

Optional: `npm run build` outputs a static copy to `dist/`; `npm run preview` serves that build.

Without Node, you can still use `python3 -m http.server 8000` or open `wordy-prototype.html` directly in the browser.

## Colors
| Var       | Hex       | Name         |
|-----------|-----------|--------------|
| `--gg`    | `#9bc78b` | Grey-green   |
| `--lg`    | `#d8e9d1` | Light green  |
| `--ow`    | `#f8f8f8` | Off-white    |
| `--bk`    | `#111`    | Black        |

## Fonts
- **Open Sans** — headers, buttons, UI labels
- **Noto Serif** — vocabulary words, definitions

## Navigation
All page transitions use `go(id)` from `router.js`.
The quiz setup popup (`#qso`) lives at `<body>` level so it
appears correctly when triggered from any page.

## Voice features
Web Speech API — Chrome only, requires microphone permission.
Only activates when entering the reading session page.
