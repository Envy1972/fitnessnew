'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

type Meal = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  isFavorite: boolean;
};

type DailyLog = {
  date: string;
  meals: Meal[];
  totals: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
};

export default function NutritionPage() {
  const [view, setView] = useState<'daily' | 'history' | 'favorites'>('daily');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dailyLog, setDailyLog] = useState<DailyLog>({
    date: selectedDate,
    meals: [],
    totals: { calories: 0, protein: 0, fat: 0, carbs: 0 }
  });
  const [showAddMealForm, setShowAddMealForm] = useState(false);
  const [newMeal, setNewMeal] = useState<Omit<Meal, 'id'>>({
    name: '',
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    isFavorite: false
  });
  
  // Mock favorite meals data
  const [favoriteMeals, setFavoriteMeals] = useState<Meal[]>([
    { id: 1, name: 'Ribeye Steak with Butter', calories: 650, protein: 50, fat: 50, carbs: 0, isFavorite: true },
    { id: 2, name: 'Bacon and Eggs', calories: 450, protein: 30, fat: 35, carbs: 2, isFavorite: true },
    { id: 3, name: 'Salmon with Kimchi', calories: 520, protein: 40, fat: 35, carbs: 5, isFavorite: true },
    { id: 4, name: 'Ground Beef Bowl', calories: 580, protein: 45, fat: 40, carbs: 3, isFavorite: true }
  ]);
  
  // Mock nutrition history data
  const [nutritionHistory, setNutritionHistory] = useState<DailyLog[]>([
    {
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
      meals: [
        { id: 101, name: 'Ribeye Steak with Butter', calories: 650, protein: 50, fat: 50, carbs: 0, isFavorite: true },
        { id: 102, name: 'Bacon and Eggs', calories: 450, protein: 30, fat: 35, carbs: 2, isFavorite: true }
      ],
      totals: { calories: 1100, protein: 80, fat: 85, carbs: 2 }
    },
    {
      date: new Date(Date.now() - 172800000).toISOString().split('T')[0], // Day before yesterday
      meals: [
        { id: 201, name: 'Salmon with Kimchi', calories: 520, protein: 40, fat: 35, carbs: 5, isFavorite: true },
        { id: 202, name: 'Ground Beef Bowl', calories: 580, protein: 45, fat: 40, carbs: 3, isFavorite: true }
      ],
      totals: { calories: 1100, protein: 85, fat: 75, carbs: 8 }
    }
  ]);
  
  // Calculate totals whenever meals change
  useEffect(() => {
    if (dailyLog.meals.length > 0) {
      const totals = dailyLog.meals.reduce(
        (acc, meal) => {
          return {
            calories: acc.calories + meal.calories,
            protein: acc.protein + meal.protein,
            fat: acc.fat + meal.fat,
            carbs: acc.carbs + meal.carbs
          };
        },
        { calories: 0, protein: 0, fat: 0, carbs: 0 }
      );
      
      setDailyLog(prev => ({ ...prev, totals }));
    }
  }, [dailyLog.meals]);
  
  const handleAddMeal = () => {
    if (!newMeal.name) {
      alert('Please enter a meal name');
      return;
    }
    
    const mealToAdd: Meal = {
      ...newMeal,
      id: Date.now() // Generate a unique ID
    };
    
    setDailyLog(prev => ({
      ...prev,
      meals: [...prev.meals, mealToAdd]
    }));
    
    // Reset form
    setNewMeal({
      name: '',
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      isFavorite: false
    });
    
    setShowAddMealForm(false);
  };
  
  const handleAddFavoriteMeal = (meal: Meal) => {
    const mealToAdd: Meal = {
      ...meal,
      id: Date.now() // Generate a unique ID
    };
    
    setDailyLog(prev => ({
      ...prev,
      meals: [...prev.meals, mealToAdd]
    }));
  };
  
  const handleRemoveMeal = (mealId: number) => {
    setDailyLog(prev => ({
      ...prev,
      meals: prev.meals.filter(meal => meal.id !== mealId)
    }));
  };
  
  const handleSaveMealAsFavorite = (meal: Meal) => {
    // Check if already in favorites
    const existingIndex = favoriteMeals.findIndex(m => m.name === meal.name);
    
    if (existingIndex >= 0) {
      alert('This meal is already in your favorites');
      return;
    }
    
    const favoriteToAdd: Meal = {
      ...meal,
      isFavorite: true
    };
    
    setFavoriteMeals(prev => [...prev, favoriteToAdd]);
    alert('Meal added to favorites');
  };
  
  const handleRemoveFavorite = (mealId: number) => {
    setFavoriteMeals(prev => prev.filter(meal => meal.id !== mealId));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMeal(prev => ({
      ...prev,
      [name]: name === 'name' ? value : parseFloat(value)
    }));
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };
  
  return (
    <ProtectedRoute>
      <MainLayout currentPage="nutrition">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Nutrition Tracker</h1>
            <div className="flex space-x-2">
              <button 
                onClick={() => setView('daily')} 
                className={`px-3 py-1 rounded-md text-sm ${view === 'daily' ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Daily Log
              </button>
              <button 
                onClick={() => setView('history')} 
                className={`px-3 py-1 rounded-md text-sm ${view === 'history' ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                History
              </button>
              <button 
                onClick={() => setView('favorites')} 
                className={`px-3 py-1 rounded-md text-sm ${view === 'favorites' ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Favorites
              </button>
            </div>
          </div>
          
          {view === 'daily' && (
            <>
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Daily Nutrition</h2>
                  <div className="flex items-center">
                    <input 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Calories</p>
                    <p className="text-2xl font-bold text-blue-800">{dailyLog.totals.calories}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Protein</p>
                    <p className="text-2xl font-bold text-red-800">{dailyLog.totals.protein}g</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Fat</p>
                    <p className="text-2xl font-bold text-yellow-800">{dailyLog.totals.fat}g</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Carbs</p>
                    <p className="text-2xl font-bold text-green-800">{dailyLog.totals.carbs}g</p>
                  </div>
                </div>
                
                <h3 className="font-semibold mb-2">Today's Meals</h3>
                {dailyLog.meals.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No meals logged yet today</p>
                ) : (
                  <div className="space-y-3 mb-4">
                    {dailyLog.meals.map(meal => (
                      <div key={meal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <div>
                          <p className="font-medium">{meal.name}</p>
                          <div className="flex space-x-3 text-sm text-gray-500">
                            <span>{meal.calories} cal</span>
                            <span>{meal.protein}g protein</span>
                            <span>{meal.fat}g fat</span>
                            <span>{meal.carbs}g carbs</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleSaveMealAsFavorite(meal)}
                            className="text-amber-500 hover:text-amber-600"
                          >
                            ★
                          </button>
                          <button 
                            onClick={() => handleRemoveMeal(meal.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {showAddMealForm ? (
                  <div className="border border-gray-200 rounded-md p-4 mb-4">
                    <h3 className="font-semibold mb-3">Add New Meal</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meal Name</label>
                        <input 
                          type="text" 
                          name="name"
                          value={newMeal.name}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="e.g., Ribeye Steak with Butter"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                          <input 
                            type="number" 
                            name="calories"
                            value={newMeal.calories}
                            onChange={handleInputChange}
                            className="input-field"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                          <input 
                            type="number" 
                            name="protein"
                            value={newMeal.protein}
                            onChange={handleInputChange}
                            className="input-field"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Fat (g)</label>
                          <input 
                            type="number" 
                            name="fat"
                            value={newMeal.fat}
                            onChange={handleInputChange}
                            className="input-field"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                          <input 
                            type="number" 
                            name="carbs"
                            value={newMeal.carbs}
                            onChange={handleInputChange}
                            className="input-field"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => setShowAddMealForm(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleAddMeal}
                          className="btn-primary"
                        >
                          Add Meal
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-2 mb-4">
                    <button 
                      onClick={() => setShowAddMealForm(true)}
                      className="btn-primary"
                    >
                      Add New Meal
                    </button>
                    <button 
                      onClick={() => setView('favorites')}
                      className="btn-secondary"
                    >
                      Add from Favorites
                    </button>
                  </div>
                )}
              </div>
              
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Keto Diet Guidelines</h2>
                <div className="space-y-3">
                  <p className="text-gray-700">Your carnivore/keto diet should focus on:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>High fat (70-80% of calories)</li>
                    <li>Moderate protein (20-25% of calories)</li>
                    <li>Very low carb (5% or less of calories)</li>
                  </ul>
                  <p className="text-gray-700 mt-3">Recommended foods:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Meat (beef, pork, lamb, game)</li>
                    <li>Poultry (chicken, turkey, duck)</li>
                    <li>Fish and seafood</li>
                    <li>Eggs</li>
                    <li>Butter and ghee</li>
                    <li>Limited low-carb vegetables (kimchi is a good choice)</li>
                  </ul>
                </div>
              </div>
            </>
          )}
          
          {view === 'favorites' && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Favorite Meals</h2>
              {favoriteMeals.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No favorite meals saved yet</p>
              ) : (
                <div className="space-y-3 mb-4">
                  {favoriteMeals.map(meal => (
                    <div key={meal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium">{meal.name}</p>
                        <div className="flex space-x-3 text-sm text-gray-500">
                          <span>{meal.calories} cal</span>
                          <span>{meal.protein}g protein</span>
                          <span>{meal.fat}g fat</span>
                          <span>{meal.carbs}g carbs</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleAddFavoriteMeal(meal)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Add to Today
                        </button>
                        <button 
                          onClick={() => handleRemoveFavorite(meal.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button 
                onClick={() => setView('daily')}
                className="btn-primary"
              >
                Back to Daily Log
              </button>
            </div>
          )}
          
          {view === 'history' && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Nutrition History</h2>
              {nutritionHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No nutrition history available</p>
              ) : (
                <div className="space-y-6">
                  {nutritionHistory.map(day => (
                    <div key={day.date} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h3 className="font-semibold text-lg mb-2">{formatDate(day.date)}</h3>
                      
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <div className="bg-gray-50 p-2 rounded text-center">
                          <p className="text-xs text-gray-500">Calories</p>
                          <p className="font-semibold">{day.totals.calories}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded text-center">
                          <p className="text-xs text-gray-500">Protein</p>
                          <p className="font-semibold">{day.totals.protein}g</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded text-center">
                          <p className="text-xs text-gray-500">Fat</p>
                          <p className="font-semibold">{day.totals.fat}g</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded text-center">
                          <p className="text-xs text-gray-500">Carbs</p>
                          <p className="font-semibold">{day.totals.carbs}g</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {day.meals.map(meal => (
                          <div key={meal.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <p className="font-medium">{meal.name}</p>
                              <div className="flex space-x-2 text-xs text-gray-500">
                                <span>{meal.calories} cal</span>
                                <span>{meal.protein}g protein</span>
                                <span>{meal.fat}g fat</span>
                                <span>{meal.carbs}g carbs</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <button 
                  onClick={() => setView('daily')}
                  className="btn-primary"
                >
                  Back to Daily Log
                </button>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
