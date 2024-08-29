import { useNavigate, useParams } from "react-router-dom";
import MemberProfile from "../../components/common/MemberProfile";
import { child, increment, off, onValue, ref, update } from "firebase/database";
import { database } from "../../firebase";
import { useCallback, useEffect, useState } from "react";
import { MemberObjectType, MoimObjectType } from "../../types/Moim";
import { useSelector } from "react-redux";
import { RootState } from "../../types/User";
import MasterHeader from "../../components/common/DetailHeader/MasterHeader";
import MemberHeader from "../../components/common/DetailHeader/MemberHeader";
import useMemberCount from "../../hooks/useMemberCount";
import { cateMapping } from "../../types/Category";
import useCheckIsToday from "../../hooks/useCheckIsToday";
import useCheckFullMember from "../../hooks/useCheckFullMember";
import useCheckIsPast from "../../hooks/useCheckIsPast";

const MoimDetailPage = () => {
  const { moimid } = useParams();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [detail, setDetail] = useState<MoimObjectType>();
  const [member, setMember] = useState<MemberObjectType[]>([]);
  const [waitingMember, setWaitingMember] = useState<MemberObjectType[]>([]);

  const [isMoimMember, setIsMoimMember] = useState(false);
  const [isWaitingMember, setIsWaitingMember] = useState(false);

  const isFullMoim = useCheckFullMember(String(moimid));
  const isPast = useCheckIsPast(String(detail?.moimDate));

  useEffect(() => {
    if (moimid) {
      const moimRef = child(ref(database, "moims"), moimid);

      update(moimRef, {
        views: increment(1),
      }).catch((error) => {
        console.error("Error:", error);
      });
    }
  }, [moimid]);

  useEffect(() => {
    setIsMoimMember(member.some((m) => m.uid === currentUser.uid));
    setIsWaitingMember(waitingMember.some((m) => m.uid === currentUser.uid));
  }, [currentUser.uid, member, waitingMember]);

  const moimRef = ref(database);

  const addDetailListener = useCallback(() => {
    const onDetailValue = onValue(
      child(moimRef, `moims/${moimid}`),
      (snapshot) => {
        if (snapshot.exists()) {
          setDetail(snapshot.val());
        } else {
          console.log("No data available");
        }
      },
      (error) => {
        console.error(error);
      }
    );

    const onMemberValue = onValue(
      child(moimRef, `moims/${moimid}/moimMember`),
      (snapshot) => {
        const members: Array<MemberObjectType> = [];
        snapshot.forEach((childSnapshot) => {
          members.push(childSnapshot.val());
        });
        setMember(members);
      }
    );

    const onWaitingMemberValue = onValue(
      child(moimRef, `moims/${moimid}/moimWaitingMember`),
      (snapshot) => {
        const waitingMembers: Array<MemberObjectType> = [];
        snapshot.forEach((childSnapshot) => {
          waitingMembers.push(childSnapshot.val());
        });
        setWaitingMember(waitingMembers);
      }
    );

    // 개별적으로 add, delete 시

    // const memberArray: Array<MemberObjectType> = [];
    // onChildAdded(
    //   child(moimRef, `moims/${moimid}/moimMember`),
    //   (DataSnapshot) => {
    //     memberArray.push(DataSnapshot.val());
    //     const newMemberArray = [...memberArray];

    //     setMember(newMemberArray);
    //   }
    // );
    // onChildRemoved(
    //   child(moimRef, `moims/${moimid}/moimMember`),
    //   (DataSnapshot) => {
    //     const removedMemberKey = DataSnapshot.key;

    //     // 배열에서 삭제된 데이터를 제거
    //     const updatedMemberArray = memberArray.filter(
    //       (member) => member.uid !== removedMemberKey
    //     );

    //     // 상태를 업데이트
    //     setMember(updatedMemberArray);
    //   }
    // );

    // const waitingMemberArray: Array<MemberObjectType> = [];
    // await onChildAdded(
    //   child(moimRef, `moims/${moimid}/moimWaitingMember`),
    //   (DataSnapshot) => {
    //     waitingMemberArray.push(DataSnapshot.val());
    //     const newWaitingMemberArray = [...waitingMemberArray];

    //     setWaitingMember(newWaitingMemberArray);
    //   }
    // );
    // onChildRemoved(
    //   child(moimRef, `moims/${moimid}/moimWaitingMember`),
    //   (DataSnapshot) => {
    //     const removedMemberKey = DataSnapshot.key;

    //     // 배열에서 삭제된 데이터를 제거
    //     const updatedWaitingMemberArray = waitingMemberArray.filter(
    //       (member) => member.uid !== removedMemberKey
    //     );

    //     // 상태를 업데이트
    //     setWaitingMember(updatedWaitingMemberArray);
    //   }
    // );

    return () => {
      onDetailValue();
      off(child(moimRef, `moims/${moimid}/moimMember`), "value", onMemberValue);
      off(
        child(moimRef, `moims/${moimid}/moimWaitingMember`),
        "value",
        onWaitingMemberValue
      );
    };
  }, [moimRef, moimid]);

  useEffect(() => {
    addDetailListener();
  }, [addDetailListener]);

  const renderMembers = (members: MemberObjectType[]) => {
    return (
      members.length > 0 &&
      members.map((member) => (
        <MemberProfile
          key={member.uid}
          member={member}
          moimMasterId={detail?.masterUid}
        />
      ))
    );
  };

  const handleRegister = async () => {
    if (currentUser.isLogin) {
      const newWaitingMember = {
        profile: currentUser.photoURL,
        name: currentUser.displayName,
        uid: currentUser.uid,
      };

      await update(ref(database, `moims/${moimid}/moimWaitingMember`), {
        [currentUser.uid]: newWaitingMember,
      });
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <section className="w-[1000px] xs:w-[350px] m-auto my-10">
        {detail?.masterUid === currentUser.uid ? (
          <>
            <MasterHeader
              member={member}
              waitingMember={waitingMember}
              moimid={moimid}
              moimMasterId={detail.masterUid}
              detail={detail}
            />
          </>
        ) : isMoimMember ? (
          <MemberHeader moimid={moimid} />
        ) : (
          <></>
        )}
        <div className="flex flex-col gap-7 items-end">
          <div className="w-full h-72 xs:h-[400px] bg-white rounded-2xl shadow flex xs:flex-col items-center xs:items-start px-12 gap-12 xs:gap-4 xs:py-12">
            {detail?.moimPhoto ? (
              <>
                <img
                  src={detail?.moimPhoto}
                  alt="moim_photo"
                  className="w-80 h-48 xs:h-36 border-2 rounded-lg object-cover"
                />
              </>
            ) : (
              <>
                <div className="w-80 h-48 xs:h-36 border-2 rounded-lg bg-theme-color-001"></div>
              </>
            )}
            <div className="flex-1 xs:flex-none border-r-2 border-r-slate-200 xs:border-r-0">
              <div className="flex gap-2">
                {useCheckIsToday(new Date(String(detail?.moimDate))) && (
                  <>
                    <div className="w-9 h-5 bg-badge-red-001 text-badge-red-002 rounded text-[10px] flex justify-center items-center">
                      오늘
                    </div>
                  </>
                )}
                <div className="w-11 h-5 bg-badge-green-001 text-badge-green-002 rounded text-[10px] flex justify-center items-center">
                  {cateMapping[String(detail?.moimCate)]}
                </div>
              </div>
              <p className="text-3xl font-bold mt-2 xs:text-2xl">
                {detail?.moimTitle}
              </p>
              <p className="text-lg mt-4 xs:text-base">{detail?.moimIntro}</p>
            </div>
            <div>
              <div className="flex flex-col xs:flex-row xs:items-center gap-7 xs:gap-3">
                <p className="text-xl font-semibold xs:text-xl">
                  현재 모임 인원
                </p>
                <div className="flex items-end justify-center xs:justify-start">
                  <p className="text-6xl xs:text-3xl font-semibold text-theme-main-color">
                    {useMemberCount(String(moimid))}
                  </p>
                  <p className="text-2xl font-semibold">
                    /{detail?.moimMemberNum}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full bg-white rounded-2xl shadow flex flex-col px-14 py-16 gap-10">
            <div className="flex flex-col gap-10">
              <p className="text-2xl font-bold underline underline-offset-4 decoration-theme-main-color decoration-4">
                모임 소개
              </p>
              <p>{detail?.moimText}</p>
            </div>
            <hr />
            <div className="flex flex-col gap-10">
              <p className="text-2xl font-bold underline underline-offset-4 decoration-theme-main-color decoration-4">
                모임 일정
              </p>
              <p className="text-3xl xs:text-xl font-semibold">
                {detail?.moimDate}
              </p>
            </div>
            <hr />
            <div className="flex flex-col gap-10">
              <p className="text-2xl font-bold underline underline-offset-4 decoration-theme-main-color decoration-4">
                모임 장소
              </p>
              <p className="text-3xl xs:text-xl font-semibold">
                {`${detail?.moimLocation}` +
                  " " +
                  `${detail?.moimLocationDetail}`}
              </p>
            </div>
            <hr />
            <div className="flex flex-col gap-10">
              <p className="text-2xl font-bold underline underline-offset-4 decoration-theme-main-color decoration-4">
                모임원
              </p>
              <div className="flex flex-wrap gap-12 justify-center">
                {renderMembers(member)}
              </div>
            </div>
          </div>
          {isMoimMember ? (
            <></>
          ) : isWaitingMember ? (
            <>
              <p className="bg-custom-gray-001 text-custom-gray-002 text-xl xs:text-lg font-normal p-2 px-3 rounded">
                승인 대기중
              </p>
            </>
          ) : isPast ? (
            <></>
          ) : isFullMoim ? (
            <></>
          ) : (
            <button
              className="bg-[#32d998] hover:bg-[#12d68a] text-xl xs:text-lg font-normal text-white rounded p-2 px-3"
              onClick={handleRegister}
            >
              모임 가입하기
            </button>
          )}
        </div>
      </section>
    </>
  );
};

export default MoimDetailPage;
