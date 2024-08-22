import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosSend } from "react-icons/io";
import useInput from "../../hooks/useInput";
import {
  child,
  off,
  onChildAdded,
  onValue,
  push,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";
import { database } from "../../firebase";
import { useSelector } from "react-redux";
import { RootState } from "../../types/User";
import Message from "../../components/common/Message";
import { MoimObjectType } from "../../types/Moim";

interface MessageObjectType {
  timestamp: number;
  contentMsg: string;
  user: {
    uid: string;
    profile: string;
    name: string;
  };
}

const MoimChattingPage = () => {
  const navigate = useNavigate();
  const { moimid } = useParams();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const [content, setContent, handleChangeContent] = useInput("");

  const [messages, setMessages] = useState<MessageObjectType[]>([]);
  const [detail, setDetail] = useState<MoimObjectType>();

  const messagesRef = useMemo(() => ref(database, "chat"), []);

  const messageEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

  const createMessage = () => {
    const message = {
      timestamp: serverTimestamp(),
      contentMsg: content,
      user: {
        uid: currentUser.uid,
        profile: currentUser.photoURL,
        name: currentUser.displayName,
      },
    };

    return message;
  };

  const addDetailListener = useCallback(() => {
    const onDetailValue = onValue(
      child(ref(database), `moims/${moimid}`),
      (snapshot) => {
        if (snapshot.exists()) {
          setDetail(snapshot.val());
        } else {
          console.log("No data available");
        }
      },
      (error) => {
        console.error(error);
      }
    );

    return () => {
      onDetailValue();
    };
  }, [moimid]);

  const addMessagesListener = useCallback(
    (moimid: string) => {
      const messagesArray: Array<MessageObjectType> = [];

      onChildAdded(child(messagesRef, moimid), (DataSnapshot) => {
        messagesArray.push(DataSnapshot.val());
        const newMessagesArray = [...messagesArray];

        setMessages(newMessagesArray);
      });
    },
    [messagesRef]
  );

  useEffect(() => {
    if (moimid) {
      addMessagesListener(moimid);
    }

    return () => {
      off(messagesRef);
    };
  }, [moimid, addMessagesListener, messagesRef]);

  useEffect(() => {
    addDetailListener();
  }, [addDetailListener]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!content) return;

    try {
      await set(push(child(messagesRef, String(moimid))), createMessage());
      setContent("");
    } catch (error) {
      console.log(error);
    }
  };

  const renderMessages = (messages: MessageObjectType[]) => {
    return (
      messages.length > 0 &&
      messages.map((message) => (
        <Message key={message.timestamp} message={message} />
      ))
    );
  };

  return (
    <>
      <section className="w-[1000px] m-auto">
        <div>
          <div className="w-[1000px] h-20 bg-white fixed top-0 z-10 rounded-b-xl shadow flex items-center px-5 gap-3">
            <IoArrowBack
              size={24}
              onClick={() => {
                navigate(-1);
              }}
              className="cursor-pointer"
            />
            <div className="flex items-center gap-4">
              {detail?.moimPhoto ? (
                <img
                  src={detail?.moimPhoto}
                  alt=""
                  className="w-14 h-14 object-cover rounded-full"
                />
              ) : (
                <div className="w-14 h-14 bg-theme-color-002 rounded-full"></div>
              )}

              <p className="text-xl font-semibold">{detail?.moimTitle}</p>
            </div>
          </div>
          <div className="my-20 p-3 flex flex-col gap-3">
            {renderMessages(messages)}
            <div ref={messageEndRef}></div>
          </div>
          <div className="w-[1000px] h-20 bg-white fixed bottom-0 rounded-t-xl shadow flex items-center">
            <form
              className="flex w-full p-4 items-center gap-4"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                value={content}
                className="h-10 bg-gray-50 rounded-xl flex-1 focus:outline-none p-3"
                placeholder="메시지를 입력하세요."
                onChange={handleChangeContent}
              />
              <button className="w-10 h-10 bg-theme-main-color rounded-full flex items-center justify-center text-white">
                <IoIosSend size={24} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default MoimChattingPage;
