/* ============================================================
   Password Strength Analyzer - Core Analysis Engine
   ------------------------------------------------------------
   SECURITY NOTE:
   - All analysis happens locally in the browser.
   - The password is never sent, stored, logged, or transmitted.
   - No network requests are made by this module.
   - No browser storage (localStorage/sessionStorage) is used.
   - The password exists only in memory during the analysis call
     and is garbage-collected after the function returns.
   ============================================================ */

"use strict";

/**
 * A curated list of common weak passwords and patterns.
 * This is intentionally small to keep the bundle light while still
 * catching the most frequently used weak passwords.
 *
 * SECURITY NOTE: This list is NOT a password dictionary for cracking.
 * It is used only to flag obviously weak user input for education.
 */
const COMMON_PASSWORDS = new Set([
  "password", "password1", "password123", "123456", "12345678",
  "123456789", "1234567890", "qwerty", "qwerty123", "abc123",
  "letmein", "welcome", "monkey", "dragon", "football", "baseball",
  "iloveyou", "admin", "admin123", "root", "toor", "123123",
  "111111", "000000", "1234", "12345", "654321", "666666",
  "888888", "999999", "trustno1", "sunshine", "master", "shadow",
  "superman", "batman", "princess", "login", "passw0rd", "p@ssw0rd",
  "changeme", "default", "guest", "hello", "hello123", "freedom",
  "whatever", "qazwsx", "zaq12wsx", "1q2w3e4r", "1qaz2wsx",
  "asdfgh", "zxcvbn", "qwertyuiop", "asdfghjkl", "zxcvbnm",
  "computer", "internet", "google", "yahoo", "facebook", "twitter",
  "instagram", "linkedin", "youtube", "netflix", "amazon", "ebay",
  "paypal", "gmail", "hotmail", "outlook", "aol", "msn",
  "pokemon", "mickey", "minnie", "donald", "daisy", "snoopy",
  "starwars", "pokemon123", "naruto", "soccer", "football1",
  "hockey", "baseball1", "basketball", "guitar", "cheese",
  "pepper", "mustang", "harley", "hunter", "jordan", "michael",
  "jennifer", "jessica", "daniel", "ashley", "andrew", "matthew",
  "joshua", "charlie", "bailey", "sophie", "emma", "olivia",
  "ava", "isabella", "mia", "charlotte", "amelia", "harper",
  "evelyn", "abigail", "emily", "elizabeth", "sofia", "avery",
  "ella", "madison", "scarlett", "victoria", "aria", "grace",
  "chloe", "camila", "penelope", "riley", "layla", "lillian",
  "nora", "zoey", "mila", "aubrey", "hannah", "lily", "addison",
  "eleanor", "natalie", "luna", "savannah", "brooklyn", "leah",
  "zoe", "stella", "hazel", "ellie", "paisley", "audrey",
  "skylar", "violet", "claire", "bella", "autumn", "aaliyah",
  "sarah", "katherine", "madelyn", "serenity", "lucy", "alice",
  "quinn", "jasmine", "sadie", "eva", "naomi", "ruby", "julia",
  "london", "kaylee", "brianna", "kennedy", "caroline", "sydney",
  "willow", "jade", "maya", "kylie", "destiny", "danielle",
  "isabelle", "gabriella", "valentina", "jocelyn", "maria",
  "rose", "molly", "amy", "iris", "daisy", "laura", "erin",
  "rebecca", "linda", "karen", "susan", "patricia", "nancy",
  "lisa", "betty", "sandra", "carol", "deborah", "julie",
  "heather", "tiffany", "amber", "melissa", "nicole", "stephanie",
  "crystal", "kathleen", "joan", "janet", "diane", "kelly",
  "denise", "tammy", "rachel", "lori", "maria", "christina",
  "kathy", "angela", "sharon", "debra", "teresa", "cynthia",
  "katherine", "judy", "theresa", "beverly", "denise", "tammy",
  "irene", "jane", "lorraine", "marilyn", "phyllis", "suzanne",
  "yvonne", "gloria", "doris", "norma", "paula", "wendy",
  "carolyn", "janice", "judith", "kathryn", "marjorie", "sherry",
  "ann", "bonnie", "connie", "dolores", "eileen", "gail",
  "joanne", "kay", "lillian", "marian", "pat", "peggy",
  "robin", "sheila", "velma", "vivian", "willie", "albert",
  "alfred", "allen", "arthur", "bernard", "billy", "bobby",
  "bruce", "carl", "carlos", "clarence", "clifford", "craig",
  "curtis", "dale", "darrell", "dennis", "donald", "douglas",
  "earl", "eddie", "edward", "edwin", "ernest", "eugene",
  "floyd", "frank", "fred", "freddie", "gene", "george",
  "gerald", "glenn", "gordon", "gregory", "harold", "harry",
  "harvey", "henry", "herbert", "herman", "howard", "jack",
  "jacob", "james", "jared", "jason", "jeffrey", "jeremy",
  "jerry", "jesse", "jimmy", "joe", "joel", "john",
  "johnny", "jonathan", "jose", "joseph", "juan", "justin",
  "keith", "kenneth", "kevin", "larry", "lawrence", "lee",
  "leonard", "leslie", "lloyd", "lonnie", "louis", "manuel",
  "marc", "marco", "marcus", "mario", "mark", "marshall",
  "martin", "marvin", "melvin", "miguel", "mike", "mitchell",
  "nathan", "nicholas", "norman", "oscar", "patrick", "paul",
  "pedro", "perry", "peter", "philip", "phillip", "ralph",
  "randall", "randy", "raymond", "ricardo", "richard", "rick",
  "ricky", "robert", "roberto", "rodney", "roger", "roland",
  "ronald", "ronnie", "ross", "roy", "ruben", "russell",
  "ryan", "samuel", "scott", "sean", "shane", "shawn",
  "sidney", "stanley", "stephen", "steve", "steven", "terrance",
  "terry", "thomas", "timothy", "todd", "tommy", "tony",
  "travis", "troy", "tyler", "vernon", "victor", "vincent",
  "walter", "warren", "wayne", "wesley", "william", "willie",
  "winston", "zachary", "aaron", "adam", "adrian", "alan",
  "alex", "alexander", "andre", "andres", "anthony", "antonio",
  "armando", "arnold", "arturo", "austin", "barry", "benjamin",
  "bennie", "bradley", "brandon", "brendan", "brett", "brian",
  "bryan", "byron", "caleb", "calvin", "cameron", "carey",
  "casey", "cedric", "cesar", "chad", "charles", "chris",
  "christian", "christopher", "claude", "clayton", "clifton",
  "clint", "cody", "colin", "corey", "cornelius", "dallas",
  "damian", "damien", "dana", "danny", "darin", "darnell",
  "darren", "darryl", "dave", "david", "dean", "delbert",
  "derek", "derrick", "devin", "dewayne", "dexter", "diego",
  "dion", "dominick", "dominique", "don", "donnie", "doug",
  "drew", "duane", "dustin", "dwayne", "dwight", "dylan",
  "earnest", "ed", "edgar", "eduardo", "elbert", "elijah",
  "ellis", "elmer", "emilio", "enrique", "eric", "erik",
  "ernie", "esteban", "ethan", "eugene", "evan", "everett",
  "felipe", "felix", "fernando", "fidel", "forrest", "frankie",
  "francis", "francisco", "franklin", "frederick", "gabriel",
  "garrett", "gary", "gavin", "gilbert", "gilberto", "glen",
  "graham", "grant", "greg", "guadalupe", "guillermo", "gustavo",
  "guy", "hector", "herbert", "homer", "hugh", "ian",
  "isaac", "isaiah", "israel", "ivan", "jackie", "jacques",
  "jaime", "jake", "jamal", "jamie", "javier", "jay",
  "jeff", "jeffery", "jeremiah", "jerome", "jesus", "jim",
  "jimmie", "joaquin", "jody", "joey", "johnathan", "johnnie",
  "johnpaul", "jon", "jorge", "josef", "josh", "julian",
  "julio", "justin", "karl", "kendall", "kent", "kerry",
  "kevin", "kirk", "kristopher", "kyle", "lamar", "lance",
  "landon", "larry", "latoya", "leandro", "leo", "leon",
  "leroy", "lester", "levi", "liam", "linwood", "lionel",
  "logan", "loren", "lorenzo", "louie", "lowell", "lucas",
  "luis", "luke", "mack", "malcolm", "manuel", "marcos",
  "marcus", "mario", "marion", "marlon", "marshall", "marty",
  "marvin", "mason", "mathew", "matt", "maurice", "max",
  "maxwell", "melvin", "merle", "micah", "michael", "mickey",
  "miguel", "mike", "miles", "milton", "mitchell", "moises",
  "monte", "morgan", "morris", "moses", "muhammad", "myron",
  "nathaniel", "neal", "nelson", "nicholas", "nick", "nicolas",
  "noah", "noel", "nolan", "norbert", "oliver", "omar",
  "orlando", "owen", "pablo", "parker", "pedro", "percy",
  "phil", "phillip", "pierre", "preston", "quincy", "rafael",
  "ralph", "ramon", "randal", "randolph", "raphael", "raul",
  "ray", "reed", "reggie", "reginald", "reid", "rene",
  "reuben", "rex", "reyes", "ricardo", "rickie", "ricky",
  "rigoberto", "robert", "roberto", "rocky", "rodolfo", "rodrick",
  "rodrigo", "rogelio", "roland", "rolando", "roman", "ron",
  "ronny", "roosevelt", "rory", "roscoe", "ruben", "rudolph",
  "rudy", "rufus", "russ", "rusty", "salvador", "sam",
  "sammie", "sammy", "santiago", "santos", "saul", "scottie",
  "sean", "sergio", "seth", "shannon", "shaun", "shawn",
  "sheldon", "shelton", "sherman", "simon", "solomon", "sonny",
  "spencer", "stan", "stefan", "stephon", "sterling", "steve",
  "stuart", "sylvester", "tanner", "taylor", "ted", "terence",
  "terrell", "terrence", "thaddeus", "theodore", "thomas",
  "tim", "timmy", "titus", "tobias", "tom", "tony",
  "tracey", "trent", "trevor", "tristan", "troy", "ty",
  "tyrone", "tyrone", "ulysses", "vern", "vernon", "vicente",
  "victor", "vince", "virgil", "wade", "wallace", "wally",
  "walt", "warren", "wilbert", "wilbur", "wilfred", "will",
  "willard", "william", "willis", "wilson", "winston", "woodrow",
  "xavier", "zachariah", "zachary", "zane"
]);

