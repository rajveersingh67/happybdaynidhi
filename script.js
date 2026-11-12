/* =========================================================
   KAWAII BIRTHDAY SURPRISE WEBSITE FOR NIDHI 🎀
   Complete Interactive Logic, Audio Engine, Games & Animations
   ========================================================= */

// Global State
let soundEnabled = true;
let isAudioPlaying = false;

// =========================================================
// 1. WEB AUDIO API SOUND SYNTHESIZER (No external files needed!)
// =========================================================
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

const SoundFX = {
  pop() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.log('Audio not supported or muted');
    }
  },

  sparkle() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.07);
        osc.stop(ctx.currentTime + i * 0.07 + 0.2);
      });
    } catch (e) {}
  },

  flip() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(550, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch (e) {}
  },

  blow() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 400;
      filter.Q.value = 1.0;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
      noise.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  },

  fanfare() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      // Cheerful fanfare arpeggio
      const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.4);
      });
    } catch (e) {}
  }
};

// =========================================================
// 2. CONFETTI ENGINE (High-performance lightweight canvas)
// =========================================================
function launchConfetti(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 75) {
  const colors = ['#ff85a1', '#fb6f92', '#a2d2ff', '#fefae0', '#d0f4de', '#ffd166', '#e8dff5'];
  const confettiCanvas = document.createElement('canvas');
  confettiCanvas.style.position = 'fixed';
  confettiCanvas.style.inset = '0';
  confettiCanvas.style.width = '100vw';
  confettiCanvas.style.height = '100vh';
  confettiCanvas.style.pointerEvents = 'none';
  confettiCanvas.style.zIndex = '999999';
  document.body.appendChild(confettiCanvas);

  const ctx = confettiCanvas.getContext('2d');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const particles = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 8 + 4;
    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - 3,
      size: Math.random() * 9 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 12,
      gravity: 0.25,
      alpha: 1,
      shape: Math.random() > 0.4 ? 'rect' : 'circle'
    });
  }

  let animationFrame;
  function updateConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.vRotation;
      p.alpha -= 0.012;

      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    });

    if (alive) {
      animationFrame = requestAnimationFrame(updateConfetti);
    } else {
      cancelAnimationFrame(animationFrame);
      confettiCanvas.remove();
    }
  }

  updateConfetti();
}

function triggerConfettiShower() {
  SoundFX.sparkle();
  launchConfetti(window.innerWidth * 0.25, window.innerHeight * 0.35, 60);
  launchConfetti(window.innerWidth * 0.75, window.innerHeight * 0.35, 60);
  launchConfetti(window.innerWidth * 0.5, window.innerHeight * 0.2, 80);
}

