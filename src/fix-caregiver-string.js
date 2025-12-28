// Quick fix script for the problematic line in CaregiverDashboardEnhanced.tsx
// Run this to fix the template string issue

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components', 'CaregiverDashboardEnhanced.tsx');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the problematic line
  const oldLine = "'Are you sure you want to delete ' + med.name + ' for ' + dependent.name + '?\\\\n\\\\nThis action cannot be undone.'";
  const newLine = "`Are you sure you want to delete \\${med.name} for \\${dependent.name}?\\n\\nThis action cannot be undone.`";
  
  content = content.replace(oldLine, newLine);
  
  // Also remove the const confirmMsg = part and inline it
  content = content.replace(
    /const confirmMsg = `Are you sure[\s\S]*?undone\.`;[\s\n]*if \(confirm\(confirmMsg\)\)/,
    'if (confirm(`Are you sure you want to delete \\${med.name} for \\${dependent.name}?\\n\\nThis action cannot be undone.`))'
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Fixed CaregiverDashboardEnhanced.tsx');
} catch (error) {
  console.error('❌ Error:', error.message);
}
