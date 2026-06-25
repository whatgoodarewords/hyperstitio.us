// HOUSE OF HYPERSTITION — INTERACTIONS

class HyperstitionExperience {
  constructor() {
    this.heroConcept = document.getElementById('heroConcept');

    // exact list from the brackets in your doc
    this.concepts = [
      'art',
      'intelligence',
      'embodiment',
      'contemplation',
      'research',
      'play',
      'emergence',
      'open world building',
      'cultural renewal',
      'cultural evolution'
    ];

    this.currentConceptIndex = 0;
    this.heroTimer = null;
    this.isVisible = true;
    this.rotatingElements = [];
    this.flashingElements = [];
    this.sequenceElements = [];

    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupInteractions();
    this.setupPerformanceOptimizations();
    this.setupDynamicText();
    this.setupHeroTitleSequence();

    // start the hero rotator after fonts settle
    setTimeout(() => {
      this.startHeroCycling();
    }, 800);
  }

  setupHeroTitleSequence() {
    const title = document.querySelector('.architectural-title');
    if (!title) return;

    title.classList.add('js-controlled');
    const lines = title.querySelectorAll('.title-line');
    if (!lines.length) return;

    const baseDelayMs = 100;
    const stepDelayMs = 380;

    lines.forEach((line, index) => {
      const delay = baseDelayMs + index * stepDelayMs;
      setTimeout(() => {
        line.classList.add('reveal');
      }, delay);
    });
  }

  // === DYNAMIC TEXT SETUP ===
  setupDynamicText() {
    // Setup conveyor (infinite scroll)
    document.querySelectorAll('.manifesto-conveyor').forEach(el => {
      const words = JSON.parse(el.getAttribute('data-words') || '[]');
      if (words.length > 0) {
        this.setupConveyor(el, words);
      }
    });

    // Setup rotating phrases (smooth transitions)
    document.querySelectorAll('.rotating-phrase').forEach(el => {
      const words = JSON.parse(el.getAttribute('data-words') || '[]');
      if (words.length > 0) {
        this.rotatingElements.push({ el, words, index: 0 });
        el.textContent = words[0];
        this.startRotation(el, words);
      }
    });

    // Setup vertical roll (mechanical display effect)
    document.querySelectorAll('.vertical-roll').forEach(el => {
      const words = JSON.parse(el.getAttribute('data-words') || '[]');
      if (words.length > 0) {
        el.textContent = words[0];
        this.startVerticalRoll(el, words);
      }
    });

    // Setup flashing phrases (fade in/out with word changes)
    document.querySelectorAll('.flashing-phrase').forEach(el => {
      const words = JSON.parse(el.getAttribute('data-words') || '[]');
      if (words.length > 0) {
        this.flashingElements.push({ el, words, index: 0 });
        el.textContent = words[0];
        this.startFlashing(el, words);
      }
    });

    // Setup sequences (cycle through in order with arrow)
    document.querySelectorAll('.flashing-sequence').forEach(el => {
      const words = JSON.parse(el.getAttribute('data-words') || '[]');
      if (words.length > 0) {
        this.sequenceElements.push({ el, words, index: 0 });
        el.textContent = words[0] + ' →';
        this.startSequence(el, words);
      }
    });
  }

