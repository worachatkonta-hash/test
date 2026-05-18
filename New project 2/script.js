const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const siteHeader = document.querySelector(".site-header");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => nav.classList.toggle("open"));
}

if (siteHeader) {
  const updateHeaderBackground = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 4);
  };

  updateHeaderBackground();
  window.addEventListener("scroll", updateHeaderBackground, { passive: true });
}

const mbmsHeroProduct = document.querySelector(".mbms-hero-product");
const mbmsFeatureProduct = document.querySelector(".mbms-feature-product img");
const mbmsScrollProduct = document.querySelector(".mbms-scroll-product");
const mbmsFeatureGrid = document.querySelector(".mbms-feature-grid");

if (mbmsHeroProduct && mbmsFeatureProduct && mbmsScrollProduct && mbmsFeatureGrid) {
  let mbmsMetrics = null;
  let mbmsMotionFrame = null;

  const rectToDocument = (rect) => ({
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
    width: rect.width,
    height: rect.height,
  });

  const mix = (a, b, progress) => a + (b - a) * progress;
  const ease = (progress) => progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

  const measureMbmsProductMotion = () => {
    mbmsHeroProduct.classList.remove("is-animation-proxy");
    mbmsFeatureProduct.classList.remove("is-animation-proxy");
    mbmsScrollProduct.style.opacity = "0";

    const source = rectToDocument(mbmsHeroProduct.getBoundingClientRect());
    const target = rectToDocument(mbmsFeatureProduct.getBoundingClientRect());
    const featureSection = rectToDocument(mbmsFeatureGrid.closest(".section").getBoundingClientRect());
    const aspect = source.height / source.width;
    const maxLargeWidth = window.innerWidth * 0.7;
    const maxLargeHeight = window.innerHeight * 0.7;
    let largeWidth = maxLargeWidth;
    let largeHeight = largeWidth * aspect;

    if (largeHeight > maxLargeHeight) {
      largeHeight = maxLargeHeight;
      largeWidth = largeHeight / aspect;
    }

    const startScroll = Math.max(0, source.top - window.innerHeight * 0.22);
    const midScroll = Math.max(0, source.top + window.innerHeight * 0.48);
    const holdEndScroll = Math.max(midScroll + 1, featureSection.top - window.innerHeight * 0.18);
    const endScroll = Math.max(holdEndScroll + 1, featureSection.top + window.innerHeight * 0.06);

    mbmsMetrics = {
      source,
      target,
      largeSize: { width: largeWidth, height: largeHeight },
      startScroll,
      midScroll,
      holdEndScroll,
      endScroll,
    };
  };

  const interpolateRect = (from, to, progress) => {
    const p = ease(Math.min(1, Math.max(0, progress)));
    return {
      left: mix(from.left, to.left, p),
      top: mix(from.top, to.top, p),
      width: mix(from.width, to.width, p),
      height: mix(from.height, to.height, p),
    };
  };

  const updateMbmsProductMotion = () => {
    if (window.innerWidth < 901) {
      mbmsHeroProduct.classList.remove("is-animation-proxy");
      mbmsFeatureProduct.classList.remove("is-animation-proxy");
      mbmsScrollProduct.style.opacity = "0";
      return;
    }

    if (!mbmsMetrics) measureMbmsProductMotion();

    const y = window.scrollY;
    const { source, target, largeSize, startScroll, midScroll, holdEndScroll, endScroll } = mbmsMetrics;
    const center = {
      left: window.scrollX + window.innerWidth * 0.5 - largeSize.width / 2,
      top: y + window.innerHeight * 0.5 - largeSize.height / 2,
      width: largeSize.width,
      height: largeSize.height,
    };
    const centerAtHoldEnd = {
      ...center,
      top: holdEndScroll + window.innerHeight * 0.5 - largeSize.height / 2,
    };
    let activeRect = null;

    if (y < startScroll) {
      activeRect = source;
      mbmsFeatureProduct.classList.add("is-animation-proxy");
    } else if (y <= midScroll) {
      activeRect = interpolateRect(source, center, (y - startScroll) / (midScroll - startScroll || 1));
      mbmsFeatureProduct.classList.add("is-animation-proxy");
    } else if (y <= holdEndScroll) {
      activeRect = center;
      mbmsFeatureProduct.classList.add("is-animation-proxy");
    } else if (y <= endScroll) {
      activeRect = interpolateRect(centerAtHoldEnd, target, (y - holdEndScroll) / (endScroll - holdEndScroll || 1));
      mbmsFeatureProduct.classList.add("is-animation-proxy");
    } else {
      activeRect = target;
      mbmsFeatureProduct.classList.remove("is-animation-proxy");
    }

    const isAnimating = y <= endScroll;
    mbmsHeroProduct.classList.toggle("is-animation-proxy", isAnimating);
    mbmsScrollProduct.style.opacity = isAnimating ? "1" : "0";
    mbmsScrollProduct.style.transform = `translate3d(${activeRect.left - window.scrollX}px, ${activeRect.top - window.scrollY}px, 0)`;
    mbmsScrollProduct.style.width = `${activeRect.width}px`;
    mbmsScrollProduct.style.height = `${activeRect.height}px`;
  };

  const requestMbmsProductMotion = () => {
    if (mbmsMotionFrame) return;
    mbmsMotionFrame = requestAnimationFrame(() => {
      mbmsMotionFrame = null;
      updateMbmsProductMotion();
    });
  };

  measureMbmsProductMotion();
  updateMbmsProductMotion();
  window.addEventListener("scroll", requestMbmsProductMotion, { passive: true });
  window.addEventListener("resize", () => {
    mbmsMetrics = null;
    measureMbmsProductMotion();
    updateMbmsProductMotion();
  });
}

