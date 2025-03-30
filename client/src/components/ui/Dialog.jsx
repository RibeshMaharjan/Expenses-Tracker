import CloseIcon from '@mui/icons-material/Close';
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";

const Dialog = ({ open, onClose, title, children}) => {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[999] flex h-screen w-screen items-center justify-center transition-colors
        ${open ? "visible bg-black/20" : "invisible"}`}
      >
        <div
          onClick={e =>  e.stopPropagation()}
          className={`
            relative mx-auto w-full max-w-[30rem] rounded-lg overflow-hidden shadow-sm transition-all
            ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
          `}
        >
          <div className='relative w-full max-w-md max-h-full'>
            {/*  Form Start */}
            <div className='relative bg-white rounded-lg shadow-sm'>
              {/*  Header */}
              <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200'>
                <h3 className='text-xl font-semibold text-gray-900'>
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className='end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center'
                >
                  <CloseIcon />
                </button>
              </div>
              {/*  Body */}
              <div className="p-4 md:p-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export const DialogButton = ({ onClick }) => {
  return (
    <>
      <button
        onClick={onClick}
        className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
        type="button">
        Open Form
      </button>
    </>
  )
}

export default Dialog;