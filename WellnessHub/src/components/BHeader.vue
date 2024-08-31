<template>
    <div class="container">
        <header class="d-flex justify-content-center py-3">
            <ul class="nav nav-pills">
                <li class="nav-item">
                    <router-link to="/" class="nav-link" active-class="active"
                        aria-current="page">Home</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/signup" class="nav-link" active-class="active">Sign Up</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/login" class="nav-link" active-class="active">Login</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/review" class="nav-link" active-class="active">Submit A Review</router-link>
                </li>
            </ul>
        </header>
    </div>
</template>