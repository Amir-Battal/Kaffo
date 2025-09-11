import { useGetUserById } from "@/hooks/use-user";

const DonorsTable = ({...props}): React.JSX.Element => {

  const user = useGetUserById(props.donation.donorId);


  return (
    <tr key={props.idx} className="hover:bg-gray-50">
      <td className="py-3 px-4 border-b">
        {props.donation.firstName} {props.donation.lastName} {user.data?.govId ? " (ممثل الجهة المعنية)" : ""}
      </td>
      <td className="py-3 px-4 border-b">
        {props.donation.amount} $
      </td>
      <td className="py-3 px-4 border-b">
        {props.donation.donationDate.split("T")[0]}
      </td>
    </tr>
  )
};

export default DonorsTable;
