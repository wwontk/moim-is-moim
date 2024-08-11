import MoimCard from "../../components/ListItem/MoimCard";

const CategoryListPage = () => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <p>체크박스</p>
          <select
            name="sort"
            id="sort"
            className="w-28 py-[10px] px-4 border-2 rounded-xl"
          >
            <option value="popular">인기순</option>
            <option value="new">최신순</option>
            <option value="deadline">마감순</option>
          </select>
        </div>
        <div className="flex justify-between flex-wrap gap-7">
          <MoimCard />
          <MoimCard />
          <MoimCard />
          <MoimCard />
        </div>
      </div>
    </>
  );
};

export default CategoryListPage;
