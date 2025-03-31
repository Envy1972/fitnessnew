'use client';

import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <MainLayout currentPage="dashboard">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* User Profile Summary */}
          <div className="card bg-gradient-to-r from-blue-800 to-blue-600 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Welcome, {user?.name}</h2>
                <p className="mt-1 text-blue-100">Let's crush your fitness goals today!</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Current Weight</p>
                <p className="text-2xl font-bold">{user?.startingWeight} lbs</p>
                <p className="text-sm text-blue-100 mt-1">Goal: {user?.goalWeight} lbs</p>
              </div>
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Weekly Progress</h2>
            <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Weight tracking chart will appear here</p>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <div>
                <p className="text-gray-500">Starting</p>
                <p className="font-semibold">{user?.startingWeight} lbs</p>
              </div>
              <div>
                <p className="text-gray-500">Current</p>
                <p className="font-semibold">{user?.startingWeight} lbs</p>
              </div>
              <div>
                <p className="text-gray-500">Goal</p>
                <p className="font-semibold">{user?.goalWeight} lbs</p>
              </div>
              <div>
                <p className="text-gray-500">To Lose</p>
                <p className="font-semibold">{user ? (user.startingWeight - user.goalWeight) : 0} lbs</p>
              </div>
            </div>
          </div>

          {/* Next Workout */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Next Workout</h2>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-blue-800">Upper Body Workout</h3>
                  <p className="text-sm text-gray-600 mt-1">45 minutes • 5 exercises</p>
                </div>
                <button className="btn-primary">Start Workout</button>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-medium text-gray-700 mb-2">Upcoming Schedule</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Lower Body Workout</p>
                    <p className="text-sm text-gray-500">Wednesday</p>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-800">Details</button>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Full Body Workout</p>
                    <p className="text-sm text-gray-500">Friday</p>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-800">Details</button>
                </div>
              </div>
            </div>
          </div>

          {/* Nutrition Summary */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Nutrition Summary</h2>
            <div className="flex space-x-4">
              <div className="flex-1 bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-500">Calories</p>
                <p className="text-xl font-bold text-gray-800">0</p>
              </div>
              <div className="flex-1 bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-500">Protein</p>
                <p className="text-xl font-bold text-gray-800">0g</p>
              </div>
              <div className="flex-1 bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-500">Fat</p>
                <p className="text-xl font-bold text-gray-800">0g</p>
              </div>
              <div className="flex-1 bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-500">Carbs</p>
                <p className="text-xl font-bold text-gray-800">0g</p>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button className="btn-secondary">Log Meal</button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            <button className="card bg-amber-50 border border-amber-100 hover:bg-amber-100 transition-colors text-center py-4">
              <p className="font-medium text-amber-800">Log Weight</p>
            </button>
            <button className="card bg-teal-50 border border-teal-100 hover:bg-teal-100 transition-colors text-center py-4">
              <p className="font-medium text-teal-800">View Exercises</p>
            </button>
            <button className="card bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors text-center py-4">
              <p className="font-medium text-blue-800">Favorite Meals</p>
            </button>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
