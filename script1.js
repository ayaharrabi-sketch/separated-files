
const articles = [
    {
        "title": "La rentrée, un nouveau chapitre à écrire ensemble",
        "cat": "Vie du campus",
        "date": "10 octobre 2026",
        "img": "photo-1523050854058-8df90110c9f1",
        "body": "Bienvenue dans cette nouvelle année universitaire. Découvrez les espaces du campus, rencontrez les associations et préparez vos premiers projets. Cet article est un exemple de contenu pour la maquette SESAME News."
    },
    {
        "title": "Intelligence artificielle : les idées de demain commencent ici",
        "cat": "Innovation",
        "date": "8 octobre 2026",
        "img": "photo-1516321318423-f06f85e504b3",
        "body": "Ateliers, échanges et projets étudiants : une rencontre pour explorer les applications de l’intelligence artificielle. Programme de démonstration à remplacer par une actualité validée."
    },
    {
        "title": "Clubs étudiants : trouvez votre communauté",
        "cat": "Vie étudiante",
        "date": "6 octobre 2026",
        "img": "photo-1523240795612-9a054b0db644",
        "body": "Culture, technologie et engagement : découvrez les clubs et imaginez votre prochaine aventure collective. Contenu fictif pour présenter le parcours de lecture."
    },
    {
        "title": "Un campus ouvert sur les rencontres et les projets",
        "cat": "Vie du campus",
        "date": "4 octobre 2026",
        "img": "photo-1521737711867-e3b97375f902",
        "body": "Découvrez les collaborations et les initiatives étudiantes dans cet exemple de publication."
    }
];
// Les conférences et examens. Ces exemples restent en mémoire pendant la session.
const events = [
    {
        "day": "—",
        "month": "Date à renseigner",
        "title": "Conférence 1 · À renseigner",
        "speaker": "À renseigner",
        "time": "À renseigner",
        "place": "À renseigner",
        "type": "Événements",
        "description": "La description de la conférence sera ajoutée par l’administration.",
        "img": "photo-1475721027785-f74eccf877e2"
    },
    {
        "day": "—",
        "month": "Date à renseigner",
        "title": "Conférence 2 · À renseigner",
        "speaker": "À renseigner",
        "time": "À renseigner",
        "place": "À renseigner",
        "type": "Événements",
        "description": "La description de la conférence sera ajoutée par l’administration.",
        "img": "photo-1511632765486-a01980e01a18"
    },
    {
        "day": "—",
        "month": "Date à renseigner",
        "title": "Conférence 3 · À renseigner",
        "time": "À renseigner",
        "place": "À renseigner",
        "type": "Événements",
        "speaker": "À renseigner",
        "description": "La description de la conférence sera ajoutée par l’administration.",
        "img": "photo-1540575467063-178a50c2df87"
    },
    {
        "day": "28",
        "month": "OCT",
        "title": "Examen · Algorithmique",
        "time": "09:00",
        "place": "Salle B204",
        "type": "Examens"
    },
    {
        "day": "30",
        "month": "OCT",
        "title": "Examen · Bases de données",
        "time": "11:00",
        "place": "Salle A102",
        "type": "Examens"
    }
];
// 2. ÉTAT : ces variables mémorisent la langue, les filtres et le rôle choisi.
let activeLanguage = 'fr';
// Trouver un élément HTML avec son identifiant ou sa classe.
function getElement(selector) {
    return document.querySelector(selector);
}
let newsFilter = 'Tout';
let agendaFilter = 'Tout';
let currentRole = 'Étudiant';
let signedIn = false;
// 3. NAVIGATION : afficher la page demandée et masquer les autres.
function showPage(id) {
    if (!signedIn && id !== 'login') {
        id = 'login';
    }
    if (id === 'admin' && currentRole !== 'Administrateur') {
        id = 'profile';
    }
    document.body.dataset.page = id;
    document.body.classList.toggle('home-mode', id === 'home');
    const video = document.getElementById('earth-video');
    if (id === 'home' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        video.play().catch(function () {
            document.getElementById('video-status').textContent = 'Appuyez sur lecture pour démarrer la vidéo.';
        });
    }
    else {
        video.pause();
    }
    document.querySelectorAll('.page').forEach(function (p) {
        return p.classList.toggle('hidden', p.id !== id);
    });
    document.querySelectorAll('nav button').forEach(function (b) {
        return b.classList.toggle('active', b.dataset.page === id);
    });
    window.scrollTo(0, 0);
}
// Échapper les caractères HTML pour afficher les textes saisis sans les exécuter.
function escapeHTML(v) {
    return String(v).replace(/[&<>"']/g, function (c) {
        return ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[c]);
    });
}
// Construire le HTML d’une carte d’actualité.
function createArticleCard(article, index) {
    const title = escapeHTML(article.title);
    const category = escapeHTML(article.cat);
    const date = escapeHTML(article.date);
    let html = '<button class="card" data-article="' + index + '">';
    html += '<img src="https://images.unsplash.com/' + article.img + '?auto=format&fit=crop&w=700&q=80" alt="" loading="lazy">';
    html += '<div class="card-body">';
    html += '<span class="category">' + category + '</span>';
    html += '<h3>' + title + '</h3>';
    html += '<span class="date">' + date + ' · 3 min de lecture</span>';
    html += '</div></button>';
    return html;
}
// 4. ACTUALITÉS : parcourir les articles et appliquer les filtres.
function renderNews() {
    const searchText = getElement('#search').value.toLowerCase();
    let cardsHTML = '';
    for (let index = 0; index < articles.length; index++) {
        const article = articles[index];
        let title = article.title;
        if (activeLanguage === 'en') {
            title = englishText(title);
        }
        const matchesCategory = newsFilter === 'Tout' || article.cat === newsFilter;
        const matchesSearch = title.toLowerCase().includes(searchText);
        if (matchesCategory && matchesSearch) {
            cardsHTML += createArticleCard(article, index);
        }
    }
    if (cardsHTML === '') {
        cardsHTML = '<p>Aucune actualité trouvée. Essayez un autre mot.</p>';
    }
    getElement('#news-cards').innerHTML = cardsHTML;
}
// Construire une ligne pour un événement ou un examen.
function createEventItem(eventItem) {
    const index = events.indexOf(eventItem);
    let html = '<div class="event" role="button" tabindex="0" data-event="' + index + '">';
    html += '<div class="day">' + eventItem.day + '<small>' + eventItem.month + '</small></div>';
    html += '<div><strong>' + escapeHTML(eventItem.title) + '</strong>';
    html += '<p>' + eventItem.time + ' · ' + escapeHTML(eventItem.place) + '</p>';
    if (eventItem.speaker) {
        html += '<p>' + escapeHTML(eventItem.speaker) + '</p>';
    }
    html += '<span class="category">' + eventItem.type + '</span></div></div>';
    return html;
}
// Construire une carte de conférence.
function createConferenceCard(e) {
    const index = events.indexOf(e);
    return `<button class="conference-card" data-event="${index}"><div class="conference-photo"><img src="https://images.unsplash.com/${e.img || 'photo-1475721027785-f74eccf877e2'}?auto=format&fit=crop&w=800&q=80" alt="" loading="lazy"><span class="conference-date">${escapeHTML(e.day)} ${escapeHTML(e.month)} · ${escapeHTML(e.time)}</span></div><div class="conference-body"><span class="category">Conférence · Campus SESAME</span><h3>${escapeHTML(e.title.replace('Conférence · ', ''))}</h3><p class="conference-meta"><strong>Lieu</strong> ${escapeHTML(e.place)}</p><p class="conference-meta"><strong>Conférencier</strong> ${escapeHTML(e.speaker || 'À annoncer')}</p><p class="conference-description">${escapeHTML(e.description || 'Le programme détaillé sera communiqué prochainement.')}</p><span class="conference-link">Découvrir la conférence ↗</span></div></button>`;
}
// Afficher les conférences et les examens selon le filtre choisi.
function renderAgenda() {
    let conferenceCards = '';
    let examItems = '';
    for (let index = 0; index < events.length; index++) {
        const eventItem = events[index];
        if (eventItem.type === 'Événements') {
            conferenceCards += createConferenceCard(eventItem);
        }
        if (eventItem.type === 'Examens') {
            examItems += createEventItem(eventItem);
        }
    }

    let html = '';
    if (agendaFilter !== 'Examens') {
        html += '<div class="section-head"><h2>Conférences & rencontres</h2><div>';
        html += '<button class="scroll-arrow" data-scroll="-1" aria-label="Événements précédents">←</button>';
        html += '<button class="scroll-arrow" data-scroll="1" aria-label="Événements suivants">→</button>';
        html += '</div></div>';
        html += '<p class="hint">Faites défiler les cartes pour découvrir les prochains rendez-vous.</p>';
        html += '<div class="conference-track" id="conference-track" tabindex="0" aria-label="Conférences à faire défiler">';
        html += conferenceCards + '</div>';
    }
    if (agendaFilter !== 'Événements') {
        html += '<div class="exam-section"><h2>Examens à venir</h2>';
        html += examItems + '</div>';
    }
    getElement('#agenda-list').innerHTML = html;

    const filterButtons = document.querySelectorAll('#agenda-filters button');
    for (let index = 0; index < filterButtons.length; index++) {
        const button = filterButtons[index];
        const isSelected = button.dataset.category === agendaFilter;
        button.classList.toggle('active', isSelected);
    }
}
// Ouvrir la fenêtre de détails avec un titre et un paragraphe.
function showDetails(title, body) {
    getElement('#detail-body').replaceChildren();
    const h = document.createElement('h2');
    h.textContent = title;
    const p = document.createElement('p');
    p.textContent = body;
    getElement('#detail-body').append(h, p);
    getElement('#detail').showModal();
}
// 5. ASSISTANT : afficher une réponse de démonstration, sans serveur ni IA.
function sendChatMessage(question) {
    const userMessage = document.createElement('div');
    userMessage.className = 'bubble user';
    userMessage.textContent = question;
    getElement('#messages').append(userMessage);
    let answer = 'Cette interface présente le futur assistant SESAME. Les réponses officielles seront disponibles après connexion du RAG aux documents validés de l’université.';
    if (/examen/i.test(question)) {
        answer = 'Pour consulter le planning de démonstration, ouvrez Agenda puis le filtre Examens. Dans la version finale, les dates seront fournies par la scolarité.';
    }
    else if (/attestation/i.test(question)) {
        answer = 'Dans la version finale, je rechercherai la procédure dans les documents internes validés et afficherai la source. Cette maquette ne contient pas encore de procédure officielle.';
    }
    if (/présence|presence|attendance/i.test(question)) {
        answer = 'Pour obtenir un certificat de présence, la procédure devra être confirmée par la scolarité. Le chatbot affichera les étapes et la source officielle lorsque les documents seront connectés.';
    }
    else if (/heure|time|examen|exam/i.test(question)) {
        answer = 'Consultez Agenda → Examens pour voir la date, l’heure et la salle. Les horaires affichés ici sont des exemples ; le planning officiel sera ajouté par la scolarité.';
    }
    if (activeLanguage === 'en') {
        if (/exam|heure|time/i.test(question)) {
            answer = 'Open Calendar → Exams to view the date, time and room. These are sample schedules; official information will be provided by student services.';
        }
        else {
            answer = 'The official procedure will be provided by student services. This prototype is not connected to university documents yet.';
        }
    }
    if (activeLanguage === 'de') {
        if (/exam|examen|heure|zeit|prüfung/i.test(question)) {
            answer = 'Öffnen Sie Kalender → Prüfungen, um Datum, Uhrzeit und Raum zu sehen. Die angezeigten Termine sind Beispiele. Offizielle Termine werden vom Studierendenservice bereitgestellt.';
        }
        else {
            answer = 'Die offizielle Vorgehensweise wird vom Studierendenservice bestätigt. Dieser Prototyp ist noch nicht mit internen Universitätsdokumenten verbunden.';
        }
    }
    const reply = document.createElement('div');
    reply.className = 'bubble';
    reply.textContent = answer;
    getElement('#messages').append(reply);
    getElement('#chat-input').value = '';
    reply.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });
}
getElement('#home-cards').innerHTML = articles.slice(1, 3).map(function (a, i) {
    return createArticleCard(a, i + 1);
}).join('');
getElement('#upcoming').innerHTML = events.slice(0, 2).map(createEventItem).join('');
getElement('#news-filters').innerHTML = ['Tout', 'Vie du campus', 'Innovation', 'Vie étudiante'].map(function (x, i) {
    return `<button data-category="${x}" class="${i === 0 ? 'active' : ''}">${x}</button>`;
}).join('');
getElement('#agenda-filters').innerHTML = ['Tout', 'Événements', 'Examens'].map(function (x) {
    return `<button data-category="${x}">${x}</button>`;
}).join('');
renderNews();
renderAgenda();
document.addEventListener('click', function (e) {
    const b = e.target.closest('button');
    if (!b) {
        return;
    }
    if (b.dataset.page) {
        showPage(b.dataset.page);
        if (b.dataset.filter) {
            agendaFilter = b.dataset.filter;
            renderAgenda();
        }
    }
    if (b.dataset.article !== undefined) {
        const a = articles[Number(b.dataset.article)];
        showDetails(a.title, a.body);
    }
    if (b.dataset.question) {
        sendChatMessage(b.dataset.question);
    }
});
getElement('#news-filters').onclick = function (e) {
    if (e.target.tagName === 'BUTTON') {
        newsFilter = e.target.dataset.category;
        getElement('#news-filters').querySelectorAll('button').forEach(function (b) {
            return b.classList.toggle('active', b === e.target);
        });
        renderNews();
    }
};
getElement('#agenda-filters').onclick = function (e) {
    if (e.target.tagName === 'BUTTON') {
        agendaFilter = e.target.dataset.category;
        renderAgenda();
    }
};
getElement('#search').oninput = renderNews;
getElement('#close').onclick = function () {
    return getElement('#detail').close();
};
getElement('#detail').onclick = function (e) {
    if (e.target === getElement('#detail')) {
        getElement('#detail').close();
    }
};
getElement('#chat-form').onsubmit = function (e) {
    e.preventDefault();
    const q = getElement('#chat-input').value.trim();
    if (q) {
        sendChatMessage(q);
    }
};
getElement('#login-form').onsubmit = function (e) {
    e.preventDefault();
    signedIn = true;
    document.body.classList.remove('locked');
    getElement('.name').textContent = currentRole;
    getElement('#profile-title').textContent = 'Espace ' + currentRole;
    getElement('#profile-email').textContent = getElement('#email').value;
    getElement('#admin-link').classList.toggle('hidden', currentRole !== 'Administrateur');
    getElement('#password').value = '';
    updateCounts();
    showPage(currentRole === 'Administrateur' ? 'admin' : 'home');
};
getElement('#procedures').onclick = function () {
    showPage('chat');
    getElement('#chat-input').value = 'Comment effectuer une démarche administrative ?';
};
getElement('#forgot').onclick = function () {
    return showDetails('Réinitialisation du mot de passe', 'La récupération du compte sera reliée au service d’authentification de SESAME dans la version finale.');
};
getElement('#notifications').onclick = function () {
    return showDetails('Vos notifications', 'Aucune nouvelle notification dans ce prototype. Les rappels d’événements et d’examens apparaîtront ici.');
};
// Mettre à jour les compteurs du tableau de bord.
function updateCounts() {
    getElement('#news-count').textContent = articles.length;
    getElement('#event-count').textContent = events.length;
}
document.querySelectorAll('[data-role]').forEach(function (b) {
    return b.onclick = function () {
        currentRole = b.dataset.role;
        document.querySelectorAll('[data-role]').forEach(function (x) {
            x.classList.toggle('active', x === b);
            x.setAttribute('aria-pressed', String(x === b));
        });
    };
});
getElement('#logout').onclick = function () {
    signedIn = false;
    document.body.classList.add('locked');
    showPage('login');
};
// Afficher les détails d’un événement dans la langue choisie.
function showEvent(el) {
    const e = events[Number(el.dataset.event)];
    if (activeLanguage === 'en') {
        showDetails(englishText(e.title), `${englishText(e.day + ' ' + e.month)} at ${englishText(e.time)}. Location: ${englishText(e.place)}. Speaker: ${englishText(e.speaker || 'À annoncer')}. ${englishText(e.description || 'Les détails seront communiqués prochainement.')} — Sample content and speakers for this prototype.`);
    }
    else {
        showDetails(e.title, `${e.day} ${e.month} à ${e.time}. Lieu : ${e.place}. Conférencier : ${e.speaker || 'À annoncer'}. ${e.description || 'Les détails seront communiqués prochainement.'} — Contenu et intervenants fictifs pour la maquette.`);
    }
}
document.addEventListener('click', function (e) {
    const el = e.target.closest('[data-event]');
    if (el) {
        showEvent(el);
    }
});
document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-event]')) {
        e.preventDefault();
        showEvent(e.target);
    }
});
getElement('#publish-form').onsubmit = function (e) {
    e.preventDefault();
    if (currentRole !== 'Administrateur' || !signedIn) {
        return;
    }
    const title = getElement('#publish-title').value.trim();
    const body = getElement('#publish-body').value.trim();
    const date = getElement('#publish-date').value;
    if (!title || !body) {
        return;
    }
    if (getElement('#publish-type').value === 'Actualité') {
        articles.unshift({
            title, body,
            cat: 'Vie du campus',
            date: date ? new Date(date + 'T12:00:00').toLocaleDateString('fr-FR') : 'Date à renseigner',
            img: 'photo-1521737711867-e3b97375f902'
        });
        renderNews();
        getElement('#home-cards').innerHTML = articles.slice(0, 2).map(createArticleCard).join('');
    }
    else {
        const d = date ? new Date(date + 'T12:00:00') : null;
        events.push({
            title,
            day: d ? String(d.getDate()).padStart(2, '0') : '—',
            month: d ? d.toLocaleDateString('fr-FR', {
                month: 'short'
            }).toUpperCase() : 'Date à renseigner',
            time: getElement('#publish-time').value || 'À renseigner',
            place: getElement('#publish-place').value.trim() || 'À renseigner',
            speaker: getElement('#publish-speaker').value.trim() || 'À renseigner',
            description: body,
            type: 'Événements'
        });
        renderAgenda();
    }
    updateCounts();
    getElement('#publish-form').reset();
    showDetails('Publication ajoutée', 'Votre publication est visible dans la maquette pendant cette session.');
};
document.body.classList.add('locked');
showPage('login');
// 6. VIDÉO : boutons lecture/pause et messages de chargement.
const globeVideo = getElement('#earth-video');
const globeButton = getElement('#earth-toggle');
function syncVideo() {
    globeButton.textContent = globeVideo.paused ? '▶' : 'Ⅱ';
    globeButton.setAttribute('aria-label', globeVideo.paused ? 'Lire la vidéo' : 'Mettre la vidéo en pause');
    globeButton.setAttribute('aria-pressed', String(globeVideo.paused));
}
globeButton.onclick = function () {
    if (globeVideo.paused) {
        globeVideo.play().catch(function () {
            getElement('#video-status').textContent = 'La vidéo nécessite une connexion Internet.';
        });
    }
    else {
        globeVideo.pause();
    }
};
globeVideo.addEventListener('play', function () {
    syncVideo();
    getElement('#video-status').textContent = '';
});
globeVideo.addEventListener('pause', syncVideo);
globeVideo.addEventListener('error', function () {
    getElement('#video-status').textContent = 'La vidéo nécessite une connexion Internet et un accès au média Harvard.';
});
syncVideo();
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    globeVideo.removeAttribute('autoplay');
    globeVideo.pause();
}
document.addEventListener('click', function (e) {
    const b = e.target.closest('[data-scroll]');
    if (b) {
        const track = getElement('#conference-track');
        track.scrollBy({
            left: Number(b.dataset.scroll) * (track.querySelector('.conference-card').offsetWidth + 22),
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
        });
    }
});
getElement('#publish-type').addEventListener('change', function () {
    return getElement('#conference-fields').classList.toggle('hidden', getElement('#publish-type').value !== 'Événement');
});
// 7. TRADUCTIONS : chaque texte français est associé à son texte anglais.
const translations = {
    'Langue': 'Language',
    'Couleur': 'Color',
    'Bleu': 'Blue',
    'Vert': 'Green',
    'Accueil': 'Home',
    'Actualités': 'News',
    'Agenda': 'Calendar',
    'Assistant': 'Assistant',
    'Étudiant': 'Student',
    'Professeur': 'Professor',
    'Administrateur': 'Administrator',
    'Votre espace SESAME': 'Your SESAME space',
    'Heureux de vous retrouver.': 'Welcome back.',
    'Connectez-vous pour suivre la vie de votre campus.': 'Sign in to follow campus life.',
    'E-mail universitaire': 'University email',
    'Mot de passe': 'Password',
    'Mot de passe oublié ?': 'Forgot password?',
    'Se connecter': 'Sign in',
    'Se déconnecter': 'Sign out',
    'Bienvenue sur votre campus.': 'Welcome to your campus.',
    'Votre université, votre quotidien': 'Your university, your everyday life',
    'Les nouvelles, les rencontres et les moments qui comptent.': 'News, encounters and moments that matter.',
    'SESAME': 'SESAME',
    'dans le monde': 'in the world',
    'Explorer la vie du campus': 'Explore campus life',
    'Mes examens': 'My exams',
    'Événements': 'Events',
    'Démarches': 'Student services',
    'À la une du campus': 'Campus highlights',
    'Toutes les actualités ↗': 'All news ↗',
    'À vos agendas': 'Coming up',
    'Tout voir ↗': 'View all ↗',
    'Votre agenda': 'Your calendar',
    'Conférences & rencontres': 'Conferences & encounters',
    'Examens à venir': 'Upcoming exams',
    'Tout': 'All',
    'Examens': 'Exams',
    'Découvrir la conférence ↗': 'Explore this conference ↗',
    'Lieu': 'Location',
    'Conférencier': 'Speaker',
    'À renseigner': 'To be completed',
    'Comment puis-je vous aider ?': 'How can I help you?',
    'Attestation de scolarité': 'Enrollment certificate',
    'Certificat de présence': 'Attendance certificate',
    'Heure de mon examen': 'Exam time',
    'Planning des examens': 'Exam schedule',
    'Contacter la scolarité': 'Contact student services',
    'Envoyer ↗': 'Send ↗',
    'Mon profil': 'My profile',
    'Mon espace': 'My space',
    'Mon agenda': 'My calendar',
    'Administration': 'Administration',
    'Tableau de bord': 'Dashboard',
    'Ajouter une publication': 'Add a publication',
    'Titre': 'Title',
    'Nom du conférencier': 'Speaker name',
    'Heure': 'Time',
    'Ajouter à la maquette': 'Add to prototype',
    'Conférence · Campus SESAME': 'Conference · SESAME campus',
    'Date à renseigner': 'Date to be completed',
    'La description de la conférence sera ajoutée par l’administration.': 'The conference description will be added by the administration.'
};
// Textes allemands. Les clés françaises restent identiques.
const germanTranslations = {
    "Langue": "Sprache",
    "Couleur": "Farbe",
    "Bleu": "Blau",
    "Vert": "Grün",
    "Violet": "Violett",
    "Accueil": "Startseite",
    "Actualités": "Nachrichten",
    "Agenda": "Kalender",
    "Assistant": "Assistent",
    "Étudiant": "Studierende",
    "Professeur": "Lehrende",
    "Administrateur": "Administration",
    "Votre espace SESAME": "Ihr SESAME-Bereich",
    "Heureux de vous retrouver.": "Schön, dass Sie wieder da sind.",
    "Connectez-vous pour suivre la vie de votre campus.": "Melden Sie sich an und entdecken Sie das Campusleben.",
    "E-mail universitaire": "Universitäts-E-Mail",
    "Mot de passe": "Passwort",
    "Mot de passe oublié ?": "Passwort vergessen?",
    "Se connecter": "Anmelden",
    "Se déconnecter": "Abmelden",
    "Bienvenue sur votre campus.": "Willkommen auf Ihrem Campus.",
    "Votre université, votre quotidien": "Ihre Universität, Ihr Alltag",
    "Les nouvelles, les rencontres et les moments qui comptent.": "Neuigkeiten, Begegnungen und besondere Momente.",
    "SESAME": "SESAME",
    "dans le monde": "in der Welt",
    "Explorer la vie du campus": "Campusleben entdecken",
    "Mes examens": "Meine Prüfungen",
    "Événements": "Veranstaltungen",
    "Démarches": "Studierendenservice",
    "À la une du campus": "Campus-Highlights",
    "Toutes les actualités ↗": "Alle Nachrichten ↗",
    "À vos agendas": "Demnächst",
    "Tout voir ↗": "Alle anzeigen ↗",
    "Votre agenda": "Ihr Kalender",
    "Conférences & rencontres": "Vorträge und Begegnungen",
    "Examens à venir": "Kommende Prüfungen",
    "Tout": "Alle",
    "Examens": "Prüfungen",
    "Découvrir la conférence ↗": "Vortrag entdecken ↗",
    "Lieu": "Ort",
    "Conférencier": "Referent/in",
    "À renseigner": "Noch einzutragen",
    "Comment puis-je vous aider ?": "Wie kann ich Ihnen helfen?",
    "Attestation de scolarité": "Studienbescheinigung",
    "Certificat de présence": "Anwesenheitsbescheinigung",
    "Heure de mon examen": "Prüfungszeit",
    "Planning des examens": "Prüfungsplan",
    "Contacter la scolarité": "Studierendenservice kontaktieren",
    "Envoyer ↗": "Senden ↗",
    "Mon profil": "Mein Profil",
    "Mon espace": "Mein Bereich",
    "Mon agenda": "Mein Kalender",
    "Administration": "Verwaltung",
    "Tableau de bord": "Übersicht",
    "Ajouter une publication": "Beitrag hinzufügen",
    "Titre": "Titel",
    "Nom du conférencier": "Name des Referenten / der Referentin",
    "Heure": "Uhrzeit",
    "Ajouter à la maquette": "Zum Prototyp hinzufügen",
    "Conférence · Campus SESAME": "Vortrag · SESAME-Campus",
    "Date à renseigner": "Datum noch einzutragen",
    "La description de la conférence sera ajoutée par l’administration.": "Die Vortragsbeschreibung wird von der Verwaltung ergänzt.",
    "Menu": "Menü",
    "Fermer ✕": "Schließen ✕",
    "Événements & examens": "Veranstaltungen und Prüfungen",
    "Assistant SESAME": "SESAME-Assistent",
    "Explorez.": "Entdecken.",
    "Rencontrez.": "Begegnen.",
    "Imaginez.": "Gestalten.",
    "VOTRE CAMPUS, VOTRE MONDE": "IHR CAMPUS, IHRE WELT",
    "Toute la vie de SESAME à portée de main.": "Das gesamte SESAME-Campusleben zum Greifen nah.",
    "Type": "Typ",
    "Actualité": "Nachricht",
    "Événement": "Veranstaltung",
    "Date": "Datum",
    "Description de l’actualité ou de la conférence": "Beschreibung der Nachricht oder des Vortrags",
    "Les ajouts restent en mémoire et disparaissent au rechargement.": "Ergänzungen bleiben nur bis zum Neuladen gespeichert.",
    "Votre planning en un clic": "Ihr Plan mit einem Klick",
    "Ne manquez aucun rendez-vous": "Keinen Termin verpassen",
    "L’essentiel de la scolarité": "Alles Wichtige zum Studium",
    "Une question ?": "Eine Frage?",
    "On vous accompagne.": "Wir unterstützen Sie.",
    "Discuter avec l’assistant ↗": "Mit dem Assistenten chatten ↗",
    "Votre assistant SESAME": "Ihr SESAME-Assistent",
    "Faites défiler les cartes pour découvrir les prochains rendez-vous.": "Scrollen Sie durch die Karten und entdecken Sie kommende Termine."
};
Object.assign(translations, {
    "Violet": "Purple",
    "LE FIL DE VOTRE CAMPUS": "YOUR CAMPUS NEWSFEED",
    "Espace étudiant": "Student space",
    "Menu": "Menu",
    "Fermer ✕": "Close ✕",
    "VOTRE CAMPUS, VOTRE MONDE": "YOUR CAMPUS, YOUR WORLD",
    "Explorez.": "Explore.",
    "Rencontrez.": "Connect.",
    "Imaginez.": "Imagine.",
    "Toute la vie de SESAME à portée de main.": "All of SESAME campus life at your fingertips.",
    "Événements & examens": "Events & exams",
    "Assistant SESAME": "SESAME Assistant",
    "Une communauté qui apprend, partage et imagine l’avenir. Découvrez les actualités, les rencontres et les idées qui font vivre notre université.": "A community that learns, shares and shapes the future. Discover the news, encounters and ideas that bring our university to life.",
    "ÉDITION CAMPUS · OCTOBRE 2026": "CAMPUS EDITION · OCTOBER 2026",
    "Votre planning en un clic": "Your schedule in one click",
    "Ne manquez aucun rendez-vous": "Never miss an event",
    "L’essentiel de la scolarité": "Essential student services",
    "Votre assistant SESAME": "Your SESAME assistant",
    "Une question ?": "Have a question?",
    "On vous accompagne.": "We are here to help.",
    "Scolarité, démarches, vie étudiante… retrouvez vos informations au même endroit.": "Studies, administration and student life… find your information in one place.",
    "Discuter avec l’assistant ↗": "Chat with the assistant ↗",
    "Votre prochain examen": "Your next exam",
    "Algorithmique · 28 octobre à 09:00": "Algorithms · October 28 at 09:00",
    "Salle B204 · Données de démonstration": "Room B204 · Sample data",
    "Le journal de SESAME": "The SESAME journal",
    "Actualités du campus": "Campus news",
    "Découvrez les projets, les visages et les idées qui font vivre notre université.": "Discover the projects, people and ideas that bring our university to life.",
    "Les rendez-vous à retenir": "Dates to remember",
    "Événements et examens : préparez les prochaines semaines.": "Events and exams: plan the weeks ahead.",
    "Dates, lieux et contenus fictifs pour la maquette.": "Sample dates, locations and content for this prototype.",
    "Votre compagnon de campus": "Your campus companion",
    "L’assistant de votre université": "Your university assistant",
    "Un point de départ pour toutes vos questions étudiantes.": "A starting point for all your student questions.",
    "Prototype de conversation. Le chatbot RAG et les documents internes ne sont pas encore connectés.": "Conversation prototype. The RAG chatbot is not connected to internal documents yet.",
    "Bonjour ! Je suis l’assistant SESAME. Choisissez une question ou écrivez votre message pour découvrir la maquette.": "Hello! I am the SESAME assistant. Choose a question or type your message to explore the prototype.",
    "Connexion de démonstration : aucune donnée n’est envoyée ni enregistrée. Utilisez des valeurs fictives.": "Demo sign-in: no credentials are sent or saved. Use sample values.",
    "Votre photo de profil": "Your profile photo",
    "Choisissez une image JPG, PNG ou WebP · 5 Mo maximum.": "Choose a JPG, PNG or WebP image · Maximum 5 MB.",
    "Ajouter une photo": "Add a photo",
    "Retirer la photo": "Remove photo",
    "La photo reste sur cet appareil pendant la session.": "Your photo stays on this device for this session.",
    "Le rôle sélectionné simule un parcours. Les droits réels seront vérifiés par le serveur.": "The selected role simulates a user journey. Actual permissions will be checked by the server.",
    "BackOffice SESAME": "SESAME Administration",
    "Préparez les publications et les rendez-vous de votre campus.": "Manage publications and events for your campus.",
    "Rendez-vous": "Scheduled events",
    "Espaces utilisateurs": "User spaces",
    "Type": "Type",
    "Actualité": "News article",
    "Événement": "Event",
    "Description de l’actualité ou de la conférence": "News article or conference description",
    "Date": "Date",
    "Les ajouts restent en mémoire et disparaissent au rechargement.": "Added content stays in memory and disappears when you reload.",
    "Profil": "Profile",
    "SESAME NEWS · Ensemble, faisons vivre le campus.": "SESAME NEWS · Bringing campus life together.",
    "Prototype UI/UX · Contenus de démonstration": "UI/UX prototype · Sample content",
    "Vie du campus": "Campus life",
    "Vie étudiante": "Student life",
    "Innovation": "Innovation",
    "Faites défiler les cartes pour découvrir les prochains rendez-vous.": "Scroll through the cards to discover upcoming events.",
    "À annoncer": "To be announced",
    "Le programme détaillé sera communiqué prochainement.": "The full programme will be announced soon.",
    "Les détails seront communiqués prochainement.": "Details will be announced soon.",
    "Aucune actualité trouvée. Essayez un autre mot.": "No news found. Try another search term.",
    "La rentrée, un nouveau chapitre à écrire ensemble": "A new academic year, a new chapter together",
    "Intelligence artificielle : les idées de demain commencent ici": "Artificial intelligence: tomorrow’s ideas start here",
    "Clubs étudiants : trouvez votre communauté": "Student clubs: find your community",
    "Un campus ouvert sur les rencontres et les projets": "A campus open to connections and projects",
    "Bienvenue dans cette nouvelle année universitaire. Découvrez les espaces du campus, rencontrez les associations et préparez vos premiers projets. Cet article est un exemple de contenu pour la maquette SESAME News.": "Welcome to the new academic year. Explore campus spaces, meet student associations and prepare your first projects. This is sample content for the SESAME News prototype.",
    "Ateliers, échanges et projets étudiants : une rencontre pour explorer les applications de l’intelligence artificielle. Programme de démonstration à remplacer par une actualité validée.": "Workshops, discussions and student projects: a gathering to explore artificial intelligence applications. This sample programme will be replaced with approved news.",
    "Culture, technologie et engagement : découvrez les clubs et imaginez votre prochaine aventure collective. Contenu fictif pour présenter le parcours de lecture.": "Culture, technology and community: discover student clubs and imagine your next shared adventure. Sample content to demonstrate the reading experience.",
    "Découvrez les collaborations et les initiatives étudiantes dans cet exemple de publication.": "Discover collaborations and student initiatives in this sample publication.",
    "Réinitialisation du mot de passe": "Password reset",
    "La récupération du compte sera reliée au service d’authentification de SESAME dans la version finale.": "Account recovery will connect to SESAME authentication in the final application.",
    "Vos notifications": "Your notifications",
    "Aucune nouvelle notification dans ce prototype. Les rappels d’événements et d’examens apparaîtront ici.": "No new notifications in this prototype. Event and exam reminders will appear here.",
    "Publication ajoutée": "Publication added",
    "Votre publication est visible dans la maquette pendant cette session.": "Your publication is visible in the prototype for this session.",
    "Appuyez sur lecture pour démarrer la vidéo.": "Press play to start the video.",
    "La vidéo nécessite une connexion Internet.": "The video requires an internet connection.",
    "La vidéo nécessite une connexion Internet et un accès au média Harvard.": "The video requires an internet connection and access to the Harvard media file.",
    "Choisissez une image JPG, PNG ou WebP de moins de 5 Mo.": "Choose a JPG, PNG or WebP image smaller than 5 MB.",
    "Photo ajoutée. Elle reste locale et disparaîtra au rechargement.": "Photo added. It stays on this device and disappears when you reload.",
    "Impossible de lire cette image. Essayez une autre photo.": "Unable to load this image. Try another photo.",
    "Université SESAME": "SESAME University",
    "Navigation principale": "Main navigation",
    "Ouvrir mon profil": "Open my profile",
    "Navigation SESAME News": "SESAME News navigation",
    "Fermer le menu": "Close menu",
    "SESAME ouverte sur le monde": "SESAME connected to the world",
    "La planète Terre en rotation": "Planet Earth rotating",
    "Mettre la vidéo en pause": "Pause video",
    "Lire la vidéo": "Play video",
    "Rechercher une actualité": "Search news",
    "Rechercher une actualité…": "Search news…",
    "Votre question": "Your question",
    "Écrivez votre question…": "Type your question…",
    "Choisir un espace": "Choose your role",
    "Votre mot de passe": "Your password",
    "Photo de profil": "Profile photo",
    "Navigation mobile": "Mobile navigation",
    "Fermer": "Close",
    "Événements précédents": "Previous events",
    "Événements suivants": "Next events",
    "Conférences à faire défiler": "Scrollable conferences",
    "Comment obtenir une attestation de scolarité ?": "How can I get an enrollment certificate?",
    "Où trouver mon planning d’examens ?": "Where can I find my exam schedule?",
    "Comment obtenir un certificat de présence ?": "How can I get an attendance certificate?",
    "À quelle heure est mon examen ?": "What time is my exam?",
    "Comment contacter la scolarité ?": "How can I contact student services?",
    "Comment effectuer une démarche administrative ?": "How can I complete an administrative procedure?"
});
// On garde le texte original pour pouvoir revenir au français.
const originalText = new WeakMap();
const lastTranslated = new WeakMap();
const originalAttributes = new WeakMap();
// Chercher une traduction anglaise et traiter les textes contenant des dates.
function englishText(text) {
    let out = translations[text.trim()] ? text.replace(text.trim(), translations[text.trim()]) : text;
    if (out === text) {
        out = out.replace(/Conférence (\d+) · À renseigner/g, 'Conference $1 · To be completed').replace(/Examen · Algorithmique/g, 'Exam · Algorithms').replace(/Examen · Bases de données/g, 'Exam · Databases').replace(/Salle ([A-Z]\d+)/g, 'Room $1').replace(/3 min de lecture/g, '3 min read').replace(/(\d+) octobre (\d+)/g, 'October $1, $2').replace(/Espace Étudiant/g, 'Student space').replace(/Espace Professeur/g, 'Professor space').replace(/Espace Administrateur/g, 'Administrator space').replace(/ · Date à renseigner/g, ' · Date to be completed');
    }
    if (out === text || activeLanguage === "en") {
        out = out.replaceAll("À renseigner", "To be completed").replaceAll("Date à renseigner", "Date to be completed");
    }
    return out;
}
// Traduire les textes et les attributs sans modifier les messages écrits par l’utilisateur.
function translateUI() {
    observer.disconnect();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while (node = walker.nextNode()) {
        if (['SCRIPT', 'STYLE', 'OPTION'].includes(node.parentElement.tagName) && node.parentElement.closest('#site-language')) {
            continue;
        }
        if (['SCRIPT', 'STYLE'].includes(node.parentElement.tagName) || node.parentElement.closest('.bubble.user')) {
            continue;
        }
        if (!originalText.has(node) || lastTranslated.has(node) && node.textContent !== lastTranslated.get(node)) {
            originalText.set(node, node.textContent);
        }
        const original = originalText.get(node);
        let replacement = activeLanguage === 'en' ? englishText(original) : activeLanguage === 'de' && germanTranslations[original.trim()] ? original.replace(original.trim(), germanTranslations[original.trim()]) : original;
        if (node.textContent !== replacement) {
            node.textContent = replacement;
        }
        lastTranslated.set(node, replacement);
    }
    document.querySelectorAll('[placeholder],[aria-label],[alt],[data-question]').forEach(function (el) {
        let values = originalAttributes.get(el);
        if (!values) {
            values = {};
            originalAttributes.set(el, values);
        }
        for (const attr of ['placeholder', 'aria-label', 'alt', 'data-question']) {
            if (!el.hasAttribute(attr)) {
                continue;
            }
            const value = el.getAttribute(attr);
            if (!values[attr] || value !== values[attr].last) {
                values[attr] = {
                    original: value,
                    last: value
                };
            }
            const item = values[attr];
            const translated = activeLanguage === 'en' ? englishText(item.original) : activeLanguage === 'de' ? germanTranslations[item.original] || item.original : item.original;
            if (value !== translated) {
                el.setAttribute(attr, translated);
            }
            item.last = translated;
        }
    });
    document.documentElement.lang = activeLanguage;
    observer.observe(document.body, {
        childList: true,
        characterData: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-label', 'alt', 'placeholder']
    });
}
getElement('#site-theme').onchange = function (e) {
    document.body.dataset.theme = e.target.value;
};
// Cet observateur traduit aussi les éléments ajoutés après le chargement.
const observer = new MutationObserver(function () {
    return translateUI();
});
observer.observe(document.body, {
    childList: true,
    characterData: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-label', 'alt', 'placeholder']
});
// 8. MENU : ouvrir, fermer et gérer le clavier.
const campusMenu = document.getElementById('campus-menu');
const menuTrigger = document.getElementById('menu-open');
let menuTimer;
// Laisser finir l’animation avant de fermer le menu.
function closeCampusMenu() {
    if (!campusMenu.hasAttribute('open')) {
        return;
    }
    campusMenu.classList.add('closing');
    menuTimer = setTimeout(function () {
        campusMenu.removeAttribute('open');
        campusMenu.dispatchEvent(new Event('close'));
        campusMenu.classList.remove('closing');
        document.body.style.overflow = '';
        menuTrigger.setAttribute('aria-expanded', 'false');
        menuTrigger.focus();
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 240);
}
menuTrigger.onclick = function () {
    if (document.body.classList.contains('home-mode')) {
        campusMenu.append(preferenceBar);
    }
    clearTimeout(menuTimer);
    campusMenu.classList.remove('closing');
    campusMenu.setAttribute('open', '');
    document.getElementById('menu-close').focus();
    document.body.style.overflow = 'hidden';
    menuTrigger.setAttribute('aria-expanded', 'true');
};
document.getElementById('menu-close').onclick = closeCampusMenu;
campusMenu.addEventListener('cancel', function (e) {
    e.preventDefault();
    closeCampusMenu();
});
document.querySelectorAll('[data-menu-page]').forEach(function (b) {
    return b.onclick = function () {
        showPage(b.dataset.menuPage);
        closeCampusMenu();
    };
});
// 9. ANIMATIONS : afficher les cartes quand elles deviennent visibles.
const revealObserver = new IntersectionObserver(function (entries) {
    return entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: .08
});
// Inscrire les nouvelles cartes dans l’animation d’apparition.
function registerReveals() {
    document.querySelectorAll('.card,.conference-card,.panel,.stat,.quick button').forEach(function (el, i) {
        if (!el.classList.contains('reveal-item')) {
            el.classList.add('reveal-item');
            el.style.setProperty('--reveal-delay', Math.min(i % 4, 3) * 65 + 'ms');
            revealObserver.observe(el);
        }
    });
}
registerReveals();
new MutationObserver(function (records) {
    if (records.some(function (r) {
        return r.addedNodes.length;
    })) {
        registerReveals();
    }
}).observe(document.querySelector('main'), {
    childList: true,
    subtree: true
});
// Le dessin du robot sert aussi d’icône dans les bulles du chat.
const robotSvg = document.querySelector('.bot-head svg').outerHTML;
document.documentElement.style.setProperty('--bot-face', 'url("data:image/svg+xml,' + encodeURIComponent(robotSvg) + '")');
// 10. PHOTO DE PROFIL : une image locale, effacée au rechargement.
let userPhotoUrl = null;
const photoInput = document.getElementById('photo-file');
const photoPreview = document.getElementById('profile-photo');
const photoStatus = document.getElementById('photo-status');
const removePhoto = document.getElementById('remove-photo');
// Retirer la photo et libérer son adresse temporaire.
function clearUserPhoto() {
    if (userPhotoUrl) {
        URL.revokeObjectURL(userPhotoUrl);
    }
    userPhotoUrl = null;
    photoPreview.innerHTML = '<span>◎</span>';
    const avatar = document.querySelector('.account .avatar');
    avatar.classList.remove('has-photo');
    avatar.textContent = 'A';
    photoInput.value = '';
    removePhoto.classList.add('hidden');
    photoStatus.textContent = 'La photo reste sur cet appareil pendant la session.';
}
photoInput.addEventListener('change', function () {
    const file = photoInput.files[0];
    if (!file) {
        return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
        photoStatus.textContent = 'Choisissez une image JPG, PNG ou WebP de moins de 5 Mo.';
        photoInput.value = '';
        return;
    }
    const candidate = URL.createObjectURL(file);
    const image = new Image();
    image.onload = function () {
        if (userPhotoUrl) {
            URL.revokeObjectURL(userPhotoUrl);
        }
        userPhotoUrl = candidate;
        photoPreview.replaceChildren();
        image.alt = 'Votre photo de profil';
        photoPreview.append(image);
        const avatar = document.querySelector('.account .avatar');
        avatar.replaceChildren();
        const thumbnail = image.cloneNode();
        thumbnail.alt = 'Mon profil';
        avatar.append(thumbnail);
        avatar.classList.add('has-photo');
        removePhoto.classList.remove('hidden');
        photoStatus.textContent = 'Photo ajoutée. Elle reste locale et disparaîtra au rechargement.';
    };
    image.onerror = function () {
        URL.revokeObjectURL(candidate);
        photoStatus.textContent = 'Impossible de lire cette image. Essayez une autre photo.';
    };
    image.src = candidate;
});
removePhoto.onclick = clearUserPhoto;
document.getElementById('logout').addEventListener('click', clearUserPhoto);
getElement('#site-language').onchange = function (e) {
    activeLanguage = e.target.value;
    translateUI();
    renderNews();
    renderAgenda();
    translateUI();
    document.querySelectorAll('input,textarea').forEach(function (el) {
        return el.setCustomValidity('');
    });
};
document.addEventListener('invalid', function (e) {
    if (activeLanguage === 'en') {
        const el = e.target;
        el.setCustomValidity(el.validity.valueMissing ? 'Please complete this field.' : el.validity.typeMismatch ? 'Please enter a valid email address.' : el.validity.tooShort ? 'Please use at least 6 characters.' : 'Please check this value.');
    }
}, true);
document.addEventListener('input', function (e) {
    if (e.target.setCustomValidity) {
        e.target.setCustomValidity('');
    }
});
Object.assign(translations, {
    'SESAME in the World': 'SESAME News in the World',
    'Rechercher': 'Search'
});
Object.assign(germanTranslations, {
    'SESAME in the World': 'SESAME News in der Welt',
    'Rechercher': 'Suchen'
});
getElement('#header-search').onclick = function () {
    showPage('news');
    getElement('#search').focus();
};
// Déplacer les préférences dans le menu sur la page d’accueil.
const preferenceBar = getElement('.preferences');
const preferenceAnchor = document.createComment('preferences');
preferenceBar.before(preferenceAnchor);
campusMenu.addEventListener('close', function () {
    return preferenceAnchor.after(preferenceBar);
});
// Panneau de navigation indépendant du support des dialogues natifs.
document.addEventListener('keydown', function (e) {
    if (!campusMenu.hasAttribute('open')) {
        return;
    }
    if (e.key === 'Escape') {
        e.preventDefault();
        closeCampusMenu();
    }
    if (e.key === 'Tab') {
        const items = Array.from(campusMenu.querySelectorAll('button,select,[tabindex="0"]')).filter(function (el) {
            return el.getClientRects().length;
        });
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        }
        else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
});
translations['SESAME in the World'] = 'SESAME in the World';
germanTranslations['SESAME in the World'] = 'SESAME in the World';
getElement('#site-language').value = 'en';
getElement('#site-language').onchange({
    target: getElement('#site-language')
}); // Inclinaison légère, uniquement avec une souris et sans réduction des animations.
const allowDepth = function () {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
document.addEventListener('pointermove', function (e) {
    if (!allowDepth()) {
        return;
    }
    const createArticleCard = e.target.closest('.card,.conference-card,.quick button');
    if (!createArticleCard || !createArticleCard.classList.contains('is-visible')) {
        return;
    }
    const r = createArticleCard.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    createArticleCard.style.transform = `perspective(1000px) rotateX(${-y * 5}deg) rotateY(${x * 7}deg) translateY(-3px)`;
});
document.addEventListener('pointerout', function (e) {
    const createArticleCard = e.target.closest('.card,.conference-card,.quick button');
    if (createArticleCard && !createArticleCard.contains(e.relatedTarget)) {
        createArticleCard.style.removeProperty('transform');
    }
});
