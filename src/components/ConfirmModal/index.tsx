import React, { useState } from 'react'

export interface ConfirmModalProps {
  title: string;
  body: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
  isWithdraw?: boolean;
}

const ConfirmModal:React.FC<ConfirmModalProps> = ({
  title,
  body,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  onClose,
  isWithdraw = false,
}) => {
  const [confirmationText, setConfirmationText] = useState('')
  const isConfirmed = !isWithdraw || confirmationText.toLowerCase() === 'withdraw'

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto w-96 shadow-lg aos-init aos-animate" data-aos="fade-down">
        <div className="relative h-full bg-slate-800 rounded-3xl p-px before:absolute before:w-96 before:h-96 before:-left-48 before:-top-48 before:bg-purple-500 before:rounded-full before:opacity-0 before:pointer-events-none before:transition-opacity before:duration-500 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:hover:opacity-20 before:z-30 before:blur-[100px] after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:transition-opacity after:duration-500 after:[background:_radial-gradient(250px_circle_at_var(--mouse-x)_var(--mouse-y),theme(colors.slate.400),transparent)] after:group-hover:opacity-100 after:z-10 overflow-hidden">
          <div className="relative h-full bg-slate-900 rounded-[inherit] z-20 overflow-hidden">
            <div className="flex flex-col">
              <div className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none -z-10 w-1/2 aspect-square" aria-hidden="true">
                <div className="absolute inset-0 translate-z-0 bg-slate-800 rounded-full blur-[80px]"></div>
              </div>
              <div className="md:max-w-[480px] shrink-0 order-1 md:order-none p-6 pt-0 md:p-6">
                <div className="mt-3 text-center">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-2 py-3">
                    {isWithdraw && (
                      <div className="flex items-center mb-2 text-red-500">
                        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="font-bold">WARNING:</span>
                      </div>
                    )}
                    <p className="text-left text-sm text-gray-200">{body}</p>
                    {isWithdraw && (
                      <div className="mt-4">
                        <p className="text-left text-sm text-gray-200 mb-2">Please type "withdraw" to confirm:</p>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
                          value={confirmationText}
                          onChange={(e) => setConfirmationText(e.target.value)}
                          placeholder="Type 'withdraw'"
                        />
                      </div>
                    )}
                  </div>
                  <div className="items-end px-4 py-1 pt-3">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-gray-400">
                      {cancelText}
                    </button>
                    <button
                      onClick={onConfirm}
                      className={`px-4 py-2 ${isWithdraw ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-500 hover:bg-blue-400'} text-white text-base font-medium rounded-md w-auto shadow-sm ml-3 ${!isConfirmed ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!isConfirmed}
                    >
                      {confirmText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    //   <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
    //     <div className="mt-3 text-center">
    //       <div className="flex justify-between items-center">
    //         <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
    //         <button onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
    //           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    //           </svg>
    //         </button>
    //       </div>
    //       <div className="mt-2 py-3">
    //         <p className="text-left text-sm text-gray-500">{body}</p>
    //       </div>
    //       <div className="items-center px-4 py-3">
    //         <button onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-gray-400">
    //           {cancelText}
    //         </button>
    //         <button onClick={onConfirm} className="px-4 py-2 bg-purple-500 text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-blue-400 ml-3">
    //           {confirmText}
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  )
}

export default ConfirmModal