const Loader = ({ label, color }) => {
  return (
    <>
      <div className="flex items-center">
        <div
          className={`animate-spin inline-block size-4 border-[3px] border-current border-t-transparent text-${color} rounded-full`}
          role="status"
        >
          <span className="sr-only">Loading</span>
        </div>
        <p className={`ms-3 text-base/6 text-${color}`}>{label}</p>
      </div>
    </>
  );
};

export default Loader;