document.querySelectorAll(".filter-bar button").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll(".filter-bar button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.querySelectorAll(".filterable .article-card").forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

const pdpa = document.querySelector(".pdpa-banner");
if (pdpa) {
  const accepted = localStorage.getItem("vera-pdpa-accepted");
  if (accepted) pdpa.remove();
  pdpa.querySelector("button").addEventListener("click", () => {
    localStorage.setItem("vera-pdpa-accepted", "true");
    pdpa.remove();
  });
}

const translations = {
  th: {
    "nav.home": "หน้าแรก",
    "nav.products": "ผลิตภัณฑ์",
    "nav.news": "ข่าวสารและบทความ",
    "nav.about": "เกี่ยวกับเรา",
    "nav.contact": "ติดต่อเรา",
    "nav.futureProjects": "โครงการในอนาคต",
    "hero.eyebrow": "ฝังความอัจฉริยะสู่ระบบการเคลื่อนที่",
    "hero.title": "ระบบสมองกลฝังตัวอัจฉริยะเพื่อการเพิ่มประสิทธิภาพด้านพลังงาน",
    "cta.learnMore": "เรียนรู้เพิ่มเติม",
    "alt.mbmsDevice": "อุปกรณ์ VERA M-BMS",
    "product.mbms.eyebrow": "ระบบอัจฉริยะด้านแบตเตอรี่สำหรับแพลตฟอร์มไฮบริด",
    "product.mbms.body": "ระบบเสริมการจัดการแบตเตอรี่แบบสมองกลฝังตัว ออกแบบมาเพื่อช่วยเพิ่มเสถียรภาพของแรงดันไฟฟ้าและจัดการสัญญาณของระบบแบตเตอรี่ไฮบริดได้อย่างชาญฉลาดยิ่งขึ้น",
    "product.mbms.link": "ดูผลิตภัณฑ์ ->",
    "alt.phevConcept": "แนวคิดการแปลงรถยนต์เป็นระบบ PHEV",
    "product.phev.eyebrow": "เพิ่มความเป็นไปได้ ขับเคลื่อนอย่างชาญฉลาดยิ่งขึ้น",
    "product.phev.title": "การแปลงระบบ PHEV",
    "product.phev.body": "โซลูชันการแปลงระบบที่ใช้งานได้จริง ซึ่งอยู่ระหว่างการพัฒนาเพื่อเพิ่มประสิทธิภาพ ความยืดหยุ่น และลดการปล่อยมลพิษ",
    "product.phev.link": "ดูโครงการ ->",
    "alt.powerStation": "ผลิตภัณฑ์ VERA Power Station",
    "product.power.eyebrow": "แพลตฟอร์มพลังงานแบบพกพา",
    "product.power.body": "ระบบพลังงานแบบพกพาสำหรับการใช้งานภาคสนาม อู่หรือเวิร์กช็อป และการสำรองไฟ",
    "product.power.link": "ดูแนวคิด ->",
    "product.future.eyebrow": "ระบบพลังงานแบบสมองกลฝังตัว",
    "product.future.title": "แพลตฟอร์มแห่งอนาคต",
    "product.future.body": "ระบบควบคุมและเทคโนโลยีพลังงานอัจฉริยะสำหรับอนาคต ซึ่งอยู่ระหว่างการพัฒนา",
    "product.future.link": "ดูเพิ่มเติม ->",
    "brand.eyebrow": "จุดยืนของแบรนด์",
    "brand.title": "ความอัจฉริยะเบื้องหลังพลังงานและการเคลื่อนที่",
    "brand.body": "VERA ผสานความเชี่ยวชาญด้านอิเล็กทรอนิกส์สมองกลฝังตัว ความเข้าใจในระบบยานยนต์ และวิศวกรรมระบบพลังงาน เพื่อสร้างเทคโนโลยีที่ใช้งานได้จริง ช่วยเพิ่มความน่าเชื่อถือ ประสิทธิภาพ และความพร้อมในการใช้งาน",
    "brand.link": "เรียนรู้เพิ่มเติมเกี่ยวกับเรา",
    "news.eyebrow": "ข่าวสารและบทความจาก VERA",
    "news.title": "มุมมองเชิงลึก ข่าวอัปเดต และแนวคิดทางเทคนิค",
    "news.viewAll": "ดูบทความทั้งหมด >",
    "alt.mbmsArticle": "ตัวอย่างบทความ M-BMS",
    "tag.product": "ผลิตภัณฑ์",
    "article.mbms.title": "M-BMS ช่วยดูแลสุขภาพแบตเตอรี่ไฮบริด NiMH ได้อย่างไร",
    "article.mbms.body": "สำรวจว่าการตรวจติดตามด้วยระบบสมองกลฝังตัวช่วยเพิ่มความมั่นใจต่อพฤติกรรมของแบตเตอรี่ไฮบริดได้อย่างไร",
    "article.readMore": "อ่านเพิ่มเติม >",
    "alt.blogPreview": "ตัวอย่างข่าวสารและบทความ",
    "tag.knowledge": "ความรู้",
    "article.signals.title": "สัญญาณสำคัญในระบบพลังงานเพื่อการเคลื่อนที่",
    "article.signals.body": "มุมมองเชิงปฏิบัติเกี่ยวกับระบบควบคุม การวินิจฉัย และแพลตฟอร์มพลังงานที่พร้อมสำหรับอนาคต",
    "alt.phevProgress": "ความคืบหน้าโครงการแปลงระบบ PHEV",
    "tag.news": "ข่าวสาร",
    "article.phev.title": "โครงการแปลงระบบ PHEV เข้าสู่ระยะการพัฒนา",
    "article.phev.body": "VERA กำลังพัฒนาแนวคิดการแปลงระบบ เพื่อช่วยให้รถยนต์เดิมกลับมาใช้งานได้อย่างมีประสิทธิภาพมากขึ้น",
    "contactCta.title": "มีโครงการที่ต้องการพัฒนาหรือไม่?",
    "contactCta.body": "พูดคุยกับ VERA เกี่ยวกับระบบสมองกลฝังตัวอัจฉริยะสำหรับการประยุกต์ใช้งานด้านพลังงานและการเคลื่อนที่",
    "contactCta.link": "ติดต่อเรา",
    "footer.brandBody": "ออกแบบระบบสมองกลฝังตัวอัจฉริยะเพื่อการเพิ่มประสิทธิภาพด้านพลังงาน ระบบขับเคลื่อนไฮบริด และแพลตฟอร์มพลังงานที่พร้อมสำหรับอนาคต",
    "footer.company": "บริษัท",
    "footer.aboutUs": "เกี่ยวกับเรา",
    "footer.careers": "ร่วมงานกับเรา",
    "footer.stayUpdated": "ติดตามข่าวสารจากเรา",
    "footer.subscribeBody": "สมัครรับข่าวสารผลิตภัณฑ์จาก VERA มุมมองเชิงเทคนิค และความคืบหน้าโครงการต่าง ๆ",
    "footer.emailPlaceholder": "กรอกอีเมลของคุณ",
    "footer.subscribe": "สมัครรับข่าวสาร",
    "footer.copyright": "© 2026 VERA Automotive สงวนลิขสิทธิ์",
    "footer.privacy": "นโยบายความเป็นส่วนตัว",
    "footer.terms": "ข้อกำหนดการใช้บริการ",
    "footer.cookies": "นโยบายคุกกี้",
  },
};

const applyLanguage = (language) => {
  document.documentElement.lang = language;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    if (!element.dataset.i18nEn) element.dataset.i18nEn = element.textContent;
    const translated = translations[language]?.[element.dataset.i18n];
    element.textContent = language === "en" || !translated ? element.dataset.i18nEn : translated;
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    if (!element.dataset.i18nAltEn) element.dataset.i18nAltEn = element.getAttribute("alt") || "";
    const translated = translations[language]?.[element.dataset.i18nAlt];
    element.setAttribute("alt", language === "en" || !translated ? element.dataset.i18nAltEn : translated);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    if (!element.dataset.i18nPlaceholderEn) element.dataset.i18nPlaceholderEn = element.getAttribute("placeholder") || "";
    const translated = translations[language]?.[element.dataset.i18nPlaceholder];
    element.setAttribute("placeholder", language === "en" || !translated ? element.dataset.i18nPlaceholderEn : translated);
  });
};

document.querySelectorAll(".lang-toggle").forEach((button) => {
  const savedLanguage = localStorage.getItem("vera-language");
  const initialLanguage = savedLanguage || (button.textContent.trim().startsWith("TH") ? "th" : "en");
  const renderLanguageToggle = (language) => {
    button.dataset.active = language;
    button.setAttribute("aria-label", `Current language: ${language.toUpperCase()}. Switch language`);
    button.innerHTML = `
      <span class="lang-option" data-lang="en">EN</span>
      <span class="lang-divider" aria-hidden="true">/</span>
      <span class="lang-option" data-lang="th">ไทย</span>
    `;
  };

  renderLanguageToggle(initialLanguage);
  applyLanguage(initialLanguage);

  button.addEventListener("click", () => {
    const nextLanguage = button.dataset.active === "en" ? "th" : "en";
    localStorage.setItem("vera-language", nextLanguage);
    renderLanguageToggle(nextLanguage);
    applyLanguage(nextLanguage);
  });
});

document.querySelectorAll(".footer-newsletter").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
});

// Place Google Tag Manager, Google Analytics, Facebook Pixel, and TikTok Pixel snippets here in production.
