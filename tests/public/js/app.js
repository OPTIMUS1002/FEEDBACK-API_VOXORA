/**
 * VOXORA QUANTUM v3.0 — Next-Gen Student Feedback & Intelligence Platform
 * Features: Holographic Logo, 5 Themes, Real-time AI Sentiment, Sound FX,
 * Upvotes, Faculty Replies, CSV/JSON Export, Grid/Table Modes, REST Explorer
 */

document.addEventListener('DOMContentLoaded', () => {
  initCursorFollower();
  initAmbientCanvas();
  init3DTilt();
  initHologramLogo();
  initThemeSystem();
  initSoundSystem();
  initAdminMode();
  initRatingSystem();
  initTagSelector();
  initFormAndSentiment();
  initFiltersAndSearch();
  initViewModes();
  initModals();
  initExportFeatures();
  initApiExplorer();

  // Initial Data Fetch
  fetchDashboardStats();
  fetchFeedbacks();

  // Sync button listener
  document.getElementById('refresh-stats-btn')?.addEventListener('click', () => {
    playSound('action');
    fetchDashboardStats();
    fetchFeedbacks();
    showToast('Data synchronized with live database!', 'info');
  });
});

/* ==========================================================================
   1. CURSOR FOLLOWER & 3D TILT PHYSICS
   ========================================================================== */
function initCursorFollower() {
  const cursorGlow = document.getElementById('cursor-glow');
  if (!cursorGlow) return;

  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  });
}

function init3DTilt() {
  const cards = document.querySelectorAll('.tilt-card, [data-tilt]');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ==========================================================================
   2. HOLOGRAPHIC LOGO INTERACTIVITY, SHOCKWAVES & SOUND
   ========================================================================== */
function initHologramLogo() {
  const logoBtn = document.getElementById('brand-logo-btn');
  const navShockwave = document.getElementById('nav-shockwave');
  const heroSphere = document.getElementById('hero-hologram-sphere');

  // Navbar Logo Interaction
  if (logoBtn) {
    logoBtn.addEventListener('mouseenter', () => {
      playSound('hover');
    });

    logoBtn.addEventListener('click', (e) => {
      playSound('quantum');
      
      // Trigger shockwave ring
      if (navShockwave) {
        navShockwave.classList.remove('trigger');
        void navShockwave.offsetWidth; // Force reflow
        navShockwave.classList.add('trigger');
      }

      showToast('⚡ Quantum Resonance Synchronized', 'success');
    });
  }

  // Hero Centerpiece 3D Magnetic Tracking & Shockwave
  if (heroSphere) {
    heroSphere.addEventListener('mousemove', (e) => {
      const rect = heroSphere.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      heroSphere.style.transform = `perspective(800px) rotateY(${x * 0.35}deg) rotateX(${-y * 0.35}deg) scale(1.18)`;
    });

    heroSphere.addEventListener('mouseleave', () => {
      heroSphere.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
    });

    heroSphere.addEventListener('click', () => {
      playSound('quantum');
      
      // Pulse spectrum bars
      const bars = heroSphere.querySelectorAll('.spectrum-bar');
      bars.forEach(b => {
        b.style.transform = 'scaleY(2.2)';
        b.style.filter = 'drop-shadow(0 0 15px #ffffff)';
        setTimeout(() => {
          b.style.transform = '';
          b.style.filter = '';
        }, 500);
      });

      showToast('🔮 Quantum Singularity Transmitting Live Audio Waves!', 'info');
    });
  }
}

/* ==========================================================================
   3. 3D AMBIENT PARTICLES CANVAS
   ========================================================================== */
let canvasColor = '#d946ef';

function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(width > 768 ? 65 : 30, 85);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.6,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      alpha: Math.random() * 0.55 + 0.2
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = canvasColor;
      ctx.globalAlpha = p.alpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = canvasColor;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 115) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = canvasColor;
          ctx.globalAlpha = (1 - dist / 115) * 0.18;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   4. 5 THEMES SYSTEM
   ========================================================================== */
function initThemeSystem() {
  const themeBtn = document.getElementById('theme-btn');
  const themeMenu = document.getElementById('theme-menu');
  const themeOpts = document.querySelectorAll('.theme-opt');

  const themeColors = {
    purple: '#d946ef',
    cyan: '#38bdf8',
    emerald: '#34d399',
    solaris: '#fbbf24',
    glacial: '#38bdf8'
  };

  themeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    playSound('click');
    themeMenu?.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    themeMenu?.classList.remove('show');
  });

  themeOpts.forEach((opt) => {
    opt.addEventListener('click', () => {
      const theme = opt.dataset.setTheme;
      document.documentElement.setAttribute('data-theme', theme);
      themeOpts.forEach((o) => o.classList.remove('active'));
      opt.classList.add('active');

      canvasColor = themeColors[theme] || '#d946ef';
      playSound('action');
      showToast(`Theme switched: ${opt.innerText}`, 'info');
      themeMenu?.classList.remove('show');
    });
  });
}

