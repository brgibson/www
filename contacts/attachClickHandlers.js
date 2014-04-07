/**
 * Attaches the click handlers for pinning a contact's details open.
 * 
 * @param {HTMLElement} contactsContainer - the container that contains the list of contacts
 */
var attachClickHandlers = function(contactsContainer) {
    var allowHoverSelector = " allowHover",
        pinStateSelector = " pinState ",
        pinnedSelector = " pinned ",
        pinnedElement = null;
    var clickEventHandler = function(elem) {
        if (this.tagName.toLowerCase() == "body" || this.parentNode == pinnedElement) {
            if (pinnedElement) {
                pinnedElement.className = pinnedElement.className.replace(pinnedSelector, "");
            }
            pinnedElement = null;
            contactsContainer.className = contactsContainer.className.replace(pinStateSelector, "");
            if (contactsContainer.className.indexOf(allowHoverSelector) == -1) {
                contactsContainer.className += allowHoverSelector;
            }
        } else {
            //clear the styles on the pinned element
            if (pinnedElement) {
                pinnedElement.className = pinnedElement.className.replace(pinnedSelector, "");
            }
            //update the pinned element to the element that was clicked on
            pinnedElement = this.parentNode;
            if (pinnedElement.className.indexOf(pinnedSelector) == -1) { //todo - create a function append if empty
                pinnedElement.className += pinnedSelector;
            }

            if (contactsContainer.className.indexOf(pinStateSelector) == -1) {
                contactsContainer.className += pinStateSelector;
            }

            contactsContainer.className = contactsContainer.className.replace(allowHoverSelector, "");
        }
    };

    var dtElements = contactsContainer.getElementsByTagName("dt");
    for (var i = 0; i < dtElements.length; i++) {
        switch (dtElements[i].getAttribute("data-type")) {
            case "name": dtElements[i].onclick = clickEventHandler; break;
        }
    }

    //add the event handler to the body, so a user can un-pin a contact by clicking outside of the contact
    document.body.onclick = clickEventHandler;

    //stop the event bubble if you are inside the contacts container (so we can still copy past information from the contact details without closing the popup)
    contactsContainer.onclick = function() {
        if (event.stopPropogation) {
            event.stopPropagation();
        } else {
            window.event.cancelBubble = true;
        }
    };
};