import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../../firebase";
import { useSelector } from "react-redux";
import { RootState } from "../../../types/User";
import { MoimObjectType } from "../../../types/Moim";
import MoimCard from "../../../components/ListItem/MoimCard";
import { useNavigate } from "react-router-dom";

const MyMoimPage = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser.isLogin) {
      navigate("/login");
    }
  }, [currentUser.isLogin, navigate]);

  const [moimMemberList, setMoimMemberList] = useState<string[]>([]);
  const [moimMemberDetail, setMoimMemberDetail] = useState<MoimObjectType[]>(
    []
  );
  const [moimMasterList, setMoimMasterList] = useState<string[]>([]);
  const [moimMasterDetail, setMoimMasterDetail] = useState<MoimObjectType[]>(
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

  useEffect(() => {
    const moimMasterRef = ref(
      database,
      `users/${currentUser.uid}/mymoim/master`
    );

    const unsubscribe = onValue(moimMasterRef, (snapshot) => {
      if (snapshot.exists()) {
        const keys = Object.keys(snapshot.val());
        setMoimMasterList(keys);
      } else {
        setMoimMasterList([]);
      }
    });
    return () => unsubscribe();
  }, [currentUser.uid]);

  useEffect(() => {
    if (moimMasterList.length === 0) return;

    const fetchMoims = async () => {
      try {
        const moimPromises = moimMasterList.map((moimId) => {
          return new Promise((resolve, reject) => {
            const moimRef = ref(database, `moims/${moimId}`);
            onValue(
              moimRef,
              (snapshot) => {
                if (snapshot.exists()) {
                  resolve({ moimId, ...snapshot.val() });
                } else {
                  resolve(null);
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
        setMoimMasterDetail(validMoims);
      } catch (error) {
        console.error("Error fetching moims:", error);
      }
    };

    fetchMoims();
  }, [moimMasterList]);

  const renderMoims = (moims: MoimObjectType[]) => {
    return (
      moims.length > 0 &&
      moims.map((moim) => <MoimCard key={moim.moimId} moim={moim} />)
    );
  };

  return (
    <>
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-2xl">내가 모임원인 모임</p>
          <div className="flex xs:flex-col gap-8 xs:gap-4">
            {moimMemberDetail.length > 0 ? (
              renderMoims(moimMemberDetail)
            ) : (
              <>
                <div className="p-3 xs:w-[350px] xs:h-36 xs:flex xs:justify-center xs:items-center bg-white rounded-2xl shadow-sm text-gray-400">
                  <p>해당하는 모임이 존재하지 않습니다 😂</p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-2xl">내가 모임장인 모임</p>
          <div className="flex xs:flex-col gap-8 xs:gap-4">
            {moimMasterDetail.length > 0 ? (
              renderMoims(moimMasterDetail)
            ) : (
              <>
                <div className="p-3 xs:w-[350px] xs:h-36 xs:flex xs:justify-center xs:items-center bg-white rounded-2xl shadow-sm text-gray-400">
                  <p>해당하는 모임이 존재하지 않습니다 😂</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyMoimPage;
