// Load environment variables from .env file
require('dotenv').config();

// Import the Bolt package for Slack API
const { App } = require('@slack/bolt');

// Initialize your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Store the count of saved messages per user
const savedMessagesCount = {};

// Listen for star_added events (when a user saves a message for later)
app.event('star_added', async ({ event, client }) => {
  const userId = event.user;

  // Increment the count for this user
  savedMessagesCount[userId] = (savedMessagesCount[userId] || 0) + 1;

  console.log(`User ${userId} saved a message. Total saved: ${savedMessagesCount[userId]}`);
});

// Listen for star_removed events (when a user removes a saved message)
app.event('star_removed', async ({ event, client }) => {
  const userId = event.user;

  // Decrement the count for this user (if it exists and is greater than 0)
  if (savedMessagesCount[userId] && savedMessagesCount[userId] > 0) {
    savedMessagesCount[userId]--;
  }

  console.log(`User ${userId} removed a saved message. Total saved: ${savedMessagesCount[userId] || 0}`);
});

// Listen for messages containing "saved" to show the count of saved messages
app.message('saved', async ({ message, say }) => {
  const userId = message.user;
  const count = savedMessagesCount[userId] || 0;

  await say(`<@${userId}>, you have ${count} message${count === 1 ? '' : 's'} saved for later.`);
});

// Listen for messages containing "hello"
app.message('hello', async ({ message, say }) => {
  // Say hello back when someone says "hello"
  await say(`Hello there, <@${message.user}>!`);
});

// Listen for messages containing "help"
app.message('help', async ({ message, say }) => {
  await say(`I'm a minimal Slack bot. Try these commands:
- "hello": I'll greet you
- "saved": I'll tell you how many messages you've saved for later
`);
});

// Start the app
(async () => {
  try {
    // Start your app
    await app.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running!');
  } catch (error) {
    console.error('Unable to start App', error);
  }
})();
