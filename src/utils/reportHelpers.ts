import { PdfReportData } from '../types/report';
import { formatElectrNumber } from './electricalMath';
import { CalculationResult } from '../types/electrical';

/**
 * Creates a complete, professional PdfReportData for Voltage Drop calculation
 */
export function createVoltageDropReportData(params: {
  phaseType: '1-phase' | '3-phase';
  voltage: number;
  current: number;
  length: number;
  area: number;
  material: 'cu' | 'al';
  cosPhi: number;
  maxDropPct: number;
  deltaU: number;
  dropPercent: number;
  endVoltage: number;
  rSingle: number;
  powerLoss: number;
  isWithinLimit: boolean;
  projectName?: string;
  authorName?: string;
  clientName?: string;
  facilityCode?: string;
}): PdfReportData {
  const is1P = params.phaseType === '1-phase';
  const gamma = params.material === 'cu' ? 56 : 34;
  const factorStr = is1P ? '2' : '√3 (≈ 1.732)';
  const factorNum = is1P ? 2 : Math.sqrt(3);

  const statusText = params.isWithinLimit
    ? `Godkänd installation enligt SS 436 40 00 (ΔU = ${formatElectrNumber(params.dropPercent, 2)}% ≤ ${params.maxDropPct}%)`
    : `Avvikelse: Spänningsfallet (${formatElectrNumber(params.dropPercent, 2)}%) överskrider tillåtet gränsvärde (${params.maxDropPct}%)`;

  return {
    calculationType: 'voltage_drop',
    title: `Spänningsfalls- & Ledningsdimensioneringsrapport (${is1P ? '1-Fas 230V' : '3-Fas 400V'})`,
    subtitle: `Dimensioneringsunderlag för ledningsresistans, spänningsfall och termiska ledarförluster enligt SS 436 40 00 och SEK Handbok 444`,
    docCode: '&BD01',
    systemTag: params.facilityCode || (is1P ? '=P1 +W1 -W01' : '=P1 +W1 -W10'),
    projectName: params.projectName || 'Nybyggnad / Ombyggnad Elanläggning',
    authorName: params.authorName || 'Elkonstruktör / EDA Toolbox',
    clientName: params.clientName || 'Fastighetsägare / Byggherre',
    dateStr: new Date().toISOString().split('T')[0],
    notes: `Kabeldimensionering utförd med ledningslängd ${params.length} m och ledararea ${params.area} mm² (${params.material === 'cu' ? 'Koppar Cu' : 'Aluminium Al'}).`,

    statusBadge: {
      text: statusText,
      type: params.isWithinLimit ? 'success' : 'error',
    },

    inputs: [
      {
        label: 'Systemspänning (U)',
        value: `${params.voltage}`,
        unit: 'V',
        description: is1P ? 'Enfassystem Fas-Nolla (230 V nominell)' : 'Trefassystem Huvudspänning (400 V)',
      },
      {
        label: 'Belastningsström (Ib)',
        value: `${formatElectrNumber(params.current, 1)}`,
        unit: 'A',
        description: 'Märkdriftström vid full kontinuerlig belastning',
      },
      {
        label: 'Enkel ledningslängd (L)',
        value: `${formatElectrNumber(params.length, 1)}`,
        unit: 'm',
        description: 'Fysisk sträckning mellan elcentral och förbrukningspunkt',
      },
      {
        label: 'Ledararea (A)',
        value: `${params.area}`,
        unit: 'mm²',
        description: `Märkarea för ${params.material === 'cu' ? 'Cu-ledare' : 'Al-ledare'}`,
      },
      {
        label: 'Ledarmaterial',
        value: params.material === 'cu' ? 'Koppar (Cu)' : 'Aluminium (Al)',
        unit: `γ = ${gamma} m/(Ω·mm²)`,
        description: `Elektrisk ledningsförmåga (konduktivitet) vid 20°C`,
      },
      {
        label: 'Effektfaktor (cos φ)',
        value: `${formatElectrNumber(params.cosPhi, 2)}`,
        unit: '0.0 – 1.0',
        description: params.cosPhi >= 0.98 ? 'Rent resistiv last (värme/glödljus)' : 'Induktiv last (motor/driftdon)',
      },
      {
        label: 'Tillåtet spänningsfall',
        value: `${params.maxDropPct}`,
        unit: '%',
        description: 'Gränsvärde enligt SS 436 40 00 tabell 525',
      },
    ],

    results: [
      {
        label: 'Spänningsfall (ΔU)',
        value: `${formatElectrNumber(params.deltaU, 2)}`,
        unit: 'V',
        highlight: true,
        description: `${formatElectrNumber(params.dropPercent, 2)} % av ${params.voltage} V`,
      },
      {
        label: 'Spänning vid last',
        value: `${formatElectrNumber(params.endVoltage, 1)}`,
        unit: 'V',
        highlight: false,
        description: `Nominell spänning minus spänningsfall`,
      },
      {
        label: 'Ledningsresistans (R)',
        value: `${formatElectrNumber(params.rSingle * (is1P ? 2 : 1), 3)}`,
        unit: 'Ω',
        highlight: false,
        description: is1P ? 'Tur och retur (fas + nolla)' : 'Resistans per fasledare',
      },
      {
        label: 'Effektförlust (P_kabel)',
        value: `${formatElectrNumber(params.powerLoss, 1)}`,
        unit: 'W',
        highlight: false,
        description: 'Värmeutveckling i ledarna vid full belastning',
      },
    ],

    formula: {
      name: is1P ? 'Spänningsfallsformel för enfaskrets' : 'Spänningsfallsformel för symmetrisk trefaskrets',
      formulaText: is1P
        ? 'ΔU = (2 · L · I · cos φ) / (γ · A) = 2 · I · R_ledare · cos φ'
        : 'ΔU = (√3 · L · I · cos φ) / (γ · A) = √3 · I · R_ledare · cos φ',
      secondaryFormula: `ΔU [%] = (ΔU / U_nom) · 100%   |   P_förlust = ${is1P ? '2' : '3'} · I² · R_ledare`,
      substitutionText: `ΔU = (${factorStr} · ${params.length} m · ${params.current} A · ${params.cosPhi}) / (${gamma} · ${params.area} mm²) = ${formatElectrNumber(params.deltaU, 2)} V\nSpänningsfall i %: (${formatElectrNumber(params.deltaU, 2)} V / ${params.voltage} V) · 100% = ${formatElectrNumber(params.dropPercent, 2)} %\nMottagande spänning vid förbrukare: ${params.voltage} V - ${formatElectrNumber(params.deltaU, 2)} V = ${formatElectrNumber(params.endVoltage, 1)} V\nEffektförlust i ledning: ${is1P ? '2' : '3'} · (${params.current} A)² · ${formatElectrNumber(params.rSingle, 4)} Ω = ${formatElectrNumber(params.powerLoss, 1)} W`,
      variableExplanations: [
        { symbol: 'L', meaning: 'Enkel kabellängd mellan matning och förbrukningspunkt (m)' },
        { symbol: 'I', meaning: 'Dimensionerande belastningsström (A)' },
        { symbol: 'γ', meaning: `Materialkonduktivitet (${params.material === 'cu' ? 'Cu = 56' : 'Al = 34'} m/(Ω·mm²))` },
        { symbol: 'A', meaning: 'Ledararea per ledare (mm²)' },
        { symbol: 'cos φ', meaning: 'Effektfaktor / fasvinkel' },
      ],
    },

    description: {
      summary: `Beräkningen har utförts för ${params.length} m ${params.material === 'cu' ? 'kopparkabel' : 'aluminiumkabel'} med arean ${params.area} mm² vid ${params.current} A belastning i ett ${is1P ? '230 V enfassystem' : '400 V trefassystem'}. Det resulterande spänningsfallet är ${formatElectrNumber(params.deltaU, 2)} V motsvarande ${formatElectrNumber(params.dropPercent, 2)} %.`,
      technicalAssessment: params.isWithinLimit
        ? `Installationen uppfyller kraven i svensk standard SS 436 40 00 med god marginal till gränsvärdet ${params.maxDropPct}%. Spänningen vid lastpunkten (${formatElectrNumber(params.endVoltage, 1)} V) säkerställer stabil funktion för belysning, motorer och elektroniska styrdon utan risk för flimmer eller reläbortfall.`
        : `OBSERVERA! Det beräknade spänningsfallet (${formatElectrNumber(params.dropPercent, 2)}%) överskrider tillåten standardgräns på ${params.maxDropPct}%. För högt spänningsfall medför risk för underspänning hos förbrukare, förhöjd värmeutveckling i kabelstråket samt risk för att kontaktorer och motorskydd löser ut oavsiktligt vid spänningsdippar. Kabelarean bör ökas till närmast högre dimension.`,
      recommendations: [
        params.isWithinLimit
          ? `Den valda ledararean ${params.area} mm² är godkänd ur spänningsfallssynpunkt.`
          : `Öka kabelarean till minst ${params.area <= 1.5 ? '2.5 mm²' : params.area <= 2.5 ? '4.0 mm²' : params.area <= 4 ? '6.0 mm²' : '10.0 mm²'} för att reducera spänningsfallet under ${params.maxDropPct}%.`,
        `Kontrollera att kabelns maximala kontinuerliga belastningsförmåga (Iz) enligt SS 436 40 00 Tabell 52-B1 inte överskrids med hänsyn till rådande förläggningssätt och omgivningstemperatur.`,
        `Säkerställ att utlösningsvillkoret (lägsta kortslutningsström Ik1_min) uppfylls vid kabelns ände för att garantera tillräckligt snabb frånkopplingstid vid jordslutning.`,
        `Vid kontinuerlig drift genereras ca ${formatElectrNumber(params.powerLoss, 1)} W värme i kabeln. Beakta detta vid buntning och förläggning i isolerade väggar.`,
      ],
    },

    sources: [
      {
        standard: 'SS 436 40 00:2023',
        section: 'Avsnitt 525',
        title: 'Elinstallationsreglerna – Spänningsfall i konsumentinstallationer',
        requirement: 'Rekommenderat spänningsfall mellan installationens början (mätartavla/huvudcentral) och förbrukningspunkt bör inte överstiga 3% för belysningskretsar och 5% för övriga laster.',
      },
      {
        standard: 'SEK Handbok 444',
        section: 'Kapitel 5 & 6',
        title: 'Ledningsdimensionering med hänsyn till belastningsförmåga och spänningsfall',
        requirement: 'Krav på samordning mellan ledararea, skyddsapparats märkström In och spänningsfallsbegränsning för att förhindra brand och funktionsstörningar.',
      },
      {
        standard: 'ELSÄK-FS 2022:1',
        section: '2 kap. 1 §',
        title: 'Elsäkerhetsverkets föreskrifter om utförande av starkströmsanläggningar',
        requirement: 'Starkströmsanläggningar ska vara utförda så att de ger nödvändig säkerhet för personer, husdjur och egendom mot skada till följd av el och termiska verkningar.',
      },
      {
        standard: 'SS-EN 60204-1',
        section: 'Avsnitt 13.5',
        title: 'Maskinsäkerhet – Maskiners elutrustning: Ledningsdimensionering',
        requirement: 'Spänningsfallet från matningspunkten till valfri punkt i maskinens elutrustning får normalt inte överstiga 5% av den nominella spänningen vid normal drift.',
      },
    ],

    diagram: {
      type: 'voltage_drop',
      data: {
        voltage: params.voltage,
        endVoltage: params.endVoltage,
        current: params.current,
        length: params.length,
        area: params.area,
        material: params.material,
        deltaU: params.deltaU,
        dropPercent: params.dropPercent,
        maxDropPct: params.maxDropPct,
        isWithinLimit: params.isWithinLimit,
        phaseType: params.phaseType,
        rCable: params.rSingle * (is1P ? 2 : 1),
        powerLoss: params.powerLoss,
      },
    },
  };
}

