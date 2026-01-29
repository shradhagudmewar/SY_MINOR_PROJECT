// Backend API URL
// When opening via http://localhost:5000 (backend serves the frontend),
// this relative URL will correctly point to the same server.
const API_URL = '/api';

let currentUserRole = 'student';

// Show message
function showMessage(message, type = 'success') {
  const existing = document.querySelector('.custom-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'custom-toast';
  toast.style.cssText = `
    position: fixed; top: 90px; right: 20px; padding: 1rem 1.5rem;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    z-index: 999999; font-size: 0.95rem; font-weight: 500; animation: slideIn 0.3s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

if (!document.getElementById('toast-animations')) {
  const style = document.createElement('style');
  style.id = 'toast-animations';
  style.textContent = `
    @keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }
  `;
  document.head.appendChild(style);
}

// Check auth
function checkAuth() {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('alumniConnectUser');
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      updateNavForLoggedInUser(user);
      return true;
    } catch (e) {
      localStorage.removeItem('token');
      localStorage.removeItem('alumniConnectUser');
    }
  }
  return false;
}

function updateNavForLoggedInUser(user) {
  const navActions = document.querySelector('.nav-actions');
  if (navActions) {
    navActions.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.55rem 1.1rem; background: #eff6ff; border-radius: 999px;">
        <span style="font-size: 0.88rem; font-weight: 500; color: #1f2937;">${user.fullName}</span>
        <span style="font-size: 0.75rem; color: #6b7280;">(${user.role})</span>
      </div>
      <button class="btn btn-ghost" onclick="handleLogout()">Logout</button>
    `;
  }
}

function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('token');
    localStorage.removeItem('alumniConnectUser');
    showMessage('Logged out successfully!');
    setTimeout(() => location.reload(), 1200);
  }
}

// Auth modal
function setupAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (!modal) return;

  const backdrop = modal.querySelector(".auth-backdrop");
  const closeBtn = modal.querySelector(".auth-close");
  const tabs = modal.querySelectorAll("[data-auth-tab]");
  const authButtons = document.querySelectorAll(".auth-btn");
  const roleButtons = modal.querySelectorAll(".auth-role");
  const switchSignInBtn = modal.querySelector(".auth-switch-signin");

  function openModal(mode) {
    modal.classList.add("auth-open");
    switchMode(mode);
  }

  function closeModal() {
    modal.classList.remove("auth-open");
  }

  function switchMode(mode) {
    tabs.forEach((tab) => {
      tab.classList.toggle("auth-tab-active", tab.dataset.authTab === mode);
    });
    
    const signinPanel = modal.querySelector('[data-auth-panel="signin"]');
    const signupPanel = modal.querySelector('[data-auth-panel="signup"]');
    
    if (mode === 'signin') {
      if (signinPanel) signinPanel.classList.remove('hidden');
      if (signupPanel) signupPanel.classList.add('hidden');
    } else {
      if (signinPanel) signinPanel.classList.add('hidden');
      if (signupPanel) signupPanel.classList.remove('hidden');
    }
  }

  authButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(btn.dataset.auth || "signin");
    });
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      switchMode(tab.dataset.authTab);
    });
  });

  roleButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      roleButtons.forEach((b) => b.classList.remove("auth-role-active"));
      btn.classList.add("auth-role-active");
      currentUserRole = btn.dataset.role || "student";

      const yearLabel = modal.querySelector("#yearLabel");
      const studentYearSelect = modal.querySelector("#studentYearSelect");
      const alumniYearSelect = modal.querySelector("#alumniYearSelect");

      if (yearLabel && studentYearSelect && alumniYearSelect) {
        if (currentUserRole === "alumni") {
          yearLabel.childNodes[0].nodeValue = "Graduation Year ";
          studentYearSelect.style.display = "none";
          alumniYearSelect.style.display = "block";
        } else {
          yearLabel.childNodes[0].nodeValue = "Year ";
          studentYearSelect.style.display = "block";
          alumniYearSelect.style.display = "none";
        }
      }
    });
  });

  if (switchSignInBtn) {
    switchSignInBtn.addEventListener("click", (e) => {
      e.preventDefault();
      switchMode("signin");
    });
  }

  if (backdrop) backdrop.addEventListener("click", closeModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  const signinPanel = modal.querySelector('[data-auth-panel="signin"]');
  if (signinPanel) {
    const signinButton = signinPanel.querySelector('button.btn-primary');
    if (signinButton) {
      signinButton.addEventListener('click', (e) => {
        e.preventDefault();
        handleSignIn(signinPanel);
      });
    }
  }

  const signupPanel = modal.querySelector('[data-auth-panel="signup"]');
  if (signupPanel) {
    const signupButton = signupPanel.querySelector('button.btn-primary');
    if (signupButton) {
      signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        handleSignUp(signupPanel, closeModal);
      });
    }
  }
}

