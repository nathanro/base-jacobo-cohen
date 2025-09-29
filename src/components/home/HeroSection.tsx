import React from 'react';
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { TrendingUp, BarChart3, Globe, Users } from 'lucide-react';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-20 md:py-32 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {t('hero.badge', 'Leading Market Intelligence')}
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {t('hero.title', 'Transform Your Business with')} 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    {' ' + t('hero.titleHighlight', 'Data-Driven Insights')}
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  {t('hero.subtitle', 'Access comprehensive market research, industry analysis, and business intelligence to make informed strategic decisions and drive growth.')}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3">
                  {t('hero.cta.primary', 'Explore Research')}
                </Button>
                <Button variant="outline" size="lg" className="border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 px-8 py-3">
                  {t('hero.cta.secondary', 'Request Demo')}
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">{t('hero.stats.reports', 'Research Reports')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">{t('hero.stats.industries', 'Industries Covered')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">{t('hero.stats.clients', 'Happy Clients')}</div>
                </div>
              </div>
            </div>
            
            {/* Visual */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {/* Card 1 */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Market Analysis</h3>
                      <p className="text-sm text-gray-600">Industry Trends</p>
                    </div>
                  </div>
                  <div className="h-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                    <div className="text-2xl font-bold text-blue-600">+23%</div>
                  </div>
                </div>
                
                {/* Card 2 */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transform -rotate-2 hover:rotate-0 transition-transform duration-300 mt-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Global Reach</h3>
                      <p className="text-sm text-gray-600">Worldwide Data</p>
                    </div>
                  </div>
                  <div className="h-20 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg flex items-center justify-center">
                    <div className="text-2xl font-bold text-green-600">195</div>
                  </div>
                </div>
                
                {/* Card 3 */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transform rotate-1 hover:rotate-0 transition-transform duration-300 col-span-2">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Consumer Insights</h3>
                      <p className="text-sm text-gray-600">Behavioral Analytics</p>
                    </div>
                  </div>
                  <div className="h-16 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"></div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default HeroSection;