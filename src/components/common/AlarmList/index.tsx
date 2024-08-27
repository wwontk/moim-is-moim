import React from "react";
import { CiWarning } from "react-icons/ci";
import AlarmItem from "./AlarmItem";
import { AlarmWithKey } from "../../../hooks/useGetAlarm";
import { useSelector } from "react-redux";
import { RootState } from "../../../types/User";

const AlarmList: React.FC<{
  alarms: AlarmWithKey[];
  handleDeleteAlarm: (id: string) => void;
}> = ({ alarms, handleDeleteAlarm }) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  return (
    <div className="flex flex-col gap-3">
      {alarms.length ? (
        alarms.map((alarm) => (
          <AlarmItem
            key={alarm.id}
            alarm={alarm}
            handleDeleteAlarm={handleDeleteAlarm}
          />
        ))
      ) : (
        <div className="flex flex-col items-center">
          <CiWarning size={30} className="text-zinc-300" />
          {currentUser.isLogin ? (
            <p className="text-zinc-300">알림이 없습니다</p>
          ) : (
            <p className="text-zinc-300">
              알림을 확인하려면 로그인을 진행해주세요
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AlarmList;
