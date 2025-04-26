import { MainChart } from "@/components/MainChart";
import { StatisticsChart } from "@/components/StatisticsChart";
import { Link } from "react-router-dom";


// TODO: change path to myActivities
const StatisticsData = [
  {
    title: 'issues',
    ar_title: 'الشكاوي',
    label: 'الشكاوي المقدمة من قبلك',
    number: 25,
    color: 'red',
    fill: 'bg-red-600',
    path: '/problems'
  },
  {
    title: 'volunteering',
    ar_title: 'الأنشطة التطوعية',
    label: 'الأنشطة التطوعية التي قمت بها',
    number: 25,
    color: 'blue',
    fill: 'bg-blue-600',
    path: '/volunteering'
  },
  {
    title: 'contributions',
    ar_title: 'المساهمات',
    label: 'المساهمات التي قمت بها',
    number: 25,
    color: 'green',
    fill: 'bg-green-600',
    path: '/volunteering/contributions'
  },
  {
    title: 'donations',
    ar_title: 'التبرعات',
    label: 'التبرعات التي قمت بها',
    number: 25,
    color: 'purple',
    fill: 'bg-purple-600',
    path: '/volunteering/donations'
  },
]


const StatisticsPage = () => {
  return (
    <div className="px-10 flex flex-col gap-10">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl">إحصائيات الأنشطة الخاصة بك</h1>
          <h3>هنا تستطيع أن تجد كل الإحصائيات الخاصة  بالمشاركات التي قمت بها</h3>
        </div>
        <h3 className="pl-40">إحصائيات عام 2025</h3>
      </div>

      {StatisticsData.map((item) => (
        <div className="flex flex-row gap-5 justify-between">
          <div className="flex flex-row gap-5">
            <Link to={`${item.path}`} className="w-[200px] h-[200px] flex flex-col text-xl justify-center items-center cursor-pointer text-white bg-black p-2  rounded-[10px] hover:bg-gray-800">
              <h3>{item.ar_title}</h3>
              <h3>+{item.number}</h3>
            </Link>
            <h3>{item.label} خلال السنة</h3>
          </div>
          <div className="w-[50%]">
            <StatisticsChart
              title={item.title}
              ar_title={item.ar_title}
              label={item.label}
              number={item.number}
              color={item.color}
              fill={item.fill}
            />
          </div>
        </div>
      ))}
      <div className="flex flex-row justify-between">
        <h1 className="text-xl">نسبة توزيعات الأنشطة التي قمت بها خلال شهر</h1>
        <MainChart />
      </div>
      <div className="flex flex-col gap-5">
        <h1 className="text-xl">مجمل الأنشطة التي قمت بها بكل الفترات</h1>
        <StatisticsChart data={StatisticsData} isTotal />
      </div>
    </div>
  );
};

export default StatisticsPage;