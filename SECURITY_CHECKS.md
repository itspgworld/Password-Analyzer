# Security Checks Explained

This document explains how each security check in the Password Strength Analyzer works, why it matters, and how it contributes to the overall score.

---

## Overview

The analyzer runs **12 security checks** on every password. Each check produces a pass/fail result with a human-readable explanation. The results are combined into a weighted score from 0–100 using a combination of additive scoring and **hard caps**.

A "hard cap" sets an absolute maximum score when a critical weakness is detected, preventing a password from scoring higher than its weakest property would merit. For example, a common password like "password123" can never score higher than 15, regardless of how many other checks it passes.

---

## Check 1: Minimum Length

**What it does:** Checks if the password meets minimum length requirements.

**How it works:**
- `length >= 16` → **Excellent** (pass)
- `length >= 12` → **Good** (pass)
- `length >= 8` → **Minimum** (pass with warning)
- `length < 8` → **Too short** (fail)

**Why it matters:** Length is the single most important factor in password strength. Every additional character multiplies the number of possible combinations exponentially.

**Score contribution:** Up to 25 points additive. Hard caps apply for critically short passwords.

---

## Check 2: Uppercase Letters

**What it does:** Checks for the presence of at least one uppercase letter (A–Z).

**How it works:** Uses the regex `/[A-Z]/` to test the password.

**Score contribution:** 5 points if present.

---

## Check 3: Lowercase Letters

**What it does:** Checks for the presence of at least one lowercase letter (a–z).

**How it works:** Uses the regex `/[a-z]/` to test the password.

**Score contribution:** 5 points if present.

---

## Check 4: Numbers

**What it does:** Checks for the presence of at least one digit (0–9).

**How it works:** Uses the regex `/[0-9]/` to test the password.

**Score contribution:** 5 points if present.

---

## Check 5: Special Characters

**What it does:** Checks for the presence of at least one special character (e.g., `!@#$%^&*`).

**How it works:** Uses the regex `/[^a-zA-Z0-9\s]/` which matches any non-alphanumeric, non-space character.

**Score contribution:** 5 points if present.

---

## Check 6: Repeated Characters

**What it does:** Detects repeated characters and repeated substrings.

**How it works:**
1. Counts character frequencies using a hash map.
2. Flags any character appearing 3 or more times.
3. Detects repeated substrings by comparing adjacent slices (e.g., "abab" → "ab" repeated).

**Examples flagged:** `aaa`, `ababab`, `abcabcabc`

**Why it matters:** Repeated patterns dramatically reduce the effective entropy of a password.

**Score contribution:** 10 points additive if no repeats. Hard cap at 49 (Medium max) if repeats are found.

---

## Check 7: Common / Weak Password Patterns

**What it does:** Checks if the password appears in a curated list of the most common weak passwords (500+ entries).

**How it works:**
1. Converts the password to lowercase.
2. Checks for a direct match against the `COMMON_PASSWORDS` set.
3. Strips trailing digits/symbols and re-checks.
4. Strips a single trailing digit and re-checks.

**Score contribution:** 10 points additive if not common. **Hard cap of 15** (Very Weak max) if common.

---

## Check 8: Sequential Characters

**What it does:** Detects sequential character patterns.

**How it works:** Checks for:
- **Alphabetical sequences:** "abc", "def", "xyz", and reverses
- **Numeric sequences:** "123", "456", "789", and reverses
- **Step patterns:** "1357", "2468", "147", "258", "369"

**Score contribution:** 10 points additive if no sequences. **Hard cap of 34** (Weak max) if sequences found.

---

## Check 9: Date-like Patterns

**What it does:** Detects passwords that look like dates or contain years.

**How it works:**
- Detects embedded 4-digit years: `(19|20)\d{2}`
- Matches full-date formats: MMDDYYYY, DDMMYYYY, YYYYMMDD, etc.

**Why it matters:** People frequently use birthdays and years as passwords. This information is often publicly available on social media.

**Score contribution:** 5 points additive if not date-like. **Hard cap of 44** (Medium max) if date detected.

---

## Check 10: Character Variety

**What it does:** Checks if the password uses only one character class.

**How it works:** Counts how many of the four character classes (lower, upper, digit, symbol) are present. If only one class is present (and length >= 4), the check fails.

**Score contribution:** 5 points additive if multiple classes. **Hard cap of 39** (Weak max) if single class. **Hard cap of 69** (Strong max) if 2 classes. **Hard cap of 84** (Very Strong max) if 3 classes.

---

## Check 11: Keyboard Walk

**What it does:** Detects keyboard patterns like "qwerty", "asdf", "1qaz2wsx".

**How it works:** Checks against a list of known keyboard patterns (horizontal rows, vertical columns, diagonal patterns, common walks).

**Score contribution:** 10 points additive if no keyboard walk. **Hard cap of 29** (Weak max) if found.

---

## Check 12: Dictionary Word

**What it does:** Detects common English words (including leet-speak substitutions) inside the password.

**How it works:**
1. Normalizes leet-speak substitutions (e.g., "p@ssw0rd" → "password").
2. Removes all non-letter characters.
3. Scans for 4+ letter words from a curated set of common words.

**Score contribution:** 10 points additive if no dictionary word. **Hard cap of 49** (Medium max) if a word dominates the password (≥40% of length) and password is under 16 characters.

---

## Scoring Summary

### Additive Base Score

| Factor | Max Points |
|--------|-----------|
| Length | 25 |
| Character classes (5 each) | 20 |
| Variety bonus | 5 |
| No repeats | 10 |
| Not common | 10 |
| No sequences | 10 |
| No keyboard walk | 10 |
| Not date-like | 5 |
| No dictionary word | 10 |
| **Total (capped)** | **100** |

### Hard Caps

| Condition | Max Score | Strength Cap |
|-----------|-----------|--------------|
| Length 1–3 | 10 | Very Weak |
| Length 4–7 | 24 | Weak |
| Length 8–11 | 79 | Strong |
| Common password | 15 | Very Weak |
| Sequences found | 34 | Weak |
| Keyboard walk | 29 | Weak |
| Single class | 39 | Weak |
| Repeats found | 49 | Medium |
| Dictionary word | 49 | Medium |
| Date found | 44 | Medium |
| 1 character class | 39 | Weak |
| 2 character classes | 69 | Strong |
| 3 character classes | 84 | Very Strong |

---

## Strength Level Mapping

| Score Range | Strength Level |
|-------------|----------------|
| 0–19 | Very Weak |
| 20–39 | Weak |
| 40–59 | Medium |
| 60–79 | Strong |
| 80–100 | Very Strong |

---

## Entropy Estimation

The entropy estimate uses the formula:

```
entropy_bits = length × log₂(pool_size)
```

Where `pool_size` is determined by which character classes are present:

| Classes Present | Pool Size |
|-----------------|-----------|
| Lowercase only | 26 |
| Lowercase + Uppercase | 52 |
| Lowercase + Uppercase + Digits | 62 |
| All four classes | 95 |

**Important caveat:** This is a simplified estimate that assumes random generation from the full character pool. Human-chosen passwords have far less real entropy because people use words, names, and patterns. This limitation is clearly communicated to the user.