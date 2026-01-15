/**
 * Photo Fingerprinting Utility
 * Generates a unique fingerprint for an image to detect duplicates
 */

/**
 * Generate a simple hash from a Blob
 * Uses first 1KB + last 1KB + size for a quick fingerprint
 */
export async function generatePhotoFingerprint(blob: Blob): Promise<string> {
  const size = blob.size;

  // For small files, just hash the whole thing
  if (size <= 4096) {
    const buffer = await blob.arrayBuffer();
    return await hashArrayBuffer(buffer, size);
  }

  // For larger files, sample from beginning and end (faster than hashing entire file)
  const firstChunk = blob.slice(0, 2048);
  const lastChunk = blob.slice(-2048);

  const firstBuffer = await firstChunk.arrayBuffer();
  const lastBuffer = await lastChunk.arrayBuffer();

  // Combine the chunks with size info
  const combined = new Uint8Array(firstBuffer.byteLength + lastBuffer.byteLength + 8);
  combined.set(new Uint8Array(firstBuffer), 0);
  combined.set(new Uint8Array(lastBuffer), firstBuffer.byteLength);

  // Add size as bytes at the end
  const sizeView = new DataView(combined.buffer, firstBuffer.byteLength + lastBuffer.byteLength);
  sizeView.setBigUint64(0, BigInt(size), true);

  return await hashArrayBuffer(combined.buffer, size);
}

/**
 * Hash an ArrayBuffer using SubtleCrypto (if available) or simple checksum
 */
async function hashArrayBuffer(buffer: ArrayBuffer, size: number): Promise<string> {
  try {
    // Use SubtleCrypto SHA-256 if available (modern browsers)
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `sha256-${hashHex.substring(0, 16)}-${size}`;
  } catch {
    // Fallback to simple checksum for older browsers
    const bytes = new Uint8Array(buffer);
    let checksum = 0;
    for (let i = 0; i < bytes.length; i++) {
      checksum = ((checksum << 5) - checksum + bytes[i]) | 0;
    }
    return `cksum-${Math.abs(checksum).toString(16)}-${size}`;
  }
}

/**
 * Check if a fingerprint already exists in a list of items
 */
export function isDuplicatePhoto(
  fingerprint: string,
  existingItems: Array<{ photoFingerprint?: string }>
): boolean {
  return existingItems.some(item => item.photoFingerprint === fingerprint);
}

/**
 * Get all duplicate fingerprints in a list
 */
export function findDuplicates(
  fingerprints: string[]
): Map<string, number[]> {
  const seen = new Map<string, number[]>();

  fingerprints.forEach((fp, index) => {
    if (!seen.has(fp)) {
      seen.set(fp, []);
    }
    seen.get(fp)!.push(index);
  });

  // Filter to only return duplicates (more than 1 occurrence)
  const duplicates = new Map<string, number[]>();
  seen.forEach((indices, fp) => {
    if (indices.length > 1) {
      duplicates.set(fp, indices);
    }
  });

  return duplicates;
}
