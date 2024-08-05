window.ace.define(
    "ace/theme/marzneshin_dark",
    ["require", "exports", "module", "ace/lib/dom"],
    (acequire, exports,) => {
        exports.isDark = true;
        exports.cssClass = "ace-marzneshin-dark";
        const dom = acequire("../lib/dom");
        dom.importCssString(exports.cssText, exports.cssClass);
    }
);

window.ace.define(
    "ace/theme/dawn",
    ["require", "exports", "module", "ace/lib/dom"],
    (acequire, exports,) => {
        exports.isDark = false;
        exports.cssClass = "ace-dawn";

        const dom = acequire("../lib/dom");
        dom.importCssString(exports.cssText, exports.cssClass);
    }
);
