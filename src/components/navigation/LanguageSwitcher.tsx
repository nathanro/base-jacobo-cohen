import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
'@/components/ui/select';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem('language', value);
  };

  const currentLanguage = i18n.language.startsWith('en') ? 'en' : 
                         i18n.language.startsWith('es') ? 'es' : 'en';

  return (
    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[140px] h-9">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <SelectValue>
            {currentLanguage === 'es' ? 'Español' : 'English'}
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="es">Español</SelectItem>
      </SelectContent>
    </Select>
  );

};

export default LanguageSwitcher;