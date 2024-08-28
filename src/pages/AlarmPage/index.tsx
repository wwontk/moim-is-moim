import { ref, remove } from "firebase/database";
import useGetAlarm from "../../hooks/useGetAlarm";
import { database } from "../../firebase";
import { useSelector } from "react-redux";
import { RootState } from "../../types/User";
import AlarmList from "../../components/common/AlarmList";

const AlarmPage = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const alarms = useGetAlarm();

  const handleDeleteAlarm = async (key: string) => {
    await remove(ref(database, `users/${currentUser.uid}/alarm/${key}`));
  };

  return (
    <>
      <section className="w-[1000px] xs:w-[350px] m-auto">
        <div className="p-2 mt-2">
          <p className="font-semibold text-2xl mb-3">알림</p>
          <div className="flex flex-col gap-3">
            <AlarmList alarms={alarms} handleDeleteAlarm={handleDeleteAlarm} />
          </div>
        </div>
      </section>
    </>
  );
};

export default AlarmPage;
