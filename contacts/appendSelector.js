/**
 * Appends the selector to className of the specified element
 * if that selector is not already present.
 *
 * @param {HTMLElement} elem - the element whose className we will append the selector to
 * @param {string}  selector - the selector to append
 *
 */
var appendSelector = function(elem, selector) {
    if (elem && selector && elem.className.indexOf(selector) == -1) {
        elem.className += " " + pinnedSelector;
    }    
}
