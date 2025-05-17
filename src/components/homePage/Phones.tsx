import NotificationCard from "./NotificationCard";
import Phone from "./Phone";

const Phones = () => {

  return (
    <div className="w-full h-[30vh] flex flex-row justify-center gap-40 mt-10">
          <div className="rotate-335 mt-15">
            <Phone content="Notifications"/>
          </div>
          <div className="mt-10 mr-150 absolute z-0">
            <NotificationCard reject />
          </div>
          <div className="mt-25 ml-30 absolute z-0">
            <NotificationCard pending />
          </div>
          <Phone content="Problems" size />
          <div className="mt-40 mr-120 absolute z-0">
            <NotificationCard />
          </div>
          <div className="rotate-25 mt-15">
            <Phone content="Profile" />
          </div>

        </div>
  );
};

export default Phones;
