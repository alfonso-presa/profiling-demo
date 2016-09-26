## Sample profiling

```sh
npm install && npm install -g http-server
hs -c-1 -s sample &
google-chrome --remote-debugging-port=9222 --user-data-dir=remote-profile --no-firsttime about:blank &
./node_modules/.bin/chromedriver --verbose &
node wd.js
```

Will generate log1, log2 and log3, that should be able to be opened with the chrome debugging tools or it's about:tracing

