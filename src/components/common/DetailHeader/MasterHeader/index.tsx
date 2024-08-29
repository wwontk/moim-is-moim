import { useState } from "react";
import { FaUser } from "react-icons/fa6";
import { GrUpdate } from "react-icons/gr";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { IoExitOutline } from "react-icons/io5";
import { MemberObjectType, MoimObjectType } from "../../../../types/Moim";
import MemberModal from "./MemberModal";
import DisbandingModal from "./DisbandingModal";
import { Link } from "react-router-dom";

interface MasterHeaderProps {
  member: MemberObjectType[];
  waitingMember: MemberObjectType[];
  moimid: string | undefined;
  moimMasterId: string;
  detail: MoimObjectType;
}

const MasterHeader: React.FC<MasterHeaderProps> = ({
  member,
  waitingMember,
  moimid,
  moimMasterId,
  detail,
}) => {
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isDisbandingModalOpen, setIsDisbandingModalOpen] = useState(false);

  const openMemberModal = () => {
    setIsMemberModalOpen(true);
  };
  const openDisbandingModal = () => {
    setIsDisbandingModalOpen(true);
  };

  return (
    <>
      <div className="flex gap-4 justify-end mb-4">
        <MemberModal
          member={member}
          waitingMember={waitingMember}
          moimid={moimid}
          moimMasterId={moimMasterId}
          isMemberModalOpen={isMemberModalOpen}
          setIsMemberModalOpen={setIsMemberModalOpen}
          detail={detail}
        />
        <div
          className="flex flex-col gap-2 items-center relative"
          onClick={openMemberModal}
        >
          <div className="w-16 h-16 xs:w-10 xs:h-10 bg-white rounded-full flex justify-center items-center hover:bg-gray-100 hover:border cursor-pointer">
            <FaUser className="text-[24px] xs:text-[16px]" />
          </div>
          <p className="text-xs xs:text-[10px] cursor-pointer">모임원관리</p>
          {waitingMember.length > 0 && (
            <p className="w-2 h-2 bg-red-600 rounded-full absolute right-1 top-2"></p>
          )}
        </div>
        <Link to={`/moim/${moimid}/update`}>
          <div className="flex flex-col gap-2 items-center">
            <div className="w-16 h-16 xs:w-10 xs:h-10 bg-white rounded-full flex justify-center items-center hover:bg-gray-100 hover:border cursor-pointer">
              <GrUpdate className="text-[24px] xs:text-[16px]" />
            </div>
            <p className="text-xs xs:text-[10px] cursor-pointer">내용수정</p>
          </div>
        </Link>
        <Link to={`/moim/${moimid}/chat`}>
          <div className="flex flex-col gap-2 items-center">
            <div className="w-16 h-16 xs:w-10 xs:h-10 bg-white rounded-full flex justify-center items-center hover:bg-gray-100 hover:border cursor-pointer">
              <IoChatbubbleEllipses className="text-[24px] xs:text-[16px]" />
            </div>
            <p className="text-xs xs:text-[10px]">단체채팅</p>
          </div>
        </Link>
        <DisbandingModal
          moimid={moimid}
          isDisbandingModalOpen={isDisbandingModalOpen}
          setIsDisbandingModalOpen={setIsDisbandingModalOpen}
          detail={detail}
        />
        <div
          className="flex flex-col gap-2 items-center"
          onClick={openDisbandingModal}
        >
          <div className="w-16 h-16 xs:w-10 xs:h-10 bg-white rounded-full flex justify-center items-center hover:bg-gray-100 hover:border cursor-pointer">
            <IoExitOutline className="text-[24px] xs:text-[16px]" />
          </div>
          <p className="text-xs xs:text-[10px] cursor-pointer">모임해체</p>
        </div>
      </div>
    </>
  );
};

export default MasterHeader;
