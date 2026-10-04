// Nails Galore - Visual Application & Lightbox Controller (Nagpur)

document.addEventListener('DOMContentLoaded', () => {
  // 1. Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Photo gallery filtering
  initPhotoFilters();

  // 3. Image Lightbox
  initLightbox();

  // 4. Booking Modal
  initBookingSystem();

  // 5. Mobile Nav
  initMobileNav();
});

// Photo Category Filtering
function initPhotoFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const photoCards = document.querySelectorAll('.photo-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');

      filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-stone-900', 'text-white');
        b.classList.add('bg-stone-200/70', 'text-stone-700', 'hover:bg-stone-300');
      });

      btn.classList.add('active', 'bg-stone-900', 'text-white');
      btn.classList.remove('bg-stone-200/70', 'text-stone-700', 'hover:bg-stone-300');

      photoCards.forEach(card => {
        const itemCategories = card.getAttribute('data-category') || '';
        if (category === 'all' || itemCategories.includes(category)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// Lightbox Modal for High-Res Inspection
function initLightbox() {
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxMeta = document.getElementById('lightbox-meta');
  const lightboxPrice = document.getElementById('lightbox-price');
  const lightboxBookBtn = document.getElementById('lightbox-book-btn');
  const closeBtn = document.getElementById('close-lightbox');
  const photoCards = document.querySelectorAll('.photo-card');

  photoCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If user clicked the recreate/book button inside card, don't open lightbox
      if (e.target.closest('.card-book-trigger')) return;

      const img = card.querySelector('img');
      const title = card.getAttribute('data-title') || 'Signature Set';
      const meta = card.getAttribute('data-meta') || 'Custom Artistry';
      const price = card.getAttribute('data-price') || '₹1,799';

      if (lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxMeta) lightboxMeta.textContent = meta;
        if (lightboxPrice) lightboxPrice.textContent = price;

        if (lightboxBookBtn) {
          lightboxBookBtn.onclick = () => {
            closeLightboxModal();
            window.openBookingDrawer(title);
          };
        }

        lightbox.classList.remove('lightbox-hidden');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightboxModal() {
    if (lightbox) {
      lightbox.classList.add('lightbox-hidden');
      document.body.style.overflow = '';
    }
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightboxModal);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightboxModal();
      }
    });
  }
}

// Booking Drawer
let selectedShape = 'Almond';

function initBookingSystem() {
  const modal = document.getElementById('booking-drawer');
  const closeBtn = document.getElementById('close-booking-drawer');
  const form = document.getElementById('booking-form');
  const styleSelect = document.getElementById('booking-style-select');
  const dateInput = document.getElementById('booking-date-input');

  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  window.openBookingDrawer = function(styleName = null) {
    if (modal) {
      modal.classList.remove('lightbox-hidden');
      document.body.style.overflow = 'hidden';
      if (styleName && styleSelect) {
        // Find matching option or set value
        let found = false;
        for (let i = 0; i < styleSelect.options.length; i++) {
          if (styleSelect.options[i].value.toLowerCase().includes(styleName.toLowerCase()) || 
              styleName.toLowerCase().includes(styleSelect.options[i].value.toLowerCase())) {
            styleSelect.selectedIndex = i;
            found = true;
            break;
          }
        }
        if (!found) {
          const opt = document.createElement('option');
          opt.value = styleName;
          opt.textContent = styleName;
          opt.selected = true;
          styleSelect.appendChild(opt);
        }
      }
    }
  };

  window.closeBookingDrawer = function() {
    if (modal) {
      modal.classList.add('lightbox-hidden');
      document.body.style.overflow = '';
    }
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', window.closeBookingDrawer);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        window.closeBookingDrawer();
      }
    });
  }

  // Nail Shape Selector
  const shapePills = document.querySelectorAll('.shape-pill');
  shapePills.forEach(pill => {
    pill.addEventListener('click', () => {
      shapePills.forEach(p => {
        p.classList.remove('border-stone-900', 'bg-stone-900', 'text-white');
        p.classList.add('border-stone-300', 'bg-white', 'text-stone-700');
      });
      pill.classList.add('border-stone-900', 'bg-stone-900', 'text-white');
      pill.classList.remove('border-stone-300', 'bg-white', 'text-stone-700');
      selectedShape = pill.getAttribute('data-shape');
    });
  });

  // Form Submit -> WhatsApp Link to Nails Galore (917972622695)
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('client-name').value.trim();
      const phone = document.getElementById('client-phone').value.trim();
      const style = styleSelect ? styleSelect.value : 'Custom Nail Service';
      const date = dateInput ? dateInput.value : 'Today';
      const time = document.getElementById('booking-time').value;

      const message = `*✨ Booking Request - Nails Galore (Sitabuldi, Nagpur)*
━━━━━━━━━━━━━━━━━━
👤 *Client:* ${name}
📞 *Phone:* ${phone}
💅 *Style / Service:* ${style}
📏 *Shape:* ${selectedShape}
📅 *Date:* ${date}
⏰ *Time:* ${time}
━━━━━━━━━━━━━━━━━━
_Inquired via Nails Galore Official Visual Portal_`;

      const encoded = encodeURIComponent(message);
      const studioWhatsApp = '917972622695'; // Nails Galore Nagpur Phone/WhatsApp
      const waUrl = `https://wa.me/${studioWhatsApp}?text=${encoded}`;

      // Show summary inside drawer
      const formBox = document.getElementById('drawer-form-box');
      const confirmBox = document.getElementById('drawer-confirm-box');

      if (formBox && confirmBox) {
        formBox.classList.add('hidden');
        confirmBox.classList.remove('hidden');

        const summaryBox = document.getElementById('drawer-summary-content');
        if (summaryBox) {
          summaryBox.innerHTML = `
            <div class="bg-stone-100 p-4 rounded-xl text-left text-xs space-y-1.5 border border-stone-200">
              <p><strong>Service:</strong> ${style}</p>
              <p><strong>Shape:</strong> ${selectedShape}</p>
              <p><strong>Slot:</strong> ${date} at ${time}</p>
              <p><strong>Client:</strong> ${name} (${phone})</p>
            </div>
          `;
        }

        const dispatchLink = document.getElementById('btn-confirm-wa');
        if (dispatchLink) {
          dispatchLink.href = waUrl;
        }

        window.open(waUrl, '_blank');
      }
    });
  }

  window.resetBookingDrawer = function() {
    const formBox = document.getElementById('drawer-form-box');
    const confirmBox = document.getElementById('drawer-confirm-box');
    if (formBox && confirmBox) {
      formBox.classList.remove('hidden');
      confirmBox.classList.add('hidden');
    }
  };
}

// Mobile Nav
function initMobileNav() {
  const btn = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const links = document.querySelectorAll('.mobile-link');

  if (btn && drawer) {
    btn.addEventListener('click', () => {
      drawer.classList.toggle('hidden');
    });

    links.forEach(l => {
      l.addEventListener('click', () => {
        drawer.classList.add('hidden');
      });
    });
  }
}
