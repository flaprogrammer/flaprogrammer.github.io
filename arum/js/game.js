(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jade = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return (Array.isArray(val) ? val.map(joinClasses) :
    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
    [val]).filter(nulls).join(' ');
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};


exports.style = function (val) {
  if (val && typeof val === 'object') {
    return Object.keys(val).map(function (style) {
      return style + ':' + val[style];
    }).join(';');
  } else {
    return val;
  }
};
/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if (key === 'style') {
    val = exports.style(val);
  }
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    if (JSON.stringify(val).indexOf('&') !== -1) {
      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
                   'will be escaped to `&amp;`');
    };
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will eliminate the double quotes around dates in ' +
                   'ISO form after 2.0.0');
    }
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

var jade_encode_html_rules = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
};
var jade_match_html = /[&<>"]/g;

function jade_encode_char(c) {
  return jade_encode_html_rules[c] || c;
}

exports.escape = jade_escape;
function jade_escape(html){
  var result = String(html).replace(jade_match_html, jade_encode_char);
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || require('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

exports.DebugItem = function DebugItem(lineno, filename) {
  this.lineno = lineno;
  this.filename = filename;
}

},{"fs":2}],2:[function(require,module,exports){

},{}]},{},[1])(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"fs":1}],3:[function(require,module,exports){
var links, popups, request, vk;

request = require('./request');

links = require('./tools/links.coffee');

popups = require('./popups');

vk = require('./tools/vk.coffee');

vk.init(function() {
  var game, header, quests, rating, startGame;
  vk.resize(1400);
  rating = require('./rating').init({
    page: "game"
  });
  header = require('./header');
  game = require('./game/index.coffee');
  quests = require('./quests');
  startGame = function() {
    var qid;
    qid = links.parseGetParams().quest_id;
    return game.init(qid);
  };
  return startGame();
});


},{"./game/index.coffee":6,"./header":14,"./popups":22,"./quests":48,"./rating":50,"./request":52,"./tools/links.coffee":57,"./tools/vk.coffee":59}],4:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (com, cur) {
buf.push("<div class=\"quest__crackcount\"><div class=\"quest__crackcount-text\">Найдено крекеров</div><div class=\"quest__crackcount-val\">" + (jade.escape((jade_interp = cur) == null ? '' : jade_interp)) + " / " + (jade.escape((jade_interp = com) == null ? '' : jade_interp)) + "</div></div>");}.call(this,"com" in locals_for_with?locals_for_with.com:typeof com!=="undefined"?com:undefined,"cur" in locals_for_with?locals_for_with.cur:typeof cur!=="undefined"?cur:undefined));;return buf.join("");
};
},{"jade/runtime":2}],5:[function(require,module,exports){
var Map, all_crackers_num, captureCracker, crackTemplate, crackerClickHandler, crackers, cur_crackers_num, keys, popups, renderCount, request;

Map = require('./map.coffee');

request = require('../request');

popups = require('../popups');

keys = require('../tools/keys.coffee');

crackTemplate = require('./crackcount.jade');

crackers = [];

all_crackers_num = 0;

cur_crackers_num = 0;

module.exports.setCrackersNum = function(num) {
  return all_crackers_num = num;
};

module.exports.addCrackers = function(points) {
  var i, k, lat, len, lon, newPoint, point, results;
  cur_crackers_num = all_crackers_num - ((function() {
    var i, len, results;
    results = [];
    for (i = 0, len = points.length; i < len; i++) {
      k = points[i];
      if (k) {
        results.push(k);
      }
    }
    return results;
  })()).length;
  renderCount();
  results = [];
  for (i = 0, len = points.length; i < len; i++) {
    point = points[i];
    if (!(point != null)) {
      continue;
    }
    lat = parseFloat(point.lat);
    lon = parseFloat(point.lon);
    newPoint = new google.maps.Marker({
      position: {
        lat: lat,
        lng: lon
      },
      map: Map.getMap(),
      icon: "./img/images/cracker.png?id=2",
      title: 'Крекер',
      visible: false,
      origLat: point.lat,
      origLng: point.lon,
      info: point.info
    });
    newPoint.addListener('click', crackerClickHandler);
    results.push(crackers.push(newPoint));
  }
  return results;
};

crackerClickHandler = function(e) {
  var index, info, lat, lon;
  index = crackers.indexOf(this);
  console.log(index);
  lat = this.origLat;
  lon = this.origLng;
  info = this.info;
  return request.game.getPoint({
    lat: lat,
    lon: lon
  }, function(res) {
    console.log(res);
    if (res.result === "success") {
      return captureCracker(index, res);
    }
  });
};

captureCracker = function(index, res) {
  keys.setHash(res.hash);
  crackers[index].setVisible(false);
  crackers.splice(index, 1);
  cur_crackers_num++;
  return renderCount();
};

renderCount = function() {
  return $('.quest__crackcount-forloading').html(crackTemplate({
    cur: cur_crackers_num,
    com: all_crackers_num
  }));
};

module.exports.getCrackers = function() {
  return crackers;
};


},{"../popups":22,"../request":52,"../tools/keys.coffee":56,"./crackcount.jade":4,"./map.coffee":7}],6:[function(require,module,exports){
var crackers, crypto, keys, map, money, pizzas, points, request;

request = require('../request');

map = require('./map.coffee');

points = require('./points.coffee');

crackers = require('./crackers.coffee');

pizzas = require('./tucpizza.coffee');

money = require('./money.coffee');

keys = require('../tools/keys.coffee');

crypto = require('../tools/crypto.coffee');

module.exports.init = function(id) {
  return request.game.enter({
    quest_id: id
  }, function(res) {
    keys.setHash(res.hash);
    res.points = crypto.decrypt(res.points.str, res.points.iv);
    console.log(res);
    map.init(res);
    crackers.setCrackersNum(res.quest.count.crackers);
    points.addCheckpoints(res.points.checkpoints);
    crackers.addCrackers(res.points.crackers);
    pizzas.addPizzas(res.points.pizza);
    money.addMoney(res.points.money);
    points.findCurrentPoint(res.points.checkpoints);
    points.showFirstPopup(res);
    return $('.js-showHint').on('click', function() {
      return points.showPrevPopup();
    });
  });
};


},{"../request":52,"../tools/crypto.coffee":55,"../tools/keys.coffee":56,"./crackers.coffee":5,"./map.coffee":7,"./money.coffee":8,"./points.coffee":9,"./tucpizza.coffee":12}],7:[function(require,module,exports){
var Crackers, Money, Pizzas, Points, addDragControl, addPanoramaControl, gmap, panorama, request, route, streetView, testing, visibleDist;

route = require('./route.coffee');

request = require('../request');

Points = require('./points.coffee');

Crackers = require('./crackers.coffee');

Money = require('./money.coffee');

Pizzas = require('./tucpizza.coffee');

gmap = null;

panorama = null;

testing = !!window.isTesting;

streetView = false;

visibleDist = 0.001;

module.exports.init = function(opts) {
  var $map, astorPlace, bottom_x, bottom_y, top_x, top_y;
  top_x = parseFloat(opts.quest.border_left_top_x);
  top_y = parseFloat(opts.quest.border_left_top_y);
  bottom_x = parseFloat(opts.quest.border_right_bottom_x);
  bottom_y = parseFloat(opts.quest.border_right_bottom_y);
  astorPlace = {
    lat: (top_x + bottom_x) / 2,
    lng: (top_y + bottom_y) / 2
  };
  $map = $('#map');
  gmap = new google.maps.Map($map[0], {
    center: astorPlace,
    zoom: 13,
    minZoom: 2,
    streetViewControl: true
  });

  /*rectangle = new google.maps.Rectangle({
  		strokeColor: '#FF0000'
  		strokeOpacity: 0.8
  		strokeWeight: 2
  		fillColor: '#FF0000'
  		fillOpacity: 0.1
  		map: gmap
  		bounds: {
  			north: top_x
  			south: bottom_x
  			east: top_y
  			west: bottom_y
  		}
  	})
   */
  addDragControl(opts);
  return addPanoramaControl();
};

addDragControl = function(opts) {
  var bottom_x, bottom_y, top_x, top_y;
  top_x = parseFloat(opts.quest.border_left_top_x);
  top_y = parseFloat(opts.quest.border_left_top_y);
  bottom_x = parseFloat(opts.quest.border_right_bottom_x);
  return bottom_y = parseFloat(opts.quest.border_right_bottom_y);

  /*google.maps.event.addListener gmap, 'dragend', ->
  
  		x = gmap.getCenter().lat()
  		y = gmap.getCenter().lng()
  
  
  		if y < top_y then y = top_y
  		if y > bottom_y then y = bottom_y
  		if x < bottom_x then x = bottom_x
  		if x > top_x then x = top_x
  
  		gmap.setCenter(new google.maps.LatLng(x,y))
   */
};

addPanoramaControl = function() {
  var checkManhint, checkPointsVisibility;
  panorama = gmap.getStreetView();
  checkPointsVisibility = function() {
    var i, j, k, l, len, len1, len2, len3, plat, plon, point, ref, ref1, ref2, ref3, results;
    if (!testing) {
      plat = panorama.getPosition().lat();
      plon = panorama.getPosition().lng();
      ref = Points.getCheckpoints();
      for (i = 0, len = ref.length; i < len; i++) {
        point = ref[i];
        if (Math.abs(plat - point.position.lat()) < visibleDist && Math.abs(plon - point.position.lng()) < visibleDist) {
          point.setVisible(true);
        } else {
          point.setVisible(false);
        }
      }
      ref1 = Crackers.getCrackers();
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        point = ref1[j];
        if (Math.abs(plat - point.position.lat()) < visibleDist && Math.abs(plon - point.position.lng()) < visibleDist) {
          point.setVisible(true);
        } else {
          point.setVisible(false);
        }
      }
      ref2 = Money.getMoney();
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        point = ref2[k];
        if (Math.abs(plat - point.position.lat()) < visibleDist && Math.abs(plon - point.position.lng()) < visibleDist) {
          point.setVisible(true);
        } else {
          point.setVisible(false);
        }
      }
      ref3 = Pizzas.getPizzas();
      results = [];
      for (l = 0, len3 = ref3.length; l < len3; l++) {
        point = ref3[l];
        if (Math.abs(plat - point.position.lat()) < visibleDist && Math.abs(plon - point.position.lng()) < visibleDist) {
          results.push(point.setVisible(true));
        } else {
          results.push(point.setVisible(false));
        }
      }
      return results;
    }
  };
  panorama.addListener('visible_changed', function() {
    var i, j, k, l, len, len1, len2, len3, point, ref, ref1, ref2, ref3;
    streetView = panorama.getVisible();
    checkManhint();
    if (testing) {
      streetView = true;
    }
    ref = Points.getCheckpoints();
    for (i = 0, len = ref.length; i < len; i++) {
      point = ref[i];
      point.setVisible(streetView);
    }
    ref1 = Crackers.getCrackers();
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      point = ref1[j];
      point.setVisible(streetView);
    }
    ref2 = Money.getMoney();
    for (k = 0, len2 = ref2.length; k < len2; k++) {
      point = ref2[k];
      point.setVisible(streetView);
    }
    ref3 = Pizzas.getPizzas();
    for (l = 0, len3 = ref3.length; l < len3; l++) {
      point = ref3[l];
      point.setVisible(streetView);
    }
    if (streetView) {
      return checkPointsVisibility();
    }
  });
  panorama.addListener('position_changed', function() {
    if (panorama.getVisible()) {
      checkPointsVisibility();
    }
    return Money.moveHandler();
  });
  return checkManhint = function() {
    if (panorama.getVisible()) {
      return $('.quest__manhint').addClass('quest__manhint--invis');
    } else {
      return $('.quest__manhint').removeClass('quest__manhint--invis');
    }
  };
};

module.exports.getMap = function() {
  return gmap;
};

module.exports.getPanorama = function() {
  return panorama;
};


},{"../request":52,"./crackers.coffee":5,"./money.coffee":8,"./points.coffee":9,"./route.coffee":10,"./tucpizza.coffee":12}],8:[function(require,module,exports){
var Map, captureMoney, getIcon, keys, money, moneyClickHandler, moneyDist, popups, request, setStatus;

Map = require('./map.coffee');

request = require('../request');

popups = require('../popups');

keys = require('../tools/keys.coffee');

money = [];

moneyDist = 0.0015;

module.exports.addMoney = function(points) {
  var j, lat, len, lon, newPoint, point, results;
  console.log(points);
  results = [];
  for (j = 0, len = points.length; j < len; j++) {
    point = points[j];
    if (!(point != null)) {
      continue;
    }
    lat = parseFloat(point.lat);
    lon = parseFloat(point.lon);
    newPoint = new google.maps.Marker({
      position: {
        lat: lat,
        lng: lon
      },
      map: Map.getMap(),
      icon: getIcon(point.info.status),
      title: 'Деньги на телефон',
      visible: false,
      origLat: point.lat,
      origLng: point.lon,
      info: point.info
    });
    newPoint.addListener('click', moneyClickHandler);
    results.push(money.push(newPoint));
  }
  return results;
};

getIcon = function(status) {
  if (+status === 0) {
    return "./img/images/money.png";
  }
  if (+status === 1) {
    return "./img/images/money-used.png";
  }
  if (+status === 2) {
    return "./img/images/money-used.png";
  }
};

setStatus = function(point, status) {
  point.info.status = 1;
  point.setIcon(getIcon(1));
  return point;
};

module.exports.moveHandler = function() {
  var i, j, len, plat, plon, point, results, vis;
  if (money.length > 0) {
    if (+money[0].info.status === 1 || +money[0].info.status === 2) {
      return;
    }
  }
  plat = Map.getPanorama().getPosition().lat();
  plon = Map.getPanorama().getPosition().lng();
  vis = false;
  results = [];
  for (i = j = 0, len = money.length; j < len; i = ++j) {
    point = money[i];
    results.push((function(i) {
      console.log(point.position.lat());
      if (Math.abs(plat - point.position.lat()) < moneyDist && Math.abs(plon - point.position.lng()) < moneyDist) {
        console.log("near money");
        return request.game.checkMoney({}, function(res) {
          console.log(res);
          if (res.result === false) {
            return point = setStatus(point, 1);
          }
        });
      }
    })(i));
  }
  return results;
};

moneyClickHandler = function(e) {
  var index, info, lat, lon;
  console.log(this);
  if (+this.info.status === 1 || +this.info.status === 2) {
    return;
  }
  index = money.indexOf(this);
  console.log(index);
  lat = this.origLat;
  lon = this.origLng;
  info = this.info;
  return request.game.getPoint({
    lat: lat,
    lon: lon
  }, function(res) {
    console.log(res);
    if (res.result === "success") {
      captureMoney(index, res);
      popups.openModal('money', {
        res: "ok"
      });
    }
    if (res.result === "error") {
      money[index] = setStatus(money[index], 1);
      return popups.openModal('money', {
        res: "fail"
      });
    }
  });
};

captureMoney = function(index, res) {
  keys.setHash(res.hash);
  return money[index] = setStatus(money[index], 1);
};

module.exports.getMoney = function() {
  return money;
};


},{"../popups":22,"../request":52,"../tools/keys.coffee":56,"./map.coffee":7}],9:[function(require,module,exports){
var Map, capturePoint, checkpoints, curHint, currentPoint, keys, pointClickHandler, popups, request, route, setPointIcon;

Map = require('./map.coffee');

request = require('../request');

route = require('./route.coffee');

popups = require('../popups');

keys = require('../tools/keys.coffee');

checkpoints = [];

currentPoint = 0;

curHint = {
  type: "",
  info: {}
};

pointClickHandler = function(e) {
  var index, info, lat, lon;
  index = checkpoints.indexOf(this);
  console.log(index);
  lat = this.origLat;
  lon = this.origLng;
  info = this.info;
  return request.game.getPoint({
    lat: lat,
    lon: lon
  }, function(res) {
    var achv_id, j, len, ref;
    console.log(res);
    if (res.achievements && res.achievements.length > 0) {
      ref = res.achievements;
      for (j = 0, len = ref.length; j < len; j++) {
        achv_id = ref[j];
        popups.openModal('achieve', {
          id: achv_id
        });
      }
    }
    if (res.result === "success") {
      return capturePoint(index, info, res);
    }
  });
};

capturePoint = function(index, info, res) {
  route.renderRoute({
    current: index + 2,
    allNum: checkpoints.length
  });
  keys.setHash(res.hash);
  curHint = {
    type: "checkpoint",
    info: info
  };
  popups.openModal("checkpoint", info);
  checkpoints[index].info.status = 0;
  if (index + 1 < checkpoints.length) {
    checkpoints[index + 1].info.status = 1;
  }
  setPointIcon(checkpoints[index]);
  if (index + 1 < checkpoints.length) {
    return setPointIcon(checkpoints[index + 1]);
  }
};

setPointIcon = function(point) {
  if (point.info.status === 0) {
    point.setIcon('/img/images/checkpoint-past.png');
  }
  if (point.info.status === 1) {
    point.setIcon(point.img_current);
  }
  if (point.info.status === 2) {
    return point.setIcon(point.img_future);
  }
};

module.exports.addCheckpoints = function(points) {
  var j, lat, len, lon, newPoint, point, results;
  console.log(points);
  results = [];
  for (j = 0, len = points.length; j < len; j++) {
    point = points[j];
    if (!(point != null)) {
      continue;
    }
    lat = parseFloat(point.lat);
    lon = parseFloat(point.lon);
    newPoint = new google.maps.Marker({
      position: {
        lat: lat,
        lng: lon
      },
      map: Map.getMap(),
      title: 'Чекпоинт',
      visible: false,
      origLat: point.lat,
      origLng: point.lon,
      img_current: point.img_current,
      img_past: point.img_past,
      img_future: point.img_future,
      info: point.info
    });
    setPointIcon(newPoint);
    newPoint.addListener('click', pointClickHandler);
    results.push(checkpoints.push(newPoint));
  }
  return results;
};

module.exports.showFirstPopup = function(obj) {
  var info;
  info = {};
  info.title = obj.quest.name;
  info.description = obj.quest.description;
  info.image_hint = obj.quest.hint.image;
  info.hint = obj.quest.hint.description;
  curHint = {
    type: "gameenter",
    info: info
  };
  return popups.openModal("gameenter", info);
};

module.exports.findCurrentPoint = function(arr) {
  var i, j, len, p;
  for (i = j = 0, len = arr.length; j < len; i = ++j) {
    p = arr[i];
    if (p.info.status === 1) {
      currentPoint = i;
      route.renderRoute({
        current: currentPoint + 1,
        allNum: checkpoints.length
      });
      return;
    }
  }
  return route.renderRoute({
    current: checkpoints.length + 1,
    allNum: checkpoints.length
  });
};

module.exports.getCheckpoints = function() {
  return checkpoints;
};

module.exports.showPrevPopup = function() {
  return popups.openModal(curHint.type, curHint.info);
};


},{"../popups":22,"../request":52,"../tools/keys.coffee":56,"./map.coffee":7,"./route.coffee":10}],10:[function(require,module,exports){
var template;

template = require("./route.jade");

module.exports.renderRoute = function(opts) {
  opts = opts || {};
  if (opts.allNum < 1) {
    opts.allNum = 1;
  }
  if (opts.current < 1) {
    opts.current = 1;
  }
  return $('.quest__route__forloading').html(template({
    opts: opts
  }));
};


},{"./route.jade":11}],11:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (opts) {
buf.push("<div class=\"quest__route route\"><div class=\"route__list\">");
var n = 1
while (n < opts.current)
{
buf.push("<div class=\"route__item\"></div>");
n++
}
if ( n <= opts.allNum)
{
buf.push("<div class=\"route__item route__item--active\"></div>");
}
while (n < opts.allNum)
{
buf.push("<div class=\"route__item route__item--inactive\"></div>");
n++
}
buf.push("</div>");
if ( opts.current>opts.allNum)
{
buf.push("<div class=\"route__text\">Все точки пройдены</div>");
}
else
{
buf.push("<div class=\"route__text\">Твой маршрут</div>");
}
buf.push("</div>");}.call(this,"opts" in locals_for_with?locals_for_with.opts:typeof opts!=="undefined"?opts:undefined));;return buf.join("");
};
},{"jade/runtime":2}],12:[function(require,module,exports){
var Map, capturePizza, curHint, currentPoint, keys, pizzaClickHandler, pizzas, popups, request, route, setPointIcon;

Map = require('./map.coffee');

request = require('../request');

route = require('./route.coffee');

popups = require('../popups');

keys = require('../tools/keys.coffee');

pizzas = [];

currentPoint = 0;

curHint = {
  type: "",
  info: {}
};

pizzaClickHandler = function(e) {
  var index, info, lat, lon;
  index = pizzas.indexOf(this);
  if (parseInt(this.info.status) === 2) {
    return;
  }
  lat = this.origLat;
  lon = this.origLng;
  info = this.info;
  return request.game.getPoint({
    lat: lat,
    lon: lon
  }, function(res) {
    var achv_id, i, len, ref;
    console.log(res);
    if (res.achievements && res.achievements.length > 0) {
      ref = res.achievements;
      for (i = 0, len = ref.length; i < len; i++) {
        achv_id = ref[i];
        popups.openModal('achieve', {
          id: achv_id
        });
      }
    }
    if (res.result === "success") {
      return capturePizza(index, info, res);
    }
  });
};

capturePizza = function(index, info, res) {
  keys.setHash(res.hash);
  curHint = {
    type: "checkpoint",
    info: info
  };
  pizzas[index].info.status = 2;
  setPointIcon(pizzas[index]);
  return popups.openModal('pizza');
};

setPointIcon = function(point) {
  console.log(point);
  if (point.info.status === 2) {
    point.setIcon(point.img_past);
  }
  if (point.info.status === 0) {
    return point.setIcon(point.img_current);
  }
};

module.exports.addPizzas = function(points) {
  var i, lat, len, lon, newPoint, point, results;
  console.log(points);
  results = [];
  for (i = 0, len = points.length; i < len; i++) {
    point = points[i];
    if (!(point != null)) {
      continue;
    }
    lat = parseFloat(point.lat);
    lon = parseFloat(point.lon);
    newPoint = new google.maps.Marker({
      position: {
        lat: lat,
        lng: lon
      },
      map: Map.getMap(),
      title: 'Пицца',
      visible: false,
      origLat: point.lat,
      origLng: point.lon,
      img_current: "./img/images/tucpizza.png",
      img_past: "./img/images/tucpizza-used.png",
      info: point.info
    });
    setPointIcon(newPoint);
    newPoint.addListener('click', pizzaClickHandler);
    results.push(pizzas.push(newPoint));
  }
  return results;
};

module.exports.getPizzas = function() {
  return pizzas;
};


},{"../popups":22,"../request":52,"../tools/keys.coffee":56,"./map.coffee":7,"./route.coffee":10}],13:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (user) {
buf.push("<div class=\"header__profile_left\"><img" + (jade.attr("src", "" + (user.info.photo) + "", true, false)) + " class=\"header__profile_photo\"/></div><div class=\"header__profile__right\"><div class=\"header__profile__name\">" + (jade.escape((jade_interp = user.nickname) == null ? '' : jade_interp)) + "</div><div class=\"header__profile__scores\">" + (jade.escape((jade_interp = +user.info.current_score) == null ? '' : jade_interp)) + " / " + (jade.escape((jade_interp = +user.info.common_score) == null ? '' : jade_interp)) + "</div></div><!--i.icon-header-sharebut.header__sharebut-->");}.call(this,"user" in locals_for_with?locals_for_with.user:typeof user!=="undefined"?user:undefined));;return buf.join("");
};
},{"jade/runtime":2}],14:[function(require,module,exports){
var anal, links, mes_icon, popups, request, template;

request = require('../request');

template = require('./header__profile.jade');

mes_icon = require('./messenger__icon.jade');

links = require('../tools/links.coffee').init();

popups = require('../popups');

anal = require('../tools/anal.coffee');

$('body').on('click', '.js-openUserInfo', function() {
  popups.openModal("userinfo");
  return anal.send('ЛК_Личныеданные');
});

$('body').on('click', '.js-openMail', function() {
  popups.openModal("messenger");
  return anal.send("ЛК_Сообщение");
});

$('.js-openQuestsPage').on('click', function() {
  return anal.send("Меню_Квесты");
});

$('.js-openPrizesPage').on('click', function() {
  return anal.send("Меню_Призы");
});

$('.js-openRulesPage').on('click', function() {
  return anal.send("Меню_Правила");
});

$('.js-openWhatPage').on('click', function() {
  return anal.send("Меню_ЧтоЗаTUC?");
});

request.user.get({}, function(res) {
  console.log(res);
  $(".header__profile").html(template({
    user: res[0]
  }));
  return request.feedback.get({}, function(res) {
    var unreads;
    console.log(res);
    unreads = res.reduce((function(_this) {
      return function(sum, mes) {
        if (mes.read === 0) {
          return sum + 1;
        } else {
          return sum;
        }
      };
    })(this), 0);
    return $('.messenger__icon-forloading').html(mes_icon({
      unreads: unreads
    }));
  });
});


},{"../popups":22,"../request":52,"../tools/anal.coffee":54,"../tools/links.coffee":57,"./header__profile.jade":13,"./messenger__icon.jade":15}],15:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (unreads) {
buf.push("<div class=\"messenger__icon header__maillogo js-openMail\"><i class=\"icon-header-mail\"></i>");
if ( unreads>0)
{
buf.push("<div class=\"messenger__unreads-icon\"><span class=\"messenger__unreads-val\">" + (jade.escape((jade_interp = unreads) == null ? '' : jade_interp)) + "</span></div>");
}
buf.push("</div>");}.call(this,"unreads" in locals_for_with?locals_for_with.unreads:typeof unreads!=="undefined"?unreads:undefined));;return buf.join("");
};
},{"jade/runtime":2}],16:[function(require,module,exports){
var DATA, achieve_id, achvs, container_id, request, template, vk;

template = require('./achieve.jade');

vk = require('../tools/vk.coffee');

request = require('../request');

container_id = 0;

achieve_id = 0;

achvs = require('../tools/achvData.coffee');

DATA = [
  {
    id: 0,
    icon: "img/images/achieves/i0.png",
    title: "Первый пошёл",
    text: "Поделись ачивкой с друзьями и получи 50 бонусных баллов."
  }, {
    id: 1,
    icon: "img/images/achieves/i1.png",
    title: "Упёртый",
    text: "Поделись ачивкой с друзьями и получи 50 бонусных баллов."
  }, {
    id: 2,
    icon: "img/images/achieves/i2.png",
    title: "Дай пять!",
    text: "Поделись ачивкой с друзьями и получи 50 бонусных баллов."
  }, {
    id: 3,
    icon: "img/images/achieves/i3.png",
    title: "Красавчик",
    text: "Поделись ачивкой с друзьями и получи 50 бонусных баллов."
  }, {
    id: 4,
    icon: "img/images/achieves/i4.png",
    title: "Пришёл к успеху",
    text: "Поделись ачивкой с друзьями и получи 50 бонусных баллов."
  }, {
    id: 5,
    icon: "img/images/achieves/i5.png",
    title: "Городская легенда",
    text: "Поделись ачивкой с друзьями и получи 50 бонусных баллов."
  }, {
    id: 6,
    icon: "img/images/achieves/i6.png",
    title: "Вербовщик",
    text: "Поделись ачивкой с друзьями и получи 50 бонусных баллов."
  }, {
    id: 7,
    icon: "img/images/achieves/i7.png",
    title: "Гипножаба",
    text: "Поделись ачивкой с друзьями и получи 50 бонусных баллов."
  }
];

module.exports.openModal = function(id, opts) {
  container_id = id;
  achieve_id = +opts.id;
  return $(".popup__shade[data-id=" + container_id + "]").find('.popup__forloading').html(template({
    info: DATA[achieve_id]
  }));
};

module.exports.closeModal = function(id) {
  var achv_id;
  achv_id = +$(".popup__shade[data-id=" + id + "]").find('.achieve').attr('data-id');
  return request.achievement.read({
    achievement_id: achv_id
  }, function(res) {
    return console.log(res);
  });
};

$(".popup__supercontainer").on('click', '.js-shareAchv', function() {
  var $shade, id;
  id = +$(this).closest('.achieve').attr('data-id');
  $shade = $(this).closest('.popup__shade');
  return vk.wallPost({
    message: achvs[id].message + " http://vk.com/app5197792_202786461",
    attachments: achvs[id].photo
  }, function() {
    var achv_id;
    achv_id = achvs[id].achievement_id;
    $shade.trigger('click');
    return request.event.set({
      event_id: achv_id
    }, function(res) {
      return console.log(res);
    });
  });
});


},{"../request":52,"../tools/achvData.coffee":53,"../tools/vk.coffee":59,"./achieve.jade":17}],17:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (info) {
buf.push("<div" + (jade.attr("data-id", "" + (info.id) + "", true, false)) + " class=\"achieve\"><div class=\"achieve__icon-wrapper\"><img" + (jade.attr("src", "" + (info.icon) + "", true, false)) + " class=\"achieve__icon\"/></div><div class=\"achieve__title\">" + (jade.escape((jade_interp = info.title) == null ? '' : jade_interp)) + "</div><div class=\"achieve__text\">" + (jade.escape((jade_interp = info.text) == null ? '' : jade_interp)) + "</div><div class=\"achieve__but-wrapper\"><div class=\"achieve__but but js-shareAchv\">Поделиться</div></div></div>");}.call(this,"info" in locals_for_with?locals_for_with.info:typeof info!=="undefined"?info:undefined));;return buf.join("");
};
},{"jade/runtime":2}],18:[function(require,module,exports){
var checkpointTemplate, container_id, request;

checkpointTemplate = require('./checkpoint.jade');

request = require('../request');

container_id = 0;

module.exports.openModal = function(id, obj) {
  container_id = id;
  console.log(obj);
  $(".popup__shade[data-id=" + container_id + "]").find('.popup').addClass('popup--checkpoint');
  return $(".popup__shade[data-id=" + container_id + "]").find('.popup__forloading').html(checkpointTemplate({
    info: obj
  }));
};

module.exports.closeModal = function() {
  return $(".popup__shade[data-id=" + container_id + "]").find('.popup').removeClass('popup--checkpoint');
};


},{"../request":52,"./checkpoint.jade":19}],19:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (info) {
buf.push("<div class=\"chpopup\"><div" + (jade.attr("style", "background-image: url('" + (info.image_hint) + "')", true, false)) + " class=\"chpopup__header\"><div class=\"chpopup__ura\"><span class=\"chpopup__whiteback\">Ура! Ты открыл</span></div><div class=\"chpopup__title\"><span class=\"chpopup__whiteback\">" + (jade.escape((jade_interp = info.title) == null ? '' : jade_interp)) + "</span></div><div class=\"chpopup__desc\"><span class=\"chpopup__whiteback\">" + (jade.escape((jade_interp = info.description) == null ? '' : jade_interp)) + "</span></div></div><div class=\"chpopup__main\"><div class=\"chpopup__next\">Следующий пункт</div><div class=\"chpopup__hint\">" + (jade.escape((jade_interp = info.hint) == null ? '' : jade_interp)) + "</div><div class=\"chpopup__but but but--low js-closePopup\">Искать</div></div></div>");}.call(this,"info" in locals_for_with?locals_for_with.info:typeof info!=="undefined"?info:undefined));;return buf.join("");
};
},{"jade/runtime":2}],20:[function(require,module,exports){
var container_id, gameenterTemplate, request;

gameenterTemplate = require('./gameenter.jade');

request = require('../request');

container_id = 0;

module.exports.openModal = function(id, obj) {
  container_id = id;
  $(".popup__shade[data-id=" + container_id + "]").find('.popup').addClass('popup--checkpoint');
  return $(".popup__shade[data-id=" + container_id + "]").find('.popup__forloading').html(gameenterTemplate({
    info: obj
  }));
};

module.exports.closeModal = function() {
  return $(".popup__shade[data-id=" + container_id + "]").find('.popup').removeClass('popup--checkpoint');
};


},{"../request":52,"./gameenter.jade":21}],21:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (info) {
buf.push("<div class=\"chpopup\"><div" + (jade.attr("style", "background-image: url('" + (info.image_hint) + "')", true, false)) + " class=\"chpopup__header\"><div class=\"chpopup__title\"><span class=\"chpopup__whiteback\">" + (jade.escape((jade_interp = info.title) == null ? '' : jade_interp)) + "</span></div><div class=\"chpopup__desc\"><span class=\"chpopup__whiteback\">" + (jade.escape((jade_interp = info.description) == null ? '' : jade_interp)) + "</span></div></div><div class=\"chpopup__main\"><div class=\"chpopup__next\">Следующий пункт</div><div class=\"chpopup__hint\">" + (jade.escape((jade_interp = info.hint) == null ? '' : jade_interp)) + "</div><div class=\"chpopup__but but but--low js-closePopup\">Искать</div></div></div>");}.call(this,"info" in locals_for_with?locals_for_with.info:typeof info!=="undefined"?info:undefined));;return buf.join("");
};
},{"jade/runtime":2}],22:[function(require,module,exports){
var achieve, addCloseListener, checkpoint, curID, gameenter, intro, invite, mainTemplate, messenger, money, myprizes, newtaste, pages, pizza, rating, userinfo;

intro = require('./intro.coffee');

invite = require('./invite.coffee');

rating = require('./rating.coffee');

userinfo = require('./userinfo.coffee');

checkpoint = require('./checkpoint.coffee');

gameenter = require('./gameenter.coffee');

money = require('./money.coffee');

messenger = require('./messenger/messenger.coffee');

achieve = require('./achieve.coffee');

myprizes = require('./myprizes.coffee');

pizza = require('./pizza.coffee');

newtaste = require('./newtaste.coffee');

mainTemplate = require('./index.jade');

curID = 0;

pages = [];

module.exports.openModal = function(types, obj, callback) {
  if (obj == null) {
    obj = {};
  }
  $('body').addClass('body--modal');
  $('.popup__supercontainer').append(mainTemplate({
    curID: curID
  }));
  if (types === "intro") {
    intro.openModal(curID);
  }
  if (types === "rating") {
    rating.openModal(curID);
  }
  if (types === "invite") {
    invite.openModal(curID);
  }
  if (types === "userinfo") {
    userinfo.openModal(curID, obj, callback);
  }
  if (types === "achieve") {
    achieve.openModal(curID, obj);
  }
  if (types === "checkpoint") {
    checkpoint.openModal(curID, obj);
  }
  if (types === "gameenter") {
    gameenter.openModal(curID, obj);
  }
  if (types === "money") {
    money.openModal(curID, obj);
  }
  if (types === "myprizes") {
    myprizes.openModal(curID, obj);
  }
  if (types === "pizza") {
    pizza.openModal(curID);
  }
  if (types === "messenger") {
    messenger.openModal(obj);
  }
  if (types === "newtaste") {
    newtaste.openModal(curID);
  }
  pages[curID] = types;
  return curID++;
};

addCloseListener = function() {
  var closeModal;
  closeModal = function(id) {
    var page;
    $('body').removeClass('body--modal');
    page = pages[id];
    if (page === "intro") {
      intro.closeModal();
    }
    if (page === "rating") {
      rating.closeModal();
    }
    if (page === "invite") {
      invite.closeModal();
    }
    if (page === "userinfo") {
      userinfo.closeModal();
    }
    if (page === "checkpoint") {
      checkpoint.closeModal();
    }
    if (page === "gameenter") {
      gameenter.closeModal();
    }
    if (page === "money") {
      money.closeModal();
    }
    if (page === "messenger") {
      messenger.closeModal();
    }
    if (page === "myprizes") {
      myprizes.closeModal();
    }
    if (page === "pizza") {
      pizza.closeModal();
    }
    if (page === "achieve") {
      achieve.closeModal(id);
    }
    return $('.popup__supercontainer .popup__shade[data-id="' + id + '"]').remove();
  };
  module.exports.closeModal = closeModal;
  $('.popup__supercontainer').on('click', '.popup__shade', function(e) {
    var id;
    id = $(this).attr('data-id');
    if ($(e.target).hasClass('popup__shade')) {
      return closeModal(id);
    }
  });
  $('.popup__supercontainer').on('click', '.popup__cross', function() {
    var id;
    id = $(this).closest('.popup__shade').attr('data-id');
    return closeModal(id);
  });
  return $('.popup__supercontainer').on('click', '.js-closePopup', function() {
    var id;
    id = $(this).closest('.popup__shade').attr('data-id');
    return closeModal(id);
  });
};

addCloseListener();


},{"./achieve.coffee":16,"./checkpoint.coffee":18,"./gameenter.coffee":20,"./index.jade":23,"./intro.coffee":24,"./invite.coffee":26,"./messenger/messenger.coffee":28,"./money.coffee":32,"./myprizes.coffee":35,"./newtaste.coffee":37,"./pizza.coffee":39,"./rating.coffee":43,"./userinfo.coffee":45}],23:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (curID) {
buf.push("<div" + (jade.attr("data-id", "" + (curID) + "", true, false)) + (jade.attr("style", "z-index:" + (curID+10) + "", true, false)) + " class=\"popup__shade\"><div class=\"popup\"><i class=\"icon-popup-cross popup__cross\"></i><div class=\"popup__forloading\"></div></div></div>");}.call(this,"curID" in locals_for_with?locals_for_with.curID:typeof curID!=="undefined"?curID:undefined));;return buf.join("");
};
},{"jade/runtime":2}],24:[function(require,module,exports){
var container_id, introTemplate, videoSrc;

introTemplate = require('./intro.jade');

videoSrc = "";

container_id = 0;

module.exports.openModal = function(id) {
  container_id = id;
  $(".popup__shade[data-id=" + container_id + "]").find('.popup__forloading').html(introTemplate());
  videoSrc = $('.intro__video').attr('src');
  return $('.intro__video').attr('src', videoSrc);
};

module.exports.closeModal = function() {
  return $('.intro__video').attr('src', "");
};


},{"./intro.jade":25}],25:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"popup__wrap--intro\"><iframe class=\"intro__video\" width=\"588\" height=\"360\" src=\"https://www.youtube.com/embed/uw08j-yOfcE\" frameborder=\"0\"></iframe><div class=\"intro__skipvideo\">Пропустить</div></div>");;return buf.join("");
};
},{"jade/runtime":2}],26:[function(require,module,exports){
var container_id, filterList, inputChangeHandler, inviteTemplate;

inviteTemplate = require('./invite.jade');

container_id = 0;

module.exports.openModal = function(id) {
  container_id = id;
  $(".popup__shade[data-id=" + container_id + "]").find('.popup__forloading').html(inviteTemplate());
  $(".invite__list").customScroll();
  return $('.invite__input').on('input', inputChangeHandler);
};

module.exports.closeModal = function() {
  $('.intro__video').attr('src', "");
  return $('.invite__input').off('input', inputChangeHandler);
};

inputChangeHandler = function(e) {
  var val;
  val = e.target.value;
  return filterList(val);
};

filterList = function(val) {
  val = val.toLowerCase();
  return $('.invite__el').each(function(i, el) {
    var name;
    name = $(el).find('.leaders__name').text().toLowerCase();
    if (name.indexOf(val) !== -1) {
      return $(el).removeClass('invite__el--invis');
    } else {
      return $(el).addClass('invite__el--invis');
    }
  });
};


},{"./invite.jade":27}],27:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"popup__wrap--invite\"><h3 class=\"invite__title\">Выбери друзей,<br>которых хочешь пригласить</h3><div class=\"invite__inputwrapper\"><input type=\"text\" placeholder=\"Введи имя\" class=\"invite__input\"/></div><div class=\"invite__list\"><div class=\"leaders__el invite__el invite__el--invited\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Вячеслав<br>Вячеславович</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Вячеслав<br>Вячеславович</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Вячеслав<br>Вячеславович</div></div></div><div class=\"leaders__el invite__el invite__el--invited\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el invite__el--invited\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el invite__el--invited\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Николай<br>Николаевич</div></div></div><div class=\"leaders__el invite__el invite__el--invited\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el invite__el--invited\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div></div></div>");;return buf.join("");
};
},{"jade/runtime":2}],28:[function(require,module,exports){
var data, handleRes, mesClickListener, mes_icon, notificationTemplate, openMessage, questionTemplate, request, template;

template = require('./messenger.jade');

request = require('../../request/index');

mes_icon = require('../../header/messenger__icon.jade');

notificationTemplate = require('./notification.jade');

questionTemplate = require('./question.jade');

data = [];

module.exports.openModal = function(obj) {
  $('.popup').addClass('popup--messenger');
  return request.feedback.get({}, function(res) {
    console.log(res);
    data = handleRes(res);
    $('.popup__forloading').html(template({
      messages: data
    }));
    if (res.length > 0) {
      openMessage(0);
    }
    $('.messenger__vis').customScroll({
      prefix: "custom-bigscroll_"
    });
    return $('.messenger__el').on('click', mesClickListener);
  });
};

module.exports.closeModal = function() {
  return $('.popup').removeClass('popup--messenger');
};

mesClickListener = function() {
  $('.messenger__el').removeClass('messenger__el--active');
  $(this).addClass('messenger__el--active');
  return openMessage(+$(this).attr('data-id'));
};

handleRes = function(arr) {
  var d, i, len, mes;
  for (i = 0, len = arr.length; i < len; i++) {
    mes = arr[i];
    mes.notice = !mes.question;
    d = moment(mes.answered_at * 1000);
    mes.date = d.format('DD.MM.YYYY');
  }
  return arr.reverse();
};

openMessage = function(index) {
  var message;
  message = data[index];
  if (message.notice) {
    $('.messenger__mes-text').html(notificationTemplate({
      info: message
    }));
  } else {
    $('.messenger__mes-text').html(questionTemplate({
      info: message
    }));
  }
  $('.messenger__mes-container').customScroll({
    prefix: "custom-bigscroll_"
  });
  if (data[index].read === 0) {
    return request.feedback.read({
      id: data[index].id
    }, function(res) {
      if (res.result = "success") {
        return $('.messenger__icon-forloading').html(mes_icon({
          unreads: parseInt($('.messenger__unreads-val').html()) - 1
        }));
      }
    });
  }
};


},{"../../header/messenger__icon.jade":15,"../../request/index":52,"./messenger.jade":29,"./notification.jade":30,"./question.jade":31}],29:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (messages, undefined) {
buf.push("<div class=\"messenger\"><h2 class=\"messenger__title\">Мои сообщения</h2><div class=\"messenger__left\"><h3 class=\"messenger__subtitle\">Список сообщений</h3><div class=\"messenger__vis\"><div class=\"messenger__list\">");
// iterate messages
;(function(){
  var $$obj = messages;
  if ('number' == typeof $$obj.length) {

    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
      var mes = $$obj[index];

buf.push("<div" + (jade.attr("data-id", "" + (index) + "", true, false)) + (jade.cls(['messenger__el',index==0 ? "messenger__el--active" : ""], [null,true])) + "><div class=\"messenger__el-header\">");
if ( mes.notice)
{
buf.push("<div class=\"messenger__el-type\">Уведомление</div>");
}
else
{
buf.push("<div class=\"messenger__el-type\">Ответ на вопрос</div>");
}
buf.push("<div class=\"messenger__el-date\">" + (jade.escape((jade_interp = mes.date) == null ? '' : jade_interp)) + "</div></div><div class=\"messenger__el-title\">" + (jade.escape((jade_interp = mes.title) == null ? '' : jade_interp)) + "</div></div>");
    }

  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;      var mes = $$obj[index];

buf.push("<div" + (jade.attr("data-id", "" + (index) + "", true, false)) + (jade.cls(['messenger__el',index==0 ? "messenger__el--active" : ""], [null,true])) + "><div class=\"messenger__el-header\">");
if ( mes.notice)
{
buf.push("<div class=\"messenger__el-type\">Уведомление</div>");
}
else
{
buf.push("<div class=\"messenger__el-type\">Ответ на вопрос</div>");
}
buf.push("<div class=\"messenger__el-date\">" + (jade.escape((jade_interp = mes.date) == null ? '' : jade_interp)) + "</div></div><div class=\"messenger__el-title\">" + (jade.escape((jade_interp = mes.title) == null ? '' : jade_interp)) + "</div></div>");
    }

  }
}).call(this);

buf.push("</div></div></div><div class=\"messenger__right\"><h3 class=\"messenger__subtitle\">Сообщение</h3><div class=\"messenger__mes-plank\"></div><div class=\"messenger__mes-container\"><div class=\"messenger__mes-text\"></div></div></div></div>");}.call(this,"messages" in locals_for_with?locals_for_with.messages:typeof messages!=="undefined"?messages:undefined,"undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined));;return buf.join("");
};
},{"jade/runtime":2}],30:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (info) {
buf.push("<div class=\"messenger__mes-val\">" + (jade.escape((jade_interp = info.answer) == null ? '' : jade_interp)) + "</div>");}.call(this,"info" in locals_for_with?locals_for_with.info:typeof info!=="undefined"?info:undefined));;return buf.join("");
};
},{"jade/runtime":2}],31:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (info) {
buf.push("<div class=\"messenger__mes-title\">Вопрос:</div><div class=\"messenger__mes-val\">" + (jade.escape((jade_interp = info.question) == null ? '' : jade_interp)) + "</div><div class=\"messenger__mes-title\">Ответ:</div><div class=\"messenger__mes-val\">" + (jade.escape((jade_interp = info.answer) == null ? '' : jade_interp)) + "</div>");}.call(this,"info" in locals_for_with?locals_for_with.info:typeof info!=="undefined"?info:undefined));;return buf.join("");
};
},{"jade/runtime":2}],32:[function(require,module,exports){
var container_id, failTemplate, okTemplate, request;

okTemplate = require('./money_ok.jade');

failTemplate = require('./money_fail.jade');

request = require('../request');

container_id = 0;

module.exports.openModal = function(id, obj) {
  container_id = id;
  console.log(obj);
  $(".popup__shade[data-id=" + container_id + "]").find('.popup').addClass('popup--mes');
  if (obj.res === "ok") {
    $(".popup__shade[data-id=" + container_id + "]").find('.popup__forloading').html(okTemplate({}));
  }
  if (obj.res === "fail") {
    return $(".popup__shade[data-id=" + container_id + "]").find('.popup__forloading').html(failTemplate({}));
  }
};

module.exports.closeModal = function() {
  return $(".popup__shade[data-id=" + container_id + "]").find('.popup').removeClass('popup--mes');
};


},{"../request":52,"./money_fail.jade":33,"./money_ok.jade":34}],33:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"popup__wrap--intro\"><div class=\"chpopup__moneymes\"><p>Ты был очень близок к этому призу, но кто-то оказался на долю секунды быстрее (</p><p>Не отчаивайся! Завтра мы разыграем еще 500 рублей, потом еще и еще – и так каждый день без выходных. Тебе наверняка повезет! Спасибо, играй с нами еще!</p></div></div>");;return buf.join("");
};
},{"jade/runtime":2}],34:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"popup__wrap--intro\"><div class=\"chpopup__moneymes\"><p>Поздравляем, ты первым нашел сегодняшние призовые деньги на телефон! Красавчик!</p><p>Если твоя анкета заполнена – деньги скоро упадут на счет твоего мобильного. Если нет – заполни ее, не откладывая. Спасибо, играй с нами еще!</p></div></div>");;return buf.join("");
};
},{"jade/runtime":2}],35:[function(require,module,exports){
var container_id, request, template;

template = require('./myprizes.jade');

request = require('../request');

container_id = 0;

module.exports.openModal = function(id, opts) {
  container_id = id;
  $(".popup__shade[data-id=" + container_id + "]").find('.popup').addClass('popup--myprizes');
  return request.prize.get({}, function(res) {
    var el, key;
    console.log(res);
    for (key in res) {
      el = res[key];
      el.formatted_date = moment(el.date * 1000).format("DD.MM.YYYY");
    }
    $(".popup__shade[data-id=" + container_id + "]").find('.popup__forloading').html(template({
      info: res
    }));
    return $(".myprizes__list").customScroll({
      prefix: "custom-bigscroll_"
    });
  });
};

module.exports.closeModal = function(id) {
  return $(".popup__shade[data-id=" + container_id + "]").find('.popup').removeClass('popup--myprizes');
};


},{"../request":52,"./myprizes.jade":36}],36:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (info) {
buf.push("<div class=\"myprizes\"><h3 class=\"myprizes__title\">Полученные призы</h3>");
if ( !info[0] && !info[1] && !info[2])
{
buf.push("<div class=\"myprizes__nolist\"><div class=\"myprizes__no-subtitle\">У тебя пока<br>нет призов :(</div><div class=\"myprizes__no-text\">Проходи квесты, собирай как можно<br>\nбольше крекеров TUC – и делись<br>\nсвоими достижениями с друзьями!<br>\nТак ты повысишь свои шансы на приз.</div></div>");
}
else
{
buf.push("<div class=\"myprizes__list\">");
if ( info[0])
{
buf.push("<div class=\"myprizes__date\">" + (jade.escape((jade_interp = info[0].formatted_date) == null ? '' : jade_interp)) + "</div><div class=\"myprizes__icon-wrapper\"><i class=\"icon-myprizes-money myprizes__moneyprize\"></i></div>");
}
buf.push("<div class=\"myprizes__subtitle\">За квесты</div>");
if ( !info[1] && !info[2])
{
buf.push("<div>Здесь пока ничего нет =(</div>");
}
if ( info[1])
{
buf.push("<div class=\"myprizes__date\">" + (jade.escape((jade_interp = info[1].formatted_date) == null ? '' : jade_interp)) + "</div><div class=\"myprizes__questname\">" + (jade.escape((jade_interp = info[1].title) == null ? '' : jade_interp)) + "</div><div class=\"myprizes__icon-wrapper\"><i class=\"icon-prizes1 myprizes__superprize\"></i></div><div class=\"myprizes__prizename\">Самокат Oxelo Town</div>");
}
if ( info[2])
{
buf.push("<div class=\"myprizes__date\">" + (jade.escape((jade_interp = info[2].formatted_date) == null ? '' : jade_interp)) + "</div><div class=\"myprizes__icon-wrapper\">");
if ( info[2].place==1)
{
buf.push("<i class=\"icon-prizes3 myprizes__superprize\"></i>");
}
if ( info[2].place==2)
{
buf.push("<i class=\"icon-prizes4 myprizes__superprize\"></i>");
}
if ( info[2].place==3)
{
buf.push("<i class=\"icon-prizes5 myprizes__superprize\"></i>");
}
buf.push("</div>");
if ( info[2].place==1)
{
buf.push("<div class=\"myprizes__prizename\">Электросамокат Razor E300</div>");
}
if ( info[2].place==2)
{
buf.push("<div class=\"myprizes__prizename\">Квадрокоптер Parrot AR.Drone 2.0</div>");
}
if ( info[2].place==3)
{
buf.push("<div class=\"myprizes__prizename\">Портативная колонка JBL Pulse</div>");
}
}
buf.push("</div>");
}
buf.push("</div>");}.call(this,"info" in locals_for_with?locals_for_with.info:typeof info!=="undefined"?info:undefined));;return buf.join("");
};
},{"jade/runtime":2}],37:[function(require,module,exports){
var newtasteTemplate, popups, request;

newtasteTemplate = require('./newtaste.jade');

request = require('../request');

popups = require('./index.coffee');

module.exports.openModal = function(id) {
  var container_id;
  container_id = id;
  $(".popup__shade[data-id=" + id + "]");
  $(".popup__shade[data-id=" + id + "]").find('.popup__forloading').html(newtasteTemplate);
  return $(".popup__shade[data-id=" + id + "]").find('.popup').addClass('popup__taste');
};


},{"../request":52,"./index.coffee":22,"./newtaste.jade":38}],38:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"taste__wrap\"><h2 class=\"taste__title\">Именно!</h2><div class=\"taste__body\"><div class=\"taste__body-text\"><p>Начисляем тебе 200 баллов.</p><p>Не забудь попробовать</p><P>Новый Tuc!</P></div><div class=\"taste__body-img\"><img src=\"img/images/tuc-200.png\"/></div></div></div>");;return buf.join("");
};
},{"jade/runtime":2}],39:[function(require,module,exports){
var container_id, pizzaTemplate, request;

pizzaTemplate = require('./pizza.jade');

request = require('../request');

container_id = 0;

module.exports.openModal = function(id, obj) {
  container_id = id;
  console.log(obj);
  $(".popup__shade[data-id=" + container_id + "]").find('.popup').addClass('popup--pizza');
  return $(".popup__shade[data-id=" + container_id + "]").find('.popup__forloading').html(pizzaTemplate({
    info: obj
  }));
};

module.exports.closeModal = function() {
  return $(".popup__shade[data-id=" + container_id + "]").find('.popup').removeClass('popup--pizza');
};


},{"../request":52,"./pizza.jade":40}],40:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"chpopup\"><div class=\"chpopup__pizza-title\">+50 баллов!</div><div class=\"chpopup__pizza-desc\">Поздравляем, ты нашел новый TUC Пицца!\nА теперь попробуй найти его по-настоящему в магазинах своего города!</div><div class=\"chpopup__pizza-desc2\">Удачи и приятного аппетита!</div></div>");;return buf.join("");
};
},{"jade/runtime":2}],41:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (host, leaders, undefined) {
// iterate leaders
;(function(){
  var $$obj = leaders;
  if ('number' == typeof $$obj.length) {

    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
      var leader = $$obj[index];

buf.push("<a" + (jade.attr("href", "" + (host+leader.link) + "", true, false)) + " target=\"_blank\"><div class=\"leaders__el\"><div class=\"leaders__counter\">" + (jade.escape((jade_interp = leader.place) == null ? '' : jade_interp)) + "</div><img" + (jade.attr("src", "" + (leader.photo) + "", true, false)) + " class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">" + (jade.escape((jade_interp = leader.nickname) == null ? '' : jade_interp)) + "</div></div></div></a>");
    }

  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;      var leader = $$obj[index];

buf.push("<a" + (jade.attr("href", "" + (host+leader.link) + "", true, false)) + " target=\"_blank\"><div class=\"leaders__el\"><div class=\"leaders__counter\">" + (jade.escape((jade_interp = leader.place) == null ? '' : jade_interp)) + "</div><img" + (jade.attr("src", "" + (leader.photo) + "", true, false)) + " class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">" + (jade.escape((jade_interp = leader.nickname) == null ? '' : jade_interp)) + "</div></div></div></a>");
    }

  }
}).call(this);
}.call(this,"host" in locals_for_with?locals_for_with.host:typeof host!=="undefined"?host:undefined,"leaders" in locals_for_with?locals_for_with.leaders:typeof leaders!=="undefined"?leaders:undefined,"undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined));;return buf.join("");
};
},{"jade/runtime":2}],42:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (active, left_active, pages, right_active, undefined) {
buf.push("<div class=\"pagination\"><span" + (jade.cls(['pagination__leftbut',left_active ? "pagination__but--active" : ""], [null,true])) + "><</span>");
// iterate pages
;(function(){
  var $$obj = pages;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var page = $$obj[$index];

if ( page=="dots")
{
buf.push("<span class=\"pagination__dots\">...</span>");
}
else
{
buf.push("<span" + (jade.attr("data-href", "" + (page.value) + "", true, false)) + (jade.cls(['pagination__page',(active==page.value) ? "pagination__page--active" : ""], [null,true])) + ">" + (jade.escape((jade_interp = page.text) == null ? '' : jade_interp)) + "</span>");
}
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var page = $$obj[$index];

if ( page=="dots")
{
buf.push("<span class=\"pagination__dots\">...</span>");
}
else
{
buf.push("<span" + (jade.attr("data-href", "" + (page.value) + "", true, false)) + (jade.cls(['pagination__page',(active==page.value) ? "pagination__page--active" : ""], [null,true])) + ">" + (jade.escape((jade_interp = page.text) == null ? '' : jade_interp)) + "</span>");
}
    }

  }
}).call(this);

buf.push("<span" + (jade.cls(['pagination__rightbut',right_active ? "pagination__but--active" : ""], [null,true])) + ">></span></div>");}.call(this,"active" in locals_for_with?locals_for_with.active:typeof active!=="undefined"?active:undefined,"left_active" in locals_for_with?locals_for_with.left_active:typeof left_active!=="undefined"?left_active:undefined,"pages" in locals_for_with?locals_for_with.pages:typeof pages!=="undefined"?pages:undefined,"right_active" in locals_for_with?locals_for_with.right_active:typeof right_active!=="undefined"?right_active:undefined,"undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined));;return buf.join("");
};
},{"jade/runtime":2}],43:[function(require,module,exports){
var PAGE_ELS, common_page, container_id, current_page, curtype, getCommonPage, getCurrentPage, handlePages, host, leadersTemplate, listTemplate, pagTemplate, request, switchListeners, switchPage;

leadersTemplate = require('./rating.jade');

listTemplate = require('./rating-list.jade');

pagTemplate = require('./rating-pagination.jade');

container_id = 0;

request = require('../request');

PAGE_ELS = 50;

host = window.location.protocol + "//vk.com/id";

common_page = 0;

current_page = 0;

curtype = "common";

module.exports.openModal = function(id) {
  container_id = id;
  return request.rating.all({
    offset: 0,
    count: PAGE_ELS
  }, function(res) {
    console.log(res);
    $(".popup__shade[data-id=" + container_id + "]").find('.popup__forloading').html(leadersTemplate({
      res: res,
      host: host
    }));
    switchListeners();
    $('.popleaders__common .popleaders__cat').html(listTemplate({
      leaders: res.common.leaders,
      host: host
    }));
    $('.popleaders__current .popleaders__cat').html(listTemplate({
      leaders: res.current.leaders,
      host: host
    }));
    handlePages("common", res.common);
    handlePages("current", res.current);
    $(".popleaders__common .popleaders__list").customScroll();
    return $(".popleaders__current .popleaders__list").customScroll();
  });
};

module.exports.closeModal = function() {};

handlePages = function(type, obj, active) {
  var i, j, k, l, left_active, len, pages, pages_num, ref, ref1, ref2, ref3, right_active;
  pages = [];
  active = parseInt(active) || 0;
  pages_num = Math.ceil(obj.count / PAGE_ELS);
  left_active = right_active = true;
  if (active === 0) {
    left_active = false;
  }
  if (active === pages_num - 1) {
    right_active = false;
  }
  if (obj.count <= PAGE_ELS) {
    pages = [
      {
        text: 1,
        value: 0
      }
    ];
    active = 0;
  } else if ((PAGE_ELS < (ref = obj.count) && ref <= PAGE_ELS * 4)) {
    pages = [
      (function() {
        var j, ref1, results;
        results = [];
        for (i = j = 0, ref1 = pages_num; 0 <= ref1 ? j < ref1 : j > ref1; i = 0 <= ref1 ? ++j : --j) {
          results.push({
            value: i,
            text: i + 1
          });
        }
        return results;
      })()
    ][0];
  } else {
    if (active <= 1) {
      for (i = j = 0; j < 3; i = ++j) {
        pages.push({
          value: i,
          text: i + 1
        });
      }
      if (pages_num > 3 + 1) {
        pages.push("dots");
      }
      pages.push({
        value: pages_num - 1,
        text: pages_num
      });
    } else if (active < pages_num - 2) {
      pages.push({
        text: 1,
        value: 0
      });
      if (active >= 3) {
        pages.push("dots");
      }
      ref1 = [active - 1, active, active + 1];
      for (k = 0, len = ref1.length; k < len; k++) {
        i = ref1[k];
        pages.push({
          value: i,
          text: i + 1
        });
      }
      if (active <= pages_num - 4) {
        pages.push("dots");
      }
      pages.push({
        value: pages_num - 1,
        text: pages_num
      });
    } else {
      pages.push({
        text: 1,
        value: 0
      });
      if (active >= 3) {
        pages.push("dots");
      }
      for (i = l = ref2 = pages_num - 3, ref3 = pages_num - 1; ref2 <= ref3 ? l <= ref3 : l >= ref3; i = ref2 <= ref3 ? ++l : --l) {
        pages.push({
          value: i,
          text: i + 1
        });
      }
    }
  }
  if (type === "common") {
    $('.popleaders__common .popleaders__pagination').html(pagTemplate({
      pages: pages,
      active: active,
      left_active: left_active,
      right_active: right_active
    }));
  }
  if (type === "current") {
    return $('.popleaders__current .popleaders__pagination').html(pagTemplate({
      pages: pages,
      active: active,
      left_active: left_active,
      right_active: right_active
    }));
  }
};

switchListeners = function() {
  $('.leaders__switchcommon').on('click', function() {
    $('.leaders__switchcommon').addClass('leaders__switchbut--active');
    $('.leaders__switchcurrent').removeClass('leaders__switchbut--active');
    $('.popleaders__common').addClass('popleader__active');
    $('.popleaders__current').removeClass('popleader__active');
    return curtype = "common";
  });
  $('.leaders__switchcurrent').on('click', function() {
    $('.leaders__switchcurrent').addClass('leaders__switchbut--active');
    $('.leaders__switchcommon').removeClass('leaders__switchbut--active');
    $('.popleaders__current').addClass('popleader__active');
    $('.popleaders__common').removeClass('popleader__active');
    return curtype = "current";
  });
  $('.popleaders__tab').on('click', '.pagination__leftbut', function() {
    if (!$(this).hasClass('pagination__but--active')) {
      return;
    }
    console.log('left');
    if (curtype === "common") {
      switchPage(curtype, getCommonPage() - 1);
    }
    if (curtype === "current") {
      return switchPage(curtype, getCurrentPage() - 1);
    }
  });
  $('.popleaders__tab').on('click', '.pagination__rightbut', function() {
    if (!$(this).hasClass('pagination__but--active')) {
      return;
    }
    if (curtype === "common") {
      switchPage(curtype, getCommonPage() + 1);
    }
    if (curtype === "current") {
      return switchPage(curtype, getCurrentPage() + 1);
    }
  });
  return $('.popleaders').on('click', '.pagination__page', function() {
    var type, val;
    if ($(this).hasClass('pagination__page--active')) {
      return;
    }
    type = $(this).closest('.popleaders__tab').attr('data-type');
    val = $(this).attr('data-href');
    return switchPage(type, val);
  });
};

getCurrentPage = function() {
  return current_page;
};

getCommonPage = function() {
  return common_page;
};

switchPage = function(type, val) {
  return request.rating[type]({
    count: PAGE_ELS,
    offset: val * PAGE_ELS
  }, function(res) {
    handlePages(type, res, val);
    if (type === "common") {
      $('.popleaders__common .popleaders__cat').html(listTemplate({
        leaders: res.leaders,
        host: host
      }));
      $('.popleaders__common .custom-scroll_inner').scrollTop(0);
      common_page = parseInt(val);
    }
    if (type === "current") {
      $('.popleaders__current .popleaders__cat').html(listTemplate({
        leaders: res.leaders,
        host: host
      }));
      $('.popleaders__current .custom-scroll_inner').scrollTop(0);
      return current_page = parseInt(val);
    }
  });
};


},{"../request":52,"./rating-list.jade":41,"./rating-pagination.jade":42,"./rating.jade":44}],44:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (res) {
buf.push("<div class=\"popup__wrap--intro\"><div class=\"popleaders\"><div class=\"popleaders__left\"><h3 class=\"popleaders__title\">Рейтинг игры</h3><div class=\"leaders__switcher_wrapper\"><div class=\"leaders__switcher\"><div data-href=\".popleaders__cat--current\" class=\"leaders__switchbut leaders__switchcurrent\">Текущий</div><div data-href=\".popleaders__cat--common\" class=\"leaders__switchbut leaders__switchbut--active leaders__switchcommon\">Общий</div></div></div></div><div class=\"popleaders__right\"><div data-type=\"common\" class=\"popleaders__common popleaders__tab popleader__active\"><div class=\"popleaders__list\"><div class=\"popleaders__cat\"></div></div><div class=\"leaders__el\"><div class=\"leaders__counter\">" + (jade.escape((jade_interp = res.common.you.place) == null ? '' : jade_interp)) + "</div><img" + (jade.attr("src", "" + (res.common.you.photo) + "", true, false)) + " class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">" + (jade.escape((jade_interp = res.common.you.nickname) == null ? '' : jade_interp)) + "</div></div></div><div class=\"popleaders__pagination\"></div></div><div data-type=\"current\" class=\"popleaders__current popleaders__tab\"><div class=\"popleaders__list\"><div class=\"popleaders__cat\"></div></div><div class=\"leaders__el\"><div class=\"leaders__counter\">" + (jade.escape((jade_interp = res.current.you.place) == null ? '' : jade_interp)) + "</div><img" + (jade.attr("src", "" + (res.current.you.photo) + "", true, false)) + " class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">" + (jade.escape((jade_interp = res.current.you.nickname) == null ? '' : jade_interp)) + "</div></div></div><div class=\"popleaders__pagination\"></div></div></div></div></div>");}.call(this,"res" in locals_for_with?locals_for_with.res:typeof res!=="undefined"?res:undefined));;return buf.join("");
};
},{"jade/runtime":2}],45:[function(require,module,exports){
var callback, checkFull, container_id, editing, formOpenHandler, getUserXHRHandler, nofull, popups, request, saveUser, userinfoTemplate;

userinfoTemplate = require('./userinfo.jade');

request = require('../request');

popups = require('./index.coffee');

editing = true;

nofull = false;

callback = null;

container_id = 0;

module.exports.openModal = function(id, obj, _callback) {
  if (obj == null) {
    obj = {};
  }
  editing = true;
  callback = _callback;
  container_id = id;
  $(".popup__shade[data-id=" + id + "]").find('.popup').addClass('popup--userinfo');
  return request.user.get({}, function(res) {
    nofull = obj.nofull;
    getUserXHRHandler(res);
    return $('.userinfo__form').on("submit", formOpenHandler);
  });
};

module.exports.closeModal = function() {
  $(".popup__shade[data-id=" + container_id + "]").find('.popup').removeClass('popup--userinfo');
  return $('.userinfo__form').off("submit", formOpenHandler);
};

getUserXHRHandler = function(res) {
  $(".popup__shade[data-id=" + container_id + "]").find('.popup__forloading').html(userinfoTemplate({
    user: res[0],
    nofull: nofull
  }));
  $('.userinfo__error-mes').addClass('userinfo__error-mes--invis');
  $('.userinfo__input[name="bdate"]').mask('09.09.0000', {
    translation: {
      '9': {
        pattern: /\d/,
        optional: true
      }
    }
  });
  return $('.userinfo__input[name="phone"]').mask('+7 000 000 0000');
};

formOpenHandler = function(e) {
  if (e != null) {
    e.preventDefault();
  }
  editing = !editing;
  if (editing) {
    $('.userinfo__input').each(function(i, el) {
      var text;
      text = $(el).parent().find(".userinfo__value").text();
      return $(el).val(text);
    });
    $('.userinfo').addClass('userinfo--editing');
    return $('.userinfo__checkbox').removeAttr("disabled");
  } else {
    $('.userinfo__value').each(function(i, el) {
      var text;
      text = $(el).parent().find(".userinfo__input").val();
      return $(el).text(text);
    });
    $('.userinfo').removeClass('userinfo--editing');
    $('.userinfo__checkbox').attr("disabled", true);
    return saveUser(this);
  }
};

saveUser = function(form) {
  var j, len, prop, sendObj, serArr;
  serArr = $(form).serializeArray();
  sendObj = {};
  for (j = 0, len = serArr.length; j < len; j++) {
    prop = serArr[j];
    sendObj[prop.name] = prop.value;
  }
  sendObj.agreement = $('#email-checkbox')[0].checked;
  return request.user.save(sendObj, function(res) {
    console.log(res);
    if (res.result === "success") {
      $('.userinfo__error-mes').addClass('userinfo__error-mes--invis');
      if (nofull) {
        checkFull();
      }
    }
    if (res.result === "error") {
      if (res.code === "666") {
        $('.userinfo__error-mes').removeClass('userinfo__error-mes--invis');
        return formOpenHandler();
      }
    }
  });
};

checkFull = function() {
  return request.user.isFull({}, function(res) {
    console.log(res);
    if (res.result === "success") {
      nofull = false;
      if (callback != null) {
        callback();
      }
      return popups.closeModal();
    }
  });
};


},{"../request":52,"./index.coffee":22,"./userinfo.jade":46}],46:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (nofull, user) {
buf.push("<div class=\"userinfo userinfo--editing\"><h3 class=\"userinfo__title\">Личные данные</h3>");
if ( nofull)
{
buf.push("<div class=\"userinfo__warning\">Вы не можете начать квест, пока не заполнили профиль!</div>");
}
buf.push("<form class=\"userinfo__form\"><div class=\"userinfo__line\"><div class=\"userinfo__label\">Фамилия:</div><input type=\"text\" name=\"last_name\"" + (jade.attr("value", "" + (user.last_name || '') + "", true, false)) + " class=\"userinfo__input\"/><div class=\"userinfo__value\">" + (jade.escape((jade_interp = user.last_name) == null ? '' : jade_interp)) + "</div></div><div class=\"userinfo__line\"><div class=\"userinfo__label\">Имя:</div><input type=\"text\" name=\"first_name\"" + (jade.attr("value", "" + (user.first_name || '') + "", true, false)) + " class=\"userinfo__input\"/><div class=\"userinfo__value\">" + (jade.escape((jade_interp = user.first_name) == null ? '' : jade_interp)) + "</div></div><div class=\"userinfo__line\"><div class=\"userinfo__label\">Телефон:</div><input type=\"phone\" name=\"phone\"" + (jade.attr("value", "" + (user.phone || '') + "", true, false)) + " class=\"userinfo__input\"/><div class=\"userinfo__value\">" + (jade.escape((jade_interp = user.phone) == null ? '' : jade_interp)) + "</div></div><div class=\"userinfo__line\"><div class=\"userinfo__label\">Дата рождения:</div><input type=\"text\" name=\"bdate\"" + (jade.attr("value", "" + (user.bdate || '') + "", true, false)) + " class=\"userinfo__input\"/><div class=\"userinfo__value\">" + (jade.escape((jade_interp = user.bdate) == null ? '' : jade_interp)) + "</div></div><div class=\"userinfo__line\"><div class=\"userinfo__label\">E-mail:</div><input type=\"text\" name=\"email\"" + (jade.attr("value", "" + (user.email || '') + "", true, false)) + " class=\"userinfo__input\"/><div class=\"userinfo__value\">" + (jade.escape((jade_interp = user.email) == null ? '' : jade_interp)) + "</div></div><div class=\"userinfo__line\"><div class=\"userinfo__label\">Никнейм:</div><input type=\"text\" name=\"nickname\"" + (jade.attr("value", "" + (user.nickname || '') + "", true, false)) + " class=\"userinfo__input\"/><div class=\"userinfo__value\">" + (jade.escape((jade_interp = user.nickname) == null ? '' : jade_interp)) + "</div><div class=\"userinfo__error-mes userinfo__error-mes--invis\">Никнейм не уникальный!</div></div><div class=\"userinfo__checkbox-line\">");
if ( user.agreement==true || user.agreement=="true")
{
buf.push("<input type=\"checkbox\" name=\"agreement\" checked=\"checked\" id=\"email-checkbox\" class=\"userinfo__checkbox\"/>");
}
else
{
buf.push("<input type=\"checkbox\" name=\"agreement\" id=\"email-checkbox\" class=\"userinfo__checkbox\"/>");
}
buf.push("<label for=\"email-checkbox\" name=\"agreement\" class=\"userinfo__checkbox-label\"><div class=\"userinfo__checkbox-text\">Согласие на рассылку от имени бренда</div></label></div><button class=\"but userinfo__but js-changeUserInfo\">Изменить</button></form></div>");}.call(this,"nofull" in locals_for_with?locals_for_with.nofull:typeof nofull!=="undefined"?nofull:undefined,"user" in locals_for_with?locals_for_with.user:typeof user!=="undefined"?user:undefined));;return buf.join("");
};
},{"jade/runtime":2}],47:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (quest) {
buf.push("<i class=\"icon-curq-baloon curquest__baloon\"></i><!--.curquest__number Квест №#{quest.id}--><div class=\"curquest__name\">" + (jade.escape((jade_interp = quest.name) == null ? '' : jade_interp)) + "</div><div class=\"curquest__date\">" + (jade.escape((jade_interp = quest.started_at) == null ? '' : jade_interp)) + " - " + (jade.escape((jade_interp = quest.finished_at) == null ? '' : jade_interp)) + "</div><a" + (jade.attr("href", "/game?quest_id=" + (quest.id) + "", true, false)) + " class=\"curquest__link js-openCurQuest\"><div class=\"curquest__playbut\">Играть</div></a>");}.call(this,"quest" in locals_for_with?locals_for_with.quest:typeof quest!=="undefined"?quest:undefined));;return buf.join("");
};
},{"jade/runtime":2}],48:[function(require,module,exports){
var anal, curQuestTemplate, linkListener, links, popups, prevQuestsTemplate, renderCurQuest, renderPrevQuests, request;

curQuestTemplate = require('./curquest.jade');

prevQuestsTemplate = require('./quests-list.jade');

request = require('../request');

links = require('../tools/links.coffee');

popups = require('../popups');

anal = require('../tools/anal.coffee');

request.quests.getList({}, function(res) {
  var curq, i, prevq;
  console.log(res);
  curq = ((function() {
    var j, len, results;
    results = [];
    for (j = 0, len = res.length; j < len; j++) {
      i = res[j];
      if (i.status === 10) {
        results.push(i);
      }
    }
    return results;
  })())[0];
  if (curq) {
    renderCurQuest(curq);
  }
  prevq = (function() {
    var j, len, results;
    results = [];
    for (j = 0, len = res.length; j < len; j++) {
      i = res[j];
      if (i.status === 1 || i.status === 5) {
        results.push(i);
      }
    }
    return results;
  })();
  renderPrevQuests(prevq);
  return linkListener();
});

renderCurQuest = function(q) {
  $('.curquest__main').html(curQuestTemplate({
    quest: q
  }));
  links.addButHash($('.curquest__link'));
  return $('.js-openCurQuest').on('click', function() {
    return anal.send('Главная_Играть');
  });
};

renderPrevQuests = function(arr) {
  $('.prevquest__forloading').html(prevQuestsTemplate({
    quests: arr
  }));
  return links.addButHash($('.prevquest__link'));
};

linkListener = function() {
  return $('.curquest__link').on('click', function(e) {
    var href;
    e.preventDefault();
    href = $(this).attr('href');
    return window.location = href;

    /*request.user.isFull {}, (res) ->
    			console.log res
    			if res.result == "success"
    				window.location = href
    			if res.result == "error"
    				popups.openModal "userinfo", {nofull: true}, ->
    					window.location = href
     */
  });
};


},{"../popups":22,"../request":52,"../tools/anal.coffee":54,"../tools/links.coffee":57,"./curquest.jade":47,"./quests-list.jade":49}],49:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (quests, undefined) {
buf.push("<div class=\"prevquest__list\">");
// iterate quests
;(function(){
  var $$obj = quests;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var quest = $$obj[$index];

if ( quest.status==1)
{
buf.push("<div class=\"prevquest__el prevquest__el--future\"><div class=\"prevquest__num\"><div class=\"prevquest__name\">" + (jade.escape((jade_interp = quest.name) == null ? '' : jade_interp)) + "</div><div class=\"prevquest__date\">" + (jade.escape((jade_interp = quest.started_at) == null ? '' : jade_interp)) + " - " + (jade.escape((jade_interp = quest.finished_at) == null ? '' : jade_interp)) + "</div><div class=\"prevquest__unable\">Квест пока недоступен</div><div class=\"prevquest__scores\"></div></div></div>");
}
if ( quest.status==5)
{
buf.push("<div" + (jade.cls(['prevquest__el',quest.score>0 ? "prevquest__el--played" : ""], [null,true])) + "><div class=\"prevquest__num\"><div class=\"prevquest__name\">" + (jade.escape((jade_interp = quest.name) == null ? '' : jade_interp)) + "</div><div class=\"prevquest__date\">" + (jade.escape((jade_interp = quest.started_at) == null ? '' : jade_interp)) + " - " + (jade.escape((jade_interp = quest.finished_at) == null ? '' : jade_interp)) + "</div><a" + (jade.attr("href", "/game?quest_id=" + (quest.id) + "", true, false)) + " class=\"prevquest__link\"><div class=\"prevquest__playbut\">Играть</div></a><div class=\"prevquest__scores\">Набрано " + (jade.escape((jade_interp = quest.score) == null ? '' : jade_interp)) + " баллов</div></div></div>");
}
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var quest = $$obj[$index];

if ( quest.status==1)
{
buf.push("<div class=\"prevquest__el prevquest__el--future\"><div class=\"prevquest__num\"><div class=\"prevquest__name\">" + (jade.escape((jade_interp = quest.name) == null ? '' : jade_interp)) + "</div><div class=\"prevquest__date\">" + (jade.escape((jade_interp = quest.started_at) == null ? '' : jade_interp)) + " - " + (jade.escape((jade_interp = quest.finished_at) == null ? '' : jade_interp)) + "</div><div class=\"prevquest__unable\">Квест пока недоступен</div><div class=\"prevquest__scores\"></div></div></div>");
}
if ( quest.status==5)
{
buf.push("<div" + (jade.cls(['prevquest__el',quest.score>0 ? "prevquest__el--played" : ""], [null,true])) + "><div class=\"prevquest__num\"><div class=\"prevquest__name\">" + (jade.escape((jade_interp = quest.name) == null ? '' : jade_interp)) + "</div><div class=\"prevquest__date\">" + (jade.escape((jade_interp = quest.started_at) == null ? '' : jade_interp)) + " - " + (jade.escape((jade_interp = quest.finished_at) == null ? '' : jade_interp)) + "</div><a" + (jade.attr("href", "/game?quest_id=" + (quest.id) + "", true, false)) + " class=\"prevquest__link\"><div class=\"prevquest__playbut\">Играть</div></a><div class=\"prevquest__scores\">Набрано " + (jade.escape((jade_interp = quest.score) == null ? '' : jade_interp)) + " баллов</div></div></div>");
}
    }

  }
}).call(this);

buf.push("</div>");}.call(this,"quests" in locals_for_with?locals_for_with.quests:typeof quests!=="undefined"?quests:undefined,"undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined));;return buf.join("");
};
},{"jade/runtime":2}],50:[function(require,module,exports){
var anal, host, openFullRatingListener, page, popups, request, sendRequest, switcherListener, template, views;

template = require('./leaders.jade');

request = require('../request');

popups = require('../popups');

anal = require('../tools/anal.coffee');

host = window.location.protocol + "//vk.com/id";

views = {
  theme: "dark"
};

page = "";

module.exports.init = function(opts) {
  opts = opts || {};
  if (opts.theme) {
    views.theme = opts.theme;
  }
  page = opts.page;
  return sendRequest();
};

sendRequest = function() {
  return request.rating.all({}, function(res) {
    console.log(res);
    $(".leaders__forloading").html(template({
      leaders: res,
      views: views,
      host: host
    }));
    $(".js-switchToCurrent").on('click', function() {
      return anal.send("��_����._�������");
    });
    return $(".js-switchToCommon").on('click', function() {
      return anal.send("��_����._�����");
    });
  });
};

(switcherListener = function() {
  $('.leaders__forloading').on('click', '.leaders__switchbut', function() {
    var data_href;
    $(this).siblings().removeClass('leaders__switchbut--active');
    $(this).addClass('leaders__switchbut--active');
    $('.leaders').removeClass('leaders--active');
    data_href = $(this).attr('data-href');
    return $(data_href).addClass('leaders--active');
  });
  return $('.popup').on('click', '.leaders__switchbut', function() {
    var data_href;
    $(this).siblings().removeClass('leaders__switchbut--active');
    $(this).addClass('leaders__switchbut--active');
    $('.popleaders__cat').removeClass('popleaders__cat--active');
    data_href = $(this).attr('data-href');
    $(data_href).addClass('popleaders__cat--active');
    return $(".popleaders__list").customScroll();
  });
})();

(openFullRatingListener = function() {
  return $('.leaders__forloading').on('click', '.js-openFullRating', function() {
    return popups.openModal("rating");
  });
})();


},{"../popups":22,"../request":52,"../tools/anal.coffee":54,"./leaders.jade":51}],51:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (host, leaders, undefined, views) {
buf.push("<div" + (jade.cls(['leaders__wrapper',views.theme === "white" ? "leaders__wrapper--white" : ""], [null,true])) + "><div class=\"leaders leaders--common leaders--active\"><h4 class=\"leaders__title\">Общий рейтинг</h4><div class=\"leaders__list\">");
// iterate leaders.common.leaders
;(function(){
  var $$obj = leaders.common.leaders;
  if ('number' == typeof $$obj.length) {

    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
      var person = $$obj[index];

buf.push("<a" + (jade.attr("href", "" + (host+person.link) + "", true, false)) + " target=\"_blank\"><div class=\"leaders__el\"><div class=\"leaders__counter\">" + (jade.escape((jade_interp = index+1) == null ? '' : jade_interp)) + "</div><img" + (jade.attr("src", "" + (person.photo) + "", true, false)) + " class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">" + (jade.escape((jade_interp = person.nickname) == null ? '' : jade_interp)) + "</div></div><div class=\"leaders__score\">" + (jade.escape((jade_interp = person.scores) == null ? '' : jade_interp)) + "</div></div></a>");
    }

  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;      var person = $$obj[index];

buf.push("<a" + (jade.attr("href", "" + (host+person.link) + "", true, false)) + " target=\"_blank\"><div class=\"leaders__el\"><div class=\"leaders__counter\">" + (jade.escape((jade_interp = index+1) == null ? '' : jade_interp)) + "</div><img" + (jade.attr("src", "" + (person.photo) + "", true, false)) + " class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">" + (jade.escape((jade_interp = person.nickname) == null ? '' : jade_interp)) + "</div></div><div class=\"leaders__score\">" + (jade.escape((jade_interp = person.scores) == null ? '' : jade_interp)) + "</div></div></a>");
    }

  }
}).call(this);

if ( leaders.common.you.place)
{
buf.push("<div class=\"leaders__el\"><div class=\"leaders__counter\">" + (jade.escape((jade_interp = leaders.common.you.place) == null ? '' : jade_interp)) + "</div><img" + (jade.attr("src", "" + (leaders.common.you.photo) + "", true, false)) + " class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">" + (jade.escape((jade_interp = leaders.common.you.nickname) == null ? '' : jade_interp)) + "</div></div><div class=\"leaders__score\">" + (jade.escape((jade_interp = leaders.common.you.scores) == null ? '' : jade_interp)) + "</div></div>");
}
buf.push("</div></div><div class=\"leaders leaders--current\"><h4 class=\"leaders__title\">Лидеры текущего квеста</h4><div class=\"leaders__list\">");
// iterate leaders.current.leaders
;(function(){
  var $$obj = leaders.current.leaders;
  if ('number' == typeof $$obj.length) {

    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
      var person = $$obj[index];

buf.push("<a" + (jade.attr("href", "" + (host+person.link) + "", true, false)) + " target=\"_blank\"><div class=\"leaders__el\"><div class=\"leaders__counter\">" + (jade.escape((jade_interp = index+1) == null ? '' : jade_interp)) + "</div><img" + (jade.attr("src", "" + (person.photo) + "", true, false)) + " class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">" + (jade.escape((jade_interp = person.nickname) == null ? '' : jade_interp)) + "</div></div><div class=\"leaders__score\">" + (jade.escape((jade_interp = person.scores) == null ? '' : jade_interp)) + "</div></div></a>");
    }

  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;      var person = $$obj[index];

buf.push("<a" + (jade.attr("href", "" + (host+person.link) + "", true, false)) + " target=\"_blank\"><div class=\"leaders__el\"><div class=\"leaders__counter\">" + (jade.escape((jade_interp = index+1) == null ? '' : jade_interp)) + "</div><img" + (jade.attr("src", "" + (person.photo) + "", true, false)) + " class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">" + (jade.escape((jade_interp = person.nickname) == null ? '' : jade_interp)) + "</div></div><div class=\"leaders__score\">" + (jade.escape((jade_interp = person.scores) == null ? '' : jade_interp)) + "</div></div></a>");
    }

  }
}).call(this);

if ( leaders.current.you.place)
{
buf.push("<div class=\"leaders__el\"><div class=\"leaders__counter\">" + (jade.escape((jade_interp = leaders.current.you.place) == null ? '' : jade_interp)) + "</div><img" + (jade.attr("src", "" + (leaders.current.you.photo) + "", true, false)) + " class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">" + (jade.escape((jade_interp = leaders.current.you.nickname) == null ? '' : jade_interp)) + "</div></div><div class=\"leaders__score\">" + (jade.escape((jade_interp = leaders.current.you.scores) == null ? '' : jade_interp)) + "</div></div>");
}
buf.push("</div></div><div class=\"leaders__switcher_wrapper\"><div class=\"leaders__switcher\"><div data-href=\".leaders--current\" class=\"leaders__switchbut leaders__switchcurrent js-switchToCurrent\">Текущий</div><div data-href=\".leaders--common\" class=\"leaders__switchbut leaders__switchbut--active leaders__switchcommon js-switchToCommon\">Общий</div></div></div>");
if ( views.theme != "white")
{
buf.push("<div class=\"leaders__link js-openFullRating\">Полный рейтинг →</div>");
}
buf.push("</div>");}.call(this,"host" in locals_for_with?locals_for_with.host:typeof host!=="undefined"?host:undefined,"leaders" in locals_for_with?locals_for_with.leaders:typeof leaders!=="undefined"?leaders:undefined,"undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined,"views" in locals_for_with?locals_for_with.views:typeof views!=="undefined"?views:undefined));;return buf.join("");
};
},{"jade/runtime":2}],52:[function(require,module,exports){
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


},{"../tools/keys.coffee":56}],53:[function(require,module,exports){
module.exports = [
  {
    achievement_id: 10,
    num: 0,
    name: "Первый пошел",
    description: "Завершил первый квест",
    message: "Играем в онлайн-квесты, не хватает только тебя! Это было бы круто даже без призов. Но призы есть! #городзаиграет",
    photo: 'photo-111850682_398049009',
    small_photo: "img/images/achieves-small/i0.png"
  }, {
    achievement_id: 11,
    num: 1,
    name: "Упёртый",
    description: "Завершил квест за одну сессию",
    message: "Играем в онлайн-квесты, не хватает только тебя! Это было бы круто даже без призов. Но призы есть! #городзаиграет",
    photo: 'photo-111850682_398049017',
    small_photo: "img/images/achieves-small/i1.png"
  }, {
    achievement_id: 12,
    num: 2,
    name: "Дай пять!",
    description: "Завершил 5 квестов",
    message: "Играем в онлайн-квесты, не хватает только тебя! Это было бы круто даже без призов. Но призы есть! #городзаиграет",
    photo: 'photo-111850682_398049011',
    small_photo: "img/images/achieves-small/i2.png"
  }, {
    achievement_id: 13,
    num: 3,
    name: "Красавчик",
    description: "Завершил 10 квестов",
    message: "Играем в онлайн-квесты, не хватает только тебя! Это было бы круто даже без призов. Но призы есть! #городзаиграет",
    photo: 'photo-111850682_398049014',
    small_photo: "img/images/achieves-small/i3.png"
  }, {
    achievement_id: 14,
    num: 4,
    name: "Пришел к успеху",
    description: "Попал в ТОП-20 в общем рейтинге",
    message: "Играем в онлайн-квесты, не хватает только тебя! Это было бы круто даже без призов. Но призы есть! #городзаиграет",
    photo: 'photo-111850682_398049019',
    small_photo: "img/images/achieves-small/i4.png"
  }, {
    achievement_id: 15,
    num: 5,
    name: "Городская легенда",
    description: "Завершил все доступные квесты",
    message: "Играем в онлайн-квесты, не хватает только тебя! Это было бы круто даже без призов. Но призы есть! #городзаиграет",
    photo: 'photo-111850682_398049013',
    small_photo: "img/images/achieves-small/i5.png"
  }, {
    achievement_id: 16,
    num: 6,
    name: "Вербовщик",
    description: "Пригласил 5 друзей",
    message: "Играем в онлайн-квесты, не хватает только тебя! Это было бы круто даже без призов. Но призы есть! #городзаиграет",
    photo: 'photo-111850682_398049016',
    small_photo: "img/images/achieves-small/i6.png"
  }, {
    achievement_id: 17,
    num: 7,
    name: "Гипножаба",
    description: "Пригласил 10 друзей",
    message: "Играем в онлайн-квесты, не хватает только тебя! Это было бы круто даже без призов. Но призы есть! #городзаиграет",
    photo: 'photo-111850682_398049012',
    small_photo: "img/images/achieves-small/i7.png"
  }
];


},{}],54:[function(require,module,exports){
module.exports.send = function(event_name) {
  return ga('send', {
    hitType: 'event',
    eventCategory: 'events',
    eventAction: event_name
  });
};


},{}],55:[function(require,module,exports){
var keys;

keys = require('./keys.coffee');

bin2hex = function(s) {
	//  discuss at: http://phpjs.org/functions/bin2hex/
	// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// bugfixed by: Onno Marsman
	// bugfixed by: Linuxworld
	// improved by: ntoniazzi (http://phpjs.org/functions/bin2hex:361#comment_177616)
	//   example 1: bin2hex('Kev');
	//   returns 1: '4b6576'
	//   example 2: bin2hex(String.fromCharCode(0x00));
	//   returns 2: '00'

	var i, l, o = '',
		n;

	s += '';

	for (i = 0, l = s.length; i < l; i++) {
		n = s.charCodeAt(i).toString(16);
		o += n.length < 2 ? '0' + n : n;
	}

	return o
}

hex2bin = function(s) {
	//  discuss at: http://phpjs.org/functions/hex2bin/
	// original by: Dumitru Uzun (http://duzun.me)
	//   example 1: hex2bin('44696d61');
	//   returns 1: 'Dima'
	//   example 2: hex2bin('00');
	//   returns 2: '\x00'
	//   example 3: hex2bin('2f1q')
	//   returns 3: false

	var ret = [],
		i = 0,
		l;

	s += '';

	for (l = s.length; i < l; i += 2) {
		var c = parseInt(s.substr(i, 1), 16);
		var k = parseInt(s.substr(i + 1, 1), 16);
		if (isNaN(c) || isNaN(k)) return false;
		ret.push((c << 4) | k);
	}

	return String.fromCharCode.apply(String, ret)
};

module.exports.decrypt = function(str, vector) {
  var dec;
  mcrypt.Crypt(null, null, null, keys.getMd5key(), 'rijndael-256', 'cbc');
  dec = mcrypt.Decrypt(hex2bin(str), hex2bin(vector));
  dec = dec.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
  return JSON.parse(dec);
};


},{"./keys.coffee":56}],56:[function(require,module,exports){
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


},{"./md5.coffee":58}],57:[function(require,module,exports){
var keys;

keys = require('./keys');

module.exports.init = function() {
  return $('header a').each(function(i, el) {
    var href;
    href = $(el).attr('href');
    return $(el).attr('href', href + "?sid=" + keys.sid + "&viewer_id=" + keys.viewer_id + "&auth_key=" + keys.auth_key);
  });
};

module.exports.addButHash = function($els) {
  return $els.each(function(i, el) {
    var href;
    console.log(el);
    href = $(el).attr('href');
    return $(el).attr('href', href + "&sid=" + keys.sid + "&viewer_id=" + keys.viewer_id + "&auth_key=" + keys.auth_key);
  });
};

module.exports.addWhatButHash = function($els) {
  return $els.each(function(i, el) {
    var href;
    console.log(el);
    href = $(el).attr('href');
    return $(el).attr('href', href + "?sid=" + keys.sid + "&viewer_id=" + keys.viewer_id + "&auth_key=" + keys.auth_key);
  });
};

module.exports.parseGetParams = function() {
  var $_GET, __GET, getVar, j, len, vvar;
  $_GET = {};
  __GET = window.location.search.substring(1).split("&");
  for (j = 0, len = __GET.length; j < len; j++) {
    vvar = __GET[j];
    getVar = vvar.split("=");
    if (typeof getVar[1] === "undefined") {
      $_GET[getVar[0]] = "";
    } else {
      $_GET[getVar[0]] = getVar[1];
    }
  }
  return $_GET;
};


},{"./keys":56}],58:[function(require,module,exports){
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


},{}],59:[function(require,module,exports){
var request;

request = require('../request');

module.exports.init = function(callback) {
  var initFail, initSuccess;
  initSuccess = function() {
    console.log("init success");
    return callback();
  };
  initFail = function() {
    return console.log('init fail');
  };
  return VK.init(initSuccess, initFail, '5.40');
};

module.exports.resize = function(height) {
  return VK.callMethod("resizeWindow", 1000, height);
};

module.exports.isReg = function(callback) {
  var getUserInfo;
  request.user.isReg({}, function(res) {
    console.log("IS REG " + res.result);
    if (res.result === true) {
      callback();
    }
    if (res.result === false) {
      return getUserInfo();
    }
  });
  return getUserInfo = function() {
    return VK.api('users.get', {
      test_mode: 1,
      fields: "screen_name,sex,bdate,city,country,photo_max"
    }, function(data) {
      var e, error, error1, personInfo;
      if (data.response[0] == null) {
        console.log(data);
        return;
      }
      console.log(data);
      personInfo = {
        first_name: data.response[0].first_name || "",
        last_name: data.response[0].last_name || "",
        screen_name: data.response[0].screen_name || "",
        sex: data.response[0].sex,
        bdate: data.response[0].bdate || '01.01.0000',
        photo: data.response[0].photo_max || ""
      };
      try {
        personInfo.city = data.response[0].city.title;
      } catch (error) {
        e = error;
        personInfo.city = "";
      }
      try {
        personInfo.country = data.response[0].country.title;
      } catch (error1) {
        e = error1;
        personInfo.country = "";
      }
      return request.user.registration(personInfo, function(res) {
        console.log(res);
        return callback();
      });
    });
  };
};

module.exports.wallPost = function(opts, success) {
  opts.test_mode = 1;
  return VK.api('wall.post', opts, function(data) {
    console.log(data);
    data.response = data.response || {};
    if (data.response.post_id) {
      return success();
    } else {

    }
  });
};

module.exports.inviteFriends = function() {
  return VK.callMethod("showInviteBox");
};


},{"../request":52}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2phZGUvcnVudGltZS5qcyIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFxnYW1lLmNvZmZlZSIsInNyYy9qcy9zY3JpcHQvZ2FtZS9jcmFja2NvdW50LmphZGUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxcZ2FtZVxcY3JhY2tlcnMuY29mZmVlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXGdhbWVcXGluZGV4LmNvZmZlZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFxnYW1lXFxtYXAuY29mZmVlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXGdhbWVcXG1vbmV5LmNvZmZlZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFxnYW1lXFxwb2ludHMuY29mZmVlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXGdhbWVcXHJvdXRlLmNvZmZlZSIsInNyYy9qcy9zY3JpcHQvZ2FtZS9yb3V0ZS5qYWRlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXGdhbWVcXHR1Y3BpenphLmNvZmZlZSIsInNyYy9qcy9zY3JpcHQvaGVhZGVyL2hlYWRlcl9fcHJvZmlsZS5qYWRlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXGhlYWRlclxcaW5kZXguY29mZmVlIiwic3JjL2pzL3NjcmlwdC9oZWFkZXIvbWVzc2VuZ2VyX19pY29uLmphZGUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxccG9wdXBzXFxhY2hpZXZlLmNvZmZlZSIsInNyYy9qcy9zY3JpcHQvcG9wdXBzL2FjaGlldmUuamFkZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFxwb3B1cHNcXGNoZWNrcG9pbnQuY29mZmVlIiwic3JjL2pzL3NjcmlwdC9wb3B1cHMvY2hlY2twb2ludC5qYWRlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXHBvcHVwc1xcZ2FtZWVudGVyLmNvZmZlZSIsInNyYy9qcy9zY3JpcHQvcG9wdXBzL2dhbWVlbnRlci5qYWRlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXHBvcHVwc1xcaW5kZXguY29mZmVlIiwic3JjL2pzL3NjcmlwdC9wb3B1cHMvaW5kZXguamFkZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFxwb3B1cHNcXGludHJvLmNvZmZlZSIsInNyYy9qcy9zY3JpcHQvcG9wdXBzL2ludHJvLmphZGUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxccG9wdXBzXFxpbnZpdGUuY29mZmVlIiwic3JjL2pzL3NjcmlwdC9wb3B1cHMvaW52aXRlLmphZGUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxccG9wdXBzXFxtZXNzZW5nZXJcXG1lc3Nlbmdlci5jb2ZmZWUiLCJzcmMvanMvc2NyaXB0L3BvcHVwcy9tZXNzZW5nZXIvbWVzc2VuZ2VyLmphZGUiLCJzcmMvanMvc2NyaXB0L3BvcHVwcy9tZXNzZW5nZXIvbm90aWZpY2F0aW9uLmphZGUiLCJzcmMvanMvc2NyaXB0L3BvcHVwcy9tZXNzZW5nZXIvcXVlc3Rpb24uamFkZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFxwb3B1cHNcXG1vbmV5LmNvZmZlZSIsInNyYy9qcy9zY3JpcHQvcG9wdXBzL21vbmV5X2ZhaWwuamFkZSIsInNyYy9qcy9zY3JpcHQvcG9wdXBzL21vbmV5X29rLmphZGUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxccG9wdXBzXFxteXByaXplcy5jb2ZmZWUiLCJzcmMvanMvc2NyaXB0L3BvcHVwcy9teXByaXplcy5qYWRlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXHBvcHVwc1xcbmV3dGFzdGUuY29mZmVlIiwic3JjL2pzL3NjcmlwdC9wb3B1cHMvbmV3dGFzdGUuamFkZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFxwb3B1cHNcXHBpenphLmNvZmZlZSIsInNyYy9qcy9zY3JpcHQvcG9wdXBzL3BpenphLmphZGUiLCJzcmMvanMvc2NyaXB0L3BvcHVwcy9yYXRpbmctbGlzdC5qYWRlIiwic3JjL2pzL3NjcmlwdC9wb3B1cHMvcmF0aW5nLXBhZ2luYXRpb24uamFkZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFxwb3B1cHNcXHJhdGluZy5jb2ZmZWUiLCJzcmMvanMvc2NyaXB0L3BvcHVwcy9yYXRpbmcuamFkZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFxwb3B1cHNcXHVzZXJpbmZvLmNvZmZlZSIsInNyYy9qcy9zY3JpcHQvcG9wdXBzL3VzZXJpbmZvLmphZGUiLCJzcmMvanMvc2NyaXB0L3F1ZXN0cy9jdXJxdWVzdC5qYWRlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXHF1ZXN0c1xcaW5kZXguY29mZmVlIiwic3JjL2pzL3NjcmlwdC9xdWVzdHMvcXVlc3RzLWxpc3QuamFkZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFxyYXRpbmdcXGluZGV4LmNvZmZlZSIsInNyYy9qcy9zY3JpcHQvcmF0aW5nL2xlYWRlcnMuamFkZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFxyZXF1ZXN0XFxpbmRleC5jb2ZmZWUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxcdG9vbHNcXGFjaHZEYXRhLmNvZmZlZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFx0b29sc1xcYW5hbC5jb2ZmZWUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxcdG9vbHNcXGNyeXB0by5jb2ZmZWUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxcdG9vbHNcXGtleXMuY29mZmVlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXHRvb2xzXFxsaW5rcy5jb2ZmZWUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxcdG9vbHNcXG1kNS5jb2ZmZWUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxcdG9vbHNcXHZrLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMzUEEsSUFBQTs7QUFBQSxP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QUFEO1FBQ3JDLE9BQU8sQ0FBQyxHQUFSLENBQVksR0FBWjtlQUNBLFFBQUEsQ0FBQTtNQUZxQyxDQUF0QztJQXhCMEYsQ0FBM0Y7RUFEYTtBQVJROztBQXFDdkIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFmLEdBQTBCLFNBQUMsSUFBRCxFQUFPLE9BQVA7RUFDekIsSUFBSSxDQUFDLFNBQUwsR0FBaUI7U0FDakIsRUFBRSxDQUFDLEdBQUgsQ0FBTyxXQUFQLEVBQW9CLElBQXBCLEVBQTBCLFNBQUMsSUFBRDtJQUN6QixPQUFPLENBQUMsR0FBUixDQUFZLElBQVo7SUFDQSxJQUFJLENBQUMsUUFBTCxHQUFnQixJQUFJLENBQUMsUUFBTCxJQUFpQjtJQUNqQyxJQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBakI7YUFFQyxPQUFBLENBQUEsRUFGRDtLQUFBLE1BQUE7QUFBQTs7RUFIeUIsQ0FBMUI7QUFGeUI7O0FBVzFCLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBZixHQUErQixTQUFBO1NBQzlCLEVBQUUsQ0FBQyxVQUFILENBQWMsZUFBZDtBQUQ4QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIiLCIoZnVuY3Rpb24oZil7aWYodHlwZW9mIGV4cG9ydHM9PT1cIm9iamVjdFwiJiZ0eXBlb2YgbW9kdWxlIT09XCJ1bmRlZmluZWRcIil7bW9kdWxlLmV4cG9ydHM9ZigpfWVsc2UgaWYodHlwZW9mIGRlZmluZT09PVwiZnVuY3Rpb25cIiYmZGVmaW5lLmFtZCl7ZGVmaW5lKFtdLGYpfWVsc2V7dmFyIGc7aWYodHlwZW9mIHdpbmRvdyE9PVwidW5kZWZpbmVkXCIpe2c9d2luZG93fWVsc2UgaWYodHlwZW9mIGdsb2JhbCE9PVwidW5kZWZpbmVkXCIpe2c9Z2xvYmFsfWVsc2UgaWYodHlwZW9mIHNlbGYhPT1cInVuZGVmaW5lZFwiKXtnPXNlbGZ9ZWxzZXtnPXRoaXN9Zy5qYWRlID0gZigpfX0pKGZ1bmN0aW9uKCl7dmFyIGRlZmluZSxtb2R1bGUsZXhwb3J0cztyZXR1cm4gKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkoezE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIE1lcmdlIHR3byBhdHRyaWJ1dGUgb2JqZWN0cyBnaXZpbmcgcHJlY2VkZW5jZVxuICogdG8gdmFsdWVzIGluIG9iamVjdCBgYmAuIENsYXNzZXMgYXJlIHNwZWNpYWwtY2FzZWRcbiAqIGFsbG93aW5nIGZvciBhcnJheXMgYW5kIG1lcmdpbmcvam9pbmluZyBhcHByb3ByaWF0ZWx5XG4gKiByZXN1bHRpbmcgaW4gYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBiXG4gKiBAcmV0dXJuIHtPYmplY3R9IGFcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMubWVyZ2UgPSBmdW5jdGlvbiBtZXJnZShhLCBiKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgdmFyIGF0dHJzID0gYVswXTtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGF0dHJzID0gbWVyZ2UoYXR0cnMsIGFbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cnM7XG4gIH1cbiAgdmFyIGFjID0gYVsnY2xhc3MnXTtcbiAgdmFyIGJjID0gYlsnY2xhc3MnXTtcblxuICBpZiAoYWMgfHwgYmMpIHtcbiAgICBhYyA9IGFjIHx8IFtdO1xuICAgIGJjID0gYmMgfHwgW107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFjKSkgYWMgPSBbYWNdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShiYykpIGJjID0gW2JjXTtcbiAgICBhWydjbGFzcyddID0gYWMuY29uY2F0KGJjKS5maWx0ZXIobnVsbHMpO1xuICB9XG5cbiAgZm9yICh2YXIga2V5IGluIGIpIHtcbiAgICBpZiAoa2V5ICE9ICdjbGFzcycpIHtcbiAgICAgIGFba2V5XSA9IGJba2V5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYTtcbn07XG5cbi8qKlxuICogRmlsdGVyIG51bGwgYHZhbGBzLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbnVsbHModmFsKSB7XG4gIHJldHVybiB2YWwgIT0gbnVsbCAmJiB2YWwgIT09ICcnO1xufVxuXG4vKipcbiAqIGpvaW4gYXJyYXkgYXMgY2xhc3Nlcy5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmpvaW5DbGFzc2VzID0gam9pbkNsYXNzZXM7XG5mdW5jdGlvbiBqb2luQ2xhc3Nlcyh2YWwpIHtcbiAgcmV0dXJuIChBcnJheS5pc0FycmF5KHZhbCkgPyB2YWwubWFwKGpvaW5DbGFzc2VzKSA6XG4gICAgKHZhbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0JykgPyBPYmplY3Qua2V5cyh2YWwpLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7IHJldHVybiB2YWxba2V5XTsgfSkgOlxuICAgIFt2YWxdKS5maWx0ZXIobnVsbHMpLmpvaW4oJyAnKTtcbn1cblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGNsYXNzZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gY2xhc3Nlc1xuICogQHBhcmFtIHtBcnJheS48Qm9vbGVhbj59IGVzY2FwZWRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5jbHMgPSBmdW5jdGlvbiBjbHMoY2xhc3NlcywgZXNjYXBlZCkge1xuICB2YXIgYnVmID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChlc2NhcGVkICYmIGVzY2FwZWRbaV0pIHtcbiAgICAgIGJ1Zi5wdXNoKGV4cG9ydHMuZXNjYXBlKGpvaW5DbGFzc2VzKFtjbGFzc2VzW2ldXSkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnVmLnB1c2goam9pbkNsYXNzZXMoY2xhc3Nlc1tpXSkpO1xuICAgIH1cbiAgfVxuICB2YXIgdGV4dCA9IGpvaW5DbGFzc2VzKGJ1Zik7XG4gIGlmICh0ZXh0Lmxlbmd0aCkge1xuICAgIHJldHVybiAnIGNsYXNzPVwiJyArIHRleHQgKyAnXCInO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnJztcbiAgfVxufTtcblxuXG5leHBvcnRzLnN0eWxlID0gZnVuY3Rpb24gKHZhbCkge1xuICBpZiAodmFsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHZhbCkubWFwKGZ1bmN0aW9uIChzdHlsZSkge1xuICAgICAgcmV0dXJuIHN0eWxlICsgJzonICsgdmFsW3N0eWxlXTtcbiAgICB9KS5qb2luKCc7Jyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxufTtcbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHBhcmFtIHtCb29sZWFufSBlc2NhcGVkXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHRlcnNlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0ciA9IGZ1bmN0aW9uIGF0dHIoa2V5LCB2YWwsIGVzY2FwZWQsIHRlcnNlKSB7XG4gIGlmIChrZXkgPT09ICdzdHlsZScpIHtcbiAgICB2YWwgPSBleHBvcnRzLnN0eWxlKHZhbCk7XG4gIH1cbiAgaWYgKCdib29sZWFuJyA9PSB0eXBlb2YgdmFsIHx8IG51bGwgPT0gdmFsKSB7XG4gICAgaWYgKHZhbCkge1xuICAgICAgcmV0dXJuICcgJyArICh0ZXJzZSA/IGtleSA6IGtleSArICc9XCInICsga2V5ICsgJ1wiJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH0gZWxzZSBpZiAoMCA9PSBrZXkuaW5kZXhPZignZGF0YScpICYmICdzdHJpbmcnICE9IHR5cGVvZiB2YWwpIHtcbiAgICBpZiAoSlNPTi5zdHJpbmdpZnkodmFsKS5pbmRleE9mKCcmJykgIT09IC0xKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1NpbmNlIEphZGUgMi4wLjAsIGFtcGVyc2FuZHMgKGAmYCkgaW4gZGF0YSBhdHRyaWJ1dGVzICcgK1xuICAgICAgICAgICAgICAgICAgICd3aWxsIGJlIGVzY2FwZWQgdG8gYCZhbXA7YCcpO1xuICAgIH07XG4gICAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsLnRvSVNPU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0phZGUgd2lsbCBlbGltaW5hdGUgdGhlIGRvdWJsZSBxdW90ZXMgYXJvdW5kIGRhdGVzIGluICcgK1xuICAgICAgICAgICAgICAgICAgICdJU08gZm9ybSBhZnRlciAyLjAuMCcpO1xuICAgIH1cbiAgICByZXR1cm4gJyAnICsga2V5ICsgXCI9J1wiICsgSlNPTi5zdHJpbmdpZnkodmFsKS5yZXBsYWNlKC8nL2csICcmYXBvczsnKSArIFwiJ1wiO1xuICB9IGVsc2UgaWYgKGVzY2FwZWQpIHtcbiAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwudG9JU09TdHJpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUud2FybignSmFkZSB3aWxsIHN0cmluZ2lmeSBkYXRlcyBpbiBJU08gZm9ybSBhZnRlciAyLjAuMCcpO1xuICAgIH1cbiAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cIicgKyBleHBvcnRzLmVzY2FwZSh2YWwpICsgJ1wiJztcbiAgfSBlbHNlIHtcbiAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwudG9JU09TdHJpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUud2FybignSmFkZSB3aWxsIHN0cmluZ2lmeSBkYXRlcyBpbiBJU08gZm9ybSBhZnRlciAyLjAuMCcpO1xuICAgIH1cbiAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cIicgKyB2YWwgKyAnXCInO1xuICB9XG59O1xuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gYXR0cmlidXRlcyBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtPYmplY3R9IGVzY2FwZWRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5hdHRycyA9IGZ1bmN0aW9uIGF0dHJzKG9iaiwgdGVyc2Upe1xuICB2YXIgYnVmID0gW107XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuXG4gIGlmIChrZXlzLmxlbmd0aCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV1cbiAgICAgICAgLCB2YWwgPSBvYmpba2V5XTtcblxuICAgICAgaWYgKCdjbGFzcycgPT0ga2V5KSB7XG4gICAgICAgIGlmICh2YWwgPSBqb2luQ2xhc3Nlcyh2YWwpKSB7XG4gICAgICAgICAgYnVmLnB1c2goJyAnICsga2V5ICsgJz1cIicgKyB2YWwgKyAnXCInKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnVmLnB1c2goZXhwb3J0cy5hdHRyKGtleSwgdmFsLCBmYWxzZSwgdGVyc2UpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmLmpvaW4oJycpO1xufTtcblxuLyoqXG4gKiBFc2NhcGUgdGhlIGdpdmVuIHN0cmluZyBvZiBgaHRtbGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGh0bWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbnZhciBqYWRlX2VuY29kZV9odG1sX3J1bGVzID0ge1xuICAnJic6ICcmYW1wOycsXG4gICc8JzogJyZsdDsnLFxuICAnPic6ICcmZ3Q7JyxcbiAgJ1wiJzogJyZxdW90Oydcbn07XG52YXIgamFkZV9tYXRjaF9odG1sID0gL1smPD5cIl0vZztcblxuZnVuY3Rpb24gamFkZV9lbmNvZGVfY2hhcihjKSB7XG4gIHJldHVybiBqYWRlX2VuY29kZV9odG1sX3J1bGVzW2NdIHx8IGM7XG59XG5cbmV4cG9ydHMuZXNjYXBlID0gamFkZV9lc2NhcGU7XG5mdW5jdGlvbiBqYWRlX2VzY2FwZShodG1sKXtcbiAgdmFyIHJlc3VsdCA9IFN0cmluZyhodG1sKS5yZXBsYWNlKGphZGVfbWF0Y2hfaHRtbCwgamFkZV9lbmNvZGVfY2hhcik7XG4gIGlmIChyZXN1bHQgPT09ICcnICsgaHRtbCkgcmV0dXJuIGh0bWw7XG4gIGVsc2UgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogUmUtdGhyb3cgdGhlIGdpdmVuIGBlcnJgIGluIGNvbnRleHQgdG8gdGhlXG4gKiB0aGUgamFkZSBpbiBgZmlsZW5hbWVgIGF0IHRoZSBnaXZlbiBgbGluZW5vYC5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IGxpbmVub1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5yZXRocm93ID0gZnVuY3Rpb24gcmV0aHJvdyhlcnIsIGZpbGVuYW1lLCBsaW5lbm8sIHN0cil7XG4gIGlmICghKGVyciBpbnN0YW5jZW9mIEVycm9yKSkgdGhyb3cgZXJyO1xuICBpZiAoKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgfHwgIWZpbGVuYW1lKSAmJiAhc3RyKSB7XG4gICAgZXJyLm1lc3NhZ2UgKz0gJyBvbiBsaW5lICcgKyBsaW5lbm87XG4gICAgdGhyb3cgZXJyO1xuICB9XG4gIHRyeSB7XG4gICAgc3RyID0gc3RyIHx8IHJlcXVpcmUoJ2ZzJykucmVhZEZpbGVTeW5jKGZpbGVuYW1lLCAndXRmOCcpXG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgcmV0aHJvdyhlcnIsIG51bGwsIGxpbmVubylcbiAgfVxuICB2YXIgY29udGV4dCA9IDNcbiAgICAsIGxpbmVzID0gc3RyLnNwbGl0KCdcXG4nKVxuICAgICwgc3RhcnQgPSBNYXRoLm1heChsaW5lbm8gLSBjb250ZXh0LCAwKVxuICAgICwgZW5kID0gTWF0aC5taW4obGluZXMubGVuZ3RoLCBsaW5lbm8gKyBjb250ZXh0KTtcblxuICAvLyBFcnJvciBjb250ZXh0XG4gIHZhciBjb250ZXh0ID0gbGluZXMuc2xpY2Uoc3RhcnQsIGVuZCkubWFwKGZ1bmN0aW9uKGxpbmUsIGkpe1xuICAgIHZhciBjdXJyID0gaSArIHN0YXJ0ICsgMTtcbiAgICByZXR1cm4gKGN1cnIgPT0gbGluZW5vID8gJyAgPiAnIDogJyAgICAnKVxuICAgICAgKyBjdXJyXG4gICAgICArICd8ICdcbiAgICAgICsgbGluZTtcbiAgfSkuam9pbignXFxuJyk7XG5cbiAgLy8gQWx0ZXIgZXhjZXB0aW9uIG1lc3NhZ2VcbiAgZXJyLnBhdGggPSBmaWxlbmFtZTtcbiAgZXJyLm1lc3NhZ2UgPSAoZmlsZW5hbWUgfHwgJ0phZGUnKSArICc6JyArIGxpbmVub1xuICAgICsgJ1xcbicgKyBjb250ZXh0ICsgJ1xcblxcbicgKyBlcnIubWVzc2FnZTtcbiAgdGhyb3cgZXJyO1xufTtcblxuZXhwb3J0cy5EZWJ1Z0l0ZW0gPSBmdW5jdGlvbiBEZWJ1Z0l0ZW0obGluZW5vLCBmaWxlbmFtZSkge1xuICB0aGlzLmxpbmVubyA9IGxpbmVubztcbiAgdGhpcy5maWxlbmFtZSA9IGZpbGVuYW1lO1xufVxuXG59LHtcImZzXCI6Mn1dLDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXG59LHt9XX0se30sWzFdKSgxKVxufSk7IiwicmVxdWVzdCA9IHJlcXVpcmUgJy4vcmVxdWVzdCdcclxubGlua3MgPSByZXF1aXJlICcuL3Rvb2xzL2xpbmtzLmNvZmZlZSdcclxucG9wdXBzID0gcmVxdWlyZSAnLi9wb3B1cHMnXHJcblxyXG52ayA9IHJlcXVpcmUoJy4vdG9vbHMvdmsuY29mZmVlJylcclxuXHJcbnZrLmluaXQgLT5cclxuXHR2ay5yZXNpemUgMTQwMFxyXG5cdHJhdGluZyA9IHJlcXVpcmUoJy4vcmF0aW5nJykuaW5pdCh7cGFnZTpcImdhbWVcIn0pXHJcblx0aGVhZGVyID0gcmVxdWlyZSgnLi9oZWFkZXInKVxyXG5cdGdhbWUgPSByZXF1aXJlKCcuL2dhbWUvaW5kZXguY29mZmVlJylcclxuXHRxdWVzdHMgPSByZXF1aXJlICcuL3F1ZXN0cydcclxuXHJcblx0c3RhcnRHYW1lID0gLT5cclxuXHRcdHFpZCA9IGxpbmtzLnBhcnNlR2V0UGFyYW1zKCkucXVlc3RfaWRcclxuXHRcdGdhbWUuaW5pdChxaWQpXHJcblxyXG5cdHN0YXJ0R2FtZSgpIiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoY29tLCBjdXIpIHtcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwicXVlc3RfX2NyYWNrY291bnRcXFwiPjxkaXYgY2xhc3M9XFxcInF1ZXN0X19jcmFja2NvdW50LXRleHRcXFwiPtCd0LDQudC00LXQvdC+INC60YDQtdC60LXRgNC+0LI8L2Rpdj48ZGl2IGNsYXNzPVxcXCJxdWVzdF9fY3JhY2tjb3VudC12YWxcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGN1cikgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiIC8gXCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gY29tKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj5cIik7fS5jYWxsKHRoaXMsXCJjb21cIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmNvbTp0eXBlb2YgY29tIT09XCJ1bmRlZmluZWRcIj9jb206dW5kZWZpbmVkLFwiY3VyXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5jdXI6dHlwZW9mIGN1ciE9PVwidW5kZWZpbmVkXCI/Y3VyOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsIk1hcCA9IHJlcXVpcmUgJy4vbWFwLmNvZmZlZSdcclxucmVxdWVzdCA9IHJlcXVpcmUgJy4uL3JlcXVlc3QnXHJcbnBvcHVwcyA9IHJlcXVpcmUgJy4uL3BvcHVwcydcclxua2V5cyA9IHJlcXVpcmUgJy4uL3Rvb2xzL2tleXMuY29mZmVlJ1xyXG5jcmFja1RlbXBsYXRlID0gcmVxdWlyZSAnLi9jcmFja2NvdW50LmphZGUnXHJcblxyXG5jcmFja2VycyA9IFtdXHJcbmFsbF9jcmFja2Vyc19udW0gPSAwXHJcbmN1cl9jcmFja2Vyc19udW0gPSAwXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5zZXRDcmFja2Vyc051bSA9IChudW0pIC0+XHJcblx0YWxsX2NyYWNrZXJzX251bSA9IG51bTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5hZGRDcmFja2VycyA9IChwb2ludHMpIC0+XHJcblx0Y3VyX2NyYWNrZXJzX251bSA9IGFsbF9jcmFja2Vyc19udW0gLSAoayBmb3IgayBpbiBwb2ludHMgd2hlbiBrKS5sZW5ndGhcclxuXHRyZW5kZXJDb3VudCgpXHJcblx0Zm9yIHBvaW50IGluIHBvaW50cyB3aGVuIHBvaW50P1xyXG5cdFx0bGF0ID0gcGFyc2VGbG9hdCBwb2ludC5sYXRcclxuXHRcdGxvbiA9IHBhcnNlRmxvYXQgcG9pbnQubG9uXHJcblx0XHRuZXdQb2ludCA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xyXG5cdFx0XHRwb3NpdGlvbjoge1xyXG5cdFx0XHRcdGxhdDogbGF0XHJcblx0XHRcdFx0bG5nOiBsb25cclxuXHRcdFx0fSxcclxuXHRcdFx0bWFwOiBNYXAuZ2V0TWFwKClcclxuXHRcdFx0aWNvbjogXCIuL2ltZy9pbWFnZXMvY3JhY2tlci5wbmc/aWQ9MlwiXHJcblx0XHRcdHRpdGxlOiAn0JrRgNC10LrQtdGAJ1xyXG5cdFx0XHR2aXNpYmxlOiBmYWxzZVxyXG5cdFx0XHRvcmlnTGF0OiBwb2ludC5sYXRcclxuXHRcdFx0b3JpZ0xuZzogcG9pbnQubG9uXHJcblx0XHRcdGluZm86IHBvaW50LmluZm9cclxuXHRcdH0pXHJcblx0XHRuZXdQb2ludC5hZGRMaXN0ZW5lciAnY2xpY2snLCBjcmFja2VyQ2xpY2tIYW5kbGVyXHJcblx0XHRjcmFja2Vycy5wdXNoIG5ld1BvaW50XHJcblxyXG5jcmFja2VyQ2xpY2tIYW5kbGVyID0gKGUpIC0+XHJcblx0aW5kZXggPSBjcmFja2Vycy5pbmRleE9mKHRoaXMpXHJcblx0Y29uc29sZS5sb2cgaW5kZXhcclxuXHRsYXQgPSB0aGlzLm9yaWdMYXRcclxuXHRsb24gPSB0aGlzLm9yaWdMbmdcclxuXHRpbmZvID0gdGhpcy5pbmZvXHJcblx0cmVxdWVzdC5nYW1lLmdldFBvaW50IHtsYXQ6IGxhdCwgbG9uOiBsb259LCAocmVzKSAtPlxyXG5cdFx0Y29uc29sZS5sb2cgcmVzXHJcblx0XHRjYXB0dXJlQ3JhY2tlcihpbmRleCwgcmVzKSBpZiByZXMucmVzdWx0ID09IFwic3VjY2Vzc1wiXHJcblxyXG5jYXB0dXJlQ3JhY2tlciA9IChpbmRleCwgcmVzKSAtPlxyXG5cdGtleXMuc2V0SGFzaChyZXMuaGFzaClcclxuXHRjcmFja2Vyc1tpbmRleF0uc2V0VmlzaWJsZSBmYWxzZVxyXG5cdGNyYWNrZXJzLnNwbGljZShpbmRleCwxKVxyXG5cdGN1cl9jcmFja2Vyc19udW0rK1xyXG5cdHJlbmRlckNvdW50KClcclxuXHJcbnJlbmRlckNvdW50ID0gLT5cclxuXHQkKCcucXVlc3RfX2NyYWNrY291bnQtZm9ybG9hZGluZycpLmh0bWwgY3JhY2tUZW1wbGF0ZSh7Y3VyOiBjdXJfY3JhY2tlcnNfbnVtLCBjb206IGFsbF9jcmFja2Vyc19udW19KVxyXG5cclxubW9kdWxlLmV4cG9ydHMuZ2V0Q3JhY2tlcnMgPSAtPlxyXG5cdHJldHVybiBjcmFja2Vyc1xyXG4iLCJyZXF1ZXN0ID0gcmVxdWlyZSAnLi4vcmVxdWVzdCdcclxubWFwID0gcmVxdWlyZSAnLi9tYXAuY29mZmVlJ1xyXG5wb2ludHMgPSByZXF1aXJlICcuL3BvaW50cy5jb2ZmZWUnXHJcbmNyYWNrZXJzID0gcmVxdWlyZSAnLi9jcmFja2Vycy5jb2ZmZWUnXHJcbnBpenphcyA9IHJlcXVpcmUgJy4vdHVjcGl6emEuY29mZmVlJ1xyXG5tb25leSA9IHJlcXVpcmUgJy4vbW9uZXkuY29mZmVlJ1xyXG5rZXlzID0gcmVxdWlyZSAnLi4vdG9vbHMva2V5cy5jb2ZmZWUnXHJcbmNyeXB0byA9IHJlcXVpcmUgJy4uL3Rvb2xzL2NyeXB0by5jb2ZmZWUnXHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzLmluaXQgPSAoaWQpIC0+XHJcblx0cmVxdWVzdC5nYW1lLmVudGVyIHtxdWVzdF9pZDppZH0sIChyZXMpIC0+XHJcblx0XHRrZXlzLnNldEhhc2gocmVzLmhhc2gpXHJcblx0XHRyZXMucG9pbnRzID0gY3J5cHRvLmRlY3J5cHQocmVzLnBvaW50cy5zdHIsIHJlcy5wb2ludHMuaXYpXHJcblx0XHRjb25zb2xlLmxvZyByZXNcclxuXHRcdG1hcC5pbml0KHJlcylcclxuXHRcdGNyYWNrZXJzLnNldENyYWNrZXJzTnVtKHJlcy5xdWVzdC5jb3VudC5jcmFja2VycylcclxuXHRcdHBvaW50cy5hZGRDaGVja3BvaW50cyhyZXMucG9pbnRzLmNoZWNrcG9pbnRzKVxyXG5cdFx0Y3JhY2tlcnMuYWRkQ3JhY2tlcnMocmVzLnBvaW50cy5jcmFja2VycylcclxuXHRcdHBpenphcy5hZGRQaXp6YXMocmVzLnBvaW50cy5waXp6YSlcclxuXHRcdG1vbmV5LmFkZE1vbmV5KHJlcy5wb2ludHMubW9uZXkpXHJcblx0XHRwb2ludHMuZmluZEN1cnJlbnRQb2ludChyZXMucG9pbnRzLmNoZWNrcG9pbnRzKVxyXG5cdFx0cG9pbnRzLnNob3dGaXJzdFBvcHVwKHJlcylcclxuXHJcblx0XHQkKCcuanMtc2hvd0hpbnQnKS5vbiAnY2xpY2snLCAtPlxyXG5cdFx0XHRwb2ludHMuc2hvd1ByZXZQb3B1cCgpXHJcbiIsInJvdXRlID0gcmVxdWlyZSAnLi9yb3V0ZS5jb2ZmZWUnXHJcbnJlcXVlc3QgPSByZXF1aXJlICcuLi9yZXF1ZXN0J1xyXG5Qb2ludHMgPSByZXF1aXJlICcuL3BvaW50cy5jb2ZmZWUnXHJcbkNyYWNrZXJzID0gcmVxdWlyZSAnLi9jcmFja2Vycy5jb2ZmZWUnXHJcbk1vbmV5ID0gcmVxdWlyZSAnLi9tb25leS5jb2ZmZWUnXHJcblBpenphcyA9IHJlcXVpcmUgJy4vdHVjcGl6emEuY29mZmVlJ1xyXG5cclxuZ21hcCA9IG51bGxcclxucGFub3JhbWEgPSBudWxsXHJcbnRlc3RpbmcgPSAhIXdpbmRvdy5pc1Rlc3RpbmdcclxuXHJcbnN0cmVldFZpZXcgPSBmYWxzZVxyXG5cclxudmlzaWJsZURpc3QgPSAwLjAwMVxyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5pbml0ID0gKG9wdHMpIC0+XHJcblxyXG5cdHRvcF94ID0gcGFyc2VGbG9hdCBvcHRzLnF1ZXN0LmJvcmRlcl9sZWZ0X3RvcF94O1xyXG5cdHRvcF95ID0gcGFyc2VGbG9hdCBvcHRzLnF1ZXN0LmJvcmRlcl9sZWZ0X3RvcF95O1xyXG5cdGJvdHRvbV94ID0gcGFyc2VGbG9hdCBvcHRzLnF1ZXN0LmJvcmRlcl9yaWdodF9ib3R0b21feDtcclxuXHRib3R0b21feSA9IHBhcnNlRmxvYXQgb3B0cy5xdWVzdC5ib3JkZXJfcmlnaHRfYm90dG9tX3k7XHJcblxyXG5cdGFzdG9yUGxhY2UgPSB7bGF0OiAodG9wX3grYm90dG9tX3gpLzIsIGxuZzogKHRvcF95K2JvdHRvbV95KS8yfVxyXG5cclxuXHQkbWFwID0gJCgnI21hcCcpXHJcblxyXG5cdGdtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKCRtYXBbMF0sIHtcclxuXHRcdGNlbnRlcjogYXN0b3JQbGFjZSxcclxuXHRcdHpvb206IDEzLFxyXG5cdFx0I21heFpvb206IDE4LFxyXG5cdFx0bWluWm9vbTogMixcclxuXHRcdHN0cmVldFZpZXdDb250cm9sOiB0cnVlXHJcblx0XHQjem9vbUNvbnRyb2w6IGZhbHNlXHJcblx0fSlcclxuXHJcblx0IyMjcmVjdGFuZ2xlID0gbmV3IGdvb2dsZS5tYXBzLlJlY3RhbmdsZSh7XHJcblx0XHRzdHJva2VDb2xvcjogJyNGRjAwMDAnXHJcblx0XHRzdHJva2VPcGFjaXR5OiAwLjhcclxuXHRcdHN0cm9rZVdlaWdodDogMlxyXG5cdFx0ZmlsbENvbG9yOiAnI0ZGMDAwMCdcclxuXHRcdGZpbGxPcGFjaXR5OiAwLjFcclxuXHRcdG1hcDogZ21hcFxyXG5cdFx0Ym91bmRzOiB7XHJcblx0XHRcdG5vcnRoOiB0b3BfeFxyXG5cdFx0XHRzb3V0aDogYm90dG9tX3hcclxuXHRcdFx0ZWFzdDogdG9wX3lcclxuXHRcdFx0d2VzdDogYm90dG9tX3lcclxuXHRcdH1cclxuXHR9KSMjI1xyXG5cclxuXHRhZGREcmFnQ29udHJvbChvcHRzKVxyXG5cdGFkZFBhbm9yYW1hQ29udHJvbCgpXHJcblxyXG5cclxuYWRkRHJhZ0NvbnRyb2wgPSAob3B0cykgLT5cclxuXHJcblx0dG9wX3ggPSBwYXJzZUZsb2F0IG9wdHMucXVlc3QuYm9yZGVyX2xlZnRfdG9wX3hcclxuXHR0b3BfeSA9IHBhcnNlRmxvYXQgb3B0cy5xdWVzdC5ib3JkZXJfbGVmdF90b3BfeVxyXG5cdGJvdHRvbV94ID0gcGFyc2VGbG9hdCBvcHRzLnF1ZXN0LmJvcmRlcl9yaWdodF9ib3R0b21feFxyXG5cdGJvdHRvbV95ID0gcGFyc2VGbG9hdCBvcHRzLnF1ZXN0LmJvcmRlcl9yaWdodF9ib3R0b21feVxyXG5cclxuXHQjIyNnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lciBnbWFwLCAnZHJhZ2VuZCcsIC0+XHJcblxyXG5cdFx0eCA9IGdtYXAuZ2V0Q2VudGVyKCkubGF0KClcclxuXHRcdHkgPSBnbWFwLmdldENlbnRlcigpLmxuZygpXHJcblxyXG5cclxuXHRcdGlmIHkgPCB0b3BfeSB0aGVuIHkgPSB0b3BfeVxyXG5cdFx0aWYgeSA+IGJvdHRvbV95IHRoZW4geSA9IGJvdHRvbV95XHJcblx0XHRpZiB4IDwgYm90dG9tX3ggdGhlbiB4ID0gYm90dG9tX3hcclxuXHRcdGlmIHggPiB0b3BfeCB0aGVuIHggPSB0b3BfeFxyXG5cclxuXHRcdGdtYXAuc2V0Q2VudGVyKG5ldyBnb29nbGUubWFwcy5MYXRMbmcoeCx5KSkjIyNcclxuXHJcbmFkZFBhbm9yYW1hQ29udHJvbCA9IC0+XHJcblx0cGFub3JhbWEgPSBnbWFwLmdldFN0cmVldFZpZXcoKVxyXG5cclxuXHRjaGVja1BvaW50c1Zpc2liaWxpdHkgPSAtPlxyXG5cdFx0aWYgIXRlc3RpbmdcclxuXHRcdFx0cGxhdCA9IHBhbm9yYW1hLmdldFBvc2l0aW9uKCkubGF0KClcclxuXHRcdFx0cGxvbiA9IHBhbm9yYW1hLmdldFBvc2l0aW9uKCkubG5nKClcclxuXHRcdFx0Zm9yIHBvaW50IGluIFBvaW50cy5nZXRDaGVja3BvaW50cygpXHJcblx0XHRcdFx0aWYgTWF0aC5hYnMocGxhdC1wb2ludC5wb3NpdGlvbi5sYXQoKSkgPCB2aXNpYmxlRGlzdCAmJiBNYXRoLmFicyhwbG9uLXBvaW50LnBvc2l0aW9uLmxuZygpKSA8IHZpc2libGVEaXN0XHJcblx0XHRcdFx0XHRwb2ludC5zZXRWaXNpYmxlIHRydWVcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRwb2ludC5zZXRWaXNpYmxlIGZhbHNlXHJcblx0XHRcdGZvciBwb2ludCBpbiBDcmFja2Vycy5nZXRDcmFja2VycygpXHJcblx0XHRcdFx0aWYgTWF0aC5hYnMocGxhdC1wb2ludC5wb3NpdGlvbi5sYXQoKSkgPCB2aXNpYmxlRGlzdCAmJiBNYXRoLmFicyhwbG9uLXBvaW50LnBvc2l0aW9uLmxuZygpKSA8IHZpc2libGVEaXN0XHJcblx0XHRcdFx0XHRwb2ludC5zZXRWaXNpYmxlIHRydWVcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRwb2ludC5zZXRWaXNpYmxlIGZhbHNlXHJcblx0XHRcdGZvciBwb2ludCBpbiBNb25leS5nZXRNb25leSgpXHJcblx0XHRcdFx0aWYgTWF0aC5hYnMocGxhdC1wb2ludC5wb3NpdGlvbi5sYXQoKSkgPCB2aXNpYmxlRGlzdCAmJiBNYXRoLmFicyhwbG9uLXBvaW50LnBvc2l0aW9uLmxuZygpKSA8IHZpc2libGVEaXN0XHJcblx0XHRcdFx0XHRwb2ludC5zZXRWaXNpYmxlIHRydWVcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRwb2ludC5zZXRWaXNpYmxlIGZhbHNlXHJcblx0XHRcdGZvciBwb2ludCBpbiBQaXp6YXMuZ2V0UGl6emFzKClcclxuXHRcdFx0XHRpZiBNYXRoLmFicyhwbGF0LXBvaW50LnBvc2l0aW9uLmxhdCgpKSA8IHZpc2libGVEaXN0ICYmIE1hdGguYWJzKHBsb24tcG9pbnQucG9zaXRpb24ubG5nKCkpIDwgdmlzaWJsZURpc3RcclxuXHRcdFx0XHRcdHBvaW50LnNldFZpc2libGUgdHJ1ZVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHBvaW50LnNldFZpc2libGUgZmFsc2VcclxuXHJcblx0cGFub3JhbWEuYWRkTGlzdGVuZXIgJ3Zpc2libGVfY2hhbmdlZCcsICgpIC0+XHJcblx0XHRzdHJlZXRWaWV3ID0gcGFub3JhbWEuZ2V0VmlzaWJsZSgpXHJcblx0XHRjaGVja01hbmhpbnQoKVxyXG5cdFx0c3RyZWV0VmlldyA9IHRydWUgaWYgdGVzdGluZ1xyXG5cdFx0Zm9yIHBvaW50IGluIFBvaW50cy5nZXRDaGVja3BvaW50cygpXHJcblx0XHRcdHBvaW50LnNldFZpc2libGUgc3RyZWV0Vmlld1xyXG5cdFx0Zm9yIHBvaW50IGluIENyYWNrZXJzLmdldENyYWNrZXJzKClcclxuXHRcdFx0cG9pbnQuc2V0VmlzaWJsZSBzdHJlZXRWaWV3XHJcblx0XHRmb3IgcG9pbnQgaW4gTW9uZXkuZ2V0TW9uZXkoKVxyXG5cdFx0XHRwb2ludC5zZXRWaXNpYmxlIHN0cmVldFZpZXdcclxuXHRcdGZvciBwb2ludCBpbiBQaXp6YXMuZ2V0UGl6emFzKClcclxuXHRcdFx0cG9pbnQuc2V0VmlzaWJsZSBzdHJlZXRWaWV3XHJcblx0XHRjaGVja1BvaW50c1Zpc2liaWxpdHkoKSBpZiBzdHJlZXRWaWV3XHJcblxyXG5cdHBhbm9yYW1hLmFkZExpc3RlbmVyICdwb3NpdGlvbl9jaGFuZ2VkJywgKCkgLT5cclxuXHRcdGNoZWNrUG9pbnRzVmlzaWJpbGl0eSgpIGlmIHBhbm9yYW1hLmdldFZpc2libGUoKVxyXG5cdFx0TW9uZXkubW92ZUhhbmRsZXIoKVxyXG5cclxuXHRjaGVja01hbmhpbnQgPSAtPlxyXG5cdFx0aWYgcGFub3JhbWEuZ2V0VmlzaWJsZSgpXHJcblx0XHRcdCQoJy5xdWVzdF9fbWFuaGludCcpLmFkZENsYXNzKCdxdWVzdF9fbWFuaGludC0taW52aXMnKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHQkKCcucXVlc3RfX21hbmhpbnQnKS5yZW1vdmVDbGFzcygncXVlc3RfX21hbmhpbnQtLWludmlzJylcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5nZXRNYXAgPSAtPlxyXG5cdHJldHVybiBnbWFwXHJcbm1vZHVsZS5leHBvcnRzLmdldFBhbm9yYW1hID0gLT5cclxuXHRyZXR1cm4gcGFub3JhbWFcclxuXHJcbiIsIk1hcCA9IHJlcXVpcmUgJy4vbWFwLmNvZmZlZSdcclxucmVxdWVzdCA9IHJlcXVpcmUgJy4uL3JlcXVlc3QnXHJcbnBvcHVwcyA9IHJlcXVpcmUgJy4uL3BvcHVwcydcclxua2V5cyA9IHJlcXVpcmUgJy4uL3Rvb2xzL2tleXMuY29mZmVlJ1xyXG5cclxubW9uZXkgPSBbXVxyXG5tb25leURpc3QgPSAwLjAwMTVcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5hZGRNb25leSA9IChwb2ludHMpIC0+XHJcblx0Y29uc29sZS5sb2cgcG9pbnRzXHJcblx0Zm9yIHBvaW50IGluIHBvaW50cyB3aGVuIHBvaW50P1xyXG5cdFx0bGF0ID0gcGFyc2VGbG9hdCBwb2ludC5sYXRcclxuXHRcdGxvbiA9IHBhcnNlRmxvYXQgcG9pbnQubG9uXHJcblx0XHRuZXdQb2ludCA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xyXG5cdFx0XHRwb3NpdGlvbjoge1xyXG5cdFx0XHRcdGxhdDogbGF0XHJcblx0XHRcdFx0bG5nOiBsb25cclxuXHRcdFx0fSxcclxuXHRcdFx0bWFwOiBNYXAuZ2V0TWFwKClcclxuXHRcdFx0aWNvbjogZ2V0SWNvbihwb2ludC5pbmZvLnN0YXR1cylcclxuXHRcdFx0dGl0bGU6ICfQlNC10L3RjNCz0Lgg0L3QsCDRgtC10LvQtdGE0L7QvSdcclxuXHRcdFx0dmlzaWJsZTogZmFsc2VcclxuXHRcdFx0b3JpZ0xhdDogcG9pbnQubGF0XHJcblx0XHRcdG9yaWdMbmc6IHBvaW50LmxvblxyXG5cdFx0XHRpbmZvOiBwb2ludC5pbmZvXHJcblx0XHR9KVxyXG5cdFx0bmV3UG9pbnQuYWRkTGlzdGVuZXIgJ2NsaWNrJywgbW9uZXlDbGlja0hhbmRsZXJcclxuXHRcdG1vbmV5LnB1c2ggbmV3UG9pbnRcclxuXHJcbmdldEljb24gPSAoc3RhdHVzKSAtPlxyXG5cdHJldHVybiBcIi4vaW1nL2ltYWdlcy9tb25leS5wbmdcIiBpZiArc3RhdHVzPT0wXHJcblx0cmV0dXJuIFwiLi9pbWcvaW1hZ2VzL21vbmV5LXVzZWQucG5nXCIgaWYgK3N0YXR1cz09MVxyXG5cdHJldHVybiBcIi4vaW1nL2ltYWdlcy9tb25leS11c2VkLnBuZ1wiIGlmICtzdGF0dXM9PTJcclxuXHJcbnNldFN0YXR1cyA9IChwb2ludCwgc3RhdHVzKSAtPlxyXG5cdHBvaW50LmluZm8uc3RhdHVzID0gMVxyXG5cdHBvaW50LnNldEljb24gZ2V0SWNvbigxKVxyXG5cdHJldHVybiBwb2ludFxyXG5cclxubW9kdWxlLmV4cG9ydHMubW92ZUhhbmRsZXIgPSAtPlxyXG5cdGlmIG1vbmV5Lmxlbmd0aD4wXHJcblx0XHRpZiArbW9uZXlbMF0uaW5mby5zdGF0dXMgPT0gMSB8fCArbW9uZXlbMF0uaW5mby5zdGF0dXMgPT0gMlxyXG5cdFx0XHRyZXR1cm5cclxuXHRwbGF0ID0gTWFwLmdldFBhbm9yYW1hKCkuZ2V0UG9zaXRpb24oKS5sYXQoKVxyXG5cdHBsb24gPSBNYXAuZ2V0UGFub3JhbWEoKS5nZXRQb3NpdGlvbigpLmxuZygpXHJcblxyXG5cdHZpcyA9IGZhbHNlXHJcblx0Zm9yIHBvaW50LGkgaW4gbW9uZXlcclxuXHRcdGRvIChpKSAtPlxyXG5cdFx0XHRjb25zb2xlLmxvZyBwb2ludC5wb3NpdGlvbi5sYXQoKVxyXG5cdFx0XHRpZiBNYXRoLmFicyhwbGF0LXBvaW50LnBvc2l0aW9uLmxhdCgpKSA8IG1vbmV5RGlzdCAmJiBNYXRoLmFicyhwbG9uLXBvaW50LnBvc2l0aW9uLmxuZygpKSA8IG1vbmV5RGlzdFxyXG5cdFx0XHRcdGNvbnNvbGUubG9nIFwibmVhciBtb25leVwiXHJcblx0XHRcdFx0cmVxdWVzdC5nYW1lLmNoZWNrTW9uZXkge30sIChyZXMpIC0+XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyByZXNcclxuXHRcdFx0XHRcdGlmIHJlcy5yZXN1bHQgPT0gZmFsc2VcclxuXHRcdFx0XHRcdFx0I3BvaW50LnNldFZpc2libGUgZmFsc2VcclxuXHRcdFx0XHRcdFx0I2NvbnNvbGUubG9nIG1vbmV5XHJcblx0XHRcdFx0XHRcdCNjb25zb2xlLmxvZyBpXHJcblx0XHRcdFx0XHRcdCNtb25leS5zcGxpY2UoaSwxKVxyXG5cdFx0XHRcdFx0XHQjY29uc29sZS5sb2cgbW9uZXlcclxuXHRcdFx0XHRcdFx0cG9pbnQgPSBzZXRTdGF0dXMocG9pbnQsIDEpXHJcblxyXG5cclxubW9uZXlDbGlja0hhbmRsZXIgPSAoZSkgLT5cclxuXHRjb25zb2xlLmxvZyB0aGlzXHJcblx0cmV0dXJuIGlmICt0aGlzLmluZm8uc3RhdHVzID09IDEgfHwgK3RoaXMuaW5mby5zdGF0dXMgPT0gMlxyXG5cdGluZGV4ID0gbW9uZXkuaW5kZXhPZih0aGlzKVxyXG5cdGNvbnNvbGUubG9nIGluZGV4XHJcblx0bGF0ID0gdGhpcy5vcmlnTGF0XHJcblx0bG9uID0gdGhpcy5vcmlnTG5nXHJcblx0aW5mbyA9IHRoaXMuaW5mb1xyXG5cdHJlcXVlc3QuZ2FtZS5nZXRQb2ludCB7bGF0OiBsYXQsIGxvbjogbG9ufSwgKHJlcykgLT5cclxuXHRcdGNvbnNvbGUubG9nIHJlc1xyXG5cdFx0aWYgcmVzLnJlc3VsdCA9PSBcInN1Y2Nlc3NcIlxyXG5cdFx0XHRjYXB0dXJlTW9uZXkoaW5kZXgsIHJlcylcclxuXHRcdFx0cG9wdXBzLm9wZW5Nb2RhbCAnbW9uZXknLCB7cmVzOlwib2tcIn1cclxuXHRcdGlmIHJlcy5yZXN1bHQgPT0gXCJlcnJvclwiXHJcblx0XHRcdG1vbmV5W2luZGV4XSA9IHNldFN0YXR1cyhtb25leVtpbmRleF0sIDEpXHJcblx0XHRcdHBvcHVwcy5vcGVuTW9kYWwgJ21vbmV5Jywge3JlczpcImZhaWxcIn1cclxuXHJcbmNhcHR1cmVNb25leSA9IChpbmRleCwgcmVzKSAtPlxyXG5cdGtleXMuc2V0SGFzaChyZXMuaGFzaClcclxuXHRtb25leVtpbmRleF0gPSBzZXRTdGF0dXMobW9uZXlbaW5kZXhdLCAxKVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzLmdldE1vbmV5ID0gLT5cclxuXHRyZXR1cm4gbW9uZXlcclxuIiwiTWFwID0gcmVxdWlyZSAnLi9tYXAuY29mZmVlJ1xyXG5yZXF1ZXN0ID0gcmVxdWlyZSAnLi4vcmVxdWVzdCdcclxucm91dGUgPSByZXF1aXJlICcuL3JvdXRlLmNvZmZlZSdcclxucG9wdXBzID0gcmVxdWlyZSAnLi4vcG9wdXBzJ1xyXG5rZXlzID0gcmVxdWlyZSAnLi4vdG9vbHMva2V5cy5jb2ZmZWUnXHJcblxyXG5jaGVja3BvaW50cyA9IFtdXHJcbmN1cnJlbnRQb2ludCA9IDBcclxuY3VySGludCA9IHtcclxuXHR0eXBlIDogXCJcIlxyXG5cdGluZm8gOiB7fVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5wb2ludENsaWNrSGFuZGxlciA9IChlKSAtPlxyXG5cdGluZGV4ID0gY2hlY2twb2ludHMuaW5kZXhPZih0aGlzKVxyXG5cdGNvbnNvbGUubG9nIGluZGV4XHJcblx0bGF0ID0gdGhpcy5vcmlnTGF0XHJcblx0bG9uID0gdGhpcy5vcmlnTG5nXHJcblx0aW5mbyA9IHRoaXMuaW5mb1xyXG5cdHJlcXVlc3QuZ2FtZS5nZXRQb2ludCB7bGF0OiBsYXQsIGxvbjogbG9ufSwgKHJlcykgLT5cclxuXHRcdGNvbnNvbGUubG9nIHJlc1xyXG5cdFx0aWYgcmVzLmFjaGlldmVtZW50cyAmJiByZXMuYWNoaWV2ZW1lbnRzLmxlbmd0aD4wXHJcblx0XHRcdGZvciBhY2h2X2lkIGluIHJlcy5hY2hpZXZlbWVudHNcclxuXHRcdFx0XHRwb3B1cHMub3Blbk1vZGFsKCdhY2hpZXZlJywge2lkOmFjaHZfaWR9KVxyXG5cdFx0Y2FwdHVyZVBvaW50KGluZGV4LCBpbmZvLCByZXMpIGlmIHJlcy5yZXN1bHQgPT0gXCJzdWNjZXNzXCJcclxuXHJcblxyXG5cclxuY2FwdHVyZVBvaW50ID0gKGluZGV4LCBpbmZvLCByZXMpIC0+XHJcblx0cm91dGUucmVuZGVyUm91dGUoe1xyXG5cdFx0Y3VycmVudDogaW5kZXgrMlxyXG5cdFx0YWxsTnVtOiBjaGVja3BvaW50cy5sZW5ndGhcclxuXHR9KVxyXG5cdGtleXMuc2V0SGFzaChyZXMuaGFzaClcclxuXHRjdXJIaW50ID0ge3R5cGU6IFwiY2hlY2twb2ludFwiLCBpbmZvOiBpbmZvfVxyXG5cdHBvcHVwcy5vcGVuTW9kYWwoXCJjaGVja3BvaW50XCIsIGluZm8pXHJcblx0Y2hlY2twb2ludHNbaW5kZXhdLmluZm8uc3RhdHVzID0gMFxyXG5cdGNoZWNrcG9pbnRzW2luZGV4KzFdLmluZm8uc3RhdHVzID0gMSBpZiBpbmRleCsxIDwgY2hlY2twb2ludHMubGVuZ3RoXHJcblx0c2V0UG9pbnRJY29uKGNoZWNrcG9pbnRzW2luZGV4XSlcclxuXHRzZXRQb2ludEljb24oY2hlY2twb2ludHNbaW5kZXgrMV0pIGlmIGluZGV4KzEgPCBjaGVja3BvaW50cy5sZW5ndGhcclxuXHJcblxyXG5zZXRQb2ludEljb24gPSAocG9pbnQpIC0+XHJcblx0I2lmIHBvaW50LmluZm8uc3RhdHVzID09IDAgdGhlbiBwb2ludC5zZXRJY29uIHBvaW50LmltZ19wYXN0XHJcblx0I2lmIHBvaW50LmluZm8uc3RhdHVzID09IDAgdGhlbiBwb2ludC5zZXRJY29uICdodHRwOi8vd3d3LmVrc3BvLnNob3AuYnkvcGljcy9pdGVtcy9iYWxvbl8xMl9wb2thel9hLmpwZydcclxuXHRpZiBwb2ludC5pbmZvLnN0YXR1cyA9PSAwIHRoZW4gcG9pbnQuc2V0SWNvbiAnL2ltZy9pbWFnZXMvY2hlY2twb2ludC1wYXN0LnBuZydcclxuXHRpZiBwb2ludC5pbmZvLnN0YXR1cyA9PSAxIHRoZW4gcG9pbnQuc2V0SWNvbiBwb2ludC5pbWdfY3VycmVudFxyXG5cdCNpZiBwb2ludC5pbmZvLnN0YXR1cyA9PSAxIHRoZW4gcG9pbnQuc2V0SWNvbiAnaHR0cDovLzYwLmltZy5hdml0by5zdC8xNDB4MTA1LzUyMTU5OTI2MC5qcGcnXHJcblx0aWYgcG9pbnQuaW5mby5zdGF0dXMgPT0gMiB0aGVuIHBvaW50LnNldEljb24gcG9pbnQuaW1nX2Z1dHVyZVxyXG5cdCNpZiBwb2ludC5pbmZvLnN0YXR1cyA9PSAyIHRoZW4gcG9pbnQuc2V0SWNvbiBcImh0dHA6Ly9pbWcudHJhZGVpbmRpYS5jb20vZnAvMS8wMDEvMDI5LzA0NC5qcGdcIlxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzLmFkZENoZWNrcG9pbnRzID0gKHBvaW50cykgLT5cclxuXHRjb25zb2xlLmxvZyBwb2ludHNcclxuXHRmb3IgcG9pbnQgaW4gcG9pbnRzIHdoZW4gcG9pbnQ/XHJcblx0XHRsYXQgPSBwYXJzZUZsb2F0IHBvaW50LmxhdFxyXG5cdFx0bG9uID0gcGFyc2VGbG9hdCBwb2ludC5sb25cclxuXHRcdG5ld1BvaW50ID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcblx0XHRcdHBvc2l0aW9uOiB7XHJcblx0XHRcdFx0bGF0OiBsYXRcclxuXHRcdFx0XHRsbmc6IGxvblxyXG5cdFx0XHR9LFxyXG5cdFx0XHRtYXA6IE1hcC5nZXRNYXAoKVxyXG5cdFx0XHQjaWNvbjogcG9pbnQuaW1nXHJcblx0XHRcdHRpdGxlOiAn0KfQtdC60L/QvtC40L3RgidcclxuXHRcdFx0dmlzaWJsZTogZmFsc2VcclxuXHRcdFx0b3JpZ0xhdDogcG9pbnQubGF0XHJcblx0XHRcdG9yaWdMbmc6IHBvaW50LmxvblxyXG5cdFx0XHRpbWdfY3VycmVudDogcG9pbnQuaW1nX2N1cnJlbnRcclxuXHRcdFx0aW1nX3Bhc3Q6IHBvaW50LmltZ19wYXN0XHJcblx0XHRcdGltZ19mdXR1cmU6IHBvaW50LmltZ19mdXR1cmVcclxuXHRcdFx0aW5mbzogcG9pbnQuaW5mb1xyXG5cdFx0fSlcclxuXHRcdHNldFBvaW50SWNvbihuZXdQb2ludClcclxuXHRcdG5ld1BvaW50LmFkZExpc3RlbmVyICdjbGljaycsIHBvaW50Q2xpY2tIYW5kbGVyXHJcblx0XHRjaGVja3BvaW50cy5wdXNoIG5ld1BvaW50XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5zaG93Rmlyc3RQb3B1cCA9IChvYmopIC0+XHJcblx0aW5mbyA9IHt9XHJcblx0aW5mby50aXRsZSA9IG9iai5xdWVzdC5uYW1lXHJcblx0aW5mby5kZXNjcmlwdGlvbiA9IG9iai5xdWVzdC5kZXNjcmlwdGlvblxyXG5cdGluZm8uaW1hZ2VfaGludCA9IG9iai5xdWVzdC5oaW50LmltYWdlXHJcblx0aW5mby5oaW50ID0gb2JqLnF1ZXN0LmhpbnQuZGVzY3JpcHRpb25cclxuXHRjdXJIaW50ID0ge3R5cGU6IFwiZ2FtZWVudGVyXCIsIGluZm86IGluZm99XHJcblx0cG9wdXBzLm9wZW5Nb2RhbCBcImdhbWVlbnRlclwiLCBpbmZvXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5maW5kQ3VycmVudFBvaW50ID0gKGFycikgLT5cclxuXHRmb3IgcCwgaSBpbiBhcnJcclxuXHRcdGlmIHAuaW5mby5zdGF0dXMgPT0gMVxyXG5cdFx0XHRjdXJyZW50UG9pbnQgPSBpXHJcblx0XHRcdHJvdXRlLnJlbmRlclJvdXRlKHtcclxuXHRcdFx0XHRjdXJyZW50OiBjdXJyZW50UG9pbnQrMVxyXG5cdFx0XHRcdGFsbE51bTogY2hlY2twb2ludHMubGVuZ3RoXHJcblx0XHRcdH0pXHJcblx0XHRcdHJldHVyblxyXG5cdHJvdXRlLnJlbmRlclJvdXRlKHtcclxuXHRcdGN1cnJlbnQ6IGNoZWNrcG9pbnRzLmxlbmd0aCsxXHJcblx0XHRhbGxOdW06IGNoZWNrcG9pbnRzLmxlbmd0aFxyXG5cdH0pXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMuZ2V0Q2hlY2twb2ludHMgPSAtPlxyXG5cdHJldHVybiBjaGVja3BvaW50c1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzLnNob3dQcmV2UG9wdXAgPSAtPlxyXG5cdHBvcHVwcy5vcGVuTW9kYWwgY3VySGludC50eXBlLCBjdXJIaW50LmluZm8iLCJ0ZW1wbGF0ZSA9IHJlcXVpcmUgXCIuL3JvdXRlLmphZGVcIlxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzLnJlbmRlclJvdXRlID0gKG9wdHMpIC0+XHJcblx0IyBjdXJyZW50UG9pbnRzIG51bWJlciBzdGFydHMgZnJvbSAxXHJcblx0b3B0cyA9IG9wdHMgfHwge31cclxuXHRvcHRzLmFsbE51bSA9IDEgaWYgb3B0cy5hbGxOdW0gPCAxXHJcblx0b3B0cy5jdXJyZW50ID0gMSBpZiBvcHRzLmN1cnJlbnQgPCAxXHJcblx0JCgnLnF1ZXN0X19yb3V0ZV9fZm9ybG9hZGluZycpLmh0bWwgdGVtcGxhdGUge29wdHM6IG9wdHN9IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAob3B0cykge1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJxdWVzdF9fcm91dGUgcm91dGVcXFwiPjxkaXYgY2xhc3M9XFxcInJvdXRlX19saXN0XFxcIj5cIik7XG52YXIgbiA9IDFcbndoaWxlIChuIDwgb3B0cy5jdXJyZW50KVxue1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJyb3V0ZV9faXRlbVxcXCI+PC9kaXY+XCIpO1xubisrXG59XG5pZiAoIG4gPD0gb3B0cy5hbGxOdW0pXG57XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcInJvdXRlX19pdGVtIHJvdXRlX19pdGVtLS1hY3RpdmVcXFwiPjwvZGl2PlwiKTtcbn1cbndoaWxlIChuIDwgb3B0cy5hbGxOdW0pXG57XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcInJvdXRlX19pdGVtIHJvdXRlX19pdGVtLS1pbmFjdGl2ZVxcXCI+PC9kaXY+XCIpO1xubisrXG59XG5idWYucHVzaChcIjwvZGl2PlwiKTtcbmlmICggb3B0cy5jdXJyZW50Pm9wdHMuYWxsTnVtKVxue1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJyb3V0ZV9fdGV4dFxcXCI+0JLRgdC1INGC0L7Rh9C60Lgg0L/RgNC+0LnQtNC10L3RizwvZGl2PlwiKTtcbn1cbmVsc2VcbntcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwicm91dGVfX3RleHRcXFwiPtCi0LLQvtC5INC80LDRgNGI0YDRg9GCPC9kaXY+XCIpO1xufVxuYnVmLnB1c2goXCI8L2Rpdj5cIik7fS5jYWxsKHRoaXMsXCJvcHRzXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5vcHRzOnR5cGVvZiBvcHRzIT09XCJ1bmRlZmluZWRcIj9vcHRzOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsIk1hcCA9IHJlcXVpcmUgJy4vbWFwLmNvZmZlZSdcclxucmVxdWVzdCA9IHJlcXVpcmUgJy4uL3JlcXVlc3QnXHJcbnJvdXRlID0gcmVxdWlyZSAnLi9yb3V0ZS5jb2ZmZWUnXHJcbnBvcHVwcyA9IHJlcXVpcmUgJy4uL3BvcHVwcydcclxua2V5cyA9IHJlcXVpcmUgJy4uL3Rvb2xzL2tleXMuY29mZmVlJ1xyXG5cclxucGl6emFzID0gW11cclxuY3VycmVudFBvaW50ID0gMFxyXG5jdXJIaW50ID0ge1xyXG5cdHR5cGUgOiBcIlwiXHJcblx0aW5mbyA6IHt9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5waXp6YUNsaWNrSGFuZGxlciA9IChlKSAtPlxyXG5cdGluZGV4ID0gcGl6emFzLmluZGV4T2YodGhpcylcclxuXHRyZXR1cm4gaWYgcGFyc2VJbnQodGhpcy5pbmZvLnN0YXR1cykgPT0gMlxyXG5cdGxhdCA9IHRoaXMub3JpZ0xhdFxyXG5cdGxvbiA9IHRoaXMub3JpZ0xuZ1xyXG5cdGluZm8gPSB0aGlzLmluZm9cclxuXHRyZXF1ZXN0LmdhbWUuZ2V0UG9pbnQge2xhdDogbGF0LCBsb246IGxvbn0sIChyZXMpIC0+XHJcblx0XHRjb25zb2xlLmxvZyByZXNcclxuXHRcdGlmIHJlcy5hY2hpZXZlbWVudHMgJiYgcmVzLmFjaGlldmVtZW50cy5sZW5ndGg+MFxyXG5cdFx0XHRmb3IgYWNodl9pZCBpbiByZXMuYWNoaWV2ZW1lbnRzXHJcblx0XHRcdFx0cG9wdXBzLm9wZW5Nb2RhbCgnYWNoaWV2ZScsIHtpZDphY2h2X2lkfSlcclxuXHRcdGNhcHR1cmVQaXp6YShpbmRleCwgaW5mbywgcmVzKSBpZiByZXMucmVzdWx0ID09IFwic3VjY2Vzc1wiXHJcblxyXG5cclxuXHJcbmNhcHR1cmVQaXp6YSA9IChpbmRleCwgaW5mbywgcmVzKSAtPlxyXG5cdGtleXMuc2V0SGFzaChyZXMuaGFzaClcclxuXHRjdXJIaW50ID0ge3R5cGU6IFwiY2hlY2twb2ludFwiLCBpbmZvOiBpbmZvfVxyXG5cdHBpenphc1tpbmRleF0uaW5mby5zdGF0dXMgPSAyXHJcblx0c2V0UG9pbnRJY29uKHBpenphc1tpbmRleF0pXHJcblx0cG9wdXBzLm9wZW5Nb2RhbCgncGl6emEnKVxyXG5cclxuc2V0UG9pbnRJY29uID0gKHBvaW50KSAtPlxyXG5cdGNvbnNvbGUubG9nIHBvaW50XHJcblx0I2lmIHBvaW50LmluZm8uc3RhdHVzID09IDAgdGhlbiBwb2ludC5zZXRJY29uIHBvaW50LmltZ19wYXN0XHJcblx0I2lmIHBvaW50LmluZm8uc3RhdHVzID09IDAgdGhlbiBwb2ludC5zZXRJY29uICdodHRwOi8vd3d3LmVrc3BvLnNob3AuYnkvcGljcy9pdGVtcy9iYWxvbl8xMl9wb2thel9hLmpwZydcclxuXHRpZiBwb2ludC5pbmZvLnN0YXR1cyA9PSAyIHRoZW4gcG9pbnQuc2V0SWNvbiBwb2ludC5pbWdfcGFzdFxyXG5cdGlmIHBvaW50LmluZm8uc3RhdHVzID09IDAgdGhlbiBwb2ludC5zZXRJY29uIHBvaW50LmltZ19jdXJyZW50XHJcblx0I2lmIHBvaW50LmluZm8uc3RhdHVzID09IDEgdGhlbiBwb2ludC5zZXRJY29uICdodHRwOi8vNjAuaW1nLmF2aXRvLnN0LzE0MHgxMDUvNTIxNTk5MjYwLmpwZydcclxuXHQjaWYgcG9pbnQuaW5mby5zdGF0dXMgPT0gMiB0aGVuIHBvaW50LnNldEljb24gXCJodHRwOi8vaW1nLnRyYWRlaW5kaWEuY29tL2ZwLzEvMDAxLzAyOS8wNDQuanBnXCJcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5hZGRQaXp6YXMgPSAocG9pbnRzKSAtPlxyXG5cdGNvbnNvbGUubG9nIHBvaW50c1xyXG5cdGZvciBwb2ludCBpbiBwb2ludHMgd2hlbiBwb2ludD9cclxuXHRcdGxhdCA9IHBhcnNlRmxvYXQgcG9pbnQubGF0XHJcblx0XHRsb24gPSBwYXJzZUZsb2F0IHBvaW50LmxvblxyXG5cdFx0bmV3UG9pbnQgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcclxuXHRcdFx0cG9zaXRpb246IHtcclxuXHRcdFx0XHRsYXQ6IGxhdFxyXG5cdFx0XHRcdGxuZzogbG9uXHJcblx0XHRcdH0sXHJcblx0XHRcdG1hcDogTWFwLmdldE1hcCgpXHJcblx0XHRcdCNpY29uOiBwb2ludC5pbWdcclxuXHRcdFx0dGl0bGU6ICfQn9C40YbRhtCwJ1xyXG5cdFx0XHR2aXNpYmxlOiBmYWxzZVxyXG5cdFx0XHRvcmlnTGF0OiBwb2ludC5sYXRcclxuXHRcdFx0b3JpZ0xuZzogcG9pbnQubG9uXHJcblx0XHRcdGltZ19jdXJyZW50OiBcIi4vaW1nL2ltYWdlcy90dWNwaXp6YS5wbmdcIlxyXG5cdFx0XHRpbWdfcGFzdDogXCIuL2ltZy9pbWFnZXMvdHVjcGl6emEtdXNlZC5wbmdcIlxyXG5cdFx0XHRpbmZvOiBwb2ludC5pbmZvXHJcblx0XHR9KVxyXG5cdFx0c2V0UG9pbnRJY29uKG5ld1BvaW50KVxyXG5cdFx0bmV3UG9pbnQuYWRkTGlzdGVuZXIgJ2NsaWNrJywgcGl6emFDbGlja0hhbmRsZXJcclxuXHRcdHBpenphcy5wdXNoIG5ld1BvaW50XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5nZXRQaXp6YXMgPSAtPlxyXG5cdHJldHVybiBwaXp6YXMiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uICh1c2VyKSB7XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcImhlYWRlcl9fcHJvZmlsZV9sZWZ0XFxcIj48aW1nXCIgKyAoamFkZS5hdHRyKFwic3JjXCIsIFwiXCIgKyAodXNlci5pbmZvLnBob3RvKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwiaGVhZGVyX19wcm9maWxlX3Bob3RvXFxcIi8+PC9kaXY+PGRpdiBjbGFzcz1cXFwiaGVhZGVyX19wcm9maWxlX19yaWdodFxcXCI+PGRpdiBjbGFzcz1cXFwiaGVhZGVyX19wcm9maWxlX19uYW1lXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSB1c2VyLm5pY2tuYW1lKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48ZGl2IGNsYXNzPVxcXCJoZWFkZXJfX3Byb2ZpbGVfX3Njb3Jlc1xcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gK3VzZXIuaW5mby5jdXJyZW50X3Njb3JlKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCIgLyBcIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSArdXNlci5pbmZvLmNvbW1vbl9zY29yZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PC9kaXY+PCEtLWkuaWNvbi1oZWFkZXItc2hhcmVidXQuaGVhZGVyX19zaGFyZWJ1dC0tPlwiKTt9LmNhbGwodGhpcyxcInVzZXJcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnVzZXI6dHlwZW9mIHVzZXIhPT1cInVuZGVmaW5lZFwiP3VzZXI6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwicmVxdWVzdCA9IHJlcXVpcmUoJy4uL3JlcXVlc3QnKVxyXG50ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vaGVhZGVyX19wcm9maWxlLmphZGUnKVxyXG5tZXNfaWNvbiA9IHJlcXVpcmUoJy4vbWVzc2VuZ2VyX19pY29uLmphZGUnKVxyXG5saW5rcyA9IHJlcXVpcmUoJy4uL3Rvb2xzL2xpbmtzLmNvZmZlZScpLmluaXQoKVxyXG5wb3B1cHMgPSByZXF1aXJlICcuLi9wb3B1cHMnXHJcbmFuYWwgPSByZXF1aXJlICcuLi90b29scy9hbmFsLmNvZmZlZSdcclxuXHJcbiQoJ2JvZHknKS5vbiAnY2xpY2snLCAnLmpzLW9wZW5Vc2VySW5mbycsIC0+XHJcblx0cG9wdXBzLm9wZW5Nb2RhbChcInVzZXJpbmZvXCIpXHJcblx0YW5hbC5zZW5kKCfQm9CaX9Cb0LjRh9C90YvQtdC00LDQvdC90YvQtScpXHJcbiQoJ2JvZHknKS5vbiAnY2xpY2snLCAnLmpzLW9wZW5NYWlsJywgLT5cclxuXHRwb3B1cHMub3Blbk1vZGFsIFwibWVzc2VuZ2VyXCJcclxuXHRhbmFsLnNlbmQoXCLQm9CaX9Ch0L7QvtCx0YnQtdC90LjQtVwiKVxyXG5cclxuJCgnLmpzLW9wZW5RdWVzdHNQYWdlJykub24gJ2NsaWNrJywgLT5cclxuXHRhbmFsLnNlbmQoXCLQnNC10L3Rjl/QmtCy0LXRgdGC0YtcIilcclxuXHJcbiQoJy5qcy1vcGVuUHJpemVzUGFnZScpLm9uICdjbGljaycsIC0+XHJcblx0YW5hbC5zZW5kKFwi0JzQtdC90Y5f0J/RgNC40LfRi1wiKVxyXG5cclxuJCgnLmpzLW9wZW5SdWxlc1BhZ2UnKS5vbiAnY2xpY2snLCAtPlxyXG5cdGFuYWwuc2VuZChcItCc0LXQvdGOX9Cf0YDQsNCy0LjQu9CwXCIpXHJcblxyXG4kKCcuanMtb3BlbldoYXRQYWdlJykub24gJ2NsaWNrJywgLT5cclxuXHRhbmFsLnNlbmQoXCLQnNC10L3Rjl/Qp9GC0L7Ql9CwVFVDP1wiKVxyXG5cclxucmVxdWVzdC51c2VyLmdldCB7fSwgKHJlcykgLT5cclxuXHRjb25zb2xlLmxvZyByZXNcclxuXHQkKFwiLmhlYWRlcl9fcHJvZmlsZVwiKS5odG1sIHRlbXBsYXRlIHt1c2VyOnJlc1swXSB9XHJcblx0cmVxdWVzdC5mZWVkYmFjay5nZXQge30sIChyZXMpIC0+XHJcblx0XHRjb25zb2xlLmxvZyByZXNcclxuXHRcdHVucmVhZHMgPSByZXMucmVkdWNlKChzdW0sbWVzKSA9PlxyXG5cdFx0XHRpZiBtZXMucmVhZD09MCB0aGVuIHJldHVybiBzdW0rMVxyXG5cdFx0XHRlbHNlIHJldHVybiBzdW1cclxuXHRcdCwwKVxyXG5cdFx0JCgnLm1lc3Nlbmdlcl9faWNvbi1mb3Jsb2FkaW5nJykuaHRtbCBtZXNfaWNvbih7dW5yZWFkczp1bnJlYWRzfSkiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uICh1bnJlYWRzKSB7XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9faWNvbiBoZWFkZXJfX21haWxsb2dvIGpzLW9wZW5NYWlsXFxcIj48aSBjbGFzcz1cXFwiaWNvbi1oZWFkZXItbWFpbFxcXCI+PC9pPlwiKTtcbmlmICggdW5yZWFkcz4wKVxue1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJfX3VucmVhZHMtaWNvblxcXCI+PHNwYW4gY2xhc3M9XFxcIm1lc3Nlbmdlcl9fdW5yZWFkcy12YWxcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IHVucmVhZHMpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvc3Bhbj48L2Rpdj5cIik7XG59XG5idWYucHVzaChcIjwvZGl2PlwiKTt9LmNhbGwodGhpcyxcInVucmVhZHNcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnVucmVhZHM6dHlwZW9mIHVucmVhZHMhPT1cInVuZGVmaW5lZFwiP3VucmVhZHM6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidGVtcGxhdGUgPSByZXF1aXJlKCcuL2FjaGlldmUuamFkZScpXHJcbnZrID0gcmVxdWlyZSAnLi4vdG9vbHMvdmsuY29mZmVlJ1xyXG5yZXF1ZXN0ID0gcmVxdWlyZSAnLi4vcmVxdWVzdCdcclxuY29udGFpbmVyX2lkID0gMFxyXG5cclxuYWNoaWV2ZV9pZCA9IDBcclxuXHJcbmFjaHZzID0gcmVxdWlyZSAnLi4vdG9vbHMvYWNodkRhdGEuY29mZmVlJ1xyXG5cclxuREFUQSA9IFtcclxuXHR7XHJcblx0XHRpZDogMFxyXG5cdFx0aWNvbjogXCJpbWcvaW1hZ2VzL2FjaGlldmVzL2kwLnBuZ1wiXHJcblx0XHR0aXRsZTogXCLQn9C10YDQstGL0Lkg0L/QvtGI0ZHQu1wiXHJcblx0XHR0ZXh0OiBcItCf0L7QtNC10LvQuNGB0Ywg0LDRh9C40LLQutC+0Lkg0YEg0LTRgNGD0LfRjNGP0LzQuCDQuCDQv9C+0LvRg9GH0LggNTAg0LHQvtC90YPRgdC90YvRhSDQsdCw0LvQu9C+0LIuXCJcclxuXHR9XHJcblx0e1xyXG5cdFx0aWQ6IDFcclxuXHRcdGljb246IFwiaW1nL2ltYWdlcy9hY2hpZXZlcy9pMS5wbmdcIlxyXG5cdFx0dGl0bGU6IFwi0KPQv9GR0YDRgtGL0LlcIlxyXG5cdFx0dGV4dDogXCLQn9C+0LTQtdC70LjRgdGMINCw0YfQuNCy0LrQvtC5INGBINC00YDRg9C30YzRj9C80Lgg0Lgg0L/QvtC70YPRh9C4IDUwINCx0L7QvdGD0YHQvdGL0YUg0LHQsNC70LvQvtCyLlwiXHJcblx0fVxyXG5cdHtcclxuXHRcdGlkOiAyXHJcblx0XHRpY29uOiBcImltZy9pbWFnZXMvYWNoaWV2ZXMvaTIucG5nXCJcclxuXHRcdHRpdGxlOiBcItCU0LDQuSDQv9GP0YLRjCFcIlxyXG5cdFx0dGV4dDogXCLQn9C+0LTQtdC70LjRgdGMINCw0YfQuNCy0LrQvtC5INGBINC00YDRg9C30YzRj9C80Lgg0Lgg0L/QvtC70YPRh9C4IDUwINCx0L7QvdGD0YHQvdGL0YUg0LHQsNC70LvQvtCyLlwiXHJcblx0fVxyXG5cdHtcclxuXHRcdGlkOiAzXHJcblx0XHRpY29uOiBcImltZy9pbWFnZXMvYWNoaWV2ZXMvaTMucG5nXCJcclxuXHRcdHRpdGxlOiBcItCa0YDQsNGB0LDQstGH0LjQulwiXHJcblx0XHR0ZXh0OiBcItCf0L7QtNC10LvQuNGB0Ywg0LDRh9C40LLQutC+0Lkg0YEg0LTRgNGD0LfRjNGP0LzQuCDQuCDQv9C+0LvRg9GH0LggNTAg0LHQvtC90YPRgdC90YvRhSDQsdCw0LvQu9C+0LIuXCJcclxuXHR9XHJcblx0e1xyXG5cdFx0aWQ6IDRcclxuXHRcdGljb246IFwiaW1nL2ltYWdlcy9hY2hpZXZlcy9pNC5wbmdcIlxyXG5cdFx0dGl0bGU6IFwi0J/RgNC40YjRkdC7INC6INGD0YHQv9C10YXRg1wiXHJcblx0XHR0ZXh0OiBcItCf0L7QtNC10LvQuNGB0Ywg0LDRh9C40LLQutC+0Lkg0YEg0LTRgNGD0LfRjNGP0LzQuCDQuCDQv9C+0LvRg9GH0LggNTAg0LHQvtC90YPRgdC90YvRhSDQsdCw0LvQu9C+0LIuXCJcclxuXHR9XHJcblx0e1xyXG5cdFx0aWQ6IDVcclxuXHRcdGljb246IFwiaW1nL2ltYWdlcy9hY2hpZXZlcy9pNS5wbmdcIlxyXG5cdFx0dGl0bGU6IFwi0JPQvtGA0L7QtNGB0LrQsNGPINC70LXQs9C10L3QtNCwXCJcclxuXHRcdHRleHQ6IFwi0J/QvtC00LXQu9C40YHRjCDQsNGH0LjQstC60L7QuSDRgSDQtNGA0YPQt9GM0Y/QvNC4INC4INC/0L7Qu9GD0YfQuCA1MCDQsdC+0L3Rg9GB0L3Ri9GFINCx0LDQu9C70L7Qsi5cIlxyXG5cdH1cclxuXHR7XHJcblx0XHRpZDogNlxyXG5cdFx0aWNvbjogXCJpbWcvaW1hZ2VzL2FjaGlldmVzL2k2LnBuZ1wiXHJcblx0XHR0aXRsZTogXCLQktC10YDQsdC+0LLRidC40LpcIlxyXG5cdFx0dGV4dDogXCLQn9C+0LTQtdC70LjRgdGMINCw0YfQuNCy0LrQvtC5INGBINC00YDRg9C30YzRj9C80Lgg0Lgg0L/QvtC70YPRh9C4IDUwINCx0L7QvdGD0YHQvdGL0YUg0LHQsNC70LvQvtCyLlwiXHJcblx0fVxyXG5cdHtcclxuXHRcdGlkOiA3XHJcblx0XHRpY29uOiBcImltZy9pbWFnZXMvYWNoaWV2ZXMvaTcucG5nXCJcclxuXHRcdHRpdGxlOiBcItCT0LjQv9C90L7QttCw0LHQsFwiXHJcblx0XHR0ZXh0OiBcItCf0L7QtNC10LvQuNGB0Ywg0LDRh9C40LLQutC+0Lkg0YEg0LTRgNGD0LfRjNGP0LzQuCDQuCDQv9C+0LvRg9GH0LggNTAg0LHQvtC90YPRgdC90YvRhSDQsdCw0LvQu9C+0LIuXCJcclxuXHR9XHJcbl1cclxuXHJcbm1vZHVsZS5leHBvcnRzLm9wZW5Nb2RhbCA9IChpZCwgb3B0cykgLT5cclxuXHRjb250YWluZXJfaWQgPSBpZFxyXG5cdGFjaGlldmVfaWQgPSArb3B0cy5pZFxyXG5cdCQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tjb250YWluZXJfaWR9XVwiKS5maW5kKCcucG9wdXBfX2ZvcmxvYWRpbmcnKS5odG1sIHRlbXBsYXRlKHtpbmZvOiBEQVRBW2FjaGlldmVfaWRdfSlcclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2xvc2VNb2RhbCA9IChpZCkgLT5cclxuXHRhY2h2X2lkID0gICskKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7aWR9XVwiKS5maW5kKCcuYWNoaWV2ZScpLmF0dHIoJ2RhdGEtaWQnKVxyXG5cdHJlcXVlc3QuYWNoaWV2ZW1lbnQucmVhZCB7YWNoaWV2ZW1lbnRfaWQ6IGFjaHZfaWR9LCAocmVzKSAtPlxyXG5cdFx0Y29uc29sZS5sb2cgcmVzXHJcblxyXG5cclxuJChcIi5wb3B1cF9fc3VwZXJjb250YWluZXJcIikub24gJ2NsaWNrJywgJy5qcy1zaGFyZUFjaHYnLCAtPlxyXG5cdGlkID0gKyQodGhpcykuY2xvc2VzdCgnLmFjaGlldmUnKS5hdHRyKCdkYXRhLWlkJylcclxuXHQkc2hhZGUgPSAkKHRoaXMpLmNsb3Nlc3QoJy5wb3B1cF9fc2hhZGUnKVxyXG5cdHZrLndhbGxQb3N0IHttZXNzYWdlOiBhY2h2c1tpZF0ubWVzc2FnZStcIiBodHRwOi8vdmsuY29tL2FwcDUxOTc3OTJfMjAyNzg2NDYxXCIsIGF0dGFjaG1lbnRzOiBhY2h2c1tpZF0ucGhvdG99LCAtPlxyXG5cdFx0YWNodl9pZCA9IGFjaHZzW2lkXS5hY2hpZXZlbWVudF9pZFxyXG5cdFx0JHNoYWRlLnRyaWdnZXIoJ2NsaWNrJylcclxuXHRcdHJlcXVlc3QuZXZlbnQuc2V0IHtldmVudF9pZDogYWNodl9pZH0sIChyZXMpIC0+XHJcblx0XHRcdGNvbnNvbGUubG9nIHJlcyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGluZm8pIHtcbmJ1Zi5wdXNoKFwiPGRpdlwiICsgKGphZGUuYXR0cihcImRhdGEtaWRcIiwgXCJcIiArIChpbmZvLmlkKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwiYWNoaWV2ZVxcXCI+PGRpdiBjbGFzcz1cXFwiYWNoaWV2ZV9faWNvbi13cmFwcGVyXFxcIj48aW1nXCIgKyAoamFkZS5hdHRyKFwic3JjXCIsIFwiXCIgKyAoaW5mby5pY29uKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwiYWNoaWV2ZV9faWNvblxcXCIvPjwvZGl2PjxkaXYgY2xhc3M9XFxcImFjaGlldmVfX3RpdGxlXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBpbmZvLnRpdGxlKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48ZGl2IGNsYXNzPVxcXCJhY2hpZXZlX190ZXh0XFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBpbmZvLnRleHQpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjxkaXYgY2xhc3M9XFxcImFjaGlldmVfX2J1dC13cmFwcGVyXFxcIj48ZGl2IGNsYXNzPVxcXCJhY2hpZXZlX19idXQgYnV0IGpzLXNoYXJlQWNodlxcXCI+0J/QvtC00LXQu9C40YLRjNGB0Y88L2Rpdj48L2Rpdj48L2Rpdj5cIik7fS5jYWxsKHRoaXMsXCJpbmZvXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5pbmZvOnR5cGVvZiBpbmZvIT09XCJ1bmRlZmluZWRcIj9pbmZvOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsImNoZWNrcG9pbnRUZW1wbGF0ZSA9IHJlcXVpcmUoJy4vY2hlY2twb2ludC5qYWRlJylcclxucmVxdWVzdCA9IHJlcXVpcmUoJy4uL3JlcXVlc3QnKVxyXG5cclxuY29udGFpbmVyX2lkID0gMFxyXG5cclxubW9kdWxlLmV4cG9ydHMub3Blbk1vZGFsID0gKGlkLCBvYmopIC0+XHJcblx0Y29udGFpbmVyX2lkID0gaWRcclxuXHRjb25zb2xlLmxvZyBvYmpcclxuXHQkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7Y29udGFpbmVyX2lkfV1cIikuZmluZCgnLnBvcHVwJykuYWRkQ2xhc3MoJ3BvcHVwLS1jaGVja3BvaW50JylcclxuXHQkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7Y29udGFpbmVyX2lkfV1cIikuZmluZCgnLnBvcHVwX19mb3Jsb2FkaW5nJykuaHRtbCBjaGVja3BvaW50VGVtcGxhdGUoe2luZm86IG9ian0pXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2xvc2VNb2RhbCA9IC0+XHJcblx0JChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2NvbnRhaW5lcl9pZH1dXCIpLmZpbmQoJy5wb3B1cCcpLnJlbW92ZUNsYXNzKCdwb3B1cC0tY2hlY2twb2ludCcpXHJcblxyXG5cclxuIiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoaW5mbykge1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJjaHBvcHVwXFxcIj48ZGl2XCIgKyAoamFkZS5hdHRyKFwic3R5bGVcIiwgXCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJ1wiICsgKGluZm8uaW1hZ2VfaGludCkgKyBcIicpXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwiY2hwb3B1cF9faGVhZGVyXFxcIj48ZGl2IGNsYXNzPVxcXCJjaHBvcHVwX191cmFcXFwiPjxzcGFuIGNsYXNzPVxcXCJjaHBvcHVwX193aGl0ZWJhY2tcXFwiPtCj0YDQsCEg0KLRiyDQvtGC0LrRgNGL0Ls8L3NwYW4+PC9kaXY+PGRpdiBjbGFzcz1cXFwiY2hwb3B1cF9fdGl0bGVcXFwiPjxzcGFuIGNsYXNzPVxcXCJjaHBvcHVwX193aGl0ZWJhY2tcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGluZm8udGl0bGUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJjaHBvcHVwX19kZXNjXFxcIj48c3BhbiBjbGFzcz1cXFwiY2hwb3B1cF9fd2hpdGViYWNrXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBpbmZvLmRlc2NyaXB0aW9uKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwiY2hwb3B1cF9fbWFpblxcXCI+PGRpdiBjbGFzcz1cXFwiY2hwb3B1cF9fbmV4dFxcXCI+0KHQu9C10LTRg9GO0YnQuNC5INC/0YPQvdC60YI8L2Rpdj48ZGl2IGNsYXNzPVxcXCJjaHBvcHVwX19oaW50XFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBpbmZvLmhpbnQpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjxkaXYgY2xhc3M9XFxcImNocG9wdXBfX2J1dCBidXQgYnV0LS1sb3cganMtY2xvc2VQb3B1cFxcXCI+0JjRgdC60LDRgtGMPC9kaXY+PC9kaXY+PC9kaXY+XCIpO30uY2FsbCh0aGlzLFwiaW5mb1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguaW5mbzp0eXBlb2YgaW5mbyE9PVwidW5kZWZpbmVkXCI/aW5mbzp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJnYW1lZW50ZXJUZW1wbGF0ZSA9IHJlcXVpcmUoJy4vZ2FtZWVudGVyLmphZGUnKVxyXG5yZXF1ZXN0ID0gcmVxdWlyZSgnLi4vcmVxdWVzdCcpXHJcblxyXG5jb250YWluZXJfaWQgPSAwXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMub3Blbk1vZGFsID0gKGlkLCBvYmopIC0+XHJcblx0Y29udGFpbmVyX2lkID0gaWRcclxuXHQkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7Y29udGFpbmVyX2lkfV1cIikuZmluZCgnLnBvcHVwJykuYWRkQ2xhc3MoJ3BvcHVwLS1jaGVja3BvaW50JylcclxuXHQkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7Y29udGFpbmVyX2lkfV1cIikuZmluZCgnLnBvcHVwX19mb3Jsb2FkaW5nJykuaHRtbCBnYW1lZW50ZXJUZW1wbGF0ZSh7aW5mbzogb2JqfSlcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jbG9zZU1vZGFsID0gLT5cclxuXHQkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7Y29udGFpbmVyX2lkfV1cIikuZmluZCgnLnBvcHVwJykucmVtb3ZlQ2xhc3MoJ3BvcHVwLS1jaGVja3BvaW50JylcclxuXHJcblxyXG4iLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChpbmZvKSB7XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcImNocG9wdXBcXFwiPjxkaXZcIiArIChqYWRlLmF0dHIoXCJzdHlsZVwiLCBcImJhY2tncm91bmQtaW1hZ2U6IHVybCgnXCIgKyAoaW5mby5pbWFnZV9oaW50KSArIFwiJylcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJjaHBvcHVwX19oZWFkZXJcXFwiPjxkaXYgY2xhc3M9XFxcImNocG9wdXBfX3RpdGxlXFxcIj48c3BhbiBjbGFzcz1cXFwiY2hwb3B1cF9fd2hpdGViYWNrXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBpbmZvLnRpdGxlKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L3NwYW4+PC9kaXY+PGRpdiBjbGFzcz1cXFwiY2hwb3B1cF9fZGVzY1xcXCI+PHNwYW4gY2xhc3M9XFxcImNocG9wdXBfX3doaXRlYmFja1xcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gaW5mby5kZXNjcmlwdGlvbikgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcImNocG9wdXBfX21haW5cXFwiPjxkaXYgY2xhc3M9XFxcImNocG9wdXBfX25leHRcXFwiPtCh0LvQtdC00YPRjtGJ0LjQuSDQv9GD0L3QutGCPC9kaXY+PGRpdiBjbGFzcz1cXFwiY2hwb3B1cF9faGludFxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gaW5mby5oaW50KSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48ZGl2IGNsYXNzPVxcXCJjaHBvcHVwX19idXQgYnV0IGJ1dC0tbG93IGpzLWNsb3NlUG9wdXBcXFwiPtCY0YHQutCw0YLRjDwvZGl2PjwvZGl2PjwvZGl2PlwiKTt9LmNhbGwodGhpcyxcImluZm9cIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmluZm86dHlwZW9mIGluZm8hPT1cInVuZGVmaW5lZFwiP2luZm86dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiaW50cm8gPSByZXF1aXJlKCcuL2ludHJvLmNvZmZlZScpXHJcbmludml0ZSA9IHJlcXVpcmUoJy4vaW52aXRlLmNvZmZlZScpXHJcbnJhdGluZyA9IHJlcXVpcmUoJy4vcmF0aW5nLmNvZmZlZScpXHJcbnVzZXJpbmZvID0gcmVxdWlyZSgnLi91c2VyaW5mby5jb2ZmZWUnKVxyXG5jaGVja3BvaW50ID0gcmVxdWlyZSgnLi9jaGVja3BvaW50LmNvZmZlZScpXHJcbmdhbWVlbnRlciA9IHJlcXVpcmUoJy4vZ2FtZWVudGVyLmNvZmZlZScpXHJcbm1vbmV5ID0gcmVxdWlyZSgnLi9tb25leS5jb2ZmZWUnKVxyXG5tZXNzZW5nZXIgPSByZXF1aXJlKCcuL21lc3Nlbmdlci9tZXNzZW5nZXIuY29mZmVlJylcclxuYWNoaWV2ZSA9IHJlcXVpcmUoJy4vYWNoaWV2ZS5jb2ZmZWUnKVxyXG5teXByaXplcyA9IHJlcXVpcmUoJy4vbXlwcml6ZXMuY29mZmVlJylcclxucGl6emEgPSByZXF1aXJlKCcuL3BpenphLmNvZmZlZScpXHJcbm5ld3Rhc3RlID0gcmVxdWlyZSgnLi9uZXd0YXN0ZS5jb2ZmZWUnKVxyXG5cclxuXHJcbm1haW5UZW1wbGF0ZSA9IHJlcXVpcmUgJy4vaW5kZXguamFkZSdcclxuXHJcbmN1cklEID0gMFxyXG5wYWdlcyA9IFtdXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5vcGVuTW9kYWwgPSAodHlwZXMsIG9iaj17fSwgY2FsbGJhY2spIC0+XHJcbiMkKCcucG9wdXBfX3NoYWRlJykucmVtb3ZlQ2xhc3MoJ3BvcHVwX19zaGFkZS0tY2xvc2VkJylcclxuXHQkKCdib2R5JykuYWRkQ2xhc3MoJ2JvZHktLW1vZGFsJylcclxuXHQkKCcucG9wdXBfX3N1cGVyY29udGFpbmVyJykuYXBwZW5kIG1haW5UZW1wbGF0ZSh7Y3VySUQ6Y3VySUR9KVxyXG5cclxuXHJcblx0aWYgdHlwZXMgPT0gXCJpbnRyb1wiXHJcblx0XHRpbnRyby5vcGVuTW9kYWwoY3VySUQpXHJcblxyXG5cdGlmIHR5cGVzID09IFwicmF0aW5nXCJcclxuXHRcdHJhdGluZy5vcGVuTW9kYWwoY3VySUQpXHJcblxyXG5cdGlmIHR5cGVzID09IFwiaW52aXRlXCJcclxuXHRcdGludml0ZS5vcGVuTW9kYWwoY3VySUQpXHJcblxyXG5cdGlmIHR5cGVzID09IFwidXNlcmluZm9cIlxyXG5cdFx0dXNlcmluZm8ub3Blbk1vZGFsKGN1cklELCBvYmosIGNhbGxiYWNrKVxyXG5cdGlmIHR5cGVzID09IFwiYWNoaWV2ZVwiXHJcblx0XHRhY2hpZXZlLm9wZW5Nb2RhbChjdXJJRCwgb2JqKVxyXG5cclxuXHRpZiB0eXBlcyA9PSBcImNoZWNrcG9pbnRcIlxyXG5cdFx0Y2hlY2twb2ludC5vcGVuTW9kYWwoY3VySUQsIG9iailcclxuXHJcblx0aWYgdHlwZXMgPT0gXCJnYW1lZW50ZXJcIlxyXG5cdFx0Z2FtZWVudGVyLm9wZW5Nb2RhbChjdXJJRCwgb2JqKVxyXG5cdGlmIHR5cGVzID09IFwibW9uZXlcIlxyXG5cdFx0bW9uZXkub3Blbk1vZGFsKGN1cklELCBvYmopXHJcblx0aWYgdHlwZXMgPT0gXCJteXByaXplc1wiXHJcblx0XHRteXByaXplcy5vcGVuTW9kYWwoY3VySUQsIG9iailcclxuXHRpZiB0eXBlcyA9PSBcInBpenphXCJcclxuXHRcdHBpenphLm9wZW5Nb2RhbChjdXJJRClcclxuXHJcblx0aWYgdHlwZXMgPT0gXCJtZXNzZW5nZXJcIlxyXG5cdFx0bWVzc2VuZ2VyLm9wZW5Nb2RhbChvYmopXHJcblxyXG5cdGlmIHR5cGVzID09IFwibmV3dGFzdGVcIlxyXG5cdFx0bmV3dGFzdGUub3Blbk1vZGFsKGN1cklEKVxyXG5cclxuXHRwYWdlc1tjdXJJRF0gPSB0eXBlc1xyXG5cdGN1cklEKytcclxuXHJcblxyXG5hZGRDbG9zZUxpc3RlbmVyID0gLT5cclxuXHRjbG9zZU1vZGFsID0gKGlkKSAtPlxyXG5cdFx0IyQoJy5wb3B1cF9fc2hhZGUnKS5hZGRDbGFzcygncG9wdXBfX3NoYWRlLS1jbG9zZWQnKVxyXG5cdFx0JCgnYm9keScpLnJlbW92ZUNsYXNzKCdib2R5LS1tb2RhbCcpXHJcblx0XHRwYWdlID0gcGFnZXNbaWRdXHJcblx0XHRpZiBwYWdlID09IFwiaW50cm9cIlxyXG5cdFx0XHRpbnRyby5jbG9zZU1vZGFsKClcclxuXHRcdGlmIHBhZ2UgPT0gXCJyYXRpbmdcIlxyXG5cdFx0XHRyYXRpbmcuY2xvc2VNb2RhbCgpXHJcblx0XHRpZiBwYWdlID09IFwiaW52aXRlXCJcclxuXHRcdFx0aW52aXRlLmNsb3NlTW9kYWwoKVxyXG5cdFx0aWYgcGFnZSA9PSBcInVzZXJpbmZvXCJcclxuXHRcdFx0dXNlcmluZm8uY2xvc2VNb2RhbCgpXHJcblx0XHRpZiBwYWdlID09IFwiY2hlY2twb2ludFwiXHJcblx0XHRcdGNoZWNrcG9pbnQuY2xvc2VNb2RhbCgpXHJcblx0XHRpZiBwYWdlID09IFwiZ2FtZWVudGVyXCJcclxuXHRcdFx0Z2FtZWVudGVyLmNsb3NlTW9kYWwoKVxyXG5cdFx0aWYgcGFnZSA9PSBcIm1vbmV5XCJcclxuXHRcdFx0bW9uZXkuY2xvc2VNb2RhbCgpXHJcblx0XHRpZiBwYWdlID09IFwibWVzc2VuZ2VyXCJcclxuXHRcdFx0bWVzc2VuZ2VyLmNsb3NlTW9kYWwoKVxyXG5cdFx0aWYgcGFnZSA9PSBcIm15cHJpemVzXCJcclxuXHRcdFx0bXlwcml6ZXMuY2xvc2VNb2RhbCgpXHJcblx0XHRpZiBwYWdlID09IFwicGl6emFcIlxyXG5cdFx0XHRwaXp6YS5jbG9zZU1vZGFsKClcclxuXHRcdGlmIHBhZ2UgPT0gXCJhY2hpZXZlXCJcclxuXHRcdFx0YWNoaWV2ZS5jbG9zZU1vZGFsKGlkKVxyXG5cdFx0JCgnLnBvcHVwX19zdXBlcmNvbnRhaW5lciAucG9wdXBfX3NoYWRlW2RhdGEtaWQ9XCInK2lkKydcIl0nKS5yZW1vdmUoKVxyXG5cclxuXHRtb2R1bGUuZXhwb3J0cy5jbG9zZU1vZGFsID0gY2xvc2VNb2RhbFxyXG5cdCQoJy5wb3B1cF9fc3VwZXJjb250YWluZXInKS5vbiAnY2xpY2snLCAnLnBvcHVwX19zaGFkZScsIChlKSAtPlxyXG5cdFx0aWQgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtaWQnKVxyXG5cdFx0Y2xvc2VNb2RhbChpZCkgaWYgJChlLnRhcmdldCkuaGFzQ2xhc3MoJ3BvcHVwX19zaGFkZScpXHJcblxyXG5cdCQoJy5wb3B1cF9fc3VwZXJjb250YWluZXInKS5vbiAnY2xpY2snLCAnLnBvcHVwX19jcm9zcycsIC0+XHJcblx0XHRpZCA9ICQodGhpcykuY2xvc2VzdCgnLnBvcHVwX19zaGFkZScpLmF0dHIoJ2RhdGEtaWQnKVxyXG5cdFx0Y2xvc2VNb2RhbChpZClcclxuXHJcblx0JCgnLnBvcHVwX19zdXBlcmNvbnRhaW5lcicpLm9uICdjbGljaycsICcuanMtY2xvc2VQb3B1cCcsIC0+XHJcblx0XHRpZCA9ICQodGhpcykuY2xvc2VzdCgnLnBvcHVwX19zaGFkZScpLmF0dHIoJ2RhdGEtaWQnKVxyXG5cdFx0Y2xvc2VNb2RhbChpZClcclxuXHJcbmFkZENsb3NlTGlzdGVuZXIoKSIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGN1cklEKSB7XG5idWYucHVzaChcIjxkaXZcIiArIChqYWRlLmF0dHIoXCJkYXRhLWlkXCIsIFwiXCIgKyAoY3VySUQpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIChqYWRlLmF0dHIoXCJzdHlsZVwiLCBcInotaW5kZXg6XCIgKyAoY3VySUQrMTApICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJwb3B1cF9fc2hhZGVcXFwiPjxkaXYgY2xhc3M9XFxcInBvcHVwXFxcIj48aSBjbGFzcz1cXFwiaWNvbi1wb3B1cC1jcm9zcyBwb3B1cF9fY3Jvc3NcXFwiPjwvaT48ZGl2IGNsYXNzPVxcXCJwb3B1cF9fZm9ybG9hZGluZ1xcXCI+PC9kaXY+PC9kaXY+PC9kaXY+XCIpO30uY2FsbCh0aGlzLFwiY3VySURcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmN1cklEOnR5cGVvZiBjdXJJRCE9PVwidW5kZWZpbmVkXCI/Y3VySUQ6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiaW50cm9UZW1wbGF0ZSA9IHJlcXVpcmUoJy4vaW50cm8uamFkZScpXHJcblxyXG52aWRlb1NyYyA9IFwiXCJcclxuY29udGFpbmVyX2lkID0gMFxyXG5cclxubW9kdWxlLmV4cG9ydHMub3Blbk1vZGFsID0gKGlkKSAtPlxyXG5cdGNvbnRhaW5lcl9pZCA9IGlkXHJcblx0JChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2NvbnRhaW5lcl9pZH1dXCIpLmZpbmQoJy5wb3B1cF9fZm9ybG9hZGluZycpLmh0bWwgaW50cm9UZW1wbGF0ZSgpXHJcblx0dmlkZW9TcmMgPSAkKCcuaW50cm9fX3ZpZGVvJykuYXR0cignc3JjJylcclxuXHQkKCcuaW50cm9fX3ZpZGVvJykuYXR0cignc3JjJywgdmlkZW9TcmMpXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jbG9zZU1vZGFsID0gLT5cclxuXHQkKCcuaW50cm9fX3ZpZGVvJykuYXR0cignc3JjJywgXCJcIikiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJwb3B1cF9fd3JhcC0taW50cm9cXFwiPjxpZnJhbWUgY2xhc3M9XFxcImludHJvX192aWRlb1xcXCIgd2lkdGg9XFxcIjU4OFxcXCIgaGVpZ2h0PVxcXCIzNjBcXFwiIHNyYz1cXFwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvdXcwOGoteU9mY0VcXFwiIGZyYW1lYm9yZGVyPVxcXCIwXFxcIj48L2lmcmFtZT48ZGl2IGNsYXNzPVxcXCJpbnRyb19fc2tpcHZpZGVvXFxcIj7Qn9GA0L7Qv9GD0YHRgtC40YLRjDwvZGl2PjwvZGl2PlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJpbnZpdGVUZW1wbGF0ZSA9IHJlcXVpcmUoJy4vaW52aXRlLmphZGUnKVxyXG5cclxuY29udGFpbmVyX2lkID0gMFxyXG5cclxubW9kdWxlLmV4cG9ydHMub3Blbk1vZGFsID0gKGlkKSAtPlxyXG5cdGNvbnRhaW5lcl9pZCA9IGlkXHJcblx0JChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2NvbnRhaW5lcl9pZH1dXCIpLmZpbmQoJy5wb3B1cF9fZm9ybG9hZGluZycpLmh0bWwgaW52aXRlVGVtcGxhdGUoKVxyXG5cdCQoXCIuaW52aXRlX19saXN0XCIpLmN1c3RvbVNjcm9sbCgpXHJcblx0JCgnLmludml0ZV9faW5wdXQnKS5vbiAnaW5wdXQnLCBpbnB1dENoYW5nZUhhbmRsZXJcclxuXHJcbm1vZHVsZS5leHBvcnRzLmNsb3NlTW9kYWwgPSAtPlxyXG5cdCQoJy5pbnRyb19fdmlkZW8nKS5hdHRyKCdzcmMnLCBcIlwiKVxyXG5cdCQoJy5pbnZpdGVfX2lucHV0Jykub2ZmICdpbnB1dCcsIGlucHV0Q2hhbmdlSGFuZGxlclxyXG5cclxuaW5wdXRDaGFuZ2VIYW5kbGVyID0gKGUpIC0+XHJcblx0dmFsID0gZS50YXJnZXQudmFsdWVcclxuXHRmaWx0ZXJMaXN0KHZhbClcclxuXHJcbmZpbHRlckxpc3QgPSAodmFsKSAtPlxyXG5cdHZhbCA9IHZhbC50b0xvd2VyQ2FzZSgpXHJcblx0JCgnLmludml0ZV9fZWwnKS5lYWNoIChpLCBlbCkgLT5cclxuXHRcdG5hbWUgPSAkKGVsKS5maW5kKCcubGVhZGVyc19fbmFtZScpLnRleHQoKS50b0xvd2VyQ2FzZSgpXHJcblx0XHRpZiBuYW1lLmluZGV4T2YodmFsKSAhPSAtMVxyXG5cdFx0XHQkKGVsKS5yZW1vdmVDbGFzcygnaW52aXRlX19lbC0taW52aXMnKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHQkKGVsKS5hZGRDbGFzcygnaW52aXRlX19lbC0taW52aXMnKSIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcInBvcHVwX193cmFwLS1pbnZpdGVcXFwiPjxoMyBjbGFzcz1cXFwiaW52aXRlX190aXRsZVxcXCI+0JLRi9Cx0LXRgNC4INC00YDRg9C30LXQuSw8YnI+0LrQvtGC0L7RgNGL0YUg0YXQvtGH0LXRiNGMINC/0YDQuNCz0LvQsNGB0LjRgtGMPC9oMz48ZGl2IGNsYXNzPVxcXCJpbnZpdGVfX2lucHV0d3JhcHBlclxcXCI+PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCLQktCy0LXQtNC4INC40LzRj1xcXCIgY2xhc3M9XFxcImludml0ZV9faW5wdXRcXFwiLz48L2Rpdj48ZGl2IGNsYXNzPVxcXCJpbnZpdGVfX2xpc3RcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2VsIGludml0ZV9fZWwgaW52aXRlX19lbC0taW52aXRlZFxcXCI+PGltZyBzcmM9XFxcImh0dHA6Ly93d3cuc3BsZXRuaWsucnUvaW1nLzIwMTEvMDQvYXJpbmEvMjAxMTA0MDEtcm9iZXJ0ZC1hbm9ucy5qcGdcXFwiIGNsYXNzPVxcXCJsZWFkZXJzX19waG90b1xcXCIvPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3JpZ2h0XFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19uYW1lXFxcIj7QktGP0YfQtdGB0LvQsNCyPGJyPtCS0Y/Rh9C10YHQu9Cw0LLQvtCy0LjRhzwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2VsIGludml0ZV9fZWxcXFwiPjxpbWcgc3JjPVxcXCJodHRwOi8vd3d3LnNwbGV0bmlrLnJ1L2ltZy8yMDExLzA0L2FyaW5hLzIwMTEwNDAxLXJvYmVydGQtYW5vbnMuanBnXFxcIiBjbGFzcz1cXFwibGVhZGVyc19fcGhvdG9cXFwiLz48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19yaWdodFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fbmFtZVxcXCI+0JLRj9GH0LXRgdC70LDQsjxicj7QktGP0YfQtdGB0LvQsNCy0L7QstC40Yc8L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19lbCBpbnZpdGVfX2VsXFxcIj48aW1nIHNyYz1cXFwiaHR0cDovL3d3dy5zcGxldG5pay5ydS9pbWcvMjAxMS8wNC9hcmluYS8yMDExMDQwMS1yb2JlcnRkLWFub25zLmpwZ1xcXCIgY2xhc3M9XFxcImxlYWRlcnNfX3Bob3RvXFxcIi8+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fcmlnaHRcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX25hbWVcXFwiPtCS0Y/Rh9C10YHQu9Cw0LI8YnI+0JLRj9GH0LXRgdC70LDQstC+0LLQuNGHPC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fZWwgaW52aXRlX19lbCBpbnZpdGVfX2VsLS1pbnZpdGVkXFxcIj48aW1nIHNyYz1cXFwiaHR0cDovL3d3dy5zcGxldG5pay5ydS9pbWcvMjAxMS8wNC9hcmluYS8yMDExMDQwMS1yb2JlcnRkLWFub25zLmpwZ1xcXCIgY2xhc3M9XFxcImxlYWRlcnNfX3Bob3RvXFxcIi8+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fcmlnaHRcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX25hbWVcXFwiPtCd0LjQutC90LXQudC8PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fZWwgaW52aXRlX19lbFxcXCI+PGltZyBzcmM9XFxcImh0dHA6Ly93d3cuc3BsZXRuaWsucnUvaW1nLzIwMTEvMDQvYXJpbmEvMjAxMTA0MDEtcm9iZXJ0ZC1hbm9ucy5qcGdcXFwiIGNsYXNzPVxcXCJsZWFkZXJzX19waG90b1xcXCIvPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3JpZ2h0XFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19uYW1lXFxcIj7QndC40LrQvdC10LnQvDwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2VsIGludml0ZV9fZWwgaW52aXRlX19lbC0taW52aXRlZFxcXCI+PGltZyBzcmM9XFxcImh0dHA6Ly93d3cuc3BsZXRuaWsucnUvaW1nLzIwMTEvMDQvYXJpbmEvMjAxMTA0MDEtcm9iZXJ0ZC1hbm9ucy5qcGdcXFwiIGNsYXNzPVxcXCJsZWFkZXJzX19waG90b1xcXCIvPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3JpZ2h0XFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19uYW1lXFxcIj7QndC40LrQvdC10LnQvDwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2VsIGludml0ZV9fZWxcXFwiPjxpbWcgc3JjPVxcXCJodHRwOi8vd3d3LnNwbGV0bmlrLnJ1L2ltZy8yMDExLzA0L2FyaW5hLzIwMTEwNDAxLXJvYmVydGQtYW5vbnMuanBnXFxcIiBjbGFzcz1cXFwibGVhZGVyc19fcGhvdG9cXFwiLz48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19yaWdodFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fbmFtZVxcXCI+0J3QuNC60L3QtdC50Lw8L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19lbCBpbnZpdGVfX2VsXFxcIj48aW1nIHNyYz1cXFwiaHR0cDovL3d3dy5zcGxldG5pay5ydS9pbWcvMjAxMS8wNC9hcmluYS8yMDExMDQwMS1yb2JlcnRkLWFub25zLmpwZ1xcXCIgY2xhc3M9XFxcImxlYWRlcnNfX3Bob3RvXFxcIi8+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fcmlnaHRcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX25hbWVcXFwiPtCd0LjQutC90LXQudC8PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fZWwgaW52aXRlX19lbCBpbnZpdGVfX2VsLS1pbnZpdGVkXFxcIj48aW1nIHNyYz1cXFwiaHR0cDovL3d3dy5zcGxldG5pay5ydS9pbWcvMjAxMS8wNC9hcmluYS8yMDExMDQwMS1yb2JlcnRkLWFub25zLmpwZ1xcXCIgY2xhc3M9XFxcImxlYWRlcnNfX3Bob3RvXFxcIi8+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fcmlnaHRcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX25hbWVcXFwiPtCd0LjQutC90LXQudC8PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fZWwgaW52aXRlX19lbFxcXCI+PGltZyBzcmM9XFxcImh0dHA6Ly93d3cuc3BsZXRuaWsucnUvaW1nLzIwMTEvMDQvYXJpbmEvMjAxMTA0MDEtcm9iZXJ0ZC1hbm9ucy5qcGdcXFwiIGNsYXNzPVxcXCJsZWFkZXJzX19waG90b1xcXCIvPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3JpZ2h0XFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19uYW1lXFxcIj7QndC40LrQvtC70LDQuTxicj7QndC40LrQvtC70LDQtdCy0LjRhzwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2VsIGludml0ZV9fZWwgaW52aXRlX19lbC0taW52aXRlZFxcXCI+PGltZyBzcmM9XFxcImh0dHA6Ly93d3cuc3BsZXRuaWsucnUvaW1nLzIwMTEvMDQvYXJpbmEvMjAxMTA0MDEtcm9iZXJ0ZC1hbm9ucy5qcGdcXFwiIGNsYXNzPVxcXCJsZWFkZXJzX19waG90b1xcXCIvPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3JpZ2h0XFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19uYW1lXFxcIj7QndC40LrQvdC10LnQvDwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2VsIGludml0ZV9fZWxcXFwiPjxpbWcgc3JjPVxcXCJodHRwOi8vd3d3LnNwbGV0bmlrLnJ1L2ltZy8yMDExLzA0L2FyaW5hLzIwMTEwNDAxLXJvYmVydGQtYW5vbnMuanBnXFxcIiBjbGFzcz1cXFwibGVhZGVyc19fcGhvdG9cXFwiLz48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19yaWdodFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fbmFtZVxcXCI+0J3QuNC60L3QtdC50Lw8L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19lbCBpbnZpdGVfX2VsXFxcIj48aW1nIHNyYz1cXFwiaHR0cDovL3d3dy5zcGxldG5pay5ydS9pbWcvMjAxMS8wNC9hcmluYS8yMDExMDQwMS1yb2JlcnRkLWFub25zLmpwZ1xcXCIgY2xhc3M9XFxcImxlYWRlcnNfX3Bob3RvXFxcIi8+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fcmlnaHRcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX25hbWVcXFwiPtCd0LjQutC90LXQudC8PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fZWwgaW52aXRlX19lbCBpbnZpdGVfX2VsLS1pbnZpdGVkXFxcIj48aW1nIHNyYz1cXFwiaHR0cDovL3d3dy5zcGxldG5pay5ydS9pbWcvMjAxMS8wNC9hcmluYS8yMDExMDQwMS1yb2JlcnRkLWFub25zLmpwZ1xcXCIgY2xhc3M9XFxcImxlYWRlcnNfX3Bob3RvXFxcIi8+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fcmlnaHRcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX25hbWVcXFwiPtCd0LjQutC90LXQudC8PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fZWwgaW52aXRlX19lbFxcXCI+PGltZyBzcmM9XFxcImh0dHA6Ly93d3cuc3BsZXRuaWsucnUvaW1nLzIwMTEvMDQvYXJpbmEvMjAxMTA0MDEtcm9iZXJ0ZC1hbm9ucy5qcGdcXFwiIGNsYXNzPVxcXCJsZWFkZXJzX19waG90b1xcXCIvPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3JpZ2h0XFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19uYW1lXFxcIj7QndC40LrQvdC10LnQvDwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vbWVzc2VuZ2VyLmphZGUnKVxyXG5yZXF1ZXN0ID0gcmVxdWlyZSgnLi4vLi4vcmVxdWVzdC9pbmRleCcpXHJcbm1lc19pY29uID0gcmVxdWlyZSgnLi4vLi4vaGVhZGVyL21lc3Nlbmdlcl9faWNvbi5qYWRlJylcclxuXHJcbm5vdGlmaWNhdGlvblRlbXBsYXRlID0gcmVxdWlyZSAnLi9ub3RpZmljYXRpb24uamFkZSdcclxucXVlc3Rpb25UZW1wbGF0ZSA9IHJlcXVpcmUgJy4vcXVlc3Rpb24uamFkZSdcclxuZGF0YSA9IFtdXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMub3Blbk1vZGFsID0gKG9iaikgLT5cclxuXHQkKCcucG9wdXAnKS5hZGRDbGFzcygncG9wdXAtLW1lc3NlbmdlcicpXHJcblx0cmVxdWVzdC5mZWVkYmFjay5nZXQge30sIChyZXMpIC0+XHJcblx0XHRjb25zb2xlLmxvZyByZXNcclxuXHRcdGRhdGEgPSBoYW5kbGVSZXMocmVzKVxyXG5cdFx0JCgnLnBvcHVwX19mb3Jsb2FkaW5nJykuaHRtbCB0ZW1wbGF0ZSh7bWVzc2FnZXM6IGRhdGF9KVxyXG5cdFx0b3Blbk1lc3NhZ2UoMCkgaWYgcmVzLmxlbmd0aD4wXHJcblx0XHQkKCcubWVzc2VuZ2VyX192aXMnKS5jdXN0b21TY3JvbGwoe3ByZWZpeDpcImN1c3RvbS1iaWdzY3JvbGxfXCJ9KVxyXG5cdFx0JCgnLm1lc3Nlbmdlcl9fZWwnKS5vbiAnY2xpY2snLCBtZXNDbGlja0xpc3RlbmVyXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jbG9zZU1vZGFsID0gLT5cclxuXHQkKCcucG9wdXAnKS5yZW1vdmVDbGFzcygncG9wdXAtLW1lc3NlbmdlcicpXHJcblxyXG5tZXNDbGlja0xpc3RlbmVyID0gLT5cclxuXHQkKCcubWVzc2VuZ2VyX19lbCcpLnJlbW92ZUNsYXNzKCdtZXNzZW5nZXJfX2VsLS1hY3RpdmUnKVxyXG5cdCQodGhpcykuYWRkQ2xhc3MoJ21lc3Nlbmdlcl9fZWwtLWFjdGl2ZScpXHJcblx0b3Blbk1lc3NhZ2UgKyQodGhpcykuYXR0cignZGF0YS1pZCcpXHJcblxyXG5oYW5kbGVSZXMgPSAoYXJyKSAtPlxyXG5cdGZvciBtZXMgaW4gYXJyXHJcblx0XHRtZXMubm90aWNlID0gIW1lcy5xdWVzdGlvblxyXG5cdFx0ZCA9IG1vbWVudChtZXMuYW5zd2VyZWRfYXQqMTAwMClcclxuXHRcdG1lcy5kYXRlID0gZC5mb3JtYXQoJ0RELk1NLllZWVknKVxyXG5cdHJldHVybiBhcnIucmV2ZXJzZSgpXHJcblxyXG5vcGVuTWVzc2FnZSA9IChpbmRleCkgLT5cclxuXHRtZXNzYWdlID0gZGF0YVtpbmRleF1cclxuXHRpZiBtZXNzYWdlLm5vdGljZVxyXG5cdFx0JCgnLm1lc3Nlbmdlcl9fbWVzLXRleHQnKS5odG1sIG5vdGlmaWNhdGlvblRlbXBsYXRlKHtpbmZvOm1lc3NhZ2V9KVxyXG5cdGVsc2VcclxuXHRcdCQoJy5tZXNzZW5nZXJfX21lcy10ZXh0JykuaHRtbCBxdWVzdGlvblRlbXBsYXRlKHtpbmZvOm1lc3NhZ2V9KVxyXG5cdCQoJy5tZXNzZW5nZXJfX21lcy1jb250YWluZXInKS5jdXN0b21TY3JvbGwoe3ByZWZpeDpcImN1c3RvbS1iaWdzY3JvbGxfXCJ9KVxyXG5cdGlmIGRhdGFbaW5kZXhdLnJlYWQgPT0gMFxyXG5cdFx0cmVxdWVzdC5mZWVkYmFjay5yZWFkIHtpZDogZGF0YVtpbmRleF0uaWR9LCAocmVzKSAtPlxyXG5cdFx0XHRpZiByZXMucmVzdWx0ID0gXCJzdWNjZXNzXCJcclxuXHRcdFx0XHQkKCcubWVzc2VuZ2VyX19pY29uLWZvcmxvYWRpbmcnKS5odG1sIG1lc19pY29uKHt1bnJlYWRzOnBhcnNlSW50KCQoJy5tZXNzZW5nZXJfX3VucmVhZHMtdmFsJykuaHRtbCgpKS0xfSlcclxuXHJcbiIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKG1lc3NhZ2VzLCB1bmRlZmluZWQpIHtcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyXFxcIj48aDIgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fdGl0bGVcXFwiPtCc0L7QuCDRgdC+0L7QsdGJ0LXQvdC40Y88L2gyPjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fbGVmdFxcXCI+PGgzIGNsYXNzPVxcXCJtZXNzZW5nZXJfX3N1YnRpdGxlXFxcIj7QodC/0LjRgdC+0Log0YHQvtC+0LHRidC10L3QuNC5PC9oMz48ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJfX3Zpc1xcXCI+PGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX19saXN0XFxcIj5cIik7XG4vLyBpdGVyYXRlIG1lc3NhZ2VzXG47KGZ1bmN0aW9uKCl7XG4gIHZhciAkJG9iaiA9IG1lc3NhZ2VzO1xuICBpZiAoJ251bWJlcicgPT0gdHlwZW9mICQkb2JqLmxlbmd0aCkge1xuXG4gICAgZm9yICh2YXIgaW5kZXggPSAwLCAkJGwgPSAkJG9iai5sZW5ndGg7IGluZGV4IDwgJCRsOyBpbmRleCsrKSB7XG4gICAgICB2YXIgbWVzID0gJCRvYmpbaW5kZXhdO1xuXG5idWYucHVzaChcIjxkaXZcIiArIChqYWRlLmF0dHIoXCJkYXRhLWlkXCIsIFwiXCIgKyAoaW5kZXgpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIChqYWRlLmNscyhbJ21lc3Nlbmdlcl9fZWwnLGluZGV4PT0wID8gXCJtZXNzZW5nZXJfX2VsLS1hY3RpdmVcIiA6IFwiXCJdLCBbbnVsbCx0cnVlXSkpICsgXCI+PGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX19lbC1oZWFkZXJcXFwiPlwiKTtcbmlmICggbWVzLm5vdGljZSlcbntcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX19lbC10eXBlXFxcIj7Qo9Cy0LXQtNC+0LzQu9C10L3QuNC1PC9kaXY+XCIpO1xufVxuZWxzZVxue1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJfX2VsLXR5cGVcXFwiPtCe0YLQstC10YIg0L3QsCDQstC+0L/RgNC+0YE8L2Rpdj5cIik7XG59XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fZWwtZGF0ZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gbWVzLmRhdGUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fZWwtdGl0bGVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IG1lcy50aXRsZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PC9kaXY+XCIpO1xuICAgIH1cblxuICB9IGVsc2Uge1xuICAgIHZhciAkJGwgPSAwO1xuICAgIGZvciAodmFyIGluZGV4IGluICQkb2JqKSB7XG4gICAgICAkJGwrKzsgICAgICB2YXIgbWVzID0gJCRvYmpbaW5kZXhdO1xuXG5idWYucHVzaChcIjxkaXZcIiArIChqYWRlLmF0dHIoXCJkYXRhLWlkXCIsIFwiXCIgKyAoaW5kZXgpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIChqYWRlLmNscyhbJ21lc3Nlbmdlcl9fZWwnLGluZGV4PT0wID8gXCJtZXNzZW5nZXJfX2VsLS1hY3RpdmVcIiA6IFwiXCJdLCBbbnVsbCx0cnVlXSkpICsgXCI+PGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX19lbC1oZWFkZXJcXFwiPlwiKTtcbmlmICggbWVzLm5vdGljZSlcbntcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX19lbC10eXBlXFxcIj7Qo9Cy0LXQtNC+0LzQu9C10L3QuNC1PC9kaXY+XCIpO1xufVxuZWxzZVxue1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJfX2VsLXR5cGVcXFwiPtCe0YLQstC10YIg0L3QsCDQstC+0L/RgNC+0YE8L2Rpdj5cIik7XG59XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fZWwtZGF0ZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gbWVzLmRhdGUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fZWwtdGl0bGVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IG1lcy50aXRsZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PC9kaXY+XCIpO1xuICAgIH1cblxuICB9XG59KS5jYWxsKHRoaXMpO1xuXG5idWYucHVzaChcIjwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fcmlnaHRcXFwiPjxoMyBjbGFzcz1cXFwibWVzc2VuZ2VyX19zdWJ0aXRsZVxcXCI+0KHQvtC+0LHRidC10L3QuNC1PC9oMz48ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJfX21lcy1wbGFua1xcXCI+PC9kaXY+PGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX19tZXMtY29udGFpbmVyXFxcIj48ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJfX21lcy10ZXh0XFxcIj48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj5cIik7fS5jYWxsKHRoaXMsXCJtZXNzYWdlc1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgubWVzc2FnZXM6dHlwZW9mIG1lc3NhZ2VzIT09XCJ1bmRlZmluZWRcIj9tZXNzYWdlczp1bmRlZmluZWQsXCJ1bmRlZmluZWRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnVuZGVmaW5lZDp0eXBlb2YgdW5kZWZpbmVkIT09XCJ1bmRlZmluZWRcIj91bmRlZmluZWQ6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoaW5mbykge1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJfX21lcy12YWxcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGluZm8uYW5zd2VyKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj5cIik7fS5jYWxsKHRoaXMsXCJpbmZvXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5pbmZvOnR5cGVvZiBpbmZvIT09XCJ1bmRlZmluZWRcIj9pbmZvOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGluZm8pIHtcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX19tZXMtdGl0bGVcXFwiPtCS0L7Qv9GA0L7RgTo8L2Rpdj48ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJfX21lcy12YWxcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGluZm8ucXVlc3Rpb24pID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fbWVzLXRpdGxlXFxcIj7QntGC0LLQtdGCOjwvZGl2PjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fbWVzLXZhbFxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gaW5mby5hbnN3ZXIpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PlwiKTt9LmNhbGwodGhpcyxcImluZm9cIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmluZm86dHlwZW9mIGluZm8hPT1cInVuZGVmaW5lZFwiP2luZm86dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07Iiwib2tUZW1wbGF0ZSA9IHJlcXVpcmUoJy4vbW9uZXlfb2suamFkZScpXHJcbmZhaWxUZW1wbGF0ZSA9IHJlcXVpcmUoJy4vbW9uZXlfZmFpbC5qYWRlJylcclxucmVxdWVzdCA9IHJlcXVpcmUoJy4uL3JlcXVlc3QnKVxyXG5cclxuY29udGFpbmVyX2lkID0gMFxyXG5cclxubW9kdWxlLmV4cG9ydHMub3Blbk1vZGFsID0gKGlkLCBvYmopIC0+XHJcblx0Y29udGFpbmVyX2lkID0gaWRcclxuXHRjb25zb2xlLmxvZyBvYmpcclxuXHQkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7Y29udGFpbmVyX2lkfV1cIikuZmluZCgnLnBvcHVwJykuYWRkQ2xhc3MoJ3BvcHVwLS1tZXMnKVxyXG5cdGlmIG9iai5yZXMgPT0gXCJva1wiXHJcblx0XHQkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7Y29udGFpbmVyX2lkfV1cIikuZmluZCgnLnBvcHVwX19mb3Jsb2FkaW5nJykuaHRtbCBva1RlbXBsYXRlKHt9KVxyXG5cdGlmIG9iai5yZXMgPT0gXCJmYWlsXCJcclxuXHRcdCQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tjb250YWluZXJfaWR9XVwiKS5maW5kKCcucG9wdXBfX2ZvcmxvYWRpbmcnKS5odG1sIGZhaWxUZW1wbGF0ZSh7fSlcclxuXHJcbm1vZHVsZS5leHBvcnRzLmNsb3NlTW9kYWwgPSAtPlxyXG5cdCQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tjb250YWluZXJfaWR9XVwiKS5maW5kKCcucG9wdXAnKS5yZW1vdmVDbGFzcygncG9wdXAtLW1lcycpXHJcblxyXG5cclxuIiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwicG9wdXBfX3dyYXAtLWludHJvXFxcIj48ZGl2IGNsYXNzPVxcXCJjaHBvcHVwX19tb25leW1lc1xcXCI+PHA+0KLRiyDQsdGL0Lsg0L7Rh9C10L3RjCDQsdC70LjQt9C+0Log0Log0Y3RgtC+0LzRgyDQv9GA0LjQt9GDLCDQvdC+INC60YLQvi3RgtC+INC+0LrQsNC30LDQu9GB0Y8g0L3QsCDQtNC+0LvRjiDRgdC10LrRg9C90LTRiyDQsdGL0YHRgtGA0LXQtSAoPC9wPjxwPtCd0LUg0L7RgtGH0LDQuNCy0LDQudGB0Y8hINCX0LDQstGC0YDQsCDQvNGLINGA0LDQt9GL0LPRgNCw0LXQvCDQtdGJ0LUgNTAwINGA0YPQsdC70LXQuSwg0L/QvtGC0L7QvCDQtdGJ0LUg0Lgg0LXRidC1IOKAkyDQuCDRgtCw0Log0LrQsNC20LTRi9C5INC00LXQvdGMINCx0LXQtyDQstGL0YXQvtC00L3Ri9GFLiDQotC10LHQtSDQvdCw0LLQtdGA0L3Rj9C60LAg0L/QvtCy0LXQt9C10YIhINCh0L/QsNGB0LjQsdC+LCDQuNCz0YDQsNC5INGBINC90LDQvNC4INC10YnQtSE8L3A+PC9kaXY+PC9kaXY+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcInBvcHVwX193cmFwLS1pbnRyb1xcXCI+PGRpdiBjbGFzcz1cXFwiY2hwb3B1cF9fbW9uZXltZXNcXFwiPjxwPtCf0L7Qt9C00YDQsNCy0LvRj9C10LwsINGC0Ysg0L/QtdGA0LLRi9C8INC90LDRiNC10Lsg0YHQtdCz0L7QtNC90Y/RiNC90LjQtSDQv9GA0LjQt9C+0LLRi9C1INC00LXQvdGM0LPQuCDQvdCwINGC0LXQu9C10YTQvtC9ISDQmtGA0LDRgdCw0LLRh9C40LohPC9wPjxwPtCV0YHQu9C4INGC0LLQvtGPINCw0L3QutC10YLQsCDQt9Cw0L/QvtC70L3QtdC90LAg4oCTINC00LXQvdGM0LPQuCDRgdC60L7RgNC+INGD0L/QsNC00YPRgiDQvdCwINGB0YfQtdGCINGC0LLQvtC10LPQviDQvNC+0LHQuNC70YzQvdC+0LPQvi4g0JXRgdC70Lgg0L3QtdGCIOKAkyDQt9Cw0L/QvtC70L3QuCDQtdC1LCDQvdC1INC+0YLQutC70LDQtNGL0LLQsNGPLiDQodC/0LDRgdC40LHQviwg0LjQs9GA0LDQuSDRgSDQvdCw0LzQuCDQtdGJ0LUhPC9wPjwvZGl2PjwvZGl2PlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vbXlwcml6ZXMuamFkZScpXHJcbnJlcXVlc3QgPSByZXF1aXJlICcuLi9yZXF1ZXN0J1xyXG5jb250YWluZXJfaWQgPSAwXHJcblxyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5vcGVuTW9kYWwgPSAoaWQsIG9wdHMpIC0+XHJcblx0Y29udGFpbmVyX2lkID0gaWRcclxuXHQkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7Y29udGFpbmVyX2lkfV1cIikuZmluZCgnLnBvcHVwJykuYWRkQ2xhc3MoJ3BvcHVwLS1teXByaXplcycpXHJcblxyXG5cdHJlcXVlc3QucHJpemUuZ2V0IHt9LCAocmVzKSAtPlxyXG5cdFx0Y29uc29sZS5sb2cgcmVzXHJcblx0XHRmb3Iga2V5LGVsIG9mIHJlc1xyXG5cdFx0XHRlbC5mb3JtYXR0ZWRfZGF0ZSA9IG1vbWVudChlbC5kYXRlKjEwMDApLmZvcm1hdChcIkRELk1NLllZWVlcIilcclxuXHRcdCQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tjb250YWluZXJfaWR9XVwiKS5maW5kKCcucG9wdXBfX2ZvcmxvYWRpbmcnKS5odG1sIHRlbXBsYXRlKHtpbmZvOnJlc30pXHJcblx0XHQkKFwiLm15cHJpemVzX19saXN0XCIpLmN1c3RvbVNjcm9sbCh7cHJlZml4OiBcImN1c3RvbS1iaWdzY3JvbGxfXCJ9KVxyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jbG9zZU1vZGFsID0gKGlkKSAtPlxyXG5cdCQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tjb250YWluZXJfaWR9XVwiKS5maW5kKCcucG9wdXAnKS5yZW1vdmVDbGFzcygncG9wdXAtLW15cHJpemVzJylcclxuIiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoaW5mbykge1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJteXByaXplc1xcXCI+PGgzIGNsYXNzPVxcXCJteXByaXplc19fdGl0bGVcXFwiPtCf0L7Qu9GD0YfQtdC90L3Ri9C1INC/0YDQuNC30Ys8L2gzPlwiKTtcbmlmICggIWluZm9bMF0gJiYgIWluZm9bMV0gJiYgIWluZm9bMl0pXG57XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcIm15cHJpemVzX19ub2xpc3RcXFwiPjxkaXYgY2xhc3M9XFxcIm15cHJpemVzX19uby1zdWJ0aXRsZVxcXCI+0KMg0YLQtdCx0Y8g0L/QvtC60LA8YnI+0L3QtdGCINC/0YDQuNC30L7QsiA6KDwvZGl2PjxkaXYgY2xhc3M9XFxcIm15cHJpemVzX19uby10ZXh0XFxcIj7Qn9GA0L7RhdC+0LTQuCDQutCy0LXRgdGC0YssINGB0L7QsdC40YDQsNC5INC60LDQuiDQvNC+0LbQvdC+PGJyPlxcbtCx0L7Qu9GM0YjQtSDQutGA0LXQutC10YDQvtCyIFRVQyDigJMg0Lgg0LTQtdC70LjRgdGMPGJyPlxcbtGB0LLQvtC40LzQuCDQtNC+0YHRgtC40LbQtdC90LjRj9C80Lgg0YEg0LTRgNGD0LfRjNGP0LzQuCE8YnI+XFxu0KLQsNC6INGC0Ysg0L/QvtCy0YvRgdC40YjRjCDRgdCy0L7QuCDRiNCw0L3RgdGLINC90LAg0L/RgNC40LcuPC9kaXY+PC9kaXY+XCIpO1xufVxuZWxzZVxue1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJteXByaXplc19fbGlzdFxcXCI+XCIpO1xuaWYgKCBpbmZvWzBdKVxue1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJteXByaXplc19fZGF0ZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gaW5mb1swXS5mb3JtYXR0ZWRfZGF0ZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PGRpdiBjbGFzcz1cXFwibXlwcml6ZXNfX2ljb24td3JhcHBlclxcXCI+PGkgY2xhc3M9XFxcImljb24tbXlwcml6ZXMtbW9uZXkgbXlwcml6ZXNfX21vbmV5cHJpemVcXFwiPjwvaT48L2Rpdj5cIik7XG59XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcIm15cHJpemVzX19zdWJ0aXRsZVxcXCI+0JfQsCDQutCy0LXRgdGC0Ys8L2Rpdj5cIik7XG5pZiAoICFpbmZvWzFdICYmICFpbmZvWzJdKVxue1xuYnVmLnB1c2goXCI8ZGl2PtCX0LTQtdGB0Ywg0L/QvtC60LAg0L3QuNGH0LXQs9C+INC90LXRgiA9KDwvZGl2PlwiKTtcbn1cbmlmICggaW5mb1sxXSlcbntcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibXlwcml6ZXNfX2RhdGVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGluZm9bMV0uZm9ybWF0dGVkX2RhdGUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjxkaXYgY2xhc3M9XFxcIm15cHJpemVzX19xdWVzdG5hbWVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGluZm9bMV0udGl0bGUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjxkaXYgY2xhc3M9XFxcIm15cHJpemVzX19pY29uLXdyYXBwZXJcXFwiPjxpIGNsYXNzPVxcXCJpY29uLXByaXplczEgbXlwcml6ZXNfX3N1cGVycHJpemVcXFwiPjwvaT48L2Rpdj48ZGl2IGNsYXNzPVxcXCJteXByaXplc19fcHJpemVuYW1lXFxcIj7QodCw0LzQvtC60LDRgiBPeGVsbyBUb3duPC9kaXY+XCIpO1xufVxuaWYgKCBpbmZvWzJdKVxue1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJteXByaXplc19fZGF0ZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gaW5mb1syXS5mb3JtYXR0ZWRfZGF0ZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PGRpdiBjbGFzcz1cXFwibXlwcml6ZXNfX2ljb24td3JhcHBlclxcXCI+XCIpO1xuaWYgKCBpbmZvWzJdLnBsYWNlPT0xKVxue1xuYnVmLnB1c2goXCI8aSBjbGFzcz1cXFwiaWNvbi1wcml6ZXMzIG15cHJpemVzX19zdXBlcnByaXplXFxcIj48L2k+XCIpO1xufVxuaWYgKCBpbmZvWzJdLnBsYWNlPT0yKVxue1xuYnVmLnB1c2goXCI8aSBjbGFzcz1cXFwiaWNvbi1wcml6ZXM0IG15cHJpemVzX19zdXBlcnByaXplXFxcIj48L2k+XCIpO1xufVxuaWYgKCBpbmZvWzJdLnBsYWNlPT0zKVxue1xuYnVmLnB1c2goXCI8aSBjbGFzcz1cXFwiaWNvbi1wcml6ZXM1IG15cHJpemVzX19zdXBlcnByaXplXFxcIj48L2k+XCIpO1xufVxuYnVmLnB1c2goXCI8L2Rpdj5cIik7XG5pZiAoIGluZm9bMl0ucGxhY2U9PTEpXG57XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcIm15cHJpemVzX19wcml6ZW5hbWVcXFwiPtCt0LvQtdC60YLRgNC+0YHQsNC80L7QutCw0YIgUmF6b3IgRTMwMDwvZGl2PlwiKTtcbn1cbmlmICggaW5mb1syXS5wbGFjZT09MilcbntcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibXlwcml6ZXNfX3ByaXplbmFtZVxcXCI+0JrQstCw0LTRgNC+0LrQvtC/0YLQtdGAIFBhcnJvdCBBUi5Ecm9uZSAyLjA8L2Rpdj5cIik7XG59XG5pZiAoIGluZm9bMl0ucGxhY2U9PTMpXG57XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcIm15cHJpemVzX19wcml6ZW5hbWVcXFwiPtCf0L7RgNGC0LDRgtC40LLQvdCw0Y8g0LrQvtC70L7QvdC60LAgSkJMIFB1bHNlPC9kaXY+XCIpO1xufVxufVxuYnVmLnB1c2goXCI8L2Rpdj5cIik7XG59XG5idWYucHVzaChcIjwvZGl2PlwiKTt9LmNhbGwodGhpcyxcImluZm9cIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmluZm86dHlwZW9mIGluZm8hPT1cInVuZGVmaW5lZFwiP2luZm86dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwibmV3dGFzdGVUZW1wbGF0ZSA9IHJlcXVpcmUoJy4vbmV3dGFzdGUuamFkZScpXHJcbnJlcXVlc3QgPSByZXF1aXJlKCcuLi9yZXF1ZXN0JylcclxucG9wdXBzID0gcmVxdWlyZSAnLi9pbmRleC5jb2ZmZWUnXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5vcGVuTW9kYWwgPSAoaWQpIC0+XHJcbiAgY29udGFpbmVyX2lkID0gaWRcclxuICAkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7aWR9XVwiKVxyXG4gICQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tpZH1dXCIpLmZpbmQoJy5wb3B1cF9fZm9ybG9hZGluZycpLmh0bWwobmV3dGFzdGVUZW1wbGF0ZSlcclxuICAkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7aWR9XVwiKS5maW5kKCcucG9wdXAnKS5hZGRDbGFzcygncG9wdXBfX3Rhc3RlJylcclxuXHJcbiIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcInRhc3RlX193cmFwXFxcIj48aDIgY2xhc3M9XFxcInRhc3RlX190aXRsZVxcXCI+0JjQvNC10L3QvdC+ITwvaDI+PGRpdiBjbGFzcz1cXFwidGFzdGVfX2JvZHlcXFwiPjxkaXYgY2xhc3M9XFxcInRhc3RlX19ib2R5LXRleHRcXFwiPjxwPtCd0LDRh9C40YHQu9GP0LXQvCDRgtC10LHQtSAyMDAg0LHQsNC70LvQvtCyLjwvcD48cD7QndC1INC30LDQsdGD0LTRjCDQv9C+0L/RgNC+0LHQvtCy0LDRgtGMPC9wPjxQPtCd0L7QstGL0LkgVHVjITwvUD48L2Rpdj48ZGl2IGNsYXNzPVxcXCJ0YXN0ZV9fYm9keS1pbWdcXFwiPjxpbWcgc3JjPVxcXCJpbWcvaW1hZ2VzL3R1Yy0yMDAucG5nXFxcIi8+PC9kaXY+PC9kaXY+PC9kaXY+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInBpenphVGVtcGxhdGUgPSByZXF1aXJlKCcuL3BpenphLmphZGUnKVxyXG5yZXF1ZXN0ID0gcmVxdWlyZSgnLi4vcmVxdWVzdCcpXHJcblxyXG5jb250YWluZXJfaWQgPSAwXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5vcGVuTW9kYWwgPSAoaWQsIG9iaikgLT5cclxuXHRjb250YWluZXJfaWQgPSBpZFxyXG5cdGNvbnNvbGUubG9nIG9ialxyXG5cdCQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tjb250YWluZXJfaWR9XVwiKS5maW5kKCcucG9wdXAnKS5hZGRDbGFzcygncG9wdXAtLXBpenphJylcclxuXHQkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7Y29udGFpbmVyX2lkfV1cIikuZmluZCgnLnBvcHVwX19mb3Jsb2FkaW5nJykuaHRtbCBwaXp6YVRlbXBsYXRlKHtpbmZvOiBvYmp9KVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNsb3NlTW9kYWwgPSAtPlxyXG5cdCQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tjb250YWluZXJfaWR9XVwiKS5maW5kKCcucG9wdXAnKS5yZW1vdmVDbGFzcygncG9wdXAtLXBpenphJylcclxuXHJcblxyXG4iLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJjaHBvcHVwXFxcIj48ZGl2IGNsYXNzPVxcXCJjaHBvcHVwX19waXp6YS10aXRsZVxcXCI+KzUwINCx0LDQu9C70L7QsiE8L2Rpdj48ZGl2IGNsYXNzPVxcXCJjaHBvcHVwX19waXp6YS1kZXNjXFxcIj7Qn9C+0LfQtNGA0LDQstC70Y/QtdC8LCDRgtGLINC90LDRiNC10Lsg0L3QvtCy0YvQuSBUVUMg0J/QuNGG0YbQsCFcXG7QkCDRgtC10L/QtdGA0Ywg0L/QvtC/0YDQvtCx0YPQuSDQvdCw0LnRgtC4INC10LPQviDQv9C+LdC90LDRgdGC0L7Rj9GJ0LXQvNGDINCyINC80LDQs9Cw0LfQuNC90LDRhSDRgdCy0L7QtdCz0L4g0LPQvtGA0L7QtNCwITwvZGl2PjxkaXYgY2xhc3M9XFxcImNocG9wdXBfX3BpenphLWRlc2MyXFxcIj7Qo9C00LDRh9C4INC4INC/0YDQuNGP0YLQvdC+0LPQviDQsNC/0L/QtdGC0LjRgtCwITwvZGl2PjwvZGl2PlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChob3N0LCBsZWFkZXJzLCB1bmRlZmluZWQpIHtcbi8vIGl0ZXJhdGUgbGVhZGVyc1xuOyhmdW5jdGlvbigpe1xuICB2YXIgJCRvYmogPSBsZWFkZXJzO1xuICBpZiAoJ251bWJlcicgPT0gdHlwZW9mICQkb2JqLmxlbmd0aCkge1xuXG4gICAgZm9yICh2YXIgaW5kZXggPSAwLCAkJGwgPSAkJG9iai5sZW5ndGg7IGluZGV4IDwgJCRsOyBpbmRleCsrKSB7XG4gICAgICB2YXIgbGVhZGVyID0gJCRvYmpbaW5kZXhdO1xuXG5idWYucHVzaChcIjxhXCIgKyAoamFkZS5hdHRyKFwiaHJlZlwiLCBcIlwiICsgKGhvc3QrbGVhZGVyLmxpbmspICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIHRhcmdldD1cXFwiX2JsYW5rXFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19lbFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fY291bnRlclxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gbGVhZGVyLnBsYWNlKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48aW1nXCIgKyAoamFkZS5hdHRyKFwic3JjXCIsIFwiXCIgKyAobGVhZGVyLnBob3RvKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwibGVhZGVyc19fcGhvdG9cXFwiLz48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19yaWdodFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fbmFtZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gbGVhZGVyLm5pY2tuYW1lKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj48L2Rpdj48L2E+XCIpO1xuICAgIH1cblxuICB9IGVsc2Uge1xuICAgIHZhciAkJGwgPSAwO1xuICAgIGZvciAodmFyIGluZGV4IGluICQkb2JqKSB7XG4gICAgICAkJGwrKzsgICAgICB2YXIgbGVhZGVyID0gJCRvYmpbaW5kZXhdO1xuXG5idWYucHVzaChcIjxhXCIgKyAoamFkZS5hdHRyKFwiaHJlZlwiLCBcIlwiICsgKGhvc3QrbGVhZGVyLmxpbmspICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIHRhcmdldD1cXFwiX2JsYW5rXFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19lbFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fY291bnRlclxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gbGVhZGVyLnBsYWNlKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48aW1nXCIgKyAoamFkZS5hdHRyKFwic3JjXCIsIFwiXCIgKyAobGVhZGVyLnBob3RvKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwibGVhZGVyc19fcGhvdG9cXFwiLz48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19yaWdodFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fbmFtZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gbGVhZGVyLm5pY2tuYW1lKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj48L2Rpdj48L2E+XCIpO1xuICAgIH1cblxuICB9XG59KS5jYWxsKHRoaXMpO1xufS5jYWxsKHRoaXMsXCJob3N0XCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5ob3N0OnR5cGVvZiBob3N0IT09XCJ1bmRlZmluZWRcIj9ob3N0OnVuZGVmaW5lZCxcImxlYWRlcnNcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmxlYWRlcnM6dHlwZW9mIGxlYWRlcnMhPT1cInVuZGVmaW5lZFwiP2xlYWRlcnM6dW5kZWZpbmVkLFwidW5kZWZpbmVkXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC51bmRlZmluZWQ6dHlwZW9mIHVuZGVmaW5lZCE9PVwidW5kZWZpbmVkXCI/dW5kZWZpbmVkOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGFjdGl2ZSwgbGVmdF9hY3RpdmUsIHBhZ2VzLCByaWdodF9hY3RpdmUsIHVuZGVmaW5lZCkge1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJwYWdpbmF0aW9uXFxcIj48c3BhblwiICsgKGphZGUuY2xzKFsncGFnaW5hdGlvbl9fbGVmdGJ1dCcsbGVmdF9hY3RpdmUgPyBcInBhZ2luYXRpb25fX2J1dC0tYWN0aXZlXCIgOiBcIlwiXSwgW251bGwsdHJ1ZV0pKSArIFwiPjw8L3NwYW4+XCIpO1xuLy8gaXRlcmF0ZSBwYWdlc1xuOyhmdW5jdGlvbigpe1xuICB2YXIgJCRvYmogPSBwYWdlcztcbiAgaWYgKCdudW1iZXInID09IHR5cGVvZiAkJG9iai5sZW5ndGgpIHtcblxuICAgIGZvciAodmFyICRpbmRleCA9IDAsICQkbCA9ICQkb2JqLmxlbmd0aDsgJGluZGV4IDwgJCRsOyAkaW5kZXgrKykge1xuICAgICAgdmFyIHBhZ2UgPSAkJG9ialskaW5kZXhdO1xuXG5pZiAoIHBhZ2U9PVwiZG90c1wiKVxue1xuYnVmLnB1c2goXCI8c3BhbiBjbGFzcz1cXFwicGFnaW5hdGlvbl9fZG90c1xcXCI+Li4uPC9zcGFuPlwiKTtcbn1cbmVsc2VcbntcbmJ1Zi5wdXNoKFwiPHNwYW5cIiArIChqYWRlLmF0dHIoXCJkYXRhLWhyZWZcIiwgXCJcIiArIChwYWdlLnZhbHVlKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyAoamFkZS5jbHMoWydwYWdpbmF0aW9uX19wYWdlJywoYWN0aXZlPT1wYWdlLnZhbHVlKSA/IFwicGFnaW5hdGlvbl9fcGFnZS0tYWN0aXZlXCIgOiBcIlwiXSwgW251bGwsdHJ1ZV0pKSArIFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IHBhZ2UudGV4dCkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9zcGFuPlwiKTtcbn1cbiAgICB9XG5cbiAgfSBlbHNlIHtcbiAgICB2YXIgJCRsID0gMDtcbiAgICBmb3IgKHZhciAkaW5kZXggaW4gJCRvYmopIHtcbiAgICAgICQkbCsrOyAgICAgIHZhciBwYWdlID0gJCRvYmpbJGluZGV4XTtcblxuaWYgKCBwYWdlPT1cImRvdHNcIilcbntcbmJ1Zi5wdXNoKFwiPHNwYW4gY2xhc3M9XFxcInBhZ2luYXRpb25fX2RvdHNcXFwiPi4uLjwvc3Bhbj5cIik7XG59XG5lbHNlXG57XG5idWYucHVzaChcIjxzcGFuXCIgKyAoamFkZS5hdHRyKFwiZGF0YS1ocmVmXCIsIFwiXCIgKyAocGFnZS52YWx1ZSkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgKGphZGUuY2xzKFsncGFnaW5hdGlvbl9fcGFnZScsKGFjdGl2ZT09cGFnZS52YWx1ZSkgPyBcInBhZ2luYXRpb25fX3BhZ2UtLWFjdGl2ZVwiIDogXCJcIl0sIFtudWxsLHRydWVdKSkgKyBcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBwYWdlLnRleHQpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvc3Bhbj5cIik7XG59XG4gICAgfVxuXG4gIH1cbn0pLmNhbGwodGhpcyk7XG5cbmJ1Zi5wdXNoKFwiPHNwYW5cIiArIChqYWRlLmNscyhbJ3BhZ2luYXRpb25fX3JpZ2h0YnV0JyxyaWdodF9hY3RpdmUgPyBcInBhZ2luYXRpb25fX2J1dC0tYWN0aXZlXCIgOiBcIlwiXSwgW251bGwsdHJ1ZV0pKSArIFwiPj48L3NwYW4+PC9kaXY+XCIpO30uY2FsbCh0aGlzLFwiYWN0aXZlXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5hY3RpdmU6dHlwZW9mIGFjdGl2ZSE9PVwidW5kZWZpbmVkXCI/YWN0aXZlOnVuZGVmaW5lZCxcImxlZnRfYWN0aXZlXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5sZWZ0X2FjdGl2ZTp0eXBlb2YgbGVmdF9hY3RpdmUhPT1cInVuZGVmaW5lZFwiP2xlZnRfYWN0aXZlOnVuZGVmaW5lZCxcInBhZ2VzXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5wYWdlczp0eXBlb2YgcGFnZXMhPT1cInVuZGVmaW5lZFwiP3BhZ2VzOnVuZGVmaW5lZCxcInJpZ2h0X2FjdGl2ZVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgucmlnaHRfYWN0aXZlOnR5cGVvZiByaWdodF9hY3RpdmUhPT1cInVuZGVmaW5lZFwiP3JpZ2h0X2FjdGl2ZTp1bmRlZmluZWQsXCJ1bmRlZmluZWRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnVuZGVmaW5lZDp0eXBlb2YgdW5kZWZpbmVkIT09XCJ1bmRlZmluZWRcIj91bmRlZmluZWQ6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwibGVhZGVyc1RlbXBsYXRlID0gcmVxdWlyZSgnLi9yYXRpbmcuamFkZScpXHJcbmxpc3RUZW1wbGF0ZSA9IHJlcXVpcmUgJy4vcmF0aW5nLWxpc3QuamFkZSdcclxucGFnVGVtcGxhdGUgPSByZXF1aXJlICcuL3JhdGluZy1wYWdpbmF0aW9uLmphZGUnXHJcbmNvbnRhaW5lcl9pZCA9IDBcclxucmVxdWVzdCA9IHJlcXVpcmUgJy4uL3JlcXVlc3QnXHJcblxyXG5QQUdFX0VMUyA9IDUwXHJcbmhvc3QgPSB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wrXCIvL3ZrLmNvbS9pZFwiXHJcbmNvbW1vbl9wYWdlID0gMFxyXG5jdXJyZW50X3BhZ2UgPSAwXHJcbmN1cnR5cGUgPSBcImNvbW1vblwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5vcGVuTW9kYWwgPSAoaWQpIC0+XHJcblx0Y29udGFpbmVyX2lkID0gaWRcclxuXHRyZXF1ZXN0LnJhdGluZy5hbGwge29mZnNldDogMCwgY291bnQ6IFBBR0VfRUxTfSwgKHJlcykgLT5cclxuXHRcdGNvbnNvbGUubG9nIHJlc1xyXG5cclxuXHRcdCQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tjb250YWluZXJfaWR9XVwiKS5maW5kKCcucG9wdXBfX2ZvcmxvYWRpbmcnKS5odG1sIGxlYWRlcnNUZW1wbGF0ZSh7cmVzOnJlcywgaG9zdDpob3N0fSlcclxuXHRcdHN3aXRjaExpc3RlbmVycygpXHJcblx0XHQkKCcucG9wbGVhZGVyc19fY29tbW9uIC5wb3BsZWFkZXJzX19jYXQnKS5odG1sIGxpc3RUZW1wbGF0ZSh7bGVhZGVyczogcmVzLmNvbW1vbi5sZWFkZXJzLCBob3N0Omhvc3R9KVxyXG5cdFx0JCgnLnBvcGxlYWRlcnNfX2N1cnJlbnQgLnBvcGxlYWRlcnNfX2NhdCcpLmh0bWwgbGlzdFRlbXBsYXRlKHtsZWFkZXJzOiByZXMuY3VycmVudC5sZWFkZXJzLCBob3N0Omhvc3R9KVxyXG5cdFx0aGFuZGxlUGFnZXMoXCJjb21tb25cIiwgcmVzLmNvbW1vbilcclxuXHRcdGhhbmRsZVBhZ2VzKFwiY3VycmVudFwiLCByZXMuY3VycmVudClcclxuXHJcblxyXG5cdFx0JChcIi5wb3BsZWFkZXJzX19jb21tb24gLnBvcGxlYWRlcnNfX2xpc3RcIikuY3VzdG9tU2Nyb2xsKClcclxuXHRcdCQoXCIucG9wbGVhZGVyc19fY3VycmVudCAucG9wbGVhZGVyc19fbGlzdFwiKS5jdXN0b21TY3JvbGwoKVxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2xvc2VNb2RhbCA9IC0+XHJcblxyXG5oYW5kbGVQYWdlcyA9ICh0eXBlLCBvYmosIGFjdGl2ZSkgLT5cclxuXHRwYWdlcyA9IFtdXHJcblx0YWN0aXZlID0gcGFyc2VJbnQoYWN0aXZlKSB8fCAwXHJcblx0cGFnZXNfbnVtID0gTWF0aC5jZWlsKG9iai5jb3VudC9QQUdFX0VMUylcclxuXHRsZWZ0X2FjdGl2ZSA9IHJpZ2h0X2FjdGl2ZSA9IHRydWVcclxuXHRpZiBhY3RpdmU9PTAgdGhlbiBsZWZ0X2FjdGl2ZSA9IGZhbHNlXHJcblx0aWYgYWN0aXZlPT1wYWdlc19udW0tMSB0aGVuIHJpZ2h0X2FjdGl2ZSA9IGZhbHNlXHJcblxyXG5cclxuXHRpZihvYmouY291bnQ8PVBBR0VfRUxTKVxyXG5cdFx0cGFnZXMgPSBbeyB0ZXh0OiAxLCB2YWx1ZTogMH1dXHJcblx0XHRhY3RpdmUgPSAwXHJcblxyXG5cdGVsc2UgaWYoUEFHRV9FTFM8b2JqLmNvdW50PD1QQUdFX0VMUyo0KVxyXG5cdFx0cGFnZXMgPSBbe3ZhbHVlOmksIHRleHQ6aSsxfSBmb3IgaSBpbiBbMC4uLnBhZ2VzX251bV1dWzBdXHJcblx0ZWxzZVxyXG5cdFx0aWYgYWN0aXZlPD0xXHJcblx0XHRcdGZvciBpIGluIFswLi4uM11cclxuXHRcdFx0XHRwYWdlcy5wdXNoIHt2YWx1ZTppLCB0ZXh0OiBpKzF9XHJcblx0XHRcdGlmIHBhZ2VzX251bT4zKzEgdGhlbiBwYWdlcy5wdXNoKFwiZG90c1wiKVxyXG5cdFx0XHRwYWdlcy5wdXNoKHt2YWx1ZTpwYWdlc19udW0tMSwgdGV4dDogcGFnZXNfbnVtfSlcclxuXHRcdGVsc2UgaWYgYWN0aXZlPHBhZ2VzX251bS0yXHJcblx0XHRcdHBhZ2VzLnB1c2ggeyB0ZXh0OiAxLCB2YWx1ZTogMH1cclxuXHRcdFx0aWYgYWN0aXZlPj0zIHRoZW4gcGFnZXMucHVzaChcImRvdHNcIilcclxuXHRcdFx0Zm9yIGkgaW4gW2FjdGl2ZS0xLCBhY3RpdmUsIGFjdGl2ZSsxXVxyXG5cdFx0XHRcdHBhZ2VzLnB1c2gge3ZhbHVlOmksIHRleHQ6IGkrMX1cclxuXHRcdFx0aWYgYWN0aXZlPD1wYWdlc19udW0tNCB0aGVuIHBhZ2VzLnB1c2goXCJkb3RzXCIpXHJcblx0XHRcdHBhZ2VzLnB1c2goe3ZhbHVlOnBhZ2VzX251bS0xLCB0ZXh0OiBwYWdlc19udW19KVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRwYWdlcy5wdXNoIHsgdGV4dDogMSwgdmFsdWU6IDB9XHJcblx0XHRcdGlmIGFjdGl2ZT49MyB0aGVuIHBhZ2VzLnB1c2goXCJkb3RzXCIpXHJcblx0XHRcdGZvciBpIGluIFtwYWdlc19udW0tMy4ucGFnZXNfbnVtLTFdXHJcblx0XHRcdFx0cGFnZXMucHVzaCB7dmFsdWU6aSwgdGV4dDogaSsxfVxyXG5cclxuXHQkKCcucG9wbGVhZGVyc19fY29tbW9uIC5wb3BsZWFkZXJzX19wYWdpbmF0aW9uJykuaHRtbCBwYWdUZW1wbGF0ZSh7cGFnZXM6IHBhZ2VzLCBhY3RpdmU6YWN0aXZlLCBsZWZ0X2FjdGl2ZTogbGVmdF9hY3RpdmUsIHJpZ2h0X2FjdGl2ZTogcmlnaHRfYWN0aXZlfSkgaWYgdHlwZT09XCJjb21tb25cIlxyXG5cdCQoJy5wb3BsZWFkZXJzX19jdXJyZW50IC5wb3BsZWFkZXJzX19wYWdpbmF0aW9uJykuaHRtbCBwYWdUZW1wbGF0ZSh7cGFnZXM6IHBhZ2VzLCBhY3RpdmU6YWN0aXZlLCBsZWZ0X2FjdGl2ZTogbGVmdF9hY3RpdmUsIHJpZ2h0X2FjdGl2ZTogcmlnaHRfYWN0aXZlfSkgaWYgdHlwZT09XCJjdXJyZW50XCJcclxuXHJcbnN3aXRjaExpc3RlbmVycyA9IC0+XHJcblx0JCgnLmxlYWRlcnNfX3N3aXRjaGNvbW1vbicpLm9uICdjbGljaycsIC0+XHJcblx0XHQkKCcubGVhZGVyc19fc3dpdGNoY29tbW9uJykuYWRkQ2xhc3MoJ2xlYWRlcnNfX3N3aXRjaGJ1dC0tYWN0aXZlJylcclxuXHRcdCQoJy5sZWFkZXJzX19zd2l0Y2hjdXJyZW50JykucmVtb3ZlQ2xhc3MoJ2xlYWRlcnNfX3N3aXRjaGJ1dC0tYWN0aXZlJylcclxuXHRcdCQoJy5wb3BsZWFkZXJzX19jb21tb24nKS5hZGRDbGFzcygncG9wbGVhZGVyX19hY3RpdmUnKVxyXG5cdFx0JCgnLnBvcGxlYWRlcnNfX2N1cnJlbnQnKS5yZW1vdmVDbGFzcygncG9wbGVhZGVyX19hY3RpdmUnKVxyXG5cdFx0Y3VydHlwZSA9IFwiY29tbW9uXCJcclxuXHQkKCcubGVhZGVyc19fc3dpdGNoY3VycmVudCcpLm9uICdjbGljaycsIC0+XHJcblx0XHQkKCcubGVhZGVyc19fc3dpdGNoY3VycmVudCcpLmFkZENsYXNzKCdsZWFkZXJzX19zd2l0Y2hidXQtLWFjdGl2ZScpXHJcblx0XHQkKCcubGVhZGVyc19fc3dpdGNoY29tbW9uJykucmVtb3ZlQ2xhc3MoJ2xlYWRlcnNfX3N3aXRjaGJ1dC0tYWN0aXZlJylcclxuXHRcdCQoJy5wb3BsZWFkZXJzX19jdXJyZW50JykuYWRkQ2xhc3MoJ3BvcGxlYWRlcl9fYWN0aXZlJylcclxuXHRcdCQoJy5wb3BsZWFkZXJzX19jb21tb24nKS5yZW1vdmVDbGFzcygncG9wbGVhZGVyX19hY3RpdmUnKVxyXG5cdFx0Y3VydHlwZSA9IFwiY3VycmVudFwiXHJcblx0JCgnLnBvcGxlYWRlcnNfX3RhYicpLm9uICdjbGljaycsICcucGFnaW5hdGlvbl9fbGVmdGJ1dCcsIC0+XHJcblx0XHR1bmxlc3MgJCh0aGlzKS5oYXNDbGFzcygncGFnaW5hdGlvbl9fYnV0LS1hY3RpdmUnKSB0aGVuIHJldHVyblxyXG5cdFx0Y29uc29sZS5sb2cgJ2xlZnQnXHJcblx0XHRpZiBjdXJ0eXBlPT1cImNvbW1vblwiIHRoZW4gc3dpdGNoUGFnZShjdXJ0eXBlLCBnZXRDb21tb25QYWdlKCktMSlcclxuXHRcdGlmIGN1cnR5cGU9PVwiY3VycmVudFwiIHRoZW4gc3dpdGNoUGFnZShjdXJ0eXBlLCBnZXRDdXJyZW50UGFnZSgpLTEpXHJcblxyXG5cdCQoJy5wb3BsZWFkZXJzX190YWInKS5vbiAnY2xpY2snLCAnLnBhZ2luYXRpb25fX3JpZ2h0YnV0JywgLT5cclxuXHRcdHVubGVzcyAkKHRoaXMpLmhhc0NsYXNzKCdwYWdpbmF0aW9uX19idXQtLWFjdGl2ZScpIHRoZW4gcmV0dXJuXHJcblx0XHRpZiBjdXJ0eXBlPT1cImNvbW1vblwiIHRoZW4gc3dpdGNoUGFnZShjdXJ0eXBlLCBnZXRDb21tb25QYWdlKCkrMSlcclxuXHRcdGlmIGN1cnR5cGU9PVwiY3VycmVudFwiIHRoZW4gc3dpdGNoUGFnZShjdXJ0eXBlLCBnZXRDdXJyZW50UGFnZSgpKzEpXHJcblxyXG5cdCQoJy5wb3BsZWFkZXJzJykub24gJ2NsaWNrJywgJy5wYWdpbmF0aW9uX19wYWdlJywgLT5cclxuXHRcdHJldHVybiBpZiAkKHRoaXMpLmhhc0NsYXNzKCdwYWdpbmF0aW9uX19wYWdlLS1hY3RpdmUnKVxyXG5cdFx0dHlwZSA9ICQodGhpcykuY2xvc2VzdCgnLnBvcGxlYWRlcnNfX3RhYicpLmF0dHIoJ2RhdGEtdHlwZScpXHJcblx0XHR2YWwgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtaHJlZicpXHJcblx0XHRzd2l0Y2hQYWdlKHR5cGUsIHZhbClcclxuXHJcbmdldEN1cnJlbnRQYWdlID0gLT4gcmV0dXJuIGN1cnJlbnRfcGFnZVxyXG5nZXRDb21tb25QYWdlID0gLT4gcmV0dXJuIGNvbW1vbl9wYWdlXHJcblxyXG5zd2l0Y2hQYWdlID0gKHR5cGUsIHZhbCkgLT5cclxuXHRyZXF1ZXN0LnJhdGluZ1t0eXBlXSB7Y291bnQ6IFBBR0VfRUxTLCBvZmZzZXQ6IHZhbCpQQUdFX0VMU30sIChyZXMpLT5cclxuXHRcdGhhbmRsZVBhZ2VzKHR5cGUsIHJlcywgdmFsKVxyXG5cdFx0aWYgdHlwZT09XCJjb21tb25cIlxyXG5cdFx0XHQkKCcucG9wbGVhZGVyc19fY29tbW9uIC5wb3BsZWFkZXJzX19jYXQnKS5odG1sIGxpc3RUZW1wbGF0ZSh7bGVhZGVyczogcmVzLmxlYWRlcnMsIGhvc3Q6aG9zdH0pXHJcblx0XHRcdCQoJy5wb3BsZWFkZXJzX19jb21tb24gLmN1c3RvbS1zY3JvbGxfaW5uZXInKS5zY3JvbGxUb3AoMClcclxuXHRcdFx0Y29tbW9uX3BhZ2UgPSBwYXJzZUludCB2YWxcclxuXHRcdGlmIHR5cGU9PVwiY3VycmVudFwiXHJcblx0XHRcdCQoJy5wb3BsZWFkZXJzX19jdXJyZW50IC5wb3BsZWFkZXJzX19jYXQnKS5odG1sIGxpc3RUZW1wbGF0ZSh7bGVhZGVyczogcmVzLmxlYWRlcnMsIGhvc3Q6aG9zdH0pXHJcblx0XHRcdCQoJy5wb3BsZWFkZXJzX19jdXJyZW50IC5jdXN0b20tc2Nyb2xsX2lubmVyJykuc2Nyb2xsVG9wKDApXHJcblx0XHRcdGN1cnJlbnRfcGFnZSA9IHBhcnNlSW50IHZhbFxyXG4iLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChyZXMpIHtcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwicG9wdXBfX3dyYXAtLWludHJvXFxcIj48ZGl2IGNsYXNzPVxcXCJwb3BsZWFkZXJzXFxcIj48ZGl2IGNsYXNzPVxcXCJwb3BsZWFkZXJzX19sZWZ0XFxcIj48aDMgY2xhc3M9XFxcInBvcGxlYWRlcnNfX3RpdGxlXFxcIj7QoNC10LnRgtC40L3QsyDQuNCz0YDRizwvaDM+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fc3dpdGNoZXJfd3JhcHBlclxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fc3dpdGNoZXJcXFwiPjxkaXYgZGF0YS1ocmVmPVxcXCIucG9wbGVhZGVyc19fY2F0LS1jdXJyZW50XFxcIiBjbGFzcz1cXFwibGVhZGVyc19fc3dpdGNoYnV0IGxlYWRlcnNfX3N3aXRjaGN1cnJlbnRcXFwiPtCi0LXQutGD0YnQuNC5PC9kaXY+PGRpdiBkYXRhLWhyZWY9XFxcIi5wb3BsZWFkZXJzX19jYXQtLWNvbW1vblxcXCIgY2xhc3M9XFxcImxlYWRlcnNfX3N3aXRjaGJ1dCBsZWFkZXJzX19zd2l0Y2hidXQtLWFjdGl2ZSBsZWFkZXJzX19zd2l0Y2hjb21tb25cXFwiPtCe0LHRidC40Lk8L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJwb3BsZWFkZXJzX19yaWdodFxcXCI+PGRpdiBkYXRhLXR5cGU9XFxcImNvbW1vblxcXCIgY2xhc3M9XFxcInBvcGxlYWRlcnNfX2NvbW1vbiBwb3BsZWFkZXJzX190YWIgcG9wbGVhZGVyX19hY3RpdmVcXFwiPjxkaXYgY2xhc3M9XFxcInBvcGxlYWRlcnNfX2xpc3RcXFwiPjxkaXYgY2xhc3M9XFxcInBvcGxlYWRlcnNfX2NhdFxcXCI+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fZWxcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2NvdW50ZXJcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IHJlcy5jb21tb24ueW91LnBsYWNlKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48aW1nXCIgKyAoamFkZS5hdHRyKFwic3JjXCIsIFwiXCIgKyAocmVzLmNvbW1vbi55b3UucGhvdG8pICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJsZWFkZXJzX19waG90b1xcXCIvPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3JpZ2h0XFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19uYW1lXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSByZXMuY29tbW9uLnlvdS5uaWNrbmFtZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwicG9wbGVhZGVyc19fcGFnaW5hdGlvblxcXCI+PC9kaXY+PC9kaXY+PGRpdiBkYXRhLXR5cGU9XFxcImN1cnJlbnRcXFwiIGNsYXNzPVxcXCJwb3BsZWFkZXJzX19jdXJyZW50IHBvcGxlYWRlcnNfX3RhYlxcXCI+PGRpdiBjbGFzcz1cXFwicG9wbGVhZGVyc19fbGlzdFxcXCI+PGRpdiBjbGFzcz1cXFwicG9wbGVhZGVyc19fY2F0XFxcIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19lbFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fY291bnRlclxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gcmVzLmN1cnJlbnQueW91LnBsYWNlKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48aW1nXCIgKyAoamFkZS5hdHRyKFwic3JjXCIsIFwiXCIgKyAocmVzLmN1cnJlbnQueW91LnBob3RvKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwibGVhZGVyc19fcGhvdG9cXFwiLz48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19yaWdodFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fbmFtZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gcmVzLmN1cnJlbnQueW91Lm5pY2tuYW1lKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJwb3BsZWFkZXJzX19wYWdpbmF0aW9uXFxcIj48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj5cIik7fS5jYWxsKHRoaXMsXCJyZXNcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnJlczp0eXBlb2YgcmVzIT09XCJ1bmRlZmluZWRcIj9yZXM6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidXNlcmluZm9UZW1wbGF0ZSA9IHJlcXVpcmUoJy4vdXNlcmluZm8uamFkZScpXHJcbnJlcXVlc3QgPSByZXF1aXJlKCcuLi9yZXF1ZXN0JylcclxucG9wdXBzID0gcmVxdWlyZSAnLi9pbmRleC5jb2ZmZWUnXHJcblxyXG5lZGl0aW5nID0gdHJ1ZVxyXG5ub2Z1bGwgPSBmYWxzZVxyXG5jYWxsYmFjayA9IG51bGxcclxuY29udGFpbmVyX2lkID0gMFxyXG5cclxubW9kdWxlLmV4cG9ydHMub3Blbk1vZGFsID0gKGlkLCBvYmo9e30sIF9jYWxsYmFjaykgLT5cclxuXHRlZGl0aW5nID0gdHJ1ZVxyXG5cdGNhbGxiYWNrID0gX2NhbGxiYWNrXHJcblx0Y29udGFpbmVyX2lkID0gaWRcclxuXHQkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7aWR9XVwiKS5maW5kKCcucG9wdXAnKS5hZGRDbGFzcygncG9wdXAtLXVzZXJpbmZvJylcclxuXHJcblxyXG5cdHJlcXVlc3QudXNlci5nZXQge30sIChyZXMpIC0+XHJcblx0XHRub2Z1bGwgPSBvYmoubm9mdWxsXHJcblx0XHRnZXRVc2VyWEhSSGFuZGxlcihyZXMpXHJcblxyXG5cdFx0JCgnLnVzZXJpbmZvX19mb3JtJykub24gXCJzdWJtaXRcIiwgZm9ybU9wZW5IYW5kbGVyXHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNsb3NlTW9kYWwgPSAtPlxyXG5cdCQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tjb250YWluZXJfaWR9XVwiKS5maW5kKCcucG9wdXAnKS5yZW1vdmVDbGFzcygncG9wdXAtLXVzZXJpbmZvJylcclxuXHQkKCcudXNlcmluZm9fX2Zvcm0nKS5vZmYgXCJzdWJtaXRcIiwgZm9ybU9wZW5IYW5kbGVyXHJcblxyXG5cclxuZ2V0VXNlclhIUkhhbmRsZXIgPSAocmVzKSAtPlxyXG5cdCQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tjb250YWluZXJfaWR9XVwiKS5maW5kKCcucG9wdXBfX2ZvcmxvYWRpbmcnKS5odG1sIHVzZXJpbmZvVGVtcGxhdGUoe3VzZXI6cmVzWzBdLCBub2Z1bGw6bm9mdWxsfSlcclxuXHQkKCcudXNlcmluZm9fX2Vycm9yLW1lcycpLmFkZENsYXNzKCd1c2VyaW5mb19fZXJyb3ItbWVzLS1pbnZpcycpXHJcblx0JCgnLnVzZXJpbmZvX19pbnB1dFtuYW1lPVwiYmRhdGVcIl0nKS5tYXNrICcwOS4wOS4wMDAwJywgdHJhbnNsYXRpb246IHtcclxuXHRcdCc5Jzoge3BhdHRlcm46IC9cXGQvLCBvcHRpb25hbDogdHJ1ZX1cclxuXHR9XHJcblx0JCgnLnVzZXJpbmZvX19pbnB1dFtuYW1lPVwicGhvbmVcIl0nKS5tYXNrKCcrNyAwMDAgMDAwIDAwMDAnKVxyXG5cclxuXHJcbmZvcm1PcGVuSGFuZGxlciA9IChlKSAtPlxyXG5cdGUucHJldmVudERlZmF1bHQoKSBpZiBlP1xyXG5cdGVkaXRpbmcgPSAhZWRpdGluZ1xyXG5cdGlmIGVkaXRpbmdcclxuXHRcdCQoJy51c2VyaW5mb19faW5wdXQnKS5lYWNoIChpLGVsKSAtPlxyXG5cdFx0XHR0ZXh0ID0gJChlbCkucGFyZW50KCkuZmluZChcIi51c2VyaW5mb19fdmFsdWVcIikudGV4dCgpXHJcblx0XHRcdCQoZWwpLnZhbCh0ZXh0KVxyXG5cdFx0JCgnLnVzZXJpbmZvJykuYWRkQ2xhc3MoJ3VzZXJpbmZvLS1lZGl0aW5nJylcclxuXHRcdCQoJy51c2VyaW5mb19fY2hlY2tib3gnKS5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIilcclxuXHRlbHNlXHJcblx0XHQkKCcudXNlcmluZm9fX3ZhbHVlJykuZWFjaCAoaSxlbCkgLT5cclxuXHRcdFx0dGV4dCA9ICQoZWwpLnBhcmVudCgpLmZpbmQoXCIudXNlcmluZm9fX2lucHV0XCIpLnZhbCgpXHJcblx0XHRcdCQoZWwpLnRleHQodGV4dClcclxuXHRcdCQoJy51c2VyaW5mbycpLnJlbW92ZUNsYXNzKCd1c2VyaW5mby0tZWRpdGluZycpXHJcblx0XHQkKCcudXNlcmluZm9fX2NoZWNrYm94JykuYXR0cihcImRpc2FibGVkXCIsIHRydWUpXHJcblx0XHRzYXZlVXNlcih0aGlzKVxyXG5cclxuc2F2ZVVzZXIgPSAoZm9ybSkgLT5cclxuXHRzZXJBcnIgPSAkKGZvcm0pLnNlcmlhbGl6ZUFycmF5KClcclxuXHRzZW5kT2JqID0ge31cclxuXHRmb3IgcHJvcCBpbiBzZXJBcnJcclxuXHRcdHNlbmRPYmpbcHJvcC5uYW1lXSA9IHByb3AudmFsdWVcclxuXHRzZW5kT2JqLmFncmVlbWVudCA9ICQoJyNlbWFpbC1jaGVja2JveCcpWzBdLmNoZWNrZWRcclxuXHRyZXF1ZXN0LnVzZXIuc2F2ZSBzZW5kT2JqLCAocmVzKSAtPlxyXG5cdFx0Y29uc29sZS5sb2cgcmVzXHJcblx0XHRpZiByZXMucmVzdWx0ID09IFwic3VjY2Vzc1wiXHJcblx0XHRcdCQoJy51c2VyaW5mb19fZXJyb3ItbWVzJykuYWRkQ2xhc3MoJ3VzZXJpbmZvX19lcnJvci1tZXMtLWludmlzJylcclxuXHRcdFx0Y2hlY2tGdWxsKCkgaWYgbm9mdWxsXHJcblx0XHRpZiByZXMucmVzdWx0ID09IFwiZXJyb3JcIlxyXG5cdFx0XHRpZiByZXMuY29kZSA9PSBcIjY2NlwiXHJcblx0XHRcdFx0JCgnLnVzZXJpbmZvX19lcnJvci1tZXMnKS5yZW1vdmVDbGFzcygndXNlcmluZm9fX2Vycm9yLW1lcy0taW52aXMnKVxyXG5cdFx0XHRcdGZvcm1PcGVuSGFuZGxlcigpXHJcblxyXG5cclxuXHJcbmNoZWNrRnVsbCA9IC0+XHJcblx0cmVxdWVzdC51c2VyLmlzRnVsbCB7fSwgKHJlcykgLT5cclxuXHRcdGNvbnNvbGUubG9nIHJlc1xyXG5cdFx0aWYgcmVzLnJlc3VsdD09XCJzdWNjZXNzXCJcclxuXHRcdFx0bm9mdWxsID0gZmFsc2VcclxuXHRcdFx0Y2FsbGJhY2soKSBpZiBjYWxsYmFjaz9cclxuXHRcdFx0cG9wdXBzLmNsb3NlTW9kYWwoKSIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKG5vZnVsbCwgdXNlcikge1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJ1c2VyaW5mbyB1c2VyaW5mby0tZWRpdGluZ1xcXCI+PGgzIGNsYXNzPVxcXCJ1c2VyaW5mb19fdGl0bGVcXFwiPtCb0LjRh9C90YvQtSDQtNCw0L3QvdGL0LU8L2gzPlwiKTtcbmlmICggbm9mdWxsKVxue1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJ1c2VyaW5mb19fd2FybmluZ1xcXCI+0JLRiyDQvdC1INC80L7QttC10YLQtSDQvdCw0YfQsNGC0Ywg0LrQstC10YHRgiwg0L/QvtC60LAg0L3QtSDQt9Cw0L/QvtC70L3QuNC70Lgg0L/RgNC+0YTQuNC70YwhPC9kaXY+XCIpO1xufVxuYnVmLnB1c2goXCI8Zm9ybSBjbGFzcz1cXFwidXNlcmluZm9fX2Zvcm1cXFwiPjxkaXYgY2xhc3M9XFxcInVzZXJpbmZvX19saW5lXFxcIj48ZGl2IGNsYXNzPVxcXCJ1c2VyaW5mb19fbGFiZWxcXFwiPtCk0LDQvNC40LvQuNGPOjwvZGl2PjxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBuYW1lPVxcXCJsYXN0X25hbWVcXFwiXCIgKyAoamFkZS5hdHRyKFwidmFsdWVcIiwgXCJcIiArICh1c2VyLmxhc3RfbmFtZSB8fCAnJykgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcInVzZXJpbmZvX19pbnB1dFxcXCIvPjxkaXYgY2xhc3M9XFxcInVzZXJpbmZvX192YWx1ZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gdXNlci5sYXN0X25hbWUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcInVzZXJpbmZvX19saW5lXFxcIj48ZGl2IGNsYXNzPVxcXCJ1c2VyaW5mb19fbGFiZWxcXFwiPtCY0LzRjzo8L2Rpdj48aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgbmFtZT1cXFwiZmlyc3RfbmFtZVxcXCJcIiArIChqYWRlLmF0dHIoXCJ2YWx1ZVwiLCBcIlwiICsgKHVzZXIuZmlyc3RfbmFtZSB8fCAnJykgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcInVzZXJpbmZvX19pbnB1dFxcXCIvPjxkaXYgY2xhc3M9XFxcInVzZXJpbmZvX192YWx1ZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gdXNlci5maXJzdF9uYW1lKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJ1c2VyaW5mb19fbGluZVxcXCI+PGRpdiBjbGFzcz1cXFwidXNlcmluZm9fX2xhYmVsXFxcIj7QotC10LvQtdGE0L7QvTo8L2Rpdj48aW5wdXQgdHlwZT1cXFwicGhvbmVcXFwiIG5hbWU9XFxcInBob25lXFxcIlwiICsgKGphZGUuYXR0cihcInZhbHVlXCIsIFwiXCIgKyAodXNlci5waG9uZSB8fCAnJykgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcInVzZXJpbmZvX19pbnB1dFxcXCIvPjxkaXYgY2xhc3M9XFxcInVzZXJpbmZvX192YWx1ZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gdXNlci5waG9uZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwidXNlcmluZm9fX2xpbmVcXFwiPjxkaXYgY2xhc3M9XFxcInVzZXJpbmZvX19sYWJlbFxcXCI+0JTQsNGC0LAg0YDQvtC20LTQtdC90LjRjzo8L2Rpdj48aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgbmFtZT1cXFwiYmRhdGVcXFwiXCIgKyAoamFkZS5hdHRyKFwidmFsdWVcIiwgXCJcIiArICh1c2VyLmJkYXRlIHx8ICcnKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwidXNlcmluZm9fX2lucHV0XFxcIi8+PGRpdiBjbGFzcz1cXFwidXNlcmluZm9fX3ZhbHVlXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSB1c2VyLmJkYXRlKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJ1c2VyaW5mb19fbGluZVxcXCI+PGRpdiBjbGFzcz1cXFwidXNlcmluZm9fX2xhYmVsXFxcIj5FLW1haWw6PC9kaXY+PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIG5hbWU9XFxcImVtYWlsXFxcIlwiICsgKGphZGUuYXR0cihcInZhbHVlXCIsIFwiXCIgKyAodXNlci5lbWFpbCB8fCAnJykgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcInVzZXJpbmZvX19pbnB1dFxcXCIvPjxkaXYgY2xhc3M9XFxcInVzZXJpbmZvX192YWx1ZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gdXNlci5lbWFpbCkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwidXNlcmluZm9fX2xpbmVcXFwiPjxkaXYgY2xhc3M9XFxcInVzZXJpbmZvX19sYWJlbFxcXCI+0J3QuNC60L3QtdC50Lw6PC9kaXY+PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIG5hbWU9XFxcIm5pY2tuYW1lXFxcIlwiICsgKGphZGUuYXR0cihcInZhbHVlXCIsIFwiXCIgKyAodXNlci5uaWNrbmFtZSB8fCAnJykgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcInVzZXJpbmZvX19pbnB1dFxcXCIvPjxkaXYgY2xhc3M9XFxcInVzZXJpbmZvX192YWx1ZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gdXNlci5uaWNrbmFtZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PGRpdiBjbGFzcz1cXFwidXNlcmluZm9fX2Vycm9yLW1lcyB1c2VyaW5mb19fZXJyb3ItbWVzLS1pbnZpc1xcXCI+0J3QuNC60L3QtdC50Lwg0L3QtSDRg9C90LjQutCw0LvRjNC90YvQuSE8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJ1c2VyaW5mb19fY2hlY2tib3gtbGluZVxcXCI+XCIpO1xuaWYgKCB1c2VyLmFncmVlbWVudD09dHJ1ZSB8fCB1c2VyLmFncmVlbWVudD09XCJ0cnVlXCIpXG57XG5idWYucHVzaChcIjxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgbmFtZT1cXFwiYWdyZWVtZW50XFxcIiBjaGVja2VkPVxcXCJjaGVja2VkXFxcIiBpZD1cXFwiZW1haWwtY2hlY2tib3hcXFwiIGNsYXNzPVxcXCJ1c2VyaW5mb19fY2hlY2tib3hcXFwiLz5cIik7XG59XG5lbHNlXG57XG5idWYucHVzaChcIjxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgbmFtZT1cXFwiYWdyZWVtZW50XFxcIiBpZD1cXFwiZW1haWwtY2hlY2tib3hcXFwiIGNsYXNzPVxcXCJ1c2VyaW5mb19fY2hlY2tib3hcXFwiLz5cIik7XG59XG5idWYucHVzaChcIjxsYWJlbCBmb3I9XFxcImVtYWlsLWNoZWNrYm94XFxcIiBuYW1lPVxcXCJhZ3JlZW1lbnRcXFwiIGNsYXNzPVxcXCJ1c2VyaW5mb19fY2hlY2tib3gtbGFiZWxcXFwiPjxkaXYgY2xhc3M9XFxcInVzZXJpbmZvX19jaGVja2JveC10ZXh0XFxcIj7QodC+0LPQu9Cw0YHQuNC1INC90LAg0YDQsNGB0YHRi9C70LrRgyDQvtGCINC40LzQtdC90Lgg0LHRgNC10L3QtNCwPC9kaXY+PC9sYWJlbD48L2Rpdj48YnV0dG9uIGNsYXNzPVxcXCJidXQgdXNlcmluZm9fX2J1dCBqcy1jaGFuZ2VVc2VySW5mb1xcXCI+0JjQt9C80LXQvdC40YLRjDwvYnV0dG9uPjwvZm9ybT48L2Rpdj5cIik7fS5jYWxsKHRoaXMsXCJub2Z1bGxcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm5vZnVsbDp0eXBlb2Ygbm9mdWxsIT09XCJ1bmRlZmluZWRcIj9ub2Z1bGw6dW5kZWZpbmVkLFwidXNlclwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudXNlcjp0eXBlb2YgdXNlciE9PVwidW5kZWZpbmVkXCI/dXNlcjp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChxdWVzdCkge1xuYnVmLnB1c2goXCI8aSBjbGFzcz1cXFwiaWNvbi1jdXJxLWJhbG9vbiBjdXJxdWVzdF9fYmFsb29uXFxcIj48L2k+PCEtLS5jdXJxdWVzdF9fbnVtYmVyINCa0LLQtdGB0YIg4oSWI3txdWVzdC5pZH0tLT48ZGl2IGNsYXNzPVxcXCJjdXJxdWVzdF9fbmFtZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gcXVlc3QubmFtZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PGRpdiBjbGFzcz1cXFwiY3VycXVlc3RfX2RhdGVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IHF1ZXN0LnN0YXJ0ZWRfYXQpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIiAtIFwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IHF1ZXN0LmZpbmlzaGVkX2F0KSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48YVwiICsgKGphZGUuYXR0cihcImhyZWZcIiwgXCIvZ2FtZT9xdWVzdF9pZD1cIiArIChxdWVzdC5pZCkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImN1cnF1ZXN0X19saW5rIGpzLW9wZW5DdXJRdWVzdFxcXCI+PGRpdiBjbGFzcz1cXFwiY3VycXVlc3RfX3BsYXlidXRcXFwiPtCY0LPRgNCw0YLRjDwvZGl2PjwvYT5cIik7fS5jYWxsKHRoaXMsXCJxdWVzdFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgucXVlc3Q6dHlwZW9mIHF1ZXN0IT09XCJ1bmRlZmluZWRcIj9xdWVzdDp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJjdXJRdWVzdFRlbXBsYXRlID0gcmVxdWlyZSAnLi9jdXJxdWVzdC5qYWRlJ1xyXG5wcmV2UXVlc3RzVGVtcGxhdGUgPSByZXF1aXJlICcuL3F1ZXN0cy1saXN0LmphZGUnXHJcbnJlcXVlc3QgPSByZXF1aXJlICcuLi9yZXF1ZXN0J1xyXG5saW5rcyA9IHJlcXVpcmUgJy4uL3Rvb2xzL2xpbmtzLmNvZmZlZSdcclxucG9wdXBzID0gcmVxdWlyZSAnLi4vcG9wdXBzJ1xyXG5hbmFsID0gcmVxdWlyZSAnLi4vdG9vbHMvYW5hbC5jb2ZmZWUnXHJcblxyXG5yZXF1ZXN0LnF1ZXN0cy5nZXRMaXN0IHt9LCAocmVzKSAtPlxyXG5cdGNvbnNvbGUubG9nIHJlc1xyXG5cdGN1cnEgPSAoaSBmb3IgaSBpbiByZXMgd2hlbiBpLnN0YXR1cz09MTApWzBdXHJcblx0cmVuZGVyQ3VyUXVlc3QoY3VycSkgaWYgY3VycVxyXG5cdHByZXZxID0gKGkgZm9yIGkgaW4gcmVzIHdoZW4gaS5zdGF0dXM9PTEgfHwgaS5zdGF0dXM9PTUpXHJcblx0cmVuZGVyUHJldlF1ZXN0cyhwcmV2cSlcclxuXHRsaW5rTGlzdGVuZXIoKVxyXG5cclxucmVuZGVyQ3VyUXVlc3QgPSAocSkgLT5cclxuXHQkKCcuY3VycXVlc3RfX21haW4nKS5odG1sIGN1clF1ZXN0VGVtcGxhdGUoe3F1ZXN0OiBxfSlcclxuXHRsaW5rcy5hZGRCdXRIYXNoICQoJy5jdXJxdWVzdF9fbGluaycpXHJcblx0JCgnLmpzLW9wZW5DdXJRdWVzdCcpLm9uICdjbGljaycsIC0+XHJcblx0XHRhbmFsLnNlbmQoJ9CT0LvQsNCy0L3QsNGPX9CY0LPRgNCw0YLRjCcpXHJcblxyXG5cclxucmVuZGVyUHJldlF1ZXN0cyA9IChhcnIpIC0+XHJcblx0JCgnLnByZXZxdWVzdF9fZm9ybG9hZGluZycpLmh0bWwgcHJldlF1ZXN0c1RlbXBsYXRlKHtxdWVzdHM6IGFycn0pXHJcblx0bGlua3MuYWRkQnV0SGFzaCAkKCcucHJldnF1ZXN0X19saW5rJylcclxuXHJcbmxpbmtMaXN0ZW5lciA9IC0+XHJcblx0JCgnLmN1cnF1ZXN0X19saW5rJykub24gJ2NsaWNrJywgKGUpIC0+XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KClcclxuXHRcdGhyZWYgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKVxyXG5cdFx0d2luZG93LmxvY2F0aW9uID0gaHJlZlxyXG5cdFx0IyMjcmVxdWVzdC51c2VyLmlzRnVsbCB7fSwgKHJlcykgLT5cclxuXHRcdFx0Y29uc29sZS5sb2cgcmVzXHJcblx0XHRcdGlmIHJlcy5yZXN1bHQgPT0gXCJzdWNjZXNzXCJcclxuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24gPSBocmVmXHJcblx0XHRcdGlmIHJlcy5yZXN1bHQgPT0gXCJlcnJvclwiXHJcblx0XHRcdFx0cG9wdXBzLm9wZW5Nb2RhbCBcInVzZXJpbmZvXCIsIHtub2Z1bGw6IHRydWV9LCAtPlxyXG5cdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uID0gaHJlZiMjIyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKHF1ZXN0cywgdW5kZWZpbmVkKSB7XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcInByZXZxdWVzdF9fbGlzdFxcXCI+XCIpO1xuLy8gaXRlcmF0ZSBxdWVzdHNcbjsoZnVuY3Rpb24oKXtcbiAgdmFyICQkb2JqID0gcXVlc3RzO1xuICBpZiAoJ251bWJlcicgPT0gdHlwZW9mICQkb2JqLmxlbmd0aCkge1xuXG4gICAgZm9yICh2YXIgJGluZGV4ID0gMCwgJCRsID0gJCRvYmoubGVuZ3RoOyAkaW5kZXggPCAkJGw7ICRpbmRleCsrKSB7XG4gICAgICB2YXIgcXVlc3QgPSAkJG9ialskaW5kZXhdO1xuXG5pZiAoIHF1ZXN0LnN0YXR1cz09MSlcbntcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwicHJldnF1ZXN0X19lbCBwcmV2cXVlc3RfX2VsLS1mdXR1cmVcXFwiPjxkaXYgY2xhc3M9XFxcInByZXZxdWVzdF9fbnVtXFxcIj48ZGl2IGNsYXNzPVxcXCJwcmV2cXVlc3RfX25hbWVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IHF1ZXN0Lm5hbWUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjxkaXYgY2xhc3M9XFxcInByZXZxdWVzdF9fZGF0ZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gcXVlc3Quc3RhcnRlZF9hdCkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiIC0gXCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gcXVlc3QuZmluaXNoZWRfYXQpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjxkaXYgY2xhc3M9XFxcInByZXZxdWVzdF9fdW5hYmxlXFxcIj7QmtCy0LXRgdGCINC/0L7QutCwINC90LXQtNC+0YHRgtGD0L/QtdC9PC9kaXY+PGRpdiBjbGFzcz1cXFwicHJldnF1ZXN0X19zY29yZXNcXFwiPjwvZGl2PjwvZGl2PjwvZGl2PlwiKTtcbn1cbmlmICggcXVlc3Quc3RhdHVzPT01KVxue1xuYnVmLnB1c2goXCI8ZGl2XCIgKyAoamFkZS5jbHMoWydwcmV2cXVlc3RfX2VsJyxxdWVzdC5zY29yZT4wID8gXCJwcmV2cXVlc3RfX2VsLS1wbGF5ZWRcIiA6IFwiXCJdLCBbbnVsbCx0cnVlXSkpICsgXCI+PGRpdiBjbGFzcz1cXFwicHJldnF1ZXN0X19udW1cXFwiPjxkaXYgY2xhc3M9XFxcInByZXZxdWVzdF9fbmFtZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gcXVlc3QubmFtZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PGRpdiBjbGFzcz1cXFwicHJldnF1ZXN0X19kYXRlXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBxdWVzdC5zdGFydGVkX2F0KSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCIgLSBcIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBxdWVzdC5maW5pc2hlZF9hdCkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PGFcIiArIChqYWRlLmF0dHIoXCJocmVmXCIsIFwiL2dhbWU/cXVlc3RfaWQ9XCIgKyAocXVlc3QuaWQpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJwcmV2cXVlc3RfX2xpbmtcXFwiPjxkaXYgY2xhc3M9XFxcInByZXZxdWVzdF9fcGxheWJ1dFxcXCI+0JjQs9GA0LDRgtGMPC9kaXY+PC9hPjxkaXYgY2xhc3M9XFxcInByZXZxdWVzdF9fc2NvcmVzXFxcIj7QndCw0LHRgNCw0L3QviBcIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBxdWVzdC5zY29yZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiINCx0LDQu9C70L7QsjwvZGl2PjwvZGl2PjwvZGl2PlwiKTtcbn1cbiAgICB9XG5cbiAgfSBlbHNlIHtcbiAgICB2YXIgJCRsID0gMDtcbiAgICBmb3IgKHZhciAkaW5kZXggaW4gJCRvYmopIHtcbiAgICAgICQkbCsrOyAgICAgIHZhciBxdWVzdCA9ICQkb2JqWyRpbmRleF07XG5cbmlmICggcXVlc3Quc3RhdHVzPT0xKVxue1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJwcmV2cXVlc3RfX2VsIHByZXZxdWVzdF9fZWwtLWZ1dHVyZVxcXCI+PGRpdiBjbGFzcz1cXFwicHJldnF1ZXN0X19udW1cXFwiPjxkaXYgY2xhc3M9XFxcInByZXZxdWVzdF9fbmFtZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gcXVlc3QubmFtZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PGRpdiBjbGFzcz1cXFwicHJldnF1ZXN0X19kYXRlXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBxdWVzdC5zdGFydGVkX2F0KSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCIgLSBcIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBxdWVzdC5maW5pc2hlZF9hdCkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PGRpdiBjbGFzcz1cXFwicHJldnF1ZXN0X191bmFibGVcXFwiPtCa0LLQtdGB0YIg0L/QvtC60LAg0L3QtdC00L7RgdGC0YPQv9C10L08L2Rpdj48ZGl2IGNsYXNzPVxcXCJwcmV2cXVlc3RfX3Njb3Jlc1xcXCI+PC9kaXY+PC9kaXY+PC9kaXY+XCIpO1xufVxuaWYgKCBxdWVzdC5zdGF0dXM9PTUpXG57XG5idWYucHVzaChcIjxkaXZcIiArIChqYWRlLmNscyhbJ3ByZXZxdWVzdF9fZWwnLHF1ZXN0LnNjb3JlPjAgPyBcInByZXZxdWVzdF9fZWwtLXBsYXllZFwiIDogXCJcIl0sIFtudWxsLHRydWVdKSkgKyBcIj48ZGl2IGNsYXNzPVxcXCJwcmV2cXVlc3RfX251bVxcXCI+PGRpdiBjbGFzcz1cXFwicHJldnF1ZXN0X19uYW1lXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBxdWVzdC5uYW1lKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48ZGl2IGNsYXNzPVxcXCJwcmV2cXVlc3RfX2RhdGVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IHF1ZXN0LnN0YXJ0ZWRfYXQpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIiAtIFwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IHF1ZXN0LmZpbmlzaGVkX2F0KSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48YVwiICsgKGphZGUuYXR0cihcImhyZWZcIiwgXCIvZ2FtZT9xdWVzdF9pZD1cIiArIChxdWVzdC5pZCkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcInByZXZxdWVzdF9fbGlua1xcXCI+PGRpdiBjbGFzcz1cXFwicHJldnF1ZXN0X19wbGF5YnV0XFxcIj7QmNCz0YDQsNGC0Yw8L2Rpdj48L2E+PGRpdiBjbGFzcz1cXFwicHJldnF1ZXN0X19zY29yZXNcXFwiPtCd0LDQsdGA0LDQvdC+IFwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IHF1ZXN0LnNjb3JlKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCIg0LHQsNC70LvQvtCyPC9kaXY+PC9kaXY+PC9kaXY+XCIpO1xufVxuICAgIH1cblxuICB9XG59KS5jYWxsKHRoaXMpO1xuXG5idWYucHVzaChcIjwvZGl2PlwiKTt9LmNhbGwodGhpcyxcInF1ZXN0c1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgucXVlc3RzOnR5cGVvZiBxdWVzdHMhPT1cInVuZGVmaW5lZFwiP3F1ZXN0czp1bmRlZmluZWQsXCJ1bmRlZmluZWRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnVuZGVmaW5lZDp0eXBlb2YgdW5kZWZpbmVkIT09XCJ1bmRlZmluZWRcIj91bmRlZmluZWQ6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidGVtcGxhdGUgPSByZXF1aXJlICcuL2xlYWRlcnMuamFkZSdcclxucmVxdWVzdCA9IHJlcXVpcmUgJy4uL3JlcXVlc3QnXHJcbnBvcHVwcyA9IHJlcXVpcmUgJy4uL3BvcHVwcydcclxuYW5hbCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2FuYWwuY29mZmVlJ1xyXG5cclxuaG9zdCA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCtcIi8vdmsuY29tL2lkXCJcclxudmlld3MgPSB7XHJcblx0dGhlbWUgOiBcImRhcmtcIlxyXG59XHJcblxyXG5wYWdlID0gXCJcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMuaW5pdCA9IChvcHRzKSAtPlxyXG5cdG9wdHMgPSBvcHRzIHx8IHt9XHJcblx0dmlld3MudGhlbWUgPSBvcHRzLnRoZW1lIGlmIG9wdHMudGhlbWVcclxuXHRwYWdlID0gb3B0cy5wYWdlXHJcblx0c2VuZFJlcXVlc3QoKVxyXG5cclxuc2VuZFJlcXVlc3QgPSAoKSAtPlxyXG5cdHJlcXVlc3QucmF0aW5nLmFsbCB7fSwgKHJlcykgLT5cclxuXHRcdGNvbnNvbGUubG9nIHJlc1xyXG5cclxuXHRcdCQoXCIubGVhZGVyc19fZm9ybG9hZGluZ1wiKS5odG1sIHRlbXBsYXRlIHtsZWFkZXJzOiByZXMsIHZpZXdzOiB2aWV3cywgaG9zdDogaG9zdH1cclxuXHRcdCQoXCIuanMtc3dpdGNoVG9DdXJyZW50XCIpLm9uICdjbGljaycsIC0+XHJcblx0XHRcdGFuYWwuc2VuZChcIu+/ve+/vV/vv73vv73vv73vv70uX++/ve+/ve+/ve+/ve+/ve+/ve+/vVwiKVxyXG5cdFx0JChcIi5qcy1zd2l0Y2hUb0NvbW1vblwiKS5vbiAnY2xpY2snLCAtPlxyXG5cdFx0XHRhbmFsLnNlbmQoXCLvv73vv71f77+977+977+977+9Ll/vv73vv73vv73vv73vv71cIilcclxuXHJcblxyXG5cclxuZG8gc3dpdGNoZXJMaXN0ZW5lciA9IC0+XHJcblx0JCgnLmxlYWRlcnNfX2ZvcmxvYWRpbmcnKS5vbiAnY2xpY2snLCAnLmxlYWRlcnNfX3N3aXRjaGJ1dCcsIC0+XHJcblx0XHQkKHRoaXMpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MgJ2xlYWRlcnNfX3N3aXRjaGJ1dC0tYWN0aXZlJ1xyXG5cdFx0JCh0aGlzKS5hZGRDbGFzcyAnbGVhZGVyc19fc3dpdGNoYnV0LS1hY3RpdmUnXHJcblxyXG5cdFx0JCgnLmxlYWRlcnMnKS5yZW1vdmVDbGFzcyAnbGVhZGVycy0tYWN0aXZlJ1xyXG5cdFx0ZGF0YV9ocmVmID0gJCh0aGlzKS5hdHRyKCdkYXRhLWhyZWYnKVxyXG5cdFx0JChkYXRhX2hyZWYpLmFkZENsYXNzKCdsZWFkZXJzLS1hY3RpdmUnKVxyXG5cclxuXHQkKCcucG9wdXAnKS5vbiAnY2xpY2snLCAnLmxlYWRlcnNfX3N3aXRjaGJ1dCcsIC0+XHJcblx0XHQkKHRoaXMpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MgJ2xlYWRlcnNfX3N3aXRjaGJ1dC0tYWN0aXZlJ1xyXG5cdFx0JCh0aGlzKS5hZGRDbGFzcyAnbGVhZGVyc19fc3dpdGNoYnV0LS1hY3RpdmUnXHJcblxyXG5cdFx0JCgnLnBvcGxlYWRlcnNfX2NhdCcpLnJlbW92ZUNsYXNzICdwb3BsZWFkZXJzX19jYXQtLWFjdGl2ZSdcclxuXHRcdGRhdGFfaHJlZiA9ICQodGhpcykuYXR0cignZGF0YS1ocmVmJylcclxuXHRcdCQoZGF0YV9ocmVmKS5hZGRDbGFzcygncG9wbGVhZGVyc19fY2F0LS1hY3RpdmUnKVxyXG5cdFx0JChcIi5wb3BsZWFkZXJzX19saXN0XCIpLmN1c3RvbVNjcm9sbCgpXHJcblxyXG5kbyBvcGVuRnVsbFJhdGluZ0xpc3RlbmVyID0gLT5cclxuXHJcblx0JCgnLmxlYWRlcnNfX2ZvcmxvYWRpbmcnKS5vbiAnY2xpY2snLCAnLmpzLW9wZW5GdWxsUmF0aW5nJywgLT5cclxuXHRcdHBvcHVwcy5vcGVuTW9kYWwoXCJyYXRpbmdcIikiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChob3N0LCBsZWFkZXJzLCB1bmRlZmluZWQsIHZpZXdzKSB7XG5idWYucHVzaChcIjxkaXZcIiArIChqYWRlLmNscyhbJ2xlYWRlcnNfX3dyYXBwZXInLHZpZXdzLnRoZW1lID09PSBcIndoaXRlXCIgPyBcImxlYWRlcnNfX3dyYXBwZXItLXdoaXRlXCIgOiBcIlwiXSwgW251bGwsdHJ1ZV0pKSArIFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnMgbGVhZGVycy0tY29tbW9uIGxlYWRlcnMtLWFjdGl2ZVxcXCI+PGg0IGNsYXNzPVxcXCJsZWFkZXJzX190aXRsZVxcXCI+0J7QsdGJ0LjQuSDRgNC10LnRgtC40L3QszwvaDQ+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fbGlzdFxcXCI+XCIpO1xuLy8gaXRlcmF0ZSBsZWFkZXJzLmNvbW1vbi5sZWFkZXJzXG47KGZ1bmN0aW9uKCl7XG4gIHZhciAkJG9iaiA9IGxlYWRlcnMuY29tbW9uLmxlYWRlcnM7XG4gIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgJCRvYmoubGVuZ3RoKSB7XG5cbiAgICBmb3IgKHZhciBpbmRleCA9IDAsICQkbCA9ICQkb2JqLmxlbmd0aDsgaW5kZXggPCAkJGw7IGluZGV4KyspIHtcbiAgICAgIHZhciBwZXJzb24gPSAkJG9ialtpbmRleF07XG5cbmJ1Zi5wdXNoKFwiPGFcIiArIChqYWRlLmF0dHIoXCJocmVmXCIsIFwiXCIgKyAoaG9zdCtwZXJzb24ubGluaykgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2VsXFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19jb3VudGVyXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBpbmRleCsxKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48aW1nXCIgKyAoamFkZS5hdHRyKFwic3JjXCIsIFwiXCIgKyAocGVyc29uLnBob3RvKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwibGVhZGVyc19fcGhvdG9cXFwiLz48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19yaWdodFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fbmFtZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gcGVyc29uLm5pY2tuYW1lKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19zY29yZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gcGVyc29uLnNjb3JlcykgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PC9kaXY+PC9hPlwiKTtcbiAgICB9XG5cbiAgfSBlbHNlIHtcbiAgICB2YXIgJCRsID0gMDtcbiAgICBmb3IgKHZhciBpbmRleCBpbiAkJG9iaikge1xuICAgICAgJCRsKys7ICAgICAgdmFyIHBlcnNvbiA9ICQkb2JqW2luZGV4XTtcblxuYnVmLnB1c2goXCI8YVwiICsgKGphZGUuYXR0cihcImhyZWZcIiwgXCJcIiArIChob3N0K3BlcnNvbi5saW5rKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiB0YXJnZXQ9XFxcIl9ibGFua1xcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fZWxcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2NvdW50ZXJcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGluZGV4KzEpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjxpbWdcIiArIChqYWRlLmF0dHIoXCJzcmNcIiwgXCJcIiArIChwZXJzb24ucGhvdG8pICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJsZWFkZXJzX19waG90b1xcXCIvPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3JpZ2h0XFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19uYW1lXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBwZXJzb24ubmlja25hbWUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3Njb3JlXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBwZXJzb24uc2NvcmVzKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj48L2E+XCIpO1xuICAgIH1cblxuICB9XG59KS5jYWxsKHRoaXMpO1xuXG5pZiAoIGxlYWRlcnMuY29tbW9uLnlvdS5wbGFjZSlcbntcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibGVhZGVyc19fZWxcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2NvdW50ZXJcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGxlYWRlcnMuY29tbW9uLnlvdS5wbGFjZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PGltZ1wiICsgKGphZGUuYXR0cihcInNyY1wiLCBcIlwiICsgKGxlYWRlcnMuY29tbW9uLnlvdS5waG90bykgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImxlYWRlcnNfX3Bob3RvXFxcIi8+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fcmlnaHRcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX25hbWVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGxlYWRlcnMuY29tbW9uLnlvdS5uaWNrbmFtZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fc2NvcmVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGxlYWRlcnMuY29tbW9uLnlvdS5zY29yZXMpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjwvZGl2PlwiKTtcbn1cbmJ1Zi5wdXNoKFwiPC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwibGVhZGVycyBsZWFkZXJzLS1jdXJyZW50XFxcIj48aDQgY2xhc3M9XFxcImxlYWRlcnNfX3RpdGxlXFxcIj7Qm9C40LTQtdGA0Ysg0YLQtdC60YPRidC10LPQviDQutCy0LXRgdGC0LA8L2g0PjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2xpc3RcXFwiPlwiKTtcbi8vIGl0ZXJhdGUgbGVhZGVycy5jdXJyZW50LmxlYWRlcnNcbjsoZnVuY3Rpb24oKXtcbiAgdmFyICQkb2JqID0gbGVhZGVycy5jdXJyZW50LmxlYWRlcnM7XG4gIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgJCRvYmoubGVuZ3RoKSB7XG5cbiAgICBmb3IgKHZhciBpbmRleCA9IDAsICQkbCA9ICQkb2JqLmxlbmd0aDsgaW5kZXggPCAkJGw7IGluZGV4KyspIHtcbiAgICAgIHZhciBwZXJzb24gPSAkJG9ialtpbmRleF07XG5cbmJ1Zi5wdXNoKFwiPGFcIiArIChqYWRlLmF0dHIoXCJocmVmXCIsIFwiXCIgKyAoaG9zdCtwZXJzb24ubGluaykgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2VsXFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19jb3VudGVyXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBpbmRleCsxKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48aW1nXCIgKyAoamFkZS5hdHRyKFwic3JjXCIsIFwiXCIgKyAocGVyc29uLnBob3RvKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwibGVhZGVyc19fcGhvdG9cXFwiLz48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19yaWdodFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fbmFtZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gcGVyc29uLm5pY2tuYW1lKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19zY29yZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gcGVyc29uLnNjb3JlcykgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PC9kaXY+PC9hPlwiKTtcbiAgICB9XG5cbiAgfSBlbHNlIHtcbiAgICB2YXIgJCRsID0gMDtcbiAgICBmb3IgKHZhciBpbmRleCBpbiAkJG9iaikge1xuICAgICAgJCRsKys7ICAgICAgdmFyIHBlcnNvbiA9ICQkb2JqW2luZGV4XTtcblxuYnVmLnB1c2goXCI8YVwiICsgKGphZGUuYXR0cihcImhyZWZcIiwgXCJcIiArIChob3N0K3BlcnNvbi5saW5rKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiB0YXJnZXQ9XFxcIl9ibGFua1xcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fZWxcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2NvdW50ZXJcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGluZGV4KzEpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjxpbWdcIiArIChqYWRlLmF0dHIoXCJzcmNcIiwgXCJcIiArIChwZXJzb24ucGhvdG8pICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJsZWFkZXJzX19waG90b1xcXCIvPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3JpZ2h0XFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19uYW1lXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBwZXJzb24ubmlja25hbWUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3Njb3JlXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBwZXJzb24uc2NvcmVzKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj48L2E+XCIpO1xuICAgIH1cblxuICB9XG59KS5jYWxsKHRoaXMpO1xuXG5pZiAoIGxlYWRlcnMuY3VycmVudC55b3UucGxhY2UpXG57XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2VsXFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19jb3VudGVyXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBsZWFkZXJzLmN1cnJlbnQueW91LnBsYWNlKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48aW1nXCIgKyAoamFkZS5hdHRyKFwic3JjXCIsIFwiXCIgKyAobGVhZGVycy5jdXJyZW50LnlvdS5waG90bykgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImxlYWRlcnNfX3Bob3RvXFxcIi8+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fcmlnaHRcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX25hbWVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGxlYWRlcnMuY3VycmVudC55b3Uubmlja25hbWUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3Njb3JlXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBsZWFkZXJzLmN1cnJlbnQueW91LnNjb3JlcykgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PC9kaXY+XCIpO1xufVxuYnVmLnB1c2goXCI8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19zd2l0Y2hlcl93cmFwcGVyXFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19zd2l0Y2hlclxcXCI+PGRpdiBkYXRhLWhyZWY9XFxcIi5sZWFkZXJzLS1jdXJyZW50XFxcIiBjbGFzcz1cXFwibGVhZGVyc19fc3dpdGNoYnV0IGxlYWRlcnNfX3N3aXRjaGN1cnJlbnQganMtc3dpdGNoVG9DdXJyZW50XFxcIj7QotC10LrRg9GJ0LjQuTwvZGl2PjxkaXYgZGF0YS1ocmVmPVxcXCIubGVhZGVycy0tY29tbW9uXFxcIiBjbGFzcz1cXFwibGVhZGVyc19fc3dpdGNoYnV0IGxlYWRlcnNfX3N3aXRjaGJ1dC0tYWN0aXZlIGxlYWRlcnNfX3N3aXRjaGNvbW1vbiBqcy1zd2l0Y2hUb0NvbW1vblxcXCI+0J7QsdGJ0LjQuTwvZGl2PjwvZGl2PjwvZGl2PlwiKTtcbmlmICggdmlld3MudGhlbWUgIT0gXCJ3aGl0ZVwiKVxue1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19saW5rIGpzLW9wZW5GdWxsUmF0aW5nXFxcIj7Qn9C+0LvQvdGL0Lkg0YDQtdC50YLQuNC90LMg4oaSPC9kaXY+XCIpO1xufVxuYnVmLnB1c2goXCI8L2Rpdj5cIik7fS5jYWxsKHRoaXMsXCJob3N0XCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5ob3N0OnR5cGVvZiBob3N0IT09XCJ1bmRlZmluZWRcIj9ob3N0OnVuZGVmaW5lZCxcImxlYWRlcnNcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmxlYWRlcnM6dHlwZW9mIGxlYWRlcnMhPT1cInVuZGVmaW5lZFwiP2xlYWRlcnM6dW5kZWZpbmVkLFwidW5kZWZpbmVkXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC51bmRlZmluZWQ6dHlwZW9mIHVuZGVmaW5lZCE9PVwidW5kZWZpbmVkXCI/dW5kZWZpbmVkOnVuZGVmaW5lZCxcInZpZXdzXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC52aWV3czp0eXBlb2Ygdmlld3MhPT1cInVuZGVmaW5lZFwiP3ZpZXdzOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsImtleXMgPSByZXF1aXJlKCcuLi90b29scy9rZXlzLmNvZmZlZScpXHJcblxyXG5BdXRoID0gd2luZG93LmJ0b2EgJ3tcInNpZFwiOlwiJytrZXlzLnNpZCsnXCIsXCJoYXNoXCI6XCInK2tleXMuaGFzaCsnXCJ9J1xyXG5cclxucHJvdG9jb2wgPSBsb2NhdGlvbi5wcm90b2NvbFxyXG5ob3N0ID0gd2luZG93LmFwaWhvc3QgfHwgcHJvdG9jb2wrXCIvL3R1Yy1xdWVzdC5ydS9cIlxyXG5cclxuc2VuZCA9ICh1cmwsIG1ldGhvZCwgZGF0YSwgY2FsbGJhY2spIC0+XHJcblx0Y3J5cHQgPSAhIWNyeXB0XHJcblx0ZGF0YSA9IGRhdGEgfHwge31cclxuXHQkLmFqYXgge1xyXG5cdFx0dXJsOiBob3N0K3VybFxyXG5cdFx0bWV0aG9kOiBtZXRob2RcclxuXHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XCJBdXRoXCI6IHdpbmRvdy5idG9hICd7XCJzaWRcIjpcIicra2V5cy5zaWQrJ1wiLFwiaGFzaFwiOlwiJytrZXlzLmhhc2grJ1wifSdcclxuXHRcdH1cclxuXHRcdGRhdGE6IGRhdGFcclxuXHRcdHN1Y2Nlc3M6IChyZXMpIC0+XHJcblxyXG5cdFx0XHRjYWxsYmFjayhyZXMpIGlmIGNhbGxiYWNrP1xyXG5cdFx0ZXJyb3I6IChlcnIpIC0+XHJcblx0XHRcdGNvbnNvbGUubG9nKGVycilcclxuXHR9XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5mYXEgPSB7XHJcblx0Z2V0IDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS9mYXEvZ2V0XCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG59XHJcbm1vZHVsZS5leHBvcnRzLnJhdGluZyA9IHtcclxuXHRhbGwgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL3JhdGluZy9hbGxcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcblxyXG5cdGNvbW1vbiA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvcmF0aW5nL2NvbW1vblwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxuXHJcblx0Y3VycmVudCA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvcmF0aW5nL2N1cnJlbnRcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcbn1cclxubW9kdWxlLmV4cG9ydHMudXNlciA9IHtcclxuXHRpc1JlZyA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvdXNlci9pcy1yZWdcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcblxyXG5cdGlzRnVsbCA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvdXNlci9pcy1mdWxsXCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG5cclxuXHRnZXQgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL3VzZXIvZ2V0XCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG5cclxuXHRzYXZlIDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS91c2VyL3NhdmVcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcblxyXG5cdHJlZ2lzdHJhdGlvbiA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvdXNlci9yZWdpc3RyYXRpb25cIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcbn1cclxubW9kdWxlLmV4cG9ydHMuZmVlZGJhY2sgPSB7XHJcblx0Z2V0IDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS9mZWVkYmFjay9nZXRcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcblxyXG5cdGFkZCA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvZmVlZGJhY2svYWRkXCIsIFwiUE9TVFwiLCBvcHRzLCBjYWxsYmFjaylcclxuXHJcblx0cmVhZCA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvZmVlZGJhY2svcmVhZFwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxufVxyXG5tb2R1bGUuZXhwb3J0cy5xdWVzdHMgPSB7XHJcblx0Z2V0TGlzdCA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvcXVlc3RzL2dldC1saXN0XCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG59XHJcbm1vZHVsZS5leHBvcnRzLmdhbWUgPSB7XHJcblx0ZW50ZXIgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL2dhbWUvZW50ZXJcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcblxyXG5cdGdldFBvaW50IDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS9nYW1lL2dldC1wb2ludFwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxuXHJcblx0Y2hlY2tNb25leSA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvZ2FtZS9jaGVjay1tb25leVwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxuXHJcblx0Y2xlYXIgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL2dhbWUvY2xlYXJcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcbn1cclxubW9kdWxlLmV4cG9ydHMuYWNoaWV2ZW1lbnQgPSB7XHJcblx0Z2V0IDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS9hY2hpZXZlbWVudC9nZXRcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcblxyXG5cdGdldE5ldyA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvYWNoaWV2ZW1lbnQvZ2V0LW5ld1wiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxuXHJcblx0cmVhZCA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvYWNoaWV2ZW1lbnQvcmVhZFwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxufVxyXG5tb2R1bGUuZXhwb3J0cy5ldmVudCA9IHtcclxuXHRzZXQgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL2V2ZW50L3NldFwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxuXHRnZXQgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL2V2ZW50L2dldFwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxufVxyXG5tb2R1bGUuZXhwb3J0cy5wcml6ZSA9IHtcclxuXHRnZXQgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL3ByaXplL2dldFwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxufVxyXG5tb2R1bGUuZXhwb3J0cy50YXN0ZSA9IHtcclxuXHRjaGVjayA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvdGFzdGUvY2hlY2tcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcblx0aXNFbmFibGVkIDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS90YXN0ZS9pcy1lbmFibGVkXCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG59IiwibW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0e1xyXG5cdFx0YWNoaWV2ZW1lbnRfaWQ6IDEwXHJcblx0XHRudW06IDBcclxuXHRcdG5hbWU6IFwi0J/QtdGA0LLRi9C5INC/0L7RiNC10LtcIlxyXG5cdFx0ZGVzY3JpcHRpb246IFwi0JfQsNCy0LXRgNGI0LjQuyDQv9C10YDQstGL0Lkg0LrQstC10YHRglwiXHJcblx0XHRtZXNzYWdlOiBcItCY0LPRgNCw0LXQvCDQsiDQvtC90LvQsNC50L0t0LrQstC10YHRgtGLLCDQvdC1INGF0LLQsNGC0LDQtdGCINGC0L7Qu9GM0LrQviDRgtC10LHRjyEg0K3RgtC+INCx0YvQu9C+INCx0Ysg0LrRgNGD0YLQviDQtNCw0LbQtSDQsdC10Lcg0L/RgNC40LfQvtCyLiDQndC+INC/0YDQuNC30Ysg0LXRgdGC0YwhICPQs9C+0YDQvtC00LfQsNC40LPRgNCw0LXRglwiXHJcblx0XHRwaG90bzogJ3Bob3RvLTExMTg1MDY4Ml8zOTgwNDkwMDknLFxyXG5cdFx0c21hbGxfcGhvdG86IFwiaW1nL2ltYWdlcy9hY2hpZXZlcy1zbWFsbC9pMC5wbmdcIlxyXG5cdH1cclxuXHR7XHJcblx0XHRhY2hpZXZlbWVudF9pZDogMTFcclxuXHRcdG51bTogMVxyXG5cdFx0bmFtZTogXCLQo9C/0ZHRgNGC0YvQuVwiXHJcblx0XHRkZXNjcmlwdGlvbjogXCLQl9Cw0LLQtdGA0YjQuNC7INC60LLQtdGB0YIg0LfQsCDQvtC00L3RgyDRgdC10YHRgdC40Y5cIlxyXG5cdFx0bWVzc2FnZTogXCLQmNCz0YDQsNC10Lwg0LIg0L7QvdC70LDQudC9LdC60LLQtdGB0YLRiywg0L3QtSDRhdCy0LDRgtCw0LXRgiDRgtC+0LvRjNC60L4g0YLQtdCx0Y8hINCt0YLQviDQsdGL0LvQviDQsdGLINC60YDRg9GC0L4g0LTQsNC20LUg0LHQtdC3INC/0YDQuNC30L7Qsi4g0J3QviDQv9GA0LjQt9GLINC10YHRgtGMISAj0LPQvtGA0L7QtNC30LDQuNCz0YDQsNC10YJcIlxyXG5cdFx0cGhvdG86ICdwaG90by0xMTE4NTA2ODJfMzk4MDQ5MDE3JyxcclxuXHRcdHNtYWxsX3Bob3RvOiBcImltZy9pbWFnZXMvYWNoaWV2ZXMtc21hbGwvaTEucG5nXCJcclxuXHR9XHJcblx0e1xyXG5cdFx0YWNoaWV2ZW1lbnRfaWQ6IDEyXHJcblx0XHRudW06IDJcclxuXHRcdG5hbWU6IFwi0JTQsNC5INC/0Y/RgtGMIVwiXHJcblx0XHRkZXNjcmlwdGlvbjogXCLQl9Cw0LLQtdGA0YjQuNC7IDUg0LrQstC10YHRgtC+0LJcIlxyXG5cdFx0bWVzc2FnZTogXCLQmNCz0YDQsNC10Lwg0LIg0L7QvdC70LDQudC9LdC60LLQtdGB0YLRiywg0L3QtSDRhdCy0LDRgtCw0LXRgiDRgtC+0LvRjNC60L4g0YLQtdCx0Y8hINCt0YLQviDQsdGL0LvQviDQsdGLINC60YDRg9GC0L4g0LTQsNC20LUg0LHQtdC3INC/0YDQuNC30L7Qsi4g0J3QviDQv9GA0LjQt9GLINC10YHRgtGMISAj0LPQvtGA0L7QtNC30LDQuNCz0YDQsNC10YJcIlxyXG5cdFx0cGhvdG86ICdwaG90by0xMTE4NTA2ODJfMzk4MDQ5MDExJyxcclxuXHRcdHNtYWxsX3Bob3RvOiBcImltZy9pbWFnZXMvYWNoaWV2ZXMtc21hbGwvaTIucG5nXCJcclxuXHR9XHJcblx0e1xyXG5cdFx0YWNoaWV2ZW1lbnRfaWQ6IDEzXHJcblx0XHRudW06IDNcclxuXHRcdG5hbWU6IFwi0JrRgNCw0YHQsNCy0YfQuNC6XCJcclxuXHRcdGRlc2NyaXB0aW9uOiBcItCX0LDQstC10YDRiNC40LsgMTAg0LrQstC10YHRgtC+0LJcIlxyXG5cdFx0bWVzc2FnZTogXCLQmNCz0YDQsNC10Lwg0LIg0L7QvdC70LDQudC9LdC60LLQtdGB0YLRiywg0L3QtSDRhdCy0LDRgtCw0LXRgiDRgtC+0LvRjNC60L4g0YLQtdCx0Y8hINCt0YLQviDQsdGL0LvQviDQsdGLINC60YDRg9GC0L4g0LTQsNC20LUg0LHQtdC3INC/0YDQuNC30L7Qsi4g0J3QviDQv9GA0LjQt9GLINC10YHRgtGMISAj0LPQvtGA0L7QtNC30LDQuNCz0YDQsNC10YJcIlxyXG5cdFx0cGhvdG86ICdwaG90by0xMTE4NTA2ODJfMzk4MDQ5MDE0JyxcclxuXHRcdHNtYWxsX3Bob3RvOiBcImltZy9pbWFnZXMvYWNoaWV2ZXMtc21hbGwvaTMucG5nXCJcclxuXHR9XHJcblx0e1xyXG5cdFx0YWNoaWV2ZW1lbnRfaWQ6IDE0XHJcblx0XHRudW06IDRcclxuXHRcdG5hbWU6IFwi0J/RgNC40YjQtdC7INC6INGD0YHQv9C10YXRg1wiXHJcblx0XHRkZXNjcmlwdGlvbjogXCLQn9C+0L/QsNC7INCyINCi0J7Qny0yMCDQsiDQvtCx0YnQtdC8INGA0LXQudGC0LjQvdCz0LVcIlxyXG5cdFx0bWVzc2FnZTogXCLQmNCz0YDQsNC10Lwg0LIg0L7QvdC70LDQudC9LdC60LLQtdGB0YLRiywg0L3QtSDRhdCy0LDRgtCw0LXRgiDRgtC+0LvRjNC60L4g0YLQtdCx0Y8hINCt0YLQviDQsdGL0LvQviDQsdGLINC60YDRg9GC0L4g0LTQsNC20LUg0LHQtdC3INC/0YDQuNC30L7Qsi4g0J3QviDQv9GA0LjQt9GLINC10YHRgtGMISAj0LPQvtGA0L7QtNC30LDQuNCz0YDQsNC10YJcIlxyXG5cdFx0cGhvdG86ICdwaG90by0xMTE4NTA2ODJfMzk4MDQ5MDE5JyxcclxuXHRcdHNtYWxsX3Bob3RvOiBcImltZy9pbWFnZXMvYWNoaWV2ZXMtc21hbGwvaTQucG5nXCJcclxuXHR9XHJcblx0e1xyXG5cdFx0YWNoaWV2ZW1lbnRfaWQ6IDE1XHJcblx0XHRudW06IDVcclxuXHRcdG5hbWU6IFwi0JPQvtGA0L7QtNGB0LrQsNGPINC70LXQs9C10L3QtNCwXCJcclxuXHRcdGRlc2NyaXB0aW9uOiBcItCX0LDQstC10YDRiNC40Lsg0LLRgdC1INC00L7RgdGC0YPQv9C90YvQtSDQutCy0LXRgdGC0YtcIlxyXG5cdFx0bWVzc2FnZTogXCLQmNCz0YDQsNC10Lwg0LIg0L7QvdC70LDQudC9LdC60LLQtdGB0YLRiywg0L3QtSDRhdCy0LDRgtCw0LXRgiDRgtC+0LvRjNC60L4g0YLQtdCx0Y8hINCt0YLQviDQsdGL0LvQviDQsdGLINC60YDRg9GC0L4g0LTQsNC20LUg0LHQtdC3INC/0YDQuNC30L7Qsi4g0J3QviDQv9GA0LjQt9GLINC10YHRgtGMISAj0LPQvtGA0L7QtNC30LDQuNCz0YDQsNC10YJcIlxyXG5cdFx0cGhvdG86ICdwaG90by0xMTE4NTA2ODJfMzk4MDQ5MDEzJyxcclxuXHRcdHNtYWxsX3Bob3RvOiBcImltZy9pbWFnZXMvYWNoaWV2ZXMtc21hbGwvaTUucG5nXCJcclxuXHR9XHJcblx0e1xyXG5cdFx0YWNoaWV2ZW1lbnRfaWQ6IDE2XHJcblx0XHRudW06IDZcclxuXHRcdG5hbWU6IFwi0JLQtdGA0LHQvtCy0YnQuNC6XCJcclxuXHRcdGRlc2NyaXB0aW9uOiBcItCf0YDQuNCz0LvQsNGB0LjQuyA1INC00YDRg9C30LXQuVwiXHJcblx0XHRtZXNzYWdlOiBcItCY0LPRgNCw0LXQvCDQsiDQvtC90LvQsNC50L0t0LrQstC10YHRgtGLLCDQvdC1INGF0LLQsNGC0LDQtdGCINGC0L7Qu9GM0LrQviDRgtC10LHRjyEg0K3RgtC+INCx0YvQu9C+INCx0Ysg0LrRgNGD0YLQviDQtNCw0LbQtSDQsdC10Lcg0L/RgNC40LfQvtCyLiDQndC+INC/0YDQuNC30Ysg0LXRgdGC0YwhICPQs9C+0YDQvtC00LfQsNC40LPRgNCw0LXRglwiXHJcblx0XHRwaG90bzogJ3Bob3RvLTExMTg1MDY4Ml8zOTgwNDkwMTYnLFxyXG5cdFx0c21hbGxfcGhvdG86IFwiaW1nL2ltYWdlcy9hY2hpZXZlcy1zbWFsbC9pNi5wbmdcIlxyXG5cdH1cclxuXHR7XHJcblx0XHRhY2hpZXZlbWVudF9pZDogMTdcclxuXHRcdG51bTogN1xyXG5cdFx0bmFtZTogXCLQk9C40L/QvdC+0LbQsNCx0LBcIlxyXG5cdFx0ZGVzY3JpcHRpb246IFwi0J/RgNC40LPQu9Cw0YHQuNC7IDEwINC00YDRg9C30LXQuVwiXHJcblx0XHRtZXNzYWdlOiBcItCY0LPRgNCw0LXQvCDQsiDQvtC90LvQsNC50L0t0LrQstC10YHRgtGLLCDQvdC1INGF0LLQsNGC0LDQtdGCINGC0L7Qu9GM0LrQviDRgtC10LHRjyEg0K3RgtC+INCx0YvQu9C+INCx0Ysg0LrRgNGD0YLQviDQtNCw0LbQtSDQsdC10Lcg0L/RgNC40LfQvtCyLiDQndC+INC/0YDQuNC30Ysg0LXRgdGC0YwhICPQs9C+0YDQvtC00LfQsNC40LPRgNCw0LXRglwiXHJcblx0XHRwaG90bzogJ3Bob3RvLTExMTg1MDY4Ml8zOTgwNDkwMTInLFxyXG5cdFx0c21hbGxfcGhvdG86IFwiaW1nL2ltYWdlcy9hY2hpZXZlcy1zbWFsbC9pNy5wbmdcIlxyXG5cdH1cclxuXSIsIm1vZHVsZS5leHBvcnRzLnNlbmQgPSAoZXZlbnRfbmFtZSkgLT5cclxuXHRnYSgnc2VuZCcsIHtcclxuXHRcdGhpdFR5cGU6ICdldmVudCcsXHJcblx0XHRldmVudENhdGVnb3J5OiAnZXZlbnRzJyxcclxuXHRcdGV2ZW50QWN0aW9uOiBldmVudF9uYW1lXHJcblx0fSkiLCJrZXlzID0gcmVxdWlyZSAnLi9rZXlzLmNvZmZlZSdcclxuXHJcbmBiaW4yaGV4ID0gZnVuY3Rpb24ocykge1xyXG5cdC8vICBkaXNjdXNzIGF0OiBodHRwOi8vcGhwanMub3JnL2Z1bmN0aW9ucy9iaW4yaGV4L1xyXG5cdC8vIG9yaWdpbmFsIGJ5OiBLZXZpbiB2YW4gWm9ubmV2ZWxkIChodHRwOi8va2V2aW4udmFuem9ubmV2ZWxkLm5ldClcclxuXHQvLyBidWdmaXhlZCBieTogT25ubyBNYXJzbWFuXHJcblx0Ly8gYnVnZml4ZWQgYnk6IExpbnV4d29ybGRcclxuXHQvLyBpbXByb3ZlZCBieTogbnRvbmlhenppIChodHRwOi8vcGhwanMub3JnL2Z1bmN0aW9ucy9iaW4yaGV4OjM2MSNjb21tZW50XzE3NzYxNilcclxuXHQvLyAgIGV4YW1wbGUgMTogYmluMmhleCgnS2V2Jyk7XHJcblx0Ly8gICByZXR1cm5zIDE6ICc0YjY1NzYnXHJcblx0Ly8gICBleGFtcGxlIDI6IGJpbjJoZXgoU3RyaW5nLmZyb21DaGFyQ29kZSgweDAwKSk7XHJcblx0Ly8gICByZXR1cm5zIDI6ICcwMCdcclxuXHJcblx0dmFyIGksIGwsIG8gPSAnJyxcclxuXHRcdG47XHJcblxyXG5cdHMgKz0gJyc7XHJcblxyXG5cdGZvciAoaSA9IDAsIGwgPSBzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG5cdFx0biA9IHMuY2hhckNvZGVBdChpKS50b1N0cmluZygxNik7XHJcblx0XHRvICs9IG4ubGVuZ3RoIDwgMiA/ICcwJyArIG4gOiBuO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIG9cclxufVxyXG5cclxuaGV4MmJpbiA9IGZ1bmN0aW9uKHMpIHtcclxuXHQvLyAgZGlzY3VzcyBhdDogaHR0cDovL3BocGpzLm9yZy9mdW5jdGlvbnMvaGV4MmJpbi9cclxuXHQvLyBvcmlnaW5hbCBieTogRHVtaXRydSBVenVuIChodHRwOi8vZHV6dW4ubWUpXHJcblx0Ly8gICBleGFtcGxlIDE6IGhleDJiaW4oJzQ0Njk2ZDYxJyk7XHJcblx0Ly8gICByZXR1cm5zIDE6ICdEaW1hJ1xyXG5cdC8vICAgZXhhbXBsZSAyOiBoZXgyYmluKCcwMCcpO1xyXG5cdC8vICAgcmV0dXJucyAyOiAnXFx4MDAnXHJcblx0Ly8gICBleGFtcGxlIDM6IGhleDJiaW4oJzJmMXEnKVxyXG5cdC8vICAgcmV0dXJucyAzOiBmYWxzZVxyXG5cclxuXHR2YXIgcmV0ID0gW10sXHJcblx0XHRpID0gMCxcclxuXHRcdGw7XHJcblxyXG5cdHMgKz0gJyc7XHJcblxyXG5cdGZvciAobCA9IHMubGVuZ3RoOyBpIDwgbDsgaSArPSAyKSB7XHJcblx0XHR2YXIgYyA9IHBhcnNlSW50KHMuc3Vic3RyKGksIDEpLCAxNik7XHJcblx0XHR2YXIgayA9IHBhcnNlSW50KHMuc3Vic3RyKGkgKyAxLCAxKSwgMTYpO1xyXG5cdFx0aWYgKGlzTmFOKGMpIHx8IGlzTmFOKGspKSByZXR1cm4gZmFsc2U7XHJcblx0XHRyZXQucHVzaCgoYyA8PCA0KSB8IGspO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCByZXQpXHJcbn1gXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5kZWNyeXB0ID0gKHN0ciwgdmVjdG9yKSAtPlxyXG5cdG1jcnlwdC5DcnlwdChudWxsLCBudWxsLCBudWxsLCBrZXlzLmdldE1kNWtleSgpLCAncmlqbmRhZWwtMjU2JywgJ2NiYycpXHJcblx0ZGVjID0gbWNyeXB0LkRlY3J5cHQgaGV4MmJpbihzdHIpLCBoZXgyYmluKHZlY3RvcilcclxuXHRkZWMgPSBkZWMucmVwbGFjZSgvW1xceDAwLVxceDFGXFx4N0YtXFx4OUZdL2csIFwiXCIpXHJcblx0cmV0dXJuIEpTT04ucGFyc2UgZGVjIiwibWQ1ID0gcmVxdWlyZSAnLi9tZDUuY29mZmVlJ1xyXG5cclxuQXBwU2V0dGluZyA9IHdpbmRvdy5BcHBTZXR0aW5nIHx8IHt9XHJcblxyXG5BcHBTZXR0aW5nLnNpZCA9IEFwcFNldHRpbmcuc2lkIHx8IFwiMVwiXHJcbkFwcFNldHRpbmcuaGFzaCA9IEFwcFNldHRpbmcuaGFzaCB8fCBcImhhc2hfdGVzdFwiXHJcbkFwcFNldHRpbmcudmlld2VyX2lkID0gQXBwU2V0dGluZy52aWV3ZXJfaWQgfHwgXCIzOTQzMzY0XCJcclxuQXBwU2V0dGluZy5hdXRoX2tleSA9IEFwcFNldHRpbmcuYXV0aF9rZXkgfHwgXCI1ODM0MTZjZjFiZWY2OTAxOWJhN2VlYTBhZDY4YTc4YVwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRzaWQ6IEFwcFNldHRpbmcuc2lkXHJcblx0aGFzaDogQXBwU2V0dGluZy5oYXNoXHJcblx0dmlld2VyX2lkIDogQXBwU2V0dGluZy52aWV3ZXJfaWRcclxuXHRhdXRoX2tleSA6IEFwcFNldHRpbmcuYXV0aF9rZXlcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuc2V0SGFzaCA9ICh2YWwpIC0+XHJcblx0bW9kdWxlLmV4cG9ydHMuaGFzaCA9IHZhbFxyXG5cclxubW9kdWxlLmV4cG9ydHMuZ2V0TWQ1a2V5ID0gKCkgLT5cclxuXHRyZXR1cm4gbWQ1LmVuY3J5cHQobW9kdWxlLmV4cG9ydHMuaGFzaCArIFwiX19cIiArIEFwcFNldHRpbmcuc2lkKVxyXG4iLCJrZXlzID0gcmVxdWlyZSgnLi9rZXlzJylcclxuXHJcbm1vZHVsZS5leHBvcnRzLmluaXQgPSAtPlxyXG5cdCQoJ2hlYWRlciBhJykuZWFjaCAoaSwgZWwpIC0+XHJcblx0XHRocmVmID0gJChlbCkuYXR0cignaHJlZicpXHJcblx0XHQjaWYgaHJlZi5zdWJzdHIoLTEpID09IFwiL1wiIHRoZW4gaHJlZiA9IGhyZWYuc3Vic3RyKDAsaHJlZi5sZW5ndGgtMSlcclxuXHRcdCQoZWwpLmF0dHIoJ2hyZWYnLCBocmVmK1wiP3NpZD1cIitrZXlzLnNpZCtcIiZ2aWV3ZXJfaWQ9XCIra2V5cy52aWV3ZXJfaWQrXCImYXV0aF9rZXk9XCIra2V5cy5hdXRoX2tleSlcclxuXHJcbm1vZHVsZS5leHBvcnRzLmFkZEJ1dEhhc2ggPSAoJGVscykgLT5cclxuXHQkZWxzLmVhY2ggKGksIGVsKSAtPlxyXG5cdFx0Y29uc29sZS5sb2cgZWxcclxuXHRcdGhyZWYgPSAkKGVsKS5hdHRyKCdocmVmJylcclxuXHRcdCQoZWwpLmF0dHIoJ2hyZWYnLCBocmVmK1wiJnNpZD1cIitrZXlzLnNpZCtcIiZ2aWV3ZXJfaWQ9XCIra2V5cy52aWV3ZXJfaWQrXCImYXV0aF9rZXk9XCIra2V5cy5hdXRoX2tleSlcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5hZGRXaGF0QnV0SGFzaCA9ICgkZWxzKSAtPlxyXG5cdCRlbHMuZWFjaCAoaSwgZWwpIC0+XHJcblx0XHRjb25zb2xlLmxvZyBlbFxyXG5cdFx0aHJlZiA9ICQoZWwpLmF0dHIoJ2hyZWYnKVxyXG5cdFx0JChlbCkuYXR0cignaHJlZicsIGhyZWYrXCI/c2lkPVwiK2tleXMuc2lkK1wiJnZpZXdlcl9pZD1cIitrZXlzLnZpZXdlcl9pZCtcIiZhdXRoX2tleT1cIitrZXlzLmF1dGhfa2V5KVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzLnBhcnNlR2V0UGFyYW1zID0gLT5cclxuXHQkX0dFVCA9IHt9XHJcblx0X19HRVQgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cmluZygxKS5zcGxpdChcIiZcIilcclxuXHRmb3IgdnZhciBpbiBfX0dFVFxyXG5cdFx0Z2V0VmFyID0gdnZhci5zcGxpdChcIj1cIilcclxuXHRcdGlmIHR5cGVvZihnZXRWYXJbMV0pPT1cInVuZGVmaW5lZFwiXHJcblx0XHRcdCRfR0VUW2dldFZhclswXV0gPSBcIlwiXHJcblx0XHRlbHNlXHJcblx0XHRcdCRfR0VUW2dldFZhclswXV0gPSBnZXRWYXJbMV1cclxuXHRyZXR1cm4gJF9HRVRcclxuIiwiYGZ1bmN0aW9uIG1kNWN5Y2xlKHgsIGspIHtcclxudmFyIGEgPSB4WzBdLCBiID0geFsxXSwgYyA9IHhbMl0sIGQgPSB4WzNdO1xyXG5cclxuYSA9IGZmKGEsIGIsIGMsIGQsIGtbMF0sIDcsIC02ODA4NzY5MzYpO1xyXG5kID0gZmYoZCwgYSwgYiwgYywga1sxXSwgMTIsIC0zODk1NjQ1ODYpO1xyXG5jID0gZmYoYywgZCwgYSwgYiwga1syXSwgMTcsICA2MDYxMDU4MTkpO1xyXG5iID0gZmYoYiwgYywgZCwgYSwga1szXSwgMjIsIC0xMDQ0NTI1MzMwKTtcclxuYSA9IGZmKGEsIGIsIGMsIGQsIGtbNF0sIDcsIC0xNzY0MTg4OTcpO1xyXG5kID0gZmYoZCwgYSwgYiwgYywga1s1XSwgMTIsICAxMjAwMDgwNDI2KTtcclxuYyA9IGZmKGMsIGQsIGEsIGIsIGtbNl0sIDE3LCAtMTQ3MzIzMTM0MSk7XHJcbmIgPSBmZihiLCBjLCBkLCBhLCBrWzddLCAyMiwgLTQ1NzA1OTgzKTtcclxuYSA9IGZmKGEsIGIsIGMsIGQsIGtbOF0sIDcsICAxNzcwMDM1NDE2KTtcclxuZCA9IGZmKGQsIGEsIGIsIGMsIGtbOV0sIDEyLCAtMTk1ODQxNDQxNyk7XHJcbmMgPSBmZihjLCBkLCBhLCBiLCBrWzEwXSwgMTcsIC00MjA2Myk7XHJcbmIgPSBmZihiLCBjLCBkLCBhLCBrWzExXSwgMjIsIC0xOTkwNDA0MTYyKTtcclxuYSA9IGZmKGEsIGIsIGMsIGQsIGtbMTJdLCA3LCAgMTgwNDYwMzY4Mik7XHJcbmQgPSBmZihkLCBhLCBiLCBjLCBrWzEzXSwgMTIsIC00MDM0MTEwMSk7XHJcbmMgPSBmZihjLCBkLCBhLCBiLCBrWzE0XSwgMTcsIC0xNTAyMDAyMjkwKTtcclxuYiA9IGZmKGIsIGMsIGQsIGEsIGtbMTVdLCAyMiwgIDEyMzY1MzUzMjkpO1xyXG5cclxuYSA9IGdnKGEsIGIsIGMsIGQsIGtbMV0sIDUsIC0xNjU3OTY1MTApO1xyXG5kID0gZ2coZCwgYSwgYiwgYywga1s2XSwgOSwgLTEwNjk1MDE2MzIpO1xyXG5jID0gZ2coYywgZCwgYSwgYiwga1sxMV0sIDE0LCAgNjQzNzE3NzEzKTtcclxuYiA9IGdnKGIsIGMsIGQsIGEsIGtbMF0sIDIwLCAtMzczODk3MzAyKTtcclxuYSA9IGdnKGEsIGIsIGMsIGQsIGtbNV0sIDUsIC03MDE1NTg2OTEpO1xyXG5kID0gZ2coZCwgYSwgYiwgYywga1sxMF0sIDksICAzODAxNjA4Myk7XHJcbmMgPSBnZyhjLCBkLCBhLCBiLCBrWzE1XSwgMTQsIC02NjA0NzgzMzUpO1xyXG5iID0gZ2coYiwgYywgZCwgYSwga1s0XSwgMjAsIC00MDU1Mzc4NDgpO1xyXG5hID0gZ2coYSwgYiwgYywgZCwga1s5XSwgNSwgIDU2ODQ0NjQzOCk7XHJcbmQgPSBnZyhkLCBhLCBiLCBjLCBrWzE0XSwgOSwgLTEwMTk4MDM2OTApO1xyXG5jID0gZ2coYywgZCwgYSwgYiwga1szXSwgMTQsIC0xODczNjM5NjEpO1xyXG5iID0gZ2coYiwgYywgZCwgYSwga1s4XSwgMjAsICAxMTYzNTMxNTAxKTtcclxuYSA9IGdnKGEsIGIsIGMsIGQsIGtbMTNdLCA1LCAtMTQ0NDY4MTQ2Nyk7XHJcbmQgPSBnZyhkLCBhLCBiLCBjLCBrWzJdLCA5LCAtNTE0MDM3ODQpO1xyXG5jID0gZ2coYywgZCwgYSwgYiwga1s3XSwgMTQsICAxNzM1MzI4NDczKTtcclxuYiA9IGdnKGIsIGMsIGQsIGEsIGtbMTJdLCAyMCwgLTE5MjY2MDc3MzQpO1xyXG5cclxuYSA9IGhoKGEsIGIsIGMsIGQsIGtbNV0sIDQsIC0zNzg1NTgpO1xyXG5kID0gaGgoZCwgYSwgYiwgYywga1s4XSwgMTEsIC0yMDIyNTc0NDYzKTtcclxuYyA9IGhoKGMsIGQsIGEsIGIsIGtbMTFdLCAxNiwgIDE4MzkwMzA1NjIpO1xyXG5iID0gaGgoYiwgYywgZCwgYSwga1sxNF0sIDIzLCAtMzUzMDk1NTYpO1xyXG5hID0gaGgoYSwgYiwgYywgZCwga1sxXSwgNCwgLTE1MzA5OTIwNjApO1xyXG5kID0gaGgoZCwgYSwgYiwgYywga1s0XSwgMTEsICAxMjcyODkzMzUzKTtcclxuYyA9IGhoKGMsIGQsIGEsIGIsIGtbN10sIDE2LCAtMTU1NDk3NjMyKTtcclxuYiA9IGhoKGIsIGMsIGQsIGEsIGtbMTBdLCAyMywgLTEwOTQ3MzA2NDApO1xyXG5hID0gaGgoYSwgYiwgYywgZCwga1sxM10sIDQsICA2ODEyNzkxNzQpO1xyXG5kID0gaGgoZCwgYSwgYiwgYywga1swXSwgMTEsIC0zNTg1MzcyMjIpO1xyXG5jID0gaGgoYywgZCwgYSwgYiwga1szXSwgMTYsIC03MjI1MjE5NzkpO1xyXG5iID0gaGgoYiwgYywgZCwgYSwga1s2XSwgMjMsICA3NjAyOTE4OSk7XHJcbmEgPSBoaChhLCBiLCBjLCBkLCBrWzldLCA0LCAtNjQwMzY0NDg3KTtcclxuZCA9IGhoKGQsIGEsIGIsIGMsIGtbMTJdLCAxMSwgLTQyMTgxNTgzNSk7XHJcbmMgPSBoaChjLCBkLCBhLCBiLCBrWzE1XSwgMTYsICA1MzA3NDI1MjApO1xyXG5iID0gaGgoYiwgYywgZCwgYSwga1syXSwgMjMsIC05OTUzMzg2NTEpO1xyXG5cclxuYSA9IGlpKGEsIGIsIGMsIGQsIGtbMF0sIDYsIC0xOTg2MzA4NDQpO1xyXG5kID0gaWkoZCwgYSwgYiwgYywga1s3XSwgMTAsICAxMTI2ODkxNDE1KTtcclxuYyA9IGlpKGMsIGQsIGEsIGIsIGtbMTRdLCAxNSwgLTE0MTYzNTQ5MDUpO1xyXG5iID0gaWkoYiwgYywgZCwgYSwga1s1XSwgMjEsIC01NzQzNDA1NSk7XHJcbmEgPSBpaShhLCBiLCBjLCBkLCBrWzEyXSwgNiwgIDE3MDA0ODU1NzEpO1xyXG5kID0gaWkoZCwgYSwgYiwgYywga1szXSwgMTAsIC0xODk0OTg2NjA2KTtcclxuYyA9IGlpKGMsIGQsIGEsIGIsIGtbMTBdLCAxNSwgLTEwNTE1MjMpO1xyXG5iID0gaWkoYiwgYywgZCwgYSwga1sxXSwgMjEsIC0yMDU0OTIyNzk5KTtcclxuYSA9IGlpKGEsIGIsIGMsIGQsIGtbOF0sIDYsICAxODczMzEzMzU5KTtcclxuZCA9IGlpKGQsIGEsIGIsIGMsIGtbMTVdLCAxMCwgLTMwNjExNzQ0KTtcclxuYyA9IGlpKGMsIGQsIGEsIGIsIGtbNl0sIDE1LCAtMTU2MDE5ODM4MCk7XHJcbmIgPSBpaShiLCBjLCBkLCBhLCBrWzEzXSwgMjEsICAxMzA5MTUxNjQ5KTtcclxuYSA9IGlpKGEsIGIsIGMsIGQsIGtbNF0sIDYsIC0xNDU1MjMwNzApO1xyXG5kID0gaWkoZCwgYSwgYiwgYywga1sxMV0sIDEwLCAtMTEyMDIxMDM3OSk7XHJcbmMgPSBpaShjLCBkLCBhLCBiLCBrWzJdLCAxNSwgIDcxODc4NzI1OSk7XHJcbmIgPSBpaShiLCBjLCBkLCBhLCBrWzldLCAyMSwgLTM0MzQ4NTU1MSk7XHJcblxyXG54WzBdID0gYWRkMzIoYSwgeFswXSk7XHJcbnhbMV0gPSBhZGQzMihiLCB4WzFdKTtcclxueFsyXSA9IGFkZDMyKGMsIHhbMl0pO1xyXG54WzNdID0gYWRkMzIoZCwgeFszXSk7XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBjbW4ocSwgYSwgYiwgeCwgcywgdCkge1xyXG5hID0gYWRkMzIoYWRkMzIoYSwgcSksIGFkZDMyKHgsIHQpKTtcclxucmV0dXJuIGFkZDMyKChhIDw8IHMpIHwgKGEgPj4+ICgzMiAtIHMpKSwgYik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZmKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcclxucmV0dXJuIGNtbigoYiAmIGMpIHwgKCh+YikgJiBkKSwgYSwgYiwgeCwgcywgdCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdnKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcclxucmV0dXJuIGNtbigoYiAmIGQpIHwgKGMgJiAofmQpKSwgYSwgYiwgeCwgcywgdCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhoKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcclxucmV0dXJuIGNtbihiIF4gYyBeIGQsIGEsIGIsIHgsIHMsIHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpaShhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XHJcbnJldHVybiBjbW4oYyBeIChiIHwgKH5kKSksIGEsIGIsIHgsIHMsIHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtZDUxKHMpIHtcclxuXHR0eHQgPSAnJztcclxuXHR2YXIgbiA9IHMubGVuZ3RoLFxyXG5cdFx0c3RhdGUgPSBbMTczMjU4NDE5MywgLTI3MTczMzg3OSwgLTE3MzI1ODQxOTQsIDI3MTczMzg3OF0sIGk7XHJcblx0Zm9yIChpPTY0OyBpPD1zLmxlbmd0aDsgaSs9NjQpIHtcclxuXHRcdG1kNWN5Y2xlKHN0YXRlLCBtZDVibGsocy5zdWJzdHJpbmcoaS02NCwgaSkpKTtcclxuXHR9XHJcblx0cyA9IHMuc3Vic3RyaW5nKGktNjQpO1xyXG5cdHZhciB0YWlsID0gWzAsMCwwLDAsIDAsMCwwLDAsIDAsMCwwLDAsIDAsMCwwLDBdO1xyXG5cdGZvciAoaT0wOyBpPHMubGVuZ3RoOyBpKyspXHJcblx0XHR0YWlsW2k+PjJdIHw9IHMuY2hhckNvZGVBdChpKSA8PCAoKGklNCkgPDwgMyk7XHJcblx0dGFpbFtpPj4yXSB8PSAweDgwIDw8ICgoaSU0KSA8PCAzKTtcclxuXHRpZiAoaSA+IDU1KSB7XHJcblx0XHRtZDVjeWNsZShzdGF0ZSwgdGFpbCk7XHJcblx0XHRmb3IgKGk9MDsgaTwxNjsgaSsrKSB0YWlsW2ldID0gMDtcclxuXHR9XHJcblx0dGFpbFsxNF0gPSBuKjg7XHJcblx0bWQ1Y3ljbGUoc3RhdGUsIHRhaWwpO1xyXG5cdHJldHVybiBzdGF0ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gbWQ1YmxrKHMpIHsgLyogSSBmaWd1cmVkIGdsb2JhbCB3YXMgZmFzdGVyLiAgICovXHJcblx0dmFyIG1kNWJsa3MgPSBbXSwgaTsgLyogQW5keSBLaW5nIHNhaWQgZG8gaXQgdGhpcyB3YXkuICovXHJcblx0Zm9yIChpPTA7IGk8NjQ7IGkrPTQpIHtcclxuXHRcdG1kNWJsa3NbaT4+Ml0gPSBzLmNoYXJDb2RlQXQoaSlcclxuXHRcdCsgKHMuY2hhckNvZGVBdChpKzEpIDw8IDgpXHJcblx0XHQrIChzLmNoYXJDb2RlQXQoaSsyKSA8PCAxNilcclxuXHRcdCsgKHMuY2hhckNvZGVBdChpKzMpIDw8IDI0KTtcclxuXHR9XHJcblx0cmV0dXJuIG1kNWJsa3M7XHJcbn1cclxuXHJcbnZhciBoZXhfY2hyID0gJzAxMjM0NTY3ODlhYmNkZWYnLnNwbGl0KCcnKTtcclxuXHJcbmZ1bmN0aW9uIHJoZXgobilcclxue1xyXG5cdHZhciBzPScnLCBqPTA7XHJcblx0Zm9yKDsgajw0OyBqKyspXHJcblx0cyArPSBoZXhfY2hyWyhuID4+IChqICogOCArIDQpKSAmIDB4MEZdXHJcblx0KyBoZXhfY2hyWyhuID4+IChqICogOCkpICYgMHgwRl07XHJcblx0cmV0dXJuIHM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhleCh4KSB7XHJcblx0Zm9yICh2YXIgaT0wOyBpPHgubGVuZ3RoOyBpKyspXHJcblx0eFtpXSA9IHJoZXgoeFtpXSk7XHJcblx0cmV0dXJuIHguam9pbignJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1kNShzKSB7XHJcblx0cmV0dXJuIGhleChtZDUxKHMpKTtcclxufVxyXG5cclxuLyogdGhpcyBmdW5jdGlvbiBpcyBtdWNoIGZhc3Rlcixcclxuc28gaWYgcG9zc2libGUgd2UgdXNlIGl0LiBTb21lIElFc1xyXG5hcmUgdGhlIG9ubHkgb25lcyBJIGtub3cgb2YgdGhhdFxyXG5uZWVkIHRoZSBpZGlvdGljIHNlY29uZCBmdW5jdGlvbixcclxuZ2VuZXJhdGVkIGJ5IGFuIGlmIGNsYXVzZS4gICovXHJcblxyXG5mdW5jdGlvbiBhZGQzMihhLCBiKSB7XHJcblx0cmV0dXJuIChhICsgYikgJiAweEZGRkZGRkZGO1xyXG59XHJcblxyXG5pZiAobWQ1KCdoZWxsbycpICE9ICc1ZDQxNDAyYWJjNGIyYTc2Yjk3MTlkOTExMDE3YzU5MicpIHtcclxuXHRmdW5jdGlvbiBhZGQzMih4LCB5KSB7XHJcblx0XHR2YXIgbHN3ID0gKHggJiAweEZGRkYpICsgKHkgJiAweEZGRkYpLFxyXG5cdFx0bXN3ID0gKHggPj4gMTYpICsgKHkgPj4gMTYpICsgKGxzdyA+PiAxNik7XHJcblx0XHRyZXR1cm4gKG1zdyA8PCAxNikgfCAobHN3ICYgMHhGRkZGKTtcclxuXHR9XHJcbn1gXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5lbmNyeXB0ID0gbWQ1IiwicmVxdWVzdCA9IHJlcXVpcmUoJy4uL3JlcXVlc3QnKVxyXG5cclxuXHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzLmluaXQgPSAoY2FsbGJhY2spIC0+XHJcblxyXG5cdGluaXRTdWNjZXNzID0gLT5cclxuXHRcdGNvbnNvbGUubG9nIFwiaW5pdCBzdWNjZXNzXCJcclxuXHRcdGNhbGxiYWNrKClcclxuXHJcblx0aW5pdEZhaWwgPSAtPlxyXG5cdFx0Y29uc29sZS5sb2cgJ2luaXQgZmFpbCdcclxuXHJcblx0VksuaW5pdCBpbml0U3VjY2VzcywgaW5pdEZhaWwsICc1LjQwJ1xyXG5cclxubW9kdWxlLmV4cG9ydHMucmVzaXplID0gKGhlaWdodCkgLT5cclxuXHRWSy5jYWxsTWV0aG9kIFwicmVzaXplV2luZG93XCIsIDEwMDAsIGhlaWdodFxyXG5cclxubW9kdWxlLmV4cG9ydHMuaXNSZWcgPSAoY2FsbGJhY2spIC0+XHJcblx0cmVxdWVzdC51c2VyLmlzUmVnIHt9LCAocmVzKSAtPlxyXG5cdFx0Y29uc29sZS5sb2cgXCJJUyBSRUcgXCIgKyByZXMucmVzdWx0XHJcblx0XHRpZiByZXMucmVzdWx0ID09IHRydWVcclxuXHRcdFx0Y2FsbGJhY2soKVxyXG5cdFx0aWYgcmVzLnJlc3VsdCA9PSBmYWxzZVxyXG5cdFx0XHRnZXRVc2VySW5mbygpXHJcblxyXG5cdGdldFVzZXJJbmZvID0gLT5cclxuXHRcdFZLLmFwaSAndXNlcnMuZ2V0Jywge3Rlc3RfbW9kZTogMSwgZmllbGRzOlwic2NyZWVuX25hbWUsc2V4LGJkYXRlLGNpdHksY291bnRyeSxwaG90b19tYXhcIn0sIChkYXRhKSAtPlxyXG5cclxuXHRcdFx0aWYgIWRhdGEucmVzcG9uc2VbMF0/XHJcblx0XHRcdFx0Y29uc29sZS5sb2cgZGF0YVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHRjb25zb2xlLmxvZyBkYXRhXHJcblx0XHRcdHBlcnNvbkluZm8gPSB7XHJcblx0XHRcdFx0Zmlyc3RfbmFtZSA6IGRhdGEucmVzcG9uc2VbMF0uZmlyc3RfbmFtZSB8fCBcIlwiXHJcblx0XHRcdFx0bGFzdF9uYW1lIDogZGF0YS5yZXNwb25zZVswXS5sYXN0X25hbWUgfHwgXCJcIlxyXG5cdFx0XHRcdHNjcmVlbl9uYW1lIDogZGF0YS5yZXNwb25zZVswXS5zY3JlZW5fbmFtZSB8fCBcIlwiXHJcblx0XHRcdFx0c2V4IDogZGF0YS5yZXNwb25zZVswXS5zZXhcclxuXHRcdFx0XHRiZGF0ZSA6ICBkYXRhLnJlc3BvbnNlWzBdLmJkYXRlIHx8ICcwMS4wMS4wMDAwJ1xyXG5cdFx0XHRcdHBob3RvIDogZGF0YS5yZXNwb25zZVswXS5waG90b19tYXggfHwgXCJcIlxyXG5cdFx0XHR9XHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdHBlcnNvbkluZm8uY2l0eSA9IGRhdGEucmVzcG9uc2VbMF0uY2l0eS50aXRsZVxyXG5cdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0cGVyc29uSW5mby5jaXR5ID0gXCJcIlxyXG5cdFx0XHR0cnlcclxuXHRcdFx0XHRwZXJzb25JbmZvLmNvdW50cnkgPSBkYXRhLnJlc3BvbnNlWzBdLmNvdW50cnkudGl0bGVcclxuXHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdHBlcnNvbkluZm8uY291bnRyeSA9IFwiXCJcclxuXHJcblxyXG5cdFx0XHRyZXF1ZXN0LnVzZXIucmVnaXN0cmF0aW9uIHBlcnNvbkluZm8sIChyZXMpIC0+XHJcblx0XHRcdFx0Y29uc29sZS5sb2cgcmVzXHJcblx0XHRcdFx0Y2FsbGJhY2soKVxyXG5cclxubW9kdWxlLmV4cG9ydHMud2FsbFBvc3QgPSAob3B0cywgc3VjY2VzcykgLT5cclxuXHRvcHRzLnRlc3RfbW9kZSA9IDFcclxuXHRWSy5hcGkgJ3dhbGwucG9zdCcsIG9wdHMsIChkYXRhKSAtPlxyXG5cdFx0Y29uc29sZS5sb2cgZGF0YVxyXG5cdFx0ZGF0YS5yZXNwb25zZSA9IGRhdGEucmVzcG9uc2UgfHwge31cclxuXHRcdGlmIGRhdGEucmVzcG9uc2UucG9zdF9pZFxyXG5cdFx0XHQj0L7Qv9GD0LHQu9C40LrQvtCy0LDQvVxyXG5cdFx0XHRzdWNjZXNzKClcclxuXHRcdGVsc2VcclxuXHRcdFx0I9C+0YjQuNCx0LrQsFxyXG5cclxubW9kdWxlLmV4cG9ydHMuaW52aXRlRnJpZW5kcyA9ICgpIC0+XHJcblx0VksuY2FsbE1ldGhvZCBcInNob3dJbnZpdGVCb3hcIiJdfQ==
