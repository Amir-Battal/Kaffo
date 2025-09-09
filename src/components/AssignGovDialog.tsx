import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import MinistriesSelect from "@/components/MinistriesSelect"
import ConcernedPartySelect from "@/components/ConcernedPartySelect"
import { useAddRole, useAssociateUserToGov } from "@/hooks/use-user"

export default function AssignGovDialog({
  userId,
  initialGovId,
  onClose
}: {
  userId: string
  initialGovId?: string
  onClose: () => void
}) {
  const [ministryId, setMinistryId] = useState<number | null>(null)
  const [partyId, setPartyId] = useState<number | null>(initialGovId ? Number(initialGovId) : null)

  const { mutateAsync: associateUser, isLoading } = useAssociateUserToGov()
  const { mutateAsync: addRole } = useAddRole() // 👈 hook إضافة الدور

  const handleSubmit = async () => {
    if (!partyId) return alert("يرجى اختيار الجهة المعنية")

    try {
      // 1. ربط المستخدم بالجهة
      await associateUser({ userId, govId: partyId })

      // 2. إضافة الدور ROLE_GOV
      await addRole({ userId, role: "ROLE_GOV" })

      // 3. إغلاق النافذة وتحديث البيانات
      onClose()
      window.location.reload()
    } catch (err) {
      console.error("فشل في ربط المستخدم أو إضافة الدور:", err)
      alert("حدث خطأ أثناء الربط")
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-full">
        <DialogHeader className="flex flex-row-reverse">
          <DialogTitle>تحديد الجهة المعنية</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <MinistriesSelect
            value=""
            setMinistry={(_, id) => {
              setMinistryId(id)
              setPartyId(null)
            }}
          />

          {ministryId && (
            <ConcernedPartySelect
              ministryId={ministryId}
              value={partyId?.toString()}
              setConcernedParty={(_, id) => setPartyId(id)}
            />
          )}

          <Button disabled={isLoading} onClick={handleSubmit}>
            تأكيد الربط
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
