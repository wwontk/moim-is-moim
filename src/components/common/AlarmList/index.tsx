import React from "react";
import { CiWarning } from "react-icons/ci";
import AlarmItem from "./AlarmItem";
import { AlarmWithKey } from "../../../hooks/useGetAlarm";

const AlarmList: React.FC<{
  alarms: AlarmWithKey[];
  handleDeleteAlarm: (id: string) => void;
}> = ({ alarms, handleDeleteAlarm }) => {
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
          <p className="text-zinc-300">알림이 없습니다</p>
        </div>
      )}
    </div>
  );
};

export default AlarmList;
