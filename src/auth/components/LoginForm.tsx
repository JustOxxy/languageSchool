import { AuthenticationError, PromiseReturnType } from "blitz";

import { zodResolver } from "@hookform/resolvers/zod";
import { FORM_ERROR } from "src/core/components/Form";
import login from "src/auth/mutations/login";
import { Login } from "../schemas";
import { useMutation } from "@blitzjs/rpc";
import { Routes } from "@blitzjs/next";
import { Card, Checkbox, Button, CardHeader, CardBody, Input, Link } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void;
};

type LoginFormSchema = z.infer<typeof Login>;

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login);

  const { handleSubmit, control, watch, reset, setValue } = useForm<LoginFormSchema>({
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(Login),
  });

  const loginFormSubmit = async (values: LoginFormSchema) => {
    try {
      const user = await loginMutation(values);
      props.onSuccess?.(user);
      reset({ email: "", password: "" });
    } catch (error: any) {
      if (error instanceof AuthenticationError) {
        return { [FORM_ERROR]: "Sorry, those credentials are invalid" };
      } else {
        return {
          [FORM_ERROR]:
            "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
        };
      }
    }
  };

  return (
    <div className="flex justify-center mt-12">
      <form onSubmit={handleSubmit(loginFormSubmit)}>
        <Card className="w-[400px]">
          <CardHeader className="flex justify-center">Login</CardHeader>
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

            <div className="flex justify-between">
              <Checkbox>Remember me</Checkbox>
              <Link href={Routes.ForgotPasswordPage().href}>Forgot your password?</Link>
            </div>

            <Button color="primary" variant="flat" type="submit">
              Sign in
            </Button>
          </CardBody>
        </Card>
      </form>
    </div>
  );
};

export default LoginForm;
