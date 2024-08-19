import { useEffect, useState } from "react";

const useCheckIsToday = (date: Date) => {
  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    const today = new Date();

    // 년, 월, 일만 비교하기 위해 시간 정보를 제거
    const isSameDate =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();

    setIsToday(isSameDate);
  }, [date]);

  return isToday;
};

export default useCheckIsToday;
