/* AeroCrest Detailing. One script for every page. No dependencies. */

/*
 * Where the request form posts. Leave empty to fall back to a prepared email.
 * Paste a Formspree or Web3Forms endpoint here once the account exists,
 * for example: const FORM_ENDPOINT = "https://formspree.io/f/xxxxxxxx";
 */
const FORM_ENDPOINT = "";

const CONTACT_EMAIL = "aerocrestdetailing@gmail.com";
const CONTACT_PHONE = "(928) 642-7868";

const SERVICES = {
  "exterior-wash": "Exterior wash",
  "wash-and-wax": "Exterior wash & wax",
  "interior-detail": "Interior detail",
  "full-detail": "Full aircraft detail",
  "ceramic-coating": "Ceramic coating"
};

const CLASSES = {
  "single-engine": "Single engine",
  "twin-turboprop": "Twin / turboprop",
  "light-jet": "Light jet",
  "mid-large-jet": "Mid / large jet",
  "not-sure": "Not sure"
};

const root = document.documentElement;
root.classList.add("js");

// The font stylesheet loads as print so it never blocks the first paint; switch it on now.
document.querySelectorAll("link[data-fonts]").forEach((link) => {
  link.media = "all";
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* ---------- Mobile nav ---------- */
function initNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const header = document.querySelector("[data-header]");
  if (!toggle || !nav || !header) return;

  const setOpen = (open, returnFocus) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    header.classList.toggle("is-open", open);
    if (!open && returnFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true", false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) setOpen(false, true);
  });

  document.addEventListener("click", (event) => {
    if (nav.classList.contains("is-open") && !header.contains(event.target)) setOpen(false, false);
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a") && nav.classList.contains("is-open")) setOpen(false, false);
  });

  window.matchMedia("(min-width: 900px)").addEventListener("change", (event) => {
    if (event.matches) setOpen(false, false);
  });
}

/* ---------- Header scroll state ---------- */
function initHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* ---------- Smooth scroll for on-page anchors ---------- */
function initAnchors() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute("href").slice(1);
    const target = id && document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    history.replaceState(null, "", "#" + id);
  });
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  items.forEach((item) => observer.observe(item));
}

