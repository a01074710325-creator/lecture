document.addEventListener("DOMContentLoaded", () => {
    
    // 1. 실시간 시계 작동 (시/분 단위와 초 단위 분리)
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        document.getElementById('clock-time').innerHTML = `${hours}시 ${minutes}분`;
        document.getElementById('clock-sec').innerHTML = `${seconds}초`;
    }
    setInterval(updateClock, 1000);
    updateClock(); 

    // 2. 모달 제어 변수
    const settingsModal = document.getElementById('settings-modal');
    const btnOpenSettings = document.getElementById('settings-btn');
    const btnCloseSettings = document.getElementById('close-settings-btn');
    const btnSaveSettings = document.getElementById('save-settings-btn');

    // 음악 재생 관련 변수
    let isPlaying = false;
    let currentVideoId = "jfKfPfyJRdk"; // 기본 배경음악 ID
    const musicBtn = document.getElementById('music-toggle-btn');
    const ytContainer = document.getElementById('yt-container');

    // 설정창 열기 / 닫기
    btnOpenSettings.addEventListener('click', () => settingsModal.classList.remove('hidden'));
    btnCloseSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));

    // 3. 설정 사항 반영 기능
    btnSaveSettings.addEventListener('click', () => {
        const newFontSize = document.getElementById('input-fontsize').value;
        const newTitle = document.getElementById('input-title').value;
        const newQR = document.getElementById('input-qr').value;
        const newYouTube = document.getElementById('input-youtube').value;
        const newSequence = document.getElementById('input-sequence').value;

        // 글자 크기 변경
        document.documentElement.style.setProperty('--base-font-size', `${newFontSize}px`);

        // 강좌명 업데이트
        if (newTitle.trim() !== "") {
            document.getElementById('course-title').textContent = newTitle;
        }

        // 출석 QR 코드 업데이트
        if (newQR.trim() !== "") {
            document.getElementById('qr-image').src = newQR;
        }

        // 강의 순서 업데이트
        if (newSequence.trim() !== "") {
            const sequenceList = document.getElementById('lecture-sequence');
            sequenceList.innerHTML = ""; // 기존 목록 비우기
            const lines = newSequence.split('\n');
            lines.forEach(line => {
                if(line.trim() !== "") {
                    const li = document.createElement('li');
                    li.textContent = line;
                    sequenceList.appendChild(li);
                }
            });
        }

        // 유튜브 영상 ID 업데이트
        if (newYouTube.trim() !== "") {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = newYouTube.match(regExp);
            if (match && match[2].length === 11) {
                currentVideoId = match[2];
                // 만약 현재 재생 중이었다면 바뀐 음악으로 다시 재생
                if (isPlaying) {
                    ytContainer.innerHTML = `<iframe width="10" height="10" src="https://www.youtube.com/embed/${currentVideoId}?autoplay=1" frameborder="0" allow="autoplay"></iframe>`;
                }
            }
        }

        // 적용 후 창 닫기
        settingsModal.classList.add('hidden');
    });

    // 4. 음악 재생 / 정지 버튼 클릭 이벤트
    musicBtn.addEventListener('click', () => {
        if (!isPlaying) {
            // 재생: 보이지 않는 iframe을 생성하여 음악 출력 (브라우저 정책 상 클릭 이벤트 내에서만 자동재생 허용)
            ytContainer.innerHTML = `<iframe width="10" height="10" src="https://www.youtube.com/embed/${currentVideoId}?autoplay=1" frameborder="0" allow="autoplay"></iframe>`;
            musicBtn.innerHTML = "⏸ 음악 정지";
            isPlaying = true;
        } else {
            // 정지: iframe 제거
            ytContainer.innerHTML = "";
            musicBtn.innerHTML = "🎵 음악 재생";
            isPlaying = false;
        }
    });
});
