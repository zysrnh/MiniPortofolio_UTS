document.addEventListener("DOMContentLoaded", () => {
  initAboutCarousel();
  initSkillsSection();
  initPortfolioAutoCarousel();
  initProjectModal();
  initContactForm();
  initServiceDropdown();
  initMobileNavClose();
  initAppBottomBar();
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
 * Scroll-spy & tap highlight for the mobile app-style bottom toolbar.
 */
function initAppBottomBar() {
  const bar = document.getElementById("mobileAppBar");
  if (!bar) return;

  const sectionItems = Array.from(bar.querySelectorAll(".mobile-app-item[data-app-section]"));
  if (!sectionItems.length) return;

  const setActive = (targetId) => {
    sectionItems.forEach((item) => {
      item.classList.toggle("is-active", item.dataset.appSection === targetId);
    });
  };

  sectionItems.forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.dataset.appSection;
      if (id) setActive(id);
    });
  });

  if (typeof IntersectionObserver === "undefined") return;

  const sections = sectionItems
    .map((item) => document.getElementById(item.dataset.appSection || ""))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible && visible.target && visible.target.id) {
        setActive(visible.target.id);
      }
    },
    {
      rootMargin: "-35% 0px -45% 0px",
      threshold: [0, 0.25, 0.5],
    }
  );

  sections.forEach((section) => observer.observe(section));

  if (sections.some((section) => section.id === "contact")) {
    window.addEventListener(
      "scroll",
      () => {
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40) {
          setActive("contact");
        }
      },
      { passive: true }
    );
  }
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
        if (orbitController && typeof orbitController.setCategory === "function") {
          orbitController.setCategory(activeCategory);
        }
        playTabSwitchFX(activeCategory);
      });
    });
  }

  const skillsSection = document.getElementById("skills");
  if (skillsSection) {
    const syncGalaxyOrigin = () => {
      if (!orbitCore) return;
      const secRect = skillsSection.getBoundingClientRect();
      const coreRect = orbitCore.getBoundingClientRect();
      if (secRect.width > 0 && secRect.height > 0 && coreRect.width > 0) {
        const gx = ((coreRect.left + coreRect.width / 2 - secRect.left) / secRect.width) * 100;
        const gy = ((coreRect.top + coreRect.height / 2 - secRect.top) / secRect.height) * 100;
        skillsSection.style.setProperty("--gx", `${gx.toFixed(2)}%`);
        skillsSection.style.setProperty("--gy", `${gy.toFixed(2)}%`);
      }
    };

    syncGalaxyOrigin();
    window.addEventListener("resize", syncGalaxyOrigin, { passive: true });

    let galaxyDelayTimer = null;
    const galaxyMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (galaxyMotionQuery.matches || typeof IntersectionObserver === "undefined") {
      skillsSection.classList.add("is-galaxy-active");
    } else {
      const galaxyObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.52) {
              if (!skillsSection.classList.contains("is-galaxy-active") && !galaxyDelayTimer) {
                syncGalaxyOrigin();
                galaxyDelayTimer = setTimeout(() => {
                  galaxyDelayTimer = null;
                  syncGalaxyOrigin();
                  skillsSection.classList.add("is-galaxy-active");
                }, 350);
              }
            } else if (!entry.isIntersecting) {
              if (galaxyDelayTimer) {
                clearTimeout(galaxyDelayTimer);
                galaxyDelayTimer = null;
              }
              skillsSection.classList.remove("is-galaxy-active");
            }
          });
        },
        {
          threshold: [0, 0.35, 0.52],
        }
      );
      galaxyObserver.observe(skillsSection);
    }
  }
}

/**
 * Solves concentric ring radii with equal visual edge-to-edge gap along a half-axis.
 */
function solveRingRadii(coreR, orbSizes, rMax) {
  const count = orbSizes.length;
  let occupied = coreR + orbSizes[count - 1] / 2;
  for (let i = 0; i < count - 1; i += 1) {
    occupied += orbSizes[i];
  }
  const freePerGap = (rMax - occupied) / count;
  const radii = [];
  let prevEdge = coreR;

  for (let i = 0; i < count; i += 1) {
    const center = prevEdge + freePerGap + orbSizes[i] / 2;
    radii.push(center);
    prevEdge = center + orbSizes[i] / 2;
  }
  return radii;
}

