// const func1 = require('./about/script1');
// const func2 = require('./contact/script2');
// const func3 = require('./work/script3');
import './globalStyle.css';
import func1 from './about/script1';
import func2 from './contact/script2';
import func3 from './work/script3';

(function () {
    console.log('entry iife')
})()

console.log(window)

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

$(document).ready(function () {
    $(this).scrollTop(0);
    console.log("DOM fully loaded and parsed");
    func1();
    func2();
    func3();
});