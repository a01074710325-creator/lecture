document.addEventListener("DOMContentLoaded", () => {
    
    // 기본 설정값 정의
    const defaultSettings = {
        fontSize: "16",
        title: "강좌명을 입력해 주십시오",
        qr: "https://via.placeholder.com/200?text=QR+Code", 
        youtube: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
        sequence: "1. 등록 및 오리엔테이션\n2. 본 강의 진행\n3. 질의응답 및 마무리"
    };

    // 로컬 스토리지 데이터 불러오기 (오류 발생 시 기본값으로 대체되도록 안전 처리)
    let savedSettings = Object.assign({}, defaultSettings);
    try {
        const localData = JSON.parse(localStorage.getItem("dashboardSettings"));
        if (localData) {
            savedSettings = Object.assign(savedSettings, localData);
        }
    } catch (error) {
        console.error("설정 불러오기 오류, 기본값으로 초기화합니다.", error);
    }
    
    let currentQrBase64 = savedSettings.qr;

    // 화면에 설정 적용하는 함수
    function applySettings(settings) {
        document.documentElement.style.setProperty('--base-font-size', `${settings.fontSize}px`);
        document.getElementById('course-title').innerText = settings.title || "강좌명";
        
        if (settings.qr) {
            document.getElementById('qr-image').src = settings.qr;
        }

        const sequenceList = document.getElementById('lecture-sequence');
        sequenceList.innerHTML = "";
        const seqText = settings.sequence || ""; // 오류 방지를 위한 안전 장치
        const lines = seqText.split('\n');
        lines.forEach(line => {
            if(line.trim() !== "") {
                const li = document.createElement('li');
                li.innerText = line;
                sequenceList.appendChild(li);
            }
        });

        const ytText = settings.youtube || ""; // 오류 방지를 위한 안전 장치
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = ytText.match(regExp);
        if (match && match[2].length === 11) {
            currentVideoId = match[2];
        }
    }

    // 모달 입력창 초기화 함수
    function populateModalInputs(settings) {
        document.getElementById('input-fontsize').value = settings.fontSize || 16;
        document.getElementById('input-title').value = settings.title || "";
        document.getElementById('input-youtube').value = settings.youtube || "";
        document.getElementById('input-sequence').value = settings.sequence || "";
        document.getElementById('input-qr-file').value = ""; 
    }

    // 아날로그 시계 작동 로직
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
    
    // 즉시 시계 실행 및 1초 단위 업데이트
    updateAnalogClock();
    setInterval(updateAnalogClock, 1000); 
    
    // 초기 화면에 데이터 적용
    applySettings(savedSettings);

    // 기능 제어 변수
    const settingsModal = document.getElementById('settings-modal');
    const btnOpenSettings = document.getElementById('settings-btn');
    const btnCloseSettings = document.getElementById('close-settings-btn');
    const btnSaveSettings = document.getElementById('save-settings-btn');
    const qrFileInput = document.getElementById('input-qr-file');

    let isPlaying = false;
    let currentVideoId = "jfKfPfyJRdk"; 
    const musicBtn = document.getElementById('music-toggle-btn');
    const ytContainer = document.getElementById('yt-container');

    // QR 파일 업로드 시 이미지 데이터를 Base64 형태로 변환하여 임시 저장
    qrFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                currentQrBase64 = event.target.result; 
            };
            reader.readAsDataURL(file);
        }
    });

    // 설정창 열기 버튼 클릭 이벤트
    btnOpenSettings.addEventListener('click', () => {
        let currentSaved = Object.assign({}, defaultSettings);
        try {
            const localData = JSON.parse(localStorage.getItem("dashboardSettings"));
            if (localData) currentSaved = Object.assign(currentSaved, localData);
        } catch (e) {}
        
        currentQrBase64 = currentSaved.qr; 
        populateModalInputs(currentSaved);
        settingsModal.classList.remove('hidden');
    });

    // 설정창 닫기 버튼 클릭 이벤트
    btnCloseSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));

    // 설정 적용하기 버튼 클릭 이벤트
    btnSaveSettings.addEventListener('click', () => {
        const newSettings = {
            fontSize: document.getElementById('input-fontsize').value,
            title: document.getElementById('input-title').value,
            qr: currentQrBase64,
            youtube: document.getElementById('input-youtube').value,
            sequence: document.getElementById('input-sequence').value
        };

        localStorage.setItem("dashboardSettings", JSON.stringify(newSettings));
        applySettings(newSettings);

        // 음악이 재생 중일 경우 바뀐 링크에 맞추어 새로고침
        if (isPlaying) {
            ytContainer.innerHTML = `<iframe width="10" height="10" src="https://www.youtube.com/embed/${currentVideoId}?autoplay=1" frameborder="0" allow="autoplay"></iframe>`;
        }
        settingsModal.classList.add('hidden');
    });

    // 음악 재생 / 정지 버튼 클릭 이벤트
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
