// Auth functions for DRM System
const API_URL = '/api/auth';

// Helper for showing toast notifications
function showToast(message, type = 'success') {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: type === 'success' ? "#000000" : "#ef4444",
            borderRadius: "1rem",
            fontSize: "0.875rem",
            fontWeight: "600",
            padding: "1rem 1.5rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
        },
        stopOnFocus: true
    }).showToast();
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('login-btn');
        const btnText = document.getElementById('btn-text');
        const loader = document.getElementById('loader');

    
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        loginBtn.disabled = true;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                showToast('Login successful! Redirecting...');
                setTimeout(() => window.location.href = 'dashboard.html', 1500);
            } else {
                showToast(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showToast('Network error, please try again', 'error');
        } finally {
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
            loginBtn.disabled = false;
        }
    });
}


const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        const registerBtn = document.getElementById('register-btn');
        const btnText = document.getElementById('btn-text');
        const loader = document.getElementById('loader');
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        registerBtn.disabled = true;

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                showToast('Registration successful! Redirecting...');
                setTimeout(() => window.location.href = 'dashboard.html', 1500);
            } else {
                showToast(data.message || 'Registration failed', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showToast('Network error, please try again', 'error');
        } finally {
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
            registerBtn.disabled = false;
        }
    });
}

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html') && !window.location.pathname.includes('index.html')) {
        window.location.href = 'login.html';
    }
    return token;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}
