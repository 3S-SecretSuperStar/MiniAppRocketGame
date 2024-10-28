import React from "react";

const Layout = ({ children }) => {
  return (
    <div className={`p-4 h-screen absolute bottom-0 w-full bg-gradient-to-b from-[#480B97] to-[#BA2BA1] `}>
      {children}
    </div>
  )
}

export default Layout;