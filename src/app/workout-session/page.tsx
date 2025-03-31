'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useRouter } from 'next/navigation';

type Exercise = {
  id: number;
  name: string;
  sets: number;
  reps: string;
  rest_time: number;
  instructions: string;
  modifications: string;
  equipment: string;
  muscle_group: string;
};

export default function WorkoutSessionPage() {
  const router = useRouter();
  
  // In a real app, we would get the workout ID from the URL and fetch the data
  // For this demo, we'll use mock data for the Upper Body workout
  const [workout, setWorkout] = useState({
    id: 1,
    name: 'Upper Body Workout',
    description: 'Focus on chest, shoulders, back, and arms',
    duration: 45,
    workout_type: 'Upper Body'
  });
  
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: 1, name: 'Seated Dumbbell Shoulder Press', sets: 3, reps: '8-12', rest_time: 90, instructions: 'Sit on bench with back support. Hold dumbbells at shoulder height. Press weights overhead without locking elbows. Lower back to starting position with control.', modifications: 'Use lighter weights, focus on form', equipment: 'Dumbbells, Bench', muscle_group: 'Shoulders' },
    { id: 2, name: 'Seated Dumbbell Rows', sets: 3, reps: '8-12', rest_time: 90, instructions: 'Sit on edge of bench, feet flat on floor. Lean forward slightly with flat back. Pull dumbbells toward lower ribs. Lower with control.', modifications: 'Use bench for support if needed', equipment: 'Dumbbells, Bench', muscle_group: 'Back' },
    { id: 3, name: 'Seated Dumbbell Chest Press', sets: 3, reps: '8-12', rest_time: 90, instructions: 'Sit on bench with back support. Hold dumbbells at chest level. Press weights forward without locking elbows. Return to starting position with control.', modifications: 'Use lighter weights, focus on form', equipment: 'Dumbbells, Bench', muscle_group: 'Chest' },
    { id: 4, name: 'Seated Bicep Curls', sets: 3, reps: '8-12', rest_time: 90, instructions: 'Sit on bench with back support. Curl dumbbells toward shoulders. Lower with control.', modifications: 'Perform one arm at a time if needed', equipment: 'Dumbbells, Bench', muscle_group: 'Arms' },
    { id: 5, name: 'Seated Tricep Extensions', sets: 3, reps: '8-12', rest_time: 90, instructions: 'Sit on bench with back support. Hold one dumbbell with both hands above head. Lower dumbbell behind head by bending elbows. Extend arms back up without locking elbows.', modifications: 'Use lighter weight, focus on form', equipment: 'Dumbbells, Bench', muscle_group: 'Arms' }
  ]);
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [exerciseProgress, setExerciseProgress] = useState<{[key: number]: {completed: boolean, sets: {weight: string, reps: string, completed: boolean}[]}}>({}); 
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');
  
  // Initialize exercise progress
  useEffect(() => {
    const initialProgress: {[key: number]: {completed: boolean, sets: {weight: string, reps: string, completed: boolean}[]}} = {};
    
    exercises.forEach(exercise => {
      initialProgress[exercise.id] = {
        completed: false,
        sets: Array(exercise.sets).fill(0).map(() => ({
          weight: '',
          reps: '',
          completed: false
        }))
      };
    });
    
    setExerciseProgress(initialProgress);
  }, [exercises]);
  
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (timerActive) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);
  
  // Workout duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (workoutStarted && !workoutCompleted) {
      interval = setInterval(() => {
        setWorkoutDuration(prev => prev + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [workoutStarted, workoutCompleted]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleStartWorkout = () => {
    setWorkoutStarted(true);
    setWorkoutStartTime(new Date());
  };
  
  const handleStartRest = () => {
    setTimer(exercises[currentExerciseIndex].rest_time);
    setTimerActive(true);
  };
  
  const handleStopRest = () => {
    setTimerActive(false);
    setTimer(0);
  };
  
  const handleSetComplete = (exerciseId: number, setIndex: number, weight: string, reps: string) => {
    setExerciseProgress(prev => {
      const newProgress = { ...prev };
      newProgress[exerciseId].sets[setIndex] = {
        weight,
        reps,
        completed: true
      };
      
      // Check if all sets are completed
      const allSetsCompleted = newProgress[exerciseId].sets.every(set => set.completed);
      if (allSetsCompleted) {
        newProgress[exerciseId].completed = true;
      }
      
      return newProgress;
    });
    
    // If this is the last set of the current exercise, move to the next exercise
    if (currentSet === exercises[currentExerciseIndex].sets) {
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
      }
    } else {
      setCurrentSet(prev => prev + 1);
    }
    
    handleStartRest();
  };
  
  const handleExerciseInputChange = (exerciseId: number, setIndex: number, field: 'weight' | 'reps', value: string) => {
    setExerciseProgress(prev => {
      const newProgress = { ...prev };
      newProgress[exerciseId].sets[setIndex][field] = value;
      return newProgress;
    });
  };
  
  const handleCompleteWorkout = () => {
    setWorkoutCompleted(true);
    setTimerActive(false);
    
    // In a real app, we would save the workout data to the database here
    alert('Workout completed! In a full implementation, this data would be saved to your workout history.');
  };
  
  const isWorkoutComplete = () => {
    return exercises.every(exercise => exerciseProgress[exercise.id]?.completed);
  };
  
  const currentExercise = exercises[currentExerciseIndex];
  
  return (
    <ProtectedRoute>
      <MainLayout currentPage="workouts">
        <div className="space-y-6">
          {!workoutStarted ? (
            <div className="card text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{workout.name}</h1>
              <p className="text-gray-600 mb-8">{workout.description}</p>
              <p className="text-gray-700 mb-2">This workout includes:</p>
              <ul className="mb-8">
                {exercises.map(exercise => (
                  <li key={exercise.id} className="text-gray-600">{exercise.name} - {exercise.sets} sets of {exercise.reps} reps</li>
                ))}
              </ul>
              <p className="text-gray-700 mb-8">Followed by 10 minutes of cardio</p>
              <button 
                onClick={handleStartWorkout}
                className="btn-primary text-lg px-8 py-3"
              >
                Start Workout
              </button>
            </div>
          ) : workoutCompleted ? (
            <div className="card text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Workout Complete!</h1>
              <p className="text-gray-600 mb-4">Great job completing your workout.</p>
              <div className="mb-8">
                <p className="text-gray-700">Total Duration: {formatTime(workoutDuration)}</p>
                <p className="text-gray-700">Date: {workoutStartTime?.toLocaleDateString()}</p>
              </div>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Workout Summary</h2>
                {exercises.map(exercise => (
                  <div key={exercise.id} className="mb-4">
                    <h3 className="font-medium">{exercise.name}</h3>
                    <div className="flex flex-wrap justify-center gap-2 mt-1">
                      {exerciseProgress[exercise.id]?.sets.map((set, idx) => (
                        <div key={idx} className="bg-gray-100 px-3 py-1 rounded-md">
                          <span className="text-gray-700">{set.weight}lbs × {set.reps}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Notes</h2>
                <p className="text-gray-600">{notes || 'No notes recorded'}</p>
              </div>
              <button 
                onClick={() => router.push('/workouts')}
                className="btn-primary text-lg px-8 py-3"
              >
                Return to Workouts
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">{workout.name}</h1>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-xl font-bold">{formatTime(workoutDuration)}</p>
                </div>
              </div>
              
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Current Exercise</h2>
                  <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {currentExerciseIndex + 1} of {exercises.length}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-lg">{currentExercise.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{currentExercise.muscle_group}</span>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">{currentExercise.equipment}</span>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm text-gray-700"><strong>Instructions:</strong> {currentExercise.instructions}</p>
                    <p className="text-sm text-gray-700 mt-2"><strong>Modifications:</strong> {currentExercise.modifications}</p>
                  </div>
                </div>
                
                {timerActive ? (
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg mb-4 text-center">
                    <p className="text-amber-800 font-medium mb-2">Rest Timer</p>
                    <p className="text-3xl font-bold text-amber-900">{formatTime(timer)}</p>
                    <button 
                      onClick={handleStopRest}
                      className="mt-3 bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-400 transition-colors"
                    >
                      Skip Rest
                    </button>
                  </div>
                ) : (
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Set {currentSet} of {currentExercise.sets}</h3>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
                        <input 
                          type="number" 
                          className="input-field"
                          value={exerciseProgress[currentExercise.id]?.sets[currentSet - 1]?.weight || ''}
                          onChange={(e) => handleExerciseInputChange(currentExercise.id, currentSet - 1, 'weight', e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reps</label>
                        <input 
                          type="number" 
                          className="input-field"
                          value={exerciseProgress[currentExercise.id]?.sets[currentSet - 1]?.reps || ''}
                          onChange={(e) => handleExerciseInputChange(currentExercise.id, currentSet - 1, 'reps', e.target.value)}
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => handleSetComplete(
                        currentExercise.id, 
                        currentSet - 1, 
                        exerciseProgress[currentExercise.id]?.sets[currentSet - 1]?.weight || '0',
                        exerciseProgress[currentExercise.id]?.sets[currentSet - 1]?.reps || '0'
                      )}
                      className="w-full mt-3 bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Complete Set
                    </button>
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium mb-2">Progress</h3>
                  <div className="space-y-3">
                    {exercises.map((exercise, index) => (
                      <div key={exercise.id} className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                          exerciseProgress[exercise.id]?.completed 
                            ? 'bg-green-500 text-white' 
                            : index === currentExerciseIndex 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200'
                        }`}>
                          {exerciseProgress[exercise.id]?.completed ? '✓' : index + 1}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${
                            index === currentExerciseIndex ? 'text-blue-800' : 'text-gray-700'
                          }`}>
                            {exercise.name}
                          </p>
                          <div className="flex mt-1">
                            {Array(exercise.sets).fill(0).map((_, setIdx) => (
                              <div 
                                key={setIdx}
                                className={`w-6 h-1 mr-1 rounded-sm ${
                                  exerciseProgress[exercise.id]?.sets[setIdx]?.completed
                                    ? 'bg-green-500'
                                    : index === currentExerciseIndex && setIdx === currentSet - 1
                                      ? 'bg-blue-500'
                                      : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Cardio (10 minutes)</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input type="radio" id="cardio1" name="cardio" className="mr-3" />
                    <label htmlFor="cardio1" className="text-gray-700">Modified HIIT on Stair Climber</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="cardio2" name="cardio" className="mr-3" />
                    <label htmlFor="cardio2" className="text-gray-700">Steady-State on Rowing Machine</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="cardio3" name="cardio" className="mr-3" />
                    <label htmlFor="cardio3" className="text-gray-700">Combined Approach</label>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Workout Notes</h2>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  placeholder="Add notes about your workout (how you felt, any modifications, etc.)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              
              <div className="flex justify-center">
                <button 
                  onClick={handleCompleteWorkout}
                  className="btn-primary text-lg px-8 py-3"
                  disabled={!isWorkoutComplete()}
                >
                  Complete Workout
                </button>
              </div>
            </>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
