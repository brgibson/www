/**
 * Attaches the click handlers for pinning a contact's details open.
 * 
 * @param {HTMLElement} contactsContainer - the container DOM element for the list of contacts
 */
var attachClickHandlers = function(contactsContainer) {
    var allowHoverSelector = "allowHover",
        pinStateSelector = "pinState",
        pinnedSelector = "pinned",
        pinnedElement = null;
    
    var clickEventHandler = function(elem) {
        if (this.tagName.toLowerCase() == "body" || this.parentNode == pinnedElement) {
            removeSelector(pinnedElement, pinnedSelector);
            removeSelector(contactsContainer, pinStateSelector);
            appendSelector(contactsContainer, allowHoverSelector);
            pinnedElement = null; //must be done after removing the selector from the pinned element
        } else {
            //clear the styles on the pinned element
            removeSelector(pinnedElement, pinnedSelector); 
            
            //update the pinned element to the element that was clicked on
            pinnedElement = this.parentNode;
            appendSelector(pinnedElement, pinnedSelector);
            appendSelector(contactsContainer, pinStateSelector);
            removeSelector(contactsContainer, allowHoverSelector);
        }
    };

    //attach the event handler to the elements of the contacts list
    for (var dtElements = contactsContainer.getElementsByTagName("dt"),
             i = 0; i < dtElements.length; i++) {
        
        switch (dtElements[i].getAttribute("data-type")) {
            case "name": dtElements[i].onclick = clickEventHandler; break;
        }
    }

    //attach the event handler to the body, so a user can un-pin a contact by clicking outside of the contact
    document.body.onclick = clickEventHandler;

    //stop the event bubble if you are inside the contacts container (so we can still copy past information from the contact details without closing the popup)
    contactsContainer.onclick = function() {
        if (event.stopPropogation) {
            event.stopPropagation();
        } else { // for IE
            window.event.cancelBubble = true;
        }
    };
};