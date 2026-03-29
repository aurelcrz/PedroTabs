const tabList = document.querySelector('#tab-list');
const tabTitle = document.querySelector('#tab-title');
const tabContent = document.querySelector('#tab-content');
const searchInput = document.querySelector('#search');
const tabsToggle = document.querySelector('#tabs-toggle');
const tabsContent = document.querySelector('#tabs-content');
const menuDrawer = document.querySelector('#menu-drawer');
const menuToggle = document.querySelector('#menu-toggle');
const menuBackdrop = document.querySelector('#menu-backdrop');
const headerActions = document.querySelector('#header-actions');
const remoteImportButton = document.querySelector('#remote-import-button');
const remoteImportStatus = document.querySelector('#remote-import-status');
const viewer = document.querySelector('.viewer');
const readingModeToggle = document.querySelector('#reading-mode-toggle');
const sceneModeToggle = document.querySelector('#scene-mode-toggle');
const scrollToggle = document.querySelector('#scroll-toggle');
const scrollReset = document.querySelector('#scroll-reset');
const scrollSpeed = document.querySelector('#scroll-speed');
const scrollSpeedValue = document.querySelector('#scroll-speed-value');
const scrollSpeedDown = document.querySelector('#scroll-speed-down');
const scrollSpeedUp = document.querySelector('#scroll-speed-up');
const viewerSpeedFloat = document.querySelector('#viewer-speed-float');
const viewerSpeedValue = document.querySelector('#viewer-speed-value');
const viewerSpeedDown = document.querySelector('#viewer-speed-down');
const viewerSpeedUp = document.querySelector('#viewer-speed-up');
const toolsToggle = document.querySelector('#tools-toggle');
const toolsContent = document.querySelector('#tools-content');
const transposeDown = document.querySelector('#transpose-down');
const transposeUp = document.querySelector('#transpose-up');
const transposeValue = document.querySelector('#transpose-value');
const transposeStatus = document.querySelector('#transpose-status');
const chordToggle = document.querySelector('#chord-toggle');
const chordContent = document.querySelector('#chord-content');
const chordSearchInput = document.querySelector('#chord-search');
const chordList = document.querySelector('#chord-list');
const tunerStart = document.querySelector('#tuner-start');
const tunerStop = document.querySelector('#tuner-stop');
const tunerStatus = document.querySelector('#tuner-status');
const tunerNote = document.querySelector('#tuner-note');
const tunerFrequency = document.querySelector('#tuner-frequency');
const tunerCents = document.querySelector('#tuner-cents');
const tunerMeterFill = document.querySelector('#tuner-meter-fill');
const tunerStringButtons = Array.from(document.querySelectorAll('.tuner-string'));
const metronomeBpm = document.querySelector('#metronome-bpm');
const metronomeBpmValue = document.querySelector('#metronome-bpm-value');
const metronomeBeats = document.querySelector('#metronome-beats');
const metronomeToggle = document.querySelector('#metronome-toggle');
const metronomeTap = document.querySelector('#metronome-tap');
const metronomeBeatIndicator = document.querySelector('#metronome-beat-indicator');
const cacheAllTabsButton = document.querySelector('#cache-all-tabs');
const clearOfflineCacheButton = document.querySelector('#clear-offline-cache');
const offlineStatus = document.querySelector('#offline-status');
const concertPlanner = document.querySelector('#concert-planner');
const concertPlannerToggle = document.querySelector('#concert-planner-toggle');
const concertPlannerClose = document.querySelector('#concert-planner-close');
const concertDrawerSummary = document.querySelector('#concert-drawer-summary');
const concertSearchInput = document.querySelector('#concert-search');
const concertLibraryList = document.querySelector('#concert-library-list');
const concertLibraryCount = document.querySelector('#concert-library-count');
const concertSetlist = document.querySelector('#concert-setlist');
const concertSetlistCount = document.querySelector('#concert-setlist-count');
const concertStatus = document.querySelector('#concert-status');
const concertStart = document.querySelector('#concert-start');
const concertShare = document.querySelector('#concert-share');
const concertClear = document.querySelector('#concert-clear');
const tabStage = document.querySelector('#tab-stage');
const sceneSetlistFloat = document.querySelector('#scene-setlist-float');
const sceneSetlistLabel = document.querySelector('#scene-setlist-label');
const scenePrev = document.querySelector('#scene-prev');
const sceneNext = document.querySelector('#scene-next');
const concertShareModal = document.querySelector('#concert-share-modal');
const concertShareClose = document.querySelector('#concert-share-close');
const concertShareStatus = document.querySelector('#concert-share-status');
const concertShareQr = document.querySelector('#concert-share-qr');
const concertShareLink = document.querySelector('#concert-share-link');
const concertCopyLink = document.querySelector('#concert-copy-link');
const chordModal = document.querySelector('#chord-modal');
const chordModalClose = document.querySelector('#chord-modal-close');
const chordModalTitle = document.querySelector('#chord-modal-title');
const chordModalSubtitle = document.querySelector('#chord-modal-subtitle');
const chordModalPrev = document.querySelector('#chord-modal-prev');
const chordModalNext = document.querySelector('#chord-modal-next');
const chordModalVariantLabel = document.querySelector('#chord-modal-variant-label');
const chordModalNotes = document.querySelector('#chord-modal-notes');
const chordModalFamily = document.querySelector('#chord-modal-family');
const chordModalFormula = document.querySelector('#chord-modal-formula');
const chordModalShapeLabel = document.querySelector('#chord-modal-shape-label');
const chordModalShape = document.querySelector('#chord-modal-shape');
const chordModalFingers = document.querySelector('#chord-modal-fingers');
const chordModalAliases = document.querySelector('#chord-modal-aliases');
const chordPlayStrum = document.querySelector('#chord-play-strum');
const chordPlayArpeggio = document.querySelector('#chord-play-arpeggio');

