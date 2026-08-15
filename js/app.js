import { World, ZONES } from "./world.js";
import { initCursorTrail } from "./cursor.js";
import { PROFILE, STATS, ARSENAL, CAMPAIGN, BUILDS, EDUCATION, ACHIEVEMENTS } from "./data.js";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------------------------------------------------------- render */

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
}

/**
 * Wraps each character so type can animate per-glyph, like the old site.
 * Characters are grouped into per-word spans so a word never breaks mid-way.
 */
function splitChars(text) {
  return text
    .split(/(\s+)/)
    .map((part) => {
      if (!part) return "";
      if (/^\s+$/.test(part)) return '<span class="ch space">&nbsp;</span>';
      const glyphs = [...part].map((ch) => `<span class="ch">${ch}</span>`).join("");
      return `<span class="word">${glyphs}</span>`;
    })
    .join("");
}

/** Zone headings get the same per-letter hover as the hero. */
function splitZoneTitles() {
  $$(".zone-title").forEach((title) => {
    title.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const span = document.createElement("span");
        span.innerHTML = splitChars(node.textContent);
        node.replaceWith(span);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        node.innerHTML = splitChars(node.textContent);
      }
    });
  });
}

function renderHero() {
  $("#hero-name").innerHTML = splitChars("PRITHVI");
  $("#hero-surname").innerHTML = splitChars("YADAV");

  // Stagger the entrance per glyph. Done here rather than with nth-child so
  // the delays survive the word-grouping wrappers.
  $$("#hero-name .ch, #hero-surname .ch").forEach((ch, i) => {
    ch.style.animationDelay = `${0.9 + i * 0.06}s`;
  });
  $("#hero-role").textContent = PROFILE.role;
  $("#hero-tagline").textContent = PROFILE.tagline;

  const stats = $("#hero-stats");
  STATS.forEach((s) => {
    const card = el("div", "stat");
    card.append(el("span", "stat-value", s.value), el("span", "stat-label", s.label));
    stats.append(card);
  });
}

function renderArsenal() {
  const grid = $("#arsenal-grid");
  ARSENAL.forEach((group) => {
    const card = el("article", `panel loadout accent-${group.accent}`);
    card.append(
      el("div", "loadout-tier", group.tier),
      el("h3", "loadout-name", group.name)
    );

    // Plain chips - self-assigned percentages were noise, not information.
    const list = el("ul", "skill-list");
    group.items.forEach((item) => list.append(el("li", "skill-chip", item)));

    card.append(list);
    grid.append(card);
  });
}

function renderCampaign() {
  const track = $("#campaign-track");
  CAMPAIGN.forEach((job) => {
    const card = el("article", `panel mission accent-${job.accent}`);

    const head = el("header", "mission-head");
    const titles = el("div", "mission-titles");
    titles.append(el("h3", "mission-org", job.org), el("p", "mission-role", job.role));

    const meta = el("div", "mission-meta");
    meta.append(
      el("span", `badge badge-${job.status.toLowerCase()}`, job.status),
      el("span", "mission-period", job.period),
      el("span", "mission-place", job.place)
    );

    head.append(titles, meta);
    card.append(head, el("p", "mission-brief", job.brief));

    const list = el("ul", "objectives");
    job.objectives.forEach((text) => {
      const li = el("li", "objective");
      li.append(el("span", "objective-mark", ""), el("span", "objective-text", text));
      list.append(li);
    });

    card.append(list);
    track.append(card);
  });
}

function renderBuilds() {
  const grid = $("#builds-grid");
  BUILDS.forEach((b) => {
    const card = el("article", `panel build accent-${b.accent}`);

    const media = el("div", "build-media");
    const img = el("img");
    img.src = b.image;
    img.alt = `${b.name} - ${b.kind}`;
    img.loading = "lazy";
    img.decoding = "async";
    media.append(img, el("span", "build-scan", ""));

    const body = el("div", "build-body");
    body.append(
      el("span", "build-kind", b.kind),
      el("h3", "build-name", b.name),
      el("p", "build-blurb", b.blurb)
    );

    const stack = el("ul", "build-stack");
    b.stack.forEach((s) => stack.append(el("li", "chip", s)));
    body.append(stack);

    // Only render a live button when a deployment actually responded.
    const actions = el("div", "build-actions");
    if (b.live) {
      const live = el("a", "btn btn-primary", "<span>Launch</span>");
      live.href = b.live;
      live.target = "_blank";
      live.rel = "noopener noreferrer";
      actions.append(live);
    }
    const repo = el("a", "btn btn-ghost", "<span>Source</span>");
    repo.href = b.repo;
    repo.target = "_blank";
    repo.rel = "noopener noreferrer";
    actions.append(repo);

    if (!b.live) actions.append(el("span", "build-note", "source only"));

    body.append(actions);
    card.append(media, body);
    grid.append(card);
  });
}

