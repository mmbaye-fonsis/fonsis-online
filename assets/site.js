(function(){
  // ---- Nav-only FR/EN toggle (shared across all pages) ----
  var NAV_I18N = {
    fr: {
      nav_qui:"Qui sommes-nous", nav_engagements:"Nos engagements", nav_invest:"Nos investissements",
      nav_opportunites:"Opportunités", nav_media:"Média",
      nav_gouv:"Gouvernance", nav_actu:"Actualités", nav_carrieres:"Carrières", nav_contact:"Contact",
      nav_cta:"Soumettre un projet",
      drop_presentation:"Présentation", drop_dg:"Mot du DG", drop_comite:"Notre équipe",
      drop_histoire:"Notre histoire", drop_politiques:"Politiques et chartes",
      drop_rapports:"Rapports Annuels",
      drop_secteurs:"Secteurs stratégiques", filiales_eyebrow:"Filiales & véhicules",
      drop_portefeuille:"Portefeuille", drop_esg:"Politique ESG",
      hero_cta2:"Soumission de projet",
      drop_appelsoffres:"Appels d'offres", drop_appelsprojet:"Appels à projet",
      drop_appelspartenariat:"Appels à partenariat",
      drop_lettre:"La lettre de l'Investisseur", drop_documentations:"Documentations", drop_faq:"FAQ"
    },
    en: {
      nav_qui:"About us", nav_engagements:"Our commitments", nav_invest:"Our investments",
      nav_opportunites:"Opportunities", nav_media:"Media",
      nav_gouv:"Governance", nav_actu:"News", nav_carrieres:"Careers", nav_contact:"Contact",
      nav_cta:"Submit a project",
      drop_presentation:"Overview", drop_dg:"CEO's message", drop_comite:"Our team",
      drop_histoire:"Our history", drop_politiques:"Policies and charters",
      drop_rapports:"Annual Reports",
      drop_secteurs:"Strategic sectors", filiales_eyebrow:"Subsidiaries & vehicles",
      drop_portefeuille:"Portfolio", drop_esg:"ESG Policy",
      hero_cta2:"Submit a project",
      drop_appelsoffres:"Tenders", drop_appelsprojet:"Calls for projects",
      drop_appelspartenariat:"Partnership calls",
      drop_lettre:"Investor Letter", drop_documentations:"Documentation", drop_faq:"FAQ"
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

  // ---- Site search (full-screen overlay) ----
  var searchToggle = document.getElementById('searchToggle');
  if(searchToggle){
    var searchPanel = document.getElementById('searchPanel');
    var searchInput = document.getElementById('searchInput');
    var searchResults = document.getElementById('searchResults');
    var searchClose = document.getElementById('searchClose');
    var searchQuickLinks = document.getElementById('searchQuickLinks');
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
      {t:'Siège du FONSIS — Dakar', c:'Empreinte', u:prefix+'#empreinte'},
      {t:'Centre d’imagerie médicale Polimed — Thiès', c:'Empreinte', u:prefix+'#empreinte'},
      {t:'Centrale solaire de Kaël — Diourbel', c:'Empreinte', u:prefix+'#empreinte'},
      {t:'Ferme SOPEL — Louga', c:'Empreinte', u:prefix+'#empreinte'},
      {t:'Centrale solaire de Kahone — Kaolack', c:'Empreinte', u:prefix+'#empreinte'},
      {t:'DB Foods — Saint-Louis', c:'Empreinte', u:prefix+'#empreinte'},
      {t:'AGRIBETA — Ziguinchor, Kolda, Sédhiou, Kédougou, Tambacounda', c:'Empreinte', u:prefix+'#empreinte'},
      {t:'Projet Grand Transfert d’Eau (GTE)', c:'Actualité', u:'article.html'},
      {t:'Gamou Kaolack 2026', c:'Actualité', u:'actualites.html'},
      {t:'Gamou Tivaouane 2026', c:'Actualité', u:'actualites.html'},
      {t:'Concours Général 2026', c:'Actualité', u:'actualites.html'},
      {t:'Appels d’offres', c:'Opportunité', u:prefix+'#collaborer'},
      {t:'Soumission de projet', c:'Opportunité', u:prefix+'#collaborer'},
      {t:'Carrières', c:'Opportunité', u:prefix+'#collaborer'}
    ];

    function renderResults(query){
      searchResults.innerHTML = '';
      var q = query.trim().toLowerCase();
      if(searchQuickLinks) searchQuickLinks.hidden = !!q;
      if(!q) return;
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
        a.className = 'search-result';
        a.style.setProperty('--i', i);
        a.href = item.u;
        a.innerHTML = '<span class="search-result-title"></span><span class="search-result-cat"></span><svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8"/></svg>';
        a.querySelector('.search-result-title').textContent = item.t;
        a.querySelector('.search-result-cat').textContent = item.c;
        searchResults.appendChild(a);
      });
    }

    function openSearch(){
      searchPanel.classList.add('open');
      searchToggle.classList.add('active');
      searchToggle.setAttribute('aria-expanded','true');
      document.body.style.overflow = 'hidden';
      renderResults('');
      setTimeout(function(){ searchInput.focus(); }, 60);
    }
    function closeSearch(){
      searchPanel.classList.remove('open');
      searchToggle.classList.remove('active');
      searchToggle.setAttribute('aria-expanded','false');
      searchInput.value = '';
      document.body.style.overflow = '';
    }
    searchToggle.addEventListener('click', function(){
      searchPanel.classList.contains('open') ? closeSearch() : openSearch();
    });
    if(searchClose) searchClose.addEventListener('click', closeSearch);
    searchInput.addEventListener('input', function(){ renderResults(searchInput.value); });
    searchInput.addEventListener('keydown', function(e){
      if(e.key === 'Enter'){
        var first = searchResults.querySelector('.search-result');
        if(first) window.location.href = first.getAttribute('href');
      }
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && searchPanel.classList.contains('open')) closeSearch();
      if((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)){
        e.preventDefault();
        searchPanel.classList.contains('open') ? closeSearch() : openSearch();
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

  // ---- Mobile nav (hamburger panel + tap-to-expand dropdowns) ----
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  var navOverlay = document.getElementById('navOverlay');
  if(navToggle && navLinks && navOverlay){
    function openNav(){
      navLinks.classList.add('open');
      navOverlay.classList.add('open');
      navToggle.setAttribute('aria-expanded','true');
      document.body.style.overflow = 'hidden';
    }
    function closeNav(){
      navLinks.classList.remove('open');
      navOverlay.classList.remove('open');
      navToggle.setAttribute('aria-expanded','false');
      document.body.style.overflow = '';
      navLinks.querySelectorAll('.nav-item.mobile-open').forEach(function(item){
        item.classList.remove('mobile-open');
      });
    }
    navToggle.addEventListener('click', function(){
      navLinks.classList.contains('open') ? closeNav() : openNav();
    });
    navOverlay.addEventListener('click', closeNav);
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && navLinks.classList.contains('open')) closeNav();
    });
    window.addEventListener('resize', function(){
      if(window.innerWidth > 860 && navLinks.classList.contains('open')) closeNav();
    });

    // On mobile, tapping a category with a submenu expands it in place
    // instead of navigating (hover isn't available on touch).
    navLinks.querySelectorAll('.nav-item').forEach(function(item){
      var link = item.querySelector(':scope > a');
      var drop = item.querySelector('.nav-drop');
      if(!link || !drop) return;
      link.addEventListener('click', function(e){
        if(window.innerWidth > 860) return;
        e.preventDefault();
        var isOpen = item.classList.contains('mobile-open');
        navLinks.querySelectorAll('.nav-item.mobile-open').forEach(function(other){
          if(other !== item) other.classList.remove('mobile-open');
        });
        item.classList.toggle('mobile-open', !isOpen);
      });
    });
  }

  // ---- Mandate flow: staggered scroll-reveal (icons + connecting line) ----
  var mandateFlow = document.querySelector('.mandate-flow');
  if(mandateFlow){
    var mandateNodes = mandateFlow.querySelectorAll('.mandate-node');
    mandateNodes.forEach(function(node, i){ node.style.setProperty('--i', i); });
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduceMotion || !('IntersectionObserver' in window)){
      mandateFlow.classList.add('in-view');
    } else {
      var mfio = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){ mandateFlow.classList.add('in-view'); mfio.disconnect(); }
        });
      }, {threshold:.25});
      mfio.observe(mandateFlow);
    }
  }

  // ---- Filiale grid: staggered fade/rise-in on scroll ----
  var filialeGrid = document.querySelector('.filiale-grid');
  if(filialeGrid){
    var filialeTiles = filialeGrid.querySelectorAll('.filiale-tile');
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)){
      filialeTiles.forEach(function(t){ t.classList.add('in-view'); });
    } else {
      var fgio = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){ e.target.classList.add('in-view'); fgio.unobserve(e.target); }
        });
      }, {threshold:.2});
      filialeTiles.forEach(function(t, i){ t.style.transitionDelay = (i*70)+'ms'; fgio.observe(t); });
    }
  }

  // ---- Timeline: horizontal scroll rail with arrows + autoplay ----
  var timelineRail = document.getElementById('timelineRail');
  if(timelineRail){
    var timelinePrev = document.getElementById('timelinePrev');
    var timelineNext = document.getElementById('timelineNext');
    var tlFadeLeft = document.querySelector('.timeline-fade.left');
    var tlFadeRight = document.querySelector('.timeline-fade.right');

    function tlUpdateEdges(){
      var atStart = timelineRail.scrollLeft <= 4;
      var atEnd = timelineRail.scrollLeft >= timelineRail.scrollWidth - timelineRail.clientWidth - 4;
      if(timelinePrev) timelinePrev.disabled = atStart;
      if(timelineNext) timelineNext.disabled = atEnd;
      if(tlFadeLeft) tlFadeLeft.classList.toggle('hidden', atStart);
      if(tlFadeRight) tlFadeRight.classList.toggle('hidden', atEnd);
      return {atStart:atStart, atEnd:atEnd};
    }
    function tlStepWidth(){
      var card = timelineRail.querySelector('.timeline-event');
      return card ? card.getBoundingClientRect().width + 1 : timelineRail.clientWidth*.8;
    }
    function tlScrollBy(dir){ timelineRail.scrollBy({left: dir*tlStepWidth(), behavior:'smooth'}); }

    timelineRail.addEventListener('scroll', tlUpdateEdges, {passive:true});
    window.addEventListener('resize', tlUpdateEdges);
    tlUpdateEdges();

    var tlPauseUntil = 0;
    function tlPauseAutoplay(){ tlPauseUntil = Date.now() + 5000; }
    if(timelinePrev) timelinePrev.addEventListener('click', function(){ tlPauseAutoplay(); tlScrollBy(-1); });
    if(timelineNext) timelineNext.addEventListener('click', function(){ tlPauseAutoplay(); tlScrollBy(1); });
    timelineRail.addEventListener('pointerdown', tlPauseAutoplay);
    timelineRail.addEventListener('touchstart', tlPauseAutoplay, {passive:true});

    var tlHovering = false;
    timelineRail.addEventListener('mouseenter', function(){ tlHovering = true; });
    timelineRail.addEventListener('mouseleave', function(){ tlHovering = false; });

    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      setInterval(function(){
        if(tlHovering || Date.now() < tlPauseUntil) return;
        var edges = tlUpdateEdges();
        if(edges.atEnd) timelineRail.scrollTo({left:0, behavior:'smooth'});
        else tlScrollBy(1);
      }, 4200);
    }
  }

  // ---- Regional footprint map (Leaflet) — real FONSIS investments, homepage only ----
  var rfmMapEl = document.getElementById('rfmMap');
  if(rfmMapEl && window.L && window.FONSIS_REGIONAL_PROJECTS){
    var rfmProjects = window.FONSIS_REGIONAL_PROJECTS;
    var RFM_STATUS_LABEL = {operationnel:'Opérationnel', en_cours:'En cours', etude:"À l'étude"};
    var RFM_FIT_BOUNDS = [[12.1,-17.6],[16.75,-11.35]];
    var RFM_MAX_BOUNDS = [[10.8,-18.6],[17.6,-10.4]];

    var rfmMap = L.map(rfmMapEl, {
      maxBounds: RFM_MAX_BOUNDS, maxBoundsViscosity: .7,
      minZoom: 6.3, maxZoom: 13, scrollWheelZoom: false
    });
    rfmMap.fitBounds(RFM_FIT_BOUNDS, {padding:[12,12]});

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(rfmMap);

    function rfmMarkerIcon(active, isHq){
      var size = isHq ? 22 : (active ? 20 : 15);
      var cls = 'rfm-pin' + (isHq ? ' rfm-pin-hq' : '') + (active ? ' rfm-pin-active' : '');
      return L.divIcon({
        className: 'rfm-pin-wrap',
        html: '<span class="'+cls+'" style="width:'+size+'px;height:'+size+'px"></span>',
        iconSize: [size, size], iconAnchor: [size/2, size/2]
      });
    }

    var rfmMarkers = {};
    var rfmDetail = document.getElementById('rfmDetail');
    var rfmList = document.getElementById('rfmList');

    function rfmProjectById(id){
      var found = null;
      rfmProjects.forEach(function(p){ if(p.id===id) found = p; });
      return found;
    }

    function rfmRenderDetail(p){
      var statusLabel = RFM_STATUS_LABEL[p.status] || RFM_STATUS_LABEL.etude;
      var titleText = p.isHq ? 'Siège du FONSIS' : p.title;
      var photoHtml = p.photo ? '<img class="rfm-detail-photo" src="'+p.photo+'" alt="'+titleText+'">' : '';
      rfmDetail.innerHTML =
        photoHtml +
        '<div class="rfm-detail-body">' +
          '<div class="rfm-detail-region mono">'+p.region+'</div>' +
          '<h3>'+titleText+'</h3>' +
          '<div class="rfm-detail-meta">' +
            '<span>'+p.location+'</span>' +
            '<span class="rfm-status rfm-status-'+p.status+'">'+statusLabel+'</span>' +
          '</div>' +
          '<p>'+p.description+'</p>' +
        '</div>';
    }

    function rfmSelect(id, opts){
      opts = opts || {};
      var p = rfmProjectById(id);
      if(!p) return;
      rfmRenderDetail(p);
      Object.keys(rfmMarkers).forEach(function(k){
        rfmMarkers[k].setIcon(rfmMarkerIcon(k===id, rfmProjectById(k).isHq));
      });
      rfmList.querySelectorAll('.rfm-list-row').forEach(function(row){
        row.classList.toggle('active', row.getAttribute('data-id')===id);
      });
      if(opts.fly !== false) rfmMap.flyTo([p.lat, p.lng], 9.5, {duration:.9});
      if(opts.openPopup) rfmMarkers[id].openPopup();
    }

    rfmProjects.forEach(function(p){
      var titleText = p.isHq ? 'Siège du FONSIS' : p.title;
      var marker = L.marker([p.lat, p.lng], {icon: rfmMarkerIcon(false, p.isHq)}).addTo(rfmMap);
      marker.bindPopup('<strong>'+titleText+'</strong><br>'+p.location);
      marker.on('click', function(){ rfmSelect(p.id, {fly:false}); });
      rfmMarkers[p.id] = marker;

      var row = document.createElement('button');
      row.type = 'button';
      row.className = 'rfm-list-row';
      row.setAttribute('data-id', p.id);
      row.innerHTML =
        '<span class="rfm-list-dot'+(p.isHq ? ' hq' : '')+'" aria-hidden="true"></span>' +
        '<span class="rfm-list-text">' +
          '<span class="rfm-list-title">'+titleText+'</span>' +
          '<span class="rfm-list-region mono">'+p.region+'</span>' +
        '</span>';
      row.addEventListener('click', function(){ rfmSelect(p.id, {openPopup:true}); });
      rfmList.appendChild(row);
    });

    var rfmHq = rfmProjects.filter(function(p){ return p.isHq; })[0];
    rfmSelect(rfmHq ? rfmHq.id : rfmProjects[0].id, {fly:false});
    setTimeout(function(){ rfmMap.invalidateSize(); }, 200);
  }
})();
