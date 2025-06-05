Plan for LLM to Generate Findinglyra (Scratch to Production)
This plan guides an advanced LLM (like GPT-4 or a successor) to assist in generating artifacts, code, and documentation for Findinglyra. The LLM acts as a highly skilled, very fast pair programmer and technical writer. Human oversight and expertise are critical at every step.
Phase 0: Foundation & Detailed Planning (1-2 Weeks)
Goal: Establish detailed requirements, architecture, and project structure.
LLM Role: Content generation, research, boilerplate.
Prompt LLM: Detailed Feature Breakdown & User Stories
"For each core feature of Findinglyra (list them), generate detailed user stories in the format: 'As a [user type], I want to [action] so that [benefit].' Include acceptance criteria for each."
Prompt LLM: UI/UX Wireframe & Mockup Concepts
"Generate textual descriptions or ASCII art for wireframes of the following Findinglyra screens: Onboarding (Music Connect, Manual Account), Sign In, Profile Creation (Basic, Music Prefs), Match Page, Chat, User Profile (viewing others), Soundscape (basic concept). Emphasize music elements."
"Suggest a color palette and typography suitable for a modern, vibrant, music-focused dating app."
Prompt LLM: Supabase Data Schema Design
"Design a PostgreSQL schema for Findinglyra using Supabase. Include tables for users, profiles, music_preferences (genres, artists, eras), user_music_history (linked to streaming data), matches, chat_messages, concert_interests, soundscape_pins, collaborative_playlists. Define relationships, primary/foreign keys, and suggested RLS policies for basic security (e.g., users can only update their own profile)."
"Generate SQL DDL statements for the above schema."
Prompt LLM: Project Structure & Initial Setup
"Generate a recommended directory structure for a React Native project using Zustand for state management and Supabase for backend. Include folders for screens, components, services (API calls), state (Zustand stores), assets, utils."
"Generate a basic package.json with core dependencies: react, react-native, zustand, @supabase/supabase-js, react-native-vector-icons, react-navigation, and any relevant libraries for music API integration (e.g., react-native-spotify-remote)."
Prompt LLM: API Integration Plan
"Outline the steps and key Supabase Edge Functions needed to integrate with Spotify API and Apple Music API for user authentication, fetching top artists/tracks, and recent listening history. What scopes are needed?"
"Research and list potential Node.js libraries for interacting with Spotify and Apple Music APIs from Supabase Edge Functions."
Phase 1: MVP Development - Core Functionality (6-8 Weeks)
Goal: Functional app with user registration, profile creation, music preference input, basic matching, and match display.
LLM Role: Code generation for components, functions, and basic logic.
Prompt LLM: Auth Implementation (Supabase + Zustand)
"Generate React Native code for user registration (email/password) and sign-in screens using Supabase Auth. Implement a Zustand store to manage authentication state (user, session, loading, error) and persist session."
"Generate code for OAuth integration with Google and Apple using Supabase Auth in React Native."
Prompt LLM: Profile Creation Screens
"Generate React Native components for:
Basic Profile Form (fields: name, age, gender, orientation, location, photo upload to Supabase Storage, bio). Include form validation.
Music Preferences Form (fields: connect Spotify/Apple Music button, manual selection for genres, artists, eras).
On submit, data should be sent to respective Supabase tables."
Prompt LLM: Supabase Backend Logic (Basic)
"Generate Supabase Edge Function (TypeScript/JavaScript) stubs for:
create_user_profile: Called after signup to initialize profile.
update_user_profile: To update basic and music preferences.
get_user_profile: To fetch a user's profile."
"Write RLS policies for the profiles and music_preferences tables ensuring users can only read relevant public data and write to their own."
Prompt LLM: Basic Matching Algorithm & Display
"Design a simple matching algorithm (SQL query or Edge Function logic) for Supabase that matches users based on 1-2 shared favorite genres and location proximity. This is for MVP; complexity will be added later."
"Generate a React Native component for the 'Match Page' that fetches and displays a list of matched profiles (Photo, Name, Age, Key Music Tag) in a swipeable card format (like Tinder/Hinge). Use Zustand for managing matched user data."
Prompt LLM: Basic User Profile View
"Generate a React Native component to display another user's profile, showing their photo, bio, and top 3 favorite genres/artists."
Phase 2: Enhancing Engagement - Core Music Features (8-10 Weeks)
Goal: Implement Harmony Score, Music Sharing, Musical Journey Timeline, and Chat.
LLM Role: Algorithm logic, component generation, API integration snippets.
Prompt LLM: Harmony Score Implementation
"Outline the logic for a Supabase Edge Function to calculate a 'Harmony Score' between two users. Consider shared genres (weighted), shared artists (weighted), and listening history overlap (if available). The function should take two user IDs and return a score (0-100)."
"Generate JavaScript/TypeScript code for this Edge Function stub."
"Update the React Native user profile view and match card components to display the Harmony Score."
Prompt LLM: Music Sharing in Chat
"Generate React Native components for a chat interface using Supabase Realtime for messages. Include functionality to:
Fetch and display chat history.
Send/receive text messages.
(Stub) A button to 'Share Music' (integration with Spotify/Apple Music SDKs to pick a track/playlist will be manual implementation later)."
Prompt LLM: Musical Journey Timeline (Basic)
"Generate a React Native component to display a simplified 'Musical Journey Timeline'. Assume data structure like [{year: 2020, top_artist: 'Artist A', top_genre: 'Genre X'}]. Visualize this as a vertical list."
Prompt LLM: Collaborative Playlists (Concept & Stubs)
"Outline the Supabase schema changes for 'Collaborative Playlists' (playlist metadata, tracks, contributors)."
"Generate React Native component stubs for creating a collaborative playlist with another user and adding songs (manually input song title/artist for now)."
Phase 3: Advanced & Differentiating Features (10-12 Weeks)
Goal: Implement Soundscape (MVP), Real-time Listening, Concert Buddy, Local Scene.
LLM Role: Research library options, generate complex component structures, API integration patterns.
Prompt LLM: Soundscape (MVP - 2D Map)
"Suggest React Native libraries for 2D map display and marker pinning (e.g., react-native-maps)."
"Generate a React Native component for a 'Soundscape' screen:
Displays a map centered on user's location.
Allows users to tap-and-hold to 'pin' a playlist (manually enter playlist name/description for now). Pins are stored in Supabase with geo-coordinates.
Displays existing pins from other users. Tapping a pin shows playlist info."
Prompt LLM: Real-time Listening Partner (Sync Logic)
"Outline the Supabase Realtime events needed to synchronize music playback between two users (e.g., PLAY, PAUSE, SEEK, TRACK_CHANGE). Describe the payload for each event."
"Generate React Native component stubs for a 'Listening Party' screen, showing current track info and playback controls that publish/subscribe to these Supabase Realtime events." (Actual music playback SDK integration will be manual).
Prompt LLM: Concert Buddy & Local Scene (API Integration)
"Generate Supabase Edge Function stubs to fetch concert/event data from Songkick or Bandsintown API based on user location and preferred artists."
"Generate React Native components to:
List upcoming local concerts relevant to the user.
Allow users to mark 'interested' or 'attending' for events.
Show other Findinglyra users interested in the same event."
Phase 4: Polish, Testing, Scaling & Launch Prep (4-6 Weeks)
Goal: Refine UI/UX, comprehensive testing, performance optimization, prepare for deployment.
LLM Role: Generate test cases, documentation, optimization suggestions.
Prompt LLM: UI/UX Polish & Accessibility
"Review the previously generated component descriptions. Suggest improvements for UI consistency, visual appeal, and adherence to mobile design best practices (iOS Human Interface Guidelines, Android Material Design)."
"For key screens (Profile, Match, Chat), suggest accessibility improvements (e.g., ARIA labels for React Native, touch target sizes)."
Prompt LLM: Test Case Generation
"For features like Auth, Profile Creation, Harmony Score calculation, and Chat, generate a list of unit test cases, integration test cases, and end-to-end (E2E) test scenarios."
"Suggest Jest/React Native Testing Library setup for unit/integration tests."
Prompt LLM: Performance & Security Review
"Based on the planned architecture, list potential performance bottlenecks in React Native and Supabase (e.g., large lists, frequent API calls, complex queries). Suggest optimization strategies for each."
"List common security vulnerabilities for a mobile app using Supabase and suggest mitigation techniques (focus on RLS, input validation, secure Edge Function practices)."
Prompt LLM: Documentation & Deployment
"Generate a template for API documentation for the Supabase Edge Functions."
"Outline a CI/CD pipeline setup using GitHub Actions for a React Native app deploying to Expo Application Services (EAS) or directly to app stores."
"Generate a draft for App Store and Google Play Store listing text, focusing on Findinglyra's unique selling points."
Post-Launch: Iteration & Growth (Ongoing)
Goal: Monitor, analyze feedback, iterate on features, grow user base.
LLM Role: Analyze text data, suggest A/B tests, research new tech.
Prompt LLM: User Feedback Analysis
"Given a sample set of (mock) user feedback reviews, identify common themes, feature requests, and pain points."
Prompt LLM: A/B Testing Ideas
"Suggest A/B test ideas for improving user engagement or conversion rates (e.g., different Harmony Score presentations, alternative onboarding flows)."
Prompt LLM: Future Feature Ideation
- **Implement ML-Powered User Recommendations (Two-Tower Model Integration)**
  - **Objective:** Enhance user matching by integrating the planned two-tower ML model to provide 10 personalized recommendations.
  - **Phase 1 (Current - Dummy Data & Infrastructure):**
    - Design and implement the UI components to display a list of 10 recommended user profiles (e.g., in a new "Matches" or "Recommendations" screen).
    - Create a client-side service/function (e.g., in a new `services/recommendationService.ts` or similar) responsible for fetching user recommendations.
    - Initially, this service will return dummy match data. This could be a hardcoded list of 10 placeholder user profile objects, or a function that simulates fetching data. This ensures the UI and app flow can be fully tested.
    - Ensure robust error handling (e.g., if dummy data fails to load, or later, if the API call fails) and clear loading states for the recommendation display.
  - **Phase 2 (Future - Live Model Integration):**
    - Once the ML model is trained, hosted, and the API URL is provided:
      - Update the recommendation service to make an authenticated API call to the external ML model endpoint.
      - The request to the model API will likely include the current user's ID (so the model can fetch their features) or the user's features directly.
      - The model API is expected to return a list of ~10 recommended user IDs and/or their pre-computed similarity scores.
      - If only user IDs are returned, the client-side service will then need to fetch the full profile details for these recommended users from your Supabase `profiles` table to display them.
      - Replace the dummy data logic entirely with the live data fetched from the model.
      - Implement appropriate caching strategies for recommendations if the model's suggestions don't need to be real-time for every single view.
