import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Car, 
  User, 
  Navigation, 
  LogOut, 
  Coffee, 
  ArrowLeft, 
  AlertCircle, 
  PhoneCall, 
  CheckCircle, 
  Hand, 
  UserCog 
} from 'lucide-react';

// --- 排班點設定 (真實座標) ---
const LOCATIONS = [
  { id: 'station_front', name: '花蓮前站', desc: '出口右側排班區', lat: 23.9930, lng: 121.6011, queueCount: 5 },
  { id: 'station_back', name: '花蓮後站', desc: '富吉路出口', lat: 23.9925, lng: 121.5985, queueCount: 2 },
  { id: 'tzuchi', name: '慈濟醫院', desc: '大愛樓門口', lat: 23.9975, lng: 121.5945, queueCount: 0 },
  { id: 'mennoh', name: '門諾醫院', desc: '民權路大門', lat: 23.9970, lng: 121.6250, queueCount: 3 },
  { id: 'downtown', name: '花蓮市區', desc: '公正包子/東大門', lat: 23.9780, lng: 121.6120, queueCount: 8 },
  { id: 'jian', name: '吉安車站', desc: '站前廣場', lat: 23.9700, lng: 121.5670, queueCount: 1 },
  { id: 'h805', name: '805醫院', desc: '國軍總醫院', lat: 24.0350, lng: 121.6050, queueCount: 2 },
  { id: 'qixingtan', name: '七星潭', desc: '賞星廣場', lat: 24.0280, lng: 121.6350, queueCount: 4 }
];

// 計算距離公式 (Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // 地球半徑 (公尺)
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
};

