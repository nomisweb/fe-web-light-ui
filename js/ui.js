/*
*
* Javascript based UI elements for Nomis
*
* Author: Spencer Hedger
*
*/
var nomisUI = function () {
    var cbi = 0;
    var si = 0;
    var tabid = 0;

    function textism(text) {
        var origText = text;

        // Link with short name in square brackets after it
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])\[([A-Z0-9 ]*)\]/ig;
        text = text.replace(exp, '<a target="_blank" href="$1">$3</a>');

        // Normal link with no short name
        if (origText == text) {
            exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            text = text.replace(exp, '<a target="_blank" href="$1">$1</a>');
        }

        // Bullet list
        exp = /\n\* ([-A-Z0-9+&@#\/%?=~_|!:,.; \/'\(\)\*]*)/ig
        text = text.replace(exp, '<ul><li>$1<\/li></ul>');

        // Bold
        exp = /\*([-A-Z0-9+&@#\/%?=~_|!:,.; \(\)]*)\*/ig
        text = text.replace(exp, '<strong>$1<\/strong>');

        // Italic
        exp = /\b_([-A-Z0-9+&@#\/%?=~_|!:,.; \(\)]*)_\b/ig
        text = text.replace(exp, '<i>$1<\/i>');

        // Heading 1
        exp = /\bh1([-A-Z0-9+&@#\/%?=~_|!:,.; \(\)]*)\/h1/ig
        text = text.replace(exp, '<h1>$1<\/h1>');

        // Heading 2
        exp = /\bh2([-A-Z0-9+&@#\/%?=~_|!:,.; \(\)]*)\/h2/ig
        text = text.replace(exp, '<h2>$1<\/h2>');

        // Heading 3
        exp = /\bh3([-A-Z0-9+&@#\/%?=~_|!:,.; \(\)]*)\/h3/ig
        text = text.replace(exp, '<h3>$1<\/h3>');

        text = text.replace(/(\r\n|\n|\r)/g, '<br \/>');
        return text;
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function isArray(obj) {
        return obj.constructor === Array;
    }

    function isFunction(obj) {
        return typeof (obj) === 'function';
    }

    function addCssClass(obj, cssClass) {
        var list = cssClass.split(' ');
        for (var i = 0; i < list.length; i++) {
            if (!obj.classList.contains(list[i])) obj.classList.add(list[i]);
        }
    }

    function removeCssClass(obj, cssClass) {
        if (obj.classList.contains(cssClass)) obj.classList.remove(cssClass);
    }

    function forEachProperty(obj, func) {
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                func(property, obj);
            }
        }
    }

    function getqs(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return (false);
    }

    function resolveContent(content, useTextism) {
        if (typeof content === 'string') {
            if (!useTextism) return document.createTextNode(content);
            else {
                var span = document.createElement('span');
                span.innerHTML = textism(content);
                return span;
            }
        }
        else if (typeof content === 'number') return document.createTextNode(content);
        else if (isFunction(content)) return content();
        else return content;
    }

    function appendContent(content, obj) {
        if (isArray(content)) {
            for (var i = 0; i < content.length; i++) {
                obj.appendChild(resolveContent(content[i]));
            }
        }
        else obj.appendChild(resolveContent(content));
    }

    function assignevents(events, obj) {
        if (events.onblur) obj.onblur = events.onblur;
        if (events.onchange) obj.onchange = events.onchange;
        if (events.oncontextmenu) obj.oncontextmenu = events.oncontextmenu;
        if (events.onclick) obj.onclick = events.onclick;
        if (events.onmouseover) obj.onmouseover = events.onmouseover;
        if (events.onmouseout) obj.onmouseout = events.onmouseout;
        if (events.onwheel) obj.onwheel = events.onwheel;
        if (events.onsearch) obj.onsearch = events.onsearch;
        if (events.onselect) obj.onselect = events.onselect;
        if (events.onkeydown) obj.onkeydown = events.onkeydown;
        if (events.onkeypress) obj.onkeypress = events.onkeypress;
        if (events.onkeyup) obj.onkeyup = events.onkeyup;
    }

    function assignattr(options, obj) {
        if (options.value) obj.value = options.value;
        if (options.classname) addCssClass(obj, options.classname);
        if (options.name) obj.setAttribute('name', options.name);
        if (options.id) obj.setAttribute('id', options.id);
        if (options.disabled) obj.disabled = options.disabled;
    }

    function element(options) {
        var elem = document.createElement(options.tagname);

        if (options.content) {
            if (isArray(options.content)) {
                for (var i = 0; i < options.content.length; i++) {
                    elem.appendChild(resolveContent(options.content[i]));
                }
            }
            else elem.appendChild(resolveContent(options.content));
        }

        if (options.attributes) {
            for (var i = 0; i < options.attributes.length; i++) {
                var attr = options.attributes[i];
                elem.setAttribute(attr.name, attr.value);
            }
        }

        assignattr(options, elem);
        assignevents(options, elem);

        return elem;
    }

    function labelledinput(options, type) {
        var id = 'input_' + cbi;

        // Set up initial options
        if (options.id) id = options.id + ((type == 'radio') ? '_' + cbi : '');
        else options.id = id;

        var lbl = document.createElement('label');
        lbl.setAttribute('for', id);
        lbl.appendChild(document.createTextNode(options.label));

        var cb = document.createElement('input');
        cb.setAttribute('type', type);
        cb.id = id;
        cb.value = options.value;
        cbi++;

        var div = document.createElement('span');
        div.appendChild(cb);
        div.appendChild(lbl);

        if (options.details) {
            var details = document.createElement('details');
            var sum = document.createElement('summary');
            sum.appendChild(document.createTextNode(options.details.summary));
            details.appendChild(sum);
            details.appendChild(document.createTextNode(options.details.content));

            div.appendChild(details);
        }

        // Set up final options
        assignevents(options, cb);
        assignattr(options, cb);
        if (options.checked === true) cb.checked = true;

        return div;
    }

    function chk(options) {
        return labelledinput(options, 'checkbox');
    }

    function rad(options) {
        return labelledinput(options, 'radio');
    }

    function alink(options) {
        var a = document.createElement('a');


        assignevents(options, a);
        assignattr(options, a);

        a.href = options.href;
        a.appendChild(document.createTextNode(options.label));

        return a;
    }

    function art(options) {
        var article = document.createElement('article');
        var h1 = document.createElement('h1');

        appendContent(options.heading, h1);
        article.appendChild(h1);

        if (typeof options.content === 'string') {
            var p = document.createElement('p');
            p.appendChild(document.createTextNode(options.content));
            article.appendChild(p);
        }
        else appendContent(options.content, document);

        return article;
    }

    function crumb(options) {
        var li = document.createElement('li');
        li.setAttribute('itemscope', true);
        li.setAttribute('itemtype', 'http:\/\/data-vocabulary.org/Breadcrumb');

        var a = document.createElement('a');
        assignattr(options, a);

        a.setAttribute('itemprop', 'url');
        a.setAttribute('href', options.href);
        var span = document.createElement('span');
        span.setAttribute('itemprop', 'title');
        span.appendChild(document.createTextNode(options.title));

        a.appendChild(span);
        li.appendChild(a);

        return li;
    }

    function crumbs(list) {
        var ol = document.createElement('ol');

        list.forEach(function (entry) {
            ol.appendChild(crumb(entry));
        });

        return ol;
    }

    function reveal(options) {
        var cls = options.classname;
        var cssA = options.classnameOpened;
        var cssB = options.classnameClosed;
        var labA = options.labelOpened;
        var labB = options.labelClosed;
        var tip = options.tip;

        if (cls) cssA += ' ' + cls;
        if (cls) cssB += ' ' + cls;

        var div = document.createElement('div');
        var btn = document.createElement('button');
        var panel = options.content;

        var f = null;
        if (options.onchange) f = options.onchange;

        div.appendChild(btn);
        div.appendChild(panel);

        if (options.active) {
            btn.innerHTML = labA;
            panel.className = cssA;
        }
        else {
            btn.innerHTML = labB;
            panel.className = cssB;
        }

        if (tip) btn.setAttribute('title', tip);
        btn.onclick = function () {
            if (panel.className === cssA) {
                btn.innerHTML = labB;
                panel.className = cssB;
                if (f != null) f(true);
            }
            else {
                btn.innerHTML = labA;
                panel.className = cssA;
                if (f != null) f(false);
            }
        }

        return div;
    }

    function wraplist(container, list, onEach) {
        var c = (typeof container === 'string') ? document.createElement(container) : container;


        list.forEach(function (entry) {
            if (isFunction(onEach)) c.appendChild(onEach(entry));
            else c.appendChild(entry);
        });

        return c;
    }

    function select(options) {
        var div = document.createElement('span');
        if (!options.id) {
            options.id = 'select_' + si;
            si++;
        }

        var select = wraplist('select', options.list, function (entry) {
            if (entry.list) { // Optgroup
                var optgroup = document.createElement('optgroup');
                optgroup.setAttribute('label', entry.label);

                entry.list.map(function (en) {
                    var option = document.createElement('option');
                    option.value = en.value;

                    option.appendChild(document.createTextNode(en.label));
                    optgroup.appendChild(option);
                });

                return optgroup;
            }
            else { // Single option
                var option = document.createElement('option');
                option.value = entry.value;
                option.appendChild(document.createTextNode(entry.label));

                return option;
            }
        });

        assignevents(options, select);
        assignattr(options, select);

        if (options.selected) select.value = options.selected;

        if (options.label) {
            var lbl = document.createElement('label');
            lbl.setAttribute('for', options.id);
            lbl.appendChild(document.createTextNode(options.label));
            div.appendChild(lbl);
        }

        div.appendChild(select);
        return div;
    }

    function btn(options) {
        var button = document.createElement('button');

        appendContent(options.label, button);

        assignevents(options, button);
        assignattr(options, button);
        return button;
    }

    function text(options) {
        var t = document.createElement('input');
        t.setAttribute('type', 'text');

        if (options.placeholder) t.setAttribute('placeholder', options.placeholder);

        assignevents(options, t);
        assignattr(options, t);
        return t;
    }

    function search(options) {
        var t = document.createElement('input');
        t.setAttribute('type', 'search');

        if (options.placeholder) t.setAttribute('placeholder', options.placeholder);

        assignevents(options, t);
        assignattr(options, t);
        return t;
    }

    function togglebtn(options) {
        var button = document.createElement('button');

        var labels = options.labels;
        var i = options.index || 0;

        button.innerHTML = labels[i];
        button.onclick = function () {
            if (i == labels.length - 1) i = 0;
            else i++;

            if (isFunction(options.toggle)) {
                // If toggle function returns false, need to step back
                if (options.toggle(i, labels[i]) == false) {
                    if (i == 0) i = labels.length - 1;
                    else i--;
                }
            }

            button.innerHTML = labels[i];
        };

        assignevents(options, button);
        assignattr(options, button);

        return button;
    }

    function treechilditer(arr, depth, target, rootoptions) {
        var ul = target || document.createElement('ul');
        addCssClass(ul, rootoptions.classnameBranch || 'branch');

        for (var i = 0; i < arr.length; i++) {
            ul.appendChild(treenode(arr[i], depth + 1, rootoptions));
        }

        return ul;
    }

    function treenode(options, depth, rootoptions) {
        var node = document.createElement('li');

        addCssClass(node, rootoptions.classnameNode || 'node');

        var childul = document.createElement('ul'); // Placeholder for children;
        addCssClass(childul, rootoptions.classnameBranch || 'branch');

        var cssopened = rootoptions.classnameOpened || 'opened';
        var cssclosed = rootoptions.classnameClosed || 'closed';
        var cssopening = rootoptions.classnameOpening || 'opening';

        if (options.children) {
            var cssexpander = rootoptions.classnameToggleExpander || 'toggle-expander';
            var b = null;
            var children_added = false;
            var toggling = false;

            if (options.autoExpand == false) { // Expand on demand
                addCssClass(childul, cssclosed);

                b = togglebtn({
                    labels: ['+', '-'],
                    classname: cssexpander,
                    toggle: function (index, label) {
                        if (toggling) return false; // Don't repeatedly toggle if busy!
                        toggling = true;

                        var n = childul; // Node to expand

                        if (index == 1) { // Expand
                            if (!children_added) {
                                if (isFunction(options.children)) {
                                    removeCssClass(childul, cssclosed);
                                    addCssClass(n, cssopening);
                                    options.children(function (children) {
                                        node.appendChild(treechilditer(children, depth, n, rootoptions));
                                        children_added = true;

                                        removeCssClass(n, cssopening);
                                        removeCssClass(n, cssclosed);
                                        addCssClass(n, cssopened);

                                        toggling = false;
                                    });
                                }
                                else {
                                    node.appendChild(treechilditer(options.children, depth, n, rootoptions));
                                    children_added = true;

                                    removeCssClass(n, cssclosed);
                                    addCssClass(n, cssopened);
                                    toggling = false;
                                }
                            }
                            else {
                                removeCssClass(n, cssclosed);
                                addCssClass(n, cssopened);
                                toggling = false;
                            }
                        }
                        else { // Closed
                            if (!children_added) {
                                node.appendChild(treechilditer(options.children, depth, n, rootoptions));
                                chilrden_added = true;
                            }

                            removeCssClass(n, cssopened);
                            addCssClass(n, cssclosed);
                            toggling = false;
                        }
                    }
                });
            }
            else { // Expanded immediately
                addCssClass(childul, cssopened);

                b = togglebtn({
                    labels: ['+', '-'],
                    index: 1,
                    classname: cssexpander,
                    toggle: function (index, label) {
                        if (index == 1) { // Expand
                            removeCssClass(childul, cssclosed);
                            addCssClass(childul, cssopened);
                        }
                        else { // Closed
                            removeCssClass(childul, cssopened);
                            addCssClass(childul, cssclosed);
                        }
                    }
                });
            }

            node.appendChild(b);
        }

        if (options.content) node.appendChild(options.content);

        if (options.autoExpand != false) { // Expand now
            if (isFunction(options.children)) {
                options.children(function (children) {
                    node.appendChild(treechilditer(children, depth, childul, rootoptions));
                });
            }
            else if (options.children) {
                node.appendChild(treechilditer(options.children, depth, childul, rootoptions));
            }
        }
        else {
            node.appendChild(childul);
        }

        return node;
    }

    function tree(options) {
        var div = document.createElement('div');
        div.appendChild(treechilditer(options.children, 0, null, options));

        assignevents(options, div);
        assignattr(options, div);

        return div;
    }

    function table(options) {
        function table_colWidth(column) {
            if (column.columns) {
                var w = 0;

                for (var i = 0; i < column.columns.length; i++) {
                    var col = column.columns[i];

                    w += table_colWidth(col);
                }

                return w;
            }
            else return 1;
        }

        function table_colDepth(column, depth) {
            if (column.columns) {
                var max = 0;

                for (var i = 0; i < column.columns.length; i++) {
                    var col = column.columns[i];

                    var tmp = table_colDepth(col, depth + 1);
                    if (tmp > max) max = tmp;
                }

                return depth + max;
            }
            else return depth - 1;
        }

        function table_flagtrigs(value, valueflag, trigflg) {
            var matchedlist = [];

            for (var i = 0; i < trigflg.length; i++) {
                var entry = trigflg[i];

                var flag = entry.flag;

                if (!flag.trigger) {
                    // Either no flag, or there is a flag and it matches the value flag.
                    if ((!flag.flag) || (valueflag != null && flag.flag === valueflag)) {
                        entry.triggered = true;
                        matchedlist.push(flag);
                    }
                }
                else {
                    if (isFunction(flag.trigger) && flag.trigger(value, valueflag)) {
                        entry.triggered = true;
                        matchedlist.push(flag);
                    }
                }
            }

            return matchedlist;
        }

        function table_createFlags(matchedflags, flagsymbol, cssClass) {
            var elems = [];

            if (matchedflags) {
                for (var i = 0; i < matchedflags.length; i++) {
                    var f = matchedflags[i];
                    var sup = element({ tagname: 'sup', content: f.flag, classname: cssClass });

                    if (typeof f.content === 'string') {
                        var abbr = element({
                            tagname: 'abbr',
                            content: sup,
                            attributes: [{ name: 'title', value: f.content}]
                        });

                        elems.push(abbr);
                    }
                    else elems.push(sup);
                }
            }
            else elems.push(element({ tagname: 'sup', content: flagsymbol, classname: cssClass }));

            return elems;
        }

        function table_addColsAtDepth(column, tr, depth, maxDepth, curr, trigflg) {
            var current = 0;
            if (curr) current = curr;

            if (current == depth) {
                var th = document.createElement('th');
                th.innerHTML = column.label;
                th.setAttribute('scope', 'col');

                // Flag?
                if (column.flag && trigflg) {
                    var matchedflags = table_flagtrigs(column.label, column.flag, trigflg);
                    wraplist(th, table_createFlags(matchedflags, column.flag, 'table-heading-flag'));
                }

                tr.appendChild(th);

                if (!column.columns) {
                    if (depth < maxDepth) th.setAttribute('rowspan', maxDepth - depth);
                }
                else {
                    th.setAttribute('colspan', table_colWidth(column));
                }

                assignattr(column, th);
                assignevents(column, th);
            }
            else if (column.columns) { // Children
                for (var i = 0; i < column.columns.length; i++) {
                    table_addColsAtDepth(column.columns[i], tr, depth, maxDepth, current + 1, trigflg);
                }
            }
        }

        function table_colPaths(column, paths, startPos) {
            if (!column) return paths;

            var cols = paths || new Array();
            var colspos = 0;
            if (startPos) colspos = startPos;

            if (column.columns) {
                for (var i = 0; i < column.columns.length; i++) {
                    var col = column.columns[i];
                    var colsw = table_colWidth(col);

                    for (var j = 0; j < colsw; j++) {
                        if (cols[colspos + j] == undefined) cols[colspos + j] = new Array();
                        cols[colspos + j].push(col);
                    }

                    // Add all children of this column to the path
                    table_colPaths(col, cols, colspos);

                    colspos += colsw;
                }
            }

            return cols;
        }

        function table_createRow(cells, maxCols, rowspans) {
            var tr = document.createElement('tr');

            for (var i = 0; i < cells.length; i++) {
                var td = document.createElement('td');
                if (i == (cells.length - 1) && cells.length < maxCols) td.setAttribute('colspan', maxCols - i);
                if (rowspans != undefined && rowspans[i] > 1) td.setAttribute('rowspan', rowspans[i]);

                appendContent(cells[i].content, td);

                assignattr(cells[i], td);
                assignevents(cells[i], td);

                tr.appendChild(td);
            }

            return tr;
        }

        function table_createFlagContent(f) {
            var flgdiv = wraplist('div', [
			    element({ tagname: 'span', classname: 'table-flag-symbol', content: resolveContent(f.flag) }),
			    element({ tagname: 'span', classname: 'table-flag-content', content: resolveContent(f.content, true) })
		    ]);

            addCssClass(flgdiv, 'table-flag');

            return flgdiv;
        }

        function table_createFlagRow(f, maxCols) {
            return table_createRow([
			    { content: table_createFlagContent(f), classname: 'table-flag' }
		    ], maxCols);
        }

        function table_dressValue(value, vobj) {
            if (value == null || value == undefined) return '';

            if (typeof value === 'number') {
                // Precision
                if (vobj.precision && (typeof vobj.precision === 'number')) {
                    value = value.toFixed(vobj.precision);
                }

                value = numberWithCommas(value);
            }

            if (vobj.symbol) {
                if (vobj.position == 'end') value += vobj.symbol;
                else value = vobj.symbol + value;
            }

            return value;
        }

        var id = options.id || 'table' + (tabid++);
        var tCols = options.data[0].values.length + 1; // +1 for row label
        var tColDepth = table_colDepth(options, 0);

        var tbl = document.createElement('table');
        tbl.id = id;
        addCssClass(tbl, options.classname || 'ui-data-table');

        if (options.summary) {
            tbl.setAttribute('summary', options.summary);
        }

        // Table caption
        if (options.caption || options.unit) {
            var caption = document.createElement('caption');
            if (options.caption) caption.appendChild(document.createTextNode(options.caption));

            if (options.unit) {
                var unitdiv = document.createElement('div');

                if (isArray(options.unit)) {
                    for (var i = 0; i < options.unit.length; i++) {
                        var unit = options.unit[i];
                        var u = element({ tagname: 'span', content: unit.content });
                        assignattr(unit, u);
                        assignevents(unit, u);
                        appendContent(u, unitdiv);
                    }
                }
                else if (options.unit.content) {
                    appendContent(options.unit.content, unitdiv);
                    assignattr(options.unit, unitdiv);
                    assignevents(options.unit, unitdiv);
                }

                caption.appendChild(unitdiv);
            }

            tbl.appendChild(caption);
        }

        var thead = document.createElement('thead');
        var tbody = document.createElement('tbody');
        var tfoot = document.createElement('tfoot');

        // Establish column nesting array
        var paths = table_colPaths(options);
        var pathids = [];

        // Label up the paths
        for (var i = 0; i < paths.length; i++) {
            var ids = '';

            for (var j = 0; j < paths[i].length; j++) {
                var c = paths[i][j];
                if (!c.id) c.id = id + '_c' + (i + 1) + '_' + j;

                if (ids.length > 0) ids += ' ';
                ids += c.id;
            }

            pathids.push(ids);
        }

        // List of flags and whether they are triggered or not
        var trigflg = [];
        if (options.flags) {
            for (var i = 0; i < options.flags.length; i++) {
                trigflg.push({ triggered: false, flag: options.flags[i] });
            }
        }

        // Column headings
        for (var i = 0; i < tColDepth; i++) {
            var tr = document.createElement('tr');

            // Row heading
            if (i == 0) {
                var th = document.createElement('th');
                th.innerHTML = options.rowheading || ' ';
                th.setAttribute('rowspan', tColDepth);
                th.setAttribute('scope', 'col');
                th.setAttribute('id', id + '_c0');
                tr.appendChild(th);
            }

            for (var j = 0; j < options.columns.length; j++) {
                table_addColsAtDepth(options.columns[j], tr, i, tColDepth, null, trigflg);
            }

            thead.appendChild(tr);
        }

        // Rows of data
        for (var i = 0; i < options.data.length; i++) {
            var d = options.data[i];

            var tr = document.createElement('tr');
            var th = document.createElement('th');

            if (isArray(d.label)) {
                // Create a separator row?
                if (d.label.length > 1) {
                    // Work out the previous label from the previous row
                    var prevlab = null;
                    var previdx = d.label.length - 2;

                    if (i > 0) {
                        var p = options.data[i - 1].label
                        if (isArray(p)) {
                            if (p.length > previdx) prevlab = p[previdx];
                            else if (p.length == 1) prevlab = p[p.length - 1];
                        }
                        else prevlab = p;
                    }

                    var prev = d.label[previdx];
                    if (prevlab != null && prev != prevlab) {
                        var trsep = document.createElement('tr');
                        var tdsep = document.createElement('th');
                        tdsep.setAttribute('colspan', tCols);
                        trsep.appendChild(tdsep);
                        addCssClass(trsep, 'table-row-sep-label');
                        if (d.classname) addCssClass(trsep, d.classname);

                        tdsep.appendChild(document.createTextNode(prev));
                        tbody.appendChild(trsep);
                    }
                    else if (d.classname) addCssClass(tr, d.classname);
                }
                else if (d.classname) addCssClass(tr, d.classname);

                var lbl = d.label[d.label.length - 1];

                // Full label path
                var full = '';
                for (var j = 0; j < d.label.length - 1; j++) {
                    var frag = d.label[j] + ': ';
                    full += frag;
                    lbl = lbl.replace(frag, '');
                }
                full += lbl;

                th.appendChild(element({
                    tagname: 'abbr',
                    content: lbl,
                    attributes: [{ name: 'title', value: full}]
                }));

                addCssClass(th, 'table-row-level-' + (d.label.length - 1));
            }
            else {
                if (d.classname) addCssClass(tr, d.classname);
                th.appendChild(document.createTextNode(d.label));
            }

            th.setAttribute('scope', 'row');
            th.setAttribute('headers', id + '_c0');
            tr.appendChild(th);

            assignevents(d, th);

            for (var j = 0; j < d.values.length; j++) {
                var hdrs = pathids[j];

                var td = document.createElement('td');

                var v = d.values[j];
                if (typeof v !== 'number' && typeof v !== 'string') { // Value is an object
                    // Flag?
                    var matchedflags = table_flagtrigs(v.value, v.flag, trigflg);

                    if (v.value != null) td.appendChild(resolveContent(table_dressValue(v.value, v)));
                    if (v.flag) wraplist(td, table_createFlags(matchedflags, v.flag, 'table-cell-flag'));

                    assignattr(v, td);
                    assignevents(v, td);
                }
                else { // Value is not an object
                    // Flag?
                    table_flagtrigs(v, v, trigflg);
                    td.appendChild(resolveContent(v));
                }

                td.setAttribute('headers', hdrs);
                tr.appendChild(td);
            }

            tbody.appendChild(tr);
        }

        var tfoottr = document.createElement('tr');
        var tfoottd = document.createElement('td');
        tfoottd.setAttribute('colspan', tCols);
        tfoottr.appendChild(tfoottd);
        tfoot.appendChild(tfoottr);

        var sidenotes = [];
        if (options.source) sidenotes.push(element({ tagname: 'div', content: ['Source: ', resolveContent(options.source)], classname: 'table-source' }));

        if (sidenotes.length > 0) tfoottd.appendChild(element({ tagname: 'div', content: element({ tagname: 'div', content: sidenotes, classname: 'table-sidenote-content' }), classname: 'table-sidenotes' }));

        // Triggered flags
        for (var i = 0; i < trigflg.length; i++) {
            var tf = trigflg[i];

            if (tf.triggered) tfoottd.appendChild(table_createFlagContent(tf.flag));
        }

        // Footnotes
        if (options.footnotes) {
            // Hide footnotes if there is more than two
            var lim = options.hideFootnotesWhenMoreThan || 0;

            for (var i = 0; i < options.footnotes.length; i++) {
                tfoottd.appendChild(element({ tagname: 'div', content: resolveContent(options.footnotes[i], true), classname: 'table-footnote', attributes: [{ name: 'style', value: (options.footnotes.length > lim) ? 'display:none;' : ''}] }));
            }

            // Control for show and hide of footnotes
            if (options.footnotes.length > lim) {
                tfoottd.appendChild(alink({ label: 'Show table notes...', classname: 'table-footnote-readmore', onclick: function () {
                    for (var i = 0; i < tfoottd.children.length; i++) {
                        var child = tfoottd.children[i];
                        if (child.className === 'table-footnote') {
                            if (child.style.display == 'none') {
                                this.innerHTML = 'Hide table notes';
                                child.style.display = 'block';
                            }
                            else {
                                this.innerHTML = 'Show table notes...';
                                child.style.display = 'none';
                            }
                        }
                    }

                    return false;
                }
                }));
            }
        }

        if (options.contact) {
            var contactdiv = element({ tagname: 'div', content: [], classname: 'table-contact' });

            if (options.contact.telephone) contactdiv.appendChild(element({ tagname: 'div', content: ['Telephone: ', resolveContent(options.contact.telephone)], classname: 'table-contact-telephone' }));
            if (options.contact.email) contactdiv.appendChild(element({ tagname: 'div', content: ['Email: ', alink({ href: 'mailto:' + options.contact.email, label: options.contact.email })], classname: 'table-contact-email' }));
            if (options.contact.web) contactdiv.appendChild(element({ tagname: 'div', content: ['Web: ', alink({ href: options.contact.web, label: options.contact.web })], classname: 'table-contact-web' }));
            tfoottd.appendChild(contactdiv);
        }

        tbl.appendChild(thead);
        tbl.appendChild(tbody);
        tbl.appendChild(tfoot);

        return tbl;
    }

    function listitem(options) {
        var li = document.createElement('li');

        if (options.content) li.appendChild(options.content);

        assignevents(options, li);
        assignattr(options, li);

        return li;
    }

    function createlist(tagname, options) {
        var l = document.createElement(tagname);

        if (options.list) {
            wraplist(l, options.list, function (entry) {
                return listitem(entry);
            });
        }

        assignevents(options, l);
        assignattr(options, l);

        return l;
    }

    function orderedlist(options) {
        return createlist('ol', options);
    }

    function unorderedlist(options) {
        return createlist('ul', options);
    }

    function listadd(container, entry) {
        container.appendChild(entry);
    }

    return {
        getQueryString: getqs,      	// Get the query string for a parameter
        alink: alink, 					// Hyperlink.
        checkbox: chk, 					// Checkbox input.
        radio: rad, 					// Radio button input.
        inputtext: text, 				// Text input field.
        inputsearch: search, 			// Search input field.
        button: btn, 					// Normal button.
        togglebutton: togglebtn, 		// Button that toggles/cycles between states.
        article: art, 					// Boxed out article
        breadcrumbs: crumbs, 			// Breadcrumbs for page navigation.
        reveal: reveal, 				// Control that has a button to horizontally expand and collapse controls.
        wraplist: wraplist, 			// Wrap an array of items in an element.
        select: select, 				// Input select box.
        tree: tree, 					// Expanding tree of content.
        table: table, 				    // Table of data
        unorderedlist: unorderedlist,   // Unordered list (ul)
        orderedlist: orderedlist, 	    // Ordered list (ol)
        listitem: listitem, 			// Create a list item for go inside an orderedlist or unorderedlist.
        listadd: listadd, 			    // Add an item to an orderedlist or unorderedlist.
        element: element,    			// Create a document element, specify 'tagname' in options.
        util: {
            isArray: isArray,
            isFunction: isFunction,
            textism: textism,
            addCssClass: addCssClass,
            removeCssClass: removeCssClass,
            forEachProperty: forEachProperty
        }
    };
} ();