<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Task;

class UpdateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Get the task by ID from the route
        $task = Task::find($this->route('task'));

        // Check if the user is an admin or the task owner (admin or employee)
        // return $task && (auth()->user()->role === 'admin' || auth()->user()->id === $task->admin_id || auth()->user()->id === $task->employee_id);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'admin_id' => 'nullable|exists:users,id|role:admin',
            'employee_id' => 'nullable|exists:users,id|role:employee',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
            'status' => 'nullable|in:pending,done',
            'report' => 'nullable|string',
        ];
    }
}
