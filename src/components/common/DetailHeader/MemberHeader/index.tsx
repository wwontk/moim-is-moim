import { useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { IoExitOutline } from "react-icons/io5";
import ExitModal from "./ExitModal";
import { Link } from "react-router-dom";

interface MemberHeaderProps {
  moimid: string | undefined;
}

const MemberHeader: React.FC<MemberHeaderProps> = ({ moimid }) => {
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const openModal = () => {
    setIsExitModalOpen(true);
  };

  return (
    <>
      <div className="flex gap-4 justify-end mb-4">
        <Link to={`/moim/${moimid}/chat`}>
          <div className="flex flex-col gap-2 items-center">
            <div className="w-16 h-16 bg-white rounded-full flex justify-center items-center hover:bg-gray-100 hover:border cursor-pointer">
              <IoChatbubbleEllipses size={24} />
            </div>
            <p>단체채팅</p>
          </div>
        </Link>
        <div className="flex flex-col gap-2 items-center" onClick={openModal}>
          <div className="w-16 h-16 bg-white rounded-full flex justify-center items-center hover:bg-gray-100 hover:border cursor-pointer">
            <IoExitOutline size={24} />
          </div>
          <p>모임탈퇴</p>
        </div>
        <ExitModal
          moimid={moimid}
          isExitModalOpen={isExitModalOpen}
          setIsExitModalOpen={setIsExitModalOpen}
        />
      </div>
    </>
  );
};

export default MemberHeader;
