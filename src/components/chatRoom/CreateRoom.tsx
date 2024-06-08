import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";

export const CreateRoom = () => {
  const router = useRouter();

  return <Button onClick={() => router.push(`/room/${uuidv4()}`)}>Create Room</Button>;
};
