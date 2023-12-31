<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\TaskAssignment;
use App\Models\User;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = Task::all();
        return response()->json(['tasks' => $tasks]);
    }

    public function show($id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        return response()->json(['task' => $task]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'due_date' => 'required|date',
            'status' => 'required|in:in_progress,finished,partial',
            'assigned_to' => 'required|exists:users,id',
        ]);

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'due_date' => $request->due_date,
            'status' => $request->status,
            'assigned_to' => $request->assigned_to,
        ]);

        TaskAssignment::create([
            'task_id' => $task->id,
            'user_id' => $request->assigned_to,
        ]);

        return response()->json(['message' => 'Task created successfully', 'task' => $task]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'due_date' => 'required|date',
        ]);
    
        $task = Task::find($id);
    
        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        $userRole = $request->user()->role;
    
        if ($userRole === 'employer') {
            $task->update([
                'title' => $request->title,
                'description' => $request->description,
                'due_date' => $request->due_date,
            ]);
        }
        elseif ($userRole === 'employee') {
            $request->validate([
                'status' => 'required|in:in_progress,finished,partial',
            ]);
    
            $task->update([
                'status' => $request->status,
            ]);
        }
    
        return response()->json(['message' => 'Task updated successfully', 'task' => $task]);
    }

    public function destroy($id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function filterByDueDate(Request $request)
    {
        $dueDate = $request->input('due_date');
        $tasks = Task::where('due_date', $dueDate)->get();

        return response()->json(['tasks' => $tasks]);
    }

    public function filterByStatus(Request $request)
    {
        $status = $request->input('status');
        $tasks = Task::where('status', $status)->get();

        return response()->json(['tasks' => $tasks]);
    }

    public function getEmployees() {
        $employees = User::where('role', 'employee')->get(['id', 'name']);

        return response()->json($employees);
    }

    public function tasksAssignedToEmployee($employeeId)
    {
        $tasks = Task::where('assigned_to', $employeeId)->get();
        return response()->json($tasks);
    }
}
