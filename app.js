/* ============================================================
   Password Strength Analyzer - UI Controller
   ------------------------------------------------------------
   SECURITY NOTE:
   - This module only manipulates the DOM. It never sends,
     stores, logs, or transmits the password.
   - No console.log of password values.
   - No localStorage/sessionStorage usage.
   - No URL parameters containing password data.
   ============================================================ */

"use strict";

/* ---------- DOM Element References ---------- */
const passwordInput = document.getElementById("password-input");
const togglePasswordBtn = document.getElementById("toggle-password");
const strengthLabel = document.getElementById("strength-label");
const entropyLabel = document.getElementById("entropy-label");
const meterFill = document.getElementById("meter-fill");
const meterTrack = document.querySelector(".meter-track");
const resultsSection = document.getElementById("results");
const resultsGrid = document.querySelector(".results-grid");
const suggestionsSection = document.getElementById("suggestions");
const suggestionsList = document.getElementById("suggestions-list");

// Generator elements
const genLengthInput = document.getElementById("gen-length");
const genLengthValue = document.getElementById("gen-length-value");
const genUpperCheck = document.getElementById("gen-upper");
const genLowerCheck = document.getElementById("gen-lower");
const genNumbersCheck = document.getElementById("gen-numbers");
const genSymbolsCheck = document.getElementById("gen-symbols");
const generateBtn = document.getElementById("generate-btn");
const generatedPasswordInput = document.getElementById("generated-password");
const copyPasswordBtn = document.getElementById("copy-password");

/* ---------- Strength Level Configuration ---------- */
// Maps strength levels to colors and meter widths.
// The meter width is a visual representation of the score.
const STRENGTH_CONFIG = {
  "Very Weak": { color: "#dc2626", width: 20 },
  "Weak": { color: "#ea580c", width: 40 },
  "Medium": { color: "#ca8a04", width: 60 },
  "Strong": { color: "#16a34a", width: 80 },
  "Very Strong": { color: "#059669", width: 100 },
  "Not analyzed": { color: "#64748b", width: 0 }
};

/* ---------- Helper: Escape HTML ---------- */
// Prevents any potential XSS if password contains HTML characters.
// Although we never inject the raw password into the DOM, this is
// a defense-in-depth measure.
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- Helper: Update Meter ---------- */
function updateMeter(strength, score) {
  const config = STRENGTH_CONFIG[strength] || STRENGTH_CONFIG["Not analyzed"];

  // Update the fill bar
  meterFill.style.width = `${config.width}%`;
  meterFill.style.backgroundColor = config.color;

  // Update the progressbar ARIA attributes
  meterTrack.setAttribute("aria-valuenow", String(score));
  meterTrack.setAttribute("aria-valuetext", `${strength} (${score}/100)`);

  // Update the label
  strengthLabel.textContent = `Strength: ${strength}`;
  strengthLabel.style.color = config.color;
}

/* ---------- Helper: Render Check Results ---------- */
function renderChecks(checks) {
  // Clear previous results
  resultsGrid.innerHTML = "";

  for (const check of checks) {
    const item = document.createElement("div");
    item.className = "check-item";

    // Determine pass/fail/warn styling
    if (check.pass && check.warn) {
      item.classList.add("warn");
    } else if (check.pass) {
      item.classList.add("pass");
    } else {
      item.classList.add("fail");
    }

    // Icon: checkmark, warning, or cross
    const icon = document.createElement("span");
    icon.className = "check-icon";
    icon.setAttribute("aria-hidden", "true");
    if (check.pass && check.warn) {
      icon.textContent = "!";
    } else if (check.pass) {
      icon.textContent = "\u2713"; // ✓
    } else {
      icon.textContent = "\u2717"; // ✗
    }

    // Text content
    const text = document.createElement("span");
    text.className = "check-text";
    text.innerHTML = `<strong>${escapeHtml(check.label)}:</strong> ${escapeHtml(check.detail)}`;

    item.appendChild(icon);
    item.appendChild(text);
    resultsGrid.appendChild(item);
  }
}

/* ---------- Helper: Render Suggestions ---------- */
function renderSuggestions(suggestions) {
  if (suggestions.length === 0) {
    suggestionsSection.hidden = true;
    suggestionsList.innerHTML = "";
    return;
  }

  suggestionsSection.hidden = false;
  suggestionsList.innerHTML = "";

  for (const suggestion of suggestions) {
    const li = document.createElement("li");
    li.textContent = suggestion;
    suggestionsList.appendChild(li);
  }
}

