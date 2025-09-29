import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { ArrowRight, BarChart3, TrendingUp } from "lucide-react";

const HeroSection = () => {
  const { t } = useTranslation();
  
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:75px_75px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <TrendingUp className="h-8 w-8 text-indigo-600" />
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            {t('hero.title1')}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
              {t('hero.title2')}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" className="text-lg px-8 py-3 bg-blue-600 hover:bg-blue-700">
              {t('hero.cta1')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3 border-gray-300">
              {t('hero.cta2')}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Market Research Reports</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
              <div className="text-3xl font-bold text-indigo-600 mb-2">50+</div>
              <div className="text-gray-600">Industry Sectors</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">1M+</div>
              <div className="text-gray-600">Data Points Analyzed</div>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default HeroSection;