import ReactModal from 'react-modal';
import { FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';
import { ComponentType } from 'react';
ReactModal.setAppElement('#root');

interface WarningModalProps {
  onClose: (state: boolean) => void;
  onConfirm: () => void;
  isOpen: boolean;
}
const Modal: any = ReactModal;

const WarningModal: React.FC<WarningModalProps> = ({ onClose, isOpen, onConfirm }) => {
  const WarningIcon = FaExclamationTriangle as ComponentType<{ className?: string }>;
  const Arrow = FaArrowRight as React.ComponentType<{ className?: string }>;
  return (
    <Modal
      isOpen={isOpen as boolean}
      className="max-w-[550px] w-full bg-gradient-to-b from-[#3c105e] to-[#1a011a] p-25 text-[#facc15] rounded-lg shadow-lg relative"
      overlayClassName="z-100 fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-[#111214D9]"
      bodyOpenClassName="overflow-hidden"
      onRequestClose={() => {
        onClose(false);
      }}
    >
      <button
        className="absolute top-7 right-16 text-xl font-bold text-white bg-transparent border-none cursor-pointer transition-colors duration-200 ease-in-out hover:text-[#999]"
        onClick={() => {
          onClose(false);
        }}
      >
        &times;
      </button>
      <div className="flex items-center mb-15 ">
        <WarningIcon className="text-3xl mr-10" />
        <span className="text-xl">Warning!</span>
      </div>
      <p className="text-[15px] text-white pl-10 mb-10">
        You are currently registered as a Legacy Masternode. If you choose to withdraw, you will lose your reduced
        collateral entitlement and will not be able to re-register under the same terms.
      </p>
      <button className="inline-flex items-center px-25 py-6 bg-[#4f1979] text-white text-base font-medium rounded-full cursor-pointer transition-all duration-300 ease-in-out float-right hover:bg-[#330d50]">
        <span className="mr-8 text-md" onClick={onConfirm}>
          OK
        </span>
        <Arrow className="transition-transform duration-300 ease-in-out text-sm transform" />
      </button>
    </Modal>
  );
};

export default WarningModal;