/* ---------- Main Analysis Handler ---------- */
function handlePasswordInput() {
  const password = passwordInput.value;

  // Empty input: reset the UI
  if (!password) {
    resultsSection.hidden = true;
    suggestionsSection.hidden = true;
    strengthLabel.textContent = "Strength: Not analyzed";
    strengthLabel.style.color = "";
    entropyLabel.textContent = "Entropy: \u2014";
    meterFill.style.width = "0%";
    meterFill.style.backgroundColor = "#64748b";
    meterTrack.setAttribute("aria-valuenow", "0");
    meterTrack.setAttribute("aria-valuetext", "Not analyzed");
    return;
  }

  // Run the analysis (all local, no network)
  const result = window.PasswordAnalyzer.analyze(password);

  // Update the UI
  updateMeter(result.strength, result.score);
  entropyLabel.textContent = `Entropy: ~${result.entropy} bits`;
  resultsSection.hidden = false;
  renderChecks(result.checks);
  renderSuggestions(result.suggestions);
}

/* ---------- Toggle Password Visibility ---------- */
function handleTogglePassword() {
  const isHidden = passwordInput.type === "password";

  // Toggle the input type
  passwordInput.type = isHidden ? "text" : "password";

  // Update the button state for accessibility
  togglePasswordBtn.setAttribute("aria-pressed", String(!isHidden));
  togglePasswordBtn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
}

/* ---------- Generator: Update Length Display ---------- */
function handleLengthChange() {
  const value = genLengthInput.value;
  genLengthValue.textContent = `${value} characters`;
  genLengthInput.setAttribute("aria-valuenow", value);
}

/* ---------- Generator: Generate Password ---------- */
function handleGenerate() {
  const length = parseInt(genLengthInput.value, 10);
  const options = {
    upper: genUpperCheck.checked,
    lower: genLowerCheck.checked,
    digits: genNumbersCheck.checked,
    symbols: genSymbolsCheck.checked
  };

  // Generate using crypto-secure randomness
  const password = window.PasswordGenerator.generate(length, options);

  // Display the generated password
  generatedPasswordInput.value = password;

  // Also run it through the analyzer so the user can see its strength
  passwordInput.value = password;
  handlePasswordInput();

  // Announce for screen readers
  strengthLabel.setAttribute("role", "status");
}

/* ---------- Generator: Copy to Clipboard ---------- */
async function handleCopy() {
  const password = generatedPasswordInput.value;

  if (!password) {
    return;
  }

  try {
    // Use the modern Clipboard API (requires secure context)
    await navigator.clipboard.writeText(password);

    // Visual feedback
    const originalLabel = copyPasswordBtn.getAttribute("aria-label");
    copyPasswordBtn.setAttribute("aria-label", "Copied!");
    copyPasswordBtn.textContent = "\u2713";

    // Reset after 2 seconds
    setTimeout(() => {
      copyPasswordBtn.setAttribute("aria-label", originalLabel);
      copyPasswordBtn.innerHTML = '<span class="toggle-icon" aria-hidden="true">&#128203;</span>';
    }, 2000);
  } catch (err) {
    // Fallback for older browsers / non-secure contexts
    // SECURITY NOTE: We use execCommand as a last resort. The password
    // is still only copied to the clipboard, never transmitted.
    try {
      generatedPasswordInput.select();
      document.execCommand("copy");
      copyPasswordBtn.setAttribute("aria-label", "Copied!");
      copyPasswordBtn.textContent = "\u2713";
      setTimeout(() => {
        copyPasswordBtn.setAttribute("aria-label", "Copy generated password to clipboard");
        copyPasswordBtn.innerHTML = '<span class="toggle-icon" aria-hidden="true">&#128203;</span>';
      }, 2000);
    } catch (fallbackErr) {
      // If clipboard access fails entirely, just select the text
      generatedPasswordInput.select();
    }
  }
}

/* ---------- Event Listeners ---------- */
passwordInput.addEventListener("input", handlePasswordInput);
togglePasswordBtn.addEventListener("click", handleTogglePassword);
genLengthInput.addEventListener("input", handleLengthChange);
generateBtn.addEventListener("click", handleGenerate);
copyPasswordBtn.addEventListener("click", handleCopy);

/* ---------- Initialize ---------- */
handleLengthChange();