"Based on current music tech trends, suggest 2-3 innovative new features that could be added to Findinglyra in the future."
Important Considerations for LLM Usage:
Iterative Prompts: Break down complex requests. Provide context from previous LLM outputs.
Human Review: ALL LLM-generated code, designs, and documentation MUST be reviewed and validated by experienced human developers/designers. The LLM is an accelerator, not a replacement for expertise.
Specificity: The more specific the prompt, the better the output.
Security: Be cautious about sharing sensitive IP or keys with the LLM. Use placeholders.
LLM Limitations: The LLM won't "understand" nuance perfectly. It might generate plausible but incorrect or inefficient code. It cannot perform actual debugging or testing.






LLM, create our main project folder:
"Make a new folder on your computer. Call it findinglyra_app."
LLM, set up React Native:
"Inside findinglyra_app, I need you to use your magic 'React Native installer' to create a new React Native project. Call the project findinglyra."
(LLM would translate this to npx react-native init findinglyra or similar Expo command)
LLM, add our special tools (dependencies):
"Go into the findinglyra folder."
"We need some special LEGO bricks. Add these to our box using your 'package manager' tool (like npm or yarn):"
@supabase/supabase-js (for talking to our magic data cloud)
zustand (for remembering things across the app)
react-navigation/native (for moving between screens)
react-navigation/native-stack (a specific way to move between screens)
react-native-screens and react-native-safe-area-context (helpers for react-navigation)
react-native-vector-icons (for pretty pictures like hearts and music notes)
(Potentially others as we go, like a map library or music SDK wrappers)
"For iOS, make sure to run pod install in the ios folder if needed."
Phase 1: MVP - Core Functionality
Part 1: Authentication (The "Secret Handshake" to Enter the House)
Goal: Let users create an account, log in, and log out.
LLM, Set up Supabase Client:
"Create a new file. Call it supabaseClient.js. Put it in a new folder called src/lib."
"In this file, write the code to connect to our Supabase magic data cloud. You'll need a special URL and a secret key (I'll give you placeholders: YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY)."
(LLM generates import { createClient } from '@supabase/supabase-js'; const supabaseUrl = 'YOUR_SUPABASE_URL'; const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; export const supabase = createClient(supabaseUrl, supabaseKey);)
LLM, Create Zustand Store for Auth State ("The Memory Box for Who's In"):
"Create a new folder: src/store."
"Inside src/store, create authStore.js."
"In authStore.js, we need to tell Zustand to remember:"
user: Who is currently logged in (or null if no one).
session: The special login ticket (or null).
isLoading: Are we busy trying to log in? (true/false).
error: Did something go wrong? (a message or null).
"Make functions in this store to:"
signUp(email, password): Tries to create a new user with Supabase. Updates user, session, isLoading, error.
signIn(email, password): Tries to log in an existing user with Supabase. Updates user, session, isLoading, error.
signOut(): Logs the user out with Supabase. Clears user and session.
setUserAndSession(user, session): A helper to update the store.
initializeAuthListener(): This is important! Tell Supabase to let us know if the login status changes (e.g., token refreshed, user signed out from another tab). When Supabase tells us, update our store.
(LLM generates Zustand store structure with these actions using supabase.auth.signUp, supabase.auth.signInWithPassword, supabase.auth.signOut, supabase.auth.onAuthStateChange)
LLM, Create Auth Screens ("The Doors to Our House"):
"Create a folder: src/screens/Auth."
Login Screen (LoginScreen.js):
"Make a new file src/screens/Auth/LoginScreen.js."
"Design a screen with:"
A title: "Welcome Back!"
An input box for "Email".
An input box for "Password".
A button: "Login".
A text link: "Don't have an account? Sign Up".
"When the user types in Email/Password, remember what they typed."
"When 'Login' button is tapped: Use the signIn function from our authStore."
"If isLoading is true (from authStore), show a spinning circle instead of the button."
"If error (from authStore), show the error message."
"If login is successful (check user in authStore), we need to go to the 'Create Profile' page (we'll make this next)."
"When 'Sign Up' link is tapped: Go to the 'Sign Up' screen."
Sign Up Screen (SignUpScreen.js):
"Make a new file src/screens/Auth/SignUpScreen.js."
"Design a screen with:"
A title: "Join Findinglyra!"
Input box for "Email".
Input box for "Password".
Input box for "Confirm Password".
A button: "Sign Up".
A text link: "Already have an account? Login".
"When 'Sign Up' button is tapped: Check if Password and Confirm Password match. If not, show an error."
"If they match: Use the signUp function from authStore."
"Handle isLoading and error like in Login."
"If sign up is successful, tell the user to check their email for a confirmation link (Supabase handles this). Then, maybe take them to the Login screen."
"When 'Login' link is tapped: Go to the 'Login' screen."
LLM, Set up Navigation ("The Hallways and Doors Between Rooms"):
"Create a file src/navigation/AppNavigator.js."
"In AppNavigator.js:"
Import NavigationContainer from react-navigation/native.
Import createNativeStackNavigator from react-navigation/native-stack.
Import our LoginScreen, SignUpScreen. (And later CreateProfileScreen, MusicPreferenceScreen, MatchScreen).
Import useAuthStore from ../store/authStore.
"Create a stack navigator."
"Inside the NavigationContainer, use the authStore to check if user exists (meaning, logged in)."
"IF user exists AND their profile is complete (we'll add a check for this later): Show the MatchScreen (main app).
"IF user exists BUT their profile ISN'T complete: Show the CreateProfileScreen."
"IF user DOES NOT exist: Show an 'AuthStack' which includes LoginScreen and SignUpScreen. LoginScreen should be the first one."
"In App.js (the main entry point of our app):"
Import and render our AppNavigator.
Make sure to call initializeAuthListener() from authStore once when the app starts.
Part 2: Profile Creation ("Telling Us About Yourself")
Goal: After login/signup, get basic info and music preferences.
LLM, Create ProfileForm Screen (CreateProfileScreen.js):
"Create src/screens/Profile/CreateProfileScreen.js (make a Profile folder in screens)."
"Design a screen with input fields for:"
Name
Age (maybe a date picker or number input)
Gender (dropdown/selectable options)
Orientation (dropdown/selectable options)
Location (we can try to get this automatically later, for now, a text input)
Photo Upload (a button that would open the photo library – just the button for now)
Short Bio (multi-line text input)
"Add a 'Next' or 'Save Profile' button."
"When the user fills these, remember the values."
"When 'Next' is tapped:"
Data Transfer to Supabase:
"Create a Supabase Edge Function (or a direct table insert if simpler for now) called create_user_profile."
"This function needs the user_id (from authStore.user.id) and all the profile data."
"It should insert/update a new row in a profiles table in Supabase."
"Make sure your profiles table in Supabase has columns for id (links to auth.users.id), name, age, gender, orientation, location, photo_url, bio, is_profile_complete (boolean)."
"From CreateProfileScreen.js, call this Supabase function with the collected data."
"Set is_profile_complete to false for now in the DB (or true if this is the only profile step for MVP)."
"If successful: Navigate to MusicPreferenceScreen.js."
"Handle errors if saving fails."
LLM, Create MusicPreferenceScreen (MusicPreferenceScreen.js):
"Create src/screens/Profile/MusicPreferenceScreen.js."
"Design a screen with options for:"
"A big button: 'Connect Spotify' (just a button, no action yet)."
"A big button: 'Connect Apple Music' (just a button, no action yet)."
"Or, sections for manual input (if they don't connect):"
Favorite Genres (let them pick multiple from a list, or type them)
Favorite Artists (let them type a few)
Favorite Eras (e.g., 80s, 90s, 2000s - pick from list)
"Add a 'Finish' or 'Save Music Preferences' button."
"When 'Finish' is tapped:"
Data Transfer to Supabase:
"Create a Supabase Edge Function (or direct table inserts) save_music_preferences."
"This needs user_id."
"It should save data into tables like user_genres, user_artists (these tables would link back to the user_id)."
"In your profiles table, update is_profile_complete to true for this user."
"From MusicPreferenceScreen.js, call this Supabase function."
"If successful: Navigate to MatchScreen.js (the main app screen!)."
"Handle errors."
Part 3: Matching ("Finding Friends Who Like the Same Toys")
Goal: Show the user potential matches based on some basic criteria.
LLM, Create MatchScreen (MatchScreen.js):
"Create src/screens/App/MatchScreen.js (make an App folder in screens for main app views)."
"This screen will show a list of other users."
Data Retrieval from Supabase:
"Create a Supabase Edge Function get_potential_matches."
"It needs the current user_id."
"For MVP: It should find other users from the profiles table who are NOT the current user AND whose is_profile_complete is true."
"(Later, we'll add music logic here)."
"It should return a list of these users (e.g., their id, name, photo_url, a key music taste like top genre)."
"In MatchScreen.js:"
"When the screen loads, call get_potential_matches."
"Use Zustand to store the list of matches and a isLoadingMatches state."
UI/UX Design:
"If isLoadingMatches, show a 'Finding matches...' message or spinner."
"If there are matches, display them in a list or as cards (like Tinder/Hinge)."
"Each card should show: User's Photo, Name, Age, and maybe one main music genre."
"For now, just display them. Swiping comes later."
Logic Checks / "Making Sure It Works" (For each step above, especially UI):
Routing:
"LLM, when I tap 'Login' and it's successful, does it GO to CreateProfileScreen if profile is incomplete?"
"LLM, if I am already logged in and profile is complete, when I open the app, do I see MatchScreen?"
Data Display:
"LLM, on LoginScreen, if I type 'test@test.com', is 'test@test.com' REALLY in the email input box's memory (state)?"
"LLM, after I save my profile name as 'Alex', if I go to Supabase table profiles, do I SEE 'Alex' there for my user ID?"
State Management:
"LLM, when signIn in authStore is called, does isLoading become true and then false?"
"LLM, if Supabase returns an error during login, is the error message in authStore updated and shown on LoginScreen?"
Button Actions:
"LLM, is the onPress prop of the 'Save Profile' button ACTUALLY calling the function that saves data to Supabase?"
This is just for the MVP. For each subsequent feature (Music Sharing, Harmony Score, etc.), we'd follow a similar pattern:
LLM, what data does this new feature need? (Design Supabase tables/columns).
LLM, how will we get/process this data? (Design Supabase Edge Functions).
LLM, how will the user interact with this? (Design React Native screens/components).
"Make a button here."
"Show this information here."
"When this is tapped, do X."
LLM, does this feature need to remember anything special? (Update/create Zustand stores).
LLM, connect the UI to the data functions and state.
LLM, check all the little connections.




