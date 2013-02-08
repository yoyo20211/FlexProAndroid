var PaymentPlugin = {
    callNativeFunction: function (success, fail, resultType) {
    	return cordova.exec(success, fail, "PaymentPlugin", "nativeFunction", [resultType]);
    }
};