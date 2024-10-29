'use client';
import OptionModal from '@/app/(providers)/_components/OptionModal/OptionModal';
import { useModalStore } from '@/zustand/modalStore';
import { SlOptions } from 'react-icons/sl';
interface OptionButtonProps {
  position: string;
}
function OptionButton({ position }: OptionButtonProps) {
  const openModal = useModalStore((state) => state.openModal);
  const handleClickOption = () => {
    openModal({
      element: <OptionModal position={position} />,
      backdrop: false,
    });
  };
  return (
    <button
      aria-label="옵션 버튼"
      onClick={handleClickOption}
      className="text-gray-400 transition-all duration-75 hover:text-white"
    >
      <SlOptions className="w-7 h-7" />
    </button>
  );
}

export default OptionButton;
