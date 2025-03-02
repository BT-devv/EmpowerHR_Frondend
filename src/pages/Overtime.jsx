import Slidebar from "../components/Slidebar";
import Navbar from "../components/Navbar";
import RichTextEditor from "../components/RichTextEditor";

const Overtime = () => {
  // const [content, setContent] = useState("");
  return (
    <div className="flex">
      <Slidebar />
      <div className="flex flex-col flex-grow w-screen">
        <Navbar />
        <div className="flex flex-col bg-[#F5F6FA] w-full h-full relative">
          <div className="bg-[#FFFFFF] ml-[3%] mt-[2%] rounded-[10px] w-[77%] text-left shadow-[0px_1px_3px_rgba(0,0,0,0.2)]">
            <div className="mt-[3%] ml-[5%]">
              <p>Manager Approval</p>
              <input
                type="text"
                className="border-gray-200 rounded-[5px] border-[2px] w-[95%] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                // value={firstName}
                placeholder="Select Manager"
                // onChange={(e) => {
                //   setFirstName(e.target.value);
                // }}
              />
            </div>
            <div className="flex ml-[5%] space-x-12">
              <div className="mt-[3%]">
                <p>From</p>
                <input
                  type="text"
                  className="border-gray-200 rounded-[5px] border-[2px] w-[510px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                  // value={firstName}
                  placeholder="Select Manager"
                  // onChange={(e) => {
                  //   setFirstName(e.target.value);
                  // }}
                />
              </div>
              <div className="mt-[3%]">
                <p>To</p>
                <input
                  type="text"
                  className="border-gray-200 rounded-[5px] border-[2px] w-[510px] h-[50px] mt-[5px] pl-[10px] hover:border-[#2EB67D] hover:border-2 focus:border-[#2EB67D] focus:outline-none focus:border-2 placeholder:text-[#B8BDC5] placeholder:text-[14px] placeholder:font-light"
                  // value={firstName}
                  placeholder="Select Manager"
                  // onChange={(e) => {
                  //   setFirstName(e.target.value);
                  // }}
                />
              </div>
            </div>
            <div className="mt-[3%] ml-[5%]">
              <p>Reason</p>
              <div className="mt-[1%]">
                <RichTextEditor />
              </div>
              <div className="flex items-center justify-center mb-[3%]">
                <button
                  type="submit"
                  className="mt-[3%] bg-[#2EB67D] text-white outline-none w-[15%] text-[18px] focus:outline-none"
                  // onClick={handleSubmit}
                >
                  SUBMIT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overtime;
