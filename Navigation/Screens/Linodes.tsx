/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {useApp} from '../../AppContext';
import {getInstances} from '../../Api';
import {humanReadableDate} from '../../Utils';
import {useFocusEffect} from '@react-navigation/native';
import {LinodeResponse} from '../../Types';
import {getTokenDetailsFromKeychain} from '../../Oauth';

function Linodes(): JSX.Element {
  const [openAccordionId, setOpenAccordionId] = useState<number | null>(null);
  const {isDarkMode, bearerToken, setBearerToken} = useApp();
  const [instances, setInstances] = useState<LinodeResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const toggleAccordion = (id: number) => {
    if (openAccordionId === id) {
      setOpenAccordionId(null); // Close the accordion if it's currently open
    } else {
      setOpenAccordionId(id); // Open the accordion if it's currently closed
    }
  };

  const loadInstances = async () => {
    setRefreshing(true); // Start the refresh
    const instancess = await getInstances(bearerToken);
    setInstances(instancess);
    setRefreshing(false); // End the refresh after data is fetched
  };

  const loadTokenFromKeychain = async () => {
    console.log('Loading token from keychain...');
    console.log('Loading token from keychain...');
    console.log('Loading token from keychain...');
    console.log('Loading token from keychain...');
    const token = await getTokenDetailsFromKeychain();
    if (token) {
      setBearerToken(token);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadInstances();
      loadTokenFromKeychain();

      // Return function will run on component unmount
      return () => {
        // You can put any cleanup code here if needed
      };
    }, []),
  );

  return (
    <ScrollView
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#333' : '#fff'},
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadInstances} />
      }>
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
                Last Backup:{' '}
                {instance.backups.last_successful
                  ? humanReadableDate(instance.backups.last_successful)
                  : 'Never'}
              </Text>
              <Text
                style={[
                  styles.cardInfo,
                  {color: isDarkMode ? '#fff' : '#000'},
                ]}>
                Created: {humanReadableDate(instance.created)}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.customButton,
                    {backgroundColor: isDarkMode ? '#444' : '#ddd'},
                  ]}
                  onPress={() => Clipboard.setString(instance.ipv4.join(', '))}>
                  <Text
                    style={{
                      fontSize: 15,
                      marginBottom: 10,
                      color: isDarkMode ? '#ccc' : '#333',
                    }}>
                    Copy IPv4
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.customButton,
                    {backgroundColor: isDarkMode ? '#444' : '#ddd'},
                  ]}
                  onPress={() => Clipboard.setString(instance.ipv6)}>
                  <Text
                    style={{
                      fontSize: 15,
                      marginBottom: 10,
                      color: isDarkMode ? '#ccc' : '#333',
                    }}>
                    Copy IPv6
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.customButton,
                    {backgroundColor: isDarkMode ? '#444' : '#ddd'},
                  ]}
                  onPress={() => Clipboard.setString(String(instance.id))}>
                  <Text
                    style={{
                      fontSize: 15,
                      marginBottom: 10,
                      color: isDarkMode ? '#ccc' : '#333',
                    }}>
                    Copy ID
                  </Text>
                </TouchableOpacity>
              </View>
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
  buttonContainer: {
    flexDirection: 'row', // Arrange buttons horizontally
    justifyContent: 'space-between', // Distribute buttons with equal space
    marginTop: 10, // Some margin on top for spacing
  },
  customButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center', // Center the text inside the button
    flex: 1, // Make each button take equal width
    marginHorizontal: 5, // Give some space between the buttons
  },
});

export default Linodes;
