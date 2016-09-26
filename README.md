## Sample profiling

```sh
npm install && npm install -g http-server && ./node_modules/.bin/selenium-standalone install
hs -c-1 -s sample &
./node_modules/.bin/selenium-standalone start &
node wd.js
```

Will generate log1, log2 and log3, that should be able to be opened with the chrome debugging tools or it's about:tracing
