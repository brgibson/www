/**
 * Removes the selector from the className of the specified
 * element.
 *
 * @param {HTMLElement} elem - the element whose className the selector will be removed from
 * @param {string}  selector - the selector to remove
 *
 */
var removeSelector = function(elem, selector) {
    if (elem && selector) {
        elem.className = elem.className.replace(" " + selector + " ", "");
    }    
}