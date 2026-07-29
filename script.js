document.addEventListener("DOMContentLoaded", () => {
    
    // 강제 초기화를 위해 새로운 스토리지 키 할당
    const STORAGE_KEY = "dashboardSettings_V6"; 
    let isPlaying = false;
    let currentVideoId = "jfKfPfyJRdk";
    let currentQrBase64 = "https://via.placeholder.com/200?text=QR+Code";

    const defaultSettings = {
        fontSize: "16",
        title: "강좌명을 입력해 주십시오",
        qr: currentQrBase64, 
        youtube: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
        sequence: "1. 등록 및 오리엔테이션\n2. 본 강의 진행\n3. 질의응답 및 마무리"
    };

    let savedSettings = Object.assign({}, defaultSettings);
    try {
        const localData = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (localData) {
            savedSettings = Object.assign(savedSettings, localData);
            if (savedSettings.qr) currentQrBase64 = savedSettings.qr; 
        }
    } catch (error) {
        console.error("저장소 불러오기 오류", error);
    }
    
    function applySettings(settings) {
        if(!settings) return;
        
        document.documentElement.style.setProperty('--base-font-size', `${settings.fontSize || 16}px`);
        
        const titleEl = document.getElementById('course-title');
        if (titleEl) titleEl.innerText = settings.title || "강좌명";
        
        const qrEl = document.getElementById('qr-image');
        if (qrEl && settings.qr) qrEl.src = settings.qr;

        const sequenceList = document.getElementById('lecture-sequence');
        if (sequenceList) {
            sequenceList.innerHTML = "";
            const seqText = settings.sequence || ""; 
            const lines = seqText.split('\n');
            lines.forEach(line => {
                if(line.trim() !== "") {
                    const li = document.createElement('li');
                    li.innerText = line;
                    sequenceList.appendChild(li);
                }
            });
        }

        const ytText = settings.youtube || ""; 
        const match = ytText.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
        if (match && match[2].length === 11) {
            currentVideoId = match[2];
        }
    }

    function populateModalInputs(settings) {
        const fs = document.getElementById('input-fontsize');
        if (fs) fs.value = settings.fontSize || 16;
        
        const ti = document.getElementById('input-title');
        if (ti) ti.value = settings.title || "";
        
        const yt = document.getElementById('input-youtube');
        if (yt) yt.value = settings.youtube || "";
        
        const sq = document.getElementById('input-sequence');
        if (sq) sq.value = settings.sequence || "";
        
        const qf = document.getElementById('input-qr-file');
        if (qf) qf.value = ""; 
    }

    const hourHand = document.getElementById('hour-hand');
    const minHand = document.getElementById('min-hand');
    const secHand = document.getElementById('sec-hand');

    function updateAnalogClock() {
        if (!hourHand || !minHand || !secHand) return;
        
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
    
    updateAnalogClock();
    setInterval(updateAnalogClock, 1000); 
    
    applySettings(savedSettings);

    const settingsModal = document.getElementById('settings-modal');
    const btnOpenSettings = document.getElementById('settings-btn');
    const btnCloseSettings = document.getElementById('close-settings-btn');
    const btnSaveSettings = document.getElementById('save-settings-btn');
    const qrFileInput = document.getElementById('input-qr-file');
    const musicBtn = document.getElementById('music-toggle-btn');
    const ytContainer = document.getElementById('yt-container');

    if (qrFileInput) {
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
    }

    if (btnOpenSettings && settingsModal) {
        btnOpenSettings.addEventListener('click', () => {
            let currentSaved = Object.assign({}, defaultSettings);
            try {
                const localData = JSON.parse(localStorage.getItem(STORAGE_KEY));
                if (localData) currentSaved = Object.assign(currentSaved, localData);
            } catch (e) {}
            
            currentQrBase64 = currentSaved.qr || defaultSettings.qr; 
            populateModalInputs(currentSaved);
            settingsModal.classList.remove('hidden');
        });
    }

    if (btnCloseSettings && settingsModal) {
        btnCloseSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));
    }

    if (btnSaveSettings && settingsModal) {
        btnSaveSettings.addEventListener('click', () => {
            const fs = document.getElementById('input-fontsize');
            const ti = document.getElementById('input-title');
            const yt = document.getElementById('input-youtube');
            const sq = document.getElementById('input-sequence');

            const newSettings = {
                fontSize: fs ? fs.value : 16,
                title: ti ? ti.value : "",
                qr: currentQrBase64,
                youtube: yt ? yt.value : "",
                sequence: sq ? sq.value : ""
            };

            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
            } catch (e) {
                alert("업로드하신 QR 이미지의 용량이 너무 큽니다. 화면 캡처 등을 통해 용량을 줄인 사진을 올려주십시오.");
                return;
            }
            
            applySettings(newSettings);

            if (isPlaying && ytContainer) {
                ytContainer.innerHTML = `<iframe width="10" height="10" src="https://www.youtube.com/embed/${currentVideoId}?autoplay=1" frameborder="0" allow="autoplay"></iframe>`;
            }
            settingsModal.classList.add('hidden');
        });
    }

    if (musicBtn && ytContainer) {
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
    }
});
