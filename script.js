// -------------------------------
// PASSWORD ENTROPY FUNCTION
// -------------------------------
function calculateEntropy(password) {
  if (!password) return 0;

  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^A-Za-z0-9]/.test(password)) charsetSize += 33; // Common symbol set

  const entropy = password.length * Math.log2(charsetSize);
  return entropy;
}

// -------------------------------
// PASSWORD ANALYSIS FUNCTION
// -------------------------------
function analyzePassword(username, password) {
  const suggestions = [];
  const length = password.length;
  let score = 0;

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const common = [
    "123456","123456789","12345","12345678","1234","111111","123123","1234567",
    "qwerty","abc123","password","password1","admin","letmein","welcome","monkey",
    "login","princess","qwerty123","football","iloveyou","sunshine","starwars",
    "dragon","passw0rd","master","hello","freedom","whatever","trustno1","shadow",
    "killer","superman","batman","zaq1zaq1","123qwe","1q2w3e4r","qazwsx",
    "password123","admin123"
  ];

  if (!password) {
    return { score: 0, rating: "Start typing...", color: "#ddd", suggestions, entropy: 0 };
  }

  if (common.includes(password.toLowerCase())) {
    suggestions.push("Avoid common passwords.");
    return { score: 0, rating: "Weak", color: "red", suggestions, entropy: calculateEntropy(password) };
  }

  if (username) {
    const userPart = username.split("@")[0].toLowerCase();
    if (userPart && password.toLowerCase().includes(userPart)) {
      return {
        score: 0,
        rating: "Weak",
        color: "red",
        suggestions: ["Password should not contain or resemble your username."],
        entropy: calculateEntropy(password)
      };
    }
  }

  if (/(\w)\1{2,}/.test(password)) { score -= 10; suggestions.push("Avoid repeated characters."); }
  if (/(1234|abcd|qwerty)/i.test(password)) { score -= 10; suggestions.push("Avoid predictable sequences."); }
  if (/(19|20)\d{2}/.test(password)) { score -= 10; suggestions.push("Avoid using years."); }

  if (length >= 8) score += 25;
  if (length >= 12) score += 25;
  if (hasLower) score += 10;
  if (hasUpper) score += 10;
  if (hasDigit) score += 10;
  if (hasSymbol) score += 20;

  if (!hasUpper) suggestions.push("Add uppercase letters.");
  if (!hasLower) suggestions.push("Add lowercase letters.");
  if (!hasDigit) suggestions.push("Include numbers.");
  if (!hasSymbol) suggestions.push("Include symbols like !@#$.");
  if (length < 8) suggestions.push("Use at least 8 characters.");

  score = Math.max(0, Math.min(100, score));

  let rating = "Weak", color = "red";
  if (score > 70) { rating = "Strong"; color = "green"; }
  else if (score > 50) { rating = "Fair"; color = "orange"; }
  else if (score > 30) { rating = "Weak"; color = "tomato"; }

  return { score, rating, color, suggestions, entropy: calculateEntropy(password) };
}

// -------------------------------
// UPDATE UI FUNCTION
// -------------------------------
function checkPasswordStrength() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const result = analyzePassword(username, password);

  document.getElementById("strengthBar").style.width = result.score + "%";
  document.getElementById("strengthBar").style.backgroundColor = result.color;
  document.getElementById("strengthText").textContent = `Strength: ${result.rating}`;

  const entropyText = document.getElementById("entropyText");
  entropyText.textContent = `Entropy: ${result.entropy.toFixed(2)} bits`;

  const suggestionsList = document.getElementById("suggestionsList");
  suggestionsList.innerHTML = "";
  result.suggestions.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    suggestionsList.appendChild(li);
  });
}

