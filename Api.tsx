import {TokenType} from './Types';
import {checkAndRefreshToken} from './Oauth';

const BASE_URL = 'https://api.linode.com/v4';

const apiRequest = async (
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  token: TokenType,
  body?: any,
) => {
  await checkAndRefreshToken();
  console.log(token);

  const options = {
    method,
    headers: {
      Authorization: token.token,
      'Content-Type': 'application/json',
    },
    ...(body && {body: JSON.stringify(body)}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await response.json();
  return data;
};

export const getInstances = async (token: TokenType) =>
  apiRequest('/linode/instances', 'GET', token);

export const getFirewalls = async (token: TokenType) =>
  apiRequest('/networking/firewalls', 'GET', token);

export const getMonthlyTransfer = async (token: TokenType) =>
  apiRequest('/account/transfer', 'GET', token);

export const getUsername = async (token: TokenType) =>
  apiRequest('/profile', 'GET', token);

export const getTickets = async (token: TokenType) =>
  apiRequest('/support/tickets', 'GET', token);
