﻿requirejs.config({
    //min: true,
    urlArgs: "r=" + (+new Date()),
    baseUrl: '/js',
    waitSeconds: 7000,
    shim: {
        "v2.rsm": ['v2'],
        "v2.tool": ['v2']
    },
    paths: {
        vue: 'lib/vue/vue'
    }
});
var r = /https?:\/\/([\w-]+\.)*[\w-]+\/(([\w-]+\/)+)?(([\w-]+)(\.[\w-]+|\?|#|$)|\?|#|$)/i;
require(["v2", "v2.rsm", "v2.tool", "components/v2.modal"], function () {
    if (r = r.exec(location.href)) {
        return require(["views/" + r[2] + (r[5] || "index")]);
    }
    return require(["views/index"]);
});