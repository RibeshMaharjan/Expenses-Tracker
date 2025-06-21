import PanelHeader, {MainHeaderContent, SubHeaderContent} from "../components/panel/PanelHeader.jsx";
import Panel from "../components/panel/Panel.jsx";
import StockTable from "../components/stock/StockTable.jsx";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {FormButton, InputField, MyForm, SelectInput, TimeField} from "@/components/form.jsx";
import Loader from "@/components/ui/loader.jsx";
import Dialog from "@/components/ui/Dialog.jsx";
import {use, useEffect, useState} from "react";
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

const AddBrokerageSchema = z
  .object({
    brokerage_no: z
      .string()
      .transform(val => parseFloat(val))
      .refine(val => !isNaN(val), { message: "Brokerage no must be a number" })
      .refine(val => val >= 0, { message: "Brokerage no must be positive" })
      .refine(val => val !== 0, { message: "Brokerage no must be positive" }),
    brokerage_account_holder_name: z
      .string()
      .trim()
      .min(0, { message: "Account holder name cannot be empty" }),
    brokerage_account_no: z
      .string()
      .transform(val => parseFloat(val))
      .refine(val => !isNaN(val), { message: "Brokerage account no must be a number" })
      .refine(val => val >= 0, { message: "Brokerage account no must be positive" })
      .refine(val => val !== 0, { message: "Brokerage account no must be positive" }),
  });

