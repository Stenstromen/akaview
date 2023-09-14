/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useApp} from '../../AppContext';
import {getFirewalls, getMonthlyTransfer} from '../../Api';

type ProgressBarProps = {
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

interface FirewallResponse {
  data: FirewallData[];
  page: number;
  pages: number;
  results: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  width,
  height = 10,
  backgroundColor = '#D3D3D3',
  progressColor = '#007AFF',
}) => (
  <View style={[{width, height, backgroundColor, borderRadius: height / 2}]}>
    <View
      style={{
        width: `${progress * 100}%`,
        height,
        backgroundColor: progressColor,
        borderRadius: height / 2,
      }}></View>
  </View>
);

function NetworkScreen(): JSX.Element {
  const {isDarkMode, bearerToken} = useApp();
  const [firewalls, setFirewalls] = useState<FirewallResponse>({
    data: [],
    page: 0,
    pages: 0,
    results: 0,
  });
  const [utilization, setUtilization] = useState<{
    quota: number;
    used: number;
  }>({
    quota: 0,
    used: 0,
  });

  useEffect(() => {
    const loadFirewalls = async () => {
      const res = await getFirewalls(bearerToken);
      console.log(res);
      setFirewalls(res);
    };
    const loadUtilization = async () => {
      const res = await getMonthlyTransfer(bearerToken);
      console.log(res);
      setUtilization(res);
    };
    loadFirewalls();
    loadUtilization();
  }, [bearerToken]);

  const progress = utilization.quota ? utilization.used / utilization.quota : 0;

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#333' : '#fff'},
      ]}>
      {firewalls?.data?.map(firewall => (
        <View
          key={firewall.id}
          style={[
            styles.card,
            {backgroundColor: isDarkMode ? '#444' : '#fff'},
          ]}>
          <Text
            style={[styles.cardLabel, {color: isDarkMode ? '#fff' : '#000'}]}>
            {firewall.label}
          </Text>
          <Text
            style={[
              styles.cardStatus,
              {color: firewall.status === 'enabled' ? 'green' : 'red'},
            ]}>
            {firewall.status}
          </Text>
          <Text
            style={[styles.cardInfo, {color: isDarkMode ? '#fff' : '#000'}]}>
            Default Inbound Policy&nbsp; - &nbsp;{firewall.rules.inbound_policy}
          </Text>
          <Text
            style={[styles.cardInfo, {color: isDarkMode ? '#fff' : '#000'}]}>
            Default Outboud Policy - {firewall.rules.outbound_policy}
          </Text>
        </View>
      ))}

      <View style={{flexDirection: 'column', alignItems: 'center'}}>
        <Text style={{marginTop: 15, color: isDarkMode ? '#fff' : '#000'}}>
          Monthly Network Transfer Pool
        </Text>
        <ProgressBar
          progress={progress}
          width={300}
          backgroundColor={isDarkMode ? '#555' : '#D3D3D3'}
          progressColor={isDarkMode ? '#00BCD4' : '#007AFF'}
        />
        <Text style={{marginTop: 5, color: isDarkMode ? '#fff' : '#000'}}>
          {utilization.used} / {utilization.quota} - GB
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 10,
    padding: 15,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardInfo: {
    fontSize: 14,
    marginBottom: 3,
  },
});

export default NetworkScreen;
