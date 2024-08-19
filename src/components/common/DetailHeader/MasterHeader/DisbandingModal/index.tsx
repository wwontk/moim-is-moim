import ReactModal from "react-modal";
import { disbandingModalStyle } from "../../../../../styles/ModalStyle";
import useInput from "../../../../../hooks/useInput";
import { ref, remove } from "firebase/database";
import { database } from "../../../../../firebase";
import { useNavigate } from "react-router-dom";

interface DisbandingModalProps {
  moimid: string | undefined;
  isDisbandingModalOpen: boolean;
  setIsDisbandingModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DisbandingModal: React.FC<DisbandingModalProps> = ({
  moimid,
  isDisbandingModalOpen,
  setIsDisbandingModalOpen,
}) => {
  const navigate = useNavigate();
  const [reasonText, , handleChangeReasonText] = useInput("");

  const closeModal = () => {
    setIsDisbandingModalOpen(false);
  };

  const handleDisbandMoim = async () => {
    await remove(ref(database, `moims/${moimid}`));
    navigate("/", { replace: true });
  };
  return (
    <>
      <ReactModal
        isOpen={isDisbandingModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={disbandingModalStyle}
      >
        <div className="flex flex-col gap-3">
          <p className="text-2xl font-semibold">모임 해체</p>
          <p>모임을 해체하는 사유는 무엇입니까?</p>
          <textarea
            name="reason"
            id="reason"
            className="bg-gray-100 focus:outline-none p-3 h-40 resize-none"
            value={reasonText}
            onChange={handleChangeReasonText}
          ></textarea>
          <div className="flex gap-2 justify-center mt-3">
            <button
              className="w-48 p-3 rounded bg-[#04eba8] text-[#bffcea]"
              onClick={handleDisbandMoim}
            >
              해체 할래요
            </button>
            <button
              onClick={closeModal}
              className="w-48 p-3 rounded bg-[#bffcea] text-[#22e6ad]"
            >
              안 할래요
            </button>
          </div>
        </div>
      </ReactModal>
    </>
  );
};

export default DisbandingModal;
