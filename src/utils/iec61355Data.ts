/**
 * IEC 61355-1 / SS-EN 61355-1
 * Classification and designation of documents for plants, systems and equipment
 * Part 1: Rules and classification tables.
 *
 * Defines Document Kind Classification Codes (DCC / Dokumentklasskoder)
 * with the standardized '&' document prefix symbol.
 */

export interface Iec61355DocumentKind {
  code: string; // e.g. "&FS", "&MA", "&FT"
  letterCode: string; // e.g. "FS", "MA", "FT"
  mainClass: string; // e.g. "F", "M", "L", "D"
  domainName: string; // e.g. "Funktionsorienterade handlingar (Scheman)"
  swedishTitle: string; // e.g. "Kretsschema / Kretsscheman"
  englishTitle: string; // e.g. "Circuit diagram"
  category: 'Scheman & Funktion' | 'Plintar & Förbindning' | 'Layouter & Placering' | 'Beskrivning & Beräkning' | 'Provning & Idrifttagning' | 'Drift & Underhåll' | 'Mjukvara & Parametrar' | 'Allmänt & Projekt';
  definition: string;
  typicalContents: string[];
  importance: 'Obligatorisk' | 'Rekommenderad' | 'Valfri' | 'Obligatorisk vid maskiner' | 'Obligatorisk vid VFD' | 'Obligatorisk vid nätverk' | string;
  relevantStandards: string[]; // e.g. ["SS-EN 60204-1", "SS 436 40 00"]
  exampleFileName: string; // e.g. "=P1 +W1 &FS01"
}

export interface Iec61355ProjectTemplate {
  id: string;
  name: string;
  description: string;
  badge: string;
  targetApplication: string;
  standardReference: string;
  recommendedDocs: {
    letterCode: string;
    requirementLevel: 'Krav (Lag/Standard)' | 'Rekommenderad praxis' | 'Vid behov';
    customNote?: string;
  }[];
}

export const IEC_61355_MAIN_CLASSES = [
  { letter: 'A', name: 'Projektledning och allmänna dokument', count: 4, icon: 'Folder' },
  { letter: 'D', name: 'Allmänna tekniska handlingar & beräkningar', count: 4, icon: 'FileText' },
  { letter: 'E', name: 'Kravspecifikationer och tekniska villkor', count: 3, icon: 'CheckSquare' },
  { letter: 'F', name: 'Funktionsorienterade handlingar (Kretsscheman)', count: 8, icon: 'Zap' },
  { letter: 'L', name: 'Placeringsritningar och layouter', count: 4, icon: 'MapPin' },
  { letter: 'M', name: 'Anslutnings- och förbindningshandlingar (Plintar/Kablar)', count: 6, icon: 'GitFork' },
  { letter: 'P', name: 'Provning, kontroll och idrifttagning', count: 4, icon: 'ClipboardCheck' },
  { letter: 'Q', name: 'Drift, skötsel och underhåll', count: 4, icon: 'Settings' },
  { letter: 'W', name: 'Mjukvara, nätverk och konfiguration', count: 4, icon: 'Code' },
];

