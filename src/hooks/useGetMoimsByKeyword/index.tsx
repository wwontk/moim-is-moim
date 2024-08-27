import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../../firebase";
import { MoimObjectType } from "../../types/Moim";

const useGetMoimsByKeyword = (keyword: string) => {
  const [moims, setMoims] = useState<MoimObjectType[]>([]);
  const [filteredMoims, setFilteredMoims] = useState<MoimObjectType[]>([]);

  useEffect(() => {
    const fetchMoims = async () => {
      try {
        const moimsRef = ref(database, "moims");
        onValue(moimsRef, (snapshot) => {
          if (snapshot.exists()) {
            const moimData = snapshot.val();
            const moimList = Object.keys(moimData).map((key) => ({
              moimId: key,
              ...moimData[key],
            }));
            setMoims(moimList);
          } else {
            setMoims([]);
          }
        });
      } catch (error) {
        console.error("Error fetching moims:", error);
      }
    };

    fetchMoims();
  }, []);

  useEffect(() => {
    if (keyword) {
      const filtered = moims.filter((moim) => {
        const isTitleMatch = moim.moimTitle
          .toLowerCase()
          .includes(keyword.toLowerCase());
        const isIntroMatch = moim.moimIntro
          .toLowerCase()
          .includes(keyword.toLowerCase());
        const isTextMatch = moim.moimText
          .toLowerCase()
          .includes(keyword.toLowerCase());

        return isTitleMatch || isIntroMatch || isTextMatch;
      });

      setFilteredMoims(filtered);
    } else {
      setFilteredMoims(moims);
    }
  }, [keyword, moims]);

  return filteredMoims;
};

export default useGetMoimsByKeyword;
