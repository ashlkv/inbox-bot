// Load environment variables from .env file
require('dotenv').config();

// Import the Bolt package for Slack API
const { App } = require('@slack/bolt');
const { WebClient } = require('@slack/web-api');

// Initialize your app with Socket Mode
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  userToken: process.env.SLACK_USER_TOKEN
});

// Initialize a separate client for user token operations
const userClient = new WebClient(process.env.SLACK_USER_TOKEN);

// Store the count of saved messages per user
const savedMessagesCount = {};

// Function to get starred messages count for a user
async function getStarredCount(userId) {
  try {
    const result = await userClient.stars.list({
      token: process.env.SLACK_USER_TOKEN,
      user: userId
    });
    return result.items ? result.items.length : 0;
  } catch (error) {
    console.error('Error fetching starred messages:', error);
    return 0;
  }
}

// Listen for messages containing "saved" to show the count of saved messages
app.message('saved', async ({ message, say }) => {
  const userId = message.user;
  const count = await getStarredCount(userId);

  // await say(`<@${userId}>, you have ${count} message${count === 1 ? '' : 's'} saved for later.`);
  console.log(`<@${userId}>, you have ${count} message${count === 1 ? '' : 's'} saved for later.`);
});

// Listen for messages containing "hello"
app.message('hello', async ({ message, say }) => {
  // Say hello back when someone says "hello"
  // await say(`Hello there, <@${message.user}>!`);
  console.log(`Hello there, <@${message.user}>!`)
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
    await app.start();
    console.log('⚡️ Bolt app is running in Socket Mode!');
  } catch (error) {
    console.error('Unable to start App', error);
  }
})();
