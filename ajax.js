function ajax(o) {
	'use strict';
	
	var xhr = new XMLHttpRequest();
	xhr.open('GET', o.uri, true);
	//xhr.responseType = 'blob';
	//xhr.overrideMimeType('audio\/midi; charset=binary');
	var cbInner = function() {
		if (xhr.readyState === 4 && xhr.status > 199 && xhr.status < 300) {
			return o.cb(null, xhr.response);
		}
		o.cb('error requesting ' + o.uri);
	};
	xhr.onload  = cbInner;
	xhr.onerror = cbInner;
	xhr.send(null);
}
