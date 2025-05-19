import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import GovernorateSelect from "@/components/GovernorateSelect"
import { Textarea } from "@/components/ui/textarea"
import DatePicker from "@/components/DatePicker"
import { Button } from "@/components/ui/button"
import { Ban, Check, Edit, User } from "lucide-react"
import { JSX, useEffect, useState } from "react"
import { useAddress, useCreateAddress } from "@/hooks/use-Address"
import { useUpdateUserBasicInfo } from "@/hooks/use-user"
import { toast } from "sonner"

const formSchema = z.object({
  governorate: z.string(),
  address: z.string(),
  birth: z.string(),
  study: z.string(),
  work: z.string(),
  about: z.string(),
})

const tDate: Date = new Date(2010, 0, 10);
const birthDate = tDate.toLocaleDateString('en-US', 
  {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });


export function SecondaryForm({...props}): JSX.Element {

    const addressId = props.user?.addressId;

    const { updateUserBasicInfo } = useUpdateUserBasicInfo();
    const { mutate } = useCreateAddress();
    const { data: addressData, isLoading, isError } = useAddress(addressId!, {
      enabled: !!addressId, // ✅ لا تُنفذ الاستعلام إلا إذا كان id موجود
    });


    const [governorate, setGovernorate] = useState("");
    const [address, setAddress] = useState("");
    
    
    useEffect(() => {
      if (addressData) {
        setGovernorate(addressData.city);
        setAddress(addressData.description);
      }
    }, [addressData]);
    
    
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        governorate: "",
        address: "",
        birth: "",
        study: "",
        work: "",
        about: "",
      },
    });
    
    useEffect(() => {
      if (props.user && addressData) {
        form.reset({
          governorate: addressData.city || "",
          address: addressData.description || "",
          birth: props.user.dateOfBirth || "",
          study: props.user.collegeDegree || "",
          work: props.user.job || "",
          about: props.user.description || "",
        });
      }
    }, [props.user, addressData, form]);
    
    
    function onSubmit(values: z.infer<typeof formSchema>) {
      values.governorate = governorate;
      console.log(governorate);


      // values.birth = nDate.toISOString();

      const finalDate = newDate ? new Date(newDate) : new Date(values.birth);
      values.birth = finalDate.toISOString();

    
      // ✅ تحقق من تطابق العنوان الحالي مع المدخل
      const isSameAddress =
        addressData &&
        addressData.city === values.governorate &&
        addressData.description === values.address;
    
      // إذا نفس العنوان، استخدم id الحالي مباشرة
      if (isSameAddress) {
        updateUserBasicInfo({
          id: props.user?.id,
          firstName: props.user?.firstName,
          lastName: props.user?.lastName,
          phone: props.user?.phone,
          email: props.user?.email,
    
          dateOfBirth: new Date(values.birth),
          collegeDegree: values.study,
          job: values.work,
          description: values.about,

          addressId: props.user?.addressId, // 👈 استخدم العنوان الحالي
        });
    
        console.log("تم استخدام العنوان الحالي، لم يتم إنشاؤه من جديد.");
        sessionStorage.setItem("showToast", "تم تعديل البيانات الثانوية بنجاح");
        setEditable(false);
        window.location.reload();
        return;
      }
    
      // 🆕 عنوان مختلف → إنشاء جديد
      mutate(
        {
          city: values.governorate,
          description: values.address,
          longitude: 0,
          latitude: 0,
        },
        {
          onSuccess: (data) => {
            const addressId = data.id;
    
            updateUserBasicInfo({
              id: props.user?.id,
              firstName: props.user?.firstName,
              lastName: props.user?.lastName,
              phone: props.user?.phone,
              email: props.user?.email,
    
              dateOfBirth: new Date(values.birth),
              collegeDegree: values.study,
              job: values.work,
              description: values.about,

              addressId: addressId, // 👈 ربط العنوان الجديد
            });
    
            console.log("✅ تم إنشاء عنوان جديد وربطه:", addressId);
            sessionStorage.setItem("showToast", "تم تعديل البيانات الثانوية بنجاح");
            setEditable(false);
            window.location.reload();
          },
          onError: (error) => {
            console.error("❌ فشل إنشاء العنوان:", error);
          },
        }
      );
    }
    
    
    
    const [editable, setEditable] = useState(false);
    
    const handleEdit = () => {
      if (!props.user?.phone || props.user.phone.trim() === "") {
        toast("يرجى كتابة رقم الهاتف أولاً قبل تعديل البيانات الثانوية",{
          style:{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            background: '#cc1100',
            color: '#fff',
            direction: 'rtl',
            border: 'none',
          },
          icon: <Ban/>,
          closeButton: true
        })
        // toast.error("يرجى كتابة رقم الهاتف أولاً قبل تعديل البيانات الثانوية")
        return;
      }

      setEditable(true);
    }
    
    // const [governorate, setGovernorate] = useState(user[0].governorate);
    const [newDate, setNewDate] = useState('');
    // const nDate: Date = new Date(newDate);
    
    if (isLoading) return <div>جاري تحميل بيانات العنوان...</div>;
    if (isError) return <div>حدث خطأ أثناء جلب بيانات العنوان.</div>;
    
    
  return (
    <Form {...form}>
          {editable
          ? (
            <form className="w-[100%]" onSubmit={form.handleSubmit(onSubmit)}  dir="rtl">
            <div className="space-y-8 w-full flex flex-col gap-6 py-1">
              <div className="flex flex-row w-full justify-between gap-10">
                <FormField
                  control={form.control}
                  name="governorate"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>المحافظة</FormLabel>
                      <FormControl>
                        <GovernorateSelect
                          setGovernorate={setGovernorate}
                          value={field.value}
                          onChange={field.onChange}
                          disabled={!editable}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>العنوان</FormLabel>
                      <FormControl>
                        <Input placeholder="حلب، العزيزية" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="birth"
                render={( ...field ) => (
                  <FormItem className="w-full">
                    <FormLabel>تاريخ الميلاد</FormLabel>
                    <FormControl>
                      <DatePicker setNewDate={setNewDate} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex flex-row justify-between gap-10">
                <FormField
                  control={form.control}
                  name="study"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>الدراسة</FormLabel>
                      <FormControl>
                        <Input placeholder="صيدلة" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="work"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>العمل</FormLabel>
                      <FormControl>
                        <Input placeholder="مهندس مدني" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>وصف عنك</FormLabel>
                    <FormControl>
                      <Textarea placeholder="قم بكتابة وصف عنك" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className=" flex flex-row justify-around cursor-pointer w-[40%] h-[50px] text-white bg-black p-2  rounded-[10px] hover:bg-gray-800">
                <h3>تأكيد التعديل</h3>
                <Check />
              </Button>
            </div>
            </form>
          ):(
            <div  dir="rtl">
            <div className="space-y-8 w-full flex flex-col gap-6 py-1">
              <div className="flex flex-row w-full justify-between gap-10">
                <FormField
                    disabled
                    control={form.control}
                    name="governorate"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>المحافظة</FormLabel>
                        <FormControl>
                          <GovernorateSelect setGov={setGovernorate} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                <FormField
                  disabled
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>العنوان</FormLabel>
                      <FormControl>
                        <Input className="text-gray-400" placeholder="حلب، العزيزية" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                disabled
                control={form.control}
                name="birth"
                render={( ...field ) => (
                  <FormItem className="w-full">
                    <FormLabel>تاريخ الميلاد</FormLabel>
                    <FormControl>
                      <DatePicker {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex flex-row justify-between gap-10">
                <FormField
                  disabled
                  control={form.control}
                  name="study"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>الدراسة</FormLabel>
                      <FormControl>
                        <Input className="text-gray-400" placeholder="صيدلة" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  disabled
                  control={form.control}
                  name="work"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>العمل</FormLabel>
                      <FormControl>
                        <Input className="text-gray-400" placeholder="مهندس مدني" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                disabled
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>وصف عنك</FormLabel>
                    <FormControl>
                      <Textarea placeholder="قم بكتابة وصف عنك" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="button" onClick={handleEdit} className="flex flex-row justify-around cursor-pointer w-[40%] h-[50px] text-white bg-black p-2  rounded-[10px] hover:bg-gray-800">
                <h3>تعديل البيانات الثانوية</h3>
                <Edit />
              </Button>
            </div>
            </div>
          )}
    </Form>
  )
}
