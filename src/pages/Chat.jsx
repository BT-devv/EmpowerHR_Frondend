import avatar from "../assets/avatar.png";
import UsePermission from "../components/UsePermission";
import { useEffect } from "react";
// Icon
import { CiSearch } from "react-icons/ci";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  const { hasPermission, loading } = UsePermission("message.read");

  useEffect(() => {
    if (!loading && !hasPermission) {
      navigate("/notpermission");
    }
  }, [loading, hasPermission]);

  if (loading) return <div></div>;
  return (
    <div className="flex bg-[#F5F6FA] w-auto h-full relative font-light">
      {/* Sidebar */}
      <div className="w-[300px] min-w-[300px] font-sans flex flex-col items-center text-[14px] caret-transparent border-r-2 bg-white">
        {/* Search */}
        <div className="relative mt-4 w-[90%]">
          <CiSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="h-[30px] w-full pl-10 rounded-[19px] border-2 bg-white border-gray-300 focus:outline-none text-[13px] focus:border-[#2EB67D] hover:border-[#2EB67D]"
          />
        </div>

        {/* Group Section */}
        <p className="flex font-bold mt-5 text-left w-[90%]">Group</p>
        {/* Account Items */}
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-center text-left mt-2 w-[90%]">
            <img
              alt="avatar"
              src={avatar}
              className="w-[45px] h-[45px] rounded-full"
            />
            <div className="ml-4">
              <p className="font-bold">HR - PM Connectivity</p>
              <p className="truncate text-gray-500 w-[90%]">
                Tuan: I gonna do this tomorrow, ask
              </p>
            </div>
          </div>
        ))}

        {/* Divider */}
        <div className="bg-gray-300 w-[90%] h-0.5 mt-5"></div>

        {/* People Section */}
        <p className="flex font-bold mt-5 text-left w-[90%]">People</p>
        {[1, 2].map((item) => (
          <div key={item} className="flex items-center text-left mt-2 w-[90%]">
            <img
              alt="avatar"
              src={avatar}
              className="w-[45px] h-[45px] rounded-full"
            />
            <div className="ml-4">
              <p className="font-bold">HR - PM Connectivity</p>
              <p className="truncate text-gray-500 w-[90%]">
                Tuan: I gonna do this tomorrow, ask
              </p>
            </div>
          </div>
        ))}

        {/* New Message Button */}
        <div className="flex justify-center w-full mt-auto mb-5">
          <button className="border-2 p-3 border-[#2EB67D] text-[#2EB67D] rounded-[10px] w-[210px] font-bold">
            NEW MESSAGE
          </button>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex flex-col flex-1 h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-2 bg-[#2EB67D] border-b-2">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="font-bold text-white">HR - PM Connectivity</p>
              <p className="text-xs text-white text-left">Online</p>
            </div>
          </div>
          <div className="text-white hover:text-gray-700 text-2xl">
            <HiOutlineInformationCircle />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#F5F6FA]">
          {/* Message Item Left */}
          <div className="flex mb-4">
            <img
              src={avatar}
              alt="avatar"
              className="w-8 h-8 rounded-full mr-2"
            />
            <div className="bg-white p-3 rounded-lg shadow max-w-xs">
              <p className="text-sm">{`Hey team, let's do it!`}</p>
            </div>
          </div>

          {/* Message Item Right */}
          <div className="flex mb-4 justify-end">
            <div className="bg-[#2EB67D] text-white p-3 rounded-lg shadow max-w-xs">
              <p className="text-sm">{`Sure, I'm on it 🚀`}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center p-2 border-t-2 bg-white">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#2EB67D]"
          />
          <button className="ml-2 text-[#2EB67D] border-[#2EB67D] font-bold">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
