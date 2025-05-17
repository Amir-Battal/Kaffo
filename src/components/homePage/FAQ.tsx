import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQ = () => {

  return (
    <div id="faq" dir="rtl" className="w-full px-40 pt-40 flex flex-col gap-5">
      <h1 className="text-4xl font-bold mb-4 text-center">بعض الأسئلة الشائعة</h1>
      <div>
        <Accordion type="single" collapsible className="w-full flex flex-col gap-5 px-40">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-[20px] cursor-pointer">كيف أقوم بإنشاء حساب؟</AccordionTrigger>
          <AccordionContent className="text-[15px]">
            عند تحميل التطبيق يوجد زر إنشاء حساب جديد، تقوم بإدخال البريد الإلكتروني والاسم الكامل والضغط علي موافق وتأكيد الحساب من خلال البريد الإلكتروني حيث سوف يصل رمز ويجب إدخاله في الحقول على الشاشة
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-[20px] cursor-pointer">هل استطيع رفع شكوى بدون إكمال الحساب؟</AccordionTrigger>
          <AccordionContent className="text-[15px]">
            لا، يجب إكمال بيانات الحساب ومن ثم تستطيع رفع الشكوى
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-[20px] cursor-pointer">هل يوجد رسوم لاستخدام التطبيق؟</AccordionTrigger>
          <AccordionContent className="text-[15px]">
            التطبيق مجاني 100%
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-[20px] cursor-pointer">متى يتم الاستجابة للشكوى الخاصة بي؟</AccordionTrigger>
          <AccordionContent className="text-[15px]">
            الشكوى تصل للجهة المعنية بشكل فوري وهي تقوم بالرد في حال إتمام دراسة الشكوى
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger className="text-[20px] cursor-pointer">هل أي شخص يستطيع التطوع للمساهمة في حل الشكاوي؟</AccordionTrigger>
          <AccordionContent className="text-[15px]">
            نعم، أي شخص حسابه الشخصي كامل يستطيع تقديم المساهمة التي يستطيع العمل عليها لحل المشكلات، في المشكلات التي قامت الجهة المعنية بتفويضها لقسم التطوع
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger className="text-[20px] cursor-pointer">كيف اتأكد من ان التبرعات يتم استخدامها بشكل صحيح؟</AccordionTrigger>
          <AccordionContent className="text-[15px]">
            عند تقديم التبرع لحل مشكلة معنية فإن القائمين على حل المشكةل سوف يقومون برفع المراحل واحدة تلو الآخرى مرفقة بالصور وشرح المصروفعات وكيفية العمل على حل المشكلة
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
