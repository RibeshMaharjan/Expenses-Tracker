const Panel = ({ children }) => {
  return (
    <>
      <div className="h-full w-full px-4 py-6 xl:px-10 xl:py-16">
        {children}
      </div>
    </>
  )

}

export default Panel;