function sendHeartBlast() {
  SoundFX.sparkle();
  const hearts = ['💖', '💕', '🌸', '✨', '🎀', '🌷'];
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('div');
    el.className = 'trail-sparkle';
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.left = `${Math.random() * 80 + 10}vw`;
    el.style.top = `${Math.random() * 60 + 20}vh`;
    el.style.fontSize = `${Math.random() * 20 + 22}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }
}

// =========================================================
// 3. CURSOR SPARKLE TRAIL
// =========================================================
const cursorTrailContainer = document.getElementById('cursor-trail-container');
let lastSparkleTime = 0;

function createSparkle(x, y) {
  const now = Date.now();
  if (now - lastSparkleTime < 45) return; // limit frequency
  lastSparkleTime = now;

  const icons = ['✨', '🌸', '💖', '⭐', '🎀'];
  const sparkle = document.createElement('span');
  sparkle.className = 'trail-sparkle';
  sparkle.textContent = icons[Math.floor(Math.random() * icons.length)];
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;
  sparkle.style.fontSize = `${Math.random() * 8 + 14}px`;

  cursorTrailContainer.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 800);
}

window.addEventListener('mousemove', (e) => {
  createSparkle(e.clientX, e.clientY);
});

window.addEventListener('touchmove', (e) => {
  if (e.touches && e.touches[0]) {
    createSparkle(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: true });

// Ambient Drifting Hearts Generator
function spawnAmbientParticles() {
  const container = document.getElementById('ambient-particles');
  if (!container) return;
  const icons = ['🌸', '✨', '💕', '🌷', '🎀', '⭐'];

  setInterval(() => {
    if (document.hidden) return;
    const heart = document.createElement('div');
    heart.className = 'ambient-heart';
    heart.textContent = icons[Math.floor(Math.random() * icons.length)];
    heart.style.left = `${Math.random() * 96}vw`;
    heart.style.fontSize = `${Math.random() * 12 + 16}px`;
    heart.style.animationDuration = `${Math.random() * 6 + 7}s`;
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 13000);
  }, 2200);
}

// =========================================================
// 4. OPENING SURPRISE SCREEN INTERACTION
// =========================================================
const openSurpriseBtn = document.getElementById('open-surprise-btn');
const openingScreen = document.getElementById('opening-screen');

if (openSurpriseBtn && openingScreen) {
  openSurpriseBtn.addEventListener('click', () => {
    SoundFX.fanfare();
    launchConfetti(window.innerWidth / 2, window.innerHeight / 2, 120);

    openingScreen.classList.add('hidden');
    setTimeout(() => {
      openingScreen.style.display = 'none';
      // Smoothly scroll to the celebration section
      const celebrationSection = document.getElementById('celebration-section');
      if (celebrationSection) {
        celebrationSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 700);
  });
}

function replaySurpriseExperience() {
  SoundFX.sparkle();
  if (openingScreen) {
    openingScreen.style.display = 'flex';
    void openingScreen.offsetWidth; // trigger reflow
    openingScreen.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// =========================================================
// 5. AUDIO PLAYER (MUSIC CORNER & DOCK MINI CONTROLS)
// =========================================================
const birthdayAudio = document.getElementById('birthday-audio');
const dockPlayBtn = document.getElementById('dock-play-btn');
const dockPlayIcon = document.getElementById('dock-play-icon');
const miniDisc = document.getElementById('mini-disc');
const dockTimeText = document.getElementById('dock-time-text');

const btnMainPlay = document.getElementById('btn-main-play');
const mainPlayIcon = document.getElementById('main-play-icon');
const vinylRecord = document.getElementById('vinyl-record');
const turntableTonearm = document.getElementById('turntable-tonearm');
const musicFloatingNotes = document.getElementById('music-floating-notes');
const equalizerBars = document.getElementById('equalizer-bars');

const progressBarWrapper = document.getElementById('progress-bar-wrapper');
const progressBarFill = document.getElementById('progress-bar-fill');
const progressScrubber = document.getElementById('progress-scrubber');
const currentTimeLabel = document.getElementById('current-time');
const totalDurationLabel = document.getElementById('total-duration');

const volumeSlider = document.getElementById('volume-slider');
const volumePercent = document.getElementById('volume-percent');
const btnRewind = document.getElementById('btn-rewind');
const btnLoop = document.getElementById('btn-loop');
const sfxToggleBtn = document.getElementById('sfx-toggle-btn');
const sfxIcon = document.getElementById('sfx-icon');

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function setPlaybackState(playing) {
  isAudioPlaying = playing;
  if (playing) {
    dockPlayIcon.textContent = '⏸️';
    mainPlayIcon.textContent = '⏸️';
    miniDisc.classList.add('spinning');
    vinylRecord.classList.add('playing');
    turntableTonearm.classList.add('active');
    musicFloatingNotes.classList.add('active');
    equalizerBars.classList.add('animating');
  } else {
    dockPlayIcon.textContent = '▶️';
    mainPlayIcon.textContent = '▶️';
    miniDisc.classList.remove('spinning');
    vinylRecord.classList.remove('playing');
    turntableTonearm.classList.remove('active');
    musicFloatingNotes.classList.remove('active');
    equalizerBars.classList.remove('animating');
  }
}

function toggleAudio() {
  if (!birthdayAudio) return;
  getAudioContext(); // user gesture unlocks audio

  if (birthdayAudio.paused) {
    birthdayAudio.play().then(() => {
      setPlaybackState(true);
    }).catch(err => {
      console.log('Playback error:', err);
    });
  } else {
    birthdayAudio.pause();
    setPlaybackState(false);
  }
}

if (dockPlayBtn) dockPlayBtn.addEventListener('click', toggleAudio);
if (btnMainPlay) btnMainPlay.addEventListener('click', toggleAudio);

if (birthdayAudio) {
  birthdayAudio.addEventListener('timeupdate', () => {
    const current = birthdayAudio.currentTime;
    const duration = birthdayAudio.duration || 11;
    const pct = (current / duration) * 100;

    if (progressBarFill) progressBarFill.style.width = `${pct}%`;
    if (progressScrubber) progressScrubber.style.left = `${pct}%`;
    if (currentTimeLabel) currentTimeLabel.textContent = formatTime(current);
    if (dockTimeText) dockTimeText.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
  });

  birthdayAudio.addEventListener('loadedmetadata', () => {
    if (totalDurationLabel) totalDurationLabel.textContent = formatTime(birthdayAudio.duration);
    if (dockTimeText) dockTimeText.textContent = `0:00 / ${formatTime(birthdayAudio.duration)}`;
  });

  birthdayAudio.addEventListener('ended', () => {
    if (!birthdayAudio.loop) {
      setPlaybackState(false);
    }
  });
}

// Progress scrubbing
if (progressBarWrapper) {
  progressBarWrapper.addEventListener('click', (e) => {
    if (!birthdayAudio || !birthdayAudio.duration) return;
    const rect = progressBarWrapper.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    birthdayAudio.currentTime = pct * birthdayAudio.duration;
  });
}

// Rewind
if (btnRewind) {
  btnRewind.addEventListener('click', () => {
    SoundFX.pop();
    if (birthdayAudio) {
      birthdayAudio.currentTime = 0;
    }
  });
}

// Loop toggle
if (btnLoop) {
  btnLoop.addEventListener('click', () => {
    SoundFX.pop();
    if (birthdayAudio) {
      birthdayAudio.loop = !birthdayAudio.loop;
      btnLoop.classList.toggle('active', birthdayAudio.loop);
    }
  });
}

// Volume slider
if (volumeSlider) {
  volumeSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (birthdayAudio) birthdayAudio.volume = val;
    if (volumePercent) volumePercent.textContent = `${Math.round(val * 100)}%`;
  });
}

// Sound FX toggle
if (sfxToggleBtn) {
  sfxToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    sfxIcon.textContent = soundEnabled ? '🔊' : '🔇';
    if (soundEnabled) SoundFX.sparkle();
  });
}

const showerHeartsBtn = document.getElementById('shower-hearts-btn');
if (showerHeartsBtn) {
  showerHeartsBtn.addEventListener('click', () => {
    triggerConfettiShower();
    sendHeartBlast();
  });
}

// =========================================================
// 6. CELEBRATION SECTION INTERACTIVE CHEER BUTTONS
// =========================================================
const cheerButtons = document.querySelectorAll('.cheer-btn');
cheerButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    SoundFX.sparkle();
    const cheerType = btn.getAttribute('data-cheer');
    const countEl = btn.querySelector('.cheer-count');
    if (countEl) {
      let currentVal = parseInt(countEl.textContent.replace('+', ''), 10) || 100;
      countEl.textContent = `${currentVal + 1}+`;
    }

    // Spawn floating emoji
    const rect = btn.getBoundingClientRect();
    const floatingEmoji = document.createElement('div');
    floatingEmoji.className = 'trail-sparkle';
    floatingEmoji.textContent = btn.querySelector('.cheer-emoji').textContent;
    floatingEmoji.style.left = `${rect.left + rect.width / 2}px`;
    floatingEmoji.style.top = `${rect.top}px`;
    floatingEmoji.style.fontSize = '28px';
    document.body.appendChild(floatingEmoji);
    setTimeout(() => floatingEmoji.remove(), 900);

    launchConfetti(rect.left + rect.width / 2, rect.top, 25);
  });
});

// =========================================================
// 7. MAKE A WISH SECTION (SECTION 4)
// =========================================================
const sendWishBtn = document.getElementById('send-wish-btn');
const secretWishInput = document.getElementById('secret-wish-input');
const wishSentAlert = document.getElementById('wish-sent-alert');
const displayedWishText = document.getElementById('displayed-wish-text');

if (sendWishBtn) {
  sendWishBtn.addEventListener('click', () => {
    const wish = secretWishInput.value.trim();
    SoundFX.sparkle();
    launchConfetti(window.innerWidth / 2, window.innerHeight * 0.4, 60);

    if (wish) {
      displayedWishText.textContent = `“${wish}”`;
    } else {
      displayedWishText.textContent = `“May every dream in Nidhi's beautiful heart come true!” 🌟`;
    }

    wishSentAlert.classList.remove('hidden');
    sendWishBtn.textContent = 'Wish Sent to the Stars! ⭐';
    sendWishBtn.disabled = true;
  });
}

