document.addEventListener("DOMContentLoaded", () => {
  initAboutCarousel();
  initSkillsSection();
  initPortfolioAutoCarousel();
  initProjectModal();
  initContactForm();
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

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    renderSlide(currentIndex, true);
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    renderSlide(currentIndex, true);
  });

  expandBtn.addEventListener("click", () => {
    renderSlide(currentIndex, false);
    card.classList.add("is-expanded");
  });

  backBtn.addEventListener("click", () => {
    card.classList.remove("is-expanded");
  });

  itemRows.forEach((row) => {
    row.addEventListener("click", () => {
      const targetIndex = Number(row.dataset.slideTarget);
      if (!Number.isNaN(targetIndex)) {
        currentIndex = targetIndex;
        renderSlide(currentIndex, true);
        card.classList.add("is-expanded");
      }
    });
  });

  renderSlide(0, false);
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
 * Handle static contact form validation inside Hire Me modal.
 */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");
  if (!form || !feedback) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("senderName").value.trim();
    const email = document.getElementById("senderEmail").value.trim();
    const message = document.getElementById("senderMessage").value.trim();

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
  const stackItems = document.querySelectorAll(".showcase-stack-item");
  const expItems = document.querySelectorAll("#expTimelineList .exp-media-item");
  const mobileTabBtns = document.querySelectorAll(".skills-tab-btn");
  const toolkitPanel = document.getElementById("skillsToolkitPanel");
  const expPanel = document.getElementById("skillsExpPanel");

  if (filterBtns.length && stackItems.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const selected = btn.dataset.stack;
        filterBtns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");

        stackItems.forEach((item) => {
          const match = selected === "all" || item.dataset.stackCat === selected;
          item.classList.toggle("is-hidden", !match);
        });
      });
    });
  }

  if (expItems.length) {
    expItems.forEach((item) => {
      item.addEventListener("click", () => {
        expItems.forEach((el) => el.classList.remove("is-active"));
        item.classList.add("is-active");
      });
    });
  }

  if (mobileTabBtns.length && toolkitPanel && expPanel) {
    mobileTabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.skillsTab;
        mobileTabBtns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");

        const showToolkit = target === "toolkit";
        toolkitPanel.classList.toggle("is-active", showToolkit);
        expPanel.classList.toggle("is-active", !showToolkit);
      });
    });
  }
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
