import { equalTo, onValue, orderByChild, query, ref } from "firebase/database";
import { useNavigate, useParams } from "react-router-dom";
import { database } from "../../../firebase";
import { MoimObjectType } from "../../../types/Moim";
import { useEffect, useState } from "react";
import MoimCard from "../../../components/ListItem/MoimCard";
import { GoAlertFill } from "react-icons/go";
import { HiMiniPencilSquare } from "react-icons/hi2";

const CategoryItemPage = () => {
  const navigate = useNavigate();

  const { categoryItem } = useParams();
  const [moims, setMoims] = useState<MoimObjectType[]>([]);
  const [sortedOption, setSortedOption] = useState<string>("all");

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

        if (sortedOption === "popular") {
          moimList.sort((a, b) => b.views - a.views);
        } else if (sortedOption === "new") {
          moimList.sort((a, b) => b.createdAt - a.createdAt).reverse();
        }
        setMoims(moimList);
      } else {
        setMoims([]);
      }
    });

    return () => unsubscribe();
  }, [categoryItem, sortedOption]);

  const handleSortedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortedOption(e.target.value);
  };

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
          <div className="flex gap-2">
            <input type="checkbox" name="myregion" id="myregion" />
            <p className="xs:text-sm">우리 지역 모임</p>
          </div>
          <div className="flex gap-3">
            <select
              name="sort"
              id="sort"
              className="px-4 border rounded xs:text-sm"
              value={sortedOption}
              onChange={handleSortedChange}
            >
              <option value="all">전체</option>
              <option value="popular">인기순</option>
              <option value="new">최신순</option>
            </select>
            <button
              className="flex items-center justify-center gap-2 p-2 rounded border bg-white border-theme-main-color"
              onClick={() => navigate("/moim/create")}
            >
              <HiMiniPencilSquare className="text-theme-main-color xs:text-sm" />
              <p className="text-theme-main-color xs:text-sm">새 모임 생성</p>
            </button>
          </div>
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
