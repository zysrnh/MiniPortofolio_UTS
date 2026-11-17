document.addEventListener("DOMContentLoaded", () => {
  initTopOnRefresh();
  initSitePreloader();
  initLanguageSwitcher();
  initProjectsArchivePage();
  initPageTransitions();
  initHeroEntrance();
  initSectionEntrance("about", "is-about-ready", "is-about-play", 0.16, 0.82);
  initAboutCarousel();
  initSectionEntrance("skills", "is-skills-ready", "is-skills-play", 0.14, 0.84);
  initSkillsSection();
  initSectionEntrance("work", "is-work-ready", "is-work-play", 0.12, 0.86);
  initWorkStackIcons();
  initPortfolioAutoCarousel();
  initProjectPage();
  initSectionEntrance("contactShell", "is-contact-ready", "is-contact-play", 0.08, 0.9);
  initContactForm();
  initServiceDropdown();
  initMobileNavClose();
  initAppBottomBar();
  initScrollTopButton();
  initBackgroundAudio();
});

const scrollDirectionState = {
  lastY: 0,
  dir: 1,
  initialized: false,
};

/**
 * Keep track of the latest vertical scroll direction (1 = down, -1 = up).
 */
function ensureScrollDirectionTracker() {
  if (scrollDirectionState.initialized) return scrollDirectionState;
  scrollDirectionState.initialized = true;
  scrollDirectionState.lastY = window.scrollY || window.pageYOffset || 0;

  window.addEventListener(
    "scroll",
    () => {
      const currentY = window.scrollY || window.pageYOffset || 0;
      if (Math.abs(currentY - scrollDirectionState.lastY) > 1) {
        scrollDirectionState.dir = currentY > scrollDirectionState.lastY ? 1 : -1;
        scrollDirectionState.lastY = currentY;
      }
    },
    { passive: true }
  );

  return scrollDirectionState;
}

/**
 * Trigger bidirectional editorial scroll-entrance choreography on desktop & mobile.
 *
 * @param {string} sectionId Target section element ID.
 * @param {string} readyClass Class added prior to reveal to hide animated children.
 * @param {string} playClass Class toggled when section becomes visible.
 * @param {number} thresholdRatio Intersection ratio required to trigger reveal.
 * @param {number} viewportCutoff Fraction of viewport height for entry edge reveal.
 */
function initSectionEntrance(sectionId, readyClass, playClass, thresholdRatio, viewportCutoff) {
  const sectionEl = document.getElementById(sectionId);
  if (!sectionEl) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (prefersReducedMotion.matches || typeof IntersectionObserver === "undefined") {
    return;
  }

  const scrollState = ensureScrollDirectionTracker();
  sectionEl.classList.add(readyClass);

  const resolveEnterDir = (rect, vh) => {
    if (rect.top < 0 && rect.bottom < vh * 0.95) return -1;
    if (rect.bottom > vh && rect.top > vh * 0.05) return 1;
    return scrollState.dir;
  };

  const thresholds = Array.from(new Set([0, 0.06, 0.12, thresholdRatio, 0.24, 0.36])).sort(
    (a, b) => a - b
  );

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[entries.length - 1];
      if (!entry) return;

      if (!entry.isIntersecting) {
        sectionEl.classList.remove(playClass);
        delete sectionEl.dataset.enterDir;
        return;
      }

      const vh = window.innerHeight || document.documentElement.clientHeight || 800;
      const rect = entry.boundingClientRect;
      const inViewFromEdges =
        rect.top < vh * viewportCutoff && rect.bottom > vh * (1 - viewportCutoff);

      if ((entry.intersectionRatio >= thresholdRatio || inViewFromEdges) && !sectionEl.classList.contains(playClass)) {
        const dir = resolveEnterDir(rect, vh);
        sectionEl.style.setProperty("--scroll-enter-dir", String(dir));
        sectionEl.dataset.enterDir = dir < 0 ? "up" : "down";
        sectionEl.classList.add(playClass);
      }
    },
    { threshold: thresholds }
  );

  observer.observe(sectionEl);
}

const STACK_ICON_MAP = {
  Laravel: { svg: "assets/img/icons/laravel.svg" },
  Blade: { svg: "assets/img/icons/blade.svg" },
  React: { svg: "assets/img/icons/react.svg" },
  "Inertia.js": { svg: "assets/img/icons/inertia.svg" },
  TypeScript: { svg: "assets/img/icons/typescript.svg" },
  "Tailwind CSS": { svg: "assets/img/icons/tailwind.svg" },
  "Clean Code": { bi: "bi bi-braces" },
  "Responsive UI": { bi: "bi bi-phone" },
  PHP: { svg: "assets/img/icons/php.svg" },
  MySQL: { svg: "assets/img/icons/mysql.svg" },
  "REST API": { svg: "assets/img/icons/restapi.svg" },
  "Express.js": { svg: "assets/img/icons/expressjs.svg" },
  Git: { svg: "assets/img/icons/git.svg" },
  GitHub: { svg: "assets/img/icons/github.svg" },
  HTML5: { svg: "assets/img/icons/html5.svg" },
  CSS3: { svg: "assets/img/icons/css3.svg" },
  "Bootstrap 5": { svg: "assets/img/icons/bootstrap.svg" },
  JavaScript: { svg: "assets/img/icons/javascript.svg" },
  "Chart.js": { svg: "assets/img/icons/chartjs.svg" },
  Leaflet: { svg: "assets/img/icons/leaflet.svg" },
  Python: { svg: "assets/img/icons/python.svg" },
  Figma: { svg: "assets/img/icons/figma.svg" },
  "Design System": { bi: "bi bi-grid-1x2" },
  Wireframing: { bi: "bi bi-vector-pen" },
};

/**
 * Create an icon-only badge tile with accessible label and hover/focus tooltip.
 *
 * @param {string} label Technology or capability name displayed on hover.
 * @param {string} chipClass CSS class for the tile element.
 * @returns {HTMLSpanElement} Populated icon tile element.
 */
function createStackChip(label, chipClass) {
  const span = document.createElement("span");
  span.className = chipClass;
  span.setAttribute("data-tooltip", label);
  span.setAttribute("aria-label", label);
  span.tabIndex = 0;

  const entry = STACK_ICON_MAP[label];
  if (entry && entry.svg) {
    const img = document.createElement("img");
    img.src = entry.svg;
    img.alt = "";
    img.className = "tech-chip-icon";
    img.setAttribute("aria-hidden", "true");
    span.appendChild(img);
  } else {
    const icon = document.createElement("i");
    icon.className = `${entry?.bi || "bi bi-tag"} tech-chip-bi`;
    icon.setAttribute("aria-hidden", "true");
    span.appendChild(icon);
  }

  return span;
}

/**
 * Hydrate static stack tags inside portfolio cards with icons from STACK_ICON_MAP.
 */