/* ---------- Flight path (home page) ---------- */
function initFlightPath() {
  const svg = document.querySelector("[data-flight-svg]");
  const start = document.querySelector("[data-flight-start]");
  const land = document.querySelector("[data-flight-land]");
  if (!svg || !start || !land) return;

  const main = svg.parentElement;
  const line = svg.querySelector(".flight-path__line");
  const runway = svg.querySelector(".flight-path__runway");
  const touchdown = svg.querySelector(".flight-path__touchdown");
  const gradient = svg.querySelector("linearGradient");
  const styles = getComputedStyle(root);
  const baseColor = styles.getPropertyValue("--swoosh-blue").trim();
  const liftColor = styles.getPropertyValue("--swoosh-lift").trim();

  let length = 0;
  let samples = [];
  let ticking = false;

  const pt = (x, y) => Math.round(x * 10) / 10 + "," + Math.round(y * 10) / 10;

  function build() {
    const box = main.getBoundingClientRect();
    const width = main.clientWidth;
    const height = main.scrollHeight;
    const rel = (rect) => ({
      left: rect.left - box.left,
      right: rect.right - box.left,
      top: rect.top - box.top,
      bottom: rect.bottom - box.top
    });

    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
    svg.style.height = height + "px";

    const s = rel(start.getBoundingClientRect());
    const l = rel(land.getBoundingClientRect());
    const container = document.querySelector(".hero__content");
    const c = rel(container.getBoundingClientRect());
    const pad = parseFloat(getComputedStyle(container).paddingLeft) || 16;
    const gutter = Math.max(pad, (width - (c.right - c.left)) / 2 + pad);
    const lane = width - Math.max(8, Math.min(gutter / 2, 96));
    const amp = Math.min(gutter * 0.28, 26);

    // Take off under the headline, then climb right like the logo swoosh,
    // but only once clear of the headline's last word.
    const title = rel(start.previousElementSibling.getBoundingClientRect());
    const sx = s.left;
    const sy = (s.top + s.bottom) / 2;
    const gap = s.bottom - s.top;
    const rotateX = Math.min(title.right + 24, lane - 70);
    const room = lane - rotateX;
    const span = rotateX - sx;
    const liftY = sy - gap * 0.4;
    let d = "M" + pt(sx, sy + gap * 0.3);
    d += " C" + pt(sx + span * 0.55, sy + gap * 0.3) + " " + pt(rotateX - span * 0.15, sy - gap * 0.05) + " " + pt(rotateX, liftY);
    let endX = rotateX;
    let endY = liftY;
    if (room > 160) {
      // Clear of the headline with room to spare: keep climbing before the turn.
      endX = rotateX + Math.min(room * 0.5, 200);
      endY = Math.max(title.top + 16, sy - 90);
      d += " C" + pt(rotateX + (endX - rotateX) * 0.45, liftY - 10) + " " + pt(endX - 40, endY + 14) + " " + pt(endX, endY);
    }
    // Bank into the right-hand lane and descend.
    const laneTop = sy + 170;
    d += " C" + pt(endX + (lane - endX) * 0.8, endY - (endY - liftY) * 0.2 - 4) + " " + pt(lane, endY + 30) + " " + pt(lane, laneTop);

    // Gentle S-turns down the lane until the approach.
    const lx = width / 2;
    const ly = (l.top + l.bottom) / 2;
    const approachTop = ly - 260;
    let y = laneTop;
    let side = -1;
    const legs = Math.max(1, Math.round((approachTop - laneTop) / 640));
    const step = (approachTop - laneTop) / legs;
    for (let i = 0; i < legs; i += 1) {
      const nx = lane + (i === legs - 1 ? 0 : side * amp);
      const ny = y + step;
      const prevX = i === 0 ? lane : lane + -side * amp;
      d += " C" + pt(prevX, y + step / 2) + " " + pt(nx, y + step / 2) + " " + pt(nx, ny);
      y = ny;
      side *= -1;
    }

    // Final approach: flare and touch down above the closing headline.
    d += " C" + pt(lane, ly - 90) + " " + pt(lx + Math.min(240, (lane - lx) * 0.5), ly) + " " + pt(lx + 40, ly);
    d += " L" + pt(lx, ly);
    line.setAttribute("d", d);

    runway.setAttribute("d", "M" + pt(lx - 22, ly) + " L" + pt(lx - Math.min(220, width * 0.3), ly));
    touchdown.setAttribute("cx", lx);
    touchdown.setAttribute("cy", ly);

    // Lift the stroke color wherever the line crosses a dark surface.
    gradient.setAttribute("y2", String(height));
    while (gradient.firstChild) gradient.removeChild(gradient.firstChild);
    const stops = [];
    main.querySelectorAll('[data-surface="dark"]').forEach((el) => {
      const r = rel(el.getBoundingClientRect());
      stops.push([r.top / height, r.bottom / height]);
    });
    stops.sort((a, b) => a[0] - b[0]);
    const addStop = (offset, color) => {
      const stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop.setAttribute("offset", String(Math.min(1, Math.max(0, offset))));
      stop.setAttribute("stop-color", color);
      gradient.appendChild(stop);
    };
    addStop(0, baseColor);
    stops.forEach(([top, bottom]) => {
      addStop(top, baseColor);
      addStop(top, liftColor);
      addStop(bottom, liftColor);
      addStop(bottom, baseColor);
    });
    addStop(1, baseColor);

    length = line.getTotalLength();
    line.style.strokeDasharray = length + " " + length;

    // Sample the path so scroll position maps to drawn length.
    samples = [];
    const count = Math.min(320, Math.max(60, Math.round(length / 18)));
    let maxY = -Infinity;
    for (let i = 0; i <= count; i += 1) {
      const at = (length * i) / count;
      maxY = Math.max(maxY, line.getPointAtLength(at).y);
      samples.push([at, maxY]);
    }
    draw();
  }

  function draw() {
    ticking = false;
    if (reducedMotion.matches) {
      line.style.strokeDashoffset = "0";
      svg.classList.add("is-landed");
      return;
    }
    const top = main.getBoundingClientRect().top;
    const target = window.innerHeight * 0.78 - top;
    let drawn = length;
    for (let i = 0; i < samples.length; i += 1) {
      if (samples[i][1] > target) {
        drawn = samples[i][0];
        break;
      }
    }
    line.style.strokeDashoffset = String(length - drawn);
    svg.classList.toggle("is-landed", drawn >= length - 1);
  }

  const requestDraw = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(draw);
    }
  };

  let resizeTimer;
  const requestBuild = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(build, 120);
  };

  build();
  window.addEventListener("scroll", requestDraw, { passive: true });
  window.addEventListener("resize", requestBuild);
  if ("ResizeObserver" in window) new ResizeObserver(requestBuild).observe(main);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
  reducedMotion.addEventListener("change", build);
}

