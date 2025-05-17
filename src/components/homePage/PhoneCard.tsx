import { JSX } from "react";
import Phone from "./Phone";

const PhoneCard = ({...props}): JSX.Element => {

  return (
    <div className="w-full h-[350px] shadow-[inset_0_-180px_35px_rgba(0,0,0,0.3)] rounded-3xl py-8 flex justify-center bg-[#f9fbfc] relative overflow-hidden">
        {/* Pattern Background */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 0)',
            backgroundSize: '12px 12px',
          }}
        />
        <div className="flex flex-col gap-5">
          <h1 className="text-xl font-semibold">{props.title}</h1>
          <div className="relative z-0 flex flex-col items-center gap-6">
            <Phone content={props.content}/>
          </div>
        </div>
      </div>
  );
};

export default PhoneCard;
