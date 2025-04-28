import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Briefcase, Building2, ChartArea, ChartNoAxesGantt, Check, DollarSign, Folder, Home, Inbox, MessageSquare, User, UserPlus, Users } from "lucide-react";

type BreadcrumbProps = {
  name: string;
}

const BreadcrumbComp = (prop : BreadcrumbProps) => {

  return (
    <div>
      <Breadcrumb dir="rtl">

        <BreadcrumbList>

        {prop.name === "/" 
          ? (
            <BreadcrumbItem>
              <BreadcrumbLink className="flex flex-row items-center gap-2" href="/">
                <Home />
                <h3>الرئيسية</h3>
              </BreadcrumbLink>
            </BreadcrumbItem>
          )
          : prop.name === "/problems"
          ?(
            <BreadcrumbItem>
              <BreadcrumbLink className="flex flex-row items-center gap-2" href="/problems">
                <Inbox />
                <h3>المشكلات (100)</h3>
              </BreadcrumbLink>
            </BreadcrumbItem>
          )
          : prop.name === `/problems/${prop.name.split('/problems/')[1]}`
          ?(
            <div>
            {prop.name.split('/problems/')[1] === 'auctions'
            ?(
              <BreadcrumbItem>
                <BreadcrumbLink className="flex flex-row items-center gap-2">
                  <Building2 />
                  <h3>المناقصات (100)</h3>
                </BreadcrumbLink>
              </BreadcrumbItem>
            )
            : prop.name.split('/problems/')[1] === 'completed'
            ?(
              <div className="w-full flex flex-row items-center gap-2">
              <BreadcrumbItem>
                <BreadcrumbLink className="flex flex-row items-center gap-2" href="/problems">
                  <Inbox />
                  <h3>المشكلات</h3>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink className="flex flex-row items-center gap-2">
                  <Check />
                  <h3>المنجزة (100)</h3>
                </BreadcrumbLink>
              </BreadcrumbItem>
              </div>
            )
            :(
              <div className="w-full flex flex-row items-center gap-2">
              <BreadcrumbItem>
                <BreadcrumbLink className="flex flex-row items-center gap-2" href="/problems">
                  <Inbox />
                  <h3>المشكلات</h3>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
              {/*TODO: fix that accept anything :) */}
                <BreadcrumbLink>
                  <h3>مشكلة رقم {prop.name.split('/problems/')}</h3>
                </BreadcrumbLink>
              </BreadcrumbItem>
              </div>
              
            )}
            </div>
          )
          : prop.name === "/volunteering"
          ?(
            <BreadcrumbItem>
              <BreadcrumbLink className="flex flex-row items-center gap-2" href="/volunteering">
                <Users />
                <h3>التطوع (100)</h3>
              </BreadcrumbLink>
            </BreadcrumbItem>
          )
          : prop.name === "/volunteering/contributions"
          ?(
            <div className="w-full flex flex-row items-center gap-2">
              <BreadcrumbItem>
                <BreadcrumbLink className="flex flex-row items-center gap-2" href="/volunteering">
                  <Users />
                  <h3>التطوع</h3>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink className="flex flex-row items-center gap-2">
                  <MessageSquare />
                  <h3>المساهمات (100)</h3>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </div>
          )
          : prop.name === `/volunteering/contributions/${prop.name.split('/volunteering/contributions/')[1]}`
          ?(
            <div className="w-full flex flex-row items-center gap-2">
              <BreadcrumbItem>
                <BreadcrumbLink className="flex flex-row items-center gap-2" href="/volunteering">
                  <Users />
                  <h3>التطوع</h3>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink className="flex flex-row items-center gap-2" href="/volunteering/contributions">
                  <MessageSquare />
                  <h3>المساهمات</h3>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
              {/*TODO: fix that accept anything :) */}
                <BreadcrumbLink>
                  <h3>مشكلة رقم {prop.name.split('/volunteering/contributions/')}</h3>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </div>
          )
          : prop.name === "/volunteering/donations"
          ?(
            <div className="w-full flex flex-row items-center gap-2">
              <BreadcrumbItem>
                <BreadcrumbLink className="flex flex-row items-center gap-2" href="/volunteering">
                  <Users />
                  <h3>التطوع</h3>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink className="flex flex-row items-center gap-2">
                  <DollarSign />
                  <h3>التبرعات (100)</h3>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </div>
          )
          : prop.name === `/volunteering/donations/${prop.name.split('/volunteering/donations/')[1]}`
          ?(
            <div className="w-full flex flex-row items-center gap-2">
              <BreadcrumbItem>
                <BreadcrumbLink className="flex flex-row items-center gap-2" href="/volunteering">
                  <Users />
                  <h3>التطوع</h3>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink className="flex flex-row items-center gap-2" href="/volunteering/donations">
                  <DollarSign />
                  <h3>التبرعات</h3>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
              {/*TODO: fix that accept anything :) */}
                <BreadcrumbLink>
                  <h3>مشكلة رقم {prop.name.split('/volunteering/donations/')}</h3>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </div>
          )
          : prop.name === '/statistics'
          ?(
            <div className="w-full flex flex-row items-center gap-2">
              <BreadcrumbItem>
                <BreadcrumbLink className="flex flex-row items-center gap-2">
                  <ChartArea />
                  <h3>الإحصائيات</h3>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </div>
          )
          : prop.name === "/user-profile" 
          ?(
            <BreadcrumbItem>
              <BreadcrumbLink className="flex flex-row items-center gap-2" href="/user-profile">
                <User />
                <h3>الملف الشخصي</h3>
              </BreadcrumbLink>
            </BreadcrumbItem>
          ): prop.name === "/gov-profile"
          ?(
            <BreadcrumbItem>
              <BreadcrumbLink className="flex flex-row items-center gap-2" href="/user-profile">
                <User />
                <h3>الملف الشخصي</h3>
              </BreadcrumbLink>
            </BreadcrumbItem>
          ): prop.name === "/user-activities"
          ?(
            <BreadcrumbItem>
              <BreadcrumbLink className="flex flex-row items-center gap-2" href="/user-profile">
                <ChartNoAxesGantt />
                <h3>مشاركاتي</h3>
              </BreadcrumbLink>
            </BreadcrumbItem>
          ): prop.name === "/user-activities/aucations"
          ?(
            <div className="w-full flex flex-row items-center gap-2">
              <BreadcrumbItem>
                <BreadcrumbLink className="flex flex-row items-center gap-2" href="/user-activities">
                  <ChartNoAxesGantt />
                  <h3>مشاركاتي</h3>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink className="flex flex-row items-center gap-2">
                  <Folder />
                  <h3>الشكاوي</h3>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </div>
          ): prop.name === "/manage/problems"
          ?(
            <div className="w-full flex flex-row items-center gap-2">
              <BreadcrumbItem>
                <BreadcrumbLink className="flex flex-row items-center gap-2">
                  <Building2 />
                  <h3>المشكلات (100)</h3>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </div>
          ): prop.name === "/manage/users"
          ?(
            <div className="w-full flex flex-row items-center gap-2">
              <BreadcrumbItem>
                <BreadcrumbLink className="flex flex-row items-center gap-2">
                  <Users />
                  <h3>المستخدمين (50)</h3>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </div>
          ): prop.name === "/manage/govs"
          ?(
            <div className="w-full flex flex-row items-center gap-2">
              <BreadcrumbItem>
                <BreadcrumbLink className="flex flex-row items-center gap-2">
                  <Briefcase />
                  <h3>الجهات المعنية (50)</h3>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </div>
          ): prop.name === "/manage/new-account"
          ?(
            <div className="w-full flex flex-row items-center gap-2">
              <BreadcrumbItem>
                <BreadcrumbLink className="flex flex-row items-center gap-2">
                  <UserPlus />
                  <h3>إنشاء حساب</h3>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </div>
          ):(
            <div></div>
          )
        }
          {/* <BreadcrumbItem>
            <BreadcrumbLink href="/">المشكلات</BreadcrumbLink>
          </BreadcrumbItem> */}

          {/* <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink href="/components">Components</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem> */}

        </BreadcrumbList>

      </Breadcrumb>

    </div>
  );
};

export default BreadcrumbComp;