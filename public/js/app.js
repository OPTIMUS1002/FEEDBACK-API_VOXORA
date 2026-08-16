/**
 * VOXORA PRO — Next-Gen Student Feedback & Intelligence Platform
 * Features: AI Sentiment Analysis, Web Audio Sci-Fi FX, Multi-Themes, CSV Export, Admin PIN
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  init3DTilt();
  initThemeSystem();
  initSoundSystem();
  initAdminMode();
  initRatingSystem();
  initFormAndSentiment();
  initFiltersAndSearch();
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
   1. 3D AMBIENT PARTICLES CANVAS
   ========================================================================== */
let canvasColor = '#a855f7';

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
  const particleCount = Math.min(width > 768 ? 60 : 30, 80);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2
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
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = canvasColor;
          ctx.globalAlpha = (1 - dist / 110) * 0.15;
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
   2. 3D TILT PHYSICS
   ========================================================================== */
function init3DTilt() {
  const cards = document.querySelectorAll('.tilt-card, [data-tilt]');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
  });
}

/* ==========================================================================
   3. MULTI-THEME SWITCHER
   ========================================================================== */
function initThemeSystem() {
  const themeBtn = document.getElementById('theme-btn');
  const themeMenu = document.getElementById('theme-menu');
  const themeOpts = document.querySelectorAll('.theme-opt');

  const savedTheme = localStorage.getItem('voxora_theme') || 'purple';
  applyTheme(savedTheme);

  themeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    themeMenu?.classList.toggle('show');
    playSound('action');
  });

  document.addEventListener('click', () => {
    themeMenu?.classList.remove('show');
  });

  themeOpts.forEach((opt) => {
    opt.addEventListener('click', () => {
      const theme = opt.dataset.setTheme;
      applyTheme(theme);
      themeMenu?.classList.remove('show');
      playSound('star', 3);
      showToast(`Theme switched to ${opt.textContent}`, 'info');
    });
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('voxora_theme', theme);

    themeOpts.forEach((o) => o.classList.toggle('active', o.dataset.setTheme === theme));

    if (theme === 'cyan') canvasColor = '#38bdf8';
    else if (theme === 'emerald') canvasColor = '#10b981';
    else canvasColor = '#a855f7';
  }
}

/* ==========================================================================
   4. SCI-FI WEB AUDIO SOUND SYSTEM
   ========================================================================== */
let soundEnabled = true;
let audioCtx = null;

function initSoundSystem() {
  const toggleBtn = document.getElementById('sound-toggle-btn');
  const savedSound = localStorage.getItem('voxora_sound');
  soundEnabled = savedSound !== 'disabled';
  updateSoundBtn();

  toggleBtn?.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('voxora_sound', soundEnabled ? 'enabled' : 'disabled');
    updateSoundBtn();
    if (soundEnabled) {
      playSound('star', 4);
      showToast('Sci-Fi Sound FX Enabled', 'info');
    } else {
      showToast('Sound FX Muted', 'info');
    }
  });

  function updateSoundBtn() {
    if (!toggleBtn) return;
    toggleBtn.classList.toggle('active', soundEnabled);
    toggleBtn.innerHTML = soundEnabled
      ? '<i class="fa-solid fa-volume-high"></i>'
      : '<i class="fa-solid fa-volume-xmark"></i>';
  }
}

function playSound(type, level = 1) {
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

    if (type === 'star') {
      const freqs = [350, 440, 523.25, 659.25, 783.99];
      const freq = freqs[Math.min(level - 1, 4)] || 440;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'submit') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554.37, now + 0.1);
      osc.frequency.setValueAtTime(659.25, now + 0.2);
      osc.frequency.setValueAtTime(880, now + 0.3);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'action') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch (e) {
    // Silent fail for audio restrictions
  }
}

/* ==========================================================================
   5. ADMIN / INSTRUCTOR MODE (PIN PROTECTION)
   ========================================================================== */
let isAdminMode = false;
const ADMIN_PIN = '1234';

