import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { MadeWithDyad } from '@/components/powered-by-publiexpert';
import { Navigation } from '@/components/navigation/Navigation';
import LanguageSwitcher from '@/components/navigation/LanguageSwitcher';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import MarketInsights from '@/components/home/MarketInsights';
import FeaturedReports from '@/components/home/FeaturedReports';
import CompanyInfo from '@/components/home/CompanyInfo';
import ContactSection from '@/components/home/ContactSection';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Show Navigation for logged in users */}
      {user && <Navigation />}
      
      {/* Public Header for non-logged in users */}
      {!user && (
        <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">
                  DataInsights Analytics
                </h1>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#home" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">{t('navigation.home')}</a>
                <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">{t('services.title')}</a>
                <a href="#insights" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">{t('marketInsights.title')}</a>
                <a href="#reports" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">{t('featuredReports.title')}</a>
                <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">{t('companyInfo.title')}</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">{t('contact.title')}</a>
              </nav>
              
              {/* User Actions */}
              <div className="flex items-center space-x-4">
                <LanguageSwitcher />
                <Button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700">
                  {t('navigation.login')}
                </Button>
                
                {/* Mobile menu button */}
                <button
                  className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
            
            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-gray-200 py-4">
                <nav className="flex flex-col space-y-4">
                  <a href="#home" className="text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>{t('navigation.home')}</a>
                  <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>{t('services.title')}</a>
                  <a href="#insights" className="text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>{t('marketInsights.title')}</a>
                  <a href="#reports" className="text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>{t('featuredReports.title')}</a>
                  <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>{t('companyInfo.title')}</a>
                  <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>{t('contact.title')}</a>
                  <div className="pt-2 border-t border-gray-200">
                    <LanguageSwitcher />
                  </div>
                </nav>
              </div>
            )}
          </div>
        </header>
      )}
      
      {/* Main Content */}
      <main>
        <section id="home">
          <HeroSection />
        </section>
        <section id="services">
          <ServicesSection />
        </section>
        <section id="insights">
          <MarketInsights />
        </section>
        <section id="reports">
          <FeaturedReports />
        </section>
        <section id="about">
          <CompanyInfo />
        </section>
        <section id="contact">
          <ContactSection />
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-blue-400 mb-4">
                DataInsights Analytics
              </h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                {t('companyInfo.description')}
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <span className="text-white font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <span className="text-white font-bold">in</span>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <span className="text-white font-bold">t</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t('services.title')}</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#services" className="hover:text-white transition-colors">{t('services.realTimeData.title')}</a></li>
                <li><a href="#reports" className="hover:text-white transition-colors">{t('featuredReports.title')}</a></li>
                <li><a href="#insights" className="hover:text-white transition-colors">{t('marketInsights.title')}</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">{t('companyInfo.title')}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t('contact.title')}</h4>
              <ul className="space-y-2 text-gray-300">
                <li>123 Business District</li>
                <li>New York, NY 10001</li>
                <li>+1 (555) 123-4567</li>
                <li>info@datainsights.com</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 DataInsights Analytics. All rights reserved.
            </div>
            <MadeWithDyad />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;