// Sign In
async function handleSignIn(panel) {
  const inputs = panel.querySelectorAll('input');
  const email = inputs[0]?.value.trim();
  const password = inputs[1]?.value;

  if (!email || !password) {
    showMessage('Please fill in all fields', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('alumniConnectUser', JSON.stringify(data.data.user));
      showMessage(`Welcome back, ${data.data.user.fullName}!`);
      setTimeout(() => location.reload(), 1500);
    } else {
      showMessage(data.message || 'Invalid credentials', 'error');
    }
  } catch (error) {
    showMessage('Network error. Check if backend is running.', 'error');
  }
}

// Sign Up
async function handleSignUp(panel, closeModal) {
  const inputs = panel.querySelectorAll('input');
  const selects = panel.querySelectorAll('select');
  
  const fullName = inputs[0]?.value.trim();
  const email = inputs[1]?.value.trim();
  const phone = inputs[2]?.value.trim();
  const department = selects[0]?.value;
  const password = inputs[3]?.value;
  const confirmPassword = inputs[4]?.value;

  let year = '';
  if (currentUserRole === 'student') {
    year = document.getElementById('studentYearSelect')?.value || '';
  } else if (currentUserRole === 'alumni') {
    year = document.getElementById('alumniYearSelect')?.value || '';
  }

  if (!fullName || !email || !phone || !department || !password) {
    showMessage('Please fill all fields', 'error');
    return;
  }

  if (password.length < 6) {
    showMessage('Password must be at least 6 characters', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showMessage('Passwords do not match', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName,
        email,
        password,
        phone,
        department,
        year: year || 'Not specified',
        role: currentUserRole,
        graduationYear: currentUserRole === 'alumni' ? year : undefined
      })
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('alumniConnectUser', JSON.stringify(data.data.user));
      showMessage(`Welcome, ${fullName}!`);
      setTimeout(() => {
        closeModal();
        location.reload();
      }, 1500);
    } else {
      showMessage(data.message || 'Registration failed', 'error');
    }
  } catch (error) {
    showMessage('Network error. Check if backend is running.', 'error');
  }
}

// Fetch mentors
async function fetchMentorsFromBackend(filters = {}) {
  try {
    let url = `${API_URL}/users?role=alumni`;
    
    if (filters.department) url += `&department=${encodeURIComponent(filters.department)}`;
    if (filters.batch) url += `&batch=${filters.batch}`;
    if (filters.company) url += `&company=${encodeURIComponent(filters.company)}`;

    const response = await fetch(url);
    const data = await response.json();

    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return [];
  }
}

function initials(fullName) {
  return fullName.split(" ").map((n) => n[0]).join("").toUpperCase();
}

