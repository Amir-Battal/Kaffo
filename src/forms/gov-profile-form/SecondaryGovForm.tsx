import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, Edit, Ban } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGovUserInfo, useUpdateUserBasicInfo } from "@/hooks/use-user";
import { useAddress, useCities, useCreateAddress } from "@/hooks/use-Address";
import GovernorateSelect from "@/components/GovernorateSelect";
import { useGovById, useUpdateGovInfo } from "@/hooks/use-gov";

const formSchema = z.object({
  address: z.string().min(1, "العنوان مطلوب"),
  about: z.string().optional(),
  governorate: z.string().optional(),
});

export function SecondaryGovForm({
  userId,
  isMinistry,
}: {
  userId: string;
  isMinistry: boolean;
}) {
  // فقط إذا كانت وزارة أو جهة معنية نستدعي useGovById
  const govId = isMinistry ? Number(userId) : null;
  const govQuery = useGovById(govId);
  const { currentUser: gov, isLoading: govLoading } = isMinistry
    ? govQuery
    : { currentUser: null, isLoading: false };

  const { data: cities } = useCities();
  const { mutateAsync: createAddress } = useCreateAddress();
  const { mutateAsync: updateGovInfo } = useUpdateGovInfo();

  const userInfoResult = useGovUserInfo(userId);
  const { data: user, isLoading: userLoading, isError: userError } = !isMinistry
    ? userInfoResult
    : { data: null, isLoading: false, isError: false };

  const { updateUserBasicInfo } = useUpdateUserBasicInfo();

  const [editable, setEditable] = useState(false);

  const { data: govAddress } = useAddress(gov?.addressId);
  const { data: userAddress } = useAddress(user?.addressId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      about: "",
      governorate: "",
    },
  });

  useEffect(() => {
    if (isMinistry && gov) {
      form.reset({
        address: govAddress?.description || "",
        governorate: govAddress?.city || "",
      });
    } else if (user) {
      form.reset({
        address: userAddress?.description || "",
        about: user.description || "",
      });
    }
  }, [user, gov, userAddress, govAddress, isMinistry, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!cities) return;

      const matchedCity = isMinistry
        ? cities.find((c) => c.value === values.governorate)
        : cities.find((c) => c.arabic === user?.lastName);

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

      if (isMinistry && gov) {
        await updateGovInfo({
          id: govId!,
          name: gov.name,
          email: gov.email,
          phone: gov.phone,
          addressId: newAddress.id,
        });
        toast.success("تم تعديل بيانات الوزارة بنجاح");
      } else if (user) {
        await updateUserBasicInfo({
          id: userId,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          email: user.email,
          description: values.about ?? "",
          addressId: newAddress.id,
        });
        toast.success("تم تعديل البيانات الثانوية بنجاح");
      }

      setEditable(false);
      window.location.reload();
    } catch (error) {
      console.error("خطأ أثناء التحديث:", error);
      toast("حدث خطأ أثناء التحديث", {
        style: {
          background: "#cc1100",
          color: "#fff",
          direction: "rtl",
          border: "none",
        },
        icon: <Ban />,
        closeButton: true,
      });
    }
  };

  const handleEdit = () => {
    if (!isMinistry && (!user?.phone || user.phone.trim() === "")) {
      toast("يرجى إكمال البيانات الأساسية", {
        style: {
          background: "#cc1100",
          color: "#fff",
          gap: "20px",
          direction: "rtl",
          border: "none",
        },
        icon: <Ban />,
        closeButton: true,
      });
      return;
    }
    setEditable(true);
  };

  if ((isMinistry && govLoading) || (!isMinistry && userLoading)) {
    return <div>جاري تحميل البيانات...</div>;
  }

  if (isMinistry && !gov) return <div>لم يتم العثور على الجهة.</div>;
  if (!isMinistry && userError) return <div>حدث خطأ أثناء جلب المستخدم.</div>;

  return (
    <Form {...form}>
      {editable ? (
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
          {isMinistry ? (
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
          ) : (
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
          )}
          <Button
            type="submit"
            className="w-[40%] flex justify-around h-[50px] text-white bg-black hover:bg-gray-800 rounded-[10px]"
          >
            <h3>تأكيد التعديل</h3>
            <Check />
          </Button>
        </form>
      ) : (
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
          {isMinistry ? (
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
          ) : (
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
          )}
          <Button
            type="button"
            onClick={handleEdit}
            className="w-[40%] flex justify-around h-[50px] text-white bg-black hover:bg-gray-800 rounded-[10px]"
          >
            <h3>تعديل البيانات الثانوية</h3>
            <Edit />
          </Button>
        </div>
      )}
    </Form>
  );
}
