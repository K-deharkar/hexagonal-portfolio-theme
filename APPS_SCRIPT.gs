// ============================================================================
// GOOGLE APPS SCRIPT FOR CONTACT FORM TO GOOGLE SHEETS
// ============================================================================
// 
// SETUP STEPS:
// 1. Create a new Google Sheet at https://sheets.google.com
// 2. Rename the first tab to "Responses" (or your preferred name)
// 3. Add these headers to row 1: Timestamp | Name | Email | Subject | Message
// 4. Open Extensions → Apps Script
// 5. Delete any default code and paste ALL of this code below
// 6. Find "REPLACE_WITH_SHEET_ID" and "Responses" below — update them if needed
// 7. Save the project (no deploy yet)
// 8. Click "Deploy" → "New Deployment" → Select "Web app"
// 9. Set: Execute as "Me", Who has access "Anyone"
// 10. Click Deploy and copy the Web App URL
// 11. Paste the Web App URL into script.js SHEET_ENDPOINT constant
// 
// ============================================================================

const SHEET_ID = 'REPLACE_WITH_SHEET_ID';
const SHEET_NAME = 'Responses';

/**
 * Handles incoming POST requests from the contact form.
 * Validates and appends data to Google Sheet.
 */
function doPost(e) {
  try {
    // Parse JSON payload from form
    const body = JSON.parse(e.postData.contents || '{}');

    // Basic validation
    if (!body.email || !body.name) {
      return sendResponse({ 
        status: 'error', 
        message: 'Name and email are required.' 
      }, 400);
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return sendResponse({ 
        status: 'error', 
        message: 'Invalid email format.' 
      }, 400);
    }

    // Check for spam patterns (basic)
    if (body.message && body.message.length > 5000) {
      return sendResponse({ 
        status: 'error', 
        message: 'Message is too long.' 
      }, 400);
    }

    // Open sheet and append row
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    sheet.appendRow([
      body.timestamp || new Date().toISOString(),
      body.name || '',
      body.email || '',
      body.subject || '',
      body.message || ''
    ]);

    // Log successful submission
    Logger.log(`Contact form: ${body.name} (${body.email}) - "${body.subject}"`);

    return sendResponse({ 
      status: 'success', 
      message: 'Message saved successfully. Thank you for reaching out!' 
    }, 200);
  } catch (err) {
    Logger.log(`Error in doPost: ${err.message}`);
    return sendResponse({ 
      status: 'error', 
      message: 'Server error. Please try again later.' 
    }, 500);
  }
}

/**
 * Helper: Send JSON response with proper CORS headers
 */
function sendResponse(data, statusCode = 200) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/**
 * Handles OPTIONS requests (browser preflight for CORS)
 */
function doOptions(e) {
  return sendResponse({ status: 'ok' }, 200);
}
