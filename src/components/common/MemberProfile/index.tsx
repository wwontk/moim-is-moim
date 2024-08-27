import { MemberObjectType } from "../../../types/Moim";

interface MemberProfileProps {
  member: MemberObjectType;
  moimMasterId: string | undefined;
}

const MemberProfile: React.FC<MemberProfileProps> = ({
  member,
  moimMasterId,
}) => {
  return (
    <>
      <div className="flex flex-col items-center gap-5 xs:gap-3">
        <img
          src={member.profile}
          alt="profile_photo"
          className="w-28 h-28 xs:w-16 xs:h-16 rounded-full object-cover"
        />
        <div className="flex items-center gap-2">
          {member.uid === moimMasterId && (
            <>
              <div className="w-9 h-5 bg-badge-green-001 text-badge-green-002 rounded text-[10px] flex justify-center items-center">
                모임장
              </div>
            </>
          )}
          <p className="text-xl xs:text-base font-semibold">{member.name}</p>
        </div>
      </div>
    </>
  );
};

export default MemberProfile;
