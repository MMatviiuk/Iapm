#!/bin/bash
# Fix the build error on line 657 of CaregiverDashboardEnhanced.tsx

FILE="components/CaregiverDashboardEnhanced.tsx"

# Use sed to replace the problematic line
# Replace string concatenation with template literal
sed -i.bak "657s/.*/                                      const confirmMsg = \`Are you sure you want to delete \$\{med.name\} for \$\{dependent.name\}?\\\\n\\\\nThis action cannot be undone.\`;/" "$FILE"

echo "✅ Fixed line 657 - Changed string concatenation to template literal"
echo "Original file backed up as ${FILE}.bak"
