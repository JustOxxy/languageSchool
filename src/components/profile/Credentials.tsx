import { Card, CardHeader, Divider, CardBody, Button, Input } from "@nextui-org/react";
import { useCurrentUser } from "src/users/hooks/useCurrentUser";
import { Pencil, Check, X } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { CredentialsFormInputProps, MainInformationFormInputProps } from "./types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@blitzjs/rpc";
import updateProfile from "./mutations/updateProfile";

export const Credentials = () => {
  const currentUser = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [updateProfileMutation, { isSuccess }] = useMutation(updateProfile);

  const signupSchema = Yup.object()
    .shape({
      email: Yup.string().email("Invalid email").required("Required"),
    })
    .required();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<CredentialsFormInputProps>({
    mode: "onSubmit",
    defaultValues: {
      newPassword: "",
      newConfirmedPassword: "",
      email: currentUser?.email ?? "",
    },
    resolver: yupResolver(signupSchema),
  });

  const { firstName, lastName, email, phone, dateOfBirth } = watch();

  const onSubmit = async () => {
    await updateProfileMutation({
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
    });

    if (isSuccess) {
      setIsEditing(false);
    }
  };

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
                  <Button
                    variant="ghost"
                    startContent={<Pencil />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="grid grid-cols-2">
              <div className="">
                <div className="flex justify-between pb-2">
                  <label>Name</label>
                  {isEditing ? (
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          size="sm"
                          type="firstName"
                          className="w-3/5"
                          variant="bordered"
                          isClearable
                          onClear={() => setValue("firstName", "")}
                          isInvalid={!!errors.firstName}
                          errorMessage={errors.firstName?.message}
                          {...field}
                        />
                      )}
                    />
                  ) : (
                    <p>{currentUser?.name}</p>
                  )}
                </div>
                <div className="flex justify-between pb-2">
                  <label>LastName</label>
                  {isEditing ? (
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          size="sm"
                          type="lastName"
                          className="w-3/5"
                          variant="bordered"
                          isClearable
                          onClear={() => setValue("lastName", "")}
                          isInvalid={!!errors.lastName}
                          errorMessage={errors.lastName?.message}
                          {...field}
                        />
                      )}
                    />
                  ) : (
                    <p>{currentUser?.lastName}</p>
                  )}
                </div>
                <div className="flex justify-between pb-2">
                  <label>Date of birth</label>
                  {/* {isEditing ? (
                    <Controller
                      name="dateOfBirth"
                      control={control}
                      render={({ field }) => (
                        <Input
                          size="sm"
                          type="dateOfBirth"
                          className="w-3/5"
                          variant="bordered"
                          isClearable
                          onClear={() => setValue("dateOfBirth", "")}
                          isInvalid={!!errors.dateOfBirth}
                          errorMessage={errors.dateOfBirth?.message}
                          {...field}
                        />
                      )}
                    />
                  ) : (
                    <p>{currentUser?.dateOfBirth?.toDateString()}</p>
                  )} */}
                </div>
                <div className="flex justify-between pb-2">
                  <label>Phone</label>
                  {isEditing ? (
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <Input
                          size="sm"
                          type="phone"
                          className="w-3/5"
                          variant="bordered"
                          isClearable
                          onClear={() => setValue("phone", "")}
                          isInvalid={!!errors.phone}
                          errorMessage={errors.phone?.message}
                          {...field}
                        />
                      )}
                    />
                  ) : (
                    <p>{currentUser?.phone}</p>
                  )}
                </div>
                <div className="flex justify-between pb-2">
                  <label>Email</label>
                  {isEditing ? (
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          size="sm"
                          type="email"
                          className="w-3/5"
                          variant="bordered"
                          isClearable
                          onClear={() => setValue("email", "")}
                          isInvalid={!!errors.email}
                          errorMessage={errors.email?.message}
                          {...field}
                        />
                      )}
                    />
                  ) : (
                    <p>{currentUser?.email}</p>
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  );
};
