# AttributeDeobfuscator

An element attribute deobfuscator for [Reddit](https://www.reddit.com). Turn the original attribute names into the obfuscated/randomized ones and vice versa. Eases and allows the creation of new Reddit modifying userscripts.

## 📋 Usage

1) Copy & paste AttributeDeobfuscator to your userscript, or require it
```js
// @require     https://raw.githubusercontent.com/Hakorr/AttributeDeobfuscator/main/attributedeobfuscator.js
```

2) Run the script at start
```js
// @run-at      document-start
```

3) Create a new instance and define a function to be ran when AttributeDeobfuscator is loaded and ready
```js
const Deobfuscator = new AttributeDeobfuscator();
Deobfuscator.ready(yourFunction);
```

4) Use `obfuscateClass` and `deobfuscateClass` functions accordingly
```js
// Returns the element's obfuscated/randomized className
Deobfuscator.obfuscateClass("Input", false); // "zgT5MfUrDMC54cpiCpZFu"

// Returns the results of a querySelectorAll
Deobfuscator.obfuscateClass("Input", true); // Array of [Element Object]

// Returns the normal className
Deobfuscator.deobfuscateClass("zgT5MfUrDMC54cpiCpZFu") // "Input"
```

⚠️ Use the Deobfuscator's functions only inside your ready function, or after the ready function has been called.

## 🔎 How to find attribute names

1) Add this this to your function which is called when the deobfuscator is ready
```js
unsafeWindow.deobfuscate = className => console.log(Deobfuscator.deobfuscateClass(className));

// or

console.log(Deobfuscator.attributeArr);
```

2) If you chose the first one, run the command from the devtools, otherwise just look at the logged array manually
```js
deobfuscate("obfuscatedClassname"); // "deobfuscatedClassName"
```

3) With the *deobfuscated class name*, you can access the element from your script, like so
```js
Deobfuscator.obfuscateClass("deobfuscatedClassName", true); // [Element]
```

**This way you can create userscripts that won't rely on changing obfuscated values!**

## 💠Example userscripts

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

const IMAGE_URL = "https://images.pexels.com/photos/853199/pexels-photo-853199.jpeg";

const Deobfuscator = new AttributeDeobfuscator();

Deobfuscator.ready(() => {
    const layer = Deobfuscator.obfuscateClass("innerContainer", true);

    layer[0].style["background-image"] = `url("${IMAGE_URL}")`;
    layer[0].style["background-repeat"] = 'no-repeat';
    layer[0].style["background-attachment"] = 'fixed';
    layer[0].style["background-positio"] = '0% 50%';
});
```

Helper script
```js
// ==UserScript==
// @name        RedditDeobfuscateHelper
// @namespace   namespace
// @match       https://www.reddit.com/*
// @grant       none
// @version     1.0
// @author      author
// @run-at      document-start
// @description Use the command "deobfuscate()" to deobfuscate attribute names
// @require     https://raw.githubusercontent.com/Hakorr/AttributeDeobfuscator/main/attributedeobfuscator.js
// ==/UserScript==

const Deobfuscator = new AttributeDeobfuscator();

Deobfuscator.ready(() => {
    unsafeWindow.deobfuscate = className => console.log(Deobfuscator.deobfuscateClass(className));
});
```

## 🚧 Todo

* Speed up the load time
