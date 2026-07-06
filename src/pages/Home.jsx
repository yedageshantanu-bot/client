import React from "react";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Combos from "@/components/Combos";
import WhyChooseUs from "@/components/WhyChooseUs";
import PersonalizedMessage from "@/components/PersonalizedMessage";
import InstagramGrid from "@/components/InstagramGrid";
import Testimonials from "@/components/Testimonials";
import DeliveryTimeline from "@/components/DeliveryTimeline";
import PremiumBanner from "@/components/PremiumBanner";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <main data-testid="home-page">
      <Hero />
      <WhyChooseUs />
      <FeaturedProducts />
      <Combos />
      <PersonalizedMessage />
      <DeliveryTimeline />
      <Testimonials />
      <InstagramGrid />
      <PremiumBanner />
      <Newsletter />
    </main>
  );
}
