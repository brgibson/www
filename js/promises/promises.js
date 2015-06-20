var BRG = BRG || {};
BRG.PROMISES = BRG.PROMISES || {};

(function() {
    var PROMISES = BRG.PROMISES;

    /**
     * Makes a AJAX request via GET using the given url and headersObj, and returns a promise.
     *
     * @param url
     * @param headersObj
     * @param options
     * @returns {Promise}
     */
    PROMISES.get = function get(url, headersObj, options) {
        options = options || {};

        // Return a new promise.
        return new Promise(function(resolve, reject) {
            // Do the usual XHR stuff
            var req = new XMLHttpRequest();

            req.open('GET', url);

            //add any headers
            if (headersObj) {
                for (var key in headersObj) {
                    if (headersObj.hasOwnProperty(key)) {
                        req.setRequestHeader(key, headersObj[key]);
                    }
                }
            }

//            if (options && options.isXmlRequest) {
//                req.overrideMimeType('text/xml');
//            }

            req.onload = function() {
                // This is called even on 404 etc
                // so check the status
                if (req.status == 200) {
                    // Resolve the promise with the response text
                    if (options.isXmlRequest) {
                        resolve(req.responseXML);
                    } else {
                        resolve(req.response);
                    }
                }
                else {
                    // Otherwise reject with the status text
                    // which will hopefully be a meaningful error
                    reject(Error(req.statusText));
                }
            };

            // Handle network errors
            req.onerror = function() {
                reject(Error("Network Error"));
            };

            // Make the request
            req.send();
        });
    };
})();