import React from "react";

import Footer from "./Footer";

/**
 * Layout - Modern, reusable, glassmorphic layout wrapper with header, nav, and main slot.
 * Usage: Wrap around page content for consistent structure.
 */
const Layout = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-fuchsia-100 to-pink-50 flex flex-col">
    {/* Dark mode toggle hidden as requested */}
    {/* Header and nav will be slotted in by parent */}
    {children}
    <Footer />
  </div>
);

export default Layout;
