import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/ui/Card';
import { MapPin, Phone, Navigation } from '../../components/ui/Icons';

const MapPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-neutral-charcoal mb-6">
          <MapPin className="inline h-8 w-8 mr-2 text-primary-maroon" />
          Nearby Healthcare Facilities
        </h1>

        <Card>
          <div className="p-6">
            <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center mb-6">
              <div className="text-center">
                <Navigation className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Map will be displayed here</p>
                <p className="text-sm text-gray-500 mt-2">Integration with Google Maps / OpenStreetMap</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-neutral-charcoal">Nearest Facilities</h3>
              
              <div className="p-4 border-2 border-primary-pink/30 rounded-xl hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-neutral-charcoal">Community Health Center</h4>
                <p className="text-sm text-neutral-brown mt-1">2.3 km away • Open 24/7</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-primary-maroon">
                  <Phone className="h-4 w-4" />
                  <span>+91 1800-XXX-XXXX</span>
                </div>
              </div>

              <div className="p-4 border-2 border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-neutral-charcoal">ASHA Worker - Radha Devi</h4>
                <p className="text-sm text-neutral-brown mt-1">1.5 km away • Village: Rampur</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-primary-maroon">
                  <Phone className="h-4 w-4" />
                  <span>+91 98XXX-XXXXX</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default MapPage;