/**
 * Common keyboard patterns (horizontal, vertical, and diagonal).
 * Used to detect sequential keyboard walks like "qwerty" or "asdf".
 */
const KEYBOARD_PATTERNS = [
  "qwertyuiop", "asdfghjkl", "zxcvbnm",
  "poiuytrewq", "lkjhgfdsa", "mnbvcxz",
  "1234567890", "0987654321",
  "1qaz2wsx", "zaq1xsw2", "qazwsx", "wsxedc",
  "edcrfv", "rfvtgb", "tgbnhy", "yhnujm",
  "ujmik", "ik,ol", "ol.p", "pl,okm",
  "1q2w3e4r5t", "q1w2e3r4t5", "1qazxsw2",
  "zaq12wsx", "qazwsxedc", "qweasdzxc",
  "1qaz2wsx3edc", "qazwsxedcrfv",
  "zxcasdqwe", "xsw2zaq1", "wsxzaq1",
  "plmoknijb", "plokmijn", "okmijn",
  "qwe", "wer", "ert", "rty", "tyu", "yui", "uio", "iop",
  "asd", "sdf", "dfg", "fgh", "ghj", "hjk", "jkl",
  "zxc", "xcv", "cvb", "vbn", "bnm",
  "123", "234", "345", "456", "567", "678", "789", "890",
  "321", "432", "543", "654", "765", "876", "987", "098",
  "qaz", "wsx", "edc", "rfv", "tgb", "yhn", "ujm", "ik,",
  "zaq", "xsw", "cde", "vfr", "bgt", "nhy", "mju", ",ki"
];

