import Button from "./button";

export const Form = ({ children, className, onSubmit }) => {
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
      <label htmlFor={id} className={`block text-sm/6 font-medium`}>
        {label}
      </label>
      <input
        disabled={loading}
        type={type}
        placeholder={placeholder}
        className={`block w-full rounded-md bg-white px-3 py-1.5 text-base font-bold text-black outline outline-2 -outline-offset-1 outline-gray-300 placeholder:text-gray-500  focus:outline-2 focus:-outline-offset-2 focus:outline-green-600 sm:text-sm/6 disabled:text-gray-400 ${className}`}
        {...props}
      />
      {error && (
        <span className="text-red-800 italic font-semibold">{error}</span>
      )}
    </div>
  );
};

export const FormButton = ({ buttonName, loading }) => {
  return (
    <div>
      <Button
        className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-base/6 font-bold text-white shadow-md hover:bg-green-500 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-green-800 disabled:bg-green-700 disabled:text-sm/6"
        disabled={loading}
      >
        {buttonName}
      </Button>
    </div>
  );
};
