import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Heart, AlertCircle } from '../components/ui/Icons';

const NotFoundPage: React.FC = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Heart className="h-16 w-16 text-pink-300" />
              <AlertCircle className="h-8 w-8 text-red-500 absolute -top-1 -right-1" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          <div className="space-y-3">
            <Link to="/dashboard">
              <Button className="w-full bg-pink-500 hover:bg-pink-600">
                Go to Dashboard
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="outline" className="w-full">
                Get Health Support
              </Button>
            </Link>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team at{' '}
              <a href="tel:+91-XXXX-XXXX-XX" className="text-pink-600 hover:text-pink-500">
                +91-XXXX-XXXX-XX
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;