/**
 * A curated list of common English words (and leet-speak variants)
 * frequently used in passwords. This lets the analyzer flag passwords
 * based on dictionary words even when substitutions are used.
 *
 * SECURITY NOTE: This is NOT a cracking dictionary. It is a small
 * educational list used only to flag human-chosen word patterns.
 */
const COMMON_WORDS = new Set([
  "summer", "winter", "spring", "autumn", "football", "baseball",
  "basketball", "soccer", "hockey", "tennis", "guitar", "piano",
  "coffee", "mountain", "troubadour", "troubador", "monkey",
  "dragon", "mustang", "captain", "princess", "superman", "batman",
  "spiderman", "pokemon", "naruto", "starwars", "cheese", "pepper",
  "chocolate", "cookie", "banana", "orange", "purple", "yellow",
  "green", "silver", "golden", "shadow", "thunder", "lightning",
  "flower", "garden", "forest", "ocean", "river", "sunshine",
  "rainbow", "snowflake", "angel", "knight", "warrior", "ninja",
  "samurai", "tiger", "lion", "eagle", "shark", "whale", "dolphin",
  "penguin", "elephant", "giraffe", "zebra", "rabbit", "bunny",
  "kitten", "puppy", "hunter", "jordan", "michael", "jennifer",
  "jessica", "daniel", "ashley", "andrew", "matthew", "joshua",
  "charlie", "bailey", "sophie", "olivia", "isabella", "victoria",
  "charlotte", "ranger", "rocket", "freedom", "justice", "victory",
  "secret", "master", "welcome", "love", "honey", "correct", "horse",
  "battery", "staple", "google", "apple", "mango", "cherry"
]);

