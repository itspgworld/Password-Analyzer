"""============================================================
Verification Script (Python port) - Mirrors the JS analyzer
scoring logic exactly to verify expected scores/strength levels.

This is a LOCAL, offline verification tool. It contains no
network access and no real user passwords. It exists solely to
confirm the JS analyzer produces pedagogically correct results.
============================================================"""

import math
import re

# --- Mirror of COMMON_PASSWORDS (subset needed for tests) ---
COMMON_PASSWORDS = {
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
    "summer", "winter", "spring", "autumn", "hockey", "tennis",
    "guitar", "piano", "coffee", "mountain", "troubadour", "troubador",
    "mustang", "captain", "spiderman", "pokemon", "naruto", "starwars",
    "cheese", "pepper", "chocolate", "cookie", "banana", "orange",
    "purple", "yellow", "green", "silver", "golden", "thunder",
    "lightning", "flower", "garden", "forest", "ocean", "river",
    "rainbow", "snowflake", "angel", "knight", "warrior", "ninja",
    "samurai", "tiger", "lion", "eagle", "shark", "whale", "dolphin",
    "penguin", "elephant", "giraffe", "zebra", "rabbit", "bunny",
    "kitten", "puppy", "hunter", "jordan", "michael", "jennifer",
    "jessica", "daniel", "ashley", "andrew", "matthew", "joshua",
    "charlie", "bailey", "sophie", "olivia", "isabella", "victoria",
    "charlotte", "ranger", "rocket", "justice", "victory",
    "secret", "honey", "correct", "horse", "battery", "staple",
    "apple", "mango", "cherry", "baseball1", "football1"
}

# --- Mirror of KEYBOARD_PATTERNS (full list) ---
KEYBOARD_PATTERNS = [
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
]

# --- Mirror of COMMON_WORDS ---
COMMON_WORDS = {
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
}


def estimate_entropy(password):
    if not password:
        return 0
    pool = 0
    if re.search(r"[a-z]", password): pool += 26
    if re.search(r"[A-Z]", password): pool += 26
    if re.search(r"[0-9]", password): pool += 10
    if re.search(r"[^a-zA-Z0-9\s]", password): pool += 33
    if re.search(r"\s", password): pool += 1
    if pool == 0:
        return 0
    return round(len(password) * math.log2(pool) * 10) / 10


def is_common_password(password):
    lower = password.lower()
    if lower in COMMON_PASSWORDS:
        return True
    stripped = re.sub(r"[0-9!@#$%^&*]+$", "", lower)
    if stripped in COMMON_PASSWORDS and len(stripped) >= 4:
        return True
    without = re.sub(r"[0-9]$", "", lower)
    if without in COMMON_PASSWORDS and len(without) >= 4:
        return True
    return False


def leet_normalize(s):
    return (s.lower()
            .replace("0", "o").replace("1", "l").replace("3", "e")
            .replace("4", "a").replace("5", "s").replace("7", "t")
            .replace("@", "a").replace("$", "s").replace("!", "i"))


def detect_dictionary_word(password):
    if len(password) < 4:
        return None
    normalized = re.sub(r"[^a-z]", "", leet_normalize(password))
    for ln in range(min(12, len(normalized)), 3, -1):
        for i in range(len(normalized) - ln + 1):
            sub = normalized[i:i + ln]
            if sub in COMMON_WORDS:
                return sub
    return None


def detect_sequences(password):
    lower = password.lower()
    found = set()
    for pattern in KEYBOARD_PATTERNS:
        if len(pattern) >= 3 and pattern in lower:
            found.add(pattern)
    alphabet = "abcdefghijklmnopqrstuvwxyz"
    for ln in range(3, 7):
        for i in range(len(alphabet) - ln + 1):
            seq = alphabet[i:i + ln]
            if seq in lower: found.add(seq)
            rev = seq[::-1]
            if rev in lower: found.add(rev)
    digits = "0123456789"
    for ln in range(3, 7):
        for i in range(len(digits) - ln + 1):
            seq = digits[i:i + ln]
            if seq in lower: found.add(seq)
            rev = seq[::-1]
            if rev in lower: found.add(rev)
    for pattern in ["1357", "2468", "147", "258", "369", "159", "951", "7531", "8642"]:
        if pattern in lower:
            found.add(pattern)
    return list(found)


