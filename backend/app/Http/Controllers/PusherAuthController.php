<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Pusher\Pusher;

class PusherAuthController extends Controller
{
    public function authenticate(Request $request)
    {
        $user = Auth::user();

        $pusher = new Pusher(
            env('PUSHER_APP_KEY'),
            env('PUSHER_APP_SECRET'),
            env('PUSHER_APP_ID'),
            [
                'cluster' => env('PUSHER_APP_CLUSTER'),
                'useTLS' => true,
            ]
        );

        $channelName = $request->input('channel_name');
        $socketId = $request->input('socket_id');

        if ($user) {
            $presence_data = ['name' => $user->name];
            $key = $pusher->presence_auth($channelName, $socketId, $user->id, $presence_data);
            return response($key);
        } else {
            return response('Forbidden', 403);
        }
    }
}
