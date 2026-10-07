# Archer Mobile

Expo/React Native client for Archer. This first slice connects to the existing public project discovery and authentication API.

Navigation uses Expo Router with file-based routes under `src/app`.

## Current scope

- Use a native, responsive version of the web landing and marketplace experience.
- Browse, search, refresh, and paginate published projects.
- Filter projects by category and explicit `USD` or `MMK` currency.
- Open project details, including client, skills, deadline, and proposal count.
- Sign in with the existing API and restore a rotating session.
- Keep the access token in memory and the refresh token in the platform keychain/keystore with Expo SecureStore.
- Follow the device light or dark appearance setting.
- Show loading, empty, retry, and authentication error states.

Proposal submission is intentionally not simulated in the client because the API does not expose that contract yet.

## Prerequisites

- Node.js 24+
- npm 11+
- `archer-api` installed, migrated, seeded, and running
- Expo Go or an Android/iOS simulator

## Setup

```powershell
npm install
Copy-Item .env.example .env
npm start
```

The default API URL is `http://localhost:4000/api/v1`, which works with the iOS Simulator. For the Android Emulator use:

```text
EXPO_PUBLIC_API_URL=http://10.0.2.2:4000/api/v1
```

For a physical device, use the development computer's LAN IP and ensure the API is reachable on that interface. Restart Expo after changing `.env`.

## Demo account

```text
Email: freelancer1@archer.local
Password: ArcherDemo123!
```

The credentials are prefilled in the development sign-in screen and are for local use only.

## Commands

- `npm start` - Start the Expo development server.
- `npm run android` - Start and open Android.
- `npm run ios` - Start and open iOS (macOS required).
- `npm run typecheck` - Run strict TypeScript validation.
- `npm run lint` - Run Expo's ESLint configuration.

## Troubleshooting

- If a device cannot reach the API, replace `localhost` with the development computer's LAN IP and confirm both devices are on the same network.
- If an Android Emulator cannot reach the API, use `http://10.0.2.2:4000/api/v1`.
- Restart Expo after changing `.env` or `.env.local` so public environment variables are reloaded.

## License

Archer Mobile is available under the [MIT License](./LICENSE).
