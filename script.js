const $ = s => document.querySelector(s), pages = [...document.querySelectorAll('.page')], dots = [...document.querySelectorAll('#dots b')];
let cur = 0;
function show(n) {
    pages[cur].classList.remove('show'); cur = n; pages[cur].classList.add('show');
    dots.forEach((d, i) => d.className = i < cur ? 'done' : i === cur ? 'on' : '');
}
show(0);
document.querySelectorAll('[data-next]').forEach(b => b.onclick = () => show(cur + 1));

// confetti
const cv = $('#cv'), cx = cv.getContext('2d'); let parts = [], raf;
function size() { cv.width = innerWidth; cv.height = innerHeight } size(); addEventListener('resize', size);
function confetti() {
    const cols = ['#87CEEB', '#ffd54a', '#ffffff', '#4fb3e3', '#12507a'];
    for (let i = 0; i < 140; i++)parts.push({ x: innerWidth / 2, y: innerHeight / 2, vx: (Math.random() - .5) * 16, vy: Math.random() * -14 - 3, s: Math.random() * 8 + 4, c: cols[i % 5], r: Math.random() * 6, l: 100 });
    if (!raf) loop();
}
function loop() {
    cx.clearRect(0, 0, cv.width, cv.height);
    parts = parts.filter(p => p.l > 0);
    parts.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .4; p.r += .2; p.l--; cx.fillStyle = p.c; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); cx.restore() });
    raf = parts.length ? requestAnimationFrame(loop) : 0;
}

// page 1
document.querySelectorAll('#q1 .opt').forEach(b => b.onclick = () => {
    document.querySelectorAll('#q1 .opt').forEach(x => x.classList.remove('sel'));
    b.classList.add('sel'); $('#r1').textContent = b.dataset.r;
    pages[0].querySelector('[data-next]').classList.remove('hide');
});

// page 2: notepad
const note = $('#note');
try { note.value = localStorage.getItem('thendo-note') || '' } catch (e) { }
function count() { $('#cnt').textContent = note.value.length + ' characters' } count();
note.addEventListener('input', () => { count(); try { localStorage.setItem('thendo-note', note.value) } catch (e) { } });
// Paste your Formspree form link here (see steps below the code in chat)
const FORM_URL = 'https://formspree.io/f/mbgdrqgn';

async function fallbackShare(msg) {
    try {
        if (navigator.share) { await navigator.share({ text: msg }); $('#r2').textContent = 'Thank you for sharing.'; return }
    } catch (e) { if (e && e.name === 'AbortError') return }
    try { await navigator.clipboard.writeText(msg); $('#r2').textContent = 'Copied. Paste it in our chat and send it to me.' }
    catch (e) { note.select(); $('#r2').textContent = 'Select the text, copy it and paste it in our chat.' }
}
$('#send').onclick = async () => {
    const t = note.value.trim(), btn = $('#send');
    if (!t) { $('#r2').textContent = 'Write something first, then send it.'; return }
    const msg = 'Hi Nhlayiseko, here is what I would like you to know about me:\n\n' + t;
    if (FORM_URL.includes('YOUR_FORM_ID')) { return fallbackShare(msg) }
    btn.disabled = true; $('#r2').textContent = 'Sending...';
    try {
        const r = await fetch(FORM_URL, {
            method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ _subject: 'New note from Thendo', message: t })
        });
        if (r.ok) { $('#r2').textContent = 'Sent. Thank you for sharing.'; confetti(); btn.disabled = false; return }
    } catch (e) { }
    btn.disabled = false;
    fallbackShare(msg);
};

// page 3
document.querySelectorAll('#q3 .opt').forEach(b => b.onclick = () => {
    if (b.dataset.ok === '1') {
        b.classList.add('sel'); $('#r3').textContent = 'Correct. You clearly have taste.'; confetti();
        pages[2].querySelector('[data-next]').classList.remove('hide');
    } else {
        b.classList.remove('bad'); void b.offsetWidth; b.classList.add('bad');
        $('#r3').textContent = ['Hmm, are you sure about that?', 'Wrong answer. Try again.', 'Not even close.'][Math.floor(Math.random() * 3)];
    }
});

// page 4
const no = $('#no'), yes = $('#yes'); let fled = false;
function flee(e) {
    if (e && e.cancelable) e.preventDefault();
    if (!fled) { const r = no.getBoundingClientRect(); no.style.position = 'fixed'; no.style.left = r.left + 'px'; no.style.top = r.top + 'px'; fled = true }
    no.style.left = Math.max(8, Math.random() * (innerWidth - no.offsetWidth - 16)) + 'px';
    no.style.top = Math.max(60, Math.random() * (innerHeight - no.offsetHeight - 80)) + 'px';
    $('#r4').textContent = ['Nice try.', 'Too slow.', 'The button said no to No.'][Math.floor(Math.random() * 3)];
}
['mouseenter', 'touchstart', 'click', 'focus'].forEach(ev => no.addEventListener(ev, flee, { passive: false }));
yes.onclick = () => { $('#r4').textContent = 'Yay! Now reply to my message, Thendo.'; confetti(); setTimeout(confetti, 400) };