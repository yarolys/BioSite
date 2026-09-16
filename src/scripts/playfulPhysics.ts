export {};
// A lifted copy keeps document layout and link semantics intact.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer: fine)');
const roots = document.querySelectorAll('main, header, footer');
const excluded = 'script, style, svg, .portrait-frame, .floating-code-bg, [aria-hidden="true"], .physics-word';
for (const root of roots) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (node.textContent?.trim() && !node.parentElement?.closest(excluded)) texts.push(node);
  }
  for (const node of texts) {
    const fragment = document.createElement('x-text');
    const tokens = node.textContent!.match(/\s+|[\p{L}\p{N}]+(?:[-’'][\p{L}\p{N}]+)*|[^\s]/gu) || [];
    for (const token of tokens) {
      if (/^\s+$/.test(token)) fragment.append(token);
      else {
        const span = document.createElement('x-word');
        span.className = 'physics-word';
        span.textContent = token;
        fragment.append(span);
      }
    }
    node.replaceWith(fragment);
  }
}
for (const item of document.querySelectorAll('main .achievement-list li')) {
  const dot = document.createElement('span');
  dot.className = 'physics-list-dot';
  dot.setAttribute('aria-hidden', 'true');
  item.prepend(dot);
  item.classList.add('physics-bullet-ready');
}
const selector = '.physics-list-dot, .portrait-frame, .physics-word, .status-dot, .code-symbol, main svg, header svg, footer svg';
type Body = {
  source: Element; shell: HTMLDivElement; w: number; h: number;
  x: number; y: number; vx: number; vy: number; angle: number; spin: number;
  grabX: number; grabY: number; phase: 'held' | 'flying' | 'waiting' | 'walking';
  deadline: number; walkStart: number; walkX: number; walkY: number; walkAngle: number;
};
const bodies = new Set<Body>();
let pending: { source: Element; x: number; y: number; id: number } | undefined;
let held: Body | undefined;
let mouse = { x: 0, y: 0, vx: 0, vy: 0, time: 0 };
let frame = 0;
let previous = 0;
let suppressClick = false;
let suppressTimer: ReturnType<typeof setTimeout>;
const clamp = (n: number, limit: number) => Math.max(-limit, Math.min(limit, n));

function copyAppearance(source: Element): Element {
  const clone = source.cloneNode(true) as Element;
  const originals = [source, ...source.querySelectorAll('*')];
  const copies = [clone, ...clone.querySelectorAll('*')];
  originals.forEach((original, i) => {
    const copy = copies[i] as HTMLElement | SVGElement;
    const style = getComputedStyle(original);
    for (const property of style) copy.style.setProperty(property, style.getPropertyValue(property));
    copy.removeAttribute('id');
    copy.removeAttribute('href');
    copy.removeAttribute('tabindex');
    copy.style.animation = 'none';
    copy.style.transition = 'none';
    copy.style.pointerEvents = 'none';
  });
  return clone;
}
function restore(body: Body) {
  body.source.classList.remove('physics-lifted');
  body.shell.remove();
  bodies.delete(body);
  if (held === body) held = undefined;
}
function reset() {
  pending = undefined;
  for (const body of bodies) restore(body);
  document.documentElement.classList.remove('physics-dragging');
}
function lift(source: Element, x: number, y: number): Body {
  const rect = source.getBoundingClientRect();
  const shell = document.createElement('div');
  shell.className = 'physics-body';
  shell.setAttribute('aria-hidden', 'true');
  shell.inert = true;
  shell.style.width = `${rect.width}px`;
  shell.style.height = `${rect.height}px`;
  shell.style.setProperty('--leg-scale', String(Math.min(2.2, Math.max(1, rect.width / 100))));
  const visual = document.createElement('div');
  visual.className = 'physics-visual';
  const copy = copyAppearance(source) as HTMLElement;
  Object.assign(copy.style, { position: 'static', margin: '0', transform: 'none', translate: 'none', rotate: 'none', width: `${rect.width}px`, height: `${rect.height}px`, maxWidth: 'none', maxHeight: 'none', opacity: '1' });
  visual.append(copy);
  const legs = document.createElement('div');
  legs.className = 'physics-legs';
  legs.innerHTML = '<i></i><i></i>';
  shell.append(visual, legs);
  document.body.append(shell);
  const body: Body = { source, shell, w: rect.width, h: rect.height, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2,
    vx: 0, vy: 0, angle: 0, spin: 0, grabX: x - rect.left - rect.width / 2, grabY: y - rect.top - rect.height / 2,
    phase: 'held', deadline: 0, walkStart: 0, walkX: 0, walkY: 0, walkAngle: 0 };
  source.classList.add('physics-lifted');
  bodies.add(body);
  draw(body);
  document.documentElement.classList.add('physics-dragging');
  if (!frame) { previous = performance.now(); frame = requestAnimationFrame(tick); }
  return body;
}
function draw(body: Body) {
  body.shell.style.transform = `translate3d(${body.x - body.w / 2}px, ${body.y - body.h / 2}px, 0) rotate(${body.angle}rad)`;
}
function tick(now: number) {
  const dt = Math.min((now - previous) / 16.667, 2);
  previous = now;
  for (const b of bodies) {
    if (!b.source.isConnected) { restore(b); continue; }
    if (b.phase === 'held') {
      const c = Math.cos(b.angle), s = Math.sin(b.angle);
      const ax = b.grabX * c - b.grabY * s, ay = b.grabX * s + b.grabY * c;
      const fx = clamp((mouse.x - b.x - ax) * .15, 45);
      const fy = clamp((mouse.y - b.y - ay) * .15, 45);
      b.vx = (b.vx + fx * dt) * Math.pow(.72, dt);
      b.vy = (b.vy + (fy + .3) * dt) * Math.pow(.72, dt);
      const inertia = Math.max(160, (b.w * b.w + b.h * b.h) / 12);
      b.spin = (b.spin + clamp((ax * fy - ay * fx) / inertia, .12) * dt) * Math.pow(.9, dt);
    } else if (b.phase === 'flying') {
      b.vy += .32 * dt;
      b.vx *= Math.pow(.995, dt);
      if (b.y - b.h > innerHeight || b.x + b.w < 0 || b.x - b.w > innerWidth || b.y + b.h < 0) {
        b.phase = 'waiting'; b.shell.style.visibility = 'hidden';
      }
    }
    if (b.phase === 'held' || b.phase === 'flying') {
      b.x += b.vx * dt; b.y += b.vy * dt; b.angle += b.spin * dt;
    }
    if ((b.phase === 'flying' || b.phase === 'waiting') && now >= b.deadline) {
      const target = b.source.getBoundingClientRect();
      if (target.bottom < 0 || target.top > innerHeight || !target.width) { restore(b); continue; }
      b.phase = 'walking'; b.walkStart = now;
      b.walkX = b.x < innerWidth / 2 ? -b.w / 2 - 15 : innerWidth + b.w / 2 + 15;
      b.walkY = Math.min(innerHeight - b.h / 2 - 20, target.top + b.h / 2);
      b.walkAngle = clamp(b.angle % (Math.PI * 2), .2);
      b.shell.style.visibility = 'visible'; b.shell.classList.add('is-walking');
    }
    if (b.phase === 'walking') {
      const target = b.source.getBoundingClientRect();
      if (!target.width || target.bottom < 0 || target.top > innerHeight) { restore(b); continue; }
      const progress = Math.min((now - b.walkStart) / 2400, 1);
      const ease = progress * progress * (3 - 2 * progress);
      b.x = b.walkX + (target.left + target.width / 2 - b.walkX) * ease;
      b.y = b.walkY + (target.top + target.height / 2 - b.walkY) * ease;
      b.angle = b.walkAngle * (1 - ease);
      if (progress === 1) { restore(b); continue; }
    }
    draw(b);
  }
  frame = bodies.size ? requestAnimationFrame(tick) : 0;
}

document.addEventListener('pointerdown', (event) => {
  if (event.button !== 0 || event.pointerType !== 'mouse' || !finePointer.matches || reduceMotion.matches || event.altKey || held) return;
  const target = event.target as Element;
  if (target.closest('#gnome-house, #gnome-prompt, #gnome-container, #gnome-army, input, textarea, select')) return;
  let source = target.closest('.portrait-frame') || target.closest(selector);
  // Text containers sit above the background; their empty space can still catch a glyph.
  if (!source && !target.closest('a, button, summary')) {
    source = [...document.querySelectorAll('.code-symbol')].find((symbol) => {
      const rect = symbol.getBoundingClientRect();
      return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    }) || null;
  }
  if (!source || source.closest('.physics-lifted')) return;
  pending = { source, x: event.clientX, y: event.clientY, id: event.pointerId };
  mouse = { x: event.clientX, y: event.clientY, vx: 0, vy: 0, time: performance.now() };
});
document.addEventListener('pointermove', (event) => {
  if (!pending && !held) return;
  const now = performance.now(), elapsed = Math.max(8, now - mouse.time);
  mouse = { x: event.clientX, y: event.clientY, vx: clamp((event.clientX - mouse.x) / elapsed * 16.667, 45), vy: clamp((event.clientY - mouse.y) / elapsed * 16.667, 45), time: now };
  if (pending && !held && Math.hypot(event.clientX - pending.x, event.clientY - pending.y) > 7) {
    held = lift(pending.source, pending.x, pending.y);
    document.documentElement.setPointerCapture(event.pointerId);
    window.getSelection()?.removeAllRanges();
  }
  if (held) event.preventDefault();
});
document.addEventListener('pointerup', () => {
  pending = undefined;
  document.documentElement.classList.remove('physics-dragging');
  if (!held) return;
  const b = held; held = undefined;
  suppressClick = true;
  clearTimeout(suppressTimer);
  suppressTimer = setTimeout(() => { suppressClick = false; }, 0);
  const target = b.source.getBoundingClientRect();
  const homeX = target.left + target.width / 2, homeY = target.top + target.height / 2;
  if (Math.hypot(mouse.x - homeX - b.grabX, mouse.y - homeY - b.grabY) < 28 || Math.hypot(b.x - homeX, b.y - homeY) < Math.max(24, Math.min(75, b.w / 4))) { restore(b); return; }
  b.phase = 'flying'; b.deadline = performance.now() + 5000;
  const fresh = performance.now() - mouse.time < 100;
  b.vx = fresh ? mouse.vx * .8 + b.vx * .2 : b.vx;
  b.vy = fresh ? mouse.vy * .8 + b.vy * .2 : b.vy;
  if (Math.hypot(b.vx, b.vy) < 3) { b.vx = b.x < innerWidth / 2 ? -4 : 4; b.vy = -5; }
});
document.addEventListener('click', (event) => { if (suppressClick) { event.preventDefault(); event.stopImmediatePropagation(); } }, true);
document.addEventListener('dragstart', (event) => { if (pending || held) event.preventDefault(); });
document.addEventListener('selectstart', (event) => { if (pending || held) event.preventDefault(); });
document.addEventListener('pointercancel', reset);
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') reset(); });
window.addEventListener('blur', reset);
window.addEventListener('resize', reset);
reduceMotion.addEventListener('change', reset);
