import Button from "./Button";

const Navbar = () => {

  return (
    <div dir="rtl" className="flex flex-row justify-between items-center rounded-[40px] pr-10 bg-gray-200 w-[70%] h-[80px] fixed mt-5">
      
      <a href="#">
        <h1 className="text-2xl font-bold">كفو</h1>
      </a>
      
      <ul className="flex flex-row justify-between w-[15%]">
        <li>
          <a href="#" className="hover:font-semibold">
            الميزات
          </a>
        </li>
        <li>
          <a href="#" className="hover:font-semibold">
            التقييمات
          </a>
        </li>
      </ul>

      <Button />
    </div>
  );
};

export default Navbar;
