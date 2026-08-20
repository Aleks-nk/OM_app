const NAV_LINKS = [
  { href: "index.html", label: "Accueil" },
  { href: "calendrier.html", label: "Calendrier" },
  { href: "resultats.html", label: "Résultats" },
  { href: "classement.html", label: "Classement" },
  { href: "stats.html", label: "Stats joueurs" },
  { href: "actus.html", label: "Actus" },
];

function renderNav(activePage) {
  const linksHtml = (cssClass) =>
    NAV_LINKS.map(
      (l) =>
        `<a class="${cssClass}${l.href === activePage ? " active" : ""}" href="${l.href}">${l.label}</a>`
    ).join("");

  document.getElementById("site-header").innerHTML = `
    <div class="header-inner">
      <a class="logo" href="index.html">OM <span>LIVE</span></a>
      <nav class="desktop-nav">${linksHtml("")}</nav>
    </div>
    <nav class="main-nav">${linksHtml("")}</nav>
  `;

  document.getElementById("site-footer").innerHTML = `
    <div class="footer-inner">
      <p>Projet non officiel de suivi de l'Olympique de Marseille.</p>
      <p>Données à titre indicatif — pas affilié au club.</p>
    </div>
  `;
}

// ---- Aides de formatage partagées ----

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "short", day: "2-digit", month: "short",
  });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function fixtureCardHtml(m) {
  return `
    <div class="card fixture-row">
      <div>
        <span class="tag">${m.competition}</span>
        <p>${m.home} <span style="opacity:.4">vs</span> ${m.away}</p>
        <p style="font-size:.85rem;opacity:.6">${m.venue}</p>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <p class="display" style="font-size:.85rem">${formatDate(m.date)}</p>
        <p class="score" style="color:var(--ciel)">${formatTime(m.date)}</p>
      </div>
    </div>`;
}

function resultCardHtml(m) {
  const isOMHome = m.home.includes("Marseille");
  const omScore = isOMHome ? m.homeScore : m.awayScore;
  const oppScore = isOMHome ? m.awayScore : m.homeScore;
  const outcome = omScore > oppScore ? "V" : omScore < oppScore ? "D" : "N";
  const badgeClass = outcome === "V" ? "win" : outcome === "D" ? "loss" : "draw";
  return `
    <div class="card result-row">
      <span class="badge ${badgeClass}">${outcome}</span>
      <div style="flex:1">
        <span class="tag">${m.competition} · ${m.date}</span>
        <p>${m.home} <span style="opacity:.4">—</span> ${m.away}</p>
      </div>
      <div style="display:flex;gap:4px;flex-shrink:0">
        <span class="score-digit">${m.homeScore}</span>
        <span class="score-digit">${m.awayScore}</span>
      </div>
    </div>`;
}

function newsCardHtml(a) {
  return `
    <a class="card" href="${a.link}">
      <span class="tag">${a.source} · ${a.date}</span>
      <p>${a.title}</p>
    </a>`;
}

// ---- Rafraîchissement automatique ----
// Relance `renderFn` immédiatement puis toutes les `intervalMs` millisecondes,
// tant que l'onglet est visible (on ne consomme pas de requêtes API inutiles
// quand la page est en arrière-plan). Utilisé pour que calendrier, résultats
// et classement se mettent à jour tout seuls une fois la clé API branchée.
function startAutoRefresh(renderFn, intervalMs = 120000) {
  renderFn();
  setInterval(() => {
    if (document.visibilityState === "visible") renderFn();
  }, intervalMs);
}

function renderUpdatedAt(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  el.textContent = `Mis à jour à ${now}`;
}

// Affiche un message d'erreur lisible dans le conteneur donné au lieu de le
// laisser vide en silence, et logue le détail dans la console (F12) pour le
// débogage.
function renderFetchError(containerId, error, colspan) {
  console.error("Erreur de récupération des données :", error);
  const el = document.getElementById(containerId);
  if (!el) return;
  const message = `Impossible de charger les données en direct (${error.message}). Vérifie ta clé API dans js/data.js, ou regarde la console du navigateur (F12) pour le détail.`;
  el.innerHTML = colspan
    ? `<tr><td colspan="${colspan}" style="color:var(--tuile)">${message}</td></tr>`
    : `<p style="color:var(--tuile)">${message}</p>`;
}
