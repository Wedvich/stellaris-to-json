# stellaris-to-json

A Node.js library for parsing and transforming Stellaris data files to JSON.

[![npm version](https://badge.fury.io/js/stellaris-to-json.svg)](https://badge.fury.io/js/stellaris-to-json)

Supports Node 10+. Usage:

```js
const fs = require('fs');
const { convert } = require('stellaris-to-json');

const file = fs.readFileSync('00_required_sets.txt', 'utf-8');
const json = convert(file);
```
