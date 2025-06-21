import PanelHeader, {MainHeaderContent, SubHeaderContent} from "../components/panel/PanelHeader.jsx";
import Panel from "../components/panel/Panel.jsx";
import StockTransactionTable from "../components/stockTransaction/StockTransactionTable.jsx";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {useEffect, useState} from "react";
import {FormButton, InputField, MyForm, SelectInput, TimeField} from "../components/form.jsx";
import Loader from "../components/ui/loader.jsx";
import Dialog from "../components/ui/Dialog.jsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import {toast} from "sonner";
import {Navigate} from "react-router-dom";
import PageLoader from "../components/ui/PageLoader.jsx";
import {useBankContent} from "../context/BankContext.jsx";
import {useStockContent} from "../context/StockContext.jsx";
import {useUserContext} from "@/context/UserContext.jsx";

const transactionType =[
  {
    id: 'buy',
    name: 'buy',
  },
  {
    id: 'sell',
    name: 'sell',
  },
]

const AddTransactionSchema = z
  .object({
    stock_id: z
      .string()
      .transform(val => parseInt(val))
      .refine(val => !isNaN(val), { message: "Invalid stock type" }),
    brokerage_account_id: z
      .string()
      .transform(val => parseInt(val))
      .refine(val => !isNaN(val), { message: "Invalid brokerage Id" }),
    quantity: z
      .string()
      .transform(val => parseFloat(val))
      .refine(val => !isNaN(val), { message: "Quantity must be a number" })
      .refine(val => val >= 0, { message: "Quantity must be positive" })
      .refine(val => val !== 0, { message: "Quantity must be positive" }),
    price: z
      .string()
      .transform(val => parseFloat(val))
      .refine(val => !isNaN(val), { message: "Price must be a number" })
      .refine(val => val >= 0, { message: "Price must be positive" })
      .refine(val => val !== 0, { message: "Price must be positive" }),
    total_amount: z
      .string()
      .transform(val => parseFloat(val))
      .refine(val => !isNaN(val), { message: "Amount must be a number" })
      .refine(val => val >= 0, { message: "Amount must be positive" })
      .refine(val => val !== 0, { message: "Amount must be positive" }),
    transaction_date: z
      .string()
      .refine(date => new Date(date).toString() !== 'Invalid Date', { message: "A valid date is required" })
      .transform(date => new Date(date)),
    transaction_type: z
      .string()
      .min(1, { message: "Transaction Type is required" }),
    bank_account_id: z
      .string()
      .transform(val => parseInt(val))
      .refine(val => !isNaN(val), { message: "Invalid bank_id type" }),
  });


const StockTransaction = () => {
  const { user } = useUserContext();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(AddTransactionSchema),
  })
  const [brokerage, setBrokerage] = useState([]);
  const { loading, banks, getBankAccountsAndTransactions } = useBankContent();
  const { stocks, getStockAccountsAndTransactions } = useStockContent();

  useEffect( () => {
    const getTransactionCategory = async () => {
      try {
        const brokerageResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/brokerage`,
          {
            withCredentials: true,
          },
        )
        setBrokerage(brokerageResponse.data.data);
      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
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
      }
    }
    getTransactionCategory();
  }, []);

  const addTransactionHandler = async (formData) => {
    console.log(formData)
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/transactions/create`,
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
      await getStockAccountsAndTransactions();
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
    }
  }

  const bankName = banks?.map(bank => {
    return {
      id: bank.id,
      name: bank.bank_name,
    }
  });

  const stockName = stocks?.map(stock => {
    return {
      id: stock.id,
      name: stock.symbol,
    }
  });

  // console.log(brokerage)
  const brokerageName = brokerage?.map(brokerage => {
    return {
      id: brokerage.id,
      name: brokerage.brokerage_account_no,
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
              <span>Stock Transaction History</span>
            </MainHeaderContent>
            <SubHeaderContent>
              <p className="text-gray-600">
                Gain insight of your stocks transaction log.
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
        <section className="w-full" id="transaction-table-section">
          <div
            className="flex justify-between mb-4"
            id="transaction-table-section-header"
          >
            <h1 className="text-2xl font-bold">Transactions</h1>
          </div>
          <StockTransactionTable />
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            title={`Add your Stock Transaction`}>
            <MyForm onSubmit={handleSubmit(addTransactionHandler)}>
              <SelectInput
                loading={isSubmitting}
                id='stock_id'
                label='Stock'
                className=''
                options={stockName}
                error={errors.stock_id?.message}
                {...register("stock_id")}
              />
              <SelectInput
                loading={isSubmitting}
                id='brokerage_account_id'
                label='Brokerage'
                className=''
                options={brokerageName}
                error={errors.brokerage_account_id?.message}
                {...register("brokerage_account_id")}
              />
              <InputField
                loading={isSubmitting}
                id='quantity'
                label='Quantity'
                type='number'
                className='appearance-none'
                placeholder='Enter your quantity'
                error={errors.quantity?.message}
                {...register("quantity")}
              />
              <InputField
                loading={isSubmitting}
                id='price'
                label='Price'
                type='number'
                className='appearance-none'
                placeholder='Enter your price'
                error={errors.price?.message}
                diabled='true'
                {...register("price")}
              />
              <InputField
                loading={isSubmitting}
                id='total_amount'
                label='Total'
                type='number'
                className='appearance-none'
                placeholder='Enter your total'
                error={errors.total_amount?.message}
                diabled='true'
                {...register("total_amount")}
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
              <SelectInput
                loading={isSubmitting}
                id='transaction_type'
                label='Transaction Type'
                className=''
                options={transactionType}
                error={errors.transaction_type?.message}
                {...register("transaction_type")}
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

export default StockTransaction;
