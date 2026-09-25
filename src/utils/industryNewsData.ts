export interface IndustryNewsItem {
  id: string;
  source: 'Elsäkerhetsverket' | 'SEK Elstandard' | 'Tidningen Automation' | 'Svensk Byggtjänst / AMA';
  sourceCategory: 'Föreskrifter & Myndighet' | 'Standardisering & SS-EN' | 'Automation & Industri' | 'AMA & Bygghandlingar';
  title: string;
  excerpt: string;
  fullText: string;
  date: string;
  readTime: string;
  tags: string[];
  impactForDesigners: string;
  externalUrl?: string;
  featured?: boolean;
}

export const INDUSTRY_NEWS: IndustryNewsItem[] = [
  {
    id: 'esv-solceller-bess-2026',
    source: 'Elsäkerhetsverket',
    sourceCategory: 'Föreskrifter & Myndighet',
    title: 'Uppdaterade råd för installation och besiktning av batterilager (BESS) och solceller',
    excerpt: 'Elsäkerhetsverket förtydligar krav på termisk rusning, DC-brytare, brandcellsgränser och nödbrytning för stationära batterisystem i fastigheter.',
    fullText: `Elsäkerhetsverket har publicerat en fördjupad vägledning för elinstallatörer och elkonstruktörer gällande projektering och montage av stationära energilager (BESS) och kommersiella solcellsanläggningar.

Vägledningen betonar:
1. Krav på godkänd DC-frånskiljare placerad lättåtkomligt vid växelriktare och batteri rack.
2. Riskanalys avseende termisk rusning (thermal runaway) och gasutveckling. Batterirum ska normalt utgöra egen brandcell med adresserbart brandlarm och explosionssäker ventilation vid bly-/litiumteknik.
3. Tydlig märkning vid fastighetens servis och huvudcentral med skyltning "Varning: Dubbel matning / Solceller och Batterilager".
4. Verifiering av skyddsjordning och potentialutjämning (PUS) för montagekonstruktioner på tak.`,
    date: '2026-09-18',
    readTime: '3 min',
    tags: ['BESS', 'Solceller', 'DC-installation', 'Brandskydd', 'Elsäkerhet'],
    impactForDesigners: 'Elkonstruktören måste inkludera räddningsbrytare på ritning (=PV +W1 -QA_DC), separata brandcellsgenomföringar och varningsskyltar enligt ELSÄK-FS och Boverkets byggregler.',
    externalUrl: 'https://www.elsakerhetsverket.se',
    featured: true,
  },
  {
    id: 'sek-ss4364000-utg4',
    source: 'SEK Elstandard',
    sourceCategory: 'Standardisering & SS-EN',
    title: 'Elinstallationsreglerna SS 436 40 00: Skärpta krav på överspänningsskydd och DC-laddning',
    excerpt: 'SEK Svensk Elstandard understryker tillämpningen av Elinstallationsreglerna med fokus på Typ 2 transientöverspänningsskydd och dedikerade JFB för elbilsladdning.',
    fullText: `Enligt SS 436 40 00 (Elinstallationsreglerna) ställs tydliga krav på skydd mot transienta överspänningar orsakade av atmosfäriska urladdningar eller kopplingsförlopp i elnätet.

Viktiga punkter för elkonstruktörer:
• Överspänningsskydd (SPD) Typ 2 krävs i alla nya elcentraler där verksamheten omfattar publika lokaler, kommersiell verksamhet, eller där dyrbar elektronisk utrustning finns.
• Vid laddstationer för fordon ska varje anslutningspunkt skyddas av egen jordfelsbrytare (Typ A med RDC-DD 6 mA DC-detektering eller Typ B).
• Tillåtet spänningsfall rekommenderas till max 3 % för belysning och 5 % för övriga förbrukare mellan mätpunkt och belastning.`,
    date: '2026-09-10',
    readTime: '4 min',
    tags: ['SS 436 40 00', 'Överspänningsskydd', 'Spänningsfall', 'Laddinfrastruktur', 'SEK'],
    impactForDesigners: 'Dimensionera alltid kabelarean med hänsyn till maximalt 3 % / 5 % spänningsfall och rita in SPD-transientavledare (-FB) i huvud- och undercentraler.',
    externalUrl: 'https://www.elstandard.se',
    featured: true,
  },
  {
    id: 'auto-spe-ethernet-apl-2026',
    source: 'Tidningen Automation',
    sourceCategory: 'Automation & Industri',
    title: 'Single Pair Ethernet (SPE) och Ethernet-APL slår igenom i svensk processindustri',
    excerpt: 'Övergången från traditionella 4-20 mA och RS485-fältbussar till tvåtråds-Ethernet med strömförsörjning (PoDL) accelererar i nya automationsprojekt.',
    fullText: `Single Pair Ethernet (SPE enligt IEEE 802.3cg) och Ethernet Advanced Physical Layer (Ethernet-APL) etablerar sig snabbt som den nya standarden för fältkommunikation i apparatskåp och processanläggningar.

Tekniken möjliggör 10 Mbit/s full duplex över en enda partvinnad ledare upp till 1 000 meters avstånd, samtidigt som fältsensorer och ställdon matas med effekt via Power over Data Line (PoDL).

Fördelar i projekt:
• Ersätter analoga 0-10V och 4-20 mA slingor med direkta IP-adresser till varje givare.
• Tillåter direkt OPC UA- eller Modbus TCP-kommunikation ända ut i explosionsfarliga miljöer (Zone 0/1).
• Dramatisk minskning av kabelvikt och plintutrymme i apparatskåp.`,
    date: '2026-09-02',
    readTime: '5 min',
    tags: ['SPE', 'Ethernet-APL', 'Industri 4.0', 'Processautomation', 'Fältbuss'],
    impactForDesigners: 'I apparatskåp (&FE) och kretsscheman (&FS) minskar antalet plintar radikalt då analoga I/O-moduler ersätts med tvåtråds SPE-switchar.',
    externalUrl: 'https://www.automation.se',
    featured: true,
  },
  {
    id: 'sek-iec81346-61355-harmonization',
    source: 'SEK Elstandard',
    sourceCategory: 'Standardisering & SS-EN',
    title: 'Harmonisering av SS-EN IEC 81346 och IEC 61355 i digitala BIM- och CAD-leveranser',
    excerpt: 'SEK TK 3 presenterar riktlinjer för hur referensbeteckningssystemet (RDS) kopplas ihop med handlingstyper i moderna CAD-miljöer (EPLAN, AutoCAD, Revit).',
    fullText: `SEK TK 3 (Dokumentation och grafiska symboler) betonar vikten av att använda enhetliga prefix vid digital överlämning:
- '=' Funktion/System (IEC 81346-1)
- '+' Placering/Utrymme (IEC 81346-1)
- '&' Dokumentklass / Handlingstyp (IEC 61355-1)
- '-' Produkt / Komponent (IEC 81346-2)
- ':' Klämma / Anslutningspunkt (IEC 81346-1)

Genom att använda denna syntax direkt i CAD-block och metadata underlättas integrationen mot överordnade SCADA-system, relationshandlingar och fastighetsförvaltning.`,
    date: '2026-08-28',
    readTime: '3 min',
    tags: ['IEC 81346', 'IEC 61355', 'CAD-standard', 'BIM', 'Ritningsbeteckningar'],
    impactForDesigners: 'Säkerställ att ritningshuvuden innehåller DCC-kod med prefix & (t.ex. &FS01) och att apparatlistor (-FA) exporteras med fullständig postbeteckning.',
    externalUrl: 'https://www.elstandard.se',
  },
  {
    id: 'esv-egenkontroll-besiktning-2026',
    source: 'Elsäkerhetsverket',
    sourceCategory: 'Föreskrifter & Myndighet',
    title: 'Fokus på kontroll före idrifttagning och rutiner i egenkontrollprogrammet',
    excerpt: 'Tillsynsbesök visar på brister i dokumenterad isolationsmätning och kontinuitetsprovning före spänningssättning enligt SS-EN 60204-1 och SS 436 40 00.',
    fullText: `Elsäkerhetsverket genomför under året en nationell tillsynsinsats med fokus på installationsföretagens egenkontrollprogram (EKP) och kontroll före idrifttagning.

Vanliga avvikelser som uppmärksammats:
1. Bristande dokumentation av PE-kontinuitetsmätning och provning av jordfelsbrytarens utlösningstid.
2. Isolationsresistansmätning med 500 V DC har inte utförts eller dokumenterats före inkoppling av känslig elektronik.
3. Relationshandlingar och uppmärkning stämmer inte överens med det faktiska montaget i elcentraler.`,
    date: '2026-08-19',
    readTime: '3 min',
    tags: ['Egenkontroll', 'Idrifttagning', 'Besiktning', 'Elsäkerhetsverket', 'Dokumentation'],
    impactForDesigners: 'Konstruktören ska alltid bifoga en provningsblankett eller hänvisa till IEC 61355 handlingstyp &PM (Provningsprotokoll) i relationsleveransen.',
    externalUrl: 'https://www.elsakerhetsverket.se',
  },
  {
    id: 'ama-el25-updates',
    source: 'Svensk Byggtjänst / AMA',
    sourceCategory: 'AMA & Bygghandlingar',
    title: 'AMA EL 25: Nya koder för datacenterinfrastruktur, DC-mikronät och återbruk',
    excerpt: 'Svensk Byggtjänst har reviderat AMA EL med nya koder i kapitel E för cirkulärt installationsmateriel, energilager och digital belysningsstyrning.',
    fullText: `I nya AMA EL 25 introduceras flera efterlängtade uppdateringar för el- och telekonsulter:
• Nya underkoder för stationära batterisystem under EE (Kraftförsörjningssystem).
• Preciserade krav på DALI-2 certifiering och närvarostyrning under ELB och ELE.
• Nya BSAB-koder och AMA-texter för återbruk av kabelstegar (EBC) och demonterbara fönsterbänkskanaler (EBD).
• Harmonisering med CoClass för digitala BIM-objekt.`,
    date: '2026-08-12',
    readTime: '4 min',
    tags: ['AMA EL 25', 'BSAB 96', 'Bygghandlingar', 'Återbruk', 'DALI-2'],
    impactForDesigners: 'Uppdatera rambeskrivningsmallar med de nya AMA-koderna för batterilagring och DALI-2 ljusstyrning.',
    externalUrl: 'https://byggtjanst.se',
  },
  {
    id: 'auto-cybersecurity-iec62443',
    source: 'Tidningen Automation',
    sourceCategory: 'Automation & Industri',
    title: 'NIS 2-direktivet och IEC 62443: Hårdare säkerhetskrav på apparatskåp och OT-nätverk',
    excerpt: 'Industriella styrsystem och fastighetsautomation omfattas av nya krav på segmentering, brandväggar och lösenordshantering i fält.',
    fullText: `I takt med att EU:s NIS 2-direktiv implementeras i svensk lag skärps kraven på cybersäkerhet för drift- och automationsnät (OT).

Konstruktörer av automationsskåp måste nu ta hänsyn till:
• Fysisk låsning av apparatskåp med loggad åtkomst.
• Strikt nätverkssegmentering (Zoner och Conduits enligt IEC 62443).
• Inga förvalda standardlösenord på PLC, HMI eller routrar.
• Trådlös programmering (WiFi/Bluetooth) i ställverk förbjuds utan multifaktorautentisering.`,
    date: '2026-08-04',
    readTime: '4 min',
    tags: ['NIS 2', 'IEC 62443', 'Cybersäkerhet', 'OT-nätverk', 'PLC'],
    impactForDesigners: 'Räkna in industriella brandväggar och switchar med 802.1X-autentisering i apparatlistan (&FA) och IP-adressplanen (&WD).',
    externalUrl: 'https://www.automation.se',
  },
];

