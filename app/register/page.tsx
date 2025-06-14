"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { registerSchema } from "@/zod-schemas/auth";
import { getProfileApi, loginApi, registerApi } from "@/lib/api/authApi";
import { setProfile, setRole, setToken } from "@/lib/auth";

import { toast } from "react-toastify";

import { LabeledInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import ImageLogo from "@/public/logo.svg";

type FormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await registerApi(data);
      const res = await loginApi({
        username: data.username,
        password: data.password,
      });
      setToken(res.token);
      const user = await getProfileApi();
      setProfile(JSON.stringify(user));
      setRole(res.role);
      router.push("/articles");
      toast.success("Register Succressfully!!");
    } catch (error) {
      console.log(error);
      toast.error("Gagal Register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:bg-[#f3f4f6] w-screen h-screen flex justify-center items-center">
      <Card className="w-full md:max-w-sm h-full md:h-auto flex justify-center">
        <CardHeader>
          <CardTitle className="justify-center flex">
            <Image src={ImageLogo} alt="Logo" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5 mb-5">
              <Controller
                control={control}
                name="username"
                render={({ field }) => (
                  <LabeledInput
                    label="Username"
                    placeholder="Masukkan Username"
                    {...field}
                    {...register("username")}
                    error={errors.username?.message}
                    size="xl"
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <LabeledInput
                    label="Password"
                    type="password"
                    placeholder="Masukkan password"
                    {...field}
                    {...register("password")}
                    error={errors.password?.message}
                    size="xl"
                  />
                )}
              />

              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Role
                    </label>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger size="lg">
                        <SelectValue placeholder="Pilih role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="User">User</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.role.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white rounded-md py-2"
            >
              {loading ? "Loading..." : "Register"}
            </Button>

            <div className="w-full flex justify-center mt-5">
              <p>
                Already have an account?{" "}
                <a href="/login" className=" text-[#408bff] cursor-pointer">
                  Login
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