// Camera click shutter effect
const cameraFlashIndicator = document.getElementById('camera-flash-indicator');
if (cameraFlashIndicator) {
  cameraFlashIndicator.addEventListener('click', () => {
    SoundFX.pop();
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.inset = '0';
    flash.style.background = '#ffffff';
    flash.style.zIndex = '99999';
    flash.style.opacity = '0.9';
    flash.style.transition = 'opacity 0.4s ease';
    document.body.appendChild(flash);

    setTimeout(() => {
      flash.style.opacity = '0';
      setTimeout(() => flash.remove(), 400);
    }, 50);

    launchConfetti(window.innerWidth / 2, window.innerHeight / 2, 40);
  });
}

// =========================================================
// 8. MEMORIES GALLERY LIGHTBOX MODAL
// =========================================================
const memoryLightbox = document.getElementById('memory-lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');

function openLightbox(imgSrc, captionText) {
  SoundFX.flip();
  if (memoryLightbox && lightboxImage && lightboxCaption) {
    lightboxImage.src = imgSrc;
    lightboxCaption.textContent = captionText;
    memoryLightbox.classList.add('active');
  }
}

function closeLightbox() {
  if (memoryLightbox) {
    memoryLightbox.classList.remove('active');
  }
}

// =========================================================
// 9. A SPECIAL BIRTHDAY LETTER (INTERACTIVE ENVELOPE)
// =========================================================
const birthdayEnvelope = document.getElementById('birthday-envelope');
let isLetterTyping = false;

function toggleEnvelope() {
  if (!birthdayEnvelope) return;
  if (birthdayEnvelope.classList.contains('closed')) {
    openEnvelope();
  }
}

function openEnvelope() {
  SoundFX.sparkle();
  launchConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 50);
  birthdayEnvelope.classList.remove('closed');
  birthdayEnvelope.classList.add('open');
}

function closeEnvelope(e) {
  if (e) e.stopPropagation();
  SoundFX.flip();
  birthdayEnvelope.classList.remove('open');
  birthdayEnvelope.classList.add('closed');
}

