import { useSelector } from "react-redux";
import { RootState } from "../../../types/User";
import moment from "moment";

interface MessageObjectType {
  timestamp: number;
  contentMsg: string;
  user: {
    uid: string;
    profile: string;
    name: string;
  };
}

const Message = ({ message }: { message: MessageObjectType }) => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const timeFromNow = (timestamp: number) => moment(timestamp).fromNow();

  return (
    <>
      {currentUser.uid === message.user.uid ? (
        <>
          <div className="flex justify-end gap-2">
            <div className="flex items-end text-xs text-gray-200">
              {timeFromNow(message.timestamp)}
            </div>
            <div className="flex flex-col gap-1">
              <p className="bg-theme-main-color text-white p-2 rounded-b-xl rounded-tl-xl">
                {message.contentMsg}
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-2">
            <img
              src={message.user.profile}
              alt=""
              className="w-10 h-10 object-cover rounded-full"
            />
            <div className="flex flex-col gap-1">
              <p className="font-medium">{message.user.name}</p>
              <p className="bg-white p-2 rounded-b-xl rounded-tr-xl">
                {message.contentMsg}
              </p>
            </div>
            <div className="flex items-end text-xs text-gray-200">
              {timeFromNow(message.timestamp)}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Message;
