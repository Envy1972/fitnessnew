'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState<'weight' | 'workouts' | 'nutrition'>('weight');
  
  // Mock data for visualizations
  const weightData = [
    { date: '2025-03-24', weight: 395.0 },
    { date: '2025-03-25', weight: 394.2 },
    { date: '2025-03-26', weight: 393.5 },
    { date: '2025-03-27', weight: 393.8 },
    { date: '2025-03-28', weight: 392.9 },
    { date: '2025-03-29', weight: 392.1 },
    { date: '2025-03-30', weight: 391.5 },
    { date: '2025-03-31', weight: 390.8 },
  ];
  
  const workoutData = [
    { week: 'Week 1', workouts: 3, duration: 135 },
    { week: 'Week 2', workouts: 4, duration: 180 },
    { week: 'Week 3', workouts: 3, duration: 135 },
    { week: 'Week 4', workouts: 4, duration: 180 },
  ];
  
  const nutritionData = [
    { date: '2025-03-25', calories: 1800, protein: 150, fat: 130, carbs: 20 },
    { date: '2025-03-26', calories: 1750, protein: 145, fat: 125, carbs: 25 },
    { date: '2025-03-27', calories: 1900, protein: 155, fat: 140, carbs: 15 },
    { date: '2025-03-28', calories: 1820, protein: 148, fat: 135, carbs: 18 },
    { date: '2025-03-29', calories: 1780, protein: 152, fat: 128, carbs: 22 },
    { date: '2025-03-30', calories: 1850, protein: 160, fat: 132, carbs: 20 },
    { date: '2025-03-31', calories: 1800, protein: 150, fat: 130, carbs: 20 },
  ];
  
  return (
    <ProtectedRoute>
      <MainLayout currentPage="progress">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Progress Tracking</h1>
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveTab('weight')} 
                className={`px-3 py-1 rounded-md text-sm ${activeTab === 'weight' ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Weight
              </button>
              <button 
                onClick={() => setActiveTab('workouts')} 
                className={`px-3 py-1 rounded-md text-sm ${activeTab === 'workouts' ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Workouts
              </button>
              <button 
                onClick={() => setActiveTab('nutrition')} 
                className={`px-3 py-1 rounded-md text-sm ${activeTab === 'nutrition' ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Nutrition
              </button>
            </div>
          </div>
          
          {activeTab === 'weight' && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Weight Progress</h2>
              
              <div className="mb-6">
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="w-full px-4">
                    <div className="relative h-48">
                      {/* Simple chart visualization */}
                      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-full">
                        {weightData.map((data, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div 
                              className="w-8 bg-blue-600 rounded-t-sm" 
                              style={{ 
                                height: `${((395 - data.weight) / 5) * 100}%`,
                                minHeight: '4px'
                              }}
                            ></div>
                            <span className="text-xs mt-1 text-gray-500">{data.date.split('-')[2]}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Y-axis labels */}
                      <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-xs text-gray-500">
                        <span>395</span>
                        <span>393</span>
                        <span>391</span>
                        <span>390</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-500">Weight (lbs) over the past week</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Total Loss</p>
                  <p className="text-2xl font-bold text-blue-800">4.2 lbs</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Weekly Average</p>
                  <p className="text-2xl font-bold text-green-800">4.2 lbs</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Remaining to Goal</p>
                  <p className="text-2xl font-bold text-amber-800">170.8 lbs</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Projected Timeline</h3>
                <p className="text-gray-700">At your current rate of loss (4.2 lbs/week):</p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                  <li>25% of goal (43.8 lbs): <span className="font-medium">~10 weeks</span></li>
                  <li>50% of goal (87.5 lbs): <span className="font-medium">~21 weeks</span></li>
                  <li>75% of goal (131.3 lbs): <span className="font-medium">~31 weeks</span></li>
                  <li>100% of goal (175 lbs): <span className="font-medium">~42 weeks</span></li>
                </ul>
                <p className="text-sm text-gray-500 mt-3">Note: This is an estimate based on your current progress. Weight loss typically slows over time.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'workouts' && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Workout Progress</h2>
              
              <div className="mb-6">
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="w-full px-4">
                    <div className="relative h-48">
                      {/* Simple chart visualization */}
                      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around h-full">
                        {workoutData.map((data, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div className="flex items-end">
                              <div 
                                className="w-12 bg-blue-600 rounded-t-sm mr-1" 
                                style={{ height: `${(data.workouts / 5) * 100}%` }}
                              ></div>
                              <div 
                                className="w-12 bg-green-600 rounded-t-sm" 
                                style={{ height: `${(data.duration / 200) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs mt-1 text-gray-500">{data.week}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Legend */}
                      <div className="absolute top-0 right-0 flex items-center text-xs">
                        <div className="flex items-center mr-3">
                          <div className="w-3 h-3 bg-blue-600 mr-1"></div>
                          <span>Workouts</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-600 mr-1"></div>
                          <span>Minutes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-500">Workout frequency and duration by week</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Total Workouts</p>
                  <p className="text-2xl font-bold text-blue-800">14</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Total Duration</p>
                  <p className="text-2xl font-bold text-green-800">630 min</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Weekly Average</p>
                  <p className="text-2xl font-bold text-amber-800">3.5 workouts</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Workout Distribution</h3>
                <div className="flex items-center justify-around mt-4">
                  <div className="text-center">
                    <div className="inline-block w-24 h-24 rounded-full border-8 border-blue-600 relative">
                      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">40%</span>
                    </div>
                    <p className="mt-2 text-sm font-medium">Upper Body</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-block w-24 h-24 rounded-full border-8 border-green-600 relative">
                      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">30%</span>
                    </div>
                    <p className="mt-2 text-sm font-medium">Lower Body</p>
                  </div>
                  <div className="text-center">
                    <div className="inline-block w-24 h-24 rounded-full border-8 border-amber-600 relative">
                      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">30%</span>
                    </div>
                    <p className="mt-2 text-sm font-medium">Full Body</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'nutrition' && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Nutrition Progress</h2>
              
              <div className="mb-6">
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="w-full px-4">
                    <div className="relative h-48">
                      {/* Simple chart visualization */}
                      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-full">
                        {nutritionData.map((data, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div className="flex items-end">
                              <div 
                                className="w-2 bg-red-600 rounded-t-sm mx-0.5" 
                                style={{ height: `${(data.protein / 200) * 100}%` }}
                              ></div>
                              <div 
                                className="w-2 bg-yellow-600 rounded-t-sm mx-0.5" 
                                style={{ height: `${(data.fat / 200) * 100}%` }}
                              ></div>
                              <div 
                                className="w-2 bg-green-600 rounded-t-sm mx-0.5" 
                                style={{ height: `${(data.carbs / 50) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs mt-1 text-gray-500">{data.date.split('-')[2]}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Legend */}
                      <div className="absolute top-0 right-0 flex items-center text-xs">
                        <div className="flex items-center mr-2">
                          <div className="w-3 h-3 bg-red-600 mr-1"></div>
                          <span>Protein</span>
                        </div>
                        <div className="flex items-center mr-2">
                          <div className="w-3 h-3 bg-yellow-600 mr-1"></div>
                          <span>Fat</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-600 mr-1"></div>
                          <span>Carbs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-500">Macronutrient breakdown over the past week</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Avg. Protein</p>
                  <p className="text-2xl font-bold text-red-800">151g</p>
                  <p className="text-xs text-gray-500">33% of calories</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Avg. Fat</p>
                  <p className="text-2xl font-bold text-yellow-800">131g</p>
                  <p className="text-xs text-gray-500">65% of calories</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Avg. Carbs</p>
                  <p className="text-2xl font-bold text-green-800">20g</p>
                  <p className="text-xs text-gray-500">2% of calories</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Keto Diet Adherence</h3>
                <div className="flex items-center mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-green-600 h-4 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <span className="ml-3 font-bold">95%</span>
                </div>
                <p className="text-sm text-gray-500 mt-3">Your diet is well-aligned with keto guidelines. Maintaining low carbs (under 5% of calories) and high fat (over 60% of calories).</p>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
