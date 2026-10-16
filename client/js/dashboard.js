// Dashboard logic for DRM System
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
    
    // Update UI based on user
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('welcome-name').textContent = user.name;
    document.getElementById('user-role').textContent = user.role;
    document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();

    if (user.role === 'Admin') {
        document.getElementById('admin-nav').classList.remove('hidden');
        document.getElementById('stats-container').classList.remove('hidden');
        loadStats();
    }

    // Default load
    loadRecentBookings();
    loadResources();
});

// Tab Switching
function switchTab(tabName) {
    // Hide all contents
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    // Show selected content
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    
    // Update nav styles
    document.querySelectorAll('nav a').forEach(nav => nav.classList.remove('sidebar-item-active'));
    document.getElementById(`nav-${tabName}`).classList.add('sidebar-item-active');

    // Load data based on tab
    if (tabName === 'dashboard') loadRecentBookings();
    if (tabName === 'resources') loadResources();
    if (tabName === 'bookings') loadAllMyBookings();
    if (tabName === 'manage-resources') loadAdminResources();
    if (tabName === 'all-bookings') loadAdminAllBookings();
}

// Data Fetching
async function loadStats() {
    try {
        const res = await fetch('/api/bookings/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        document.getElementById('stat-total-bookings').textContent = data.totalBookings;
        document.getElementById('stat-pending-requests').textContent = data.pendingRequests;
        document.getElementById('stat-total-resources').textContent = data.totalResources;
        document.getElementById('stat-total-users').textContent = data.totalUsers;
    } catch (err) { console.error(err); }
}

async function loadRecentBookings() {
    try {
        const res = await fetch('/api/bookings', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const bookings = await res.json();
        const list = document.getElementById('my-recent-bookings-list');
        list.innerHTML = '';
        
        bookings.slice(0, 5).forEach(b => {
            const statusColor = b.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-100' : 
                               b.status === 'Pending' ? 'bg-gray-50 text-gray-500 border-gray-100' : 'bg-red-50 text-red-700 border-red-100';
            list.innerHTML += `
                <tr class="hover:bg-gray-50/50 transition-colors">
                    <td class="px-8 py-5 font-bold text-gray-900">${b.resource_name}</td>
                    <td class="px-8 py-5 text-gray-500 text-sm">${new Date(b.date).toLocaleDateString()}</td>
                    <td class="px-8 py-5 text-gray-500 text-sm">${b.start_time} - ${b.end_time}</td>
                    <td class="px-8 py-5">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor}">
                            ${b.status}
                        </span>
                    </td>
                </tr>
            `;
        });
    } catch (err) { console.error(err); }
}

async function loadResources() {
    const type = document.getElementById('filter-type').value;
    const url = type === 'all' ? '/api/resources' : `/api/resources?type=${type}`;
    
    try {
        const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const resources = await res.json();
        const grid = document.getElementById('resources-grid');
        grid.innerHTML = '';

        resources.forEach(r => {
            const isBooked = r.is_currently_booked > 0;
            const statusBadge = isBooked 
                ? '<span class="px-3 py-1 bg-red-50 text-red-700 text-[10px] font-bold rounded-full border border-red-100 uppercase tracking-widest">BOOKED</span>' 
                : '<span class="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full border border-green-100 uppercase tracking-widest">AVAILABLE</span>';
            
            grid.innerHTML += `
                <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex flex-col h-full relative overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-500 group">
                    <div class="absolute top-6 right-6 z-10">${statusBadge}</div>
                    <div class="flex justify-between items-start mb-6">
                        <span class="px-4 py-1.5 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-full border border-gray-100 uppercase tracking-[0.2em] group-hover:bg-black group-hover:text-white group-hover:border-black transition-colors">${r.type}</span>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-3 tracking-tight">${r.name}</h3>
                    <p class="text-gray-500 text-sm mb-6 flex-1 leading-relaxed">${r.description || 'No description available.'}</p>
                    
                    <div class="flex flex-col gap-3 mb-8">
                        <div class="flex items-center text-gray-400 text-xs font-medium">
                            <i class="fas fa-location-dot w-5"></i> ${r.location}
                        </div>
                        <div class="flex items-center text-gray-400 text-xs font-medium">
                            <i class="fas fa-users w-5"></i> Capacity: ${r.capacity || 'N/A'}
                        </div>
                    </div>
                    
                    <button onclick="openBookingModal(${r.id}, '${r.name}')" class="w-full py-4 bg-black text-white text-sm font-bold rounded-2xl hover:bg-gray-800 transition shadow-lg shadow-black/10 flex items-center justify-center gap-2">
                        Book Resource <i class="fas fa-arrow-right text-[10px]"></i>
                    </button>
                </div>
            `;
        });
    } catch (err) { console.error(err); }
}

// Booking Modal Logic
function openBookingModal(id, name) {
    document.getElementById('booking-resource-id').value = id;
    document.getElementById('booking-resource-name').value = name;
    document.getElementById('booking-modal').classList.remove('hidden');
}

function closeBookingModal() {
    document.getElementById('booking-modal').classList.add('hidden');
}

document.getElementById('booking-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const bookingData = {
        resource_id: document.getElementById('booking-resource-id').value,
        date: document.getElementById('booking-date').value,
        start_time: document.getElementById('booking-start').value,
        end_time: document.getElementById('booking-end').value
    };

    try {
        const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bookingData)
        });
        const data = await res.json();
        if (res.ok) {
            showToast('Booking request submitted successfully!');
            closeBookingModal();
            loadRecentBookings();
        } else {
            showToast(data.message || 'Booking failed', 'error');
        }
    } catch (err) { showToast('Error submitting booking', 'error'); }
});

