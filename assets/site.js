(function(){
  // ---- Nav-only FR/EN toggle (shared across all pages) ----
  var NAV_I18N = {
    fr: {
      nav_qui:"À propos", nav_invest:"Investissements", nav_gouv:"Gouvernance", nav_actu:"Actualités",
      nav_carrieres:"Carrières", nav_contact:"Contact", nav_cta:"Soumettre un projet",
      drop_presentation:"Présentation", drop_dg:"Mot du DG", drop_comite:"Comité de direction",
      drop_secteurs:"Secteurs stratégiques", filiales_eyebrow:"Filiales & véhicules",
      footprint_eyebrow:"Présence sur le territoire", hero_cta2:"Soumission de projet", pub_eyebrow:"Publications"
    },
    en: {
      nav_qui:"About", nav_invest:"Investments", nav_gouv:"Governance", nav_actu:"News",
      nav_carrieres:"Careers", nav_contact:"Contact", nav_cta:"Submit a project",
      drop_presentation:"Overview", drop_dg:"CEO's message", drop_comite:"Executive committee",
      drop_secteurs:"Strategic sectors", filiales_eyebrow:"Subsidiaries & vehicles",
      footprint_eyebrow:"National footprint", hero_cta2:"Submit a project", pub_eyebrow:"Publications"
    }
  };
  function setNavLang(lang){
    var d = NAV_I18N[lang]; if(!d) return;
    document.querySelectorAll('nav [data-i18n]').forEach(function(el){
      var k = el.getAttribute('data-i18n');
      if(d[k]!=null) el.textContent = d[k];
    });
    document.querySelectorAll('.lang-toggle button').forEach(function(b){
      b.classList.toggle('active', b.getAttribute('data-lang')===lang);
    });
    document.documentElement.setAttribute('lang', lang);
  }
  if(document.body.hasAttribute('data-nav-i18n-only')){
    document.querySelectorAll('.lang-toggle button').forEach(function(b){
      b.addEventListener('click', function(){ setNavLang(b.getAttribute('data-lang')); });
    });
    setNavLang('fr');
  }

  // ---- Lightbox ----
  var lb = document.getElementById('lightbox');
  if(lb){
    var lbImg = document.getElementById('lightboxImg');
    var lbClose = document.getElementById('lightboxClose');
    function openLightbox(src, alt){
      lbImg.src = src; lbImg.alt = alt || '';
      lb.classList.add('open'); lb.setAttribute('aria-hidden','false');
    }
    function closeLightbox(){ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); }
    document.querySelectorAll('.lightbox-trigger').forEach(function(el){
      el.addEventListener('click', function(){ openLightbox(el.getAttribute('data-full'), el.alt); });
      el.addEventListener('keydown', function(e){ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openLightbox(el.getAttribute('data-full'), el.alt); } });
    });
    lbClose.addEventListener('click', closeLightbox);
    lb.addEventListener('click', function(e){ if(e.target===lb) closeLightbox(); });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeLightbox(); });
  }

  // ---- Nav active state: by page (interior pages) ----
  var page = document.body.getAttribute('data-page');
  if(page){
    document.querySelectorAll('.nav-item > a[data-page="'+page+'"]').forEach(function(a){
      a.parentElement.classList.add('nav-active');
    });
  }

  // ---- Nav active state: by scroll position (in-page sections, homepage) ----
  // Tracks either a plain "#id" href, or a nav item whose real destination is
  // another page but that still has a matching teaser section on this page
  // (marked with data-section="id", since its href isn't a "#..." anchor).
  var navByHash = {};
  document.querySelectorAll('.nav-item > a').forEach(function(a){
    var href = a.getAttribute('href');
    var section = a.getAttribute('data-section');
    if(section) navByHash['#' + section] = a;
    else if(href && href.charAt(0)==='#') navByHash[href] = a;
  });
  var sections = Object.keys(navByHash).map(function(h){ return document.querySelector(h); }).filter(Boolean);
  if('IntersectionObserver' in window && sections.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          var href = '#' + e.target.id;
          Object.keys(navByHash).forEach(function(h){ navByHash[h].parentElement.classList.toggle('nav-active', h===href); });
        }
      });
    }, {rootMargin:'-45% 0px -50% 0px'});
    sections.forEach(function(s){ io.observe(s); });
  }

  // ---- Count-up animation for key figures (homepage only) ----
  var facts = document.querySelectorAll('.fact .num');
  if(facts.length){
    var targets = [2012, 4, 5, 1];
    var done = false;
    function animateFacts(){
      if(done) return; done = true;
      facts.forEach(function(el, i){
        var target = targets[i]; if(target==null) return;
        var pad = el.textContent.trim().length;
        var start = performance.now();
        var dur = 700 + i*80;
        function tick(now){
          var p = Math.min(1, (now-start)/dur);
          var eased = 1 - Math.pow(1-p, 3);
          var val = Math.round(target * eased);
          el.textContent = String(val).padStart(pad, '0');
          if(p<1) requestAnimationFrame(tick); else el.textContent = String(target).padStart(pad, '0');
        }
        requestAnimationFrame(tick);
      });
    }
    var factsSection = document.querySelector('.facts');
    if(factsSection && 'IntersectionObserver' in window){
      var fio = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if(e.isIntersecting) animateFacts(); });
      }, {threshold:.4});
      fio.observe(factsSection);
    }
  }

  // ---- News filter chips (actualites.html) ----
  var filterRow = document.getElementById('filterRow');
  if(filterRow){
    var chips = filterRow.querySelectorAll('.filter-chip');
    var cards = document.querySelectorAll('#newsGrid .news-card');
    chips.forEach(function(chip){
      chip.addEventListener('click', function(){
        chips.forEach(function(c){ c.classList.remove('active'); });
        chip.classList.add('active');
        var f = chip.getAttribute('data-filter');
        cards.forEach(function(card){
          card.hidden = !(f==='all' || card.getAttribute('data-cat')===f);
        });
      });
    });
  }

  // ---- Site search (replaces the nav CTA button) ----
  var searchToggle = document.getElementById('searchToggle');
  if(searchToggle){
    var searchPanel = document.getElementById('searchPanel');
    var searchInput = document.getElementById('searchInput');
    var searchResults = document.getElementById('searchResults');
    var isHome = !document.body.getAttribute('data-page') && !document.body.hasAttribute('data-nav-i18n-only');
    var prefix = isHome ? '' : 'index.html';

    var INDEX = [
      {t:'Accueil', c:'Page', u:'index.html'},
      {t:'Mission', c:'Page', u:'mission.html'},
      {t:'Mot du Directeur Général', c:'Page', u:'mot-du-directeur.html'},
      {t:'Actualités', c:'Page', u:'actualites.html'},
      {t:'Contact', c:'Page', u:'contact.html'},
      {t:'Eau & Énergie', c:'Secteur', u:prefix+'#secteurs'},
      {t:'Agrobusiness', c:'Secteur', u:prefix+'#secteurs'},
      {t:'Santé & Pharma', c:'Secteur', u:prefix+'#secteurs'},
      {t:'Infrastructures & Transports', c:'Secteur', u:prefix+'#secteurs'},
      {t:'We Fund', c:'Filiale', u:prefix+'#filiales'},
      {t:'Kajom Capital', c:'Filiale', u:prefix+'#filiales'},
      {t:'Polimed', c:'Filiale', u:prefix+'#filiales'},
      {t:'FIR', c:'Filiale', u:prefix+'#filiales'},
      {t:'Oyass Capital', c:'Filiale', u:prefix+'#filiales'},
      {t:'Aïssatou Ndiaye — Directrice des Investissements', c:'Comité', u:'mission.html#comite'},
      {t:'Moussa Diallo — Secrétaire Général', c:'Comité', u:'mission.html#comite'},
      {t:'Fatou Sarr — Directrice Financière', c:'Comité', u:'mission.html#comite'},
      {t:'Cheikh Fall — Directeur Juridique', c:'Comité', u:'mission.html#comite'},
      {t:'Babacar Gning — Directeur Général', c:'Gouvernance', u:'mot-du-directeur.html'},
      {t:'Dakar', c:'Empreinte', u:prefix+'#empreinte'},
      {t:'Bassin arachidier', c:'Empreinte', u:prefix+'#empreinte'},
      {t:'Vallée du fleuve Sénégal', c:'Empreinte', u:prefix+'#empreinte'},
      {t:'Projet Grand Transfert d’Eau (GTE)', c:'Actualité', u:'article.html'},
      {t:'Gamou Kaolack 2026', c:'Actualité', u:'actualites.html'},
      {t:'Gamou Tivaouane 2026', c:'Actualité', u:'actualites.html'},
      {t:'Concours Général 2026', c:'Actualité', u:'actualites.html'},
      {t:'Rapport annuel', c:'Publication', u:prefix+'#publications'},
      {t:'Lettre de l’investisseur', c:'Publication', u:prefix+'#publications'},
      {t:'Politique ESG', c:'Publication', u:prefix+'#publications'},
      {t:'Appels d’offres', c:'Opportunité', u:prefix+'#collaborer'},
      {t:'Soumission de projet', c:'Opportunité', u:prefix+'#collaborer'},
      {t:'Carrières', c:'Opportunité', u:prefix+'#collaborer'}
    ];

    function renderResults(query){
      searchResults.innerHTML = '';
      var q = query.trim().toLowerCase();
      if(!q){
        var hint = document.createElement('div');
        hint.className = 'search-hint';
        hint.textContent = 'Secteurs, filiales, actualités, comité de direction…';
        searchResults.appendChild(hint);
        return;
      }
      var matches = INDEX.filter(function(item){ return item.t.toLowerCase().indexOf(q) !== -1; }).slice(0, 7);
      if(!matches.length){
        var empty = document.createElement('div');
        empty.className = 'search-empty';
        empty.textContent = 'Aucun résultat pour « ' + query.trim() + ' ».';
        searchResults.appendChild(empty);
        return;
      }
      matches.forEach(function(item, i){
        var a = document.createElement('a');
        a.className = 'search-result' + (i===0 ? ' hi' : '');
        a.href = item.u;
        a.innerHTML = '<span class="search-result-title"></span><span class="search-result-cat"></span>';
        a.querySelector('.search-result-title').textContent = item.t;
        a.querySelector('.search-result-cat').textContent = item.c;
        searchResults.appendChild(a);
      });
    }

    function openSearch(){
      searchPanel.classList.add('open');
      searchToggle.classList.add('active');
      searchToggle.setAttribute('aria-expanded','true');
      renderResults('');
      setTimeout(function(){ searchInput.focus(); }, 50);
    }
    function closeSearch(){
      searchPanel.classList.remove('open');
      searchToggle.classList.remove('active');
      searchToggle.setAttribute('aria-expanded','false');
      searchInput.value = '';
    }
    searchToggle.addEventListener('click', function(){
      searchPanel.classList.contains('open') ? closeSearch() : openSearch();
    });
    searchInput.addEventListener('input', function(){ renderResults(searchInput.value); });
    searchInput.addEventListener('keydown', function(e){
      if(e.key === 'Enter'){
        var first = searchResults.querySelector('.search-result');
        if(first) window.location.href = first.getAttribute('href');
      }
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeSearch();
      if((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)){
        e.preventDefault();
        searchPanel.classList.contains('open') ? closeSearch() : openSearch();
      }
    });
    document.addEventListener('click', function(e){
      if(!searchPanel.contains(e.target) && e.target !== searchToggle && !searchToggle.contains(e.target)){
        closeSearch();
      }
    });
  }

  // ---- Contact form: front-end only mockup ----
  var form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var note = document.getElementById('formNote');
      if(note) note.textContent = 'Maquette — aucun message n’est réellement envoyé pour le moment.';
    });
  }
})();
