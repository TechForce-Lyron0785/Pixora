// TODO:
// Chat & Image filter or Ai Edit feature
// Automatic EXIF data processing
// Real-time Updates: Live notifications and interactions
// Ai powered image search
// Complete personal analytics page

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