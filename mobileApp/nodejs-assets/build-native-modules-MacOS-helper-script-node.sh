#!/bin/bash
      # Helper script for Gradle to call node on macOS in case it is not found
      export PATH=$PATH:/usr/local/lib/node_modules/npm/node_modules/npm-lifecycle/node-gyp-bin:/Users/rollandzhang/Documents/482/Frontend/mobileApp/node_modules/nodejs-mobile-react-native/node_modules/.bin:/Users/rollandzhang/Documents/482/Frontend/mobileApp/node_modules/.bin:/opt/local/bin:/opt/local/sbin:/Library/Frameworks/Python.framework/Versions/3.8/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
      node $@
    