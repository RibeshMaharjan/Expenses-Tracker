import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import { FormButton, InputField, MyForm } from "../../components/form.jsx";
import Loader from "../../components/ui/loader.jsx";
import { useUserContext } from "../../context/UserContext.jsx";

const SigninSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .min(1, { message: "Email is required" })
    .email({
      message: "Invalid email address",
    }),
  password: z.string().min(1, { message: "Password is required" }),
});

const SignIn = () => {
  // const [user, setUser] = useState();
  // const [authToken, setAuthToken] = useState(GetCookie("authToken") || null);
  // const [isLoggedIn, setIsLoggedIn] = useState();
  // const SERVER_URL = process.env.REACT_APP_SERVER_URL;

  const { user, addUser } = useUserContext();
  const [loading, setLoading] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SigninSchema),
  });

  const navigate = useNavigate();

  useEffect(() => {
    user && navigate("/dashboard");
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
        `${import.meta.env.VITE_SERVER_URL}/auth/signin`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.status !== 200) {
        toast.error(response.data.message);
      }

      const { user, message } = await response.data;

      toast.success(message);
      addUser(user);
      navigate("/dashboard");
      console.log("success")
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-16 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h1 className="font-bold text-4xl text-center">Expenses Tracker</h1>
            <h2 className="mt-10 font-poppins text-center text-3xl font-semibold">
              Sign In
            </h2>
            <p className="mt-2 text-center text-sm tracking-tight text-gray-800">
              Welcome back! Please enter your details.
            </p>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <MyForm onSubmit={handleSubmit(onSubmit)}>
              <InputField
                loading={loading}
                id="email"
                label="Email"
                type="email"
                placeholder="ex: example@gmail.com"
                className=""
                error={errors.email?.message}
                {...register("email")}
              />
              <InputField
                loading={loading}
                id="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                className=""
                error={errors.password?.message}
                {...register("password")}
              />
              <FormButton
                loading={loading}
                buttonName={
                  loading ? (
                    <Loader label="Signing In" color="white" />
                  ) : (
                    "Sign In"
                  )
                }
              />
            </MyForm>
            {/* <form className="space-y-6">
              <div className="">
                <label htmlFor="email" className="block text-sm/6 font-medium">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    placeholder="ex: example@gmail.com"
                    className="block w-full rounded-md px-3 py-1.5 text-base font-bold text-gray-900 outline outline-2 -outline-offset-1 outline-gray-300 placeholder:text-gray-500  focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    placeholder="Enter your password"
                    className="block w-full rounded-md px-3 py-1.5 text-base font-bold text-gray-900 outline outline-2 -outline-offset-1 outline-gray-300 placeholder:text-gray-500  focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <div>
                <Button
                  className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm/6 font-bold text-white shadow-md hover:bg-green-500 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-green-800"
                  onClick={handleForm}
                >
                  Sign In
                </Button>
              </div>
            </form> */}

            <p className="mt-10 text-center text-sm/6 text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/sign-up"
                className="font-semibold text-green-600 hover:text-green-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </>
    </>
  );
};

export default SignIn;
