// --- 요소 가져오기 ---
const startScreen = document.getElementById('start-screen');
const mainScreen = document.getElementById('main-screen');
const textCarousel = document.getElementById('text-carousel');
const meditationTimer = document.getElementById('meditation-timer'); // 타이머 요소

const bgmMain = document.getElementById('bgm-main');
const audioRain = document.getElementById('audio-rain');
const audioCandle = document.getElementById('audio-candle');
const audioPendulum = document.getElementById('audio-pendulum');

const sfxWindow = document.getElementById('sfx-window');
const sfxLight = document.getElementById('sfx-light');
const sfxMirror = document.getElementById('sfx-mirror');

// 타이머 변수
let timerInterval;
let totalSeconds = 0;

// --- 1. 시작 화면 클릭 -> 메인 화면 이동 & 타이머 시작 ---
startScreen.addEventListener('click', () => {
    bgmMain.volume = 0.5; 
    bgmMain.play();

    startScreen.style.opacity = '0';
    startScreen.style.transition = 'opacity 1s';
    
    setTimeout(() => {
        startScreen.style.display = 'none';
        mainScreen.style.display = 'flex';
        startTextCarousel();
        startTimer(); // [추가] 타이머 시작
    }, 1000);
});

// --- [추가] 타이머 함수 ---
function startTimer() {
    timerInterval = setInterval(() => {
        totalSeconds++;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        // 00 : 00 포맷 만들기
        const formattedMin = minutes < 10 ? '0' + minutes : minutes;
        const formattedSec = seconds < 10 ? '0' + seconds : seconds;
        
        meditationTimer.textContent = `명상 시간 ${formattedMin} : ${formattedSec}`;
    }, 1000);
}

// --- 2. 오디오 페이드 인 함수 ---
function playWithFadeIn(audioElement) {
    audioElement.volume = 0; 
    audioElement.currentTime = 0;
    audioElement.play();

    let vol = 0;
    const fadeInterval = setInterval(() => {
        if (vol < 1) {
            vol += 0.05; 
            audioElement.volume = Math.min(vol, 1);
        } else {
            clearInterval(fadeInterval); 
        }
    }, 100); 
}

// --- 3. 화면 전환 함수 ---
function showScene(sceneId) {
    mainScreen.style.display = 'none';
    const targetScene = document.getElementById(sceneId);
    if (targetScene) targetScene.style.display = 'flex';

    bgmMain.pause();

    if (sceneId === 'scene-window') {
        audioRain.currentTime = 0;
        audioRain.play();
        makeItRain(); 
    } 
    else if (sceneId === 'scene-pendulum') {
        audioPendulum.currentTime = 0;
        audioPendulum.play();
    }
    else if (sceneId === 'scene-candle') {
        playWithFadeIn(audioCandle);
    }
}

// --- 4. 돌아가기 ---
function goBack() {
    document.querySelectorAll('.scene').forEach(scene => {
        if(scene.id !== 'main-screen') scene.style.display = 'none';
    });
    mainScreen.style.display = 'flex';

    audioRain.pause();
    audioCandle.pause();
    audioPendulum.pause();
    
    bgmMain.play();
}

// --- 5. 이벤트 연결 ---
document.getElementById('obj-window').addEventListener('click', () => {
    sfxWindow.currentTime = 0;
    sfxWindow.play(); 
    showScene('scene-window');
});
document.getElementById('obj-pendulum').addEventListener('click', () => showScene('scene-pendulum'));
document.getElementById('obj-candle').addEventListener('click', () => showScene('scene-candle'));

document.getElementById('obj-light').addEventListener('click', () => {
    sfxLight.currentTime = 0;
    sfxLight.play();
});
document.getElementById('obj-mirror').addEventListener('click', () => {
    sfxMirror.currentTime = 0;
    sfxMirror.play();
});

document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', goBack);
});

// --- 6. 텍스트 롤링 ---
const messages = [
    "창문, 펜듈럼, 촛불 등을 클릭해 상호작용해요.",
    "명상의 공간에서 잠시나마 휴식해 보세요.",
    "나의 내면을 들여다보는 시간입니다.",
    "호흡에 집중하며 편안함을 느껴보세요."
];
let msgIndex = 0;

function startTextCarousel() {
    changeText();
    setInterval(changeText, 4000); 
}

function changeText() {
    textCarousel.style.opacity = '0';
    setTimeout(() => {
        textCarousel.textContent = messages[msgIndex];
        textCarousel.style.opacity = '1';
        msgIndex = (msgIndex + 1) % messages.length;
    }, 1000);
}

// --- 7. 비 내리는 효과 ---
var makeItRain = function() {
    document.querySelectorAll('.rain').forEach(el => el.innerHTML = '');
    var increment = 0;
    var drops = "";
    var backDrops = "";
    while (increment < 100) {
        var randoHundo = (Math.floor(Math.random() * (98 - 1 + 1) + 1));
        var randoFiver = (Math.floor(Math.random() * (5 - 2 + 1) + 2));
        increment += randoFiver;
        var dropHTML = '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
        drops += dropHTML;
        var backDropHTML = '<div class="drop" style="right: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
        backDrops += backDropHTML;
    }
    const frontRow = document.querySelector('.rain.front-row');
    if (frontRow) frontRow.innerHTML = drops;
    const backRow = document.querySelector('.rain.back-row');
    if (backRow) backRow.innerHTML = backDrops;
}