export const IEC_61355_ENTRIES: Iec61355DocumentKind[] = [
  // --- KLASS F: Funktionsorienterade handlingar (Scheman) ---
  {
    code: '&FS',
    letterCode: 'FS',
    mainClass: 'F',
    domainName: 'Funktionsorienterade handlingar',
    swedishTitle: 'Kretsschema (Samlat kopplingsschema)',
    englishTitle: 'Circuit diagram',
    category: 'Scheman & Funktion',
    definition: 'Visar den detaljerade elektriska kretskopplingen med alla komponenter, ledningsdragningar, anslutningsnummer och korsreferenser.',
    typicalContents: [
      'Komponenter med IEC 81346 postbeteckningar (-QA, -KM, -FD)',
      'Potentialledningar (L1, L2, L3, N, PE, +24V, 0V)',
      'Plintnummer och kontaktkorsreferenser',
      'Kabelnummer och ledarfärger',
    ],
    importance: 'Obligatorisk',
    relevantStandards: ['SS-EN 60204-1 (Maskiners elutrustning)', 'SS-EN 61082-1'],
    exampleFileName: '=A1 +W1 &FS01 (Blad 1..n)',
  },
  {
    code: '&FT',
    letterCode: 'FT',
    mainClass: 'F',
    domainName: 'Funktionsorienterade handlingar',
    swedishTitle: 'Enlinjeschema (Huvudledningsschema)',
    englishTitle: 'Single-line diagram / Distribution diagram',
    category: 'Scheman & Funktion',
    definition: 'Förenklad representation av trefas- eller kraftfördelningssystem där flerfaskretsar representeras med en enda ledningslinje.',
    typicalContents: [
      'Inkommande matning och transformatorer',
      'Effektbrytare, mätare och säkringsgrupper',
      'Kabeltyper och förläggningssätt',
      'Kortslutningsströmmar (Ik3max, Ik1min) och spänningsnivåer',
    ],
    importance: 'Obligatorisk',
    relevantStandards: ['SS 436 40 00 (Elinstallationsreglerna)', 'SS-EN 61439'],
    exampleFileName: '=KRAFT +HS &FT01',
  },
  {
    code: '&FE',
    letterCode: 'FE',
    mainClass: 'F',
    domainName: 'Funktionsorienterade handlingar',
    swedishTitle: 'Huvudkretsschema (Kraftschema)',
    englishTitle: 'Power circuit diagram',
    category: 'Scheman & Funktion',
    definition: 'Detaljerat schema över de delar av elinstallationen som överför elektrisk energi till motorer, värmare eller omriktare.',
    typicalContents: [
      'Huvudströmbrytare, kontaktorers huvudkontakter (-QC)',
      'Motorskydd (-QF, -FB) och frekvensomriktare (-TF)',
      'Motorkoppling och termistorskydd',
      'Märkströmmar och säkringsdimensioner',
    ],
    importance: 'Obligatorisk',
    relevantStandards: ['SS-EN 60204-1', 'SS-EN 61082-1'],
    exampleFileName: '=P1 +W1 &FE01',
  },
  {
    code: '&FF',
    letterCode: 'FF',
    mainClass: 'F',
    domainName: 'Funktionsorienterade handlingar',
    swedishTitle: 'Manöverkretsschema (Styrschema)',
    englishTitle: 'Control circuit diagram',
    category: 'Scheman & Funktion',
    definition: 'Schema som visar styrsignaler, säkerhetskretsar, förreglingar och reläfunktioner för maskiner eller processer.',
    typicalContents: [
      '24V DC / 230V AC styrspänning',
      'Nödstoppskretsar och säkerhetsreläer (-KH)',
      'Tryckknappar (-SB) och gränslägesbrytare (-SK)',
      'PLC-ingångar och reläutgångar',
    ],
    importance: 'Obligatorisk',
    relevantStandards: ['SS-EN 60204-1', 'SS-EN ISO 13849-1'],
    exampleFileName: '=P1 +W1 &FF01',
  },
  {
    code: '&FA',
    letterCode: 'FA',
    mainClass: 'F',
    domainName: 'Funktionsorienterade handlingar',
    swedishTitle: 'Översiktsschema (Funktionsschema)',
    englishTitle: 'Overview diagram / Functional diagram',
    category: 'Scheman & Funktion',
    definition: 'Övergripande presentation av en hel anläggnings funktionella sammanhang utan detaljerad ledningsdragning.',
    typicalContents: [
      'Övergripande systemarkitektur',
      'Samverkan mellan ställverk, undercentraler och maskiner',
      'Huvudkommunikationslinjer',
    ],
    importance: 'Rekommenderad',
    relevantStandards: ['SS-EN 61082-1'],
    exampleFileName: '=SYS &FA01',
  },
  {
    code: '&FB',
    letterCode: 'FB',
    mainClass: 'F',
    domainName: 'Funktionsorienterade handlingar',
    swedishTitle: 'Blockschema',
    englishTitle: 'Block diagram',
    category: 'Scheman & Funktion',
    definition: 'Schema där kretsar eller apparatsystem representeras av geometriska figurer med in- och utgångar.',
    typicalContents: [
      'Funktionsblock och signalflöden',
      'Hårdvarumoduler (PLC, HMI, VFD, I/O-noder)',
      'Fältbussar och fältbussadresser',
    ],
    importance: 'Rekommenderad',
    relevantStandards: ['SS-EN 61082-1'],
    exampleFileName: '=AUTO &FB01',
  },
  {
    code: '&FC',
    letterCode: 'FC',
    mainClass: 'F',
    domainName: 'Funktionsorienterade handlingar',
    swedishTitle: 'Logikschema / Flödesschema (Grafcet / SFC)',
    englishTitle: 'Logic diagram / Sequence diagram',
    category: 'Scheman & Funktion',
    definition: 'Beskriver logiska samband och sekventiella processteg med binära symboler eller sekvensdiagram.',
    typicalContents: [
      'Steg- och övergångsdiagram (Grafcet)',
      'AND/OR/NOT grindlogik för säkerhetsfunktioner',
      'Tidsförloppsdiagram',
    ],
    importance: 'Valfri',
    relevantStandards: ['IEC 60848', 'SS-EN 61131-3'],
    exampleFileName: '=SEKV &FC01',
  },
  {
    code: '&FN',
    letterCode: 'FN',
    mainClass: 'F',
    domainName: 'Funktionsorienterade handlingar',
    swedishTitle: 'Signallista / I/O-förteckning',
    englishTitle: 'Signal list / I/O list',
    category: 'Scheman & Funktion',
    definition: 'Strukturerad förteckning över alla styrsignaler mellan fältkomponenter och PLC/styrsystem.',
    typicalContents: [
      'Signalnamn och funktionell beskrivning',
      'PLC-adress (t.ex. %IX0.0 eller %QX1.2)',
      'Signaltyp (DI, DO, AI, AO, PT100)',
      'Plintnummer och fältkabelmärkning',
    ],
    importance: 'Obligatorisk',
    relevantStandards: ['SS-EN 60204-1'],
    exampleFileName: '=PLC1 &FN01',
  },

  // --- KLASS M: Anslutnings- och förbindningshandlingar ---
  {
    code: '&MA',
    letterCode: 'MA',
    mainClass: 'M',
    domainName: 'Anslutnings- och förbindningshandlingar',
    swedishTitle: 'Plinttabell / Plintschema',
    englishTitle: 'Terminal diagram / Terminal connection chart',
    category: 'Plintar & Förbindning',
    definition: 'Detaljerad förteckning över varje enskild radplint med intern trådning, extern kabelanslutning och byglingar.',
    typicalContents: [
      'Plintradsbeteckning (:X1, :X2) och plintnummer (1, 2, 3..)',
      'Intern anslutningsadress (komponent & klämma, t.ex. -KM1:13)',
      'Extern kabelmärkning (-W1) och partfärg/partnummer',
      'Byglar och potentialfördelning',
    ],
    importance: 'Obligatorisk',
    relevantStandards: ['SS-EN 60204-1', 'SS-EN 61082-1'],
    exampleFileName: '+W1 :X1 &MA01',
  },
  {
    code: '&ME',
    letterCode: 'ME',
    mainClass: 'M',
    domainName: 'Anslutnings- och förbindningshandlingar',
    swedishTitle: 'Kabellista / Kabelförteckning',
    englishTitle: 'Cable list / Cable schedule',
    category: 'Plintar & Förbindning',
    definition: 'Fullständig förteckning över alla kablar i anläggningen med ursprung, destination, kabeltyp och längd.',
    typicalContents: [
      'Kabelnummer (-W1, -W2 osv.)',
      'Från-apparat/skåp (+W1) till destination (+M1)',
      'Kabeltyp och ledarantal (t.ex. FXQJ 4G2.5, ÖLFLEX 7G1.0)',
      'Beräknad / verklig kabellängd och förläggningssätt',
    ],
    importance: 'Obligatorisk',
    relevantStandards: ['SS 436 40 00', 'SS-EN 60204-1'],
    exampleFileName: '=ANL &ME01',
  },
  {
    code: '&MB',
    letterCode: 'MB',
    mainClass: 'M',
    domainName: 'Anslutnings- och förbindningshandlingar',
    swedishTitle: 'Kabelförbindningsschema',
    englishTitle: 'Cable connection diagram',
    category: 'Plintar & Förbindning',
    definition: 'Grafisk ritning som visar hur kablar är anslutna mellan olika apparatskåp, plintlådor och fältutrustning.',
    typicalContents: [
      'Kabelstammar mellan apparatskåp',
      'Kopplingsdosor och fältmoduler',
      'Skärmanslutningar och potentialjordning',
    ],
    importance: 'Rekommenderad',
    relevantStandards: ['SS-EN 61082-1'],
    exampleFileName: '=SYS &MB01',
  },
  {
    code: '&MC',
    letterCode: 'MC',
    mainClass: 'M',
    domainName: 'Anslutnings- och förbindningshandlingar',
    swedishTitle: 'Apparatanslutningsschema (Inkopplingsschema)',
    englishTitle: 'Apparatus connection diagram',
    category: 'Plintar & Förbindning',
    definition: 'Visar de externa anslutningarna på en enskild apparat (t.ex. elmotor, regulator eller frekvensomriktare).',
    typicalContents: [
      'Klämplint i motor/apparat (U1, V1, W1, PE)',
      'Kopplingsbyglar för Stjärna (Y) eller Delta (Δ)',
      'Kabelinmatning och förskruvningsstorlek (M20, M25)',
    ],
    importance: 'Rekommenderad',
    relevantStandards: ['SS-EN 60204-1'],
    exampleFileName: '-MA1 &MC01',
  },
  {
    code: '&MD',
    letterCode: 'MD',
    mainClass: 'M',
    domainName: 'Anslutnings- och förbindningshandlingar',
    swedishTitle: 'Internt trådningsschema',
    englishTitle: 'Internal wiring diagram',
    category: 'Plintar & Förbindning',
    definition: 'Tillverkningsunderlag för skåpbyggare som visar den exakta trådföringen i trådkanalerna.',
    typicalContents: [
      'Trådnummer och ledararea (0.75 mm², 1.5 mm², 2.5 mm²)',
      'Ledarfärg (svart kraft, röd AC-styr, mörkblå DC-styr, ljusblå N, gul/grön PE)',
      'Tråddragningsordning och kanalrutter',
    ],
    importance: 'Valfri',
    relevantStandards: ['SS-EN 61439'],
    exampleFileName: '+W1 &MD01',
  },
  {
    code: '&MF',
    letterCode: 'MF',
    mainClass: 'M',
    domainName: 'Anslutnings- och förbindningshandlingar',
    swedishTitle: 'Byglingsschema',
    englishTitle: 'Jumper diagram',
    category: 'Plintar & Förbindning',
    definition: 'Visar fasta metallbyglar och kammar för sammankoppling av potentialer på plintrader.',
    typicalContents: [
      'Gemensam nolla (N) och skyddsjord (PE)',
      'Gemensam 24V DC plus- och minusmatning',
    ],
    importance: 'Valfri',
    relevantStandards: ['SS-EN 61082-1'],
    exampleFileName: '+W1 &MF01',
  },

  // --- KLASS L: Placeringsritningar och layouter ---
  {
    code: '&LD',
    letterCode: 'LD',
    mainClass: 'L',
    domainName: 'Placeringsritningar och layouter',
    swedishTitle: 'Apparatskåpslayout (Montageritning)',
    englishTitle: 'Enclosure / Cabinet layout diagram',
    category: 'Layouter & Placering',
    definition: 'Mekanisk ritning med exakta mått som visar placering av DIN-skenor, kabelkanaler, apparater och dörrkomponenter.',
    typicalContents: [
      'Skåpsdimensioner (H x B x D) och kapslingsklass (t.ex. IP54)',
      'Komponentplacering på montageplåt med beteckningar (-QA1, -KM1)',
      'Dörrlayout med tryckknappar, signallampor och HMI-display',
      'Kylfläktar, filter och värmeavgivningsberäkning',
    ],
    importance: 'Obligatorisk',
    relevantStandards: ['SS-EN 61439-1/-2', 'SS-EN 60204-1'],
    exampleFileName: '+W1 &LD01',
  },
  {
    code: '&LB',
    letterCode: 'LB',
    mainClass: 'L',
    domainName: 'Placeringsritningar och layouter',
    swedishTitle: 'Installationsritning (Kanalisation & Kabelvägar)',
    englishTitle: 'Installation layout / Cable routing drawing',
    category: 'Layouter & Placering',
    definition: 'Planritning över byggnad eller process med fysisk dragning av kabelstegar, rör och armaturer.',
    typicalContents: [
      'Kabelstegar, trådstegar och installationsrör (VP-rör)',
      'Placering av vägguttag, strömbrytare och armaturer',
      'Brandtätningar och sektioneringar',
    ],
    importance: 'Obligatorisk',
    relevantStandards: ['SS 436 40 00'],
    exampleFileName: '=BYGG1 +V1 &LB01',
  },
  {
    code: '&LC',
    letterCode: 'LC',
    mainClass: 'L',
    domainName: 'Placeringsritningar och layouter',
    swedishTitle: 'Utrymmeslayout (Ställverksrum / Elrum)',
    englishTitle: 'Room layout / Switchgear room arrangement',
    category: 'Layouter & Placering',
    definition: 'Ritning över apparatrum som visar ställverkens uppställning, betjäningsgångar och utrymningsvägar.',
    typicalContents: [
      'Betjäningsgångsbredder enligt standard (minst 700–800 mm)',
      'Kabelgravar, durkar och intag',
      'Nödbelysning och ögondusch/brandsläckare',
    ],
    importance: 'Rekommenderad',
    relevantStandards: ['SS 436 40 00', 'Arbetsmiljöverkets föreskrifter'],
    exampleFileName: '+ELRUM1 &LC01',
  },
  {
    code: '&LA',
    letterCode: 'LA',
    mainClass: 'L',
    domainName: 'Placeringsritningar och layouter',
    swedishTitle: 'Anläggningslayout (Situationsplan / Tomtkarta)',
    englishTitle: 'Plant layout / General arrangement',
    category: 'Layouter & Placering',
    definition: 'Övergripande karta över industriområde eller tomt med markkablar, nätstationer och matningssträckor.',
    typicalContents: [
      'Markförlagd hög- och lågspänningskabel',
      'Nätstationer och kabelskåp utomhus',
      'Jordtag och potentialutjämningsring',
    ],
    importance: 'Rekommenderad',
    relevantStandards: ['SS 436 40 00'],
    exampleFileName: '=ANL &LA01',
  },

  // --- KLASS P: Provning, kontroll och idrifttagning ---
  {
    code: '&PB',
    letterCode: 'PB',
    mainClass: 'P',
    domainName: 'Provning, kontroll och idrifttagning',
    swedishTitle: 'Provningsprotokoll (Elinstallationskontroll)',
    englishTitle: 'Test report / Inspection protocol',
    category: 'Provning & Idrifttagning',
    definition: 'Juridiskt bindande protokoll som intygar att mätningar enligt standard har utförts före idrifttagning.',
    typicalContents: [
      'Kontinuitetsprovning av skyddsledare (PE)',
      'Isolationsresistansmätning (minst 1.0 MΩ vid 500 V DC)',
      'Jordfelsbrytartest (utlösningstid och felström IΔn)',
      'Kortslutningsströmmar och slingimpedans (Z_loop)',
    ],
    importance: 'Obligatorisk',
    relevantStandards: ['SS 436 40 00 Del 6', 'SS-EN 60204-1 kap 18'],
    exampleFileName: '=PROV &PB01',
  },
  {
    code: '&PA',
    letterCode: 'PA',
    mainClass: 'P',
    domainName: 'Provning, kontroll och idrifttagning',
    swedishTitle: 'Provningsföreskrift (FAT / SAT-plan)',
    englishTitle: 'Test specification / Acceptance test plan',
    category: 'Provning & Idrifttagning',
    definition: 'Instruktion som anger exakt vilka tester och acceptanskriterier som ska uppfyllas vid fabrikstest eller sitetest.',
    typicalContents: [
      'FAT (Factory Acceptance Test) punkter',
      'SAT (Site Acceptance Test) punkter',
      'Acceptansgränser och godkännandekriterier',
    ],
    importance: 'Rekommenderad',
    relevantStandards: ['SS-EN 61439-1'],
    exampleFileName: '=KONTROLL &PA01',
  },
  {
    code: '&PC',
    letterCode: 'PC',
    mainClass: 'P',
    domainName: 'Provning, kontroll och idrifttagning',
    swedishTitle: 'Idrifttagningsprotokoll',
    englishTitle: 'Commissioning record',
    category: 'Provning & Idrifttagning',
    definition: 'Protokoll som dokumenterar första spänningssättning, rotationsriktningskontroll på motorer och funktionsverifiering.',
    typicalContents: [
      'Verifiering av fasspänning och fasföljd (L1-L2-L3 medurs)',
      'Tomgångsströmmar och driftsströmmar på motorer',
      'Verifikation av alla nödstopp och säkerhetsfunktioner',
    ],
    importance: 'Obligatorisk',
    relevantStandards: ['SS-EN 60204-1'],
    exampleFileName: '=START &PC01',
  },
  {
    code: '&PD',
    letterCode: 'PD',
    mainClass: 'P',
    domainName: 'Provning, kontroll och idrifttagning',
    swedishTitle: 'Egenkontrollplan & Besiktningsprotokoll',
    englishTitle: 'Quality inspection record',
    category: 'Provning & Idrifttagning',
    definition: 'Elinstallatörens egenkontrollprogram enligt Elsäkerhetsverkets krav för att säkerställa god elsäkerhetsteknisk praxis.',
    typicalContents: [
      'Visuell inspektion (dragavlastning, IP-skydd, beröringsskydd)',
      'Efterdragning av skruvförband enligt momenttabell',
      'Märkning av ledare och apparater',
    ],
    importance: 'Obligatorisk',
    relevantStandards: ['Elsäkerhetsverkets föreskrifter (ELSÄK-FS)', 'SS 436 40 00'],
    exampleFileName: '=KONTROLL &PD01',
  },

  // --- KLASS D: Allmänna tekniska handlingar & beräkningar ---
  {
    code: '&DA',
    letterCode: 'DA',
    mainClass: 'D',
    domainName: 'Allmänna tekniska handlingar',
    swedishTitle: 'Teknisk beskrivning (TB / Anläggningsbeskrivning)',
    englishTitle: 'Technical description',
    category: 'Beskrivning & Beräkning',
    definition: 'Textdokument som i detalj förklarar elanläggningens uppbyggnad, matningsprinciper och driftrutiner.',
    typicalContents: [
      'Övergripande elsystembeskrivning',
      'Reservkraftsautomatik och prioriterade laster',
      'Miljö- och driftsförhållanden (omgivningstemperatur, fukt)',
    ],
    importance: 'Rekommenderad',
    relevantStandards: ['SS-EN 60204-1'],
    exampleFileName: '=ANL &DA01',
  },
  {
    code: '&DC',
    letterCode: 'DC',
    mainClass: 'D',
    domainName: 'Allmänna tekniska handlingar',
    swedishTitle: 'Beräkningsunderlag (Spänningsfall, Kortslutning, Värme)',
    englishTitle: 'Calculation document',
    category: 'Beskrivning & Beräkning',
    definition: 'Matematiska dimensioneringsberäkningar som styrker att kablar, säkringar och ställverk uppfyller säkerhetskraven.',
    typicalContents: [
      'Spänningsfallsberäkningar (kontroll mot max 3–4 % tapp)',
      'Kortslutningsberäkning (utlösning inom 0.4s / 5s)',
      'Selektivitetsplan mellan över- och underliggande säkringar',
      'Värmeförlustberäkning i apparatskåp (Watt) för dimensionering av kylfläkt',
    ],
    importance: 'Obligatorisk',
    relevantStandards: ['SS 436 40 00', 'SS-EN 61439'],
    exampleFileName: '=KALK &DC01',
  },
  {
    code: '&DB',
    letterCode: 'DB',
    mainClass: 'D',
    domainName: 'Allmänna tekniska handlingar',
    swedishTitle: 'Teknisk datablad / Komponentspecifikation',
    englishTitle: 'Technical data sheet',
    category: 'Beskrivning & Beräkning',
    definition: 'Samling av tillverkares tekniska specifikationer för installerade nyckelkomponenter.',
    typicalContents: [
      'Datablad för transformatorer, brytare och motorer',
      'Märkdata och utlösningskurvor för dvärgbrytare',
    ],
    importance: 'Rekommenderad',
    relevantStandards: ['SS-EN 60204-1'],
    exampleFileName: '=SPEC &DB01',
  },
  {
    code: '&DD',
    letterCode: 'DD',
    mainClass: 'D',
    domainName: 'Allmänna tekniska handlingar',
    swedishTitle: 'Standardreferens & Projekteringsanvisning',
    englishTitle: 'Standard reference document',
    category: 'Beskrivning & Beräkning',
    definition: 'Förteckning över tillämpliga harmoniserade standarder, föreskrifter och beställarens interna elanvisningar.',
    typicalContents: [
      'Förteckning över SS-EN standarder',
      'Lokala nätägares anslutningskrav (t.ex. Vattenfall, E.ON, Ellevio)',
    ],
    importance: 'Valfri',
    relevantStandards: ['SS 436 40 00'],
    exampleFileName: '=REF &DD01',
  },

  // --- KLASS E: Kravspecifikationer & Funktion ---
  {
    code: '&ED',
    letterCode: 'ED',
    mainClass: 'E',
    domainName: 'Kravspecifikationer',
    swedishTitle: 'Funktionsbeskrivning (Process- & Styrbeskrivning)',
    englishTitle: 'Function description',
    category: 'Beskrivning & Beräkning',
    definition: 'Beskriver exakt hur anläggningen ska fungera i drift: start/stopp-villkor, automatik, larm och säkerhetsförreglingar.',
    typicalContents: [
      'Normaldrift och sekvensförlopp',
      'Larmtabell med larmgränser och prioritet',
      'Förreglingar (t.ex. pump får ej starta vid torrkörning)',
    ],
    importance: 'Obligatorisk',
    relevantStandards: ['SS-EN 60204-1', 'SS-EN ISO 13849-1'],
    exampleFileName: '=PROCESS &ED01',
  },
  {
    code: '&EC',
    letterCode: 'EC',
    mainClass: 'E',
    domainName: 'Kravspecifikationer',
    swedishTitle: 'Säkerhetskravspecifikation (Riskanalys & PL/SIL)',
    englishTitle: 'Safety requirements specification',
    category: 'Beskrivning & Beräkning',
    definition: 'Dokumentation av riskbedömning, säkerhetsfunktioner, Performance Level (PL) och SIL-krav enligt Maskindirektivet.',
    typicalContents: [
      'Riskanalys enligt SS-EN ISO 12100',
      'Krav på Performance Level (PL r) och Category',
      'Säkerhetsfunktionernas arkitektur och stopptidmätning',
    ],
    importance: 'Obligatorisk vid maskiner',
    relevantStandards: ['SS-EN ISO 13849-1', 'SS-EN 62061', 'Maskindirektivet'],
    exampleFileName: '=SAFE &EC01',
  },
  {
    code: '&EA',
    letterCode: 'EA',
    mainClass: 'E',
    domainName: 'Kravspecifikationer',
    swedishTitle: 'Systemkravspecifikation',
    englishTitle: 'System requirements specification',
    category: 'Beskrivning & Beräkning',
    definition: 'Övergripande kravspecifikation från beställare inför upphandling och projektering.',
    typicalContents: ['Krav på kapacitet, spänningskvalitet och drifttillgänglighet'],
    importance: 'Valfri',
    relevantStandards: ['SS-EN 60204-1'],
    exampleFileName: '=REQ &EA01',
  },

  // --- KLASS A: Projektledning och allmänna dokument ---
  {
    code: '&AA',
    letterCode: 'AA',
    mainClass: 'A',
    domainName: 'Projektledning och allmänna dokument',
    swedishTitle: 'Dokumentförteckning (Ritningsförteckning / Pärmregister)',
    englishTitle: 'Document list / Table of contents',
    category: 'Allmänt & Projekt',
    definition: 'Sammanställning av alla handlingar som ingår i relationshandlingarna eller dokumentationspaketet.',
    typicalContents: [
      'Dokumentnummer med DCC-kod (&FS, &MA, &LD etc.)',
      'Dokumentrubrik och antal blad',
      'Revisionsbeteckning och datum för godkännande',
      'Ansvarig konstruktör och granskare',
    ],
    importance: 'Obligatorisk',
    relevantStandards: ['SS-EN 61355-1', 'SS-EN 60204-1'],
    exampleFileName: '=PROJ &AA01',
  },
  {
    code: '&AD',
    letterCode: 'AD',
    mainClass: 'A',
    domainName: 'Projektledning och allmänna dokument',
    swedishTitle: 'Ändringsförteckning (Revisionshistorik)',
    englishTitle: 'Change record / Revision history',
    category: 'Allmänt & Projekt',
    definition: 'Loggbok över alla utförda ändringar, datum och orsak till revidering under projektets livscykel.',
    typicalContents: ['Revisionsdatum', 'Beskrivning av ändring', 'Signatur'],
    importance: 'Rekommenderad',
    relevantStandards: ['SS-EN 61355-1'],
    exampleFileName: '=PROJ &AD01',
  },
  {
    code: '&AB',
    letterCode: 'AB',
    mainClass: 'A',
    domainName: 'Projektledning och allmänna dokument',
    swedishTitle: 'Projekteringsunderlag / Tidsplan',
    englishTitle: 'Project management plan',
    category: 'Allmänt & Projekt',
    definition: 'Projektstyrningsdokument för planering av elkonstruktion och montage.',
    typicalContents: ['Milstolpar, granskningsdatum och leveransdagar'],
    importance: 'Valfri',
    relevantStandards: ['SS-EN 61355-1'],
    exampleFileName: '=PROJ &AB01',
  },

  // --- KLASS Q: Drift, skötsel och underhåll ---
  {
    code: '&QA',
    letterCode: 'QA',
    mainClass: 'Q',
    domainName: 'Drift, skötsel och underhåll',
    swedishTitle: 'Driftinstruktion (Användarmanual)',
    englishTitle: 'Operating manual',
    category: 'Drift & Underhåll',
    definition: 'Instruktion för driftspersonal om hur anläggningen startas, övervakas, stoppas och hanteras vid nödlägen.',
    typicalContents: [
      'Normal start- och stopprutin',
      'Nödstopp och återställning',
      'Betydelse av larm och fellampor',
    ],
    importance: 'Obligatorisk',
    relevantStandards: ['SS-EN 60204-1', 'Maskindirektivet'],
    exampleFileName: '=DRIFT &QA01',
  },
  {
    code: '&QB',
    letterCode: 'QB',
    mainClass: 'Q',
    domainName: 'Drift, skötsel och underhåll',
    swedishTitle: 'Skötselinstruktion (Underhållsplan)',
    englishTitle: 'Maintenance manual',
    category: 'Drift & Underhåll',
    definition: 'Föreskrifter för förebyggande underhåll, periodisk kontroll, smörjning och rengöring.',
    typicalContents: [
      'Intervall för efterdragning av skruvförband (1 år)',
      'Rengöring och byte av filtermattor på skåpsfläktar',
      'Batteribyte i UPS och PLC-minnesbackup',
      'Termografering (värmekamerainspektion)',
    ],
    importance: 'Obligatorisk',
    relevantStandards: ['SS-EN 60204-1', 'SS-EN 61439'],
    exampleFileName: '=DRIFT &QB01',
  },
  {
    code: '&QC',
    letterCode: 'QC',
    mainClass: 'Q',
    domainName: 'Drift, skötsel och underhåll',
    swedishTitle: 'Reservdelslista (Slitdelsförteckning)',
    englishTitle: 'Spare parts list',
    category: 'Drift & Underhåll',
    definition: 'Förteckning över rekommenderade reservdelar för att minimera stilleståndstid vid komponenthaveri.',
    typicalContents: [
      'Komponentbeteckning (-QA1, -KM1 osv.)',
      'Tillverkare och exakt beställningsnummer / E-nummer',
      'Rekommenderat antal i reservdelslager på site',
    ],
    importance: 'Rekommenderad',
    relevantStandards: ['SS-EN 60204-1'],
    exampleFileName: '=DRIFT &QC01',
  },
  {
    code: '&QD',
    letterCode: 'QD',
    mainClass: 'Q',
    domainName: 'Drift, skötsel och underhåll',
    swedishTitle: 'Felsökningsinstruktion (Larm- & Åtgärdslista)',
    englishTitle: 'Troubleshooting guide',
    category: 'Drift & Underhåll',
    definition: 'Vägledning för tekniker med symtom, troliga felorsaker och rekommenderade åtgärder vid driftstopp.',
    typicalContents: ['Larmkoder och felorsaker', 'Mätpunkter för spänningskontroll'],
    importance: 'Rekommenderad',
    relevantStandards: ['SS-EN 60204-1'],
    exampleFileName: '=DRIFT &QD01',
  },

  // --- KLASS W: Mjukvara, nätverk och konfiguration ---
  {
    code: '&WC',
    letterCode: 'WC',
    mainClass: 'W',
    domainName: 'Mjukvara och nätverk',
    swedishTitle: 'Parameterlista (Frekvensomriktare / Mjukstartare / Skydd)',
    englishTitle: 'Parameter list / Device configuration',
    category: 'Mjukvara & Parametrar',
    definition: 'Dokumentation av alla inställda parametrar i programmerbara enheter för att möjliggöra snabb återställning vid byte.',
    typicalContents: [
      'Frekvensomriktarparametrar (motor märkdata, ramptider, maxfrekvens)',
      'Elektroniska motorskyddsinställningar',
      'Temperaturregulatorers PID-parametrar',
    ],
    importance: 'Obligatorisk vid VFD',
    relevantStandards: ['SS-EN 60204-1'],
    exampleFileName: '-TF1 &WC01',
  },
  {
    code: '&WD',
    letterCode: 'WD',
    mainClass: 'W',
    domainName: 'Mjukvara och nätverk',
    swedishTitle: 'Nätverkskonfiguration & Fältbusslista',
    englishTitle: 'Network / Fieldbus configuration list',
    category: 'Mjukvara & Parametrar',
    definition: 'Förteckning över industriella nätverk med IP-adresser, subnät, fältbussadresser och porttilldelning.',
    typicalContents: [
      'IP-adresser, nätmask och gateway',
      'Profinet / Profibus node-adresser (Device Name / Node ID)',
      'Modbus RTU slav-adresser och baudrate (9600, 19200, 115200)',
    ],
    importance: 'Obligatorisk vid nätverk',
    relevantStandards: ['SS-EN 60204-1'],
    exampleFileName: '=NET &WD01',
  },
  {
    code: '&WA',
    letterCode: 'WA',
    mainClass: 'W',
    domainName: 'Mjukvara och nätverk',
    swedishTitle: 'Mjukvarustruktur / Systemarkitektur',
    englishTitle: 'Software architecture description',
    category: 'Mjukvara & Parametrar',
    definition: 'Beskrivning av PLC-programmets uppbyggnad, programblock (OB, FB, FC), datablock och cykeltider.',
    typicalContents: ['Programblocksförteckning', 'Gränssnitt mot SCADA/HMI'],
    importance: 'Valfri',
    relevantStandards: ['SS-EN 61131-3'],
    exampleFileName: '=SOFT &WA01',
  },
  {
    code: '&WB',
    letterCode: 'WB',
    mainClass: 'W',
    domainName: 'Mjukvara och nätverk',
    swedishTitle: 'Programkodutskrift / PLC-backup',
    englishTitle: 'Software source code / Program listing',
    category: 'Mjukvara & Parametrar',
    definition: 'Komplett arkiverad utskrift eller säkerhetskopia av styrprogramkoden.',
    typicalContents: ['Logik, kommentarer och funktionsblock i ladder, funktionsblock eller strukturerad text'],
    importance: 'Rekommenderad',
    relevantStandards: ['SS-EN 61131-3'],
    exampleFileName: '=PLC &WB01',
  },
];

