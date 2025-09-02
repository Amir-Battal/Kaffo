import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../components/ui/navigation-menu"
import { BellRing } from "lucide-react";


const Navbar = () => {
  return (
    // <div className="border-b-2 py-6">
    //   <div className="container mx-auto flex justify-between items-center">
    //     <Link 
    //       to="/" 
    //       className="text-3xl tracking-tight text-shadow-black"
    //     >
    //       Kaffo
    //     </Link>
    //   </div>
    // </div>

    <NavigationMenu className="w-full pr-[50px]" >

      <NavigationMenuList className="flex flex-row justify-between">

        

        <NavigationMenuItem >
          <Link 
            dir="rtl"
            to="/" 
            className='text-2xl font-bold'
          >
            صوتك يصلنا ...
          </Link>
        </NavigationMenuItem>

        {/* <NavigationMenuItem className="hover:bg-gray-300 p-1 rounded-[100%]">
          <Link to="/user-profile">
            <BellRing size={30} />
          </Link>
        </NavigationMenuItem> */}

      </NavigationMenuList>

    </NavigationMenu>
  );
};

export default Navbar;