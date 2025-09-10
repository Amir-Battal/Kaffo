import DownloadButton from "./DownlaodButton";
import Navbar from "./Navbar";
import Pattern from "./Pattern";
import Phones from "./Phones";



const Hero = () => {

  return (
    <div className="w-full h-100% overflow-hidden shadow-[inset_0_-180px_35px_rgba(0,0,0,0.3)] rounded-b-4xl">
      <Pattern />
      <div className="flex justify-center relative">
        <Navbar />
      </div>
      
      <div className="flex flex-col items-center gap-10 mt-[15%]">
        <h1 className="text-6xl leading-24 w-[50%] text-center font-bold">
          منصة تنظيم وإدارة الشكاوي الخدمية للوزارات السورية
        </h1>
        <h3 className="text-2xl text-zinc-400">
          قم بتقديم الشكوى الخاصة بك بكل أمان وسهولة
        </h3>

        <DownloadButton />

        <Phones />
      </div>
    </div>
  );
};

export default Hero;
