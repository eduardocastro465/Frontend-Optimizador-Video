import HeroPanel from "../components/HeroPanel";
import Features from "../components/Features";
import DemoVideo from "../components/DemoVideo";
import Reviews from "../components/Reviews";
import UpcomingFeatures from "../components/UpcomingFeatures";
import LoginForm from "../../../core/auth/Login";

export default function HomePage() {
  return (
    <main className="font-body min-h-[90vh] bg-[#07070f] text-white overflow-x-hidden z-999">
      <div className="relative min-h-[89.5vh] lg:h-[89.5vh] grid lg:grid-cols-2">
        <HeroPanel />
        <section id="login">
          <LoginForm />
        </section>
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-[#07070f] to-transparent pointer-events-none z-20" />
      </div>
      <section id="demo">
        <DemoVideo />
      </section>
      <section id="reviews">
        <Reviews />
      </section>
      <section id="features">
        <Features />
      </section>
      <section id="community">
        <UpcomingFeatures />
      </section>
    </main>
  );
}