export default function App() {
  // --- 狀態管理 ---
  const [currentView, setCurrentView] = useState('loading');
  const [userProfile, setUserProfile] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDriver, setIsDriver] = useState(false);
  
  // GPS 相關
  const [gpsStatus, setGpsStatus] = useState('idle'); // idle, checking, success, error, out_of_range
  const [distanceInfo, setDistanceInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // 司機狀態: offline, queuing, serving
  const [driverStatus, setDriverStatus] = useState('offline');

  // --- 初始化 ---
  useEffect(() => {
    // 模擬 LIFF 登入延遲，真實環境會更快
    const loginTimer = setTimeout(() => {
      handleLogin('PASSENGER_USER', false);
    }, 800);

    // 讀取記憶電話
    const savedPhone = localStorage.getItem('passenger_phone_v1');
    if (savedPhone) setPhoneNumber(savedPhone);

    return () => clearTimeout(loginTimer);
  }, []);

  const handleLogin = (id, isDriverRole) => {
    setUserProfile({
      userId: id,
      displayName: isDriverRole ? '運將大哥' : '訪客',
    });
    setIsDriver(isDriverRole);
    setCurrentView('lobby');
    setGpsStatus('idle');
    setDistanceInfo(null);
    setDriverStatus('offline');
  };

  // --- 核心功能：真實 GPS 定位 ---
  const performGPSCheck = (onSuccess) => {
    setGpsStatus('checking');
    setErrorMsg('');
    
    if (!navigator.geolocation) {
      setGpsStatus('error');
      setErrorMsg('您的裝置不支援 GPS 定位');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // 防呆：如果尚未選擇地點（雖然 UI 上應該擋住了），預設為第一個地點避免錯誤
        const targetLat = selectedSpot ? selectedSpot.lat : LOCATIONS[0].lat;
        const targetLng = selectedSpot ? selectedSpot.lng : LOCATIONS[0].lng;

        const dist = calculateDistance(latitude, longitude, targetLat, targetLng);
        setDistanceInfo(dist);

        // 判斷距離 (1000公尺寬限值)
        if (dist <= 1000) {
          setGpsStatus('success');
          if (onSuccess) onSuccess();
        } else {
          setGpsStatus('out_of_range');
        }
      },
      (error) => {
        console.error("GPS Error", error);
        setGpsStatus('error');
        let msg = '定位失敗';
        switch(error.code) {
          case error.PERMISSION_DENIED: msg = '請允許瀏覽器/LINE使用位置權限'; break;
          case error.POSITION_UNAVAILABLE: msg = '無法偵測位置，請到室外試試'; break;
          case error.TIMEOUT: msg = '定位逾時，請重試'; break;
          default: msg = '定位發生未知錯誤'; break;
        }
        setErrorMsg(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // 乘客按鈕觸發
  const handlePassengerCheckGPS = () => {
    performGPSCheck(null); // 乘客只要顯示狀態即可，不用額外 callback
  };

  // 司機打卡觸發
  const handleDriverCheckIn = () => {
    performGPSCheck(() => {
      // 定位成功後的回呼
      setDriverStatus('queuing');
    });
  };

  // 乘客送出
  const handlePassengerSubmit = (e) => {
    e.preventDefault();
    if (gpsStatus !== 'success') {
      alert('請先完成定位檢查');
      return;
    }
    if (phoneNumber.length < 9) return;
    localStorage.setItem('passenger_phone_v1', phoneNumber);
    setCurrentView('success_passenger');
  };

  // 切換地點
  const handleLocationClick = (spot) => {
    setSelectedSpot(spot);
    setGpsStatus('idle');
    setDistanceInfo(null);
    setErrorMsg('');
    
    if (isDriver) {
      setCurrentView('driver');
    } else {
      setCurrentView('passenger');
    }
  };

  // --- 畫面元件 ---

  const LobbyView = () => (
    <div className="space-y-4 pb-12 w-full">
      <div className="bg-yellow-400 p-5 rounded-b-3xl shadow-md text-gray-900 mb-4 w-full">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Car className="w-8 h-8" />
          花蓮排班小黃
        </h1>
        <p className="text-sm opacity-90 mt-1 font-medium pl-1">
          {isDriver ? `運將模式：${userProfile?.displayName}` : '安全 • 便捷 • 在地服務'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 w-full">
        {LOCATIONS.map((spot) => (
          <button
            key={spot.id}
            onClick={() => handleLocationClick(spot)}
            className="relative flex flex-col items-center justify-center p-3 bg-white border border-gray-100 rounded-2xl shadow-sm active:bg-yellow-50 active:scale-95 transition h-36 w-full"
          >
            <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold ${
              spot.queueCount > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
            }`}>
              {spot.queueCount > 0 ? `${spot.queueCount} 車` : '無車'}
            </div>
            <MapPin className="w-8 h-8 text-blue-600 mb-2 mt-2" />
            <span className="font-bold text-lg text-gray-800">{spot.name}</span>
            <span className="text-xs text-gray-500 mt-1 text-center">{spot.desc}</span>
          </button>
        ))}
      </div>

      {/* 隱藏式司機入口 */}
      <div className="mt-8 text-center w-full">
        <button 
          onClick={() => {
            if (window.confirm('確認切換為「司機排班模式」？')) {
              handleLogin('DRIVER_DEMO', true);
            }
          }}
          className="text-xs text-gray-400 py-4 hover:text-gray-600 flex items-center justify-center gap-1 w-full"
        >
          <UserCog className="w-3 h-3" /> 運將專用入口
        </button>
      </div>
    </div>
  );

  const PassengerForm = () => (
    <div className="bg-white min-h-screen flex flex-col w-full">
      <div className="bg-yellow-400 p-4 shadow-sm flex items-center gap-2 sticky top-0 z-10 w-full">
        <button onClick={() => setCurrentView('lobby')} className="p-1 rounded-full hover:bg-yellow-500/20">
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h2 className="font-bold text-lg text-gray-900">{selectedSpot?.name} 叫車</h2>
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto w-full">
        <div className="mb-8 text-center">
           <div className="inline-block p-3 bg-blue-50 rounded-full mb-2">
            <Car className="w-8 h-8 text-blue-600" />
           </div>
           <p className="text-gray-600">目前排班車輛：<span className="font-bold text-green-600 text-xl">{selectedSpot?.queueCount}</span> 台</p>
        </div>

        {/* GPS 區塊 */}
        <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100 w-full">
          <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2 text-sm">
            <Navigation className="w-4 h-4" /> 步驟一：確認位置
          </h3>
          
          {gpsStatus === 'idle' && (
            <button onClick={handlePassengerCheckGPS} className="w-full bg-white border-2 border-blue-600 text-blue-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:bg-blue-50">
              <MapPin className="w-5 h-5" /> 讀取我的位置
            </button>
          )}
          
          {gpsStatus === 'checking' && (
            <div className="text-center py-3 text-gray-500 flex flex-col items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500 mb-2"></div>
              <span>定位中，請稍候...</span>
            </div>
          )}
          
          {gpsStatus === 'success' && (
            <div className="bg-green-100 text-green-800 p-3 rounded-lg flex items-center gap-3 w-full">
              <div className="bg-green-500 rounded-full p-1 text-white shrink-0"><CheckCircle className="w-4 h-4" /></div>
              <div className="text-sm">
                <p className="font-bold">定位成功！</p>
                <p>距離排班點約 {distanceInfo} 公尺</p>
              </div>
            </div>
          )}

          {(gpsStatus === 'error' || gpsStatus === 'out_of_range') && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-start gap-3 w-full">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold">{gpsStatus === 'error' ? '定位失敗' : '距離太遠'}</p>
                <p>{gpsStatus === 'error' ? errorMsg : `距離 ${distanceInfo} 公尺，請移動到現場再叫車。`}</p>
                <button onClick={handlePassengerCheckGPS} className="text-blue-600 underline mt-2 font-bold">重試</button>
              </div>
            </div>
          )}
        </div>

        {/* 表單區塊 */}
        {gpsStatus === 'success' && (
          <form onSubmit={handlePassengerSubmit} className="space-y-6 animate-fade-in w-full">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">步驟二：聯絡電話</label>
              <div className="relative">
                <div className="absolute left-3 top-3.5 text-gray-400"><Phone className="w-5 h-5" /></div>
                <input 
                  type="tel" 
                  required 
                  placeholder="09xx-xxx-xxx" 
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none text-lg bg-white" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                />
              </div>
              <p className="text-xs text-red-500 mt-2 font-bold flex items-center gap-1">
                <PhoneCall className="w-3 h-3" /> 司機接單後會撥打此電話確認
              </p>
            </div>
            <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 rounded-xl text-xl shadow-lg active:scale-95 transition">
              確認叫車
            </button>
          </form>
        )}
      </div>
    </div>
  );

  const DriverDashboard = () => (
    <div className="bg-white min-h-screen flex flex-col w-full">
       <div className="bg-gray-800 p-4 shadow-md flex items-center justify-between sticky top-0 z-10 text-white w-full">
        <div className="flex items-center gap-2">
           {driverStatus !== 'serving' && (
            <button onClick={() => setCurrentView('lobby')} className="p-1 rounded-full hover:bg-gray-700">
              <ArrowLeft className="w-6 h-6" />
            </button>
           )}
          <h2 className="font-bold text-lg">{selectedSpot?.name}</h2>
        </div>
        <div className={`w-3 h-3 rounded-full ${
          driverStatus === 'queuing' ? 'bg-green-500 animate-pulse' : 
          driverStatus === 'serving' ? 'bg-blue-500' : 'bg-red-500'
        }`}></div>
      </div>

      <div className="p-6 flex-1 flex flex-col w-full">
        {driverStatus === 'offline' && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            {(gpsStatus === 'error' || gpsStatus === 'out_of_range') && (
              <div className="w-full bg-red-100 text-red-800 p-4 rounded-xl mb-4 text-center">
                <p className="font-bold text-lg mb-1">無法打卡</p>
                <p className="text-sm">{gpsStatus === 'error' ? errorMsg : `距離排班點 ${distanceInfo} 公尺，請進入範圍內。`}</p>
                <button onClick={handleDriverCheckIn} className="mt-2 text-sm underline font-bold">重試 GPS</button>
              </div>
            )}
            
            <div className="bg-gray-100 p-6 rounded-full">
              <Coffee className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">準備好開始排班了嗎？</p>
            
            <button 
              onClick={handleDriverCheckIn}
              disabled={gpsStatus === 'checking'}
              className="w-full bg-green-600 text-white font-bold py-4 rounded-xl text-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:bg-gray-400"
            >
              {gpsStatus === 'checking' ? '定位中...' : <><Navigation className="w-6 h-6" /> GPS 打卡上線</>}
            </button>
            <p className="text-xs text-gray-400">需在排班點 1000m 範圍內</p>
          </div>
        )}

        {driverStatus === 'queuing' && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="bg-green-100 p-6 rounded-full border-4 border-green-500 animate-pulse relative">
              <Car className="w-12 h-12 text-green-700" />
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">3號</div>
            </div>
            
            <div className="text-center w-full bg-blue-50 p-4 rounded-xl border border-blue-200 mb-4">
              <p className="text-xl font-bold text-blue-800 flex items-center justify-center gap-2">
                <CheckCircle className="w-6 h-6" /> 排班中
              </p>
              <p className="text-sm text-gray-500 mt-2">有客時 LINE 會通知您</p>
            </div>

            <button onClick={() => setDriverStatus('serving')} className="w-full bg-yellow-400 text-yellow-900 font-bold py-3 rounded-xl text-lg flex items-center justify-center gap-2 shadow-sm">
              <Hand className="w-5 h-5" /> 接到路招 (暫離)
            </button>
            
            <button onClick={() => { setDriverStatus('offline'); setGpsStatus('idle'); }} className="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-xl text-lg flex items-center justify-center gap-2 mt-auto">
              <LogOut className="w-5 h-5" /> 下班 / 離線
            </button>
          </div>
        )}

        {driverStatus === 'serving' && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="bg-blue-100 p-6 rounded-full border-4 border-blue-500">
              <Car className="w-12 h-12 text-blue-700" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">載客中...</p>
              <p className="text-gray-500 mt-2">已暫時移出排班區</p>
            </div>
            <button onClick={() => { setDriverStatus('offline'); setGpsStatus('idle'); }} className="w-full bg-gray-800 text-white font-bold py-4 rounded-xl text-xl shadow-lg flex items-center justify-center gap-2 mt-auto">
              <CheckCircle className="w-6 h-6" /> 結束行程 (空車)
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const SuccessView = () => (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center p-8 text-center w-full">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <PhoneCall className="w-12 h-12 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">已通知第一順位司機！</h2>
      
      <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-xl mb-8 text-left w-full">
        <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> 重要提醒
        </h3>
        <p className="text-yellow-900 text-sm leading-relaxed">
          司機已收到您的需求。<br/>
          <span className="text-red-600 font-bold block mt-1 text-base">請留意來電！司機確認位置後才會出發。</span>
        </p>
      </div>

      <p className="text-gray-500 mb-8 text-sm">
        地點：{selectedSpot?.name}<br/>
        電話：{phoneNumber}
      </p>
      <button 
        onClick={() => { setGpsStatus('idle'); setCurrentView('lobby'); }} 
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl"
      >
        返回大廳
      </button>
    </div>
  );

  // --- View Routing ---
  if (currentView === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4"></div>
        <p className="text-gray-500 font-medium">系統連線中...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative">
        <div className="bg-yellow-400 h-1.5 w-full sticky top-0 z-50"></div>
        {currentView === 'lobby' && <LobbyView />}
        {currentView === 'passenger' && <PassengerForm />}
        {currentView === 'driver' && <DriverDashboard />}
        {currentView === 'success_passenger' && <SuccessView />}
      </div>
    </div>
  );
}