function initWorkStackIcons() {
  document.querySelectorAll("#portfolioTrack .slide-stack-tag").forEach((tagEl) => {
    const label = tagEl.textContent.trim();
    if (!label) return;
    tagEl.replaceWith(createStackChip(label, "slide-stack-tag"));
  });
}

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

  const ABOUT_SLIDES = {
    id: [
      {
        num: "01",
        titleHtml: "Merancang<br />Kode Rapi<br /><strong>Selalu.</strong>",
        sub: "ide ke aplikasi web / oleh z.ysrnh",
        label: "RINGKASAN",
        text: "Mahasiswa Teknik Informatika & Fullstack Web Developer berpengalaman 2+ tahun mengubah kebutuhan kompleks menjadi aplikasi web cepat, rapi, dan responsif.",
        rowTitle: "WEB DEVELOPER",
        rowSub: "2+ Tahun Pengalaman",
        tabs: {
          overview:
            "Aktif kuliah Teknik Informatika sambil membangun beragam aplikasi web mulai dari landing page, portal sistem, hingga web app end-to-end selama 2+ tahun.",
          stack:
            "Menguasai PHP & Laravel/Blade untuk fullstack server-rendered serta React, TypeScript, dan Inertia.js untuk antarmuka modern.",
          focus:
            "Mengutamakan struktur kode yang bersih, kecepatan akses tinggi, dan pengalaman pengguna yang konsisten di desktop maupun mobile.",
        },
        badges: ["Laravel", "Blade", "React", "TypeScript", "Tailwind CSS", "Clean Code"],
      },
      {
        num: "02",
        titleHtml: "Antarmuka<br />Flat &amp; Presisi<br /><strong>Responsif.</strong>",
        sub: "desain & interaksi ui / 2+ tahun",
        label: "INTERFACE CRAFT",
        text: "Merancang antarmuka flat yang bersih tanpa dekorasi berlebihan, mengutamakan hierarki visual yang jelas serta responsivitas presisi di desktop dan seluler.",
        rowTitle: "INTERFACE CRAFT",
        rowSub: "Flat UI & Mikro-Interaksi",
        tabs: {
          overview:
            "Menerjemahkan kebutuhan desain menjadi komponen UI modern yang rapi, terstruktur, dan nyaman dipakai pada berbagai ukuran layar.",
          stack:
            "Terbiasa bekerja dengan React, TypeScript, Inertia.js, Tailwind CSS, Bootstrap 5, MUI, serta integrasi library UI interaktif.",
          focus:
            "Menjaga konsistensi tipografi, ruang bernapas layout, serta mikro-interaksi ringan yang mendukung fungsi utama produk.",
        },
        badges: ["React", "Inertia.js", "TypeScript", "Tailwind CSS", "Responsive UI"],
      },
      {
        num: "03",
        titleHtml: "Sistem<br />Backend &amp; Data<br /><strong>Terukur.</strong>",
        sub: "laravel, rest api & mysql / teknik informatika",
        label: "BACKEND & DATABASE",
        text: "Menggabungkan dasar keilmuan Teknik Informatika dengan pengembangan backend PHP/Laravel, perancangan database MySQL, dan integrasi REST API yang stabil.",
        rowTitle: "BACKEND & DATABASE",
        rowSub: "Laravel, REST API, MySQL",
        tabs: {
          overview:
            "Berpengalaman merancang alur data sistem admin dan aplikasi layanan dengan pemodelan relasional MySQL serta pola arsitektur MVC yang rapi.",
          stack:
            "Menggunakan PHP, Laravel MVC, MySQL, perancangan REST API, serta pengelolaan versi proyek memakai Git & GitHub.",
          focus:
            "Menjembatani antarmuka frontend yang gesit dengan logika backend yang stabil, aman, dan mudah dikembangkan jangka panjang.",
        },
        badges: ["PHP", "Laravel", "MySQL", "REST API", "Git", "GitHub"],
      },
    ],
    en: [
      {
        num: "01",
        titleHtml: "Crafting<br />Clean Code<br /><strong>Always.</strong>",
        sub: "idea to fast web product / by z.ysrnh",
        label: "ABSTRACT",
        text: "Informatics student & Fullstack Web Developer with 2+ years of experience turning complex requirements into fast, clean, and responsive web applications.",
        rowTitle: "WEB DEVELOPER",
        rowSub: "2+ Years Experience",
        tabs: {
          overview:
            "Pursuing an Informatics degree while building end-to-end web products ranging from editorial landing pages to structured web systems over 2+ years.",
          stack:
            "Proficient in PHP & Laravel/Blade for server-rendered systems alongside React, TypeScript, and Inertia.js for modern web interfaces.",
          focus:
            "Prioritizing maintainable code structure, snappy page speed, and reliable responsiveness across desktop and mobile screens.",
        },
        badges: ["Laravel", "Blade", "React", "TypeScript", "Tailwind CSS", "Clean Code"],
      },
      {
        num: "02",
        titleHtml: "Interfaces<br />Built Flat<br /><strong>Responsive.</strong>",
        sub: "flat ui & micro-interactions / 2+ years",
        label: "INTERFACE CRAFT",
        text: "Designing crisp flat interfaces free of visual clutter, prioritizing clear hierarchy, intentional contrast, and smooth micro-interactions.",
        rowTitle: "INTERFACE CRAFT",
        rowSub: "Flat UI & Micro-Interactions",
        tabs: {
          overview:
            "Translating design briefs and wireframes into structured, accessible frontend components tailored for real-world usability.",
          stack:
            "Comfortable shipping interfaces with React, TypeScript, Inertia.js, Tailwind CSS, Bootstrap 5, and Material UI.",
          focus:
            "Refining spacing discipline, typographic contrast, and lightweight motion that enhances clarity without slowing performance.",
        },
        badges: ["React", "Inertia.js", "TypeScript", "Tailwind CSS", "Responsive UI"],
      },
      {
        num: "03",
        titleHtml: "Reliable<br />Backend &amp;<br /><strong>Database.</strong>",
        sub: "laravel, rest api & mysql / informatics",
        label: "BACKEND & DATABASE",
        text: "Pairing Informatics engineering fundamentals with practical PHP/Laravel architecture, MySQL schema design, and structured REST APIs.",
        rowTitle: "BACKEND & DATABASE",
        rowSub: "Laravel, REST API, MySQL",
        tabs: {
          overview:
            "Building structured admin systems and web services grounded in relational MySQL modeling and clean MVC separation.",
          stack:
            "Experienced with PHP, Laravel, MySQL query & schema design, REST API development, and Git/GitHub workflow.",
          focus:
            "Connecting responsive UI layers with dependable, secure, and easily maintainable backend logic.",
        },
        badges: ["PHP", "Laravel", "MySQL", "REST API", "Git", "GitHub"],
      },
    ],
  };

  let currentIndex = 0;
  let currentTab = "overview";

  function getActiveSlides() {
    const lang = document.documentElement.lang === "en" ? "en" : "id";
    return ABOUT_SLIDES[lang] || ABOUT_SLIDES.id;
  }

  function updateDetailTabContent() {
    const slide = getActiveSlides()[currentIndex];
    if (!slide || !detailCopyEl) return;
    detailCopyEl.textContent = slide.tabs[currentTab] || slide.tabs.overview;
  }

  function renderSlide(index, animate = true) {
    const activeSlides = getActiveSlides();
    const slide = activeSlides[index];
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
        detailBadgesEl.appendChild(createStackChip(badgeText, "detail-badge"));
      });

      itemRows.forEach((row, idx) => {
        row.classList.toggle("active", idx === index);
        const rowData = activeSlides[idx];
        if (!rowData) return;
        const rowTitleEl = row.querySelector(".ramon-item-title");
        const rowSubEl = row.querySelector(".ramon-item-sub");
        if (rowTitleEl) rowTitleEl.textContent = rowData.rowTitle;
        if (rowSubEl) rowSubEl.textContent = rowData.rowSub;
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
      const slideCount = getActiveSlides().length;
      currentIndex = (currentIndex + 1) % slideCount;
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
    const slideCount = getActiveSlides().length;
    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
    renderSlide(currentIndex, true);
    startAboutAuto();
  });

  nextBtn.addEventListener("click", () => {
    const slideCount = getActiveSlides().length;
    currentIndex = (currentIndex + 1) % slideCount;
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

  window.addEventListener("portfolio:langchange", () => {
    renderSlide(currentIndex, false);
  });

  renderSlide(0, false);
  startAboutAuto();
}

const PROJECTS_CATALOG = [
  {
    key: "p1",
    index: "01",
    categoryGroup: "fullstack",
    image: "assets/portofolio/pokja/Pokja.png",
    gallery: [
      { src: "assets/portofolio/pokja/Pokja.png", labelKey: "work.p1.shot1" },
      { src: "assets/portofolio/pokja/Pokja2.png", labelKey: "work.p1.shot2" },
      { src: "assets/portofolio/pokja/Pokja3.png", labelKey: "work.p1.shot3" },
      { src: "assets/portofolio/pokja/Pokja4.png", labelKey: "work.p1.shot4" },
    ],
    highlights: ["work.p1.h1", "work.p1.h2", "work.p1.h3"],
    stack: ["Laravel", "Blade", "Tailwind CSS", "MySQL"],
    github: "https://github.com/zysrnh/POKJA_ProjectHima",
    liveUrl: "https://pokja.hmif-lpkia.my.id/",
  },
  {
    key: "p2",
    index: "02",
    categoryGroup: "fullstack",
    badgeKey: "work.p2.badge",
    image: "assets/portofolio/kasly/Kasly.png",
    gallery: [
      { src: "assets/portofolio/kasly/Kasly.png", labelKey: "work.p2.shot1" },
      { src: "assets/portofolio/kasly/Kasly2.png", labelKey: "work.p2.shot2" },
      { src: "assets/portofolio/kasly/Kasly3.png", labelKey: "work.p2.shot3" },
      { src: "assets/portofolio/kasly/Kasly4.png", labelKey: "work.p2.shot4" },
    ],
    highlights: ["work.p2.h1", "work.p2.h2", "work.p2.h3"],
    collaborators: [
      { name: "Agna", handle: "@arrxz", url: "https://github.com/arrxz" },
      { name: "Enzi", handle: "@kenzro", url: "https://github.com/kenzro" },
    ],
    stack: ["Laravel", "Blade", "Tailwind CSS", "MySQL", "REST API"],
    github: "https://github.com/zysrnh/Himtech_Project",
    liveUrl: "",
  },
  {
    key: "p3",
    index: "03",
    categoryGroup: "fullstack",
    image: "assets/portofolio/smadiment/Sma1.png",
    gallery: [
      { src: "assets/portofolio/smadiment/Sma1.png", labelKey: "work.p3.shot1" },
      { src: "assets/portofolio/smadiment/Sma2.png", labelKey: "work.p3.shot2" },
      { src: "assets/portofolio/smadiment/Sma3.png", labelKey: "work.p3.shot3" },
      { src: "assets/portofolio/smadiment/Sma4.png", labelKey: "work.p3.shot4" },
    ],
    highlights: ["work.p3.h1", "work.p3.h2", "work.p3.h3"],
    collaborators: [
      { name: "Hilmy", handle: "@hilmywashil", url: "https://github.com/hilmywashil" },
    ],
    stack: ["Laravel", "Blade", "JavaScript", "Chart.js", "REST API"],
    github: "https://github.com/zysrnh/Smadiment_ProjectCyberlabs",
    liveUrl: "https://smadiment-v1.alcomedia.id/",
  },
  {
    key: "p4",
    index: "04",
    categoryGroup: "fullstack",
    image: "assets/portofolio/patenpakmiko/Paten.png",
    gallery: [
      { src: "assets/portofolio/patenpakmiko/Paten.png", labelKey: "work.p4.shot1" },
      { src: "assets/portofolio/patenpakmiko/Paten2.png", labelKey: "work.p4.shot2" },
      { src: "assets/portofolio/patenpakmiko/Paten4.png", labelKey: "work.p4.shot3" },
      { src: "assets/portofolio/patenpakmiko/Paten5.png", labelKey: "work.p4.shot4" },
    ],
    highlights: ["work.p4.h1", "work.p4.h2", "work.p4.h3"],
    stack: ["Laravel", "Blade", "MySQL", "Leaflet", "REST API"],
    github: "https://github.com/zysrnh/Patenpakminko_Cyberlabs",
    liveUrl: "https://patenpakmiko.com/",
  },
  {
    key: "p5",
    index: "05",
    categoryGroup: "fullstack",
    badgeKey: "work.p2.badge",
    image: "assets/portofolio/ICT/Ict.png",
    gallery: [
      { src: "assets/portofolio/ICT/Ict.png", labelKey: "work.p5.shot1" },
      { src: "assets/portofolio/ICT/Ict2.png", labelKey: "work.p5.shot2" },
      { src: "assets/portofolio/ICT/Ict3.png", labelKey: "work.p5.shot3" },
      { src: "assets/portofolio/ICT/Ict4.png", labelKey: "work.p5.shot4" },
    ],
    highlights: ["work.p5.h1", "work.p5.h2", "work.p5.h3"],
    collaborators: [
      { name: "Agna", handle: "@arrxz", url: "https://github.com/arrxz" },
    ],
    stack: ["React", "TypeScript", "Tailwind CSS", "Express.js", "MySQL"],
    github: "https://github.com/zysrnh/ICT_Stratos",
    liveUrl: "",
  },
  {
    key: "p6",
    index: "06",
    categoryGroup: "web",
    image: "assets/portofolio/ConnectFour/Co1.png",
    gallery: [
      { src: "assets/portofolio/ConnectFour/Co1.png", labelKey: "work.p6.shot1" },
      { src: "assets/portofolio/ConnectFour/Co2.png", labelKey: "work.p6.shot2" },
      { src: "assets/portofolio/ConnectFour/Co3.png", labelKey: "work.p6.shot3" },
      { src: "assets/portofolio/ConnectFour/Co4.png", labelKey: "work.p6.shot4" },
    ],
    highlights: ["work.p6.h1", "work.p6.h2", "work.p6.h3"],
    stack: ["Python", "JavaScript", "HTML5", "CSS3"],
    github: "https://github.com/zysrnh/ConnectFour_UTS",
    liveUrl: "https://zysrnh.github.io/ConnectFour_UTS/",
  },
  {
    key: "p7",
    index: "07",
    categoryGroup: "fullstack",
    image: "assets/portofolio/KPI/K1.png",
    gallery: [
      { src: "assets/portofolio/KPI/K1.png", labelKey: "work.p7.shot1" },
      { src: "assets/portofolio/KPI/K2.png", labelKey: "work.p7.shot2" },
      { src: "assets/portofolio/KPI/K3.png", labelKey: "work.p7.shot3" },
      { src: "assets/portofolio/KPI/K4.png", labelKey: "work.p7.shot4" },
    ],
    highlights: ["work.p7.h1", "work.p7.h2", "work.p7.h3"],
    stack: ["Laravel", "React", "Inertia.js", "Tailwind CSS", "MySQL"],
    github: "https://github.com/zysrnh/PascaIAI_Project",
    liveUrl: "https://kpi.iaipibandung.ac.id/",
  },
  {
    key: "p8",
    index: "08",
    categoryGroup: "fullstack",
    image: "assets/portofolio/LPM/L1.png",
    gallery: [
      { src: "assets/portofolio/LPM/L1.png", labelKey: "work.p8.shot1" },
      { src: "assets/portofolio/LPM/L2.png", labelKey: "work.p8.shot2" },
      { src: "assets/portofolio/LPM/L3.png", labelKey: "work.p8.shot3" },
      { src: "assets/portofolio/LPM/L4.png", labelKey: "work.p8.shot4" },
    ],
    highlights: ["work.p8.h1", "work.p8.h2", "work.p8.h3"],
    stack: ["Laravel", "React", "Inertia.js", "Tailwind CSS", "MySQL"],
    github: "https://github.com/zysrnh/PascaIAI_Project",
    liveUrl: "https://lpm.iaipibandung.ac.id/",
  },
  {
    key: "p9",
    index: "09",
    categoryGroup: "fullstack",
    image: "assets/portofolio/KSM/KS1.png",
    gallery: [
      { src: "assets/portofolio/KSM/KS1.png", labelKey: "work.p9.shot1" },
      { src: "assets/portofolio/KSM/KS2.png", labelKey: "work.p9.shot2" },
      { src: "assets/portofolio/KSM/KS3.png", labelKey: "work.p9.shot3" },
      { src: "assets/portofolio/KSM/KS4.png", labelKey: "work.p9.shot4" },
    ],
    highlights: ["work.p9.h1", "work.p9.h2", "work.p9.h3"],
    stack: ["Laravel", "React", "TypeScript", "Inertia.js", "MySQL"],
    github: "https://github.com/zysrnh/ForumHMIF_Project",
    liveUrl: "https://ksm.hmif-lpkia.my.id/",
  },
];

/**
 * Populate and filter the dedicated all-projects archive page (projects.html).
 */
function initProjectsArchivePage() {
  const gridEl = document.getElementById("projectsArchiveGrid");
  if (!gridEl || !PROJECTS_CATALOG.length) return;

  const counterEl = document.getElementById("projectsArchiveCounter");
  const filterButtons = document.querySelectorAll("[data-project-filter]");
  let activeFilter = "all";

  function buildArchiveCard(project, dict) {
    const title = dict[`work.${project.key}.title`] || "";
    const category = dict[`work.${project.key}.cat`] || "";
    const desc = dict[`work.${project.key}.desc`] || "";
    const gallery = resolveProjectGallery(project);
    const previewSrc = (gallery[0] && gallery[0].src) || project.image || "";

    const card = document.createElement("article");
    card.className = "projects-archive-card";

    const preview = document.createElement("div");
    preview.className = "portfolio-card-preview";
    if (previewSrc) {
      const img = document.createElement("img");
      img.src = previewSrc;
      img.alt = title;
      img.className = "portfolio-card-img";
      preview.appendChild(img);
    }

    const body = document.createElement("div");
    body.className = "portfolio-card-body";

    const meta = document.createElement("div");
    meta.className = "portfolio-card-meta";
    const idxSpan = document.createElement("span");
    idxSpan.className = "portfolio-card-index";
    idxSpan.textContent = project.index;
    const sepSpan = document.createElement("span");
    sepSpan.className = "portfolio-card-sep";
    sepSpan.setAttribute("aria-hidden", "true");
    sepSpan.textContent = "//";
    const catSpan = document.createElement("span");
    catSpan.className = "portfolio-card-category";
    catSpan.textContent = category;
    meta.append(idxSpan, sepSpan, catSpan);

    const heading = document.createElement("h2");
    heading.className = "portfolio-card-title";
    heading.textContent = title;

    const summary = document.createElement("p");
    summary.className = "portfolio-card-desc";
    summary.textContent = desc;

    const footer = document.createElement("div");
    footer.className = "portfolio-card-footer";

    const stackRow = document.createElement("div");
    stackRow.className = "slide-stack-row";
    project.stack.forEach((tech) => {
      stackRow.appendChild(createStackChip(tech, "slide-stack-tag"));
    });

    const actions = document.createElement("div");
    actions.className = "projects-archive-actions";

    const ghLink = document.createElement("a");
    ghLink.href = project.github || "https://github.com/zysrnh";
    ghLink.target = "_blank";
    ghLink.rel = "noopener noreferrer";
    ghLink.className = "projects-archive-gh";
    ghLink.setAttribute("aria-label", `${dict["projectsPage.githubAria"] || "GitHub"} — ${title}`);
    const ghIcon = document.createElement("i");
    ghIcon.className = "bi bi-github";
    ghIcon.setAttribute("aria-hidden", "true");
    ghLink.appendChild(ghIcon);

    const detailLink = document.createElement("a");
    detailLink.href = `project.html?project=${project.key}`;
    detailLink.className = "btn btn-solid-dark btn-sm project-detail-btn";
    const detailText = document.createElement("span");
    detailText.textContent = dict["work.viewDetails"] || "SELENGKAPNYA";
    const detailArrow = document.createElement("i");
    detailArrow.className = "bi bi-arrow-right ms-1";
    detailArrow.setAttribute("aria-hidden", "true");
    detailLink.append(detailText, detailArrow);

    actions.append(ghLink, detailLink);
    footer.append(stackRow, actions);
    body.append(meta, heading, summary, footer);
    card.append(preview, body);
    return card;
  }

  function renderArchive() {
    const lang = document.documentElement.lang === "en" ? "en" : "id";
    const dict = SITE_TRANSLATIONS[lang] || SITE_TRANSLATIONS.id;
    const items = activeFilter === "all"
      ? PROJECTS_CATALOG
      : PROJECTS_CATALOG.filter((item) => item.categoryGroup === activeFilter);

    gridEl.innerHTML = "";
    items.forEach((project) => {
      gridEl.appendChild(buildArchiveCard(project, dict));
    });

    if (counterEl) {
      const suffix = dict["projectsPage.countSuffix"] || "PROYEK";
      counterEl.textContent = `${String(items.length).padStart(2, "0")} ${suffix}`;
    }
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.projectFilter || "all";
      filterButtons.forEach((other) => {
        const selected = other === btn;
        other.classList.toggle("is-active", selected);
        other.setAttribute("aria-pressed", String(selected));
      });
      renderArchive();
    });
  });

  window.addEventListener("portfolio:langchange", renderArchive);
  renderArchive();
}

/**
 * Handle smooth page transitions: dual-layer editorial curtain for project details,
 * and soft seamless fade for contact navigation.
 */
