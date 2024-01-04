<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\TaskController;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)->group(function () {
    Route::post('login', 'login');
    Route::post('register', 'register');
    Route::post('logout', 'logout');
});

Route::get('tasks', [TaskController::class, 'index']);
Route::get('tasks/{id}', [TaskController::class, 'show']);
Route::get('tasks/filter-by-due-date', [TaskController::class, 'filterByDueDate']);
Route::get('tasks/filter-by-status', [TaskController::class, 'filterByStatus']);
Route::post('tasks/{id}', [TaskController::class, 'update']);

Route::group(['middleware' => 'employer'], function () {
    Route::post('tasks', [TaskController::class, 'store']);
    Route::delete('tasks/{id}', [TaskController::class, 'destroy']);
    Route::get('employees', [TaskController::class, 'getEmployees']);
});