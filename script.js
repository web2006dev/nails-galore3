/**
 * NAILS GALORE - NAGPUR LUXURY NAIL STUDIO
 * Interactive Application Logic & Booking Integrations
 */

document.addEventListener('DOMContentLoaded', () => {
  initServiceTabs();
  initCalculator();
  initStarPickers();
  initFaqAccordion();
  initMobileDrawer();
  initBookingDateConstraint();
});

// Studio WhatsApp Number & Links
const STUDIO_PHONE = '07972622695';
const STUDIO_WA_NUMBER = '917972622695';
const GOOGLE_REVIEW_URL = 'https://www.google.com/search?q=nails+galore+nagpur#lrd=0x3bd4c1c37e5586bd:0xac0ab2f3566ea2da,3,,,';

/* ==========================================================================
   1. Service Filter Tabs
   ========================================================================== */
function initServiceTabs() {
  const tabs = document.querySelectorAll('#serviceTabs .tab-btn');
  const cards = document.querySelectorAll('#servicesGrid .service-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');

      cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   2. Interactive Nail Price & Time Calculator
   ========================================================================== */
function initCalculator() {
  const priceDisplay = document.getElementById('calculatedPrice');
  const timeDisplay = document.getElementById('calculatedTime');
  const btnBookCustom = document.getElementById('btnBookCustomSet');

  const baseInputs = document.querySelectorAll('input[name="baseService"]');
  const shapeInputs = document.querySelectorAll('input[name="nailShape"]');
  const artInputs = document.querySelectorAll('input[name="artLevel"]');
  const addonRemoval = document.getElementById('addonRemoval');
  const addonCuticle = document.getElementById('addonCuticle');
  const addonRepair = document.getElementById('addonRepair');

  function updateCalculation() {
    let totalPrice = 0;
    let totalTime = 0;

    // Base Service
    const selectedBase = document.querySelector('input[name="baseService"]:checked');
    if (selectedBase) {
      totalPrice += parseInt(selectedBase.getAttribute('data-price') || '0', 10);
      totalTime += parseInt(selectedBase.getAttribute('data-time') || '0', 10);
    }

    // Shape & Length
    const selectedShape = document.querySelector('input[name="nailShape"]:checked');
    if (selectedShape) {
      totalPrice += parseInt(selectedShape.getAttribute('data-price') || '0', 10);
      totalTime += parseInt(selectedShape.getAttribute('data-time') || '0', 10);
    }

    // Art Level
    const selectedArt = document.querySelector('input[name="artLevel"]:checked');
    if (selectedArt) {
      totalPrice += parseInt(selectedArt.getAttribute('data-price') || '0', 10);
      totalTime += parseInt(selectedArt.getAttribute('data-time') || '0', 10);
    }

    // Addons
    if (addonRemoval && addonRemoval.checked) {
      totalPrice += parseInt(addonRemoval.getAttribute('data-price') || '0', 10);
      totalTime += parseInt(addonRemoval.getAttribute('data-time') || '0', 10);
    }
    if (addonCuticle && addonCuticle.checked) {
      totalPrice += parseInt(addonCuticle.getAttribute('data-price') || '0', 10);
      totalTime += parseInt(addonCuticle.getAttribute('data-time') || '0', 10);
    }
    if (addonRepair && addonRepair.checked) {
      totalPrice += parseInt(addonRepair.getAttribute('data-price') || '0', 10);
      totalTime += parseInt(addonRepair.getAttribute('data-time') || '0', 10);
    }

    if (priceDisplay) priceDisplay.textContent = totalPrice.toLocaleString('en-IN');
    if (timeDisplay) timeDisplay.textContent = totalTime;
  }

  // Bind change listeners
  [...baseInputs, ...shapeInputs, ...artInputs, addonRemoval, addonCuticle, addonRepair].forEach(input => {
    if (input) {
      input.addEventListener('change', updateCalculation);
    }
  });

  // Calculate initial
  updateCalculation();

  // Book Custom Set WhatsApp CTA
  if (btnBookCustom) {
    btnBookCustom.addEventListener('click', () => {
      const selectedBase = document.querySelector('input[name="baseService"]:checked')?.parentElement.textContent.trim();
      const selectedShape = document.querySelector('input[name="nailShape"]:checked')?.parentElement.textContent.trim();
      const selectedArt = document.querySelector('input[name="artLevel"]:checked')?.parentElement.textContent.trim();

      const addons = [];
      if (addonRemoval && addonRemoval.checked) addons.push('Old Set Removal');
      if (addonCuticle && addonCuticle.checked) addons.push('Cuticle Spa');
      if (addonRepair && addonRepair.checked) addons.push('Nail Repair');

      const price = priceDisplay.textContent;
      const time = timeDisplay.textContent;

      const message = `Hello Nails Galore! 💅\n\nI customized my dream nail set on your website:\n• Base Service: ${selectedBase}\n• Shape & Length: ${selectedShape}\n• Art & Finish: ${selectedArt}\n• Add-ons: ${addons.length ? addons.join(', ') : 'None'}\n• Estimated Cost: ₹${price}\n• Estimated Duration: ~${time} mins\n\nI would like to book a slot at your Sitabuldi studio. Please let me know your available timings!`;

      const waUrl = `https://wa.me/${STUDIO_WA_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
      showToast('Opening WhatsApp with your customized set details! ✨');
    });
  }
}

/* ==========================================================================
   3. Star Picker & Google Review Flow
   ========================================================================== */
function initStarPickers() {
  const pickers = [
    { container: document.getElementById('starPicker'), redirectBtn: document.getElementById('btnGoogleReviewRedirect') },
    { container: document.getElementById('modalStarPicker'), feedback: document.getElementById('reviewFeedback') }
  ];

  pickers.forEach(({ container, redirectBtn, feedback }) => {
    if (!container) return;
    const stars = container.querySelectorAll('span');

    stars.forEach(star => {
      star.addEventListener('mouseover', () => {
        const rating = parseInt(star.getAttribute('data-star'), 10);
        stars.forEach(s => {
          const r = parseInt(s.getAttribute('data-star'), 10);
          s.classList.toggle('hovered', r <= rating);
        });
      });

      star.addEventListener('mouseout', () => {
        stars.forEach(s => s.classList.remove('hovered'));
      });

      star.addEventListener('click', () => {
        const rating = parseInt(star.getAttribute('data-star'), 10);
        stars.forEach(s => {
          const r = parseInt(s.getAttribute('data-star'), 10);
          s.classList.toggle('active', r <= rating);
        });

        if (feedback) {
          if (rating === 5) {
            feedback.textContent = '"Thank you! We appreciate your 5-star love! 💖"';
          } else {
            feedback.textContent = `"Thank you for your rating of ${rating} stars! We'd love your feedback on Google."`;
          }
        }
      });
    });
  });
}

/* ==========================================================================
   4. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // close other items
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   5. Mobile Drawer
   ========================================================================== */
function initMobileDrawer() {
  const toggle = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const closeBtn = document.getElementById('mobileDrawerClose');

  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      drawer.classList.add('open');
    });
  }

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  }
}

function closeMobileDrawer() {
  const drawer = document.getElementById('mobileDrawer');
  if (drawer) drawer.classList.remove('open');
}

/* ==========================================================================
   6. Booking Date Minimum
   ========================================================================== */
function initBookingDateConstraint() {
  const dateInput = document.getElementById('bookDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }
}

/* ==========================================================================
   7. Modals (Booking & Google Review)
   ========================================================================== */
function openBookingModal(preselectedService) {
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (preselectedService) {
      const serviceSelect = document.getElementById('bookService');
      if (serviceSelect) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value.toLowerCase().includes(preselectedService.toLowerCase()) || 
              preselectedService.toLowerCase().includes(serviceSelect.options[i].value.toLowerCase())) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }
    }
  }
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
  }
}

function selectServiceForBooking(serviceName) {
  openBookingModal(serviceName);
}

function openReviewModal() {
  const modal = document.getElementById('reviewModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeReviewModal() {
  const modal = document.getElementById('reviewModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
  }
}

// Close modals on outside click or ESC key
window.addEventListener('click', (e) => {
  const bookingModal = document.getElementById('bookingModal');
  const reviewModal = document.getElementById('reviewModal');
  if (e.target === bookingModal) closeBookingModal();
  if (e.target === reviewModal) closeReviewModal();
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeBookingModal();
    closeReviewModal();
    closeMobileDrawer();
  }
});

/* ==========================================================================
   8. Booking Form Submit via WhatsApp
   ========================================================================== */
function handleBookingSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('bookName').value.trim();
  const phone = document.getElementById('bookPhone').value.trim();
  const service = document.getElementById('bookService').value;
  const shape = document.getElementById('bookShape').value;
  const date = document.getElementById('bookDate').value;
  const time = document.getElementById('bookTime').value;
  const notes = document.getElementById('bookNotes').value.trim();

  const waMessage = `✨ *New Appointment Request - Nails Galore (Sitabuldi)* ✨\n\n` +
    `👤 *Client Name:* ${name}\n` +
    `📞 *Phone:* ${phone}\n` +
    `💅 *Service:* ${service}\n` +
    `📐 *Preferred Shape:* ${shape}\n` +
    `📅 *Preferred Date:* ${date}\n` +
    `⏰ *Preferred Time:* ${time}\n` +
    (notes ? `📝 *Notes/Reference:* ${notes}\n` : '') +
    `\nLooking forward to confirming my appointment!`;

  const waUrl = `https://wa.me/${STUDIO_WA_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  closeBookingModal();
  showToast('Booking request prepared! Opening WhatsApp to send details... 💅');

  setTimeout(() => {
    window.open(waUrl, '_blank');
  }, 600);
}

/* ==========================================================================
   9. Toast Notifications
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-sparkles text-gold"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
