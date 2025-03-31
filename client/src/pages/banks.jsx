import Panel from "../components/panel/Panel.jsx";
import PanelHeader, {MainHeaderContent, SubHeaderContent} from "../components/panel/PanelHeader.jsx";
import BankCard from "../components/mybanks/BankCard.jsx";
import {useBankContent} from "../context/BankContext.jsx";
import {FormButton, InputField, MyForm, SelectInput, TimeField} from "../components/form.jsx";
import Loader from "../components/ui/loader.jsx";
import Dialog from "../components/ui/Dialog.jsx";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import * as z from "zod";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import axios from "axios";
import {toast} from "sonner";
import {Navigate} from "react-router-dom";
import {zodResolver} from "@hookform/resolvers/zod";
import PageLoader from "../components/ui/PageLoader.jsx";
import bankTransaction from "./bankTransaction.jsx";
import {useUserContext} from "@/context/UserContext.jsx";

const transactionType =[
  'income',
  'expense',
]

const AddTransactionSchema = z
  .object({
    description: z
      .string()
      .trim(),
    transaction_amount: z
      .string()
      .transform(val => parseFloat(val))
      .refine(val => !isNaN(val), { message: "Amount must be a number" })
      .refine(val => val >= 0, { message: "Amount must be positive" })
      .refine(val => val !== 0, { message: "Amount must be positive" }),
    bank_account_id: z
      .string()
      .transform(val => parseInt(val))
      .refine(val => !isNaN(val), { message: "Invalid bank_id type" }),
    transaction_type: z
      .string()
      .min(1, { message: "Transaction Type is required" }),
    category_id: z
      .string()
      .transform(val => parseInt(val))
      .refine(val => !isNaN(val), { message: "Invalid category type" }),
    transaction_date: z
      .string()
      .refine(date => new Date(date).toString() !== 'Invalid Date', { message: "A valid date is required" })
      .transform(date => new Date(date)),
    transaction_time: z
      .string()
      .refine((val) => {
          const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Regex for HH:MM
          return timeRegex.test(val);
        },
        {
          message: 'Invalid time format',
        }
      )
  });

const Bank = () => {
  const { user } = useUserContext();
  const { loading, banks, getBankAccountsAndTransactions } = useBankContent();
  const [isSubmitting, setIsSubmitting] = useState();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(AddTransactionSchema),
  });

  useEffect( () => {
    const getTransactionCategory = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/transaction/category`,
          {
            withCredentials: true,
          },
        )
        setCategory(response.data.data);
      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
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
      }
    }
    getTransactionCategory();
  }, []);

  const addTransactionHandler = async (formData) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/transaction`,
        formData,
        {
          withCredentials: true,
        },
      )

      if(response.status !== 201) {
        toast.error(response.data.message);
      }

      await getBankAccountsAndTransactions();
      toast.success(response.data.message);
      setOpen(false);
      reset();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
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
      setIsSubmitting(false);
    }
  }

  const bankName = banks.map(bank => {
    return {
      id: bank.id,
      name: bank.bank_name,
    }
  });

  const categoryName = category.map(category => {
    return {
      id: category.id,
      name: category.name,
    }
  });

  if(loading) return (
    <div className={`mx-auto`}>
      <PageLoader />
    </div>
  );

  return (
    <>
      <Panel>
        <div className={`flex`}>
          <PanelHeader>
            <MainHeaderContent>
              My Bank Accounts
            </MainHeaderContent>
            <SubHeaderContent>
              <p className="text-gray-600">
                Effortlessly manager your banking activities.
              </p>
            </SubHeaderContent>
          </PanelHeader>
          <div className={`ms-auto`}>
            <button onClick={() => setOpen(true)} type='button' className="h-fit px-1 py-1.5 text-green-600 text-base/6 font-bold rounded-md hover:bg-green-200">
              <AddOutlinedIcon sx={{ fontSize: 20 }} />
              <span  className="ms-1">Add Transaction</span>
            </button>
          </div>
        </div>
        <section className="w-full" id="bank-cards-section">
          <div
            className="flex justify-between mb-2"
            id="transaction-section-header"
          >
            <h1 className="text-2xl font-bold">Banks</h1>
          </div>
          {
            banks.length <= 0 ?
              (
              <div>
            <h1>No Banks</h1>
            </div>
            )
            : (
              <div className="py-2.5">
                {
                  banks.map((bank, index) => <BankCard key={index} bank={bank} />)
                }
              </div>
            )
          }
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            title={`Add your Transaction`}>
            <MyForm onSubmit={handleSubmit(addTransactionHandler)}>
              <InputField
                loading={isSubmitting}
                id='description'
                label='Description'
                type='textarea'
                className=''
                placeholder='Description'
                error={errors.description?.message}
                {...register("description")}
              />
              <InputField
                loading={isSubmitting}
                id='transaction_amount'
                label='Transaction Amount'
                type='number'
                className=''
                placeholder='Enter your amount'
                error={errors.transaction_amount?.message}
                {...register("transaction_amount")}
              />
              <SelectInput
                loading={isSubmitting}
                id='bank_account_id'
                label='Bank'
                className=''
                options={bankName}
                error={errors.bank_account_id?.message}
                {...register("bank_account_id")}
              />
              <SelectInput
                loading={isSubmitting}
                id='transaction_type'
                label='Transaction Type'
                className=''
                options={[
                  {
                    id: "income",
                    name: 'income',
                  },
                  {
                    id: "expense",
                    name: 'expense',
                  },
                ]}
                error={errors.transaction_type?.message}
                {...register("transaction_type")}
              /> <SelectInput
                loading={isSubmitting}
                id='category_id'
                label='Category'
                className=''
                options={categoryName}
                error={errors.category_id?.message}
                {...register("category_id")}
              />
              <InputField
                loading={isSubmitting}
                id='transaction_date'
                label='Transaction Date '
                type='date'
                placeholder='Enter the date'
                className=''
                error={errors.transaction_date?.message}
                {...register("transaction_date")}
              />
              <TimeField
                loading={loading}
                id='transactiontime'
                label='Select Time:'
                type='time'
                className=''
                placeholder='Enter time'
                error={errors.transaction_time?.message}
                {...register("transaction_time")}
              />
              <FormButton
                loading={isSubmitting}
                buttonName={
                  isSubmitting ? (
                    <Loader label="Adding" color="white" />
                  ) : (
                    "Add"
                  )
                }
              />
            </MyForm>
          </Dialog>
        </section>
      </Panel>
    </>
  );
};

export default Bank;