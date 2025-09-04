const fs = require('fs');

// Read the Airtable data
const data = JSON.parse(fs.readFileSync('airtable_tags.json', 'utf8'));

// Extract all unique tags
const allTags = new Set();

data.records.forEach(record => {
  if (record.fields && record.fields.All_Tags) {
    record.fields.All_Tags.forEach(tag => {
      allTags.add(tag);
    });
  }
});

// Sort tags by category
const tagsByCategory = {
  activity: [],
  cert: [],
  country: [],
  dest: [],
  lang: [],
  level: [],
  region: [],
  role: [],
  spec: [],
  traveler: []
};

// Categorize tags
Array.from(allTags).sort().forEach(tag => {
  const prefix = tag.split('_')[0];
  if (tagsByCategory[prefix]) {
    tagsByCategory[prefix].push(tag);
  }
});

console.log('🏷️  COMPLETE TAG ANALYSIS\n');
console.log('📊 Total unique tags:', allTags.size);
console.log('\n🔍 TAGS BY CATEGORY:\n');

Object.keys(tagsByCategory).forEach(category => {
  if (tagsByCategory[category].length > 0) {
    console.log(`\n📍 ${category.toUpperCase()} TAGS (${tagsByCategory[category].length}):`);
    tagsByCategory[category].forEach(tag => {
      console.log(`  - ${tag}`);
    });
  }
});

console.log('\n\n🎯 ALL TAGS (alphabetical):');
Array.from(allTags).sort().forEach(tag => {
  console.log(`  ${tag}`);
});