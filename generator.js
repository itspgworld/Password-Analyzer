/* ============================================================
   Password Strength Analyzer - Secure Password Generator
   ------------------------------------------------------------
   SECURITY NOTE:
   - Uses crypto.getRandomValues(), a cryptographically secure
     random number generator provided by the browser.
   - Math.random() is NOT used because it is not cryptographically
     secure and could be predictable.
   - Generated passwords are never stored, logged, or transmitted.
   - The password exists only in memory and is cleared when the
     page is closed or the field is overwritten.
   ============================================================ */

"use strict";

/**
 * Character sets used for password generation.
 * We exclude ambiguous characters (0/O, 1/l/I) to make
 * passwords easier to read and type.
 */
const CHARSETS = {
  upper: "ABCDEFGHJKLMNPQRSTUVWXYZ", // no I, O
  lower: "abcdefghijkmnopqrstuvwxyz", // no l
  digits: "23456789",                 // no 0, 1
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?"
};

/**
 * Generate a cryptographically secure random integer in [0, max).
 * Uses rejection sampling to avoid modulo bias.
 *
 * @param {number} max - Upper bound (exclusive).
 * @returns {number} Random integer in [0, max).
 */
function secureRandomInt(max) {
  // Use a Uint32Array to get 32 bits of randomness
  const buffer = new Uint32Array(1);
  const maxUint32 = 0xffffffff;

  // Rejection sampling: discard values that would create modulo bias
  const limit = maxUint32 - (maxUint32 % max);
  let value;

  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);

  return value % max;
}

/**
 * Generate a strong random password.
 *
 * @param {number} length - Desired password length (8-64).
 * @param {Object} options - Character set options.
 * @param {boolean} options.upper - Include uppercase letters.
 * @param {boolean} options.lower - Include lowercase letters.
 * @param {boolean} options.digits - Include digits.
 * @param {boolean} options.symbols - Include symbols.
 * @returns {string} Generated password.
 */
function generatePassword(length, options) {
  // Validate and clamp length
  const safeLength = Math.max(8, Math.min(64, Math.floor(length) || 20));

  // Build the pool of allowed characters
  let pool = "";
  if (options.upper) pool += CHARSETS.upper;
  if (options.lower) pool += CHARSETS.lower;
  if (options.digits) pool += CHARSETS.digits;
  if (options.symbols) pool += CHARSETS.symbols;

  // If no character sets selected, default to all
  if (pool.length === 0) {
    pool = CHARSETS.upper + CHARSETS.lower + CHARSETS.digits + CHARSETS.symbols;
  }

  // Ensure at least one character from each selected set is included.
  // This guarantees the password meets variety requirements even if
  // the random selection happens to pick from a single set.
  const requiredSets = [];
  if (options.upper) requiredSets.push(CHARSETS.upper);
  if (options.lower) requiredSets.push(CHARSETS.lower);
  if (options.digits) requiredSets.push(CHARSETS.digits);
  if (options.symbols) requiredSets.push(CHARSETS.symbols);

  // If no sets selected, use all four
  if (requiredSets.length === 0) {
    requiredSets.push(CHARSETS.upper, CHARSETS.lower, CHARSETS.digits, CHARSETS.symbols);
  }

  // Build the password: first ensure one char from each required set,
  // then fill the rest randomly from the full pool.
  const chars = [];

  // Guarantee one character from each selected set
  for (const set of requiredSets) {
    chars.push(set[secureRandomInt(set.length)]);
  }

  // Fill the remaining positions from the full pool
  while (chars.length < safeLength) {
    chars.push(pool[secureRandomInt(pool.length)]);
  }

  // Shuffle using Fisher-Yates with crypto-secure randomness.
  // This prevents the guaranteed characters from always being
  // at the start of the password.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
}

// Expose the generator globally (used by app.js)
window.PasswordGenerator = {
  generate: generatePassword
};