function renderMentors(list) {
  const container = document.getElementById("mentor-list");
  const noResults = document.getElementById("no-results");

  if (!container) return;

  container.innerHTML = "";

  if (!list.length) {
    if (noResults) noResults.classList.remove("hidden");
    return;
  }

  if (noResults) noResults.classList.add("hidden");

  list.forEach((mentor) => {
    const card = document.createElement("article");
    card.className = "mentor-card";

    const tags = mentor.skills || ['MITAOE Alumni'];
    const company = mentor.currentCompany || 'Not specified';
    const designation = mentor.designation || '';
    const location = mentor.location || 'India';
    const graduationYear = mentor.graduationYear || mentor.year || 'N/A';
    const bio = mentor.bio || `${designation} at ${company}`;

    card.innerHTML = `
      <div class="mentor-header">
        <div class="mentor-avatar">${initials(mentor.fullName)}</div>
        <div>
          <div class="mentor-name">${mentor.fullName}</div>
          <div class="mentor-meta">${mentor.department} • Batch ${graduationYear}</div>
          <div class="mentor-meta">${company} • ${location}</div>
        </div>
      </div>
      <p class="mentor-tagline">${bio}</p>
      <div class="mentor-tags">
        ${tags.slice(0, 3).map((t) => `<span class="tag">${t}</span>`).join("")}
      </div>
      <div class="mentor-footer">
        <span>Available for mentorship</span>
        <span class="mentor-link">Connect</span>
      </div>
    `;

    container.appendChild(card);
  });
}

async function applyFilters() {
  const filters = {
    department: document.getElementById("interest")?.value || '',
    batch: document.getElementById("batch")?.value || '',
    company: document.getElementById("company")?.value.trim() || ''
  };

  const mentors = await fetchMentorsFromBackend(filters);
  renderMentors(mentors);
}

// Contact form handler (Contact page)
async function setupContactForm() {
  const contactForm = document.getElementById('contact-main-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = contactForm.querySelector('input[type="text"]')?.value.trim();
    const email = contactForm.querySelector('input[type="email"]')?.value.trim();
    const phone = contactForm.querySelector('input[type="tel"]')?.value.trim();
    const department = document.getElementById('contact-department')?.value || '';
    const status = document.getElementById('contact-status')?.value || '';
    const message = document.getElementById('contact-message')?.value.trim();

    if (!name || !email || !message) {
      showMessage('Please fill in name, email and message', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          department,
          status,
          message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        showMessage('Message sent successfully!');
        contactForm.reset();
      } else {
        showMessage(data.message || 'Could not send message', 'error');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      showMessage('Network error while sending message', 'error');
    }
  });
}

// Simple admin dashboard loader
async function loadAdminDashboard() {
  const usersBody = document.getElementById('admin-users-body');
  const messagesBody = document.getElementById('admin-messages-body');

  if (!usersBody && !messagesBody) return; // not on admin page

  try {
    // Load users
    if (usersBody) {
      const resUsers = await fetch(`${API_URL}/users`);
      const dataUsers = await resUsers.json();
      const users = dataUsers.success ? dataUsers.data : [];

      usersBody.innerHTML = '';
      users.forEach((u) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${u.fullName}</td>
          <td>${u.email}</td>
          <td>${u.role}</td>
          <td>${u.department || ''}</td>
          <td>${u.graduationYear || u.year || ''}</td>
          <td>${u.currentCompany || ''}</td>
        `;
        usersBody.appendChild(tr);
      });
    }

    // Load messages
    if (messagesBody) {
      const resMsgs = await fetch(`${API_URL}/messages`);
      const dataMsgs = await resMsgs.json();
      const msgs = dataMsgs.success ? dataMsgs.data : [];

      messagesBody.innerHTML = '';
      msgs.forEach((m) => {
        const tr = document.createElement('tr');
        const created = m.createdAt
          ? new Date(m.createdAt).toLocaleString()
          : '';
        tr.innerHTML = `
          <td>${m.name}</td>
          <td>${m.email}</td>
          <td>${m.phone || ''}</td>
          <td>${m.department || ''}</td>
          <td>${m.status || ''}</td>
          <td>${m.message}</td>
          <td>${created}</td>
        `;
        messagesBody.appendChild(tr);
      });
    }
  } catch (err) {
    console.error('Admin dashboard load error:', err);
    showMessage('Failed to load admin data', 'error');
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", async () => {
  console.log('🚀 Alumni Connect Frontend Started');
  console.log('📡 Backend:', API_URL);
  
  checkAuth();

  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  const form = document.getElementById("mentor-search-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      applyFilters();
    });
  }

  if (document.getElementById("mentor-list")) {
    const mentors = await fetchMentorsFromBackend();
    renderMentors(mentors);
  }

  await setupContactForm();
  await loadAdminDashboard();

  setupAuthModal();
});