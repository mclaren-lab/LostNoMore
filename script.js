// Validate user name
function validateName(name, errorId) {
  const error = document.getElementById(errorId);
  if (name.length < 2 || name.length > 50) {
    error.classList.add("show");
    return false;
  }
  error.classList.remove("show");
  return true;
}

// Remove all error messages
function clearErrors() {
  document.querySelectorAll(".error-message").forEach(error => {
    error.classList.remove("show");
  });
}

// Search through reports with text and filters
function searchReports(query) {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  const filtered = reports.filter(report => {
    const searchText = query.toLowerCase();
    return report.name.toLowerCase().includes(searchText) ||
           report.email.toLowerCase().includes(searchText) ||
           report.description.toLowerCase().includes(searchText) ||
           report.items.toLowerCase().includes(searchText) ||
           report.site.toLowerCase().includes(searchText) ||
           report.location.toLowerCase().includes(searchText);
  });
  displayReports(filtered);
}

// Display reports to users
function displayReports(reports) {
  const container = document.getElementById("reportsContainer");
  container.innerHTML = "";
  
  if (reports.length === 0) {
    container.innerHTML = "<p style='color: rgba(255, 255, 255, 0.7); text-align: center; padding: 20px;'>No reports found.</p>";
    return;
  }
  
  reports.forEach(report => {
    const div = document.createElement("div");
    div.className = `report-item ${report.type.toLowerCase()}`; // Add 'found' or 'lost' class
    
    // Check if user info should be hidden (admin marked as hidden)
    const isHidden = report.hiddenInfo || false;
    
    // Create image element if image data exists
    let imageHtml = '';
    if (report.imageData) {
      imageHtml = `<img src="${report.imageData}" alt="${report.items}" />`;
    }
    
    div.innerHTML = `
      ${imageHtml}
      <div class="report-content">
        <h4>${report.type} - ${report.items}</h4>
        <p><strong>Name:</strong> ${isHidden ? '[Hidden]' : report.name}</p>
        <p><strong>Email:</strong> ${isHidden ? '[Hidden]' : report.email}</p>
        <p><strong>Phone:</strong> ${isHidden ? '[Hidden]' : report.phone}</p>
        ${report.site ? `<p><strong>Site:</strong> ${report.site}</p>` : ""}
        ${report.location ? `<p><strong>Location:</strong> ${report.location}</p>` : ""}
        <p><strong>Description:</strong> ${report.description}</p>
        ${report.date ? `<p><strong>Date:</strong> ${report.date}</p>` : ""}
        ${report.reward ? `<p><strong>Reward:</strong> ${report.reward}</p>` : ""}
      </div>
    `;
    container.appendChild(div);
  });
}

// Show lost item form
function showLost() {
  hideAll();
  document.getElementById("lost").classList.remove("hidden");
}

// Show all reports
function showReports() {
  hideAll();
  document.getElementById("reportsList").classList.remove("hidden");
  displayReports(JSON.parse(localStorage.getItem('reports') || '[]'));
}

// Hide reports view
function hideReports() {
  document.getElementById("reportsList").classList.add("hidden");
}

// Go back to main screen
function goBack() {
  hideAll();
  // Clear form data when going back
  document.querySelectorAll('form').forEach(form => {
    form.reset();
  });
  // Clear character counters
  document.querySelectorAll('.char-counter span').forEach(counter => {
    counter.textContent = '0';
  });
  // Clear selected items
  selectedItems = [];
  selectedFoundItems = [];
  selectedFoundSite = '';
  selectedLostSite = '';
  // Reset item button colors
  document.querySelectorAll('.item-buttons button').forEach(btn => {
    btn.style.background = '#e6efff';
    btn.style.color = '#1a1a2e';
  });
  // Reset site button colors
  document.querySelectorAll('.site-buttons button').forEach(btn => {
    btn.classList.remove('selected');
    btn.style.background = '#e8f4fd';
    btn.style.color = '#1a1a2e';
  });
}

