import Link from "next/link";
import { useCurrentUser } from "src/users/hooks/useCurrentUser";
import { BlitzPage } from "@blitzjs/next";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import { SignButtons } from "src/components/navbar/SignButtons";
import { ProfileInfo } from "src/components/navbar/ProfileInfo";

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const Home: BlitzPage = () => {
  const currentUser = useCurrentUser();

  return <div></div>;
};

export default Home;