/**
 * Standard Project Templates for Document Selection (Urval av dokument)
 */
export const IEC_61355_PROJECT_TEMPLATES: Iec61355ProjectTemplate[] = [
  {
    id: 'control_cabinet_machine',
    name: 'Apparatskåp & Maskinstyrning (Automation / CE-märkning)',
    description: 'Komplett dokumentationspaket för elkonstruktion av maskiner och styrsystem enligt Maskindirektivet / Maskinförordningen och SS-EN 60204-1.',
    badge: 'Industri & Maskin',
    targetApplication: 'Tillverkare av apparatskåp, maskinbyggare, automationsintegratörer.',
    standardReference: 'SS-EN 60204-1, SS-EN ISO 13849-1, SS-EN 61439-1/-2',
    recommendedDocs: [
      { letterCode: 'AA', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Obligatorisk pärm- och innehållsförteckning' },
      { letterCode: 'FS', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Kretsschema (huvud- och manöverkretsar)' },
      { letterCode: 'LD', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Mekanisk skåpslayout och dörrvy med mått' },
      { letterCode: 'MA', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Plinttabell för alla in- och utgående plintrader' },
      { letterCode: 'ME', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Kabellista till motorer och fältgivare' },
      { letterCode: 'FN', requirementLevel: 'Krav (Lag/Standard)', customNote: 'I/O-signallista för PLC' },
      { letterCode: 'EC', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Säkerhetsanalys och Performance Level (PL)' },
      { letterCode: 'ED', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Funktionsbeskrivning för drift och sekvenser' },
      { letterCode: 'PB', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Provningsprotokoll (kontinuitet, isolation)' },
      { letterCode: 'QA', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Drift- och användarinstruktion' },
      { letterCode: 'QB', requirementLevel: 'Rekommenderad praxis', customNote: 'Förebyggande underhållsplan för elutrustning' },
      { letterCode: 'QC', requirementLevel: 'Rekommenderad praxis', customNote: 'Slit- och reservdelslista' },
      { letterCode: 'WC', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Parameterlista om frekvensomriktare ingår' },
      { letterCode: 'WD', requirementLevel: 'Vid behov', customNote: 'IP- och fältbusslista om Ethernet/Profinet används' },
    ],
  },
  {
    id: 'building_distribution',
    name: 'Fastighetsel & Lågspänningsställverk (SS 436 40 00)',
    description: 'Dokumentationspaket för fastighetsinstallationer, huvudcentraler och ställverk i bostäder, kontor och kommersiella lokaler.',
    badge: 'Fastighet & Bygg',
    targetApplication: 'Elinstallatörer, elkonstruktörer och fastighetsförvaltare.',
    standardReference: 'SS 436 40 00 (Elinstallationsreglerna), SS-EN 61439-1/-3',
    recommendedDocs: [
      { letterCode: 'AA', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Handling- och ritningsförteckning' },
      { letterCode: 'FT', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Enlinjeschema med säkringar, areor och kablar' },
      { letterCode: 'DC', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Spänningsfalls- och kortslutningsberäkningar' },
      { letterCode: 'LB', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Installationsritning (placering av uttag/belysning)' },
      { letterCode: 'LD', requirementLevel: 'Rekommenderad praxis', customNote: 'Centralens gruppförteckning och normlayout' },
      { letterCode: 'PB', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Kontroll före idrifttagning (SS 436 40 00 Del 6)' },
      { letterCode: 'PD', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Elinstallationsföretagets egenkontrollplan' },
      { letterCode: 'ME', requirementLevel: 'Rekommenderad praxis', customNote: 'Kabellista för matarkablar till undercentraler' },
      { letterCode: 'QA', requirementLevel: 'Rekommenderad praxis', customNote: 'Drift- och skötselpärm (DU-instruktion)' },
    ],
  },
  {
    id: 'pv_bess_solar',
    name: 'Solcellsanläggning & Batterilager (PV & BESS)',
    description: 'Dokumentationsunderlag för nätanslutna solcellsanläggningar, växelriktare och energilager med batterier.',
    badge: 'Förnybar Energi',
    targetApplication: 'Solcellsinstallatörer, energikonsulter och besiktningsmän.',
    standardReference: 'SS-EN 62446-1 (Solcellsdokumentation), SS 436 40 00, SEK Handbok 457',
    recommendedDocs: [
      { letterCode: 'AA', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Dokumentförteckning för solcellsanläggningen' },
      { letterCode: 'FT', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Enlinjeschema med DC- och AC-sida, brytare och överspänningsskydd' },
      { letterCode: 'LA', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Modullayout på tak samt kabelföring' },
      { letterCode: 'DC', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Strängspänningsberäkning (Voc_max) och spänningsfall DC/AC' },
      { letterCode: 'PB', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Provningsprotokoll: Isolationsresistans, Voc och Isc per sträng' },
      { letterCode: 'DB', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Datablad för solpaneler, växelriktare och batteri' },
      { letterCode: 'QA', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Räddningstjänstens varselmärkning och driftstoppsrutin' },
      { letterCode: 'WC', requirementLevel: 'Rekommenderad praxis', customNote: 'Växelriktarens nätkodsparametrar (t.ex. svenskt nät 50Hz/400V)' },
    ],
  },
  {
    id: 'pump_station_water',
    name: 'Pumpstation & VA-anläggning (Kommunal / Industriell)',
    description: 'Omfattande dokumentation för automatiserade pumpstationer, avloppsanläggningar och reningsverk.',
    badge: 'VA & Infrastruktur',
    targetApplication: 'Kommuner, VA-ingenjörer och elentreprenörer.',
    standardReference: 'SS-EN 60204-1, SS-EN 61439, AMA El',
    recommendedDocs: [
      { letterCode: 'AA', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Dokumentförteckning' },
      { letterCode: 'FT', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Enlinjeschema med reservkraftsintag' },
      { letterCode: 'FS', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Kretsscheman för pumpmotorer, mjukstartare och larm' },
      { letterCode: 'MA', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Plinttabeller för pumpgrop och givare' },
      { letterCode: 'ME', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Kabellista med EX-krav och längder' },
      { letterCode: 'FN', requirementLevel: 'Krav (Lag/Standard)', customNote: 'I/O-lista för nivåer, flöden och pumpdrifter' },
      { letterCode: 'ED', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Funktionsbeskrivning (växling mellan pumpar, bräddning)' },
      { letterCode: 'LD', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Apparatskåpsritning med klimathållning' },
      { letterCode: 'PB', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Elinstallationskontroll och jordtagsprovning' },
      { letterCode: 'WC', requirementLevel: 'Krav (Lag/Standard)', customNote: 'Parameterinställningar för mjukstartare/VFD' },
    ],
  },
];

/**
 * Filter function to search across IEC 61355 entries
 */
export function searchIec61355(
  query: string,
  selectedCategory: string = 'Alla',
  selectedMainClass: string = 'Alla'
): Iec61355DocumentKind[] {
  const cleanQuery = query.trim().toLowerCase();

  return IEC_61355_ENTRIES.filter((entry) => {
    // 1. Category filter
    if (selectedCategory !== 'Alla' && entry.category !== selectedCategory) {
      return false;
    }

    // 2. Main class filter
    if (selectedMainClass !== 'Alla' && entry.mainClass !== selectedMainClass) {
      return false;
    }

    // 3. Search query
    if (!cleanQuery) return true;

    // Code matches (with or without '&')
    if (entry.code.toLowerCase() === cleanQuery || entry.letterCode.toLowerCase() === cleanQuery) {
      return true;
    }
    if (entry.code.toLowerCase().includes(cleanQuery) || entry.letterCode.toLowerCase().includes(cleanQuery)) {
      return true;
    }

    // Swedish & English titles
    if (entry.swedishTitle.toLowerCase().includes(cleanQuery)) return true;
    if (entry.englishTitle.toLowerCase().includes(cleanQuery)) return true;

    // Definition
    if (entry.definition.toLowerCase().includes(cleanQuery)) return true;

    // Typical contents
    const matchContents = entry.typicalContents.some((c) =>
      c.toLowerCase().includes(cleanQuery)
    );
    if (matchContents) return true;

    // Relevant standards
    const matchStandards = entry.relevantStandards.some((s) =>
      s.toLowerCase().includes(cleanQuery)
    );
    if (matchStandards) return true;

    return false;
  });
}
