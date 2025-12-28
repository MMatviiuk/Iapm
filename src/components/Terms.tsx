import { FileText, ArrowLeft } from 'lucide-react';

interface TermsProps {
  darkMode: boolean;
  setCurrentPage?: (page: string) => void;
}

export default function Terms({ darkMode, setCurrentPage }: TermsProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-blue-600 dark:bg-blue-700 text-white px-6 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          {setCurrentPage && (
            <button
              onClick={() => setCurrentPage('settings')}
              className="p-2 hover:bg-blue-700 dark:hover:bg-blue-800 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} strokeWidth={2.5} />
            </button>
          )}
          <FileText size={28} />
          <h1 className="text-white">Terms of Service</h1>
        </div>
        <p className="text-sm text-blue-100 dark:text-blue-200">
          Last updated: November 1, 2025
        </p>
      </div>

      <div className="px-6 py-6 space-y-6 text-gray-700 dark:text-gray-300">
        {/* Introduction */}
        <div>
          <h2 className="text-gray-900 dark:text-white mb-3">European Standard Terms</h2>
          <p className="mb-3">
            These Terms of Service ("Terms") govern your use of Prescription Clarity ("Service", "App", "we", "our", or "us"). By accessing or using our Service, you agree to be bound by these Terms.
          </p>
          <p>
            These Terms comply with European consumer protection laws, the General Data Protection Regulation (GDPR), and the Health Insurance Portability and Accountability Act (HIPAA).
          </p>
        </div>

        {/* Section 1 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">1. Use of Service</h3>
          <p className="mb-3">
            Prescription Clarity is a medication tracking and management application designed to help users:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Track medication schedules and adherence</li>
            <li>Set reminders for medication intake</li>
            <li>Share medication information with caregivers and healthcare providers</li>
            <li>Generate printable medication schedules</li>
            <li>Monitor adherence patterns and earn achievements</li>
          </ul>
          <p className="mt-3">
            <strong>Important:</strong> This Service is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your healthcare provider regarding any questions about medications or medical conditions.
          </p>
        </div>

        {/* Section 2 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">2. Data Protection</h3>
          <p className="mb-3">
            We are committed to protecting your personal data in accordance with GDPR, HIPAA, and other applicable data protection laws. Our data processing practices include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Processing data only for specified, explicit, and legitimate purposes</li>
            <li>Collecting only data that is adequate, relevant, and limited to what is necessary</li>
            <li>Keeping data accurate and up to date</li>
            <li>Storing data only for as long as necessary</li>
            <li>Implementing appropriate security measures</li>
          </ul>
          <p className="mt-3">
            For detailed information about how we collect, use, and protect your data, please review our{' '}
            <span className="text-blue-600 dark:text-blue-400 underline cursor-pointer">
              Privacy Policy
            </span>
            .
          </p>
        </div>

        {/* Section 3 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">3. User Responsibilities</h3>
          <p className="mb-2">By using our Service, you agree to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate and complete information about your medications</li>
            <li>Update your medication information promptly when changes occur</li>
            <li>Use the Service in compliance with all applicable laws and regulations</li>
            <li>Not misuse the Service or attempt to access it through unauthorized means</li>
            <li>Maintain the confidentiality of your account credentials</li>
            <li>Not share medical information of others without their explicit consent</li>
            <li>Verify medication information with healthcare professionals</li>
          </ul>
          <p className="mt-3">
            <strong>Medical Disclaimer:</strong> This app is designed to assist with medication tracking but should not replace professional medical advice. Always consult healthcare providers before starting, stopping, or changing any medication.
          </p>
        </div>

        {/* Section 4 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">4. Termination</h3>
          <p className="mb-3">
            You may terminate your use of the Service at any time by:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Deleting your account through the app settings</li>
            <li>Contacting us to request account deletion</li>
            <li>Ceasing to use the Service</li>
          </ul>
          <p className="mb-3">
            We may terminate or suspend your access to the Service if:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You violate these Terms</li>
            <li>We are required to do so by law</li>
            <li>Continued provision of the Service becomes unlawful or impractical</li>
          </ul>
          <p className="mt-3">
            Upon termination, your data will be deleted in accordance with our Privacy Policy and data retention requirements, unless we are legally required to retain it.
          </p>
        </div>

        {/* Section 5 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">5. Intellectual Property</h3>
          <p className="mb-3">
            The Service, including its original content, features, and functionality, is owned by Prescription Clarity and is protected by international copyright, trademark, and other intellectual property laws.
          </p>
          <p>
            You retain ownership of the health data you input into the Service. By using the Service, you grant us a limited license to use this data solely for providing and improving the Service.
          </p>
        </div>

        {/* Section 6 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">6. Limitation of Liability</h3>
          <p className="mb-3">
            To the maximum extent permitted by applicable law:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The Service is provided "as is" without warranties of any kind</li>
            <li>We are not liable for any indirect, incidental, special, or consequential damages</li>
            <li>We are not responsible for medication errors or adverse health outcomes</li>
            <li>Users are solely responsible for verifying medication information with healthcare providers</li>
          </ul>
          <p className="mt-3">
            Nothing in these Terms excludes or limits our liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded or limited under applicable law.
          </p>
        </div>

        {/* Section 7 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">7. Dispute Resolution</h3>
          <p className="mb-3">
            If you have a complaint or dispute, please contact us first at{' '}
            <a href="mailto:support@prescriptionclarity.example" className="text-blue-600 dark:text-blue-400 underline">
              support@prescriptionclarity.example
            </a>
            . We will attempt to resolve the issue amicably.
          </p>
          <p>
            If we cannot resolve the dispute, you may have the right to refer the matter to alternative dispute resolution or to bring proceedings in the courts of your country of residence.
          </p>
        </div>

        {/* Section 8 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">8. Changes to Terms</h3>
          <p className="mb-3">
            We reserve the right to modify these Terms at any time. If we make material changes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We will notify you via email or in-app notification</li>
            <li>The updated Terms will be posted with a new "Last updated" date</li>
            <li>Continued use of the Service after changes constitutes acceptance of the new Terms</li>
            <li>If you do not agree to the changes, you may terminate your account</li>
          </ul>
        </div>

        {/* Section 9 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">9. Governing Law</h3>
          <p>
            These Terms are governed by and construed in accordance with the laws of the European Union and the laws of the country in which you reside, without regard to conflict of law principles.
          </p>
        </div>

        {/* Section 10 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">10. Consumer Rights (EU)</h3>
          <p className="mb-3">
            As a consumer in the European Union, you have specific rights:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Right of Withdrawal:</strong> For paid services, you have 14 days to withdraw from the contract without giving any reason
            </li>
            <li>
              <strong>Clear Information:</strong> Right to clear and transparent information about the service before and after purchase
            </li>
            <li>
              <strong>No Hidden Costs:</strong> All costs must be clearly stated before you agree to purchase
            </li>
            <li>
              <strong>Unfair Terms Protection:</strong> Protection against unfair contract terms under EU consumer law
            </li>
          </ul>
        </div>

        {/* Section 11 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">11. Accessibility</h3>
          <p>
            We are committed to making our Service accessible to all users, including those with disabilities. We strive to comply with WCAG 2.1 Level AA standards and continuously work to improve accessibility features.
          </p>
        </div>

        {/* Section 12 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">12. Force Majeure</h3>
          <p>
            We shall not be liable for any failure to perform our obligations where such failure results from circumstances beyond our reasonable control, including but not limited to acts of God, war, pandemic, or failure of third-party services.
          </p>
        </div>

        {/* Section 13 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">13. Contact</h3>
          <p className="mb-3">
            If you have any questions about these Terms, please contact us:
          </p>
          <ul className="list-none space-y-2">
            <li>
              <strong>Email:</strong>{' '}
              <a href="mailto:support@prescriptionclarity.example" className="text-blue-600 dark:text-blue-400 underline">
                support@prescriptionclarity.example
              </a>
            </li>
            <li><strong>Legal inquiries:</strong> legal@prescriptionclarity.example</li>
            <li><strong>Address:</strong> [EU Office Address]</li>
          </ul>
        </div>

        {/* EU Compliance */}
        <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6 mt-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <FileText size={24} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-gray-900 dark:text-white font-medium mb-2">European & US Consumer Protection</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  These Terms comply with EU consumer protection directives, GDPR, US HIPAA regulations, and other applicable laws. Your statutory rights as a consumer are not affected by these Terms.
                </p>
              </div>
            </div>
          </div>

          {/* Acceptance */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            By using Prescription Clarity, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with any part of these Terms, please do not use our Service.
          </p>
        </div>
      </div>
    </div>
  );
}
