## Sample profiling

```sh
npm install && ./node_modules/.bin/selenium-standalone install
./node_modules/.bin/selenium-standalone start &
node wd.js
```

Will generate `log*.json` that should be able to be opened with the chrome debugging tools or it's about:tracing

## Running in saucelabs

To run in sauce labs, start the tunnel and run:

```sh
npm install
SAUCE_USERNAME=#### SAUCE_ACCESS_KEY=#### node wd.js
```