/* ---------- Aircraft class picker (home and services) ---------- */
function formatPrice(value) {
  return "$" + Number(value).toLocaleString("en-US");
}

function initClassPicker() {
  const picker = document.querySelector("[data-class-picker]");
  if (!picker) return;
  const announcer = document.querySelector("[data-price-announcer]");
  const priced = document.querySelectorAll("[data-priced]");
  const tables = document.querySelectorAll("[data-class-table]");
  const links = document.querySelectorAll("[data-request-link]");

  // Home cards trade the full table for one large live price.
  priced.forEach((card) => {
    const table = card.querySelector(".price-table");
    if (!table) return;
    const live = document.createElement("p");
    live.className = "price-live";
    live.innerHTML = '<span class="price-live__amount"></span><span class="price-live__label"></span>';
    table.after(live);
    card.classList.add("is-live-priced");
  });

  const camel = (slug) => slug.replace(/-([a-z])/g, (m, ch) => ch.toUpperCase());

  function apply(slug, announce) {
    const key = "price" + camel(slug).replace(/^./, (ch) => ch.toUpperCase());
    const spoken = [];
    priced.forEach((card) => {
      const amount = card.dataset[key];
      const live = card.querySelector(".price-live");
      const name = card.querySelector("h2, h3").textContent.trim();
      if (live && amount) {
        live.querySelector(".price-live__amount").textContent = "From " + formatPrice(amount);
        live.querySelector(".price-live__label").textContent = CLASSES[slug];
      }
      if (amount) spoken.push(name + " from " + formatPrice(amount));
    });
    tables.forEach((table) => {
      table.querySelectorAll("tr[data-class]").forEach((row) => {
        row.classList.toggle("is-active", row.dataset.class === slug);
      });
    });
    links.forEach((link) => {
      const url = new URL(link.getAttribute("href"), window.location.href);
      url.searchParams.set("class", slug);
      link.setAttribute("href", url.pathname.split("/").pop() + url.search);
    });
    if (announce && announcer) announcer.textContent = CLASSES[slug] + ": " + spoken.join(", ") + ".";
  }

  picker.addEventListener("change", (event) => {
    if (event.target.name === "aircraft-class") apply(event.target.value, true);
  });
  const checked = picker.querySelector("input:checked");
  apply(checked ? checked.value : "single-engine", false);
}

/* ---------- Request form ---------- */
function arizonaDate(offsetDays) {
  // Arizona does not observe daylight saving, so UTC minus seven hours all year.
  const now = new Date(Date.now() - 7 * 3600 * 1000);
  now.setUTCDate(now.getUTCDate() + offsetDays);
  return now.toISOString().slice(0, 10);
}

