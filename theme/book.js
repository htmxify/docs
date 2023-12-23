"use strict";

// Fix back button cache problem
window.onunload = function () { };

(function themes() {
    var html = document.querySelector('html');
    var themeToggleButton = document.getElementById('theme-toggle');
    var themePopup = document.getElementById('theme-list');
    var themeColorMetaTag = document.querySelector('meta[name="theme-color"]');

    function showThemes() {
        themePopup.style.display = 'block';
        themeToggleButton.setAttribute('aria-expanded', true);
        themePopup.querySelector("button#" + get_theme()).focus();
    }

    function updateThemeSelected() {
        themePopup.querySelectorAll('.theme-selected').forEach(function (el) {
            el.classList.remove('theme-selected');
        });
        themePopup.querySelector("button#" + get_theme()).classList.add('theme-selected');
    }

    function hideThemes() {
        themePopup.style.display = 'none';
        themeToggleButton.setAttribute('aria-expanded', false);
        themeToggleButton.focus();
    }

    function get_theme() {
        var theme;
        try { theme = localStorage.getItem('mdbook-theme'); } catch (e) { }
        if (theme === null || theme === undefined) {
            return default_theme;
        } else {
            return theme;
        }
    }

    function set_theme(theme, store = true) {

        setTimeout(function () {
            themeColorMetaTag.content = getComputedStyle(document.documentElement).backgroundColor;
        }, 1);

        var previousTheme = get_theme();

        if (store) {
            try { localStorage.setItem('mdbook-theme', theme); } catch (e) { }
        }

        html.classList.remove(previousTheme);
        html.classList.add(theme);
        updateThemeSelected();
    }

    // Set theme
    var theme = get_theme();

    set_theme(theme, false);

    themeToggleButton.addEventListener('click', function () {
        if (themePopup.style.display === 'block') {
            hideThemes();
        } else {
            showThemes();
        }
    });

    themePopup.addEventListener('click', function (e) {
        var theme;
        if (e.target.className === "theme") {
            theme = e.target.id;
        } else if (e.target.parentElement.className === "theme") {
            theme = e.target.parentElement.id;
        } else {
            return;
        }
        set_theme(theme);
    });

    themePopup.addEventListener('focusout', function(e) {
        // e.relatedTarget is null in Safari and Firefox on macOS (see workaround below)
        if (!!e.relatedTarget && !themeToggleButton.contains(e.relatedTarget) && !themePopup.contains(e.relatedTarget)) {
            hideThemes();
        }
    });

    // Should not be needed, but it works around an issue on macOS & iOS: https://github.com/rust-lang/mdBook/issues/628
    document.addEventListener('click', function(e) {
        if (themePopup.style.display === 'block' && !themeToggleButton.contains(e.target) && !themePopup.contains(e.target)) {
            hideThemes();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) { return; }
        if (!themePopup.contains(e.target)) { return; }

        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                hideThemes();
                break;
            case 'ArrowUp':
                e.preventDefault();
                var li = document.activeElement.parentElement;
                if (li && li.previousElementSibling) {
                    li.previousElementSibling.querySelector('button').focus();
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                var li = document.activeElement.parentElement;
                if (li && li.nextElementSibling) {
                    li.nextElementSibling.querySelector('button').focus();
                }
                break;
            case 'Home':
                e.preventDefault();
                themePopup.querySelector('li:first-child button').focus();
                break;
            case 'End':
                e.preventDefault();
                themePopup.querySelector('li:last-child button').focus();
                break;
        }
    });
})();

