// Bow vs Sword icons
const ICONS = {
    archer: "🏹",
    non: "🗡️"
};

// SPAWN DATA
const STAGES = {
    1: {
        1: ["foundry_right", "keep_mid", "garden_left"],
        2: ["garden_right", "keep_mid", "garden_mid"],
        3: ["keep_left", "garden_left", "keep_left"]
    },
    2: {
        1: ["keep_left", "keep_mid", "foundry_right"],
        2: ["foundry_right", "keep_mid", "foundry_mid"],
        3: ["keep_left", "foundry_right", "keep_mid"]
    },
    3: {
        1: ["keep_left", "foundry_right", "garden_left"],
        2: ["garden_left", "foundry_mid", "garden_right"],
        3: ["foundry_left", "garden_mid", "foundry_mid"]
    },
    4: {
        1: ["garden_left", "garden_right", "garden_left", "foundry_mid"],
        2: ["keep_mid", "garden_left", "keep_right", "garden_left"],
        3: ["keep_mid", "garden_mid", "keep_mid", "garden_mid"]
    }
};

// GENERATE WAVES FOR ROLE
function getRoleWaves(role) {
    let arr = [];
    for (let s = 1; s <= 4; s++) {
        for (let w = 1; w <= 3; w++) {
            arr.push({ stage: s, wave: w });
        }
    }
    return arr;
}

// GET SPAWN FOR ROLE/STAGE/WAVE
function getSpawn(role, stage, wave) {

    let list = STAGES[stage][wave];
    let isG1 = role.includes("g1");
    let isG2 = role.includes("g2");
    let isArcher = role.includes("archer");
    let icon = isArcher ? ICONS.archer : ICONS.non;

    // Stage 4 special logic
    if (stage == 4) {
        if (isG1) return icon + " " + list[0] + " → then " + list[2];
        if (isG2) return icon + " " + list[1] + " → then " + list[3];
    }

    // Normal (Stages 1–3)
    if (isG1) return icon + " " + list[0] + " → then " + list[2];
    if (isG2) return icon + " " + list[1] + " (optional assist on " + list[2] + ")";
}


// UI LOGIC
let selectedRole = null;

document.querySelectorAll(".role-tile").forEach(tile => {
    tile.addEventListener("click", () => {
        selectedRole = tile.dataset.role;

        let waves = getRoleWaves(selectedRole);
        let waveContainer = document.getElementById("waveContainer");

        waveContainer.innerHTML = "";
        waveContainer.classList.remove("hidden");

        waves.forEach(w => {
            let btn = document.createElement("div");
            btn.classList.add("wave-tile");
            btn.innerText = `Stage ${w.stage} – Wave ${w.wave}`;
            btn.addEventListener("click", () => showSpawn(selectedRole, w.stage, w.wave));
            waveContainer.appendChild(btn);
        });
    });
});

function showSpawn(role, stage, wave) {
    document.querySelectorAll(".spot").forEach(s => s.classList.remove("highlight"));

    let result = getSpawn(role, stage, wave);

    let primary = result.split(" ")[1];
    let spot = document.getElementById(primary);
    if (spot) spot.classList.add("highlight");

    document.getElementById("resultPanel").innerText = result;
}
