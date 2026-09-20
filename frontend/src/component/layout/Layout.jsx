import React from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import ChatBot from "../chatbox/ChatBot";
import BackToTop from "../backtotop/BackToTop";
import "./Layout.css";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <BackToTop />
      <ChatBot />
      <Footer />
    </>
  );
}

export default Layout;
