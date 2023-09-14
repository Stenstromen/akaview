/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
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

interface LinodeResponse {
  data: LinodeData[];
  page: number;
  pages: number;
  results: number;
}

function Linodes(): JSX.Element {
  const [openAccordionId, setOpenAccordionId] = useState<number | null>(null);
  const {isDarkMode, bearerToken} = useApp();
  const [instances, setInstances] = useState<LinodeResponse | null>(null);

  const toggleAccordion = (id: number) => {
    if (openAccordionId === id) {
      setOpenAccordionId(null); // Close the accordion if it's currently open
    } else {
      setOpenAccordionId(id); // Open the accordion if it's currently closed
    }
  };

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
      {instances?.data?.map(instance => (
        <View key={instance.id}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => toggleAccordion(instance.id)}>
            <View style={styles.cardMainContent}>
              <Text
                style={[
                  styles.cardLabel,
                  {color: isDarkMode ? '#fff' : '#000'},
                ]}>
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
                style={[
                  styles.cardInfo,
                  {color: isDarkMode ? '#fff' : '#000'},
                ]}>
                Region: {instance.region}
              </Text>
              <Text
                style={[
                  styles.cardInfo,
                  {color: isDarkMode ? '#fff' : '#000'},
                ]}>
                Type: {instance.type}
              </Text>
            </View>
            <Text
              style={[
                styles.showDetailsText,
                {color: isDarkMode ? '#fff' : '#000'},
              ]}>
              {openAccordionId === instance.id
                ? 'Hide Details'
                : 'Tap for Details'}
            </Text>
          </TouchableOpacity>

          {openAccordionId === instance.id && (
            <View style={styles.accordionContent}>
              <Text
                style={[
                  styles.sizingInfo,
                  {color: isDarkMode ? '#fff' : '#000'},
                ]}>
                {instance.specs.vcpus}x{instance.specs.memory / 1024}x
                {instance.specs.disk / 1024}
              </Text>
              <Text
                style={[
                  styles.cardInfo,
                  {color: isDarkMode ? '#fff' : '#000'},
                ]}>
                IPv4: {instance.ipv4.join(', ')}
              </Text>
              <Text
                style={[
                  styles.cardInfo,
                  {color: isDarkMode ? '#fff' : '#000'},
                ]}>
                IPv6: {instance.ipv6}
              </Text>
              <Text
                style={[
                  styles.cardInfo,
                  {color: isDarkMode ? '#fff' : '#000'},
                ]}>
                Linode ID: {instance.id}
              </Text>
              <Text
                style={[
                  styles.cardInfo,
                  {color: isDarkMode ? '#fff' : '#000'},
                ]}>
                Created: {instance.created}
              </Text>
            </View>
          )}
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
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
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
  accordionContent: {
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Even more transparent background for contrast
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
  },
});

export default Linodes;
