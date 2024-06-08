import { BlitzPage } from "@blitzjs/next";
import { CreateRoom } from "src/components/chatRoom/CreateRoom";
import Layout from "src/core/layouts/Layout";

const LessonRoomPage: BlitzPage = () => {
  return (
    <Layout title={"Lesson Room"}>
      <CreateRoom />
    </Layout>
  );
};

export default LessonRoomPage;
