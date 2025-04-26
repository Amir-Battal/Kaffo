import { Check, Image } from "lucide-react";
import { Badge } from "./ui/badge";
import MapPicker from "./MapPicker";
import ProblemOverlay from "@/forms/problem-form/ProblemOverlay";
import ContributionForm from "@/forms/contribution-form/ContributionForm";
import DonationForm from "@/forms/donation-form/DonationForm";
import ContributionCard from "@/forms/contribution-form/ContributionCard";
import PaginationComp from "./PaginationComp";
import { useState } from "react";
import UserCard from "./UserCard";
import SolveControl from "./SolveControl";


interface problemData {
  title: string;
  details: string;
  category: string[];
  user: string;
  date: string;
  address: string;
  lat: number;
  lng: number;
}

const contribution = [
  {
    username: 'أمير بطال',
    date: '23/3/2025',
    contribution: "استطيع حل المشكلة من خلال عدة نقاط أهمها النقطة الأولى من خلال شراء المواد الأولية",
    budget: 120
  }
]

const user = [
  {
    username: 'أمير بطال',
    date: '23/3/2002',
    study: 'الهندسة المعلوماتية',
    job: 'هندسة برمجيات',
    details: ' هذا النص تجريبي يصف وصف عن المستخدم حيث أن المستخدم يجب أن يملئ هذا الحقل من أجل وصف ما هي المهارات التي يملكها ويستطيع العمل بها لتعطي موثوقية لتسليمه العمل على الأنشطة التطوعية',
    address: 'حلب، الجميلية',
    phoneNumber: '0999 999 999',
    email: 'email@example.com'
  }
]

const problem: problemData[] = [
  {
    title: 'رصيف مكسور',
    details: 'إحدى بلاطات الرصيف مكسورة تؤدي إلى إصابة الناس وعرقلتهم أثناء المشي.',
    category: ['محافظة حلب', 'رصيف مكسور', 'بلدية حلب'],
    user: 'أمير بطال',
    date: '23/3/2025',
    address: 'حلب، العزيزية',
    lat: 36.208465, 
    lng: 37.1555411,
  },
]

type MainDetailsProp = {
  // num: number;
  contribution?: boolean;
  donation?: boolean;
}

const ProblemMainDetails = (prop: MainDetailsProp) => {

  const [donation, setDonation] = useState<number>(0)
  const [isDonated, setIsDonated] = useState<boolean>(false)

  const [isGov, setIsGov] = useState(true);

  return (
    <div className="flex flex-row gap-10 px-10">
      <div className="w-[60%] flex flex-col gap-15">
        
        <div className="flex flex-col gap-5">
          <h1 className="text-2xl">{problem[0].title}</h1>
          <p className="w-[80%] text-xl text-black">{problem[0].details}</p>
        </div>
        
        <div className="flex flex-col gap-5">
          <div className="h-[30px] flex flex-row gap-2">
            <Badge className="rounded-none" variant="default">{problem[0].category[0]}</Badge>
            <Badge className="rounded-none" variant="secondary">{problem[0].category[1]}</Badge>
            <Badge className="rounded-none" variant="secondary">{problem[0].category[2]}</Badge>
          </div>
          
          {isGov
            ?(
              <div className="flex flex-col gap-5">
                <h3>تاريخ إنشاء الشكوى: {problem[0].date}</h3>
                <UserCard 
                  username={user[0].username}
                  date={user[0].date}
                  study={user[0].study}
                  job={user[0].job}
                  details={user[0].details}
                  address={user[0].address}
                  phoneNumber={user[0].phoneNumber}
                  email={user[0].email}
                />
              </div>
            ):(
              <h3 className="text-[10]">{problem[0].user} - {problem[0].date}</h3>
            )
          }
        </div>
        
        {prop.contribution
          ?(
            <div className="flex flex-col gap-10">
              <h1 className="text-2xl">شارك في حل المشكلة وقدم أقتراح لحلها</h1>
              <ContributionForm />
              <PaginationComp />
            </div>
          ): prop.donation
          ?(
            <div className="flex flex-col gap-20">
              <div className="flex flex-col gap-5">
                <h1 className="text-2xl">شارك في حل المشكلة وقم بالتبرع بتكلفة حل المشكلة</h1>
                <ContributionCard
                  username={contribution[0].username}
                  date={contribution[0].date}
                  contribution={contribution[0].contribution}
                  budget={contribution[0].budget}
                />
              </div>
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-5">
                  <h1 className="text-2xl">آلية التبرع</h1>
                  {isDonated
                    ?(
                      <div className="flex flex-row gap-2 items-center">
                        <h3 className="text-[22px]">تم التبرع بمبلغ {donation} ليرة سورية</h3>
                        <Check size={30} />
                      </div>
                    ):(
                      <div></div>
                    )}
                  <h3>التبرع بجزء من المبلغ</h3>
                </div>
                <DonationForm setDonation={setDonation} setIsDonated={setIsDonated} max={contribution[0].budget} />
              </div>
            </div>
          ):(
            <div>
              {isGov
                ?(
                  <div>
                    <SolveControl />
                  </div>
                ):(
                  <div className="flex flex-row gap-5">
                    <ProblemOverlay status={'edit'} />
                    <ProblemOverlay status={'delete'} />
                  </div>
                )
              }
            </div>
          )
        }
        

      </div>

      <div className="w-[40%] flex flex-col gap-10">
        <div className="w-full flex flex-row gap-5 justify-end">
          <div className="flex justify-center items-center bg-gray-500 w-full h-[350px]">
            <Image className="text-white" size={50}/>
          </div>
          <div className="w-[80px] flex flex-col gap-5">
            <div className="flex justify-center items-center bg-gray-500 w-[100px] h-[100px]">
              <Image className="text-white" size={50}/>
            </div>
            <div className="flex justify-center items-center bg-gray-500 w-[100px] h-[100px]">
              <Image className="text-white" size={50}/>
            </div>
            <div className="flex justify-center items-center bg-gray-500 w-[100px] h-[100px]">
              <Image className="text-white" size={50}/>
            </div>
          </div>
        </div>

        <div className="w-[75%] flex flex-col gap-2 z-0">
          <MapPicker isNew={false} lat={problem[0].lat} lng={problem[0].lng} isEdit={false}/>
          <h3>{problem[0].address}</h3>
        </div>
      </div>
    </div>
  );
};

export default ProblemMainDetails;