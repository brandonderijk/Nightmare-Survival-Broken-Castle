/* ============================================================
   GLOBAL ROLE / STAGE STATE
   ============================================================ */
let currentRole = "g1_archer";
let currentStage = 1;

/* ICONS */
const ICONS = {
    archer: "🏹",
    non: "🗡️"
};

/* ============================================================
   CLEANED SPAWN TABLE (NO UNDERSCORES)
   ============================================================ */

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

/* ============================================================
   INITIALIZE A STAGE (called from stageX.html pages)
   ============================================================ */

function initializeStage(stageNumber) {
    currentStage = stageNumber;

    // Read ?role=... if present
    const params = new URLSearchParams(window.location.search);
    const r = params.get("role");
    if (r) currentRole = r;

    updateNextStageButton(stageNumber);
}

/* ============================================================
   ROLE SWITCHING (INSTANT, NO PAGE RELOAD)
   ============================================================ */

function switchRole(roleName) {
    currentRole = roleName;

    // Update URL visually
    const url = new URL(window.location.href);
    url.searchParams.set("role", roleName);
    window.history.replaceState({}, "", url);

    // Clear output
    const out = document.getElementById("waveOutput");
    if (out) out.innerHTML = "";
}

/* ============================================================
   SHOW WAVE OUTPUT (Tile → Arrow → Tile)
   ============================================================ */

function showWave(stage, wave, role) {
    const out = document.getElementById("waveOutput");
    out.innerHTML = "";

    const list = STAGES[stage][wave];

    const isG1 = role.includes("g1");
    const isG2 = role.includes("g2");
    const isArcher = role.includes("archer");
    const icon = isArcher ? ICONS.archer : ICONS.non;

    let first, second;

    if (stage === 4) {
        if (isG1) {
            first = list[0];
            second = list[2];
        }
        if (isG2) {
            first = list[1];
            second = list[3];
        }
    } else {
        if (isG1) {
            first = list[0];
            second = list[2];
        }
        if (isG2) {
            first = list[1];
            second = list[2];
        }
    }

    out.innerHTML = `
        <div class="path-tile">${icon} ${first}</div>
        <div class="arrow">↓</div>
        <div class="path-tile">${icon} ${second}</div>
    `;
}

/* ============================================================
   NEXT STAGE BUTTON HANDLER
   ============================================================ */

function updateNextStageButton(stage) {
    const nextBtn = document.getElementById("nextStage");
    if (!nextBtn) return;

    if (stage >= 4) {
        nextBtn.style.display = "none";
        return;
    }

    const next = stage + 1;
    nextBtn.href = `stage${next}.html?role=${currentRole}`;
}

/* ============================================================
   OVERVIEW PAGE BUILDER
   ============================================================ */

function generateFullOverview() {
    const root = document.getElementById("overviewOutput");
    if (!root) return;

    root.innerHTML = "";

    const roles = ["g1_archer", "g1_non", "g2_archer", "g2_non"];
    const labels = {
        g1_archer: "G1 Archer 🏹",
        g1_non: "G1 Non-Archer 🗡️",
        g2_archer: "G2 Archer 🏹",
        g2_non: "G2 Non-Archer 🗡️"
    };

    for (let stage = 1; stage <= 4; stage++) {
        const block = document.createElement("div");
        block.classList.add("overview-block");

        block.innerHTML = `<div class="overview-title">Stage ${stage}</div>`;

        for (let wave = 1; wave <= 3; wave++) {
            const waveBox = document.createElement("div");
            waveBox.classList.add("overview-wave");
            waveBox.innerHTML = `<h3>Wave ${wave}</h3>`;

            roles.forEach(role => {
                const list = STAGES[stage][wave];
                const isG1 = role.includes("g1");
                const isG2 = role.includes("g2");
                const isArcher = role.includes("archer");
                const icon = isArcher ? ICONS.archer : ICONS.non;

                let first, second;

                if (stage === 4) {
                    if (isG1) { first = list[0]; second = list[2]; }
                    if (isG2) { first = list[1]; second = list[3]; }
                } else {
                    if (isG1) { first = list[0]; second = list[2]; }
                    if (isG2) { first = list[1]; second = list[2]; }
                }

                const rTitle = document.createElement("div");
                rTitle.classList.add("overview-role-title");
                rTitle.textContent = labels[role];

                const rPath = document.createElement("div");
                rPath.classList.add("overview-path");
                rPath.innerHTML = `${icon} ${first}<br>↓<br>${icon} ${second}`;

                waveBox.appendChild(rTitle);
                waveBox.appendChild(rPath);
            });

            block.appendChild(waveBox);
        }

        root.appendChild(block);
    }
}
