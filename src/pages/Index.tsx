import { useAuth } from '@/contexts/AuthContext';
import { MadeWithDyad } from '@/components/powered-by-publiexpert';
import { Navigation } from '@/components/navigation/Navigation';
import { LanguageSwitcher } from '@/components/navigation/LanguageSwitcher';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import MarketInsights from '@/components/home/MarketInsights';
import FeaturedReports from '@/components/home/FeaturedReports';
import CompanyInfo from '@/components/home/CompanyInfo';
import ContactSection from '@/components/home/ContactSection';
import { DatasetList } from '@/components/data/DatasetList';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <HeroSection />
        
        {user &&
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <DatasetList />
            </div>
          </section>
        }
        
        <ServicesSection />
        <MarketInsights />
        <FeaturedReports />
        <CompanyInfo />
        <ContactSection />
      </main>
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <MadeWithDyad />
        </div>
      </footer>
    </div>);

};

export default Index;