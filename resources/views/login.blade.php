<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - CampRent</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="flex h-screen bg-white">

    <!-- Left Side -->
    <div class="hidden lg:flex lg:flex-col lg:w-1/2 bg-[#2d5b45] p-12 text-white justify-between">
        <!-- Logo -->
        <div class="text-2xl font-bold tracking-tight">
            Camp<span class="text-[#f97316]">Rent</span>
        </div>
        
        <!-- Text content -->
        <div class="max-w-lg mb-20 mt-10">
            <h1 class="text-5xl font-bold leading-tight mb-6">
                Sewa alat camping<br>tanpa ribet.
            </h1>
            <p class="text-gray-300 text-lg pr-12">
                Cek stok, booking, dan pantau status sewa dalam satu sistem.
            </p>
        </div>
        
        <!-- Footer -->
        <div class="text-gray-400 text-sm mt-auto">
            &copy; 2026 CampRent &middot; Universitas Primakara
        </div>
    </div>

    <!-- Right Side -->
    <div class="flex-1 flex flex-col justify-center items-center p-8 bg-gray-50 lg:bg-white">
        <div class="w-full max-w-md bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 p-8">
            
            <!-- Tabs -->
            <div class="flex bg-[#f8f9fa] p-1.5 rounded-lg mb-8">
                <a href="#" class="flex-1 text-center py-2 bg-white rounded-md shadow-sm text-sm font-semibold text-gray-800">
                    Masuk
                </a>
                <a href="#" class="flex-1 text-center py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                    Daftar
                </a>
            </div>

            <!-- Form -->
            <form action="#" method="POST">
                @csrf
                
                <!-- Role Selection -->
                <div class="mb-6">
                    <label class="block text-xs font-medium text-gray-500 mb-2">Masuk sebagai</label>
                    <div class="flex gap-3">
                        <label class="flex-1 cursor-pointer">
                            <input type="radio" name="role" value="customer" class="peer sr-only" checked>
                            <div class="text-center py-2 px-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 transition-all peer-checked:bg-[#eaf4eb] peer-checked:border-[#387e45] peer-checked:text-[#387e45] hover:bg-gray-50">
                                Customer
                            </div>
                        </label>
                        <label class="flex-1 cursor-pointer">
                            <input type="radio" name="role" value="admin" class="peer sr-only">
                            <div class="text-center py-2 px-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 transition-all peer-checked:bg-[#eaf4eb] peer-checked:border-[#387e45] peer-checked:text-[#387e45] hover:bg-gray-50">
                                Admin
                            </div>
                        </label>
                        <label class="flex-1 cursor-pointer">
                            <input type="radio" name="role" value="staff" class="peer sr-only">
                            <div class="text-center py-2 px-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 transition-all peer-checked:bg-[#eaf4eb] peer-checked:border-[#387e45] peer-checked:text-[#387e45] hover:bg-gray-50">
                                Staff
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Email -->
                <div class="mb-5">
                    <label class="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
                    <input type="email" placeholder="nama@email.com" class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#387e45] focus:ring-1 focus:ring-[#387e45] text-sm transition-colors" required>
                </div>

                <!-- Password -->
                <div class="mb-8">
                    <label class="block text-xs font-medium text-gray-500 mb-1.5">Password</label>
                    <input type="password" placeholder="••••••••" class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#387e45] focus:ring-1 focus:ring-[#387e45] text-sm transition-colors" required>
                </div>

                <!-- Submit Button -->
                <button type="submit" class="w-full bg-[#35734a] hover:bg-[#2d5b45] text-white font-medium py-3 rounded-lg text-sm transition-colors">
                    Masuk
                </button>
            </form>
            
        </div>
    </div>
</body>
</html>
