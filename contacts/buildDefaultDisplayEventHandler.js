/**
 * A function which returns the an event handler for the default contacts display.
 * It supports email and phone number options.
 *
 * @param (HTMLElement)   contactsContainer - the container DOM element of the contacts
 * @param {HTMLElement[]} emailElements     - the email address DOM elements that you want to show/hide
 * @param {HTMLElement[]} phoneElements     - the phone number  DOM elements that you want to show/hide
 */
var buildDefaultDisplayEventHandler = function(contactsContainer, emailElements, phoneElements) {
    
    /* setup */
    var selectorToPrepend = "show ",
        show = function(elems, doNotShow) {
            for (var i = 0; i < elems.length; i++) {
                var currentSelector = elems[i].className;
                if (doNotShow) {
                    elems[i].className = (currentSelector == "phone" || currentSelector == "email") 
                                            ? currentSelector 
                                            : currentSelector.substring(selectorToPrepend.length);
                } else {
                    elems[i].className = "show " + currentSelector;
                }
            }
        },
        hide = function(elems) {
            return show(elems, true);
        },
        phoneFirstSelector = " phoneFirst ",
        reorder = function(type) {
            var selector = contactsContainer.className;
            switch(type) {
                case "email":
                    contactsContainer.className = selector.replace(phoneFirstSelector, "");
                    break;
                case "phone":
                    if (selector.indexOf(phoneFirstSelector) == -1) {
                        contactsContainer.className = selector += phoneFirstSelector;
                    }
                    break;
            }
        };
    
    /* return the event handler */
    
    /**
     * A function which handles updating the the information to be displayed to the
     * user by default (when the full contact details are not displayed).
     *
     * @param {string} type - a string representing the information to be displayed
     *                      - SUPPORTED VALUES: "email", "phone"
     */
    return function(type) {
        switch(type) {
            case "email":
                show(emailElements);
                hide(phoneElements);
                reorder("email")
                break;
            case "phone":
                hide(emailElements);
                show(phoneElements);
                reorder("phone");
                break;
        }
    };
};