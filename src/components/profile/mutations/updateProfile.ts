import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { ChangeProfile } from "src/auth/schemas"

export default resolver.pipe(
  resolver.zod(ChangeProfile),
  resolver.authorize(),
  async ({ firstName, lastName, dateOfBirth, phone, email }, ctx) => {
    const user = await db.user.findFirst({ where: { id: ctx.session.userId } })
    if (!user) throw new NotFoundError()

    await db.user.update({
      where: { id: user.id },
      data: { name: firstName, lastName, dateOfBirth, phone, email },
    })

    return true
  }
)
