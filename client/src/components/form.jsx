import Button from "./button";
import {useState} from "react";

export const MyForm = ({ children, className, onSubmit }) => {
  return (
    <form className={`space-y-6 ${className}`} onSubmit={onSubmit}>
      {children}
    </form>
  );
};

export const InputField = ({
  loading,
  id,
  label,
  type,
  className,
  placeholder,
  error,
  ...props
}) => {
  return (
    <div className="mb-1">
      <label htmlFor={id} className={`block font-semibold mb-1`}>
        {label}
      </label>
      <input
        disabled={loading}
        type={type}
        placeholder={placeholder}
        className={`block w-full rounded-md bg-white px-3 py-1.5 text-sm/6 font-bold text-black outline outline-2 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 md:text-base/8 disabled:text-gray-400 ${className}`}
        {...props}
      />
      {error && (
        <span className="text-red-800 italic font-semibold">{error}</span>
      )}
    </div>
  );
};

export const TimeField = ({
  loading,
  id,
  label,
  type,
  className,
  placeholder,
  error,
  ...props
}) => {
  return (
    <div className="mb-1">
      <label htmlFor={id} className={`block font-semibold mb-1`}>Select
        time:</label>
      <div className="relative">
        <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
               xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd"
                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                  clip-rule="evenodd"/>
          </svg>
        </div>
        <input
          disabled={loading}
          type={type}
          placeholder={placeholder}
          className={`block w-full rounded-md bg-white px-3 py-1.5 text-sm/6 font-bold text-black outline outline-2 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 md:text-base/8 disabled:text-gray-400 ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-red-800 italic font-semibold">{error}</span>
      )}
    </div>
  );
};

export const SelectInput = ({label, id, loading, error, options, className, ...props}) => {
  return (
    <div className="mb-1">
      <label htmlFor={id} className={`block font-semibold mb-1`}>
        {label}
      </label>
      <div className="mb-1 relative">
        <select
          disabled={loading}
          className={`block w-full bg-white rounded-md px-3 py-1.5 appearance-none text-sm/6 font-bold text-gray-500 outline outline-2 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 md:text-base/8 disabled:text-gray-400 ${className}`}
          {...props}
        >
          <option value="">Choose a bank</option>
          {options?.map((item, index) => <option key={index} className={`text-sm/6 md:text-base/8 bg-white`}
                                                value={item.id}>{item.name}</option>)}
        </select>
        <svg
          className="absolute top-1/2 -translate-y-1/2 right-2 pointer-events-none size-5 text-black sm:size-4"
          viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" data-slot="icon">
        <path fill-rule="evenodd"
              d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
              clip-rule="evenodd"/>
      </svg>
    </div>
    {error && (
      <span className="text-red-800 italic font-semibold">{error}</span>
    )}
    </div>
  );
};

export const FormButton = ({buttonName, loading}) => {
  return (
    <div>
      <Button
        className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm/6 font-bold text-white shadow-md hover:bg-green-500 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-green-800 md:text-lg/8 disabled:bg-green-700 disabled:text-base/6"
        disabled={loading}
      >
        {buttonName}
      </Button>
    </div>
  );
};
