import React from "react";

const Layout = ({ children }) => {
  return (
    <div className={`p-4 h-screen bg-gradient-to-b from-[#480B97] to-[#BA2BA1] absolute bottom-0 w-full`}>
      {children}
    </div>
  )
}

export default Layout;