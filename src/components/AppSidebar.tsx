import {Building2, ChartArea, ChartNoAxesGantt, Check, Copy, Folder, Heart, Home, Inbox, LogOut, ShoppingCart, Users } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../components/ui/sidebar"

import SidebarHeaderElements from "./SidebarHeaderElements"
import { Separator } from "./ui/separator"


// Menu items.
const UserItems = [
  {
    title: "الرئيسية",
    url: "/",
    icon: Home,
  },
  {
    title: "المشكلات",
    url: "/problems",
    icon: Inbox,
  },
  {
    title: "التطوع",
    url: "/volunteering",
    icon: Users,
  },
  {
    title: "الإحصائيات",
    url: "/statistics",
    icon: ChartArea,
  },
  {
    title: "مشاركاتي",
    url: "/user-activities",
    icon: ChartNoAxesGantt
  },
  {
    title: "تسجيل الخروج",
    url: "#",
    icon: LogOut,
  },
]

const subUserItems = [
  {
    title: "الشكاوي",
    url: "/user-activities/aucations",
    icon: Folder,
  },
  {
    title: "التطوع",
    url: "#",
    icon: Heart,
  },
  {
    title: "المساهمات",
    url: "#",
    icon: Copy,
  },
  {
    title: "التبرعات",
    url: "#",
    icon: ShoppingCart,
  },
]

const GovItems = [
  {
    title: "الشكاوي",
    url: "/problems",
    icon: Inbox,
  },
  {
    title: "المناقصات",
    url: "/problems/auctions",
    icon: Building2,
  },
  {
    title: "الإحصائيات",
    url: "/statistics",
    icon: ChartArea,
  },
  {
    title: "الأنشطة",
    url: "#",
    icon: ChartNoAxesGantt,
  },
  {
    title: "تسجيل الخروج",
    url: "#",
    icon: LogOut,
  },
]

const subGovItems = [
  {
    title: "المنجزة",
    url: "/problems/completed",
    icon: Check,
  },
]

export function AppSidebar() {
  return (
    <Sidebar side="right">

      <SidebarContent className="overflow-x-hidden">

        <SidebarHeader className="hover:bg-gray-100 rounded-[10px]">
          <SidebarHeaderElements />
        </SidebarHeader>
        
        <Separator />

        <SidebarGroup>

          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu className="gap-5">
              {UserItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {/* {item.title === 'الأنشطة'  */}
                  {item.title === 'مشاركاتي' 
                  ?(
                    <div>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                      <SidebarMenu className="gap-5 mr-10 mt-2">
                      {subUserItems.map((subItem) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <a href={subItem.url}>
                            <subItem.icon />
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                    </div>
                  ):
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  }
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          
        </SidebarGroup>

      </SidebarContent>

    </Sidebar>
  )
}
