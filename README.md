# get-notch
get / listening phone (iPhoneX) notch enabled / size

## Import: 

```javascript
import { listenNotchChange, getNotch } from './get-notch';
const notch = getNotch();
const stopListenNotchChange = listenNotchChange((notch) => {
  console.log('notch changed', notch);
}, { throttle: 100 });
// stopListenNotchChange()
```

## CSS Helpers:

```javascript
import './notch-helpers.css';
/* HTML:
  <div class="padding-safe-bottom" />
  <div class="padding-safe-top" />
  <div class="padding-safe-horizontal" />
*/
```