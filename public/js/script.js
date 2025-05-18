const apiBase = 'http://localhost:8000';

function authHeader() {
    return { Authorization: 'Bearer ' + localStorage.getItem('token') };
}

function showAlert(message, type = 'danger', timeout = 5000) {
    const alertContainer = document.getElementById('alert-container');
    const alertId = 'alert-' + Date.now();
    const wrapper = document.createElement('div');

    wrapper.id = alertId;
    wrapper.className = `alert alert-${type} alert-dismissible fade show`;
    wrapper.role = 'alert';
    wrapper.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    alertContainer.appendChild(wrapper);

    setTimeout(() => {
        const alertElement = document.getElementById(alertId);

        if (alertElement) {
            alertElement.classList.remove('show');
            alertElement.classList.add('hide');
            setTimeout(() => alertElement.remove(), 300);
        }
    }, timeout);
}

// LOGIN
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value;

    try {
        const response = await fetch(`${apiBase}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: u, password: p })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const msg = errorData.message || `Login failed: ${response.status}`;
            throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
        }

        const { accessToken } = await response.json();

        localStorage.setItem('token', accessToken);
        document.getElementById('login-section').classList.add('d-none');
        document.getElementById('app-section').classList.remove('d-none');

        loadPositions();
        loadEmployees();
    } catch (error) {
        showAlert(error.message, 'danger');
    }
});

// LOGOUT (no reload)
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    document.getElementById('app-section').classList.add('d-none');
    document.getElementById('login-section').classList.remove('d-none');
    showAlert('Logged out successfully', 'success');
});

// LOAD POSITIONS
async function loadPositions() {
    try {
        const response = await fetch(`${apiBase}/positions`, { headers: authHeader() });

        if (!response.ok) {
            throw new Error('Failed to load positions');
        }

        const data = await response.json();
        const tbody = document.querySelector('#positions-table tbody');

        tbody.innerHTML = data
            .map(
                (position) =>
                    `<tr><td>${position.id}</td><td>${position.name}</td><td>${position.parent?.id || ''}</td></tr>`
            )
            .join('');
    } catch (err) {
        showAlert(err.message);
    }
}

// CREATE POSITION
document.getElementById('position-form').addEventListener('submit', async (element) => {
    element.preventDefault();
    const name = document.getElementById('posName').value.trim();
    const parentVal = document.getElementById('posParent').value;
    const parent_id = parentVal ? Number(parentVal) : undefined;

    try {
        const response = await fetch(`${apiBase}/positions`, {
            method: 'POST',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, parent_id })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const msg = errorData.message || `Failed to create position: ${response.status}`;
            throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
        }

        showAlert('Position created successfully', 'success');
        element.target.reset();
        loadPositions();
    } catch (error) {
        showAlert(error.message, 'danger');
    }
});

// LOAD EMPLOYEES
async function loadEmployees() {
    try {
        const response = await fetch(`${apiBase}/employees`, { headers: authHeader() });

        if (!response.ok) {
            throw new Error('Failed to load employees');
        }

        const data = await response.json();
        const tbody = document.querySelector('#employees-table tbody');

        tbody.innerHTML = data
            .map(
                (element) =>
                    `<tr><td>${element.id}</td><td>${element.full_name}</td><td>${element.position?.id || ''}</td><td>${element.email}</td></tr>`
            )
            .join('');
    } catch (err) {
        showAlert(err.message);
    }
}

// CREATE EMPLOYEE
document.getElementById('employee-form').addEventListener('submit', async (element) => {
    element.preventDefault();
    const body = {
        full_name: document.getElementById('empName').value.trim(),
        position_id: +document.getElementById('empPosId').value,
        email: document.getElementById('empEmail').value.trim(),
        phone: document.getElementById('empPhone').value.trim() || undefined,
        hired_date: new Date().toISOString().slice(0, 10)
    };

    try {
        const response = await fetch(`${apiBase}/employees`, {
            method: 'POST',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const msg = errorData.message || `Failed to create employee: ${response.status}`;
            throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
        }

        showAlert('Employee created successfully', 'success');
        element.target.reset();
        loadEmployees();
    } catch (error) {
        showAlert(error.message, 'danger');
    }
});

// FETCH SUBORDINATES
document.getElementById('sub-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = +document.getElementById('subPosId').value;

    try {
        const response = await fetch(`${apiBase}/positions/${id}/employees`, {
            headers: authHeader()
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const msg = errorData.message || `Failed to fetch employees: ${response.status}`;
            throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
        }

        const data = await response.json();
        const tbody = document.querySelector('#sub-table tbody');
        tbody.innerHTML = data
            .map(
                (element) =>
                    `<tr><td>${element.id}</td><td>${element.full_name}</td><td>${element.email}</td><td>${element.phone || ''}</td></tr>`
            )
            .join('');
    } catch (error) {
        showAlert(error.message, 'danger');
    }
});
