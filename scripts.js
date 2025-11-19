// ==================== DOM Elements ====================
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const resetBtn = document.getElementById('resetBtn');

const presetSelect = document.getElementById('preset');
const inHours = document.getElementById('inHours');
const inMinutes = document.getElementById('inMinutes');
const inSeconds = document.getElementById('inSeconds');

const remainingHuman = document.getElementById('remainingHuman');
const statusEl = document.getElementById('status');
const progressEl = document.getElementById('progress');

const fill5Btn = document.getElementById('fill5');
const fill15Btn = document.getElementById('fill15');
const fill30Btn = document.getElementById('fill30');
const fill1hBtn = document.getElementById('fill1h');

const copyBtn = document.getElementById('copyBtn');

// ==================== Audio ====================
const tickAudio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
// const tickSound = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
const bellAudio = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
tickAudio.volume = 0.4;
bellAudio.volume = 0.7;

// ==================== Variables ====================
let totalSeconds = 300; // mặc định 5 phút
let remainingSeconds = totalSeconds;
let timerInterval = null;
let isPaused = false;

// ==================== Utility ====================
function formatTime(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return [h, m, s].map(n => String(n).padStart(2, '0'));
}

function updateDisplay() {
    const [h, m, s] = formatTime(remainingSeconds);
    hoursEl.textContent = h;
    minutesEl.textContent = m;
    secondsEl.textContent = s;
    remainingHuman.textContent = `${h}:${m}:${s}`;
    progressEl.style.width = `${((totalSeconds - remainingSeconds) / totalSeconds) * 100}%`;

    // 10 giây cuối tích tắc
    if (remainingSeconds <= 10 && remainingSeconds > 0) {
        tickAudio.currentTime = 0;
        tickAudio.play();
    }

    if (remainingSeconds === 0) {
        bellAudio.play();
        clearInterval(timerInterval);
        statusEl.textContent = "Đã kết thúc";
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resumeBtn.disabled = true;
    }
}

// ==================== Timer Control ====================
function startTimer() {
    totalSeconds = parseInt(inHours.value) * 3600 + parseInt(inMinutes.value) * 60 + parseInt(inSeconds.value);
    if (totalSeconds <= 0) return alert('Vui lòng nhập thời gian hợp lệ!');
    remainingSeconds = totalSeconds;
    updateDisplay();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!isPaused) {
            remainingSeconds--;
            updateDisplay();
        }
    }, 1000);
    statusEl.textContent = "Đang chạy";
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resumeBtn.disabled = true;
}

function pauseTimer() {
    isPaused = true;
    statusEl.textContent = "Tạm dừng";
    pauseBtn.disabled = true;
    resumeBtn.disabled = false;
}

function resumeTimer() {
    isPaused = false;
    statusEl.textContent = "Đang chạy";
    pauseBtn.disabled = false;
    resumeBtn.disabled = true;
}

function resetTimer() {
    clearInterval(timerInterval);
    remainingSeconds = totalSeconds;
    updateDisplay();
    statusEl.textContent = "Sẵn sàng";
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resumeBtn.disabled = true;
}

// ==================== Preset & Quick Fill ====================
presetSelect.addEventListener('change', () => {
    const value = parseInt(presetSelect.value);
    if (value > 0) {
        inHours.value = Math.floor(value / 3600);
        inMinutes.value = Math.floor((value % 3600) / 60);
        inSeconds.value = value % 60;
    }
});

fill5Btn.addEventListener('click', () => { inHours.value = 0; inMinutes.value = 5; inSeconds.value = 0; });
fill15Btn.addEventListener('click', () => { inHours.value = 0; inMinutes.value = 15; inSeconds.value = 0; });
fill30Btn.addEventListener('click', () => { inHours.value = 0; inMinutes.value = 30; inSeconds.value = 0; });
fill1hBtn.addEventListener('click', () => { inHours.value = 1; inMinutes.value = 0; inSeconds.value = 0; });

// ==================== Button Events ====================
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resumeBtn.addEventListener('click', resumeTimer);
resetBtn.addEventListener('click', resetTimer);

// Copy thời gian
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(remainingHuman.textContent).then(() => {
        alert('Đã sao chép thời gian: ' + remainingHuman.textContent);
    });
});

// Initialize display
updateDisplay();
