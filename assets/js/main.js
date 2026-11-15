document.addEventListener("DOMContentLoaded", () => {
  initAboutCarousel();
  initSkillsSection();
  initPortfolioAutoCarousel();
  initProjectModal();
  initContactForm();
  initServiceDropdown();
  initMobileNavClose();
});

/**
 * Interactive slide & expand animation for the About Me card (inspired by vide.mp4).
 */
function initAboutCarousel() {
  const card = document.getElementById("aboutRamonCard");
  const leftContent = document.getElementById("aboutLeftContent");
  const rightContent = document.getElementById("aboutRightContent");
  const photoTrack = document.getElementById("aboutPhotoTrack");
  const titleEl = document.getElementById("aboutSlideTitle");
  const subEl = document.getElementById("aboutSlideSub");
  const mobileDescEl = document.getElementById("aboutMobileDesc");
  const numEl = document.getElementById("aboutSlideNum");
  const rightLabelEl = document.getElementById("aboutRightLabel");
  const rightTextEl = document.getElementById("aboutRightText");
  const detailCopyEl = document.getElementById("aboutDetailCopy");
  const detailBadgesEl = document.getElementById("aboutDetailBadges");
  const prevBtn = document.getElementById("aboutPrevBtn");
  const nextBtn = document.getElementById("aboutNextBtn");
  const expandBtn = document.getElementById("aboutExpandBtn");
  const backBtn = document.getElementById("aboutBackBtn");
  const itemRows = document.querySelectorAll("#aboutItemList li");
  const detailTabs = document.querySelectorAll("#aboutDetailPanel .detail-tab");

  if (!card || !prevBtn || !nextBtn) return;

  const slides = [
    {
      num: "01",
      titleHtml: "Crafting<br />Clean Code<br /><strong>Always.</strong>",
      sub: "design a simple web / by alexpratama.dev",
      label: "ABSTRACT",
      text: "I'm a web developer and UI designer focused on turning complex ideas into fast, responsive, and clean digital products.",
      tabs: {
        overview:
          "Over 3 years of hands-on experience crafting responsive landing pages, company profiles, and modern web interfaces with clean visual hierarchy.",
        stack:
          "Primary stack includes semantic HTML5, modern CSS3 Flexbox/Grid, Bootstrap 5, and vanilla JavaScript ES6+.",
        focus:
          "Focused on accessible markup, fast loading speed, and pixel-accurate responsive layouts across desktop and mobile.",
      },
      badges: ["HTML5 & CSS3", "Bootstrap 5", "Responsive UI", "Clean Code"],
    },
    {
      num: "02",
      titleHtml: "Building<br />Interfaces<br /><strong>That Scale.</strong>",
      sub: "frontend & ui engineering / 3+ years",
      label: "EXPERIENCE",
      text: "From Figma wireframes to production-ready Bootstrap layouts, I bridge visual design with structured, maintainable code.",
      tabs: {
        overview:
          "Collaborated on 15+ web projects including e-commerce catalogs, interactive dashboards, and campus event portals.",
        stack:
          "Comfortable converting Figma design systems into modular Bootstrap components and clean interactive JavaScript.",
        focus:
          "Prioritizing consistent spacing, smooth micro-interactions, and maintainable frontend structure.",
      },
      badges: ["JavaScript ES6+", "Figma to Code", "Dashboard UI", "Performance"],
    },
    {
      num: "03",
      titleHtml: "Always<br />Learning<br /><strong>New Tech.</strong>",
      sub: "informatics & fullstack web / indonesia",
      label: "EDUCATION & STACK",
      text: "Combining Informatics fundamentals with practical fullstack development using PHP, Laravel, and relational databases.",
      tabs: {
        overview:
          "Pursuing Informatics engineering while building fullstack web applications and exploring modern UI/UX design patterns.",
        stack:
          "Experienced with PHP, Laravel MVC, MySQL database modeling, and Git/GitHub version control.",
        focus:
          "Bridging clean frontend presentation with reliable, structured backend logic.",
      },
      badges: ["PHP & Laravel", "MySQL", "Git & GitHub", "UI/UX Design"],
    },
  ];

  let currentIndex = 0;
  let currentTab = "overview";

  function updateDetailTabContent() {
    const slide = slides[currentIndex];
    if (!slide || !detailCopyEl) return;
    detailCopyEl.textContent = slide.tabs[currentTab] || slide.tabs.overview;
  }

  function renderSlide(index, animate = true) {
    const slide = slides[index];
    if (!slide) return;

    if (photoTrack) {
      photoTrack.style.transform = `translateX(-${index * 100}%)`;
    }

    const applyContent = () => {
      numEl.textContent = slide.num;
      titleEl.innerHTML = slide.titleHtml;
      subEl.textContent = slide.sub;
      if (mobileDescEl) mobileDescEl.textContent = slide.text;
      rightLabelEl.textContent = slide.label;
      rightTextEl.textContent = slide.text;
      updateDetailTabContent();

      detailBadgesEl.innerHTML = "";
      slide.badges.forEach((badgeText) => {
        const span = document.createElement("span");
        span.className = "detail-badge";
        span.textContent = badgeText;
        detailBadgesEl.appendChild(span);
      });

      itemRows.forEach((row, idx) => {
        row.classList.toggle("active", idx === index);
      });
    };

    if (!animate) {
      applyContent();
      return;
    }

    leftContent.classList.add("is-sliding");
    rightContent.classList.add("is-sliding");

    setTimeout(() => {
      applyContent();
      leftContent.classList.remove("is-sliding");
      rightContent.classList.remove("is-sliding");
    }, 240);
  }

  detailTabs.forEach((tabBtn) => {
    tabBtn.addEventListener("click", () => {
      detailTabs.forEach((btn) => btn.classList.remove("active"));
      tabBtn.classList.add("active");
      currentTab = tabBtn.dataset.tab || "overview";
      updateDetailTabContent();
    });
  });

  let aboutTimerId = null;

  function startAboutAuto() {
    stopAboutAuto();
    aboutTimerId = window.setInterval(() => {
      if (card.classList.contains("is-expanded")) return;
      currentIndex = (currentIndex + 1) % slides.length;
      renderSlide(currentIndex, true);
    }, 2000);
  }

  function stopAboutAuto() {
    if (aboutTimerId !== null) {
      window.clearInterval(aboutTimerId);
      aboutTimerId = null;
    }
  }

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    renderSlide(currentIndex, true);
    startAboutAuto();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    renderSlide(currentIndex, true);
    startAboutAuto();
  });

  expandBtn.addEventListener("click", () => {
    renderSlide(currentIndex, false);
    card.classList.add("is-expanded");
    stopAboutAuto();
  });

  backBtn.addEventListener("click", () => {
    card.classList.remove("is-expanded");
    startAboutAuto();
  });

  itemRows.forEach((row) => {
    row.addEventListener("click", () => {
      const targetIndex = Number(row.dataset.slideTarget);
      if (!Number.isNaN(targetIndex)) {
        currentIndex = targetIndex;
        renderSlide(currentIndex, true);
        card.classList.add("is-expanded");
        stopAboutAuto();
      }
    });
  });

  card.addEventListener("mouseenter", stopAboutAuto);
  card.addEventListener("mouseleave", () => {
    if (!card.classList.contains("is-expanded")) startAboutAuto();
  });
  card.addEventListener("focusin", stopAboutAuto);
  card.addEventListener("focusout", () => {
    if (!card.classList.contains("is-expanded")) startAboutAuto();
  });

  renderSlide(0, false);
  startAboutAuto();
}

