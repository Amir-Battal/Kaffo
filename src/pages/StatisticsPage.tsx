import { MainChart } from "@/components/MainChart";
import { StatisticsChart } from "@/components/StatisticsChart";
import keycloak from "@/lib/keycloak";
import { JSX, useState } from "react";
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
    path: '/problems',
    activityNum: 10
  },
  {
    title: 'volunteering',
    ar_title: 'الأنشطة التطوعية',
    label: 'الأنشطة التطوعية التي قمت بها',
    number: 25,
    color: 'blue',
    fill: 'bg-blue-600',
    path: '/volunteering',
    activityNum: 10
  },
  {
    title: 'contributions',
    ar_title: 'المساهمات',
    label: 'المساهمات التي قمت بها',
    number: 25,
    color: 'green',
    fill: 'bg-green-600',
    path: '/volunteering/contributions',
    activityNum: 5
  },
  {
    title: 'donations',
    ar_title: 'التبرعات',
    label: 'التبرعات التي قمت بها',
    number: 25,
    color: 'purple',
    fill: 'bg-purple-600',
    path: '/volunteering/donations',
    activityNum: 5
  },
]

const GovStatisticsData = [
  {
    title: 'receivedIssues',
    ar_title: 'الشكاوي الواصلة',
    label: 'الشكاوي الواصلة',
    number: 25,
    color: 'red',
    fill: 'bg-red-600',
    path: '/problems',
    activityNum: 10
  },
  {
    title: 'doneIssues',
    ar_title: 'الشكاوي المنجزة',
    label: 'الشكاوي المنجزة',
    number: 25,
    color: 'blue',
    fill: 'bg-blue-600',
    path: '/problems/completed',
    activityNum: 5
  },
  {
    title: 'auctions',
    ar_title: 'المناقصات المنجزة',
    label: 'المناقصات المنجزة',
    number: 25,
    color: 'green',
    fill: 'bg-green-600',
    path: '/problems/auctions',
    activityNum: 5
  },
]

const AdminStatisticsData = [
  {
    title: 'receivedIssues',
    ar_title: 'الشكاوي الواصلة',
    label: 'كل الشكاوي الواصلة إلى المنصة',
    number: 25,
    color: 'red',
    fill: 'bg-red-600',
    path: '/manage/problems',
    activityNum: 10,
  },
  {
    title: 'users',
    ar_title: 'المستخدمين',
    label: 'المستخدمين الجدد',
    number: 25,
    color: 'blue',
    fill: 'bg-blue-600',
    path: '/manage/users',
    activityNum: 15,
  },
  {
    title: 'concernedGovs',
    ar_title: 'الجهات المعنية',
    label: 'نشاطات الجهات المعنية',
    number: 25,
    color: 'green',
    fill: 'bg-green-600',
    path: '/manage/govs',
    activityNum: 5
  },
  {
    title: 'doneIssues',
    ar_title: 'الشكاوي المنجزة',
    label: 'الشكاوي المنجزة',
    number: 25,
    color: 'purple',
    fill: 'bg-purple-600',
    path: '/problems/completed',
    activityNum: 10
  },
]


const StatisticsPage = ({...props}): JSX.Element => {

  const roles = keycloak.tokenParsed?.resource_access?.["react-client"].roles || []


  const [isGov, setIsGov] = useState<Boolean>(false);
  const [isAdmin, setIsAdmin] = useState<Boolean>(false);

  return (
    <div>
      {isAdmin
        ?(
          <div className="px-10 flex flex-col gap-10">
            <div className="flex flex-row justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-xl">إحصائيات الأنشطة الخاصة بالمنصة</h1>
                <h3>هنا تستطيع أن تجد كل الإحصائيات الخاصة  الخاصة بالمنصة</h3>
              </div>
              <h3 className="pl-40">إحصائيات عام 2025</h3>
            </div>

            {AdminStatisticsData.map((item) => (
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
                    isAdmin
                  />
                </div>
              </div>
            ))}
            <div className="flex flex-row justify-between">
              <h1 className="text-xl">نسبة توزيعات الأنشطة التي تمت بالمنصة خلال السنة</h1>
              <MainChart data={AdminStatisticsData} isAdmin />
            </div>
            <div className="flex flex-col gap-5">
              <h1 className="text-xl">مجمل الأنشطة التي تمت في المنصة بكل الفترات</h1>
              <StatisticsChart data={AdminStatisticsData} isAdmin isTotal />
            </div>
          </div>
        ):roles.includes("ROLE_GOV")
        ?(
          <div className="px-10 flex flex-col gap-10">
            <div className="flex flex-row justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-xl">إحصائيات الأنشطة</h1>
                <h3>هنا تستطيع أن تجد كل الإحصائيات الخاصة  بالجهة المعنية</h3>
              </div>
              <h3 className="pl-40">إحصائيات عام 2025</h3>
            </div>

            {GovStatisticsData.map((item) => (
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
                    isGov
                  />
                </div>
              </div>
            ))}
            <div className="flex flex-row justify-between">
              <h1 className="text-xl">نسبة توزيعات الأنشطة التي تم القيام بها خلال الفترة الماضية</h1>
              <MainChart data={GovStatisticsData} isGov />
            </div>
            <div className="flex flex-col gap-5">
              <h1 className="text-xl">مجمل الأنشطة التي تمت بكل الفترات</h1>
              <StatisticsChart data={GovStatisticsData} isGov isTotal />
            </div>
          </div>
        ):(
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
              <MainChart data={StatisticsData} />
            </div>
            <div className="flex flex-col gap-5">
              <h1 className="text-xl">مجمل الأنشطة التي قمت بها بكل الفترات</h1>
              <StatisticsChart data={StatisticsData} isTotal />
            </div>
          </div>
        )
      }
    </div>
  );
};

export default StatisticsPage;