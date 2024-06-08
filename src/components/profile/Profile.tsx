import { Tabs, Tab, Divider } from "@nextui-org/react";
import { Key, Suspense, useState } from "react";
import { MainInformation } from "./MainInformation";

export const Profile = () => {
  const [selectedTab, setSelectedTab] = useState<Key>("profile");

  return (
    <div className="mx-auto max-w-3xl py-6">
      <div className="font-semibold text-xl">My profile</div>
      <Tabs
        variant="underlined"
        aria-label="Tabs variants"
        className="p-0 w-full"
        selectedKey={selectedTab}
        onSelectionChange={setSelectedTab}
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full",
          tab: "max-w-fit px-0 h-12",
        }}
      >
        <Tab key="profile" title="Profile" />
        <Tab key="settings" title="Settings" />
      </Tabs>
      {selectedTab === "profile" && (
        <Suspense fallback="Loading...">
          <MainInformation />
        </Suspense>
      )}
    </div>
  );
};
