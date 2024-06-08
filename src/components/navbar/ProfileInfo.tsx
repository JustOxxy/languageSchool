import { Routes } from "@blitzjs/next";
import { useMutation } from "@blitzjs/rpc";
import { Dropdown, DropdownTrigger, User, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { useRouter } from "next/router";
import logout from "src/auth/mutations/logout";
import { useCurrentUser } from "src/users/hooks/useCurrentUser";

export const ProfileInfo = () => {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const [logoutMutation] = useMutation(logout);

  const handleLogOut = () => {
    router.push(Routes.Home()).finally(() => logoutMutation());
  };

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <User
          as="button"
          avatarProps={{
            showFallback: true,
            isBordered: true,
            src: "https://images.unsplash.com/broken",
          }}
          className="transition-transform"
          description={currentUser?.email}
          name={currentUser?.name}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem key="profile" href="/account/profile">
          My Profile
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onAction={handleLogOut}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
