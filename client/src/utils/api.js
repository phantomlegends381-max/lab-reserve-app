export async function safeJsonFetch(url, options = {}) {
  const { throwOnHttpError = true, ...fetchOptions } = options;
  const response = await fetch(url, fetchOptions);
  const contentType = response.headers.get('content-type') || '';
  const rawText = await response.text();

  let data = null;

  if (rawText.trim() && contentType.includes('application/json')) {
    try {
      data = JSON.parse(rawText);
    } catch (error) {
      throw new Error(`Invalid JSON response from ${url}: ${error.message}`);
    }
  } else if (rawText.trim()) {
    const preview = rawText.replace(/\s+/g, ' ').slice(0, 140);
    throw new Error(
      `Expected JSON from ${url}, but received ${contentType || 'unknown content type'}. Response started with: ${preview}`
    );
  }

  if (!response.ok && throwOnHttpError) {
    const message =
      data?.message ||
      data?.error ||
      data?.criticalIssues?.[0]?.message ||
      `Request failed with status ${response.status}`;

    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
