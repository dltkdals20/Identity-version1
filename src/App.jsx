import { useEffect, useState } from 'react';

const Icon = ({ children, size = 24, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
  >
    {children}
  </svg>
);

const Smartphone = (props) => (
  <Icon {...props}>
    <rect x="6" y="2" width="12" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12" y2="18" />
  </Icon>
);

const Check = (props) => (
  <Icon {...props}>
    <polyline points="20 6 9 17 4 12" />
  </Icon>
);

const AlertCircle = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </Icon>
);

const MessageSquare = (props) => (
  <Icon {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Icon>
);

const ChevronLeft = (props) => (
  <Icon {...props}>
    <polyline points="15 18 9 12 15 6" />
  </Icon>
);

const ChevronRight = (props) => (
  <Icon {...props}>
    <polyline points="9 18 15 12 9 6" />
  </Icon>
);

const RefreshCw = (props) => (
  <Icon {...props}>
    <path d="M21 2v6h-6" />
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M3 22v-6h6" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
  </Icon>
);

const X = (props) => (
  <Icon {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </Icon>
);

const User = (props) => (
  <Icon {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Icon>
);

const Copy = (props) => (
  <Icon {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </Icon>
);

export default function App() {
  const [step, setStep] = useState('carrier'); // carrier, input, verify, success

  // User Info States
  const [name, setName] = useState('');
  const [rrnFirst, setRrnFirst] = useState('');
  const [rrnSecond, setRrnSecond] = useState('');
  const [carrier, setCarrier] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Verification States
  const [verifyCode, setVerifyCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Carriers list
  const carriers = [
    { id: 'skt', name: 'SKT' },
    { id: 'kt', name: 'KT' },
    { id: 'lgu', name: 'LG U+' },
    { id: 'budget', name: '알뜰폰' },
  ];

  const sendMockSMS = () => {
    setIsLoading(true);
    setError('');
    setCopyFeedback(false);

    setTimeout(() => {
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      setVerifyCode(randomCode);
      setIsLoading(false);
      setStep('verify');
      setTimeLeft(180);
      setInputCode('');

      setTimeout(() => {
        setNotification({
          title: '문자 메시지',
          code: randomCode,
        });
      }, 1500);
    }, 1000);
  };

  const handleCopyCode = (code) => {
    const textArea = document.createElement('textarea');
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  const handleVerify = () => {
    if (inputCode === verifyCode) {
      setStep('success');
    } else {
      setError('인증번호가 일치하지 않습니다.');
    }
  };

  const handleCarrierSelect = (carrierId) => {
    setCarrier(carrierId);
    setStep('input');
  };

  const handleBack = () => {
    if (step === 'input') setStep('carrier');
    else if (step === 'verify') setStep('input');
    else if (step === 'success') resetFlow();
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 11) {
      setPhoneNumber(value);
    }
  };

  const handleRrnFirstChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 6) setRrnFirst(value);
  };

  const handleRrnSecondChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 1) setRrnSecond(value);
  };

  const formatPhoneNumber = (num) => {
    if (num.length <= 3) return num;
    if (num.length <= 7) return `${num.slice(0, 3)}-${num.slice(3)}`;
    return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7)}`;
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  useEffect(() => {
    let timer;
    if (step === 'verify' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setError('인증 시간이 만료되었습니다. 다시 시도해주세요.');
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const resetFlow = () => {
    setStep('carrier');
    setPhoneNumber('');
    setCarrier('');
    setName('');
    setRrnFirst('');
    setRrnSecond('');
    setVerifyCode('');
    setInputCode('');
    setError('');
    setNotification(null);
    setCopyFeedback(false);
  };

  const isFormValid =
    name.length > 0 &&
    rrnFirst.length === 6 &&
    rrnSecond.length === 1 &&
    phoneNumber.length >= 10;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
      <div className="w-full max-w-md bg-white h-[100vh] sm:h-auto sm:min-h-[600px] sm:rounded-3xl shadow-2xl overflow-hidden relative flex flex-col">
        {notification && (
          <div className="absolute top-4 left-4 right-4 bg-gray-900/95 backdrop-blur-sm text-white p-4 rounded-2xl shadow-xl z-50 transform transition-all duration-500 animate-slide-down flex items-start gap-3 border border-gray-700">
            <div className="bg-green-500 p-2 rounded-full mt-1 shrink-0">
              <MessageSquare size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-gray-300">메시지 • 방금 전</span>
                <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-white p-1">
                  <X size={14} />
                </button>
              </div>
              <div className="text-sm font-medium leading-relaxed">
                <span>[Web발신] 인증번호 </span>
                <button
                  onClick={() => handleCopyCode(notification.code)}
                  className="inline-flex items-center gap-1 mx-1 font-bold text-yellow-300 hover:text-yellow-100 hover:bg-white/10 px-1.5 py-0.5 rounded transition-all relative group border border-dashed border-yellow-300/50"
                  title="클릭하여 복사"
                >
                  <span>[{notification.code}]</span>
                  <Copy size={12} />
                  {copyFeedback && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold py-1.5 px-3 rounded shadow-lg whitespace-nowrap animate-fade-in flex items-center gap-1">
                      <Check size={12} className="text-green-600" />
                      복사됨!
                      <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
                    </div>
                  )}
                </button>
                <span>를 입력해주세요.</span>
              </div>
            </div>
          </div>
        )}

        <header className="px-6 py-4 flex items-center border-b border-gray-100 bg-white z-10 sticky top-0">
          {step !== 'carrier' && step !== 'success' && (
            <button onClick={handleBack} className="mr-4 text-gray-600 hover:bg-gray-100 p-1 rounded-full">
              <ChevronLeft size={24} />
            </button>
          )}
          <h1 className="text-lg font-bold text-gray-800">{step === 'success' ? '인증 완료' : '휴대폰 본인인증'}</h1>
        </header>

        <main className="flex-1 p-6 flex flex-col overflow-y-auto">
          {step === 'carrier' && (
            <div className="space-y-6 animate-fade-in flex flex-col h-full">
              <div className="py-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">이용중인<br />통신사를 선택해주세요</h2>
                <p className="text-gray-500 text-sm">본인 명의의 휴대폰만 인증 가능합니다.</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {carriers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleCarrierSelect(c.id)}
                    className="w-full p-5 rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-md hover:bg-blue-50 transition-all flex items-center justify-between group bg-white"
                  >
                    <span className="font-bold text-lg text-gray-800 group-hover:text-blue-700">{c.name}</span>
                    <ChevronRight className="text-gray-300 group-hover:text-blue-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'input' && (
            <div className="space-y-6 animate-fade-in pb-4">
              <div className="py-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                    {carriers.find((c) => c.id === carrier)?.name}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">본인 정보를 입력해주세요</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">이름</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="이름 입력"
                      className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">주민등록번호</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        value={rrnFirst}
                        onChange={handleRrnFirstChange}
                        placeholder="앞 6자리"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center tracking-widest transition-all"
                        maxLength={6}
                      />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="flex-[0.8] flex items-center gap-1">
                      <input
                        type="tel"
                        value={rrnSecond}
                        onChange={handleRrnSecondChange}
                        className="w-12 px-2 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center font-bold text-lg transition-all"
                        maxLength={1}
                        placeholder="●"
                      />
                      <div className="flex gap-1">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">휴대폰 번호</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={formatPhoneNumber(phoneNumber)}
                      onChange={handlePhoneChange}
                      placeholder="010-0000-0000"
                      className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg tracking-wide transition-all"
                      maxLength={13}
                    />
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>
              </div>

              <button
                onClick={sendMockSMS}
                disabled={!isFormValid || isLoading}
                className={`w-full py-4 mt-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all transform active:scale-[0.98] ${
                  !isFormValid || isLoading
                    ? 'bg-gray-300 cursor-not-allowed shadow-none'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="animate-spin" size={20} /> 전송 중...
                  </span>
                ) : (
                  '인증번호 받기'
                )}
              </button>
            </div>
          )}

          {step === 'verify' && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center py-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">인증번호 입력</h2>
                <p className="text-gray-500">
                  <span className="font-bold text-gray-800">{formatPhoneNumber(phoneNumber)}</span>으로<br />
                  인증번호 6자리를 발송했습니다.
                </p>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="tel"
                    value={inputCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (val.length <= 6) setInputCode(val);
                      if (error) setError('');
                    }}
                    placeholder="000000"
                    className={`w-full px-4 py-4 text-center text-3xl tracking-[0.5em] rounded-xl border focus:ring-2 outline-none transition-all ${
                      error ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                    maxLength={6}
                    autoFocus
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-mono font-medium text-red-500 bg-white/80 px-2 py-1 rounded">
                    {formatTime(timeLeft)}
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-sm px-1 animate-shake">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="text-center">
                  <button onClick={sendMockSMS} className="text-sm text-gray-500 underline decoration-gray-300 hover:text-gray-800 mt-2">
                    인증번호 재전송
                  </button>
                </div>
              </div>

              <button
                onClick={handleVerify}
                disabled={inputCode.length !== 6}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all transform active:scale-[0.98] ${
                  inputCode.length !== 6 ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'
                }`}
              >
                인증 확인
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-scale-up">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Check className="text-green-600 w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">본인인증 성공!</h2>
              <p className="text-gray-500 mb-8">
                <strong>{name}</strong>님의 본인 확인이<br />
                성공적으로 완료되었습니다.
              </p>

              <div className="w-full bg-gray-50 rounded-xl p-4 mb-8 text-left border border-gray-100 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-500">이름</span>
                  <span className="font-medium text-gray-900">{name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-500">생년월일</span>
                  <span className="font-medium text-gray-900">{rrnFirst}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-500">통신사</span>
                  <span className="font-medium text-gray-900">{carriers.find((c) => c.id === carrier)?.name}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">전화번호</span>
                  <span className="font-medium text-gray-900">{formatPhoneNumber(phoneNumber)}</span>
                </div>
              </div>

              <button
                onClick={resetFlow}
                className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold text-lg hover:bg-black transition-all shadow-lg hover:shadow-gray-400"
              >
                처음으로 돌아가기
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
