/**
 * Cursor comet: a short trail that follows the pointer and fades behind it.
 *
 * Drawn on its own 2D canvas rather than with DOM nodes - a trail is dozens of
 * points per frame, and moving that many elements thrashes layout.
 */

const TRAIL_LENGTH = 22;   // points kept in the tail
const EASE = 0.32;         // how tightly the head chases the pointer

export function initCursorTrail() {
  // Touch devices have no hovering pointer to trail.
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.className = "cursor-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.append(canvas);

  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio, 2);

  const resize = () => {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(dpr, dpr);
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const pointer = { x: -100, y: -100 };
  const head = { x: -100, y: -100 };
  const trail = Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 }));
  let active = false;
  let hot = false; // over an interactive element

  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (!active) {
        // Jump the whole trail on first move so it doesn't whip in from 0,0.
        head.x = pointer.x;
        head.y = pointer.y;
        trail.forEach((p) => { p.x = pointer.x; p.y = pointer.y; });
        active = true;
      }
      hot = Boolean(e.target.closest?.("a, button, input, textarea, .skill-chip, .panel"));
    },
    { passive: true }
  );

  document.addEventListener("pointerleave", () => { active = false; });

  const draw = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (active) {
      head.x += (pointer.x - head.x) * EASE;
      head.y += (pointer.y - head.y) * EASE;

      // Each point chases the one ahead of it, giving the tail its lag.
      let prev = head;
      for (const point of trail) {
        point.x += (prev.x - point.x) * 0.38;
        point.y += (prev.y - point.y) * 0.38;
        prev = point;
      }

      const tint = hot ? "253, 16, 86" : "8, 253, 216";

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      let from = head;
      trail.forEach((point, i) => {
        // Taper width and opacity along the tail so it dissolves at the end.
        const t = 1 - i / TRAIL_LENGTH;
        ctx.strokeStyle = `rgba(${tint}, ${t * 0.5})`;
        ctx.lineWidth = t * (hot ? 6 : 4.5);
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        from = point;
      });

      // Glowing head.
      const r = hot ? 7 : 4.5;
      const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, r * 3.4);
      glow.addColorStop(0, `rgba(${tint}, 0.85)`);
      glow.addColorStop(1, `rgba(${tint}, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(head.x, head.y, r * 3.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(${tint}, 0.95)`;
      ctx.beginPath();
      ctx.arc(head.x, head.y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  };

  requestAnimationFrame(draw);
}