/**
 * Populate and open Bootstrap modal when clicking project cards.
 */
function initProjectModal() {
  const modalElement = document.getElementById("projectModal");
  if (!modalElement || typeof bootstrap === "undefined") return;

  const projectModal = new bootstrap.Modal(modalElement);
  const titleEl = document.getElementById("projectModalLabel");
  const categoryEl = document.getElementById("modalCategory");
  const descEl = document.getElementById("modalDescription");
  const stackEl = document.getElementById("modalStack");

  document.querySelectorAll(".project-detail-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      titleEl.textContent = btn.dataset.title || "";
      categoryEl.textContent = btn.dataset.category || "";
      descEl.textContent = btn.dataset.desc || "";
      stackEl.textContent = btn.dataset.stack || "";
      projectModal.show();
    });
  });
}

/**
 * Handle static contact form validation inside Hire Me modal and inline contact section.
 */
function initContactForm() {
  const bindForm = (formId, nameId, emailId, msgId, feedbackId) => {
    const form = document.getElementById(formId);
    const feedback = document.getElementById(feedbackId);
    if (!form || !feedback) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById(nameId).value.trim();
      const email = document.getElementById(emailId).value.trim();
      const message = document.getElementById(msgId).value.trim();

      feedback.classList.remove("d-none", "text-danger", "text-success");

      if (!name || !email || !message) {
        feedback.textContent = "Please fill in your name, email, and message.";
        feedback.classList.add("text-danger");
        return;
      }

      feedback.textContent = `Thanks, ${name}! Your message has been sent.`;
      feedback.classList.add("text-success");
      form.reset();
    });
  };

  bindForm("contactForm", "senderName", "senderEmail", "senderMessage", "formFeedback");
  bindForm(
    "editorialContactForm",
    "edFirstName",
    "edEmail",
    "edProjectDesc",
    "edFormFeedback"
  );
}

