import { useEffect, useState } from "react";
import { MoimObjectType } from "../../types/Moim";
import {
  limitToLast,
  onValue,
  orderByChild,
  query,
  ref,
} from "firebase/database";
import { database } from "../../firebase";

const useTopMoimsByViews = () => {
  const [topMoims, setTopMoims] = useState<MoimObjectType[]>([]);

  useEffect(() => {
    const moimsRef = ref(database, "moims");
    const topMoimsQuery = query(
      moimsRef,
      orderByChild("views"),
      limitToLast(3)
    );

    const unsubscribe = onValue(
      topMoimsQuery,
      (snapshot) => {
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
          setTopMoims([]);
        }
      },
      (error) => {
        console.error("Error fetching top moims by views:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  return topMoims;
};

export default useTopMoimsByViews;