Refactored Prompt to LLM: Building Findinglyra - A Mobile Application (Comprehensive User Flow & Tech Enablement)
Objective: Generate all required artifacts, code, and documentation for the Findinglyra mobile application, guiding the process from scratch to production with a focus on user interaction and the specific technologies enabling it at each step. This prompt assumes continuous human oversight for validation and strategic direction.

Mobile Application Context: Findinglyra is a native mobile application developed using React Native for its cross-platform capabilities (iOS and Android). Supabase will serve as the primary backend (Auth, Database, Realtime, Storage, Edge Functions). Zustand will manage client-side global state.

Phase 0: Foundation & Detailed Planning (Conceptual & LLM-Assisted)
Goal: Establish detailed requirements, architecture, and project structure for the mobile app.

LLM Role: Content generation, research, boilerplate code/structure conceptualization.

User Flow Impact: This phase lays the unseen groundwork, ensuring the subsequent user experience is coherent, performant, and secure. The user doesn't directly interact with this phase, but its quality dictates their future satisfaction.

Technological Enablement (LLM's internal process): The LLM uses its vast training data to synthesize best practices for mobile app architecture, database design (PostgreSQL via Supabase), and frontend frameworks (React Native, Zustand), translating high-level requirements into actionable technical plans.

Prompt LLM: Detailed Feature Breakdown & User Stories (for Mobile App)
"For each core feature of Findinglyra (list them, focusing on mobile interactions), generate detailed user stories in the mobile-centric format: 'As a [mobile app user], I want to [action] so that [benefit].' Include clear acceptance criteria for each."

Prompt LLM: Mobile UI/UX Wireframe & Mockup Concepts
"Generate textual descriptions or ASCII art for wireframes of the following Findinglyra mobile screens: Onboarding (Music Connect, Manual Account), Sign In, Profile Creation (Basic, Music Prefs), Match Page (emphasize swipe gestures), Chat (with music share UI), User Profile (viewing others), Soundscape (mobile map interaction). Suggest a mobile-first color palette and typography suitable for a modern, vibrant, music-focused dating app on iOS and Android."

Prompt LLM: Supabase Data Schema Design (Optimized for Mobile Backend)
"Design a PostgreSQL schema for Findinglyra using Supabase. Include tables for users, profiles, music_preferences (genres, artists, eras), user_music_history (linked to streaming data), matches, chat_messages, concert_interests, soundscape_pins, collaborative_playlists. Define relationships, primary/foreign keys, and suggested RLS policies optimized for mobile app security (e.g., users can only update their own profile, messages only visible to match participants). Generate SQL DDL statements."

Prompt LLM: Mobile Project Structure & Initial Setup
"Generate a recommended directory structure for a React Native mobile project using Zustand for state management and Supabase for backend. Include folders for screens, components, services (API calls), state (Zustand stores), assets, utils. Generate a basic package.json with core mobile app dependencies: react, react-native, zustand, @supabase/supabase-js, @react-navigation/native, @react-navigation/native-stack, react-native-screens, react-native-safe-area-context, react-native-vector-icons, and key libraries for mobile music API integration (e.g., react-native-spotify-remote, react-native-webview for OAuth flows, react-native-keychain for secure storage). Specify pod install for iOS."

Prompt LLM: Mobile API Integration Plan (Edge Functions & Music APIs)
"Outline the steps and key Supabase Edge Functions needed to securely integrate with Spotify API and Apple Music API for user authentication (OAuth flows via WebView/deep links), fetching top artists/tracks, and recent listening history relevant for mobile usage. Specify necessary OAuth scopes. Research and list potential Node.js libraries suitable for interacting with Spotify and Apple Music APIs from Supabase Edge Functions, emphasizing mobile security considerations (e.g., keeping secrets off the device)."

Phase 1: MVP Development - Core Functionality (Detailed User Flow & Tech Explanation)
Goal: Deliver a functional mobile app with user registration, profile creation, music preference input, basic matching, and match display.

LLM Role: Generate component code, state management logic, basic Supabase interaction code.

User Flow for MVP Mobile App:
App Launch (Unauthenticated): User opens the Findinglyra app for the first time.
Account Creation / Sign In: User is presented with options to sign up or log in.
Sign Up: User enters email and password, receives an email confirmation, then logs in.
Login: User enters existing email and password.
Basic Profile Creation: After successful login, if their profile is incomplete, the user is guided to enter basic personal details (name, age, gender, location, bio, photo).
Music Preferences Input: User then proceeds to manually select or indicate intent to connect their music streaming service (Spotify/Apple Music) for music preferences.
Viewing Matches: Once the profile is complete, the user is directed to the main match screen, where they can see initial potential matches.
Page-by-Page Breakdown (User Interaction & Technical Implementation):
1. Initial App Launch (Implicit Splash/Loading Screen)

User Interaction: The user opens the mobile app and sees a splash screen or a brief loading indicator.
Technological Enablement:
React Native: App.js is the entry point, rendering the main AppNavigator.
Zustand & Supabase: In AppNavigator, useEffect calls authStore.initializeAuthListener(). This function, using supabase.auth.onAuthStateChange, checks the local session and potentially fetches the user's is_profile_complete status from Supabase's profiles table. An ActivityIndicator (React Native) is displayed while this initial check is in progress.
Secure Storage: (Implicit) zustand/middleware/persist integrates with AsyncStorage (React Native) to retrieve the previous user session, ensuring persistent login across app restarts.
2. Sign Up Screen (src/screens/Auth/SignUpScreen.js)

User Interaction:
The user inputs their email address and a password, then confirms the password.
They tap a "Sign Up" button.
They receive on-screen feedback: a loading spinner while signing up, an error message if anything goes wrong (e.g., invalid email, password mismatch), or a success message instructing them to check their email for verification.
They can tap a "Login" link to go back to the login screen.
Technological Enablement:
React Native UI: SafeAreaView, TextInput for inputs (keyboardType="email-address", secureTextEntry), TouchableOpacity for buttons/links, ActivityIndicator for loading, Text for messages.
Local State (React): useState manages the email, password, confirmPassword inputs locally within the component.
Global State (Zustand): useAuthStore provides access to isLoading (for spinner), error (for global auth errors), and the signUp action.
Backend (Supabase Auth): The authStore.signUp action calls supabase.auth.signUp({ email, password }). Supabase handles email verification.
Client-Side Validation: Basic password mismatch check is done in React Native component logic using useState.
3. Login Screen (src/screens/Auth/LoginScreen.js)

User Interaction:
The user inputs their registered email and password.
They tap a "Login" button.
They see a loading spinner during authentication, an error message for invalid credentials, or are seamlessly navigated to the next appropriate screen (profile creation or main app).
They can tap a "Sign Up" link to create a new account.
Technological Enablement:
React Native UI: Similar UI components to SignUpScreen.
Local State (React): useState manages email and password inputs.
Global State (Zustand): useAuthStore provides isLoading, error, signIn, and crucial user and isProfileComplete states.
Backend (Supabase Auth): authStore.signIn calls supabase.auth.signInWithPassword({ email, password }).
Navigation (React Navigation): useEffect in this component (and AppNavigator) observes authStore.user and authStore.isProfileComplete. useNavigation().replace() is used to prevent back navigation to login once authenticated, directing the user to:
CreateProfileScreen (OnboardingStack) if user is logged in but isProfileComplete is false.
MatchScreen (AppStack) if user is logged in and isProfileComplete is true.
4. Create Basic Profile Screen (src/screens/Onboarding/CreateProfileScreen.js)

User Interaction:
The user fills in their name, age, gender, orientation, location, and a short bio using text inputs.
They tap a large circular area to upload a profile photo. (For MVP, this is a placeholder indicating future functionality).
They tap "Next" to save their basic profile and proceed.
Loading indicators and error messages provide feedback.
Technological Enablement:
React Native UI: TextInput (with keyboardType="numeric" for age, multiline for bio), TouchableOpacity for the photo area and "Next" button. An Image component would display a selected photo.
Local State (React): useState holds all profile data (name, age, etc.) for real-time form updates.
Global State (Zustand): useAuthStore().user.id provides the current user's ID to link the profile data.
Backend (Supabase Database & Storage):
Upon "Next" tap, the data is sent via supabase.from('profiles').upsert(...). The id column in public.profiles is a FOREIGN KEY linked to auth.users(id).
photo_url will store a URL to Supabase Storage (which will handle the actual image file storage, after a user selects an image using a library like react-native-image-picker).
is_profile_complete column in profiles is updated (set to false at this stage, true after music prefs).
Navigation: useNavigation().navigate() takes the user to MusicPreferenceScreen on success.
5. Music Preferences Screen (src/screens/Onboarding/MusicPreferenceScreen.js)

User Interaction:
The user sees prominent "Connect Spotify" and "Connect Apple Music" buttons (placeholders for MVP).
Alternatively, they can manually enter their favorite genres, top artists, and favorite eras in text input fields (e.g., comma-separated).
They tap "Finish Profile" to save their music preferences.
Loading and error feedback.
Technological Enablement:
React Native UI: TouchableOpacity for music service connect buttons, TextInput for manual entry (using ScrollView to handle keyboard overlap).
Local State (React): useState for genresInput, artistsInput, erasInput.
Global State (Zustand): useAuthStore().user.id for linking. useAuthStore().setIsProfileComplete() is called upon successful completion.
Backend (Supabase Database):
Upon "Finish Profile" tap, the profiles table is updated (supabase.from('profiles').update(...)) to set is_profile_complete to true.
For MVP, the manual input strings (genresInput, etc.) are saved directly into new columns on the profiles table (e.g., manual_genres TEXT[]).
RLS Policies: Ensure profiles table RLS allows users to update their own profile.
Navigation: useNavigation().replace('MatchScreen') directs the user to the main app interface.
6. Match Screen (src/screens/App/MatchScreen.js)

User Interaction:
The user sees a list or a stack of potential matches (initially, any other complete profile).
Each match prominently displays their photo, name, age, and a key music tag.
(MVP does not include swiping yet, just display).
A "Logout" button is available.
Technological Enablement:
React Native UI: FlatList for efficient scrolling list display. Image for profile photos, Text for user details.
Local State (React): useState for matches array, isLoadingMatches, error.
Global State (Zustand): useAuthStore().user.id to exclude current user, useAuthStore().signOut() for logout.
Backend (Supabase Database): useEffect calls supabase.from('profiles').select('id, name, age, photo_url, manual_genres') filtered by neq('id', user.id) and eq('is_profile_complete', true).
RLS Policies: public.profiles RLS policy Users can view all public profiles (FOR SELECT USING TRUE) enables fetching other profiles.
Phase 2: Enhancing Engagement - Core Music Features (Detailed User Flow & Tech Explanation)
Goal: Implement Harmony Score, Music Sharing in Chat, Musical Journey Timeline, and basic Collaborative Playlists.

LLM Role: Generate algorithm logic, component structures, and API integration snippets.

User Flow for Phase 2 Mobile App:
Discovering Compatibility: User views match profiles and sees a "Harmony Score."
Engaging in Chat: User messages matches and shares specific music tracks.
Reflecting on Music History: User views a timeline of their past musical tastes.
Co-creating Music: User can initiate and add songs to a shared playlist with a match.
Page-by-Page/Feature Breakdown (User Interaction & Technical Implementation):
1. Match Page / User Profile View (Harmony Score Update)

User Interaction: When viewing a match card or their full profile, the user sees a numerical "Harmony Score" (e.g., "85%") prominently displayed, indicating musical compatibility.
Technological Enablement:
React Native UI: Updated MatchScreen card component and User Profile View component to include a Text element for the score.
Backend (Supabase Edge Function): A new Supabase Edge Function, calculate_harmony_score, will be invoked. This function:
Receives user_id1 and user_id2.
Queries user_genres, user_artists, user_streaming_history tables for both users.
Implements the logic to calculate the score (e.g., weighted sum of shared genres, artists, historical overlap).
Returns the score to the mobile app.
Client-side (React Native): When a match card is displayed or a profile is loaded, a useEffect hook will call the Edge Function. The useState hook will hold the score, and Text will display it. The score can also be stored in the matches table to avoid recalculation.
2. Chat Screen (Music Sharing Integration)

User Interaction:
The user types and sends text messages.
The user taps a dedicated "Share Music" button within the chat.
(Future: They can then pick a song from their connected Spotify/Apple Music library).
The shared music appears as a special message bubble, potentially with playable metadata.
Technological Enablement:
React Native UI: TextInput for messages, TouchableOpacity for "Share Music" icon/button. Message bubbles rendered dynamically (FlatList).
Backend (Supabase Realtime & Database):
Sending Messages: supabase.from('chat_messages').insert({ match_id, sender_id, content, message_type: 'text' }).
Real-time Updates: supabase.channel('chat_room').on('postgres_changes', ...) listens for new inserts into chat_messages where match_id is relevant.
Music Sharing Data: The chat_messages table will have a music_data JSONB column to store track ID, service, name, artist for shared music.
Future (Music SDKs): Actual music selection will involve react-native-spotify-remote or similar SDKs to browse the user's library and obtain track metadata client-side. The metadata is then sent via supabase.from('chat_messages').insert({ ..., message_type: 'music_share', music_data: {...} }).
RLS Policies: Chat messages must have RLS to ensure only participants of a match_id can read/write.
3. Musical Journey Timeline (src/screens/App/MusicalJourneyScreen.js)

User Interaction: The user navigates to their "Musical Journey" section within their profile and sees a chronological display of their music evolution (e.g., "2020: Top Artist: Artist A, Top Genre: Genre X").
Technological Enablement:
React Native UI: A FlatList or custom ScrollView displaying vertical timeline elements. Each element could be a View with Text for year/artist/genre.
Backend (Supabase Database / Edge Function):
If user_streaming_history is populated, a Supabase Edge Function could process this data to derive yearly top artists/genres.
Alternatively, simplified manual input or stored summary data could be fetched directly from profiles or a dedicated user_music_summary table.
supabase.from('user_music_summary').select().eq('user_id', auth.uid()).
4. Collaborative Playlists (Concept & Basic Stubs)

User Interaction:
The user can initiate creating a collaborative playlist with a match (e.g., from their profile or chat).
They can then manually input a song title and artist to add to the playlist.
Technological Enablement:
React Native UI: New components for "Create Collaborative Playlist" and "Add Song to Playlist."
Backend (Supabase Database):
New tables: collaborative_playlists (metadata like name, owner, match_id) and playlist_tracks (linking to collaborative_playlists and storing track details, added_by user_id).
supabase.from('collaborative_playlists').insert().
supabase.from('playlist_tracks').insert().
Future: Integration with Spotify/Apple Music APIs to allow actual searching and adding songs to a real collaborative playlist on those services. This would require dedicated Edge Functions to interact with the music service APIs using the stored user tokens.
Phase 3: Advanced & Differentiating Features (Detailed User Flow & Tech Explanation)
Goal: Implement Soundscape (MVP), Real-time Listening, Concert Buddy, Local Scene.

LLM Role: Research library options, generate complex component structures, API integration patterns.

User Flow for Phase 3 Mobile App:
Exploring Music on a Map: User views a map to discover music pinned by others in their vicinity and adds their own music pins.
Synchronized Listening: User invites a match to listen to music together in real-time.
Local Music Discovery: User finds local concerts based on their music tastes and sees which matches are interested in attending.
Page-by-Page/Feature Breakdown (User Interaction & Technical Implementation):
1. Soundscape Screen (src/screens/App/SoundscapeScreen.js)

User Interaction:
The user sees a 2D map centered on their current location.
Music pins from other users appear on the map. Tapping a pin reveals playlist information.
The user can tap-and-hold (or use a button) to "pin" their own playlist (manually entered name/description for now) to their location.
Technological Enablement:
React Native UI: react-native-maps for the map display and custom markers. GestureHandler for tap-and-hold. Modal/BottomSheet component to display pin info or add new pin.
Mobile OS APIs: react-native-geolocation-service (or Expo equivalent) to get user's current latitude/longitude.
Backend (Supabase Database): The soundscape_pins table stores user_id, playlist_name, playlist_description, latitude, longitude.
Data Fetching: supabase.from('soundscape_pins').select() with WHERE clauses for geographic proximity (e.g., using ST_DWithin if PostGIS is enabled on Supabase, or simple bounding box queries for MVP).
Data Submission: supabase.from('soundscape_pins').insert() when a user pins a playlist.
2. Real-time Listening Partner (src/screens/App/ListeningPartyScreen.js)

User Interaction:
Users initiate a "Listening Party" with a match.
They see the current track info and playback controls (play, pause, seek, next) that are synchronized across both devices.
Technological Enablement:
React Native UI: A dedicated ListeningPartyScreen with UI elements for track display, playback controls.
Mobile OS APIs/SDKs (Manual Integration): Actual music playback will rely on native music SDKs (e.g., Spotify SDK for iOS/Android, Apple Music API). This part needs manual implementation outside the LLM's direct code generation for the player itself.
Backend (Supabase Realtime): The core of synchronization.
A dedicated Supabase Realtime channel for each listening party.
Participants publish events like PLAY, PAUSE, SEEK, TRACK_CHANGE with appropriate payloads (e.g., { track_id, position_ms }).
All participants subscribe to this channel and update their local player state based on received events.
Supabase Edge Functions: Potentially for managing party invitations or complex state transitions.
3. Concert Buddy & Local Scene (src/screens/App/ConcertsScreen.js)

User Interaction:
The user views a list of upcoming local concerts relevant to their music preferences.
They can mark themselves as "Interested" or "Attending" an event.
They see other Findinglyra users who are also interested in the same event.
Technological Enablement:
React Native UI: A FlatList to display concerts. Each concert item shows details, and has "Interested"/"Attending" buttons.
Backend (Supabase Edge Functions & External APIs):
A Supabase Edge Function (Workspace_concert_data) will act as a proxy. This function:
Receives user_id (to get preferences) and location.
Makes authenticated API calls to external concert APIs like Songkick or Bandsintown (using Node.js libraries like axios or direct Workspace).
Filters events based on the user's user_artists or manual_artists.
Returns structured concert data to the mobile app.
Supabase Database: The concert_interests table stores user_id, event_id (external API ID), interest_status.
Social Integration: Query concert_interests to show profiles of other users interested in the same event. RLS on concert_interests allows users to see who else is interested but only modify their own status.
Phase 4: Polish, Testing, Scaling & Launch Prep (Refactored)
Goal: Refine UI/UX, conduct comprehensive testing, optimize performance, and prepare the mobile app for deployment to app stores.

LLM Role: Generate test cases, documentation outlines, optimization suggestions.

User Flow Impact: This phase ensures a smooth, bug-free, and visually appealing experience for the end-user. It directly impacts user satisfaction and app store ratings.

Technological Enablement:

UI/UX Polish: Iterative adjustments to React Native component styles, animations, and adherence to iOS Human Interface Guidelines and Android Material Design. LLM suggests accessibility improvements (e.g., accessibilityLabel for components, touch target sizes in StyleSheet).
Testing:
Unit/Integration Tests: LLM generates Jest/React Native Testing Library configurations and test cases for individual components and core logic (e.g., auth functions, profile updates, Harmony Score calculation).
End-to-End (E2E) Tests: LLM suggests scenarios for E2E testing using tools like Detox or Appium, simulating full user flows (e.g., "sign up -> create profile -> see matches").
Performance & Security: LLM identifies potential bottlenecks common in React Native/Supabase (large lists, frequent API calls) and suggests specific optimizations (e.g., FlatList initialNumToRender, memo, useCallback, database indexing, Supabase caching). For security, LLM reiterates RLS best practices, input validation in Edge Functions, and secure token handling (react-native-keychain).
Deployment: LLM outlines CI/CD pipeline setup using GitHub Actions for automated builds and deployment to Expo Application Services (EAS) or directly to App Store Connect/Google Play Console.
Documentation: LLM generates templates for API documentation (Supabase Edge Functions) and developer guides for the React Native project.
App Store Listing: LLM drafts compelling App Store and Google Play Store listing text, highlighting the unique selling points (music-centric dating, Harmony Score, Soundscape).
Post-Launch: Iteration & Growth (Refactored)
Goal: Monitor performance, analyze user feedback, iterate on features, and grow the user base.

LLM Role: Analyze text data, suggest A/B tests, research new tech trends.

User Flow Impact: This continuous phase ensures the app remains relevant, improves based on real user needs, and introduces exciting new features, fostering long-term engagement.

Technological Enablement:

User Feedback Analysis: LLM can process and categorize user reviews/feedback from app stores or support channels, identifying common themes, bugs, and feature requests.
A/B Testing Ideas: LLM suggests A/B test hypotheses for UI/UX elements (e.g., different Harmony Score visualizations, alternative onboarding steps) to optimize conversion and engagement metrics.
Future Feature Ideation: Based on analysis of emerging music technology trends (e.g., generative AI music, spatial audio, social audio rooms) and dating app innovations, LLM proposes new, innovative features for Findinglyra's roadmap.

Overarching Command to LLM:
"LLM, we are building a sophisticated mobile application called Findinglyra from the ground up. You are my lead engineer. I will give you precise, step-by-step instructions. Your job is to generate the code, file structures, and configurations exactly as asked. If anything is unclear, ask for clarification before proceeding. We will build this iteratively. Assume we are using TypeScript for all JavaScript/React Native code for better stability. Our target is a professional-quality app like Tinder or Hinge, but music-focused."
Phase 0: Project Foundation & Setup ("Building Our Workshop")
0.1. LLM, Create Main Project Folder:
* Instruction: "On your virtual file system, create a new top-level directory named findinglyra_app_project."
* LLM Action: Creates the folder.
0.2. LLM, Set Up React Native Project (using Expo for easier setup/builds):
* Instruction: "Navigate into findinglyra_app_project. Initialize a new React Native project using Expo. Name the project findinglyra. Use the 'blank (TypeScript)' template if available, otherwise, a standard blank template."
* LLM Action: Executes npx create-expo-app findinglyra -t expo-template-blank-typescript (or equivalent). Then cd findinglyra.
0.3. LLM, Add Core Dependencies ("Gathering Our Essential Tools"):
* Instruction: "Inside the findinglyra project directory, add the following npm packages:"
* @supabase/supabase-js (for talking to our Supabase backend)
* zustand (for managing app-wide memory/state)
* @react-navigation/native (the core for moving between screens)
* @react-navigation/native-stack (one way to manage screen transitions)
* react-native-screens (helper for navigation)
* react-native-safe-area-context (helper for navigation on notched devices)
* react-native-vector-icons (for pretty icons like hearts, music notes)
* @rneui/themed @rneui/base (React Native Elements - a good UI toolkit for professional look)
* react-native-dotenv (for managing environment variables like API keys)
* (Will add more later, e.g., map libraries, music SDKs)
* LLM Action: Executes npm install @supabase/supabase-js zustand @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context react-native-vector-icons @rneui/themed @rneui/base react-native-dotenv (or yarn add ...).
0.4. LLM, Configure react-native-vector-icons (if needed by UI toolkit or direct use):
* Instruction: "Follow the installation instructions for react-native-vector-icons to link native assets, typically involving adding lines to android/app/build.gradle and ios/Podfile then running pod install for iOS. For Expo managed projects, this might just involve importing fonts."
* LLM Action: Generates the necessary modifications or confirms Expo font loading.
0.5. LLM, Set up react-native-dotenv:
* Instruction:
1. "Create a file named .env in the root of the findinglyra project."
2. "Add these lines to .env (I will provide actual values later):"
SUPABASE_URL=YOUR_SUPABASE_URL_HERE SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
3. "Create a file named babel.config.js (or modify if it exists) in the root and ensure it includes the module:react-native-dotenv plugin:"
javascript module.exports = function (api) { api.cache(true); return { presets: ['babel-preset-expo'], plugins: [ [ 'module:react-native-dotenv', { moduleName: '@env', path: '.env', blacklist: null, whitelist: null, safe: false, allowUndefined: true, }, ], ], }; };
4. "Create a file env.d.ts in the root for TypeScript to recognize these variables:"
typescript declare module '@env' { export const SUPABASE_URL: string; export const SUPABASE_ANON_KEY: string; }
* LLM Action: Creates/modifies these files with the specified content.
0.6. LLM, Establish Core Project Directory Structure ("Organizing Our Workshop"):
* Instruction: "Inside the findinglyra project, create a src directory. Within src, create the following subdirectories:"
* assets (for images, fonts, etc.)
* fonts
* images
* components (for reusable UI pieces)
* common (very generic components like buttons, inputs)
* auth (auth-specific components)
* profile (profile-specific components)
* matching (matching-related components)
* music (music feature components)
* constants (for fixed values like route names, API endpoints if not in .env, colors, etc.)
* hooks (for custom React hooks)
* lib (for utility functions, Supabase client setup)
* navigation (for screen navigation setup)
* screens (for individual app screens)
* Auth
* ProfileSetup
* MainApp
* Matching
* Chat
* UserProfile
* MusicFeatures
* services (for API call logic, interacting with Supabase)
* store (for Zustand state management stores)
* styles (for global styles, theme configuration)
* types (for shared TypeScript type definitions)
* LLM Action: Creates this directory tree.
0.7. LLM, Set up Supabase Client ("The Phone Line to Our Data Cloud"):
* Instruction:
1. "Create a file named supabaseClient.ts inside src/lib/."
2. "In this file, write TypeScript code to initialize and export the Supabase client. Import SUPABASE_URL and SUPABASE_ANON_KEY from @env."
* LLM Action: Generates src/lib/supabaseClient.ts:
```typescript
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
import { Database } from '../types/supabase'; // We'll generate this later
// Ensure the variables are loaded
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error(
        'Supabase URL or Anon Key is missing. Check your .env file and babel.config.js setup.',
      );
      // Potentially throw an error or handle this more gracefully
    }

    export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
    ```
*   **Instruction:** "For now, create a placeholder `src/types/supabase.ts` file. We will populate this later using Supabase CLI to generate types from our database schema."
*   **LLM Action:** Generates `src/types/supabase.ts`:
    ```typescript
    export type Json =
      | string
      | number
      | boolean
      | null
      | { [key: string]: Json | undefined }
      | Json[]

    export interface Database {
      public: {
        Tables: {
          // We will define tables like 'profiles', 'user_music_preferences' etc. here later
        }
        Views: {
          // Views here
        }
        Functions: {
          // Functions here
        }
      }
    }
    ```
Use code with caution.
0.8. LLM, Set up Global Styles/Theme with React Native Elements:
* Instruction:
1. "Create src/styles/theme.ts."
2. "Define a basic theme object for RNE. Include primary colors (e.g., a vibrant purple for Findinglyra), secondary colors, and basic typography settings (font family if custom fonts are added later, font sizes for h1, h2, body)."
3. "In App.tsx (root component), wrap the entire application with RNE's ThemeProvider and pass your custom theme."
* LLM Action:
* Generates src/styles/theme.ts (example):
```typescript
import { createTheme } from '@rneui/themed';
export const theme = createTheme({
          lightColors: {
            primary: '#6200EE', // A vibrant purple
            secondary: '#03DAC6', // A teal
            background: '#FFFFFF',
            white: '#FFFFFF',
            black: '#000000',
            grey0: '#f0f0f0', // Example, RNE has its own grey scale
            error: '#B00020',
          },
          darkColors: { // Optional: Define dark theme colors too
            primary: '#BB86FC',
            secondary: '#03DAC6',
            background: '#121212',
          },
          components: {
            Button: {
              raised: true,
              titleStyle: { fontWeight: 'bold' },
            },
            Input: {
              inputContainerStyle: {
                borderBottomWidth: 1,
              },
            },
            Text: (props) => ({
              style: {
                // fontFamily: 'YourCustomFont-Regular', // if you add custom fonts
              }
            }),
          },
        });
        ```
    *   Modifies `App.tsx`:
        ```typescript
        import React from 'react';
        import { ThemeProvider } from '@rneui/themed';
        import { theme } from './src/styles/theme';
        import AppNavigator from './src/navigation/AppNavigator'; // We'll create this
        import { AuthProvider } from './src/store/AuthContext'; // We'll create this

        export default function App() {
          return (
            <ThemeProvider theme={theme}>
              <AuthProvider> {/* Zustand setup might be different, this is placeholder if context preferred */}
                <AppNavigator />
              </AuthProvider>
            </ThemeProvider>
          );
        }
        ```
        *(Note: Zustand usually doesn't need a Provider at the root unless you're mixing it with Context for specific reasons. The direct import of the store is more common. I will adjust this when we get to the store.)*
Use code with caution.
Human Checkpoint 0:
Project structure created correctly?
Dependencies installed?
.env and babel.config.js setup for react-native-dotenv?
supabaseClient.ts initializes correctly (even if keys are placeholders)?
Basic theme and ThemeProvider in App.tsx?
Phase 1: MVP - Core Functionality ("Building the Entrance and First Room")
Part 1.1: Authentication (The "Secret Handshake")
1.1.1. LLM, Design Supabase Auth Tables & Policies (Conceptual for LLM):
* Instruction: "We will use Supabase's built-in auth.users table. We need to enable Email/Password authentication in the Supabase dashboard. For MVP, we will also enable 'Confirm email'. For user profiles, we will create a profiles table."
* Instruction: "Define the schema for a profiles table in Supabase SQL. It must have:"
* id (UUID, primary key, references auth.users.id ON DELETE CASCADE)
* created_at (TIMESTAMPTZ, default now())
* updated_at (TIMESTAMPTZ, default now())
* username (TEXT, unique, can be null initially)
* full_name (TEXT, can be null initially)
* avatar_url (TEXT, can be null initially)
* date_of_birth (DATE, can be null initially)
* gender_identity (TEXT, can be null initially)
* sexual_orientation (TEXT[], array of text, can be null initially) -- More flexible
* location_text (TEXT, can be null initially) -- Simple text for MVP
* location_coordinates (GEOGRAPHY(Point,4326), can be null initially) -- For later geo-queries
* bio (TEXT, can be null initially)
* is_profile_complete (BOOLEAN, default false)
* onboarding_step (TEXT, default 'profile_details') -- e.g., 'profile_details', 'music_prefs', 'completed'
* LLM Action: Generates SQL DDL:
```sql
CREATE TABLE public.profiles (
id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
username TEXT UNIQUE,
full_name TEXT,
avatar_url TEXT,
date_of_birth DATE,
gender_identity TEXT,
sexual_orientation TEXT[],
location_text TEXT,
location_coordinates GEOGRAPHY(Point,4326),
bio TEXT,
is_profile_complete BOOLEAN DEFAULT false NOT NULL,
onboarding_step TEXT DEFAULT 'profile_details' NOT NULL
);
-- Enable Row Level Security
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

    -- Policies for profiles table
    CREATE POLICY "Users can insert their own profile."
      ON public.profiles FOR INSERT
      WITH CHECK (auth.uid() = id);

    CREATE POLICY "Users can update their own profile."
      ON public.profiles FOR UPDATE
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);

    CREATE POLICY "Users can view their own profile."
      ON public.profiles FOR SELECT
      USING (auth.uid() = id);

    CREATE POLICY "Users can view other public profiles (if complete)." -- Adjust as needed
      ON public.profiles FOR SELECT
      USING (is_profile_complete = true); -- Or more granular access

    -- Trigger to update updated_at timestamp
    CREATE OR REPLACE FUNCTION public.handle_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    CREATE TRIGGER on_profiles_updated
      BEFORE UPDATE ON public.profiles
      FOR EACH ROW
      EXECUTE PROCEDURE public.handle_updated_at();

    -- Trigger to create a profile row when a new user signs up in auth.users
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.profiles (id, username) -- Add email to username if desired
      VALUES (NEW.id, NEW.email); -- Or leave username null
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE PROCEDURE public.handle_new_user();
    ```
*   **Instruction:** "Now, generate the TypeScript types from this SQL DDL for our `src/types/supabase.ts` file. Assume we ran `supabase gen types typescript --project-id <your-project-ref> --schema public > src/types/supabase.ts`."
*   **LLM Action:** Updates `src/types/supabase.ts` with the generated types for the `profiles` table and the functions. (This is a complex generation, LLM might need to simulate or be given an example structure based on the SQL).
Use code with caution.
1.1.2. LLM, Create Zustand Store for Auth & User Profile ("The Memory Box for Who's In & Their Basic ID"):
* Instruction:
1. "Create src/store/authStore.ts."
2. "Define a Zustand store. It needs to manage:"
* session: Session | null (from @supabase/supabase-js)
* user: User | null (from @supabase/supabase-js)
* profile: Database['public']['Tables']['profiles']['Row'] | null (our user profile data)
* isLoading: boolean (for async auth operations)
* error: Error | null
* isOnboarded: boolean (derived from profile.is_profile_complete)
3. "Implement store actions:"
* initializeAuthListener(): Subscribes to supabase.auth.onAuthStateChange. On change, updates session and user. If user exists, calls fetchUserProfile.
* signInWithEmail(email, password): Calls supabase.auth.signInWithPassword. Updates state, calls fetchUserProfile on success.
* signUpWithEmail(email, password, metadata?): Calls supabase.auth.signUp. Updates state. (Profile row is created by DB trigger).
* signOut(): Calls supabase.auth.signOut. Clears session, user, profile, isOnboarded.
* fetchUserProfile(userId): Fetches the user's profile from the profiles table using userId. Updates profile and isOnboarded state.
* updateUserProfile(profileData): Updates the user's profile in Supabase and then in the store.
* clearError(): Clears the error state.
* LLM Action: Generates src/store/authStore.ts (simplified example of actions):
```typescript
import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/supabase';
type Profile = Database['public']['Tables']['profiles']['Row'];

    interface AuthState {
      session: Session | null;
      user: User | null;
      profile: Profile | null;
      isLoading: boolean;
      error: Error | null;
      isOnboarded: boolean; // Derived or set after profile fetch
      initializeAuthListener: () => () => void; // Returns unsubscribe function
      signInWithEmail: (email: string, password: string) => Promise<void>;
      signUpWithEmail: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>;
      signOut: () => Promise<void>;
      fetchUserProfile: (userId: string) => Promise<void>;
      updateUserProfile: (profileData: Partial<Profile>) => Promise<void>;
      clearError: () => void;
    }

    export const useAuthStore = create<AuthState>((set, get) => ({
      session: null,
      user: null,
      profile: null,
      isLoading: true, // Start with loading true until first auth check
      error: null,
      isOnboarded: false,

      initializeAuthListener: () => {
        set({ isLoading: true });
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            set({ session, user: session?.user ?? null });
            if (session?.user) {
              await get().fetchUserProfile(session.user.id);
            } else {
              set({ profile: null, isOnboarded: false });
            }
            set({ isLoading: false });
          }
        );
        // Check initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            set({ session, user: session?.user ?? null, isLoading: false });
            if (session?.user) {
                get().fetchUserProfile(session.user.id);
            }
        });
        return () => {
          authListener?.unsubscribe();
        };
      },

      signInWithEmail: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          if (data.user) {
            // Session/user set by onAuthStateChange, or explicitly set here too
            set({ session: data.session, user: data.user });
            await get().fetchUserProfile(data.user.id);
          }
        } catch (e) {
          set({ error: e as Error });
        } finally {
          set({ isLoading: false });
        }
      },

      signUpWithEmail: async (email, password, metadata) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: metadata }, // e.g. { full_name: 'Initial Name' }
          });
          if (error) throw error;
          // User needs to confirm email. Profile row created by trigger.
          // Session/user might be set if email confirmation is off, or after confirmation.
          // onAuthStateChange will handle it.
        } catch (e) {
          set({ error: e as Error });
        } finally {
          set({ isLoading: false });
        }
      },

      signOut: async () => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ session: null, user: null, profile: null, isOnboarded: false });
        } catch (e) {
          set({ error: e as Error });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchUserProfile: async (userId) => {
        // Do not set isLoading here, as this is often a background task
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
          if (error && error.code !== 'PGRST116') { // PGRST116: 0 rows
            throw error;
          }
          set({ profile: data, isOnboarded: data?.is_profile_complete ?? false });
        } catch (e) {
          console.error('Error fetching profile:', e);
          set({ error: e as Error, profile: null, isOnboarded: false }); // Or handle error more gracefully
        }
      },

      updateUserProfile: async (profileData) => {
        const user = get().user;
        if (!user) {
          set({ error: new Error("User not authenticated to update profile")});
          return;
        }
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('profiles')
            .update({ ...profileData, updated_at: new Date().toISOString() })
            .eq('id', user.id)
            .select()
            .single();
          if (error) throw error;
          set({ profile: data, isOnboarded: data?.is_profile_complete ?? false });
        } catch (e) {
            set({ error: e as Error });
        } finally {
            set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }));

    // Call initializeAuthListener once when the store is created/app loads
    // This is often done in App.tsx using useEffect
    ```
Use code with caution.
1.1.3. LLM, Create Auth Screens ("The Doors to Our House"):
* Instruction: "Create src/screens/Auth/LoginScreen.tsx."
* "Use RNE components (Input, Button, Text). Style it professionally."
* "Include fields for Email, Password."
* "Login button calls signInWithEmail from useAuthStore."
* "Display loading state (e.g., disable button, show ActivityIndicator)."
* "Display error messages from the store."
* "Link to SignUpScreen."
* LLM Action: Generates LoginScreen.tsx (skeleton):
```typescript
// src/screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types'; // Define this later
type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

    const LoginScreen = () => {
      const navigation = useNavigation<LoginScreenNavigationProp>();
      const { signInWithEmail, isLoading, error, clearError } = useAuthStore();
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');

      const handleLogin = async () => {
        if (error) clearError();
        if (!email || !password) {
            Alert.alert("Input Error", "Please enter both email and password.");
            return;
        }
        await signInWithEmail(email, password);
        // Navigation will be handled by AppNavigator based on auth state
      };

      React.useEffect(() => {
        if (error) {
            Alert.alert('Login Error', error.message);
            clearError(); // Clear error after showing
        }
      }, [error, clearError]);

      return (
        <View style={styles.container}>
          <Text h3 style={styles.title}>Welcome Back to Findinglyra!</Text>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            leftIcon={{ type: 'material-community', name: 'email-outline' }}
          />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={{ type: 'material-community', name: 'lock-outline' }}
          />
          {isLoading && <Text>Logging in...</Text>}
          <Button title="Login" onPress={handleLogin} loading={isLoading} containerStyle={styles.buttonContainer} />
          <Button
            title="Don't have an account? Sign Up"
            type="clear"
            onPress={() => navigation.navigate('SignUp')}
            titleStyle={styles.linkButton}
          />
        </View>
      );
    };

    const styles = StyleSheet.create({
      container: { flex: 1, justifyContent: 'center', padding: 20 },
      title: { textAlign: 'center', marginBottom: 30 },
      buttonContainer: { marginVertical: 10 },
      linkButton: { fontSize: 16 },
    });

    export default LoginScreen;
    ```
*   **Instruction:** "Create `src/screens/Auth/SignUpScreen.tsx`."
    *   "Similar structure to `LoginScreen`."
    *   "Fields for Email, Password, Confirm Password."
    *   "Client-side validation for password match."
    *   "Sign Up button calls `signUpWithEmail`."
    *   "On success, display a message: 'Please check your email to confirm your account.' (Supabase handles email sending)."
    *   "Link to `LoginScreen`."
*   **LLM Action:** Generates `SignUpScreen.tsx` (similar structure to `LoginScreen`).
Use code with caution.
1.1.4. LLM, Set up Navigation ("The Hallways and Doors"):
* Instruction:
1. "Create src/navigation/types.ts to define param lists for navigators."
```typescript
// src/navigation/types.ts
export type AuthStackParamList = {
Login: undefined;
SignUp: undefined;
};
export type ProfileSetupStackParamList = {
          ProfileDetails: undefined; // e.g., name, dob, gender
          MusicPreferences: undefined; // genres, artists
          // Add more steps if needed
        };

        export type MainAppTabParamList = { // Example if using tabs later
          Matching: undefined;
          ChatList: undefined;
          MyProfile: undefined;
          // Soundscape: undefined; // for a later feature
        };

        // If MainApp is a stack:
        export type MainAppStackParamList = {
            MatchFeed: undefined; // Or whatever you call the main matching screen
            UserProfileView: { userId: string };
            ChatScreen: { chatId: string; recipientId: string };
            // ... other main app screens
        }

        // Combine them for the root navigator if needed, or handle conditionally
        export type RootStackParamList = {
          Auth: { screen: keyof AuthStackParamList } | undefined; // To nest the stack
          ProfileSetup: { screen: keyof ProfileSetupStackParamList } | undefined;
          MainApp: { screen: keyof MainAppStackParamList } | undefined; // Or MainAppTabParamList
          Loading: undefined; // A loading screen
        };
        ```
    2.  "Create `src/navigation/AppNavigator.tsx`."
    3.  "Use `createNativeStackNavigator` for the root navigator."
    4.  "Import `useAuthStore`."
    5.  "Conditionally render navigators based on auth state:"
        *   If `isLoading` (from store, initial check): Show a `LoadingScreen` (simple component with `ActivityIndicator`).
        *   If `session` and `user` exist AND `profile` exists AND `profile.is_profile_complete` is `true` (or `profile.onboarding_step === 'completed'`): Render `MainAppNavigator`.
        *   If `session` and `user` exist AND (`profile` is null OR `profile.onboarding_step !== 'completed'`): Render `ProfileSetupNavigator`.
        *   Otherwise (no session): Render `AuthNavigator`.
    6.  "Create `AuthNavigator.tsx`, `ProfileSetupNavigator.tsx`, and `MainAppNavigator.tsx` as separate stack navigators for modularity, importing their respective screens."
*   **LLM Action:**
    *   Generates `src/navigation/types.ts`.
    *   Generates `src/screens/LoadingScreen.tsx` (a simple screen with a centered ActivityIndicator).
    *   Generates `AuthNavigator.tsx` (stack with Login, SignUp).
    *   Generates `ProfileSetupNavigator.tsx` (stack with screens we'll define in Part 1.2).
    *   Generates `MainAppNavigator.tsx` (stack with screens we'll define later, e.g., `MatchScreen`).
    *   Generates `AppNavigator.tsx` (root conditional logic):
        ```typescript
        // src/navigation/AppNavigator.tsx
        import React, { useEffect } from 'react';
        import { NavigationContainer } from '@react-navigation/native';
        import { createNativeStackNavigator } from '@react-navigation/native-stack';
        import { useAuthStore } from '../store/authStore';

        import AuthNavigator from './AuthNavigator';
        import ProfileSetupNavigator from './ProfileSetupNavigator';
        import MainAppNavigator from './MainAppNavigator';
        import LoadingScreen from '../screens/LoadingScreen';
        import { RootStackParamList } from './types';

        const RootStack = createNativeStackNavigator<RootStackParamList>();

        const AppNavigator = () => {
          const { session, profile, isLoading, initializeAuthListener, isOnboarded } = useAuthStore();

          useEffect(() => {
            const unsubscribe = initializeAuthListener();
            return () => {
              unsubscribe(); // Cleanup listener on unmount
            };
          }, [initializeAuthListener]);

          if (isLoading) {
            return <LoadingScreen />; // Or a more branded splash screen
          }

          return (
            <NavigationContainer>
              <RootStack.Navigator screenOptions={{ headerShown: false }}>
                {session && profile ? (
                  isOnboarded ? ( // or check profile.onboarding_step === 'completed'
                    <RootStack.Screen name="MainApp" component={MainAppNavigator} />
                  ) : (
                    <RootStack.Screen name="ProfileSetup" component={ProfileSetupNavigator} />
                  )
                ) : (
                  <RootStack.Screen name="Auth" component={AuthNavigator} />
                )}
              </RootStack.Navigator>
            </NavigationContainer>
          );
        };

        export default AppNavigator;
        ```
*   **Instruction:** "In `App.tsx`, ensure `AppNavigator` is rendered and `ThemeProvider` wraps it. Remove the placeholder `AuthProvider` if it was added previously, as Zustand doesn't typically need it."
*   **LLM Action:** Updates `App.tsx`:
    ```typescript
    // App.tsx
    import React from 'react';
    import { ThemeProvider } from '@rneui/themed';
    import { theme } from './src/styles/theme';
    import AppNavigator from './src/navigation/AppNavigator';
    import { SafeAreaProvider } from 'react-native-safe-area-context'; // Important for RNE and notches

    export default function App() {
      return (
        <SafeAreaProvider> {/* Add SafeAreaProvider */}
          <ThemeProvider theme={theme}>
            <AppNavigator />
          </ThemeProvider>
        </SafeAreaProvider>
      );
    }
    ```
Use code with caution.
Human Checkpoint 1.1:
Auth screens UI generated? Inputs work? Buttons call store actions?
Auth store logic for sign-in/sign-up correct? Error/loading states handled?
Navigation logic:
Does it show Loading screen initially?
Does it go to Auth screens if not logged in?
If logged in but profile incomplete -> ProfileSetup (placeholder for now)?
If logged in and profile complete -> MainApp (placeholder for now)?
Supabase profiles table and RLS policies SQL generated correctly?
Supabase handle_new_user trigger SQL correct?
authStore.fetchUserProfile works?
initializeAuthListener correctly sets session, user, and fetches profile?
This iterative process will continue for every feature.
Next Steps (High-Level for LLM to anticipate):
Part 1.2: Profile Creation (Onboarding)
ProfileDetailsScreen.tsx: Name, DOB, Gender, Orientation, Location, Bio, Photo Upload (to Supabase Storage). On save, updates profiles table in Supabase via authStore.updateUserProfile and sets onboarding_step to music_prefs. Navigates.
MusicPreferencesScreen.tsx: Connect Spotify/Apple Music (placeholder buttons for now, API integration later). Manual input for favorite genres, artists, eras. On save, creates related records in new Supabase tables (user_genres, user_artists linked to profiles.id) and updates profiles.onboarding_step to completed and is_profile_complete to true. Navigates to Main App.
Supabase tables: genres (pre-populated list), artists (can grow), user_favorite_genres (join table user_id, genre_id), user_favorite_artists (join table user_id, artist_id).
Part 1.3: Basic Matching (MVP Display)
MatchFeedScreen.tsx (in MainAppNavigator):
Fetches a list of other completed profiles from Supabase.
MVP: Simple criteria (e.g., different from self, maybe random or by created_at).
Displays them as cards (Photo, Name, Age, Top 1-2 music genres).
No swiping yet, just display.
Zustand store: matchStore.ts to hold potential matches, loading state.
Supabase Edge Function or direct query: get_potential_matches(currentUserId, filters).
I will stop here for this iteration. This level of detail needs to be applied to every single feature you listed in the original request. The key is:
Define Data (Supabase): Tables, columns, types, relationships, RLS.
Define Backend Logic (Supabase): Edge Functions or direct queries/RPCs.
Define State (Zustand): What data needs to be globally accessible or persisted client-side? What actions modify it?
Define UI (React Native Screens/Components): What does it look like? How does the user interact? What local state does it need? How does it use the Zustand store and service functions?
Define Services (src/services): Functions that encapsulate calls to Supabase backend logic.
Define Navigation: How does this screen/feature fit into the app flow?
Define Types (TypeScript): For all data structures, function parameters, component props.
Iterate and Test (Conceptually for LLM): "LLM, if the user does X, what should happen? Is data Y updated correctly in state Z and table T?"






"LLM, we are continuing to build Findinglyra. You are my lead engineer. Follow these precise, step-by-step instructions for UI/UX design, component implementation, state management, and backend interaction. We are using TypeScript, React Native Elements (RNE) for UI, Zustand for state, and Supabase for backend. Aim for a professional, polished feel like Tinder or Hinge, but with our unique music focus."
Phase 1: MVP - Core Functionality (Continued)
Part 1.2: Profile Creation (Onboarding - "Telling Us About You and Your Music")
Goal: Guide the new user through providing essential profile details and their initial music tastes. This data is crucial for matching.
1.2.1. Define Supabase Tables for Music Preferences (Conceptual for LLM):
* Instruction: "LLM, we need tables to store music preferences. Define the SQL DDL for the following tables. Ensure appropriate foreign keys, indexes for common queries, and RLS policies."
* genres table:
* id (SERIAL, primary key -- or UUID if you prefer consistency)
* name (TEXT, unique, not null -- e.g., 'Rock', 'Indie Pop', 'Electronic', 'Hip Hop')
* slug (TEXT, unique, not null -- e.g., 'rock', 'indie-pop', for URL-friendly identifiers)
* created_at (TIMESTAMPTZ, default now())
* RLS: Publicly readable. Admin/service_role write.
* artists table: (This table might grow very large; consider how it's populated. Initially, users can add to it, or we can pre-populate with popular ones. For MVP, users can type them, and we store them distinctively).
* id (SERIAL or UUID, primary key)
* name (TEXT, unique, not null -- e.g., 'Florence + The Machine', 'Tame Impala')
* spotify_id (TEXT, unique, nullable -- for future integration)
* apple_music_id (TEXT, unique, nullable -- for future integration)
* created_at (TIMESTAMPTZ, default now())
* RLS: Publicly readable. Users can insert if it doesn't exist (via a function), or admin/service_role write.
* user_favorite_genres (Join Table):
* user_id (UUID, primary key, references public.profiles(id) ON DELETE CASCADE)
* genre_id (INTEGER or UUID, primary key, references public.genres(id) ON DELETE CASCADE)
* created_at (TIMESTAMPTZ, default now())
* RLS: User can insert/delete their own. User can read their own. Others cannot read directly (match algorithm will use it).
* user_favorite_artists (Join Table):
* user_id (UUID, primary key, references public.profiles(id) ON DELETE CASCADE)
* artist_id (INTEGER or UUID, primary key, references public.artists(id) ON DELETE CASCADE)
* created_at (TIMESTAMPTZ, default now())
* RLS: Similar to user_favorite_genres.
* user_top_tracks_spotify / user_top_tracks_apple_music (For later API integration):
* user_id (UUID, references public.profiles(id))
* track_name (TEXT)
* artist_name (TEXT)
* album_name (TEXT)
* track_spotify_id (TEXT, unique with user_id)
* ranking (INTEGER, e.g., 1-50 for top 50 tracks)
* time_range (TEXT, e.g., 'short_term', 'medium_term', 'long_term' for Spotify)
* retrieved_at (TIMESTAMPTZ)
* RLS: User can manage their own.
* LLM Action: Generates the SQL DDL for these tables, including primary keys, foreign keys, indexes (on foreign keys and name/slug fields), and RLS policies.
* Instruction: "Update src/types/supabase.ts by simulating the output of supabase gen types typescript ... to include these new tables and their row/insert/update types."
* LLM Action: Updates src/types/supabase.ts.
1.2.2. LLM, Create Profile Details Screen (ProfileDetailsScreen.tsx):
* Navigation Context: This screen is part of the ProfileSetupNavigator. It's the first step after successful signup/login if the profile is incomplete.
* File Location: src/screens/ProfileSetup/ProfileDetailsScreen.tsx
* UI/UX Design & Logic - Instructions for LLM:
1. Screen Layout:
* Header: Use RNE Header component. Title: "Tell Us About You". No back button for the first step, or if present, carefully consider its behavior (does it go back to login?). For MVP, maybe omit back button here.
* Progress Indicator (Optional but Recommended): A simple bar or series of dots at the top showing "Step 1 of X" (e.g., 1 of 2 for Profile Details -> Music Prefs).
* Form Container: A ScrollView to accommodate all fields, especially on smaller screens. Add padding.
2. Input Fields (Using RNE Input and other suitable components):
* Full Name:
* Input label: "Full Name"
* Placeholder: "e.g., Alex Ryder"
* leftIcon: person-outline (material-community icon)
* State: fullName, setFullName (useState)
* Validation: Required. Min length 2.
* Username (Optional for MVP, can be auto-generated or set later):
* Input label: "Username (optional)"
* Placeholder: "e.g., alex_musiclover"
* leftIcon: at (material-community icon)
* State: username, setUsername
* Validation (if provided): Min length 3, alphanumeric, underscores. Check availability later if unique.
* Date of Birth:
* UI: A Button styled like an input field showing "Select Date of Birth" or the selected date. Tapping it opens a date picker.
* Component: Use @react-native-community/datetimepicker for native date picking. Wrap its usage in a custom component or hook for easier handling.
* leftIcon on the button: calendar-outline
* State: dateOfBirth: Date | null, setDateOfBirth
* Validation: Required. User must be 18+. Calculate age and verify.
* Gender Identity:
* UI: A Button "Select Gender Identity" opening a modal/bottom sheet with options (e.g., 'Woman', 'Man', 'Non-binary', 'Prefer to self-describe', 'Prefer not to say'). For 'Prefer to self-describe', show a text input.
* Component: RNE BottomSheet or a custom modal. Use RNE CheckBox or ListItem for selectable options.
* State: genderIdentity: string | null, setGenderIdentity; customGenderIdentity: string
* Validation: Required (can be 'Prefer not to say').
* Sexual Orientation:
* UI: Similar to Gender Identity, a Button "Select Orientation(s)" opening a modal/bottom sheet allowing multiple selections (e.g., 'Straight', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 'Asexual', 'Queer', 'Questioning', 'Prefer to self-describe').
* State: sexualOrientations: string[], setSexualOrientations
* Validation: Required (at least one selection, or 'Prefer not to say' equivalent).
* Location (Text for MVP):
* Input label: "Your City"
* Placeholder: "e.g., Brooklyn, NY"
* leftIcon: map-marker-outline
* State: locationText, setLocationText
* Validation: Required.
* Bio:
* Input label: "Your Bio (max 500 chars)"
* Placeholder: "A little about yourself and what you're looking for..."
* multiline={true}, numberOfLines={4}
* Character counter displayed below the input.
* State: bio, setBio
* Validation: Optional, max 500 chars.
* Profile Photo Upload (Crucial for Dating App):
* UI: A large square or circular area with a placeholder icon (e.g., camera-plus-outline) and text "Add Photo". If a photo is selected, display the image preview here. Allow tapping to change/remove.
* Component: Use react-native-image-picker or expo-image-picker.
* State: avatarFile: ImagePickerAsset | null, setAvatarFile; avatarPreviewUrl: string | null
* Validation: At least one photo required.
3. 'Next' Button:
* RNE Button title: "Next: Music Tastes" or "Save & Continue".
* Style: Prominent, full-width or large.
* Disabled state if required fields are not filled or invalid.
* loading prop tied to isLoading from authStore or local loading state.
4. Data Handling & Navigation:
* On "Next" tap:
* Perform all client-side validations. If any fail, show clear error messages near the respective fields or an Alert.
* If photo selected (avatarFile):
* Upload to Supabase Storage:
* Create a service function uploadProfileImage(userId: string, file: ImagePickerAsset): Promise<{ publicUrl: string | null, error: Error | null }> in src/services/storageService.ts.
* This function will:
* Generate a unique file path (e.g., public/avatars/${userId}/${Date.now()}.${file.fileName.split('.').pop()}).
* Use supabase.storage.from('user_files').upload(filePath, file) (assuming 'user_files' bucket, 'avatars' folder). Adjust bucket/folder names as needed.
* Get the public URL using supabase.storage.from('user_files').getPublicUrl(filePath).
* Call this service function.
* Prepare profileData object for authStore.updateUserProfile. Include full_name, date_of_birth (formatted as ISO string), gender_identity, sexual_orientations, location_text, bio. If photo uploaded successfully, include avatar_url.
* Set onboarding_step to 'music_prefs' in the profileData.
* Call await useAuthStore.getState().updateUserProfile(profileData).
* If successful: navigation.navigate('MusicPreferences').
* If error (from upload or profile update): Show an Alert.
* LLM Action:
* Generates src/screens/ProfileSetup/ProfileDetailsScreen.tsx with the specified UI elements, state management, validation logic, and interaction with authStore and a (to be created) storageService.
* Generates src/services/storageService.ts with the uploadProfileImage function stub. (Supabase Storage policies for the bucket need to allow authenticated users to upload to their own folder paths).
1.2.3. LLM, Create Music Preferences Screen (MusicPreferencesScreen.tsx):
* Navigation Context: This screen is part of ProfileSetupNavigator, typically navigated to from ProfileDetailsScreen.
* File Location: src/screens/ProfileSetup/MusicPreferencesScreen.tsx
* UI/UX Design & Logic - Instructions for LLM:
1. Screen Layout:
* Header: RNE Header. Title: "Your Music Vibe". Back button to ProfileDetailsScreen.
* Progress Indicator: "Step 2 of 2".
* Container: ScrollView.
2. Music Service Connection (Prominent Section - Placeholder for MVP functionality):
* UI: A visually appealing section with:
* Text: "Connect your music accounts to auto-magically import your tastes!"
* RNE Button with Spotify logo: "Connect Spotify".
* RNE Button with Apple Music logo: "Connect Apple Music".
* Action (MVP): Buttons are present but disabled or show an "Coming Soon!" Alert on tap. Full API integration is a later step.
3. Manual Music Input Section (Crucial for MVP and users not connecting services):
* Section Title: "Or, tell us manually..."
* Favorite Genres (Multi-select):
* UI: Display a list of common genres (e.g., from genres table fetched from Supabase, or a hardcoded list for MVP). Each genre as an RNE Chip or CheckBox + Text. Allow selecting 3-5 genres.
* Component: Fetch genres from Supabase (create src/services/musicService.ts with fetchGenres(): Promise<Genre[]>).
* Display selected genres clearly (e.g., chips change color).
* State: selectedGenreIds: number[], setSelectedGenreIds.
* Validation: Min 1, Max 5 genres.
* Favorite Artists (Tag-like input):
* UI: An RNE Input field. As user types, it could suggest artists (from artists table if populated, or just allow free text for MVP). When user presses enter or comma, the typed text becomes a "tag" displayed below the input. Allow adding up to 5-10 artists. Each tag should have an 'x' to remove it.
* Component: Custom component for tag input, or a library if available.
* State: favoriteArtists: string[], setFavoriteArtists. (These strings will be used to find/create artist records in Supabase).
* Validation: Min 1, Max 10 artists.
* Favorite Eras (Optional, Single or Multi-select):
* UI: Similar to genres, a list of eras (e.g., '60s', '70s', '80s', '90s', '2000s', '2010s', '2020s') as Chip or CheckBox.
* State: selectedEras: string[], setSelectedEras.
4. 'Finish & Find Matches!' Button:
* RNE Button title: "Let's Find Your Lyra!" or "Complete Profile".
* Style: Prominent, full-width.
* Disabled if minimum music preferences are not met.
* loading prop tied to local loading state.
5. Data Handling & Navigation:
* On "Finish" tap:
* Perform client-side validations (min genres/artists).
* Save Music Preferences to Supabase:
* Create a service function saveUserMusicPreferences(userId: string, genreIds: number[], artistNames: string[], eraNames: string[]): Promise<{ error: Error | null }> in musicService.ts.
* This function will:
* For artistNames: For each name, try to find it in artists table. If not found, insert it. Get all artist_ids.
* Delete existing user_favorite_genres and user_favorite_artists for the user (to handle edits).
* Insert new records into user_favorite_genres (user_id, genre_id).
* Insert new records into user_favorite_artists (user_id, artist_id).
* (Save eras if this feature is implemented, maybe in a JSONB column in profiles or a separate table).
* Call this service function.
* If music preferences saved successfully:
* Prepare profileData to update is_profile_complete to true and onboarding_step to 'completed'.
* Call await useAuthStore.getState().updateUserProfile(profileData).
* If all successful: The AppNavigator's conditional logic will automatically navigate to the MainAppNavigator because isOnboarded in authStore will become true.
* If error: Show an Alert.
* LLM Action:
* Generates src/screens/ProfileSetup/MusicPreferencesScreen.tsx with specified UI, state, validation, and interaction with musicService.ts.
* Generates/updates src/services/musicService.ts with fetchGenres and saveUserMusicPreferences function stubs/implementations.
1.2.4. LLM, Update ProfileSetupNavigator.tsx:
* Instruction: "Ensure ProfileSetupNavigator.tsx (a createNativeStackNavigator) includes routes for ProfileDetails (initial route) and MusicPreferences."
* LLM Action: Modifies src/navigation/ProfileSetupNavigator.tsx:
```typescript
// src/navigation/ProfileSetupNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileDetailsScreen from '../screens/ProfileSetup/ProfileDetailsScreen';
import MusicPreferencesScreen from '../screens/ProfileSetup/MusicPreferencesScreen';
import { ProfileSetupStackParamList } from './types';
const Stack = createNativeStackNavigator<ProfileSetupStackParamList>();

    const ProfileSetupNavigator = () => {
      return (
        <Stack.Navigator
          // screenOptions={{ headerShown: false }} // Or configure headers per screen
        >
          <Stack.Screen
            name="ProfileDetails"
            component={ProfileDetailsScreen}
            options={{ title: 'Your Details' }} // Example header title
          />
          <Stack.Screen
            name="MusicPreferences"
            component={MusicPreferencesScreen}
            options={{ title: 'Your Music Vibe' }}
          />
        </Stack.Navigator>
      );
    };

    export default ProfileSetupNavigator;
    ```
Use code with caution.
Human Checkpoint 1.2:
ProfileDetailsScreen:
UI looks professional? All fields present? Icons correct?
Date picker works? Age validation (18+)?
Gender/Orientation selection modals/sheets work?
Photo picker launches? Preview shows?
Client-side validation messages clear and accurate?
Data successfully saved to profiles table in Supabase (including avatar_url if photo uploaded)?
onboarding_step correctly updated in profiles table?
Navigation to MusicPreferencesScreen on success?
MusicPreferencesScreen:
UI looks good? Connect Service buttons are placeholders?
Manual genre selection works? Fetches genres?
Manual artist tag input works?
Client-side validation for min selections?
Data successfully saved to user_favorite_genres and user_favorite_artists? New artists added to artists table?
is_profile_complete and onboarding_step correctly updated in profiles table?
App automatically navigates to MainAppNavigator after completion?
musicService.ts and storageService.ts functions correctly interact with Supabase?
Supabase tables for music have correct DDL and RLS?
This level of UI/UX prompting, combined with the data and logic instructions, gives the LLM a much clearer picture. For subsequent features (Match Feed, Harmony Score, Chat, etc.), we would continue this pattern:
Goal of the Feature/Screen.
Data Model (Supabase): Any new tables, columns, RLS?
Backend Logic (Supabase Functions/RPCs): What processing is needed?
Client-Side State (Zustand): New stores or additions to existing ones?
Service Layer (src/services): Functions to call backend.
UI/UX Detailed Breakdown for each Screen/Component:
Layout (header, main content area, footer/tabs).
Specific RNE components to use (or custom if needed).
Visuals: Icons, colors (from theme), typography, spacing, imagery.
Interactions: Button taps, swipes, input changes, modal openings.
Animations/Transitions (if any, keep simple for MVP).
Loading states (skeletons, spinners).
Empty states (no data, no matches).
Error states (clear messages, retry options).
Navigation: How is this screen reached? Where does it go?
TypeScript Types.