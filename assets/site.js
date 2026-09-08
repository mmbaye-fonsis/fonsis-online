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
