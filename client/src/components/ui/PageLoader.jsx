const PageLoader = () => {
  return (
    <>
      <div className="w-full h-full flex items-center justify-center">
        <div
          className={`animate-spin inline-block size-4 border-[3px] border-current border-t-transparent text-green-800 rounded-full`}
          role="status"
        >
          <span className="sr-only">Loading</span>
        </div>
        <p className={`ms-3 text-base/6 text-green-700`}>Loading...</p>
      </div>
    </>
  );
};

export default PageLoader;
