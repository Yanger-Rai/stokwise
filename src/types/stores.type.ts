// --- NEW TYPES FOR STORE CARDS ---

/**
 * Represents the data for a single store location.
 */
export type StoreData = {
  id: string;
  name: string;
  location: string; // The physical location/address of the store
  totalItems: number; // Total unique products or stock count (mocked for now)
};
