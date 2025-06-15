// TODO:
// refetching bug
// image/id - add feature: report and reviews

// profile page - collection & activity, other make static options dynamic
// users page - pagination, static to dynamic
// comment in notifications
// collection page
// settings
// footer & header
// landing page
// responsive

"use client";

import {
  Header,
  HeroSection,
  BenefitsSection,
  FeaturesSection,
  Footer,
} from '@/components';
import LoadingScreen from '@/components/screens/LoadingScreen';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Header />
      <HeroSection />
      <BenefitsSection />
      <FeaturesSection />
      <Footer />
    </>
  );
}