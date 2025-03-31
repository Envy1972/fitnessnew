'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

type Workout = {
  id: number;
  name: string;
  description: string;
  duration: number;
  workout_type: string;
};

type Exercise = {
  id: number;
  name: string;
  description: string;
  equipment: string;
  muscle_group: string;
  instructions: string;
  modifications: string;
  sets: number;
  reps: string;
  rest_time: number;
  order_in_workout: number;
};

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([
    { id: 1, name: 'Upper Body Workout', description: 'Focus on chest, shoulders, back, and arms', duration: 45, workout_type: 'Upper Body' },
    { id: 2, name: 'Lower Body Workout', description: 'Focus on legs and core', duration: 45, workout_type: 'Lower Body' },
    { id: 3, name: 'Full Body Workout', description: 'Comprehensive workout targeting all major muscle groups', duration: 45, workout_type: 'Full Body' }
  ]);
  
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [view, setView] = useState<'list' | 'detail' | 'calendar'>('list');
  
  // Mock exercises data for each workout
  const workoutExercises = {
    1: [ // Upper Body
      { id: 1, name: 'Seated Dumbbell Shoulder Press', description: 'Shoulder press performed while seated', equipment: 'Dumbbells, Bench', muscle_group: 'Shoulders', instructions: 'Sit on bench with back support. Hold dumbbells at shoulder height. Press weights overhead without locking elbows. Lower back to starting position with control.', modifications: 'Use lighter weights, focus on form', sets: 3, reps: '8-12', rest_time: 90, order_in_workout: 1 },
      { id: 2, name: 'Seated Dumbbell Rows', description: 'Row exercise performed while seated', equipment: 'Dumbbells, Bench', muscle_group: 'Back', instructions: 'Sit on edge of bench, feet flat on floor. Lean forward slightly with flat back. Pull dumbbells toward lower ribs. Lower with control.', modifications: 'Use bench for support if needed', sets: 3, reps: '8-12', rest_time: 90, order_in_workout: 2 },
      { id: 3, name: 'Seated Dumbbell Chest Press', description: 'Chest press performed while seated', equipment: 'Dumbbells, Bench', muscle_group: 'Chest', instructions: 'Sit on bench with back support. Hold dumbbells at chest level. Press weights forward without locking elbows. Return to starting position with control.', modifications: 'Use lighter weights, focus on form', sets: 3, reps: '8-12', rest_time: 90, order_in_workout: 3 },
      { id: 4, name: 'Seated Bicep Curls', description: 'Bicep curl performed while seated', equipment: 'Dumbbells, Bench', muscle_group: 'Arms', instructions: 'Sit on bench with back support. Curl dumbbells toward shoulders. Lower with control.', modifications: 'Perform one arm at a time if needed', sets: 3, reps: '8-12', rest_time: 90, order_in_workout: 4 },
      { id: 5, name: 'Seated Tricep Extensions', description: 'Tricep extension performed while seated', equipment: 'Dumbbells, Bench', muscle_group: 'Arms', instructions: 'Sit on bench with back support. Hold one dumbbell with both hands above head. Lower dumbbell behind head by bending elbows. Extend arms back up without locking elbows.', modifications: 'Use lighter weight, focus on form', sets: 3, reps: '8-12', rest_time: 90, order_in_workout: 5 }
    ],
    2: [ // Lower Body
      { id: 6, name: 'Seated Leg Extensions', description: 'Leg extension performed while seated', equipment: 'Bench', muscle_group: 'Legs', instructions: 'Sit on bench with good posture. Extend one leg until straight. Hold briefly, then lower with control.', modifications: 'Reduce range of motion if uncomfortable', sets: 3, reps: '8-12', rest_time: 90, order_in_workout: 1 },
      { id: 7, name: 'Seated Leg Curls', description: 'Leg curl performed while seated', equipment: 'Bench', muscle_group: 'Legs', instructions: 'Sit on edge of bench. Bend knee, bringing heel toward buttocks. Return to starting position with control.', modifications: 'Reduce range of motion if uncomfortable', sets: 3, reps: '8-12', rest_time: 90, order_in_workout: 2 },
      { id: 8, name: 'Seated Calf Raises', description: 'Calf raise performed while seated', equipment: 'Dumbbells, Bench', muscle_group: 'Legs', instructions: 'Sit on bench, feet flat on floor. Place dumbbells on thighs just above knees. Raise heels off floor as high as possible. Lower with control.', modifications: 'Start without weights if needed', sets: 3, reps: '8-12', rest_time: 90, order_in_workout: 3 },
      { id: 9, name: 'Seated Dumbbell Knee Lifts', description: 'Knee lift performed while seated with dumbbells', equipment: 'Dumbbells, Bench', muscle_group: 'Core, Legs', instructions: 'Sit on bench with good posture. Hold light dumbbells on thighs. Lift one knee up toward chest. Lower with control.', modifications: 'Start without weights if needed', sets: 3, reps: '8-12', rest_time: 90, order_in_workout: 4 },
      { id: 10, name: 'Seated Hip Abduction', description: 'Hip abduction performed while seated', equipment: 'Dumbbells, Bench', muscle_group: 'Legs', instructions: 'Sit on bench with good posture. Place light dumbbell on outer thigh. Move knee outward against resistance. Return to starting position with control.', modifications: 'Start without weights if needed', sets: 3, reps: '8-12', rest_time: 90, order_in_workout: 5 }
    ],
    3: [ // Full Body
      { id: 1, name: 'Seated Dumbbell Shoulder Press', description: 'Shoulder press performed while seated', equipment: 'Dumbbells, Bench', muscle_group: 'Shoulders', instructions: 'Sit on bench with back support. Hold dumbbells at shoulder height. Press weights overhead without locking elbows. Lower back to starting position with control.', modifications: 'Use lighter weights, focus on form', sets: 2, reps: '8-12', rest_time: 60, order_in_workout: 1 },
      { id: 2, name: 'Seated Dumbbell Rows', description: 'Row exercise performed while seated', equipment: 'Dumbbells, Bench', muscle_group: 'Back', instructions: 'Sit on edge of bench, feet flat on floor. Lean forward slightly with flat back. Pull dumbbells toward lower ribs. Lower with control.', modifications: 'Use bench for support if needed', sets: 2, reps: '8-12', rest_time: 60, order_in_workout: 2 },
      { id: 6, name: 'Seated Leg Extensions', description: 'Leg extension performed while seated', equipment: 'Bench', muscle_group: 'Legs', instructions: 'Sit on bench with good posture. Extend one leg until straight. Hold briefly, then lower with control.', modifications: 'Reduce range of motion if uncomfortable', sets: 2, reps: '8-12', rest_time: 60, order_in_workout: 3 },
      { id: 4, name: 'Seated Bicep Curls', description: 'Bicep curl performed while seated', equipment: 'Dumbbells, Bench', muscle_group: 'Arms', instructions: 'Sit on bench with back support. Curl dumbbells toward shoulders. Lower with control.', modifications: 'Perform one arm at a time if needed', sets: 2, reps: '8-12', rest_time: 60, order_in_workout: 4 },
      { id: 8, name: 'Seated Calf Raises', description: 'Calf raise performed while seated', equipment: 'Dumbbells, Bench', muscle_group: 'Legs', instructions: 'Sit on bench, feet flat on floor. Place dumbbells on thighs just above knees. Raise heels off floor as high as possible. Lower with control.', modifications: 'Start without weights if needed', sets: 2, reps: '8-12', rest_time: 60, order_in_workout: 5 },
      { id: 3, name: 'Seated Dumbbell Chest Press', description: 'Chest press performed while seated', equipment: 'Dumbbells, Bench', muscle_group: 'Chest', instructions: 'Sit on bench with back support. Hold dumbbells at chest level. Press weights forward without locking elbows. Return to starting position with control.', modifications: 'Use lighter weights, focus on form', sets: 2, reps: '8-12', rest_time: 60, order_in_workout: 6 }
    ]
  };

  useEffect(() => {
    if (selectedWorkout) {
      // @ts-ignore - Workaround for mock data
      setExercises(workoutExercises[selectedWorkout.id] || []);
    }
  }, [selectedWorkout]);

  const handleSelectWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setView('detail');
  };

  const handleBackToList = () => {
    setSelectedWorkout(null);
    setView('list');
  };

  const handleStartWorkout = (workout: Workout) => {
    // In a real app, this would navigate to the workout session page
    alert(`Starting ${workout.name}. This would navigate to the workout session page in the full implementation.`);
  };

  const handleScheduleWorkout = (workout: Workout) => {
    // In a real app, this would open a scheduling modal
    alert(`Scheduling ${workout.name}. This would open a scheduling modal in the full implementation.`);
  };

  return (
    <ProtectedRoute>
      <MainLayout currentPage="workouts">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Workouts</h1>
            <div className="flex space-x-2">
              <button 
                onClick={() => setView('list')} 
                className={`px-3 py-1 rounded-md text-sm ${view === 'list' ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                List
              </button>
              <button 
                onClick={() => setView('calendar')} 
                className={`px-3 py-1 rounded-md text-sm ${view === 'calendar' ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Calendar
              </button>
            </div>
          </div>

          {view === 'list' && (
            <div className="space-y-4">
              {workouts.map((workout) => (
                <div key={workout.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{workout.name}</h2>
                      <p className="text-gray-600 mt-1">{workout.description}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <span className="mr-4">{workout.duration} minutes</span>
                        <span>{workout.workout_type}</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button 
                        onClick={() => handleSelectWorkout(workout)} 
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => handleStartWorkout(workout)} 
                        className="btn-primary text-sm py-1"
                      >
                        Start Workout
                      </button>
                      <button 
                        onClick={() => handleScheduleWorkout(workout)} 
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        Schedule
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {view === 'detail' && selectedWorkout && (
            <div className="space-y-6">
              <button 
                onClick={handleBackToList}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <span>← Back to Workouts</span>
              </button>
              
              <div className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedWorkout.name}</h2>
                    <p className="text-gray-600 mt-1">{selectedWorkout.description}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <span className="mr-4">{selectedWorkout.duration} minutes</span>
                      <span>{selectedWorkout.workout_type}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleStartWorkout(selectedWorkout)} 
                      className="btn-primary"
                    >
                      Start Workout
                    </button>
                    <button 
                      onClick={() => handleScheduleWorkout(selectedWorkout)} 
                      className="btn-secondary"
                    >
                      Schedule
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-xl font-semibold mb-4">Exercises</h3>
                <div className="space-y-4">
                  {exercises.map((exercise) => (
                    <div key={exercise.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{exercise.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{exercise.muscle_group}</span>
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">{exercise.equipment}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex space-x-4 text-sm">
                            <div>
                              <p className="text-gray-500">Sets</p>
                              <p className="font-semibold">{exercise.sets}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Reps</p>
                              <p className="font-semibold">{exercise.reps}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Rest</p>
                              <p className="font-semibold">{exercise.rest_time}s</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <button 
                          className="text-sm text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            const details = document.getElementById(`exercise-details-${exercise.id}`);
                            if (details) {
                              details.classList.toggle('hidden');
                            }
                          }}
                        >
                          Show Details
                        </button>
                        <div id={`exercise-details-${exercise.id}`} className="hidden mt-2 text-sm">
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="font-medium text-gray-700">Instructions:</p>
                            <p className="text-gray-600 mt-1">{exercise.instructions}</p>
                            
                            <p className="font-medium text-gray-700 mt-3">Modifications:</p>
                            <p className="text-gray-600 mt-1">{exercise.modifications}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-xl font-semibold mb-4">Cardio Options</h3>
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="font-semibold text-gray-900">Modified HIIT on Stair Climber</h4>
                    <p className="text-sm text-gray-600 mt-1">1 minute moderate pace, 30 seconds increased pace. Repeat for 10 minutes total.</p>
                    <p className="text-sm text-gray-500 mt-2">Modification: Reduce intensity if knee pain occurs, focus on proper form</p>
                  </div>
                  
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="font-semibold text-gray-900">Steady-State on Rowing Machine</h4>
                    <p className="text-sm text-gray-600 mt-1">10 minutes at moderate, sustainable pace. Focus on proper form and full range of motion.</p>
                    <p className="text-sm text-gray-500 mt-2">Modification: Take brief pauses if needed, maintain proper posture</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900">Combined Approach</h4>
                    <p className="text-sm text-gray-600 mt-1">5 minutes on stair climber at moderate pace, 5 minutes on rowing machine at moderate pace.</p>
                    <p className="text-sm text-gray-500 mt-2">Modification: Adjust time distribution based on comfort</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'calendar' && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Workout Calendar</h2>
              <div className="bg-gray-100 p-8 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Calendar view will be implemented here</p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  The calendar will allow you to:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                  <li>Schedule workouts on specific days</li>
                  <li>View your workout history</li>
                  <li>Track your consistency</li>
                  <li>Reschedule or cancel workouts as needed</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