  setupConveyor(element, words) {
    const track = element.querySelector('.conveyor-track');
    if (!track) return;

    // Build the conveyor track HTML with many repeated words for seamless loop
    let spans = '';

    // Create the word sequence - repeat twice for seamless loop
    const doubledWords = [...words, ...words];

    // Repeat many times to ensure smooth coverage across the viewport
    for (let i = 0; i < 8; i++) {
      doubledWords.forEach(word => {
        spans += `<span>${word}</span>`;
      });
    }

    track.innerHTML = spans;

    // Force a reflow and start animation with delay
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        track.classList.add('animate');
      });
    });
  }

  startRotation(element, words) {
    let index = 0;
    setInterval(() => {
      if (!this.isVisible) return;

      this.fadeElement(element, 'out', 150).then(() => {
        index = (index + 1) % words.length;
        element.textContent = words[index];
        this.fadeElement(element, 'in', 150);
      });
    }, 1000); // Change every 1 second
  }

  startFlashing(element, words) {
    let index = 0;
    setInterval(() => {
      if (!this.isVisible) return;

      index = (index + 1) % words.length;
      element.textContent = words[index];
    }, 600); // Change every 0.6 seconds
  }

  startSequence(element, words) {
    let index = 0;
    setInterval(() => {
      if (!this.isVisible) return;

      this.fadeElement(element, 'out', 100).then(() => {
        index = (index + 1) % words.length;
        element.textContent = words[index] + ' →';
        this.fadeElement(element, 'in', 100);
      });
    }, 500); // Quick transitions every 0.5 seconds
  }

  startVerticalRoll(element, words) {
    let index = 0;
    setInterval(() => {
      if (!this.isVisible) return;

      index = (index + 1) % words.length;
      element.textContent = words[index];
    }, 700); // Change every 0.7 seconds
  }

  // === HERO WORD ROTATION (interval + quick crossfade) ===
  startHeroCycling() {
    if (!this.heroConcept || !this.concepts.length) return;

    // show initial word
    this.heroConcept.textContent = this.concepts[this.currentConceptIndex];
    this.heroConcept.style.opacity = '1';

    // rotate ~every 1.5 seconds (50% slower)
    this.heroTimer = setInterval(() => {
      if (!this.isVisible) return; // pause when tab hidden
      this.fadeElement(this.heroConcept, 'out', 120).then(() => {
        this.currentConceptIndex = (this.currentConceptIndex + 1) % this.concepts.length;
        this.heroConcept.textContent = this.concepts[this.currentConceptIndex];
        this.fadeElement(this.heroConcept, 'in', 120);
      });
    }, 1500);
  }

  stopHeroCycling() {
    if (this.heroTimer) clearInterval(this.heroTimer);
    this.heroTimer = null;
  }

  fadeElement(element, direction, duration = 200) {
    return new Promise((resolve) => {
      const targetOpacity = direction === 'out' ? 0 : 1;
      element.style.transition = `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
      element.style.opacity = targetOpacity;
      setTimeout(resolve, duration);
    });
  }

  // === SCROLL-IN ANIMATIONS ===
  setupScrollAnimations() {
    const observerOptions = { threshold: 0.1, rootMargin: '-5% 0px -5% 0px' };
    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) this.animateBlock(entry.target);
      });
    }, observerOptions);

    document.querySelectorAll('.block').forEach((block) => {
      this.scrollObserver.observe(block);
    });
  }

  animateBlock(block) {
    if (block.classList.contains('block-manifesto')) {
      this.animateManifestoLines(block);
    } else if (block.classList.contains('block-purpose')) {
      this.animatePurposeItems(block);
    } else if (block.classList.contains('block-triads')) {
      this.animateTriads(block);
    }
  }

  animateManifestoLines(block) {
    const lines = block.querySelectorAll('.manifesto-line');
    lines.forEach((line, i) => {
      setTimeout(() => {
        line.style.transform = 'translateX(0)';
        line.style.opacity = '1';
      }, i * 200);
    });
  }

  animatePurposeItems(block) {
    const items = block.querySelectorAll('.purpose-item');
    items.forEach((item, i) => {
      setTimeout(() => {
        item.style.transform = 'translateY(0) scale(1)';
        item.style.opacity = '1';
      }, i * 100);
    });
  }

  animateTriads(block) {
    const groups = block.querySelectorAll('.triad-group');
    groups.forEach((group, i) => {
      setTimeout(() => {
        group.style.transform = 'translateY(0)';
        group.style.opacity = '1';
      }, i * 300);
    });
  }


  // === HOVER INTERACTIONS ===
  setupInteractions() {
    document.querySelectorAll('.purpose-item').forEach((item) => {
      item.addEventListener('mouseenter', () => this.handlePurposeHover(item, true));
      item.addEventListener('mouseleave', () => this.handlePurposeHover(item, false));
    });

    document.querySelectorAll('.space-item').forEach((item) => {
      item.addEventListener('mouseenter', () => this.handleSpaceHover(item, true));
      item.addEventListener('mouseleave', () => this.handleSpaceHover(item, false));
    });

    document.querySelectorAll('.roi-item').forEach((item) => {
      item.addEventListener('mouseenter', () => this.handleRoiHover(item, true));
      item.addEventListener('mouseleave', () => this.handleRoiHover(item, false));
    });
  }

  handlePurposeHover(item, on) {
    if (on) {
      item.style.transform = 'translateY(-5px) scale(1.02)';
      item.style.borderColor = '#fff';
      item.style.boxShadow = '0 10px 30px rgba(255,255,255,0.1)';
    } else {
      item.style.transform = 'translateY(0) scale(1)';
      item.style.borderColor = '#333';
      item.style.boxShadow = 'none';
    }
  }

  handleSpaceHover(item, on) {
    item.style.transform = on ? 'translateY(-3px)' : 'translateY(0)';
    item.style.borderColor = on ? '#fff' : '#333';
  }

  handleRoiHover(item, on) {
    item.style.transform = on ? 'translateY(-3px)' : 'translateY(0)';
    item.style.borderColor = on ? '#666' : '#333';
  }

  // === PERF & PAGE LIFECYCLE ===
  setupPerformanceOptimizations() {
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
    });

    // throttle scroll for any future handlers
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  handleScroll() {
    // placeholder for additional scroll-based effects
  }
}

// === BOOT ===
document.addEventListener('DOMContentLoaded', () => {
  // Normalize URL by hiding trailing index.html
  try {
    const path = window.location.pathname;
    if (path.toLowerCase().endsWith('/index.html')) {
      const newPath = path.slice(0, -('/index.html'.length)) || '/';
      const newUrl = newPath + window.location.search + window.location.hash;
      window.history.replaceState(null, '', newUrl);
    }
  } catch (e) {}

  // wait for fonts for nicer first paint
  const start = () => new HyperstitionExperience();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
  } else {
    setTimeout(start, 300);
  }
});

// === LIGHTBOX FOR IMAGES AND VIDEOS ===
function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  let currentImageIndex = 0;
  let allImages = [];
  let currentVideo = null;

  // Collect all clickable images
  document.querySelectorAll('img').forEach(img => {
    // Skip carousel navigation buttons or other non-content images
    if (!img.classList.contains('carousel-button')) {
      allImages.push(img);
    }
  });

  // Add click event to all images
  allImages.forEach((img, index) => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      currentImageIndex = index;
      closeVideo();
      lightbox.style.display = 'block';
      lightboxImg.style.display = 'block';
      lightboxImg.src = img.src;
    });
  });

  // Add click event to all journey videos
  document.querySelectorAll('.journey-video').forEach(video => {
    video.addEventListener('click', (e) => {
      e.stopPropagation();
      openVideoInLightbox(video.getAttribute('data-video-src'));
    });
  });

  function openVideoInLightbox(videoSrc) {
    closeVideo();
    lightbox.style.display = 'block';
    lightboxImg.style.display = 'none';

    // Create video element
    currentVideo = document.createElement('video');
    currentVideo.id = 'lightbox-video';
    currentVideo.controls = true;
    currentVideo.autoplay = true;
    currentVideo.style.maxHeight = '90vh';
    currentVideo.style.maxWidth = '90vw';
    currentVideo.style.position = 'absolute';
    currentVideo.style.top = '50%';
    currentVideo.style.left = '50%';
    currentVideo.style.transform = 'translate(-50%, -50%)';
    currentVideo.style.border = '2px solid #666';

    const source = document.createElement('source');
    source.src = videoSrc;
    source.type = 'video/mp4';
    currentVideo.appendChild(source);

    lightbox.appendChild(currentVideo);
  }

  function closeVideo() {
    if (currentVideo) {
      currentVideo.pause();
      currentVideo.remove();
      currentVideo = null;
    }
  }

  // Navigate to previous image
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeVideo();
    currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
    lightboxImg.style.display = 'block';
    lightboxImg.src = allImages[currentImageIndex].src;
  });

  // Navigate to next image
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeVideo();
    currentImageIndex = (currentImageIndex + 1) % allImages.length;
    lightboxImg.style.display = 'block';
    lightboxImg.src = allImages[currentImageIndex].src;
  });

  // Close lightbox when clicking on background (not on image or buttons)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeVideo();
      lightbox.style.display = 'none';
    }
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeVideo();
    lightbox.style.display = 'none';
  });

  // Close on escape key, navigate with arrow keys
  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'block') {
      if (e.key === 'Escape') {
        closeVideo();
        lightbox.style.display = 'none';
      } else if (e.key === 'ArrowLeft') {
        closeVideo();
        currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
        lightboxImg.style.display = 'block';
        lightboxImg.src = allImages[currentImageIndex].src;
      } else if (e.key === 'ArrowRight') {
        closeVideo();
        currentImageIndex = (currentImageIndex + 1) % allImages.length;
        lightboxImg.style.display = 'block';
        lightboxImg.src = allImages[currentImageIndex].src;
      }
    }
  });
}

// Setup all journey videos to ensure playback in Chrome
function setupJourneyVideos() {
  // Setup all journey videos
  document.querySelectorAll('.journey-video').forEach(video => {
    // Ensure desired attributes/properties
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('preload', 'auto');

    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.volume = 0;

    // Force play when metadata is loaded (Chrome requirement)
    video.addEventListener('loadedmetadata', () => {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.catch(() => {
          // Autoplay was prevented, user interaction required
          console.log('Video autoplay prevented, user interaction needed');
        });
      }
    });
  });

  // Special handling for wide video (seek to 2 seconds)
  const wideVideo = document.querySelector('.journey-video.journey-video-wide');
  if (wideVideo) {
    wideVideo.setAttribute('loop', '');
    wideVideo.loop = true;

    const seekToTwoSeconds = () => {
      try {
        if (wideVideo.currentTime < 1.9) {
          wideVideo.currentTime = 2;
        }
      } catch (e) {
        // no-op
      }
    };

    wideVideo.addEventListener('loadedmetadata', () => {
      seekToTwoSeconds();
    });

    wideVideo.addEventListener('play', seekToTwoSeconds);
  }
}

// Password-protected investment section
function setupInvestmentSection() {
  const trigger = document.getElementById('investmentTrigger');
  const content = document.getElementById('investmentContent');
  const PASSWORD = 'renaissance';

  if (!trigger || !content) return;

  // Ensure content starts hidden
  content.classList.remove('visible');

  trigger.addEventListener('click', () => {
    if (!content.classList.contains('visible')) {
      // Prompt for password
      const input = prompt('Enter password to view investment details:');
      if (input && input.toLowerCase() === PASSWORD) {
        expandContent();
      } else if (input !== null) {
        alert('Incorrect password');
      }
    } else {
      // Collapse
      collapseContent();
    }
  });

  function expandContent() {
    content.classList.add('visible');
    trigger.querySelector('.trigger-arrow').textContent = '↓';
    // Smooth scroll to show content
    setTimeout(() => {
      trigger.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  function collapseContent() {
    content.classList.remove('visible');
    trigger.querySelector('.trigger-arrow').textContent = '→';
  }
}

// subtle parallax on hero after load
window.addEventListener('load', () => {
  setupLightbox();
  setupJourneyVideos();
  setupInvestmentSection();
  const hero = document.querySelector('.block-hero');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const rate = window.pageYOffset * -0.3;
    hero.style.transform = `translateY(${rate}px)`;
  });

  // smooth transitions for interactive elements
  document.querySelectorAll('a, button, [role="button"]').forEach((el) => {
    el.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
  });
});