// Hide all forms
function hideAll() {
  document.querySelectorAll(".form-card").forEach(section => {
    section.classList.add("hidden");
  });
}

// Remember which campus is selected
let selectedFoundSite = '';
let selectedLostSite = '';

// Pick a campus location
function selectSite(btn, type) {
  const site = btn.innerText;
  
  if (type === 'found') {
    // Clear previous selection
    document.querySelectorAll('#found .site-buttons button').forEach(button => {
      button.classList.remove('selected');
      button.style.background = '#e8f4fd';
      button.style.color = '#1a1a2e';
    });
    
    // Set new selection
    btn.classList.add('selected');
    btn.style.background = '#1a1a2e';
    btn.style.color = '#fff';
    selectedFoundSite = site;
  } else {
    // Clear previous selection
    document.querySelectorAll('#lost .site-buttons button').forEach(button => {
      button.classList.remove('selected');
      button.style.background = '#e8f4fd';
      button.style.color = '#1a1a2e';
    });
    
    // Set new selection
    btn.classList.add('selected');
    btn.style.background = '#1a1a2e';
    btn.style.color = '#fff';
    selectedLostSite = site;
  }
}

// Remember which items are selected
let selectedItems = [];
let selectedFoundItems = [];

// Pick a lost item type
function selectItem(btn) {
  toggleSelection(btn, selectedItems, "description", "lostOthersInput");
}

// Pick a found item type
function selectFound(btn) {
  toggleSelection(btn, selectedFoundItems, "foundDescription", "foundOthersInput");
}

// Turn item selection on/off
function toggleSelection(btn, arr, descId, othersInputId) {
  const item = btn.innerText;
  
  // Handle Others category
  if (item === 'Others') {
    // Clear all other selections
    arr.length = 0;
    document.querySelectorAll('.item-buttons button').forEach(button => {
      if (button.innerText !== 'Others') {
        button.style.background = "rgba(255, 255, 255, 0.15)";
        button.style.color = "#fff";
      }
    });
    
    // Show/hide others input
    const othersInput = document.getElementById(othersInputId);
    if (arr.includes('Others')) {
      // Deselect Others
      arr.splice(arr.indexOf('Others'), 1);
      btn.style.background = "rgba(255, 255, 255, 0.15)";
      btn.style.color = "#fff";
      othersInput.classList.remove('show');
    } else {
      // Select Others
      arr.push('Others');
      btn.style.background = "rgba(102, 126, 234, 0.6)";
      btn.style.color = "#fff";
      othersInput.classList.add('show');
    }
  } else {
    // Handle regular items
    // Clear Others selection if any regular item is selected
    const othersBtn = Array.from(document.querySelectorAll('.item-buttons button')).find(b => b.innerText === 'Others');
    if (othersBtn) {
      const othersIndex = arr.indexOf('Others');
      if (othersIndex > -1) {
        arr.splice(othersIndex, 1);
        othersBtn.style.background = "rgba(255, 255, 255, 0.15)";
        othersBtn.style.color = "#fff";
        document.getElementById(othersInputId).classList.remove('show');
      }
    }
    
    if (arr.includes(item)) {
      // Remove item from selection
      arr.splice(arr.indexOf(item), 1);
      btn.style.background = "rgba(255, 255, 255, 0.15)";
      btn.style.color = "#fff";
    } else {
      // Add item to selection
      arr.push(item);
      btn.style.background = "rgba(102, 126, 234, 0.6)";
      btn.style.color = "#fff";
    }
  }

  // Update description field
  updateDescriptionField(arr, descId, othersInputId);
}

// Update description field based on selections
function updateDescriptionField(arr, descId, othersInputId) {
  let itemsText = '';
  
  if (arr.includes('Others')) {
    const othersInput = document.getElementById(othersInputId.replace('Input', 'Specify'));
    const othersValue = othersInput ? othersInput.value.trim() : '';
    if (othersValue) {
      itemsText = othersValue;
    }
  } else {
    itemsText = arr.join(", ");
  }
  
  document.getElementById(descId).value = itemsText;
  
  // Update character counter for description
  updateCharCounter(descId);
}

