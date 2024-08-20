import { child, onValue, orderByChild, query, ref } from "firebase/database";
import MoimCard from "../../components/ListItem/MoimCard";
import { database } from "../../firebase";
import { MoimObjectType } from "../../types/Moim";
import { useCallback, useEffect, useState } from "react";

const CategoryListPage = () => {
  const dbRef = ref(database);

  const [moims, setMoims] = useState<MoimObjectType[]>([]);
  const [sortedOption, setSortedOption] = useState<string>("all");

  const addMoimsListener = useCallback(() => {
    let moimQuery;

    if (sortedOption === "popular") {
      moimQuery = query(child(dbRef, "moims"), orderByChild("views"));
    } else if (sortedOption === "new") {
      moimQuery = query(child(dbRef, "moims"), orderByChild("createdAt"));
    } else {
      moimQuery = child(dbRef, "moims");
    }

    onValue(moimQuery, (snapshot) => {
      const moimsArray: Array<MoimObjectType> = [];
      snapshot.forEach((childSnapshot) => {
        const moimData = {
          moimId: childSnapshot.key,
          ...childSnapshot.val(),
        };
        moimsArray.push(moimData);
      });
      if (sortedOption === "popular" || sortedOption === "new") {
        setMoims(moimsArray.reverse());
      } else {
        setMoims(moimsArray);
      }
    });
  }, [dbRef, sortedOption]);

  useEffect(() => {
    addMoimsListener();
  }, [addMoimsListener]);

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
            <p>우리 지역 모임</p>
          </div>
          <select
            name="sort"
            id="sort"
            className="w-28 py-[10px] px-4 border-2 rounded-xl"
            value={sortedOption}
            onChange={handleSortedChange}
          >
            <option value="all">전체</option>
            <option value="popular">인기순</option>
            <option value="new">최신순</option>
          </select>
        </div>
        <div className={`flex flex-wrap gap-8`}>{renderMoims(moims)}</div>
      </div>
    </>
  );
};

export default CategoryListPage;
