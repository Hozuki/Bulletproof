/**
 * Created by MIC on 2015/12/29.
 */

var bp = new Bulletproof.Bulletproof();
bp.initialize(682, 438);
(function (selector) {
    var elem = document.querySelector(selector);
    elem.appendChild(bp.view);
})("#glantern-container");

window.addEventListener("unload", function () {
    bp.dispose();
});

(function initList() {

    var fs = require("fs");

    var testCases = {
        "3D ball": "3d-ball.js",
        "Green Dam Musume": "kanpai-green-dam.js",
        "Madoka and her happy <del>tree</del> friends": "kanpai-madoka.js"
    };

    var caseListElem = document.querySelector("#test-case-selector");

    function onClick(ev) {
        /**
         * @type {HTMLAnchorElement}
         */
        var aElem = this;
        var e;
        e = document.querySelector("#test-case-selector-container");
        e.style.display = "none";
        e = document.querySelector("#test-case-desc");
        e.textContent = aElem.name;
        e = document.querySelector("#glantern-container");
        e.style.display = "block";
        injectAndExecute(aElem.name);
    }

    for (var caseName in testCases) {
        if (testCases.hasOwnProperty(caseName)) {
            /**
             * @type {HTMLLIElement}
             */
            var liElem = document.createElement("li");
            /**
             * @type {HTMLAnchorElement}
             */
            var aElem = document.createElement("a");
            aElem.innerHTML = caseName;
            aElem.href = "javascript:;";
            aElem.name = "test-scripts/" + testCases[caseName];
            aElem.onclick = onClick.bind(aElem);
            liElem.appendChild(aElem);
            caseListElem.appendChild(liElem);
        }
    }

    /**
     * Execute a single script by injecting the script into the window.
     * @param fileName {String} Full JavaScript file name.
     */
    function injectAndExecute(fileName) {
        var content = fs.readFileSync(fileName, "utf-8");
        var codeProvider = bp.danmakuCoordinator.getDanmakuProvider(Bulletproof.danmaku.DanmakuKind.Code);
        codeProvider.addDanmaku(content);
        bp.startAnimation();
    }
})();