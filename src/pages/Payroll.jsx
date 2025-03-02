import Slidebar from "../components/Slidebar";
import Navbar from "../components/Navbar";
const Payroll = () => {
  return (
    <div className="flex">
      <Slidebar />
      <div className="flex flex-col flex-grow w-screen">
        <Navbar />
      </div>
    </div>
  );
};

export default Payroll;
