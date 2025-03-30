import CountUp from "react-countup";

const AnimatedCounter = ({ amount }) => {
  return (
    <>
      <CountUp
        prefix={'Rs. '}
        decimals={2}
        end={amount}

      />
    </>
  )
}
export default AnimatedCounter;