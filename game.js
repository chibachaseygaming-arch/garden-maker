const garden = document.querySelector("#garden");
const message = document.querySelector("#message");
const nextDayButton = document.querySelector("#next-day");
const buySeedsButton = document.querySelector("#buy-seeds");
const buyLandButton = document.querySelector("#buy-land");
const startMinigameButton = document.querySelector("#start-minigame");
const restartMinigameButton = document.querySelector("#restart-minigame");
const closeMinigameButton = document.querySelector("#close-minigame");
const minigamePanel = document.querySelector("#minigame-panel");
const minigameBoard = document.querySelector("#minigame-board");
const minigameTime = document.querySelector("#minigame-time");
const minigameScore = document.querySelector("#minigame-score");
const seedPicker = document.querySelector("#seed-picker");
const toolButtons = document.querySelectorAll(".tool");
const saveKey = "sprout-and-soil-save";
const minigameLength = 15;
const landCost = 1000;
const weeklyTax = 2;

const crops = {
  carrot: {
    name: "Carrot",
    icon: "C",
    seedCost: 6,
    seedPack: 4,
    sellPrice: 5,
    seedReturn: 1,
    className: "crop-carrot",
  },
  tomato: {
    name: "Tomato",
    icon: "T",
    seedCost: 14,
    seedPack: 3,
    sellPrice: 12,
    seedReturn: 1,
    className: "crop-tomato",
  },
  sunflower: {
    name: "Sunflower",
    icon: "S",
    seedCost: 24,
    seedPack: 2,
    sellPrice: 24,
    seedReturn: 0,
    className: "crop-sunflower",
  },
};

const stats = {
  day: document.querySelector("#day"),
  coins: document.querySelector("#coins"),
  seeds: document.querySelector("#seeds"),
  harvests: document.querySelector("#harvests"),
  land: document.querySelector("#land"),
  taxDay: document.querySelector("#tax-day"),
};

const state = {
  tool: "plant",
  selectedCrop: "carrot",
  day: 1,
  coins: 12,
  harvests: 0,
  seedInventory: {
    carrot: 8,
    tomato: 2,
    sunflower: 1,
  },
  plots: Array.from({ length: 12 }, () => ({
    planted: false,
    watered: false,
    growth: 0,
    crop: null,
    justPlanted: false,
  })),
};

const minigame = {
  active: false,
  score: 0,
  time: minigameLength,
  timer: null,
  wormSlots: [],
};

loadGame();

function setMessage(text) {
  message.textContent = text;
}

function updateStats() {
  const crop = crops[state.selectedCrop];
  stats.day.textContent = state.day;
  stats.coins.textContent = state.coins;
  stats.seeds.textContent = state.seedInventory[state.selectedCrop];
  stats.harvests.textContent = state.harvests;
  stats.land.textContent = state.plots.length;
  stats.taxDay.textContent = daysUntilTax();
  stats.seeds.previousElementSibling.textContent = `${crop.name} Seeds`;
  buySeedsButton.textContent = `Buy ${crop.name} Seeds $${crop.seedCost}`;
  buyLandButton.textContent = `Buy Land $${landCost}`;
}

