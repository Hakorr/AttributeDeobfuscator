/* globals: document, window */

/*
 * attributedeobfuscator.js
 * v1.0.2
 * https://github.com/Hakorr/AttributeDeobfuscator
 * Apache 2.0 licensed
 */

function AttributeDeobfuscator() {
    "use strict";

    (async () => {
        const observerCallback = mutationsList => {
            for (let mutationRecord of mutationsList) {
                for (let node of mutationRecord.addedNodes) {
                    if (node.tagName !== 'SCRIPT') continue;

                    if(node.src.includes(".js"))
                    {
                        if(!scriptURLs.includes(node.src)) // if the URL is a new one (this is to prevent the same script loading twice)
                        {
                            scriptURLs.push(node.src); // add the URL to an array of already processed URLs
        
                            let resultStr = await get(node.src); //get http request the script

                            if(typeof resultStr == "string") {
                                handleScript(resultStr); // once we have the script, handle it (extract values)
                            }
                        }
                    }
                };
            };
        };

        const mutObvsr = new MutationObserver(observerCallback);
        mutObvsr.observe(document, { childList: true, subtree: true });
    })();
  
    this.attributeArr = [];
    let scriptURLs = [];
    let callback = () => console.log("No callback was set");

    const get = async url => {
        let response = await fetch(url);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        let text = await response.text();
        return text;
    };

    this.toQuerySelector = (str, prefix) =>
        str != (undefined || null)
            ?   str.split(" ")                       // split into string array
                .filter(n => n)                      // remove empty strings
                .map(x => `${(prefix || '.') + x},`) // apply prefix and suffix (default to '.')
                .join(" ")                           // array into string
                .slice(0, -1)                        // remove last char (',')

            :   undefined;                           // the string was undefined or null
  
    const handleMultipleClassNames = (classNames, obfuscate) => {
        let obfuscatedStr = "";
      
        const one = obfuscate ? 'deobfuscatedName' : 'obfuscatedName';
        const two = obfuscate ? 'obfuscatedName' : 'deobfuscatedName';
      
        classNames.forEach((name, index) => {
            if(name.length > 0)
            {
                let result = this.attributeArr.find(val => val[one] == name);

                if(typeof result == "object")
                {
                    obfuscatedStr += result[two] + (index == classNames.length - 1 ? '' : ' ');
                }
            }
        });
      
        return obfuscatedStr;
    };
  
    this.obfuscateClass = (str, returnAsElementArray) => {
        if(str.includes(" ")) // given string includes multiple words
        {
            let obfuscatedStr = handleMultipleClassNames(str.split(" "), true);

            return (returnAsElementArray 
                    ? document.querySelectorAll(this.toQuerySelector(obfuscatedStr, '.')) 
                    : obfuscatedStr);
        }
        else // given str only has one word
        {
            let result = this.attributeArr.find(val => val.deobfuscatedName == str);
          
            if(typeof result == "object") 
            {
                return (returnAsElementArray
                        ? document.querySelectorAll('.' + result.obfuscatedName)
                        : result.obfuscatedName);
            }
        }
    };

    this.deobfuscateClass = str => {
        if(str.includes(" ")) // given string includes multiple words
        {
            return handleMultipleClassNames(str.split(" "), false);
        }
        else // given str only has one word
        {
            let result = this.attributeArr.find(val => val.obfuscatedName == str);
          
            if(typeof result == "object")
            {
                return result.deobfuscatedName;
            }
        }
    };

    const handleScript = str => {
        // Could be done with a fancy Regex search, but I don't have a sufficent Regex knowledge to make to fast enough

        if(str.includes("sourceMapping"))
        {
            let strArr = str.split("},");

            strArr.forEach(x => {
                if(x.includes("e.exports={")) 
                {
                    x = x.match(new RegExp(`e.exports={` + "(.*)" + `}`)); //match in the middle of two strings

                    if(x && x.length > 1) // more than two results
                    { 
                        x = x[1]; // take the second result

                        x = x.replaceAll(' ',''); // clear spaces
                        x = x.replaceAll('\n',''); // clear newlines

                        // A scuffed way to add quotation marks around the key values to make the string a valid JSON string
                        // {name:"key"} -> {"name":"key"}
                        x = `{${x}}`; // place curly brackets around the string
                        x = x.replaceAll('{','{"'); // add a quotation mark to the right side of every right-facing curly bracket
                        x = x.replaceAll(',',',"'); // add a comma to the left side of every quotation mark
                        x = x.replaceAll(':','":'); // add a quotation mark to the left side of every colon
                        x = x.replaceAll('""','"'); // replace double quotation marks with a single one

                        try 
                        {
                            let parsed = JSON.parse(x);

                            if(Object.keys(parsed).length > 0) //if parsed successfully
                            {
                                for(let i = 0; i < Object.keys(parsed).length; i++)
                                {
                                    let value = Object.entries(parsed)[i];
                                    let deobfuscatedName = value[0];
                                    let obfuscatedName = value[1];
                                    let combinedObj = { 
                                        "deobfuscatedName": deobfuscatedName,
                                        "obfuscatedName": obfuscatedName
                                    };

                                    if(!this.attributeArr.some(val => val.obfuscatedName == combinedObj.obfuscatedName)) // if the object doesn't already exist
                                    {
                                        this.attributeArr.push(combinedObj);
                                    }
                                }
                            }
                        }
                        catch(e)
                        {
                            //console.log(`Script handling error: ${e}`)
                        }
                    }
                }
            });
        }
    }

    window.addEventListener("load", () => {
        const checkURLHashChange = setInterval (function () {
            if (this.lastPathStr !== location.pathname) 
            {
                this.lastPathStr = location.pathname;

                callback();
            }
        }, 100);
    });

    this.ready = __callback => {
        callback = __callback;
    };
}
