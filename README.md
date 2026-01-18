# Austin Home Services Lead Generation

Lead generation system for home improvement services in Austin, Texas. Currently includes:

- **Roofing** - Storm damage inspection & insurance claim assistance
- **Fencing** - AI-powered fence visualization tool

## Quick Start

```bash
# Install live-server globally (if not already installed)
npm install -g live-server

# Run development server
npm run dev

# Or just open public/index.html in your browser
```

Visit `http://localhost:3000` to see the landing pages.

## Project Structure

```
public/
├── index.html          # Homepage with links to all landing pages
├── css/
│   └── styles.css      # Shared styles for all pages
├── js/
│   └── form-handler.js # Lead capture & backend integration
├── roofing/
│   └── index.html      # Roofing landing page
├── fencing/
│   └── index.html      # Fencing landing page
└── images/             # Image assets (add your own)
```

## Connecting to a Backend

Edit `public/js/form-handler.js` and change the `CONFIG` object:

### Option 1: Zapier Webhook
```javascript
const CONFIG = {
  backend: 'zapier',
  zapierWebhook: 'https://hooks.zapier.com/hooks/catch/YOUR_ID/YOUR_HOOK/',
};
```

### Option 2: Google Sheets
1. Create a Google Sheet
2. Go to Extensions > Apps Script
3. Deploy as web app
4. Update config:
```javascript
const CONFIG = {
  backend: 'sheets',
  sheetsUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
};
```

### Option 3: Formspree
1. Sign up at formspree.io
2. Create a form
3. Update config:
```javascript
const CONFIG = {
  backend: 'formspree',
  formspreeId: 'YOUR_FORM_ID',
};
```

## Testing Leads

While in development (backend: 'console'), leads are stored in localStorage.

Open browser console and run:
- `viewLeads()` - See all captured leads
- `exportLeadsCSV()` - Download leads as CSV file

## Deployment

This is a static site. Deploy the `public/` folder to:
- Netlify (drag & drop)
- Vercel
- GitHub Pages
- Any web hosting

## Adding More Services

1. Create new folder in `public/` (e.g., `public/painting/`)
2. Copy `fencing/index.html` as template
3. Update content, colors, and form fields
4. Add link to homepage (`public/index.html`)

## Future Enhancements

- [ ] AI fence visualization (GPT-4 Vision integration)
- [ ] Hail storm alert integration
- [ ] County assessor data scraping
- [ ] CRM integration (HubSpot, Salesforce)
- [ ] SMS notifications for new leads
- [ ] A/B testing framework

## License

MIT
