# Ptolemy TCO Calculator

Template used: [cra-template-pwa-typescript](https://www.npmjs.com/package/cra-template-pwa-typescript)

Node Version: [14.17.0 LTS](https://nodejs.org/dist/v14.17.0/node-v14.17.0-x64.msi)

### NVM Installation

- Install [NVM](https://github.com/nvm-sh/nvm#install--update-script)

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

- Install [Node](https://github.com/nvm-sh/nvm#usage)

```
nvm install 14.17.0
```

## Front-end Stack

### Tailwind CSS

We use Tailwind CSS to write utility-first CSS classes. The library has the following dependencies:

- postcss
- autoprefixer

Since Tailwind uses `postcss`, We needed to install [CRACO](https://github.com/gsoft-inc/craco) to override the default `postcss` settings of `create-react-app` since it doesn't support this natively.
This also means that we needed to change the following scripts in `package.json`:

```javascript
{
  // ...
  "scripts": {
//    "start": "react-scripts start",
//    "build": "react-scripts build",
//    "test": "react-scripts test",
    "start": "craco start",
    "build": "craco build",
    "test": "craco test",
    "eject": "react-scripts eject"
  },
}
```

## Developing

After making sure that you've completed the Asimov setup, run the following command to install project dependencies:

`npm install`

Once that's done, you can start the development server using:

`npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### Running Cypress Tests

Note that Cypress is problematic on WSL2. Consider using [VirtualBox](https://wiki.tm8.dev/doc/linux-vm-using-virtualbox-headless-V6df9XarPn) instead (make sure [VcXsrv](https://wiki.tm8.dev/doc/linux-vm-using-virtualbox-headless-V6df9XarPn#h-running-linux-gui-apps) is installed in your Windows desktop.)

To run Cypress tests, a few more setup steps is necessary:

1. Creating the service account JSON
  - Create a new file called `serviceAccount.json` at the project root (i.e. beside `package.json`)
  - Go to TM bitwarden and look for `TCO Calculator Firebase Service Account (for Cypress)` 
  - Copy the JSON in that bitwarden secret, and save it as the contents of `serviceAccount.json`
2. Creating the .env file
  - Go to the firebase auth console: https://console.firebase.google.com/project/tm-ese-tco-calculator/authentication/users
    - Note: If you don't want to bother with doing this, you can use iman's UID: `GTB7rxmNH8TT8gBNd5HbQSOJDsL2`
  - Pick a user for testing purposes, then copy their UID
  - In your .env file at the project root (create one if you don't have one yet) add this line:
    - `CYPRESS_TEST_UID=add_uid_you_copied_here`
3. Install [Cypress dependencies](https://docs.cypress.io/guides/continuous-integration/introduction#Environment-variables)

```
apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
```
4. If using VirtualBox:
  - Run XLaunch. In the wizard, tick the "Disable access control" checkbox.
  - Open Putty and connect to your VirtualBox server.
  - In the terminal, navigate to your `tco-calculator` directory.
5. Run `npm run cypress`. As soon as you run your first test, you should see that you're automatically logged in to the app 🙂
