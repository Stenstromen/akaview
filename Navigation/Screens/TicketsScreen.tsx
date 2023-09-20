/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {useApp} from '../../AppContext';
import {useFocusEffect} from '@react-navigation/native';
import {getTokenDetailsFromKeychain} from '../../Oauth';
import {TicketResponse} from '../../Types';
import {getTickets} from '../../Api';

function TicketsScreen(): JSX.Element {
  const [openAccordionId, setOpenAccordionId] = useState<number | null>(null);
  const {isDarkMode, bearerToken, setBearerToken} = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [tickets, setTickets] = useState<TicketResponse | null>(null);

  const toggleAccordion = (id: number) => {
    if (openAccordionId === id) {
      setOpenAccordionId(null); // Close the accordion if it's currently open
    } else {
      setOpenAccordionId(id); // Open the accordion if it's currently closed
    }
  };

  const loadTokenFromKeychain = async () => {
    const token = await getTokenDetailsFromKeychain();
    if (token) {
      setBearerToken(token);
    }
  };

  const loadTickets = async () => {
    console.log('Loading tickets...');
    setRefreshing(true); // Start the refresh
    const res = await getTickets(bearerToken);
    setTickets(res);
    setRefreshing(false); // End the refresh after data is fetched
  };

  const load = () => {
    loadTokenFromKeychain();
    loadTickets();
  };

  useFocusEffect(
    useCallback(() => {
      load();

      return () => {};
    }, []),
  );

  return (
    <ScrollView
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#333' : '#fff'},
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadTickets} />
      }>
      {tickets?.data?.map(ticket => (
        <View key={ticket.id}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => toggleAccordion(ticket.id)}>
            <View style={styles.cardMainContent}>
              <Text
                style={[
                  styles.cardLabel,
                  {color: isDarkMode ? '#fff' : '#000'},
                ]}>
                {ticket.summary}
              </Text>
              <Text
                style={[
                  styles.cardStatus,
                  {color: ticket.status === 'open' ? 'yellow' : 'green'},
                ]}>
                {ticket.status}
              </Text>
              <Text
                style={[
                  styles.cardInfo,
                  {color: isDarkMode ? '#fff' : '#000'},
                ]}>
                Opened by: {ticket.opened_by}
              </Text>
              <Text
                style={[
                  styles.cardInfo,
                  {color: isDarkMode ? '#fff' : '#000'},
                ]}>
                Last updated by: {ticket.updated_by}
              </Text>
            </View>
            <Text
              style={[
                styles.showDetailsText,
                {color: isDarkMode ? '#fff' : '#000'},
              ]}>
              {openAccordionId === ticket.id
                ? 'Hide Details'
                : 'Tap for Details'}
            </Text>
          </TouchableOpacity>

          {openAccordionId === ticket.id && (
            <View style={styles.accordionContent}>
              <Text
                style={[
                  styles.detailedInfo,
                  {color: isDarkMode ? '#fff' : '#000'},
                ]}>
                {ticket.description}
              </Text>
              <Text
                style={[
                  styles.cardInfo,
                  {color: isDarkMode ? '#fff' : '#000'},
                ]}>
                Ticket ID: {ticket.id}
              </Text>
              <Text
                style={[
                  styles.cardInfo,
                  {color: isDarkMode ? '#fff' : '#000'},
                ]}>
                Entity ID: {ticket.entity?.id}
              </Text>
              <Text
                style={[
                  styles.cardInfo,
                  {color: isDarkMode ? '#fff' : '#000'},
                ]}>
                Entity Label: {ticket.entity?.label}
              </Text>
              <View style={styles.buttonContainer}>
                {/* Any actions you'd want for each ticket can be added here */}
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
  detailedInfo: {
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

export default TicketsScreen;