function initAdminMode() {
  const adminBtn = document.getElementById('admin-mode-btn');
  const pinModal = document.getElementById('admin-pin-modal');
  const pinInput = document.getElementById('admin-pin-input');
  const submitPinBtn = document.getElementById('submit-pin-btn');
  const cancelPinBtn = document.getElementById('cancel-pin-btn');
  const closePinModal = document.getElementById('close-pin-modal');

  adminBtn?.addEventListener('click', () => {
    playSound('action');
    if (isAdminMode) {
      isAdminMode = false;
      adminBtn.classList.remove('admin-active');
      showToast('Admin Mode Deactivated.', 'info');
      fetchFeedbacks();
    } else {
      pinModal.style.display = 'flex';
      if (pinInput) {
        pinInput.value = '';
        pinInput.focus();
      }
    }
  });

  function unlockAdmin() {
    if (pinInput?.value === ADMIN_PIN) {
      isAdminMode = true;
      adminBtn?.classList.add('admin-active');
      pinModal.style.display = 'none';
      playSound('submit');
      showToast('🔓 Admin Privileges Unlocked!', 'success');
      fetchFeedbacks();
    } else {
      showToast('❌ Incorrect PIN. Default is 1234', 'error');
    }
  }

  submitPinBtn?.addEventListener('click', unlockAdmin);
  pinInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') unlockAdmin();
  });

  cancelPinBtn?.addEventListener('click', () => (pinModal.style.display = 'none'));
  closePinModal?.addEventListener('click', () => (pinModal.style.display = 'none'));
}

/* ==========================================================================
   6. 3D STAR RATING SELECTOR
   ========================================================================== */
const ratingSentiments = {
  1: { icon: '⚠️', text: '1 / 5 — Poor Experience' },
  2: { icon: '👎', text: '2 / 5 — Needs Significant Improvement' },
  3: { icon: '⚖️', text: '3 / 5 — Average & Satisfactory' },
  4: { icon: '👍', text: '4 / 5 — Great & Engaging Course' },
  5: { icon: '✨', text: '5 / 5 — Outstanding & Highly Recommended' }
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

    if (sentimentBadge && ratingSentiments[rating]) {
      sentimentBadge.innerHTML = `
        <span class="badge-icon">${ratingSentiments[rating].icon}</span>
        <span class="badge-text">${ratingSentiments[rating].text}</span>
      `;
    }
  }

  starBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const rating = parseInt(btn.dataset.rating, 10);
      if (ratingInput) ratingInput.value = rating;
      updateStars(rating);
      playSound('star', rating);
    });

    btn.addEventListener('mouseenter', () => {
      const hoverRating = parseInt(btn.dataset.rating, 10);
      starBtns.forEach((b) => {
        b.classList.toggle('active', parseInt(b.dataset.rating, 10) <= hoverRating);
      });
    });
  });

  document.getElementById('star-rating-box')?.addEventListener('mouseleave', () => {
    const currentRating = parseInt(ratingInput?.value || 5, 10);
    updateStars(currentRating);
  });
}

/* ==========================================================================
   7. FORM SUBMISSION & REAL-TIME AI SENTIMENT ENGINE
   ========================================================================== */