/**
 * Dynamically fits the constellation orbit across the container:
 * 4-ring full ellipse on desktop/tablet, and airy 2-ring cyclic waves on mobile (< 768px).
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

  const allItems = [];
  const rings = ringConfigs
    .map((cfg, ringIdx) => {
      const rotator = orbitStage.querySelector(`.orbit-rotator--${cfg.key}`);
      const track = orbitStage.querySelector(`.orbit-track--${cfg.key}`);
      if (!rotator) return null;

      const anchors = Array.from(rotator.querySelectorAll(".orbit-anchor")).map((el) => {
        const angleMatch = (el.getAttribute("style") || "").match(/--angle:\s*([-\d.]+)deg/);
        const deg = angleMatch ? parseFloat(angleMatch[1]) : 0;
        const chip = el.querySelector(".orbit-chip");
        const item = {
          el,
          chip,
          cat: chip ? chip.dataset.stackCat || "" : "",
          desktopRingIdx: ringIdx,
          baseRad: (deg * Math.PI) / 180,
          mobileRingIndex: -1,
          mobileAngleRad: 0,
        };
        allItems.push(item);
        return item;
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

  const MOBILE_BREAKPOINT = 768;
  const MOBILE_DWELL_MS = 1000;
  const MOBILE_EXIT_MS = 340;
  const MOBILE_ENTER_MS = 400;

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let isInViewport = true;
  let lastFrameTime = performance.now();
  let impulseEnergy = 0;

  let isMobileCycle = false;
  let currentCategory = "all";
  let mobileWaves = [];
  let mobileWaveIndex = 0;
  let cyclePhase = "idle";
  let dwellTimerId = null;
  let phaseTimerId = null;

  function clearCycleTimers() {
    if (dwellTimerId) {
      clearTimeout(dwellTimerId);
      dwellTimerId = null;
    }
    if (phaseTimerId) {
      clearTimeout(phaseTimerId);
      phaseTimerId = null;
    }
    cyclePhase = "idle";
  }

  function setChipCycleState(item, state, delayMs = 0) {
    const chip = item.chip;
    if (!chip) return;

    if (state === "hidden") {
      chip.classList.remove("is-cycle-out", "is-cycle-in");
      chip.classList.add("is-cycle-hidden");
      chip.removeAttribute("data-mobile-ring");
      chip.style.removeProperty("--cycle-delay");
      chip.setAttribute("aria-hidden", "true");
      chip.tabIndex = -1;
      return;
    }

    if (state === "out") {
      chip.classList.remove("is-cycle-in");
      chip.style.setProperty("--cycle-delay", `${delayMs}ms`);
      chip.classList.add("is-cycle-out");
      return;
    }

    if (state === "in") {
      chip.setAttribute("data-mobile-ring", String(item.mobileRingIndex));
      chip.setAttribute("aria-hidden", "false");
      chip.tabIndex = 0;
      chip.style.setProperty("--cycle-delay", `${delayMs}ms`);
      chip.classList.remove("is-cycle-hidden", "is-cycle-out");
      chip.classList.add("is-cycle-in");
      return;
    }

    // "visible" / desktop restore
    chip.classList.remove("is-cycle-hidden", "is-cycle-out", "is-cycle-in");
    chip.style.removeProperty("--cycle-delay");
    chip.removeAttribute("aria-hidden");
    chip.tabIndex = 0;
    if (!isMobileCycle) {
      chip.removeAttribute("data-mobile-ring");
    } else if (item.mobileRingIndex >= 0) {
      chip.setAttribute("data-mobile-ring", String(item.mobileRingIndex));
    }
  }

  function buildMobileWaves(category) {
    const pool = category === "all" ? allItems : allItems.filter((item) => item.cat === category);
    if (!pool.length) return [];
    if (pool.length <= 6) return [pool];

    const waveCount = Math.max(2, Math.ceil(pool.length / 13));
    const waves = [];
    const baseSize = Math.floor(pool.length / waveCount);
    const extra = pool.length % waveCount;
    let cursor = 0;

    for (let w = 0; w < waveCount; w += 1) {
      const count = baseSize + (w < extra ? 1 : 0);
      waves.push(pool.slice(cursor, cursor + count));
      cursor += count;
    }
    return waves;
  }

  function assignWaveSlots(waveItems, waveIdx) {
    allItems.forEach((item) => {
      item.mobileRingIndex = -1;
    });

    const total = waveItems.length;
    const ring0Count = total <= 3 ? total : Math.max(2, Math.round(total * 0.36));
    const ring1Count = total - ring0Count;
    const waveAngleOffset = (waveIdx % 4) * 0.28;

    waveItems.forEach((item, idx) => {
      const isInner = idx < ring0Count;
      const ringIndex = isInner ? 0 : 1;
      const localIdx = isInner ? idx : idx - ring0Count;
      const localCount = isInner ? ring0Count : ring1Count;
      const step = (Math.PI * 2) / Math.max(1, localCount);
      const staggerHalf = isInner ? 0 : step * 0.5;

      item.mobileRingIndex = ringIndex;
      item.mobileAngleRad = -Math.PI / 2 + localIdx * step + staggerHalf + waveAngleOffset;
    });
  }

  function scheduleNextWave(delayMs) {
    if (dwellTimerId) {
      clearTimeout(dwellTimerId);
    }
    if (!isMobileCycle || mobileWaves.length < 2) return;
    dwellTimerId = setTimeout(advanceMobileWave, delayMs);
  }

  function applyMobileWave(waveIdx, animateEntrance) {
    const waveItems = mobileWaves[waveIdx] || [];
    const waveSet = new Set(waveItems);

    assignWaveSlots(waveItems, waveIdx);

    allItems.forEach((item) => {
      if (!waveSet.has(item)) {
        setChipCycleState(item, "hidden");
      }
    });

    if (animateEntrance && !reducedMotionQuery.matches) {
      waveItems.forEach((item) => {
        setChipCycleState(item, "hidden");
        if (item.chip) {
          item.chip.setAttribute("data-mobile-ring", String(item.mobileRingIndex));
        }
      });
      renderRingPositions();
      void orbitStage.offsetWidth;

      cyclePhase = "entering";
      waveItems.forEach((item, idx) => {
        setChipCycleState(item, "in", idx * 10);
      });

      if (phaseTimerId) clearTimeout(phaseTimerId);
      phaseTimerId = setTimeout(() => {
        waveItems.forEach((item) => {
          setChipCycleState(item, "visible");
        });
        cyclePhase = "idle";
        scheduleNextWave(MOBILE_DWELL_MS);
      }, MOBILE_ENTER_MS);
    } else {
      waveItems.forEach((item) => {
        setChipCycleState(item, "visible");
      });
      renderRingPositions();
      cyclePhase = "idle";
      scheduleNextWave(MOBILE_DWELL_MS);
    }
  }

  function advanceMobileWave() {
    if (!isMobileCycle || mobileWaves.length < 2 || cyclePhase !== "idle") return;

    if (!isInViewport || isInteractionPaused() || reducedMotionQuery.matches) {
      scheduleNextWave(900);
      return;
    }

    const currentWave = mobileWaves[mobileWaveIndex] || [];
    cyclePhase = "exiting";

    currentWave.forEach((item, idx) => {
      setChipCycleState(item, "out", idx * 8);
    });

    if (phaseTimerId) clearTimeout(phaseTimerId);
    phaseTimerId = setTimeout(() => {
      if (!isMobileCycle) return;
      mobileWaveIndex = (mobileWaveIndex + 1) % mobileWaves.length;
      applyMobileWave(mobileWaveIndex, true);
    }, MOBILE_EXIT_MS);
  }

  function resetMobileWavesForCategory(category) {
    currentCategory = category || "all";
    if (!isMobileCycle) return;

    clearCycleTimers();
    mobileWaves = buildMobileWaves(currentCategory);
    mobileWaveIndex = 0;
    applyMobileWave(0, true);
  }

  function renderRingPositions() {
    if (isMobileCycle) {
      for (let i = 0; i < allItems.length; i += 1) {
        const item = allItems[i];
        if (item.mobileRingIndex !== 0 && item.mobileRingIndex !== 1) continue;
        const ring = rings[item.mobileRingIndex];
        const theta = item.mobileAngleRad + ring.offsetRad;
        const x = ring.rx * Math.cos(theta);
        const y = ring.ry * Math.sin(theta);
        item.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      }
      return;
    }

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
    const rawW = orbitStage.clientWidth;
    const rawH = orbitStage.clientHeight;
    const viewportSafeW = Math.max(240, document.documentElement.clientWidth - 20);
    const stageW = Math.min(rawW, viewportSafeW);
    const stageH = rawH;
    if (stageW < 80 || stageH < 80) return;

    const wasMobile = isMobileCycle;
    isMobileCycle = window.innerWidth < MOBILE_BREAKPOINT;
    orbitBox.classList.toggle("is-mobile-cycle", isMobileCycle);
    orbitBox.classList.remove("is-mobile-grid");

    if (isMobileCycle) {
      const coreSize = Math.round(Math.max(66, Math.min(84, stageW * 0.21)));
      const orb1 = Math.round(Math.max(36, Math.min(42, stageW * 0.106)));
      const orb2 = Math.round(Math.max(40, Math.min(46, stageW * 0.116)));
      const coreRadius = coreSize / 2;
      const outerMargin = orb2 / 2 + 8;

      const rxMax = Math.max(108, Math.min(stageW / 2 - outerMargin, stageW * 0.435));
      const ryAvail = Math.max(125, stageH / 2 - outerMargin);
      const ryMax = Math.min(ryAvail, rxMax * 1.24);

      const rxList = solveRingRadii(coreRadius, [orb1, orb2], rxMax);
      const ryList = solveRingRadii(coreRadius, [orb1, orb2], ryMax);

      rings.forEach((ring, idx) => {
        if (idx < 2) {
          ring.rx = rxList[idx];
          ring.ry = ryList[idx];
          if (ring.track) {
            ring.track.style.width = `${(ring.rx * 2).toFixed(1)}px`;
            ring.track.style.height = `${(ring.ry * 2).toFixed(1)}px`;
          }
        } else if (ring.track) {
          ring.track.style.removeProperty("width");
          ring.track.style.removeProperty("height");
        }
      });

      orbitBox.style.setProperty("--core-size", `${coreSize}px`);
      orbitBox.style.setProperty("--orb-1", `${orb1}px`);
      orbitBox.style.setProperty("--orb-2", `${orb2}px`);
      orbitBox.style.setProperty("--orb-3", `${orb2}px`);
      orbitBox.style.setProperty("--orb-4", `${orb2}px`);

      if (!wasMobile) {
        resetMobileWavesForCategory(currentCategory);
      } else {
        renderRingPositions();
      }
      return;
    }

    if (wasMobile) {
      clearCycleTimers();
      allItems.forEach((item) => {
        item.mobileRingIndex = -1;
        setChipCycleState(item, "visible");
      });
    }

    const minDim = Math.min(stageW, stageH);
    const coreSize = Math.min(Math.round(Math.max(82, Math.min(116, stageH * 0.165))), Math.max(66, Math.round(minDim * 0.22)));
    const approxCoreR = coreSize / 2;
    const minorLimit = Math.min(stageH / 2 - 26, stageW / 2 - 24);
    const safeOrbCap = Math.max(26, Math.floor((minorLimit - approxCoreR - 18) / 4.2));
    const baseOrb = Math.min(Math.round(Math.max(36, Math.min(50, stageH * 0.072))), safeOrbCap);

    const orbSizes = [baseOrb, baseOrb + 1, baseOrb + 3, baseOrb + 5];
    const coreRadius = coreSize / 2;
    const outerMargin = orbSizes[3] / 2 + 8;

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

    if (isInViewport && !reducedMotionQuery.matches && (!isInteractionPaused() || impulseEnergy > 0.02)) {
      const boost = 1 + impulseEnergy * 4.5;
      impulseEnergy *= Math.pow(0.012, dtSec);
      if (impulseEnergy < 0.01) impulseEnergy = 0;

      const activeRingCount = isMobileCycle ? 2 : rings.length;
      for (let r = 0; r < activeRingCount; r += 1) {
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
        const prevVisible = isInViewport;
        isInViewport = entries[0]?.isIntersecting ?? true;
        if (!prevVisible && isInViewport && isMobileCycle && cyclePhase === "idle") {
          scheduleNextWave(MOBILE_DWELL_MS);
        }
      },
      { threshold: 0.05 }
    );
    io.observe(skillsSection);
  }

  return {
    setCategory(category) {
      currentCategory = category || "all";
      if (isMobileCycle) {
        resetMobileWavesForCategory(currentCategory);
      }
    },
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
