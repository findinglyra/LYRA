---

**LYRA Application: LLM Security Assurance Guidelines**

**Preamble:**
This document outlines security guidelines for the LLM assistant involved in the development and maintenance of the LYRA application. The primary objective is to proactively identify, mitigate, and prevent security vulnerabilities throughout the application's lifecycle. The LLM should adhere to these guidelines when generating code, suggesting architectural changes, reviewing code, or providing any development assistance.

**Core Security Principles:**

1.  **Secure by Default:** Design and implement features with security as a primary consideration from the outset.
2.  **Least Privilege:** Grant entities (users, services, functions) only the minimum permissions necessary to perform their intended functions.
3.  **Defense in Depth:** Implement multiple layers of security controls so that if one layer fails, others can still protect the application.
4.  **Input Validation & Sanitization:** Treat all input (from users, external APIs, etc.) as untrusted. Validate, sanitize, and/or encode data appropriately.
5.  **Regular Updates & Patching:** Keep all software components, libraries, and dependencies up-to-date to protect against known vulnerabilities.
6.  **Explicit Error Handling:** Implement robust error handling that does not leak sensitive information.
7.  **Confidentiality, Integrity, Availability (CIA Triad):** Strive to protect these three aspects of the application's data and services.

**I. Access Control (Ref: OWASP A01:2021 - Broken Access Control)**

