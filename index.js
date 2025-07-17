// Load environment variables from .env file
require('dotenv').config();

// Import the Bolt package for Slack API
const { App } = require('@slack/bolt');

console.log('process.env.SLACK_BOT_TOKEN', process.env.SLACK_BOT_TOKEN)
console.log('process.env.SLACK_SIGNING_SECRET', process.env.SLACK_SIGNING_SECRET)

// Initialize your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Listen for messages containing "hello"
app.message('hello', async ({ message, say }) => {
  // Say hello back when someone says "hello"
  await say(`Hello there, <@${message.user}>!`);
});

// Listen for messages containing "help"
app.message('help', async ({ message, say }) => {
  await say(`I'm a minimal Slack bot. Try saying "hello" to me!`);
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