function initPageTransitions() {
  const root = document.documentElement;
  const curtain = document.getElementById("pageTransitionCurtain");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let isNavigating = false;

  let storedMode = "";
  try {
    storedMode = window.sessionStorage.getItem("portfolioTransitionMode") || "";
    window.sessionStorage.removeItem("portfolioTransition");
    window.sessionStorage.removeItem("portfolioTransitionMode");
  } catch (_) {}

  function applyCurtainMode(mode) {
    if (!curtain) return;
    curtain.classList.toggle("page-transition-curtain--soft", mode === "soft");
  }

  function revealEnteredPage() {
    const isEntering = root.classList.contains("is-page-entering");
    const isSoftEnter = root.classList.contains("is-page-entering-soft") || storedMode === "soft";
    if (!isEntering) return;

    if (!curtain || prefersReducedMotion.matches) {
      root.classList.remove("is-page-entering", "is-page-entering-soft");
      return;
    }

    if (isSoftEnter) {
      applyCurtainMode("soft");
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        curtain.classList.add("is-curtain-out");
        root.classList.remove("is-page-entering", "is-page-entering-soft");
        window.setTimeout(() => {
          curtain.classList.remove("is-curtain-out");
        }, 480);
      });
    });
  }

  function resetTransitionState() {
    isNavigating = false;
    root.classList.remove("is-page-entering", "is-page-entering-soft");
    if (curtain) {
      curtain.classList.remove("is-curtain-in", "is-curtain-out");
    }
  }

  revealEnteredPage();
  window.addEventListener("pageshow", () => {
    resetTransitionState();
  });

  if (!curtain) return;

  const projectSelector = '.project-detail-btn, #projectBackBtn, body[data-page="project"] a[href^="index.html"]';
  const softSelector =
    'a[href="contact.html"], a[href="projects.html"], #projectAllBtn, body[data-page="contact"] a[href^="index.html"], body[data-page="projects"] a[href^="index.html"]';

  document.addEventListener("click", (event) => {
    if (
      isNavigating ||
      prefersReducedMotion.matches ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const targetEl = event.target && typeof event.target.closest === "function" ? event.target : null;
    if (!targetEl) return;

    const projectLink = targetEl.closest(projectSelector);
    const softLink = projectLink ? null : targetEl.closest(softSelector);
    const link = projectLink || softLink;
    if (!link || link.target === "_blank") return;

    const href = link.getAttribute("href");
    if (!href) return;

    const mode = projectLink ? "editorial" : "soft";
    const delayMs = projectLink ? 320 : 210;

    event.preventDefault();
    isNavigating = true;

    try {
      window.sessionStorage.setItem("portfolioTransition", "1");
      window.sessionStorage.setItem("portfolioTransitionMode", mode);
    } catch (_) {}

    applyCurtainMode(mode);
    curtain.classList.remove("is-curtain-out");
    void curtain.offsetWidth;
    curtain.classList.add("is-curtain-in");

    window.setTimeout(() => {
      window.location.href = href;
    }, delayMs);
  });
}

/**
 * Normalize a project's gallery into a fixed 3-screenshot slot structure.
 *
 * @param {object} project Catalog entry for a portfolio project.
 * @returns {Array<{src: string, labelKey: string}>} Three normalized screenshot slots.
 */
function resolveProjectGallery(project) {
  const defaultLabels = ["work.shot1Default", "work.shot2Default", "work.shot3Default"];
  const source = Array.isArray(project.gallery) ? project.gallery : [];
  if (source.length) {
    return source.map((entry, slotIdx) => ({
      src: entry.src || "",
      labelKey: entry.labelKey || defaultLabels[slotIdx % defaultLabels.length],
    }));
  }
  return [0, 1, 2].map((slotIdx) => ({
    src: slotIdx === 0 ? project.image || "" : "",
    labelKey: defaultLabels[slotIdx],
  }));
}

/**
 * Populate and control the standalone editorial project detail showcase page.
 */
function initProjectPage() {
  const stageEl = document.getElementById("projectStage");
  if (!stageEl || !PROJECTS_CATALOG.length) return;

  const metaEl = document.getElementById("projectDetailMeta");
  const titleEl = document.getElementById("projectDetailTitle");
  const counterEl = document.getElementById("projectDetailCounter");
  const prevBtn = document.getElementById("projectPrevBtn");
  const nextBtn = document.getElementById("projectNextBtn");
  const previewWrap = document.getElementById("projectPreviewBox") || stageEl.querySelector(".project-fullscreen-preview");
  const previewImgEl = document.getElementById("projectPreviewImg");
  const emptyShotEl = document.getElementById("projectEmptyShot");
  const emptyShotNumEl = document.getElementById("projectEmptyShotNum");
  const emptyShotTitleEl = document.getElementById("projectEmptyShotTitle");
  const shotPrevBtn = document.getElementById("projectShotPrevBtn");
  const shotNextBtn = document.getElementById("projectShotNextBtn");
  const zoomBtnEl = document.getElementById("projectZoomBtn");
  const thumbsWrapEl = document.getElementById("projectGalleryThumbs");
  const descEl = document.getElementById("projectDetailDesc");
  const highlightsBlockEl = document.getElementById("projectHighlightsBlock");
  const highlightsListEl = document.getElementById("projectDetailHighlights");
  const collabBlockEl = document.getElementById("projectCollabBlock");
  const collabRowEl = document.getElementById("projectDetailCollab");
  const stackEl = document.getElementById("projectDetailStack");
  const githubBtnEl = document.getElementById("projectGithubBtn");
  const liveBtnEl = document.getElementById("projectLiveBtn");
  const lightboxEl = document.getElementById("projectLightbox");
  const lightboxImgEl = document.getElementById("projectLightboxImg");
  const lightboxCaptionEl = document.getElementById("projectLightboxCaption");
  const lightboxPrevBtn = document.getElementById("projectLightboxPrevBtn");
  const lightboxNextBtn = document.getElementById("projectLightboxNextBtn");
  const lightboxCloseBtn = document.getElementById("projectLightboxCloseBtn");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const urlParams = new URLSearchParams(window.location.search);
  const requestedKey = (urlParams.get("project") || window.location.hash.replace(/^#/, "")).trim().toLowerCase();
  const initialIndex = PROJECTS_CATALOG.findIndex((item) => item.key === requestedKey);
  let activeIndex = initialIndex >= 0 ? initialIndex : 0;
  let activeShotIndex = 0;

  function getActiveDict() {
    const lang = document.documentElement.lang === "en" ? "en" : "id";
    return SITE_TRANSLATIONS[lang] || SITE_TRANSLATIONS.id;
  }

  function syncUrlParam(projectKey) {
    try {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set("project", projectKey);
      nextUrl.hash = "";
      window.history.replaceState(null, "", nextUrl.toString());
    } catch (_) {
      // Ignore history errors in restricted browser contexts.
    }
  }

  function triggerStageAnimation(mode) {
    stageEl.classList.remove("is-project-enter", "is-project-switch");
    if (prefersReducedMotion.matches || mode === "static") return;

    void stageEl.offsetWidth;
    if (mode === "enter") {
      stageEl.classList.add("is-project-enter");
      return;
    }

    stageEl.style.setProperty("--slide-dir", mode === "prev" ? "-1" : "1");
    stageEl.classList.add("is-project-switch");
  }

  function triggerShotAnimation(direction) {
    if (!previewWrap || prefersReducedMotion.matches) return;
    stageEl.classList.remove("is-project-enter", "is-project-switch");
    previewWrap.classList.remove("is-shot-switch");
    previewWrap.style.setProperty("--slide-dir", direction < 0 ? "-1" : "1");
    void previewWrap.offsetWidth;
    previewWrap.classList.add("is-shot-switch");
  }

  function renderActiveShot(shotIdx, animate = false, directionHint = 0) {
    const project = PROJECTS_CATALOG[activeIndex];
    if (!project) return;
    const dict = getActiveDict();
    const gallery = resolveProjectGallery(project);
    const prevShotIndex = activeShotIndex;
    activeShotIndex = Math.max(0, Math.min(gallery.length - 1, shotIdx));

    const shot = gallery[activeShotIndex];
    const projectTitle = dict[`work.${project.key}.title`] || "";
    const shotLabel = dict[shot.labelKey] || `Screenshot ${activeShotIndex + 1}`;
    const hasSrc = Boolean(shot.src);

    if (previewImgEl) {
      if (hasSrc) {
        previewImgEl.setAttribute("src", shot.src);
        previewImgEl.setAttribute("alt", `${projectTitle} — ${shotLabel}`);
        previewImgEl.hidden = false;
      } else {
        previewImgEl.removeAttribute("src");
        previewImgEl.setAttribute("alt", "");
        previewImgEl.hidden = true;
      }
    }

    if (emptyShotEl) {
      emptyShotEl.hidden = hasSrc;
      if (emptyShotNumEl) {
        emptyShotNumEl.textContent = `${String(activeShotIndex + 1).padStart(2, "0")} // ${String(gallery.length).padStart(2, "0")}`;
      }
      if (emptyShotTitleEl) {
        emptyShotTitleEl.textContent = shotLabel;
      }
    }

    const hideShotNav = gallery.length <= 1;
    if (shotPrevBtn) shotPrevBtn.hidden = hideShotNav;
    if (shotNextBtn) shotNextBtn.hidden = hideShotNav;

    if (zoomBtnEl) {
      zoomBtnEl.hidden = !hasSrc;
    }

    if (previewWrap) {
      previewWrap.hidden = false;
      previewWrap.classList.toggle("is-zoomable", hasSrc);
      if (!animate) {
        previewWrap.classList.remove("is-shot-switch");
      } else if (activeShotIndex !== prevShotIndex || directionHint !== 0) {
        const dir = directionHint || (activeShotIndex > prevShotIndex ? 1 : -1);
        triggerShotAnimation(dir);
      }
    }

    if (thumbsWrapEl) {
      thumbsWrapEl.querySelectorAll(".project-gallery-tab").forEach((tabBtn, idx) => {
        const isCurrent = idx === activeShotIndex;
        tabBtn.classList.toggle("is-active", isCurrent);
        tabBtn.setAttribute("aria-pressed", String(isCurrent));
      });
    }
  }

  function renderGalleryThumbs(project, dict) {
    if (!thumbsWrapEl) return;
    const gallery = resolveProjectGallery(project);
    const projectTitle = dict[`work.${project.key}.title`] || "";
    thumbsWrapEl.style.setProperty("--gallery-cols", String(Math.max(1, Math.min(4, gallery.length))));
    thumbsWrapEl.innerHTML = "";

    gallery.forEach((shot, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `project-gallery-tab${idx === activeShotIndex ? " is-active" : ""}`;
      btn.setAttribute("aria-pressed", String(idx === activeShotIndex));

      const thumbBox = document.createElement("span");
      thumbBox.className = "project-gallery-tab-thumb";
      if (shot.src) {
        const img = document.createElement("img");
        img.src = shot.src;
        img.alt = `${projectTitle} ${idx + 1}`;
        thumbBox.appendChild(img);
      } else {
        const icon = document.createElement("i");
        icon.className = "bi bi-image";
        icon.setAttribute("aria-hidden", "true");
        thumbBox.appendChild(icon);
      }

      const metaRow = document.createElement("span");
      metaRow.className = "project-gallery-tab-meta";

      const numSpan = document.createElement("span");
      numSpan.className = "project-gallery-tab-num";
      numSpan.textContent = String(idx + 1).padStart(2, "0");

      const labelSpan = document.createElement("span");
      labelSpan.className = "project-gallery-tab-label";
      labelSpan.textContent = dict[shot.labelKey] || `View ${idx + 1}`;

      metaRow.append(numSpan, labelSpan);
      btn.append(thumbBox, metaRow);
      btn.addEventListener("click", () => {
        if (idx === activeShotIndex) return;
        renderActiveShot(idx, true);
      });
      thumbsWrapEl.appendChild(btn);
    });
  }

  function renderHighlights(project, dict) {
    if (!highlightsBlockEl || !highlightsListEl) return;
    const keys = Array.isArray(project.highlights) ? project.highlights : [];
    const items = keys.map((key) => dict[key]).filter(Boolean);
    highlightsListEl.innerHTML = "";

    if (!items.length) {
      highlightsBlockEl.hidden = true;
      return;
    }

    highlightsBlockEl.hidden = false;
    items.forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      highlightsListEl.appendChild(li);
    });
  }

  function renderCollaborators(project) {
    if (!collabBlockEl || !collabRowEl) return;
    const list = Array.isArray(project.collaborators) ? project.collaborators : [];
    collabRowEl.innerHTML = "";

    if (!list.length) {
      collabBlockEl.hidden = true;
      return;
    }

    collabBlockEl.hidden = false;
    list.forEach((member) => {
      const link = document.createElement("a");
      link.href = member.url || "#";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "project-collab-chip";

      const icon = document.createElement("i");
      icon.className = "bi bi-github";
      icon.setAttribute("aria-hidden", "true");

      const nameSpan = document.createElement("span");
      nameSpan.textContent = member.name || "";

      link.append(icon, nameSpan);
      if (member.handle) {
        const handleSpan = document.createElement("span");
        handleSpan.className = "project-collab-handle";
        handleSpan.textContent = member.handle;
        link.appendChild(handleSpan);
      }

      collabRowEl.appendChild(link);
    });
  }

  function syncLightbox() {
    if (!lightboxEl || lightboxEl.hidden) return;
    const project = PROJECTS_CATALOG[activeIndex];
    if (!project) return;
    const dict = getActiveDict();
    const gallery = resolveProjectGallery(project);
    const shot = gallery[activeShotIndex];
    if (!shot || !shot.src) {
      closeLightbox();
      return;
    }

    const projectTitle = dict[`work.${project.key}.title`] || "";
    const shotLabel = dict[shot.labelKey] || "";
    const loadedCount = gallery.filter((item) => Boolean(item.src)).length;

    if (lightboxImgEl) {
      lightboxImgEl.setAttribute("src", shot.src);
      lightboxImgEl.setAttribute("alt", `${projectTitle} — ${shotLabel}`);
    }
    if (lightboxCaptionEl) {
      const numLabel = `${String(activeShotIndex + 1).padStart(2, "0")} / ${String(gallery.length).padStart(2, "0")}`;
      lightboxCaptionEl.textContent = shotLabel ? `${numLabel} — ${projectTitle} · ${shotLabel}` : `${numLabel} — ${projectTitle}`;
    }
    if (lightboxPrevBtn) lightboxPrevBtn.hidden = loadedCount <= 1;
    if (lightboxNextBtn) lightboxNextBtn.hidden = loadedCount <= 1;
  }

  function openLightbox() {
    if (!lightboxEl) return;
    const project = PROJECTS_CATALOG[activeIndex];
    const gallery = project ? resolveProjectGallery(project) : [];
    const shot = gallery[activeShotIndex];
    if (!shot || !shot.src) return;

    lightboxEl.hidden = false;
    lightboxEl.setAttribute("aria-hidden", "false");
    syncLightbox();
  }

  function closeLightbox() {
    if (!lightboxEl || lightboxEl.hidden) return;
    lightboxEl.hidden = true;
    lightboxEl.setAttribute("aria-hidden", "true");
    if (lightboxImgEl) {
      lightboxImgEl.removeAttribute("src");
    }
  }

  function stepLightbox(direction) {
    const project = PROJECTS_CATALOG[activeIndex];
    if (!project) return;
    const gallery = resolveProjectGallery(project);
    const loadedIndices = gallery
      .map((item, idx) => (item.src ? idx : -1))
      .filter((idx) => idx >= 0);
    if (loadedIndices.length <= 1) return;

    const currentPos = Math.max(0, loadedIndices.indexOf(activeShotIndex));
    const nextIdx = loadedIndices[(currentPos + direction + loadedIndices.length) % loadedIndices.length];
    renderActiveShot(nextIdx, true, direction);
    syncLightbox();
    if (lightboxImgEl && !prefersReducedMotion.matches) {
      lightboxImgEl.classList.remove("is-lightbox-switch");
      lightboxImgEl.style.setProperty("--slide-dir", direction < 0 ? "-1" : "1");
      void lightboxImgEl.offsetWidth;
      lightboxImgEl.classList.add("is-lightbox-switch");
    }
  }

  function renderProject(idx, mode = "enter", shouldSyncUrl = true) {
    const total = PROJECTS_CATALOG.length;
    const prevProjectIndex = activeIndex;
    activeIndex = ((idx % total) + total) % total;
    if (mode !== "static" || prevProjectIndex !== activeIndex) {
      activeShotIndex = 0;
    }

    const project = PROJECTS_CATALOG[activeIndex];
    if (!project) return;

    const dict = getActiveDict();
    const category = dict[`work.${project.key}.cat`] || "";
    const badge = project.badgeKey ? dict[project.badgeKey] || "" : "";
    const title = dict[`work.${project.key}.title`] || "";
    const desc = dict[`work.${project.key}.detail`] || dict[`work.${project.key}.desc`] || "";

    if (metaEl) {
      const parts = [project.index, category].filter(Boolean);
      const baseMeta = parts.join(" // ");
      metaEl.textContent = badge ? `${baseMeta} · ${badge}` : baseMeta;
    }
    if (titleEl) {
      titleEl.textContent = title;
    }
    if (descEl) {
      descEl.textContent = desc;
    }
    if (title) {
      document.title = `${title} — Zaki Yusron Hasyimmi`;
    }
    if (counterEl) {
      counterEl.textContent = `${project.index} / ${String(total).padStart(2, "0")}`;
    }
    if (githubBtnEl) {
      githubBtnEl.setAttribute("href", project.github || "https://github.com/zysrnh");
    }
    if (liveBtnEl) {
      if (project.liveUrl) {
        liveBtnEl.setAttribute("href", project.liveUrl);
        liveBtnEl.hidden = false;
      } else {
        liveBtnEl.setAttribute("href", "#");
        liveBtnEl.hidden = true;
      }
    }

    renderGalleryThumbs(project, dict);
    renderActiveShot(activeShotIndex);
    renderHighlights(project, dict);
    renderCollaborators(project);

    if (stackEl) {
      stackEl.innerHTML = "";
      project.stack.forEach((item, chipIdx) => {
        const chip = createStackChip(item, "slide-stack-tag");
        chip.style.setProperty("--chip-index", String(chipIdx));
        stackEl.appendChild(chip);
      });
    }

    syncLightbox();

    if (shouldSyncUrl) {
      syncUrlParam(project.key);
    }

    triggerStageAnimation(mode);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      closeLightbox();
      renderProject(activeIndex - 1, "prev", true);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      closeLightbox();
      renderProject(activeIndex + 1, "next", true);
    });
  }

  function stepGalleryShot(direction) {
    const project = PROJECTS_CATALOG[activeIndex];
    if (!project) return;
    const gallery = resolveProjectGallery(project);
    if (gallery.length <= 1) return;
    const nextIdx = (activeShotIndex + direction + gallery.length) % gallery.length;
    renderActiveShot(nextIdx, true, direction);
  }

  if (shotPrevBtn) {
    shotPrevBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      stepGalleryShot(-1);
    });
  }

  if (shotNextBtn) {
    shotNextBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      stepGalleryShot(1);
    });
  }

  if (previewImgEl) {
    previewImgEl.addEventListener("click", openLightbox);
  }

  if (zoomBtnEl) {
    zoomBtnEl.addEventListener("click", openLightbox);
  }

  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener("click", () => stepLightbox(-1));
  }

  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener("click", () => stepLightbox(1));
  }

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener("click", closeLightbox);
  }

  if (lightboxEl) {
    lightboxEl.addEventListener("click", (event) => {
      if (event.target === lightboxEl || event.target.classList.contains("project-lightbox-stage")) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    const tag = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : "";
    if (tag === "input" || tag === "textarea" || tag === "select") return;

    if (lightboxEl && !lightboxEl.hidden) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepLightbox(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        stepLightbox(1);
      }
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      renderProject(activeIndex - 1, "prev", true);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      renderProject(activeIndex + 1, "next", true);
    }
  });

  window.addEventListener("portfolio:langchange", () => {
    renderProject(activeIndex, "static", false);
  });

  renderProject(activeIndex, "enter", Boolean(requestedKey));
}

