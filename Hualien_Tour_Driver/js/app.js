// v1.3 離線優先 + TTS + GPS + 中日英韓國語切換全域引擎

const API_URL = "https://script.google.com/macros/s/AKfycbyKBsvUd_IkALnT0eY6q9aM4IGOHBRAMf45nqb6Q3hCmO6yv06uECkGY9HLh91eUpBs/exec";
const STORAGE_KEY = "hualien_tour_data";

let globalTourData = [];
let isPlaying = false;
let globalLang = 'TW'; // 預設語系

// 語系對應映射表 (核心引擎參數)
const LANG_MAP = {
    'TW': { code: 'zh-TW', audioKey: 'AudioText_TW', upsellKey: 'UpsellText', label: '中文' },
    'EN': { code: 'en-US', audioKey: 'AudioText_EN', upsellKey: 'UpsellText_EN', label: 'English' },
    'JP': { code: 'ja-JP', audioKey: 'AudioText_JP', upsellKey: 'UpsellText_JP', label: '日本語' },
    'KR': { code: 'ko-KR', audioKey: 'AudioText_KR', upsellKey: 'UpsellText_KR', label: '한국어' }
};

document.addEventListener("DOMContentLoaded", () => {
    updateNetworkStatus();
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    initApp();
});

// 切換全域語系檔位
function switchLanguage(langKey, btnElement) {
    // UI 高亮切換
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    if(btnElement) btnElement.classList.add('active');
    
    // 強制停止正在播放的語音
    stopAudio();
    
    // 更新狀態與重繪畫面
    globalLang = langKey;
    renderApp(globalTourData);
    
    Swal.fire({
        title: '語系已切換',
        text: `底層發音引擎已綁定為：${LANG_MAP[langKey].label}`,
        icon: 'success',
        timer: 1000,
        showConfirmButton: false
    });
}

function updateNetworkStatus() {
    const statusBar = document.getElementById('status-bar');
    if (navigator.onLine) {
        statusBar.textContent = "狀態：連線 🟢 (可更新資料庫)";
        statusBar.className = "status-online";
    } else {
        statusBar.textContent = "狀態：離線 🔴 (從快取運作)";
        statusBar.className = "status-offline";
    }
}

function initApp() {
    const cachedData = localStorage.getItem(STORAGE_KEY);
    if (cachedData) {
        try {
            globalTourData = JSON.parse(cachedData);
            renderApp(globalTourData);
            if (navigator.onLine && API_URL !== "") fetchDataFromGAS(true);
        } catch (e) {
            console.error("快取解析失敗", e);
            requireSyncAlert();
        }
    } else {
        requireSyncAlert();
    }
}

// === 第三模組：GPS 與測距 ===
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
}

