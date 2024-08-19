import { useEffect, useState } from "react";
import { MoimObjectType } from "../../types/Moim";
import { get, limitToLast, orderByChild, query, ref } from "firebase/database";
import { database } from "../../firebase";

const useTopMoimsByViews = () => {
  const [topMoims, setTopMoims] = useState<MoimObjectType[]>([]);

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

  return topMoims;
};

export default useTopMoimsByViews;
