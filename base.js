//create a namespace for re-usable functions
var BRG = BRG || {};
BRG.stopBubble = function(evt) {
    if (!evt) {
        evt = window.event;
    }
    evt.cancelBubble = true;
    if (evt.stopPropagation) {
        evt.stopPropagation();
    }
};

//setup hide/reveal menu for small width users
(function() {
    var CURRENT = "current";
    var SHOW_MENU = "show-menu";

    var body = document.body;
    var collapsedMenu = document.querySelector(".menu-collapsed");
    var nav = document.querySelector("nav");

    collapsedMenu.addEventListener("click", menuHandler);

    var isExpanded = false; //flag for the menuHandler closure
    function menuHandler(evt) {
        if (isExpanded) {
            collapsedMenu.classList.remove(CURRENT);
            nav.classList.remove(SHOW_MENU);
            body.removeEventListener("click", menuHandler);
        } else {
            collapsedMenu.classList.add(CURRENT);
            nav.classList.add(SHOW_MENU);
            body.addEventListener("click", menuHandler);
        }
        isExpanded = !isExpanded;
        BRG.stopBubble(evt);
    }
})();