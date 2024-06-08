import { BlitzPage } from "@blitzjs/next";
import { Profile } from "src/components/profile/Profile";
import Layout from "src/core/layouts/Layout";

const ProfilePage: BlitzPage = () => {
  return (
    <Layout title={"Profile"}>
      <Profile />
    </Layout>
  );
};

ProfilePage.authenticate = { redirectTo: "/auth/login" };
export default ProfilePage;
