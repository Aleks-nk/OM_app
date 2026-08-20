// ============================================================================
// Couche de données — fonctionne avec des données factices par défaut.
//
// Pour brancher les vraies données de calendrier/résultats/classement :
//   1. Crée un compte gratuit sur https://www.football-data.org
//   2. Récupère ta clé API
//   3. Remplace FOOTBALL_DATA_KEY ci-dessous par ta clé (entre guillemets)
//   Limite gratuite : 10 requêtes/minute, pas de stats joueurs détaillées.
//
// Pour les actus/mercato (flux RSS), voir la fonction getNews() plus bas.
// ============================================================================

const FOOTBALL_DATA_KEY = "4acf1b15956d481499f0b86f0b42a812";
const FOOTBALL_DATA_BASE = "https://api.football-data.org/v4";
const OM_TEAM_ID = 516; // Olympique de Marseille sur football-data.org

const USE_LIVE_DATA = Boolean(FOOTBALL_DATA_KEY);

// football-data.org bloque les appels faits directement depuis un navigateur
// (politique CORS) : sans ce relais, la requête échoue en silence et rien ne
// s'affiche. On passe donc par un relais public (allorigins.win) qui ajoute
// l'en-tête manquant, et on transmet la clé en paramètre d'URL (_apiKey)
// plutôt qu'en en-tête, car les en-têtes personnalisés ne passent pas
// toujours par ce type de relais.
async function fdFetch(path) {
  const sep = path.includes("?") ? "&" : "?";
  const target = `${FOOTBALL_DATA_BASE}${path}${sep}_apiKey=${FOOTBALL_DATA_KEY}`;
  const proxied = `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`;
  const res = await fetch(proxied);
  if (!res.ok) throw new Error(`football-data.org: ${res.status}`);
  const data = await res.json();
  if (data.errorCode) throw new Error(`football-data.org: ${data.message}`);
  return data;
}

// ---- Données de démonstration ----

const mockNextMatch = {
  competition: "Ligue 1",
  home: "Olympique de Marseille",
  away: "AS Monaco",
  date: "2026-08-23T20:45:00",
  venue: "Stade Vélodrome",
};

const mockFixtures = [
  { id: 1, competition: "Ligue 1", home: "Olympique de Marseille", away: "AS Monaco", date: "2026-08-23T20:45:00", venue: "Vélodrome" },
  { id: 2, competition: "Ligue 1", home: "Lille OSC", away: "Olympique de Marseille", date: "2026-08-30T17:00:00", venue: "Pierre-Mauroy" },
  { id: 3, competition: "C1", home: "Olympique de Marseille", away: "Ajax", date: "2026-09-17T21:00:00", venue: "Vélodrome" },
  { id: 4, competition: "Ligue 1", home: "Olympique de Marseille", away: "Stade Rennais", date: "2026-09-21T15:00:00", venue: "Vélodrome" },
];

const mockResults = [
  { id: 101, competition: "Ligue 1", home: "Olympique de Marseille", away: "Toulouse FC", homeScore: 3, awayScore: 1, date: "2026-08-16" },
  { id: 102, competition: "Ligue 1", home: "OGC Nice", away: "Olympique de Marseille", homeScore: 0, awayScore: 0, date: "2026-08-09" },
  { id: 103, competition: "Amical", home: "Olympique de Marseille", away: "Real Betis", homeScore: 2, awayScore: 2, date: "2026-08-02" },
];

const mockStandings = [
  { pos: 1, team: "Paris Saint-Germain", played: 3, gd: 8, pts: 9 },
  { pos: 2, team: "Olympique de Marseille", played: 3, gd: 5, pts: 7 },
  { pos: 3, team: "AS Monaco", played: 3, gd: 4, pts: 7 },
  { pos: 4, team: "LOSC Lille", played: 3, gd: 3, pts: 6 },
  { pos: 5, team: "Stade Rennais", played: 3, gd: 1, pts: 5 },
  { pos: 6, team: "OGC Nice", played: 3, gd: 0, pts: 4 },
];

const mockPlayers = [
  { id: 1, name: "P. Aubameyang", pos: "ATT", apps: 3, goals: 4, assists: 1 },
  { id: 2, name: "M. Greenwood", pos: "ATT", apps: 3, goals: 2, assists: 3 },
  { id: 3, name: "A. Harit", pos: "MIL", apps: 3, goals: 1, assists: 2 },
  { id: 4, name: "L. Balerdi", pos: "DEF", apps: 3, goals: 1, assists: 0 },
  { id: 5, name: "G. Rulli", pos: "GB", apps: 3, goals: 0, assists: 0 },
];

const mockNews = [
  { id: 1, title: "Mercato : l'OM proche de boucler l'arrivée d'un nouvel attaquant", source: "L'Équipe", date: "2026-08-18", link: "#" },
  { id: 2, title: "De Zerbi valide le groupe pour le déplacement à Monaco", source: "La Provence", date: "2026-08-18", link: "#" },
  { id: 3, title: "Vélodrome : les tarifs des abonnements 2026-27 dévoilés", source: "OM.net", date: "2026-08-17", link: "#" },
];

// ---- Fonctions exposées aux pages ----

async function getFixtures() {
  if (!USE_LIVE_DATA) return mockFixtures;
  const data = await fdFetch(`/teams/${OM_TEAM_ID}/matches?status=SCHEDULED`);
  return data.matches.map((m) => ({
    id: m.id, competition: m.competition.name,
    home: m.homeTeam.name, away: m.awayTeam.name,
    date: m.utcDate, venue: m.venue || "—",
  }));
}

async function getResults() {
  if (!USE_LIVE_DATA) return mockResults;
  const data = await fdFetch(`/teams/${OM_TEAM_ID}/matches?status=FINISHED`);
  return data.matches.map((m) => ({
    id: m.id, competition: m.competition.name,
    home: m.homeTeam.name, away: m.awayTeam.name,
    homeScore: m.score.fullTime.home, awayScore: m.score.fullTime.away,
    date: m.utcDate.slice(0, 10),
  }));
}

async function getStandings() {
  if (!USE_LIVE_DATA) return mockStandings;
  const data = await fdFetch(`/competitions/FL1/standings`);
  return data.standings[0].table.map((row) => ({
    pos: row.position, team: row.team.name,
    played: row.playedGames, gd: row.goalDifference, pts: row.points,
  }));
}

async function getNextMatch() {
  if (!USE_LIVE_DATA) return mockNextMatch;
  const fixtures = await getFixtures();
  return fixtures[0] || null;
}

// Pas d'API gratuite fiable pour les stats joueurs détaillées en Ligue 1 :
// modifie directement mockPlayers ci-dessus pour les tenir à jour à la main.
async function getPlayerStats() {
  return mockPlayers;
}

// Pour activer un vrai flux RSS (site officiel, L'Équipe, La Provence...),
// renseigne l'URL ci-dessous et décommente le bloc dans getNews().
const RSS_FEED_URL = ""; // ex: "https://www.om.net/feed"

async function getNews() {
  // if (RSS_FEED_URL) {
  //   const res = await fetch(
  //     `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_FEED_URL)}`
  //   );
  //   const data = await res.json();
  //   return data.items.map((item, i) => ({
  //     id: i, title: item.title, source: data.feed.title,
  //     date: item.pubDate.slice(0, 10), link: item.link,
  //   }));
  // }
  return mockNews;
}
