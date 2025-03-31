-- Drop tables if they exist to ensure clean setup
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS weight_logs;
DROP TABLE IF EXISTS workouts;
DROP TABLE IF EXISTS workout_logs;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS workout_exercises;
DROP TABLE IF EXISTS nutrition_logs;
DROP TABLE IF EXISTS favorite_meals;

-- Create users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    height REAL,
    starting_weight REAL NOT NULL,
    goal_weight REAL NOT NULL,
    fitness_level TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create weight_logs table for weekly weigh-ins
CREATE TABLE weight_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    weight REAL NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create workouts table for workout templates
CREATE TABLE workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- in minutes
    workout_type TEXT NOT NULL, -- 'Upper Body', 'Lower Body', 'Full Body'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create exercises table
CREATE TABLE exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    equipment TEXT,
    muscle_group TEXT,
    instructions TEXT,
    modifications TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create workout_exercises junction table
CREATE TABLE workout_exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    sets INTEGER NOT NULL,
    reps TEXT NOT NULL, -- Can be a range like "8-12"
    rest_time INTEGER NOT NULL, -- in seconds
    order_in_workout INTEGER NOT NULL,
    FOREIGN KEY (workout_id) REFERENCES workouts(id),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

-- Create workout_logs table to track completed workouts
CREATE TABLE workout_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    workout_id INTEGER NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration INTEGER, -- actual duration in minutes
    perceived_effort INTEGER, -- scale 1-10
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (workout_id) REFERENCES workouts(id)
);

-- Create exercise_logs table to track individual exercise performance
CREATE TABLE exercise_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_log_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    sets_completed INTEGER NOT NULL,
    reps_completed TEXT NOT NULL, -- Can be comma-separated like "10,12,8"
    weight_used TEXT, -- Can be comma-separated like "15,15,20"
    notes TEXT,
    FOREIGN KEY (workout_log_id) REFERENCES workout_logs(id),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

-- Create nutrition_logs table
CREATE TABLE nutrition_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    meal_name TEXT NOT NULL,
    calories INTEGER,
    protein REAL, -- in grams
    fat REAL, -- in grams
    carbs REAL, -- in grams
    notes TEXT,
    is_favorite BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create favorite_meals table
CREATE TABLE favorite_meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    meal_name TEXT NOT NULL,
    calories INTEGER,
    protein REAL, -- in grams
    fat REAL, -- in grams
    carbs REAL, -- in grams
    ingredients TEXT,
    preparation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert default user (for development purposes)
INSERT INTO users (name, age, gender, starting_weight, goal_weight, fitness_level)
VALUES ('Default User', 52, 'Male', 395, 220, 'Beginner');

-- Insert default workouts
INSERT INTO workouts (name, description, duration, workout_type)
VALUES 
('Upper Body Workout', 'Focus on chest, shoulders, back, and arms', 45, 'Upper Body'),
('Lower Body Workout', 'Focus on legs and core', 45, 'Lower Body'),
('Full Body Workout', 'Comprehensive workout targeting all major muscle groups', 45, 'Full Body');

-- Insert exercises
INSERT INTO exercises (name, description, equipment, muscle_group, instructions, modifications)
VALUES 
-- Upper Body Exercises
('Seated Dumbbell Shoulder Press', 'Shoulder press performed while seated', 'Dumbbells, Bench', 'Shoulders', 'Sit on bench with back support. Hold dumbbells at shoulder height. Press weights overhead without locking elbows. Lower back to starting position with control.', 'Use lighter weights, focus on form'),
('Seated Dumbbell Rows', 'Row exercise performed while seated', 'Dumbbells, Bench', 'Back', 'Sit on edge of bench, feet flat on floor. Lean forward slightly with flat back. Pull dumbbells toward lower ribs. Lower with control.', 'Use bench for support if needed'),
('Seated Dumbbell Chest Press', 'Chest press performed while seated', 'Dumbbells, Bench', 'Chest', 'Sit on bench with back support. Hold dumbbells at chest level. Press weights forward without locking elbows. Return to starting position with control.', 'Use lighter weights, focus on form'),
('Seated Bicep Curls', 'Bicep curl performed while seated', 'Dumbbells, Bench', 'Arms', 'Sit on bench with back support. Curl dumbbells toward shoulders. Lower with control.', 'Perform one arm at a time if needed'),
('Seated Tricep Extensions', 'Tricep extension performed while seated', 'Dumbbells, Bench', 'Arms', 'Sit on bench with back support. Hold one dumbbell with both hands above head. Lower dumbbell behind head by bending elbows. Extend arms back up without locking elbows.', 'Use lighter weight, focus on form'),

