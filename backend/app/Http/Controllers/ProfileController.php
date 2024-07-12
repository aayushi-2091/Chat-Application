<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        $profile = $user->profile;
        return response()->json(compact('user', 'profile'));
    }

    public function update(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'name' => 'required|string',
            'profile_photo' => 'nullable|image|max:2048',
            'gender' => 'nullable|string',
            'location' => 'nullable|string',
        ]);

        $user = Auth::user();
        $user->update([
            'email' => $request->email,
            'name' => $request->name,
        ]);

        $profileData = $request->only('gender', 'location');
        if ($request->hasFile('profile_photo')) {
            $profileData['profile_photo'] = $request->file('profile_photo')->store('profile_photos', 'public');
        }

        $user->profile()->updateOrCreate(['user_id' => $user->id], $profileData);

        return response()->json(['success' => true]);
    }
    public function getUserProfile($id)
    {
        $user = User::find($id);
        $profile = $user->profile;
        $profilePhotoUrl = $profile ? asset('storage/' . $profile->profile_photo) : null;
        return response()->json(compact('user', 'profile', 'profilePhotoUrl'));
    }
}
