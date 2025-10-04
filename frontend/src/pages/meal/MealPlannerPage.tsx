import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Utensils, Plus } from '../../components/ui/Icons';

const MealPlannerPage: React.FC = () => {
  const mealPlan = {
    breakfast: ['Idli with Sambar', 'Glass of Milk', 'Banana'],
    lunch: ['Dal Rice', 'Mixed Vegetable Curry', 'Salad', 'Buttermilk'],
    snack: ['Fruit Chaat', 'Handful of Nuts'],
    dinner: ['Roti', 'Paneer Curry', 'Green Vegetables', 'Curd']
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-neutral-charcoal">
            <Utensils className="inline h-8 w-8 mr-2 text-secondary-400" />
            Meal Planner
          </h1>
          <Button className="btn-primary flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Custom Meal
          </Button>
        </div>

        <Card className="bg-gradient-to-r from-secondary-400/10 to-accent-green/10 border-secondary-400/30">
          <div className="p-6">
            <h2 className="text-xl font-bold text-neutral-charcoal mb-3">
              Today's Nutrition Goal
            </h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-maroon">2100</div>
                <div className="text-sm text-neutral-brown">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-green">75g</div>
                <div className="text-sm text-neutral-brown">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-skyblue">25mg</div>
                <div className="text-sm text-neutral-brown">Iron</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-700">1200mg</div>
                <div className="text-sm text-neutral-brown">Calcium</div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-bold text-neutral-charcoal mb-4 flex items-center gap-2">
                🌅 Breakfast
              </h3>
              <ul className="space-y-2">
                {mealPlan.breakfast.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-neutral-brown">
                    <span className="w-2 h-2 bg-secondary-400 rounded-full"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-bold text-neutral-charcoal mb-4 flex items-center gap-2">
                🌞 Lunch
              </h3>
              <ul className="space-y-2">
                {mealPlan.lunch.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-neutral-brown">
                    <span className="w-2 h-2 bg-accent-green rounded-full"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-bold text-neutral-charcoal mb-4 flex items-center gap-2">
                ☕ Evening Snack
              </h3>
              <ul className="space-y-2">
                {mealPlan.snack.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-neutral-brown">
                    <span className="w-2 h-2 bg-accent-skyblue rounded-full"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-bold text-neutral-charcoal mb-4 flex items-center gap-2">
                🌙 Dinner
              </h3>
              <ul className="space-y-2">
                {mealPlan.dinner.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-neutral-brown">
                    <span className="w-2 h-2 bg-primary-pink rounded-full"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-accent-green/10 to-secondary-400/10 border-accent-green/30">
          <div className="p-6">
            <h3 className="text-lg font-bold text-neutral-charcoal mb-3">
              Nutritionist's Tip of the Day
            </h3>
            <p className="text-neutral-brown">
              Include iron-rich foods like spinach, dates, and jaggery in your daily diet. 
              Pair them with vitamin C sources like lemon or orange to enhance iron absorption.
            </p>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default MealPlannerPage;
