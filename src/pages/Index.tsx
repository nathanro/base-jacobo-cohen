import { useAuth } from '@/contexts/AuthContext';
import { MadeWithDyad } from '@/components/powered-by-publiexpert';
import { Navigation } from '@/components/navigation/Navigation';
import BigDataHeroSection from '@/components/home/BigDataHeroSection';
import KeyMetricsSection from '@/components/home/KeyMetricsSection';
import TargetAudienceSection from '@/components/home/TargetAudienceSection';
import ResearcherSection from '@/components/home/ResearcherSection';
import DemoBenefitsSection from '@/components/home/DemoBenefitsSection';
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
        <BigDataHeroSection />
        <KeyMetricsSection />
        <TargetAudienceSection />
        <ResearcherSection />
        <DemoBenefitsSection />
        
        {user &&
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Tus Datos Financieros
                </h2>
                <p className="text-lg text-gray-600">
                  Accede a tus conjuntos de datos y análisis personalizados
                </p>
              </div>
              <DatasetList />
            </div>
          </section>
        }
        
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