// -------------------------------
// ADVANCED MEMORABLE PASSWORD GENERATOR
// -------------------------------
const adjectives = ["Brave","Calm","Smart","Mighty","Happy","Lucky","Quick","Bright","Kind","Bold", "Wise","Strong","Gentle","Joyful","Friendly","Clever","Shiny","Brilliant","Swift","Cheerful", "Noble","Alert","Graceful","Peaceful","Proud","Vivid","Radiant","Daring","Energetic","Lively", "Honest","Brisk","Creative","Braveheart","Fearless","Courageous","Playful","Curious","Inventive","Vigorous", "Gallant","Heroic","Optimistic","Cheerful","Dynamic","Elegant","Fierce","Glorious","Hopeful","Intrepid", "Jovial","Keen","Luminous","Magnetic","Passionate","Resolute","Serene","Spirited","Tenacious","Valiant", "Ambitious","Astute","Bubbly","Charming","Dazzling","Eager","Exuberant","Fanciful","Friendly","Gleaming", "Gracious","Humble","Imaginative","Industrious","Joyful","Kindhearted","Majestic","Meticulous","Nimble","Observant", "Patient","Perceptive","Radiant","Resourceful","Sensible","Sincere","Sociable","Stalwart","Steadfast","Strong-willed", "Talented","Thoughtful","Trustworthy","Upbeat","Versatile","Vivacious","Warmhearted","Witty","Zealous","Zesty"];

const nouns = ["Tiger","Eagle","Moon","River","Star","Cloud","Stone","Phoenix","Shadow","Lion", "Falcon","Wolf","Dragon","Sun","Mountain","Ocean","Sky","Storm","Leaf","Fire", "Crystal","Diamond","Comet","Sparrow","Hawk","Bear","Panther","Cheetah","Fox","Raven", "Oak","Pine","Willow","Rose","Lotus","Orchid","Daisy","Maple","Cedar","Ivy", "Thunder","Lightning","Snow","Rain","Wind","Wave","Canyon","Valley","Desert","Meadow", "Horizon","Galaxy","Planet","Meteor","Nova","Cosmos","Aurora","Orbit","Tornado","Volcano", "Shadow","Spirit","Wolfpack","Tigerclaw","Eagleeye","Nightfall","Sunrise","Sunset","Frost","Blaze", "Echo","Myst","Stoneheart","Iron","Silver","Gold","Bronze","Obsidian","Onyx","Pearl", "Sapphire","Ruby","Emerald","Topaz","Crystal","Quartz","Meteorite","Comet","Cyclone","Zephyr", "Breeze","Thunderbolt","Hurricane","Avalanche","Monsoon","Twilight","Starlight","Moonlight","Daybreak","Nightshade"];

const symbols = ["!", "@", "#", "$", "%", "&", "*"];

function generatePassword() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num1 = Math.floor(10 + Math.random() * 90);
  const num2 = Math.floor(100 + Math.random() * 900);
  const sym1 = symbols[Math.floor(Math.random() * symbols.length)];
  const sym2 = symbols[Math.floor(Math.random() * symbols.length)];

  const parts = [adj, noun, num1.toString(), num2.toString(), sym1, sym2];
  const shuffled = parts.sort(() => Math.random() - 0.5);
  const password = shuffled.join("");

  document.getElementById("password").value = password;
  checkPasswordStrength();
}

// -------------------------------
// SHOW / HIDE PASSWORD
// -------------------------------
const togglePasswordBtn = document.getElementById("togglePassword");
togglePasswordBtn.addEventListener("click", () => {
  const passwordField = document.getElementById("password");
  if (passwordField.type === "password") {
    passwordField.type = "text";
    togglePasswordBtn.textContent = "Hide";
  } else {
    passwordField.type = "password";
    togglePasswordBtn.textContent = "Show";
  }
});

// -------------------------------
// EVENTS
// -------------------------------
document.getElementById("generateBtn").addEventListener("click", generatePassword);
document.getElementById("password").addEventListener("input", checkPasswordStrength);

// -------------------------------
// THEME TOGGLER
// -------------------------------
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});
