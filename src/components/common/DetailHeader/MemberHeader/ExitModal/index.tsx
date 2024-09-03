import ReactModal from "react-modal";
import { exitModalStyle } from "../../../../../styles/ModalStyle";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../types/User";
import { ref, remove } from "firebase/database";
import { database } from "../../../../../firebase";

interface ExitModalProps {
  moimid: string | undefined;
  isExitModalOpen: boolean;
  setIsExitModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExitModal: React.FC<ExitModalProps> = ({
  moimid,
  isExitModalOpen,
  setIsExitModalOpen,
}) => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const closeModal = () => {
    setIsExitModalOpen(false);
  };

  const handleExitMoim = async () => {
    await remove(
      ref(database, `users/${currentUser.uid}/mymoim/member/${moimid}`)
    );
    await remove(
      ref(database, `moims/${moimid}/moimMember/${currentUser.uid}`)
    );
  };

  return (
    <>
      <ReactModal
        isOpen={isExitModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={exitModalStyle}
        className="w-[500px] h-[200px] xs:w-[320px] xs:h-[180px] p-4 focus:outline-none"
      >
        <div className="flex flex-col gap-3">
          <p className="text-2xl font-semibold">모임 탈퇴</p>
          <p>이 모임에서 탈퇴하시겠습니까?</p>
          <div className="flex gap-2 justify-center mt-3">
            <button
              onClick={handleExitMoim}
              className="w-48 p-3 rounded bg-[#04eba8] text-[#bffcea]"
            >
              탈퇴 할래요
            </button>
            <button
              onClick={closeModal}
              className="w-48 p-3 rounded bg-[#bffcea] text-[#22e6ad]"
            >
              아니요
            </button>
          </div>
        </div>
      </ReactModal>
    </>
  );
};

export default ExitModal;
