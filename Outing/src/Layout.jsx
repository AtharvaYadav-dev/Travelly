import React from "react";

import Footer from "./Footer";

/**
 * Layout - Modern, reusable, glassmorphic layout wrapper with header, nav, and main slot.
 * Usage: Wrap around page content for consistent structure.
 */
const Layout = ({ children }) => (
  <div className="relative min-h-screen flex flex-col selection:bg-indigo-500/30">
    <div className="mesh-bg" />
    <div className="flex-1 flex flex-col relative z-10">
      {children}
    </div>
    <Footer />
  </div>
);

export default Layout;
