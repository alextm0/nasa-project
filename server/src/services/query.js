const DEFAULT_PAGE_LIMIT = 1;
const DEFAULT_PAGE_NUMBER = 1;

function getPagination(query) {
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_NUMBER;
  const page = Math.abs(query.page) || DEFAULT_PAGE_LIMIT;

  return {
    skip: (page - 1) * limit,
    limit: limit,
  }
}

export {
  getPagination
}