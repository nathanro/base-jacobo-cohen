import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const ContactSection = () => {
  const { t } = useTranslation();

  const contactInfo = [
  {
    icon: Mail,
    titleKey: "contact.email",
    details: ["research@datainsights.com", "sales@datainsights.com"],
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: Phone,
    titleKey: "contact.phone",
    details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
    color: "bg-green-100 text-green-600"
  },
  {
    icon: MapPin,
    titleKey: "contact.address",
    details: ["123 Business District", "New York, NY 10001"],
    color: "bg-purple-100 text-purple-600"
  },
  {
    icon: Clock,
    titleKey: "contact.businessHours",
    details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM"],
    color: "bg-orange-100 text-orange-600"
  }];


  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info, index) =>
            <Card key={index} className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${info.color}`}>
                      <info.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{t(info.titleKey)}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {info.details.map((detail, idx) =>
                <CardDescription key={idx} className="text-gray-600 mb-1">
                      {detail}
                    </CardDescription>
                )}
                </CardContent>
              </Card>
            )}
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-6 w-6" />
                  <CardTitle>Need Immediate Help?</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-100 mb-4">
                  Our research consultants are available for immediate assistance 
                  with your market intelligence needs.
                </CardDescription>
                <Button variant="secondary" className="w-full">
                  Start Live Chat
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" placeholder="Enter your first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" placeholder="Enter your last name" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('contact.email')} *</Label>
                    <Input id="email" type="email" placeholder={`Enter your ${t('contact.email').toLowerCase()}`} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" placeholder="Enter your company name" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input id="subject" placeholder="Enter message subject" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">{t('contact.message')} *</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your research needs or questions..."
                    rows={6} />

                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="newsletter" className="rounded border-gray-300" />
                  <Label htmlFor="newsletter" className="text-sm text-gray-600">
                    Subscribe to our newsletter for market insights and updates
                  </Label>
                </div>
                
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Send className="h-5 w-5 mr-2" />
                  {t('contact.send')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>);

};

export default ContactSection;