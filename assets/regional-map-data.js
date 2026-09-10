// Real, sourced FONSIS investments — one per region currently active (11 of
// Senegal's 14 regions, per the client). Coordinates are the town's real
// geographic location, not necessarily the exact project site, where only a
// regional programme (AGRIBETA/Agropole Sud) rather than a single pinned
// site is documented. No entries for Fatick, Kaffrine or Matam — no sourced
// FONSIS project found there. Mirrors prisma/seed.ts in the fonsis-web repo.
window.FONSIS_REGIONAL_PROJECTS = [
  {
    id: "hq", isHq: true, status: "operationnel",
    region: "Dakar",
    title: "Siège du FONSIS",
    location: "Mermoz, Dakar",
    description: "Rond-point Stèle Mermoz, Immeuble Elton, 3ème étage — siège social du FONSIS.",
    lat: 14.7033, lng: -17.4746,
    photo: null
  },
  {
    id: "polimed-mbour", status: "operationnel",
    region: "Thiès",
    title: "Centre d'imagerie médicale Polimed",
    location: "Mbour",
    description: "Centre d'imagerie de proximité géré par Polimed, filiale du FONSIS, en partenariat avec l'hôpital de Mbour.",
    lat: 14.4198, lng: -16.9636,
    photo: null
  },
  {
    id: "solaire-kael", status: "operationnel",
    region: "Diourbel",
    title: "Centrale solaire de Kaël",
    location: "Kaël, Mbacké",
    description: "Centrale photovoltaïque de 25 MWc, coentreprise FONSIS / ENGIE / Meridiam dans le cadre du programme Scaling Solar de la Banque mondiale.",
    lat: 14.7167, lng: -15.9167,
    photo: "assets/img/solar-farm.jpg"
  },
  {
    id: "ferme-sopel", status: "operationnel",
    region: "Louga",
    title: "Ferme SOPEL",
    location: "Keur Momar Sarr",
    description: "Ferme intégrée ovine et fourragère de 20 ha, dirigée par une femme vétérinaire, financée par le WE! Fund.",
    lat: 15.9167, lng: -15.9667,
    photo: "assets/img/agropole.jpg"
  },
  {
    id: "solaire-kahone", status: "operationnel",
    region: "Kaolack",
    title: "Centrale solaire de Kahone",
    location: "Kahone",
    description: "Centrale photovoltaïque de 25 MWc, même coentreprise FONSIS / ENGIE / Meridiam que Kaël, programme Scaling Solar.",
    lat: 14.1500, lng: -16.0333,
    photo: "assets/img/solar-farm.jpg"
  },
  {
    id: "db-foods", status: "operationnel",
    region: "Saint-Louis",
    title: "DB Foods — unité de transformation de riz",
    location: "Ross-Béthio",
    description: "Unité de collecte, transformation et commercialisation de riz paddy (marque « Tiep bi »), structurée avec l'appui du FONSIS, de la SAED et de la DER.",
    lat: 16.2667, lng: -16.1333,
    photo: "assets/img/agropole.jpg"
  },
  {
    id: "agribeta-ziguinchor", status: "en_cours",
    region: "Ziguinchor",
    title: "AGRIBETA — mégafermes",
    location: "Ziguinchor",
    description: "Partenariat FONSIS-SODAGRI pour créer des mégafermes agro-industrielles de 5 000 à 10 000 ha ; le pilote de 10 ha à Bignarabé est achevé, la mise à l'échelle est en cours de sécurisation foncière.",
    lat: 12.5833, lng: -16.2719,
    photo: "assets/img/agropole.jpg"
  },
  {
    id: "agribeta-kolda", status: "en_cours",
    region: "Kolda",
    title: "AGRIBETA & Agropole Sud",
    location: "Kolda",
    description: "Région cible du programme AGRIBETA et de la plateforme industrielle Agropole Sud (mangue, anacarde, maïs), en cours de structuration.",
    lat: 12.8833, lng: -14.9500,
    photo: "assets/img/agropole.jpg"
  },
  {
    id: "agribeta-sedhiou", status: "en_cours",
    region: "Sédhiou",
    title: "AGRIBETA & Agropole Sud",
    location: "Sédhiou",
    description: "Région cible du programme AGRIBETA et de la plateforme industrielle Agropole Sud, en cours de structuration.",
    lat: 12.7081, lng: -15.5569,
    photo: "assets/img/agropole.jpg"
  },
  {
    id: "agribeta-kedougou", status: "en_cours",
    region: "Kédougou",
    title: "AGRIBETA — zone cible",
    location: "Kédougou",
    description: "Région cible du programme AGRIBETA, en cours de sécurisation foncière avant mise à l'échelle.",
    lat: 12.5500, lng: -12.1833,
    photo: "assets/img/agropole.jpg"
  },
  {
    id: "agribeta-tambacounda", status: "en_cours",
    region: "Tambacounda",
    title: "AGRIBETA — zone cible",
    location: "Tambacounda",
    description: "Région cible du programme AGRIBETA, en cours de sécurisation foncière avant mise à l'échelle.",
    lat: 13.7671, lng: -13.6681,
    photo: "assets/img/agropole.jpg"
  }
];
