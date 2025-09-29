import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import {
  Award,
  Users,
  Globe,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Building,
  Calendar,
  Target } from
'lucide-react';

export default function CompanyInfo() {
  const { t } = useTranslation();

  const stats = [
  {
    value: '15+',
    label: t('company.stats.experience', 'Years of Experience'),
    icon: Calendar,
    description: t('company.stats.experienceDesc', 'Leading market research since 2009')
  },
  {
    value: '500+',
    label: t('company.stats.reports', 'Research Reports'),
    icon: Award,
    description: t('company.stats.reportsDesc', 'Comprehensive industry analysis')
  },
  {
    value: '50+',
    label: t('company.stats.industries', 'Industries Covered'),
    icon: Building,
    description: t('company.stats.industriesDesc', 'Cross-sector expertise')
  },
  {
    value: '10K+',
    label: t('company.stats.clients', 'Global Clients'),
    icon: Users,
    description: t('company.stats.clientsDesc', 'Trusted by Fortune 500 companies')
  },
  {
    value: '195',
    label: t('company.stats.countries', 'Countries'),
    icon: Globe,
    description: t('company.stats.countriesDesc', 'Worldwide market coverage')
  },
  {
    value: '98%',
    label: t('company.stats.satisfaction', 'Client Satisfaction'),
    icon: Target,
    description: t('company.stats.satisfactionDesc', 'Exceptional service quality')
  }];


  const values = [
  {
    title: t('company.values.accuracy.title', 'Data Accuracy'),
    description: t('company.values.accuracy.description', 'Rigorous data verification and validation processes ensure the highest quality insights.'),
    icon: Shield,
    color: 'blue'
  },
  {
    title: t('company.values.innovation.title', 'Innovation'),
    description: t('company.values.innovation.description', 'Cutting-edge research methodologies and analytical tools for comprehensive market intelligence.'),
    icon: Zap,
    color: 'purple'
  },
  {
    title: t('company.values.expertise.title', 'Industry Expertise'),
    description: t('company.values.expertise.description', 'Deep domain knowledge across sectors with specialized research teams.'),
    icon: TrendingUp,
    color: 'green'
  }];


  const achievements = [
  t('company.achievements.item1', 'ISO 27001 Certified for Information Security'),
  t('company.achievements.item2', 'Recognized as Top Market Research Firm by Industry Awards'),
  t('company.achievements.item3', 'Featured in leading business publications and media'),
  t('company.achievements.item4', 'Strategic partnerships with global consulting firms'),
  t('company.achievements.item5', 'Advanced AI and ML capabilities for data analysis'),
  t('company.achievements.item6', 'Real-time market monitoring and alert systems')];


  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200'
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-200'
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-600',
        border: 'border-green-200'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-6">
            <Building className="w-4 h-4 mr-2" />
            {t('company.badge', 'About Our Company')}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {t('company.title', 'Leading the Future of Market Intelligence')}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {t('company.description', 'For over a decade, Big Data Market Research has been at the forefront of market intelligence, delivering actionable insights that drive strategic decisions for businesses worldwide. Our commitment to accuracy, innovation, and client success sets us apart in the industry.')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 group">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {stat.label}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>);

          })}
        </div>

        {/* Company Values */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            {t('company.values.title', 'Our Core Values')}
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              const colors = getColorClasses(value.color);
              return (
                <Card key={index} className={`hover:shadow-lg transition-all duration-300 border-2 ${colors.border} hover:border-opacity-100`}>
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className={`w-8 h-8 ${colors.text}`} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      {value.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>);

            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            {t('company.achievements.title', 'Our Achievements')}
          </h3>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {achievements.map((achievement, index) =>
            <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{achievement}</span>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('company.cta.title', 'Ready to Transform Your Business Strategy?')}
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {t('company.cta.description', 'Join thousands of companies that trust our insights to make informed decisions and drive growth in competitive markets.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                {t('company.cta.primary', 'Explore Our Solutions')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" size="lg">
                {t('company.cta.secondary', 'Contact Our Team')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>);

}