/* ------------------------------------------------------- */
/* ROLE + STAGE SYSTEM                                     */
/* ------------------------------------------------------- */

/* AVAILABLE ROLES:
   g1_archer
   g1_non
   g2_archer
   g2_non
*/

let currentRole = "g1_archer";   // default (this will be overwritten by stage initialize)
let currentStage = 1;

/* ICONS */
const ICONS = {
    archer: "🏹",
    non: "🗡️"
};

/* CLEANED SPAWN TABLE */
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


/* ------------------------------------------------------- */
/* MAIN INITIALIZATION FOR EACH STAGE PAGE                */
/* ------------------------------------------------------- */

function initializeStage(stageNumber) {
    currentStage = stageNumber;

    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get("role");

    if (roleParam) currentRole = roleParam;

    renderWaveButtons(stageNumber);
    updateNextStageButton(stageNumber);
}

/* ------------------------------------------------------- */
/* RENDER WAVES FOR A STAGE                                */
/* ------------------------------------------------------- */

function renderWaveButtons(stage) {
    const waveContainer = document.getElementById("waveContainer");
    waveContainer.innerHTML = "";

    for (let w = 1; w <= 3; w++) {
        const btn = document.createElement("div");
        btn.classList.add("wave-tile");
        btn.textContent = `Wave ${w}`;
        btn.onclick = () => showWave(stage, w, currentRole);
        waveContainer.appendChild(btn);
    }
}

/* ------------------------------------------------------- */
/* ROLE SWITCHING (INSTANT, NO PAGE RELOAD)                */
/* ------------------------------------------------------- */

function switchRole(roleName) {
    currentRole = roleName;

    const url = new URL(window.location.href);
    url.searchParams.set("role", roleName);
    window.history.replaceState({}, "", url);

    renderWaveButtons(currentStage);

    const out = document.getElementById("waveOutput");
    out.innerHTML = "";
}

/* ------------------------------------------------------- */
/* SHOW A WAVE (TILE → ARROW → TILE)                       */
/* ------------------------------------------------------- */

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
        if (isG1) { first = list[0]; second = list[2]; }
        if (isG2) { first = list[1]; second = list[3]; }
    } else {
        if (isG1) { first = list[0]; second = list[2]; }
        if (isG2) { first = list[1]; second = list[2]; }
    }

    out.innerHTML = `
        <div class="path-tile">${icon} ${first}</div>
        <div class="arrow">↓</div>
        <div class="path-tile">${icon} ${second}</div>
    `;
}

/* ------------------------------------------------------- */
/* NEXT STAGE BUTTON LOGIC                                 */
/* ------------------------------------------------------- */

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

/* ------------------------------------------------------- */
/* OVERVIEW PAGE GENERATOR                                 */
/* ------------------------------------------------------- */

function generateFullOverview() {
    const root = document.getElementById("overviewOutput");
    if (!root) return;

    const roles = ["g1_archer", "g1_non", "g2_archer", "g2_non"];
    const roleLabels = {
        g1_archer: "Group 1 – Archer 🏹",
        g1_non: "Group 1 – Non‑Archer 🗡️",
        g2_archer: "Group 2 – Archer 🏹",
        g2_non: "Group 2 – Non‑Archer 🗡️"
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

                const roleBlock = document.createElement("div");
                roleBlock.classList.add("overview-role-title");
                roleBlock.textContent = roleLabels[role];

                const path = document.createElement("div");
                path.classList.add("overview-path");
                path.innerHTML = `${icon} ${first}<br>↓<br>${icon} ${second}`;

                waveBox.appendChild(roleBlock);
                waveBox.appendChild(path);
            });

            block.appendChild(waveBox);
        }

        root.appendChild(block);
    }
}
