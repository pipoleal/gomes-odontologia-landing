/* ============================================================
   GOMES ODONTOLOGIA & ESTÉTICA — treatments.js
   Bloco "Tratamentos em destaque" (4 cards, topo da página).

   ⚠️ TODO: esta lista ainda está sendo confirmada com a Dra. Alanis.
   Estruturada como array para ser fácil de editar/reordenar/trocar
   sem mexer no HTML — só editar o array TREATMENTS abaixo.
   ============================================================ */

(function () {
  'use strict';

  // Ícone único (dente, estilo outline) reaproveitado nos 4 cards —
  // ecoa o motivo do dente na logo oficial da clínica.
  const TOOTH_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M12 3c-2 0-3 1-4.5 1S5 3 3.8 4.2C2.6 5.4 2.5 8 3.5 11c.7 2.2 1.3 3.5 1.8 6 .3 1.6.6 3.5 1.7 3.5 1.3 0 1.3-2.4 1.7-4 .3-1.2.7-2 1.3-2s1 .8 1.3 2c.4 1.6.4 4 1.7 4 1.1 0 1.4-1.9 1.7-3.5.5-2.5 1.1-3.8 1.8-6 1-3 .9-5.6-.3-6.8C15 3 14 3 12 3z"/></svg>';

  const TREATMENTS = [
    {
      title: 'Implante Dental',
      description: 'Reposição de dentes perdidos com implantes, devolvendo função e naturalidade ao sorriso.',
    },
    {
      title: 'Ortodontia',
      description: 'Alinhamento dos dentes com técnicas modernas, para uma mordida funcional e harmônica.',
    },
    {
      title: 'Prótese',
      description: 'Reabilitação protética personalizada, restaurando estética e função mastigatória.',
    },
    {
      title: 'Clareamento Dental',
      description: 'Procedimento estético para um sorriso mais claro e equilibrado, com resultado natural.',
    },
  ];

  function render() {
    const container = document.getElementById('treatmentsHighlightGrid');
    if (!container) return;

    container.innerHTML = TREATMENTS.map((t) => `
      <article class="treatment-card reveal-up" data-reveal data-tilt>
        <div class="treatment-card__icon">${TOOTH_ICON}</div>
        <h3>${t.title}</h3>
        <p>${t.description}</p>
      </article>
    `).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
