import { useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import BreadcrumbComp from "./BreadcrumbComp";
import Navbar from "./Navbar";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";

type Props = {
  children: React.ReactNode;
};

const Header = ({children}: Props) => {

  const location = useLocation();

  return (
    <>
      <SidebarProvider dir="rtl">
        <AppSidebar />
        <div className="w-full">
          <nav className="w-full h-fit flex flex-row justify-between p-5 bg-gray-200">
            <SidebarTrigger />
            <Navbar />
          </nav>
          
          <BreadcrumbComp name={location.pathname} />

          <div>
            {children} 
          </div>

          {/* <div className="w-[40%]">
            <CardCom />
          </div> */}

        </div>
      </SidebarProvider>
    </>
  );
};

export default Header;