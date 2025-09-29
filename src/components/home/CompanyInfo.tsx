import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award, Globe2, Target, CheckCircle, Building2 } from "lucide-react";

const stats = [
{ icon: Users, label: "Expert Analysts", value: "200+" },
{ icon: Globe2, label: "Countries Covered", value: "195" },
{ icon: Award, label: "Years Experience", value: "15+" },
{ icon: Target, label: "Client Satisfaction", value: "98%" }];


const achievements = [
"ISO 9001:2015 Certified Research Process",
"Trusted by Fortune 500 Companies",
"Award-winning Research Methodology",
"24/7 Global Customer Support",
"Real-time Market Intelligence Platform",
"Custom Research Solutions Available"];


const CompanyInfo = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Company Description */}
          <div>
            <div className="flex items-center mb-6">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                About Us
              </Badge>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Leading the Future of 
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}Market Intelligence
              </span>
            </h2>
            
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Big Data Market Research is a premier market intelligence firm specializing in 
                comprehensive industry analysis, strategic insights, and data-driven research 
                solutions. Since our founding, we've been at the forefront of market research 
                innovation, serving businesses across the globe.
              </p>
              
              <p>
                Our team of expert analysts combines traditional research methodologies with 
                cutting-edge big data analytics to deliver actionable insights that drive 
                business growth and strategic decision-making.
              </p>
              
              <p>
                We pride ourselves on delivering high-quality, accurate, and timely research 
                that helps our clients navigate complex market landscapes and identify 
                emerging opportunities.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              {achievements.map((achievement, index) =>
              <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{achievement}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Stats */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) =>
              <Card key={index} className="text-center p-6 border-0 shadow-lg bg-gradient-to-br from-gray-50 to-blue-50">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <Card className="p-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-xl">
              <CardContent className="p-0 text-center">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-blue-100 leading-relaxed">
                  To empower businesses with actionable market intelligence and strategic 
                  insights that drive growth, innovation, and competitive advantage in 
                  an increasingly data-driven world.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>);

};

export default CompanyInfo;