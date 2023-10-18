const clientId = "YOUR_CLIENT_ID";
const authServer = "YOUR_COGNITO_DOMAIN";
const scopes = "openid email";

const authorizationEndpoint = `${authServer}/oauth2/authorize`;
const tokenEndpoint = `${authServer}/oauth2/token`;
const userInfoEndpoint = `${authServer}/oauth2/userInfo`;

const redirectURL = chrome.identity.getRedirectURL();

async function login() {
  // Construct the url to start the login flow

  const authParams = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectURL,
    scope: scopes,
    // code_challenge_method: 'S256', // TODO Add PKCE
    // code_challenge: TODO GENERATE CODE CHALLENGE (e.g. using https://www.npmjs.com/package/pkce-challenge )
  });
  const authURL = `${authorizationEndpoint}?${authParams}`;

  // Start the login flow
  const responseUrl = await chrome.identity.launchWebAuthFlow({
    url: authURL,
    interactive: true,
  });
  console.log({ responseUrl });

  // Extract the authorization code from the response url
  const authorizationCode = new URL(responseUrl).searchParams.get("code");
  console.log({ authorizationCode });

  // Obtain access and ID tokens using the authorization code
  const tokenParams = new URLSearchParams({
    code: authorizationCode,
    grant_type: "authorization_code",
    redirect_uri: redirectURL,
    client_id: clientId,
    // code_verifier: TODO ADD CODE VERIFIER
  });

  const tokenUrl = `${tokenEndpoint}?${tokenParams}`;
  console.log({ tokenUrl });
  const tokens = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  }).then((response) => response.json());

  console.log(tokens);

  // Use the access token to get user info

  const userInfo = await fetch(userInfoEndpoint, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  }).then((response) => response.json());
  console.log({ userInfo });

  // Use the refresh token to get a new access token

  const newTokenParams = new URLSearchParams({
    refresh_token: tokens.refresh_token,
    grant_type: "refresh_token",
    client_id: clientId,
  });

  const newTokens = await fetch(`${tokenEndpoint}?${newTokenParams}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  }).then((response) => response.json());

  console.log({ newTokens });

  return userInfo;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request?.action === "login") {
    login()
      .then((user) => sendResponse({ user }))
      .catch((error) => sendResponse({ error }));
    return true;
  }
});
