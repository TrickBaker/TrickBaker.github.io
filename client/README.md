# InfoCrypting - Digital Contact Card

A secure digital contact card solution with NFC and QR code access. This application allows you to store your contact information and social links in a JSON file and share them via NFC tags or QR codes, with sensitive information protected behind authentication.

## Features

- **NFC & QR Code Access**: Share your contact information with a simple tap or scan
- **Secure Authentication**: Protect sensitive contact details with JWT-based authentication
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Public/Private Information**: Choose what information is publicly accessible and what requires authentication
- **Social Media Integration**: Link to all your social profiles in one place

## Architecture

The application is built with a modern web stack:

- **Frontend**: React.js with Bootstrap for responsive UI
- **Backend**: Node.js with Express for API and authentication
- **Security**: JWT-based authentication, bcrypt for password hashing
- **Data Storage**: JSON file for contact information

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/infocrypting.git
   cd infocrypting
   ```

2. Install dependencies:
   ```
   npm run install-all
   ```

3. Create a `.env` file in the server directory (copy from `.env.example`):
   ```
   cp server/.env.example server/.env
   ```

4. Edit the `.env` file with your own settings:
   ```
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_custom_secret_key
   ADMIN_USERNAME=your_username
   ADMIN_PASSWORD_HASH=your_hashed_password
   ```

   Note: To generate a hashed password, you can use the bcrypt online tools or run:
   ```
   node -e "console.log(require('bcryptjs').hashSync('your_password', 10))"
   ```

5. Edit your contact information in `server/data/contacts.json`

### Running the Application

1. Start the development server:
   ```
   npm start
   ```

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## NFC Tag Setup

To program an NFC tag with your contact card:

1. Use an NFC writing app on your smartphone (e.g., NFC Tools)
2. Select "Write URL" or "Website" option
3. Enter your contact card URL (e.g., https://yourdomain.com/contact)
4. Hold your phone near the NFC tag to write

## Deployment

### Deploying to Heroku

1. Create a Heroku account and install the Heroku CLI
2. Login to Heroku:
   ```
   heroku login
   ```

3. Create a new Heroku app:
   ```
   heroku create your-app-name
   ```

4. Set environment variables:
   ```
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set ADMIN_USERNAME=your_username
   heroku config:set ADMIN_PASSWORD_HASH=your_hashed_password
   heroku config:set NODE_ENV=production
   ```

5. Deploy the application:
   ```
   git push heroku main
   ```

### Deploying to GitHub Pages

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Add the `homepage` field to `package.json`:
   ```json
   {
     "homepage": "https://yourusername.github.io/infocrypting",
     ...
   }
   ```

3. Install the `gh-pages` package:
   ```bash
   npm install --save-dev gh-pages
   ```

4. Add deployment scripts to `package.json`:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

5. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

6. Configure GitHub Pages:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Source", select "gh-pages" branch
   - Save the changes

Note: This deployment is for the frontend only. The application will run in demo mode without backend functionality. To use the full application with authentication and data storage, you'll need to deploy the backend separately.

## Security Considerations

- The JWT secret key should be kept secure and not committed to the repository
- In production, use HTTPS to encrypt data in transit
- Regularly update dependencies to patch security vulnerabilities
- Consider implementing rate limiting to prevent brute force attacks

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [Bootstrap](https://getbootstrap.com/)
- [JWT](https://jwt.io/) 