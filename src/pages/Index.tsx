import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MarqueeBanner from "@/components/MarqueeBanner";
import LaunchSale from "@/components/LaunchSale";
import Features from "@/components/Features";
import BrandStory from "@/components/BrandStory";
import Stats from "@/components/Stats";
import FAQ from "@/components/FAQ";
import Products from "@/components/Products";
import Footer from "@/components/Footer";
import LeadGenPopup from "@/components/LeadGenPopup";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <LeadGenPopup />
      <Navbar />
      <Hero />
      <MarqueeBanner />
      <LaunchSale />
      <Features />
      <BrandStory />
      <Stats />
      <FAQ />
      <Products />
      <Footer />
    </div>
  );
};

export default Index;
