(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var slider;

slider = document.querySelector(".tech-slider__list");

$('.js-nextSlide').on('click', function() {
  var left;
  left = parseInt($('.tech-slider__list').css('left'));
  return $('.tech-slider__list').css('left', left - 270);
});

$('.js-prevSlide').on('click', function() {
  var left;
  left = parseInt($('.tech-slider__list').css('left'));
  return $('.tech-slider__list').css('left', left + 270);
});


},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOlxcZGV2ZWxvcG1lbnRcXGZhc3R0cnVja1xcc3JjXFxqc1xcc2NyaXB0XFxtYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7O0FBQUEsTUFBQSxHQUFTLFFBQVEsQ0FBQyxhQUFULENBQXVCLG9CQUF2Qjs7QUFDVCxDQUFBLENBQUUsZUFBRixDQUFrQixDQUFDLEVBQW5CLENBQXNCLE9BQXRCLEVBQStCLFNBQUE7QUFDN0IsTUFBQTtFQUFBLElBQUEsR0FBTyxRQUFBLENBQVMsQ0FBQSxDQUFFLG9CQUFGLENBQXVCLENBQUMsR0FBeEIsQ0FBNEIsTUFBNUIsQ0FBVDtTQUNQLENBQUEsQ0FBRSxvQkFBRixDQUF1QixDQUFDLEdBQXhCLENBQTRCLE1BQTVCLEVBQW9DLElBQUEsR0FBSyxHQUF6QztBQUY2QixDQUEvQjs7QUFJQSxDQUFBLENBQUUsZUFBRixDQUFrQixDQUFDLEVBQW5CLENBQXNCLE9BQXRCLEVBQStCLFNBQUE7QUFDN0IsTUFBQTtFQUFBLElBQUEsR0FBTyxRQUFBLENBQVMsQ0FBQSxDQUFFLG9CQUFGLENBQXVCLENBQUMsR0FBeEIsQ0FBNEIsTUFBNUIsQ0FBVDtTQUNQLENBQUEsQ0FBRSxvQkFBRixDQUF1QixDQUFDLEdBQXhCLENBQTRCLE1BQTVCLEVBQW9DLElBQUEsR0FBSyxHQUF6QztBQUY2QixDQUEvQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJzbGlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRlY2gtc2xpZGVyX19saXN0XCIpXHJcbiQoJy5qcy1uZXh0U2xpZGUnKS5vbiAnY2xpY2snLCAtPlxyXG4gIGxlZnQgPSBwYXJzZUludCgkKCcudGVjaC1zbGlkZXJfX2xpc3QnKS5jc3MoJ2xlZnQnKSlcclxuICAkKCcudGVjaC1zbGlkZXJfX2xpc3QnKS5jc3MoJ2xlZnQnLCBsZWZ0LTI3MClcclxuXHJcbiQoJy5qcy1wcmV2U2xpZGUnKS5vbiAnY2xpY2snLCAtPlxyXG4gIGxlZnQgPSBwYXJzZUludCgkKCcudGVjaC1zbGlkZXJfX2xpc3QnKS5jc3MoJ2xlZnQnKSlcclxuICAkKCcudGVjaC1zbGlkZXJfX2xpc3QnKS5jc3MoJ2xlZnQnLCBsZWZ0KzI3MCkiXX0=