/**
 * Creates a complete, professional PdfReportData for Ohms Law & Power calculation
 */
export function createOhmsLawReportData(params: {
  result: CalculationResult;
  label?: string;
  projectName?: string;
  authorName?: string;
  clientName?: string;
}): PdfReportData {
  const is3P = params.result.phaseType === '3-phase';
  const connStr = params.result.threePhaseConnection === 'star' ? 'Y-koppling (Stjärna)' : 'D-koppling (Delta / Triangel)';

  return {
    calculationType: 'ohms_law',
    title: is3P
      ? `Dimensioneringsrapport: Trefas Ohms lag & Effekt (${params.result.threePhaseConnection === 'star' ? 'Stjärna Y' : 'Delta D'})`
      : 'Dimensioneringsrapport: Ohms lag & Effektberäkning (Enfas)',
    subtitle: `Teknisk sammanställning av elektriska grundstorheter, fas- och huvudvärden samt aktiv/skenbar/reaktiv effekt enligt SS 436 40 00`,
    docCode: '&BD01',
    systemTag: params.label || (is3P ? '=P1 +W1 -QM01' : '=P1 +W1 -Q01'),
    projectName: params.projectName || 'Nyinstallation Kraft & Belysning',
    authorName: params.authorName || 'Elkonstruktör / EDA Toolbox',
    clientName: params.clientName || 'Fastighetsägare / Anläggningsansvarig',
    dateStr: new Date().toISOString().split('T')[0],
    notes: params.label ? `Projektmärkning: ${params.label}` : 'Beräkning baserad på två kända storheter.',

    statusBadge: {
      text: `Beräknat resultat baserat på ${params.result.givenVars.join(' och ')}`,
      type: 'info',
    },

    inputs: params.result.givenVars.map((v) => {
      if (v === 'U') {
        return {
          label: is3P ? 'Huvudspänning (U_L)' : 'Spänning (U)',
          value: `${formatElectrNumber(params.result.voltage)}`,
          unit: 'V',
          description: is3P ? 'Spänning mellan två fasledare' : 'Spänning mellan fas och nolla',
        };
      }
      if (v === 'I') {
        return {
          label: is3P ? 'Linjeström (I_L)' : 'Ström (I)',
          value: `${formatElectrNumber(params.result.current)}`,
          unit: 'A',
          description: is3P ? 'Ström i matande fasledare' : 'Kretsens totala belastningsström',
        };
      }
      if (v === 'R') {
        return {
          label: is3P ? 'Fasresistans (R_fas)' : 'Resistans (R)',
          value: `${formatElectrNumber(params.result.resistance)}`,
          unit: 'Ω',
          description: is3P ? `Resistans per lastgren (${connStr})` : 'Kretsens inre resistans / belastning',
        };
      }
      return {
        label: is3P ? 'Total Aktiv Effekt (P_tot)' : 'Effekt (P)',
        value: `${formatElectrNumber(params.result.power)}`,
        unit: 'W',
        description: is3P ? 'Total 3-fas aktiv effekt' : 'Aktiv effekt',
      };
    }),

    results: [
      {
        label: is3P ? 'Huvudspänning U_L' : 'Spänning U',
        value: `${formatElectrNumber(params.result.voltage)}`,
        unit: 'V',
        highlight: params.result.calculatedVars.includes('U'),
        description: is3P && params.result.phaseVoltage ? `Fasspänning U_f = ${formatElectrNumber(params.result.phaseVoltage, 1)} V` : 'Nominell kretsspänning',
      },
      {
        label: is3P ? 'Linjeström I_L' : 'Ström I',
        value: `${formatElectrNumber(params.result.current)}`,
        unit: 'A',
        highlight: params.result.calculatedVars.includes('I'),
        description: is3P && params.result.phaseCurrent ? `Fasström I_f = ${formatElectrNumber(params.result.phaseCurrent, 2)} A` : 'Dimensionerande ström',
      },
      {
        label: is3P ? 'Fasresistans R_fas' : 'Resistans R',
        value: `${formatElectrNumber(params.result.resistance)}`,
        unit: 'Ω',
        highlight: params.result.calculatedVars.includes('R'),
        description: is3P ? `Per elementgren (${params.result.threePhaseConnection === 'star' ? 'Y' : 'Δ'})` : 'Lastresistans',
      },
      {
        label: is3P ? 'Total Effekt P_tot' : 'Effekt P',
        value: `${formatElectrNumber(params.result.power)}`,
        unit: 'W',
        highlight: params.result.calculatedVars.includes('P'),
        description: is3P && params.result.apparentPower ? `Skenbar effekt S = ${formatElectrNumber(params.result.apparentPower, 0)} VA` : 'Aktiv förbrukad effekt',
      },
    ],

    formula: {
      name: is3P ? `Trefasberäkning (${connStr})` : 'Ohms lag & Effektlagen (Enfas)',
      formulaText: is3P
        ? params.result.threePhaseConnection === 'star'
          ? 'Y-koppling: U_fas = U_L / √3  |  I_L = I_fas  |  P = √3 · U_L · I_L · cos φ'
          : 'Δ-koppling: U_fas = U_L  |  I_L = √3 · I_fas  |  P = √3 · U_L · I_L · cos φ'
        : 'U = R · I   |   P = U · I = I² · R = U² / R',
      secondaryFormula: params.result.formulasUsed.map((f) => `${f.target}: ${f.formula}`).join('  |  '),
      substitutionText: params.result.steps.join('\n'),
      variableExplanations: [
        { symbol: 'U', meaning: 'Spänning (Volt, V)' },
        { symbol: 'I', meaning: 'Ström (Ampere, A)' },
        { symbol: 'R', meaning: 'Resistans (Ohm, Ω)' },
        { symbol: 'P', meaning: 'Aktiv effekt (Watt, W)' },
      ],
    },

    description: {
      summary: `Beräkningen fastställer de elektriska driftparametrarna för kretsen utifrån kända indata (${params.result.givenVars.join(', ')}). Kretsen drar en ström på ${formatElectrNumber(params.result.current)} A vid ${formatElectrNumber(params.result.voltage)} V spänning med en total aktiv effekt på ${formatElectrNumber(params.result.power)} W (${formatElectrNumber(params.result.power / 1000, 2)} kW).`,
      technicalAssessment: `Driftströmmen ${formatElectrNumber(params.result.current)} A är dimensionerande för val av ledararea och märkström för överströmsskydd (säkring/dvärgbrytare). Vald kabel och apparatur måste tåla denna kontinuerliga ström utan otillåten temperaturstegring.`,
      recommendations: [
        `Välj överströmsskydd vars märkström In är större än eller lika med dimensionerande ström Ib (${formatElectrNumber(params.result.current)} A), t.ex. närmaste standardstorlek (6A, 10A, 16A, 20A, 25A, 32A).`,
        `Koppla och dimensionera neutralledaren med full märkarea om icke-linjära laster eller övertoner (speciellt 3:e tonen 150 Hz) förekommer.`,
        `Vid trefasmotorer eller induktiva laster med cos φ < 1.0 skall den skenbara effekten S (VA) beaktas vid val av transformatorkapacitet och kabelmärkning.`,
      ],
    },

    sources: [
      {
        standard: 'SS 436 40 00:2023',
        section: 'Avsnitt 433 & 523',
        title: 'Elinstallationsreglerna – Skydd mot överström & Ledardimensionering',
        requirement: 'Regeln Ib ≤ In ≤ Iz måste vara uppfylld, där Ib är kretsens belastningsström, In är skyddets märkström och Iz är ledarens kontinuerliga strömvärde.',
      },
      {
        standard: 'SEK Handbok 444',
        section: 'Avsnitt 3',
        title: 'Kabeldimensionering och trefasbelastningar',
        requirement: 'Riktlinjer för stjärn- och deltakoppling, symmetrisk lastfördelning och neutralledarbelastning.',
      },
      {
        standard: 'SS-EN 60204-1',
        section: 'Avsnitt 7',
        title: 'Skydd mot överström och termiska effekter i elutrustning',
        requirement: 'Ledare skall skyddas mot överström orsakad av överbelastning och kortslutning i enlighet med maskinens märkdata.',
      },
    ],

    diagram: {
      type: 'ohms_circle',
      data: {
        voltage: params.result.voltage,
        current: params.result.current,
        resistance: params.result.resistance,
        power: params.result.power,
        isThreePhase: is3P,
        connection: params.result.threePhaseConnection,
      },
    },
  };
}