// Update description with selected items
function updateCharCounter(fieldId) {
  const field = document.getElementById(fieldId);
  const counterId = fieldId + "Count";
  const counter = document.getElementById(counterId);
  if (counter) {
    counter.textContent = field.value.length;
  }
}

// Store report in browser
function saveReport(report) {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  reports.push(report);
  localStorage.setItem('reports', JSON.stringify(reports));
}

// Log user into system
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  
  // Clear previous errors
  clearErrors();
  
  // Validate inputs
  let isValid = true;
  
  if (!validateEmail(email, "emailError")) isValid = false;
  if (!validatePassword(password, "passwordError")) isValid = false;
  
  if (isValid) {
    // Check for admin credentials first
    if (email === "admin@gmail.com" && password === "admin123") {
      const adminUser = {
        name: "Administrator",
        email: "admin@gmail.com",
        role: "admin",
        isAdmin: true
      };
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      document.getElementById("userName").textContent = adminUser.name;
      document.getElementById("adminPanelBtn").classList.remove("hidden");
      document.getElementById("loginPage").classList.add("hidden");
      document.getElementById("dashboard").classList.remove("hidden");
      return;
    }
    
    // Check if regular user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Set current user
      user.isAdmin = false;
      localStorage.setItem('currentUser', JSON.stringify(user));
      document.getElementById("userName").textContent = user.name;
      document.getElementById("adminPanelBtn").classList.add("hidden");
      document.getElementById("loginPage").classList.add("hidden");
      document.getElementById("dashboard").classList.remove("hidden");
    } else {
      alert('Invalid email or password!');
    }
  }
}

// Show create account screen
function showCreateAccount() {
  document.getElementById("loginFormContainer").classList.add("hidden");
  document.getElementById("createAccountContainer").classList.remove("hidden");
  clearErrors();
}

// Show login screen
function showLogin() {
  document.getElementById("createAccountContainer").classList.add("hidden");
  document.getElementById("loginFormContainer").classList.remove("hidden");
  clearErrors();
}

// Make new user account
function createAccount() {
  const name = document.getElementById("createName").value.trim();
  const email = document.getElementById("createEmail").value.trim();
  const phone = document.getElementById("createPhone").value.trim();
  const password = document.getElementById("createPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  
  // Clear previous errors
  clearErrors();
  
  // Validate inputs
  let isValid = true;
  
  if (!validateName(name, "createNameError")) isValid = false;
  if (!validateEmail(email, "createEmailError")) isValid = false;
  if (!validatePhone(phone, "createPhoneError")) isValid = false;
  if (!validatePassword(password, "createPasswordError")) isValid = false;
  if (password !== confirmPassword) {
    document.getElementById("confirmPasswordError").classList.add("show");
    isValid = false;
  }
  
  if (isValid) {
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
      alert('An account with this email already exists!');
      return;
    }
    
    // Create new user
    const newUser = {
      name: name,
      email: email,
      phone: phone,
      password: password,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Account created successfully! You can now login.');
    showLogin();
  }
}

// Log user out
function logout() {
  localStorage.removeItem('currentUser');
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("loginPage").classList.remove("hidden");
  
  // Clear login form
  document.getElementById("loginForm").reset();
  document.querySelectorAll('.char-counter span').forEach(counter => {
    counter.textContent = '0';
  });
  
  alert('You have been logged out successfully!');
}

// Set up button clicks and interactions
document.addEventListener('DOMContentLoaded', function() {
  // Character counters for all inputs
  const inputs = [
    'email', 'password', 'createName', 'createEmail', 'createPhone', 
    'createPassword', 'confirmPassword', 'foundName', 'foundEmail', 'foundPhone',
    'foundLocation', 'foundDescription', 'foundOthersSpecify',
    'lostName', 'lostEmail', 'lostPhone', 'lostLocation', 'description', 'lostOthersSpecify', 'lostReward'
  ];
  
  inputs.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('input', () => updateCharCounter(id));
      element.addEventListener('blur', () => {
        if (id.includes('name')) validateName(element.value, id + 'Error');
        if (id.includes('email')) validateEmail(element.value, id + 'Error');
        if (id.includes('phone')) validatePhone(element.value, id + 'Error');
        if (id.includes('Password')) validatePassword(element.value, id + 'Error');
      });
    }
  });
  
  // Form submissions
  document.getElementById('foundForm').addEventListener('submit', function(e) {
    e.preventDefault();
    submitFoundReport();
  });
  
  document.getElementById('lostForm').addEventListener('submit', function(e) {
    e.preventDefault();
    submitLostReport();
  });
  
  // Check if user is already logged in
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (currentUser) {
    document.getElementById("userName").textContent = currentUser.name;
    if (currentUser.isAdmin) {
      document.getElementById("adminPanelBtn").classList.remove("hidden");
    } else {
      document.getElementById("adminPanelBtn").classList.add("hidden");
    }
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
  }
  
  // Load existing reports
  showReports();
});