/**
 * Custom editorial dropdown for Service field on contact.html.
 */
function initServiceDropdown() {
  const dropdown = document.getElementById("serviceDropdown");
  const trigger = document.getElementById("serviceDropdownBtn");
  const label = document.getElementById("serviceDropdownLabel");
  const hiddenInput = document.getElementById("edService");
  if (!dropdown || !trigger || !label || !hiddenInput) return;

  const items = dropdown.querySelectorAll(".service-dropdown-item");

  const closeMenu = () => {
    dropdown.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
  };

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = dropdown.classList.toggle("is-open");
    trigger.setAttribute("aria-expanded", String(isOpen));
  });

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const val = item.dataset.value || "";
      hiddenInput.value = val;
      label.textContent = val;

      items.forEach((el) => {
        const selected = el === item;
        el.classList.toggle("is-selected", selected);
        el.setAttribute("aria-selected", String(selected));
      });
      closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      closeMenu();
    }
  });
}

/**
 * Collapse mobile navbar after clicking a navigation link.
 */
function initMobileNavClose() {
  const navbarCollapse = document.getElementById("mainNavbar");
  if (!navbarCollapse || typeof bootstrap === "undefined") return;

  navbarCollapse.querySelectorAll("a.nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      const instance = bootstrap.Collapse.getInstance(navbarCollapse);
      if (instance) {
        instance.hide();
      }
    });
  });
}

/**
 * Interactive stack filter, experience highlight, and mobile tab switch for Skills section.
 */
