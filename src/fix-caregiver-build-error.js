#!/usr/bin/env node
/**
 * Fix Critical Build Error in CaregiverDashboardEnhanced.tsx
 * Line 657: Replace string concatenation with \\n\\n with template literal
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components', 'CaregiverDashboardEnhanced.tsx');

console.log('🔧 Fixing build error in CaregiverDashboardEnhanced.tsx...\n');

try {
  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find and replace the problematic line
  const oldString = "'Are you sure you want to delete ' + med.name + ' for ' + dependent.name + '?\\\\n\\\\nThis action cannot be undone.'";
  const newString = "`Are you sure you want to delete ${med.name} for ${dependent.name}?\\n\\nThis action cannot be undone.`";
  
  if (content.includes(oldString)) {
    content = content.replace(oldString, newString);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Successfully fixed build error!');
    console.log('   Changed: String concatenation with \\\\n\\\\n');
    console.log('   To: Template literal with \\n\\n\n');
    console.log('📦 Now run: npm run build');
  } else {
    console.log('⚠️  Could not find the exact string to replace.');
    console.log('   The file may have already been fixed or the content differs.\n');
    console.log('Manual fix instructions:');
    console.log('   1. Open components/CaregiverDashboardEnhanced.tsx');
    console.log('   2. Go to line 657');
    console.log('   3. Replace:');
    console.log('      const confirmMsg = \'Are you sure...\' + med.name + ... + \'?\\\\n\\\\nThis action...\'');
    console.log('   4. With:');
    console.log('      const confirmMsg = `Are you sure... ${med.name} ... ${dependent.name}?\\n\\nThis action...`');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