function getLocationAndSort() {
    if (!navigator.geolocation) {
        Swal.fire('錯誤', '裝置不支援定位功能', 'error'); return;
    }
    Swal.fire({ title: '定位中...', text: '抓取衛星座標', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            globalTourData.forEach(spot => {
                spot.distance = (spot.Lat && spot.Lng) ? calculateDistance(userLat, userLng, spot.Lat, spot.Lng) : 9999;
            });
            globalTourData.sort((a, b) => a.distance - b.distance);
            Swal.fire({ title: '定位成功', icon: 'success', timer: 1000, showConfirmButton: false });
            renderApp(globalTourData);
        },
        (error) => { Swal.fire('定位失敗', '請確認已開啟權限', 'error'); },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

// 根據當前語系動態渲染內容
function renderApp(data) {
    const container = document.getElementById('app-container');
    container.innerHTML = ''; 
    
    const langConf = LANG_MAP[globalLang];

    data.forEach((spot, index) => {
        const card = document.createElement('div');
        let cardClasses = 'spot-card';
        if (spot.distance !== undefined && index === 0) cardClasses += ' card-nearest';
        card.className = cardClasses;

        let distanceHTML = '';
        if (spot.distance !== undefined && spot.distance !== 9999) {
            let distText = spot.distance < 1 ? Math.round(spot.distance * 1000) + 'm' : spot.distance.toFixed(1) + 'km';
            distanceHTML = `<span class="distance-badge">📍 ${distText}</span>`;
        }

        // 動態抽取當前語系的講稿
        const currentAudio = spot[langConf.audioKey] || '<span style="color:#F44336">⛔ (資料庫無翻譯)</span>';
        const currentUpsell = spot[langConf.upsellKey] || '<span style="color:#F44336">⛔ (無行銷推廣)</span>';

        card.innerHTML = `
            <h2>${spot.Name} ${distanceHTML}</h2>
            <p><strong>導覽 (${langConf.label})：</strong><br>${currentAudio}</p>
            <p><strong>行銷 (${langConf.label})：</strong><br>${currentUpsell}</p>
            <button id="btn-audio-${spot.ID}" class="btn-massive btn-play" onclick="handleAudioClick('${spot.ID}')">
                🔊 播放導覽
            </button>
        `;
        container.appendChild(card);
    });
}

function handleAudioClick(spotId) {
    const btn = document.getElementById(`btn-audio-${spotId}`);
    if (btn.classList.contains('btn-stop')) {
        stopAudio();
        return;
    }
    const spot = globalTourData.find(s => s.ID == spotId);
    if (spot) {
        const langConf = LANG_MAP[globalLang];
        playAudio(spotId, spot[langConf.audioKey], spot[langConf.upsellKey], langConf.code);
    }
}

function stopAudio() {
    window.speechSynthesis.cancel();
    isPlaying = false;
    document.querySelectorAll('[id^="btn-audio-"]').forEach(btn => {
        btn.className = "btn-massive btn-play";
        btn.innerHTML = "🔊 播放導覽";
    });
}

function playAudio(spotId, mainText, upsellText, ttsLangCode) {
    stopAudio();
    if (!mainText && !upsellText) {
        Swal.fire({ title: '缺乏語音資料', text: '此景點尚未建置當前國籍的講稿', icon: 'error' });
        return;
    }

    const btn = document.getElementById(`btn-audio-${spotId}`);
    if (btn) {
        btn.className = "btn-massive btn-stop";
        btn.innerHTML = "⏹️ 停止播放";
    }
    isPlaying = true;

    const speakUpsell = () => {
        if (!isPlaying || !upsellText) { stopAudio(); return; }
        const upsellUtterance = new SpeechSynthesisUtterance(upsellText);
        upsellUtterance.lang = ttsLangCode; // 強制綁定大腦語系
        upsellUtterance.rate = 0.9;
        upsellUtterance.onend = () => stopAudio();
        upsellUtterance.onerror = () => stopAudio();
        window.speechSynthesis.speak(upsellUtterance);
    };

    if (mainText) {
        const mainUtterance = new SpeechSynthesisUtterance(mainText);
        mainUtterance.lang = ttsLangCode; // 強制綁定大腦語系
        mainUtterance.rate = 0.9;
        mainUtterance.onend = () => speakUpsell();
        mainUtterance.onerror = () => stopAudio();
        window.speechSynthesis.speak(mainUtterance);
    } else {
        speakUpsell();
    }
}

function requireSyncAlert() {
    Swal.fire({ title: '無景點資料！', text: '請連線下載', icon: 'warning', allowOutsideClick: false });
}

function forceSync() {
    if (!navigator.onLine) {
        Swal.fire('無法同步', '目前沒有網路', 'error'); return;
    }
    Swal.fire({ title: '雲端同步中', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    fetchDataFromGAS(false);
}

function fetchDataFromGAS(isSilent) {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            globalTourData = data;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            if (!isSilent) Swal.fire({ title: '同步成功', icon: 'success' });
            renderApp(globalTourData); // 會自動使用當前語言重繪
        })
        .catch(error => {
            if (!isSilent) Swal.fire('同步失敗', 'API錯誤', 'error');
        });
}
