import React from "react";
import Phone from "./Phone";
import PhoneCard from "./PhoneCard";

const HowToUse = () => {
  return (
    <div id="how-to-use" className="w-full pt-40 px-[10%] text-center flex flex-col items-center gap-10">
      <div>
        <h1 className="text-4xl font-bold mb-4">كيفية تقديم الشكوى عبر المنصة؟</h1>
        <p className="text-zinc-400">فيما يلي خطوات تقديم الشكوى</p>
      </div>


      <div className="w-full flex flex-row gap-5 justify-between">
        <PhoneCard title="انتظر الرد" content="رد الجهة المعنية"/>
        <PhoneCard title="أرفع الشكوى" content="الشكوى" />
        <PhoneCard title="قم بتسجيل الدخول" content="الحساب الشخصي" />
      </div>
    </div>
  );
};

export default HowToUse;
