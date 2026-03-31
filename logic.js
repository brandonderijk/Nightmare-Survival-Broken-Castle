// Bow vs Sword icons
const ICONS = {
    archer: "🏹",
    non: "🗡️"
};

// SPAWN DATA — underscores removed & names cleaned
const STAGES = {
    1: {
        1: ["Foundry Right", "Keep Middle", "Burnt Garden Left"],
        2: ["Burnt Garden Right", "Keep Middle", "Burnt Garden Middle"],
        3: ["Keep Left", "Burnt Garden Left", "Keep Left"]
    },
    2: {
        1: ["Keep Left", "Keep Middle", "Foundry Right"],
        2: ["Foundry Right", "Keep Middle", "Foundry Middle"],
        3: ["Keep Left", "Foundry Right", "Keep Middle"]
    },
    3: {
        1: ["Keep Left", "Foundry Right", "Burnt Garden Left"],
        2: ["Burnt Garden Left", "Foundry Middle", "Burnt Garden Right"],
        3: ["Foundry Left", "Burnt Garden Middle", "Foundry Middle"]
    },
    4: {
        1: ["Burnt Garden Left", "Burnt Garden Right", "Burnt Garden Left", "Foundry Middle"],
        2: ["Keep Middle", "Burnt Garden Left", "Keep Right", "Burnt Garden Left"],
        3: ["Keep Middle", "Burnt Garden Middle", "Keep Middle", "Burnt Garden Middle"]
    }
};

// Read role + stage
const urlParams = new URLSearchParams(window.location.search);
const ROLE = urlParams.get("role");

const page = window.location.pathname;
const STAGE = parseInt(page.match(/stage(\d)/)[1]);

// Create wave buttons
const waveContainer = document.getElementById("waveContainer");
if (waveContainer) {
    for (let w = 1; w <= 3; w++) {
        let tile = document.createElement("div");
        tile.classList.add("wave-tile");
        tile.innerText = `Wave ${w}`;
        tile.addEventListener("click", () => showSpawn(ROLE, STAGE, w));
        waveContainer.appendChild(tile);
    }
}

// Role logic
function showSpawn(role, stage, wave) {

    document.querySelectorAll(".spot").forEach(s => s.classList.remove("highlight"));

    let list = STAGES[stage][wave];

    const isG1 = role.includes("g1");
    const isG2 = role.includes("g2");
    const icon = role.includes("archer") ? ICONS.archer : ICONS.non;

    let output;

    if (stage === 4) {
        if (isG1) output = `${icon} ${list[0]} → then ${list[2]}`;
        if (isG2) output = `${icon} ${list[1]} → then ${list[3]}`;
    } else {
        if (isG1) output = `${icon} ${list[0]} → then ${list[2]}`;
        if (isG2) output = `${icon} ${list[1]} (optional assist: ${list[2]})`;
    }

    highlightSpot(output);
    document.getElementById("resultPanel").innerText = output;
}

function highlightSpot(text) {
    const first = text.split("→")[0].trim(); 
    const name = first.split(" ").slice(1).join(" "); 
    const id = name.toLowerCase().replace(/ /g, "_"); 

    const mapIDs = {
        foundry_left: "foundry_left",
        foundry_middle: "foundry_mid",
        foundry_right: "foundry_right",
        keep_left: "keep_left",
        keep_middle: "keep_mid",
        keep_right: "keep_right",
        burnt_garden_left: "garden_left",
        burnt_garden_middle: "garden_mid",
        burnt_garden_right: "garden_right"
    };

    const finalID = mapIDs[id];
    if (finalID) document.getElementById(finalID).classList.add("highlight");
}

// NEXT STAGE BUTTON
const nextStage = document.getElementById("nextStage");
if (nextStage) {
    let next = STAGE + 1;

    if (next <= 4) {
        nextStage.href = `stage${next}.html?role=${ROLE}`;
    } else {
        nextStage.href = "index.html";
        nextStage.innerText = "Return Home";
    }
}
