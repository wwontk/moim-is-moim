import { useEffect, useState } from "react";
import useMemberCount from "../useMemberCount";
import { onValue, ref } from "firebase/database";
import { database } from "../../firebase";

const useCheckFullMember = (moimId: string) => {
  const [isFull, setIsFull] = useState(false);
  const memberCount = useMemberCount(moimId);

  useEffect(() => {
    const moimRef = ref(database, `moims/${moimId}/moimMemberNum`);

    const unsubscribe = onValue(moimRef, (snapshot) => {
      if (snapshot.exists()) {
        const moimMemberNum = snapshot.val();
        const maxMemberCount = parseInt(moimMemberNum, 10);

        setIsFull(memberCount === maxMemberCount);
      } else {
        setIsFull(false);
      }
    });

    return () => unsubscribe();
  }, [moimId, memberCount]);

  return isFull;
};

export default useCheckFullMember;