function renderComms() {
  $("#comms-email").href = `mailto:${PROFILE.email}`;
  $("#comms-email span").textContent = PROFILE.email;
  $("#comms-linkedin").href = PROFILE.linkedin;
  $("#comms-github").href = PROFILE.github;
  $("#comms-youtube").href = PROFILE.youtube;
  $("#comms-location").textContent = PROFILE.location;

  const eduList = $("#education-list");
  EDUCATION.forEach((e) => {
    const li = el("li", "edu");
    li.append(
      el("span", "edu-school", e.school),
      el("span", "edu-detail", e.detail),
      el("span", "edu-meta", `${e.period} · ${e.score}`)
    );
    eduList.append(li);
  });

  const achList = $("#achievement-list");
  ACHIEVEMENTS.forEach((a) => achList.append(el("li", "achievement", a)));
}

/* ---------------------------------------------------------- contact form */

const EMAILJS = {
  publicKey: "dZrmv2BzBh92btBSA",
  service: "service_k94trc3",
  template: "template_blmp8rw",
};

/** Validation rules live in a table so new fields need no new branches. */
const FIELD_RULES = [
  {
    id: "cf-name",
    validate: (v) => (v.trim() ? "" : "Tell me your name."),
  },
  {
    id: "cf-email",
    validate: (v) =>
      !v.trim()
        ? "I need an email to reply to."
        : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
        ? ""
        : "That email doesn't look right.",
  },
  {
    id: "cf-message",
    validate: (v) => (v.trim() ? "" : "Add a message so I know what this is about."),
  },
];

function initContactForm() {
  const form = $("#contact-form");
  const status = $("#cf-status");
  const submit = $("#cf-submit");

  if (window.emailjs) emailjs.init(EMAILJS.publicKey);

  const showError = (id, message) => {
    const input = document.getElementById(id);
    const slot = $(`.field-error[data-for="${id}"]`);
    input.classList.toggle("invalid", Boolean(message));
    if (slot) slot.textContent = message;
    return !message;
  };

  // Clear a field's error as soon as the visitor starts fixing it.
  FIELD_RULES.forEach(({ id }) => {
    document.getElementById(id).addEventListener("input", () => showError(id, ""));
  });

  const setStatus = (text, kind) => {
    status.textContent = text;
    status.className = `form-status ${kind || ""}`;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const valid = FIELD_RULES
      .map(({ id, validate }) => showError(id, validate(document.getElementById(id).value)))
      .every(Boolean);

    if (!valid) {
      setStatus("Check the highlighted fields.", "error");
      return;
    }

    if (!window.emailjs) {
      setStatus(
        `Mail service didn't load. Email me directly at ${PROFILE.email}.`,
        "error"
      );
      return;
    }

    submit.disabled = true;
    setStatus("Sending…", "pending");

    try {
      await emailjs.send(EMAILJS.service, EMAILJS.template, {
        from_name: $("#cf-name").value.trim(),
        from_email: $("#cf-email").value.trim(),
        subject: $("#cf-subject").value.trim() || "Portfolio enquiry",
        message: $("#cf-message").value.trim(),
      });
      form.reset();
      setStatus("Message sent. I'll get back to you soon.", "success");
    } catch (err) {
      // 412 means the EmailJS service lost its provider auth (expired Gmail
      // grant), not a bad submission - the visitor can't fix that, so point
      // them at the direct address instead of asking them to retry.
      console.error("EmailJS send failed", err);
      setStatus(
        `Mail relay is down right now. Email me directly at ${PROFILE.email}.`,
        "error"
      );
    } finally {
      submit.disabled = false;
    }
  });
}

