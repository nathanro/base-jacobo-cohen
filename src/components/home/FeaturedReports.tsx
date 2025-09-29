import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye } from "lucide-react";
import { useTranslation } from 'react-i18next';

const reports = [
{
  title: "Global Cloud Computing Market Analysis 2024-2030",
  description: "Comprehensive analysis of cloud infrastructure, SaaS, PaaS, and IaaS markets with detailed competitive landscape and growth projections.",
  category: "Technology",
  pages: 285,
  price: "$4,999",
  publishDate: "December 2024",
  highlights: ["Market Size: $856.45 Billion", "CAGR: 16.3%", "Key Players: AWS, Microsoft, Google"]
},
{
  title: "Electric Vehicle Market Trends & Forecast",
  description: "In-depth study of EV adoption rates, charging infrastructure development, and regulatory impact across major markets.",
  category: "Automotive",
  pages: 340,
  price: "$5,499",
  publishDate: "November 2024",
  highlights: ["Market Size: $388.1 Billion", "CAGR: 22.1%", "Regional Focus: Global"]
},
{
  title: "Digital Healthcare Transformation Report",
  description: "Analysis of telemedicine, AI-powered diagnostics, and digital therapeutics reshaping the healthcare industry.",
  category: "Healthcare",
  pages: 420,
  price: "$6,299",
  publishDate: "November 2024",
  highlights: ["Market Size: $659.8 Billion", "CAGR: 29.1%", "Focus: Digital Health Tech"]
}];


const FeaturedReports = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('featuredReports.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('featuredReports.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {reports.map((report, index) =>
          <Card key={index} className="group hover:shadow-2xl transition-all duration-300 bg-white border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative">
                <div className="absolute top-4 right-4">
                  <FileText className="h-6 w-6 opacity-80" />
                </div>
                <Badge variant="secondary" className="w-fit mb-2 bg-white/20 text-white border-white/30">
                  {report.category}
                </Badge>
                <CardTitle className="text-xl font-bold leading-tight mb-2">
                  {report.title}
                </CardTitle>
                <div className="text-sm opacity-90">
                  Published: {report.publishDate} • {report.pages} pages
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                  {report.description}
                </CardDescription>
                
                <div className="space-y-2 mb-6">
                  <h4 className="font-semibold text-sm text-gray-900">Key Highlights:</h4>
                  {report.highlights.map((highlight, idx) =>
                <div key={idx} className="text-sm text-gray-600 flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      {highlight}
                    </div>
                )}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-2xl font-bold text-blue-600">
                    {report.price}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="group-hover:border-blue-500">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Download className="h-4 w-4 mr-1" />
                      Buy Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            View All Reports
          </Button>
        </div>
      </div>
    </section>);

};

export default FeaturedReports;