function initSkillsSection() {
  const filterBtns = document.querySelectorAll(".stack-filter-btn");
  const orbitBox = document.getElementById("skillsOrbitBox");
  const orbitChips = document.querySelectorAll(".orbit-chip");
  const orbitCoreWrap = document.getElementById("orbitCoreWrap");
  const orbitCore = document.getElementById("orbitCore");
  const orbitCoreTitle = document.getElementById("orbitCoreTitle");
  const orbitCoreSub = document.getElementById("orbitCoreSub");
  const orbitCoreImg = document.getElementById("orbitCoreImg");
  const orbitCoreName = document.getElementById("orbitCoreName");
  const orbitCoreCat = document.getElementById("orbitCoreCat");

  const coreFilterStates = {
    all: { title: "AP", sub: "ALL STACK", wide: false },
    fe: { title: "FE", sub: "FRONTEND", wide: false },
    be: { title: "BE", sub: "BACKEND", wide: false },
    tools: { title: "TOOLS", sub: "WORKFLOW", wide: true },
  };
  let activeCategory = "all";
  let pinnedChip = null;
  let hoveredInteractive = false;
  let switchCleanupTimer = null;

  function applyCoreFilterState() {
    const state = coreFilterStates[activeCategory] || coreFilterStates.all;
    if (orbitCoreTitle) orbitCoreTitle.textContent = state.title;
    if (orbitCoreSub) orbitCoreSub.textContent = state.sub;
    if (orbitCore) orbitCore.classList.toggle("is-wide-label", state.wide);
  }

  function showCorePreview(chip) {
    if (!chip || !orbitCore || !orbitCoreImg || !orbitCoreName || !orbitCoreCat) return;
    const iconEl = chip.querySelector(".stack-logo-svg");
    const skillName = chip.dataset.skillName || "";
    const skillLabel = chip.dataset.skillLabel || "";

    if (iconEl) {
      orbitCoreImg.src = iconEl.getAttribute("src") || "";
      orbitCoreImg.alt = skillName;
    }
    orbitCoreName.textContent = skillName;
    orbitCoreCat.textContent = skillLabel;
    orbitCore.classList.add("is-previewing");
  }

  function resetCorePreview() {
    if (orbitCore) orbitCore.classList.remove("is-previewing");
    applyCoreFilterState();
  }

  applyCoreFilterState();

  if (orbitCore) {
    orbitCore.addEventListener("mouseenter", () => {
      hoveredInteractive = true;
    });
    orbitCore.addEventListener("mouseleave", () => {
      hoveredInteractive = false;
    });
  }

  if (orbitChips.length) {
    orbitChips.forEach((chip) => {
      chip.addEventListener("mouseenter", () => {
        hoveredInteractive = true;
        showCorePreview(chip);
      });

      chip.addEventListener("mouseleave", () => {
        hoveredInteractive = false;
        if (pinnedChip) {
          showCorePreview(pinnedChip);
        } else {
          resetCorePreview();
        }
      });

      chip.addEventListener("focus", () => {
        showCorePreview(chip);
      });

      chip.addEventListener("blur", () => {
        if (!pinnedChip) {
          resetCorePreview();
        }
      });

      chip.addEventListener("click", (event) => {
        event.stopPropagation();
        const isSame = pinnedChip === chip;

        orbitChips.forEach((c) => c.classList.remove("is-selected"));
        if (isSame) {
          pinnedChip = null;
          chip.blur();
          if (orbitBox) orbitBox.classList.remove("is-paused");
          resetCorePreview();
        } else {
          pinnedChip = chip;
          chip.classList.add("is-selected");
          if (orbitBox) orbitBox.classList.add("is-paused");
          showCorePreview(chip);
        }
      });
    });

    if (orbitBox) {
      orbitBox.addEventListener("click", (event) => {
        if (!event.target.closest(".orbit-chip") && pinnedChip) {
          orbitChips.forEach((c) => c.classList.remove("is-selected"));
          pinnedChip = null;
          orbitBox.classList.remove("is-paused");
          resetCorePreview();
        }
      });
    }
  }

  const orbitController = setupEllipticalOrbitController(orbitBox, () => {
    const hasKeyboardFocus = Boolean(orbitBox && orbitBox.querySelector(".orbit-chip:focus-visible"));
    return Boolean(pinnedChip || hoveredInteractive || hasKeyboardFocus);
  });

  function playTabSwitchFX(nextCategory) {
    if (switchCleanupTimer) {
      clearTimeout(switchCleanupTimer);
    }

    if (orbitBox) orbitBox.classList.add("is-switching-tabs");

    if (orbitCoreWrap) {
      orbitCoreWrap.classList.remove("is-switching");
      void orbitCoreWrap.offsetWidth;
      orbitCoreWrap.classList.add("is-switching");
    }

    if (orbitCore) {
      orbitCore.classList.remove("is-morphing");
      void orbitCore.offsetWidth;
      orbitCore.classList.add("is-morphing");
    }

    let matchCounter = 0;
    orbitChips.forEach((chip, idx) => {
      chip.classList.remove("is-entering");
      const match = nextCategory === "all" || chip.dataset.stackCat === nextCategory;
      const delayMs = match ? (matchCounter % 8) * 24 : (idx % 6) * 16;
      chip.style.setProperty("--switch-delay", `${delayMs}ms`);
      if (match) {
        matchCounter += 1;
        void chip.offsetWidth;
        chip.classList.add("is-entering");
      }
    });

    if (orbitController) {
      orbitController.triggerImpulse();
    }

    switchCleanupTimer = setTimeout(() => {
      if (orbitBox) orbitBox.classList.remove("is-switching-tabs");
      if (orbitCoreWrap) orbitCoreWrap.classList.remove("is-switching");
      if (orbitCore) orbitCore.classList.remove("is-morphing");
      orbitChips.forEach((chip) => {
        chip.classList.remove("is-entering");
        chip.style.removeProperty("--switch-delay");
      });
    }, 680);
  }

  if (filterBtns.length && orbitChips.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const nextCategory = btn.dataset.stack || "all";
        activeCategory = nextCategory;
        filterBtns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");

        orbitChips.forEach((chip) => {
          chip.classList.remove("is-selected");
          const match = activeCategory === "all" || chip.dataset.stackCat === activeCategory;
          chip.classList.toggle("is-highlighted", activeCategory !== "all" && match);
          chip.classList.toggle("is-dimmed", activeCategory !== "all" && !match);
        });

        pinnedChip = null;
        if (orbitBox) orbitBox.classList.remove("is-paused");
        resetCorePreview();
        playTabSwitchFX(activeCategory);
      });
    });
  }
}

