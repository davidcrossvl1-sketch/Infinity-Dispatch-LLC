/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopContactBar } from './components/TopContactBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CarrierSignUpSection } from './components/CarrierSignUpSection';
import { EquipmentRatesSection } from './components/EquipmentRatesSection';
import { EarningsCalculator } from './components/EarningsCalculator';
import { PricingPlansSection } from './components/PricingPlansSection';
import { ExecutiveLeadershipSection } from './components/ExecutiveLeadershipSection';
import { AboutSection } from './components/AboutSection';
import { NationwideDispatchNetworkSection } from './components/NationwideDispatchNetworkSection';
import { FreightTimeZonesMap } from './components/FreightTimeZonesMap';
import { ServicesSection } from './components/ServicesSection';
import { EquipmentSection } from './components/EquipmentSection';
import { LoadRequestSection } from './components/LoadRequestSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ReviewsSection } from './components/ReviewsSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

import { CarrierRegistrationModal } from './components/CarrierRegistrationModal';
import { CarrierPortalModal } from './components/CarrierPortalModal';
import { OwnerLoginModal } from './components/owner/OwnerLoginModal';
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { LiveChatWidget } from './components/LiveChatWidget';
import { DemoBookingModal } from './components/DemoBookingModal';
import { GmailDispatchModal } from './components/GmailDispatchModal';

import { EquipmentType, OwnerUser } from './types';
import { storage } from './services/storage';

