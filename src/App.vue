<template>
  <nav class="d-flex gap-3 p-3">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    <RouterLink to="/users">Users</RouterLink>
    <RouterLink to="/users/1">User 1</RouterLink>
    <RouterLink to="/users/1/edit">Edit user 1</RouterLink>
    <RouterLink to="/login">Login</RouterLink>
    <RouterLink to="/something-wrong">Broken link</RouterLink>
  </nav>

  <RouterView />
</template>
