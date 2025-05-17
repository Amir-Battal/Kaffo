import Button from "./Button";

const Navbar = () => {

  return (
    <div dir="rtl" className="flex flex-row justify-between items-center rounded-[40px] pr-10 bg-gray-200 w-[70%] h-[80px] fixed mt-5 z-1">
      
      <a href="#">
        <h1 className="text-2xl font-bold">كفو</h1>
      </a>
      
      <ul className="flex flex-row justify-between w-[25%]">
        <li>
          <a href="#simple-analytics" className="hover:font-semibold">
            إحصائيات
          </a>
        </li>
        <li>
          <a href="#benefits" className="hover:font-semibold">
            ميزات
          </a>
        </li>
        <li>
          <a href="#faq" className="hover:font-semibold">
            أسئلة
          </a>
        </li>
      </ul>

      <Button />
    </div>
  );
};

export default Navbar;
