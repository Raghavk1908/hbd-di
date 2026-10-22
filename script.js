/* Audio Synthesizer */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playBeep(freq = 440, type = 'sine', duration = 0.15) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playBlowSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const bufferSize = audioCtx.sampleRate * 0.8;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start();
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
    }
}

/* Page Navigation */
function switchPage(pageNum) {
    playBeep(600, 'sine', 0.1);
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page' + pageNum).classList.add('active');
}

/* 1. REAL CHOCOLATE EXPLOSION */
function triggerChocolateRain() {
    playBeep(700, 'sine', 0.2);
    const overlay = document.getElementById('animationOverlay');
    const items = ['🍫', '🍩', '🍪', '🍬', '🧁', '🍫'];

    for (let i = 0; i < 35; i++) {
        setTimeout(() => {
            const el = document.createElement('div');
            el.className = 'falling-element';
            el.textContent = items[Math.floor(Math.random() * items.length)];
            el.style.left = Math.random() * 90 + 5 + 'vw';
            el.style.animationDuration = (Math.random() * 1.5 + 2) + 's';
            overlay.appendChild(el);

            setTimeout(() => el.remove(), 3500);
        }, i * 80);
    }
}

/* 2. REAL FLOWER BOUQUET POPUP */
function triggerFlowerBouquet() {
    playBeep(850, 'triangle', 0.2);
    const overlay = document.getElementById('animationOverlay');

    // Create central Grand Bouquet
    const bouquet = document.createElement('div');
    bouquet.className = 'center-bouquet';
    bouquet.textContent = '💐';
    overlay.appendChild(bouquet);

    // Rose petals shower
    confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#ff7675', '#fd79a8', '#e84393'],
        shapes: ['circle']
    });

    setTimeout(() => bouquet.remove(), 2500);
}

/* 3. FIREWORKS & CRACKERS */
function triggerFireworks() {
    playBeep(1000, 'square', 0.2);
    
    // Multiple fireworks bursts
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        confetti({
            particleCount: 50,
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            origin: { x: Math.random(), y: Math.random() - 0.2 },
            colors: ['#ffd700', '#ff7675', '#00b894', '#0984e3']
        });
    }, 350);
}

/* Background Music Toggle */
let isPlaying = false;
let bgAudio = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=happy-birthday-115338.mp3');
bgAudio.loop = true;

function toggleAudio() {
    const btn = document.getElementById('musicBtn');
    if (!isPlaying) {
        bgAudio.play().then(() => {
            isPlaying = true;
            btn.textContent = "🔊 Music Playing (Tap to Pause)";
        }).catch(() => {
            btn.textContent = "❌ Tap again to allow audio";
        });
    } else {
        bgAudio.pause();
        isPlaying = false;
        btn.textContent = "🎵 Tap To Play Soft Royal Melody";
    }
}

/* Make A Wish Modal */
function openWishModal() {
    playBeep(700, 'sine', 0.1);
    document.getElementById('wishModal').style.display = 'flex';
}

function saveWish() {
    playBeep(900, 'triangle', 0.2);
    document.getElementById('wishModal').style.display = 'none';
    document.getElementById('wishTriggerBtn').style.display = 'none';
    document.getElementById('startBlowBtn').style.display = 'block';
    document.getElementById('cakeInstruction').textContent = "Wish saved! Now tap Blow Candles to start!";
}

/* Candle Blow & Voice Countdown */
function startCandleSequence() {
    const btn = document.getElementById('startBlowBtn');
    const countdownEl = document.getElementById('countdown');
    const instruction = document.getElementById('cakeInstruction');
    btn.style.display = 'none';

    let count = 5;
    countdownEl.textContent = count;
    playBeep(520, 'sine', 0.15);
    speakText("5");

    const timer = setInterval(() => {
        count--;
        if (count > 0) {
            countdownEl.textContent = count;
            playBeep(520 + (5 - count) * 80, 'sine', 0.15);
            speakText(count.toString());
        } else {
            clearInterval(timer);
            countdownEl.textContent = "💨 FUUUUU!";
            speakText("Blow!");
            playBlowSound();

            setTimeout(() => {
                document.getElementById('flame').classList.add('blown-out');
                document.getElementById('smoke').style.display = 'block';
                instruction.textContent = "Candles blown out! Knife 🔪 par tap karke cake kato!";
                document.getElementById('knife').style.display = 'block';
                playBeep(1000, 'triangle', 0.3);
            }, 600);
        }
    }, 1200);
}

/* Cake Cutting */
function performCakeCut() {
    playBeep(1200, 'square', 0.2);
    document.getElementById('cutLine').style.display = 'block';
    document.getElementById('knife').style.display = 'none';
    document.getElementById('cakeInstruction').textContent = "🎉 Cake Cut Successfully! Happy Birthday Didi!";
    
    confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 }, colors: ['#ffd700', '#ff7675', '#fd79a8'] });

    setTimeout(() => {
        document.getElementById('nextToNoteBtn').classList.remove('hidden');
    }, 800);
}

/* Open Gift Cards */
function openGift(element) {
    playBeep(900, 'sine', 0.15);
    element.classList.add('opened');
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
}