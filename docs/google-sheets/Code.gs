/**************************************************************
 * Svastida Google Sheets enquiry receiver
 *
 * 1. Open a Google Sheet.
 * 2. Extensions -> Apps Script.
 * 3. Replace the default Code.gs with this file.
 * 4. Set SECRET to the same value as Vercel's
 *    GOOGLE_SHEETS_WEBHOOK_SECRET.
 * 5. Deploy -> New deployment -> Web app.
 *    Execute as: Me
 *    Who has access: Anyone
 * 6. Copy the web app URL into Vercel as:
 *    GOOGLE_SHEETS_WEBHOOK_URL
 **************************************************************/

const SECRET = "REPLACE_WITH_A_LONG_RANDOM_SECRET";
const SHEET_NAME = "Enquiries";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: "Missing request body" });
    }

    const payload = JSON.parse(e.postData.contents);

    if (!SECRET || SECRET === "REPLACE_WITH_A_LONG_RANDOM_SECRET" || payload.token !== SECRET) {
      return json({ ok: false, error: "Unauthorized" });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Enquiry ID",
        "Created At",
        "Name",
        "Phone",
        "WhatsApp",
        "Email",
        "Address",
        "Landmark",
        "City",
        "State",
        "Pincode",
        "Notes",
        "Items",
        "Total"
      ]);
    }

    const customer = payload.customer || {};
    const items = Array.isArray(payload.items) ? payload.items : [];

    const itemText = items.map(function(item) {
      const name = item.product_name || item.productName || "Item";
      const size = item.size_label || item.size || "Custom";
      const qty = item.quantity || 1;
      const price = item.unit_price ?? item.unitPrice ?? 0;
      const ai = item.ai_design_url || item.aiDesignUrl ? " | AI design attached" : "";
      return name + " | Size: " + size + " | Qty: " + qty + " | Unit: " + price + ai;
    }).join("\n");

    sheet.appendRow([
      payload.enquiryId || "",
      payload.createdAt || new Date().toISOString(),
      customer.name || "",
      customer.phone || "",
      customer.whatsappPhone || "",
      customer.email || "",
      customer.addressLine1 || "",
      customer.addressLine2 || "",
      customer.city || "",
      customer.state || "",
      customer.pincode || "",
      customer.notes || "",
      itemText,
      payload.total ?? 0
    ]);

    return json({ ok: true });
  } catch (error) {
    return json({ ok: false, error: String(error) });
  }
}

function doGet() {
  return json({ ok: true, service: "svastida-enquiry-sheet" });
}

function json(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
