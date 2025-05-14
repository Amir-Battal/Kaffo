import PaginationComp from "@/components/PaginationComp";
import ContributionCard from "@/forms/contribution-form/ContributionCard";

const contribution = [
    {
        username: 'أمير بطال',
        date: '23/3/2025',
        problem_type: 'رصيف مكسور',
        contribution: "استطيع حل المشكلة من خلال عدة نقاط أهمها النقطة الأولى من خلال شراء المواد الأولية",
        budget: 120,
        status: 'التعديل مسموح',
    },{
        username: 'أمير بطال',
        date: '23/3/2025',
        problem_type: 'رصيف مكسور',
        contribution: "استطيع حل المشكلة من خلال عدة نقاط أهمها النقطة الأولى من خلال شراء المواد الأولية",
        budget: 120,
        status: 'جاري المعالجة',
    },{
        username: 'أمير بطال',
        date: '23/3/2025',
        problem_type: 'كبل مقطوع',
        contribution: "",
        budget: 120,
        status: 'تم القبول',
    },{
        username: 'أمير بطال',
        date: '23/3/2025',
        problem_type: 'رصيف مكسور',
        contribution: "استطيع حل المشكلة من خلال عدة نقاط أهمها النقطة الأولى من خلال شراء المواد الأولية",
        budget: 120,
        status: 'تم الرفض',
    },
]

const MyContributionsPage = () => {

    // const [isMyContribution, setIsMyContribution] = useState<boolean>(true);

    return(
        <div className="flex flex-col gap-10 px-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-xl">جميع المساهمات التي قمت بها</h1>
                <h3>هي المساهمات والتبرعات الخاصة بك المقبولة من الجهة المعنية</h3>
            </div>
            <div className="flex flex-col gap-5">
                {contribution.map((item) => (
                    <ContributionCard
                        username={item.username}
                        date={item.date}
                        contribution={item.contribution}
                        budget={item.budget}
                        status={item.status}
                        problem_type={item.problem_type}
                        isMyContribution
                    />
                ))}
            </div>
            <PaginationComp />
        </div>
    )
}

export default MyContributionsPage;