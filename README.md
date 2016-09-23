## Sample profiling

```sh
npm install && npm install -g http-server
hs sample &
google-chrome --remote-debugging-port=9222 --user-data-dir=remote-profile --no-firsttime about:blank &
./node_modules/.bin/chromedriver --verbose &
node wd.js
```

Will generate log1 and log2, that should be able to be opened with the chrome debugging tools or it's about:tracing

## Known limitations

* Doesn't display javascript methods for some reason
