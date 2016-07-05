(function() {
	'use strict';
	

	
	var invertHashTable = function(o) {
		var O = {};
		for (var k in o) {
			O[ o[k] ] = k;
		}
		return O;
	};



	window.kbd = function(initialKeys) {
		var cbs = {
			'down': [],
			'up':   []
		};
		
		var downKeys = {};
		var downKeysInv;
		var areDownKeysInvDirty = true;
		
		var readingVal;
		var readingCb;
		
		var keys = initialKeys || {};
		
		var refreshDownKeysInv = function() {
			if (areDownKeysInvDirty) {
				downKeysInv = invertHashTable(keys);
				areDownKeysInvDirty = false;
			}
		};
		refreshDownKeysInv();

		var fire = function(evName, arg) {
			var bag = cbs[evName];
			if (!bag) { return; }
			for (var i = 0, I = bag.length; i < I; ++i) {
				bag[i](arg);
			}
		};
		
		var onDown = function(ev) {
			var kc = ev.keyCode;
			var val = keys[kc];
			if (val !== undefined) { downKeys[kc] = true; }
			if (readingVal !== undefined && val === undefined) {
				keys[kc] = readingVal;
				var rv = readingVal;
				var rc = readingCb;
				readingVal = undefined;
				readingCb = undefined;
				rc(kc, rv);
			}
			else {
				if (val === undefined) { return; }
				fire('down', val);
			}
			ev.preventDefault();
			ev.stopPropagation();
		};
		
		var onUp = function(ev) {
			var kc = ev.keyCode;
			var val = keys[kc];
			if (val !== undefined) { delete downKeys[kc]; }
			else { return; }
			fire('up', val);
			ev.preventDefault();
			ev.stopPropagation();
		};
		
		
		window.addEventListener('keydown', onDown);
		window.addEventListener('keyup',   onUp);
		
		return {
			on: function(evName, cb) {
				var bag = cbs[evName];
				if (bag) {
					bag.push(cb);
				}
			},
			isKeyDown: function(keyCode) {
				return !!downKeys[keyCode];
			},
			isValueDown: function(value) {
				refreshDownKeysInv();
				var keyCode = downKeysInv[value];
				return !!downKeys[keyCode];
			},
			downKeys: function() {
				return Object.keys(downKeys).map(parseFloat);
			},
			downValues: function() {
				refreshDownKeysInv();
				return Object.keys(downKeys).map(function(keyCode) { return keys[keyCode]; });
			},
			clearKeys: function() {
				keys = {};
			},
			addKey: function(keyCode, val) {
				keys[keyCode] = val;
			},
			readKey: function(val, cb) {
				readingVal = val;
				readingCb = cb;
			},
			readKeys: function(labels, values, beforeCb, afterCb, allDoneCb) {
				var i = 0;
				function doKey() {
					var l = labels[i];
					var v = values[i];
					beforeCb(l, v, i);
					k.readKey(v, function(kc, val) {
						afterCb(l, v, i, kc);
						++i;
						if (i === labels.length) {
							return allDoneCb();
						}
						doKey();
					});
				}
				doKey();
			},
			getKeys: function() {
				return keys;
			}
		};
	};

})();
