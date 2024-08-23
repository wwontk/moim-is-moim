import moment from "moment";
import { useEffect, useState } from "react";

const useCheckIsPast = (moimDate: string) => {
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const moimDateObject = moment(moimDate, "YYYY.MM.DD HH:mm");
    const now = moment();

    setIsPast(moimDateObject.isBefore(now));
  }, [moimDate]);

  return isPast;
};

export default useCheckIsPast;
