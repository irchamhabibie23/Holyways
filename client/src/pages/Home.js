import { useState, useEffect } from "react";
import Hero from "../components/Hero";
import Hero2 from "../components/Hero2";
import Footer from "../components/Footer";
import LoadingPage from "./LoadingPage";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <>
          <Hero />
          <Hero2 />
          <Footer />
        </>
      )}
    </>
  );
};

export default Home;
