import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Mail, Phone } from '../ui/Icons';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="hidden lg:block text-white mt-12"
      style={{
        background: 'linear-gradient(135deg, #be1a4f 0%, #dc1c5d 50%, #c54b4a 100%)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">Women SelfCare</h3>
            </div>
            <p className="text-white/80 text-sm">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="text-white/80 hover:text-white transition-colors">
                  {t('footer.aboutUs')}
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-white/80 hover:text-white transition-colors">
                  {t('footer.privacy')}
                </a>
              </li>
              <li>
                <a href="/terms" className="text-white/80 hover:text-white transition-colors">
                  {t('footer.terms')}
                </a>
              </li>
              <li>
                <a href="/help" className="text-white/80 hover:text-white transition-colors">
                  {t('footer.help')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-white/80" />
                <span className="text-white/80">support@womenselfcare.org</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-white/80" />
                <span className="text-white/80">1800-XXX-XXXX (Toll Free)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-8 pt-6 text-center">
          <p className="text-white/80 text-sm">
            © {currentYear} Women SelfCare. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};
