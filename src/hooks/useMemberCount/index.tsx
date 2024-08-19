import { child, DataSnapshot, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../firebase";

const useMemberCount = (moimid: string) => {
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    const moimMemberRef = child(ref(database), `moims/${moimid}/moimMember`);

    const unsubscribe = onValue(moimMemberRef, (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        setMemberCount(snapshot.size);
      }
    });
    return () => unsubscribe();
  }, [moimid]);

  return memberCount;
};

export default useMemberCount;