function toggleTypewriterSpeed(e) {
  if (e) e.stopPropagation();
  SoundFX.sparkle();
  const typedBody = document.getElementById('typed-letter-body');
  if (!typedBody) return;
  
  const originalHTML = typedBody.innerHTML;
  typedBody.style.opacity = '0.3';
  setTimeout(() => {
    typedBody.style.opacity = '1';
    launchConfetti(window.innerWidth / 2, window.innerHeight * 0.5, 40);
  }, 300);
}

// =========================================================
// 10. ANIMATED BIRTHDAY CAKE INTERACTION
// =========================================================
const candleItems = document.querySelectorAll('.candle-item');
const blowCandlesBtn = document.getElementById('blow-candles-btn');
const relightCandlesBtn = document.getElementById('relight-candles-btn');
const cakeWishReveal = document.getElementById('cake-wish-reveal');

function blowCandles() {
  SoundFX.blow();
  setTimeout(() => {
    SoundFX.fanfare();
    candleItems.forEach(c => c.classList.add('blown'));

    if (blowCandlesBtn) blowCandlesBtn.classList.add('hidden');
    if (relightCandlesBtn) relightCandlesBtn.classList.remove('hidden');
    if (cakeWishReveal) cakeWishReveal.classList.remove('hidden');

    triggerConfettiShower();
  }, 250);
}

function relightCandles() {
  SoundFX.sparkle();
  candleItems.forEach(c => c.classList.remove('blown'));
  if (blowCandlesBtn) blowCandlesBtn.classList.remove('hidden');
  if (relightCandlesBtn) relightCandlesBtn.classList.add('hidden');
  if (cakeWishReveal) cakeWishReveal.classList.add('hidden');
}

// =========================================================
// 11. FIVE INTERACTIVE BIRTHDAY MINI-GAMES
// =========================================================

// Tabs switcher
function switchGame(gameId) {
  SoundFX.flip();
  document.querySelectorAll('.game-card-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  document.querySelectorAll('.game-tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  const targetPanel = document.getElementById(gameId);
  const targetTab = document.getElementById(`tab-${gameId}`);
  if (targetPanel) targetPanel.classList.add('active');
  if (targetTab) targetTab.classList.add('active');

  // Trigger setup if needed
  if (gameId === 'game-hearts' && !heartsGameRunning) {
    initHeartsGameCanvas();
  } else if (gameId === 'game-balloons') {
    if (balloons.length === 0) spawnBalloonsWave();
  } else if (gameId === 'game-scratch') {
    if (!scratchInitialized) initScratchCard();
  } else if (gameId === 'game-memory') {
    if (memoryCards.length === 0) initMemoryGame();
  }
}

// ---------------------------------------------------------
// GAME 1: CATCH THE HEARTS ❤️
// ---------------------------------------------------------
let heartsCanvas, heartsCtx;
let heartsScore = 0;
let heartsTimeLeft = 30;
let heartsGameInterval = null;
let heartsGameRunning = false;
let basket = { x: 220, y: 320, width: 70, height: 40 };
let fallingItems = [];

function initHeartsGameCanvas() {
  heartsCanvas = document.getElementById('hearts-canvas');
  if (!heartsCanvas) return;
  heartsCtx = heartsCanvas.getContext('2d');

  // Mouse / Touch tracking on canvas
  heartsCanvas.addEventListener('mousemove', (e) => {
    const rect = heartsCanvas.getBoundingClientRect();
    const scaleX = heartsCanvas.width / rect.width;
    basket.x = (e.clientX - rect.left) * scaleX - basket.width / 2;
    basket.x = Math.max(0, Math.min(heartsCanvas.width - basket.width, basket.x));
  });

  heartsCanvas.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      const rect = heartsCanvas.getBoundingClientRect();
      const scaleX = heartsCanvas.width / rect.width;
      basket.x = (e.touches[0].clientX - rect.left) * scaleX - basket.width / 2;
      basket.x = Math.max(0, Math.min(heartsCanvas.width - basket.width, basket.x));
    }
  }, { passive: true });

  // Mobile arrow buttons
  const leftBtn = document.getElementById('btn-move-left');
  const rightBtn = document.getElementById('btn-move-right');
  if (leftBtn) {
    leftBtn.addEventListener('click', () => {
      basket.x = Math.max(0, basket.x - 45);
    });
  }
  if (rightBtn) {
    rightBtn.addEventListener('click', () => {
      basket.x = Math.min(heartsCanvas.width - basket.width, basket.x + 45);
    });
  }
}

function startHeartsGame() {
  getAudioContext();
  SoundFX.sparkle();
  const overlay = document.getElementById('hearts-overlay');
  if (overlay) overlay.classList.add('hidden');

  heartsScore = 0;
  heartsTimeLeft = 30;
  fallingItems = [];
  heartsGameRunning = true;
  document.getElementById('hearts-score').textContent = '0';
  document.getElementById('hearts-timer').textContent = '30s';

  if (heartsGameInterval) clearInterval(heartsGameInterval);
  heartsGameInterval = setInterval(() => {
    heartsTimeLeft--;
    document.getElementById('hearts-timer').textContent = `${heartsTimeLeft}s`;
    if (heartsTimeLeft <= 0) {
      endHeartsGame();
    }
  }, 1000);

  requestAnimationFrame(updateHeartsGame);
}

