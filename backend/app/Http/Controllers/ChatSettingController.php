<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ChatSetting;
use App\Events\BackgroundColorChanged;

class ChatSettingController extends Controller
{
    public function getBackgroundColor($receiverId)
{
    $senderId = auth()->id();

    // Check both possible combinations of sender/receiver IDs
    $chatSetting = ChatSetting::where(function ($query) use ($senderId, $receiverId) {
                                $query->where('sender_id', $senderId)
                                      ->where('receiver_id', $receiverId);
                            })
                            ->first();

    return response()->json([
        'background_color' => $chatSetting ? $chatSetting->background_color : '#ffffff'
    ]);
}
    public function updateBackgroundColor(Request $request, $receiverId)
    {
        $request->validate([
            'background_color' => 'required|string',
        ]);

        $senderId = auth()->id();
        $chatSetting = ChatSetting::updateOrCreate(
            ['sender_id' => $senderId, 'receiver_id' => $receiverId],
            ['background_color' => $request->background_color]
        );

        return response()->json(['success' => true]);
    }
}
