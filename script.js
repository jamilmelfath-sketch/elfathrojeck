// ==================== MATRIX RAIN ====================
const canvas = document.createElement('canvas');
const matrix = document.getElementById('matrix');
matrix.appendChild(canvas);
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const fontSize = 14;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 40);

// ==================== TYPING ANIMATION + SOUND ====================
const welcomeText = "Welcome to elfathrojeck";
const welcomeEl = document.getElementById('welcome-text');
const afterWelcome = document.getElementById('after-welcome');
const info = document.getElementById('info');
const inputLine = document.getElementById('input-line');
const audio = document.getElementById('welcome-audio');
const cmdInput = document.getElementById('cmd-input');

let charIndex = 0;

function typeWelcome() {
    if (charIndex < welcomeText.length) {
        welcomeEl.textContent += welcomeText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWelcome, 80 + Math.random() * 40); // natural typing speed
    } else {
        // Typing selesai → play sound + show next lines
        setTimeout(() => {
            playWelcomeSound();
            afterWelcome.classList.remove('hidden');
            setTimeout(() => {
                info.classList.remove('hidden');
                setTimeout(() => {
                    inputLine.classList.remove('hidden');
                    cmdInput.focus();
                }, 600);
            }, 500);
        }, 300);
    }
}

function playWelcomeSound() {
    // Try play the MP3 first
    audio.volume = 0.8;
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(() => {
            // Fallback ke Web Speech API kalau autoplay diblok
            if ('speechSynthesis' in window) {
                const utter = new SpeechSynthesisUtterance("Welcome to elfathrojeck");
                utter.rate = 0.9;
                utter.pitch = 0.8;
                utter.volume = 1;
                // Coba pilih voice yang agak robotik
                const voices = speechSynthesis.getVoices();
                const preferred = voices.find(v => 
                    v.name.toLowerCase().includes('google') || 
                    v.name.toLowerCase().includes('microsoft') ||
                    v.lang.startsWith('en')
                );
                if (preferred) utter.voice = preferred;
                speechSynthesis.speak(utter);
            }
        });
    }
}

// Mulai setelah sedikit delay biar keliatan loading dulu
setTimeout(typeWelcome, 1800);

// ==================== SIMPLE COMMAND HANDLER ====================
cmdInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const cmd = cmdInput.value.trim().toLowerCase();
        cmdInput.value = '';
        
        const output = document.createElement('div');
        output.className = 'line system';
        
        if (cmd === 'help' || cmd === '?') {
            output.innerHTML = `<span class="output">Available commands: help, clear, whoami, matrix, exit</span>`;
        } else if (cmd === 'clear') {
            // Hapus semua line kecuali yang penting
            const lines = document.querySelectorAll('.terminal-body .line');
            lines.forEach((line, i) => {
                if (i > 5 && !line.id) line.remove();
            });
            return;
        } else if (cmd === 'whoami') {
            output.innerHTML = `<span class="output">Operator: Elfathrojeck | Access Level: ROOT</span>`;
        } else if (cmd === 'matrix') {
            output.innerHTML = `<span class="output">Matrix rain intensity increased...</span>`;
            // Bisa tambah efek nanti
        } else if (cmd === 'exit') {
            output.innerHTML = `<span class="output">Connection terminated. Goodbye, Operator.</span>`;
            setTimeout(() => {
                document.querySelector('.terminal-window').style.opacity = '0';
            }, 1000);
        } else if (cmd === '') {
            return;
        } else {
            output.innerHTML = `<span class="output">Command not found: ${cmd}. Type 'help' for list.</span>`;
        }
        
        // Insert sebelum input line
        inputLine.parentNode.insertBefore(output, inputLine);
        // Scroll ke bawah
        document.getElementById('terminal').scrollTop = document.getElementById('terminal').scrollHeight;
    }
});

// Fokus input saat klik di terminal
document.querySelector('.terminal-body').addEventListener('click', () => {
    cmdInput.focus();
});
