import {FormButton, InputField, MyForm, TimeField} from "../form.jsx";
import Loader from "../ui/loader.jsx";
import Dialog from "../ui/Dialog.jsx";
import {useState} from "react";
import * as z from "zod";
import {useForm} from "react-hook-form";
import axios from "axios";
import {toast} from "sonner";
import {Navigate} from "react-router-dom";
import {useUserContext} from "@/context/UserContext.jsx";

const AddTransactionSchema = z.object();

const AddTransactionForm = () => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: AddTransactionSchema,
  })

  const addTransactionHandler = async (formData) => {
    setLoading(true);
    console.log(formData);
    try {
      const response = await axios.post(`api/bankaccount/createaccount`,
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
      if(error.status === 401) {
        return (
          <Navigate to="sign-in" />
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <MyForm onSubmit={handleSubmit(addTransactionHandler)}>
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
  )
}

export default AddTransactionForm;