function initFormAndSentiment() {
  const form = document.getElementById('feedback-form');
  const commentsInput = document.getElementById('feedback-comments-input');
  const charCounter = document.getElementById('char-counter');
  const courseInput = document.getElementById('course-code-input');
  const quickTags = document.querySelectorAll('.quick-tag');
  const submitBtn = document.getElementById('submit-btn');

  const sentimentBox = document.getElementById('ai-sentiment-box');
  const sentimentTag = document.getElementById('ai-sentiment-tag');
  const sentimentText = document.getElementById('ai-sentiment-text');
  const confidenceText = document.getElementById('ai-confidence');

  // Real-time sentiment analysis
  commentsInput?.addEventListener('input', (e) => {
    const text = e.target.value;
    if (charCounter) charCounter.textContent = `${text.length} / 500`;

    if (text.trim().length > 8) {
      const sentiment = analyzeSentiment(text);
      if (sentimentBox) sentimentBox.style.display = 'flex';

      if (sentimentTag && sentimentText && confidenceText) {
        sentimentTag.className = `ai-sentiment-tag ${sentiment.type}`;
        sentimentText.textContent = `AI Analysis: ${sentiment.label}`;
        confidenceText.textContent = `${sentiment.confidence}% confidence`;
      }
    } else {
      if (sentimentBox) sentimentBox.style.display = 'none';
    }
  });

  // Quick Tags
  quickTags.forEach((tag) => {
    tag.addEventListener('click', () => {
      if (courseInput) {
        courseInput.value = tag.dataset.code;
        courseInput.focus();
        playSound('action');
      }
    });
  });

  // Submit Feedback Handler
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentName = document.getElementById('student-name-input').value.trim();
    const courseCode = courseInput.value.trim().toUpperCase();
    const rating = parseInt(document.getElementById('rating-value').value, 10);
    const comments = commentsInput.value.trim();

    if (!studentName || !courseCode || isNaN(rating)) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    submitBtn.disabled = true;

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, courseCode, rating, comments })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        playSound('submit');
        showToast('🎉 Feedback Transmitted Successfully!', 'success');
        form.reset();
        document.getElementById('rating-value').value = 5;
        document.querySelectorAll('#star-rating-box .star-btn').forEach((b) => b.classList.add('active'));
        if (charCounter) charCounter.textContent = '0 / 500';
        if (sentimentBox) sentimentBox.style.display = 'none';

        fetchDashboardStats();
        fetchFeedbacks();
      } else {
        showToast(result.error || 'Failed to submit feedback', 'error');
      }
    } catch (err) {
      console.error('Submit error:', err);
      showToast('Network error: Unable to reach API.', 'error');
    } finally {
      btnText.style.display = 'inline-block';
      btnLoader.style.display = 'none';
      submitBtn.disabled = false;
    }
  });
}

function analyzeSentiment(text) {
  const lower = text.toLowerCase();
  const positiveWords = [
    'great', 'awesome', 'excellent', 'amazing', 'clear', 'engaging', 'loved', 'helpful',
    'fantastic', 'best', 'good', 'super', 'interactive', 'brilliant', 'valuable', 'enjoyed'
  ];
  const criticalWords = [
    'hard', 'poor', 'bad', 'confusing', 'boring', 'unclear', 'struggled', 'worst',
    'disappointed', 'difficult', 'slow', 'waste', 'lacked', 'terrible', 'fix'
  ];

  let posScore = 0;
  let critScore = 0;

  positiveWords.forEach((w) => {
    if (lower.includes(w)) posScore += 1;
  });
  criticalWords.forEach((w) => {
    if (lower.includes(w)) critScore += 1;
  });

  if (posScore > critScore) {
    const conf = Math.min(85 + posScore * 4, 99);
    return { type: 'positive', label: 'Positive & Constructive ✨', confidence: conf };
  } else if (critScore > posScore) {
    const conf = Math.min(80 + critScore * 5, 98);
    return { type: 'critical', label: 'Actionable / Needs Attention ⚠️', confidence: conf };
  } else {
    return { type: 'neutral', label: 'Balanced & Neutral ⚖️', confidence: 88 };
  }
}

/* ==========================================================================
   8. DASHBOARD STATS & ANALYTICS FETCH
   ========================================================================== */