/**
 * Character class definitions used for entropy estimation.
 * Each class contributes to the "pool size" used in the
 * entropy formula: entropy = length * log2(pool_size).
 */
const CHAR_CLASSES = {
  lower: /[a-z]/,
  upper: /[A-Z]/,
  digit: /[0-9]/,
  symbol: /[^a-zA-Z0-9\s]/, // any non-alphanumeric, non-space character
  space: /\s/
};

/**
 * Estimate the entropy of a password in bits.
 *
 * Formula: entropy_bits = length * log2(pool_size)
 * where pool_size is the number of possible characters based on
 * which character classes are present.
 *
 * IMPORTANT: This is a simplified estimate. Real-world entropy
 * depends on how the password was generated (random vs. human
 * chosen). Human-chosen passwords have far less entropy than
 * their length suggests because people use words and patterns.
 *
 * @param {string} password - The password to estimate.
 * @returns {number} Estimated entropy in bits.
 */
function estimateEntropy(password) {
  if (!password) return 0;

  let poolSize = 0;
  if (CHAR_CLASSES.lower.test(password)) poolSize += 26;
  if (CHAR_CLASSES.upper.test(password)) poolSize += 26;
  if (CHAR_CLASSES.digit.test(password)) poolSize += 10;
  if (CHAR_CLASSES.symbol.test(password)) poolSize += 33; // common printable symbols
  if (CHAR_CLASSES.space.test(password)) poolSize += 1;

  if (poolSize === 0) return 0;

  // entropy = length * log2(pool_size)
  return Math.round(password.length * Math.log2(poolSize) * 10) / 10;
}

/**
 * Check if the password is in the common weak password list.
 * The comparison is case-insensitive and also checks with common
 * digit suffixes (e.g., "password1", "password123").
 *
 * @param {string} password - The password to check.
 * @returns {boolean} True if the password is common/weak.
 */
