import About from "@/components/homePage/About";
import Benefits from "@/components/homePage/Benefits";
import DownloadApp from "@/components/homePage/DownloadApp";
import FAQ from "@/components/homePage/FAQ";
import Footer from "@/components/homePage/Footer";
import Hero from "@/components/homePage/Hero";
import HowToUse from "@/components/homePage/HowToUse";
import SimpleAnalytics from "@/components/homePage/SimpleAnalytics";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <About />
      <SimpleAnalytics />
      <Benefits />
      <HowToUse />
      <FAQ />
      <DownloadApp />
      <Footer />
    </div>
  );
};

export default HomePage;
