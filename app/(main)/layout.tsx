import Navbar from "../../components/Navbar";

import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="">
      <Navbar />

      <div className="py-20">{children}</div>
    </div>
  );
};

export default layout;
