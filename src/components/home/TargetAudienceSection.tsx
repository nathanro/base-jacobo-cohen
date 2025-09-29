import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, TrendingUp, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

const TargetAudienceSection = () => {
  const { t } = useTranslation();

  const audiences = [
  {
    icon: <Target className="h-10 w-10 text-blue-600" />,
    title: t('targetAudience.decisionMakers.title'),
    description: t('targetAudience.decisionMakers.description'),
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Users className="h-10 w-10 text-green-600" />,
    title: t('targetAudience.financialAdvisors.title'),
    description: t('targetAudience.financialAdvisors.description'),
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: <TrendingUp className="h-10 w-10 text-purple-600" />,
    title: t('targetAudience.patternSeekers.title'),
    description: t('targetAudience.patternSeekers.description'),
    gradient: "from-purple-500 to-violet-500"
  },
  {
    icon: <Award className="h-10 w-10 text-orange-600" />,
    title: t('targetAudience.competitiveAdvantage.title'),
    description: t('targetAudience.competitiveAdvantage.description'),
    gradient: "from-orange-500 to-red-500"
  }];


  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('targetAudience.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('targetAudience.subtitle')}
          </p>
        </div>

        {/* Audience Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {audiences.map((audience, index) =>
          <Card key={index} className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <CardContent className="p-0">
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${audience.gradient} p-6 text-white`}>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                      {audience.icon}
                    </div>
                    <h3 className="text-2xl font-bold">
                      {audience.title}
                    </h3>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-8">
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {audience.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Bottom Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Te Identificas con Alguno de Estos Perfiles?
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              Nuestra plataforma está diseñada para adaptarse a diferentes estilos de análisis y 
              necesidades de inversión, proporcionando herramientas especializadas para cada perfil profesional.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Análisis Estratégico</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Asesoría Personalizada</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Detección de Patrones</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Ventaja Competitiva</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default TargetAudienceSection;