// Open help window
function toggleHelpModal() {
  const modal = document.getElementById('helpModal');
  modal.classList.toggle('show');
}

// Switch between campus information
function switchCampus(campus) {
  // Hide all campus info
  document.querySelectorAll('.campus-info').forEach(info => {
    info.classList.remove('active');
  });
  
  // Remove active class from all buttons
  document.querySelectorAll('.campus-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected campus info
  document.getElementById(campus + '-campus').classList.add('active');
  
  // Add active class to clicked button
  event.target.classList.add('active');
}

// Allow dragging help window
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

const helpModal = document.getElementById('helpModal');
const helpHeader = document.querySelector('.help-header');

function dragStart(e) {
  if (e.type === "touchstart") {
    initialX = e.touches[0].clientX - xOffset;
    initialY = e.touches[0].clientY - yOffset;
  } else {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
  }

  if (e.target === helpHeader || helpHeader.contains(e.target)) {
    isDragging = true;
  }
}

function dragEnd(e) {
  initialX = currentX;
  initialY = currentY;
  isDragging = false;
}

function drag(e) {
  if (isDragging) {
    e.preventDefault();
    
    if (e.type === "touchmove") {
      currentX = e.touches[0].clientX - initialX;
      currentY = e.touches[0].clientY - initialY;
    } else {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }

    xOffset = currentX;
    yOffset = currentY;

    helpModal.style.transform = `translate(${currentX}px, ${currentY}px)`;
  }
}

// Add event listeners for dragging
helpHeader.addEventListener('mousedown', dragStart);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);

// Touch events for mobile
helpHeader.addEventListener('touchstart', dragStart);
document.addEventListener('touchmove', drag);
document.addEventListener('touchend', dragEnd);

// Open admin dashboard
function showAdminPanel() {
  // Check if current user is admin
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (!currentUser || !currentUser.isAdmin) {
    alert('Access denied! Only admin users can access this panel.');
    return;
  }
  
  hideAll();
  document.getElementById("adminPanel").classList.remove("hidden");
  showAllReports();
}

// Load all reports for admin
function showAllReports() {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  displayAdminReports(reports);
}

