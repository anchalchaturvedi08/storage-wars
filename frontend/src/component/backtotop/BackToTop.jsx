import React from "react";
import { ArrowUp } from "lucide-react";
import "./BackToTop.css";
function BackToTop() {
  return (
    <a
      href="#top"
      className="fixed bottom-5 left-5 z-40 grid h-11 w-11 place-items-center rounded-full bg-ink text-white shadow-lg"
    >
      <ArrowUp size={18} />
    </a>
  );
}
export default BackToTop;
