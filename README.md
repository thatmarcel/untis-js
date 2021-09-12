# untis-js
**WebUntis client for Node.js**

This library lets you interact with and fetch content from WebUntis instances you are registered at.

## Installation
`npm install untis-js`

## Usage
`untis-js` is an ESM-only module - you are not able to import it with `require`.
If you want to use it in a CommonJS project, you can use the async `import()` function from CommonJS to load `untis-js` asynchronously:
```javascript
const untis = (...args) => import("untis-js").then(({ default: untis }) => untis(...args));
```
### Example
```javascript
import untis from "untis-js";

const schools = await untis.searchSchools("My Hero Academia");

const client = untis.client(schools[0]);

await client.authenticate("username", "password");

const subjects = await client.fetchAllSubjects();
console.log(subjects);

const timetable = await client.fetchCurrentTimetable();
console.log(timetable);
```

Also note that this library has only been tested with Node.js v14 and above.

## Dependencies
This library uses [node-fetch](https://github.com/node-fetch/node-fetch)

## License
This library is licensed under the MIT license.
See LICENSE for more details.