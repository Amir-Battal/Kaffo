import DownloadButton from "./DownlaodButton";
import Navbar from "./Navbar";
import NotificationCard from "./NotificationCard";
import Pattern from "./Pattern";
import Phone from "./Phone";



const Hero = () => {

  return (
    <div className="w-full h-100% overflow-hidden shadow-[inset_0_-180px_35px_rgba(0,0,0,0.3)]">
      <Pattern />
      <div className="flex justify-center relative">
        <Navbar />
      </div>
      
      <div className="flex flex-col items-center gap-10 mt-[15%]">
        <h1 className="text-6xl leading-24 w-[50%] text-center font-bold">
          منصة تنظيم وإدارة الشكاوي للوزارات السورية
        </h1>
        <h3 className="text-2xl text-zinc-400">
          قم بتقديم الشكوى الخاصة بك بكل أمان وسهولة
        </h3>

        <DownloadButton />

        <div className="w-full h-[30vh] flex flex-row justify-center gap-40 mt-10">
          <div className="rotate-335 mt-15">
            <Phone content="Notifications"/>
          </div>
          <div className="mt-10 mr-150 absolute z-0">
            <NotificationCard reject />
          </div>
          <div className="mt-25 ml-30 absolute z-0">
            <NotificationCard pending />
          </div>
          <Phone content="Problems" size />
          <div className="mt-40 mr-120 absolute z-0">
            <NotificationCard />
          </div>
          <div className="rotate-25 mt-15">
            <Phone content="Profile" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
