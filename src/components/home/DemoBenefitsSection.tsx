import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, Database, TrendingUp, Target, Search, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const DemoBenefitsSection = () => {
  const { t } = useTranslation();

  const benefits = [
  {
    icon: <Monitor className="h-8 w-8 text-blue-600" />,
    title: t('demoBenefits.platformOverview.title'),
    description: t('demoBenefits.platformOverview.description'),
    color: "border-blue-200 bg-blue-50"
  },
  {
    icon: <Database className="h-8 w-8 text-green-600" />,
    title: t('demoBenefits.marketAccess.title'),
    description: t('demoBenefits.marketAccess.description'),
    color: "border-green-200 bg-green-50"
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
    title: t('demoBenefits.topCompanies.title'),
    description: t('demoBenefits.topCompanies.description'),
    color: "border-purple-200 bg-purple-50"
  },
  {
    icon: <Target className="h-8 w-8 text-orange-600" />,
    title: t('demoBenefits.diversification.title'),
    description: t('demoBenefits.diversification.description'),
    color: "border-orange-200 bg-orange-50"
  },
  {
    icon: <Search className="h-8 w-8 text-red-600" />,
    title: t('demoBenefits.growthIdentification.title'),
    description: t('demoBenefits.growthIdentification.description'),
    color: "border-red-200 bg-red-50"
  }];


  const handleRequestDemo = () => {
    // Scroll to contact section
    const contactSection = document.querySelector('footer');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="demo-benefits" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('demoBenefits.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('demoBenefits.subtitle')}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) =>
          <Card key={index} className={`${benefit.color} border-2 hover:shadow-lg transition-all duration-300 hover:scale-105`}>
              <CardHeader>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-900">
                    {benefit.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Featured Benefit - 81 Companies */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">
                Casos de Éxito Reales
              </h3>
              <p className="text-lg mb-6 text-purple-100">
                Descubre exactamente qué empresas lograron un crecimiento superior al 1000% en los últimos 4 años 
                y aprende los patrones que las llevaron al éxito.
              </p>
              <div className="flex items-center space-x-6">
                <div>
                  <div className="text-4xl font-bold">81</div>
                  <div className="text-purple-200">Empresas Exitosas</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">1000%+</div>
                  <div className="text-purple-200">Crecimiento Promedio</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">4</div>
                  <div className="text-purple-200">Años Analizados</div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 text-white" />
                <p className="text-lg font-semibold">
                  Metodología Comprobada
                </p>
                <p className="text-purple-200 mt-2">
                  Análisis cuantitativo basado en datos históricos verificados
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-white shadow-2xl border-0 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                ¿Listo para Ver la Demo?
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Accede a una demostración completa de la plataforma y descubre cómo el Big Data 
                puede revolucionar tus decisiones de inversión.
              </p>
              <Button
                onClick={handleRequestDemo}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">

                Solicitar Demo Gratuita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Sin compromisos • Acceso inmediato • Soporte incluido
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>);

};

export default DemoBenefitsSection;