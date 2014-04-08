/**
 * A function which returns the an event handler for the default contacts display.
 * It supports email and phone number options.
 *
 * @param (HTMLElement)   contactsContainer  - the container DOM element of the contacts
 * @param {HTMLElement}   defaultDisplyInput - the input DOM element whose value the user can update to choose which 
                                               type of information to display next to the name in the contacts list
 * @param {HTMLElement[]} emailElements      - the DOM elements containing the email addresses
 * @param {HTMLElement[]} phoneElements      - the Dom elements containing the phone numbers
 */
var buildDefaultDisplayEventHandler = function(contactsContainer, defaultDisplyInput, emailElements, phoneElements) {
    
    /* setup */
    var types = { email : "email", phone : "phone" };
    var phoneFirstSelector = "phoneFirst",
        reorder = function(type) {
            switch(type) {
                case types.email: removeSelector(contactsContainer, phoneFirstSelector); break;
                case types.phone: appendSelector(contactsContainer, phoneFirstSelector); break;
            }
        };
    var showSelector = "show",
        show = function(elems, doNotShow) {
            for (var i = 0; i < elems.length; i++) {
                var currentSelector = elems[i].className;
                if (doNotShow) {
                    removeSelector(elems[i], showSelector);
                } else {
                    appendSelector(elems[i], showSelector);
                }
            }
        },
        hide = function(elems) {
            return show(elems, true);
        };
    
    /* return the event handler */
    
    /**
     * An function which handles updating they type of contact 
     * information that is shown next to the name in the contacts
     * list.
     */
    return function() {
                (function(type) {
                    switch(type) {
                        case types.email:
                            show(emailElements);
                            hide(phoneElements);
                            reorder(types.email)
                            break;
                        case types.phone:
                            hide(emailElements);
                            show(phoneElements);
                            reorder(types.phone);
                            break;
                    }
                })(defaultDisplyInput.value);
            };
    
    
    
};