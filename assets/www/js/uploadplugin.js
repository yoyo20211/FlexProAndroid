var UploadPlugin = {
    callNativeFunction: function (success, fail, resultType) {
    	return cordova.exec(success, fail, "UploadPlugin", "nativeFunction", [resultType]);
    }
};