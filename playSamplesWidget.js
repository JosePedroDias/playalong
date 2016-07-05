(function() {
	'use strict';

	var prefix = 'samples/jam_with_chrome/';

	var sounds = {};
  window.sounds = sounds; // temp

	var map = {};
	var arr = '35 38 42 44 46 41 45 48 49 51 53'.split(' ');
	arr.forEach(function(n) {
		map[n] = prefix + n + '.ogg';
	});
	loadSounds(sounds, map);

	window.addEventListener('keydown', function(ev) {
		var name;
		switch (ev.keyCode) {
			case 32: name = '35'; break; // 'space';

			case 81: name = '49'; break; // 'q';

			case 65: name = '42'; break; // 'a';
			case 83: name = '44'; break; // 's';
			case 68: name = '46'; break; // 'd';

			case 90: name = '38'; break; // 'z';

			case 74: name = '51'; break; // 'u';
			case 75: name = '53'; break; // 'i';

			case 85: name = '41'; break; // 'j';
			case 73: name = '45'; break; // 'k';
			case 79: name = '48'; break; // 'l';

			default:
				//return console.log(ev.keyCode);
				return;
		}

		console.log(name);

		ev.preventDefault();
		ev.stopPropagation();

		playSound(sounds[name], 0);
	});

	window.playSound_ = function(name) {
		try {
			playSound(sounds[name], 0);
		} catch (ex) {}
	};

})();
