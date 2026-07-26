document.addEventListener("DOMContentLoaded", () => {
    
    // 1. 실시간 시계 작동
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ko-KR', { hour12: false });
        document.getElementById('clock').textContent = timeString;
    }
    setInterval(updateClock, 1000);
    updateClock(); // 초기 즉시 실행

    // 2. 설정 모달 창 제어 변수
    const settingsModal = document.getElementById('settings-modal');
    const btnOpenSettings = document.getElementById('settings-btn');
    const btnCloseSettings = document.getElementById('close-settings-btn');
    const btnSaveSettings = document.getElementById('save-settings-btn');

    // 모달 열기 및 닫기
    btnOpenSettings.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
    });

    btnCloseSettings.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });

    // 3. 설정 사항 반영 기능
    btnSaveSettings.addEventListener('click', () => {
        const newTitle = document.getElementById('input-title').value;
        const newQR = document.getElementById('input-qr').value;
        const newYouTube = document.getElementById('input-youtube').value;

        // 강좌명 업데이트
        if (newTitle.trim() !== "") {
            document.getElementById('course-title').textContent = newTitle;
        }

        // 출석 QR 코드 업데이트
        if (newQR.trim() !== "") {
            document.getElementById('qr-image').src = newQR;
        }

        // 유튜브 링크 업데이트 (동영상 ID 자동 추출)
        if (newYouTube.trim() !== "") {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = newYouTube.match(regExp);
            
            // 영상 ID가 정상적으로 추출되면 임베드 형식으로 변경
            const videoId = (match && match[2].length === 11) ? match[2] : null;
            if (videoId) {
                document.getElementById('youtube-player').src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            }
        }

        // 설정 완료 후 창 닫기 및 입력값 초기화
        settingsModal.classList.add('hidden');
        document.getElementById('input-title').value = '';
        document.getElementById('input-qr').value = '';
        document.getElementById('input-youtube').value = '';
    });
});
