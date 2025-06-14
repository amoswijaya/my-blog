"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/zod-schemas/auth";
import { z } from "zod";
import { setProfile, setRole, setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { LabeledInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import { getProfileApi, loginApi } from "@/lib/api/authApi";
import Cookies from "js-cookie";
import Image from "next/image";
import LogoIcon from "@/public/logo.svg";

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await loginApi(data);
      Cookies.set("token", res.token);
      setToken(res.token);
      setRole(res.role);
      const user = await getProfileApi();
      setProfile(JSON.stringify(user));
      router.push("/articles");
      toast.success("Login Successfully");
    } catch (error) {
      toast.error("Invalid username and password");
    }
  };

  return (
    <div className="md:bg-[#f3f4f6] w-screen h-screen flex justify-center items-center">
      <Card className="w-full md:max-w-sm h-full md:h-auto flex justify-center">
        <CardHeader>
          <CardTitle className=" justify-center flex">
            <Image alt="logo" width={134} height={24} src={LogoIcon} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5 mb-5">
              <LabeledInput
                label="Username"
                placeholder="Masukkan username"
                {...register("username", { required: "Username wajib diisi" })}
                error={errors.username?.message}
                size="xl"
              />

              <LabeledInput
                label="Password"
                type="password"
                placeholder="Masukkan password"
                {...register("password", { required: "Password wajib diisi" })}
                error={errors.password?.message}
                size="xl"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-white rounded-md py-2"
            >
              Login
            </Button>
            <div className="w-full flex justify-center mt-5">
              <p>
                Don`t have an account?{" "}
                <a href="/register" className=" text-[#408bff] cursor-pointer">
                  Register
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
