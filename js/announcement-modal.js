/* ============================================================
   GOMES ODONTOLOGIA & ESTÉTICA — js/announcement-modal.js
   Componente compartilhado do card de anúncio: usado tanto pelo
   site (js/site-content.js) quanto pela prévia ao vivo do painel
   (admin.html), pra garantir que os dois mostrem exatamente o
   mesmo HTML/CSS. Sem dependências, sem efeitos colaterais —
   só funções puras de leitura/montagem de markup.
   ============================================================ */

(function (global) {
  'use strict';

  // Mesmo número já usado em js/main.js (CONFIG.whatsappNumber) — repetido
  // aqui porque site e painel rodam em páginas diferentes, sem escopo comum.
  var WHATSAPP_NUMBER = '5512996119641';
  var DEFAULT_WHATSAPP_MESSAGE = 'Olá! Vi o aviso no site e gostaria de mais informações.';

  function escapeHtml(str) {
    var div = (global.document || null) && document.createElement('div');
    if (!div) return String(str == null ? '' : str);
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return String(str == null ? '' : str).replace(/"/g, '&quot;');
  }

  function isValidHttpsUrl(url) {
    return typeof url === 'string' && /^https:\/\/[^\s]+$/i.test(url.trim());
  }

  // startDate/endDate são datas locais (campo <input type="date"> do painel).
  // endDate é inclusivo até o fim do dia (23:59:59), não até a meia-noite.
  function withinDateRange(ann, now) {
    if (ann.startDate) {
      var start = new Date(ann.startDate + 'T00:00:00');
      if (!isNaN(start.getTime()) && now < start) return false;
    }
    if (ann.endDate) {
      var end = new Date(ann.endDate + 'T23:59:59');
      if (!isNaN(end.getTime()) && now > end) return false;
    }
    return true;
  }

  function pickActive(announcements, now) {
    now = now || new Date();
    var candidates = (announcements || []).filter(function (a) {
      return a && a.active && withinDateRange(a, now);
    });
    if (!candidates.length) return null;
    return candidates.reduce(function (best, a) {
      var aPriority = typeof a.priority === 'number' ? a.priority : 0;
      var bestPriority = best ? (typeof best.priority === 'number' ? best.priority : 0) : -Infinity;
      return aPriority > bestPriority ? a : best;
    }, null);
  }

  function buildWhatsAppHref(message) {
    var text = message && String(message).trim() ? message : DEFAULT_WHATSAPP_MESSAGE;
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
  }

  function formatValidity(endDate) {
    if (!endDate) return '';
    var d = new Date(endDate + 'T00:00:00');
    if (isNaN(d.getTime())) return '';
    try {
      var fmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      return 'Válido até ' + fmt.format(d);
    } catch (e) {
      return '';
    }
  }

  function imageSrc(ann) {
    if (!ann.image) return '';
    var v = ann.imageVersion ? '?v=' + encodeURIComponent(ann.imageVersion) : '';
    return '/' + ann.image.replace(/^\/+/, '') + v;
  }

  // Retorna o HTML de ".announcement-card" pronto pra ser inserido dentro de
  // um ".announcement-overlay". Não faz nenhum wiring de evento — quem chama
  // decide o que fazer com os elementos [data-action="close"].
  function buildCardMarkup(ann) {
    ann = ann || {};
    var hasImage = !!ann.image;
    var hasLink = ann.buttonType === 'whatsapp'
      ? true
      : isValidHttpsUrl(ann.linkUrl);

    var imageHtml = hasImage
      ? '<img class="announcement-card__image" src="' + escapeAttr(imageSrc(ann)) + '" alt="' + escapeAttr(ann.imageAlt || '') + '" loading="eager">'
      : '';

    var badgeHtml = ann.badge
      ? '<span class="announcement-card__badge">' + escapeHtml(ann.badge) + '</span>'
      : '';

    var validityHtml = ann.endDate
      ? '<p class="announcement-card__validity">' + escapeHtml(formatValidity(ann.endDate)) + '</p>'
      : '';

    var buttonHtml = '';
    if (hasLink && ann.buttonText) {
      var href = ann.buttonType === 'whatsapp'
        ? buildWhatsAppHref(ann.whatsappMessage)
        : ann.linkUrl;
      buttonHtml = '<a href="' + escapeAttr(href) + '" class="btn btn--gold announcement-card__link" target="_blank" rel="noopener">' + escapeHtml(ann.buttonText) + '</a>';
    }

    return (
      '<div class="announcement-card' + (hasImage ? ' has-image' : '') + '" role="dialog" aria-modal="true" aria-label="' + escapeAttr(ann.title || 'Aviso') + '" tabindex="-1">' +
        '<button type="button" class="announcement-card__close" data-action="close" aria-label="Fechar aviso">&times;</button>' +
        imageHtml +
        '<div class="announcement-card__body">' +
          badgeHtml +
          (ann.title ? '<h3>' + escapeHtml(ann.title) + '</h3>' : '') +
          (ann.message ? '<p class="announcement-card__message">' + escapeHtml(ann.message) + '</p>' : '') +
          validityHtml +
          buttonHtml +
          '<button type="button" class="announcement-card__secondary" data-action="close">Agora não</button>' +
        '</div>' +
      '</div>'
    );
  }

  // Tolera o schema antigo (um único objeto "announcement") pra não quebrar
  // caso algum cache sirva o JSON velho enquanto o JS novo já está no ar.
  function normalizeAnnouncements(data) {
    if (!data) return [];
    if (Array.isArray(data.announcements)) return data.announcements;
    var legacy = data.announcement;
    if (legacy && typeof legacy === 'object' && (legacy.enabled || legacy.message)) {
      return [{
        id: 'legacy',
        active: !!legacy.enabled,
        badge: '',
        title: legacy.title || '',
        message: legacy.message || '',
        image: legacy.image || '',
        imageAlt: '',
        imageVersion: legacy.imageVersion || 0,
        buttonText: legacy.linkLabel || '',
        buttonType: 'link',
        whatsappMessage: '',
        linkUrl: legacy.linkUrl || '',
        startDate: '',
        endDate: '',
        priority: 0,
        delaySeconds: 3,
        cooldownDays: 3,
      }];
    }
    return [];
  }

  global.GomesAnnouncementModal = {
    WHATSAPP_NUMBER: WHATSAPP_NUMBER,
    escapeHtml: escapeHtml,
    escapeAttr: escapeAttr,
    isValidHttpsUrl: isValidHttpsUrl,
    withinDateRange: withinDateRange,
    pickActive: pickActive,
    buildWhatsAppHref: buildWhatsAppHref,
    formatValidity: formatValidity,
    imageSrc: imageSrc,
    buildCardMarkup: buildCardMarkup,
    normalizeAnnouncements: normalizeAnnouncements,
  };
})(typeof window !== 'undefined' ? window : this);