1.  **Supabase Row Level Security (RLS):**
    *   **Mandate:** RLS MUST be enabled on ALL tables containing sensitive or user-specific data (e.g., `profiles`, `music_preferences`, `chats`, `matches`).
    *   **Default Deny:** Policies should start with a default deny. Explicitly grant `SELECT`, `INSERT`, `UPDATE`, `DELETE` permissions.
    *   **Ownership & Roles:**
        *   Users should only be able to read/modify their own data unless explicitly required for a feature (e.g., viewing a match's public profile).
        *   `auth.uid()` is the primary mechanism for checking ownership.
        *   Example: `CREATE POLICY "Users can read their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);`
    *   **Contextual Access:** For features like matching, design RLS policies that allow reading *limited, non-sensitive* data of other users based on specific conditions (e.g., user has a complete profile, is part of a match).
    *   **Review:** LLM should proactively review existing RLS policies for correctness and completeness, especially when new tables or data access patterns are introduced.
        *   *Self-check for LLM:* "Does this RLS policy grant the absolute minimum necessary access for the intended functionality?"
2.  **Supabase Edge Functions:**
    *   **Authentication:** Edge Functions that perform sensitive operations or access user data MUST verify the JWT of the calling user.
    *   **Authorization:** Within the Edge Function, after authenticating, verify if the authenticated user has the permission to perform the requested action or access the requested resource.
    *   **Input Validation:** Rigorously validate all inputs to Edge Functions.
3.  **Client-Side Route Protection:**
    *   While server-side (RLS, Edge Function auth) is paramount, client-side routing (e.g., using `AuthContext` and `enforceAuthRouting`) should prevent users from accessing views they are not authorized for based on their authentication and profile completion status. This is a UX enhancement, not the primary security boundary.

**II. Cryptographic Failures (Ref: OWASP A02:2021)**

1.  **Data in Transit:**
    *   Supabase client libraries use HTTPS by default. Ensure all custom API calls or connections to external services also use HTTPS.
2.  **Data at Rest:**
    *   Supabase handles database-level encryption.
    *   **Sensitive Data:** Avoid storing highly sensitive data (e.g., raw payment information) if possible. If necessary, consult on appropriate encryption mechanisms before storage.
    *   **Client-Side Storage:** Do not store sensitive data (API keys, full JWTs long-term, user secrets) in unencrypted client-side storage (e.g., AsyncStorage). Use `Expo SecureStore` or equivalent for any sensitive client-side persistence.
3.  **API Keys & Secrets:**
    *   `SUPABASE_ANON_KEY` is public and can be embedded in the client.
    *   `SUPABASE_SERVICE_ROLE_KEY` and `SENDGRID_API_KEY` MUST NEVER be exposed in client-side code or committed to the repository.
    *   Utilize environment variables for these keys:
        *   For Supabase Edge Functions: Set them as environment variables in the Supabase dashboard.
        *   For local development: Use `.env` files (and ensure `.env` is in `.gitignore`).
        *   For build processes/CI/CD: Use secure secret management provided by the CI/CD platform.
    *   *Self-check for LLM:* "Am I suggesting code that might expose a secret key?"

**III. Injection (Ref: OWASP A03:2021)**

1.  **SQL Injection:**
    *   Supabase client libraries (e.g., `supabase-js`) use parameterized queries or an ORM-like interface, which significantly mitigates SQL injection risks for standard database operations.
    *   **Edge Functions:** If constructing SQL queries manually within Edge Functions (e.g., using a direct Postgres connection or dynamic query builders), ALL user-supplied input MUST be parameterized or properly sanitized using established library functions. Avoid string concatenation to build queries with user input.
2.  **Cross-Site Scripting (XSS) - React Native Context:**
    *   React Native's architecture makes traditional web XSS less common. However, vulnerabilities can arise:
        *   If rendering HTML content directly within a `WebView` from an untrusted source. Sanitize such HTML.
        *   If dynamically constructing component properties from user input without sanitization, though React generally handles this well.
    *   *Self-check for LLM:* "Is any user-controlled data being rendered in a way that could be interpreted as executable code or markup?"
3.  **Command Injection (Edge Functions):**
    *   If Edge Functions execute system commands (less common), ensure user input is never directly part of the command string. Use safe APIs that handle argument separation.

**IV. Insecure Design (Ref: OWASP A04:2021)**

1.  **Threat Modeling:** When proposing new features or significant changes, the LLM should briefly consider potential threats and how the design addresses them.
2.  **Secure Defaults:** Prioritize configurations and designs that are secure by default.
3.  **Trust Boundaries:** Clearly define trust boundaries (e.g., client is untrusted, Supabase backend is trusted, Edge Functions are a controlled server environment).
4.  **Session Management (Supabase Auth):**
    *   Rely on Supabase Auth for secure session management (JWT handling, refresh tokens).
    *   Ensure secure logout (token invalidation where possible, client-side cleanup).
    *   The `AuthContext.tsx` logic for session handling and `onAuthStateChange` is critical. Review for robustness.

**V. Security Misconfiguration (Ref: OWASP A05:2021)**

1.  **Supabase Configuration:**
    *   **RLS:** (Re-iterated for importance) Ensure RLS is not accidentally disabled or overly permissive.
    *   **Email Templates:** Ensure confirmation/reset email templates do not have vulnerabilities (e.g., open redirects if links are constructed dynamically from user input, though Supabase handles this well with `site_url`).
    *   **Third-Party Integrations (SendGrid):** Securely configure SMTP settings. Use strong, unique API keys.
    *   **Storage Buckets:** Configure Supabase Storage bucket policies correctly (public vs. private, access controls via RLS if possible or signed URLs).
2.  **Cloud Services (General):** If other cloud services are integrated, ensure they are configured with security best practices (e.g., IAM roles, network security groups).
3.  **Error Messages:** Configure the application to show generic error messages to users in production, while logging detailed errors server-side. Avoid leaking stack traces or sensitive system information.

**VI. Vulnerable and Outdated Components (Ref: OWASP A06:2021)**

1.  **Dependency Management:**
    *   Regularly review and update dependencies (React Native, Expo, Supabase SDK, Zustand, UI libraries, Node.js for Edge Functions).
    *   *Instruction for LLM:* "When suggesting a new library or updating existing ones, briefly check for known critical CVEs associated with that version or library. Prioritize stable and well-maintained libraries."
    *   Utilize tools like `npm audit` or GitHub Dependabot alerts.
2.  **CVE Monitoring:** The development team (including LLM assistance) should be aware of mechanisms to monitor CVEs for key components.

**VII. Identification and Authentication Failures (Ref: OWASP A07:2021)**

1.  **Supabase Auth:** Leverage Supabase Auth features:
    *   **Strong Password Policies:** Encourage users to use strong passwords (client-side hints, Supabase may have server-side checks).
    *   **Email Confirmation:** Ensure this is enabled and working correctly (as per user's current focus).
    *   **Password Reset:** Secure password reset mechanism.
    *   **Multi-Factor Authentication (MFA):** Consider enabling/offering MFA options provided by Supabase Auth for enhanced security.
    *   **Rate Limiting:** Supabase provides rate limiting for auth endpoints. Be aware of these limits.
2.  **JWT Handling:**
    *   Store JWTs securely on the client (e.g., in memory, `Expo SecureStore` for refresh tokens if persisted).
    *   Transmit JWTs via Authorization headers.

**VIII. Software and Data Integrity Failures (Ref: OWASP A08:2021)**

1.  **Input Validation:**
    *   Validate all data received from the client (in Edge Functions, before database insertion/updates via RLS `WITH CHECK` options).
    *   Validate data types, formats, lengths, ranges.
    *   The `CreateProfile.tsx` validation logic is a good example; apply similar rigor elsewhere.
2.  **Data Integrity (RLS):** Use RLS `WITH CHECK` options on `INSERT` and `UPDATE` policies to ensure data consistency and prevent unauthorized modifications.
3.  **Secure CI/CD:** If a CI/CD pipeline is used, ensure it's secured to prevent unauthorized code injection or tampering with build artifacts.

**IX. Security Logging and Monitoring Failures (Ref: OWASP A09:2021)**

1.  **Supabase Logs:** Utilize Supabase's built-in logging for auth events, database queries, and Edge Function executions.
2.  **Application Logging:**
    *   Implement structured logging within Edge Functions for security-relevant events (e.g., failed login attempts if custom logic is added, access to sensitive resources, significant errors).
    *   Avoid logging sensitive data (passwords, API keys, full PII) in logs.
3.  **Alerting:** Consider setting up alerts for critical security events or anomalies (e.g., high rate of failed logins, RLS violations if logged by Supabase).

**X. Server-Side Request Forgery (SSRF) (Ref: OWASP A10:2021)**

1.  **Edge Functions:** If Edge Functions make HTTP requests to URLs derived from user input:
    *   Validate that the URL points to an expected and trusted domain/IP address.
    *   Use an allow-list of permitted domains/protocols if possible.
    *   Be cautious about how responses from these requests are handled.

**XI. Specific LYRA Application Considerations:**

1.  **Music Preferences & Matching Logic:**
    *   Ensure RLS policies for `music_preferences` and any tables involved in matching prevent users from accessing or inferring more data than they are permitted to see about others.
    *   The "Harmony Score" calculation, if done server-side (e.g., Edge Function), must operate on authorized data only.
2.  **Chat Functionality:**
    *   RLS must strictly control who can read/write to chat channels/messages. Users should only access chats they are participants in.
3.  **Third-Party Data (Soundscape Discoveries, Trending Resonances):**
    *   If fetching data from external APIs (Reddit, X, Music APIs), ensure requests are made securely (HTTPS, API key management).
    *   Sanitize or carefully render any content received from these external sources to prevent injection if displayed in WebViews or rich text components.

**LLM Operational Guidelines:**

*   **Proactive Suggestions:** When assisting with code, if you identify a potential security weakness based on these guidelines, proactively highlight it and suggest a more secure alternative, even if not explicitly asked.
*   **Contextual Awareness:** Refer to existing memories (like RLS policies, auth flow in `AuthContext.tsx`) to ensure suggestions are consistent and build upon existing secure practices.
*   **Prioritize Security:** If a user request conflicts with a security best practice, explain the risk and propose a secure way to achieve the user's goal.
*   **Stay Updated:** While your knowledge is based on your training data, be open to incorporating new security information or CVE details if provided by the user or through system updates.

---
