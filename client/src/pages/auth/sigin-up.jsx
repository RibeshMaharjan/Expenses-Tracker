import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/button.jsx";

const SignUp = () => {
  const handleForm = (e) => {
    e.preventDefault();
    console.log("Button was clicked!");
  };

  return (
    <>
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
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="fullname"
                  className="block text-sm/6 font-medium"
                >
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="fullname"
                    id="fullname"
                    required
                    placeholder="ex: John Doe"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base font-bold text-black outline outline-2 -outline-offset-1 outline-gray-300 placeholder:text-gray-500  focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="">
                <label
                  htmlFor="username"
                  className="block text-sm/6 font-medium"
                >
                  Username
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    required
                    placeholder="ex: john_doe1"
                    className="block w-full rounded-md px-3 py-1.5 text-base font-bold text-gray-900 outline outline-2 -outline-offset-1 outline-gray-300 placeholder:text-gray-500  focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
                  />
                </div>
              </div>
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
              <div className="">
                <label
                  htmlFor="confirmpassword"
                  className="block text-sm/6 font-medium"
                >
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="confirmpassword"
                    id="confirmpassword"
                    required
                    placeholder="Enter your confirm password"
                    className="block w-full rounded-md px-3 py-1.5 text-base font-bold text-gray-900 outline outline-2 -outline-offset-1 outline-gray-300 placeholder:text-gray-500  focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <div>
                <Button
                  className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm/6 font-bold text-white shadow-md hover:bg-green-500 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-green-800"
                  onClick={handleForm}
                >
                  Sign Up
                </Button>
              </div>
            </form>

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
    </>
  );
};

export default SignUp;