export const STANDARDS_STATUS = [
  {
    standard: 'SS 436 40 00',
    edition: 'Utgåva 4 (Elinstallationsreglerna)',
    status: 'Gällande',
    badgeColor: 'emerald',
    description: 'Dimensionering, skyddsåtgärder och installationssätt för lågspänningsanläggningar.',
  },
  {
    standard: 'SS-EN IEC 81346-2',
    edition: 'Utgåva 2 (2019)',
    status: 'Gällande',
    badgeColor: 'indigo',
    description: 'Struktureringsprinciper och referensbeteckningar (tvåbokstavskoder för elkomponenter).',
  },
  {
    standard: 'SS-EN 61355-1',
    edition: 'Klassificering av dokument (DCC)',
    status: 'Gällande',
    badgeColor: 'cyan',
    description: 'Dokumentkoder (&FS, &FA, &FL etc.) för ritningar, scheman och tekniska anvisningar.',
  },
  {
    standard: 'SS-EN 60204-1',
    edition: 'Utgåva 5 (Maskiners elutrustning)',
    status: 'Gällande',
    badgeColor: 'amber',
    description: 'Säkerhetskrav, manöverspänning, nödstopp och skydd för elektrisk utrustning i maskiner.',
  },
  {
    standard: 'AMA EL 25',
    edition: 'Svensk Byggtjänst',
    status: 'Gällande',
    badgeColor: 'emerald',
    description: 'Allmän material- och arbetsbeskrivning för eltekniska arbeten och BSAB 96.',
  },
];
