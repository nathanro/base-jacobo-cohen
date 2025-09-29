import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowUpRight,
  BarChart3,
  Globe,
  DollarSign,
  Users,
  Zap } from
"lucide-react";
import { useTranslation } from 'react-i18next';

const insights = [
{
  title: "AI Market Expected to Reach $1.8 Trillion by 2030",
  description: "Artificial intelligence market shows unprecedented growth with 35% CAGR driven by enterprise adoption and technological breakthroughs.",
  category: "Technology",
  date: "Dec 2024",
  growth: "+42%",
  color: "bg-blue-500"
},
{
  title: "E-commerce Transformation in Emerging Markets",
  description: "Digital commerce platforms experiencing rapid expansion in Asia-Pacific and Latin America regions with mobile-first strategies.",
  category: "E-commerce",
  date: "Dec 2024",
  growth: "+28%",
  color: "bg-green-500"
},
{
  title: "Renewable Energy Investment Surge",
  description: "Clean energy sector attracts record $2.8 trillion investment as governments push for carbon neutrality goals.",
  category: "Energy",
  date: "Nov 2024",
  growth: "+56%",
  color: "bg-emerald-500"
},
{
  title: "Healthcare Tech Revolution Continues",
  description: "Digital health solutions and telemedicine adoption accelerates post-pandemic with focus on personalized care.",
  category: "Healthcare",
  date: "Nov 2024",
  growth: "+31%",
  color: "bg-purple-500"
}];


export default function MarketInsights() {
  const { t } = useTranslation();

  const keyMetrics = [
  {
    title: t('insights.metrics.globalMarket.title', 'Global Market Size'),
    value: '$847.2B',
    change: '+12.5%',
    isPositive: true,
    icon: Globe,
    description: t('insights.metrics.globalMarket.description', 'Total addressable market across all sectors'),
    period: '2024 YTD'
  },
  {
    title: t('insights.metrics.techGrowth.title', 'Tech Sector Growth'),
    value: '23.4%',
    change: '+2.1%',
    isPositive: true,
    icon: TrendingUp,
    description: t('insights.metrics.techGrowth.description', 'Year-over-year growth in technology markets'),
    period: 'Q3 2024'
  },
  {
    title: t('insights.metrics.consumerSpending.title', 'Consumer Spending'),
    value: '$2.3T',
    change: '-1.2%',
    isPositive: false,
    icon: DollarSign,
    description: t('insights.metrics.consumerSpending.description', 'Total consumer spending across categories'),
    period: 'Monthly'
  },
  {
    title: t('insights.metrics.marketPenetration.title', 'Digital Adoption'),
    value: '78.9%',
    change: '+5.3%',
    isPositive: true,
    icon: Users,
    description: t('insights.metrics.marketPenetration.description', 'Digital service adoption rate globally'),
    period: '2024'
  }];


  const insights = [
  {
    title: t('insights.trending.ai.title', 'AI Market Explosion'),
    description: t('insights.trending.ai.description', 'Artificial intelligence market projected to reach $1.8 trillion by 2030, driven by enterprise adoption and consumer applications.'),
    impact: 'High',
    category: 'Technology',
    readTime: '5 min read',
    color: 'blue'
  },
  {
    title: t('insights.trending.sustainability.title', 'Sustainability Revolution'),
    description: t('insights.trending.sustainability.description', 'Green technology investments surging as companies prioritize ESG initiatives and carbon neutrality goals.'),
    impact: 'Medium',
    category: 'Environment',
    readTime: '3 min read',
    color: 'green'
  },
  {
    title: t('insights.trending.remote.title', 'Remote Work Evolution'),
    description: t('insights.trending.remote.description', 'Hybrid work models becoming permanent, reshaping real estate, technology, and service industries globally.'),
    impact: 'High',
    category: 'Workplace',
    readTime: '4 min read',
    color: 'purple'
  }];


  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      orange: 'bg-orange-100 text-orange-800'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
            <BarChart3 className="w-4 h-4 mr-2" />
            {t('insights.badge', 'Market Intelligence')}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('insights.title', 'Real-Time Market Insights')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('insights.subtitle', 'Stay ahead of market trends with our comprehensive analysis and data-driven insights across industries and geographies.')}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {keyMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className={`flex items-center space-x-1 ${metric.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.isPositive ?
                      <TrendingUp className="w-4 h-4" /> :

                      <TrendingDown className="w-4 h-4" />
                      }
                      <span className="text-sm font-medium">{metric.change}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">{metric.title}</h3>
                    <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                    <p className="text-sm text-gray-600">{metric.description}</p>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{metric.period}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>);

          })}
        </div>

        {/* Trending Insights */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {t('insights.trending.title', 'Trending Insights')}
            </h3>
            <Button variant="outline" className="flex items-center space-x-2">
              <span>{t('insights.trending.viewAll', 'View All Reports')}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {insights.map((insight, index) =>
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorClasses(insight.color)}`}>
                      {insight.category}
                    </span>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{insight.readTime}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {insight.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {insight.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {insight.impact} {t('insights.impact', 'Impact')}
                      </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {t('insights.cta.title', 'Get Personalized Market Intelligence')}
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {t('insights.cta.description', 'Access detailed reports, custom analytics, and expert insights tailored to your industry and business needs.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              {t('insights.cta.primary', 'Explore Premium Reports')}
            </Button>
            <Button variant="outline" size="lg">
              {t('insights.cta.secondary', 'Schedule Demo')}
            </Button>
          </div>
        </div>
      </div>
    </section>);

}