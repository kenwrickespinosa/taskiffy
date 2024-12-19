<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_id',
        'employee_id',
        'title',
        'description',
        'deadline',
        'status',
        'report',
        'file_path',  // added file path
    ];

    /**
     * Get the admin that created the task
     */
    public function admin() {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /**
     * Get the employee that receives the task
     */
    public function employee() {
        return $this->belongsTo(User::class, 'employee_id');
    }
}
