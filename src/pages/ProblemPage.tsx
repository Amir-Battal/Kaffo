import ProblemMainDetails from "@/components/ProblemMainDetails";
import { useParams } from "react-router-dom";


type ProblemPageProp = {
  // num: number;
  contribution?: boolean;
  donation?: boolean;
}

const ProblemPage = (prop: ProblemPageProp) => {

  const {problemId} = useParams();

  return (
    <div className="mb-[500px]">
      {prop.contribution
        ?(
          <div>
            <div>Contribution {problemId}</div>
            <ProblemMainDetails contribution />
          </div>

        ): prop.donation
        ?(
          <div>
            <div>Donation {problemId}</div>
            <ProblemMainDetails donation />
          </div>
          
        ):(
          <div>
            <div>Problem {problemId}</div>
            <ProblemMainDetails />
          </div>
        )
      }
    </div>
  );
};

export default ProblemPage;