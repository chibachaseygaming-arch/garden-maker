Build a single-file HTML educational garden game for a young child who loves pigs and pink sheep.

The game is called "Garden School" and has the following gameplay loop:
1. Pick a seed (Rose, Sunflower, Tulip, Daisy, Cherry Blossom)
2. Plant it by clicking an empty garden bed (10 beds in a 5x2 grid)
3. Water it by switching to watering mode and clicking the planted bed
4. Answer a plant education question — get it right and it blooms!
   If wrong, the plant goes back to planted so you can try again.

Features:
- Phase indicator bar showing current step (Pick Seed → Plant → Water → Answer → Bloom)
- 3 difficulty levels: Easy (10pts, hints shown), Medium (20pts, shuffled answers), Hard (35pts, no hints)
- Streak bonus: 3+ correct in a row gives +50% points
- 10 garden beds total — fill all 10 to trigger a final score screen
- Score, bloom count, and streak tracker displayed at the top
- Confetti animation on correct answers and game completion
- Final score grades: Genius Gardener / Super Grower / Blossoming / Keep Growing
- Play Again button resets everything

Question bank (7 questions per difficulty, randomly selected):

EASY:
- Sunflowers need lots of... → Sunlight ☀️ (index 0)
- Plants drink water through their... → Roots 🌱 (index 1)
- A tiny seed grows into a... → Plant 🌿 (index 2)
- Apple trees grow... → Apples 🍎 (index 0)
- Roses have sharp... → Thorns 🌹 (index 0)
- Bees help flowers by spreading... → Pollen 🌸 (index 0)
- Carrots grow... → Underground 🌱 (index 1)

MEDIUM:
- Plants make their own food using... → Sunlight + Water + Air 🌞 (index 0)
- Leaves change colour in autumn because... → Chlorophyll breaks down 🍂 (index 1)
- Cacti store water in their... → Stems 🌵 (index 1)
- What do bees collect to make honey? → Nectar 🍯 (index 0)
- Rice grows best in... → Flooded fields 🌊 (index 1)
- Mushrooms are not plants, they are... → Fungi 🍄 (index 1)
- The top dark layer of soil is called... → Topsoil 🌱 (index 2)

HARD:
- What is the green pigment in plants called? → Chlorophyll 🌿 (index 1)
- The male part of a flower that makes pollen is... → Stamen 🌼 (index 3)
- Water vapour leaving through leaves is called... → Transpiration 💦 (index 2)
- A seed sprouting is called... → Germination 🌱 (index 3)
- Plants that live more than two years are... → Perennials 🌿 (index 2)
- Water travels up through tiny tubes called... → Xylem 💧 (index 1)
- The scientific study of plants is called... → Botany 🌱 (index 1)

Each question has a fun plant fact shown after answering.

Styling:
- Pink/purple gradient background (hex: #ffe0ef → #ffd6f0 → #f5c6e8)
- Google Fonts: Bubblegum Sans (headings/buttons), Nunito (body)
- Garden beds styled as rounded cards: brown/yellow when empty, green when planted, blue pulse when watered, pink when bloomed
- Seed cards are selectable with a highlighted selected state
- Difficulty buttons: green for Easy, amber for Medium, red for Hard
- Action mode buttons to switch between Plant 🌱 and Water 💧 modes
- Confetti pieces: fixed position, random colors, fall-and-rotate CSS animation
- Decorative pig/sheep emoji header: 🐷🌸🐑🌸🐷

All in one HTML file. No frameworks, no build tools. Plain HTML + CSS + vanilla JavaScript.