import Reviews from "../components/sections/home/Reviews";
import DemoVideo from "../components/sections/home/DemoVideo";
import Footer from "../components/layout/Footer";
import LoginForm from "../components/sections/auth/Login";
import HeroPanel from "../components/sections/home/HeroPanel";
import Features from "../components/sections/home/Features";
import UpcomingFeatures from "../components/sections/home/UpcomingFeatures";
import Header from "../components/layout/Header";

export default function HomePage() {
  return (
    <div className="font-body bg-[#07070f] text-white overflow-x-hidden">
      <Header />
      <div className="relative min-h-[89vh] lg:h-[89vh] grid lg:grid-cols-2">
        <HeroPanel />
        <section id="login"><LoginForm /></section>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#07070f] to-transparent pointer-events-none z-20" />
      </div>

      <section id="demo"><DemoVideo /></section>
      <section id="reviews"><Reviews /></section>
      <section id="features"><Features /></section>
      <section id="community"><UpcomingFeatures /></section>
      <Footer />
    </div>
  );
}