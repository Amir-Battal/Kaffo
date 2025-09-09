import GovernorateSelect from "@/components/GovernorateSelect";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAddress, useCities, useCreateAddress } from "@/hooks/use-Address";
import { useGetUserById, useUpdateUserBasicInfo } from "@/hooks/use-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ban, Check, Edit } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  address: z.string().min(1, "العنوان مطلوب"),
  about: z.string().optional(),
  governorate: z.string().optional(),
});

const SecondaryEmployeeForm = ({...props}): JSX.Element => {

  const [editable, setEditable] = useState(false);

  const { data: user } = useGetUserById(props.userId);

  const { data: cities } = useCities();
  const { mutateAsync: createAddress } = useCreateAddress();
  const { data: userAddress } = useAddress(user?.addressId);

  const { updateUserBasicInfo } = useUpdateUserBasicInfo();



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      about: "",
      governorate: "",
    },
  });

  useEffect(() => {
    if(user?.govId){
      form.reset({
        address: userAddress?.description || "",
        governorate: userAddress?.city || "",
        about: user.description || "",
      });
    }
  }, [user, userAddress, form])



  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!cities) return;


      const matchedCity = cities.find((c) => c.value === values.governorate);

        console.log(matchedCity);

      if (!matchedCity) {
        toast.error("لم يتم العثور على المدينة المطابقة.");
        return;
      }

      const newAddress = await createAddress({
        city: matchedCity.value,
        description: values.address,
        latitude: 0,
        longitude: 0,
      });

      await updateUserBasicInfo({
        id: props.userId,
        firstName: user?.firstName,
        lastName: user?.lastName,
        phone: user?.phone,
        email: user?.email,
        description: values.about ?? "",
        addressId: newAddress.id,
      });
      toast.success("تم تعديل البيانات الثانوية بنجاح");

      setEditable(false);
      window.location.reload();
    } catch (error) {
      // console.error("خطأ أثناء التحديث:", error);
      // toast("حدث خطأ أثناء التحديث", {
      //   style: {
      //     background: "#cc1100",
      //     color: "#fff",
      //     direction: "rtl",
      //     border: "none",
      //   },
      //   icon: <Ban />,
      //   closeButton: true,
      // });
    }
  };

  const handleEdit = () => {
    setEditable(true);
  };

  return (
    <Form {...form}>
      {editable
        ?(
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            dir="rtl"
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان</FormLabel>
                  <FormControl>
                    <Input placeholder="حلب، العزيزية" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="governorate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المحافظة</FormLabel>
                  <FormControl>
                    <GovernorateSelect
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وصف عنك</FormLabel>
                  <FormControl>
                    <Textarea placeholder="قم بكتابة وصف عنك" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-[40%] flex justify-around h-[50px] text-white bg-black hover:bg-gray-800 rounded-[10px]"
            >
              <h3>تأكيد التعديل</h3>
              <Check />
            </Button>
          </form>
        ):(
          <div dir="rtl" className="w-full space-y-6">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان</FormLabel>
                  <FormControl>
                    <Input disabled className="text-gray-400" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="governorate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المحافظة</FormLabel>
                  <FormControl>
                    <GovernorateSelect
                      disabled
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وصف عنك</FormLabel>
                  <FormControl>
                    <Textarea disabled {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="button"
              onClick={handleEdit}
              className="w-[40%] flex justify-around h-[50px] text-white bg-black hover:bg-gray-800 rounded-[10px]"
            >
              <h3>تعديل البيانات الثانوية</h3>
              <Edit />
            </Button>
          </div>
        )
      }
    </Form>
  );
};

export default SecondaryEmployeeForm;
