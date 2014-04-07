/**
 * A function which returns the an event handler for the default contacts display.
 * It supports email and phone number options.
 *
 * @param {HTMLElement[]} emailElements   - the email address DOM elements that you want to show/hide
 * @param {HTMLElement[]} phoneElements   - the phone number  DOM elements that you want to show/hide
 * @param      {function} reorder         - a no-arg function that reorders the phone and email elements
 */
var buildDefaultDisplayEventHandler = function(emailElements, phoneElements, reorder) {
                    
    
    /* todo - swap the order of the phone number and the email */
    
    /* setup */
    var show = function(elems, doNotShowFlag) {
            for (var i = 0; i < elems.length; i++) {
                var currentSelector = elems[i].className;
                if (doNotShowFlag) {
                    elems[i].className = (currentSelector == "phone" || currentSelector == "email") ? currentSelector : currentSelector.substring(4); //fix this bug
                } else {
                    elems[i].className = "show " + currentSelector;
                }
            }
        }, 
        hide = function(elems) {
            return show(elems, true);
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
                reorder()
                break;
            case "phone":
                hide(emailElements);
                show(phoneElements);
                reorder();
                break;
        }
    };
};