let allTabs = [];
let activeFile = null;
let activeTabText = '';
let autoScrollFrame = null;
let lastFrameTime = 0;
let isAutoScrolling = false;
let scrollMode = 'viewer';
let scrollCarry = 0;
let isMenuOpen = false;
let isTabsSectionOpen = true;
let isReadingMode = false;
let isSceneMode = false;
let tunerAudioContext = null;
let tunerAnalyser = null;
let tunerSource = null;
let tunerStream = null;
let tunerFrame = null;
let tunerStableFrequency = null;
let transposeAmount = 0;
let metronomeAudioContext = null;
let metronomeInterval = null;
let metronomeBeat = 0;
let tapTempoTimes = [];
let isConcertPlannerOpen = false;
let isConcertShareOpen = false;
let isChordModalOpen = false;
let concertPlan = [];
let concertPlanFilter = '';
let concertPlanIndex = -1;
let chordAudioContext = null;
let activeModalChord = null;
let activeModalChordVariantIndex = 0;
let appConfig = {
  features: {
    remoteImport: false
  }
};
const tunerReferenceStrings = [
  { note: 'E2', frequency: 82.41 },
  { note: 'A2', frequency: 110.0 },
  { note: 'D3', frequency: 146.83 },
  { note: 'G3', frequency: 196.0 },
  { note: 'B3', frequency: 246.94 },
  { note: 'E4', frequency: 329.63 }
];
const tunerMinFrequency = 70;
const tunerMaxFrequency = 370;
const mobileChordWrapBreakpoint = 760;
const favoriteOpenChordNames = [
  'C', 'D', 'Dm', 'E', 'Em', 'F', 'G', 'A', 'Am',
  'A7', 'C7', 'D7', 'E7', 'G7', 'Dsus2', 'Dsus4', 'Asus2', 'Asus4'
];
const settingsStorageKey = 'pedrotabs-settings';
const lastTabStorageKey = 'pedrotabs-last-tab';
const cachedTabsStorageKey = 'pedrotabs-cached-tabs';
const cachedTabContentStorageKey = 'pedrotabs-cached-tab-content';
const concertPlanStorageKey = 'pedrotabs-concert-plan';
const concertPlanQueryKey = 'setlist';
const noteMap = [
  { primary: 'C', aliases: ['B#'], eFret: 8, aFret: 3 },
  { primary: 'Db', aliases: ['C#'], eFret: 9, aFret: 4 },
  { primary: 'D', aliases: [], eFret: 10, aFret: 5 },
  { primary: 'Eb', aliases: ['D#'], eFret: 11, aFret: 6 },
  { primary: 'E', aliases: ['Fb'], eFret: 0, aFret: 7 },
  { primary: 'F', aliases: ['E#'], eFret: 1, aFret: 8 },
  { primary: 'Gb', aliases: ['F#'], eFret: 2, aFret: 9 },
  { primary: 'G', aliases: [], eFret: 3, aFret: 10 },
  { primary: 'Ab', aliases: ['G#'], eFret: 4, aFret: 11 },
  { primary: 'A', aliases: [], eFret: 5, aFret: 0 },
  { primary: 'Bb', aliases: ['A#'], eFret: 6, aFret: 1 },
  { primary: 'B', aliases: ['Cb'], eFret: 7, aFret: 2 }
];
const semitoneScale = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const noteAliases = {
  'B#': 'C',
  'C#': 'Db',
  'D#': 'Eb',
  'E#': 'F',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb',
  'Cb': 'B',
  'Fb': 'E'
};
const chordTokenPattern = /(^|[^A-Za-z0-9])([A-G](?:#|b)?)(maj7|maj9|maj|min|m13|m11|m9|m7b5|m7|m6|m|sus2|sus4|sus|add9|add11|add13|dim7|dim|aug|13|11|9|7|6|5|4|2)?(?:\/([A-G](?:#|b)?))?(?=$|[^A-Za-z0-9])/g;
const standardTuningFrequencies = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63];
const openStringNotes = {
  E: 'E',
  A: 'A',
  D: 'D',
  G: 'G',
  B: 'B',
  e: 'E'
};

const chordTypes = [
  {
    suffix: '',
    family: 'Majeur',
    formula: '1 - 3 - 5',
    shapes: [
      { label: 'Forme de Mi', root: 'E', frets: [0, 2, 2, 1, 0, 0], fingers: '134211' },
      { label: 'Forme de La', root: 'A', frets: ['x', 0, 2, 2, 2, 0], fingers: 'x13331' },
      { label: 'Forme de Do', rootString: 'A', rootBaseFret: 3, frets: ['x', 3, 2, 0, 1, 0], fingers: 'x32010' },
      { label: 'Forme de Sol', rootString: 'E', rootBaseFret: 3, frets: [3, 2, 0, 0, 0, 3], fingers: '210003' },
      { label: 'Forme de Re', rootString: 'D', rootBaseFret: 0, frets: ['x', 'x', 0, 2, 3, 2], fingers: 'xx0132' }
    ]
  },
  {
    suffix: 'm',
    family: 'Mineur',
    formula: '1 - b3 - 5',
    shapes: [
      { label: 'Forme de Mi', root: 'E', frets: [0, 2, 2, 0, 0, 0], fingers: '134111' },
      { label: 'Forme de La', root: 'A', frets: ['x', 0, 2, 2, 1, 0], fingers: 'x13421' },
      { label: 'Forme de Re mineur', rootString: 'D', rootBaseFret: 0, frets: ['x', 'x', 0, 2, 3, 1], fingers: 'xx0231' }
    ]
  },
  {
    suffix: '5',
    family: 'Power chord',
    formula: '1 - 5',
    shapes: [
      { label: 'Power 6e corde', root: 'E', frets: [0, 2, 2, 'x', 'x', 'x'], fingers: '134xxx' },
      { label: 'Power 5e corde', root: 'A', frets: ['x', 0, 2, 2, 'x', 'x'], fingers: 'x134xx' }
    ]
  },
  {
    suffix: '6',
    family: 'Sixte',
    formula: '1 - 3 - 5 - 6',
    shapes: [
      { label: 'Forme de Mi', root: 'E', frets: [0, 2, 2, 1, 2, 0], fingers: '134121' },
      { label: 'Forme de La', root: 'A', frets: ['x', 0, 2, 2, 2, 2], fingers: 'x13444' },
      { label: 'Forme de Do6', rootString: 'A', rootBaseFret: 3, frets: ['x', 3, 2, 2, 1, 0], fingers: 'x32010' }
    ]
  },
  {
    suffix: 'm6',
    family: 'Mineur 6',
    formula: '1 - b3 - 5 - 6',
    shapes: [
      { label: 'Forme de Mi', root: 'E', frets: [0, 2, 2, 0, 2, 0], fingers: '134141' },
      { label: 'Forme de La', root: 'A', frets: ['x', 0, 2, 2, 1, 2], fingers: 'x13424' }
    ]
  },
  {
    suffix: '7',
    family: 'Septieme',
    formula: '1 - 3 - 5 - b7',
    shapes: [
      { label: 'Forme de Mi', root: 'E', frets: [0, 2, 0, 1, 0, 0], fingers: '020100' },
      { label: 'Forme de La', root: 'A', frets: ['x', 0, 2, 0, 2, 0], fingers: 'x02030' },
      { label: 'Forme de Do7', rootString: 'A', rootBaseFret: 3, frets: ['x', 3, 2, 3, 1, 0], fingers: 'x32310' },
      { label: 'Forme de Sol7', rootString: 'E', rootBaseFret: 3, frets: [3, 2, 0, 0, 0, 1], fingers: '210001' },
      { label: 'Forme de Re7', rootString: 'D', rootBaseFret: 0, frets: ['x', 'x', 0, 2, 1, 2], fingers: 'xx0213' }
    ]
  },
  {
    suffix: 'maj7',
    family: 'Maj7',
    formula: '1 - 3 - 5 - 7',
    shapes: [
      { label: 'Forme de Mi', root: 'E', frets: [0, 2, 1, 1, 0, 0], fingers: '032211' },
      { label: 'Forme de La', root: 'A', frets: ['x', 0, 2, 1, 2, 0], fingers: 'x03140' },
      { label: 'Forme de DoMaj7', rootString: 'A', rootBaseFret: 3, frets: ['x', 3, 2, 0, 0, 0], fingers: 'x32000' },
      { label: 'Forme de SolMaj7', rootString: 'E', rootBaseFret: 3, frets: [3, 2, 0, 0, 0, 2], fingers: '210004' },
      { label: 'Forme de ReMaj7', rootString: 'D', rootBaseFret: 0, frets: ['x', 'x', 0, 2, 2, 2], fingers: 'xx0111' }
    ]
  },
  {
    suffix: 'm7',
    family: 'Mineur 7',
    formula: '1 - b3 - 5 - b7',
    shapes: [
      { label: 'Forme de Mi', root: 'E', frets: [0, 2, 0, 0, 0, 0], fingers: '020000' },
      { label: 'Forme de La', root: 'A', frets: ['x', 0, 2, 0, 1, 0], fingers: 'x02010' },
      { label: 'Forme de Re mineur7', rootString: 'D', rootBaseFret: 0, frets: ['x', 'x', 0, 2, 1, 1], fingers: 'xx0211' }
    ]
  },
  {
    suffix: 'sus2',
    family: 'Suspendu 2',
    formula: '1 - 2 - 5',
    shapes: [
      { label: 'Forme de Mi', root: 'E', frets: [0, 2, 4, 4, 2, 2], fingers: '013341' },
      { label: 'Forme de La', root: 'A', frets: ['x', 0, 2, 2, 0, 0], fingers: 'x01300' },
      { label: 'Forme de Re sus2', rootString: 'D', rootBaseFret: 0, frets: ['x', 'x', 0, 2, 3, 0], fingers: 'xx0230' }
    ]
  },
  {
    suffix: 'sus4',
    family: 'Suspendu 4',
    formula: '1 - 4 - 5',
    shapes: [
      { label: 'Forme de Mi', root: 'E', frets: [0, 2, 2, 2, 0, 0], fingers: '134211' },
      { label: 'Forme de La', root: 'A', frets: ['x', 0, 2, 2, 3, 0], fingers: 'x13341' },
      { label: 'Forme de Do sus4', rootString: 'A', rootBaseFret: 3, frets: ['x', 3, 3, 0, 1, 1], fingers: 'x33011' },
      { label: 'Forme de Sol sus4', rootString: 'E', rootBaseFret: 3, frets: [3, 3, 0, 0, 1, 3], fingers: '340013' },
      { label: 'Forme de Re sus4', rootString: 'D', rootBaseFret: 0, frets: ['x', 'x', 0, 2, 3, 3], fingers: 'xx0234' }
    ]
  },
  {
    suffix: 'add9',
    family: 'Add9',
    formula: '1 - 3 - 5 - 9',
    shapes: [
      { label: 'Forme de Mi', root: 'E', frets: [0, 2, 2, 1, 2, 0], fingers: '134121' },
      { label: 'Forme de La', root: 'A', frets: ['x', 0, 2, 2, 0, 0], fingers: 'x01300' },
      { label: 'Forme de Do add9', rootString: 'A', rootBaseFret: 3, frets: ['x', 3, 2, 0, 3, 0], fingers: 'x32040' },
      { label: 'Forme de Sol add9', rootString: 'E', rootBaseFret: 3, frets: [3, 'x', 0, 0, 0, 3], fingers: '2x0004' }
    ]
  },
  {
    suffix: '9',
    family: 'Neuvieme',
    formula: '1 - 3 - 5 - b7 - 9',
    shapes: [
      { label: 'Forme de Mi', root: 'E', frets: [0, 2, 0, 1, 2, 2], fingers: '020134' },
      { label: 'Forme de La', root: 'A', frets: ['x', 0, 2, 0, 2, 2], fingers: 'x02034' }
    ]
  },
  {
    suffix: 'dim',
    family: 'Diminue',
    formula: '1 - b3 - b5',
    shapes: [
      { label: 'Forme de Mi', root: 'E', frets: [0, 1, 2, 0, 2, 0], fingers: '013024' },
      { label: 'Forme de La', root: 'A', frets: ['x', 0, 1, 2, 1, 'x'], fingers: 'x0123x' }
    ]
  },
  {
    suffix: 'aug',
    family: 'Augmente',
    formula: '1 - 3 - #5',
    shapes: [
      { label: 'Forme de Mi', root: 'E', frets: [0, 3, 2, 1, 1, 0], fingers: '042311' },
      { label: 'Forme de La', root: 'A', frets: ['x', 0, 3, 2, 2, 1], fingers: 'x04231' }
    ]
  },
  {
    suffix: '7sus4',
    family: 'Septieme sus4',
    formula: '1 - 4 - 5 - b7',
    shapes: [
      { label: 'Forme de Mi', root: 'E', frets: [0, 2, 0, 2, 0, 0], fingers: '020300' },
      { label: 'Forme de La', root: 'A', frets: ['x', 0, 2, 0, 3, 0], fingers: 'x02040' }
    ]
  }
];

const stringLabels = ['E', 'A', 'D', 'G', 'B', 'e'];

function formatAbsoluteFrets(shape, rootFret) {
  return shape.frets.map((value) => {
    if (value === 'x') {
      return 'x';
    }

    return String(rootFret + value);
  });
}

function formatDiagram(absoluteFrets) {
  return stringLabels
    .map((label, index) => `${label}|-${absoluteFrets[index]}-`)
    .reverse()
    .join('\n');
}

function buildAliases(note, suffix) {
  return note.aliases.map((alias) => `${alias}${suffix}`);
}

function getTargetRootFret(noteName, stringName) {
  const openNote = openStringNotes[stringName];
  const noteIndex = semitoneScale.indexOf(normalizeNoteName(noteName));
  const openIndex = semitoneScale.indexOf(openNote);
  if (noteIndex === -1 || openIndex === -1) {
    return 0;
  }

  return (noteIndex - openIndex + semitoneScale.length) % semitoneScale.length;
}

function buildShapeVariants(note, type) {
  return type.shapes
    .map((shape) => {
      let rootFret = shape.root === 'E' ? note.eFret : note.aFret;
      let absoluteFrets = formatAbsoluteFrets(shape, rootFret);

      if (shape.rootString) {
        const targetRootFret = getTargetRootFret(note.primary, shape.rootString);
        let shift = targetRootFret - shape.rootBaseFret;

        while (shape.frets.some((value) => value !== 'x' && value + shift < 0)) {
          shift += 12;
        }

        rootFret = shape.rootBaseFret + shift;
        absoluteFrets = shape.frets.map((value) => (value === 'x' ? 'x' : String(value + shift)));
      }

      const numericFrets = absoluteFrets
        .filter((value) => value !== 'x')
        .map((value) => Number(value));

      return {
        ...shape,
        rootFret,
        absoluteFrets,
        maxFret: Math.max(...numericFrets),
        span: Math.max(...numericFrets) - Math.min(...numericFrets)
      };
    })
    .sort((left, right) => {
      if (left.maxFret !== right.maxFret) {
        return left.maxFret - right.maxFret;
      }

      if (left.rootFret !== right.rootFret) {
        return left.rootFret - right.rootFret;
      }

      return left.span - right.span;
    })
    .filter((shape, index, shapes) =>
      shapes.findIndex((candidate) => candidate.absoluteFrets.join(' ') === shape.absoluteFrets.join(' ')) === index
    )
    .map((shape, index) => ({
      index,
      label: shape.label,
      absoluteFrets: shape.absoluteFrets,
      shape: shape.absoluteFrets.join(' '),
      fingers: shape.fingers.split('').join(' '),
      fingerPattern: shape.fingers,
      notes: formatDiagram(shape.absoluteFrets)
    }));
}

function createChordDictionary() {
  return noteMap.flatMap((note) =>
    chordTypes.map((type) => {
      const variants = buildShapeVariants(note, type);
      const bestShape = variants[0];
      const name = `${note.primary}${type.suffix}`;

      return {
        name,
        aliases: buildAliases(note, type.suffix),
        family: type.family,
        formula: type.formula,
        variants,
        shapeLabel: bestShape.label,
        absoluteFrets: bestShape.absoluteFrets,
        shape: bestShape.absoluteFrets.join(' '),
        fingers: bestShape.fingers.split('').join(' '),
        fingerPattern: bestShape.fingers,
        notes: formatDiagram(bestShape.absoluteFrets),
        isFavoriteOpen: favoriteOpenChordNames.includes(name),
        searchText: [
          name,
          ...buildAliases(note, type.suffix),
          type.family,
          type.formula
        ].join(' ').toLowerCase()
      };
    })
  );
}

const chordDictionary = createChordDictionary();
const chordDictionaryLookup = new Map();

chordDictionary.forEach((chord) => {
  chordDictionaryLookup.set(chord.name.toLowerCase(), chord);
  chord.aliases.forEach((alias) => {
    chordDictionaryLookup.set(alias.toLowerCase(), chord);
  });
});

function populateChordDetails(targets, chord, variantIndex = 0) {
  const safeIndex = Math.max(0, Math.min(chord.variants.length - 1, variantIndex));
  const variant = chord.variants[safeIndex];

  targets.family.innerHTML = `<strong>Type</strong> ${chord.family}`;
  targets.formula.innerHTML = `<strong>Formule</strong> ${chord.formula}`;
  targets.shapeLabel.innerHTML = `<strong>Forme</strong> ${variant.label}`;
  targets.shape.innerHTML = `<strong>Position</strong> ${variant.shape}`;
  targets.fingers.innerHTML = `<strong>Doigtes</strong> ${variant.fingers}`;
  targets.notes.textContent = variant.notes;

  if (targets.aliases) {
    targets.aliases.classList.toggle('is-hidden', chord.aliases.length === 0);
    targets.aliases.innerHTML = chord.aliases.length > 0
      ? `<strong>Alias</strong> ${chord.aliases.join(', ')}`
      : '<strong>Alias</strong> Aucun';
  }

  if (targets.variantLabel) {
    targets.variantLabel.textContent = `Forme ${safeIndex + 1}/${chord.variants.length}`;
  }

  if (targets.prevButton) {
    targets.prevButton.disabled = chord.variants.length <= 1 || safeIndex === 0;
  }

  if (targets.nextButton) {
    targets.nextButton.disabled = chord.variants.length <= 1 || safeIndex >= chord.variants.length - 1;
  }
}

function createChordCard(chord) {
  const card = document.createElement('article');
  card.className = 'chord-card';
  card.dataset.variantIndex = '0';

  const titleRow = document.createElement('div');
  titleRow.className = 'chord-card-header';

  const title = document.createElement('h3');
  title.textContent = chord.name;
  titleRow.appendChild(title);

  const nav = document.createElement('div');
  nav.className = 'chord-variant-nav';

  const prevButton = document.createElement('button');
  prevButton.type = 'button';
  prevButton.textContent = '←';
  prevButton.setAttribute('aria-label', `Forme precedente pour ${chord.name}`);

  const variantLabel = document.createElement('strong');
  variantLabel.className = 'chord-variant-label';

  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.textContent = '→';
  nextButton.setAttribute('aria-label', `Forme suivante pour ${chord.name}`);

  nav.append(prevButton, variantLabel, nextButton);
  titleRow.appendChild(nav);
  card.appendChild(titleRow);

  if (chord.isFavoriteOpen) {
    const badge = document.createElement('p');
    badge.className = 'chord-badge';
    badge.textContent = 'Accord ouvert classique';
    card.appendChild(badge);
  }

  const aliases = document.createElement('p');
  aliases.className = 'chord-aliases';
  if (chord.aliases.length === 0) {
    aliases.classList.add('is-hidden');
  }

  const family = document.createElement('p');
  family.className = 'chord-family';
  const formula = document.createElement('p');
  formula.className = 'chord-formula';
  const shapeLabel = document.createElement('p');
  shapeLabel.className = 'chord-shape-label';
  const shape = document.createElement('p');
  shape.className = 'chord-shape';
  const fingers = document.createElement('p');
  fingers.className = 'chord-fingers';
  const notes = document.createElement('pre');
  notes.className = 'chord-notes';

  card.append(aliases, family, formula, shapeLabel, shape, fingers, notes);

  const applyVariant = (nextIndex) => {
    card.dataset.variantIndex = String(nextIndex);
    populateChordDetails({
      aliases,
      family,
      formula,
      shapeLabel,
      shape,
      fingers,
      notes,
      variantLabel,
      prevButton,
      nextButton
    }, chord, nextIndex);
  };

  prevButton.addEventListener('click', () => {
    const currentIndex = Number(card.dataset.variantIndex || '0');
    applyVariant(currentIndex - 1);
  });

  nextButton.addEventListener('click', () => {
    const currentIndex = Number(card.dataset.variantIndex || '0');
    applyVariant(currentIndex + 1);
  });

  applyVariant(0);
  return card;
}

function renderChordDictionary(query = '') {
  const normalizedQuery = query.trim().toLowerCase();
  const chords = chordDictionary
    .filter((chord) => chord.searchText.includes(normalizedQuery))
    .sort((left, right) => {
      if (left.isFavoriteOpen !== right.isFavoriteOpen) {
        return left.isFavoriteOpen ? -1 : 1;
      }

      return left.name.localeCompare(right.name);
    });

  chordList.innerHTML = '';

  if (chords.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'chord-empty';
    empty.textContent = 'Aucun accord trouve.';
    chordList.appendChild(empty);
    return;
  }

  chords.forEach((chord) => {
    chordList.appendChild(createChordCard(chord));
  });
}

function normalizeNoteName(note) {
  return noteAliases[note] || note;
}

function transposeNote(note, amount) {
  const normalized = normalizeNoteName(note);
  const index = semitoneScale.indexOf(normalized);
  if (index === -1) {
    return note;
  }

  const nextIndex = (index + amount + semitoneScale.length) % semitoneScale.length;
  return semitoneScale[nextIndex];
}

function transposeChordToken(token, amount) {
  return token.replace(chordTokenPattern, (match, prefix, root, suffix, bass) => {
    const nextRoot = transposeNote(root, amount);
    const nextBass = bass ? `/${transposeNote(bass, amount)}` : '';
    return `${prefix}${nextRoot}${suffix || ''}${nextBass}`;
  });
}

function transposeTabText(text, amount) {
  if (!amount) {
    return text;
  }

  return text
    .split('\n')
    .map((line) => {
      if (!/[A-G]/.test(line)) {
        return line;
      }

      return transposeChordToken(line, amount);
    })
    .join('\n');
}

function updateTransposeUi() {
  const prefix = transposeAmount > 0 ? '+' : '';
  transposeValue.textContent = `${prefix}${transposeAmount}`;

  if (transposeAmount === 0) {
    transposeStatus.textContent = 'Affichage original.';
  } else {
    transposeStatus.textContent = `Affichage transpose ${prefix}${transposeAmount} demi-ton${Math.abs(transposeAmount) > 1 ? 's' : ''}.`;
  }
}

function isChordLine(line) {
  const trimmed = line.trim();
  if (!trimmed) {
    return false;
  }

  const tokens = trimmed.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return false;
  }

  return tokens.every((token) => /^(?:[A-G](?:#|b)?(?:maj7|maj9|maj|min|m13|m11|m9|m7b5|m7|m6|m|sus2|sus4|sus|add9|add11|add13|dim7|dim|aug|13|11|9|7|6|5|4|2)?(?:\/[A-G](?:#|b)?)?|\||\/|N\.C\.|NC|\(x\d+\)|x\d+)$/i.test(token));
}

function isLyricLine(line) {
  const trimmed = line.trim();
  return Boolean(trimmed) && !isChordLine(trimmed);
}

function isNotationLine(line) {
  const trimmed = line.trim();
  if (!trimmed) {
    return false;
  }

  return /^(?:[eBGDAE]\|.*|[eBGDAE]-.*|[eBGDAE]\s*\|.*)/.test(trimmed) ||
    (/[\-|]{6,}/.test(trimmed) && /[eBGDAE]/.test(trimmed));
}

function measureCharactersPerLine() {
  if (window.innerWidth > mobileChordWrapBreakpoint) {
    return null;
  }

  const styles = window.getComputedStyle(tabContent);
  const canvas = measureCharactersPerLine.canvas || (measureCharactersPerLine.canvas = document.createElement('canvas'));
  const context = canvas.getContext('2d');
  context.font = `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
  const charWidth = context.measureText('M').width || 8;
  const availableWidth = Math.max(120, tabContent.clientWidth || viewer.clientWidth || 320);
  return Math.max(18, Math.floor(availableWidth / charWidth) - 1);
}

function wrapSingleLine(line, limit) {
  if (!limit || line.length <= limit) {
    return [line];
  }

  const parts = [];
  let start = 0;

  while (start < line.length) {
    let end = Math.min(line.length, start + limit);
    if (end < line.length) {
      const slice = line.slice(start, end);
      const breakIndex = slice.lastIndexOf(' ');
      if (breakIndex >= Math.floor(limit * 0.55)) {
        end = start + breakIndex + 1;
      }
    }

    parts.push(line.slice(start, end).trimEnd());
    start = end;
  }

  return parts;
}

function wrapChordPair(chordLine, lyricLine, limit) {
  if (!limit) {
    return [chordLine, lyricLine];
  }

  const output = [];
  const totalLength = Math.max(chordLine.length, lyricLine.length);
  let start = 0;

  while (start < totalLength) {
    let end = Math.min(totalLength, start + limit);
    if (end < totalLength) {
      const lyricSlice = lyricLine.slice(start, end);
      const breakIndex = lyricSlice.lastIndexOf(' ');
      if (breakIndex >= Math.floor(limit * 0.55)) {
        end = start + breakIndex + 1;
      }
    }

    output.push(chordLine.slice(start, end).trimEnd());
    output.push(lyricLine.slice(start, end).trimEnd());
    start = end;
  }

  return output;
}

function formatTabForViewport(text) {
  const limit = measureCharactersPerLine();
  if (!limit) {
    return text;
  }

  const lines = text.split('\n');
  const formatted = [];

  for (let index = 0; index < lines.length; index += 1) {
    const currentLine = lines[index];
    const nextLine = lines[index + 1];

    if (isChordLine(currentLine) && typeof nextLine === 'string' && isLyricLine(nextLine)) {
      formatted.push(...wrapChordPair(currentLine, nextLine, limit));
      index += 1;
      continue;
    }

    formatted.push(...wrapSingleLine(currentLine, limit));
  }

  return formatted.join('\n');
}

function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function renderClickableChordLine(line) {
  let lastIndex = 0;
  let rendered = '';
  chordTokenPattern.lastIndex = 0;
  let match = chordTokenPattern.exec(line);

  while (match) {
    const [matchedText, prefix, root, suffix = '', bass] = match;
    const tokenStart = match.index + prefix.length;
    const tokenText = `${root}${suffix}${bass ? `/${bass}` : ''}`;
    rendered += escapeHtml(line.slice(lastIndex, tokenStart));
    rendered += `<button class="inline-chord-button" type="button" data-chord="${escapeHtml(tokenText)}">${escapeHtml(tokenText)}</button>`;
    lastIndex = tokenStart + tokenText.length;
    match = chordTokenPattern.exec(line);
  }

  rendered += escapeHtml(line.slice(lastIndex));
  return rendered;
}

function renderFormattedTextChunk(text) {
  const formatted = formatTabForViewport(text);
  return formatted
    .split('\n')
    .map((line) => (isChordLine(line) ? renderClickableChordLine(line) : escapeHtml(line)))
    .join('\n');
}

function renderNotationBlock(lines) {
  return lines
    .map((line) => (isChordLine(line) ? renderClickableChordLine(line) : escapeHtml(line)))
    .join('\n');
}

function normalizeChordToken(token) {
  return token.trim().replace(/\s+/g, '');
}

function resolveChordEntry(token) {
  const cleaned = normalizeChordToken(token);
  const direct = chordDictionaryLookup.get(cleaned.toLowerCase());
  if (direct) {
    return { chord: direct, requestedName: cleaned, bass: null };
  }

  const [baseName, bass] = cleaned.split('/');
  const baseChord = chordDictionaryLookup.get((baseName || '').toLowerCase());
  if (baseChord) {
    return { chord: baseChord, requestedName: cleaned, bass: bass || null };
  }

  return null;
}

function setChordModalVisibility(isVisible) {
  isChordModalOpen = isVisible;
  chordModal.classList.toggle('is-hidden', !isVisible);
  chordModal.setAttribute('aria-hidden', String(!isVisible));
  document.body.classList.toggle('chord-modal-open', isVisible);
  if (!isVisible) {
    activeModalChord = null;
  }
}

function updateChordModal(chordToken) {
  const resolved = resolveChordEntry(chordToken);
  if (!resolved) {
    return false;
  }

  activeModalChord = resolved;
  activeModalChordVariantIndex = 0;
  chordModalTitle.textContent = resolved.requestedName;
  chordModalSubtitle.textContent = resolved.bass
    ? `Affichage base ${resolved.chord.name} avec basse ${resolved.bass}.`
    : 'Diagramme et ecoute';
  populateChordDetails({
    aliases: chordModalAliases,
    family: chordModalFamily,
    formula: chordModalFormula,
    shapeLabel: chordModalShapeLabel,
    shape: chordModalShape,
    fingers: chordModalFingers,
    notes: chordModalNotes,
    variantLabel: chordModalVariantLabel,
    prevButton: chordModalPrev,
    nextButton: chordModalNext
  }, resolved.chord, activeModalChordVariantIndex);
  setChordModalVisibility(true);
  return true;
}

function getChordFrequencies(variant) {
  return variant.absoluteFrets.map((fret, index) => {
    if (fret === 'x') {
      return null;
    }

    return standardTuningFrequencies[index] * (2 ** (Number(fret) / 12));
  });
}

function ensureChordAudioContext() {
  if (!chordAudioContext) {
    chordAudioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (chordAudioContext.state === 'suspended') {
    chordAudioContext.resume();
  }

  return chordAudioContext;
}

function playChord(variant, arpeggio = false) {
  const context = ensureChordAudioContext();
  const frequencies = getChordFrequencies(variant);
  const now = context.currentTime;
  const order = arpeggio ? [0, 1, 2, 3, 4, 5] : [0, 1, 2, 3, 4, 5];

  order.forEach((index, orderIndex) => {
    const frequency = frequencies[index];
    if (!frequency) {
      return;
    }

    const start = now + (arpeggio ? orderIndex * 0.14 : orderIndex * 0.04);
    const duration = arpeggio ? 1.85 : 1.25;
    const bodyGain = context.createGain();
    const brightnessGain = context.createGain();
    const masterGain = context.createGain();
    const bodyOscillator = context.createOscillator();
    const brightnessOscillator = context.createOscillator();
    const lowpass = context.createBiquadFilter();
    const highpass = context.createBiquadFilter();

    bodyOscillator.type = 'triangle';
    bodyOscillator.frequency.setValueAtTime(frequency, start);
    bodyOscillator.detune.setValueAtTime(index * 1.8, start);

    brightnessOscillator.type = 'sine';
    brightnessOscillator.frequency.setValueAtTime(frequency * 2, start);
    brightnessOscillator.detune.setValueAtTime(-index * 2.2, start);

    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(arpeggio ? 2500 : 2200, start);
    lowpass.Q.setValueAtTime(0.8, start);

    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(70, start);

    bodyGain.gain.setValueAtTime(0.0001, start);
    bodyGain.gain.linearRampToValueAtTime(arpeggio ? 0.11 : 0.085, start + 0.018);
    bodyGain.gain.exponentialRampToValueAtTime(0.0012, start + duration * 0.78);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    brightnessGain.gain.setValueAtTime(0.0001, start);
    brightnessGain.gain.linearRampToValueAtTime(arpeggio ? 0.03 : 0.022, start + 0.01);
    brightnessGain.gain.exponentialRampToValueAtTime(0.0001, start + duration * 0.28);

    masterGain.gain.setValueAtTime(1, start);

    bodyOscillator.connect(bodyGain);
    brightnessOscillator.connect(brightnessGain);
    bodyGain.connect(lowpass);
    brightnessGain.connect(lowpass);
    lowpass.connect(highpass);
    highpass.connect(masterGain);
    masterGain.connect(context.destination);

    bodyOscillator.start(start);
    brightnessOscillator.start(start);
    bodyOscillator.stop(start + duration);
    brightnessOscillator.stop(start + duration * 0.45);
  });
}

function buildRenderedTabHtml(text) {
  const lines = text.split('\n');
  const parts = [];
  const textBuffer = [];
  let index = 0;

  function flushTextBuffer() {
    if (textBuffer.length === 0) {
      return;
    }

    const chunk = textBuffer.join('\n');
    parts.push(`<pre class="tab-text-block">${renderFormattedTextChunk(chunk)}</pre>`);
    textBuffer.length = 0;
  }

  while (index < lines.length) {
    const currentLine = lines[index];
    const nextLine = lines[index + 1];

    if (isChordLine(currentLine) && typeof nextLine === 'string' && isNotationLine(nextLine)) {
      flushTextBuffer();
      const notationLines = [currentLine];
      let notationIndex = index + 1;
      while (notationIndex < lines.length && isNotationLine(lines[notationIndex])) {
        notationLines.push(lines[notationIndex]);
        notationIndex += 1;
      }
      parts.push(`<div class="tab-notation-block"><pre class="tab-notation-pre">${renderNotationBlock(notationLines)}</pre></div>`);
      index = notationIndex;
      continue;
    }

    if (isNotationLine(currentLine)) {
      flushTextBuffer();
      const notationLines = [currentLine];
      let notationIndex = index + 1;
      while (notationIndex < lines.length && isNotationLine(lines[notationIndex])) {
        notationLines.push(lines[notationIndex]);
        notationIndex += 1;
      }
      parts.push(`<div class="tab-notation-block"><pre class="tab-notation-pre">${renderNotationBlock(notationLines)}</pre></div>`);
      index = notationIndex;
      continue;
    }

    textBuffer.push(currentLine);
    index += 1;
  }

  flushTextBuffer();
  return parts.join('');
}

function renderActiveTabText() {
  if (!activeTabText) {
    return;
  }

  const transposed = transposeTabText(activeTabText, transposeAmount);
  tabContent.innerHTML = buildRenderedTabHtml(transposed);
}

function setTransposeAmount(nextAmount) {
  transposeAmount = Math.max(-11, Math.min(11, nextAmount));
  updateTransposeUi();
  renderActiveTabText();
  persistSettings();
}

function setChordDictionaryVisibility(isVisible) {
  chordContent.classList.toggle('is-hidden', !isVisible);
  chordToggle.textContent = isVisible ? 'Masquer le dictionnaire' : 'Afficher le dictionnaire';
  chordToggle.setAttribute('aria-expanded', String(isVisible));
  chordToggle.classList.toggle('is-open', isVisible);
  persistSettings();
}

function setMenuVisibility(isVisible) {
  isMenuOpen = isVisible;
  menuDrawer.classList.toggle('is-hidden', !isVisible);
  menuBackdrop.classList.toggle('is-hidden', !isVisible);
  menuToggle.setAttribute('aria-expanded', String(isVisible));
  menuToggle.classList.toggle('is-open', isVisible);
  document.body.classList.toggle('menu-open', isVisible);
  persistSettings();
}

function setToolsVisibility(isVisible) {
  toolsContent.classList.toggle('is-hidden', !isVisible);
  toolsToggle.setAttribute('aria-expanded', String(isVisible));
  toolsToggle.classList.toggle('is-open', isVisible);

  if (!isVisible) {
    stopTuner();
    stopMetronome();
  }

  persistSettings();
}

function setTabsSectionVisibility(isVisible) {
  isTabsSectionOpen = isVisible;
  tabsContent.classList.toggle('is-hidden', !isVisible);
  tabsToggle.setAttribute('aria-expanded', String(isVisible));
  tabsToggle.classList.toggle('is-open', isVisible);
  persistSettings();
}

function encodeConcertPlan(items) {
  const indices = items
    .map((fileName) => allTabs.indexOf(fileName))
    .filter((index) => index >= 0)
    .map((index) => index.toString(36));

  return indices.join('.');
}

function decodeConcertPlan(value) {
  if (!value) {
    return [];
  }

  if (value.includes('.')) {
    return value
      .split('.')
      .map((chunk) => Number.parseInt(chunk, 36))
      .filter((index) => Number.isInteger(index) && index >= 0 && index < allTabs.length)
      .map((index) => allTabs[index]);
  }

  try {
    const padded = value.replace(/-/g, '+').replace(/_/g, '/');
    const normalized = padded + '='.repeat((4 - (padded.length % 4 || 4)) % 4);
    const json = decodeURIComponent(escape(atob(normalized)));
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string' && item.trim()) : [];
  } catch (error) {
    return [];
  }
}

function getConcertShareUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete(concertPlanQueryKey);

  if (concertPlan.length > 0) {
    url.searchParams.set(concertPlanQueryKey, encodeConcertPlan(concertPlan));
  }

  return url.toString();
}

function setConcertShareVisibility(isVisible) {
  isConcertShareOpen = isVisible;
  concertShareModal.classList.toggle('is-hidden', !isVisible);
  concertShareModal.setAttribute('aria-hidden', String(!isVisible));
  document.body.classList.toggle('concert-share-open', isVisible);
}

async function copyConcertShareLink() {
  if (!concertShareLink.value) {
    return;
  }

  try {
    await navigator.clipboard.writeText(concertShareLink.value);
    concertShareStatus.textContent = 'Lien copie.';
  } catch (error) {
    concertShareLink.focus();
    concertShareLink.select();
    concertShareStatus.textContent = 'Copie manuelle : maintiens puis copie le lien.';
  }
}

function updateConcertShareUi() {
  if (concertPlan.length === 0) {
    concertShare.disabled = true;
    return;
  }

  concertShare.disabled = false;

  if (!isConcertShareOpen) {
    return;
  }

  const shareUrl = getConcertShareUrl();
  concertShareLink.value = shareUrl;
  concertShareStatus.textContent = 'Scanne ce QR code pour recuperer la setlist sur mobile.';
  concertShareQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(shareUrl)}`;
  concertShareQr.onerror = () => {
    concertShareStatus.textContent = 'QR code indisponible. Utilise le bouton Copier le lien.';
  };
}

function importConcertPlanFromUrl() {
  const url = new URL(window.location.href);
  const encodedPlan = url.searchParams.get(concertPlanQueryKey);
  if (!encodedPlan) {
    return false;
  }

  const importedPlan = decodeConcertPlan(encodedPlan).filter((fileName) => allTabs.includes(fileName));
  if (importedPlan.length === 0) {
    return false;
  }

  concertPlan = importedPlan;
  concertPlanIndex = 0;
  persistConcertPlan();
  renderConcertPlanner();

  url.searchParams.delete(concertPlanQueryKey);
  window.history.replaceState({}, '', url.toString());
  return true;
}

function updateConcertDrawerSummary() {
  if (concertPlan.length === 0) {
    concertDrawerSummary.textContent = 'Aucun morceau dans la setlist.';
    return;
  }

  concertDrawerSummary.textContent = `${concertPlan.length} morceau(x) prets pour le concert.`;
}

function updateSceneSetlistUi() {
  const hasPlan = concertPlan.length > 0 && concertPlanIndex >= 0 && concertPlanIndex < concertPlan.length;
  const shouldShow = hasPlan && isSceneMode;
  sceneSetlistFloat.classList.toggle('is-hidden', !shouldShow);

  if (!hasPlan) {
    sceneSetlistLabel.textContent = 'Set';
    scenePrev.disabled = true;
    sceneNext.disabled = true;
    return;
  }

  sceneSetlistLabel.textContent = `${concertPlanIndex + 1}/${concertPlan.length}`;
  scenePrev.disabled = concertPlanIndex <= 0;
  sceneNext.disabled = concertPlanIndex >= concertPlan.length - 1;
}

function renderConcertLibrary() {
  const normalizedQuery = concertPlanFilter.trim().toLowerCase();
  const visibleTabs = allTabs.filter((fileName) =>
    labelFromFileName(fileName).toLowerCase().includes(normalizedQuery)
  );

  concertLibraryList.innerHTML = '';
  concertLibraryCount.textContent = String(visibleTabs.length);

  if (visibleTabs.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'concert-empty';
    emptyItem.textContent = 'Aucune tablature trouvee.';
    concertLibraryList.appendChild(emptyItem);
    return;
  }

  visibleTabs.forEach((fileName) => {
    const item = document.createElement('li');
    item.className = 'concert-library-item';

    const openButton = document.createElement('button');
    openButton.type = 'button';
    openButton.className = 'concert-library-open';
    openButton.textContent = labelFromFileName(fileName);
    if (fileName === activeFile) {
      openButton.classList.add('active');
    }
    openButton.addEventListener('click', async () => {
      await loadTab(fileName);
      renderConcertPlanner();
    });

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'concert-add-button';
    addButton.textContent = '+';
    addButton.setAttribute('aria-label', `Ajouter ${labelFromFileName(fileName)} a la setlist`);
    addButton.addEventListener('click', () => {
      concertPlan.push(fileName);
      if (concertPlanIndex < 0) {
        concertPlanIndex = 0;
      }
      persistConcertPlan();
      renderConcertPlanner();
    });

    item.append(openButton, addButton);
    concertLibraryList.appendChild(item);
  });
}

function renderConcertSetlist() {
  concertSetlist.innerHTML = '';
  concertSetlistCount.textContent = String(concertPlan.length);
  updateConcertDrawerSummary();

  if (concertPlan.length === 0) {
    concertStatus.textContent = 'Ajoute les morceaux dans l ordre voulu.';
    const emptyItem = document.createElement('li');
    emptyItem.className = 'concert-empty';
    emptyItem.textContent = 'Ta setlist est vide.';
    concertSetlist.appendChild(emptyItem);
    updateSceneSetlistUi();
    return;
  }

  const activeIndex = concertPlan.indexOf(activeFile);
  concertStatus.textContent = activeIndex >= 0
    ? `Morceau actuel : ${activeIndex + 1} sur ${concertPlan.length}.`
    : `${concertPlan.length} morceau(x) dans la setlist.`;

  concertPlan.forEach((fileName, index) => {
    const item = document.createElement('li');
    item.className = 'concert-setlist-item';
    if (fileName === activeFile) {
      item.classList.add('is-active');
    }

    const titleButton = document.createElement('button');
    titleButton.type = 'button';
    titleButton.className = 'concert-setlist-title';
    titleButton.textContent = `${index + 1}. ${labelFromFileName(fileName)}`;
    titleButton.addEventListener('click', async () => {
      concertPlanIndex = index;
      persistConcertPlan();
      await loadTab(fileName);
      renderConcertPlanner();
    });

    const controls = document.createElement('div');
    controls.className = 'concert-setlist-controls';

    const upButton = document.createElement('button');
    upButton.type = 'button';
    upButton.textContent = '↑';
    upButton.disabled = index === 0;
    upButton.setAttribute('aria-label', 'Monter le morceau');
    upButton.addEventListener('click', () => {
      const moved = concertPlan[index];
      concertPlan.splice(index, 1);
      concertPlan.splice(index - 1, 0, moved);
      if (concertPlanIndex === index) {
        concertPlanIndex -= 1;
      } else if (concertPlanIndex === index - 1) {
        concertPlanIndex += 1;
      }
      persistConcertPlan();
      renderConcertPlanner();
    });

    const downButton = document.createElement('button');
    downButton.type = 'button';
    downButton.textContent = '↓';
    downButton.disabled = index === concertPlan.length - 1;
    downButton.setAttribute('aria-label', 'Descendre le morceau');
    downButton.addEventListener('click', () => {
      const moved = concertPlan[index];
      concertPlan.splice(index, 1);
      concertPlan.splice(index + 1, 0, moved);
      if (concertPlanIndex === index) {
        concertPlanIndex += 1;
      } else if (concertPlanIndex === index + 1) {
        concertPlanIndex -= 1;
      }
      persistConcertPlan();
      renderConcertPlanner();
    });

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = '×';
    removeButton.setAttribute('aria-label', 'Retirer le morceau');
    removeButton.addEventListener('click', () => {
      concertPlan.splice(index, 1);
      if (concertPlan.length === 0) {
        concertPlanIndex = -1;
      } else if (concertPlanIndex > index) {
        concertPlanIndex -= 1;
      } else if (concertPlanIndex >= concertPlan.length) {
        concertPlanIndex = concertPlan.length - 1;
      }
      persistConcertPlan();
      renderConcertPlanner();
    });

    controls.append(upButton, downButton, removeButton);
    item.append(titleButton, controls);
    concertSetlist.appendChild(item);
  });

  updateSceneSetlistUi();
}

function renderConcertPlanner() {
  renderConcertLibrary();
  renderConcertSetlist();
  updateConcertShareUi();
}

function setConcertPlannerVisibility(isVisible) {
  isConcertPlannerOpen = isVisible;
  if (isVisible && isMenuOpen) {
    setMenuVisibility(false);
  }
  concertPlanner.classList.toggle('is-hidden', !isVisible);
  tabStage.classList.toggle('is-hidden', isVisible);
  concertPlannerToggle.textContent = isVisible ? 'Fermer' : 'Ouvrir';
  concertPlannerToggle.setAttribute('aria-expanded', String(isVisible));
  document.body.classList.toggle('concert-planner-open', isVisible);
  persistSettings();
}

async function loadConcertPlanEntry(index, options = {}) {
  if (index < 0 || index >= concertPlan.length) {
    return;
  }

  concertPlanIndex = index;
  persistConcertPlan();
  await loadTab(concertPlan[index]);
  renderConcertPlanner();

  if (options.sceneMode) {
    setConcertPlannerVisibility(false);
    if (!isSceneMode) {
      setSceneMode(true);
      await syncFullscreenState(true);
    }
  }
}

function getSavedSettings() {
  try {
    const raw = localStorage.getItem(settingsStorageKey);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

function getLastOpenedTab() {
  try {
    return localStorage.getItem(lastTabStorageKey) || '';
  } catch (error) {
    return '';
  }
}

function persistLastOpenedTab(fileName) {
  try {
    if (fileName) {
      localStorage.setItem(lastTabStorageKey, fileName);
    }
  } catch (error) {
    // Ignore storage errors.
  }
}

function getCachedTabs() {
  try {
    const raw = localStorage.getItem(cachedTabsStorageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function persistCachedTabs(tabFiles) {
  try {
    localStorage.setItem(cachedTabsStorageKey, JSON.stringify(tabFiles));
  } catch (error) {
    // Ignore storage errors.
  }
}

function getCachedTabContent() {
  try {
    const raw = localStorage.getItem(cachedTabContentStorageKey);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    return {};
  }
}

function persistCachedTabContent(fileName, text) {
  try {
    const cached = getCachedTabContent();
    cached[fileName] = text;
    localStorage.setItem(cachedTabContentStorageKey, JSON.stringify(cached));
  } catch (error) {
    // Ignore storage errors.
  }
}

function setOfflineStatus(message, isError = false) {
  offlineStatus.textContent = message;
  offlineStatus.style.color = isError ? '#9f3a20' : '';
}

function getSavedConcertPlan() {
  try {
    const raw = localStorage.getItem(concertPlanStorageKey);
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      items: Array.isArray(parsed.items) ? parsed.items.filter((item) => typeof item === 'string' && item.trim()) : [],
      index: Number.isInteger(parsed.index) ? parsed.index : -1
    };
  } catch (error) {
    return { items: [], index: -1 };
  }
}

function persistConcertPlan() {
  try {
    localStorage.setItem(concertPlanStorageKey, JSON.stringify({
      items: concertPlan,
      index: concertPlanIndex
    }));
  } catch (error) {
    // Ignore storage errors.
  }
}

function persistSettings() {
  try {
    localStorage.setItem(settingsStorageKey, JSON.stringify({
      scrollSpeed: Number(scrollSpeed.value),
      lastTab: activeFile,
      tabsOpen: isTabsSectionOpen,
      toolsOpen: !toolsContent.classList.contains('is-hidden'),
      chordOpen: !chordContent.classList.contains('is-hidden'),
      readingMode: isReadingMode,
      sceneMode: isSceneMode,
      concertPlannerOpen: isConcertPlannerOpen,
      transposeAmount,
      metronomeBpm: Number(metronomeBpm.value),
      metronomeBeats: Number(metronomeBeats.value)
    }));
  } catch (error) {
    // Ignore local storage errors.
  }
}

async function syncFullscreenState(enable) {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
  const target = document.documentElement;

  if (enable && !fullscreenElement) {
    try {
      if (target.requestFullscreen) {
        await target.requestFullscreen();
      } else if (target.webkitRequestFullscreen) {
        target.webkitRequestFullscreen();
      }
    } catch (error) {
      // Keep CSS mode even if fullscreen is denied.
    }
    return;
  }

  if (!enable && fullscreenElement) {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    } catch (error) {
      // Ignore exit errors.
    }
  }
}

function setReadingMode(isEnabled) {
  isReadingMode = isEnabled;
  if (isEnabled && isSceneMode) {
    setSceneMode(false);
  }
  if (isEnabled && isConcertPlannerOpen) {
    setConcertPlannerVisibility(false);
  }
  if (isEnabled && isMenuOpen) {
    setMenuVisibility(false);
  }
  document.body.classList.toggle('reading-mode', isEnabled);
  readingModeToggle.textContent = isEnabled ? '\u2715' : '\u26F6';
  readingModeToggle.title = isEnabled ? 'Quitter le mode lecture' : 'Mode lecture';
  readingModeToggle.setAttribute('aria-label', isEnabled ? 'Quitter le mode lecture' : 'Mode lecture');
  readingModeToggle.classList.toggle('is-reading', isEnabled);
  updateSceneSetlistUi();
  persistSettings();
}

function setSceneMode(isEnabled) {
  isSceneMode = isEnabled;
  if (isEnabled && isReadingMode) {
    setReadingMode(false);
  }
  if (isEnabled && isConcertPlannerOpen) {
    setConcertPlannerVisibility(false);
  }
  if (isEnabled && isMenuOpen) {
    setMenuVisibility(false);
  }
  document.body.classList.toggle('scene-mode', isEnabled);
  sceneModeToggle.textContent = isEnabled ? '\u2715' : '\u25D5';
  sceneModeToggle.title = isEnabled ? 'Quitter le mode scene' : 'Mode scene';
  sceneModeToggle.setAttribute('aria-label', isEnabled ? 'Quitter le mode scene' : 'Mode scene');
  sceneModeToggle.classList.toggle('is-scene', isEnabled);
  updateSceneSetlistUi();
  persistSettings();
}

function noteFromFrequency(frequency) {
  const midi = Math.round(69 + 12 * Math.log2(frequency / 440));
  const noteNames = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
  const noteName = noteNames[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  const referenceFrequency = 440 * Math.pow(2, (midi - 69) / 12);
  const cents = 1200 * Math.log2(frequency / referenceFrequency);
  return {
    note: `${noteName}${octave}`,
    referenceFrequency,
    cents
  };
}

function findClosestString(frequency) {
  return tunerReferenceStrings.reduce((best, current) => {
    const bestDiff = Math.abs(best.frequency - frequency);
    const currentDiff = Math.abs(current.frequency - frequency);
    return currentDiff < bestDiff ? current : best;
  });
}

function updateTunerStringHighlight(targetNote) {
  tunerStringButtons.forEach((button) => {
    button.classList.toggle('is-target', button.dataset.note === targetNote);
  });
}

function updateTunerDisplay(frequency) {
  if (!frequency || Number.isNaN(frequency)) {
    tunerNote.textContent = '--';
    tunerFrequency.textContent = '-- Hz';
    tunerCents.textContent = '-- cents';
    tunerMeterFill.style.left = '50%';
    updateTunerStringHighlight('');
    return;
  }

  const detected = noteFromFrequency(frequency);
  const closestString = findClosestString(frequency);
  const cents = 1200 * Math.log2(frequency / closestString.frequency);
  const clampedLeft = Math.max(4, Math.min(96, 50 + cents));

  tunerNote.textContent = detected.note;
  tunerFrequency.textContent = `${frequency.toFixed(2)} Hz`;
  tunerCents.textContent = `${cents >= 0 ? '+' : ''}${cents.toFixed(1)} cents`;
  tunerMeterFill.style.left = `${clampedLeft}%`;
  updateTunerStringHighlight(closestString.note);

  if (Math.abs(cents) < 5) {
    tunerStatus.textContent = `${closestString.note} est accordee.`;
  } else if (cents < 0) {
    tunerStatus.textContent = `${closestString.note} est trop basse. Monte un peu.`;
  } else {
    tunerStatus.textContent = `${closestString.note} est trop haute. Redescends un peu.`;
  }
}

function smoothTunerFrequency(frequency) {
  if (!frequency) {
    tunerStableFrequency = null;
    return null;
  }

  if (!tunerStableFrequency) {
    tunerStableFrequency = frequency;
    return frequency;
  }

  const difference = Math.abs(tunerStableFrequency - frequency);
  if (difference > 35) {
    tunerStableFrequency = frequency;
    return frequency;
  }

  tunerStableFrequency = (tunerStableFrequency * 0.7) + (frequency * 0.3);
  return tunerStableFrequency;
}

function autoCorrelate(buffer, sampleRate) {
  const size = buffer.length;
  const minOffset = Math.floor(sampleRate / tunerMaxFrequency);
  const maxOffset = Math.min(Math.floor(sampleRate / tunerMinFrequency), Math.floor(size / 2));
  let rms = 0;

  for (let i = 0; i < size; i += 1) {
    rms += buffer[i] * buffer[i];
  }

  rms = Math.sqrt(rms / size);
  if (rms < 0.01) {
    return null;
  }

  let start = 0;
  let end = size - 1;
  while (start < size / 2 && Math.abs(buffer[start]) < 0.02) {
    start += 1;
  }
  while (end > size / 2 && Math.abs(buffer[end]) < 0.02) {
    end -= 1;
  }

  const trimmed = buffer.slice(start, end + 1);
  const trimmedSize = trimmed.length;
  let bestOffset = -1;
  let bestCorrelation = 0;
  let previousCorrelation = 1;

  for (let offset = minOffset; offset <= maxOffset; offset += 1) {
    let correlation = 0;
    for (let i = 0; i < trimmedSize - offset; i += 1) {
      correlation += Math.abs(trimmed[i] - trimmed[i + offset]);
    }

    correlation = 1 - (correlation / (trimmedSize - offset));
    if (correlation > 0.88 && correlation > previousCorrelation && correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }

    previousCorrelation = correlation;
  }

  if (bestOffset > 0 && bestCorrelation > 0.9) {
    const frequency = sampleRate / bestOffset;
    if (frequency >= tunerMinFrequency && frequency <= tunerMaxFrequency) {
      return frequency;
    }
  }

  return null;
}

function processTunerFrame() {
  if (!tunerAnalyser || !tunerAudioContext) {
    return;
  }

  const buffer = new Float32Array(tunerAnalyser.fftSize);
  tunerAnalyser.getFloatTimeDomainData(buffer);
  const frequency = autoCorrelate(buffer, tunerAudioContext.sampleRate);
  updateTunerDisplay(smoothTunerFrequency(frequency));
  tunerFrame = requestAnimationFrame(processTunerFrame);
}

async function startTuner() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    tunerStatus.textContent = "Le micro n'est pas disponible sur cet appareil.";
    return;
  }

  try {
    tunerStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    });

    tunerAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    tunerAnalyser = tunerAudioContext.createAnalyser();
    tunerAnalyser.fftSize = 4096;
    tunerAnalyser.smoothingTimeConstant = 0.15;
    tunerSource = tunerAudioContext.createMediaStreamSource(tunerStream);
    tunerSource.connect(tunerAnalyser);

    tunerStatus.textContent = 'Ecoute en cours... joue une corde seule.';
    tunerStart.disabled = true;
    tunerStop.disabled = false;
    processTunerFrame();
  } catch (error) {
    tunerStatus.textContent = "Impossible d'acceder au micro.";
  }
}

function stopTuner() {
  if (tunerFrame) {
    cancelAnimationFrame(tunerFrame);
    tunerFrame = null;
  }

  if (tunerSource) {
    tunerSource.disconnect();
    tunerSource = null;
  }

  if (tunerStream) {
    tunerStream.getTracks().forEach((track) => track.stop());
    tunerStream = null;
  }

  if (tunerAudioContext) {
    tunerAudioContext.close();
    tunerAudioContext = null;
  }

  tunerAnalyser = null;
  tunerStableFrequency = null;
  tunerStart.disabled = false;
  tunerStop.disabled = true;
  tunerStatus.textContent = 'Autorise le micro pour commencer.';
  updateTunerDisplay(null);
}

function updateMetronomeUi() {
  metronomeBpmValue.textContent = `${metronomeBpm.value} BPM`;
  metronomeBeatIndicator.classList.toggle('is-running', Boolean(metronomeInterval));
  metronomeToggle.textContent = metronomeInterval ? 'Arreter' : 'Demarrer';
  persistSettings();
}

function flashMetronomeBeat(isAccent, beatNumber) {
  metronomeBeatIndicator.textContent = isAccent ? `${beatNumber} fort` : `Temps ${beatNumber}`;
  metronomeBeatIndicator.classList.toggle('is-accent', isAccent);
  metronomeBeatIndicator.classList.add('is-running');
  window.setTimeout(() => {
    if (metronomeBeatIndicator) {
      metronomeBeatIndicator.classList.remove('is-accent');
    }
  }, 120);
}

function playMetronomeClick(isAccent) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }

  if (!metronomeAudioContext) {
    metronomeAudioContext = new AudioContextClass();
  }

  if (metronomeAudioContext.state === 'suspended') {
    metronomeAudioContext.resume();
  }

  const oscillator = metronomeAudioContext.createOscillator();
  const gain = metronomeAudioContext.createGain();
  const now = metronomeAudioContext.currentTime;

  oscillator.type = 'square';
  oscillator.frequency.value = isAccent ? 1360 : 920;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(isAccent ? 0.18 : 0.1, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

  oscillator.connect(gain);
  gain.connect(metronomeAudioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.09);
}

function runMetronomeTick() {
  const beatsPerBar = Number(metronomeBeats.value);
  const isAccent = metronomeBeat % beatsPerBar === 0;
  const beatNumber = (metronomeBeat % beatsPerBar) + 1;
  playMetronomeClick(isAccent);
  flashMetronomeBeat(isAccent, beatNumber);
  metronomeBeat += 1;
}

function stopMetronome() {
  if (metronomeInterval) {
    clearInterval(metronomeInterval);
    metronomeInterval = null;
  }
  metronomeBeat = 0;
  metronomeBeatIndicator.textContent = 'Arret';
  metronomeBeatIndicator.classList.remove('is-running', 'is-accent');
  updateMetronomeUi();
}

function startMetronome() {
  stopMetronome();
  const intervalMs = Math.round(60000 / Number(metronomeBpm.value));
  runMetronomeTick();
  metronomeInterval = window.setInterval(runMetronomeTick, intervalMs);
  updateMetronomeUi();
}

function toggleMetronome() {
  if (metronomeInterval) {
    stopMetronome();
  } else {
    startMetronome();
  }
}

function handleTapTempo() {
  const now = performance.now();
  tapTempoTimes = tapTempoTimes.filter((time) => now - time < 2200);
  tapTempoTimes.push(now);

  if (tapTempoTimes.length < 2) {
    return;
  }

  const intervals = [];
  for (let index = 1; index < tapTempoTimes.length; index += 1) {
    intervals.push(tapTempoTimes[index] - tapTempoTimes[index - 1]);
  }

  const average = intervals.reduce((sum, value) => sum + value, 0) / intervals.length;
  const bpm = Math.max(Number(metronomeBpm.min), Math.min(Number(metronomeBpm.max), Math.round(60000 / average)));
  metronomeBpm.value = String(bpm);
  updateMetronomeUi();

  if (metronomeInterval) {
    startMetronome();
  }
}

function getPageScrollTop() {
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function getPageMaxScrollTop() {
  return Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight
  ) - window.innerHeight;
}

function resolveScrollMode() {
  const viewerCanScroll = viewer.scrollHeight - viewer.clientHeight > 4;
  scrollMode = viewerCanScroll ? 'viewer' : 'page';
}

function getCurrentScrollTop() {
  return scrollMode === 'viewer' ? viewer.scrollTop : getPageScrollTop();
}

function getCurrentMaxScrollTop() {
  return scrollMode === 'viewer'
    ? Math.max(0, viewer.scrollHeight - viewer.clientHeight)
    : Math.max(0, getPageMaxScrollTop());
}

function setCurrentScrollTop(value) {
  if (scrollMode === 'viewer') {
    viewer.scrollTop = value;
    return;
  }

  window.scrollTo({ top: value, behavior: 'auto' });
}

function updateSpeedLabel() {
  scrollSpeedValue.textContent = String(scrollSpeed.value);
  viewerSpeedValue.textContent = String(scrollSpeed.value);
  persistSettings();
}

function adjustScrollSpeed(delta) {
  const min = Number(scrollSpeed.min);
  const max = Number(scrollSpeed.max);
  const step = Number(scrollSpeed.step) || 1;
  const nextValue = Math.max(min, Math.min(max, Number(scrollSpeed.value) + (delta * step)));
  scrollSpeed.value = String(nextValue);
  updateSpeedLabel();
}

function isSpeedControlInteraction(target) {
  return Boolean(
    target &&
    target.closest &&
    target.closest('.speed-adjust, #viewer-speed-float')
  );
}

function swallowSpeedControlTouch(event) {
  event.stopPropagation();
}

function updateScrollButton() {
  scrollToggle.textContent = isAutoScrolling ? '\u275A\u275A' : '\u25B6';
  scrollToggle.title = isAutoScrolling ? 'Mettre en pause le defilement' : 'Demarrer le defilement';
  scrollToggle.setAttribute('aria-label', isAutoScrolling ? 'Mettre en pause le defilement' : 'Demarrer le defilement');
  scrollToggle.classList.toggle('is-active', isAutoScrolling);
  const showFloatingSpeed = isAutoScrolling && (isReadingMode || isSceneMode);
  viewerSpeedFloat.classList.toggle('is-hidden', !showFloatingSpeed);
}

function stopAutoScroll() {
  isAutoScrolling = false;
  lastFrameTime = 0;
  scrollCarry = 0;

  if (autoScrollFrame) {
    cancelAnimationFrame(autoScrollFrame);
    autoScrollFrame = null;
  }

  updateScrollButton();
}

function autoScrollStep(timestamp) {
  if (!isAutoScrolling) {
    return;
  }

  if (!lastFrameTime) {
    lastFrameTime = timestamp;
  }

  const elapsed = (timestamp - lastFrameTime) / 1000;
  lastFrameTime = timestamp;
  scrollCarry += Number(scrollSpeed.value) * elapsed;
  const distance = Math.floor(scrollCarry);

  if (distance <= 0) {
    autoScrollFrame = requestAnimationFrame(autoScrollStep);
    return;
  }

  scrollCarry -= distance;
  const maxScrollTop = getCurrentMaxScrollTop();
  const currentScrollTop = getCurrentScrollTop();

  setCurrentScrollTop(Math.min(currentScrollTop + distance, maxScrollTop));

  if (getCurrentScrollTop() >= maxScrollTop) {
    stopAutoScroll();
    return;
  }

  autoScrollFrame = requestAnimationFrame(autoScrollStep);
}

function startAutoScroll() {
  if (isAutoScrolling) {
    return;
  }

  resolveScrollMode();

  if (getCurrentMaxScrollTop() <= 0) {
    updateScrollButton();
    return;
  }

  isAutoScrolling = true;
  lastFrameTime = 0;
  updateScrollButton();
  autoScrollFrame = requestAnimationFrame(autoScrollStep);
}

function labelFromFileName(fileName) {
  return fileName
    .split('/')
    .pop()
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function filePathToUrl(fileName) {
  return `tabs/${fileName.split('/').map((part) => encodeURIComponent(part)).join('/')}`;
}

function setRemoteImportStatus(message, isError = false) {
  remoteImportStatus.hidden = false;
  remoteImportStatus.textContent = message;
  remoteImportStatus.style.color = isError ? '#9f3a20' : '';
}

function applyAppConfig() {
  const remoteImportEnabled = Boolean(appConfig.features && appConfig.features.remoteImport);
  headerActions.hidden = !remoteImportEnabled;
  remoteImportStatus.hidden = !remoteImportEnabled;

  if (!remoteImportEnabled) {
    remoteImportStatus.textContent = '';
  }
}

async function loadTab(fileName) {
  stopAutoScroll();
  activeFile = fileName;
  activeTabText = '';
  const planIndex = concertPlan.indexOf(fileName);
  if (planIndex >= 0) {
    concertPlanIndex = planIndex;
    persistConcertPlan();
  }
  persistLastOpenedTab(fileName);
  persistSettings();
  if (isMenuOpen) {
    setMenuVisibility(false);
  }
  tabTitle.textContent = labelFromFileName(fileName);
  tabContent.textContent = 'Chargement...';
  scrollMode = 'viewer';
  setCurrentScrollTop(0);
  window.scrollTo({ top: 0, behavior: 'auto' });

  try {
    const response = await fetch(filePathToUrl(fileName));
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}`);
    }

    const text = await response.text();
    activeTabText = text || 'Le fichier est vide.';
    persistCachedTabContent(fileName, activeTabText);
    renderActiveTabText();
    requestAnimationFrame(resolveScrollMode);
    renderTabList(searchInput.value);
    renderConcertPlanner();
  } catch (error) {
    const cachedContent = getCachedTabContent()[fileName];
    if (cachedContent) {
      activeTabText = cachedContent;
      renderActiveTabText();
      requestAnimationFrame(resolveScrollMode);
      renderTabList(searchInput.value);
      renderConcertPlanner();
      return;
    }

    tabContent.textContent = `Impossible de charger ${fileName}.`;
  }
}

function renderTabList(query = '') {
  const normalizedQuery = query.trim().toLowerCase();
  const visibleTabs = allTabs.filter((fileName) =>
    labelFromFileName(fileName).toLowerCase().includes(normalizedQuery)
  );

  tabList.innerHTML = '';

  if (visibleTabs.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.textContent = 'Aucun resultat.';
    tabList.appendChild(emptyItem);
    return;
  }

  visibleTabs.forEach((fileName) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = labelFromFileName(fileName);
    button.classList.toggle('active', fileName === activeFile);
    button.addEventListener('click', () => loadTab(fileName));
    item.appendChild(button);
    tabList.appendChild(item);
  });
}

async function registerOfflineSupport() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    await registration.update();
  } catch (error) {
    // Ignore registration errors in unsupported local setups.
  }
}

async function init() {
  const savedSettings = getSavedSettings();
  const lastOpenedTab = getLastOpenedTab();
  const cachedTabs = getCachedTabs();
  const savedConcertPlan = getSavedConcertPlan();

  try {
    concertPlan = savedConcertPlan.items;
    concertPlanIndex = savedConcertPlan.index;
    if (typeof savedSettings.scrollSpeed === 'number' && !Number.isNaN(savedSettings.scrollSpeed)) {
      const nextSpeed = Math.max(Number(scrollSpeed.min), Math.min(Number(scrollSpeed.max), savedSettings.scrollSpeed));
      scrollSpeed.value = String(nextSpeed);
    }
    if (typeof savedSettings.transposeAmount === 'number' && !Number.isNaN(savedSettings.transposeAmount)) {
      transposeAmount = Math.max(-11, Math.min(11, savedSettings.transposeAmount));
    }
    if (typeof savedSettings.metronomeBpm === 'number' && !Number.isNaN(savedSettings.metronomeBpm)) {
      const nextBpm = Math.max(Number(metronomeBpm.min), Math.min(Number(metronomeBpm.max), savedSettings.metronomeBpm));
      metronomeBpm.value = String(nextBpm);
    }
    if (typeof savedSettings.metronomeBeats === 'number' && !Number.isNaN(savedSettings.metronomeBeats)) {
      metronomeBeats.value = String(savedSettings.metronomeBeats);
    }

    const configResponse = await fetch('/api/config');
    if (configResponse.ok) {
      appConfig = await configResponse.json();
      applyAppConfig();
    }

    const response = await fetch('/api/tabs');
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}`);
    }

    allTabs = await response.json();
    if (allTabs.length > 0) {
      persistCachedTabs(allTabs);
    } else if (cachedTabs.length > 0) {
      allTabs = cachedTabs;
    }
    concertPlan = concertPlan.filter((fileName) => allTabs.includes(fileName));
    if (concertPlan.length === 0) {
      concertPlanIndex = -1;
    } else if (concertPlanIndex >= concertPlan.length) {
      concertPlanIndex = concertPlan.length - 1;
    }
    persistConcertPlan();
    const importedFromUrl = importConcertPlanFromUrl();
    renderTabList();
    renderConcertPlanner();

    if (allTabs.length > 0) {
      const preferredTab = importedFromUrl && concertPlan.length > 0
        ? concertPlan[0]
        : ((lastOpenedTab && allTabs.includes(lastOpenedTab))
          ? lastOpenedTab
          : (typeof savedSettings.lastTab === 'string' && allTabs.includes(savedSettings.lastTab)
            ? savedSettings.lastTab
            : allTabs[0]));
      await loadTab(preferredTab);
    } else {
      tabTitle.textContent = 'Aucune tablature';
      tabContent.textContent = 'Ajoute des fichiers .txt dans tabs/.';
    }

    updateSpeedLabel();
    updateTransposeUi();
    updateMetronomeUi();
    setMenuVisibility(false);
    setTabsSectionVisibility(savedSettings.tabsOpen !== false);
    setToolsVisibility(Boolean(savedSettings.toolsOpen));
    setChordDictionaryVisibility(Boolean(savedSettings.chordOpen));
    setReadingMode(Boolean(savedSettings.readingMode));
    setSceneMode(Boolean(savedSettings.sceneMode));
    setConcertPlannerVisibility(Boolean(savedSettings.concertPlannerOpen));
  } catch (error) {
    if (cachedTabs.length > 0) {
      allTabs = cachedTabs;
      concertPlan = concertPlan.filter((fileName) => allTabs.includes(fileName));
      if (concertPlan.length === 0) {
        concertPlanIndex = -1;
      } else if (concertPlanIndex >= concertPlan.length) {
        concertPlanIndex = concertPlan.length - 1;
      }
      persistConcertPlan();
      const importedFromUrl = importConcertPlanFromUrl();
      renderTabList();
      renderConcertPlanner();
      const preferredTab = importedFromUrl && concertPlan.length > 0
        ? concertPlan[0]
        : ((lastOpenedTab && allTabs.includes(lastOpenedTab))
          ? lastOpenedTab
          : (typeof savedSettings.lastTab === 'string' && allTabs.includes(savedSettings.lastTab)
            ? savedSettings.lastTab
            : allTabs[0]));
      await loadTab(preferredTab);
      updateSpeedLabel();
      updateTransposeUi();
      updateMetronomeUi();
      setMenuVisibility(false);
      setTabsSectionVisibility(savedSettings.tabsOpen !== false);
      setConcertPlannerVisibility(Boolean(savedSettings.concertPlannerOpen));
      return;
    }

    tabTitle.textContent = 'Serveur non demarre';
    tabContent.textContent = 'Lance start-server.ps1 pour charger automatiquement les tablatures.';
  }
}

