const DIET_DATABASE = {
  "Cough & Fever": {
    veg: {
      breakfast: [
        { item: "Warm turmeric milk with honey", benefit: "Anti-inflammatory, soothes throat" },
        { item: "Oatmeal with ginger and cinnamon", benefit: "Easy to digest, boosts immunity" },
        { item: "Steamed idli with sambar", benefit: "Light on stomach, provides protein" }
      ],
      lunch: [
        { item: "Dal khichdi with ghee", benefit: "Complete protein, easy to digest" },
        { item: "Mixed vegetable soup", benefit: "Rich in vitamins A & C, hydrating" },
        { item: "Steamed rice with rasam", benefit: "Pepper in rasam clears congestion" }
      ],
      snacks: [
        { item: "Warm ginger-lemon tea", benefit: "Relieves congestion, vitamin C" },
        { item: "Steamed sweet potato", benefit: "Beta-carotene boosts immunity" },
        { item: "Tulsi (basil) tea with honey", benefit: "Natural anti-microbial" }
      ],
      dinner: [
        { item: "Vegetable stew with appam", benefit: "Light, nutritious, easy to digest" },
        { item: "Moong dal soup with jeera rice", benefit: "High protein, aids recovery" },
        { item: "Khichdi with curd", benefit: "Probiotics support gut health" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Warm turmeric milk with honey", benefit: "Anti-inflammatory, soothes throat" },
        { item: "Egg drop soup with ginger", benefit: "Protein-rich, warming" },
        { item: "Boiled eggs with whole wheat toast", benefit: "Lean protein for recovery" }
      ],
      lunch: [
        { item: "Chicken soup with vegetables", benefit: "Classic remedy, anti-inflammatory" },
        { item: "Steamed fish with rice and rasam", benefit: "Omega-3 reduces inflammation" },
        { item: "Chicken khichdi with ghee", benefit: "Complete nutrition, easy to digest" }
      ],
      snacks: [
        { item: "Bone broth", benefit: "Rich in minerals, supports immunity" },
        { item: "Warm ginger-lemon tea", benefit: "Relieves congestion, vitamin C" },
        { item: "Boiled egg with pepper", benefit: "Protein + pepper clears sinuses" }
      ],
      dinner: [
        { item: "Grilled chicken with steamed veggies", benefit: "Lean protein aids healing" },
        { item: "Fish stew with appam", benefit: "Omega-3 fatty acids, light meal" },
        { item: "Egg rasam with rice", benefit: "Warming, protein-rich, digestive" }
      ]
    },
    foods_to_avoid: ["Ice cream & cold drinks", "Fried & oily foods", "Citrus fruits (may irritate throat)", "Dairy products (increases mucus)", "Spicy foods", "Processed sugar"],
    hydration: ["Warm water throughout the day", "Ginger-honey-lemon water", "Tulsi tea", "Warm turmeric milk", "Clear vegetable broth"],
    key_nutrients: ["Vitamin C — Boosts immune response", "Zinc — Shortens cold duration", "Vitamin A — Protects respiratory lining", "Protein — Repairs tissues", "Antioxidants — Fight infection"]
  },
  "Diabetes": {
    veg: {
      breakfast: [
        { item: "Methi (fenugreek) paratha with curd", benefit: "Fenugreek lowers blood sugar" },
        { item: "Oats upma with vegetables", benefit: "Low GI, high fiber" },
        { item: "Moong dal chilla with mint chutney", benefit: "High protein, low carb" }
      ],
      lunch: [
        { item: "Brown rice with palak dal", benefit: "Low GI carbs, iron-rich" },
        { item: "Roti with bitter gourd sabzi", benefit: "Bitter gourd regulates blood sugar" },
        { item: "Quinoa salad with chickpeas", benefit: "Low GI, complete protein" }
      ],
      snacks: [
        { item: "Handful of almonds & walnuts", benefit: "Healthy fats, blood sugar stable" },
        { item: "Cucumber & carrot sticks with hummus", benefit: "Low calorie, high fiber" },
        { item: "Green tea without sugar", benefit: "Improves insulin sensitivity" }
      ],
      dinner: [
        { item: "Multigrain roti with lauki sabzi", benefit: "Low GI, fiber-rich" },
        { item: "Mixed vegetable soup with flaxseeds", benefit: "Omega-3, low calorie" },
        { item: "Tofu stir-fry with brown rice", benefit: "Plant protein, low GI" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Egg white omelette with spinach", benefit: "High protein, low carb" },
        { item: "Grilled chicken sandwich (whole wheat)", benefit: "Lean protein, complex carbs" },
        { item: "Boiled eggs with avocado toast", benefit: "Healthy fats, stable sugar" }
      ],
      lunch: [
        { item: "Grilled fish with brown rice & salad", benefit: "Omega-3, low GI meal" },
        { item: "Chicken breast with quinoa", benefit: "Lean protein, complete amino acids" },
        { item: "Fish curry with roti", benefit: "Omega-3 improves insulin sensitivity" }
      ],
      snacks: [
        { item: "Boiled egg with black pepper", benefit: "Protein-rich, zero carbs" },
        { item: "Grilled chicken strips", benefit: "Lean protein, no sugar spike" },
        { item: "Handful of almonds & walnuts", benefit: "Healthy fats, blood sugar stable" }
      ],
      dinner: [
        { item: "Tandoori chicken with salad", benefit: "High protein, low carb" },
        { item: "Steamed fish with sauteed veggies", benefit: "Omega-3, fiber-rich" },
        { item: "Egg curry with multigrain roti", benefit: "Balanced macros, low GI" }
      ]
    },
    foods_to_avoid: ["White rice & white bread", "Sugary drinks & fruit juices", "Sweets & desserts", "Potatoes & starchy foods", "Packaged/processed foods", "Maida-based items"],
    hydration: ["Plain water (3-4 liters/day)", "Fenugreek seed water (morning)", "Bitter gourd juice", "Green tea", "Jeera water"],
    key_nutrients: ["Chromium — Enhances insulin action", "Magnesium — Improves glucose metabolism", "Fiber — Slows sugar absorption", "Omega-3 — Reduces inflammation", "Vitamin D — Supports insulin function"]
  },
  "Hypertension": {
    veg: {
      breakfast: [
        { item: "Banana smoothie with oats", benefit: "Potassium lowers blood pressure" },
        { item: "Ragi dosa with coconut chutney", benefit: "Calcium-rich, heart-healthy" },
        { item: "Beetroot juice with flaxseed muesli", benefit: "Nitrates relax blood vessels" }
      ],
      lunch: [
        { item: "Brown rice with dal and spinach sabzi", benefit: "DASH diet compliant, iron-rich" },
        { item: "Roti with lauki and salad", benefit: "Low sodium, potassium-rich" },
        { item: "Quinoa bowl with avocado and beans", benefit: "Magnesium, healthy fats" }
      ],
      snacks: [
        { item: "Unsalted nuts and seeds mix", benefit: "Magnesium, healthy fats" },
        { item: "Pomegranate or watermelon", benefit: "Antioxidants, potassium" },
        { item: "Hibiscus tea", benefit: "Clinically shown to reduce BP" }
      ],
      dinner: [
        { item: "Vegetable stew with steamed rice", benefit: "Low sodium, nutrient-dense" },
        { item: "Palak paneer with roti (low salt)", benefit: "Calcium, magnesium, iron" },
        { item: "Mixed dal with jeera rice", benefit: "Protein-rich, heart-healthy" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Scrambled eggs with spinach", benefit: "Protein, potassium, magnesium" },
        { item: "Salmon toast with avocado", benefit: "Omega-3 lowers blood pressure" },
        { item: "Banana smoothie with boiled egg", benefit: "Potassium and protein combo" }
      ],
      lunch: [
        { item: "Grilled salmon with brown rice", benefit: "Omega-3 reduces arterial stiffness" },
        { item: "Chicken salad with olive oil dressing", benefit: "Lean protein, healthy fats" },
        { item: "Fish curry (low salt) with roti", benefit: "Omega-3, anti-inflammatory" }
      ],
      snacks: [
        { item: "Tuna salad (low sodium)", benefit: "Omega-3, lean protein" },
        { item: "Boiled eggs with herbs", benefit: "Protein without added sodium" },
        { item: "Unsalted nuts and seeds", benefit: "Magnesium, healthy fats" }
      ],
      dinner: [
        { item: "Baked fish with steamed veggies", benefit: "Heart-healthy omega-3 meal" },
        { item: "Grilled chicken with garlic and herbs", benefit: "Garlic helps lower BP" },
        { item: "Egg bhurji (low salt) with roti", benefit: "Protein-rich, low sodium" }
      ]
    },
    foods_to_avoid: ["Excess salt & pickles", "Processed meats", "Canned soups & sauces", "Cheese & butter", "Caffeinated beverages", "Alcohol"],
    hydration: ["Plain water (3+ liters/day)", "Coconut water", "Beetroot juice", "Hibiscus tea", "Low-fat buttermilk (low salt)"],
    key_nutrients: ["Potassium — Counteracts sodium", "Magnesium — Relaxes blood vessels", "Calcium — Regulates BP", "Omega-3 — Anti-inflammatory", "Nitrates — Dilates blood vessels"]
  },
  "Anemia": {
    veg: {
      breakfast: [
        { item: "Beetroot-pomegranate smoothie", benefit: "Iron + Vitamin C for absorption" },
        { item: "Ragi porridge with jaggery", benefit: "Calcium and iron-rich" },
        { item: "Poha with peanuts and lemon", benefit: "Flattened rice has iron, lemon aids absorption" }
      ],
      lunch: [
        { item: "Palak dal with rice and lemon", benefit: "Spinach is iron-rich, lemon boosts absorption" },
        { item: "Chole (chickpea curry) with roti", benefit: "High in iron and protein" },
        { item: "Rajma (kidney beans) with brown rice", benefit: "Excellent plant-based iron source" }
      ],
      snacks: [
        { item: "Dates and dry fig mix", benefit: "Natural iron boosters" },
        { item: "Amla (Indian gooseberry) juice", benefit: "Highest natural Vitamin C source" },
        { item: "Jaggery and sesame ladoo", benefit: "Iron and calcium-rich" }
      ],
      dinner: [
        { item: "Methi (fenugreek) roti with dal", benefit: "Fenugreek is rich in iron" },
        { item: "Beetroot sabzi with multigrain roti", benefit: "Increases hemoglobin" },
        { item: "Spinach soup with whole wheat bread", benefit: "Iron and folate-rich" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Liver pate on whole wheat toast", benefit: "Liver is the richest iron source" },
        { item: "Egg bhurji with spinach", benefit: "Heme iron + non-heme iron combo" },
        { item: "Beetroot-pomegranate smoothie", benefit: "Iron + Vitamin C for absorption" }
      ],
      lunch: [
        { item: "Mutton curry with rice", benefit: "Red meat is richest in heme iron" },
        { item: "Chicken liver fry with roti", benefit: "Extremely high in absorbable iron" },
        { item: "Fish curry with spinach rice", benefit: "Iron from multiple sources" }
      ],
      snacks: [
        { item: "Boiled eggs with orange juice", benefit: "Heme iron + Vitamin C" },
        { item: "Dates and dry fruits mix", benefit: "Natural iron boosters" },
        { item: "Chicken soup with veggies", benefit: "Iron and B12 from chicken" }
      ],
      dinner: [
        { item: "Grilled red meat with salad", benefit: "Best source of heme iron" },
        { item: "Fish tikka with mint chutney", benefit: "Iron + Vitamin C from mint" },
        { item: "Egg curry with methi roti", benefit: "Iron from eggs and fenugreek" }
      ]
    },
    foods_to_avoid: ["Tea/coffee with meals (blocks iron)", "Calcium-rich foods with iron meals", "Excess dairy during meals", "Processed foods", "Carbonated drinks", "Excess whole grains with iron-rich foods"],
    hydration: ["Beetroot juice", "Pomegranate juice", "Amla juice", "Orange juice", "Plain water with lemon"],
    key_nutrients: ["Iron — Hemoglobin production", "Vitamin C — Enhances iron absorption", "Vitamin B12 — Red blood cell formation", "Folate — Prevents megaloblastic anemia", "Copper — Aids iron metabolism"]
  },
  "Jaundice": {
    veg: {
      breakfast: [
        { item: "Sugarcane juice with lemon", benefit: "Strengthens liver function" },
        { item: "Plain dalia (broken wheat) porridge", benefit: "Easy to digest, low fat" },
        { item: "Papaya slices with lime", benefit: "Digestive enzymes, liver-friendly" }
      ],
      lunch: [
        { item: "Plain rice with thin moong dal", benefit: "Very easy to digest, gentle on liver" },
        { item: "Steamed vegetables (no oil)", benefit: "Nutrients without liver strain" },
        { item: "Buttermilk with rice", benefit: "Probiotics aid digestion" }
      ],
      snacks: [
        { item: "Coconut water", benefit: "Hydrating, electrolytes" },
        { item: "Boiled potato with salt", benefit: "Easy energy, no liver strain" },
        { item: "Radish juice", benefit: "Traditional liver detoxifier" }
      ],
      dinner: [
        { item: "Plain khichdi (no ghee)", benefit: "Lightest meal, easy recovery" },
        { item: "Vegetable broth with bread", benefit: "Nutrient-rich, fat-free" },
        { item: "Steamed rice with curd", benefit: "Probiotics, easy digestion" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Sugarcane juice with lemon", benefit: "Strengthens liver function" },
        { item: "Plain boiled egg (no yolk or minimal)", benefit: "Lean protein, low fat" },
        { item: "Papaya slices with lime", benefit: "Digestive enzymes, liver-friendly" }
      ],
      lunch: [
        { item: "Steamed fish (very light preparation)", benefit: "Lean protein without liver strain" },
        { item: "Plain rice with thin chicken broth", benefit: "Easy protein, hydrating" },
        { item: "Boiled chicken with steamed veggies", benefit: "Minimal fat, maximum protein" }
      ],
      snacks: [
        { item: "Coconut water", benefit: "Hydrating, electrolytes" },
        { item: "Boiled egg white", benefit: "Pure protein, zero fat" },
        { item: "Fresh fruit juice (no sugar)", benefit: "Vitamins without liver load" }
      ],
      dinner: [
        { item: "Light fish soup with rice", benefit: "Easy to digest protein" },
        { item: "Boiled chicken breast with bread", benefit: "Lean protein for recovery" },
        { item: "Plain khichdi", benefit: "Lightest meal for liver rest" }
      ]
    },
    foods_to_avoid: ["All fried foods", "Ghee, butter, oil", "Red meat & heavy proteins", "Alcohol (strictly)", "Spicy foods", "Eggs yolk (high fat)", "Processed foods", "Non-veg gravies"],
    hydration: ["Sugarcane juice", "Coconut water", "Lemon water", "Barley water", "Plain water (4+ liters)"],
    key_nutrients: ["Vitamin B complex — Liver repair", "Vitamin C — Antioxidant protection", "Glucose — Energy for healing", "Electrolytes — Prevent dehydration", "Protein (lean) — Tissue repair"]
  },
  "Typhoid": {
    veg: {
      breakfast: [
        { item: "Semolina porridge (suji)", benefit: "Very easy to digest" },
        { item: "Banana with warm milk", benefit: "Potassium, easy energy" },
        { item: "Plain toast with honey", benefit: "Simple carbs for energy" }
      ],
      lunch: [
        { item: "Soft rice with thin dal", benefit: "Bland, easy to digest" },
        { item: "Mashed potato with curd", benefit: "Gentle on stomach, probiotics" },
        { item: "Vegetable broth with soft bread", benefit: "Hydrating, nutrient-rich" }
      ],
      snacks: [
        { item: "Apple stew (cooked apple)", benefit: "Pectin aids digestion" },
        { item: "ORS or electrolyte water", benefit: "Prevents dehydration" },
        { item: "Custard with banana", benefit: "Calorie-dense, easy to eat" }
      ],
      dinner: [
        { item: "Plain khichdi", benefit: "Classic recovery food" },
        { item: "Rice with curd", benefit: "Probiotics for gut recovery" },
        { item: "Mashed boiled vegetables", benefit: "Soft, nutrient-rich" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Soft boiled eggs", benefit: "Easy protein, gentle on stomach" },
        { item: "Chicken broth with bread", benefit: "Hydrating, easily absorbed protein" },
        { item: "Semolina porridge with milk", benefit: "Very easy to digest" }
      ],
      lunch: [
        { item: "Boiled chicken with rice", benefit: "Lean protein for recovery" },
        { item: "Fish broth with soft bread", benefit: "Light protein, hydrating" },
        { item: "Egg drop soup with rice", benefit: "Easy protein, warm and soothing" }
      ],
      snacks: [
        { item: "Chicken clear soup", benefit: "Hydrating, protein-rich" },
        { item: "ORS or electrolyte water", benefit: "Prevents dehydration" },
        { item: "Boiled egg white", benefit: "Pure protein, easy to digest" }
      ],
      dinner: [
        { item: "Steamed fish with mashed potato", benefit: "Lean protein, easy carbs" },
        { item: "Plain chicken khichdi", benefit: "Complete nutrition, easy to digest" },
        { item: "Soft boiled egg with rice", benefit: "Simple, protein-rich meal" }
      ]
    },
    foods_to_avoid: ["Spicy foods", "High-fiber vegetables (raw)", "Fried & oily foods", "Raw salads", "Milk products (if diarrhea)", "Heavy grains", "Outside food"],
    hydration: ["ORS solution", "Coconut water", "Lemon water with salt & sugar", "Barley water", "Boiled & cooled water"],
    key_nutrients: ["Calories — Prevent weight loss", "Protein — Tissue repair", "Electrolytes — Combat dehydration", "Vitamin C — Immune support", "Zinc — Faster recovery"]
  },
  "Gastritis": {
    veg: {
      breakfast: [
        { item: "Banana with cold milk", benefit: "Banana coats stomach lining" },
        { item: "Oatmeal with honey", benefit: "Soluble fiber soothes stomach" },
        { item: "Plain dosa with coconut chutney", benefit: "Fermented, easy to digest" }
      ],
      lunch: [
        { item: "Rice with bottle gourd dal", benefit: "Alkaline, soothes acidity" },
        { item: "Khichdi with minimal spice", benefit: "Bland and healing" },
        { item: "Curd rice with pomegranate", benefit: "Probiotics reduce inflammation" }
      ],
      snacks: [
        { item: "Cold milk with honey", benefit: "Neutralizes stomach acid" },
        { item: "Watermelon slices", benefit: "Alkaline, hydrating" },
        { item: "Fennel seed tea", benefit: "Reduces bloating and acidity" }
      ],
      dinner: [
        { item: "Moong dal soup with soft roti", benefit: "Light protein, easy on stomach" },
        { item: "Steamed rice with ghee and dal", benefit: "Ghee protects stomach lining" },
        { item: "Vegetable soup with bread", benefit: "Alkaline, soothing" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Soft scrambled eggs", benefit: "Lean protein, zinc for healing" },
        { item: "Banana with cold milk", benefit: "Banana coats stomach lining" },
        { item: "Boiled eggs with plain toast", benefit: "Non-irritating protein" }
      ],
      lunch: [
        { item: "Steamed fish with rice", benefit: "Omega-3 reduces inflammation" },
        { item: "Mild chicken soup with bread", benefit: "Easy protein, soothing" },
        { item: "Boiled chicken with curd rice", benefit: "Probiotics + lean protein" }
      ],
      snacks: [
        { item: "Cold milk with honey", benefit: "Neutralizes stomach acid" },
        { item: "Boiled egg white", benefit: "Clean protein source" },
        { item: "Fennel seed tea", benefit: "Reduces bloating and acidity" }
      ],
      dinner: [
        { item: "Grilled fish with steamed vegetables", benefit: "Anti-inflammatory omega-3" },
        { item: "Chicken broth with soft roti", benefit: "Warming, gentle on stomach" },
        { item: "Egg khichdi", benefit: "Complete nutrition, easy digest" }
      ]
    },
    foods_to_avoid: ["Spicy food & chillies", "Coffee & tea (acidic)", "Citrus fruits", "Vinegar & pickles", "Fried foods", "Carbonated drinks", "Alcohol", "Tomato-based sauces"],
    hydration: ["Cold milk", "Coconut water", "Aloe vera juice", "Fennel water", "Room temperature water"],
    key_nutrients: ["Vitamin B12 — Stomach lining repair", "Zinc — Heals ulcers faster", "Probiotics — Restore gut flora", "Omega-3 — Anti-inflammatory", "Fiber (soluble) — Protects stomach"]
  },
  "Dengue": {
    veg: {
      breakfast: [
        { item: "Papaya leaf juice (2 tbsp)", benefit: "Clinically proven to increase platelets" },
        { item: "Pomegranate with oatmeal", benefit: "Iron-rich, boosts platelet count" },
        { item: "Kiwi smoothie with honey", benefit: "Vitamin C, increases platelets" }
      ],
      lunch: [
        { item: "Pumpkin curry with rice", benefit: "Vitamin A aids platelet production" },
        { item: "Spinach dal with roti", benefit: "Iron and folate for blood cells" },
        { item: "Broccoli soup with bread", benefit: "Vitamin K for blood clotting" }
      ],
      snacks: [
        { item: "Fresh pomegranate juice", benefit: "Antioxidants, iron, boosts platelets" },
        { item: "Coconut water", benefit: "Natural electrolytes, hydration" },
        { item: "Dragon fruit smoothie", benefit: "Vitamin C, immune boost" }
      ],
      dinner: [
        { item: "Light khichdi with ghee", benefit: "Easy to digest, recovery food" },
        { item: "Vegetable soup with turmeric", benefit: "Anti-inflammatory, immune boost" },
        { item: "Curd rice with pomegranate", benefit: "Probiotics + iron" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Papaya leaf juice (2 tbsp)", benefit: "Clinically proven to increase platelets" },
        { item: "Egg with pomegranate juice", benefit: "Protein + platelet booster" },
        { item: "Chicken broth with kiwi", benefit: "Protein + Vitamin C" }
      ],
      lunch: [
        { item: "Chicken soup with vegetables", benefit: "Protein for immune recovery" },
        { item: "Fish curry with pumpkin rice", benefit: "Omega-3 + Vitamin A" },
        { item: "Mutton bone broth with bread", benefit: "Collagen, minerals, iron" }
      ],
      snacks: [
        { item: "Fresh pomegranate juice", benefit: "Antioxidants, iron, boosts platelets" },
        { item: "Boiled eggs", benefit: "Protein for recovery" },
        { item: "Coconut water", benefit: "Natural electrolytes, hydration" }
      ],
      dinner: [
        { item: "Light fish stew with rice", benefit: "Easy protein, omega-3" },
        { item: "Chicken khichdi", benefit: "Protein-rich recovery meal" },
        { item: "Egg drop soup with turmeric", benefit: "Anti-inflammatory protein" }
      ]
    },
    foods_to_avoid: ["Oily & fried foods", "Spicy foods", "Caffeine", "Carbonated drinks", "Dark-colored foods (may mask bleeding)", "Raw/undercooked food"],
    hydration: ["ORS solution", "Coconut water (every 2 hours)", "Pomegranate juice", "Papaya leaf extract", "Lemon water with glucose"],
    key_nutrients: ["Vitamin C — Platelet production", "Iron — Blood cell formation", "Vitamin K — Blood clotting", "Folate — RBC production", "Protein — Immune system repair"]
  },
  "Heart Disease": {
    veg: {
      breakfast: [
        { item: "Oats with walnuts and berries", benefit: "Beta-glucan lowers cholesterol" },
        { item: "Ragi dosa with flaxseed chutney", benefit: "Omega-3, calcium, fiber" },
        { item: "Green smoothie (spinach, banana, flax)", benefit: "Potassium, magnesium, omega-3" }
      ],
      lunch: [
        { item: "Brown rice with dal and salad", benefit: "Fiber-rich, heart-healthy" },
        { item: "Quinoa bowl with avocado and beans", benefit: "Healthy fats, fiber, protein" },
        { item: "Multigrain roti with palak sabzi", benefit: "Iron, fiber, low cholesterol" }
      ],
      snacks: [
        { item: "Mixed nuts (almonds, walnuts)", benefit: "Heart-healthy monounsaturated fats" },
        { item: "Dark chocolate (70%+ cocoa)", benefit: "Flavonoids improve heart health" },
        { item: "Green tea", benefit: "Antioxidants reduce LDL oxidation" }
      ],
      dinner: [
        { item: "Olive oil sauteed vegetables with quinoa", benefit: "Mediterranean diet, heart-protective" },
        { item: "Vegetable soup with whole wheat bread", benefit: "Low sodium, nutrient-dense" },
        { item: "Tofu stir-fry with brown rice", benefit: "Plant protein, low cholesterol" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Salmon on whole wheat toast", benefit: "Omega-3 reduces triglycerides" },
        { item: "Egg white omelette with veggies", benefit: "Lean protein, no cholesterol" },
        { item: "Oats with walnuts and berries", benefit: "Beta-glucan lowers cholesterol" }
      ],
      lunch: [
        { item: "Grilled salmon with steamed broccoli", benefit: "Best omega-3 source, heart-protective" },
        { item: "Chicken breast salad with olive oil", benefit: "Lean protein, healthy fats" },
        { item: "Fish curry (coconut-based) with rice", benefit: "Medium-chain fats, omega-3" }
      ],
      snacks: [
        { item: "Sardines on whole wheat crackers", benefit: "Rich in omega-3 and calcium" },
        { item: "Mixed nuts (almonds, walnuts)", benefit: "Heart-healthy monounsaturated fats" },
        { item: "Green tea", benefit: "Antioxidants reduce LDL oxidation" }
      ],
      dinner: [
        { item: "Baked fish with roasted vegetables", benefit: "Omega-3, antioxidants, fiber" },
        { item: "Grilled chicken with garlic and herbs", benefit: "Garlic lowers cholesterol" },
        { item: "Tuna salad with olive oil dressing", benefit: "Omega-3, healthy monounsaturated fats" }
      ]
    },
    foods_to_avoid: ["Trans fats & hydrogenated oils", "Red meat & processed meats", "Full-fat dairy", "Excess salt", "Refined carbohydrates", "Sugary foods & drinks", "Deep-fried foods"],
    hydration: ["Green tea", "Hibiscus tea", "Pomegranate juice", "Plain water (3+ liters)", "Beetroot juice"],
    key_nutrients: ["Omega-3 — Reduces triglycerides", "Fiber — Lowers LDL cholesterol", "Potassium — Regulates heart rhythm", "Magnesium — Prevents arrhythmia", "CoQ10 — Supports heart energy"]
  },
  "Kidney Disease": {
    veg: {
      breakfast: [
        { item: "White bread with apple jam", benefit: "Low potassium, low phosphorus" },
        { item: "Rice flakes (poha) with peanuts", benefit: "Low protein load on kidneys" },
        { item: "Semolina upma (light)", benefit: "Low potassium, easy to digest" }
      ],
      lunch: [
        { item: "White rice with bottle gourd curry", benefit: "Low potassium vegetable" },
        { item: "Cabbage sabzi with phulka", benefit: "Kidney-friendly, low potassium" },
        { item: "Ridge gourd dal with rice", benefit: "Diuretic properties, light" }
      ],
      snacks: [
        { item: "Apple slices", benefit: "Low potassium fruit" },
        { item: "Rice crackers", benefit: "Low phosphorus snack" },
        { item: "Cranberry juice (unsweetened)", benefit: "Prevents UTI, kidney-friendly" }
      ],
      dinner: [
        { item: "Light vegetable stew with bread", benefit: "Controlled protein and potassium" },
        { item: "Cauliflower rice with light dal", benefit: "Low potassium alternative" },
        { item: "Cabbage soup with white rice", benefit: "Kidney-friendly, hydrating" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Egg white omelette (1-2 whites)", benefit: "Controlled protein, no yolk phosphorus" },
        { item: "White bread with light chicken spread", benefit: "Low phosphorus meal" },
        { item: "Semolina upma", benefit: "Low potassium, easy to digest" }
      ],
      lunch: [
        { item: "Small portion grilled fish with rice", benefit: "Controlled protein, omega-3" },
        { item: "Chicken breast (small portion) with cabbage", benefit: "Lean protein, kidney-friendly veggie" },
        { item: "Fish soup (light) with white bread", benefit: "Controlled protein, hydrating" }
      ],
      snacks: [
        { item: "Apple slices", benefit: "Low potassium fruit" },
        { item: "Rice crackers", benefit: "Low phosphorus snack" },
        { item: "Small portion chicken strips", benefit: "Controlled protein intake" }
      ],
      dinner: [
        { item: "Small fish fillet with cauliflower rice", benefit: "Low potassium, controlled protein" },
        { item: "Egg white curry with white rice", benefit: "Low phosphorus protein" },
        { item: "Light chicken broth with bread", benefit: "Hydrating, controlled intake" }
      ]
    },
    foods_to_avoid: ["High-potassium foods (banana, orange, potato)", "High-phosphorus foods (dairy, nuts, cola)", "Excess protein", "Salt & salty snacks", "Processed foods", "Whole wheat & bran", "Dark-colored sodas"],
    hydration: ["Fluid intake as prescribed by doctor", "Cranberry juice (limited)", "Apple juice", "Water (measured quantity)", "Lemon water (small amounts)"],
    key_nutrients: ["Controlled Protein — Reduce kidney workload", "Low Potassium — Prevent hyperkalemia", "Low Phosphorus — Protect bones", "Low Sodium — Reduce fluid retention", "Iron — Prevent renal anemia"]
  },
  "PCOD/PCOS": {
    veg: {
      breakfast: [
        { item: "Overnight oats with chia seeds and berries", benefit: "Anti-inflammatory, fiber-rich" },
        { item: "Methi paratha with curd", benefit: "Fenugreek balances hormones" },
        { item: "Smoothie (spinach, flax, banana)", benefit: "Omega-3, magnesium, fiber" }
      ],
      lunch: [
        { item: "Brown rice with rajma and salad", benefit: "Low GI, fiber, anti-inflammatory" },
        { item: "Quinoa bowl with chickpeas and veggies", benefit: "Complete protein, low GI" },
        { item: "Multigrain roti with palak paneer", benefit: "Calcium, iron, complex carbs" }
      ],
      snacks: [
        { item: "Spearmint tea", benefit: "Clinically reduces androgens in PCOS" },
        { item: "Mixed seeds (pumpkin, sunflower, flax)", benefit: "Zinc and omega-3 for hormones" },
        { item: "Dark chocolate (70%+)", benefit: "Magnesium, mood booster" }
      ],
      dinner: [
        { item: "Tofu stir-fry with brown rice", benefit: "Phytoestrogens, low GI" },
        { item: "Mixed vegetable soup with flaxseeds", benefit: "Anti-inflammatory, fiber-rich" },
        { item: "Dal with multigrain roti", benefit: "Plant protein, complex carbs" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Egg omelette with avocado toast", benefit: "Healthy fats balance hormones" },
        { item: "Salmon with whole wheat toast", benefit: "Omega-3 reduces inflammation" },
        { item: "Overnight oats with berries", benefit: "Anti-inflammatory, fiber-rich" }
      ],
      lunch: [
        { item: "Grilled chicken with quinoa salad", benefit: "Lean protein, low GI carbs" },
        { item: "Salmon with brown rice and broccoli", benefit: "Omega-3, anti-inflammatory" },
        { item: "Fish curry with multigrain roti", benefit: "Omega-3, complex carbs" }
      ],
      snacks: [
        { item: "Spearmint tea", benefit: "Clinically reduces androgens in PCOS" },
        { item: "Boiled eggs with seeds", benefit: "Protein + healthy fats" },
        { item: "Mixed seeds (pumpkin, sunflower, flax)", benefit: "Zinc and omega-3 for hormones" }
      ],
      dinner: [
        { item: "Baked salmon with steamed veggies", benefit: "Best omega-3 meal for PCOS" },
        { item: "Chicken breast with quinoa", benefit: "Lean protein, low GI" },
        { item: "Fish soup with whole wheat bread", benefit: "Anti-inflammatory, light" }
      ]
    },
    foods_to_avoid: ["Refined carbs (white bread, maida)", "Sugary foods & drinks", "Processed foods", "Dairy (may increase androgens)", "Excess caffeine", "Soy products (debated)", "Trans fats & fried foods"],
    hydration: ["Spearmint tea (2 cups/day)", "Green tea", "Cinnamon water", "Fenugreek water", "Plain water (3+ liters)"],
    key_nutrients: ["Omega-3 — Reduces inflammation", "Inositol — Improves insulin sensitivity", "Vitamin D — Hormonal balance", "Zinc — Reduces androgens", "Magnesium — Reduces insulin resistance"]
  },
  "Thyroid (Hypothyroidism)": {
    veg: {
      breakfast: [
        { item: "Brazil nut smoothie with banana", benefit: "Selenium essential for thyroid" },
        { item: "Oats with berries and pumpkin seeds", benefit: "Zinc, selenium, fiber" },
        { item: "Ragi dosa with coconut chutney", benefit: "Calcium-rich, iodine from salt" }
      ],
      lunch: [
        { item: "Brown rice with dal and salad", benefit: "Balanced nutrition, selenium" },
        { item: "Quinoa bowl with roasted veggies", benefit: "Complete protein, zinc-rich" },
        { item: "Roti with mixed vegetable curry", benefit: "Iodized salt, varied nutrients" }
      ],
      snacks: [
        { item: "Brazil nuts (2-3 pieces)", benefit: "Highest natural selenium source" },
        { item: "Pumpkin seeds handful", benefit: "Zinc for thyroid hormone conversion" },
        { item: "Fresh fruit (apple, berries)", benefit: "Antioxidants, fiber" }
      ],
      dinner: [
        { item: "Paneer tikka with salad", benefit: "Protein, selenium from paneer" },
        { item: "Mixed vegetable soup with bread", benefit: "Low calorie, nutrient-dense" },
        { item: "Moong dal with quinoa", benefit: "Easy protein, zinc-rich" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Scrambled eggs with whole wheat toast", benefit: "Iodine and selenium from eggs" },
        { item: "Oats with berries and pumpkin seeds", benefit: "Zinc, selenium, fiber" },
        { item: "Chicken sausage with toast", benefit: "Protein-rich start, selenium" }
      ],
      lunch: [
        { item: "Grilled fish with brown rice", benefit: "Iodine and selenium from seafood" },
        { item: "Chicken breast with quinoa salad", benefit: "Lean protein, zinc" },
        { item: "Shrimp curry with rice", benefit: "Highest iodine content food" }
      ],
      snacks: [
        { item: "Boiled eggs", benefit: "Contain iodine and selenium" },
        { item: "Brazil nuts (2-3 pieces)", benefit: "Highest natural selenium source" },
        { item: "Tuna on crackers", benefit: "Iodine-rich snack" }
      ],
      dinner: [
        { item: "Baked salmon with roasted veggies", benefit: "Omega-3, selenium, iodine" },
        { item: "Chicken soup with vegetables", benefit: "Protein, selenium, warming" },
        { item: "Fish tikka with mint chutney", benefit: "Iodine, protein, easy to digest" }
      ]
    },
    foods_to_avoid: ["Raw cruciferous veggies (broccoli, cauliflower, cabbage) — cook them instead", "Soy-based products", "Excess fiber supplements", "Gluten (if Hashimoto's)", "Processed foods", "Excess caffeine near medication time"],
    hydration: ["Plain water (3+ liters)", "Green tea (away from medication)", "Coconut water", "Ginger tea", "Lemon water"],
    key_nutrients: ["Iodine — Thyroid hormone production", "Selenium — T4 to T3 conversion", "Zinc — Thyroid hormone synthesis", "Vitamin D — Immune modulation", "Iron — Thyroid function support"]
  },
  "Tuberculosis": {
    veg: {
      breakfast: [
        { item: "Paneer paratha with curd", benefit: "High calorie, protein-dense" },
        { item: "Banana milkshake with nuts", benefit: "Calorie-dense, potassium" },
        { item: "Stuffed aloo paratha with butter", benefit: "High energy for TB recovery" }
      ],
      lunch: [
        { item: "Rice with dal, ghee and vegetable", benefit: "Complete calories and protein" },
        { item: "Chole with rice and salad", benefit: "High protein, vitamin A from salad" },
        { item: "Paneer butter masala with naan", benefit: "Calorie-dense, protein-rich" }
      ],
      snacks: [
        { item: "Mixed dry fruits and nuts", benefit: "Calorie-dense, vitamin E" },
        { item: "Banana with peanut butter", benefit: "High calorie, potassium" },
        { item: "Warm milk with turmeric and honey", benefit: "Anti-inflammatory, protein" }
      ],
      dinner: [
        { item: "Stuffed roti with paneer and dal", benefit: "High protein, calorie-rich" },
        { item: "Mixed vegetable curry with rice and ghee", benefit: "Balanced nutrition, calories" },
        { item: "Soya chunks curry with roti", benefit: "Highest plant protein source" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Egg bhurji with buttered toast", benefit: "High calorie, protein-rich" },
        { item: "Chicken sandwich with cheese", benefit: "Dense calories and protein" },
        { item: "Omelette with paratha", benefit: "Energy-dense start" }
      ],
      lunch: [
        { item: "Chicken curry with rice and ghee", benefit: "High protein and calories" },
        { item: "Mutton biryani with raita", benefit: "Calorie-dense, iron from red meat" },
        { item: "Fish curry with rice and vegetable", benefit: "Omega-3, vitamin D, protein" }
      ],
      snacks: [
        { item: "Chicken soup with bread", benefit: "Protein-rich, warming" },
        { item: "Boiled eggs (2-3)", benefit: "Easy protein, vitamin D" },
        { item: "Mixed dry fruits and nuts", benefit: "Calorie-dense, vitamin E" }
      ],
      dinner: [
        { item: "Grilled chicken with mashed potato", benefit: "High protein, energy-dense" },
        { item: "Fish fry with roti and dal", benefit: "Complete protein, omega-3" },
        { item: "Egg curry with rice and ghee", benefit: "Calorie-dense, protein-rich" }
      ]
    },
    foods_to_avoid: ["Alcohol (strictly — interacts with TB drugs)", "Tobacco", "Excess sugar & refined foods", "Canned & processed foods", "Coffee & tea with meals (blocks iron)", "Raw or undercooked food"],
    hydration: ["Warm water throughout day", "Warm milk with turmeric", "Fresh fruit juices", "Coconut water", "ORS if needed"],
    key_nutrients: ["Calories — TB increases metabolic rate by 20%", "Protein — Tissue repair & immune function", "Vitamin A — Lung tissue repair", "Vitamin D — Immune modulation", "Iron — Prevent TB-related anemia"]
  },
  "Malaria": {
    veg: {
      breakfast: [
        { item: "Fresh fruit with warm milk", benefit: "Easy energy, hydration" },
        { item: "Toast with honey and banana", benefit: "Quick energy, potassium" },
        { item: "Oatmeal with dates", benefit: "Iron-rich, easy to digest" }
      ],
      lunch: [
        { item: "Rice with dal and steamed veggies", benefit: "Light, nutritious" },
        { item: "Khichdi with ghee", benefit: "Easy recovery food" },
        { item: "Vegetable soup with bread", benefit: "Hydrating, vitamin-rich" }
      ],
      snacks: [
        { item: "ORS or glucose water", benefit: "Prevents dehydration" },
        { item: "Fresh orange juice", benefit: "Vitamin C, hydration" },
        { item: "Dates and raisins", benefit: "Quick energy, iron" }
      ],
      dinner: [
        { item: "Moong dal soup with rice", benefit: "Light protein, easy digest" },
        { item: "Soft roti with lauki sabzi", benefit: "Hydrating, easy on stomach" },
        { item: "Curd rice", benefit: "Probiotics, cooling" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Soft boiled eggs with toast", benefit: "Easy protein for recovery" },
        { item: "Chicken broth with bread", benefit: "Hydrating, protein-rich" },
        { item: "Fresh fruit with warm milk", benefit: "Easy energy, hydration" }
      ],
      lunch: [
        { item: "Chicken soup with rice", benefit: "Protein-rich, hydrating" },
        { item: "Steamed fish with khichdi", benefit: "Light protein, easy digest" },
        { item: "Boiled chicken with mashed potato", benefit: "Energy + protein for recovery" }
      ],
      snacks: [
        { item: "ORS or glucose water", benefit: "Prevents dehydration" },
        { item: "Bone broth", benefit: "Minerals, collagen, hydrating" },
        { item: "Boiled egg with orange juice", benefit: "Protein + Vitamin C" }
      ],
      dinner: [
        { item: "Light fish stew with rice", benefit: "Easy protein, omega-3" },
        { item: "Chicken khichdi", benefit: "Complete recovery meal" },
        { item: "Egg drop soup with bread", benefit: "Light protein, hydrating" }
      ]
    },
    foods_to_avoid: ["Oily & fried foods", "Spicy foods", "High-fiber raw foods", "Heavy grains", "Caffeine", "Cold foods & drinks"],
    hydration: ["ORS solution (every hour)", "Coconut water", "Fresh fruit juices", "Warm water", "Glucose water"],
    key_nutrients: ["Iron — Combat malaria-induced anemia", "Vitamin C — Immune support", "Electrolytes — Prevent dehydration", "Protein — Recovery and repair", "Calories — Fight fever-related weight loss"]
  },
  "COVID-19 Recovery": {
    veg: {
      breakfast: [
        { item: "Turmeric-ginger milk with oats", benefit: "Anti-inflammatory, immune boost" },
        { item: "Mixed fruit bowl with honey and seeds", benefit: "Antioxidants, vitamins" },
        { item: "Moong dal chilla with mint chutney", benefit: "Protein, easy to digest" }
      ],
      lunch: [
        { item: "Brown rice with dal and turmeric veggies", benefit: "Complete nutrition, anti-inflammatory" },
        { item: "Quinoa khichdi with ghee", benefit: "Complete protein, healing fats" },
        { item: "Mixed bean curry with roti", benefit: "High protein, zinc-rich" }
      ],
      snacks: [
        { item: "Kadha (Ayurvedic immunity drink)", benefit: "Traditional immunity booster" },
        { item: "Mixed nuts and seeds", benefit: "Zinc, selenium, vitamin E" },
        { item: "Fresh amla juice", benefit: "Highest natural Vitamin C" }
      ],
      dinner: [
        { item: "Vegetable soup with garlic bread", benefit: "Garlic is antiviral, nutritious" },
        { item: "Palak paneer with multigrain roti", benefit: "Iron, protein, vitamins" },
        { item: "Tofu stir-fry with brown rice", benefit: "Complete protein, anti-inflammatory" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Egg omelette with turmeric and veggies", benefit: "Protein, anti-inflammatory" },
        { item: "Chicken broth with ginger and garlic", benefit: "Antiviral, protein-rich" },
        { item: "Scrambled eggs with avocado toast", benefit: "Healthy fats, protein, vitamins" }
      ],
      lunch: [
        { item: "Grilled fish with brown rice and salad", benefit: "Omega-3, vitamin D, protein" },
        { item: "Chicken curry with turmeric and roti", benefit: "Protein, anti-inflammatory spices" },
        { item: "Fish soup with vegetables", benefit: "Omega-3, zinc, hydrating" }
      ],
      snacks: [
        { item: "Bone broth with herbs", benefit: "Collagen, minerals, immune support" },
        { item: "Boiled eggs with black pepper", benefit: "Protein, zinc" },
        { item: "Mixed nuts and seeds", benefit: "Zinc, selenium, vitamin E" }
      ],
      dinner: [
        { item: "Baked salmon with roasted garlic veggies", benefit: "Omega-3, antiviral garlic" },
        { item: "Chicken soup with turmeric", benefit: "Classic recovery food, anti-inflammatory" },
        { item: "Steamed fish with lemon and herbs", benefit: "Vitamin D, omega-3, vitamin C" }
      ]
    },
    foods_to_avoid: ["Processed & junk food", "Excess sugar", "Fried foods", "Alcohol", "Cold drinks", "Excess caffeine"],
    hydration: ["Warm water with turmeric", "Kadha (ginger, tulsi, pepper, cinnamon)", "Green tea", "Coconut water", "Fresh fruit juices (orange, amla)"],
    key_nutrients: ["Vitamin C — Immune defense", "Zinc — Antiviral properties", "Vitamin D — Immune modulation", "Omega-3 — Anti-inflammatory", "Protein — Muscle & immune recovery"]
  },
  "Constipation & Bloating": {
    veg: {
      breakfast: [
        { item: "Warm water with lemon and honey (on empty stomach)", benefit: "Stimulates bowel movement" },
        { item: "Papaya slices with flaxseed", benefit: "Papain enzyme aids digestion, fiber-rich" },
        { item: "Oats porridge with prunes and figs", benefit: "Soluble fiber, natural laxative" }
      ],
      lunch: [
        { item: "Brown rice with palak dal and salad", benefit: "High fiber, iron, aids motility" },
        { item: "Roti with mixed vegetable sabzi and buttermilk", benefit: "Fiber + probiotics for gut" },
        { item: "Quinoa bowl with roasted veggies and curd", benefit: "Complete protein, fiber, probiotics" }
      ],
      snacks: [
        { item: "Soaked prunes or figs (3-4 pieces)", benefit: "Natural laxative, high fiber" },
        { item: "Fresh papaya or guava", benefit: "Digestive enzymes, bulk fiber" },
        { item: "Jeera (cumin) water or ajwain water", benefit: "Relieves bloating, aids digestion" }
      ],
      dinner: [
        { item: "Light khichdi with ghee and sabzi", benefit: "Easy to digest, promotes motility" },
        { item: "Moong dal soup with soft roti", benefit: "Light protein, fiber" },
        { item: "Vegetable stew with whole wheat bread", benefit: "Balanced fiber, easy to digest" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Warm water with lemon and honey (on empty stomach)", benefit: "Stimulates bowel movement" },
        { item: "Scrambled eggs with whole wheat toast and papaya", benefit: "Protein + fiber + digestive enzymes" },
        { item: "Oats porridge with prunes and boiled egg", benefit: "Fiber + protein combo" }
      ],
      lunch: [
        { item: "Grilled chicken with brown rice and salad", benefit: "Lean protein with fiber" },
        { item: "Fish curry with roti and raita", benefit: "Omega-3 reduces inflammation, probiotics" },
        { item: "Chicken soup with vegetables and whole wheat bread", benefit: "Hydrating, fiber-rich" }
      ],
      snacks: [
        { item: "Soaked prunes or figs (3-4 pieces)", benefit: "Natural laxative, high fiber" },
        { item: "Fresh papaya or guava", benefit: "Digestive enzymes, bulk fiber" },
        { item: "Jeera (cumin) water or ajwain water", benefit: "Relieves bloating, aids digestion" }
      ],
      dinner: [
        { item: "Steamed fish with sauteed veggies", benefit: "Light protein, easy to digest" },
        { item: "Chicken khichdi with ghee", benefit: "Easy to digest, complete nutrition" },
        { item: "Egg drop soup with whole wheat bread", benefit: "Light and hydrating" }
      ]
    },
    foods_to_avoid: ["Refined flour (maida) products", "Excess cheese & dairy", "Red meat", "Fried & oily foods", "Carbonated drinks", "Processed foods", "Excess tea & coffee", "White bread & white rice"],
    hydration: ["Warm water first thing in morning", "Jeera water after meals", "Buttermilk (chaas)", "Ajwain water", "Plain water (3-4 liters/day)", "Isabgol (psyllium husk) with warm water at night"],
    key_nutrients: ["Fiber — Adds bulk to stool", "Probiotics — Healthy gut bacteria", "Magnesium — Muscle relaxation in intestines", "Water — Softens stool", "Potassium — Supports muscle contractions"]
  },
  "Pneumonia & Respiratory Infections": {
    veg: {
      breakfast: [
        { item: "Warm turmeric-ginger milk with oats", benefit: "Anti-inflammatory, soothes airways" },
        { item: "Steamed idli with sambar", benefit: "Light, protein-rich, easy to digest" },
        { item: "Honey-lemon warm water with toast", benefit: "Soothes throat, vitamin C" }
      ],
      lunch: [
        { item: "Dal khichdi with ghee", benefit: "Complete protein, easy digestion" },
        { item: "Vegetable soup with whole wheat bread", benefit: "Vitamins A & C, hydrating" },
        { item: "Rice with rasam and steamed vegetables", benefit: "Pepper clears congestion" }
      ],
      snacks: [
        { item: "Warm ginger-tulsi tea", benefit: "Natural antimicrobial, clears airways" },
        { item: "Steamed sweet potato", benefit: "Beta-carotene for lung health" },
        { item: "Fresh orange juice", benefit: "Vitamin C boosts immunity" }
      ],
      dinner: [
        { item: "Moong dal soup with soft roti", benefit: "High protein, easy to digest" },
        { item: "Vegetable stew with appam", benefit: "Light, nutritious" },
        { item: "Curd rice with pomegranate", benefit: "Probiotics, antioxidants" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Egg drop soup with ginger", benefit: "Protein-rich, warming" },
        { item: "Boiled eggs with whole wheat toast", benefit: "Lean protein for recovery" },
        { item: "Warm turmeric milk with honey", benefit: "Anti-inflammatory" }
      ],
      lunch: [
        { item: "Chicken soup with vegetables", benefit: "Classic remedy, anti-inflammatory" },
        { item: "Steamed fish with rice", benefit: "Omega-3 reduces inflammation" },
        { item: "Chicken khichdi with ghee", benefit: "Complete nutrition, easy to digest" }
      ],
      snacks: [
        { item: "Bone broth", benefit: "Minerals, supports immunity" },
        { item: "Warm ginger-lemon tea", benefit: "Relieves congestion" },
        { item: "Boiled egg with pepper", benefit: "Protein + pepper clears sinuses" }
      ],
      dinner: [
        { item: "Grilled chicken with steamed veggies", benefit: "Lean protein aids healing" },
        { item: "Fish stew with appam", benefit: "Omega-3, light meal" },
        { item: "Chicken rasam with rice", benefit: "Warming, protein-rich" }
      ]
    },
    foods_to_avoid: ["Ice cream & cold drinks", "Fried & oily foods", "Dairy products (increases mucus)", "Spicy foods", "Processed sugar", "Smoking & alcohol"],
    hydration: ["Warm water throughout the day", "Ginger-honey-lemon water", "Tulsi tea", "Warm turmeric milk", "Steam inhalation"],
    key_nutrients: ["Vitamin C — Immune defense", "Zinc — Shortens infection duration", "Vitamin A — Protects respiratory lining", "Protein — Repairs tissues", "Omega-3 — Anti-inflammatory"]
  },
  "Asthma & Allergies": {
    veg: {
      breakfast: [
        { item: "Warm honey-ginger water with oats", benefit: "Anti-inflammatory, soothes airways" },
        { item: "Fresh fruit smoothie with turmeric", benefit: "Antioxidants, curcumin reduces inflammation" },
        { item: "Ragi porridge with dates", benefit: "Magnesium relaxes bronchial muscles" }
      ],
      lunch: [
        { item: "Brown rice with palak dal", benefit: "Magnesium, iron, anti-inflammatory" },
        { item: "Roti with mixed vegetable curry", benefit: "Diverse antioxidants" },
        { item: "Quinoa salad with avocado", benefit: "Omega-3, reduces airway inflammation" }
      ],
      snacks: [
        { item: "Green tea with honey", benefit: "Theophylline relaxes airways" },
        { item: "Mixed seeds (sunflower, pumpkin)", benefit: "Magnesium, vitamin E" },
        { item: "Apple slices with almond butter", benefit: "Quercetin reduces histamine" }
      ],
      dinner: [
        { item: "Vegetable soup with turmeric", benefit: "Anti-inflammatory, hydrating" },
        { item: "Light khichdi with ghee", benefit: "Easy to digest, warming" },
        { item: "Steamed vegetables with quinoa", benefit: "Antioxidant-rich, light" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Scrambled eggs with turmeric", benefit: "Protein, anti-inflammatory spice" },
        { item: "Salmon toast with avocado", benefit: "Omega-3 reduces airway inflammation" },
        { item: "Warm honey-ginger water with oats", benefit: "Soothes airways" }
      ],
      lunch: [
        { item: "Grilled salmon with brown rice", benefit: "Best omega-3 source for lungs" },
        { item: "Fish curry with roti", benefit: "Omega-3, anti-inflammatory" },
        { item: "Chicken soup with ginger-garlic", benefit: "Warming, opens airways" }
      ],
      snacks: [
        { item: "Green tea with honey", benefit: "Theophylline relaxes airways" },
        { item: "Boiled egg with seeds", benefit: "Protein, magnesium" },
        { item: "Fresh fruit", benefit: "Quercetin, vitamin C" }
      ],
      dinner: [
        { item: "Baked fish with steamed veggies", benefit: "Omega-3, light on digestion" },
        { item: "Chicken stew with whole wheat bread", benefit: "Protein for immune support" },
        { item: "Fish soup with turmeric", benefit: "Anti-inflammatory meal" }
      ]
    },
    foods_to_avoid: ["Sulfite-containing foods (dried fruits, wine)", "Dairy (may increase mucus)", "Processed & packaged foods", "Cold drinks & ice cream", "Artificial additives", "Known allergen foods"],
    hydration: ["Warm water throughout the day", "Ginger-honey tea", "Green tea", "Warm turmeric milk", "Steam inhalation (eucalyptus)"],
    key_nutrients: ["Omega-3 — Reduces airway inflammation", "Magnesium — Relaxes bronchial muscles", "Vitamin C — Immune support", "Vitamin D — Modulates immune response", "Quercetin — Natural antihistamine"]
  },
  "Arthritis & Joint Pain": {
    veg: {
      breakfast: [
        { item: "Turmeric milk with oats and walnuts", benefit: "Curcumin + omega-3 reduce joint inflammation" },
        { item: "Green smoothie (spinach, ginger, pineapple)", benefit: "Bromelain is anti-inflammatory" },
        { item: "Ragi porridge with flaxseeds", benefit: "Calcium for bones, omega-3 for joints" }
      ],
      lunch: [
        { item: "Brown rice with dal and turmeric veggies", benefit: "Anti-inflammatory complete meal" },
        { item: "Quinoa bowl with roasted vegetables", benefit: "Complete protein, antioxidants" },
        { item: "Roti with palak paneer and salad", benefit: "Calcium, iron, vitamins" }
      ],
      snacks: [
        { item: "Walnuts and cherries", benefit: "Omega-3 and anthocyanins reduce pain" },
        { item: "Green tea", benefit: "EGCG is anti-inflammatory" },
        { item: "Ginger tea with turmeric", benefit: "Dual anti-inflammatory action" }
      ],
      dinner: [
        { item: "Vegetable soup with olive oil", benefit: "Oleocanthal mimics anti-inflammatory drugs" },
        { item: "Tofu stir-fry with brown rice", benefit: "Plant protein, gentle on joints" },
        { item: "Light dal with multigrain roti", benefit: "Balanced nutrition" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Salmon on whole wheat toast", benefit: "Omega-3 reduces joint stiffness" },
        { item: "Egg omelette with turmeric and veggies", benefit: "Protein, curcumin" },
        { item: "Oats with walnuts and berries", benefit: "Anti-inflammatory combination" }
      ],
      lunch: [
        { item: "Grilled salmon with quinoa salad", benefit: "Best omega-3 for joint health" },
        { item: "Fish curry with brown rice", benefit: "Anti-inflammatory omega-3" },
        { item: "Chicken breast with steamed veggies", benefit: "Lean protein, antioxidants" }
      ],
      snacks: [
        { item: "Sardines on crackers", benefit: "Omega-3, calcium for bones" },
        { item: "Green tea", benefit: "EGCG reduces inflammation" },
        { item: "Walnuts and berries mix", benefit: "Antioxidants and healthy fats" }
      ],
      dinner: [
        { item: "Baked fish with olive oil vegetables", benefit: "Anti-inflammatory meal" },
        { item: "Chicken soup with ginger-turmeric", benefit: "Warming, reduces stiffness" },
        { item: "Grilled fish with salad", benefit: "Omega-3, light on digestion" }
      ]
    },
    foods_to_avoid: ["Red meat (increases inflammation)", "Fried & processed foods", "Refined sugar & sweets", "Excess salt", "Alcohol", "Nightshade vegetables (if sensitive)"],
    hydration: ["Ginger-turmeric tea", "Green tea", "Warm water with lemon", "Cherry juice", "Plain water (3+ liters)"],
    key_nutrients: ["Omega-3 — Reduces joint inflammation", "Curcumin — Natural anti-inflammatory", "Vitamin D — Bone health", "Calcium — Prevents bone loss", "Antioxidants — Protect cartilage"]
  },
  "Migraine & Headache": {
    veg: {
      breakfast: [
        { item: "Oatmeal with seeds and banana", benefit: "Magnesium prevents migraines" },
        { item: "Spinach smoothie with almonds", benefit: "Magnesium + riboflavin" },
        { item: "Whole wheat toast with avocado", benefit: "Healthy fats, potassium" }
      ],
      lunch: [
        { item: "Brown rice with dal and leafy greens", benefit: "Magnesium, B vitamins" },
        { item: "Quinoa bowl with sweet potato and greens", benefit: "Complex carbs prevent triggers" },
        { item: "Roti with paneer and spinach", benefit: "Riboflavin, magnesium" }
      ],
      snacks: [
        { item: "Almonds and pumpkin seeds", benefit: "Magnesium prevents attacks" },
        { item: "Ginger tea", benefit: "As effective as some migraine drugs" },
        { item: "Fresh watermelon", benefit: "Hydrating, prevents dehydration trigger" }
      ],
      dinner: [
        { item: "Vegetable soup with whole wheat bread", benefit: "Hydrating, not triggering" },
        { item: "Light khichdi", benefit: "Easy to digest during attacks" },
        { item: "Steamed vegetables with quinoa", benefit: "Balanced, non-triggering" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Eggs with whole wheat toast and avocado", benefit: "CoQ10, healthy fats" },
        { item: "Salmon toast", benefit: "Omega-3 reduces frequency" },
        { item: "Oatmeal with seeds", benefit: "Magnesium prevents migraines" }
      ],
      lunch: [
        { item: "Grilled salmon with brown rice", benefit: "Omega-3 reduces inflammation" },
        { item: "Chicken salad with olive oil", benefit: "Lean protein, healthy fats" },
        { item: "Fish with steamed vegetables", benefit: "Light, non-triggering" }
      ],
      snacks: [
        { item: "Almonds and pumpkin seeds", benefit: "Magnesium prevents attacks" },
        { item: "Ginger tea", benefit: "Natural pain relief" },
        { item: "Boiled egg", benefit: "CoQ10, protein" }
      ],
      dinner: [
        { item: "Baked fish with sweet potato", benefit: "Omega-3, complex carbs" },
        { item: "Light chicken soup", benefit: "Hydrating, gentle" },
        { item: "Steamed fish with rice", benefit: "Light, easy to digest" }
      ]
    },
    foods_to_avoid: ["Aged cheese", "Chocolate (in some people)", "Alcohol (especially red wine)", "Processed meats (nitrates)", "MSG-containing foods", "Artificial sweeteners", "Caffeine (excess)"],
    hydration: ["Plain water (minimum 3 liters)", "Ginger tea", "Peppermint tea", "Coconut water", "Electrolyte water"],
    key_nutrients: ["Magnesium — Prevents attacks", "Riboflavin (B2) — Reduces frequency", "CoQ10 — Energy for brain", "Omega-3 — Anti-inflammatory", "Hydration — Prevents triggers"]
  },
  "Urinary Tract Infection": {
    veg: {
      breakfast: [
        { item: "Fresh cranberry juice with oats", benefit: "Prevents bacteria from adhering to bladder" },
        { item: "Yogurt with berries", benefit: "Probiotics fight infection" },
        { item: "Whole wheat toast with cucumber", benefit: "Hydrating, alkalizing" }
      ],
      lunch: [
        { item: "Rice with dal and bottle gourd", benefit: "Hydrating, diuretic properties" },
        { item: "Roti with curd and cucumber raita", benefit: "Probiotics, hydrating" },
        { item: "Vegetable soup with barley", benefit: "Barley water traditionally used for UTI" }
      ],
      snacks: [
        { item: "Coconut water", benefit: "Natural diuretic, hydrating" },
        { item: "Fresh watermelon", benefit: "Flushes bacteria, hydrating" },
        { item: "Cranberry juice (unsweetened)", benefit: "Prevents bacterial adhesion" }
      ],
      dinner: [
        { item: "Light khichdi with curd", benefit: "Probiotics, easy to digest" },
        { item: "Vegetable stew with rice", benefit: "Hydrating, nutritious" },
        { item: "Cucumber soup with bread", benefit: "Hydrating, soothing" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Boiled eggs with cranberry juice", benefit: "Protein + UTI prevention" },
        { item: "Yogurt with berries and egg", benefit: "Probiotics + protein" },
        { item: "Light chicken sandwich", benefit: "Lean protein" }
      ],
      lunch: [
        { item: "Steamed fish with rice and cucumber", benefit: "Light protein, hydrating" },
        { item: "Chicken soup with barley", benefit: "Barley helps flush infection" },
        { item: "Fish with steamed vegetables", benefit: "Omega-3, anti-inflammatory" }
      ],
      snacks: [
        { item: "Coconut water", benefit: "Natural diuretic" },
        { item: "Fresh fruit", benefit: "Hydrating, vitamin C" },
        { item: "Cranberry juice", benefit: "UTI prevention" }
      ],
      dinner: [
        { item: "Light fish stew with rice", benefit: "Easy protein, hydrating" },
        { item: "Chicken with steamed veggies", benefit: "Lean protein, light" },
        { item: "Egg soup with bread", benefit: "Hydrating, protein" }
      ]
    },
    foods_to_avoid: ["Spicy foods", "Caffeine & coffee", "Alcohol", "Carbonated drinks", "Artificial sweeteners", "Excess sugar"],
    hydration: ["Plain water (4+ liters)", "Cranberry juice", "Barley water", "Coconut water", "Lemon water"],
    key_nutrients: ["Vitamin C — Acidifies urine, kills bacteria", "Probiotics — Restore healthy flora", "Water — Flushes bacteria", "Cranberry — Prevents bacterial adhesion", "D-Mannose — Prevents E. coli adhesion"]
  },
  "Liver Disease & Hepatitis": {
    veg: {
      breakfast: [
        { item: "Sugarcane juice with lemon", benefit: "Strengthens liver function" },
        { item: "Papaya slices with lime", benefit: "Digestive enzymes, liver-friendly" },
        { item: "Plain dalia porridge", benefit: "Easy to digest, low fat" }
      ],
      lunch: [
        { item: "Plain rice with thin moong dal", benefit: "Very easy to digest, gentle on liver" },
        { item: "Steamed vegetables (minimal oil)", benefit: "Nutrients without liver strain" },
        { item: "Buttermilk with rice", benefit: "Probiotics aid digestion" }
      ],
      snacks: [
        { item: "Coconut water", benefit: "Hydrating, electrolytes" },
        { item: "Fresh fruit (papaya, apple)", benefit: "Vitamins without liver load" },
        { item: "Radish juice", benefit: "Traditional liver detoxifier" }
      ],
      dinner: [
        { item: "Plain khichdi (minimal ghee)", benefit: "Lightest recovery food" },
        { item: "Vegetable broth with bread", benefit: "Nutrient-rich, fat-free" },
        { item: "Steamed rice with curd", benefit: "Probiotics, easy digestion" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Plain boiled egg white", benefit: "Lean protein, low fat" },
        { item: "Sugarcane juice with lemon", benefit: "Liver-strengthening" },
        { item: "Papaya slices with lime", benefit: "Digestive enzymes" }
      ],
      lunch: [
        { item: "Steamed fish (very light preparation)", benefit: "Lean protein without liver strain" },
        { item: "Boiled chicken with steamed veggies", benefit: "Minimal fat, protein" },
        { item: "Plain rice with thin chicken broth", benefit: "Easy protein, hydrating" }
      ],
      snacks: [
        { item: "Coconut water", benefit: "Hydrating, electrolytes" },
        { item: "Boiled egg white", benefit: "Pure protein, zero fat" },
        { item: "Fresh fruit juice (no sugar)", benefit: "Vitamins without liver load" }
      ],
      dinner: [
        { item: "Light fish soup with rice", benefit: "Easy protein" },
        { item: "Plain khichdi", benefit: "Lightest recovery food" },
        { item: "Boiled chicken breast with bread", benefit: "Lean protein" }
      ]
    },
    foods_to_avoid: ["All fried foods", "Ghee, butter, oil (excess)", "Red meat", "Alcohol (strictly prohibited)", "Spicy foods", "Egg yolk", "Processed foods"],
    hydration: ["Sugarcane juice", "Coconut water", "Lemon water", "Barley water", "Plain water (4+ liters/day)"],
    key_nutrients: ["Vitamin B complex — Liver repair", "Vitamin C — Antioxidant protection", "Lean Protein — Tissue repair", "Electrolytes — Balance hydration", "Antioxidants — Reduce liver damage"]
  },
  "Skin Disorders (Eczema, Psoriasis, Rash)": {
    veg: {
      breakfast: [
        { item: "Aloe vera juice with oats and berries", benefit: "Skin-healing, anti-inflammatory" },
        { item: "Carrot-beetroot juice with toast", benefit: "Beta-carotene for skin repair" },
        { item: "Smoothie (spinach, banana, flaxseed)", benefit: "Omega-3, vitamins for skin" }
      ],
      lunch: [
        { item: "Brown rice with dal and pumpkin curry", benefit: "Vitamin A, zinc for skin healing" },
        { item: "Roti with mixed vegetables and curd", benefit: "Probiotics improve skin" },
        { item: "Quinoa salad with avocado and greens", benefit: "Healthy fats, vitamin E" }
      ],
      snacks: [
        { item: "Mixed seeds (sunflower, pumpkin, flax)", benefit: "Zinc, omega-3, vitamin E" },
        { item: "Fresh papaya slices", benefit: "Papain aids skin healing" },
        { item: "Green tea", benefit: "Antioxidants reduce inflammation" }
      ],
      dinner: [
        { item: "Vegetable soup with turmeric", benefit: "Anti-inflammatory, skin-soothing" },
        { item: "Light paneer curry with roti", benefit: "Protein for skin repair" },
        { item: "Steamed veggies with quinoa", benefit: "Antioxidant-rich, anti-inflammatory" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Salmon toast with avocado", benefit: "Omega-3 reduces skin inflammation" },
        { item: "Eggs with whole wheat toast", benefit: "Biotin, protein for skin" },
        { item: "Carrot-beetroot juice with egg", benefit: "Vitamin A + protein" }
      ],
      lunch: [
        { item: "Grilled fish with brown rice and salad", benefit: "Omega-3, vitamin E" },
        { item: "Chicken salad with olive oil", benefit: "Lean protein, healthy fats" },
        { item: "Fish curry with roti", benefit: "Omega-3 for skin health" }
      ],
      snacks: [
        { item: "Mixed seeds and nuts", benefit: "Zinc, vitamin E" },
        { item: "Boiled eggs", benefit: "Biotin for skin" },
        { item: "Green tea", benefit: "Antioxidants" }
      ],
      dinner: [
        { item: "Baked salmon with veggies", benefit: "Best omega-3 for skin" },
        { item: "Fish soup with turmeric", benefit: "Anti-inflammatory" },
        { item: "Grilled chicken with sweet potato", benefit: "Vitamin A, protein" }
      ]
    },
    foods_to_avoid: ["Processed foods", "Excess dairy (may worsen)", "Gluten (if sensitive)", "Refined sugar", "Fried foods", "Alcohol", "Spicy foods", "Known allergens"],
    hydration: ["Plain water (3+ liters)", "Aloe vera juice", "Green tea", "Coconut water", "Cucumber-infused water"],
    key_nutrients: ["Omega-3 — Reduces skin inflammation", "Vitamin A — Skin cell repair", "Zinc — Wound healing", "Vitamin E — Protects skin cells", "Probiotics — Gut-skin connection"]
  },
  "Depression & Anxiety": {
    veg: {
      breakfast: [
        { item: "Banana smoothie with walnuts and oats", benefit: "Serotonin boost, omega-3, complex carbs" },
        { item: "Dark chocolate oatmeal with berries", benefit: "Mood-boosting flavonoids, antioxidants" },
        { item: "Yogurt parfait with nuts and seeds", benefit: "Probiotics, healthy fats for brain" }
      ],
      lunch: [
        { item: "Brown rice with rajma and salad", benefit: "Folate, B vitamins improve mood" },
        { item: "Quinoa bowl with avocado and greens", benefit: "Complete protein, healthy fats" },
        { item: "Roti with palak paneer", benefit: "Folate, magnesium, calcium" }
      ],
      snacks: [
        { item: "Dark chocolate (70%+)", benefit: "Boosts serotonin and endorphins" },
        { item: "Walnuts and almonds", benefit: "Omega-3, magnesium for brain" },
        { item: "Chamomile or green tea", benefit: "L-theanine reduces anxiety" }
      ],
      dinner: [
        { item: "Vegetable soup with whole wheat bread", benefit: "Tryptophan promotes sleep" },
        { item: "Dal with brown rice and leafy greens", benefit: "B vitamins, folate" },
        { item: "Warm turmeric milk with honey", benefit: "Anti-inflammatory, calming" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Salmon toast with avocado", benefit: "Omega-3 reduces depression" },
        { item: "Eggs with spinach and whole wheat toast", benefit: "B12, folate, tryptophan" },
        { item: "Oatmeal with walnuts and berries", benefit: "Omega-3, serotonin boost" }
      ],
      lunch: [
        { item: "Grilled salmon with quinoa", benefit: "Best omega-3 for brain health" },
        { item: "Chicken breast with brown rice and veggies", benefit: "Tryptophan, B vitamins" },
        { item: "Fish curry with roti", benefit: "Omega-3, complex carbs" }
      ],
      snacks: [
        { item: "Dark chocolate", benefit: "Mood-boosting compounds" },
        { item: "Walnuts and almonds", benefit: "Omega-3 for brain" },
        { item: "Chamomile tea", benefit: "Reduces anxiety" }
      ],
      dinner: [
        { item: "Baked fish with sweet potato", benefit: "Omega-3, serotonin precursors" },
        { item: "Turkey/chicken soup", benefit: "Tryptophan, warming comfort food" },
        { item: "Egg curry with roti", benefit: "B12, tryptophan" }
      ]
    },
    foods_to_avoid: ["Excess caffeine", "Alcohol", "Refined sugar & processed foods", "Trans fats & fried foods", "Excess sodium", "Artificial sweeteners"],
    hydration: ["Plain water (3+ liters)", "Green tea (L-theanine)", "Chamomile tea", "Warm turmeric milk", "Fresh fruit juices"],
    key_nutrients: ["Omega-3 — Brain function & mood", "B Vitamins — Neurotransmitter production", "Vitamin D — Serotonin regulation", "Magnesium — Calms nervous system", "Probiotics — Gut-brain axis"]
  },
  "Food Poisoning & Gastroenteritis": {
    veg: {
      breakfast: [
        { item: "ORS solution or electrolyte water", benefit: "Rehydration is top priority" },
        { item: "Plain toast with honey", benefit: "Gentle on stomach" },
        { item: "Rice water (kanji)", benefit: "Soothes stomach, easy energy" }
      ],
      lunch: [
        { item: "Plain curd rice", benefit: "Probiotics restore gut, easy to digest" },
        { item: "Thin moong dal soup", benefit: "Light protein, gentle" },
        { item: "Plain khichdi", benefit: "BRAT diet equivalent, recovery food" }
      ],
      snacks: [
        { item: "ORS or coconut water", benefit: "Replaces lost electrolytes" },
        { item: "Boiled potato with salt", benefit: "Bland, easy energy" },
        { item: "Banana", benefit: "Potassium, easy to digest" }
      ],
      dinner: [
        { item: "Rice with plain dal", benefit: "Bland, easy recovery" },
        { item: "Vegetable broth", benefit: "Hydrating, nutrient-rich" },
        { item: "Toast with curd", benefit: "Probiotics, simple" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "ORS or electrolyte water", benefit: "Rehydration is critical" },
        { item: "Plain toast", benefit: "Gentle on stomach" },
        { item: "Clear chicken broth", benefit: "Easy protein, hydrating" }
      ],
      lunch: [
        { item: "Boiled chicken with plain rice", benefit: "Lean protein, bland" },
        { item: "Light chicken soup", benefit: "Hydrating, easy protein" },
        { item: "Plain khichdi", benefit: "Recovery food" }
      ],
      snacks: [
        { item: "ORS or coconut water", benefit: "Electrolyte replacement" },
        { item: "Banana", benefit: "Potassium, gentle on stomach" },
        { item: "Plain crackers", benefit: "Bland, settles stomach" }
      ],
      dinner: [
        { item: "Boiled chicken with rice", benefit: "Bland recovery meal" },
        { item: "Fish broth with toast", benefit: "Light protein" },
        { item: "Egg drop soup", benefit: "Gentle protein, hydrating" }
      ]
    },
    foods_to_avoid: ["Spicy foods", "Dairy (initially)", "Fried foods", "Raw vegetables & fruits", "Caffeine", "Alcohol", "Heavy grains"],
    hydration: ["ORS (every 30 minutes)", "Coconut water", "Rice water", "Lemon water with salt & sugar", "Plain water (frequent sips)"],
    key_nutrients: ["Electrolytes — Rehydration", "Probiotics — Gut recovery", "Zinc — Reduces diarrhea duration", "Potassium — Prevents weakness", "Simple carbs — Easy energy"]
  },
  "Vitamin Deficiency & Weakness": {
    veg: {
      breakfast: [
        { item: "Mixed fruit bowl with nuts and seeds", benefit: "Multiple vitamins and minerals" },
        { item: "Ragi porridge with jaggery and dates", benefit: "Iron, calcium, B vitamins" },
        { item: "Spinach smoothie with banana and almonds", benefit: "Iron, B12, folate, magnesium" }
      ],
      lunch: [
        { item: "Brown rice with palak dal and lemon", benefit: "Iron + vitamin C for absorption" },
        { item: "Roti with chole and salad", benefit: "Protein, iron, vitamins" },
        { item: "Quinoa bowl with mixed vegetables", benefit: "Complete protein, diverse vitamins" }
      ],
      snacks: [
        { item: "Mixed dry fruits and dates", benefit: "Iron, B vitamins, energy" },
        { item: "Amla (gooseberry) juice", benefit: "Highest natural vitamin C" },
        { item: "Peanut butter on whole wheat toast", benefit: "B vitamins, protein, healthy fats" }
      ],
      dinner: [
        { item: "Dal with multigrain roti and salad", benefit: "Complete nutrition" },
        { item: "Paneer curry with vegetables", benefit: "B12, calcium, protein" },
        { item: "Beetroot soup with bread", benefit: "Iron, folate, antioxidants" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Eggs with spinach and whole wheat toast", benefit: "B12, iron, folate" },
        { item: "Chicken liver pate on toast", benefit: "Richest B12, iron, vitamin A source" },
        { item: "Mixed fruit with yogurt and honey", benefit: "Multiple vitamins, probiotics" }
      ],
      lunch: [
        { item: "Grilled fish with brown rice and salad", benefit: "Omega-3, B12, vitamin D" },
        { item: "Mutton curry with roti", benefit: "Iron, B12, zinc" },
        { item: "Chicken breast with quinoa", benefit: "Complete protein, B vitamins" }
      ],
      snacks: [
        { item: "Boiled eggs", benefit: "B12, vitamin D" },
        { item: "Mixed dry fruits", benefit: "Iron, B vitamins" },
        { item: "Orange juice with boiled egg", benefit: "Vitamin C + iron absorption" }
      ],
      dinner: [
        { item: "Fish curry with rice", benefit: "Omega-3, B12, vitamin D" },
        { item: "Chicken soup with vegetables", benefit: "Protein, vitamins, minerals" },
        { item: "Egg curry with multigrain roti", benefit: "B12, iron, complex carbs" }
      ]
    },
    foods_to_avoid: ["Excess tea/coffee with meals (blocks iron)", "Alcohol (depletes B vitamins)", "Processed junk food", "Excess sugar", "Raw egg whites (blocks biotin)"],
    hydration: ["Fresh fruit juices (orange, amla)", "Beetroot juice", "Plain water (3+ liters)", "Coconut water", "Lemon water"],
    key_nutrients: ["Iron — Hemoglobin production", "Vitamin B12 — Nerve function, energy", "Vitamin D — Bone health, immunity", "Folate — Cell repair", "Vitamin C — Enhances iron absorption"]
  },
  "General Recovery & Post-Surgery": {
    veg: {
      breakfast: [
        { item: "Protein smoothie with banana, nuts, and milk", benefit: "Calorie-dense, protein for healing" },
        { item: "Paneer paratha with curd", benefit: "High calorie, protein, probiotics" },
        { item: "Oats with dry fruits and honey", benefit: "Complex carbs, energy, minerals" }
      ],
      lunch: [
        { item: "Rice with dal, ghee, and vegetable curry", benefit: "Complete nutrition, calories" },
        { item: "Roti with paneer and mixed vegetables", benefit: "Protein, vitamins, energy" },
        { item: "Khichdi with ghee and curd", benefit: "Easy to digest, protein-rich" }
      ],
      snacks: [
        { item: "Mixed dry fruits and nuts", benefit: "Calorie-dense, vitamins" },
        { item: "Banana milkshake", benefit: "Potassium, calories, protein" },
        { item: "Warm milk with turmeric and honey", benefit: "Anti-inflammatory, healing" }
      ],
      dinner: [
        { item: "Vegetable soup with bread", benefit: "Nutrients, easy to eat" },
        { item: "Palak paneer with roti", benefit: "Iron, protein, calcium" },
        { item: "Light dal with rice and ghee", benefit: "Easy recovery meal" }
      ]
    },
    nonveg: {
      breakfast: [
        { item: "Egg bhurji with buttered toast", benefit: "High calorie, protein-rich" },
        { item: "Chicken sandwich with cheese", benefit: "Dense calories and protein" },
        { item: "Omelette with paratha", benefit: "Energy-dense start" }
      ],
      lunch: [
        { item: "Chicken curry with rice and ghee", benefit: "High protein and calories" },
        { item: "Fish curry with roti", benefit: "Omega-3, protein, B12" },
        { item: "Mutton soup with bread", benefit: "Iron, collagen for healing" }
      ],
      snacks: [
        { item: "Chicken soup with bread", benefit: "Protein-rich, warming" },
        { item: "Boiled eggs", benefit: "Easy protein, B12" },
        { item: "Mixed dry fruits", benefit: "Calorie-dense, vitamins" }
      ],
      dinner: [
        { item: "Grilled chicken with mashed potato", benefit: "High protein, energy-dense" },
        { item: "Fish with steamed vegetables", benefit: "Omega-3, light" },
        { item: "Egg curry with rice", benefit: "Calorie-dense, protein" }
      ]
    },
    foods_to_avoid: ["Alcohol", "Excess sugar", "Fried & processed foods", "Spicy foods (initially)", "Raw/undercooked food", "Caffeine (excess)"],
    hydration: ["Plain water (3+ liters)", "Warm milk", "Fresh fruit juices", "Coconut water", "Warm soups"],
    key_nutrients: ["Protein — Tissue repair", "Vitamin C — Wound healing", "Zinc — Immune support", "Iron — Blood recovery", "Calories — Energy for healing"]
  }
};

// Keyword aliases for better matching
const KEYWORD_ALIASES = {
  // Digestive
  "constipation": "Constipation & Bloating",
  "bloating": "Constipation & Bloating",
  "ibs": "Constipation & Bloating",
  "irritable bowel": "Constipation & Bloating",
  "gas": "Constipation & Bloating",
  "indigestion": "Gastritis",
  "acidity": "Gastritis",
  "acid reflux": "Gastritis",
  "gerd": "Gastritis",
  "stomach pain": "Gastritis",
  "gastroenteritis": "Food Poisoning & Gastroenteritis",
  "food poisoning": "Food Poisoning & Gastroenteritis",
  "diarrhea": "Food Poisoning & Gastroenteritis",
  "vomiting": "Food Poisoning & Gastroenteritis",
  "appendicitis": "Food Poisoning & Gastroenteritis",
  // Respiratory
  "cold": "Cough & Fever",
  "flu": "Cough & Fever",
  "influenza": "Cough & Fever",
  "fever": "Cough & Fever",
  "cough": "Cough & Fever",
  "pneumonia": "Pneumonia & Respiratory Infections",
  "bronchitis": "Pneumonia & Respiratory Infections",
  "sinusitis": "Pneumonia & Respiratory Infections",
  "sinus": "Pneumonia & Respiratory Infections",
  "tonsillitis": "Pneumonia & Respiratory Infections",
  "respiratory": "Pneumonia & Respiratory Infections",
  "asthma": "Asthma & Allergies",
  "allergy": "Asthma & Allergies",
  "allergic": "Asthma & Allergies",
  "wheezing": "Asthma & Allergies",
  // Cardiovascular
  "heart": "Heart Disease",
  "cardiac": "Heart Disease",
  "cholesterol": "Heart Disease",
  "heart attack": "Heart Disease",
  "high bp": "Hypertension",
  "blood pressure": "Hypertension",
  "hypertension": "Hypertension",
  // Metabolic
  "sugar": "Diabetes",
  "blood sugar": "Diabetes",
  "diabetes": "Diabetes",
  "thyroid": "Thyroid (Hypothyroidism)",
  "hypothyroid": "Thyroid (Hypothyroidism)",
  "hyperthyroid": "Thyroid (Hypothyroidism)",
  "pcos": "PCOD/PCOS",
  "pcod": "PCOD/PCOS",
  // Blood
  "low hemoglobin": "Anemia",
  "iron deficiency": "Anemia",
  "anemia": "Anemia",
  // Liver & Kidney
  "liver": "Liver Disease & Hepatitis",
  "hepatitis": "Liver Disease & Hepatitis",
  "jaundice": "Jaundice",
  "kidney": "Kidney Disease",
  "renal": "Kidney Disease",
  "kidney stone": "Kidney Disease",
  // Urinary
  "uti": "Urinary Tract Infection",
  "urinary": "Urinary Tract Infection",
  "urine infection": "Urinary Tract Infection",
  "bladder": "Urinary Tract Infection",
  // Musculoskeletal
  "arthritis": "Arthritis & Joint Pain",
  "joint pain": "Arthritis & Joint Pain",
  "rheumatoid": "Arthritis & Joint Pain",
  "osteoporosis": "Arthritis & Joint Pain",
  "fibromyalgia": "Arthritis & Joint Pain",
  "back pain": "Arthritis & Joint Pain",
  "bone pain": "Arthritis & Joint Pain",
  // Neurological
  "migraine": "Migraine & Headache",
  "headache": "Migraine & Headache",
  "epilepsy": "Migraine & Headache",
  "seizure": "Migraine & Headache",
  "parkinson": "General Recovery & Post-Surgery",
  "stroke": "General Recovery & Post-Surgery",
  "meningitis": "Pneumonia & Respiratory Infections",
  // Skin
  "skin rash": "Skin Disorders (Eczema, Psoriasis, Rash)",
  "eczema": "Skin Disorders (Eczema, Psoriasis, Rash)",
  "psoriasis": "Skin Disorders (Eczema, Psoriasis, Rash)",
  "dermatitis": "Skin Disorders (Eczema, Psoriasis, Rash)",
  "fungal": "Skin Disorders (Eczema, Psoriasis, Rash)",
  "itching": "Skin Disorders (Eczema, Psoriasis, Rash)",
  "rash": "Skin Disorders (Eczema, Psoriasis, Rash)",
  // Mental Health
  "depression": "Depression & Anxiety",
  "anxiety": "Depression & Anxiety",
  "stress": "Depression & Anxiety",
  "insomnia": "Depression & Anxiety",
  "mental": "Depression & Anxiety",
  // Infectious
  "tb": "Tuberculosis",
  "tuberculosis": "Tuberculosis",
  "covid": "COVID-19 Recovery",
  "corona": "COVID-19 Recovery",
  "dengue": "Dengue",
  "malaria": "Malaria",
  "typhoid": "Typhoid",
  "chickenpox": "Cough & Fever",
  // General
  "vitamin deficiency": "Vitamin Deficiency & Weakness",
  "weakness": "Vitamin Deficiency & Weakness",
  "fatigue": "Vitamin Deficiency & Weakness",
  "weight loss": "Vitamin Deficiency & Weakness",
  "hair loss": "Vitamin Deficiency & Weakness",
  "recovery": "General Recovery & Post-Surgery",
  "surgery": "General Recovery & Post-Surgery",
  "post-operative": "General Recovery & Post-Surgery",
  "general": "General Recovery & Post-Surgery",
  "digestive": "Gastritis",
};

const DISEASE_LIST = Object.keys(DIET_DATABASE);

exports.getDietPlan = async (req, res) => {
  try {
    const { disease } = req.body;
    if (!disease) {
      return res.status(400).json({ error: "Please select a disease/condition" });
    }

    // 1. Try exact match
    let matchedKey = disease;
    let plan = DIET_DATABASE[disease];

    // 2. Try case-insensitive match
    if (!plan) {
      const lowerInput = disease.toLowerCase();
      matchedKey = DISEASE_LIST.find(d => d.toLowerCase() === lowerInput);
      plan = matchedKey ? DIET_DATABASE[matchedKey] : null;
    }

    // 3. Try partial/keyword match (e.g. "cough" matches "Cough & Fever")
    if (!plan) {
      const lowerInput = disease.toLowerCase();
      matchedKey = DISEASE_LIST.find(d => d.toLowerCase().includes(lowerInput) || lowerInput.includes(d.toLowerCase()));
      plan = matchedKey ? DIET_DATABASE[matchedKey] : null;
    }

    // 4. Try matching individual words against disease keys
    if (!plan) {
      const inputWords = disease.toLowerCase().split(/[\s,&]+/).filter(w => w.length > 2);
      matchedKey = DISEASE_LIST.find(d => {
        const dLower = d.toLowerCase();
        return inputWords.some(word => dLower.includes(word));
      });
      plan = matchedKey ? DIET_DATABASE[matchedKey] : null;
    }

    // 5. Try keyword aliases
    if (!plan) {
      const lowerInput = disease.toLowerCase();
      for (const [keyword, mappedDisease] of Object.entries(KEYWORD_ALIASES)) {
        if (lowerInput.includes(keyword)) {
          matchedKey = mappedDisease;
          plan = DIET_DATABASE[matchedKey];
          break;
        }
      }
    }

    if (!plan) {
      return res.status(404).json({
        error: `Diet plan not available for "${disease}"`,
        available_diseases: DISEASE_LIST
      });
    }

    res.json({
      disease: matchedKey,
      ...plan,
      disclaimer: "This diet plan is for informational purposes only. Always consult your doctor or a registered dietitian before making dietary changes."
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getDiseaseList = async (req, res) => {
  res.json({ diseases: DISEASE_LIST });
};
