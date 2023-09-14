import {checkAndRefreshToken} from './Oauth';

export const getInstances = async (token: {
  token: string;
  refreshToken: string;
  expiresIn: number;
}) => {
  await checkAndRefreshToken();
  console.log(token);
  const response = await fetch('https://api.linode.com/v4/linode/instances', {
    method: 'GET',
    headers: {
      Authorization: token.token,
    },
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export const getFirewalls = async (token: {
  token: string;
  refreshToken: string;
  expiresIn: number;
}) => {
  await checkAndRefreshToken();
  console.log(token);
  const response = await fetch(
    'https://api.linode.com/v4/networking/firewalls',
    {
      method: 'GET',
      headers: {
        Authorization: token.token,
      },
    },
  );
  const data = await response.json();
  console.log(data);
  return data;
};

export const getMonthlyTransfer = async (token: {
  token: string;
  refreshToken: string;
  expiresIn: number;
}) => {
  await checkAndRefreshToken();
  console.log(token);
  const response = await fetch('https://api.linode.com/v4/account/transfer', {
    method: 'GET',
    headers: {
      Authorization: token.token,
    },
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export const getUsername = async (token: {
  token: string;
  refreshToken: string;
  expiresIn: number;
}) => {
  await checkAndRefreshToken();
  console.log(token);
  const response = await fetch('https://api.linode.com/v4/profile', {
    method: 'GET',
    headers: {
      Authorization: token.token,
    },
  });
  const data = await response.json();
  console.log(data);
  return data;
};
