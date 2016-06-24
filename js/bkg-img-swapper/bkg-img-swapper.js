(function () {
    var container = document.getElementById("hero-img-container");
    var bkgImg = (window.BRG && window.BRG.bkgImg) || "/photos/color/Blacklight-Large.png";
    container.style.background = "url(" + bkgImg + ") no-repeat center center";
})();