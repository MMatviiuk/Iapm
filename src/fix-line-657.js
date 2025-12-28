// Fix line 657 in CaregiverDashboardEnhanced.tsx
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components', 'CaregiverDashboardEnhanced.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the problematic line
const oldLine = `const confirmMsg = 'Are you sure you want to delete ' + med.name + ' for ' + dependent.name + '?\\\\n\\\\nThis action cannot be undone.';`;
const newLine = `const confirmMsg = \`Are you sure you want to delete \${med.name} for \${dependent.name}?\\n\\nThis action cannot be undone.\`;`;

content = content.replace(oldLine, newLine);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed line 657 in CaregiverDashboardEnhanced.tsx');
