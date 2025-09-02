import Phone from "./Phone";

const DownloadApp = () => {
  return (
    <div id="download-app" className="flex justify-center items-center pt-40 ">
      <section className="relative w-[60%] pt-20 overflow-hidden text-center bg-white">
        {/* خلفية نقطية */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0)',
            backgroundSize: '10px 10px',
          }}
        />

        <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-white to-transparent z-0" />

        <div className="absolute top-0 left-0 w-full h-[120px] bg-gradient-to-b from-white to-transparent z-0" />

        <div className="relative z-0 flex flex-col items-center gap-5">
          <div className="flex justify-center items-end scale-90 md:scale-100">
            <div className="rotate-[-15deg] opacity-80">
              <Phone content="الإشعارات" />
            </div>
            <div className="scale-110 z-1">
              <Phone content="واجهة المستخدم" />
            </div>
            <div className="rotate-[15deg] opacity-80">
              <Phone content="الملف الشخصي" />
            </div>
          </div>

          <div className="relative z-0 mt-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">حمّل التطبيق الآن وارفع الشكوى الخاصة بك</h2>
            <p className="text-zinc-500">انضم إلينا الآن وابدأ في تقديم الشكاوي بسهولة وسرعة عبر التطبيق</p>
          </div>

          <div className="flex gap-4 mt-4 flex-wrap justify-center relative z-0">
            <a
              href="https://play.google.com/store"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl shadow hover:opacity-90 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-white" viewBox="0 0 512 512">
                <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
              </svg>
              <span>Google Play</span>
            </a>
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl shadow hover:opacity-90 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-white" viewBox="0 0 512 512">
                <path d="M255.9 120.9l9.1-15.7c5.6-9.8 18.1-13.1 27.9-7.5 9.8 5.6 13.1 18.1 7.5 27.9l-87.5 151.5h63.3c20.5 0 32 24.1 23.1 40.8H113.8c-11.3 0-20.4-9.1-20.4-20.4 0-11.3 9.1-20.4 20.4-20.4h52l66.6-115.4-20.8-36.1c-5.6-9.8-2.3-22.2 7.5-27.9 9.8-5.6 22.2-2.3 27.9 7.5l8.9 15.7zm-78.7 218l-19.6 34c-5.6 9.8-18.1 13.1-27.9 7.5-9.8-5.6-13.1-18.1-7.5-27.9l14.6-25.2c16.4-5.1 29.8-1.2 40.4 11.6zm168.9-61.7h53.1c11.3 0 20.4 9.1 20.4 20.4 0 11.3-9.1 20.4-20.4 20.4h-29.5l19.9 34.5c5.6 9.8 2.3 22.2-7.5 27.9-9.8 5.6-22.2 2.3-27.9-7.5-33.5-58.1-58.7-101.6-75.4-130.6-17.1-29.5-4.9-59.1 7.2-69.1 13.4 23 33.4 57.7 60.1 104zM256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm216 248c0 118.7-96.1 216-216 216-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216z"/>
              </svg>
              <span>App Store</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DownloadApp;
