import PanelHeader, {MainHeaderContent, SubHeaderContent} from "../components/panel/PanelHeader.jsx";
import Panel from "../components/panel/Panel.jsx";
import StockTable from "../components/stock/StockTable.jsx";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {FormButton, InputField, MyForm, SelectInput, TimeField} from "@/components/form.jsx";
import Loader from "@/components/ui/loader.jsx";
import Dialog from "@/components/ui/Dialog.jsx";
import {useState} from "react";
import {set, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import {toast} from "sonner";
import {Navigate} from "react-router-dom";
import * as z from "zod";
import {useStockContent} from "@/context/StockContext.jsx";
import {useBankContent} from "@/context/BankContext.jsx";
import PageLoader from "@/components/ui/PageLoader.jsx";
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

const AddStockSchema = z
  .object({
    symbol: z
      .string()
      .trim()
      .min(1, { message: "Symbol cannot be empty" }),
    stock_name: z
      .string()
      .trim()
      .min(1, { message: "Stock name cannot be empty" }),
    brokerage_account_id: z
      .string()
      .transform(val => parseInt(val))
      .refine(val => !isNaN(val), { message: "Invalid brokerage Id" }),
    quantity: z
      .string()
      .transform(val => parseFloat(val))
      .refine(val => !isNaN(val), { message: "Quantity must be a number" })
      .refine(val => val >= 10, { message: "Quantity must be atleast 10" }),
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

const Stock = () => {
  const { user } = useUserContext();
  const [openStockModel, setOpenStockModel] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(AddStockSchema),
  });
  const { stocks, getStockAccountsAndTransactions } = useStockContent();
  const { loading, banks, getBankAccountsAndTransactions } = useBankContent();
  const [brokerage, setBrokerage] = useState([]);
  
  const addStockHandler = async (formData) => {
      console.log(formData)
      try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/stock`,
          formData,
          {
            withCredentials: true,
          },x
        )
  
        if(response.status !== 201) {
          toast.error(response.data.message);
        }
  
        toast.success(response.data.message);
        setOpenStockModel(false);
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
      }
    }
    
  const bankName = banks?.map(bank => {
    return {
      id: bank.id,
      name: bank.bank_name,
    }
  });

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
              <span>My Stocks</span>
            </MainHeaderContent>
            <SubHeaderContent>
              <p className="text-gray-600">
                Effortlessly manager your stocks.
              </p>
            </SubHeaderContent>
          </PanelHeader>
          <div className={`ms-auto`}>
            <button onClick={() => setOpenStockModel(true)} type='button' className="h-fit px-1 py-1.5 text-green-600 text-base/6 font-bold rounded-md hover:bg-green-200">
              <AddOutlinedIcon sx={{ fontSize: 20 }} />
              <span  className="ms-1">Add Stocks</span>
            </button>
          </div>
        </div>
        <section className="w-full" id="stock-section">
          <div
            className="flex justify-between mb-4"
            id="transaction-section-header"
          >
            <h1 className="text-2xl font-bold">Stocks</h1>
          </div>
          <StockTable />
          <Dialog
            open={openStockModel}
            onClose={() => setOpenStockModel(false)}
            title={`Add your Stock`}>
            <MyForm onSubmit={handleSubmit(addStockHandler)}>
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
                id='symbol'
                label='Symbol'
                type='text'
                className='appearance-none'
                placeholder='Enter Stock Symbol'
                error={errors.symbol?.message}
                {...register("symbol")}
              />
              <InputField
                loading={isSubmitting}
                id='stock_name'
                label='Stock Name'
                type='text'
                className='appearance-none'
                placeholder='Enter Stock Name'
                error={errors.stock_name?.message}
                {...register("stock_name")}
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

export default Stock;
