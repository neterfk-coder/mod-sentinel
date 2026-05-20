# 🛡️ SentinelMod

> _"Tools protect communities from toxic users. SentinelMod protects the humans who do that work."_

## What is SentinelMod?

SentinelMod is the **first tool on Reddit** that monitors the health and wellbeing of moderation teams. While other tools protect communities from problem users, SentinelMod protects moderators from burnout before it's too late.

---

## 🔥 The Problem It Solves

Reddit loses entire communities when moderators burn out and abandon their subreddits. Mod burnout is the #1 cause of abandoned subreddits, yet **no tool had ever been built to prevent it**.

Until now.

---

## ✨ Key Features

### 📊 Team Health Dashboard

- Health score from 0 to 100% for each moderator
- Visual traffic light system: 🟢 Healthy · 🟡 Watch · 🔴 Critical Burnout
- Real-time team overview summary

### ⚠️ Automatic Alert System

- Late-night moderation detection (11 PM - 5 AM)
- Overload alerts for high action volume
- Automatic recommendations for team leaders

### 👥 Individual Mod Tracking

- Action counter per moderator
- Late night activity history
- Time since last activity
- Risk level: LOW · MEDIUM · HIGH

### 🤖 Automatic Detection

- Activates automatically with every moderation action
- No manual configuration required
- Runs 24/7 in the background

---

## 🚀 Installation

1. Go to the [Reddit App Directory](https://developers.reddit.com)
2. Search for **SentinelMod**
3. Click **Install**
4. Select your subreddit
5. Done! SentinelMod starts monitoring automatically

---

## 📖 How to Use SentinelMod

### View the Health Dashboard

1. Go to your subreddit
2. Click the **"..."** menu
3. Select **🛡️ SentinelMod - View Team Health**
4. Click **"View Dashboard"**

### Reading the Results

| Color     | Health  | Meaning           | Recommended Action    |
| --------- | ------- | ----------------- | --------------------- |
| 🟢 Green  | 75-100% | Healthy moderator | None needed           |
| 🟡 Yellow | 50-74%  | Stress signals    | Monitor closely       |
| 🔴 Red    | 0-49%   | Critical burnout  | Redistribute workload |

### Health Score Formula

Health = 100%

10% for each late-night moderation session
20% if mod exceeds 100 actions in a week

---

## 🎯 Who Is SentinelMod For?

- **Large subreddits** with multi-moderator teams
- **Medium subreddits** that want to prevent losing mods
- **Any moderator** who leads a team and wants to take care of them

---

## 💡 Why SentinelMod Is Unique

| Existing Tools                     | SentinelMod                                   |
| ---------------------------------- | --------------------------------------------- |
| Monitor problem users              | Monitors moderators                           |
| Reactive (act when problem occurs) | Preventive (acts before the problem)          |
| Protect the community              | Protects the team that protects the community |
| Complex to configure               | One-click install                             |

---

## 🏗️ Technical Architecture

triggers.ts → Detects moderation actions in real time
api.ts → Processes and analyzes moderator data
forms.ts → Displays the interactive health dashboard
menu.ts → Integrates SentinelMod into Reddit's menu
dashboard.ts → Visual HTML team panel
devvit.json → App configuration and permissions

---

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Login to Devvit
devvit login

# Start development with playtest
npm run dev

# In another terminal
devvit playtest your-subreddit
```

---

## 📋 Required Permissions

- `reddit: true` — Reddit API access to read moderation actions

---

## 🤝 Contributing

SentinelMod is a Reddit 2026 Hackathon project. If you want to contribute or have suggestions, open an issue or pull request.

---

## 📄 License

MIT License — Free to use, modify and distribute.

---

## 👨‍💻 Built With

- [Devvit](https://developers.reddit.com) — Reddit Developer Platform
- [Hono](https://hono.dev) — Ultralight web framework
- TypeScript

---

## 🌍 Community Impact

SentinelMod was built with three communities in mind:

| Subreddit Type                    | How SentinelMod Helps                                 |
| --------------------------------- | ----------------------------------------------------- |
| Large communities (100k+ members) | Prevents team collapse from overwork                  |
| Gaming subreddits                 | High-traffic communities need healthy mod teams       |
| Support communities               | Emotionally demanding moderation needs wellness tools |

---

_🛡️ SentinelMod · Protecting those who protect Reddit_
