import { Shield, ArrowLeft } from 'lucide-react';

interface PrivacyProps {
  darkMode: boolean;
  setCurrentPage?: (page: string) => void;
}

export default function Privacy({ darkMode, setCurrentPage }: PrivacyProps) {
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
          <Shield size={28} />
          <h1 className="text-white">Privacy Policy</h1>
        </div>
        <p className="text-sm text-blue-100 dark:text-blue-200">
          Last updated: November 1, 2025
        </p>
      </div>

      <div className="px-6 py-6 space-y-6 text-gray-700 dark:text-gray-300">
        {/* Introduction */}
        <div>
          <h2 className="text-gray-900 dark:text-white mb-3">Protection of Your Data</h2>
          <p className="mb-3">
            Prescription Clarity ("we", "our", or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our medication tracking application.
          </p>
          <p>
            This policy is designed to comply with the General Data Protection Regulation (GDPR), Health Insurance Portability and Accountability Act (HIPAA), and other applicable data protection laws.
          </p>
        </div>

        {/* Section 1 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">1. Data We Collect</h3>
          <p className="mb-2">We collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Personal Information:</strong> Name, email address, date of birth, and profile picture (optional)
            </li>
            <li>
              <strong>Health Information:</strong> Medication names, dosages, schedules, adherence records, and meal times
            </li>
            <li>
              <strong>Usage Data:</strong> App interactions, notification preferences, and device information
            </li>
            <li>
              <strong>Shared Access:</strong> Information about caregivers and doctors you've granted access to
            </li>
          </ul>
        </div>

        {/* Section 2 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">2. Use of Your Data</h3>
          <p className="mb-2">We use your data for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and maintain our medication tracking services</li>
            <li>To send medication reminders and notifications</li>
            <li>To generate adherence reports and printable schedules</li>
            <li>To enable sharing features with caregivers and healthcare providers</li>
            <li>To improve our services and develop new features</li>
            <li>To communicate with you about updates and support</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">3. Legal Basis for Processing</h3>
          <p className="mb-2">Under GDPR, we process your data based on:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Consent:</strong> You have given clear consent for us to process your personal data for specific purposes
            </li>
            <li>
              <strong>Legitimate Interests:</strong> Processing is necessary for our legitimate interests in providing and improving our services
            </li>
            <li>
              <strong>Vital Interests:</strong> Processing is necessary to protect your vital interests in managing your medication
            </li>
          </ul>
        </div>

        {/* Section 4 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">4. Your Rights</h3>
          <p className="mb-2">Under GDPR, you have the following rights:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Right to Access:</strong> Request a copy of your personal data
            </li>
            <li>
              <strong>Right to Rectification:</strong> Request correction of inaccurate data
            </li>
            <li>
              <strong>Right to Erasure:</strong> Request deletion of your data ("right to be forgotten")
            </li>
            <li>
              <strong>Right to Restriction:</strong> Request limitation of data processing
            </li>
            <li>
              <strong>Right to Data Portability:</strong> Receive your data in a structured, commonly used format
            </li>
            <li>
              <strong>Right to Object:</strong> Object to processing of your data
            </li>
            <li>
              <strong>Right to Withdraw Consent:</strong> Withdraw consent at any time
            </li>
          </ul>
          <p className="mt-3">
            To exercise these rights, please contact us at{' '}
            <a href="mailto:privacy@prescriptionclarity.example" className="text-blue-600 dark:text-blue-400 underline">
              privacy@prescriptionclarity.example
            </a>
          </p>
        </div>

        {/* Section 5 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">5. Data Storage and Security</h3>
          <p className="mb-2">
            We implement appropriate technical and organizational measures to protect your data:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Data is encrypted in transit and at rest using industry-standard encryption</li>
            <li>Access to personal data is restricted to authorized personnel only</li>
            <li>Regular security audits and updates are performed</li>
            <li>Data is stored on secure servers in the European Union</li>
            <li>We retain your data only for as long as necessary to provide our services</li>
          </ul>
        </div>

        {/* Section 6 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">6. Data Sharing</h3>
          <p className="mb-2">
            We do not sell your personal data. We may share your data only in the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>With caregivers and healthcare providers you've explicitly authorized</li>
            <li>With service providers who assist in operating our app (under strict confidentiality agreements)</li>
            <li>When required by law or to protect our legal rights</li>
            <li>In the event of a merger or acquisition (you will be notified in advance)</li>
          </ul>
        </div>

        {/* Section 7 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">7. International Data Transfers</h3>
          <p>
            If we transfer your data outside the European Economic Area (EEA), we ensure adequate safeguards are in place, such as Standard Contractual Clauses approved by the European Commission.
          </p>
        </div>

        {/* Section 8 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">8. Children's Privacy</h3>
          <p>
            Our service is not intended for children under 16. We do not knowingly collect personal data from children under 16. If you are a parent or guardian and believe your child has provided us with personal data, please contact us.
          </p>
        </div>

        {/* Section 9 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">9. Changes to This Policy</h3>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </div>

        {/* Section 10 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">10. Cookie Policy</h3>
          <p className="mb-3">
            We use only essential cookies and local storage necessary for the application to function properly. We do not use tracking cookies or analytics without your explicit consent.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Essential cookies:</strong> Required for authentication and session management</li>
            <li><strong>Preference cookies:</strong> Store your settings (theme, language, meal times)</li>
            <li><strong>Optional analytics:</strong> Only with your explicit consent, can be disabled at any time</li>
          </ul>
        </div>

        {/* Section 11 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">11. Data Breach Notification</h3>
          <p>
            In the event of a data breach that is likely to result in a risk to your rights and freedoms, we will notify you and the relevant supervisory authority within 72 hours of becoming aware of the breach, as required by GDPR Article 33.
          </p>
        </div>

        {/* Section 12 */}
        <div>
          <h3 className="text-gray-900 dark:text-white mb-3">12. Contact & Complaints</h3>
          <p className="mb-3">
            If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
          </p>
          <ul className="list-none space-y-2 mb-4">
            <li>
              <strong>Email:</strong>{' '}
              <a href="mailto:privacy@prescriptionclarity.example" className="text-blue-600 dark:text-blue-400 underline">
                privacy@prescriptionclarity.example
              </a>
            </li>
            <li><strong>Data Protection Officer:</strong> dpo@prescriptionclarity.example</li>
            <li><strong>Address:</strong> [EU Office Address]</li>
          </ul>
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-r-lg">
            <p className="text-gray-900 dark:text-white font-medium mb-2">
              Right to Lodge a Complaint
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              You have the right to lodge a complaint with a supervisory authority, in particular in the EU member state of your habitual residence, place of work, or place of the alleged infringement if you believe we have not complied with data protection laws.
            </p>
          </div>
        </div>

        {/* GDPR & HIPAA Compliance Statement */}
        <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6 mt-6">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Shield size={24} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-gray-900 dark:text-white font-medium mb-2">GDPR & HIPAA Compliance</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  This Privacy Policy is compliant with the General Data Protection Regulation (EU) 2016/679, Health Insurance Portability and Accountability Act (HIPAA), and other applicable data protection laws. We are committed to protecting your privacy and ensuring transparent data processing practices for both EU and US healthcare standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