/**
 * Creates a complete, professional PdfReportData for Three Phase motor / power calculation
 */
export function createThreePhaseReportData(params: {
  solveFor: 'power' | 'current';
  voltage: number;
  current: number;
  activePowerW: number;
  apparentPowerVA: number;
  reactivePowerVAr: number;
  cosPhi: number;
  efficiency: number;
  projectName?: string;
  authorName?: string;
  clientName?: string;
}): PdfReportData {
  const sinPhi = Math.sqrt(Math.max(0, 1 - params.cosPhi * params.cosPhi));
  const fuseRec = params.current > 25 ? '32A' : params.current > 20 ? '25A' : params.current > 16 ? '20A' : params.current > 10 ? '16A' : '10A';

  return {
    calculationType: 'three_phase',
    title: 'Dimensioneringsrapport: Trefaseffekt & Motordata',
    subtitle: 'Underlag för trefaslast, märkström, aktiv/skenbar/reaktiv effekt och säkringsdimensionering',
    docCode: '&BD01',
    systemTag: '=P1 +W1 -M01',
    projectName: params.projectName || 'Trefas Kraftinstallation',
    authorName: params.authorName || 'Elkonstruktör / EDA Toolbox',
    clientName: params.clientName || 'Industrikund / Fastighetsägare',
    dateStr: new Date().toISOString().split('T')[0],
    notes: `Trefasdimensionering med märkspänning ${params.voltage} V, cos φ = ${formatElectrNumber(params.cosPhi, 2)} och verkningsgrad η = ${formatElectrNumber(params.efficiency, 2)}.`,

    statusBadge: {
      text: `Dimensionerad för ${formatElectrNumber(params.activePowerW / 1000, 2)} kW aktiv motoreffekt`,
      type: 'info',
    },

    inputs: [
      {
        label: 'Huvudspänning (U_L)',
        value: `${params.voltage}`,
        unit: 'V',
        description: 'Mellan fasledare L1, L2, L3',
      },
      {
        label: 'Beräkningsläge',
        value: params.solveFor === 'power' ? 'Givet ström I -> Beräkna effekt P' : 'Givet märkeffekt P -> Beräkna ström I',
        unit: '-',
        description: 'Trefas linjeström / aktiv effekt',
      },
      {
        label: 'Effektfaktor (cos φ)',
        value: `${formatElectrNumber(params.cosPhi, 2)}`,
        unit: '0.1 – 1.0',
        description: 'Fasvinkel mellan spänning och ström',
      },
      {
        label: 'Verkningsgrad (η)',
        value: `${formatElectrNumber(params.efficiency * 100, 1)}`,
        unit: '%',
        description: 'Motorverkningsgrad vid märkdrift (IE3/IE4 standard)',
      },
    ],

    results: [
      {
        label: 'Linjeström (I_L)',
        value: `${formatElectrNumber(params.current, 2)}`,
        unit: 'A',
        highlight: params.solveFor === 'current',
        description: `Märkström per fasledare (Säkring: ${fuseRec})`,
      },
      {
        label: 'Aktiv Effekt (P)',
        value: `${formatElectrNumber(params.activePowerW / 1000, 2)}`,
        unit: 'kW',
        highlight: params.solveFor === 'power',
        description: 'Mekanisk axeleffekt / nyttig effekt',
      },
      {
        label: 'Skenbar Effekt (S)',
        value: `${formatElectrNumber(params.apparentPowerVA / 1000, 2)}`,
        unit: 'kVA',
        highlight: false,
        description: 'Total elektrisk belastning i nätet',
      },
      {
        label: 'Reaktiv Effekt (Q)',
        value: `${formatElectrNumber(params.reactivePowerVAr / 1000, 2)}`,
        unit: 'kVAr',
        highlight: false,
        description: 'Magnetiseringsreaktans (induktiv)',
      },
    ],

    formula: {
      name: 'Trefas effekt- och märkströmsformler',
      formulaText: params.solveFor === 'power'
        ? 'P = √3 · U_L · I_L · cos φ · η'
        : 'I_L = P / (√3 · U_L · cos φ · η)',
      secondaryFormula: 'S = √3 · U_L · I_L (kVA)   |   Q = √3 · U_L · I_L · sin φ (kVAr)   |   sin φ = √(1 - cos² φ)',
      substitutionText: params.solveFor === 'power'
        ? `P = √3 · ${params.voltage} V · ${formatElectrNumber(params.current, 2)} A · ${params.cosPhi} · ${params.efficiency} = ${formatElectrNumber(params.activePowerW, 1)} W (${formatElectrNumber(params.activePowerW / 1000, 2)} kW)\nSkenbar effekt: S = √3 · ${params.voltage} · ${formatElectrNumber(params.current, 2)} = ${formatElectrNumber(params.apparentPowerVA / 1000, 2)} kVA\nReaktiv effekt: Q = √3 · ${params.voltage} · ${formatElectrNumber(params.current, 2)} · ${formatElectrNumber(sinPhi, 3)} = ${formatElectrNumber(params.reactivePowerVAr / 1000, 2)} kVAr`
        : `I_L = ${formatElectrNumber(params.activePowerW, 0)} W / (√3 · ${params.voltage} V · ${params.cosPhi} · ${params.efficiency}) = ${formatElectrNumber(params.current, 2)} A\nSkenbar effekt S = √3 · ${params.voltage} · ${formatElectrNumber(params.current, 2)} A = ${formatElectrNumber(params.apparentPowerVA / 1000, 2)} kVA`,
      variableExplanations: [
        { symbol: 'U_L', meaning: 'Huvudspänning mellan två faser (400 V)' },
        { symbol: 'I_L', meaning: 'Linjeström i matande fasledare (A)' },
        { symbol: 'cos φ', meaning: 'Effektfaktor' },
        { symbol: 'η', meaning: 'Verkningsgrad (eta)' },
      ],
    },

    description: {
      summary: `Vid kontinuerlig märkdrift förbrukar motorn en aktiv effekt på ${formatElectrNumber(params.activePowerW / 1000, 2)} kW och drar en linjeström på ${formatElectrNumber(params.current, 2)} A vid ${params.voltage} V huvudspänning. Nätet belastas med en skenbar effekt på ${formatElectrNumber(params.apparentPowerVA / 1000, 2)} kVA och en reaktiv effekt på ${formatElectrNumber(params.reactivePowerVAr / 1000, 2)} kVAr.`,
      technicalAssessment: `Kabelarea och matande dvärgbrytare eller smältsäkring måste dimensioneras med hänsyn till såväl kontinuerlig driftström (${formatElectrNumber(params.current, 2)} A) som startströmsstöt (normalt 6–8 gånger märkströmmen vid direktstart).`,
      recommendations: [
        `Rekommenderat överströmsskydd för motorgrupp: Dvärgbrytare ${fuseRec} med D-karakteristik (eller trög smältsäkring gG) för att hantera startströmmen.`,
        `Kabelarea bör väljas till minst ${params.current > 20 ? '4.0 mm²' : params.current > 13 ? '2.5 mm²' : '1.5 mm²'} Cu med hänsyn till förläggningssätt och spänningsfall under start.`,
        `Vid frekvent start och stopp rekommenderas mjukstartare eller frekvensomriktare för att minimera mekaniska påkänningar och spänningsdippar i elnätet.`,
      ],
    },

    sources: [
      {
        standard: 'SS-EN 60034-1',
        section: 'Märkdata & Driftformer',
        title: 'Roterande elektriska maskiner – Märkdata och driftförhållanden',
        requirement: 'Definierar märkspänning, märkström, märkeffekt och tillåtna toleranser för spännings- och frekvensvariationer.',
      },
      {
        standard: 'SS 436 40 00:2023',
        section: 'Avsnitt 552',
        title: 'Elinstallationsreglerna – Motordrifter',
        requirement: 'Krav på skydd mot överbelastning, fasbortfall och oavsiktlig återstart efter spänningsbortfall.',
      },
      {
        standard: 'SS-EN 60204-1',
        section: 'Avsnitt 7.2 & 7.3',
        title: 'Maskiners elutrustning – Överströmsskydd och motorskydd',
        requirement: 'Varje motor över 0.5 kW skall förses med överbelastningsskydd som bryter alla faser vid överström.',
      },
    ],

    diagram: {
      type: 'power_triangle',
      data: {
        voltage: params.voltage,
        current: params.current,
        activePowerKw: params.activePowerW / 1000,
        apparentPowerKva: params.apparentPowerVA / 1000,
        reactivePowerKvar: params.reactivePowerVAr / 1000,
        cosPhi: params.cosPhi,
        efficiency: params.efficiency,
      },
    },
  };
}