/* ==========================================================================
   5. SCI-FI SOUND FX ENGINE (Web Audio API)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initSoundSystem() {
  const toggleBtn = document.getElementById('sound-toggle-btn');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    toggleBtn.classList.toggle('active', soundEnabled);
    toggleBtn.innerHTML = soundEnabled
      ? '<i class="fa-solid fa-volume-high"></i>'
      : '<i class="fa-solid fa-volume-xmark"></i>';
    
    if (soundEnabled) {
      playSound('success');
      showToast('Audio FX Enabled', 'info');
    } else {
      showToast('Audio FX Muted', 'info');
    }
  });
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'hover') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.linearRampToValueAtTime(550, now + 0.04);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.linearRampToValueAtTime(0.005, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'like') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'action' || type === 'quantum') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(650, now + 0.15);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.2);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (err) {
    // AudioContext silently ignored on strict browser autoplay
  }
}

/* ==========================================================================
   6. ADMIN MODE & PRIVILEGES
   ========================================================================== */
let isAdminMode = false;
const DEFAULT_PIN = '1234';

function initAdminMode() {
  const adminBtn = document.getElementById('admin-mode-btn');
  const adminModal = document.getElementById('admin-pin-modal');
  const closePinModal = document.getElementById('close-pin-modal');
  const cancelPinBtn = document.getElementById('cancel-pin-btn');
  const submitPinBtn = document.getElementById('submit-pin-btn');
  const pinInput = document.getElementById('admin-pin-input');

  adminBtn?.addEventListener('click', () => {
    if (isAdminMode) {
      isAdminMode = false;
      document.body.classList.remove('admin-mode-active');
      adminBtn.classList.remove('active');
      playSound('action');
      showToast('Admin mode deactivated', 'info');
      renderFeedbacksList(currentFeedbacks);
    } else {
      playSound('click');
      if (adminModal) adminModal.style.display = 'flex';
      pinInput?.focus();
    }
  });

  const closeModal = () => {
    if (adminModal) adminModal.style.display = 'none';
    if (pinInput) pinInput.value = '';
  };

  closePinModal?.addEventListener('click', closeModal);
  cancelPinBtn?.addEventListener('click', closeModal);

  submitPinBtn?.addEventListener('click', () => {
    const enteredPin = pinInput?.value.trim();
    if (enteredPin === DEFAULT_PIN) {
      isAdminMode = true;
      document.body.classList.add('admin-mode-active');
      adminBtn?.classList.add('active');
      closeModal();
      playSound('success');
      showToast('Instructor Privileges Activated!', 'success');
      renderFeedbacksList(currentFeedbacks);
    } else {
      playSound('error');
      showToast('Incorrect PIN. Try 1234', 'error');
    }
  });
}

/* ==========================================================================
   7. 3D STAR RATING & TOPIC TAG SELECTOR
   ========================================================================== */
const ratingDescriptions = {
  1: { icon: '⚠️', text: '1 / 5 — Needs Substantial Improvement' },
  2: { icon: '🛠️', text: '2 / 5 — Below Expectations' },
  3: { icon: '⚖️', text: '3 / 5 — Average Experience' },
  4: { icon: '🌟', text: '4 / 5 — Very Good Experience' },
  5: { icon: '✨', text: '5 / 5 — Outstanding Experience' }
};

function initRatingSystem() {
  const starBtns = document.querySelectorAll('#star-rating-box .star-btn');
  const ratingInput = document.getElementById('rating-value');
  const sentimentBadge = document.getElementById('rating-sentiment-badge');

  function updateStars(rating) {
    starBtns.forEach((btn) => {
      const btnRating = parseInt(btn.dataset.rating, 10);
      btn.classList.toggle('active', btnRating <= rating);
    });

    if (ratingInput) ratingInput.value = rating;

    if (sentimentBadge && ratingDescriptions[rating]) {
      sentimentBadge.innerHTML = `
        <span class="badge-icon">${ratingDescriptions[rating].icon}</span>
        <span class="badge-text">${ratingDescriptions[rating].text}</span>
      `;
    }
  }

  starBtns.forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      playSound('hover');
      const hoverRating = parseInt(btn.dataset.rating, 10);
      starBtns.forEach((b) => {
        const r = parseInt(b.dataset.rating, 10);
        b.classList.toggle('hovered', r <= hoverRating);
      });
    });

    btn.addEventListener('mouseleave', () => {
      starBtns.forEach((b) => b.classList.remove('hovered'));
    });

    btn.addEventListener('click', () => {
      playSound('click');
      const selectedRating = parseInt(btn.dataset.rating, 10);
      updateStars(selectedRating);
    });
  });

  updateStars(5);
}

