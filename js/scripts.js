// Closure to stop anything polluting the global scope
(function() {
    // Set up some defaults
    var request = new XMLHttpRequest(),
        url = 'http://content.guardianapis.com/',
        // If this were a larger project, I'd make something to format an object into this string
        params = '?api-key=9wur7sdh84azzazdt3ye54k4&page=1&page-size=5&order-by=newest';

    // Kick things off
    init();

    /**
     * Gets initial data, calls binding
     */
    function init() {
        // UK news is an arbitrary choice
        getContent('uk-news');
        bindEvents();
    }

    /**
     * Adds listeners to tabs
     */
    function bindEvents() {
        var tabs = document.querySelectorAll(".js-tab-widget__nav-button"),
        i;

        for (i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener("click", changeTab);
        }
    }

    /**
     * Handles tabbing, calls content request
     * @param  {Object} event
     */
    function changeTab(event) {
        // Native class toggle, not as clean as jQuery, but it works
        // get the clicked element
        element = event.target;
        // keeping classes out of the way
        var className = 'tab-widget__nav-button--active',
        active = document.querySelectorAll("." + className)[0];

        // Remove the current active class
        if (active.classList) {
            active.classList.remove(className);
        } else {
            active.className = active.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }


        if (element.classList) {
            element.classList.toggle(className);
        } else {
            var classes = element.className.split(' ');
            var existingIndex = classes.indexOf(className);

            if (existingIndex >= 0)
            classes.splice(existingIndex, 1);
            else
            classes.push(className);

            element.className = classes.join(' ');
        }

        getContent(element.dataset.section);
    }

    /**
     * Makes a HTTP request
     * @param  {[type]} section [description]
     * @return {[type]}         [description]
     */
    function getContent(section) {

        request.open('GET', url + section + params, true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                var data = JSON.parse(request.responseText);
                formatHtml(data.response.results);
            } else {
                handleError();
            }
        };

        request.onerror = function() {
            handleError();
        };

        /**
         * Handles HTTP request errors
         */
        function handleError() {
            var errorContent = '<p class="tab-widget__note">Sorry, there was a problem, please try again later</p>';
            setHtml(errorContent);
        }

        request.send();

        /**
         * Formats data into HTML
         * @param  {Object} data
         */
        function formatHtml(results) {
            var html = '<ol class="tab-widget__list">',
                i;

                for (i = 0; i < results.length; i++) {
                    html += '<li class="tab-widget__list-item">\
                        <a href="' + results[i].webUrl + '" class="tab-widget__list-item-link">' + results[i].webTitle + '</a>\
                        </li>'
                }

                html += '</ol>';

            setHtml(html);
        }

        function setHtml(html) {
            var container = document.querySelectorAll('.tab-widget__content')[0];
            container.innerHTML = html;
        }
    }

})();