def detect_repeats(password):
    repeats = []
    freq = {}
    for ch in password:
        freq[ch] = freq.get(ch, 0) + 1
    for ch, count in freq.items():
        if count >= 3:
            repeats.append((ch, count))
    lower = password.lower()
    for ln in range(2, len(password) // 2 + 1):
        for i in range(len(password) - ln * 2 + 1):
            sub = lower[i:i + ln]
            nxt = lower[i + ln:i + ln * 2]
            if sub == nxt:
                repeats.append((f'"{sub}"', 2))
    return list(set(repeats))


def count_char_classes(password):
    c = 0
    if re.search(r"[a-z]", password): c += 1
    if re.search(r"[A-Z]", password): c += 1
    if re.search(r"[0-9]", password): c += 1
    if re.search(r"[^a-zA-Z0-9\s]", password): c += 1
    return c


def is_single_class(password):
    return count_char_classes(password) <= 1


def is_date_like(password):
    if re.search(r"(?:19|20)\d{2}", password):
        return True
    date_patterns = [
        r"^(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(19|20)\d{2}$",
        r"^(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])(19|20)\d{2}$",
        r"^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$",
        r"^(0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])[-/](19|20)\d{2}$",
        r"^(0[1-9]|[12]\d|3[01])[-/](0[1-9]|1[0-2])[-/](19|20)\d{2}$"
    ]
    return any(re.match(p, password) for p in date_patterns)


def is_keyboard_walk(password):
    lower = password.lower()
    return any(len(p) >= 4 and p in lower for p in KEYBOARD_PATTERNS)


def score_to_level(score):
    if score < 20: return "Very Weak"
    if score < 40: return "Weak"
    if score < 60: return "Medium"
    if score < 80: return "Strong"
    return "Very Strong"


def analyze(password):
    if not password:
        return {"score": 0, "strength": "Not analyzed", "entropy": 0}

    length = len(password)
    has_upper = bool(re.search(r"[A-Z]", password))
    has_lower = bool(re.search(r"[a-z]", password))
    has_digit = bool(re.search(r"[0-9]", password))
    has_symbol = bool(re.search(r"[^a-zA-Z0-9\s]", password))
    repeats = detect_repeats(password)
    has_repeats = len(repeats) > 0
    is_common = is_common_password(password)
    sequences = detect_sequences(password)
    has_seq = len(sequences) > 0
    is_date = is_date_like(password)
    num_classes = count_char_classes(password)
    single_class = is_single_class(password)
    keyboard_walk = is_keyboard_walk(password)
    dict_word = detect_dictionary_word(password)
    has_dict = dict_word is not None and (len(dict_word) / length) >= 0.4 and length < 16

    score = 0
    if length >= 16: score += 25
    elif length >= 12: score += 20
    elif length >= 8: score += 12
    if has_lower: score += 5
    if has_upper: score += 5
    if has_digit: score += 5
    if has_symbol: score += 5
    if not single_class: score += 5
    if not has_repeats: score += 10
    if not is_common: score += 10
    if not has_seq: score += 10
    if not keyboard_walk: score += 10
    if not is_date: score += 5
    if not has_dict: score += 10
    score = min(score, 100)

    if 1 <= length <= 3: score = min(score, 10)
    elif 4 <= length <= 7: score = min(score, 24)
    if 8 <= length <= 11: score = min(score, 79)
    if is_common: score = min(score, 15)
    if has_seq: score = min(score, 34)
    if keyboard_walk: score = min(score, 29)
    if has_repeats: score = min(score, 49)
    if has_dict: score = min(score, 49)
    if is_date: score = min(score, 44)
    if single_class: score = min(score, 39)
    if num_classes == 1: score = min(score, 39)
    elif num_classes == 2: score = min(score, 69)
    elif num_classes == 3: score = min(score, 84)

    return {"score": score, "strength": score_to_level(score),
            "entropy": estimate_entropy(password)}


# --- Test cases ---
TEST_CASES = [
    ("123456", "Very Weak"), ("password", "Very Weak"), ("qwerty", "Very Weak"),
    ("abc123", "Very Weak"), ("111111", "Very Weak"), ("letmein", "Very Weak"),
    ("admin", "Very Weak"), ("a", "Very Weak"), ("123", "Very Weak"),
    ("password123", "Very Weak"), ("abc12345", "Weak"), ("qwerty123", "Weak"),
    ("iloveyou1", "Weak"), ("12345678a", "Weak"), ("password1", "Weak"),
    ("abcdefgh", "Weak"), ("1234567890", "Weak"), ("letmein123", "Weak"),
    ("welcome1", "Weak"), ("monkey123", "Weak"), ("Tr0ub4dor&3", "Medium"),
    ("P@ssw0rd2024!", "Weak"), ("Summer2024!", "Medium"), ("Football#1", "Medium"),
    ("CorrectHorse", "Medium"), ("aB3!eF7#", "Medium"), ("MyDogRex2024", "Medium"),
    ("qwerty!@#$", "Weak"), ("Password123!", "Very Weak"), ("Sunshine2023", "Medium"),
    ("CorrectHorseBatteryStaple", "Strong"), ("X9#kL2$mN8@vQ5", "Strong"),
    ("BlueElephant42!", "Strong"), ("KiteSurfing2024!", "Medium"),
    ("p@ssW0rd!sTr0ng", "Medium"), ("MountainBike#7", "Strong"),
    ("CoffeeLover99!", "Strong"), ("aB3!eF7#kL9$mN2", "Strong"),
    ("WinterSnowflake!", "Strong"), ("GuitarHero2024!", "Medium"),
    ("X9#kL2$mN8@vQ5!wR3", "Very Strong"), ("Tr0ub4dor&3Horse!", "Very Strong"),
    ("aB3!eF7#kL9$mN2@pQ5", "Very Strong"), ("K#9xL$2mN8@vQ5!wR3", "Very Strong"),
    ("P@ssw0rd!sN0tG00d!", "Very Strong"), ("Zx9!Qw3#Er5$Ty7@", "Very Strong"),
    ("M0untain!B1ke#R1de", "Very Strong"), ("C0ffee!L0ver#2024!", "Medium"),
    ("a1B2c3D4e5F6g7H8!", "Very Strong"), ("!Q@W#E$R%T^Y&U*I", "Very Strong"),
    ("", "Not analyzed"), (" ", "Very Weak"), ("aaaaaaaaaaaaaaaa", "Very Weak"),
    ("abababababababab", "Very Weak"), ("1990", "Very Weak"), ("01012000", "Very Weak"),
    ("12-25-1990", "Weak"), ("1qaz2wsx3edc", "Very Weak"), ("qazwsxedcrfv", "Very Weak"),
    ("13579", "Very Weak"), ("24680", "Very Weak"), ("Zx9!Qw3#Er5$Ty7@Uj1", "Very Strong"),
    ("passwordpassword", "Weak"), ("PASSWORD123", "Very Weak"), ("!@#$%^&*()", "Very Weak"),
]

pass_count = 0
fail_count = 0
print("=== PASSWORD STRENGTH ANALYZER - SCORE VERIFICATION (Python port) ===\n")
for pwd, expected in TEST_CASES:
    result = analyze(pwd)
    status = "PASS" if result["strength"] == expected else "FAIL"
    if status == "PASS":
        pass_count += 1
    else:
        fail_count += 1
    print(f'{status} | "{pwd}" | Expected: {expected} | Got: {result["strength"]} | Score: {result["score"]}/100 | Entropy: {result["entropy"]} bits')

print(f"\n=== RESULTS: {pass_count} passed, {fail_count} failed ===")
if fail_count > 0:
    print("\nFailed cases:")
    for pwd, expected in TEST_CASES:
        result = analyze(pwd)
        if result["strength"] != expected:
            print(f'  "{pwd}" -> expected {expected}, got {result["strength"]} (score {result["score"]})')