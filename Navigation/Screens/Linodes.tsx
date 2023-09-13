/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useApp} from '../../AppContext';
import {getInstances} from '../../Api';

interface LinodeData {
  alerts: object[];
  backups: object[];
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
  specs: object[];
  status: string;
  tags: string[];
  type: string;
  updated: string;
  watchdog_enabled: boolean;
}

interface LinodeResponse {
  data: LinodeData[];
  page: number;
  pages: number;
  results: number;
}

function Linodes(): JSX.Element {
  const {isDarkMode, bearerToken} = useApp();
  const [instances, setInstances] = useState<LinodeResponse | null>(null);

  useEffect(() => {
    const loadInstances = async () => {
      const instancess = await getInstances(bearerToken);
      setInstances(instancess);
    };
    loadInstances();
  }, [bearerToken]);

  return (
    <ScrollView
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#333' : '#fff'},
      ]}>
      {instances?.data.map(instance => (
        <View style={styles.card} key={instance.id}>
          <View style={styles.cardMainContent}>
            <Text
              style={[styles.cardLabel, {color: isDarkMode ? '#fff' : '#000'}]}>
              {instance.label}
            </Text>
            <Text
              style={[
                styles.cardStatus,
                {color: instance.status === 'running' ? 'green' : 'red'},
              ]}>
              {instance.status}
            </Text>
            <Text
              style={[styles.cardInfo, {color: isDarkMode ? '#fff' : '#000'}]}>
              Region: {instance.region}
            </Text>
            <Text
              style={[styles.cardInfo, {color: isDarkMode ? '#fff' : '#000'}]}>
              Type: {instance.type}
            </Text>
          </View>

          <View style={styles.cardSecondaryContent}>
            <Text
              style={[styles.cardInfo, {color: isDarkMode ? '#fff' : '#000'}]}>
              IPv4: {instance.ipv4.join(', ')}
            </Text>
            <Text
              style={[styles.cardInfo, {color: isDarkMode ? '#fff' : '#000'}]}>
              IPv6: {instance.ipv6}
            </Text>
            <Text
              style={[styles.cardInfo, {color: isDarkMode ? '#fff' : '#000'}]}>
              Created: {instance.created}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slightly transparent white
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardMainContent: {
    flex: 1, // occupy as much space as available
  },
  cardSecondaryContent: {
    flex: 0.5, // occupy half the space of main content
    alignItems: 'flex-end', // align content to the right
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

export default Linodes;
