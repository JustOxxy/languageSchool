import { DateValue } from "@nextui-org/react"

export interface MainInformationFormInputProps {
  email: string
  firstName: string
  lastName: string
  phone?: string
  dateOfBirth?: DateValue | null
}

export interface CredentialsFormInputProps {
  email: string
  newPassword?: string
  newConfirmedPassword?: string
}
