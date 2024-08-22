import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../firebase";

const useGetMoimMember = (moimid: string) => {
  const [members, setMembers] = useState<string[]>([]);

  useEffect(() => {
    const membersRef = ref(database, `moims/${moimid}/moimMember`);
    const unsubscribe = onValue(
      membersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const memberList = Object.keys(snapshot.val());
          setMembers(memberList);
        } else {
          setMembers([]); // 데이터가 없을 경우 빈 배열로 설정
        }
      },
      (error) => {
        console.error("Error fetching members:", error);
      }
    );

    return () => unsubscribe();
  }, [moimid]);

  return members;
};

export default useGetMoimMember;
