"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "./ui/textarea";
import Image from "next/image";
import profilePic from "@/assets/images/EQFKL_logo.jpg";
import { Button } from "./ui/button";

type Props = {
  userDetails: {
    name: string;
    id: string;
    email: string;
    emailVerified: Date | null;
    password: string | null;
    createdAt: Date;
    updatedAt: Date;
    profilePic: string | null;
    bio: string | null;
  };
};

export default function ProfileEditForm({ userDetails }: Props) {
  //TODO: Call user details API
  //TODO: Change to edit profile form

  const formSchema = z.object({
    name: z.string(),
    email: z.string(),
    bio: z.string().optional(),
    // profilePic: BasicPhotoSchema,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userDetails?.name || "",
      email: userDetails?.email || "",
      bio: userDetails?.bio || "",

      // profilePic: undefined,
    },
  });
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState({
    status: "",
    message: "",
  });

  // const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
  //   setLoginData({
  //     ...loginData,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append("name", data.name);
    //TODO: Add profilePic flag

    try {
      const res = await signIn("credentials", {
        ...loginData,
        redirect: false,
      });
      setAlert({ status: "success", message: "Logged in successfully" });
      setLoginData({ email: "", password: "" });

      if (res?.error) {
        setAlert({ status: "error", message: "Invalid email or password" });
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.log({ error });
      setAlert({ status: "error", message: "Network error. Please try again" });
    }
  };
  return (
    <React.Fragment>
      {alert.message && (
        <Alert
          variant={`${alert.status === "success" ? "default" : "destructive"}`}
        >
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Edit Profile
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="col-span-1 flex flex-col items-center justify-center">
                <Image
                  width={100}
                  height={100}
                  alt="profile-pic"
                  src={profilePic}
                  className="rounded-full mb-6"
                />
                <Button variant="outline">Change Photo</Button>
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Button
                  type="submit"
                  className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Save Profile
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </React.Fragment>
  );
}
