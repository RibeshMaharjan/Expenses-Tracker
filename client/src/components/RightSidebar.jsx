import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import Button from "./button";
import {useUserContext} from "../context/UserContext.jsx";
import { Progress } from "@/components/ui/progress"
import { topCategoryStyles } from "@/constants";
import {FormButton, InputField, MyForm} from "@/components/form.jsx";
import Loader from "@/components/ui/loader.jsx";
import Dialog from "@/components/ui/Dialog.jsx";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {useState} from "react";
import axios from "axios";
import {Navigate} from "react-router-dom";
import {toast} from "sonner";

const AddCategorySchema = z
  .object({
    category: z
      .string()
      .trim()
      .min(1, { message: "Category cannot be empty." })
  });

const RightSidebar = ({ banks, transactions }) => {
  const { user } = useUserContext();
  const [openCategory, setOpenCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  let wholeSpending = 0;
  
  const {
     register,
     handleSubmit,
     formState: { errors },
     reset,
   } = useForm({
     resolver: zodResolver(AddCategorySchema),
   });
  
  const addCategoryHandler = async (formData) => {
      setIsSubmitting(true);
  
      try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/transaction/category`,
          formData,
          {
            withCredentials: true,
          },
        )
  
        if(response.status !== 200) {
          toast.error(response.data.message);
        }
  
        // await getBankAccountsAndTransactions();
        toast.success(response.data.message);
        setOpenCategory(false);
        reset();
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
        if(error.status === 401) {
          const refrehToken = await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/api/auth/token`,
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

  const getExpenses = (transactions) => {
    const categoryBalance = transactions?.reduce((newArray, transaction) => {
      if(transaction.transaction_type !== 'expense') {
        return newArray;
      }
      wholeSpending += parseFloat(transaction.transaction_amount);
      const categoryExist = newArray.find(item => item.name === transaction.category);

      if(categoryExist) {
        categoryExist.totalExpenses += parseFloat(transaction.transaction_amount);
      } else {
        newArray.push({
          id: transaction.category_id,
          name: transaction.category,
          totalExpenses: parseFloat(transaction.transaction_amount),
        })
      }
      return newArray;
    }, []);

    return categoryBalance;
  }

  const expenses = getExpenses(transactions);

  return (
    <aside className="right-sidebar no-scrollbar">
      <section className="flex flex-col">
        <div className="profile-banner"></div>
        <div className="profile">
          <div className="profile-img">
            <span>{ user.initials }</span>
          </div>
          <div className="profile-details">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
      </section>

      <section className="banks border-b-2">
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="header-2">
            <PaidOutlinedIcon className="mr-2" />
            My Banks
          </h2>
        </div>
        {banks?.length > 0 && (
          <div className="w-full">
            <ul className="">
              {banks?.map((bank, index) => (
                <BankItem key={index} bank={bank} />
              ))}
            </ul>
          </div>
        )}
      </section>
      <section className="expense">
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="header-2">
            <MoneyOffIcon className="mr-2" />
            My Expenses
          </h2>
          <Button
            className="px-1 float-end text-green-600 text-sm/6 font-bold rounded-md hover:bg-green-200"
            onClick={() => setOpenCategory(true)}
          >
            <AddOutlinedIcon sx={{ fontSize: 18 }} />
            <span className="ms-1">Add Categories</span>
          </Button>
        </div>
        {expenses?.length > 0 && (
          <div className="w-full">
            <ul className="">
              {expenses?.map((expense, index) => (
                <ExpenseItem
                  key={index}
                  category={expense}
                  allExpenses={wholeSpending}
                />
              ))}
            </ul>
          </div>
        )}
        <Dialog
          open={openCategory}
          onClose={() => setOpenCategory(false)}
          title={`Add your Transaction`}>
          <MyForm onSubmit={handleSubmit(addCategoryHandler)}>
            <InputField
              loading={isSubmitting}
              id='category'
              label='Category'
              type='text'
              className=''
              placeholder='Category'
              error={errors.category?.message}
              {...register("category")}
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
    </aside>
  );
};

export const BankItem = ({ bank }) => {
  return (
    <li className="flex px-4 py-3 bg-green-100 mb-3 text-base/8 rounded-md font-semibold text-green-800">
      <div
        className="bg-green-500 w-12 h-12 me-4 rounded-full flex justify-center items-center text-white text-base font-extrabold"
        id="bank-account-profile"
      >
        {bank.initials}
      </div>
      <div className="flex-grow">
        {bank.bank_name}
        <p className={`px-2 text-sm bg-green-300 w-fit rounded-full`}>{bank.bank_account_type}</p>
      </div>
      <span>{bank.balance}</span>
    </li>
  );
};

export const ExpenseItem = ({ category, allExpenses }) => {
  const spend = Math.round((category.totalExpenses/allExpenses) * 100);

  const {
    bg,
    circleBg,
    text: { main, count },
    progress: { bg: progressBg, indicator },
  } = topCategoryStyles[category.id] ||
  topCategoryStyles.default;

  return (
    <li className={`flex px-4 py-3 items-center ${bg} mb-3 text-base/8 rounded-md font-semibold text-green-800`}>
      <div
        className={`w-12 h-12 rounded-full ${circleBg} flex justify-center items-center ${count}`}
        id="expense-percent"
      >
        {spend}%
      </div>
      <div className="ml-3 flex-grow flex flex-col" id="expense-info">
        <div className="text-sm flex justify-between" id="expense-text">
          <span className={`${main}`}>{category.name}</span>
          <span className={`${count}`}>Rs. {category.totalExpenses} Spend</span>
        </div>
        <div className={`mt-2`}>
          <Progress
            className={progressBg}
            indicatorClassName={indicator}
            value={spend}
          />
        </div>
      </div>
    </li>
  );
};

export default RightSidebar;
