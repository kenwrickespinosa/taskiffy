<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

use App\Http\Requests\UpdateTaskRequest;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = Task::with(['admin', 'employee'])->get();
        return response()->json(['data' => $tasks]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Check if the user is authenticated and has the admin role
        // if (!Auth::check() || Auth::user()->role !== 'admin') {
        //     return response()->json(['message' => 'You are not authorized to perform this action'], 403);
        // }

        // Validate the request data
        $validator = Validator::make($request->all(), [
            'admin_id' => 'required|exists:users,id',
            'employee_id' => 'required|exists:users,id', // Expect a single employee_id
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'required|date',
            'status' => 'nullable|in:pending,done',
            'report' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            // Create the task
            $task = Task::create([
                'admin_id' => $request->admin_id,
                'employee_id' => $request->employee_id,
                'title' => $request->title,
                'description' => $request->description,
                'deadline' => $request->deadline,
                'status' => $request->status ?? 'pending',
                'report' => $request->report,
            ]);

            // Attach the single employee to the task
            // $task->employees()->attach($request->employee_id);
            return response()->json(['data' => $task, 'message' => 'Task created successfully'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create task: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Find the task by ID
        $task = Task::with(['admin', 'employee'])->find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        return response()->json(['data' => $task]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = Auth::user();

        // Find the task
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        // Admin can edit all fields
        if ($user->role === 'admin') {
            $validator = Validator::make($request->all(), [
                'admin_id' => 'nullable|exists:users,id',
                'employee_id' => 'nullable|exists:users,id',
                'title' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'deadline' => 'nullable|date',
                'status' => 'nullable|in:pending,done',
                'report' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 400);
            }

            $task->update($request->all());
        } elseif ($user->role === 'employee') {
            // Employee can only submit a report or file
            $validator = Validator::make($request->all(), [
                'report' => 'nullable|string',
                'file' => 'nullable|file|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 400);
            }

            if ($request->hasFile('file')) {
                $file = $request->file('file')->store('reports', 'public');
                $task->update(['report' => $file]);
            } elseif ($request->has('report')) {
                $task->update(['report' => $request->report]);
            }
        } else {
            return response()->json(['message' => 'You are not authorized to update the task'], 403);
        }

        return response()->json(['data' => $task, 'message' => 'Task updated successfully']);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'You are not authorized to perform this action'], 403);
        }

        // Find the task
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        // Delete the task
        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function getEmployeeTasks()
    {
        try {
            // Ensure the user is authenticated
            $user = Auth::user();

            if (!$user || $user->role !== 'employee') {
                return response()->json(['message' => 'Unauthorized access'], 403);
            }

            // Fetch tasks assigned to the authenticated employee
            $tasks = Task::where('employee_id', $user->id)
                ->orderBy('deadline', 'asc')
                ->get();

            return response()->json(['tasks' => $tasks]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occured while fetching tasks',
                'error' => $e->getMessage(),
            ], 500);
            return $e;
        }
    }

    // Handle submission of task
    public function submitTask(Request $request, $id)
    {
        try {
            $user = Auth::user();

            // Ensure the user is authorized
            if (!$user || $user->role !== 'employee') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Find the task
            $task = Task::find($id);
            if (!$task) {
                return response()->json(['message' => 'Task not found'], 404);
            }

            // Check if the deadline has passed
            if (now() > $task->deadline) {
                return response()->json(['message' => 'Deadline has passed'], 400);
            }

            // Validate the input
            $validator = Validator::make($request->all(), [
                'message' => 'nullable|string',
                'file' => 'nullable|file|max:2048',
            ]);
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 400);
            }

            // Handle file upload
            $filePath = null;
            if ($request->hasFile('file')) {
                $filePath = $request->file('file')->store('submissions', 'public');
            }

            // Save the submission
            $task->report = $request->input('message');
            $task->file_path = $filePath ?? null;
            $task->status = 'done'; // Update the status
            $task->save();

            return response()->json(['message' => 'Task submitted successfully']);
        } catch (\Exception $e) {
            return response()->json(
                ['message' => 'An error occurred. Please try again.', 'error' => $e], 
                500);
        }
    }

    // Get completed tasks set as done
    public function getCompletedTasks()
    {
        // Ensure the user is authenticated
        $user = Auth::user();

        if (!$user || $user->role !== 'employee') {
            return response()->json(['message' => 'Unauthorized access'], 403);
        }

        // Fetch completed tasks assigned to the authenticated employee
        $tasks = Task::where('employee_id', $user->id)
            ->where('status', 'done')
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json(['tasks' => $tasks]);
    }

    public function countEmployees()
    {
        $count = User::where('role', 'employee')->count();
        return response()->json(['count' => $count], 200);
    }

    public function getEmployeeTask($id)
    {
        // Ensure the user is authenticated
        try {

            // Fetch tasks assigned to the employee with the given ID
            $tasks = Task::where('employee_id', $id)->get();

            if ($tasks->isEmpty()) {
                return response()->json(['message' => 'No tasks found for this employee'], 404);
            }

            return response()->json(['tasks' => $tasks]);
        } catch (\Exception $e) {
            // Catch any errors and return a server error response
            return response()->json(['message' => 'Server error, please try again later'], 500);
        }
    }

    // In TaskController.php
    public function getTaskStatistics()
    {
        $totalTasks = Task::count(); // Get the total number of tasks
        $pendingTasks = Task::where('status', 'pending')->count(); // Get the number of pending tasks
        $doneTasks = Task::where('status', 'done')->count(); // Get the number of done tasks

        return response()->json([
            'total' => $totalTasks,
            'pending' => $pendingTasks,
            'done' => $doneTasks,
        ]);
    }
}
