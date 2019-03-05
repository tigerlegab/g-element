const baseUrl = window.location.origin;

loadScript('/node_modules/jquery/dist/jquery.min.js');
loadScript('/node_modules/moment/min/moment.min.js');
loadScript('/node_modules/fullcalendar/dist/fullcalendar.min.js');

function loadScript(depsUrl) {
    var script = document.createElement('script');
    script.src = baseUrl + depsUrl;
    document.head.appendChild(script);
}
