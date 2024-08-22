import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../firebase";
import { useSelector } from "react-redux";
import { RootState } from "../../types/User";

interface AlarmType {
  createdAt: string;
  type: string;
  moimId: string;
  moimPhoto: string;
  moimTitle: string;
  msg: string;
}

export interface AlarmWithKey {
  id: string; // 알람의 key값
  data: AlarmType; // 알람 데이터
}

const useGetAlarm = () => {
  const [alarms, setAlarms] = useState<AlarmWithKey[]>([]);
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const alarmRef = ref(database, `users/${currentUser.uid}/alarm`);
    const unsubscribe = onValue(alarmRef, (snapshot) => {
      if (snapshot.exists()) {
        const alarmsWithKeys: AlarmWithKey[] = [];
        snapshot.forEach((childSnapshot) => {
          const key = childSnapshot.key;
          const value = childSnapshot.val();
          if (key && value) {
            alarmsWithKeys.push({
              id: key,
              data: value as AlarmType,
            });
          }
        });
        setAlarms(alarmsWithKeys);
      } else {
        setAlarms([]);
      }
    });

    // 컴포넌트 언마운트 시 리스너 제거
    return () => unsubscribe();
  }, [currentUser.uid]);

  return alarms;
};

export default useGetAlarm;