function updateHeartsGame() {
  if (!heartsGameRunning || !heartsCtx) return;

  heartsCtx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);

  // Spawn new item
  if (Math.random() < 0.05) {
    const types = [
      { char: '❤️', pts: 10, speed: 3 },
      { char: '🍓', pts: 15, speed: 3.5 },
      { char: '🧁', pts: 20, speed: 4 },
      { char: '⭐', pts: 25, speed: 4.5 }
    ];
    const chosen = types[Math.floor(Math.random() * types.length)];
    fallingItems.push({
      x: Math.random() * (heartsCanvas.width - 30) + 15,
      y: -20,
      char: chosen.char,
      pts: chosen.pts,
      speed: chosen.speed
    });
  }

  // Draw basket
  heartsCtx.save();
  heartsCtx.fillStyle = '#ffb3c6';
  heartsCtx.strokeStyle = '#2b2b2b';
  heartsCtx.lineWidth = 3.5;
  heartsCtx.beginPath();
  heartsCtx.roundRect(basket.x, basket.y, basket.width, basket.height, [8, 8, 16, 16]);
  heartsCtx.fill();
  heartsCtx.stroke();
  // Cute bow on basket
  heartsCtx.font = '20px sans-serif';
  heartsCtx.fillText('🎀', basket.x + basket.width / 2 - 10, basket.y + 26);
  heartsCtx.restore();

  // Draw & update items
  for (let i = fallingItems.length - 1; i >= 0; i--) {
    const item = fallingItems[i];
    item.y += item.speed;

    heartsCtx.font = '24px sans-serif';
    heartsCtx.fillText(item.char, item.x - 12, item.y + 12);

    // Collision check with basket
    if (
      item.y >= basket.y - 10 &&
      item.y <= basket.y + basket.height &&
      item.x >= basket.x &&
      item.x <= basket.x + basket.width
    ) {
      SoundFX.pop();
      heartsScore += item.pts;
      document.getElementById('hearts-score').textContent = heartsScore;
      fallingItems.splice(i, 1);
      continue;
    }

    if (item.y > heartsCanvas.height + 30) {
      fallingItems.splice(i, 1);
    }
  }

  requestAnimationFrame(updateHeartsGame);
}

function endHeartsGame() {
  heartsGameRunning = false;
  clearInterval(heartsGameInterval);
  SoundFX.fanfare();
  launchConfetti(window.innerWidth / 2, window.innerHeight / 2, 70);

  const overlay = document.getElementById('hearts-overlay');
  const modalTitle = document.getElementById('hearts-modal-title');
  const modalDesc = document.getElementById('hearts-modal-desc');

  if (overlay && modalTitle && modalDesc) {
    modalTitle.textContent = `Amazing Job Nidhi! 🎉`;
    modalDesc.textContent = `You scored ${heartsScore} points! You've caught a heart full of love and sweets!`;
    overlay.classList.remove('hidden');
  }
}

// ---------------------------------------------------------
// GAME 2: POP THE BALLOONS 🎈
// ---------------------------------------------------------
const balloonsArena = document.getElementById('balloons-arena');
const balloonsPoppedCount = document.getElementById('balloons-popped-count');
const balloonSecretText = document.getElementById('balloon-secret-text');
let poppedBalloons = 0;
let balloons = [];

const balloonCompliments = [
  "Nidhi, your smile is brighter than a million suns! ☀️",
  "You make the ordinary moments feel like fairy tales! 🧚",
  "Cutest person in the universe award goes to: Nidhi! 🏅",
  "You have the kindest, softest heart in the world ❤️",
  "Thank you for being my favorite human ever! 🌸",
  "Today is 100% about celebrating your sweetness! 🎂",
  "Every second with you is a cherished memory! 🎀",
  "You make laughter look so effortless! 💖",
  "Infinite hugs are waiting for you right now! 🤗",
  "May this birthday bring you everything you dream of! ✨"
];

