import FooterButton from "./FooterButton";

const Footer = () => {

  return (
    <div className="w-full mt-20 flex flex-col justify-center items-center">
      <div dir="rtl" className="w-full flex flex-row justify-center items-center">
        <FooterButton title="حول المنصة" link="#about"/>
        <FooterButton title="الإحصائيات" link="#simple-analytics"/>
        <FooterButton title="الميزات" link="#benefits" />
        <FooterButton title="ميزات متقدمة" link="#advanced-features" />
        <FooterButton title="كيفية الاستخدام" link="#how-to-use" />
        <FooterButton title="أسئلة شائعة" link="#faq" />
      </div>
      <div dir="rtl">
        <p className="text-center text-zinc-400">جميع الحقوق محفوظة &copy; 2025 Kafu</p>
      </div>
    </div>
  );
};

export default Footer;
