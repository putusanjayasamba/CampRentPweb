"use client";

import Navbar from "./Navbar";

export default function CustomerNavbar(props: React.ComponentProps<typeof Navbar> & { activePage?: string }) {
  return <Navbar {...props} />;
}
