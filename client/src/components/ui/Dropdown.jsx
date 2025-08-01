import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import {useActiveBankContext} from "../../context/ActiveBankTabContext.jsx";

export default function Dropdown({ menuitems }) {
  const { activeBank, toggleBankTab } = useActiveBankContext();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
          {menuitems && menuitems[activeBank]}
          <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
        </MenuButton>
      </div>
      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1">
          {menuitems &&
            menuitems?.map((item, index) => {
              return (
                <MenuItem
                  key={index}
                  onClick={()=> {
                    toggleBankTab(index)
                  }}
                >
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                  >
                    {item}
                  </a>
                </MenuItem>
              )
            })
          }
        </div>
      </MenuItems>
    </Menu>
  )
}
