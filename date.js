function s_getobj(id) {
    return document.getElementById(id);
}

function s_list() {
    console.log("list");
    var date = new Date();
    var le1 = date.getFullYear() - 2000 + 1;

    s_addlist('s_year', 2000, le1);
    s_addlist('s_month', 1, 12);
    s_addlist('s_day', 1, 31);
}
function s_febday() {
    var year = s_getobj('s_year').value;
    var month = s_getobj('s_month').value;
    var bigm = new Array('1', '3', '5', '7', '8', '10', '12');
    var bigstr = bigm.join('-');
    var smallm = new Array('4', '6', '9', '10');
    var smallstr = smallm.join('-');
    if (bigstr.indexOf(month) > -1)
        s_addlist('s_day', 1, 31);
    if (smallstr.indexOf(month) > -1)
        s_day(30);
    if (month == '2') {
        if (isRui(year)) {
            s_day(29);
        } else {
            s_day(28);
        }
    }
}
function s_day(num) {
    var list = s_getobj('s_day');
    var listlen = list.options.length;
    for (var i = listlen - 1; i >= num; i--) {
        list.options[i] = null;
    }
}
function isRui(year) {
    if ((year % 400 == 0) || (year % 4 == 0 && year / 100 != 0))
        return true;
    return false;
}
function s_addlist(obj, begin, length) {
    var list = s_getobj(obj);
    for (var i = 0; i < length; i++) {
        var num = i + begin;
        list.options[i] = new Option(num, num);
    }
}