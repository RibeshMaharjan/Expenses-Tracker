const BankInfoCard = () => {
  return (
    <>
      <div className={`py-2 px-4 lg:px-6 lg:py-5 mb-8 bg-green-600 rounded-xl flex justify-between text-white`}>
        <div>
          <h1 className={`text-lg xl:text-2xl font-bold`}>Bank Name</h1>
          <p className={`mb-2 font-semibold`}>Saving Account</p>
          <span className={`text-xl font-semibold`}>Account number</span>
        </div>
        <div className={`py-3 px-4 text-lg border bg-white/30 backdrop-blur-md rounded-xl`}>
          <p className={`font-semibold mb-1`}>Current Balance</p>
          <h1 className={`text-2xl font-bold`}>Rs. 12000</h1>
        </div>
      </div>
    </>
  )
}

export default BankInfoCard;