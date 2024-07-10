<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
Broadcast::channel('user.{userId}', function ($user, $userId) {
    return $user->id === $userId;
  });

  Broadcast::channel('user.{userId}', function ($user, $userId) {
    if ($user->id === $userId) {
      return array('name' => $user->name);
    }
  });