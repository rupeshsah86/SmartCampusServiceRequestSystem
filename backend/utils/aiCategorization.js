// AI-based issue categorization using keyword matching
const categorizeIssue = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();
  
  // Keywords for each category
  const categories = {
    it_support: ['computer', 'laptop', 'wifi', 'internet', 'network', 'printer', 'software', 'password', 'email', 'projector', 'screen', 'monitor', 'keyboard', 'mouse', 'system', 'server', 'website', 'app', 'login'],
    maintenance: ['repair', 'broken', 'fix', 'damage', 'leak', 'crack', 'paint', 'door', 'window', 'furniture', 'chair', 'table', 'fan', 'light', 'bulb', 'switch', 'socket'],
    facilities: ['ac', 'air conditioning', 'heating', 'cooling', 'temperature', 'clean', 'dirty', 'toilet', 'washroom', 'bathroom', 'water', 'electricity', 'power', 'lift', 'elevator'],
    security: ['lock', 'key', 'theft', 'stolen', 'lost', 'found', 'suspicious', 'safety', 'emergency', 'fire', 'alarm', 'cctv', 'camera', 'guard', 'access', 'entry']
  };
  
  let maxScore = 0;
  let suggestedCategory = 'other';
  
  for (const [category, keywords] of Object.entries(categories)) {
    let score = 0;
    keywords.forEach(keyword => {
      if (text.includes(keyword)) score++;
    });
    
    if (score > maxScore) {
      maxScore = score;
      suggestedCategory = category;
    }
  }
  
  return {
    category: suggestedCategory,
    confidence: maxScore > 0 ? Math.min((maxScore / 3) * 100, 100) : 0
  };
};

// Determine priority based on keywords
const determinePriority = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();
  
  const urgentKeywords = ['urgent', 'emergency', 'critical', 'immediately', 'asap', 'broken', 'not working', 'fire', 'leak', 'danger'];
  const highKeywords = ['important', 'soon', 'quickly', 'problem', 'issue', 'major'];
  const lowKeywords = ['minor', 'small', 'whenever', 'eventually'];
  
  if (urgentKeywords.some(keyword => text.includes(keyword))) {
    return 'urgent';
  } else if (highKeywords.some(keyword => text.includes(keyword))) {
    return 'high';
  } else if (lowKeywords.some(keyword => text.includes(keyword))) {
    return 'low';
  }
  
  return 'medium';
};

module.exports = { categorizeIssue, determinePriority };