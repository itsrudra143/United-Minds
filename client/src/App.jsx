import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";

function App() {
  return (
    <>
      <Header />
      {/* <Home /> */}
      {/* <Profile /> */}
      <Feed />
      <Footer />
    </>
  );
}

export default App;
