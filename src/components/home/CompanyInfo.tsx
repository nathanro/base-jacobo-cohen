import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award, Globe2, Target, CheckCircle, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const stats = [
  { number: "15+", labelKey: "companyInfo.experience" },
  { number: "500+", labelKey: "companyInfo.clients" },
  { number: "10K+", labelKey: "companyInfo.datasets" }];


  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t('companyInfo.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t('companyInfo.description')}
            </p>
            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat, index) =>
              <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{t(stat.labelKey)}</div>
                </div>
              )}
            </div>
          </div>
          
          <div className="relative">
            <Card className="bg-card shadow-lg">
              <CardContent className="p-8">
                <div className="w-full h-64 bg-gradient-to-br from-primary/10 to-accent/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <div className="text-lg font-semibold text-foreground">Financial Analytics</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>);


};

export default CompanyInfo;