function isCommonPassword(password) {
  const lower = password.toLowerCase();

  // Direct match
  if (COMMON_PASSWORDS.has(lower)) return true;

  // Check with common numeric/symbol suffixes stripped
  const stripped = lower.replace(/[0-9!@#$%^&*]+$/, "");
  if (COMMON_PASSWORDS.has(stripped) && stripped.length >= 4) return true;

  // Check if it's a common word with a single digit appended
  const withoutTrailingDigit = lower.replace(/[0-9]$/, "");
  if (COMMON_PASSWORDS.has(withoutTrailingDigit) && withoutTrailingDigit.length >= 4) return true;

  return false;
}

/**
 * Normalize leet-speak substitutions to plain letters.
 * Examples: "p@ssw0rd" → "password", "Tr0ub4dor" → "troubador".
 * This is used by the dictionary-word check to catch human-chosen
 * passwords that use number/symbol substitutions.
 *
 * @param {string} str - The string to normalize.
 * @returns {string} Lowercase string with leet substitutions mapped.
 */
function leetNormalize(str) {
  return str
    .toLowerCase()
    .replace(/0/g, "o")
    .replace(/1/g, "l")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/@/g, "a")
    .replace(/\$/g, "s")
    .replace(/!/g, "i");
}

/**
 * Detect a dictionary word inside the password (after leet-normalization).
 * Only words of length >= 4 are considered, to avoid false positives
 * from short common fragments like "the" or "and".
 *
 * @param {string} password - The password to check.
 * @returns {string|null} The matched word, or null.
 */
function detectDictionaryWord(password) {
  if (password.length < 4) return null;

  // Normalize leet substitutions, then keep only letters
  const normalized = leetNormalize(password).replace(/[^a-z]/g, "");

  // Try the longest matches first (max word length we track is 12)
  for (let len = Math.min(12, normalized.length); len >= 4; len--) {
    for (let i = 0; i <= normalized.length - len; i++) {
      const sub = normalized.slice(i, i + len);
      if (COMMON_WORDS.has(sub)) {
        return sub;
      }
    }
  }

  return null;
}

/**
 * Detect sequential characters in the password.
 * This checks for:
 *   - Alphabetical sequences: "abc", "xyz", "cba"
 *   - Numeric sequences: "123", "987", "135" (odd/even steps)
 *   - Keyboard patterns: "qwerty", "asdf", "1qaz"
 *
 * @param {string} password - The password to check.
 * @returns {Array<{pattern: string, length: number}>} Detected sequences.
 */
function detectSequences(password) {
  const lower = password.toLowerCase();
  const found = [];

  // Check keyboard patterns (case-insensitive)
  for (const pattern of KEYBOARD_PATTERNS) {
    if (pattern.length >= 3 && lower.includes(pattern)) {
      found.push({ pattern, length: pattern.length });
    }
  }

  // Check alphabetical sequences (forward and backward)
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  for (let len = 3; len <= 6; len++) {
    for (let i = 0; i <= alphabet.length - len; i++) {
      const seq = alphabet.slice(i, i + len);
      if (lower.includes(seq)) {
        found.push({ pattern: seq, length: len });
      }
      // Backward sequence
      const rev = seq.split("").reverse().join("");
      if (lower.includes(rev)) {
        found.push({ pattern: rev, length: len });
      }
    }
  }

  // Check numeric sequences (forward, backward, and step patterns)
  const digits = "0123456789";
  for (let len = 3; len <= 6; len++) {
    for (let i = 0; i <= digits.length - len; i++) {
      const seq = digits.slice(i, i + len);
      if (lower.includes(seq)) {
        found.push({ pattern: seq, length: len });
      }
      const rev = seq.split("").reverse().join("");
      if (lower.includes(rev)) {
        found.push({ pattern: rev, length: len });
      }
    }
  }

  // Check step patterns like 1357, 2468, 147, 258, 369
  const stepPatterns = ["1357", "2468", "147", "258", "369", "159", "951", "7531", "8642"];
  for (const pattern of stepPatterns) {
    if (lower.includes(pattern)) {
      found.push({ pattern, length: pattern.length });
    }
  }

  // Deduplicate by pattern string
  const unique = [];
  const seen = new Set();
  for (const item of found) {
    if (!seen.has(item.pattern)) {
      seen.add(item.pattern);
      unique.push(item);
    }
  }

  return unique;
}

/**
 * Detect repeated characters or repeated substrings.
 * Examples: "aaa", "ababab", "abcabcabc"
 *
 * @param {string} password - The password to check.
 * @returns {Array<{char: string, count: number}>} Repeated character info.
 */
function detectRepeats(password) {
  const repeats = [];

  // Count character frequencies
  const freq = {};
  for (const ch of password) {
    freq[ch] = (freq[ch] || 0) + 1;
  }

  // Find characters repeated 3+ times
  for (const [ch, count] of Object.entries(freq)) {
    if (count >= 3) {
      repeats.push({ char: ch, count });
    }
  }

  // Detect repeated substrings (e.g., "abab", "abcabc")
  const lower = password.toLowerCase();
  for (let len = 2; len <= Math.floor(password.length / 2); len++) {
    for (let i = 0; i <= password.length - len * 2; i++) {
      const sub = lower.slice(i, i + len);
      const next = lower.slice(i + len, i + len * 2);
      if (sub === next) {
        repeats.push({ char: `"${sub}"`, count: 2 });
      }
    }
  }

  // Deduplicate
  const unique = [];
  const seen = new Set();
  for (const item of repeats) {
    const key = `${item.char}-${item.count}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  }

  return unique;
}

/**
 * Count how many character classes are present in the password.
 * @param {string} password - The password to check.
 * @returns {number} Number of character classes (0-4).
 */
function countCharClasses(password) {
  let classes = 0;
  if (CHAR_CLASSES.lower.test(password)) classes++;
  if (CHAR_CLASSES.upper.test(password)) classes++;
  if (CHAR_CLASSES.digit.test(password)) classes++;
  if (CHAR_CLASSES.symbol.test(password)) classes++;
  return classes;
}

/**
 * Check if the password contains only one character class.
 * @param {string} password - The password to check.
 * @returns {boolean} True if only one character class is present.
 */
function isSingleClass(password) {
  return countCharClasses(password) <= 1;
}

/**
 * Check if the password contains a date-like pattern.
 * This includes full-date formats AND embedded years (19xx/20xx),
 * because people often append their birth year to a password.
 *
 * @param {string} password - The password to check.
 * @returns {boolean} True if the password looks like a date or contains a year.
 */
function isDateLike(password) {
  // Detects a 4-digit year (1990, 2024) embedded anywhere in the password
  if (/(?:19|20)\d{2}/.test(password)) return true;

  // Full date formats
  const datePatterns = [
    /^(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(19|20)\d{2}$/, // MMDDYYYY
    /^(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])(19|20)\d{2}$/, // DDMMYYYY
    /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/, // YYYYMMDD
    /^(0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])[-/](19|20)\d{2}$/, // MM-DD-YYYY
    /^(0[1-9]|[12]\d|3[01])[-/](0[1-9]|1[0-2])[-/](19|20)\d{2}$/  // DD-MM-YYYY
  ];
  return datePatterns.some((re) => re.test(password));
}

/**
 * Check if the password is a simple keyboard walk (e.g., "qwerty").
 * @param {string} password - The password to check.
 * @returns {boolean} True if the password is a keyboard walk.
 */
function isKeyboardWalk(password) {
  const lower = password.toLowerCase();
  return KEYBOARD_PATTERNS.some((pattern) => pattern.length >= 4 && lower.includes(pattern));
}

/**
 * Map a raw score to a strength level.
 * @param {number} score - Score from 0-100.
 * @returns {string} Strength level label.
 */
function scoreToLevel(score) {
  if (score < 20) return "Very Weak";
  if (score < 40) return "Weak";
  if (score < 60) return "Medium";
  if (score < 80) return "Strong";
  return "Very Strong";
}

/**
 * The main analysis function.
 * Runs all security checks and produces a detailed report.
 *
 * SCORING MODEL:
 *   The base score is additive (max 105, capped at 100), then hard
 *   caps are applied. A "cap" sets an absolute maximum score when a
 *   critical weakness is detected. This ensures that a password can
 *   never score "Strong" if it is, for example, a common password
 *   or a keyboard walk, no matter how many other checks it passes.
 *
 * @param {string} password - The password to analyze.
 * @returns {Object} Analysis report with checks, score, strength, entropy, and suggestions.
 */
function analyzePassword(password) {
  // Guard against empty input
  if (!password) {
    return {
      score: 0,
      strength: "Not analyzed",
      entropy: 0,
      checks: [],
      suggestions: [],
      passedCount: 0,
      totalChecks: 0
    };
  }

  const length = password.length;
  const checks = [];
  const suggestions = [];

  /* ---------- CHECK 1: Minimum Length ---------- */
  // Length is the single most important factor in password strength.
  // We use a graduated scale: 8+ is minimum, 12+ is good, 16+ is excellent.
  if (length >= 16) {
    checks.push({ id: "length", label: "Length", detail: `${length} characters (excellent)`, pass: true });
  } else if (length >= 12) {
    checks.push({ id: "length", label: "Length", detail: `${length} characters (good)`, pass: true });
  } else if (length >= 8) {
    checks.push({ id: "length", label: "Length", detail: `${length} characters (minimum)`, pass: true, warn: true });
    suggestions.push("Increase length to at least 12 characters; 16+ is recommended.");
  } else {
    checks.push({ id: "length", label: "Length", detail: `${length} characters (too short)`, pass: false });
    suggestions.push("Use at least 12 characters; longer passwords are exponentially harder to crack.");
  }

  /* ---------- CHECK 2: Uppercase Letters ---------- */
  const hasUpper = CHAR_CLASSES.upper.test(password);
  checks.push({
    id: "upper",
    label: "Uppercase letters",
    detail: hasUpper ? "Present" : "Missing",
    pass: hasUpper
  });
  if (!hasUpper) {
    suggestions.push("Add uppercase letters (A-Z) to increase variety.");
  }

  /* ---------- CHECK 3: Lowercase Letters ---------- */
  const hasLower = CHAR_CLASSES.lower.test(password);
  checks.push({
    id: "lower",
    label: "Lowercase letters",
    detail: hasLower ? "Present" : "Missing",
    pass: hasLower
  });
  if (!hasLower) {
    suggestions.push("Add lowercase letters (a-z) to increase variety.");
  }

  /* ---------- CHECK 4: Numbers ---------- */
  const hasDigit = CHAR_CLASSES.digit.test(password);
  checks.push({
    id: "digit",
    label: "Numbers",
    detail: hasDigit ? "Present" : "Missing",
    pass: hasDigit
  });
  if (!hasDigit) {
    suggestions.push("Add numbers (0-9) to increase variety.");
  }

  /* ---------- CHECK 5: Special Characters ---------- */
  const hasSymbol = CHAR_CLASSES.symbol.test(password);
  checks.push({
    id: "symbol",
    label: "Special characters",
    detail: hasSymbol ? "Present" : "Missing",
    pass: hasSymbol
  });
  if (!hasSymbol) {
    suggestions.push("Add special characters (!@#$%^&*) to increase variety.");
  }

  /* ---------- CHECK 6: Repeated Characters ---------- */
  const repeats = detectRepeats(password);
  const hasRepeats = repeats.length > 0;
  if (hasRepeats) {
    const repeatDetail = repeats
      .slice(0, 3)
      .map((r) => `${r.char} x${r.count}`)
      .join(", ");
    checks.push({
      id: "repeats",
      label: "Repeated characters",
      detail: `Found: ${repeatDetail}`,
      pass: false
    });
    suggestions.push("Avoid repeating characters or patterns (e.g., 'aaa', 'abab').");
  } else {
    checks.push({ id: "repeats", label: "Repeated characters", detail: "None found", pass: true });
  }

  /* ---------- CHECK 7: Common / Weak Password Patterns ---------- */
  const isCommon = isCommonPassword(password);
  if (isCommon) {
    checks.push({
      id: "common",
      label: "Common password",
      detail: "This is a commonly used, easily guessed password",
      pass: false
    });
    suggestions.push("This password appears in common weak-password lists. Choose something unique and random.");
  } else {
    checks.push({ id: "common", label: "Common password", detail: "Not in common list", pass: true });
  }

  /* ---------- CHECK 8: Sequential Characters ---------- */
  const sequences = detectSequences(password);
  const hasSequences = sequences.length > 0;
  if (hasSequences) {
    const seqDetail = sequences
      .slice(0, 3)
      .map((s) => `"${s.pattern}"`)
      .join(", ");
    checks.push({
      id: "sequential",
      label: "Sequential characters",
      detail: `Found: ${seqDetail}`,
      pass: false
    });
    suggestions.push("Avoid sequential patterns like '1234', 'abcd', or keyboard walks like 'qwerty'.");
  } else {
    checks.push({ id: "sequential", label: "Sequential characters", detail: "None found", pass: true });
  }

  /* ---------- CHECK 9: Date-like Patterns ---------- */
  const isDate = isDateLike(password);
  if (isDate) {
    checks.push({
      id: "date",
      label: "Date-like pattern",
      detail: "Contains a year or date (e.g., 1990, 2024)",
      pass: false
    });
    suggestions.push("Avoid using dates or years (birthdays, anniversaries) — these are easy to guess from public info.");
  } else {
    checks.push({ id: "date", label: "Date-like pattern", detail: "None detected", pass: true });
  }

  /* ---------- CHECK 10: Character Variety ---------- */
  const numClasses = countCharClasses(password);
  const singleClass = isSingleClass(password);
  if (singleClass && length >= 4) {
    checks.push({
      id: "variety",
      label: "Character variety",
      detail: "Uses only one character type",
      pass: false
    });
    suggestions.push("Mix multiple character types (upper, lower, numbers, symbols) for better variety.");
  } else {
    checks.push({ id: "variety", label: "Character variety", detail: `${numClasses} character type(s)`, pass: true });
  }

  /* ---------- CHECK 11: Keyboard Walk ---------- */
  const keyboardWalk = isKeyboardWalk(password);
  if (keyboardWalk) {
    checks.push({
      id: "keyboard",
      label: "Keyboard pattern",
      detail: "Contains a keyboard walk (e.g., 'qwerty', 'asdf')",
      pass: false
    });
    suggestions.push("Avoid keyboard patterns like 'qwerty' or 'asdf' — they are among the first guesses attackers try.");
  } else {
    checks.push({ id: "keyboard", label: "Keyboard pattern", detail: "None detected", pass: true });
  }

  /* ---------- CHECK 12: Dictionary Word ---------- */
  // Detects common English words (including leet-speak substitutions)
  // that dominate the password. Human-chosen words are far easier
  // to guess than random strings of the same length.
  const dictWord = detectDictionaryWord(password);
  const hasDictWord = dictWord !== null && (dictWord.length / length) >= 0.4 && length < 16;
  if (hasDictWord) {
    checks.push({
      id: "dictionary",
      label: "Dictionary word",
      detail: `Contains common word "${dictWord}"`,
      pass: false
    });
    suggestions.push("Avoid single dictionary words — attackers use word lists. A random string or a long passphrase of multiple random words is stronger.");
  } else {
    checks.push({ id: "dictionary", label: "Dictionary word", detail: "None detected", pass: true });
  }

  /* ---------- SCORING ---------- */

  // --- Base additive score (max 105, capped to 100) ---

  // Length contributes up to 25 points
  let score = 0;
  if (length >= 16) score += 25;
  else if (length >= 12) score += 20;
  else if (length >= 8) score += 12;

  // Character variety: 5 points per class present
  if (hasLower) score += 5;
  if (hasUpper) score += 5;
  if (hasDigit) score += 5;
  if (hasSymbol) score += 5;

  // Variety bonus: +5 if more than one class
  if (!singleClass) score += 5;

  // No repeats: +10
  if (!hasRepeats) score += 10;

  // Not common: +10
  if (!isCommon) score += 10;

  // No sequences: +10
  if (!hasSequences) score += 10;

  // No keyboard walk: +10
  if (!keyboardWalk) score += 10;

  // Not date-like: +5
  if (!isDate) score += 5;

  // No dictionary word: +10
  if (!hasDictWord) score += 10;

  score = Math.min(score, 100);

  // --- Hard caps ---
  // A cap sets the absolute maximum score. These ensure that a
  // password with a critical weakness can never reach a higher
  // strength level, regardless of other positive factors.

  // Critically short passwords
  if (length >= 1 && length <= 3) score = Math.min(score, 10);   // Very Weak
  else if (length >= 4 && length <= 7) score = Math.min(score, 24); // Weak max

  // Short-ish passwords (8-11) should not reach Very Strong
  if (length >= 8 && length <= 11) score = Math.min(score, 79);  // Strong max

  // Critical weakness caps
  if (isCommon) score = Math.min(score, 15);            // Very Weak max
  if (hasSequences) score = Math.min(score, 34);        // Weak max
  if (keyboardWalk) score = Math.min(score, 29);        // Weak max
  if (hasRepeats) score = Math.min(score, 49);          // Medium max
  if (hasDictWord) score = Math.min(score, 49);         // Medium max
  if (isDate) score = Math.min(score, 44);              // Medium max
  if (singleClass) score = Math.min(score, 39);         // Weak max

  // Character-class caps: fewer classes means smaller search space
  if (numClasses === 1) score = Math.min(score, 39);    // Weak max
  else if (numClasses === 2) score = Math.min(score, 69); // Strong max
  else if (numClasses === 3) score = Math.min(score, 84); // Very Strong max

  /* ---------- STRENGTH LEVEL ---------- */
  const strength = scoreToLevel(score);

  /* ---------- ENTROPY ---------- */
  const entropy = estimateEntropy(password);

  /* ---------- FINAL SUGGESTIONS ---------- */
  // Add a general suggestion if the password is strong but could be better
  if (strength === "Strong" && length < 16 && !isCommon) {
    suggestions.push("Consider lengthening to 16+ characters for 'Very Strong' status.");
  }

  // Deduplicate suggestions
  const uniqueSuggestions = [...new Set(suggestions)];

  // Count passed checks
  const passedCount = checks.filter((c) => c.pass).length;

  return {
    score,
    strength,
    entropy,
    checks,
    suggestions: uniqueSuggestions,
    passedCount,
    totalChecks: checks.length
  };
}

// Expose the analyzer globally (used by app.js)
window.PasswordAnalyzer = {
  analyze: analyzePassword,
  estimateEntropy: estimateEntropy
};