(function () {
    var bkgImg= document.createElement("img");
    bkgImg.classList.add("bkg-img");
    bkgImg.src = "/photos/color/Blacklight-Large.png";

    var bkgImgContainer = document.createElement("div");
    bkgImgContainer.classList.add("bkg-img-container");
    bkgImgContainer.appendChild(bkgImg);

    var body = document.querySelector("body");
    body.appendChild(bkgImgContainer);
})();