/**
 * Creates a complete, professional PdfReportData for Star/Delta Comparison
 */
export function createStarDeltaReportData(params: {
  voltage: number;
  resistance: number;
  uStarElem: number;
  iStarLine: number;
  pStarTotal: number;
  uDeltaElem: number;
  iDeltaLine: number;
  pDeltaTotal: number;
  projectName?: string;
  authorName?: string;
  clientName?: string;
}): PdfReportData {
  return {
    calculationType: 'three_phase',
    title: 'Teknisk Rapport: Stjärn- & Deltakoppling (Y / Δ)',
    subtitle: 'Jämförelse av spänning över element, linjeströmmar och avgiven totaleffekt vid Y- vs Δ-koppling',
    docCode: '&BD01',
    systemTag: '=P1 +W1 -QA01',
    projectName: params.projectName || 'Y/D Motor- eller Värmeinstallation',
    authorName: params.authorName || 'Elkonstruktör / EDA Toolbox',
    clientName: params.clientName || 'Fastighetsägare / Industrikund',
    dateStr: new Date().toISOString().split('T')[0],
    notes: `Jämförelse vid ${params.voltage} V huvudspänning och ${params.resistance} Ω elementresistans.`,

    statusBadge: {
      text: `Effektförhållande P_Δ / P_Y = 3.00 (Effekt: ${formatElectrNumber(params.pStarTotal / 1000, 2)} kW i Y mot ${formatElectrNumber(params.pDeltaTotal / 1000, 2)} kW i Δ)`,
      type: 'info',
    },

    inputs: [
      {
        label: 'Huvudspänning (U_L)',
        value: `${params.voltage}`,
        unit: 'V',
        description: 'Mellan fasledare L1, L2, L3',
      },
      {
        label: 'Elementresistans (R_elem)',
        value: `${params.resistance}`,
        unit: 'Ω',
        description: 'Resistans per element / faslindning',
      },
    ],

    results: [
      {
        label: 'Effekt i Stjärna (P_Y)',
        value: `${formatElectrNumber(params.pStarTotal / 1000, 2)}`,
        unit: 'kW',
        highlight: false,
        description: '1/3 av deltaeffekten (Startläge / dellast)',
      },
      {
        label: 'Effekt i Delta (P_Δ)',
        value: `${formatElectrNumber(params.pDeltaTotal / 1000, 2)}`,
        unit: 'kW',
        highlight: true,
        description: 'Full effekt (Märkdriftläge)',
      },
      {
        label: 'Linjeström i Y (I_L,Y)',
        value: `${formatElectrNumber(params.iStarLine, 2)}`,
        unit: 'A',
        highlight: false,
        description: 'Ström från matande elnät i stjärnkoppling',
      },
      {
        label: 'Linjeström i Δ (I_L,Δ)',
        value: `${formatElectrNumber(params.iDeltaLine, 2)}`,
        unit: 'A',
        highlight: true,
        description: 'Ström i deltakoppling (√3 · I_fas, 3× högre än Y)',
      },
    ],

    formula: {
      name: 'Stjärna/Delta-transformation & effektförhållande',
      formulaText: 'P_Δ / P_Y = 3   |   I_L,Δ / I_L,Y = 3   |   U_elem,Y = U_L / √3   |   U_elem,Δ = U_L',
      secondaryFormula: 'P_Y = 3 · (U_L / √3)² / R = U_L² / R   |   P_Δ = 3 · U_L² / R',
      substitutionText: `Stjärna (Y):\nU_elem = ${params.voltage} / 1.732 = ${formatElectrNumber(params.uStarElem, 1)} V\nI_L = ${formatElectrNumber(params.uStarElem, 1)} V / ${params.resistance} Ω = ${formatElectrNumber(params.iStarLine, 2)} A\nP_Y = 3 · (${formatElectrNumber(params.uStarElem, 1)})² / ${params.resistance} = ${formatElectrNumber(params.pStarTotal / 1000, 2)} kW\n\nDelta (Δ):\nU_elem = ${params.voltage} V\nI_elem = ${params.voltage} / ${params.resistance} = ${formatElectrNumber(params.uDeltaElem / params.resistance, 2)} A\nI_L = √3 · ${formatElectrNumber(params.uDeltaElem / params.resistance, 2)} = ${formatElectrNumber(params.iDeltaLine, 2)} A\nP_Δ = 3 · (${params.voltage})² / ${params.resistance} = ${formatElectrNumber(params.pDeltaTotal / 1000, 2)} kW`,
      variableExplanations: [
        { symbol: 'U_L', meaning: 'Huvudspänning (400 V nominellt)' },
        { symbol: 'R_elem', meaning: 'Enskilt motstånd / faslindningsresistans' },
        { symbol: 'Y', meaning: 'Stjärnkoppling med gemensam stjärnpunkt' },
        { symbol: 'Δ', meaning: 'Deltakoppling med element i sluten triangel' },
      ],
    },

    description: {
      summary: `Analysen visar att deltakoppling utvecklar exakt 3 gånger högre effekt (${formatElectrNumber(params.pDeltaTotal / 1000, 2)} kW jämfört med ${formatElectrNumber(params.pStarTotal / 1000, 2)} kW i stjärna) och drar 3 gånger högre linjeström från elnätet (${formatElectrNumber(params.iDeltaLine, 1)} A mot ${formatElectrNumber(params.iStarLine, 1)} A).`,
      technicalAssessment: 'Vid Y/D-start av asynkronmotorer sänks startströmmen med 67 % under uppstarten i Y-läge, vilket avlastar transformatorer och förhindrar spänningsdippar i anläggningen. För värmepatroner ger Y/D-omkoppling en energieffektiv stegreglering i förhållandet 1:3.',
      recommendations: [
        'Säkerställ att motorns märkskylt anger 400/690V om motorn skall köras i delta vid svensk 400V nätspänning. En 230/400V motor blir överspänd och bränns vid anslutning i delta.',
        'Vid Y/D-startkopplare skall överströmsreläet (termiska skyddet) placeras i fasledaren och ställas in på motorns märkfasström (In / √3 = 0.58 · In).',
        'Ställ omkopplingstiden mellan Y och Δ så att motorn hinner uppnå minst 85–90 % av märkvarvtalet innan omslag sker.',
      ],
    },

    sources: [
      {
        standard: 'SS-EN 60947-4-1',
        section: 'Kopplingsapparater: Y/D-startare',
        title: 'Apparater för lågspänning – Kontaktorer och motorskydd',
        requirement: 'Krav på förregling och växlingstid för Y/D-startare för att undvika fas-kortslutning vid omkoppling.',
      },
      {
        standard: 'SEK Handbok 444',
        section: 'Avsnitt 3',
        title: 'Trefasbelastningar och startmetoder för elmotorer',
        requirement: 'Riktlinjer för val av startmetod beroende på nätets förimpedans och lokala nätägares föreskrifter.',
      },
    ],

    diagram: {
      type: 'star_delta',
      data: {
        voltage: params.voltage,
        resistance: params.resistance,
        uStarElem: params.uStarElem,
        iStarLine: params.iStarLine,
        pStarTotal: params.pStarTotal,
        uDeltaElem: params.uDeltaElem,
        iDeltaLine: params.iDeltaLine,
        pDeltaTotal: params.pDeltaTotal,
      },
    },
  };
}

