(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var pressed, request;

window.apihost = "http://tucvk.smartheadtest.ru/";

window.isTesting = true;

pressed = 0;

request = require('./request');

setTimeout((function() {
  return pressed = 0;
}), 3000);

$('.icon-header-tuclogo').on('click', function() {
  pressed++;
  if (pressed === 10) {
    return request.game.clear({}, function(res) {
      console.log(res);
      if (res.result === "success") {
        return location.reload();
      }
    });
  }
});


},{"./request":2}],2:[function(require,module,exports){
var Auth, host, keys, protocol, send;

keys = require('../tools/keys.coffee');

Auth = window.btoa('{"sid":"' + keys.sid + '","hash":"' + keys.hash + '"}');

protocol = location.protocol;

host = window.apihost || protocol + "//tuc-quest.ru/";

send = function(url, method, data, callback) {
  var crypt;
  crypt = !!crypt;
  data = data || {};
  return $.ajax({
    url: host + url,
    method: method,
    headers: {
      "Auth": window.btoa('{"sid":"' + keys.sid + '","hash":"' + keys.hash + '"}')
    },
    data: data,
    success: function(res) {
      if (callback != null) {
        return callback(res);
      }
    },
    error: function(err) {
      return console.log(err);
    }
  });
};

module.exports.faq = {
  get: function(opts, callback) {
    return send("api/faq/get", "GET", opts, callback);
  }
};

module.exports.rating = {
  all: function(opts, callback) {
    return send("api/rating/all", "GET", opts, callback);
  },
  common: function(opts, callback) {
    return send("api/rating/common", "GET", opts, callback);
  },
  current: function(opts, callback) {
    return send("api/rating/current", "GET", opts, callback);
  }
};

module.exports.user = {
  isReg: function(opts, callback) {
    return send("api/user/is-reg", "GET", opts, callback);
  },
  isFull: function(opts, callback) {
    return send("api/user/is-full", "GET", opts, callback);
  },
  get: function(opts, callback) {
    return send("api/user/get", "GET", opts, callback);
  },
  save: function(opts, callback) {
    return send("api/user/save", "GET", opts, callback);
  },
  registration: function(opts, callback) {
    return send("api/user/registration", "GET", opts, callback);
  }
};

module.exports.feedback = {
  get: function(opts, callback) {
    return send("api/feedback/get", "GET", opts, callback);
  },
  add: function(opts, callback) {
    return send("api/feedback/add", "POST", opts, callback);
  },
  read: function(opts, callback) {
    return send("api/feedback/read", "GET", opts, callback);
  }
};

module.exports.quests = {
  getList: function(opts, callback) {
    return send("api/quests/get-list", "GET", opts, callback);
  }
};

module.exports.game = {
  enter: function(opts, callback) {
    return send("api/game/enter", "GET", opts, callback);
  },
  getPoint: function(opts, callback) {
    return send("api/game/get-point", "GET", opts, callback);
  },
  checkMoney: function(opts, callback) {
    return send("api/game/check-money", "GET", opts, callback);
  },
  clear: function(opts, callback) {
    return send("api/game/clear", "GET", opts, callback);
  }
};

module.exports.achievement = {
  get: function(opts, callback) {
    return send("api/achievement/get", "GET", opts, callback);
  },
  getNew: function(opts, callback) {
    return send("api/achievement/get-new", "GET", opts, callback);
  },
  read: function(opts, callback) {
    return send("api/achievement/read", "GET", opts, callback);
  }
};

module.exports.event = {
  set: function(opts, callback) {
    return send("api/event/set", "GET", opts, callback);
  },
  get: function(opts, callback) {
    return send("api/event/get", "GET", opts, callback);
  }
};

module.exports.prize = {
  get: function(opts, callback) {
    return send("api/prize/get", "GET", opts, callback);
  }
};

module.exports.taste = {
  check: function(opts, callback) {
    return send("api/taste/check", "GET", opts, callback);
  },
  isEnabled: function(opts, callback) {
    return send("api/taste/is-enabled", "GET", opts, callback);
  }
};


},{"../tools/keys.coffee":3}],3:[function(require,module,exports){
var AppSetting, md5;

md5 = require('./md5.coffee');

AppSetting = window.AppSetting || {};

AppSetting.sid = AppSetting.sid || "1";

AppSetting.hash = AppSetting.hash || "hash_test";

AppSetting.viewer_id = AppSetting.viewer_id || "3943364";

AppSetting.auth_key = AppSetting.auth_key || "583416cf1bef69019ba7eea0ad68a78a";

module.exports = {
  sid: AppSetting.sid,
  hash: AppSetting.hash,
  viewer_id: AppSetting.viewer_id,
  auth_key: AppSetting.auth_key
};

module.exports.setHash = function(val) {
  return module.exports.hash = val;
};

module.exports.getMd5key = function() {
  return md5.encrypt(module.exports.hash + "__" + AppSetting.sid);
};


},{"./md5.coffee":4}],4:[function(require,module,exports){
function md5cycle(x, k) {
var a = x[0], b = x[1], c = x[2], d = x[3];

a = ff(a, b, c, d, k[0], 7, -680876936);
d = ff(d, a, b, c, k[1], 12, -389564586);
c = ff(c, d, a, b, k[2], 17,  606105819);
b = ff(b, c, d, a, k[3], 22, -1044525330);
a = ff(a, b, c, d, k[4], 7, -176418897);
d = ff(d, a, b, c, k[5], 12,  1200080426);
c = ff(c, d, a, b, k[6], 17, -1473231341);
b = ff(b, c, d, a, k[7], 22, -45705983);
a = ff(a, b, c, d, k[8], 7,  1770035416);
d = ff(d, a, b, c, k[9], 12, -1958414417);
c = ff(c, d, a, b, k[10], 17, -42063);
b = ff(b, c, d, a, k[11], 22, -1990404162);
a = ff(a, b, c, d, k[12], 7,  1804603682);
d = ff(d, a, b, c, k[13], 12, -40341101);
c = ff(c, d, a, b, k[14], 17, -1502002290);
b = ff(b, c, d, a, k[15], 22,  1236535329);

a = gg(a, b, c, d, k[1], 5, -165796510);
d = gg(d, a, b, c, k[6], 9, -1069501632);
c = gg(c, d, a, b, k[11], 14,  643717713);
b = gg(b, c, d, a, k[0], 20, -373897302);
a = gg(a, b, c, d, k[5], 5, -701558691);
d = gg(d, a, b, c, k[10], 9,  38016083);
c = gg(c, d, a, b, k[15], 14, -660478335);
b = gg(b, c, d, a, k[4], 20, -405537848);
a = gg(a, b, c, d, k[9], 5,  568446438);
d = gg(d, a, b, c, k[14], 9, -1019803690);
c = gg(c, d, a, b, k[3], 14, -187363961);
b = gg(b, c, d, a, k[8], 20,  1163531501);
a = gg(a, b, c, d, k[13], 5, -1444681467);
d = gg(d, a, b, c, k[2], 9, -51403784);
c = gg(c, d, a, b, k[7], 14,  1735328473);
b = gg(b, c, d, a, k[12], 20, -1926607734);

a = hh(a, b, c, d, k[5], 4, -378558);
d = hh(d, a, b, c, k[8], 11, -2022574463);
c = hh(c, d, a, b, k[11], 16,  1839030562);
b = hh(b, c, d, a, k[14], 23, -35309556);
a = hh(a, b, c, d, k[1], 4, -1530992060);
d = hh(d, a, b, c, k[4], 11,  1272893353);
c = hh(c, d, a, b, k[7], 16, -155497632);
b = hh(b, c, d, a, k[10], 23, -1094730640);
a = hh(a, b, c, d, k[13], 4,  681279174);
d = hh(d, a, b, c, k[0], 11, -358537222);
c = hh(c, d, a, b, k[3], 16, -722521979);
b = hh(b, c, d, a, k[6], 23,  76029189);
a = hh(a, b, c, d, k[9], 4, -640364487);
d = hh(d, a, b, c, k[12], 11, -421815835);
c = hh(c, d, a, b, k[15], 16,  530742520);
b = hh(b, c, d, a, k[2], 23, -995338651);

a = ii(a, b, c, d, k[0], 6, -198630844);
d = ii(d, a, b, c, k[7], 10,  1126891415);
c = ii(c, d, a, b, k[14], 15, -1416354905);
b = ii(b, c, d, a, k[5], 21, -57434055);
a = ii(a, b, c, d, k[12], 6,  1700485571);
d = ii(d, a, b, c, k[3], 10, -1894986606);
c = ii(c, d, a, b, k[10], 15, -1051523);
b = ii(b, c, d, a, k[1], 21, -2054922799);
a = ii(a, b, c, d, k[8], 6,  1873313359);
d = ii(d, a, b, c, k[15], 10, -30611744);
c = ii(c, d, a, b, k[6], 15, -1560198380);
b = ii(b, c, d, a, k[13], 21,  1309151649);
a = ii(a, b, c, d, k[4], 6, -145523070);
d = ii(d, a, b, c, k[11], 10, -1120210379);
c = ii(c, d, a, b, k[2], 15,  718787259);
b = ii(b, c, d, a, k[9], 21, -343485551);

x[0] = add32(a, x[0]);
x[1] = add32(b, x[1]);
x[2] = add32(c, x[2]);
x[3] = add32(d, x[3]);

}

function cmn(q, a, b, x, s, t) {
a = add32(add32(a, q), add32(x, t));
return add32((a << s) | (a >>> (32 - s)), b);
}

function ff(a, b, c, d, x, s, t) {
return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

function md51(s) {
	txt = '';
	var n = s.length,
		state = [1732584193, -271733879, -1732584194, 271733878], i;
	for (i=64; i<=s.length; i+=64) {
		md5cycle(state, md5blk(s.substring(i-64, i)));
	}
	s = s.substring(i-64);
	var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
	for (i=0; i<s.length; i++)
		tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
	tail[i>>2] |= 0x80 << ((i%4) << 3);
	if (i > 55) {
		md5cycle(state, tail);
		for (i=0; i<16; i++) tail[i] = 0;
	}
	tail[14] = n*8;
	md5cycle(state, tail);
	return state;
}

function md5blk(s) { /* I figured global was faster.   */
	var md5blks = [], i; /* Andy King said do it this way. */
	for (i=0; i<64; i+=4) {
		md5blks[i>>2] = s.charCodeAt(i)
		+ (s.charCodeAt(i+1) << 8)
		+ (s.charCodeAt(i+2) << 16)
		+ (s.charCodeAt(i+3) << 24);
	}
	return md5blks;
}

var hex_chr = '0123456789abcdef'.split('');

function rhex(n)
{
	var s='', j=0;
	for(; j<4; j++)
	s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
	+ hex_chr[(n >> (j * 8)) & 0x0F];
	return s;
}

function hex(x) {
	for (var i=0; i<x.length; i++)
	x[i] = rhex(x[i]);
	return x.join('');
}

function md5(s) {
	return hex(md51(s));
}

/* this function is much faster,
so if possible we use it. Some IEs
are the only ones I know of that
need the idiotic second function,
generated by an if clause.  */

function add32(a, b) {
	return (a + b) & 0xFFFFFFFF;
}

if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
	function add32(x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF),
		msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}
};
module.exports.encrypt = md5;


},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxcZm9ydGVzdC5jb2ZmZWUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxccmVxdWVzdFxcaW5kZXguY29mZmVlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXHRvb2xzXFxrZXlzLmNvZmZlZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFx0b29sc1xcbWQ1LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0VBLElBQUE7O0FBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7O0FBQ2pCLE1BQU0sQ0FBQyxTQUFQLEdBQW1COztBQUVuQixPQUFBLEdBQVU7O0FBRVYsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSOztBQUVWLFVBQUEsQ0FBVyxDQUFDLFNBQUE7U0FBRyxPQUFBLEdBQVU7QUFBYixDQUFELENBQVgsRUFBNkIsSUFBN0I7O0FBQ0EsQ0FBQSxDQUFFLHNCQUFGLENBQXlCLENBQUMsRUFBMUIsQ0FBNkIsT0FBN0IsRUFBc0MsU0FBQTtFQUNyQyxPQUFBO0VBQ0EsSUFBRyxPQUFBLEtBQVcsRUFBZDtXQUNDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBYixDQUFtQixFQUFuQixFQUF1QixTQUFDLEdBQUQ7TUFDdEIsT0FBTyxDQUFDLEdBQVIsQ0FBWSxHQUFaO01BQ0EsSUFBcUIsR0FBRyxDQUFDLE1BQUosS0FBYyxTQUFuQztlQUFBLFFBQVEsQ0FBQyxNQUFULENBQUEsRUFBQTs7SUFGc0IsQ0FBdkIsRUFERDs7QUFGcUMsQ0FBdEM7Ozs7QUNWQSxJQUFBOztBQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsc0JBQVI7O0FBRVAsSUFBQSxHQUFPLE1BQU0sQ0FBQyxJQUFQ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ZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxyXG5cclxud2luZG93LmFwaWhvc3QgPSBcImh0dHA6Ly90dWN2ay5zbWFydGhlYWR0ZXN0LnJ1L1wiXHJcbndpbmRvdy5pc1Rlc3RpbmcgPSB0cnVlXHJcblxyXG5wcmVzc2VkID0gMFxyXG5cclxucmVxdWVzdCA9IHJlcXVpcmUgJy4vcmVxdWVzdCdcclxuXHJcbnNldFRpbWVvdXQgKC0+IHByZXNzZWQgPSAwKSwgMzAwMFxyXG4kKCcuaWNvbi1oZWFkZXItdHVjbG9nbycpLm9uICdjbGljaycsIC0+XHJcblx0cHJlc3NlZCsrXHJcblx0aWYgcHJlc3NlZCA9PSAxMFxyXG5cdFx0cmVxdWVzdC5nYW1lLmNsZWFyIHt9LCAocmVzKSAtPlxyXG5cdFx0XHRjb25zb2xlLmxvZyByZXNcclxuXHRcdFx0bG9jYXRpb24ucmVsb2FkKCkgaWYgcmVzLnJlc3VsdCA9PSBcInN1Y2Nlc3NcIlxyXG4iLCJrZXlzID0gcmVxdWlyZSgnLi4vdG9vbHMva2V5cy5jb2ZmZWUnKVxyXG5cclxuQXV0aCA9IHdpbmRvdy5idG9hICd7XCJzaWRcIjpcIicra2V5cy5zaWQrJ1wiLFwiaGFzaFwiOlwiJytrZXlzLmhhc2grJ1wifSdcclxuXHJcbnByb3RvY29sID0gbG9jYXRpb24ucHJvdG9jb2xcclxuaG9zdCA9IHdpbmRvdy5hcGlob3N0IHx8IHByb3RvY29sK1wiLy90dWMtcXVlc3QucnUvXCJcclxuXHJcbnNlbmQgPSAodXJsLCBtZXRob2QsIGRhdGEsIGNhbGxiYWNrKSAtPlxyXG5cdGNyeXB0ID0gISFjcnlwdFxyXG5cdGRhdGEgPSBkYXRhIHx8IHt9XHJcblx0JC5hamF4IHtcclxuXHRcdHVybDogaG9zdCt1cmxcclxuXHRcdG1ldGhvZDogbWV0aG9kXHJcblx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFwiQXV0aFwiOiB3aW5kb3cuYnRvYSAne1wic2lkXCI6XCInK2tleXMuc2lkKydcIixcImhhc2hcIjpcIicra2V5cy5oYXNoKydcIn0nXHJcblx0XHR9XHJcblx0XHRkYXRhOiBkYXRhXHJcblx0XHRzdWNjZXNzOiAocmVzKSAtPlxyXG5cclxuXHRcdFx0Y2FsbGJhY2socmVzKSBpZiBjYWxsYmFjaz9cclxuXHRcdGVycm9yOiAoZXJyKSAtPlxyXG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpXHJcblx0fVxyXG5cclxubW9kdWxlLmV4cG9ydHMuZmFxID0ge1xyXG5cdGdldCA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvZmFxL2dldFwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxufVxyXG5tb2R1bGUuZXhwb3J0cy5yYXRpbmcgPSB7XHJcblx0YWxsIDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS9yYXRpbmcvYWxsXCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG5cclxuXHRjb21tb24gOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL3JhdGluZy9jb21tb25cIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcblxyXG5cdGN1cnJlbnQgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL3JhdGluZy9jdXJyZW50XCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG59XHJcbm1vZHVsZS5leHBvcnRzLnVzZXIgPSB7XHJcblx0aXNSZWcgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL3VzZXIvaXMtcmVnXCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG5cclxuXHRpc0Z1bGwgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL3VzZXIvaXMtZnVsbFwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxuXHJcblx0Z2V0IDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS91c2VyL2dldFwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxuXHJcblx0c2F2ZSA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvdXNlci9zYXZlXCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG5cclxuXHRyZWdpc3RyYXRpb24gOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL3VzZXIvcmVnaXN0cmF0aW9uXCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG59XHJcbm1vZHVsZS5leHBvcnRzLmZlZWRiYWNrID0ge1xyXG5cdGdldCA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvZmVlZGJhY2svZ2V0XCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG5cclxuXHRhZGQgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL2ZlZWRiYWNrL2FkZFwiLCBcIlBPU1RcIiwgb3B0cywgY2FsbGJhY2spXHJcblxyXG5cdHJlYWQgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL2ZlZWRiYWNrL3JlYWRcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcbn1cclxubW9kdWxlLmV4cG9ydHMucXVlc3RzID0ge1xyXG5cdGdldExpc3QgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL3F1ZXN0cy9nZXQtbGlzdFwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxufVxyXG5tb2R1bGUuZXhwb3J0cy5nYW1lID0ge1xyXG5cdGVudGVyIDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS9nYW1lL2VudGVyXCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG5cclxuXHRnZXRQb2ludCA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvZ2FtZS9nZXQtcG9pbnRcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcblxyXG5cdGNoZWNrTW9uZXkgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL2dhbWUvY2hlY2stbW9uZXlcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcblxyXG5cdGNsZWFyIDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS9nYW1lL2NsZWFyXCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG59XHJcbm1vZHVsZS5leHBvcnRzLmFjaGlldmVtZW50ID0ge1xyXG5cdGdldCA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvYWNoaWV2ZW1lbnQvZ2V0XCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG5cclxuXHRnZXROZXcgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL2FjaGlldmVtZW50L2dldC1uZXdcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcblxyXG5cdHJlYWQgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL2FjaGlldmVtZW50L3JlYWRcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcbn1cclxubW9kdWxlLmV4cG9ydHMuZXZlbnQgPSB7XHJcblx0c2V0IDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS9ldmVudC9zZXRcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcblx0Z2V0IDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS9ldmVudC9nZXRcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcbn1cclxubW9kdWxlLmV4cG9ydHMucHJpemUgPSB7XHJcblx0Z2V0IDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS9wcml6ZS9nZXRcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcbn1cclxubW9kdWxlLmV4cG9ydHMudGFzdGUgPSB7XHJcblx0Y2hlY2sgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL3Rhc3RlL2NoZWNrXCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG5cdGlzRW5hYmxlZCA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvdGFzdGUvaXMtZW5hYmxlZFwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxufSIsIm1kNSA9IHJlcXVpcmUgJy4vbWQ1LmNvZmZlZSdcclxuXHJcbkFwcFNldHRpbmcgPSB3aW5kb3cuQXBwU2V0dGluZyB8fCB7fVxyXG5cclxuQXBwU2V0dGluZy5zaWQgPSBBcHBTZXR0aW5nLnNpZCB8fCBcIjFcIlxyXG5BcHBTZXR0aW5nLmhhc2ggPSBBcHBTZXR0aW5nLmhhc2ggfHwgXCJoYXNoX3Rlc3RcIlxyXG5BcHBTZXR0aW5nLnZpZXdlcl9pZCA9IEFwcFNldHRpbmcudmlld2VyX2lkIHx8IFwiMzk0MzM2NFwiXHJcbkFwcFNldHRpbmcuYXV0aF9rZXkgPSBBcHBTZXR0aW5nLmF1dGhfa2V5IHx8IFwiNTgzNDE2Y2YxYmVmNjkwMTliYTdlZWEwYWQ2OGE3OGFcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0c2lkOiBBcHBTZXR0aW5nLnNpZFxyXG5cdGhhc2g6IEFwcFNldHRpbmcuaGFzaFxyXG5cdHZpZXdlcl9pZCA6IEFwcFNldHRpbmcudmlld2VyX2lkXHJcblx0YXV0aF9rZXkgOiBBcHBTZXR0aW5nLmF1dGhfa2V5XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLnNldEhhc2ggPSAodmFsKSAtPlxyXG5cdG1vZHVsZS5leHBvcnRzLmhhc2ggPSB2YWxcclxuXHJcbm1vZHVsZS5leHBvcnRzLmdldE1kNWtleSA9ICgpIC0+XHJcblx0cmV0dXJuIG1kNS5lbmNyeXB0KG1vZHVsZS5leHBvcnRzLmhhc2ggKyBcIl9fXCIgKyBBcHBTZXR0aW5nLnNpZClcclxuIiwiYGZ1bmN0aW9uIG1kNWN5Y2xlKHgsIGspIHtcclxudmFyIGEgPSB4WzBdLCBiID0geFsxXSwgYyA9IHhbMl0sIGQgPSB4WzNdO1xyXG5cclxuYSA9IGZmKGEsIGIsIGMsIGQsIGtbMF0sIDcsIC02ODA4NzY5MzYpO1xyXG5kID0gZmYoZCwgYSwgYiwgYywga1sxXSwgMTIsIC0zODk1NjQ1ODYpO1xyXG5jID0gZmYoYywgZCwgYSwgYiwga1syXSwgMTcsICA2MDYxMDU4MTkpO1xyXG5iID0gZmYoYiwgYywgZCwgYSwga1szXSwgMjIsIC0xMDQ0NTI1MzMwKTtcclxuYSA9IGZmKGEsIGIsIGMsIGQsIGtbNF0sIDcsIC0xNzY0MTg4OTcpO1xyXG5kID0gZmYoZCwgYSwgYiwgYywga1s1XSwgMTIsICAxMjAwMDgwNDI2KTtcclxuYyA9IGZmKGMsIGQsIGEsIGIsIGtbNl0sIDE3LCAtMTQ3MzIzMTM0MSk7XHJcbmIgPSBmZihiLCBjLCBkLCBhLCBrWzddLCAyMiwgLTQ1NzA1OTgzKTtcclxuYSA9IGZmKGEsIGIsIGMsIGQsIGtbOF0sIDcsICAxNzcwMDM1NDE2KTtcclxuZCA9IGZmKGQsIGEsIGIsIGMsIGtbOV0sIDEyLCAtMTk1ODQxNDQxNyk7XHJcbmMgPSBmZihjLCBkLCBhLCBiLCBrWzEwXSwgMTcsIC00MjA2Myk7XHJcbmIgPSBmZihiLCBjLCBkLCBhLCBrWzExXSwgMjIsIC0xOTkwNDA0MTYyKTtcclxuYSA9IGZmKGEsIGIsIGMsIGQsIGtbMTJdLCA3LCAgMTgwNDYwMzY4Mik7XHJcbmQgPSBmZihkLCBhLCBiLCBjLCBrWzEzXSwgMTIsIC00MDM0MTEwMSk7XHJcbmMgPSBmZihjLCBkLCBhLCBiLCBrWzE0XSwgMTcsIC0xNTAyMDAyMjkwKTtcclxuYiA9IGZmKGIsIGMsIGQsIGEsIGtbMTVdLCAyMiwgIDEyMzY1MzUzMjkpO1xyXG5cclxuYSA9IGdnKGEsIGIsIGMsIGQsIGtbMV0sIDUsIC0xNjU3OTY1MTApO1xyXG5kID0gZ2coZCwgYSwgYiwgYywga1s2XSwgOSwgLTEwNjk1MDE2MzIpO1xyXG5jID0gZ2coYywgZCwgYSwgYiwga1sxMV0sIDE0LCAgNjQzNzE3NzEzKTtcclxuYiA9IGdnKGIsIGMsIGQsIGEsIGtbMF0sIDIwLCAtMzczODk3MzAyKTtcclxuYSA9IGdnKGEsIGIsIGMsIGQsIGtbNV0sIDUsIC03MDE1NTg2OTEpO1xyXG5kID0gZ2coZCwgYSwgYiwgYywga1sxMF0sIDksICAzODAxNjA4Myk7XHJcbmMgPSBnZyhjLCBkLCBhLCBiLCBrWzE1XSwgMTQsIC02NjA0NzgzMzUpO1xyXG5iID0gZ2coYiwgYywgZCwgYSwga1s0XSwgMjAsIC00MDU1Mzc4NDgpO1xyXG5hID0gZ2coYSwgYiwgYywgZCwga1s5XSwgNSwgIDU2ODQ0NjQzOCk7XHJcbmQgPSBnZyhkLCBhLCBiLCBjLCBrWzE0XSwgOSwgLTEwMTk4MDM2OTApO1xyXG5jID0gZ2coYywgZCwgYSwgYiwga1szXSwgMTQsIC0xODczNjM5NjEpO1xyXG5iID0gZ2coYiwgYywgZCwgYSwga1s4XSwgMjAsICAxMTYzNTMxNTAxKTtcclxuYSA9IGdnKGEsIGIsIGMsIGQsIGtbMTNdLCA1LCAtMTQ0NDY4MTQ2Nyk7XHJcbmQgPSBnZyhkLCBhLCBiLCBjLCBrWzJdLCA5LCAtNTE0MDM3ODQpO1xyXG5jID0gZ2coYywgZCwgYSwgYiwga1s3XSwgMTQsICAxNzM1MzI4NDczKTtcclxuYiA9IGdnKGIsIGMsIGQsIGEsIGtbMTJdLCAyMCwgLTE5MjY2MDc3MzQpO1xyXG5cclxuYSA9IGhoKGEsIGIsIGMsIGQsIGtbNV0sIDQsIC0zNzg1NTgpO1xyXG5kID0gaGgoZCwgYSwgYiwgYywga1s4XSwgMTEsIC0yMDIyNTc0NDYzKTtcclxuYyA9IGhoKGMsIGQsIGEsIGIsIGtbMTFdLCAxNiwgIDE4MzkwMzA1NjIpO1xyXG5iID0gaGgoYiwgYywgZCwgYSwga1sxNF0sIDIzLCAtMzUzMDk1NTYpO1xyXG5hID0gaGgoYSwgYiwgYywgZCwga1sxXSwgNCwgLTE1MzA5OTIwNjApO1xyXG5kID0gaGgoZCwgYSwgYiwgYywga1s0XSwgMTEsICAxMjcyODkzMzUzKTtcclxuYyA9IGhoKGMsIGQsIGEsIGIsIGtbN10sIDE2LCAtMTU1NDk3NjMyKTtcclxuYiA9IGhoKGIsIGMsIGQsIGEsIGtbMTBdLCAyMywgLTEwOTQ3MzA2NDApO1xyXG5hID0gaGgoYSwgYiwgYywgZCwga1sxM10sIDQsICA2ODEyNzkxNzQpO1xyXG5kID0gaGgoZCwgYSwgYiwgYywga1swXSwgMTEsIC0zNTg1MzcyMjIpO1xyXG5jID0gaGgoYywgZCwgYSwgYiwga1szXSwgMTYsIC03MjI1MjE5NzkpO1xyXG5iID0gaGgoYiwgYywgZCwgYSwga1s2XSwgMjMsICA3NjAyOTE4OSk7XHJcbmEgPSBoaChhLCBiLCBjLCBkLCBrWzldLCA0LCAtNjQwMzY0NDg3KTtcclxuZCA9IGhoKGQsIGEsIGIsIGMsIGtbMTJdLCAxMSwgLTQyMTgxNTgzNSk7XHJcbmMgPSBoaChjLCBkLCBhLCBiLCBrWzE1XSwgMTYsICA1MzA3NDI1MjApO1xyXG5iID0gaGgoYiwgYywgZCwgYSwga1syXSwgMjMsIC05OTUzMzg2NTEpO1xyXG5cclxuYSA9IGlpKGEsIGIsIGMsIGQsIGtbMF0sIDYsIC0xOTg2MzA4NDQpO1xyXG5kID0gaWkoZCwgYSwgYiwgYywga1s3XSwgMTAsICAxMTI2ODkxNDE1KTtcclxuYyA9IGlpKGMsIGQsIGEsIGIsIGtbMTRdLCAxNSwgLTE0MTYzNTQ5MDUpO1xyXG5iID0gaWkoYiwgYywgZCwgYSwga1s1XSwgMjEsIC01NzQzNDA1NSk7XHJcbmEgPSBpaShhLCBiLCBjLCBkLCBrWzEyXSwgNiwgIDE3MDA0ODU1NzEpO1xyXG5kID0gaWkoZCwgYSwgYiwgYywga1szXSwgMTAsIC0xODk0OTg2NjA2KTtcclxuYyA9IGlpKGMsIGQsIGEsIGIsIGtbMTBdLCAxNSwgLTEwNTE1MjMpO1xyXG5iID0gaWkoYiwgYywgZCwgYSwga1sxXSwgMjEsIC0yMDU0OTIyNzk5KTtcclxuYSA9IGlpKGEsIGIsIGMsIGQsIGtbOF0sIDYsICAxODczMzEzMzU5KTtcclxuZCA9IGlpKGQsIGEsIGIsIGMsIGtbMTVdLCAxMCwgLTMwNjExNzQ0KTtcclxuYyA9IGlpKGMsIGQsIGEsIGIsIGtbNl0sIDE1LCAtMTU2MDE5ODM4MCk7XHJcbmIgPSBpaShiLCBjLCBkLCBhLCBrWzEzXSwgMjEsICAxMzA5MTUxNjQ5KTtcclxuYSA9IGlpKGEsIGIsIGMsIGQsIGtbNF0sIDYsIC0xNDU1MjMwNzApO1xyXG5kID0gaWkoZCwgYSwgYiwgYywga1sxMV0sIDEwLCAtMTEyMDIxMDM3OSk7XHJcbmMgPSBpaShjLCBkLCBhLCBiLCBrWzJdLCAxNSwgIDcxODc4NzI1OSk7XHJcbmIgPSBpaShiLCBjLCBkLCBhLCBrWzldLCAyMSwgLTM0MzQ4NTU1MSk7XHJcblxyXG54WzBdID0gYWRkMzIoYSwgeFswXSk7XHJcbnhbMV0gPSBhZGQzMihiLCB4WzFdKTtcclxueFsyXSA9IGFkZDMyKGMsIHhbMl0pO1xyXG54WzNdID0gYWRkMzIoZCwgeFszXSk7XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBjbW4ocSwgYSwgYiwgeCwgcywgdCkge1xyXG5hID0gYWRkMzIoYWRkMzIoYSwgcSksIGFkZDMyKHgsIHQpKTtcclxucmV0dXJuIGFkZDMyKChhIDw8IHMpIHwgKGEgPj4+ICgzMiAtIHMpKSwgYik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZmKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcclxucmV0dXJuIGNtbigoYiAmIGMpIHwgKCh+YikgJiBkKSwgYSwgYiwgeCwgcywgdCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdnKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcclxucmV0dXJuIGNtbigoYiAmIGQpIHwgKGMgJiAofmQpKSwgYSwgYiwgeCwgcywgdCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhoKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcclxucmV0dXJuIGNtbihiIF4gYyBeIGQsIGEsIGIsIHgsIHMsIHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpaShhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XHJcbnJldHVybiBjbW4oYyBeIChiIHwgKH5kKSksIGEsIGIsIHgsIHMsIHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtZDUxKHMpIHtcclxuXHR0eHQgPSAnJztcclxuXHR2YXIgbiA9IHMubGVuZ3RoLFxyXG5cdFx0c3RhdGUgPSBbMTczMjU4NDE5MywgLTI3MTczMzg3OSwgLTE3MzI1ODQxOTQsIDI3MTczMzg3OF0sIGk7XHJcblx0Zm9yIChpPTY0OyBpPD1zLmxlbmd0aDsgaSs9NjQpIHtcclxuXHRcdG1kNWN5Y2xlKHN0YXRlLCBtZDVibGsocy5zdWJzdHJpbmcoaS02NCwgaSkpKTtcclxuXHR9XHJcblx0cyA9IHMuc3Vic3RyaW5nKGktNjQpO1xyXG5cdHZhciB0YWlsID0gWzAsMCwwLDAsIDAsMCwwLDAsIDAsMCwwLDAsIDAsMCwwLDBdO1xyXG5cdGZvciAoaT0wOyBpPHMubGVuZ3RoOyBpKyspXHJcblx0XHR0YWlsW2k+PjJdIHw9IHMuY2hhckNvZGVBdChpKSA8PCAoKGklNCkgPDwgMyk7XHJcblx0dGFpbFtpPj4yXSB8PSAweDgwIDw8ICgoaSU0KSA8PCAzKTtcclxuXHRpZiAoaSA+IDU1KSB7XHJcblx0XHRtZDVjeWNsZShzdGF0ZSwgdGFpbCk7XHJcblx0XHRmb3IgKGk9MDsgaTwxNjsgaSsrKSB0YWlsW2ldID0gMDtcclxuXHR9XHJcblx0dGFpbFsxNF0gPSBuKjg7XHJcblx0bWQ1Y3ljbGUoc3RhdGUsIHRhaWwpO1xyXG5cdHJldHVybiBzdGF0ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gbWQ1YmxrKHMpIHsgLyogSSBmaWd1cmVkIGdsb2JhbCB3YXMgZmFzdGVyLiAgICovXHJcblx0dmFyIG1kNWJsa3MgPSBbXSwgaTsgLyogQW5keSBLaW5nIHNhaWQgZG8gaXQgdGhpcyB3YXkuICovXHJcblx0Zm9yIChpPTA7IGk8NjQ7IGkrPTQpIHtcclxuXHRcdG1kNWJsa3NbaT4+Ml0gPSBzLmNoYXJDb2RlQXQoaSlcclxuXHRcdCsgKHMuY2hhckNvZGVBdChpKzEpIDw8IDgpXHJcblx0XHQrIChzLmNoYXJDb2RlQXQoaSsyKSA8PCAxNilcclxuXHRcdCsgKHMuY2hhckNvZGVBdChpKzMpIDw8IDI0KTtcclxuXHR9XHJcblx0cmV0dXJuIG1kNWJsa3M7XHJcbn1cclxuXHJcbnZhciBoZXhfY2hyID0gJzAxMjM0NTY3ODlhYmNkZWYnLnNwbGl0KCcnKTtcclxuXHJcbmZ1bmN0aW9uIHJoZXgobilcclxue1xyXG5cdHZhciBzPScnLCBqPTA7XHJcblx0Zm9yKDsgajw0OyBqKyspXHJcblx0cyArPSBoZXhfY2hyWyhuID4+IChqICogOCArIDQpKSAmIDB4MEZdXHJcblx0KyBoZXhfY2hyWyhuID4+IChqICogOCkpICYgMHgwRl07XHJcblx0cmV0dXJuIHM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhleCh4KSB7XHJcblx0Zm9yICh2YXIgaT0wOyBpPHgubGVuZ3RoOyBpKyspXHJcblx0eFtpXSA9IHJoZXgoeFtpXSk7XHJcblx0cmV0dXJuIHguam9pbignJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1kNShzKSB7XHJcblx0cmV0dXJuIGhleChtZDUxKHMpKTtcclxufVxyXG5cclxuLyogdGhpcyBmdW5jdGlvbiBpcyBtdWNoIGZhc3Rlcixcclxuc28gaWYgcG9zc2libGUgd2UgdXNlIGl0LiBTb21lIElFc1xyXG5hcmUgdGhlIG9ubHkgb25lcyBJIGtub3cgb2YgdGhhdFxyXG5uZWVkIHRoZSBpZGlvdGljIHNlY29uZCBmdW5jdGlvbixcclxuZ2VuZXJhdGVkIGJ5IGFuIGlmIGNsYXVzZS4gICovXHJcblxyXG5mdW5jdGlvbiBhZGQzMihhLCBiKSB7XHJcblx0cmV0dXJuIChhICsgYikgJiAweEZGRkZGRkZGO1xyXG59XHJcblxyXG5pZiAobWQ1KCdoZWxsbycpICE9ICc1ZDQxNDAyYWJjNGIyYTc2Yjk3MTlkOTExMDE3YzU5MicpIHtcclxuXHRmdW5jdGlvbiBhZGQzMih4LCB5KSB7XHJcblx0XHR2YXIgbHN3ID0gKHggJiAweEZGRkYpICsgKHkgJiAweEZGRkYpLFxyXG5cdFx0bXN3ID0gKHggPj4gMTYpICsgKHkgPj4gMTYpICsgKGxzdyA+PiAxNik7XHJcblx0XHRyZXR1cm4gKG1zdyA8PCAxNikgfCAobHN3ICYgMHhGRkZGKTtcclxuXHR9XHJcbn1gXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5lbmNyeXB0ID0gbWQ1Il19
