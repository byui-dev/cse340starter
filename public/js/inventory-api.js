// Inventory API client
// Purpose: fetch paginated JSON from /inv/api and update table body for progressive enhancement
// Used by management page for dynamic reloads without full refresh.

async function fetchInventory(page = 1, limit = 20, search = '') {
  const url = `/inv/api?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
  const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch inventory');
    const data = await res.json();
    return data;
}

