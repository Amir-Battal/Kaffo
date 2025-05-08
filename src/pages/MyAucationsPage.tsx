import ProblemCard from "@/components/ProblemCard";
import ProblemHeader from "@/components/ProblemHeader";
import { useGetProblemsByUser } from "@/hooks/use-problem";
import { useGetMyUser } from "@/hooks/use-user";

const MyAucationsPage = () => {
  // const [page, setPage] = useState(0); // ⚠️ backend يبدأ من 0
  // const [criteria, setCriteria] = useState({});

  // useEffect(() => {
  //   setPage(0);
  // }, [criteria]);

  // const { problems, totalPages, isLoading } = useGetAllProblems({
  //   page,
  //   size: 6,
  //   // sort: ["submissionDate,desc"], // ✅ مثال
  // }, criteria);

  const { currentUser } = useGetMyUser();
  const { problems, isLoading } = useGetProblemsByUser(currentUser?.id);
  
  if (isLoading) return <p>جاري التحميل...</p>;


  return (
    <div className="flex flex-col gap-10 pr-10 mb-25">
      <ProblemHeader  myAucation />

      <div className="grid grid-cols-3 gap-5">
        {isLoading ? (
          <p>جاري التحميل...</p>
        ) : (
          problems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} myAucation />
          ))
        )}
      </div>

      {/* <PaginationComp page={page} setPage={setPage} totalPages={totalPages} /> */}
    </div>
  );
};

export default MyAucationsPage;