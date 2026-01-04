// Cache implementation for frequently accessed data
class SimpleCache {
  constructor(ttl = 300000) { // 5 minutes default
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    const expiry = Date.now() + this.ttl;
    this.cache.set(key, { value, expiry });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  clear() {
    this.cache.clear();
  }
}

// Create cache instances
const statsCache = new SimpleCache(300000); // 5 minutes
const userCache = new SimpleCache(600000); // 10 minutes

// Database query optimization
const optimizeQuery = (query) => {
  return query
    .lean() // Return plain objects instead of Mongoose documents
    .select('-__v') // Exclude version field
    .limit(100); // Prevent large queries
};

// Pagination helper
const getPagination = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit))); // Max 50 items
  const skip = (pageNum - 1) * limitNum;
  
  return { page: pageNum, limit: limitNum, skip };
};

module.exports = {
  SimpleCache,
  statsCache,
  userCache,
  optimizeQuery,
  getPagination
};