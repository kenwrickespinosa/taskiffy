<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function signup(Request $request) {
        $fields = $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed',
            'role' => 'nullable|in:admin,employee',
        ]);

        $fields['role'] = $fields['role'] ?? 'employee';

        // Hash the password before saving it to the database
        $fields['password'] = Hash::make($fields['password']);
        //$fields['password'] = bcrypt($fields['password']);

        $user = User::create($fields);

        $token = $user->createToken($request->name);

        return response()->json([
            'user' => $user,
            'token' => $token->plainTextToken
        ], 201);
    }

    public function login(Request $request) {
        $fields = $request->validate([
            'email' => 'required|email|exists:users',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if(!$user || !Hash::check($request->password, $user->password)) {
            return [
                'errors' => [
                    'email' => ['Invalid credentials']
                ]
            ];
        }

        $token = $user->createToken($user->name);
        // return response()->json([
        //     'user' => $user,
        //     'token' => $token,
        // ], 200);
        return [
            'user' => $user,
            'token' => $token->plainTextToken,
        ];
    }

    public function logout(Request $request) {
        $request->user()->tokens()->delete();
        return [
            'message' => 'You are logged out',
        ];
    }

    public function getEmployees() {
        $employees = User::where('role', 'employee')->get();
        return response()->json(['data' => $employees]);
    }
}
