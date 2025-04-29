const TabSelector = ({
  tabs = [],
  selectedTab,
  onTabSelect,
  type = "line",
  wrapperClassName = "",
}) => {
  return (
    <div className={`flex ${wrapperClassName}`}>
      {tabs.map((tab) => (
        <p
          key={tab.key}
          className={`cursor-pointer transition-all caret-transparent
            ${
              type === "line"
                ? `py-6 border-b-2 ${
                    selectedTab === tab.key
                      ? "font-bold border-black"
                      : "border-transparent text-gray-500 hover:text-black"
                  }`
                : `font-light w-[10%] rounded-[10px] p-4 ${
                    selectedTab === tab.key
                      ? "bg-[#2EB67D] text-white"
                      : "bg-[#B8E4D2]"
                  }`
            }
          `}
          onClick={() => onTabSelect(tab.key)}
        >
          {tab.label}
        </p>
      ))}
    </div>
  );
};

export default TabSelector;
