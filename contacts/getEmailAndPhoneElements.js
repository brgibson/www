/**
 * Takes a contacts container element and returns an object
 * containing a list of the email elements and the phone
 * elements.
 * 
 * @param {HTMLElement} container - the container DOM element of the email and phone elements
 */
var getEmailAndPhoneElements = function(container) {
    for (var emailElements = [],
             phoneElements = [],
             ddElements = container.getElementsByTagName("dd"),
             i = 0; i < ddElements.length; i++) {
        
        switch (ddElements[i].getAttribute("data-type")) {
            case "email": emailElements.push(ddElements[i]); break;
            case "phone": phoneElements.push(ddElements[i]); break;
        }
    }
    return { "emailElements" : emailElements,
             "phoneElements" : phoneElements };
};