function renderGarden() {
  garden.innerHTML = "";

  state.plots.forEach((plot, index) => {
    const tile = document.createElement("button");
    tile.className = "plot";
    tile.type = "button";
    tile.setAttribute("aria-label", plotLabel(plot, index));

    if (plot.watered) {
      tile.classList.add("watered");
    }

    if (plot.planted) {
      const stage = Math.min(plot.growth, 3);
      const stageName = getStageName(stage);
      const crop = crops[plot.crop] || crops.carrot;
      tile.classList.add(`stage-${stage}`);
      tile.classList.add(crop.className);
      tile.classList.toggle("just-planted", Boolean(plot.justPlanted));

      const plant = document.createElement("span");
      plant.className = "plant";
      plant.style.setProperty("--stage", stage);

      const shadow = document.createElement("span");
      shadow.className = "plant-shadow";

      const seed = document.createElement("span");
      seed.className = "seed-shell";

      const stem = document.createElement("span");
      stem.className = "stem";

      const leafLeft = document.createElement("span");
      leafLeft.className = "leaf leaf-left";

      const leafRight = document.createElement("span");
      leafRight.className = "leaf leaf-right";

      const leafTop = document.createElement("span");
      leafTop.className = "leaf leaf-top";

      const blossomLeft = document.createElement("span");
      blossomLeft.className = "blossom blossom-left";

      const blossomRight = document.createElement("span");
      blossomRight.className = "blossom blossom-right";

      const carrotRoot = document.createElement("span");
      carrotRoot.className = "carrot-root";

      const tomatoLeft = document.createElement("span");
      tomatoLeft.className = "tomato tomato-left";

      const tomatoRight = document.createElement("span");
      tomatoRight.className = "tomato tomato-right";

      const tomatoTop = document.createElement("span");
      tomatoTop.className = "tomato tomato-top";

      const sunflowerHead = document.createElement("span");
      sunflowerHead.className = "sunflower-head";

      plant.append(
        shadow,
        carrotRoot,
        seed,
        stem,
        leafLeft,
        leafRight,
        leafTop,
        blossomLeft,
        blossomRight,
        tomatoLeft,
        tomatoRight,
        tomatoTop,
        sunflowerHead
      );

      const label = document.createElement("span");
      label.className = "label";
      label.textContent = `${crop.name} ${stageName}`;

      const meters = document.createElement("span");
      meters.className = "plot-meters";

      const waterMeter = createMeter("Water", plot.watered ? 100 : 0, "water");
      const growthMeter = createMeter("Growth", Math.round((stage / 3) * 100), "growth");

      if (stage >= 3) {
        tile.classList.add("ready");
      }

      tile.append(plant, label, meters);
      meters.append(waterMeter, growthMeter);
      plot.justPlanted = false;
    } else {
      const empty = document.createElement("span");
      empty.className = "empty-mark";
      empty.textContent = "+";
      tile.append(empty);
    }

    tile.addEventListener("click", () => useTool(index));
    garden.append(tile);
  });
}

function renderSeedPicker() {
  seedPicker.innerHTML = "";

  Object.entries(crops).forEach(([cropId, crop]) => {
    const button = document.createElement("button");
    button.className = "seed-option";
    button.classList.toggle("active", state.selectedCrop === cropId);
    button.type = "button";
    button.setAttribute("aria-pressed", String(state.selectedCrop === cropId));
    button.innerHTML = `
      <span class="seed-icon ${crop.className}">${crop.icon}</span>
      <span>
        <strong>${crop.name}</strong>
        <small>${state.seedInventory[cropId]} seeds / $${crop.sellPrice} harvest</small>
      </span>
    `;
    button.addEventListener("click", () => selectCrop(cropId));
    seedPicker.append(button);
  });
}

function selectCrop(cropId) {
  state.selectedCrop = cropId;
  renderSeedPicker();
  updateStats();
  saveGame();
}

function getStageName(stage) {
  if (stage >= 3) {
    return "Final";
  }

  if (stage === 2) {
    return "Big Plant";
  }

  return "Seedling";
}

function createMeter(name, value, type) {
  const meter = document.createElement("span");
  meter.className = `meter meter-${type}`;

  const label = document.createElement("span");
  label.className = "meter-label";
  label.textContent = `${name} ${value}%`;

  const track = document.createElement("span");
  track.className = "meter-track";
  track.setAttribute("aria-hidden", "true");

  const fill = document.createElement("span");
  fill.className = "meter-fill";
  fill.style.width = `${value}%`;

  track.append(fill);
  meter.append(label, track);

  return meter;
}

function plotLabel(plot, index) {
  if (!plot.planted) {
    return `Empty soil patch ${index + 1}`;
  }

  const crop = crops[plot.crop] || crops.carrot;

  if (plot.growth >= 3) {
    return `Final ${crop.name} on patch ${index + 1}`;
  }

  return `${crop.name} ${getStageName(plot.growth)} on patch ${index + 1}`;
}

