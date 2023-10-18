# Minimal Chrome Extension OAuth2 Example working with AWS Cognito

Steps to run:

- Load the extension to obtain it's ID
- Create a Cognito User Pool
- Create an App Client with in Cognito User Pool
  - Set the Callback URL to `https://<extension-id>.chromiumapp.org/` (mind the trailing `/`)
- Set the `authServer` in [background.js](scripts/background.js) to the Cognito Domain
- Set the `clientId` in [background.js](scripts/background.js) to the Cognito App Client ID
- Reload the extension
- Browse to [https://example.com](http://example.com) and click the inserted Login button
