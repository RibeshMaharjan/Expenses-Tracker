import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import { Form, FormButton, InputField } from "../../components/form.jsx";
import Loader from "../../components/ui/loader.jsx";

const RegisterSchema = z
  .object({
    fullname: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .trim()
      .min(1, { message: "Name is required" }),
    username: z
      .string({
        required_error: "Username is required",
      })
      .min(5, { message: "Must be 5 or more characters long" })
      .max(25, { message: "Must be 25 or fewer characters long" }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be atleast 8 character" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const SignUp = () => {
  const [user, setUser] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
  });

  const nagivate = useNavigate();

  useEffect(() => {
    user && nagivate("/");
  }, [user]);

  const delay = (time) => {
    return new Promise((resovle, reject) => {
      setTimeout(() => {
        resovle();
      }, time * 1000);
    });
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    await delay(2);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/signup",
        formData
      );

      if (response.status !== 201) {
        toast.error(response.data.message);
      }

      toast.success(response.data.message);
      setLoading(false);

      setTimeout(() => {
        nagivate("/sign-in");
      }, 1500);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-16 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="font-bold text-4xl text-center">Expenses Tracker</h1>
          <h2 className="mt-10 font-poppins text-center text-3xl font-semibold">
            Sign Up
          </h2>
          <p className="mt-2 text-center text-sm tracking-tight text-gray-800">
            Please enter your details
          </p>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <InputField
              loading={loading}
              id="fullname"
              label="Full Name"
              type="text"
              placeholder="ex: John Doe"
              className=""
              error={errors.fullname?.message}
              {...register("fullname")}
            ></InputField>
            <InputField
              loading={loading}
              id="username"
              label="Username"
              type="text"
              placeholder="ex: john_doe1 Doe"
              className=""
              error={errors.username?.message}
              {...register("username")}
            ></InputField>
            <InputField
              loading={loading}
              id="email"
              label="Email"
              type="email"
              placeholder="ex: example@gmail.com"
              className=""
              error={errors.email?.message}
              {...register("email")}
            ></InputField>
            <InputField
              loading={loading}
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              className=""
              error={errors.password?.message}
              {...register("password")}
            ></InputField>
            <InputField
              loading={loading}
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Enter your confirm password"
              className=""
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            ></InputField>

            <FormButton
              loading={loading}
              buttonName={
                loading ? (
                  <Loader label="Signing Up" color="white" />
                ) : (
                  "Sign Up"
                )
              }
            />
          </Form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="font-semibold text-green-600 hover:text-green-500"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
