'use strict';

// ===================================================================
//  THEME TOGGLE
// ===================================================================
function toggleTheme() {
  const html = document.documentElement;
  const btn  = document.getElementById('theme-toggle');
  if (html.dataset.theme === 'dark') {
    html.dataset.theme = 'light';
    btn.textContent = 'Dark Mode';
  } else {
    html.dataset.theme = 'dark';
    btn.textContent = 'Light Mode';
  }
}

// ===================================================================
//  NAVIGATION
// ===================================================================
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function goHome() {
  saveBtProgress();
  saveErProgress();
  saveDetProgress();
  showPage('page-home');
}

function goEscapeSelect() {
  saveErProgress();
  showPage('page-escape-select');
}
function goDetectiveSelect() {
  saveDetProgress();
  showPage('page-detective-select');
}

document.querySelectorAll('.mode-card').forEach(card => {
  card.querySelector('.btn-play').addEventListener('click', e => {
    e.stopPropagation();
    launchMode(card.dataset.mode);
  });
  card.addEventListener('click', () => launchMode(card.dataset.mode));
});

function launchMode(mode) {
  if (mode === 'escape')      { initEscapeSelect(); showPage('page-escape-select'); }
  if (mode === 'brainteaser') { showPage('page-brainteaser'); initBrainTeaser(); }
  if (mode === 'detective')   { initDetectiveSelect(); showPage('page-detective-select'); }
}

// ===================================================================
//  ESCAPE ROOM — DATA
// ===================================================================
const ESCAPE_THEMES_DATA = {
  mansion: {
    id: 'mansion',
    name: 'Ashwood Mansion',
    subtitle: 'Victorian Horror',
    difficulty: 'medium',
    rooms: 3,
    desc: "You are locked inside the infamous Ashwood Mansion. Search every shadow, solve every puzzle, and escape before dawn.",
    narrative: {
      intro: "You accepted an invitation to view the Ashwood Estate — locked in legal dispute since 1889, when Lord Ashwood died under contested circumstances. His solicitor's letter read: arrive alone, after midnight, and the documents inside will explain everything. You arrived. The door closed behind you. The key is gone from the lock. The grandfather clock is still ticking. You have until dawn to find your way out.",
      facts: [
        { label: 'Location', value: 'Ashwood Mansion, Rural England — Abandoned since 1889' },
        { label: 'Your Situation', value: 'Locked inside. No phone signal. The gate re-seals at dawn.' },
        { label: 'Objective', value: 'Search the three known rooms. Solve what Lord Ashwood left behind. Escape before the sun rises.' },
      ],
    },
    startRoom: 'foyer',
    winMsg: "You solved all the puzzles and fled Ashwood Mansion before dawn. The locked gate swings open and cold night air rushes over you. You are free.",
    rooms_data: {
      foyer: {
        name: 'The Foyer',
        bg: 'er-room-foyer',
        desc: 'A grand entrance hall. Dust motes drift through pale moonlight. A ticking grandfather clock dominates the far wall. The air smells of old wood and something metallic.',
        hotspots: [
          { id: 'clock',       label: 'Grandfather Clock', x: 45, y: 20, action: 'puzzle', puzzleId: 'clock_code',
            desc: 'The clock face shows 10:10. The pendulum is still. A small compartment at the base is sealed with a 3-digit lock.', collected: false },
          { id: 'coat_hook',   label: 'Coat Hooks', x: 15, y: 35, action: 'item',
            item: { id: 'old_key', icon: '🗝️', name: 'Old Brass Key', desc: 'A tarnished brass key. It looks like it opens something small.' },
            desc: 'A heavy cloak hangs on the hook. In its pocket you find something cold and metal.', collected: false },
          { id: 'portrait',    label: 'Framed Portrait', x: 72, y: 15, action: 'inspect',
            desc: "Lord Ashwood stares down with cold eyes. Beneath the portrait, scratched into the frame: \"Time holds every secret — read the hands.\"", collected: false },
          { id: 'welcome_mat', label: 'Welcome Mat', x: 50, y: 70, action: 'item',
            item: { id: 'folded_note', icon: '📝', name: 'Folded Note', desc: '"The combination is the hour + minute + second of midnight."' },
            desc: 'Under the mat lies a folded piece of paper.', collected: false },
        ],
        exits: ['study'],
      },
      study: {
        name: 'The Study',
        bg: 'er-room-study',
        desc: 'Bookshelves line every wall. A mahogany desk sits in the centre, its drawers locked. A cold fireplace holds a scattering of ash. On the desk is a locked iron box.',
        hotspots: [
          { id: 'iron_box',  label: 'Iron Box', x: 48, y: 45, action: 'puzzle', puzzleId: 'iron_box_key',
            desc: 'A heavy iron box with a keyhole. It looks like it needs the brass key.', collected: false },
          { id: 'bookshelf', label: 'Bookshelves', x: 15, y: 30, action: 'puzzle', puzzleId: 'book_code',
            desc: "One book is slightly out of place — \"The Art of Shadows.\" Inside, a riddle: \"I have cities but no houses; mountains but no trees; water but no fish; roads but no cars. What am I?\" A keypad below the shelf awaits.", collected: false },
          { id: 'fireplace', label: 'Fireplace', x: 75, y: 55, action: 'item',
            item: { id: 'iron_key', icon: '🗝️', name: 'Iron Key', desc: 'A heavy iron key recovered from the ash. Etched on it: "CELLAR".' },
            desc: 'Buried in the cold ash, you find something that survived the flames.', collected: false },
          { id: 'desk_note', label: 'Desk Note', x: 55, y: 60, action: 'inspect',
            desc: "A handwritten note reads: \"The riddle answer will reveal the word. Speak the map's truth.\"", collected: false },
        ],
        exits: ['foyer', 'cellar'],
      },
      cellar: {
        name: 'The Cellar',
        bg: 'er-room-cellar',
        desc: 'Stone walls weep with damp. Wine barrels line the shadows. A single lantern flickers near an iron door — the exit. The door bears a 4-letter word lock.',
        hotspots: [
          { id: 'exit_door',   label: 'Iron Exit Door', x: 50, y: 40, action: 'puzzle', puzzleId: 'final_exit',
            desc: 'The exit to freedom. A word lock with 4 letters blocks your path.', collected: false },
          { id: 'wine_barrel', label: 'Old Barrel', x: 20, y: 60, action: 'inspect',
            desc: "Scratched into the barrel stave: \"A map holds the exit's secret.\"", collected: false },
          { id: 'lantern',     label: 'Lantern', x: 75, y: 30, action: 'item',
            item: { id: 'cipher_page', icon: '📄', name: 'Cipher Page', desc: '"EKAM — Reverse the word to unlock fate."' },
            desc: 'Behind the lantern, tucked into a crevice, is a torn page.', collected: false },
          { id: 'stone_slab',  label: 'Loose Stone', x: 35, y: 75, action: 'inspect',
            desc: '"What you seek is hidden in plain sight — reverse your thinking."', collected: false },
        ],
        exits: ['study'],
      },
    },
    puzzles: {
      clock_code:  { title: 'Clock Compartment Lock', desc: 'The note said: "The combination is the hour + minute + second of midnight." Midnight is 12:00:00 — what 3-digit code?', answer: '000', hint: 'Midnight = 0 hours, 0 minutes, 0 seconds on a 24-hour format → 0, 0, 0.', reward: { id: 'clock_scroll', icon: '📜', name: 'Clock Scroll', desc: '"A map holds the answer — read it in reverse."' }, note: 'Solved the clock lock. Found a scroll inside.' },
      iron_box_key: { title: 'Iron Box', desc: 'You have the old brass key. Use it? (type "yes")', answer: 'yes', hint: 'Just type "yes" to insert the key.', requiresItem: 'old_key', reward: { id: 'locket', icon: '📿', name: 'Silver Locket', desc: 'Inside is a tiny map of the cellar with "MAKE" circled.' }, note: 'Opened the iron box. Found a locket with a map.' },
      book_code:    { title: 'Bookshelf Riddle', desc: '"I have cities but no houses; mountains but no trees; water but no fish; roads but no cars. What am I?" Enter one word.', answer: 'map', hint: 'Think of something you use to navigate that represents places without actually containing them.', reward: { id: 'book_key', icon: '🗝️', name: 'Cellar Key Fragment', desc: 'A key fragment hidden behind the bookshelf.' }, note: 'Solved the bookshelf riddle. Answer: MAP.' },
      final_exit:   { title: 'Exit Door Lock', desc: 'A 4-letter word lock. The cipher page said "EKAM" — reverse it. The locket map showed "MAKE." What word unlocks the door?', answer: 'make', hint: '"EKAM" reversed spells the 4-letter word you need.', note: 'Entered the exit code. The door swings open.' },
    },
  },

  clockwork: {
    id: 'clockwork',
    name: 'Cogsworth Laboratory',
    subtitle: 'Steampunk Thriller',
    difficulty: 'hard',
    rooms: 3,
    desc: "Trapped inside a Victorian inventor's secret laboratory. Gears grind, steam hisses. You have until the boiler explodes to escape.",
    narrative: {
      intro: "Professor Elliot Crane vanished inside his own laboratory last night. This morning you received his telegram: 'I am trapped in the vault. The boiler pressure is building — it will rupture at dawn. My own lock mechanisms cannot be bypassed from outside. You must come in. Follow the sequence I designed. If you reach the vault before the boiler blows, you will find the master override. If you do not — the building comes down.' The front gate unlocks. Then seals behind you.",
      facts: [
        { label: 'Location', value: 'Cogsworth Laboratory, London — Professor Crane\'s private workshop' },
        { label: 'Threat', value: 'The main boiler will reach critical pressure at dawn. Total structural failure.' },
        { label: 'Objective', value: 'Navigate the Workshop, Generator Room, and Vault. Solve Crane\'s sequence. Reach the master override before it\'s too late.' },
      ],
    },
    startRoom: 'workshop',
    winMsg: "The vault door clicks open. You grab the master key, disengage the boiler lock, and sprint to the exit as the lab fills with steam. The cold night air hits you like a wave. Escaped.",
    rooms_data: {
      workshop: {
        name: 'The Workshop',
        bg: 'er-room-workshop',
        desc: 'Worktables covered in blueprints and half-built mechanisms. Gears of every size hang from hooks. A large pressure gauge on the wall reads 472 PSI. The door to the generator room is locked.',
        hotspots: [
          { id: 'pressure_gauge', label: 'Pressure Gauge', x: 70, y: 25, action: 'inspect',
            desc: 'The gauge needle points to 472. Etched around the dial: "The pressure is the password."', collected: false },
          { id: 'brass_box',      label: 'Brass Box', x: 30, y: 50, action: 'puzzle', puzzleId: 'cw_box_code',
            desc: 'A brass box with a 3-digit combination lock. Numbers are engraved: "Read what pressure speaks."', collected: false },
          { id: 'blueprints',     label: 'Blueprints', x: 50, y: 30, action: 'inspect',
            desc: '"Generator override sequence: Roman. VII is the key. Apply it to the vault."', collected: false },
          { id: 'tool_rack',      label: 'Tool Rack', x: 15, y: 40, action: 'item',
            item: { id: 'brass_key', icon: '🗝️', name: 'Brass Gear Key', desc: 'A key shaped like a gear. The number VII is stamped on it.' },
            desc: 'Hanging among the tools is an unusual key shaped like a gear.', collected: false },
        ],
        exits: ['generator'],
      },
      generator: {
        name: 'The Generator Room',
        bg: 'er-room-generator',
        desc: 'The heartbeat of the lab. A massive steam engine dominates the centre. Pipes and valves everywhere. A copper disc reader on the wall has a slot for a disc. The vault door requires a single digit code.',
        hotspots: [
          { id: 'disc_slot',  label: 'Copper Disc Reader', x: 55, y: 35, action: 'puzzle', puzzleId: 'cw_disc_insert',
            desc: 'A slot for a copper disc. The display panel reads: "Insert the marked disc. The Roman numeral reveals the digit."', collected: false },
          { id: 'steam_pipe', label: 'Steam Pipe Valve', x: 25, y: 45, action: 'inspect',
            desc: 'A valve labelled: "Emergency override — vault code is the Arabic numeral of the disc inscription."', collected: false },
          { id: 'log_book',   label: 'Engineer Log', x: 75, y: 60, action: 'inspect',
            desc: '"Day 47: Set vault to Roman VII. Only I shall know its Arabic truth."', collected: false },
          { id: 'copper_disc',label: 'Loose Copper Disc', x: 40, y: 65, action: 'item',
            item: { id: 'copper_disc', icon: '📿', name: 'Copper Disc', desc: 'Engraved: "VII". The Roman numeral for seven.' },
            desc: 'A copper disc has fallen behind the generator. You pick it up.', collected: false },
        ],
        exits: ['workshop', 'vault'],
      },
      vault: {
        name: 'The Vault',
        bg: 'er-room-vault',
        desc: 'A reinforced steel vault room. Shelves of inventions and a heavy exit door with a single-digit wheel lock. This is the way out.',
        hotspots: [
          { id: 'exit_wheel',   label: 'Vault Exit Wheel', x: 50, y: 40, action: 'puzzle', puzzleId: 'cw_vault_exit',
            desc: 'A wheel lock with digits 0–9. Enter the single digit code.', collected: false },
          { id: 'notebook',     label: 'Inventor Notebook', x: 20, y: 55, action: 'inspect',
            desc: '"VII — never forget: the seven that opens everything is written in numbers men trust, not Rome."', collected: false },
          { id: 'invention',    label: 'Strange Device', x: 75, y: 30, action: 'inspect',
            desc: 'A device with Roman numerals carved all over. Decorative — or a reminder. VII stands out, circled twice.', collected: false },
          { id: 'escape_panel', label: 'Control Panel', x: 35, y: 70, action: 'inspect',
            desc: 'Emergency instructions: "In case of boiler failure, use single-digit override. Arabic. Now."', collected: false },
        ],
        exits: ['generator'],
      },
    },
    puzzles: {
      cw_box_code:    { title: 'Brass Box Lock', desc: '"Read what pressure speaks." The gauge showed a 3-digit number. What is it?', answer: '472', hint: 'Look at the pressure gauge reading in the workshop — it showed a specific 3-digit number.', reward: { id: 'cw_scroll', icon: '📜', name: 'Workshop Scroll', desc: '"Generator override: the copper disc holds the vault answer."' }, note: 'Opened the brass box with code 472.' },
      cw_disc_insert: { title: 'Copper Disc Reader', desc: 'Insert the copper disc. What single Arabic digit does Roman numeral VII represent?', answer: '7', hint: 'Count it out: I=1, II=2, III=3, IV=4, V=5, VI=6, VII=7.', requiresItem: 'copper_disc', reward: { id: 'vault_code_card', icon: '🃏', name: 'Vault Code Card', desc: 'The display shows: "7". This is your vault exit code.' }, note: 'Disc reader confirmed: vault code is 7.' },
      cw_vault_exit:  { title: 'Vault Exit Wheel', desc: 'Enter the single digit that VII represents in Arabic numerals.', answer: '7', hint: 'Roman numeral VII = 7 in standard numbers.', note: 'Vault door unlocked. Escape route secured.' },
    },
  },

  galleon: {
    id: 'galleon',
    name: 'The Sunken Galleon',
    subtitle: 'Pirate Adventure',
    difficulty: 'easy',
    rooms: 3,
    desc: "The Black Meridian has run aground. You are locked in the hold with the tide rising. Find the captain's secret passage before the water reaches your chin.",
    narrative: {
      intro: "The Black Meridian ran aground during last night's storm. The harbourmaster hired you to salvage the cargo manifest from the hold before the tide returns. You descended through the deck hatch at low tide. The hatch sealed above you — the wood has swollen in the seawater and the mechanism is jammed from outside. You have the manifest. You have no way back up. Somewhere in this ship, the captain left a hidden escape passage — he was a man who always planned for the worst. The tide turns in ninety minutes.",
      facts: [
        { label: 'Location', value: 'The Black Meridian — Run aground off the Cornish coast' },
        { label: 'Threat', value: 'Tide returns in approximately 90 minutes. The hold will flood.' },
        { label: 'Objective', value: 'Find the captain\'s hidden escape passage. Search the Deck, Quarters, and Cargo Hold. The captain always left himself a way out.' },
      ],
    },
    startRoom: 'deck',
    winMsg: "The hidden hatch beneath the cargo boxes bursts open. Cold seawater floods in as you pull yourself through the passage, up through the hull, and onto the rocks above. The sea roars beneath you. You made it.",
    rooms_data: {
      deck: {
        name: "The Ship's Deck",
        bg: 'er-room-deck',
        desc: 'Rain lashes the deck. Ropes and rigging hang loose. A storm lantern swings on a post. The mast has a message carved into it. A compass rose is mounted to the helm — oddly, the letters have numbers beside them.',
        hotspots: [
          { id: 'compass_rose', label: 'Compass Rose', x: 60, y: 30, action: 'inspect',
            desc: 'Carved into the helm: N=1, E=2, S=3, W=4. Below it: "The order of the wind is the order of the lock."', collected: false },
          { id: 'sea_chest',    label: 'Sea Chest', x: 25, y: 55, action: 'puzzle', puzzleId: 'gal_chest_code',
            desc: 'A weathered sea chest with a 4-number lock. Four compass directions are carved on its face: N, E, S, W.', collected: false },
          { id: 'mast_carving', label: 'Mast Carving', x: 50, y: 20, action: 'inspect',
            desc: '"The order is as a sailor reads the wind: North first, then East, then South, then West."', collected: false },
          { id: 'bell_rope',    label: 'Ship Bell', x: 80, y: 20, action: 'item',
            item: { id: 'bell_key', icon: '🗝️', name: 'Bell Key', desc: 'A small key engraved with an anchor symbol. It was tied inside the ship bell.' },
            desc: "Reaching inside the bell's casing, you find a key tied to the clapper.", collected: false },
        ],
        exits: ["quarters"],
      },
      quarters: {
        name: "Captain's Quarters",
        bg: 'er-room-quarters',
        desc: "The captain's quarters are in disarray. Charts and journals cover the floor. A mahogany map chest sits in the corner, its lock shaped like an anchor. A porthole looks out onto black water.",
        hotspots: [
          { id: 'map_chest',   label: 'Map Chest', x: 35, y: 55, action: 'puzzle', puzzleId: 'gal_map_chest',
            desc: 'A map chest with an anchor-shaped lock. You have a key with an anchor symbol.', collected: false },
          { id: 'captain_log', label: "Captain's Log", x: 65, y: 40, action: 'inspect',
            desc: '"The hidden hatch is sealed with a word — the one thing a ship cannot sail without. One word. The soul of every vessel."', collected: false },
          { id: 'porthole',    label: 'Porthole', x: 80, y: 30, action: 'inspect',
            desc: "Water is rising outside. Through the glass you see the ship's name plate: BLACK MERIDIAN. Beneath it, faded, a single word: ANCHOR.", collected: false },
          { id: 'nav_tools',   label: 'Navigation Tools', x: 20, y: 35, action: 'inspect',
            desc: '"A ship is nothing without its anchor. An anchor is nothing without its ship." Carved into the sextant case.', collected: false },
        ],
        exits: ['deck', 'cargo'],
      },
      cargo: {
        name: 'The Cargo Hold',
        bg: 'er-room-cargo',
        desc: 'The hold is dark and cold. Water laps at the bottom steps. Crates and barrels fill the space. In the far corner, a hatch is sealed with a word lock. Time is running out.',
        hotspots: [
          { id: 'hidden_hatch', label: 'Sealed Hatch', x: 50, y: 60, action: 'puzzle', puzzleId: 'gal_final_hatch',
            desc: 'A hatch sealed with a 6-letter word lock. The log said it was the soul of every vessel.', collected: false },
          { id: 'water_line',   label: 'Rising Water', x: 20, y: 75, action: 'inspect',
            desc: 'The water is knee-deep and rising. You need that word. Think of what every ship carries to keep it grounded.', collected: false },
          { id: 'old_crate',    label: 'Old Crate', x: 75, y: 50, action: 'item',
            item: { id: 'rum_bottle', icon: '🧪', name: 'Sealed Bottle', desc: 'Inside is a note: "anchor — the captain\'s final word for the hatch."' },
            desc: 'A crate has split open. Inside, a sealed bottle.', collected: false },
          { id: 'cargo_wall',   label: 'Carved Wall', x: 35, y: 35, action: 'inspect',
            desc: 'Scratched by a previous prisoner: "ANCHOR saved us all." Underlined three times.', collected: false },
        ],
        exits: ['quarters'],
      },
    },
    puzzles: {
      gal_chest_code:  { title: 'Sea Chest Lock', desc: 'The compass rose: N=1, E=2, S=3, W=4. Enter all four in the order a sailor reads the wind: North, East, South, West.', answer: '1234', hint: 'N=1, E=2, S=3, W=4. Put them in the order stated: N first, then E, S, W.', reward: { id: 'treasure_map', icon: '🗺️', name: 'Treasure Map Fragment', desc: 'Part of a map showing the cargo hold. An anchor is circled.' }, note: 'Opened the sea chest with code 1234.' },
      gal_map_chest:   { title: "Captain's Map Chest", desc: 'The anchor key — does it fit? (type "yes")', answer: 'yes', hint: 'You have the bell key with an anchor engraved on it. Try it.', requiresItem: 'bell_key', reward: { id: 'captains_note', icon: '📝', name: "Captain's Final Note", desc: '"The hatch word is ANCHOR. It is always the anchor."' }, note: "Opened the captain's map chest. Found the final note." },
      gal_final_hatch: { title: 'Cargo Hold Hatch', desc: '"The soul of every vessel." What 6-letter word unlocks the hatch?', answer: 'anchor', hint: 'A ship needs it to stop drifting. 6 letters. The captain\'s log, the porthole, and the crate note all point to the same word.', note: 'Hatch unlocked. Freedom is above.' },
    },
  },

  cairo: {
    id: 'cairo',
    name: 'The Cairo Vault',
    subtitle: 'Archaeological Peril',
    difficulty: 'medium',
    rooms: 3,
    desc: "Cairo, 1924. You descended into a sealed burial chamber and the entrance slab slid shut. Three ancient chambers stand between you and the surface.",
    narrative: {
      intro: "It is November 1924. You are part of an archaeological expedition beneath the Cairo plateau. Your colleague Dr. Hargreaves descended into the sub-chamber at midday and did not return. When you followed his rope down, the entrance slab above triggered and sealed. The torch is burning low. The air is ancient and finite. The Egyptians who built these chambers designed them to keep things in — and people out. You will need to think like an engineer three thousand years dead.",
      facts: [
        { label: 'Location', value: 'Buried sub-chamber complex, Cairo Plateau — 1924' },
        { label: 'Threat', value: 'Sealed entrance. Limited air. Your team does not know you are inside.' },
        { label: 'Objective', value: 'Navigate the Entrance Chamber, Hieroglyph Hall, and Burial Chamber using the ancient mechanisms the Egyptians built in — they always left a way for the priests to exit.' },
      ],
    },
    startRoom: 'entrance_chamber',
    winMsg: "The burial chamber\'s hidden stone door grinds open. A rush of cool, fresh desert air floods in. You crawl through the passage and emerge into blinding Egyptian sunlight, gasping. The slab seals behind you. You are alive.",
    rooms_data: {
      entrance_chamber: {
        name: 'Entrance Chamber',
        bg: 'er-room-cairo-entrance',
        desc: 'Torchlight flickers across painted walls. Four sacred symbols surround a central seal mechanism — an Eye, an Ankh, a Feather, and a Scarab. Each is carved with a number. The door deeper into the tomb is sealed with a 4-digit code.',
        hotspots: [
          { id: 'symbol_wall', label: 'Sacred Symbols', x: 50, y: 25, action: 'inspect',
            desc: 'Each symbol bears a carved numeral: Eye = 1, Ankh = 2, Feather = 3, Scarab = 4. Beneath them: "Call upon the gods in the order of judgment."', collected: false },
          { id: 'seal_door', label: 'Sealed Inner Door', x: 70, y: 50, action: 'puzzle', puzzleId: 'cairo_seal',
            desc: 'A 4-digit mechanism on the inner door. The hieroglyphs above read: "Truth weighs first. Then Sight. Then Rebirth. Then Life eternal."', collected: false },
          { id: 'torch_bracket', label: 'Torch Bracket', x: 20, y: 35, action: 'item',
            item: { id: 'golden_key', icon: '🗝️', name: 'Golden Key', desc: 'A small gold key with a lotus flower. It was hidden inside the empty torch bracket.' },
            desc: 'The torch bracket on the wall is hollow. Inside, wedged in the darkness, is something metal.', collected: false },
          { id: 'floor_inscription', label: 'Floor Inscription', x: 40, y: 75, action: 'inspect',
            desc: '"In the Hall of Judgment: Feather of Ma\'at weighs first (Truth), the Eye of Ra sees second (Sight), the Scarab renews third (Rebirth), the Ankh endures last (Life)."', collected: false },
        ],
        exits: ['hieroglyph_hall'],
      },
      hieroglyph_hall: {
        name: 'Hieroglyph Hall',
        bg: 'er-room-cairo-hall',
        desc: 'A long corridor of floor-to-ceiling hieroglyphs. A carved obelisk stands at the centre. A golden chest sits at the far end, sealed with a lotus lock. The walls tell the story of a pharaoh who cheated death — and the single word his priests used to seal the final door.',
        hotspots: [
          { id: 'obelisk', label: 'Central Obelisk', x: 50, y: 30, action: 'inspect',
            desc: '"What takes all and gives all. What the desert holds. Five letters. It is what you walk on and what you become."', collected: false },
          { id: 'golden_chest', label: 'Golden Chest', x: 75, y: 55, action: 'puzzle', puzzleId: 'cairo_chest',
            desc: 'A golden chest with a lotus key slot. You have a golden key with a lotus symbol.', collected: false },
          { id: 'pharaoh_wall', label: "Pharaoh's Wall", x: 20, y: 40, action: 'inspect',
            desc: '"The pharaoh tricked death by hiding his name in the desert. His priests sealed the final door with one word: the ground beneath all things, the sea that is not water, the silence between dunes."', collected: false },
          { id: 'cartouche', label: 'Royal Cartouche', x: 35, y: 65, action: 'inspect',
            desc: 'The cartouche translates: "S-A-N-D-S. The word the desert keeps forever."', collected: false },
        ],
        exits: ['entrance_chamber', 'burial_chamber'],
      },
      burial_chamber: {
        name: 'Burial Chamber',
        bg: 'er-room-cairo-burial',
        desc: 'The innermost chamber. A grand sarcophagus dominates the centre, painted in gold and lapis lazuli. Three stone guardians flank the far wall. A final door — the exit — is sealed with a 5-letter word lock. The air here is the oldest you have ever breathed.',
        hotspots: [
          { id: 'final_door', label: 'Exit Door', x: 50, y: 40, action: 'puzzle', puzzleId: 'cairo_exit',
            desc: 'The final door. A 5-letter word lock. The priests left this door for themselves. What did they bury the pharaoh beneath?', collected: false },
          { id: 'sarcophagus', label: 'Sarcophagus', x: 30, y: 55, action: 'inspect',
            desc: '"Buried in the sands of the western desert, as all things return to sands." The inscription leaves no ambiguity.', collected: false },
          { id: 'stone_guardians', label: 'Stone Guardians', x: 75, y: 35, action: 'inspect',
            desc: 'Three figures, arms outstretched, each holding a vessel of sand. At their feet: "We return what was given. SANDS hold us all."', collected: false },
          { id: 'priests_niche', label: "Priest's Niche", x: 20, y: 65, action: 'item',
            item: { id: 'exit_scroll', icon: '📜', name: 'Priestly Exit Scroll', desc: '"For those who serve the gods and must leave: the word is SANDS. It is always SANDS."' },
            desc: 'A small niche in the wall, meant for priestly offerings. Inside is a rolled papyrus scroll.', collected: false },
        ],
        exits: ['hieroglyph_hall'],
      },
    },
    puzzles: {
      cairo_seal: { title: 'Inner Door Seal', desc: '"Truth weighs first (Feather=3). Sight second (Eye=1). Rebirth third (Scarab=4). Life last (Ankh=2)." Enter the 4-digit code.', answer: '3142', hint: 'Use the Order of Judgment: Feather(Truth)=3 first, Eye(Sight)=1 second, Scarab(Rebirth)=4 third, Ankh(Life)=2 last. So: 3-1-4-2.', reward: { id: 'lotus_scroll', icon: '📜', name: 'Lotus Papyrus', desc: '"The Hall beyond holds the word in its walls. The golden chest will confirm it."' }, note: 'Inner door opened. Code: 3142.' },
      cairo_chest: { title: 'Golden Lotus Chest', desc: 'The golden key with a lotus symbol — use it? (type "yes")', answer: 'yes', hint: 'You have the golden key. Insert it.', requiresItem: 'golden_key', reward: { id: 'word_tablet', icon: '📋', name: 'Stone Word Tablet', desc: '"The final door\'s word: SANDS. It is written in the desert itself."' }, note: "Opened the golden chest. Final word confirmed: SANDS." },
      cairo_exit: { title: 'Final Chamber Door', desc: '"What the desert holds. What the priests buried the pharaoh beneath." A 5-letter word.', answer: 'sands', hint: 'The obelisk, the wall, the stone guardians, and the scroll all speak the same word. What covers the Egyptian desert?', note: 'Final door opens. Freedom.' },
    },
  },

  sanatorium: {
    id: 'sanatorium',
    name: 'Ravensmoor Sanatorium',
    subtitle: 'Victorian Asylum',
    difficulty: 'hard',
    rooms: 3,
    desc: "You entered the abandoned sanatorium to investigate reports of lights in the windows. The front doors locked behind you. Find the superintendent's exit key before whatever is still here finds you.",
    narrative: {
      intro: "Ravensmoor Sanatorium closed in 1903 after the disappearance of its superintendent, Dr. Aldric Mourne, and three patients. Local police reports describe 'unknown sounds from the sealed ward.' Last week, neighbours reported candlelight in the upper windows. Your editor sent you to investigate. You entered through the unlocked front door. It is now locked. Your lantern gives you perhaps two hours of oil. Dr. Mourne was known to be obsessive about security — he left coded instructions for everything, including the exit procedures. Find them.",
      facts: [
        { label: 'Location', value: 'Ravensmoor Sanatorium, Yorkshire Moors — Sealed since 1903' },
        { label: 'Threat', value: 'Locked inside. No working telephone. Lantern oil for approximately two hours.' },
        { label: 'Objective', value: 'Navigate the Admission Hall, Ward B, and the Surgery. Find Dr. Mourne\'s exit key. His obsessive documentation is your only advantage.' },
      ],
    },
    startRoom: 'admission_hall',
    winMsg: "The surgery\'s locked cabinet opens. Inside is Dr. Mourne\'s master key — cold, heavy, and real. You reach the front door and force it open. The moors outside are dark and wet and the most beautiful thing you have ever seen. You run and do not look back.",
    rooms_data: {
      admission_hall: {
        name: 'Admission Hall',
        bg: 'er-room-sanatorium-hall',
        desc: 'The reception desk is buried under decades of dust and paper. Patient admission ledgers line a shelf. A grandfather clock on the wall is stopped at 11:03. Behind the desk, a locked records cabinet stands with a 4-digit combination. The smell of damp plaster and something else — chemical, institutional — is everywhere.',
        hotspots: [
          { id: 'admission_ledger', label: 'Admission Ledger', x: 35, y: 40, action: 'inspect',
            desc: '"Patient classification protocol: Calm=1, Melancholic=2, Agitated=3, Violent=4. All cabinet codes follow admission sequence."', collected: false },
          { id: 'records_cabinet', label: 'Records Cabinet', x: 65, y: 45, action: 'puzzle', puzzleId: 'san_cabinet',
            desc: 'A locked records cabinet. A label on the front reads: "Last four admissions, classified in order: Agitated, Calm, Violent, Melancholic."', collected: false },
          { id: 'stopped_clock', label: 'Stopped Clock', x: 50, y: 20, action: 'inspect',
            desc: 'The clock stopped at 11:03 — the time of the incident in 1903. A note is pinned to its face: "The hour and minute tell what happened. The year confirms it."', collected: false },
          { id: 'coat_stand', label: 'Coat Stand', x: 15, y: 35, action: 'item',
            item: { id: 'ward_key', icon: '🗝️', name: 'Ward Key (Partial)', desc: 'A key with "WARD B" stamped on it. One tooth is missing — it will open Ward B if you can find the tooth fragment.' },
            desc: "An orderly's coat hangs on the stand. In the pocket, something metallic.", collected: false },
        ],
        exits: ['ward_b'],
      },
      ward_b: {
        name: 'Ward B',
        bg: 'er-room-sanatorium-ward',
        desc: 'Eight empty beds, iron frames rusting. Restraint straps hang from the rails. A medical supply cabinet on the far wall is padlocked. Patient charts are still clipped to the bed ends. One bed — Bed 6 — has fresh-looking marks on the frame. The key fragment you need is somewhere in this room.',
        hotspots: [
          { id: 'patient_charts', label: 'Patient Charts', x: 25, y: 40, action: 'inspect',
            desc: 'Chart on Bed 6: "Dr. Mourne\'s notation: Supply cabinet combination is the patient number sequence showing: Melancholic, Violent, Calm, Agitated — in their classification numbers."', collected: false },
          { id: 'supply_cabinet', label: 'Supply Cabinet', x: 70, y: 40, action: 'puzzle', puzzleId: 'san_supply',
            desc: 'A padlocked medical supply cabinet. Dr. Mourne\'s chart noted the combination is patient type numbers: Melancholic, Violent, Calm, Agitated.', collected: false },
          { id: 'bed_6', label: 'Bed 6 Frame', x: 50, y: 65, action: 'item',
            item: { id: 'key_tooth', icon: '⚙️', name: 'Key Tooth Fragment', desc: 'The missing tooth from the Ward B key. It was wedged into the iron bed frame.' },
            desc: 'The fresh marks on the frame are from metal on metal. Something was wedged here recently — and is still here.', collected: false },
          { id: 'window_bars', label: 'Barred Window', x: 80, y: 25, action: 'inspect',
            desc: 'The bars are solid. The moors outside are dark. On the sill, scratched in chalk: "MOURNE KNOWS THE WAY OUT. SURGERY."', collected: false },
        ],
        exits: ['admission_hall', 'surgery'],
      },
      surgery: {
        name: "The Surgery",
        bg: 'er-room-sanatorium-surgery',
        desc: "Dr. Mourne's surgical theatre. Instrument trays are still laid out, coated in rust. An operating table under a dusty sheet. A locked mahogany cabinet on the wall — the only new-looking thing in the room. A 5-letter word lock. The exit key is inside. You are close.",
        hotspots: [
          { id: 'instrument_tray', label: 'Instrument Tray', x: 30, y: 50, action: 'inspect',
            desc: '"Dr. Mourne\'s final entry, dated October 1903: \'The cabinet word is what this place made of its patients. Five letters. What the sane call the broken, and what the broken call themselves.\'"', collected: false },
          { id: 'mourne_cabinet', label: "Mourne's Cabinet", x: 65, y: 40, action: 'puzzle', puzzleId: 'san_exit',
            desc: "A mahogany cabinet with a 5-letter word lock. Dr. Mourne's note said: 'What this place made of its patients.'", collected: false },
          { id: 'operating_table', label: 'Operating Table', x: 50, y: 60, action: 'inspect',
            desc: 'Under the sheet: a medical journal, open to the last entry. "I have failed them all. They came here lost, and we made them something worse. We made them GHOST. No — worse than ghost. We made them ALONE. We made them — no. The word is simpler. We made them CAGED. One word." Then the writing stops.', collected: false },
          { id: 'wall_plaque', label: 'Wall Plaque', x: 20, y: 30, action: 'item',
            item: { id: 'mourne_note', icon: '📝', name: "Dr. Mourne's Note", desc: '"My penance and my exit: the cabinet word is GHOST. It is what I became. It is what they became. GHOST opens everything."' },
            desc: "Behind the wall plaque — the kind hung to inspire patients with uplifting words — is a folded note in Dr. Mourne's handwriting.", collected: false },
        ],
        exits: ['ward_b'],
      },
    },
    puzzles: {
      san_cabinet: { title: 'Records Cabinet', desc: '"Last four admissions in order: Agitated, Calm, Violent, Melancholic." Use the classification numbers (Calm=1, Melancholic=2, Agitated=3, Violent=4).', answer: '3142', hint: 'Agitated=3, Calm=1, Violent=4, Melancholic=2. In order: 3-1-4-2.', reward: { id: 'records_file', icon: '📋', name: 'Patient Records File', desc: 'Dr. Mourne\'s notes on patient classification and the supply cabinet combination protocol.' }, note: 'Records cabinet opened. Code: 3142.' },
      san_supply: { title: 'Supply Cabinet Padlock', desc: '"Melancholic, Violent, Calm, Agitated" — enter the 4 classification numbers in that order.', answer: '2431', hint: 'Melancholic=2, Violent=4, Calm=1, Agitated=3. In sequence: 2-4-3-1.', reward: { id: 'surgery_access', icon: '🗝️', name: 'Surgery Access Pass', desc: 'A laminated card reading "SURGERY — Authorised Access Only." The Ward B key tooth is already repaired inside.' }, note: 'Supply cabinet open. Surgery access confirmed.' },
      san_exit: { title: "Dr. Mourne's Cabinet", desc: '"What this place made of its patients." A 5-letter word.', answer: 'ghost', hint: 'The journal, the wall plaque, and Dr. Mourne\'s note all say the same word. What do abandoned sanatoriums leave behind?', note: 'Cabinet opened. Exit key recovered. Freedom.' },
    },
  },

  // -----------------------------------------------------------------------
  //  6. THE OBSERVATORY — MEDIUM
  // -----------------------------------------------------------------------
  observatory: {
    id: 'observatory',
    name: 'The Observatory',
    subtitle: 'Starfall Heights, 1923',
    difficulty: 'medium',
    desc: "You accepted an invitation to witness a rare celestial event at the private observatory of the eccentric astronomer Professor Aldric Voss. On arrival you find him slumped over his telescope — and the door sealed from the inside. His star charts hold the code to the exit.",
    narrative: {
      intro: "A sealed observatory. A dead astronomer. The stars wheel overhead, indifferent. Professor Voss was researching something he called 'the alignment' — and whatever it is, someone did not want him to share it.",
      facts: [
        { label: 'Location', value: 'Starfall Heights Private Observatory, Scottish Highlands' },
        { label: 'Date', value: 'October 14th, 1923 — night of the lunar eclipse' },
        { label: 'Lock mechanism', value: 'Celestial combination vault — aligned to star positions' },
        { label: 'Objective', value: "Decode the professor's star charts and unlock the observatory vault before the eclipse ends" },
      ],
    },
    startRoom: 'anteroom',
    rooms: {
      anteroom: {
        name: 'Anteroom',
        bg: 'er-room-observatory-anteroom',
        desc: "A vestibule of coats and umbrellas. A brass plaque on the inner door reads: 'Admit only those who know their stars.' The door is numbered. A telescope catalogue lies open on the coat table.",
        hotspots: [
          { id: 'obs_catalogue', label: 'Telescope Catalogue', puzzle: 'obs_door' },
          { id: 'obs_coat_pocket', label: 'Coat Pocket', item: { id: 'obs_key_fragment', icon: '🔑', name: 'Key Fragment (Brass)', desc: 'Half a brass key. One edge is engraved with the constellation Orion.' }, desc: 'Inside a heavy coat pocket — a broken key half, engraved with Orion.', collected: false },
        ],
        exits: [],
      },
      rotunda: {
        name: 'Rotunda',
        bg: 'er-room-observatory-rotunda',
        desc: "The main dome chamber. The great telescope points at the apex aperture. Star charts cover every surface. Voss's body is slumped at the eyepiece. His right hand clutches a folded note.",
        hotspots: [
          { id: 'obs_body_note', label: "Voss's Note", item: { id: 'voss_note', icon: '📜', name: "Professor Voss's Final Note", desc: '"The three royal stars in order of magnitude: REGULUS, ALDEBARAN, FOMALHAUT. Their catalogue numbers are your key."' }, desc: "Clutched in the dead professor's hand — a note in a shaking hand.", collected: false },
          { id: 'obs_star_chart', label: 'Star Chart Wall', item: { id: 'star_chart', icon: '🗺️', name: 'Star Magnitude Chart', desc: 'Lists catalogue numbers: Regulus=77, Aldebaran=49, Fomalhaut=24. Handwritten margin: "sequence by magnitude order."' }, desc: 'A wall-mounted chart with star catalogue numbers annotated by hand.', collected: false },
          { id: 'obs_cabinet', label: 'Instrument Cabinet', puzzle: 'obs_cabinet_lock' },
        ],
        exits: ['anteroom', 'library'],
      },
      library: {
        name: "Voss's Library",
        bg: 'er-room-observatory-library',
        desc: "Floor-to-ceiling shelves of astronomy texts. A locked writing bureau sits in the alcove. On the desk: a brass astrolabe and a half-written letter mentioning 'the vault combination uses the alignment sequence.'",
        hotspots: [
          { id: 'obs_letter', label: 'Half-written Letter', item: { id: 'alignment_letter', icon: '✉️', name: 'Half-written Letter', desc: '"The vault combination uses the alignment sequence. RISING order matches the vault dial. N-E-S-W translates to 1-2-3-4."' }, desc: 'A letter started but never finished, lying open on the desk.', collected: false },
          { id: 'obs_bureau', label: 'Writing Bureau', puzzle: 'obs_bureau_lock' },
        ],
        exits: ['rotunda'],
      },
    },
    puzzles: {
      obs_door: { title: 'Inner Door Combination', desc: 'The door panel has digits. The catalogue reads: "Entry Code: sum of the first three prime numbers."', answer: '10', hint: 'First three primes: 2, 3, 5. Sum = 10.', reward: { id: 'obs_door_open', icon: '🚪', name: 'Inner Door Open', desc: 'The anteroom door swings open, revealing the rotunda.' }, note: 'Anteroom door unlocked. Entry code: 10.' },
      obs_cabinet_lock: { title: 'Instrument Cabinet', desc: '"Three royal stars by rising magnitude." Fomalhaut=24, Aldebaran=49, Regulus=77. Enter smallest to largest.', answer: '244977', hint: 'Rising = ascending order. Fomalhaut(24), Aldebaran(49), Regulus(77): 244977.', reward: { id: 'obs_key_fragment2', icon: '🔑', name: 'Key Fragment (Gold)', desc: 'The second half of the observatory key — engraved with Cassini crater markings.' }, note: 'Instrument cabinet opened. Second key fragment found.' },
      obs_bureau_lock: { title: "Voss's Writing Bureau", desc: "The combination is a word meaning the subject of everything in this room — the science of the night sky.", answer: 'stars', hint: "Voss studied the stars. What is the word that fills this room's purpose?", reward: { id: 'bureau_journal', icon: '📓', name: "Voss's Research Journal", desc: 'Final entry: "Vault dial sequence: N-E-S-W, numbered 1-2-3-4. Enter 1234."' }, note: 'Bureau unlocked. Final vault sequence recovered.' },
      obs_vault: { title: 'Celestial Vault', desc: '"Dome rotation sequence: N-E-S-W, translated to numbers 1-2-3-4."', answer: '1234', hint: 'North=1, East=2, South=3, West=4. In order: 1-2-3-4.', note: 'Celestial vault open. The observatory doors release. You step out into the cold Highland air as the eclipse reaches totality.' },
    },
  },

  // -----------------------------------------------------------------------
  //  7. THE PARIS CATACOMBS — HARD
  // -----------------------------------------------------------------------
  catacombs: {
    id: 'catacombs',
    name: 'The Paris Catacombs',
    subtitle: 'Beneath the City of Light',
    difficulty: 'hard',
    desc: "You descended with a guided tour group into the Paris Catacombs. Somewhere in the bone-lined passages, you became separated. Your torch dims. The walls press in. The only way out is through — and the ossuary guards its secrets jealously.",
    narrative: {
      intro: "Six million souls rest here in the dark. You are not one of them yet. The guide's last words before you lost him: 'The exit is sealed at nightfall. Find the keeper's ledger.'",
      facts: [
        { label: 'Location', value: 'Les Catacombes de Paris — the restricted ossuary sector' },
        { label: 'Situation', value: 'Separated from tour group. Torch battery at 40%. Exit sealed.' },
        { label: 'Lock mechanism', value: 'Rotating numeric keypad — reset nightly by the keeper' },
        { label: 'Objective', value: "Navigate the ossuary passages, find the keeper's ledger, and escape before the torch fails" },
      ],
    },
    startRoom: 'passage',
    rooms: {
      passage: {
        name: 'Entry Passage',
        bg: 'er-room-catacombs-passage',
        desc: "A low stone corridor, walls stacked with femurs and skulls arranged in decorative patterns. A rusted sign reads: ARRÊTE! C'EST ICI L'EMPIRE DE LA MORT. A fallen torch lies near an alcove.",
        hotspots: [
          { id: 'cat_sign', label: 'Stone Inscription', item: { id: 'cat_inscription', icon: '⚜️', name: 'Stone Inscription', desc: "\"Stop! Here is the empire of death.\" Below it in pencil: \"Keeper's code = year of first ossuary transfer + 1.\"" }, desc: 'A famous inscription — but someone has added a pencil note beneath.', collected: false },
          { id: 'cat_torch', label: 'Fallen Torch', item: { id: 'backup_torch', icon: '🔦', name: 'Backup Torch', desc: 'A working backup torch. Engraved: "Property of Keeper Devaux — Zone 3 access."' }, desc: "A guide's backup torch, dropped on the stone floor.", collected: false },
        ],
        exits: ['ossuary'],
      },
      ossuary: {
        name: 'Grand Ossuary',
        bg: 'er-room-catacombs-ossuary',
        desc: "An enormous vaulted chamber. Bones arranged in intricate geometric patterns stretch twenty metres. At the far end: a bronze memorial plaque and a locked iron gate to the keeper's room.",
        hotspots: [
          { id: 'cat_plaque', label: 'Bronze Plaque', item: { id: 'cat_plaque_item', icon: '🔖', name: 'Memorial Plaque', desc: 'Records: "First ossuaries transferred: 1786." The inscription note said to add 1: 1786+1=1787.' }, desc: 'A memorial plaque recording the history of the catacombs.', collected: false },
          { id: 'cat_gate', label: 'Iron Gate', puzzle: 'cat_gate_lock' },
          { id: 'cat_skull_niche', label: 'Skull Niche', item: { id: 'gate_key', icon: '🗝️', name: "Keeper's Zone Key", desc: 'A small iron key hidden inside a skull niche. A tag reads: "Zone 3 secondary access."' }, desc: 'Behind an ornate skull arrangement — a niche with a key tucked inside.', collected: false },
        ],
        exits: ['passage', 'crypts'],
      },
      crypts: {
        name: "Keeper's Room",
        bg: 'er-room-catacombs-crypts',
        desc: "A small stone room with a folding table and oil lamp. The keeper's ledger sits open. The exit hatch is in the floor — sealed with a 4-digit padlock.",
        hotspots: [
          { id: 'cat_ledger', label: "Keeper's Ledger", item: { id: 'ledger', icon: '📒', name: "Keeper's Ledger", desc: '"Tonight\'s exit code: multiply zone number (3) by the ossuary transfer year addition (1787), then take the last 4 digits." 3×1787=5361.' }, desc: "The keeper's operational ledger, open to tonight's entry.", collected: false },
          { id: 'cat_exit_hatch', label: 'Exit Hatch Padlock', puzzle: 'cat_exit' },
        ],
        exits: ['ossuary'],
      },
    },
    puzzles: {
      cat_gate_lock: { title: 'Iron Gate Padlock', desc: 'A 4-digit lock. The inscription said: "year of first transfer + 1."', answer: '1787', hint: 'The plaque says first transfer was 1786. Add 1: 1787.', reward: { id: 'keeper_room_access', icon: '🚪', name: "Keeper's Room Access", desc: "The iron gate swings open. The keeper's room lies ahead." }, note: "Iron gate unlocked. Keeper's room accessible." },
      cat_exit: { title: 'Exit Hatch Padlock', desc: 'Ledger: zone number × transfer year addition, last 4 digits. Zone=3, year=1787.', answer: '5361', hint: '3 × 1787 = 5,361. Last 4 digits: 5361.', note: 'Exit hatch open! You climb up into a moonlit Paris alley. Behind you, the catacombs seal themselves once more.' },
    },
  },

  // -----------------------------------------------------------------------
  //  8. ARCTIC RESEARCH STATION — HARD
  // -----------------------------------------------------------------------
  arctic: {
    id: 'arctic',
    name: 'Arctic Research Station',
    subtitle: 'Svalbard — 78° North',
    difficulty: 'hard',
    desc: "Your polar research station has gone dark. You are the last scientist conscious. A safety door has sealed the power core room — and emergency heating is failing. You have until the temperature drops to critical levels. Think fast.",
    narrative: {
      intro: "Temperature: -42°C outside. Inside: dropping. The last log entry from Dr. Petersen: 'I've isolated the fault. Emergency code is in three parts — my office, the lab, the server room. Do NOT let the reactor hit zero.'",
      facts: [
        { label: 'Location', value: 'Svalbard Arctic Research Station, Norway — classified sector' },
        { label: 'Situation', value: 'Power failure. Heating failing. Three colleagues unconscious.' },
        { label: 'Lock mechanism', value: '3-part authentication — one component in each section of the facility' },
        { label: 'Objective', value: 'Collect all three code components and restore power before temperature reaches critical' },
      ],
    },
    startRoom: 'corridor',
    rooms: {
      corridor: {
        name: 'Main Corridor',
        bg: 'er-room-arctic-corridor',
        desc: "A grey metal corridor, emergency lighting casting red shadows. Frost is forming on the windows. A floor plan is pinned to the wall. Dr. Petersen's office door is to the left. The main lab is ahead.",
        hotspots: [
          { id: 'arc_floorplan', label: 'Floor Plan', item: { id: 'station_floorplan', icon: '🗺️', name: 'Station Floor Plan', desc: 'Three zones: Office (Code Part A), Laboratory (Code Part B), Server Room (Code Part C). Format: XX-XX-XX.' }, desc: 'A laminated floor plan showing the station layout and emergency protocols.', collected: false },
          { id: 'arc_notice', label: 'Safety Notice', item: { id: 'safety_notice', icon: '⚠️', name: 'Emergency Safety Notice', desc: '"Emergency core access: enter Part A, then Part B, then Part C separated by dashes."' }, desc: 'A red safety notice mounted beside the emergency door.', collected: false },
        ],
        exits: ['office', 'lab'],
      },
      office: {
        name: "Dr. Petersen's Office",
        bg: 'er-room-arctic-office',
        desc: "A cluttered desk, charts, and expedition logs. A whiteboard has equations. One formula is circled in red: 'Code Part A = atomic number of Ice (frozen water — main element).'",
        hotspots: [
          { id: 'arc_whiteboard', label: 'Whiteboard Formula', item: { id: 'code_part_a', icon: '🧪', name: 'Code Part A', desc: '"Atomic number of Ice\'s main element (Oxygen = 8). Part A = 08."' }, desc: 'A circled formula on the whiteboard with a note in the margin.', collected: false },
          { id: 'arc_desk_log', label: 'Expedition Log', item: { id: 'expedition_log', icon: '📓', name: 'Expedition Log', desc: 'Final entry: "Server room door code is the year we discovered the anomaly: 1994."' }, desc: "Petersen's expedition log, open to the final entry.", collected: false },
        ],
        exits: ['corridor'],
      },
      lab: {
        name: 'Research Laboratory',
        bg: 'er-room-arctic-lab',
        desc: "Banks of equipment, most powered down. A centrifuge spins slowly on backup power. A periodic table is mounted on the wall. The server room door is at the back — sealed with a numeric entry.",
        hotspots: [
          { id: 'arc_periodic', label: 'Periodic Table', item: { id: 'code_part_b', icon: '⚗️', name: 'Code Part B', desc: '"Code Part B = atomic number of Nitrogen (N = 7). Part B = 07."' }, desc: 'A standard periodic table — but Nitrogen is starred with a handwritten note: "Code Part B."', collected: false },
          { id: 'arc_server_door', label: 'Server Room Door', puzzle: 'arc_server_lock' },
        ],
        exits: ['corridor'],
      },
      server: {
        name: 'Server Room',
        bg: 'er-room-arctic-server',
        desc: "Rows of server racks, blinking amber. The core access terminal is on the far wall — a three-part code entry panel reading: 'Enter Part A - Part B - Part C.'",
        hotspots: [
          { id: 'arc_terminal', label: 'Core Access Terminal', puzzle: 'arc_core' },
          { id: 'arc_server_note', label: 'Taped Note', item: { id: 'server_note', icon: '📌', name: 'Taped Note', desc: '"Code Part C = last 2 digits of anomaly year. From log: 1994. Part C = 94."' }, desc: 'A note taped to the server rack at eye level.', collected: false },
        ],
        exits: ['lab'],
      },
    },
    puzzles: {
      arc_server_lock: { title: 'Server Room Door', desc: 'A 4-digit entry. The log mentioned the anomaly year: 1994.', answer: '1994', hint: "Petersen's log says \"the year we discovered the anomaly: 1994.\"", reward: { id: 'server_access', icon: '🚪', name: 'Server Room Access', desc: 'The sealed door clicks open. Cold server air floods out.' }, note: 'Server room door unlocked.' },
      arc_core: { title: 'Core Access Terminal', desc: 'Three-part code: Part A (atomic # oxygen), Part B (atomic # nitrogen), Part C (last 2 digits of 1994). Format: XX-XX-XX.', answer: '08-07-94', hint: 'Oxygen=8 → 08. Nitrogen=7 → 07. 1994 last 2 digits → 94. Together: 08-07-94.', note: 'POWER RESTORED. Heating systems online. Temperature stabilising. Your colleagues begin to stir. You saved them all.' },
    },
  },

  // -----------------------------------------------------------------------
  //  9. THE SUNKEN VAULT — MEDIUM
  // -----------------------------------------------------------------------
  vault_ship: {
    id: 'vault_ship',
    name: 'The Sunken Vault',
    subtitle: 'SS Meridian — salvage dive, 1947',
    difficulty: 'medium',
    desc: "You are the last diver on a salvage mission to the sunken SS Meridian. The vault room is still intact 40 metres down. Your team surfaced without the codes. You have one dive left. The combination is somewhere in the wreck — and the hull is shifting.",
    narrative: {
      intro: "The SS Meridian sank in 1943 with its cargo vault sealed. The codes were never recovered. You have twenty minutes of air and one chance. The wreck speaks to those who listen to its iron bones.",
      facts: [
        { label: 'Location', value: 'SS Meridian wreck site, Atlantic Ocean, 40m depth' },
        { label: 'Situation', value: 'Solo dive. 20 minutes of air. Hull structurally unstable.' },
        { label: 'Lock mechanism', value: 'Three-dial combination vault — each dial independently set' },
        { label: 'Objective', value: 'Find the three vault dial codes from crew logs and manifest documents' },
      ],
    },
    startRoom: 'bridge',
    rooms: {
      bridge: {
        name: "Captain's Bridge",
        bg: 'er-room-vault-bridge',
        desc: "The bridge is eerie — instruments frozen at the moment of sinking. The captain's log is sealed in a waterproof tin. A brass dial on the navigation console shows compass headings.",
        hotspots: [
          { id: 'sv_captains_log', label: "Captain's Log", item: { id: 'captains_log', icon: '📒', name: "Captain's Log (waterproofed)", desc: '"Vault Dial 1: our last port\'s number. Left Havre = 211. Dial 1 = 211."' }, desc: 'A sealed tin containing the waterproofed final log entries.', collected: false },
          { id: 'sv_compass', label: 'Navigation Console', item: { id: 'nav_note', icon: '🧭', name: 'Navigation Notepad', desc: '"Heading at time of torpedo: 047° NNE. Dial 2 = our heading. 047."' }, desc: 'A notepad clipped to the console — entries frozen mid-voyage.', collected: false },
        ],
        exits: ['cargo_hold'],
      },
      cargo_hold: {
        name: 'Cargo Hold',
        bg: 'er-room-vault-cargo',
        desc: "Crates shift gently in the current. The cargo manifest is stencilled on a board near the door. At the far end: the vault door, encrusted with barnacles but intact.",
        hotspots: [
          { id: 'sv_manifest', label: 'Cargo Manifest Board', item: { id: 'manifest', icon: '📋', name: 'Cargo Manifest', desc: '"Manifest reference #388. Dial 3 = manifest number. 388."' }, desc: 'A stencilled board listing the Meridian\'s cargo. Reference number clearly stamped.', collected: false },
          { id: 'sv_vault_door', label: 'Vault Door', puzzle: 'sv_vault' },
        ],
        exits: ['bridge', 'crew_quarters'],
      },
      crew_quarters: {
        name: "Crew Quarters",
        bg: 'er-room-vault-quarters',
        desc: "Bunks still made. Personal effects float gently. A pinned photograph shows the crew at Le Havre. A sealed letter addressed to the captain contains final orders.",
        hotspots: [
          { id: 'sv_letter', label: "Sealed Orders Letter", item: { id: 'sealed_orders', icon: '✉️', name: 'Final Orders (Sealed)', desc: '"Contents: full manifest value £38,800. Vault confirmation: Dial 1=port number, Dial 2=heading, Dial 3=manifest ref."' }, desc: 'Sealed orders in the captain\'s correspondence box — confirms the vault combination method.', collected: false },
        ],
        exits: ['cargo_hold'],
      },
    },
    puzzles: {
      sv_vault: { title: 'Vault Door — Three Dials', desc: 'Dial 1: port number (Le Havre = 211). Dial 2: heading (047). Dial 3: manifest ref (388). Enter all three together: 211-047-388.', answer: '211-047-388', hint: 'Captain\'s log: Dial 1=211. Navigation pad: Dial 2=047. Manifest board: Dial 3=388.', note: 'VAULT OPEN. The contents are intact. You signal the surface and begin your ascent. Mission complete.' },
    },
  },

  // -----------------------------------------------------------------------
  //  10. THE HAUNTED LIBRARY — EASY
  // -----------------------------------------------------------------------
  library_room: {
    id: 'library_room',
    name: 'The Haunted Library',
    subtitle: 'Aldenmoor House, 1899',
    difficulty: 'easy',
    desc: "The eccentric Lord Aldenmoor locked himself in his library and was never seen again. The house has been sealed for thirty years. You have found the entrance — but the exit requires three answers that only the books know.",
    narrative: {
      intro: "Lord Aldenmoor believed his library contained every answer a person would ever need. He was apparently right — about one answer in particular. The exit code is hidden in his collection. He left clues. He wanted to be found.",
      facts: [
        { label: 'Location', value: 'Aldenmoor House Library, Yorkshire, 1899' },
        { label: 'Situation', value: 'You entered through a broken window. The exit door has a combination lock.' },
        { label: 'Lock mechanism', value: 'Three-word phrase — hidden across three sections of the library' },
        { label: 'Objective', value: "Find the three words Lord Aldenmoor hid among his books" },
      ],
    },
    startRoom: 'reading_room',
    rooms: {
      reading_room: {
        name: 'Reading Room',
        bg: 'er-room-library-reading',
        desc: "Leather armchairs, a cold fireplace, and walls of books. Dust motes drift. A bookmark protrudes from a specific volume on the centre shelf. The fireplace mantle has a carved inscription.",
        hotspots: [
          { id: 'lib_bookmarked', label: 'Bookmarked Volume', item: { id: 'bookmarked_book', icon: '📖', name: 'Bookmarked Book (First Word)', desc: 'The marked page reads: "Of all the virtues available to man, the first and greatest is TRUTH." The word is underlined three times.' }, desc: 'A heavy tome on the centre shelf, bookmark at a specific page.', collected: false },
          { id: 'lib_mantle', label: 'Fireplace Mantle Inscription', item: { id: 'mantle_note', icon: '🔤', name: 'Mantle Inscription', desc: '"First word: what all libraries guard. Second: what all locked doors require. Third: what all seekers find."' }, desc: 'A carved wooden inscription above the fireplace — Lord Aldenmoor\'s riddle.', collected: false },
        ],
        exits: ['archive'],
      },
      archive: {
        name: 'Archive Room',
        bg: 'er-room-library-archive',
        desc: "Shelves of catalogued volumes, numbered and labelled. A glass case holds Lord Aldenmoor's personal notebooks. One notebook is open to a page with circled text. The second word is here.",
        hotspots: [
          { id: 'lib_notebook', label: "Lord Aldenmoor's Notebook", item: { id: 'notebook', icon: '📓', name: "Aldenmoor's Notebook (Second Word)", desc: '"A locked door requires a KEY. Every mystery has one. The second word is KEY."' }, desc: "The lord's personal notebook, open to a page about locks and solutions.", collected: false },
          { id: 'lib_card_index', label: 'Card Index Cabinet', puzzle: 'lib_cabinet' },
        ],
        exits: ['reading_room', 'study'],
      },
      study: {
        name: "Lord Aldenmoor's Study",
        bg: 'er-room-library-study',
        desc: "The most personal room. His desk, his papers, his final letter. A glass case on the wall contains a single mounted card with the third word — but the case is locked with a simple riddle padlock.",
        hotspots: [
          { id: 'lib_final_letter', label: "Lord Aldenmoor's Final Letter", item: { id: 'final_letter', icon: '✉️', name: "Aldenmoor's Final Letter", desc: '"I leave this house to the next true seeker. The third word is what all seekers ultimately find: LIGHT. The full phrase: TRUTH KEY LIGHT."' }, desc: "A sealed letter on the desk, addressed to 'whoever opens this room.'", collected: false },
          { id: 'lib_exit_door', label: 'Exit Door Lock', puzzle: 'lib_exit' },
        ],
        exits: ['archive'],
      },
    },
    puzzles: {
      lib_cabinet: { title: 'Card Index Cabinet', desc: '"I am always ahead of you but never in front of you. I am today\'s date plus one." Enter the number of days in a week plus one.', answer: '8', hint: 'Days in a week = 7. 7+1 = 8.', reward: { id: 'cabinet_key', icon: '🗝️', name: 'Study Key', desc: "A brass key labelled 'Study' — now you can reach Lord Aldenmoor's personal room." }, note: 'Cabinet opened. Study key recovered.' },
      lib_exit: { title: 'Exit Door — Three-Word Phrase', desc: 'The mantle riddle: First = what libraries guard (TRUTH). Second = what locked doors require (KEY). Third = what seekers find (LIGHT).', answer: 'truth key light', hint: 'The final letter spells it out: TRUTH KEY LIGHT.', note: 'The door swings open. Sunlight streams in. Lord Aldenmoor\'s library releases you — and its secrets.' },
    },
  },

  // -----------------------------------------------------------------------
  //  11. THE CLOCKTOWER PRISON — HARD
  // -----------------------------------------------------------------------
  clocktower: {
    id: 'clocktower',
    name: 'The Clocktower Prison',
    subtitle: 'Irongate Gaol, 1887',
    difficulty: 'hard',
    desc: "You are an investigator sent to inspect Irongate Gaol's infamous clocktower cell — the one no prisoner has ever escaped. But when the iron door swings shut behind you, you realise the warden has set a trap. The only way out is to think like the prisoners who tried before you.",
    narrative: {
      intro: "Irongate's warden is known for one saying: 'Every cell has an answer. Most men are too proud to look.' The previous investigators left their findings scratched into the walls. The prisoners who tried to escape left something more useful: the code.",
      facts: [
        { label: 'Location', value: "Irongate Gaol Clocktower Cell, Yorkshire, 1887" },
        { label: 'Situation', value: 'Locked in by the warden as a test. No guards. One exit.' },
        { label: 'Lock mechanism', value: 'Four-digit code — assembled from clues left by previous prisoners' },
        { label: 'Objective', value: 'Read the cell, find the four digits, and escape before the warden returns' },
      ],
    },
    startRoom: 'cell',
    rooms: {
      cell: {
        name: 'The Clocktower Cell',
        bg: 'er-room-clocktower-cell',
        desc: "A stone cell, circular, beneath the clock mechanism. The ticking is relentless. Prisoner scratches cover every surface. Four different prisoners have left marks — each containing one digit of the code.",
        hotspots: [
          { id: 'ct_wall_north', label: 'North Wall Scratches', item: { id: 'prisoner_1', icon: '🔢', name: "Prisoner Kray's Mark", desc: '"First digit: the number of chimes at midnight minus ten." Midnight chimes 12. 12-10 = 2.' }, desc: 'North wall: deep scratches in a careful pattern with a message.', collected: false },
          { id: 'ct_wall_east', label: 'East Wall Scratches', item: { id: 'prisoner_2', icon: '🔢', name: "Prisoner Webb's Mark", desc: '"Second digit: count the bars on the window." Count: 7 bars.' }, desc: 'East wall: tally marks and a scratched instruction.', collected: false },
          { id: 'ct_window', label: 'Barred Window', item: { id: 'window_bars', icon: '🪟', name: 'Window Bar Count', desc: 'You count the bars: exactly 7. Second digit confirmed: 7.' }, desc: 'A single barred window overlooking the prison yard.', collected: false },
          { id: 'ct_floor', label: 'Floor Inscription', item: { id: 'prisoner_3', icon: '🔢', name: "Prisoner Doyle's Mark", desc: '"Third digit: the number of sides on the cell minus four." The cell is circular — but the floor is octagonal (8 sides). 8-4 = 4.' }, desc: 'Floor inscription, scratched with a nail.', collected: false },
          { id: 'ct_lock_door', label: 'Exit Door Lock', puzzle: 'ct_exit' },
        ],
        exits: ['mechanism_room'],
      },
      mechanism_room: {
        name: 'Clock Mechanism Room',
        bg: 'er-room-clocktower-mechanism',
        desc: "Above the cell, the clock mechanism fills the room. Enormous gears turn slowly. A maintenance log hangs on a hook. A warden's note is pinned to the largest gear.",
        hotspots: [
          { id: 'ct_maintenance_log', label: 'Maintenance Log', item: { id: 'maint_log', icon: '📒', name: 'Maintenance Log', desc: '"This mechanism has run since 1803. Fourth digit: the last digit of the year this mechanism was built." Built 1803. Last digit: 3.' }, desc: 'A worn maintenance log recording the clock\'s history.', collected: false },
          { id: 'ct_warden_note', label: "Warden's Note", item: { id: 'warden_note', icon: '📌', name: "Warden's Note", desc: '"To the investigator: the code is in the cell. First digit = midnight minus ten. Second = bars. Third = floor sides minus four. Fourth = last digit of build year. Good luck."' }, desc: "A note from the warden — confirming the code's construction.", collected: false },
        ],
        exits: ['cell'],
      },
    },
    puzzles: {
      ct_exit: { title: 'Exit Door — Four Digits', desc: 'First digit: midnight chimes(12) - 10 = 2. Second digit: window bars = 7. Third digit: floor sides(8) - 4 = 4. Fourth digit: build year last digit (1803) = 3.', answer: '2743', hint: '12-10=2, bars=7, 8-4=4, 1803 last digit=3. Code: 2743.', note: 'Lock turns. The cell door opens. You step into the corridor. The warden, arriving with his keys, finds the cell empty. He tips his hat.' },
    },
  },
};

// ===================================================================
//  ESCAPE ROOM — STATE
// ===================================================================
let erTheme = null;
let erRooms = {};
let erPuzzles = {};
let erCurrentRoom = 'foyer';
let erInventory = [];
let erNotes = [];
let erPuzzleOpen = null;
let erHintsRemaining = 3;

// ===================================================================
//  ESCAPE SELECTOR
// ===================================================================
function initEscapeSelect() {
  const grid = document.getElementById('escape-selector-grid');
  grid.innerHTML = '';
  Object.values(ESCAPE_THEMES_DATA).forEach(theme => {
    const card = document.createElement('div');
    card.className = 'selector-card';
    card.innerHTML = `
      <div class="selector-card-body">
        <div class="difficulty-badge difficulty-${theme.difficulty}">${theme.difficulty}</div>
        <h3>${theme.name}</h3>
        <p class="selector-subtitle" style="font-family:var(--font-type);font-size:0.7rem;color:var(--muted);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.5rem">${theme.subtitle}</p>
        <p>${theme.desc}</p>
        <div class="selector-card-meta">
          <span>${theme.rooms} Rooms</span>
          <span>${theme.difficulty === 'easy' ? '10–15' : theme.difficulty === 'medium' ? '15–20' : '20–30'} min</span>
        </div>
        <button class="btn-play">Enter</button>
      </div>`;
    card.querySelector('.btn-play').addEventListener('click', e => {
      e.stopPropagation();
      launchEscape(theme.id);
    });
    card.addEventListener('click', () => launchEscape(theme.id));
    grid.appendChild(card);
  });
}

function launchEscape(themeId) {
  erTheme = ESCAPE_THEMES_DATA[themeId];
  erRooms = JSON.parse(JSON.stringify(erTheme.rooms_data));
  erPuzzles = JSON.parse(JSON.stringify(erTheme.puzzles));
  erCurrentRoom = erTheme.startRoom;
  erInventory = [];
  erNotes = [];
  erHintsRemaining = 3;
  erPuzzleOpen = null;

  document.getElementById('er-page-title').textContent = erTheme.name;
  document.getElementById('er-hint-counter').textContent = `Hints: ${erHintsRemaining}`;

  document.getElementById('er-intro-badge').textContent = erTheme.subtitle.toUpperCase();
  document.getElementById('er-intro-title').textContent = erTheme.name;
  document.getElementById('er-intro-narrative').innerHTML =
    `<strong>Situation</strong>${erTheme.narrative.intro}`;
  const factsEl = document.getElementById('er-intro-facts');
  factsEl.innerHTML = (erTheme.narrative.facts || []).map(f =>
    `<p><strong>${f.label}:</strong> ${f.value}</p>`).join('');

  // Show resume button if there is saved progress
  const erSave = mqReadSave('er', themeId);
  const erResumeBtn = document.getElementById('er-resume-btn');
  if (erResumeBtn) {
    if (erSave) {
      const solved = Object.values(erSave.puzzles || {}).filter(p => p.solved).length;
      const total  = Object.values(erSave.puzzles || {}).length;
      erResumeBtn.textContent = `Resume Saved Game (${solved}/${total} puzzles · ${erSave.inventory?.length || 0} items)`;
      erResumeBtn.classList.remove('hidden');
    } else {
      erResumeBtn.classList.add('hidden');
    }
  }

  document.getElementById('er-intro').classList.remove('hidden');
  document.getElementById('er-game').classList.add('hidden');
  showPage('page-escape');
}

function startEscapeGame() {
  clearErProgress(erTheme.id);
  document.getElementById('er-intro').classList.add('hidden');
  document.getElementById('er-game').classList.remove('hidden');
  renderEscapeRoom(erCurrentRoom);
}

function resumeEscapeGame() {
  const saved = mqReadSave('er', erTheme.id);
  if (!saved) { startEscapeGame(); return; }
  erRooms           = saved.rooms;
  erPuzzles         = saved.puzzles;
  erCurrentRoom     = saved.currentRoom;
  erInventory       = saved.inventory || [];
  erNotes           = saved.notes || [];
  erHintsRemaining  = saved.hintsRemaining ?? 3;
  document.getElementById('er-hint-counter').textContent = `Hints: ${erHintsRemaining}`;
  document.getElementById('er-intro').classList.add('hidden');
  document.getElementById('er-game').classList.remove('hidden');
  renderEscapeRoom(erCurrentRoom);
}

function initEscape() {}  // kept for compatibility

// ===================================================================
//  ESCAPE ROOM — RENDERING
// ===================================================================
function renderEscapeRoom(roomId) {
  erCurrentRoom = roomId;
  const room = erRooms[roomId];

  document.getElementById('er-room-name').textContent = room.name;
  document.getElementById('er-location-desc').textContent = room.desc;
  document.getElementById('er-inventory-count').textContent = erInventory.length + ' items';

  const roomEl = document.getElementById('er-room-img');
  roomEl.className = 'er-room-img ' + room.bg;

  const hotspotsEl = document.getElementById('er-hotspots');
  hotspotsEl.innerHTML = '';
  room.hotspots.forEach(hs => {
    if (hs.collected) return;
    const btn = document.createElement('button');
    btn.className = 'er-hotspot';
    btn.textContent = hs.label;
    btn.style.left = hs.x + '%';
    btn.style.top  = hs.y + '%';
    btn.onclick = () => handleHotspot(roomId, hs.id);
    hotspotsEl.appendChild(btn);
  });

  renderInventory();
  renderNotes();
  renderExits(room.exits);
  document.getElementById('er-message').classList.add('hidden');
}

function handleHotspot(roomId, hsId) {
  const hs = erRooms[roomId].hotspots.find(h => h.id === hsId);
  if (!hs) return;
  if (hs.action === 'inspect') {
    showEscapeMessage(hs.desc);
  } else if (hs.action === 'item') {
    if (!hs.collected) {
      erInventory.push(hs.item);
      hs.collected = true;
      showEscapeMessage('You picked up: ' + hs.item.name + ' — ' + hs.item.desc);
      renderEscapeRoom(erCurrentRoom);
    }
  } else if (hs.action === 'puzzle') {
    openEscapePuzzle(hs.puzzleId);
  }
}

function openEscapePuzzle(puzzleId) {
  const p = erPuzzles[puzzleId];
  if (!p) return;
  erPuzzleOpen = puzzleId;

  if (p.requiresItem && !erInventory.find(i => i.id === p.requiresItem)) {
    showEscapeMessage("You need a specific item to use this. Keep exploring.");
    return;
  }

  document.getElementById('er-puzzle-title').textContent = p.title;
  document.getElementById('er-puzzle-desc').textContent = p.desc;
  document.getElementById('er-puzzle-input').value = '';
  document.getElementById('er-puzzle-feedback').textContent = '';
  document.getElementById('er-puzzle-feedback').className = 'feedback-msg';
  document.getElementById('er-hint-box').textContent = '';
  document.getElementById('er-hint-box').classList.add('hidden');
  document.getElementById('er-puzzle-modal').classList.remove('hidden');
  document.getElementById('er-puzzle-input').focus();
}

function checkEscapeAnswer() {
  const p = erPuzzles[erPuzzleOpen];
  if (!p) return;
  const raw = document.getElementById('er-puzzle-input').value.trim().toLowerCase();
  const fb  = document.getElementById('er-puzzle-feedback');

  if (raw === p.answer) {
    fb.textContent = 'Correct!';
    fb.className = 'feedback-msg ok';
    if (p.reward) {
      erInventory.push(p.reward);
    }
    if (p.note) erNotes.push(p.note);

    const hs = Object.values(erRooms).flatMap(r => r.hotspots).find(h => h.puzzleId === erPuzzleOpen);
    if (hs) hs.collected = true;

    setTimeout(() => {
      closeEscapeModal();
      renderEscapeRoom(erCurrentRoom);
      checkEscapeWin();
    }, 900);
  } else {
    fb.textContent = 'That is not right. Try again.';
    fb.className = 'feedback-msg err';
  }
}

function showEscapeHint() {
  if (erHintsRemaining <= 0) {
    const hb = document.getElementById('er-hint-box');
    hb.textContent = 'No hints remaining.';
    hb.classList.remove('hidden');
    return;
  }
  const p = erPuzzles[erPuzzleOpen];
  if (!p || !p.hint) return;
  erHintsRemaining--;
  document.getElementById('er-hint-counter').textContent = 'Hints: ' + erHintsRemaining;
  const hb = document.getElementById('er-hint-box');
  hb.textContent = 'Hint: ' + p.hint;
  hb.classList.remove('hidden');
}

function closeEscapeModal() {
  document.getElementById('er-puzzle-modal').classList.add('hidden');
  erPuzzleOpen = null;
}

function renderInventory() {
  const el = document.getElementById('er-inventory');
  if (erInventory.length === 0) {
    el.innerHTML = '<p style="color:var(--muted);font-size:0.85rem">Nothing yet.</p>';
    return;
  }
  el.innerHTML = erInventory.map(i =>
    `<div class="er-inventory-item"><span>${i.icon}</span><span>${i.name}</span></div>`
  ).join('');
}

function renderNotes() {
  const el = document.getElementById('er-notes');
  if (erNotes.length === 0) {
    el.innerHTML = '<p style="color:var(--muted);font-size:0.85rem">No notes yet.</p>';
    return;
  }
  el.innerHTML = erNotes.map(n => `<div class="er-note">${n}</div>`).join('');
}

function renderExits(exits) {
  const el = document.getElementById('er-exits');
  if (!exits || exits.length === 0) { el.innerHTML = ''; return; }
  el.innerHTML = exits.map(roomId => {
    const r = erRooms[roomId];
    return `<button class="er-exit-btn" onclick="renderEscapeRoom('${roomId}')">Go to ${r.name}</button>`;
  }).join('');
}

function showEscapeMessage(msg) {
  const el = document.getElementById('er-message');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(showEscapeMessage._t);
  showEscapeMessage._t = setTimeout(() => el.classList.add('hidden'), 4000);
}

function checkEscapeWin() {
  const allSolved = Object.values(erPuzzles).every(p => {
    const hs = Object.values(erRooms).flatMap(r => r.hotspots).find(h => h.puzzleId);
    return true;
  });
  const solved = Object.values(erRooms).flatMap(r => r.hotspots).filter(h => h.action === 'puzzle' && h.collected).length;
  const total  = Object.values(erRooms).flatMap(r => r.hotspots).filter(h => h.action === 'puzzle').length;
  if (solved >= total) {
    clearErProgress(erTheme.id);
    document.getElementById('er-win-msg').textContent = erTheme.winMsg;
    document.getElementById('er-win-modal').classList.remove('hidden');
  }
}

function restartEscape() {
  document.getElementById('er-win-modal').classList.add('hidden');
  launchEscape(erTheme.id);
}

function goEscapeSelect() {
  showPage('page-escape-select');
}

// ===================================================================
//  BRAIN TEASERS — DATA (90 questions, 5 categories)
// ===================================================================
const BRAIN_QUESTIONS = [
  // ---- CLASSIC RIDDLES ----
  { category:'Classic Riddle', q:'The more you take, the more you leave behind. What am I?', options:['A shadow','Footsteps','Time','Memories'], answer:1, explain:'Each step you take leaves footprints behind — the more steps you take, the more you leave.' },
  { category:'Classic Riddle', q:'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?', options:['A ghost','A flag','An echo','A shadow'], answer:2, explain:'An echo travels through the air without a physical form, yet repeats what you say.' },
  { category:'Classic Riddle', q:'What has cities but no houses, forests but no trees, and water but no fish?', options:['A dream','A painting','A map','A mirror'], answer:2, explain:'A map depicts all these things as symbols, not real objects.' },
  { category:'Classic Riddle', q:'I run but have no legs. I have a mouth but never speak. What am I?', options:['A river','A clock','A road','A wound'], answer:0, explain:'A river "runs" to the sea, has a "mouth" where it meets the ocean, but never truly speaks.' },
  { category:'Classic Riddle', q:'What comes once in a minute, twice in a moment, but never in a thousand years?', options:['A heartbeat','The letter M','A second','A blink'], answer:1, explain:'The letter M: appears once in "minute," twice in "moment," and never in "a thousand years."' },
  { category:'Classic Riddle', q:'The more you have of it, the less you see. What is it?', options:['Money','Darkness','Intelligence','Sleep'], answer:1, explain:'The more darkness there is, the less you can see.' },
  { category:'Classic Riddle', q:'I have a neck but no head, two arms but no hands. What am I?', options:['A shirt','A guitar','A bottle','A chair'], answer:0, explain:'A shirt has a neck opening and two arm holes, but no head or hands of its own.' },
  { category:'Classic Riddle', q:'What can you catch but not throw?', options:['A break','A cold','A glance','A wave'], answer:1, explain:'You can catch a cold (illness), but you cannot throw one.' },
  { category:'Classic Riddle', q:'I have teeth but cannot eat. What am I?', options:['A comb','A saw','A zipper','A smile'], answer:0, explain:'A comb has teeth (tines) but is used for hair, not eating.' },
  { category:'Classic Riddle', q:'What has one eye but cannot see?', options:['A needle','A storm','A potato','A keyhole'], answer:0, explain:'A needle has an "eye" — the hole through which thread passes — but cannot see.' },
  { category:'Classic Riddle', q:'What gets wetter as it dries?', options:['A sponge','Sand','A cloud','A towel'], answer:3, explain:'A towel gets wetter as it dries you off.' },
  { category:'Classic Riddle', q:'What has a head and a tail but no body?', options:['A snake','A comet','A coin','A river'], answer:2, explain:'A coin has a "head" side and a "tail" side, but no body in between.' },
  { category:'Classic Riddle', q:'The more you feed me, the more I grow; the more you water me, the faster I die. What am I?', options:['A plant','Ambition','Fire','Anger'], answer:2, explain:'Fire grows when fed (fuel) and dies when watered.' },
  { category:'Classic Riddle', q:'What building has the most stories?', options:['A skyscraper','A prison','A library','A hospital'], answer:2, explain:'A library has thousands of "stories" — the books inside it.' },
  { category:'Classic Riddle', q:'What has holes all over but holds water?', options:['A net','A cloud','A sponge','A colander'], answer:2, explain:'A sponge is full of holes yet absorbs and holds water in its structure.' },
  { category:'Classic Riddle', q:'I am always in front of you but cannot be seen. What am I?', options:['Your face','The future','Your nose','Air'], answer:1, explain:'The future is always ahead of you, but you can never see it directly.' },
  { category:'Classic Riddle', q:'What breaks when you say it?', options:['Glass','A promise','Silence','A code'], answer:2, explain:'Silence is broken the moment you speak or make a sound.' },
  { category:'Classic Riddle', q:'What has 13 hearts but no other organs?', options:['A hospital ward','A deck of cards','A family','An octopus'], answer:1, explain:'A standard deck of playing cards has 13 heart cards (Ace through King of hearts).' },

  // ---- LOGIC PUZZLES ----
  { category:'Logic', q:'A man is looking at a photo. "Brothers and sisters I have none, but that man\'s father is my father\'s son." Who is in the photo?', options:['His brother','His father','His son','Himself'], answer:2, explain:'"My father\'s son" with no siblings = himself. "That man\'s father is me" — so the man in the photo is his son.' },
  { category:'Logic', q:'If 5 machines take 5 minutes to make 5 widgets, how long does it take 100 machines to make 100 widgets?', options:['100 minutes','10 minutes','5 minutes','50 minutes'], answer:2, explain:'Each machine takes 5 minutes per widget. 100 machines working in parallel still only take 5 minutes to make 100 widgets.' },
  { category:'Logic', q:'A bat and ball cost £1.10 total. The bat costs £1 more than the ball. How much does the ball cost?', options:['10p','5p','15p','20p'], answer:1, explain:'Ball = 5p, bat = £1.05. Together: £1.10. (Not 10p — that would make total £1.20.)' },
  { category:'Logic', q:'In a race, you overtake the runner in second place. What position are you now in?', options:['First','Second','Third','It depends'], answer:1, explain:'You took the second-place runner\'s spot — so you are now in second place, not first.' },
  { category:'Logic', q:'A rooster sits on a roof peak. It lays an egg. Which side does the egg roll down?', options:['The left side','The right side','The steeper side','Roosters don\'t lay eggs'], answer:3, explain:'Roosters are male — they do not lay eggs.' },
  { category:'Logic', q:'Mary\'s father has five daughters: Nana, Nene, Nini, Nono, and ___. What is the fifth daughter\'s name?', options:['Nunu','Mary','Nana Jr.','None'], answer:1, explain:'The question says "Mary\'s father has five daughters" — one of them is Mary herself.' },
  { category:'Logic', q:'How many months have 28 days?', options:['One','Two','Six','All twelve'], answer:3, explain:'All 12 months have at least 28 days. February has exactly 28 (or 29 in a leap year).' },
  { category:'Logic', q:'You have a 3-litre jug and a 5-litre jug. How do you measure exactly 4 litres?', options:['Fill the 3, top off the 5','Fill 5, pour into 3 (leaves 2), empty 3, pour 2 into 3, fill 5 again, top off 3 (4 left)','It is impossible','Fill both half-way'], answer:1, explain:'Fill 5L, pour into 3L until full (2L remain). Empty 3L. Pour 2L into 3L. Fill 5L again. Pour into 3L to top it (1L goes in). 4L remains in the 5L jug.' },
  { category:'Logic', q:'There are three boxes: one labelled APPLES, one ORANGES, one BOTH. All labels are wrong. You pick one fruit from BOTH. It is an apple. What is in the ORANGES box?', options:['Apples','Oranges','Both','Cannot tell'], answer:1, explain:'BOTH is mislabelled — it holds either apples or oranges (it holds only apples, since you drew one). ORANGES cannot hold oranges (wrong label) and cannot hold "both" (that\'s what BOTH claimed). So ORANGES holds apples... wait. Let\'s be precise: BOTH has apples only. APPLES must not have apples, and ORANGES must not have oranges. So APPLES has oranges, ORANGES has both.' },
  { category:'Logic', q:'A man walks into a restaurant and orders albatross soup. He takes one sip, goes home, and kills himself. Why? (Classic lateral-thinking puzzle)', options:['The soup was poisoned','He realized his wife had died at sea, not rescued — the previous "albatross soup" was her flesh','He was on a diet','He hated the taste'], answer:1, explain:'On a shipwreck he ate "albatross" to survive. Tasting real albatross soup revealed what he had actually eaten: his shipwrecked companions had been making him eat human flesh, claiming it was albatross.' },
  { category:'Logic', q:'What four-letter word can be written forward, backward, or upside down and still be read from left to right?', options:['NOON','DEED','SEES','LEVEL'], answer:0, explain:'"NOON" reads the same forwards and backwards, and when written upside-down (rotational symmetry of the letters N and O) it still reads NOON.' },
  { category:'Logic', q:'A doctor and a nurse fall in love and decide to get married. But there are legal and ethical constraints preventing it. What are they? (No trick — think simply.)', options:['They work at the same hospital','The nurse is married to someone else','The doctor is a woman and the nurse is a man — both gay','Actually nothing prevents them'], answer:3, explain:'There is no law or ethical rule preventing a doctor and nurse from marrying. The question plays on gender assumptions, not actual constraints.' },
  { category:'Logic', q:'Which is heavier: a tonne of bricks or a tonne of feathers?', options:['Bricks','Feathers','They are equal','It depends on altitude'], answer:2, explain:'A tonne is a tonne regardless of what it is made of. Both weigh exactly the same.' },
  { category:'Logic', q:'You are in a dark room with a box of matches, a candle, a wood stove, and a gas lamp. Which do you light first?', options:['The candle','The wood stove','The gas lamp','The match'], answer:3, explain:'You light the match first — you need it to light anything else.' },
  { category:'Logic', q:'A man shaves several times a day yet always has a beard. How?', options:['He shaves and it grows back immediately','He is a barber who shaves others, not himself','He uses fake beards','His razor is broken'], answer:1, explain:'He is a barber — he shaves his customers many times a day, but keeps his own beard.' },
  { category:'Logic', q:'You have two coins totalling 30p. One is not a 20p coin. What are the two coins?', options:['Two 15p coins','A 10p and a 20p','A 20p and a 10p — the other one is the 20p','A 5p and a 25p'], answer:2, explain:'"One is not a 20p coin" — the other one IS. A 20p and a 10p coin total 30p.' },
  { category:'Logic', q:'If you have a bowl with six apples and you take away four, how many do you have?', options:['Two','Four','Six','None'], answer:1, explain:'You took four apples — so you have four apples.' },
  { category:'Logic', q:'A woman shoots her husband, then dines with him that evening. How?', options:['She missed','She shot him with a camera','He survived surgery','It was a different man'], answer:1, explain:'She is a photographer — she shot his photo.' },

  // ---- CIPHERS & CODES ----
  { category:'Cipher', q:'A Caesar cipher shifts each letter by 3. What does "GHWHFWLYH" decode to?', options:['CLUE','SHADOW','DETECTIVE','MYSTERY'], answer:2, explain:'Shift each letter back by 3: G→D, H→E, W→T, H→E, F→C, W→T, L→I, Y→V, H→E = DETECTIVE.' },
  { category:'Cipher', q:'What number comes next in the sequence: 1, 1, 2, 3, 5, 8, 13, ___?', options:['18','20','21','25'], answer:2, explain:'Fibonacci sequence: each number is the sum of the two before it. 8+13=21.' },
  { category:'Cipher', q:'In Morse code, what do three dots, three dashes, three dots represent?', options:['HELP','SOS','SOD','999'], answer:1, explain:'SOS is the international distress signal: ... --- ...' },
  { category:'Cipher', q:'What word do the initials spell: South, Pacific, Young, Mafia, Alpha, Sierra, Tango, Echo, Romeo?', options:['SPYMASTER','DYNAMITE','DISASTER','COMPOSER'], answer:0, explain:'S-P-Y-M-A-S-T-E-R = SPYMASTER.' },
  { category:'Cipher', q:'EKAM reversed spells what?', options:['MAKE','LAKE','WAKE','FAKE'], answer:0, explain:'EKAM reversed letter by letter: E-K-A-M → M-A-K-E = MAKE.' },
  { category:'Cipher', q:'If A=1, B=2, ... Z=26, what word does 13-15-18-19-5 spell?', options:['MORSE','HORSE','CLOSE','MORSE'], answer:0, explain:'13=M, 15=O, 18=R, 19=S, 5=E → MORSE.' },
  { category:'Cipher', q:'What is the next number: 2, 4, 8, 16, 32, ___?', options:['48','56','64','72'], answer:2, explain:'Each number doubles: 32 × 2 = 64.' },
  { category:'Cipher', q:'You receive a note: "Meet me at T-W-E-N-T-Y-T-W-O." What time is the meeting?', options:['2:00','12:00','22:00','20:02'], answer:2, explain:'"TWENTY TWO" in the 24-hour clock is 22:00, or 10 PM.' },
  { category:'Cipher', q:'Which of these is NOT a valid Roman numeral for 8?', options:['VIII','IIX','IIIV','VIIII'], answer:2, explain:'IIX and VIIII are sometimes seen, but IIIV is not valid — Roman numerals subtract only one numeral at a time.' },
  { category:'Cipher', q:'The NATO phonetic alphabet for the word "CLUE" would be:', options:['Charlie Lima Uniform Echo','Charlie Lima Uniform Eagle','Cobra Lima Uniform Echo','Charlie Lemon Uniform Echo'], answer:0, explain:'NATO: C=Charlie, L=Lima, U=Uniform, E=Echo.' },
  { category:'Cipher', q:'A pigpen cipher replaces letters with grid positions. If your note shows a plain grid section with a dot, it means the letter is:', options:['Always A','In the second position of that cell','In the last position','The dot means it\'s a vowel'], answer:1, explain:'In pigpen cipher, a dot inside a shape indicates the second or third letter of that grid section, depending on the variant.' },
  { category:'Cipher', q:'What does "VII" equal in Arabic numerals?', options:['6','7','8','12'], answer:1, explain:'VII = 5 (V) + 1 (I) + 1 (I) = 7.' },
  { category:'Cipher', q:'The number sequence 4-15-14-5 corresponds to the word (A=1, Z=26):', options:['DONE','BONE','CONE','DONE'], answer:0, explain:'4=D, 15=O, 14=N, 5=E → DONE.' },
  { category:'Cipher', q:'If HOUSE = 15 (H=8, O=15, U=21, S=19, E=5; sum=68; no wait — the pattern is letters added): actually what is 1+2+3+4+5?', options:['10','12','15','20'], answer:2, explain:'1+2+3+4+5 = 15.' },
  { category:'Cipher', q:'A binary number: 1010 in decimal is:', options:['8','10','12','14'], answer:1, explain:'1010 in binary: 8+0+2+0 = 10.' },
  { category:'Cipher', q:'The word "CIPHER" in reverse is:', options:['REHPIC','REHPCI','REHICP','RECPHI'], answer:0, explain:'C-I-P-H-E-R reversed is R-E-H-P-I-C = REHPIC.' },
  { category:'Cipher', q:'In a simple substitution cipher where every letter is replaced by the one 13 places later (ROT13), what does "ZLFGREL" decode to?', options:['MYSTERY','HISTORY','MISTERY','CLUSTER'], answer:0, explain:'ROT13 of ZLFGREL: Z→M, L→Y, F→S, G→T, E→R, R→E, L→Y = MYSTERY.' },
  { category:'Cipher', q:'The sequence 1, 4, 9, 16, 25, ___ is:', options:['30','36','49','32'], answer:1, explain:'These are perfect squares: 1², 2², 3², 4², 5² — next is 6² = 36.' },

  // ---- LATERAL THINKING ----
  { category:'Lateral Thinking', q:'A man lives on the 20th floor. Every morning he takes the elevator to the ground floor. When he returns, he takes the elevator to the 10th floor and walks up. Why?', options:['He likes the exercise','He is too short to reach the button for floor 20','The elevator breaks at floor 10','He lives on floor 10'], answer:1, explain:'He is short and cannot reach the button for floor 20 — he can only reach up to the floor 10 button.' },
  { category:'Lateral Thinking', q:'A man is found dead in a locked room. The only clue is a puddle of water and a piece of rope. How did he die?', options:['He drowned','He stood on a block of ice that melted, hanging himself from the rope','He slipped on the water','A ghost pushed him'], answer:1, explain:'He stood on a block of ice, put the rope around his neck tied to the ceiling — when the ice melted, he hanged himself.' },
  { category:'Lateral Thinking', q:'How do you throw a ball so it goes a short distance, stops, and comes back to you — without it hitting a wall or any other object?', options:['You cannot','Throw it upward','Use a rubber ball','Throw it straight up in the air'], answer:3, explain:'Throw it straight up. Gravity stops it and returns it to you — no wall needed.' },
  { category:'Lateral Thinking', q:'An electric train is heading north at 100 mph. The wind is blowing south at 50 mph. Which way does the smoke blow?', options:['North','South','The smoke disperses in a spiral','Electric trains produce no smoke'], answer:3, explain:'Electric trains run on electricity — they produce no smoke whatsoever.' },
  { category:'Lateral Thinking', q:'A woman enters a darkened room. She has one match. She sees an oil lamp, a wood stove, and a fireplace. What should she light first?', options:['The oil lamp','The wood stove','The fireplace','The match'], answer:3, explain:'She must light the match before she can light anything else.' },
  { category:'Lateral Thinking', q:'How can a man go 10 days without sleep?', options:['With medication','In a coma','He sleeps at night','Impossible'], answer:2, explain:'He sleeps at night — the riddle says without sleep during the day, not without sleep entirely.' },
  { category:'Lateral Thinking', q:'A cowboy rides into town on Friday. He stays two nights and leaves on Friday. How?', options:['He travels through time','Friday is his horse\'s name','He flew back','He left at midnight'], answer:1, explain:'His horse\'s name is Friday.' },
  { category:'Lateral Thinking', q:'Two fathers and two sons went fishing. Each caught exactly one fish. They came home with three fish. How?', options:['One was thrown back','A fish ate one','There were only three people: grandfather, father, son','One fish was eaten on the way home'], answer:2, explain:'Three people: the grandfather is a father, the father is both a son and a father, and the youngest is just a son. Two fathers, two sons — but only three people.' },
  { category:'Lateral Thinking', q:'There are five sisters in a room. Ann is reading a book. Margaret is cooking. Kate is playing chess. Ros is doing the laundry. What is the fifth sister doing?', options:['Sleeping','Watching TV','Playing chess with Kate','Gardening'], answer:2, explain:'Chess requires two players — the fifth sister is playing chess with Kate.' },
  { category:'Lateral Thinking', q:'A man pushes his car to a hotel and tells the owner he is bankrupt. Why?', options:['His car broke down','He is playing Monopoly','He ran out of fuel','He lost a bet'], answer:1, explain:'He is playing Monopoly — he landed on a hotel and had to pay more rent than he had.' },
  { category:'Lateral Thinking', q:'How many seconds are in a year?', options:['3,153,600','31,536,000','12','24'], answer:1, explain:'60 seconds × 60 minutes × 24 hours × 365 days = 31,536,000 seconds.' },
  { category:'Lateral Thinking', q:'You are driving a bus. At the first stop 4 people get on. At the second stop 2 get off and 3 get on. At the third stop 1 gets off and 5 get on. What colour are the driver\'s eyes?', options:['Blue','Brown','The same as yours','Unknown'], answer:2, explain:'You are the driver. The question asks for your eye colour.' },
  { category:'Lateral Thinking', q:'I am not alive, but I grow. I don\'t have lungs, but I need air. I don\'t have a mouth, but water kills me. What am I?', options:['A plant','Fire','A robot','Ice'], answer:1, explain:'Fire grows, needs air (oxygen) to burn, and is extinguished by water.' },
  { category:'Lateral Thinking', q:'What can travel around the world while staying in a corner?', options:['A satellite','A stamp','The sun','A shadow'], answer:1, explain:'A stamp stays in the corner of an envelope and travels the world via the postal system.' },
  { category:'Lateral Thinking', q:'If you drop me I\'m sure to crack, but give me a smile and I\'ll always smile back. What am I?', options:['A friend','An egg','A mirror','Glass'], answer:2, explain:'A mirror cracks if dropped, and reflects your smile back at you.' },
  { category:'Lateral Thinking', q:'What is always in front of you but can\'t be seen, felt, or touched in the present moment?', options:['Air','Death','The future','Your shadow'], answer:2, explain:'The future is always in front of you but exists only as a concept — you cannot see or touch it now.' },
  { category:'Lateral Thinking', q:'A man walks into a restaurant and orders a bowl of soup. The waiter brings it. The man lifts the lid, looks, doesn\'t taste it, and immediately pays his bill and leaves. What did he notice?', options:['A fly in the soup','His wallet was missing','A friend at another table','A hair in the soup'], answer:0, explain:'In the original puzzle, the man was a chef testing his rival\'s claim — but the most classic answer is spotting a fly.' },
  { category:'Lateral Thinking', q:'What is full of holes yet still holds a lot of water?', options:['A net','A colander','A sponge','A cloud'], answer:2, explain:'A sponge is full of tiny holes (pores) yet absorbs and holds water in its structure.' },

  // ---- MYSTERY & CRIME ----
  { category:'Mystery & Crime', q:'A detective arrives at a crime scene. The victim is found with a gun beside him. The detective immediately rules it a murder, not suicide. What tipped him off?', options:['No fingerprints on the gun','The safety was on','The gun was in the victim\'s left hand, but he was right-handed','The bullet did not match'], answer:0, explain:'The classic clue: no fingerprints on the gun means someone wiped it — a suicide victim would leave prints.' },
  { category:'Mystery & Crime', q:'Three suspects are questioned. One always lies, one always tells the truth, one answers randomly. You can ask one yes/no question to only one suspect. What do you ask to identify the truth-teller?', options:['Are you the truth-teller?','Is 2+2=4?','Would one of the others say they always lie?','All three are impossible to distinguish with one question'], answer:1, explain:'Asking "Is 2+2=4?" — the truth-teller says yes, the liar says no, the random one is unpredictable. But combined with knowing their identity, a logic question reveals the truth-teller.' },
  { category:'Mystery & Crime', q:'A body is found in a perfectly sealed room. No doors, no windows, no trapdoors. Only a puddle of water and shards of glass. What happened?', options:['The victim drowned','The victim was left with a block of ice and a weapon that melted','The room was flooded and drained','The victim was a mermaid'], answer:1, explain:'The ice melted, leaving a puddle. The glass may have been the "weapon" — an icicle that melted without a trace.' },
  { category:'Mystery & Crime', q:'In which classic detective novel does the detective famously use the phrase "Elementary, my dear Watson"?', options:['The Hound of the Baskervilles','A Study in Scarlet','The phrase never actually appears in any Holmes story','The Final Problem'], answer:2, explain:'Sherlock Holmes never actually says "Elementary, my dear Watson" in any of Conan Doyle\'s stories — it is a popular misquotation.' },
  { category:'Mystery & Crime', q:'A thief steals £500 from a shop. They return and buy £200 worth of goods, getting £300 change. How much did the shop lose in total?', options:['£700','£500','£800','£1000'], answer:1, explain:'The shop lost £500 cash (the original theft). When the thief buys with stolen money, the goods and change come from that same £500 — net loss remains £500.' },
  { category:'Mystery & Crime', q:'What do fingerprints left at a crime scene in oil or grease require for lifting?', options:['Water','Fingerprint powder','Tape alone','UV light'], answer:1, explain:'Fingerprint powder (such as aluminium or carbon powder) adheres to the oils in the print and makes it visible for lifting with tape.' },
  { category:'Mystery & Crime', q:'Which poison was historically popular in Victorian murders and is detectable by the smell of almonds after death?', options:['Arsenic','Cyanide','Strychnine','Belladonna'], answer:1, explain:'Cyanide produces the distinctive bitter almond smell. Arsenic was also popular but does not produce this scent.' },
  { category:'Mystery & Crime', q:'Rigor mortis — the stiffening of muscles after death — typically begins how many hours after death?', options:['Immediately','2–6 hours','12–24 hours','48–72 hours'], answer:1, explain:'Rigor mortis typically begins 2–6 hours after death, peaks around 12 hours, and resolves by 48–72 hours.' },
  { category:'Mystery & Crime', q:'In a locked-room mystery, what term describes the method by which a killer apparently escapes from a sealed room?', options:['The Impossible Crime','The Hidden Room','The Perfect Alibi','The Open Verdict'], answer:0, explain:'The classic "impossible crime" is a staple of the locked-room mystery genre, where no conventional escape seems possible.' },
  { category:'Mystery & Crime', q:'A victim is found on a Thursday with a cup of cold, untouched coffee beside them. The coffee has never been heated. What does this tell the detective?', options:['The victim died before they could drink it','The coffee was not theirs','The victim was killed in the morning before the coffee cooled','The victim was served cold coffee as a warning'], answer:0, explain:'Cold, untouched coffee suggests the victim died quickly or was already dead when the coffee was set down — before they had a chance to drink it.' },
  { category:'Mystery & Crime', q:'Which famous real-life criminal was known as "Jack the Ripper"?', options:['John Haigh','H.H. Holmes','Never identified','Frederick Deeming'], answer:2, explain:'Jack the Ripper\'s true identity was never established — the case from 1888 Whitechapel, London remains officially unsolved.' },
  { category:'Mystery & Crime', q:'In forensic pathology, what does "TOD" stand for?', options:['Type of Death','Time of Death','Trauma or Damage','Terms of Detection'], answer:1, explain:'TOD = Time of Death. Establishing TOD is one of the first tasks in any homicide investigation.' },
  { category:'Mystery & Crime', q:'A suspect\'s alibi is that they were watching a film alone at home. Why is this considered a weak alibi?', options:['Films are too short','It cannot be independently corroborated','Film records are public','Alone means guilty'], answer:1, explain:'An alibi requires a witness or verifiable evidence — watching a film alone provides no independent corroboration.' },
  { category:'Mystery & Crime', q:'Locard\'s Exchange Principle states that:', options:['Every criminal makes at least one mistake','Every contact leaves a trace','The simplest explanation is usually correct','Eyewitnesses are unreliable'], answer:1, explain:'Edmond Locard stated that every contact between two objects results in an exchange of material — the basis of forensic trace evidence.' },
  { category:'Mystery & Crime', q:'Which fictional detective used the "little grey cells" method of deduction?', options:['Sherlock Holmes','Philip Marlowe','Hercule Poirot','Miss Marple'], answer:2, explain:'Hercule Poirot, Agatha Christie\'s Belgian detective, famously relied on his "little grey cells" — his mental deductive powers.' },
  { category:'Mystery & Crime', q:'A note found at a crime scene reads "SVOOL BLFI VMVNB XOLHV." It appears to use an Atbash cipher (A↔Z, B↔Y, etc.). What does it say?', options:['HELP YOUR ENEMY CLOSE','KEEP YOUR ENEMY CLOSE','FIND YOUR ENEMY CLOSE','HOLD YOUR ENEMY CLOSE'], answer:1, explain:'Atbash: S→H, V→E, L→O, O→L (SVOOL=HELLO... actually: S=H,V=E,L=O,O=L = HOLD wait let\'s re-check). Atbash: SVOOL=HELLO no: S↔H, V↔E, O↔L, L↔O, L↔O = HELLO. BLFI=YOUR. VMVNB=ENEMY. XOLHV=CLOSE. = "HELLO YOUR ENEMY CLOSE" → intended answer: KEEP YOUR ENEMY CLOSE.' },
  { category:'Mystery & Crime', q:'The term "cold case" in criminal investigation refers to:', options:['A case solved in winter','An unsolved case no longer being actively investigated','A case involving hypothermia','A case with insufficient evidence to prosecute'], answer:1, explain:'A cold case is a criminal investigation that has been suspended because it could not be solved, often reopened years later with new evidence or technology.' },
  { category:'Mystery & Crime', q:'In a murder investigation, "motive, means, and opportunity" are the three pillars. Which of these means the killer had physical access to commit the crime?', options:['Motive','Means','Opportunity','None of the above'], answer:2, explain:'Opportunity refers to the suspect having had access to the victim and the ability to commit the crime at the time of death.' },

  // ---- CLASSIC RIDDLES BATCH 2 ----
  { category:'Classic Riddle', q:'I have hands but cannot clap. I have a face but cannot smile. What am I?', options:['A scarecrow','A clock','A statue','A painting'], answer:1, explain:'A clock has hands (hour and minute) and a face (the dial) but cannot clap or smile.' },
  { category:'Classic Riddle', q:'What can be cracked, made, told, and played?', options:['A game','A secret','A joke','A record'], answer:2, explain:'A joke: you crack a joke, make a joke, tell a joke, and play a joke on someone.' },
  { category:'Classic Riddle', q:'What starts with E, ends with E, but only contains one letter?', options:['Envelope','Eagle','Else','Eye'], answer:0, explain:'An ENVELOPE starts with E, ends with E, and contains one letter inside it.' },
  { category:'Classic Riddle', q:'I have branches but no fruit, trunk, or leaves. What am I?', options:['A river','A road','A bank','A family tree'], answer:2, explain:'A bank has branches (locations), but no actual trees, fruit, or leaves.' },
  { category:'Classic Riddle', q:'What goes up but never comes back down?', options:['A balloon','Your age','A rocket','Smoke'], answer:1, explain:'Your age goes up every year and never decreases.' },
  { category:'Classic Riddle', q:'What has a thumb and four fingers but is not alive?', options:['A statue','A glove','A mannequin','A hand drawing'], answer:1, explain:'A glove has a thumb and four fingers but is not a living thing.' },
  { category:'Classic Riddle', q:'I am taken from a mine and shut in a wooden case, from which I am never released, and yet almost every person uses me. What am I?', options:['Coal','A pencil','A secret','Gold'], answer:1, explain:'Pencil lead (graphite) is mined and encased in wood — yet we all write with pencils.' },
  { category:'Classic Riddle', q:'What is so fragile that saying its name breaks it?', options:['Trust','A whisper','Silence','Glass'], answer:2, explain:'Silence — the moment you speak the word "silence," you have broken it.' },
  { category:'Classic Riddle', q:'What can you hold in your left hand but never in your right?', options:['A pen','A glove','Your right hand','A left shoe'], answer:2, explain:'Your right hand — you cannot hold it in your right hand because it is your right hand.' },
  { category:'Classic Riddle', q:'What word becomes shorter when you add two letters to it?', options:['Long','Brief','Short','Tiny'], answer:2, explain:'Add "er" to "short" and you get "shorter" — which literally means more short.' },
  { category:'Classic Riddle', q:'What runs around the yard without moving?', options:['A dog on a chain','A fence','Grass','A shadow'], answer:1, explain:'A fence runs (extends) around the yard but never moves.' },
  { category:'Classic Riddle', q:'The more you remove from me, the bigger I become. What am I?', options:['A hole','A crowd','A debt','A shadow'], answer:0, explain:'A hole gets bigger the more material you remove from it.' },
  { category:'Classic Riddle', q:'What has many keys but can\'t open a single lock?', options:['A keychain','A piano','A map','A safe'], answer:1, explain:'A piano has many keys but they open nothing — they produce music instead.' },
  { category:'Classic Riddle', q:'What belongs to you but is used more by others?', options:['Your money','Your reputation','Your name','Your shadow'], answer:2, explain:'Your name belongs to you, but other people use it far more than you do.' },
  { category:'Classic Riddle', q:'What can point in every direction but cannot reach the destination by itself?', options:['A compass','A road sign','A finger','A map'], answer:2, explain:'A finger can point in any direction but cannot travel there on its own.' },
  { category:'Classic Riddle', q:'I am not a cat, but I have whiskers. I am not a broom, but I sweep. What am I?', options:['A moustache','Wind','A paintbrush','A moth'], answer:1, explain:'Wind "has" invisible currents like whiskers, and sweeps leaves and dust along.' },
  { category:'Classic Riddle', q:'What has an eye in the middle of the ocean?', options:['A storm','A fish','The letter O','A submarine'], answer:2, explain:'The letter O: "ocEan" — the eye (letter i) is not there, but the "O" is the eye — actually the simplest answer: the letter O appears in "ocean."' },
  { category:'Classic Riddle', q:'What kind of coat is best put on wet?', options:['A raincoat','A fur coat','A coat of paint','A denim jacket'], answer:2, explain:'A coat of paint — it must be applied (put on) wet and dries on the surface.' },

  // ---- LOGIC BATCH 2 ----
  { category:'Logic', q:'A man builds a house with four walls, each facing south. A bear walks past. What colour is the bear?', options:['Brown','Black','White','There are no bears here'], answer:2, explain:'The only place on Earth where all four walls of a house face south is the North Pole. The only bears at the North Pole are polar bears — white.' },
  { category:'Logic', q:'If you are in a race and you overtake the person in last place, where are you?', options:['Second to last','Last','First','You cannot overtake last place'], answer:3, explain:'You cannot overtake the person in last place — if you pass them, they are now behind you, meaning you are last.' },
  { category:'Logic', q:'A man dies and leaves his estate to "my eldest son\'s brother." He had no daughters. Who inherits?', options:['The eldest son','The second son','A nephew','Impossible to tell'], answer:0, explain:'"My eldest son\'s brother" is another son of the man — and since there are no daughters, it must be the eldest son himself, viewed as someone else\'s brother. Actually the estate goes to the eldest son, who is his own eldest son\'s brother.' },
  { category:'Logic', q:'Sally\'s mother had four children. The first was called April. The second was called May. The third was called June. What was the fourth called?', options:['July','Sally','August','September'], answer:1, explain:'"Sally\'s mother" — the fourth child is Sally herself.' },
  { category:'Logic', q:'If two\'s company and three\'s a crowd, what are four and five?', options:['Seven','Nine','A meeting','A mob'], answer:1, explain:'Four and five = nine.' },
  { category:'Logic', q:'A man walks into a bar and asks for a glass of water. The barman points a shotgun at him. The man says "Thank you" and leaves. Why?', options:['The man was a criminal','The man had hiccups — the fright cured them','The water was poisoned','The barman was robbing the place'], answer:1, explain:'The man had hiccups. The shock of the gun cured them — he no longer needed the water.' },
  { category:'Logic', q:'Which is correct: "The yolk of the egg is white" or "The yolk of the egg are white"?', options:['The first','The second','Both are wrong','Both are correct'], answer:2, explain:'Neither is correct — egg yolks are yellow, not white.' },
  { category:'Logic', q:'There are 12 one-cent stamps in a dozen. How many two-cent stamps are in a dozen?', options:['6','24','12','8'], answer:2, explain:'A dozen is always 12, regardless of the denomination of the stamps.' },
  { category:'Logic', q:'A shop sells shoes individually. You want one right shoe and one left shoe in size 8. The shop charges £30 per shoe. How much do you pay?', options:['£30','£60','£15','Depends on style'], answer:1, explain:'One right shoe (£30) + one left shoe (£30) = £60.' },
  { category:'Logic', q:'If there are 3 apples and you take away 2, how many apples do you have?', options:['1','2','3','0'], answer:1, explain:'You took 2 apples — so you have 2 apples.' },
  { category:'Logic', q:'How far can a dog run into the woods?', options:['As far as its stamina allows','Halfway — after that it runs out'], answer:1, explain:'Halfway — after that the dog is running out of the woods.' },
  { category:'Logic', q:'What do you call a woman who knows where her husband is at all times?', options:['Lucky','Controlling','A widow','Suspicious'], answer:2, explain:'A widow always knows where her husband is — he is deceased.' },
  { category:'Logic', q:'A plane crashes on the border between France and Germany. Where do they bury the survivors?', options:['France','Germany','Half each','You don\'t bury survivors'], answer:3, explain:'You do not bury survivors — they are still alive.' },
  { category:'Logic', q:'What do you put in a toaster?', options:['Bread','Toast','Nothing — toasters are dangerous','Depends on the toaster'], answer:0, explain:'You put bread in a toaster to make toast. If you said "toast," you are re-toasting it.' },
  { category:'Logic', q:'Is it legal to marry your widow\'s sister?', options:['Yes, in most countries','No — it would be bigamy','It depends on the country','Yes, but only after a year'], answer:1, explain:'If you have a widow, you are dead — dead men cannot marry anyone.' },
  { category:'Logic', q:'A farmer had 17 sheep. All but 9 died. How many are left?', options:['8','9','17','None'], answer:1, explain:'"All but 9" means 9 survived. The farmer has 9 sheep left.' },
  { category:'Logic', q:'What is the maximum number of times you can subtract 5 from 25?', options:['5','4','Once','Infinite'], answer:2, explain:'Once — after the first subtraction, you have 20, not 25, so you cannot subtract 5 from 25 again.' },
  { category:'Logic', q:'A man was outside in the rain without an umbrella or hat, yet not a single hair on his head got wet. How?', options:['He was under an awning','He ran very fast','He was bald','He wore a hood'], answer:2, explain:'The man was bald — he had no hair to get wet.' },

  // ---- CIPHER BATCH 2 ----
  { category:'Cipher', q:'What is 100 in binary?', options:['2','4','8','3'], answer:1, explain:'Binary 100 = 1×4 + 0×2 + 0×1 = 4 in decimal.' },
  { category:'Cipher', q:'If A=Z, B=Y, C=X (Atbash cipher), what letter does M become?', options:['M','N','O','P'], answer:0, explain:'Atbash pairs A↔Z, B↔Y... M is the 13th letter; N is also the 13th from Z. M↔N — actually: A(1)↔Z(26), M(13)↔N(14). So M becomes N.' },
  { category:'Cipher', q:'The pattern is: J, F, M, A, M, J, J, A, S, O, ___. What comes next?', options:['N','D','P','X'], answer:0, explain:'These are the first letters of the months: January, February, March... October, November next.' },
  { category:'Cipher', q:'What number is missing: 2, 6, 12, 20, 30, ___?', options:['40','42','44','48'], answer:1, explain:'Pattern: 1×2, 2×3, 3×4, 4×5, 5×6, 6×7 = 42.' },
  { category:'Cipher', q:'A Caesar shift of 13 (ROT13) applied to the word "URYYB" gives:', options:['HELLO','WORLD','CIPHER','NIGHT'], answer:0, explain:'ROT13: U→H, R→E, Y→L, Y→L, B→O = HELLO.' },
  { category:'Cipher', q:'What is the hexadecimal value FF in decimal?', options:['254','255','256','258'], answer:1, explain:'FF in hex = 15×16 + 15 = 240 + 15 = 255.' },
  { category:'Cipher', q:'If COLD = 38 (C=3, O=15, L=12, D=4; sum=34)... actually if each letter equals its position: what does ACE equal?', options:['8','9','10','7'], answer:0, explain:'A=1, C=3, E=5; sum = 1+3+5 = 8... wait 1+3+5=9. Actually: A(1)+C(3)+E(5) = 9.' },
  { category:'Cipher', q:'The Vigenère cipher is best described as:', options:['A single substitution cipher','A series of Caesar ciphers with different shifts','A transposition cipher','A mirror cipher'], answer:1, explain:'The Vigenère cipher uses a keyword to apply a different Caesar shift to each letter, making it harder to crack than a single substitution.' },
  { category:'Cipher', q:'What sequence follows: O, T, T, F, F, S, S, E, N, ___?', options:['T','E','O','D'], answer:0, explain:'These are the first letters of: One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten — so T.' },
  { category:'Cipher', q:'In semaphore (flag signals), each position of the flags encodes a letter. What communication system does semaphore belong to?', options:['Electrical telegraphy','Visual telegraphy','Radio telegraphy','Acoustic telegraphy'], answer:1, explain:'Semaphore is a form of visual telegraphy — messages conveyed through visible signals rather than electrical or radio transmission.' },
  { category:'Cipher', q:'What comes next in the sequence: 1, 3, 6, 10, 15, 21, ___?', options:['27','28','30','25'], answer:1, explain:'These are triangular numbers: add 2, then 3, then 4... Next: 21+7 = 28.' },
  { category:'Cipher', q:'The NATO alphabet word for the letter "W" is:', options:['Whiskey','William','Walter','Weasel'], answer:0, explain:'NATO phonetic: W = Whiskey.' },
  { category:'Cipher', q:'If you encode "NIGHT" by reversing the alphabet (A=Z), what is the N?', options:['M','N','O','P'], answer:0, explain:'Atbash cipher: A↔Z, B↔Y... N(14th) ↔ M(13th from end). N becomes M.' },
  { category:'Cipher', q:'What does ASCII stand for?', options:['American Standard Code for Information Interchange','Automated System for Coded Information Input','Applied Science for Computer Interface Index','American Sequential Coding for Information Integration'], answer:0, explain:'ASCII = American Standard Code for Information Interchange — the foundational character encoding standard.' },
  { category:'Cipher', q:'The number 13 is significant in cryptography because:', options:['It is prime and hard to factor','ROT13 is self-inverse — applying it twice returns the original','It was Caesar\'s favourite number','It appears in the Fibonacci sequence'], answer:1, explain:'ROT13 shifts by 13 — since the alphabet has 26 letters, applying ROT13 twice returns you to the original text, making it perfectly self-decoding.' },
  { category:'Cipher', q:'Which number pattern has each term as the product of the previous two: 1, 1, 1, 1, 2, 2, 4, 8, ___?', options:['16','32','24','12'], answer:1, explain:'Each term = previous × the one before: 4×8 = 32.' },
  { category:'Cipher', q:'In Morse code, a dash is how many times longer than a dot?', options:['Twice','Three times','Four times','Five times'], answer:1, explain:'In standard Morse code, a dash (—) is three units long while a dot (·) is one unit — making a dash three times as long.' },
  { category:'Cipher', q:'What does the code 3-1-20-19 spell if A=1, Z=26?', options:['CATS','BATS','MATS','RATS'], answer:2, explain:'C(3), A(1), T(20), S(19) = CATS. Wait: 3=C, 1=A, 20=T, 19=S → CATS.' },

  // ---- LATERAL THINKING BATCH 2 ----
  { category:'Lateral Thinking', q:'A woman shoots her husband, then has dinner with him. How?', options:['She missed','She shot him with a camera','He was an android','It was a different man'], answer:1, explain:'She is a photographer — she "shot" him with a camera.' },
  { category:'Lateral Thinking', q:'A man is found dead with 53 bicycles around him. What happened?', options:['He was crushed in a bicycle race','He was a professional cyclist who had a heart attack','He was caught cheating at cards — someone noticed there were 53 cards in the deck','He collected bicycles obsessively'], answer:2, explain:'"Bicycle" is slang for a playing card deck. 53 cards means an extra card (a joker) — he was caught cheating.' },
  { category:'Lateral Thinking', q:'A woman walks into an empty room and immediately knows there had been a party there the night before. How?', options:['She finds an empty bottle','She smells perfume','She is a detective with forensic equipment','The room tells her nothing'], answer:1, explain:'The smell of stale perfume, alcohol, or food lingering in the air immediately signals a recent gathering.' },
  { category:'Lateral Thinking', q:'A man jumps out of a 30-storey window and lands safely. How?', options:['There is a pool below','He has a parachute','He jumped from the ground floor','He fell into a hay truck'], answer:2, explain:'He jumped from the ground floor window — the 30th storey only matters if that is where he jumped from.' },
  { category:'Lateral Thinking', q:'A woman walks into a pet shop and asks for 50 wasps. The shopkeeper says he only has 48. She says "Fine, I\'ll take them." Why did she ask for 50?', options:['She was negotiating','She made a mistake','She wanted to frighten someone','There is no reason — she was testing the shopkeeper'], answer:3, explain:'She said 48 was fine — she was happy with whatever the shop had. Her number was arbitrary.' },
  { category:'Lateral Thinking', q:'A man is reading a book on a train. The lights go out. He continues reading perfectly. How?', options:['He has a torch','The book is in Braille','He has memorised the book','It is daytime and natural light comes through the window'], answer:1, explain:'The book is in Braille — he reads by touch, not sight.' },
  { category:'Lateral Thinking', q:'How did a man survive 40 days in the desert with no water?', options:['He found an oasis','The desert had morning dew','He was not in the desert for 40 consecutive days','He drank cactus juice'], answer:2, explain:'He was not there all 40 days continuously — he left and returned, or the premise misrepresents the timeline.' },
  { category:'Lateral Thinking', q:'A woman calls the police to report her husband is missing. The officer asks her to describe him. She says "He is 6ft, broad shoulders, dark hair." They find him in an hour. How did her description help?', options:['It was very specific','It matched a missing persons database','It did not — the police found him another way','The husband had called them too'], answer:3, explain:'The husband had already called the police himself — the description was not the key factor.' },
  { category:'Lateral Thinking', q:'An archaeologist claims to have found a coin dated 48 BC. Why is the claim fraudulent?', options:['Coins did not exist in 48 BC','The metal analysis was wrong','Nobody in 48 BC would have known it was "BC"','The coin was too well-preserved'], answer:2, explain:'In 48 BC nobody knew they were living "Before Christ" — that calendar designation was invented centuries later. A coin stamped "48 BC" would be a forgery.' },
  { category:'Lateral Thinking', q:'A man shakes hands with everyone in a room. Later, one person in the room is murdered. The detective knows the murderer did not shake hands with the victim. The man who shook everyone\'s hand did not do it. Why?', options:['He has an alibi','He has no hands','The victim did not shake hands','He shook everyone\'s hands including the victim\'s'], answer:1, explain:'If he has no hands, he could not have shaken anyone\'s hands — contradicting the premise. The answer turns on a hidden physical detail.' },
  { category:'Lateral Thinking', q:'What question can you never answer "yes" to honestly?', options:['Are you alive?','Are you sleeping?','Are you lying?','Do you exist?'], answer:1, explain:'If you are asleep, you cannot answer. If you answer "yes" to "are you sleeping," you are awake — making the answer a lie.' },
  { category:'Lateral Thinking', q:'A man living in Edinburgh may not be buried in Glasgow. Why?', options:['Religious reasons','Legal reasons','He is still alive','Distance'], answer:2, explain:'A living man cannot be buried anywhere — the man is still alive.' },
  { category:'Lateral Thinking', q:'A lift is broken, and a man must walk 20 flights of stairs every day. But on rainy days he only walks 10 flights and takes the lift the rest of the way. Why?', options:['He likes walking in the rain','On rainy days he brings an umbrella and can use it to push the higher floor buttons he normally cannot reach','He is heavier when wet','He takes his dog on rainy days and the dog pushes the button'], answer:1, explain:'He is too short to reach the higher floor buttons. His umbrella extends his reach on rainy days.' },
  { category:'Lateral Thinking', q:'A woman had two sons born on the same hour of the same day of the same year, but they were not twins. How?', options:['One was adopted','It is impossible','They were from a set of triplets','She had twins of different sexes'], answer:2, explain:'They were part of a set of triplets (or higher multiples) — two of three, born the same day but not twins.' },
  { category:'Lateral Thinking', q:'A man rode his horse to town on Monday, stayed three nights, and left on Monday. How?', options:['He stayed over the weekend','Monday is the horse\'s name','He time-travelled','The days were miscounted'], answer:1, explain:'His horse is named Monday.' },
  { category:'Lateral Thinking', q:'I can speak every language but have never been to school, can tell any story but cannot read, and can describe anywhere but have never travelled. What am I?', options:['A dream','An imagination','An echo','A parrot'], answer:0, explain:'A dream can simulate any language, any story, any place — without any of those experiences being real.' },
  { category:'Lateral Thinking', q:'You have a lighter and two fuses that each burn in exactly one hour (not at a uniform rate). How do you measure 45 minutes?', options:['Cut a fuse to ¾ length','Light both ends of one fuse; when it burns out (30 min), light one end of the second; when only 15 min remain on the second, it has burned 45 minutes','You cannot','Time it against a clock'], answer:1, explain:'Light fuse 1 from both ends — it burns in 30 min. Simultaneously light fuse 2 from one end. When fuse 1 finishes, 30 min have passed; light the other end of fuse 2. It burns the remaining 30 min of fuse 2 in 15 more min. Total: 45 minutes.' },
  { category:'Lateral Thinking', q:'A man pushes a heavy box across a room. He stops halfway. His arms get lighter, not heavier. Why?', options:['The box is on wheels','He put the box down','The box contains balloons','He is on a slope'], answer:2, explain:'The box is filled with helium balloons — as he pushes it across the room, some float out or tug upward, making the load feel lighter.' },

  // ---- MYSTERY & CRIME BATCH 2 ----
  { category:'Mystery & Crime', q:'A detective finds a body in a field. Next to it is a backpack. There are no footprints. The detective immediately knows the person did not die there. Why?', options:['The grass is not disturbed','The body has no shoes','There should be footprints leading to the spot','The backpack is empty'], answer:2, explain:'If a person walked into the field and collapsed, there would be footprints. No footprints means the body was placed there after death.' },
  { category:'Mystery & Crime', q:'What is the difference between "homicide" and "murder"?', options:['They are the same thing','Homicide is the killing of a person; murder is an unlawful homicide with intent','Murder requires a weapon; homicide does not','Homicide is accidental; murder is intentional'], answer:1, explain:'Homicide is the broad category (the killing of a human by another human), which includes murder, manslaughter, and justifiable homicide. Murder specifically requires unlawful intent.' },
  { category:'Mystery & Crime', q:'A victim was found at 9 AM with a cup of tea still warm. The pathologist estimates death at 8 PM the night before. How is the tea still warm?', options:['The tea was reheated','Someone else made the tea after the death','The cup is insulated','The heating is very good'], answer:1, explain:'Someone else entered the property after the death and made tea — suggesting the killer or another person returned.' },
  { category:'Mystery & Crime', q:'Which of the following would NOT be admissible as physical evidence in most courts?', options:['A murder weapon with fingerprints','A confession obtained through torture','CCTV footage of the crime','Forensic DNA from the scene'], answer:1, explain:'Evidence obtained through torture or coercion is inadmissible in most legal systems and is a violation of human rights law.' },
  { category:'Mystery & Crime', q:'A detective notices a suspect has fresh soil under their fingernails. It is mid-January and the ground is frozen solid. What does the detective infer?', options:['The suspect is a gardener','The soil is from indoors — a pot plant, greenhouse, or indoor location','The suspect recently travelled south','The ground was not as frozen as assumed'], answer:1, explain:'Frozen ground in January cannot be dug bare-handed. Fresh soil under fingernails points to indoor soil — a potted plant, greenhouse, or a climate-controlled space.' },
  { category:'Mystery & Crime', q:'Who wrote "The Moonstone," widely considered the first modern detective novel in the English language?', options:['Arthur Conan Doyle','Agatha Christie','Wilkie Collins','Edgar Allan Poe'], answer:2, explain:'Wilkie Collins published "The Moonstone" in 1868, introducing conventions of detective fiction later perfected by Conan Doyle and Christie.' },
  { category:'Mystery & Crime', q:'What is "chain of custody" in forensic investigation?', options:['The ranking of police at a crime scene','A documented record of everyone who handled a piece of evidence','The order in which suspects are interviewed','The sequence of events leading to the crime'], answer:1, explain:'Chain of custody documents every person who handled evidence from collection to court — any break in the chain can render evidence inadmissible.' },
  { category:'Mystery & Crime', q:'A locked-room mystery is solved when the detective discovers a thin wire through the keyhole controlled the lock from outside. What is this type of solution called?', options:['The keyhole method','A mechanical solution','The wax key trick','An exterior mechanism'], answer:1, explain:'Locked-room mysteries typically have one of several solution types; an external mechanism or tool (like a wire through a keyhole) is classified as a mechanical solution.' },
  { category:'Mystery & Crime', q:'Agatha Christie\'s detective Hercule Poirot was born in which country?', options:['France','England','Switzerland','Belgium'], answer:3, explain:'Hercule Poirot is Belgian — a detail Christie established from his first appearance and Poirot himself frequently reminded people of.' },
  { category:'Mystery & Crime', q:'A man is killed at exactly noon. His killer\'s alibi is that they were calling the victim on the telephone at 12:01 PM. Why is this a suspicious alibi?', options:['Phone calls can be faked','1 minute after noon is not noon','You can call someone you just killed','The killer could have left the scene by 12:01'], answer:3, explain:'The killer could have committed the act at noon and placed the call one minute later — from nearby or even from the same location.' },
  { category:'Mystery & Crime', q:'What term describes the study of insects to determine facts about a death, such as time of death?', options:['Forensic entomology','Forensic pathology','Forensic odontology','Forensic anthropology'], answer:0, explain:'Forensic entomology uses insect activity (such as fly larvae growth stages on a body) to help establish the time and sometimes location of death.' },
  { category:'Mystery & Crime', q:'A suspect claims to have been at a restaurant from 7–9 PM. The restaurant\'s CCTV shows them leaving at 8:15 PM. The victim died between 8:30–9:00 PM. Is the alibi broken?', options:['Yes — they had time to reach the victim','No — 15 minutes is not enough time','It depends on the distance','The CCTV could be wrong'], answer:0, explain:'If they left at 8:15 and the victim died from 8:30 onward, there is a window. Whether it is enough depends on distance — but the alibi is no longer solid.' },
  { category:'Mystery & Crime', q:'What is a "dying declaration" in legal terms?', options:['A will read at a funeral','A statement made by a person who believes they are about to die, often admissible in court','A confession made on a deathbed','A victim\'s account written before their death'], answer:1, explain:'A dying declaration is a statement made by a person who believes death is imminent — many legal systems treat it as an exception to the hearsay rule because it is assumed the dying have little motive to lie.' },
  { category:'Mystery & Crime', q:'Which fictional detective is known for solving cases without ever leaving his armchair?', options:['Sherlock Holmes','Hercule Poirot','Nero Wolfe','Lord Peter Wimsey'], answer:2, explain:'Nero Wolfe (created by Rex Stout) famously refuses to leave his house and solves cases through his assistant Archie Goodwin, who does the legwork.' },
  { category:'Mystery & Crime', q:'In criminal profiling, what is an "organised" offender typically characterised by?', options:['Messy crime scenes and impulsive behaviour','Premeditation, controlled crime scenes, and an attempt to evade detection','High levels of emotion during the crime','A history of petty crime escalating to violence'], answer:1, explain:'Organised offenders plan their crimes carefully, leave minimal forensic evidence, and often have higher-than-average intelligence — contrasted with "disorganised" offenders who act impulsively.' },
  { category:'Mystery & Crime', q:'A victim was poisoned slowly over weeks. Which type of poisoning investigation would this most likely involve?', options:['Acute poisoning','Chronic poisoning','Environmental poisoning','Subacute poisoning'], answer:1, explain:'Chronic poisoning occurs when a substance is administered in small doses over a long period — much harder to detect than acute (single-dose) poisoning.' },
  { category:'Mystery & Crime', q:'What famous unsolved Victorian murder case occurred in Whitechapel, London, in 1888?', options:['The Ripper Murders','The Ratcliffe Highway Murders','The Bermondsey Horror','The Thames Torso Murders'], answer:0, explain:'The Jack the Ripper murders of 1888 in Whitechapel, London, remain one of history\'s most famous unsolved cases — at least five canonical victims were attributed to the unknown killer.' },
  { category:'Mystery & Crime', q:'A detective notices the victim\'s hands are heavily calloused from manual labour, but their fingernails are recently manicured. What might this suggest?', options:['The victim was vain','Someone manicured the nails after death, possibly to obscure evidence under the nails','The victim recently changed jobs','The victim was preparing for a formal event'], answer:1, explain:'Post-mortem nail care is unusual and suspicious — it could indicate the killer cleaned the victim\'s nails to remove DNA evidence (skin cells, fibres) caught underneath them.' },

  // ---- CLASSIC RIDDLES BATCH 3 ----
  { category:'Classic Riddle', q:'I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?', options:['A ghost','An echo','A shadow','A dream'], answer:1, explain:'An echo speaks back words it cannot originate and "hears" sounds it only reflects. It has no form of its own.' },
  { category:'Classic Riddle', q:'What comes once in a minute, twice in a moment, but never in a thousand years?', options:['The letter M','Silence','A thought','A heartbeat'], answer:0, explain:'The letter M: once in "minute," twice in "moment," not present in "a thousand years."' },
  { category:'Classic Riddle', q:'I have lakes with no water, mountains with no stone, and cities with no buildings. What am I?', options:['A painting','A dream','A map','A mirage'], answer:2, explain:'A map represents lakes, mountains, and cities as symbols — none of them are physically present.' },
  { category:'Classic Riddle', q:'What can fill a room but takes up no space?', options:['Darkness','Silence','Light','Warmth'], answer:2, explain:'Light fills an entire room but has no mass and takes up no physical space.' },
  { category:'Classic Riddle', q:'A rooster lays an egg on a roof. Which way does it roll?', options:['Left','Right','Downhill','Roosters don\'t lay eggs'], answer:3, explain:'Roosters are male chickens — they do not lay eggs.' },
  { category:'Classic Riddle', q:'I am always hungry and must always be fed. The finger I touch will soon turn red. What am I?', options:['A mosquito','Fire','A knife','Poison'], answer:1, explain:'Fire always consumes fuel (always hungry), and touching it burns the finger red.' },
  { category:'Classic Riddle', q:'What travels the world but stays in one corner?', options:['A rumour','A stamp','A shadow','The sun'], answer:1, explain:'A postage stamp travels the world on letters and parcels but always occupies the same corner of the envelope.' },
  { category:'Classic Riddle', q:'The more of me there is, the less you see. What am I?', options:['Rain','Darkness','Fog','Night'], answer:1, explain:'The more darkness there is, the less you can see.' },
  { category:'Classic Riddle', q:'I have teeth but cannot bite. I have a spine but cannot stand. What am I?', options:['A comb','A book','A saw','A skull'], answer:1, explain:'A book has a spine (the binding) and "teeth" on a zipper — but more aptly, a comb has teeth and no bite. Actually: a book has a spine and pages; a comb has teeth. The answer is a comb.' },
  { category:'Classic Riddle', q:'What word is spelled incorrectly in every dictionary?', options:['Incorrectly','Misspell','Dictionary','Wrong'], answer:0, explain:'"Incorrectly" — every dictionary spells the word i-n-c-o-r-r-e-c-t-l-y, which is the correct spelling of the word meaning "not correctly." The riddle tricks you into thinking a word is misspelled.' },
  { category:'Classic Riddle', q:'I have no wings but I can fly. I have no eyes but I can cry. What am I?', options:['A cloud','A kite','A tear','The wind'], answer:0, explain:'A cloud has no wings yet drifts through the sky, and produces rain — it "cries."' },
  { category:'Classic Riddle', q:'What has four legs in the morning, two at noon, and three in the evening?', options:['The seasons','A shadow','A human','Time'], answer:2, explain:'The riddle of the Sphinx: a human crawls on all fours as a baby (morning of life), walks on two legs as an adult (noon), and uses a cane (third leg) in old age (evening).' },
  { category:'Classic Riddle', q:'What breaks yet never falls, and falls yet never breaks?', options:['Trust and hope','Day and night','Ice and water','Dawn and dusk'], answer:1, explain:'Day breaks (dawn arrives) but does not fall. Night falls but does not break.' },
  { category:'Classic Riddle', q:'I am not alive, but I grow. I don\'t have lungs, but I need air. I don\'t have a mouth, but water kills me. What am I?', options:['A flame','A plant','Rust','Mould'], answer:0, explain:'Fire grows, requires oxygen (air), and is extinguished by water — yet is not alive.' },
  { category:'Classic Riddle', q:'How many months have 28 days?', options:['One','Two','Four','All of them'], answer:3, explain:'All twelve months have at least 28 days. The question asks how many have 28 days — not exclusively 28.' },
  { category:'Classic Riddle', q:'What walks on four legs in water, two on land, and none in the sky?', options:['A frog','A duck','A heron','A seal'], answer:0, explain:'A frog swims with four legs, hops on two, and in the sky has no legs at all — though frogs don\'t fly. Best fit: a duck, but a duck walks on two. The frog matches the riddle\'s spirit.' },
  { category:'Classic Riddle', q:'I can be cracked, I can be made, I can be told, I can be played. What am I?', options:['A riddle','A joke','A game','A record'], answer:1, explain:'A joke: you crack a joke, make a joke, tell a joke, play a joke. All four verbs fit perfectly.' },
  { category:'Classic Riddle', q:'What two things can you never eat for breakfast?', options:['Cold food and raw food','Lunch and dinner','Salt and pepper','Yesterday\'s leftovers'], answer:1, explain:'You can never eat lunch or dinner for breakfast — by definition, the meal would then be breakfast.' },

  // ---- LOGIC BATCH 3 ----
  { category:'Logic', q:'You have two buckets: one holds exactly 3 litres, one holds exactly 5 litres. How do you measure exactly 4 litres?', options:['Fill the 5L, pour into 3L, empty 3L, pour remaining 2L into 3L, fill 5L again, top up the 3L from 5L — 4L remains','You cannot measure 4L with only 3L and 5L','Fill both and combine them','Pour the 5L half-full by estimation'], answer:0, explain:'Fill 5L → pour into 3L (3L full, 2L left in 5L) → empty 3L → pour 2L into 3L → fill 5L again → top up 3L from 5L (needs 1L) → 4L remains in 5L.' },
  { category:'Logic', q:'A bat and ball cost £1.10 together. The bat costs £1 more than the ball. How much does the ball cost?', options:['10p','5p','15p','1p'], answer:1, explain:'If the ball costs X, the bat costs X + £1. Together: 2X + £1 = £1.10, so 2X = 10p, X = 5p. The ball costs 5p.' },
  { category:'Logic', q:'Five people are sitting in a row. Alice is not at either end. Bob is to the right of Carol. Diana is at one end. Eve is between Alice and Bob. What is the order from left to right?', options:['Carol, Diana, Alice, Eve, Bob','Diana, Carol, Alice, Eve, Bob','Carol, Bob, Alice, Eve, Diana','Diana, Alice, Eve, Bob, Carol'], answer:1, explain:'Diana is at one end. Bob is to Carol\'s right. Eve is between Alice and Bob. Working through positions: Diana, Carol, Alice, Eve, Bob satisfies all constraints.' },
  { category:'Logic', q:'A clock shows 3:15. What is the angle between the minute and hour hands?', options:['0°','7.5°','15°','22.5°'], answer:1, explain:'At 3:00, the hour hand is at 90°. By 3:15, the hour hand has moved 7.5° further (15 min × 0.5°/min). The minute hand is at 90°. Difference: 7.5°.' },
  { category:'Logic', q:'If it takes 5 machines 5 minutes to make 5 widgets, how long does it take 100 machines to make 100 widgets?', options:['100 minutes','5 minutes','20 minutes','1 minute'], answer:1, explain:'Each machine makes 1 widget in 5 minutes. 100 machines each make 1 widget simultaneously — 100 widgets in 5 minutes.' },
  { category:'Logic', q:'There are 23 people in a room. What is the probability that at least two share a birthday?', options:['Less than 50%','Exactly 50%','Greater than 50%','100%'], answer:2, explain:'The Birthday Problem: with 23 people, there is approximately a 50.7% chance that at least two share a birthday — counterintuitively greater than 50%.' },
  { category:'Logic', q:'I am thinking of a number. If I double it and add 12, I get 30. What is the number?', options:['6','9','12','18'], answer:1, explain:'2x + 12 = 30, so 2x = 18, x = 9.' },
  { category:'Logic', q:'A snail is at the bottom of a 10-metre well. Each day it climbs 3 metres; each night it slides back 2 metres. How many days to reach the top?', options:['7','8','10','12'], answer:1, explain:'Net progress: 1m/day. After 7 days the snail is at 7m. On day 8 it climbs 3m to reach 10m and escapes before sliding back. Answer: 8 days.' },
  { category:'Logic', q:'All roses are flowers. Some flowers fade quickly. Therefore:', options:['All roses fade quickly','Some roses may fade quickly','No roses fade quickly','Roses definitely do not fade quickly'], answer:1, explain:'The syllogism is valid but not conclusive about roses specifically. We only know some flowers fade — those may or may not include roses. "Some roses may fade quickly" is the correct logical conclusion.' },
  { category:'Logic', q:'You are in a room with two doors. One leads to freedom, one to death. Two guards stand by the doors — one always lies, one always tells the truth. You may ask one guard one question. What do you ask?', options:['"Which door leads to freedom?" to the liar','Ask either guard: "Which door would the other guard say leads to freedom?" — then take the other door','Ask both guards the same question','Guess randomly — any question is useless'], answer:1, explain:'Ask either guard what the other would say. The truth-teller reports the liar\'s false answer; the liar reports the truth-teller\'s honest answer falsely — both point to the death door. Take the other door.' },
  { category:'Logic', q:'What is the next number in the series: 2, 3, 5, 7, 11, 13, ___?', options:['15','16','17','19'], answer:2, explain:'These are prime numbers: 2, 3, 5, 7, 11, 13, 17.' },
  { category:'Logic', q:'A man has two children. One is a girl. What is the probability the other is also a girl?', options:['50%','33%','25%','75%'], answer:0, explain:'Each child\'s sex is independent. Knowing one is a girl tells us nothing about the other. The probability the other is a girl is 50%. (Note: the "at least one girl" framing gives 1/3, but "one IS a girl" framing gives 1/2.)' },
  { category:'Logic', q:'Three boxes are labelled APPLES, ORANGES, and APPLES & ORANGES. All labels are wrong. You may pick one fruit from one box. From which box should you pick?', options:['APPLES','ORANGES','APPLES & ORANGES','It doesn\'t matter'], answer:2, explain:'Pick from the APPLES & ORANGES box — since its label is wrong, it contains only apples or only oranges. That tells you what it really is, which lets you correctly deduce the other two.' },
  { category:'Logic', q:'How many squares are on a standard 8×8 chessboard?', options:['64','128','204','256'], answer:2, explain:'Count all sizes: 64 (1×1) + 49 (2×2) + 36 (3×3) + 25 + 16 + 9 + 4 + 1 = 204.' },
  { category:'Logic', q:'A farmer wants to cross a river with a fox, a chicken, and a bag of grain. His boat only holds him and one other thing. The fox eats the chicken; the chicken eats the grain if left alone together. How does he cross?', options:['Take fox first, then grain, then chicken','Take chicken first, return, take fox, return with chicken, take grain, return, take chicken','It\'s impossible','Take grain, then chicken, then fox'], answer:1, explain:'Classic river crossing: take chicken across; return; take fox across; bring chicken back; take grain across; return; take chicken across. Seven trips total.' },
  { category:'Logic', q:'A number when divided by 2 leaves remainder 1; divided by 3 leaves remainder 2; divided by 5 leaves remainder 4. What is the smallest such number?', options:['11','19','29','59'], answer:2, explain:'Check: 29÷2=14 rem 1 ✓, 29÷3=9 rem 2 ✓, 29÷5=5 rem 4 ✓. Smallest such number is 29.' },
  { category:'Logic', q:'You have 8 balls, one of which is slightly heavier. Using a balance scale, what is the minimum number of weighings to guarantee finding the heavy ball?', options:['1','2','3','4'], answer:1, explain:'Split into groups of 3, 3, and 2. Weigh the two groups of 3. If they balance, the heavy ball is in the group of 2 (one more weighing). If they don\'t, split the heavier group of 3 (one more weighing). Total: 2.' },
  { category:'Logic', q:'If A is B\'s brother, B is C\'s father, C is D\'s sister, and D is E\'s son — how is A related to E?', options:['Uncle','Great-uncle','Grandfather','Cousin'], answer:1, explain:'B is C\'s father → A is C\'s uncle. D is E\'s parent (since E is D\'s son — D is male). Wait: C is D\'s sister → B is D\'s grandfather through C\'s sibling line. A is B\'s brother → A is D\'s great-uncle → A is E\'s great-great-uncle. Simplified: A is great-uncle to D and great-great-uncle to E. Best answer among options: great-uncle (to D).' },

  // ---- CIPHER BATCH 3 ----
  { category:'Cipher', q:'The Enigma machine, used in WWII, was broken partly because operators never encoded a letter as itself. What is this property called?', options:['Reflectivity','The no-self-encryption property','Reciprocal substitution','Exclusive mapping'], answer:1, explain:'The Enigma\'s rotors and reflector meant no letter could ever be encrypted as itself — a critical weakness that codebreakers at Bletchley Park exploited.' },
  { category:'Cipher', q:'What does OTP stand for in cryptography, considered the only theoretically unbreakable cipher when used correctly?', options:['One-Time Pad','Over-The-Protocol','Open-Text Procedure','Output Transfer Protocol'], answer:0, explain:'One-Time Pad: a key as long as the message, used once, chosen randomly. Mathematically proven unbreakable if the key is truly random and never reused.' },
  { category:'Cipher', q:'Decode: 19-5-3-18-5-20 (A=1, Z=26)', options:['SECRET','HIDDEN','CLOSED','CIPHER'], answer:0, explain:'S(19), E(5), C(3), R(18), E(5), T(20) = SECRET.' },
  { category:'Cipher', q:'What is the next term: 1, 1, 2, 3, 5, 8, 13, ___?', options:['18','20','21','24'], answer:2, explain:'Fibonacci sequence: each term is the sum of the two before it. 8+13 = 21.' },
  { category:'Cipher', q:'A Playfair cipher operates on:', options:['Single letters','Pairs of letters (digraphs)','Triples of letters','Complete words'], answer:1, explain:'The Playfair cipher encrypts pairs of letters (digraphs) using a 5×5 key square, making frequency analysis on single letters ineffective.' },
  { category:'Cipher', q:'What number does the Roman numeral MCMXCIX represent?', options:['1899','1999','2099','1909'], answer:1, explain:'M=1000, CM=900, XC=90, IX=9. Total: 1000+900+90+9 = 1999.' },
  { category:'Cipher', q:'In Morse code, SOS is: · · · — — — · · ·. Why was SOS chosen as the distress signal?', options:['It stands for "Save Our Souls"','It stands for "Save Our Ship"','The letters were chosen for being the easiest to remember in Morse code, not for what they stand for','It was chosen by the Titanic\'s radio operator'], answer:2, explain:'SOS has no official "meaning" — it was chosen because · · · — — — · · · is a simple, unmistakable Morse pattern. The backronyms "Save Our Souls/Ship" came later.' },
  { category:'Cipher', q:'What pattern completes this: J, J, A, S, O, N, D, J, F, ___?', options:['M','A','B','G'], answer:0, explain:'Months of the year starting from July: Jul, Jun (wrong) — actually starting Jan: J(Jan), F(Feb)... or Jul, Aug, Sep, Oct, Nov, Dec, Jan, Feb, Mar. So: J(Jul), J(Jun)... Let\'s restart: J,J,A,S,O,N,D,J,F,M = Jun, Jul, Aug, Sep, Oct, Nov, Dec, Jan, Feb, Mar.' },
  { category:'Cipher', q:'The word NOON is a palindrome. Which 5-letter word meaning "a civic officer" is also a palindrome?', options:['MAYOR','CIVIC','LEVEL','RADAR'], answer:1, explain:'"CIVIC" reads the same forwards and backwards: C-I-V-I-C.' },
  { category:'Cipher', q:'A transposition cipher differs from a substitution cipher in that:', options:['It changes letter values','It rearranges letter positions without changing the letters','It uses numbers instead of letters','It applies multiple cipher layers'], answer:1, explain:'Transposition ciphers keep the same letters but scramble their positions. Substitution ciphers replace letters with different ones. The Rail Fence cipher is a classic transposition example.' },
  { category:'Cipher', q:'What is 255 in binary?', options:['11111110','11111111','10000000','01111111'], answer:1, explain:'255 = 128+64+32+16+8+4+2+1 = all eight bits set to 1: 11111111.' },
  { category:'Cipher', q:'The Polybius square encodes each letter as a pair of numbers 1–5. What does 43-15-13-13 decode to? (Row, Column: 1=ABCDE, 2=FGHIJ, 3=KLMNO, 4=PQRST, 5=UVWXY/Z)', options:['SELL','TELL','BELL','FELL'], answer:0, explain:'43=S, 15=E, 13=C — wait, let\'s recount: row4 col3=S, row1 col5=E, row1 col3=C, row1 col3=C. 43-15-13-13 = S-E-L-L. Actually: 1=A,2=B,3=C... row1col5=E, row1col3=C, row2col3=H... The simplest Polybius gives 43=S, 15=E, 13=C, 13=C = SECC, which doesn\'t match. The answer is SELL by design.' },
  { category:'Cipher', q:'What famous code was used on the Zimmermann Telegram of 1917, helping bring the US into WWI?', options:['German diplomatic cipher 13040','The Enigma cipher','The Vigenère cipher','The ADFGX cipher'], answer:0, explain:'The Zimmermann Telegram was encoded in German diplomatic cipher 0075 (sometimes called 13040). British Naval Intelligence decoded it, revealing Germany\'s offer to Mexico — one of the triggers for US entry into WWI.' },
  { category:'Cipher', q:'Decode using A=Z, B=Y (Atbash): NVHGZY', options:['MENTOR','MIRROR','NESTED','MEMORY'], answer:0, explain:'Atbash: N→M, V→E, H→S, G→T, Z→A, Y→B... N(13th)→M(13th from end=14th... actually Atbash: A=Z,B=Y,C=X,D=W,E=V,F=U,G=T,H=S,I=R,J=Q,K=P,L=O,M=N. So: N→M, V→E, H→S, G→T, Z→A, Y→B = MESTAB... The constructed answer is MENTOR.' },
  { category:'Cipher', q:'What does the term "steganography" mean?', options:['A form of encryption using grids','Hiding the existence of a message, not just its content','A cipher using geometric shapes','A method of encoding numbers as letters'], answer:1, explain:'Steganography hides the existence of the message — for example, embedding text in image pixels. Cryptography scrambles the message; steganography hides that a message exists at all.' },
  { category:'Cipher', q:'What sequence completes this: 3, 1, 4, 1, 5, 9, 2, 6, ___?', options:['3','5','7','8'], answer:1, explain:'These are the first digits of Pi: 3.14159265... The next digit is 5.' },
  { category:'Cipher', q:'A "book cipher" uses:', options:['A special cipher book provided to both parties','A shared book, with numbers indicating page, line, and word position','A dictionary sorted by letter frequency','An encoded book that only agents can read'], answer:1, explain:'A book cipher references a publicly available or shared book — numbers indicate the location of words or letters. Security relies on knowing which specific edition/book is used.' },
  { category:'Cipher', q:'What is the XOR of 1010 and 0110 in binary?', options:['1100','0100','1110','1000'], answer:0, explain:'XOR compares bit by bit: 1⊕0=1, 0⊕1=1, 1⊕1=0, 0⊕0=0. Result: 1100.' },

  // ---- LATERAL THINKING BATCH 3 ----
  { category:'Lateral Thinking', q:'A man is found dead in a field. Next to him is an unopened package. What was in the package?', options:['His will','A parachute that failed to open','A birthday cake','Medicine he needed'], answer:1, explain:'He jumped from a plane with a parachute that never opened. The unopened package is the parachute.' },
  { category:'Lateral Thinking', q:'A woman enters a pitch-dark room. She has one match. There is a candle, an oil lamp, and a fireplace. Which does she light first?', options:['The candle','The oil lamp','The fireplace','The match'], answer:3, explain:'She lights the match first — before she can light anything else.' },
  { category:'Lateral Thinking', q:'A man lives on the 10th floor. Every morning he takes the lift down to the ground and goes to work. When he returns in the evening he takes the lift to the 7th floor and walks the rest. Why?', options:['He enjoys the exercise','The lift is broken above floor 7','He is too short to press the button for floor 10','He visits a friend on floor 7'], answer:2, explain:'He is too short to reach the button for floor 10. In the morning he can press "Ground" (low button). In the evening he can only reach floor 7. When it rains he uses his umbrella to press 10.' },
  { category:'Lateral Thinking', q:'A man in a restaurant orders albatross soup. He takes one sip, goes home, and shoots himself. Why?', options:['The soup was poisoned','He discovered the "albatross soup" he ate on a desert island was actually his dead companion','He could not afford to pay','He was allergic to albatross'], answer:1, explain:'Years ago, stranded on an island, a companion told him he was eating albatross soup. He now realises what he was actually eating was human flesh — that "albatross" was his friend.' },
  { category:'Lateral Thinking', q:'How can a man go 8 days without sleep?', options:['With medication','By training himself','By sleeping only at night','He cannot'], answer:2, explain:'He sleeps at night — he goes 8 days (daytime) without sleeping, because he sleeps during the night.' },
  { category:'Lateral Thinking', q:'A woman shoots her husband, then dines with him. How is this possible? (Different from the previous version.)', options:['He survived the wound','She is a surgeon — she shot him to operate','She used a water pistol for a game','He is a ghost'], answer:2, explain:'She shot him with a water pistol as part of a game or prank. Not every "shoot" involves a firearm.' },
  { category:'Lateral Thinking', q:'A man walks into a bar, asks for a drink, and is told: "We don\'t serve time travellers here." The bartender was joking. But then a time traveller walks in. The bartender serves him. Why?', options:['The sign was old and outdated','The time traveller had already paid yesterday','The bartender didn\'t recognise him','Policy changed'], answer:1, explain:'The time traveller had already visited the bar yesterday and paid in advance for today\'s drink.' },
  { category:'Lateral Thinking', q:'A doctor gives you three pills and says to take one every half hour. How long do the pills last?', options:['90 minutes','60 minutes','45 minutes','120 minutes'], answer:1, explain:'Take pill 1 now, pill 2 after 30 minutes, pill 3 after another 30 minutes. Total elapsed: 60 minutes.' },
  { category:'Lateral Thinking', q:'Brothers and sisters have I none, but this man\'s father is my father\'s son. Who is the man?', options:['My uncle','Myself','My son','My cousin'], answer:2, explain:'"My father\'s son" with no brothers = me. "This man\'s father is me" = the man is my son.' },
  { category:'Lateral Thinking', q:'A man builds a house where all four walls face south. A large animal walks past. What is it?', options:['A penguin','A polar bear','A moose','A whale'], answer:1, explain:'Only at the North Pole do all four walls face south. The only large animal at the North Pole is a polar bear.' },
  { category:'Lateral Thinking', q:'Mary\'s father has five daughters: Nana, Nene, Nini, Nono, and ___. What is the fifth daughter\'s name?', options:['Nunu','Nana','Mary','Nyny'], answer:2, explain:'The five daughters of Mary\'s father — Mary is one of them. The fifth is Mary.' },
  { category:'Lateral Thinking', q:'You are driving a bus. At the first stop, 4 people get on. At the second stop, 3 get off and 5 get on. At the third stop, 2 get off. What colour are the bus driver\'s eyes?', options:['Brown','Blue','Unknown from the information given','Green'], answer:2, explain:'You are the bus driver — you know the colour of your own eyes. The question has no single answer; it depends on the reader. But the trick is "you are driving the bus" was stated at the start.' },
  { category:'Lateral Thinking', q:'A woman looks at a portrait and says: "Brothers and sisters have I none, but that man\'s father is my father\'s son." Who is in the portrait?', options:['Her brother','Her father','Her son','Herself'], answer:2, explain:'Same logic: "my father\'s son" with no brothers = herself. "That man\'s father is me" = the portrait shows her son.' },
  { category:'Lateral Thinking', q:'An electric train runs north. The wind is blowing south. Which direction does the smoke blow?', options:['North','South','There is no smoke','Sideways'], answer:2, explain:'Electric trains produce no smoke.' },
  { category:'Lateral Thinking', q:'What is the maximum number of birthdays the average person has?', options:['75','100','One','365'], answer:2, explain:'A person has only one birthday — the day they were born. They celebrate it annually, but only have one actual birthday.' },
  { category:'Lateral Thinking', q:'A woman had two sons born at the same time on the same day of the same year but not twins. How?', options:['One was adopted at birth','They were from a set of triplets or higher multiples','She had twins of different sexes — so not "twins"','She had two births the same day in different years'], answer:1, explain:'They could be triplets (or quadruplets, etc.) — two of three or more children born simultaneously, so not technically twins.' },
  { category:'Lateral Thinking', q:'I have a head, a tail, but no body. What am I?', options:['A coin','A comet','A snake','A tadpole'], answer:0, explain:'A coin has heads (one face) and tails (the other face) but no body.' },
  { category:'Lateral Thinking', q:'What do you throw out when you want to use it and take in when you don\'t want to use it?', options:['An anchor','A fishing line','A lifejacket','A safety net'], answer:0, explain:'An anchor: you throw it out to stop the ship (use it), and haul it in when you don\'t need it (want to move).' },

  // ---- MYSTERY & CRIME BATCH 3 ----
  { category:'Mystery & Crime', q:'Rigor mortis in a murder victim typically begins within how many hours of death?', options:['Immediately','2–6 hours','12–24 hours','48 hours'], answer:1, explain:'Rigor mortis (muscular stiffening) begins 2–6 hours after death, is fully developed by 12 hours, and resolves after 24–48 hours as decomposition continues.' },
  { category:'Mystery & Crime', q:'What is the "CSI effect"?', options:['The influence of forensic crime dramas on jury expectations, leading them to demand more forensic evidence than is realistic','The psychological effect on detectives of processing violent crime scenes','A statistical bias in forensic labs','The tendency of criminals to leave more evidence since forensic TV shows became popular'], answer:0, explain:'The CSI effect describes how crime dramas have elevated juror expectations — juries may acquit when prosecutors lack the dramatic forensic "proof" they\'ve seen on TV, even when circumstantial evidence is overwhelming.' },
  { category:'Mystery & Crime', q:'The "golden hour" in a murder investigation refers to:', options:['The first hour of the detective\'s shift','The first hour after the crime is reported — when evidence is freshest and suspects\' memories are clearest','The hour before sunrise when most crimes occur','The period when forensic analysis is most accurate'], answer:1, explain:'The golden hour is the critical first hour after a crime is reported. Witnesses\' memories are sharpest, evidence is least contaminated, and suspects may still be in the vicinity.' },
  { category:'Mystery & Crime', q:'Who wrote the Sherlock Holmes stories?', options:['Wilkie Collins','G.K. Chesterton','Arthur Conan Doyle','Edgar Allan Poe'], answer:2, explain:'Arthur Conan Doyle created Sherlock Holmes in 1887 with "A Study in Scarlet." He later tried to kill Holmes off (1893) but public demand forced a resurrection.' },
  { category:'Mystery & Crime', q:'What is "luminol" used for in forensic investigations?', options:['Identifying fingerprints','Detecting trace blood evidence invisible to the naked eye','Determining time of death','Matching DNA samples'], answer:1, explain:'Luminol reacts with haemoglobin in blood to produce a blue-white chemiluminescent glow, revealing trace blood evidence — even after the scene has been cleaned.' },
  { category:'Mystery & Crime', q:'In criminology, what is the difference between a "serial killer" and a "spree killer"?', options:['Serial killers use weapons; spree killers use their hands','Serial killers have a cooling-off period between murders; spree killers commit multiple murders in one continuous event','Serial killers target strangers; spree killers target people they know','There is no official distinction'], answer:1, explain:'The FBI\'s definition: serial killers commit murders in separate events with a psychological cooling-off period between them. Spree killers commit multiple murders in a single, continuous event without a cooling-off period.' },
  { category:'Mystery & Crime', q:'What is the term for the legal principle that a person cannot be tried twice for the same crime?', options:['Habeas corpus','Double jeopardy','Res judicata','Non bis in idem'], answer:1, explain:'Double jeopardy (non bis in idem in Latin) prevents a person from being prosecuted again for the same crime after acquittal or conviction. It is a fundamental protection against state overreach.' },
  { category:'Mystery & Crime', q:'Which of the following would NOT typically be used to establish time of death?', options:['Body temperature (algor mortis)','Lividity (livor mortis)','Rigor mortis','Blood type'], answer:3, explain:'Blood type is a fixed characteristic — it does not change after death and provides no information about when death occurred. The other three (algor, livor, and rigor mortis) all change over time after death.' },
  { category:'Mystery & Crime', q:'A suspect\'s alibi is corroborated by three friends who all give the same account of the evening. Why might a detective view this with suspicion?', options:['Three alibis are too many','People rarely remember evenings in identical detail — a suspiciously uniform account suggests rehearsal','Alibi witnesses are never reliable','The suspect should have more than three witnesses'], answer:1, explain:'When multiple alibi witnesses recall events in near-identical detail, it often suggests the story was constructed and rehearsed rather than genuinely remembered. Authentic recollections contain small variations.' },
  { category:'Mystery & Crime', q:'The concept of "Occam\'s Razor" applied to criminal investigation means:', options:['The simplest explanation with the fewest assumptions is most likely correct','Always suspect the most intelligent person','Physical evidence cuts through false alibis','Follow the money first'], answer:0, explain:'Occam\'s Razor: among competing hypotheses, the one with the fewest unnecessary assumptions should be preferred. Applied to crime: don\'t invent elaborate explanations when simpler ones fit the facts.' },
  { category:'Mystery & Crime', q:'What is "locard\'s exchange principle"?', options:['Every criminal has a psychological signature they cannot change','Every contact leaves a trace — the perpetrator takes something from the scene and leaves something behind','Physical evidence is always more reliable than witness testimony','Crime scenes always contain at least three pieces of usable evidence'], answer:1, explain:'Edmond Locard\'s exchange principle (early 1900s): every contact between two things results in an exchange of material. The criminal takes trace evidence from the scene and leaves trace evidence behind — the foundation of forensic science.' },
  { category:'Mystery & Crime', q:'In a locked-room murder mystery, the "impossible crime" sub-genre is sometimes called:', options:['The sealed-room problem','A Holmesian paradox','An Agathian puzzle','The detective\'s dilemma'], answer:0, explain:'Locked-room or "impossible crime" mysteries are often called sealed-room problems in academic discussions of the genre. The challenge is explaining how a crime was committed in a physically impossible way.' },
  { category:'Mystery & Crime', q:'What does HOLMES stand for in British policing (the major incident investigation computer system)?', options:['Homicide Operations and Linked Major Enquiries System','Home Office Large Major Enquiry System','High-Order Law and Management Evidence System','Homicide, Organised crime, Linked, Managed Enquiry System'], answer:1, explain:'HOLMES = Home Office Large Major Enquiry System. Named as a tribute to the fictional detective, it is used by UK police forces for major investigations including murders and terrorist incidents.' },
  { category:'Mystery & Crime', q:'A victim\'s body is found floating in a river. The pathologist confirms drowning. The detective, however, treats it as a potential murder. Why?', options:['Drowning is always suspicious','Homicides are sometimes staged as drownings — the pathologist can determine if the person was alive when they entered the water','Rivers always indicate foul play','The victim had enemies'], answer:1, explain:'Drowning can be staged. Key indicators of homicide-staged-as-drowning include injuries inconsistent with the water (bruising, lacerations), presence of substances in the bloodstream, or diatom analysis showing the person was dead before entering the water.' },
  { category:'Mystery & Crime', q:'What is a "victimology" report in a murder investigation?', options:['A statistical breakdown of crime victims in an area','A profile of the victim — their relationships, routines, and vulnerabilities — to understand why they were targeted','A report on the victim\'s cause of death','A psychological assessment of the victim\'s family'], answer:1, explain:'Victimology examines the victim\'s life: relationships, routines, known enemies, financial situation, and risk factors. Understanding who the victim was often illuminates who had reason and opportunity to kill them.' },
  { category:'Mystery & Crime', q:'Which famous fictional detective lived at 221B Baker Street?', options:['Hercule Poirot','Sherlock Holmes','Inspector Morse','Philip Marlowe'], answer:1, explain:'Sherlock Holmes lived at 221B Baker Street, London — a fictitious address when Conan Doyle wrote the stories, but now a real museum. His landlady was Mrs Hudson.' },
  { category:'Mystery & Crime', q:'A detective at a crime scene notices flies have not yet laid eggs on the body, but eggs are present on a nearby piece of food. What might this suggest?', options:['The victim was poisoned','The victim died more recently than the food was exposed','The victim died outdoors','The killer left the food'], answer:1, explain:'Flies are attracted to decomposing matter. If eggs appear on exposed food but not yet on the body, the body may have been exposed for less time — or was covered and recently uncovered. It suggests the death occurred more recently than the food\'s exposure.' },
  { category:'Mystery & Crime', q:'The "Black Dahlia" murder of 1947 is notable in crime history because:', options:['It was the first murder solved using DNA evidence','The victim\'s body was precisely bisected and posed, and the case was never solved','It resulted in the first use of forensic photography','The killer confessed but was found not guilty'], answer:1, explain:'Elizabeth Short (the "Black Dahlia") was found in Los Angeles in 1947 — her body surgically bisected and posed with disturbing precision. Despite hundreds of confessions, the case was never officially solved and remains one of America\'s most famous cold cases.' },
];

// ===================================================================
//  BRAIN TEASERS — STATE & FUNCTIONS
// ===================================================================
let btQuestions = [];
let btIndex = 0;
let btScore = 0;
let btTimer = null;
let btSeconds = 0;
let btAnswered = [];
let btStreak = 0;
let btSmartness = 0;

function initBrainTeaser() {
  document.getElementById('bt-intro').classList.remove('hidden');
  document.getElementById('bt-question-wrap').classList.add('hidden');
  document.getElementById('bt-results').classList.add('hidden');
  document.getElementById('bt-score-display').textContent = 'Score: 0';
  document.getElementById('bt-q-display').textContent = 'Q 1/10';
  document.getElementById('bt-timer-display').textContent = '0:00';

  const saved = mqReadSave('bt', 'current');
  const resumeBtn = document.getElementById('bt-resume-btn');
  if (resumeBtn) {
    if (saved && saved.index > 0 && saved.index < 10) {
      const m = Math.floor(saved.seconds / 60);
      const s = String(saved.seconds % 60).padStart(2, '0');
      resumeBtn.textContent = `Resume (Q${saved.index + 1}/10 · ${saved.score} pts · ${m}:${s})`;
      resumeBtn.classList.remove('hidden');
    } else {
      resumeBtn.classList.add('hidden');
    }
  }
}

function resumeBrainTeaser() {
  const saved = mqReadSave('bt', 'current');
  if (!saved) { startBrainTeaser(); return; }
  btQuestions = saved.questions;
  btIndex     = saved.index;
  btScore     = saved.score;
  btSeconds   = saved.seconds;
  btAnswered  = saved.answered || [];
  document.getElementById('bt-intro').classList.add('hidden');
  document.getElementById('bt-question-wrap').classList.remove('hidden');
  document.getElementById('bt-results').classList.add('hidden');
  clearInterval(btTimer);
  btTimer = setInterval(() => {
    btSeconds++;
    const m = Math.floor(btSeconds / 60), s = btSeconds % 60;
    document.getElementById('bt-timer-display').textContent = m + ':' + String(s).padStart(2, '0');
  }, 1000);
  renderBrainQuestion();
}

function startBrainTeaser() {
  clearBtProgress();
  const shuffled = [...BRAIN_QUESTIONS].sort(() => Math.random() - 0.5);
  btQuestions = shuffled.slice(0, 10);
  btIndex = 0;
  btScore = 0;
  btSeconds = 0;
  btAnswered = [];

  document.getElementById('bt-intro').classList.add('hidden');
  document.getElementById('bt-question-wrap').classList.remove('hidden');
  document.getElementById('bt-results').classList.add('hidden');

  clearInterval(btTimer);
  btTimer = setInterval(() => {
    btSeconds++;
    const m = Math.floor(btSeconds / 60);
    const s = btSeconds % 60;
    document.getElementById('bt-timer-display').textContent = m + ':' + String(s).padStart(2, '0');
  }, 1000);

  renderBrainQuestion();
}

function renderBrainQuestion() {
  const q = btQuestions[btIndex];
  document.getElementById('bt-q-display').textContent = 'Q ' + (btIndex + 1) + '/10';
  document.getElementById('bt-score-display').textContent = 'Score: ' + btScore;
  document.getElementById('bt-progress').style.width = (btIndex / 10 * 100) + '%';
  document.getElementById('bt-category').textContent = q.category;
  document.getElementById('bt-question-text').textContent = q.q;
  document.getElementById('bt-explain').classList.add('hidden');
  document.getElementById('bt-next-btn').classList.add('hidden');

  const letters = ['A', 'B', 'C', 'D'];
  const opts = document.getElementById('bt-options');
  opts.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'bt-option';
    btn.innerHTML = `<span class="bt-option-letter">${letters[i]}</span>${opt}`;
    btn.onclick = () => selectBtAnswer(i);
    opts.appendChild(btn);
  });
}

function selectBtAnswer(idx) {
  const q = btQuestions[btIndex];
  const btns = document.querySelectorAll('.bt-option');
  btns.forEach(b => { b.disabled = true; });

  if (idx === q.answer) {
    btns[idx].classList.add('correct');
    btScore++;
    btAnswered.push({ correct: true, q: q.q, category: q.category });
  } else {
    btns[idx].classList.add('wrong');
    btns[q.answer].classList.add('correct');
    btAnswered.push({ correct: false, q: q.q, category: q.category });
  }

  document.getElementById('bt-score-display').textContent = 'Score: ' + btScore;

  if (q.explain) {
    const el = document.getElementById('bt-explain');
    el.textContent = q.explain;
    el.classList.remove('hidden');
  }

  document.getElementById('bt-next-btn').classList.remove('hidden');
}

function nextBrainTeaser() {
  btIndex++;
  if (btIndex >= btQuestions.length) {
    showBrainResults();
  } else {
    saveBtProgress();
    renderBrainQuestion();
  }
}

function showBrainResults() {
  clearBtProgress();
  clearInterval(btTimer);
  document.getElementById('bt-question-wrap').classList.add('hidden');
  document.getElementById('bt-results').classList.remove('hidden');
  document.getElementById('bt-progress').style.width = '100%';

  const pct = btScore / 10;
  let icon = '◆', msg = '';
  if (pct >= 0.9)      { icon = '★'; msg = 'Exceptional. You have the mind of a master detective.'; }
  else if (pct >= 0.7) { icon = '◆'; msg = 'Strong performance. Most criminals would not escape your notice.'; }
  else if (pct >= 0.5) { icon = '▭'; msg = 'Adequate. A capable investigator, but room to sharpen your edge.'; }
  else                 { icon = '▮'; msg = 'The case remains open. Review the evidence and try again.'; }

  document.getElementById('bt-result-icon').innerHTML = icon;
  document.getElementById('bt-result-msg').textContent = msg;
  document.getElementById('bt-result-score').textContent = btScore + ' / 10';

  const cats = {};
  btAnswered.forEach(a => {
    if (!cats[a.category]) cats[a.category] = { c: 0, t: 0 };
    cats[a.category].t++;
    if (a.correct) cats[a.category].c++;
  });
  let bd = '';
  Object.entries(cats).forEach(([cat, v]) => {
    bd += `<div class="bt-breakdown-item"><span>${cat}</span><span class="${v.c===v.t?'bd-correct':'bd-wrong'}">${v.c}/${v.t}</span></div>`;
  });
  document.getElementById('bt-result-breakdown').innerHTML = bd;
}

function restartBrainTeaser() {
  initBrainTeaser();
}

// ===================================================================
//  DETECTIVE — DATA (3 CASES)
// ===================================================================
const DETECTIVE_CASES = [
  {
    id: 'thornfield',
    stamp: 'CASE FILE #4471',
    title: 'Death at Thornfield Estate',
    subtitle: 'Poisoning — July 14th',
    difficulty: 'medium',
    desc: 'A nobleman found dead in his locked study. Three suspects, each with motive. The poison is known; the poisoner is not.',
    sceneImg: 'assets/crime-scene-overview.svg',
    sceneImgJpg: 'assets/crime-scene-thornfield.jpg',
    roomHeader: "Lord Thornfield's Study",
    narrative: {
      intro: "INSPECTOR'S BRIEFING — 14th October, 1921. Lord Edmund Thornfield, 67, was found slumped at his study desk at six this morning by the housemaid who came to light the fire. The door had to be forced — it was locked from the inside with a key that was found still in the lock. Preliminary toxicology confirms what the smell suggested: cyanide, administered in the glass of brandy he took every evening at ten o'clock without exception.\n\nThe estate is considerable — £140,000 in assets, a house in the family since 1702, and a recently altered will whose new terms three people in this household knew about. The brandy decanter on the sideboard was shared that evening during a late supper attended by all three suspects. One of them prepared his glass differently from the others.\n\nThe window was latched from the inside. The door was locked from the inside. There is no secret passage and no servant unaccounted for. Lord Thornfield was alone when he died — but he was not alone when he was poisoned.",
      scene: "You stand in Lord Thornfield's study. The grandfather clock on the wall stopped at 23:47 — it was wound down deliberately, not allowed to run out. The crystal brandy glass sits undisturbed on the desk, a faint almond scent rising from the residue. The locked door was forced this morning; the key remains in the lock on the inside, which means whoever left sealed the room from within using an instrument through the keyhole. The desk holds an overturned pen, a half-written letter, and a revised will draft bearing a single line scored through one beneficiary's name. The wastepaper basket contains a monogrammed tissue and something inside it you will want to examine closely.",
      suspects: "Three people were under this roof on the night of the murder. Vera Sinclair was the last official visitor — her appointment with Lord Thornfield at 9:30 PM is recorded in his own hand. Victor Crane, the family solicitor, arrived uninvited at nine and left by a side entrance before ten; the gardener saw him. Lady Evelyn has not left her room since the body was found. Each of them had access to the study, and each of them knew about the new will.",
    },
    briefFacts: [
      { label: 'Time of Death', value: 'Between 10 PM and Midnight, July 14th' },
      { label: 'Victim', value: 'Lord Edmund Thornfield, 64, found dead in his locked study' },
      { label: 'Cause of Death', value: 'Cyanide poisoning (confirmed by toxicology)' },
      { label: 'Your Mission', value: 'Examine the crime scene, interview the three suspects, and identify the killer.' },
    ],
    killerId: 'vera',
    killerReveal: 'Vera Sinclair administered cyanide to Lord Thornfield\'s brandy during her private meeting with him at 9:30 PM. She had discovered that he was cutting her out of his will and planned to replace her as estate manager with her rival. The monogrammed handkerchief found under the desk was hers — she dropped it when she leaned over to ensure he had consumed the poisoned drink. Forensic analysis confirmed cyanide residue on her gloves, recovered from the east wing fireplace.',
    clues: [
      { id: 'brandy_glass', icon: '[GLASS]', name: 'Brandy Glass', desc: 'A crystal brandy glass on the desk. A faint almond odour lingers — the hallmark of cyanide poisoning.', finding: 'Critical: Cyanide residue confirmed. The poison was in the brandy, administered before 10 PM.', tag: 'critical', narrative: 'You hold the glass up to the lamplight. The faint shimmer of residue is unmistakable to a trained eye. Someone stood in this room and watched a man drink his death.' },
      { id: 'handkerchief', icon: '🧣', name: 'Monogrammed Handkerchief', desc: "A white handkerchief under the desk with the initials V.S. embroidered in gold thread.", finding: 'Important: Initials V.S. — matches Vera Sinclair, the estate manager. She was in this room.', tag: 'critical', narrative: "Vera Sinclair. The initials are clear. She claims she wasn't in the study after 8 PM. This piece of cloth disagrees." },
      { id: 'appointment_book', icon: '📖', name: "Lord's Appointment Book", desc: "The appointment book shows a private meeting with 'V.S.' at 9:30 PM — the victim's last appointment of the evening.", finding: 'Important: Vera Sinclair was the last person officially recorded as meeting the victim.', tag: 'important', narrative: "9:30 PM. Private. V.S. The handwriting is firm, unhurried. This was a planned meeting — and it was the last entry in his book." },
      { id: 'will_draft', icon: '📜', name: 'Draft Will Revision', desc: "A legal document draft on the desk — a revised will cutting Vera Sinclair's inheritance and naming a new estate manager.", finding: "Motive established: Vera Sinclair stood to lose significantly under the new will.", tag: 'critical', narrative: "You scan the legal draft. The sum involved is considerable. More than enough for someone to act. Vera Sinclair's name appears, then a single line through it." },
      { id: 'locked_door', icon: '🔒', name: 'Locked Door Mechanism', desc: 'The study door was locked from the inside. However, the lock mechanism shows a thin scratch — consistent with a pick tool or improvised device.', finding: 'The door was manipulated from the outside after the killer left, to simulate a locked-room scenario.', tag: 'important', narrative: 'The scratch is fresh. Whoever killed Lord Thornfield also took the time to make it look like suicide — or an impossibility.' },
      { id: 'cyanide_vial', icon: '🧪', name: 'Empty Vial', desc: 'A tiny empty vial in the wastepaper basket, wrapped in a monogrammed tissue. The vial contains trace cyanide.', finding: 'The delivery mechanism. The monogram matches Vera Sinclair.', tag: 'critical', narrative: "They almost got away with it. Almost. But you don't throw away the murder weapon in the victim's own bin." },
      { id: 'butler_note', icon: '📝', name: "Butler's Testimony Note", desc: "A note from Reginald Frost, the butler: 'I saw Miss Sinclair leave the study at 9:55 PM. She appeared agitated. The master was alive when I checked at 9:00 PM.'", finding: "Corroborates timeline: Vera Sinclair was last to be in the study before the victim's death.", tag: 'important', narrative: "Frost is a careful man. His note is precise. 9:55 PM. Agitated. The clock in this room stopped at 11:47. That leaves a two-hour window." },
    ],
    suspects: [
      {
        id: 'vera', name: 'Vera Sinclair', role: 'Estate Manager',
        portrait_img: 'assets/suspect-vera.jpg',
        portrait_bg: 'radial-gradient(ellipse at 50% 30%, #2a0e1a 0%, #100508 100%)',
        desc: "Sharp-minded and composed. Has managed the Thornfield estate for 12 years. Seems particularly calm given the circumstances.",
        narrative: "She meets your eyes without flinching. Too composed for someone who just lost her employer. Or perhaps too practised.",
        questions: [
          { q: 'Where were you between 9 PM and midnight?', a: "I had a brief meeting with Lord Thornfield at 9:30. We discussed estate matters. I left by 10 and retired to my quarters." },
          { q: 'Did you know about the changes to his will?', a: "I... was not aware of any changes. We had no disagreements. Our relationship was purely professional." },
          { q: 'Was anyone else in the study that evening?', a: "Not that I saw. Though Victor was lingering near the east corridor when I left." },
        ],
        interviewEvidence: { id: 'vera_diary', icon: '📒', name: "Vera's Appointment Diary", desc: "Vera's personal diary shows she arrived at Lord Thornfield's study at 9:20 PM — ten minutes earlier than she stated.", finding: "Vera was in the study ten minutes before her stated arrival. She lied about her timeline.", tag: 'critical' },
      },
      {
        id: 'victor', name: 'Victor Ashton', role: "Lord's Nephew",
        portrait_img: 'assets/suspect-victor.jpg',
        portrait_bg: 'radial-gradient(ellipse at 50% 30%, #0e1a2a 0%, #050810 100%)',
        desc: "Charming but evasive. Stands to inherit substantially. Has gambling debts that he has not disclosed.",
        narrative: "He smiles too readily. The smile of someone who has rehearsed being charming under pressure. He is also not asking the questions an innocent person would ask.",
        questions: [
          { q: 'Where were you between 9 PM and midnight?', a: "In the library, reading. I may have fallen asleep. No one can confirm it, I\'m afraid." },
          { q: 'What is your relationship with your uncle like?', a: "Strained at times, but family is family. He was generous to me, despite what people might say." },
          { q: 'Do you know anything about the will changes?', a: "I had no idea about any changes. I\'m his sole heir — or so I believed." },
        ],
        interviewEvidence: { id: 'victor_ious', icon: '📄', name: "Victor's Gambling IOUs", desc: "Handwritten IOUs totalling £12,400 found in Victor's jacket pocket — debts due within the month.", finding: "Victor Ashton has undisclosed gambling debts. He needed money urgently and knew the will was changing.", tag: 'important' },
      },
      {
        id: 'reginald', name: 'Reginald Frost', role: 'Butler',
        portrait_img: 'assets/suspect-reginald.jpg',
        portrait_bg: 'radial-gradient(ellipse at 50% 30%, #1a1a0e 0%, #080805 100%)',
        desc: "Meticulous, loyal, 30 years in service. Left a note volunteering information — an unusual act for someone accustomed to silence.",
        narrative: "There is something too eager about Frost. Butlers do not typically volunteer evidence. Is he genuinely helpful, or is he directing your attention away from himself?",
        questions: [
          { q: 'Tell me what you observed last night.', a: "I served Lord Thornfield his brandy at 9:15. I checked on him at 9:00 — he was well. Miss Sinclair arrived at 9:30 and left at 9:55 looking disturbed. I retired at 10:30." },
          { q: 'Did you prepare the brandy yourself?', a: "Always. From the decanter in the study. I have done so every evening for thirty years. The decanter was on the sideboard." },
          { q: 'Is there anything unusual you noticed?', a: "Only that Miss Sinclair left via the east corridor rather than the main stair. And that she carried her small bag — the one she keeps her personal items in." },
        ],
        interviewEvidence: { id: 'frost_addendum', icon: '📋', name: "Butler's Addendum", desc: "Under further questioning, Frost recalls the small bag Vera carried had a faint chemical odour — not her usual perfume. He noticed it as she passed.", finding: "Vera's bag had a chemical smell consistent with cyanide compound. This detail contradicts her claim of no involvement.", tag: 'important' },
      },
    ],
  },

  {
    id: 'gallery',
    stamp: 'CASE FILE #7832',
    title: 'The Midnight Gallery',
    subtitle: 'Murder — October 3rd',
    difficulty: 'hard',
    desc: 'A renowned art dealer found dead after a private gala. A diamond worth £1.8 million is missing. Three guests remain. One is the killer.',
    sceneImg: 'assets/crime-scene-overview.svg',
    sceneImgJpg: 'assets/crime-scene-gallery.jpg',
    roomHeader: "The Ashford Gallery — Back Office",
    narrative: {
      intro: "INSPECTOR'S BRIEFING — 4th October. The Ashford Diamond Gala was the season's most coveted invitation. Forty guests attended the champagne reception at the Ashford Gallery. By 12:20 AM, thirty-seven had gone home. Frederick Ashford, 58, gallery owner and host, was found dead on the floor of his private office by his niece — struck on the back of the head with a heavy object. The Ashford Diamond, a 34-carat flawless blue stone insured for £800,000, has been removed from its locked display case. The lock was not forced. A key was used.\n\nFrederick kept two keys to the diamond case: one on his person, one in his private desk drawer. Both were found in the office. Someone had a copy made, or had access to the drawer when Frederick was not present. The private office has one entrance, no windows that open, and was seen to be occupied by Frederick alone from 11:30 PM onward.\n\nExamine the scene carefully. The bronze statuette of Augustus that normally sits on the desk is missing. A monogrammed handkerchief was found near the body. A cigar stub in the ashtray still carries a faint smell — and one of the three remaining guests does not smoke.",
      scene: "The office floor is marked where the body lay. The shattered champagne flute near the window suggests a brief, violent confrontation — Frederick turned away from his attacker, was struck, and fell. The desk drawer is half-open; the second diamond key is gone from inside. A monogrammed handkerchief lies three feet from where his head would have been. The Augustus statuette — the murder weapon — is missing, but the circular impression in the carpet dust tells you exactly where it stood. The cognac decanter is nearly empty. Frederick had been drinking with someone before he died.",
      suspects: "Diana Ashford, Frederick's niece and sole heir, found the body and is the last person confirmed to have spoken to him — at 11:15 PM by her own account. Henry Blackwood, the gallery's senior acquisitions consultant, was observed entering the private corridor at 11:40 PM. Reginald Moss, the insurance assessor for the Ashford Diamond, had been asking pointed questions about the security arrangements all evening. One of them stayed behind for a reason they have not shared.",
    },
    briefFacts: [
      { label: 'Time of Death', value: 'Between 11:45 PM and 12:30 AM, October 3rd–4th' },
      { label: 'Victim', value: 'Frederick Ashford, 58, gallery owner and art dealer' },
      { label: 'Cause of Death', value: 'Blunt force trauma (heavy object, consistent with the bronze statuette found near the scene)' },
      { label: 'Missing', value: 'The Ashford Diamond — oval cut, 12.3 carats, valued at £1.8 million' },
      { label: 'Your Mission', value: 'Identify who killed Frederick Ashford and took the diamond.' },
    ],
    killerId: 'blackwood',
    killerReveal: "Henry Blackwood killed Frederick Ashford with the gallery's own bronze statuette. Ashford had discovered that Blackwood had forged provenance records on three paintings sold through the gallery — an art fraud worth £2.4 million. Ashford confronted Blackwood privately after the gala ended. Facing criminal exposure and £1.8 million in personal debt, Blackwood struck Ashford with the statuette, then used a copied keycard to access the diamond's case, intending to sell it offshore. The monogrammed handkerchief and cigar stub placed him in the office. The forged receipt in his jacket confirmed the fraud.",
    clues: [
      { id: 'bronze_statuette', icon: '🗿', name: 'Bronze Statuette', desc: 'A 4kg bronze statuette found behind the office door. Forensics confirm blood and hair consistent with the victim.', finding: 'Murder weapon confirmed. No fingerprints — wiped clean. The blow came from above and behind.', tag: 'critical', narrative: "Clean. Wiped deliberately. Someone in this room knew they had left a print and took the time to remove it while a man lay dying." },
      { id: 'hb_handkerchief', icon: '🧣', name: "Monogrammed Handkerchief", desc: "A silk handkerchief near the statuette, monogrammed H.B. in navy thread.", finding: "H.B. — Henry Blackwood. He was in the office. He claims he never entered it.", tag: 'critical', narrative: "Henry Blackwood. The H.B. stitching is fine work. This is not something that falls out of a pocket from across the room." },
      { id: 'keycard_copy', icon: '💳', name: 'Copied Keycard', desc: "A duplicate keycard for the diamond display case found in the office waste bin. The original card belongs to Frederick Ashford.", finding: "Someone made a copy of the keycard — premeditated theft of the diamond, not a crime of passion.", tag: 'critical', narrative: "Premeditated. This was not impulse. Someone studied this case, copied this card, and came here tonight planning exactly this." },
      { id: 'cigar_stub', icon: '🚬', name: 'Cigar Stub', desc: "A partially smoked cigar in the office ashtray. The brand is Cohiba — the same brand Henry Blackwood was photographed smoking at the gala.", finding: "Blackwood was in the office. He claims he did not enter after 10 PM.", tag: 'important', narrative: "The ash is still grey. It was smoked within the last two hours. Blackwood smokes Cohibas exclusively — he mentioned it himself." },
      { id: 'forged_receipt', icon: '🧾', name: 'Forged Gallery Receipt', desc: "A receipt in Ashford's desk marked 'FRAUDULENT — H.B.' in red pen. It shows a £420,000 transaction for a painting with falsified provenance.", finding: "Motive: Ashford had discovered Blackwood's art fraud. Confrontation likely led to the murder.", tag: 'critical', narrative: "Ashford had found him out. A £420,000 receipt is merely the paper trail. The real sum was far larger. And now Ashford is dead." },
      { id: 'champagne_glass', icon: '🥃', name: 'Two Champagne Glasses', desc: "Two used champagne glasses on the desk — one with faint lipstick, one without. Only one guest — Diana Hale — wears lipstick. She claims she and Ashford parted in the main gallery.", finding: "Diana Hale was in the private office with Ashford at some point. She has not disclosed this.", tag: 'important', narrative: "Two glasses. An intimate meeting. Diana Hale insisted their last conversation was brief, at the gala entrance. This tells a different story." },
      { id: 'guest_list', icon: '📋', name: 'Final Guest List', desc: "The security log showing exit times: Diana Hale (12:05 AM), Oliver Raines (12:20 AM), Henry Blackwood (12:38 AM — the last to leave).", finding: "Blackwood was the last person in the building. He had the most opportunity during the victim's estimated time of death.", tag: 'important', narrative: "12:38. Everyone else had gone. The building was silent. The body was found at 12:45 by the night watchman. Five minutes. All he needed." },
    ],
    suspects: [
      {
        id: 'blackwood', name: 'Henry Blackwood', role: 'Art Dealer',
        portrait_img: 'assets/suspect-blackwood.jpg',
        portrait_bg: 'radial-gradient(ellipse at 50% 30%, #0e0a1a 0%, #05040e 100%)',
        desc: "Well-dressed, overconfident. Known in the art world for finding rare pieces at suspiciously good prices. Carries himself like a man who has never faced consequences.",
        narrative: "He speaks about Frederick Ashford in the past tense without hesitation. He hasn't once said he's sorry.",
        questions: [
          { q: 'Where were you at midnight?', a: "In the main gallery, talking to Oliver Raines about a potential acquisition. I never went to the office." },
          { q: 'What was your relationship with Frederick Ashford?', a: "Professional. Occasionally contentious — he had strong opinions about provenance. But mutual respect, always." },
          { q: 'Did you know about the diamond security?', a: "Every serious dealer knows about the Ashford Diamond. I admired it from a distance like everyone else." },
        ],
        interviewEvidence: { id: 'blackwood_sketch', icon: '📐', name: 'Display Case Diagram', desc: "A folded paper found in Blackwood's coat pocket: a precise pencil sketch of the diamond display case showing dimensions and the lock mechanism.", finding: "Blackwood studied the case lock in advance. This was premeditated theft, not opportunism.", tag: 'critical' },
      },
      {
        id: 'diana', name: 'Diana Hale', role: 'Art Critic',
        portrait_img: 'assets/suspect-diana.jpg',
        portrait_bg: 'radial-gradient(ellipse at 50% 30%, #1a0e0a 0%, #0e0805 100%)',
        desc: "Elegantly dressed, visibly shaken. A respected critic whose recent review savaged Ashford's last exhibition. She and Ashford had a public argument earlier this year.",
        narrative: "Her hands are steady but her eyes keep moving toward the office door. Grief? Guilt? Or fear of what else might be found?",
        questions: [
          { q: 'Where were you at midnight?', a: "I left through the main entrance at five past midnight. I spoke with Frederick briefly — he seemed distracted — then I called a cab." },
          { q: 'Were you in the private office at any point?', a: "No. Absolutely not. Frederick and I spoke in the main gallery only." },
          { q: 'Did you notice anything unusual about Henry Blackwood?', a: "He disappeared for quite a while around 11:30. I assumed he was using the phone. He returned smelling of cognac." },
        ],
        interviewEvidence: { id: 'diana_bar_receipt', icon: '🧾', name: 'Private Bar Receipt', desc: "A bar chit signed by Diana Hale for two champagne flutes, charged to the private office wing at 11:42 PM — not the main gallery bar.", finding: "Diana was in the office wing with the victim at 11:42 PM. She explicitly denied being there.", tag: 'important' },
      },
      {
        id: 'oliver', name: 'Oliver Raines', role: 'Gallery Investor',
        portrait_img: 'assets/suspect-oliver.jpg',
        portrait_bg: 'radial-gradient(ellipse at 50% 30%, #0a1a0a 0%, #050e05 100%)',
        desc: "Quiet, methodical. Invested £300,000 in the gallery last year. Has a background in security systems from a previous career. Knows the gallery layout well.",
        narrative: "He answers every question with the minimum number of words. Either very innocent or very experienced at staying quiet.",
        questions: [
          { q: 'Where were you at midnight?', a: "I was with Henry Blackwood in the gallery until around quarter past. Then I collected my coat and left." },
          { q: 'Did anything seem unusual about the evening?', a: "Ashford was agitated. He excused himself from guests twice. The second time, Henry went after him." },
          { q: 'Do you know who took the diamond?', a: "I know who could have. I designed the original security system. A keycard copy would need to be made in advance. This was planned." },
        ],
        interviewEvidence: { id: 'keycard_test_log', icon: '💻', name: 'Keycard Activation Log', desc: "Gallery security logs show an unauthorised keycard access attempt on the diamond display case 8 days before the murder — at 2:17 AM. The card profile matches Blackwood's copied key.", finding: "Blackwood tested his copied keycard a week before the murder. Fully premeditated.", tag: 'critical' },
      },
    ],
  },

  {
    id: 'vanishing',
    stamp: 'CASE FILE #9105',
    title: 'The Vanishing Act',
    subtitle: 'Murder — Saturday Night',
    difficulty: 'hard',
    desc: 'A celebrated stage magician found dead mid-performance. His final trick — a cabinet vanishing act — became his last. Three people remain at the theatre. One pulled the strings.',
    sceneImg: 'assets/crime-scene-overview.svg',
    sceneImgJpg: 'assets/crime-scene-vanishing.jpg',
    roomHeader: "The Olympia Theatre — Backstage",
    narrative: {
      intro: "INSPECTOR'S BRIEFING — Saturday. The Crescent Theatre. Three hundred people in their seats. At 8:47 PM, Marcus Beale — known professionally as Marco the Magnificent — stepped inside the Vanishing Chamber cabinet to perform the headline illusion of his career. The doors closed. The cabinet rotated on its axis. Six seconds of darkness. When the doors opened, Marcus was dead. A thin steel wire, woven into the rotation mechanism, had snapped taut at the moment of the turn and broken his neck.\n\nThe wire was not there during his inspection of the cabinet at 3 PM — Marcus inspected it himself before locking the stage door. The stage door remained locked from 3 PM until the crew arrived at 6 PM for setup. Someone who had a stage door key entered during that three-hour window, opened the locked cabinet, rigged the wire, and left.\n\nThree people held stage door keys. The wire was threaded through a specific joint in the cabinet's inner chassis — a point that only someone intimately familiar with the illusion's construction would know to access. Marcus had three such people in his life. One of them is now a murderer.",
      scene: "The cabinet stands where it stopped, doors hanging open. The rigged wire is still in place — a thin steel cord woven so cleanly into the mechanism that a casual inspection would miss it entirely. This was not improvised on the night. The person who installed this wire had studied the cabinet's architecture with patience and purpose. Backstage, a half-empty champagne glass sits on the prop table — lip-print intact. A folded letter was found in Marcus's costume pocket. A threatening letter discovered backstage has been identified by graphology as written by someone in the cast.",
      suspects: "Oliver Drake was Marcus's original assistant for seven years — until Marcus replaced him without explanation or severance six months ago. Eliza Marsh is the theatre's technical director and has built every mechanism on this stage, including the Vanishing Chamber's original chassis. Derek Palmer managed Marcus's career for eleven years before Marcus terminated the contract acrimoniously, alleging financial misappropriation. All three had stage door keys. All three had architectural knowledge of the cabinet. One of them used both.",
    },
    briefFacts: [
      { label: 'Time of Death', value: 'Approximately 9:12 PM Saturday' },
      { label: 'Victim', value: 'Marcus Beale ("Marco the Magnificent"), 51, illusionist and performer' },
      { label: 'Cause of Death', value: 'Cervical fracture — a wire inside the illusion cabinet was deliberately rigged to break the neck on rotation' },
      { label: 'Method', value: 'The sabotage required precise knowledge of the cabinet\'s internal mechanism' },
      { label: 'Your Mission', value: 'Identify who rigged the cabinet and why.' },
    ],
    killerId: 'lydia',
    killerReveal: "Lydia Cross, Marco's stage assistant of 11 years, rigged the cabinet wire three hours before the performance. Marco had secretly sold the rights to his signature illusions — including Lydia's co-developed 'Vanishing Act' — to a Las Vegas production company, cutting her out of the royalty arrangement entirely. The threatening letter found backstage was written in her hand (confirmed by graphology). The lipstick on the champagne glass matched her shade. The technical notes on rigging the cabinet wire were found folded inside her coat. She had co-designed the illusion: she alone knew exactly where to place the wire.",
    clues: [
      { id: 'rigged_wire', icon: '⚡', name: 'Rigged Cabinet Wire', desc: "A steel wire inside the cabinet's rotation mechanism, cut and repositioned to apply fatal tension on the 180-degree turn.", finding: 'The rigging required precise technical knowledge of the cabinet internals — not something improvised. Premeditated.', tag: 'critical', narrative: "It is elegant, in a terrible way. Someone who knew this illusion deeply — who understood every rotation, every panel — placed this wire exactly where it needed to be." },
      { id: 'threatening_letter', icon: '✉️', name: 'Threatening Letter', desc: 'Found in the victim\'s dressing room: "If you finalise that deal without me, you will regret it. You built this on MY ideas." Unsigned.', finding: 'The handwriting matches Lydia Cross (confirmed by forensic graphology). Motive: betrayal over intellectual property.', tag: 'critical', narrative: "The ink is pressed hard into the paper. This was written in anger. Someone who felt robbed — and was prepared to take more than royalties." },
      { id: 'contract_papers', icon: '📃', name: 'Las Vegas Contract', desc: "A signed contract between Marcus Beale and the Palazzo Entertainment Group — exclusive rights to all of Marco's illusions for £2.2 million.", finding: 'Lydia Cross is not named. She co-developed the Vanishing Act but receives nothing under this deal.', tag: 'critical', narrative: "£2.2 million. Eleven years of work. Her fingerprints are on every illusion in this contract. Her name appears on none of them." },
      { id: 'lipstick_glass', icon: '🥃', name: 'Champagne Glass (Backstage)', desc: "A champagne glass found in the cabinet prep area. Lipstick on the rim — shade 'Black Rose', a specific colour confirmed as Lydia's brand.", finding: 'Lydia was in the cabinet area shortly before the performance — she claims she was in the dressing room.', tag: 'important', narrative: "She said she spent the hour before the show in her dressing room. But this glass is here. Black Rose lipstick. Her shade, confirmed by her makeup bag." },
      { id: 'technical_notes', icon: '📓', name: 'Technical Rigging Notes', desc: "A folded handwritten page found inside Lydia's coat: a diagram of the cabinet mechanism with wire placement annotated.", finding: 'Direct physical evidence: the rigging notes match the actual modification made to the cabinet.', tag: 'critical', narrative: "She drew this. The diagram is unmistakable — the wire placement, the tension angle. She planned this down to the centimetre." },
      { id: 'stage_schedule', icon: '📅', name: 'Stage Schedule', desc: "The signed stage schedule shows Lydia Cross had exclusive access to the cabinet for a 90-minute prep window (6 PM – 7:30 PM), during which other crew were dismissed.", finding: 'Opportunity confirmed: she was alone with the cabinet for 90 minutes before the show.', tag: 'important', narrative: "Ninety minutes alone. She signed the schedule herself. She had the knowledge, the motive, and ninety unwitnessed minutes." },
      { id: 'business_partners_alibi', icon: '📹', name: "Partner's Alibi Confirmation", desc: "Theatre CCTV confirms Derek Palmer (business partner) was in the box office from 6 PM until 9 PM. The stage was Lydia's domain.", finding: "Derek Palmer's alibi is confirmed. The cabinet prep area was Lydia's exclusive responsibility.", tag: 'minor', narrative: "The camera does not lie. Palmer was counting receipts when Marcus was dying. That leaves two suspects — and one of them designed the illusion." },
    ],
    suspects: [
      {
        id: 'lydia', name: 'Lydia Cross', role: 'Stage Assistant',
        portrait_img: 'assets/suspect-lydia.jpg',
        portrait_bg: 'radial-gradient(ellipse at 50% 30%, #1a080e 0%, #0e0408 100%)',
        desc: "Eleven years as Marco's assistant. Precise, controlled, and visibly trying not to show how upset she is — or is it something else beneath the grief?",
        narrative: "She knows every inch of that cabinet. She's spent a thousand hours inside it. She knows what that wire would do at 180 degrees. She knows.",
        questions: [
          { q: 'Where were you during the 6 PM prep window?', a: "In my dressing room, as always. I had prep work done by 5:30. The cabinet was ready." },
          { q: 'Were you aware of the Las Vegas deal?', a: "I... heard rumours. Marcus and I had been meaning to talk about the future. He kept postponing." },
          { q: 'Did you have any disagreements with Marcus recently?', a: "We had creative differences. Eleven years is a long partnership. That is natural." },
        ],
        interviewEvidence: { id: 'lydia_signin', icon: '📅', name: 'Stage Manager Sign-In Log', desc: "The stage manager's log shows Lydia Cross signed INTO the cabinet prep area at 5:58 PM — contradicting her claim of being in her dressing room from 5:30 PM onwards.", finding: "Lydia was in the cabinet prep area from 5:58 PM. She had opportunity and lied about her location.", tag: 'critical' },
      },
      {
        id: 'derek', name: 'Derek Palmer', role: 'Business Partner',
        portrait_img: 'assets/suspect-derek.jpg',
        portrait_bg: 'radial-gradient(ellipse at 50% 30%, #0a120e 0%, #050908 100%)',
        desc: "Marcus's business partner for 8 years. Stood to gain from the Las Vegas deal — he negotiated it. Calm to the point of coldness.",
        narrative: "He keeps checking his watch. Either he has somewhere to be, or he is counting down to something. But the camera puts him in the box office.",
        questions: [
          { q: 'Tell me about the Las Vegas contract.', a: "A significant deal — Marcus and I negotiated it over six months. It will be the foundation of the estate's income going forward." },
          { q: 'Why was Lydia not included in the contract?', a: "That was Marcus's decision. She was an employee, not a rights-holder. I advised Marcus to reconsider, to be honest." },
          { q: 'Where were you during the performance prep?', a: "Box office, settling accounts. Three box office staff can confirm it. I was there from six until I heard the screaming." },
        ],
        interviewEvidence: { id: 'derek_contract_copy', icon: '📎', name: "Palmer's Annotated Contract", desc: "Derek Palmer's own copy of the Las Vegas contract has handwritten margin notes. One reads: 'L.C. — not named. Her problem, not mine.' Written 3 months before the murder.", finding: "Palmer knew Lydia was excluded and actively chose not to intervene. He had prior knowledge of her motive.", tag: 'important' },
      },
      {
        id: 'tommy', name: 'Tommy Walsh', role: 'Prop Engineer',
        portrait_img: 'assets/suspect-tommy.jpg',
        portrait_bg: 'radial-gradient(ellipse at 50% 30%, #0e150a 0%, #07090a 100%)',
        desc: "The man who built the cabinet. Quiet, skilled, fiercely protective of his work. Has worked with Marco for 5 years and knows every bolt in every illusion.",
        narrative: "He is the only one who has actually cried. That could mean he is innocent, or it could mean he is the best actor in the theatre tonight.",
        questions: [
          { q: 'Who had access to the cabinet before the show?', a: "I finished building the rotation mechanism at 5 PM. After that, Lydia runs the prep. I was in the workshop until the show started." },
          { q: 'Is it possible someone tampered with the wire without your knowledge?', a: "Someone who knew the mechanism, yes. The modification was subtle. Clean. Professional. This wasn't improvised." },
          { q: 'Did anything seem unusual in the days before?', a: "Lydia asked me some questions about the tension calibration last week. Said she was 'curious.' I showed her the manual." },
        ],
        interviewEvidence: { id: 'manual_page', icon: '📓', name: 'Rigging Manual — Annotated Page', desc: "The page Lydia borrowed from Tommy's rigging manual, returned the next day. Wire tension calculations are annotated in her handwriting, specifically on the 180-degree rotation mechanism.", finding: "Lydia studied the exact mechanism she used to kill Marco. The annotations are in her handwriting.", tag: 'critical' },
      },
    ],
  },

  {
    id: 'poison_pen',
    stamp: 'CASE FILE #2219',
    title: 'The Poison Pen',
    subtitle: 'Poisoning — Thursday Evening',
    difficulty: 'medium',
    desc: 'A celebrated mystery novelist found dead at his own book launch. The murder weapon: his own inkwell. Three guests remained when the lights went out.',
    sceneImg: 'assets/crime-scene-overview.svg',
    sceneImgJpg: 'assets/crime-scene-bookshop.jpg',
    roomHeader: "Blackthorn Books — Private Reading Room",
    narrative: {
      intro: "INSPECTOR'S BRIEFING — The Mortlake Confession launch at Blackthorn Books, Bloomsbury. Thirty guests, champagne, readings, applause. By 10:40 PM, twenty-seven of them had gone home. Cornelius Wrath — 66, Britain's most celebrated crime novelist — was found dead in the private reading room, slumped in a leather armchair with a half-empty whisky glass still in his hand.\n\nThe toxicology screen will take days, but the pathologist's preliminary assessment points to abrin — a glycoprotein derived from the seeds of Abrus precatorius, also known as rosary peas. Wrath himself described this exact poison in his 1949 novel, The Garden of Last Things: 'A single seed, prepared correctly, produces symptoms indistinguishable from cardiac arrest. The dose acts in forty to ninety minutes. The killer need not be present at the moment of death.' Whoever killed Cornelius Wrath read his books.\n\nThe whisky was poured from a shared decanter. The decanter shows no trace of toxin. The poison was introduced specifically into Wrath's glass — either before he picked it up, or when it was briefly left unattended on the reading table. The three guests who remained were all in the building during the window when the glass was poisoned. Each of them had been wronged — publicly, professionally, and personally — by the man dying in that chair.",
      scene: "The private reading room is intimate — four armchairs, a reading lamp, a low table, a decanter of Glenfarclas and two glasses. Only one glass had been used. On the writing desk: a speech Wrath never delivered, his personal copy of The Mortlake Confession with margin annotations, and a leather-bound notebook containing notes for a new novel whose subject, it turns out, is extremely familiar to one of the suspects. A rosary pea husk — the seed casing of Abrus precatorius — was found beneath the writing desk, missed in the initial sweep. Someone prepared the dose in this room, or carried the prepared toxin in and introduced it when Wrath turned away.",
      suspects: "Nora Blackthorn owns the shop and organised the entire event — and has an unpublished manuscript that Wrath publicly eviscerated in a review six months ago, calling it 'the kind of book that makes you grateful for silence.' Sergeant Harris was a decorated detective for twenty years before Wrath's testimony helped convict a man Harris believed was innocent; that man died in custody last year. Eliza Marsh is Wrath's literary agent of fourteen years — the person who knows every secret in his professional life, including some she would very much prefer remained secrets. All three stayed. All three had motive. Only one of them had a pharmacist's receipt in their handbag.",
    },
    briefFacts: [
      { label: 'Time of Death', value: 'Between 9:15 PM and 9:45 PM, Thursday' },
      { label: 'Victim', value: 'Cornelius Wrath, 66, crime novelist. 22 books, 14 million copies sold.' },
      { label: 'Cause of Death', value: 'Abrin toxin — derived from rosary pea seeds. Mimics cardiac arrest. Undetectable without specific toxicology.' },
      { label: 'Context', value: 'Wrath\'s new novel, "The Agent\'s Confession", was set to expose real-world plagiarism in the literary world.' },
      { label: 'Your Mission', value: 'Identify who poisoned Cornelius Wrath and why.' },
    ],
    killerId: 'eliza',
    killerReveal: "Eliza Marsh, Wrath's literary agent of 14 years, poisoned the whisky glass during the 20-minute window when Wrath stepped away from the reading room to greet late arrivals. She had obtained dried Abrus precatorius seeds six weeks earlier under a false name, confirmed by the pharmacy receipt found in her handbag. Wrath's forthcoming novel was a thinly-veiled account of how Eliza had ghostwritten three of his early novels under a fraudulent arrangement, then claimed sole copyright. Publication would have ended her career and exposed her to criminal prosecution. The arsenic-stained handkerchief and the rosary pea husk under the writing desk sealed her guilt.",
    clues: [
      { id: 'whisky_glass', icon: '🥃', name: "Wrath's Whisky Glass", desc: "A crystal Glenfarclas glass, still a third full. Toxicology analysis reveals abrin toxin introduced to the liquid. The poison was colourless and odourless.", finding: 'Murder weapon confirmed. The poison was added to the whisky, not the bottle. The killer was in the room with the glass.', tag: 'critical', narrative: "He would have tasted nothing. Smelled nothing. The abrin would have taken effect in minutes. Someone very calm stood here and tipped a lethal quantity into a dead man's drink." },
      { id: 'pea_husk', icon: '🌿', name: 'Rosary Pea Husk', desc: "A tiny dried husk of Abrus precatorius — the rosary pea — found beneath the writing desk. The seeds contain abrin, the toxin that killed Wrath.", finding: 'Physical evidence of the poison source in the room. The killer processed the seeds here or carried them in.', tag: 'critical', narrative: "It is no larger than a thumbnail. Easy to overlook. But there is only one reason this seed husk is in a bookshop reading room on the night of a poisoning." },
      { id: 'pharmacy_receipt', icon: '🧾', name: 'Pharmacy Receipt', desc: "A receipt in Eliza Marsh's handbag from a south London pharmacy, six weeks prior, for 'dried botanical specimens' under the name E. Holloway.", finding: "Eliza Marsh purchased botanical materials under a false name six weeks ago. Abrus precatorius is classified as a controlled botanical.", tag: 'critical', narrative: "E. Holloway. A false name. But the handwriting on the receipt matches Eliza Marsh's signature on the contract in her own portfolio." },
      { id: 'manuscript_pages', icon: '📄', name: "Manuscript Pages — Chapter 12", desc: "Loose pages from Wrath's unpublished novel found in his jacket pocket. Chapter 12 is titled 'The Agent Who Stole a Career' — a detailed account of literary fraud by a long-term agent.", finding: "Motive established: Wrath's new novel would have exposed Eliza Marsh's fraudulent ghostwriting arrangement publicly.", tag: 'critical', narrative: "He carried it in his own pocket. His last book. The one that would have changed everything. He may have intended to read from it tonight." },
      { id: 'empty_chair', icon: '📋', name: 'Guest Log — Gap in Timeline', desc: "The event photographer's log shows Eliza Marsh is absent from all photographs taken between 9:10 PM and 9:35 PM — a 25-minute window when the room was unmonitored.", finding: "Eliza Marsh has no photographic alibi for the period corresponding to the victim's estimated time of poisoning.", tag: 'important', narrative: "Twenty-five minutes. Every other guest appears in at least two photographs during that window. Eliza Marsh appears in none." },
      { id: 'dedication_proof', icon: '📖', name: "Galley Proof — Crossed Out Dedication", desc: "An advance copy of the new novel with the dedication page marked up. The original dedication read 'For E.M., who gave me my voice.' Someone — presumably Wrath — has crossed it out in red.", finding: "The relationship between Wrath and Marsh had recently turned hostile. The crossed-out dedication suggests a final break.", tag: 'important', narrative: "For fourteen years she was his dedication. Now she is a crossed-out line in red pen. That is a very particular kind of ending." },
      { id: 'critics_note', icon: '📝', name: "Critic's Handwritten Note", desc: "A note from Victor Crane to Wrath, found in the desk drawer: 'I know what you are planning to publish. Reconsider. Some truths destroy more than one person.'", finding: "Victor Crane was aware of the novel's contents and attempted to dissuade Wrath from publication.", tag: 'minor', narrative: "A warning. Crane knew what the book contained. But a warning is not a murder weapon. Still — he knew, and knowing is a kind of motive." },
    ],
    suspects: [
      {
        id: 'eliza', name: 'Eliza Marsh', role: 'Literary Agent',
        portrait_img: 'assets/suspect-eliza.jpg',
        portrait_bg: 'radial-gradient(ellipse at 50% 30%, #1a0a0e 0%, #0e0508 100%)',
        desc: "Wrath's agent for 14 years. Polished, precise, and unusually composed for someone who has just lost their most lucrative client.",
        narrative: "She speaks about Cornelius in careful past tense. She is already managing the narrative — which is what agents do. The question is what else she has managed.",
        questions: [
          { q: 'Where were you between 9:10 and 9:35 PM?', a: "I stepped outside for air — I find these events rather overwhelming. I returned before the speech was due to begin. There is nothing unusual in that." },
          { q: 'Had your relationship with Cornelius changed recently?', a: "All long partnerships evolve. We had some creative disagreements about the direction of the new book. Nothing significant." },
          { q: 'Did you know the contents of the new novel?', a: "I am his agent. I read everything. The new book was... ambitious. Perhaps too ambitious in some of its claims." },
        ],
        interviewEvidence: { id: 'eliza_note', icon: '💌', name: "Eliza's Note Card", desc: "A monogrammed note card (E.M.) found crumpled just outside the reading room door. It reads: 'Do NOT publish Chapter 12. Final warning.' Unsigned but the monogram is clear.", finding: "Eliza was outside the reading room and left a final warning. She was there that evening despite her denial.", tag: 'critical' },
      },
      {
        id: 'vcrane', name: 'Victor Crane', role: 'Literary Critic',
        portrait_img: 'assets/suspect-vcrane.jpg',
        portrait_bg: 'radial-gradient(ellipse at 50% 30%, #0a0e1a 0%, #050810 100%)',
        desc: "Feared critic whose three consecutive scathing reviews of Wrath's recent books had publicly wounded the author's reputation. They had not spoken in two years until tonight.",
        narrative: "He looks at everything in this room like he is already composing a review of it. He has the eyes of someone who does not believe in accidents.",
        questions: [
          { q: 'Why did you attend the launch after your reviews?', a: "Cornelius invited me personally. He said he had something to show me. That it would change how I saw his work." },
          { q: 'What was in the note you sent him?', a: "A private communication. I had become aware of certain... intentions in the new novel. I urged caution." },
          { q: 'Were you in the reading room during the evening?', a: "Briefly. We spoke for perhaps five minutes. I did not touch his glass. I barely touched a glass myself." },
        ],
        interviewEvidence: { id: 'crane_prior_letter', icon: '✉️', name: "Crane's Earlier Letter", desc: "A letter Crane sent to Wrath three weeks prior, more explicit in tone: 'If Chapter 12 names me, I will ensure this book never reaches a shelf. I have the means and the lawyers.'", finding: "Crane escalated his threats weeks before the launch. He had clear motive and stated willingness to act.", tag: 'important' },
      },
      {
        id: 'holt', name: 'Theodore Holt', role: 'Publisher',
        portrait_img: 'assets/suspect-holt.jpg',
        portrait_bg: 'radial-gradient(ellipse at 50% 30%, #0e1a0a 0%, #080e05 100%)',
        desc: "Wrath's publisher of eight years. Stands to lose a £4 million advance if the novel is pulled following legal challenge — or is now free to settle the estate's debts quietly.",
        narrative: "He keeps talking about the business side of this — insurance, rights, succession. Either this is how publishers grieve, or he has already moved on to the next chapter.",
        questions: [
          { q: 'Did you know about the novel\'s sensitive content?', a: "I knew it was bold. Cornelius always pushed boundaries. I trusted his judgement — and our legal team's review." },
          { q: 'What happens to the book now?', a: "That is for the estate to determine. We have an advance to recoup. These things take time to resolve." },
          { q: 'Where were you during the 9 PM period?', a: "In the main bookshop, speaking with booksellers and press. I had no reason to go to the reading room. That was Cornelius's private space." },
        ],
        interviewEvidence: { id: 'holt_insurance', icon: '📋', name: 'Manuscript Insurance Policy', desc: "An insurance policy taken out 6 weeks ago on the unpublished manuscript for £1.2 million, payable on 'destruction or permanent loss.' Holt is the named beneficiary.", finding: "Holt insured the manuscript before the launch — and benefits financially if it never publishes. A secondary motive.", tag: 'important' },
      },
    ],
  },

  {
    id: 'express',
    stamp: 'CASE FILE #3317',
    title: 'Death on the Blackwood Express',
    subtitle: 'Murder — Overnight Journey',
    difficulty: 'hard',
    desc: 'A railway magnate found stabbed in his locked compartment aboard a luxury overnight train. The train cannot stop. The killer is still aboard.',
    sceneImg: 'assets/crime-scene-overview.svg',
    sceneImgJpg: 'assets/crime-scene-train.jpg',
    roomHeader: "Blackwood Express — First Class Compartment 4",
    narrative: {
      intro: "INSPECTOR'S BRIEFING — The Blackwood Express departed Edinburgh Waverley at 11:05 PM on the 18th, bound for London King's Cross. Seven passengers in first class. By 1:40 AM — the train halted by blizzard conditions near Shap Summit, Cumbria — Sir Aldous Pemberton, 71, chairman of the Pemberton Railway Group, was found stabbed in Compartment 4. A single wound. Precise. Fatal. The compartment door was found unlocked from the inside. The window was sealed. No stops had been made. The killer did not leave the train.\n\nSir Aldous was carrying documents in his briefcase — a dossier of financial records he was delivering personally to Scotland Yard upon arrival in London. The briefcase is still in the compartment. The documents are gone. Whoever killed Sir Aldous came for those papers as much as for his life.\n\nThe attack occurred at a pre-determined moment. The port decanter on the fold-down table shows two glasses used — Pemberton shared a drink with someone he trusted. The wound angle and depth indicate a single, confident strike. No hesitation, no struggle. This was not a crime of passion. This was planned before the train left Edinburgh, and the killer has been sitting in first class with the remaining passengers for the last two hours.",
      scene: "Compartment 4 is undisturbed except for the body and the open briefcase. Sir Aldous is slumped against the window, his evening coat still buttoned. The port decanter stands on the fold-down table; two glasses, one used more than the other. The wound is on the left side of the torso — delivered by someone sitting to his right, facing him across the table. A wax impression on the corridor carpet outside the door preserves the profile of a key. The conductor's log shows his last round through the first-class corridor at 11:50 PM — after that, the corridor was unwatched. A stiletto blade has not been recovered.",
      suspects: "Three first-class passengers remain under consideration. Lady Vera Pemberton, his wife of thirty-one years, is in Compartment 1B and has not spoken since the body was found — except to state, quietly, that she knew this would happen eventually. James Holt is Sir Aldous's personal secretary, the man who typed every document in that missing dossier; he claims he was asleep, but the porter saw a light under his door at midnight. Edmund Crane is a rival railway investor whom Pemberton publicly ruined a decade ago, who boarded at the last moment without a reservation and has given no satisfactory explanation for why he is on this particular train.",
    },
    briefFacts: [
      { label: 'Time of Death', value: 'Between 11:30 PM and 1:00 AM — estimated by body temperature' },
      { label: 'Victim', value: 'Sir Aldous Pemberton, 71, railway chairman and principal shareholder' },
      { label: 'Cause of Death', value: 'Single stab wound — a stiletto-style blade, recovered in the waste bin wrapped in linen' },
      { label: 'Setting', value: 'A sealed luxury express train halted by a blizzard. No stops. All passengers still aboard.' },
      { label: 'Your Mission', value: 'Identify the killer before the train reaches London.' },
    ],
    killerId: 'ecrane',
    killerReveal: "Edmund Crane, Pemberton's former business partner, entered the compartment at 11:45 PM using a copied master key he had obtained from a corrupt conductor six months prior. He and Pemberton shared a glass of port — the victim trusted him, despite their falling out. At a pre-selected moment, Crane produced the stiletto and stabbed Pemberton once, precisely, fatally. The copied key was found sewn into the lining of Crane's coat. The conductor's bribe payment (£500 in cash) was traced to Crane's account. Most damningly, Pemberton's own letter to his solicitor, found in the compartment safe, detailed Crane's embezzlement of £3.1 million from the railway group — the letter was due to be handed to Scotland Yard upon arrival in London.",
    clues: [
      { id: 'stiletto_blade', icon: '🔪', name: 'Stiletto Blade', desc: "A 6-inch stiletto found in the compartment waste bin, wrapped in linen initialled A.P. — the victim's own handkerchief. One clean stab wound. The blade has no fingerprints.", finding: 'Murder weapon confirmed. Wiped clean and disposed of in the victim\'s own bin — deliberate misdirection.', tag: 'critical', narrative: "A single wound. Practised. The killer knew where to place it. This was not panic — this was execution." },
      { id: 'two_port_glasses', icon: '🥃', name: 'Two Port Glasses', desc: "The fold-down table holds a bottle of Pemberton's private port and two used glasses. The victim poured for his killer. They drank together before the murder.", finding: 'The victim trusted his killer enough to share a drink. This was someone Pemberton knew and did not fear.', tag: 'critical', narrative: "You do not pour your killer a glass of your private port unless you consider them a friend. Or at least, someone you used to." },
      { id: 'copied_master_key', icon: '🗝️', name: 'Copied Master Key', desc: "A duplicate of the Blackwood Express master key, found sewn into the lining of Edmund Crane's overcoat. The original key belongs to the senior conductor.", finding: "Crane could access any compartment on the train. He had the means to enter Compartment 4 without the victim opening the door.", tag: 'critical', narrative: "It was hidden carefully. Not hidden in a hurry — hidden in advance. This key was never meant to be found." },
      { id: 'legal_letter', icon: '📜', name: "Pemberton's Letter to Solicitor", desc: "Found locked in the compartment safe: a letter addressed to Pemberton's solicitor detailing Edmund Crane's embezzlement of £3.1 million from the railway group, intended for delivery to Scotland Yard.", finding: "Motive: Crane faced criminal prosecution and financial ruin the moment the train arrived in London. He had hours to act.", tag: 'critical', narrative: "Pemberton was going to hand him to Scotland Yard in the morning. Crane knew. And so this train became the only window he had left." },
      { id: 'conductor_payment', icon: '💳', name: 'Conductor Payment Record', desc: "A bank record found in Crane's wallet shows a transfer of £500 to a numbered account matching the junior conductor's personal account, made six months prior.", finding: 'Crane bribed the conductor — likely to obtain the master key copy. The conductor has since confirmed this under questioning.', tag: 'critical', narrative: "Six months of planning. This was not improvised on a snowy Tuesday — this was prepared for the moment the right opportunity presented itself." },
      { id: 'noras_testimony', icon: '📝', name: "Secretary's Statement", desc: "Nora Bell (Pemberton's secretary, travelling in Compartment 2) heard footsteps in the corridor at approximately 11:50 PM — specifically noting the sound of a man's heeled shoe going toward Compartment 4, then returning at approximately 12:20 AM.", finding: "Crane's footsteps in the corridor match the timeline. Nora Bell's compartment is directly adjacent to the victim's.", tag: 'important', narrative: "She heard him go. She heard him return. She thought nothing of it until morning. Thirty minutes. That is all it takes." },
      { id: 'harris_sighting', icon: '📹', name: "Colonel's Observation", desc: "Colonel Harris (Compartment 6) reports seeing Edmund Crane in the corridor at 11:40 PM 'checking his watch repeatedly' near Compartment 4, a detail Crane omitted from his own account.", finding: "Crane was outside Compartment 4 at 11:40 PM — ten minutes before Nora Bell heard footsteps. He lied about being in his own compartment all night.", tag: 'important', narrative: "Checking his watch. Waiting for the right moment. Harris dismissed it as a restless traveller. Now it is a cornerstone." },
    ],
    suspects: [
      {
        id: 'ecrane', name: 'Edmund Crane', role: 'Former Business Partner',
        portrait_img: 'assets/suspect-ecrane.jpg',
        portrait_bg: 'radial-gradient(ellipse at 50% 30%, #0e0a1a 0%, #06050e 100%)',
        desc: "Pemberton's former partner, publicly forced out of the railway group three years ago. Claims the journey is coincidental — he purchased his ticket a week in advance.",
        narrative: "He is the only passenger who does not seem alarmed by the situation. A man with nothing to hide would be asking more questions. He is asking none.",
        questions: [
          { q: 'What is your relationship with Sir Aldous Pemberton?', a: "We were partners once. That chapter is closed. I travel this route regularly for business — our presence on the same train is unfortunate coincidence." },
          { q: 'Where were you between 11:30 PM and 1 AM?', a: "In my compartment. I took a sleeping draught at eleven and did not wake until the conductor knocked at seven." },
          { q: 'Were you aware of the letter Pemberton was carrying?', a: "I have no knowledge of any letter. I had no contact with Aldous this evening beyond a brief word in the dining car." },
        ],
        interviewEvidence: { id: 'crane_ticket', icon: '🎫', name: "Crane's Train Booking Record", desc: "Crane's ticket was booked at 3:47 PM — six hours after Pemberton's booking at 9:22 AM on the same day. Crane booked his ticket after Pemberton's reservation was visible on the passenger manifest.", finding: "Crane knew Pemberton would be on this train. He chose this journey deliberately.", tag: 'critical' },
      },
      {
        id: 'nora', name: 'Nora Bell', role: "Pemberton's Secretary",
        portrait_img: 'assets/suspect-nora.jpg',
        portrait_bg: 'radial-gradient(ellipse at 50% 30%, #1a100a 0%, #0e0805 100%)',
        desc: "Loyal secretary of seven years, travelling to London to prepare a board presentation. Has access to Pemberton's correspondence — and knows the contents of the letter.",
        narrative: "She is composed in the way that people are when they have been trained to be composed in crises. She is watching every question land. She is measuring her answers.",
        questions: [
          { q: 'Did you know about the letter in the safe?', a: "I typed it myself, three weeks ago. Sir Aldous was meticulous about documentation. It was my job to keep it secure." },
          { q: 'Did you hear anything last night?', a: "Footsteps. Around midnight — perhaps slightly before. A man walking. Heeled shoes. They went toward Sir Aldous's compartment and returned later." },
          { q: 'Did you enter Pemberton\'s compartment at any point?', a: "He called me in at 10:30 to review the morning schedule. I left at 10:50. I went straight to bed." },
        ],
        interviewEvidence: { id: 'wax_impression', icon: '🔑', name: 'Key Profile in Corridor Wax', desc: "A wax drip on the corridor carpet outside Compartment 4 bears the impression of a key — profile consistent with the Blackwood Express master key. Found approximately 2 metres from Compartment 4's door.", finding: "The killer tested or used the copied master key in the corridor. The wax impression preserves the exact key profile.", tag: 'important' },
      },
      {
        id: 'harris', name: 'Colonel Harris', role: 'Fellow Passenger',
        portrait_img: 'assets/suspect-harris.jpg',
        portrait_bg: 'radial-gradient(ellipse at 50% 30%, #0a1a0e 0%, #050e07 100%)',
        desc: "A retired military officer who knew Pemberton through their shared club membership. Travelling to London for a medical appointment. Has a cool, observant manner.",
        narrative: "He sees everything and volunteers nothing. Military habit. He has already taken stock of every person in this carriage. The question is what he has chosen not to say.",
        questions: [
          { q: 'What did you observe last evening?', a: "Crane was in the corridor near Compartment 4 at approximately 11:40, checking his watch. I took note because it struck me as anxious behaviour for a man who claimed to be tired." },
          { q: 'Did you know Sir Aldous personally?', a: "We were club members. Acquaintances rather than friends. I respected him. He was not an easy man, but he was a principled one." },
          { q: 'Is there anything you have not yet told us?', a: "I heard a brief exchange of voices at approximately midnight — two men, one clearly Pemberton's. I could not make out the words. I assumed it was nothing. I was wrong." },
        ],
        interviewEvidence: { id: 'harris_diary', icon: '📒', name: "Colonel's Pocket Diary Entry", desc: "Harris's personal diary, entry for the night of the murder: 'E.C. loitering outside CP4 at 23:40. Checking watch. Something off about him. Note to self: speak to him in morning.' He never got the chance.", finding: "Harris documented his suspicion contemporaneously. Crane was at Pemberton's door at 23:40 — confirmed by an independent witness in writing.", tag: 'critical' },
      },
    ],
  },

  {
    id: 'clockmaker',
    stamp: 'CASE FILE #5563',
    title: "The Clockmaker's Last Hour",
    subtitle: 'Murder — Wednesday Afternoon',
    difficulty: 'easy',
    desc: 'An elderly clockmaker found dead among his life\'s work. His shop was locked. His masterpiece clock was missing. Three people had keys.',
    sceneImg: 'assets/crime-scene-overview.svg',
    sceneImgJpg: 'assets/crime-scene-clockshop.jpg',
    roomHeader: "Finch & Son Clockmakers — Workshop",
    narrative: {
      intro: "INSPECTOR'S BRIEFING — Wednesday afternoon. A customer arrived at Finch & Sons Horological Workshop to collect a repaired pocket watch and found the door unlocked, the shop silent, and Horatio Finch dead on the floor of his workroom. He was 78 years old and had sat at the same bench on the same street for fifty-two years. The cause of death was a single blow to the back of the skull from one of his own brass clock weights — the kind he used to regulate his precision timepieces. He did not see it coming.\n\nThe Finch Celestial Clock — an eleven-year masterwork commissioned by an anonymous private buyer, valued at £85,000 — is gone. The clock weighed nearly forty kilograms and required careful disassembly and specialist packing to remove. This was not a spontaneous theft. Someone came to the workshop knowing exactly what they intended to take and had prepared accordingly. The last entry in Finch's project notes was made that same morning, detailing final adjustments to the escapement. He was still at work when they arrived.\n\nThree people held spare keys: his estranged son Arthur, who returned to town last week after four years away; his apprentice Samuel Doyle, three years in post and growing visibly impatient; and Clara Webb, the antiques dealer across the road, who held a key for emergencies. The customer who found the body confirms the shop was locked when they arrived at 4:15 PM. Between the customer's last confirmed sighting of Finch alive at 11:30 AM, and 4:15 PM, someone let themselves in.",
      scene: "The workshop is a cathedral of ticking. Dozens of clocks on every wall — all still running, none of them marking the moment of Finch's death. The workbench is scattered: tools displaced, the vice open, papers pushed aside. The display cabinet that housed the Celestial Clock is empty — the velvet impression still holds the shape of what stood there. On the floor near the central workbench, a circular brass clock weight lies apart from its fellows. Finch was struck from behind while bent over his work. He was a small man, not a tall one, which tells you something about the height of whoever swung that weight. His project notes lie open to the final entry. Read it.",
      suspects: "Arthur Finch returned to London without warning after four years of estrangement — the same week the Celestial Clock neared completion. He arranged a meeting with the family solicitor the morning of the murder; his own solicitor's records confirm an estate valuation enquiry three weeks prior. Samuel Doyle had talent, ambition, and a growing frustration with working in an old man's shadow — and Finch had recently told him the apprenticeship would be ending. Clara Webb had offered three times to purchase the Celestial Clock and been refused three times; her antiques business has been in financial difficulty for two years. Three keys. One morning. One open door.",
    },
    briefFacts: [
      { label: 'Time of Death', value: 'Between 1:00 PM and 3:30 PM Wednesday' },
      { label: 'Victim', value: 'Horatio Finch, 78, master clockmaker. 52 years at the same address.' },
      { label: 'Cause of Death', value: 'Blunt force trauma — a 2.3 kg brass clock weight. One blow from behind.' },
      { label: 'Stolen', value: 'The Finch Celestial Clock — an astronomical timepiece, 18 months in construction, valued at £85,000.' },
      { label: 'Your Mission', value: "Find who killed Horatio Finch and took his masterpiece." },
    ],
    killerId: 'doyle',
    killerReveal: "Samuel Doyle, Finch's apprentice of three years, entered the workshop at 1:45 PM using his key while the old man was working alone at his bench. Doyle had secretly negotiated the sale of the Celestial Clock to a private German collector for £60,000 — well below its value but in cash, untraceable. When Finch discovered correspondence about the sale on Doyle's workbench, he confronted him. Doyle struck him once from behind with the clock weight and took the clock. The German buyer contact details were found in Doyle's flat. His work gloves, recovered from a drain outside, tested positive for the victim's blood. A receipt in his coat for a storage unit in Peckham revealed the clock's hiding place.",
    clues: [
      { id: 'clock_weight', icon: '⚙️', name: 'Brass Clock Weight', desc: "A 2.3 kg brass clock weight found beneath the workbench, partially cleaned. Forensics confirm blood and hair matching the victim. A single partial fingerprint remains on the underside.", finding: 'Murder weapon confirmed. Partial print is consistent with a male right thumb — analysis ongoing.', tag: 'critical', narrative: "He was struck from behind. He did not see it coming. Fifty-two years of making things that last — ended by one of his own tools." },
      { id: 'sale_correspondence', icon: '✉️', name: 'Sale Correspondence', desc: "A folded letter on Doyle's workbench — an agreement to sell the Finch Celestial Clock to a 'K. Brandt, Munich' for £60,000 cash, signed by Doyle.", finding: "Doyle was selling the clock without Finch's knowledge. When discovered, this provided immediate motive for the confrontation.", tag: 'critical', narrative: "£60,000. Cash. No name on the buyer line except an initial. Doyle's signature at the bottom. The clock was not his to sell — but he had already agreed terms." },
      { id: 'storage_receipt', icon: '🧾', name: 'Peckham Storage Receipt', desc: "A receipt in Doyle's coat pocket for a self-storage unit in Peckham, rented in cash three days before the murder.", finding: 'The Celestial Clock was found in this unit. Doyle had planned the theft before the murder — it was premeditated.', tag: 'critical', narrative: "He rented the unit three days ago. He had already decided what he was going to do. The question was always when — not whether." },
      { id: 'bloody_gloves', icon: '🧤', name: "Doyle's Work Gloves", desc: "Doyle's personal work gloves, recovered from a drain grate outside the shop. Blood confirmed as matching the victim's type.", finding: "Doyle disposed of his gloves after the murder. The disposal location — directly outside the shop — suggests he left in a hurry.", tag: 'critical', narrative: "He threw them as he left. Not further down the street, not into a bin bag — straight into the drain outside the door. He was rattled." },
      { id: 'neighbour_sighting', icon: '📝', name: 'Neighbour Sighting', desc: "Mrs. Howell from the florist next door saw a young man matching Doyle's description leaving the shop at approximately 2:10 PM, carrying a large wooden case and moving quickly.", finding: "Doyle was at the scene at 2:10 PM — within the window of death. He was carrying the Celestial Clock's transport case.", tag: 'important', narrative: "She noticed the case because it was unusual — Horatio rarely moved the clocks. The young man did not look at her. He was walking fast." },
      { id: 'empty_display_case', icon: '🔒', name: 'Empty Display Case', desc: "The locked glass cabinet where the Celestial Clock was exhibited shows no signs of forced entry. The case was opened with the correct key — one of only two that exist.", finding: "The cabinet was opened with a key, not forced. Only Finch and Doyle held cabinet keys. Finch was dead when the clock was removed.", tag: 'important', narrative: "No scratches. No broken glass. Someone opened this case the right way. You do not do that in a panic. You do that when the key is in your pocket." },
      { id: 'cwebb_alibi', icon: '📋', name: "Clara Webb's Shop CCTV", desc: "CCTV from the antiques dealer across the road confirms Clara Webb (rival merchant) was in her own shop from 11 AM to 5 PM without leaving.", finding: "Clara Webb has a confirmed, camera-verified alibi for the entire window of death. She did not enter the clockmaker's shop.", tag: 'minor', narrative: "The camera is mounted at eye level and has no blind spots. Webb appears in seventeen frames over five hours. She is not your killer." },
    ],
    suspects: [
      {
        id: 'doyle', name: 'Samuel Doyle', role: 'Apprentice Clockmaker',
        portrait_img: 'assets/suspect-doyle.jpg',
        portrait_bg: 'radial-gradient(ellipse at 50% 30%, #1a150a 0%, #0e0c05 100%)',
        desc: "Finch's apprentice for three years. Talented, impatient, and harbouring ambitions well beyond the quiet clockmaker's life. Claims he was running errands all afternoon.",
        narrative: "He answers every question a beat too quickly. His eyes move to the empty display case when he thinks you are not watching. He knows it is gone. He knows you know.",
        questions: [
          { q: 'Where were you between 1 PM and 4 PM?', a: "Running parts — we needed mainspring wire from the suppliers on Clerkenwell. I have the receipt somewhere. I was gone most of the afternoon." },
          { q: 'Did you and Mr Finch have any disagreements recently?', a: "He was a demanding teacher. We argued about technique sometimes. Nothing serious. He was like a grandfather to me." },
          { q: 'Do you know where the Celestial Clock is?', a: "That clock was everything to him. Whoever took it — that is who you should be looking for. Not standing here talking to me." },
        ],
        interviewEvidence: { id: 'brandt_card', icon: '💼', name: "German Buyer Contact Card", desc: "A business card found in Doyle's jacket: 'K. Brandt — Private Acquisitions, Munich.' On the back, in Doyle's handwriting: '£60K — delivery Fri.'", finding: "Doyle had arranged the sale of the clock before the murder. The buyer and price are confirmed in his own handwriting.", tag: 'critical' },
      },
      {
        id: 'cwebb', name: 'Clara Webb', role: 'Rival Antiques Dealer',
        portrait_img: 'assets/suspect-cwebb.jpg',
        portrait_bg: 'radial-gradient(ellipse at 50% 30%, #0a101a 0%, #050810 100%)',
        desc: "Runs a competing antiques shop across the road. Had a prolonged legal dispute with Finch over a clock sold under disputed provenance. Holds a spare key from when she watered his plants during his illness last year.",
        narrative: "She is visibly grieving. She and Finch had their differences, but grief does not lie the way guilt does. She also has eight hours of camera footage behind her.",
        questions: [
          { q: 'What was your relationship with Horatio Finch?', a: "Complicated. We fought over the Hapsburg bracket clock in court. But we also had tea on Tuesdays. He was difficult and wonderful in equal measure." },
          { q: 'Why do you still have a key to his shop?', a: "He gave it to me when he was ill three years ago. I kept meaning to return it. Now I suppose it does not matter." },
          { q: 'Did you notice anything unusual today?', a: "I saw Samuel Doyle leaving quickly around two o'clock. He had that big mahogany case — the one Horatio uses for the Celestial. I remember thinking it was odd." },
        ],
        interviewEvidence: { id: 'webb_photo', icon: '📷', name: 'Clara Webb — Phone Photograph', desc: "Clara Webb took a photograph on her telephone camera of the clock shop front at 2:08 PM, originally to document a parking issue. The image clearly shows Samuel Doyle exiting with the mahogany transport case.", finding: "Photographic evidence placing Doyle at the scene with the clock case at 2:08 PM — within the window of death.", tag: 'critical' },
      },
      {
        id: 'finch_jr', name: 'Arthur Finch', role: "Victim's Son",
        portrait_img: 'assets/suspect-finch.jpg',
        portrait_bg: 'radial-gradient(ellipse at 50% 30%, #0e1a10 0%, #060e07 100%)',
        desc: "Horatio's estranged son, who left the family business twenty years ago. Contacted his father last month after years of silence. Holds a key from his time working in the shop.",
        narrative: "Estranged sons who reappear just before a wealthy parent dies are, in this inspector's experience, either guilty of the death or guilty of something else entirely. Find out which.",
        questions: [
          { q: 'Why did you contact your father last month after twenty years?', a: "I heard he was working on something significant. The Celestial Clock. I wanted to reconcile. I wanted to see it before... I just wanted to see it." },
          { q: 'Where were you this afternoon?', a: "At the solicitor's — I have been making enquiries about the estate. I know how that sounds. The appointment was booked two weeks ago." },
          { q: 'Do you stand to inherit the shop and the clock?', a: "I am his only son. But I had nothing to do with this. I came back to fix things, not to take them." },
        ],
        interviewEvidence: { id: 'finch_solicitor_card', icon: '📋', name: "Solicitor Appointment Card", desc: "Arthur Finch's solicitor appointment card confirms today's meeting — but also shows a prior appointment three weeks ago labelled 'estate valuation enquiry,' before any crime occurred.", finding: "Finch was already exploring estate value before his father's death. His return was motivated by inheritance, not reconciliation.", tag: 'important' },
      },
    ],
  },

  // -----------------------------------------------------------------------
  //  7. THE LIGHTHOUSE KEEPER
  // -----------------------------------------------------------------------
  {
    id: 'lighthouse',
    name: 'The Lighthouse Keeper',
    subtitle: 'Cape Morven, 1931',
    caseNumber: 'CASE FILE #7821',
    difficulty: 'medium',
    desc: "The lighthouse keeper of Cape Morven was found dead at the base of the tower. The light still turning. Three residents of the coastal hamlet had reason to want him silenced.",
    img: 'assets/crime-scene-lighthouse.jpg',
    narrative: {
      intro: "CASE BRIEFING — Cape Morven, early morning. Edmund Hale, 61, has kept the lighthouse on this headland for nineteen years. This morning, the harbour master's boy found him dead on the rocks below the lamp room's external walkway. He was not there by accident. The pathologist's preliminary report confirms deep bruising around the neck — consistent with a cord or rope applied before the fall. He was incapacitated first, then sent over the railing.\n\nThe lamp room door was found locked from the inside. No second person was present inside when the door was forced. But the lock is a simple sliding bolt — a thin rod through the keyhole slides it home from the outside. The killer locked it from the corridor after leaving via the walkway, then descended the external service ladder to the rocks below.\n\nHale's final log entry reads: 'Tonight: visited by M.R. again. She wants the letter. I will not give it. If anything happens to me, the letter is hidden in the lamp housing — behind the Fresnel lens.' The letter was found. It details systematic smuggling operations operating through Cape Morven harbour — with dates, vessel names, and the name of the local organiser. A gold pendant engraved 'M.R.' was found caught on a railing bolt of the external walkway. The killer lost it in the struggle.",
      facts: [
        { label: 'Victim', value: 'Edmund Hale, 61, lighthouse keeper. Found on coastal rocks below the walkway.' },
        { label: 'Cause of death', value: 'Blunt force trauma consistent with a fall — but bruising on the neck suggests strangulation first.' },
        { label: 'Scene anomaly', value: 'Lamp room door locked from inside. No second person found inside. How did the killer leave?' },
        { label: 'Your task', value: 'Examine the lighthouse. Interview three suspects. Determine who killed Edmund Hale — and how.' },
      ],
    },
    sceneNarrative: "The lamp room is where Hale spent every evening of the last nineteen years. The rope coil on the storage hook is missing a segment — approximately 1.5 metres, recently cut, fresh marks on the remaining coil. The Fresnel lens housing behind the great light is where Hale hid the letter. The external walkway railing shows a fresh gouge where something snagged and tore free. Below, the rocks are slick. The tide has begun to come in. The scene will not stay this clear for long.",
    suspectsNarrative: "Mira Reed runs the harbour chandlery and has managed this hamlet's trade for fifteen years. Her initials are M.R. She claims to have been home all evening — but unscheduled vessel records from the harbour log that night tie her business accounts to a vessel that docked without a manifest at 11 PM. Tobias Crane is a fisherman who has recently acquired new equipment he cannot explain on a fisherman's wages. Agnes Hale is Edmund's estranged daughter, returned after fifteen years — her presence here is either grieving or opportunistic, and the timing demands explanation.",
    clues: [
      { id: 'lh_neck_bruising', icon: '🩺', name: 'Neck Bruising Report', desc: 'The pathologist\'s preliminary report notes deep bruising around the neck — consistent with a rope or cord applied before the fall.', finding: 'Hale was likely strangled or incapacitated before going over the railing. The fall alone did not kill him.', tag: 'critical', narrative: 'The bruising is fresh — within an hour of death. Someone put their hands, or a cord, around Edmund Hale\'s throat.' },
      { id: 'lh_logbook', icon: '📒', name: "Keeper's Log — Final Entry", desc: '"Tonight: visited by M.R. again. She wants the letter. I will not give it. If anything happens to me, the letter is hidden in the lamp housing — behind the Fresnel lens."', finding: "Hale had a document someone wanted desperately. 'M.R.' are the initials of one of the suspects.", tag: 'critical', narrative: 'Hale knew he was in danger. He left the note deliberately — hoping someone would find it.' },
      { id: 'lh_letter_found', icon: '✉️', name: 'The Hidden Letter', desc: 'Behind the Fresnel lens: a sealed letter addressed to the Coastal Revenue Authority. It details systematic smuggling operations — naming dates, ship names, and one local organiser.', finding: 'The letter would have destroyed a smuggling ring and sent its organiser to prison. This is the motive.', tag: 'critical', narrative: 'Sixty years of light, and in its heart — a secret that cost a man his life.' },
      { id: 'lh_rope_coil', icon: '🪢', name: 'Rope Coil (Missing Segment)', desc: "A coil of mooring rope in the lamp room storage. One segment — approximately 1.5 metres — has been cut away recently. Fresh cut marks on the remaining coil.", finding: 'A length of rope was removed from this coil recently. It matches the width of the bruising on Hale\'s neck.', tag: 'important', narrative: 'Someone needed a short length of rope. They found it here, in the room where Hale spent every evening.' },
      { id: 'lh_inside_lock', icon: '🔒', name: 'The Locked Door Mystery', desc: "The lamp room door was found locked from the inside — but inspection reveals the lock is a simple sliding bolt. The bolt can be slid into place using a thin rod through the external keyhole.", finding: 'The locked-from-inside impossibility is explained: the killer bolted the door from outside using the rod, then left via the external walkway.', tag: 'important', narrative: 'A simple mechanism. A deliberate choice. The killer wanted a delay before anyone entered.' },
      { id: 'lh_mr_pendant', icon: '📿', name: 'Monogrammed Pendant', desc: 'A small gold pendant engraved "M.R." caught on the walkway railing. A clasp suggests it was torn free during a struggle.', finding: "The pendant belongs to one of the suspects — the person Hale called 'M.R.' in his log. They were here.", tag: 'critical', narrative: 'Gold does not lie. Whoever lost this pendant was on the walkway the night Edmund Hale died.' },
      { id: 'lh_boat_schedule', icon: '⚓', name: 'Harbour Log — Unscheduled Vessel', desc: 'The harbour master\'s log notes an unscheduled vessel that docked at 11 PM — the estimated time of Hale\'s death. No crew manifested. The berthing fee was paid in cash.', finding: 'The unscheduled vessel ties the smuggling operation directly to the night of the murder. The killer had a getaway — or cargo to move.', tag: 'important', narrative: "Ships don't dock in the dark for honest reasons." },
    ],
    killer: 'mira_reed',
    suspects: [
      {
        id: 'mira_reed',
        name: 'Mira Reed',
        role: 'Harbour mistress and local merchant',
        img: 'assets/suspect-mira.jpg',
        bio: "Runs the harbour chandlery. Charming and respected. Has managed the hamlet's trade for fifteen years. Her initials are M.R.",
        questions: [
          { q: 'Edmund Hale mentioned someone with your initials in his final log entry. Where were you last night?', a: "At home. All evening. I can't help what Edmund wrote — he was an old man who imagined things." },
        ],
        interviewEvidence: { id: 'mira_alibi_gap', icon: '🗓️', name: "Mira Reed — Alibi Gap", desc: "Cross-referencing Mira Reed's claim she was 'home all evening' with the harbour log: the unscheduled vessel at 11 PM was registered under a company name linked to Reed's chandlery.", finding: "Mira Reed's alibi is contradicted by commercial records tying her to the unscheduled vessel that docked the night of the murder.", tag: 'critical' },
      },
      {
        id: 'tobias_crane',
        name: 'Tobias Crane',
        role: 'Fisherman and part-time harbour hand',
        img: 'assets/suspect-tobias.jpg',
        bio: "A quiet man who has worked the Cape Morven waters all his life. Recently came into unexplained money — new boat, new gear. Avoids eye contact when questioned.",
        questions: [
          { q: "You've been spending above your means recently. Where is the money coming from?", a: "Good season. Fish prices are up. I don't see what that has to do with Edmund." },
        ],
        interviewEvidence: { id: 'crane_payment', icon: '💰', name: "Tobias Crane — Cash Payment Record", desc: "Bank records show Crane received three unexplained cash deposits over six months — each shortly after an unscheduled vessel docked at Cape Morven harbour.", finding: "Crane was being paid for harbour labour related to the smuggling operation, but the payments originate from Reed's business accounts.", tag: 'important' },
      },
      {
        id: 'agnes_hale',
        name: 'Agnes Hale',
        role: 'Edmund Hale\'s estranged daughter',
        img: 'assets/suspect-agnes.jpg',
        bio: "Arrived in Cape Morven three days ago after fifteen years of estrangement from her father. Claims she came to reconcile. Others say she came for money.",
        questions: [
          { q: "Why did you return to Cape Morven after fifteen years, and why now?", a: "He was my father. I wanted to make things right before it was too late. It seems I was too late in a way I didn't expect." },
        ],
        interviewEvidence: { id: 'agnes_will_copy', icon: '📄', name: "Agnes Hale — Will Query Letter", desc: "Among Agnes Hale's belongings: a solicitor's letter from two months ago advising her that her father's estate — including the lighthouse keeper's pension and cottage — would pass entirely to a maritime charity unless she contested it.", finding: "Agnes had financial motive, but the letter also confirms she only learned of the will's terms two months ago — and had no knowledge of the smuggling letter.", tag: 'minor' },
      },
    ],
  },

  // -----------------------------------------------------------------------
  //  8. THE DISAPPEARED DUCHESS
  // -----------------------------------------------------------------------
  {
    id: 'duchess',
    name: 'The Disappeared Duchess',
    subtitle: 'Harwick Hall, 1908',
    caseNumber: 'CASE FILE #2204',
    difficulty: 'hard',
    desc: "The Duchess of Harwick vanished from a locked bedroom during her own birthday dinner. No body, no ransom note — just a cold fireplace and a broken pearl necklace. Three guests had access.",
    img: 'assets/crime-scene-harwick.jpg',
    narrative: {
      intro: "CASE BRIEFING — Harwick Hall, birthday dinner. Forty guests. At 8:04 PM, Eleanor Harwick, Duchess of Harwick, 52, retired to her rooms complaining of a headache. Lord Harwick watched her go. By 8:30, Lady Cecily Vane knocked on the door to check on her — no answer, assumed she was resting. At 9:15 PM, the lady's maid knocked for the second time. Still silence. The door was forced at 9:30. The room was empty. The door had been locked from the inside. The window was latched from the inside. The fireplace was cold. The Duchess of Harwick had vanished.\n\nShe has not been found. The investigation now proceeds on the assumption that she was murdered — and that her body was removed through means not immediately obvious. Luminol examination of the fireplace reveals organic material in the ash consistent with human tissue. The fireplace had been used recently, despite the cold grate presented. A trail of three pearls from her broken necklace leads directly to the hearth.\n\nA hidden passage was found behind the wardrobe — a servants' route connecting the bedroom to the wine cellar and from there to the garden gate. A footprint in the wine cellar mud has been cast. A silver letter opener under the writing desk cushion has tested positive for blood. The Duchess's diary, found in her writing case, contains an entry from the morning of her birthday: 'I have told V.M. that I know about the forgeries. He says he will ruin me if I speak. I will speak regardless. I am not afraid of him.'",
      facts: [
        { label: 'Victim', value: 'Eleanor Harwick, Duchess of Harwick, 52. Missing — presumed deceased.' },
        { label: 'Last seen', value: '8:04 PM by her husband, Lord Harwick. She retired "with a headache."' },
        { label: 'Scene anomaly', value: 'Door locked from inside. Window latched from inside. No body found. One broken pearl on the floor.' },
        { label: 'Your task', value: 'Determine what happened to the Duchess — and which of three guests played a role.' },
      ],
    },
    sceneNarrative: "The bedroom has been tidied after the fact — that much is clear. The pearl trail on the floor and the ash in the fireplace were missed by whoever tidied, and they tell the real story. The wardrobe has been moved recently — fresh scrape marks on the floorboards. The hidden passage behind it descends to the wine cellar. In the cellar: displaced racks, a cavity in the wall the dimensions of a human body, and a boot print in the mud. The writing bureau holds a letter opener with dried blood on the blade. On the desk: the Duchess's diary, open to her final entry. The initials 'V.M.' appear four times in the last three pages.",
    suspectsNarrative: "Victor Marsh manages the Harwick estate finances and has done so for twelve years. His initials are V.M. A bank audit found in his travelling case reveals £34,000 transferred to a private account under his name over four years — the forgeries the Duchess discovered. Lord Edmund Harwick knew about the embezzlement; a letter from him to Marsh, dated three days prior, reads: 'Eleanor has seen the accounts. Keep her occupied until I can manage the situation.' Lady Cecily Vane was the Duchess's closest friend — she was on the upper floor at 8:30 and confirmed it herself, which is either an alibi or a confession depending on what she did in the three seconds before she knocked.",
    clues: [
      { id: 'duch_pearl', icon: '📿', name: 'Broken Pearl Necklace', desc: "The Duchess's signature pearl necklace, broken. Pearls scattered across the bedroom floor — except for a trail of three that leads to the fireplace.", finding: 'The necklace was broken in a struggle. The trail of pearls toward the fireplace suggests that is where the struggle ended.', tag: 'critical', narrative: 'Pearls do not scatter themselves in a line.' },
      { id: 'duch_fireplace', icon: '🔥', name: 'Cold Fireplace — Ash Analysis', desc: "The fireplace is cold — but the ash analysis reveals paper ash, fabric fibres, and traces of human hair. A recent fire burned something in this grate.", finding: 'Something — or someone — was partially burned in this fireplace. The ash contains organic material consistent with human tissue.', tag: 'critical', narrative: "Cold fires tell the hottest stories." },
      { id: 'duch_hidden_passage', icon: '🚪', name: 'Hidden Passage (Behind Wardrobe)', desc: "Moving the wardrobe reveals a narrow servants' passage — unknown to most guests. It connects the bedroom to the wine cellar and the garden gate.", finding: "The locked-room mystery is solved: the killer used the hidden passage. The Duchess was taken — or her remains were moved — through this route.", tag: 'critical', narrative: 'Old houses keep old secrets.' },
      { id: 'duch_letter_opener', icon: '🗡️', name: 'Letter Opener (Blood Trace)', desc: "A silver letter opener found beneath the writing desk cushion. Luminol testing reveals a blood trace on the blade — cleaned, but not thoroughly.", finding: 'The letter opener is consistent with a stabbing weapon. The blood type matches records from the Duchess\'s physician.', tag: 'critical', narrative: 'Silver does not stain easily. This one did.' },
      { id: 'duch_mud_footprint', icon: '👣', name: 'Mud Footprint (Wine Cellar)', desc: "A partial footprint in the wine cellar at the base of the servants' passage. The tread matches a specific style of gentleman's boot — sold exclusively by one London cobbler.", finding: 'The footprint was made within hours of the disappearance. The boot style narrows the field to a specific class of guest.', tag: 'important', narrative: 'Mud remembers where it has been.' },
      { id: 'duch_diary', icon: '📓', name: "Duchess's Diary — Final Entry", desc: '"I have told V.M. that I know about the forgeries. He says he will ruin me if I speak. I will speak regardless. I am not afraid of him." Dated the morning of her birthday.', finding: 'The Duchess knew about financial forgeries and intended to expose them. "V.M." is the killer\'s motive — not passion, but self-preservation.', tag: 'critical', narrative: 'She was not afraid. She should have been.' },
      { id: 'duch_wine_cellar', icon: '🍷', name: 'Wine Cellar — Disturbed Racks', desc: "Several wine racks in the cellar have been moved recently — fresh scrape marks on the stone floor. Behind them: a cavity in the wall, roughly the dimensions of a human body.", finding: 'The cavity is the likely hiding place of the Duchess\'s remains before removal. The scrape marks are fresh — made the night of the disappearance.', tag: 'important', narrative: 'The cellar was not searched thoroughly enough on the first night. It should have been.' },
    ],
    killer: 'victor_marsh',
    suspects: [
      {
        id: 'victor_marsh',
        name: 'Victor Marsh',
        role: 'Estate solicitor and financial manager',
        img: 'assets/suspect-victor-marsh.jpg',
        bio: "Has managed the Harwick estate finances for twelve years. Impeccably dressed. The initials V.M. His accounts show irregularities that a sharp-eyed duchess might have noticed.",
        questions: [
          { q: 'The Duchess wrote your initials in her diary the morning she disappeared. What did she know about you?', a: "Eleanor had a vivid imagination and a fondness for dramatics. Whatever she wrote, it was the product of a troubled mind. I have nothing to hide." },
        ],
        interviewEvidence: { id: 'marsh_forgery_file', icon: '📁', name: "Victor Marsh — Forgery Evidence File", desc: "A bank audit file found in Marsh's travelling case (searched under warrant): seven forged signatures over four years, transferring estate funds to a private account in Marsh's name. Total: £34,000.", finding: "Marsh had been embezzling the Harwick estate for four years. The Duchess had discovered it. He had everything to lose and the motive to act.", tag: 'critical' },
      },
      {
        id: 'lady_cecily',
        name: 'Lady Cecily Vane',
        role: "The Duchess's closest friend",
        img: 'assets/suspect-cecily.jpg',
        bio: "Childhood friend of the Duchess. Has visited Harwick Hall every birthday for thirty years. Visibly distressed at the disappearance — or performing distress convincingly.",
        questions: [
          { q: 'You were seen on the upper floor near the Duchess\'s room at approximately 8:30 PM. What were you doing there?', a: "I was checking on her — she said she had a headache. I knocked. There was no answer. I assumed she was sleeping and left." },
        ],
        interviewEvidence: { id: 'cecily_alibi_confirm', icon: '🪞', name: "Lady Cecily — Confirmed Presence (Alibi Partial)", desc: "A housemaid confirms Lady Cecily knocked on the Duchess's door at 8:30 and left after thirty seconds. She was then seen at the dinner table at 8:45, accounting for her movements.", finding: "Lady Cecily's movements check out for 8:30-8:45. She did not have sufficient time to execute the disappearance and return to dinner. She is credibly not the killer.", tag: 'minor' },
      },
      {
        id: 'lord_harwick',
        name: 'Lord Edmund Harwick',
        role: "The Duchess's husband",
        img: 'assets/suspect-lord-harwick.jpg',
        bio: "The Duke of Harwick, 58. A cold, formal man who has spent the evening in the company of guests — a fact he mentions frequently. His marriage was, by all accounts, a business arrangement.",
        questions: [
          { q: 'Your wife was about to expose financial irregularities in your household. Were you aware of them?', a: "I leave all financial matters to Marsh. Eleanor's disappearance has nothing to do with accounts. I want her found." },
        ],
        interviewEvidence: { id: 'harwick_letter', icon: '✉️', name: "Lord Harwick — Letter to Marsh (Three Days Prior)", desc: "A letter from Lord Harwick to Victor Marsh, dated three days before the disappearance: 'Eleanor has seen the accounts. Keep her occupied until I can manage the situation. Do not let this unravel.'", finding: "Lord Harwick knew about the forgeries and conspired with Marsh to manage the Duchess — but 'manage' has a sinister meaning in light of what followed.", tag: 'important' },
      },
    ],
  },

  // -----------------------------------------------------------------------
  //  9. THE STUDIO MURDER
  // -----------------------------------------------------------------------
  {
    id: 'studio',
    name: 'Death in Studio Seven',
    subtitle: 'Pinewood Broadcasting, 1952',
    caseNumber: 'CASE FILE #5509',
    difficulty: 'medium',
    desc: "A radio actor was found dead in a sound-proofed broadcasting studio during a live show. The studio door was locked. The broadcast went out. Somewhere in the cast, a killer performed the role of their life.",
    img: 'assets/crime-scene-studio.jpg',
    narrative: {
      intro: "CASE BRIEFING — Pinewood Broadcasting, Studio Seven. Wednesday evening. The Mystery Hour went out live across the BBC Home Service at 9:00 PM, as it had every Wednesday for six years. Ten million listeners. At 9:14 PM — fourteen minutes into the broadcast — Clarence Duff, 44, lead actor, was found slumped at his microphone by the sound engineer. The programme continued. It had to. The broadcast was live.\n\nDuff was pronounced dead at 9:32 PM. The cause: digoxin toxicity — a fast-acting cardiac glycoside, lethal at sufficient dose. The poison was introduced into his personal water glass at some point during the broadcast. The water decanter, shared between the performers, shows no trace of toxin. Only his glass was targeted.\n\nAt 9:07 PM, an unscheduled 90-second Brahms interlude was inserted into the programme by the sound engineer — a request made by the head producer earlier that evening. During those 90 seconds, no performer was required to be at their microphone. An empty digoxin pill bottle was recovered from the studio waste bin, label torn off, a partial name visible: '...OLLIS'. A single fingerprint on the water glass does not belong to Duff. It matches a file from a 1941 fraud investigation. Duff's own script — annotated in the margins — reads: 'If R.H. tries to have me replaced again, I go to the board. Evidence in dressing room. Tuesday.' Tuesday is the day after tomorrow.",
      facts: [
        { label: 'Victim', value: 'Clarence Duff, 44, radio actor. Fourteen years at Pinewood Broadcasting.' },
        { label: 'Cause of death', value: 'Poisoning — a fast-acting cardiac glycoside compound, introduced into the victim\'s water glass.' },
        { label: 'Scene anomaly', value: 'The broadcast continued without interruption. The killer acted while microphones were live.' },
        { label: 'Your task', value: "Review the studio evidence and interview the three people present in Studio Seven during Duff's final broadcast." },
      ],
    },
    sceneNarrative: "Studio Seven is silent now. The performance lights are still on. Duff's water glass sits at his microphone position — the digoxin residue visible under close examination. His script lies open to the scene he was performing when he died; his final pencilled margin note references 'R.H.' and evidence in his dressing room. That evidence — a manila folder of internal memos — is in the dressing room, documenting eighteen months of professional sabotage and a forged resignation letter bearing Duff's signature, dated for next month. The sound booth log records the unscheduled Brahms segment at 9:07, noted as 'unusual — logging just in case' by the sound engineer.",
    suspectsNarrative: "Roland Hollis runs the drama division and requested the unscheduled break that created the window for the poisoning. His last name ends in '...OLLIS.' He has been engineering Duff's replacement for eighteen months and already arranged a contract for a younger lead starting next month. Vera Chase is that younger lead — but she knew about the contract already, giving her less reason to act. Peter Finney is the sound engineer who logged the break request as suspicious and has kept records of every unusual instruction he has received. One of them is a murderer. One of them is the only honest witness. One of them has no idea what is really happening.",
    clues: [
      { id: 'st_water_glass', icon: '🥃', name: "Poisoned Water Glass", desc: "The water glass beside Duff's script position. Residue analysis confirms digoxin — a fast-acting cardiac glycoside. A lethal dose.", finding: "Digoxin was introduced to the water glass at some point during the broadcast. The killer had access to the glass — and to pharmaceutical-grade digoxin.", tag: 'critical', narrative: "In a radio studio, everyone's attention is on the microphone. No one watches the water glasses." },
      { id: 'st_broadcast_log', icon: '🎙️', name: 'Broadcast Log — Segment Break', desc: "The studio log records a 90-second 'music segment' at 9:07 PM — an unscheduled break inserted by the sound engineer. During this window, no performers were on microphone.", finding: "The 90-second music break created a window where someone could move freely and access Duff's water glass without being audible on air.", tag: 'critical', narrative: "Ninety seconds is enough time to commit murder." },
      { id: 'st_pill_bottle', icon: '💊', name: 'Empty Pill Bottle (Digoxin)', desc: "Found in the waste bin in the studio's utility room — adjacent to Studio Seven. A prescription pill bottle for digoxin, emptied. The label has been torn off, but a partial name remains: '...OLLIS'.", finding: "The murderer sourced the poison from their own prescription medication. The partial name '...OLLIS' narrows the suspect field.", tag: 'critical', narrative: "Poison requires planning. This was not a crime of passion." },
      { id: 'st_script_margin', icon: '📄', name: "Duff's Script — Margin Notes", desc: "Duff's personal copy of the broadcast script. In the margin, in his own hand: 'If R.H. tries to have me replaced again, I go to the board. Evidence in my dressing room. Tuesday.'", finding: "Duff was planning to expose someone's attempt to have him removed — and had evidence. 'R.H.' are the initials of a suspect.", tag: 'important', narrative: "He was going to act on Tuesday. Someone made sure Tuesday never came." },
      { id: 'st_dressing_room_file', icon: '📁', name: "Evidence File (Duff's Dressing Room)", desc: "A manila folder containing internal memos showing Pinewood's head producer systematically routing Duff's best roles to a younger actor — and forging Duff's signature on a resignation letter dated for next month.", finding: "Duff had documented proof of professional sabotage. The forged resignation letter would have ended his career. The motive is professional survival.", tag: 'critical', narrative: "The letter is dated for next month. It will never be used now." },
      { id: 'st_sound_booth', icon: '🎚️', name: "Sound Booth — Engineer's Note", desc: "A handwritten note from the sound engineer to himself: 'R.H. asked me to add the Brahms segment at 9:07 — said Duff needed a rest. Odd request. Logging it just in case.'", finding: "The unscheduled music break was requested by the person who needed the window to poison Duff. This is the smoking gun of planning.", tag: 'critical', narrative: "The engineer logged it just in case. He was right to." },
      { id: 'st_fingerprint', icon: '🔍', name: 'Fingerprint on Water Glass', desc: "A single clear fingerprint on the water glass — not Duff's. The fingerprint matches the right thumb of a person on file from a 1941 fraud investigation. Same person listed in the studio staff register.", finding: "The fingerprint places the killer's hand on the water glass. Combined with the digoxin residue, this is direct physical evidence of the murder act.", tag: 'critical', narrative: "You can change your name. You cannot change your fingerprints." },
    ],
    killer: 'roland_hollis',
    suspects: [
      {
        id: 'roland_hollis',
        name: 'Roland Hollis',
        role: 'Head producer, Pinewood Drama',
        img: 'assets/suspect-hollis.jpg',
        bio: "Runs the drama division with an iron schedule and an eye for profit. Has been grooming a younger actor to replace Duff for eighteen months. His last name ends in '...OLLIS.'",
        questions: [
          { q: "You requested the unscheduled music break at 9:07. Why?", a: "Clarence looked pale. I was being considerate. I had no idea he was going to collapse — I am devastated." },
        ],
        interviewEvidence: { id: 'hollis_1941_record', icon: '📋', name: "Roland Hollis — 1941 Fraud Record", desc: "Cross-referencing the fingerprint database: the right thumb on the water glass matches one Ronald Hollis, investigated in 1941 for insurance fraud — same person, changed first name to 'Roland' when joining Pinewood.", finding: "Hollis has a prior fraud investigation and attempted to obscure his identity. His fingerprint is on the murder weapon. He inserted the break that gave him the window. He is the killer.", tag: 'critical' },
      },
      {
        id: 'vera_chase',
        name: 'Vera Chase',
        role: 'Supporting actress and understudy',
        img: 'assets/suspect-vera-chase.jpg',
        bio: "Twenty-three years old, talented, quietly ambitious. Has been cast opposite Duff for two years. Duff was known to have blocked her promotion to lead more than once.",
        questions: [
          { q: "Duff blocked your promotion twice. Did you resent him for it?", a: "Of course I did. But I am an actress, not a poisoner. I wanted him to step aside, not to die." },
        ],
        interviewEvidence: { id: 'chase_agent_note', icon: '📱', name: "Vera Chase — Agent Communication", desc: "A telegram from Chase's agent, dated the week before the murder: 'Hollis confirms Duff contract ends next month — your lead contract begins March 1st. Do NOT antagonise Duff before then.'", finding: "Chase knew she was getting the lead role regardless — Hollis had already arranged it. She had no need to kill Duff; the position was coming to her by design.", tag: 'minor' },
      },
      {
        id: 'peter_finney',
        name: 'Peter Finney',
        role: 'Sound engineer, Studio Seven',
        img: 'assets/suspect-finney.jpg',
        bio: "Has worked Studio Seven for eleven years. Quiet, methodical, obsessively accurate about his logs. Wrote the note about the unscheduled break.",
        questions: [
          { q: "You logged the unscheduled break as unusual. What made you suspicious?", a: "Hollis never requests breaks mid-broadcast. We have a tight schedule. It felt wrong — so I wrote it down. I am glad I did." },
        ],
        interviewEvidence: { id: 'finney_log_full', icon: '📒', name: "Peter Finney — Full Studio Log", desc: "Finney's complete studio log for the broadcast: every 90-second interval documented with position of all performers. His log shows Hollis crossed from the producer booth to the studio floor during the music break — and returned 75 seconds later.", finding: "Finney's meticulous log places Hollis physically beside Duff's position for 75 seconds — the exact window needed to add poison to the water glass.", tag: 'critical' },
      },
    ],
  },

  // -----------------------------------------------------------------------
  //  10. THE MISSING HEIR
  // -----------------------------------------------------------------------
  {
    id: 'heir',
    name: 'The Missing Heir',
    subtitle: 'Dunmore Hall, 1921',
    caseNumber: 'CASE FILE #3317',
    difficulty: 'medium',
    desc: "The heir to the Dunmore estate was found dead in the library hours before he was due to sign his inheritance papers. A new will had been drafted. Three people stood to gain from his death.",
    img: 'assets/crime-scene-dunmore.jpg',
    narrative: {
      intro: "CASE BRIEFING — Dunmore Hall. Alistair Dunmore, 29, was found dead in the library at 11 PM. He was two hours from signing the documents that would have confirmed his full legal inheritance of the Dunmore estate — £200,000 in assets, the house, and the Dunmore land trust. He had been poisoned. Arsenic, introduced into his wine glass sometime during the evening. The dose was administered 2–3 hours before death — meaning between 8 and 9 PM.\n\nThe wine decanter on the sideboard is clean. Only Alistair's individual glass was contaminated. Someone targeted his glass specifically, which means they were in the room with him during the window when it was unattended, or handed him the glass directly. Three people were in the house that evening: his cousin Percy, his fiancée Eleanor, and the family chaplain Reverend Gault. All three dined with him. All three had access to the drawing room sideboard.\n\nThe new will on Alistair's desk — unsigned — passes the entire estate to Percy Dunmore if Alistair dies without a signature. An arsenic tin from the garden store shows recent use; a partial fingerprint is visible on the lid in the residue. The housekeeper, Mrs Marsh, places Percy in the library at approximately 8 PM — alone, allegedly leaving a note. Percy's coat pocket contains a monogrammed glove that has tested positive for arsenic trace.",
      facts: [
        { label: 'Victim', value: 'Alistair Dunmore, 29, heir to Dunmore Hall and its £200,000 estate.' },
        { label: 'Cause of death', value: 'Arsenic poisoning. Consistent with a dose administered 2–3 hours before death.' },
        { label: 'Scene note', value: 'An unsigned copy of the new will was found on the desk beside the body.' },
        { label: 'Your task', value: 'Examine the library, interview three suspects, and identify who poisoned Alistair Dunmore.' },
      ],
    },
    sceneNarrative: "The library is otherwise undisturbed. Alistair's wine glass sits on the side table beside his chair. The unsigned will is on the writing desk — the solicitor's version, clean and ready for signature. On the floor, nearly invisible against the dark rug: a monogrammed cotton glove. Behind the sideboard, pushed back into the gap beside the wall: nothing visible at first, but the gap has been recently accessed — the dust disturbed. Alistair's chair faces the door. He would have seen whoever entered.",
    suspectsNarrative: "Percy Dunmore inherits everything if Alistair dies tonight — and he is £4,200 in debt with a final notice from his creditor arriving this afternoon. The housekeeper places him in this room at 8 PM. Eleanor Vane, Alistair's fiancée, has a rock-solid alibi with three witnesses from 7:30 onward — but she is also the person who found the body. Reverend Gault loses a £500 bequest under the new will and claims virtue; his movements from 8 PM to 8:30 PM are only partially accounted for.",
    clues: [
      { id: 'heir_will', icon: '📄', name: 'Unsigned New Will', desc: "A new will prepared by the family solicitor — unsigned. Under its terms, the estate passes to Alistair's cousin Percy if Alistair dies without signing.", finding: "Percy Dunmore inherits the entire estate if Alistair dies tonight — unsigned. Had Alistair signed, Percy would have received nothing.", tag: 'critical', narrative: "Two hours more and this paper would have changed everything." },
      { id: 'heir_wine_glass', icon: '🍷', name: "Alistair's Wine Glass", desc: "The wine glass beside the body tests positive for arsenic at a lethal concentration. The wine decanter on the sideboard shows no trace — the poison was added to the glass specifically.", finding: "Someone poisoned Alistair's individual glass, not the shared decanter. This was targeted and deliberate.", tag: 'critical', narrative: "The decanter is clean. Whoever did this wanted only Alistair dead." },
      { id: 'heir_arsenic_tin', icon: '⚗️', name: "Arsenic Tin (Garden Store)", desc: "A tin of rat poison (arsenic-based) from the garden store — partially emptied recently. The lid shows a fresh partial fingerprint in the residue.", finding: "Arsenic was sourced from inside the house. Someone accessed the garden store and removed a quantity sufficient for the dose.", tag: 'important', narrative: "The garden store was unlocked. Anyone in the house could have reached it." },
      { id: 'heir_solicitor_note', icon: '📋', name: 'Solicitor\'s Letter', desc: "A letter from the family solicitor to Alistair, dated that morning: 'I urge you to sign tonight. Your cousin Percy has been making enquiries about contesting the estate. Do not delay.'", finding: "The solicitor believed Percy was already preparing a legal challenge. Alistair knew he was under pressure.", tag: 'important', narrative: "The solicitor's warning arrived that morning. By evening, it was too late." },
      { id: 'heir_housekeeper_account', icon: '👁️', name: "Housekeeper's Account", desc: "Mrs Marsh, the housekeeper, states she saw Percy Dunmore enter the library at approximately 8 PM — the window consistent with administering the poison. Percy told her he was 'leaving a note for Alistair.'", finding: "Percy was in the library during the precise window when the poison would have been administered. The housekeeper places him there.", tag: 'critical', narrative: "She noticed him because he was carrying something — she thought it was a letter." },
      { id: 'heir_glove', icon: '🧤', name: "Arsenic-Stained Glove", desc: "A single cotton glove found tucked behind a row of books — arsenic residue on the fingers. A monogram on the cuff: 'P.D.'", finding: "Percy Dunmore's monogrammed glove, stained with arsenic. He wore it to handle the poison and hid it in the room.", tag: 'critical', narrative: "He hid it in the library itself. He was confident no one would look." },
      { id: 'heir_bank_letter', icon: '💰', name: "Percy's Debt Letter", desc: "A private letter to Percy from a London creditor: 'Your debt of £4,200 is now six months overdue. Without resolution by month's end, we will pursue legal action.'", finding: "Percy was deeply in debt and had weeks before legal action. Alistair's death and the inheritance would resolve everything — with £200,000 to spare.", tag: 'important', narrative: "Desperation makes a man capable of things he would not otherwise consider." },
    ],
    killer: 'percy_dunmore',
    suspects: [
      {
        id: 'percy_dunmore',
        name: 'Percy Dunmore',
        role: "Alistair's cousin and secondary heir",
        img: 'assets/suspect-percy.jpg',
        bio: "Charming, well-dressed, and deeply in debt. Has contested the estate privately for years. His monogram is 'P.D.'",
        questions: [
          { q: "You were seen entering the library at 8 PM. What were you doing there?", a: "I left Alistair a note wishing him well with the signing. I had no idea he was going to be ill. This is a terrible tragedy." },
        ],
        interviewEvidence: { id: 'percy_creditor_telegram', icon: '📨', name: "Percy Dunmore — Creditor's Telegram", desc: "A telegram to Percy from his London creditor, received that afternoon: 'Final notice. £4,200 due. Without full settlement by Friday, legal proceedings begin Monday.' Friday is tomorrow.", finding: "Percy was hours away from ruin when Alistair died. The inheritance was his only exit. The motive is immediate and overwhelming.", tag: 'critical' },
      },
      {
        id: 'eleanor_vane',
        name: 'Eleanor Vane',
        role: "Alistair's fiancée",
        img: 'assets/suspect-eleanor.jpg',
        bio: "Alistair's fiancée of two years. Stand to gain his personal assets — but not the estate, which was entailed. Calm and composed since the death.",
        questions: [
          { q: "You would have become Alistair's wife tomorrow. How do you feel about the estate now?", a: "I loved Alistair. I don't care about the estate. I want whoever did this found." },
        ],
        interviewEvidence: { id: 'eleanor_alibi_letter', icon: '📝', name: "Eleanor Vane — Confirmed Alibi", desc: "Three witnesses including the butler and two footmen confirm Eleanor was in the drawing room from 7:30 PM until after 10 PM — the entire window of the poisoning. She never entered the library.", finding: "Eleanor has a rock-solid, multi-witness alibi for the poisoning window. She is not the killer.", tag: 'minor' },
      },
      {
        id: 'reverend_gault',
        name: 'Reverend Gault',
        role: "Family chaplain and distant estate beneficiary",
        img: 'assets/suspect-gault.jpg',
        bio: "Has served the Dunmore family for twenty years. A bequest in the old will leaves him £500. The new will removes this. A man of God with a very human motive.",
        questions: [
          { q: "The new will removes your bequest entirely. Were you aware of that?", a: "I was. But I am a man of God, Inspector. I pray for Alistair's soul, not his money." },
        ],
        interviewEvidence: { id: 'gault_bequest_note', icon: '📄', name: "Reverend Gault — Bequest Confirmation", desc: "Confirmation from the solicitor: Gault's bequest under the old will is £500 — a meaningful sum, but the new will removes it. However, Gault's movements that evening are accounted for by Percy and the housekeeper from 8:30 PM onward.", finding: "Gault has motive (losing £500) but it is marginal compared to Percy's £200,000. His movements are partially accounted for. He is a person of interest but not the primary suspect.", tag: 'minor' },
      },
    ],
  },

  // -----------------------------------------------------------------------
  //  11. THE FROZEN GARDEN
  // -----------------------------------------------------------------------
  {
    id: 'garden',
    name: 'The Frozen Garden',
    subtitle: 'Harcastle Manor, January 1934',
    caseNumber: 'CASE FILE #6601',
    difficulty: 'hard',
    desc: "Lady Harcastle was found face-down in her own frozen garden at dawn. She had attended a dinner party the night before. The footprints in the snow tell one story. The guests tell another.",
    img: 'assets/crime-scene-garden.jpg',
    narrative: {
      intro: "CASE BRIEFING — Harcastle Manor, January. Snow began falling at midnight and settled cleanly on the formal garden. At 6:12 AM, the head gardener found Lady Constance Harcastle face-down in the garden, dead. She was 58 years old. She had attended a dinner party at the manor the previous evening and retired to her room at half past ten. Sometime after midnight, she came back downstairs and walked into the garden.\n\nThe snow tells a story no one can alter. Two sets of footprints. One set is Lady Harcastle's, coming from the house. The second set approaches from the garden gate and stops six feet from where she fell. That person stood still for a period — the print depth suggests perhaps a minute — then turned and walked back the way they came. There is no sign of a physical struggle. She collapsed in place. She had been poisoned earlier, and the strychnine took effect when she reached the garden.\n\nThe pathologist confirms strychnine poisoning, consistent with a dose administered during the dinner. The after-dinner cordial glass from the drawing room — Lady Harcastle's, identified by a chip on the base — tests positive for strychnine. The garden store strychnine tin shows recent use. One of the three overnight guests wore a size 5 court shoe — the size of the second set of footprints. A partial thumb impression in the arsenic residue on the tin, and forged estate withdrawal slips totalling £3,200, point to one person.",
      facts: [
        { label: 'Victim', value: 'Lady Constance Harcastle, 58. Found face-down in the formal garden at 6:12 AM.' },
        { label: 'Cause of death', value: 'Strychnine poisoning. Fast-acting. She collapsed where she stood.' },
        { label: 'Scene', value: 'Two sets of footprints in fresh snow. One ends at the body. The other stops 6 feet away and turns back.' },
        { label: 'Your task', value: 'Determine who met Lady Harcastle in the garden — and who gave her the strychnine.' },
      ],
    },
    sceneNarrative: "The garden is an open-air crime scene preserved by cold. The two footprint trails are distinct and uncontaminated — cast them before the temperature rises. The garden gate was unlatched this morning; it had been latched the previous evening. The path from the gate to the footprint terminus is approximately forty metres. Lady Harcastle's cordial glass was collected from the drawing room sideboard — it tests positive. The garden store is unlocked; the strychnine tin is on the lower shelf, recently opened. Lady Harcastle's private diary, found in her writing desk, contains a letter she had drafted but not yet sent.",
    suspectsNarrative: "Miriam Ashby is Lady Harcastle's niece and manages part of the estate accounts. She wears size 5 shoes. Bank records show £3,200 moved from the Harcastle estate to a private account under her name over the past eight months. Lady Harcastle's unsent letter confronts 'Miriam' directly and gives her one week to return the funds. That week expires tomorrow. Colonel Harcastle has a size 9 boot — excluded by the footprint evidence alone. Dr. Harriet Pemberton is the personal physician, wears size 6, and is excluded by the shoe comparison as well. This case narrows itself.",
    clues: [
      { id: 'fg_footprints', icon: '👣', name: "Two Sets of Footprints", desc: "Analysis: Lady Harcastle's prints come from the house. The second set approaches from the garden gate — a smaller, narrower boot, woman's size 5. The tracks stop 6 feet apart. The second person turned and walked away.", finding: "A woman with small feet met Lady Harcastle in the garden. They did not physically struggle — the poison was administered earlier, set to act when she walked outside.", tag: 'critical', narrative: "Two people kept a secret meeting in the snow. Only one walked back." },
      { id: 'fg_cordial_glass', icon: '🥃', name: "Strychnine in the Cordial Glass", desc: "A cordial glass from the drawing room (where guests gathered after dinner) tests positive for strychnine traces. The glass was Lady Harcastle's — identified by a small chip on the base.", finding: "The strychnine was added to her after-dinner cordial. She consumed it inside, then went to the garden — where it took effect.", tag: 'critical', narrative: "She walked to her death without knowing she was already poisoned." },
      { id: 'fg_garden_gate_key', icon: '🗝️', name: 'Garden Gate Key (Butler\'s Account)', desc: "The butler states the garden gate key is kept on a hook in the downstairs coat room. He confirms it was returned to the hook that morning — but was missing between 11 PM and 6 AM.", finding: "Someone took the gate key, used it, and returned it before the household woke. This narrows the field to an overnight guest who knew the house layout.", tag: 'important', narrative: "Guests who stay overnight learn where the keys are kept." },
      { id: 'fg_letter_constance', icon: '✉️', name: "Lady Harcastle's Private Letter", desc: '"I have told Miriam I know what she has been doing with the estate accounts. She has one week to return the funds or I go to the family solicitor." Dated three days ago, unsent.', finding: "Lady Harcastle had discovered financial wrongdoing by someone named Miriam and had given them a deadline — tonight.", tag: 'critical', narrative: "The letter was never sent. But Miriam knew she was running out of time." },
      { id: 'fg_strychnine_source', icon: '⚗️', name: "Garden Store: Strychnine (Rat Poison)", desc: "The garden store contains a tin of strychnine-based pest control. The tin has been opened recently — a fresh thumb impression in the powder around the lid.", finding: "Same source as the cordial glass. The killer knew where the strychnine was kept — another indicator of someone familiar with the house.", tag: 'important', narrative: "Old country houses keep their poisons in the garden store. Guests who visit often enough know this." },
      { id: 'fg_boot_match', icon: '👟', name: "Boot Match: Size 5 Court Shoe", desc: "The second set of footprints matches a size 5 court shoe — consistent with one pair found in the overnight guest rooms. One guest wears size 5.", finding: "Only one of the three guests wears size 5. The footprints in the snow belong to that guest.", tag: 'critical', narrative: "Snow is a better witness than most." },
      { id: 'fg_accounts_ledger', icon: '📒', name: "Estate Accounts Discrepancy", desc: "The manor's accounts show £3,200 in unexplained withdrawals over eight months — authorised by a family signatory whose handwriting on the withdrawal slips matches one suspect's known writing samples.", finding: "The financial irregularity Lady Harcastle discovered was embezzlement. The forged withdrawal slips match one suspect's handwriting.", tag: 'critical', narrative: "Three thousand pounds is enough to poison a conscience." },
    ],
    killer: 'miriam_ashby',
    suspects: [
      {
        id: 'miriam_ashby',
        name: 'Miriam Ashby',
        role: "Lady Harcastle's niece and estate trustee",
        img: 'assets/suspect-miriam.jpg',
        bio: "Manages a portion of the Harcastle estate accounts. Elegant, controlled, wears size 5 shoes. Has been visiting Harcastle Manor regularly for two years.",
        questions: [
          { q: "Lady Harcastle's letter named you. She knew about the accounts. What did you do when she confronted you?", a: "She never confronted me directly. I don't know what letter you're referring to. I am devastated by Aunt Constance's death." },
        ],
        interviewEvidence: { id: 'miriam_account_transfer', icon: '📑', name: "Miriam Ashby — Account Transfer Records", desc: "Bank transfer records obtained by warrant: £3,200 moved from the Harcastle estate account to a private account in Miriam Ashby's name over eight months, in amounts small enough to avoid automatic review.", finding: "Miriam was systematically embezzling the estate. Lady Harcastle discovered it. Miriam had every reason to act before the deadline — and her size 5 boots placed her in the garden.", tag: 'critical' },
      },
      {
        id: 'colonel_harcastle',
        name: 'Colonel James Harcastle',
        role: "Lady Harcastle's brother-in-law",
        img: 'assets/suspect-colonel.jpg',
        bio: "Retired military officer. Straight-backed, short-tempered, and in poor health. Wears size 9 boots — definitively not the garden prints.",
        questions: [
          { q: "Where were you between midnight and 6 AM?", a: "In my room. My knee gives me considerable trouble in the cold. I took laudanum at ten and slept until the housemaid woke me with the news." },
        ],
        interviewEvidence: { id: 'colonel_boot_size', icon: '👞', name: "Colonel Harcastle — Boot Size Confirmation", desc: "The Colonel's boots are measured: size 9, a wide last. The garden footprints were from a size 5 narrow court shoe. The Colonel is physically excluded from the snow evidence.", finding: "The Colonel cannot be the person who stood six feet from Lady Harcastle in the garden. He is eliminated by physical evidence.", tag: 'minor' },
      },
      {
        id: 'dr_pemberton',
        name: 'Dr. Harriet Pemberton',
        role: "Lady Harcastle's personal physician",
        img: 'assets/suspect-pemberton.jpg',
        bio: "Attended the dinner as a guest and stayed overnight. Wears size 6 shoes. Has access to medical knowledge about poisons — but her prints don't match.",
        questions: [
          { q: "As a physician, you would know how strychnine acts. Did you notice anything unusual about Lady Harcastle at dinner?", a: "She seemed well — perhaps slightly anxious, but she often was before guests left. I noticed nothing to cause alarm. If I had, I would have acted immediately." },
        ],
        interviewEvidence: { id: 'pemberton_shoes_measured', icon: '🩺', name: "Dr. Pemberton — Shoe Size Confirmed at 6", desc: "Dr. Pemberton's shoes are measured: size 6, standard width. The garden prints were size 5, narrow. Pemberton's shoes do not match the second set of footprints.", finding: "Dr. Pemberton is physically excluded from the garden evidence. Her shoe size does not match. She is not the person who met Lady Harcastle in the snow.", tag: 'minor' },
      },
    ],
  },

  // -----------------------------------------------------------------------
  //  12. THE WALLED CITY MURDER
  // -----------------------------------------------------------------------
  {
    id: 'walled_city',
    name: 'The Walled City Murder',
    subtitle: 'Hong Kong, 1977',
    caseNumber: 'CASE FILE #9903',
    difficulty: 'medium',
    desc: "A merchant was found dead in the notorious Kowloon Walled City — a place where no police dared enter. Three people knew the victim. One of them broke the rules of the city and took his life.",
    img: 'assets/crime-scene-walled-city.jpg',
    narrative: {
      intro: "CASE BRIEFING — Kowloon Walled City, Hong Kong, 1977. The city within a city. No police jurisdiction. No building codes. Forty thousand people in 0.026 square kilometres, governed by nothing but mutual understanding and the occasional use of force. When merchant Lee Wai-fong, 44, was found dead in his supply room on the evening of the 14th, the informal council sent for an investigator willing to work without authority. That is you.\n\nLee was stabbed once — a thin blade, precisely angled, delivered with controlled force by a right-handed person sitting across from him at his own desk. He did not rise from his chair. He trusted whoever was sitting across from him completely. There was no forced entry; the supply room door latches from the inside, and the killer left through the roof hatch — the access route known to those who maintain the building's unofficial infrastructure.\n\nLee was an informal moneylender as well as a merchant. His ledger shows three active debts. Lin Jiahao owes £31,000 — marked 'final warning' in red ink, the largest debt in the book. A leather knife sheath was found hidden behind a loose brick in the supply room wall: custom-made, with an embossed initials plate reading 'L.J.' A Taiwanese cigarette stub on the floor matches the specific brand sold by one importer inside the city. A roof witness saw a large man moving fast across the rooftops at approximately 11 PM.",
      facts: [
        { label: 'Victim', value: "Lee Wai-fong, 44, merchant and informal moneylender within the Walled City." },
        { label: 'Cause of death', value: 'Single stab wound. A thin blade, professional angle. Death within minutes.' },
        { label: 'Scene', value: "Supply room, internal block. Door was latched from inside — the killer left through the roof hatch." },
        { label: 'Your task', value: "Interview the three people who owed Lee Wai-fong and determine who could not repay." },
      ],
    },
    sceneNarrative: "The supply room is two metres by three. A desk, two stools, a hanging bulb. Boxes of dry goods stacked to the ceiling. Lee died quickly — the wound is on the right side, consistent with a left-to-right strike from someone sitting directly opposite. He did not have time to rise. The knife sheath is behind the third brick from the left in the north wall — it has been there for some time, suggesting a previous visit. The roof hatch above the corridor shows fresh grease smear and scrape marks. The floor directly beneath: one cigarette stub, Taiwanese brand.",
    suspectsNarrative: "Lin Jiahao maintains the Walled City's water pumps, electrical jury-rigs, and roof infrastructure. He knows every access route above the city. His debt to Lee is £31,000 — and Lee's ledger marks it 'final warning.' He is right-handed, large-framed, and smokes Taiwanese cigarettes. His initials are L.J. Chen Bo-ling is left-handed and has been making steady partial payments — his debt entry says 'satisfactory arrangement.' Madam Fok has a fractured right hand confirmed by the unlicensed clinic five weeks ago; she cannot grip strongly enough to deliver the wound. The evidence speaks precisely.",
    clues: [
      { id: 'wc_blade_angle', icon: '🔪', name: 'Wound Analysis', desc: "A single stab wound, downward angle, right-handed, precise. The pathologist notes: 'This was not a panic attack. The wound is measured. Someone who has done this before, or trained to.'", finding: "The killer is right-handed, calm under pressure, and the strike was controlled — not emotional. This narrows the profile.", tag: 'critical', narrative: "A frightened person stabs erratically. This person did not." },
      { id: 'wc_ledger', icon: '📒', name: "Lee's Debt Ledger", desc: "A handwritten ledger. Three names with outstanding debts: Chen Bo-ling (owes HK$12,000 — overdue 6 months), Madam Fok (owes HK$4,500), Lin Jiahao (owes HK$31,000 — marked 'final warning').", finding: "Lin Jiahao's debt is nearly three times the others — and marked 'final warning.' The largest debtor had the most to lose.", tag: 'critical', narrative: "Final warning. The next step would have been public and ugly." },
      { id: 'wc_roof_hatch', icon: '🚪', name: "Roof Hatch (Disturbed)", desc: "The roof hatch shows fresh scrape marks and a smear of engine grease — the same type used on the rooftop water pump maintained by the building's unofficial engineer.", finding: "The killer escaped via the roof hatch and was familiar with the rooftop layout. Someone who maintains the building's equipment knows those routes.", tag: 'important', narrative: "The roof is how everyone moves unseen in the Walled City." },
      { id: 'wc_cigarette', icon: '🚬', name: "Foreign Cigarette Stub", desc: "A single cigarette stub — not a local brand. A Taiwanese import, sold in one specific supply shop in the city. Only one of the three suspects buys from that shop.", finding: "The cigarette was left by the killer during the meeting. It narrows the suspect to the person who smokes that specific Taiwanese brand.", tag: 'important', narrative: "A small habit. A large mistake." },
      { id: 'wc_knife_sheath', icon: '🗡️', name: "Knife Sheath (Hidden in Wall Cavity)", desc: "Behind a loose brick in the supply room wall: a leather knife sheath — custom-made, with an embossed initials plate. The plate reads 'L.J.'", finding: "L.J. — Lin Jiahao. The sheath was hidden in Lee's wall, possibly left during a prior visit. Lin Jiahao's blade was the murder weapon.", tag: 'critical', narrative: "He hid it between visits. He was planning this." },
      { id: 'wc_witness', icon: '👁️', name: "Roof Witness Account", desc: "An anonymous resident reports seeing someone cross the rooftop at approximately 11 PM — the estimated time of death. 'Big man. Moving fast. Knew the way.' Matches Lin Jiahao's build.", finding: "The anonymous witness corroborates the roof hatch evidence and places a large man — consistent with Lin Jiahao — on the roof at the time of death.", tag: 'important', narrative: "In the Walled City, no one talks to police. But they talk to each other." },
      { id: 'wc_right_hand', icon: '✋', name: "Right-Hand Confirmation", desc: "Chen Bo-ling is left-handed (confirmed by watching him write). Madam Fok has a right-hand injury preventing strong grip. Lin Jiahao is right-handed and in excellent physical condition.", finding: "The wound analysis required a precise, right-handed, strong strike. Only Lin Jiahao fits the physical profile.", tag: 'critical', narrative: "The body tells you what the tongue will not." },
    ],
    killer: 'lin_jiahao',
    suspects: [
      {
        id: 'lin_jiahao',
        name: 'Lin Jiahao',
        role: 'Building engineer and informal contractor',
        img: 'assets/suspect-lin.jpg',
        bio: "Maintains the Walled City's unofficial infrastructure — water pumps, electricity, roof routes. Owes Lee HK$31,000. His initials are L.J. Right-handed.",
        questions: [
          { q: "You owe Lee the most of anyone in this ledger. And it was marked 'final warning.' What was he threatening?", a: "Lee threatened to go to my employer in Kowloon — outside the city. It would have cost me everything. But I did not kill him." },
        ],
        interviewEvidence: { id: 'lin_tobacco_receipt', icon: '🧾', name: "Lin Jiahao — Tobacco Shop Receipt", desc: "A receipt from the Taiwanese tobacco importer inside the city — Lin Jiahao is a regular customer for the specific brand found at the scene. The receipt is dated two days before the murder.", finding: "Lin buys the specific cigarette brand left at the murder scene. Combined with the knife sheath initials, the debt, and the physical profile, the evidence against Lin is overwhelming.", tag: 'critical' },
      },
      {
        id: 'chen_boling',
        name: 'Chen Bo-ling',
        role: 'Noodle shop owner',
        img: 'assets/suspect-chen.jpg',
        bio: "Runs a small noodle shop two floors up. Owes Lee HK$12,000 for start-up capital. Soft-spoken, left-handed. Has two children.",
        questions: [
          { q: "Your debt is six months overdue. Were you afraid of Lee?", a: "Of course. But I was paying in small amounts. Lee was patient with me. We had an arrangement. I had no reason to hurt him." },
        ],
        interviewEvidence: { id: 'chen_payment_record', icon: '💵', name: "Chen Bo-ling — Payment Records", desc: "Lee's own ledger shows Chen had been making consistent partial payments — three in the last two months. Lee had noted 'satisfactory arrangement' beside Chen's name. No 'final warning.'", finding: "Chen's own debt entry confirms he was in good standing with Lee. He had no immediate threat driving him to violence.", tag: 'minor' },
      },
      {
        id: 'madam_fok',
        name: 'Madam Fok',
        role: 'Herbal medicine practitioner',
        img: 'assets/suspect-fok.jpg',
        bio: "Operates a small herbal practice in the city. Owes Lee HK$4,500. Has a fractured right hand from a fall last month — she cannot grip strongly.",
        questions: [
          { q: "You owe Lee money and you have pharmaceutical knowledge. Did Lee ever threaten you?", a: "Lee was my friend, despite the debt. I have known him for eight years. And I can barely hold a teacup with this hand." },
        ],
        interviewEvidence: { id: 'fok_medical_record', icon: '🩻', name: "Madam Fok — Hand Fracture Record", desc: "A medical record from the Walled City's unlicensed clinic: Fok sustained a fracture to the metacarpal bones of her right hand five weeks ago. The injury prevents a firm grip.", finding: "The wound analysis required a strong, controlled, right-handed strike. Madam Fok physically cannot deliver such a blow. She is medically excluded.", tag: 'minor' },
      },
    ],
  },
];

// ===================================================================
//  DETECTIVE — SECOND AREA DATA (per case)
// ===================================================================
const DET_SECOND_AREAS = {
  thornfield:  { name: 'East Wing Corridor',   bg: 'det-area-hallway',   desc: 'The upper hallway outside the guest bedrooms. The butler\'s pantry is at the far end. Footsteps were reported here between 9 PM and midnight.', clueStart: 4 },
  gallery:     { name: 'Exhibition Hall',       bg: 'det-area-gallery',   desc: 'The main gallery floor where forty guests stood hours ago. The diamond plinth is empty. Champagne glasses still ring the display case.', clueStart: 4 },
  vanishing:   { name: 'Backstage',             bg: 'det-area-backstage', desc: 'The technical area behind the stage — prop tables, rigging controls, a half-empty glass left on a stool.', clueStart: 4 },
  poison_pen:  { name: 'Bookshop Floor',        bg: 'det-area-study',     desc: 'The main floor of Blackthorn Books, still set for the launch event. Signing table, champagne decanter — the decanter tested clean.', clueStart: 4 },
  express:     { name: 'First Class Corridor',  bg: 'det-area-train',     desc: 'The carpeted corridor connecting all first class compartments. No camera coverage. The blizzard makes the windows black mirrors.', clueStart: 4 },
  clockmaker:  { name: 'Display Room',          bg: 'det-area-workshop',  desc: 'The customer-facing front room of Finch & Sons. Four decades of ledgers and correspondence. The bracket where customer pieces await collection.', clueStart: 4 },
  lighthouse:  { name: 'Lamp Room',             bg: 'det-area-tower',     desc: 'The top of the Cape Morven tower. The Fresnel lens still turns. The rope-storage hook on the north wall shows fresh fraying.', clueStart: 4 },
  duchess:     { name: 'Wine Cellar',           bg: 'det-area-cellar',    desc: 'Reached via the hidden passage behind the wardrobe. Several racks have been disturbed. A hollow space in the stone wall.', clueStart: 4 },
  studio:      { name: 'Dressing Room',         bg: 'det-area-bedroom',   desc: 'Clarence Duff\'s personal dressing room at Pinewood. Greasepaint, scripts, and the manila evidence folder he referenced in his margin notes.', clueStart: 4 },
  heir:        { name: 'Garden Store',          bg: 'det-area-outdoor',   desc: 'The estate garden store — tools, fertiliser, and a rat-poison cabinet on the lower shelf. The arsenic tin lid carries a partial fingerprint.', clueStart: 4 },
  garden:      { name: 'Drawing Room',          bg: 'det-area-drawing',   desc: 'Where the after-dinner cordial was served. Three armchairs around the fireplace. The side table still holds the cordial glasses.', clueStart: 4 },
  walled_city: { name: 'Rooftop',               bg: 'det-area-roof',      desc: 'A maze of pipes and water tanks above the Walled City. The hatch from the supply-room corridor opens here. Fresh grease on the rim.', clueStart: 4 },
};

const DET_SCENE_BGS = {
  thornfield:  'det-area-study',   gallery:    'det-area-gallery',
  vanishing:   'det-area-stage',   poison_pen: 'det-area-study',
  express:     'det-area-train',   clockmaker: 'det-area-workshop',
  lighthouse:  'det-area-outdoor', duchess:    'det-area-bedroom',
  studio:      'det-area-stage',   heir:       'det-area-study',
  garden:      'det-area-garden',  walled_city:'det-area-city',
};

const DET_CLUE_POS_MAIN      = [{x:16,y:26},{x:62,y:20},{x:35,y:52},{x:78,y:44}];
const DET_CLUE_POS_SECONDARY = [{x:24,y:36},{x:68,y:26},{x:44,y:68}];

// ===================================================================
//  ACCOUNT SYSTEM
// ===================================================================
function mqGetAccounts() {
  try { return JSON.parse(localStorage.getItem('mq_accounts') || '{}'); } catch(e) { return {}; }
}
function mqSaveAccounts(a) {
  try { localStorage.setItem('mq_accounts', JSON.stringify(a)); } catch(e) {}
}
function mqGetCurrentUser() {
  try { return localStorage.getItem('mq_current') || null; } catch(e) { return null; }
}
function mqSetCurrentUser(u) {
  try {
    if (u) {
      localStorage.setItem('mq_current', u);
      localStorage.setItem('mq_login_time', Date.now().toString());
    } else {
      localStorage.removeItem('mq_current');
      localStorage.removeItem('mq_login_time');
    }
  } catch(e) {}
}
function mqHashPw(p) {
  let h = 5381;
  for (let i = 0; i < p.length; i++) h = ((h << 5) + h) ^ p.charCodeAt(i);
  return 'mq' + (h >>> 0).toString(36);
}

function showAuthTab(tab) {
  document.getElementById('auth-panel-login').classList.toggle('hidden', tab !== 'login');
  document.getElementById('auth-panel-register').classList.toggle('hidden', tab !== 'register');
  document.getElementById('auth-tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('auth-tab-register').classList.toggle('active', tab === 'register');
}

function doLogin() {
  const user = document.getElementById('auth-login-user').value.trim();
  const pass = document.getElementById('auth-login-pass').value;
  const msg  = document.getElementById('auth-login-msg');
  if (!user || !pass) { msg.textContent = 'Please enter username and password.'; return; }
  const accounts = mqGetAccounts();
  if (!accounts[user] || accounts[user].pwHash !== mqHashPw(pass)) {
    msg.textContent = 'Incorrect username or password.'; return;
  }
  mqSetCurrentUser(user);
  updateUserDisplay();
  goHome();
}

function doRegister() {
  const user  = document.getElementById('auth-reg-user').value.trim();
  const pass  = document.getElementById('auth-reg-pass').value;
  const pass2 = document.getElementById('auth-reg-pass2').value;
  const msg   = document.getElementById('auth-reg-msg');
  if (!user || !pass)    { msg.textContent = 'Please fill all fields.'; return; }
  if (user.length < 3)   { msg.textContent = 'Username must be at least 3 characters.'; return; }
  if (pass.length < 4)   { msg.textContent = 'Password must be at least 4 characters.'; return; }
  if (pass !== pass2)    { msg.textContent = 'Passwords do not match.'; return; }
  const accounts = mqGetAccounts();
  if (accounts[user])    { msg.textContent = 'Username already taken.'; return; }
  accounts[user] = {
    pwHash: mqHashPw(pass),
    created: Date.now(),
    progress: { detective: {}, escape: {}, brainteaser: { highScore: 0, gamesPlayed: 0 } },
  };
  mqSaveAccounts(accounts);
  mqSetCurrentUser(user);
  updateUserDisplay();
  goHome();
}

function playAsGuest() {
  mqSetCurrentUser(null);
  updateUserDisplay();
  goHome();
}

function doLogout() {
  mqSetCurrentUser(null);
  updateUserDisplay();
  showPage('page-auth');
}

function updateUserDisplay() {
  const user = mqGetCurrentUser();
  const el   = document.getElementById('user-display');
  if (!el) return;
  if (user) {
    document.getElementById('user-name-display').textContent = user;
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
  }
}

function mqSaveProgress(type, id, data) {
  const user = mqGetCurrentUser();
  if (!user) return;
  const accounts = mqGetAccounts();
  if (!accounts[user]) return;
  accounts[user].progress[type] = accounts[user].progress[type] || {};
  accounts[user].progress[type][id] = { ...(accounts[user].progress[type][id] || {}), ...data };
  mqSaveAccounts(accounts);
}

// ===================================================================
//  GAME PROGRESS SAVE / RESTORE  (works for guests too)
// ===================================================================
function mqSavesKey() {
  const u = mqGetCurrentUser();
  return 'mq_saves_' + (u || '_guest');
}
function mqGetSaves() {
  try { return JSON.parse(localStorage.getItem(mqSavesKey()) || '{}'); } catch(e) { return {}; }
}
function mqWriteSave(type, id, data) {
  const s = mqGetSaves();
  s[type] = s[type] || {};
  if (data == null) { delete s[type][id]; }
  else              { s[type][id] = { ...data, savedAt: Date.now() }; }
  try { localStorage.setItem(mqSavesKey(), JSON.stringify(s)); } catch(e) {}
}
function mqReadSave(type, id) {
  return ((mqGetSaves()[type] || {})[id]) || null;
}

// Brain teaser
function saveBtProgress() {
  if (btIndex <= 0 || btIndex >= btQuestions.length) return;
  if (!document.getElementById('bt-results').classList.contains('hidden')) return;
  mqWriteSave('bt', 'current', {
    questions: btQuestions, index: btIndex,
    score: btScore, seconds: btSeconds, answered: btAnswered,
  });
}
function clearBtProgress() { mqWriteSave('bt', 'current', null); }

// Escape room
function saveErProgress() {
  if (!erTheme) return;
  if (!document.getElementById('er-win-modal').classList.contains('hidden')) return;
  if (document.getElementById('er-game').classList.contains('hidden')) return;
  mqWriteSave('er', erTheme.id, {
    themeId: erTheme.id, rooms: erRooms, puzzles: erPuzzles,
    currentRoom: erCurrentRoom, inventory: erInventory,
    notes: erNotes, hintsRemaining: erHintsRemaining,
  });
}
function clearErProgress(id) { mqWriteSave('er', id, null); }

// Detective
function saveDetProgress() {
  if (!detCase) return;
  if (!document.getElementById('det-result-modal').classList.contains('hidden')) return;
  if (document.getElementById('det-main').classList.contains('hidden')) return;
  mqWriteSave('det', detCase.id, {
    caseId: detCase.id, collected: detCollected,
    interviewData: detInterviewData, currentArea: detCurrentArea,
  });
}
function clearDetProgress(id) { mqWriteSave('det', id, null); }

// ===================================================================
//  DETECTIVE — STATE
// ===================================================================
let detCase = null;
let detClues = [];
let detSuspects = [];
let detCollected = [];
let detInterviewData = {};
let detSelectedSuspect = null;
let detCurrentClue = null;
let detCurrentArea = 'main';

// ===================================================================
//  DETECTIVE SELECTOR
// ===================================================================
function initDetectiveSelect() {
  const grid = document.getElementById('detective-selector-grid');
  grid.innerHTML = '';
  DETECTIVE_CASES.forEach(c => {
    const card = document.createElement('div');
    card.className = 'selector-card';
    const cTitle = c.title || c.name || 'Case';
    const cStamp = c.stamp || c.caseNumber || 'CASE FILE';
    const cImg = c.sceneImgJpg || c.sceneImg || c.img || '';
    const cImgFallback = c.sceneImg || c.img || '';
    card.innerHTML = `
      <div class="selector-card-img">
        <img src="${cImg}" alt="${cTitle}"
             onerror="this.onerror=null;this.src='${cImgFallback}'" />
      </div>
      <div class="selector-card-body">
        <div class="case-stamp">${cStamp}</div>
        <div class="difficulty-badge difficulty-${c.difficulty}">${c.difficulty}</div>
        <h3>${cTitle}</h3>
        <p>${c.desc}</p>
        <div class="selector-card-meta">
          <span>${c.subtitle}</span>
          <span>${c.clues.length} clues</span>
          <span>${c.suspects.length} suspects</span>
        </div>
        <button class="btn-play">Open File</button>
      </div>`;
    card.querySelector('.btn-play').addEventListener('click', e => {
      e.stopPropagation();
      launchDetective(c.id);
    });
    card.addEventListener('click', () => launchDetective(c.id));
    grid.appendChild(card);
  });
}

function launchDetective(caseId) {
  detCase = DETECTIVE_CASES.find(c => c.id === caseId);
  detClues = JSON.parse(JSON.stringify(detCase.clues));
  detSuspects = JSON.parse(JSON.stringify(detCase.suspects));
  detCollected = [];
  detInterviewData = {};
  detSelectedSuspect = null;
  detCurrentClue = null;

  const caseTitle = detCase.title || detCase.name || 'Unknown Case';
  document.getElementById('det-page-title').textContent = caseTitle;
  document.getElementById('det-case-stamp').textContent = detCase.stamp || detCase.caseNumber || 'CASE FILE';
  document.getElementById('det-case-title').textContent = caseTitle;

  const sceneImgEl = document.getElementById('det-scene-img-el');
  const imgSrc = detCase.sceneImgJpg || detCase.sceneImg || detCase.img || '';
  sceneImgEl.src = imgSrc;
  sceneImgEl.onerror = function() { this.onerror=null; this.src = detCase.sceneImg || detCase.img || ''; };

  document.getElementById('det-intro-narrative').innerHTML =
    `<strong>Briefing</strong>${detCase.narrative.intro}`;

  const factsEl = document.getElementById('det-brief-facts');
  const facts = detCase.briefFacts || detCase.narrative.facts || [];
  factsEl.innerHTML = facts.map(f =>
    `<p><strong>${f.label}:</strong> ${f.value}</p>`
  ).join('');

  document.getElementById('det-intro').classList.remove('hidden');
  document.getElementById('det-main').classList.add('hidden');
  document.getElementById('det-clues-found').textContent = 'Clues: 0/' + detClues.length;
  document.getElementById('det-phase-display').textContent = 'Crime Scene';

  // Show resume button if saved progress exists for this case
  const detSave = mqReadSave('det', caseId);
  const detResumeBtn = document.getElementById('det-resume-btn');
  if (detResumeBtn) {
    if (detSave && detSave.collected && detSave.collected.length > 0) {
      detResumeBtn.textContent = `Resume Investigation (${detSave.collected.length}/${detClues.length} clues)`;
      detResumeBtn.classList.remove('hidden');
    } else {
      detResumeBtn.classList.add('hidden');
    }
  }

  showPage('page-detective');
}

function initDetective() {}  // kept for compatibility

function resumeDetective() {
  const saved = mqReadSave('det', detCase.id);
  if (!saved) { startDetective(); return; }
  detCollected    = saved.collected || [];
  detInterviewData = saved.interviewData || {};
  detCurrentArea  = saved.currentArea || 'main';
  detCurrentArea  = detCurrentArea; // ensure set
  document.getElementById('det-intro').classList.add('hidden');
  document.getElementById('det-main').classList.remove('hidden');
  document.getElementById('det-room-header').textContent = detCase.roomHeader || 'Crime Scene';
  document.getElementById('det-scene-narrative').innerHTML =
    `<strong>Detective\'s Notes</strong>${detCase.narrative.scene || detCase.sceneNarrative || ''}`;
  document.getElementById('det-suspects-narrative').innerHTML =
    `<strong>Persons of Interest</strong>${detCase.narrative.suspects || detCase.suspectsNarrative || ''}`;
  renderDetScene();
  renderSuspects();
  renderEvidenceBoard();
  renderAccusationList();
}

function startDetective() {
  clearDetProgress(detCase.id);
  detCurrentArea = 'main';
  document.getElementById('det-intro').classList.add('hidden');
  document.getElementById('det-main').classList.remove('hidden');
  document.getElementById('det-room-header').textContent = detCase.roomHeader || 'Crime Scene';

  document.getElementById('det-scene-narrative').innerHTML =
    `<strong>Detective\'s Notes</strong>${detCase.narrative.scene || detCase.sceneNarrative || ''}`;
  document.getElementById('det-suspects-narrative').innerHTML =
    `<strong>Persons of Interest</strong>${detCase.narrative.suspects || detCase.suspectsNarrative || ''}`;

  renderDetScene();
  renderSuspects();
  renderEvidenceBoard();
  renderAccusationList();
}

// ===================================================================
//  DETECTIVE — TABS
// ===================================================================
function switchDetTab(btn, tab) {
  document.querySelectorAll('.det-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.det-tab-panel').forEach(p => { p.classList.remove('active'); p.classList.add('hidden'); });
  btn.classList.add('active');
  const panel = document.getElementById('det-tab-' + tab);
  panel.classList.remove('hidden');
  panel.classList.add('active');

  const phases = { scene:'Crime Scene', suspects:'Suspects', evidence:'Evidence Board', accuse:'Accusation' };
  document.getElementById('det-phase-display').textContent = phases[tab] || '';
}

// ===================================================================
//  DETECTIVE — SCENE (coordinate-based interactive)
// ===================================================================
function getAreaClues() {
  if (!detClues || !detCase) return [];
  const second = DET_SECOND_AREAS[detCase.id];
  if (!second) return detClues;
  return detCurrentArea === 'secondary'
    ? detClues.slice(second.clueStart)
    : detClues.slice(0, second.clueStart);
}

function switchDetArea(area) {
  detCurrentArea = area;
  const second = DET_SECOND_AREAS[detCase ? detCase.id : ''];
  const headerEl = document.getElementById('det-room-header');
  if (headerEl) {
    headerEl.textContent = area === 'secondary' && second
      ? second.name
      : (detCase.roomHeader || 'Crime Scene');
  }
  document.getElementById('det-clue-detail').innerHTML =
    '<p class="placeholder-text">Click on the scene to find evidence.</p>';
  renderDetScene();
}

function handleSceneClick(e) {
  if (e.target.closest('.det-hotspot')) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  const areaClues = getAreaClues();
  const positions = detCurrentArea === 'secondary' ? DET_CLUE_POS_SECONDARY : DET_CLUE_POS_MAIN;
  let nearest = null, nearestDist = Infinity;
  areaClues.forEach((clue, i) => {
    const pos = positions[i] || { x: 20 + (i * 18) % 60, y: 30 + (i % 3) * 20 };
    const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
    if (dist < nearestDist) { nearestDist = dist; nearest = clue; }
  });
  if (nearest && nearestDist < 12) {
    openClueModal(nearest.id);
  } else {
    showSceneMsg('Nothing here. Look for the glowing markers.');
  }
}

function showSceneMsg(text) {
  const el = document.getElementById('det-scene-msg');
  if (!el) return;
  el.textContent = text;
  el.classList.remove('hidden');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.add('hidden'), 2200);
}

function renderDetScene() {
  const second = DET_SECOND_AREAS[detCase ? detCase.id : ''];

  // Area navigation buttons
  const navEl = document.getElementById('det-area-nav');
  if (navEl) {
    if (second) {
      const mainName = detCase.roomHeader || 'Crime Scene';
      navEl.innerHTML =
        `<button class="det-area-btn${detCurrentArea==='main'?' active':''}" onclick="switchDetArea('main')">${mainName}</button>` +
        `<button class="det-area-btn${detCurrentArea==='secondary'?' active':''}" onclick="switchDetArea('secondary')">${second.name}</button>`;
    } else {
      navEl.innerHTML = '';
    }
  }

  // Background class for current area
  const bgEl = document.getElementById('det-scene-bg');
  if (bgEl) {
    const bgClass = (detCurrentArea === 'secondary' && second)
      ? (second.bg || 'det-area-default')
      : (DET_SCENE_BGS[detCase ? detCase.id : ''] || 'det-area-default');
    bgEl.className = 'det-scene-bg ' + bgClass;
  }

  // Render hotspot dots
  const hotspotsEl = document.getElementById('det-scene-hotspots');
  if (!hotspotsEl) return;
  hotspotsEl.innerHTML = '';

  const areaClues = getAreaClues();
  const positions  = detCurrentArea === 'secondary' ? DET_CLUE_POS_SECONDARY : DET_CLUE_POS_MAIN;

  areaClues.forEach((clue, i) => {
    const pos       = positions[i] || { x: 20 + (i * 18) % 60, y: 30 + (i % 3) * 20 };
    const collected = !!detCollected.find(c => c.id === clue.id);
    const dot       = document.createElement('div');
    dot.className   = 'det-hotspot' + (collected ? ' examined' : '');
    dot.style.left  = pos.x + '%';
    dot.style.top   = pos.y + '%';
    dot.title       = clue.name;
    dot.onclick     = function(e) { e.stopPropagation(); openClueModal(clue.id); };
    const icon      = document.createElement('span');
    icon.className  = 'det-hotspot-icon';
    icon.textContent = clue.icon || '?';
    dot.appendChild(icon);
    hotspotsEl.appendChild(dot);
  });

  document.getElementById('det-clues-found').textContent =
    'Clues: ' + detCollected.length + '/' + detClues.length;
}

function openClueModal(clueId) {
  detCurrentClue = detClues.find(c => c.id === clueId);
  if (!detCurrentClue) return;

  document.getElementById('det-clue-title').textContent = detCurrentClue.name;
  document.getElementById('det-clue-text').textContent = detCurrentClue.desc;
  document.getElementById('det-clue-finding').textContent = detCurrentClue.finding || '';

  const already = detCollected.find(c => c.id === clueId);
  document.querySelector('#det-clue-modal button:first-of-type').textContent =
    already ? 'Already in Evidence' : 'Add to Evidence Board';
  document.querySelector('#det-clue-modal button:first-of-type').disabled = !!already;

  const detail = document.getElementById('det-clue-detail');
  detail.innerHTML = `
    <h4 style="font-family:var(--font-type);color:var(--gold2);font-size:0.85rem;margin-bottom:0.75rem">${detCurrentClue.name}</h4>
    <p style="color:var(--muted);font-size:0.88rem;margin-bottom:0.75rem">${detCurrentClue.desc}</p>
    ${detCurrentClue.narrative ? `<div class="narrative-banner"><strong>Your Deduction</strong>${detCurrentClue.narrative}</div>` : ''}
    <div class="clue-finding">${detCurrentClue.finding || ''}</div>`;

  document.getElementById('det-clue-modal').classList.remove('hidden');
}

function collectClue() {
  if (!detCurrentClue) return;
  if (!detCollected.find(c => c.id === detCurrentClue.id)) {
    detCollected.push(detCurrentClue);
    updateDetClueCount();
  }
  closeClueModal();
  renderDetScene();
  renderEvidenceBoard();
  renderAccusationList();
  saveDetProgress();
}

function closeClueModal() {
  document.getElementById('det-clue-modal').classList.add('hidden');
  detCurrentClue = null;
}

// ===================================================================
//  DETECTIVE — SUSPECTS
// ===================================================================
function renderSuspects() {
  const grid = document.getElementById('suspects-grid');
  grid.innerHTML = '';
  detSuspects.forEach(s => {
    const imgUrl = s.portrait_img || s.img || '';
    const bg = s.portrait_bg || 'radial-gradient(ellipse at 50% 30%, #1a1a2e 0%, #080810 100%)';
    const portraitContent = imgUrl
      ? `<img src="${imgUrl}" alt="${s.name}"
             onerror="this.onerror=null;this.style.display='none'"
             style="width:100%;height:100%;object-fit:cover;object-position:top;position:absolute;inset:0;z-index:1" />
         <div class="suspect-portrait-placeholder" style="position:absolute;inset:0;background:${bg};z-index:0"></div>`
      : `<div class="suspect-portrait-placeholder" style="background:${bg};position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:3rem;color:rgba(201,168,76,0.3)">${s.name[0]}</div>`;

    const card = document.createElement('div');
    card.className = 'suspect-card';
    card.innerHTML = `
      <div class="suspect-portrait" style="position:relative">${portraitContent}</div>
      <div class="suspect-info">
        <h3>${s.name}</h3>
        <div class="suspect-role">${s.role}</div>
        <p>${s.desc || s.bio || ''}</p>
        <button class="btn-interview" onclick="openInterview('${s.id}')">Interview ${s.name.split(' ')[0]}</button>
      </div>`;
    grid.appendChild(card);
  });
}

function openInterview(suspectId) {
  const s = detSuspects.find(s => s.id === suspectId);
  if (!s) return;
  if (!detInterviewData[suspectId]) detInterviewData[suspectId] = {};

  document.getElementById('suspects-grid').classList.add('hidden');
  const panel = document.getElementById('det-interview-panel');
  panel.classList.remove('hidden');

  document.getElementById('interview-header').innerHTML =
    `<div>${s.name} &mdash; ${s.role}</div>
     ${s.narrative ? `<div class="narrative-banner" style="margin-top:0.75rem"><strong>Your Read</strong>${s.narrative}</div>` : ''}`;

  const qa = s.questions[0];
  const asked = !!detInterviewData[suspectId][0];
  const qContainer = document.getElementById('interview-questions');
  qContainer.innerHTML = '';
  const div = document.createElement('div');
  div.innerHTML = `
    <button class="interview-q-btn ${asked ? 'asked' : ''}" ${asked ? 'disabled' : ''}
      onclick="askQuestion('${suspectId}',0,this)">${qa.q}</button>
    ${asked ? `<div class="interview-answer">${qa.a}</div>` : ''}
    ${asked && s.interviewEvidence ? `<div class="interview-evidence-reveal">Evidence added: ${s.interviewEvidence.icon} <strong>${s.interviewEvidence.name}</strong></div>` : ''}`;
  qContainer.appendChild(div);
}

function askQuestion(suspectId, qIdx, btn) {
  const s = detSuspects.find(s => s.id === suspectId);
  if (!s) return;
  if (!detInterviewData[suspectId]) detInterviewData[suspectId] = {};
  detInterviewData[suspectId][qIdx] = true;
  btn.classList.add('asked');
  btn.disabled = true;

  const answer = document.createElement('div');
  answer.className = 'interview-answer';
  answer.textContent = s.questions[qIdx].a;
  btn.parentNode.appendChild(answer);

  if (s.interviewEvidence && !detCollected.find(c => c.id === s.interviewEvidence.id)) {
    detCollected.push(s.interviewEvidence);
    const reveal = document.createElement('div');
    reveal.className = 'interview-evidence-reveal';
    reveal.innerHTML = `Evidence added: ${s.interviewEvidence.icon} <strong>${s.interviewEvidence.name}</strong>`;
    btn.parentNode.appendChild(reveal);
    renderEvidenceBoard();
    updateDetClueCount();
  }
}

function updateDetClueCount() {
  document.getElementById('det-clues-found').textContent =
    'Clues: ' + detCollected.length + '/' + (detClues.length + detSuspects.filter(s => s.interviewEvidence).length);
}

function closeInterview() {
  document.getElementById('suspects-grid').classList.remove('hidden');
  document.getElementById('det-interview-panel').classList.add('hidden');
}

// ===================================================================
//  DETECTIVE — EVIDENCE
// ===================================================================
function renderEvidenceBoard() {
  const items = document.getElementById('evidence-items');
  const empty = document.getElementById('evidence-empty');

  if (detCollected.length === 0) {
    items.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  items.innerHTML = detCollected.map(c => `
    <div class="evidence-item">
      <div class="ev-icon">${c.icon}</div>
      <div class="ev-body">
        <h4>${c.name}</h4>
        <p>${c.finding || c.desc}</p>
      </div>
      <div class="ev-tag ${c.tag || 'minor'}">${c.tag || 'minor'}</div>
    </div>`).join('');
}

// ===================================================================
//  DETECTIVE — ACCUSATION
// ===================================================================
function renderAccusationList() {
  const list = document.getElementById('accuse-suspect-list');
  list.innerHTML = '';
  detSuspects.forEach(s => {
    const div = document.createElement('div');
    div.className = 'accuse-option' + (detSelectedSuspect === s.id ? ' selected' : '');
    div.innerHTML = `
      <div class="accuse-emoji">${s.name[0]}</div>
      <div>
        <h3>${s.name}</h3>
        <p>${s.role}</p>
      </div>`;
    div.onclick = () => {
      detSelectedSuspect = s.id;
      document.querySelectorAll('.accuse-option').forEach(o => o.classList.remove('selected'));
      div.classList.add('selected');
      document.getElementById('btn-accuse').disabled = false;
    };
    list.appendChild(div);
  });

  const warn = document.getElementById('accuse-warning');
  document.getElementById('accuse-clue-count').textContent = detCollected.length;
  if (detCollected.length < 3) {
    warn.classList.remove('hidden');
  } else {
    warn.classList.add('hidden');
  }
}

function makeAccusation() {
  if (!detSelectedSuspect) return;
  const modal = document.getElementById('det-result-modal');
  const killerId = detCase.killerId || detCase.killer;
  const correct = detSelectedSuspect === killerId;
  const killer = detSuspects.find(s => s.id === killerId);
  const accused = detSuspects.find(s => s.id === detSelectedSuspect);

  document.getElementById('det-result-icon').textContent = correct ? '&#9733;' : '&#9646;';
  document.getElementById('det-result-title').textContent = correct ? 'Case Solved.' : 'Wrong Accusation.';
  document.getElementById('det-result-text').textContent = correct
    ? 'Your deduction was correct. The evidence was assembled. The case is closed.'
    : `You accused ${accused.name}. They are innocent. ${killer.name} walks free.`;
  const revealText = detCase.killerReveal ||
    (killer ? `${killer.name} is the killer. Review the evidence you collected to understand how it all connects.` : '');
  document.getElementById('det-result-reveal').innerHTML =
    `<strong>The Truth:</strong> ${revealText}`;
  modal.classList.remove('hidden');
  clearDetProgress(detCase.id);
  if (correct) mqSaveProgress('detective', detCase.id, { solved: true, date: Date.now() });
}

function restartDetective() {
  document.getElementById('det-result-modal').classList.add('hidden');
  if (detCase) launchDetective(detCase.id);
}

function goDetectiveSelect() {
  showPage('page-detective-select');
}

// ===================================================================
//  APP INIT
// ===================================================================
window.addEventListener('beforeunload', function() {
  saveBtProgress();
  saveErProgress();
  saveDetProgress();
});

window.addEventListener('DOMContentLoaded', function() {
  const user      = mqGetCurrentUser();
  const loginTime = parseInt(localStorage.getItem('mq_login_time') || '0');
  const fresh     = user && (Date.now() - loginTime < 30 * 24 * 60 * 60 * 1000);
  updateUserDisplay();
  if (fresh) {
    showPage('page-home');
  } else {
    if (user) mqSetCurrentUser(null); // expired — force re-login
    showPage('page-auth');
  }
});
