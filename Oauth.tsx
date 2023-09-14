import Keychain from 'react-native-keychain';

type BearerData = {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
};

export const SCOPES: string =
  'account:read_only linodes:read_only volumes:read_only nodebalancers:read_only firewall:read_only images:read_only';

export const getTokenDetailsFromKeychain = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        'Credentials successfully loaded for user ' + credentials.username,
      );
      return JSON.parse(credentials.password);
    }
    return null;
  } catch (error) {
    console.log("Keychain couldn't be accessed!", error);
    return null;
  }
};

export async function checkAndRefreshToken() {
  const tokenDetails = await getTokenDetailsFromKeychain();
  if (tokenDetails) {
    if (Date.now() >= tokenDetails.expiresIn) {
      // Token is expired or about to expire soon, refresh it
      await refreshTokenDetails(tokenDetails.refreshToken);
    }
  }
}

async function refreshTokenDetails(refreshToken: string): Promise<void> {
  const response = await fetch(
    'https://akaview-oauth.stenstromen.workers.dev/refresh',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=refresh_token&client_id=a19ae26298d859431efe&refresh_token=${refreshToken}`,
    },
  );

  if (response.ok) {
    const data: BearerData = await response.json();
    const token =
      data.token_type.charAt(0).toUpperCase() +
      data.token_type.slice(1) +
      ' ' +
      data.access_token;
    const newRefreshToken = data.refresh_token;
    const expiresIn = Date.now() + data.expires_in * 1000; // Convert expiresIn to a future timestamp
    await saveTokenToKeychain(token, newRefreshToken, expiresIn);
  } else {
    throw new Error('Failed to refresh token');
  }
}

async function saveTokenToKeychain(
  token: string,
  refreshToken: string,
  expiresIn: number,
): Promise<void> {
  try {
    await Keychain.setGenericPassword(
      'bearerToken',
      JSON.stringify({token, refreshToken, expiresIn}),
    );
    //setBearerToken({token, refreshToken, expiresIn});
    console.log('Token details saved to keychain');
  } catch (error) {
    console.error('Failed to save token details to keychain:', error);
  }
}
