var cronInstance = new Cron();
var str = "* 12 * * 4,5";

var arr = cronInstance.fromString(str).toArray();
console.log(arr);
$(".js-weekday").removeAttr('checked');
arr[4].forEach(function(el) {
    $('.js-weekday[data-val='+el+']').attr('checked', 'checked');
});

$('.cronForm').submit(function(e) {
    e.preventDefault();
    var weekDays = [];
    $('.js-weekday').each(function(index, el) {
       if($(el).is(':checked')) weekDays.push($(el).attr('data-val'));
    });
    var weekDaysString = weekDays.join(',');
    if(weekDays.length==7) weekDaysString = "*";
    alert('* * * * '+weekDaysString);
});