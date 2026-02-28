
export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-content">
          <div className="legal-header">
            <h1>Privacy Policy</h1>
            <p className="last-updated">Last updated: February 28, 2026</p>
          </div>

          <div className="legal-sections">
            <section className="section">
              <h2>1. Introduction</h2>
              <p>
                Welcome to The Mustard Seed ("the Application," "we," "us," or "our"). We are committed to protecting your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application, including all related services.
              </p>
              <p>
                Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our application.
              </p>
            </section>

            <section className="section">
              <h2>2. Information We Collect</h2>
              <h3>2.1 Information You Provide Directly</h3>
              <ul>
                <li><strong>Authentication Information:</strong> When you sign up or log in, we collect your email address, name, and password (encrypted). If you use Google OAuth, we receive your Google account information including email, profile picture, and basic profile data.</li>
                <li><strong>Chat Messages:</strong> All messages you send in the chat feature are stored in our Firebase Firestore database to enable chat history functionality.</li>
                <li><strong>Saved Notes:</strong> Any notes or responses you choose to save are stored securely in your user profile.</li>
                <li><strong>Profile Information:</strong> Your display name, profile picture, and preferences (such as theme selection) are collected.</li>
              </ul>

              <h3>2.2 Information Collected Automatically</h3>
              <ul>
                <li><strong>Device Information:</strong> We may collect information about your device, including device model, operating system, and device identifiers.</li>
                <li><strong>Usage Data:</strong> We track interactions with our application, including pages visited, features used, and time spent on the platform.</li>
                <li><strong>IP Address:</strong> Your IP address is collected to provide services, prevent abuse, and analyze usage patterns.</li>
                <li><strong>Cookies and Tracking Technologies:</strong> We use cookies and similar technologies to remember preferences and improve user experience.</li>
              </ul>

              <h3>2.3 Information from Third Parties</h3>
              <ul>
                <li><strong>Google OAuth:</strong> When you authenticate via Google, we receive information Google shares with us based on your Google account settings.</li>
                <li><strong>Firebase Analytics:</strong> We may use Firebase Analytics to collect non-personally identifiable usage data.</li>
              </ul>
            </section>

            <section className="section">
              <h2>3. How We Use Your Information</h2>
              <p>We use the information we collect for the following purposes:</p>
              <ul>
                <li><strong>Service Delivery:</strong> To provide, maintain, and improve our application and services</li>
                <li><strong>Authentication:</strong> To authenticate your identity and manage your account</li>
                <li><strong>Personalization:</strong> To customize your experience and remember your preferences</li>
                <li><strong>Communication:</strong> To send you service-related announcements and customer support messages</li>
                <li><strong>Analytics:</strong> To understand user behavior and improve our platform</li>
                <li><strong>Security:</strong> To detect and prevent fraud, abuse, and other harmful activities</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
              </ul>
            </section>

            <section className="section">
              <h2>4. Data Storage and Security</h2>
              <p>
                Your data is stored securely in Google Firebase, which uses industry-standard encryption and security measures. We implement administrative, technical, and physical safeguards to protect your information against unauthorized access, alteration, and destruction.
              </p>
              <ul>
                <li>Sensitive information (passwords) are encrypted using bcrypt</li>
                <li>Data transmission uses HTTPS/SSL encryption</li>
                <li>Firebase provides secure authentication and authorization controls</li>
                <li>Access to data is restricted to authorized personnel only</li>
              </ul>
              <p>
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="section">
              <h2>5. Data Retention</h2>
              <p>
                We retain your personal data for as long as your account is active or as needed to provide our services. You may request deletion of your account and associated data at any time by contacting us. Upon account deletion, we will remove your personal data from our systems within 30 days, except where retention is required by law.
              </p>
            </section>

            <section className="section">
              <h2>6. Sharing of Information</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul>
                <li><strong>Service Providers:</strong> We share information with Firebase and Google Cloud to provide our services</li>
                <li><strong>Legal Compliance:</strong> We may disclose information if required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> If The Mustard Seed is acquired or merged, your information may be transferred as part of that transaction</li>
                <li><strong>With Your Consent:</strong> We share information when you explicitly agree to sharing</li>
              </ul>
            </section>

            <section className="section">
              <h2>7. User Rights and Choices</h2>
              <h3>7.1 Access and Portability</h3>
              <p>You have the right to access the personal data we hold about you and request a copy of it.</p>

              <h3>7.2 Correction and Deletion</h3>
              <p>You may update, correct, or request deletion of your personal data at any time through your account settings or by contacting us.</p>

              <h3>7.3 Cookie Management</h3>
              <p>You can control cookie settings through your browser preferences. Note that disabling cookies may affect some application features.</p>

              <h3>7.4 Marketing Communications</h3>
              <p>If we send you marketing emails, you can unsubscribe by clicking the "unsubscribe" link in the email or adjusting your preferences.</p>
            </section>

            <section className="section">
              <h2>8. Children's Privacy</h2>
              <p>
                The Mustard Seed is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information immediately and terminate the child's account.
              </p>
              <p>
                For users between 13-18, parents or guardians may contact us to review, update, or delete information about their child.
              </p>
            </section>

            <section className="section">
              <h2>9. Third-Party Links</h2>
              <p>
                Our application may contain links to third-party websites and services that are not operated by us. This Privacy Policy applies only to our application. We are not responsible for the privacy practices of third-party websites and services. We encourage you to review the privacy policies of any third parties before sharing your information.
              </p>
            </section>

            <section className="section">
              <h2>10. International Data Transfers</h2>
              <p>
                Your information may be transferred to, and maintained in, computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ. By using our application, you consent to such transfers.
              </p>
            </section>

            <section className="section">
              <h2>11. Your Privacy Rights by Jurisdiction</h2>
              <h3>11.1 Uganda (Data Protection and Privacy Act, 2019)</h3>
              <p>
                If you are a resident of Uganda, you have the following rights under the Data Protection and Privacy Act, 2019:
              </p>
              <ul>
                <li>Right to access your personal data</li>
                <li>Right to correct inaccurate data</li>
                <li>Right to erasure ("right to be forgotten")</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to lodge complaints with the Data Protection Commissioner</li>
              </ul>

              <h3>11.2 GDPR (European Users)</h3>
              <p>
                If you are located in the European Union, additional rights apply under GDPR, including the right to withdraw consent and the right to object to processing.
              </p>

              <h3>11.3 CCPA (California Residents)</h3>
              <p>
                If you are a California resident, you have the right to know what personal information is collected, used, shared, or sold, and have the right to delete, opt-out of sales, and non-discrimination.
              </p>
            </section>

            <section className="section">
              <h2>12. Data Breach Notification</h2>
              <p>
                In the event of a data breach that compromises your personal information, we will notify you and relevant authorities within the timeframe required by applicable law (typically 30-72 hours).
              </p>
            </section>

            <section className="section">
              <h2>13. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. The "Last updated" date at the top of this policy indicates when it was last revised. Your continued use of the application after any modifications indicates your acceptance of the updated Privacy Policy. We encourage you to review this policy periodically.
              </p>
            </section>

            <section className="section">
              <h2>14. Contact Us</h2>
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="contact-info">
                <p><strong>The Mustard Seed</strong></p>
                <p>Email: privacy@themustardseed.app</p>
                <p>Support: support@themustardseed.app</p>
              </div>
              <p>
                We will respond to your inquiry within 30 days.
              </p>
            </section>
          </div>
        </div>
      </div>

      <style jsx>{`
        .legal-page {
          min-height: 100vh;
          padding: 2rem 1rem;
        }

        body.organic .legal-page {
          background: var(--organic-bg-primary);
          color: var(--organic-text);
        }

        body.brutalist .legal-page {
          background: var(--brutalist-bg);
          color: var(--brutalist-text);
        }

        .legal-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .legal-content {
          padding: 0 2rem;
        }

        .legal-header {
          margin-bottom: 3rem;
          text-align: center;
        }

        .legal-header h1 {
          font-size: 3rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          font-family: 'Crimson Pro', serif;
        }

        body.organic .legal-header h1 {
          color: var(--organic-accent);
        }

        body.brutalist .legal-header h1 {
          color: var(--brutalist-text);
          font-family: 'Archivo Black', sans-serif;
        }

        .last-updated {
          margin: 0;
          opacity: 0.7;
          font-size: 1rem;
        }

        .legal-sections {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .section {
          line-height: 1.8;
        }

        .section h2 {
          font-size: 1.8rem;
          font-weight: 600;
          margin: 0 0 1.2rem 0;
          font-family: 'Crimson Pro', serif;
        }

        body.organic .section h2 {
          color: var(--organic-accent);
        }

        body.brutalist .section h2 {
          color: var(--brutalist-text);
          font-family: 'Archivo Black', sans-serif;
          font-size: 1.6rem;
        }

        .section h3 {
          font-size: 1.2rem;
          font-weight: 600;
          margin: 1.5rem 0 0.8rem 0;
        }

        body.organic .section h3 {
          color: var(--organic-text);
        }

        body.brutalist .section h3 {
          color: var(--brutalist-text);
          font-family: 'Bebas Neue', sans-serif;
        }

        .section p {
          margin: 0 0 1rem 0;
          font-size: 1.05rem;
        }

        .section ul {
          margin: 1rem 0;
          padding-left: 2rem;
          list-style-position: outside;
        }

        .section li {
          margin-bottom: 0.8rem;
          line-height: 1.6;
        }

        .section li strong {
          font-weight: 600;
        }

        body.organic .section li strong {
          color: var(--organic-accent-soft);
        }

        body.brutalist .section li strong {
          color: var(--brutalist-accent);
          font-family: 'Bebas Neue', sans-serif;
        }

        .contact-info {
          padding: 1.5rem;
          border-radius: 8px;
          margin: 1.5rem 0;
        }

        body.organic .contact-info {
          background: var(--organic-card-bg);
          border: 1px solid var(--organic-border);
        }

        body.brutalist .contact-info {
          background: var(--brutalist-bg);
          border: 2px solid var(--brutalist-text);
          border-radius: 0;
        }

        .contact-info p {
          margin: 0.5rem 0;
        }

        @media (max-width: 768px) {
          .legal-content {
            padding: 0;
          }

          .legal-header h1 {
            font-size: 2.2rem;
          }

          .section h2 {
            font-size: 1.5rem;
          }

          .section p {
            font-size: 1rem;
          }

          .section ul {
            padding-left: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
