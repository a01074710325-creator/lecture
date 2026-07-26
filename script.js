document.addEventListener("DOMContentLoaded", () => {
    
    // 기본값 정의
    const defaultSettings = {
        fontSize: "16",
        title: "강좌명을 입력해 주십시오",
        qr: "https://via.placeholder.com/150?text=QR+Code",
        youtube: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
        sequence: "1. 등록 및 오리엔테이션\n2. 본 강의 진행\n3. 질의응답 및 마무리"
    };

    // 로컬 스토리지에서 설정 불러오기 (없으면 기본값 사용)
    const savedSettings = JSON.parse(localStorage.getItem("dashboardSettings")) || defaultSettings;

    // 화면에 저장된 설정 적용 함수
    function applySettings(settings) {
        // 1. 글자 크기
        document.documentElement.style.setProperty('--base-font-size', `${settings.fontSize}px`);
        
        // 2. 강좌명
        document.getElementById('course-title').innerText = settings.title;

        // 3. QR 이미지
        if (settings.qr.trim() !== "") {
            document.getElementById('qr-image').src = settings.qr;
        }

        // 4. 강의 순서
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

        // 5. 유튜브 링크 처리
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = settings.youtube.match(regExp);
        if (match && match[2].length === 11) {
            currentVideoId = match[2];
        }
    }

    // 모달 input 필드에 현재 설정값 채워넣기 함수
    function populateModalInputs(settings) {
        document.getElementById('input-fontsize').value = settings.fontSize;
        document.getElementById('input-title').value = settings.title;
        document.getElementById('input-qr').value = settings.qr;
        document.getElementById('input-youtube').value = settings.youtube;
        document.getElementById('input-sequence').value = settings.sequence;
    }

    // 최초 로드시 적용
    applySettings(savedSettings);

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
    
    setInterval(updateAnalogClock, 1000);
    updateAnalogClock(); 

    // 모달 및 기능 제어 변수
    const settingsModal = document.getElementById('settings-modal');
    const btnOpenSettings = document.getElementById('settings-btn');
    const btnCloseSettings = document.getElementById('close-settings-btn');
    const btnSaveSettings = document.getElementById('save-settings-btn');

    let isPlaying = false;
    let currentVideoId = "jfKfPfyJRdk"; 
    const musicBtn = document.getElementById('music-toggle-btn');
    const ytContainer = document.getElementById('yt-container');

    // 설정창 열기 (열 때 최신 입력값 채워두기)
    btnOpenSettings.addEventListener('click', () => {
        const currentSaved = JSON.parse(localStorage.getItem("dashboardSettings")) || defaultSettings;
        populateModalInputs(currentSaved);
        settingsModal.classList.remove('hidden');
    });

    // 설정창 닫기
    btnCloseSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));

    // 설정 저장 및 적용 로직
    btnSaveSettings.addEventListener('click', () => {
        const newSettings = {
            fontSize: document.getElementById('input-fontsize').value,
            title: document.getElementById('input-title').value,
            qr: document.getElementById('input-qr').value,
            youtube: document.getElementById('input-youtube').value,
            sequence: document.getElementById('input-sequence').value
        };

        // LocalStorage에 저장
        localStorage.setItem("dashboardSettings", JSON.stringify(newSettings));

        // 화면에 즉시 반영
        applySettings(newSettings);

        // 재생 중일 경우 음악 링크도 업데이트
        if (isPlaying) {
            ytContainer.innerHTML = `<iframe width="10" height="10" src="https://www.youtube.com/embed/${currentVideoId}?autoplay=1" frameborder="0" allow="autoplay"></iframe>`;
        }

        // 창 닫기
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
