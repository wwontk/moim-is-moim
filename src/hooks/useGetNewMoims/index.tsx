import { useEffect, useMemo, useState } from "react";
import { MoimObjectType } from "../../types/Moim";
import { get, limitToLast, orderByChild, query, ref } from "firebase/database";
import { database } from "../../firebase";

const useGetNewMoims = () => {
  const [newMoims, setNewMoims] = useState<MoimObjectType[]>([]);

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

  return newMoims;
};

export default useGetNewMoims;
