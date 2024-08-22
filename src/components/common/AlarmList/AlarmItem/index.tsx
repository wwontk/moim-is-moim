// AlarmItem.tsx
import React from "react";
import { Link } from "react-router-dom";

interface AlarmItemProps {
  alarm: {
    id: string;
    data: {
      type: string;
      moimId: string;
      moimPhoto: string;
      moimTitle: string;
      msg: string;
    };
  };
  handleDeleteAlarm: (id: string) => void;
}

const AlarmItem: React.FC<AlarmItemProps> = ({ alarm, handleDeleteAlarm }) => {
  return alarm.data.type === "welcome" ? (
    <Link to={`/moim/${alarm.data.moimId}`}>
      <div
        key={alarm.id}
        className="flex flex-col gap-1 shadow p-3 rounded"
        onClick={() => handleDeleteAlarm(alarm.id)}
      >
        <div className="flex gap-2 items-center">
          <img
            src={alarm.data.moimPhoto}
            alt={`moim_photo`}
            className="w-7 h-7 rounded-full object-cover"
          />
          <p>{alarm.data.moimTitle}</p>
        </div>
        <div>{alarm.data.msg}</div>
      </div>
    </Link>
  ) : (
    <div
      key={alarm.id}
      className="flex flex-col gap-1 shadow p-3 rounded cursor-pointer"
      onClick={() => handleDeleteAlarm(alarm.id)}
    >
      <div className="flex gap-2 items-center">
        <img
          src={alarm.data.moimPhoto}
          alt={`moim_photo`}
          className="w-7 h-7 rounded-full object-cover"
        />
        <p>{alarm.data.moimTitle}</p>
      </div>
      <div>{alarm.data.msg}</div>
    </div>
  );
};

export default AlarmItem;
