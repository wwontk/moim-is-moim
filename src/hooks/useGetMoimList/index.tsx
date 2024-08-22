import { onValue, ref } from "firebase/database";
import { database } from "../../firebase";
import { useEffect, useState } from "react";

const useGetMoimList = () => {
  const [moimList, setMoimList] = useState<string[]>([]);

  useEffect(() => {
    const moimsRef = ref(database, "moims");
    const unsubscribe = onValue(
      moimsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setMoimList(Object.keys(data));
        }
      },
      (error) => {
        console.log(error);
      }
    );

    return () => unsubscribe();
  }, []);

  return moimList;
};

export default useGetMoimList;
