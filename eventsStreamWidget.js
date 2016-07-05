// https://simon.html5.org/dump/html5-canvas-cheat-sheet.html

(function() {
	'use strict';

	// shim layer with setTimeout fallback
	window.requestAnimFrame = (function(){
		return	window.requestAnimationFrame       ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				function(cb){
					window.setTimeout(cb, 1000/60);
				};
	})();

	function lerp(s, e, t) {
		return s + t * (e - s);
	}

	function place(s, e, t) {
		return (t-s) / (e-s);
	}

	function mins(t) {
		var m = Math.floor( t / 60 );
		var s = t - 60 * m;
		var pad = s < 10;
		return [m, ':', pad ? '0' : '', s.toFixed(2)].join('');
	}

	function eventsStreamWidget(cfg) {
		var el = cfg.canvas;
		var ctx = el.getContext('2d');

		var W = parseInt( el.getAttribute('width' ) , 10),
		    H = parseInt( el.getAttribute('height') , 10),
		    L = cfg.labels.length;

		var COL = W/L;

		ctx.lineWidth = 1/4*COL;
		ctx.lineCap  = 'round';
		ctx.lineJoin = 'round';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'bottom';
		ctx.font = '15px \'PT Sans Narrow\'';

		var gradH1 = Math.ceil( ctx.lineWidth * 10 );
		var gradH2 = Math.ceil( ctx.lineWidth );

		var grad1 = ctx.createLinearGradient(0, 0, 0, gradH1);
        grad1.addColorStop(0, '#222');
        grad1.addColorStop(1, 'rgba(34, 34, 34, 0)'); // #222 alpha 0

        var grad2 = ctx.createLinearGradient(0, H-gradH2, 0, H);
        grad2.addColorStop(0, 'rgba(34, 34, 34, 0)');
        grad2.addColorStop(1, '#222');


		var dt2 = cfg.dt/2;

		var presentH = H * cfg.future / (cfg.past + cfg.future);

		var draw = function(t) {
      //console.log(t);
			var t0 = t - cfg.past;
			var t1 = t + cfg.future;

			//ctx.clearRect(0, 0, W, H);
			ctx.fillStyle = '#222';
			ctx.fillRect(0, 0, W, H);

			var nrSkips = 0;
			cfg.labels.forEach(function(label, i) {
				var clr = cfg.colors[i];

				ctx.strokeStyle = '#' + clr;
				var evs = cfg.events[i];
				var x = (i+0.5)*COL;
				var yy0, yy1;

				for (var j = 0, J = evs.length, e; j < J; ++j) {
					e = evs[j];
					yy0 = place(t0, t1, e.t);
					yy1 = place(t0, t1, e.T);
					if (yy1 < 0 || yy0 > 1) { continue; }
					if (yy1 === yy0) { yy1 += 0.001; }

					if (e.t <= t && !e.f) { // e.f means it's been fired already
						if (cfg.onEvent) {
							cfg.onEvent(e);
						}
						e.f = true;
					}

          var _y0 = H-lerp(0, H, yy0);
          var _y1 = H-lerp(0, H, yy1);

          var pwr = e.v / 127

          ctx.globalAlpha = pwr;
          ctx.beginPath();
            ctx.arc(x, _y0, pwr * COL/3, 0, 2*Math.PI);
          ctx.stroke();

          ctx.globalAlpha = pwr/6;
					ctx.beginPath();
						ctx.moveTo(x, _y0);
						ctx.lineTo(x, _y1);
					ctx.stroke();
				}

				ctx.globalAlpha = 0.33;
				ctx.fillStyle = '#' + clr;
				ctx.fillText(label, x +1, presentH + H/20);
				ctx.fillText(label, x -1, presentH + H/20);
				ctx.fillText(label, x,    presentH + H/20 +1);
				ctx.fillText(label, x,    presentH + H/20 -1);
				ctx.globalAlpha = 1;

				ctx.fillStyle = '#FFF';
				ctx.fillText(label, x, presentH + H/20);
			});

			ctx.fillText(mins(t), W/2, H-30);

			ctx.fillRect(0, presentH, W, 1);

			ctx.fillStyle = grad1;
			ctx.fillRect(0, 0, W, gradH1);

			ctx.fillStyle = grad2;
			ctx.fillRect(0, H-gradH2, W, gradH2);
		};

		return {
			draw: draw
		};
	}

	window.eventsStreamWidget = eventsStreamWidget;

})();
