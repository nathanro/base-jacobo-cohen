import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';

const VideoSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('video.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('video.subtitle')}
          </p>
        </div>
        
        <Card className="overflow-hidden shadow-2xl max-w-5xl mx-auto">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/0Hag78KWaMQ"
              title={t('video.title')}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </Card>
      </div>
    </section>
  );
};

export default VideoSection;