import ReactModal from "react-modal";

import { useState } from "react";
import { MemberObjectType } from "../../../../../types/Moim";
import { ref, remove, update } from "firebase/database";
import { database } from "../../../../../firebase";
import { FaTrashCan } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { memberModalStyle } from "../../../../../styles/ModalStyle";

interface MasterHeaderProps {
  member: MemberObjectType[];
  waitingMember: MemberObjectType[];
  moimid: string | undefined;
  moimMasterId: string;
  isMemberModalOpen: boolean;
  setIsMemberModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MemberModal: React.FC<MasterHeaderProps> = ({
  member,
  waitingMember,
  moimid,
  moimMasterId,
  isMemberModalOpen,
  setIsMemberModalOpen,
}) => {
  const [isMemberList, setIsMemberList] = useState(true);

  const closeModal = () => {
    setIsMemberModalOpen(false);
  };

  const handleApproveMember = async (member: MemberObjectType) => {
    const newWaitingMember = {
      profile: member.profile,
      name: member.name,
      uid: member.uid,
    };
    await update(ref(database, `moims/${moimid}/moimMember`), {
      [member.uid]: newWaitingMember,
    });
    await remove(
      ref(database, `moims/${moimid}/moimWaitingMember/${member.uid}`)
    );
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
      >
        <div className="flex flex-col gap-3">
          <p className="text-2xl font-semibold">모임원 관리</p>
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
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <p className="text-xl font-semibold flex-1">{m.name}</p>
                    {m.uid === moimMasterId ? (
                      <></>
                    ) : (
                      <>
                        <button
                          onClick={() => handleDeleteMember(m)}
                          className="w-12 h-12 bg-badge-red-001 flex justify-center items-center text-badge-red-002 rounded"
                        >
                          <FaTrashCan size={20} />
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
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <p className="text-xl font-semibold flex-1">{m.name}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveMember(m)}
                        className="w-12 h-12 bg-badge-green-001 flex justify-center items-center text-badge-green-002 rounded"
                      >
                        <FaCheckCircle size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteApproveMember(m)}
                        className="w-12 h-12 bg-badge-red-001 flex justify-center items-center text-badge-red-002 rounded"
                      >
                        <FaTrashCan size={20} />
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
