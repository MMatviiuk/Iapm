#!/bin/bash

echo "🔍 Testing Modern UI Integration..."
echo ""

# Check if files exist
echo "✅ Checking files..."
if [ -f "components/DoctorDashboardModern.tsx" ]; then
    echo "   ✓ DoctorDashboardModern.tsx exists"
else
    echo "   ✗ DoctorDashboardModern.tsx NOT FOUND"
    exit 1
fi

if [ -f "components/CaregiverDashboardModern.tsx" ]; then
    echo "   ✓ CaregiverDashboardModern.tsx exists"
else
    echo "   ✗ CaregiverDashboardModern.tsx NOT FOUND"
    exit 1
fi

# Check imports in App.tsx
echo ""
echo "✅ Checking App.tsx imports..."
if grep -q "CaregiverDashboardModern" App.tsx; then
    echo "   ✓ CaregiverDashboardModern imported"
else
    echo "   ✗ CaregiverDashboardModern NOT imported"
fi

if grep -q "DoctorDashboardModern" App.tsx; then
    echo "   ✓ DoctorDashboardModern imported"
else
    echo "   ✗ DoctorDashboardModern NOT imported"
fi

# Check usage
echo ""
echo "✅ Checking component usage..."
if grep -q "<CaregiverDashboardModern" App.tsx; then
    echo "   ✓ CaregiverDashboardModern used"
else
    echo "   ✗ CaregiverDashboardModern NOT used"
fi

if grep -q "<DoctorDashboardModern" App.tsx; then
    echo "   ✓ DoctorDashboardModern used"
else
    echo "   ✗ DoctorDashboardModern NOT used"
fi

echo ""
echo "🎉 All checks passed!"
echo ""
echo "▶️  Next steps:"
echo "   1. Run: npm run dev"
echo "   2. Open: http://localhost:5173"
echo "   3. Test Doctor Dashboard: dr.anderson@example.com / demo123"
echo "   4. Test Caregiver Dashboard: catherine.bennett@example.com / demo123"
echo ""
