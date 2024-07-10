<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    // Get list of users for the authenticated user to chat with
    public function users()
    {
        $users = User::where('id', '!=', Auth::id())->get();
        return response()->json($users);
    }

    // Get messages between authenticated user and selected user
    public function index($userId)
{
    $messages = Message::where(function ($query) use ($userId) {
        $query->where('from_user_id', Auth::id())->where('to_user_id', $userId);
    })->orWhere(function ($query) use ($userId) {
        $query->where('from_user_id', $userId)->where('to_user_id', Auth::id());
    })->get();

    return response()->json($messages);
}

    // Send a message from authenticated user to another user
    public function store(Request $request)
    {
        try {
            // Initialize variables
            $mediaUrl = null;
            $messageContent = $request->message;
            $messageType = $request->type;

            // Check if there is a file and handle file upload
            if ($request->hasFile('media')) {
                $file = $request->file('media');
                $path = $file->store('uploads', 'public');
                $mediaUrl = Storage::url($path);
                $messageType = $file->getMimeType();
            }

            // Create the message based on type
            $messageData = [
                'from_user_id' => Auth::id(),
                'to_user_id' => $request->receiver_id,
                'type' => $messageType,
                'message' => $messageContent,
                'media_url' => $mediaUrl,
            ];

            $message = Message::create($messageData);

            broadcast(new MessageSent($message))->toOthers();

            return response()->json($message, 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Internal Server Error',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }
}
