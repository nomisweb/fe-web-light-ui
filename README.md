Light Web UI
============
This project contains a lightweight (small download, no dependencies) set of styles and
convenience functions to generate DOM elements such as links, tables, checkboxes and others.

How to use
----------
Include a reference to `css/ui.css` and `js/ui.js` in your page.

A local variable `nomisUI` is created through which access to the methods is provided.

Please see the `example.htm` for a demonstration.

Summary of methods
------------------

`getQueryString(name)` returns the query string value from the current URL for the argument `name`

`alink` returns a hyperlink

`checkbox` returns a checkbox input

`radio` returns a radio button input

`inputtext` returns a text input field

`inputsearch` returns a search input field

`button` returns a normal button

`togglebutton` returns a button that toggles/cycles between states

`article` returns a boxed out article

`breadcrumb(crumbs)` returns breadcrumbs for page navigation
   - `crumbs` array of objects with `href` and `title` properties.

`reveal` returns a control that has a button to horizontally expand and collaps controls

`wraplist` returns an element that wraps an array of items

`select` returns an select box input

`tree` returns an expanding tree of content

`table` returns a table of data

`unorderedlist` returns an unordered list (ul)

`orderedlist` returns an ordered list (ol)

`listitem` returns a list item to go inside an orderedlist or unorderedlist

`listadd` Adds an item to an orderedlist or unorderedlist

`element` returns a DOM element with a specific `tagname` from options.

`util` Provides a series of convenient utility functions:
   - `isArray` test if object is an array
   - `isFunction` test if object is a function
   - `textism` convert markdown style content to HTML
   - `addCssClass` add a CSS class to a DOM element
   - `removeCssClass` remove a CSS class from a DOM element
   - `forEachProperty` iterate over the properties of an object

Dependencies
------------
None.