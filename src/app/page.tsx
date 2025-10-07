import { CallToAction } from "@/components/landing-site/CallToAction";
import { Faqs } from "@/components/landing-site/Faqs";
import { Footer } from "@/components/landing-site/Footer";
import { Header } from "@/components/landing-site/Header";
import { Hero } from "@/components/landing-site/Hero";
import { Pricing } from "@/components/landing-site/Pricing";
import { PrimaryFeatures } from "@/components/landing-site/PrimaryFeatures";
import { SecondaryFeatures } from "@/components/landing-site/SecondaryFeatures";
import { Testimonials } from "@/components/landing-site/Testimonials";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        {/* <PrimaryFeatures /> */}
        <SecondaryFeatures />
        <CallToAction />
        <Testimonials />
        <Pricing />
        <Faqs />
      </main>
      <Footer />
    </>
  );
}
