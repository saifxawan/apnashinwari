(function () {
  const toggle = document.querySelector(".nav-toggle");
  const panel = document.querySelector("#panel");
  const header = document.querySelector(".nav");
  const searchForm = document.querySelector("#search-form");
  const searchInput = document.querySelector("#q");
  const empty = document.querySelector("#empty");
  const blocks = [...document.querySelectorAll(".block")];
  const dishes = [...document.querySelectorAll(".dish")];
  const chips = [...document.querySelectorAll(".chip")];
  const menuVisuals = {
    entrantes: {
      images: ["images/mixed-grill.jpg", "images/tandoori.jpg", "images/indian-platter.jpg"],
      es: "Entrante",
      en: "Starter",
    },
    brasa: {
      images: ["images/tandoori.jpg", "images/mixed-grill.jpg", "images/hero.jpg"],
      es: "A la brasa",
      en: "From the grill",
    },
    pollo: {
      images: ["images/thali.jpg", "images/karahi.jpg", "images/indian-platter.jpg"],
      es: "Pollo",
      en: "Chicken",
    },
    cordero: {
      images: ["images/table.jpg", "images/karahi.jpg", "images/indian-platter.jpg"],
      es: "Cordero",
      en: "Lamb",
    },
    pan: {
      images: ["images/naan-table.jpg", "images/hero.jpg", "images/indian-platter.jpg"],
      es: "Tandoor",
      en: "Tandoor",
    },
    gambas: {
      images: ["images/prawn-curry.jpg", "images/prawn-curry.jpg", "images/indian-platter.jpg"],
      es: "Marisco",
      en: "Seafood",
    },
    verduras: {
      images: ["images/curry.jpg", "images/indian-platter.jpg", "images/spices.jpg"],
      es: "Vegetariano",
      en: "Vegetarian",
    },
    arroz: {
      images: ["images/biryani.jpg", "images/table.jpg", "images/hero.jpg"],
      es: "Arroz basmati",
      en: "Basmati rice",
    },
    postres: {
      images: ["images/mango-lassi.jpg", "images/indian-platter.jpg"],
      es: "Dulce",
      en: "Sweet",
    },
    bebidas: {
      images: ["images/mango-lassi.jpg", "images/spices.jpg"],
      es: "Bebida",
      en: "Drink",
    },
  };

  const norm = (value) =>
    (value || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  let lang = "es";
  try {
    const saved = localStorage.getItem("shinwari-lang");
    const browserEn = (navigator.language || "").toLowerCase().startsWith("en");
    lang = saved || (browserEn ? "en" : "es");
  } catch (err) {
    lang = (navigator.language || "").toLowerCase().startsWith("en") ? "en" : "es";
  }
  if (lang !== "en") lang = "es";

  function enhanceDishCards() {
    blocks.forEach((block) => {
      const visual = menuVisuals[block.id] || menuVisuals.pollo;
      [...block.querySelectorAll(".dish")].forEach((dish, index) => {
        const title = dish.querySelector("h3");
        const content = dish.querySelector(":scope > div");
        if (!title || !content) return;

        const thumb = document.createElement("span");
        thumb.className = "dish-thumb";
        thumb.setAttribute("aria-hidden", "true");
        const imagePath = visual.images[index % visual.images.length].replace(
          /^images\//,
          "../images/"
        );
        dish.style.setProperty("--dish-image", `url("${imagePath}")`);
        dish.insertBefore(thumb, dish.firstChild);

        const tag = document.createElement("span");
        tag.className = "dish-tag";
        tag.setAttribute("data-es", visual.es);
        tag.setAttribute("data-en", visual.en);
        tag.textContent = visual.es;
        content.appendChild(tag);

        const order = document.createElement("a");
        order.className = "dish-add";
        order.target = "_blank";
        order.rel = "noopener";
        order.setAttribute("data-es", "+ Añadir");
        order.setAttribute("data-en", "+ Add");
        order.textContent = "+ Añadir";
        dish.appendChild(order);
      });
    });
  }

  function madridMinutes(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Madrid",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date);
    const pick = (type) => Number(parts.find((part) => part.type === type).value);
    return pick("hour") * 60 + pick("minute");
  }

  function statusCopy() {
    const minutes = madridMinutes();
    const open = (minutes >= 12 * 60 + 30 && minutes < 16 * 60) || minutes >= 19 * 60;
    let text;
    if (minutes >= 12 * 60 + 30 && minutes < 16 * 60) {
      text = lang === "en" ? "Open now · until 16:00" : "Abierto ahora · hasta las 16:00";
    } else if (minutes >= 19 * 60) {
      text = lang === "en" ? "Open now · until 00:00" : "Abierto ahora · hasta las 00:00";
    } else if (minutes >= 16 * 60 && minutes < 19 * 60) {
      text = lang === "en" ? "Closed · opens at 19:00" : "Cerrado · abrimos a las 19:00";
    } else {
      text = lang === "en" ? "Closed · opens at 12:30" : "Cerrado · abrimos a las 12:30";
    }
    return { open, text };
  }

  function menuButtonLabel() {
    const open = document.body.classList.contains("nav-open");
    if (open) return lang === "en" ? "Close menu" : "Cerrar menú";
    return lang === "en" ? "Open menu" : "Abrir menú";
  }

  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-es]").forEach((el) => {
      const value = el.getAttribute("data-" + lang);
      if (value != null) el.textContent = value;
    });
    document.querySelectorAll("[data-ph-es]").forEach((el) => {
      el.placeholder = el.getAttribute("data-ph-" + lang) || "";
    });
    document.querySelectorAll("[data-alt-es]").forEach((el) => {
      el.alt = el.getAttribute("data-alt-" + lang) || "";
    });
    const message =
      lang === "en"
        ? "Hello, I would like to order from Apna Shinwari."
        : "Hola, quiero hacer un pedido en Apna Shinwari.";
    document.querySelectorAll("[data-wa]").forEach((link) => {
      link.href = "https://wa.me/34645220358?text=" + encodeURIComponent(message);
    });
    document.querySelectorAll(".dish-add").forEach((link) => {
      const dish = link.closest(".dish");
      const dishName = dish.querySelector("h3").textContent.replace(/\s+/g, " ").trim();
      const price = dish.querySelector(".price").textContent.trim();
      const orderMessage =
        lang === "en"
          ? `Hello, I would like to order: ${dishName} (${price}).`
          : `Hola, quiero pedir: ${dishName} (${price}).`;
      link.href = "https://wa.me/34645220358?text=" + encodeURIComponent(orderMessage);
      link.setAttribute(
        "aria-label",
        lang === "en" ? `Add ${dishName} to my order` : `Añadir ${dishName} a mi pedido`
      );
    });
    document.querySelectorAll("[data-lang]").forEach((button) => {
      button.setAttribute("aria-pressed", button.dataset.lang === lang ? "true" : "false");
    });
    const { open, text } = statusCopy();
    document.querySelectorAll(".status-text").forEach((el) => {
      el.textContent = text;
    });
    document.querySelectorAll(".dot").forEach((dot) => {
      dot.classList.toggle("is-open", open);
      dot.classList.toggle("is-closed", !open);
    });
    const label = menuButtonLabel();
    toggle.setAttribute("aria-label", label);
    toggle.querySelector(".sr").textContent = label;
    try {
      localStorage.setItem("shinwari-lang", lang);
    } catch (err) {
      /* ignore private-mode storage failures */
    }
  }

  function closeNav() {
    document.body.classList.remove("nav-open");
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    const label = menuButtonLabel();
    toggle.setAttribute("aria-label", label);
    toggle.querySelector(".sr").textContent = label;
  }

  function openNav() {
    document.body.classList.add("nav-open");
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    const label = menuButtonLabel();
    toggle.setAttribute("aria-label", label);
    toggle.querySelector(".sr").textContent = label;
  }

  toggle.addEventListener("click", () => {
    if (document.body.classList.contains("nav-open")) closeNav();
    else openNav();
  });

  panel.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      lang = button.dataset.lang === "en" ? "en" : "es";
      applyLang();
    });
  });

  enhanceDishCards();

  function applyFilter() {
    const query = norm(searchInput.value.trim());
    let visible = 0;
    dishes.forEach((dish) => {
      const desc = dish.querySelector(".desc");
      const blob = norm(
        [
          dish.innerText,
          desc ? desc.getAttribute("data-es") : "",
          desc ? desc.getAttribute("data-en") : "",
        ].join(" ")
      );
      const match = !query || blob.includes(query);
      dish.hidden = !match;
      if (match) visible += 1;
    });
    blocks.forEach((block) => {
      const any = [...block.querySelectorAll(".dish")].some((dish) => !dish.hidden);
      block.hidden = !any;
    });
    empty.hidden = visible !== 0;
  }

  searchInput.addEventListener("input", applyFilter);
  searchForm.addEventListener("submit", (event) => event.preventDefault());

  chips.forEach((chip) => {
    chip.addEventListener("click", (event) => {
      const target = document.querySelector(chip.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      if (searchInput.value) {
        searchInput.value = "";
        applyFilter();
      }
      closeNav();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          chips.forEach((chip) => chip.classList.toggle("is-on", chip.getAttribute("href") === id));
        });
      },
      { rootMargin: "-45% 0px -48% 0px", threshold: 0 }
    );
    blocks.forEach((block) => observer.observe(block));
  }

  function onScroll() {
    header.classList.toggle("is-solid", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  applyLang();
})();
