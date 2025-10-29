# Frontend Login System Documentation

## Overview
A secure, session-based authentication system has been implemented to protect the entire website. Users must login to access any page.

## Credentials
- **Username**: `Meri Emaan`
- **Password**: `Hussain`

## Features

### 1. Full Site Protection
- All routes are protected behind authentication
- Unauthenticated users are redirected to `/login`
- Direct URL access is blocked without valid credentials
- Session persists for 24 hours

### 2. Login Screen
- Beautiful login interface with the same romantic background animation
- Smooth animations using Framer Motion
- Error handling for invalid credentials
- Loading states with spinner animation
- Fully responsive design

### 3. Session Management
- Uses browser `sessionStorage` for auth tokens
- Automatic session expiry after 24 hours
- Session validation on page load
- Secure logout functionality

### 4. Logout Feature
- Logout button in navigation bar
- Clears session and redirects to login
- Available on all authenticated pages

## Implementation Details

### Files Created/Modified

#### New Files:
1. **`src/components/LoginScreen.jsx`**
   - Main login component
   - Form handling and validation
   - Integration with background animation

2. **`src/context/AuthContext.jsx`**
   - Authentication state management
   - Session validation logic
   - Login/logout functions

#### Modified Files:
1. **`src/App.jsx`**
   - Protected routes implementation
   - Login route configuration
   - Redirect logic

2. **`src/main.jsx`**
   - Added AuthProvider wrapper

3. **`src/components/Navigation.jsx`**
   - Added logout button
   - Integrated auth context

4. **`src/styles/global.css`**
   - Login screen styles
   - Loading screen styles
   - Responsive design

5. **`src/styles/design-system.css`**
   - Logout button styles

## How It Works

### Authentication Flow:
1. User visits any page
2. AuthContext checks sessionStorage for valid token
3. If no token or expired → redirect to `/login`
4. User enters credentials
5. On successful login → token stored in sessionStorage
6. User redirected to home page
7. All routes now accessible

### Logout Flow:
1. User clicks "Logout" button in navigation
2. Session token cleared from sessionStorage
3. User redirected to login page
4. Must re-authenticate to access site

## Security Notes

### Frontend-Only Security
⚠️ **Important**: This is a **frontend-only** authentication system suitable for:
- Private personal websites
- Demo/prototype applications
- Non-sensitive content protection

### Limitations:
- Credentials are stored in component code
- No server-side validation
- Can be bypassed by determined users with dev tools
- Not suitable for production apps with sensitive data

### For Production Use:
If you need true security, consider:
- Backend authentication server
- JWT tokens with server validation
- Environment variables for credentials
- HTTPS encryption
- Rate limiting
- Password hashing

## Customization

### Changing Credentials
Edit `src/components/LoginScreen.jsx`:
```javascript
const CORRECT_USERNAME = 'Your Username';
const CORRECT_PASSWORD = 'Your Password';
```

### Adjusting Session Duration
Edit `src/context/AuthContext.jsx`:
```javascript
const SESSION_DURATION = 24 * 60 * 60 * 1000; // milliseconds
```

### Styling
All styles are in:
- `src/styles/global.css` (Login/Loading screens)
- `src/styles/design-system.css` (Logout button)

## Testing

### Test Login:
1. Navigate to `http://localhost:5173`
2. Should auto-redirect to `/login`
3. Enter username: `Meri Emaan`
4. Enter password: `Hussain`
5. Click "Sign In"
6. Should redirect to home page

### Test Session Persistence:
1. Login successfully
2. Refresh the page
3. Should remain logged in
4. Navigate to different pages
5. Should stay authenticated

### Test Logout:
1. While logged in, click "Logout" in navigation
2. Should redirect to login page
3. Try accessing protected routes
4. Should redirect back to login

## Troubleshooting

### Can't Login:
- Check console for errors
- Verify credentials match exactly (case-sensitive)
- Clear sessionStorage and try again

### Session Not Persisting:
- Check browser sessionStorage is enabled
- Verify SESSION_DURATION is set correctly
- Check for JavaScript errors in console

### Stuck on Login Screen:
- Clear browser cache and sessionStorage
- Check that AuthProvider is properly wrapped in main.jsx
- Verify all routes are properly configured in App.jsx

