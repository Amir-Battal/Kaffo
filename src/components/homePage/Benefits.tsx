import { Archive, DollarSign, FastForward, Funnel, Globe, MessageSquareText, MonitorSmartphone, Send, Star, User, Users } from "lucide-react";
import search from "../../assets/search.png";
import filter from "../../assets/filter.png";

const Benefits = () => {

  const benefits = [
  {
    icon: <Send />,
    title: "تقديم شكوى فوري",
    description: "تستطيع تقديم الشكوى بأي وقت ويتم إيصالها للجهة المعنية فوراً",
  },
  {
    icon: <FastForward />,
    title: "الرد بأسرع وقت",
    description: "بعد ورود الشكوى للجهة المعنية سوف يتابع معك فريق من قبلها لمعالجة الشكوى",
  },
  {
    icon: <Users />,
    title: "فريق متخصص للمتابعة",
    description: "يتم تعيين فريق من خبراء للمتابعة في معالجة الشكوى وحلها",
  },
  {
    icon: <MessageSquareText />,
    title: "فتح باب التطوع للمواطنين",
    description: "أي شخص يستطيع المساهمة في التطوع لمعالجة شكاوي المواطنين",
  },
  {
    icon: <DollarSign />,
    title: "فتح باب التبرعات",
    description: "تستطيع المساهمة في حل الشكاوي من خلال التبرع بقيمة الإصلاح",
  },
  {
    icon: <Archive />,
    title: "استقبال كافة أنواع الشكاوي",
    description: "هذه المنصة هدفها استقبال كافة نواع الشكاوي للنهوض في واقع البلاد",
  }
];

  return (
    <div id="benefits" dir="rtl" className="px-4 text-center pt-40">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-bold mb-4">اكتشف ميزات المنصة</h1>
        <p className="text-zinc-400 text-center">هذه المنصة حيث يتغير مفهوم تقديم الشكاوي</p>
      </div>
        <div className="inline-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-[80%] mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className=" rounded-2xl bg-[#f9fbfc] p-6 flex flex-col items-center shadow-sm border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1/2 pointer-events-none z-0"
                style={{
                  backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0)',
                  backgroundSize: '12px 12px',
                }}
              />

              <div className=" z-0 relative flex flex-col items-center">
                <div className="w-[15%] bg-black text-white p-3 rounded-full mb-4">
                  <div className="flex flex-col items-center">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>



        <div id="advanced-features" className="w-full flex flex-row gap-10 pt-40 px-[10%]">
          <div
            className="w-[50%] rounded-2xl bg-[#f9fbfc] p-6 flex flex-col items-center shadow-sm border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1/2 pointer-events-none z-0"
              style={{
                backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0)',
                backgroundSize: '12px 12px',
              }}
            />

            <div className=" z-0 relative flex flex-col items-center">
              <img className="w-[70%] ml-40 border-2" src={search} alt="search" />
              <img className="w-[65%] mr-40 absolute mt-10 border-2" src={filter} alt="filter" />
            </div>
          </div>

          <div className="w-[50%] flex flex-col gap-5 items-start">
            <h1 className="text-4xl font-bold mb-4">الميزات المتقدمة الخاصة بالمنصة</h1>
            <p className="text-zinc-400 text-center">اكتشف أهم الميزات التي تجعل المنصة مميزة وأسهل للاستخدام</p>
            <div className="w-full flex flex-row gap-5 justify-between">
              <div className="w-full flex flex-row gap-5 border-2 h-[60px] justify-center items-center p-4 rounded-lg">
                <div className="w-[20%] h-[35px] bg-black text-white flex items-center justify-center rounded-lg"><MonitorSmartphone size={20} /></div>
                <h3 className="w-full text-[14px] text-start">المنصة تعمل على الهاتف وعلى الحاسوب</h3>
              </div>
              <div className="w-full flex flex-row gap-5 border-2 h-[60px] justify-center items-center p-4 rounded-lg">
                <div className="w-[20%] h-[35px] bg-black text-white flex items-center justify-center rounded-lg"><Funnel size={20} /></div>
                <h3 className="w-full text-[14px] text-start">بحث وفلترة متقدمة عن الشكاوي</h3>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Benefits;
