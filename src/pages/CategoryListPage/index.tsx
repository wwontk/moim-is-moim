import { child, onChildAdded, ref } from "firebase/database";
import MoimCard from "../../components/ListItem/MoimCard";
import { database } from "../../firebase";
import { MoimObjectType } from "../../types/Moim";
import { useCallback, useEffect, useState } from "react";

const CategoryListPage = () => {
  const dbRef = ref(database);

  const [moims, setMoims] = useState<MoimObjectType[]>([]);

  const addMoimsListener = useCallback(() => {
    const moimsArray: Array<MoimObjectType> = [];

    onChildAdded(child(dbRef, `moims`), (DataSnapshot) => {
      const moimData = {
        moimId: DataSnapshot.key,
        ...DataSnapshot.val(),
      };

      moimsArray.push(moimData);
      const newMoimsArray = [...moimsArray];

      setMoims(newMoimsArray);
    });
  }, [dbRef]);

  useEffect(() => {
    addMoimsListener();
  }, [addMoimsListener]);

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
        <div className={`flex flex-wrap gap-8`}>{renderMoims(moims)}</div>
      </div>
    </>
  );
};

export default CategoryListPage;
