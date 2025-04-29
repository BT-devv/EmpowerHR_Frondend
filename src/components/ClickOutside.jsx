import { useEffect, useRef } from "react";
const ClickOutside = ({ setIsOpen, children }) => {
  const wrapperRef = useRef(null);

  // Prevent click outside
  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="relative inline-block text-left" ref={wrapperRef}>
      {children}
    </div>
  );
};
export default ClickOutside;
