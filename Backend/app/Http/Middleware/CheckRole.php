<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->role === "employer") {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }
}
