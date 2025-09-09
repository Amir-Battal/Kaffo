import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PaginationComp from "@/components/PaginationComp";
import ProblemCard from "@/components/ProblemCard";
import {
  useGetAllGovRelatedProblems,
  useGetAllProblems,
  useGetRealProblems,
  useGetResolvedGovProblems,
} from "@/hooks/use-problem";
import ProblemHeader from "@/components/ProblemHeader";
import { toast } from "sonner";
import { Ban } from "lucide-react";
import keycloak from "@/lib/keycloak";
import { useGetMyUser } from "@/hooks/use-user";
import { useMinistryById } from "@/hooks/use-gov";

const ProblemsPage = () => {
  const [page, setPage] = useState(0);
  const [criteria, setCriteria] = useState({});
  const location = useLocation(); // ⬅️ لجلب المسار الحالي


  const { currentUser, isLoading: isUserLoading } = useGetMyUser();
  const { data: gov, isLoading: isGovLoading } = useMinistryById(currentUser?.govId);

  const roles =
    keycloak.tokenParsed?.resource_access?.["react-client"]?.roles || [];

  const isGov = roles.includes("ROLE_GOV");
  const govId = gov?.parentGovId;

  const isCompletedView = location.pathname === "/problems/completed"; // ✅ الشرط


  // تحديد الـ hook المناسب بناءً على المسار والدور
  const {
    problems,
    totalPages,
    isLoading,
  } = isGov && govId
    ? isCompletedView
      ? useGetResolvedGovProblems(
          { page, size: 6, sort: "submissionDate,desc" },
          criteria,
          govId
        )
      : useGetAllGovRelatedProblems(
          { page, size: 6, sort: "submissionDate,desc" },
          criteria,
          govId
        )
    : useGetRealProblems(
        { page, size: 6, sort: "submissionDate,desc" },
        isCompletedView ? { ...criteria, status: "RESOLVED" } : criteria
      );

      console.log("problems", problems);
      

  useEffect(() => {
    setPage(0); // إعادة التصفير عند تغيير الفلاتر
  }, [criteria]);

  console.log("problems", problems);


  useEffect(() => {
    const toastMessage = sessionStorage.getItem("showToastProblemDelete");
    if (toastMessage) {
      toast(toastMessage, {
        style: {
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          background: "#cc1100",
          color: "#fff",
          direction: "rtl",
          border: "none",
        },
        icon: <Ban />,
        closeButton: true,
      });
      sessionStorage.removeItem("showToastProblemDelete");
    }
  }, []);


  if (isGov && !govId) {
    return <div className="flex flex-col gap-5">
      <p className="text-center">جارٍ تحميل الجهة المعنية...</p>
      {!govId && <p className="text-center">أنت لا تتبع لجهة معنية، قم بإبلاغ الإدارة</p>}
    </div>;
  }

  return (
    <div className="flex flex-col gap-10 pr-10 mb-25">
      <ProblemHeader onFilterChange={setCriteria} />

      <div className="grid grid-cols-3 gap-5">
        {isLoading ? (
          <p>جاري التحميل...</p>
        ) : (
          problems.map((problem) => (
            // problem.isReal && (
              <ProblemCard key={problem.id} problem={problem} />
            // )
          ))
        )}
      </div>

      <PaginationComp page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
};

export default ProblemsPage;
