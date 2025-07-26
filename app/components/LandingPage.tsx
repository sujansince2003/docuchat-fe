import React from "react";
import Hero from "./Hero";
import Feature from "./Feature";
import OurTeam from "./OurTeam";
import Faq from "./Faq";
import Footer from "./Footer";
import Featured from "./Featured";
import Testinomials from "./Testinomials";
const LandingPage = () => {
  return (
    <div>
      <Hero />
      <Feature />
      <Featured />
      <Testinomials />
      <OurTeam />
      <Faq />
      <Footer />
    </div>
  );
};

export default LandingPage;
