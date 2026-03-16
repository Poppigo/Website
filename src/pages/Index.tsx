import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LifestyleSection from "@/components/LifestyleSection";
import LaunchSale from "@/components/LaunchSale";
import MarqueeBanner from "@/components/MarqueeBanner";
import SocialProof from "@/components/SocialProof";
import ChooseYourFit from "@/components/ChooseYourFit";
import Features from "@/components/Features";
import BrandStory from "@/components/BrandStory";
import FAQ from "@/components/FAQ";
import HomepageTestimonials from "@/components/HomepageTestimonials";
import MarketplaceStrip from "@/components/MarketplaceStrip";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import LeadGenPopup from "@/components/LeadGenPopup";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <LeadGenPopup />
      <Navbar />
      <Hero />
      <LifestyleSection />
      <LaunchSale />
      <MarqueeBanner />
      <SocialProof />
      <ChooseYourFit />
      <Features />
      <BrandStory />
      <FAQ />
      <HomepageTestimonials />
      <MarketplaceStrip />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
