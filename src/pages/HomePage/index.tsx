import { Link } from "react-router-dom";
import CategoryList from "../../components/common/CategoryList";
import NewCard from "../../components/ListItem/NewCard";
import PopularCard from "../../components/ListItem/PopularCard";
import { useEffect, useMemo, useState } from "react";
import { MoimObjectType } from "../../types/Moim";
import { get, limitToLast, orderByChild, query, ref } from "firebase/database";
import { database } from "../../firebase";

const HomePage = () => {
  const [newMoims, setNewMoims] = useState<MoimObjectType[]>([]);
  const [topMoims, setTopMoims] = useState<MoimObjectType[]>([]);

  const moimsQuery = useMemo(() => {
    const moimsRef = ref(database, "moims");
    return query(moimsRef, orderByChild("createdAt"), limitToLast(2));
  }, []);

  useEffect(() => {
    const fetchLatestMoims = async () => {
      try {
        const snapshot = await get(moimsQuery);
        if (snapshot.exists()) {
          const moimList: MoimObjectType[] = Object.keys(snapshot.val()).map(
            (key) => ({
              moimId: key,
              ...snapshot.val()[key],
            })
          );
          setNewMoims(moimList);
        } else {
          setNewMoims([]); // 데이터가 없을 때 빈 배열 설정
        }
      } catch (error) {
        console.error("Error fetching latest moims:", error);
      }
    };

    fetchLatestMoims();
  }, [moimsQuery]);

  useEffect(() => {
    const fetchTopMoims = async () => {
      try {
        const moimsRef = ref(database, "moims");
        const topMoimsQuery = query(
          moimsRef,
          orderByChild("views"),
          limitToLast(3)
        );
        const snapshot = await get(topMoimsQuery);
        if (snapshot.exists()) {
          const moimList: MoimObjectType[] = Object.keys(snapshot.val()).map(
            (key) => ({
              moimId: key,
              ...snapshot.val()[key],
            })
          );
          const sortedMoims = moimList.sort((a, b) => b.views - a.views);
          setTopMoims(sortedMoims);
        } else {
          setTopMoims([]); // 데이터가 없을 때 빈 배열 설정
        }
      } catch (error) {
        console.error("Error fetching latest moims:", error);
      }
    };

    fetchTopMoims();
  }, []);

  const renderNewMoims = (moims: MoimObjectType[]) => {
    return (
      moims.length > 0 &&
      moims.map((moim) => <NewCard key={moim.moimId} moim={moim} />)
    );
  };

  const renderTopMoims = (moims: MoimObjectType[]) => {
    return (
      moims.length > 0 &&
      moims.map((moim) => <PopularCard key={moim.moimId} moim={moim} />)
    );
  };

  return (
    <>
      <div>
        <section className="w-[1000px] m-auto">
          <div className="flex flex-col py-14 gap-8">
            <p className="font-bold text-2xl text-custom-gray-001">
              오늘의 인기모임이 모임?
            </p>
            <div className="flex justify-between">
              {renderTopMoims(topMoims)}
            </div>
          </div>
        </section>
      </div>
      <div className="bg-white">
        <section className="w-[1000px] m-auto">
          <div className="flex flex-col py-14 gap-14">
            <div className="flex items-center justify-between">
              <p className="font-bold text-2xl text-custom-gray-001">
                원하는 모임을 선택하세요
              </p>
              <Link to={"/categorylist"}>
                <p className="text-custom-gray-002 text-sm">목록 전체보기</p>
              </Link>
            </div>
            <CategoryList />
          </div>
        </section>
      </div>
      <div>
        <section className="w-[1000px] m-auto">
          <div className="flex flex-col py-14">
            <p className="font-bold text-2xl text-custom-gray-001 mb-10">
              새로 올라온 모임을 확인해보세요
            </p>
            <div className="flex flex-col gap-7">
              {renderNewMoims(newMoims)}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