async function fetchDashboardStats() {
  try {
    const res = await fetch('/api/feedback/stats/summary');
    const data = await res.json();

    if (!res.ok || !data.success) return;

    // Total Count
    const totalEl = document.getElementById('stat-total-count');
    if (totalEl) totalEl.textContent = data.totalFeedback;

    // Average Rating
    const avgEl = document.getElementById('stat-avg-rating');
    if (avgEl) avgEl.textContent = data.overallAverageRating > 0 ? data.overallAverageRating.toFixed(1) : 'N/A';

    // Stars Preview
    const starsEl = document.getElementById('stat-stars-render');
    if (starsEl) {
      const rounded = Math.round(data.overallAverageRating || 0);
      starsEl.textContent = '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
    }

    // AI Sentiment Index Calculation
    const total = data.totalFeedback || 1;
    const highRatings = (data.ratingDistribution[5] || 0) + (data.ratingDistribution[4] || 0);
    const sentimentPct = Math.round((highRatings / total) * 100);
    const sentScoreEl = document.getElementById('stat-sentiment-score');
    if (sentScoreEl) sentScoreEl.textContent = `${sentimentPct}%`;

    // Highest Rated Course
    const topCourseEl = document.getElementById('stat-top-course');
    const topCourseDescEl = document.getElementById('stat-top-course-desc');
    if (data.courseBreakdown.length > 0) {
      const sortedByRating = [...data.courseBreakdown].sort((a, b) => b.averageRating - a.averageRating);
      const top = sortedByRating[0];
      if (topCourseEl) topCourseEl.textContent = top.courseCode;
      if (topCourseDescEl) topCourseDescEl.textContent = `${top.averageRating}★ average rating (${top.feedbackCount} reviews)`;
    } else {
      if (topCourseEl) topCourseEl.textContent = 'N/A';
      if (topCourseDescEl) topCourseDescEl.textContent = 'No reviews yet';
    }

    // Rating Distribution Bars
    for (let r = 1; r <= 5; r++) {
      const count = data.ratingDistribution[r] || 0;
      const pct = Math.round((count / total) * 100);
      const bar = document.getElementById(`bar-${r}`);
      const countEl = document.getElementById(`count-${r}`);
      if (bar) bar.style.width = `${pct}%`;
      if (countEl) countEl.textContent = `${count} (${pct}%)`;
    }

    renderCourseLeaderboard(data.courseBreakdown);
    updateCourseFilterOptions(data.courseBreakdown);
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
  }
}

function renderCourseLeaderboard(courses) {
  const container = document.getElementById('course-leaderboard-container');
  if (!container) return;

  if (!courses || courses.length === 0) {
    container.innerHTML = `<div class="empty-state">No courses reviewed yet.</div>`;
    return;
  }

  container.innerHTML = courses
    .map(
      (c) => `
      <div class="course-item">
        <div class="course-item-code">
          <i class="fa-solid fa-code-branch text-purple"></i>
          <span>${escapeHtml(c.courseCode)}</span>
        </div>
        <div class="course-item-stats">
          <div class="course-item-rating">
            <i class="fa-solid fa-star"></i>
            <span>${c.averageRating}</span>
          </div>
          <span class="course-item-count">${c.feedbackCount} review${c.feedbackCount > 1 ? 's' : ''}</span>
        </div>
      </div>
    `
    )
    .join('');
}

function updateCourseFilterOptions(courses) {
  const filterSelect = document.getElementById('feed-course-filter');
  if (!filterSelect) return;

  const currentVal = filterSelect.value;
  const uniqueCourses = [...new Set(courses.map((c) => c.courseCode))].sort();

  let optionsHtml = `<option value="ALL">All Courses</option>`;
  uniqueCourses.forEach((code) => {
    optionsHtml += `<option value="${escapeHtml(code)}" ${currentVal === code ? 'selected' : ''}>${escapeHtml(code)}</option>`;
  });

  filterSelect.innerHTML = optionsHtml;
}

/* ==========================================================================
   9. FEEDBACKS WALL & CARDS
   ========================================================================== */
let allFeedbacksCache = [];

