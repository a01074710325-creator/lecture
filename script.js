document.addEventListener("DOMContentLoaded", () => {
    
    // 1. 아날로그 시계 작동 로직
    const hourHand = document.getElementById('hour-hand');
    const minHand = document.getElementById('min-hand');
    const secHand = document.getElementById('sec-hand');

    function updateAnalogClock() {
        const now = new Date();
        const seconds = now.getSeconds();
        const mins = now.getMinutes();
        const hours = now.getHours();

        // 각도 계산 (기본 방향이 12시를 향하게 설정되어 있음)
        const secondsDegrees = (seconds / 60) * 360;
        const minsDegrees = ((mins / 60) * 360) + ((seconds / 60) * 6);
        const hoursDegrees = ((hours / 12) * 360) + ((mins / 60) * 30);

        secHand.style.transform = `translateX(-50%) rotate(${secondsDegrees}deg)`;
        minHand.style.transform = `translateX(-50%) rotate(${minsDegrees}deg)`;
        hourHand.style.transform = `translateX(-50%) rotate(${hoursDegrees}deg)`;
    }
    
    setInterval(updateAnalogClock, 1000);
    updateAnalogClock(); 

    // 2. 모달 및 기능 제어 변수
    const settingsModal = document.getElementById('settings-modal');
    const btnOpenSettings = document.getElementById('settings-btn');
    const btnCloseSettings = document.getElementById('close-settings-btn');
    const btnSaveSettings = document.getElementById('save-settings-btn');

    let isPlaying = false;
    let currentVideoId = "jfKfPfyJRdk"; 
    const musicBtn = document.getElementById('music-toggle-btn');
    const ytContainer = document.getElementById('yt-container');

    // 설정창 열기 / 닫기
    btnOpenSettings.addEventListener('click', () => settingsModal.classList.remove('hidden'));
    btnCloseSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));

    // 3. 설정 사항 화면 즉시 반영 로직 (수정됨)
    btnSaveSettings.addEventListener('click', () => {
        // 입력값 가져오기
        const newFontSize = document.getElementById('input-fontsize').value;
        const newTitle = document.getElementById('input-title').value;
        const newQR = document.getElementById('input-qr').value;
        const newYouTube = document.getElementById('input-youtube').value;
        const newSequence = document.getElementById('input-sequence').value;

        // 글자 크기 변경 적용
        document.documentElement.style.setProperty('--base-font-size', `${newFontSize}px`);

        // 강좌명 업데이트
        if (newTitle.trim() !== "") {
            document.getElementById('course-title').innerText = newTitle;
        }

        // 출석 QR 코드 업데이트 (빈칸이 아닐 때만 이미지 소스 변경)
        if (newQR.trim() !== "") {
            document.getElementById('qr-image').src = newQR;
        }

        // 강의 순서 업데이트
        if (newSequence.trim() !== "") {
            const sequenceList = document.getElementById('lecture-sequence');
            sequenceList.innerHTML = ""; 
            const lines = newSequence.split('\n');
            lines.forEach(line => {
                if(line.trim() !== "") {
                    const li = document.createElement('li');
                    li.innerText = line;
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
                // 음악이 재생 중인 상태에서 링크를 변경하면 새 음악으로 변경 적용
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
            // 재생 로직
            ytContainer.innerHTML = `<iframe width="10" height="10" src="https://www.youtube.com/embed/${currentVideoId}?autoplay=1" frameborder="0" allow="autoplay"></iframe>`;
            musicBtn.classList.add('playing'); // 재생 중 모양(네모 정지 버튼)으로 CSS 변경
            isPlaying = true;
        } else {
            // 정지 로직
            ytContainer.innerHTML = "";
            musicBtn.classList.remove('playing'); // 기본 모양(세모 재생 버튼)으로 CSS 복귀
            isPlaying = false;
        }
    });
});
