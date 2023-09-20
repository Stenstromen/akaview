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
import Markdown from '@jonasmerlin/react-native-markdown-display';
import {useApp} from '../../AppContext';
import {useFocusEffect} from '@react-navigation/native';
import {TicketResponse, TicketReplyResponse} from '../../Types';
import {getTickets, getTicketReplies} from '../../Api';
import {humanReadableDate} from '../../Utils';

function TicketsScreen(): JSX.Element {
  const [openAccordionId, setOpenAccordionId] = useState<number | null>(null);
  const {isDarkMode, bearerToken} = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [tickets, setTickets] = useState<TicketResponse | null>(null);
  const [ticketReply, setTicketReply] = useState<TicketReplyResponse | null>(
    null,
  );

  const toggleAccordion = (id: number) => {
    if (openAccordionId === id) {
      setOpenAccordionId(null); // Close the accordion if it's currently open
    } else {
      setOpenAccordionId(id); // Open the accordion if it's currently closed
      const loadTicketReplies = async () => {
        const ticketReplies = await getTicketReplies(bearerToken, id);
        setTicketReply(ticketReplies);
      };
      loadTicketReplies();
    }
  };

  const loadTickets = async () => {
    console.log('Loading tickets...');
    setRefreshing(true); // Start the refresh
    const res = await getTickets(bearerToken);
    setTickets(res);
    console.log(res);
    setRefreshing(false); // End the refresh after data is fetched
  };

  const load = () => {
    //loadTokenFromKeychain();
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
                <Markdown
                  style={{
                    body: {color: isDarkMode ? '#fff' : '#000'},
                    heading1: {color: isDarkMode ? '#fff' : '#000'},
                    heading2: {color: isDarkMode ? '#fff' : '#000'},
                    heading3: {color: isDarkMode ? '#fff' : '#000'},
                    heading4: {color: isDarkMode ? '#fff' : '#000'},
                    heading5: {color: isDarkMode ? '#fff' : '#000'},
                    heading6: {color: isDarkMode ? '#fff' : '#000'},
                    hr: {color: isDarkMode ? '#fff' : '#000'},
                    strong: {color: isDarkMode ? '#fff' : '#000'},
                    em: {color: isDarkMode ? '#fff' : '#000'},
                    s: {color: isDarkMode ? '#fff' : '#000'},
                    del: {color: isDarkMode ? '#fff' : '#000'},
                    link: {color: isDarkMode ? '#fff' : '#000'},
                    blockquote: {
                      color: isDarkMode ? '#fff' : '#000',
                      backgroundColor: isDarkMode ? '#333' : '#fff',
                    },
                    bullet_list: {color: isDarkMode ? '#fff' : '#000'},
                    ordered_list: {color: isDarkMode ? '#fff' : '#000'},
                    list_item: {color: isDarkMode ? '#fff' : '#000'},
                    code_inline: {
                      color: isDarkMode ? '#fff' : '#000',
                      backgroundColor: isDarkMode ? '#333' : '#fff',
                    },
                    code_block: {
                      color: isDarkMode ? '#fff' : '#000',
                      backgroundColor: isDarkMode ? '#333' : '#fff',
                    },
                    fence: {
                      color: isDarkMode ? '#fff' : '#000',
                      backgroundColor: isDarkMode ? '#333' : '#fff',
                    },
                    table: {color: isDarkMode ? '#fff' : '#000'},
                    thead: {color: isDarkMode ? '#fff' : '#000'},
                    tbody: {color: isDarkMode ? '#fff' : '#000'},
                    th: {color: isDarkMode ? '#fff' : '#000'},
                    tr: {color: isDarkMode ? '#fff' : '#000'},
                    td: {color: isDarkMode ? '#fff' : '#000'},
                    blocklink: {color: isDarkMode ? '#fff' : '#000'},
                    image: {color: isDarkMode ? '#fff' : '#000'},
                    text: {color: isDarkMode ? '#fff' : '#000'},
                    textgroup: {color: isDarkMode ? '#fff' : '#000'},
                    paragraph: {color: isDarkMode ? '#fff' : '#000'},
                    hardbreak: {color: isDarkMode ? '#fff' : '#000'},
                    softbreak: {color: isDarkMode ? '#fff' : '#000'},
                    pre: {color: isDarkMode ? '#fff' : '#000'},
                    inline: {color: isDarkMode ? '#fff' : '#000'},
                    span: {color: isDarkMode ? '#fff' : '#000'},
                  }}>
                  {ticket.description}
                </Markdown>
              </Text>
              {ticketReply?.data?.map(reply => (
                <Text style={{color: isDarkMode ? '#fff' : '#000'}}>
                  <View
                    style={{
                      marginTop: 10,
                      marginBottom: 10,
                    }}>
                    <Text
                      style={{
                        color: isDarkMode ? '#fff' : '#000',
                        paddingTop: 12,
                        paddingBottom: 12,
                        paddingLeft: 10,
                        paddingRight: 10,
                        borderTopWidth: 1,
                        borderColor: isDarkMode ? '#fff' : '#000',
                        borderRadius: 5,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 16,
                      }}>
                      {reply.created_by}{' '}
                      {reply.from_linode ? '(Linode) ' : null}@{' '}
                      {humanReadableDate(reply.created)}
                    </Text>
                    <View
                      style={{
                        marginTop: 10,
                        height: 1,
                        width: '90%', // Reduced width to 90% to see the effect
                        backgroundColor: isDarkMode ? '#fff' : '#000',
                        borderRadius: 2.5,
                      }}
                    />
                  </View>

                  <Markdown
                    key={reply.id}
                    style={{
                      body: {color: isDarkMode ? '#fff' : '#000'},
                      heading1: {color: isDarkMode ? '#fff' : '#000'},
                      heading2: {color: isDarkMode ? '#fff' : '#000'},
                      heading3: {color: isDarkMode ? '#fff' : '#000'},
                      heading4: {color: isDarkMode ? '#fff' : '#000'},
                      heading5: {color: isDarkMode ? '#fff' : '#000'},
                      heading6: {color: isDarkMode ? '#fff' : '#000'},
                      hr: {color: isDarkMode ? '#fff' : '#000'},
                      strong: {color: isDarkMode ? '#fff' : '#000'},
                      em: {color: isDarkMode ? '#fff' : '#000'},
                      s: {color: isDarkMode ? '#fff' : '#000'},
                      del: {color: isDarkMode ? '#fff' : '#000'},
                      link: {color: isDarkMode ? '#fff' : '#000'},
                      blockquote: {
                        color: isDarkMode ? '#fff' : '#000',
                        backgroundColor: isDarkMode ? '#333' : '#fff',
                      },
                      bullet_list: {color: isDarkMode ? '#fff' : '#000'},
                      ordered_list: {color: isDarkMode ? '#fff' : '#000'},
                      list_item: {color: isDarkMode ? '#fff' : '#000'},
                      code_inline: {
                        color: isDarkMode ? '#fff' : '#000',
                        backgroundColor: isDarkMode ? '#333' : '#fff',
                      },
                      code_block: {
                        color: isDarkMode ? '#fff' : '#000',
                        backgroundColor: isDarkMode ? '#333' : '#fff',
                      },
                      fence: {
                        color: isDarkMode ? '#fff' : '#000',
                        backgroundColor: isDarkMode ? '#333' : '#fff',
                      },
                      table: {color: isDarkMode ? '#fff' : '#000'},
                      thead: {color: isDarkMode ? '#fff' : '#000'},
                      tbody: {color: isDarkMode ? '#fff' : '#000'},
                      th: {color: isDarkMode ? '#fff' : '#000'},
                      tr: {color: isDarkMode ? '#fff' : '#000'},
                      td: {color: isDarkMode ? '#fff' : '#000'},
                      blocklink: {color: isDarkMode ? '#fff' : '#000'},
                      image: {color: isDarkMode ? '#fff' : '#000'},
                      text: {color: isDarkMode ? '#fff' : '#000'},
                      textgroup: {color: isDarkMode ? '#fff' : '#000'},
                      paragraph: {color: isDarkMode ? '#fff' : '#000'},
                      hardbreak: {color: isDarkMode ? '#fff' : '#000'},
                      softbreak: {color: isDarkMode ? '#fff' : '#000'},
                      pre: {color: isDarkMode ? '#fff' : '#000'},
                      inline: {color: isDarkMode ? '#fff' : '#000'},
                      span: {color: isDarkMode ? '#fff' : '#000'},
                    }}>
                    {reply.description}
                  </Markdown>
                </Text>
              ))}

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
