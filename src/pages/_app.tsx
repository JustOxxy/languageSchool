import { ErrorFallbackProps, ErrorComponent, ErrorBoundary, AppProps } from "@blitzjs/next"
import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NextUIProvider,
} from "@nextui-org/react"
import { AuthenticationError, AuthorizationError } from "blitz"
import React, { Suspense } from "react"
import { withBlitz } from "src/blitz-client"
import { NavbarUser } from "src/components/navbar/NavbarUser"
import { ProfileInfo } from "src/components/navbar/ProfileInfo"
import { SignButtons } from "src/components/navbar/SignButtons"

import "src/styles/globals.css"

function RootErrorFallback({ error }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <div>Error: You are not authenticated</div>
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent
        statusCode={(error as any)?.statusCode || 400}
        title={error.message || error.name}
      />
    )
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <Suspense fallback={"Loading..."}>
      <NextUIProvider>
        <ErrorBoundary FallbackComponent={RootErrorFallback}>
          {getLayout(
            <>
              <Navbar isBordered>
                <NavbarBrand>
                  <p className="font-bold text-inherit">LanguageSchool</p>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                  <NavbarItem>
                    <Link color="foreground" href="#">
                      Features
                    </Link>
                  </NavbarItem>
                  <NavbarItem isActive>
                    <Link href="#" aria-current="page">
                      Customers
                    </Link>
                  </NavbarItem>
                  <NavbarItem>
                    <Link color="foreground" href="#">
                      Integrations
                    </Link>
                  </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end">
                  <Suspense fallback="Loading...">
                    <NavbarUser />
                  </Suspense>
                </NavbarContent>
              </Navbar>

              <Component {...pageProps} />
            </>
          )}
        </ErrorBoundary>
      </NextUIProvider>
    </Suspense>
  )
}

export default withBlitz(MyApp)
