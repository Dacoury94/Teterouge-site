/**
 * Tête Rouge — Site vitrine
 * Interactions légères, formulaire waitlist
 */

(function() {
  'use strict';

  // ─────────────────────────────────────────────
  // 1. Smooth scroll pour les ancres
  // ─────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80; // hauteur du header sticky
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ─────────────────────────────────────────────
  // 2. Animation d'apparition des sections
  // ─────────────────────────────────────────────
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section, .card, .feature-row, .pricing-card, .stat').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // ─────────────────────────────────────────────
  // 3. Formulaire waitlist
  // ─────────────────────────────────────────────
  const form = document.getElementById('waitlist-form');
  const success = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = {
        email: form.email.value.trim(),
        profil: form.profil.value,
        probleme: form.probleme.value.trim(),
        prix: form.prix.value,
        date: new Date().toISOString(),
        source: window.location.hostname || 'local',
      };

      // Validation basique
      if (!data.email || !data.email.includes('@')) {
        alert('Merci de saisir un email valide.');
        return;
      }
      if (!data.profil) {
        alert('Merci de préciser ton profil.');
        return;
      }

      // Désactive le bouton
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Envoi...';

      try {
        // ─────────────────────────────────────────
        // Enregistrement local (fallback toujours actif)
        // ─────────────────────────────────────────
        const saved = JSON.parse(localStorage.getItem('teterouge_waitlist') || '[]');
        saved.push(data);
        localStorage.setItem('teterouge_waitlist', JSON.stringify(saved));

        // ─────────────────────────────────────────
        // Envoi vers backend (à activer plus tard)
        // Décommenter et remplacer URL quand backend prêt
        // ─────────────────────────────────────────
        /*
        const response = await fetch('https://api.teterouge.fr/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Erreur serveur');
        */

        // Simule un délai réseau pour la UX
        const response = await fetch("https://formspree.io/f/moejdkjd", { method: "POST", headers: { "Accept": "application/json" }, body: JSON.stringify(data) }); if (!response.ok) throw new Error("Erreur Formspree");

        // Affiche le message de succès
        form.querySelectorAll('.form-row, button').forEach(el => {
          el.style.display = 'none';
        });
        form.querySelector('.form-note').style.display = 'none';
        if (success) {
          success.style.display = 'block';
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } catch (err) {
        console.error('Erreur formulaire :', err);
        alert('Une erreur est survenue. Réessaie dans quelques instants.');
        btn.disabled = false;
        btn.textContent = originalText;
      }
    });
  }

  // ─────────────────────────────────────────────
  // 4. Header : masquer au scroll down, afficher au scroll up
  // ─────────────────────────────────────────────
  let lastScroll = 0;
  const header = document.querySelector('.site-header');

  window.addEventListener('scroll', () => {
    const current = window.pageYOffset;
    if (header) {
      if (current > 300 && current > lastScroll) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
    }
    lastScroll = current;
  }, { passive: true });

  // ─────────────────────────────────────────────
  // 5. Debug : afficher le contenu sauvegardé dans la console
  // ─────────────────────────────────────────────
  console.log(
    '%c🤖 Tête Rouge — Site vitrine chargé',
    'color: #e94560; font-weight: bold; font-size: 14px;'
  );

  const saved = localStorage.getItem('teterouge_waitlist');
  if (saved) {
    const count = JSON.parse(saved).length;
    console.log(
      `%c📥 ${count} inscription(s) en attente (localStorage)`,
      'color: #8888aa; font-size: 12px;'
    );
    console.log('   Pour voir : localStorage.getItem("teterouge_waitlist")');
  }

})();
