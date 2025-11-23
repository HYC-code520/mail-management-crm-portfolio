# Mail Status Workflow

## Overview
This document describes the mail status management system that allows staff to track mail items through their lifecycle from receipt to final disposition.

## Available Status Values

### 1. **Received** (Default)
- **Color Badge**: Blue (`bg-blue-100 text-blue-700`)
- **Description**: Mail has been physically received and logged into the system
- **Next Actions Available**:
  - Mark as Notified (send customer notification)
  - Mark as Scanned Document (for digital scanning)
  - Mark as Abandoned Package (if unclaimed for extended period)

### 2. **Pending**
- **Color Badge**: Yellow (`bg-yellow-100 text-yellow-700`)
- **Description**: Mail is awaiting processing or customer action
- **Next Actions Available**:
  - Mark as Picked Up (customer collected)
  - Mark as Forward (to be forwarded)
  - Mark as Abandoned Package (if unclaimed)

### 3. **Notified**
- **Color Badge**: Purple (`bg-purple-100 text-purple-700`)
- **Description**: Customer has been notified about the mail arrival
- **Next Actions Available**:
  - Mark as Picked Up (customer collected)
  - Mark as Forward (customer requested forwarding)
  - Mark as Abandoned Package (if no response)

### 4. **Picked Up**
- **Color Badge**: Green (`bg-green-100 text-green-700`)
- **Description**: Customer has successfully collected the mail
- **Special Behavior**: Automatically sets `pickup_date` to current timestamp
- **Next Actions Available**: None (terminal status for successful delivery)

### 5. **Scanned Document** (New)
- **Color Badge**: Cyan (`bg-cyan-100 text-cyan-700`)
- **Description**: Mail has been digitized/scanned and is available electronically
- **Use Case**: For documents that need to be scanned and sent digitally to customers
- **Next Actions Available**: Edit to change if needed

### 6. **Forward** (New)
- **Color Badge**: Orange (`bg-orange-100 text-orange-700`)
- **Description**: Mail is being forwarded to customer's alternate address
- **Use Case**: Customer requested forwarding to different location
- **Next Actions Available**: Edit to change if needed

### 7. **Abandoned Package** (New)
- **Color Badge**: Red (`bg-red-100 text-red-700`)
- **Description**: Mail has been abandoned/unclaimed by customer
- **Use Case**: For packages that remain unclaimed after notification period
- **Next Actions Available**: Edit to change if needed

## User Interface

### Mail Log Page (`/dashboard/mail`)

#### 1. Status Filter Dropdown
Located in the filter section, allows filtering mail items by status:
```typescript
<select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
  <option>All Status</option>
  <option>Received</option>
  <option>Pending</option>
  <option>Notified</option>
  <option>Picked Up</option>
  <option>Scanned Document</option>
  <option>Forward</option>
  <option>Abandoned Package</option>
</select>
```

#### 2. Quick Action Buttons
In the Actions column of the mail table, contextual buttons appear based on current status:

**For "Received" status:**
- 🔔 **Notify** (Bell icon) - Mark as Notified
- 📄 **Scan** (FileText icon) - Mark as Scanned Document
- ⚠️ **Abandon** (AlertTriangle icon) - Mark as Abandoned Package

**For "Notified" or "Pending" status:**
- ✅ **Picked Up** (CheckCircle icon) - Mark as Picked Up
- 📤 **Forward** (Send icon) - Mark as Forward
- ⚠️ **Abandon** (AlertTriangle icon) - Mark as Abandoned Package

**Always Available:**
- ✏️ **Edit** - Open full edit modal
- 🗑️ **Delete** - Delete mail item

#### 3. Edit Modal
Full edit modal allows changing any field including status:
```typescript
<select name="status" value={formData.status} onChange={handleChange}>
  <option value="Received">Received</option>
  <option value="Pending">Pending</option>
  <option value="Notified">Notified</option>
  <option value="Picked Up">Picked Up</option>
  <option value="Scanned Document">Scanned Document</option>
  <option value="Forward">Forward</option>
  <option value="Abandoned Package">Abandoned Package</option>
</select>
```

### Dashboard Page (`/dashboard`)
Displays recent mail activity with color-coded status badges using the same color scheme.

## Backend Implementation

### Status Validation
The backend validates status values in both create and update operations:

```javascript
const validStatuses = [
  'Received', 
  'Notified', 
  'Picked Up', 
  'Pending', 
  'Scanned Document', 
  'Forward', 
  'Abandoned Package'
];

if (status && !validStatuses.includes(status)) {
  return res.status(400).json({ 
    error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
  });
}
```

### Automatic Date Setting
When status is set to "Picked Up", the system automatically sets `pickup_date`:

```javascript
if (status === 'Picked Up') {
  updateData.pickup_date = new Date().toISOString();
}
```

## Database Schema

The `mail_items` table stores the status as a TEXT field:

```sql
CREATE TABLE mail_items (
    mail_item_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id          UUID REFERENCES contacts(contact_id) ON DELETE CASCADE,
    item_type           TEXT DEFAULT 'Package',
    quantity            INTEGER DEFAULT 1,
    description         TEXT,
    received_date       TIMESTAMPTZ DEFAULT NOW(),
    status              TEXT DEFAULT 'Received', -- All 7 status values supported
    pickup_date         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);
```

## API Endpoints

### Create Mail Item
```http
POST /api/mail-items
Content-Type: application/json

{
  "contact_id": "uuid",
  "item_type": "Package",
  "quantity": 1,
  "description": "Optional description",
  "status": "Received"  // Optional, defaults to "Received"
}
```

### Update Mail Item Status
```http
PUT /api/mail-items/:id
Content-Type: application/json

{
  "status": "Picked Up"  // Any valid status
}
```

Returns 400 error if status is invalid.

## Testing

### Backend Tests
Added comprehensive tests for new status values:
- ✅ Test invalid status validation (returns 400)
- ✅ Test creating mail items with new statuses
- ✅ Test updating mail items to new statuses
- ✅ Test all 7 status values are accepted

### Frontend Tests
- ✅ All existing tests pass with new status implementation
- ✅ Build succeeds with no TypeScript errors

## Workflow Examples

### Example 1: Normal Package Delivery
1. Staff logs package: **Received** (blue badge)
2. Staff notifies customer: **Notified** (purple badge)
3. Customer picks up: **Picked Up** (green badge) - `pickup_date` auto-set

### Example 2: Document Scanning
1. Staff logs mail: **Received** (blue badge)
2. Staff scans document: **Scanned Document** (cyan badge)
3. Document sent to customer electronically

### Example 3: Forwarding
1. Staff logs mail: **Received** (blue badge)
2. Customer requests forwarding: **Forward** (orange badge)
3. Mail forwarded to alternate address

### Example 4: Abandoned Package
1. Staff logs package: **Received** (blue badge)
2. Staff notifies customer: **Notified** (purple badge)
3. No response after 30 days: **Abandoned Package** (red badge)

## Future Enhancements

Potential additions to consider:
- Automatic status transitions based on time (e.g., Notified → Abandoned Package after X days)
- Email/SMS notifications triggered by status changes
- Status change history/audit log
- Custom status notes for each transition
- Integration with notification templates based on status

## Color Scheme Reference

| Status | Background | Text Color | Tailwind Classes |
|--------|-----------|------------|------------------|
| Received | Light Blue | Blue | `bg-blue-100 text-blue-700` |
| Pending | Light Yellow | Yellow | `bg-yellow-100 text-yellow-700` |
| Notified | Light Purple | Purple | `bg-purple-100 text-purple-700` |
| Picked Up | Light Green | Green | `bg-green-100 text-green-700` |
| Scanned Document | Light Cyan | Cyan | `bg-cyan-100 text-cyan-700` |
| Forward | Light Orange | Orange | `bg-orange-100 text-orange-700` |
| Abandoned Package | Light Red | Red | `bg-red-100 text-red-700` |

## Files Modified

### Backend
- `backend/src/controllers/mailItems.controller.js` - Added status validation
- `backend/src/__tests__/mailItems.test.js` - Added tests for new statuses
- `scripts/simple_reset_rebuild.sql` - Updated schema comment

### Frontend
- `frontend/src/pages/Log.tsx` - Added status options, quick actions, badge styling
- `frontend/src/pages/Dashboard.tsx` - Updated badge styling for new statuses

## Migration Notes

No database migration required! The `status` field is already TEXT type, so any value can be stored. The changes are:
1. Backend validation to accept new values
2. Frontend UI to display and allow selection of new values
3. Updated color schemes for better visual distinction

Existing data remains valid and will continue to work correctly.