function initRequestForm() {
  const form = document.querySelector("[data-request-form]");
  if (!form) return;
  form.setAttribute("novalidate", "");

  const status = form.querySelector("[data-form-status]");
  const submit = form.querySelector('[type="submit"]');
  const dateInput = form.elements["preferred-date"];
  const minDate = arizonaDate(1);
  dateInput.min = minDate;

  // Pre-select from the query string.
  const params = new URLSearchParams(window.location.search);
  const service = params.get("service");
  const aircraftClass = params.get("class");
  if (service && SERVICES[service]) {
    const radio = form.querySelector('input[name="service"][value="' + service + '"]');
    if (radio) radio.checked = true;
  }
  if (aircraftClass && CLASSES[aircraftClass]) form.elements["aircraft-class"].value = aircraftClass;

  const rules = {
    service: (f) => (f.elements.service.value ? "" : "Pick the service you're after. If you're unsure, choose the closest and say so in the notes."),
    "aircraft-class": (f) => (f.elements["aircraft-class"].value ? "" : "Choose your aircraft class, or pick Not sure."),
    name: (f) => (f.elements.name.value.trim() ? "" : "I'll need your name."),
    email: (f) => {
      const value = f.elements.email.value.trim();
      if (!value) return "I need an email address to get back to you.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "That email doesn't look right. Mind checking it?";
    },
    phone: (f) => {
      const digits = f.elements.phone.value.replace(/\D/g, "");
      if (!digits) return "Leave a number so I can call you about the details.";
      return digits.length >= 10 ? "" : "That number looks short. Include the area code.";
    },
    aircraft: (f) => (f.elements.aircraft.value.trim() ? "" : "Tell me which aircraft this is for."),
    location: (f) => (f.elements.location.value.trim() ? "" : "Where is the aircraft parked? The airport and hangar or tie-down is plenty."),
    "preferred-date": (f) => {
      const value = f.elements["preferred-date"].value;
      if (!value) return "Pick a preferred date. I'll confirm the actual day with you.";
      return value >= minDate ? "" : "Pick a date from tomorrow on.";
    }
  };

  function showError(name, message) {
    const error = form.querySelector('[data-error-for="' + name + '"]');
    const wrapper = error ? error.closest(".field, .form-section") : null;
    if (error) error.textContent = message;
    if (wrapper) wrapper.classList.toggle("has-error", Boolean(message));
    const controls = name === "service" ? form.querySelectorAll('input[name="service"]') : [form.elements[name]];
    controls.forEach((control) => {
      if (message) control.setAttribute("aria-invalid", "true");
      else control.removeAttribute("aria-invalid");
    });
  }

  function validate() {
    let first = null;
    Object.keys(rules).forEach((name) => {
      const message = rules[name](form);
      showError(name, message);
      if (message && !first) first = name;
    });
    return first;
  }

  // Clear an error as soon as it's fixed.
  form.addEventListener("input", (event) => {
    const name = event.target.name;
    if (!rules[name]) return;
    const error = form.querySelector('[data-error-for="' + name + '"]');
    if (error && error.textContent) showError(name, rules[name](form));
  });
  form.addEventListener("change", (event) => {
    const name = event.target.name;
    if (name === "service" || name === "aircraft-class") showError(name, rules[name](form));
  });

  function setStatus(type, html) {
    status.className = "form-status form-status--" + type;
    status.innerHTML = html;
    status.focus();
  }

  function collect() {
    const f = form.elements;
    return {
      service: SERVICES[f.service.value] || f.service.value,
      aircraftClass: CLASSES[f["aircraft-class"].value] || f["aircraft-class"].value,
      name: f.name.value.trim(),
      email: f.email.value.trim(),
      phone: f.phone.value.trim(),
      aircraft: f.aircraft.value.trim(),
      location: f.location.value.trim(),
      date: f["preferred-date"].value,
      notes: f.notes.value.trim()
    };
  }

  function mailtoFor(data) {
    const subject = "Detailing request: " + data.service + ", " + data.aircraft;
    const body = [
      "Service: " + data.service,
      "Aircraft class: " + data.aircraftClass,
      "Aircraft make and model: " + data.aircraft,
      "Airport / aircraft location: " + data.location,
      "Preferred date (Arizona time): " + data.date,
      "",
      "Name: " + data.name,
      "Email: " + data.email,
      "Phone: " + data.phone,
      "",
      "Anything else: " + (data.notes || "None")
    ].join("\n");
    return "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  const successHtml = "<strong>Got it.</strong> I'll be in touch to confirm scope, price and your date.";
  const errorHtml = "<strong>That didn't go through.</strong> Call me on <a href=\"tel:+19286427868\">" + CONTACT_PHONE +
    "</a> or email <a href=\"mailto:" + CONTACT_EMAIL + "\">" + CONTACT_EMAIL + "</a> and I'll sort it out.";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Bots fill the hidden field. Pretend it worked and send nothing.
    if (form.elements.website.value) {
      form.reset();
      setStatus("success", successHtml);
      return;
    }

    const firstError = validate();
    if (firstError) {
      status.className = "form-status";
      status.textContent = "";
      const control = firstError === "service" ? form.querySelector('input[name="service"]') : form.elements[firstError];
      control.focus();
      return;
    }

    const data = collect();

    if (!FORM_ENDPOINT) {
      const href = mailtoFor(data);
      window.location.href = href;
      setStatus("success", "<strong>Your email is ready to send.</strong> Your email app should have opened with the request filled in. " +
        "Nothing has been sent yet: hit send there and I'll be in touch to confirm scope, price and your date. " +
        "If it didn't open, <a href=\"" + href + "\">open the prepared email</a> or call " +
        "<a href=\"tel:+19286427868\">" + CONTACT_PHONE + "</a>.");
      return;
    }

    submit.disabled = true;
    submit.setAttribute("aria-busy", "true");
    try {
      const payload = new FormData(form);
      payload.set("service", data.service);
      payload.set("aircraft-class", data.aircraftClass);
      payload.set("_subject", "Detailing request: " + data.service + ", " + data.aircraft);
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: payload,
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error("Request failed with " + response.status);
      form.reset();
      setStatus("success", successHtml);
    } catch (error) {
      setStatus("error", errorHtml);
    } finally {
      submit.disabled = false;
      submit.removeAttribute("aria-busy");
    }
  });
}

initNav();
initHeader();
initAnchors();
initReveal();
initFlightPath();
initClassPicker();
initRequestForm();
