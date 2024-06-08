import { LabeledTextField } from "src/core/components/LabeledTextField";
import { Form, FORM_ERROR } from "src/core/components/Form";
import signup from "src/auth/mutations/signup";
import { Signup } from "src/auth/schemas";
import { useMutation } from "@blitzjs/rpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { Routes } from "@blitzjs/next";
import { Card, CardHeader, CardBody, Checkbox, Button, Input, Link } from "@nextui-org/react";

type SignupFormProps = {
  onSuccess?: () => void;
};

type SignupFormSchema = z.infer<typeof Signup>;

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup);

  const { handleSubmit, control, watch, reset, setValue } = useForm<SignupFormSchema>({
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(Signup),
  });

  const loginFormSubmit = async (values: SignupFormSchema) => {
    try {
      await signupMutation(values);
      props.onSuccess?.();
    } catch (error: any) {
      if (error.code === "P2002" && error.meta?.target?.includes("email")) {
        // This error comes from Prisma
        return { email: "This email is already being used" };
      } else {
        return { [FORM_ERROR]: error.toString() };
      }
    }
  };

  return (
    <div className="flex justify-center mt-12">
      <form onSubmit={handleSubmit(loginFormSubmit)}>
        <Card className="w-[400px]">
          <CardHeader className="flex justify-center">Create an account</CardHeader>
          <CardBody className="gap-3">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  isRequired
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  isRequired
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                />
              )}
            />

            <Button color="primary" variant="flat" type="submit">
              Sign up
            </Button>
          </CardBody>
        </Card>
      </form>
    </div>
  );
};

export default SignupForm;