async function fetchFeedbacks() {
  const grid = document.getElementById('feedbacks-grid');
  const search = document.getElementById('feed-search-input')?.value || '';
  const courseCode = document.getElementById('feed-course-filter')?.value || 'ALL';
  const sort = document.getElementById('feed-sort-select')?.value || 'newest';

  const params = new URLSearchParams();
  if (courseCode && courseCode !== 'ALL') params.append('courseCode', courseCode);
  if (search.trim()) params.append('search', search.trim());
  if (sort) params.append('sort', sort);

  try {
    const res = await fetch(`/api/feedback?${params.toString()}`);
    const data = await res.json();

    if (!res.ok || !data.success) {
      if (grid) grid.innerHTML = `<div class="empty-state"><i class="fa-solid fa-circle-exclamation"></i><p>Unable to load feedbacks.</p></div>`;
      return;
    }

    allFeedbacksCache = data.data || [];
    renderFeedbacksGrid(allFeedbacksCache);
  } catch (err) {
    console.error('Error fetching feedbacks:', err);
    if (grid) grid.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><p>Network Error loading feedbacks.</p></div>`;
  }
}

function renderFeedbacksGrid(feedbacks) {
  const grid = document.getElementById('feedbacks-grid');
  if (!grid) return;

  if (!feedbacks || feedbacks.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-ghost"></i>
        <h3>No student feedbacks found</h3>
        <p>Try clearing your search query or be the first to submit a review!</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = feedbacks
    .map((item) => {
      const initials = getInitials(item.studentName);
      const starsHtml = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating);
      const timeFormatted = formatDate(item.createdAt);
      const sentiment = analyzeSentiment(item.comments || '');

      return `
      <div class="feedback-card glass-panel tilt-card" data-id="${item.id}">
        <div>
          <div class="feedback-card-top">
            <div class="student-profile">
              <div class="avatar-circle">${initials}</div>
              <div class="student-meta">
                <span class="student-name">${escapeHtml(item.studentName)}</span>
                <span class="timestamp">${timeFormatted}</span>
              </div>
            </div>
            <span class="course-pill">${escapeHtml(item.courseCode)}</span>
          </div>

          <div class="feedback-rating-row">
            <span class="stars-glow">${starsHtml}</span>
            <span class="rating-score-pill">${item.rating}.0 / 5.0</span>
            <span class="sentiment-pill-mini ${sentiment.type}">
              <i class="fa-solid fa-brain"></i> ${sentiment.type.toUpperCase()}
            </span>
          </div>

          <p class="feedback-body">${item.comments ? escapeHtml(item.comments) : '<em style="color: var(--text-muted);">No additional comments provided.</em>'}</p>
        </div>

        <div class="feedback-footer">
          <span class="feedback-id-tag" title="Click to copy ID" onclick="copyToClipboard('${item.id}', 'Feedback ID Copied!')">
            <i class="fa-solid fa-hashtag"></i> ID: ${item.id}
          </span>
          <div class="card-action-btns">
            ${
              isAdminMode
                ? `
              <button class="card-btn btn-card-edit" title="Edit (Admin)" onclick="openEditModal(${item.id})">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="card-btn btn-card-delete" title="Delete (Admin)" onclick="openDeleteModal(${item.id})">
                <i class="fa-solid fa-trash"></i>
              </button>
            `
                : `
              <button class="card-btn" title="Click to copy review text" onclick="copyToClipboard('${escapeHtml(item.comments || item.courseCode)}', 'Review copied!')">
                <i class="fa-regular fa-copy"></i>
              </button>
            `
            }
          </div>
        </div>
        <div class="card-shine"></div>
      </div>
    `;
    })
    .join('');

  init3DTilt();
}

/* ==========================================================================
   10. EXPORT TO CSV & PRINT REPORT
   ========================================================================== */
function initExportFeatures() {
  const exportCsvBtn = document.getElementById('export-csv-btn');
  const quickExportCsvBtn = document.getElementById('quick-export-csv-btn');
  const exportPdfBtn = document.getElementById('export-summary-pdf-btn');

  function exportCSV() {
    playSound('action');
    if (!allFeedbacksCache || allFeedbacksCache.length === 0) {
      showToast('No feedbacks available to export.', 'error');
      return;
    }

    const headers = ['ID', 'Student Name', 'Course Code', 'Rating', 'Comments', 'Created At'];
    const rows = allFeedbacksCache.map((item) => [
      item.id,
      `"${(item.studentName || '').replace(/"/g, '""')}"`,
      `"${(item.courseCode || '').replace(/"/g, '""')}"`,
      item.rating,
      `"${(item.comments || '').replace(/"/g, '""')}"`,
      `"${item.createdAt || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Voxora_Student_Feedbacks_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('📊 CSV Report Downloaded!', 'success');
  }

  exportCsvBtn?.addEventListener('click', exportCSV);
  quickExportCsvBtn?.addEventListener('click', exportCSV);

  exportPdfBtn?.addEventListener('click', () => {
    playSound('action');
    window.print();
  });
}

/* ==========================================================================
   11. FILTERS, SEARCH & MODALS
   ========================================================================== */
function initFiltersAndSearch() {
  const searchInput = document.getElementById('feed-search-input');
  const clearBtn = document.getElementById('clear-search-btn');
  const courseFilter = document.getElementById('feed-course-filter');
  const sortSelect = document.getElementById('feed-sort-select');

  let debounceTimer;
  searchInput?.addEventListener('input', (e) => {
    clearBtn.style.display = e.target.value.length > 0 ? 'block' : 'none';
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchFeedbacks();
    }, 250);
  });

  clearBtn?.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    fetchFeedbacks();
  });

  courseFilter?.addEventListener('change', () => fetchFeedbacks());
  sortSelect?.addEventListener('change', () => fetchFeedbacks());
}

function initModals() {
  const editModal = document.getElementById('edit-modal');
  const deleteModal = document.getElementById('delete-modal');
  const closeEditBtn = document.getElementById('close-edit-modal');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const closeDeleteBtn = document.getElementById('close-delete-modal');
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
  const editForm = document.getElementById('edit-feedback-form');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

  const modalStars = document.querySelectorAll('#edit-stars-box .modal-star-btn');
  const editRatingInput = document.getElementById('edit-rating-value');

  modalStars.forEach((btn) => {
    btn.addEventListener('click', () => {
      const r = parseInt(btn.dataset.rating, 10);
      if (editRatingInput) editRatingInput.value = r;
      modalStars.forEach((b) => {
        b.classList.toggle('active', parseInt(b.dataset.rating, 10) <= r);
      });
      playSound('star', r);
    });
  });

  closeEditBtn?.addEventListener('click', () => (editModal.style.display = 'none'));
  cancelEditBtn?.addEventListener('click', () => (editModal.style.display = 'none'));

  closeDeleteBtn?.addEventListener('click', () => (deleteModal.style.display = 'none'));
  cancelDeleteBtn?.addEventListener('click', () => (deleteModal.style.display = 'none'));

  editForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-feedback-id').value;
    const studentName = document.getElementById('edit-student-name').value.trim();
    const courseCode = document.getElementById('edit-course-code').value.trim().toUpperCase();
    const rating = parseInt(document.getElementById('edit-rating-value').value, 10);
    const comments = document.getElementById('edit-comments').value.trim();

    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, courseCode, rating, comments })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playSound('submit');
        showToast('Feedback updated successfully!', 'success');
        editModal.style.display = 'none';
        fetchDashboardStats();
        fetchFeedbacks();
      } else {
        showToast(data.error || 'Failed to update feedback', 'error');
      }
    } catch (err) {
      showToast('Network error during update.', 'error');
    }
  });

  confirmDeleteBtn?.addEventListener('click', async () => {
    const id = document.getElementById('delete-feedback-id').value;
    if (!id) return;

    try {
      const res = await fetch(`/api/feedback/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok && data.success) {
        playSound('action');
        showToast('Feedback deleted successfully.', 'info');
        deleteModal.style.display = 'none';
        fetchDashboardStats();
        fetchFeedbacks();
      } else {
        showToast(data.error || 'Failed to delete feedback', 'error');
      }
    } catch (err) {
      showToast('Network error during deletion.', 'error');
    }
  });
}