(function sidebar() {
    var body = document.querySelector("body");
    var sidebar = document.getElementById("sidebar");
    var sidebarLinks = document.querySelectorAll('#sidebar a');
    var sidebarToggleButton = document.getElementById("sidebar-toggle");
    var sidebarResizeHandle = document.getElementById("sidebar-resize-handle");
    var firstContact = null;

    function showSidebar() {
        body.classList.remove('sidebar-hidden')
        body.classList.add('sidebar-visible');
        Array.from(sidebarLinks).forEach(function (link) {
            link.setAttribute('tabIndex', 0);
        });
        sidebarToggleButton.setAttribute('aria-expanded', true);
        sidebar.setAttribute('aria-hidden', false);
        try { localStorage.setItem('mdbook-sidebar', 'visible'); } catch (e) { }
    }


    var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');

    function toggleSection(ev) {
        ev.currentTarget.parentElement.classList.toggle('expanded');
    }

    Array.from(sidebarAnchorToggles).forEach(function (el) {
        el.addEventListener('click', toggleSection);
    });

    function hideSidebar() {
        body.classList.remove('sidebar-visible')
        body.classList.add('sidebar-hidden');
        Array.from(sidebarLinks).forEach(function (link) {
            link.setAttribute('tabIndex', -1);
        });
        sidebarToggleButton.setAttribute('aria-expanded', false);
        sidebar.setAttribute('aria-hidden', true);
        try { localStorage.setItem('mdbook-sidebar', 'hidden'); } catch (e) { }
    }

    // Toggle sidebar
    sidebarToggleButton.addEventListener('click', function sidebarToggle() {
        if (body.classList.contains("sidebar-hidden")) {
            var current_width = parseInt(
                document.documentElement.style.getPropertyValue('--sidebar-width'), 10);
            if (current_width < 150) {
                document.documentElement.style.setProperty('--sidebar-width', '150px');
            }
            showSidebar();
        } else if (body.classList.contains("sidebar-visible")) {
            hideSidebar();
        } else {
            if (getComputedStyle(sidebar)['transform'] === 'none') {
                hideSidebar();
            } else {
                showSidebar();
            }
        }
    });

    sidebarResizeHandle.addEventListener('mousedown', initResize, false);

    function initResize(e) {
        window.addEventListener('mousemove', resize, false);
        window.addEventListener('mouseup', stopResize, false);
        body.classList.add('sidebar-resizing');
    }
    function resize(e) {
        var pos = (e.clientX - sidebar.offsetLeft);
        if (pos < 20) {
            hideSidebar();
        } else {
            if (body.classList.contains("sidebar-hidden")) {
                showSidebar();
            }
            pos = Math.min(pos, window.innerWidth - 100);
            document.documentElement.style.setProperty('--sidebar-width', pos + 'px');
        }
    }
    //on mouseup remove windows functions mousemove & mouseup
    function stopResize(e) {
        body.classList.remove('sidebar-resizing');
        window.removeEventListener('mousemove', resize, false);
        window.removeEventListener('mouseup', stopResize, false);
    }

    document.addEventListener('touchstart', function (e) {
        firstContact = {
            x: e.touches[0].clientX,
            time: Date.now()
        };
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
        if (!firstContact)
            return;

        var curX = e.touches[0].clientX;
        var xDiff = curX - firstContact.x,
            tDiff = Date.now() - firstContact.time;

        if (tDiff < 250 && Math.abs(xDiff) >= 150) {
            if (xDiff >= 0 && firstContact.x < Math.min(document.body.clientWidth * 0.25, 300))
                showSidebar();
            else if (xDiff < 0 && curX < 300)
                hideSidebar();

            firstContact = null;
        }
    }, { passive: true });
})();

(function clipboard() {
    var clipButtons = document.querySelectorAll('.clip-button');

    function hideTooltip(elem) {
        elem.firstChild.innerText = "Copy";
    }

    function showTooltip(elem, msg) {
        elem.firstChild.innerText = msg;
        elem.className = 'tooltipped';
    }

    var clipboardSnippets = new ClipboardJS('.clip-button', {
        text: function (trigger) {
            hideTooltip(trigger);
        }
    });

    Array.from(clipButtons).forEach(function (clipButton) {
        clipButton.addEventListener('mouseout', function (e) {
            hideTooltip(e.currentTarget);
        });
    });

    clipboardSnippets.on('success', function (e) {
        e.clearSelection();
        showTooltip(e.trigger, "Copied!");
    });

    clipboardSnippets.on('error', function (e) {
        showTooltip(e.trigger, "Clipboard error!");
    });
})();

(function scrollToTop () {
    var menuTitle = document.querySelector('.menu-title');

    menuTitle.addEventListener('click', function () {
        document.scrollingElement.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

(function controllMenu() {
    var menu = document.getElementById('menu-bar');

    (function controllPosition() {
        var scrollTop = document.scrollingElement.scrollTop;
        var prevScrollTop = scrollTop;
        var minMenuY = -menu.clientHeight - 50;
        // When the script loads, the page can be at any scroll (e.g. if you reforesh it).
        menu.style.top = scrollTop + 'px';
        // Same as parseInt(menu.style.top.slice(0, -2), but faster
        var topCache = menu.style.top.slice(0, -2);
        menu.classList.remove('sticky');
        var stickyCache = false; // Same as menu.classList.contains('sticky'), but faster
        document.addEventListener('scroll', function () {
            scrollTop = Math.max(document.scrollingElement.scrollTop, 0);
            // `null` means that it doesn't need to be updated
            var nextSticky = null;
            var nextTop = null;
            var scrollDown = scrollTop > prevScrollTop;
            var menuPosAbsoluteY = topCache - scrollTop;
            if (scrollDown) {
                nextSticky = false;
                if (menuPosAbsoluteY > 0) {
                    nextTop = prevScrollTop;
                }
            } else {
                if (menuPosAbsoluteY > 0) {
                    nextSticky = true;
                } else if (menuPosAbsoluteY < minMenuY) {
                    nextTop = prevScrollTop + minMenuY;
                }
            }
            if (nextSticky === true && stickyCache === false) {
                menu.classList.add('sticky');
                stickyCache = true;
            } else if (nextSticky === false && stickyCache === true) {
                menu.classList.remove('sticky');
                stickyCache = false;
            }
            if (nextTop !== null) {
                menu.style.top = nextTop + 'px';
                topCache = nextTop;
            }
            prevScrollTop = scrollTop;
        }, { passive: true });
    })();
    (function controllBorder() {
        function updateBorder() {
            if (menu.offsetTop === 0) {
                menu.classList.remove('bordered');
            } else {
                menu.classList.add('bordered');
            }
        }
        updateBorder();
        document.addEventListener('scroll', updateBorder, { passive: true });
    })();
})();
