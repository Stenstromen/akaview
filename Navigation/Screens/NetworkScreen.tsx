/* eslint-disable react/self-closing-comp */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useApp} from '../../AppContext';
import {getFirewalls, getMonthlyTransfer} from '../../Api';
import {useFocusEffect} from '@react-navigation/native';

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
  const [openAccordionId, setOpenAccordionId] = useState<number | null>(null);
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
  const [refreshing, setRefreshing] = useState(false);

  const toggleAccordion = (id: number) => {
    if (openAccordionId === id) {
      setOpenAccordionId(null); // Close the accordion if it's currently open
    } else {
      setOpenAccordionId(id); // Open the accordion if it's currently closed
    }
  };

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

  const load = () => {
    setRefreshing(true);
    loadFirewalls();
    loadUtilization();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      load();

      return () => {};
    }, []),
  );

  const progress = utilization.quota ? utilization.used / utilization.quota : 0;

  return (
    <View style={{flex: 1, backgroundColor: isDarkMode ? '#333' : '#fff'}}>
      <ScrollView
        style={[
          styles.container,
          {backgroundColor: isDarkMode ? '#333' : '#fff'},
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={load} />
        }>
        {firewalls?.data?.map(firewall => (
          <View key={firewall.id}>
            <TouchableOpacity
              style={[
                styles.card,
                {backgroundColor: isDarkMode ? '#444' : '#fff'},
              ]}
              onPress={() => toggleAccordion(firewall.id)}>
              <Text
                style={[
                  styles.cardLabel,
                  {color: isDarkMode ? '#fff' : '#000'},
                ]}>
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
                style={[
                  styles.cardInfo,
                  {color: isDarkMode ? '#fff' : '#000'},
                ]}>
                Default Inbound Policy&nbsp; - &nbsp;
                {firewall.rules.inbound_policy}
              </Text>
              <Text
                style={[
                  styles.cardInfo,
                  {color: isDarkMode ? '#fff' : '#000'},
                ]}>
                Default Outboud Policy - {firewall.rules.outbound_policy}
              </Text>
              <Text
                style={[
                  styles.showDetailsText,
                  {color: isDarkMode ? '#fff' : '#000'},
                ]}>
                {openAccordionId === firewall.id
                  ? 'Hide Details'
                  : 'Tap for Details'}
              </Text>
            </TouchableOpacity>

            {openAccordionId === firewall.id && (
              <View style={styles.accordionContent}>
                {/* Add more details here about the firewall's rules or any other data as needed */}
                <Text
                  style={[
                    styles.sizingInfo,
                    {color: isDarkMode ? '#fff' : '#000'},
                  ]}>
                  Rules:
                </Text>
                <Text style={{color: isDarkMode ? '#fff' : '#000'}}>
                  Inbound:
                </Text>
                {firewall.rules.inbound.length ? (
                  firewall.rules.inbound.map((rule, index) => (
                    <Text
                      style={{color: isDarkMode ? '#fff' : '#000'}}
                      key={index}>
                      {rule.label.split('-')[2]}
                    </Text>
                  ))
                ) : (
                  <Text style={{color: isDarkMode ? '#fff' : '#000'}}>
                    No inbound rules
                  </Text>
                )}
                <Text style={{color: isDarkMode ? '#fff' : '#000'}}>
                  Outbound:
                </Text>
                {firewall.rules.outbound.length ? (
                  firewall.rules.outbound.map((rule, index) => (
                    <Text key={index}>{rule.label}</Text>
                  ))
                ) : (
                  <Text style={{color: isDarkMode ? '#fff' : '#000'}}>
                    No outbound rules
                  </Text>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          paddingBottom: 10,
        }}>
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
  accordionContent: {
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Even more transparent background for contrast
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  sizingInfo: {
    fontSize: 20,
    marginBottom: 6,
  },
  showDetailsText: {
    position: 'absolute',
    bottom: 10, // Adjust as needed
    right: 15, // Adjust as needed
    fontSize: 14,
  },
});

export default NetworkScreen;
