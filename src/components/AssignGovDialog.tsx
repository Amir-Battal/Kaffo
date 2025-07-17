import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import MinistriesSelect from "@/components/MinistriesSelect"
import ConcernedPartySelect from "@/components/ConcernedPartySelect"
import { useAssociateUserToGov } from "@/hooks/use-user" // ستضيف هذا hook أدناه

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
  const { mutateAsync, isLoading } = useAssociateUserToGov()

  const handleSubmit = async () => {
    if (!partyId) return alert("يرجى اختيار الجهة المعنية")
    try {
      await mutateAsync({ userId, govId: partyId })
      onClose()
      window.location.reload()
    } catch (err) {
      console.log("ربط المستخدم:", userId, "مع الجهة:", partyId)
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
