import React, { Fragment, useContext, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import AuthContext from "../AuthContext";

export default function Modal({ isOpen, onClose, notifications }) {
  const [products, setAllProducts] = useState([]);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const fetchProductsData = () => {
      fetch(`http://localhost:4000/api/product/get/${authContext.user}`)
        .then((response) => response.json())
        .then((data) => {
          setAllProducts(data);
        })
        .catch((err) => console.log(err));
    };

    fetchProductsData();
  }, [authContext.user]);

  if (!isOpen) return null;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Notifications
                    </Dialog.Title>
                    <div className="mt-2">
                      {notifications && Array.isArray(notifications) && notifications.map((notification, index) => (
                        <p key={index} className="text-sm text-gray-500">
                          {notification.name} has a quantity of {notification.quantity} or less.
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Afficher uniquement les produits qui ne sont pas en stock */}
              <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                      Products
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                      Stock
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                      Availibility
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {products
                    .filter((product) => product.stock === 0)
                    .map((element, index) => (
                      <tr key={element._id}>
                        <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                          {element.name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          {element.stock}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          {element.stock > 0 ? "In Stock" : "Not in Stock"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
