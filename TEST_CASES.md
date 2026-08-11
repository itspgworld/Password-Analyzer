# Test Cases

This document provides comprehensive test cases for the Password Strength Analyzer, covering weak, medium, and strong passwords. Each test case includes the expected score, strength level, and which checks should pass or fail.

---

## How to Run the Tests

1. Open `index.html` in your browser (or via a local server).
2. Type each password into the analyzer input field.
3. Compare the displayed results with the expected values below.

---

## Test Case Categories

- [Very Weak Passwords](#very-weak-passwords)
- [Weak Passwords](#weak-passwords)
- [Medium Passwords](#medium-passwords)
- [Strong Passwords](#strong-passwords)
- [Very Strong Passwords](#very-strong-passwords)
- [Edge Cases](#edge-cases)

---

## Very Weak Passwords

These passwords should score **0–19** and display "Very Weak".

| # | Password | Expected Score | Expected Strength | Key Failing Checks |
|---|----------|---------------|-------------------|--------------------|
| 1 | `123456` | ~9 | Very Weak | Length, common, sequential, variety, keyboard |
| 2 | `password` | ~9 | Very Weak | Length, common, variety |
| 3 | `qwerty` | ~9 | Very Weak | Length, common, sequential, variety, keyboard |
| 4 | `abc123` | ~14 | Very Weak | Length, common, sequential, variety |
| 5 | `111111` | ~9 | Very Weak | Length, common, repeats, variety |
| 6 | `letmein` | ~9 | Very Weak | Length, common, variety |
| 7 | `admin` | ~9 | Very Weak | Length, common, variety |
| 8 | `a` | ~1.5 | Very Weak | Length, variety |
| 9 | `123` | ~4.5 | Very Weak | Length, common, sequential, variety |
| 10 | `password123` | ~14 | Very Weak | Common, sequential, variety |

**Expected behavior:** All checks except possibly "Uppercase" and "Special characters" should fail. The meter should be red and show "Very Weak".

---

## Weak Passwords

These passwords should score **20–39** and display "Weak".

| # | Password | Expected Score | Expected Strength | Key Failing Checks |
|---|----------|---------------|-------------------|--------------------|
| 1 | `abc12345` | ~24 | Weak | Length (8 = minimum), common, sequential |
| 2 | `qwerty123` | ~24 | Weak | Common, sequential, keyboard |
| 3 | `iloveyou1` | ~24 | Weak | Common, sequential |
| 4 | `12345678a` | ~29 | Weak | Common, sequential |
| 5 | `password1` | ~24 | Weak | Common |
| 6 | `abcdefgh` | ~24 | Weak | Sequential, variety |
| 7 | `1234567890` | ~24 | Weak | Common, sequential, variety |
| 8 | `letmein123` | ~29 | Weak | Common, sequential |
| 9 | `welcome1` | ~24 | Weak | Common |
| 10 | `monkey123` | ~29 | Weak | Common, sequential |

**Expected behavior:** The meter should be orange and show "Weak". Most character class checks may pass, but common/sequential/pattern checks fail.

---

## Medium Passwords

These passwords should score **40–59** and display "Medium".

| # | Password | Expected Score | Expected Strength | Key Failing Checks |
|---|----------|---------------|-------------------|--------------------|
| 1 | `Tr0ub4dor&3` | ~49 | Medium | Common (contains "troubador" pattern), length |
| 2 | `P@ssw0rd2024!` | ~54 | Medium | Common (based on "password") |
| 3 | `Summer2024!` | ~54 | Medium | Date-like (2024), common word "summer" |
| 4 | `Football#1` | ~49 | Medium | Common (football) |
| 5 | `CorrectHorse` | ~49 | Medium | Length (12 = good), variety |
| 6 | `aB3!eF7#` | ~54 | Medium | Length (8 = minimum) |
| 7 | `MyDogRex2024` | ~54 | Medium | Date-like (2024), common word |
| 8 | `qwerty!@#$` | ~44 | Medium | Keyboard, sequential |
| 9 | `Password123!` | ~54 | Medium | Common (password) |
| 10 | `Sunshine2023` | ~54 | Medium | Date-like (2023), common word |

**Expected behavior:** The meter should be yellow and show "Medium". Some checks pass, some fail. Suggestions should be shown.

---

## Strong Passwords

These passwords should score **60–79** and display "Strong".

| # | Password | Expected Score | Expected Strength | Key Notes |
|---|----------|---------------|-------------------|-----------|
| 1 | `CorrectHorseBatteryStaple` | ~74 | Strong | Long but no symbols/numbers |
| 2 | `X9#kL2$mN8@vQ5` | ~79 | Strong | 14 chars, all classes, no patterns |
| 3 | `BlueElephant42!` | ~69 | Strong | 15 chars, all classes |
| 4 | `KiteSurfing2024!` | ~69 | Strong | Date-like (2024) reduces score |
| 5 | `p@ssW0rd!sTr0ng` | ~69 | Strong | Contains "password" pattern |
| 6 | `MountainBike#7` | ~69 | Strong | 15 chars, all classes |
| 7 | `CoffeeLover99!` | ~69 | Strong | Common word "coffee" |
| 8 | `aB3!eF7#kL9$mN2` | ~79 | Strong | 16 chars, all classes |
| 9 | `WinterSnowflake!` | ~69 | Strong | Common word "winter" |
| 10 | `GuitarHero2024!` | ~69 | Strong | Date-like (2024) |

**Expected behavior:** The meter should be green and show "Strong". Most checks pass. Suggestions may include lengthening to 16+ characters.

---

## Very Strong Passwords

These passwords should score **80–100** and display "Very Strong".

| # | Password | Expected Score | Expected Strength | Key Notes |
|---|----------|---------------|-------------------|-----------|
| 1 | `X9#kL2$mN8@vQ5!wR3` | ~89 | Very Strong | 17 chars, all classes, no patterns |
| 2 | `Tr0ub4dor&3Horse!` | ~84 | Very Strong | 18 chars, all classes |
| 3 | `aB3!eF7#kL9$mN2@pQ5` | ~94 | Very Strong | 20 chars, all classes |
| 4 | `K#9xL$2mN8@vQ5!wR3` | ~94 | Very Strong | 18 chars, all classes, random |
| 5 | `P@ssw0rd!sN0tG00d!` | ~84 | Very Strong | 19 chars, all classes |
| 6 | `Zx9!Qw3#Er5$Ty7@` | ~94 | Very Strong | 18 chars, all classes |
| 7 | `M0untain!B1ke#R1de` | ~84 | Very Strong | 20 chars, all classes |
| 8 | `C0ffee!L0ver#2024!` | ~84 | Very Strong | 20 chars, all classes |
| 9 | `a1B2c3D4e5F6g7H8!` | ~89 | Very Strong | 18 chars, all classes |
| 10 | `!Q@W#E$R%T^Y&U*I` | ~94 | Very Strong | 18 chars, all classes |

**Expected behavior:** The meter should be dark green and show "Very Strong". All checks should pass. No suggestions should be displayed.

---

## Edge Cases

| # | Password | Expected Behavior |
|---|----------|-------------------|
| 1 | *(empty)* | UI resets to "Not analyzed" state |
| 2 | ` ` (single space) | Analyzed as very weak (length 1, single class) |
| 3 | `aaaaaaaaaaaaaaaa` | Very Weak — repeated characters, single class |
| 4 | `abababababababab` | Very Weak — repeated substring |
| 5 | `1990` | Very Weak — date-like, short, numeric only |
| 6 | `01012000` | Very Weak — date-like, numeric only |
| 7 | `12-25-1990` | Weak — date-like, short |
| 8 | `1qaz2wsx3edc` | Very Weak — keyboard walk |
| 9 | `qazwsxedcrfv` | Very Weak — keyboard walk |
| 10 | `13579` | Very Weak — step pattern |
| 11 | `24680` | Very Weak — step pattern |
| 12 | `Zx9!Qw3#Er5$Ty7@Uj1` | Very Strong — 20 chars, all classes, no patterns |
| 13 | `passwordpassword` | Weak — common word repeated |
| 14 | `PASSWORD123` | Weak — common, single class (upper+digit) |
| 15 | `!@#$%^&*()` | Very Weak — symbols only, single class |

---

## Automated Test Script

You can also test the analyzer programmatically using the browser console:

```javascript
// Paste this into the browser console (F12) while the page is open

const testPasswords = [
  { password: "123456", expected: "Very Weak" },
  { password: "password", expected: "Very Weak" },
  { password: "abc12345", expected: "Weak" },
  { password: "Tr0ub4dor&3", expected: "Medium" },
  { password: "CorrectHorseBatteryStaple", expected: "Strong" },
  { password: "X9#kL2$mN8@vQ5!wR3", expected: "Very Strong" }
];

testPasswords.forEach(({ password, expected }) => {
  const result = window.PasswordAnalyzer.analyze(password);
  const status = result.strength === expected ? "PASS" : "FAIL";
  console.log(
    `${status} | "${password}" | Expected: ${expected} | Got: ${result.strength} | Score: ${result.score} | Entropy: ${result.entropy} bits`
  );
});
```

**Expected output:**

```
PASS | "123456" | Expected: Very Weak | Got: Very Weak | Score: 9 | Entropy: 19.9 bits
PASS | "password" | Expected: Very Weak | Got: Very Weak | Score: 9 | Entropy: 37.6 bits
PASS | "abc12345" | Expected: Weak | Got: Weak | Score: 24 | Entropy: 37.6 bits
PASS | "Tr0ub4dor&3" | Expected: Medium | Got: Medium | Score: 49 | Entropy: 59.5 bits
PASS | "CorrectHorseBatteryStaple" | Expected: Strong | Got: Strong | Score: 74 | Entropy: 111.7 bits
PASS | "X9#kL2$mN8@vQ5!wR3" | Expected: Very Strong | Got: Very Strong | Score: 89 | Entropy: 111.7 bits
```

> **Note:** Exact entropy values may vary slightly depending on the character classes detected. The scores above are approximate and may differ by a few points depending on the exact check results.

---

## Test Results Summary

| Category | Passwords Tested | Expected Result |
|----------|-----------------|-----------------|
| Very Weak | 10 | Score 0–19, "Very Weak" |
| Weak | 10 | Score 20–39, "Weak" |
| Medium | 10 | Score 40–59, "Medium" |
| Strong | 10 | Score 60–79, "Strong" |
| Very Strong | 10 | Score 80–100, "Very Strong" |
| Edge Cases | 15 | Various, see table above |
| **Total** | **65** | |