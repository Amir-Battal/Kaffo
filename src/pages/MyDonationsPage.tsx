import PaginationComp from "@/components/PaginationComp";
import DonationCard from "@/forms/contribution-form/DonationCard";

const donation = [
    {
        username: 'أمير بطال',
        time: 'منذ 9 ساعات',
        date: '23/3/2025',
        budget: "",
    },{
        username: 'عبد الهادي العاصي',
        time: 'منذ 9 ساعات',
        date: '23/3/2025',
        budget: 40,
    },{
        username: 'أمير بطال',
        time: 'منذ 9 ساعات',
        date: '23/3/2025',
        budget: 40,
    },{
        username: 'حسام علوان',
        time: 'منذ 9 ساعات',
        date: '23/3/2025',
        budget: 40,
    },{
        username: 'جورجيوس',
        time: 'منذ 9 ساعات',
        date: '23/3/2025',
        budget: 40,
    },{
        username: 'أمير بطال',
        time: 'منذ 9 ساعات',
        date: '23/3/2025',
        budget: 40,
    },
]

const MyDonationsPage = () => {
    return(
        <div className="flex flex-col gap-10 px-10">
            <h1 className="text-xl">جميع التبرعات التي قمت بها</h1>
            <div className="flex flex-col gap-5">
                {donation.map((item) => (
                    <DonationCard
                        username={item.username}
                        time={item.time}
                        date={item.date}
                        budget={item.budget}
                    />
                ))}
            </div>
            <PaginationComp />
        </div>
    )
}

export default MyDonationsPage;
