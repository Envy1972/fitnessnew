'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/components/auth/AuthProvider';

type WeightLog = {
  id: number;
  date: string;
  weight: number;
  notes: string;
};

export default function WeightPage() {
  const { user } = useAuth();
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [newWeight, setNewWeight] = useState<string>('');
  const [newNotes, setNewNotes] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  
  // Initialize with mock data
  useEffect(() => {
    const mockData: WeightLog[] = [
      { id: 1, date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0], weight: 395, notes: 'Starting weight' },
      { id: 2, date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0], weight: 394.2, notes: 'Feeling good after workout' },
      { id: 3, date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0], weight: 393.5, notes: 'Stayed strict on diet' },
      { id: 4, date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], weight: 393.8, notes: 'Slight increase, but normal fluctuation' },
      { id: 5, date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], weight: 392.9, notes: 'Back on track' },
      { id: 6, date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], weight: 392.1, notes: 'Good progress' },
      { id: 7, date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], weight: 391.5, notes: 'Feeling stronger' },
    ];
    
    setWeightLogs(mockData);
  }, []);
  
  const handleAddWeight = () => {
    if (!newWeight) {
      alert('Please enter your weight');
      return;
    }
    
    const weightValue = parseFloat(newWeight);
    if (isNaN(weightValue)) {
      alert('Please enter a valid weight');
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    // Check if we already have a log for today
    const existingTodayLog = weightLogs.find(log => log.date === today);
    if (existingTodayLog) {
      if (!confirm('You already have a weight log for today. Do you want to replace it?')) {
        return;
      }
      
      // Update existing log
      setWeightLogs(prev => 
        prev.map(log => 
          log.date === today 
            ? { ...log, weight: weightValue, notes: newNotes } 
            : log
        )
      );
    } else {
      // Add new log
      const newLog: WeightLog = {
        id: Date.now(),
        date: today,
        weight: weightValue,
        notes: newNotes
      };
      
      setWeightLogs(prev => [...prev, newLog].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
    
    // Reset form
    setNewWeight('');
    setNewNotes('');
    setShowAddForm(false);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  const calculateWeightLoss = () => {
    if (weightLogs.length < 2) return { total: 0, weekly: 0, remaining: 0 };
    
    // Sort logs by date (newest first)
    const sortedLogs = [...weightLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const currentWeight = sortedLogs[0].weight;
    const startingWeight = sortedLogs[sortedLogs.length - 1].weight;
    const goalWeight = user?.goalWeight || 220;
    
    const totalLoss = startingWeight - currentWeight;
    
    // Calculate weekly average
    const firstDate = new Date(sortedLogs[sortedLogs.length - 1].date);
    const lastDate = new Date(sortedLogs[0].date);
    const weeksDiff = (lastDate.getTime() - firstDate.getTime()) / (7 * 24 * 60 * 60 * 1000);
    
    const weeklyAverage = weeksDiff > 0 ? totalLoss / weeksDiff : 0;
    
    // Calculate remaining weight to lose
    const remaining = currentWeight - goalWeight;
    
    return {
      total: totalLoss,
      weekly: weeklyAverage,
      remaining: remaining > 0 ? remaining : 0
    };
  };
  
  const stats = calculateWeightLoss();
  
  return (
    <ProtectedRoute>
      <MainLayout currentPage="weight">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Weight Tracker</h1>
            <button 
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
              disabled={showAddForm}
            >
              Log Weight
            </button>
          </div>
          
          {showAddForm && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Log Today's Weight</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="input-field"
                    placeholder="Enter your weight"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                  <textarea 
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="input-field min-h-[80px]"
                    placeholder="How are you feeling? Any observations?"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddWeight}
                    className="btn-primary"
                  >
                    Save Weight
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Weight Progress</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Total Loss</p>
                <p className="text-2xl font-bold text-blue-800">{stats.total.toFixed(1)} lbs</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Weekly Average</p>
                <p className="text-2xl font-bold text-green-800">{stats.weekly.toFixed(1)} lbs</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Remaining to Goal</p>
                <p className="text-2xl font-bold text-amber-800">{stats.remaining.toFixed(1)} lbs</p>
              </div>
            </div>
            
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
              <p className="text-gray-500">Weight chart will be displayed here</p>
            </div>
            
            <h3 className="font-semibold mb-2">Weight History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weight (lbs)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Change
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {weightLogs.map((log, index) => {
                    const prevLog = index < weightLogs.length - 1 ? weightLogs[index + 1] : null;
                    const change = prevLog ? log.weight - prevLog.weight : 0;
                    
                    return (
                      <tr key={log.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(log.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {log.weight.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {index < weightLogs.length - 1 ? (
                            <span className={change < 0 ? 'text-green-600' : change > 0 ? 'text-red-600' : 'text-gray-500'}>
                              {change < 0 ? '▼' : change > 0 ? '▲' : '–'} {Math.abs(change).toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-gray-500">–</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {log.notes}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Weight Tracking Tips</h2>
            <div className="space-y-3">
              <p className="text-gray-700">For the most accurate tracking:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Weigh yourself at the same time each week (preferably in the morning after using the bathroom)</li>
                <li>Wear similar clothing each time</li>
                <li>Use the same scale</li>
                <li>Remember that weight fluctuations are normal; focus on the trend over time</li>
                <li>Consider tracking measurements (waist, chest, etc.) in addition to weight</li>
                <li>Be patient and consistent - sustainable weight loss is typically 1-2 pounds per week</li>
              </ul>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