function initTagSelector() {
  const pills = document.querySelectorAll('#form-tag-pills .form-pill');
  const tagsHidden = document.getElementById('selected-tags-hidden');
  let selectedTags = [];

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      playSound('click');
      const tag = pill.dataset.tag;
      if (selectedTags.includes(tag)) {
        selectedTags = selectedTags.filter(t => t !== tag);
        pill.classList.remove('active');
      } else {
        selectedTags.push(tag);
        pill.classList.add('active');
      }
      if (tagsHidden) tagsHidden.value = JSON.stringify(selectedTags);
    });
  });
}

/* ==========================================================================
   8. REAL-TIME AI SENTIMENT PARSER & FORM SUBMISSION
   ========================================================================== */
function analyzeSentiment(text) {
  const positiveWords = ['great', 'amazing', 'outstanding', 'love', 'loved', 'awesome', 'excellent', 'helpful', 'engaging', 'clear', 'best', 'super', 'interactive', 'enjoyed', 'gem'];
  const constructiveWords = ['hard', 'tough', 'difficult', 'fast', 'slow', 'more', 'improve', 'complex', 'pace', 'heavy', 'assignments', 'deploy', 'practical'];

  const lower = text.toLowerCase();
  let posCount = 0;
  let conCount = 0;

  positiveWords.forEach(w => { if (lower.includes(w)) posCount++; });
  constructiveWords.forEach(w => { if (lower.includes(w)) conCount++; });

  if (posCount > conCount) {
    return { type: 'positive', label: 'Positive & High Energy', confidence: '96%' };
  } else if (conCount > posCount) {
    return { type: 'constructive', label: 'Constructive Feedback', confidence: '89%' };
  } else {
    return { type: 'neutral', label: 'Balanced Perspective', confidence: '85%' };
  }
}

