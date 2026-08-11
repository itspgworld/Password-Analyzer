/* ============================================================
   Verification Script - Tests the analyzer scoring logic
   ------------------------------------------------------------
   This script is loaded in the browser console to verify that
   the analyzer produces the expected scores/strength levels for
   a set of known test passwords. It is NOT part of the app and
   contains no password data that is transmitted anywhere.
   ============================================================ */

"use strict";

// Test cases: password, expected strength level
const TEST_CASES = [
  // Very Weak
  { password: "123456", expected: "Very Weak" },
  { password: "password", expected: "Very Weak" },
  { password: "qwerty", expected: "Very Weak" },
  { password: "abc123", expected: "Very Weak" },
  { password: "111111", expected: "Very Weak" },
  { password: "letmein", expected: "Very Weak" },
  { password: "admin", expected: "Very Weak" },
  { password: "a", expected: "Very Weak" },
  { password: "123", expected: "Very Weak" },
  { password: "password123", expected: "Very Weak" },

  // Weak
  { password: "abc12345", expected: "Weak" },
  { password: "qwerty123", expected: "Weak" },
  { password: "iloveyou1", expected: "Weak" },
  { password: "12345678a", expected: "Weak" },
  { password: "password1", expected: "Weak" },
  { password: "abcdefgh", expected: "Weak" },
  { password: "1234567890", expected: "Weak" },
  { password: "letmein123", expected: "Weak" },
  { password: "welcome1", expected: "Weak" },
  { password: "monkey123", expected: "Weak" },

  // Medium
  { password: "Tr0ub4dor&3", expected: "Medium" },
  { password: "P@ssw0rd2024!", expected: "Weak" }, // actually common (password) -> Very Weak cap
  { password: "Summer2024!", expected: "Medium" },
  { password: "Football#1", expected: "Medium" },
  { password: "CorrectHorse", expected: "Medium" },
  { password: "aB3!eF7#", expected: "Medium" },
  { password: "MyDogRex2024", expected: "Medium" },
  { password: "qwerty!@#$", expected: "Weak" }, // keyboard walk -> Weak cap
  { password: "Password123!", expected: "Very Weak" }, // common (password) -> Very Weak cap
  { password: "Sunshine2023", expected: "Medium" },

  // Strong
  { password: "CorrectHorseBatteryStaple", expected: "Strong" },
  { password: "X9#kL2$mN8@vQ5", expected: "Strong" },
  { password: "BlueElephant42!", expected: "Strong" },
  { password: "KiteSurfing2024!", expected: "Medium" }, // date 2024 -> Medium cap
  { password: "p@ssW0rd!sTr0ng", expected: "Medium" }, // dictionary (password) -> Medium cap
  { password: "MountainBike#7", expected: "Strong" },
  { password: "CoffeeLover99!", expected: "Strong" },
  { password: "aB3!eF7#kL9$mN2", expected: "Strong" },
  { password: "WinterSnowflake!", expected: "Strong" },
  { password: "GuitarHero2024!", expected: "Medium" }, // date -> Medium cap

  // Very Strong
  { password: "X9#kL2$mN8@vQ5!wR3", expected: "Very Strong" },
  { password: "Tr0ub4dor&3Horse!", expected: "Very Strong" },
  { password: "aB3!eF7#kL9$mN2@pQ5", expected: "Very Strong" },
  { password: "K#9xL$2mN8@vQ5!wR3", expected: "Very Strong" },
  { password: "P@ssw0rd!sN0tG00d!", expected: "Very Strong" },
  { password: "Zx9!Qw3#Er5$Ty7@", expected: "Very Strong" },
  { password: "M0untain!B1ke#R1de", expected: "Very Strong" },
  { password: "C0ffee!L0ver#2024!", expected: "Medium" }, // date 2024 -> Medium cap
  { password: "a1B2c3D4e5F6g7H8!", expected: "Very Strong" },
  { password: "!Q@W#E$R%T^Y&U*I", expected: "Very Strong" },

  // Edge cases
  { password: "", expected: "Not analyzed" },
  { password: " ", expected: "Very Weak" },
  { password: "aaaaaaaaaaaaaaaa", expected: "Very Weak" },
  { password: "abababababababab", expected: "Very Weak" },
  { password: "1990", expected: "Very Weak" },
  { password: "01012000", expected: "Very Weak" },
  { password: "12-25-1990", expected: "Weak" },
  { password: "1qaz2wsx3edc", expected: "Very Weak" },
  { password: "qazwsxedcrfv", expected: "Very Weak" },
  { password: "13579", expected: "Very Weak" },
  { password: "24680", expected: "Very Weak" },
  { password: "Zx9!Qw3#Er5$Ty7@Uj1", expected: "Very Strong" },
  { password: "passwordpassword", expected: "Weak" },
  { password: "PASSWORD123", expected: "Very Weak" },
  { password: "!@#$%^&*()", expected: "Very Weak" }
];

// Run the tests
let passCount = 0;
let failCount = 0;

console.log("=== PASSWORD STRENGTH ANALYZER - SCORE VERIFICATION ===\n");

TEST_CASES.forEach(({ password, expected }) => {
  const result = window.PasswordAnalyzer.analyze(password);
  const status = result.strength === expected ? "PASS" : "FAIL";
  if (status === "PASS") {
    passCount++;
  } else {
    failCount++;
  }
  console.log(
    `${status} | "${password}" | Expected: ${expected} | Got: ${result.strength} | Score: ${result.score}/100 | Entropy: ${result.entropy} bits | Checks passed: ${result.passedCount}/${result.totalChecks}`
  );
});

console.log(`\n=== RESULTS: ${passCount} passed, ${failCount} failed ===`);

if (failCount > 0) {
  console.log("\nFailed cases (adjust expectations or fix logic):");
  TEST_CASES.forEach(({ password, expected }) => {
    const result = window.PasswordAnalyzer.analyze(password);
    if (result.strength !== expected) {
      console.log(`  "${password}" -> expected ${expected}, got ${result.strength} (score ${result.score})`);
    }
  });
}