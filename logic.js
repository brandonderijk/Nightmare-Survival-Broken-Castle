// Icons
const ICONS = {
    archer: "🏹",
    non: "🗡️"
};

// Stage + wave spawn lists (underscores removed)
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

// Get URL role parameter
const params = new URLSearchParams(window.location.search);
const ROLE = params.get("role");

// Determine stage number from filename
const page = window.location.pathname;
const STAGE = parseInt(page.match(/stage(\d)/)[1]);

// Insert Wave Buttons
const waveContainer = document.getElementById("waveContainer");
if (waveContainer) {
    for (let w = 1; w <= 3; w++) {
        let btn = document.createElement("div");
        btn.classList.add("wave-tile");
        btn.innerText = `Wave ${w}`;
        btn.addEventListener("click", () => showWave(ROLE, STAGE, w));
        waveContainer.appendChild(btn);
    }
}

// Show wave clean tile view
function showWave(role, stage, wave) {
    const output = document.getElementById("waveOutput");
    output.innerHTML = "";

    const list = STAGES[stage][wave];

    const isG1 = role.includes("g1");
    const isG2 = role.includes("g2");
    const icon = role.includes("archer") ? ICONS.archer : ICONS.non;

    let first, second;

    if (stage === 4) {
        if (isG1) { first = list[0]; second = list[2]; }
        if (isG2) { first = list[1]; second = list[3]; }
    } else {
        if (isG1) { first = list[0]; second = list[2]; }
        if (isG2) { first = list[1]; second = list[2]; }
    }

    output.innerHTML = `
        <div class="path-tile">${icon} ${first}</div>
        <div class="arrow">↓</div>
        <div class="path-tile">${second}</div>
    `;
}

// NEXT BUTTON
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
