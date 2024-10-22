import React from "react";

const Layout = ({ children }) => {
  return (
    <div className={`p-4 h-screen absolute bottom-0 w-full bg-layout`}>
      {children}
    </div>
  )
}

export default Layout;