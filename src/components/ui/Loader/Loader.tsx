import Image from "next/image";
import React from "react";

function Loader() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#0e2338a1] z-50">
      <Image
        loading="lazy"
        width={200}
        height={200}
        src="/images/loader.gif"
        alt="loader"
        className="max-w-[90vw] max-h-[90vh] filter hue-rotate-0 invert"
      />
    </div>
  );
}

export default Loader;