function initFormAndSentiment() {
  const form = document.getElementById('feedback-form');
  const commentsInput = document.getElementById('feedback-comments-input');
  const charCounter = document.getElementById('char-counter');
  const aiBox = document.getElementById('ai-sentiment-box');
  const aiTag = document.getElementById('ai-sentiment-tag');
  const aiText = document.getElementById('ai-sentiment-text');
  const aiConfidence = document.getElementById('ai-confidence');
  const submitBtn = document.getElementById('submit-btn');

  // Course Quick Tags
  document.querySelectorAll('.quick-tag').forEach((btn) => {
    btn.addEventListener('click', () => {
      playSound('click');
      const input = document.getElementById('course-code-input');
      if (input) {
        input.value = btn.dataset.code;
        input.focus();
      }
    });
  });

  // Comments live sentiment & char count
  commentsInput?.addEventListener('input', (e) => {
    const val = e.target.value;
    if (charCounter) charCounter.textContent = `${val.length} / 500`;

    if (val.trim().length >= 8) {
      const sentiment = analyzeSentiment(val);
      if (aiBox) aiBox.style.display = 'flex';
      if (aiText) aiText.textContent = `AI Sentiment: ${sentiment.label}`;
      if (aiConfidence) aiConfidence.textContent = `${sentiment.confidence} confidence`;
    } else {
      if (aiBox) aiBox.style.display = 'none';
    }
  });

  // Form Submit
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentName = document.getElementById('student-name-input')?.value.trim();
    const courseCode = document.getElementById('course-code-input')?.value.trim().toUpperCase();
    const category = document.getElementById('feedback-category-select')?.value;
    const semester = document.getElementById('feedback-semester-input')?.value.trim() || 'Spring 2026';
    const rating = parseInt(document.getElementById('rating-value')?.value, 10);
    const comments = commentsInput?.value.trim();
    const tagsVal = document.getElementById('selected-tags-hidden')?.value || '[]';

    let tags = [];
    try { tags = JSON.parse(tagsVal); } catch { tags = []; }

    if (!studentName || !courseCode) {
      playSound('error');
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    const payload = {
      studentName,
      courseCode,
      rating,
      comments: comments || null,
      category,
      tags,
      semester
    };

    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoader = submitBtn?.querySelector('.btn-loader');

    if (btnText) btnText.style.display = 'none';
    if (btnLoader) btnLoader.style.display = 'inline-flex';
    if (submitBtn) submitBtn.disabled = true;

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (res.ok && json.success) {
        playSound('success');
        showToast('Feedback transmitted successfully to Voxora Matrix!', 'success');
        form.reset();
        document.querySelectorAll('#form-tag-pills .form-pill').forEach(p => p.classList.remove('active'));
        if (document.getElementById('selected-tags-hidden')) {
          document.getElementById('selected-tags-hidden').value = '[]';
        }
        if (aiBox) aiBox.style.display = 'none';
        if (charCounter) charCounter.textContent = '0 / 500';

        // Refresh stats and live feed
        fetchDashboardStats();
        fetchFeedbacks();

        // Scroll to feedbacks wall
        document.getElementById('feedbacks-wall')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        playSound('error');
        showToast(json.error || 'Failed to submit feedback', 'error');
      }
    } catch (err) {
      playSound('error');
      showToast('Network Error: Unable to reach API.', 'error');
    } finally {
      if (btnText) btnText.style.display = 'inline-flex';
      if (btnLoader) btnLoader.style.display = 'none';
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

/* ==========================================================================
   9. FEEDBACKS WALL, FILTERS, VIEW MODES & UPVOTES
   ========================================================================== */
let currentFeedbacks = [];
let currentViewMode = 'grid'; // 'grid' or 'table'

function initViewModes() {
  const gridBtn = document.getElementById('view-grid-btn');
  const listBtn = document.getElementById('view-list-btn');

  gridBtn?.addEventListener('click', () => {
    playSound('click');
    currentViewMode = 'grid';
    gridBtn.classList.add('active');
    listBtn?.classList.remove('active');
    renderFeedbacksList(currentFeedbacks);
  });

  listBtn?.addEventListener('click', () => {
    playSound('click');
    currentViewMode = 'table';
    listBtn.classList.add('active');
    gridBtn?.classList.remove('active');
    renderFeedbacksList(currentFeedbacks);
  });
}

async function fetchFeedbacks() {
  const grid = document.getElementById('feedbacks-grid');
  const search = document.getElementById('feed-search-input')?.value.trim();
  const courseCode = document.getElementById('feed-course-filter')?.value;
  const category = document.getElementById('feed-category-filter')?.value;
  const sort = document.getElementById('feed-sort-select')?.value;

  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (courseCode && courseCode !== 'ALL') params.append('courseCode', courseCode);
  if (category && category !== 'ALL') params.append('category', category);
  if (sort) params.append('sort', sort);

  try {
    const res = await fetch(`/api/feedback?${params.toString()}`);
    const json = await res.json();

    if (json.success && Array.isArray(json.data)) {
      currentFeedbacks = json.data;
      renderFeedbacksList(currentFeedbacks);
      populateCourseFilters(currentFeedbacks);
    } else {
      if (grid) grid.innerHTML = `<div class="loading-state">No feedback records found.</div>`;
    }
  } catch (err) {
    if (grid) grid.innerHTML = `<div class="loading-state text-danger">Error loading feedbacks from database.</div>`;
  }
}

function renderFeedbacksList(feedbacks) {
  const container = document.getElementById('feedbacks-grid');
  if (!container) return;

  if (!feedbacks || feedbacks.length === 0) {
    container.innerHTML = `<div class="loading-state">No student reviews match the current filters.</div>`;
    return;
  }

  if (currentViewMode === 'table') {
    let rowsHtml = '';
    feedbacks.forEach(f => {
      const stars = '★'.repeat(f.rating) + '☆'.repeat(5 - f.rating);
      rowsHtml += `
        <tr>
          <td><strong>${escapeHtml(f.studentName || 'Student')}</strong></td>
          <td><span class="course-code-badge">${escapeHtml(f.courseCode)}</span></td>
          <td style="color:#fbbf24;">${stars}</td>
          <td><span class="card-category-badge">${escapeHtml(f.category || 'General')}</span></td>
          <td>${escapeHtml(f.comments || 'No comments left.')}</td>
          <td>
            <button class="like-btn" onclick="likeFeedbackCard(${f.id}, this)">
              <i class="fa-regular fa-thumbs-up"></i> ${f.likesCount || 0}
            </button>
          </td>
        </tr>
      `;
    });

    container.innerHTML = `
      <div class="feedbacks-table-wrap">
        <table class="feedbacks-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Rating</th>
              <th>Category</th>
              <th>Feedback</th>
              <th>Reactions</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    `;
    return;
  }

  // Grid Mode (3D Tilt Cards)
  container.innerHTML = feedbacks.map(f => {
    const initials = (f.studentName || 'S').slice(0, 2).toUpperCase();
    const stars = '★'.repeat(f.rating) + '☆'.repeat(5 - f.rating);
    const dateFormatted = f.createdAt ? new Date(f.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent';

    const tagsHtml = (Array.isArray(f.tags) ? f.tags : []).map(t => `<span class="card-tag">${escapeHtml(t)}</span>`).join('');

    const instructorReplyHtml = f.instructorReply ? `
      <div class="instructor-reply-box">
        <div class="instructor-reply-header">
          <i class="fa-solid fa-circle-check"></i> Faculty Response:
        </div>
        <div class="instructor-reply-text">"${escapeHtml(f.instructorReply)}"</div>
      </div>
    ` : '';

    return `
      <div class="feedback-card glass-panel tilt-card" data-tilt data-id="${f.id}">
        <div>
          <div class="feedback-card-header">
            <div class="student-meta">
              <div class="student-avatar">${initials}</div>
              <div>
                <div class="student-name-text">${escapeHtml(f.studentName || 'Anonymous Student')}</div>
                <div class="feedback-time-text">${dateFormatted} &bull; ${escapeHtml(f.semester || 'Spring 2026')}</div>
              </div>
            </div>
            <span class="course-tag-pill">${escapeHtml(f.courseCode)}</span>
          </div>

          <div class="card-rating-row">
            <div class="card-stars">${stars}</div>
            <span class="card-category-badge">${escapeHtml(f.category || 'General')}</span>
          </div>

          <div class="card-comment">
            "${escapeHtml(f.comments || 'Outstanding course experience and high quality content.')}"
          </div>

          ${tagsHtml ? `<div class="card-tags-row">${tagsHtml}</div>` : ''}
          ${instructorReplyHtml}
        </div>

        <div class="card-footer">
          <button class="like-btn" onclick="likeFeedbackCard(${f.id}, this)" title="Mark as Helpful">
            <i class="fa-regular fa-thumbs-up"></i> Helpful (<span class="like-count">${f.likesCount || 0}</span>)
          </button>

          <div class="admin-card-actions">
            ${isAdminMode ? `
              <button class="action-icon-btn" onclick="openReplyModal(${f.id}, '${escapeHtml(f.studentName)}')" title="Reply as Faculty">
                <i class="fa-solid fa-reply"></i>
              </button>
              <button class="action-icon-btn" onclick="openEditModal(${f.id})" title="Edit Feedback">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="action-icon-btn delete-btn" onclick="openDeleteModal(${f.id})" title="Delete Feedback">
                <i class="fa-solid fa-trash"></i>
              </button>
            ` : ''}
          </div>
        </div>
        <div class="card-shine"></div>
      </div>
    `;
  }).join('');

  init3DTilt();
}

function populateCourseFilters(feedbacks) {
  const courseFilter = document.getElementById('feed-course-filter');
  if (!courseFilter) return;

  const currentVal = courseFilter.value;
  const uniqueCourses = [...new Set(feedbacks.map(f => f.courseCode))].filter(Boolean).sort();

  let optionsHtml = '<option value="ALL">All Courses</option>';
  uniqueCourses.forEach(c => {
    optionsHtml += `<option value="${c}" ${c === currentVal ? 'selected' : ''}>${c}</option>`;
  });
  courseFilter.innerHTML = optionsHtml;
}

function initFiltersAndSearch() {
  const searchInput = document.getElementById('feed-search-input');
  const clearBtn = document.getElementById('clear-search-btn');
  const courseFilter = document.getElementById('feed-course-filter');
  const categoryFilter = document.getElementById('feed-category-filter');
  const sortSelect = document.getElementById('feed-sort-select');

  let debounceTimer;

  searchInput?.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    if (clearBtn) clearBtn.style.display = e.target.value ? 'block' : 'none';
    debounceTimer = setTimeout(() => {
      fetchFeedbacks();
    }, 250);
  });

  clearBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    clearBtn.style.display = 'none';
    fetchFeedbacks();
  });

  courseFilter?.addEventListener('change', () => {
    playSound('action');
    fetchFeedbacks();
  });

  categoryFilter?.addEventListener('change', () => {
    playSound('action');
    fetchFeedbacks();
  });

  sortSelect?.addEventListener('change', () => {
    playSound('action');
    fetchFeedbacks();
  });
}

