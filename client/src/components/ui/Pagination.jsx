import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export const Pagination = ({ totalItems, itemPerPage, setCurrentPage, currentPage }) => {
  const pages = [];

  for (let i = 1; i<= Math.ceil(totalItems/itemPerPage); i++) {
    pages.push(i);
  }

  const handleNavigation = (type) => {
    if(type === "prev") {
      setCurrentPage(prev => prev - 1);
    } else {
      setCurrentPage(prev => prev + 1);
    }
  };
  console.log(currentPage)
  return (
    <div className={`px-3 py-2 flex justify-between gap-3`}>
      <button
        className={`disabled:text-gray-500`}
        onClick={() => handleNavigation("prev")}
        disabled={currentPage <= 1}
      >
        <ChevronLeftIcon /> Prev
      </button>
      <p className="text-14 flex items-center px-2 gap-2">
        {
          pages.map((page, index) => {
            return (
              <button
                key={index}
                onClick={() => setCurrentPage(page)}
                className={`
                  px-3 py-1 border  rounded-full transition-all duration-300 ease-in-out
                  ${currentPage === page ? 'bg-green-50 border-green-400 text-green-600': 'border-gray-400'}
                `}
              >
                {page}
              </button>
              )
          })
        }
      </p>
      <button
        className={`disabled:text-gray-500`}
        onClick={() => handleNavigation("next")}
        disabled={currentPage >= pages[pages.length-1]}
      >
        Next <ChevronRightIcon />
      </button>
    </div>
  )
};