// Admin Resource Management
async function loadAdminResources() {
    try {
        const res = await fetch('/api/resources', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const resources = await res.json();
        const list = document.getElementById('admin-resources-list');
        list.innerHTML = '';
        
        resources.forEach(r => {
            list.innerHTML += `
                <tr class="hover:bg-gray-50/50 transition-colors">
                    <td class="px-8 py-5 font-bold text-gray-900">${r.name}</td>
                    <td class="px-8 py-5 text-gray-500 text-sm capitalize">${r.type}</td>
                    <td class="px-8 py-5 text-gray-500 text-sm">${r.location}</td>
                    <td class="px-8 py-5 text-gray-500 text-sm font-bold">${r.capacity || '-'}</td>
                    <td class="px-8 py-5 flex gap-4">
                        <button onclick="editResource(${JSON.stringify(r).replace(/"/g, '&quot;')})" class="text-black hover:scale-110 transition"><i class="fas fa-edit"></i></button>
                        <button onclick="deleteResource(${r.id})" class="text-red-500 hover:scale-110 transition"><i class="fas fa-trash-can"></i></button>
                    </td>
                </tr>
            `;
        });
    } catch (err) { console.error(err); }
}

function openResourceModal(data = null) {
    const modal = document.getElementById('resource-modal');
    const title = document.getElementById('resource-modal-title');
    const form = document.getElementById('resource-form');
    
    if (data) {
        title.textContent = 'Edit Resource';
        document.getElementById('resource-id').value = data.id;
        document.getElementById('res-name').value = data.name;
        document.getElementById('res-type').value = data.type;
        document.getElementById('res-capacity').value = data.capacity;
        document.getElementById('res-location').value = data.location;
        document.getElementById('res-description').value = data.description;
    } else {
        title.textContent = 'Add Resource';
        form.reset();
        document.getElementById('resource-id').value = '';
    }
    modal.classList.remove('hidden');
}

function closeResourceModal() {
    document.getElementById('resource-modal').classList.add('hidden');
}

document.getElementById('resource-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('resource-id').value;
    const resourceData = {
        name: document.getElementById('res-name').value,
        type: document.getElementById('res-type').value,
        capacity: document.getElementById('res-capacity').value,
        location: document.getElementById('res-location').value,
        description: document.getElementById('res-description').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/resources/${id}` : '/api/resources';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(resourceData)
        });
        if (res.ok) {
            showToast(`Resource ${id ? 'updated' : 'added'} successfully!`);
            closeResourceModal();
            loadAdminResources();
            if (user.role === 'Admin') loadStats();
        } else {
            showToast('Failed to save resource', 'error');
        }
    } catch (err) { showToast('Error saving resource', 'error'); }
});

async function deleteResource(id) {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
        const res = await fetch(`/api/resources/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            showToast('Resource deleted successfully!');
            loadAdminResources();
            if (user.role === 'Admin') loadStats();
        }
    } catch (err) { showToast('Error deleting resource', 'error'); }
}