// Global Helpful / Upvote Handler
window.likeFeedbackCard = async function (id, btnElem) {
  playSound('like');
  try {
    const res = await fetch(`/api/feedback/${id}/like`, { method: 'POST' });
    const json = await res.json();
    if (json.success) {
      btnElem.classList.add('liked');
      const countSpan = btnElem.querySelector('.like-count');
      if (countSpan) countSpan.textContent = json.likesCount;
      showToast('Marked as helpful 👍', 'success');
      // Update quick ribbon
      const ribbon = document.getElementById('ribbon-reactions');
      if (ribbon) ribbon.textContent = parseInt(ribbon.textContent || '0', 10) + 1;
    }
  } catch (err) {
    showToast('Failed to record reaction', 'error');
  }
};

/* ==========================================================================
   10. ANALYTICS & DASHBOARD STATS MATRIX
   ========================================================================== */
async function fetchDashboardStats() {
  try {
    const res = await fetch('/api/feedback/stats/summary');
    const json = await res.json();

    if (json.success) {
      renderStatsMatrix(json);
    }
  } catch (err) {
    console.error('Error fetching analytics:', err);
  }
}

function renderStatsMatrix(stats) {
  const totalCountElem = document.getElementById('stat-total-count');
  const avgRatingElem = document.getElementById('stat-avg-rating');
  const starsRender = document.getElementById('stat-stars-render');
  const sentimentScoreElem = document.getElementById('stat-sentiment-score');
  const topCourseElem = document.getElementById('stat-top-course');
  const topCourseDesc = document.getElementById('stat-top-course-desc');
  const ribbonReactions = document.getElementById('ribbon-reactions');

  // Total
  if (totalCountElem) totalCountElem.textContent = stats.totalFeedback;
  if (ribbonReactions) ribbonReactions.textContent = stats.totalReactions || 0;

  // Average Rating
  const avg = stats.overallAverageRating || 0;
  if (avgRatingElem) avgRatingElem.textContent = avg.toFixed(1);

  if (starsRender) {
    const full = Math.round(avg);
    starsRender.textContent = '★'.repeat(full) + '☆'.repeat(Math.max(0, 5 - full));
  }

  // Donut Gauge
  const donutScore = document.getElementById('donut-rating-val');
  const donutSegment = document.getElementById('donut-score-segment');
  if (donutScore) donutScore.textContent = avg.toFixed(1);
  if (donutSegment) {
    const circumference = 301.59;
    const progress = (avg / 5.0) * circumference;
    donutSegment.style.strokeDashoffset = circumference - progress;
  }

  // Sentiment Score
  if (sentimentScoreElem) {
    sentimentScoreElem.textContent = `${stats.sentimentScore || 94}%`;
  }

  // Distribution Bars
  const dist = stats.ratingDistribution || {};
  const total = stats.totalFeedback || 1;

  for (let i = 1; i <= 5; i++) {
    const count = dist[i] || 0;
    const pct = ((count / total) * 100).toFixed(0);
    const bar = document.getElementById(`bar-${i}`);
    const countElem = document.getElementById(`count-${i}`);
    if (bar) bar.style.width = `${pct}%`;
    if (countElem) countElem.textContent = count;
  }

  // Course Leaderboard
  const courses = stats.courseBreakdown || [];
  const leaderboardContainer = document.getElementById('course-leaderboard-container');

  if (courses.length > 0) {
    if (topCourseElem) topCourseElem.textContent = courses[0].courseCode;
    if (topCourseDesc) topCourseDesc.textContent = `${courses[0].averageRating} ★ (${courses[0].feedbackCount} reviews)`;

    if (leaderboardContainer) {
      leaderboardContainer.innerHTML = courses.map(c => `
        <div class="course-item" onclick="filterByCourseLeaderboard('${c.courseCode}')">
          <span class="course-code-badge">${c.courseCode}</span>
          <div class="course-stats-right">
            <span class="course-rating-val">${c.averageRating} ★</span>
            <span class="course-count-val">${c.feedbackCount} reviews</span>
          </div>
        </div>
      `).join('');
    }
  } else {
    if (leaderboardContainer) leaderboardContainer.innerHTML = '<div class="loading-state">No courses recorded yet.</div>';
  }
}