/**
 * Creates a complete, professional PdfReportData for Unbalanced Neutral Current calculation
 */
export function createNeutralCurrentReportData(params: {
  iL1: number;
  iL2: number;
  iL3: number;
  iNeutral: number;
  projectName?: string;
  authorName?: string;
  clientName?: string;
}): PdfReportData {
  const isBalanced = params.iNeutral < 0.05 && params.iL1 > 0;
  const isHighNeutral = params.iNeutral > Math.max(params.iL1, params.iL2, params.iL3) * 0.8;

  return {
    calculationType: 'three_phase',
    title: 'Teknisk Beräkningsrapport: Nollströmsanalys (I_N)',
    subtitle: 'Analytisk vektorsummering av fasströmmar med 120° förskjutning vid osymmetrisk fasbelastning',
    docCode: '&BD01',
    systemTag: '=P1 +W1 -W00',
    projectName: params.projectName || 'Centralbelastning & Nollströmsmätning',
    authorName: params.authorName || 'Elkonstruktör / EDA Toolbox',
    clientName: params.clientName || 'Fastighetsägare / Driftansvarig',
    dateStr: new Date().toISOString().split('T')[0],
    notes: `Fasströmmar: L1 = ${params.iL1} A, L2 = ${params.iL2} A, L3 = ${params.iL3} A.`,

    statusBadge: {
      text: isBalanced
        ? 'Perfekt balanserad symmetrisk last (I_N = 0.00 A)'
        : `Obalanserad trefaslast – Nollström I_N = ${formatElectrNumber(params.iNeutral, 2)} A`,
      type: isBalanced ? 'success' : isHighNeutral ? 'warning' : 'info',
    },

    inputs: [
      {
        label: 'Ström Fas L1 (Brun)',
        value: `${params.iL1}`,
        unit: 'A',
        description: 'Vinkel 0°',
      },
      {
        label: 'Ström Fas L2 (Svart)',
        value: `${params.iL2}`,
        unit: 'A',
        description: 'Vinkel 240°',
      },
      {
        label: 'Ström Fas L3 (Grå)',
        value: `${params.iL3}`,
        unit: 'A',
        description: 'Vinkel 120°',
      },
    ],

    results: [
      {
        label: 'Ström i Nollan (I_N)',
        value: `${formatElectrNumber(params.iNeutral, 2)}`,
        unit: 'A',
        highlight: true,
        description: isBalanced ? 'Ingen ström i nollan' : 'Returström genom neutralledaren',
      },
      {
        label: 'Max Fasström',
        value: `${formatElectrNumber(Math.max(params.iL1, params.iL2, params.iL3), 1)}`,
        unit: 'A',
        highlight: false,
        description: 'Högst belastad fasledare',
      },
      {
        label: 'Belastningsgrad I_N / I_max',
        value: `${Math.max(params.iL1, params.iL2, params.iL3) > 0 ? formatElectrNumber((params.iNeutral / Math.max(params.iL1, params.iL2, params.iL3)) * 100, 1) : 0}`,
        unit: '%',
        highlight: false,
        description: 'Nollströmmens andel av högsta fasström',
      },
    ],

    formula: {
      name: 'Vektorsummering av 3-fasströmmar i nollan (Kirchhoffs strömlag)',
      formulaText: 'I_N = √(I₁² + I₂² + I₃² - I₁·I₂ - I₂·I₃ - I₃·I₁)',
      secondaryFormula: 'I_N = |-(I_L1 + I_L2·e^(j·240°) + I_L3·e^(j·120°))|',
      substitutionText: `I_N = √(${params.iL1}² + ${params.iL2}² + ${params.iL3}² - ${params.iL1}·${params.iL2} - ${params.iL2}·${params.iL3} - ${params.iL3}·${params.iL1})\nI_N = √(${params.iL1 * params.iL1} + ${params.iL2 * params.iL2} + ${params.iL3 * params.iL3} - ${params.iL1 * params.iL2} - ${params.iL2 * params.iL3} - ${params.iL3 * params.iL1})\nI_N = ${formatElectrNumber(params.iNeutral, 2)} A`,
      variableExplanations: [
        { symbol: 'I_1, I_2, I_3', meaning: 'Strömmar i respektive fasledare L1, L2, L3' },
        { symbol: 'I_N', meaning: 'Resulterande ström i neutralledaren' },
        { symbol: '120°', meaning: 'Symmetrisk geometrisk fasförskjutning i trefasnätet' },
      ],
    },

    description: {
      summary: `Beräkningen visar att snedbelastningen mellan faserna L1 (${params.iL1} A), L2 (${params.iL2} A) och L3 (${params.iL3} A) ger en returström i neutralledaren på ${formatElectrNumber(params.iNeutral, 2)} A.`,
      technicalAssessment: isHighNeutral
        ? 'OBS! Den beräknade nollströmmen är hög i förhållande till fasströmmarna. Neutralledaren får inte ha reducerad area. Omfördela enfasgrupper i centralen för att jämna ut belastningen.'
        : 'Nollströmmen är väl inom toleransen och neutralledaren utsätts inte för otillåten överbelastning.',
      recommendations: [
        'Enfasgrupper i gruppcentralen bör fördelas jämnt mellan L1, L2 och L3 för att minimera nollströmmen.',
        'I anläggningar med stora mängder switchade nätaggregat och LED-driftdon kan 3:e övertonen (150 Hz) addera i nollan snarare än ta ut varandra. Neutralledaren skall då alltid ha minst samma area som fasledarna.',
        'Kontrollera åtdragningsmoment i nollplinten; glapp i neutralledaren vid osymmetrisk last leder till farlig spänningsförskjutning (flytande nolla) som förstör 230V-apparater.',
      ],
    },

    sources: [
      {
        standard: 'SS 436 40 00:2023',
        section: 'Avsnitt 523.5 & 524',
        title: 'Neutralledarens dimensionering och övertonsströmmar',
        requirement: 'Neutralledaren skall normalt ha samma area som fasledarna. Vid förekomst av övertoner kan neutralledaren behöva överdimensioneras.',
      },
      {
        standard: 'SEK Handbok 444',
        section: 'Kapitel 4',
        title: 'Obalans och nollpunktsförskjutning i distributionsnät',
        requirement: 'Riktlinjer för fasbalansering och riskbedömning vid nollströmsuppkomst.',
      },
    ],

    diagram: {
      type: 'neutral_phasor',
      data: {
        iL1: params.iL1,
        iL2: params.iL2,
        iL3: params.iL3,
        iNeutral: params.iNeutral,
      },
    },
  };
}

