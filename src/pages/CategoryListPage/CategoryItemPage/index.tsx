import { equalTo, onValue, orderByChild, query, ref } from "firebase/database";
import { useParams } from "react-router-dom";
import { database } from "../../../firebase";
import { MoimObjectType } from "../../../types/Moim";
import { useEffect, useState } from "react";
import MoimCard from "../../../components/ListItem/MoimCard";
import { GoAlertFill } from "react-icons/go";

const CategoryItemPage = () => {
  const { categoryItem } = useParams();
  const [moims, setMoims] = useState<MoimObjectType[]>([]);

  useEffect(() => {
    const moimsRef = ref(database, "moims");
    const cateQuery = query(
      moimsRef,
      orderByChild("moimCate"),
      equalTo(String(categoryItem))
    );

    const unsubscribe = onValue(cateQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const moimList = Object.keys(data).map((key) => {
          return {
            ...data[key], // 기존 객체의 모든 필드를 복사
            moimId: key, // key를 moimId로 추가
          };
        });
        setMoims(moimList);
      } else {
        setMoims([]);
      }
    });

    // 컴포넌트 언마운트 시 리스너 제거
    return () => unsubscribe();
  }, [categoryItem]);

  const renderMoims = (moims: MoimObjectType[]) => {
    return (
      moims.length > 0 &&
      moims.map((moim) => <MoimCard key={moim.moimId} moim={moim} />)
    );
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <p>체크박스</p>
          <select
            name="sort"
            id="sort"
            className="w-28 py-[10px] px-4 border-2 rounded-xl"
          >
            <option value="popular">인기순</option>
            <option value="new">최신순</option>
            <option value="deadline">마감순</option>
          </select>
        </div>
        <div className={`flex flex-wrap gap-8 items-center`}>
          {renderMoims(moims)}
        </div>
        {moims.length === 0 && (
          <>
            <div className="flex flex-col items-center gap-4 mt-10">
              <GoAlertFill size={50} className="text-custom-gray-003" />
              <p className="text-custom-gray-003">아직 모임이 없어요🥹</p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CategoryItemPage;
