<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TaskController;
use App\Models\Task;

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/employees', [AuthController::class, 'getEmployees']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::apiResource('/tasks', TaskController::class);
Route::get('/employee/tasks', [TaskController::class, 'getEmployeeTasks'])->middleware('auth:sanctum');
Route::post('/tasks/{id}/submit', [TaskController::class, 'submitTask'])->middleware('auth:sanctum');
Route::get('/employee/completed-tasks', [TaskController::class, 'getCompletedTasks'])->middleware('auth:sanctum');
Route::get('/count', [TaskController::class, 'countEmployees'])->middleware('auth:sanctum');
Route::get('/employees/{id}/tasks', [TaskController::class, 'getEmployeeTask'])->middleware('auth:sanctum');
Route::put('tasks/{task}', [TaskController::class, 'update'])->middleware('auth:sanctum');
Route::get('/task-count', [TaskController::class, 'getTaskStatistics']);
Route::delete('/tasks/{id}', [TaskController::class, 'destroy'])->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->delete('/tasks/{id}', [TaskController::class, 'destroy']);


// Route::get('/notifications', [NotificationController::class, 'index']);
// Route::put('/tasks/{id}', [TaskController::class, 'update'])->middleware('auth:sanctum');

// Route::middleware('auth:sanctum')->group(function () {
//     Route::apiResource('/tasks', [TaskController::class, 'store']);
// });

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');