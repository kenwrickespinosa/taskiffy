<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskSubmitted extends Notification
{
    use Queueable;
    public $task;
    public $submitted_by;

    /**
     * Create a new notification instance.
     */
    public function __construct($task, $submitted_by)
    {
        $this->task = $task;
        $this->submitted_by = $submitted_by;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toDatabase($notifiable)
    {
        return [
            'message' => "Task '{$this->task->title}' was submitted by {$this->submitted_by}",
            'task_title' => $this->task->title,
            'submitted_by' => $this->submitted_by,
            'submitted_at' => now(),
            'is_late' => $this->task->due_date < now() // Example of lateness check
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
