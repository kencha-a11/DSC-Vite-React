/**
 * Extract normalized data from a paginated API response.
 * Ensures consistent keys and defaults.
 *
 * @param {object} response - Axios response object
 * @returns {{
 *   data: Array,
 *   current_page: number,
 *   last_page: number,
 *   per_page: number,
 *   total: number,
 *   hasMore: boolean
 * }}
 */
export function extractDataFromResponse(response) {
  const raw = response?.data ?? {};

  const data = Array.isArray(raw.data) ? raw.data : [];
  const perPage = Number(raw.per_page ?? 10);
  const currentPage = Number(raw.current_page ?? 1);
  const lastPage = Number(raw.last_page ?? 1);
  const total = Number(raw.total ?? data.length);
  const hasMore = typeof raw.hasMore === "boolean" ? raw.hasMore : currentPage < lastPage;

  return { data, current_page: currentPage, last_page: lastPage, per_page: perPage, total, hasMore };
}