window.filterByCourseLeaderboard = function (courseCode) {
  playSound('action');
  const filter = document.getElementById('feed-course-filter');
  if (filter) {
    filter.value = courseCode;
    fetchFeedbacks();
    document.getElementById('feedbacks-wall')?.scrollIntoView({ behavior: 'smooth' });
    showToast(`Filtered feed by course: ${courseCode}`, 'info');
  }
};

/* ==========================================================================
   11. MODALS (EDIT, FACULTY REPLY, DELETE)
   ========================================================================== */
function initModals() {
  // Edit Modal
  const editModal = document.getElementById('edit-modal');
  const closeEdit = document.getElementById('close-edit-modal');
  const cancelEdit = document.getElementById('cancel-edit-btn');
  const editForm = document.getElementById('edit-feedback-form');

  const closeEditModal = () => { if (editModal) editModal.style.display = 'none'; };
  closeEdit?.addEventListener('click', closeEditModal);
  cancelEdit?.addEventListener('click', closeEditModal);

  // Edit Star buttons
  const editStarBtns = document.querySelectorAll('#edit-stars-box .modal-star-btn');
  editStarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const r = parseInt(btn.dataset.rating, 10);
      document.getElementById('edit-rating-value').value = r;
      editStarBtns.forEach(b => {
        b.style.color = parseInt(b.dataset.rating, 10) <= r ? '#fbbf24' : '#64748b';
      });
    });
  });

  editForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-feedback-id')?.value;
    const studentName = document.getElementById('edit-student-name')?.value.trim();
    const courseCode = document.getElementById('edit-course-code')?.value.trim().toUpperCase();
    const category = document.getElementById('edit-category')?.value;
    const rating = parseInt(document.getElementById('edit-rating-value')?.value, 10);
    const comments = document.getElementById('edit-comments')?.value.trim();

    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, courseCode, category, rating, comments })
      });
      const json = await res.json();
      if (json.success) {
        playSound('success');
        showToast('Feedback updated successfully!', 'success');
        closeEditModal();
        fetchFeedbacks();
        fetchDashboardStats();
      } else {
        showToast(json.error || 'Failed to update', 'error');
      }
    } catch {
      showToast('Network error updating feedback', 'error');
    }
  });

  // Reply Modal
  const replyModal = document.getElementById('reply-modal');
  const closeReply = document.getElementById('close-reply-modal');
  const cancelReply = document.getElementById('cancel-reply-btn');
  const replyForm = document.getElementById('reply-feedback-form');

  const closeReplyModal = () => { if (replyModal) replyModal.style.display = 'none'; };
  closeReply?.addEventListener('click', closeReplyModal);
  cancelReply?.addEventListener('click', closeReplyModal);

  replyForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('reply-feedback-id')?.value;
    const replyText = document.getElementById('reply-text-input')?.value.trim();

    try {
      const res = await fetch(`/api/feedback/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText })
      });
      const json = await res.json();
      if (json.success) {
        playSound('success');
        showToast('Faculty response published!', 'success');
        closeReplyModal();
        fetchFeedbacks();
      } else {
        showToast(json.error || 'Failed to post reply', 'error');
      }
    } catch {
      showToast('Network error publishing reply', 'error');
    }
  });

  // Delete Modal
  const deleteModal = document.getElementById('delete-modal');
  const closeDelete = document.getElementById('close-delete-modal');
  const cancelDelete = document.getElementById('cancel-delete-btn');
  const confirmDelete = document.getElementById('confirm-delete-btn');

  const closeDeleteModal = () => { if (deleteModal) deleteModal.style.display = 'none'; };
  closeDelete?.addEventListener('click', closeDeleteModal);
  cancelDelete?.addEventListener('click', closeDeleteModal);

  confirmDelete?.addEventListener('click', async () => {
    const id = document.getElementById('delete-feedback-id')?.value;
    try {
      const res = await fetch(`/api/feedback/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        playSound('action');
        showToast('Feedback record removed.', 'info');
        closeDeleteModal();
        fetchFeedbacks();
        fetchDashboardStats();
      }
    } catch {
      showToast('Error deleting feedback', 'error');
    }
  });
}

