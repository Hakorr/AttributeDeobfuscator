# AttributeDeobfuscator

An element attribute deobfuscator for [Reddit](https://www.reddit.com). Turn the original attribute names into the obfuscated/randomized ones and vice versa. Eases and allows creating of new Reddit modifying userscripts.

## Todo

* Run the ready function after a URL hash change
* Allow usage of multiple classNames
* Speed up the load time

## Usage

### As a userscript

Copy & paste AttributeDeobfuscator  to your userscript, or require it
```js
// @require     https://raw.githubusercontent.com/Hakorr/AttributeDeobfuscator/main/attributedeobfuscator.js
```

Run the script at start
```js
// @run-at      document-start
```

Create a new instance and define a function to be ran when AttributeDeobfuscator is loaded and ready
```js
const Deobfuscator = new AttributeDeobfuscator();
Deobfuscator.ready(yourFunction);
```

Use `toObfuscated` and `toNormal` functions accordingly
```js
//Returns the element's obfuscated/randomized className
Deobfuscator.toObfuscated("Input", false); //zgT5MfUrDMC54cpiCpZFu

//Returns the results of a querySelectorAll
Deobfuscator.toObfuscated("Input", true); //Array of [Element Object]

//Returns the normal className
Deobfuscator.toNormal("zgT5MfUrDMC54cpiCpZFu") //Input
```

The final result could look like this
```js
// ==UserScript==
// @name        name
// @namespace   namespace
// @match       https://www.reddit.com/*
// @grant       none
// @version     1.0
// @author      author
// @run-at      document-start
// @description description
// @require     https://raw.githubusercontent.com/Hakorr/AttributeDeobfuscator/main/attributedeobfuscator.js
// ==/UserScript==

const Deobfuscator = new AttributeDeobfuscator();
Deobfuscator.ready(yourFunction);

function yourFunction() {
    const inputElements = Deobfuscator.toObfuscated("Input", true);
    inputElements[0].placeholder = "Hack the world";
    inputElements[0].style.border = "1px solid #ff0000";
}
```

## How to find attribute names

Add this-
```js
window.deobfuscateAttribute = className => console.log(Deobfuscator.toNormal(className));
```

or this to your function which is called when the deobfuscator is ready
```js
console.log(Deobfuscator.attributeArr);
```

It could look like this
```js
// ==UserScript==
// @name        name
// @namespace   namespace
// @match       https://www.reddit.com/*
// @grant       none
// @version     1.0
// @author      author
// @run-at      document-start
// @description description
// @require     https://raw.githubusercontent.com/Hakorr/AttributeDeobfuscator/main/attributedeobfuscator.js
// ==/UserScript==

const Deobfuscator = new AttributeDeobfuscator();
Deobfuscator.ready(() => window.deobfuscateAttribute = className => console.log(Deobfuscator.toNormal(className)));
```

Then if you chose the first one, from the devtools' console run the command
```js
deobfuscateAttribute("obfuscatedClassname")
```

Otherwise, with the second one, just look at the logged array and find the values manually

With the unobfuscated className, you can access the element from your script, like so
```js
Deobfuscator.toObfuscated("unobfuscatedClassName", true);
```

## Example userscripts

Change the background to an image
```js
// ==UserScript==
// @name        name
// @namespace   namespace
// @match       https://www.reddit.com/*
// @grant       none
// @version     1.0
// @author      author
// @run-at      document-start
// @description description
// @require     https://raw.githubusercontent.com/Hakorr/AttributeDeobfuscator/main/attributedeobfuscator.js
// ==/UserScript==

const Deobfuscator = new AttributeDeobfuscator();

const IMAGE_URL = "https://images.pexels.com/photos/853199/pexels-photo-853199.jpeg";

Deobfuscator.ready(() => {
    const layer = Deobfuscator.toObfuscated("innerContainer", true);

    layer[0].style["background-image"] = `url("${IMAGE_URL}")`;
    layer[0].style["background-repeat"] = 'no-repeat';
    layer[0].style["background-attachment"] = 'fixed';
    layer[0].style["background-positio"] = '0% 50%';
});
```
