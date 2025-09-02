// import PaginationComp from "@/components/PaginationComp";
import ContributionCard from "@/forms/contribution-form/ContributionCard";
import { useGetMyContributions } from "@/hooks/use-Contribution";
import { useGetMyUser } from "@/hooks/use-user";

const MyContributionsPage = () => {

    const { data: contribution = [], isLoading } = useGetMyContributions();
    const currentUser = useGetMyUser();

    console.log(contribution)
    // const [isMyContribution, setIsMyContribution] = useState<boolean>(true);

    return(
        <div className="flex flex-col gap-10 px-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-xl">جميع المساهمات التي قمت بها</h1>
                <h3>هي المساهمات والتبرعات الخاصة بك المقبولة من الجهة المعنية</h3>
            </div>
            <div className="flex flex-col gap-5">
                {isLoading ? (
                    <p>جاري التحميل...</p>
                ) : contribution.length === 0 ? (
                    <p>لم تقم بأي مساهمات بعد.</p>
                ):(contribution.map((item) => (
                    <ContributionCard  
                        date={item.creationDate}
                        description={item.description}
                        problemId={item.problemId}
                        contribution={item.description}
                        budget={item.estimatedCost}
                        status={item.status}
                        isMyContribution
                        userPhoto={currentUser.currentUser?.photoUrl}
                        username={currentUser.currentUser?.firstName + " " + currentUser.currentUser?.lastName}
                    />
                    ))
                )}
            </div>
        </div>
    )
}

export default MyContributionsPage;