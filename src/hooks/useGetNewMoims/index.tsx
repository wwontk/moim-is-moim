import { useEffect, useMemo, useState } from "react";
import { MoimObjectType } from "../../types/Moim";
import {
  limitToLast,
  onValue,
  orderByChild,
  query,
  ref,
} from "firebase/database";
import { database } from "../../firebase";

const useGetNewMoims = () => {
  const [newMoims, setNewMoims] = useState<MoimObjectType[]>([]);

  const moimsQuery = useMemo(() => {
    const moimsRef = ref(database, "moims");
    return query(moimsRef, orderByChild("createdAt"), limitToLast(2));
  }, []);

  useEffect(() => {
    const unsubscribe = onValue(
      moimsQuery,
      (snapshot) => {
        if (snapshot.exists()) {
          const moimList: MoimObjectType[] = Object.keys(snapshot.val()).map(
            (key) => ({
              moimId: key,
              ...snapshot.val()[key],
            })
          );
          setNewMoims(moimList.reverse());
        } else {
          setNewMoims([]);
        }
      },
      (error) => {
        console.error("Error fetching latest moims:", error);
      }
    );

    return () => unsubscribe();
  }, [moimsQuery]);

  return newMoims;
};

export default useGetNewMoims;