/**
 * Handle contact form submission (FormSubmit AJAX -> naooolaf@gmail.com with mailto fallback)
 * and quick-copy email button inside the modal.
 */
function initContactForm() {
  const TARGET_EMAIL = "naooolaf@gmail.com";
  const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${TARGET_EMAIL}`;
  const isEmailValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const getLangCopy = () => {
    const isEn = document.documentElement.lang === "en";
    return isEn
      ? {
          missing: "Please fill in your name, email, and message.",
          invalidEmail: "Please enter a valid email address.",
          sending: "Sending...",
          sent: `Thanks, {name}! Your message has been sent to ${TARGET_EMAIL}.`,
          localOpened: `Local file mode detected: your mail app is opening to send to ${TARGET_EMAIL}. (Direct sending works automatically once live on GitHub Pages.)`,
          failedPrefix: "Could not send directly. Open your mail app instead: ",
          failedLink: `Send to ${TARGET_EMAIL}`,
          copied: "Copied!",
          copyIdle: "Copy Email",
          submitIdle: "SEND MESSAGE",
        }
      : {
          missing: "Harap isi nama, email, dan pesan terlebih dahulu.",
          invalidEmail: "Format alamat email belum valid.",
          sending: "Mengirim...",
          sent: `Terima kasih, {name}! Pesan berhasil dikirim ke ${TARGET_EMAIL}.`,
          localOpened: `Mode file lokal (file://): aplikasi email diarahkan ke ${TARGET_EMAIL}. Pengiriman langsung berjalan otomatis saat live di GitHub Pages.`,
          failedPrefix: "Gagal mengirim otomatis. Kirim lewat aplikasi email: ",
          failedLink: `Kirim ke ${TARGET_EMAIL}`,
          copied: "Tersalin!",
          copyIdle: "Salin Email",
          submitIdle: "KIRIM PESAN",
        };
  };

  const copyBtn = document.getElementById("copyContactEmailBtn");
  if (copyBtn) {
    let copyTimer = null;
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.dataset.copyEmail || TARGET_EMAIL;
      const copyText = getLangCopy();
      let ok = false;

      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(email);
          ok = true;
        } catch (_) {
          ok = false;
        }
      }

      if (!ok) {
        const temp = document.createElement("textarea");
        temp.value = email;
        temp.setAttribute("readonly", "");
        temp.style.position = "fixed";
        temp.style.left = "-9999px";
        document.body.appendChild(temp);
        temp.select();
        try {
          ok = document.execCommand("copy");
        } catch (_) {
          ok = false;
        }
        temp.remove();
      }

      if (ok) {
        copyBtn.textContent = copyText.copied;
        if (copyTimer) window.clearTimeout(copyTimer);
        copyTimer = window.setTimeout(() => {
          copyBtn.textContent = getLangCopy().copyIdle;
        }, 1800);
      }
    });
  }

  const buildMailtoUrl = (name, email, message, service) => {
    const subject = service
      ? `[Portfolio] ${service} - ${name}`
      : `[Portfolio] Message from ${name}`;
    const lines = [
      `Name: ${name}`,
      `Email: ${email}`,
      ...(service ? [`Service: ${service}`] : []),
      "",
      message,
    ];
    return `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  };

  const showFallbackLink = (feedback, prefix, linkLabel, mailtoUrl) => {
    feedback.textContent = prefix;
    const anchor = document.createElement("a");
    anchor.href = mailtoUrl;
    anchor.className = "contact-feedback-link";
    anchor.textContent = linkLabel;
    feedback.appendChild(anchor);
  };

  const bindForm = ({ formId, nameId, lastNameId, serviceId, emailId, msgId, feedbackId }) => {
    const form = document.getElementById(formId);
    const feedback = document.getElementById(feedbackId);
    if (!form || !feedback) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const submitLabelEl = submitBtn ? submitBtn.querySelector("[data-i18n]") || submitBtn : null;
    const submitI18nKey = submitLabelEl?.dataset?.i18n || "";
    const defaultSubmitText = submitLabelEl ? submitLabelEl.textContent : "";

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const firstName = document.getElementById(nameId)?.value.trim() || "";
      const lastName = lastNameId ? document.getElementById(lastNameId)?.value.trim() || "" : "";
      const name = [firstName, lastName].filter(Boolean).join(" ");
      const service = serviceId ? document.getElementById(serviceId)?.value.trim() || "" : "";
      const email = document.getElementById(emailId)?.value.trim() || "";
      const message = document.getElementById(msgId)?.value.trim() || "";
      const copyText = getLangCopy();

      feedback.classList.remove("d-none", "text-danger", "text-success");

      if (!firstName || !email || !message) {
        feedback.textContent = copyText.missing;
        feedback.classList.add("text-danger");
        return;
      }

      if (!isEmailValid(email)) {
        feedback.textContent = copyText.invalidEmail;
        feedback.classList.add("text-danger");
        return;
      }

      const mailtoUrl = buildMailtoUrl(name, email, message, service);
      const isHttpOrigin =
        window.location.protocol === "http:" || window.location.protocol === "https:";

      if (!isHttpOrigin) {
        feedback.textContent = copyText.localOpened;
        feedback.classList.add("text-success");
        window.location.href = mailtoUrl;
        return;
      }

      if (submitBtn && submitLabelEl) {
        submitBtn.disabled = true;
        submitLabelEl.textContent = copyText.sending;
      }

      try {
        const payload = {
          name,
          email,
          message,
          _subject: service
            ? `[Portfolio] ${service} — ${name}`
            : `[Portfolio] Pesan Baru dari ${name}`,
          _replyto: email,
          _template: "table",
        };
        if (service) {
          payload.service = service;
        }

        const response = await fetch(FORMSUBMIT_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));
        const isOk = response.ok && (data.success === true || data.success === "true");

        if (!isOk) {
          throw new Error("FormSubmit rejected request");
        }

        feedback.textContent = copyText.sent.replace("{name}", name);
        feedback.classList.add("text-success");
        form.reset();
      } catch (_) {
        feedback.classList.add("text-danger");
        showFallbackLink(feedback, copyText.failedPrefix, copyText.failedLink, mailtoUrl);
      } finally {
        if (submitBtn && submitLabelEl) {
          submitBtn.disabled = false;
          const activeLang = document.documentElement.lang === "en" ? "en" : "id";
          const dict = SITE_TRANSLATIONS[activeLang] || SITE_TRANSLATIONS.id;
          if (submitI18nKey && dict[submitI18nKey]) {
            submitLabelEl.textContent = dict[submitI18nKey];
          } else {
            submitLabelEl.textContent =
              submitI18nKey === "modal.submit" ? getLangCopy().submitIdle : defaultSubmitText;
          }
        }
      }
    });
  };

  bindForm({
    formId: "contactForm",
    nameId: "senderName",
    emailId: "senderEmail",
    msgId: "senderMessage",
    feedbackId: "formFeedback",
  });

  bindForm({
    formId: "editorialContactForm",
    nameId: "edFirstName",
    lastNameId: "edLastName",
    serviceId: "edService",
    emailId: "edEmail",
    msgId: "edProjectDesc",
    feedbackId: "edFormFeedback",
  });
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

  const getItemDisplayText = (item) => {
    const labelSpan = item.querySelector("span");
    return (labelSpan ? labelSpan.textContent : item.dataset.value || "").trim();
  };

  const applySelection = (targetItem) => {
    if (!targetItem) return;
    hiddenInput.value = targetItem.dataset.value || "";
    label.textContent = getItemDisplayText(targetItem);

    items.forEach((el) => {
      const selected = el === targetItem;
      el.classList.toggle("is-selected", selected);
      el.setAttribute("aria-selected", String(selected));
    });
  };

  const syncSelectedDisplay = () => {
    const currentItem =
      Array.from(items).find((el) => el.dataset.value === hiddenInput.value) ||
      dropdown.querySelector(".service-dropdown-item.is-selected") ||
      items[0];
    if (currentItem) {
      applySelection(currentItem);
    }
  };

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
      applySelection(item);
      closeMenu();
    });
  });

  window.addEventListener("portfolio:langchange", syncSelectedDisplay);
  const parentForm = dropdown.closest("form");
  if (parentForm) {
    parentForm.addEventListener("reset", () => {
      window.requestAnimationFrame(() => {
        syncSelectedDisplay();
      });
    });
  }
  syncSelectedDisplay();

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
 * Floating back-to-top button visibility, scroll progress bar, and smooth scroll-to-top.
 */
function initScrollTopButton() {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const SHOW_OFFSET_DESKTOP = 320;
  const SHOW_OFFSET_MOBILE = 240;
  let rafId = null;

  const updateState = () => {
    rafId = null;
    const scrollTop = window.scrollY || window.pageYOffset || 0;
    const maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      0
    );
    const threshold = window.innerWidth < 992 ? SHOW_OFFSET_MOBILE : SHOW_OFFSET_DESKTOP;
    const isVisible = scrollTop > threshold && maxScroll > threshold * 0.5;
    const progress = maxScroll > 0 ? Math.min(Math.max(scrollTop / maxScroll, 0), 1) : 0;

    btn.classList.toggle("is-visible", isVisible);
    btn.style.setProperty("--scroll-progress", progress.toFixed(4));
    btn.setAttribute("aria-hidden", String(!isVisible));
    btn.tabIndex = isVisible ? 0 : -1;
  };

  const scheduleUpdate = () => {
    if (rafId !== null) return;
    rafId = window.requestAnimationFrame(updateState);
  };

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });

    const homeAppItem = document.querySelector('.mobile-app-item[data-app-section="home"]');
    if (homeAppItem) {
      document.querySelectorAll(".mobile-app-item[data-app-section]").forEach((el) => {
        el.classList.toggle("is-active", el === homeAppItem);
      });
    }
  });

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  updateState();
}

/**
 * Background music controller with cross-page time persistence and autoplay fallback.
 */
function initBackgroundAudio() {
  const audio = document.getElementById("bgAudio");
  const toggleBtns = document.querySelectorAll(".audio-toggle-btn, .audio-float-btn");
  if (!audio || !toggleBtns.length) return;

  const STORAGE_MUTED_KEY = "portfolioAudioMuted";
  const STORAGE_TIME_KEY = "portfolioAudioTime";
  const DEFAULT_VOLUME = 0.75;
  const GESTURE_EVENTS = ["pointerdown", "mousedown", "pointerup", "touchend", "click", "keydown"];

  const readSession = (key) => {
    try {
      return window.sessionStorage.getItem(key);
    } catch (_) {
      return null;
    }
  };

  const writeSession = (key, value) => {
    try {
      window.sessionStorage.setItem(key, value);
    } catch (_) {
      // Ignore storage failures in restricted file contexts.
    }
  };

  const navEntry =
    window.performance && window.performance.getEntriesByType
      ? window.performance.getEntriesByType("navigation")[0]
      : null;
  const isReload =
    (navEntry && navEntry.type === "reload") ||
    (window.performance && window.performance.navigation && window.performance.navigation.type === 1);

  if (isReload) {
    writeSession(STORAGE_TIME_KEY, "0");
    writeSession(STORAGE_MUTED_KEY, "0");
  }

  const getAudioAriaLabel = (playing) => {
    const lang = document.documentElement.lang === "en" ? "en" : "id";
    const dict = SITE_TRANSLATIONS[lang] || SITE_TRANSLATIONS.id;
    return playing ? dict["audio.pauseAria"] : dict["audio.playAria"];
  };

  const setAwaitingGesture = (show) => {
    toggleBtns.forEach((btn) => {
      btn.classList.toggle("is-awaiting-gesture", show);
    });
  };

  const syncButtons = (playing) => {
    const label = getAudioAriaLabel(playing);
    toggleBtns.forEach((btn) => {
      btn.classList.toggle("is-playing", playing);
      btn.setAttribute("aria-pressed", String(playing));
      if (label) {
        btn.setAttribute("aria-label", label);
        btn.setAttribute("title", label);
      }
    });
    if (playing) {
      setAwaitingGesture(false);
    }
  };

  const isMutedByUser = () => readSession(STORAGE_MUTED_KEY) === "1";

  const applySavedTime = () => {
    if (isReload) return;
    const rawTime = Number.parseFloat(readSession(STORAGE_TIME_KEY) || "0");
    if (!Number.isFinite(rawTime) || rawTime <= 0) return;
    const duration = audio.duration;
    if (Number.isFinite(duration) && duration > 1.5) {
      audio.currentTime = rawTime < duration - 1.5 ? rawTime : 0;
    }
  };

  audio.loop = true;
  audio.volume = DEFAULT_VOLUME;

  if (audio.readyState >= 1) {
    applySavedTime();
  } else {
    audio.addEventListener("loadedmetadata", applySavedTime, { once: true });
  }

  let gestureAttached = false;
  let playAttemptPending = false;
  let autoplayBlocked = false;

  const handleFirstGesture = (event) => {
    if (event.target && typeof event.target.closest === "function" && event.target.closest("[data-audio-toggle]")) {
      return;
    }
    if (!isMutedByUser() && !playAttemptPending) {
      tryStartPlayback();
    }
  };

  const attachGestureListeners = () => {
    if (gestureAttached) return;
    gestureAttached = true;
    GESTURE_EVENTS.forEach((eventName) => {
      document.addEventListener(eventName, handleFirstGesture, { passive: true });
    });
  };

  const removeGestureListeners = () => {
    if (!gestureAttached) return;
    gestureAttached = false;
    GESTURE_EVENTS.forEach((eventName) => {
      document.removeEventListener(eventName, handleFirstGesture);
    });
  };

  function tryStartPlayback() {
    if (playAttemptPending) return;
    playAttemptPending = true;
    audio.muted = false;
    audio.loop = true;

    let playResult;
    try {
      playResult = audio.play();
    } catch (err) {
      playAttemptPending = false;
      autoplayBlocked = Boolean(err && err.name === "NotAllowedError");
      syncButtons(false);
      setAwaitingGesture(true);
      attachGestureListeners();
      return;
    }

    Promise.resolve(playResult)
      .then(() => {
        playAttemptPending = false;
        autoplayBlocked = false;
        writeSession(STORAGE_MUTED_KEY, "0");
        removeGestureListeners();
        syncButtons(!audio.paused);
      })
      .catch((err) => {
        playAttemptPending = false;
        autoplayBlocked = Boolean(err && err.name === "NotAllowedError");
        syncButtons(false);
        setAwaitingGesture(true);
        attachGestureListeners();
      });
  }

  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!audio.paused) {
        audio.pause();
        writeSession(STORAGE_MUTED_KEY, "1");
        removeGestureListeners();
        setAwaitingGesture(false);
        syncButtons(false);
      } else {
        writeSession(STORAGE_MUTED_KEY, "0");
        tryStartPlayback();
      }
    });
  });

  let lastSavedAt = 0;
  const savePosition = (force = false) => {
    const now = Date.now();
    if (!force && now - lastSavedAt < 900) return;
    lastSavedAt = now;
    if (Number.isFinite(audio.currentTime) && audio.currentTime > 0) {
      writeSession(STORAGE_TIME_KEY, audio.currentTime.toFixed(2));
    }
  };

  audio.addEventListener("canplay", () => {
    if (!isMutedByUser() && audio.paused && !playAttemptPending && !autoplayBlocked) {
      tryStartPlayback();
    }
  });
  audio.addEventListener("timeupdate", () => savePosition(false));
  audio.addEventListener("play", () => {
    writeSession(STORAGE_MUTED_KEY, "0");
    removeGestureListeners();
    setAwaitingGesture(false);
    syncButtons(true);
  });
  audio.addEventListener("pause", () => {
    if (!audio.ended) {
      syncButtons(false);
    }
  });
  audio.addEventListener("ended", () => {
    if (!isMutedByUser()) {
      audio.currentTime = 0;
      tryStartPlayback();
    }
  });

  window.addEventListener("pagehide", () => savePosition(true));
  window.addEventListener("beforeunload", () => savePosition(true));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) savePosition(true);
  });

  window.addEventListener("portfolio:langchange", () => {
    syncButtons(!audio.paused && !audio.muted);
  });

  if (isMutedByUser()) {
    if (!audio.paused) {
      audio.pause();
    }
    setAwaitingGesture(false);
    syncButtons(false);
  } else if (!audio.paused) {
    writeSession(STORAGE_MUTED_KEY, "0");
    syncButtons(true);
  } else {
    syncButtons(false);
    tryStartPlayback();
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
    all: { title: "ZY", sub: "ALL STACK", wide: false },
    fe: { title: "FE", sub: "FRONTEND", wide: false },
    be: { title: "BE", sub: "BACKEND", wide: false },
    tools: { title: "TOOLS", sub: "WORKFLOW", wide: true },
  };
  let activeCategory = "all";
  let pinnedChip = null;
  let hoveredInteractive = false;
  let keyboardFocused = false;
  let switchCleanupTimer = null;

  function setChipLayerActive(chip, isActive) {
    if (!chip) return;
    const anchor = chip.closest(".orbit-anchor");
    const rotator = chip.closest(".orbit-rotator");
    if (anchor) anchor.classList.toggle("is-anchor-active", isActive);
    if (rotator) rotator.classList.toggle("is-anchor-active", isActive);
  }

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
        setChipLayerActive(chip, true);
        showCorePreview(chip);
      });

      chip.addEventListener("mouseleave", () => {
        hoveredInteractive = false;
        if (chip !== pinnedChip && document.activeElement !== chip) {
          setChipLayerActive(chip, false);
        }
        if (pinnedChip) {
          showCorePreview(pinnedChip);
        } else {
          resetCorePreview();
        }
      });

      chip.addEventListener("focus", () => {
        keyboardFocused = true;
        setChipLayerActive(chip, true);
        showCorePreview(chip);
      });

      chip.addEventListener("blur", () => {
        keyboardFocused = false;
        if (chip !== pinnedChip) {
          setChipLayerActive(chip, false);
        }
        if (!pinnedChip) {
          resetCorePreview();
        }
      });

      chip.addEventListener("click", (event) => {
        event.stopPropagation();
        const isSame = pinnedChip === chip;

        orbitChips.forEach((c) => {
          c.classList.remove("is-selected");
          if (c !== chip) setChipLayerActive(c, false);
        });
        if (isSame) {
          pinnedChip = null;
          setChipLayerActive(chip, false);
          chip.blur();
          if (orbitBox) orbitBox.classList.remove("is-paused");
          resetCorePreview();
        } else {
          pinnedChip = chip;
          chip.classList.add("is-selected");
          setChipLayerActive(chip, true);
          if (orbitBox) orbitBox.classList.add("is-paused");
          showCorePreview(chip);
        }
      });
    });

    if (orbitBox) {
      orbitBox.addEventListener("click", (event) => {
        if (!event.target.closest(".orbit-chip") && pinnedChip) {
          orbitChips.forEach((c) => {
            c.classList.remove("is-selected");
            setChipLayerActive(c, false);
          });
          pinnedChip = null;
          orbitBox.classList.remove("is-paused");
          resetCorePreview();
        }
      });
    }
  }

  const orbitController = setupEllipticalOrbitController(
    orbitBox,
    () => Boolean(pinnedChip || hoveredInteractive || keyboardFocused)
  );

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
          setChipLayerActive(chip, false);
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
    const galaxyBg = skillsSection.querySelector(".skills-galaxy-bg");
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
    let galaxySettleTimer = null;
    const galaxyMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (galaxyBg) {
      galaxyBg.addEventListener("transitionend", (event) => {
        if (event.propertyName === "clip-path" && skillsSection.classList.contains("is-galaxy-active")) {
          if (galaxySettleTimer) {
            clearTimeout(galaxySettleTimer);
            galaxySettleTimer = null;
          }
          skillsSection.classList.add("is-galaxy-settled");
        }
      });
    }

    if (galaxyMotionQuery.matches || typeof IntersectionObserver === "undefined") {
      skillsSection.classList.add("is-galaxy-active", "is-galaxy-settled");
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
                  skillsSection.classList.remove("is-galaxy-settled");
                  skillsSection.classList.add("is-galaxy-active");
                  if (galaxySettleTimer) clearTimeout(galaxySettleTimer);
                  galaxySettleTimer = setTimeout(() => {
                    galaxySettleTimer = null;
                    if (skillsSection.classList.contains("is-galaxy-active")) {
                      skillsSection.classList.add("is-galaxy-settled");
                    }
                  }, 5200);
                }, 350);
              }
            } else if (!entry.isIntersecting) {
              if (galaxyDelayTimer) {
                clearTimeout(galaxyDelayTimer);
                galaxyDelayTimer = null;
              }
              if (galaxySettleTimer) {
                clearTimeout(galaxySettleTimer);
                galaxySettleTimer = null;
              }
              skillsSection.classList.remove("is-galaxy-active", "is-galaxy-settled");
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

  let rafId = null;

  function scheduleNextFrame() {
    if (rafId !== null || !isInViewport || document.hidden || reducedMotionQuery.matches) return;
    lastFrameTime = performance.now();
    rafId = requestAnimationFrame(animateFrame);
  }

  function stopOrbitLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function animateFrame(now) {
    rafId = null;
    if (!isInViewport || document.hidden || reducedMotionQuery.matches) return;

    const dtSec = Math.min(0.05, Math.max(0, (now - lastFrameTime) / 1000));
    lastFrameTime = now;

    if (!isInteractionPaused() || impulseEnergy > 0.02) {
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

    rafId = requestAnimationFrame(animateFrame);
  }

  computeEllipseLayout();
  requestAnimationFrame(() => {
    computeEllipseLayout();
    scheduleNextFrame();
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

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopOrbitLoop();
    } else if (isInViewport) {
      scheduleNextFrame();
    }
  });

  const skillsSection = document.getElementById("skills");
  if (skillsSection && typeof IntersectionObserver !== "undefined") {
    const io = new IntersectionObserver(
      (entries) => {
        const prevVisible = isInViewport;
        isInViewport = entries[0]?.isIntersecting ?? true;
        if (isInViewport) {
          scheduleNextFrame();
        } else {
          stopOrbitLoop();
        }
        if (!prevVisible && isInViewport && isMobileCycle && cyclePhase === "idle") {
          scheduleNextWave(MOBILE_DWELL_MS);
        }
      },
      { threshold: 0.02 }
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
        scheduleNextFrame();
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
  const counterEl = document.getElementById("portfolioCounter");

  if (!viewport || !track) return;

  const cards = Array.from(track.querySelectorAll(".portfolio-card"));
  if (!cards.length) return;

  let currentIndex = 0;
  let timerId = null;

  function getVisibleCount() {
    if (window.innerWidth >= 992) return 2;
    return 1;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getVisibleCount());
  }

  function getDotAriaLabel(index) {
    const isEn = document.documentElement.lang === "en";
    return isEn ? `Show portfolio slide ${index + 1}` : `Tampilkan slide portofolio ${index + 1}`;
  }

  function buildDots() {
    if (!dotsWrap) return;
    const totalPositions = getMaxIndex() + 1;
    dotsWrap.innerHTML = "";
    for (let i = 0; i < totalPositions; i += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `portfolio-dot${i === currentIndex ? " is-active" : ""}`;
      dot.setAttribute("aria-label", getDotAriaLabel(i));
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
    const originOffset = cards[0] ? cards[0].offsetLeft : 0;
    const offset = targetCard ? Math.max(0, targetCard.offsetLeft - originOffset) : 0;
    track.style.transform = `translateX(-${offset}px)`;

    if (counterEl) {
      const currentLabel = String(currentIndex + 1).padStart(2, "0");
      const totalLabel = String(maxIndex + 1).padStart(2, "0");
      counterEl.textContent = `${currentLabel} / ${totalLabel}`;
    }

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
    if (document.hidden) return;
    timerId = window.setInterval(() => {
      goTo(currentIndex + 1);
    }, 3400);
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

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAuto();
    } else {
      startAuto();
    }
  });

  window.addEventListener("portfolio:langchange", () => {
    if (!dotsWrap) return;
    dotsWrap.querySelectorAll(".portfolio-dot").forEach((dot, idx) => {
      dot.setAttribute("aria-label", getDotAriaLabel(idx));
    });
  });

  window.addEventListener("resize", () => {
    buildDots();
    updatePosition();
  });

  buildDots();
  updatePosition();
  startAuto();
}

/**
 * Allow replaying the Hero editorial curtain reveal when returning via Home links.
 */
function initHeroEntrance() {
  const heroSection = document.getElementById("home");
  if (!heroSection) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let hasLeftHero = false;
  let lastReplayAt = 0;

  function triggerReplay() {
    if (prefersReducedMotion.matches) return;
    const now = window.performance ? window.performance.now() : Date.now();
    if (now - lastReplayAt < 450) return;
    lastReplayAt = now;

    heroSection.classList.remove("is-hero-armed", "is-hero-play");
    void heroSection.offsetWidth;
    heroSection.classList.add("is-hero-play");
  }

  if (typeof IntersectionObserver !== "undefined") {
    const heroVisibilityObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        const isVisible = entry.isIntersecting;
        heroSection.classList.toggle("is-hero-offscreen", !isVisible);

        if (prefersReducedMotion.matches || document.documentElement.classList.contains("is-preloading")) {
          return;
        }

        const vh = window.innerHeight || document.documentElement.clientHeight || 800;
        if (!isVisible) {
          hasLeftHero = true;
          heroSection.classList.add("is-hero-armed");
          heroSection.classList.remove("is-hero-play");
        } else if (
          hasLeftHero &&
          (entry.intersectionRatio >= 0.22 || entry.boundingClientRect.bottom > vh * 0.22)
        ) {
          hasLeftHero = false;
          triggerReplay();
        }
      },
      { threshold: [0, 0.12, 0.22, 0.4] }
    );
    heroVisibilityObserver.observe(heroSection);
  }

  const homeLinks = document.querySelectorAll('a[href="#home"]');
  if (!homeLinks.length) return;

  let scrollWaitRaf = null;

  homeLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (prefersReducedMotion.matches) return;

      if (scrollWaitRaf !== null) {
        window.cancelAnimationFrame(scrollWaitRaf);
        scrollWaitRaf = null;
      }

      if (window.scrollY <= 120) {
        hasLeftHero = false;
        triggerReplay();
        return;
      }

      const startAt = window.performance ? window.performance.now() : Date.now();
      const waitForTop = () => {
        const now = window.performance ? window.performance.now() : Date.now();
        if (window.scrollY <= 120 || now - startAt > 950) {
          scrollWaitRaf = null;
          if (!heroSection.classList.contains("is-hero-play")) {
            hasLeftHero = false;
            triggerReplay();
          }
          return;
        }
        scrollWaitRaf = window.requestAnimationFrame(waitForTop);
      };
      scrollWaitRaf = window.requestAnimationFrame(waitForTop);
    });
  });
}

/**
 * Reset scroll position back to the Hero top when refreshing or loading without a sub-section hash.
 */
function initTopOnRefresh() {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  const nav =
    window.performance && window.performance.getEntriesByType
      ? window.performance.getEntriesByType("navigation")[0]
      : null;
  const isReload =
    (nav && nav.type === "reload") ||
    (window.performance && window.performance.navigation && window.performance.navigation.type === 1);

  const shouldResetToTop = isReload || !window.location.hash || window.location.hash === "#home";
  if (!shouldResetToTop) return;

  const snapTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  snapTop();
  window.addEventListener("load", () => {
    window.requestAnimationFrame(snapTop);
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) snapTop();
  });
}

const SITE_TRANSLATIONS = {
  id: {
    "title.home": "Portofolio — Zaki Yusron Hasyimmi",
    "title.contact": "Kontak — Zaki Yusron Hasyimmi",
    "title.project": "Detail Proyek — Zaki Yusron Hasyimmi",
    "nav.home": "BERANDA",
    "nav.about": "TENTANG",
    "nav.skills": "TECH STACK",
    "nav.work": "KARYA",
    "nav.contact": "KONTAK",
    "nav.mobileAria": "Navigasi Seluler",
    "mobile.home": "Beranda",
    "mobile.about": "Tentang",
    "mobile.stack": "Stack",
    "mobile.work": "Karya",
    "mobile.contact": "Kontak",
    "lang.groupAria": "Pilih bahasa",
    "hero.portraitAlt": "Potret Zaki Yusron Hasyimmi",
    "hero.arrowAria": "Gulir ke bagian Tentang",
    "hero.githubAria": "Profil GitHub Zaki Yusron Hasyimmi",
    "about.back": "Kembali",
    "about.backAria": "Kembali ke ringkasan",
    "about.prevAria": "Slide sebelumnya",
    "about.nextAria": "Slide berikutnya",
    "about.workAria": "Lihat bagian Karya",
    "about.readMore": "SELENGKAPNYA",
    "about.tabOverview": "Ringkasan",
    "about.tabStack": "Stack Utama",
    "about.tabFocus": "Fokus",
    "about.hire": "HUBUNGI",
    "about.contactAria": "Buka formulir kontak",
    "modal.kicker": "KONTAK LANGSUNG",
    "modal.title": "KIRIM PESAN",
    "modal.closeAria": "Tutup",
    "modal.copyEmail": "Salin Email",
    "modal.nameLabel": "Nama Lengkap",
    "modal.namePlaceholder": "Nama kamu",
    "modal.emailLabel": "Alamat Email",
    "modal.emailPlaceholder": "nama@email.com",
    "modal.messageLabel": "Pesan / Detail Proyek",
    "modal.messagePlaceholder": "Tulis pesan atau kebutuhan proyek...",
    "modal.submit": "KIRIM PESAN",
    "work.title": "PORTFOLIO.",
    "work.prevAria": "Proyek sebelumnya",
    "work.nextAria": "Proyek berikutnya",
    "work.dotsAria": "Navigasi halaman portofolio",
    "work.viewDetails": "SELENGKAPNYA",
    "work.modalStack": "TECH STACK",
    "work.modalBack": "KEMBALI",
    "work.modalPrevAria": "Proyek sebelumnya",
    "work.modalNextAria": "Proyek berikutnya",
    "work.modalGithub": "LIHAT DI GITHUB",
    "work.allProjects": "SEMUA PROYEK",
    "projectsPage.title": "Semua Proyek — Zaki Yusron Hasyimmi",
    "projectsPage.backHome": "BERANDA",
    "projectsPage.kicker": "ARSIP KARYA // 2026",
    "projectsPage.heading": "SEMUA PROYEK.",
    "projectsPage.subtitle": "Kumpulan aplikasi web, sistem fullstack, dan eksplorasi antarmuka yang telah dibangun.",
    "projectsPage.countSuffix": "PROYEK",
    "projectsPage.filterAria": "Filter kategori proyek",
    "projectsPage.filterAll": "Semua",
    "projectsPage.filterFullstack": "Fullstack",
    "projectsPage.filterWeb": "Frontend & UI",
    "projectsPage.githubAria": "Buka repository GitHub",
    "work.highlightsTitle": "FITUR UTAMA",
    "work.collaboratorsTitle": "KOLABORATOR TIM",
    "work.livePreview": "BUKA LIVE",
    "work.zoomAria": "Perbesar pratinjau",
    "work.galleryAria": "Galeri pratinjau proyek",
    "work.pendingShot": "Slot screenshot siap ditambahkan",
    "work.shotPrevAria": "Screenshot sebelumnya",
    "work.shotNextAria": "Screenshot berikutnya",
    "work.lightboxCloseAria": "Tutup pratinjau",
    "work.shot1Default": "Tampilan Utama",
    "work.shot2Default": "Tampilan Fitur",
    "work.shot3Default": "Tampilan Lanjutan",
    "work.p1.cat": "Fullstack Web",
    "work.p1.title": "Pokja Hima Informatika",
    "work.p1.desc": "Portal terpadu pendaftaran, aktivasi & presensi QR, poin keaktifan, dan manajemen kelompok acara HIMA Informatika.",
    "work.p1.detail": "Aplikasi web fullstack berbasis Laravel 13 dan MySQL untuk acara HIMA Informatika—mencakup pendaftaran peserta, aktivasi akun via QR tiket, presensi QR (layar proyektor & scanner HP), leaderboard poin keaktifan, manajemen kelompok, serta rekap kuesioner admin.",
    "work.p1.shot1": "Login Page",
    "work.p1.shot2": "Dashboard Admin",
    "work.p1.shot3": "Dashboard Mahasiswa",
    "work.p1.shot4": "Leaderboard Mahasiswa",
    "work.p1.h1": "Aktivasi akun mahasiswa via QR tiket & login NIM",
    "work.p1.h2": "Presensi QR real-time proyektor & scanner HP",
    "work.p1.h3": "Leaderboard poin keaktifan, kelompok & kuesioner",
    "work.p2.badge": "Project Lomba",
    "work.p2.cat": "Fullstack SaaS",
    "work.p2.title": "Kasly — Kas Ormawa",
    "work.p2.desc": "Platform SaaS multi-tenant untuk manajemen kas, penagihan iuran berkala, dan pembayaran otomatis Midtrans organisasi mahasiswa.",
    "work.p2.detail": "Aplikasi web lomba fullstack berbasis Laravel 13 dan Tailwind v4 untuk tata kelola keuangan Ormawa—menghadirkan isolasi multi-tenant, buku kas anti-manipulasi (Locked Ledger), metrik kepatuhan bayar, registrasi QR anggota, pembayaran Midtrans (QRIS/VA/E-Wallet), serta notifikasi WhatsApp OTP via Fonnte API.",
    "work.p2.shot1": "Landing Page",
    "work.p2.shot2": "Dashboard Admin",
    "work.p2.shot3": "Dashboard Anggota",
    "work.p2.shot4": "Metode Pembayaran",
    "work.p2.h1": "Arsitektur multi-tenant & buku kas terkunci (Locked Ledger)",
    "work.p2.h2": "Pembayaran Midtrans QRIS/VA & verifikasi kas tunai bendahara",
    "work.p2.h3": "Skor kepatuhan iuran, pendaftaran QR & WhatsApp OTP (Fonnte)",
    "work.p3.cat": "Fullstack Analytics",
    "work.p3.title": "SMADIMENT — Social Analytics",
    "work.p3.desc": "Platform analitik media sosial & berita untuk pemantauan sentimen real-time, Net Sentiment Score, dan laporan multi-platform.",
    "work.p3.detail": "Platform analitik berbasis Laravel 12 dan Chart.js untuk memantau sentimen publik serta tren isu lintas X, Instagram, TikTok, Facebook, YouTube, dan media online—dilengkapi kalkulasi Net Sentiment Score, Share of Voice, Word Cloud, peta lokasi, AI Analysis, serta ekspor PDF/gambar.",
    "work.p3.shot1": "Landing Page",
    "work.p3.shot2": "Dashboard Utama",
    "work.p3.shot3": "Net Sentiment Score",
    "work.p3.shot4": "Data Overview",
    "work.p3.h1": "Pantau sentimen real-time lintas 6 kanal sosial media & berita online",
    "work.p3.h2": "Kalkulasi Net Sentiment Score (NSS), Share of Voice, Word Cloud & peta lokasi",
    "work.p3.h3": "Visualisasi Chart.js, AI Analysis proxy & ekspor laporan PDF/gambar",
    "work.p4.cat": "GovTech Fullstack",
    "work.p4.title": "PATEN PAK MIKO — E-Perizinan",
    "work.p4.desc": "Portal pelayanan Pertimbangan Teknis Pertanahan terintegrasi Kantor Pertanahan Kota Sukabumi dengan kontrol SLA dan WhatsApp Gateway.",
    "work.p4.detail": "Sistem layanan pertanahan & tata ruang (PKKPR) berbasis Laravel 13 dan MySQL untuk Kantor Pertanahan Kota Sukabumi—mengelola 5 alur permohonan (Berusaha, Non-Berusaha, Kebijakan, Tanah Timbul, PSN), modul LAPOL PAK & peta publik Leaflet, kendali SLA lintas BPN–PUTR–PTSP, ekspor dokumen PDF/Word, notifikasi WhatsApp API, serta backup database otomatis.",
    "work.p4.shot1": "Landing Page & Layanan",
    "work.p4.shot2": "Kontak & Helpdesk WA",
    "work.p4.shot3": "Dashboard Admin & SLA",
    "work.p4.shot4": "Detail & Timeline Berkas",
    "work.p4.h1": "5 alur perizinan pertanahan (PKKPR Berusaha, Non-Berusaha, Kebijakan, Tanah Timbul, PSN) + LAPOL PAK & INFORMAL",
    "work.p4.h2": "Kendali SLA multi-tahap lintas BPN, Dinas PUTR & PTSP, peta Leaflet, dan cetak PDF/Word (DomPDF & PHPWord)",
    "work.p4.h3": "Integrasi WhatsApp API (Fonnte/Twilio), pencarian KBLI otomatis & backup database SQL/ZIP",
    "work.p5.cat": "IoT & Cloud Fullstack",
    "work.p5.title": "ELDERA — Smart Elderly Care",
    "work.p5.desc": "Ekosistem pemantauan kesehatan lansia berbasis IoT (ESP32) dan Huawei Cloud IoTDA/RDS untuk 11th Huawei ICT Competition.",
    "work.p5.detail": "Aplikasi web lomba 11th Huawei ICT Competition (Innovation Track) berbasis React 19, Express.js, dan Huawei Cloud RDS MySQL—mengintegrasikan telemetri jam tangan ESP32 (MPU-6050, DHT22, QR OLED) serta protokol MQTT Huawei Cloud IoTDA untuk memantau detak jantung real-time, deteksi jatuh dengan jendela verifikasi 30 detik, sensor asap/suhu rumah, pengingat jadwal obat, serta AI Companion Sahabat Peduli.",
    "work.p5.shot1": "Pairing Smartwatch",
    "work.p5.shot2": "Dashboard Biometrik",
    "work.p5.shot3": "Keamanan Rumah & Log",
    "work.p5.shot4": "Jadwal & AI Companion",
    "work.p5.h1": "Arsitektur Dual-Proof IoT: ESP32 (Wokwi) + MQTT Huawei Cloud IoTDA ke Huawei Cloud RDS MySQL",
    "work.p5.h2": "Pantauan biometrik real-time (BPM, langkah, suhu), deteksi jatuh 30 detik & sensor asap/gas rumah",
    "work.p5.h3": "Pairing QR perangkat, pengingat jadwal obat harian, AI Companion Sahabat Peduli & privasi UU PDP",
    "work.p6.cat": "AI & Web Game",
    "work.p6.title": "Connect-Four AI — Minimax",
    "work.p6.desc": "Game strategi Connect-Four dengan engine Depth-Limited Minimax, Alpha-Beta Pruning, dan sinkronisasi 1:1 antara Google Colab & Web UI.",
    "work.p6.detail": "Aplikasi game AI Connect-Four berbasis Depth-Limited Minimax dan fungsi evaluasi heuristik 6-komponen yang dioptimalkan dengan Alpha-Beta Pruning—mendukung mode Manusia vs AI, PvP, 4-Player Arena (Paranoid Minimax), serta variasi papan Klasik dan Obstacle hingga 8×10 yang sinkron 1:1 antara Notebook Python Google Colab dan Web UI interaktif.",
    "work.p6.shot1": "Landing & Main Menu",
    "work.p6.shot2": "Lobby Pertandingan",
    "work.p6.shot3": "Arena Permainan",
    "work.p6.shot4": "Analisis & Benchmark",
    "work.p6.h1": "Depth-Limited Minimax, evaluasi heuristik 6-komponen & Alpha-Beta Pruning (hemat hingga 91,7% node)",
    "work.p6.h2": "4 mode bermain (vs AI, PvP, 4-Player Paranoid Minimax, Bot vs Bot) + papan Klasik/Obstacle s.d. 8×10",
    "work.p6.h3": "Sinkronisasi 1:1 Notebook Python Google Colab & Web UI dengan panel benchmark node pasca-game",
    "work.p7.cat": "Portal Akademik",
    "work.p7.title": "Portal Prodi KPI — IAI PERSIS",
    "work.p7.desc": "Website resmi Program Studi S1 Komunikasi dan Penyiaran Islam (KPI) IAI PERSIS Bandung lengkap dengan direktori AMI & CMS Admin.",
    "work.p7.detail": "Portal web fullstack berbasis Laravel 13, React, Inertia.js, dan MySQL untuk Program Studi S1 Komunikasi dan Penyiaran Islam (KPI) IAI PERSIS Bandung—memuat 30+ halaman publik profil prodi, struktur organisasi interaktif, browser direktori Pedoman & Instrumen AMI, jadwal/kalender akademik, konsultasi WhatsApp, serta panel CMS Admin dan ekspor Excel.",
    "work.p7.shot1": "Landing Page Prodi KPI",
    "work.p7.shot2": "Visi, Misi & Tujuan",
    "work.p7.shot3": "Dokumen Mutu & AMI",
    "work.p7.shot4": "Struktur Organisasi",
    "work.p7.h1": "Arsitektur Laravel 13 + React & Inertia.js SPA-like dengan 30+ halaman publik akademik",
    "work.p7.h2": "Direktori interaktif Pedoman & Instrumen AMI (pencarian folder & preview dokumen PDF)",
    "work.p7.h3": "Struktur organisasi hierarkis interaktif, berita/kurikulum, konsultasi WA & CMS Admin",
    "work.p8.cat": "Portal SPMI",
    "work.p8.title": "Portal LPM — IAI PERSIS",
    "work.p8.desc": "Website resmi Lembaga Penjaminan Mutu (LPM) IAI PERSIS Bandung untuk pengelolaan SPMI siklus PPEPP, AMI, dan dokumen mutu.",
    "work.p8.detail": "Portal web fullstack berbasis Laravel 13, React, Inertia.js, dan MySQL untuk Lembaga Penjaminan Mutu (LPM) IAI PERSIS Bandung—menyajikan pusat unduhan dan preview langsung dokumen SPMI (kebijakan, manual mutu PPEPP, standar, SOP & formulir), modul Audit Mutu Internal (AMI), status akreditasi, survei mutu, berita, serta panel CMS Admin.",
    "work.p8.shot1": "Landing Page LPM",
    "work.p8.shot2": "Tentang LPM",
    "work.p8.shot3": "Dokumen Mutu & SPMI",
    "work.p8.shot4": "Sambutan Ketua LPM",
    "work.p8.h1": "Pengelolaan SPMI berbasis siklus PPEPP (Penetapan, Pelaksanaan, Evaluasi, Pengendalian & Peningkatan)",
    "work.p8.h2": "Pusat Unduhan Dokumen SPMI per kategori lengkap dengan tombol preview langsung & unduh PDF",
    "work.p8.h3": "Portal Audit Mutu Internal (AMI), Status Akreditasi, Survei Mutu & CMS Admin terpadu",
    "work.p9.cat": "Forum & Survei HIMA",
    "work.p9.title": "Forum HMIF — Aspirasi & KSM",
    "work.p9.desc": "Platform aspirasi mahasiswa Teknik Informatika dan survei peminatan Kelompok Studi Mahasiswa (KSM) untuk HIMA IF IDE LPKIA.",
    "work.p9.detail": "Aplikasi web fullstack berbasis Laravel 13, React, TypeScript, Inertia.js, dan MySQL untuk HIMA Informatika IDE LPKIA—memfasilitasi pengiriman aspirasi terbuka/anonim, voting & komentar topik populer, formulir survei kebutuhan & minat Kelompok Studi Mahasiswa (KSM), notifikasi email ke pengurus, proteksi rate-limiting, serta dashboard rekapitulasi KSM dengan ekspor CSV.",
    "work.p9.shot1": "Forum & Aspirasi Cepat",
    "work.p9.shot2": "Survei Peminatan KSM",
    "work.p9.shot3": "Topik Populer & Alur",
    "work.p9.shot4": "Dashboard & Admin KSM",
    "work.p9.h1": "Kanal aspirasi terbuka dengan fitur kirim cepat, voting dukungan, komentar & notifikasi email",
    "work.p9.h2": "Kuesioner Survei Kebutuhan & Minat KSM serta rekapitulasi data admin siap ekspor CSV",
    "work.p9.h3": "Stack Laravel 13 + React TypeScript + Inertia.js dengan manajemen role user & rate-limiting",
    "contact.heading": "Hubungi saya",
    "contact.hoursLabel": "Jam tersedia",
    "contact.hoursDays": "Senin \u2013 Jumat",
    "contact.hoursTime": "09:00 \u2013 17:00 WIB",
    "contact.nameLabel": "Nama (wajib)",
    "contact.firstNamePh": "Nama Depan",
    "contact.lastNamePh": "Nama Belakang",
    "contact.serviceLabel": "Layanan",
    "contact.service1": "Pengembangan Web",
    "contact.service2": "Desain UI/UX",
    "contact.service3": "Fullstack Laravel",
    "contact.service4": "Konsultasi",
    "contact.emailLabel": "Email (wajib)",
    "contact.emailPh": "anda@contoh.com",
    "contact.descLabel": "Deskripsi proyek",
    "contact.descPh": "Ceritakan singkat tentang proyek Anda...",
    "contact.submit": "Kirim",
    "common.scrollTopAria": "Kembali ke atas",
    "audio.toggleAria": "Putar atau bisukan musik latar",
    "audio.playAria": "Putar musik latar",
    "audio.pauseAria": "Bisukan musik latar"
  },
  en: {
    "title.home": "Portfolio — Zaki Yusron Hasyimmi",
    "title.contact": "Contact — Zaki Yusron Hasyimmi",
    "title.project": "Project Detail — Zaki Yusron Hasyimmi",
    "nav.home": "HOME",
    "nav.about": "ABOUT ME",
    "nav.skills": "TECH STACK",
    "nav.work": "WORK",
    "nav.contact": "CONTACT",
    "nav.mobileAria": "Mobile Navigation",
    "mobile.home": "Home",
    "mobile.about": "About",
    "mobile.stack": "Stack",
    "mobile.work": "Work",
    "mobile.contact": "Contact",
    "lang.groupAria": "Choose language",
    "hero.portraitAlt": "Portrait of Zaki Yusron Hasyimmi",
    "hero.arrowAria": "Scroll to About section",
    "hero.githubAria": "GitHub profile of Zaki Yusron Hasyimmi",
    "about.back": "Back",
    "about.backAria": "Back to overview",
    "about.prevAria": "Previous slide",
    "about.nextAria": "Next slide",
    "about.workAria": "Jump to work",
    "about.readMore": "READ MORE",
    "about.tabOverview": "Overview",
    "about.tabStack": "Core Stack",
    "about.tabFocus": "Focus",
    "about.hire": "HIRE ME",
    "about.contactAria": "Open contact form",
    "modal.kicker": "DIRECT CONTACT",
    "modal.title": "SEND A MESSAGE",
    "modal.closeAria": "Close",
    "modal.copyEmail": "Copy Email",
    "modal.nameLabel": "Full Name",
    "modal.namePlaceholder": "Your name",
    "modal.emailLabel": "Email Address",
    "modal.emailPlaceholder": "you@example.com",
    "modal.messageLabel": "Message / Project Details",
    "modal.messagePlaceholder": "Tell me about your message or project...",
    "modal.submit": "SEND MESSAGE",
    "work.title": "PORTFOLIO.",
    "work.prevAria": "Previous projects",
    "work.nextAria": "Next projects",
    "work.dotsAria": "Portfolio slide pagination",
    "work.viewDetails": "VIEW DETAILS",
    "work.modalStack": "TECH STACK",
    "work.modalBack": "BACK",
    "work.modalPrevAria": "Previous project",
    "work.modalNextAria": "Next project",
    "work.modalGithub": "VIEW ON GITHUB",
    "work.allProjects": "ALL PROJECTS",
    "projectsPage.title": "All Projects — Zaki Yusron Hasyimmi",
    "projectsPage.backHome": "HOME",
    "projectsPage.kicker": "WORK ARCHIVE // 2026",
    "projectsPage.heading": "ALL PROJECTS.",
    "projectsPage.subtitle": "Selected web applications, fullstack systems, and interface engineering works.",
    "projectsPage.countSuffix": "PROJECTS",
    "projectsPage.filterAria": "Filter project categories",
    "projectsPage.filterAll": "All",
    "projectsPage.filterFullstack": "Fullstack",
    "projectsPage.filterWeb": "Frontend & UI",
    "projectsPage.githubAria": "Open GitHub repository",
    "work.highlightsTitle": "KEY FEATURES",
    "work.collaboratorsTitle": "COLLABORATORS",
    "work.livePreview": "LIVE PREVIEW",
    "work.zoomAria": "Expand preview",
    "work.galleryAria": "Project preview gallery",
    "work.pendingShot": "Screenshot slot ready to attach",
    "work.shotPrevAria": "Previous screenshot",
    "work.shotNextAria": "Next screenshot",
    "work.lightboxCloseAria": "Close preview",
    "work.shot1Default": "Main View",
    "work.shot2Default": "Feature View",
    "work.shot3Default": "Secondary View",
    "work.p1.cat": "Fullstack Web",
    "work.p1.title": "Pokja Hima Informatika",
    "work.p1.desc": "Integrated portal for registration, QR ticket activation & attendance, activity points, and group management for HIMA Informatics.",
    "work.p1.detail": "Fullstack Laravel 13 and MySQL web application built for HIMA Informatics events—covering participant registration, QR-ticket account activation, QR attendance (projector display & mobile scanner), activity-point leaderboard, team management, and admin questionnaire analytics.",
    "work.p1.shot1": "Login Page",
    "work.p1.shot2": "Admin Dashboard",
    "work.p1.shot3": "Student Dashboard",
    "work.p1.shot4": "Student Leaderboard",
    "work.p1.h1": "Student activation via QR ticket & NIM login",
    "work.p1.h2": "Real-time projector QR & mobile scanner attendance",
    "work.p1.h3": "Activity-point leaderboard, team setup & surveys",
    "work.p2.badge": "Competition Project",
    "work.p2.cat": "Fullstack SaaS",
    "work.p2.title": "Kasly — Treasury SaaS",
    "work.p2.desc": "Multi-tenant SaaS platform for student organization treasury, scheduled dues billing, and automated Midtrans payments.",
    "work.p2.detail": "Competition fullstack Laravel 13 and Tailwind v4 web platform for student organization finances—featuring multi-tenant isolation, tamper-proof Locked Ledger bookkeeping, on-time compliance scoring, QR member registration, Midtrans (QRIS/VA/E-Wallet) checkout, and Fonnte WhatsApp OTP alerts.",
    "work.p2.shot1": "Landing Page",
    "work.p2.shot2": "Admin Dashboard",
    "work.p2.shot3": "Member Dashboard",
    "work.p2.shot4": "Payment Methods",
    "work.p2.h1": "Multi-tenant isolation & tamper-proof Locked Ledger",
    "work.p2.h2": "Midtrans QRIS/VA checkout & treasurer cash verification",
    "work.p2.h3": "On-time payment scoring, QR sign-up & Fonnte WhatsApp OTP",
    "work.p3.cat": "Fullstack Analytics",
    "work.p3.title": "SMADIMENT — Social Analytics",
    "work.p3.desc": "Social media & online news analytics platform for real-time sentiment tracking, Net Sentiment Score, and multi-platform reporting.",
    "work.p3.detail": "Laravel 12 and Chart.js intelligence platform monitoring public sentiment and trending issues across X, Instagram, TikTok, Facebook, YouTube, and online news—featuring Net Sentiment Score calculation, Share of Voice, Word Cloud, geo-mapping, AI analysis, and PDF/image exports.",
    "work.p3.shot1": "Landing Page",
    "work.p3.shot2": "Main Dashboard",
    "work.p3.shot3": "Net Sentiment Score",
    "work.p3.shot4": "Data Overview",
    "work.p3.h1": "Real-time sentiment tracking across 6 social & online news channels",
    "work.p3.h2": "Net Sentiment Score (NSS), Share of Voice, Word Cloud & geo-mapping",
    "work.p3.h3": "Interactive Chart.js charts, AI analysis proxy & PDF/image exports",
    "work.p4.cat": "GovTech Fullstack",
    "work.p4.title": "PATEN PAK MIKO — Land Licensing",
    "work.p4.desc": "Integrated Land Technical Consideration & spatial licensing portal for Sukabumi Land Office with multi-stage SLA control and WhatsApp Gateway.",
    "work.p4.detail": "Laravel 13 and MySQL govtech portal for the Sukabumi Land Office—streamlining five spatial licensing workflows (Business, Non-Business, Policy, Emergent Land, PSN) alongside LAPOL PAK complaints, an interactive Leaflet GIS map, cross-agency SLA tracking, DomPDF/PHPWord document generation, WhatsApp API notifications, and automated database backups.",
    "work.p4.shot1": "Landing & Services",
    "work.p4.shot2": "Contact & WA Helpdesk",
    "work.p4.shot3": "Admin & SLA Dashboard",
    "work.p4.shot4": "Application Timeline",
    "work.p4.h1": "5 spatial licensing workflows (Business, Non-Business, Policy, Emergent Land, PSN) plus LAPOL PAK & GIS map",
    "work.p4.h2": "Cross-agency SLA tracking (BPN, PUTR, PTSP), Leaflet coordinate lookup & DomPDF/PHPWord document generation",
    "work.p4.h3": "WhatsApp API integration (Fonnte/Twilio), KBLI lookup & automated SQL/ZIP backups",
    "work.p5.cat": "IoT & Cloud Fullstack",
    "work.p5.title": "ELDERA — Smart Elderly Care",
    "work.p5.desc": "IoT elderly health & home-safety monitoring ecosystem built with ESP32 and Huawei Cloud IoTDA/RDS for the 11th Huawei ICT Competition.",
    "work.p5.detail": "Competition platform built for the 11th Huawei ICT Competition (Innovation Track) using React 19, Express.js, and Huawei Cloud RDS MySQL—combining ESP32 smartwatch telemetry (MPU-6050, DHT22, OLED QR) and Huawei Cloud IoTDA MQTT forwarding for real-time heart rate monitoring, 30-second fall confirmation, home gas/temperature alerts, medication schedules, and the Sahabat Peduli AI Companion.",
    "work.p5.shot1": "Smartwatch Pairing",
    "work.p5.shot2": "Biometric Dashboard",
    "work.p5.shot3": "Home Safety & Logs",
    "work.p5.shot4": "Schedule & AI Companion",
    "work.p5.h1": "Dual-Proof IoT pipeline: ESP32 (Wokwi) + Huawei Cloud IoTDA MQTT forwarding to Huawei Cloud RDS MySQL",
    "work.p5.h2": "Real-time biometrics (BPM, steps, temp), 30s fall confirmation & ambient smoke/gas alerts",
    "work.p5.h3": "QR device pairing, daily medication reminders, Sahabat Peduli AI Companion & privacy controls",
    "work.p6.cat": "AI & Web Game",
    "work.p6.title": "Connect-Four AI — Minimax",
    "work.p6.desc": "Strategy game engine powered by Depth-Limited Minimax, Alpha-Beta Pruning, and 1:1 Python Colab & interactive Web UI parity.",
    "work.p6.detail": "Connect-Four adversarial AI web game powered by Depth-Limited Minimax, a 6-component heuristic evaluator, and Alpha-Beta Pruning—supporting Human vs AI, local PvP, 4-Player Arena (Paranoid Minimax), and Classic/Obstacle boards up to 8×10 with 1:1 logic parity between Google Colab Python and interactive Web UI.",
    "work.p6.shot1": "Landing & Main Menu",
    "work.p6.shot2": "Match Lobby Setup",
    "work.p6.shot3": "Live Game Arena",
    "work.p6.shot4": "Analysis & Benchmark",
    "work.p6.h1": "Depth-Limited Minimax, 6-factor heuristic scoring & Alpha-Beta Pruning (up to 91.7% node reduction)",
    "work.p6.h2": "4 game modes (vs AI, PvP, 4-Player Paranoid Minimax, Bot vs Bot) & Classic/Obstacle boards up to 8×10",
    "work.p6.h3": "1:1 Python Colab & JavaScript parity check with post-match node benchmark & step inspector",
    "work.p7.cat": "Academic Portal",
    "work.p7.title": "KPI Study Program Portal — IAI PERSIS",
    "work.p7.desc": "Official portal for the Islamic Communication & Broadcasting (KPI) program at IAI PERSIS Bandung with AMI directory and Admin CMS.",
    "work.p7.detail": "Fullstack Laravel 13, React, Inertia.js, and MySQL web portal for the Islamic Communication & Broadcasting (KPI) Department at IAI PERSIS Bandung—delivering 30+ public academic pages, an interactive organization chart, a searchable Internal Quality Audit (AMI) document directory, academic calendars, WhatsApp helpdesk, and a full Admin CMS with Excel exports.",
    "work.p7.shot1": "KPI Landing Page",
    "work.p7.shot2": "Vision, Mission & Goals",
    "work.p7.shot3": "AMI Document Directory",
    "work.p7.shot4": "Organization Structure",
    "work.p7.h1": "Laravel 13 + React & Inertia.js SPA architecture serving 30+ academic & department pages",
    "work.p7.h2": "Searchable Quality Assurance (AMI) document directory with inline PDF streaming viewer",
    "work.p7.h3": "Interactive leadership org-chart, curriculum/news CMS, WhatsApp helpdesk & Admin dashboard",
    "work.p8.cat": "Quality Assurance",
    "work.p8.title": "LPM Portal — IAI PERSIS",
    "work.p8.desc": "Official Quality Assurance Institute (LPM) portal of IAI PERSIS Bandung managing PPEPP cycles, AMI audits, and SPMI documents.",
    "work.p8.detail": "Fullstack Laravel 13, React, Inertia.js, and MySQL quality assurance portal for Lembaga Penjaminan Mutu (LPM) at IAI PERSIS Bandung—providing categorized SPMI policy, PPEPP manual, SOP & form downloads with inline preview, Internal Quality Audit (AMI) portals, accreditation status, quality surveys, and an Admin CMS.",
    "work.p8.shot1": "LPM Landing Page",
    "work.p8.shot2": "About LPM",
    "work.p8.shot3": "SPMI Document Center",
    "work.p8.shot4": "LPM Chair Welcome",
    "work.p8.h1": "SPMI quality cycle management (PPEPP: Policy, Implementation, Evaluation, Control & Improvement)",
    "work.p8.h2": "Categorized SPMI Document Download Center with inline preview and PDF export actions",
    "work.p8.h3": "Internal Quality Audit (AMI), accreditation status, quality surveys & unified Admin CMS",
    "work.p9.cat": "Student Forum & Survey",
    "work.p9.title": "Forum HMIF — Aspirations & KSM",
    "work.p9.desc": "Informatics student aspiration hub and Study Group (KSM) interest survey platform built for HIMA IF IDE LPKIA.",
    "work.p9.detail": "Fullstack Laravel 13, React, TypeScript, Inertia.js, and MySQL web platform for HIMA Informatika IDE LPKIA—supporting open student aspirations, upvotes and comments on trending topics, a Student Study Group (KSM) demand & mentoring survey, officer email notifications, rate-limited endpoints, and an Admin KSM recap dashboard with CSV exports.",
    "work.p9.shot1": "Forum & Quick Aspiration",
    "work.p9.shot2": "KSM Interest Survey",
    "work.p9.shot3": "Top Topics & Flow",
    "work.p9.shot4": "Dashboard & KSM Admin",
    "work.p9.h1": "Open student aspiration board with quick submission, upvote ranking, comments & email alerts",
    "work.p9.h2": "Student Study Group (KSM) demand survey workflow with Admin recap & CSV export",
    "work.p9.h3": "Laravel 13 + React TypeScript + Inertia.js stack with role management & endpoint throttling",
    "contact.heading": "Contact me",
    "contact.hoursLabel": "Available hours",
    "contact.hoursDays": "Monday \u2013 Friday",
    "contact.hoursTime": "09:00 AM \u2013 05:00 PM WIB",
    "contact.nameLabel": "Name (required)",
    "contact.firstNamePh": "First Name",
    "contact.lastNamePh": "Last Name",
    "contact.serviceLabel": "Service",
    "contact.service1": "Web Development",
    "contact.service2": "UI/UX Design",
    "contact.service3": "Fullstack Laravel",
    "contact.service4": "Consultation",
    "contact.emailLabel": "Email (required)",
    "contact.emailPh": "you@example.com",
    "contact.descLabel": "Project description",
    "contact.descPh": "Tell me briefly about your project...",
    "contact.submit": "Submit",
    "common.scrollTopAria": "Back to top",
    "audio.toggleAria": "Play or mute background audio",
    "audio.playAria": "Play background audio",
    "audio.pauseAria": "Mute background audio"
  }
};

/**
 * Initialize and persist ID / EN language switching across Navbar and Hero elements.
 */
function initLanguageSwitcher() {
  const STORAGE_KEY = "portfolioLang";
  const langButtons = document.querySelectorAll(".lang-btn[data-lang]");
  const textNodes = document.querySelectorAll("[data-i18n]");
  const ariaNodes = document.querySelectorAll("[data-i18n-aria]");
  const altNodes = document.querySelectorAll("[data-i18n-alt]");
  const placeholderNodes = document.querySelectorAll("[data-i18n-placeholder]");

  function readSavedLang() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved && SITE_TRANSLATIONS[saved] ? saved : "id";
    } catch (_) {
      return "id";
    }
  }

  function saveLang(lang) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {
      // Ignore storage errors when restricted under local file contexts.
    }
  }

  const PAGE_TITLE_KEYS = {
    contact: "title.contact",
    project: "title.project",
  };

  function applyLanguage(lang, persist = true) {
    const activeLang = SITE_TRANSLATIONS[lang] ? lang : "id";
    const dict = SITE_TRANSLATIONS[activeLang];
    const pageKey = PAGE_TITLE_KEYS[document.body.dataset.page] || "title.home";

    document.documentElement.lang = activeLang;
    if (dict[pageKey]) {
      document.title = dict[pageKey];
    }

    textNodes.forEach((node) => {
      const key = node.dataset.i18n;
      if (dict[key]) node.textContent = dict[key];
    });

    ariaNodes.forEach((node) => {
      const key = node.dataset.i18nAria;
      if (dict[key]) node.setAttribute("aria-label", dict[key]);
    });

    altNodes.forEach((node) => {
      const key = node.dataset.i18nAlt;
      if (dict[key]) node.setAttribute("alt", dict[key]);
    });

    placeholderNodes.forEach((node) => {
      const key = node.dataset.i18nPlaceholder;
      if (dict[key]) node.setAttribute("placeholder", dict[key]);
    });

    langButtons.forEach((btn) => {
      const isActive = btn.dataset.lang === activeLang;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    if (persist) saveLang(activeLang);

    window.dispatchEvent(new CustomEvent("portfolio:langchange", { detail: { lang: activeLang } }));
  }

  applyLanguage(readSavedLang(), false);

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      applyLanguage(btn.dataset.lang, true);
    });
  });
}

/* ==================== SITE PRELOADER (DUAL-TONE TYPEWRITER & SPLIT CURTAIN) ==================== */
function initSitePreloader() {
  const root = document.documentElement;
  const preloader = document.getElementById("sitePreloader");
  const textWrap = document.getElementById("sitePreloaderText");
  const progressBar = document.getElementById("sitePreloaderBar");
  const seamFill = document.getElementById("sitePreloaderSeam");
  const percentEl = document.getElementById("sitePreloaderPercent");
  const topPane = preloader ? preloader.querySelector(".site-preloader-pane--top") : null;

  if (!preloader || !root.classList.contains("is-preloading")) {
    root.classList.remove("is-preloading");
    if (preloader) preloader.remove();
    return;
  }

  preloader.classList.add("is-active");

  const tokens = [
    { ch: "z", dot: false },
    { ch: ".", dot: true },
    { ch: "y", dot: false },
    { ch: "s", dot: false },
    { ch: "r", dot: false },
    { ch: "n", dot: false },
    { ch: "h", dot: false },
  ];

  let currentProgress = 0.06;
  const setProgress = (value) => {
    currentProgress = Math.max(currentProgress, Math.min(1, value));
    const scaleStr = `scaleX(${currentProgress.toFixed(3)})`;
    if (progressBar) {
      progressBar.style.transform = scaleStr;
    }
    if (seamFill) {
      seamFill.style.transform = scaleStr;
    }
    if (percentEl) {
      const pct = Math.round(currentProgress * 100);
      percentEl.textContent = `${String(pct).padStart(2, "0")}%`;
    }
  };

  setProgress(0.06);

  let assetsReady = false;
  let typingDone = false;
  let dismissed = false;

  const maybeDismiss = () => {
    if (dismissed || !assetsReady || !typingDone) return;
    dismissed = true;
    setProgress(1);

    window.setTimeout(() => {
      preloader.classList.add("is-card-exit");

      window.setTimeout(() => {
        const heroSection = document.getElementById("home");
        if (heroSection) {
          heroSection.classList.remove("is-hero-play");
        }

        root.classList.remove("is-preloading");

        if (heroSection) {
          void heroSection.offsetWidth;
          heroSection.classList.add("is-hero-play");
        }

        window.requestAnimationFrame(() => {
          preloader.classList.add("is-splitting");
        });

        let cleaned = false;
        const cleanup = () => {
          if (cleaned) return;
          cleaned = true;
          preloader.classList.remove("is-active", "is-card-exit", "is-splitting");
          preloader.remove();
        };

        const transitionTarget = topPane || preloader;
        transitionTarget.addEventListener("transitionend", (event) => {
          if (event.target === transitionTarget && event.propertyName === "transform") {
            cleanup();
          }
        });

        window.setTimeout(cleanup, 950);
      }, 150);
    }, 160);
  };

  const typeStep = (index) => {
    if (dismissed) return;
    if (index >= tokens.length) {
      typingDone = true;
      setProgress(assetsReady ? 1 : 0.86);
      maybeDismiss();
      return;
    }

    if (textWrap) {
      const token = tokens[index];
      const span = document.createElement("span");
      span.textContent = token.ch;
      if (token.dot) {
        span.className = "site-preloader-dot";
      }
      textWrap.appendChild(span);
    }

    const ratio = (index + 1) / tokens.length;
    setProgress(0.08 + ratio * 0.72);

    const nextDelay = index === 1 ? 155 : 92;
    window.setTimeout(() => typeStep(index + 1), nextDelay);
  };

  window.setTimeout(() => typeStep(0), 120);

  const heroImg = document.querySelector(".hero-portrait-img");
  const waitHeroImage = () => {
    if (!heroImg) return Promise.resolve();
    const decodeImg = () =>
      typeof heroImg.decode === "function"
        ? heroImg.decode().catch(() => {})
        : Promise.resolve();

    if (heroImg.complete) {
      return decodeImg();
    }

    return new Promise((resolve) => {
      const done = () => {
        heroImg.removeEventListener("load", done);
        heroImg.removeEventListener("error", done);
        decodeImg().finally(resolve);
      };
      heroImg.addEventListener("load", done, { once: true });
      heroImg.addEventListener("error", done, { once: true });
    });
  };

  const waitFonts =
    document.fonts && document.fonts.ready
      ? document.fonts.ready.catch(() => {})
      : Promise.resolve();

  const markAssetsReady = () => {
    if (assetsReady) return;
    assetsReady = true;
    setProgress(typingDone ? 1 : 0.92);
    maybeDismiss();
  };

  Promise.all([waitHeroImage(), waitFonts]).then(markAssetsReady);

  window.setTimeout(() => {
    assetsReady = true;
    typingDone = true;
    maybeDismiss();
  }, 4000);
}
