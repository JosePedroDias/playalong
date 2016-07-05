(function() {
	'use strict';

	ajax({
		uri:'songs/Black_Sabbath-War_Pigs_DRUMS.json',
		cb: function(err, res) {
			if (err) { return alert(err); }
			res = JSON.parse(res);

			console.log(res);

			var es = eventsStreamWidget({
				canvas: document.getElementsByTagName('canvas')[0],
				labels: res.labels,
				colors: 'F00 0F0 00F FF0 F0F 0FF A00 0A0 00A AA0 A0A 0AA'.split(' '),
				events: res.stream,
				future: 4,
				past:   0.5
			});

			var t = 0;

			function onFrame(T) {
				t = -0.5 + T * 0.001;
				//console.log(t);
				es.draw(t);
				window.requestAnimationFrame(onFrame);
			}

			onFrame(0);
		}
	})

})();