export default function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCarrierPortalOpen, setIsCarrierPortalOpen] = useState(false);
  const [isOwnerLoginOpen, setIsOwnerLoginOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isGmailModalOpen, setIsGmailModalOpen] = useState(false);

  // Active registered equipment & RPM prefill for registration wizard
  const [targetEquipment, setTargetEquipment] = useState<EquipmentType>('Dry Van');
  const [targetRPM, setTargetRPM] = useState<number>(2.85);

  // Current logged in owner
  const [currentOwner, setCurrentOwner] = useState<OwnerUser | null>(null);

  // Check persisted owner session on mount
  useEffect(() => {
    const savedOwner = storage.getCurrentOwner();
    if (savedOwner) {
      setCurrentOwner(savedOwner);
    }
  }, []);

  const handleOpenRegister = (equipment: EquipmentType = 'Dry Van', rpm: number = 2.85) => {
    setTargetEquipment(equipment);
    setTargetRPM(rpm);
    const signupEl = document.getElementById('carrier-signup');
    if (signupEl) {
      signupEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsRegisterOpen(true);
    }
  };

  const handleOwnerLoginSuccess = (owner: OwnerUser) => {
    setCurrentOwner(owner);
  };

  const handleOwnerLogout = () => {
    storage.setCurrentOwner(null);
    setCurrentOwner(null);
  };

  // If owner is logged in and viewing the private management system
  if (currentOwner) {
    return (
      <OwnerDashboard
        owner={currentOwner}
        onLogout={handleOwnerLogout}
        onSwitchToPublic={() => setCurrentOwner(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* 1. Top Contact Bar with Phone, Email, Telegram, Verified Socials & Direct Admin Login & Gmail Dispatch */}
      <TopContactBar
        onOpenOwnerPortal={() => setIsOwnerLoginOpen(true)}
        onOpenRegister={() => handleOpenRegister('Dry Van', 2.85)}
        onOpenGmailModal={() => setIsGmailModalOpen(true)}
      />

      {/* 2. Main Sticky Navigation with Official Logo */}
      <Navbar
        onOpenRegister={() => handleOpenRegister('Dry Van', 2.85)}
        onOpenCarrierPortal={() => setIsCarrierPortalOpen(true)}
        onOpenOwnerPortal={() => setIsOwnerLoginOpen(true)}
        onOpenGmailModal={() => setIsGmailModalOpen(true)}
        activeSection="home"
      />

      {/* 3. Main Landing Experience */}
      <main className="flex-1">
        {/* Dynamic Hero Section with Parallax Framer Motion on Semi-Truck Imagery & Top David Cross Banner */}
        <HeroSection
          onOpenRegister={() => handleOpenRegister('Dry Van', 2.85)}
          designStyle="flagship"
        />

        {/* 1st Section Immediately After Hero: Equipment Rates & Commission Breakdown (7 Cards: Dry Van 5%, Reefer 5%, Box Truck 7%, etc.) */}
        <EquipmentRatesSection
          onOpenRegister={() => handleOpenRegister('Dry Van', 2.85)}
        />

        {/* Carrier Sign-Up In-Page Form (Direct One-Step Access With Assigned Owner Choice) */}
        <CarrierSignUpSection
          initialEquipment={targetEquipment}
          initialRPM={targetRPM}
        />

        {/* 3rd Main Section: Interactive Net Take-Home Earnings Estimator */}
        <EarningsCalculator
          onApplyCalculatedRate={(calcRpm) => handleOpenRegister('Dry Van', calcRpm)}
        />

        {/* Dispatch Plans: Starter 5%, Professional 5%-7%, Fleet & Enterprise */}
        <PricingPlansSection
          onOpenRegister={() => handleOpenRegister('Dry Van', 2.85)}
        />

        {/* Executive Leadership Feature: David Cross & Alvin Royal Gold Emblems */}
        <ExecutiveLeadershipSection
          onOpenRegister={() => handleOpenRegister('Dry Van', 2.85)}
        />

        {/* About & Trust Section (Full uncropped operations photo with direct contact bar) */}
        <AboutSection />

        {/* Nationwide Dispatch Network: Houston HQ Hub with photo, 5 Freight Corridors & Direct Owner Commitment */}
        <NationwideDispatchNetworkSection
          onOpenRegister={() => handleOpenRegister('Dry Van', 2.85)}
          onOpenDemo={() => setIsDemoModalOpen(true)}
        />

        {/* Nationwide US Time Zones & Freight Corridor Map with Live Running Clocks & Dates */}
        <FreightTimeZonesMap />

        {/* 13 Professional Dispatch Services Presentation with 4 Category Tabs */}
        <ServicesSection onOpenRegister={() => handleOpenRegister('Dry Van', 2.85)} />

        {/* Equipment Showcase (8 Types With Dedicated Unique Truck Photos) */}
        <EquipmentSection
          onSelectEquipment={(eq) => handleOpenRegister(eq, 2.85)}
        />

        {/* Find Freight Fast: Request A Load Search Form */}
        <LoadRequestSection />

        {/* Why Choose Infinity Dispatch: 8 Infinity Guarantees */}
        <WhyChooseUs onOpenRegister={() => handleOpenRegister('Dry Van', 2.85)} />

        {/* Verified Carrier Reviews & Public Feedback */}
        <ReviewsSection />

        {/* How It Works (4-Step Onboarding) */}
        <HowItWorksSection onOpenRegister={() => handleOpenRegister('Dry Van', 2.85)} />

        {/* Clear Answers To Your Questions: Frequently Asked Questions (12 FAQs + Search) */}
        <FAQSection />

        {/* Get In Touch: Direct Leadership Contact & 15-Min Response Inquiry Form */}
        <ContactSection onOpenDemo={() => setIsDemoModalOpen(true)} />
      </main>

      {/* 4. Footer & Business Identity */}
      <Footer
        onOpenOwnerPortal={() => setIsOwnerLoginOpen(true)}
        onOpenCarrierPortal={() => setIsCarrierPortalOpen(true)}
        onOpenRegister={() => handleOpenRegister('Dry Van', 2.85)}
      />

      {/* 5. 24/7 Live Dispatch Chat Widget with Gemini AI & Owner Desk (Small compact box icon launcher) */}
      <LiveChatWidget />

      {/* 6. Modals */}
      <CarrierRegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        initialEquipment={targetEquipment}
        initialRPM={targetRPM}
      />

      <CarrierPortalModal
        isOpen={isCarrierPortalOpen}
        onClose={() => setIsCarrierPortalOpen(false)}
      />

      <OwnerLoginModal
        isOpen={isOwnerLoginOpen}
        onClose={() => setIsOwnerLoginOpen(false)}
        onSuccess={handleOwnerLoginSuccess}
      />

      <DemoBookingModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />

      <GmailDispatchModal
        isOpen={isGmailModalOpen}
        onClose={() => setIsGmailModalOpen(false)}
      />
    </div>
  );
}
