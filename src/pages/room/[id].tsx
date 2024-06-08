import { BlitzPage } from "@blitzjs/next"
import { ChatRoom } from "src/components/chatRoom/ChatRoom"
import Layout from "src/core/layouts/Layout"

const RoomPage: BlitzPage = () => {
  return (
    <Layout title={"Room"}>
      <ChatRoom />
    </Layout>
  )
}

export default RoomPage
