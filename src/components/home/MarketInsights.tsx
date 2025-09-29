import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, ArrowUpRight } from "lucide-react";

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


const MarketInsights = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest Market Insights
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay ahead of the curve with our latest research findings and market intelligence 
            across key industries and emerging sectors.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {insights.map((insight, index) =>
          <Card key={index} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500">
              <CardHeader className="flex flex-row items-start space-y-0 pb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {insight.category}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {insight.date}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {insight.title}
                  </CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-green-600 font-semibold text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {insight.growth}
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {insight.description}
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>);

};

export default MarketInsights;