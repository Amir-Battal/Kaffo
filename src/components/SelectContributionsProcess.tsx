import ContributionCard from "@/forms/contribution-form/ContributionCard";
import { SolutionDTO } from "@/types";
import { Check, Edit } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { Button } from "./ui/button";

const SelectContributionsProcess = ({...props}): JSX.Element => {

  const [select, setSelect] = useState<boolean>();
  const [solution, setSolution] = useState<SolutionDTO>(); 

  // console.log("pendContributions" ,props.pendContributions);


  const handleSelect = (contribution: SolutionDTO) => {
    setSelect(true);
    setSolution(contribution);

    props.selectContribution(contribution);
    props.setSelectedContribution(contribution);
    props.setIsSelected(true);
  };

  const handleUnSelect = () => {
    setSelect(false);
    setSolution(undefined);

    props.unselectContribution();
    props.setIsSelected(false);
  };

  useEffect(() => {
    if(props.acceptedContribution){
      setSolution(props.acceptedContribution);
    }
    if(props.isSelected){
      setSelect(true);
    }
    if(!props.isSelected){
      setSelect(false);
    }
  }, [])
  // useEffect(() => {
  //   if (props.acceptedContribution) {
  //     props.setIsSelected(true)
  //   }
  // }, [props.isSelected]);

  // console.log("select", select);
  // console.log("solution", solution);



  return (
    <div className="flex flex-col gap-5">
      {(select && solution) && (
        <ContributionCard
          username={`${solution.submitterFirstName} ${solution.submitterLastName}`}
          date={solution?.creationDate}
          contribution={solution?.description}
          budget={solution?.estimatedCost}
        >
          {props.isThereNotDonation && (
            <div className="flex flex-row-reverse">
              <Button onClick={handleUnSelect} variant="ghost" className="m-1 cursor-pointer">
                <h3>حل آخر</h3>
                <Edit />
              </Button>
            </div>
          )}
        </ContributionCard>
      )}
      { !select && props.pendContributions && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-5">
            {props.pendContributions.map((c) => (
              <ContributionCard
                key={c.id}
                // username={`${useGetUserById(c.proposedByUserId).data?.firstName} ${useGetUserById(c.proposedByUserId).data?.lastName}`}
                username={`${c.submitterFirstName} ${c.submitterLastName}`}
                date={c.creationDate}
                contribution={c.description}  
                budget={c.estimatedCost}
              >
                <div className="flex flex-row-reverse">
                  <Button onClick={() => handleSelect(c)} variant="ghost" className="m-1 cursor-pointer">
                    <h3>اختيار الحل</h3>
                    <Check />
                  </Button>
                </div>
              </ContributionCard>
            ))}
          </div>
          {/* <PaginationComp /> */}
        </div>
      )}
      {/* {props.isSelected || select && solution ? (
      ) :(
      )} */}
    </div>
  );
};

export default SelectContributionsProcess;
