<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)->group(function () {
    Route::post('login', 'login');
    Route::post('register', 'register');
    Route::post('logout', 'logout');
});

Route::get('tasks', 'TaskController@index');
Route::get('tasks/{id}', 'TaskController@show');
Route::get('tasks/filter-by-due-date', 'TaskController@filterByDueDate');
Route::get('tasks/filter-by-status', 'TaskController@filterByStatus');

Route::post('tasks', 'TaskController@store')->middleware('employer');
Route::put('tasks/{id}', 'TaskController@update')->middleware('employer');
Route::delete('tasks/{id}', 'TaskController@destroy')->middleware('employer');