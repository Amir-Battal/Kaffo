import { useState } from "react";
import DonationCard from "@/forms/contribution-form/DonationCard";
import PaginationComp from "@/components/PaginationComp";
import { useGetMyDonations } from "@/hooks/use-donation";
import { useGetMyUser } from "@/hooks/use-user";

const MyDonationsPage = () => {
  const [page, setPage] = useState(0);

  const { currentUser } = useGetMyUser();

//   const donorId = currentUser?.id;

  const { donations, totalPages, isLoading } = useGetMyDonations({
    donorId: Number(currentUser?.id),
    page,
    size: 6,
  });
  

  return (
    <div className="flex flex-col gap-10 px-10">
      <h1 className="text-xl">جميع التبرعات التي قمت بها</h1>

      <div className="flex flex-col gap-5">
        {isLoading ? (
          <p>جاري التحميل...</p>
        ) : donations.length === 0 ? (
          <p>لم تقم بأي تبرعات بعد.</p>
        ) : (
          donations.map((item) => (
            <DonationCard
              key={item.id}
              username="أنا"
              time=""
              date={new Date(item.donationDate).toLocaleDateString()}
              budget={item.amount}
              status={item.status}
              currency={item.currency}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <PaginationComp page={page} setPage={setPage} totalPages={totalPages} />
      )}
    </div>
  );
};

export default MyDonationsPage;
