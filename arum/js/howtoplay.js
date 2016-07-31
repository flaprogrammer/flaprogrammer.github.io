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
;var locals_for_with = (locals || {});(function (faq, undefined) {
var shortify2 = function(str) {
if (str.length>30) return str.substr(0,30)+"...";
return str
}
buf.push("<div class=\"ht__subtitle\">Возможно, его уже задавали. Проверь здесь:</div><div class=\"ht__question-wrapper\"><select class=\"ht__question\">");
// iterate faq
;(function(){
  var $$obj = faq;
  if ('number' == typeof $$obj.length) {

    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
      var el = $$obj[index];

buf.push("<option" + (jade.attr("data-num", index, true, false)) + ">" + (jade.escape((jade_interp = shortify2(el.question)) == null ? '' : jade_interp)) + "</option>");
    }

  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;      var el = $$obj[index];

buf.push("<option" + (jade.attr("data-num", index, true, false)) + ">" + (jade.escape((jade_interp = shortify2(el.question)) == null ? '' : jade_interp)) + "</option>");
    }

  }
}).call(this);

buf.push("</select></div><div class=\"ht__question-text-wrapper\"><div class=\"ht__question-text\">" + (jade.escape((jade_interp = faq[0].question) == null ? '' : jade_interp)) + "</div></div><div class=\"ht__answer\">" + (jade.escape((jade_interp = faq[0].answer) == null ? '' : jade_interp)) + "</div>");}.call(this,"faq" in locals_for_with?locals_for_with.faq:typeof faq!=="undefined"?faq:undefined,"undefined" in locals_for_with?locals_for_with.undefined:typeof undefined!=="undefined"?undefined:undefined));;return buf.join("");
};
},{"jade/runtime":2}],4:[function(require,module,exports){
var data, links, request, template;

request = require('../request');

links = require('../tools/links');

template = require("./faq.jade");

data = [];

request.faq.get({}, function(res) {
  data = res;
  $(".ht__faqloading").html(template({
    "faq": res
  }));
  $('.ht__question').customSelect();
  return $('.ht__question').on("change", function(e) {
    var index;
    index = $(this).context.selectedIndex;
    $('.ht__answer').text(data[index].answer);
    return $('.ht__question-text').text(data[index].question);
  });
});


},{"../request":40,"../tools/links":44,"./faq.jade":3}],5:[function(require,module,exports){
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


},{"../popups":15,"../request":40,"../tools/anal.coffee":42,"../tools/links.coffee":44,"./header__profile.jade":5,"./messenger__icon.jade":7}],7:[function(require,module,exports){
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
var anal, faq, header, popups, request, vk;

popups = require('./popups');

header = require('./header');

request = require('./request');

anal = require('./tools/anal.coffee');

faq = require('./faq');

vk = require('./tools/vk.coffee');

vk.init(function() {
  return vk.resize(1520);
});

$('.js-FullRules').on('click', function() {
  return anal.send("Правила_ПолныеПравила");
});

$('.js-openUserInfo').on('click', function() {
  popups.openModal("userinfo");
  return anal.send('Правила_Анкета');
});

$('.ht__send-form').on("submit", function(e) {
  var question, sendObj, title;
  e.preventDefault();
  title = $('.ht__send-theme').val();
  question = $('.ht__send-text').val();
  sendObj = {
    title: title,
    question: question
  };
  return request.feedback.add(sendObj, function(res) {
    return $('.ht__send').addClass('ht__send--ok');
  });
});


},{"./faq":4,"./header":6,"./popups":15,"./request":40,"./tools/anal.coffee":42,"./tools/vk.coffee":46}],9:[function(require,module,exports){
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


},{"../request":40,"../tools/achvData.coffee":41,"../tools/vk.coffee":46,"./achieve.jade":10}],10:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (info) {
buf.push("<div" + (jade.attr("data-id", "" + (info.id) + "", true, false)) + " class=\"achieve\"><div class=\"achieve__icon-wrapper\"><img" + (jade.attr("src", "" + (info.icon) + "", true, false)) + " class=\"achieve__icon\"/></div><div class=\"achieve__title\">" + (jade.escape((jade_interp = info.title) == null ? '' : jade_interp)) + "</div><div class=\"achieve__text\">" + (jade.escape((jade_interp = info.text) == null ? '' : jade_interp)) + "</div><div class=\"achieve__but-wrapper\"><div class=\"achieve__but but js-shareAchv\">Поделиться</div></div></div>");}.call(this,"info" in locals_for_with?locals_for_with.info:typeof info!=="undefined"?info:undefined));;return buf.join("");
};
},{"jade/runtime":2}],11:[function(require,module,exports){
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


},{"../request":40,"./checkpoint.jade":12}],12:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (info) {
buf.push("<div class=\"chpopup\"><div" + (jade.attr("style", "background-image: url('" + (info.image_hint) + "')", true, false)) + " class=\"chpopup__header\"><div class=\"chpopup__ura\"><span class=\"chpopup__whiteback\">Ура! Ты открыл</span></div><div class=\"chpopup__title\"><span class=\"chpopup__whiteback\">" + (jade.escape((jade_interp = info.title) == null ? '' : jade_interp)) + "</span></div><div class=\"chpopup__desc\"><span class=\"chpopup__whiteback\">" + (jade.escape((jade_interp = info.description) == null ? '' : jade_interp)) + "</span></div></div><div class=\"chpopup__main\"><div class=\"chpopup__next\">Следующий пункт</div><div class=\"chpopup__hint\">" + (jade.escape((jade_interp = info.hint) == null ? '' : jade_interp)) + "</div><div class=\"chpopup__but but but--low js-closePopup\">Искать</div></div></div>");}.call(this,"info" in locals_for_with?locals_for_with.info:typeof info!=="undefined"?info:undefined));;return buf.join("");
};
},{"jade/runtime":2}],13:[function(require,module,exports){
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


},{"../request":40,"./gameenter.jade":14}],14:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (info) {
buf.push("<div class=\"chpopup\"><div" + (jade.attr("style", "background-image: url('" + (info.image_hint) + "')", true, false)) + " class=\"chpopup__header\"><div class=\"chpopup__title\"><span class=\"chpopup__whiteback\">" + (jade.escape((jade_interp = info.title) == null ? '' : jade_interp)) + "</span></div><div class=\"chpopup__desc\"><span class=\"chpopup__whiteback\">" + (jade.escape((jade_interp = info.description) == null ? '' : jade_interp)) + "</span></div></div><div class=\"chpopup__main\"><div class=\"chpopup__next\">Следующий пункт</div><div class=\"chpopup__hint\">" + (jade.escape((jade_interp = info.hint) == null ? '' : jade_interp)) + "</div><div class=\"chpopup__but but but--low js-closePopup\">Искать</div></div></div>");}.call(this,"info" in locals_for_with?locals_for_with.info:typeof info!=="undefined"?info:undefined));;return buf.join("");
};
},{"jade/runtime":2}],15:[function(require,module,exports){
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


},{"./achieve.coffee":9,"./checkpoint.coffee":11,"./gameenter.coffee":13,"./index.jade":16,"./intro.coffee":17,"./invite.coffee":19,"./messenger/messenger.coffee":21,"./money.coffee":25,"./myprizes.coffee":28,"./newtaste.coffee":30,"./pizza.coffee":32,"./rating.coffee":36,"./userinfo.coffee":38}],16:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (curID) {
buf.push("<div" + (jade.attr("data-id", "" + (curID) + "", true, false)) + (jade.attr("style", "z-index:" + (curID+10) + "", true, false)) + " class=\"popup__shade\"><div class=\"popup\"><i class=\"icon-popup-cross popup__cross\"></i><div class=\"popup__forloading\"></div></div></div>");}.call(this,"curID" in locals_for_with?locals_for_with.curID:typeof curID!=="undefined"?curID:undefined));;return buf.join("");
};
},{"jade/runtime":2}],17:[function(require,module,exports){
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


},{"./intro.jade":18}],18:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"popup__wrap--intro\"><iframe class=\"intro__video\" width=\"588\" height=\"360\" src=\"https://www.youtube.com/embed/uw08j-yOfcE\" frameborder=\"0\"></iframe><div class=\"intro__skipvideo\">Пропустить</div></div>");;return buf.join("");
};
},{"jade/runtime":2}],19:[function(require,module,exports){
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


},{"./invite.jade":20}],20:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"popup__wrap--invite\"><h3 class=\"invite__title\">Выбери друзей,<br>которых хочешь пригласить</h3><div class=\"invite__inputwrapper\"><input type=\"text\" placeholder=\"Введи имя\" class=\"invite__input\"/></div><div class=\"invite__list\"><div class=\"leaders__el invite__el invite__el--invited\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Вячеслав<br>Вячеславович</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Вячеслав<br>Вячеславович</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Вячеслав<br>Вячеславович</div></div></div><div class=\"leaders__el invite__el invite__el--invited\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el invite__el--invited\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el invite__el--invited\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Николай<br>Николаевич</div></div></div><div class=\"leaders__el invite__el invite__el--invited\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el invite__el--invited\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div><div class=\"leaders__el invite__el\"><img src=\"http://www.spletnik.ru/img/2011/04/arina/20110401-robertd-anons.jpg\" class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">Никнейм</div></div></div></div></div>");;return buf.join("");
};
},{"jade/runtime":2}],21:[function(require,module,exports){
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


},{"../../header/messenger__icon.jade":7,"../../request/index":40,"./messenger.jade":22,"./notification.jade":23,"./question.jade":24}],22:[function(require,module,exports){
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
},{"jade/runtime":2}],23:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (info) {
buf.push("<div class=\"messenger__mes-val\">" + (jade.escape((jade_interp = info.answer) == null ? '' : jade_interp)) + "</div>");}.call(this,"info" in locals_for_with?locals_for_with.info:typeof info!=="undefined"?info:undefined));;return buf.join("");
};
},{"jade/runtime":2}],24:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (info) {
buf.push("<div class=\"messenger__mes-title\">Вопрос:</div><div class=\"messenger__mes-val\">" + (jade.escape((jade_interp = info.question) == null ? '' : jade_interp)) + "</div><div class=\"messenger__mes-title\">Ответ:</div><div class=\"messenger__mes-val\">" + (jade.escape((jade_interp = info.answer) == null ? '' : jade_interp)) + "</div>");}.call(this,"info" in locals_for_with?locals_for_with.info:typeof info!=="undefined"?info:undefined));;return buf.join("");
};
},{"jade/runtime":2}],25:[function(require,module,exports){
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


},{"../request":40,"./money_fail.jade":26,"./money_ok.jade":27}],26:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"popup__wrap--intro\"><div class=\"chpopup__moneymes\"><p>Ты был очень близок к этому призу, но кто-то оказался на долю секунды быстрее (</p><p>Не отчаивайся! Завтра мы разыграем еще 500 рублей, потом еще и еще – и так каждый день без выходных. Тебе наверняка повезет! Спасибо, играй с нами еще!</p></div></div>");;return buf.join("");
};
},{"jade/runtime":2}],27:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"popup__wrap--intro\"><div class=\"chpopup__moneymes\"><p>Поздравляем, ты первым нашел сегодняшние призовые деньги на телефон! Красавчик!</p><p>Если твоя анкета заполнена – деньги скоро упадут на счет твоего мобильного. Если нет – заполни ее, не откладывая. Спасибо, играй с нами еще!</p></div></div>");;return buf.join("");
};
},{"jade/runtime":2}],28:[function(require,module,exports){
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


},{"../request":40,"./myprizes.jade":29}],29:[function(require,module,exports){
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
},{"jade/runtime":2}],30:[function(require,module,exports){
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


},{"../request":40,"./index.coffee":15,"./newtaste.jade":31}],31:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"taste__wrap\"><h2 class=\"taste__title\">Именно!</h2><div class=\"taste__body\"><div class=\"taste__body-text\"><p>Начисляем тебе 200 баллов.</p><p>Не забудь попробовать</p><P>Новый Tuc!</P></div><div class=\"taste__body-img\"><img src=\"img/images/tuc-200.png\"/></div></div></div>");;return buf.join("");
};
},{"jade/runtime":2}],32:[function(require,module,exports){
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


},{"../request":40,"./pizza.jade":33}],33:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"chpopup\"><div class=\"chpopup__pizza-title\">+50 баллов!</div><div class=\"chpopup__pizza-desc\">Поздравляем, ты нашел новый TUC Пицца!\nА теперь попробуй найти его по-настоящему в магазинах своего города!</div><div class=\"chpopup__pizza-desc2\">Удачи и приятного аппетита!</div></div>");;return buf.join("");
};
},{"jade/runtime":2}],34:[function(require,module,exports){
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
},{"jade/runtime":2}],35:[function(require,module,exports){
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
},{"jade/runtime":2}],36:[function(require,module,exports){
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


},{"../request":40,"./rating-list.jade":34,"./rating-pagination.jade":35,"./rating.jade":37}],37:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (res) {
buf.push("<div class=\"popup__wrap--intro\"><div class=\"popleaders\"><div class=\"popleaders__left\"><h3 class=\"popleaders__title\">Рейтинг игры</h3><div class=\"leaders__switcher_wrapper\"><div class=\"leaders__switcher\"><div data-href=\".popleaders__cat--current\" class=\"leaders__switchbut leaders__switchcurrent\">Текущий</div><div data-href=\".popleaders__cat--common\" class=\"leaders__switchbut leaders__switchbut--active leaders__switchcommon\">Общий</div></div></div></div><div class=\"popleaders__right\"><div data-type=\"common\" class=\"popleaders__common popleaders__tab popleader__active\"><div class=\"popleaders__list\"><div class=\"popleaders__cat\"></div></div><div class=\"leaders__el\"><div class=\"leaders__counter\">" + (jade.escape((jade_interp = res.common.you.place) == null ? '' : jade_interp)) + "</div><img" + (jade.attr("src", "" + (res.common.you.photo) + "", true, false)) + " class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">" + (jade.escape((jade_interp = res.common.you.nickname) == null ? '' : jade_interp)) + "</div></div></div><div class=\"popleaders__pagination\"></div></div><div data-type=\"current\" class=\"popleaders__current popleaders__tab\"><div class=\"popleaders__list\"><div class=\"popleaders__cat\"></div></div><div class=\"leaders__el\"><div class=\"leaders__counter\">" + (jade.escape((jade_interp = res.current.you.place) == null ? '' : jade_interp)) + "</div><img" + (jade.attr("src", "" + (res.current.you.photo) + "", true, false)) + " class=\"leaders__photo\"/><div class=\"leaders__right\"><div class=\"leaders__name\">" + (jade.escape((jade_interp = res.current.you.nickname) == null ? '' : jade_interp)) + "</div></div></div><div class=\"popleaders__pagination\"></div></div></div></div></div>");}.call(this,"res" in locals_for_with?locals_for_with.res:typeof res!=="undefined"?res:undefined));;return buf.join("");
};
},{"jade/runtime":2}],38:[function(require,module,exports){
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


},{"../request":40,"./index.coffee":15,"./userinfo.jade":39}],39:[function(require,module,exports){
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
},{"jade/runtime":2}],40:[function(require,module,exports){
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


},{"../tools/keys.coffee":43}],41:[function(require,module,exports){
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


},{}],42:[function(require,module,exports){
module.exports.send = function(event_name) {
  return ga('send', {
    hitType: 'event',
    eventCategory: 'events',
    eventAction: event_name
  });
};


},{}],43:[function(require,module,exports){
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


},{"./md5.coffee":45}],44:[function(require,module,exports){
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


},{"./keys":43}],45:[function(require,module,exports){
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


},{}],46:[function(require,module,exports){
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


},{"../request":40}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2phZGUvcnVudGltZS5qcyIsInNyYy9qcy9zY3JpcHQvZmFxL2ZhcS5qYWRlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXGZhcVxcaW5kZXguY29mZmVlIiwic3JjL2pzL3NjcmlwdC9oZWFkZXIvaGVhZGVyX19wcm9maWxlLmphZGUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxcaGVhZGVyXFxpbmRleC5jb2ZmZWUiLCJzcmMvanMvc2NyaXB0L2hlYWRlci9tZXNzZW5nZXJfX2ljb24uamFkZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFxob3d0b3BsYXkuY29mZmVlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXHBvcHVwc1xcYWNoaWV2ZS5jb2ZmZWUiLCJzcmMvanMvc2NyaXB0L3BvcHVwcy9hY2hpZXZlLmphZGUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxccG9wdXBzXFxjaGVja3BvaW50LmNvZmZlZSIsInNyYy9qcy9zY3JpcHQvcG9wdXBzL2NoZWNrcG9pbnQuamFkZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFxwb3B1cHNcXGdhbWVlbnRlci5jb2ZmZWUiLCJzcmMvanMvc2NyaXB0L3BvcHVwcy9nYW1lZW50ZXIuamFkZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFxwb3B1cHNcXGluZGV4LmNvZmZlZSIsInNyYy9qcy9zY3JpcHQvcG9wdXBzL2luZGV4LmphZGUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxccG9wdXBzXFxpbnRyby5jb2ZmZWUiLCJzcmMvanMvc2NyaXB0L3BvcHVwcy9pbnRyby5qYWRlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXHBvcHVwc1xcaW52aXRlLmNvZmZlZSIsInNyYy9qcy9zY3JpcHQvcG9wdXBzL2ludml0ZS5qYWRlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXHBvcHVwc1xcbWVzc2VuZ2VyXFxtZXNzZW5nZXIuY29mZmVlIiwic3JjL2pzL3NjcmlwdC9wb3B1cHMvbWVzc2VuZ2VyL21lc3Nlbmdlci5qYWRlIiwic3JjL2pzL3NjcmlwdC9wb3B1cHMvbWVzc2VuZ2VyL25vdGlmaWNhdGlvbi5qYWRlIiwic3JjL2pzL3NjcmlwdC9wb3B1cHMvbWVzc2VuZ2VyL3F1ZXN0aW9uLmphZGUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxccG9wdXBzXFxtb25leS5jb2ZmZWUiLCJzcmMvanMvc2NyaXB0L3BvcHVwcy9tb25leV9mYWlsLmphZGUiLCJzcmMvanMvc2NyaXB0L3BvcHVwcy9tb25leV9vay5qYWRlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXHBvcHVwc1xcbXlwcml6ZXMuY29mZmVlIiwic3JjL2pzL3NjcmlwdC9wb3B1cHMvbXlwcml6ZXMuamFkZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFxwb3B1cHNcXG5ld3Rhc3RlLmNvZmZlZSIsInNyYy9qcy9zY3JpcHQvcG9wdXBzL25ld3Rhc3RlLmphZGUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxccG9wdXBzXFxwaXp6YS5jb2ZmZWUiLCJzcmMvanMvc2NyaXB0L3BvcHVwcy9waXp6YS5qYWRlIiwic3JjL2pzL3NjcmlwdC9wb3B1cHMvcmF0aW5nLWxpc3QuamFkZSIsInNyYy9qcy9zY3JpcHQvcG9wdXBzL3JhdGluZy1wYWdpbmF0aW9uLmphZGUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxccG9wdXBzXFxyYXRpbmcuY29mZmVlIiwic3JjL2pzL3NjcmlwdC9wb3B1cHMvcmF0aW5nLmphZGUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxccG9wdXBzXFx1c2VyaW5mby5jb2ZmZWUiLCJzcmMvanMvc2NyaXB0L3BvcHVwcy91c2VyaW5mby5qYWRlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXHJlcXVlc3RcXGluZGV4LmNvZmZlZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFx0b29sc1xcYWNodkRhdGEuY29mZmVlIiwiQzpcXGRldmVsb3BtZW50XFxhcnVtXFxzcmNcXGpzXFxzY3JpcHRcXHRvb2xzXFxhbmFsLmNvZmZlZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFx0b29sc1xca2V5cy5jb2ZmZWUiLCJDOlxcZGV2ZWxvcG1lbnRcXGFydW1cXHNyY1xcanNcXHNjcmlwdFxcdG9vbHNcXGxpbmtzLmNvZmZlZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFx0b29sc1xcbWQ1LmNvZmZlZSIsIkM6XFxkZXZlbG9wbWVudFxcYXJ1bVxcc3JjXFxqc1xcc2NyaXB0XFx0b29sc1xcdmsuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFPLENBQUMsYUFBZixHQUErQixTQUFBO1NBQzlCLEVBQUUsQ0FBQyxVQUFILENBQWMsZUFBZDtBQUQ4QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIiLCIoZnVuY3Rpb24oZil7aWYodHlwZW9mIGV4cG9ydHM9PT1cIm9iamVjdFwiJiZ0eXBlb2YgbW9kdWxlIT09XCJ1bmRlZmluZWRcIil7bW9kdWxlLmV4cG9ydHM9ZigpfWVsc2UgaWYodHlwZW9mIGRlZmluZT09PVwiZnVuY3Rpb25cIiYmZGVmaW5lLmFtZCl7ZGVmaW5lKFtdLGYpfWVsc2V7dmFyIGc7aWYodHlwZW9mIHdpbmRvdyE9PVwidW5kZWZpbmVkXCIpe2c9d2luZG93fWVsc2UgaWYodHlwZW9mIGdsb2JhbCE9PVwidW5kZWZpbmVkXCIpe2c9Z2xvYmFsfWVsc2UgaWYodHlwZW9mIHNlbGYhPT1cInVuZGVmaW5lZFwiKXtnPXNlbGZ9ZWxzZXtnPXRoaXN9Zy5qYWRlID0gZigpfX0pKGZ1bmN0aW9uKCl7dmFyIGRlZmluZSxtb2R1bGUsZXhwb3J0cztyZXR1cm4gKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkoezE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIE1lcmdlIHR3byBhdHRyaWJ1dGUgb2JqZWN0cyBnaXZpbmcgcHJlY2VkZW5jZVxuICogdG8gdmFsdWVzIGluIG9iamVjdCBgYmAuIENsYXNzZXMgYXJlIHNwZWNpYWwtY2FzZWRcbiAqIGFsbG93aW5nIGZvciBhcnJheXMgYW5kIG1lcmdpbmcvam9pbmluZyBhcHByb3ByaWF0ZWx5XG4gKiByZXN1bHRpbmcgaW4gYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBiXG4gKiBAcmV0dXJuIHtPYmplY3R9IGFcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMubWVyZ2UgPSBmdW5jdGlvbiBtZXJnZShhLCBiKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgdmFyIGF0dHJzID0gYVswXTtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGF0dHJzID0gbWVyZ2UoYXR0cnMsIGFbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cnM7XG4gIH1cbiAgdmFyIGFjID0gYVsnY2xhc3MnXTtcbiAgdmFyIGJjID0gYlsnY2xhc3MnXTtcblxuICBpZiAoYWMgfHwgYmMpIHtcbiAgICBhYyA9IGFjIHx8IFtdO1xuICAgIGJjID0gYmMgfHwgW107XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFjKSkgYWMgPSBbYWNdO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShiYykpIGJjID0gW2JjXTtcbiAgICBhWydjbGFzcyddID0gYWMuY29uY2F0KGJjKS5maWx0ZXIobnVsbHMpO1xuICB9XG5cbiAgZm9yICh2YXIga2V5IGluIGIpIHtcbiAgICBpZiAoa2V5ICE9ICdjbGFzcycpIHtcbiAgICAgIGFba2V5XSA9IGJba2V5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYTtcbn07XG5cbi8qKlxuICogRmlsdGVyIG51bGwgYHZhbGBzLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbnVsbHModmFsKSB7XG4gIHJldHVybiB2YWwgIT0gbnVsbCAmJiB2YWwgIT09ICcnO1xufVxuXG4vKipcbiAqIGpvaW4gYXJyYXkgYXMgY2xhc3Nlcy5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnRzLmpvaW5DbGFzc2VzID0gam9pbkNsYXNzZXM7XG5mdW5jdGlvbiBqb2luQ2xhc3Nlcyh2YWwpIHtcbiAgcmV0dXJuIChBcnJheS5pc0FycmF5KHZhbCkgPyB2YWwubWFwKGpvaW5DbGFzc2VzKSA6XG4gICAgKHZhbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0JykgPyBPYmplY3Qua2V5cyh2YWwpLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7IHJldHVybiB2YWxba2V5XTsgfSkgOlxuICAgIFt2YWxdKS5maWx0ZXIobnVsbHMpLmpvaW4oJyAnKTtcbn1cblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGNsYXNzZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gY2xhc3Nlc1xuICogQHBhcmFtIHtBcnJheS48Qm9vbGVhbj59IGVzY2FwZWRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5jbHMgPSBmdW5jdGlvbiBjbHMoY2xhc3NlcywgZXNjYXBlZCkge1xuICB2YXIgYnVmID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChlc2NhcGVkICYmIGVzY2FwZWRbaV0pIHtcbiAgICAgIGJ1Zi5wdXNoKGV4cG9ydHMuZXNjYXBlKGpvaW5DbGFzc2VzKFtjbGFzc2VzW2ldXSkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnVmLnB1c2goam9pbkNsYXNzZXMoY2xhc3Nlc1tpXSkpO1xuICAgIH1cbiAgfVxuICB2YXIgdGV4dCA9IGpvaW5DbGFzc2VzKGJ1Zik7XG4gIGlmICh0ZXh0Lmxlbmd0aCkge1xuICAgIHJldHVybiAnIGNsYXNzPVwiJyArIHRleHQgKyAnXCInO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnJztcbiAgfVxufTtcblxuXG5leHBvcnRzLnN0eWxlID0gZnVuY3Rpb24gKHZhbCkge1xuICBpZiAodmFsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHZhbCkubWFwKGZ1bmN0aW9uIChzdHlsZSkge1xuICAgICAgcmV0dXJuIHN0eWxlICsgJzonICsgdmFsW3N0eWxlXTtcbiAgICB9KS5qb2luKCc7Jyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxufTtcbi8qKlxuICogUmVuZGVyIHRoZSBnaXZlbiBhdHRyaWJ1dGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHBhcmFtIHtCb29sZWFufSBlc2NhcGVkXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHRlcnNlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydHMuYXR0ciA9IGZ1bmN0aW9uIGF0dHIoa2V5LCB2YWwsIGVzY2FwZWQsIHRlcnNlKSB7XG4gIGlmIChrZXkgPT09ICdzdHlsZScpIHtcbiAgICB2YWwgPSBleHBvcnRzLnN0eWxlKHZhbCk7XG4gIH1cbiAgaWYgKCdib29sZWFuJyA9PSB0eXBlb2YgdmFsIHx8IG51bGwgPT0gdmFsKSB7XG4gICAgaWYgKHZhbCkge1xuICAgICAgcmV0dXJuICcgJyArICh0ZXJzZSA/IGtleSA6IGtleSArICc9XCInICsga2V5ICsgJ1wiJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH0gZWxzZSBpZiAoMCA9PSBrZXkuaW5kZXhPZignZGF0YScpICYmICdzdHJpbmcnICE9IHR5cGVvZiB2YWwpIHtcbiAgICBpZiAoSlNPTi5zdHJpbmdpZnkodmFsKS5pbmRleE9mKCcmJykgIT09IC0xKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1NpbmNlIEphZGUgMi4wLjAsIGFtcGVyc2FuZHMgKGAmYCkgaW4gZGF0YSBhdHRyaWJ1dGVzICcgK1xuICAgICAgICAgICAgICAgICAgICd3aWxsIGJlIGVzY2FwZWQgdG8gYCZhbXA7YCcpO1xuICAgIH07XG4gICAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsLnRvSVNPU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0phZGUgd2lsbCBlbGltaW5hdGUgdGhlIGRvdWJsZSBxdW90ZXMgYXJvdW5kIGRhdGVzIGluICcgK1xuICAgICAgICAgICAgICAgICAgICdJU08gZm9ybSBhZnRlciAyLjAuMCcpO1xuICAgIH1cbiAgICByZXR1cm4gJyAnICsga2V5ICsgXCI9J1wiICsgSlNPTi5zdHJpbmdpZnkodmFsKS5yZXBsYWNlKC8nL2csICcmYXBvczsnKSArIFwiJ1wiO1xuICB9IGVsc2UgaWYgKGVzY2FwZWQpIHtcbiAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwudG9JU09TdHJpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUud2FybignSmFkZSB3aWxsIHN0cmluZ2lmeSBkYXRlcyBpbiBJU08gZm9ybSBhZnRlciAyLjAuMCcpO1xuICAgIH1cbiAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cIicgKyBleHBvcnRzLmVzY2FwZSh2YWwpICsgJ1wiJztcbiAgfSBlbHNlIHtcbiAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwudG9JU09TdHJpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnNvbGUud2FybignSmFkZSB3aWxsIHN0cmluZ2lmeSBkYXRlcyBpbiBJU08gZm9ybSBhZnRlciAyLjAuMCcpO1xuICAgIH1cbiAgICByZXR1cm4gJyAnICsga2V5ICsgJz1cIicgKyB2YWwgKyAnXCInO1xuICB9XG59O1xuXG4vKipcbiAqIFJlbmRlciB0aGUgZ2l2ZW4gYXR0cmlidXRlcyBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtPYmplY3R9IGVzY2FwZWRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5hdHRycyA9IGZ1bmN0aW9uIGF0dHJzKG9iaiwgdGVyc2Upe1xuICB2YXIgYnVmID0gW107XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuXG4gIGlmIChrZXlzLmxlbmd0aCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV1cbiAgICAgICAgLCB2YWwgPSBvYmpba2V5XTtcblxuICAgICAgaWYgKCdjbGFzcycgPT0ga2V5KSB7XG4gICAgICAgIGlmICh2YWwgPSBqb2luQ2xhc3Nlcyh2YWwpKSB7XG4gICAgICAgICAgYnVmLnB1c2goJyAnICsga2V5ICsgJz1cIicgKyB2YWwgKyAnXCInKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnVmLnB1c2goZXhwb3J0cy5hdHRyKGtleSwgdmFsLCBmYWxzZSwgdGVyc2UpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmLmpvaW4oJycpO1xufTtcblxuLyoqXG4gKiBFc2NhcGUgdGhlIGdpdmVuIHN0cmluZyBvZiBgaHRtbGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGh0bWxcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbnZhciBqYWRlX2VuY29kZV9odG1sX3J1bGVzID0ge1xuICAnJic6ICcmYW1wOycsXG4gICc8JzogJyZsdDsnLFxuICAnPic6ICcmZ3Q7JyxcbiAgJ1wiJzogJyZxdW90Oydcbn07XG52YXIgamFkZV9tYXRjaF9odG1sID0gL1smPD5cIl0vZztcblxuZnVuY3Rpb24gamFkZV9lbmNvZGVfY2hhcihjKSB7XG4gIHJldHVybiBqYWRlX2VuY29kZV9odG1sX3J1bGVzW2NdIHx8IGM7XG59XG5cbmV4cG9ydHMuZXNjYXBlID0gamFkZV9lc2NhcGU7XG5mdW5jdGlvbiBqYWRlX2VzY2FwZShodG1sKXtcbiAgdmFyIHJlc3VsdCA9IFN0cmluZyhodG1sKS5yZXBsYWNlKGphZGVfbWF0Y2hfaHRtbCwgamFkZV9lbmNvZGVfY2hhcik7XG4gIGlmIChyZXN1bHQgPT09ICcnICsgaHRtbCkgcmV0dXJuIGh0bWw7XG4gIGVsc2UgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogUmUtdGhyb3cgdGhlIGdpdmVuIGBlcnJgIGluIGNvbnRleHQgdG8gdGhlXG4gKiB0aGUgamFkZSBpbiBgZmlsZW5hbWVgIGF0IHRoZSBnaXZlbiBgbGluZW5vYC5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IGxpbmVub1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5yZXRocm93ID0gZnVuY3Rpb24gcmV0aHJvdyhlcnIsIGZpbGVuYW1lLCBsaW5lbm8sIHN0cil7XG4gIGlmICghKGVyciBpbnN0YW5jZW9mIEVycm9yKSkgdGhyb3cgZXJyO1xuICBpZiAoKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgfHwgIWZpbGVuYW1lKSAmJiAhc3RyKSB7XG4gICAgZXJyLm1lc3NhZ2UgKz0gJyBvbiBsaW5lICcgKyBsaW5lbm87XG4gICAgdGhyb3cgZXJyO1xuICB9XG4gIHRyeSB7XG4gICAgc3RyID0gc3RyIHx8IHJlcXVpcmUoJ2ZzJykucmVhZEZpbGVTeW5jKGZpbGVuYW1lLCAndXRmOCcpXG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgcmV0aHJvdyhlcnIsIG51bGwsIGxpbmVubylcbiAgfVxuICB2YXIgY29udGV4dCA9IDNcbiAgICAsIGxpbmVzID0gc3RyLnNwbGl0KCdcXG4nKVxuICAgICwgc3RhcnQgPSBNYXRoLm1heChsaW5lbm8gLSBjb250ZXh0LCAwKVxuICAgICwgZW5kID0gTWF0aC5taW4obGluZXMubGVuZ3RoLCBsaW5lbm8gKyBjb250ZXh0KTtcblxuICAvLyBFcnJvciBjb250ZXh0XG4gIHZhciBjb250ZXh0ID0gbGluZXMuc2xpY2Uoc3RhcnQsIGVuZCkubWFwKGZ1bmN0aW9uKGxpbmUsIGkpe1xuICAgIHZhciBjdXJyID0gaSArIHN0YXJ0ICsgMTtcbiAgICByZXR1cm4gKGN1cnIgPT0gbGluZW5vID8gJyAgPiAnIDogJyAgICAnKVxuICAgICAgKyBjdXJyXG4gICAgICArICd8ICdcbiAgICAgICsgbGluZTtcbiAgfSkuam9pbignXFxuJyk7XG5cbiAgLy8gQWx0ZXIgZXhjZXB0aW9uIG1lc3NhZ2VcbiAgZXJyLnBhdGggPSBmaWxlbmFtZTtcbiAgZXJyLm1lc3NhZ2UgPSAoZmlsZW5hbWUgfHwgJ0phZGUnKSArICc6JyArIGxpbmVub1xuICAgICsgJ1xcbicgKyBjb250ZXh0ICsgJ1xcblxcbicgKyBlcnIubWVzc2FnZTtcbiAgdGhyb3cgZXJyO1xufTtcblxuZXhwb3J0cy5EZWJ1Z0l0ZW0gPSBmdW5jdGlvbiBEZWJ1Z0l0ZW0obGluZW5vLCBmaWxlbmFtZSkge1xuICB0aGlzLmxpbmVubyA9IGxpbmVubztcbiAgdGhpcy5maWxlbmFtZSA9IGZpbGVuYW1lO1xufVxuXG59LHtcImZzXCI6Mn1dLDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXG59LHt9XX0se30sWzFdKSgxKVxufSk7IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoZmFxLCB1bmRlZmluZWQpIHtcbnZhciBzaG9ydGlmeTIgPSBmdW5jdGlvbihzdHIpIHtcbmlmIChzdHIubGVuZ3RoPjMwKSByZXR1cm4gc3RyLnN1YnN0cigwLDMwKStcIi4uLlwiO1xucmV0dXJuIHN0clxufVxuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJodF9fc3VidGl0bGVcXFwiPtCS0L7Qt9C80L7QttC90L4sINC10LPQviDRg9C20LUg0LfQsNC00LDQstCw0LvQuC4g0J/RgNC+0LLQtdGA0Ywg0LfQtNC10YHRjDo8L2Rpdj48ZGl2IGNsYXNzPVxcXCJodF9fcXVlc3Rpb24td3JhcHBlclxcXCI+PHNlbGVjdCBjbGFzcz1cXFwiaHRfX3F1ZXN0aW9uXFxcIj5cIik7XG4vLyBpdGVyYXRlIGZhcVxuOyhmdW5jdGlvbigpe1xuICB2YXIgJCRvYmogPSBmYXE7XG4gIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgJCRvYmoubGVuZ3RoKSB7XG5cbiAgICBmb3IgKHZhciBpbmRleCA9IDAsICQkbCA9ICQkb2JqLmxlbmd0aDsgaW5kZXggPCAkJGw7IGluZGV4KyspIHtcbiAgICAgIHZhciBlbCA9ICQkb2JqW2luZGV4XTtcblxuYnVmLnB1c2goXCI8b3B0aW9uXCIgKyAoamFkZS5hdHRyKFwiZGF0YS1udW1cIiwgaW5kZXgsIHRydWUsIGZhbHNlKSkgKyBcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBzaG9ydGlmeTIoZWwucXVlc3Rpb24pKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L29wdGlvbj5cIik7XG4gICAgfVxuXG4gIH0gZWxzZSB7XG4gICAgdmFyICQkbCA9IDA7XG4gICAgZm9yICh2YXIgaW5kZXggaW4gJCRvYmopIHtcbiAgICAgICQkbCsrOyAgICAgIHZhciBlbCA9ICQkb2JqW2luZGV4XTtcblxuYnVmLnB1c2goXCI8b3B0aW9uXCIgKyAoamFkZS5hdHRyKFwiZGF0YS1udW1cIiwgaW5kZXgsIHRydWUsIGZhbHNlKSkgKyBcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBzaG9ydGlmeTIoZWwucXVlc3Rpb24pKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L29wdGlvbj5cIik7XG4gICAgfVxuXG4gIH1cbn0pLmNhbGwodGhpcyk7XG5cbmJ1Zi5wdXNoKFwiPC9zZWxlY3Q+PC9kaXY+PGRpdiBjbGFzcz1cXFwiaHRfX3F1ZXN0aW9uLXRleHQtd3JhcHBlclxcXCI+PGRpdiBjbGFzcz1cXFwiaHRfX3F1ZXN0aW9uLXRleHRcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGZhcVswXS5xdWVzdGlvbikgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwiaHRfX2Fuc3dlclxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gZmFxWzBdLmFuc3dlcikgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+XCIpO30uY2FsbCh0aGlzLFwiZmFxXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5mYXE6dHlwZW9mIGZhcSE9PVwidW5kZWZpbmVkXCI/ZmFxOnVuZGVmaW5lZCxcInVuZGVmaW5lZFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudW5kZWZpbmVkOnR5cGVvZiB1bmRlZmluZWQhPT1cInVuZGVmaW5lZFwiP3VuZGVmaW5lZDp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJyZXF1ZXN0ID0gcmVxdWlyZSgnLi4vcmVxdWVzdCcpXHJcbmxpbmtzID0gcmVxdWlyZSgnLi4vdG9vbHMvbGlua3MnKVxyXG50ZW1wbGF0ZSA9IHJlcXVpcmUoXCIuL2ZhcS5qYWRlXCIpXHJcblxyXG5kYXRhID0gW11cclxuXHJcbnJlcXVlc3QuZmFxLmdldCB7fSwgKHJlcykgLT5cclxuXHRkYXRhID0gcmVzXHJcblx0JChcIi5odF9fZmFxbG9hZGluZ1wiKS5odG1sIHRlbXBsYXRlIHtcImZhcVwiIDpyZXMgfVxyXG5cdCQoJy5odF9fcXVlc3Rpb24nKS5jdXN0b21TZWxlY3QoKVxyXG5cdCQoJy5odF9fcXVlc3Rpb24nKS5vbiBcImNoYW5nZVwiLChlKSAtPlxyXG5cdFx0aW5kZXggPSAkKHRoaXMpLmNvbnRleHQuc2VsZWN0ZWRJbmRleFxyXG5cdFx0JCgnLmh0X19hbnN3ZXInKS50ZXh0KGRhdGFbaW5kZXhdLmFuc3dlcilcclxuXHRcdCQoJy5odF9fcXVlc3Rpb24tdGV4dCcpLnRleHQoZGF0YVtpbmRleF0ucXVlc3Rpb24pXHJcbiIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKHVzZXIpIHtcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwiaGVhZGVyX19wcm9maWxlX2xlZnRcXFwiPjxpbWdcIiArIChqYWRlLmF0dHIoXCJzcmNcIiwgXCJcIiArICh1c2VyLmluZm8ucGhvdG8pICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJoZWFkZXJfX3Byb2ZpbGVfcGhvdG9cXFwiLz48L2Rpdj48ZGl2IGNsYXNzPVxcXCJoZWFkZXJfX3Byb2ZpbGVfX3JpZ2h0XFxcIj48ZGl2IGNsYXNzPVxcXCJoZWFkZXJfX3Byb2ZpbGVfX25hbWVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IHVzZXIubmlja25hbWUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjxkaXYgY2xhc3M9XFxcImhlYWRlcl9fcHJvZmlsZV9fc2NvcmVzXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSArdXNlci5pbmZvLmN1cnJlbnRfc2NvcmUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIiAvIFwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9ICt1c2VyLmluZm8uY29tbW9uX3Njb3JlKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj48IS0taS5pY29uLWhlYWRlci1zaGFyZWJ1dC5oZWFkZXJfX3NoYXJlYnV0LS0+XCIpO30uY2FsbCh0aGlzLFwidXNlclwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudXNlcjp0eXBlb2YgdXNlciE9PVwidW5kZWZpbmVkXCI/dXNlcjp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJyZXF1ZXN0ID0gcmVxdWlyZSgnLi4vcmVxdWVzdCcpXHJcbnRlbXBsYXRlID0gcmVxdWlyZSgnLi9oZWFkZXJfX3Byb2ZpbGUuamFkZScpXHJcbm1lc19pY29uID0gcmVxdWlyZSgnLi9tZXNzZW5nZXJfX2ljb24uamFkZScpXHJcbmxpbmtzID0gcmVxdWlyZSgnLi4vdG9vbHMvbGlua3MuY29mZmVlJykuaW5pdCgpXHJcbnBvcHVwcyA9IHJlcXVpcmUgJy4uL3BvcHVwcydcclxuYW5hbCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2FuYWwuY29mZmVlJ1xyXG5cclxuJCgnYm9keScpLm9uICdjbGljaycsICcuanMtb3BlblVzZXJJbmZvJywgLT5cclxuXHRwb3B1cHMub3Blbk1vZGFsKFwidXNlcmluZm9cIilcclxuXHRhbmFsLnNlbmQoJ9Cb0Jpf0JvQuNGH0L3Ri9C10LTQsNC90L3Ri9C1JylcclxuJCgnYm9keScpLm9uICdjbGljaycsICcuanMtb3Blbk1haWwnLCAtPlxyXG5cdHBvcHVwcy5vcGVuTW9kYWwgXCJtZXNzZW5nZXJcIlxyXG5cdGFuYWwuc2VuZChcItCb0Jpf0KHQvtC+0LHRidC10L3QuNC1XCIpXHJcblxyXG4kKCcuanMtb3BlblF1ZXN0c1BhZ2UnKS5vbiAnY2xpY2snLCAtPlxyXG5cdGFuYWwuc2VuZChcItCc0LXQvdGOX9Ca0LLQtdGB0YLRi1wiKVxyXG5cclxuJCgnLmpzLW9wZW5Qcml6ZXNQYWdlJykub24gJ2NsaWNrJywgLT5cclxuXHRhbmFsLnNlbmQoXCLQnNC10L3Rjl/Qn9GA0LjQt9GLXCIpXHJcblxyXG4kKCcuanMtb3BlblJ1bGVzUGFnZScpLm9uICdjbGljaycsIC0+XHJcblx0YW5hbC5zZW5kKFwi0JzQtdC90Y5f0J/RgNCw0LLQuNC70LBcIilcclxuXHJcbiQoJy5qcy1vcGVuV2hhdFBhZ2UnKS5vbiAnY2xpY2snLCAtPlxyXG5cdGFuYWwuc2VuZChcItCc0LXQvdGOX9Cn0YLQvtCX0LBUVUM/XCIpXHJcblxyXG5yZXF1ZXN0LnVzZXIuZ2V0IHt9LCAocmVzKSAtPlxyXG5cdGNvbnNvbGUubG9nIHJlc1xyXG5cdCQoXCIuaGVhZGVyX19wcm9maWxlXCIpLmh0bWwgdGVtcGxhdGUge3VzZXI6cmVzWzBdIH1cclxuXHRyZXF1ZXN0LmZlZWRiYWNrLmdldCB7fSwgKHJlcykgLT5cclxuXHRcdGNvbnNvbGUubG9nIHJlc1xyXG5cdFx0dW5yZWFkcyA9IHJlcy5yZWR1Y2UoKHN1bSxtZXMpID0+XHJcblx0XHRcdGlmIG1lcy5yZWFkPT0wIHRoZW4gcmV0dXJuIHN1bSsxXHJcblx0XHRcdGVsc2UgcmV0dXJuIHN1bVxyXG5cdFx0LDApXHJcblx0XHQkKCcubWVzc2VuZ2VyX19pY29uLWZvcmxvYWRpbmcnKS5odG1sIG1lc19pY29uKHt1bnJlYWRzOnVucmVhZHN9KSIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKHVucmVhZHMpIHtcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX19pY29uIGhlYWRlcl9fbWFpbGxvZ28ganMtb3Blbk1haWxcXFwiPjxpIGNsYXNzPVxcXCJpY29uLWhlYWRlci1tYWlsXFxcIj48L2k+XCIpO1xuaWYgKCB1bnJlYWRzPjApXG57XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fdW5yZWFkcy1pY29uXFxcIj48c3BhbiBjbGFzcz1cXFwibWVzc2VuZ2VyX191bnJlYWRzLXZhbFxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gdW5yZWFkcykgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9zcGFuPjwvZGl2PlwiKTtcbn1cbmJ1Zi5wdXNoKFwiPC9kaXY+XCIpO30uY2FsbCh0aGlzLFwidW5yZWFkc1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudW5yZWFkczp0eXBlb2YgdW5yZWFkcyE9PVwidW5kZWZpbmVkXCI/dW5yZWFkczp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJwb3B1cHMgPSByZXF1aXJlKCcuL3BvcHVwcycpXHJcbmhlYWRlciA9IHJlcXVpcmUoJy4vaGVhZGVyJylcclxucmVxdWVzdCA9IHJlcXVpcmUoJy4vcmVxdWVzdCcpXHJcbmFuYWwgPSByZXF1aXJlICcuL3Rvb2xzL2FuYWwuY29mZmVlJ1xyXG5cclxuZmFxID0gcmVxdWlyZSgnLi9mYXEnKVxyXG52ayA9IHJlcXVpcmUgJy4vdG9vbHMvdmsuY29mZmVlJ1xyXG52ay5pbml0IC0+XHJcblx0I3ZrLnJlc2l6ZSAxODUwXHJcblx0dmsucmVzaXplIDE1MjBcclxuXHJcbiQoJy5qcy1GdWxsUnVsZXMnKS5vbiAnY2xpY2snLCAtPlxyXG5cdGFuYWwuc2VuZChcItCf0YDQsNCy0LjQu9CwX9Cf0L7Qu9C90YvQtdCf0YDQsNCy0LjQu9CwXCIpXHJcblxyXG4kKCcuanMtb3BlblVzZXJJbmZvJykub24gJ2NsaWNrJywgLT5cclxuXHRwb3B1cHMub3Blbk1vZGFsKFwidXNlcmluZm9cIilcclxuXHRhbmFsLnNlbmQoJ9Cf0YDQsNCy0LjQu9CwX9CQ0L3QutC10YLQsCcpXHJcblxyXG4kKCcuaHRfX3NlbmQtZm9ybScpLm9uIFwic3VibWl0XCIsIChlKSAtPlxyXG5cdGUucHJldmVudERlZmF1bHQoKVxyXG5cdHRpdGxlID0gJCgnLmh0X19zZW5kLXRoZW1lJykudmFsKClcclxuXHRxdWVzdGlvbiA9ICQoJy5odF9fc2VuZC10ZXh0JykudmFsKClcclxuXHRzZW5kT2JqID0ge1xyXG5cdFx0dGl0bGU6IHRpdGxlXHJcblx0XHRxdWVzdGlvbjogcXVlc3Rpb25cclxuXHR9XHJcblx0cmVxdWVzdC5mZWVkYmFjay5hZGQgc2VuZE9iaiwgKHJlcykgLT5cclxuXHRcdCQoJy5odF9fc2VuZCcpLmFkZENsYXNzKCdodF9fc2VuZC0tb2snKSIsInRlbXBsYXRlID0gcmVxdWlyZSgnLi9hY2hpZXZlLmphZGUnKVxyXG52ayA9IHJlcXVpcmUgJy4uL3Rvb2xzL3ZrLmNvZmZlZSdcclxucmVxdWVzdCA9IHJlcXVpcmUgJy4uL3JlcXVlc3QnXHJcbmNvbnRhaW5lcl9pZCA9IDBcclxuXHJcbmFjaGlldmVfaWQgPSAwXHJcblxyXG5hY2h2cyA9IHJlcXVpcmUgJy4uL3Rvb2xzL2FjaHZEYXRhLmNvZmZlZSdcclxuXHJcbkRBVEEgPSBbXHJcblx0e1xyXG5cdFx0aWQ6IDBcclxuXHRcdGljb246IFwiaW1nL2ltYWdlcy9hY2hpZXZlcy9pMC5wbmdcIlxyXG5cdFx0dGl0bGU6IFwi0J/QtdGA0LLRi9C5INC/0L7RiNGR0LtcIlxyXG5cdFx0dGV4dDogXCLQn9C+0LTQtdC70LjRgdGMINCw0YfQuNCy0LrQvtC5INGBINC00YDRg9C30YzRj9C80Lgg0Lgg0L/QvtC70YPRh9C4IDUwINCx0L7QvdGD0YHQvdGL0YUg0LHQsNC70LvQvtCyLlwiXHJcblx0fVxyXG5cdHtcclxuXHRcdGlkOiAxXHJcblx0XHRpY29uOiBcImltZy9pbWFnZXMvYWNoaWV2ZXMvaTEucG5nXCJcclxuXHRcdHRpdGxlOiBcItCj0L/RkdGA0YLRi9C5XCJcclxuXHRcdHRleHQ6IFwi0J/QvtC00LXQu9C40YHRjCDQsNGH0LjQstC60L7QuSDRgSDQtNGA0YPQt9GM0Y/QvNC4INC4INC/0L7Qu9GD0YfQuCA1MCDQsdC+0L3Rg9GB0L3Ri9GFINCx0LDQu9C70L7Qsi5cIlxyXG5cdH1cclxuXHR7XHJcblx0XHRpZDogMlxyXG5cdFx0aWNvbjogXCJpbWcvaW1hZ2VzL2FjaGlldmVzL2kyLnBuZ1wiXHJcblx0XHR0aXRsZTogXCLQlNCw0Lkg0L/Rj9GC0YwhXCJcclxuXHRcdHRleHQ6IFwi0J/QvtC00LXQu9C40YHRjCDQsNGH0LjQstC60L7QuSDRgSDQtNGA0YPQt9GM0Y/QvNC4INC4INC/0L7Qu9GD0YfQuCA1MCDQsdC+0L3Rg9GB0L3Ri9GFINCx0LDQu9C70L7Qsi5cIlxyXG5cdH1cclxuXHR7XHJcblx0XHRpZDogM1xyXG5cdFx0aWNvbjogXCJpbWcvaW1hZ2VzL2FjaGlldmVzL2kzLnBuZ1wiXHJcblx0XHR0aXRsZTogXCLQmtGA0LDRgdCw0LLRh9C40LpcIlxyXG5cdFx0dGV4dDogXCLQn9C+0LTQtdC70LjRgdGMINCw0YfQuNCy0LrQvtC5INGBINC00YDRg9C30YzRj9C80Lgg0Lgg0L/QvtC70YPRh9C4IDUwINCx0L7QvdGD0YHQvdGL0YUg0LHQsNC70LvQvtCyLlwiXHJcblx0fVxyXG5cdHtcclxuXHRcdGlkOiA0XHJcblx0XHRpY29uOiBcImltZy9pbWFnZXMvYWNoaWV2ZXMvaTQucG5nXCJcclxuXHRcdHRpdGxlOiBcItCf0YDQuNGI0ZHQuyDQuiDRg9GB0L/QtdGF0YNcIlxyXG5cdFx0dGV4dDogXCLQn9C+0LTQtdC70LjRgdGMINCw0YfQuNCy0LrQvtC5INGBINC00YDRg9C30YzRj9C80Lgg0Lgg0L/QvtC70YPRh9C4IDUwINCx0L7QvdGD0YHQvdGL0YUg0LHQsNC70LvQvtCyLlwiXHJcblx0fVxyXG5cdHtcclxuXHRcdGlkOiA1XHJcblx0XHRpY29uOiBcImltZy9pbWFnZXMvYWNoaWV2ZXMvaTUucG5nXCJcclxuXHRcdHRpdGxlOiBcItCT0L7RgNC+0LTRgdC60LDRjyDQu9C10LPQtdC90LTQsFwiXHJcblx0XHR0ZXh0OiBcItCf0L7QtNC10LvQuNGB0Ywg0LDRh9C40LLQutC+0Lkg0YEg0LTRgNGD0LfRjNGP0LzQuCDQuCDQv9C+0LvRg9GH0LggNTAg0LHQvtC90YPRgdC90YvRhSDQsdCw0LvQu9C+0LIuXCJcclxuXHR9XHJcblx0e1xyXG5cdFx0aWQ6IDZcclxuXHRcdGljb246IFwiaW1nL2ltYWdlcy9hY2hpZXZlcy9pNi5wbmdcIlxyXG5cdFx0dGl0bGU6IFwi0JLQtdGA0LHQvtCy0YnQuNC6XCJcclxuXHRcdHRleHQ6IFwi0J/QvtC00LXQu9C40YHRjCDQsNGH0LjQstC60L7QuSDRgSDQtNGA0YPQt9GM0Y/QvNC4INC4INC/0L7Qu9GD0YfQuCA1MCDQsdC+0L3Rg9GB0L3Ri9GFINCx0LDQu9C70L7Qsi5cIlxyXG5cdH1cclxuXHR7XHJcblx0XHRpZDogN1xyXG5cdFx0aWNvbjogXCJpbWcvaW1hZ2VzL2FjaGlldmVzL2k3LnBuZ1wiXHJcblx0XHR0aXRsZTogXCLQk9C40L/QvdC+0LbQsNCx0LBcIlxyXG5cdFx0dGV4dDogXCLQn9C+0LTQtdC70LjRgdGMINCw0YfQuNCy0LrQvtC5INGBINC00YDRg9C30YzRj9C80Lgg0Lgg0L/QvtC70YPRh9C4IDUwINCx0L7QvdGD0YHQvdGL0YUg0LHQsNC70LvQvtCyLlwiXHJcblx0fVxyXG5dXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5vcGVuTW9kYWwgPSAoaWQsIG9wdHMpIC0+XHJcblx0Y29udGFpbmVyX2lkID0gaWRcclxuXHRhY2hpZXZlX2lkID0gK29wdHMuaWRcclxuXHQkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7Y29udGFpbmVyX2lkfV1cIikuZmluZCgnLnBvcHVwX19mb3Jsb2FkaW5nJykuaHRtbCB0ZW1wbGF0ZSh7aW5mbzogREFUQVthY2hpZXZlX2lkXX0pXHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNsb3NlTW9kYWwgPSAoaWQpIC0+XHJcblx0YWNodl9pZCA9ICArJChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2lkfV1cIikuZmluZCgnLmFjaGlldmUnKS5hdHRyKCdkYXRhLWlkJylcclxuXHRyZXF1ZXN0LmFjaGlldmVtZW50LnJlYWQge2FjaGlldmVtZW50X2lkOiBhY2h2X2lkfSwgKHJlcykgLT5cclxuXHRcdGNvbnNvbGUubG9nIHJlc1xyXG5cclxuXHJcbiQoXCIucG9wdXBfX3N1cGVyY29udGFpbmVyXCIpLm9uICdjbGljaycsICcuanMtc2hhcmVBY2h2JywgLT5cclxuXHRpZCA9ICskKHRoaXMpLmNsb3Nlc3QoJy5hY2hpZXZlJykuYXR0cignZGF0YS1pZCcpXHJcblx0JHNoYWRlID0gJCh0aGlzKS5jbG9zZXN0KCcucG9wdXBfX3NoYWRlJylcclxuXHR2ay53YWxsUG9zdCB7bWVzc2FnZTogYWNodnNbaWRdLm1lc3NhZ2UrXCIgaHR0cDovL3ZrLmNvbS9hcHA1MTk3NzkyXzIwMjc4NjQ2MVwiLCBhdHRhY2htZW50czogYWNodnNbaWRdLnBob3RvfSwgLT5cclxuXHRcdGFjaHZfaWQgPSBhY2h2c1tpZF0uYWNoaWV2ZW1lbnRfaWRcclxuXHRcdCRzaGFkZS50cmlnZ2VyKCdjbGljaycpXHJcblx0XHRyZXF1ZXN0LmV2ZW50LnNldCB7ZXZlbnRfaWQ6IGFjaHZfaWR9LCAocmVzKSAtPlxyXG5cdFx0XHRjb25zb2xlLmxvZyByZXMiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChpbmZvKSB7XG5idWYucHVzaChcIjxkaXZcIiArIChqYWRlLmF0dHIoXCJkYXRhLWlkXCIsIFwiXCIgKyAoaW5mby5pZCkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImFjaGlldmVcXFwiPjxkaXYgY2xhc3M9XFxcImFjaGlldmVfX2ljb24td3JhcHBlclxcXCI+PGltZ1wiICsgKGphZGUuYXR0cihcInNyY1wiLCBcIlwiICsgKGluZm8uaWNvbikgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImFjaGlldmVfX2ljb25cXFwiLz48L2Rpdj48ZGl2IGNsYXNzPVxcXCJhY2hpZXZlX190aXRsZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gaW5mby50aXRsZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PGRpdiBjbGFzcz1cXFwiYWNoaWV2ZV9fdGV4dFxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gaW5mby50ZXh0KSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48ZGl2IGNsYXNzPVxcXCJhY2hpZXZlX19idXQtd3JhcHBlclxcXCI+PGRpdiBjbGFzcz1cXFwiYWNoaWV2ZV9fYnV0IGJ1dCBqcy1zaGFyZUFjaHZcXFwiPtCf0L7QtNC10LvQuNGC0YzRgdGPPC9kaXY+PC9kaXY+PC9kaXY+XCIpO30uY2FsbCh0aGlzLFwiaW5mb1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguaW5mbzp0eXBlb2YgaW5mbyE9PVwidW5kZWZpbmVkXCI/aW5mbzp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJjaGVja3BvaW50VGVtcGxhdGUgPSByZXF1aXJlKCcuL2NoZWNrcG9pbnQuamFkZScpXHJcbnJlcXVlc3QgPSByZXF1aXJlKCcuLi9yZXF1ZXN0JylcclxuXHJcbmNvbnRhaW5lcl9pZCA9IDBcclxuXHJcbm1vZHVsZS5leHBvcnRzLm9wZW5Nb2RhbCA9IChpZCwgb2JqKSAtPlxyXG5cdGNvbnRhaW5lcl9pZCA9IGlkXHJcblx0Y29uc29sZS5sb2cgb2JqXHJcblx0JChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2NvbnRhaW5lcl9pZH1dXCIpLmZpbmQoJy5wb3B1cCcpLmFkZENsYXNzKCdwb3B1cC0tY2hlY2twb2ludCcpXHJcblx0JChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2NvbnRhaW5lcl9pZH1dXCIpLmZpbmQoJy5wb3B1cF9fZm9ybG9hZGluZycpLmh0bWwgY2hlY2twb2ludFRlbXBsYXRlKHtpbmZvOiBvYmp9KVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNsb3NlTW9kYWwgPSAtPlxyXG5cdCQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tjb250YWluZXJfaWR9XVwiKS5maW5kKCcucG9wdXAnKS5yZW1vdmVDbGFzcygncG9wdXAtLWNoZWNrcG9pbnQnKVxyXG5cclxuXHJcbiIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGluZm8pIHtcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwiY2hwb3B1cFxcXCI+PGRpdlwiICsgKGphZGUuYXR0cihcInN0eWxlXCIsIFwiYmFja2dyb3VuZC1pbWFnZTogdXJsKCdcIiArIChpbmZvLmltYWdlX2hpbnQpICsgXCInKVwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImNocG9wdXBfX2hlYWRlclxcXCI+PGRpdiBjbGFzcz1cXFwiY2hwb3B1cF9fdXJhXFxcIj48c3BhbiBjbGFzcz1cXFwiY2hwb3B1cF9fd2hpdGViYWNrXFxcIj7Qo9GA0LAhINCi0Ysg0L7RgtC60YDRi9C7PC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9XFxcImNocG9wdXBfX3RpdGxlXFxcIj48c3BhbiBjbGFzcz1cXFwiY2hwb3B1cF9fd2hpdGViYWNrXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBpbmZvLnRpdGxlKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L3NwYW4+PC9kaXY+PGRpdiBjbGFzcz1cXFwiY2hwb3B1cF9fZGVzY1xcXCI+PHNwYW4gY2xhc3M9XFxcImNocG9wdXBfX3doaXRlYmFja1xcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gaW5mby5kZXNjcmlwdGlvbikgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9zcGFuPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcImNocG9wdXBfX21haW5cXFwiPjxkaXYgY2xhc3M9XFxcImNocG9wdXBfX25leHRcXFwiPtCh0LvQtdC00YPRjtGJ0LjQuSDQv9GD0L3QutGCPC9kaXY+PGRpdiBjbGFzcz1cXFwiY2hwb3B1cF9faGludFxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gaW5mby5oaW50KSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48ZGl2IGNsYXNzPVxcXCJjaHBvcHVwX19idXQgYnV0IGJ1dC0tbG93IGpzLWNsb3NlUG9wdXBcXFwiPtCY0YHQutCw0YLRjDwvZGl2PjwvZGl2PjwvZGl2PlwiKTt9LmNhbGwodGhpcyxcImluZm9cIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLmluZm86dHlwZW9mIGluZm8hPT1cInVuZGVmaW5lZFwiP2luZm86dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiZ2FtZWVudGVyVGVtcGxhdGUgPSByZXF1aXJlKCcuL2dhbWVlbnRlci5qYWRlJylcclxucmVxdWVzdCA9IHJlcXVpcmUoJy4uL3JlcXVlc3QnKVxyXG5cclxuY29udGFpbmVyX2lkID0gMFxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzLm9wZW5Nb2RhbCA9IChpZCwgb2JqKSAtPlxyXG5cdGNvbnRhaW5lcl9pZCA9IGlkXHJcblx0JChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2NvbnRhaW5lcl9pZH1dXCIpLmZpbmQoJy5wb3B1cCcpLmFkZENsYXNzKCdwb3B1cC0tY2hlY2twb2ludCcpXHJcblx0JChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2NvbnRhaW5lcl9pZH1dXCIpLmZpbmQoJy5wb3B1cF9fZm9ybG9hZGluZycpLmh0bWwgZ2FtZWVudGVyVGVtcGxhdGUoe2luZm86IG9ian0pXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2xvc2VNb2RhbCA9IC0+XHJcblx0JChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2NvbnRhaW5lcl9pZH1dXCIpLmZpbmQoJy5wb3B1cCcpLnJlbW92ZUNsYXNzKCdwb3B1cC0tY2hlY2twb2ludCcpXHJcblxyXG5cclxuIiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoaW5mbykge1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJjaHBvcHVwXFxcIj48ZGl2XCIgKyAoamFkZS5hdHRyKFwic3R5bGVcIiwgXCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJ1wiICsgKGluZm8uaW1hZ2VfaGludCkgKyBcIicpXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwiY2hwb3B1cF9faGVhZGVyXFxcIj48ZGl2IGNsYXNzPVxcXCJjaHBvcHVwX190aXRsZVxcXCI+PHNwYW4gY2xhc3M9XFxcImNocG9wdXBfX3doaXRlYmFja1xcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gaW5mby50aXRsZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9XFxcImNocG9wdXBfX2Rlc2NcXFwiPjxzcGFuIGNsYXNzPVxcXCJjaHBvcHVwX193aGl0ZWJhY2tcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGluZm8uZGVzY3JpcHRpb24pID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvc3Bhbj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJjaHBvcHVwX19tYWluXFxcIj48ZGl2IGNsYXNzPVxcXCJjaHBvcHVwX19uZXh0XFxcIj7QodC70LXQtNGD0Y7RidC40Lkg0L/Rg9C90LrRgjwvZGl2PjxkaXYgY2xhc3M9XFxcImNocG9wdXBfX2hpbnRcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGluZm8uaGludCkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PGRpdiBjbGFzcz1cXFwiY2hwb3B1cF9fYnV0IGJ1dCBidXQtLWxvdyBqcy1jbG9zZVBvcHVwXFxcIj7QmNGB0LrQsNGC0Yw8L2Rpdj48L2Rpdj48L2Rpdj5cIik7fS5jYWxsKHRoaXMsXCJpbmZvXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5pbmZvOnR5cGVvZiBpbmZvIT09XCJ1bmRlZmluZWRcIj9pbmZvOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsImludHJvID0gcmVxdWlyZSgnLi9pbnRyby5jb2ZmZWUnKVxyXG5pbnZpdGUgPSByZXF1aXJlKCcuL2ludml0ZS5jb2ZmZWUnKVxyXG5yYXRpbmcgPSByZXF1aXJlKCcuL3JhdGluZy5jb2ZmZWUnKVxyXG51c2VyaW5mbyA9IHJlcXVpcmUoJy4vdXNlcmluZm8uY29mZmVlJylcclxuY2hlY2twb2ludCA9IHJlcXVpcmUoJy4vY2hlY2twb2ludC5jb2ZmZWUnKVxyXG5nYW1lZW50ZXIgPSByZXF1aXJlKCcuL2dhbWVlbnRlci5jb2ZmZWUnKVxyXG5tb25leSA9IHJlcXVpcmUoJy4vbW9uZXkuY29mZmVlJylcclxubWVzc2VuZ2VyID0gcmVxdWlyZSgnLi9tZXNzZW5nZXIvbWVzc2VuZ2VyLmNvZmZlZScpXHJcbmFjaGlldmUgPSByZXF1aXJlKCcuL2FjaGlldmUuY29mZmVlJylcclxubXlwcml6ZXMgPSByZXF1aXJlKCcuL215cHJpemVzLmNvZmZlZScpXHJcbnBpenphID0gcmVxdWlyZSgnLi9waXp6YS5jb2ZmZWUnKVxyXG5uZXd0YXN0ZSA9IHJlcXVpcmUoJy4vbmV3dGFzdGUuY29mZmVlJylcclxuXHJcblxyXG5tYWluVGVtcGxhdGUgPSByZXF1aXJlICcuL2luZGV4LmphZGUnXHJcblxyXG5jdXJJRCA9IDBcclxucGFnZXMgPSBbXVxyXG5cclxubW9kdWxlLmV4cG9ydHMub3Blbk1vZGFsID0gKHR5cGVzLCBvYmo9e30sIGNhbGxiYWNrKSAtPlxyXG4jJCgnLnBvcHVwX19zaGFkZScpLnJlbW92ZUNsYXNzKCdwb3B1cF9fc2hhZGUtLWNsb3NlZCcpXHJcblx0JCgnYm9keScpLmFkZENsYXNzKCdib2R5LS1tb2RhbCcpXHJcblx0JCgnLnBvcHVwX19zdXBlcmNvbnRhaW5lcicpLmFwcGVuZCBtYWluVGVtcGxhdGUoe2N1cklEOmN1cklEfSlcclxuXHJcblxyXG5cdGlmIHR5cGVzID09IFwiaW50cm9cIlxyXG5cdFx0aW50cm8ub3Blbk1vZGFsKGN1cklEKVxyXG5cclxuXHRpZiB0eXBlcyA9PSBcInJhdGluZ1wiXHJcblx0XHRyYXRpbmcub3Blbk1vZGFsKGN1cklEKVxyXG5cclxuXHRpZiB0eXBlcyA9PSBcImludml0ZVwiXHJcblx0XHRpbnZpdGUub3Blbk1vZGFsKGN1cklEKVxyXG5cclxuXHRpZiB0eXBlcyA9PSBcInVzZXJpbmZvXCJcclxuXHRcdHVzZXJpbmZvLm9wZW5Nb2RhbChjdXJJRCwgb2JqLCBjYWxsYmFjaylcclxuXHRpZiB0eXBlcyA9PSBcImFjaGlldmVcIlxyXG5cdFx0YWNoaWV2ZS5vcGVuTW9kYWwoY3VySUQsIG9iailcclxuXHJcblx0aWYgdHlwZXMgPT0gXCJjaGVja3BvaW50XCJcclxuXHRcdGNoZWNrcG9pbnQub3Blbk1vZGFsKGN1cklELCBvYmopXHJcblxyXG5cdGlmIHR5cGVzID09IFwiZ2FtZWVudGVyXCJcclxuXHRcdGdhbWVlbnRlci5vcGVuTW9kYWwoY3VySUQsIG9iailcclxuXHRpZiB0eXBlcyA9PSBcIm1vbmV5XCJcclxuXHRcdG1vbmV5Lm9wZW5Nb2RhbChjdXJJRCwgb2JqKVxyXG5cdGlmIHR5cGVzID09IFwibXlwcml6ZXNcIlxyXG5cdFx0bXlwcml6ZXMub3Blbk1vZGFsKGN1cklELCBvYmopXHJcblx0aWYgdHlwZXMgPT0gXCJwaXp6YVwiXHJcblx0XHRwaXp6YS5vcGVuTW9kYWwoY3VySUQpXHJcblxyXG5cdGlmIHR5cGVzID09IFwibWVzc2VuZ2VyXCJcclxuXHRcdG1lc3Nlbmdlci5vcGVuTW9kYWwob2JqKVxyXG5cclxuXHRpZiB0eXBlcyA9PSBcIm5ld3Rhc3RlXCJcclxuXHRcdG5ld3Rhc3RlLm9wZW5Nb2RhbChjdXJJRClcclxuXHJcblx0cGFnZXNbY3VySURdID0gdHlwZXNcclxuXHRjdXJJRCsrXHJcblxyXG5cclxuYWRkQ2xvc2VMaXN0ZW5lciA9IC0+XHJcblx0Y2xvc2VNb2RhbCA9IChpZCkgLT5cclxuXHRcdCMkKCcucG9wdXBfX3NoYWRlJykuYWRkQ2xhc3MoJ3BvcHVwX19zaGFkZS0tY2xvc2VkJylcclxuXHRcdCQoJ2JvZHknKS5yZW1vdmVDbGFzcygnYm9keS0tbW9kYWwnKVxyXG5cdFx0cGFnZSA9IHBhZ2VzW2lkXVxyXG5cdFx0aWYgcGFnZSA9PSBcImludHJvXCJcclxuXHRcdFx0aW50cm8uY2xvc2VNb2RhbCgpXHJcblx0XHRpZiBwYWdlID09IFwicmF0aW5nXCJcclxuXHRcdFx0cmF0aW5nLmNsb3NlTW9kYWwoKVxyXG5cdFx0aWYgcGFnZSA9PSBcImludml0ZVwiXHJcblx0XHRcdGludml0ZS5jbG9zZU1vZGFsKClcclxuXHRcdGlmIHBhZ2UgPT0gXCJ1c2VyaW5mb1wiXHJcblx0XHRcdHVzZXJpbmZvLmNsb3NlTW9kYWwoKVxyXG5cdFx0aWYgcGFnZSA9PSBcImNoZWNrcG9pbnRcIlxyXG5cdFx0XHRjaGVja3BvaW50LmNsb3NlTW9kYWwoKVxyXG5cdFx0aWYgcGFnZSA9PSBcImdhbWVlbnRlclwiXHJcblx0XHRcdGdhbWVlbnRlci5jbG9zZU1vZGFsKClcclxuXHRcdGlmIHBhZ2UgPT0gXCJtb25leVwiXHJcblx0XHRcdG1vbmV5LmNsb3NlTW9kYWwoKVxyXG5cdFx0aWYgcGFnZSA9PSBcIm1lc3NlbmdlclwiXHJcblx0XHRcdG1lc3Nlbmdlci5jbG9zZU1vZGFsKClcclxuXHRcdGlmIHBhZ2UgPT0gXCJteXByaXplc1wiXHJcblx0XHRcdG15cHJpemVzLmNsb3NlTW9kYWwoKVxyXG5cdFx0aWYgcGFnZSA9PSBcInBpenphXCJcclxuXHRcdFx0cGl6emEuY2xvc2VNb2RhbCgpXHJcblx0XHRpZiBwYWdlID09IFwiYWNoaWV2ZVwiXHJcblx0XHRcdGFjaGlldmUuY2xvc2VNb2RhbChpZClcclxuXHRcdCQoJy5wb3B1cF9fc3VwZXJjb250YWluZXIgLnBvcHVwX19zaGFkZVtkYXRhLWlkPVwiJytpZCsnXCJdJykucmVtb3ZlKClcclxuXHJcblx0bW9kdWxlLmV4cG9ydHMuY2xvc2VNb2RhbCA9IGNsb3NlTW9kYWxcclxuXHQkKCcucG9wdXBfX3N1cGVyY29udGFpbmVyJykub24gJ2NsaWNrJywgJy5wb3B1cF9fc2hhZGUnLCAoZSkgLT5cclxuXHRcdGlkID0gJCh0aGlzKS5hdHRyKCdkYXRhLWlkJylcclxuXHRcdGNsb3NlTW9kYWwoaWQpIGlmICQoZS50YXJnZXQpLmhhc0NsYXNzKCdwb3B1cF9fc2hhZGUnKVxyXG5cclxuXHQkKCcucG9wdXBfX3N1cGVyY29udGFpbmVyJykub24gJ2NsaWNrJywgJy5wb3B1cF9fY3Jvc3MnLCAtPlxyXG5cdFx0aWQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5wb3B1cF9fc2hhZGUnKS5hdHRyKCdkYXRhLWlkJylcclxuXHRcdGNsb3NlTW9kYWwoaWQpXHJcblxyXG5cdCQoJy5wb3B1cF9fc3VwZXJjb250YWluZXInKS5vbiAnY2xpY2snLCAnLmpzLWNsb3NlUG9wdXAnLCAtPlxyXG5cdFx0aWQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5wb3B1cF9fc2hhZGUnKS5hdHRyKCdkYXRhLWlkJylcclxuXHRcdGNsb3NlTW9kYWwoaWQpXHJcblxyXG5hZGRDbG9zZUxpc3RlbmVyKCkiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChjdXJJRCkge1xuYnVmLnB1c2goXCI8ZGl2XCIgKyAoamFkZS5hdHRyKFwiZGF0YS1pZFwiLCBcIlwiICsgKGN1cklEKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyAoamFkZS5hdHRyKFwic3R5bGVcIiwgXCJ6LWluZGV4OlwiICsgKGN1cklEKzEwKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwicG9wdXBfX3NoYWRlXFxcIj48ZGl2IGNsYXNzPVxcXCJwb3B1cFxcXCI+PGkgY2xhc3M9XFxcImljb24tcG9wdXAtY3Jvc3MgcG9wdXBfX2Nyb3NzXFxcIj48L2k+PGRpdiBjbGFzcz1cXFwicG9wdXBfX2ZvcmxvYWRpbmdcXFwiPjwvZGl2PjwvZGl2PjwvZGl2PlwiKTt9LmNhbGwodGhpcyxcImN1cklEXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5jdXJJRDp0eXBlb2YgY3VySUQhPT1cInVuZGVmaW5lZFwiP2N1cklEOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsImludHJvVGVtcGxhdGUgPSByZXF1aXJlKCcuL2ludHJvLmphZGUnKVxyXG5cclxudmlkZW9TcmMgPSBcIlwiXHJcbmNvbnRhaW5lcl9pZCA9IDBcclxuXHJcbm1vZHVsZS5leHBvcnRzLm9wZW5Nb2RhbCA9IChpZCkgLT5cclxuXHRjb250YWluZXJfaWQgPSBpZFxyXG5cdCQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tjb250YWluZXJfaWR9XVwiKS5maW5kKCcucG9wdXBfX2ZvcmxvYWRpbmcnKS5odG1sIGludHJvVGVtcGxhdGUoKVxyXG5cdHZpZGVvU3JjID0gJCgnLmludHJvX192aWRlbycpLmF0dHIoJ3NyYycpXHJcblx0JCgnLmludHJvX192aWRlbycpLmF0dHIoJ3NyYycsIHZpZGVvU3JjKVxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2xvc2VNb2RhbCA9IC0+XHJcblx0JCgnLmludHJvX192aWRlbycpLmF0dHIoJ3NyYycsIFwiXCIpIiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwicG9wdXBfX3dyYXAtLWludHJvXFxcIj48aWZyYW1lIGNsYXNzPVxcXCJpbnRyb19fdmlkZW9cXFwiIHdpZHRoPVxcXCI1ODhcXFwiIGhlaWdodD1cXFwiMzYwXFxcIiBzcmM9XFxcImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL3V3MDhqLXlPZmNFXFxcIiBmcmFtZWJvcmRlcj1cXFwiMFxcXCI+PC9pZnJhbWU+PGRpdiBjbGFzcz1cXFwiaW50cm9fX3NraXB2aWRlb1xcXCI+0J/RgNC+0L/Rg9GB0YLQuNGC0Yw8L2Rpdj48L2Rpdj5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwiaW52aXRlVGVtcGxhdGUgPSByZXF1aXJlKCcuL2ludml0ZS5qYWRlJylcclxuXHJcbmNvbnRhaW5lcl9pZCA9IDBcclxuXHJcbm1vZHVsZS5leHBvcnRzLm9wZW5Nb2RhbCA9IChpZCkgLT5cclxuXHRjb250YWluZXJfaWQgPSBpZFxyXG5cdCQoXCIucG9wdXBfX3NoYWRlW2RhdGEtaWQ9I3tjb250YWluZXJfaWR9XVwiKS5maW5kKCcucG9wdXBfX2ZvcmxvYWRpbmcnKS5odG1sIGludml0ZVRlbXBsYXRlKClcclxuXHQkKFwiLmludml0ZV9fbGlzdFwiKS5jdXN0b21TY3JvbGwoKVxyXG5cdCQoJy5pbnZpdGVfX2lucHV0Jykub24gJ2lucHV0JywgaW5wdXRDaGFuZ2VIYW5kbGVyXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jbG9zZU1vZGFsID0gLT5cclxuXHQkKCcuaW50cm9fX3ZpZGVvJykuYXR0cignc3JjJywgXCJcIilcclxuXHQkKCcuaW52aXRlX19pbnB1dCcpLm9mZiAnaW5wdXQnLCBpbnB1dENoYW5nZUhhbmRsZXJcclxuXHJcbmlucHV0Q2hhbmdlSGFuZGxlciA9IChlKSAtPlxyXG5cdHZhbCA9IGUudGFyZ2V0LnZhbHVlXHJcblx0ZmlsdGVyTGlzdCh2YWwpXHJcblxyXG5maWx0ZXJMaXN0ID0gKHZhbCkgLT5cclxuXHR2YWwgPSB2YWwudG9Mb3dlckNhc2UoKVxyXG5cdCQoJy5pbnZpdGVfX2VsJykuZWFjaCAoaSwgZWwpIC0+XHJcblx0XHRuYW1lID0gJChlbCkuZmluZCgnLmxlYWRlcnNfX25hbWUnKS50ZXh0KCkudG9Mb3dlckNhc2UoKVxyXG5cdFx0aWYgbmFtZS5pbmRleE9mKHZhbCkgIT0gLTFcclxuXHRcdFx0JChlbCkucmVtb3ZlQ2xhc3MoJ2ludml0ZV9fZWwtLWludmlzJylcclxuXHRcdGVsc2VcclxuXHRcdFx0JChlbCkuYWRkQ2xhc3MoJ2ludml0ZV9fZWwtLWludmlzJykiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJwb3B1cF9fd3JhcC0taW52aXRlXFxcIj48aDMgY2xhc3M9XFxcImludml0ZV9fdGl0bGVcXFwiPtCS0YvQsdC10YDQuCDQtNGA0YPQt9C10LksPGJyPtC60L7RgtC+0YDRi9GFINGF0L7Rh9C10YjRjCDQv9GA0LjQs9C70LDRgdC40YLRjDwvaDM+PGRpdiBjbGFzcz1cXFwiaW52aXRlX19pbnB1dHdyYXBwZXJcXFwiPjxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwi0JLQstC10LTQuCDQuNC80Y9cXFwiIGNsYXNzPVxcXCJpbnZpdGVfX2lucHV0XFxcIi8+PC9kaXY+PGRpdiBjbGFzcz1cXFwiaW52aXRlX19saXN0XFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19lbCBpbnZpdGVfX2VsIGludml0ZV9fZWwtLWludml0ZWRcXFwiPjxpbWcgc3JjPVxcXCJodHRwOi8vd3d3LnNwbGV0bmlrLnJ1L2ltZy8yMDExLzA0L2FyaW5hLzIwMTEwNDAxLXJvYmVydGQtYW5vbnMuanBnXFxcIiBjbGFzcz1cXFwibGVhZGVyc19fcGhvdG9cXFwiLz48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19yaWdodFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fbmFtZVxcXCI+0JLRj9GH0LXRgdC70LDQsjxicj7QktGP0YfQtdGB0LvQsNCy0L7QstC40Yc8L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19lbCBpbnZpdGVfX2VsXFxcIj48aW1nIHNyYz1cXFwiaHR0cDovL3d3dy5zcGxldG5pay5ydS9pbWcvMjAxMS8wNC9hcmluYS8yMDExMDQwMS1yb2JlcnRkLWFub25zLmpwZ1xcXCIgY2xhc3M9XFxcImxlYWRlcnNfX3Bob3RvXFxcIi8+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fcmlnaHRcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX25hbWVcXFwiPtCS0Y/Rh9C10YHQu9Cw0LI8YnI+0JLRj9GH0LXRgdC70LDQstC+0LLQuNGHPC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fZWwgaW52aXRlX19lbFxcXCI+PGltZyBzcmM9XFxcImh0dHA6Ly93d3cuc3BsZXRuaWsucnUvaW1nLzIwMTEvMDQvYXJpbmEvMjAxMTA0MDEtcm9iZXJ0ZC1hbm9ucy5qcGdcXFwiIGNsYXNzPVxcXCJsZWFkZXJzX19waG90b1xcXCIvPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3JpZ2h0XFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19uYW1lXFxcIj7QktGP0YfQtdGB0LvQsNCyPGJyPtCS0Y/Rh9C10YHQu9Cw0LLQvtCy0LjRhzwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2VsIGludml0ZV9fZWwgaW52aXRlX19lbC0taW52aXRlZFxcXCI+PGltZyBzcmM9XFxcImh0dHA6Ly93d3cuc3BsZXRuaWsucnUvaW1nLzIwMTEvMDQvYXJpbmEvMjAxMTA0MDEtcm9iZXJ0ZC1hbm9ucy5qcGdcXFwiIGNsYXNzPVxcXCJsZWFkZXJzX19waG90b1xcXCIvPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3JpZ2h0XFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19uYW1lXFxcIj7QndC40LrQvdC10LnQvDwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2VsIGludml0ZV9fZWxcXFwiPjxpbWcgc3JjPVxcXCJodHRwOi8vd3d3LnNwbGV0bmlrLnJ1L2ltZy8yMDExLzA0L2FyaW5hLzIwMTEwNDAxLXJvYmVydGQtYW5vbnMuanBnXFxcIiBjbGFzcz1cXFwibGVhZGVyc19fcGhvdG9cXFwiLz48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19yaWdodFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fbmFtZVxcXCI+0J3QuNC60L3QtdC50Lw8L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19lbCBpbnZpdGVfX2VsIGludml0ZV9fZWwtLWludml0ZWRcXFwiPjxpbWcgc3JjPVxcXCJodHRwOi8vd3d3LnNwbGV0bmlrLnJ1L2ltZy8yMDExLzA0L2FyaW5hLzIwMTEwNDAxLXJvYmVydGQtYW5vbnMuanBnXFxcIiBjbGFzcz1cXFwibGVhZGVyc19fcGhvdG9cXFwiLz48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19yaWdodFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fbmFtZVxcXCI+0J3QuNC60L3QtdC50Lw8L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19lbCBpbnZpdGVfX2VsXFxcIj48aW1nIHNyYz1cXFwiaHR0cDovL3d3dy5zcGxldG5pay5ydS9pbWcvMjAxMS8wNC9hcmluYS8yMDExMDQwMS1yb2JlcnRkLWFub25zLmpwZ1xcXCIgY2xhc3M9XFxcImxlYWRlcnNfX3Bob3RvXFxcIi8+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fcmlnaHRcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX25hbWVcXFwiPtCd0LjQutC90LXQudC8PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fZWwgaW52aXRlX19lbFxcXCI+PGltZyBzcmM9XFxcImh0dHA6Ly93d3cuc3BsZXRuaWsucnUvaW1nLzIwMTEvMDQvYXJpbmEvMjAxMTA0MDEtcm9iZXJ0ZC1hbm9ucy5qcGdcXFwiIGNsYXNzPVxcXCJsZWFkZXJzX19waG90b1xcXCIvPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3JpZ2h0XFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19uYW1lXFxcIj7QndC40LrQvdC10LnQvDwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2VsIGludml0ZV9fZWwgaW52aXRlX19lbC0taW52aXRlZFxcXCI+PGltZyBzcmM9XFxcImh0dHA6Ly93d3cuc3BsZXRuaWsucnUvaW1nLzIwMTEvMDQvYXJpbmEvMjAxMTA0MDEtcm9iZXJ0ZC1hbm9ucy5qcGdcXFwiIGNsYXNzPVxcXCJsZWFkZXJzX19waG90b1xcXCIvPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3JpZ2h0XFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19uYW1lXFxcIj7QndC40LrQvdC10LnQvDwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2VsIGludml0ZV9fZWxcXFwiPjxpbWcgc3JjPVxcXCJodHRwOi8vd3d3LnNwbGV0bmlrLnJ1L2ltZy8yMDExLzA0L2FyaW5hLzIwMTEwNDAxLXJvYmVydGQtYW5vbnMuanBnXFxcIiBjbGFzcz1cXFwibGVhZGVyc19fcGhvdG9cXFwiLz48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19yaWdodFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fbmFtZVxcXCI+0J3QuNC60L7Qu9Cw0Lk8YnI+0J3QuNC60L7Qu9Cw0LXQstC40Yc8L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19lbCBpbnZpdGVfX2VsIGludml0ZV9fZWwtLWludml0ZWRcXFwiPjxpbWcgc3JjPVxcXCJodHRwOi8vd3d3LnNwbGV0bmlrLnJ1L2ltZy8yMDExLzA0L2FyaW5hLzIwMTEwNDAxLXJvYmVydGQtYW5vbnMuanBnXFxcIiBjbGFzcz1cXFwibGVhZGVyc19fcGhvdG9cXFwiLz48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19yaWdodFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fbmFtZVxcXCI+0J3QuNC60L3QtdC50Lw8L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19lbCBpbnZpdGVfX2VsXFxcIj48aW1nIHNyYz1cXFwiaHR0cDovL3d3dy5zcGxldG5pay5ydS9pbWcvMjAxMS8wNC9hcmluYS8yMDExMDQwMS1yb2JlcnRkLWFub25zLmpwZ1xcXCIgY2xhc3M9XFxcImxlYWRlcnNfX3Bob3RvXFxcIi8+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fcmlnaHRcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX25hbWVcXFwiPtCd0LjQutC90LXQudC8PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fZWwgaW52aXRlX19lbFxcXCI+PGltZyBzcmM9XFxcImh0dHA6Ly93d3cuc3BsZXRuaWsucnUvaW1nLzIwMTEvMDQvYXJpbmEvMjAxMTA0MDEtcm9iZXJ0ZC1hbm9ucy5qcGdcXFwiIGNsYXNzPVxcXCJsZWFkZXJzX19waG90b1xcXCIvPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3JpZ2h0XFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19uYW1lXFxcIj7QndC40LrQvdC10LnQvDwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2VsIGludml0ZV9fZWwgaW52aXRlX19lbC0taW52aXRlZFxcXCI+PGltZyBzcmM9XFxcImh0dHA6Ly93d3cuc3BsZXRuaWsucnUvaW1nLzIwMTEvMDQvYXJpbmEvMjAxMTA0MDEtcm9iZXJ0ZC1hbm9ucy5qcGdcXFwiIGNsYXNzPVxcXCJsZWFkZXJzX19waG90b1xcXCIvPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3JpZ2h0XFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19uYW1lXFxcIj7QndC40LrQvdC10LnQvDwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2VsIGludml0ZV9fZWxcXFwiPjxpbWcgc3JjPVxcXCJodHRwOi8vd3d3LnNwbGV0bmlrLnJ1L2ltZy8yMDExLzA0L2FyaW5hLzIwMTEwNDAxLXJvYmVydGQtYW5vbnMuanBnXFxcIiBjbGFzcz1cXFwibGVhZGVyc19fcGhvdG9cXFwiLz48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19yaWdodFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fbmFtZVxcXCI+0J3QuNC60L3QtdC50Lw8L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidGVtcGxhdGUgPSByZXF1aXJlKCcuL21lc3Nlbmdlci5qYWRlJylcclxucmVxdWVzdCA9IHJlcXVpcmUoJy4uLy4uL3JlcXVlc3QvaW5kZXgnKVxyXG5tZXNfaWNvbiA9IHJlcXVpcmUoJy4uLy4uL2hlYWRlci9tZXNzZW5nZXJfX2ljb24uamFkZScpXHJcblxyXG5ub3RpZmljYXRpb25UZW1wbGF0ZSA9IHJlcXVpcmUgJy4vbm90aWZpY2F0aW9uLmphZGUnXHJcbnF1ZXN0aW9uVGVtcGxhdGUgPSByZXF1aXJlICcuL3F1ZXN0aW9uLmphZGUnXHJcbmRhdGEgPSBbXVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzLm9wZW5Nb2RhbCA9IChvYmopIC0+XHJcblx0JCgnLnBvcHVwJykuYWRkQ2xhc3MoJ3BvcHVwLS1tZXNzZW5nZXInKVxyXG5cdHJlcXVlc3QuZmVlZGJhY2suZ2V0IHt9LCAocmVzKSAtPlxyXG5cdFx0Y29uc29sZS5sb2cgcmVzXHJcblx0XHRkYXRhID0gaGFuZGxlUmVzKHJlcylcclxuXHRcdCQoJy5wb3B1cF9fZm9ybG9hZGluZycpLmh0bWwgdGVtcGxhdGUoe21lc3NhZ2VzOiBkYXRhfSlcclxuXHRcdG9wZW5NZXNzYWdlKDApIGlmIHJlcy5sZW5ndGg+MFxyXG5cdFx0JCgnLm1lc3Nlbmdlcl9fdmlzJykuY3VzdG9tU2Nyb2xsKHtwcmVmaXg6XCJjdXN0b20tYmlnc2Nyb2xsX1wifSlcclxuXHRcdCQoJy5tZXNzZW5nZXJfX2VsJykub24gJ2NsaWNrJywgbWVzQ2xpY2tMaXN0ZW5lclxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2xvc2VNb2RhbCA9IC0+XHJcblx0JCgnLnBvcHVwJykucmVtb3ZlQ2xhc3MoJ3BvcHVwLS1tZXNzZW5nZXInKVxyXG5cclxubWVzQ2xpY2tMaXN0ZW5lciA9IC0+XHJcblx0JCgnLm1lc3Nlbmdlcl9fZWwnKS5yZW1vdmVDbGFzcygnbWVzc2VuZ2VyX19lbC0tYWN0aXZlJylcclxuXHQkKHRoaXMpLmFkZENsYXNzKCdtZXNzZW5nZXJfX2VsLS1hY3RpdmUnKVxyXG5cdG9wZW5NZXNzYWdlICskKHRoaXMpLmF0dHIoJ2RhdGEtaWQnKVxyXG5cclxuaGFuZGxlUmVzID0gKGFycikgLT5cclxuXHRmb3IgbWVzIGluIGFyclxyXG5cdFx0bWVzLm5vdGljZSA9ICFtZXMucXVlc3Rpb25cclxuXHRcdGQgPSBtb21lbnQobWVzLmFuc3dlcmVkX2F0KjEwMDApXHJcblx0XHRtZXMuZGF0ZSA9IGQuZm9ybWF0KCdERC5NTS5ZWVlZJylcclxuXHRyZXR1cm4gYXJyLnJldmVyc2UoKVxyXG5cclxub3Blbk1lc3NhZ2UgPSAoaW5kZXgpIC0+XHJcblx0bWVzc2FnZSA9IGRhdGFbaW5kZXhdXHJcblx0aWYgbWVzc2FnZS5ub3RpY2VcclxuXHRcdCQoJy5tZXNzZW5nZXJfX21lcy10ZXh0JykuaHRtbCBub3RpZmljYXRpb25UZW1wbGF0ZSh7aW5mbzptZXNzYWdlfSlcclxuXHRlbHNlXHJcblx0XHQkKCcubWVzc2VuZ2VyX19tZXMtdGV4dCcpLmh0bWwgcXVlc3Rpb25UZW1wbGF0ZSh7aW5mbzptZXNzYWdlfSlcclxuXHQkKCcubWVzc2VuZ2VyX19tZXMtY29udGFpbmVyJykuY3VzdG9tU2Nyb2xsKHtwcmVmaXg6XCJjdXN0b20tYmlnc2Nyb2xsX1wifSlcclxuXHRpZiBkYXRhW2luZGV4XS5yZWFkID09IDBcclxuXHRcdHJlcXVlc3QuZmVlZGJhY2sucmVhZCB7aWQ6IGRhdGFbaW5kZXhdLmlkfSwgKHJlcykgLT5cclxuXHRcdFx0aWYgcmVzLnJlc3VsdCA9IFwic3VjY2Vzc1wiXHJcblx0XHRcdFx0JCgnLm1lc3Nlbmdlcl9faWNvbi1mb3Jsb2FkaW5nJykuaHRtbCBtZXNfaWNvbih7dW5yZWFkczpwYXJzZUludCgkKCcubWVzc2VuZ2VyX191bnJlYWRzLXZhbCcpLmh0bWwoKSktMX0pXHJcblxyXG4iLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChtZXNzYWdlcywgdW5kZWZpbmVkKSB7XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcIm1lc3NlbmdlclxcXCI+PGgyIGNsYXNzPVxcXCJtZXNzZW5nZXJfX3RpdGxlXFxcIj7QnNC+0Lgg0YHQvtC+0LHRidC10L3QuNGPPC9oMj48ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJfX2xlZnRcXFwiPjxoMyBjbGFzcz1cXFwibWVzc2VuZ2VyX19zdWJ0aXRsZVxcXCI+0KHQv9C40YHQvtC6INGB0L7QvtCx0YnQtdC90LjQuTwvaDM+PGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX192aXNcXFwiPjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fbGlzdFxcXCI+XCIpO1xuLy8gaXRlcmF0ZSBtZXNzYWdlc1xuOyhmdW5jdGlvbigpe1xuICB2YXIgJCRvYmogPSBtZXNzYWdlcztcbiAgaWYgKCdudW1iZXInID09IHR5cGVvZiAkJG9iai5sZW5ndGgpIHtcblxuICAgIGZvciAodmFyIGluZGV4ID0gMCwgJCRsID0gJCRvYmoubGVuZ3RoOyBpbmRleCA8ICQkbDsgaW5kZXgrKykge1xuICAgICAgdmFyIG1lcyA9ICQkb2JqW2luZGV4XTtcblxuYnVmLnB1c2goXCI8ZGl2XCIgKyAoamFkZS5hdHRyKFwiZGF0YS1pZFwiLCBcIlwiICsgKGluZGV4KSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyAoamFkZS5jbHMoWydtZXNzZW5nZXJfX2VsJyxpbmRleD09MCA/IFwibWVzc2VuZ2VyX19lbC0tYWN0aXZlXCIgOiBcIlwiXSwgW251bGwsdHJ1ZV0pKSArIFwiPjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fZWwtaGVhZGVyXFxcIj5cIik7XG5pZiAoIG1lcy5ub3RpY2UpXG57XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fZWwtdHlwZVxcXCI+0KPQstC10LTQvtC80LvQtdC90LjQtTwvZGl2PlwiKTtcbn1cbmVsc2VcbntcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX19lbC10eXBlXFxcIj7QntGC0LLQtdGCINC90LAg0LLQvtC/0YDQvtGBPC9kaXY+XCIpO1xufVxuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJfX2VsLWRhdGVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IG1lcy5kYXRlKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJfX2VsLXRpdGxlXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBtZXMudGl0bGUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjwvZGl2PlwiKTtcbiAgICB9XG5cbiAgfSBlbHNlIHtcbiAgICB2YXIgJCRsID0gMDtcbiAgICBmb3IgKHZhciBpbmRleCBpbiAkJG9iaikge1xuICAgICAgJCRsKys7ICAgICAgdmFyIG1lcyA9ICQkb2JqW2luZGV4XTtcblxuYnVmLnB1c2goXCI8ZGl2XCIgKyAoamFkZS5hdHRyKFwiZGF0YS1pZFwiLCBcIlwiICsgKGluZGV4KSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyAoamFkZS5jbHMoWydtZXNzZW5nZXJfX2VsJyxpbmRleD09MCA/IFwibWVzc2VuZ2VyX19lbC0tYWN0aXZlXCIgOiBcIlwiXSwgW251bGwsdHJ1ZV0pKSArIFwiPjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fZWwtaGVhZGVyXFxcIj5cIik7XG5pZiAoIG1lcy5ub3RpY2UpXG57XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fZWwtdHlwZVxcXCI+0KPQstC10LTQvtC80LvQtdC90LjQtTwvZGl2PlwiKTtcbn1cbmVsc2VcbntcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX19lbC10eXBlXFxcIj7QntGC0LLQtdGCINC90LAg0LLQvtC/0YDQvtGBPC9kaXY+XCIpO1xufVxuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJfX2VsLWRhdGVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IG1lcy5kYXRlKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJfX2VsLXRpdGxlXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBtZXMudGl0bGUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjwvZGl2PlwiKTtcbiAgICB9XG5cbiAgfVxufSkuY2FsbCh0aGlzKTtcblxuYnVmLnB1c2goXCI8L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJfX3JpZ2h0XFxcIj48aDMgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fc3VidGl0bGVcXFwiPtCh0L7QvtCx0YnQtdC90LjQtTwvaDM+PGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX19tZXMtcGxhbmtcXFwiPjwvZGl2PjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fbWVzLWNvbnRhaW5lclxcXCI+PGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX19tZXMtdGV4dFxcXCI+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+XCIpO30uY2FsbCh0aGlzLFwibWVzc2FnZXNcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLm1lc3NhZ2VzOnR5cGVvZiBtZXNzYWdlcyE9PVwidW5kZWZpbmVkXCI/bWVzc2FnZXM6dW5kZWZpbmVkLFwidW5kZWZpbmVkXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC51bmRlZmluZWQ6dHlwZW9mIHVuZGVmaW5lZCE9PVwidW5kZWZpbmVkXCI/dW5kZWZpbmVkOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGluZm8pIHtcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX19tZXMtdmFsXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBpbmZvLmFuc3dlcikgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+XCIpO30uY2FsbCh0aGlzLFwiaW5mb1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguaW5mbzp0eXBlb2YgaW5mbyE9PVwidW5kZWZpbmVkXCI/aW5mbzp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChpbmZvKSB7XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcIm1lc3Nlbmdlcl9fbWVzLXRpdGxlXFxcIj7QktC+0L/RgNC+0YE6PC9kaXY+PGRpdiBjbGFzcz1cXFwibWVzc2VuZ2VyX19tZXMtdmFsXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBpbmZvLnF1ZXN0aW9uKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJfX21lcy10aXRsZVxcXCI+0J7RgtCy0LXRgjo8L2Rpdj48ZGl2IGNsYXNzPVxcXCJtZXNzZW5nZXJfX21lcy12YWxcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGluZm8uYW5zd2VyKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj5cIik7fS5jYWxsKHRoaXMsXCJpbmZvXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5pbmZvOnR5cGVvZiBpbmZvIT09XCJ1bmRlZmluZWRcIj9pbmZvOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsIm9rVGVtcGxhdGUgPSByZXF1aXJlKCcuL21vbmV5X29rLmphZGUnKVxyXG5mYWlsVGVtcGxhdGUgPSByZXF1aXJlKCcuL21vbmV5X2ZhaWwuamFkZScpXHJcbnJlcXVlc3QgPSByZXF1aXJlKCcuLi9yZXF1ZXN0JylcclxuXHJcbmNvbnRhaW5lcl9pZCA9IDBcclxuXHJcbm1vZHVsZS5leHBvcnRzLm9wZW5Nb2RhbCA9IChpZCwgb2JqKSAtPlxyXG5cdGNvbnRhaW5lcl9pZCA9IGlkXHJcblx0Y29uc29sZS5sb2cgb2JqXHJcblx0JChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2NvbnRhaW5lcl9pZH1dXCIpLmZpbmQoJy5wb3B1cCcpLmFkZENsYXNzKCdwb3B1cC0tbWVzJylcclxuXHRpZiBvYmoucmVzID09IFwib2tcIlxyXG5cdFx0JChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2NvbnRhaW5lcl9pZH1dXCIpLmZpbmQoJy5wb3B1cF9fZm9ybG9hZGluZycpLmh0bWwgb2tUZW1wbGF0ZSh7fSlcclxuXHRpZiBvYmoucmVzID09IFwiZmFpbFwiXHJcblx0XHQkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7Y29udGFpbmVyX2lkfV1cIikuZmluZCgnLnBvcHVwX19mb3Jsb2FkaW5nJykuaHRtbCBmYWlsVGVtcGxhdGUoe30pXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jbG9zZU1vZGFsID0gLT5cclxuXHQkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7Y29udGFpbmVyX2lkfV1cIikuZmluZCgnLnBvcHVwJykucmVtb3ZlQ2xhc3MoJ3BvcHVwLS1tZXMnKVxyXG5cclxuXHJcbiIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuXG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcInBvcHVwX193cmFwLS1pbnRyb1xcXCI+PGRpdiBjbGFzcz1cXFwiY2hwb3B1cF9fbW9uZXltZXNcXFwiPjxwPtCi0Ysg0LHRi9C7INC+0YfQtdC90Ywg0LHQu9C40LfQvtC6INC6INGN0YLQvtC80YMg0L/RgNC40LfRgywg0L3QviDQutGC0L4t0YLQviDQvtC60LDQt9Cw0LvRgdGPINC90LAg0LTQvtC70Y4g0YHQtdC60YPQvdC00Ysg0LHRi9GB0YLRgNC10LUgKDwvcD48cD7QndC1INC+0YLRh9Cw0LjQstCw0LnRgdGPISDQl9Cw0LLRgtGA0LAg0LzRiyDRgNCw0LfRi9Cz0YDQsNC10Lwg0LXRidC1IDUwMCDRgNGD0LHQu9C10LksINC/0L7RgtC+0Lwg0LXRidC1INC4INC10YnQtSDigJMg0Lgg0YLQsNC6INC60LDQttC00YvQuSDQtNC10L3RjCDQsdC10Lcg0LLRi9GF0L7QtNC90YvRhS4g0KLQtdCx0LUg0L3QsNCy0LXRgNC90Y/QutCwINC/0L7QstC10LfQtdGCISDQodC/0LDRgdC40LHQviwg0LjQs9GA0LDQuSDRgSDQvdCw0LzQuCDQtdGJ0LUhPC9wPjwvZGl2PjwvZGl2PlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJwb3B1cF9fd3JhcC0taW50cm9cXFwiPjxkaXYgY2xhc3M9XFxcImNocG9wdXBfX21vbmV5bWVzXFxcIj48cD7Qn9C+0LfQtNGA0LDQstC70Y/QtdC8LCDRgtGLINC/0LXRgNCy0YvQvCDQvdCw0YjQtdC7INGB0LXQs9C+0LTQvdGP0YjQvdC40LUg0L/RgNC40LfQvtCy0YvQtSDQtNC10L3RjNCz0Lgg0L3QsCDRgtC10LvQtdGE0L7QvSEg0JrRgNCw0YHQsNCy0YfQuNC6ITwvcD48cD7QldGB0LvQuCDRgtCy0L7RjyDQsNC90LrQtdGC0LAg0LfQsNC/0L7Qu9C90LXQvdCwIOKAkyDQtNC10L3RjNCz0Lgg0YHQutC+0YDQviDRg9C/0LDQtNGD0YIg0L3QsCDRgdGH0LXRgiDRgtCy0L7QtdCz0L4g0LzQvtCx0LjQu9GM0L3QvtCz0L4uINCV0YHQu9C4INC90LXRgiDigJMg0LfQsNC/0L7Qu9C90Lgg0LXQtSwg0L3QtSDQvtGC0LrQu9Cw0LTRi9Cy0LDRjy4g0KHQv9Cw0YHQuNCx0L4sINC40LPRgNCw0Lkg0YEg0L3QsNC80Lgg0LXRidC1ITwvcD48L2Rpdj48L2Rpdj5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidGVtcGxhdGUgPSByZXF1aXJlKCcuL215cHJpemVzLmphZGUnKVxyXG5yZXF1ZXN0ID0gcmVxdWlyZSAnLi4vcmVxdWVzdCdcclxuY29udGFpbmVyX2lkID0gMFxyXG5cclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMub3Blbk1vZGFsID0gKGlkLCBvcHRzKSAtPlxyXG5cdGNvbnRhaW5lcl9pZCA9IGlkXHJcblx0JChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2NvbnRhaW5lcl9pZH1dXCIpLmZpbmQoJy5wb3B1cCcpLmFkZENsYXNzKCdwb3B1cC0tbXlwcml6ZXMnKVxyXG5cclxuXHRyZXF1ZXN0LnByaXplLmdldCB7fSwgKHJlcykgLT5cclxuXHRcdGNvbnNvbGUubG9nIHJlc1xyXG5cdFx0Zm9yIGtleSxlbCBvZiByZXNcclxuXHRcdFx0ZWwuZm9ybWF0dGVkX2RhdGUgPSBtb21lbnQoZWwuZGF0ZSoxMDAwKS5mb3JtYXQoXCJERC5NTS5ZWVlZXCIpXHJcblx0XHQkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7Y29udGFpbmVyX2lkfV1cIikuZmluZCgnLnBvcHVwX19mb3Jsb2FkaW5nJykuaHRtbCB0ZW1wbGF0ZSh7aW5mbzpyZXN9KVxyXG5cdFx0JChcIi5teXByaXplc19fbGlzdFwiKS5jdXN0b21TY3JvbGwoe3ByZWZpeDogXCJjdXN0b20tYmlnc2Nyb2xsX1wifSlcclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2xvc2VNb2RhbCA9IChpZCkgLT5cclxuXHQkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7Y29udGFpbmVyX2lkfV1cIikuZmluZCgnLnBvcHVwJykucmVtb3ZlQ2xhc3MoJ3BvcHVwLS1teXByaXplcycpXHJcbiIsInZhciBqYWRlID0gcmVxdWlyZShcImphZGUvcnVudGltZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0ZW1wbGF0ZShsb2NhbHMpIHtcbnZhciBidWYgPSBbXTtcbnZhciBqYWRlX21peGlucyA9IHt9O1xudmFyIGphZGVfaW50ZXJwO1xuO3ZhciBsb2NhbHNfZm9yX3dpdGggPSAobG9jYWxzIHx8IHt9KTsoZnVuY3Rpb24gKGluZm8pIHtcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibXlwcml6ZXNcXFwiPjxoMyBjbGFzcz1cXFwibXlwcml6ZXNfX3RpdGxlXFxcIj7Qn9C+0LvRg9GH0LXQvdC90YvQtSDQv9GA0LjQt9GLPC9oMz5cIik7XG5pZiAoICFpbmZvWzBdICYmICFpbmZvWzFdICYmICFpbmZvWzJdKVxue1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJteXByaXplc19fbm9saXN0XFxcIj48ZGl2IGNsYXNzPVxcXCJteXByaXplc19fbm8tc3VidGl0bGVcXFwiPtCjINGC0LXQsdGPINC/0L7QutCwPGJyPtC90LXRgiDQv9GA0LjQt9C+0LIgOig8L2Rpdj48ZGl2IGNsYXNzPVxcXCJteXByaXplc19fbm8tdGV4dFxcXCI+0J/RgNC+0YXQvtC00Lgg0LrQstC10YHRgtGLLCDRgdC+0LHQuNGA0LDQuSDQutCw0Log0LzQvtC20L3Qvjxicj5cXG7QsdC+0LvRjNGI0LUg0LrRgNC10LrQtdGA0L7QsiBUVUMg4oCTINC4INC00LXQu9C40YHRjDxicj5cXG7RgdCy0L7QuNC80Lgg0LTQvtGB0YLQuNC20LXQvdC40Y/QvNC4INGBINC00YDRg9C30YzRj9C80LghPGJyPlxcbtCi0LDQuiDRgtGLINC/0L7QstGL0YHQuNGI0Ywg0YHQstC+0Lgg0YjQsNC90YHRiyDQvdCwINC/0YDQuNC3LjwvZGl2PjwvZGl2PlwiKTtcbn1cbmVsc2VcbntcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibXlwcml6ZXNfX2xpc3RcXFwiPlwiKTtcbmlmICggaW5mb1swXSlcbntcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibXlwcml6ZXNfX2RhdGVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGluZm9bMF0uZm9ybWF0dGVkX2RhdGUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjxkaXYgY2xhc3M9XFxcIm15cHJpemVzX19pY29uLXdyYXBwZXJcXFwiPjxpIGNsYXNzPVxcXCJpY29uLW15cHJpemVzLW1vbmV5IG15cHJpemVzX19tb25leXByaXplXFxcIj48L2k+PC9kaXY+XCIpO1xufVxuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJteXByaXplc19fc3VidGl0bGVcXFwiPtCX0LAg0LrQstC10YHRgtGLPC9kaXY+XCIpO1xuaWYgKCAhaW5mb1sxXSAmJiAhaW5mb1syXSlcbntcbmJ1Zi5wdXNoKFwiPGRpdj7Ql9C00LXRgdGMINC/0L7QutCwINC90LjRh9C10LPQviDQvdC10YIgPSg8L2Rpdj5cIik7XG59XG5pZiAoIGluZm9bMV0pXG57XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcIm15cHJpemVzX19kYXRlXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBpbmZvWzFdLmZvcm1hdHRlZF9kYXRlKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48ZGl2IGNsYXNzPVxcXCJteXByaXplc19fcXVlc3RuYW1lXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBpbmZvWzFdLnRpdGxlKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48ZGl2IGNsYXNzPVxcXCJteXByaXplc19faWNvbi13cmFwcGVyXFxcIj48aSBjbGFzcz1cXFwiaWNvbi1wcml6ZXMxIG15cHJpemVzX19zdXBlcnByaXplXFxcIj48L2k+PC9kaXY+PGRpdiBjbGFzcz1cXFwibXlwcml6ZXNfX3ByaXplbmFtZVxcXCI+0KHQsNC80L7QutCw0YIgT3hlbG8gVG93bjwvZGl2PlwiKTtcbn1cbmlmICggaW5mb1syXSlcbntcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwibXlwcml6ZXNfX2RhdGVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGluZm9bMl0uZm9ybWF0dGVkX2RhdGUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjxkaXYgY2xhc3M9XFxcIm15cHJpemVzX19pY29uLXdyYXBwZXJcXFwiPlwiKTtcbmlmICggaW5mb1syXS5wbGFjZT09MSlcbntcbmJ1Zi5wdXNoKFwiPGkgY2xhc3M9XFxcImljb24tcHJpemVzMyBteXByaXplc19fc3VwZXJwcml6ZVxcXCI+PC9pPlwiKTtcbn1cbmlmICggaW5mb1syXS5wbGFjZT09MilcbntcbmJ1Zi5wdXNoKFwiPGkgY2xhc3M9XFxcImljb24tcHJpemVzNCBteXByaXplc19fc3VwZXJwcml6ZVxcXCI+PC9pPlwiKTtcbn1cbmlmICggaW5mb1syXS5wbGFjZT09MylcbntcbmJ1Zi5wdXNoKFwiPGkgY2xhc3M9XFxcImljb24tcHJpemVzNSBteXByaXplc19fc3VwZXJwcml6ZVxcXCI+PC9pPlwiKTtcbn1cbmJ1Zi5wdXNoKFwiPC9kaXY+XCIpO1xuaWYgKCBpbmZvWzJdLnBsYWNlPT0xKVxue1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJteXByaXplc19fcHJpemVuYW1lXFxcIj7QrdC70LXQutGC0YDQvtGB0LDQvNC+0LrQsNGCIFJhem9yIEUzMDA8L2Rpdj5cIik7XG59XG5pZiAoIGluZm9bMl0ucGxhY2U9PTIpXG57XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcIm15cHJpemVzX19wcml6ZW5hbWVcXFwiPtCa0LLQsNC00YDQvtC60L7Qv9GC0LXRgCBQYXJyb3QgQVIuRHJvbmUgMi4wPC9kaXY+XCIpO1xufVxuaWYgKCBpbmZvWzJdLnBsYWNlPT0zKVxue1xuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJteXByaXplc19fcHJpemVuYW1lXFxcIj7Qn9C+0YDRgtCw0YLQuNCy0L3QsNGPINC60L7Qu9C+0L3QutCwIEpCTCBQdWxzZTwvZGl2PlwiKTtcbn1cbn1cbmJ1Zi5wdXNoKFwiPC9kaXY+XCIpO1xufVxuYnVmLnB1c2goXCI8L2Rpdj5cIik7fS5jYWxsKHRoaXMsXCJpbmZvXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5pbmZvOnR5cGVvZiBpbmZvIT09XCJ1bmRlZmluZWRcIj9pbmZvOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsIm5ld3Rhc3RlVGVtcGxhdGUgPSByZXF1aXJlKCcuL25ld3Rhc3RlLmphZGUnKVxyXG5yZXF1ZXN0ID0gcmVxdWlyZSgnLi4vcmVxdWVzdCcpXHJcbnBvcHVwcyA9IHJlcXVpcmUgJy4vaW5kZXguY29mZmVlJ1xyXG5cclxubW9kdWxlLmV4cG9ydHMub3Blbk1vZGFsID0gKGlkKSAtPlxyXG4gIGNvbnRhaW5lcl9pZCA9IGlkXHJcbiAgJChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2lkfV1cIilcclxuICAkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7aWR9XVwiKS5maW5kKCcucG9wdXBfX2ZvcmxvYWRpbmcnKS5odG1sKG5ld3Rhc3RlVGVtcGxhdGUpXHJcbiAgJChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2lkfV1cIikuZmluZCgnLnBvcHVwJykuYWRkQ2xhc3MoJ3BvcHVwX190YXN0ZScpXHJcblxyXG4iLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcblxuYnVmLnB1c2goXCI8ZGl2IGNsYXNzPVxcXCJ0YXN0ZV9fd3JhcFxcXCI+PGgyIGNsYXNzPVxcXCJ0YXN0ZV9fdGl0bGVcXFwiPtCY0LzQtdC90L3QviE8L2gyPjxkaXYgY2xhc3M9XFxcInRhc3RlX19ib2R5XFxcIj48ZGl2IGNsYXNzPVxcXCJ0YXN0ZV9fYm9keS10ZXh0XFxcIj48cD7QndCw0YfQuNGB0LvRj9C10Lwg0YLQtdCx0LUgMjAwINCx0LDQu9C70L7Qsi48L3A+PHA+0J3QtSDQt9Cw0LHRg9C00Ywg0L/QvtC/0YDQvtCx0L7QstCw0YLRjDwvcD48UD7QndC+0LLRi9C5IFR1YyE8L1A+PC9kaXY+PGRpdiBjbGFzcz1cXFwidGFzdGVfX2JvZHktaW1nXFxcIj48aW1nIHNyYz1cXFwiaW1nL2ltYWdlcy90dWMtMjAwLnBuZ1xcXCIvPjwvZGl2PjwvZGl2PjwvZGl2PlwiKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJwaXp6YVRlbXBsYXRlID0gcmVxdWlyZSgnLi9waXp6YS5qYWRlJylcclxucmVxdWVzdCA9IHJlcXVpcmUoJy4uL3JlcXVlc3QnKVxyXG5cclxuY29udGFpbmVyX2lkID0gMFxyXG5cclxubW9kdWxlLmV4cG9ydHMub3Blbk1vZGFsID0gKGlkLCBvYmopIC0+XHJcblx0Y29udGFpbmVyX2lkID0gaWRcclxuXHRjb25zb2xlLmxvZyBvYmpcclxuXHQkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7Y29udGFpbmVyX2lkfV1cIikuZmluZCgnLnBvcHVwJykuYWRkQ2xhc3MoJ3BvcHVwLS1waXp6YScpXHJcblx0JChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2NvbnRhaW5lcl9pZH1dXCIpLmZpbmQoJy5wb3B1cF9fZm9ybG9hZGluZycpLmh0bWwgcGl6emFUZW1wbGF0ZSh7aW5mbzogb2JqfSlcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jbG9zZU1vZGFsID0gLT5cclxuXHQkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7Y29udGFpbmVyX2lkfV1cIikuZmluZCgnLnBvcHVwJykucmVtb3ZlQ2xhc3MoJ3BvcHVwLS1waXp6YScpXHJcblxyXG5cclxuIiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG5cbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwiY2hwb3B1cFxcXCI+PGRpdiBjbGFzcz1cXFwiY2hwb3B1cF9fcGl6emEtdGl0bGVcXFwiPis1MCDQsdCw0LvQu9C+0LIhPC9kaXY+PGRpdiBjbGFzcz1cXFwiY2hwb3B1cF9fcGl6emEtZGVzY1xcXCI+0J/QvtC30LTRgNCw0LLQu9GP0LXQvCwg0YLRiyDQvdCw0YjQtdC7INC90L7QstGL0LkgVFVDINCf0LjRhtGG0LAhXFxu0JAg0YLQtdC/0LXRgNGMINC/0L7Qv9GA0L7QsdGD0Lkg0L3QsNC50YLQuCDQtdCz0L4g0L/Qvi3QvdCw0YHRgtC+0Y/RidC10LzRgyDQsiDQvNCw0LPQsNC30LjQvdCw0YUg0YHQstC+0LXQs9C+INCz0L7RgNC+0LTQsCE8L2Rpdj48ZGl2IGNsYXNzPVxcXCJjaHBvcHVwX19waXp6YS1kZXNjMlxcXCI+0KPQtNCw0YfQuCDQuCDQv9GA0LjRj9GC0L3QvtCz0L4g0LDQv9C/0LXRgtC40YLQsCE8L2Rpdj48L2Rpdj5cIik7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07IiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAoaG9zdCwgbGVhZGVycywgdW5kZWZpbmVkKSB7XG4vLyBpdGVyYXRlIGxlYWRlcnNcbjsoZnVuY3Rpb24oKXtcbiAgdmFyICQkb2JqID0gbGVhZGVycztcbiAgaWYgKCdudW1iZXInID09IHR5cGVvZiAkJG9iai5sZW5ndGgpIHtcblxuICAgIGZvciAodmFyIGluZGV4ID0gMCwgJCRsID0gJCRvYmoubGVuZ3RoOyBpbmRleCA8ICQkbDsgaW5kZXgrKykge1xuICAgICAgdmFyIGxlYWRlciA9ICQkb2JqW2luZGV4XTtcblxuYnVmLnB1c2goXCI8YVwiICsgKGphZGUuYXR0cihcImhyZWZcIiwgXCJcIiArIChob3N0K2xlYWRlci5saW5rKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiB0YXJnZXQ9XFxcIl9ibGFua1xcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fZWxcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2NvdW50ZXJcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGxlYWRlci5wbGFjZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PGltZ1wiICsgKGphZGUuYXR0cihcInNyY1wiLCBcIlwiICsgKGxlYWRlci5waG90bykgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImxlYWRlcnNfX3Bob3RvXFxcIi8+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fcmlnaHRcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX25hbWVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGxlYWRlci5uaWNrbmFtZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PC9kaXY+PC9kaXY+PC9hPlwiKTtcbiAgICB9XG5cbiAgfSBlbHNlIHtcbiAgICB2YXIgJCRsID0gMDtcbiAgICBmb3IgKHZhciBpbmRleCBpbiAkJG9iaikge1xuICAgICAgJCRsKys7ICAgICAgdmFyIGxlYWRlciA9ICQkb2JqW2luZGV4XTtcblxuYnVmLnB1c2goXCI8YVwiICsgKGphZGUuYXR0cihcImhyZWZcIiwgXCJcIiArIChob3N0K2xlYWRlci5saW5rKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiB0YXJnZXQ9XFxcIl9ibGFua1xcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fZWxcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2NvdW50ZXJcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGxlYWRlci5wbGFjZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PGltZ1wiICsgKGphZGUuYXR0cihcInNyY1wiLCBcIlwiICsgKGxlYWRlci5waG90bykgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImxlYWRlcnNfX3Bob3RvXFxcIi8+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fcmlnaHRcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX25hbWVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IGxlYWRlci5uaWNrbmFtZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PC9kaXY+PC9kaXY+PC9hPlwiKTtcbiAgICB9XG5cbiAgfVxufSkuY2FsbCh0aGlzKTtcbn0uY2FsbCh0aGlzLFwiaG9zdFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguaG9zdDp0eXBlb2YgaG9zdCE9PVwidW5kZWZpbmVkXCI/aG9zdDp1bmRlZmluZWQsXCJsZWFkZXJzXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5sZWFkZXJzOnR5cGVvZiBsZWFkZXJzIT09XCJ1bmRlZmluZWRcIj9sZWFkZXJzOnVuZGVmaW5lZCxcInVuZGVmaW5lZFwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgudW5kZWZpbmVkOnR5cGVvZiB1bmRlZmluZWQhPT1cInVuZGVmaW5lZFwiP3VuZGVmaW5lZDp1bmRlZmluZWQpKTs7cmV0dXJuIGJ1Zi5qb2luKFwiXCIpO1xufTsiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChhY3RpdmUsIGxlZnRfYWN0aXZlLCBwYWdlcywgcmlnaHRfYWN0aXZlLCB1bmRlZmluZWQpIHtcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwicGFnaW5hdGlvblxcXCI+PHNwYW5cIiArIChqYWRlLmNscyhbJ3BhZ2luYXRpb25fX2xlZnRidXQnLGxlZnRfYWN0aXZlID8gXCJwYWdpbmF0aW9uX19idXQtLWFjdGl2ZVwiIDogXCJcIl0sIFtudWxsLHRydWVdKSkgKyBcIj48PC9zcGFuPlwiKTtcbi8vIGl0ZXJhdGUgcGFnZXNcbjsoZnVuY3Rpb24oKXtcbiAgdmFyICQkb2JqID0gcGFnZXM7XG4gIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgJCRvYmoubGVuZ3RoKSB7XG5cbiAgICBmb3IgKHZhciAkaW5kZXggPSAwLCAkJGwgPSAkJG9iai5sZW5ndGg7ICRpbmRleCA8ICQkbDsgJGluZGV4KyspIHtcbiAgICAgIHZhciBwYWdlID0gJCRvYmpbJGluZGV4XTtcblxuaWYgKCBwYWdlPT1cImRvdHNcIilcbntcbmJ1Zi5wdXNoKFwiPHNwYW4gY2xhc3M9XFxcInBhZ2luYXRpb25fX2RvdHNcXFwiPi4uLjwvc3Bhbj5cIik7XG59XG5lbHNlXG57XG5idWYucHVzaChcIjxzcGFuXCIgKyAoamFkZS5hdHRyKFwiZGF0YS1ocmVmXCIsIFwiXCIgKyAocGFnZS52YWx1ZSkgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgKGphZGUuY2xzKFsncGFnaW5hdGlvbl9fcGFnZScsKGFjdGl2ZT09cGFnZS52YWx1ZSkgPyBcInBhZ2luYXRpb25fX3BhZ2UtLWFjdGl2ZVwiIDogXCJcIl0sIFtudWxsLHRydWVdKSkgKyBcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSBwYWdlLnRleHQpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvc3Bhbj5cIik7XG59XG4gICAgfVxuXG4gIH0gZWxzZSB7XG4gICAgdmFyICQkbCA9IDA7XG4gICAgZm9yICh2YXIgJGluZGV4IGluICQkb2JqKSB7XG4gICAgICAkJGwrKzsgICAgICB2YXIgcGFnZSA9ICQkb2JqWyRpbmRleF07XG5cbmlmICggcGFnZT09XCJkb3RzXCIpXG57XG5idWYucHVzaChcIjxzcGFuIGNsYXNzPVxcXCJwYWdpbmF0aW9uX19kb3RzXFxcIj4uLi48L3NwYW4+XCIpO1xufVxuZWxzZVxue1xuYnVmLnB1c2goXCI8c3BhblwiICsgKGphZGUuYXR0cihcImRhdGEtaHJlZlwiLCBcIlwiICsgKHBhZ2UudmFsdWUpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIChqYWRlLmNscyhbJ3BhZ2luYXRpb25fX3BhZ2UnLChhY3RpdmU9PXBhZ2UudmFsdWUpID8gXCJwYWdpbmF0aW9uX19wYWdlLS1hY3RpdmVcIiA6IFwiXCJdLCBbbnVsbCx0cnVlXSkpICsgXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gcGFnZS50ZXh0KSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L3NwYW4+XCIpO1xufVxuICAgIH1cblxuICB9XG59KS5jYWxsKHRoaXMpO1xuXG5idWYucHVzaChcIjxzcGFuXCIgKyAoamFkZS5jbHMoWydwYWdpbmF0aW9uX19yaWdodGJ1dCcscmlnaHRfYWN0aXZlID8gXCJwYWdpbmF0aW9uX19idXQtLWFjdGl2ZVwiIDogXCJcIl0sIFtudWxsLHRydWVdKSkgKyBcIj4+PC9zcGFuPjwvZGl2PlwiKTt9LmNhbGwodGhpcyxcImFjdGl2ZVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGguYWN0aXZlOnR5cGVvZiBhY3RpdmUhPT1cInVuZGVmaW5lZFwiP2FjdGl2ZTp1bmRlZmluZWQsXCJsZWZ0X2FjdGl2ZVwiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgubGVmdF9hY3RpdmU6dHlwZW9mIGxlZnRfYWN0aXZlIT09XCJ1bmRlZmluZWRcIj9sZWZ0X2FjdGl2ZTp1bmRlZmluZWQsXCJwYWdlc1wiIGluIGxvY2Fsc19mb3Jfd2l0aD9sb2NhbHNfZm9yX3dpdGgucGFnZXM6dHlwZW9mIHBhZ2VzIT09XCJ1bmRlZmluZWRcIj9wYWdlczp1bmRlZmluZWQsXCJyaWdodF9hY3RpdmVcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnJpZ2h0X2FjdGl2ZTp0eXBlb2YgcmlnaHRfYWN0aXZlIT09XCJ1bmRlZmluZWRcIj9yaWdodF9hY3RpdmU6dW5kZWZpbmVkLFwidW5kZWZpbmVkXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC51bmRlZmluZWQ6dHlwZW9mIHVuZGVmaW5lZCE9PVwidW5kZWZpbmVkXCI/dW5kZWZpbmVkOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsImxlYWRlcnNUZW1wbGF0ZSA9IHJlcXVpcmUoJy4vcmF0aW5nLmphZGUnKVxyXG5saXN0VGVtcGxhdGUgPSByZXF1aXJlICcuL3JhdGluZy1saXN0LmphZGUnXHJcbnBhZ1RlbXBsYXRlID0gcmVxdWlyZSAnLi9yYXRpbmctcGFnaW5hdGlvbi5qYWRlJ1xyXG5jb250YWluZXJfaWQgPSAwXHJcbnJlcXVlc3QgPSByZXF1aXJlICcuLi9yZXF1ZXN0J1xyXG5cclxuUEFHRV9FTFMgPSA1MFxyXG5ob3N0ID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sK1wiLy92ay5jb20vaWRcIlxyXG5jb21tb25fcGFnZSA9IDBcclxuY3VycmVudF9wYWdlID0gMFxyXG5jdXJ0eXBlID0gXCJjb21tb25cIlxyXG5cclxubW9kdWxlLmV4cG9ydHMub3Blbk1vZGFsID0gKGlkKSAtPlxyXG5cdGNvbnRhaW5lcl9pZCA9IGlkXHJcblx0cmVxdWVzdC5yYXRpbmcuYWxsIHtvZmZzZXQ6IDAsIGNvdW50OiBQQUdFX0VMU30sIChyZXMpIC0+XHJcblx0XHRjb25zb2xlLmxvZyByZXNcclxuXHJcblx0XHQkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7Y29udGFpbmVyX2lkfV1cIikuZmluZCgnLnBvcHVwX19mb3Jsb2FkaW5nJykuaHRtbCBsZWFkZXJzVGVtcGxhdGUoe3JlczpyZXMsIGhvc3Q6aG9zdH0pXHJcblx0XHRzd2l0Y2hMaXN0ZW5lcnMoKVxyXG5cdFx0JCgnLnBvcGxlYWRlcnNfX2NvbW1vbiAucG9wbGVhZGVyc19fY2F0JykuaHRtbCBsaXN0VGVtcGxhdGUoe2xlYWRlcnM6IHJlcy5jb21tb24ubGVhZGVycywgaG9zdDpob3N0fSlcclxuXHRcdCQoJy5wb3BsZWFkZXJzX19jdXJyZW50IC5wb3BsZWFkZXJzX19jYXQnKS5odG1sIGxpc3RUZW1wbGF0ZSh7bGVhZGVyczogcmVzLmN1cnJlbnQubGVhZGVycywgaG9zdDpob3N0fSlcclxuXHRcdGhhbmRsZVBhZ2VzKFwiY29tbW9uXCIsIHJlcy5jb21tb24pXHJcblx0XHRoYW5kbGVQYWdlcyhcImN1cnJlbnRcIiwgcmVzLmN1cnJlbnQpXHJcblxyXG5cclxuXHRcdCQoXCIucG9wbGVhZGVyc19fY29tbW9uIC5wb3BsZWFkZXJzX19saXN0XCIpLmN1c3RvbVNjcm9sbCgpXHJcblx0XHQkKFwiLnBvcGxlYWRlcnNfX2N1cnJlbnQgLnBvcGxlYWRlcnNfX2xpc3RcIikuY3VzdG9tU2Nyb2xsKClcclxuXHJcbm1vZHVsZS5leHBvcnRzLmNsb3NlTW9kYWwgPSAtPlxyXG5cclxuaGFuZGxlUGFnZXMgPSAodHlwZSwgb2JqLCBhY3RpdmUpIC0+XHJcblx0cGFnZXMgPSBbXVxyXG5cdGFjdGl2ZSA9IHBhcnNlSW50KGFjdGl2ZSkgfHwgMFxyXG5cdHBhZ2VzX251bSA9IE1hdGguY2VpbChvYmouY291bnQvUEFHRV9FTFMpXHJcblx0bGVmdF9hY3RpdmUgPSByaWdodF9hY3RpdmUgPSB0cnVlXHJcblx0aWYgYWN0aXZlPT0wIHRoZW4gbGVmdF9hY3RpdmUgPSBmYWxzZVxyXG5cdGlmIGFjdGl2ZT09cGFnZXNfbnVtLTEgdGhlbiByaWdodF9hY3RpdmUgPSBmYWxzZVxyXG5cclxuXHJcblx0aWYob2JqLmNvdW50PD1QQUdFX0VMUylcclxuXHRcdHBhZ2VzID0gW3sgdGV4dDogMSwgdmFsdWU6IDB9XVxyXG5cdFx0YWN0aXZlID0gMFxyXG5cclxuXHRlbHNlIGlmKFBBR0VfRUxTPG9iai5jb3VudDw9UEFHRV9FTFMqNClcclxuXHRcdHBhZ2VzID0gW3t2YWx1ZTppLCB0ZXh0OmkrMX0gZm9yIGkgaW4gWzAuLi5wYWdlc19udW1dXVswXVxyXG5cdGVsc2VcclxuXHRcdGlmIGFjdGl2ZTw9MVxyXG5cdFx0XHRmb3IgaSBpbiBbMC4uLjNdXHJcblx0XHRcdFx0cGFnZXMucHVzaCB7dmFsdWU6aSwgdGV4dDogaSsxfVxyXG5cdFx0XHRpZiBwYWdlc19udW0+MysxIHRoZW4gcGFnZXMucHVzaChcImRvdHNcIilcclxuXHRcdFx0cGFnZXMucHVzaCh7dmFsdWU6cGFnZXNfbnVtLTEsIHRleHQ6IHBhZ2VzX251bX0pXHJcblx0XHRlbHNlIGlmIGFjdGl2ZTxwYWdlc19udW0tMlxyXG5cdFx0XHRwYWdlcy5wdXNoIHsgdGV4dDogMSwgdmFsdWU6IDB9XHJcblx0XHRcdGlmIGFjdGl2ZT49MyB0aGVuIHBhZ2VzLnB1c2goXCJkb3RzXCIpXHJcblx0XHRcdGZvciBpIGluIFthY3RpdmUtMSwgYWN0aXZlLCBhY3RpdmUrMV1cclxuXHRcdFx0XHRwYWdlcy5wdXNoIHt2YWx1ZTppLCB0ZXh0OiBpKzF9XHJcblx0XHRcdGlmIGFjdGl2ZTw9cGFnZXNfbnVtLTQgdGhlbiBwYWdlcy5wdXNoKFwiZG90c1wiKVxyXG5cdFx0XHRwYWdlcy5wdXNoKHt2YWx1ZTpwYWdlc19udW0tMSwgdGV4dDogcGFnZXNfbnVtfSlcclxuXHRcdGVsc2VcclxuXHRcdFx0cGFnZXMucHVzaCB7IHRleHQ6IDEsIHZhbHVlOiAwfVxyXG5cdFx0XHRpZiBhY3RpdmU+PTMgdGhlbiBwYWdlcy5wdXNoKFwiZG90c1wiKVxyXG5cdFx0XHRmb3IgaSBpbiBbcGFnZXNfbnVtLTMuLnBhZ2VzX251bS0xXVxyXG5cdFx0XHRcdHBhZ2VzLnB1c2gge3ZhbHVlOmksIHRleHQ6IGkrMX1cclxuXHJcblx0JCgnLnBvcGxlYWRlcnNfX2NvbW1vbiAucG9wbGVhZGVyc19fcGFnaW5hdGlvbicpLmh0bWwgcGFnVGVtcGxhdGUoe3BhZ2VzOiBwYWdlcywgYWN0aXZlOmFjdGl2ZSwgbGVmdF9hY3RpdmU6IGxlZnRfYWN0aXZlLCByaWdodF9hY3RpdmU6IHJpZ2h0X2FjdGl2ZX0pIGlmIHR5cGU9PVwiY29tbW9uXCJcclxuXHQkKCcucG9wbGVhZGVyc19fY3VycmVudCAucG9wbGVhZGVyc19fcGFnaW5hdGlvbicpLmh0bWwgcGFnVGVtcGxhdGUoe3BhZ2VzOiBwYWdlcywgYWN0aXZlOmFjdGl2ZSwgbGVmdF9hY3RpdmU6IGxlZnRfYWN0aXZlLCByaWdodF9hY3RpdmU6IHJpZ2h0X2FjdGl2ZX0pIGlmIHR5cGU9PVwiY3VycmVudFwiXHJcblxyXG5zd2l0Y2hMaXN0ZW5lcnMgPSAtPlxyXG5cdCQoJy5sZWFkZXJzX19zd2l0Y2hjb21tb24nKS5vbiAnY2xpY2snLCAtPlxyXG5cdFx0JCgnLmxlYWRlcnNfX3N3aXRjaGNvbW1vbicpLmFkZENsYXNzKCdsZWFkZXJzX19zd2l0Y2hidXQtLWFjdGl2ZScpXHJcblx0XHQkKCcubGVhZGVyc19fc3dpdGNoY3VycmVudCcpLnJlbW92ZUNsYXNzKCdsZWFkZXJzX19zd2l0Y2hidXQtLWFjdGl2ZScpXHJcblx0XHQkKCcucG9wbGVhZGVyc19fY29tbW9uJykuYWRkQ2xhc3MoJ3BvcGxlYWRlcl9fYWN0aXZlJylcclxuXHRcdCQoJy5wb3BsZWFkZXJzX19jdXJyZW50JykucmVtb3ZlQ2xhc3MoJ3BvcGxlYWRlcl9fYWN0aXZlJylcclxuXHRcdGN1cnR5cGUgPSBcImNvbW1vblwiXHJcblx0JCgnLmxlYWRlcnNfX3N3aXRjaGN1cnJlbnQnKS5vbiAnY2xpY2snLCAtPlxyXG5cdFx0JCgnLmxlYWRlcnNfX3N3aXRjaGN1cnJlbnQnKS5hZGRDbGFzcygnbGVhZGVyc19fc3dpdGNoYnV0LS1hY3RpdmUnKVxyXG5cdFx0JCgnLmxlYWRlcnNfX3N3aXRjaGNvbW1vbicpLnJlbW92ZUNsYXNzKCdsZWFkZXJzX19zd2l0Y2hidXQtLWFjdGl2ZScpXHJcblx0XHQkKCcucG9wbGVhZGVyc19fY3VycmVudCcpLmFkZENsYXNzKCdwb3BsZWFkZXJfX2FjdGl2ZScpXHJcblx0XHQkKCcucG9wbGVhZGVyc19fY29tbW9uJykucmVtb3ZlQ2xhc3MoJ3BvcGxlYWRlcl9fYWN0aXZlJylcclxuXHRcdGN1cnR5cGUgPSBcImN1cnJlbnRcIlxyXG5cdCQoJy5wb3BsZWFkZXJzX190YWInKS5vbiAnY2xpY2snLCAnLnBhZ2luYXRpb25fX2xlZnRidXQnLCAtPlxyXG5cdFx0dW5sZXNzICQodGhpcykuaGFzQ2xhc3MoJ3BhZ2luYXRpb25fX2J1dC0tYWN0aXZlJykgdGhlbiByZXR1cm5cclxuXHRcdGNvbnNvbGUubG9nICdsZWZ0J1xyXG5cdFx0aWYgY3VydHlwZT09XCJjb21tb25cIiB0aGVuIHN3aXRjaFBhZ2UoY3VydHlwZSwgZ2V0Q29tbW9uUGFnZSgpLTEpXHJcblx0XHRpZiBjdXJ0eXBlPT1cImN1cnJlbnRcIiB0aGVuIHN3aXRjaFBhZ2UoY3VydHlwZSwgZ2V0Q3VycmVudFBhZ2UoKS0xKVxyXG5cclxuXHQkKCcucG9wbGVhZGVyc19fdGFiJykub24gJ2NsaWNrJywgJy5wYWdpbmF0aW9uX19yaWdodGJ1dCcsIC0+XHJcblx0XHR1bmxlc3MgJCh0aGlzKS5oYXNDbGFzcygncGFnaW5hdGlvbl9fYnV0LS1hY3RpdmUnKSB0aGVuIHJldHVyblxyXG5cdFx0aWYgY3VydHlwZT09XCJjb21tb25cIiB0aGVuIHN3aXRjaFBhZ2UoY3VydHlwZSwgZ2V0Q29tbW9uUGFnZSgpKzEpXHJcblx0XHRpZiBjdXJ0eXBlPT1cImN1cnJlbnRcIiB0aGVuIHN3aXRjaFBhZ2UoY3VydHlwZSwgZ2V0Q3VycmVudFBhZ2UoKSsxKVxyXG5cclxuXHQkKCcucG9wbGVhZGVycycpLm9uICdjbGljaycsICcucGFnaW5hdGlvbl9fcGFnZScsIC0+XHJcblx0XHRyZXR1cm4gaWYgJCh0aGlzKS5oYXNDbGFzcygncGFnaW5hdGlvbl9fcGFnZS0tYWN0aXZlJylcclxuXHRcdHR5cGUgPSAkKHRoaXMpLmNsb3Nlc3QoJy5wb3BsZWFkZXJzX190YWInKS5hdHRyKCdkYXRhLXR5cGUnKVxyXG5cdFx0dmFsID0gJCh0aGlzKS5hdHRyKCdkYXRhLWhyZWYnKVxyXG5cdFx0c3dpdGNoUGFnZSh0eXBlLCB2YWwpXHJcblxyXG5nZXRDdXJyZW50UGFnZSA9IC0+IHJldHVybiBjdXJyZW50X3BhZ2VcclxuZ2V0Q29tbW9uUGFnZSA9IC0+IHJldHVybiBjb21tb25fcGFnZVxyXG5cclxuc3dpdGNoUGFnZSA9ICh0eXBlLCB2YWwpIC0+XHJcblx0cmVxdWVzdC5yYXRpbmdbdHlwZV0ge2NvdW50OiBQQUdFX0VMUywgb2Zmc2V0OiB2YWwqUEFHRV9FTFN9LCAocmVzKS0+XHJcblx0XHRoYW5kbGVQYWdlcyh0eXBlLCByZXMsIHZhbClcclxuXHRcdGlmIHR5cGU9PVwiY29tbW9uXCJcclxuXHRcdFx0JCgnLnBvcGxlYWRlcnNfX2NvbW1vbiAucG9wbGVhZGVyc19fY2F0JykuaHRtbCBsaXN0VGVtcGxhdGUoe2xlYWRlcnM6IHJlcy5sZWFkZXJzLCBob3N0Omhvc3R9KVxyXG5cdFx0XHQkKCcucG9wbGVhZGVyc19fY29tbW9uIC5jdXN0b20tc2Nyb2xsX2lubmVyJykuc2Nyb2xsVG9wKDApXHJcblx0XHRcdGNvbW1vbl9wYWdlID0gcGFyc2VJbnQgdmFsXHJcblx0XHRpZiB0eXBlPT1cImN1cnJlbnRcIlxyXG5cdFx0XHQkKCcucG9wbGVhZGVyc19fY3VycmVudCAucG9wbGVhZGVyc19fY2F0JykuaHRtbCBsaXN0VGVtcGxhdGUoe2xlYWRlcnM6IHJlcy5sZWFkZXJzLCBob3N0Omhvc3R9KVxyXG5cdFx0XHQkKCcucG9wbGVhZGVyc19fY3VycmVudCAuY3VzdG9tLXNjcm9sbF9pbm5lcicpLnNjcm9sbFRvcCgwKVxyXG5cdFx0XHRjdXJyZW50X3BhZ2UgPSBwYXJzZUludCB2YWxcclxuIiwidmFyIGphZGUgPSByZXF1aXJlKFwiamFkZS9ydW50aW1lXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRlbXBsYXRlKGxvY2Fscykge1xudmFyIGJ1ZiA9IFtdO1xudmFyIGphZGVfbWl4aW5zID0ge307XG52YXIgamFkZV9pbnRlcnA7XG47dmFyIGxvY2Fsc19mb3Jfd2l0aCA9IChsb2NhbHMgfHwge30pOyhmdW5jdGlvbiAocmVzKSB7XG5idWYucHVzaChcIjxkaXYgY2xhc3M9XFxcInBvcHVwX193cmFwLS1pbnRyb1xcXCI+PGRpdiBjbGFzcz1cXFwicG9wbGVhZGVyc1xcXCI+PGRpdiBjbGFzcz1cXFwicG9wbGVhZGVyc19fbGVmdFxcXCI+PGgzIGNsYXNzPVxcXCJwb3BsZWFkZXJzX190aXRsZVxcXCI+0KDQtdC50YLQuNC90LMg0LjQs9GA0Ys8L2gzPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3N3aXRjaGVyX3dyYXBwZXJcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX3N3aXRjaGVyXFxcIj48ZGl2IGRhdGEtaHJlZj1cXFwiLnBvcGxlYWRlcnNfX2NhdC0tY3VycmVudFxcXCIgY2xhc3M9XFxcImxlYWRlcnNfX3N3aXRjaGJ1dCBsZWFkZXJzX19zd2l0Y2hjdXJyZW50XFxcIj7QotC10LrRg9GJ0LjQuTwvZGl2PjxkaXYgZGF0YS1ocmVmPVxcXCIucG9wbGVhZGVyc19fY2F0LS1jb21tb25cXFwiIGNsYXNzPVxcXCJsZWFkZXJzX19zd2l0Y2hidXQgbGVhZGVyc19fc3dpdGNoYnV0LS1hY3RpdmUgbGVhZGVyc19fc3dpdGNoY29tbW9uXFxcIj7QntCx0YnQuNC5PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwicG9wbGVhZGVyc19fcmlnaHRcXFwiPjxkaXYgZGF0YS10eXBlPVxcXCJjb21tb25cXFwiIGNsYXNzPVxcXCJwb3BsZWFkZXJzX19jb21tb24gcG9wbGVhZGVyc19fdGFiIHBvcGxlYWRlcl9fYWN0aXZlXFxcIj48ZGl2IGNsYXNzPVxcXCJwb3BsZWFkZXJzX19saXN0XFxcIj48ZGl2IGNsYXNzPVxcXCJwb3BsZWFkZXJzX19jYXRcXFwiPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2VsXFxcIj48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19jb3VudGVyXFxcIj5cIiArIChqYWRlLmVzY2FwZSgoamFkZV9pbnRlcnAgPSByZXMuY29tbW9uLnlvdS5wbGFjZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PGltZ1wiICsgKGphZGUuYXR0cihcInNyY1wiLCBcIlwiICsgKHJlcy5jb21tb24ueW91LnBob3RvKSArIFwiXCIsIHRydWUsIGZhbHNlKSkgKyBcIiBjbGFzcz1cXFwibGVhZGVyc19fcGhvdG9cXFwiLz48ZGl2IGNsYXNzPVxcXCJsZWFkZXJzX19yaWdodFxcXCI+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fbmFtZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gcmVzLmNvbW1vbi55b3Uubmlja25hbWUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcInBvcGxlYWRlcnNfX3BhZ2luYXRpb25cXFwiPjwvZGl2PjwvZGl2PjxkaXYgZGF0YS10eXBlPVxcXCJjdXJyZW50XFxcIiBjbGFzcz1cXFwicG9wbGVhZGVyc19fY3VycmVudCBwb3BsZWFkZXJzX190YWJcXFwiPjxkaXYgY2xhc3M9XFxcInBvcGxlYWRlcnNfX2xpc3RcXFwiPjxkaXYgY2xhc3M9XFxcInBvcGxlYWRlcnNfX2NhdFxcXCI+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fZWxcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX2NvdW50ZXJcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IHJlcy5jdXJyZW50LnlvdS5wbGFjZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PGltZ1wiICsgKGphZGUuYXR0cihcInNyY1wiLCBcIlwiICsgKHJlcy5jdXJyZW50LnlvdS5waG90bykgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcImxlYWRlcnNfX3Bob3RvXFxcIi8+PGRpdiBjbGFzcz1cXFwibGVhZGVyc19fcmlnaHRcXFwiPjxkaXYgY2xhc3M9XFxcImxlYWRlcnNfX25hbWVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IHJlcy5jdXJyZW50LnlvdS5uaWNrbmFtZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwicG9wbGVhZGVyc19fcGFnaW5hdGlvblxcXCI+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+XCIpO30uY2FsbCh0aGlzLFwicmVzXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5yZXM6dHlwZW9mIHJlcyE9PVwidW5kZWZpbmVkXCI/cmVzOnVuZGVmaW5lZCkpOztyZXR1cm4gYnVmLmpvaW4oXCJcIik7XG59OyIsInVzZXJpbmZvVGVtcGxhdGUgPSByZXF1aXJlKCcuL3VzZXJpbmZvLmphZGUnKVxyXG5yZXF1ZXN0ID0gcmVxdWlyZSgnLi4vcmVxdWVzdCcpXHJcbnBvcHVwcyA9IHJlcXVpcmUgJy4vaW5kZXguY29mZmVlJ1xyXG5cclxuZWRpdGluZyA9IHRydWVcclxubm9mdWxsID0gZmFsc2VcclxuY2FsbGJhY2sgPSBudWxsXHJcbmNvbnRhaW5lcl9pZCA9IDBcclxuXHJcbm1vZHVsZS5leHBvcnRzLm9wZW5Nb2RhbCA9IChpZCwgb2JqPXt9LCBfY2FsbGJhY2spIC0+XHJcblx0ZWRpdGluZyA9IHRydWVcclxuXHRjYWxsYmFjayA9IF9jYWxsYmFja1xyXG5cdGNvbnRhaW5lcl9pZCA9IGlkXHJcblx0JChcIi5wb3B1cF9fc2hhZGVbZGF0YS1pZD0je2lkfV1cIikuZmluZCgnLnBvcHVwJykuYWRkQ2xhc3MoJ3BvcHVwLS11c2VyaW5mbycpXHJcblxyXG5cclxuXHRyZXF1ZXN0LnVzZXIuZ2V0IHt9LCAocmVzKSAtPlxyXG5cdFx0bm9mdWxsID0gb2JqLm5vZnVsbFxyXG5cdFx0Z2V0VXNlclhIUkhhbmRsZXIocmVzKVxyXG5cclxuXHRcdCQoJy51c2VyaW5mb19fZm9ybScpLm9uIFwic3VibWl0XCIsIGZvcm1PcGVuSGFuZGxlclxyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jbG9zZU1vZGFsID0gLT5cclxuXHQkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7Y29udGFpbmVyX2lkfV1cIikuZmluZCgnLnBvcHVwJykucmVtb3ZlQ2xhc3MoJ3BvcHVwLS11c2VyaW5mbycpXHJcblx0JCgnLnVzZXJpbmZvX19mb3JtJykub2ZmIFwic3VibWl0XCIsIGZvcm1PcGVuSGFuZGxlclxyXG5cclxuXHJcbmdldFVzZXJYSFJIYW5kbGVyID0gKHJlcykgLT5cclxuXHQkKFwiLnBvcHVwX19zaGFkZVtkYXRhLWlkPSN7Y29udGFpbmVyX2lkfV1cIikuZmluZCgnLnBvcHVwX19mb3Jsb2FkaW5nJykuaHRtbCB1c2VyaW5mb1RlbXBsYXRlKHt1c2VyOnJlc1swXSwgbm9mdWxsOm5vZnVsbH0pXHJcblx0JCgnLnVzZXJpbmZvX19lcnJvci1tZXMnKS5hZGRDbGFzcygndXNlcmluZm9fX2Vycm9yLW1lcy0taW52aXMnKVxyXG5cdCQoJy51c2VyaW5mb19faW5wdXRbbmFtZT1cImJkYXRlXCJdJykubWFzayAnMDkuMDkuMDAwMCcsIHRyYW5zbGF0aW9uOiB7XHJcblx0XHQnOSc6IHtwYXR0ZXJuOiAvXFxkLywgb3B0aW9uYWw6IHRydWV9XHJcblx0fVxyXG5cdCQoJy51c2VyaW5mb19faW5wdXRbbmFtZT1cInBob25lXCJdJykubWFzaygnKzcgMDAwIDAwMCAwMDAwJylcclxuXHJcblxyXG5mb3JtT3BlbkhhbmRsZXIgPSAoZSkgLT5cclxuXHRlLnByZXZlbnREZWZhdWx0KCkgaWYgZT9cclxuXHRlZGl0aW5nID0gIWVkaXRpbmdcclxuXHRpZiBlZGl0aW5nXHJcblx0XHQkKCcudXNlcmluZm9fX2lucHV0JykuZWFjaCAoaSxlbCkgLT5cclxuXHRcdFx0dGV4dCA9ICQoZWwpLnBhcmVudCgpLmZpbmQoXCIudXNlcmluZm9fX3ZhbHVlXCIpLnRleHQoKVxyXG5cdFx0XHQkKGVsKS52YWwodGV4dClcclxuXHRcdCQoJy51c2VyaW5mbycpLmFkZENsYXNzKCd1c2VyaW5mby0tZWRpdGluZycpXHJcblx0XHQkKCcudXNlcmluZm9fX2NoZWNrYm94JykucmVtb3ZlQXR0cihcImRpc2FibGVkXCIpXHJcblx0ZWxzZVxyXG5cdFx0JCgnLnVzZXJpbmZvX192YWx1ZScpLmVhY2ggKGksZWwpIC0+XHJcblx0XHRcdHRleHQgPSAkKGVsKS5wYXJlbnQoKS5maW5kKFwiLnVzZXJpbmZvX19pbnB1dFwiKS52YWwoKVxyXG5cdFx0XHQkKGVsKS50ZXh0KHRleHQpXHJcblx0XHQkKCcudXNlcmluZm8nKS5yZW1vdmVDbGFzcygndXNlcmluZm8tLWVkaXRpbmcnKVxyXG5cdFx0JCgnLnVzZXJpbmZvX19jaGVja2JveCcpLmF0dHIoXCJkaXNhYmxlZFwiLCB0cnVlKVxyXG5cdFx0c2F2ZVVzZXIodGhpcylcclxuXHJcbnNhdmVVc2VyID0gKGZvcm0pIC0+XHJcblx0c2VyQXJyID0gJChmb3JtKS5zZXJpYWxpemVBcnJheSgpXHJcblx0c2VuZE9iaiA9IHt9XHJcblx0Zm9yIHByb3AgaW4gc2VyQXJyXHJcblx0XHRzZW5kT2JqW3Byb3AubmFtZV0gPSBwcm9wLnZhbHVlXHJcblx0c2VuZE9iai5hZ3JlZW1lbnQgPSAkKCcjZW1haWwtY2hlY2tib3gnKVswXS5jaGVja2VkXHJcblx0cmVxdWVzdC51c2VyLnNhdmUgc2VuZE9iaiwgKHJlcykgLT5cclxuXHRcdGNvbnNvbGUubG9nIHJlc1xyXG5cdFx0aWYgcmVzLnJlc3VsdCA9PSBcInN1Y2Nlc3NcIlxyXG5cdFx0XHQkKCcudXNlcmluZm9fX2Vycm9yLW1lcycpLmFkZENsYXNzKCd1c2VyaW5mb19fZXJyb3ItbWVzLS1pbnZpcycpXHJcblx0XHRcdGNoZWNrRnVsbCgpIGlmIG5vZnVsbFxyXG5cdFx0aWYgcmVzLnJlc3VsdCA9PSBcImVycm9yXCJcclxuXHRcdFx0aWYgcmVzLmNvZGUgPT0gXCI2NjZcIlxyXG5cdFx0XHRcdCQoJy51c2VyaW5mb19fZXJyb3ItbWVzJykucmVtb3ZlQ2xhc3MoJ3VzZXJpbmZvX19lcnJvci1tZXMtLWludmlzJylcclxuXHRcdFx0XHRmb3JtT3BlbkhhbmRsZXIoKVxyXG5cclxuXHJcblxyXG5jaGVja0Z1bGwgPSAtPlxyXG5cdHJlcXVlc3QudXNlci5pc0Z1bGwge30sIChyZXMpIC0+XHJcblx0XHRjb25zb2xlLmxvZyByZXNcclxuXHRcdGlmIHJlcy5yZXN1bHQ9PVwic3VjY2Vzc1wiXHJcblx0XHRcdG5vZnVsbCA9IGZhbHNlXHJcblx0XHRcdGNhbGxiYWNrKCkgaWYgY2FsbGJhY2s/XHJcblx0XHRcdHBvcHVwcy5jbG9zZU1vZGFsKCkiLCJ2YXIgamFkZSA9IHJlcXVpcmUoXCJqYWRlL3J1bnRpbWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdGVtcGxhdGUobG9jYWxzKSB7XG52YXIgYnVmID0gW107XG52YXIgamFkZV9taXhpbnMgPSB7fTtcbnZhciBqYWRlX2ludGVycDtcbjt2YXIgbG9jYWxzX2Zvcl93aXRoID0gKGxvY2FscyB8fCB7fSk7KGZ1bmN0aW9uIChub2Z1bGwsIHVzZXIpIHtcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwidXNlcmluZm8gdXNlcmluZm8tLWVkaXRpbmdcXFwiPjxoMyBjbGFzcz1cXFwidXNlcmluZm9fX3RpdGxlXFxcIj7Qm9C40YfQvdGL0LUg0LTQsNC90L3Ri9C1PC9oMz5cIik7XG5pZiAoIG5vZnVsbClcbntcbmJ1Zi5wdXNoKFwiPGRpdiBjbGFzcz1cXFwidXNlcmluZm9fX3dhcm5pbmdcXFwiPtCS0Ysg0L3QtSDQvNC+0LbQtdGC0LUg0L3QsNGH0LDRgtGMINC60LLQtdGB0YIsINC/0L7QutCwINC90LUg0LfQsNC/0L7Qu9C90LjQu9C4INC/0YDQvtGE0LjQu9GMITwvZGl2PlwiKTtcbn1cbmJ1Zi5wdXNoKFwiPGZvcm0gY2xhc3M9XFxcInVzZXJpbmZvX19mb3JtXFxcIj48ZGl2IGNsYXNzPVxcXCJ1c2VyaW5mb19fbGluZVxcXCI+PGRpdiBjbGFzcz1cXFwidXNlcmluZm9fX2xhYmVsXFxcIj7QpNCw0LzQuNC70LjRjzo8L2Rpdj48aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgbmFtZT1cXFwibGFzdF9uYW1lXFxcIlwiICsgKGphZGUuYXR0cihcInZhbHVlXCIsIFwiXCIgKyAodXNlci5sYXN0X25hbWUgfHwgJycpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJ1c2VyaW5mb19faW5wdXRcXFwiLz48ZGl2IGNsYXNzPVxcXCJ1c2VyaW5mb19fdmFsdWVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IHVzZXIubGFzdF9uYW1lKSA9PSBudWxsID8gJycgOiBqYWRlX2ludGVycCkpICsgXCI8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVxcXCJ1c2VyaW5mb19fbGluZVxcXCI+PGRpdiBjbGFzcz1cXFwidXNlcmluZm9fX2xhYmVsXFxcIj7QmNC80Y86PC9kaXY+PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIG5hbWU9XFxcImZpcnN0X25hbWVcXFwiXCIgKyAoamFkZS5hdHRyKFwidmFsdWVcIiwgXCJcIiArICh1c2VyLmZpcnN0X25hbWUgfHwgJycpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJ1c2VyaW5mb19faW5wdXRcXFwiLz48ZGl2IGNsYXNzPVxcXCJ1c2VyaW5mb19fdmFsdWVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IHVzZXIuZmlyc3RfbmFtZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwidXNlcmluZm9fX2xpbmVcXFwiPjxkaXYgY2xhc3M9XFxcInVzZXJpbmZvX19sYWJlbFxcXCI+0KLQtdC70LXRhNC+0L06PC9kaXY+PGlucHV0IHR5cGU9XFxcInBob25lXFxcIiBuYW1lPVxcXCJwaG9uZVxcXCJcIiArIChqYWRlLmF0dHIoXCJ2YWx1ZVwiLCBcIlwiICsgKHVzZXIucGhvbmUgfHwgJycpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJ1c2VyaW5mb19faW5wdXRcXFwiLz48ZGl2IGNsYXNzPVxcXCJ1c2VyaW5mb19fdmFsdWVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IHVzZXIucGhvbmUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcInVzZXJpbmZvX19saW5lXFxcIj48ZGl2IGNsYXNzPVxcXCJ1c2VyaW5mb19fbGFiZWxcXFwiPtCU0LDRgtCwINGA0L7QttC00LXQvdC40Y86PC9kaXY+PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIG5hbWU9XFxcImJkYXRlXFxcIlwiICsgKGphZGUuYXR0cihcInZhbHVlXCIsIFwiXCIgKyAodXNlci5iZGF0ZSB8fCAnJykgKyBcIlwiLCB0cnVlLCBmYWxzZSkpICsgXCIgY2xhc3M9XFxcInVzZXJpbmZvX19pbnB1dFxcXCIvPjxkaXYgY2xhc3M9XFxcInVzZXJpbmZvX192YWx1ZVxcXCI+XCIgKyAoamFkZS5lc2NhcGUoKGphZGVfaW50ZXJwID0gdXNlci5iZGF0ZSkgPT0gbnVsbCA/ICcnIDogamFkZV9pbnRlcnApKSArIFwiPC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwidXNlcmluZm9fX2xpbmVcXFwiPjxkaXYgY2xhc3M9XFxcInVzZXJpbmZvX19sYWJlbFxcXCI+RS1tYWlsOjwvZGl2PjxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBuYW1lPVxcXCJlbWFpbFxcXCJcIiArIChqYWRlLmF0dHIoXCJ2YWx1ZVwiLCBcIlwiICsgKHVzZXIuZW1haWwgfHwgJycpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJ1c2VyaW5mb19faW5wdXRcXFwiLz48ZGl2IGNsYXNzPVxcXCJ1c2VyaW5mb19fdmFsdWVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IHVzZXIuZW1haWwpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XFxcInVzZXJpbmZvX19saW5lXFxcIj48ZGl2IGNsYXNzPVxcXCJ1c2VyaW5mb19fbGFiZWxcXFwiPtCd0LjQutC90LXQudC8OjwvZGl2PjxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBuYW1lPVxcXCJuaWNrbmFtZVxcXCJcIiArIChqYWRlLmF0dHIoXCJ2YWx1ZVwiLCBcIlwiICsgKHVzZXIubmlja25hbWUgfHwgJycpICsgXCJcIiwgdHJ1ZSwgZmFsc2UpKSArIFwiIGNsYXNzPVxcXCJ1c2VyaW5mb19faW5wdXRcXFwiLz48ZGl2IGNsYXNzPVxcXCJ1c2VyaW5mb19fdmFsdWVcXFwiPlwiICsgKGphZGUuZXNjYXBlKChqYWRlX2ludGVycCA9IHVzZXIubmlja25hbWUpID09IG51bGwgPyAnJyA6IGphZGVfaW50ZXJwKSkgKyBcIjwvZGl2PjxkaXYgY2xhc3M9XFxcInVzZXJpbmZvX19lcnJvci1tZXMgdXNlcmluZm9fX2Vycm9yLW1lcy0taW52aXNcXFwiPtCd0LjQutC90LXQudC8INC90LUg0YPQvdC40LrQsNC70YzQvdGL0LkhPC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cXFwidXNlcmluZm9fX2NoZWNrYm94LWxpbmVcXFwiPlwiKTtcbmlmICggdXNlci5hZ3JlZW1lbnQ9PXRydWUgfHwgdXNlci5hZ3JlZW1lbnQ9PVwidHJ1ZVwiKVxue1xuYnVmLnB1c2goXCI8aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIG5hbWU9XFxcImFncmVlbWVudFxcXCIgY2hlY2tlZD1cXFwiY2hlY2tlZFxcXCIgaWQ9XFxcImVtYWlsLWNoZWNrYm94XFxcIiBjbGFzcz1cXFwidXNlcmluZm9fX2NoZWNrYm94XFxcIi8+XCIpO1xufVxuZWxzZVxue1xuYnVmLnB1c2goXCI8aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIG5hbWU9XFxcImFncmVlbWVudFxcXCIgaWQ9XFxcImVtYWlsLWNoZWNrYm94XFxcIiBjbGFzcz1cXFwidXNlcmluZm9fX2NoZWNrYm94XFxcIi8+XCIpO1xufVxuYnVmLnB1c2goXCI8bGFiZWwgZm9yPVxcXCJlbWFpbC1jaGVja2JveFxcXCIgbmFtZT1cXFwiYWdyZWVtZW50XFxcIiBjbGFzcz1cXFwidXNlcmluZm9fX2NoZWNrYm94LWxhYmVsXFxcIj48ZGl2IGNsYXNzPVxcXCJ1c2VyaW5mb19fY2hlY2tib3gtdGV4dFxcXCI+0KHQvtCz0LvQsNGB0LjQtSDQvdCwINGA0LDRgdGB0YvQu9C60YMg0L7RgiDQuNC80LXQvdC4INCx0YDQtdC90LTQsDwvZGl2PjwvbGFiZWw+PC9kaXY+PGJ1dHRvbiBjbGFzcz1cXFwiYnV0IHVzZXJpbmZvX19idXQganMtY2hhbmdlVXNlckluZm9cXFwiPtCY0LfQvNC10L3QuNGC0Yw8L2J1dHRvbj48L2Zvcm0+PC9kaXY+XCIpO30uY2FsbCh0aGlzLFwibm9mdWxsXCIgaW4gbG9jYWxzX2Zvcl93aXRoP2xvY2Fsc19mb3Jfd2l0aC5ub2Z1bGw6dHlwZW9mIG5vZnVsbCE9PVwidW5kZWZpbmVkXCI/bm9mdWxsOnVuZGVmaW5lZCxcInVzZXJcIiBpbiBsb2NhbHNfZm9yX3dpdGg/bG9jYWxzX2Zvcl93aXRoLnVzZXI6dHlwZW9mIHVzZXIhPT1cInVuZGVmaW5lZFwiP3VzZXI6dW5kZWZpbmVkKSk7O3JldHVybiBidWYuam9pbihcIlwiKTtcbn07Iiwia2V5cyA9IHJlcXVpcmUoJy4uL3Rvb2xzL2tleXMuY29mZmVlJylcclxuXHJcbkF1dGggPSB3aW5kb3cuYnRvYSAne1wic2lkXCI6XCInK2tleXMuc2lkKydcIixcImhhc2hcIjpcIicra2V5cy5oYXNoKydcIn0nXHJcblxyXG5wcm90b2NvbCA9IGxvY2F0aW9uLnByb3RvY29sXHJcbmhvc3QgPSB3aW5kb3cuYXBpaG9zdCB8fCBwcm90b2NvbCtcIi8vdHVjLXF1ZXN0LnJ1L1wiXHJcblxyXG5zZW5kID0gKHVybCwgbWV0aG9kLCBkYXRhLCBjYWxsYmFjaykgLT5cclxuXHRjcnlwdCA9ICEhY3J5cHRcclxuXHRkYXRhID0gZGF0YSB8fCB7fVxyXG5cdCQuYWpheCB7XHJcblx0XHR1cmw6IGhvc3QrdXJsXHJcblx0XHRtZXRob2Q6IG1ldGhvZFxyXG5cdFx0aGVhZGVyczoge1xyXG5cdFx0XHRcIkF1dGhcIjogd2luZG93LmJ0b2EgJ3tcInNpZFwiOlwiJytrZXlzLnNpZCsnXCIsXCJoYXNoXCI6XCInK2tleXMuaGFzaCsnXCJ9J1xyXG5cdFx0fVxyXG5cdFx0ZGF0YTogZGF0YVxyXG5cdFx0c3VjY2VzczogKHJlcykgLT5cclxuXHJcblx0XHRcdGNhbGxiYWNrKHJlcykgaWYgY2FsbGJhY2s/XHJcblx0XHRlcnJvcjogKGVycikgLT5cclxuXHRcdFx0Y29uc29sZS5sb2coZXJyKVxyXG5cdH1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmZhcSA9IHtcclxuXHRnZXQgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL2ZhcS9nZXRcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcbn1cclxubW9kdWxlLmV4cG9ydHMucmF0aW5nID0ge1xyXG5cdGFsbCA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvcmF0aW5nL2FsbFwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxuXHJcblx0Y29tbW9uIDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS9yYXRpbmcvY29tbW9uXCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG5cclxuXHRjdXJyZW50IDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS9yYXRpbmcvY3VycmVudFwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxufVxyXG5tb2R1bGUuZXhwb3J0cy51c2VyID0ge1xyXG5cdGlzUmVnIDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS91c2VyL2lzLXJlZ1wiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxuXHJcblx0aXNGdWxsIDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS91c2VyL2lzLWZ1bGxcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcblxyXG5cdGdldCA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvdXNlci9nZXRcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcblxyXG5cdHNhdmUgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL3VzZXIvc2F2ZVwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxuXHJcblx0cmVnaXN0cmF0aW9uIDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS91c2VyL3JlZ2lzdHJhdGlvblwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxufVxyXG5tb2R1bGUuZXhwb3J0cy5mZWVkYmFjayA9IHtcclxuXHRnZXQgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL2ZlZWRiYWNrL2dldFwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxuXHJcblx0YWRkIDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS9mZWVkYmFjay9hZGRcIiwgXCJQT1NUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG5cclxuXHRyZWFkIDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS9mZWVkYmFjay9yZWFkXCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG59XHJcbm1vZHVsZS5leHBvcnRzLnF1ZXN0cyA9IHtcclxuXHRnZXRMaXN0IDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS9xdWVzdHMvZ2V0LWxpc3RcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcbn1cclxubW9kdWxlLmV4cG9ydHMuZ2FtZSA9IHtcclxuXHRlbnRlciA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvZ2FtZS9lbnRlclwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxuXHJcblx0Z2V0UG9pbnQgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL2dhbWUvZ2V0LXBvaW50XCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG5cclxuXHRjaGVja01vbmV5IDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS9nYW1lL2NoZWNrLW1vbmV5XCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG5cclxuXHRjbGVhciA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvZ2FtZS9jbGVhclwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxufVxyXG5tb2R1bGUuZXhwb3J0cy5hY2hpZXZlbWVudCA9IHtcclxuXHRnZXQgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL2FjaGlldmVtZW50L2dldFwiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxuXHJcblx0Z2V0TmV3IDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS9hY2hpZXZlbWVudC9nZXQtbmV3XCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG5cclxuXHRyZWFkIDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS9hY2hpZXZlbWVudC9yZWFkXCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG59XHJcbm1vZHVsZS5leHBvcnRzLmV2ZW50ID0ge1xyXG5cdHNldCA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvZXZlbnQvc2V0XCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG5cdGdldCA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvZXZlbnQvZ2V0XCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG59XHJcbm1vZHVsZS5leHBvcnRzLnByaXplID0ge1xyXG5cdGdldCA6IChvcHRzLCBjYWxsYmFjaykgLT5cclxuXHRcdHNlbmQoXCJhcGkvcHJpemUvZ2V0XCIsIFwiR0VUXCIsIG9wdHMsIGNhbGxiYWNrKVxyXG59XHJcbm1vZHVsZS5leHBvcnRzLnRhc3RlID0ge1xyXG5cdGNoZWNrIDogKG9wdHMsIGNhbGxiYWNrKSAtPlxyXG5cdFx0c2VuZChcImFwaS90YXN0ZS9jaGVja1wiLCBcIkdFVFwiLCBvcHRzLCBjYWxsYmFjaylcclxuXHRpc0VuYWJsZWQgOiAob3B0cywgY2FsbGJhY2spIC0+XHJcblx0XHRzZW5kKFwiYXBpL3Rhc3RlL2lzLWVuYWJsZWRcIiwgXCJHRVRcIiwgb3B0cywgY2FsbGJhY2spXHJcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IFtcclxuXHR7XHJcblx0XHRhY2hpZXZlbWVudF9pZDogMTBcclxuXHRcdG51bTogMFxyXG5cdFx0bmFtZTogXCLQn9C10YDQstGL0Lkg0L/QvtGI0LXQu1wiXHJcblx0XHRkZXNjcmlwdGlvbjogXCLQl9Cw0LLQtdGA0YjQuNC7INC/0LXRgNCy0YvQuSDQutCy0LXRgdGCXCJcclxuXHRcdG1lc3NhZ2U6IFwi0JjQs9GA0LDQtdC8INCyINC+0L3Qu9Cw0LnQvS3QutCy0LXRgdGC0YssINC90LUg0YXQstCw0YLQsNC10YIg0YLQvtC70YzQutC+INGC0LXQsdGPISDQrdGC0L4g0LHRi9C70L4g0LHRiyDQutGA0YPRgtC+INC00LDQttC1INCx0LXQtyDQv9GA0LjQt9C+0LIuINCd0L4g0L/RgNC40LfRiyDQtdGB0YLRjCEgI9Cz0L7RgNC+0LTQt9Cw0LjQs9GA0LDQtdGCXCJcclxuXHRcdHBob3RvOiAncGhvdG8tMTExODUwNjgyXzM5ODA0OTAwOScsXHJcblx0XHRzbWFsbF9waG90bzogXCJpbWcvaW1hZ2VzL2FjaGlldmVzLXNtYWxsL2kwLnBuZ1wiXHJcblx0fVxyXG5cdHtcclxuXHRcdGFjaGlldmVtZW50X2lkOiAxMVxyXG5cdFx0bnVtOiAxXHJcblx0XHRuYW1lOiBcItCj0L/RkdGA0YLRi9C5XCJcclxuXHRcdGRlc2NyaXB0aW9uOiBcItCX0LDQstC10YDRiNC40Lsg0LrQstC10YHRgiDQt9CwINC+0LTQvdGDINGB0LXRgdGB0LjRjlwiXHJcblx0XHRtZXNzYWdlOiBcItCY0LPRgNCw0LXQvCDQsiDQvtC90LvQsNC50L0t0LrQstC10YHRgtGLLCDQvdC1INGF0LLQsNGC0LDQtdGCINGC0L7Qu9GM0LrQviDRgtC10LHRjyEg0K3RgtC+INCx0YvQu9C+INCx0Ysg0LrRgNGD0YLQviDQtNCw0LbQtSDQsdC10Lcg0L/RgNC40LfQvtCyLiDQndC+INC/0YDQuNC30Ysg0LXRgdGC0YwhICPQs9C+0YDQvtC00LfQsNC40LPRgNCw0LXRglwiXHJcblx0XHRwaG90bzogJ3Bob3RvLTExMTg1MDY4Ml8zOTgwNDkwMTcnLFxyXG5cdFx0c21hbGxfcGhvdG86IFwiaW1nL2ltYWdlcy9hY2hpZXZlcy1zbWFsbC9pMS5wbmdcIlxyXG5cdH1cclxuXHR7XHJcblx0XHRhY2hpZXZlbWVudF9pZDogMTJcclxuXHRcdG51bTogMlxyXG5cdFx0bmFtZTogXCLQlNCw0Lkg0L/Rj9GC0YwhXCJcclxuXHRcdGRlc2NyaXB0aW9uOiBcItCX0LDQstC10YDRiNC40LsgNSDQutCy0LXRgdGC0L7QslwiXHJcblx0XHRtZXNzYWdlOiBcItCY0LPRgNCw0LXQvCDQsiDQvtC90LvQsNC50L0t0LrQstC10YHRgtGLLCDQvdC1INGF0LLQsNGC0LDQtdGCINGC0L7Qu9GM0LrQviDRgtC10LHRjyEg0K3RgtC+INCx0YvQu9C+INCx0Ysg0LrRgNGD0YLQviDQtNCw0LbQtSDQsdC10Lcg0L/RgNC40LfQvtCyLiDQndC+INC/0YDQuNC30Ysg0LXRgdGC0YwhICPQs9C+0YDQvtC00LfQsNC40LPRgNCw0LXRglwiXHJcblx0XHRwaG90bzogJ3Bob3RvLTExMTg1MDY4Ml8zOTgwNDkwMTEnLFxyXG5cdFx0c21hbGxfcGhvdG86IFwiaW1nL2ltYWdlcy9hY2hpZXZlcy1zbWFsbC9pMi5wbmdcIlxyXG5cdH1cclxuXHR7XHJcblx0XHRhY2hpZXZlbWVudF9pZDogMTNcclxuXHRcdG51bTogM1xyXG5cdFx0bmFtZTogXCLQmtGA0LDRgdCw0LLRh9C40LpcIlxyXG5cdFx0ZGVzY3JpcHRpb246IFwi0JfQsNCy0LXRgNGI0LjQuyAxMCDQutCy0LXRgdGC0L7QslwiXHJcblx0XHRtZXNzYWdlOiBcItCY0LPRgNCw0LXQvCDQsiDQvtC90LvQsNC50L0t0LrQstC10YHRgtGLLCDQvdC1INGF0LLQsNGC0LDQtdGCINGC0L7Qu9GM0LrQviDRgtC10LHRjyEg0K3RgtC+INCx0YvQu9C+INCx0Ysg0LrRgNGD0YLQviDQtNCw0LbQtSDQsdC10Lcg0L/RgNC40LfQvtCyLiDQndC+INC/0YDQuNC30Ysg0LXRgdGC0YwhICPQs9C+0YDQvtC00LfQsNC40LPRgNCw0LXRglwiXHJcblx0XHRwaG90bzogJ3Bob3RvLTExMTg1MDY4Ml8zOTgwNDkwMTQnLFxyXG5cdFx0c21hbGxfcGhvdG86IFwiaW1nL2ltYWdlcy9hY2hpZXZlcy1zbWFsbC9pMy5wbmdcIlxyXG5cdH1cclxuXHR7XHJcblx0XHRhY2hpZXZlbWVudF9pZDogMTRcclxuXHRcdG51bTogNFxyXG5cdFx0bmFtZTogXCLQn9GA0LjRiNC10Lsg0Log0YPRgdC/0LXRhdGDXCJcclxuXHRcdGRlc2NyaXB0aW9uOiBcItCf0L7Qv9Cw0Lsg0LIg0KLQntCfLTIwINCyINC+0LHRidC10Lwg0YDQtdC50YLQuNC90LPQtVwiXHJcblx0XHRtZXNzYWdlOiBcItCY0LPRgNCw0LXQvCDQsiDQvtC90LvQsNC50L0t0LrQstC10YHRgtGLLCDQvdC1INGF0LLQsNGC0LDQtdGCINGC0L7Qu9GM0LrQviDRgtC10LHRjyEg0K3RgtC+INCx0YvQu9C+INCx0Ysg0LrRgNGD0YLQviDQtNCw0LbQtSDQsdC10Lcg0L/RgNC40LfQvtCyLiDQndC+INC/0YDQuNC30Ysg0LXRgdGC0YwhICPQs9C+0YDQvtC00LfQsNC40LPRgNCw0LXRglwiXHJcblx0XHRwaG90bzogJ3Bob3RvLTExMTg1MDY4Ml8zOTgwNDkwMTknLFxyXG5cdFx0c21hbGxfcGhvdG86IFwiaW1nL2ltYWdlcy9hY2hpZXZlcy1zbWFsbC9pNC5wbmdcIlxyXG5cdH1cclxuXHR7XHJcblx0XHRhY2hpZXZlbWVudF9pZDogMTVcclxuXHRcdG51bTogNVxyXG5cdFx0bmFtZTogXCLQk9C+0YDQvtC00YHQutCw0Y8g0LvQtdCz0LXQvdC00LBcIlxyXG5cdFx0ZGVzY3JpcHRpb246IFwi0JfQsNCy0LXRgNGI0LjQuyDQstGB0LUg0LTQvtGB0YLRg9C/0L3Ri9C1INC60LLQtdGB0YLRi1wiXHJcblx0XHRtZXNzYWdlOiBcItCY0LPRgNCw0LXQvCDQsiDQvtC90LvQsNC50L0t0LrQstC10YHRgtGLLCDQvdC1INGF0LLQsNGC0LDQtdGCINGC0L7Qu9GM0LrQviDRgtC10LHRjyEg0K3RgtC+INCx0YvQu9C+INCx0Ysg0LrRgNGD0YLQviDQtNCw0LbQtSDQsdC10Lcg0L/RgNC40LfQvtCyLiDQndC+INC/0YDQuNC30Ysg0LXRgdGC0YwhICPQs9C+0YDQvtC00LfQsNC40LPRgNCw0LXRglwiXHJcblx0XHRwaG90bzogJ3Bob3RvLTExMTg1MDY4Ml8zOTgwNDkwMTMnLFxyXG5cdFx0c21hbGxfcGhvdG86IFwiaW1nL2ltYWdlcy9hY2hpZXZlcy1zbWFsbC9pNS5wbmdcIlxyXG5cdH1cclxuXHR7XHJcblx0XHRhY2hpZXZlbWVudF9pZDogMTZcclxuXHRcdG51bTogNlxyXG5cdFx0bmFtZTogXCLQktC10YDQsdC+0LLRidC40LpcIlxyXG5cdFx0ZGVzY3JpcHRpb246IFwi0J/RgNC40LPQu9Cw0YHQuNC7IDUg0LTRgNGD0LfQtdC5XCJcclxuXHRcdG1lc3NhZ2U6IFwi0JjQs9GA0LDQtdC8INCyINC+0L3Qu9Cw0LnQvS3QutCy0LXRgdGC0YssINC90LUg0YXQstCw0YLQsNC10YIg0YLQvtC70YzQutC+INGC0LXQsdGPISDQrdGC0L4g0LHRi9C70L4g0LHRiyDQutGA0YPRgtC+INC00LDQttC1INCx0LXQtyDQv9GA0LjQt9C+0LIuINCd0L4g0L/RgNC40LfRiyDQtdGB0YLRjCEgI9Cz0L7RgNC+0LTQt9Cw0LjQs9GA0LDQtdGCXCJcclxuXHRcdHBob3RvOiAncGhvdG8tMTExODUwNjgyXzM5ODA0OTAxNicsXHJcblx0XHRzbWFsbF9waG90bzogXCJpbWcvaW1hZ2VzL2FjaGlldmVzLXNtYWxsL2k2LnBuZ1wiXHJcblx0fVxyXG5cdHtcclxuXHRcdGFjaGlldmVtZW50X2lkOiAxN1xyXG5cdFx0bnVtOiA3XHJcblx0XHRuYW1lOiBcItCT0LjQv9C90L7QttCw0LHQsFwiXHJcblx0XHRkZXNjcmlwdGlvbjogXCLQn9GA0LjQs9C70LDRgdC40LsgMTAg0LTRgNGD0LfQtdC5XCJcclxuXHRcdG1lc3NhZ2U6IFwi0JjQs9GA0LDQtdC8INCyINC+0L3Qu9Cw0LnQvS3QutCy0LXRgdGC0YssINC90LUg0YXQstCw0YLQsNC10YIg0YLQvtC70YzQutC+INGC0LXQsdGPISDQrdGC0L4g0LHRi9C70L4g0LHRiyDQutGA0YPRgtC+INC00LDQttC1INCx0LXQtyDQv9GA0LjQt9C+0LIuINCd0L4g0L/RgNC40LfRiyDQtdGB0YLRjCEgI9Cz0L7RgNC+0LTQt9Cw0LjQs9GA0LDQtdGCXCJcclxuXHRcdHBob3RvOiAncGhvdG8tMTExODUwNjgyXzM5ODA0OTAxMicsXHJcblx0XHRzbWFsbF9waG90bzogXCJpbWcvaW1hZ2VzL2FjaGlldmVzLXNtYWxsL2k3LnBuZ1wiXHJcblx0fVxyXG5dIiwibW9kdWxlLmV4cG9ydHMuc2VuZCA9IChldmVudF9uYW1lKSAtPlxyXG5cdGdhKCdzZW5kJywge1xyXG5cdFx0aGl0VHlwZTogJ2V2ZW50JyxcclxuXHRcdGV2ZW50Q2F0ZWdvcnk6ICdldmVudHMnLFxyXG5cdFx0ZXZlbnRBY3Rpb246IGV2ZW50X25hbWVcclxuXHR9KSIsIm1kNSA9IHJlcXVpcmUgJy4vbWQ1LmNvZmZlZSdcclxuXHJcbkFwcFNldHRpbmcgPSB3aW5kb3cuQXBwU2V0dGluZyB8fCB7fVxyXG5cclxuQXBwU2V0dGluZy5zaWQgPSBBcHBTZXR0aW5nLnNpZCB8fCBcIjFcIlxyXG5BcHBTZXR0aW5nLmhhc2ggPSBBcHBTZXR0aW5nLmhhc2ggfHwgXCJoYXNoX3Rlc3RcIlxyXG5BcHBTZXR0aW5nLnZpZXdlcl9pZCA9IEFwcFNldHRpbmcudmlld2VyX2lkIHx8IFwiMzk0MzM2NFwiXHJcbkFwcFNldHRpbmcuYXV0aF9rZXkgPSBBcHBTZXR0aW5nLmF1dGhfa2V5IHx8IFwiNTgzNDE2Y2YxYmVmNjkwMTliYTdlZWEwYWQ2OGE3OGFcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0c2lkOiBBcHBTZXR0aW5nLnNpZFxyXG5cdGhhc2g6IEFwcFNldHRpbmcuaGFzaFxyXG5cdHZpZXdlcl9pZCA6IEFwcFNldHRpbmcudmlld2VyX2lkXHJcblx0YXV0aF9rZXkgOiBBcHBTZXR0aW5nLmF1dGhfa2V5XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLnNldEhhc2ggPSAodmFsKSAtPlxyXG5cdG1vZHVsZS5leHBvcnRzLmhhc2ggPSB2YWxcclxuXHJcbm1vZHVsZS5leHBvcnRzLmdldE1kNWtleSA9ICgpIC0+XHJcblx0cmV0dXJuIG1kNS5lbmNyeXB0KG1vZHVsZS5leHBvcnRzLmhhc2ggKyBcIl9fXCIgKyBBcHBTZXR0aW5nLnNpZClcclxuIiwia2V5cyA9IHJlcXVpcmUoJy4va2V5cycpXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5pbml0ID0gLT5cclxuXHQkKCdoZWFkZXIgYScpLmVhY2ggKGksIGVsKSAtPlxyXG5cdFx0aHJlZiA9ICQoZWwpLmF0dHIoJ2hyZWYnKVxyXG5cdFx0I2lmIGhyZWYuc3Vic3RyKC0xKSA9PSBcIi9cIiB0aGVuIGhyZWYgPSBocmVmLnN1YnN0cigwLGhyZWYubGVuZ3RoLTEpXHJcblx0XHQkKGVsKS5hdHRyKCdocmVmJywgaHJlZitcIj9zaWQ9XCIra2V5cy5zaWQrXCImdmlld2VyX2lkPVwiK2tleXMudmlld2VyX2lkK1wiJmF1dGhfa2V5PVwiK2tleXMuYXV0aF9rZXkpXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5hZGRCdXRIYXNoID0gKCRlbHMpIC0+XHJcblx0JGVscy5lYWNoIChpLCBlbCkgLT5cclxuXHRcdGNvbnNvbGUubG9nIGVsXHJcblx0XHRocmVmID0gJChlbCkuYXR0cignaHJlZicpXHJcblx0XHQkKGVsKS5hdHRyKCdocmVmJywgaHJlZitcIiZzaWQ9XCIra2V5cy5zaWQrXCImdmlld2VyX2lkPVwiK2tleXMudmlld2VyX2lkK1wiJmF1dGhfa2V5PVwiK2tleXMuYXV0aF9rZXkpXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMuYWRkV2hhdEJ1dEhhc2ggPSAoJGVscykgLT5cclxuXHQkZWxzLmVhY2ggKGksIGVsKSAtPlxyXG5cdFx0Y29uc29sZS5sb2cgZWxcclxuXHRcdGhyZWYgPSAkKGVsKS5hdHRyKCdocmVmJylcclxuXHRcdCQoZWwpLmF0dHIoJ2hyZWYnLCBocmVmK1wiP3NpZD1cIitrZXlzLnNpZCtcIiZ2aWV3ZXJfaWQ9XCIra2V5cy52aWV3ZXJfaWQrXCImYXV0aF9rZXk9XCIra2V5cy5hdXRoX2tleSlcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5wYXJzZUdldFBhcmFtcyA9IC0+XHJcblx0JF9HRVQgPSB7fVxyXG5cdF9fR0VUID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHJpbmcoMSkuc3BsaXQoXCImXCIpXHJcblx0Zm9yIHZ2YXIgaW4gX19HRVRcclxuXHRcdGdldFZhciA9IHZ2YXIuc3BsaXQoXCI9XCIpXHJcblx0XHRpZiB0eXBlb2YoZ2V0VmFyWzFdKT09XCJ1bmRlZmluZWRcIlxyXG5cdFx0XHQkX0dFVFtnZXRWYXJbMF1dID0gXCJcIlxyXG5cdFx0ZWxzZVxyXG5cdFx0XHQkX0dFVFtnZXRWYXJbMF1dID0gZ2V0VmFyWzFdXHJcblx0cmV0dXJuICRfR0VUXHJcbiIsImBmdW5jdGlvbiBtZDVjeWNsZSh4LCBrKSB7XHJcbnZhciBhID0geFswXSwgYiA9IHhbMV0sIGMgPSB4WzJdLCBkID0geFszXTtcclxuXHJcbmEgPSBmZihhLCBiLCBjLCBkLCBrWzBdLCA3LCAtNjgwODc2OTM2KTtcclxuZCA9IGZmKGQsIGEsIGIsIGMsIGtbMV0sIDEyLCAtMzg5NTY0NTg2KTtcclxuYyA9IGZmKGMsIGQsIGEsIGIsIGtbMl0sIDE3LCAgNjA2MTA1ODE5KTtcclxuYiA9IGZmKGIsIGMsIGQsIGEsIGtbM10sIDIyLCAtMTA0NDUyNTMzMCk7XHJcbmEgPSBmZihhLCBiLCBjLCBkLCBrWzRdLCA3LCAtMTc2NDE4ODk3KTtcclxuZCA9IGZmKGQsIGEsIGIsIGMsIGtbNV0sIDEyLCAgMTIwMDA4MDQyNik7XHJcbmMgPSBmZihjLCBkLCBhLCBiLCBrWzZdLCAxNywgLTE0NzMyMzEzNDEpO1xyXG5iID0gZmYoYiwgYywgZCwgYSwga1s3XSwgMjIsIC00NTcwNTk4Myk7XHJcbmEgPSBmZihhLCBiLCBjLCBkLCBrWzhdLCA3LCAgMTc3MDAzNTQxNik7XHJcbmQgPSBmZihkLCBhLCBiLCBjLCBrWzldLCAxMiwgLTE5NTg0MTQ0MTcpO1xyXG5jID0gZmYoYywgZCwgYSwgYiwga1sxMF0sIDE3LCAtNDIwNjMpO1xyXG5iID0gZmYoYiwgYywgZCwgYSwga1sxMV0sIDIyLCAtMTk5MDQwNDE2Mik7XHJcbmEgPSBmZihhLCBiLCBjLCBkLCBrWzEyXSwgNywgIDE4MDQ2MDM2ODIpO1xyXG5kID0gZmYoZCwgYSwgYiwgYywga1sxM10sIDEyLCAtNDAzNDExMDEpO1xyXG5jID0gZmYoYywgZCwgYSwgYiwga1sxNF0sIDE3LCAtMTUwMjAwMjI5MCk7XHJcbmIgPSBmZihiLCBjLCBkLCBhLCBrWzE1XSwgMjIsICAxMjM2NTM1MzI5KTtcclxuXHJcbmEgPSBnZyhhLCBiLCBjLCBkLCBrWzFdLCA1LCAtMTY1Nzk2NTEwKTtcclxuZCA9IGdnKGQsIGEsIGIsIGMsIGtbNl0sIDksIC0xMDY5NTAxNjMyKTtcclxuYyA9IGdnKGMsIGQsIGEsIGIsIGtbMTFdLCAxNCwgIDY0MzcxNzcxMyk7XHJcbmIgPSBnZyhiLCBjLCBkLCBhLCBrWzBdLCAyMCwgLTM3Mzg5NzMwMik7XHJcbmEgPSBnZyhhLCBiLCBjLCBkLCBrWzVdLCA1LCAtNzAxNTU4NjkxKTtcclxuZCA9IGdnKGQsIGEsIGIsIGMsIGtbMTBdLCA5LCAgMzgwMTYwODMpO1xyXG5jID0gZ2coYywgZCwgYSwgYiwga1sxNV0sIDE0LCAtNjYwNDc4MzM1KTtcclxuYiA9IGdnKGIsIGMsIGQsIGEsIGtbNF0sIDIwLCAtNDA1NTM3ODQ4KTtcclxuYSA9IGdnKGEsIGIsIGMsIGQsIGtbOV0sIDUsICA1Njg0NDY0MzgpO1xyXG5kID0gZ2coZCwgYSwgYiwgYywga1sxNF0sIDksIC0xMDE5ODAzNjkwKTtcclxuYyA9IGdnKGMsIGQsIGEsIGIsIGtbM10sIDE0LCAtMTg3MzYzOTYxKTtcclxuYiA9IGdnKGIsIGMsIGQsIGEsIGtbOF0sIDIwLCAgMTE2MzUzMTUwMSk7XHJcbmEgPSBnZyhhLCBiLCBjLCBkLCBrWzEzXSwgNSwgLTE0NDQ2ODE0NjcpO1xyXG5kID0gZ2coZCwgYSwgYiwgYywga1syXSwgOSwgLTUxNDAzNzg0KTtcclxuYyA9IGdnKGMsIGQsIGEsIGIsIGtbN10sIDE0LCAgMTczNTMyODQ3Myk7XHJcbmIgPSBnZyhiLCBjLCBkLCBhLCBrWzEyXSwgMjAsIC0xOTI2NjA3NzM0KTtcclxuXHJcbmEgPSBoaChhLCBiLCBjLCBkLCBrWzVdLCA0LCAtMzc4NTU4KTtcclxuZCA9IGhoKGQsIGEsIGIsIGMsIGtbOF0sIDExLCAtMjAyMjU3NDQ2Myk7XHJcbmMgPSBoaChjLCBkLCBhLCBiLCBrWzExXSwgMTYsICAxODM5MDMwNTYyKTtcclxuYiA9IGhoKGIsIGMsIGQsIGEsIGtbMTRdLCAyMywgLTM1MzA5NTU2KTtcclxuYSA9IGhoKGEsIGIsIGMsIGQsIGtbMV0sIDQsIC0xNTMwOTkyMDYwKTtcclxuZCA9IGhoKGQsIGEsIGIsIGMsIGtbNF0sIDExLCAgMTI3Mjg5MzM1Myk7XHJcbmMgPSBoaChjLCBkLCBhLCBiLCBrWzddLCAxNiwgLTE1NTQ5NzYzMik7XHJcbmIgPSBoaChiLCBjLCBkLCBhLCBrWzEwXSwgMjMsIC0xMDk0NzMwNjQwKTtcclxuYSA9IGhoKGEsIGIsIGMsIGQsIGtbMTNdLCA0LCAgNjgxMjc5MTc0KTtcclxuZCA9IGhoKGQsIGEsIGIsIGMsIGtbMF0sIDExLCAtMzU4NTM3MjIyKTtcclxuYyA9IGhoKGMsIGQsIGEsIGIsIGtbM10sIDE2LCAtNzIyNTIxOTc5KTtcclxuYiA9IGhoKGIsIGMsIGQsIGEsIGtbNl0sIDIzLCAgNzYwMjkxODkpO1xyXG5hID0gaGgoYSwgYiwgYywgZCwga1s5XSwgNCwgLTY0MDM2NDQ4Nyk7XHJcbmQgPSBoaChkLCBhLCBiLCBjLCBrWzEyXSwgMTEsIC00MjE4MTU4MzUpO1xyXG5jID0gaGgoYywgZCwgYSwgYiwga1sxNV0sIDE2LCAgNTMwNzQyNTIwKTtcclxuYiA9IGhoKGIsIGMsIGQsIGEsIGtbMl0sIDIzLCAtOTk1MzM4NjUxKTtcclxuXHJcbmEgPSBpaShhLCBiLCBjLCBkLCBrWzBdLCA2LCAtMTk4NjMwODQ0KTtcclxuZCA9IGlpKGQsIGEsIGIsIGMsIGtbN10sIDEwLCAgMTEyNjg5MTQxNSk7XHJcbmMgPSBpaShjLCBkLCBhLCBiLCBrWzE0XSwgMTUsIC0xNDE2MzU0OTA1KTtcclxuYiA9IGlpKGIsIGMsIGQsIGEsIGtbNV0sIDIxLCAtNTc0MzQwNTUpO1xyXG5hID0gaWkoYSwgYiwgYywgZCwga1sxMl0sIDYsICAxNzAwNDg1NTcxKTtcclxuZCA9IGlpKGQsIGEsIGIsIGMsIGtbM10sIDEwLCAtMTg5NDk4NjYwNik7XHJcbmMgPSBpaShjLCBkLCBhLCBiLCBrWzEwXSwgMTUsIC0xMDUxNTIzKTtcclxuYiA9IGlpKGIsIGMsIGQsIGEsIGtbMV0sIDIxLCAtMjA1NDkyMjc5OSk7XHJcbmEgPSBpaShhLCBiLCBjLCBkLCBrWzhdLCA2LCAgMTg3MzMxMzM1OSk7XHJcbmQgPSBpaShkLCBhLCBiLCBjLCBrWzE1XSwgMTAsIC0zMDYxMTc0NCk7XHJcbmMgPSBpaShjLCBkLCBhLCBiLCBrWzZdLCAxNSwgLTE1NjAxOTgzODApO1xyXG5iID0gaWkoYiwgYywgZCwgYSwga1sxM10sIDIxLCAgMTMwOTE1MTY0OSk7XHJcbmEgPSBpaShhLCBiLCBjLCBkLCBrWzRdLCA2LCAtMTQ1NTIzMDcwKTtcclxuZCA9IGlpKGQsIGEsIGIsIGMsIGtbMTFdLCAxMCwgLTExMjAyMTAzNzkpO1xyXG5jID0gaWkoYywgZCwgYSwgYiwga1syXSwgMTUsICA3MTg3ODcyNTkpO1xyXG5iID0gaWkoYiwgYywgZCwgYSwga1s5XSwgMjEsIC0zNDM0ODU1NTEpO1xyXG5cclxueFswXSA9IGFkZDMyKGEsIHhbMF0pO1xyXG54WzFdID0gYWRkMzIoYiwgeFsxXSk7XHJcbnhbMl0gPSBhZGQzMihjLCB4WzJdKTtcclxueFszXSA9IGFkZDMyKGQsIHhbM10pO1xyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gY21uKHEsIGEsIGIsIHgsIHMsIHQpIHtcclxuYSA9IGFkZDMyKGFkZDMyKGEsIHEpLCBhZGQzMih4LCB0KSk7XHJcbnJldHVybiBhZGQzMigoYSA8PCBzKSB8IChhID4+PiAoMzIgLSBzKSksIGIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmZihhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XHJcbnJldHVybiBjbW4oKGIgJiBjKSB8ICgofmIpICYgZCksIGEsIGIsIHgsIHMsIHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZyhhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XHJcbnJldHVybiBjbW4oKGIgJiBkKSB8IChjICYgKH5kKSksIGEsIGIsIHgsIHMsIHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoaChhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XHJcbnJldHVybiBjbW4oYiBeIGMgXiBkLCBhLCBiLCB4LCBzLCB0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gaWkoYSwgYiwgYywgZCwgeCwgcywgdCkge1xyXG5yZXR1cm4gY21uKGMgXiAoYiB8ICh+ZCkpLCBhLCBiLCB4LCBzLCB0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gbWQ1MShzKSB7XHJcblx0dHh0ID0gJyc7XHJcblx0dmFyIG4gPSBzLmxlbmd0aCxcclxuXHRcdHN0YXRlID0gWzE3MzI1ODQxOTMsIC0yNzE3MzM4NzksIC0xNzMyNTg0MTk0LCAyNzE3MzM4NzhdLCBpO1xyXG5cdGZvciAoaT02NDsgaTw9cy5sZW5ndGg7IGkrPTY0KSB7XHJcblx0XHRtZDVjeWNsZShzdGF0ZSwgbWQ1YmxrKHMuc3Vic3RyaW5nKGktNjQsIGkpKSk7XHJcblx0fVxyXG5cdHMgPSBzLnN1YnN0cmluZyhpLTY0KTtcclxuXHR2YXIgdGFpbCA9IFswLDAsMCwwLCAwLDAsMCwwLCAwLDAsMCwwLCAwLDAsMCwwXTtcclxuXHRmb3IgKGk9MDsgaTxzLmxlbmd0aDsgaSsrKVxyXG5cdFx0dGFpbFtpPj4yXSB8PSBzLmNoYXJDb2RlQXQoaSkgPDwgKChpJTQpIDw8IDMpO1xyXG5cdHRhaWxbaT4+Ml0gfD0gMHg4MCA8PCAoKGklNCkgPDwgMyk7XHJcblx0aWYgKGkgPiA1NSkge1xyXG5cdFx0bWQ1Y3ljbGUoc3RhdGUsIHRhaWwpO1xyXG5cdFx0Zm9yIChpPTA7IGk8MTY7IGkrKykgdGFpbFtpXSA9IDA7XHJcblx0fVxyXG5cdHRhaWxbMTRdID0gbio4O1xyXG5cdG1kNWN5Y2xlKHN0YXRlLCB0YWlsKTtcclxuXHRyZXR1cm4gc3RhdGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1kNWJsayhzKSB7IC8qIEkgZmlndXJlZCBnbG9iYWwgd2FzIGZhc3Rlci4gICAqL1xyXG5cdHZhciBtZDVibGtzID0gW10sIGk7IC8qIEFuZHkgS2luZyBzYWlkIGRvIGl0IHRoaXMgd2F5LiAqL1xyXG5cdGZvciAoaT0wOyBpPDY0OyBpKz00KSB7XHJcblx0XHRtZDVibGtzW2k+PjJdID0gcy5jaGFyQ29kZUF0KGkpXHJcblx0XHQrIChzLmNoYXJDb2RlQXQoaSsxKSA8PCA4KVxyXG5cdFx0KyAocy5jaGFyQ29kZUF0KGkrMikgPDwgMTYpXHJcblx0XHQrIChzLmNoYXJDb2RlQXQoaSszKSA8PCAyNCk7XHJcblx0fVxyXG5cdHJldHVybiBtZDVibGtzO1xyXG59XHJcblxyXG52YXIgaGV4X2NociA9ICcwMTIzNDU2Nzg5YWJjZGVmJy5zcGxpdCgnJyk7XHJcblxyXG5mdW5jdGlvbiByaGV4KG4pXHJcbntcclxuXHR2YXIgcz0nJywgaj0wO1xyXG5cdGZvcig7IGo8NDsgaisrKVxyXG5cdHMgKz0gaGV4X2NoclsobiA+PiAoaiAqIDggKyA0KSkgJiAweDBGXVxyXG5cdCsgaGV4X2NoclsobiA+PiAoaiAqIDgpKSAmIDB4MEZdO1xyXG5cdHJldHVybiBzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoZXgoeCkge1xyXG5cdGZvciAodmFyIGk9MDsgaTx4Lmxlbmd0aDsgaSsrKVxyXG5cdHhbaV0gPSByaGV4KHhbaV0pO1xyXG5cdHJldHVybiB4LmpvaW4oJycpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtZDUocykge1xyXG5cdHJldHVybiBoZXgobWQ1MShzKSk7XHJcbn1cclxuXHJcbi8qIHRoaXMgZnVuY3Rpb24gaXMgbXVjaCBmYXN0ZXIsXHJcbnNvIGlmIHBvc3NpYmxlIHdlIHVzZSBpdC4gU29tZSBJRXNcclxuYXJlIHRoZSBvbmx5IG9uZXMgSSBrbm93IG9mIHRoYXRcclxubmVlZCB0aGUgaWRpb3RpYyBzZWNvbmQgZnVuY3Rpb24sXHJcbmdlbmVyYXRlZCBieSBhbiBpZiBjbGF1c2UuICAqL1xyXG5cclxuZnVuY3Rpb24gYWRkMzIoYSwgYikge1xyXG5cdHJldHVybiAoYSArIGIpICYgMHhGRkZGRkZGRjtcclxufVxyXG5cclxuaWYgKG1kNSgnaGVsbG8nKSAhPSAnNWQ0MTQwMmFiYzRiMmE3NmI5NzE5ZDkxMTAxN2M1OTInKSB7XHJcblx0ZnVuY3Rpb24gYWRkMzIoeCwgeSkge1xyXG5cdFx0dmFyIGxzdyA9ICh4ICYgMHhGRkZGKSArICh5ICYgMHhGRkZGKSxcclxuXHRcdG1zdyA9ICh4ID4+IDE2KSArICh5ID4+IDE2KSArIChsc3cgPj4gMTYpO1xyXG5cdFx0cmV0dXJuIChtc3cgPDwgMTYpIHwgKGxzdyAmIDB4RkZGRik7XHJcblx0fVxyXG59YFxyXG5cclxubW9kdWxlLmV4cG9ydHMuZW5jcnlwdCA9IG1kNSIsInJlcXVlc3QgPSByZXF1aXJlKCcuLi9yZXF1ZXN0JylcclxuXHJcblxyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5pbml0ID0gKGNhbGxiYWNrKSAtPlxyXG5cclxuXHRpbml0U3VjY2VzcyA9IC0+XHJcblx0XHRjb25zb2xlLmxvZyBcImluaXQgc3VjY2Vzc1wiXHJcblx0XHRjYWxsYmFjaygpXHJcblxyXG5cdGluaXRGYWlsID0gLT5cclxuXHRcdGNvbnNvbGUubG9nICdpbml0IGZhaWwnXHJcblxyXG5cdFZLLmluaXQgaW5pdFN1Y2Nlc3MsIGluaXRGYWlsLCAnNS40MCdcclxuXHJcbm1vZHVsZS5leHBvcnRzLnJlc2l6ZSA9IChoZWlnaHQpIC0+XHJcblx0VksuY2FsbE1ldGhvZCBcInJlc2l6ZVdpbmRvd1wiLCAxMDAwLCBoZWlnaHRcclxuXHJcbm1vZHVsZS5leHBvcnRzLmlzUmVnID0gKGNhbGxiYWNrKSAtPlxyXG5cdHJlcXVlc3QudXNlci5pc1JlZyB7fSwgKHJlcykgLT5cclxuXHRcdGNvbnNvbGUubG9nIFwiSVMgUkVHIFwiICsgcmVzLnJlc3VsdFxyXG5cdFx0aWYgcmVzLnJlc3VsdCA9PSB0cnVlXHJcblx0XHRcdGNhbGxiYWNrKClcclxuXHRcdGlmIHJlcy5yZXN1bHQgPT0gZmFsc2VcclxuXHRcdFx0Z2V0VXNlckluZm8oKVxyXG5cclxuXHRnZXRVc2VySW5mbyA9IC0+XHJcblx0XHRWSy5hcGkgJ3VzZXJzLmdldCcsIHt0ZXN0X21vZGU6IDEsIGZpZWxkczpcInNjcmVlbl9uYW1lLHNleCxiZGF0ZSxjaXR5LGNvdW50cnkscGhvdG9fbWF4XCJ9LCAoZGF0YSkgLT5cclxuXHJcblx0XHRcdGlmICFkYXRhLnJlc3BvbnNlWzBdP1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nIGRhdGFcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0Y29uc29sZS5sb2cgZGF0YVxyXG5cdFx0XHRwZXJzb25JbmZvID0ge1xyXG5cdFx0XHRcdGZpcnN0X25hbWUgOiBkYXRhLnJlc3BvbnNlWzBdLmZpcnN0X25hbWUgfHwgXCJcIlxyXG5cdFx0XHRcdGxhc3RfbmFtZSA6IGRhdGEucmVzcG9uc2VbMF0ubGFzdF9uYW1lIHx8IFwiXCJcclxuXHRcdFx0XHRzY3JlZW5fbmFtZSA6IGRhdGEucmVzcG9uc2VbMF0uc2NyZWVuX25hbWUgfHwgXCJcIlxyXG5cdFx0XHRcdHNleCA6IGRhdGEucmVzcG9uc2VbMF0uc2V4XHJcblx0XHRcdFx0YmRhdGUgOiAgZGF0YS5yZXNwb25zZVswXS5iZGF0ZSB8fCAnMDEuMDEuMDAwMCdcclxuXHRcdFx0XHRwaG90byA6IGRhdGEucmVzcG9uc2VbMF0ucGhvdG9fbWF4IHx8IFwiXCJcclxuXHRcdFx0fVxyXG5cdFx0XHR0cnlcclxuXHRcdFx0XHRwZXJzb25JbmZvLmNpdHkgPSBkYXRhLnJlc3BvbnNlWzBdLmNpdHkudGl0bGVcclxuXHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdHBlcnNvbkluZm8uY2l0eSA9IFwiXCJcclxuXHRcdFx0dHJ5XHJcblx0XHRcdFx0cGVyc29uSW5mby5jb3VudHJ5ID0gZGF0YS5yZXNwb25zZVswXS5jb3VudHJ5LnRpdGxlXHJcblx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRwZXJzb25JbmZvLmNvdW50cnkgPSBcIlwiXHJcblxyXG5cclxuXHRcdFx0cmVxdWVzdC51c2VyLnJlZ2lzdHJhdGlvbiBwZXJzb25JbmZvLCAocmVzKSAtPlxyXG5cdFx0XHRcdGNvbnNvbGUubG9nIHJlc1xyXG5cdFx0XHRcdGNhbGxiYWNrKClcclxuXHJcbm1vZHVsZS5leHBvcnRzLndhbGxQb3N0ID0gKG9wdHMsIHN1Y2Nlc3MpIC0+XHJcblx0b3B0cy50ZXN0X21vZGUgPSAxXHJcblx0VksuYXBpICd3YWxsLnBvc3QnLCBvcHRzLCAoZGF0YSkgLT5cclxuXHRcdGNvbnNvbGUubG9nIGRhdGFcclxuXHRcdGRhdGEucmVzcG9uc2UgPSBkYXRhLnJlc3BvbnNlIHx8IHt9XHJcblx0XHRpZiBkYXRhLnJlc3BvbnNlLnBvc3RfaWRcclxuXHRcdFx0I9C+0L/Rg9Cx0LvQuNC60L7QstCw0L1cclxuXHRcdFx0c3VjY2VzcygpXHJcblx0XHRlbHNlXHJcblx0XHRcdCPQvtGI0LjQsdC60LBcclxuXHJcbm1vZHVsZS5leHBvcnRzLmludml0ZUZyaWVuZHMgPSAoKSAtPlxyXG5cdFZLLmNhbGxNZXRob2QgXCJzaG93SW52aXRlQm94XCIiXX0=
