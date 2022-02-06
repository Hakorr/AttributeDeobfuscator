/* globals: document, window */

/*
 * attributedeobfuscator.js
 * v1.0.0
 * https://github.com/Hakorr/AttributeDeobfuscator
 * Apache 2.0 licensed
 */

function AttributeDeobfuscator() {
    "use strict";

    let valueArr = [];
    let scriptURLs = [];
    let callback = () => console.log("No callback was set");
    
    const rndName = Math.random().toString(36).substring(2, Math.floor(Math.random() * 40) + 5);
    const BseEvent = new Event(rndName, { bubbles: true, cancelable: true });

    const observerCallback = mutationsList => {
        for (let mutationRecord of mutationsList) {
            for (let node of mutationRecord.addedNodes) {
                if (node.tagName !== 'SCRIPT') continue;

                // Adds functionality to document.onbeforescriptexecute
                if (typeof document.rndName === 'function') {
                    document.addEventListener(
                        rndName,
                        document.rndName,
                        { once: true }
                    );
                };

                // Returns false if preventDefault() was called
                if (!node.dispatchEvent(BseEvent)) {
                    node.remove();
                };
            };
        };
    };

    const mutObvsr = new MutationObserver(observerCallback);
    mutObvsr.observe(document, { childList: true, subtree: true });

    document.rndName = async (e) => {
        if(e.target.src.includes(".js"))
        {
            if(!scriptURLs.includes(e.target.src)) //if the URL is a new one (this is to prevent the same script loading twice)
            {
                scriptURLs.push(e.target.src); //add the URL to an array of already processed URLs

                let resultStr = await get(e.target.src); //get http request the script
                handleScript(resultStr); //once we have the script, handle it (extract values)
            }
        }
    }

    const get = async url => {
        let response = await fetch(url);

        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        let text = await response.text();
        return text;
    };

    this.toObfuscated = (str, returnAsElementArray) => {
        let result = valueArr.find(val => val.name == str);
        if(typeof result == "object") 
        {
            if(returnAsElementArray)
            {
                return document.querySelectorAll('.' + result.randomizedName);
            }
            else
            {
                return result.randomizedName;
            }
        }
    };

    this.toNormal = str => {
        let result = valueArr.find(val => val.randomizedName == str)
        if(typeof result == "object")
        {
            return result.name;
        }
    };

    const handleScript = str => {
        //This could be done with a fancy Regex search, but I don't have a sufficent Regex knowledge to make to fast enough.

        if(str.includes("sourceMapping"))
        {
            let strArr = str.split("},");

            strArr.forEach(x => {
                if(x.includes("e.exports={")) 
                {
                    x = x.match(new RegExp(`e.exports={` + "(.*)" + `}`)); //match in the middle of two strings

                    if(x && x.length > 1) //more than two results
                    { 
                        x = x[1]; //take the second result

                        x = x.replaceAll(' ',''); //clear spaces
                        x = x.replaceAll('\n',''); //clear newlines

                        // A scuffed way to add quotation marks around the key values to make the string a valid JSON string
                        // {name:"key"} -> {"name":"key"}
                        x = `{${x}}`; //place curly brackets around the string
                        x = x.replaceAll('{','{"'); //add a quotation mark to the right side of every right-facing curly bracket
                        x = x.replaceAll(',',',"'); //add a comma to the left side of every quotation mark
                        x = x.replaceAll(':','":'); //add a quotation mark to the left side of every colon
                        x = x.replaceAll('""','"'); //replace double quotation marks with a single one

                        try 
                        {
                            let parsed = JSON.parse(x);

                            if(Object.keys(parsed).length > 0) //if parsed successfully
                            {
                                for(let i = 0; i < Object.keys(parsed).length; i++)
                                {
                                    let value = Object.entries(parsed)[i];
                                    let regularName = value[0];
                                    let randomizedName = value[1];
                                    let combinedObj = { 
                                    "name": regularName,
                                    "randomizedName": randomizedName
                                    };

                                    if(!valueArr.some(val => val.randomizedName == combinedObj.randomizedName)) //if doesn't already exist
                                    {
                                        valueArr.push(combinedObj); //add the obj to the array
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

    window.addEventListener("load", () => callback());

    this.ready = __callback => {
        callback = __callback; 
    };
}
