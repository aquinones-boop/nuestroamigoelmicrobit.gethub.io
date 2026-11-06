/**
 * Proyecto Micro:bit - Interacciones UX/UI
 */

document.addEventListener('DOMContentLoaded', () => {
  initTiltEffect();
  initButtonRipple();
  initLinkNotification();
});

/**
 * Efecto de inclinación 3D sutil (Tilt) en las tarjetas al mover el mouse
 */
function initTiltEffect() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/**
 * Efecto Ripple (onda) al pulsar los botones
 */
function initButtonRipple() {
  const buttons = document.querySelectorAll('.action-btn, .cta-button');

  buttons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple-wave');

      const oldWave = this.querySelector('.ripple-wave');
      if (oldWave) oldWave.remove();

      this.appendChild(circle);

      setTimeout(() => {
        circle.remove();
      }, 600);
    });
  });

  if (!document.getElementById('ripple-styles')) {
    const style.textContent = `
      .ripple-wave {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
      }
      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Notificación amigable al hacer clic en enlaces de marcador de posición (#)
 */
function initLinkNotification() {
  const links = document.querySelectorAll('a[href="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showToast(`Enlace configurado: "${link.querySelector('.btn-text')?.textContent.trim() || 'Recurso'}"`);
    });
  });
}

/**
 * Sistema Toast para avisos visuales
 */
function showToast(message) {
  let toast = document.getElementById('ui-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'ui-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(10px);
      color: #f8fafc;
      padding: 12px 20px;
      border-radius: 12px;
      border: 1px solid rgba(0, 242, 254, 0.4);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 242, 254, 0.2);
      font-size: 0.85rem;
      font-weight: 500;
      z-index: 9999;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      align-items: center;
      gap: 10px;
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span style="color: var(--accent-cyan);">✦</span>
    <span>${message}</span>
  `;

  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
  }, 2800);
}