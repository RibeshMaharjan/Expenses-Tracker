import {InputField, MyForm} from "../form.jsx";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import * as z from "zod";

const AddBankSchema = z.object({
  account_no: z
    .number({
      required_error: "Account number is required",
      invalid_type_error: "Account number must be a number",
    })
    .min(1, { message: "Account Holder Name is required" })
    .positive(),
  account_holder_no: z
    .string({
      required_error: "Account Holder Name is required",
    })
    .min(1, { message: "Account Holder Name is required" }),
  bank_name: z
    .string({
      required_error: "Bank Name is required",
    })
    .min(1, { message: "Bank Name is required" }),
  balance: z
    .number({
      required_error: "Balance is required",
      invalid_type_error: "Balance must be a number",
    })
    .positive(),
})

const Model = () => {
  const [loading, setLoading] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(AddBankSchema),
  })

  const addBankHandler = async (formData) => {
    setLoading(true);
    try {

    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/*<button className='block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800' type='button'>Toggle Model</button>*/}
      <div id='addBank-model' tabIndex='-1' className='hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-evenly items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full'>
        <div className='relative p-4 w-full max-w-md max-h-full'>
        {/*  Form Start */}
          <div className='relative bg-white rounded-lg shadow-sm dark:bg-gray-700'>
          {/*  Header */}
            <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200'>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                Add Your Bank Account
              </h3>
              <button
                type='button'
                className='end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
                data-modal-hide={'addBank-model'}
              >
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
              </button>
            </div>
            {/*  Body */}
            <div className="p-4 md:p-5">
              <MyForm onSubmit={handleSubmit(addBankHandler)}>
                <InputField
                  loading={loading}
                  id='account_no'
                  label='Account No'
                  type='text'
                  className=''
                  placeholder='Enter you Account Number'
                  error={errors.account_no?.message}
                  {...register("account_no")}
                />
                <InputField
                  loading={loading}
                  id='account_holder_name'
                  label='Account Holder Name'
                  type='text'
                  className=''
                  placeholder='Enter the Account Holder Name'
                  error={errors.account_holder_no?.message}
                  {...register("account_holder_name")}
                />
                <InputField
                  loading={loading}
                  id='bank_name'
                  label='Bank Name'
                  type='text'
                  className=''
                  placeholder='Enter the Bank Bame'
                  error={errors.bank_name?.message}
                  {...register("bank_name")}
                />
                <InputField
                  loading={loading}
                  id='balance'
                  label='Balance'
                  type='text'
                  className=''
                  placeholder='Enter Amount'
                  error={errors.balance?.message}
                  {...register("balance")}
                />
              </MyForm>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Model;
