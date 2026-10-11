import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductsSection from '@/components/ProductsSection';
import ServicesSection from '@/components/ServicesSection';
import RecommendationSection from '@/components/RecommendationSection';
import ToolsSection from '@/components/ToolsSection';
import InteractiveFinancialTools from '@/components/InteractiveFinancialTools';
import CardsSection from '@/components/CardsSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Hero />
        <ProductsSection />
        <ServicesSection />
        <RecommendationSection />
        <InteractiveFinancialTools />
        <ToolsSection />
        <CardsSection />
      </main>
      <Footer />
    </div>
  );
}
