import { useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import BreadcrumbComp from "./BreadcrumbComp";
import Navbar from "./Navbar";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import keycloak from "@/lib/keycloak";

type Props = {
  children: React.ReactNode;
};

const Header = ({children}: Props) => {

  const location = useLocation();
  const roles = keycloak.tokenParsed?.resource_access?.["react-client"].roles || [];

  return (
    <>
      <SidebarProvider dir="rtl">
        <AppSidebar />
        <div className="w-full">
          <nav className={`w-full h-fit flex flex-row justify-between p-5 bg-gray-200 ${
            roles.includes("ROLE_ADMIN") 
            ? "border-b-4 border-red-600" 
            : roles.includes("ROLE_GOV") 
            ? "border-b-4 border-blue-600"
            : "border-b-4 border-green-600"
          }`}>
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