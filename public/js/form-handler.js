/**
 * Lead Form Handler
 *
 * Configure your preferred backend:
 * 1. Zapier Webhook
 * 2. Google Sheets via Apps Script
 * 3. Custom API endpoint
 * 4. Email via Formspree/EmailJS
 */

const CONFIG = {
  // Choose your backend: 'zapier', 'sheets', 'api', 'formspree', 'console'
  backend: 'console', // Change this when you have a backend set up

  // Zapier webhook URL
  zapierWebhook: 'YOUR_ZAPIER_WEBHOOK_URL',

  // Google Sheets Web App URL
  sheetsUrl: 'YOUR_GOOGLE_SHEETS_WEB_APP_URL',

  // Custom API endpoint
  apiEndpoint: 'YOUR_API_ENDPOINT',

  // Formspree form ID
  formspreeId: 'YOUR_FORMSPREE_ID',

  // Success redirect URL (optional - leave empty to show success message)
  successRedirect: '',

  // Success message
  successMessage: 'Thanks! We\'ll be in touch within 24 hours.',
};

// Initialize all forms on the page
document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', handleFormSubmit);
  });
});

async function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  // Gather form data
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Add metadata
  data.timestamp = new Date().toISOString();
  data.page = window.location.pathname;
  data.source = getUrlParameter('utm_source') || 'direct';
  data.medium = getUrlParameter('utm_medium') || '';
  data.campaign = getUrlParameter('utm_campaign') || '';
  data.referrer = document.referrer || '';

  console.log('Lead captured:', data);

  try {
    await sendToBackend(data);

    // Success handling
    if (CONFIG.successRedirect) {
      window.location.href = CONFIG.successRedirect;
    } else {
      showSuccessMessage(form, CONFIG.successMessage);
    }

    // Track conversion (if analytics is set up)
    trackConversion(data);

  } catch (error) {
    console.error('Form submission error:', error);
    alert('Something went wrong. Please try again or call us directly.');
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
}

async function sendToBackend(data) {
  switch (CONFIG.backend) {
    case 'zapier':
      return sendToZapier(data);
    case 'sheets':
      return sendToSheets(data);
    case 'api':
      return sendToApi(data);
    case 'formspree':
      return sendToFormspree(data);
    case 'console':
    default:
      console.log('Lead data (console mode):', JSON.stringify(data, null, 2));
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Store in localStorage for testing
      storeLead(data);
      return { success: true };
  }
}

async function sendToZapier(data) {
  const response = await fetch(CONFIG.zapierWebhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Zapier request failed');
  return response.json();
}

async function sendToSheets(data) {
  const response = await fetch(CONFIG.sheetsUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Sheets request failed');
  return response.json();
}

async function sendToApi(data) {
  const response = await fetch(CONFIG.apiEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('API request failed');
  return response.json();
}

async function sendToFormspree(data) {
  const response = await fetch(`https://formspree.io/f/${CONFIG.formspreeId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Formspree request failed');
  return response.json();
}

function showSuccessMessage(form, message) {
  const formCard = form.closest('.lead-form-card') || form.parentElement;
  formCard.innerHTML = `
    <div style="text-align: center; padding: 40px 20px;">
      <svg style="width: 60px; height: 60px; color: #27ae60; margin-bottom: 20px;" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
      </svg>
      <h2 style="color: #333; margin-bottom: 10px;">You're All Set!</h2>
      <p style="color: #666; font-size: 1.1rem;">${message}</p>
    </div>
  `;
}

function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function trackConversion(data) {
  // Google Analytics 4
  if (typeof gtag === 'function') {
    gtag('event', 'generate_lead', {
      'event_category': 'Lead',
      'event_label': data.page,
    });
  }

  // Facebook Pixel
  if (typeof fbq === 'function') {
    fbq('track', 'Lead');
  }
}

// Local storage for testing/backup
function storeLead(data) {
  const leads = JSON.parse(localStorage.getItem('leads') || '[]');
  leads.push(data);
  localStorage.setItem('leads', JSON.stringify(leads));
  console.log(`Lead stored locally. Total leads: ${leads.length}`);
}

// Helper to view stored leads (for testing)
window.viewLeads = function() {
  const leads = JSON.parse(localStorage.getItem('leads') || '[]');
  console.table(leads);
  return leads;
};

// Helper to export leads as CSV
window.exportLeadsCSV = function() {
  const leads = JSON.parse(localStorage.getItem('leads') || '[]');
  if (leads.length === 0) {
    console.log('No leads to export');
    return;
  }

  const headers = Object.keys(leads[0]);
  const csv = [
    headers.join(','),
    ...leads.map(lead => headers.map(h => `"${(lead[h] || '').toString().replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
