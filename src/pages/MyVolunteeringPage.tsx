import PaginationComp from "@/components/PaginationComp";
import VolunteeringCard from "@/forms/contribution-form/VolunteeringCard";

const volunteer = [
    {
        username: 'أمير بطال',
        date: '23/3/2025',
        problem_type: 'رصيف مكسور',
        time: 'منذ 9 ساعات',
        budget: "120",
        status: 'التعديل مسموح',
    },
    {
        username: 'أمير بطال',
        date: '23/3/2025',
        problem_type: 'رصيف مكسور',
        time: 'منذ 9 ساعات',
        budget: "120",
        status: 'جاري المعالجة',
    },
    {
        username: 'أمير بطال',
        date: '23/3/2025',
        problem_type: 'رصيف مكسور',
        time: 'منذ 9 ساعات',
        budget: "120",
        status: 'تم القبول',
    },
    {
        username: 'أمير بطال',
        date: '23/3/2025',
        problem_type: 'رصيف مكسور',
        time: 'منذ 9 ساعات',
        budget: "120",
        status: 'تم الرفض',
    },
]

const MyVolunteeringPage = () => {
    return(
        <div className="flex flex-col gap-10 px-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-xl">الأنشطة التطوعية الخاصة بي</h1>
                <h3>هي المساهمات والتبرعات الخاصة بك المقبولة من الجهة المعنية</h3>
            </div>
            <div className="flex flex-col gap-8">
                {volunteer.map((item) => (
                    <VolunteeringCard
                        username={item.username}
                        date={item.date}
                        problem_type={item.problem_type}
                        time={item.time}
                        budget={item.budget}
                    />
                ))}
            </div>
            <PaginationComp />
        </div>
    )
}

export default MyVolunteeringPage;
