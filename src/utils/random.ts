import { shuffle } from "./shuffle";

/**
 * Mulberry32 PRNG factory
 * @credit https://stackoverflow.com/a/47593316
 */
export function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * @credit https://stackoverflow.com/a/47593316
 */
export function cyrb128(str: string) {
  let h1 = 1779033703,
    h2 = 3144134277,
    h3 = 1013904242,
    h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [
    (h1 ^ h2 ^ h3 ^ h4) >>> 0,
    (h2 ^ h1) >>> 0,
    (h3 ^ h1) >>> 0,
    (h4 ^ h1) >>> 0,
  ];
}

/**
 * Creates a PNRG initialised with a seed
 * Uses cyrb128 and mulberry32
 * @param seed The seed value
 */
export const createRandom = (seed: string) => {
  const s = cyrb128(seed);
  return mulberry32(s[0]);
};

/**
 * Hand-picked (and AI-assisted) list of good words.
 * Assuming adjective-substantive-adjective-substantive: 96*247*96*247 = 562 258 944 options.
 * Should be plenty enough for a hobby project.
 */
const words = [
  [
    "uusi",
    "suuri",
    "oma",
    "viime",
    "koko",
    "pieni",
    "ensi",
    "vanha",
    "eri",
    "kova",
    "nuori",
    "iso",
    "paha",
    "oikea",
    "vahva",
    "ainoa",
    "laaja",
    "huono",
    "tuttu",
    "nopea",
    "avoin",
    "tuore",
    "lyhyt",
    "varma",
    "vapaa",
    "vajaa",
    "reilu",
    "hieno",
    "halpa",
    "turha",
    "suora",
    "musta",
    "kevyt",
    "kuuma",
    "terve",
    "komea",
    "aito",
    "raju",
    "outo",
    "upea",
    "vasen",
    "hidas",
    "rikas",
    "hurja",
    "kuiva",
    "kiva",
    "vakaa",
    "pikku",
    "hullu",
    "ihana",
    "ylin",
    "loppu",
    "huima",
    "ahdas",
    "tumma",
    "villi",
    "kapea",
    "paksu",
    "rakas",
    "tosi",
    "makea",
    "ohut",
    "oiva",
    "alin",
    "kumma",
    "raaka",
    "kehno",
    "pysty",
    "vaisu",
    "harva",
    "luja",
    "karu",
    "ainut",
    "rento",
    "ruma",
    "arka",
    "julma",
    "tyly",
    "sula",
    "kelpo",
    "fiksu",
    "enin",
    "laiha",
    "kurja",
    "kuulu",
    "ankea",
    "tyyni",
    "jalo",
    "mieto",
    "altis",
    "hassu",
    "tiuha",
    "uljas",
    "avara",
    "liika",
    "tuhti",
    "sokea",
  ],
  [
    "aamu",
    "aihe",
    "aika",
    "aine",
    "ajatus",
    "alainen",
    "alku",
    "alue",
    "ansio",
    "arvo",
    "asema",
    "asetus",
    "aste",
    "asukas",
    "asunto",
    "aurinko",
    "auto",
    "auttaja",
    "banaani",
    "ehdotus",
    "elokuva",
    "esitys",
    "henki",
    "herra",
    "hetki",
    "hevonen",
    "hinta",
    "huoli",
    "huone",
    "ihminen",
    "ikkuna",
    "ilma",
    "ilta",
    "jalka",
    "johtaja",
    "johto",
    "joukko",
    "joukkue",
    "joulu",
    "juhla",
    "juttu",
    "juuri",
    "kala",
    "kansa",
    "kanta",
    "kasvi",
    "katto",
    "katu",
    "kauppa",
    "kautta",
    "kehitys",
    "kello",
    "kerta",
    "kieli",
    "kiitos",
    "kirja",
    "kirje",
    "kirkko",
    "kivi",
    "kohde",
    "kohta",
    "koira",
    "kokemus",
    "koko",
    "kokous",
    "komitea",
    "kone",
    "korkeus",
    "korvaus",
    "koti",
    "koulu",
    "kuiva",
    "kunta",
    "kunto",
    "kuolema",
    "kuusi",
    "kuva",
    "kysymys",
    "laaja",
    "laatu",
    "lahja",
    "laitos",
    "laiva",
    "laji",
    "laki",
    "lappi",
    "lapsi",
    "laulu",
    "lehti",
    "levy",
    "liha",
    "liike",
    "liitto",
    "linja",
    "lintu",
    "loppu",
    "luku",
    "lukuisa",
    "lumi",
    "luokka",
    "luonne",
    "luonto",
    "lyhyt",
    "maailma",
    "maksu",
    "markka",
    "matka",
    "matti",
    "meno",
    "meri",
    "merkki",
    "metri",
    "mieli",
    "mies",
    "mitta",
    "mukaan",
    "muoto",
    "muutos",
    "nainen",
    "nimi",
    "nousu",
    "numero",
    "nuori",
    "nuoriso",
    "ohje",
    "ohjelma",
    "oikeus",
    "ongelma",
    "onni",
    "opetus",
    "oppilas",
    "osasto",
    "osuus",
    "ottelu",
    "paha",
    "paikka",
    "paino",
    "palkka",
    "pappi",
    "paras",
    "pari",
    "perhe",
    "peruste",
    "pieni",
    "piiri",
    "piirre",
    "pinta",
    "piste",
    "pituus",
    "pohja",
    "poika",
    "pois",
    "poliisi",
    "potilas",
    "puhe",
    "puite",
    "puoli",
    "puolue",
    "puute",
    "radio",
    "raha",
    "raja",
    "rakkaus",
    "ranta",
    "rauha",
    "rouva",
    "ruoka",
    "ruotsi",
    "saakka",
    "saari",
    "sairaus",
    "saksa",
    "sana",
    "sarja",
    "seikka",
    "seura",
    "seuraus",
    "seutu",
    "sija",
    "sivu",
    "sopimus",
    "sopiva",
    "suhde",
    "suomi",
    "suora",
    "suunta",
    "suuri",
    "suuruus",
    "syksy",
    "synti",
    "taho",
    "taito",
    "taivas",
    "takana",
    "talo",
    "talvi",
    "tapa",
    "tapaus",
    "tarkka",
    "tarve",
    "taso",
    "tavara",
    "tavoite",
    "tehdas",
    "teko",
    "teos",
    "tieto",
    "tila",
    "tilanne",
    "toimi",
    "tuli",
    "tulo",
    "tulos",
    "tunti",
    "tuote",
    "turku",
    "tuuli",
    "ulos",
    "usko",
    "vaara",
    "vaate",
    "vahinko",
    "vahva",
    "vaihe",
    "vaikeus",
    "vakava",
    "valo",
    "valta",
    "valtio",
    "vapaus",
    "varma",
    "vastaus",
    "vastuu",
    "vene",
    "verta",
    "vesi",
    "vieras",
    "viikko",
    "viime",
    "viisi",
    "virka",
    "voima",
    "voitto",
    "vuoro",
    "vuosi",
    "yhteys",
    "yritys",
  ],
];
export const randomWords = (length = 4, seed?: string) => {
  if (length === 0) return [];

  const adjectives = shuffle(words[0], seed);
  const substantives = shuffle(words[1], seed);

  const result = [];
  while (result.length < length) {
    const adjective: boolean = result.length % 2 === 0;
    result.push((adjective ? adjectives : substantives).pop());
  }
  return result;
};