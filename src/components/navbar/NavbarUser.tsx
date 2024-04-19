import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { SignButtons } from "./SignButtons"
import { ProfileInfo } from "./ProfileInfo"

export const NavbarUser = () => {
  const currentUser = useCurrentUser()

  return !currentUser ? <SignButtons /> : <ProfileInfo />
}
