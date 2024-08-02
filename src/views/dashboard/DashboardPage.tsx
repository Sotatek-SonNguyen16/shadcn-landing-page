import React from 'react';
import {Navbar} from "@/components/Navbar.tsx";
import {Hero} from "@/components/Hero.tsx";
import {Sponsors} from "@/components/Sponsors.tsx";
import {About} from "@/components/About.tsx";
import {HowItWorks} from "@/components/HowItWorks.tsx";
import {Features} from "@/components/Features.tsx";
import {Services} from "@/components/Services.tsx";
import {Cta} from "@/components/Cta.tsx";
import {Testimonials} from "@/components/Testimonials.tsx";
import {Team} from "@/components/Team.tsx";
import {Pricing} from "@/components/Pricing.tsx";
import {Newsletter} from "@/components/Newsletter.tsx";
import {FAQ} from "@/components/FAQ.tsx";
import {Footer} from "@/components/Footer.tsx";
import {ScrollToTop} from "@/components/ScrollToTop.tsx";

const DashboardPage: React.FC = () => {
    return (
        <>
            <Navbar/>
            <Hero/>
            <Sponsors/>
            <About/>
            <HowItWorks/>
            <Features/>
            <Services/>
            <Cta/>
            <Testimonials/>
            <Team/>
            <Pricing/>
            <Newsletter/>
            <FAQ/>
            <Footer/>
            <ScrollToTop/>
        </>
    );
};

export default DashboardPage;