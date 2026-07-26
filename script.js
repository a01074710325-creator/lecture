document.addEventListener("DOMContentLoaded", () => {
    
    // 기본 설정값 정의
    const defaultSettings = {
        fontSize: "16",
        title: "강좌명을 입력해 주십시오",
        qr: "https://via.placeholder.com/200?text=QR+Code", // 기본 이미지
        youtube: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
        sequence: "1. 등록 및 오리엔테이션\n2. 본 강의 진행\n3. 질의응답 및 마무리"
    };

    // 로컬 스토리지에서 설정 불러오기
    const savedSettings = JSON.parse(localStorage.getItem("dashboardSettings")) || defaultSettings;
    
    // 업로드된 QR 이미지를 임시 저장할 변수 (초기값은 저장된 설정의 이미지)
    let currentQrBase64 = savedSettings.qr;

    // 화면에 설정 적용하는 함수
    function applySettings(settings) {
        document.documentElement.style.setProperty('--base-font-size', `${settings.fontSize}px`);
        document.getElementById('course-title').innerText = settings.title;
        document.getElementById('qr-image').src = settings.qr;

        const sequenceList = document.getElementById('lecture-sequence');
        sequenceList.innerHTML = "";
        const lines = settings.sequence.split('\n');
        lines.forEach(line => {
            if(line.trim() !== "") {
                const li = document.createElement('li');
                li.innerText = line;
                sequenceList.appendChild(li);
            }
        });

        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = settings.youtube.match(regExp);
        if (match && match[2].length === 11) {
            currentVideoId = match[2];
        }
    }

    // 모달 입력창 초기화 함수
    function populateModalInputs(settings) {
        document.getElementById('input-fontsize').value = settings.fontSize;
        document.getElementById('input-title').value = settings.title;
        document.getElementById('input-youtube').value = settings.youtube;
        document.getElementById('input-sequence').value = settings.sequence;
        // 파일 입력창(input type="file")은 보안상 value를 임의로 채울 수 없으므로 비워둡니다.
        document.getElementById('input-qr-file').value = ""; 
    }

    // 초기 적용
    applySettings(savedSettings);

    // 아날로그 시계 작동
    const hourHand = document.getElementById('hour-hand');
    const minHand = document.getElementById('min-hand');
    const secHand = document.getElementById('sec-hand');

    function updateAnalogClock() {
        const now = new Date();
        const seconds = now.getSeconds();
        const mins = now.getMinutes();
        const hours = now.getHours();

        const secondsDegrees = (seconds / 60) * 360;
        const minsDegrees = ((mins / 60) * 360) + ((seconds / 60) * 6);
        const hoursDegrees = ((hours / 12) * 360) + ((mins / 60) * 30);

        secHand.style.transform = `translateX(-50%) rotate(${secondsDegrees}deg)`;
        minHand.style.transform = `translateX(-50%) rotate(${minsDegrees}deg)`;
        hourHand.style.transform = `translateX(-50%) rotate(${hoursDegrees}deg)`;
    }
    
    setInterval(updateAnalogClock, 1000);
    updateAnalogClock(); 

    // 제어 변수들
    const settingsModal = document.getElementById('settings-modal');
    const btnOpenSettings = document.getElementById('settings-btn');
    const btnCloseSettings = document.getElementById('close-settings-btn');
    const btnSaveSettings = document.getElementById('save-settings-btn');
    const qrFileInput = document.getElementById('input-qr-file');

    let isPlaying = false;
    let currentVideoId = "jfKfPfyJRdk"; 
    const musicBtn = document.getElementById('music-toggle-btn');
    const ytContainer = document.getElementById('yt-container');

    // QR 파일 업로드 시 이미지 데이터를 Base64 형태로 변환하여 저장
    qrFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                currentQrBase64 = event.target.result; // 변환된 이미지 데이터 저장
            };
            reader.readAsDataURL(file);
        }
    });

    // 설정 열기/닫기
    btnOpenSettings.addEventListener('click', () => {
        const currentSaved = JSON.parse(localStorage.getItem("dashboardSettings")) || defaultSettings;
        currentQrBase64 = currentSaved.qr; // 창을 열 때 현재 저장된 이미지 유지
        populateModalInputs(currentSaved);
        settingsModal.classList.remove('hidden');
    });

    btnCloseSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));

    // 설정 저장
    btnSaveSettings.addEventListener('click', () => {
        const newSettings = {
            fontSize: document.getElementById('input-fontsize').value,
            title: document.getElementById('input-title').value,
            qr: currentQrBase64, // 파일 리더로 변환된 이미지 데이터 적용
            youtube: document.getElementById('input-youtube').value,
            sequence: document.getElementById('input-sequence').value
        };

        localStorage.setItem("dashboardSettings", JSON.stringify(newSettings));
        applySettings(newSettings);

        if (isPlaying) {
            ytContainer.innerHTML = `<iframe width="10" height="10" src="https://www.youtube.com/embed/${currentVideoId}?autoplay=1" frameborder="0" allow="autoplay"></iframe>`;
        }
        settingsModal.classList.add('hidden');
    });

    // 음악 재생 제어
    musicBtn.addEventListener('click', () => {
        if (!isPlaying) {
            ytContainer.innerHTML = `<iframe width="10" height="10" src="https://www.youtube.com/embed/${currentVideoId}?autoplay=1" frameborder="0" allow="autoplay"></iframe>`;
            musicBtn.classList.add('playing');
            isPlaying = true;
        } else {
            ytContainer.innerHTML = "";
            musicBtn.classList.remove('playing');
            isPlaying = false;
        }
    });
});