-- Lower Body Exercises
('Seated Leg Extensions', 'Leg extension performed while seated', 'Bench', 'Legs', 'Sit on bench with good posture. Extend one leg until straight. Hold briefly, then lower with control.', 'Reduce range of motion if uncomfortable'),
('Seated Leg Curls', 'Leg curl performed while seated', 'Bench', 'Legs', 'Sit on edge of bench. Bend knee, bringing heel toward buttocks. Return to starting position with control.', 'Reduce range of motion if uncomfortable'),
('Seated Calf Raises', 'Calf raise performed while seated', 'Dumbbells, Bench', 'Legs', 'Sit on bench, feet flat on floor. Place dumbbells on thighs just above knees. Raise heels off floor as high as possible. Lower with control.', 'Start without weights if needed'),
('Seated Dumbbell Knee Lifts', 'Knee lift performed while seated with dumbbells', 'Dumbbells, Bench', 'Core, Legs', 'Sit on bench with good posture. Hold light dumbbells on thighs. Lift one knee up toward chest. Lower with control.', 'Start without weights if needed'),
('Seated Hip Abduction', 'Hip abduction performed while seated', 'Dumbbells, Bench', 'Legs', 'Sit on bench with good posture. Place light dumbbell on outer thigh. Move knee outward against resistance. Return to starting position with control.', 'Start without weights if needed');

-- Connect exercises to workouts
-- Upper Body Workout
INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_time, order_in_workout)
VALUES 
(1, 1, 3, '8-12', 90, 1), -- Shoulder Press
(1, 2, 3, '8-12', 90, 2), -- Rows
(1, 3, 3, '8-12', 90, 3), -- Chest Press
(1, 4, 3, '8-12', 90, 4), -- Bicep Curls
(1, 5, 3, '8-12', 90, 5); -- Tricep Extensions

-- Lower Body Workout
INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_time, order_in_workout)
VALUES 
(2, 6, 3, '8-12', 90, 1), -- Leg Extensions
(2, 7, 3, '8-12', 90, 2), -- Leg Curls
(2, 8, 3, '8-12', 90, 3), -- Calf Raises
(2, 9, 3, '8-12', 90, 4), -- Knee Lifts
(2, 10, 3, '8-12', 90, 5); -- Hip Abduction

-- Full Body Workout
INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, rest_time, order_in_workout)
VALUES 
(3, 1, 2, '8-12', 60, 1),  -- Shoulder Press
(3, 2, 2, '8-12', 60, 2),  -- Rows
(3, 6, 2, '8-12', 60, 3),  -- Leg Extensions
(3, 4, 2, '8-12', 60, 4),  -- Bicep Curls
(3, 8, 2, '8-12', 60, 5),  -- Calf Raises
(3, 3, 2, '8-12', 60, 6);  -- Chest Press

-- Insert sample favorite meals for carnivore/keto diet
INSERT INTO favorite_meals (user_id, meal_name, calories, protein, fat, carbs, ingredients, preparation)
VALUES 
(1, 'Ribeye Steak with Butter', 650, 50, 50, 0, 'Ribeye steak (8oz), Grass-fed butter (1 tbsp), Salt, Pepper', 'Season steak with salt and pepper. Cook to desired doneness. Top with butter.'),
(1, 'Bacon and Eggs', 450, 30, 35, 2, 'Eggs (3), Bacon (4 slices), Butter (1 tsp)', 'Cook bacon until crispy. Fry eggs in bacon fat. Season with salt and pepper.'),
(1, 'Salmon with Kimchi', 520, 40, 35, 5, 'Salmon fillet (6oz), Kimchi (1/4 cup), Olive oil (1 tbsp), Salt, Pepper', 'Season salmon with salt and pepper. Pan-fry in olive oil. Serve with kimchi on the side.'),
(1, 'Ground Beef Bowl', 580, 45, 40, 3, 'Ground beef (6oz), Egg (1), Avocado (1/4), Salt, Pepper, Garlic powder', 'Brown ground beef with seasonings. Top with fried egg and sliced avocado.');
