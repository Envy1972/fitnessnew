'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [isNewUser, setIsNewUser] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    startingWeight: '',
    goalWeight: '',
    fitnessLevel: 'Beginner'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demo purposes, create a user with ID 1
    const user = {
      id: 1,
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      startingWeight: parseFloat(formData.startingWeight),
      goalWeight: parseFloat(formData.goalWeight),
      fitnessLevel: formData.fitnessLevel
    };
    
    login(user);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Fitness Tracker
          </h1>
          <h2 className="mt-2 text-center text-xl text-gray-600">
            {isNewUser ? 'Create your account' : 'Sign in to your account'}
          </h2>
        </div>
        
        {!isNewUser ? (
          <div className="mt-8">
            <p className="text-center text-gray-600 mb-4">
              For demo purposes, we'll create a default user profile.
            </p>
            <button
              onClick={() => setIsNewUser(true)}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Get Started
            </button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label htmlFor="name" className="label">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Your Name"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="age" className="label">Age</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  required
                  value={formData.age}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Your Age"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="gender" className="label">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="startingWeight" className="label">Current Weight (lbs)</label>
                <input
                  id="startingWeight"
                  name="startingWeight"
                  type="number"
                  step="0.1"
                  required
                  value={formData.startingWeight}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Current Weight"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="goalWeight" className="label">Goal Weight (lbs)</label>
                <input
                  id="goalWeight"
                  name="goalWeight"
                  type="number"
                  step="0.1"
                  required
                  value={formData.goalWeight}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Goal Weight"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="fitnessLevel" className="label">Fitness Level</label>
                <select
                  id="fitnessLevel"
                  name="fitnessLevel"
                  required
                  value={formData.fitnessLevel}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Account
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