/* ------------------------------------------------------------ navigation */

function initNav(world) {
  const links = $$("[data-zone]");
  const sections = ZONES.map((z) => document.getElementById(z.id));

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const index = Number(link.dataset.zone);
      const section = sections[index];
      if (!section) return;
      // Aim at the zone heading - tall zones would otherwise land mid-content.
      const anchor = section.querySelector(".zone-head, .zone-inner") || section;
      const top = anchor.getBoundingClientRect().top + window.scrollY - 118;
      window.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  // Highlight the zone currently on screen. Several sections can be visible
  // at once, so pick the one whose top is nearest the viewport top rather
  // than whichever observer entry happened to fire last.
  let ticking = false;
  const syncActive = () => {
    ticking = false;
    let index = 0;
    let best = Infinity;

    sections.forEach((section, i) => {
      if (!section) return;
      const distance = Math.abs(section.getBoundingClientRect().top - 90);
      if (distance < best) {
        best = distance;
        index = i;
      }
    });

    links.forEach((l) => l.classList.toggle("active", Number(l.dataset.zone) === index));
    $("#hud-zone").textContent = ZONES[index].label;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(syncActive);
    },
    { passive: true }
  );
  syncActive();
}

/* ---------------------------------------------------------------- scroll */

function initScroll(world) {
  const scroller = document.documentElement;

  const onScroll = () => {
    const max = scroller.scrollHeight - window.innerHeight;
    const p = max > 0 ? scroller.scrollTop / max : 0;
    world.setProgress(p);
    $("#hud-depth").textContent = `${Math.round(p * 100)}%`;
    $("#progress-fill").style.transform = `scaleX(${p})`;
    // Retire the scroll hint once the journey is underway.
    document.body.classList.toggle("travelling", scroller.scrollTop > 120);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/** Reveal panels and fill skill meters as they enter view. */
function initReveal() {
  const targets = $$(".panel, .reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  targets.forEach((t) => io.observe(t));
}

function initPointer(world) {
  window.addEventListener(
    "pointermove",
    (e) => {
      world.setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    },
    { passive: true }
  );
}

function initAudio() {
  const btn = $("#sound-toggle");
  let audio = null;

  btn.addEventListener("click", () => {
    const on = btn.classList.toggle("active");
    if (on) {
      // Created on first interaction - browsers block autoplay otherwise.
      if (!audio) {
        audio = new Audio("backmusic.mp3");
        audio.loop = true;
        audio.volume = 0.35;
      }
      audio.play().catch(() => btn.classList.remove("active"));
    } else if (audio) {
      audio.pause();
    }
    btn.setAttribute("aria-pressed", String(on));
  });
}

/* ------------------------------------------------------------------ boot */

function boot() {
  splitZoneTitles();
  renderHero();
  renderArsenal();
  renderCampaign();
  renderBuilds();
  renderComms();
  initContactForm();
  initAudio();
  initReveal();
  initCursorTrail();

  const canvas = $("#world-canvas");
  let world = null;

  // WebGL can fail on old drivers - the site must still read fine.
  try {
    world = new World(canvas);
  } catch (err) {
    console.warn("WebGL unavailable, running in flat mode.", err);
    document.body.classList.add("no-webgl");
  }

  if (world) {
    initScroll(world);
    initPointer(world);
    initNav(world);

    window.addEventListener("resize", () => world.resize(), { passive: true });

    const loop = () => {
      world.update();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  } else {
    initNav(null);
    window.addEventListener(
      "scroll",
      () => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const p = max > 0 ? doc.scrollTop / max : 0;
        $("#hud-depth").textContent = `${Math.round(p * 100)}%`;
        $("#progress-fill").style.transform = `scaleX(${p})`;
        document.body.classList.toggle("travelling", doc.scrollTop > 120);
      },
      { passive: true }
    );
  }

  // Drop the loader once the first frame is genuinely on screen.
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.body.classList.add("loaded");
      $("#loader").addEventListener("transitionend", (e) => {
        if (e.target === $("#loader")) $("#loader").remove();
      });
    }, reduceMotion ? 100 : 900);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
