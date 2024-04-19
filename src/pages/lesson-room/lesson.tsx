import { BlitzPage } from "@blitzjs/next"
import { ChatRoom } from "src/components/chatRoom/ChatRoom"
import Layout from "src/core/layouts/Layout"

const LessonRoomPage: BlitzPage = () => {
  return (
    <Layout title={"Lesson Room"}>
      <ChatRoom />
    </Layout>
  )
}

export default LessonRoomPage
