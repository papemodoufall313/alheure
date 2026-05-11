import { readFileSync, writeFileSync } from "fs";

const IMG = (id) => `https://images.unsplash.com/${id}?w=900&q=80`;

// slug → Unsplash photo ID  (articles that already have local /uploads/ are skipped)
const MAP = {
  // ── ORIGINAUX ──────────────────────────────────────────────────────────────
  "touba-magal-5-millions":                 IMG("photo-EysHghSWuaE"),  // Grande mosquée / pèlerins
  "ziguinchor-accord-paix":                 IMG("photo-sVCGbd2qmS0"),  // Paix / communauté Afrique
  "brt-dakar-bilan":                        IMG("photo-nR1HLLd01M4"),  // Bus en transit urbain
  "sweet-beauty-appel":                     IMG("photo-tAu7hezSWNI"),  // Palais de justice
  "mboro-phosphates-nappes":               IMG("photo-wl1LEp5WXiU"),  // Mine / extraction
  "opposition-conseil-constitutionnel":    IMG("photo-gYbOFTwcJx4"),  // Cour / justice
  "diomaye-paris-agenda":                   IMG("photo-axSd5GbnX68"),  // Diplomate africain
  "gaz-gta-phase-2":                        IMG("photo-6eJCt153TC8"),  // Plateforme pétrolière offshore
  "bceao-franc-cfa":                        IMG("photo-NLOhciOrK_E"),  // Finance / banque Afrique
  "petrole-senegal-rente":                  IMG("photo-XquCLVbTYLE"),  // Pétrole offshore
  "presidentielle-ivoirienne-manouvres":   IMG("photo-AwK50rQ2ly0"),  // Élection / Afrique
  "attentat-bamako":                        IMG("photo-W9XDGeJDnL0"),  // Ville africaine / Bamako
  "cedeao-urgence-defense":                 IMG("photo-PgdGUruKAv8"),  // Diplomates africains réunion
  "rdc-treve-goma":                         IMG("photo-sjufXanjrDs"),  // Paix / communauté
  "keur-massar-inondations":               IMG("photo-rTztRXJLfhY"),  // Inondation / zones urbaines
  "mbour-familles-migrants":               IMG("photo-bwBKmd4KR-0"),  // Mer / bateaux Sénégal
  "lions-selection-mane":                   IMG("photo-tV3xTMx7DYE"),  // Football africain
  "youssou-ndour-tournee":                  IMG("photo-_WRBXEumX4c"),  // Concert / musique live
  "dakart-biennale-2026":                   IMG("photo-inS_9RHQ7Io"),  // Exposition d'art / galerie
  "mati-diop-cannes":                       IMG("photo-d-3qH1ZeGGY"),  // Cinéma / festival
  "bouba-ndour-festival-saint-louis":      IMG("photo-9s1zMTevjm0"),  // Festival de jazz / musique
  "marseille-senegalais-legislatives":     IMG("photo-fdIP6cMSCxM"),  // Marseille port
  "diaspora-vote-pourquoi":                IMG("photo-NRv8BsouFBQ"),  // Vote / démocratie Afrique

  // ── 24 NOUVEAUX ARTICLES SCRAPÉS ──────────────────────────────────────────
  "code-electoral-diomaye-deux-versions-bloque": IMG("photo-OHE90W2rQF4"),  // Parlement / justice
  "nioro-du-rip-attaque-armee-gendarmerie":      IMG("photo-48x1teBWvys"),  // Gendarmerie / sécurité
  "bamako-dialogue-groupes-armes-abdoulaye-diop":IMG("photo-axSd5GbnX68"),  // Diplomate africain
  "meeting-sargal-diomaye-mbour-effervescence":  IMG("photo-3ocGaCPEnXg"),  // Rassemblement politique
  "promulgation-loi-reglement-interieur-assemblee": IMG("photo-gYbOFTwcJx4"), // Parlement / loi
  "ramaphosa-destitution-justice-sud-africaine": IMG("photo-PgdGUruKAv8"),  // Politique africain
  "coupe-monde-2026-trump-prix-billets":         IMG("photo-YRo-gm6jtSw"),  // Stade / Coupe du Monde
  "mali-camions-pieges-assimi-goita-avril":      IMG("photo-W9XDGeJDnL0"),  // Ville Bamako / Afrique
  "mali-helicoptere-gao-fla-jnim":               IMG("photo-6eJCt153TC8"),  // Aérien / militaire
  "nguekhokh-camion-renverse-autoroute-mbour-dakar": IMG("photo-nR1HLLd01M4"), // Route / autoroute
  "louga-terrain-vente-chaos-serigne-akhma":     IMG("photo-rVUskjd0WRk"),  // Ville sénégalaise
  "cheikh-diba-bceao-conference-crypto-actifs":  IMG("photo-gLXxyo0VVfM"),  // Finance / conférence
  "laylatoul-khadr-drame-judiciaire-eleve":      IMG("photo-EysHghSWuaE"),  // Mosquée / nuit sacrée
  "mondial-2026-shakira-dai-dai-burna-boy":      IMG("photo-Xlok3KFZ-8Y"),  // Concert / scène musicale
  "guy-marius-sagna-ambassade-france-fsf-pape-thiaw": IMG("photo-tV3xTMx7DYE"), // Football sénégalais
  "jaaw-ketchup-african-influencers-summit-2026":IMG("photo-gogGhbvHrYw"),  // Jeunesse africaine
  "mondial-2026-lamine-sane-koulibaly-incertitude": IMG("photo-YRo-gm6jtSw"), // Football
  "bouna-sarr-retour-selection-pape-thiaw":      IMG("photo-A79xX9as9G4"),  // Footballeur africain
  "hantavirus-navire-croisiere-oms-pas-vaccin":  IMG("photo-0bBx50CW7tA"),  // Navire de croisière
  "senegal-balance-commerciale-excedent-mars-2026": IMG("photo-73J7ipZf0Ps"), // Port / commerce
  "macky-sall-onu-presidentielle-2029-clarification-apr": IMG("photo-axSd5GbnX68"), // Politique
};

const filePath = decodeURIComponent(new URL("../src/data/articles.json", import.meta.url).pathname.slice(1));
const articles = JSON.parse(readFileSync(filePath, "utf-8"));

let updated = 0;
for (const a of articles) {
  if (MAP[a.slug]) {
    // Only replace if no local upload
    if (!a.imgUrl?.startsWith("/uploads/")) {
      a.imgUrl  = MAP[a.slug];
      a.imgSeed = "";           // clear picsum seed
      updated++;
    }
  }
}

writeFileSync(filePath, JSON.stringify(articles, null, 2), "utf-8");
console.log(`✓ ${updated} articles mis à jour avec des images Unsplash thématiques.`);