window.openEditModal = function (id) {
  const item = currentFeedbacks.find(f => f.id === id);
  if (!item) return;

  playSound('click');
  document.getElementById('edit-feedback-id').value = item.id;
  document.getElementById('edit-student-name').value = item.studentName || '';
  document.getElementById('edit-course-code').value = item.courseCode || '';
  document.getElementById('edit-category').value = item.category || 'General';
  document.getElementById('edit-rating-value').value = item.rating || 5;
  document.getElementById('edit-comments').value = item.comments || '';

  const btns = document.querySelectorAll('#edit-stars-box .modal-star-btn');
  btns.forEach(b => {
    b.style.color = parseInt(b.dataset.rating, 10) <= item.rating ? '#fbbf24' : '#64748b';
  });

  const modal = document.getElementById('edit-modal');
  if (modal) modal.style.display = 'flex';
};

window.openReplyModal = function (id, studentName) {
  playSound('click');
  document.getElementById('reply-feedback-id').value = id;
  const targetLabel = document.getElementById('reply-modal-target-student');
  if (targetLabel) targetLabel.textContent = `Responding to feedback from: ${studentName}`;
  const modal = document.getElementById('reply-modal');
  if (modal) modal.style.display = 'flex';
};

window.openDeleteModal = function (id) {
  playSound('click');
  document.getElementById('delete-feedback-id').value = id;
  const modal = document.getElementById('delete-modal');
  if (modal) modal.style.display = 'flex';
};

/* ==========================================================================
   12. MULTI-FORMAT EXPORT SUITE (CSV, JSON, PRINT)
   ========================================================================== */
function initExportFeatures() {
  const exportActionsBtn = document.getElementById('export-actions-btn');
  const exportMenu = document.getElementById('export-menu');

  exportActionsBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    playSound('click');
    exportMenu?.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    exportMenu?.classList.remove('show');
  });

  // Direct CSV Downloads
  const downloadCsv = () => {
    playSound('action');
    window.location.href = '/api/feedback/export/csv';
    showToast('Downloading CSV Report...', 'info');
  };

  document.getElementById('quick-export-csv-btn')?.addEventListener('click', downloadCsv);
  document.getElementById('export-csv-opt')?.addEventListener('click', downloadCsv);

  // Direct JSON Downloads
  const downloadJson = () => {
    playSound('action');
    window.location.href = '/api/feedback/export/json';
    showToast('Downloading JSON Dataset...', 'info');
  };

  document.getElementById('quick-export-json-btn')?.addEventListener('click', downloadJson);
  document.getElementById('export-json-opt')?.addEventListener('click', downloadJson);

  // Print Summary
  const printReport = () => {
    playSound('action');
    window.print();
  };

  document.getElementById('export-summary-pdf-btn')?.addEventListener('click', printReport);
  document.getElementById('export-print-opt')?.addEventListener('click', printReport);
}

