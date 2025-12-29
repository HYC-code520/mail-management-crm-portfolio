interface Contact {
  company_name?: string;
  contact_person?: string;
  mailbox_number?: string;
  display_name_preference?: 'company' | 'person' | 'both' | 'auto';
}

/**
 * Get customer display name based on their preference
 * This is used throughout the app to ensure consistent customer name display
 */
export function getCustomerDisplayName(contact: Contact): string {
  const hasCompany = contact.company_name?.trim();
  const hasPerson = contact.contact_person?.trim();
  const preference = contact.display_name_preference || 'auto';
  
  // Handle explicit preferences
  if (preference === 'company' && hasCompany) {
    return contact.company_name;
  }
  
  if (preference === 'person' && hasPerson) {
    return contact.contact_person;
  }
  
  if (preference === 'both' && hasCompany && hasPerson) {
    return `${contact.company_name} - ${contact.contact_person}`;
  }
  
  // Auto/fallback logic: Show what's available
  // Prioritize showing both for better identification
  if (hasCompany && hasPerson) {
    return `${contact.company_name} - ${contact.contact_person}`;
  }
  
  if (hasCompany) {
    return contact.company_name;
  }
  
  if (hasPerson) {
    return contact.contact_person;
  }
  
  return 'Unknown Customer';
}

/**
 * Get primary identifier (for space-constrained displays)
 * Respects preference but returns single value
 */
export function getCustomerPrimaryName(contact: Contact): string {
  const preference = contact.display_name_preference || 'auto';
  
  if (preference === 'company' && contact.company_name) {
    return contact.company_name;
  }
  
  if (preference === 'person' && contact.contact_person) {
    return contact.contact_person;
  }
  
  // Default: prefer company, fallback to person
  return contact.company_name?.trim() || 
         contact.contact_person?.trim() || 
         'Unknown Customer';
}

