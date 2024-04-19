import { Button } from "@nextui-org/react"
import { Check, X, Pencil } from "lucide-react"

interface MainInformationFormButtonsProps {
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
}

export const MainInformationFormButtons: React.FC<MainInformationFormButtonsProps> = ({
  isEditing,
  setIsEditing,
}) => {
  return (
    <>
      {isEditing ? (
        <div className="flex gap-3">
          <Button variant="ghost" color="success" startContent={<Check />} type="submit">
            Save
          </Button>
          <Button
            variant="ghost"
            color="danger"
            startContent={<X />}
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button variant="ghost" startContent={<Pencil />} onClick={() => setIsEditing(true)}>
          Edit
        </Button>
      )}
    </>
  )
}