// Admin Booking Approval
async function loadAdminAllBookings() {
    try {
        const res = await fetch('/api/bookings', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const bookings = await res.json();
        const list = document.getElementById('admin-all-bookings-list');
        list.innerHTML = '';
        
        bookings.forEach(b => {
            const statusColor = b.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-100' : 
                               b.status === 'Pending' ? 'bg-gray-50 text-gray-500 border-gray-100' : 'bg-red-50 text-red-700 border-red-100';
            const actions = b.status === 'Pending' ? `
                <div class="flex gap-2">
                    <button onclick="updateBookingStatus(${b.id}, 'Approved')" class="px-4 py-1.5 bg-black text-white text-[10px] font-bold rounded-full hover:bg-gray-800 transition uppercase tracking-wider">Approve</button>
                    <button onclick="updateBookingStatus(${b.id}, 'Rejected')" class="px-4 py-1.5 bg-white text-red-500 border border-red-100 text-[10px] font-bold rounded-full hover:bg-red-50 transition uppercase tracking-wider">Reject</button>
                </div>
            ` : '<span class="text-gray-300 text-xs font-medium">Processed</span>';

            list.innerHTML += `
                <tr class="hover:bg-gray-50/50 transition-colors">
                    <td class="px-8 py-5 font-bold text-gray-900">${b.user_name}</td>
                    <td class="px-8 py-5 text-gray-500 text-sm">${b.resource_name}</td>
                    <td class="px-8 py-5 text-gray-500 text-sm">
                        <div class="font-medium">${new Date(b.date).toLocaleDateString()}</div>
                        <div class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">${b.start_time} - ${b.end_time}</div>
                    </td>
                    <td class="px-8 py-5">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor}">
                            ${b.status}
                        </span>
                    </td>
                    <td class="px-8 py-5">${actions}</td>
                </tr>
            `;
        });
    } catch (err) { console.error(err); }
}

async function updateBookingStatus(id, status) {
    try {
        const res = await fetch(`/api/bookings/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        if (res.ok) {
            showToast(`Booking ${status.toLowerCase()} successfully!`);
            loadAdminAllBookings();
            loadStats();
        }
    } catch (err) { showToast('Error updating booking status', 'error'); }
}

// Helper for editing resource
window.editResource = (data) => openResourceModal(data);

// Filter change event
document.getElementById('filter-type').addEventListener('change', loadResources);

// Load all my bookings
async function loadAllMyBookings() {
    try {
        const res = await fetch('/api/bookings', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const bookings = await res.json();
        const list = document.getElementById('my-all-bookings-list');
        list.innerHTML = '';
        
        bookings.forEach(b => {
            const statusColor = b.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-100' : 
                               b.status === 'Pending' ? 'bg-gray-50 text-gray-500 border-gray-100' : 'bg-red-50 text-red-700 border-red-100';
            list.innerHTML += `
                <tr class="hover:bg-gray-50/50 transition-colors">
                    <td class="px-8 py-5 font-bold text-gray-900">#${b.id}</td>
                    <td class="px-8 py-5 text-gray-900 font-medium text-sm">${b.resource_name}</td>
                    <td class="px-8 py-5 text-gray-500 text-sm">${new Date(b.date).toLocaleDateString()}</td>
                    <td class="px-8 py-5 text-gray-500 text-sm font-bold uppercase tracking-tighter text-[10px]">${b.start_time} - ${b.end_time}</td>
                    <td class="px-8 py-5">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor}">
                            ${b.status}
                        </span>
                    </td>
                    <td class="px-8 py-5 text-gray-400 text-[10px] font-bold uppercase tracking-widest">${new Date(b.created_at).toLocaleDateString()}</td>
                </tr>
            `;
        });
    } catch (err) { console.error(err); }
}
