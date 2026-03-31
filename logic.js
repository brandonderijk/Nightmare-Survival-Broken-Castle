// Bow vs Sword icons
const ICONS = {
    archer: "🏹",
    non: "🗡️"
};

// --- SPAWN DATA ---
// Format: [ Foundry, Keep, Garden ]
// Each spawn is "area(position)"

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

// --- GET SPAWN BASED ON GROUP RULES ---
function getSpawn(role, stage, wave) {

    let list = STAGES[stage][wave];

    let isG1 = role.includes("g1");
    let isG2 = role.includes("g2");

    // Archer vs Non
    let isArcher = role.includes("archer");
    let icon = isArcher ? ICONS.archer : ICONS.non;

    // Stage 4 is special because there are 4 spawns
    if (stage == 4) {
        if (isG1) {
            return icon + " " + list[0] + " → then " + list[2];
        }
        if (isG2) {
            return icon + " " + list[1] + " → then " + list[3];
        }
    }

    // Normal stages (1-3)
    if (isG1) {
        // spawn 1 + spawn 3
        return icon + " " + list[0] + " → then " + list[2];
    }

    if (isG2) {
        // spawn 2 (optional assist)
        return icon + " " + list[1] + " (optional assist on " + list[2] + ")";
    }
}

// --- UI LOGIC ---
document.getElementById("showBtn").addEventListener("click", () => {

    // clear highlight
    document.querySelectorAll(".spot").forEach(s => s.classList.remove("highlight"));

    let role = document.getElementById("roleSelect").value;
    let stage = document.getElementById("stageSelect").value;
    let wave = document.getElementById("waveSelect").value;

    if (!role || !stage || !wave) {
        document.getElementById("resultPanel").innerText = "Select all fields.";
        return;
    }

    let result = getSpawn(role, stage, wave);

    // highlight the primary location
    let primary = result.split(" ")[1]; // extract first match
    let spotID = primary.trim();
    let spot = document.getElementById(spotID);
    if (spot) {
        spot.classList.add("highlight");
    }

    document.getElementById("resultPanel").innerText = result;
});