function spawnBalloonsWave() {
  if (!balloonsArena) return;
  balloonsArena.innerHTML = '';
  balloons = [];
  poppedBalloons = 0;
  if (balloonsPoppedCount) balloonsPoppedCount.textContent = '0';

  const pastelColors = ['#ffccd5', '#a2d2ff', '#fefae0', '#d0f4de', '#e8dff5', '#ffc6ff', '#bde0fe', '#fde2e4', '#c5dedd', '#fed9b7'];

  for (let i = 0; i < 10; i++) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon-item';
    balloon.style.backgroundColor = pastelColors[i % pastelColors.length];
    balloon.style.animationDelay = `${(i * 0.25).toFixed(2)}s`;

    const string = document.createElement('div');
    string.className = 'balloon-string';
    const knot = document.createElement('div');
    knot.className = 'balloon-knot';

    balloon.appendChild(string);
    balloon.appendChild(knot);

    // Number label
    const num = document.createElement('span');
    num.style.fontFamily = 'var(--font-doodle)';
    num.style.fontSize = '1.2rem';
    num.style.fontWeight = '700';
    num.textContent = `${i + 1}`;
    balloon.appendChild(num);

    balloon.addEventListener('click', () => {
      SoundFX.pop();
      launchConfetti(balloon.getBoundingClientRect().left + 35, balloon.getBoundingClientRect().top + 40, 20);
      balloon.remove();
      poppedBalloons++;
      if (balloonsPoppedCount) balloonsPoppedCount.textContent = poppedBalloons;

      // Reveal secret compliment
      const comp = balloonCompliments[i % balloonCompliments.length];
      if (balloonSecretText) {
        balloonSecretText.textContent = `“${comp}”`;
      }

      if (poppedBalloons >= 10) {
        SoundFX.fanfare();
        triggerConfettiShower();
        if (balloonSecretText) {
          balloonSecretText.textContent = `🎉 ALL 10 BALLOONS POPPED! Nidhi, you are the absolute sweetest! 💖`;
        }
      }
    });

    balloonsArena.appendChild(balloon);
    balloons.push(balloon);
  }
}

// ---------------------------------------------------------
// GAME 3: THE NIDHI & US QUIZ 💗
// ---------------------------------------------------------
const quizQuestions = [
  {
    q: "What is my absolute favorite thing about Nidhi?",
    options: [
      { text: "Her adorable laugh and funny giggles", correct: false },
      { text: "Her soft, caring, and kind heart", correct: false },
      { text: "The way her eyes light up when she smiles", correct: false },
      { text: "ALL OF THE ABOVE X INFINITY! 💖", correct: true }
    ],
    feedback: "Of course! Every single little detail about you is pure perfection! ✨"
  },
  {
    q: "What is our ideal cozy weekend date?",
    options: [
      { text: "Ordering delicious food and watching our favorite shows", correct: false },
      { text: "Late night sweet talks with hot cocoa", correct: false },
      { text: "Laughing at silly jokes until our stomachs hurt", correct: false },
      { text: "Anywhere and anything, as long as it's with you! 🌸", correct: true }
    ],
    feedback: "Spot on! The best place in the entire world is wherever you are! 🏡"
  },
  {
    q: "If Nidhi was a sweet birthday treat, what would she be?",
    options: [
      { text: "A fresh strawberry shortcake with extra cream 🍓", correct: false },
      { text: "A warm cinnamon roll full of sweet warmth 🥐", correct: false },
      { text: "The sweetest, most magical confection ever made! 🎂", correct: true },
      { text: "A bowl of sweet honey peaches 🍑", correct: false }
    ],
    feedback: "Nothing in any bakery could ever match your sweetness! 🍰"
  },
  {
    q: "Who is the cutest girl in the entire world right at this second?",
    options: [
      { text: "Nidhi 🌷", correct: false },
      { text: "Still Nidhi 🎀", correct: false },
      { text: "Always Nidhi 👑", correct: false },
      { text: "Nidhi, forever and ever without a doubt! ❤️", correct: true }
    ],
    feedback: "1000% uncontested truth! You're the crowned Queen of Cuteness! 👑"
  },
  {
    q: "How much love and happiness does Nidhi deserve this year?",
    options: [
      { text: "100%", correct: false },
      { text: "10,000%", correct: false },
      { text: "Beyond the moon and stars", correct: false },
      { text: "Limitless, boundless, and unending! 🚀💖", correct: true }
    ],
    feedback: "Yes! May every day ahead overflow with love, peace, and smiles! 🌸"
  }
];

let currentQuizIndex = 0;
const quizQuestionText = document.getElementById('quiz-question-text');
const quizOptionsGrid = document.getElementById('quiz-options-grid');
const quizFeedbackBox = document.getElementById('quiz-feedback-box');
const quizProgress = document.getElementById('quiz-progress');
const quizContainer = document.getElementById('quiz-container');
const quizResultCard = document.getElementById('quiz-result-card');

function renderQuizQuestion() {
  if (!quizQuestionText || !quizOptionsGrid) return;

  const currentQ = quizQuestions[currentQuizIndex];
  quizQuestionText.textContent = currentQ.q;
  quizProgress.textContent = `${currentQuizIndex + 1}`;
  quizOptionsGrid.innerHTML = '';
  quizFeedbackBox.classList.add('hidden');

  currentQ.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.innerHTML = `<span>${['A', 'B', 'C', 'D'][idx]})</span> <span>${opt.text}</span>`;

    btn.addEventListener('click', () => {
      SoundFX.sparkle();
      btn.classList.add('correct');
      quizFeedbackBox.textContent = currentQ.feedback;
      quizFeedbackBox.classList.remove('hidden');

      // Disable other buttons
      document.querySelectorAll('.quiz-option-btn').forEach(b => b.disabled = true);

      setTimeout(() => {
        currentQuizIndex++;
        if (currentQuizIndex < quizQuestions.length) {
          renderQuizQuestion();
        } else {
          showQuizResults();
        }
      }, 1400);
    });

    quizOptionsGrid.appendChild(btn);
  });
}

