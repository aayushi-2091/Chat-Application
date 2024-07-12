<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendOtpMail;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
      

        // Generate and send OTP
    $otp = rand(100000, 999999);
    $user->otp = $otp;
    $user->save();

    Mail::to($user->email)->send(new SendOtpMail($otp));

    return response()->json([
        'status' => 'success',
        'message' => 'OTP has been sent to your email',
    ], 200);
    }

    public function verifyOtp(Request $request)
{
    $validator = Validator::make($request->all(), [
        'email' => 'required|string|email',
        'otp' => 'required|integer',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 422);
    }

    $user = User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    if ($user->otp !== $request->otp) {
        return response()->json(['message' => 'Invalid  OTP'], 401);
    }

    // OTP is correct, authenticate the user
    $token = $user->createToken('auth_token')->plainTextToken;

    // Clear the OTP
    $user->otp = null;
    $user->save();

    $profile = Profile::create([
        'user_id' => $user->id,
        'gender' => null,
        'location' => null,
        'profile_photo' => null,
    ]);

    return response()->json([
        'status' => 'success',
        'access_token' => $token,
        'token_type' => 'Bearer',
    ]);
}
}
