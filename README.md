# metu-menu

Fetches **Middle East Technical University** cafeteria's menu from its website.

## Install

```sh
npm install --save metu-menu
```

## Usage

**Importing - ES6 (ES2015)**

```js
import metuMenu from 'metu-menu';
```

**Importing - ES5**
```js
var metuMenu = require('metu-menu');
```

**Fetching menu**

The function expects one `date` argument, if not provided it falls back to current date.

```js
metuMenu('2016-05-24')
    .then((menu) => {
        console.log(menu.lunch);
        console.log(menu.dinner);
        console.log(menu.alacarte);
        console.log(menu.socialBuilding)
    })
    .catch((error) => {
        /* do something */
    });
```

or to get today's menu without passing a date argument

```js
metuMenu()
    .then((menu) => {
        console.log(menu.lunch);
        console.log(menu.dinner);
        console.log(menu.alacarte);
        console.log(menu.socialBuilding)
    })
    .catch((error) => {
        /* do something */
    });
```

## License

Copyright (c) 2016 H.Gökhan Sarı

Licensed under the MIT License.