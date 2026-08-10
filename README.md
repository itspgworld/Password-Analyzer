# Password Strength Analyzer

A beginner-friendly, educational cybersecurity project that analyzes password strength **entirely in the browser**. Your password never leaves your device — no network requests, no storage, no logging.

![Tech Stack](https://img.shields.io/badge/HTML-CSS-JavaScript-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)
![Privacy](https://img.shields.io/badge/Privacy-100%25_Local-green)

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [How It Works](#how-it-works)
- [Security Checks](#security-checks)
- [Scoring System](#scoring-system)
- [Entropy Estimation](#entropy-estimation)
- [Privacy Guarantee](#privacy-guarantee)
- [Accessibility](#accessibility)
- [Test Cases](#test-cases)
- [Documentation](#documentation)
- [Limitations](#limitations)
- [License](#license)

---

## Features

- ✅ **Local-only analysis** — password never leaves the browser
- ✅ **Show/hide password** toggle with proper ARIA attributes
- ✅ **11 security checks** including length, character classes, repeats, common passwords, sequences, dates, keyboard walks, and variety
- ✅ **5-level strength meter** — Very Weak → Very Strong
- ✅ **Detailed explanations** for every check result
- ✅ **Actionable suggestions** to improve weak passwords
- ✅ **Entropy estimate** with clear explanation that it's only an estimate
- ✅ **Secure password generator** using `crypto.getRandomValues()`
- ✅ **Educational section** covering password best practices, password managers, MFA, and passkeys
- ✅ **Responsive design** — works on mobile, tablet, and desktop
- ✅ **Accessibility features** — skip link, ARIA labels, keyboard navigation, reduced-motion support, high-contrast focus
- ✅ **No external dependencies** — no frameworks, no CDNs, no tracking

---

## Project Structure

```
project/
├── index.html              # Main HTML page (semantic, accessible markup)
├── css/
│   └── style.css           # Modern responsive stylesheet
├── js/
│   ├── analyzer.js         # Core analysis engine (security checks, scoring, entropy)
│   ├── generator.js        # Crypto-secure password generator
│   └── app.js              # UI controller (DOM manipulation, event handling)
├── docs/
│   ├── SECURITY_CHECKS.md  # Detailed explanation of each security check
│   ├── TEST_CASES.md       # Test cases for weak, medium, and strong passwords
│   └── PROJECT_REPORT.md   # Full cybersecurity project report
└── README.md               # This file
```

---

## Setup Instructions

### Option 1: Open Directly (Recommended for Beginners)

1. Download or clone this repository.
2. Double-click `index.html` to open it in your browser.
3. That's it! No server, no installation, no dependencies.

> **Note:** The clipboard copy feature requires a secure context. If you open the file via `file://`, the copy button will fall back to `document.execCommand("copy")`, which still works in most browsers. For the full Clipboard API experience, use Option 2.

### Option 2: Local Server (Recommended for Full Features)

Since the Clipboard API requires a secure context, running a local server is recommended:

**Using Python (already installed on most systems):**

```bash
# From the project directory
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

**Using VS Code Live Server:**

1. Install the "Live Server" extension.
2. Right-click `index.html` → "Open with Live Server".

**Using Node.js:**

```bash
npx serve .
```

Then open the URL shown in the terminal.

### Option 3: Deploy Online

You can host this on any static hosting service (GitHub Pages, Netlify, Vercel, etc.). Since there are no server-side components, deployment is just uploading the files.

---

## How It Works

1. **User types a password** into the input field.
2. **The `input` event fires** and calls `handlePasswordInput()` in `app.js`.
3. **`app.js` calls `window.PasswordAnalyzer.analyze(password)`** from `analyzer.js`.
4. **`analyzer.js` runs 11 security checks** and produces:
   - A score from 0–100
   - A strength level (Very Weak → Very Strong)
   - An entropy estimate in bits
   - A list of check results with pass/fail status
   - A list of improvement suggestions
5. **`app.js` updates the DOM** — meter, labels, check grid, and suggestions.
6. **The password is garbage-collected** when the function returns. It is never stored.

The **generator** uses `crypto.getRandomValues()` with rejection sampling to avoid modulo bias, guaranteeing cryptographically secure randomness.

---

## Security Checks

The analyzer performs 11 checks. Here's a quick summary (full details in [docs/SECURITY_CHECKS.md](docs/SECURITY_CHECKS.md)):

| # | Check | What it detects |
|---|-------|-----------------|
| 1 | Minimum length | Passwords shorter than 8 characters |
| 2 | Uppercase letters | Presence of A-Z |
| 3 | Lowercase letters | Presence of a-z |
| 4 | Numbers | Presence of 0-9 |
| 5 | Special characters | Presence of !@#$%^&* etc. |
| 6 | Repeated characters | "aaa", "abab", "abcabc" |
| 7 | Common passwords | "password", "123456", "qwerty", etc. |
| 8 | Sequential characters | "1234", "abcd", "9876" |
| 9 | Date-like patterns | "1990", "01012000", "12-25-1990" |
| 10 | Character variety | Only one character class used |
| 11 | Keyboard walks | "qwerty", "asdf", "1qaz2wsx" |

---

## Scoring System

The score is calculated out of 100 points:

| Factor | Max Points |
|--------|-----------|
| Length (8+ = 15, 12+ = 24, 16+ = 30) | 30 |
| Character variety (5 per class) | 20 |
| No repeated characters | 10 |
| Not a common password | 15 |
| No sequential characters | 10 |
| Not date-like | 5 |
| Not a keyboard walk | 5 |
| Multiple character classes | 5 |

**Strength levels:**

| Score | Level |
|-------|-------|
| 0–19 | Very Weak |
| 20–39 | Weak |
| 40–59 | Medium |
| 60–79 | Strong |
| 80–100 | Very Strong |

---

## Entropy Estimation

Entropy is estimated using the formula:

```
entropy_bits = length × log₂(pool_size)
```

Where `pool_size` is the number of possible characters based on which character classes are present (26 for lowercase, 26 for uppercase, 10 for digits, 33 for symbols).

**Important:** This is a *simplified estimate*. Real-world entropy depends on how the password was generated. A human-chosen password like `Tr0ub4dor&3` has far less real entropy than its length suggests because it contains dictionary words and predictable substitutions. The tool clearly explains this limitation to the user.

---

## Privacy Guarantee

- 🔒 **No network requests** — the page makes zero HTTP requests after loading.
- 🔒 **No storage** — `localStorage`, `sessionStorage`, and cookies are never used.
- 🔒 **No logging** — the password is never written to the console or any log.
- 🔒 **No URL exposure** — the password never appears in the URL or query string.
- 🔒 **No analytics** — there are no tracking scripts or beacons.
- 🔒 **No external resources** — all CSS and JS are local files.

You can verify this by:
1. Opening Developer Tools (F12) → Network tab.
2. Typing a password and watching the network tab — no requests will appear.
3. Checking the Console — no password values are ever logged.

---

## Accessibility

- **Skip link** for keyboard users to jump to main content
- **ARIA labels** on all interactive elements
- **ARIA live regions** for dynamic updates (meter, results)
- **ARIA progressbar** semantics on the strength meter
- **Keyboard navigation** — all controls are reachable and operable via keyboard
- **Focus indicators** — high-contrast visible focus states
- **Reduced motion support** — respects `prefers-reduced-motion`
- **Semantic HTML** — proper landmarks, headings, labels, and fieldsets
- **Color-independent indicators** — checkmarks/crosses in addition to color

---

## Test Cases

See [docs/TEST_CASES.md](docs/TEST_CASES.md) for a comprehensive table of test cases covering weak, medium, and strong passwords, including expected scores and strength levels.

Quick examples:

| Password | Expected Strength |
|----------|------------------|
| `123456` | Very Weak |
| `password` | Very Weak |
| `qwerty123` | Very Weak |
| `abc12345` | Weak |
| `Tr0ub4dor&3` | Medium |
| `P@ssw0rd2024!` | Medium |
| `CorrectHorseBatteryStaple` | Strong |
| `X9#kL2$mN8@vQ5!` | Very Strong |

---

## Documentation

- [Security Checks Explained](docs/SECURITY_CHECKS.md) — detailed explanation of how each check works
- [Test Cases](docs/TEST_CASES.md) — comprehensive test matrix
- [Project Report](docs/PROJECT_REPORT.md) — full cybersecurity project report

---

## Limitations

- **Entropy is an estimate** — it doesn't account for dictionary words, leaked password lists, or human predictability.
- **Common password list is curated** — it's not exhaustive. A password not in the list could still be weak.
- **No breach database check** — the tool doesn't check against HaveIBeenPwned (that would require a network request, violating the privacy guarantee).
- **Educational only** — this tool provides guidance, not a guarantee of security.

---

## License

MIT License — free to use, modify, and distribute for educational purposes.