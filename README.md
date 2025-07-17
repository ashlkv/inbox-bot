# Minimal Slack Bot

A simple Slack bot built with the Bolt framework that responds to basic commands.

## Features

- Responds to "hello" messages with a personalized greeting
- Provides help information when users type "help"

## Setup

1. Create a new Slack App at [api.slack.com/apps](https://api.slack.com/apps)
2. Under "OAuth & Permissions", add the following Bot Token Scopes:
   - `chat:write`
   - `app_mentions:read`
   - `channels:history`
   - `groups:history`
   - `im:history`
   - `mpim:history`
3. Install the app to your workspace
4. Copy the Bot User OAuth Token (starts with `xoxb-`)
5. Go to "Basic Information" and copy the Signing Secret

## Environment Variables

Create a `.env` file in the root directory based on the provided `.env.example`:

```
# Slack Bot Configuration
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret

# Server Configuration (optional)
PORT=3000
```

Replace the placeholder values with your actual Slack Bot Token and Signing Secret.

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
