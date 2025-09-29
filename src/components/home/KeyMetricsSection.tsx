import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, DollarSign, PieChart, Building, Clock, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

const KeyMetricsSection = () => {
  const { t } = useTranslation();

  const metrics = [
  {
    icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
    title: t('keyMetrics.salesGrowth.title'),
    description: t('keyMetrics.salesGrowth.description'),
    color: "bg-blue-50 border-blue-200"
  },
  {
    icon: <DollarSign className="h-8 w-8 text-red-600" />,
    title: t('keyMetrics.debtLevels.title'),
    description: t('keyMetrics.debtLevels.description'),
    color: "bg-red-50 border-red-200"
  },
  {
    icon: <PieChart className="h-8 w-8 text-green-600" />,
    title: t('keyMetrics.grossMargin.title'),
    description: t('keyMetrics.grossMargin.description'),
    color: "bg-green-50 border-green-200"
  },
  {
    icon: <Building className="h-8 w-8 text-purple-600" />,
    title: t('keyMetrics.economicSector.title'),
    description: t('keyMetrics.economicSector.description'),
    color: "bg-purple-50 border-purple-200"
  },
  {
    icon: <Clock className="h-8 w-8 text-orange-600" />,
    title: t('keyMetrics.historicalData.title'),
    description: t('keyMetrics.historicalData.description'),
    color: "bg-orange-50 border-orange-200"
  },
  {
    icon: <Users className="h-8 w-8 text-indigo-600" />,
    title: t('keyMetrics.companiesAnalyzed.title'),
    description: t('keyMetrics.companiesAnalyzed.description'),
    color: "bg-indigo-50 border-indigo-200"
  }];


  return (
    <section id="key-metrics" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('keyMetrics.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('keyMetrics.subtitle')}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {metrics.map((metric, index) =>
          <Card key={index} className={`${metric.color} border-2 hover:shadow-lg transition-all duration-300 hover:scale-105`}>
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    {metric.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {metric.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Análisis Basado en Datos Reales
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Cada métrica es procesada utilizando algoritmos de Big Data que analizan patrones 
              y tendencias en tiempo real para darte la información más precisa y actualizada.
            </p>
          </div>
        </div>
      </div>
    </section>);

};

export default KeyMetricsSection;