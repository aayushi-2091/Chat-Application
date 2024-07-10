<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;


class LogoutController extends Controller
{
    public function logout(Request $request)
    {
        try {
            // Revoke all tokens for the authenticated user
            $request->user()->tokens()->delete();

            return response()->json(['message' => 'Successfully logged out'], 200);
        } catch (Exception $e) {
            // Handle the error, log it if necessary
            return response()->json(['message' => 'Failed to logout', 'error' => $e->getMessage()], 500);
        }
    }
}
