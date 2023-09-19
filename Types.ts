export type TokenType = {
  token: string;
  refreshToken: string;
  expiresIn: number;
};

interface LinodeData {
  alerts: object[];
  backups: {
    available: boolean;
    enabled: boolean;
    last_successful: string;
    schedule: {
      day: string;
      window: string;
    };
  };
  created: string;
  group: string;
  has_user_data: boolean;
  host_uuid: string;
  hypervisor: string;
  id: number;
  image: string;
  ipv4: string[];
  ipv6: string;
  label: string;
  region: string;
  specs: {
    disk: number;
    memory: number;
    transfer: number;
    vcpus: number;
  };
  status: string;
  tags: string[];
  type: string;
  updated: string;
  watchdog_enabled: boolean;
}

export interface LinodeResponse {
  data: LinodeData[];
  page: number;
  pages: number;
  results: number;
}

export type AuthResult = {
  type: string;
  url?: string;
};

export type BearerData = {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
};

export type IOSButtonProps = {
  onPress: () => void;
  title: string;
};

export type ProgressBarProps = {
  progress: number;
  width: number;
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
};

interface FirewallData {
  created: string;
  id: number;
  label: string;
  rules: FirewallRules;
  status: 'enabled' | 'disabled'; // You only provided "enabled" but I'm assuming there's also a "disabled" state.
  tags: string[];
  updated: string;
}

interface FirewallRules {
  inbound: FirewallRule[];
  inbound_policy: 'DROP' | 'ACCEPT'; // Assuming inbound_policy can be either DROP or ACCEPT
  outbound: FirewallRule[];
  outbound_policy: 'DROP' | 'ACCEPT'; // Assuming outbound_policy can be either DROP or ACCEPT
}

interface FirewallRule {
  action: 'ACCEPT' | 'DROP'; // Assuming action can be either ACCEPT or DROP
  addresses: FirewallAddresses;
  description: string;
  label: string;
  ports: string;
  protocol: 'TCP' | 'UDP'; // You provided only TCP, but I'm assuming it can also be UDP
}

interface FirewallAddresses {
  ipv4: string[];
  ipv6: string[];
}

export interface FirewallResponse {
  data: FirewallData[];
  page: number;
  pages: number;
  results: number;
}
