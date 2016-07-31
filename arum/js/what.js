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
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"word__form\"><div class=\"word__form-inner\"><div class=\"word__form-header\"><div class=\"word__form-img\"><img src=\"img/images/gussed-tuc.png\"/></div><p>Ты уже всё здесь отгадал!</p></div></div></div>");;return buf.join("");
};
},{"jade/runtime":2}],4:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"word__form\"><div class=\"word__form-inner\"><div class=\"word__form-header\"><div class=\"word__form-img\"><img src=\"img/images/what-tuc.png\"/></div><p>Этот улетный вкус TUC пока готовится к выходу.</p><p>Есть догадка, что это будет?</p><p>Впиши её сюда</p><i class=\"icon-arrow-down\"></i></div><div class=\"word__input-wrap\"><div class=\"input__label-error\"></div><i class=\"icon-close error-close\"></i><input class=\"word__form-input\"/></div><div class=\"but but--white but--sm js-openTaste\">Отправить</div><div class=\"word__form-bottom\"><p>Если угадаешь - получишь</p><p>200 БОНУСНЫХ БАЛЛОВ</p></div></div></div>");;return buf.join("");
};
},{"jade/runtime":2}],5:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (user) {
buf.push("<div class=\"header__profile_left\"><img" + (jade.attr("src", "" + (user.info.photo) + "", true, false)) + " class=\"header__profile_photo\"/></div><div class=\"header__profile__right\"><div class=\"header__profile__name\">" + (jade.escape((jade_interp = user.nickname) == null ? '' : jade_interp)) + "</div><div class=\"header__profile__scores\">" + (jade.escape((jade_interp = +user.info.current_score) == null ? '' : jade_interp)) + " / " + (jade.escape((jade_interp = +user.info.common_score) == null ? '' : jade_interp)) + "</div></div><!--i.icon-header-sharebut.header__sharebut-->");}.call(this,"user" in locals_for_with?locals_for_with.user:typeof user!=="undefined"?user:undefined));;return buf.join("");
};
},{"jade/runtime":2}],6:[function(require,module,exports){
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


},{"../popups":14,"../request":39,"../tools/anal.coffee":41,"../tools/links.coffee":43,"./header__profile.jade":5,"./messenger__icon.jade":7}],7:[function(require,module,exports){
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
},{"jade/runtime":2}],8:[function(require,module,exports){
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


},{"../request":39,"../tools/achvData.coffee":40,"../tools/vk.coffee":45,"./achieve.jade":9}],9:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (info) {
buf.push("<div" + (jade.attr("data-id", "" + (info.id) + "", true, false)) + " class=\"achieve\"><div class=\"achieve__icon-wrapper\"><img" + (jade.attr("src", "" + (info.icon) + "", true, false)) + " class=\"achieve__icon\"/></div><div class=\"achieve__title\">" + (jade.escape((jade_interp = info.title) == null ? '' : jade_interp)) + "</div><div class=\"achieve__text\">" + (jade.escape((jade_interp = info.text) == null ? '' : jade_interp)) + "</div><div class=\"achieve__but-wrapper\"><div class=\"achieve__but but js-shareAchv\">Поделиться</div></div></div>");}.call(this,"info" in locals_for_with?locals_for_with.info:typeof info!=="undefined"?info:undefined));;return buf.join("");
};
},{"jade/runtime":2}],10:[function(require,module,exports){
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


},{"../request":39,"./checkpoint.jade":11}],11:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (info) {
buf.push("<div class=\"chpopup\"><div" + (jade.attr("style", "background-image: url('" + (info.image_hint) + "')", true, false)) + " class=\"chpopup__header\"><div class=\"chpopup__ura\"><span class=\"chpopup__whiteback\">Ура! Ты открыл</span></div><div class=\"chpopup__title\"><span class=\"chpopup__whiteback\">" + (jade.escape((jade_interp = info.title) == null ? '' : jade_interp)) + "</span></div><div class=\"chpopup__desc\"><span class=\"chpopup__whiteback\">" + (jade.escape((jade_interp = info.description) == null ? '' : jade_interp)) + "</span></div></div><div class=\"chpopup__main\"><div class=\"chpopup__next\">Следующий пункт</div><div class=\"chpopup__hint\">" + (jade.escape((jade_interp = info.hint) == null ? '' : jade_interp)) + "</div><div class=\"chpopup__but but but--low js-closePopup\">Искать</div></div></div>");}.call(this,"info" in locals_for_with?locals_for_with.info:typeof info!=="undefined"?info:undefined));;return buf.join("");
};
},{"jade/runtime":2}],12:[function(require,module,exports){
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


},{"../request":39,"./gameenter.jade":13}],13:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (info) {
buf.push("<div class=\"chpopup\"><div" + (jade.attr("style", "background-image: url('" + (info.image_hint) + "')", true, false)) + " class=\"chpopup__header\"><div class=\"chpopup__title\"><span class=\"chpopup__whiteback\">" + (jade.escape((jade_interp = info.title) == null ? '' : jade_interp)) + "</span></div><div class=\"chpopup__desc\"><span class=\"chpopup__whiteback\">" + (jade.escape((jade_interp = info.description) == null ? '' : jade_interp)) + "</span></div></div><div class=\"chpopup__main\"><div class=\"chpopup__next\">Следующий пункт</div><div class=\"chpopup__hint\">" + (jade.escape((jade_interp = info.hint) == null ? '' : jade_interp)) + "</div><div class=\"chpopup__but but but--low js-closePopup\">Искать</div></div></div>");}.call(this,"info" in locals_for_with?locals_for_with.info:typeof info!=="undefined"?info:undefined));;return buf.join("");
};
},{"jade/runtime":2}],14:[function(require,module,exports){
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


},{"./achieve.coffee":8,"./checkpoint.coffee":10,"./gameenter.coffee":12,"./index.jade":15,"./intro.coffee":16,"./invite.coffee":18,"./messenger/messenger.coffee":20,"./money.coffee":24,"./myprizes.coffee":27,"./newtaste.coffee":29,"./pizza.coffee":31,"./rating.coffee":35,"./userinfo.coffee":37}],15:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (curID) {
buf.push("<div" + (jade.attr("data-id", "" + (curID) + "", true, false)) + (jade.attr("style", "z-index:" + (curID+10) + "", true, false)) + " class=\"popup__shade\"><div class=\"popup\"><i class=\"icon-popup-cross popup__cross\"></i><div class=\"popup__forloading\"></div></div></div>");}.call(this,"curID" in locals_for_with?locals_for_with.curID:typeof curID!=="undefined"?curID:undefined));;return buf.join("");
};
},{"jade/runtime":2}],16:[function(require,module,exports){
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


},{"./intro.jade":17}],17:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"popup__wrap--intro\"><iframe class=\"intro__video\" width=\"588\" height=\"360\" src=\"https://www.youtube.com/embed/uw08j-yOfcE\" frameborder=\"0\"></iframe><div class=\"intro__skipvideo\">Пропустить</div></div>");;return buf.join("");
};
},{"jade/runtime":2}],18:[function(require,module,exports){
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


},{"./invite.jade":19}],19:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"popup__wrap--invite\"><h3 class=\"invite__title\">Выбери друзей,<br>которых хочешь пригласить</h3><div class=\"invite__inputwrapper\"><input type=\"text\" placeholder=\"Введи имя\" class=\"invite__input\"/></div><div class=\"invite__list\"><div class=\"leaders__el invite__el invite__el--invited\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Вячеслав<br>Вячеславович</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Вячеслав<br>Вячеславович</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Вячеслав<br>Вячеславович</div></div></div><div class=\"leaders__el invite__el invite__el--invited\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el invite__el--invited\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el invite__el--invited\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Николай<br>Николаевич</div></div></div><div class=\"leaders__el invite__el invite__el--invited\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el invite__el--invited\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div></div></div>");;return buf.join("");
};
},{"jade/runtime":2}],20:[function(require,module,exports){
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


},{"../../header/messenger__icon.jade":7,"../../request/index":39,"./messenger.jade":21,"./notification.jade":22,"./question.jade":23}],21:[function(require,module,exports){
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
},{"jade/runtime":2}],22:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (info) {
buf.push("<div class=\"messenger__mes-val\">" + (jade.escape((jade_interp = info.answer) == null ? '' : jade_interp)) + "</div>");}.call(this,"info" in locals_for_with?locals_for_with.info:typeof info!=="undefined"?info:undefined));;return buf.join("");
};
},{"jade/runtime":2}],23:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (info) {
buf.push("<div class=\"messenger__mes-title\">Вопрос:</div><div class=\"messenger__mes-val\">" + (jade.escape((jade_interp = info.question) == null ? '' : jade_interp)) + "</div><div class=\"messenger__mes-title\">Ответ:</div><div class=\"messenger__mes-val\">" + (jade.escape((jade_interp = info.answer) == null ? '' : jade_interp)) + "</div>");}.call(this,"info" in locals_for_with?locals_for_with.info:typeof info!=="undefined"?info:undefined));;return buf.join("");
};
},{"jade/runtime":2}],24:[function(require,module,exports){
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


},{"../request":39,"./money_fail.jade":25,"./money_ok.jade":26}],25:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"popup__wrap--intro\"><div class=\"chpopup__moneymes\"><p>Ты был очень близок к этому призу, но кто-то оказался на долю секунды быстрее (</p><p>Не отчаивайся! Завтра мы разыграем еще 500 рублей, потом еще и еще – и так каждый день без выходных. Тебе наверняка повезет! Спасибо, играй с нами еще!</p></div></div>");;return buf.join("");
};
},{"jade/runtime":2}],26:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"popup__wrap--intro\"><div class=\"chpopup__moneymes\"><p>Поздравляем, ты первым нашел сегодняшние призовые деньги на телефон! Красавчик!</p><p>Если твоя анкета заполнена – деньги скоро упадут на счет твоего мобильного. Если нет – заполни ее, не откладывая. Спасибо, играй с нами еще!</p></div></div>");;return buf.join("");
};
},{"jade/runtime":2}],27:[function(require,module,exports){
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


},{"../request":39,"./myprizes.jade":28}],28:[function(require,module,exports){
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
},{"jade/runtime":2}],29:[function(require,module,exports){
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


},{"../request":39,"./index.coffee":14,"./newtaste.jade":30}],30:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"taste__wrap\"><h2 class=\"taste__title\">Именно!</h2><div class=\"taste__body\"><div class=\"taste__body-text\"><p>Начисляем тебе 200 баллов.</p><p>Не забудь попробовать</p><P>Новый Tuc!</P></div><div class=\"taste__body-img\"><img src=\"img/images/tuc-200.png\"/></div></div></div>");;return buf.join("");
};
},{"jade/runtime":2}],31:[function(require,module,exports){
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


},{"../request":39,"./pizza.jade":32}],32:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"chpopup\"><div class=\"chpopup__pizza-title\">+50 баллов!</div><div class=\"chpopup__pizza-desc\">Поздравляем, ты нашел новый TUC Пицца!\nА теперь попробуй найти его по-настоящему в магазинах своего города!</div><div class=\"chpopup__pizza-desc2\">Удачи и приятного аппетита!</div></div>");;return buf.join("");
};
},{"jade/runtime":2}],33:[function(require,module,exports){
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
},{"jade/runtime":2}],34:[function(require,module,exports){
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
},{"jade/runtime":2}],35:[function(require,module,exports){
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


},{"../request":39,"./rating-list.jade":33,"./rating-pagination.jade":34,"./rating.jade":36}],36:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (res) {
buf.push("<div class=\"popup__wrap--intro\"><div class=\"popleaders\"><div class=\"popleaders__left\"><h3 class=\"popleaders__title\">Рейтинг игры</h3><div class=\"leaders__switcher_wrapper\"><div class=\"leaders__switcher\"><div data-href=\".popleaders__cat--current\" class=\"leaders__switchbut leaders__switchcurrent\">Текущий</div><div data-href=\".popleaders__cat--common\" class=\"leaders__switchbut leaders__switchbut--active leaders__switchcommon\">Общий</div></div></div></div><div class=\"popleaders__right\"><div data-type=\"common\" class=\"popleaders__common popleaders__tab popleader__active\"><div class=\"popleaders__list\"><div class=\"popleaders__cat\"></div></div><div class=\"leaders__el\"><div class=\"leaders__counter\">" + (jade.escape((jade_interp = res.common.you.place) == null ? '' : jade_interp)) + "</div><img" + (jade.attr("src", "" + (res.common.you.photo) + "", true, false)) + " class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">" + (jade.escape((jade_interp = res.common.you.nickname) == null ? '' : jade_interp)) + "</div></div></div><div class=\"popleaders__pagination\"></div></div><div data-type=\"current\" class=\"popleaders__current popleaders__tab\"><div class=\"popleaders__list\"><div class=\"popleaders__cat\"></div></div><div class=\"leaders__el\"><div class=\"leaders__counter\">" + (jade.escape((jade_interp = res.current.you.place) == null ? '' : jade_interp)) + "</div><img" + (jade.attr("src", "" + (res.current.you.photo) + "", true, false)) + " class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">" + (jade.escape((jade_interp = res.current.you.nickname) == null ? '' : jade_interp)) + "</div></div></div><div class=\"popleaders__pagination\"></div></div></div></div></div>");}.call(this,"res" in locals_for_with?locals_for_with.res:typeof res!=="undefined"?res:undefined));;return buf.join("");
};
},{"jade/runtime":2}],37:[function(require,module,exports){
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


},{"../request":39,"./index.coffee":14,"./userinfo.jade":38}],38:[function(require,module,exports){
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
},{"jade/runtime":2}],39:[function(require,module,exports){
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


},{"../tools/keys.coffee":42}],40:[function(require,module,exports){
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


},{}],41:[function(require,module,exports){
module.exports.send = function(event_name) {
  return ga('send', {
    hitType: 'event',
    eventCategory: 'events',
    eventAction: event_name
  });
};


},{}],42:[function(require,module,exports){
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


},{"./md5.coffee":44}],43:[function(require,module,exports){
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


},{"./keys":42}],44:[function(require,module,exports){
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


},{}],45:[function(require,module,exports){
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


},{"../request":39}],46:[function(require,module,exports){
var addError, closeError, formEnabled, gussedTemplate, isWord, notGussedTemplate, popups, request, vk;

vk = require('./tools/vk.coffee');

request = require('./request');

popups = require('./popups');

gussedTemplate = require('../../jade/whatGussed.jade');

notGussedTemplate = require('../../jade/whatNotGussed.jade');

vk.init(function() {
  var header;
  vk.resize(890);
  return header = require('./header');
});

closeError = function() {
  if ($('.word__input-wrap').hasClass('error')) {
    return $('.word__input-wrap').removeClass('error');
  }
};

addError = function() {
  return $('.word__input-wrap').addClass('error');
};

formEnabled = function() {
  return request.taste.isEnabled({}, function(res) {
    if (res.result) {
      $(".word__form-wrap").html(notGussedTemplate);
      $('.word__form-input').focus();
      return vk.resize(1400);
    } else {
      $(".word__form-wrap").html(gussedTemplate);
      return vk.resize(1145);
    }
  });
};

isWord = function() {
  var word;
  word = $('.word__form-input').val();
  if (!word) {
    addError();
    $('.word__form-input').focus();
    return;
  }
  return request.taste.check({
    word: word
  }, function(res) {
    if (res.result) {
      popups.openModal("newtaste");
      return formEnabled();
    } else {
      addError();
      return $('.word__form-input').focus();
    }
  });
};


},{"../../jade/whatGussed.jade":3,"../../jade/whatNotGussed.jade":4,"./header":6,"./popups":14,"./request":39,"./tools/vk.coffee":45}]},{},[46])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2phZGUvcnVudGltZS5qcyIsInNyYy9qYWRlL3doYXRHdXNzZWQuamFkZSIsInNyYy9qYWRlL3doYXROb3RHdXNzZWQuamFkZSIsInNyYy9qcy9zY3JpcHQvaGVhZGVyL2hlYWRlcl9fcHJvZmlsZS5qYWRlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXGhlYWRlclxcaW5kZXguY29mZmVlIiwic3JjL2pzL3NjcmlwdC9oZWFkZXIvbWVzc2VuZ2VyX19pY29uLmphZGUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxccG9wdXBzXFxhY2hpZXZlLmNvZmZlZSIsInNyYy9qcy9zY3JpcHQvcG9wdXBzL2FjaGlldmUuamFkZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFxwb3B1cHNcXGNoZWNrcG9pbnQuY29mZmVlIiwic3JjL2pzL3NjcmlwdC9wb3B1cHMvY2hlY2twb2ludC5qYWRlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXHBvcHVwc1xcZ2FtZWVudGVyLmNvZmZlZSIsInNyYy9qcy9zY3JpcHQvcG9wdXBzL2dhbWVlbnRlci5qYWRlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXHBvcHVwc1xcaW5kZXguY29mZmVlIiwic3JjL2pzL3NjcmlwdC9wb3B1cHMvaW5kZXguamFkZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFxwb3B1cHNcXGludHJvLmNvZmZlZSIsInNyYy9qcy9zY3JpcHQvcG9wdXBzL2ludHJvLmphZGUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxccG9wdXBzXFxpbnZpdGUuY29mZmVlIiwic3JjL2pzL3NjcmlwdC9wb3B1cHMvaW52aXRlLmphZGUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxccG9wdXBzXFxtZXNzZW5nZXJcXG1lc3Nlbmdlci5jb2ZmZWUiLCJzcmMvanMvc2NyaXB0L3BvcHVwcy9tZXNzZW5nZXIvbWVzc2VuZ2VyLmphZGUiLCJzcmMvanMvc2NyaXB0L3BvcHVwcy9tZXNzZW5nZXIvbm90aWZpY2F0aW9uLmphZGUiLCJzcmMvanMvc2NyaXB0L3BvcHVwcy9tZXNzZW5nZXIvcXVlc3Rpb24uamFkZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFxwb3B1cHNcXG1vbmV5LmNvZmZlZSIsInNyYy9qcy9zY3JpcHQvcG9wdXBzL21vbmV5X2ZhaWwuamFkZSIsInNyYy9qcy9zY3JpcHQvcG9wdXBzL21vbmV5X29rLmphZGUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxccG9wdXBzXFxteXByaXplcy5jb2ZmZWUiLCJzcmMvanMvc2NyaXB0L3BvcHVwcy9teXByaXplcy5qYWRlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXHBvcHVwc1xcbmV3dGFzdGUuY29mZmVlIiwic3JjL2pzL3NjcmlwdC9wb3B1cHMvbmV3dGFzdGUuamFkZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFxwb3B1cHNcXHBpenphLmNvZmZlZSIsInNyYy9qcy9zY3JpcHQvcG9wdXBzL3BpenphLmphZGUiLCJzcmMvanMvc2NyaXB0L3BvcHVwcy9yYXRpbmctbGlzdC5qYWRlIiwic3JjL2pzL3NjcmlwdC9wb3B1cHMvcmF0aW5nLXBhZ2luYXRpb24uamFkZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFxwb3B1cHNcXHJhdGluZy5jb2ZmZWUiLCJzcmMvanMvc2NyaXB0L3BvcHVwcy9yYXRpbmcuamFkZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFxwb3B1cHNcXHVzZXJpbmZvLmNvZmZlZSIsInNyYy9qcy9zY3JpcHQvcG9wdXBzL3VzZXJpbmZvLmphZGUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxccmVxdWVzdFxcaW5kZXguY29mZmVlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXHRvb2xzXFxhY2h2RGF0YS5jb2ZmZWUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxcdG9vbHNcXGFuYWwuY29mZmVlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXHRvb2xzXFxrZXlzLmNvZmZlZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFx0b29sc1xcbGlua3MuY29mZmVlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXHRvb2xzXFxtZDUuY29mZmVlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXHRvb2xzXFx2ay5jb2ZmZWUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxcd2hhdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFBO2FBQ0EsRUFBRSxDQUFDLE1BQUgsQ0FBVSxJQUFWLEVBSEQ7S0FBQSxNQUFBO01BS0MsQ0FBQSxDQUFFLGtCQUFGLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsY0FBM0I7YUFDQSxFQUFFLENBQUMsTUFBSCxDQUFVLElBQVYsRUFORDs7RUFEMkIsQ0FBNUI7QUFEYTs7QUFVZCxNQUFBLEdBQVMsU0FBQTtBQUNSLE1BQUE7RUFBQSxJQUFBLEdBQU8sQ0FBQSxDQUFFLG1CQUFGLENBQXNCLENBQUMsR0FBdkIsQ0FBQTtFQUNQLElBQUcsQ0FBQyxJQUFKO0lBQ0MsUUFBQSxDQUFBO0lBQ0EsQ0FBQSxDQUFFLG1CQUFGLENBQXNCLENBQUMsS0FBdkIsQ0FBQTtBQUNBLFdBSEQ7O1NBSUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFkLENBQW9CO0lBQUMsSUFBQSxFQUFNLElBQVA7R0FBcEIsRUFBa0MsU0FBQyxHQUFEO0lBQ2pDLElBQUksR0FBRyxDQUFDLE1BQVI7TUFDQyxNQUFNLENBQUMsU0FBUCxDQUFpQixVQUFqQjthQUNBLFdBQUEsQ0FBQSxFQUZEO0tBQUEsTUFBQTtNQUlDLFFBQUEsQ0FBQTthQUNBLENBQUEsQ0FBRSxtQkFBRixDQUFzQixDQUFDLEtBQXZCLENBQUEsRUFMRDs7RUFEaUMsQ0FBbEM7QUFOUSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIiLCIoZnVuY3Rpb24oZil7aWYodHlwZW9mIGV4cG9ydHM9PT1cIm9iamVjdFwiJiZ0eXBlb2YgbW9kdWxlIT09XCJ1bmRlZmluZWRcIil7bW9kdWxlLmV4cG9ydHM9ZigpfWVsc2UgaWYodHlwZW9mIGRlZmluZT09PVwiZnVuY3Rpb25cIiYmZGVmaW5lLmFtZCl7ZGVmaW5lKFtdLGYpfWVsc2V7dmFyIGc7aWYodHlwZW9mIHdpbmRvdyE9PVwidW5kZWZpbmVkXCIpe2c9d2luZG93fWVsc2UgaWYodHlwZW9mIGdsb2JhbCE9PVwidW5kZWZpbmVkXCIpe2c9Z2xvYmFsfWVsc2UgaWYodHlwZW9mIHNlbGYhPT1cInVuZGVmaW5lZFwiKXtnPXNlbGZ9ZWxzZXtnPXRoaXN9Zy5qYWRlID0gZigpfX0pKGZ1bmN0aW9uKCl7dmFyIGRlZmluZSxtb2R1bGUsZXhwb3J0cztyZXR1cm4gKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkoezE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIE1lcmdlIHR3byBhdHRyaWJ1dGUgb2JqZWN0cyBnaXZpbmcgcHJlY2VkZW5jZVxuICogdG8gdmFsdWVzIGluIG9iamVjdCBgYmAuIENsYXNzZXMgYXJlIHNwZWNpYWwtY2FzZWRcbiAqIGFsbG93aW5nIGZvciBhcnJheXMgYW5kIG1lcmdpbmcvam9pbmluZyBhcHByb3ByaWF0ZWx5XG4gKiByZXN1bHRpbmcgaW4gYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBiXG4gKiBAcmV0dXJuIHtPYmplY3R9IGFcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMubWVyZ2UgPSBmdW5jdGlvbiBtZXJnZShhLCBiKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgdmFyIGF0dHJzID0gYVswXTtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGF0dHJzID0gbWVyZ2UoYXR0cnMsIGFbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cnM7XG4gIH1cbiAgdmFyIGFjID0gYVsnY2xhc3MnXTtcbiAgdmFyIGJjID0gYlsnY2xhc3MnXTtcblxuICBpZiAoYWMgfHwgYmMpIHtcbiAgICBhYyA9IGFjIHx8IFtdO1xuICAgIGJjID0gYmMgfHwgW107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFjKSkgYWMgPSBbYWNdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShiYykpIGJjID0gW2JjXTtcbiAgICBhWydjbGFzcyddID0gYWMuY29uY2F0KGJjKS5maWx0ZXIobnVsbHMpO1xuICB9XG5cbiAgZm9yICh2YXIga2V5IGluIGIpIHtcbiAgICBpZiAoa2V5ICE9ICdjbGFzcycpIHtcbiAgICAgIGFba2V5XSA9IGJba2V5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYTtcbn07XG5cbi8qKlxuICogRmlsdGVyIG51bGwgYHZhbGBzLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbnVsbHModmFsKSB7XG4gIHJldHVybiB2YWwgIT0gbnVsbCAmJiB2YWwgIT09ICcnO1xufVxuXG4vKipcbiAqIGpvaW4gYXJyYXkgYXMgY2xhc3Nlcy5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmpvaW5DbGFzc2VzID0gam9pbkNsYXNzZXM7XG5mdW5jdGlvbiBqb2luQ2xhc3Nlcyh2YWwpIHtcbiAgcmV0dXJuIChBcnJheS5pc0FycmF5KHZhbCkgPyB2YWwubWFwKGpvaW5DbGFzc2VzKSA6XG4gICAgKHZhbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0JykgPyBPYmplY3Qua2V5cyh2YWwpLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7IHJldHVybiB2YWxba2V5XTsgfSkgOlxuICAgIFt2YWxdKS5maWx0ZXIobnVsbHMpLmpvaW4oJyAnKTtcbn1cblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGNsYXNzZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gY2xhc3Nlc1xuICogQHBhcmFtIHtBcnJheS48Qm9vbGVhbj59IGVzY2FwZWRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5jbHMgPSBmdW5jdGlvbiBjbHMoY2xhc3NlcywgZXNjYXBlZCkge1xuICB2YXIgYnVmID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChlc2NhcGVkICYmIGVzY2FwZWRbaV0pIHtcbiAgICAgIGJ1Zi5wdXNoKGV4cG9ydHMuZXNjYXBlKGpvaW5DbGFzc2VzKFtjbGFzc2VzW2ldXSkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnVmLnB1c2goam9pbkNsYXNzZXMoY2xhc3Nlc1tpXSkpO1xuICAgIH1cbiAgfVxuICB2YXIgdGV4dCA9IGpvaW5DbGFzc2VzKGJ1Zik7XG4gIGlmICh0ZXh0Lmxlbmd0aCkge1xuICAgIHJldHVybiAnIGNsYXNzPVwiJyArIHRleHQgKyAnXCInO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnJztcbiAgfVxufTtcblxuXG5leHBvcnRzLnN0eWxlID0gZnVuY3Rpb24gKHZhbCkge1xuICBpZiAodmFsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHZhbCkubWFwKGZ1bmN0aW9uIChzdHlsZSkge1xuICAgICAgcmV0dXJuIHN0eWxlICsgJzonICsgdmFsW3N0eWxlXTtcbiAgICB9KS5qb2luKCc7Jyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxufTtcbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHBhcmFtIHtCb29sZWFufSBlc2NhcGVkXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHRlcnNlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0ciA9IGZ1bmN0aW9uIGF0dHIoa2V5LCB2YWwsIGVzY2FwZWQsIHRlcnNlKSB7XG4gIGlmIChrZXkgPT09ICdzdHlsZScpIHtcbiAgICB2YWwgPSBleHBvcnRzLnN0eWxlKHZhbCk7XG4gIH1cbiAgaWYgKCdib29sZWFuJyA9PSB0eXBlb2YgdmFsIHx8IG51bGwgPT0gdmFsKSB7XG4gICAgaWYgKHZhbCkge1xuICAgICAgcmV0dXJuICcgJyArICh0ZXJzZSA/IGtleSA6IGtleSArICc9XCInICsga2V5ICsgJ1wiJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH0gZWxzZSBpZiAoMCA9PSBrZXkuaW5kZXhPZignZGF0YScpICYmICdzdHJpbmcnICE9IHR5cGVvZiB2YWwpIHtcbiAgICBpZiAoSlNPTi5zdHJpbmdpZnkodmFsKS5pbmRleE9mKCcmJykgIT09IC0xKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1NpbmNlIEphZGUgMi4wLjAsIGFtcGVyc2FuZHMgKGAmYCkgaW4gZGF0YSBhdHRyaWJ1dGVzICcgK1xuICAgICAgICAgICAgICAgICAgICd3aWxsIGJlIGVzY2FwZWQgdG8gYCZhbXA7YCcpO1xuICAgIH07XG4gICAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsLnRvSVNPU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0phZGUgd2lsbCBlbGltaW5hdGUgdGhlIGRvdWJsZSBxdW90ZXMgYXJvdW5kIGRhdGVzIGluICcgK1xuICAgICAgICAgICAgICAgICAgICdJU08gZm9ybSBhZnRlciAyLjAuMCcpO1xuICAgIH1cbiAgICByZXR1cm4gJyAnICsga2V5ICsgXCI9J1wiICsgSlNPTi5zdHJpbmdpZnkodmFsKS5yZXBsYWNlKC8nL2csICcmYXBvczsnKSArIFwiJ1wiO1xuICB9IGVsc2UgaWYgKGVzY2FwZWQpIHtcbiAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwudG9JU09TdHJpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUud2FybignSmFkZSB3aWxsIHN0cmluZ2lmeSBkYXRlcyBpbiBJU08gZm9ybSBhZnRlciAyLjAuMCcpO1xuICAgIH1cbiAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cIicgKyBleHBvcnRzLmVzY2FwZSh2YWwpICsgJ1wiJztcbiAgfSBlbHNlIHtcbiAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwudG9JU09TdHJpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUud2FybignSmFkZSB3aWxsIHN0cmluZ2lmeSBkYXRlcyBpbiBJU08gZm9ybSBhZnRlciAyLjAuMCcpO1xuICAgIH1cbiAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cIicgKyB2YWwgKyAnXCInO1xuICB9XG59O1xuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gYXR0cmlidXRlcyBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtPYmplY3R9IGVzY2FwZWRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5hdHRycyA9IGZ1bmN0aW9uIGF0dHJzKG9iaiwgdGVyc2Upe1xuICB2YXIgYnVmID0gW107XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuXG4gIGlmIChrZXlzLmxlbmd0aCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV1cbiAgICAgICAgLCB2YWwgPSBvYmpba2V5XTtcblxuICAgICAgaWYgKCdjbGFzcycgPT0ga2V5KSB7XG4gICAgICAgIGlmICh2YWwgPSBqb2luQ2xhc3Nlcyh2YWwpKSB7XG4gICAgICAgICAgYnVmLnB1c2goJyAnICsga2V5ICsgJz1cIicgKyB2YWwgKyAnXCInKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnVmLnB1c2goZXhwb3J0cy5hdHRyKGtleSwgdmFsLCBmYWxzZSwgdGVyc2UpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmLmpvaW4oJycpO1xufTtcblxuLyoqXG4gKiBFc2NhcGUgdGhlIGdpdmVuIHN0cmluZyBvZiBgaHRtbGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGh0bWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbnZhciBqYWRlX2VuY29kZV9odG1sX3J1bGVzID0ge1xuICAnJic6ICcmYW1wOycsXG4gICc8JzogJyZsdDsnLFxuICAnPic6ICcmZ3Q7JyxcbiAgJ1wiJzogJyZxdW90Oydcbn07XG52YXIgamFkZV9tYXRjaF9odG1sID0gL1smPD5cIl0vZztcblxuZnVuY3Rpb24gamFkZV9lbmNvZGVfY2hhcihjKSB7XG4gIHJldHVybiBqYWRlX2VuY29kZV9odG1sX3J1bGVzW2NdIHx8IGM7XG59XG5cbmV4cG9ydHMuZXNjYXBlID0gamFkZV9lc2NhcGU7XG5mdW5jdGlvbiBqYWRlX2VzY2FwZShodG1sKXtcbiAgdmFyIHJlc3VsdCA9IFN0cmluZyhodG1sKS5yZXBsYWNlKGphZGVfbWF0Y2hfaHRtbCwgamFkZV9lbmNvZGVfY2hhcik7XG4gIGlmIChyZXN1bHQgPT09ICcnICsgaHRtbCkgcmV0dXJuIGh0bWw7XG4gIGVsc2UgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogUmUtdGhyb3cgdGhlIGdpdmVuIGBlcnJgIGluIGNvbnRleHQgdG8gdGhlXG4gKiB0aGUgamFkZSBpbiBgZmlsZW5hbWVgIGF0IHRoZSBnaXZlbiBgbGluZW5vYC5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IGxpbmVub1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5yZXRocm93ID0gZnVuY3Rpb24gcmV0aHJvdyhlcnIsIGZpbGVuYW1lLCBsaW5lbm8sIHN0cil7XG4gIGlmICghKGVyciBpbnN0YW5jZW9mIEVycm9yKSkgdGhyb3cgZXJyO1xuICBpZiAoKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgfHwgIWZpbGVuYW1lKSAmJiAhc3RyKSB7XG4gICAgZXJyLm1lc3NhZ2UgKz0gJyBvbiBsaW5lICcgKyBsaW5lbm87XG4gICAgdGhyb3cgZXJyO1xuICB9XG4gIHRyeSB7XG4gICAgc3RyID0gc3RyIHx8IHJlcXVpcmUoJ2ZzJykucmVhZEZpbGVTeW5jKGZpbGVuYW1lLCAndXRmOCcpXG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgcmV0aHJvdyhlcnIsIG51bGwsIGxpbmVubylcbiAgfVxuICB2YXIgY29udGV4dCA9IDNcbiAgICAsIGxpbmVzID0gc3RyLnNwbGl0KCdcXG4nKVxuICAgICwgc3RhcnQgPSBNYXRoLm1heChsaW5lbm8gLSBjb250ZXh0LCAwKVxuICAgICwgZW5kID0gTWF0aC5taW4obGluZXMubGVuZ3RoLCBsaW5lbm8gKyBjb250ZXh0KTtcblxuICAvLyBFcnJvciBjb250ZXh0XG4gIHZhciBjb250ZXh0ID0gbGluZXMuc2xpY2Uoc3RhcnQsIGVuZCkubWFwKGZ1bmN0aW9uKGxpbmUsIGkpe1xuICAgIHZhciBjdXJyID0gaSArIHN0YXJ0ICsgMTtcbiAgICByZXR1cm4gKGN1cnIgPT0gbGluZW5vID8gJyAgPiAnIDogJyAgICAnKVxuICAgICAgKyBjdXJyXG4gICAgICArICd8ICdcbiAgICAgICsgbGluZTtcbiAgfSkuam9pbignXFxuJyk7XG5cbiAgLy8gQWx0ZXIgZXhjZXB0aW9uIG1lc3NhZ2VcbiAgZXJyLnBhdGggPSBmaWxlbmFtZTtcbiAgZXJyLm1lc3NhZ2UgPSAoZmlsZW5hbWUgfHwgJ0phZGUnKSArICc6JyArIGxpbmVub1xuICAgICsgJ1xcbicgKyBjb250ZXh0ICsgJ1xcblxcbicgKyBlcnIubWVzc2FnZTtcbiAgdGhyb3cgZXJyO1xufTtcblxuZXhwb3J0cy5EZWJ1Z0l0ZW0gPSBmdW5jdGlvbiBEZWJ1Z0l0ZW0obGluZW5vLCBmaWxlbmFtZSkge1xuICB0aGlzLmxpbmVubyA9IGxpbmVubztcbiAgdGhpcy5maWxlbmFtZSA9IGZpbGVuYW1lO1xufVxuXG59LHtcImZzXCI6Mn1dLDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXG59LHt9XX0se30sWzFdKSgxKVxufSk7IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwid29yZF9fZm9ybVxcXCI+PGRpdiBjbGFzcz1cXFwid29yZF9fZm9ybS1pbm5lclxcXCI+PGRpdiBjbGFzcz1cXFwid29yZF9fZm9ybS1oZWFkZXJcXFwiPjxkaXYgY2xhc3M9XFxcIndvcmRfX2Zvcm0taW1nXFxcIj48aW1nIHNyYz1cXFwiaW1nL2ltYWdlcy9ndXNzZWQtdHVjLnBuZ1xcXCIvPjwvZGl2PjxwPtCi0Ysg0YPQttC1INCy0YHRkSDQt9C00LXRgdGMINC+0YLQs9Cw0LTQsNC7ITwvcD48L2Rpdj48L2Rpdj48L2Rpdj5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwid29yZF9fZm9ybVxcXCI+PGRpdiBjbGFzcz1cXFwid29yZF9fZm9ybS1pbm5lclxcXCI+PGRpdiBjbGFzcz1cXFwid29yZF9fZm9ybS1oZWFkZXJcXFwiPjxkaXYgY2xhc3M9XFxcIndvcmRfX2Zvcm0taW1nXFxcIj48aW1nIHNyYz1cXFwiaW1nL2ltYWdlcy93aGF0LXR1Yy5wbmdcXFwiLz48L2Rpdj48cD7QrdGC0L7RgiDRg9C70LXRgtC90YvQuSDQstC60YPRgSBUVUMg0L/QvtC60LAg0LPQvtGC0L7QstC40YLRgdGPINC6INCy0YvRhdC+0LTRgy48L3A+PHA+0JXRgdGC0Ywg0LTQvtCz0LDQtNC60LAsINGH0YLQviDRjdGC0L4g0LHRg9C00LXRgj88L3A+PHA+0JLQv9C40YjQuCDQtdGRINGB0Y7QtNCwPC9wPjxpIGNsYXNzPVxcXCJpY29uLWFycm93LWRvd25cXFwiPjwvaT48L2Rpdj48ZGl2IGNsYXNzPVxcXCJ3b3JkX19pbnB1dC13cmFwXFxcIj48ZGl2IGNsYXNzPVxcXCJpbnB1dF9fbGFiZWwtZXJyb3JcXFwiPjwvZGl2PjxpIGNsYXNzPVxcXCJpY29uLWNsb3NlIGVycm9yLWNsb3NlXFxcIj48L2k+PGlucHV0IGNsYXNzPVxcXCJ3b3JkX19mb3JtLWlucHV0XFxcIi8+PC9kaXY+PGRpdiBjbGFzcz1cXFwiYnV0IGJ1dC0td2hpdGUgYnV0LS1zbSBqcy1vcGVuVGFzdGVcXFwiPtCe0YLQv9GA0LDQstC40YLRjDwvZGl2PjxkaXYgY2xhc3M9XFxcIndvcmRfX2Zvcm0tYm90dG9tXFxcIj48cD7QldGB0LvQuCDRg9Cz0LDQtNCw0LXRiNGMIC0g0L/QvtC70YPRh9C40YjRjDwvcD48cD4yMDAg0JHQntCd0KPQodCd0KvQpSDQkdCQ0JvQm9Ce0JI8L3A+PC9kaXY+PC9kaXY+PC9kaXY+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKHVzZXIpIHtcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwiaGVhZGVyX19wcm9maWxlX2xlZnRcXFwiPjxpbWdcIiArIChqYWRlLmF0dHIoXCJzcmNcIiwgXCJcIiArICh1c2VyLmluZm8ucGhvdG8pICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJoZWFkZXJfX3Byb2ZpbGVfcGhvdG9cXFwiLz48L2Rpdj48ZGl2IGNsYXNzPVxcXCJoZWFkZXJfX3Byb2ZpbGVfX3JpZ2h0XFxcIj48ZGl2IGNsYXNzPVxcXCJoZWFkZXJfX3Byb2ZpbGVfX25hbWVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IHVzZXIubmlja25hbWUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjxkaXYgY2xhc3M9XFxcImhlYWRlcl9fcHJvZmlsZV9fc2NvcmVzXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSArdXNlci5pbmZvLmN1cnJlbnRfc2NvcmUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIiAvIFwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9ICt1c2VyLmluZm8uY29tbW9uX3Njb3JlKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj48IS0taS5pY29uLWhlYWRlci1zaGFyZWJ1dC5oZWFkZXJfX3NoYXJlYnV0LS0+XCIpO30uY2FsbCh0aGlzLFwidXNlclwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudXNlcjp0eXBlb2YgdXNlciE9PVwidW5kZWZpbmVkXCI/dXNlcjp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJyZXF1ZXN0ID0gcmVxdWlyZSgnLi4vcmVxdWVzdCcpXHJcbnRlbXBsYXRlID0gcmVxdWlyZSgnLi9oZWFkZXJfX3Byb2ZpbGUuamFkZScpXHJcbm1lc19pY29uID0gcmVxdWlyZSgnLi9tZXNzZW5nZXJfX2ljb24uamFkZScpXHJcbmxpbmtzID0gcmVxdWlyZSgnLi4vdG9vbHMvbGlua3MuY29mZmVlJykuaW5pdCgpXHJcbnBvcHVwcyA9IHJlcXVpcmUgJy4uL3BvcHVwcydcclxuYW5hbCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2FuYWwuY29mZmVlJ1xyXG5cclxuJCgnYm9keScpLm9uICdjbGljaycsICcuanMtb3BlblVzZXJJbmZvJywgLT5cclxuXHRwb3B1cHMub3Blbk1vZGFsKFwidXNlcmluZm9cIilcclxuXHRhbmFsLnNlbmQoJ9Cb0Jpf0JvQuNGH0L3Ri9C10LTQsNC90L3Ri9C1JylcclxuJCgnYm9keScpLm9uICdjbGljaycsICcuanMtb3Blbk1haWwnLCAtPlxyXG5cdHBvcHVwcy5vcGVuTW9kYWwgXCJtZXNzZW5nZXJcIlxyXG5cdGFuYWwuc2VuZChcItCb0Jpf0KHQvtC+0LHRidC10L3QuNC1XCIpXHJcblxyXG4kKCcuanMtb3BlblF1ZXN0c1BhZ2UnKS5vbiAnY2xpY2snLCAtPlxyXG5cdGFuYWwuc2VuZChcItCc0LXQvdGOX9Ca0LLQtdGB0YLRi1wiKVxyXG5cclxuJCgnLmpzLW9wZW5Qcml6ZXNQYWdlJykub24gJ2NsaWNrJywgLT5cclxuXHRhbmFsLnNlbmQoXCLQnNC10L3Rjl/Qn9GA0LjQt9GLXCIpXHJcblxyXG4kKCcuanMtb3BlblJ1bGVzUGFnZScpLm9uICdjbGljaycsIC0+XHJcblx0YW5hbC5zZW5kKFwi0JzQtdC90Y5f0J/RgNCw0LLQuNC70LBcIilcclxuXHJcbiQoJy5qcy1vcGVuV2hhdFBhZ2UnKS5vbiAnY2xpY2snLCAtPlxyXG5cdGFuYWwuc2VuZChcItCc0LXQvdGOX9Cn0YLQvtCX0LBUVUM/XCIpXHJcblxyXG5yZXF1ZXN0LnVzZXIuZ2V0IHt9LCAocmVzKSAtPlxyXG5cdGNvbnNvbGUubG9nIHJlc1xyXG5cdCQoXCIuaGVhZGVyX19wcm9maWxlXCIpLmh0bWwgdGVtcGxhdGUge3VzZXI6cmVzWzBdIH1cclxuXHRyZXF1ZXN0LmZlZWRiYWNrLmdldCB7fSwgKHJlcykgLT5cclxuXHRcdGNvbnNvbGUubG9nIHJlc1xyXG5cdFx0dW5yZWFkcyA9IHJlcy5yZWR1Y2UoKHN1bSxtZXMpID0+XHJcblx0XHRcdGlmIG1lcy5yZWFkPT0wIHRoZW4gcmV0dXJuIHN1bSsxXHJcblx0XHRcdGVsc2UgcmV0dXJuIHN1bVxyXG5cdFx0LDApXHJcblx0XHQkKCcubWVzc2VuZ2VyX19pY29uLWZvcmxvYWRpbmcnKS5odG1sIG1lc19pY29uKHt1bnJlYWRzOnVucmVhZHN9KSIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKHVucmVhZHMpIHtcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX19pY29uIGhlYWRlcl9fbWFpbGxvZ28ganMtb3Blbk1haWxcXFwiPjxpIGNsYXNzPVxcXCJpY29uLWhlYWRlci1tYWlsXFxcIj48L2k+XCIpO1xuaWYgKCB1bnJlYWRzPjApXG57XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fdW5yZWFkcy1pY29uXFxcIj48c3BhbiBjbGFzcz1cXFwibWVzc2VuZ2VyX191bnJlYWRzLXZhbFxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gdW5yZWFkcykgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9zcGFuPjwvZGl2PlwiKTtcbn1cbmJ1Zi5wdXNoKFwiPC9kaXY+XCIpO30uY2FsbCh0aGlzLFwidW5yZWFkc1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudW5yZWFkczp0eXBlb2YgdW5yZWFkcyE9PVwidW5kZWZpbmVkXCI/dW5yZWFkczp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vYWNoaWV2ZS5qYWRlJylcclxudmsgPSByZXF1aXJlICcuLi90b29scy92ay5jb2ZmZWUnXHJcbnJlcXVlc3QgPSByZXF1aXJlICcuLi9yZXF1ZXN0J1xyXG5jb250YWluZXJfaWQgPSAwXHJcblxyXG5hY2hpZXZlX2lkID0gMFxyXG5cclxuYWNodnMgPSByZXF1aXJlICcuLi90b29scy9hY2h2RGF0YS5jb2ZmZWUnXHJcblxyXG5EQVRBID0gW1xyXG5cdHtcclxuXHRcdGlkOiAwXHJcblx0XHRpY29uOiBcImltZy9pbWFnZXMvYWNoaWV2ZXMvaTAucG5nXCJcclxuXHRcdHRpdGxlOiBcItCf0LXRgNCy0YvQuSDQv9C+0YjRkdC7XCJcclxuXHRcdHRleHQ6IFwi0J/QvtC00LXQu9C40YHRjCDQsNGH0LjQstC60L7QuSDRgSDQtNGA0YPQt9GM0Y/QvNC4INC4INC/0L7Qu9GD0YfQuCA1MCDQsdC+0L3Rg9GB0L3Ri9GFINCx0LDQu9C70L7Qsi5cIlxyXG5cdH1cclxuXHR7XHJcblx0XHRpZDogMVxyXG5cdFx0aWNvbjogXCJpbWcvaW1hZ2VzL2FjaGlldmVzL2kxLnBuZ1wiXHJcblx0XHR0aXRsZTogXCLQo9C/0ZHRgNGC0YvQuVwiXHJcblx0XHR0ZXh0OiBcItCf0L7QtNC10LvQuNGB0Ywg0LDRh9C40LLQutC+0Lkg0YEg0LTRgNGD0LfRjNGP0LzQuCDQuCDQv9C+0LvRg9GH0LggNTAg0LHQvtC90YPRgdC90YvRhSDQsdCw0LvQu9C+0LIuXCJcclxuXHR9XHJcblx0e1xyXG5cdFx0aWQ6IDJcclxuXHRcdGljb246IFwiaW1nL2ltYWdlcy9hY2hpZXZlcy9pMi5wbmdcIlxyXG5cdFx0dGl0bGU6IFwi0JTQsNC5INC/0Y/RgtGMIVwiXHJcblx0XHR0ZXh0OiBcItCf0L7QtNC10LvQuNGB0Ywg0LDRh9C40LLQutC+0Lkg0YEg0LTRgNGD0LfRjNGP0LzQuCDQuCDQv9C+0LvRg9GH0LggNTAg0LHQvtC90YPRgdC90YvRhSDQsdCw0LvQu9C+0LIuXCJcclxuXHR9XHJcblx0e1xyXG5cdFx0aWQ6IDNcclxuXHRcdGljb246IFwiaW1nL2ltYWdlcy9hY2hpZXZlcy9pMy5wbmdcIlxyXG5cdFx0dGl0bGU6IFwi0JrRgNCw0YHQsNCy0YfQuNC6XCJcclxuXHRcdHRleHQ6IFwi0J/QvtC00LXQu9C40YHRjCDQsNGH0LjQstC60L7QuSDRgSDQtNGA0YPQt9GM0Y/QvNC4INC4INC/0L7Qu9GD0YfQuCA1MCDQsdC+0L3Rg9GB0L3Ri9GFINCx0LDQu9C70L7Qsi5cIlxyXG5cdH1cclxuXHR7XHJcblx0XHRpZDogNFxyXG5cdFx0aWNvbjogXCJpbWcvaW1hZ2VzL2FjaGlldmVzL2k0LnBuZ1wiXHJcblx0XHR0aXRsZTogXCLQn9GA0LjRiNGR0Lsg0Log0YPRgdC/0LXRhdGDXCJcclxuXHRcdHRleHQ6IFwi0J/QvtC00LXQu9C40YHRjCDQsNGH0LjQstC60L7QuSDRgSDQtNGA0YPQt9GM0Y/QvNC4INC4INC/0L7Qu9GD0YfQuCA1MCDQsdC+0L3Rg9GB0L3Ri9GFINCx0LDQu9C70L7Qsi5cIlxyXG5cdH1cclxuXHR7XHJcblx0XHRpZDogNVxyXG5cdFx0aWNvbjogXCJpbWcvaW1hZ2VzL2FjaGlldmVzL2k1LnBuZ1wiXHJcblx0XHR0aXRsZTogXCLQk9C+0YDQvtC00YHQutCw0Y8g0LvQtdCz0LXQvdC00LBcIlxyXG5cdFx0dGV4dDogXCLQn9C+0LTQtdC70LjRgdGMINCw0YfQuNCy0LrQvtC5INGBINC00YDRg9C30YzRj9C80Lgg0Lgg0L/QvtC70YPRh9C4IDUwINCx0L7QvdGD0YHQvdGL0YUg0LHQsNC70LvQvtCyLlwiXHJcblx0fVxyXG5cdHtcclxuXHRcdGlkOiA2XHJcblx0XHRpY29uOiBcImltZy9pbWFnZXMvYWNoaWV2ZXMvaTYucG5nXCJcclxuXHRcdHRpdGxlOiBcItCS0LXRgNCx0L7QstGJ0LjQulwiXHJcblx0XHR0ZXh0OiBcItCf0L7QtNC10LvQuNGB0Ywg0LDRh9C40LLQutC+0Lkg0YEg0LTRgNGD0LfRjNGP0LzQuCDQuCDQv9C+0LvRg9GH0LggNTAg0LHQvtC90YPRgdC90YvRhSDQsdCw0LvQu9C+0LIuXCJcclxuXHR9XHJcblx0e1xyXG5cdFx0aWQ6IDdcclxuXHRcdGljb246IFwiaW1nL2ltYWdlcy9hY2hpZXZlcy9pNy5wbmdcIlxyXG5cdFx0dGl0bGU6IFwi0JPQuNC/0L3QvtC20LDQsdCwXCJcclxuXHRcdHRleHQ6IFwi0J/QvtC00LXQu9C40YHRjCDQsNGH0LjQstC60L7QuSDRgSDQtNGA0YPQt9GM0Y/QvNC4INC4INC/0L7Qu9GD0YfQuCA1MCDQsdC+0L3Rg9GB0L3Ri9GFINCx0LDQu9C70L7Qsi5cIlxyXG5cdH1cclxuXVxyXG5cclxubW9kdWxlLmV4cG9ydHMub3Blbk1vZGFsID0gKGlkLCBvcHRzKSAtPlxyXG5cdGNvbnRhaW5lcl9pZCA9IGlkXHJcblx0YWNoaWV2ZV9pZCA9ICtvcHRzLmlkXHJcblx0JChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2NvbnRhaW5lcl9pZH1dXCIpLmZpbmQoJy5wb3B1cF9fZm9ybG9hZGluZycpLmh0bWwgdGVtcGxhdGUoe2luZm86IERBVEFbYWNoaWV2ZV9pZF19KVxyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jbG9zZU1vZGFsID0gKGlkKSAtPlxyXG5cdGFjaHZfaWQgPSAgKyQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tpZH1dXCIpLmZpbmQoJy5hY2hpZXZlJykuYXR0cignZGF0YS1pZCcpXHJcblx0cmVxdWVzdC5hY2hpZXZlbWVudC5yZWFkIHthY2hpZXZlbWVudF9pZDogYWNodl9pZH0sIChyZXMpIC0+XHJcblx0XHRjb25zb2xlLmxvZyByZXNcclxuXHJcblxyXG4kKFwiLnBvcHVwX19zdXBlcmNvbnRhaW5lclwiKS5vbiAnY2xpY2snLCAnLmpzLXNoYXJlQWNodicsIC0+XHJcblx0aWQgPSArJCh0aGlzKS5jbG9zZXN0KCcuYWNoaWV2ZScpLmF0dHIoJ2RhdGEtaWQnKVxyXG5cdCRzaGFkZSA9ICQodGhpcykuY2xvc2VzdCgnLnBvcHVwX19zaGFkZScpXHJcblx0dmsud2FsbFBvc3Qge21lc3NhZ2U6IGFjaHZzW2lkXS5tZXNzYWdlK1wiIGh0dHA6Ly92ay5jb20vYXBwNTE5Nzc5Ml8yMDI3ODY0NjFcIiwgYXR0YWNobWVudHM6IGFjaHZzW2lkXS5waG90b30sIC0+XHJcblx0XHRhY2h2X2lkID0gYWNodnNbaWRdLmFjaGlldmVtZW50X2lkXHJcblx0XHQkc2hhZGUudHJpZ2dlcignY2xpY2snKVxyXG5cdFx0cmVxdWVzdC5ldmVudC5zZXQge2V2ZW50X2lkOiBhY2h2X2lkfSwgKHJlcykgLT5cclxuXHRcdFx0Y29uc29sZS5sb2cgcmVzIiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoaW5mbykge1xuYnVmLnB1c2goXCI8ZGl2XCIgKyAoamFkZS5hdHRyKFwiZGF0YS1pZFwiLCBcIlwiICsgKGluZm8uaWQpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJhY2hpZXZlXFxcIj48ZGl2IGNsYXNzPVxcXCJhY2hpZXZlX19pY29uLXdyYXBwZXJcXFwiPjxpbWdcIiArIChqYWRlLmF0dHIoXCJzcmNcIiwgXCJcIiArIChpbmZvLmljb24pICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJhY2hpZXZlX19pY29uXFxcIi8+PC9kaXY+PGRpdiBjbGFzcz1cXFwiYWNoaWV2ZV9fdGl0bGVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGluZm8udGl0bGUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjxkaXYgY2xhc3M9XFxcImFjaGlldmVfX3RleHRcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGluZm8udGV4dCkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PGRpdiBjbGFzcz1cXFwiYWNoaWV2ZV9fYnV0LXdyYXBwZXJcXFwiPjxkaXYgY2xhc3M9XFxcImFjaGlldmVfX2J1dCBidXQganMtc2hhcmVBY2h2XFxcIj7Qn9C+0LTQtdC70LjRgtGM0YHRjzwvZGl2PjwvZGl2PjwvZGl2PlwiKTt9LmNhbGwodGhpcyxcImluZm9cIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmluZm86dHlwZW9mIGluZm8hPT1cInVuZGVmaW5lZFwiP2luZm86dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiY2hlY2twb2ludFRlbXBsYXRlID0gcmVxdWlyZSgnLi9jaGVja3BvaW50LmphZGUnKVxyXG5yZXF1ZXN0ID0gcmVxdWlyZSgnLi4vcmVxdWVzdCcpXHJcblxyXG5jb250YWluZXJfaWQgPSAwXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5vcGVuTW9kYWwgPSAoaWQsIG9iaikgLT5cclxuXHRjb250YWluZXJfaWQgPSBpZFxyXG5cdGNvbnNvbGUubG9nIG9ialxyXG5cdCQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tjb250YWluZXJfaWR9XVwiKS5maW5kKCcucG9wdXAnKS5hZGRDbGFzcygncG9wdXAtLWNoZWNrcG9pbnQnKVxyXG5cdCQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tjb250YWluZXJfaWR9XVwiKS5maW5kKCcucG9wdXBfX2ZvcmxvYWRpbmcnKS5odG1sIGNoZWNrcG9pbnRUZW1wbGF0ZSh7aW5mbzogb2JqfSlcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jbG9zZU1vZGFsID0gLT5cclxuXHQkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7Y29udGFpbmVyX2lkfV1cIikuZmluZCgnLnBvcHVwJykucmVtb3ZlQ2xhc3MoJ3BvcHVwLS1jaGVja3BvaW50JylcclxuXHJcblxyXG4iLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChpbmZvKSB7XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcImNocG9wdXBcXFwiPjxkaXZcIiArIChqYWRlLmF0dHIoXCJzdHlsZVwiLCBcImJhY2tncm91bmQtaW1hZ2U6IHVybCgnXCIgKyAoaW5mby5pbWFnZV9oaW50KSArIFwiJylcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJjaHBvcHVwX19oZWFkZXJcXFwiPjxkaXYgY2xhc3M9XFxcImNocG9wdXBfX3VyYVxcXCI+PHNwYW4gY2xhc3M9XFxcImNocG9wdXBfX3doaXRlYmFja1xcXCI+0KPRgNCwISDQotGLINC+0YLQutGA0YvQuzwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJjaHBvcHVwX190aXRsZVxcXCI+PHNwYW4gY2xhc3M9XFxcImNocG9wdXBfX3doaXRlYmFja1xcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gaW5mby50aXRsZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9XFxcImNocG9wdXBfX2Rlc2NcXFwiPjxzcGFuIGNsYXNzPVxcXCJjaHBvcHVwX193aGl0ZWJhY2tcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGluZm8uZGVzY3JpcHRpb24pID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJjaHBvcHVwX19tYWluXFxcIj48ZGl2IGNsYXNzPVxcXCJjaHBvcHVwX19uZXh0XFxcIj7QodC70LXQtNGD0Y7RidC40Lkg0L/Rg9C90LrRgjwvZGl2PjxkaXYgY2xhc3M9XFxcImNocG9wdXBfX2hpbnRcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGluZm8uaGludCkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PGRpdiBjbGFzcz1cXFwiY2hwb3B1cF9fYnV0IGJ1dCBidXQtLWxvdyBqcy1jbG9zZVBvcHVwXFxcIj7QmNGB0LrQsNGC0Yw8L2Rpdj48L2Rpdj48L2Rpdj5cIik7fS5jYWxsKHRoaXMsXCJpbmZvXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5pbmZvOnR5cGVvZiBpbmZvIT09XCJ1bmRlZmluZWRcIj9pbmZvOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsImdhbWVlbnRlclRlbXBsYXRlID0gcmVxdWlyZSgnLi9nYW1lZW50ZXIuamFkZScpXHJcbnJlcXVlc3QgPSByZXF1aXJlKCcuLi9yZXF1ZXN0JylcclxuXHJcbmNvbnRhaW5lcl9pZCA9IDBcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5vcGVuTW9kYWwgPSAoaWQsIG9iaikgLT5cclxuXHRjb250YWluZXJfaWQgPSBpZFxyXG5cdCQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tjb250YWluZXJfaWR9XVwiKS5maW5kKCcucG9wdXAnKS5hZGRDbGFzcygncG9wdXAtLWNoZWNrcG9pbnQnKVxyXG5cdCQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tjb250YWluZXJfaWR9XVwiKS5maW5kKCcucG9wdXBfX2ZvcmxvYWRpbmcnKS5odG1sIGdhbWVlbnRlclRlbXBsYXRlKHtpbmZvOiBvYmp9KVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNsb3NlTW9kYWwgPSAtPlxyXG5cdCQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tjb250YWluZXJfaWR9XVwiKS5maW5kKCcucG9wdXAnKS5yZW1vdmVDbGFzcygncG9wdXAtLWNoZWNrcG9pbnQnKVxyXG5cclxuXHJcbiIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGluZm8pIHtcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwiY2hwb3B1cFxcXCI+PGRpdlwiICsgKGphZGUuYXR0cihcInN0eWxlXCIsIFwiYmFja2dyb3VuZC1pbWFnZTogdXJsKCdcIiArIChpbmZvLmltYWdlX2hpbnQpICsgXCInKVwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImNocG9wdXBfX2hlYWRlclxcXCI+PGRpdiBjbGFzcz1cXFwiY2hwb3B1cF9fdGl0bGVcXFwiPjxzcGFuIGNsYXNzPVxcXCJjaHBvcHVwX193aGl0ZWJhY2tcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGluZm8udGl0bGUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJjaHBvcHVwX19kZXNjXFxcIj48c3BhbiBjbGFzcz1cXFwiY2hwb3B1cF9fd2hpdGViYWNrXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBpbmZvLmRlc2NyaXB0aW9uKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L3NwYW4+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwiY2hwb3B1cF9fbWFpblxcXCI+PGRpdiBjbGFzcz1cXFwiY2hwb3B1cF9fbmV4dFxcXCI+0KHQu9C10LTRg9GO0YnQuNC5INC/0YPQvdC60YI8L2Rpdj48ZGl2IGNsYXNzPVxcXCJjaHBvcHVwX19oaW50XFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBpbmZvLmhpbnQpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjxkaXYgY2xhc3M9XFxcImNocG9wdXBfX2J1dCBidXQgYnV0LS1sb3cganMtY2xvc2VQb3B1cFxcXCI+0JjRgdC60LDRgtGMPC9kaXY+PC9kaXY+PC9kaXY+XCIpO30uY2FsbCh0aGlzLFwiaW5mb1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguaW5mbzp0eXBlb2YgaW5mbyE9PVwidW5kZWZpbmVkXCI/aW5mbzp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJpbnRybyA9IHJlcXVpcmUoJy4vaW50cm8uY29mZmVlJylcclxuaW52aXRlID0gcmVxdWlyZSgnLi9pbnZpdGUuY29mZmVlJylcclxucmF0aW5nID0gcmVxdWlyZSgnLi9yYXRpbmcuY29mZmVlJylcclxudXNlcmluZm8gPSByZXF1aXJlKCcuL3VzZXJpbmZvLmNvZmZlZScpXHJcbmNoZWNrcG9pbnQgPSByZXF1aXJlKCcuL2NoZWNrcG9pbnQuY29mZmVlJylcclxuZ2FtZWVudGVyID0gcmVxdWlyZSgnLi9nYW1lZW50ZXIuY29mZmVlJylcclxubW9uZXkgPSByZXF1aXJlKCcuL21vbmV5LmNvZmZlZScpXHJcbm1lc3NlbmdlciA9IHJlcXVpcmUoJy4vbWVzc2VuZ2VyL21lc3Nlbmdlci5jb2ZmZWUnKVxyXG5hY2hpZXZlID0gcmVxdWlyZSgnLi9hY2hpZXZlLmNvZmZlZScpXHJcbm15cHJpemVzID0gcmVxdWlyZSgnLi9teXByaXplcy5jb2ZmZWUnKVxyXG5waXp6YSA9IHJlcXVpcmUoJy4vcGl6emEuY29mZmVlJylcclxubmV3dGFzdGUgPSByZXF1aXJlKCcuL25ld3Rhc3RlLmNvZmZlZScpXHJcblxyXG5cclxubWFpblRlbXBsYXRlID0gcmVxdWlyZSAnLi9pbmRleC5qYWRlJ1xyXG5cclxuY3VySUQgPSAwXHJcbnBhZ2VzID0gW11cclxuXHJcbm1vZHVsZS5leHBvcnRzLm9wZW5Nb2RhbCA9ICh0eXBlcywgb2JqPXt9LCBjYWxsYmFjaykgLT5cclxuIyQoJy5wb3B1cF9fc2hhZGUnKS5yZW1vdmVDbGFzcygncG9wdXBfX3NoYWRlLS1jbG9zZWQnKVxyXG5cdCQoJ2JvZHknKS5hZGRDbGFzcygnYm9keS0tbW9kYWwnKVxyXG5cdCQoJy5wb3B1cF9fc3VwZXJjb250YWluZXInKS5hcHBlbmQgbWFpblRlbXBsYXRlKHtjdXJJRDpjdXJJRH0pXHJcblxyXG5cclxuXHRpZiB0eXBlcyA9PSBcImludHJvXCJcclxuXHRcdGludHJvLm9wZW5Nb2RhbChjdXJJRClcclxuXHJcblx0aWYgdHlwZXMgPT0gXCJyYXRpbmdcIlxyXG5cdFx0cmF0aW5nLm9wZW5Nb2RhbChjdXJJRClcclxuXHJcblx0aWYgdHlwZXMgPT0gXCJpbnZpdGVcIlxyXG5cdFx0aW52aXRlLm9wZW5Nb2RhbChjdXJJRClcclxuXHJcblx0aWYgdHlwZXMgPT0gXCJ1c2VyaW5mb1wiXHJcblx0XHR1c2VyaW5mby5vcGVuTW9kYWwoY3VySUQsIG9iaiwgY2FsbGJhY2spXHJcblx0aWYgdHlwZXMgPT0gXCJhY2hpZXZlXCJcclxuXHRcdGFjaGlldmUub3Blbk1vZGFsKGN1cklELCBvYmopXHJcblxyXG5cdGlmIHR5cGVzID09IFwiY2hlY2twb2ludFwiXHJcblx0XHRjaGVja3BvaW50Lm9wZW5Nb2RhbChjdXJJRCwgb2JqKVxyXG5cclxuXHRpZiB0eXBlcyA9PSBcImdhbWVlbnRlclwiXHJcblx0XHRnYW1lZW50ZXIub3Blbk1vZGFsKGN1cklELCBvYmopXHJcblx0aWYgdHlwZXMgPT0gXCJtb25leVwiXHJcblx0XHRtb25leS5vcGVuTW9kYWwoY3VySUQsIG9iailcclxuXHRpZiB0eXBlcyA9PSBcIm15cHJpemVzXCJcclxuXHRcdG15cHJpemVzLm9wZW5Nb2RhbChjdXJJRCwgb2JqKVxyXG5cdGlmIHR5cGVzID09IFwicGl6emFcIlxyXG5cdFx0cGl6emEub3Blbk1vZGFsKGN1cklEKVxyXG5cclxuXHRpZiB0eXBlcyA9PSBcIm1lc3NlbmdlclwiXHJcblx0XHRtZXNzZW5nZXIub3Blbk1vZGFsKG9iailcclxuXHJcblx0aWYgdHlwZXMgPT0gXCJuZXd0YXN0ZVwiXHJcblx0XHRuZXd0YXN0ZS5vcGVuTW9kYWwoY3VySUQpXHJcblxyXG5cdHBhZ2VzW2N1cklEXSA9IHR5cGVzXHJcblx0Y3VySUQrK1xyXG5cclxuXHJcbmFkZENsb3NlTGlzdGVuZXIgPSAtPlxyXG5cdGNsb3NlTW9kYWwgPSAoaWQpIC0+XHJcblx0XHQjJCgnLnBvcHVwX19zaGFkZScpLmFkZENsYXNzKCdwb3B1cF9fc2hhZGUtLWNsb3NlZCcpXHJcblx0XHQkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2JvZHktLW1vZGFsJylcclxuXHRcdHBhZ2UgPSBwYWdlc1tpZF1cclxuXHRcdGlmIHBhZ2UgPT0gXCJpbnRyb1wiXHJcblx0XHRcdGludHJvLmNsb3NlTW9kYWwoKVxyXG5cdFx0aWYgcGFnZSA9PSBcInJhdGluZ1wiXHJcblx0XHRcdHJhdGluZy5jbG9zZU1vZGFsKClcclxuXHRcdGlmIHBhZ2UgPT0gXCJpbnZpdGVcIlxyXG5cdFx0XHRpbnZpdGUuY2xvc2VNb2RhbCgpXHJcblx0XHRpZiBwYWdlID09IFwidXNlcmluZm9cIlxyXG5cdFx0XHR1c2VyaW5mby5jbG9zZU1vZGFsKClcclxuXHRcdGlmIHBhZ2UgPT0gXCJjaGVja3BvaW50XCJcclxuXHRcdFx0Y2hlY2twb2ludC5jbG9zZU1vZGFsKClcclxuXHRcdGlmIHBhZ2UgPT0gXCJnYW1lZW50ZXJcIlxyXG5cdFx0XHRnYW1lZW50ZXIuY2xvc2VNb2RhbCgpXHJcblx0XHRpZiBwYWdlID09IFwibW9uZXlcIlxyXG5cdFx0XHRtb25leS5jbG9zZU1vZGFsKClcclxuXHRcdGlmIHBhZ2UgPT0gXCJtZXNzZW5nZXJcIlxyXG5cdFx0XHRtZXNzZW5nZXIuY2xvc2VNb2RhbCgpXHJcblx0XHRpZiBwYWdlID09IFwibXlwcml6ZXNcIlxyXG5cdFx0XHRteXByaXplcy5jbG9zZU1vZGFsKClcclxuXHRcdGlmIHBhZ2UgPT0gXCJwaXp6YVwiXHJcblx0XHRcdHBpenphLmNsb3NlTW9kYWwoKVxyXG5cdFx0aWYgcGFnZSA9PSBcImFjaGlldmVcIlxyXG5cdFx0XHRhY2hpZXZlLmNsb3NlTW9kYWwoaWQpXHJcblx0XHQkKCcucG9wdXBfX3N1cGVyY29udGFpbmVyIC5wb3B1cF9fc2hhZGVbZGF0YS1pZD1cIicraWQrJ1wiXScpLnJlbW92ZSgpXHJcblxyXG5cdG1vZHVsZS5leHBvcnRzLmNsb3NlTW9kYWwgPSBjbG9zZU1vZGFsXHJcblx0JCgnLnBvcHVwX19zdXBlcmNvbnRhaW5lcicpLm9uICdjbGljaycsICcucG9wdXBfX3NoYWRlJywgKGUpIC0+XHJcblx0XHRpZCA9ICQodGhpcykuYXR0cignZGF0YS1pZCcpXHJcblx0XHRjbG9zZU1vZGFsKGlkKSBpZiAkKGUudGFyZ2V0KS5oYXNDbGFzcygncG9wdXBfX3NoYWRlJylcclxuXHJcblx0JCgnLnBvcHVwX19zdXBlcmNvbnRhaW5lcicpLm9uICdjbGljaycsICcucG9wdXBfX2Nyb3NzJywgLT5cclxuXHRcdGlkID0gJCh0aGlzKS5jbG9zZXN0KCcucG9wdXBfX3NoYWRlJykuYXR0cignZGF0YS1pZCcpXHJcblx0XHRjbG9zZU1vZGFsKGlkKVxyXG5cclxuXHQkKCcucG9wdXBfX3N1cGVyY29udGFpbmVyJykub24gJ2NsaWNrJywgJy5qcy1jbG9zZVBvcHVwJywgLT5cclxuXHRcdGlkID0gJCh0aGlzKS5jbG9zZXN0KCcucG9wdXBfX3NoYWRlJykuYXR0cignZGF0YS1pZCcpXHJcblx0XHRjbG9zZU1vZGFsKGlkKVxyXG5cclxuYWRkQ2xvc2VMaXN0ZW5lcigpIiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoY3VySUQpIHtcbmJ1Zi5wdXNoKFwiPGRpdlwiICsgKGphZGUuYXR0cihcImRhdGEtaWRcIiwgXCJcIiArIChjdXJJRCkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgKGphZGUuYXR0cihcInN0eWxlXCIsIFwiei1pbmRleDpcIiArIChjdXJJRCsxMCkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcInBvcHVwX19zaGFkZVxcXCI+PGRpdiBjbGFzcz1cXFwicG9wdXBcXFwiPjxpIGNsYXNzPVxcXCJpY29uLXBvcHVwLWNyb3NzIHBvcHVwX19jcm9zc1xcXCI+PC9pPjxkaXYgY2xhc3M9XFxcInBvcHVwX19mb3Jsb2FkaW5nXFxcIj48L2Rpdj48L2Rpdj48L2Rpdj5cIik7fS5jYWxsKHRoaXMsXCJjdXJJRFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguY3VySUQ6dHlwZW9mIGN1cklEIT09XCJ1bmRlZmluZWRcIj9jdXJJRDp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJpbnRyb1RlbXBsYXRlID0gcmVxdWlyZSgnLi9pbnRyby5qYWRlJylcclxuXHJcbnZpZGVvU3JjID0gXCJcIlxyXG5jb250YWluZXJfaWQgPSAwXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5vcGVuTW9kYWwgPSAoaWQpIC0+XHJcblx0Y29udGFpbmVyX2lkID0gaWRcclxuXHQkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7Y29udGFpbmVyX2lkfV1cIikuZmluZCgnLnBvcHVwX19mb3Jsb2FkaW5nJykuaHRtbCBpbnRyb1RlbXBsYXRlKClcclxuXHR2aWRlb1NyYyA9ICQoJy5pbnRyb19fdmlkZW8nKS5hdHRyKCdzcmMnKVxyXG5cdCQoJy5pbnRyb19fdmlkZW8nKS5hdHRyKCdzcmMnLCB2aWRlb1NyYylcclxuXHJcbm1vZHVsZS5leHBvcnRzLmNsb3NlTW9kYWwgPSAtPlxyXG5cdCQoJy5pbnRyb19fdmlkZW8nKS5hdHRyKCdzcmMnLCBcIlwiKSIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcInBvcHVwX193cmFwLS1pbnRyb1xcXCI+PGlmcmFtZSBjbGFzcz1cXFwiaW50cm9fX3ZpZGVvXFxcIiB3aWR0aD1cXFwiNTg4XFxcIiBoZWlnaHQ9XFxcIjM2MFxcXCIgc3JjPVxcXCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC91dzA4ai15T2ZjRVxcXCIgZnJhbWVib3JkZXI9XFxcIjBcXFwiPjwvaWZyYW1lPjxkaXYgY2xhc3M9XFxcImludHJvX19za2lwdmlkZW9cXFwiPtCf0YDQvtC/0YPRgdGC0LjRgtGMPC9kaXY+PC9kaXY+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsImludml0ZVRlbXBsYXRlID0gcmVxdWlyZSgnLi9pbnZpdGUuamFkZScpXHJcblxyXG5jb250YWluZXJfaWQgPSAwXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5vcGVuTW9kYWwgPSAoaWQpIC0+XHJcblx0Y29udGFpbmVyX2lkID0gaWRcclxuXHQkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7Y29udGFpbmVyX2lkfV1cIikuZmluZCgnLnBvcHVwX19mb3Jsb2FkaW5nJykuaHRtbCBpbnZpdGVUZW1wbGF0ZSgpXHJcblx0JChcIi5pbnZpdGVfX2xpc3RcIikuY3VzdG9tU2Nyb2xsKClcclxuXHQkKCcuaW52aXRlX19pbnB1dCcpLm9uICdpbnB1dCcsIGlucHV0Q2hhbmdlSGFuZGxlclxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2xvc2VNb2RhbCA9IC0+XHJcblx0JCgnLmludHJvX192aWRlbycpLmF0dHIoJ3NyYycsIFwiXCIpXHJcblx0JCgnLmludml0ZV9faW5wdXQnKS5vZmYgJ2lucHV0JywgaW5wdXRDaGFuZ2VIYW5kbGVyXHJcblxyXG5pbnB1dENoYW5nZUhhbmRsZXIgPSAoZSkgLT5cclxuXHR2YWwgPSBlLnRhcmdldC52YWx1ZVxyXG5cdGZpbHRlckxpc3QodmFsKVxyXG5cclxuZmlsdGVyTGlzdCA9ICh2YWwpIC0+XHJcblx0dmFsID0gdmFsLnRvTG93ZXJDYXNlKClcclxuXHQkKCcuaW52aXRlX19lbCcpLmVhY2ggKGksIGVsKSAtPlxyXG5cdFx0bmFtZSA9ICQoZWwpLmZpbmQoJy5sZWFkZXJzX19uYW1lJykudGV4dCgpLnRvTG93ZXJDYXNlKClcclxuXHRcdGlmIG5hbWUuaW5kZXhPZih2YWwpICE9IC0xXHJcblx0XHRcdCQoZWwpLnJlbW92ZUNsYXNzKCdpbnZpdGVfX2VsLS1pbnZpcycpXHJcblx0XHRlbHNlXHJcblx0XHRcdCQoZWwpLmFkZENsYXNzKCdpbnZpdGVfX2VsLS1pbnZpcycpIiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwicG9wdXBfX3dyYXAtLWludml0ZVxcXCI+PGgzIGNsYXNzPVxcXCJpbnZpdGVfX3RpdGxlXFxcIj7QktGL0LHQtdGA0Lgg0LTRgNGD0LfQtdC5LDxicj7QutC+0YLQvtGA0YvRhSDRhdC+0YfQtdGI0Ywg0L/RgNC40LPQu9Cw0YHQuNGC0Yw8L2gzPjxkaXYgY2xhc3M9XFxcImludml0ZV9faW5wdXR3cmFwcGVyXFxcIj48aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcItCS0LLQtdC00Lgg0LjQvNGPXFxcIiBjbGFzcz1cXFwiaW52aXRlX19pbnB1dFxcXCIvPjwvZGl2PjxkaXYgY2xhc3M9XFxcImludml0ZV9fbGlzdFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fZWwgaW52aXRlX19lbCBpbnZpdGVfX2VsLS1pbnZpdGVkXFxcIj48aW1nIHNyYz1cXFwiaHR0cDovL3d3dy5zcGxldG5pay5ydS9pbWcvMjAxMS8wNC9hcmluYS8yMDExMDQwMS1yb2JlcnRkLWFub25zLmpwZ1xcXCIgY2xhc3M9XFxcImxlYWRlcnNfX3Bob3RvXFxcIi8+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fcmlnaHRcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX25hbWVcXFwiPtCS0Y/Rh9C10YHQu9Cw0LI8YnI+0JLRj9GH0LXRgdC70LDQstC+0LLQuNGHPC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fZWwgaW52aXRlX19lbFxcXCI+PGltZyBzcmM9XFxcImh0dHA6Ly93d3cuc3BsZXRuaWsucnUvaW1nLzIwMTEvMDQvYXJpbmEvMjAxMTA0MDEtcm9iZXJ0ZC1hbm9ucy5qcGdcXFwiIGNsYXNzPVxcXCJsZWFkZXJzX19waG90b1xcXCIvPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3JpZ2h0XFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19uYW1lXFxcIj7QktGP0YfQtdGB0LvQsNCyPGJyPtCS0Y/Rh9C10YHQu9Cw0LLQvtCy0LjRhzwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2VsIGludml0ZV9fZWxcXFwiPjxpbWcgc3JjPVxcXCJodHRwOi8vd3d3LnNwbGV0bmlrLnJ1L2ltZy8yMDExLzA0L2FyaW5hLzIwMTEwNDAxLXJvYmVydGQtYW5vbnMuanBnXFxcIiBjbGFzcz1cXFwibGVhZGVyc19fcGhvdG9cXFwiLz48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19yaWdodFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fbmFtZVxcXCI+0JLRj9GH0LXRgdC70LDQsjxicj7QktGP0YfQtdGB0LvQsNCy0L7QstC40Yc8L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19lbCBpbnZpdGVfX2VsIGludml0ZV9fZWwtLWludml0ZWRcXFwiPjxpbWcgc3JjPVxcXCJodHRwOi8vd3d3LnNwbGV0bmlrLnJ1L2ltZy8yMDExLzA0L2FyaW5hLzIwMTEwNDAxLXJvYmVydGQtYW5vbnMuanBnXFxcIiBjbGFzcz1cXFwibGVhZGVyc19fcGhvdG9cXFwiLz48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19yaWdodFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fbmFtZVxcXCI+0J3QuNC60L3QtdC50Lw8L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19lbCBpbnZpdGVfX2VsXFxcIj48aW1nIHNyYz1cXFwiaHR0cDovL3d3dy5zcGxldG5pay5ydS9pbWcvMjAxMS8wNC9hcmluYS8yMDExMDQwMS1yb2JlcnRkLWFub25zLmpwZ1xcXCIgY2xhc3M9XFxcImxlYWRlcnNfX3Bob3RvXFxcIi8+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fcmlnaHRcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX25hbWVcXFwiPtCd0LjQutC90LXQudC8PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fZWwgaW52aXRlX19lbCBpbnZpdGVfX2VsLS1pbnZpdGVkXFxcIj48aW1nIHNyYz1cXFwiaHR0cDovL3d3dy5zcGxldG5pay5ydS9pbWcvMjAxMS8wNC9hcmluYS8yMDExMDQwMS1yb2JlcnRkLWFub25zLmpwZ1xcXCIgY2xhc3M9XFxcImxlYWRlcnNfX3Bob3RvXFxcIi8+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fcmlnaHRcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX25hbWVcXFwiPtCd0LjQutC90LXQudC8PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fZWwgaW52aXRlX19lbFxcXCI+PGltZyBzcmM9XFxcImh0dHA6Ly93d3cuc3BsZXRuaWsucnUvaW1nLzIwMTEvMDQvYXJpbmEvMjAxMTA0MDEtcm9iZXJ0ZC1hbm9ucy5qcGdcXFwiIGNsYXNzPVxcXCJsZWFkZXJzX19waG90b1xcXCIvPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3JpZ2h0XFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19uYW1lXFxcIj7QndC40LrQvdC10LnQvDwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2VsIGludml0ZV9fZWxcXFwiPjxpbWcgc3JjPVxcXCJodHRwOi8vd3d3LnNwbGV0bmlrLnJ1L2ltZy8yMDExLzA0L2FyaW5hLzIwMTEwNDAxLXJvYmVydGQtYW5vbnMuanBnXFxcIiBjbGFzcz1cXFwibGVhZGVyc19fcGhvdG9cXFwiLz48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19yaWdodFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fbmFtZVxcXCI+0J3QuNC60L3QtdC50Lw8L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19lbCBpbnZpdGVfX2VsIGludml0ZV9fZWwtLWludml0ZWRcXFwiPjxpbWcgc3JjPVxcXCJodHRwOi8vd3d3LnNwbGV0bmlrLnJ1L2ltZy8yMDExLzA0L2FyaW5hLzIwMTEwNDAxLXJvYmVydGQtYW5vbnMuanBnXFxcIiBjbGFzcz1cXFwibGVhZGVyc19fcGhvdG9cXFwiLz48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19yaWdodFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fbmFtZVxcXCI+0J3QuNC60L3QtdC50Lw8L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19lbCBpbnZpdGVfX2VsXFxcIj48aW1nIHNyYz1cXFwiaHR0cDovL3d3dy5zcGxldG5pay5ydS9pbWcvMjAxMS8wNC9hcmluYS8yMDExMDQwMS1yb2JlcnRkLWFub25zLmpwZ1xcXCIgY2xhc3M9XFxcImxlYWRlcnNfX3Bob3RvXFxcIi8+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fcmlnaHRcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX25hbWVcXFwiPtCd0LjQutC+0LvQsNC5PGJyPtCd0LjQutC+0LvQsNC10LLQuNGHPC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fZWwgaW52aXRlX19lbCBpbnZpdGVfX2VsLS1pbnZpdGVkXFxcIj48aW1nIHNyYz1cXFwiaHR0cDovL3d3dy5zcGxldG5pay5ydS9pbWcvMjAxMS8wNC9hcmluYS8yMDExMDQwMS1yb2JlcnRkLWFub25zLmpwZ1xcXCIgY2xhc3M9XFxcImxlYWRlcnNfX3Bob3RvXFxcIi8+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fcmlnaHRcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX25hbWVcXFwiPtCd0LjQutC90LXQudC8PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fZWwgaW52aXRlX19lbFxcXCI+PGltZyBzcmM9XFxcImh0dHA6Ly93d3cuc3BsZXRuaWsucnUvaW1nLzIwMTEvMDQvYXJpbmEvMjAxMTA0MDEtcm9iZXJ0ZC1hbm9ucy5qcGdcXFwiIGNsYXNzPVxcXCJsZWFkZXJzX19waG90b1xcXCIvPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3JpZ2h0XFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19uYW1lXFxcIj7QndC40LrQvdC10LnQvDwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2VsIGludml0ZV9fZWxcXFwiPjxpbWcgc3JjPVxcXCJodHRwOi8vd3d3LnNwbGV0bmlrLnJ1L2ltZy8yMDExLzA0L2FyaW5hLzIwMTEwNDAxLXJvYmVydGQtYW5vbnMuanBnXFxcIiBjbGFzcz1cXFwibGVhZGVyc19fcGhvdG9cXFwiLz48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19yaWdodFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fbmFtZVxcXCI+0J3QuNC60L3QtdC50Lw8L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19lbCBpbnZpdGVfX2VsIGludml0ZV9fZWwtLWludml0ZWRcXFwiPjxpbWcgc3JjPVxcXCJodHRwOi8vd3d3LnNwbGV0bmlrLnJ1L2ltZy8yMDExLzA0L2FyaW5hLzIwMTEwNDAxLXJvYmVydGQtYW5vbnMuanBnXFxcIiBjbGFzcz1cXFwibGVhZGVyc19fcGhvdG9cXFwiLz48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19yaWdodFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fbmFtZVxcXCI+0J3QuNC60L3QtdC50Lw8L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19lbCBpbnZpdGVfX2VsXFxcIj48aW1nIHNyYz1cXFwiaHR0cDovL3d3dy5zcGxldG5pay5ydS9pbWcvMjAxMS8wNC9hcmluYS8yMDExMDQwMS1yb2JlcnRkLWFub25zLmpwZ1xcXCIgY2xhc3M9XFxcImxlYWRlcnNfX3Bob3RvXFxcIi8+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fcmlnaHRcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX25hbWVcXFwiPtCd0LjQutC90LXQudC8PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInRlbXBsYXRlID0gcmVxdWlyZSgnLi9tZXNzZW5nZXIuamFkZScpXHJcbnJlcXVlc3QgPSByZXF1aXJlKCcuLi8uLi9yZXF1ZXN0L2luZGV4JylcclxubWVzX2ljb24gPSByZXF1aXJlKCcuLi8uLi9oZWFkZXIvbWVzc2VuZ2VyX19pY29uLmphZGUnKVxyXG5cclxubm90aWZpY2F0aW9uVGVtcGxhdGUgPSByZXF1aXJlICcuL25vdGlmaWNhdGlvbi5qYWRlJ1xyXG5xdWVzdGlvblRlbXBsYXRlID0gcmVxdWlyZSAnLi9xdWVzdGlvbi5qYWRlJ1xyXG5kYXRhID0gW11cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5vcGVuTW9kYWwgPSAob2JqKSAtPlxyXG5cdCQoJy5wb3B1cCcpLmFkZENsYXNzKCdwb3B1cC0tbWVzc2VuZ2VyJylcclxuXHRyZXF1ZXN0LmZlZWRiYWNrLmdldCB7fSwgKHJlcykgLT5cclxuXHRcdGNvbnNvbGUubG9nIHJlc1xyXG5cdFx0ZGF0YSA9IGhhbmRsZVJlcyhyZXMpXHJcblx0XHQkKCcucG9wdXBfX2ZvcmxvYWRpbmcnKS5odG1sIHRlbXBsYXRlKHttZXNzYWdlczogZGF0YX0pXHJcblx0XHRvcGVuTWVzc2FnZSgwKSBpZiByZXMubGVuZ3RoPjBcclxuXHRcdCQoJy5tZXNzZW5nZXJfX3ZpcycpLmN1c3RvbVNjcm9sbCh7cHJlZml4OlwiY3VzdG9tLWJpZ3Njcm9sbF9cIn0pXHJcblx0XHQkKCcubWVzc2VuZ2VyX19lbCcpLm9uICdjbGljaycsIG1lc0NsaWNrTGlzdGVuZXJcclxuXHJcbm1vZHVsZS5leHBvcnRzLmNsb3NlTW9kYWwgPSAtPlxyXG5cdCQoJy5wb3B1cCcpLnJlbW92ZUNsYXNzKCdwb3B1cC0tbWVzc2VuZ2VyJylcclxuXHJcbm1lc0NsaWNrTGlzdGVuZXIgPSAtPlxyXG5cdCQoJy5tZXNzZW5nZXJfX2VsJykucmVtb3ZlQ2xhc3MoJ21lc3Nlbmdlcl9fZWwtLWFjdGl2ZScpXHJcblx0JCh0aGlzKS5hZGRDbGFzcygnbWVzc2VuZ2VyX19lbC0tYWN0aXZlJylcclxuXHRvcGVuTWVzc2FnZSArJCh0aGlzKS5hdHRyKCdkYXRhLWlkJylcclxuXHJcbmhhbmRsZVJlcyA9IChhcnIpIC0+XHJcblx0Zm9yIG1lcyBpbiBhcnJcclxuXHRcdG1lcy5ub3RpY2UgPSAhbWVzLnF1ZXN0aW9uXHJcblx0XHRkID0gbW9tZW50KG1lcy5hbnN3ZXJlZF9hdCoxMDAwKVxyXG5cdFx0bWVzLmRhdGUgPSBkLmZvcm1hdCgnREQuTU0uWVlZWScpXHJcblx0cmV0dXJuIGFyci5yZXZlcnNlKClcclxuXHJcbm9wZW5NZXNzYWdlID0gKGluZGV4KSAtPlxyXG5cdG1lc3NhZ2UgPSBkYXRhW2luZGV4XVxyXG5cdGlmIG1lc3NhZ2Uubm90aWNlXHJcblx0XHQkKCcubWVzc2VuZ2VyX19tZXMtdGV4dCcpLmh0bWwgbm90aWZpY2F0aW9uVGVtcGxhdGUoe2luZm86bWVzc2FnZX0pXHJcblx0ZWxzZVxyXG5cdFx0JCgnLm1lc3Nlbmdlcl9fbWVzLXRleHQnKS5odG1sIHF1ZXN0aW9uVGVtcGxhdGUoe2luZm86bWVzc2FnZX0pXHJcblx0JCgnLm1lc3Nlbmdlcl9fbWVzLWNvbnRhaW5lcicpLmN1c3RvbVNjcm9sbCh7cHJlZml4OlwiY3VzdG9tLWJpZ3Njcm9sbF9cIn0pXHJcblx0aWYgZGF0YVtpbmRleF0ucmVhZCA9PSAwXHJcblx0XHRyZXF1ZXN0LmZlZWRiYWNrLnJlYWQge2lkOiBkYXRhW2luZGV4XS5pZH0sIChyZXMpIC0+XHJcblx0XHRcdGlmIHJlcy5yZXN1bHQgPSBcInN1Y2Nlc3NcIlxyXG5cdFx0XHRcdCQoJy5tZXNzZW5nZXJfX2ljb24tZm9ybG9hZGluZycpLmh0bWwgbWVzX2ljb24oe3VucmVhZHM6cGFyc2VJbnQoJCgnLm1lc3Nlbmdlcl9fdW5yZWFkcy12YWwnKS5odG1sKCkpLTF9KVxyXG5cclxuIiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAobWVzc2FnZXMsIHVuZGVmaW5lZCkge1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJcXFwiPjxoMiBjbGFzcz1cXFwibWVzc2VuZ2VyX190aXRsZVxcXCI+0JzQvtC4INGB0L7QvtCx0YnQtdC90LjRjzwvaDI+PGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX19sZWZ0XFxcIj48aDMgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fc3VidGl0bGVcXFwiPtCh0L/QuNGB0L7QuiDRgdC+0L7QsdGJ0LXQvdC40Lk8L2gzPjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fdmlzXFxcIj48ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJfX2xpc3RcXFwiPlwiKTtcbi8vIGl0ZXJhdGUgbWVzc2FnZXNcbjsoZnVuY3Rpb24oKXtcbiAgdmFyICQkb2JqID0gbWVzc2FnZXM7XG4gIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgJCRvYmoubGVuZ3RoKSB7XG5cbiAgICBmb3IgKHZhciBpbmRleCA9IDAsICQkbCA9ICQkb2JqLmxlbmd0aDsgaW5kZXggPCAkJGw7IGluZGV4KyspIHtcbiAgICAgIHZhciBtZXMgPSAkJG9ialtpbmRleF07XG5cbmJ1Zi5wdXNoKFwiPGRpdlwiICsgKGphZGUuYXR0cihcImRhdGEtaWRcIiwgXCJcIiArIChpbmRleCkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgKGphZGUuY2xzKFsnbWVzc2VuZ2VyX19lbCcsaW5kZXg9PTAgPyBcIm1lc3Nlbmdlcl9fZWwtLWFjdGl2ZVwiIDogXCJcIl0sIFtudWxsLHRydWVdKSkgKyBcIj48ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJfX2VsLWhlYWRlclxcXCI+XCIpO1xuaWYgKCBtZXMubm90aWNlKVxue1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJfX2VsLXR5cGVcXFwiPtCj0LLQtdC00L7QvNC70LXQvdC40LU8L2Rpdj5cIik7XG59XG5lbHNlXG57XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fZWwtdHlwZVxcXCI+0J7RgtCy0LXRgiDQvdCwINCy0L7Qv9GA0L7RgTwvZGl2PlwiKTtcbn1cbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX19lbC1kYXRlXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBtZXMuZGF0ZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX19lbC10aXRsZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gbWVzLnRpdGxlKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj5cIik7XG4gICAgfVxuXG4gIH0gZWxzZSB7XG4gICAgdmFyICQkbCA9IDA7XG4gICAgZm9yICh2YXIgaW5kZXggaW4gJCRvYmopIHtcbiAgICAgICQkbCsrOyAgICAgIHZhciBtZXMgPSAkJG9ialtpbmRleF07XG5cbmJ1Zi5wdXNoKFwiPGRpdlwiICsgKGphZGUuYXR0cihcImRhdGEtaWRcIiwgXCJcIiArIChpbmRleCkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgKGphZGUuY2xzKFsnbWVzc2VuZ2VyX19lbCcsaW5kZXg9PTAgPyBcIm1lc3Nlbmdlcl9fZWwtLWFjdGl2ZVwiIDogXCJcIl0sIFtudWxsLHRydWVdKSkgKyBcIj48ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJfX2VsLWhlYWRlclxcXCI+XCIpO1xuaWYgKCBtZXMubm90aWNlKVxue1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJfX2VsLXR5cGVcXFwiPtCj0LLQtdC00L7QvNC70LXQvdC40LU8L2Rpdj5cIik7XG59XG5lbHNlXG57XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fZWwtdHlwZVxcXCI+0J7RgtCy0LXRgiDQvdCwINCy0L7Qv9GA0L7RgTwvZGl2PlwiKTtcbn1cbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX19lbC1kYXRlXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBtZXMuZGF0ZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX19lbC10aXRsZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gbWVzLnRpdGxlKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj5cIik7XG4gICAgfVxuXG4gIH1cbn0pLmNhbGwodGhpcyk7XG5cbmJ1Zi5wdXNoKFwiPC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX19yaWdodFxcXCI+PGgzIGNsYXNzPVxcXCJtZXNzZW5nZXJfX3N1YnRpdGxlXFxcIj7QodC+0L7QsdGJ0LXQvdC40LU8L2gzPjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fbWVzLXBsYW5rXFxcIj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJfX21lcy1jb250YWluZXJcXFwiPjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fbWVzLXRleHRcXFwiPjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PlwiKTt9LmNhbGwodGhpcyxcIm1lc3NhZ2VzXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5tZXNzYWdlczp0eXBlb2YgbWVzc2FnZXMhPT1cInVuZGVmaW5lZFwiP21lc3NhZ2VzOnVuZGVmaW5lZCxcInVuZGVmaW5lZFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudW5kZWZpbmVkOnR5cGVvZiB1bmRlZmluZWQhPT1cInVuZGVmaW5lZFwiP3VuZGVmaW5lZDp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChpbmZvKSB7XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fbWVzLXZhbFxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gaW5mby5hbnN3ZXIpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PlwiKTt9LmNhbGwodGhpcyxcImluZm9cIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmluZm86dHlwZW9mIGluZm8hPT1cInVuZGVmaW5lZFwiP2luZm86dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoaW5mbykge1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJfX21lcy10aXRsZVxcXCI+0JLQvtC/0YDQvtGBOjwvZGl2PjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fbWVzLXZhbFxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gaW5mby5xdWVzdGlvbikgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX19tZXMtdGl0bGVcXFwiPtCe0YLQstC10YI6PC9kaXY+PGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX19tZXMtdmFsXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBpbmZvLmFuc3dlcikgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+XCIpO30uY2FsbCh0aGlzLFwiaW5mb1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguaW5mbzp0eXBlb2YgaW5mbyE9PVwidW5kZWZpbmVkXCI/aW5mbzp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJva1RlbXBsYXRlID0gcmVxdWlyZSgnLi9tb25leV9vay5qYWRlJylcclxuZmFpbFRlbXBsYXRlID0gcmVxdWlyZSgnLi9tb25leV9mYWlsLmphZGUnKVxyXG5yZXF1ZXN0ID0gcmVxdWlyZSgnLi4vcmVxdWVzdCcpXHJcblxyXG5jb250YWluZXJfaWQgPSAwXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5vcGVuTW9kYWwgPSAoaWQsIG9iaikgLT5cclxuXHRjb250YWluZXJfaWQgPSBpZFxyXG5cdGNvbnNvbGUubG9nIG9ialxyXG5cdCQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tjb250YWluZXJfaWR9XVwiKS5maW5kKCcucG9wdXAnKS5hZGRDbGFzcygncG9wdXAtLW1lcycpXHJcblx0aWYgb2JqLnJlcyA9PSBcIm9rXCJcclxuXHRcdCQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tjb250YWluZXJfaWR9XVwiKS5maW5kKCcucG9wdXBfX2ZvcmxvYWRpbmcnKS5odG1sIG9rVGVtcGxhdGUoe30pXHJcblx0aWYgb2JqLnJlcyA9PSBcImZhaWxcIlxyXG5cdFx0JChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2NvbnRhaW5lcl9pZH1dXCIpLmZpbmQoJy5wb3B1cF9fZm9ybG9hZGluZycpLmh0bWwgZmFpbFRlbXBsYXRlKHt9KVxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2xvc2VNb2RhbCA9IC0+XHJcblx0JChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2NvbnRhaW5lcl9pZH1dXCIpLmZpbmQoJy5wb3B1cCcpLnJlbW92ZUNsYXNzKCdwb3B1cC0tbWVzJylcclxuXHJcblxyXG4iLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJwb3B1cF9fd3JhcC0taW50cm9cXFwiPjxkaXYgY2xhc3M9XFxcImNocG9wdXBfX21vbmV5bWVzXFxcIj48cD7QotGLINCx0YvQuyDQvtGH0LXQvdGMINCx0LvQuNC30L7QuiDQuiDRjdGC0L7QvNGDINC/0YDQuNC30YMsINC90L4g0LrRgtC+LdGC0L4g0L7QutCw0LfQsNC70YHRjyDQvdCwINC00L7Qu9GOINGB0LXQutGD0L3QtNGLINCx0YvRgdGC0YDQtdC1ICg8L3A+PHA+0J3QtSDQvtGC0YfQsNC40LLQsNC50YHRjyEg0JfQsNCy0YLRgNCwINC80Ysg0YDQsNC30YvQs9GA0LDQtdC8INC10YnQtSA1MDAg0YDRg9Cx0LvQtdC5LCDQv9C+0YLQvtC8INC10YnQtSDQuCDQtdGJ0LUg4oCTINC4INGC0LDQuiDQutCw0LbQtNGL0Lkg0LTQtdC90Ywg0LHQtdC3INCy0YvRhdC+0LTQvdGL0YUuINCi0LXQsdC1INC90LDQstC10YDQvdGP0LrQsCDQv9C+0LLQtdC30LXRgiEg0KHQv9Cw0YHQuNCx0L4sINC40LPRgNCw0Lkg0YEg0L3QsNC80Lgg0LXRidC1ITwvcD48L2Rpdj48L2Rpdj5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwicG9wdXBfX3dyYXAtLWludHJvXFxcIj48ZGl2IGNsYXNzPVxcXCJjaHBvcHVwX19tb25leW1lc1xcXCI+PHA+0J/QvtC30LTRgNCw0LLQu9GP0LXQvCwg0YLRiyDQv9C10YDQstGL0Lwg0L3QsNGI0LXQuyDRgdC10LPQvtC00L3Rj9GI0L3QuNC1INC/0YDQuNC30L7QstGL0LUg0LTQtdC90YzQs9C4INC90LAg0YLQtdC70LXRhNC+0L0hINCa0YDQsNGB0LDQstGH0LjQuiE8L3A+PHA+0JXRgdC70Lgg0YLQstC+0Y8g0LDQvdC60LXRgtCwINC30LDQv9C+0LvQvdC10L3QsCDigJMg0LTQtdC90YzQs9C4INGB0LrQvtGA0L4g0YPQv9Cw0LTRg9GCINC90LAg0YHRh9C10YIg0YLQstC+0LXQs9C+INC80L7QsdC40LvRjNC90L7Qs9C+LiDQldGB0LvQuCDQvdC10YIg4oCTINC30LDQv9C+0LvQvdC4INC10LUsINC90LUg0L7RgtC60LvQsNC00YvQstCw0Y8uINCh0L/QsNGB0LjQsdC+LCDQuNCz0YDQsNC5INGBINC90LDQvNC4INC10YnQtSE8L3A+PC9kaXY+PC9kaXY+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInRlbXBsYXRlID0gcmVxdWlyZSgnLi9teXByaXplcy5qYWRlJylcclxucmVxdWVzdCA9IHJlcXVpcmUgJy4uL3JlcXVlc3QnXHJcbmNvbnRhaW5lcl9pZCA9IDBcclxuXHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzLm9wZW5Nb2RhbCA9IChpZCwgb3B0cykgLT5cclxuXHRjb250YWluZXJfaWQgPSBpZFxyXG5cdCQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tjb250YWluZXJfaWR9XVwiKS5maW5kKCcucG9wdXAnKS5hZGRDbGFzcygncG9wdXAtLW15cHJpemVzJylcclxuXHJcblx0cmVxdWVzdC5wcml6ZS5nZXQge30sIChyZXMpIC0+XHJcblx0XHRjb25zb2xlLmxvZyByZXNcclxuXHRcdGZvciBrZXksZWwgb2YgcmVzXHJcblx0XHRcdGVsLmZvcm1hdHRlZF9kYXRlID0gbW9tZW50KGVsLmRhdGUqMTAwMCkuZm9ybWF0KFwiREQuTU0uWVlZWVwiKVxyXG5cdFx0JChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2NvbnRhaW5lcl9pZH1dXCIpLmZpbmQoJy5wb3B1cF9fZm9ybG9hZGluZycpLmh0bWwgdGVtcGxhdGUoe2luZm86cmVzfSlcclxuXHRcdCQoXCIubXlwcml6ZXNfX2xpc3RcIikuY3VzdG9tU2Nyb2xsKHtwcmVmaXg6IFwiY3VzdG9tLWJpZ3Njcm9sbF9cIn0pXHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNsb3NlTW9kYWwgPSAoaWQpIC0+XHJcblx0JChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2NvbnRhaW5lcl9pZH1dXCIpLmZpbmQoJy5wb3B1cCcpLnJlbW92ZUNsYXNzKCdwb3B1cC0tbXlwcml6ZXMnKVxyXG4iLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChpbmZvKSB7XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcIm15cHJpemVzXFxcIj48aDMgY2xhc3M9XFxcIm15cHJpemVzX190aXRsZVxcXCI+0J/QvtC70YPRh9C10L3QvdGL0LUg0L/RgNC40LfRizwvaDM+XCIpO1xuaWYgKCAhaW5mb1swXSAmJiAhaW5mb1sxXSAmJiAhaW5mb1syXSlcbntcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibXlwcml6ZXNfX25vbGlzdFxcXCI+PGRpdiBjbGFzcz1cXFwibXlwcml6ZXNfX25vLXN1YnRpdGxlXFxcIj7QoyDRgtC10LHRjyDQv9C+0LrQsDxicj7QvdC10YIg0L/RgNC40LfQvtCyIDooPC9kaXY+PGRpdiBjbGFzcz1cXFwibXlwcml6ZXNfX25vLXRleHRcXFwiPtCf0YDQvtGF0L7QtNC4INC60LLQtdGB0YLRiywg0YHQvtCx0LjRgNCw0Lkg0LrQsNC6INC80L7QttC90L48YnI+XFxu0LHQvtC70YzRiNC1INC60YDQtdC60LXRgNC+0LIgVFVDIOKAkyDQuCDQtNC10LvQuNGB0Yw8YnI+XFxu0YHQstC+0LjQvNC4INC00L7RgdGC0LjQttC10L3QuNGP0LzQuCDRgSDQtNGA0YPQt9GM0Y/QvNC4ITxicj5cXG7QotCw0Log0YLRiyDQv9C+0LLRi9GB0LjRiNGMINGB0LLQvtC4INGI0LDQvdGB0Ysg0L3QsCDQv9GA0LjQty48L2Rpdj48L2Rpdj5cIik7XG59XG5lbHNlXG57XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcIm15cHJpemVzX19saXN0XFxcIj5cIik7XG5pZiAoIGluZm9bMF0pXG57XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcIm15cHJpemVzX19kYXRlXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBpbmZvWzBdLmZvcm1hdHRlZF9kYXRlKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48ZGl2IGNsYXNzPVxcXCJteXByaXplc19faWNvbi13cmFwcGVyXFxcIj48aSBjbGFzcz1cXFwiaWNvbi1teXByaXplcy1tb25leSBteXByaXplc19fbW9uZXlwcml6ZVxcXCI+PC9pPjwvZGl2PlwiKTtcbn1cbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibXlwcml6ZXNfX3N1YnRpdGxlXFxcIj7Ql9CwINC60LLQtdGB0YLRizwvZGl2PlwiKTtcbmlmICggIWluZm9bMV0gJiYgIWluZm9bMl0pXG57XG5idWYucHVzaChcIjxkaXY+0JfQtNC10YHRjCDQv9C+0LrQsCDQvdC40YfQtdCz0L4g0L3QtdGCID0oPC9kaXY+XCIpO1xufVxuaWYgKCBpbmZvWzFdKVxue1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJteXByaXplc19fZGF0ZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gaW5mb1sxXS5mb3JtYXR0ZWRfZGF0ZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PGRpdiBjbGFzcz1cXFwibXlwcml6ZXNfX3F1ZXN0bmFtZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gaW5mb1sxXS50aXRsZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PGRpdiBjbGFzcz1cXFwibXlwcml6ZXNfX2ljb24td3JhcHBlclxcXCI+PGkgY2xhc3M9XFxcImljb24tcHJpemVzMSBteXByaXplc19fc3VwZXJwcml6ZVxcXCI+PC9pPjwvZGl2PjxkaXYgY2xhc3M9XFxcIm15cHJpemVzX19wcml6ZW5hbWVcXFwiPtCh0LDQvNC+0LrQsNGCIE94ZWxvIFRvd248L2Rpdj5cIik7XG59XG5pZiAoIGluZm9bMl0pXG57XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcIm15cHJpemVzX19kYXRlXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBpbmZvWzJdLmZvcm1hdHRlZF9kYXRlKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48ZGl2IGNsYXNzPVxcXCJteXByaXplc19faWNvbi13cmFwcGVyXFxcIj5cIik7XG5pZiAoIGluZm9bMl0ucGxhY2U9PTEpXG57XG5idWYucHVzaChcIjxpIGNsYXNzPVxcXCJpY29uLXByaXplczMgbXlwcml6ZXNfX3N1cGVycHJpemVcXFwiPjwvaT5cIik7XG59XG5pZiAoIGluZm9bMl0ucGxhY2U9PTIpXG57XG5idWYucHVzaChcIjxpIGNsYXNzPVxcXCJpY29uLXByaXplczQgbXlwcml6ZXNfX3N1cGVycHJpemVcXFwiPjwvaT5cIik7XG59XG5pZiAoIGluZm9bMl0ucGxhY2U9PTMpXG57XG5idWYucHVzaChcIjxpIGNsYXNzPVxcXCJpY29uLXByaXplczUgbXlwcml6ZXNfX3N1cGVycHJpemVcXFwiPjwvaT5cIik7XG59XG5idWYucHVzaChcIjwvZGl2PlwiKTtcbmlmICggaW5mb1syXS5wbGFjZT09MSlcbntcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibXlwcml6ZXNfX3ByaXplbmFtZVxcXCI+0K3Qu9C10LrRgtGA0L7RgdCw0LzQvtC60LDRgiBSYXpvciBFMzAwPC9kaXY+XCIpO1xufVxuaWYgKCBpbmZvWzJdLnBsYWNlPT0yKVxue1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJteXByaXplc19fcHJpemVuYW1lXFxcIj7QmtCy0LDQtNGA0L7QutC+0L/RgtC10YAgUGFycm90IEFSLkRyb25lIDIuMDwvZGl2PlwiKTtcbn1cbmlmICggaW5mb1syXS5wbGFjZT09MylcbntcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibXlwcml6ZXNfX3ByaXplbmFtZVxcXCI+0J/QvtGA0YLQsNGC0LjQstC90LDRjyDQutC+0LvQvtC90LrQsCBKQkwgUHVsc2U8L2Rpdj5cIik7XG59XG59XG5idWYucHVzaChcIjwvZGl2PlwiKTtcbn1cbmJ1Zi5wdXNoKFwiPC9kaXY+XCIpO30uY2FsbCh0aGlzLFwiaW5mb1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguaW5mbzp0eXBlb2YgaW5mbyE9PVwidW5kZWZpbmVkXCI/aW5mbzp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJuZXd0YXN0ZVRlbXBsYXRlID0gcmVxdWlyZSgnLi9uZXd0YXN0ZS5qYWRlJylcclxucmVxdWVzdCA9IHJlcXVpcmUoJy4uL3JlcXVlc3QnKVxyXG5wb3B1cHMgPSByZXF1aXJlICcuL2luZGV4LmNvZmZlZSdcclxuXHJcbm1vZHVsZS5leHBvcnRzLm9wZW5Nb2RhbCA9IChpZCkgLT5cclxuICBjb250YWluZXJfaWQgPSBpZFxyXG4gICQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tpZH1dXCIpXHJcbiAgJChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2lkfV1cIikuZmluZCgnLnBvcHVwX19mb3Jsb2FkaW5nJykuaHRtbChuZXd0YXN0ZVRlbXBsYXRlKVxyXG4gICQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tpZH1dXCIpLmZpbmQoJy5wb3B1cCcpLmFkZENsYXNzKCdwb3B1cF9fdGFzdGUnKVxyXG5cclxuIiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwidGFzdGVfX3dyYXBcXFwiPjxoMiBjbGFzcz1cXFwidGFzdGVfX3RpdGxlXFxcIj7QmNC80LXQvdC90L4hPC9oMj48ZGl2IGNsYXNzPVxcXCJ0YXN0ZV9fYm9keVxcXCI+PGRpdiBjbGFzcz1cXFwidGFzdGVfX2JvZHktdGV4dFxcXCI+PHA+0J3QsNGH0LjRgdC70Y/QtdC8INGC0LXQsdC1IDIwMCDQsdCw0LvQu9C+0LIuPC9wPjxwPtCd0LUg0LfQsNCx0YPQtNGMINC/0L7Qv9GA0L7QsdC+0LLQsNGC0Yw8L3A+PFA+0J3QvtCy0YvQuSBUdWMhPC9QPjwvZGl2PjxkaXYgY2xhc3M9XFxcInRhc3RlX19ib2R5LWltZ1xcXCI+PGltZyBzcmM9XFxcImltZy9pbWFnZXMvdHVjLTIwMC5wbmdcXFwiLz48L2Rpdj48L2Rpdj48L2Rpdj5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwicGl6emFUZW1wbGF0ZSA9IHJlcXVpcmUoJy4vcGl6emEuamFkZScpXHJcbnJlcXVlc3QgPSByZXF1aXJlKCcuLi9yZXF1ZXN0JylcclxuXHJcbmNvbnRhaW5lcl9pZCA9IDBcclxuXHJcbm1vZHVsZS5leHBvcnRzLm9wZW5Nb2RhbCA9IChpZCwgb2JqKSAtPlxyXG5cdGNvbnRhaW5lcl9pZCA9IGlkXHJcblx0Y29uc29sZS5sb2cgb2JqXHJcblx0JChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2NvbnRhaW5lcl9pZH1dXCIpLmZpbmQoJy5wb3B1cCcpLmFkZENsYXNzKCdwb3B1cC0tcGl6emEnKVxyXG5cdCQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tjb250YWluZXJfaWR9XVwiKS5maW5kKCcucG9wdXBfX2ZvcmxvYWRpbmcnKS5odG1sIHBpenphVGVtcGxhdGUoe2luZm86IG9ian0pXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2xvc2VNb2RhbCA9IC0+XHJcblx0JChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2NvbnRhaW5lcl9pZH1dXCIpLmZpbmQoJy5wb3B1cCcpLnJlbW92ZUNsYXNzKCdwb3B1cC0tcGl6emEnKVxyXG5cclxuXHJcbiIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcImNocG9wdXBcXFwiPjxkaXYgY2xhc3M9XFxcImNocG9wdXBfX3BpenphLXRpdGxlXFxcIj4rNTAg0LHQsNC70LvQvtCyITwvZGl2PjxkaXYgY2xhc3M9XFxcImNocG9wdXBfX3BpenphLWRlc2NcXFwiPtCf0L7Qt9C00YDQsNCy0LvRj9C10LwsINGC0Ysg0L3QsNGI0LXQuyDQvdC+0LLRi9C5IFRVQyDQn9C40YbRhtCwIVxcbtCQINGC0LXQv9C10YDRjCDQv9C+0L/RgNC+0LHRg9C5INC90LDQudGC0Lgg0LXQs9C+INC/0L4t0L3QsNGB0YLQvtGP0YnQtdC80YMg0LIg0LzQsNCz0LDQt9C40L3QsNGFINGB0LLQvtC10LPQviDQs9C+0YDQvtC00LAhPC9kaXY+PGRpdiBjbGFzcz1cXFwiY2hwb3B1cF9fcGl6emEtZGVzYzJcXFwiPtCj0LTQsNGH0Lgg0Lgg0L/RgNC40Y/RgtC90L7Qs9C+INCw0L/Qv9C10YLQuNGC0LAhPC9kaXY+PC9kaXY+XCIpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGhvc3QsIGxlYWRlcnMsIHVuZGVmaW5lZCkge1xuLy8gaXRlcmF0ZSBsZWFkZXJzXG47KGZ1bmN0aW9uKCl7XG4gIHZhciAkJG9iaiA9IGxlYWRlcnM7XG4gIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgJCRvYmoubGVuZ3RoKSB7XG5cbiAgICBmb3IgKHZhciBpbmRleCA9IDAsICQkbCA9ICQkb2JqLmxlbmd0aDsgaW5kZXggPCAkJGw7IGluZGV4KyspIHtcbiAgICAgIHZhciBsZWFkZXIgPSAkJG9ialtpbmRleF07XG5cbmJ1Zi5wdXNoKFwiPGFcIiArIChqYWRlLmF0dHIoXCJocmVmXCIsIFwiXCIgKyAoaG9zdCtsZWFkZXIubGluaykgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2VsXFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19jb3VudGVyXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBsZWFkZXIucGxhY2UpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjxpbWdcIiArIChqYWRlLmF0dHIoXCJzcmNcIiwgXCJcIiArIChsZWFkZXIucGhvdG8pICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJsZWFkZXJzX19waG90b1xcXCIvPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3JpZ2h0XFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19uYW1lXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBsZWFkZXIubmlja25hbWUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjwvZGl2PjwvZGl2PjwvYT5cIik7XG4gICAgfVxuXG4gIH0gZWxzZSB7XG4gICAgdmFyICQkbCA9IDA7XG4gICAgZm9yICh2YXIgaW5kZXggaW4gJCRvYmopIHtcbiAgICAgICQkbCsrOyAgICAgIHZhciBsZWFkZXIgPSAkJG9ialtpbmRleF07XG5cbmJ1Zi5wdXNoKFwiPGFcIiArIChqYWRlLmF0dHIoXCJocmVmXCIsIFwiXCIgKyAoaG9zdCtsZWFkZXIubGluaykgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgdGFyZ2V0PVxcXCJfYmxhbmtcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2VsXFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19jb3VudGVyXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBsZWFkZXIucGxhY2UpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjxpbWdcIiArIChqYWRlLmF0dHIoXCJzcmNcIiwgXCJcIiArIChsZWFkZXIucGhvdG8pICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJsZWFkZXJzX19waG90b1xcXCIvPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3JpZ2h0XFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19uYW1lXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBsZWFkZXIubmlja25hbWUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjwvZGl2PjwvZGl2PjwvYT5cIik7XG4gICAgfVxuXG4gIH1cbn0pLmNhbGwodGhpcyk7XG59LmNhbGwodGhpcyxcImhvc3RcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmhvc3Q6dHlwZW9mIGhvc3QhPT1cInVuZGVmaW5lZFwiP2hvc3Q6dW5kZWZpbmVkLFwibGVhZGVyc1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgubGVhZGVyczp0eXBlb2YgbGVhZGVycyE9PVwidW5kZWZpbmVkXCI/bGVhZGVyczp1bmRlZmluZWQsXCJ1bmRlZmluZWRcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnVuZGVmaW5lZDp0eXBlb2YgdW5kZWZpbmVkIT09XCJ1bmRlZmluZWRcIj91bmRlZmluZWQ6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoYWN0aXZlLCBsZWZ0X2FjdGl2ZSwgcGFnZXMsIHJpZ2h0X2FjdGl2ZSwgdW5kZWZpbmVkKSB7XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcInBhZ2luYXRpb25cXFwiPjxzcGFuXCIgKyAoamFkZS5jbHMoWydwYWdpbmF0aW9uX19sZWZ0YnV0JyxsZWZ0X2FjdGl2ZSA/IFwicGFnaW5hdGlvbl9fYnV0LS1hY3RpdmVcIiA6IFwiXCJdLCBbbnVsbCx0cnVlXSkpICsgXCI+PDwvc3Bhbj5cIik7XG4vLyBpdGVyYXRlIHBhZ2VzXG47KGZ1bmN0aW9uKCl7XG4gIHZhciAkJG9iaiA9IHBhZ2VzO1xuICBpZiAoJ251bWJlcicgPT0gdHlwZW9mICQkb2JqLmxlbmd0aCkge1xuXG4gICAgZm9yICh2YXIgJGluZGV4ID0gMCwgJCRsID0gJCRvYmoubGVuZ3RoOyAkaW5kZXggPCAkJGw7ICRpbmRleCsrKSB7XG4gICAgICB2YXIgcGFnZSA9ICQkb2JqWyRpbmRleF07XG5cbmlmICggcGFnZT09XCJkb3RzXCIpXG57XG5idWYucHVzaChcIjxzcGFuIGNsYXNzPVxcXCJwYWdpbmF0aW9uX19kb3RzXFxcIj4uLi48L3NwYW4+XCIpO1xufVxuZWxzZVxue1xuYnVmLnB1c2goXCI8c3BhblwiICsgKGphZGUuYXR0cihcImRhdGEtaHJlZlwiLCBcIlwiICsgKHBhZ2UudmFsdWUpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIChqYWRlLmNscyhbJ3BhZ2luYXRpb25fX3BhZ2UnLChhY3RpdmU9PXBhZ2UudmFsdWUpID8gXCJwYWdpbmF0aW9uX19wYWdlLS1hY3RpdmVcIiA6IFwiXCJdLCBbbnVsbCx0cnVlXSkpICsgXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gcGFnZS50ZXh0KSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L3NwYW4+XCIpO1xufVxuICAgIH1cblxuICB9IGVsc2Uge1xuICAgIHZhciAkJGwgPSAwO1xuICAgIGZvciAodmFyICRpbmRleCBpbiAkJG9iaikge1xuICAgICAgJCRsKys7ICAgICAgdmFyIHBhZ2UgPSAkJG9ialskaW5kZXhdO1xuXG5pZiAoIHBhZ2U9PVwiZG90c1wiKVxue1xuYnVmLnB1c2goXCI8c3BhbiBjbGFzcz1cXFwicGFnaW5hdGlvbl9fZG90c1xcXCI+Li4uPC9zcGFuPlwiKTtcbn1cbmVsc2VcbntcbmJ1Zi5wdXNoKFwiPHNwYW5cIiArIChqYWRlLmF0dHIoXCJkYXRhLWhyZWZcIiwgXCJcIiArIChwYWdlLnZhbHVlKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyAoamFkZS5jbHMoWydwYWdpbmF0aW9uX19wYWdlJywoYWN0aXZlPT1wYWdlLnZhbHVlKSA/IFwicGFnaW5hdGlvbl9fcGFnZS0tYWN0aXZlXCIgOiBcIlwiXSwgW251bGwsdHJ1ZV0pKSArIFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IHBhZ2UudGV4dCkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9zcGFuPlwiKTtcbn1cbiAgICB9XG5cbiAgfVxufSkuY2FsbCh0aGlzKTtcblxuYnVmLnB1c2goXCI8c3BhblwiICsgKGphZGUuY2xzKFsncGFnaW5hdGlvbl9fcmlnaHRidXQnLHJpZ2h0X2FjdGl2ZSA/IFwicGFnaW5hdGlvbl9fYnV0LS1hY3RpdmVcIiA6IFwiXCJdLCBbbnVsbCx0cnVlXSkpICsgXCI+Pjwvc3Bhbj48L2Rpdj5cIik7fS5jYWxsKHRoaXMsXCJhY3RpdmVcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmFjdGl2ZTp0eXBlb2YgYWN0aXZlIT09XCJ1bmRlZmluZWRcIj9hY3RpdmU6dW5kZWZpbmVkLFwibGVmdF9hY3RpdmVcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmxlZnRfYWN0aXZlOnR5cGVvZiBsZWZ0X2FjdGl2ZSE9PVwidW5kZWZpbmVkXCI/bGVmdF9hY3RpdmU6dW5kZWZpbmVkLFwicGFnZXNcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnBhZ2VzOnR5cGVvZiBwYWdlcyE9PVwidW5kZWZpbmVkXCI/cGFnZXM6dW5kZWZpbmVkLFwicmlnaHRfYWN0aXZlXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5yaWdodF9hY3RpdmU6dHlwZW9mIHJpZ2h0X2FjdGl2ZSE9PVwidW5kZWZpbmVkXCI/cmlnaHRfYWN0aXZlOnVuZGVmaW5lZCxcInVuZGVmaW5lZFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudW5kZWZpbmVkOnR5cGVvZiB1bmRlZmluZWQhPT1cInVuZGVmaW5lZFwiP3VuZGVmaW5lZDp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJsZWFkZXJzVGVtcGxhdGUgPSByZXF1aXJlKCcuL3JhdGluZy5qYWRlJylcclxubGlzdFRlbXBsYXRlID0gcmVxdWlyZSAnLi9yYXRpbmctbGlzdC5qYWRlJ1xyXG5wYWdUZW1wbGF0ZSA9IHJlcXVpcmUgJy4vcmF0aW5nLXBhZ2luYXRpb24uamFkZSdcclxuY29udGFpbmVyX2lkID0gMFxyXG5yZXF1ZXN0ID0gcmVxdWlyZSAnLi4vcmVxdWVzdCdcclxuXHJcblBBR0VfRUxTID0gNTBcclxuaG9zdCA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCtcIi8vdmsuY29tL2lkXCJcclxuY29tbW9uX3BhZ2UgPSAwXHJcbmN1cnJlbnRfcGFnZSA9IDBcclxuY3VydHlwZSA9IFwiY29tbW9uXCJcclxuXHJcbm1vZHVsZS5leHBvcnRzLm9wZW5Nb2RhbCA9IChpZCkgLT5cclxuXHRjb250YWluZXJfaWQgPSBpZFxyXG5cdHJlcXVlc3QucmF0aW5nLmFsbCB7b2Zmc2V0OiAwLCBjb3VudDogUEFHRV9FTFN9LCAocmVzKSAtPlxyXG5cdFx0Y29uc29sZS5sb2cgcmVzXHJcblxyXG5cdFx0JChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2NvbnRhaW5lcl9pZH1dXCIpLmZpbmQoJy5wb3B1cF9fZm9ybG9hZGluZycpLmh0bWwgbGVhZGVyc1RlbXBsYXRlKHtyZXM6cmVzLCBob3N0Omhvc3R9KVxyXG5cdFx0c3dpdGNoTGlzdGVuZXJzKClcclxuXHRcdCQoJy5wb3BsZWFkZXJzX19jb21tb24gLnBvcGxlYWRlcnNfX2NhdCcpLmh0bWwgbGlzdFRlbXBsYXRlKHtsZWFkZXJzOiByZXMuY29tbW9uLmxlYWRlcnMsIGhvc3Q6aG9zdH0pXHJcblx0XHQkKCcucG9wbGVhZGVyc19fY3VycmVudCAucG9wbGVhZGVyc19fY2F0JykuaHRtbCBsaXN0VGVtcGxhdGUoe2xlYWRlcnM6IHJlcy5jdXJyZW50LmxlYWRlcnMsIGhvc3Q6aG9zdH0pXHJcblx0XHRoYW5kbGVQYWdlcyhcImNvbW1vblwiLCByZXMuY29tbW9uKVxyXG5cdFx0aGFuZGxlUGFnZXMoXCJjdXJyZW50XCIsIHJlcy5jdXJyZW50KVxyXG5cclxuXHJcblx0XHQkKFwiLnBvcGxlYWRlcnNfX2NvbW1vbiAucG9wbGVhZGVyc19fbGlzdFwiKS5jdXN0b21TY3JvbGwoKVxyXG5cdFx0JChcIi5wb3BsZWFkZXJzX19jdXJyZW50IC5wb3BsZWFkZXJzX19saXN0XCIpLmN1c3RvbVNjcm9sbCgpXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jbG9zZU1vZGFsID0gLT5cclxuXHJcbmhhbmRsZVBhZ2VzID0gKHR5cGUsIG9iaiwgYWN0aXZlKSAtPlxyXG5cdHBhZ2VzID0gW11cclxuXHRhY3RpdmUgPSBwYXJzZUludChhY3RpdmUpIHx8IDBcclxuXHRwYWdlc19udW0gPSBNYXRoLmNlaWwob2JqLmNvdW50L1BBR0VfRUxTKVxyXG5cdGxlZnRfYWN0aXZlID0gcmlnaHRfYWN0aXZlID0gdHJ1ZVxyXG5cdGlmIGFjdGl2ZT09MCB0aGVuIGxlZnRfYWN0aXZlID0gZmFsc2VcclxuXHRpZiBhY3RpdmU9PXBhZ2VzX251bS0xIHRoZW4gcmlnaHRfYWN0aXZlID0gZmFsc2VcclxuXHJcblxyXG5cdGlmKG9iai5jb3VudDw9UEFHRV9FTFMpXHJcblx0XHRwYWdlcyA9IFt7IHRleHQ6IDEsIHZhbHVlOiAwfV1cclxuXHRcdGFjdGl2ZSA9IDBcclxuXHJcblx0ZWxzZSBpZihQQUdFX0VMUzxvYmouY291bnQ8PVBBR0VfRUxTKjQpXHJcblx0XHRwYWdlcyA9IFt7dmFsdWU6aSwgdGV4dDppKzF9IGZvciBpIGluIFswLi4ucGFnZXNfbnVtXV1bMF1cclxuXHRlbHNlXHJcblx0XHRpZiBhY3RpdmU8PTFcclxuXHRcdFx0Zm9yIGkgaW4gWzAuLi4zXVxyXG5cdFx0XHRcdHBhZ2VzLnB1c2gge3ZhbHVlOmksIHRleHQ6IGkrMX1cclxuXHRcdFx0aWYgcGFnZXNfbnVtPjMrMSB0aGVuIHBhZ2VzLnB1c2goXCJkb3RzXCIpXHJcblx0XHRcdHBhZ2VzLnB1c2goe3ZhbHVlOnBhZ2VzX251bS0xLCB0ZXh0OiBwYWdlc19udW19KVxyXG5cdFx0ZWxzZSBpZiBhY3RpdmU8cGFnZXNfbnVtLTJcclxuXHRcdFx0cGFnZXMucHVzaCB7IHRleHQ6IDEsIHZhbHVlOiAwfVxyXG5cdFx0XHRpZiBhY3RpdmU+PTMgdGhlbiBwYWdlcy5wdXNoKFwiZG90c1wiKVxyXG5cdFx0XHRmb3IgaSBpbiBbYWN0aXZlLTEsIGFjdGl2ZSwgYWN0aXZlKzFdXHJcblx0XHRcdFx0cGFnZXMucHVzaCB7dmFsdWU6aSwgdGV4dDogaSsxfVxyXG5cdFx0XHRpZiBhY3RpdmU8PXBhZ2VzX251bS00IHRoZW4gcGFnZXMucHVzaChcImRvdHNcIilcclxuXHRcdFx0cGFnZXMucHVzaCh7dmFsdWU6cGFnZXNfbnVtLTEsIHRleHQ6IHBhZ2VzX251bX0pXHJcblx0XHRlbHNlXHJcblx0XHRcdHBhZ2VzLnB1c2ggeyB0ZXh0OiAxLCB2YWx1ZTogMH1cclxuXHRcdFx0aWYgYWN0aXZlPj0zIHRoZW4gcGFnZXMucHVzaChcImRvdHNcIilcclxuXHRcdFx0Zm9yIGkgaW4gW3BhZ2VzX251bS0zLi5wYWdlc19udW0tMV1cclxuXHRcdFx0XHRwYWdlcy5wdXNoIHt2YWx1ZTppLCB0ZXh0OiBpKzF9XHJcblxyXG5cdCQoJy5wb3BsZWFkZXJzX19jb21tb24gLnBvcGxlYWRlcnNfX3BhZ2luYXRpb24nKS5odG1sIHBhZ1RlbXBsYXRlKHtwYWdlczogcGFnZXMsIGFjdGl2ZTphY3RpdmUsIGxlZnRfYWN0aXZlOiBsZWZ0X2FjdGl2ZSwgcmlnaHRfYWN0aXZlOiByaWdodF9hY3RpdmV9KSBpZiB0eXBlPT1cImNvbW1vblwiXHJcblx0JCgnLnBvcGxlYWRlcnNfX2N1cnJlbnQgLnBvcGxlYWRlcnNfX3BhZ2luYXRpb24nKS5odG1sIHBhZ1RlbXBsYXRlKHtwYWdlczogcGFnZXMsIGFjdGl2ZTphY3RpdmUsIGxlZnRfYWN0aXZlOiBsZWZ0X2FjdGl2ZSwgcmlnaHRfYWN0aXZlOiByaWdodF9hY3RpdmV9KSBpZiB0eXBlPT1cImN1cnJlbnRcIlxyXG5cclxuc3dpdGNoTGlzdGVuZXJzID0gLT5cclxuXHQkKCcubGVhZGVyc19fc3dpdGNoY29tbW9uJykub24gJ2NsaWNrJywgLT5cclxuXHRcdCQoJy5sZWFkZXJzX19zd2l0Y2hjb21tb24nKS5hZGRDbGFzcygnbGVhZGVyc19fc3dpdGNoYnV0LS1hY3RpdmUnKVxyXG5cdFx0JCgnLmxlYWRlcnNfX3N3aXRjaGN1cnJlbnQnKS5yZW1vdmVDbGFzcygnbGVhZGVyc19fc3dpdGNoYnV0LS1hY3RpdmUnKVxyXG5cdFx0JCgnLnBvcGxlYWRlcnNfX2NvbW1vbicpLmFkZENsYXNzKCdwb3BsZWFkZXJfX2FjdGl2ZScpXHJcblx0XHQkKCcucG9wbGVhZGVyc19fY3VycmVudCcpLnJlbW92ZUNsYXNzKCdwb3BsZWFkZXJfX2FjdGl2ZScpXHJcblx0XHRjdXJ0eXBlID0gXCJjb21tb25cIlxyXG5cdCQoJy5sZWFkZXJzX19zd2l0Y2hjdXJyZW50Jykub24gJ2NsaWNrJywgLT5cclxuXHRcdCQoJy5sZWFkZXJzX19zd2l0Y2hjdXJyZW50JykuYWRkQ2xhc3MoJ2xlYWRlcnNfX3N3aXRjaGJ1dC0tYWN0aXZlJylcclxuXHRcdCQoJy5sZWFkZXJzX19zd2l0Y2hjb21tb24nKS5yZW1vdmVDbGFzcygnbGVhZGVyc19fc3dpdGNoYnV0LS1hY3RpdmUnKVxyXG5cdFx0JCgnLnBvcGxlYWRlcnNfX2N1cnJlbnQnKS5hZGRDbGFzcygncG9wbGVhZGVyX19hY3RpdmUnKVxyXG5cdFx0JCgnLnBvcGxlYWRlcnNfX2NvbW1vbicpLnJlbW92ZUNsYXNzKCdwb3BsZWFkZXJfX2FjdGl2ZScpXHJcblx0XHRjdXJ0eXBlID0gXCJjdXJyZW50XCJcclxuXHQkKCcucG9wbGVhZGVyc19fdGFiJykub24gJ2NsaWNrJywgJy5wYWdpbmF0aW9uX19sZWZ0YnV0JywgLT5cclxuXHRcdHVubGVzcyAkKHRoaXMpLmhhc0NsYXNzKCdwYWdpbmF0aW9uX19idXQtLWFjdGl2ZScpIHRoZW4gcmV0dXJuXHJcblx0XHRjb25zb2xlLmxvZyAnbGVmdCdcclxuXHRcdGlmIGN1cnR5cGU9PVwiY29tbW9uXCIgdGhlbiBzd2l0Y2hQYWdlKGN1cnR5cGUsIGdldENvbW1vblBhZ2UoKS0xKVxyXG5cdFx0aWYgY3VydHlwZT09XCJjdXJyZW50XCIgdGhlbiBzd2l0Y2hQYWdlKGN1cnR5cGUsIGdldEN1cnJlbnRQYWdlKCktMSlcclxuXHJcblx0JCgnLnBvcGxlYWRlcnNfX3RhYicpLm9uICdjbGljaycsICcucGFnaW5hdGlvbl9fcmlnaHRidXQnLCAtPlxyXG5cdFx0dW5sZXNzICQodGhpcykuaGFzQ2xhc3MoJ3BhZ2luYXRpb25fX2J1dC0tYWN0aXZlJykgdGhlbiByZXR1cm5cclxuXHRcdGlmIGN1cnR5cGU9PVwiY29tbW9uXCIgdGhlbiBzd2l0Y2hQYWdlKGN1cnR5cGUsIGdldENvbW1vblBhZ2UoKSsxKVxyXG5cdFx0aWYgY3VydHlwZT09XCJjdXJyZW50XCIgdGhlbiBzd2l0Y2hQYWdlKGN1cnR5cGUsIGdldEN1cnJlbnRQYWdlKCkrMSlcclxuXHJcblx0JCgnLnBvcGxlYWRlcnMnKS5vbiAnY2xpY2snLCAnLnBhZ2luYXRpb25fX3BhZ2UnLCAtPlxyXG5cdFx0cmV0dXJuIGlmICQodGhpcykuaGFzQ2xhc3MoJ3BhZ2luYXRpb25fX3BhZ2UtLWFjdGl2ZScpXHJcblx0XHR0eXBlID0gJCh0aGlzKS5jbG9zZXN0KCcucG9wbGVhZGVyc19fdGFiJykuYXR0cignZGF0YS10eXBlJylcclxuXHRcdHZhbCA9ICQodGhpcykuYXR0cignZGF0YS1ocmVmJylcclxuXHRcdHN3aXRjaFBhZ2UodHlwZSwgdmFsKVxyXG5cclxuZ2V0Q3VycmVudFBhZ2UgPSAtPiByZXR1cm4gY3VycmVudF9wYWdlXHJcbmdldENvbW1vblBhZ2UgPSAtPiByZXR1cm4gY29tbW9uX3BhZ2VcclxuXHJcbnN3aXRjaFBhZ2UgPSAodHlwZSwgdmFsKSAtPlxyXG5cdHJlcXVlc3QucmF0aW5nW3R5cGVdIHtjb3VudDogUEFHRV9FTFMsIG9mZnNldDogdmFsKlBBR0VfRUxTfSwgKHJlcyktPlxyXG5cdFx0aGFuZGxlUGFnZXModHlwZSwgcmVzLCB2YWwpXHJcblx0XHRpZiB0eXBlPT1cImNvbW1vblwiXHJcblx0XHRcdCQoJy5wb3BsZWFkZXJzX19jb21tb24gLnBvcGxlYWRlcnNfX2NhdCcpLmh0bWwgbGlzdFRlbXBsYXRlKHtsZWFkZXJzOiByZXMubGVhZGVycywgaG9zdDpob3N0fSlcclxuXHRcdFx0JCgnLnBvcGxlYWRlcnNfX2NvbW1vbiAuY3VzdG9tLXNjcm9sbF9pbm5lcicpLnNjcm9sbFRvcCgwKVxyXG5cdFx0XHRjb21tb25fcGFnZSA9IHBhcnNlSW50IHZhbFxyXG5cdFx0aWYgdHlwZT09XCJjdXJyZW50XCJcclxuXHRcdFx0JCgnLnBvcGxlYWRlcnNfX2N1cnJlbnQgLnBvcGxlYWRlcnNfX2NhdCcpLmh0bWwgbGlzdFRlbXBsYXRlKHtsZWFkZXJzOiByZXMubGVhZGVycywgaG9zdDpob3N0fSlcclxuXHRcdFx0JCgnLnBvcGxlYWRlcnNfX2N1cnJlbnQgLmN1c3RvbS1zY3JvbGxfaW5uZXInKS5zY3JvbGxUb3AoMClcclxuXHRcdFx0Y3VycmVudF9wYWdlID0gcGFyc2VJbnQgdmFsXHJcbiIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKHJlcykge1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJwb3B1cF9fd3JhcC0taW50cm9cXFwiPjxkaXYgY2xhc3M9XFxcInBvcGxlYWRlcnNcXFwiPjxkaXYgY2xhc3M9XFxcInBvcGxlYWRlcnNfX2xlZnRcXFwiPjxoMyBjbGFzcz1cXFwicG9wbGVhZGVyc19fdGl0bGVcXFwiPtCg0LXQudGC0LjQvdCzINC40LPRgNGLPC9oMz48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19zd2l0Y2hlcl93cmFwcGVyXFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19zd2l0Y2hlclxcXCI+PGRpdiBkYXRhLWhyZWY9XFxcIi5wb3BsZWFkZXJzX19jYXQtLWN1cnJlbnRcXFwiIGNsYXNzPVxcXCJsZWFkZXJzX19zd2l0Y2hidXQgbGVhZGVyc19fc3dpdGNoY3VycmVudFxcXCI+0KLQtdC60YPRidC40Lk8L2Rpdj48ZGl2IGRhdGEtaHJlZj1cXFwiLnBvcGxlYWRlcnNfX2NhdC0tY29tbW9uXFxcIiBjbGFzcz1cXFwibGVhZGVyc19fc3dpdGNoYnV0IGxlYWRlcnNfX3N3aXRjaGJ1dC0tYWN0aXZlIGxlYWRlcnNfX3N3aXRjaGNvbW1vblxcXCI+0J7QsdGJ0LjQuTwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcInBvcGxlYWRlcnNfX3JpZ2h0XFxcIj48ZGl2IGRhdGEtdHlwZT1cXFwiY29tbW9uXFxcIiBjbGFzcz1cXFwicG9wbGVhZGVyc19fY29tbW9uIHBvcGxlYWRlcnNfX3RhYiBwb3BsZWFkZXJfX2FjdGl2ZVxcXCI+PGRpdiBjbGFzcz1cXFwicG9wbGVhZGVyc19fbGlzdFxcXCI+PGRpdiBjbGFzcz1cXFwicG9wbGVhZGVyc19fY2F0XFxcIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19lbFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fY291bnRlclxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gcmVzLmNvbW1vbi55b3UucGxhY2UpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjxpbWdcIiArIChqYWRlLmF0dHIoXCJzcmNcIiwgXCJcIiArIChyZXMuY29tbW9uLnlvdS5waG90bykgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImxlYWRlcnNfX3Bob3RvXFxcIi8+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fcmlnaHRcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX25hbWVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IHJlcy5jb21tb24ueW91Lm5pY2tuYW1lKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJwb3BsZWFkZXJzX19wYWdpbmF0aW9uXFxcIj48L2Rpdj48L2Rpdj48ZGl2IGRhdGEtdHlwZT1cXFwiY3VycmVudFxcXCIgY2xhc3M9XFxcInBvcGxlYWRlcnNfX2N1cnJlbnQgcG9wbGVhZGVyc19fdGFiXFxcIj48ZGl2IGNsYXNzPVxcXCJwb3BsZWFkZXJzX19saXN0XFxcIj48ZGl2IGNsYXNzPVxcXCJwb3BsZWFkZXJzX19jYXRcXFwiPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2VsXFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19jb3VudGVyXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSByZXMuY3VycmVudC55b3UucGxhY2UpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjxpbWdcIiArIChqYWRlLmF0dHIoXCJzcmNcIiwgXCJcIiArIChyZXMuY3VycmVudC55b3UucGhvdG8pICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJsZWFkZXJzX19waG90b1xcXCIvPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3JpZ2h0XFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19uYW1lXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSByZXMuY3VycmVudC55b3Uubmlja25hbWUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcInBvcGxlYWRlcnNfX3BhZ2luYXRpb25cXFwiPjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PlwiKTt9LmNhbGwodGhpcyxcInJlc1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgucmVzOnR5cGVvZiByZXMhPT1cInVuZGVmaW5lZFwiP3Jlczp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ1c2VyaW5mb1RlbXBsYXRlID0gcmVxdWlyZSgnLi91c2VyaW5mby5qYWRlJylcclxucmVxdWVzdCA9IHJlcXVpcmUoJy4uL3JlcXVlc3QnKVxyXG5wb3B1cHMgPSByZXF1aXJlICcuL2luZGV4LmNvZmZlZSdcclxuXHJcbmVkaXRpbmcgPSB0cnVlXHJcbm5vZnVsbCA9IGZhbHNlXHJcbmNhbGxiYWNrID0gbnVsbFxyXG5jb250YWluZXJfaWQgPSAwXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5vcGVuTW9kYWwgPSAoaWQsIG9iaj17fSwgX2NhbGxiYWNrKSAtPlxyXG5cdGVkaXRpbmcgPSB0cnVlXHJcblx0Y2FsbGJhY2sgPSBfY2FsbGJhY2tcclxuXHRjb250YWluZXJfaWQgPSBpZFxyXG5cdCQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tpZH1dXCIpLmZpbmQoJy5wb3B1cCcpLmFkZENsYXNzKCdwb3B1cC0tdXNlcmluZm8nKVxyXG5cclxuXHJcblx0cmVxdWVzdC51c2VyLmdldCB7fSwgKHJlcykgLT5cclxuXHRcdG5vZnVsbCA9IG9iai5ub2Z1bGxcclxuXHRcdGdldFVzZXJYSFJIYW5kbGVyKHJlcylcclxuXHJcblx0XHQkKCcudXNlcmluZm9fX2Zvcm0nKS5vbiBcInN1Ym1pdFwiLCBmb3JtT3BlbkhhbmRsZXJcclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2xvc2VNb2RhbCA9IC0+XHJcblx0JChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2NvbnRhaW5lcl9pZH1dXCIpLmZpbmQoJy5wb3B1cCcpLnJlbW92ZUNsYXNzKCdwb3B1cC0tdXNlcmluZm8nKVxyXG5cdCQoJy51c2VyaW5mb19fZm9ybScpLm9mZiBcInN1Ym1pdFwiLCBmb3JtT3BlbkhhbmRsZXJcclxuXHJcblxyXG5nZXRVc2VyWEhSSGFuZGxlciA9IChyZXMpIC0+XHJcblx0JChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2NvbnRhaW5lcl9pZH1dXCIpLmZpbmQoJy5wb3B1cF9fZm9ybG9hZGluZycpLmh0bWwgdXNlcmluZm9UZW1wbGF0ZSh7dXNlcjpyZXNbMF0sIG5vZnVsbDpub2Z1bGx9KVxyXG5cdCQoJy51c2VyaW5mb19fZXJyb3ItbWVzJykuYWRkQ2xhc3MoJ3VzZXJpbmZvX19lcnJvci1tZXMtLWludmlzJylcclxuXHQkKCcudXNlcmluZm9fX2lucHV0W25hbWU9XCJiZGF0ZVwiXScpLm1hc2sgJzA5LjA5LjAwMDAnLCB0cmFuc2xhdGlvbjoge1xyXG5cdFx0JzknOiB7cGF0dGVybjogL1xcZC8sIG9wdGlvbmFsOiB0cnVlfVxyXG5cdH1cclxuXHQkKCcudXNlcmluZm9fX2lucHV0W25hbWU9XCJwaG9uZVwiXScpLm1hc2soJys3IDAwMCAwMDAgMDAwMCcpXHJcblxyXG5cclxuZm9ybU9wZW5IYW5kbGVyID0gKGUpIC0+XHJcblx0ZS5wcmV2ZW50RGVmYXVsdCgpIGlmIGU/XHJcblx0ZWRpdGluZyA9ICFlZGl0aW5nXHJcblx0aWYgZWRpdGluZ1xyXG5cdFx0JCgnLnVzZXJpbmZvX19pbnB1dCcpLmVhY2ggKGksZWwpIC0+XHJcblx0XHRcdHRleHQgPSAkKGVsKS5wYXJlbnQoKS5maW5kKFwiLnVzZXJpbmZvX192YWx1ZVwiKS50ZXh0KClcclxuXHRcdFx0JChlbCkudmFsKHRleHQpXHJcblx0XHQkKCcudXNlcmluZm8nKS5hZGRDbGFzcygndXNlcmluZm8tLWVkaXRpbmcnKVxyXG5cdFx0JCgnLnVzZXJpbmZvX19jaGVja2JveCcpLnJlbW92ZUF0dHIoXCJkaXNhYmxlZFwiKVxyXG5cdGVsc2VcclxuXHRcdCQoJy51c2VyaW5mb19fdmFsdWUnKS5lYWNoIChpLGVsKSAtPlxyXG5cdFx0XHR0ZXh0ID0gJChlbCkucGFyZW50KCkuZmluZChcIi51c2VyaW5mb19faW5wdXRcIikudmFsKClcclxuXHRcdFx0JChlbCkudGV4dCh0ZXh0KVxyXG5cdFx0JCgnLnVzZXJpbmZvJykucmVtb3ZlQ2xhc3MoJ3VzZXJpbmZvLS1lZGl0aW5nJylcclxuXHRcdCQoJy51c2VyaW5mb19fY2hlY2tib3gnKS5hdHRyKFwiZGlzYWJsZWRcIiwgdHJ1ZSlcclxuXHRcdHNhdmVVc2VyKHRoaXMpXHJcblxyXG5zYXZlVXNlciA9IChmb3JtKSAtPlxyXG5cdHNlckFyciA9ICQoZm9ybSkuc2VyaWFsaXplQXJyYXkoKVxyXG5cdHNlbmRPYmogPSB7fVxyXG5cdGZvciBwcm9wIGluIHNlckFyclxyXG5cdFx0c2VuZE9ialtwcm9wLm5hbWVdID0gcHJvcC52YWx1ZVxyXG5cdHNlbmRPYmouYWdyZWVtZW50ID0gJCgnI2VtYWlsLWNoZWNrYm94JylbMF0uY2hlY2tlZFxyXG5cdHJlcXVlc3QudXNlci5zYXZlIHNlbmRPYmosIChyZXMpIC0+XHJcblx0XHRjb25zb2xlLmxvZyByZXNcclxuXHRcdGlmIHJlcy5yZXN1bHQgPT0gXCJzdWNjZXNzXCJcclxuXHRcdFx0JCgnLnVzZXJpbmZvX19lcnJvci1tZXMnKS5hZGRDbGFzcygndXNlcmluZm9fX2Vycm9yLW1lcy0taW52aXMnKVxyXG5cdFx0XHRjaGVja0Z1bGwoKSBpZiBub2Z1bGxcclxuXHRcdGlmIHJlcy5yZXN1bHQgPT0gXCJlcnJvclwiXHJcblx0XHRcdGlmIHJlcy5jb2RlID09IFwiNjY2XCJcclxuXHRcdFx0XHQkKCcudXNlcmluZm9fX2Vycm9yLW1lcycpLnJlbW92ZUNsYXNzKCd1c2VyaW5mb19fZXJyb3ItbWVzLS1pbnZpcycpXHJcblx0XHRcdFx0Zm9ybU9wZW5IYW5kbGVyKClcclxuXHJcblxyXG5cclxuY2hlY2tGdWxsID0gLT5cclxuXHRyZXF1ZXN0LnVzZXIuaXNGdWxsIHt9LCAocmVzKSAtPlxyXG5cdFx0Y29uc29sZS5sb2cgcmVzXHJcblx0XHRpZiByZXMucmVzdWx0PT1cInN1Y2Nlc3NcIlxyXG5cdFx0XHRub2Z1bGwgPSBmYWxzZVxyXG5cdFx0XHRjYWxsYmFjaygpIGlmIGNhbGxiYWNrP1xyXG5cdFx0XHRwb3B1cHMuY2xvc2VNb2RhbCgpIiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAobm9mdWxsLCB1c2VyKSB7XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcInVzZXJpbmZvIHVzZXJpbmZvLS1lZGl0aW5nXFxcIj48aDMgY2xhc3M9XFxcInVzZXJpbmZvX190aXRsZVxcXCI+0JvQuNGH0L3Ri9C1INC00LDQvdC90YvQtTwvaDM+XCIpO1xuaWYgKCBub2Z1bGwpXG57XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcInVzZXJpbmZvX193YXJuaW5nXFxcIj7QktGLINC90LUg0LzQvtC20LXRgtC1INC90LDRh9Cw0YLRjCDQutCy0LXRgdGCLCDQv9C+0LrQsCDQvdC1INC30LDQv9C+0LvQvdC40LvQuCDQv9GA0L7RhNC40LvRjCE8L2Rpdj5cIik7XG59XG5idWYucHVzaChcIjxmb3JtIGNsYXNzPVxcXCJ1c2VyaW5mb19fZm9ybVxcXCI+PGRpdiBjbGFzcz1cXFwidXNlcmluZm9fX2xpbmVcXFwiPjxkaXYgY2xhc3M9XFxcInVzZXJpbmZvX19sYWJlbFxcXCI+0KTQsNC80LjQu9C40Y86PC9kaXY+PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIG5hbWU9XFxcImxhc3RfbmFtZVxcXCJcIiArIChqYWRlLmF0dHIoXCJ2YWx1ZVwiLCBcIlwiICsgKHVzZXIubGFzdF9uYW1lIHx8ICcnKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwidXNlcmluZm9fX2lucHV0XFxcIi8+PGRpdiBjbGFzcz1cXFwidXNlcmluZm9fX3ZhbHVlXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSB1c2VyLmxhc3RfbmFtZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwidXNlcmluZm9fX2xpbmVcXFwiPjxkaXYgY2xhc3M9XFxcInVzZXJpbmZvX19sYWJlbFxcXCI+0JjQvNGPOjwvZGl2PjxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBuYW1lPVxcXCJmaXJzdF9uYW1lXFxcIlwiICsgKGphZGUuYXR0cihcInZhbHVlXCIsIFwiXCIgKyAodXNlci5maXJzdF9uYW1lIHx8ICcnKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwidXNlcmluZm9fX2lucHV0XFxcIi8+PGRpdiBjbGFzcz1cXFwidXNlcmluZm9fX3ZhbHVlXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSB1c2VyLmZpcnN0X25hbWUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcInVzZXJpbmZvX19saW5lXFxcIj48ZGl2IGNsYXNzPVxcXCJ1c2VyaW5mb19fbGFiZWxcXFwiPtCi0LXQu9C10YTQvtC9OjwvZGl2PjxpbnB1dCB0eXBlPVxcXCJwaG9uZVxcXCIgbmFtZT1cXFwicGhvbmVcXFwiXCIgKyAoamFkZS5hdHRyKFwidmFsdWVcIiwgXCJcIiArICh1c2VyLnBob25lIHx8ICcnKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwidXNlcmluZm9fX2lucHV0XFxcIi8+PGRpdiBjbGFzcz1cXFwidXNlcmluZm9fX3ZhbHVlXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSB1c2VyLnBob25lKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJ1c2VyaW5mb19fbGluZVxcXCI+PGRpdiBjbGFzcz1cXFwidXNlcmluZm9fX2xhYmVsXFxcIj7QlNCw0YLQsCDRgNC+0LbQtNC10L3QuNGPOjwvZGl2PjxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBuYW1lPVxcXCJiZGF0ZVxcXCJcIiArIChqYWRlLmF0dHIoXCJ2YWx1ZVwiLCBcIlwiICsgKHVzZXIuYmRhdGUgfHwgJycpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJ1c2VyaW5mb19faW5wdXRcXFwiLz48ZGl2IGNsYXNzPVxcXCJ1c2VyaW5mb19fdmFsdWVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IHVzZXIuYmRhdGUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcInVzZXJpbmZvX19saW5lXFxcIj48ZGl2IGNsYXNzPVxcXCJ1c2VyaW5mb19fbGFiZWxcXFwiPkUtbWFpbDo8L2Rpdj48aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgbmFtZT1cXFwiZW1haWxcXFwiXCIgKyAoamFkZS5hdHRyKFwidmFsdWVcIiwgXCJcIiArICh1c2VyLmVtYWlsIHx8ICcnKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwidXNlcmluZm9fX2lucHV0XFxcIi8+PGRpdiBjbGFzcz1cXFwidXNlcmluZm9fX3ZhbHVlXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSB1c2VyLmVtYWlsKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJ1c2VyaW5mb19fbGluZVxcXCI+PGRpdiBjbGFzcz1cXFwidXNlcmluZm9fX2xhYmVsXFxcIj7QndC40LrQvdC10LnQvDo8L2Rpdj48aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgbmFtZT1cXFwibmlja25hbWVcXFwiXCIgKyAoamFkZS5hdHRyKFwidmFsdWVcIiwgXCJcIiArICh1c2VyLm5pY2tuYW1lIHx8ICcnKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwidXNlcmluZm9fX2lucHV0XFxcIi8+PGRpdiBjbGFzcz1cXFwidXNlcmluZm9fX3ZhbHVlXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSB1c2VyLm5pY2tuYW1lKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48ZGl2IGNsYXNzPVxcXCJ1c2VyaW5mb19fZXJyb3ItbWVzIHVzZXJpbmZvX19lcnJvci1tZXMtLWludmlzXFxcIj7QndC40LrQvdC10LnQvCDQvdC1INGD0L3QuNC60LDQu9GM0L3Ri9C5ITwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcInVzZXJpbmZvX19jaGVja2JveC1saW5lXFxcIj5cIik7XG5pZiAoIHVzZXIuYWdyZWVtZW50PT10cnVlIHx8IHVzZXIuYWdyZWVtZW50PT1cInRydWVcIilcbntcbmJ1Zi5wdXNoKFwiPGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiBuYW1lPVxcXCJhZ3JlZW1lbnRcXFwiIGNoZWNrZWQ9XFxcImNoZWNrZWRcXFwiIGlkPVxcXCJlbWFpbC1jaGVja2JveFxcXCIgY2xhc3M9XFxcInVzZXJpbmZvX19jaGVja2JveFxcXCIvPlwiKTtcbn1cbmVsc2VcbntcbmJ1Zi5wdXNoKFwiPGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiBuYW1lPVxcXCJhZ3JlZW1lbnRcXFwiIGlkPVxcXCJlbWFpbC1jaGVja2JveFxcXCIgY2xhc3M9XFxcInVzZXJpbmZvX19jaGVja2JveFxcXCIvPlwiKTtcbn1cbmJ1Zi5wdXNoKFwiPGxhYmVsIGZvcj1cXFwiZW1haWwtY2hlY2tib3hcXFwiIG5hbWU9XFxcImFncmVlbWVudFxcXCIgY2xhc3M9XFxcInVzZXJpbmZvX19jaGVja2JveC1sYWJlbFxcXCI+PGRpdiBjbGFzcz1cXFwidXNlcmluZm9fX2NoZWNrYm94LXRleHRcXFwiPtCh0L7Qs9C70LDRgdC40LUg0L3QsCDRgNCw0YHRgdGL0LvQutGDINC+0YIg0LjQvNC10L3QuCDQsdGA0LXQvdC00LA8L2Rpdj48L2xhYmVsPjwvZGl2PjxidXR0b24gY2xhc3M9XFxcImJ1dCB1c2VyaW5mb19fYnV0IGpzLWNoYW5nZVVzZXJJbmZvXFxcIj7QmNC30LzQtdC90LjRgtGMPC9idXR0b24+PC9mb3JtPjwvZGl2PlwiKTt9LmNhbGwodGhpcyxcIm5vZnVsbFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgubm9mdWxsOnR5cGVvZiBub2Z1bGwhPT1cInVuZGVmaW5lZFwiP25vZnVsbDp1bmRlZmluZWQsXCJ1c2VyXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC51c2VyOnR5cGVvZiB1c2VyIT09XCJ1bmRlZmluZWRcIj91c2VyOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsImtleXMgPSByZXF1aXJlKCcuLi90b29scy9rZXlzLmNvZmZlZScpXHJcblxyXG5BdXRoID0gd2luZG93LmJ0b2EgJ3tcInNpZFwiOlwiJytrZXlzLnNpZCsnXCIsXCJoYXNoXCI6XCInK2tleXMuaGFzaCsnXCJ9J1xyXG5cclxucHJvdG9jb2wgPSBsb2NhdGlvbi5wcm90b2NvbFxyXG5ob3N0ID0gd2luZG93LmFwaWhvc3QgfHwgcHJvdG9jb2wrXCIvL3R1Yy1xdWVzdC5ydS9cIlxyXG5cclxuc2VuZCA9ICh1cmwsIG1ldGhvZCwgZGF0YSwgY2FsbGJhY2spIC0+XHJcblx0Y3J5cHQgPSAhIWNyeXB0XHJcblx0ZGF0YSA9IGRhdGEgfHwge31cclxuXHQkLmFqYXgge1xyXG5cdFx0dXJsOiBob3N0K3VybFxyXG5cdFx0bWV0aG9kOiBtZXRob2RcclxuXHRcdGhlYWRlcnM6IHtcclxuXHRcdFx0XCJBdXRoXCI6IHdpbmRvdy5idG9hICd7XCJzaWRcIjpcIicra2V5cy5zaWQrJ1wiLFwiaGFzaFwiOlwiJytrZXlzLmhhc2grJ1wifSdcclxuXHRcdH1cclxuXHRcdGRhdGE6IGRhdGFcclxuXHRcdHN1Y2Nlc3M6IChyZXMpIC0+XHJcblxyXG5cdFx0XHRjYWxsYmFjayhyZXMpIGlmIGNhbGxiYWNrP1xyXG5cdFx0ZXJyb3I6IChlcnIpIC0+XHJcblx0XHRcdGNvbnNvbGUubG9nKGVycilcclxuXHR9XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5mYXEgPSB7XHJcblx0Z2V0IDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS9mYXEvZ2V0XCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG59XHJcbm1vZHVsZS5leHBvcnRzLnJhdGluZyA9IHtcclxuXHRhbGwgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL3JhdGluZy9hbGxcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcblxyXG5cdGNvbW1vbiA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvcmF0aW5nL2NvbW1vblwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxuXHJcblx0Y3VycmVudCA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvcmF0aW5nL2N1cnJlbnRcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcbn1cclxubW9kdWxlLmV4cG9ydHMudXNlciA9IHtcclxuXHRpc1JlZyA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvdXNlci9pcy1yZWdcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcblxyXG5cdGlzRnVsbCA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvdXNlci9pcy1mdWxsXCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG5cclxuXHRnZXQgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL3VzZXIvZ2V0XCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG5cclxuXHRzYXZlIDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS91c2VyL3NhdmVcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcblxyXG5cdHJlZ2lzdHJhdGlvbiA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvdXNlci9yZWdpc3RyYXRpb25cIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcbn1cclxubW9kdWxlLmV4cG9ydHMuZmVlZGJhY2sgPSB7XHJcblx0Z2V0IDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS9mZWVkYmFjay9nZXRcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcblxyXG5cdGFkZCA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvZmVlZGJhY2svYWRkXCIsIFwiUE9TVFwiLCBvcHRzLCBjYWxsYmFjaylcclxuXHJcblx0cmVhZCA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvZmVlZGJhY2svcmVhZFwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxufVxyXG5tb2R1bGUuZXhwb3J0cy5xdWVzdHMgPSB7XHJcblx0Z2V0TGlzdCA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvcXVlc3RzL2dldC1saXN0XCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG59XHJcbm1vZHVsZS5leHBvcnRzLmdhbWUgPSB7XHJcblx0ZW50ZXIgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL2dhbWUvZW50ZXJcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcblxyXG5cdGdldFBvaW50IDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS9nYW1lL2dldC1wb2ludFwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxuXHJcblx0Y2hlY2tNb25leSA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvZ2FtZS9jaGVjay1tb25leVwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxuXHJcblx0Y2xlYXIgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL2dhbWUvY2xlYXJcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcbn1cclxubW9kdWxlLmV4cG9ydHMuYWNoaWV2ZW1lbnQgPSB7XHJcblx0Z2V0IDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS9hY2hpZXZlbWVudC9nZXRcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcblxyXG5cdGdldE5ldyA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvYWNoaWV2ZW1lbnQvZ2V0LW5ld1wiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxuXHJcblx0cmVhZCA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvYWNoaWV2ZW1lbnQvcmVhZFwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxufVxyXG5tb2R1bGUuZXhwb3J0cy5ldmVudCA9IHtcclxuXHRzZXQgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL2V2ZW50L3NldFwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxuXHRnZXQgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL2V2ZW50L2dldFwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxufVxyXG5tb2R1bGUuZXhwb3J0cy5wcml6ZSA9IHtcclxuXHRnZXQgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL3ByaXplL2dldFwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxufVxyXG5tb2R1bGUuZXhwb3J0cy50YXN0ZSA9IHtcclxuXHRjaGVjayA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvdGFzdGUvY2hlY2tcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcblx0aXNFbmFibGVkIDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS90YXN0ZS9pcy1lbmFibGVkXCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG59IiwibW9kdWxlLmV4cG9ydHMgPSBbXHJcblx0e1xyXG5cdFx0YWNoaWV2ZW1lbnRfaWQ6IDEwXHJcblx0XHRudW06IDBcclxuXHRcdG5hbWU6IFwi0J/QtdGA0LLRi9C5INC/0L7RiNC10LtcIlxyXG5cdFx0ZGVzY3JpcHRpb246IFwi0JfQsNCy0LXRgNGI0LjQuyDQv9C10YDQstGL0Lkg0LrQstC10YHRglwiXHJcblx0XHRtZXNzYWdlOiBcItCY0LPRgNCw0LXQvCDQsiDQvtC90LvQsNC50L0t0LrQstC10YHRgtGLLCDQvdC1INGF0LLQsNGC0LDQtdGCINGC0L7Qu9GM0LrQviDRgtC10LHRjyEg0K3RgtC+INCx0YvQu9C+INCx0Ysg0LrRgNGD0YLQviDQtNCw0LbQtSDQsdC10Lcg0L/RgNC40LfQvtCyLiDQndC+INC/0YDQuNC30Ysg0LXRgdGC0YwhICPQs9C+0YDQvtC00LfQsNC40LPRgNCw0LXRglwiXHJcblx0XHRwaG90bzogJ3Bob3RvLTExMTg1MDY4Ml8zOTgwNDkwMDknLFxyXG5cdFx0c21hbGxfcGhvdG86IFwiaW1nL2ltYWdlcy9hY2hpZXZlcy1zbWFsbC9pMC5wbmdcIlxyXG5cdH1cclxuXHR7XHJcblx0XHRhY2hpZXZlbWVudF9pZDogMTFcclxuXHRcdG51bTogMVxyXG5cdFx0bmFtZTogXCLQo9C/0ZHRgNGC0YvQuVwiXHJcblx0XHRkZXNjcmlwdGlvbjogXCLQl9Cw0LLQtdGA0YjQuNC7INC60LLQtdGB0YIg0LfQsCDQvtC00L3RgyDRgdC10YHRgdC40Y5cIlxyXG5cdFx0bWVzc2FnZTogXCLQmNCz0YDQsNC10Lwg0LIg0L7QvdC70LDQudC9LdC60LLQtdGB0YLRiywg0L3QtSDRhdCy0LDRgtCw0LXRgiDRgtC+0LvRjNC60L4g0YLQtdCx0Y8hINCt0YLQviDQsdGL0LvQviDQsdGLINC60YDRg9GC0L4g0LTQsNC20LUg0LHQtdC3INC/0YDQuNC30L7Qsi4g0J3QviDQv9GA0LjQt9GLINC10YHRgtGMISAj0LPQvtGA0L7QtNC30LDQuNCz0YDQsNC10YJcIlxyXG5cdFx0cGhvdG86ICdwaG90by0xMTE4NTA2ODJfMzk4MDQ5MDE3JyxcclxuXHRcdHNtYWxsX3Bob3RvOiBcImltZy9pbWFnZXMvYWNoaWV2ZXMtc21hbGwvaTEucG5nXCJcclxuXHR9XHJcblx0e1xyXG5cdFx0YWNoaWV2ZW1lbnRfaWQ6IDEyXHJcblx0XHRudW06IDJcclxuXHRcdG5hbWU6IFwi0JTQsNC5INC/0Y/RgtGMIVwiXHJcblx0XHRkZXNjcmlwdGlvbjogXCLQl9Cw0LLQtdGA0YjQuNC7IDUg0LrQstC10YHRgtC+0LJcIlxyXG5cdFx0bWVzc2FnZTogXCLQmNCz0YDQsNC10Lwg0LIg0L7QvdC70LDQudC9LdC60LLQtdGB0YLRiywg0L3QtSDRhdCy0LDRgtCw0LXRgiDRgtC+0LvRjNC60L4g0YLQtdCx0Y8hINCt0YLQviDQsdGL0LvQviDQsdGLINC60YDRg9GC0L4g0LTQsNC20LUg0LHQtdC3INC/0YDQuNC30L7Qsi4g0J3QviDQv9GA0LjQt9GLINC10YHRgtGMISAj0LPQvtGA0L7QtNC30LDQuNCz0YDQsNC10YJcIlxyXG5cdFx0cGhvdG86ICdwaG90by0xMTE4NTA2ODJfMzk4MDQ5MDExJyxcclxuXHRcdHNtYWxsX3Bob3RvOiBcImltZy9pbWFnZXMvYWNoaWV2ZXMtc21hbGwvaTIucG5nXCJcclxuXHR9XHJcblx0e1xyXG5cdFx0YWNoaWV2ZW1lbnRfaWQ6IDEzXHJcblx0XHRudW06IDNcclxuXHRcdG5hbWU6IFwi0JrRgNCw0YHQsNCy0YfQuNC6XCJcclxuXHRcdGRlc2NyaXB0aW9uOiBcItCX0LDQstC10YDRiNC40LsgMTAg0LrQstC10YHRgtC+0LJcIlxyXG5cdFx0bWVzc2FnZTogXCLQmNCz0YDQsNC10Lwg0LIg0L7QvdC70LDQudC9LdC60LLQtdGB0YLRiywg0L3QtSDRhdCy0LDRgtCw0LXRgiDRgtC+0LvRjNC60L4g0YLQtdCx0Y8hINCt0YLQviDQsdGL0LvQviDQsdGLINC60YDRg9GC0L4g0LTQsNC20LUg0LHQtdC3INC/0YDQuNC30L7Qsi4g0J3QviDQv9GA0LjQt9GLINC10YHRgtGMISAj0LPQvtGA0L7QtNC30LDQuNCz0YDQsNC10YJcIlxyXG5cdFx0cGhvdG86ICdwaG90by0xMTE4NTA2ODJfMzk4MDQ5MDE0JyxcclxuXHRcdHNtYWxsX3Bob3RvOiBcImltZy9pbWFnZXMvYWNoaWV2ZXMtc21hbGwvaTMucG5nXCJcclxuXHR9XHJcblx0e1xyXG5cdFx0YWNoaWV2ZW1lbnRfaWQ6IDE0XHJcblx0XHRudW06IDRcclxuXHRcdG5hbWU6IFwi0J/RgNC40YjQtdC7INC6INGD0YHQv9C10YXRg1wiXHJcblx0XHRkZXNjcmlwdGlvbjogXCLQn9C+0L/QsNC7INCyINCi0J7Qny0yMCDQsiDQvtCx0YnQtdC8INGA0LXQudGC0LjQvdCz0LVcIlxyXG5cdFx0bWVzc2FnZTogXCLQmNCz0YDQsNC10Lwg0LIg0L7QvdC70LDQudC9LdC60LLQtdGB0YLRiywg0L3QtSDRhdCy0LDRgtCw0LXRgiDRgtC+0LvRjNC60L4g0YLQtdCx0Y8hINCt0YLQviDQsdGL0LvQviDQsdGLINC60YDRg9GC0L4g0LTQsNC20LUg0LHQtdC3INC/0YDQuNC30L7Qsi4g0J3QviDQv9GA0LjQt9GLINC10YHRgtGMISAj0LPQvtGA0L7QtNC30LDQuNCz0YDQsNC10YJcIlxyXG5cdFx0cGhvdG86ICdwaG90by0xMTE4NTA2ODJfMzk4MDQ5MDE5JyxcclxuXHRcdHNtYWxsX3Bob3RvOiBcImltZy9pbWFnZXMvYWNoaWV2ZXMtc21hbGwvaTQucG5nXCJcclxuXHR9XHJcblx0e1xyXG5cdFx0YWNoaWV2ZW1lbnRfaWQ6IDE1XHJcblx0XHRudW06IDVcclxuXHRcdG5hbWU6IFwi0JPQvtGA0L7QtNGB0LrQsNGPINC70LXQs9C10L3QtNCwXCJcclxuXHRcdGRlc2NyaXB0aW9uOiBcItCX0LDQstC10YDRiNC40Lsg0LLRgdC1INC00L7RgdGC0YPQv9C90YvQtSDQutCy0LXRgdGC0YtcIlxyXG5cdFx0bWVzc2FnZTogXCLQmNCz0YDQsNC10Lwg0LIg0L7QvdC70LDQudC9LdC60LLQtdGB0YLRiywg0L3QtSDRhdCy0LDRgtCw0LXRgiDRgtC+0LvRjNC60L4g0YLQtdCx0Y8hINCt0YLQviDQsdGL0LvQviDQsdGLINC60YDRg9GC0L4g0LTQsNC20LUg0LHQtdC3INC/0YDQuNC30L7Qsi4g0J3QviDQv9GA0LjQt9GLINC10YHRgtGMISAj0LPQvtGA0L7QtNC30LDQuNCz0YDQsNC10YJcIlxyXG5cdFx0cGhvdG86ICdwaG90by0xMTE4NTA2ODJfMzk4MDQ5MDEzJyxcclxuXHRcdHNtYWxsX3Bob3RvOiBcImltZy9pbWFnZXMvYWNoaWV2ZXMtc21hbGwvaTUucG5nXCJcclxuXHR9XHJcblx0e1xyXG5cdFx0YWNoaWV2ZW1lbnRfaWQ6IDE2XHJcblx0XHRudW06IDZcclxuXHRcdG5hbWU6IFwi0JLQtdGA0LHQvtCy0YnQuNC6XCJcclxuXHRcdGRlc2NyaXB0aW9uOiBcItCf0YDQuNCz0LvQsNGB0LjQuyA1INC00YDRg9C30LXQuVwiXHJcblx0XHRtZXNzYWdlOiBcItCY0LPRgNCw0LXQvCDQsiDQvtC90LvQsNC50L0t0LrQstC10YHRgtGLLCDQvdC1INGF0LLQsNGC0LDQtdGCINGC0L7Qu9GM0LrQviDRgtC10LHRjyEg0K3RgtC+INCx0YvQu9C+INCx0Ysg0LrRgNGD0YLQviDQtNCw0LbQtSDQsdC10Lcg0L/RgNC40LfQvtCyLiDQndC+INC/0YDQuNC30Ysg0LXRgdGC0YwhICPQs9C+0YDQvtC00LfQsNC40LPRgNCw0LXRglwiXHJcblx0XHRwaG90bzogJ3Bob3RvLTExMTg1MDY4Ml8zOTgwNDkwMTYnLFxyXG5cdFx0c21hbGxfcGhvdG86IFwiaW1nL2ltYWdlcy9hY2hpZXZlcy1zbWFsbC9pNi5wbmdcIlxyXG5cdH1cclxuXHR7XHJcblx0XHRhY2hpZXZlbWVudF9pZDogMTdcclxuXHRcdG51bTogN1xyXG5cdFx0bmFtZTogXCLQk9C40L/QvdC+0LbQsNCx0LBcIlxyXG5cdFx0ZGVzY3JpcHRpb246IFwi0J/RgNC40LPQu9Cw0YHQuNC7IDEwINC00YDRg9C30LXQuVwiXHJcblx0XHRtZXNzYWdlOiBcItCY0LPRgNCw0LXQvCDQsiDQvtC90LvQsNC50L0t0LrQstC10YHRgtGLLCDQvdC1INGF0LLQsNGC0LDQtdGCINGC0L7Qu9GM0LrQviDRgtC10LHRjyEg0K3RgtC+INCx0YvQu9C+INCx0Ysg0LrRgNGD0YLQviDQtNCw0LbQtSDQsdC10Lcg0L/RgNC40LfQvtCyLiDQndC+INC/0YDQuNC30Ysg0LXRgdGC0YwhICPQs9C+0YDQvtC00LfQsNC40LPRgNCw0LXRglwiXHJcblx0XHRwaG90bzogJ3Bob3RvLTExMTg1MDY4Ml8zOTgwNDkwMTInLFxyXG5cdFx0c21hbGxfcGhvdG86IFwiaW1nL2ltYWdlcy9hY2hpZXZlcy1zbWFsbC9pNy5wbmdcIlxyXG5cdH1cclxuXSIsIm1vZHVsZS5leHBvcnRzLnNlbmQgPSAoZXZlbnRfbmFtZSkgLT5cclxuXHRnYSgnc2VuZCcsIHtcclxuXHRcdGhpdFR5cGU6ICdldmVudCcsXHJcblx0XHRldmVudENhdGVnb3J5OiAnZXZlbnRzJyxcclxuXHRcdGV2ZW50QWN0aW9uOiBldmVudF9uYW1lXHJcblx0fSkiLCJtZDUgPSByZXF1aXJlICcuL21kNS5jb2ZmZWUnXHJcblxyXG5BcHBTZXR0aW5nID0gd2luZG93LkFwcFNldHRpbmcgfHwge31cclxuXHJcbkFwcFNldHRpbmcuc2lkID0gQXBwU2V0dGluZy5zaWQgfHwgXCIxXCJcclxuQXBwU2V0dGluZy5oYXNoID0gQXBwU2V0dGluZy5oYXNoIHx8IFwiaGFzaF90ZXN0XCJcclxuQXBwU2V0dGluZy52aWV3ZXJfaWQgPSBBcHBTZXR0aW5nLnZpZXdlcl9pZCB8fCBcIjM5NDMzNjRcIlxyXG5BcHBTZXR0aW5nLmF1dGhfa2V5ID0gQXBwU2V0dGluZy5hdXRoX2tleSB8fCBcIjU4MzQxNmNmMWJlZjY5MDE5YmE3ZWVhMGFkNjhhNzhhXCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdHNpZDogQXBwU2V0dGluZy5zaWRcclxuXHRoYXNoOiBBcHBTZXR0aW5nLmhhc2hcclxuXHR2aWV3ZXJfaWQgOiBBcHBTZXR0aW5nLnZpZXdlcl9pZFxyXG5cdGF1dGhfa2V5IDogQXBwU2V0dGluZy5hdXRoX2tleVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5zZXRIYXNoID0gKHZhbCkgLT5cclxuXHRtb2R1bGUuZXhwb3J0cy5oYXNoID0gdmFsXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5nZXRNZDVrZXkgPSAoKSAtPlxyXG5cdHJldHVybiBtZDUuZW5jcnlwdChtb2R1bGUuZXhwb3J0cy5oYXNoICsgXCJfX1wiICsgQXBwU2V0dGluZy5zaWQpXHJcbiIsImtleXMgPSByZXF1aXJlKCcuL2tleXMnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMuaW5pdCA9IC0+XHJcblx0JCgnaGVhZGVyIGEnKS5lYWNoIChpLCBlbCkgLT5cclxuXHRcdGhyZWYgPSAkKGVsKS5hdHRyKCdocmVmJylcclxuXHRcdCNpZiBocmVmLnN1YnN0cigtMSkgPT0gXCIvXCIgdGhlbiBocmVmID0gaHJlZi5zdWJzdHIoMCxocmVmLmxlbmd0aC0xKVxyXG5cdFx0JChlbCkuYXR0cignaHJlZicsIGhyZWYrXCI/c2lkPVwiK2tleXMuc2lkK1wiJnZpZXdlcl9pZD1cIitrZXlzLnZpZXdlcl9pZCtcIiZhdXRoX2tleT1cIitrZXlzLmF1dGhfa2V5KVxyXG5cclxubW9kdWxlLmV4cG9ydHMuYWRkQnV0SGFzaCA9ICgkZWxzKSAtPlxyXG5cdCRlbHMuZWFjaCAoaSwgZWwpIC0+XHJcblx0XHRjb25zb2xlLmxvZyBlbFxyXG5cdFx0aHJlZiA9ICQoZWwpLmF0dHIoJ2hyZWYnKVxyXG5cdFx0JChlbCkuYXR0cignaHJlZicsIGhyZWYrXCImc2lkPVwiK2tleXMuc2lkK1wiJnZpZXdlcl9pZD1cIitrZXlzLnZpZXdlcl9pZCtcIiZhdXRoX2tleT1cIitrZXlzLmF1dGhfa2V5KVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzLmFkZFdoYXRCdXRIYXNoID0gKCRlbHMpIC0+XHJcblx0JGVscy5lYWNoIChpLCBlbCkgLT5cclxuXHRcdGNvbnNvbGUubG9nIGVsXHJcblx0XHRocmVmID0gJChlbCkuYXR0cignaHJlZicpXHJcblx0XHQkKGVsKS5hdHRyKCdocmVmJywgaHJlZitcIj9zaWQ9XCIra2V5cy5zaWQrXCImdmlld2VyX2lkPVwiK2tleXMudmlld2VyX2lkK1wiJmF1dGhfa2V5PVwiK2tleXMuYXV0aF9rZXkpXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMucGFyc2VHZXRQYXJhbXMgPSAtPlxyXG5cdCRfR0VUID0ge31cclxuXHRfX0dFVCA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyaW5nKDEpLnNwbGl0KFwiJlwiKVxyXG5cdGZvciB2dmFyIGluIF9fR0VUXHJcblx0XHRnZXRWYXIgPSB2dmFyLnNwbGl0KFwiPVwiKVxyXG5cdFx0aWYgdHlwZW9mKGdldFZhclsxXSk9PVwidW5kZWZpbmVkXCJcclxuXHRcdFx0JF9HRVRbZ2V0VmFyWzBdXSA9IFwiXCJcclxuXHRcdGVsc2VcclxuXHRcdFx0JF9HRVRbZ2V0VmFyWzBdXSA9IGdldFZhclsxXVxyXG5cdHJldHVybiAkX0dFVFxyXG4iLCJgZnVuY3Rpb24gbWQ1Y3ljbGUoeCwgaykge1xyXG52YXIgYSA9IHhbMF0sIGIgPSB4WzFdLCBjID0geFsyXSwgZCA9IHhbM107XHJcblxyXG5hID0gZmYoYSwgYiwgYywgZCwga1swXSwgNywgLTY4MDg3NjkzNik7XHJcbmQgPSBmZihkLCBhLCBiLCBjLCBrWzFdLCAxMiwgLTM4OTU2NDU4Nik7XHJcbmMgPSBmZihjLCBkLCBhLCBiLCBrWzJdLCAxNywgIDYwNjEwNTgxOSk7XHJcbmIgPSBmZihiLCBjLCBkLCBhLCBrWzNdLCAyMiwgLTEwNDQ1MjUzMzApO1xyXG5hID0gZmYoYSwgYiwgYywgZCwga1s0XSwgNywgLTE3NjQxODg5Nyk7XHJcbmQgPSBmZihkLCBhLCBiLCBjLCBrWzVdLCAxMiwgIDEyMDAwODA0MjYpO1xyXG5jID0gZmYoYywgZCwgYSwgYiwga1s2XSwgMTcsIC0xNDczMjMxMzQxKTtcclxuYiA9IGZmKGIsIGMsIGQsIGEsIGtbN10sIDIyLCAtNDU3MDU5ODMpO1xyXG5hID0gZmYoYSwgYiwgYywgZCwga1s4XSwgNywgIDE3NzAwMzU0MTYpO1xyXG5kID0gZmYoZCwgYSwgYiwgYywga1s5XSwgMTIsIC0xOTU4NDE0NDE3KTtcclxuYyA9IGZmKGMsIGQsIGEsIGIsIGtbMTBdLCAxNywgLTQyMDYzKTtcclxuYiA9IGZmKGIsIGMsIGQsIGEsIGtbMTFdLCAyMiwgLTE5OTA0MDQxNjIpO1xyXG5hID0gZmYoYSwgYiwgYywgZCwga1sxMl0sIDcsICAxODA0NjAzNjgyKTtcclxuZCA9IGZmKGQsIGEsIGIsIGMsIGtbMTNdLCAxMiwgLTQwMzQxMTAxKTtcclxuYyA9IGZmKGMsIGQsIGEsIGIsIGtbMTRdLCAxNywgLTE1MDIwMDIyOTApO1xyXG5iID0gZmYoYiwgYywgZCwgYSwga1sxNV0sIDIyLCAgMTIzNjUzNTMyOSk7XHJcblxyXG5hID0gZ2coYSwgYiwgYywgZCwga1sxXSwgNSwgLTE2NTc5NjUxMCk7XHJcbmQgPSBnZyhkLCBhLCBiLCBjLCBrWzZdLCA5LCAtMTA2OTUwMTYzMik7XHJcbmMgPSBnZyhjLCBkLCBhLCBiLCBrWzExXSwgMTQsICA2NDM3MTc3MTMpO1xyXG5iID0gZ2coYiwgYywgZCwgYSwga1swXSwgMjAsIC0zNzM4OTczMDIpO1xyXG5hID0gZ2coYSwgYiwgYywgZCwga1s1XSwgNSwgLTcwMTU1ODY5MSk7XHJcbmQgPSBnZyhkLCBhLCBiLCBjLCBrWzEwXSwgOSwgIDM4MDE2MDgzKTtcclxuYyA9IGdnKGMsIGQsIGEsIGIsIGtbMTVdLCAxNCwgLTY2MDQ3ODMzNSk7XHJcbmIgPSBnZyhiLCBjLCBkLCBhLCBrWzRdLCAyMCwgLTQwNTUzNzg0OCk7XHJcbmEgPSBnZyhhLCBiLCBjLCBkLCBrWzldLCA1LCAgNTY4NDQ2NDM4KTtcclxuZCA9IGdnKGQsIGEsIGIsIGMsIGtbMTRdLCA5LCAtMTAxOTgwMzY5MCk7XHJcbmMgPSBnZyhjLCBkLCBhLCBiLCBrWzNdLCAxNCwgLTE4NzM2Mzk2MSk7XHJcbmIgPSBnZyhiLCBjLCBkLCBhLCBrWzhdLCAyMCwgIDExNjM1MzE1MDEpO1xyXG5hID0gZ2coYSwgYiwgYywgZCwga1sxM10sIDUsIC0xNDQ0NjgxNDY3KTtcclxuZCA9IGdnKGQsIGEsIGIsIGMsIGtbMl0sIDksIC01MTQwMzc4NCk7XHJcbmMgPSBnZyhjLCBkLCBhLCBiLCBrWzddLCAxNCwgIDE3MzUzMjg0NzMpO1xyXG5iID0gZ2coYiwgYywgZCwgYSwga1sxMl0sIDIwLCAtMTkyNjYwNzczNCk7XHJcblxyXG5hID0gaGgoYSwgYiwgYywgZCwga1s1XSwgNCwgLTM3ODU1OCk7XHJcbmQgPSBoaChkLCBhLCBiLCBjLCBrWzhdLCAxMSwgLTIwMjI1NzQ0NjMpO1xyXG5jID0gaGgoYywgZCwgYSwgYiwga1sxMV0sIDE2LCAgMTgzOTAzMDU2Mik7XHJcbmIgPSBoaChiLCBjLCBkLCBhLCBrWzE0XSwgMjMsIC0zNTMwOTU1Nik7XHJcbmEgPSBoaChhLCBiLCBjLCBkLCBrWzFdLCA0LCAtMTUzMDk5MjA2MCk7XHJcbmQgPSBoaChkLCBhLCBiLCBjLCBrWzRdLCAxMSwgIDEyNzI4OTMzNTMpO1xyXG5jID0gaGgoYywgZCwgYSwgYiwga1s3XSwgMTYsIC0xNTU0OTc2MzIpO1xyXG5iID0gaGgoYiwgYywgZCwgYSwga1sxMF0sIDIzLCAtMTA5NDczMDY0MCk7XHJcbmEgPSBoaChhLCBiLCBjLCBkLCBrWzEzXSwgNCwgIDY4MTI3OTE3NCk7XHJcbmQgPSBoaChkLCBhLCBiLCBjLCBrWzBdLCAxMSwgLTM1ODUzNzIyMik7XHJcbmMgPSBoaChjLCBkLCBhLCBiLCBrWzNdLCAxNiwgLTcyMjUyMTk3OSk7XHJcbmIgPSBoaChiLCBjLCBkLCBhLCBrWzZdLCAyMywgIDc2MDI5MTg5KTtcclxuYSA9IGhoKGEsIGIsIGMsIGQsIGtbOV0sIDQsIC02NDAzNjQ0ODcpO1xyXG5kID0gaGgoZCwgYSwgYiwgYywga1sxMl0sIDExLCAtNDIxODE1ODM1KTtcclxuYyA9IGhoKGMsIGQsIGEsIGIsIGtbMTVdLCAxNiwgIDUzMDc0MjUyMCk7XHJcbmIgPSBoaChiLCBjLCBkLCBhLCBrWzJdLCAyMywgLTk5NTMzODY1MSk7XHJcblxyXG5hID0gaWkoYSwgYiwgYywgZCwga1swXSwgNiwgLTE5ODYzMDg0NCk7XHJcbmQgPSBpaShkLCBhLCBiLCBjLCBrWzddLCAxMCwgIDExMjY4OTE0MTUpO1xyXG5jID0gaWkoYywgZCwgYSwgYiwga1sxNF0sIDE1LCAtMTQxNjM1NDkwNSk7XHJcbmIgPSBpaShiLCBjLCBkLCBhLCBrWzVdLCAyMSwgLTU3NDM0MDU1KTtcclxuYSA9IGlpKGEsIGIsIGMsIGQsIGtbMTJdLCA2LCAgMTcwMDQ4NTU3MSk7XHJcbmQgPSBpaShkLCBhLCBiLCBjLCBrWzNdLCAxMCwgLTE4OTQ5ODY2MDYpO1xyXG5jID0gaWkoYywgZCwgYSwgYiwga1sxMF0sIDE1LCAtMTA1MTUyMyk7XHJcbmIgPSBpaShiLCBjLCBkLCBhLCBrWzFdLCAyMSwgLTIwNTQ5MjI3OTkpO1xyXG5hID0gaWkoYSwgYiwgYywgZCwga1s4XSwgNiwgIDE4NzMzMTMzNTkpO1xyXG5kID0gaWkoZCwgYSwgYiwgYywga1sxNV0sIDEwLCAtMzA2MTE3NDQpO1xyXG5jID0gaWkoYywgZCwgYSwgYiwga1s2XSwgMTUsIC0xNTYwMTk4MzgwKTtcclxuYiA9IGlpKGIsIGMsIGQsIGEsIGtbMTNdLCAyMSwgIDEzMDkxNTE2NDkpO1xyXG5hID0gaWkoYSwgYiwgYywgZCwga1s0XSwgNiwgLTE0NTUyMzA3MCk7XHJcbmQgPSBpaShkLCBhLCBiLCBjLCBrWzExXSwgMTAsIC0xMTIwMjEwMzc5KTtcclxuYyA9IGlpKGMsIGQsIGEsIGIsIGtbMl0sIDE1LCAgNzE4Nzg3MjU5KTtcclxuYiA9IGlpKGIsIGMsIGQsIGEsIGtbOV0sIDIxLCAtMzQzNDg1NTUxKTtcclxuXHJcbnhbMF0gPSBhZGQzMihhLCB4WzBdKTtcclxueFsxXSA9IGFkZDMyKGIsIHhbMV0pO1xyXG54WzJdID0gYWRkMzIoYywgeFsyXSk7XHJcbnhbM10gPSBhZGQzMihkLCB4WzNdKTtcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNtbihxLCBhLCBiLCB4LCBzLCB0KSB7XHJcbmEgPSBhZGQzMihhZGQzMihhLCBxKSwgYWRkMzIoeCwgdCkpO1xyXG5yZXR1cm4gYWRkMzIoKGEgPDwgcykgfCAoYSA+Pj4gKDMyIC0gcykpLCBiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmYoYSwgYiwgYywgZCwgeCwgcywgdCkge1xyXG5yZXR1cm4gY21uKChiICYgYykgfCAoKH5iKSAmIGQpLCBhLCBiLCB4LCBzLCB0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2coYSwgYiwgYywgZCwgeCwgcywgdCkge1xyXG5yZXR1cm4gY21uKChiICYgZCkgfCAoYyAmICh+ZCkpLCBhLCBiLCB4LCBzLCB0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gaGgoYSwgYiwgYywgZCwgeCwgcywgdCkge1xyXG5yZXR1cm4gY21uKGIgXiBjIF4gZCwgYSwgYiwgeCwgcywgdCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlpKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcclxucmV0dXJuIGNtbihjIF4gKGIgfCAofmQpKSwgYSwgYiwgeCwgcywgdCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1kNTEocykge1xyXG5cdHR4dCA9ICcnO1xyXG5cdHZhciBuID0gcy5sZW5ndGgsXHJcblx0XHRzdGF0ZSA9IFsxNzMyNTg0MTkzLCAtMjcxNzMzODc5LCAtMTczMjU4NDE5NCwgMjcxNzMzODc4XSwgaTtcclxuXHRmb3IgKGk9NjQ7IGk8PXMubGVuZ3RoOyBpKz02NCkge1xyXG5cdFx0bWQ1Y3ljbGUoc3RhdGUsIG1kNWJsayhzLnN1YnN0cmluZyhpLTY0LCBpKSkpO1xyXG5cdH1cclxuXHRzID0gcy5zdWJzdHJpbmcoaS02NCk7XHJcblx0dmFyIHRhaWwgPSBbMCwwLDAsMCwgMCwwLDAsMCwgMCwwLDAsMCwgMCwwLDAsMF07XHJcblx0Zm9yIChpPTA7IGk8cy5sZW5ndGg7IGkrKylcclxuXHRcdHRhaWxbaT4+Ml0gfD0gcy5jaGFyQ29kZUF0KGkpIDw8ICgoaSU0KSA8PCAzKTtcclxuXHR0YWlsW2k+PjJdIHw9IDB4ODAgPDwgKChpJTQpIDw8IDMpO1xyXG5cdGlmIChpID4gNTUpIHtcclxuXHRcdG1kNWN5Y2xlKHN0YXRlLCB0YWlsKTtcclxuXHRcdGZvciAoaT0wOyBpPDE2OyBpKyspIHRhaWxbaV0gPSAwO1xyXG5cdH1cclxuXHR0YWlsWzE0XSA9IG4qODtcclxuXHRtZDVjeWNsZShzdGF0ZSwgdGFpbCk7XHJcblx0cmV0dXJuIHN0YXRlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtZDVibGsocykgeyAvKiBJIGZpZ3VyZWQgZ2xvYmFsIHdhcyBmYXN0ZXIuICAgKi9cclxuXHR2YXIgbWQ1YmxrcyA9IFtdLCBpOyAvKiBBbmR5IEtpbmcgc2FpZCBkbyBpdCB0aGlzIHdheS4gKi9cclxuXHRmb3IgKGk9MDsgaTw2NDsgaSs9NCkge1xyXG5cdFx0bWQ1Ymxrc1tpPj4yXSA9IHMuY2hhckNvZGVBdChpKVxyXG5cdFx0KyAocy5jaGFyQ29kZUF0KGkrMSkgPDwgOClcclxuXHRcdCsgKHMuY2hhckNvZGVBdChpKzIpIDw8IDE2KVxyXG5cdFx0KyAocy5jaGFyQ29kZUF0KGkrMykgPDwgMjQpO1xyXG5cdH1cclxuXHRyZXR1cm4gbWQ1YmxrcztcclxufVxyXG5cclxudmFyIGhleF9jaHIgPSAnMDEyMzQ1Njc4OWFiY2RlZicuc3BsaXQoJycpO1xyXG5cclxuZnVuY3Rpb24gcmhleChuKVxyXG57XHJcblx0dmFyIHM9JycsIGo9MDtcclxuXHRmb3IoOyBqPDQ7IGorKylcclxuXHRzICs9IGhleF9jaHJbKG4gPj4gKGogKiA4ICsgNCkpICYgMHgwRl1cclxuXHQrIGhleF9jaHJbKG4gPj4gKGogKiA4KSkgJiAweDBGXTtcclxuXHRyZXR1cm4gcztcclxufVxyXG5cclxuZnVuY3Rpb24gaGV4KHgpIHtcclxuXHRmb3IgKHZhciBpPTA7IGk8eC5sZW5ndGg7IGkrKylcclxuXHR4W2ldID0gcmhleCh4W2ldKTtcclxuXHRyZXR1cm4geC5qb2luKCcnKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbWQ1KHMpIHtcclxuXHRyZXR1cm4gaGV4KG1kNTEocykpO1xyXG59XHJcblxyXG4vKiB0aGlzIGZ1bmN0aW9uIGlzIG11Y2ggZmFzdGVyLFxyXG5zbyBpZiBwb3NzaWJsZSB3ZSB1c2UgaXQuIFNvbWUgSUVzXHJcbmFyZSB0aGUgb25seSBvbmVzIEkga25vdyBvZiB0aGF0XHJcbm5lZWQgdGhlIGlkaW90aWMgc2Vjb25kIGZ1bmN0aW9uLFxyXG5nZW5lcmF0ZWQgYnkgYW4gaWYgY2xhdXNlLiAgKi9cclxuXHJcbmZ1bmN0aW9uIGFkZDMyKGEsIGIpIHtcclxuXHRyZXR1cm4gKGEgKyBiKSAmIDB4RkZGRkZGRkY7XHJcbn1cclxuXHJcbmlmIChtZDUoJ2hlbGxvJykgIT0gJzVkNDE0MDJhYmM0YjJhNzZiOTcxOWQ5MTEwMTdjNTkyJykge1xyXG5cdGZ1bmN0aW9uIGFkZDMyKHgsIHkpIHtcclxuXHRcdHZhciBsc3cgPSAoeCAmIDB4RkZGRikgKyAoeSAmIDB4RkZGRiksXHJcblx0XHRtc3cgPSAoeCA+PiAxNikgKyAoeSA+PiAxNikgKyAobHN3ID4+IDE2KTtcclxuXHRcdHJldHVybiAobXN3IDw8IDE2KSB8IChsc3cgJiAweEZGRkYpO1xyXG5cdH1cclxufWBcclxuXHJcbm1vZHVsZS5leHBvcnRzLmVuY3J5cHQgPSBtZDUiLCJyZXF1ZXN0ID0gcmVxdWlyZSgnLi4vcmVxdWVzdCcpXHJcblxyXG5cclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMuaW5pdCA9IChjYWxsYmFjaykgLT5cclxuXHJcblx0aW5pdFN1Y2Nlc3MgPSAtPlxyXG5cdFx0Y29uc29sZS5sb2cgXCJpbml0IHN1Y2Nlc3NcIlxyXG5cdFx0Y2FsbGJhY2soKVxyXG5cclxuXHRpbml0RmFpbCA9IC0+XHJcblx0XHRjb25zb2xlLmxvZyAnaW5pdCBmYWlsJ1xyXG5cclxuXHRWSy5pbml0IGluaXRTdWNjZXNzLCBpbml0RmFpbCwgJzUuNDAnXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5yZXNpemUgPSAoaGVpZ2h0KSAtPlxyXG5cdFZLLmNhbGxNZXRob2QgXCJyZXNpemVXaW5kb3dcIiwgMTAwMCwgaGVpZ2h0XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5pc1JlZyA9IChjYWxsYmFjaykgLT5cclxuXHRyZXF1ZXN0LnVzZXIuaXNSZWcge30sIChyZXMpIC0+XHJcblx0XHRjb25zb2xlLmxvZyBcIklTIFJFRyBcIiArIHJlcy5yZXN1bHRcclxuXHRcdGlmIHJlcy5yZXN1bHQgPT0gdHJ1ZVxyXG5cdFx0XHRjYWxsYmFjaygpXHJcblx0XHRpZiByZXMucmVzdWx0ID09IGZhbHNlXHJcblx0XHRcdGdldFVzZXJJbmZvKClcclxuXHJcblx0Z2V0VXNlckluZm8gPSAtPlxyXG5cdFx0VksuYXBpICd1c2Vycy5nZXQnLCB7dGVzdF9tb2RlOiAxLCBmaWVsZHM6XCJzY3JlZW5fbmFtZSxzZXgsYmRhdGUsY2l0eSxjb3VudHJ5LHBob3RvX21heFwifSwgKGRhdGEpIC0+XHJcblxyXG5cdFx0XHRpZiAhZGF0YS5yZXNwb25zZVswXT9cclxuXHRcdFx0XHRjb25zb2xlLmxvZyBkYXRhXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdGNvbnNvbGUubG9nIGRhdGFcclxuXHRcdFx0cGVyc29uSW5mbyA9IHtcclxuXHRcdFx0XHRmaXJzdF9uYW1lIDogZGF0YS5yZXNwb25zZVswXS5maXJzdF9uYW1lIHx8IFwiXCJcclxuXHRcdFx0XHRsYXN0X25hbWUgOiBkYXRhLnJlc3BvbnNlWzBdLmxhc3RfbmFtZSB8fCBcIlwiXHJcblx0XHRcdFx0c2NyZWVuX25hbWUgOiBkYXRhLnJlc3BvbnNlWzBdLnNjcmVlbl9uYW1lIHx8IFwiXCJcclxuXHRcdFx0XHRzZXggOiBkYXRhLnJlc3BvbnNlWzBdLnNleFxyXG5cdFx0XHRcdGJkYXRlIDogIGRhdGEucmVzcG9uc2VbMF0uYmRhdGUgfHwgJzAxLjAxLjAwMDAnXHJcblx0XHRcdFx0cGhvdG8gOiBkYXRhLnJlc3BvbnNlWzBdLnBob3RvX21heCB8fCBcIlwiXHJcblx0XHRcdH1cclxuXHRcdFx0dHJ5XHJcblx0XHRcdFx0cGVyc29uSW5mby5jaXR5ID0gZGF0YS5yZXNwb25zZVswXS5jaXR5LnRpdGxlXHJcblx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRwZXJzb25JbmZvLmNpdHkgPSBcIlwiXHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdHBlcnNvbkluZm8uY291bnRyeSA9IGRhdGEucmVzcG9uc2VbMF0uY291bnRyeS50aXRsZVxyXG5cdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0cGVyc29uSW5mby5jb3VudHJ5ID0gXCJcIlxyXG5cclxuXHJcblx0XHRcdHJlcXVlc3QudXNlci5yZWdpc3RyYXRpb24gcGVyc29uSW5mbywgKHJlcykgLT5cclxuXHRcdFx0XHRjb25zb2xlLmxvZyByZXNcclxuXHRcdFx0XHRjYWxsYmFjaygpXHJcblxyXG5tb2R1bGUuZXhwb3J0cy53YWxsUG9zdCA9IChvcHRzLCBzdWNjZXNzKSAtPlxyXG5cdG9wdHMudGVzdF9tb2RlID0gMVxyXG5cdFZLLmFwaSAnd2FsbC5wb3N0Jywgb3B0cywgKGRhdGEpIC0+XHJcblx0XHRjb25zb2xlLmxvZyBkYXRhXHJcblx0XHRkYXRhLnJlc3BvbnNlID0gZGF0YS5yZXNwb25zZSB8fCB7fVxyXG5cdFx0aWYgZGF0YS5yZXNwb25zZS5wb3N0X2lkXHJcblx0XHRcdCPQvtC/0YPQsdC70LjQutC+0LLQsNC9XHJcblx0XHRcdHN1Y2Nlc3MoKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHQj0L7RiNC40LHQutCwXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5pbnZpdGVGcmllbmRzID0gKCkgLT5cclxuXHRWSy5jYWxsTWV0aG9kIFwic2hvd0ludml0ZUJveFwiIiwidmsgPSByZXF1aXJlICcuL3Rvb2xzL3ZrLmNvZmZlZSdcclxucmVxdWVzdCA9IHJlcXVpcmUgJy4vcmVxdWVzdCdcclxucG9wdXBzID0gcmVxdWlyZSAnLi9wb3B1cHMnXHJcbmd1c3NlZFRlbXBsYXRlID0gcmVxdWlyZSAnLi4vLi4vamFkZS93aGF0R3Vzc2VkLmphZGUnXHJcbm5vdEd1c3NlZFRlbXBsYXRlID0gcmVxdWlyZSAnLi4vLi4vamFkZS93aGF0Tm90R3Vzc2VkLmphZGUnXHJcblxyXG52ay5pbml0IC0+XHJcblx0dmsucmVzaXplIDg5MFxyXG5cdCN2ay5yZXNpemUgMTE0NVxyXG5cdGhlYWRlciA9IHJlcXVpcmUoJy4vaGVhZGVyJylcclxuXHJcbmNsb3NlRXJyb3IgPSAtPlxyXG5cdGlmKCAkKCcud29yZF9faW5wdXQtd3JhcCcpLmhhc0NsYXNzKCdlcnJvcicpIClcclxuXHRcdCQoJy53b3JkX19pbnB1dC13cmFwJykucmVtb3ZlQ2xhc3MoJ2Vycm9yJylcclxuXHJcbmFkZEVycm9yID0gLT5cclxuXHQkKCcud29yZF9faW5wdXQtd3JhcCcpLmFkZENsYXNzKCdlcnJvcicpXHJcblxyXG5mb3JtRW5hYmxlZCA9IC0+XHJcblx0cmVxdWVzdC50YXN0ZS5pc0VuYWJsZWQge30sIChyZXMpLT5cclxuXHRcdGlmKHJlcy5yZXN1bHQpXHJcblx0XHRcdCQoXCIud29yZF9fZm9ybS13cmFwXCIpLmh0bWwobm90R3Vzc2VkVGVtcGxhdGUpXHJcblx0XHRcdCQoJy53b3JkX19mb3JtLWlucHV0JykuZm9jdXMoKVxyXG5cdFx0XHR2ay5yZXNpemUgMTQwMFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHQkKFwiLndvcmRfX2Zvcm0td3JhcFwiKS5odG1sKGd1c3NlZFRlbXBsYXRlKVxyXG5cdFx0XHR2ay5yZXNpemUgMTE0NVxyXG5cclxuaXNXb3JkID0gLT5cclxuXHR3b3JkID0gJCgnLndvcmRfX2Zvcm0taW5wdXQnKS52YWwoKVxyXG5cdGlmKCF3b3JkKVxyXG5cdFx0YWRkRXJyb3IoKVxyXG5cdFx0JCgnLndvcmRfX2Zvcm0taW5wdXQnKS5mb2N1cygpXHJcblx0XHRyZXR1cm5cclxuXHRyZXF1ZXN0LnRhc3RlLmNoZWNrIHt3b3JkOiB3b3JkfSwgKHJlcyktPlxyXG5cdFx0aWYoIHJlcy5yZXN1bHQgKVxyXG5cdFx0XHRwb3B1cHMub3Blbk1vZGFsIFwibmV3dGFzdGVcIlxyXG5cdFx0XHRmb3JtRW5hYmxlZCgpXHJcblx0XHRlbHNlXHJcblx0XHRcdGFkZEVycm9yKClcclxuXHRcdFx0JCgnLndvcmRfX2Zvcm0taW5wdXQnKS5mb2N1cygpXHJcblxyXG4jZm9ybUVuYWJsZWQoKVxyXG5cclxuIyQoJ2JvZHknKS5vbiAnY2xpY2snLCAnLmpzLW9wZW5UYXN0ZScsIC0+XHJcbiNcdGlzV29yZCgpXHJcbiNcclxuIyQoJ2JvZHknKS5vbiAnY2xpY2snLCAnLmVycm9yLWNsb3NlJywgLT5cclxuI1x0JCgnLndvcmRfX2Zvcm0taW5wdXQnKS52YWwoJycpXHJcbiNcdCQoJy53b3JkX19mb3JtLWlucHV0JykuZm9jdXMoKVxyXG4jXHRjbG9zZUVycm9yKClcclxuI1xyXG4jJCgnYm9keScpLm9uICdrZXlkb3duJywgJy53b3JkX19mb3JtLWlucHV0JywgLT5cclxuI1x0Y2xvc2VFcnJvcigpXHJcblxyXG5cclxuXHJcblxyXG5cclxuIl19
