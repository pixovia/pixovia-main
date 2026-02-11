/* ============================================
   Voltxis FileHost — BUSSID Mods Hub
   app.js (Supabase Powered)
============================================ */

/* -----------------------------
   SUPABASE CONFIG
----------------------------- */

const SUPABASE_URL = "https://hjgmvkwiqihorwaynlrb.supabase.co";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqZ212a3dpcWlob3J3YXlubHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NTc2NTAsImV4cCI6MjA4MjEzMzY1MH0.C_3izEOMhdxTfnj85OSmg_5Ol-CIi4PyR70p4JRUkSY";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

/* -----------------------------
   ELEMENTS
----------------------------- */

const modsGrid = document.getElementById("modsGrid");
const featuredBox = document.getElementById("featuredMod");
const searchBox = document.getElementById("searchBox");
const verifiedFilter = document.getElementById("verifiedFilter");
const statusMsg = document.getElementById("statusMsg");

/* -----------------------------
   GLOBAL DATA
----------------------------- */

let allMods = [];

/* -----------------------------
   FETCH MODS FROM SUPABASE
----------------------------- */

async function fetchMods() {

  const { data, error } = await supabaseClient
    .from("game_mods")
    .select("*")
    .eq("game", "bussid")
    .order("created_at", { ascending: false }); // newest first

  if (error) {
    console.error("Supabase Error:", error);
    statusMsg.textContent = "❌ Failed to load mods.";
    return;
  }

  allMods = data;
  renderMods();
}

/* -----------------------------
   RENDER MODS GRID
----------------------------- */

function renderMods() {
  modsGrid.innerHTML = "";

  let query = searchBox.value.toLowerCase();
  let filter = verifiedFilter.value;

  let filteredMods = allMods.filter((mod) => {
    let name = mod.name || "";
    let desc = mod.description || "";

    let matchesSearch =
      name.toLowerCase().includes(query) ||
      desc.toLowerCase().includes(query);

    let matchesVerified =
      filter === "all" ||
      (filter === "verified" && mod.is_verified === true) ||
      (["bus", "car", "bike", "map", "truck", "helicopter"].includes(filter) && mod.category === filter);
     
    return matchesSearch && matchesVerified;
  });

  if (!filteredMods.length) {
    modsGrid.innerHTML = `<p class="muted">No mods found.</p>`;
    return;
  }

  filteredMods.forEach((mod) => {
    let desc = mod.description || "No description available.";
    let creator = mod.creator || "Unknown Creator";
    let avatar =
      mod.creator_avatar ||
      "https://cdn-icons-png.flaticon.com/512/6388/6388000.png";

    let card = document.createElement("div");
    card.className = "mod-card";
    card.onclick = () => openMod(mod.id);

    card.innerHTML = `
      <div class="mod-cover-wrap">

        <img class="mod-thumb" src="${mod.cover}" alt="${mod.name}">

        ${
          mod.is_verified
            ? `<span class="verified-badge">✔</span>`
            : ""
        }

        <div class="mod-hover-title">
          ${mod.name}
        </div>

      </div>

      <div class="creator-row">
        <img src="${avatar}" alt="Creator">
        <span>${creator}</span>
      </div>
    `;

    modsGrid.appendChild(card);
  });
}

/* -----------------------------
   OPEN MOD DETAIL PAGE
----------------------------- */

function openMod(id) {
  window.location.href = `detail/?id=${id}`;
}

/* -----------------------------
   EVENTS
----------------------------- */

searchBox.addEventListener("input", renderMods);
verifiedFilter.addEventListener("change", renderMods);

/* -----------------------------
   START APP
----------------------------- */

fetchMods();
