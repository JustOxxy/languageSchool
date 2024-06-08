import Head from "next/head";
import React from "react";
import { BlitzLayout } from "@blitzjs/next";

const Layout: BlitzLayout<{ title?: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <>
      <Head>
        <title>{title || "LS"}</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>

      {children}
    </>
  );
};

export default Layout;
