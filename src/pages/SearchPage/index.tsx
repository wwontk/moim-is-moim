import { useSearchParams } from "react-router-dom";
import useGetMoimsByKeyword from "../../hooks/useGetMoimsByKeyword";
import { MoimObjectType } from "../../types/Moim";
import MoimCard from "../../components/ListItem/MoimCard";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");

  const filteredMoims = useGetMoimsByKeyword(String(keyword));

  const renderMoims = (moims: MoimObjectType[]) => {
    return (
      moims.length > 0 &&
      moims.map((moim) => <MoimCard key={moim.moimId} moim={moim} />)
    );
  };

  return (
    <>
      <section className="w-[1000px] xs:w-[350px] m-auto">
        <div className="xs:hidden bg-white rounded-xl border p-4 flex flex-col gap-4 mt-12">
          <p className="font-medium text-xl">검색결과</p>
          <div className="flex gap-4 flex-wrap">
            {renderMoims(filteredMoims)}
          </div>
        </div>
        <div className="hidden xs:flex rounded-xl flex-col gap-4 mt-12">
          <p className="font-medium text-xl">검색결과</p>
          <div className="flex gap-4 flex-wrap">
            {renderMoims(filteredMoims)}
          </div>
        </div>
      </section>
    </>
  );
};

export default SearchPage;