function useTool(index) {
  const plot = state.plots[index];

  if (state.tool === "plant") {
    plantSeed(plot);
  }

  if (state.tool === "water") {
    waterPlant(plot);
  }

  if (state.tool === "harvest") {
    harvestPlant(plot);
  }

  updateStats();
  renderGarden();
  saveGame();
}

function plantSeed(plot) {
  const crop = crops[state.selectedCrop];

  if (plot.planted) {
    setMessage("That patch is already growing something.");
    return;
  }

  if (state.seedInventory[state.selectedCrop] <= 0) {
    setMessage(`You are out of ${crop.name} seeds. Buy more or pick another seed.`);
    return;
  }

  state.seedInventory[state.selectedCrop] -= 1;
  plot.planted = true;
  plot.growth = 1;
  plot.crop = state.selectedCrop;
  plot.watered = false;
  plot.justPlanted = true;
  setMessage(`${crop.name} seed tucked into the soil.`);
}

function waterPlant(plot) {
  if (!plot.planted) {
    setMessage("There is nothing planted there yet.");
    return;
  }

  if (plot.watered) {
    setMessage("That plant already has enough water for today.");
    return;
  }

  plot.watered = true;
  setMessage("The plant perks up after a good watering.");
}

function harvestPlant(plot) {
  if (!plot.planted) {
    setMessage("That patch is empty.");
    return;
  }

  if (plot.growth < 3) {
    setMessage("This plant needs more time before harvest.");
    return;
  }

  plot.planted = false;
  plot.watered = false;
  plot.growth = 0;
  const cropId = plot.crop || "carrot";
  const crop = crops[plot.crop] || crops.carrot;
  plot.crop = null;
  state.coins += crop.sellPrice;
  state.seedInventory[cropId] += crop.seedReturn;
  state.harvests += 1;
  setMessage(`${crop.name} sold for ${crop.sellPrice} coins.`);
}

function buySeeds() {
  const crop = crops[state.selectedCrop];

  if (state.coins < crop.seedCost) {
    setMessage(`${crop.name} seeds cost ${crop.seedCost} coins.`);
    return;
  }

  state.coins -= crop.seedCost;
  state.seedInventory[state.selectedCrop] += crop.seedPack;
  setMessage(`Bought ${crop.seedPack} ${crop.name} seeds.`);
  updateStats();
  renderSeedPicker();
  saveGame();
}

function buyLand() {
  if (state.coins < landCost) {
    setMessage(`More land costs ${landCost} coins.`);
    return;
  }

  state.coins -= landCost;
  state.plots.push(...createPlots(4));
  setMessage("New garden row unlocked. Four fresh plots added.");
  updateStats();
  renderGarden();
  saveGame();
}

function advanceDay() {
  state.day += 1;
  let taxMessage = "";

  state.plots.forEach((plot) => {
    if (plot.planted && plot.watered && plot.growth < 3) {
      plot.growth += 1;
    }

    plot.watered = false;
  });

  if (state.day % 7 === 0) {
    state.coins = Math.max(0, state.coins - weeklyTax);
    taxMessage = ` Weekly tax paid: ${weeklyTax} coins.`;
  }

  setMessage(`A fresh day begins.${taxMessage} Water your plants to help them grow.`);
  updateStats();
  renderGarden();
  saveGame();
}

function createPlots(count) {
  return Array.from({ length: count }, () => ({
    planted: false,
    watered: false,
    growth: 0,
    crop: null,
    justPlanted: false,
  }));
}

function daysUntilTax() {
  const remainder = state.day % 7;
  return remainder === 0 ? 7 : 7 - remainder;
}

function startMinigame() {
  minigame.active = true;
  minigame.score = 0;
  minigame.time = minigameLength;
  minigame.wormSlots = pickWormSlots();
  minigamePanel.hidden = false;
  setMessage("Spray the worms as fast as you can.");
  renderMinigame();

  clearInterval(minigame.timer);
  minigame.timer = setInterval(tickMinigame, 1000);
}

