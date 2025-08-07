import React, { ReactNode } from "react";

function ToolIcon({
  icon,
  activated,
  onClick,
}: {
  icon: ReactNode;
  activated: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`!h-[40px] !w-[40px] flex-none text-white rounded-lg flex justify-center items-center  ${activated ? "bg-[#403e6a]" : "hover:bg-[#2e2d39]"} `}
      onClick={onClick}
    >
      {icon}
    </div>
  );
}

export default ToolIcon;