/**
 * Solves 4 concentric ring radii with equal visual edge-to-edge gap along a half-axis.
 */
function solveRingRadii(coreR, orbSizes, rMax) {
  const occupied = coreR + orbSizes[0] + orbSizes[1] + orbSizes[2] + orbSizes[3] / 2;
  const freePerGap = (rMax - occupied) / 4;
  const radii = [];
  let prevEdge = coreR;

  for (let i = 0; i < 4; i += 1) {
    const center = prevEdge + freePerGap + orbSizes[i] / 2;
    radii.push(center);
    prevEdge = center + orbSizes[i] / 2;
  }
  return radii;
}

/**
 * Dynamically fits the 4-ring constellation across the full container as an ellipse
 * (wide on desktop, contained tall oval on mobile) while keeping all 50 circular orbs upright.
 */
function setupEllipticalOrbitController(orbitBox, isInteractionPaused) {
  if (!orbitBox) return null;
  const orbitStage = orbitBox.querySelector(".orbit-stage");
  if (!orbitStage) return null;

  const ringConfigs = [
    { key: "ring1", speedDegPerSec: 360 / 28 },
    { key: "ring2", speedDegPerSec: -360 / 40 },
    { key: "ring3", speedDegPerSec: 360 / 54 },
    { key: "ring4", speedDegPerSec: -360 / 72 },
  ];

  const rings = ringConfigs
    .map((cfg) => {
      const rotator = orbitStage.querySelector(`.orbit-rotator--${cfg.key}`);
      const track = orbitStage.querySelector(`.orbit-track--${cfg.key}`);
      if (!rotator) return null;

      const anchors = Array.from(rotator.querySelectorAll(".orbit-anchor")).map((el) => {
        const angleMatch = (el.getAttribute("style") || "").match(/--angle:\s*([-\d.]+)deg/);
        const deg = angleMatch ? parseFloat(angleMatch[1]) : 0;
        return { el, baseRad: (deg * Math.PI) / 180 };
      });

      return {
        ...cfg,
        track,
        anchors,
        rx: 120,
        ry: 90,
        offsetRad: 0,
      };
    })
    .filter(Boolean);

  if (!rings.length) return null;
  orbitBox.classList.add("is-elliptical");

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let isInViewport = true;
  let lastFrameTime = performance.now();
  let impulseEnergy = 0;

  function renderRingPositions() {
    for (let r = 0; r < rings.length; r += 1) {
      const ring = rings[r];
      const anchors = ring.anchors;
      for (let i = 0; i < anchors.length; i += 1) {
        const item = anchors[i];
        const theta = item.baseRad + ring.offsetRad;
        const x = ring.rx * Math.cos(theta);
        const y = ring.ry * Math.sin(theta);
        item.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      }
    }
  }

  function computeEllipseLayout() {
    const isMobileGrid = window.innerWidth < 768;
    orbitBox.classList.toggle("is-mobile-grid", isMobileGrid);
    if (isMobileGrid) {
      orbitBox.style.removeProperty("--core-size");
      for (let i = 1; i <= 4; i += 1) {
        orbitBox.style.removeProperty(`--orb-${i}`);
      }
      for (let r = 0; r < rings.length; r += 1) {
        if (rings[r].track) {
          rings[r].track.style.removeProperty("width");
          rings[r].track.style.removeProperty("height");
        }
      }
      return;
    }

    const rawW = orbitStage.clientWidth;
    const rawH = orbitStage.clientHeight;
    const viewportSafeW = Math.max(240, document.documentElement.clientWidth - 20);
    const stageW = Math.min(rawW, viewportSafeW);
    const stageH = rawH;
    if (stageW < 80 || stageH < 80) return;

    const minDim = Math.min(stageW, stageH);
    const isNarrow = stageW < 560;

    let coreSize = isNarrow
      ? Math.round(Math.max(54, Math.min(72, stageW * 0.175)))
      : Math.round(Math.max(82, Math.min(116, stageH * 0.165)));

    let baseOrb = isNarrow
      ? Math.round(Math.max(24, Math.min(31, stageW * 0.076)))
      : Math.round(Math.max(36, Math.min(50, stageH * 0.072)));

    const approxCoreR = coreSize / 2;
    const minorLimit = isNarrow ? stageW / 2 - 22 : Math.min(stageH / 2 - 26, stageW / 2 - 24);
    const safeOrbCap = Math.max(22, Math.floor((minorLimit - approxCoreR - 18) / 4.2));
    baseOrb = Math.min(baseOrb, safeOrbCap);

    if (coreSize > minDim * 0.24) {
      coreSize = Math.max(54, Math.round(minDim * 0.19));
    }

    const orbSizes = [baseOrb, baseOrb + 1, baseOrb + 3, baseOrb + 5];
    const coreRadius = coreSize / 2;
    const outerMargin = orbSizes[3] / 2 + (isNarrow ? 6 : 8);

    const ryAvail = Math.max(115, stageH / 2 - outerMargin);
    const rxAvail = Math.max(110, stageW / 2 - outerMargin);

    let rx4;
    let ry4;
    if (stageW >= stageH) {
      ry4 = ryAvail;
      rx4 = Math.min(rxAvail, ry4 * 2.3);
    } else {
      rx4 = rxAvail;
      ry4 = Math.min(ryAvail, rx4 * 1.48);
    }

    const rxList = solveRingRadii(coreRadius, orbSizes, rx4);
    const ryList = solveRingRadii(coreRadius, orbSizes, ry4);

    rings.forEach((ring, idx) => {
      ring.rx = rxList[idx];
      ring.ry = ryList[idx];
      if (ring.track) {
        ring.track.style.width = `${(ring.rx * 2).toFixed(1)}px`;
        ring.track.style.height = `${(ring.ry * 2).toFixed(1)}px`;
      }
    });

    orbitBox.style.setProperty("--core-size", `${coreSize}px`);
    orbSizes.forEach((size, idx) => {
      orbitBox.style.setProperty(`--orb-${idx + 1}`, `${size}px`);
    });

    renderRingPositions();
  }

  function animateFrame(now) {
    const dtSec = Math.min(0.05, Math.max(0, (now - lastFrameTime) / 1000));
    lastFrameTime = now;

    if (
      window.innerWidth >= 768 &&
      isInViewport &&
      !reducedMotionQuery.matches &&
      (!isInteractionPaused() || impulseEnergy > 0.02)
    ) {
      const boost = 1 + impulseEnergy * 4.5;
      impulseEnergy *= Math.pow(0.012, dtSec);
      if (impulseEnergy < 0.01) impulseEnergy = 0;

      for (let r = 0; r < rings.length; r += 1) {
        const ring = rings[r];
        ring.offsetRad = (ring.offsetRad + ((ring.speedDegPerSec * boost * dtSec) * Math.PI) / 180) % (Math.PI * 2);
      }
      renderRingPositions();
    }

    requestAnimationFrame(animateFrame);
  }

  computeEllipseLayout();
  requestAnimationFrame(() => {
    computeEllipseLayout();
    lastFrameTime = performance.now();
    requestAnimationFrame(animateFrame);
  });

  if (typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(computeEllipseLayout);
    ro.observe(orbitStage);
  } else {
    window.addEventListener("resize", computeEllipseLayout, { passive: true });
  }

  const mobileBreakpointQuery = window.matchMedia("(max-width: 767.98px)");
  if (typeof mobileBreakpointQuery.addEventListener === "function") {
    mobileBreakpointQuery.addEventListener("change", computeEllipseLayout);
  }

  const skillsSection = document.getElementById("skills");
  if (skillsSection && typeof IntersectionObserver !== "undefined") {
    const io = new IntersectionObserver(
      (entries) => {
        isInViewport = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    io.observe(skillsSection);
  }

  return {
    triggerImpulse() {
      if (!reducedMotionQuery.matches) {
        impulseEnergy = 1;
      }
    },
  };
}

/**
 * 3-card auto-slide portfolio carousel with pause-on-hover and responsive card count.
 */
function initPortfolioAutoCarousel() {
  const viewport = document.getElementById("portfolioViewport");
  const track = document.getElementById("portfolioTrack");
  const prevBtn = document.getElementById("portfolioPrevBtn");
  const nextBtn = document.getElementById("portfolioNextBtn");
  const dotsWrap = document.getElementById("portfolioDots");

  if (!viewport || !track) return;

  const cards = Array.from(track.querySelectorAll(".portfolio-card"));
  if (!cards.length) return;

  let currentIndex = 0;
  let timerId = null;

  function getVisibleCount() {
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getVisibleCount());
  }

  function buildDots() {
    if (!dotsWrap) return;
    const totalPositions = getMaxIndex() + 1;
    dotsWrap.innerHTML = "";
    for (let i = 0; i < totalPositions; i += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `portfolio-dot${i === currentIndex ? " is-active" : ""}`;
      dot.setAttribute("aria-label", `Show portfolio slide ${i + 1}`);
      dot.addEventListener("click", () => {
        goTo(i);
        restartAuto();
      });
      dotsWrap.appendChild(dot);
    }
  }

  function updatePosition() {
    const maxIndex = getMaxIndex();
    if (currentIndex > maxIndex) currentIndex = 0;
    const targetCard = cards[currentIndex];
    const offset = targetCard ? targetCard.offsetLeft : 0;
    track.style.transform = `translateX(-${offset}px)`;

    if (dotsWrap) {
      dotsWrap.querySelectorAll(".portfolio-dot").forEach((dot, idx) => {
        dot.classList.toggle("is-active", idx === currentIndex);
      });
    }
  }

  function goTo(index) {
    const maxIndex = getMaxIndex();
    if (index > maxIndex) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = maxIndex;
    } else {
      currentIndex = index;
    }
    updatePosition();
  }

  function startAuto() {
    stopAuto();
    timerId = window.setInterval(() => {
      goTo(currentIndex + 1);
    }, 3200);
  }

  function stopAuto() {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function restartAuto() {
    startAuto();
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      goTo(currentIndex - 1);
      restartAuto();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      goTo(currentIndex + 1);
      restartAuto();
    });
  }

  viewport.addEventListener("mouseenter", stopAuto);
  viewport.addEventListener("mouseleave", startAuto);
  viewport.addEventListener("focusin", stopAuto);
  viewport.addEventListener("focusout", startAuto);

  window.addEventListener("resize", () => {
    buildDots();
    updatePosition();
  });

  buildDots();
  updatePosition();
  startAuto();
}