window.openEditModal = function (id) {
  const item = allFeedbacksCache.find((f) => f.id === id);
  if (!item) return;

  document.getElementById('edit-feedback-id').value = item.id;
  document.getElementById('edit-student-name').value = item.studentName;
  document.getElementById('edit-course-code').value = item.courseCode;
  document.getElementById('edit-comments').value = item.comments || '';
  document.getElementById('edit-rating-value').value = item.rating;

  const modalStars = document.querySelectorAll('#edit-stars-box .modal-star-btn');
  modalStars.forEach((b) => {
    b.classList.toggle('active', parseInt(b.dataset.rating, 10) <= item.rating);
  });

  document.getElementById('edit-modal').style.display = 'flex';
  playSound('action');
};

window.openDeleteModal = function (id) {
  document.getElementById('delete-feedback-id').value = id;
  document.getElementById('delete-modal').style.display = 'flex';
  playSound('action');
};

/* ==========================================================================
   12. REST API EXPLORER
   ========================================================================== */
function initApiExplorer() {
  const tabs = document.querySelectorAll('.api-tab');
  const methodBadge = document.getElementById('api-method-badge');
  const urlDisplay = document.getElementById('api-url-display');
  const executeBtn = document.getElementById('execute-api-btn');
  const copyCurlBtn = document.getElementById('copy-curl-btn');
  const statusCode = document.getElementById('api-status-code');
  const responseViewer = document.getElementById('api-response-viewer');

  const endpointConfigs = {
    getAll: {
      method: 'GET',
      url: '/api/feedback',
      badgeClass: '',
      curl: `curl -X GET "${window.location.origin}/api/feedback"`
    },
    getStats: {
      method: 'GET',
      url: '/api/feedback/stats/summary',
      badgeClass: '',
      curl: `curl -X GET "${window.location.origin}/api/feedback/stats/summary"`
    },
    create: {
      method: 'POST',
      url: '/api/feedback',
      badgeClass: 'post',
      curl: `curl -X POST "${window.location.origin}/api/feedback" -H "Content-Type: application/json" -d '{"studentName":"Test Student","courseCode":"CS101","rating":5,"comments":"Great course!"}'`
    },
    getSingle: {
      method: 'GET',
      url: '/api/feedback/1',
      badgeClass: '',
      curl: `curl -X GET "${window.location.origin}/api/feedback/1"`
    }
  };

  let currentTab = 'getAll';

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.dataset.endpoint;

      const conf = endpointConfigs[currentTab];
      if (conf) {
        methodBadge.textContent = conf.method;
        methodBadge.className = `http-method-badge ${conf.badgeClass}`;
        urlDisplay.textContent = conf.url;
      }
      playSound('action');
    });
  });

  executeBtn?.addEventListener('click', async () => {
    const conf = endpointConfigs[currentTab];
    if (!conf) return;

    playSound('action');
    responseViewer.textContent = '// Sending request to ' + conf.url + ' ...';
    const startTime = performance.now();

    try {
      let res;
      if (conf.method === 'GET') {
        res = await fetch(conf.url);
      } else if (conf.method === 'POST') {
        res = await fetch(conf.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentName: 'API Explorer Student',
            courseCode: 'DEV999',
            rating: 5,
            comments: 'Tested via Voxora Interactive API Explorer!'
          })
        });
      }

      const latency = Math.round(performance.now() - startTime);
      const data = await res.json();

      statusCode.textContent = `${res.status} ${res.statusText || 'OK'}`;
      statusCode.style.color = res.ok ? '#10b981' : '#f43f5e';
      document.getElementById('api-latency').textContent = `⚡ ${latency}ms`;

      responseViewer.textContent = JSON.stringify(data, null, 2);

      if (conf.method === 'POST') {
        fetchDashboardStats();
        fetchFeedbacks();
      }
    } catch (err) {
      statusCode.textContent = '500 Fetch Error';
      statusCode.style.color = '#f43f5e';
      responseViewer.textContent = JSON.stringify({ error: err.message }, null, 2);
    }
  });

  copyCurlBtn?.addEventListener('click', () => {
    const conf = endpointConfigs[currentTab];
    if (conf) {
      copyToClipboard(conf.curl, 'cURL command copied to clipboard!');
      playSound('action');
    }
  });
}

/* ==========================================================================
   13. UTILITIES & TOASTS
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconMap = {
    success: 'fa-solid fa-circle-check',
    error: 'fa-solid fa-circle-xmark',
    info: 'fa-solid fa-circle-info'
  };

  toast.innerHTML = `
    <i class="${iconMap[type] || iconMap.info}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

window.copyToClipboard = function (text, successMsg = 'Copied to clipboard!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => showToast(successMsg, 'success'));
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast(successMsg, 'success');
  }
};

function getInitials(name) {
  if (!name) return 'S';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return 'Just now';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateStr;
  }
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
