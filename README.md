# Minimal Slack Bot

A simple Slack bot built with the Bolt framework that responds to basic commands.

## Features

- Responds to "hello" messages with a personalized greeting
- Provides help information when users type "help"
- Tracks and counts messages saved for later by each user
- Responds to "saved" messages with the count of messages saved by the current user

## Setup

1. Create a new Slack App at [api.slack.com/apps](https://api.slack.com/apps)
2. Under "OAuth & Permissions", add the following Bot Token Scopes:
   - `chat:write`
   - `app_mentions:read`
   - `channels:history`
   - `groups:history`
   - `im:history`
   - `mpim:history`
   - `stars:read` (required for tracking saved messages)
3. Enable Event Subscriptions:
   - Go to "Event Subscriptions" in the left sidebar
   - Toggle "Enable Events" to On
   - In the "Request URL" field, enter your public URL where the bot is hosted followed by `/slack/events` (e.g., `https://your-app-domain.com/slack/events`)
   - Under "Subscribe to bot events", add the following events:
     - `message.channels`
     - `message.groups`
     - `message.im`
     - `message.mpim`
     - `star_added` (required for tracking when messages are saved)
     - `star_removed` (required for tracking when saved messages are removed)
   - Click "Save Changes"
4. Install the app to your workspace
5. Copy the Bot User OAuth Token (starts with `xoxb-`)
6. Go to "Basic Information" and copy the Signing Secret

## Alternative: Using Socket Mode (for development)

If you don't have a public URL for your bot (e.g., during development), you can use Socket Mode instead of Event Subscriptions:

1. Go to "Socket Mode" in the left sidebar and enable it
2. Generate an app-level token with the `connections:write` scope
3. Add this token to your `.env` file as `SLACK_APP_TOKEN`
4. Update your code to use Socket Mode:
   - Install the required package: `npm install @slack/socket-mode`
   - Modify your app initialization in `index.js` to use Socket Mode (see example below)

Example Socket Mode configuration:
```javascript
const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});
```

## Environment Variables

Create a `.env` file in the root directory based on the provided `.env.example`:

```
# Slack Bot Configuration
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_USER_TOKEN=xoxp-your-user-token
SLACK_SIGNING_SECRET=your-signing-secret
# Required only for Socket Mode (starts with xapp-)
SLACK_APP_TOKEN=xapp-your-app-token

# Server Configuration (optional)
PORT=3000
```

Replace the placeholder values with your actual tokens and signing secret:
- SLACK_BOT_TOKEN: Your Bot User OAuth Token (starts with `xoxb-`)
- SLACK_USER_TOKEN: Your User OAuth Token (starts with `xoxp-`), required for star events
- SLACK_SIGNING_SECRET: Your Signing Secret
- SLACK_APP_TOKEN: Your App-Level Token (starts with `xapp-`), only required for Socket Mode

## Installation

```bash
npm install
```

## Running the Bot

```bash
npm start
```

## Development

To add more functionality, extend the message listeners in `index.js`.

Example:
```javascript
app.message('goodbye', async ({ message, say }) => {
  await say(`See you later, <@${message.user}>!`);
});
```
