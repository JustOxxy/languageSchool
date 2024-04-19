import { Routes } from "@blitzjs/next"
import { NavbarItem, Button } from "@nextui-org/react"
import Link from "next/link"

export const SignButtons = () => {
  return (
    <>
      <NavbarItem>
        <Button as={Link} color="primary" href={Routes.SignupPage().href} variant="flat">
          Sign Up
        </Button>
      </NavbarItem>
      <NavbarItem>
        <Link href={Routes.LoginPage()}>Login</Link>
      </NavbarItem>
    </>
  )
}
