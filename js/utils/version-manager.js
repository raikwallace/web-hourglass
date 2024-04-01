const fs = require("fs");

function upgradeMinorVersion() {
    const manifest = require("../../manifest.json");
    version = manifest.version.split(".");
    version[2] = parseInt(version[2]) + 1;
    manifest.version = version.join(".");
    fs.writeFile("manifest.json", JSON.stringify(manifest), "utf8", (err) => {
        if (!err) {
            console.log("🚀 Minor version upgraded to " + manifest.version)
        } else {
            console.log("🔥 Error: ", err);
        }
    });
};

function upgradeMajorVersion() {
    const manifest = require("../../manifest.json");
    version = manifest.version.split(".");
    version[1] = parseInt(version[1]) + 1;
    version[2] = 0;
    manifest.version = version.join(".");
    fs.writeFile("manifest.json", JSON.stringify(manifest), "utf8", (err) => {
        if (!err) {
            console.log("🚀 Major version upgraded to " + manifest.version)
        } else {
            console.log("🔥 Error: ", err);
        }
    });
}

if (process.argv[2] && process.argv[2] === '-M') {
    upgradeMajorVersion();
} else {
    upgradeMinorVersion();
}
