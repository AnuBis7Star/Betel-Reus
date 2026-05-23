async function apiRequest(path, options = {}) {
  const { adminCode, ...fetchOptions } = options;
  const headers = { ...(fetchOptions.headers || {}) };
  if (fetchOptions.body && typeof fetchOptions.body !== "string") {
    headers["Content-Type"] = "application/json";
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }
  if (adminCode && path.startsWith("/api/admin/")) headers["x-admin-code"] = adminCode;

  const response = await fetch(path, { ...fetchOptions, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || "API request failed");
    error.status = response.status;
    throw error;
  }
  return data;
}

export { apiRequest };