const Stock = () => {
  const { user } = useUserContext();
  const [openStockModel, setOpenStockModel] = useState(false);
  const [openBrokerageModel, setOpenBrokerageModel] = useState(false);
  const {
    register: stockRegister,
    handleSubmit: handleStockSubmit,
    formState: { errors: stockErrors, isSubmitting: isStockSubmitting },
    reset: stockReset,
  } = useForm({
    resolver: zodResolver(AddStockSchema),
  });
  
  const {
    register: brokerageRegister,
    handleSubmit: handleBrokerageSubmit,
    formState: { errors: brokerageErrors, isSubmitting: isBrokerageSubmitting },
    reset: brokerageReset,
  } = useForm({
    resolver: zodResolver(AddBrokerageSchema),
  });
  
  const { stocks, getStockAccountsAndTransactions, brokerage, getBrokerage } = useStockContent();
  const { loading, banks, getBankAccountsAndTransactions } = useBankContent();
  // const [brokerage, setBrokerage] = useState([]);
  
  const addStockHandler = async (formData) => {
      console.log(formData)
      try {
        const response = await axios.post(`/api/stock`,
          formData,
          {
            withCredentials: true,
          },
        )
  
        if(response.status !== 201) {
          toast.error(response.data.message);
        }
  
        toast.success(response.data.message);
        setOpenStockModel(false);
        stockReset();
        await getStockAccountsAndTransactions();
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
        if(error.status === 401) {
          const refrehToken = await axios.post(
            `/api/auth/token`,
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
    
  const addBrokerageHandler = async (formData) => {
    console.log(formData)
    try {
      const response = await axios.post(`/api/brokerage/createaccount`,
        formData,
        {
          withCredentials: true,
        },
      )

      if(response.status !== 201) {
        toast.error(response.data.message);
      }

      toast.success(response.data.message);
      setOpenBrokerageModel(false);
      brokerageReset();
      await getBrokerage();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      if(error.status === 401) {
        const refrehToken = await axios.post(
          `/api/auth/token`,
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

  useEffect(() => {
    getBrokerage();
  }, []);
  
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
            <button onClick={() => setOpenBrokerageModel(true)} type='button' className="h-fit px-1 py-1.5 text-green-600 text-base/6 font-bold rounded-md hover:bg-green-200">
              <AddOutlinedIcon sx={{ fontSize: 20 }} />
              <span  className="ms-1">Add Brokerage Account</span>
            </button>
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
            <MyForm onSubmit={handleStockSubmit(addStockHandler)}>
              <SelectInput
                loading={isStockSubmitting}
                id='brokerage_account_id'
                label='Brokerage'
                className=''
                options={brokerageName}
                error={stockErrors.brokerage_account_id?.message}
                {...stockRegister("brokerage_account_id")}
              />
              <InputField
                loading={isStockSubmitting}
                id='symbol'
                label='Symbol'
                type='text'
                className='appearance-none'
                placeholder='Enter Stock Symbol'
                error={stockErrors.symbol?.message}
                {...stockRegister("symbol")}
              />
              <InputField
                loading={isStockSubmitting}
                id='stock_name'
                label='Stock Name'
                type='text'
                className='appearance-none'
                placeholder='Enter Stock Name'
                error={stockErrors.stock_name?.message}
                {...stockRegister("stock_name")}
              />
              <InputField
                loading={isStockSubmitting}
                id='quantity'
                label='Quantity'
                type='number'
                className='appearance-none'
                placeholder='Enter your quantity'
                error={stockErrors.quantity?.message}
                {...stockRegister("quantity")}
              />
              <InputField
                loading={isStockSubmitting}
                id='price'
                label='Price'
                type='number'
                className='appearance-none'
                placeholder='Enter your price'
                error={stockErrors.price?.message}
                diabled='true'
                {...stockRegister("price")}
              />
              <InputField
                loading={isStockSubmitting}
                id='total_amount'
                label='Total'
                type='number'
                className='appearance-none'
                placeholder='Enter your total'
                error={stockErrors.total_amount?.message}
                diabled='true'
                {...stockRegister("total_amount")}
              />
              <InputField
                loading={isStockSubmitting}
                id='transaction_date'
                label='Transaction Date '
                type='date'
                placeholder='Enter the date'
                className=''
                error={stockErrors.transaction_date?.message}
                {...stockRegister("transaction_date")}
              />
              <TimeField
                loading={isStockSubmitting}
                id='transaction_time'
                label='Select Time:'
                type='time'
                className=''
                placeholder='Enter time'
                error={stockErrors.transaction_time?.message}
                {...stockRegister("transaction_time")}
              />
              <SelectInput
                loading={isStockSubmitting}
                id='bank_account_id'
                label='Bank'
                className=''
                options={bankName}
                error={stockErrors.bank_account_id?.message}
                {...stockRegister("bank_account_id")}
              />
              <FormButton
                loading={isStockSubmitting}
                buttonName={
                  isStockSubmitting ? (
                    <Loader label="Adding" color="white" />
                  ) : (
                    "Add"
                  )
                }
              />
            </MyForm>
          </Dialog>
          <Dialog
            open={openBrokerageModel}
            onClose={() => setOpenBrokerageModel(false)}
            title={`Add Brokerage Account`}>
            <MyForm onSubmit={handleBrokerageSubmit(addBrokerageHandler)}>
              <InputField
                loading={isBrokerageSubmitting}
                id='brokerage_no'
                label='Brokerag No'
                type='number'
                className='appearance-none'
                placeholder='Enter Brokerage No'
                error={brokerageErrors.brokerage_no?.message}
                {...brokerageRegister("brokerage_no")}
              />
              <InputField
                loading={isBrokerageSubmitting}
                id='brokerage_account_no'
                label='Brokerage Account No'
                type='number'
                className='appearance-none'
                placeholder='Enter Brokerage Account No'
                error={brokerageErrors.brokerage_account_no?.message}
                {...brokerageRegister("brokerage_account_no")}
              />
              <InputField
                loading={isBrokerageSubmitting}
                id='brokerage_account_holder_name'
                label='Brokerage Account Holder Name'
                type='text'
                className='appearance-none'
                placeholder='Enter Account Holder Name'
                error={brokerageErrors.brokerage_account_holder_name?.message}
                {...brokerageRegister("brokerage_account_holder_name")}
              />
              <FormButton
                loading={isBrokerageSubmitting}
                buttonName={
                  isBrokerageSubmitting ? (
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
