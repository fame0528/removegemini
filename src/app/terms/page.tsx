/**
 * Terms of Use Page
 * @fileoverview Terms of service and disclaimer
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use - RemoveGemini.com',
  description: 'Terms of service and disclaimer for RemoveGemini.com watermark removal tool',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        <h1 className="text-4xl font-bold gradient-text mb-8">Terms of Use</h1>
        
        <div className="glass p-8 rounded-2xl space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using RemoveGemini.com (the "Service"), you accept and agree to be bound by 
              the terms and provision of this agreement. If you do not agree to abide by the above, 
              please do not use this Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Use License</h2>
            <p className="mb-3">
              Permission is granted to use this Service for personal, non-commercial purposes only. 
              This license shall automatically terminate if you violate any of these restrictions.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You may not use this Service for any illegal or unauthorized purpose</li>
              <li>You may not violate any laws in your jurisdiction when using this Service</li>
              <li>You may not use this Service to infringe on intellectual property rights</li>
              <li>You may not attempt to reverse engineer or compromise the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Privacy and Data Processing</h2>
            <p className="mb-3">
              RemoveGemini.com processes all images entirely in your browser:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>No uploads:</strong> Images never leave your device</li>
              <li><strong>No storage:</strong> We do not store or collect any images</li>
              <li><strong>No tracking:</strong> We do not use analytics or tracking cookies</li>
              <li><strong>No accounts:</strong> No user data or personal information is collected</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Educational Purpose</h2>
            <p>
              This tool is provided for educational and research purposes only. Users are responsible for 
              ensuring they have the legal right to modify images they process through this Service. 
              RemoveGemini.com does not condone the removal of watermarks from copyrighted content 
              without proper authorization.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Disclaimer</h2>
            <p className="mb-3">
              The Service is provided "as is" without any warranties, expressed or implied. RemoveGemini.com 
              makes no warranties regarding:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>The accuracy, reliability, or completeness of the Service</li>
              <li>The fitness of the Service for any particular purpose</li>
              <li>The uninterrupted or error-free operation of the Service</li>
              <li>The quality of results obtained through the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
            <p>
              RemoveGemini.com shall not be held liable for any damages arising from the use or inability 
              to use this Service, including but not limited to direct, indirect, incidental, punitive, 
              and consequential damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Intellectual Property</h2>
            <p>
              Users retain all rights to images they process through this Service. RemoveGemini.com does 
              not claim any ownership of user content. The Service's source code is open-source and 
              available under the MIT License.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Third-Party Services</h2>
            <p>
              This Service may contain links to third-party websites or services. RemoveGemini.com is not 
              responsible for the content, privacy policies, or practices of any third-party sites or services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to Terms</h2>
            <p>
              RemoveGemini.com reserves the right to modify these terms at any time. Changes will be 
              effective immediately upon posting to this page. Continued use of the Service after changes 
              constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with applicable laws, without 
              regard to conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Information</h2>
            <p>
              For questions about these Terms of Use, please visit our{' '}
              <a 
                href="https://github.com/fame0528/removegemini" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                GitHub repository
              </a>.
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-700 text-sm text-gray-500">
            <p>Last Updated: January 17, 2026</p>
            <p className="mt-2">© 2026 RemoveGemini.com. All rights reserved.</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