function tickMinigame() {
  minigame.time -= 1;

  if (minigame.time <= 0) {
    finishMinigame();
    return;
  }

  if (minigame.time % 2 === 0) {
    minigame.wormSlots = pickWormSlots();
  }

  renderMinigame();
}

function finishMinigame() {
  clearInterval(minigame.timer);
  minigame.timer = null;
  minigame.active = false;
  minigame.time = 0;
  state.coins += minigame.score;
  setMessage(`Worm Rush complete. You earned ${minigame.score} coins.`);
  updateStats();
  saveGame();
  renderMinigame();
}

function closeMinigame() {
  clearInterval(minigame.timer);
  minigame.timer = null;
  minigame.active = false;
  minigamePanel.hidden = true;
}

function pickWormSlots() {
  const slots = [];

  while (slots.length < 4) {
    const slot = Math.floor(Math.random() * 12);

    if (!slots.includes(slot)) {
      slots.push(slot);
    }
  }

  return slots;
}

function renderMinigame() {
  minigameTime.textContent = minigame.time;
  minigameScore.textContent = minigame.score;
  minigameBoard.innerHTML = "";

  Array.from({ length: 12 }, (_, index) => {
    const target = document.createElement("button");
    const hasWorm = minigame.wormSlots.includes(index);
    target.className = hasWorm ? "spray-target has-worm" : "spray-target";
    target.type = "button";
    target.setAttribute("aria-label", hasWorm ? "Spray worm" : "Empty patch");

    if (hasWorm) {
      const worm = document.createElement("span");
      worm.className = "mini-worm";
      worm.innerHTML = "<span></span><span></span><span></span>";
      target.append(worm);
    }

    target.addEventListener("click", () => sprayMinigameTarget(index));
    minigameBoard.append(target);
  });
}

function sprayMinigameTarget(index) {
  if (!minigame.active || !minigame.wormSlots.includes(index)) {
    return;
  }

  minigame.score += 1;
  minigame.wormSlots = minigame.wormSlots.filter((slot) => slot !== index);

  if (minigame.wormSlots.length < 3) {
    const openSlots = Array.from({ length: 12 }, (_, slot) => slot).filter(
      (slot) => !minigame.wormSlots.includes(slot)
    );
    const nextSlot = openSlots[Math.floor(Math.random() * openSlots.length)];
    minigame.wormSlots.push(nextSlot);
  }

  renderMinigame();
}

function setTool(tool) {
  state.tool = tool;

  toolButtons.forEach((button) => {
    const active = button.dataset.tool === tool;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function saveGame() {
  localStorage.setItem(saveKey, JSON.stringify(state));
}

function loadGame() {
  const savedGame = localStorage.getItem(saveKey);

  if (!savedGame) {
    return;
  }

  try {
    const savedState = JSON.parse(savedGame);
    Object.assign(state, savedState);
    state.selectedCrop = crops[state.selectedCrop] ? state.selectedCrop : "carrot";
    state.seedInventory = {
      carrot: Number(state.seedInventory?.carrot ?? state.seeds ?? 8),
      tomato: Number(state.seedInventory?.tomato ?? 2),
      sunflower: Number(state.seedInventory?.sunflower ?? 1),
    };
    state.plots = state.plots.map((plot) => ({
      planted: Boolean(plot.planted),
      watered: Boolean(plot.watered),
      growth: Number(plot.growth) || 0,
      crop: plot.planted ? plot.crop || "carrot" : null,
      justPlanted: false,
    }));
  } catch {
    localStorage.removeItem(saveKey);
  }
}

toolButtons.forEach((button) => {
  button.addEventListener("click", () => setTool(button.dataset.tool));
});

buySeedsButton.addEventListener("click", buySeeds);
buyLandButton.addEventListener("click", buyLand);
nextDayButton.addEventListener("click", advanceDay);
startMinigameButton.addEventListener("click", startMinigame);
restartMinigameButton.addEventListener("click", startMinigame);
closeMinigameButton.addEventListener("click", closeMinigame);

setTool(state.tool);
renderSeedPicker();
updateStats();
renderGarden();
