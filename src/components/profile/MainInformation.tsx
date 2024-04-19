import {
  Card,
  CardHeader,
  Divider,
  CardBody,
  Button,
  Input,
  Accordion,
  AccordionItem,
  DateInput,
  DatePicker,
} from "@nextui-org/react"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useState } from "react"
import * as Yup from "yup"
import { Controller, useForm } from "react-hook-form"
import { MainInformationFormInputProps } from "./types"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "@blitzjs/rpc"
import updateProfile from "./mutations/updateProfile"
import { MainInformationFormButtons } from "./MainInformationFormButtons"
import {
  CalendarDate,
  getLocalTimeZone,
  parseAbsolute,
  parseDate,
  parseDateTime,
  today,
} from "@internationalized/date"
import { format } from "date-fns"

export const MainInformation = () => {
  const currentUser = useCurrentUser()
  const [isEditing, setIsEditing] = useState(false)
  const [updateProfileMutation, { isSuccess }] = useMutation(updateProfile)

  const signupSchema = Yup.object()
    .shape({
      firstName: Yup.string().min(2, "Too Short").max(50, "Too Long").required("Required"),
      lastName: Yup.string().min(2, "Too Short").max(50, "Too Long").required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
    })
    .required()

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<MainInformationFormInputProps>({
    mode: "onSubmit",
    defaultValues: {
      firstName: currentUser?.name ?? "",
      lastName: currentUser?.lastName ?? "",
      email: currentUser?.email ?? "",
      phone: currentUser?.phone ?? "",
      dateOfBirth: currentUser?.dateOfBirth
        ? parseDate(format(currentUser?.dateOfBirth, "yyyy-MM-dd"))
        : null,
    },
    resolver: yupResolver(signupSchema),
  })

  const { firstName, lastName, email, phone, dateOfBirth } = watch()

  const onSubmit = async () => {
    const success = await updateProfileMutation({
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth: dateOfBirth?.toDate(getLocalTimeZone()),
    })

    if (success) {
      setIsEditing(false)
    }
  }

  return (
    <div className="my-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="max-w-[800px]">
          <CardHeader>
            <div className="flex gap-3 items-center justify-between w-full">
              <div>
                <p className="text-md">Main information</p>
              </div>
              <div>
                <MainInformationFormButtons isEditing={isEditing} setIsEditing={setIsEditing} />
              </div>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="grid grid-cols-2">
              <div className="flex gap-3 flex-col w-full">
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      size="md"
                      type="firstName"
                      className="w-3/5"
                      variant="bordered"
                      label="Name"
                      labelPlacement="outside"
                      placeholder="Enter first name"
                      isDisabled={!isEditing}
                      isClearable={isEditing}
                      onClear={isEditing ? () => setValue("firstName", "") : undefined}
                      isInvalid={!!errors.firstName}
                      errorMessage={errors.firstName?.message}
                    />
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      size="md"
                      type="lastName"
                      className="w-3/5"
                      variant="bordered"
                      label="Last name"
                      labelPlacement="outside"
                      placeholder="Enter last name"
                      isDisabled={!isEditing}
                      isClearable={isEditing}
                      onClear={isEditing ? () => setValue("lastName", "") : undefined}
                      isInvalid={!!errors.lastName}
                      errorMessage={errors.lastName?.message}
                    />
                  )}
                />
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      size="md"
                      className="w-3/5"
                      variant="bordered"
                      label="Date of birth"
                      placeholder="Enter date of birth"
                      labelPlacement="outside"
                      hideTimeZone
                      showMonthAndYearPickers
                      isDisabled={!isEditing}
                      isInvalid={!!errors.dateOfBirth}
                      errorMessage={errors.dateOfBirth?.message}
                    />
                  )}
                />

                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      size="md"
                      type="phone"
                      className="w-3/5"
                      variant="bordered"
                      label="Phone"
                      labelPlacement="outside"
                      placeholder="Enter phone"
                      isDisabled={!isEditing}
                      isClearable={isEditing}
                      onClear={isEditing ? () => setValue("phone", "") : undefined}
                      isInvalid={!!errors.phone}
                      errorMessage={errors.phone?.message}
                    />
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      size="md"
                      type="email"
                      className="w-3/5"
                      variant="bordered"
                      label="Email"
                      labelPlacement="outside"
                      placeholder="Enter email"
                      isDisabled={!isEditing}
                      isClearable={isEditing}
                      onClear={isEditing ? () => setValue("email", "") : undefined}
                      isInvalid={!!errors.email}
                      errorMessage={errors.email?.message}
                    />
                  )}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  )
}
