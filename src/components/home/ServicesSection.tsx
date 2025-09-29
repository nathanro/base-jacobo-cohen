import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { 
  BarChart, 
  TrendingUp, 
  Users, 
  Globe, 
  Target, 
  Zap,
  ArrowRight,
  CheckCircle,
  Database,
  Search,
  PieChart
} from 'lucide-react';

const ServicesSection = () => {
  const { t } = useTranslation();
  
  const services = [
    {
      title: t('services.marketAnalysis.title', 'Market Analysis'),
      description: t('services.marketAnalysis.description', 'Comprehensive analysis of market trends, size, growth potential, and competitive landscape across industries.'),
      icon: BarChart,
      features: [
        t('services.marketAnalysis.feature1', 'Market Size & Forecast'),
        t('services.marketAnalysis.feature2', 'Competitive Analysis'),
        t('services.marketAnalysis.feature3', 'Growth Opportunities')
      ],
      color: 'blue'
    },
    {
      title: t('services.bigDataAnalytics.title', 'Big Data Analytics'),
      description: t('services.bigDataAnalytics.description', 'Advanced analytics processing large datasets to extract valuable insights and patterns for strategic decision-making.'),
      icon: Database,
      features: [
        t('services.bigDataAnalytics.feature1', 'Data Processing'),
        t('services.bigDataAnalytics.feature2', 'Pattern Recognition'),
        t('services.bigDataAnalytics.feature3', 'Predictive Modeling')
      ],
      color: 'green'
    },
    {
      title: t('services.industryResearch.title', 'Industry Research'),
      description: t('services.industryResearch.description', 'In-depth analysis of specific industries including market dynamics, key players, and regulatory environment.'),
      icon: Search,
      features: [
        t('services.industryResearch.feature1', 'Sector Analysis'),
        t('services.industryResearch.feature2', 'Competitive Landscape'),
        t('services.industryResearch.feature3', 'Regulatory Insights')
      ],
      color: 'purple'
    },
    {
      title: t('services.trendAnalysis.title', 'Trend Analysis'),
      description: t('services.trendAnalysis.description', 'Predictive analytics and trend identification to help businesses stay ahead of market changes.'),
      icon: TrendingUp,
      features: [
        t('services.trendAnalysis.feature1', 'Predictive Models'),
        t('services.trendAnalysis.feature2', 'Industry Trends'),
        t('services.trendAnalysis.feature3', 'Future Scenarios')
      ],
      color: 'orange'
    },
    {
      title: t('services.globalMarketIntelligence.title', 'Global Intelligence'),
      description: t('services.globalMarketIntelligence.description', 'International market research covering emerging and established markets worldwide.'),
      icon: Globe,
      features: [
        t('services.globalMarketIntelligence.feature1', 'Regional Analysis'),
        t('services.globalMarketIntelligence.feature2', 'Cross-cultural Studies'),
        t('services.globalMarketIntelligence.feature3', 'Market Entry Strategy')
      ],
      color: 'red'
    },
    {
      title: t('services.customResearch.title', 'Custom Research'),
      description: t('services.customResearch.description', 'Tailored research solutions designed to meet specific business requirements and objectives.'),
      icon: PieChart,
      features: [
        t('services.customResearch.feature1', 'Bespoke Methodology'),
        t('services.customResearch.feature2', 'Dedicated Support'),
        t('services.customResearch.feature3', 'Flexible Timeline')
      ],
      color: 'indigo'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-800',
        button: 'hover:bg-blue-50 hover:text-blue-600'
      },
      green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        badge: 'bg-green-100 text-green-800',
        button: 'hover:bg-green-50 hover:text-green-600'
      },
      purple: {
        bg: 'bg-purple-50',
        icon: 'text-purple-600',
        badge: 'bg-purple-100 text-purple-800',
        button: 'hover:bg-purple-50 hover:text-purple-600'
      },
      orange: {
        bg: 'bg-orange-50',
        icon: 'text-orange-600',
        badge: 'bg-orange-100 text-orange-800',
        button: 'hover:bg-orange-50 hover:text-orange-600'
      },
      red: {
        bg: 'bg-red-50',
        icon: 'text-red-600',
        badge: 'bg-red-100 text-red-800',
        button: 'hover:bg-red-50 hover:text-red-600'
      },
      indigo: {
        bg: 'bg-indigo-50',
        icon: 'text-indigo-600',
        badge: 'bg-indigo-100 text-indigo-800',
        button: 'hover:bg-indigo-50 hover:text-indigo-600'
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Target className="w-4 h-4 mr-2" />
            {t('services.badge', 'Our Services')}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('services.title', 'Comprehensive Market Research Solutions')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('services.subtitle', 'Unlock business potential with our comprehensive suite of market research and business intelligence services tailored to your industry needs.')}
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const colors = getColorClasses(service.color);
            
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
                <CardHeader className="space-y-4">
                  <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-8 h-8 ${colors.icon}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-between group-hover:bg-opacity-100 transition-all duration-300 ${colors.button}`}
                  >
                    {t('services.learnMore', 'Learn More')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-background rounded-2xl p-8 shadow-lg border border-border">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {t('services.cta.title', 'Need a Custom Solution?')}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t('services.cta.description', 'Our team of experts can create a tailored research solution that perfectly matches your business objectives and requirements.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                {t('services.cta.primary', 'Get Custom Quote')}
              </Button>
              <Button variant="outline" size="lg">
                {t('services.cta.secondary', 'Schedule Consultation')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

};

export default ServicesSection;