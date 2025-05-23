import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
const ResetPasswordSchema = z
  .object({
    password: z
      .string() // check if it is string type
      .min(8, { message: "Password must be at least 8 characters long" }) // checks for character length
      .max(20, { message: "Password must be at most 20 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(20, { message: "Password must be at most 20 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],

    // checks if the password and confirm password are equal
  });
const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // useSearchParams to get the token

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    if (!token) {
      setError("Invalid or missing reset token"); // Error handling for when the token doesn't exist
      return;
    }

    try {
      await authClient.resetPassword(
        {
          newPassword: values.password,
          token: token, // passing in the token along with the new password
        },
        {
          onResponse: () => {
            setLoading(false);
          },
          onRequest: () => {
            //  resetState();
            setLoading(true);
          },
          onSuccess: () => {
            setSuccess("New password has been created");
            router.replace("/sign-in");
          },
          onError: (ctx) => {
            setError(ctx.error.message);
          },
        }
      );
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  };
  return (
    <Card className="mt-8 sm:mx-auto sm:w-full sm:max-w-md ">
      <CardTitle className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Réinitialiser le mot de passe
      </CardTitle>

      <Form {...form}>
        <form className="space-y-6 mt-2" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    type="password"
                    placeholder="************"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700">
                  Confirme Mot de passe
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    type="password"
                    placeholder="*************"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <FormMessage>{error}</FormMessage>}
          <Button type="submit" className="w-full" disabled={loading}>
            Submit
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default ResetPassword;
