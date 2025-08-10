import React from "react";

import StatusIcon from "../Icons/StatusIcon";
import ChatIcon from "../Icons/ChatIcon";
import ChannelIcon from "../Icons/ChannelIcon";
import CommunityIcon from "../Icons/CommunityIcon";
import MetaIcon from "../assets/MetaIcon.png";
import SettingIcon from "../Icons/SettingIcon";
import UserIcon from "../Icons/UserIcon";

const StatusBar = () => {
  return (
    <div className="w-16 h-screen border-r border-[#f6eee5] bg-[#f7f5f3] flex flex-col justify-between items-center py-4 hidden lg:flex">
      {/* Top icons */}
      <div>
        <ul className="flex flex-col text-neutral-600 items-center gap-2">
          <li className="bg-neutral-200 rounded-full text-neutral-900 p-2">
            <ChatIcon />
          </li>
          <li className="hover:bg-neutral-200 rounded-full p-2 flex cursor-pointer">
            <StatusIcon />
          </li>
          <li className="hover:bg-neutral-200 rounded-full p-2 cursor-pointer">
            <ChannelIcon />
          </li>
          <li className="hover:bg-neutral-200 rounded-full p-2 cursor-pointer">
            <CommunityIcon />
          </li>
          <div className="border-t bg-amber-600 w-10 border-neutral-300"></div>
          <li className="hover:bg-neutral-200 rounded-full p-2 cursor-pointer">
            <img width={20} height={20} src={MetaIcon} alt="MetaIcon" />
          </li>
        </ul>
      </div>

      <div>
        <ul className="flex flex-col text-neutral-600 items-center gap-2">
          <li className="flex items-center justify-center hover:bg-neutral-200 p-2 rounded-full">
            <SettingIcon />
          </li>
          <li className="hover:bg-neutral-200 p-1 rounded-full">
            <UserIcon
              width={40}
              height={40}
              className="border bg-[#f7f5f3] border-neutral-300 flex items-center justify-center rounded-full"
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StatusBar;
