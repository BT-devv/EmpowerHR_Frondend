import Slidebar from "../components/Slidebar";
import Navbar from "../components/Navbar";
const Comingsoon = () => {
  return (
    <div className="flex">
      <Slidebar className="w-[250px] z-[50] relative" />
      <div className="flex flex-col flex-grow w-screen">
        <Navbar className="z-[50] relative" />
        <div className="flex flex-col items-center justify-center bg-[#CCE0D8] w-full h-full relative overflow-hidden">
          {/* Shapes */}
          <div className="absolute top-[73%] left-[75%] z-[5] h-[585px] w-[585px] opacity-[70%] bg-white rounded-[32px] rotate-45"></div>
          <div className="absolute top-[-15%] left-[30%] z-[1] h-[434px] w-[170px] opacity-[40%] bg-[#73FFC4] rounded-[48px] rotate-45"></div>
          <div className="absolute top-[-15%] left-[-5%] z-[5] h-[585px] w-[585px] opacity-[70%] bg-white rounded-[48px] rotate-45"></div>
          {/* Texts */}
          <div className="flex flex-col relative z-[50]">
            <p className="text-[#18533A] font-extrabold text-[60px] ml-[-115%] mt-[-50%]">
              LAUNCHING
            </p>
            <p className="text-[#22855B] font-extrabold text-[130px] border-white [text-shadow:-2px_-2px_0_white,2px_-2px_0_white,-2px_2px_0_white,2px_2px_0_white,-2px_0px_0_white,2px_0px_0_white,0px_-2px_0_white,0px_2px_0_white] ml-[-50%] mt-[-6%]">
              SOON
            </p>
            <p className="text-[22px] mt-[-6%] ml-[-50%]">
              This page under construction
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comingsoon;
