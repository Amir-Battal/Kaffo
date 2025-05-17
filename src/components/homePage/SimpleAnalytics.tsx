import AnalyticsCard from "./AnalyticsCard";

const SimpleAnalytics = () => {
  return (
    <div id="simple-analytics" className="relative pt-40">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-bold mb-4">إحصائيات حول المنصة</h1>
        <p className="text-zinc-400 text-center">بيانات توضح إنجازات المنصة</p>
      </div>
      <div className="flex justify-center gap-6 flex-wrap">
        <AnalyticsCard number="100+" description="الشكاوي التي يتم حلها يومياً" />
        <AnalyticsCard number="200+" description="الأشخاص المتطوعين أسبوعياً" />
        <AnalyticsCard number="200+" description="الشكاوي التي تم تقديمها من قبل المستخدمين" />
      </div>
    </div>
  );
};

export default SimpleAnalytics;