// Show reports with admin tools
function displayAdminReports(reports) {
  const container = document.getElementById("adminReportsContainer");
  container.innerHTML = "";
  
  if (reports.length === 0) {
    container.innerHTML = "<p>No reports found.</p>";
    return;
  }
  
  reports.forEach((report, index) => {
    const div = document.createElement("div");
    div.className = "admin-report-item";
    div.id = `report-${index}`;
    
    // Create image element if image data exists
    let imageHtml = '';
    if (report.imageData) {
      imageHtml = `<img src="${report.imageData}" alt="${report.items}" style="max-width: 100px; max-height: 100px; border-radius: 8px; margin-bottom: 10px;" />`;
    }
    
    div.innerHTML = `
      ${imageHtml}
      <div class="report-field"><strong>Type:</strong> ${report.type}</div>
      <div class="report-field"><strong>Items:</strong> ${report.items}</div>
      <div class="report-field"><strong>Name:</strong> <span class="user-name">${report.name}</span></div>
      <div class="report-field"><strong>Email:</strong> <span class="user-email">${report.email}</span></div>
      <div class="report-field"><strong>Phone:</strong> <span class="user-phone">${report.phone}</span></div>
      <div class="report-field"><strong>Site:</strong> ${report.site}</div>
      <div class="report-field"><strong>Location:</strong> ${report.location}</div>
      <div class="report-field"><strong>Description:</strong> ${report.description}</div>
      ${report.date ? `<div class="report-field"><strong>Date:</strong> ${report.date}</div>` : ""}
      ${report.reward ? `<div class="report-field"><strong>Reward:</strong> ${report.reward}</div>` : ""}
      <div class="report-actions">
        <button class="toggle-info-btn" onclick="toggleUserInfo(${index})">Hide Info</button>
        <button class="edit-btn" onclick="editReport(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteReport(${index})">Delete</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// Show or hide user contact details
function toggleUserInfo(index) {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  const report = reports[index];
  
  // Toggle hidden status in the report data
  report.hiddenInfo = !report.hiddenInfo;
  
  // Update localStorage
  localStorage.setItem('reports', JSON.stringify(reports));
  
  // Update admin panel display
  const reportElement = document.getElementById(`report-${index}`);
  const button = reportElement.querySelector('.toggle-info-btn');
  
  if (report.hiddenInfo) {
    reportElement.classList.add('hidden-info');
    button.textContent = 'Show Info';
    // Hide values in admin panel
    reportElement.querySelector('.user-name').textContent = '[Hidden]';
    reportElement.querySelector('.user-email').textContent = '[Hidden]';
    reportElement.querySelector('.user-phone').textContent = '[Hidden]';
  } else {
    reportElement.classList.remove('hidden-info');
    button.textContent = 'Hide Info';
    // Show actual values in admin panel
    reportElement.querySelector('.user-name').textContent = report.name;
    reportElement.querySelector('.user-email').textContent = report.email;
    reportElement.querySelector('.user-phone').textContent = report.phone;
  }
  
  // Refresh user reports display to apply changes
  showReports();
}

// Edit report
function editReport(index) {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  const report = reports[index];
  
  const newDescription = prompt('Edit description:', report.description);
  if (newDescription !== null && newDescription.trim() !== '') {
    reports[index].description = newDescription.trim();
    localStorage.setItem('reports', JSON.stringify(reports));
    showAllReports();
    alert('Report updated successfully!');
  }
}

// Delete report
function deleteReport(index) {
  if (confirm('Are you sure you want to delete this report?')) {
    const reports = JSON.parse(localStorage.getItem('reports') || '[]');
    reports.splice(index, 1);
    localStorage.setItem('reports', JSON.stringify(reports));
    showAllReports();
    alert('Report deleted successfully!');
  }
}

// Admin search through reports
function adminSearchReports(query) {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  const filtered = reports.filter(report => {
    const searchText = query.toLowerCase();
    return report.name.toLowerCase().includes(searchText) ||
           report.email.toLowerCase().includes(searchText) ||
           report.description.toLowerCase().includes(searchText) ||
           report.items.toLowerCase().includes(searchText) ||
           report.type.toLowerCase().includes(searchText);
  });
  displayAdminReports(filtered);
}

// Export reports
function exportReports() {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  const dataStr = JSON.stringify(reports, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `lostnmore_reports_${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  
  alert('Reports exported successfully!');
}
function showFound() {
  hideAll();
  document.getElementById("found").classList.remove("hidden");
}

// Submit found report
function submitFoundReport() {
  clearErrors();
  
  const name = document.getElementById('foundName').value.trim();
  const email = document.getElementById('foundEmail').value.trim();
  const phone = document.getElementById('foundPhone').value.trim();
  const location = document.getElementById('foundLocation').value.trim();
  const description = document.getElementById('foundDescription').value.trim();
  const fileInput = document.getElementById('foundFile');
  
  let isValid = true;
  if (!validateName(name, 'foundNameError')) isValid = false;
  if (!validateEmail(email, 'foundEmailError')) isValid = false;
  if (!validatePhone(phone, 'foundPhoneError')) isValid = false;
  if (!selectedFoundSite) {
    alert('Please select where the item was found');
    isValid = false;
  }
  if (location.length < 3) {
    document.getElementById('foundLocationError').classList.add('show');
    isValid = false;
  }
  
  if (!isValid) return;
  
  // Handle image upload
  let imageData = null;
  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      imageData = e.target.result;
      saveFoundReportWithData(imageData);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    saveFoundReportWithData(null);
  }
}

function saveFoundReportWithData(imageData) {
  const name = document.getElementById('foundName').value.trim();
  const email = document.getElementById('foundEmail').value.trim();
  const phone = document.getElementById('foundPhone').value.trim();
  const location = document.getElementById('foundLocation').value.trim();
  const description = document.getElementById('foundDescription').value.trim();
  
  // Get the actual item name based on selection
  let itemName = '';
  if (selectedFoundItems.includes('Others')) {
    const othersValue = document.getElementById('foundOthersSpecify').value.trim();
    if (!othersValue) {
      alert('Please specify the item when selecting "Others"');
      return;
    }
    itemName = othersValue;
  } else if (selectedFoundItems.length > 0) {
    itemName = selectedFoundItems.join(', ');
  } else {
    alert('Please select at least one item');
    return;
  }
  
  const report = {
    type: 'Found',
    name: name,
    email: email,
    phone: phone,
    site: selectedFoundSite,
    location: location,
    items: itemName, // Prioritize category/item name
    description: description,
    imageData: imageData,
    timestamp: new Date().toISOString()
  };
  
  saveReport(report);
  alert('Found report submitted successfully! Location: ' + selectedFoundSite + ' - ' + location);
  goBack();
  showReports(); // Redirect to search inventory
  localStorage.setItem('reports', JSON.stringify(reports)); // Add this line
}

// Submit lost report
function submitLostReport() {
  clearErrors();
  
  const name = document.getElementById('lostName').value.trim();
  const email = document.getElementById('lostEmail').value.trim();
  const phone = document.getElementById('lostPhone').value.trim();
  const location = document.getElementById('lostLocation').value.trim();
  const date = document.getElementById('lostDate').value;
  const description = document.getElementById('description').value.trim();
  const reward = document.getElementById('lostReward').value.trim();
  
  let isValid = true;
  if (!validateName(name, 'lostNameError')) isValid = false;
  if (!validateEmail(email, 'lostEmailError')) isValid = false;
  if (!validatePhone(phone, 'lostPhoneError')) isValid = false;
  if (!selectedLostSite) {
    alert('Please select where you lost the item');
    isValid = false;
  }
  if (location.length < 3) {
    document.getElementById('lostLocationError').classList.add('show');
    isValid = false;
  }
  if (!date) {
    alert('Please select date lost');
    isValid = false;
  }
  
  // Get the actual item name based on selection
  let itemName = '';
  if (selectedItems.includes('Others')) {
    const othersValue = document.getElementById('lostOthersSpecify').value.trim();
    if (!othersValue) {
      alert('Please specify the item when selecting "Others"');
      isValid = false;
    } else {
      itemName = othersValue;
    }
  } else if (selectedItems.length > 0) {
    itemName = selectedItems.join(', ');
  } else {
    alert('Please select at least one item');
    isValid = false;
  }
  
  if (!isValid) return;
  
  const report = {
    type: 'Lost',
    name: name,
    email: email,
    phone: phone,
    site: selectedLostSite,
    location: location,
    date: date,
    items: itemName, // Prioritize category/item name
    description: description,
    reward: reward || null, // Optional reward field
    timestamp: new Date().toISOString()
  };
  
  saveReport(report);
  alert('Lost report submitted successfully! Location: ' + selectedLostSite + ' - ' + location);
  goBack();
  showReports(); // Redirect to search inventory
}