async function refreshTabs() {
  const response = await fetch('/api/tabs');
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}`);
  }

  allTabs = await response.json();
  if (allTabs.length > 0) {
    persistCachedTabs(allTabs);
  }
  concertPlan = concertPlan.filter((fileName) => allTabs.includes(fileName));
  if (concertPlan.length === 0) {
    concertPlanIndex = -1;
  } else if (concertPlanIndex >= concertPlan.length) {
    concertPlanIndex = concertPlan.length - 1;
  }
  persistConcertPlan();
  renderTabList(searchInput.value);
  renderConcertPlanner();
}

async function cacheAllTabsForOffline() {
  if (allTabs.length === 0) {
    setOfflineStatus('Aucune tablature a mettre en cache.', true);
    return;
  }

  setOfflineStatus('Mise en cache des tablatures...');
  let cachedCount = 0;

  for (const fileName of allTabs) {
    try {
      const response = await fetch(filePathToUrl(fileName));
      if (!response.ok) {
        continue;
      }

      const text = await response.text();
      persistCachedTabContent(fileName, text || 'Le fichier est vide.');
      cachedCount += 1;
    } catch (error) {
      // Ignore individual failures.
    }
  }

  persistCachedTabs(allTabs);
  setOfflineStatus(`${cachedCount} tablature(s) mises en cache localement.`);
}

async function clearOfflineCache() {
  try {
    localStorage.removeItem(cachedTabsStorageKey);
    localStorage.removeItem(cachedTabContentStorageKey);

    if ('caches' in window) {
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys
          .filter((key) => key.startsWith('pedrotabs-'))
          .map((key) => caches.delete(key))
      );
    }

    setOfflineStatus('Cache local vide.');
  } catch (error) {
    setOfflineStatus('Impossible de vider le cache.', true);
  }
}

searchInput.addEventListener('input', (event) => {
  renderTabList(event.target.value);
});

chordSearchInput.addEventListener('input', (event) => {
  renderChordDictionary(event.target.value);
});

chordToggle.addEventListener('click', () => {
  const isHidden = chordContent.classList.contains('is-hidden');
  setChordDictionaryVisibility(isHidden);
});

concertPlannerToggle.addEventListener('click', () => {
  setConcertPlannerVisibility(!isConcertPlannerOpen);
});

concertPlannerClose.addEventListener('click', () => {
  setConcertPlannerVisibility(false);
});

concertSearchInput.addEventListener('input', (event) => {
  concertPlanFilter = event.target.value;
  renderConcertLibrary();
});

concertStart.addEventListener('click', async () => {
  if (concertPlan.length === 0) {
    concertStatus.textContent = 'Ajoute au moins un morceau pour demarrer la setlist.';
    return;
  }

  const startIndex = concertPlanIndex >= 0 && concertPlanIndex < concertPlan.length ? concertPlanIndex : 0;
  await loadConcertPlanEntry(startIndex, { sceneMode: true });
});

concertShare.addEventListener('click', () => {
  if (concertPlan.length === 0) {
    concertStatus.textContent = 'Ajoute au moins un morceau pour partager la setlist.';
    return;
  }

  setConcertShareVisibility(true);
  updateConcertShareUi();
});

concertShareClose.addEventListener('click', () => {
  setConcertShareVisibility(false);
});

concertShareModal.addEventListener('click', (event) => {
  if (event.target === concertShareModal) {
    setConcertShareVisibility(false);
  }
});

concertCopyLink.addEventListener('click', copyConcertShareLink);
chordModalClose.addEventListener('click', () => {
  setChordModalVisibility(false);
});
chordModal.addEventListener('click', (event) => {
  if (event.target === chordModal) {
    setChordModalVisibility(false);
  }
});
tabContent.addEventListener('click', (event) => {
  const chordButton = event.target.closest('.inline-chord-button');
  if (!chordButton) {
    return;
  }

  updateChordModal(chordButton.dataset.chord || chordButton.textContent || '');
});
chordPlayStrum.addEventListener('click', () => {
  if (activeModalChord) {
    playChord(activeModalChord.chord.variants[activeModalChordVariantIndex], false);
  }
});
chordPlayArpeggio.addEventListener('click', () => {
  if (activeModalChord) {
    playChord(activeModalChord.chord.variants[activeModalChordVariantIndex], true);
  }
});
chordModalPrev.addEventListener('click', () => {
  if (!activeModalChord) {
    return;
  }

  activeModalChordVariantIndex = Math.max(0, activeModalChordVariantIndex - 1);
  populateChordDetails({
    aliases: chordModalAliases,
    family: chordModalFamily,
    formula: chordModalFormula,
    shapeLabel: chordModalShapeLabel,
    shape: chordModalShape,
    fingers: chordModalFingers,
    notes: chordModalNotes,
    variantLabel: chordModalVariantLabel,
    prevButton: chordModalPrev,
    nextButton: chordModalNext
  }, activeModalChord.chord, activeModalChordVariantIndex);
});
chordModalNext.addEventListener('click', () => {
  if (!activeModalChord) {
    return;
  }

  activeModalChordVariantIndex = Math.min(activeModalChord.chord.variants.length - 1, activeModalChordVariantIndex + 1);
  populateChordDetails({
    aliases: chordModalAliases,
    family: chordModalFamily,
    formula: chordModalFormula,
    shapeLabel: chordModalShapeLabel,
    shape: chordModalShape,
    fingers: chordModalFingers,
    notes: chordModalNotes,
    variantLabel: chordModalVariantLabel,
    prevButton: chordModalPrev,
    nextButton: chordModalNext
  }, activeModalChord.chord, activeModalChordVariantIndex);
});

concertClear.addEventListener('click', () => {
  concertPlan = [];
  concertPlanIndex = -1;
  persistConcertPlan();
  setConcertShareVisibility(false);
  renderConcertPlanner();
});

tabsToggle.addEventListener('click', () => {
  setTabsSectionVisibility(!isTabsSectionOpen);
});

menuToggle.addEventListener('click', () => {
  setMenuVisibility(!isMenuOpen);
});

menuBackdrop.addEventListener('click', () => {
  setMenuVisibility(false);
});

toolsToggle.addEventListener('click', () => {
  const isHidden = toolsContent.classList.contains('is-hidden');
  setToolsVisibility(isHidden);
});

readingModeToggle.addEventListener('click', async () => {
  const nextState = !isReadingMode;
  setReadingMode(nextState);
  await syncFullscreenState(nextState);
  resolveScrollMode();
});

sceneModeToggle.addEventListener('click', async () => {
  const nextState = !isSceneMode;
  setSceneMode(nextState);
  await syncFullscreenState(nextState);
  resolveScrollMode();
});

transposeDown.addEventListener('click', () => {
  setTransposeAmount(transposeAmount - 1);
});

transposeUp.addEventListener('click', () => {
  setTransposeAmount(transposeAmount + 1);
});

tunerStart.addEventListener('click', startTuner);
tunerStop.addEventListener('click', stopTuner);

tunerStringButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const note = button.dataset.note;
    const frequency = Number(button.dataset.frequency);
    tunerStatus.textContent = `Cible ${note} a ${frequency.toFixed(2)} Hz.`;
    updateTunerStringHighlight(note);
  });
});

metronomeBpm.addEventListener('input', () => {
  updateMetronomeUi();
  if (metronomeInterval) {
    startMetronome();
  }
});

metronomeBeats.addEventListener('change', () => {
  updateMetronomeUi();
  if (metronomeInterval) {
    startMetronome();
  }
});

metronomeToggle.addEventListener('click', toggleMetronome);
metronomeTap.addEventListener('click', handleTapTempo);
cacheAllTabsButton.addEventListener('click', cacheAllTabsForOffline);
clearOfflineCacheButton.addEventListener('click', clearOfflineCache);

remoteImportButton.addEventListener('click', async () => {
  if (!appConfig.features || !appConfig.features.remoteImport) {
    return;
  }

  remoteImportButton.disabled = true;
  setRemoteImportStatus('Import en cours...');

  try {
    const response = await fetch('/api/import-remote');
    const result = await response.json();

    if (!response.ok) {
      const details = result.errors && result.errors.length > 0
        ? result.errors[0]
        : (result.error || 'Import impossible.');
      throw new Error(details);
    }

    await refreshTabs();

    if (result.imported && result.imported.length > 0) {
      const errorSuffix = result.errors && result.errors.length > 0
        ? ` ${result.errors.length} URL(s) ont echoue.`
        : '';
      setRemoteImportStatus(`${result.imported.length} tablature(s) importee(s).${errorSuffix}`);
      await loadTab(result.imported[0]);
    } else {
      const details = result.errors && result.errors.length > 0
        ? result.errors[0]
        : 'Verifie les URLs ou les restrictions du site.';
      setRemoteImportStatus(`Aucune nouvelle tablature importee. ${details}`, true);
    }
  } catch (error) {
    setRemoteImportStatus(error.message || 'Import impossible.', true);
  } finally {
    remoteImportButton.disabled = false;
  }
});

scrollToggle.addEventListener('click', () => {
  if (isAutoScrolling) {
    stopAutoScroll();
  } else {
    startAutoScroll();
  }
});

scrollReset.addEventListener('click', () => {
  stopAutoScroll();
  resolveScrollMode();
  setCurrentScrollTop(0);
  window.scrollTo({ top: 0, behavior: 'auto' });
});

scrollSpeed.addEventListener('input', updateSpeedLabel);
scrollSpeedDown.addEventListener('click', () => adjustScrollSpeed(-1));
scrollSpeedUp.addEventListener('click', () => adjustScrollSpeed(1));
viewerSpeedDown.addEventListener('click', () => adjustScrollSpeed(-1));
viewerSpeedUp.addEventListener('click', () => adjustScrollSpeed(1));
scenePrev.addEventListener('click', async () => {
  if (concertPlanIndex > 0) {
    await loadConcertPlanEntry(concertPlanIndex - 1, { sceneMode: true });
  }
});
sceneNext.addEventListener('click', async () => {
  if (concertPlanIndex >= 0 && concertPlanIndex < concertPlan.length - 1) {
    await loadConcertPlanEntry(concertPlanIndex + 1, { sceneMode: true });
  }
});

[scrollSpeedDown, scrollSpeedUp, viewerSpeedDown, viewerSpeedUp, viewerSpeedFloat].forEach((element) => {
  element.addEventListener('touchstart', swallowSpeedControlTouch, { passive: true });
  element.addEventListener('touchend', swallowSpeedControlTouch, { passive: true });
  element.addEventListener('pointerdown', swallowSpeedControlTouch);
});

document.addEventListener('fullscreenchange', () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
  if (!fullscreenElement) {
    if (isReadingMode) {
      setReadingMode(false);
    }
    if (isSceneMode) {
      setSceneMode(false);
    }
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isChordModalOpen) {
    setChordModalVisibility(false);
    return;
  }

  if (event.key === 'Escape' && isConcertShareOpen) {
    setConcertShareVisibility(false);
    return;
  }

  if (event.key === 'Escape' && isMenuOpen) {
    setMenuVisibility(false);
  }

  if (!isSceneMode) {
    return;
  }

  if (event.key === 'ArrowRight' && concertPlanIndex < concertPlan.length - 1) {
    loadConcertPlanEntry(concertPlanIndex + 1, { sceneMode: true });
  }

  if (event.key === 'ArrowLeft' && concertPlanIndex > 0) {
    loadConcertPlanEntry(concertPlanIndex - 1, { sceneMode: true });
  }
});

window.addEventListener('resize', () => {
  if (activeTabText) {
    renderActiveTabText();
    requestAnimationFrame(resolveScrollMode);
  }
});

updateScrollButton();
updateTunerDisplay(null);
renderChordDictionary();
registerOfflineSupport();
init();

