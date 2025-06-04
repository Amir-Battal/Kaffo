// import { useState } from "react";
import DonationCard from "@/forms/contribution-form/DonationCard";
// import PaginationComp from "@/components/PaginationComp";
// import { useGetMyUser } from "@/hooks/use-user";
import { useGetMyDonations } from "@/hooks/use-donation";
import { useGetMyUser } from "@/hooks/use-user";

const MyDonationsPage = () => {
  const { data: donations = [], isLoading } = useGetMyDonations();
  const {currentUser} = useGetMyUser();

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
            problemId={item.problemId}
            username={currentUser?.firstName +" " + currentUser?.lastName}
            time=""
            date={new Date(item.donationDate).toLocaleDateString()}
            budget={item.amount}
            status={item.status}
            currency={item.currency}
          />
        ))
      )}
    </div>
  </div>
);

};

export default MyDonationsPage;
