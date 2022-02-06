# AttributeDeobfuscator

An element attribute deobfuscator for [Reddit](https://www.reddit.com). Turn the original attribute names into the obfuscated/randomized ones and vice versa.

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
