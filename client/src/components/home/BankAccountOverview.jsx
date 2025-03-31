import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {useEffect, useState} from "react";
import {FormButton, InputField, MyForm} from "../form.jsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import * as z from "zod";
import Dialog from "../ui/Dialog.jsx";
import Loader from "../ui/loader.jsx";
import axios from "axios";
import {useBankContent} from "../../context/BankContext.jsx";
import {Navigate} from "react-router-dom";
import AnimatedCounter from "../ui/AnimatedCounter.jsx";
import DoughnutChart from "../ui/DoughnutChart.jsx";
import {useUserContext} from "@/context/UserContext.jsx";

const AddBankSchema = z.object({
  account_no: z
    .string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val), { message: "Account number must be a number" })
    .refine(val => val>=0, { message: "Account number must be positive" })
    .refine(val => val!==0, { message: "Account number must be positive" }),
  account_holder_name: z
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
    .string()
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val), { message: "Balance must be a number" })
    .refine(val => val>=0, { message: "Balance must be positive" })
    .refine(val => val!==0, { message: "Balance must be positive" }),
})

const BankAccountOverview = () => {
  const { user } = useUserContext();
  const { banks } = useBankContent();
  const [totalbanks, setTotalbanks] = useState(banks.length);
  const [totalBalance, setTotalBalance] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(AddBankSchema),
  })

  const addBankHandler = async (formData) => {
    setLoading(true);
    console.log(formData);
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/bankaccount/createaccount`,
        formData,
        {
          withCredentials: true,
        },
      )

      if(response.status !== 201) {
        toast.error(response.data.message);
      }

      toast.success(response.data.message);
      setOpen(false);
      reset();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      setLoading(true);
      if(error.status === 401) {
        const refrehToken = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/auth/token`,
          {
            "id": user.id
          },
          {
            withCredentials: true,
          });
        if(refrehToken.status !== 200) return (
          <Navigate to="sign-in" />
        );
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setTotalbanks(banks.length);
    if(totalbanks > 0) {
      setTotalBalance(banks.reduce((totalBankBalance, currBank) => {
        return totalBankBalance + parseFloat(currBank.balance);
      }, 0));
    }
  }, [banks]);

  return (
    <>
      <div
        className="flex flex-col lg:flex-row mb-4 border border-1 rounded-md shadow-sm px-3 py-3"
        id="bank-account-overview-section"
      >
        <div className="w-full lg:w-32 mb-4 lg:mb-0" id="balance-graph">
          {/*<span className="text-center">Circle Graph</span>*/}
          <DoughnutChart banks={banks} />
        </div>
        <div className="flex ml-0 lg:ml-4 w-full" id="bank-account-overview">
          <div className="flex-grow text-lg font-bold" id="bank-account-counts">
            <span className={``} >{totalbanks} Bank Accounts</span>
            <div className="mt-4" id="bank-account-total-amount">
              <span className="text-base text-gray-600">Total Balance</span>
              <div className="text-2xl font-extrabold" id="bank-account-balance">
                <AnimatedCounter amount={totalBalance} />
              </div>
            </div>
          </div>

          <Dialog open={open} onClose={() => setOpen(false)} title={`Add Your Bank Account`}>
            <MyForm onSubmit={handleSubmit(addBankHandler)}>
              <InputField
                loading={loading}
                id='account_no'
                label='Account No'
                type='number'
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
                type='number'
                className=''
                placeholder='Enter Amount'
                error={errors.balance?.message}
                {...register("balance")}
              />
              <FormButton
                loading={loading}
                buttonName={
                  loading ? (
                    <Loader label="Adding" color="white" />
                  ) : (
                    "Add"
                  )
                }
              />
            </MyForm>
          </Dialog>

          <button onClick={() => setOpen(true)} type='button' className="h-fit px-1 py-1.5 text-green-600 text-base/6 font-bold rounded-md hover:bg-green-200">
            <AddOutlinedIcon sx={{ fontSize: 20 }} />
            <span  className="ms-1">Add Bank</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default BankAccountOverview;