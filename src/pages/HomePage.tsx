import { MainChart } from "@/components/MainChart";
import { ProblemsCarousel } from "@/components/ProblemsCarousel";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {


  return (
    <div className="w-full flex flex-col gap-15">
      <div className="flex flex-col">
        <div className="w-full flex flex-row justify-between px-10">
          <h1 className="text-xl">المشكلات التي يتم العمل عليها</h1>
          <Button className="cursor-pointer">
            <h3>عرض المزيد</h3>
            <ChevronLeft />
          </Button>
        </div>
        <ProblemsCarousel />
      </div>

      <div className="flex flex-col">
        <div className="w-full flex flex-row justify-between px-10">
          <h1 className="text-xl">المشكلات التي يمكنك التطوع والمساهمة في حلها</h1>
          <Button className="cursor-pointer">
            <h3>عرض المزيد</h3>
            <ChevronLeft />
          </Button>
        </div>
        <ProblemsCarousel />
      </div>

      <div className="flex flex-col">
        <div className="w-full flex flex-row justify-between px-10">
          <h1 className="text-xl">المشكلات التي يمكنك التبرع لحلها</h1>
          <Button className="cursor-pointer">
            <h3>عرض المزيد</h3>
            <ChevronLeft />
          </Button>
        </div>
        <ProblemsCarousel />
      </div>

      <div className="flex flex-row justify-between px-10 pl-20">
        <div className="flex flex-col gap-10">
          <h1 className="text-xl">نسبة توزيعات الأنشطة التي قمت بها خلال شهر</h1>
          <Link to='/statistics' className="w-[60%] h-[50px] flex flex-row justify-between items-center cursor-pointer text-white bg-black p-2  rounded-[10px] hover:bg-gray-800">
            <h3>عرض المزيد من الإحصائيات</h3>
            <ChevronLeft />
          </Link>
        </div>
        <MainChart/>
      </div>

    </div>
  );
};

export default HomePage;