function showQuizResults() {
  SoundFX.fanfare();
  triggerConfettiShower();
  if (quizContainer) quizContainer.classList.add('hidden');
  if (quizResultCard) quizResultCard.classList.remove('hidden');
}

function restartQuiz() {
  SoundFX.sparkle();
  currentQuizIndex = 0;
  if (quizContainer) quizContainer.classList.remove('hidden');
  if (quizResultCard) quizResultCard.classList.add('hidden');
  renderQuizQuestion();
}

// ---------------------------------------------------------
// GAME 4: SCRATCH TO REVEAL 🎁
// ---------------------------------------------------------
let scratchCanvas, scratchCtx;
let isScratching = false;
let scratchInitialized = false;
let scratchedUnlocked = false;

function initScratchCard() {
  scratchCanvas = document.getElementById('scratch-canvas');
  if (!scratchCanvas) return;
  scratchCtx = scratchCanvas.getContext('2d');
  scratchedUnlocked = false;
  scratchInitialized = true;
  document.getElementById('scratch-percent').textContent = '0%';

  const width = scratchCanvas.width;
  const height = scratchCanvas.height;

  // Draw silver/pastel glitter scratch layer
  const grad = scratchCtx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#d8d8d8');
  grad.addColorStop(0.5, '#f5f5f5');
  grad.addColorStop(1, '#c0c0c0');
  scratchCtx.fillStyle = grad;
  scratchCtx.fillRect(0, 0, width, height);

  // Decorative doodle pattern on scratch layer
  scratchCtx.fillStyle = '#ff85a1';
  scratchCtx.font = 'bold 24px var(--font-doodle), cursive';
  scratchCtx.textAlign = 'center';
  scratchCtx.fillText('✨ Scratch Here to Reveal Secret! ✨', width / 2, height / 2 - 15);
  scratchCtx.font = '18px var(--font-doodle), cursive';
  scratchCtx.fillStyle = '#555';
  scratchCtx.fillText('🎀 Scratch with finger or mouse 🎀', width / 2, height / 2 + 20);

  function scratch(x, y) {
    if (scratchedUnlocked) return;
    scratchCtx.globalCompositeOperation = 'destination-out';
    scratchCtx.beginPath();
    scratchCtx.arc(x, y, 26, 0, Math.PI * 2);
    scratchCtx.fill();

    checkScratchProgress();
  }

  function getPos(e) {
    const rect = scratchCanvas.getBoundingClientRect();
    const scaleX = scratchCanvas.width / rect.width;
    const scaleY = scratchCanvas.height / rect.height;
    if (e.touches && e.touches[0]) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  scratchCanvas.onmousedown = (e) => {
    isScratching = true;
    const pos = getPos(e);
    scratch(pos.x, pos.y);
  };

  window.onmouseup = () => {
    isScratching = false;
  };

  scratchCanvas.onmousemove = (e) => {
    if (!isScratching) return;
    const pos = getPos(e);
    scratch(pos.x, pos.y);
  };

  // Touch support
  scratchCanvas.ontouchstart = (e) => {
    isScratching = true;
    const pos = getPos(e);
    scratch(pos.x, pos.y);
  };

  scratchCanvas.ontouchend = () => {
    isScratching = false;
  };

  scratchCanvas.ontouchmove = (e) => {
    if (!isScratching) return;
    const pos = getPos(e);
    scratch(pos.x, pos.y);
  };
}

function checkScratchProgress() {
  if (scratchedUnlocked) return;
  const imgData = scratchCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
  const totalPixels = imgData.data.length / 4;
  let clearPixels = 0;

  // Sample every 32nd pixel for performance
  for (let i = 3; i < imgData.data.length; i += 32) {
    if (imgData.data[i] === 0) {
      clearPixels++;
    }
  }

  const sampledTotal = totalPixels / 8;
  const pct = Math.min(100, Math.round((clearPixels / sampledTotal) * 100));
  document.getElementById('scratch-percent').textContent = `${pct}%`;

  if (pct > 50) {
    scratchedUnlocked = true;
    SoundFX.fanfare();
    launchConfetti(window.innerWidth / 2, window.innerHeight / 2, 80);
    // Auto-clear remainder smoothly
    scratchCtx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
    document.getElementById('scratch-percent').textContent = '100% Unlocked!';
  }
}

// ---------------------------------------------------------
// GAME 5: KAWAII MEMORY MATCH GAME 🧸
// ---------------------------------------------------------
const memoryGrid = document.getElementById('memory-grid');
const memoryMovesEl = document.getElementById('memory-moves');
const memoryMatchedEl = document.getElementById('memory-matched');
const memoryWinModal = document.getElementById('memory-win-modal');

const memoryItems = ['🎂', '🍓', '🐱', '🌹', '🎀', '🌷'];
let memoryCards = [];
let flippedCards = [];
let memoryMoves = 0;
let memoryMatches = 0;
let lockBoard = false;

function initMemoryGame() {
  if (!memoryGrid) return;
  memoryGrid.innerHTML = '';
  memoryMoves = 0;
  memoryMatches = 0;
  flippedCards = [];
  lockBoard = false;

  if (memoryMovesEl) memoryMovesEl.textContent = '0';
  if (memoryMatchedEl) memoryMatchedEl.textContent = '0';
  if (memoryWinModal) memoryWinModal.classList.add('hidden');

  // 6 pairs = 12 cards
  const deck = [...memoryItems, ...memoryItems];
  deck.sort(() => Math.random() - 0.5);

  memoryCards = deck.map((item, idx) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.setAttribute('data-value', item);

    const front = document.createElement('div');
    front.className = 'card-face card-front';
    front.textContent = '🌸';

    const back = document.createElement('div');
    back.className = 'card-face card-back';
    back.textContent = item;

    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener('click', () => handleCardClick(card));
    memoryGrid.appendChild(card);
    return card;
  });
}

