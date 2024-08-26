import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../../firebase";
import { useSelector } from "react-redux";
import { RootState } from "../../../types/User";
import { MoimObjectType } from "../../../types/Moim";
import MoimCard from "../../../components/ListItem/MoimCard";

const MyMoimPage = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [moimMemberList, setMoimMemberList] = useState<string[]>([]);
  const [moimMemberDetail, setMoimMemberDetail] = useState<MoimObjectType[]>(
    []
  );

  useEffect(() => {
    const moimMemberRef = ref(
      database,
      `users/${currentUser.uid}/mymoim/member`
    );

    const unsubscribe = onValue(moimMemberRef, (snapshot) => {
      if (snapshot.exists()) {
        const keys = Object.keys(snapshot.val());
        setMoimMemberList(keys);
      } else {
        setMoimMemberList([]);
      }
    });
    return () => unsubscribe();
  }, [currentUser.uid]);

  useEffect(() => {
    if (moimMemberList.length === 0) return;

    const fetchMoims = async () => {
      try {
        const moimPromises = moimMemberList.map((moimId) => {
          return new Promise((resolve, reject) => {
            const moimRef = ref(database, `moims/${moimId}`);
            onValue(
              moimRef,
              (snapshot) => {
                if (snapshot.exists()) {
                  resolve({ moimId, ...snapshot.val() });
                } else {
                  resolve(null); // 모임이 없을 경우 null로 처리
                }
              },
              reject
            );
          });
        });

        const moimResults = await Promise.all(moimPromises);

        const validMoims = moimResults.filter(
          (moim): moim is MoimObjectType => moim !== null && moim !== undefined
        );
        setMoimMemberDetail(validMoims);
      } catch (error) {
        console.error("Error fetching moims:", error);
      }
    };

    fetchMoims();
  }, [moimMemberList]);

  const renderMoims = (moims: MoimObjectType[]) => {
    return (
      moims.length > 0 &&
      moims.map((moim) => <MoimCard key={moim.moimId} moim={moim} />)
    );
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-2xl">내가 모임원인 모임</p>
          <div className="flex gap-8">{renderMoims(moimMemberDetail)}</div>
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-2xl">내가 모임장인 모임</p>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default MyMoimPage;
