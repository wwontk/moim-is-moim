import ReactModal from "react-modal";

import { useState } from "react";
import { MemberObjectType, MoimObjectType } from "../../../../../types/Moim";
import { push, ref, remove, set, update } from "firebase/database";
import { database } from "../../../../../firebase";
import { FaTrashCan } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { memberModalStyle } from "../../../../../styles/ModalStyle";
import useCheckFullMember from "../../../../../hooks/useCheckFullMember";

interface MasterHeaderProps {
  member: MemberObjectType[];
  waitingMember: MemberObjectType[];
  moimid: string | undefined;
  moimMasterId: string;
  isMemberModalOpen: boolean;
  setIsMemberModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  detail: MoimObjectType;
}

const MemberModal: React.FC<MasterHeaderProps> = ({
  member,
  waitingMember,
  moimid,
  moimMasterId,
  isMemberModalOpen,
  setIsMemberModalOpen,
  detail,
}) => {
  const [isMemberList, setIsMemberList] = useState(true);
  const isFull = useCheckFullMember(String(moimid));

  const closeModal = () => {
    setIsMemberModalOpen(false);
  };

  const handleApproveMember = async (member: MemberObjectType) => {
    if (!isFull) {
      const newWaitingMember = {
        profile: member.profile,
        name: member.name,
        uid: member.uid,
      };
      const newAlarmData = {
        type: "welcome",
        msg: "모임에 가입되셨습니다. 모임원들과 즐거운 시간 보내세요!🎉",
        moimTitle: detail.moimTitle,
        moimPhoto: detail.moimPhoto,
        moimId: moimid,
        createdAt: new Date().toISOString(),
      };

      await set(
        ref(database, `users/${member.uid}/mymoim/member/${moimid}`),
        true
      );
      await push(ref(database, `users/${member.uid}/alarm`), newAlarmData);
      await update(ref(database, `moims/${moimid}/moimMember`), {
        [member.uid]: newWaitingMember,
      });
      await remove(
        ref(database, `moims/${moimid}/moimWaitingMember/${member.uid}`)
      );
    } else {
      alert("모임원이 가득 찼습니다.");
      return;
    }
  };

  const handleDeleteMember = async (member: MemberObjectType) => {
    await remove(ref(database, `moims/${moimid}/moimMember/${member.uid}`));
  };

  const handleDeleteApproveMember = async (member: MemberObjectType) => {
    await remove(
      ref(database, `moims/${moimid}/moimWaitingMember/${member.uid}`)
    );
  };

  return (
    <>
      <ReactModal
        isOpen={isMemberModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={memberModalStyle}
        className="w-[500px] h-[600px] xs:w-[300px] xs:h-[450px] p-4 focus:outline-none"
      >
        <div className="flex flex-col gap-3">
          <p className="text-2xl xs:text-xl font-semibold">모임원 관리</p>
          <div className="flex p-4 border justify-center gap-5">
            <p
              onClick={() => {
                setIsMemberList(true);
              }}
              className={
                isMemberList
                  ? "text-theme-main-color font-semibold cursor-pointer"
                  : "cursor-pointer"
              }
            >
              현재 모임원
            </p>
            <p
              onClick={() => {
                setIsMemberList(false);
              }}
              className={
                isMemberList
                  ? "cursor-pointer"
                  : "text-theme-main-color font-semibold cursor-pointer"
              }
            >
              승인 대기 모임원
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {isMemberList ? (
              <>
                {member.map((m) => (
                  <div key={m.uid} className="flex items-center gap-4">
                    <img
                      src={m.profile}
                      alt={`${m.name}'s profile`}
                      className="w-14 h-14 xs:w-10 xs:h-10 rounded-full object-cover"
                    />
                    <p className="text-xl xs:text-base font-semibold flex-1">
                      {m.name}
                    </p>
                    {m.uid === moimMasterId ? (
                      <></>
                    ) : (
                      <>
                        <button
                          onClick={() => handleDeleteMember(m)}
                          className="w-12 h-12 xs:w-8 xs:h-8 bg-badge-red-001 flex justify-center items-center text-badge-red-002 rounded"
                        >
                          <FaTrashCan className="text-[20px] xs:text-[15px]" />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <>
                {waitingMember.map((m) => (
                  <div key={m.uid} className="flex items-center gap-4">
                    <img
                      src={m.profile}
                      alt={`${m.name}'s profile`}
                      className="w-14 h-14 xs:w-10 xs:h-10 rounded-full object-cover"
                    />
                    <p className="text-xl xs:text-base font-semibold flex-1">
                      {m.name}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveMember(m)}
                        className="w-12 h-12 xs:w-8 xs:h-8 bg-badge-green-001 flex justify-center items-center text-badge-green-002 rounded"
                      >
                        <FaCheckCircle className="text-[20px] xs:text-[15px]" />
                      </button>
                      <button
                        onClick={() => handleDeleteApproveMember(m)}
                        className="w-12 h-12 xs:w-8 xs:h-8 bg-badge-red-001 flex justify-center items-center text-badge-red-002 rounded"
                      >
                        <FaTrashCan className="text-[20px] xs:text-[15px]" />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </ReactModal>
    </>
  );
};

export default MemberModal;
