import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Mic, TrendingUp, Users, Code, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

const ResearcherSection = () => {
  const { t } = useTranslation();

  const credentials = [
    {
      icon: <BookOpen className="h-5 w-5" />,
      text: t('researcher.credentials.author'),
      color: "bg-blue-100 text-blue-800"
    },
    {
      icon: <Mic className="h-5 w-5" />,
      text: t('researcher.credentials.speaker'),
      color: "bg-green-100 text-green-800"
    },
    {
      icon: <Award className="h-5 w-5" />,
      text: t('researcher.credentials.podcast'),
      color: "bg-purple-100 text-purple-800"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      text: t('researcher.credentials.investor'),
      color: "bg-orange-100 text-orange-800"
    },
    {
      icon: <Users className="h-5 w-5" />,
      text: t('researcher.credentials.followers'),
      color: "bg-pink-100 text-pink-800"
    },
    {
      icon: <Code className="h-5 w-5" />,
      text: t('researcher.credentials.programmer'),
      color: "bg-indigo-100 text-indigo-800"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image and Basic Info */}
          <div className="text-center lg:text-left">
            <div className="relative inline-block mb-8">
              {/* Profile Image Placeholder - Using a gradient avatar */}
              <div className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-6xl font-bold shadow-2xl">
                JCA
              </div>
              <div className="absolute -bottom-4 -right-4 bg-green-500 rounded-full p-3 shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              {t('researcher.name')}
            </h2>
            <p className="text-xl text-blue-600 font-semibold mb-6">
              Especialista en Big Data Financiero
            </p>
          </div>

          {/* Right Column - Details and Credentials */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              {t('researcher.title')}
            </h3>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {t('researcher.description')}
            </p>

            {/* Credentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {credentials.map((credential, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={`${credential.color} px-4 py-3 text-sm font-medium rounded-lg border-0 flex items-center space-x-2 justify-start`}
                >
                  {credential.icon}
                  <span>{credential.text}</span>
                </Badge>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
              <CardContent className="p-6">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-blue-600" />
                  Área de Especialización
                </h4>
                <p className="text-gray-700">
                  {t('researcher.expertise')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
            <div className="text-gray-600">Años de Experiencia</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">3</div>
            <div className="text-gray-600">Libros Publicados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">10K+</div>
            <div className="text-gray-600">Seguidores</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">5000+</div>
            <div className="text-gray-600">Empresas Analizadas</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearcherSection;