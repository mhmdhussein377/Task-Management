<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'due_date', 'status', 'assigned_to'];

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
