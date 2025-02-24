import Slidebar from "../components/Slidebar";
import Navbar from "../components/Navbar";
import ReactLoading from "react-loading";
const Comingsoon = () => {
  return (
    <div className="flex ">
      <Slidebar className="w-[250px]" />
      <div className="flex flex-col flex-grow w-full">
        <Navbar />
        <div className="flex flex-col items-center justify-center mt-[5%]">
          <h1 className="mt-[60px]">COMING SOON</h1>
          <p className="mt-[20px] text-center">
            We will be celebrating the launch of our new site very soon!
          </p>
          <ReactLoading
            type={"cylon"}
            color={"#2EB67D"}
            height={"10%"}
            width={"10%"}
          />
        </div>
      </div>
    </div>
  );
};

export default Comingsoon;