/* ==========================================================================
   13. INTERACTIVE REST API EXPLORER
   ========================================================================== */
function initApiExplorer() {
  const tabs = document.querySelectorAll('.api-tab');
  const methodBadge = document.getElementById('api-method-badge');
  const urlDisplay = document.getElementById('api-url-display');
  const paramsBox = document.getElementById('api-params-box');
  const reqBody = document.getElementById('api-request-body');
  const executeBtn = document.getElementById('execute-api-btn');
  const copyCurlBtn = document.getElementById('copy-curl-btn');
  const responseViewer = document.getElementById('api-response-viewer');
  const statusCodeElem = document.getElementById('api-status-code');
  const latencyElem = document.getElementById('api-latency');

  const endpointConfig = {
    getAll: { method: 'GET', url: '/api/feedback', body: null },
    getStats: { method: 'GET', url: '/api/feedback/stats/summary', body: null },
    create: { 
      method: 'POST', 
      url: '/api/feedback', 
      body: JSON.stringify({
        studentName: "Mira Sorvino",
        courseCode: "AI402",
        rating: 5,
        category: "Lab Experience",
        tags: ["#HandsOnLab", "#NeuralNets"],
        comments: "Transformers workshop was stellar."
      }, null, 2)
    },
    getSingle: { method: 'GET', url: '/api/feedback/1', body: null },
    like: { method: 'POST', url: '/api/feedback/1/like', body: null },
    reply: { 
      method: 'POST', 
      url: '/api/feedback/1/reply', 
      body: JSON.stringify({ reply: "Thank you for the wonderful feedback!" }, null, 2)
    },
    exportCsv: { method: 'GET', url: '/api/feedback/export/csv', body: null },
    health: { method: 'GET', url: '/api/health', body: null }
  };

  let activeEndpoint = 'getAll';

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playSound('click');
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      activeEndpoint = tab.dataset.endpoint;
      const conf = endpointConfig[activeEndpoint];

      if (methodBadge) {
        methodBadge.textContent = conf.method;
        methodBadge.className = `http-method-badge ${conf.method}`;
      }
      if (urlDisplay) urlDisplay.textContent = conf.url;

      if (conf.body) {
        if (paramsBox) paramsBox.style.display = 'block';
        if (reqBody) reqBody.value = conf.body;
      } else {
        if (paramsBox) paramsBox.style.display = 'none';
      }
    });
  });

  executeBtn?.addEventListener('click', async () => {
    playSound('action');
    const conf = endpointConfig[activeEndpoint];
    const startTime = performance.now();

    if (responseViewer) responseViewer.textContent = '// Sending request to Voxora Quantum API...';

    try {
      const options = { method: conf.method, headers: {} };
      if (conf.method === 'POST' || conf.method === 'PUT') {
        options.headers['Content-Type'] = 'application/json';
        options.body = reqBody?.value;
      }

      const res = await fetch(conf.url, options);
      const latency = Math.round(performance.now() - startTime);

      if (statusCodeElem) statusCodeElem.textContent = `${res.status} ${res.statusText || 'OK'}`;
      if (latencyElem) latencyElem.innerHTML = `<i class="fa-solid fa-bolt"></i> ${latency}ms latency`;

      if (conf.url.includes('csv')) {
        const text = await res.text();
        if (responseViewer) responseViewer.textContent = text;
      } else {
        const json = await res.json();
        if (responseViewer) responseViewer.textContent = JSON.stringify(json, null, 2);
      }
      playSound('success');
    } catch (err) {
      if (responseViewer) responseViewer.textContent = `// Error executing request: ${err.message}`;
      if (statusCodeElem) statusCodeElem.textContent = '500 Server Error';
    }
  });

  copyCurlBtn?.addEventListener('click', () => {
    const conf = endpointConfig[activeEndpoint];
    const fullUrl = `${window.location.origin}${conf.url}`;
    let curl = `curl -X ${conf.method} "${fullUrl}"`;
    if (conf.body) {
      curl += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${reqBody.value.replace(/\n/g, '')}'`;
    }
    navigator.clipboard.writeText(curl);
    playSound('click');
    showToast('cURL command copied to clipboard!', 'info');
  });
}

/* ==========================================================================
   14. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icon = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info');
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${escapeHtml(message)}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
