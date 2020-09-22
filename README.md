# LEO Visa Product Knowledge game

## Requirements
```
Node.js 8
```

## Installation
```
npm install
```

### Configure environment file
Copy `.env.example` to `.env`. The default language is set to GB English.

### Redux Devtools
Install the browser extension for [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) or [Firefox](https://addons.mozilla.org/en-GB/firefox/addon/reduxdevtools/) to use the Redux Devtools.

## Available Scripts
In the project directory, you can run:

### Run the app
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
```
npm start
```

### Build for production
The following will build the app into the build folder.
```
npm run build
```

### Publish SCO
The following will publish a SCORM package into the dist folder as a zip file.
```
npm run publish-sco
```

### Test SCO
The following will create a local http server which can be used to test the SCORM API between SCO sessions.
```
npm run publish-test-sco
npm run sco-tester
```
Access the server on http://192.168.0.5:8080/ScormTester.html

### Jest tests
Run tests
```
npm test
```
Watch tests
```
npm run test:watch
```

### Jest coverage
The following will create the directory `coverage/lcov-report` (the index.html therein can be opened in any browser):
```
npm run test:coverage
```
