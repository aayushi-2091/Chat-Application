<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\MessageController;
use App\Events\MessageSent;
use App\Models\Message;
use App\Http\Controllers\PusherAuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ChatSettingController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('register', [RegisterController::class, 'register']);
Route::post('login', [LoginController::class, 'login']);
Route::post('logout', [LogoutController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('users', [MessageController::class, 'users']);
    Route::get('messages/{user}', [MessageController::class, 'index']);
    Route::post('messages', [MessageController::class, 'store']);
    Route::get('chats', [ChatController::class, 'index']);

});

// Route::get('/login', function() {
//     return response()->json(['message' => 'Login route - use frontend for login'], 200);
// })->name('login');

// Route::get('broadcast-test', function () {
//     $message = Message::create([
//         'from_user_id' => 1,
//         'to_user_id' => 2,
//         'message' => 'Hello, this is a test message!',
//     ]);

//     broadcast(new MessageSent($message))->toOthers();

//     return 'Event has been broadcasted!';
// });

Route::middleware('auth:sanctum')->post('/pusher/auth', [PusherAuthController::class, 'authenticate']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('chat-settings/{receiverId}/background-color', [ChatSettingController::class, 'getBackgroundColor']);
    Route::post('chat-settings/{receiverId}/background-color', [ChatSettingController::class, 'updateBackgroundColor']);
});

