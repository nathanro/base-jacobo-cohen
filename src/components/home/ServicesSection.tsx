import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Database, Globe, PieChart, Search, TrendingUp } from "lucide-react";
import { useTranslation } from 'react-i18next';

const ServicesSection = () => {
  const { t } = useTranslation();

  const services = [
  {
    icon: BarChart,
    titleKey: "services.marketAnalysis.title",
    descriptionKey: "services.marketAnalysis.description"
  },
  {
    icon: Database,
    titleKey: "services.bigDataAnalytics.title",
    descriptionKey: "services.bigDataAnalytics.description"
  },
  {
    icon: Search,
    titleKey: "services.industryResearch.title",
    descriptionKey: "services.industryResearch.description"
  },
  {
    icon: TrendingUp,
    titleKey: "services.trendAnalysis.title",
    descriptionKey: "services.trendAnalysis.description"
  },
  {
    icon: Globe,
    titleKey: "services.globalMarketIntelligence.title",
    descriptionKey: "services.globalMarketIntelligence.description"
  },
  {
    icon: PieChart,
    titleKey: "services.customResearch.title",
    descriptionKey: "services.customResearch.description"
  }];


  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('services.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) =>
          <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">{t(service.titleKey)}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {t(service.descriptionKey)}
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>);

};

export default ServicesSection;