function handleCardClick(card) {
  if (lockBoard) return;
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

  SoundFX.flip();
  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    memoryMoves++;
    if (memoryMovesEl) memoryMovesEl.textContent = memoryMoves;
    checkMemoryMatch();
  }
}

function checkMemoryMatch() {
  const [c1, c2] = flippedCards;
  const isMatch = c1.getAttribute('data-value') === c2.getAttribute('data-value');

  if (isMatch) {
    SoundFX.sparkle();
    c1.classList.add('matched');
    c2.classList.add('matched');
    flippedCards = [];
    memoryMatches++;
    if (memoryMatchedEl) memoryMatchedEl.textContent = memoryMatches;

    if (memoryMatches === 6) {
      setTimeout(() => {
        SoundFX.fanfare();
        triggerConfettiShower();
        if (memoryWinModal) memoryWinModal.classList.remove('hidden');
      }, 500);
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      c1.classList.remove('flipped');
      c2.classList.remove('flipped');
      flippedCards = [];
      lockBoard = false;
    }, 850);
  }
}

// =========================================================
// 12. FIVE SECRET GIFT BOXES (SECTION 10)
// =========================================================
const giftRevealModal = document.getElementById('gift-reveal-modal');
const modalGiftIcon = document.getElementById('modal-gift-icon');
const modalGiftTitle = document.getElementById('modal-gift-title');
const modalGiftContent = document.getElementById('modal-gift-content');

const giftData = {
  1: {
    icon: "💌",
    title: "A Sweet Love Note",
    body: "Nidhi, you are the warmest light in my life. Every day feels special simply because I get to know you, laugh with you, and cherish you. Happy Birthday, my love! 🌸"
  },
  2: {
    icon: "🐱",
    title: "Collectible Kawaii Sticker",
    body: "You unlocked the Official 'Birthday Kitten with Flowers' Sticker Badge! 🌷🐱 Wear it proudly as the sweetest girl in the universe!"
  },
  3: {
    icon: "😜",
    title: "A Little Birthday Laugh",
    body: "Doctor's Prescription for Nidhi on her Birthday: Minimum 5 slices of cake, zero chores, 100 cuddles, and laugh at all my jokes even when they are silly! 🍰"
  },
  4: {
    icon: "🎟️",
    title: "VIP Magic Voucher",
    body: "🌟 OFFICIAL BIRTHDAY GOLDEN PASS 🌟<br>Entitles Nidhi to: Unlimited Forehead Kisses, Midnight Ice Cream Runs & 100% Control of the Remote! Valid Forever ❤️"
  },
  5: {
    icon: "👑",
    title: "The Grand Birthday Blessing",
    body: "May this year ahead bring you every single opportunity you crave, boundless peace, glowing good health, and a love that never stops cheering for your dreams. You deserve everything, Nidhi! 💖✨"
  }
};

function openGiftBox(boxNum) {
  SoundFX.fanfare();
  const boxEl = document.getElementById(`gift-box-${boxNum}`);
  if (boxEl) {
    const rect = boxEl.getBoundingClientRect();
    launchConfetti(rect.left + rect.width / 2, rect.top, 50);
  }

  const data = giftData[boxNum];
  if (data && giftRevealModal) {
    modalGiftIcon.textContent = data.icon;
    modalGiftTitle.textContent = data.title;
    modalGiftContent.innerHTML = data.body;
    giftRevealModal.classList.remove('hidden');
  }
}

function closeGiftModal() {
  if (giftRevealModal) giftRevealModal.classList.add('hidden');
}

// =========================================================
// 13. GRAND FINALE CELEBRATION
// =========================================================
function launchGrandFireworks() {
  SoundFX.fanfare();
  const count = 5;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      launchConfetti(
        Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1,
        Math.random() * window.innerHeight * 0.5 + window.innerHeight * 0.15,
        70
      );
    }, i * 350);
  }
}

// =========================================================
// 14. INITIALIZATION
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  spawnAmbientParticles();
  initHeartsGameCanvas();
  renderQuizQuestion();
  spawnBalloonsWave();
});
