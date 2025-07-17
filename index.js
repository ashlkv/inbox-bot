// Load environment variables from .env file
require('dotenv').config();

// Import the Bolt package for Slack API
const { App } = require('@slack/bolt');

// Initialize your app with Socket Mode
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  userToken: process.env.SLACK_USER_TOKEN
});

// Store the count of inbox reactions per user
const inboxCount = {};

// Listen for inbox reactions being added
app.event('reaction_added', async ({ event }) => {
  // console.log('reaction_added', event.reaction)
  if (event.reaction === 'inbox_tray') {
    const userId = event.user;
    inboxCount[userId] = (inboxCount[userId] || 0) + 1;
    console.log(`User ${userId} added inbox reaction. Total inbox items: ${inboxCount[userId]}`);
  }
});

// Listen for inbox reactions being removed
app.event('reaction_removed', async ({ event }) => {
  // console.log('reaction_removed', event.reaction)
  if (event.reaction === 'inbox_tray') {
    const userId = event.user;
    if (inboxCount[userId] && inboxCount[userId] > 0) {
      inboxCount[userId]--;
    }
    console.log(`User ${userId} removed inbox reaction. Total inbox items: ${inboxCount[userId] || 0}`);
  }
});

// Log inbox counts every 10 seconds
setInterval(async () => {
  console.log('\n=== Inbox Counts ===');
  const users = Object.keys(inboxCount);
  if (users.length === 0) {
    console.log('No users with inbox items');
  } else {
    for (const userId of users) {
      try {
        const userInfo = await app.client.users.info({
          token: process.env.SLACK_BOT_TOKEN,
          user: userId
        });
        const userName = userInfo.user.real_name || userInfo.user.name;
        const count = inboxCount[userId] || 0;
        console.log(`${userName}: ${count} inbox items`);
      } catch (error) {
        const count = inboxCount[userId] || 0;
        console.log(`User ${userId}: ${count} inbox items`);
      }
    }
  }
  console.log('===================\n');
}, 5000);

// Start the app
(async () => {
  try {
    // Start your app
    await app.start();
    console.log('⚡️ Bolt app is running in Socket Mode!');
    console.log('Add :inbox_tray: reactions to messages to track them');
  } catch (error) {
    console.error('Unable to start App', error);
  }
})();
