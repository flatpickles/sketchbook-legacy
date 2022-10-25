
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                else
                    this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var canvasSketch_umd = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
    	module.exports = factory() ;
    }(commonjsGlobal, (function () {

    	/*
    	object-assign
    	(c) Sindre Sorhus
    	@license MIT
    	*/
    	/* eslint-disable no-unused-vars */
    	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    	var hasOwnProperty = Object.prototype.hasOwnProperty;
    	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

    	function toObject(val) {
    		if (val === null || val === undefined) {
    			throw new TypeError('Object.assign cannot be called with null or undefined');
    		}

    		return Object(val);
    	}

    	function shouldUseNative() {
    		try {
    			if (!Object.assign) {
    				return false;
    			}

    			// Detect buggy property enumeration order in older V8 versions.

    			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
    			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
    			test1[5] = 'de';
    			if (Object.getOwnPropertyNames(test1)[0] === '5') {
    				return false;
    			}

    			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
    			var test2 = {};
    			for (var i = 0; i < 10; i++) {
    				test2['_' + String.fromCharCode(i)] = i;
    			}
    			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
    				return test2[n];
    			});
    			if (order2.join('') !== '0123456789') {
    				return false;
    			}

    			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
    			var test3 = {};
    			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
    				test3[letter] = letter;
    			});
    			if (Object.keys(Object.assign({}, test3)).join('') !==
    					'abcdefghijklmnopqrst') {
    				return false;
    			}

    			return true;
    		} catch (err) {
    			// We don't expect any of the above to throw, but better to be safe.
    			return false;
    		}
    	}

    	var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
    		var from;
    		var to = toObject(target);
    		var symbols;

    		for (var s = 1; s < arguments.length; s++) {
    			from = Object(arguments[s]);

    			for (var key in from) {
    				if (hasOwnProperty.call(from, key)) {
    					to[key] = from[key];
    				}
    			}

    			if (getOwnPropertySymbols) {
    				symbols = getOwnPropertySymbols(from);
    				for (var i = 0; i < symbols.length; i++) {
    					if (propIsEnumerable.call(from, symbols[i])) {
    						to[symbols[i]] = from[symbols[i]];
    					}
    				}
    			}
    		}

    		return to;
    	};

    	var commonjsGlobal$1 = typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};

    	function createCommonjsModule(fn, module) {
    		return module = { exports: {} }, fn(module, module.exports), module.exports;
    	}

    	var browser =
    	  commonjsGlobal$1.performance &&
    	  commonjsGlobal$1.performance.now ? function now() {
    	    return performance.now()
    	  } : Date.now || function now() {
    	    return +new Date
    	  };

    	var isPromise_1 = isPromise;

    	function isPromise(obj) {
    	  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
    	}

    	var isDom = isNode;

    	function isNode (val) {
    	  return (!val || typeof val !== 'object')
    	    ? false
    	    : (typeof window === 'object' && typeof window.Node === 'object')
    	      ? (val instanceof window.Node)
    	      : (typeof val.nodeType === 'number') &&
    	        (typeof val.nodeName === 'string')
    	}

    	function getClientAPI() {
    	    return typeof window !== 'undefined' && window['canvas-sketch-cli'];
    	}

    	function defined() {
    	    var arguments$1 = arguments;

    	    for (var i = 0;i < arguments.length; i++) {
    	        if (arguments$1[i] != null) {
    	            return arguments$1[i];
    	        }
    	    }
    	    return undefined;
    	}

    	function isBrowser() {
    	    return typeof document !== 'undefined';
    	}

    	function isWebGLContext(ctx) {
    	    return typeof ctx.clear === 'function' && typeof ctx.clearColor === 'function' && typeof ctx.bufferData === 'function';
    	}

    	function isCanvas(element) {
    	    return isDom(element) && /canvas/i.test(element.nodeName) && typeof element.getContext === 'function';
    	}

    	var keys = createCommonjsModule(function (module, exports) {
    	exports = module.exports = typeof Object.keys === 'function'
    	  ? Object.keys : shim;

    	exports.shim = shim;
    	function shim (obj) {
    	  var keys = [];
    	  for (var key in obj) keys.push(key);
    	  return keys;
    	}
    	});
    	keys.shim;

    	var is_arguments = createCommonjsModule(function (module, exports) {
    	var supportsArgumentsClass = (function(){
    	  return Object.prototype.toString.call(arguments)
    	})() == '[object Arguments]';

    	exports = module.exports = supportsArgumentsClass ? supported : unsupported;

    	exports.supported = supported;
    	function supported(object) {
    	  return Object.prototype.toString.call(object) == '[object Arguments]';
    	}
    	exports.unsupported = unsupported;
    	function unsupported(object){
    	  return object &&
    	    typeof object == 'object' &&
    	    typeof object.length == 'number' &&
    	    Object.prototype.hasOwnProperty.call(object, 'callee') &&
    	    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
    	    false;
    	}});
    	is_arguments.supported;
    	is_arguments.unsupported;

    	var deepEqual_1 = createCommonjsModule(function (module) {
    	var pSlice = Array.prototype.slice;



    	var deepEqual = module.exports = function (actual, expected, opts) {
    	  if (!opts) opts = {};
    	  // 7.1. All identical values are equivalent, as determined by ===.
    	  if (actual === expected) {
    	    return true;

    	  } else if (actual instanceof Date && expected instanceof Date) {
    	    return actual.getTime() === expected.getTime();

    	  // 7.3. Other pairs that do not both pass typeof value == 'object',
    	  // equivalence is determined by ==.
    	  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
    	    return opts.strict ? actual === expected : actual == expected;

    	  // 7.4. For all other Object pairs, including Array objects, equivalence is
    	  // determined by having the same number of owned properties (as verified
    	  // with Object.prototype.hasOwnProperty.call), the same set of keys
    	  // (although not necessarily the same order), equivalent values for every
    	  // corresponding key, and an identical 'prototype' property. Note: this
    	  // accounts for both named and indexed properties on Arrays.
    	  } else {
    	    return objEquiv(actual, expected, opts);
    	  }
    	};

    	function isUndefinedOrNull(value) {
    	  return value === null || value === undefined;
    	}

    	function isBuffer (x) {
    	  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
    	  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    	    return false;
    	  }
    	  if (x.length > 0 && typeof x[0] !== 'number') return false;
    	  return true;
    	}

    	function objEquiv(a, b, opts) {
    	  var i, key;
    	  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    	    return false;
    	  // an identical 'prototype' property.
    	  if (a.prototype !== b.prototype) return false;
    	  //~~~I've managed to break Object.keys through screwy arguments passing.
    	  //   Converting to array solves the problem.
    	  if (is_arguments(a)) {
    	    if (!is_arguments(b)) {
    	      return false;
    	    }
    	    a = pSlice.call(a);
    	    b = pSlice.call(b);
    	    return deepEqual(a, b, opts);
    	  }
    	  if (isBuffer(a)) {
    	    if (!isBuffer(b)) {
    	      return false;
    	    }
    	    if (a.length !== b.length) return false;
    	    for (i = 0; i < a.length; i++) {
    	      if (a[i] !== b[i]) return false;
    	    }
    	    return true;
    	  }
    	  try {
    	    var ka = keys(a),
    	        kb = keys(b);
    	  } catch (e) {//happens when one is a string literal and the other isn't
    	    return false;
    	  }
    	  // having the same number of owned properties (keys incorporates
    	  // hasOwnProperty)
    	  if (ka.length != kb.length)
    	    return false;
    	  //the same set of keys (although not necessarily the same order),
    	  ka.sort();
    	  kb.sort();
    	  //~~~cheap key test
    	  for (i = ka.length - 1; i >= 0; i--) {
    	    if (ka[i] != kb[i])
    	      return false;
    	  }
    	  //equivalent values for every corresponding key, and
    	  //~~~possibly expensive deep test
    	  for (i = ka.length - 1; i >= 0; i--) {
    	    key = ka[i];
    	    if (!deepEqual(a[key], b[key], opts)) return false;
    	  }
    	  return typeof a === typeof b;
    	}
    	});

    	var dateformat = createCommonjsModule(function (module, exports) {
    	/*
    	 * Date Format 1.2.3
    	 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
    	 * MIT license
    	 *
    	 * Includes enhancements by Scott Trenda <scott.trenda.net>
    	 * and Kris Kowal <cixar.com/~kris.kowal/>
    	 *
    	 * Accepts a date, a mask, or a date and a mask.
    	 * Returns a formatted version of the given date.
    	 * The date defaults to the current date/time.
    	 * The mask defaults to dateFormat.masks.default.
    	 */

    	(function(global) {

    	  var dateFormat = (function() {
    	      var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|"[^"]*"|'[^']*'/g;
    	      var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
    	      var timezoneClip = /[^-+\dA-Z]/g;
    	  
    	      // Regexes and supporting functions are cached through closure
    	      return function (date, mask, utc, gmt) {
    	  
    	        // You can't provide utc if you skip other args (use the 'UTC:' mask prefix)
    	        if (arguments.length === 1 && kindOf(date) === 'string' && !/\d/.test(date)) {
    	          mask = date;
    	          date = undefined;
    	        }
    	  
    	        date = date || new Date;
    	  
    	        if(!(date instanceof Date)) {
    	          date = new Date(date);
    	        }
    	  
    	        if (isNaN(date)) {
    	          throw TypeError('Invalid date');
    	        }
    	  
    	        mask = String(dateFormat.masks[mask] || mask || dateFormat.masks['default']);
    	  
    	        // Allow setting the utc/gmt argument via the mask
    	        var maskSlice = mask.slice(0, 4);
    	        if (maskSlice === 'UTC:' || maskSlice === 'GMT:') {
    	          mask = mask.slice(4);
    	          utc = true;
    	          if (maskSlice === 'GMT:') {
    	            gmt = true;
    	          }
    	        }
    	  
    	        var _ = utc ? 'getUTC' : 'get';
    	        var d = date[_ + 'Date']();
    	        var D = date[_ + 'Day']();
    	        var m = date[_ + 'Month']();
    	        var y = date[_ + 'FullYear']();
    	        var H = date[_ + 'Hours']();
    	        var M = date[_ + 'Minutes']();
    	        var s = date[_ + 'Seconds']();
    	        var L = date[_ + 'Milliseconds']();
    	        var o = utc ? 0 : date.getTimezoneOffset();
    	        var W = getWeek(date);
    	        var N = getDayOfWeek(date);
    	        var flags = {
    	          d:    d,
    	          dd:   pad(d),
    	          ddd:  dateFormat.i18n.dayNames[D],
    	          dddd: dateFormat.i18n.dayNames[D + 7],
    	          m:    m + 1,
    	          mm:   pad(m + 1),
    	          mmm:  dateFormat.i18n.monthNames[m],
    	          mmmm: dateFormat.i18n.monthNames[m + 12],
    	          yy:   String(y).slice(2),
    	          yyyy: y,
    	          h:    H % 12 || 12,
    	          hh:   pad(H % 12 || 12),
    	          H:    H,
    	          HH:   pad(H),
    	          M:    M,
    	          MM:   pad(M),
    	          s:    s,
    	          ss:   pad(s),
    	          l:    pad(L, 3),
    	          L:    pad(Math.round(L / 10)),
    	          t:    H < 12 ? dateFormat.i18n.timeNames[0] : dateFormat.i18n.timeNames[1],
    	          tt:   H < 12 ? dateFormat.i18n.timeNames[2] : dateFormat.i18n.timeNames[3],
    	          T:    H < 12 ? dateFormat.i18n.timeNames[4] : dateFormat.i18n.timeNames[5],
    	          TT:   H < 12 ? dateFormat.i18n.timeNames[6] : dateFormat.i18n.timeNames[7],
    	          Z:    gmt ? 'GMT' : utc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, ''),
    	          o:    (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
    	          S:    ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10],
    	          W:    W,
    	          N:    N
    	        };
    	  
    	        return mask.replace(token, function (match) {
    	          if (match in flags) {
    	            return flags[match];
    	          }
    	          return match.slice(1, match.length - 1);
    	        });
    	      };
    	    })();

    	  dateFormat.masks = {
    	    'default':               'ddd mmm dd yyyy HH:MM:ss',
    	    'shortDate':             'm/d/yy',
    	    'mediumDate':            'mmm d, yyyy',
    	    'longDate':              'mmmm d, yyyy',
    	    'fullDate':              'dddd, mmmm d, yyyy',
    	    'shortTime':             'h:MM TT',
    	    'mediumTime':            'h:MM:ss TT',
    	    'longTime':              'h:MM:ss TT Z',
    	    'isoDate':               'yyyy-mm-dd',
    	    'isoTime':               'HH:MM:ss',
    	    'isoDateTime':           'yyyy-mm-dd\'T\'HH:MM:sso',
    	    'isoUtcDateTime':        'UTC:yyyy-mm-dd\'T\'HH:MM:ss\'Z\'',
    	    'expiresHeaderFormat':   'ddd, dd mmm yyyy HH:MM:ss Z'
    	  };

    	  // Internationalization strings
    	  dateFormat.i18n = {
    	    dayNames: [
    	      'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
    	      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    	    ],
    	    monthNames: [
    	      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    	      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    	    ],
    	    timeNames: [
    	      'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
    	    ]
    	  };

    	function pad(val, len) {
    	  val = String(val);
    	  len = len || 2;
    	  while (val.length < len) {
    	    val = '0' + val;
    	  }
    	  return val;
    	}

    	/**
    	 * Get the ISO 8601 week number
    	 * Based on comments from
    	 * http://techblog.procurios.nl/k/n618/news/view/33796/14863/Calculate-ISO-8601-week-and-year-in-javascript.html
    	 *
    	 * @param  {Object} `date`
    	 * @return {Number}
    	 */
    	function getWeek(date) {
    	  // Remove time components of date
    	  var targetThursday = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    	  // Change date to Thursday same week
    	  targetThursday.setDate(targetThursday.getDate() - ((targetThursday.getDay() + 6) % 7) + 3);

    	  // Take January 4th as it is always in week 1 (see ISO 8601)
    	  var firstThursday = new Date(targetThursday.getFullYear(), 0, 4);

    	  // Change date to Thursday same week
    	  firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3);

    	  // Check if daylight-saving-time-switch occurred and correct for it
    	  var ds = targetThursday.getTimezoneOffset() - firstThursday.getTimezoneOffset();
    	  targetThursday.setHours(targetThursday.getHours() - ds);

    	  // Number of weeks between target Thursday and first Thursday
    	  var weekDiff = (targetThursday - firstThursday) / (86400000*7);
    	  return 1 + Math.floor(weekDiff);
    	}

    	/**
    	 * Get ISO-8601 numeric representation of the day of the week
    	 * 1 (for Monday) through 7 (for Sunday)
    	 * 
    	 * @param  {Object} `date`
    	 * @return {Number}
    	 */
    	function getDayOfWeek(date) {
    	  var dow = date.getDay();
    	  if(dow === 0) {
    	    dow = 7;
    	  }
    	  return dow;
    	}

    	/**
    	 * kind-of shortcut
    	 * @param  {*} val
    	 * @return {String}
    	 */
    	function kindOf(val) {
    	  if (val === null) {
    	    return 'null';
    	  }

    	  if (val === undefined) {
    	    return 'undefined';
    	  }

    	  if (typeof val !== 'object') {
    	    return typeof val;
    	  }

    	  if (Array.isArray(val)) {
    	    return 'array';
    	  }

    	  return {}.toString.call(val)
    	    .slice(8, -1).toLowerCase();
    	}


    	  {
    	    module.exports = dateFormat;
    	  }
    	})();
    	});

    	/*!
    	 * repeat-string <https://github.com/jonschlinkert/repeat-string>
    	 *
    	 * Copyright (c) 2014-2015, Jon Schlinkert.
    	 * Licensed under the MIT License.
    	 */

    	/**
    	 * Results cache
    	 */

    	var res = '';
    	var cache;

    	/**
    	 * Expose `repeat`
    	 */

    	var repeatString = repeat;

    	/**
    	 * Repeat the given `string` the specified `number`
    	 * of times.
    	 *
    	 * **Example:**
    	 *
    	 * ```js
    	 * var repeat = require('repeat-string');
    	 * repeat('A', 5);
    	 * //=> AAAAA
    	 * ```
    	 *
    	 * @param {String} `string` The string to repeat
    	 * @param {Number} `number` The number of times to repeat the string
    	 * @return {String} Repeated string
    	 * @api public
    	 */

    	function repeat(str, num) {
    	  if (typeof str !== 'string') {
    	    throw new TypeError('expected a string');
    	  }

    	  // cover common, quick use cases
    	  if (num === 1) return str;
    	  if (num === 2) return str + str;

    	  var max = str.length * num;
    	  if (cache !== str || typeof cache === 'undefined') {
    	    cache = str;
    	    res = '';
    	  } else if (res.length >= max) {
    	    return res.substr(0, max);
    	  }

    	  while (max > res.length && num > 1) {
    	    if (num & 1) {
    	      res += str;
    	    }

    	    num >>= 1;
    	    str += str;
    	  }

    	  res += str;
    	  res = res.substr(0, max);
    	  return res;
    	}

    	var padLeft = function padLeft(str, num, ch) {
    	  str = str.toString();

    	  if (typeof num === 'undefined') {
    	    return str;
    	  }

    	  if (ch === 0) {
    	    ch = '0';
    	  } else if (ch) {
    	    ch = ch.toString();
    	  } else {
    	    ch = ' ';
    	  }

    	  return repeatString(ch, num - str.length) + str;
    	};

    	var noop = function () {};
    	var link;
    	var defaultExts = {
    	    extension: '',
    	    prefix: '',
    	    suffix: ''
    	};
    	var supportedEncodings = ['image/png','image/jpeg','image/webp'];
    	function stream(isStart, opts) {
    	    if ( opts === void 0 ) opts = {};

    	    return new Promise(function (resolve, reject) {
    	        opts = objectAssign({}, defaultExts, opts);
    	        var filename = resolveFilename(Object.assign({}, opts, {
    	            extension: '',
    	            frame: undefined
    	        }));
    	        var func = isStart ? 'streamStart' : 'streamEnd';
    	        var client = getClientAPI();
    	        if (client && client.output && typeof client[func] === 'function') {
    	            return client[func](objectAssign({}, opts, {
    	                filename: filename
    	            })).then(function (ev) { return resolve(ev); });
    	        } else {
    	            return resolve({
    	                filename: filename,
    	                client: false
    	            });
    	        }
    	    });
    	}

    	function streamStart(opts) {
    	    if ( opts === void 0 ) opts = {};

    	    return stream(true, opts);
    	}

    	function streamEnd(opts) {
    	    if ( opts === void 0 ) opts = {};

    	    return stream(false, opts);
    	}

    	function exportCanvas(canvas, opt) {
    	    if ( opt === void 0 ) opt = {};

    	    var encoding = opt.encoding || 'image/png';
    	    if (!supportedEncodings.includes(encoding)) 
    	        { throw new Error(("Invalid canvas encoding " + encoding)); }
    	    var extension = (encoding.split('/')[1] || '').replace(/jpeg/i, 'jpg');
    	    if (extension) 
    	        { extension = ("." + extension).toLowerCase(); }
    	    return {
    	        extension: extension,
    	        type: encoding,
    	        dataURL: canvas.toDataURL(encoding, opt.encodingQuality)
    	    };
    	}

    	function createBlobFromDataURL(dataURL) {
    	    return new Promise(function (resolve) {
    	        var splitIndex = dataURL.indexOf(',');
    	        if (splitIndex === -1) {
    	            resolve(new window.Blob());
    	            return;
    	        }
    	        var base64 = dataURL.slice(splitIndex + 1);
    	        var byteString = window.atob(base64);
    	        var type = dataURL.slice(0, splitIndex);
    	        var mimeMatch = /data:([^;]+)/.exec(type);
    	        var mime = (mimeMatch ? mimeMatch[1] : '') || undefined;
    	        var ab = new ArrayBuffer(byteString.length);
    	        var ia = new Uint8Array(ab);
    	        for (var i = 0;i < byteString.length; i++) {
    	            ia[i] = byteString.charCodeAt(i);
    	        }
    	        resolve(new window.Blob([ab], {
    	            type: mime
    	        }));
    	    });
    	}

    	function saveDataURL(dataURL, opts) {
    	    if ( opts === void 0 ) opts = {};

    	    return createBlobFromDataURL(dataURL).then(function (blob) { return saveBlob(blob, opts); });
    	}

    	function saveBlob(blob, opts) {
    	    if ( opts === void 0 ) opts = {};

    	    return new Promise(function (resolve) {
    	        opts = objectAssign({}, defaultExts, opts);
    	        var filename = opts.filename;
    	        var client = getClientAPI();
    	        if (client && typeof client.saveBlob === 'function' && client.output) {
    	            return client.saveBlob(blob, objectAssign({}, opts, {
    	                filename: filename
    	            })).then(function (ev) { return resolve(ev); });
    	        } else {
    	            if (!link) {
    	                link = document.createElement('a');
    	                link.style.visibility = 'hidden';
    	                link.target = '_blank';
    	            }
    	            link.download = filename;
    	            link.href = window.URL.createObjectURL(blob);
    	            document.body.appendChild(link);
    	            link.onclick = (function () {
    	                link.onclick = noop;
    	                setTimeout(function () {
    	                    window.URL.revokeObjectURL(blob);
    	                    if (link.parentElement) 
    	                        { link.parentElement.removeChild(link); }
    	                    link.removeAttribute('href');
    	                    resolve({
    	                        filename: filename,
    	                        client: false
    	                    });
    	                });
    	            });
    	            link.click();
    	        }
    	    });
    	}

    	function saveFile(data, opts) {
    	    if ( opts === void 0 ) opts = {};

    	    var parts = Array.isArray(data) ? data : [data];
    	    var blob = new window.Blob(parts, {
    	        type: opts.type || ''
    	    });
    	    return saveBlob(blob, opts);
    	}

    	function getTimeStamp() {
    	    var dateFormatStr = "yyyy.mm.dd-HH.MM.ss";
    	    return dateformat(new Date(), dateFormatStr);
    	}

    	function resolveFilename(opt) {
    	    if ( opt === void 0 ) opt = {};

    	    opt = objectAssign({}, opt);
    	    if (typeof opt.file === 'function') {
    	        return opt.file(opt);
    	    } else if (opt.file) {
    	        return opt.file;
    	    }
    	    var frame = null;
    	    var extension = '';
    	    if (typeof opt.extension === 'string') 
    	        { extension = opt.extension; }
    	    if (typeof opt.frame === 'number') {
    	        var totalFrames;
    	        if (typeof opt.totalFrames === 'number') {
    	            totalFrames = opt.totalFrames;
    	        } else {
    	            totalFrames = Math.max(10000, opt.frame);
    	        }
    	        frame = padLeft(String(opt.frame), String(totalFrames).length, '0');
    	    }
    	    var layerStr = isFinite(opt.totalLayers) && isFinite(opt.layer) && opt.totalLayers > 1 ? ("" + (opt.layer)) : '';
    	    if (frame != null) {
    	        return [layerStr,frame].filter(Boolean).join('-') + extension;
    	    } else {
    	        var defaultFileName = opt.timeStamp;
    	        return [opt.prefix,opt.name || defaultFileName,layerStr,opt.hash,opt.suffix].filter(Boolean).join('-') + extension;
    	    }
    	}

    	var commonTypos = {
    	    dimension: 'dimensions',
    	    animated: 'animate',
    	    animating: 'animate',
    	    unit: 'units',
    	    P5: 'p5',
    	    pixellated: 'pixelated',
    	    looping: 'loop',
    	    pixelPerInch: 'pixels'
    	};
    	var allKeys = ['dimensions','units','pixelsPerInch','orientation','scaleToFit',
    	    'scaleToView','bleed','pixelRatio','exportPixelRatio','maxPixelRatio','scaleContext',
    	    'resizeCanvas','styleCanvas','canvas','context','attributes','parent','file',
    	    'name','prefix','suffix','animate','playing','loop','duration','totalFrames',
    	    'fps','playbackRate','timeScale','frame','time','flush','pixelated','hotkeys',
    	    'p5','id','scaleToFitPadding','data','params','encoding','encodingQuality'];
    	var checkSettings = function (settings) {
    	    var keys = Object.keys(settings);
    	    keys.forEach(function (key) {
    	        if (key in commonTypos) {
    	            var actual = commonTypos[key];
    	            console.warn(("[canvas-sketch] Could not recognize the setting \"" + key + "\", did you mean \"" + actual + "\"?"));
    	        } else if (!allKeys.includes(key)) {
    	            console.warn(("[canvas-sketch] Could not recognize the setting \"" + key + "\""));
    	        }
    	    });
    	};

    	function keyboardShortcuts (opt) {
    	    if ( opt === void 0 ) opt = {};

    	    var handler = function (ev) {
    	        if (!opt.enabled()) 
    	            { return; }
    	        var client = getClientAPI();
    	        if (ev.keyCode === 83 && !ev.altKey && (ev.metaKey || ev.ctrlKey)) {
    	            ev.preventDefault();
    	            opt.save(ev);
    	        } else if (ev.keyCode === 32) {
    	            opt.togglePlay(ev);
    	        } else if (client && !ev.altKey && ev.keyCode === 75 && (ev.metaKey || ev.ctrlKey)) {
    	            ev.preventDefault();
    	            opt.commit(ev);
    	        }
    	    };
    	    var attach = function () {
    	        window.addEventListener('keydown', handler);
    	    };
    	    var detach = function () {
    	        window.removeEventListener('keydown', handler);
    	    };
    	    return {
    	        attach: attach,
    	        detach: detach
    	    };
    	}

    	var defaultUnits = 'mm';
    	var data = [['postcard',101.6,152.4],['poster-small',280,430],['poster',460,610],
    	    ['poster-large',610,910],['business-card',50.8,88.9],['2r',64,89],['3r',89,127],
    	    ['4r',102,152],['5r',127,178],['6r',152,203],['8r',203,254],['10r',254,305],['11r',
    	    279,356],['12r',305,381],['a0',841,1189],['a1',594,841],['a2',420,594],['a3',
    	    297,420],['a4',210,297],['a5',148,210],['a6',105,148],['a7',74,105],['a8',52,
    	    74],['a9',37,52],['a10',26,37],['2a0',1189,1682],['4a0',1682,2378],['b0',1000,
    	    1414],['b1',707,1000],['b1+',720,1020],['b2',500,707],['b2+',520,720],['b3',353,
    	    500],['b4',250,353],['b5',176,250],['b6',125,176],['b7',88,125],['b8',62,88],
    	    ['b9',44,62],['b10',31,44],['b11',22,32],['b12',16,22],['c0',917,1297],['c1',
    	    648,917],['c2',458,648],['c3',324,458],['c4',229,324],['c5',162,229],['c6',114,
    	    162],['c7',81,114],['c8',57,81],['c9',40,57],['c10',28,40],['c11',22,32],['c12',
    	    16,22],['half-letter',5.5,8.5,'in'],['letter',8.5,11,'in'],['legal',8.5,14,'in'],
    	    ['junior-legal',5,8,'in'],['ledger',11,17,'in'],['tabloid',11,17,'in'],['ansi-a',
    	    8.5,11.0,'in'],['ansi-b',11.0,17.0,'in'],['ansi-c',17.0,22.0,'in'],['ansi-d',
    	    22.0,34.0,'in'],['ansi-e',34.0,44.0,'in'],['arch-a',9,12,'in'],['arch-b',12,18,
    	    'in'],['arch-c',18,24,'in'],['arch-d',24,36,'in'],['arch-e',36,48,'in'],['arch-e1',
    	    30,42,'in'],['arch-e2',26,38,'in'],['arch-e3',27,39,'in']];
    	var paperSizes = data.reduce(function (dict, preset) {
    	    var item = {
    	        units: preset[3] || defaultUnits,
    	        dimensions: [preset[1],preset[2]]
    	    };
    	    dict[preset[0]] = item;
    	    dict[preset[0].replace(/-/g, ' ')] = item;
    	    return dict;
    	}, {});

    	var defined$1 = function () {
    	    for (var i = 0; i < arguments.length; i++) {
    	        if (arguments[i] !== undefined) return arguments[i];
    	    }
    	};

    	var units = [ 'mm', 'cm', 'm', 'pc', 'pt', 'in', 'ft', 'px' ];

    	var conversions = {
    	  // metric
    	  m: {
    	    system: 'metric',
    	    factor: 1
    	  },
    	  cm: {
    	    system: 'metric',
    	    factor: 1 / 100
    	  },
    	  mm: {
    	    system: 'metric',
    	    factor: 1 / 1000
    	  },
    	  // imperial
    	  pt: {
    	    system: 'imperial',
    	    factor: 1 / 72
    	  },
    	  pc: {
    	    system: 'imperial',
    	    factor: 1 / 6
    	  },
    	  in: {
    	    system: 'imperial',
    	    factor: 1
    	  },
    	  ft: {
    	    system: 'imperial',
    	    factor: 12
    	  }
    	};

    	const anchors = {
    	  metric: {
    	    unit: 'm',
    	    ratio: 1 / 0.0254
    	  },
    	  imperial: {
    	    unit: 'in',
    	    ratio: 0.0254
    	  }
    	};

    	function round (value, decimals) {
    	  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    	}

    	function convertDistance (value, fromUnit, toUnit, opts) {
    	  if (typeof value !== 'number' || !isFinite(value)) throw new Error('Value must be a finite number');
    	  if (!fromUnit || !toUnit) throw new Error('Must specify from and to units');

    	  opts = opts || {};
    	  var pixelsPerInch = defined$1(opts.pixelsPerInch, 96);
    	  var precision = opts.precision;
    	  var roundPixel = opts.roundPixel !== false;

    	  fromUnit = fromUnit.toLowerCase();
    	  toUnit = toUnit.toLowerCase();

    	  if (units.indexOf(fromUnit) === -1) throw new Error('Invalid from unit "' + fromUnit + '", must be one of: ' + units.join(', '));
    	  if (units.indexOf(toUnit) === -1) throw new Error('Invalid from unit "' + toUnit + '", must be one of: ' + units.join(', '));

    	  if (fromUnit === toUnit) {
    	    // We don't need to convert from A to B since they are the same already
    	    return value;
    	  }

    	  var toFactor = 1;
    	  var fromFactor = 1;
    	  var isToPixel = false;

    	  if (fromUnit === 'px') {
    	    fromFactor = 1 / pixelsPerInch;
    	    fromUnit = 'in';
    	  }
    	  if (toUnit === 'px') {
    	    isToPixel = true;
    	    toFactor = pixelsPerInch;
    	    toUnit = 'in';
    	  }

    	  var fromUnitData = conversions[fromUnit];
    	  var toUnitData = conversions[toUnit];

    	  // source to anchor inside source's system
    	  var anchor = value * fromUnitData.factor * fromFactor;

    	  // if systems differ, convert one to another
    	  if (fromUnitData.system !== toUnitData.system) {
    	    // regular 'm' to 'in' and so forth
    	    anchor *= anchors[fromUnitData.system].ratio;
    	  }

    	  var result = anchor / toUnitData.factor * toFactor;
    	  if (isToPixel && roundPixel) {
    	    result = Math.round(result);
    	  } else if (typeof precision === 'number' && isFinite(precision)) {
    	    result = round(result, precision);
    	  }
    	  return result;
    	}

    	var convertLength = convertDistance;
    	var units_1 = units;
    	convertLength.units = units_1;

    	function getDimensionsFromPreset(dimensions, unitsTo, pixelsPerInch) {
    	    if ( unitsTo === void 0 ) unitsTo = 'px';
    	    if ( pixelsPerInch === void 0 ) pixelsPerInch = 72;

    	    if (typeof dimensions === 'string') {
    	        var key = dimensions.toLowerCase();
    	        if (!(key in paperSizes)) {
    	            throw new Error(("The dimension preset \"" + dimensions + "\" is not supported or could not be found; try using a4, a3, postcard, letter, etc."));
    	        }
    	        var preset = paperSizes[key];
    	        return preset.dimensions.map(function (d) { return convertDistance$1(d, preset.units, unitsTo, pixelsPerInch); });
    	    } else {
    	        return dimensions;
    	    }
    	}

    	function convertDistance$1(dimension, unitsFrom, unitsTo, pixelsPerInch) {
    	    if ( unitsFrom === void 0 ) unitsFrom = 'px';
    	    if ( unitsTo === void 0 ) unitsTo = 'px';
    	    if ( pixelsPerInch === void 0 ) pixelsPerInch = 72;

    	    return convertLength(dimension, unitsFrom, unitsTo, {
    	        pixelsPerInch: pixelsPerInch,
    	        precision: 4,
    	        roundPixel: true
    	    });
    	}

    	function checkIfHasDimensions(settings) {
    	    if (!settings.dimensions) 
    	        { return false; }
    	    if (typeof settings.dimensions === 'string') 
    	        { return true; }
    	    if (Array.isArray(settings.dimensions) && settings.dimensions.length >= 2) 
    	        { return true; }
    	    return false;
    	}

    	function getParentSize(props, settings) {
    	    if (!isBrowser()) {
    	        return [300,150];
    	    }
    	    var element = settings.parent || window;
    	    if (element === window || element === document || element === document.body) {
    	        return [window.innerWidth,window.innerHeight];
    	    } else {
    	        var ref = element.getBoundingClientRect();
    	        var width = ref.width;
    	        var height = ref.height;
    	        return [width,height];
    	    }
    	}

    	function resizeCanvas(props, settings) {
    	    var width, height;
    	    var styleWidth, styleHeight;
    	    var canvasWidth, canvasHeight;
    	    var browser = isBrowser();
    	    var dimensions = settings.dimensions;
    	    var hasDimensions = checkIfHasDimensions(settings);
    	    var exporting = props.exporting;
    	    var scaleToFit = hasDimensions ? settings.scaleToFit !== false : false;
    	    var scaleToView = !exporting && hasDimensions ? settings.scaleToView : true;
    	    if (!browser) 
    	        { scaleToFit = (scaleToView = false); }
    	    var units = settings.units;
    	    var pixelsPerInch = typeof settings.pixelsPerInch === 'number' && isFinite(settings.pixelsPerInch) ? settings.pixelsPerInch : 72;
    	    var bleed = defined(settings.bleed, 0);
    	    var devicePixelRatio = browser ? window.devicePixelRatio : 1;
    	    var basePixelRatio = scaleToView ? devicePixelRatio : 1;
    	    var pixelRatio, exportPixelRatio;
    	    if (typeof settings.pixelRatio === 'number' && isFinite(settings.pixelRatio)) {
    	        pixelRatio = settings.pixelRatio;
    	        exportPixelRatio = defined(settings.exportPixelRatio, pixelRatio);
    	    } else {
    	        if (hasDimensions) {
    	            pixelRatio = basePixelRatio;
    	            exportPixelRatio = defined(settings.exportPixelRatio, 1);
    	        } else {
    	            pixelRatio = devicePixelRatio;
    	            exportPixelRatio = defined(settings.exportPixelRatio, pixelRatio);
    	        }
    	    }
    	    if (typeof settings.maxPixelRatio === 'number' && isFinite(settings.maxPixelRatio)) {
    	        pixelRatio = Math.min(settings.maxPixelRatio, pixelRatio);
    	    }
    	    if (exporting) {
    	        pixelRatio = exportPixelRatio;
    	    }
    	    var ref = getParentSize(props, settings);
    	    var parentWidth = ref[0];
    	    var parentHeight = ref[1];
    	    var trimWidth, trimHeight;
    	    if (hasDimensions) {
    	        var result = getDimensionsFromPreset(dimensions, units, pixelsPerInch);
    	        var highest = Math.max(result[0], result[1]);
    	        var lowest = Math.min(result[0], result[1]);
    	        if (settings.orientation) {
    	            var landscape = settings.orientation === 'landscape';
    	            width = landscape ? highest : lowest;
    	            height = landscape ? lowest : highest;
    	        } else {
    	            width = result[0];
    	            height = result[1];
    	        }
    	        trimWidth = width;
    	        trimHeight = height;
    	        width += bleed * 2;
    	        height += bleed * 2;
    	    } else {
    	        width = parentWidth;
    	        height = parentHeight;
    	        trimWidth = width;
    	        trimHeight = height;
    	    }
    	    var realWidth = width;
    	    var realHeight = height;
    	    if (hasDimensions && units) {
    	        realWidth = convertDistance$1(width, units, 'px', pixelsPerInch);
    	        realHeight = convertDistance$1(height, units, 'px', pixelsPerInch);
    	    }
    	    styleWidth = Math.round(realWidth);
    	    styleHeight = Math.round(realHeight);
    	    if (scaleToFit && !exporting && hasDimensions) {
    	        var aspect = width / height;
    	        var windowAspect = parentWidth / parentHeight;
    	        var scaleToFitPadding = defined(settings.scaleToFitPadding, 40);
    	        var maxWidth = Math.round(parentWidth - scaleToFitPadding * 2);
    	        var maxHeight = Math.round(parentHeight - scaleToFitPadding * 2);
    	        if (styleWidth > maxWidth || styleHeight > maxHeight) {
    	            if (windowAspect > aspect) {
    	                styleHeight = maxHeight;
    	                styleWidth = Math.round(styleHeight * aspect);
    	            } else {
    	                styleWidth = maxWidth;
    	                styleHeight = Math.round(styleWidth / aspect);
    	            }
    	        }
    	    }
    	    canvasWidth = scaleToView ? Math.round(pixelRatio * styleWidth) : Math.round(pixelRatio * realWidth);
    	    canvasHeight = scaleToView ? Math.round(pixelRatio * styleHeight) : Math.round(pixelRatio * realHeight);
    	    var viewportWidth = scaleToView ? Math.round(styleWidth) : Math.round(realWidth);
    	    var viewportHeight = scaleToView ? Math.round(styleHeight) : Math.round(realHeight);
    	    var scaleX = canvasWidth / width;
    	    var scaleY = canvasHeight / height;
    	    return {
    	        bleed: bleed,
    	        pixelRatio: pixelRatio,
    	        width: width,
    	        height: height,
    	        dimensions: [width,height],
    	        units: units || 'px',
    	        scaleX: scaleX,
    	        scaleY: scaleY,
    	        pixelsPerInch: pixelsPerInch,
    	        viewportWidth: viewportWidth,
    	        viewportHeight: viewportHeight,
    	        canvasWidth: canvasWidth,
    	        canvasHeight: canvasHeight,
    	        trimWidth: trimWidth,
    	        trimHeight: trimHeight,
    	        styleWidth: styleWidth,
    	        styleHeight: styleHeight
    	    };
    	}

    	var getCanvasContext_1 = getCanvasContext;
    	function getCanvasContext (type, opts) {
    	  if (typeof type !== 'string') {
    	    throw new TypeError('must specify type string')
    	  }

    	  opts = opts || {};

    	  if (typeof document === 'undefined' && !opts.canvas) {
    	    return null // check for Node
    	  }

    	  var canvas = opts.canvas || document.createElement('canvas');
    	  if (typeof opts.width === 'number') {
    	    canvas.width = opts.width;
    	  }
    	  if (typeof opts.height === 'number') {
    	    canvas.height = opts.height;
    	  }

    	  var attribs = opts;
    	  var gl;
    	  try {
    	    var names = [ type ];
    	    // prefix GL contexts
    	    if (type.indexOf('webgl') === 0) {
    	      names.push('experimental-' + type);
    	    }

    	    for (var i = 0; i < names.length; i++) {
    	      gl = canvas.getContext(names[i], attribs);
    	      if (gl) return gl
    	    }
    	  } catch (e) {
    	    gl = null;
    	  }
    	  return (gl || null) // ensure null on fail
    	}

    	function createCanvasElement() {
    	    if (!isBrowser()) {
    	        throw new Error('It appears you are runing from Node.js or a non-browser environment. Try passing in an existing { canvas } interface instead.');
    	    }
    	    return document.createElement('canvas');
    	}

    	function createCanvas(settings) {
    	    if ( settings === void 0 ) settings = {};

    	    var context, canvas;
    	    var ownsCanvas = false;
    	    if (settings.canvas !== false) {
    	        context = settings.context;
    	        if (!context || typeof context === 'string') {
    	            var newCanvas = settings.canvas;
    	            if (!newCanvas) {
    	                newCanvas = createCanvasElement();
    	                ownsCanvas = true;
    	            }
    	            var type = context || '2d';
    	            if (typeof newCanvas.getContext !== 'function') {
    	                throw new Error("The specified { canvas } element does not have a getContext() function, maybe it is not a <canvas> tag?");
    	            }
    	            context = getCanvasContext_1(type, objectAssign({}, settings.attributes, {
    	                canvas: newCanvas
    	            }));
    	            if (!context) {
    	                throw new Error(("Failed at canvas.getContext('" + type + "') - the browser may not support this context, or a different context may already be in use with this canvas."));
    	            }
    	        }
    	        canvas = context.canvas;
    	        if (settings.canvas && canvas !== settings.canvas) {
    	            throw new Error('The { canvas } and { context } settings must point to the same underlying canvas element');
    	        }
    	        if (settings.pixelated) {
    	            context.imageSmoothingEnabled = false;
    	            context.mozImageSmoothingEnabled = false;
    	            context.oImageSmoothingEnabled = false;
    	            context.webkitImageSmoothingEnabled = false;
    	            context.msImageSmoothingEnabled = false;
    	            canvas.style['image-rendering'] = 'pixelated';
    	        }
    	    }
    	    return {
    	        canvas: canvas,
    	        context: context,
    	        ownsCanvas: ownsCanvas
    	    };
    	}

    	var SketchManager = function SketchManager() {
    	    var this$1$1 = this;

    	    this._settings = {};
    	    this._props = {};
    	    this._sketch = undefined;
    	    this._raf = null;
    	    this._recordTimeout = null;
    	    this._lastRedrawResult = undefined;
    	    this._isP5Resizing = false;
    	    this._keyboardShortcuts = keyboardShortcuts({
    	        enabled: function () { return this$1$1.settings.hotkeys !== false; },
    	        save: function (ev) {
    	            if (ev.shiftKey) {
    	                if (this$1$1.props.recording) {
    	                    this$1$1.endRecord();
    	                    this$1$1.run();
    	                } else 
    	                    { this$1$1.record(); }
    	            } else if (!this$1$1.props.recording) {
    	                this$1$1.exportFrame();
    	            }
    	        },
    	        togglePlay: function () {
    	            if (this$1$1.props.playing) 
    	                { this$1$1.pause(); }
    	             else 
    	                { this$1$1.play(); }
    	        },
    	        commit: function (ev) {
    	            this$1$1.exportFrame({
    	                commit: true
    	            });
    	        }
    	    });
    	    this._animateHandler = (function () { return this$1$1.animate(); });
    	    this._resizeHandler = (function () {
    	        var changed = this$1$1.resize();
    	        if (changed) {
    	            this$1$1.render();
    	        }
    	    });
    	};

    	var prototypeAccessors = { sketch: { configurable: true },settings: { configurable: true },props: { configurable: true } };
    	prototypeAccessors.sketch.get = function () {
    	    return this._sketch;
    	};
    	prototypeAccessors.settings.get = function () {
    	    return this._settings;
    	};
    	prototypeAccessors.props.get = function () {
    	    return this._props;
    	};
    	SketchManager.prototype._computePlayhead = function _computePlayhead (currentTime, duration) {
    	    var hasDuration = typeof duration === 'number' && isFinite(duration);
    	    return hasDuration ? currentTime / duration : 0;
    	};
    	SketchManager.prototype._computeFrame = function _computeFrame (playhead, time, totalFrames, fps) {
    	    return isFinite(totalFrames) && totalFrames > 1 ? Math.floor(playhead * (totalFrames - 1)) : Math.floor(fps * time);
    	};
    	SketchManager.prototype._computeCurrentFrame = function _computeCurrentFrame () {
    	    return this._computeFrame(this.props.playhead, this.props.time, this.props.totalFrames, this.props.fps);
    	};
    	SketchManager.prototype._getSizeProps = function _getSizeProps () {
    	    var props = this.props;
    	    return {
    	        width: props.width,
    	        height: props.height,
    	        pixelRatio: props.pixelRatio,
    	        canvasWidth: props.canvasWidth,
    	        canvasHeight: props.canvasHeight,
    	        viewportWidth: props.viewportWidth,
    	        viewportHeight: props.viewportHeight
    	    };
    	};
    	SketchManager.prototype.run = function run () {
    	    if (!this.sketch) 
    	        { throw new Error('should wait until sketch is loaded before trying to play()'); }
    	    if (this.settings.playing !== false) {
    	        this.play();
    	    }
    	    if (typeof this.sketch.dispose === 'function') {
    	        console.warn('In canvas-sketch@0.0.23 the dispose() event has been renamed to unload()');
    	    }
    	    if (!this.props.started) {
    	        this._signalBegin();
    	        this.props.started = true;
    	    }
    	    this.tick();
    	    this.render();
    	    return this;
    	};
    	SketchManager.prototype._cancelTimeouts = function _cancelTimeouts () {
    	    if (this._raf != null && typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
    	        window.cancelAnimationFrame(this._raf);
    	        this._raf = null;
    	    }
    	    if (this._recordTimeout != null) {
    	        clearTimeout(this._recordTimeout);
    	        this._recordTimeout = null;
    	    }
    	};
    	SketchManager.prototype.play = function play () {
    	    var animate = this.settings.animate;
    	    if ('animation' in this.settings) {
    	        animate = true;
    	        console.warn('[canvas-sketch] { animation } has been renamed to { animate }');
    	    }
    	    if (!animate) 
    	        { return; }
    	    if (!isBrowser()) {
    	        console.error('[canvas-sketch] WARN: Using { animate } in Node.js is not yet supported');
    	        return;
    	    }
    	    if (this.props.playing) 
    	        { return; }
    	    if (!this.props.started) {
    	        this._signalBegin();
    	        this.props.started = true;
    	    }
    	    this.props.playing = true;
    	    this._cancelTimeouts();
    	    this._lastTime = browser();
    	    this._raf = window.requestAnimationFrame(this._animateHandler);
    	};
    	SketchManager.prototype.pause = function pause () {
    	    if (this.props.recording) 
    	        { this.endRecord(); }
    	    this.props.playing = false;
    	    this._cancelTimeouts();
    	};
    	SketchManager.prototype.togglePlay = function togglePlay () {
    	    if (this.props.playing) 
    	        { this.pause(); }
    	     else 
    	        { this.play(); }
    	};
    	SketchManager.prototype.stop = function stop () {
    	    this.pause();
    	    this.props.frame = 0;
    	    this.props.playhead = 0;
    	    this.props.time = 0;
    	    this.props.deltaTime = 0;
    	    this.props.started = false;
    	    this.render();
    	};
    	SketchManager.prototype.record = function record () {
    	        var this$1$1 = this;

    	    if (this.props.recording) 
    	        { return; }
    	    if (!isBrowser()) {
    	        console.error('[canvas-sketch] WARN: Recording from Node.js is not yet supported');
    	        return;
    	    }
    	    this.stop();
    	    this.props.playing = true;
    	    this.props.recording = true;
    	    var exportOpts = this._createExportOptions({
    	        sequence: true
    	    });
    	    var frameInterval = 1 / this.props.fps;
    	    this._cancelTimeouts();
    	    var tick = function () {
    	        if (!this$1$1.props.recording) 
    	            { return Promise.resolve(); }
    	        this$1$1.props.deltaTime = frameInterval;
    	        this$1$1.tick();
    	        return this$1$1.exportFrame(exportOpts).then(function () {
    	            if (!this$1$1.props.recording) 
    	                { return; }
    	            this$1$1.props.deltaTime = 0;
    	            this$1$1.props.frame++;
    	            if (this$1$1.props.frame < this$1$1.props.totalFrames) {
    	                this$1$1.props.time += frameInterval;
    	                this$1$1.props.playhead = this$1$1._computePlayhead(this$1$1.props.time, this$1$1.props.duration);
    	                this$1$1._recordTimeout = setTimeout(tick, 0);
    	            } else {
    	                console.log('Finished recording');
    	                this$1$1._signalEnd();
    	                this$1$1.endRecord();
    	                this$1$1.stop();
    	                this$1$1.run();
    	            }
    	        });
    	    };
    	    if (!this.props.started) {
    	        this._signalBegin();
    	        this.props.started = true;
    	    }
    	    if (this.sketch && typeof this.sketch.beginRecord === 'function') {
    	        this._wrapContextScale(function (props) { return this$1$1.sketch.beginRecord(props); });
    	    }
    	    streamStart(exportOpts).catch(function (err) {
    	        console.error(err);
    	    }).then(function (response) {
    	        this$1$1._raf = window.requestAnimationFrame(tick);
    	    });
    	};
    	SketchManager.prototype._signalBegin = function _signalBegin () {
    	        var this$1$1 = this;

    	    if (this.sketch && typeof this.sketch.begin === 'function') {
    	        this._wrapContextScale(function (props) { return this$1$1.sketch.begin(props); });
    	    }
    	};
    	SketchManager.prototype._signalEnd = function _signalEnd () {
    	        var this$1$1 = this;

    	    if (this.sketch && typeof this.sketch.end === 'function') {
    	        this._wrapContextScale(function (props) { return this$1$1.sketch.end(props); });
    	    }
    	};
    	SketchManager.prototype.endRecord = function endRecord () {
    	        var this$1$1 = this;

    	    var wasRecording = this.props.recording;
    	    this._cancelTimeouts();
    	    this.props.recording = false;
    	    this.props.deltaTime = 0;
    	    this.props.playing = false;
    	    return streamEnd().catch(function (err) {
    	        console.error(err);
    	    }).then(function () {
    	        if (wasRecording && this$1$1.sketch && typeof this$1$1.sketch.endRecord === 'function') {
    	            this$1$1._wrapContextScale(function (props) { return this$1$1.sketch.endRecord(props); });
    	        }
    	    });
    	};
    	SketchManager.prototype._createExportOptions = function _createExportOptions (opt) {
    	        if ( opt === void 0 ) opt = {};

    	    return {
    	        sequence: opt.sequence,
    	        save: opt.save,
    	        fps: this.props.fps,
    	        frame: opt.sequence ? this.props.frame : undefined,
    	        file: this.settings.file,
    	        name: this.settings.name,
    	        prefix: this.settings.prefix,
    	        suffix: this.settings.suffix,
    	        encoding: this.settings.encoding,
    	        encodingQuality: this.settings.encodingQuality,
    	        timeStamp: opt.timeStamp || getTimeStamp(),
    	        totalFrames: isFinite(this.props.totalFrames) ? Math.max(0, this.props.totalFrames) : 1000
    	    };
    	};
    	SketchManager.prototype.exportFrame = function exportFrame (opt) {
    	        var this$1$1 = this;
    	        if ( opt === void 0 ) opt = {};

    	    if (!this.sketch) 
    	        { return Promise.all([]); }
    	    if (typeof this.sketch.preExport === 'function') {
    	        this.sketch.preExport();
    	    }
    	    var exportOpts = this._createExportOptions(opt);
    	    var client = getClientAPI();
    	    var p = Promise.resolve();
    	    if (client && opt.commit && typeof client.commit === 'function') {
    	        var commitOpts = objectAssign({}, exportOpts);
    	        var hash = client.commit(commitOpts);
    	        if (isPromise_1(hash)) 
    	            { p = hash; }
    	         else 
    	            { p = Promise.resolve(hash); }
    	    }
    	    return p.then(function (hash) { return this$1$1._doExportFrame(objectAssign({}, exportOpts, {
    	        hash: hash || ''
    	    })); }).then(function (result) {
    	        if (result.length === 1) 
    	            { return result[0]; }
    	         else 
    	            { return result; }
    	    });
    	};
    	SketchManager.prototype._doExportFrame = function _doExportFrame (exportOpts) {
    	        var this$1$1 = this;
    	        if ( exportOpts === void 0 ) exportOpts = {};

    	    this._props.exporting = true;
    	    this.resize();
    	    var drawResult = this.render();
    	    var canvas = this.props.canvas;
    	    if (typeof drawResult === 'undefined') {
    	        drawResult = [canvas];
    	    }
    	    drawResult = [].concat(drawResult).filter(Boolean);
    	    drawResult = drawResult.map(function (result) {
    	        var hasDataObject = typeof result === 'object' && result && ('data' in result || 'dataURL' in result);
    	        var data = hasDataObject ? result.data : result;
    	        var opts = hasDataObject ? objectAssign({}, result, {
    	            data: data
    	        }) : {
    	            data: data
    	        };
    	        if (isCanvas(data)) {
    	            var encoding = opts.encoding || exportOpts.encoding;
    	            var encodingQuality = defined(opts.encodingQuality, exportOpts.encodingQuality, 0.95);
    	            var ref = exportCanvas(data, {
    	                encoding: encoding,
    	                encodingQuality: encodingQuality
    	            });
    	                var dataURL = ref.dataURL;
    	                var extension = ref.extension;
    	                var type = ref.type;
    	            return Object.assign(opts, {
    	                dataURL: dataURL,
    	                extension: extension,
    	                type: type
    	            });
    	        } else {
    	            return opts;
    	        }
    	    });
    	    this._props.exporting = false;
    	    this.resize();
    	    this.render();
    	    return Promise.all(drawResult.map(function (result, i, layerList) {
    	        var curOpt = objectAssign({
    	            extension: '',
    	            prefix: '',
    	            suffix: ''
    	        }, exportOpts, result, {
    	            layer: i,
    	            totalLayers: layerList.length
    	        });
    	        var saveParam = exportOpts.save === false ? false : result.save;
    	        curOpt.save = saveParam !== false;
    	        curOpt.filename = resolveFilename(curOpt);
    	        delete curOpt.encoding;
    	        delete curOpt.encodingQuality;
    	        for (var k in curOpt) {
    	            if (typeof curOpt[k] === 'undefined') 
    	                { delete curOpt[k]; }
    	        }
    	        var savePromise = Promise.resolve({});
    	        if (curOpt.save) {
    	            var data = curOpt.data;
    	            if (curOpt.dataURL) {
    	                var dataURL = curOpt.dataURL;
    	                savePromise = saveDataURL(dataURL, curOpt);
    	            } else {
    	                savePromise = saveFile(data, curOpt);
    	            }
    	        }
    	        return savePromise.then(function (saveResult) { return Object.assign({}, curOpt, saveResult); });
    	    })).then(function (ev) {
    	        var savedEvents = ev.filter(function (e) { return e.save; });
    	        if (savedEvents.length > 0) {
    	            var eventWithOutput = savedEvents.find(function (e) { return e.outputName; });
    	            var isClient = savedEvents.some(function (e) { return e.client; });
    	            var isStreaming = savedEvents.some(function (e) { return e.stream; });
    	            var item;
    	            if (savedEvents.length > 1) 
    	                { item = savedEvents.length; }
    	             else if (eventWithOutput) 
    	                { item = (eventWithOutput.outputName) + "/" + (savedEvents[0].filename); }
    	             else 
    	                { item = "" + (savedEvents[0].filename); }
    	            var ofSeq = '';
    	            if (exportOpts.sequence) {
    	                var hasTotalFrames = isFinite(this$1$1.props.totalFrames);
    	                ofSeq = hasTotalFrames ? (" (frame " + (exportOpts.frame + 1) + " / " + (this$1$1.props.totalFrames) + ")") : (" (frame " + (exportOpts.frame) + ")");
    	            } else if (savedEvents.length > 1) {
    	                ofSeq = " files";
    	            }
    	            var client = isClient ? 'canvas-sketch-cli' : 'canvas-sketch';
    	            var action = isStreaming ? 'Streaming into' : 'Exported';
    	            console.log(("%c[" + client + "]%c " + action + " %c" + item + "%c" + ofSeq), 'color: #8e8e8e;', 'color: initial;', 'font-weight: bold;', 'font-weight: initial;');
    	        }
    	        if (typeof this$1$1.sketch.postExport === 'function') {
    	            this$1$1.sketch.postExport();
    	        }
    	        return ev;
    	    });
    	};
    	SketchManager.prototype._wrapContextScale = function _wrapContextScale (cb) {
    	    this._preRender();
    	    cb(this.props);
    	    this._postRender();
    	};
    	SketchManager.prototype._preRender = function _preRender () {
    	    var props = this.props;
    	    if (!this.props.gl && props.context && !props.p5) {
    	        props.context.save();
    	        if (this.settings.scaleContext !== false) {
    	            props.context.scale(props.scaleX, props.scaleY);
    	        }
    	    } else if (props.p5) {
    	        props.p5.scale(props.scaleX / props.pixelRatio, props.scaleY / props.pixelRatio);
    	    }
    	};
    	SketchManager.prototype._postRender = function _postRender () {
    	    var props = this.props;
    	    if (!this.props.gl && props.context && !props.p5) {
    	        props.context.restore();
    	    }
    	    if (props.gl && this.settings.flush !== false && !props.p5) {
    	        props.gl.flush();
    	    }
    	};
    	SketchManager.prototype.tick = function tick () {
    	    if (this.sketch && typeof this.sketch.tick === 'function') {
    	        this._preRender();
    	        this.sketch.tick(this.props);
    	        this._postRender();
    	    }
    	};
    	SketchManager.prototype.render = function render () {
    	    if (this.props.p5) {
    	        this._lastRedrawResult = undefined;
    	        this.props.p5.redraw();
    	        return this._lastRedrawResult;
    	    } else {
    	        return this.submitDrawCall();
    	    }
    	};
    	SketchManager.prototype.submitDrawCall = function submitDrawCall () {
    	    if (!this.sketch) 
    	        { return; }
    	    var props = this.props;
    	    this._preRender();
    	    var drawResult;
    	    if (typeof this.sketch === 'function') {
    	        drawResult = this.sketch(props);
    	    } else if (typeof this.sketch.render === 'function') {
    	        drawResult = this.sketch.render(props);
    	    }
    	    this._postRender();
    	    return drawResult;
    	};
    	SketchManager.prototype.update = function update (opt) {
    	        var this$1$1 = this;
    	        if ( opt === void 0 ) opt = {};

    	    var notYetSupported = ['animate'];
    	    Object.keys(opt).forEach(function (key) {
    	        if (notYetSupported.indexOf(key) >= 0) {
    	            throw new Error(("Sorry, the { " + key + " } option is not yet supported with update()."));
    	        }
    	    });
    	    var oldCanvas = this._settings.canvas;
    	    var oldContext = this._settings.context;
    	    for (var key in opt) {
    	        var value = opt[key];
    	        if (typeof value !== 'undefined') {
    	            this$1$1._settings[key] = value;
    	        }
    	    }
    	    var timeOpts = Object.assign({}, this._settings, opt);
    	    if ('time' in opt && 'frame' in opt) 
    	        { throw new Error('You should specify { time } or { frame } but not both'); }
    	     else if ('time' in opt) 
    	        { delete timeOpts.frame; }
    	     else if ('frame' in opt) 
    	        { delete timeOpts.time; }
    	    if ('duration' in opt && 'totalFrames' in opt) 
    	        { throw new Error('You should specify { duration } or { totalFrames } but not both'); }
    	     else if ('duration' in opt) 
    	        { delete timeOpts.totalFrames; }
    	     else if ('totalFrames' in opt) 
    	        { delete timeOpts.duration; }
    	    if ('data' in opt) 
    	        { this._props.data = opt.data; }
    	    var timeProps = this.getTimeProps(timeOpts);
    	    Object.assign(this._props, timeProps);
    	    if (oldCanvas !== this._settings.canvas || oldContext !== this._settings.context) {
    	        var ref = createCanvas(this._settings);
    	            var canvas = ref.canvas;
    	            var context = ref.context;
    	        this.props.canvas = canvas;
    	        this.props.context = context;
    	        this._setupGLKey();
    	        this._appendCanvasIfNeeded();
    	    }
    	    if (opt.p5 && typeof opt.p5 !== 'function') {
    	        this.props.p5 = opt.p5;
    	        this.props.p5.draw = (function () {
    	            if (this$1$1._isP5Resizing) 
    	                { return; }
    	            this$1$1._lastRedrawResult = this$1$1.submitDrawCall();
    	        });
    	    }
    	    if ('playing' in opt) {
    	        if (opt.playing) 
    	            { this.play(); }
    	         else 
    	            { this.pause(); }
    	    }
    	    checkSettings(this._settings);
    	    this.resize();
    	    this.render();
    	    return this.props;
    	};
    	SketchManager.prototype.resize = function resize () {
    	    var oldSizes = this._getSizeProps();
    	    var settings = this.settings;
    	    var props = this.props;
    	    var newProps = resizeCanvas(props, settings);
    	    Object.assign(this._props, newProps);
    	    var ref = this.props;
    	        var pixelRatio = ref.pixelRatio;
    	        var canvasWidth = ref.canvasWidth;
    	        var canvasHeight = ref.canvasHeight;
    	        var styleWidth = ref.styleWidth;
    	        var styleHeight = ref.styleHeight;
    	    var canvas = this.props.canvas;
    	    if (canvas && settings.resizeCanvas !== false) {
    	        if (props.p5) {
    	            if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
    	                this._isP5Resizing = true;
    	                props.p5.pixelDensity(pixelRatio);
    	                props.p5.resizeCanvas(canvasWidth / pixelRatio, canvasHeight / pixelRatio, false);
    	                this._isP5Resizing = false;
    	            }
    	        } else {
    	            if (canvas.width !== canvasWidth) 
    	                { canvas.width = canvasWidth; }
    	            if (canvas.height !== canvasHeight) 
    	                { canvas.height = canvasHeight; }
    	        }
    	        if (isBrowser() && settings.styleCanvas !== false) {
    	            canvas.style.width = styleWidth + "px";
    	            canvas.style.height = styleHeight + "px";
    	        }
    	    }
    	    var newSizes = this._getSizeProps();
    	    var changed = !deepEqual_1(oldSizes, newSizes);
    	    if (changed) {
    	        this._sizeChanged();
    	    }
    	    return changed;
    	};
    	SketchManager.prototype._sizeChanged = function _sizeChanged () {
    	    if (this.sketch && typeof this.sketch.resize === 'function') {
    	        this.sketch.resize(this.props);
    	    }
    	};
    	SketchManager.prototype.animate = function animate () {
    	    if (!this.props.playing) 
    	        { return; }
    	    if (!isBrowser()) {
    	        console.error('[canvas-sketch] WARN: Animation in Node.js is not yet supported');
    	        return;
    	    }
    	    this._raf = window.requestAnimationFrame(this._animateHandler);
    	    var now = browser();
    	    var fps = this.props.fps;
    	    var frameIntervalMS = 1000 / fps;
    	    var deltaTimeMS = now - this._lastTime;
    	    var duration = this.props.duration;
    	    var hasDuration = typeof duration === 'number' && isFinite(duration);
    	    var isNewFrame = true;
    	    var playbackRate = this.settings.playbackRate;
    	    if (playbackRate === 'fixed') {
    	        deltaTimeMS = frameIntervalMS;
    	    } else if (playbackRate === 'throttle') {
    	        if (deltaTimeMS > frameIntervalMS) {
    	            now = now - deltaTimeMS % frameIntervalMS;
    	            this._lastTime = now;
    	        } else {
    	            isNewFrame = false;
    	        }
    	    } else {
    	        this._lastTime = now;
    	    }
    	    var deltaTime = deltaTimeMS / 1000;
    	    var newTime = this.props.time + deltaTime * this.props.timeScale;
    	    if (newTime < 0 && hasDuration) {
    	        newTime = duration + newTime;
    	    }
    	    var isFinished = false;
    	    var isLoopStart = false;
    	    var looping = this.settings.loop !== false;
    	    if (hasDuration && newTime >= duration) {
    	        if (looping) {
    	            isNewFrame = true;
    	            newTime = newTime % duration;
    	            isLoopStart = true;
    	        } else {
    	            isNewFrame = false;
    	            newTime = duration;
    	            isFinished = true;
    	        }
    	        this._signalEnd();
    	    }
    	    if (isNewFrame) {
    	        this.props.deltaTime = deltaTime;
    	        this.props.time = newTime;
    	        this.props.playhead = this._computePlayhead(newTime, duration);
    	        var lastFrame = this.props.frame;
    	        this.props.frame = this._computeCurrentFrame();
    	        if (isLoopStart) 
    	            { this._signalBegin(); }
    	        if (lastFrame !== this.props.frame) 
    	            { this.tick(); }
    	        this.render();
    	        this.props.deltaTime = 0;
    	    }
    	    if (isFinished) {
    	        this.pause();
    	    }
    	};
    	SketchManager.prototype.dispatch = function dispatch (cb) {
    	    if (typeof cb !== 'function') 
    	        { throw new Error('must pass function into dispatch()'); }
    	    cb(this.props);
    	    this.render();
    	};
    	SketchManager.prototype.mount = function mount () {
    	    this._appendCanvasIfNeeded();
    	};
    	SketchManager.prototype.unmount = function unmount () {
    	    if (isBrowser()) {
    	        window.removeEventListener('resize', this._resizeHandler);
    	        this._keyboardShortcuts.detach();
    	    }
    	    if (this.props.canvas.parentElement) {
    	        this.props.canvas.parentElement.removeChild(this.props.canvas);
    	    }
    	};
    	SketchManager.prototype._appendCanvasIfNeeded = function _appendCanvasIfNeeded () {
    	    if (!isBrowser()) 
    	        { return; }
    	    if (this.settings.parent !== false && (this.props.canvas && !this.props.canvas.parentElement)) {
    	        var defaultParent = this.settings.parent || document.body;
    	        defaultParent.appendChild(this.props.canvas);
    	    }
    	};
    	SketchManager.prototype._setupGLKey = function _setupGLKey () {
    	    if (this.props.context) {
    	        if (isWebGLContext(this.props.context)) {
    	            this._props.gl = this.props.context;
    	        } else {
    	            delete this._props.gl;
    	        }
    	    }
    	};
    	SketchManager.prototype.getTimeProps = function getTimeProps (settings) {
    	        if ( settings === void 0 ) settings = {};

    	    var duration = settings.duration;
    	    var totalFrames = settings.totalFrames;
    	    var timeScale = defined(settings.timeScale, 1);
    	    var fps = defined(settings.fps, 24);
    	    var hasDuration = typeof duration === 'number' && isFinite(duration);
    	    var hasTotalFrames = typeof totalFrames === 'number' && isFinite(totalFrames);
    	    var totalFramesFromDuration = hasDuration ? Math.floor(fps * duration) : undefined;
    	    var durationFromTotalFrames = hasTotalFrames ? totalFrames / fps : undefined;
    	    if (hasDuration && hasTotalFrames && totalFramesFromDuration !== totalFrames) {
    	        throw new Error('You should specify either duration or totalFrames, but not both. Or, they must match exactly.');
    	    }
    	    if (typeof settings.dimensions === 'undefined' && typeof settings.units !== 'undefined') {
    	        console.warn("You've specified a { units } setting but no { dimension }, so the units will be ignored.");
    	    }
    	    totalFrames = defined(totalFrames, totalFramesFromDuration, Infinity);
    	    duration = defined(duration, durationFromTotalFrames, Infinity);
    	    var startTime = settings.time;
    	    var startFrame = settings.frame;
    	    var hasStartTime = typeof startTime === 'number' && isFinite(startTime);
    	    var hasStartFrame = typeof startFrame === 'number' && isFinite(startFrame);
    	    var time = 0;
    	    var frame = 0;
    	    var playhead = 0;
    	    if (hasStartTime && hasStartFrame) {
    	        throw new Error('You should specify either start frame or time, but not both.');
    	    } else if (hasStartTime) {
    	        time = startTime;
    	        playhead = this._computePlayhead(time, duration);
    	        frame = this._computeFrame(playhead, time, totalFrames, fps);
    	    } else if (hasStartFrame) {
    	        frame = startFrame;
    	        time = frame / fps;
    	        playhead = this._computePlayhead(time, duration);
    	    }
    	    return {
    	        playhead: playhead,
    	        time: time,
    	        frame: frame,
    	        duration: duration,
    	        totalFrames: totalFrames,
    	        fps: fps,
    	        timeScale: timeScale
    	    };
    	};
    	SketchManager.prototype.setup = function setup (settings) {
    	        var this$1$1 = this;
    	        if ( settings === void 0 ) settings = {};

    	    if (this.sketch) 
    	        { throw new Error('Multiple setup() calls not yet supported.'); }
    	    this._settings = Object.assign({}, settings, this._settings);
    	    checkSettings(this._settings);
    	    var ref = createCanvas(this._settings);
    	        var context = ref.context;
    	        var canvas = ref.canvas;
    	    var timeProps = this.getTimeProps(this._settings);
    	    this._props = Object.assign({}, timeProps,
    	        {canvas: canvas,
    	        context: context,
    	        deltaTime: 0,
    	        started: false,
    	        exporting: false,
    	        playing: false,
    	        recording: false,
    	        settings: this.settings,
    	        data: this.settings.data,
    	        render: function () { return this$1$1.render(); },
    	        togglePlay: function () { return this$1$1.togglePlay(); },
    	        dispatch: function (cb) { return this$1$1.dispatch(cb); },
    	        tick: function () { return this$1$1.tick(); },
    	        resize: function () { return this$1$1.resize(); },
    	        update: function (opt) { return this$1$1.update(opt); },
    	        exportFrame: function (opt) { return this$1$1.exportFrame(opt); },
    	        record: function () { return this$1$1.record(); },
    	        play: function () { return this$1$1.play(); },
    	        pause: function () { return this$1$1.pause(); },
    	        stop: function () { return this$1$1.stop(); }});
    	    this._setupGLKey();
    	    this.resize();
    	};
    	SketchManager.prototype.loadAndRun = function loadAndRun (canvasSketch, newSettings) {
    	        var this$1$1 = this;

    	    return this.load(canvasSketch, newSettings).then(function () {
    	        this$1$1.run();
    	        return this$1$1;
    	    });
    	};
    	SketchManager.prototype.unload = function unload () {
    	        var this$1$1 = this;

    	    this.pause();
    	    if (!this.sketch) 
    	        { return; }
    	    if (typeof this.sketch.unload === 'function') {
    	        this._wrapContextScale(function (props) { return this$1$1.sketch.unload(props); });
    	    }
    	    this._sketch = null;
    	};
    	SketchManager.prototype.destroy = function destroy () {
    	    this.unload();
    	    this.unmount();
    	};
    	SketchManager.prototype.load = function load (createSketch, newSettings) {
    	        var this$1$1 = this;

    	    if (typeof createSketch !== 'function') {
    	        throw new Error('The function must take in a function as the first parameter. Example:\n  canvasSketcher(() => { ... }, settings)');
    	    }
    	    if (this.sketch) {
    	        this.unload();
    	    }
    	    if (typeof newSettings !== 'undefined') {
    	        this.update(newSettings);
    	    }
    	    this._preRender();
    	    var preload = Promise.resolve();
    	    if (this.settings.p5) {
    	        if (!isBrowser()) {
    	            throw new Error('[canvas-sketch] ERROR: Using p5.js in Node.js is not supported');
    	        }
    	        preload = new Promise(function (resolve) {
    	            var P5Constructor = this$1$1.settings.p5;
    	            var preload;
    	            if (P5Constructor.p5) {
    	                preload = P5Constructor.preload;
    	                P5Constructor = P5Constructor.p5;
    	            }
    	            var p5Sketch = function (p5) {
    	                if (preload) 
    	                    { p5.preload = (function () { return preload(p5); }); }
    	                p5.setup = (function () {
    	                    var props = this$1$1.props;
    	                    var isGL = this$1$1.settings.context === 'webgl';
    	                    var renderer = isGL ? p5.WEBGL : p5.P2D;
    	                    p5.noLoop();
    	                    p5.pixelDensity(props.pixelRatio);
    	                    p5.createCanvas(props.viewportWidth, props.viewportHeight, renderer);
    	                    if (isGL && this$1$1.settings.attributes) {
    	                        p5.setAttributes(this$1$1.settings.attributes);
    	                    }
    	                    this$1$1.update({
    	                        p5: p5,
    	                        canvas: p5.canvas,
    	                        context: p5._renderer.drawingContext
    	                    });
    	                    resolve();
    	                });
    	            };
    	            if (typeof P5Constructor === 'function') {
    	                new P5Constructor(p5Sketch);
    	            } else {
    	                if (typeof window.createCanvas !== 'function') {
    	                    throw new Error("{ p5 } setting is passed but can't find p5.js in global (window) scope. Maybe you did not create it globally?\nnew p5(); // <-- attaches to global scope");
    	                }
    	                p5Sketch(window);
    	            }
    	        });
    	    }
    	    return preload.then(function () {
    	        var loader = createSketch(this$1$1.props);
    	        if (!isPromise_1(loader)) {
    	            loader = Promise.resolve(loader);
    	        }
    	        return loader;
    	    }).then(function (sketch) {
    	        if (!sketch) 
    	            { sketch = {}; }
    	        this$1$1._sketch = sketch;
    	        if (isBrowser()) {
    	            this$1$1._keyboardShortcuts.attach();
    	            window.addEventListener('resize', this$1$1._resizeHandler);
    	        }
    	        this$1$1._postRender();
    	        this$1$1._sizeChanged();
    	        return this$1$1;
    	    }).catch(function (err) {
    	        console.warn('Could not start sketch, the async loading function rejected with an error:\n    Error: ' + err.message);
    	        throw err;
    	    });
    	};

    	Object.defineProperties( SketchManager.prototype, prototypeAccessors );

    	var CACHE = 'hot-id-cache';
    	var runtimeCollisions = [];
    	function isHotReload() {
    	    var client = getClientAPI();
    	    return client && client.hot;
    	}

    	function cacheGet(id) {
    	    var client = getClientAPI();
    	    if (!client) 
    	        { return undefined; }
    	    client[CACHE] = client[CACHE] || {};
    	    return client[CACHE][id];
    	}

    	function cachePut(id, data) {
    	    var client = getClientAPI();
    	    if (!client) 
    	        { return undefined; }
    	    client[CACHE] = client[CACHE] || {};
    	    client[CACHE][id] = data;
    	}

    	function getTimeProp(oldManager, newSettings) {
    	    return newSettings.animate ? {
    	        time: oldManager.props.time
    	    } : undefined;
    	}

    	function canvasSketch(sketch, settings) {
    	    if ( settings === void 0 ) settings = {};

    	    if (settings.p5) {
    	        if (settings.canvas || settings.context && typeof settings.context !== 'string') {
    	            throw new Error("In { p5 } mode, you can't pass your own canvas or context, unless the context is a \"webgl\" or \"2d\" string");
    	        }
    	        var context = typeof settings.context === 'string' ? settings.context : false;
    	        settings = Object.assign({}, settings, {
    	            canvas: false,
    	            context: context
    	        });
    	    }
    	    var isHot = isHotReload();
    	    var hotID;
    	    if (isHot) {
    	        hotID = defined(settings.id, '$__DEFAULT_CANVAS_SKETCH_ID__$');
    	    }
    	    var isInjecting = isHot && typeof hotID === 'string';
    	    if (isInjecting && runtimeCollisions.includes(hotID)) {
    	        console.warn("Warning: You have multiple calls to canvasSketch() in --hot mode. You must pass unique { id } strings in settings to enable hot reload across multiple sketches. ", hotID);
    	        isInjecting = false;
    	    }
    	    var preload = Promise.resolve();
    	    if (isInjecting) {
    	        runtimeCollisions.push(hotID);
    	        var previousData = cacheGet(hotID);
    	        if (previousData) {
    	            var next = function () {
    	                var newProps = getTimeProp(previousData.manager, settings);
    	                previousData.manager.destroy();
    	                return newProps;
    	            };
    	            preload = previousData.load.then(next).catch(next);
    	        }
    	    }
    	    return preload.then(function (newProps) {
    	        var manager = new SketchManager();
    	        var result;
    	        if (sketch) {
    	            settings = Object.assign({}, settings, newProps);
    	            manager.setup(settings);
    	            manager.mount();
    	            result = manager.loadAndRun(sketch);
    	        } else {
    	            result = Promise.resolve(manager);
    	        }
    	        if (isInjecting) {
    	            cachePut(hotID, {
    	                load: result,
    	                manager: manager
    	            });
    	        }
    	        return result;
    	    });
    	}

    	canvasSketch.canvasSketch = canvasSketch;
    	canvasSketch.PaperSizes = paperSizes;

    	return canvasSketch;

    })));

    });

    /* src/Viewer/CanvasSketch.svelte generated by Svelte v3.49.0 */
    const file$d = "src/Viewer/CanvasSketch.svelte";

    // (50:0) {#key sketch.type}
    function create_key_block(ctx) {
    	let canvas_1;

    	const block = {
    		c: function create() {
    			canvas_1 = element("canvas");
    			attr_dev(canvas_1, "class", "svelte-86cls6");
    			add_location(canvas_1, file$d, 50, 4, 1875);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, canvas_1, anchor);
    			/*canvas_1_binding*/ ctx[3](canvas_1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(canvas_1);
    			/*canvas_1_binding*/ ctx[3](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(50:0) {#key sketch.type}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let previous_key = /*sketch*/ ctx[0].type;
    	let key_block_anchor;
    	let key_block = create_key_block(ctx);

    	const block = {
    		c: function create() {
    			key_block.c();
    			key_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			key_block.m(target, anchor);
    			insert_dev(target, key_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*sketch*/ 1 && safe_not_equal(previous_key, previous_key = /*sketch*/ ctx[0].type)) {
    				key_block.d(1);
    				key_block = create_key_block(ctx);
    				key_block.c();
    				key_block.m(key_block_anchor.parentNode, key_block_anchor);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(key_block_anchor);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CanvasSketch', slots, []);
    	let { sketch } = $$props;
    	let canvas, loadedSketch, canvasSketchManager;

    	onMount(async () => {
    		// On the first load of the page, specifically on mobile Safari (iOS), the canvas
    		// can be sized incorrectly – not filling the full screen vertically. The root of
    		// this is in canvas-sketch/lib/core/resizeCanvas.js#L24, wherein the function
    		// getBoundingClientRect() can seemingly return incorrectly at the first instant
    		// of a page load. I worked around a similar issue in ParamInput.svelte, when the
    		// clientWidth element binding wasn't working under the same circumstances.
    		// There's probably a more elegant solution here, but it seems like setTimeout
    		// has come to the rescue yet again. What a world.
    		setTimeout(loadCurrentSketch, 0);
    	});

    	function update() {
    		canvasSketchManager.render();
    	}

    	function sketchChanged(sketch) {
    		if (canvas && sketch != loadedSketch) {
    			if (sketch.type != loadedSketch.type) {
    				// Canvas must be recreated for a new sketch when the context changes type
    				// sketchChanged is called before the DOM updates, so use setTimeout to execute after
    				setTimeout(loadCurrentSketch, 0);
    			} else {
    				loadCurrentSketch();
    			}
    		}
    	}

    	async function loadCurrentSketch() {
    		if (canvasSketchManager) canvasSketchManager.unload();

    		const opt = {
    			...sketch.settings,
    			canvas,
    			parent: canvas.parentElement
    		};

    		canvasSketchManager = await canvasSketch_umd(sketch.sketchFn, opt);
    		loadedSketch = sketch;
    	}

    	const writable_props = ['sketch'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CanvasSketch> was created with unknown prop '${key}'`);
    	});

    	function canvas_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			canvas = $$value;
    			$$invalidate(1, canvas);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('sketch' in $$props) $$invalidate(0, sketch = $$props.sketch);
    	};

    	$$self.$capture_state = () => ({
    		canvasSketch: canvasSketch_umd,
    		onMount,
    		sketch,
    		canvas,
    		loadedSketch,
    		canvasSketchManager,
    		update,
    		sketchChanged,
    		loadCurrentSketch
    	});

    	$$self.$inject_state = $$props => {
    		if ('sketch' in $$props) $$invalidate(0, sketch = $$props.sketch);
    		if ('canvas' in $$props) $$invalidate(1, canvas = $$props.canvas);
    		if ('loadedSketch' in $$props) loadedSketch = $$props.loadedSketch;
    		if ('canvasSketchManager' in $$props) canvasSketchManager = $$props.canvasSketchManager;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*sketch*/ 1) {
    			sketchChanged(sketch);
    		}
    	};

    	return [sketch, canvas, update, canvas_1_binding];
    }

    class CanvasSketch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { sketch: 0, update: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CanvasSketch",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sketch*/ ctx[0] === undefined && !('sketch' in props)) {
    			console.warn("<CanvasSketch> was created without expected prop 'sketch'");
    		}
    	}

    	get sketch() {
    		throw new Error("<CanvasSketch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sketch(value) {
    		throw new Error("<CanvasSketch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get update() {
    		return this.$$.ctx[2];
    	}

    	set update(value) {
    		throw new Error("<CanvasSketch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Viewer/Viewer.svelte generated by Svelte v3.49.0 */
    const file$c = "src/Viewer/Viewer.svelte";
    const get_right_slot_changes = dirty => ({});
    const get_right_slot_context = ctx => ({});
    const get_left_slot_changes = dirty => ({});
    const get_left_slot_context = ctx => ({});

    // (82:12) {:else}
    function create_else_block_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(">");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(82:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (80:12) {#if leftPanelOpen}
    function create_if_block_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("<");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(80:12) {#if leftPanelOpen}",
    		ctx
    	});

    	return block;
    }

    // (98:12) {:else}
    function create_else_block$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("<");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(98:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (96:12) {#if rightPanelOpen}
    function create_if_block$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(">");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(96:12) {#if rightPanelOpen}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div2;
    	let div1;
    	let t1;
    	let div4;
    	let canvassketch;
    	let div4_resize_listener;
    	let t2;
    	let div8;
    	let div6;
    	let div5;
    	let t3;
    	let div7;
    	let current;
    	let mounted;
    	let dispose;
    	const left_slot_template = /*#slots*/ ctx[12].left;
    	const left_slot = create_slot(left_slot_template, ctx, /*$$scope*/ ctx[11], get_left_slot_context);

    	function select_block_type(ctx, dirty) {
    		if (/*leftPanelOpen*/ ctx[3]) return create_if_block_1$2;
    		return create_else_block_1$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let canvassketch_props = { sketch: /*sketch*/ ctx[0] };

    	canvassketch = new CanvasSketch({
    			props: canvassketch_props,
    			$$inline: true
    		});

    	/*canvassketch_binding*/ ctx[13](canvassketch);

    	function select_block_type_1(ctx, dirty) {
    		if (/*rightPanelOpen*/ ctx[4]) return create_if_block$5;
    		return create_else_block$3;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block1 = current_block_type_1(ctx);
    	const right_slot_template = /*#slots*/ ctx[12].right;
    	const right_slot = create_slot(right_slot_template, ctx, /*$$scope*/ ctx[11], get_right_slot_context);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			if (left_slot) left_slot.c();
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			if_block0.c();
    			t1 = space();
    			div4 = element("div");
    			create_component(canvassketch.$$.fragment);
    			t2 = space();
    			div8 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			if_block1.c();
    			t3 = space();
    			div7 = element("div");
    			if (right_slot) right_slot.c();
    			attr_dev(div0, "class", "panel_content svelte-uf93z5");
    			add_location(div0, file$c, 73, 4, 2920);
    			attr_dev(div1, "class", "panel_button svelte-uf93z5");
    			add_location(div1, file$c, 78, 8, 3045);
    			attr_dev(div2, "class", "button_container svelte-uf93z5");
    			add_location(div2, file$c, 77, 4, 3006);
    			attr_dev(div3, "id", "left_panel");
    			attr_dev(div3, "class", "panel svelte-uf93z5");
    			toggle_class(div3, "open", /*leftPanelOpen*/ ctx[3]);
    			add_location(div3, file$c, 72, 0, 2853);
    			attr_dev(div4, "class", "viewport svelte-uf93z5");
    			add_render_callback(() => /*div4_elementresize_handler*/ ctx[14].call(div4));
    			add_location(div4, file$c, 88, 0, 3241);
    			attr_dev(div5, "class", "panel_button svelte-uf93z5");
    			add_location(div5, file$c, 94, 8, 3563);
    			attr_dev(div6, "class", "button_container svelte-uf93z5");
    			add_location(div6, file$c, 93, 4, 3524);
    			attr_dev(div7, "class", "panel_content svelte-uf93z5");
    			add_location(div7, file$c, 102, 4, 3757);
    			attr_dev(div8, "id", "right_panel");
    			attr_dev(div8, "class", "panel right_transition svelte-uf93z5");
    			set_style(div8, "--viewport-width", /*viewportWidthString*/ ctx[5]);
    			toggle_class(div8, "open", /*rightPanelOpen*/ ctx[4]);
    			add_location(div8, file$c, 92, 0, 3390);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);

    			if (left_slot) {
    				left_slot.m(div0, null);
    			}

    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			if_block0.m(div1, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div4, anchor);
    			mount_component(canvassketch, div4, null);
    			div4_resize_listener = add_resize_listener(div4, /*div4_elementresize_handler*/ ctx[14].bind(div4));
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div6);
    			append_dev(div6, div5);
    			if_block1.m(div5, null);
    			append_dev(div8, t3);
    			append_dev(div8, div7);

    			if (right_slot) {
    				right_slot.m(div7, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*toggleLeft*/ ctx[6], false, false, false),
    					listen_dev(div4, "click", /*viewportClicked*/ ctx[8], false, false, false),
    					listen_dev(div5, "click", /*toggleRight*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (left_slot) {
    				if (left_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						left_slot,
    						left_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(left_slot_template, /*$$scope*/ ctx[11], dirty, get_left_slot_changes),
    						get_left_slot_context
    					);
    				}
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div1, null);
    				}
    			}

    			if (dirty & /*leftPanelOpen*/ 8) {
    				toggle_class(div3, "open", /*leftPanelOpen*/ ctx[3]);
    			}

    			const canvassketch_changes = {};
    			if (dirty & /*sketch*/ 1) canvassketch_changes.sketch = /*sketch*/ ctx[0];
    			canvassketch.$set(canvassketch_changes);

    			if (current_block_type_1 !== (current_block_type_1 = select_block_type_1(ctx))) {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div5, null);
    				}
    			}

    			if (right_slot) {
    				if (right_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						right_slot,
    						right_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(right_slot_template, /*$$scope*/ ctx[11], dirty, get_right_slot_changes),
    						get_right_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*viewportWidthString*/ 32) {
    				set_style(div8, "--viewport-width", /*viewportWidthString*/ ctx[5]);
    			}

    			if (dirty & /*rightPanelOpen*/ 16) {
    				toggle_class(div8, "open", /*rightPanelOpen*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(left_slot, local);
    			transition_in(canvassketch.$$.fragment, local);
    			transition_in(right_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(left_slot, local);
    			transition_out(canvassketch.$$.fragment, local);
    			transition_out(right_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (left_slot) left_slot.d(detaching);
    			if_block0.d();
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div4);
    			/*canvassketch_binding*/ ctx[13](null);
    			destroy_component(canvassketch);
    			div4_resize_listener();
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div8);
    			if_block1.d();
    			if (right_slot) right_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let viewportWidthString;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Viewer', slots, ['left','right']);
    	let { sketch } = $$props;
    	let { directLink } = $$props;
    	let sketchComponent;
    	let viewportWidth;

    	function update() {
    		sketchComponent.update();
    	}

    	let storedLeftPanelState = localStorage.getItem('leftPanelOpen');

    	let leftPanelOpen = storedLeftPanelState
    	? storedLeftPanelState === 'true'
    	: true;

    	function toggleLeft() {
    		$$invalidate(3, leftPanelOpen = !leftPanelOpen);
    		localStorage.setItem('leftPanelOpen', leftPanelOpen ? 'true' : 'false');
    		preventPanelCollision(false);
    	}

    	let storedRightPanelState = localStorage.getItem('rightPanelOpen');

    	let rightPanelOpen = storedRightPanelState
    	? storedRightPanelState === 'true'
    	: true;

    	function toggleRight() {
    		$$invalidate(4, rightPanelOpen = !rightPanelOpen);
    		localStorage.setItem('rightPanelOpen', rightPanelOpen ? 'true' : 'false');
    		preventPanelCollision(true);
    	}

    	// Double click: hide panels if either is open, show if both are closed
    	function viewportClicked(event) {
    		if (event.detail == 2) {
    			if (rightPanelOpen || leftPanelOpen) {
    				if (rightPanelOpen) toggleRight();
    				if (leftPanelOpen) toggleLeft();
    			} else {
    				toggleRight();
    				toggleLeft();
    			}
    		}
    	}

    	// Only allow one open panel at a time for narrow screens
    	preventPanelCollision(directLink);

    	function preventPanelCollision(preferRight = false) {
    		// todo: fix hardcoded width threshold
    		if (leftPanelOpen && rightPanelOpen && window.innerWidth < 600) {
    			$$invalidate(3, leftPanelOpen = !preferRight);
    			$$invalidate(4, rightPanelOpen = preferRight);
    			localStorage.setItem('leftPanelOpen', leftPanelOpen ? 'true' : 'false');
    			localStorage.setItem('rightPanelOpen', rightPanelOpen ? 'true' : 'false');
    		}
    	}

    	// Check panels again when the document becomes visible (i.e. tab is selected)
    	document.addEventListener('visibilitychange', () => {
    		if (document.visibilityState === 'visible') preventPanelCollision();
    	});

    	// Prevent right bar position from animating immediately after a window resize event
    	window.addEventListener(
    		'resize',
    		function (event) {
    			// Remove the class with the transition before the animation can roll
    			document.getElementById('right_panel').classList.remove('right_transition');

    			// Add it back on the next DOM update - goofy but daaang it looks fresh
    			setTimeout(
    				() => {
    					document.getElementById('right_panel').classList.add('right_transition');
    				},
    				0
    			);

    			// Adjust panels if need be
    			preventPanelCollision();
    		},
    		true
    	);

    	const writable_props = ['sketch', 'directLink'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Viewer> was created with unknown prop '${key}'`);
    	});

    	function canvassketch_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			sketchComponent = $$value;
    			$$invalidate(2, sketchComponent);
    		});
    	}

    	function div4_elementresize_handler() {
    		viewportWidth = this.clientWidth;
    		$$invalidate(1, viewportWidth);
    	}

    	$$self.$$set = $$props => {
    		if ('sketch' in $$props) $$invalidate(0, sketch = $$props.sketch);
    		if ('directLink' in $$props) $$invalidate(9, directLink = $$props.directLink);
    		if ('$$scope' in $$props) $$invalidate(11, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		CanvasSketch,
    		sketch,
    		directLink,
    		sketchComponent,
    		viewportWidth,
    		update,
    		storedLeftPanelState,
    		leftPanelOpen,
    		toggleLeft,
    		storedRightPanelState,
    		rightPanelOpen,
    		toggleRight,
    		viewportClicked,
    		preventPanelCollision,
    		viewportWidthString
    	});

    	$$self.$inject_state = $$props => {
    		if ('sketch' in $$props) $$invalidate(0, sketch = $$props.sketch);
    		if ('directLink' in $$props) $$invalidate(9, directLink = $$props.directLink);
    		if ('sketchComponent' in $$props) $$invalidate(2, sketchComponent = $$props.sketchComponent);
    		if ('viewportWidth' in $$props) $$invalidate(1, viewportWidth = $$props.viewportWidth);
    		if ('storedLeftPanelState' in $$props) storedLeftPanelState = $$props.storedLeftPanelState;
    		if ('leftPanelOpen' in $$props) $$invalidate(3, leftPanelOpen = $$props.leftPanelOpen);
    		if ('storedRightPanelState' in $$props) storedRightPanelState = $$props.storedRightPanelState;
    		if ('rightPanelOpen' in $$props) $$invalidate(4, rightPanelOpen = $$props.rightPanelOpen);
    		if ('viewportWidthString' in $$props) $$invalidate(5, viewportWidthString = $$props.viewportWidthString);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*viewportWidth*/ 2) {
    			$$invalidate(5, viewportWidthString = viewportWidth + "px");
    		}
    	};

    	return [
    		sketch,
    		viewportWidth,
    		sketchComponent,
    		leftPanelOpen,
    		rightPanelOpen,
    		viewportWidthString,
    		toggleLeft,
    		toggleRight,
    		viewportClicked,
    		directLink,
    		update,
    		$$scope,
    		slots,
    		canvassketch_binding,
    		div4_elementresize_handler
    	];
    }

    class Viewer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { sketch: 0, directLink: 9, update: 10 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Viewer",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sketch*/ ctx[0] === undefined && !('sketch' in props)) {
    			console.warn("<Viewer> was created without expected prop 'sketch'");
    		}

    		if (/*directLink*/ ctx[9] === undefined && !('directLink' in props)) {
    			console.warn("<Viewer> was created without expected prop 'directLink'");
    		}
    	}

    	get sketch() {
    		throw new Error("<Viewer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sketch(value) {
    		throw new Error("<Viewer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get directLink() {
    		throw new Error("<Viewer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set directLink(value) {
    		throw new Error("<Viewer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get update() {
    		return this.$$.ctx[10];
    	}

    	set update(value) {
    		throw new Error("<Viewer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Viewer/Components/Button.svelte generated by Svelte v3.49.0 */

    const file$b = "src/Viewer/Components/Button.svelte";

    function create_fragment$b(ctx) {
    	let button;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*name*/ ctx[0]);
    			attr_dev(button, "class", "svelte-455e8i");
    			add_location(button, file$b, 4, 0, 41);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1) set_data_dev(t, /*name*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, []);
    	let { name } = $$props;
    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ name });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, click_handler];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<Button> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Viewer/Components/Expandable.svelte generated by Svelte v3.49.0 */

    const file$a = "src/Viewer/Components/Expandable.svelte";

    // (20:14)              Expandable content.         
    function fallback_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Expandable content.");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(20:14)              Expandable content.         ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div1;
    	let div0;
    	let div0_resize_listener;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(div0, "id", "expandable");
    			add_render_callback(() => /*div0_elementresize_handler*/ ctx[6].call(div0));
    			add_location(div0, file$a, 18, 4, 794);
    			attr_dev(div1, "id", "expandable_container");
    			set_style(div1, "--expandable-container-height", /*expandableHeightPx*/ ctx[3]);
    			attr_dev(div1, "class", "svelte-q1ukpf");
    			toggle_class(div1, "open", /*open*/ ctx[0]);
    			toggle_class(div1, "expand_animation", /*animationEnabled*/ ctx[2]);
    			add_location(div1, file$a, 17, 0, 638);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(div0, null);
    			}

    			div0_resize_listener = add_resize_listener(div0, /*div0_elementresize_handler*/ ctx[6].bind(div0));
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*expandableHeightPx*/ 8) {
    				set_style(div1, "--expandable-container-height", /*expandableHeightPx*/ ctx[3]);
    			}

    			if (dirty & /*open*/ 1) {
    				toggle_class(div1, "open", /*open*/ ctx[0]);
    			}

    			if (dirty & /*animationEnabled*/ 4) {
    				toggle_class(div1, "expand_animation", /*animationEnabled*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			div0_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let expandableHeightPx;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Expandable', slots, ['default']);
    	let { open = false } = $$props;

    	// CSS cannot transition height to `auto`, so generate and use computed height
    	let expandableHeight = undefined;

    	let expandableBorderSize = 0; // could be derived w/ getComputedStyle in onMount if need be

    	// Disable animation when adjusting height, then re-enable it again
    	let animationEnabled = true;

    	function expandableHeightUpdated() {
    		$$invalidate(2, animationEnabled = false);

    		setTimeout(
    			() => {
    				$$invalidate(2, animationEnabled = true);
    			},
    			0
    		);
    	}

    	const writable_props = ['open'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Expandable> was created with unknown prop '${key}'`);
    	});

    	function div0_elementresize_handler() {
    		expandableHeight = this.clientHeight;
    		$$invalidate(1, expandableHeight);
    	}

    	$$self.$$set = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		open,
    		expandableHeight,
    		expandableBorderSize,
    		animationEnabled,
    		expandableHeightUpdated,
    		expandableHeightPx
    	});

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('expandableHeight' in $$props) $$invalidate(1, expandableHeight = $$props.expandableHeight);
    		if ('expandableBorderSize' in $$props) $$invalidate(7, expandableBorderSize = $$props.expandableBorderSize);
    		if ('animationEnabled' in $$props) $$invalidate(2, animationEnabled = $$props.animationEnabled);
    		if ('expandableHeightPx' in $$props) $$invalidate(3, expandableHeightPx = $$props.expandableHeightPx);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*expandableHeight*/ 2) {
    			$$invalidate(3, expandableHeightPx = expandableHeight + expandableBorderSize + 'px');
    		}

    		if ($$self.$$.dirty & /*expandableHeight*/ 2) {
    			expandableHeightUpdated();
    		}
    	};

    	return [
    		open,
    		expandableHeight,
    		animationEnabled,
    		expandableHeightPx,
    		$$scope,
    		slots,
    		div0_elementresize_handler
    	];
    }

    class Expandable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { open: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Expandable",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get open() {
    		throw new Error("<Expandable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Expandable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Viewer/PanelHeader.svelte generated by Svelte v3.49.0 */
    const file$9 = "src/Viewer/PanelHeader.svelte";
    const get_contents_slot_changes = dirty => ({});
    const get_contents_slot_context = ctx => ({});
    const get_click_to_expand_slot_changes = dirty => ({ open: dirty & /*openState*/ 2 });
    const get_click_to_expand_slot_context = ctx => ({ open: /*openState*/ ctx[1] });
    const get_subtitle_slot_changes = dirty => ({});
    const get_subtitle_slot_context = ctx => ({});
    const get_title_slot_changes = dirty => ({});
    const get_title_slot_context = ctx => ({});

    // (44:0) {#if showContents}
    function create_if_block$4(ctx) {
    	let expandable;
    	let current;

    	expandable = new Expandable({
    			props: {
    				open: /*openState*/ ctx[1],
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(expandable.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(expandable, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const expandable_changes = {};
    			if (dirty & /*openState*/ 2) expandable_changes.open = /*openState*/ ctx[1];

    			if (dirty & /*$$scope*/ 64) {
    				expandable_changes.$$scope = { dirty, ctx };
    			}

    			expandable.$set(expandable_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(expandable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(expandable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(expandable, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(44:0) {#if showContents}",
    		ctx
    	});

    	return block;
    }

    // (45:4) <Expandable open={openState}>
    function create_default_slot$4(ctx) {
    	let div;
    	let current;
    	const contents_slot_template = /*#slots*/ ctx[5].contents;
    	const contents_slot = create_slot(contents_slot_template, ctx, /*$$scope*/ ctx[6], get_contents_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (contents_slot) contents_slot.c();
    			attr_dev(div, "class", "contents_container svelte-7jalgm");
    			add_location(div, file$9, 45, 8, 1209);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (contents_slot) {
    				contents_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (contents_slot) {
    				if (contents_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						contents_slot,
    						contents_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(contents_slot_template, /*$$scope*/ ctx[6], dirty, get_contents_slot_changes),
    						get_contents_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contents_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contents_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (contents_slot) contents_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(45:4) <Expandable open={openState}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div0;
    	let t0;
    	let div3;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const title_slot_template = /*#slots*/ ctx[5].title;
    	const title_slot = create_slot(title_slot_template, ctx, /*$$scope*/ ctx[6], get_title_slot_context);
    	const subtitle_slot_template = /*#slots*/ ctx[5].subtitle;
    	const subtitle_slot = create_slot(subtitle_slot_template, ctx, /*$$scope*/ ctx[6], get_subtitle_slot_context);
    	const click_to_expand_slot_template = /*#slots*/ ctx[5].click_to_expand;
    	const click_to_expand_slot = create_slot(click_to_expand_slot_template, ctx, /*$$scope*/ ctx[6], get_click_to_expand_slot_context);
    	let if_block = /*showContents*/ ctx[0] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			if (title_slot) title_slot.c();
    			t0 = space();
    			div3 = element("div");
    			div1 = element("div");
    			if (subtitle_slot) subtitle_slot.c();
    			t1 = space();
    			div2 = element("div");
    			if (click_to_expand_slot) click_to_expand_slot.c();
    			t2 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div0, "class", "title svelte-7jalgm");
    			add_location(div0, file$9, 26, 0, 790);
    			attr_dev(div1, "class", "subtitle_text svelte-7jalgm");
    			add_location(div1, file$9, 32, 4, 881);
    			attr_dev(div2, "class", "subtitle_button svelte-7jalgm");
    			toggle_class(div2, "hidden", !/*showContents*/ ctx[0]);
    			add_location(div2, file$9, 37, 4, 972);
    			attr_dev(div3, "class", "subtitle svelte-7jalgm");
    			add_location(div3, file$9, 31, 0, 854);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);

    			if (title_slot) {
    				title_slot.m(div0, null);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);

    			if (subtitle_slot) {
    				subtitle_slot.m(div1, null);
    			}

    			append_dev(div3, t1);
    			append_dev(div3, div2);

    			if (click_to_expand_slot) {
    				click_to_expand_slot.m(div2, null);
    			}

    			insert_dev(target, t2, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", /*toggleOpenState*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (title_slot) {
    				if (title_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						title_slot,
    						title_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(title_slot_template, /*$$scope*/ ctx[6], dirty, get_title_slot_changes),
    						get_title_slot_context
    					);
    				}
    			}

    			if (subtitle_slot) {
    				if (subtitle_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						subtitle_slot,
    						subtitle_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(subtitle_slot_template, /*$$scope*/ ctx[6], dirty, get_subtitle_slot_changes),
    						get_subtitle_slot_context
    					);
    				}
    			}

    			if (click_to_expand_slot) {
    				if (click_to_expand_slot.p && (!current || dirty & /*$$scope, openState*/ 66)) {
    					update_slot_base(
    						click_to_expand_slot,
    						click_to_expand_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(click_to_expand_slot_template, /*$$scope*/ ctx[6], dirty, get_click_to_expand_slot_changes),
    						get_click_to_expand_slot_context
    					);
    				}
    			}

    			if (dirty & /*showContents*/ 1) {
    				toggle_class(div2, "hidden", !/*showContents*/ ctx[0]);
    			}

    			if (/*showContents*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*showContents*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title_slot, local);
    			transition_in(subtitle_slot, local);
    			transition_in(click_to_expand_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title_slot, local);
    			transition_out(subtitle_slot, local);
    			transition_out(click_to_expand_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (title_slot) title_slot.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div3);
    			if (subtitle_slot) subtitle_slot.d(detaching);
    			if (click_to_expand_slot) click_to_expand_slot.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let openStateKey;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PanelHeader', slots, ['title','subtitle','click_to_expand','contents']);
    	let { id = undefined } = $$props;
    	let { openDefault = false } = $$props;
    	let { showContents = true } = $$props;
    	let openState = getStoredOpenState(openDefault);

    	function idChanged(id) {
    		$$invalidate(1, openState = getStoredOpenState(openDefault));
    	}

    	function getStoredOpenState(defaultState) {
    		let storedOpenState = localStorage.getItem(openStateKey);

    		return storedOpenState
    		? storedOpenState === 'true'
    		: defaultState;
    	}

    	function toggleOpenState() {
    		$$invalidate(1, openState = !openState);
    		localStorage.setItem(openStateKey, openState ? 'true' : 'false');
    	}

    	const writable_props = ['id', 'openDefault', 'showContents'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PanelHeader> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(3, id = $$props.id);
    		if ('openDefault' in $$props) $$invalidate(4, openDefault = $$props.openDefault);
    		if ('showContents' in $$props) $$invalidate(0, showContents = $$props.showContents);
    		if ('$$scope' in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Expandable,
    		id,
    		openDefault,
    		showContents,
    		openState,
    		idChanged,
    		getStoredOpenState,
    		toggleOpenState,
    		openStateKey
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(3, id = $$props.id);
    		if ('openDefault' in $$props) $$invalidate(4, openDefault = $$props.openDefault);
    		if ('showContents' in $$props) $$invalidate(0, showContents = $$props.showContents);
    		if ('openState' in $$props) $$invalidate(1, openState = $$props.openState);
    		if ('openStateKey' in $$props) openStateKey = $$props.openStateKey;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*id*/ 8) {
    			// Determine openness from stored state for this id
    			openStateKey = id + '_HeaderOpen';
    		}

    		if ($$self.$$.dirty & /*id*/ 8) {
    			idChanged();
    		}
    	};

    	return [showContents, openState, toggleOpenState, id, openDefault, slots, $$scope];
    }

    class PanelHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { id: 3, openDefault: 4, showContents: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PanelHeader",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get id() {
    		throw new Error("<PanelHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<PanelHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get openDefault() {
    		throw new Error("<PanelHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set openDefault(value) {
    		throw new Error("<PanelHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showContents() {
    		throw new Error("<PanelHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showContents(value) {
    		throw new Error("<PanelHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Viewer/LeftPanel.svelte generated by Svelte v3.49.0 */
    const file$8 = "src/Viewer/LeftPanel.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (51:8) 
    function create_title_slot$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Sketchbook";
    			attr_dev(span, "slot", "title");
    			add_location(span, file$8, 50, 8, 1700);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_title_slot$1.name,
    		type: "slot",
    		source: "(51:8) ",
    		ctx
    	});

    	return block;
    }

    // (54:8) 
    function create_subtitle_slot$1(ctx) {
    	let span;
    	let t0;
    	let a;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text("by ");
    			a = element("a");
    			a.textContent = "flatpickles";
    			attr_dev(a, "href", "http://flatpickles.com");
    			add_location(a, file$8, 54, 15, 1805);
    			attr_dev(span, "slot", "subtitle");
    			add_location(span, file$8, 53, 8, 1767);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, a);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_subtitle_slot$1.name,
    		type: "slot",
    		source: "(54:8) ",
    		ctx
    	});

    	return block;
    }

    // (60:12) {:else}
    function create_else_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("☆");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(60:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (58:12) {#if open}
    function create_if_block_3$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("★");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(58:12) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (57:8) 
    function create_click_to_expand_slot$1(ctx) {
    	let span;

    	function select_block_type(ctx, dirty) {
    		if (/*open*/ ctx[12]) return create_if_block_3$1;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if_block.c();
    			attr_dev(span, "slot", "click_to_expand");
    			add_location(span, file$8, 56, 8, 1878);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			if_block.m(span, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(span, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_click_to_expand_slot$1.name,
    		type: "slot",
    		source: "(57:8) ",
    		ctx
    	});

    	return block;
    }

    // (70:16) {#if showWorksInProgressButton}
    function create_if_block_2$1(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				name: /*worksInProgressButtonText*/ ctx[4]
    			},
    			$$inline: true
    		});

    	button.$on("click", /*toggleWIP*/ ctx[6]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};
    			if (dirty & /*worksInProgressButtonText*/ 16) button_changes.name = /*worksInProgressButtonText*/ ctx[4];
    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(70:16) {#if showWorksInProgressButton}",
    		ctx
    	});

    	return block;
    }

    // (64:8) 
    function create_contents_slot$1(ctx) {
    	let span;
    	let p;
    	let t0;
    	let a;
    	let t2;
    	let t3;
    	let div;
    	let t4;
    	let button;
    	let current;
    	let if_block = /*showWorksInProgressButton*/ ctx[3] && create_if_block_2$1(ctx);

    	button = new Button({
    			props: { name: "Reset Sketchbook" },
    			$$inline: true
    		});

    	button.$on("click", resetState);

    	const block = {
    		c: function create() {
    			span = element("span");
    			p = element("p");
    			t0 = text("Sketchbook is a collection of programmatic art pieces. It is a work in progress.\n                Code and details ");
    			a = element("a");
    			a.textContent = "here";
    			t2 = text(".");
    			t3 = space();
    			div = element("div");
    			if (if_block) if_block.c();
    			t4 = space();
    			create_component(button.$$.fragment);
    			attr_dev(a, "href", "https://github.com/flatpickles/sketchbook");
    			add_location(a, file$8, 66, 33, 2226);
    			attr_dev(p, "class", "svelte-eagxf1");
    			add_location(p, file$8, 64, 12, 2092);
    			attr_dev(div, "id", "buttons");
    			add_location(div, file$8, 68, 12, 2317);
    			attr_dev(span, "slot", "contents");
    			add_location(span, file$8, 63, 8, 2057);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, p);
    			append_dev(p, t0);
    			append_dev(p, a);
    			append_dev(p, t2);
    			append_dev(span, t3);
    			append_dev(span, div);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t4);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*showWorksInProgressButton*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*showWorksInProgressButton*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, t4);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (if_block) if_block.d();
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_contents_slot$1.name,
    		type: "slot",
    		source: "(64:8) ",
    		ctx
    	});

    	return block;
    }

    // (80:12) {#if sketch.date || showWorksInProgress || sketch == selected}
    function create_if_block$3(ctx) {
    	let div;
    	let t0_value = /*sketch*/ ctx[9].name + "";
    	let t0;
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;
    	let if_block = !/*sketch*/ ctx[9].date && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			attr_dev(div, "class", "sketch_item svelte-eagxf1");
    			toggle_class(div, "sketch_selected", /*sketch*/ ctx[9] == /*selected*/ ctx[1]);
    			add_location(div, file$8, 80, 16, 2793);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t2);

    			if (!mounted) {
    				dispose = listen_dev(
    					div,
    					"click",
    					function () {
    						if (is_function(/*selectSketch*/ ctx[5].bind(this, /*sketch*/ ctx[9]))) /*selectSketch*/ ctx[5].bind(this, /*sketch*/ ctx[9]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*sketches*/ 1 && t0_value !== (t0_value = /*sketch*/ ctx[9].name + "")) set_data_dev(t0, t0_value);

    			if (!/*sketch*/ ctx[9].date) {
    				if (if_block) ; else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					if_block.m(div, t2);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*sketches, selected*/ 3) {
    				toggle_class(div, "sketch_selected", /*sketch*/ ctx[9] == /*selected*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(80:12) {#if sketch.date || showWorksInProgress || sketch == selected}",
    		ctx
    	});

    	return block;
    }

    // (86:24) {#if !sketch.date}
    function create_if_block_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("[WIP]");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(86:24) {#if !sketch.date}",
    		ctx
    	});

    	return block;
    }

    // (79:8) {#each sketches as sketch}
    function create_each_block$2(ctx) {
    	let if_block_anchor;
    	let if_block = (/*sketch*/ ctx[9].date || /*showWorksInProgress*/ ctx[2] || /*sketch*/ ctx[9] == /*selected*/ ctx[1]) && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*sketch*/ ctx[9].date || /*showWorksInProgress*/ ctx[2] || /*sketch*/ ctx[9] == /*selected*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(79:8) {#each sketches as sketch}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div1;
    	let panelheader;
    	let t;
    	let div0;
    	let current;

    	panelheader = new PanelHeader({
    			props: {
    				id: "Sketchbook",
    				openDefault: false,
    				$$slots: {
    					contents: [create_contents_slot$1],
    					click_to_expand: [
    						create_click_to_expand_slot$1,
    						({ open }) => ({ 12: open }),
    						({ open }) => open ? 4096 : 0
    					],
    					subtitle: [create_subtitle_slot$1],
    					title: [create_title_slot$1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = /*sketches*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(panelheader.$$.fragment);
    			t = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "id", "list_container");
    			attr_dev(div0, "class", "svelte-eagxf1");
    			add_location(div0, file$8, 77, 4, 2641);
    			attr_dev(div1, "id", "panel_container");
    			attr_dev(div1, "class", "svelte-eagxf1");
    			add_location(div1, file$8, 48, 0, 1611);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(panelheader, div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const panelheader_changes = {};

    			if (dirty & /*$$scope, worksInProgressButtonText, showWorksInProgressButton, open*/ 12312) {
    				panelheader_changes.$$scope = { dirty, ctx };
    			}

    			panelheader.$set(panelheader_changes);

    			if (dirty & /*sketches, selected, selectSketch, showWorksInProgress*/ 39) {
    				each_value = /*sketches*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(panelheader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(panelheader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(panelheader);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function resetState() {
    	location.hash = '';
    	localStorage.clear();
    	location.reload();
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let worksInProgressButtonText;
    	let showWorksInProgressButton;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LeftPanel', slots, []);
    	let { sketches } = $$props;
    	let { selected } = $$props;

    	// Communicate selection event to parent
    	const dispatch = createEventDispatcher();

    	function selectSketch(sketch) {
    		dispatch('selection', { sketch });
    	}

    	// WIP sketches!
    	let storedWorksInProgressState = localStorage.getItem('showWorksInProgress');

    	let showWorksInProgress = storedWorksInProgressState
    	? storedWorksInProgressState === 'true'
    	: false;

    	function toggleWIP() {
    		// Toggle the state
    		$$invalidate(2, showWorksInProgress = !showWorksInProgress);

    		localStorage.setItem('showWorksInProgress', showWorksInProgress ? 'true' : 'false');

    		// Select a different non-WIP sketch if currently selected is WIP
    		if (!selected.date) {
    			for (let sketchIdx = 0; sketchIdx < sketches.length; sketchIdx++) {
    				const sketch = sketches[sketchIdx];

    				if (sketch.date) {
    					selectSketch(sketch);
    					break;
    				}
    			}
    		}
    	}

    	const writable_props = ['sketches', 'selected'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LeftPanel> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('sketches' in $$props) $$invalidate(0, sketches = $$props.sketches);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Button,
    		PanelHeader,
    		sketches,
    		selected,
    		dispatch,
    		selectSketch,
    		storedWorksInProgressState,
    		showWorksInProgress,
    		toggleWIP,
    		resetState,
    		showWorksInProgressButton,
    		worksInProgressButtonText
    	});

    	$$self.$inject_state = $$props => {
    		if ('sketches' in $$props) $$invalidate(0, sketches = $$props.sketches);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('storedWorksInProgressState' in $$props) storedWorksInProgressState = $$props.storedWorksInProgressState;
    		if ('showWorksInProgress' in $$props) $$invalidate(2, showWorksInProgress = $$props.showWorksInProgress);
    		if ('showWorksInProgressButton' in $$props) $$invalidate(3, showWorksInProgressButton = $$props.showWorksInProgressButton);
    		if ('worksInProgressButtonText' in $$props) $$invalidate(4, worksInProgressButtonText = $$props.worksInProgressButtonText);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*showWorksInProgress*/ 4) {
    			$$invalidate(4, worksInProgressButtonText = (showWorksInProgress ? 'Hide ' : 'Show') + ' Works in Progress');
    		}

    		if ($$self.$$.dirty & /*sketches*/ 1) {
    			$$invalidate(3, showWorksInProgressButton = sketches.reduce(
    				(incrementalState, currentSketch) => {
    					return !currentSketch.date || incrementalState;
    				},
    				false
    			));
    		}
    	};

    	return [
    		sketches,
    		selected,
    		showWorksInProgress,
    		showWorksInProgressButton,
    		worksInProgressButtonText,
    		selectSketch,
    		toggleWIP
    	];
    }

    class LeftPanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { sketches: 0, selected: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LeftPanel",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sketches*/ ctx[0] === undefined && !('sketches' in props)) {
    			console.warn("<LeftPanel> was created without expected prop 'sketches'");
    		}

    		if (/*selected*/ ctx[1] === undefined && !('selected' in props)) {
    			console.warn("<LeftPanel> was created without expected prop 'selected'");
    		}
    	}

    	get sketches() {
    		throw new Error("<LeftPanel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sketches(value) {
    		throw new Error("<LeftPanel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<LeftPanel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<LeftPanel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Viewer/ParamInputs/ParamInput.svelte generated by Svelte v3.49.0 */
    const file$7 = "src/Viewer/ParamInputs/ParamInput.svelte";

    // (28:4) {#if label}
    function create_if_block$2(ctx) {
    	let label_1;
    	let t;

    	const block = {
    		c: function create() {
    			label_1 = element("label");
    			t = text(/*label*/ ctx[0]);
    			attr_dev(label_1, "for", /*label*/ ctx[0]);
    			attr_dev(label_1, "class", "param_name svelte-1b4zp5r");
    			add_location(label_1, file$7, 27, 15, 834);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label_1, anchor);
    			append_dev(label_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*label*/ 1) set_data_dev(t, /*label*/ ctx[0]);

    			if (dirty & /*label*/ 1) {
    				attr_dev(label_1, "for", /*label*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(28:4) {#if label}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div1;
    	let t0;
    	let div0;
    	let t1;
    	let div2;
    	let t2;
    	let current;
    	let if_block = /*label*/ ctx[0] && create_if_block$2(ctx);
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t1 = space();
    			div2 = element("div");
    			t2 = text(/*label*/ ctx[0]);
    			attr_dev(div0, "class", "param_wrapper svelte-1b4zp5r");
    			add_location(div0, file$7, 28, 4, 897);
    			attr_dev(div1, "class", "param svelte-1b4zp5r");
    			attr_dev(div1, "title", /*title*/ ctx[1]);
    			set_style(div1, "--label-basis", /*labelBasis*/ ctx[2]);
    			add_location(div1, file$7, 26, 0, 749);
    			attr_dev(div2, "class", "param_name text_measurement svelte-1b4zp5r");
    			add_location(div2, file$7, 34, 0, 1061);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			insert_dev(target, t1, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, t2);
    			/*div2_binding*/ ctx[7](div2);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*label*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(div1, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*title*/ 2) {
    				attr_dev(div1, "title", /*title*/ ctx[1]);
    			}

    			if (!current || dirty & /*labelBasis*/ 4) {
    				set_style(div1, "--label-basis", /*labelBasis*/ ctx[2]);
    			}

    			if (!current || dirty & /*label*/ 1) set_data_dev(t2, /*label*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div2);
    			/*div2_binding*/ ctx[7](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ParamInput', slots, ['default']);
    	let { label = '' } = $$props;
    	let { title = undefined } = $$props;
    	let { labelBasis = undefined } = $$props;
    	let { labelWidth = undefined } = $$props;

    	// Use size of hidden textMeasurementDiv to publish display width for this label
    	// Previously I was using bind:clientWidth, but this value can be inaccurate for
    	// occasional initial page loads in mobile Safari (iOS). What a world.
    	let textMeasurementDiv = undefined;

    	onMount(setLabelWidth);

    	function labelUpdated(l) {
    		setTimeout(setLabelWidth, 0);
    	}

    	function setLabelWidth() {
    		if (!textMeasurementDiv) return;
    		$$invalidate(4, labelWidth = textMeasurementDiv.offsetWidth);
    	}

    	const writable_props = ['label', 'title', 'labelBasis', 'labelWidth'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ParamInput> was created with unknown prop '${key}'`);
    	});

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			textMeasurementDiv = $$value;
    			$$invalidate(3, textMeasurementDiv);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('labelBasis' in $$props) $$invalidate(2, labelBasis = $$props.labelBasis);
    		if ('labelWidth' in $$props) $$invalidate(4, labelWidth = $$props.labelWidth);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		label,
    		title,
    		labelBasis,
    		labelWidth,
    		textMeasurementDiv,
    		labelUpdated,
    		setLabelWidth
    	});

    	$$self.$inject_state = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('labelBasis' in $$props) $$invalidate(2, labelBasis = $$props.labelBasis);
    		if ('labelWidth' in $$props) $$invalidate(4, labelWidth = $$props.labelWidth);
    		if ('textMeasurementDiv' in $$props) $$invalidate(3, textMeasurementDiv = $$props.textMeasurementDiv);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*label*/ 1) {
    			labelUpdated();
    		}
    	};

    	return [
    		label,
    		title,
    		labelBasis,
    		textMeasurementDiv,
    		labelWidth,
    		$$scope,
    		slots,
    		div2_binding
    	];
    }

    class ParamInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			label: 0,
    			title: 1,
    			labelBasis: 2,
    			labelWidth: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ParamInput",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get label() {
    		throw new Error("<ParamInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<ParamInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ParamInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ParamInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelBasis() {
    		throw new Error("<ParamInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelBasis(value) {
    		throw new Error("<ParamInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelWidth() {
    		throw new Error("<ParamInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelWidth(value) {
    		throw new Error("<ParamInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Viewer/ParamInputs/SliderInput.svelte generated by Svelte v3.49.0 */
    const file$6 = "src/Viewer/ParamInputs/SliderInput.svelte";

    // (32:0) <ParamInput {label} {title} {labelBasis} bind:labelWidth={labelWidth}>
    function create_default_slot$3(ctx) {
    	let div1;
    	let input;
    	let t;
    	let div0;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			input = element("input");
    			t = space();
    			div0 = element("div");
    			attr_dev(input, "type", "range");
    			attr_dev(input, "class", "slider svelte-12ci3gw");
    			attr_dev(input, "id", /*label*/ ctx[2]);
    			attr_dev(input, "min", /*min*/ ctx[5]);
    			attr_dev(input, "max", /*max*/ ctx[6]);
    			attr_dev(input, "step", /*step*/ ctx[7]);
    			add_location(input, file$6, 33, 8, 1215);
    			attr_dev(div0, "contenteditable", "false");
    			attr_dev(div0, "class", "number_display svelte-12ci3gw");
    			if (/*inputString*/ ctx[10] === void 0) add_render_callback(() => /*div0_input_handler*/ ctx[16].call(div0));
    			add_location(div0, file$6, 38, 8, 1373);
    			attr_dev(div1, "class", "slider_wrapper svelte-12ci3gw");
    			set_style(div1, "--number-display-basis", /*numberDisplayBasisPx*/ ctx[8]);
    			add_location(div1, file$6, 32, 4, 1123);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, input);
    			set_input_value(input, /*value*/ ctx[0]);
    			append_dev(div1, t);
    			append_dev(div1, div0);
    			/*div0_binding*/ ctx[15](div0);

    			if (/*inputString*/ ctx[10] !== void 0) {
    				div0.innerHTML = /*inputString*/ ctx[10];
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_input_handler*/ ctx[14]),
    					listen_dev(input, "input", /*input_change_input_handler*/ ctx[14]),
    					listen_dev(input, "input", /*input_handler*/ ctx[12], false, false, false),
    					listen_dev(input, "change", /*change_handler*/ ctx[13], false, false, false),
    					listen_dev(div0, "input", /*div0_input_handler*/ ctx[16])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*label*/ 4) {
    				attr_dev(input, "id", /*label*/ ctx[2]);
    			}

    			if (dirty & /*min*/ 32) {
    				attr_dev(input, "min", /*min*/ ctx[5]);
    			}

    			if (dirty & /*max*/ 64) {
    				attr_dev(input, "max", /*max*/ ctx[6]);
    			}

    			if (dirty & /*step*/ 128) {
    				attr_dev(input, "step", /*step*/ ctx[7]);
    			}

    			if (dirty & /*value*/ 1) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			if (dirty & /*inputString*/ 1024 && /*inputString*/ ctx[10] !== div0.innerHTML) {
    				div0.innerHTML = /*inputString*/ ctx[10];
    			}

    			if (dirty & /*numberDisplayBasisPx*/ 256) {
    				set_style(div1, "--number-display-basis", /*numberDisplayBasisPx*/ ctx[8]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			/*div0_binding*/ ctx[15](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(32:0) <ParamInput {label} {title} {labelBasis} bind:labelWidth={labelWidth}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let paraminput;
    	let updating_labelWidth;
    	let current;

    	function paraminput_labelWidth_binding(value) {
    		/*paraminput_labelWidth_binding*/ ctx[17](value);
    	}

    	let paraminput_props = {
    		label: /*label*/ ctx[2],
    		title: /*title*/ ctx[3],
    		labelBasis: /*labelBasis*/ ctx[4],
    		$$slots: { default: [create_default_slot$3] },
    		$$scope: { ctx }
    	};

    	if (/*labelWidth*/ ctx[1] !== void 0) {
    		paraminput_props.labelWidth = /*labelWidth*/ ctx[1];
    	}

    	paraminput = new ParamInput({ props: paraminput_props, $$inline: true });
    	binding_callbacks.push(() => bind(paraminput, 'labelWidth', paraminput_labelWidth_binding));

    	const block = {
    		c: function create() {
    			create_component(paraminput.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(paraminput, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const paraminput_changes = {};
    			if (dirty & /*label*/ 4) paraminput_changes.label = /*label*/ ctx[2];
    			if (dirty & /*title*/ 8) paraminput_changes.title = /*title*/ ctx[3];
    			if (dirty & /*labelBasis*/ 16) paraminput_changes.labelBasis = /*labelBasis*/ ctx[4];

    			if (dirty & /*$$scope, numberDisplayBasisPx, numberDisplayDiv, inputString, label, min, max, step, value*/ 1050597) {
    				paraminput_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_labelWidth && dirty & /*labelWidth*/ 2) {
    				updating_labelWidth = true;
    				paraminput_changes.labelWidth = /*labelWidth*/ ctx[1];
    				add_flush_callback(() => updating_labelWidth = false);
    			}

    			paraminput.$set(paraminput_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paraminput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paraminput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paraminput, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let fixedDecimals;
    	let inputString;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SliderInput', slots, []);
    	let { label = '' } = $$props;
    	let { title = undefined } = $$props;
    	let { labelBasis = undefined } = $$props;
    	let { value = 0 } = $$props;
    	let { min = 0 } = $$props;
    	let { max = 1 } = $$props;
    	let { step = 0.01 } = $$props;
    	let { labelWidth = undefined } = $$props;

    	// Never let the number display get smaller than an original minimum width
    	// This keeps the slider value from jumping around, e.g. when crossing 0
    	let numberDisplayBasis = 18; // minimum width

    	let numberDisplayBasisPx = numberDisplayBasis.toString() + 'px';
    	let numberDisplayDiv = undefined;

    	function valueUpdated() {
    		if (numberDisplayDiv) {
    			let ceilWidth = numberDisplayDiv.offsetWidth;
    			numberDisplayBasis = Math.max(numberDisplayBasis, ceilWidth);
    			$$invalidate(8, numberDisplayBasisPx = numberDisplayBasis.toString() + 'px');
    		}
    	}
    	const writable_props = ['label', 'title', 'labelBasis', 'value', 'min', 'max', 'step', 'labelWidth'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SliderInput> was created with unknown prop '${key}'`);
    	});

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_change_input_handler() {
    		value = to_number(this.value);
    		$$invalidate(0, value);
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			numberDisplayDiv = $$value;
    			$$invalidate(9, numberDisplayDiv);
    		});
    	}

    	function div0_input_handler() {
    		inputString = this.innerHTML;
    		((($$invalidate(10, inputString), $$invalidate(0, value)), $$invalidate(11, fixedDecimals)), $$invalidate(7, step));
    	}

    	function paraminput_labelWidth_binding(value) {
    		labelWidth = value;
    		$$invalidate(1, labelWidth);
    	}

    	$$self.$$set = $$props => {
    		if ('label' in $$props) $$invalidate(2, label = $$props.label);
    		if ('title' in $$props) $$invalidate(3, title = $$props.title);
    		if ('labelBasis' in $$props) $$invalidate(4, labelBasis = $$props.labelBasis);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('min' in $$props) $$invalidate(5, min = $$props.min);
    		if ('max' in $$props) $$invalidate(6, max = $$props.max);
    		if ('step' in $$props) $$invalidate(7, step = $$props.step);
    		if ('labelWidth' in $$props) $$invalidate(1, labelWidth = $$props.labelWidth);
    	};

    	$$self.$capture_state = () => ({
    		ParamInput,
    		label,
    		title,
    		labelBasis,
    		value,
    		min,
    		max,
    		step,
    		labelWidth,
    		numberDisplayBasis,
    		numberDisplayBasisPx,
    		numberDisplayDiv,
    		valueUpdated,
    		fixedDecimals,
    		inputString
    	});

    	$$self.$inject_state = $$props => {
    		if ('label' in $$props) $$invalidate(2, label = $$props.label);
    		if ('title' in $$props) $$invalidate(3, title = $$props.title);
    		if ('labelBasis' in $$props) $$invalidate(4, labelBasis = $$props.labelBasis);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('min' in $$props) $$invalidate(5, min = $$props.min);
    		if ('max' in $$props) $$invalidate(6, max = $$props.max);
    		if ('step' in $$props) $$invalidate(7, step = $$props.step);
    		if ('labelWidth' in $$props) $$invalidate(1, labelWidth = $$props.labelWidth);
    		if ('numberDisplayBasis' in $$props) numberDisplayBasis = $$props.numberDisplayBasis;
    		if ('numberDisplayBasisPx' in $$props) $$invalidate(8, numberDisplayBasisPx = $$props.numberDisplayBasisPx);
    		if ('numberDisplayDiv' in $$props) $$invalidate(9, numberDisplayDiv = $$props.numberDisplayDiv);
    		if ('fixedDecimals' in $$props) $$invalidate(11, fixedDecimals = $$props.fixedDecimals);
    		if ('inputString' in $$props) $$invalidate(10, inputString = $$props.inputString);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*step*/ 128) {
    			$$invalidate(11, fixedDecimals = Math.ceil(Math.log10(1 / step)));
    		}

    		if ($$self.$$.dirty & /*value, fixedDecimals*/ 2049) {
    			$$invalidate(10, inputString = value.toFixed(fixedDecimals));
    		}

    		if ($$self.$$.dirty & /*value*/ 1) {
    			valueUpdated();
    		}
    	};

    	return [
    		value,
    		labelWidth,
    		label,
    		title,
    		labelBasis,
    		min,
    		max,
    		step,
    		numberDisplayBasisPx,
    		numberDisplayDiv,
    		inputString,
    		fixedDecimals,
    		input_handler,
    		change_handler,
    		input_change_input_handler,
    		div0_binding,
    		div0_input_handler,
    		paraminput_labelWidth_binding
    	];
    }

    class SliderInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			label: 2,
    			title: 3,
    			labelBasis: 4,
    			value: 0,
    			min: 5,
    			max: 6,
    			step: 7,
    			labelWidth: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SliderInput",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get label() {
    		throw new Error("<SliderInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<SliderInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<SliderInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<SliderInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelBasis() {
    		throw new Error("<SliderInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelBasis(value) {
    		throw new Error("<SliderInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<SliderInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<SliderInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error("<SliderInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<SliderInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<SliderInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<SliderInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get step() {
    		throw new Error("<SliderInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set step(value) {
    		throw new Error("<SliderInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelWidth() {
    		throw new Error("<SliderInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelWidth(value) {
    		throw new Error("<SliderInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Viewer/ParamInputs/ColorInput.svelte generated by Svelte v3.49.0 */
    const file$5 = "src/Viewer/ParamInputs/ColorInput.svelte";

    // (11:0) <ParamInput {label} {title} {labelBasis} bind:labelWidth={labelWidth}>
    function create_default_slot$2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "color");
    			attr_dev(input, "id", /*label*/ ctx[2]);
    			attr_dev(input, "class", "svelte-swqnw2");
    			add_location(input, file$5, 11, 2, 309);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[7]),
    					listen_dev(input, "input", /*input_handler*/ ctx[5], false, false, false),
    					listen_dev(input, "change", /*change_handler*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*label*/ 4) {
    				attr_dev(input, "id", /*label*/ ctx[2]);
    			}

    			if (dirty & /*value*/ 1) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(11:0) <ParamInput {label} {title} {labelBasis} bind:labelWidth={labelWidth}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let paraminput;
    	let updating_labelWidth;
    	let current;

    	function paraminput_labelWidth_binding(value) {
    		/*paraminput_labelWidth_binding*/ ctx[8](value);
    	}

    	let paraminput_props = {
    		label: /*label*/ ctx[2],
    		title: /*title*/ ctx[3],
    		labelBasis: /*labelBasis*/ ctx[4],
    		$$slots: { default: [create_default_slot$2] },
    		$$scope: { ctx }
    	};

    	if (/*labelWidth*/ ctx[1] !== void 0) {
    		paraminput_props.labelWidth = /*labelWidth*/ ctx[1];
    	}

    	paraminput = new ParamInput({ props: paraminput_props, $$inline: true });
    	binding_callbacks.push(() => bind(paraminput, 'labelWidth', paraminput_labelWidth_binding));

    	const block = {
    		c: function create() {
    			create_component(paraminput.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(paraminput, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const paraminput_changes = {};
    			if (dirty & /*label*/ 4) paraminput_changes.label = /*label*/ ctx[2];
    			if (dirty & /*title*/ 8) paraminput_changes.title = /*title*/ ctx[3];
    			if (dirty & /*labelBasis*/ 16) paraminput_changes.labelBasis = /*labelBasis*/ ctx[4];

    			if (dirty & /*$$scope, label, value*/ 517) {
    				paraminput_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_labelWidth && dirty & /*labelWidth*/ 2) {
    				updating_labelWidth = true;
    				paraminput_changes.labelWidth = /*labelWidth*/ ctx[1];
    				add_flush_callback(() => updating_labelWidth = false);
    			}

    			paraminput.$set(paraminput_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paraminput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paraminput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paraminput, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ColorInput', slots, []);
    	let { label = '' } = $$props;
    	let { title = undefined } = $$props;
    	let { value = 0 } = $$props;
    	let { labelBasis = undefined } = $$props;
    	let { labelWidth = undefined } = $$props;
    	const writable_props = ['label', 'title', 'value', 'labelBasis', 'labelWidth'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ColorInput> was created with unknown prop '${key}'`);
    	});

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function paraminput_labelWidth_binding(value) {
    		labelWidth = value;
    		$$invalidate(1, labelWidth);
    	}

    	$$self.$$set = $$props => {
    		if ('label' in $$props) $$invalidate(2, label = $$props.label);
    		if ('title' in $$props) $$invalidate(3, title = $$props.title);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('labelBasis' in $$props) $$invalidate(4, labelBasis = $$props.labelBasis);
    		if ('labelWidth' in $$props) $$invalidate(1, labelWidth = $$props.labelWidth);
    	};

    	$$self.$capture_state = () => ({
    		ParamInput,
    		label,
    		title,
    		value,
    		labelBasis,
    		labelWidth
    	});

    	$$self.$inject_state = $$props => {
    		if ('label' in $$props) $$invalidate(2, label = $$props.label);
    		if ('title' in $$props) $$invalidate(3, title = $$props.title);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('labelBasis' in $$props) $$invalidate(4, labelBasis = $$props.labelBasis);
    		if ('labelWidth' in $$props) $$invalidate(1, labelWidth = $$props.labelWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		labelWidth,
    		label,
    		title,
    		labelBasis,
    		input_handler,
    		change_handler,
    		input_input_handler,
    		paraminput_labelWidth_binding
    	];
    }

    class ColorInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			label: 2,
    			title: 3,
    			value: 0,
    			labelBasis: 4,
    			labelWidth: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ColorInput",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get label() {
    		throw new Error("<ColorInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<ColorInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ColorInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ColorInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<ColorInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ColorInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelBasis() {
    		throw new Error("<ColorInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelBasis(value) {
    		throw new Error("<ColorInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelWidth() {
    		throw new Error("<ColorInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelWidth(value) {
    		throw new Error("<ColorInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Viewer/ParamInputs/CheckboxInput.svelte generated by Svelte v3.49.0 */
    const file$4 = "src/Viewer/ParamInputs/CheckboxInput.svelte";

    // (11:0) <ParamInput {label} {title} {labelBasis} bind:labelWidth={labelWidth}>
    function create_default_slot$1(ctx) {
    	let label_1;
    	let input;
    	let t;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label_1 = element("label");
    			input = element("input");
    			t = space();
    			span = element("span");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "checkbox svelte-1w78tcd");
    			attr_dev(input, "id", /*label*/ ctx[2]);
    			add_location(input, file$4, 12, 8, 355);
    			attr_dev(span, "class", "svelte-1w78tcd");
    			add_location(span, file$4, 13, 8, 457);
    			attr_dev(label_1, "class", "custom_checkbox svelte-1w78tcd");
    			add_location(label_1, file$4, 11, 4, 315);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label_1, anchor);
    			append_dev(label_1, input);
    			input.checked = /*value*/ ctx[0];
    			append_dev(label_1, t);
    			append_dev(label_1, span);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_handler*/ ctx[7]),
    					listen_dev(input, "input", /*input_handler*/ ctx[5], false, false, false),
    					listen_dev(input, "change", /*change_handler*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*label*/ 4) {
    				attr_dev(input, "id", /*label*/ ctx[2]);
    			}

    			if (dirty & /*value*/ 1) {
    				input.checked = /*value*/ ctx[0];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label_1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(11:0) <ParamInput {label} {title} {labelBasis} bind:labelWidth={labelWidth}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let paraminput;
    	let updating_labelWidth;
    	let current;

    	function paraminput_labelWidth_binding(value) {
    		/*paraminput_labelWidth_binding*/ ctx[8](value);
    	}

    	let paraminput_props = {
    		label: /*label*/ ctx[2],
    		title: /*title*/ ctx[3],
    		labelBasis: /*labelBasis*/ ctx[4],
    		$$slots: { default: [create_default_slot$1] },
    		$$scope: { ctx }
    	};

    	if (/*labelWidth*/ ctx[1] !== void 0) {
    		paraminput_props.labelWidth = /*labelWidth*/ ctx[1];
    	}

    	paraminput = new ParamInput({ props: paraminput_props, $$inline: true });
    	binding_callbacks.push(() => bind(paraminput, 'labelWidth', paraminput_labelWidth_binding));

    	const block = {
    		c: function create() {
    			create_component(paraminput.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(paraminput, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const paraminput_changes = {};
    			if (dirty & /*label*/ 4) paraminput_changes.label = /*label*/ ctx[2];
    			if (dirty & /*title*/ 8) paraminput_changes.title = /*title*/ ctx[3];
    			if (dirty & /*labelBasis*/ 16) paraminput_changes.labelBasis = /*labelBasis*/ ctx[4];

    			if (dirty & /*$$scope, label, value*/ 517) {
    				paraminput_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_labelWidth && dirty & /*labelWidth*/ 2) {
    				updating_labelWidth = true;
    				paraminput_changes.labelWidth = /*labelWidth*/ ctx[1];
    				add_flush_callback(() => updating_labelWidth = false);
    			}

    			paraminput.$set(paraminput_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paraminput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paraminput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paraminput, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CheckboxInput', slots, []);
    	let { label = '' } = $$props;
    	let { title = undefined } = $$props;
    	let { value = false } = $$props;
    	let { labelBasis = undefined } = $$props;
    	let { labelWidth = undefined } = $$props;
    	const writable_props = ['label', 'title', 'value', 'labelBasis', 'labelWidth'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CheckboxInput> was created with unknown prop '${key}'`);
    	});

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_change_handler() {
    		value = this.checked;
    		$$invalidate(0, value);
    	}

    	function paraminput_labelWidth_binding(value) {
    		labelWidth = value;
    		$$invalidate(1, labelWidth);
    	}

    	$$self.$$set = $$props => {
    		if ('label' in $$props) $$invalidate(2, label = $$props.label);
    		if ('title' in $$props) $$invalidate(3, title = $$props.title);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('labelBasis' in $$props) $$invalidate(4, labelBasis = $$props.labelBasis);
    		if ('labelWidth' in $$props) $$invalidate(1, labelWidth = $$props.labelWidth);
    	};

    	$$self.$capture_state = () => ({
    		ParamInput,
    		label,
    		title,
    		value,
    		labelBasis,
    		labelWidth
    	});

    	$$self.$inject_state = $$props => {
    		if ('label' in $$props) $$invalidate(2, label = $$props.label);
    		if ('title' in $$props) $$invalidate(3, title = $$props.title);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('labelBasis' in $$props) $$invalidate(4, labelBasis = $$props.labelBasis);
    		if ('labelWidth' in $$props) $$invalidate(1, labelWidth = $$props.labelWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		labelWidth,
    		label,
    		title,
    		labelBasis,
    		input_handler,
    		change_handler,
    		input_change_handler,
    		paraminput_labelWidth_binding
    	];
    }

    class CheckboxInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			label: 2,
    			title: 3,
    			value: 0,
    			labelBasis: 4,
    			labelWidth: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CheckboxInput",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get label() {
    		throw new Error("<CheckboxInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<CheckboxInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<CheckboxInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<CheckboxInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<CheckboxInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<CheckboxInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelBasis() {
    		throw new Error("<CheckboxInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelBasis(value) {
    		throw new Error("<CheckboxInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelWidth() {
    		throw new Error("<CheckboxInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelWidth(value) {
    		throw new Error("<CheckboxInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Viewer/ParamInputs/EventInput.svelte generated by Svelte v3.49.0 */
    const file$3 = "src/Viewer/ParamInputs/EventInput.svelte";

    // (20:0) <ParamInput {label} {title} {labelBasis} bind:labelWidth={labelWidth}>
    function create_default_slot(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "svelte-1kxodle");
    			add_location(button, file$3, 20, 4, 568);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*buttonClicked*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(20:0) <ParamInput {label} {title} {labelBasis} bind:labelWidth={labelWidth}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let paraminput;
    	let updating_labelWidth;
    	let current;

    	function paraminput_labelWidth_binding(value) {
    		/*paraminput_labelWidth_binding*/ ctx[6](value);
    	}

    	let paraminput_props = {
    		label: /*label*/ ctx[1],
    		title: /*title*/ ctx[2],
    		labelBasis: /*labelBasis*/ ctx[3],
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	if (/*labelWidth*/ ctx[0] !== void 0) {
    		paraminput_props.labelWidth = /*labelWidth*/ ctx[0];
    	}

    	paraminput = new ParamInput({ props: paraminput_props, $$inline: true });
    	binding_callbacks.push(() => bind(paraminput, 'labelWidth', paraminput_labelWidth_binding));

    	const block = {
    		c: function create() {
    			create_component(paraminput.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(paraminput, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const paraminput_changes = {};
    			if (dirty & /*label*/ 2) paraminput_changes.label = /*label*/ ctx[1];
    			if (dirty & /*title*/ 4) paraminput_changes.title = /*title*/ ctx[2];
    			if (dirty & /*labelBasis*/ 8) paraminput_changes.labelBasis = /*labelBasis*/ ctx[3];

    			if (dirty & /*$$scope*/ 256) {
    				paraminput_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_labelWidth && dirty & /*labelWidth*/ 1) {
    				updating_labelWidth = true;
    				paraminput_changes.labelWidth = /*labelWidth*/ ctx[0];
    				add_flush_callback(() => updating_labelWidth = false);
    			}

    			paraminput.$set(paraminput_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paraminput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paraminput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paraminput, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EventInput', slots, []);
    	let { label = '' } = $$props;
    	let { title = undefined } = $$props;
    	let { value = undefined } = $$props;
    	let { labelBasis = undefined } = $$props;
    	let { labelWidth = undefined } = $$props;
    	const dispatch = createEventDispatcher();

    	function buttonClicked(event) {
    		if (value) value();

    		// todo: can Svelte just forward the event?
    		dispatch('click');
    	}

    	const writable_props = ['label', 'title', 'value', 'labelBasis', 'labelWidth'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EventInput> was created with unknown prop '${key}'`);
    	});

    	function paraminput_labelWidth_binding(value) {
    		labelWidth = value;
    		$$invalidate(0, labelWidth);
    	}

    	$$self.$$set = $$props => {
    		if ('label' in $$props) $$invalidate(1, label = $$props.label);
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    		if ('value' in $$props) $$invalidate(5, value = $$props.value);
    		if ('labelBasis' in $$props) $$invalidate(3, labelBasis = $$props.labelBasis);
    		if ('labelWidth' in $$props) $$invalidate(0, labelWidth = $$props.labelWidth);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		ParamInput,
    		label,
    		title,
    		value,
    		labelBasis,
    		labelWidth,
    		dispatch,
    		buttonClicked
    	});

    	$$self.$inject_state = $$props => {
    		if ('label' in $$props) $$invalidate(1, label = $$props.label);
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    		if ('value' in $$props) $$invalidate(5, value = $$props.value);
    		if ('labelBasis' in $$props) $$invalidate(3, labelBasis = $$props.labelBasis);
    		if ('labelWidth' in $$props) $$invalidate(0, labelWidth = $$props.labelWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		labelWidth,
    		label,
    		title,
    		labelBasis,
    		buttonClicked,
    		value,
    		paraminput_labelWidth_binding
    	];
    }

    class EventInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			label: 1,
    			title: 2,
    			value: 5,
    			labelBasis: 3,
    			labelWidth: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EventInput",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get label() {
    		throw new Error("<EventInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<EventInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<EventInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<EventInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<EventInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<EventInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelBasis() {
    		throw new Error("<EventInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelBasis(value) {
    		throw new Error("<EventInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelWidth() {
    		throw new Error("<EventInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelWidth(value) {
    		throw new Error("<EventInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var aliceblue = "#f0f8ff";
    var antiquewhite = "#faebd7";
    var aqua = "#00ffff";
    var aquamarine = "#7fffd4";
    var azure = "#f0ffff";
    var beige = "#f5f5dc";
    var bisque = "#ffe4c4";
    var black = "#000000";
    var blanchedalmond = "#ffebcd";
    var blue = "#0000ff";
    var blueviolet = "#8a2be2";
    var brown = "#a52a2a";
    var burlywood = "#deb887";
    var cadetblue = "#5f9ea0";
    var chartreuse = "#7fff00";
    var chocolate = "#d2691e";
    var coral = "#ff7f50";
    var cornflowerblue = "#6495ed";
    var cornsilk = "#fff8dc";
    var crimson = "#dc143c";
    var cyan = "#00ffff";
    var darkblue = "#00008b";
    var darkcyan = "#008b8b";
    var darkgoldenrod = "#b8860b";
    var darkgray = "#a9a9a9";
    var darkgreen = "#006400";
    var darkgrey = "#a9a9a9";
    var darkkhaki = "#bdb76b";
    var darkmagenta = "#8b008b";
    var darkolivegreen = "#556b2f";
    var darkorange = "#ff8c00";
    var darkorchid = "#9932cc";
    var darkred = "#8b0000";
    var darksalmon = "#e9967a";
    var darkseagreen = "#8fbc8f";
    var darkslateblue = "#483d8b";
    var darkslategray = "#2f4f4f";
    var darkslategrey = "#2f4f4f";
    var darkturquoise = "#00ced1";
    var darkviolet = "#9400d3";
    var deeppink = "#ff1493";
    var deepskyblue = "#00bfff";
    var dimgray = "#696969";
    var dimgrey = "#696969";
    var dodgerblue = "#1e90ff";
    var firebrick = "#b22222";
    var floralwhite = "#fffaf0";
    var forestgreen = "#228b22";
    var fuchsia = "#ff00ff";
    var gainsboro = "#dcdcdc";
    var ghostwhite = "#f8f8ff";
    var gold = "#ffd700";
    var goldenrod = "#daa520";
    var gray = "#808080";
    var green = "#008000";
    var greenyellow = "#adff2f";
    var grey = "#808080";
    var honeydew = "#f0fff0";
    var hotpink = "#ff69b4";
    var indianred = "#cd5c5c";
    var indigo = "#4b0082";
    var ivory = "#fffff0";
    var khaki = "#f0e68c";
    var lavender = "#e6e6fa";
    var lavenderblush = "#fff0f5";
    var lawngreen = "#7cfc00";
    var lemonchiffon = "#fffacd";
    var lightblue = "#add8e6";
    var lightcoral = "#f08080";
    var lightcyan = "#e0ffff";
    var lightgoldenrodyellow = "#fafad2";
    var lightgray = "#d3d3d3";
    var lightgreen = "#90ee90";
    var lightgrey = "#d3d3d3";
    var lightpink = "#ffb6c1";
    var lightsalmon = "#ffa07a";
    var lightseagreen = "#20b2aa";
    var lightskyblue = "#87cefa";
    var lightslategray = "#778899";
    var lightslategrey = "#778899";
    var lightsteelblue = "#b0c4de";
    var lightyellow = "#ffffe0";
    var lime = "#00ff00";
    var limegreen = "#32cd32";
    var linen = "#faf0e6";
    var magenta = "#ff00ff";
    var maroon = "#800000";
    var mediumaquamarine = "#66cdaa";
    var mediumblue = "#0000cd";
    var mediumorchid = "#ba55d3";
    var mediumpurple = "#9370db";
    var mediumseagreen = "#3cb371";
    var mediumslateblue = "#7b68ee";
    var mediumspringgreen = "#00fa9a";
    var mediumturquoise = "#48d1cc";
    var mediumvioletred = "#c71585";
    var midnightblue = "#191970";
    var mintcream = "#f5fffa";
    var mistyrose = "#ffe4e1";
    var moccasin = "#ffe4b5";
    var navajowhite = "#ffdead";
    var navy = "#000080";
    var oldlace = "#fdf5e6";
    var olive = "#808000";
    var olivedrab = "#6b8e23";
    var orange = "#ffa500";
    var orangered = "#ff4500";
    var orchid = "#da70d6";
    var palegoldenrod = "#eee8aa";
    var palegreen = "#98fb98";
    var paleturquoise = "#afeeee";
    var palevioletred = "#db7093";
    var papayawhip = "#ffefd5";
    var peachpuff = "#ffdab9";
    var peru = "#cd853f";
    var pink = "#ffc0cb";
    var plum = "#dda0dd";
    var powderblue = "#b0e0e6";
    var purple = "#800080";
    var rebeccapurple = "#663399";
    var red = "#ff0000";
    var rosybrown = "#bc8f8f";
    var royalblue = "#4169e1";
    var saddlebrown = "#8b4513";
    var salmon = "#fa8072";
    var sandybrown = "#f4a460";
    var seagreen = "#2e8b57";
    var seashell = "#fff5ee";
    var sienna = "#a0522d";
    var silver = "#c0c0c0";
    var skyblue = "#87ceeb";
    var slateblue = "#6a5acd";
    var slategray = "#708090";
    var slategrey = "#708090";
    var snow = "#fffafa";
    var springgreen = "#00ff7f";
    var steelblue = "#4682b4";
    var tan = "#d2b48c";
    var teal = "#008080";
    var thistle = "#d8bfd8";
    var tomato = "#ff6347";
    var turquoise = "#40e0d0";
    var violet = "#ee82ee";
    var wheat = "#f5deb3";
    var white = "#ffffff";
    var whitesmoke = "#f5f5f5";
    var yellow = "#ffff00";
    var yellowgreen = "#9acd32";
    var names = {
    	aliceblue: aliceblue,
    	antiquewhite: antiquewhite,
    	aqua: aqua,
    	aquamarine: aquamarine,
    	azure: azure,
    	beige: beige,
    	bisque: bisque,
    	black: black,
    	blanchedalmond: blanchedalmond,
    	blue: blue,
    	blueviolet: blueviolet,
    	brown: brown,
    	burlywood: burlywood,
    	cadetblue: cadetblue,
    	chartreuse: chartreuse,
    	chocolate: chocolate,
    	coral: coral,
    	cornflowerblue: cornflowerblue,
    	cornsilk: cornsilk,
    	crimson: crimson,
    	cyan: cyan,
    	darkblue: darkblue,
    	darkcyan: darkcyan,
    	darkgoldenrod: darkgoldenrod,
    	darkgray: darkgray,
    	darkgreen: darkgreen,
    	darkgrey: darkgrey,
    	darkkhaki: darkkhaki,
    	darkmagenta: darkmagenta,
    	darkolivegreen: darkolivegreen,
    	darkorange: darkorange,
    	darkorchid: darkorchid,
    	darkred: darkred,
    	darksalmon: darksalmon,
    	darkseagreen: darkseagreen,
    	darkslateblue: darkslateblue,
    	darkslategray: darkslategray,
    	darkslategrey: darkslategrey,
    	darkturquoise: darkturquoise,
    	darkviolet: darkviolet,
    	deeppink: deeppink,
    	deepskyblue: deepskyblue,
    	dimgray: dimgray,
    	dimgrey: dimgrey,
    	dodgerblue: dodgerblue,
    	firebrick: firebrick,
    	floralwhite: floralwhite,
    	forestgreen: forestgreen,
    	fuchsia: fuchsia,
    	gainsboro: gainsboro,
    	ghostwhite: ghostwhite,
    	gold: gold,
    	goldenrod: goldenrod,
    	gray: gray,
    	green: green,
    	greenyellow: greenyellow,
    	grey: grey,
    	honeydew: honeydew,
    	hotpink: hotpink,
    	indianred: indianred,
    	indigo: indigo,
    	ivory: ivory,
    	khaki: khaki,
    	lavender: lavender,
    	lavenderblush: lavenderblush,
    	lawngreen: lawngreen,
    	lemonchiffon: lemonchiffon,
    	lightblue: lightblue,
    	lightcoral: lightcoral,
    	lightcyan: lightcyan,
    	lightgoldenrodyellow: lightgoldenrodyellow,
    	lightgray: lightgray,
    	lightgreen: lightgreen,
    	lightgrey: lightgrey,
    	lightpink: lightpink,
    	lightsalmon: lightsalmon,
    	lightseagreen: lightseagreen,
    	lightskyblue: lightskyblue,
    	lightslategray: lightslategray,
    	lightslategrey: lightslategrey,
    	lightsteelblue: lightsteelblue,
    	lightyellow: lightyellow,
    	lime: lime,
    	limegreen: limegreen,
    	linen: linen,
    	magenta: magenta,
    	maroon: maroon,
    	mediumaquamarine: mediumaquamarine,
    	mediumblue: mediumblue,
    	mediumorchid: mediumorchid,
    	mediumpurple: mediumpurple,
    	mediumseagreen: mediumseagreen,
    	mediumslateblue: mediumslateblue,
    	mediumspringgreen: mediumspringgreen,
    	mediumturquoise: mediumturquoise,
    	mediumvioletred: mediumvioletred,
    	midnightblue: midnightblue,
    	mintcream: mintcream,
    	mistyrose: mistyrose,
    	moccasin: moccasin,
    	navajowhite: navajowhite,
    	navy: navy,
    	oldlace: oldlace,
    	olive: olive,
    	olivedrab: olivedrab,
    	orange: orange,
    	orangered: orangered,
    	orchid: orchid,
    	palegoldenrod: palegoldenrod,
    	palegreen: palegreen,
    	paleturquoise: paleturquoise,
    	palevioletred: palevioletred,
    	papayawhip: papayawhip,
    	peachpuff: peachpuff,
    	peru: peru,
    	pink: pink,
    	plum: plum,
    	powderblue: powderblue,
    	purple: purple,
    	rebeccapurple: rebeccapurple,
    	red: red,
    	rosybrown: rosybrown,
    	royalblue: royalblue,
    	saddlebrown: saddlebrown,
    	salmon: salmon,
    	sandybrown: sandybrown,
    	seagreen: seagreen,
    	seashell: seashell,
    	sienna: sienna,
    	silver: silver,
    	skyblue: skyblue,
    	slateblue: slateblue,
    	slategray: slategray,
    	slategrey: slategrey,
    	snow: snow,
    	springgreen: springgreen,
    	steelblue: steelblue,
    	tan: tan,
    	teal: teal,
    	thistle: thistle,
    	tomato: tomato,
    	turquoise: turquoise,
    	violet: violet,
    	wheat: wheat,
    	white: white,
    	whitesmoke: whitesmoke,
    	yellow: yellow,
    	yellowgreen: yellowgreen
    };

    var floatHsl2rgb = hsl2rgb$1;
    function hsl2rgb$1 (hsl) {
      var h = hsl[0],
        s = hsl[1],
        l = hsl[2],
        t1, t2, t3, rgb, val;

      if (s === 0) {
        val = l;
        return [val, val, val]
      }

      if (l < 0.5) {
        t2 = l * (1 + s);
      } else {
        t2 = l + s - l * s;
      }
      t1 = 2 * l - t2;

      rgb = [0, 0, 0];
      for (var i = 0; i < 3; i++) {
        t3 = h + 1 / 3 * -(i - 1);
        if (t3 < 0) {
          t3++;
        }
        if (t3 > 1) {
          t3--;
        }

        if (6 * t3 < 1) {
          val = t1 + (t2 - t1) * 6 * t3;
        } else if (2 * t3 < 1) {
          val = t2;
        } else if (3 * t3 < 2) {
          val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
        } else {
          val = t1;
        }

        rgb[i] = val;
      }

      return rgb
    }

    var floatRgb2hsl = rgb2hsl$1;
    function rgb2hsl$1 (rgb) {
      var r = rgb[0],
        g = rgb[1],
        b = rgb[2],
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        delta = max - min,
        h, s, l;

      if (max === min) {
        h = 0;
      } else if (r === max) {
        h = (g - b) / delta;
      } else if (g === max) {
        h = 2 + (b - r) / delta;
      } else if (b === max) {
        h = 4 + (r - g) / delta;
      }

      h = Math.min(h * 60, 360);

      if (h < 0) {
        h += 360;
      }

      l = (min + max) / 2;

      if (max === min) {
        s = 0;
      } else if (l <= 0.5) {
        s = delta / (max + min);
      } else {
        s = delta / (2 - max - min);
      }

      return [h / 360, s, l]
    }

    var wrap_1 = wrap;
    function wrap (value, from, to) {
      if (typeof from !== 'number' || typeof to !== 'number') {
        throw new TypeError('Must specify "to" and "from" arguments as numbers');
      }
      // algorithm from http://stackoverflow.com/a/5852628/599884
      if (from > to) {
        var t = from;
        from = to;
        to = t;
      }
      var cycle = to - from;
      if (cycle === 0) {
        return to;
      }
      return value - cycle * Math.floor((value - from) / cycle);
    }

    var RGBAToHSLA_1 = RGBAToHSLA;
    function RGBAToHSLA (rgba) {
      var floatHSL = floatRgb2hsl([ rgba[0] / 255, rgba[1] / 255, rgba[2] / 255 ]);
      return [
        Math.max(0, Math.min(360, Math.round(floatHSL[0] * 360))),
        Math.max(0, Math.min(100, Math.round(floatHSL[1] * 100))),
        Math.max(0, Math.min(100, Math.round(floatHSL[2] * 100))),
        rgba[3]
      ];
    }

    var HSLAToRGBA_1 = HSLAToRGBA;
    function HSLAToRGBA (hsla) {
      var hue = wrap_1(hsla[0], 0, 360);
      var floatRGB = floatHsl2rgb([ hue / 360, hsla[1] / 100, hsla[2] / 100 ]);
      return [
        Math.max(0, Math.min(255, Math.round(floatRGB[0] * 255))),
        Math.max(0, Math.min(255, Math.round(floatRGB[1] * 255))),
        Math.max(0, Math.min(255, Math.round(floatRGB[2] * 255))),
        hsla[3]
      ];
    }

    var hsl = {
    	RGBAToHSLA: RGBAToHSLA_1,
    	HSLAToRGBA: HSLAToRGBA_1
    };

    var hexToRgba = hexToRGBA;
    function hexToRGBA (str) {
      if (typeof str !== 'string') {
        throw new TypeError('Hex code parsing must be performed on a string parameter');
      }

      str = str.toLowerCase();

      if (!/^#[a-f0-9]+$/.test(str)) {
        return null;
      }

      var hex = str.replace(/^#/, '');
      var alpha = 1;

      if (hex.length === 8) {
        alpha = parseInt(hex.slice(6, 8), 16) / 255;
        hex = hex.slice(0, 6);
      }

      if (hex.length === 4) {
        alpha = parseInt(hex.slice(3, 4).repeat(2), 16) / 255;
        hex = hex.slice(0, 3);
      }

      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }

      var num = parseInt(hex, 16);
      var red = num >> 16;
      var green = (num >> 8) & 255;
      var blue = num & 255;

      return [ red, green, blue, alpha ];
    }

    var rgbaToHex_1 = rgbaToHex;
    function rgbaToHex (rgba) {
      if (!rgba || !Array.isArray(rgba)) {
        throw new TypeError('Must specify an array to convert into a hex code');
      }

      var r = Math.max(0, Math.min(255, Math.round(rgba[0] || 0)));
      var g = Math.max(0, Math.min(255, Math.round(rgba[1] || 0)));
      var b = Math.max(0, Math.min(255, Math.round(rgba[2] || 0)));

      var alpha = rgba[3];
      if (typeof alpha === 'undefined' || !isFinite(alpha)) {
        alpha = 1;
      }
      var a = Math.max(0, Math.min(255, Math.round(alpha * 255)));
      var alphaParam = a === 255 ? '' : (a | 1 << 8).toString(16).slice(1);
      var result = ((b | g << 8 | r << 16) | 1 << 24).toString(16).slice(1) + alphaParam;
      return '#' + result;
    }

    var cssColor = createCommonjsModule(function (module) {
    function parseStyle (str) {
      if (typeof str !== 'string') {
        throw new TypeError('Color parsing must be performed on a string parameter');
      }

      str = str.toLowerCase();

      if (str in names) {
        str = names[str];
      } else if (str === 'transparent') {
        str = '#00000000';
      }

      var rgba, hsla, hex;
      if (/^#[a-f0-9]+$/.test(str)) {
        rgba = hexToRgba(str);
        hex = rgbaToHex_1(rgba);
        hsla = hsl.RGBAToHSLA(rgba);
      } else {
        var match = /^((?:rgb|hsl)a?)\s*\(([^)]*)\)/.exec(str);
        if (!match) return null;
        var type = match[1].replace(/a$/, '');
        var parts = match[2].replace(/^\s+|\s+$/g, '').split(/\s*,\s*/).map(function (n, i) {
          // opaque part
          if (i <= 2) return Math.round(parseFloat(n) || 0);
          // alpha part
          else {
            n = parseFloat(n);
            if (typeof n !== 'number' || !isFinite(n)) n = 1;
            return n;
          }
        });
        // fill in alpha with 1.0 by default
        if (typeof parts[3] === 'undefined' || !isFinite(parts[3])) {
          parts[3] = 1;
        }
        if (type === 'rgb') {
          hsla = hsl.RGBAToHSLA(parts);
          rgba = parts;
        } else if (type === 'hsl') {
          rgba = hsl.HSLAToRGBA(parts);
          parts[0] = wrap_1(parts[0], 0, 360);
          hsla = parts;
        }
        hex = rgbaToHex_1(rgba);
      }

      if (!rgba && !hex && !hsla) return null;

      var ret = {
        hex: hex,
        alpha: rgba[3],
        rgb: rgba.slice(0, 3),
        rgba: rgba,
        hsl: hsla.slice(0, 3),
        hsla: hsla
      };

      return ret;
    }

    module.exports.parse = parseColor;
    function parseColor (color) {
      if (typeof color === 'string') {
        return parseStyle(color);
      } else if (Array.isArray(color) && color.length >= 3) {
        var rgbStr = rgbStyle(color[0], color[1], color[2], color[3]);
        return parseStyle(rgbStr);
      } else if (color && typeof color === 'object') {
        var str;
        if (color.hex) str = color.hex;
        else if (color.rgba) str = rgbStyle(color.rgba[0], color.rgba[1], color.rgba[2], color.rgba[3]);
        else if (color.hsla) str = hslStyle(color.hsla[0], color.hsla[1], color.hsla[2], color.hsla[3]);
        else if (color.rgb) str = rgbStyle(color.rgb[0], color.rgb[1], color.rgb[2]);
        else if (color.hsl) str = hslStyle(color.hsl[0], color.hsl[1], color.hsl[2]);
        if (str) return parseStyle(str);
      }
      return null;
    }

    module.exports.style = style;
    function style (color) {
      var result = module.exports.parse(color);
      if (result) {
        var rgba = result.rgba;
        return rgbStyle(rgba[0], rgba[1], rgba[2], rgba[3]);
      }
      return null;
    }

    function rgbStyle (r, g, b, a) {
      r = Math.max(0, Math.min(255, Math.round(r)));
      g = Math.max(0, Math.min(255, Math.round(g)));
      b = Math.max(0, Math.min(255, Math.round(b)));
      if (a === 1 || !isFinite(a) || typeof a === 'undefined') {
        return 'rgb(' + [ r, g, b ].join(', ') + ')';
      } else {
        a = Math.max(0, Math.min(1, a));
        return 'rgba(' + [ r, g, b, a ].join(', ') + ')';
      }
    }

    function hslStyle (h, s, l, a) {
      h = wrap_1(h, 0, 360);
      h = Math.max(0, Math.min(360, Math.round(h)));
      s = Math.max(0, Math.min(100, Math.round(s)));
      l = Math.max(0, Math.min(100, Math.round(l)));
      if (a === 1 || !isFinite(a) || typeof a === 'undefined') {
        return 'hsl(' + [ h, s, l ].join(', ') + ')';
      } else {
        a = Math.max(0, Math.min(1, a));
        return 'hsla(' + [ h, s, l, a ].join(', ') + ')';
      }
    }
    });

    // Extracted from @tmcw / wcag-contrast
    // https://github.com/tmcw/relative-luminance/blob/master/index.js

    // # Relative luminance
    // http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
    // https://en.wikipedia.org/wiki/Luminance_(relative)
    // https://en.wikipedia.org/wiki/Luminosity_function
    // https://en.wikipedia.org/wiki/Rec._709#Luma_coefficients

    // red, green, and blue coefficients
    var rc = 0.2126;
    var gc = 0.7152;
    var bc = 0.0722;
    // low-gamma adjust coefficient
    var lowc = 1 / 12.92;

    function adjustGamma (a) {
      return Math.pow((a + 0.055) / 1.055, 2.4);
    }

    var relativeLuminance_1 = relativeLuminance;
    function relativeLuminance (rgb) {
      var rsrgb = rgb[0] / 255;
      var gsrgb = rgb[1] / 255;
      var bsrgb = rgb[2] / 255;
      var r = rsrgb <= 0.03928 ? rsrgb * lowc : adjustGamma(rsrgb);
      var g = gsrgb <= 0.03928 ? gsrgb * lowc : adjustGamma(gsrgb);
      var b = bsrgb <= 0.03928 ? bsrgb * lowc : adjustGamma(bsrgb);
      return r * rc + g * gc + b * bc;
    }

    var color = createCommonjsModule(function (module) {
    module.exports.parse = cssColor.parse;
    module.exports.style = cssColor.style;
    module.exports.names = names;

    module.exports.relativeLuminance = function relativeLuminance (color) {
      var result = module.exports.parse(color);
      if (!result) return null;
      return relativeLuminance_1(result.rgb);
    };

    // Extracted from @tmcw / wcag-contrast
    // https://github.com/tmcw/wcag-contrast
    module.exports.contrastRatio = function contrastRatio (colorA, colorB) {
      var a = module.exports.relativeLuminance(colorA);
      var b = module.exports.relativeLuminance(colorB);
      if (a == null || b == null) return null;
      var l1 = Math.max(a, b);
      var l2 = Math.min(a, b);
      return (l1 + 0.05) / (l2 + 0.05);
    };

    module.exports.offsetHSL = function (color, h, s, l) {
      var result = module.exports.parse(color);
      if (!result) return null;
      result.hsla[0] += h || 0;
      result.hsla[1] = Math.max(0, Math.min(100, result.hsla[1] + (s || 0)));
      result.hsla[2] = Math.max(0, Math.min(100, result.hsla[2] + (l || 0)));
      return module.exports.parse({ hsla: result.hsla });
    };

    module.exports.blend = function (background, foreground, opacity) {
      var bg = module.exports.parse(background);
      var fg = module.exports.parse(foreground);
      if (bg == null || fg == null) return null;

      var c0 = bg.rgba;
      var c1 = fg.rgba;
      opacity = typeof opacity === 'number' && isFinite(opacity) ? opacity : 1.0;
      var alpha = opacity * c1[3];
      if (alpha >= 1) {
        // foreground is opaque so no blend required
        return fg;
      }
      for (var i = 0; i < 3; i++) {
        c1[i] = c1[i] * alpha + c0[i] * (c0[3] * (1 - alpha));
      }
      c1[3] = Math.max(0, Math.min(1, alpha + c0[3] * (1 - alpha)));
      return module.exports.parse(c1); // re-parse to get new metadata
    };

    // Exposed but not yet documented
    module.exports.hexToRGBA = hexToRgba;
    module.exports.RGBAToHex = rgbaToHex_1;
    module.exports.RGBAToHSLA = hsl.RGBAToHSLA;
    module.exports.HSLAToRGBA = hsl.HSLAToRGBA;
    });

    class SketchParam {
        constructor(name, defaultValue, description = undefined) {
            this.name = name;
            this.value = defaultValue;
            this.defaultValue = defaultValue;
            this.description = description;
        }

        storeValue(parentKey) {
            localStorage.setItem(parentKey + ' ' + this.name, JSON.stringify(this.value));
        }

        restoreValue(parentKey) {
            const storedString = localStorage.getItem(parentKey + ' ' + this.name);
            if (storedString) {
                this.value = JSON.parse(storedString);
            }
        }
    }

    class EventParam extends SketchParam {
        // EventParam values (functions) are always defined within the Sketch
        storeValue() {}
        restoreValue() {}
    }

    class ColorParam extends SketchParam {
        get vec4() {
            const rgba = color.parse(this.value).rgba;
            return [rgba[0]/255, rgba[1]/255, rgba[2]/255, rgba[3]];
        }
    }

    class BoolParam extends SketchParam {
    }

    class FloatParam extends SketchParam {
        constructor(name, defaultValue, minValue, maxValue, stepValue = 0.01, continuousUpdate = true, description = undefined) {
            super(name, defaultValue, description);
            this.min = minValue;
            this.max = maxValue;
            this.step = stepValue;
            this.continuousUpdate = continuousUpdate;
        }
    }

    /* src/Viewer/PresetSelector.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1$1 } = globals;
    const file$2 = "src/Viewer/PresetSelector.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    // (92:16) {:else}
    function create_else_block$1(ctx) {
    	let option;
    	let t_value = /*presetName*/ ctx[16] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*presetName*/ ctx[16];
    			option.value = option.__value;
    			add_location(option, file$2, 92, 20, 2853);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sketch*/ 1 && t_value !== (t_value = /*presetName*/ ctx[16] + "")) set_data_dev(t, t_value);

    			if (dirty & /*sketch*/ 1 && option_value_value !== (option_value_value = /*presetName*/ ctx[16])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(92:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (90:16) {#if presetName === sketch.selectedPresetName}
    function create_if_block$1(ctx) {
    	let option;
    	let t_value = /*presetName*/ ctx[16] + (/*presetModified*/ ctx[2] ? ' *' : '') + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*presetName*/ ctx[16];
    			option.value = option.__value;
    			option.selected = true;
    			add_location(option, file$2, 90, 20, 2720);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sketch, presetModified*/ 5 && t_value !== (t_value = /*presetName*/ ctx[16] + (/*presetModified*/ ctx[2] ? ' *' : '') + "")) set_data_dev(t, t_value);

    			if (dirty & /*sketch*/ 1 && option_value_value !== (option_value_value = /*presetName*/ ctx[16])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(90:16) {#if presetName === sketch.selectedPresetName}",
    		ctx
    	});

    	return block;
    }

    // (89:12) {#each Object.keys(sketch.presets) as presetName}
    function create_each_block$1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*presetName*/ ctx[16] === /*sketch*/ ctx[0].selectedPresetName) return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(89:12) {#each Object.keys(sketch.presets) as presetName}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div9;
    	let div0;
    	let select;
    	let t0;
    	let div8;
    	let div1;
    	let t2;
    	let div7;
    	let div2;
    	let t4;
    	let div3;
    	let t6;
    	let div4;
    	let t8;
    	let div5;
    	let t10;
    	let div6;
    	let mounted;
    	let dispose;
    	let each_value = Object.keys(/*sketch*/ ctx[0].presets);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div0 = element("div");
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div8 = element("div");
    			div1 = element("div");
    			div1.textContent = "⋯";
    			t2 = space();
    			div7 = element("div");
    			div2 = element("div");
    			div2.textContent = "Reset";
    			t4 = space();
    			div3 = element("div");
    			div3.textContent = "Create";
    			t6 = space();
    			div4 = element("div");
    			div4.textContent = "Remove";
    			t8 = space();
    			div5 = element("div");
    			div5.textContent = "Import";
    			t10 = space();
    			div6 = element("div");
    			div6.textContent = "Export";
    			attr_dev(select, "class", "svelte-inpnn4");
    			add_location(select, file$2, 87, 8, 2515);
    			attr_dev(div0, "class", "select_container svelte-inpnn4");
    			add_location(div0, file$2, 86, 4, 2476);
    			attr_dev(div1, "class", "menu_button svelte-inpnn4");
    			add_location(div1, file$2, 99, 8, 3005);
    			attr_dev(div2, "class", "menu_item svelte-inpnn4");
    			toggle_class(div2, "disabled", !/*presetModified*/ ctx[2]);
    			add_location(div2, file$2, 101, 12, 3138);
    			attr_dev(div3, "class", "menu_item svelte-inpnn4");
    			toggle_class(div3, "disabled", !/*presetModified*/ ctx[2]);
    			add_location(div3, file$2, 104, 12, 3272);
    			attr_dev(div4, "class", "menu_item svelte-inpnn4");
    			toggle_class(div4, "disabled", !/*sketch*/ ctx[0].canRemoveSelectedPreset());
    			add_location(div4, file$2, 107, 12, 3408);
    			attr_dev(div5, "class", "menu_item svelte-inpnn4");
    			add_location(div5, file$2, 110, 12, 3562);
    			attr_dev(div6, "class", "menu_item svelte-inpnn4");
    			add_location(div6, file$2, 113, 12, 3665);
    			attr_dev(div7, "class", "menu_content svelte-inpnn4");
    			toggle_class(div7, "open", /*menuVisible*/ ctx[3]);
    			add_location(div7, file$2, 100, 8, 3074);
    			attr_dev(div8, "class", "menu svelte-inpnn4");
    			add_location(div8, file$2, 98, 4, 2978);
    			attr_dev(div9, "class", "preset_selector svelte-inpnn4");
    			add_location(div9, file$2, 85, 0, 2442);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div0);
    			append_dev(div0, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			/*select_binding*/ ctx[12](select);
    			append_dev(div9, t0);
    			append_dev(div9, div8);
    			append_dev(div8, div1);
    			append_dev(div8, t2);
    			append_dev(div8, div7);
    			append_dev(div7, div2);
    			append_dev(div7, t4);
    			append_dev(div7, div3);
    			append_dev(div7, t6);
    			append_dev(div7, div4);
    			append_dev(div7, t8);
    			append_dev(div7, div5);
    			append_dev(div7, t10);
    			append_dev(div7, div6);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*selectPreset*/ ctx[4], false, false, false),
    					listen_dev(div1, "click", /*toggleMenu*/ ctx[5], false, false, false),
    					listen_dev(div2, "click", /*resetClicked*/ ctx[6], false, false, false),
    					listen_dev(div3, "click", /*createClicked*/ ctx[7], false, false, false),
    					listen_dev(div4, "click", /*removeClicked*/ ctx[8], false, false, false),
    					listen_dev(div5, "click", /*importClicked*/ ctx[9], false, false, false),
    					listen_dev(div6, "click", /*exportClicked*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Object, sketch, presetModified*/ 5) {
    				each_value = Object.keys(/*sketch*/ ctx[0].presets);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*presetModified*/ 4) {
    				toggle_class(div2, "disabled", !/*presetModified*/ ctx[2]);
    			}

    			if (dirty & /*presetModified*/ 4) {
    				toggle_class(div3, "disabled", !/*presetModified*/ ctx[2]);
    			}

    			if (dirty & /*sketch*/ 1) {
    				toggle_class(div4, "disabled", !/*sketch*/ ctx[0].canRemoveSelectedPreset());
    			}

    			if (dirty & /*menuVisible*/ 8) {
    				toggle_class(div7, "open", /*menuVisible*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			destroy_each(each_blocks, detaching);
    			/*select_binding*/ ctx[12](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PresetSelector', slots, []);
    	let { sketch = undefined } = $$props;
    	let selectElement = undefined;
    	let presetModified = false;
    	let menuVisible = false;

    	/* Selection & state management */
    	// Dispatch selection event
    	const dispatch = createEventDispatcher();

    	function selectPreset(selection) {
    		const presetName = selection instanceof Event
    		? selectElement.value
    		: selection;

    		dispatch('selection', { name: presetName });
    	}

    	// Update modified asterisk when parameters are updated
    	onMount(paramsUpdated);

    	function paramsUpdated() {
    		// Tricky to use Svelte reactivity here, so update function it is
    		$$invalidate(2, presetModified = sketch.presetModified);
    	}

    	/* Menu visibility */
    	// Show & hide the preset actions menu
    	function showMenu() {
    		$$invalidate(3, menuVisible = true);
    	}

    	function hideMenu() {
    		$$invalidate(3, menuVisible = false);
    	}

    	function toggleMenu() {
    		$$invalidate(3, menuVisible = !menuVisible);
    	}

    	// Close menu when clicking outside of it
    	window.addEventListener('mousedown', function (event) {
    		if (menuVisible && !event.target.classList.contains('menu_item') && !event.target.classList.contains('menu_button')) {
    			hideMenu();
    		}
    	});

    	/* Button click events */
    	function resetClicked() {
    		if (presetModified) {
    			hideMenu();
    			selectPreset(selectElement.value);
    		}
    	}

    	function createClicked() {
    		if (presetModified) {
    			hideMenu();
    			const newPresetName = sketch.createPreset();
    			selectPreset(newPresetName);
    		}
    	}

    	function removeClicked() {
    		if (sketch.canRemoveSelectedPreset()) {
    			hideMenu();
    			sketch.removeSelectedPreset();
    			selectPreset(sketch.defaultPresetName);
    		}
    	}

    	function importClicked() {
    		hideMenu();

    		sketch.importPreset().then(presetName => {
    			selectPreset(presetName);
    		}).catch(errorMessage => {
    			if (!errorMessage.name || errorMessage.name != 'AbortError') {
    				// The user did not cancel, and there was an error nonetheless
    				const message = errorMessage.message ?? errorMessage;

    				alert(message);
    			}
    		});
    	}

    	function exportClicked() {
    		hideMenu();
    		sketch.exportPreset();
    	}

    	const writable_props = ['sketch'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PresetSelector> was created with unknown prop '${key}'`);
    	});

    	function select_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			selectElement = $$value;
    			$$invalidate(1, selectElement);
    			$$invalidate(0, sketch);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('sketch' in $$props) $$invalidate(0, sketch = $$props.sketch);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onMount,
    		sketch,
    		selectElement,
    		presetModified,
    		menuVisible,
    		dispatch,
    		selectPreset,
    		paramsUpdated,
    		showMenu,
    		hideMenu,
    		toggleMenu,
    		resetClicked,
    		createClicked,
    		removeClicked,
    		importClicked,
    		exportClicked
    	});

    	$$self.$inject_state = $$props => {
    		if ('sketch' in $$props) $$invalidate(0, sketch = $$props.sketch);
    		if ('selectElement' in $$props) $$invalidate(1, selectElement = $$props.selectElement);
    		if ('presetModified' in $$props) $$invalidate(2, presetModified = $$props.presetModified);
    		if ('menuVisible' in $$props) $$invalidate(3, menuVisible = $$props.menuVisible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		sketch,
    		selectElement,
    		presetModified,
    		menuVisible,
    		selectPreset,
    		toggleMenu,
    		resetClicked,
    		createClicked,
    		removeClicked,
    		importClicked,
    		exportClicked,
    		paramsUpdated,
    		select_binding
    	];
    }

    class PresetSelector extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { sketch: 0, paramsUpdated: 11 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PresetSelector",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get sketch() {
    		throw new Error("<PresetSelector>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sketch(value) {
    		throw new Error("<PresetSelector>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get paramsUpdated() {
    		return this.$$.ctx[11];
    	}

    	set paramsUpdated(value) {
    		throw new Error("<PresetSelector>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Viewer/RightPanel.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1 } = globals;
    const file$1 = "src/Viewer/RightPanel.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[18] = list;
    	child_ctx[19] = i;
    	return child_ctx;
    }

    // (39:8) 
    function create_title_slot(ctx) {
    	let span;
    	let t_value = /*sketch*/ ctx[0].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "slot", "title");
    			add_location(span, file$1, 38, 8, 1420);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sketch*/ 1 && t_value !== (t_value = /*sketch*/ ctx[0].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_title_slot.name,
    		type: "slot",
    		source: "(39:8) ",
    		ctx
    	});

    	return block;
    }

    // (48:12) {:else}
    function create_else_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("[Work in Progress]");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(48:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (43:12) {#if sketch.date}
    function create_if_block_8(ctx) {
    	let t_value = /*sketch*/ ctx[0].date.toLocaleDateString('en-us', { year: 'numeric', month: 'long' }) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sketch*/ 1 && t_value !== (t_value = /*sketch*/ ctx[0].date.toLocaleDateString('en-us', { year: 'numeric', month: 'long' }) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(43:12) {#if sketch.date}",
    		ctx
    	});

    	return block;
    }

    // (42:8) 
    function create_subtitle_slot(ctx) {
    	let span;

    	function select_block_type_1(ctx, dirty) {
    		if (/*sketch*/ ctx[0].date) return create_if_block_8;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if_block.c();
    			attr_dev(span, "slot", "subtitle");
    			add_location(span, file$1, 41, 8, 1490);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			if_block.m(span, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(span, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_subtitle_slot.name,
    		type: "slot",
    		source: "(42:8) ",
    		ctx
    	});

    	return block;
    }

    // (55:12) {:else}
    function create_else_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("▿");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(55:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (53:12) {#if open}
    function create_if_block_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("▾");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(53:12) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (52:8) 
    function create_click_to_expand_slot(ctx) {
    	let span;

    	function select_block_type(ctx, dirty) {
    		if (/*open*/ ctx[20]) return create_if_block_7;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if_block.c();
    			attr_dev(span, "slot", "click_to_expand");
    			add_location(span, file$1, 51, 8, 1790);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			if_block.m(span, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(span, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_click_to_expand_slot.name,
    		type: "slot",
    		source: "(52:8) ",
    		ctx
    	});

    	return block;
    }

    // (60:12) {#if sketch.description}
    function create_if_block_6(ctx) {
    	let html_tag;
    	let raw_value = /*sketch*/ ctx[0].description.trim() + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sketch*/ 1 && raw_value !== (raw_value = /*sketch*/ ctx[0].description.trim() + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(60:12) {#if sketch.description}",
    		ctx
    	});

    	return block;
    }

    // (59:8) 
    function create_contents_slot(ctx) {
    	let span;
    	let if_block = /*sketch*/ ctx[0].description && create_if_block_6(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "slot", "contents");
    			add_location(span, file$1, 58, 8, 1968);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			if (if_block) if_block.m(span, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*sketch*/ ctx[0].description) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_6(ctx);
    					if_block.c();
    					if_block.m(span, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_contents_slot.name,
    		type: "slot",
    		source: "(59:8) ",
    		ctx
    	});

    	return block;
    }

    // (66:4) {#if sketch.showPresets}
    function create_if_block_5(ctx) {
    	let presetselector;
    	let current;
    	let presetselector_props = { sketch: /*sketch*/ ctx[0] };

    	presetselector = new PresetSelector({
    			props: presetselector_props,
    			$$inline: true
    		});

    	/*presetselector_binding*/ ctx[7](presetselector);
    	presetselector.$on("selection", /*presetSelected*/ ctx[5]);

    	const block = {
    		c: function create() {
    			create_component(presetselector.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(presetselector, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const presetselector_changes = {};
    			if (dirty & /*sketch*/ 1) presetselector_changes.sketch = /*sketch*/ ctx[0];
    			presetselector.$set(presetselector_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(presetselector.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(presetselector.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*presetselector_binding*/ ctx[7](null);
    			destroy_component(presetselector, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(66:4) {#if sketch.showPresets}",
    		ctx
    	});

    	return block;
    }

    // (74:4) {#if sketch.params && Object.values(sketch.params).length > 0}
    function create_if_block(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = Object.values(/*sketch*/ ctx[0].params);
    	validate_each_argument(each_value);
    	const get_key = ctx => /*sketch*/ ctx[0].name + /*param*/ ctx[17].name;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "id", "params_container");
    			attr_dev(div, "class", "svelte-2enph");
    			add_location(div, file$1, 74, 8, 2391);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Object, sketch, labelBasis, labelWidths, updateSketch, FloatParam, BoolParam, ColorParam, EventParam*/ 27) {
    				each_value = Object.values(/*sketch*/ ctx[0].params);
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block, null, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(74:4) {#if sketch.params && Object.values(sketch.params).length > 0}",
    		ctx
    	});

    	return block;
    }

    // (110:56) 
    function create_if_block_4(ctx) {
    	let eventinput;
    	let updating_labelWidth;
    	let updating_value;
    	let current;

    	function eventinput_labelWidth_binding(value) {
    		/*eventinput_labelWidth_binding*/ ctx[14](value, /*index*/ ctx[19]);
    	}

    	function eventinput_value_binding(value) {
    		/*eventinput_value_binding*/ ctx[15](value, /*param*/ ctx[17]);
    	}

    	let eventinput_props = {
    		label: /*param*/ ctx[17].name,
    		title: /*param*/ ctx[17].description,
    		labelBasis: /*labelBasis*/ ctx[3]
    	};

    	if (/*labelWidths*/ ctx[1][/*index*/ ctx[19]] !== void 0) {
    		eventinput_props.labelWidth = /*labelWidths*/ ctx[1][/*index*/ ctx[19]];
    	}

    	if (/*param*/ ctx[17].value !== void 0) {
    		eventinput_props.value = /*param*/ ctx[17].value;
    	}

    	eventinput = new EventInput({ props: eventinput_props, $$inline: true });
    	binding_callbacks.push(() => bind(eventinput, 'labelWidth', eventinput_labelWidth_binding));
    	binding_callbacks.push(() => bind(eventinput, 'value', eventinput_value_binding));
    	eventinput.$on("click", /*updateSketch*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(eventinput.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(eventinput, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const eventinput_changes = {};
    			if (dirty & /*Object, sketch*/ 1) eventinput_changes.label = /*param*/ ctx[17].name;
    			if (dirty & /*Object, sketch*/ 1) eventinput_changes.title = /*param*/ ctx[17].description;
    			if (dirty & /*labelBasis*/ 8) eventinput_changes.labelBasis = /*labelBasis*/ ctx[3];

    			if (!updating_labelWidth && dirty & /*labelWidths, Object, sketch*/ 3) {
    				updating_labelWidth = true;
    				eventinput_changes.labelWidth = /*labelWidths*/ ctx[1][/*index*/ ctx[19]];
    				add_flush_callback(() => updating_labelWidth = false);
    			}

    			if (!updating_value && dirty & /*Object, sketch*/ 1) {
    				updating_value = true;
    				eventinput_changes.value = /*param*/ ctx[17].value;
    				add_flush_callback(() => updating_value = false);
    			}

    			eventinput.$set(eventinput_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(eventinput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(eventinput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(eventinput, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(110:56) ",
    		ctx
    	});

    	return block;
    }

    // (100:56) 
    function create_if_block_3(ctx) {
    	let colorinput;
    	let updating_labelWidth;
    	let updating_value;
    	let current;

    	function colorinput_labelWidth_binding(value) {
    		/*colorinput_labelWidth_binding*/ ctx[12](value, /*index*/ ctx[19]);
    	}

    	function colorinput_value_binding(value) {
    		/*colorinput_value_binding*/ ctx[13](value, /*param*/ ctx[17]);
    	}

    	let colorinput_props = {
    		label: /*param*/ ctx[17].name,
    		title: /*param*/ ctx[17].description,
    		labelBasis: /*labelBasis*/ ctx[3]
    	};

    	if (/*labelWidths*/ ctx[1][/*index*/ ctx[19]] !== void 0) {
    		colorinput_props.labelWidth = /*labelWidths*/ ctx[1][/*index*/ ctx[19]];
    	}

    	if (/*param*/ ctx[17].value !== void 0) {
    		colorinput_props.value = /*param*/ ctx[17].value;
    	}

    	colorinput = new ColorInput({ props: colorinput_props, $$inline: true });
    	binding_callbacks.push(() => bind(colorinput, 'labelWidth', colorinput_labelWidth_binding));
    	binding_callbacks.push(() => bind(colorinput, 'value', colorinput_value_binding));
    	colorinput.$on("input", /*updateSketch*/ ctx[4]);
    	colorinput.$on("change", /*updateSketch*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(colorinput.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(colorinput, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const colorinput_changes = {};
    			if (dirty & /*Object, sketch*/ 1) colorinput_changes.label = /*param*/ ctx[17].name;
    			if (dirty & /*Object, sketch*/ 1) colorinput_changes.title = /*param*/ ctx[17].description;
    			if (dirty & /*labelBasis*/ 8) colorinput_changes.labelBasis = /*labelBasis*/ ctx[3];

    			if (!updating_labelWidth && dirty & /*labelWidths, Object, sketch*/ 3) {
    				updating_labelWidth = true;
    				colorinput_changes.labelWidth = /*labelWidths*/ ctx[1][/*index*/ ctx[19]];
    				add_flush_callback(() => updating_labelWidth = false);
    			}

    			if (!updating_value && dirty & /*Object, sketch*/ 1) {
    				updating_value = true;
    				colorinput_changes.value = /*param*/ ctx[17].value;
    				add_flush_callback(() => updating_value = false);
    			}

    			colorinput.$set(colorinput_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(colorinput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(colorinput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(colorinput, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(100:56) ",
    		ctx
    	});

    	return block;
    }

    // (90:55) 
    function create_if_block_2(ctx) {
    	let checkboxinput;
    	let updating_labelWidth;
    	let updating_value;
    	let current;

    	function checkboxinput_labelWidth_binding(value) {
    		/*checkboxinput_labelWidth_binding*/ ctx[10](value, /*index*/ ctx[19]);
    	}

    	function checkboxinput_value_binding(value) {
    		/*checkboxinput_value_binding*/ ctx[11](value, /*param*/ ctx[17]);
    	}

    	let checkboxinput_props = {
    		label: /*param*/ ctx[17].name,
    		title: /*param*/ ctx[17].description,
    		labelBasis: /*labelBasis*/ ctx[3]
    	};

    	if (/*labelWidths*/ ctx[1][/*index*/ ctx[19]] !== void 0) {
    		checkboxinput_props.labelWidth = /*labelWidths*/ ctx[1][/*index*/ ctx[19]];
    	}

    	if (/*param*/ ctx[17].value !== void 0) {
    		checkboxinput_props.value = /*param*/ ctx[17].value;
    	}

    	checkboxinput = new CheckboxInput({
    			props: checkboxinput_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(checkboxinput, 'labelWidth', checkboxinput_labelWidth_binding));
    	binding_callbacks.push(() => bind(checkboxinput, 'value', checkboxinput_value_binding));
    	checkboxinput.$on("input", /*updateSketch*/ ctx[4]);
    	checkboxinput.$on("change", /*updateSketch*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(checkboxinput.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkboxinput, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const checkboxinput_changes = {};
    			if (dirty & /*Object, sketch*/ 1) checkboxinput_changes.label = /*param*/ ctx[17].name;
    			if (dirty & /*Object, sketch*/ 1) checkboxinput_changes.title = /*param*/ ctx[17].description;
    			if (dirty & /*labelBasis*/ 8) checkboxinput_changes.labelBasis = /*labelBasis*/ ctx[3];

    			if (!updating_labelWidth && dirty & /*labelWidths, Object, sketch*/ 3) {
    				updating_labelWidth = true;
    				checkboxinput_changes.labelWidth = /*labelWidths*/ ctx[1][/*index*/ ctx[19]];
    				add_flush_callback(() => updating_labelWidth = false);
    			}

    			if (!updating_value && dirty & /*Object, sketch*/ 1) {
    				updating_value = true;
    				checkboxinput_changes.value = /*param*/ ctx[17].value;
    				add_flush_callback(() => updating_value = false);
    			}

    			checkboxinput.$set(checkboxinput_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkboxinput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkboxinput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(checkboxinput, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(90:55) ",
    		ctx
    	});

    	return block;
    }

    // (77:16) {#if (param instanceof FloatParam)}
    function create_if_block_1(ctx) {
    	let sliderinput;
    	let updating_labelWidth;
    	let updating_value;
    	let current;

    	function sliderinput_labelWidth_binding(value) {
    		/*sliderinput_labelWidth_binding*/ ctx[8](value, /*index*/ ctx[19]);
    	}

    	function sliderinput_value_binding(value) {
    		/*sliderinput_value_binding*/ ctx[9](value, /*param*/ ctx[17]);
    	}

    	let sliderinput_props = {
    		label: /*param*/ ctx[17].name,
    		title: /*param*/ ctx[17].description,
    		labelBasis: /*labelBasis*/ ctx[3],
    		min: /*param*/ ctx[17].min,
    		max: /*param*/ ctx[17].max,
    		step: /*param*/ ctx[17].step
    	};

    	if (/*labelWidths*/ ctx[1][/*index*/ ctx[19]] !== void 0) {
    		sliderinput_props.labelWidth = /*labelWidths*/ ctx[1][/*index*/ ctx[19]];
    	}

    	if (/*param*/ ctx[17].value !== void 0) {
    		sliderinput_props.value = /*param*/ ctx[17].value;
    	}

    	sliderinput = new SliderInput({ props: sliderinput_props, $$inline: true });
    	binding_callbacks.push(() => bind(sliderinput, 'labelWidth', sliderinput_labelWidth_binding));
    	binding_callbacks.push(() => bind(sliderinput, 'value', sliderinput_value_binding));

    	sliderinput.$on("input", function () {
    		if (is_function(/*param*/ ctx[17].continuousUpdate
    		? /*updateSketch*/ ctx[4]
    		: null)) (/*param*/ ctx[17].continuousUpdate
    		? /*updateSketch*/ ctx[4]
    		: null).apply(this, arguments);
    	});

    	sliderinput.$on("change", /*updateSketch*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(sliderinput.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sliderinput, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const sliderinput_changes = {};
    			if (dirty & /*Object, sketch*/ 1) sliderinput_changes.label = /*param*/ ctx[17].name;
    			if (dirty & /*Object, sketch*/ 1) sliderinput_changes.title = /*param*/ ctx[17].description;
    			if (dirty & /*labelBasis*/ 8) sliderinput_changes.labelBasis = /*labelBasis*/ ctx[3];
    			if (dirty & /*Object, sketch*/ 1) sliderinput_changes.min = /*param*/ ctx[17].min;
    			if (dirty & /*Object, sketch*/ 1) sliderinput_changes.max = /*param*/ ctx[17].max;
    			if (dirty & /*Object, sketch*/ 1) sliderinput_changes.step = /*param*/ ctx[17].step;

    			if (!updating_labelWidth && dirty & /*labelWidths, Object, sketch*/ 3) {
    				updating_labelWidth = true;
    				sliderinput_changes.labelWidth = /*labelWidths*/ ctx[1][/*index*/ ctx[19]];
    				add_flush_callback(() => updating_labelWidth = false);
    			}

    			if (!updating_value && dirty & /*Object, sketch*/ 1) {
    				updating_value = true;
    				sliderinput_changes.value = /*param*/ ctx[17].value;
    				add_flush_callback(() => updating_value = false);
    			}

    			sliderinput.$set(sliderinput_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sliderinput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sliderinput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sliderinput, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(77:16) {#if (param instanceof FloatParam)}",
    		ctx
    	});

    	return block;
    }

    // (76:12) {#each Object.values(sketch.params) as param, index (sketch.name + param.name)}
    function create_each_block(key_1, ctx) {
    	let first;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_if_block_2, create_if_block_3, create_if_block_4];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*param*/ ctx[17] instanceof FloatParam) return 0;
    		if (/*param*/ ctx[17] instanceof BoolParam) return 1;
    		if (/*param*/ ctx[17] instanceof ColorParam) return 2;
    		if (/*param*/ ctx[17] instanceof EventParam) return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type_2(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(76:12) {#each Object.values(sketch.params) as param, index (sketch.name + param.name)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let panelheader;
    	let t0;
    	let t1;
    	let show_if = /*sketch*/ ctx[0].params && Object.values(/*sketch*/ ctx[0].params).length > 0;
    	let current;

    	panelheader = new PanelHeader({
    			props: {
    				id: /*sketch*/ ctx[0].name,
    				openDefault: true,
    				showContents: !!/*sketch*/ ctx[0].description,
    				$$slots: {
    					contents: [create_contents_slot],
    					click_to_expand: [
    						create_click_to_expand_slot,
    						({ open }) => ({ 20: open }),
    						({ open }) => open ? 1048576 : 0
    					],
    					subtitle: [create_subtitle_slot],
    					title: [create_title_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*sketch*/ ctx[0].showPresets && create_if_block_5(ctx);
    	let if_block1 = show_if && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(panelheader.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "id", "panel_container");
    			attr_dev(div, "class", "svelte-2enph");
    			add_location(div, file$1, 36, 0, 1295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(panelheader, div, null);
    			append_dev(div, t0);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t1);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const panelheader_changes = {};
    			if (dirty & /*sketch*/ 1) panelheader_changes.id = /*sketch*/ ctx[0].name;
    			if (dirty & /*sketch*/ 1) panelheader_changes.showContents = !!/*sketch*/ ctx[0].description;

    			if (dirty & /*$$scope, sketch, open*/ 3145729) {
    				panelheader_changes.$$scope = { dirty, ctx };
    			}

    			panelheader.$set(panelheader_changes);

    			if (/*sketch*/ ctx[0].showPresets) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*sketch*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*sketch, Object*/ 1) show_if = /*sketch*/ ctx[0].params && Object.values(/*sketch*/ ctx[0].params).length > 0;

    			if (show_if) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*sketch, Object*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(panelheader.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(panelheader.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(panelheader);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let paramCount;
    	let labelBasis;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RightPanel', slots, []);
    	let { sketch } = $$props;
    	const dispatch = createEventDispatcher();
    	let presetSelector = undefined;
    	let labelWidths = new Array();

    	function updateSketch(event) {
    		dispatch('update', {
    			incomplete: event && event.type !== 'change'
    		});

    		if (presetSelector) {
    			presetSelector.paramsUpdated();
    		}
    	}

    	function presetSelected(event) {
    		const selectedPresetName = event.detail.name;
    		sketch.selectPreset(selectedPresetName);
    		$$invalidate(0, sketch); // Svelte reactivity: update UI
    		updateSketch();
    	}

    	const writable_props = ['sketch'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RightPanel> was created with unknown prop '${key}'`);
    	});

    	function presetselector_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			presetSelector = $$value;
    			$$invalidate(2, presetSelector);
    		});
    	}

    	function sliderinput_labelWidth_binding(value, index) {
    		if ($$self.$$.not_equal(labelWidths[index], value)) {
    			labelWidths[index] = value;
    			$$invalidate(1, labelWidths);
    		}
    	}

    	function sliderinput_value_binding(value, param) {
    		if ($$self.$$.not_equal(param.value, value)) {
    			param.value = value;
    		}
    	}

    	function checkboxinput_labelWidth_binding(value, index) {
    		if ($$self.$$.not_equal(labelWidths[index], value)) {
    			labelWidths[index] = value;
    			$$invalidate(1, labelWidths);
    		}
    	}

    	function checkboxinput_value_binding(value, param) {
    		if ($$self.$$.not_equal(param.value, value)) {
    			param.value = value;
    		}
    	}

    	function colorinput_labelWidth_binding(value, index) {
    		if ($$self.$$.not_equal(labelWidths[index], value)) {
    			labelWidths[index] = value;
    			$$invalidate(1, labelWidths);
    		}
    	}

    	function colorinput_value_binding(value, param) {
    		if ($$self.$$.not_equal(param.value, value)) {
    			param.value = value;
    		}
    	}

    	function eventinput_labelWidth_binding(value, index) {
    		if ($$self.$$.not_equal(labelWidths[index], value)) {
    			labelWidths[index] = value;
    			$$invalidate(1, labelWidths);
    		}
    	}

    	function eventinput_value_binding(value, param) {
    		if ($$self.$$.not_equal(param.value, value)) {
    			param.value = value;
    		}
    	}

    	$$self.$$set = $$props => {
    		if ('sketch' in $$props) $$invalidate(0, sketch = $$props.sketch);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		SliderInput,
    		ColorInput,
    		CheckboxInput,
    		EventInput,
    		ColorParam,
    		FloatParam,
    		BoolParam,
    		EventParam,
    		PanelHeader,
    		PresetSelector,
    		sketch,
    		dispatch,
    		presetSelector,
    		labelWidths,
    		updateSketch,
    		presetSelected,
    		paramCount,
    		labelBasis
    	});

    	$$self.$inject_state = $$props => {
    		if ('sketch' in $$props) $$invalidate(0, sketch = $$props.sketch);
    		if ('presetSelector' in $$props) $$invalidate(2, presetSelector = $$props.presetSelector);
    		if ('labelWidths' in $$props) $$invalidate(1, labelWidths = $$props.labelWidths);
    		if ('paramCount' in $$props) $$invalidate(6, paramCount = $$props.paramCount);
    		if ('labelBasis' in $$props) $$invalidate(3, labelBasis = $$props.labelBasis);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*Object, sketch*/ 1) {
    			$$invalidate(6, paramCount = Object.keys(sketch.params).length);
    		}

    		if ($$self.$$.dirty & /*labelWidths, paramCount*/ 66) {
    			$$invalidate(3, labelBasis = Math.min(Math.max(...labelWidths.slice(0, paramCount)) + 1, 200).toString() + 'px');
    		}
    	};

    	return [
    		sketch,
    		labelWidths,
    		presetSelector,
    		labelBasis,
    		updateSketch,
    		presetSelected,
    		paramCount,
    		presetselector_binding,
    		sliderinput_labelWidth_binding,
    		sliderinput_value_binding,
    		checkboxinput_labelWidth_binding,
    		checkboxinput_value_binding,
    		colorinput_labelWidth_binding,
    		colorinput_value_binding,
    		eventinput_labelWidth_binding,
    		eventinput_value_binding
    	];
    }

    class RightPanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { sketch: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RightPanel",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sketch*/ ctx[0] === undefined && !('sketch' in props)) {
    			console.warn("<RightPanel> was created without expected prop 'sketch'");
    		}
    	}

    	get sketch() {
    		throw new Error("<RightPanel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sketch(value) {
    		throw new Error("<RightPanel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const e=(()=>{if("undefined"==typeof self)return !1;if("top"in self&&self!==top)try{top;}catch(e){return !1}else if("showOpenFilePicker"in self)return "showOpenFilePicker";return !1})(),t=e?Promise.resolve().then(function(){return l}):Promise.resolve().then(function(){return h});async function n(...e){return (await t).default(...e)}e?Promise.resolve().then(function(){return y}):Promise.resolve().then(function(){return P});const a=e?Promise.resolve().then(function(){return m}):Promise.resolve().then(function(){return k});async function o(...e){return (await a).default(...e)}const s=async e=>{const t=await e.getFile();return t.handle=e,t};var c=async(e=[{}])=>{Array.isArray(e)||(e=[e]);const t=[];e.forEach((e,n)=>{t[n]={description:e.description||"Files",accept:{}},e.mimeTypes?e.mimeTypes.map(r=>{t[n].accept[r]=e.extensions||[];}):t[n].accept["*/*"]=e.extensions||[];});const n=await window.showOpenFilePicker({id:e[0].id,startIn:e[0].startIn,types:t,multiple:e[0].multiple||!1,excludeAcceptAllOption:e[0].excludeAcceptAllOption||!1}),r=await Promise.all(n.map(s));return e[0].multiple?r:r[0]},l={__proto__:null,default:c};function u(e){function t(e){if(Object(e)!==e)return Promise.reject(new TypeError(e+" is not an object."));var t=e.done;return Promise.resolve(e.value).then(function(e){return {value:e,done:t}})}return u=function(e){this.s=e,this.n=e.next;},u.prototype={s:null,n:null,next:function(){return t(this.n.apply(this.s,arguments))},return:function(e){var n=this.s.return;return void 0===n?Promise.resolve({value:e,done:!0}):t(n.apply(this.s,arguments))},throw:function(e){var n=this.s.return;return void 0===n?Promise.reject(e):t(n.apply(this.s,arguments))}},new u(e)}const p=async(e,t,n=e.name,r)=>{const i=[],a=[];var o,s=!1,c=!1;try{for(var l,d=function(e){var t,n,r,i=2;for("undefined"!=typeof Symbol&&(n=Symbol.asyncIterator,r=Symbol.iterator);i--;){if(n&&null!=(t=e[n]))return t.call(e);if(r&&null!=(t=e[r]))return new u(t.call(e));n="@@asyncIterator",r="@@iterator";}throw new TypeError("Object is not async iterable")}(e.values());s=!(l=await d.next()).done;s=!1){const o=l.value,s=`${n}/${o.name}`;"file"===o.kind?a.push(o.getFile().then(t=>(t.directoryHandle=e,t.handle=o,Object.defineProperty(t,"webkitRelativePath",{configurable:!0,enumerable:!0,get:()=>s})))):"directory"!==o.kind||!t||r&&r(o)||i.push(p(o,t,s,r));}}catch(e){c=!0,o=e;}finally{try{s&&null!=d.return&&await d.return();}finally{if(c)throw o}}return [...(await Promise.all(i)).flat(),...await Promise.all(a)]};var d=async(e={})=>{e.recursive=e.recursive||!1,e.mode=e.mode||"read";const t=await window.showDirectoryPicker({id:e.id,startIn:e.startIn,mode:e.mode});return p(t,e.recursive,void 0,e.skipDirectory)},y={__proto__:null,default:d},f=async(e,t=[{}],n=null,r=!1,i=null)=>{Array.isArray(t)||(t=[t]),t[0].fileName=t[0].fileName||"Untitled";const a=[];let o=null;if(e instanceof Blob&&e.type?o=e.type:e.headers&&e.headers.get("content-type")&&(o=e.headers.get("content-type")),t.forEach((e,t)=>{a[t]={description:e.description||"Files",accept:{}},e.mimeTypes?(0===t&&o&&e.mimeTypes.push(o),e.mimeTypes.map(n=>{a[t].accept[n]=e.extensions||[];})):o?a[t].accept[o]=e.extensions||[]:a[t].accept["*/*"]=e.extensions||[];}),n)try{await n.getFile();}catch(e){if(n=null,r)throw e}const s=n||await window.showSaveFilePicker({suggestedName:t[0].fileName,id:t[0].id,startIn:t[0].startIn,types:a,excludeAcceptAllOption:t[0].excludeAcceptAllOption||!1});!n&&i&&i(s);const c=await s.createWritable();if("stream"in e){const t=e.stream();return await t.pipeTo(c),s}return "body"in e?(await e.body.pipeTo(c),s):(await c.write(await e),await c.close(),s)},m={__proto__:null,default:f},w=async(e=[{}])=>(Array.isArray(e)||(e=[e]),new Promise((t,n)=>{const r=document.createElement("input");r.type="file";const i=[...e.map(e=>e.mimeTypes||[]),...e.map(e=>e.extensions||[])].join();r.multiple=e[0].multiple||!1,r.accept=i||"",r.style.display="none",document.body.append(r);const a=e=>{"function"==typeof o&&o(),t(e);},o=e[0].legacySetup&&e[0].legacySetup(a,()=>o(n),r),s=()=>{window.removeEventListener("focus",s),r.remove();};r.addEventListener("click",()=>{window.addEventListener("focus",s);}),r.addEventListener("change",()=>{window.removeEventListener("focus",s),r.remove(),a(r.multiple?Array.from(r.files):r.files[0]);}),"showPicker"in HTMLInputElement.prototype?r.showPicker():r.click();})),h={__proto__:null,default:w},v=async(e=[{}])=>(Array.isArray(e)||(e=[e]),e[0].recursive=e[0].recursive||!1,new Promise((t,n)=>{const r=document.createElement("input");r.type="file",r.webkitdirectory=!0;const i=e=>{"function"==typeof a&&a(),t(e);},a=e[0].legacySetup&&e[0].legacySetup(i,()=>a(n),r);r.addEventListener("change",()=>{let t=Array.from(r.files);e[0].recursive?e[0].recursive&&e[0].skipDirectory&&(t=t.filter(t=>t.webkitRelativePath.split("/").every(t=>!e[0].skipDirectory({name:t,kind:"directory"})))):t=t.filter(e=>2===e.webkitRelativePath.split("/").length),i(t);}),"showPicker"in HTMLInputElement.prototype?r.showPicker():r.click();})),P={__proto__:null,default:v},b$1=async(e,t={})=>{Array.isArray(t)&&(t=t[0]);const n=document.createElement("a");let r=e;"body"in e&&(r=await async function(e,t){const n=e.getReader(),r=new ReadableStream({start:e=>async function t(){return n.read().then(({done:n,value:r})=>{if(!n)return e.enqueue(r),t();e.close();})}()}),i=new Response(r),a=await i.blob();return n.releaseLock(),new Blob([a],{type:t})}(e.body,e.headers.get("content-type"))),n.download=t.fileName||"Untitled",n.href=URL.createObjectURL(await r);const i=()=>{"function"==typeof a&&a();},a=t.legacySetup&&t.legacySetup(i,()=>a(),n);return n.addEventListener("click",()=>{setTimeout(()=>URL.revokeObjectURL(n.href),3e4),i();}),n.click(),null},k={__proto__:null,default:b$1};

    const SketchType = {
        Undefined: 'Undefined',
        Canvas: 'Canvas',
        Shader: 'Shader'
    };

    const fileNameDivider = ' - ';

    class Sketch {
        /* Defaults to be overridden by subclass */

        name = 'Unnamed Sketch';
        type = SketchType.Undefined;
        date = undefined; // "Work in Progress" until date is defined
        description = undefined;
        params = {};
        settings = {};
        bundledPresets = {};
        showPresets = true;
        defaultPresetName = 'Default Values';

        get #userPresetsKey() {
            return this.name + ' userPresets';
        }

        get #currentlySelectedKey() {
            return this.name + ' currentlySelected';
        }

        /* Param value state */

        storeParamValues() {
            Object.values(this.params).map((param) => {
                param.storeValue(this.name);
            });
        }

        restoreParamValues() {
            Object.values(this.params).map((param) => {
                param.restoreValue(this.name);
            });   
        }

        /* Dummy sketch function */

        sketchFn = ({}) => {
            return ({ context, width, height }) => {
                context.clearRect(0, 0, width, height);
                context.fillStyle = '#ffffff';
                context.fillRect(0, 0, width, height);
            }
        };

        /* Presets */

        selectedPresetName = undefined;
        defaultPreset = undefined;
        userPresets = undefined;

        get presets() {
            if (!this.defaultPreset || !this.userPresets) {
                throw 'restorePresets must be called before accessing presets.';
            }

            let allPresets = { [this.defaultPresetName]: this.defaultPreset };
            Object.assign(allPresets, this.bundledPresets, this.userPresets);
            return allPresets;
        };

        get nonEventParamNames() {
            return Object.keys(this.params).filter((paramName) => {
                return !(this.params[paramName] instanceof EventParam);
            })
        }

        restorePresets() {
            // Restore currently selected state
            const storedSelectedPresetState = localStorage.getItem(this.#currentlySelectedKey);
            this.selectedPresetName = storedSelectedPresetState;

            // Default values as first preset
            this.defaultPreset = {};
            this.nonEventParamNames.forEach((paramName) => {
                this.defaultPreset[paramName] = this.params[paramName].defaultValue;
            });

            // Local storage (user presets)
            const storedUserPresetState = localStorage.getItem(this.#userPresetsKey);
            this.userPresets = storedUserPresetState ? JSON.parse(storedUserPresetState) : {};

            // Select default if selectedPresetName is invalid
            const allPresetNames = Object.keys(this.presets);
            if (!this.selectedPresetName || !allPresetNames.includes(this.selectedPresetName)) {
                this.selectedPresetName = allPresetNames[0];
            }

            // Update modified state bit
            this.updatePresetModified();
        }

        presetModified = false;
        updatePresetModified() {
            if (!this.selectedPresetName) throw 'Presets not yet available.'

            this.presetModified = false;
            const selectedPreset = this.presets[this.selectedPresetName];
            const paramNames = this.nonEventParamNames;
            for (let paramIndex = 0; paramIndex < paramNames.length; paramIndex++) {
                const paramName = paramNames[paramIndex];
                if (selectedPreset[paramName] != this.params[paramName].value) {
                    this.presetModified = true;
                    return;
                }
            }
        }

        selectPreset(presetName) {
            // Check if the preset exists - shouldn't happen
            if (!Object.keys(this.presets).includes(presetName)) {
                console.warn(presetName + ' is not a valid preset name.');
                return;
            }

            // Set selection state
            this.selectedPresetName = presetName;
            localStorage.setItem(this.#currentlySelectedKey, presetName);

            // Set parameter state
            const selectedPreset = this.presets[this.selectedPresetName];
            this.nonEventParamNames.forEach((paramName) => {
                this.params[paramName].value = selectedPreset[paramName];
            });
            this.presetModified = false;
            this.storeParamValues(); // todo: is this redundant? happens twice when importing/etc
        }

        createPreset() {
            const currentPresetNames = Object.keys(this.userPresets);
            const defaultName = 'User Preset ' + (currentPresetNames.length + 1).toString();
            const newPresetName = prompt('New preset name:', defaultName);

            // Return null if canceled or invalid. Todo: appropriate alert(s)
            if (!newPresetName || currentPresetNames.includes(newPresetName)) return null;

            const presetObj = this.#currentPresetObject();
            return this.#addPreset(newPresetName, presetObj);
        }

        canRemoveSelectedPreset() {
            return Object.keys(this.userPresets).includes(this.selectedPresetName);
        }

        removeSelectedPreset() {
            if (!this.canRemoveSelectedPreset) throw 'Preset cannot be removed.';
            delete this.userPresets[this.selectedPresetName];
            localStorage.setItem(this.#userPresetsKey, JSON.stringify(this.userPresets));
        }

        exportPreset() {
            // Generate backing object for export
            const presetObj = this.#currentPresetObject();
            
            // Stringify, blob-ify, and save the backing object
            const objString = JSON.stringify(presetObj, null, 4);
            const objBlob = new Blob([objString], {type: "application/json"});
            return o(objBlob, {
                fileName: this.name + fileNameDivider + this.selectedPresetName,
                extensions: ['.json'],
            });
        }

        importPreset() {
            return n({
                mimeTypes: ['application/json'],
                extensions: ['.json']
            }).then((file) => {
                // Validate the file name
                const fileNameTrimmed = file.name.split('.').slice(0, -1).join('.');
                const nameComponents = fileNameTrimmed.split(fileNameDivider);
                if (nameComponents.length != 2 || nameComponents[0] != this.name) {
                    throw 'Imported preset files must be named like "' + this.name + fileNameDivider + 'Preset Name.json"';
                }
                const presetName = nameComponents[1];
                if (Object.keys(this.presets).includes(nameComponents[1])) {
                    throw 'A preset named "' + nameComponents[1] + '" already exists.'
                }
                return Promise.all([presetName, file.text()]);
            }).then(([presetName, presetString]) => {
                // Validate the JSON object
                let presetObject = undefined;
                let genericErrorString = 'Preset file could not be parsed.';
                try {
                    presetObject = JSON.parse(presetString);
                } catch (error) {
                    throw genericErrorString;
                }
                if (!presetObject) throw genericErrorString;

                // Validate the contents of the object (best effort)
                const importedPresetKeys = Object.keys(presetObject);
                const paramNames = this.nonEventParamNames;
                let invalidParamsErrorString = 'Imported preset file parameter names don\'t match.';
                if (importedPresetKeys.length != paramNames.length) throw invalidParamsErrorString;
                for (let paramIdx = 0; paramIdx < paramNames.length; paramIdx++) {
                    if (!importedPresetKeys.includes(paramNames[paramIdx])) {
                        throw invalidParamsErrorString;
                    }
                }

                // Add to presets and return the name
                return this.#addPreset(presetName, presetObject);
            });
        }

        /* Private methods */

        #currentPresetObject() {
            const presetObj = {};
            this.nonEventParamNames.forEach((paramName) => {
                presetObj[paramName] = this.params[paramName].value;
            });
            return presetObj;
        }

        #addPreset(newPresetName, presetObject) {
            this.userPresets[newPresetName] = presetObject;
            localStorage.setItem(this.#userPresetsKey, JSON.stringify(this.userPresets));
            return newPresetName;
        }
    }

    class Util {
        /**
         * Return a CSS color string for any HSL value input
         * @param {Number} h Hue (0-1)
         * @param {Number} s Saturation (0-1)
         * @param {Number} l Lightness (0-1)
         * @returns {String} CSS formatted color string
         */
        static hsl(h, s, l) {
            h *= 360;
            s *= 100;
            l *= 100;
            return 'hsl(' + h.toString() + ', ' + s.toString() + '%, ' + l.toString() + '%)';
        }

        /**
         * Return a continuous triangle wave value for a time input
         * @param {Number} t Continuous time input
         * @returns {Number} Triangle value ranging 0-1
         */
        static triangle(t) {
            if (t % 2 < 1) {
                return t % 1;
            } else  {
                return 1 - (t % 1);
            }
        }
    }

    var seedRandom = createCommonjsModule(function (module) {

    var width = 256;// each RC4 output is 0 <= x < 256
    var chunks = 6;// at least six RC4 outputs for each double
    var digits = 52;// there are 52 significant digits in a double
    var pool = [];// pool: entropy pool starts empty
    var GLOBAL = typeof commonjsGlobal === 'undefined' ? window : commonjsGlobal;

    //
    // The following constants are related to IEEE 754 limits.
    //
    var startdenom = Math.pow(width, chunks),
        significance = Math.pow(2, digits),
        overflow = significance * 2,
        mask = width - 1;


    var oldRandom = Math.random;

    //
    // seedrandom()
    // This is the seedrandom function described above.
    //
    module.exports = function(seed, options) {
      if (options && options.global === true) {
        options.global = false;
        Math.random = module.exports(seed, options);
        options.global = true;
        return Math.random;
      }
      var use_entropy = (options && options.entropy) || false;
      var key = [];

      // Flatten the seed string or build one from local entropy if needed.
      mixkey(flatten(
        use_entropy ? [seed, tostring(pool)] :
        0 in arguments ? seed : autoseed(), 3), key);

      // Use the seed to initialize an ARC4 generator.
      var arc4 = new ARC4(key);

      // Mix the randomness into accumulated entropy.
      mixkey(tostring(arc4.S), pool);

      // Override Math.random

      // This function returns a random double in [0, 1) that contains
      // randomness in every bit of the mantissa of the IEEE 754 value.

      return function() {         // Closure to return a random double:
        var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
            d = startdenom,                 //   and denominator d = 2 ^ 48.
            x = 0;                          //   and no 'extra last byte'.
        while (n < significance) {          // Fill up all significant digits by
          n = (n + x) * width;              //   shifting numerator and
          d *= width;                       //   denominator and generating a
          x = arc4.g(1);                    //   new least-significant-byte.
        }
        while (n >= overflow) {             // To avoid rounding up, before adding
          n /= 2;                           //   last byte, shift everything
          d /= 2;                           //   right using integer Math until
          x >>>= 1;                         //   we have exactly the desired bits.
        }
        return (n + x) / d;                 // Form the number within [0, 1).
      };
    };

    module.exports.resetGlobal = function () {
      Math.random = oldRandom;
    };

    //
    // ARC4
    //
    // An ARC4 implementation.  The constructor takes a key in the form of
    // an array of at most (width) integers that should be 0 <= x < (width).
    //
    // The g(count) method returns a pseudorandom integer that concatenates
    // the next (count) outputs from ARC4.  Its return value is a number x
    // that is in the range 0 <= x < (width ^ count).
    //
    /** @constructor */
    function ARC4(key) {
      var t, keylen = key.length,
          me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

      // The empty key [] is treated as [0].
      if (!keylen) { key = [keylen++]; }

      // Set up S using the standard key scheduling algorithm.
      while (i < width) {
        s[i] = i++;
      }
      for (i = 0; i < width; i++) {
        s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
        s[j] = t;
      }

      // The "g" method returns the next (count) outputs as one number.
      (me.g = function(count) {
        // Using instance members instead of closure state nearly doubles speed.
        var t, r = 0,
            i = me.i, j = me.j, s = me.S;
        while (count--) {
          t = s[i = mask & (i + 1)];
          r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
        }
        me.i = i; me.j = j;
        return r;
        // For robust unpredictability discard an initial batch of values.
        // See http://www.rsa.com/rsalabs/node.asp?id=2009
      })(width);
    }

    //
    // flatten()
    // Converts an object tree to nested arrays of strings.
    //
    function flatten(obj, depth) {
      var result = [], typ = (typeof obj)[0], prop;
      if (depth && typ == 'o') {
        for (prop in obj) {
          try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
        }
      }
      return (result.length ? result : typ == 's' ? obj : obj + '\0');
    }

    //
    // mixkey()
    // Mixes a string seed into a key that is an array of integers, and
    // returns a shortened string seed that is equivalent to the result key.
    //
    function mixkey(seed, key) {
      var stringseed = seed + '', smear, j = 0;
      while (j < stringseed.length) {
        key[mask & j] =
          mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
      }
      return tostring(key);
    }

    //
    // autoseed()
    // Returns an object for autoseeding, using window.crypto if available.
    //
    /** @param {Uint8Array=} seed */
    function autoseed(seed) {
      try {
        GLOBAL.crypto.getRandomValues(seed = new Uint8Array(width));
        return tostring(seed);
      } catch (e) {
        return [+new Date, GLOBAL, GLOBAL.navigator && GLOBAL.navigator.plugins,
                GLOBAL.screen, tostring(pool)];
      }
    }

    //
    // tostring()
    // Converts an array of charcodes to a string
    //
    function tostring(a) {
      return String.fromCharCode.apply(0, a);
    }

    //
    // When seedrandom.js is loaded, we immediately mix a few bits
    // from the built-in RNG into the entropy pool.  Because we do
    // not want to intefere with determinstic PRNG state later,
    // seedrandom will not call Math.random on its own again after
    // initialization.
    //
    mixkey(Math.random(), pool);
    });

    /*
     * A fast javascript implementation of simplex noise by Jonas Wagner

    Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
    Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
    With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
    Better rank ordering method by Stefan Gustavson in 2012.


     Copyright (c) 2018 Jonas Wagner

     Permission is hereby granted, free of charge, to any person obtaining a copy
     of this software and associated documentation files (the "Software"), to deal
     in the Software without restriction, including without limitation the rights
     to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     copies of the Software, and to permit persons to whom the Software is
     furnished to do so, subject to the following conditions:

     The above copyright notice and this permission notice shall be included in all
     copies or substantial portions of the Software.

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     SOFTWARE.
     */

    var simplexNoise = createCommonjsModule(function (module, exports) {
    (function() {

      var F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
      var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
      var F3 = 1.0 / 3.0;
      var G3 = 1.0 / 6.0;
      var F4 = (Math.sqrt(5.0) - 1.0) / 4.0;
      var G4 = (5.0 - Math.sqrt(5.0)) / 20.0;

      function SimplexNoise(randomOrSeed) {
        var random;
        if (typeof randomOrSeed == 'function') {
          random = randomOrSeed;
        }
        else if (randomOrSeed) {
          random = alea(randomOrSeed);
        } else {
          random = Math.random;
        }
        this.p = buildPermutationTable(random);
        this.perm = new Uint8Array(512);
        this.permMod12 = new Uint8Array(512);
        for (var i = 0; i < 512; i++) {
          this.perm[i] = this.p[i & 255];
          this.permMod12[i] = this.perm[i] % 12;
        }

      }
      SimplexNoise.prototype = {
        grad3: new Float32Array([1, 1, 0,
          -1, 1, 0,
          1, -1, 0,

          -1, -1, 0,
          1, 0, 1,
          -1, 0, 1,

          1, 0, -1,
          -1, 0, -1,
          0, 1, 1,

          0, -1, 1,
          0, 1, -1,
          0, -1, -1]),
        grad4: new Float32Array([0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1,
          0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1,
          1, 0, 1, 1, 1, 0, 1, -1, 1, 0, -1, 1, 1, 0, -1, -1,
          -1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1, 0, -1, -1,
          1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1,
          -1, 1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1,
          1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0,
          -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 0]),
        noise2D: function(xin, yin) {
          var permMod12 = this.permMod12;
          var perm = this.perm;
          var grad3 = this.grad3;
          var n0 = 0; // Noise contributions from the three corners
          var n1 = 0;
          var n2 = 0;
          // Skew the input space to determine which simplex cell we're in
          var s = (xin + yin) * F2; // Hairy factor for 2D
          var i = Math.floor(xin + s);
          var j = Math.floor(yin + s);
          var t = (i + j) * G2;
          var X0 = i - t; // Unskew the cell origin back to (x,y) space
          var Y0 = j - t;
          var x0 = xin - X0; // The x,y distances from the cell origin
          var y0 = yin - Y0;
          // For the 2D case, the simplex shape is an equilateral triangle.
          // Determine which simplex we are in.
          var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
          if (x0 > y0) {
            i1 = 1;
            j1 = 0;
          } // lower triangle, XY order: (0,0)->(1,0)->(1,1)
          else {
            i1 = 0;
            j1 = 1;
          } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
          // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
          // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
          // c = (3-sqrt(3))/6
          var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
          var y1 = y0 - j1 + G2;
          var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
          var y2 = y0 - 1.0 + 2.0 * G2;
          // Work out the hashed gradient indices of the three simplex corners
          var ii = i & 255;
          var jj = j & 255;
          // Calculate the contribution from the three corners
          var t0 = 0.5 - x0 * x0 - y0 * y0;
          if (t0 >= 0) {
            var gi0 = permMod12[ii + perm[jj]] * 3;
            t0 *= t0;
            n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0); // (x,y) of grad3 used for 2D gradient
          }
          var t1 = 0.5 - x1 * x1 - y1 * y1;
          if (t1 >= 0) {
            var gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
            t1 *= t1;
            n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
          }
          var t2 = 0.5 - x2 * x2 - y2 * y2;
          if (t2 >= 0) {
            var gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
            t2 *= t2;
            n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
          }
          // Add contributions from each corner to get the final noise value.
          // The result is scaled to return values in the interval [-1,1].
          return 70.0 * (n0 + n1 + n2);
        },
        // 3D simplex noise
        noise3D: function(xin, yin, zin) {
          var permMod12 = this.permMod12;
          var perm = this.perm;
          var grad3 = this.grad3;
          var n0, n1, n2, n3; // Noise contributions from the four corners
          // Skew the input space to determine which simplex cell we're in
          var s = (xin + yin + zin) * F3; // Very nice and simple skew factor for 3D
          var i = Math.floor(xin + s);
          var j = Math.floor(yin + s);
          var k = Math.floor(zin + s);
          var t = (i + j + k) * G3;
          var X0 = i - t; // Unskew the cell origin back to (x,y,z) space
          var Y0 = j - t;
          var Z0 = k - t;
          var x0 = xin - X0; // The x,y,z distances from the cell origin
          var y0 = yin - Y0;
          var z0 = zin - Z0;
          // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
          // Determine which simplex we are in.
          var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
          var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
          if (x0 >= y0) {
            if (y0 >= z0) {
              i1 = 1;
              j1 = 0;
              k1 = 0;
              i2 = 1;
              j2 = 1;
              k2 = 0;
            } // X Y Z order
            else if (x0 >= z0) {
              i1 = 1;
              j1 = 0;
              k1 = 0;
              i2 = 1;
              j2 = 0;
              k2 = 1;
            } // X Z Y order
            else {
              i1 = 0;
              j1 = 0;
              k1 = 1;
              i2 = 1;
              j2 = 0;
              k2 = 1;
            } // Z X Y order
          }
          else { // x0<y0
            if (y0 < z0) {
              i1 = 0;
              j1 = 0;
              k1 = 1;
              i2 = 0;
              j2 = 1;
              k2 = 1;
            } // Z Y X order
            else if (x0 < z0) {
              i1 = 0;
              j1 = 1;
              k1 = 0;
              i2 = 0;
              j2 = 1;
              k2 = 1;
            } // Y Z X order
            else {
              i1 = 0;
              j1 = 1;
              k1 = 0;
              i2 = 1;
              j2 = 1;
              k2 = 0;
            } // Y X Z order
          }
          // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
          // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
          // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
          // c = 1/6.
          var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
          var y1 = y0 - j1 + G3;
          var z1 = z0 - k1 + G3;
          var x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords
          var y2 = y0 - j2 + 2.0 * G3;
          var z2 = z0 - k2 + 2.0 * G3;
          var x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords
          var y3 = y0 - 1.0 + 3.0 * G3;
          var z3 = z0 - 1.0 + 3.0 * G3;
          // Work out the hashed gradient indices of the four simplex corners
          var ii = i & 255;
          var jj = j & 255;
          var kk = k & 255;
          // Calculate the contribution from the four corners
          var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
          if (t0 < 0) n0 = 0.0;
          else {
            var gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
            t0 *= t0;
            n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
          }
          var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
          if (t1 < 0) n1 = 0.0;
          else {
            var gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
            t1 *= t1;
            n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
          }
          var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
          if (t2 < 0) n2 = 0.0;
          else {
            var gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
            t2 *= t2;
            n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
          }
          var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
          if (t3 < 0) n3 = 0.0;
          else {
            var gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
            t3 *= t3;
            n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
          }
          // Add contributions from each corner to get the final noise value.
          // The result is scaled to stay just inside [-1,1]
          return 32.0 * (n0 + n1 + n2 + n3);
        },
        // 4D simplex noise, better simplex rank ordering method 2012-03-09
        noise4D: function(x, y, z, w) {
          var perm = this.perm;
          var grad4 = this.grad4;

          var n0, n1, n2, n3, n4; // Noise contributions from the five corners
          // Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in
          var s = (x + y + z + w) * F4; // Factor for 4D skewing
          var i = Math.floor(x + s);
          var j = Math.floor(y + s);
          var k = Math.floor(z + s);
          var l = Math.floor(w + s);
          var t = (i + j + k + l) * G4; // Factor for 4D unskewing
          var X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space
          var Y0 = j - t;
          var Z0 = k - t;
          var W0 = l - t;
          var x0 = x - X0; // The x,y,z,w distances from the cell origin
          var y0 = y - Y0;
          var z0 = z - Z0;
          var w0 = w - W0;
          // For the 4D case, the simplex is a 4D shape I won't even try to describe.
          // To find out which of the 24 possible simplices we're in, we need to
          // determine the magnitude ordering of x0, y0, z0 and w0.
          // Six pair-wise comparisons are performed between each possible pair
          // of the four coordinates, and the results are used to rank the numbers.
          var rankx = 0;
          var ranky = 0;
          var rankz = 0;
          var rankw = 0;
          if (x0 > y0) rankx++;
          else ranky++;
          if (x0 > z0) rankx++;
          else rankz++;
          if (x0 > w0) rankx++;
          else rankw++;
          if (y0 > z0) ranky++;
          else rankz++;
          if (y0 > w0) ranky++;
          else rankw++;
          if (z0 > w0) rankz++;
          else rankw++;
          var i1, j1, k1, l1; // The integer offsets for the second simplex corner
          var i2, j2, k2, l2; // The integer offsets for the third simplex corner
          var i3, j3, k3, l3; // The integer offsets for the fourth simplex corner
          // simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
          // Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
          // impossible. Only the 24 indices which have non-zero entries make any sense.
          // We use a thresholding to set the coordinates in turn from the largest magnitude.
          // Rank 3 denotes the largest coordinate.
          i1 = rankx >= 3 ? 1 : 0;
          j1 = ranky >= 3 ? 1 : 0;
          k1 = rankz >= 3 ? 1 : 0;
          l1 = rankw >= 3 ? 1 : 0;
          // Rank 2 denotes the second largest coordinate.
          i2 = rankx >= 2 ? 1 : 0;
          j2 = ranky >= 2 ? 1 : 0;
          k2 = rankz >= 2 ? 1 : 0;
          l2 = rankw >= 2 ? 1 : 0;
          // Rank 1 denotes the second smallest coordinate.
          i3 = rankx >= 1 ? 1 : 0;
          j3 = ranky >= 1 ? 1 : 0;
          k3 = rankz >= 1 ? 1 : 0;
          l3 = rankw >= 1 ? 1 : 0;
          // The fifth corner has all coordinate offsets = 1, so no need to compute that.
          var x1 = x0 - i1 + G4; // Offsets for second corner in (x,y,z,w) coords
          var y1 = y0 - j1 + G4;
          var z1 = z0 - k1 + G4;
          var w1 = w0 - l1 + G4;
          var x2 = x0 - i2 + 2.0 * G4; // Offsets for third corner in (x,y,z,w) coords
          var y2 = y0 - j2 + 2.0 * G4;
          var z2 = z0 - k2 + 2.0 * G4;
          var w2 = w0 - l2 + 2.0 * G4;
          var x3 = x0 - i3 + 3.0 * G4; // Offsets for fourth corner in (x,y,z,w) coords
          var y3 = y0 - j3 + 3.0 * G4;
          var z3 = z0 - k3 + 3.0 * G4;
          var w3 = w0 - l3 + 3.0 * G4;
          var x4 = x0 - 1.0 + 4.0 * G4; // Offsets for last corner in (x,y,z,w) coords
          var y4 = y0 - 1.0 + 4.0 * G4;
          var z4 = z0 - 1.0 + 4.0 * G4;
          var w4 = w0 - 1.0 + 4.0 * G4;
          // Work out the hashed gradient indices of the five simplex corners
          var ii = i & 255;
          var jj = j & 255;
          var kk = k & 255;
          var ll = l & 255;
          // Calculate the contribution from the five corners
          var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
          if (t0 < 0) n0 = 0.0;
          else {
            var gi0 = (perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32) * 4;
            t0 *= t0;
            n0 = t0 * t0 * (grad4[gi0] * x0 + grad4[gi0 + 1] * y0 + grad4[gi0 + 2] * z0 + grad4[gi0 + 3] * w0);
          }
          var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
          if (t1 < 0) n1 = 0.0;
          else {
            var gi1 = (perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32) * 4;
            t1 *= t1;
            n1 = t1 * t1 * (grad4[gi1] * x1 + grad4[gi1 + 1] * y1 + grad4[gi1 + 2] * z1 + grad4[gi1 + 3] * w1);
          }
          var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
          if (t2 < 0) n2 = 0.0;
          else {
            var gi2 = (perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32) * 4;
            t2 *= t2;
            n2 = t2 * t2 * (grad4[gi2] * x2 + grad4[gi2 + 1] * y2 + grad4[gi2 + 2] * z2 + grad4[gi2 + 3] * w2);
          }
          var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
          if (t3 < 0) n3 = 0.0;
          else {
            var gi3 = (perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32) * 4;
            t3 *= t3;
            n3 = t3 * t3 * (grad4[gi3] * x3 + grad4[gi3 + 1] * y3 + grad4[gi3 + 2] * z3 + grad4[gi3 + 3] * w3);
          }
          var t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
          if (t4 < 0) n4 = 0.0;
          else {
            var gi4 = (perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32) * 4;
            t4 *= t4;
            n4 = t4 * t4 * (grad4[gi4] * x4 + grad4[gi4 + 1] * y4 + grad4[gi4 + 2] * z4 + grad4[gi4 + 3] * w4);
          }
          // Sum up and scale the result to cover the range [-1,1]
          return 27.0 * (n0 + n1 + n2 + n3 + n4);
        }
      };

      function buildPermutationTable(random) {
        var i;
        var p = new Uint8Array(256);
        for (i = 0; i < 256; i++) {
          p[i] = i;
        }
        for (i = 0; i < 255; i++) {
          var r = i + ~~(random() * (256 - i));
          var aux = p[i];
          p[i] = p[r];
          p[r] = aux;
        }
        return p;
      }
      SimplexNoise._buildPermutationTable = buildPermutationTable;

      function alea() {
        // Johannes Baagøe <baagoe@baagoe.com>, 2010
        var s0 = 0;
        var s1 = 0;
        var s2 = 0;
        var c = 1;

        var mash = masher();
        s0 = mash(' ');
        s1 = mash(' ');
        s2 = mash(' ');

        for (var i = 0; i < arguments.length; i++) {
          s0 -= mash(arguments[i]);
          if (s0 < 0) {
            s0 += 1;
          }
          s1 -= mash(arguments[i]);
          if (s1 < 0) {
            s1 += 1;
          }
          s2 -= mash(arguments[i]);
          if (s2 < 0) {
            s2 += 1;
          }
        }
        mash = null;
        return function() {
          var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
          s0 = s1;
          s1 = s2;
          return s2 = t - (c = t | 0);
        };
      }
      function masher() {
        var n = 0xefc8249d;
        return function(data) {
          data = data.toString();
          for (var i = 0; i < data.length; i++) {
            n += data.charCodeAt(i);
            var h = 0.02519603282416938 * n;
            n = h >>> 0;
            h -= n;
            h *= n;
            n = h >>> 0;
            h -= n;
            n += h * 0x100000000; // 2^32
          }
          return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
        };
      }
      // common js
      exports.SimplexNoise = SimplexNoise;
      // nodejs
      {
        module.exports = SimplexNoise;
      }

    })();
    });

    var defined = function () {
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] !== undefined) return arguments[i];
        }
    };

    function createRandom (defaultSeed) {
      defaultSeed = defined(defaultSeed, null);
      var defaultRandom = Math.random;
      var currentSeed;
      var currentRandom;
      var noiseGenerator;
      var _nextGaussian = null;
      var _hasNextGaussian = false;

      setSeed(defaultSeed);

      return {
        value: value,
        createRandom: function (defaultSeed) {
          return createRandom(defaultSeed);
        },
        setSeed: setSeed,
        getSeed: getSeed,
        getRandomSeed: getRandomSeed,
        valueNonZero: valueNonZero,
        permuteNoise: permuteNoise,
        noise1D: noise1D,
        noise2D: noise2D,
        noise3D: noise3D,
        noise4D: noise4D,
        sign: sign,
        boolean: boolean,
        chance: chance,
        range: range,
        rangeFloor: rangeFloor,
        pick: pick,
        shuffle: shuffle,
        onCircle: onCircle,
        insideCircle: insideCircle,
        onSphere: onSphere,
        insideSphere: insideSphere,
        quaternion: quaternion,
        weighted: weighted,
        weightedSet: weightedSet,
        weightedSetIndex: weightedSetIndex,
        gaussian: gaussian
      };

      function setSeed (seed, opt) {
        if (typeof seed === 'number' || typeof seed === 'string') {
          currentSeed = seed;
          currentRandom = seedRandom(currentSeed, opt);
        } else {
          currentSeed = undefined;
          currentRandom = defaultRandom;
        }
        noiseGenerator = createNoise();
        _nextGaussian = null;
        _hasNextGaussian = false;
      }

      function value () {
        return currentRandom();
      }

      function valueNonZero () {
        var u = 0;
        while (u === 0) u = value();
        return u;
      }

      function getSeed () {
        return currentSeed;
      }

      function getRandomSeed () {
        var seed = String(Math.floor(Math.random() * 1000000));
        return seed;
      }

      function createNoise () {
        return new simplexNoise(currentRandom);
      }

      function permuteNoise () {
        noiseGenerator = createNoise();
      }

      function noise1D (x, frequency, amplitude) {
        if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
        frequency = defined(frequency, 1);
        amplitude = defined(amplitude, 1);
        return amplitude * noiseGenerator.noise2D(x * frequency, 0);
      }

      function noise2D (x, y, frequency, amplitude) {
        if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
        if (!isFinite(y)) throw new TypeError('y component for noise() must be finite');
        frequency = defined(frequency, 1);
        amplitude = defined(amplitude, 1);
        return amplitude * noiseGenerator.noise2D(x * frequency, y * frequency);
      }

      function noise3D (x, y, z, frequency, amplitude) {
        if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
        if (!isFinite(y)) throw new TypeError('y component for noise() must be finite');
        if (!isFinite(z)) throw new TypeError('z component for noise() must be finite');
        frequency = defined(frequency, 1);
        amplitude = defined(amplitude, 1);
        return amplitude * noiseGenerator.noise3D(
          x * frequency,
          y * frequency,
          z * frequency
        );
      }

      function noise4D (x, y, z, w, frequency, amplitude) {
        if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
        if (!isFinite(y)) throw new TypeError('y component for noise() must be finite');
        if (!isFinite(z)) throw new TypeError('z component for noise() must be finite');
        if (!isFinite(w)) throw new TypeError('w component for noise() must be finite');
        frequency = defined(frequency, 1);
        amplitude = defined(amplitude, 1);
        return amplitude * noiseGenerator.noise4D(
          x * frequency,
          y * frequency,
          z * frequency,
          w * frequency
        );
      }

      function sign () {
        return boolean() ? 1 : -1;
      }

      function boolean () {
        return value() > 0.5;
      }

      function chance (n) {
        n = defined(n, 0.5);
        if (typeof n !== 'number') throw new TypeError('expected n to be a number');
        return value() < n;
      }

      function range (min, max) {
        if (max === undefined) {
          max = min;
          min = 0;
        }

        if (typeof min !== 'number' || typeof max !== 'number') {
          throw new TypeError('Expected all arguments to be numbers');
        }

        return value() * (max - min) + min;
      }

      function rangeFloor (min, max) {
        if (max === undefined) {
          max = min;
          min = 0;
        }

        if (typeof min !== 'number' || typeof max !== 'number') {
          throw new TypeError('Expected all arguments to be numbers');
        }

        return Math.floor(range(min, max));
      }

      function pick (array) {
        if (array.length === 0) return undefined;
        return array[rangeFloor(0, array.length)];
      }

      function shuffle (arr) {
        if (!Array.isArray(arr)) {
          throw new TypeError('Expected Array, got ' + typeof arr);
        }

        var rand;
        var tmp;
        var len = arr.length;
        var ret = arr.slice();
        while (len) {
          rand = Math.floor(value() * len--);
          tmp = ret[len];
          ret[len] = ret[rand];
          ret[rand] = tmp;
        }
        return ret;
      }

      function onCircle (radius, out) {
        radius = defined(radius, 1);
        out = out || [];
        var theta = value() * 2.0 * Math.PI;
        out[0] = radius * Math.cos(theta);
        out[1] = radius * Math.sin(theta);
        return out;
      }

      function insideCircle (radius, out) {
        radius = defined(radius, 1);
        out = out || [];
        onCircle(1, out);
        var r = radius * Math.sqrt(value());
        out[0] *= r;
        out[1] *= r;
        return out;
      }

      function onSphere (radius, out) {
        radius = defined(radius, 1);
        out = out || [];
        var u = value() * Math.PI * 2;
        var v = value() * 2 - 1;
        var phi = u;
        var theta = Math.acos(v);
        out[0] = radius * Math.sin(theta) * Math.cos(phi);
        out[1] = radius * Math.sin(theta) * Math.sin(phi);
        out[2] = radius * Math.cos(theta);
        return out;
      }

      function insideSphere (radius, out) {
        radius = defined(radius, 1);
        out = out || [];
        var u = value() * Math.PI * 2;
        var v = value() * 2 - 1;
        var k = value();

        var phi = u;
        var theta = Math.acos(v);
        var r = radius * Math.cbrt(k);
        out[0] = r * Math.sin(theta) * Math.cos(phi);
        out[1] = r * Math.sin(theta) * Math.sin(phi);
        out[2] = r * Math.cos(theta);
        return out;
      }

      function quaternion (out) {
        out = out || [];
        var u1 = value();
        var u2 = value();
        var u3 = value();

        var sq1 = Math.sqrt(1 - u1);
        var sq2 = Math.sqrt(u1);

        var theta1 = Math.PI * 2 * u2;
        var theta2 = Math.PI * 2 * u3;

        var x = Math.sin(theta1) * sq1;
        var y = Math.cos(theta1) * sq1;
        var z = Math.sin(theta2) * sq2;
        var w = Math.cos(theta2) * sq2;
        out[0] = x;
        out[1] = y;
        out[2] = z;
        out[3] = w;
        return out;
      }

      function weightedSet (set) {
        set = set || [];
        if (set.length === 0) return null;
        return set[weightedSetIndex(set)].value;
      }

      function weightedSetIndex (set) {
        set = set || [];
        if (set.length === 0) return -1;
        return weighted(set.map(function (s) {
          return s.weight;
        }));
      }

      function weighted (weights) {
        weights = weights || [];
        if (weights.length === 0) return -1;
        var totalWeight = 0;
        var i;

        for (i = 0; i < weights.length; i++) {
          totalWeight += weights[i];
        }

        if (totalWeight <= 0) throw new Error('Weights must sum to > 0');

        var random = value() * totalWeight;
        for (i = 0; i < weights.length; i++) {
          if (random < weights[i]) {
            return i;
          }
          random -= weights[i];
        }
        return 0;
      }

      function gaussian (mean, standardDerivation) {
        mean = defined(mean, 0);
        standardDerivation = defined(standardDerivation, 1);

        // https://github.com/openjdk-mirror/jdk7u-jdk/blob/f4d80957e89a19a29bb9f9807d2a28351ed7f7df/src/share/classes/java/util/Random.java#L496
        if (_hasNextGaussian) {
          _hasNextGaussian = false;
          var result = _nextGaussian;
          _nextGaussian = null;
          return mean + standardDerivation * result;
        } else {
          var v1 = 0;
          var v2 = 0;
          var s = 0;
          do {
            v1 = value() * 2 - 1; // between -1 and 1
            v2 = value() * 2 - 1; // between -1 and 1
            s = v1 * v1 + v2 * v2;
          } while (s >= 1 || s === 0);
          var multiplier = Math.sqrt(-2 * Math.log(s) / s);
          _nextGaussian = (v2 * multiplier);
          _hasNextGaussian = true;
          return mean + standardDerivation * (v1 * multiplier);
        }
      }
    }

    var random = createRandom();

    class NoSignal extends Sketch {
        name = 'No Signal';
        type = SketchType.Canvas;
        date = new Date("8/15/2022");
        description = `
        A "no signal" graphic, inspired by VCRs and other classic image displays. This was the first sketch project created within Sketchbook, and it is a simple demo of Sketchbook's capabilities and intent.
    `;
        showPresets = false;

        params = {
            colorCount: new FloatParam('Color Count', 19, 1, 32, 1, true,
                'Number of vertical color stripes displayed in the upper segment of the screen.'),
            bwCount: new FloatParam('B&W Count', 32, 1, 64, 1, true,
                'Number of vertical black & white stripes displayed in the lower segment of the screen.'),
            displayText: new BoolParam('Show Text', true,
                'Hide or show the "No Signal" text in the middle of the screen.')
        };

        settings = {
            animate: true
        }
        
        sketchFn = ({}) => {
            // Tuned constants
            const barHeight = 150;
            const colorPercentage = 0.85;
            const colorSpeed = 0.1;

            // CanvasSketch function
            return ({ context, width, height, time }) => {
                // Clear the previous frame
                context.clearRect(0, 0, width, height);

                // Draw color bars
                const colorNumBars = Math.floor(this.params.colorCount.value);
                const colorBarWidth = Math.floor(width / colorNumBars);
                const colorExtraWidth = width - colorBarWidth * colorNumBars;
                const colorBarHeight = Math.floor(height * colorPercentage);
                for (let barIndex = 0; barIndex < colorNumBars; barIndex++) {
                    let currentBarWidth = colorBarWidth;
                    if (barIndex == colorNumBars - 1) {
                        currentBarWidth += colorExtraWidth;
                    }
                    const hue = (barIndex / colorNumBars + time * colorSpeed) % 1;
                    context.fillStyle = Util.hsl(hue, 1, 0.5);
                    context.fillRect(colorBarWidth * barIndex, 0, currentBarWidth, colorBarHeight);
                }

                // Draw B&W bars
                const bwNumBars = Math.floor(this.params.bwCount.value);
                const bwBarWidth = Math.floor(width / bwNumBars);
                const bwExtraWidth = width - bwBarWidth * bwNumBars;
                const bwBarHeight = height - colorBarHeight;
                for (let barIndex = 0; barIndex < bwNumBars; barIndex++) {
                    let currentBarWidth = bwBarWidth;
                    if (barIndex == bwNumBars - 1) {
                        currentBarWidth += bwExtraWidth;
                    }
                    const value = Util.triangle(time * colorSpeed - barIndex / bwNumBars + 2);
                    context.fillStyle = Util.hsl(0, 0, value);
                    context.fillRect(bwBarWidth * barIndex, colorBarHeight, currentBarWidth, bwBarHeight);
                }

                // Horizontal stripe across the screen
                context.fillStyle = '#000';
                context.fillRect(0, height/2 - barHeight/2, width, barHeight);

                // "No Signal" text
                if (this.params.displayText.value) {
                    context.fillStyle = '#FFF';
                    context.font = "56px monospace";
                    context.textAlign = "center";
                    context.textBaseline = 'middle';
                    context.fillText("NO SIGNAL", width/2, height/2);
                }

                // Blur (todo)

                // Grain effect with minor color distortion
                /* Grain effect needs optimization
                const originalImage = context.getImageData(0, 0, width, height);
                const modifiedImage = new ImageData(width, height);
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        // Get pixel data
                        const dataOffset = (width * y + x) * 4;
                        const rIdx = dataOffset;
                        const gIdx = dataOffset + 1;
                        const bIdx = dataOffset + 2;
                        const aIdx = dataOffset + 3;
                        const r = originalImage.data[rIdx];
                        const g = originalImage.data[gIdx];
                        const b = originalImage.data[bIdx];

                        // Apply noise value per channel
                        const noiseVal = Random.noise3D(x, y, time * noiseSpeed, noiseFreq);
                        modifiedImage.data[rIdx] = r - noiseVal * noiseDepth[0];
                        modifiedImage.data[gIdx] = g - noiseVal * noiseDepth[1];
                        modifiedImage.data[bIdx] = b - noiseVal * noiseDepth[2];
                        modifiedImage.data[aIdx] = 255;
                    }
                }
                context.putImageData(modifiedImage, 0, 0);
                */
            };
        };
    }

    class Point {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }

        eq(point) {
            return this.x == point.x && this.y == point.y;
        }

        gt(point) {
            return this.x > point.x && this.y > point.y;
        }

        gte(point) {
            return this.x >= point.x && this.y >= point.y;
        }

        lt(point) {
            return this.x < point.x && this.y < point.y;
        }

        lte(point) {
            return this.x <= point.x && this.y <= point.y;
        }

        add(p1, p2) {
            if (p1 instanceof Point) {
                return new Point(
                    this.x + p1.x,
                    this.y + p1.y
                );
            } else {
                return new Point(
                    this.x + p1,
                    this.y + (p2  ?? p1)
                );
            }
        }

        sub(p1, p2) {
            if (p1 instanceof Point) {
                return new Point(
                    this.x - p1.x,
                    this.y - p1.y
                );
            } else {
                return new Point(
                    this.x - p1,
                    this.y - (p2 ?? p1)
                );
            }
        }

        mult(p1, p2) {
            if (p1 instanceof Point) {
                return new Point(
                    this.x * p1.x,
                    this.y * p1.y
                );
            } else {
                return new Point(
                    this.x * p1,
                    this.y * (p2 ?? p1)
                );
            }
        }

        div(p1, p2) {
            if (p1 instanceof Point) {
                return new Point(
                    this.x / p1.x,
                    this.y / p1.y
                );
            } else {
                return new Point(
                    this.x / p1,
                    this.y / (p2 ?? p1)
                );
            }
        }

        toString() {
            return '(' + this.x.toString() + ', ' + this.y.toString() + ')';
        }
    }

    class Rect {
        constructor(origin = new Point(), width = 0, height = 0) {
            this.origin = origin;
            this.width = width;
            this.height = height;
        }

        get x() { return this.origin.x; }
        get y() { return this.origin.y; }
        set x(newX) { this.origin.x = newX; }
        set y(newY) { this.origin.y = newY; }

        get topLeft() { return this.origin; }
        get topRight() { return this.origin.add(this.width, 0); }
        get bottomLeft() { return this.origin.add(0, this.height); }
        get bottomRight() { return this.origin.add(this.width, this.height); }

        scale(scaleFactorX, scaleFactorY) {
            scaleFactorY = scaleFactorY ?? scaleFactorX; // allow single input
            return new Rect(
                this.origin.mult(new Point(scaleFactorX, scaleFactorY)),
                this.width * scaleFactorX,
                this.height * scaleFactorY
            );
        }
    }

    /** Quadtree class (lightweight wrapper for QTNode). */
    class Quadtree {
        /**
         * Create a Quadtree.
         * @param {Number} width - Width of 2D space covered by Quadtree.
         * @param {Number} height - Height of 2D space covered by Quadtree.
         */
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.root = new QTNode(
                new Point(0, 0),
                new Point(width, height)
            );
        }

        /**
         * Insert an object into the Quadtree at a specified point.
         * @param {Point} point - The point associated with the object to insert.
         * @param {*} object - The object to insert.
         */
        insert(point, object) {
            this.root.insert(point, object);
        }

        /**
         * Remove an object from the Quadtree (not yet implemented).
         * @param {*} object 
         */
        remove(object) {
            // todo: find and remove the object
            throw('remove is not yet implemented.')
        }

        /**
         * Search a specified rectangular space within the Quadtree, and return
         * all enclosed objects. Search bounds are inclusive.
         * @param {Point} northWestCorner - Upper left corner of the search space.
         * @param {Point} southEastCorner - Lower right corner of the search space.
         * @returns {Array} - All objects contained within the search space.
         */
        search(northWestCorner, southEastCorner) {
            return this.root.search(northWestCorner, southEastCorner);
        }

        /**
         * Return all objects previously inserted into the Quadtree.
         * @returns {Array} - All objects contained within the Quadtree.
         */
        getAllObjects() {
            return this.root.getAllObjects();
        }

        /**
         * Remove all objects from the quadtree.
         */
        clear() {
            // Simply create a fresh root.
            this.root = new QTNode(
                new Point(0, 0),
                new Point(this.width, this.height)
            );
        }
    }

    /** Quadtree node class, representing the root & its recursively nested quadrants. */
    class QTNode {
        constructor(northWestCorner, southEastCorner) {
            this.northWestCorner = northWestCorner;
            this.southEastCorner = southEastCorner;
            this.quadrants = [null, null, null, null]; // [NW, NE, SW, SE]

            // assuming top-left origin, naturally
            this.width = southEastCorner.x - northWestCorner.x;
            this.height = southEastCorner.y - northWestCorner.y;
            this.midpoint = new Point(
                northWestCorner.x + this.width/2,
                northWestCorner.y + this.height/2
            );
        }

        insert(point, object) {
            if (!point.lt(this.southEastCorner) || !point.gte(this.northWestCorner)) {
                throw point.toString() + ' is outside of node bounds.';
            }

            // Get whatever exists at this quadrant position
            const north = (point.y < this.midpoint.y);
            const west = (point.x < this.midpoint.x);
            let currentQuadrant = this._getQuadrant(north, west);

            // If nothing exists at this position, add it
            if (!currentQuadrant) {
                const toInsert = new QTObject(point, object);
                this._setQuadrant(toInsert, north, west);
            }

            // If object exists at this position, add to or replace w/ node
            else if (currentQuadrant instanceof QTObject) {
                const existingContents = currentQuadrant;
                // If insertion point is equal to existing point, add to that content obj
                if (existingContents.point.eq(point)) {
                    existingContents.add(object);
                }
                // If insertion point is different, replace w/ new quadrant & insert existing content
                else {
                    currentQuadrant = this._createSubQuadrant(north, west);
                    existingContents.contents.forEach((contentObj) => {
                        currentQuadrant.insert(existingContents.point, contentObj);
                    });
                }
            }

            // If quadrant at this position is a node, insert in that node
            if (currentQuadrant && currentQuadrant instanceof QTNode) {
                currentQuadrant.insert(point, object);
            }
        }

        search(northWestCorner, southEastCorner) {
            if (!northWestCorner.lte(southEastCorner)) {
                throw 'both dimensions of NW corner must be less than or equal to SE corner.\nNW: ' + northWestCorner.toString() + '\nSE: ' + southEastCorner.toString();
            }

            // If node is fully enclosed, return all objects
            if (northWestCorner.lte(this.northWestCorner) && southEastCorner.gte(this.southEastCorner)) {
                return this.getAllObjects();
            }

            // If not, look through each quadrant
            let foundObjects = [];
            this.quadrants.forEach((quadrant) => {
                // Add enclosed quadrant objects
                if (quadrant instanceof QTObject) {
                    if (northWestCorner.lte(quadrant.point) && southEastCorner.gte(quadrant.point)) {
                        foundObjects = foundObjects.concat(quadrant.contents);
                    }
                }
                // Search sub-quadrants that aren't fully excluded
                else if (quadrant instanceof QTNode) {
                    if (northWestCorner.lte(quadrant.southEastCorner) || southEastCorner.gte(quadrant.northWestCorner)) {
                        const quadrantObjects = quadrant.search(northWestCorner, southEastCorner);
                        foundObjects = foundObjects.concat(quadrantObjects);
                    }
                }
            });
            return foundObjects;
        }

        getAllObjects() {
            let allObjects = [];
            this.quadrants.forEach((quadrant) => {
                if (quadrant instanceof QTNode) allObjects = allObjects.concat(quadrant.getAllObjects());
                else if (quadrant instanceof QTObject) allObjects = allObjects.concat(quadrant.contents);
            });
            return allObjects;
        }

        _createSubQuadrant(north, west) {
            // Create new QT node
            const northWestCorner = new Point(
                west ? 0 : this.midpoint.x,
                north ? 0 : this.midpoint.y
            );
            const southEastCorner = new Point(
                west ? this.midpoint.x : this.southEastCorner.x,
                north ? this.midpoint.y : this.southEastCorner.y
            );
            const newNode = new QTNode(northWestCorner, southEastCorner);

            // Store and return new QT node
            this._setQuadrant(newNode, north, west);
            return newNode;
        }

        _getQuadrant(north, west) {
            return north && west  ?  this.quadrants[0] :
                   north && !west ?  this.quadrants[1] :
                   !north && west ?  this.quadrants[2] :
                                     this.quadrants[3];
        }

        _setQuadrant(quadrant, north, west) {
            if (north && west)   this.quadrants[0] = quadrant;
            if (north & !west)   this.quadrants[1] = quadrant;
            if (!north && west)  this.quadrants[2] = quadrant;
            if (!north && !west) this.quadrants[3] = quadrant;
        }
    }

    /** Quadtree object class, representing objects associated with a single point. */
    class QTObject {
        constructor(point, object) {
            this.point = point;
            this.contents = [object];
        }

        add(object) {
            this.contents.push(object);
        }
    }

    class CanvasUtil {
        static drawLine(context, pointA, pointB, strokeWeight = 1, strokeStyle = '#000') {
            if (strokeWeight <= 0) return;
            const linePath = new Path2D();
            linePath.moveTo(pointA.x, pointA.y);
            linePath.lineTo(pointB.x, pointB.y);
            context.lineWidth = strokeWeight;
            context.strokeStyle = strokeStyle;
            context.stroke(linePath);
        }

        static drawShape(context, points, fillStyle = '#fff', strokeWeight = 0, strokeStyle = '#000') {
            if (points.length < 3) { throw 'Shape can only be drawn with three or more points.'; }

            // Create a path through the input vertices
            let shapeRegion = new Path2D();
            shapeRegion.moveTo(points[0].x, points[0].y);
            for (let pointIdx = 1; pointIdx < points.length; pointIdx++) {
                const point = points[pointIdx];
                shapeRegion.lineTo(point.x, point.y);
            }
            shapeRegion.closePath();

            // Fill and stroke the region
            context.fillStyle = fillStyle;
            context.fill(shapeRegion);
            if (strokeWeight > 0) {
                context.strokeStyle = strokeStyle;
                context.stroke(shapeRegion);
            }
        }
    }

    var presetsObject$2 = {
    	"Mysterious Encoding": {
    	fillWidth: 1,
    	fillHeight: 0.15,
    	horizontalBorderSize: 0,
    	verticalBorderSize: 12,
    	borderColor: "#d9f3f7",
    	primaryColor: "#211d4e",
    	primaryColorLikelihood: 0.6,
    	secondaryColor: "#30975d",
    	randomizeBHue: false,
    	unitSize: 12,
    	maxWidthUnits: 5,
    	maxHeightUnits: 10
    },
    	"Defrag Skyline": {
    	fillWidth: 1,
    	fillHeight: 1,
    	horizontalBorderSize: 1,
    	verticalBorderSize: 0,
    	borderColor: "#ffffff",
    	primaryColor: "#000000",
    	primaryColorLikelihood: 0.89,
    	secondaryColor: "#ffffff",
    	randomizeBHue: false,
    	unitSize: 10,
    	maxWidthUnits: 7,
    	maxHeightUnits: 21
    },
    	"Stripe Season": {
    	fillWidth: 0.5,
    	fillHeight: 1,
    	horizontalBorderSize: 0,
    	verticalBorderSize: 10,
    	borderColor: "#ffffff",
    	primaryColor: "#063c65",
    	primaryColorLikelihood: 0.5,
    	secondaryColor: "#209fee",
    	randomizeBHue: true,
    	unitSize: 20,
    	maxWidthUnits: 5,
    	maxHeightUnits: 15
    }
    };

    class Rectilinear extends Sketch {
        name = 'Rectilinear';
        type = SketchType.Canvas;
        date = new Date('9/14/2022');
        description = `
        Randomly sized rectangles, fit together edge-to-edge, with configurable color palettes. This can generate patterns in a Mondrian-like style, and can achieve many other looks as well.
    `;
        bundledPresets = presetsObject$2;

        params = {
            fillWidth: new FloatParam('Total Width', 1, 0, 1, 0.01, false,
                'Maximum percentage of canvas width that will be filled with rectangles.'),
            fillHeight: new FloatParam('Total Height', 0.8, 0, 1, 0.01, false,
                'Maximum percentage of canvas height that will be filled with rectangles.'),
            horizontalBorderSize: new FloatParam('H Border Px', 3, 0, 30, 1, true,
                'Size of rectangle top/bottom borders, in pixels.'),
            verticalBorderSize: new FloatParam('V Border Px', 3, 0, 30, 1, true,
                'Size of rectangle left/right borders, in pixels.'),

            borderColor: new ColorParam('BG Color', '#ffe2d6',
                'Color of the background, and the borders between rectangles.'),
            primaryColor: new ColorParam('Rect Color A', '#003b57',
                'Primary rectangle color, applied randomly to a subset of shapes.'),
            primaryColorLikelihood: new FloatParam('A Likelihood', 0.5, 0, 1, 0.01, true,
                'Likelihood of each rectangle being the primary color, i.e. rough percentage of primary color coverage.'),
            secondaryColor: new ColorParam('Rect Color B', '#ff4000',
                'Secondary rectangle color, applied to non-primary shapes.'),
            randomizeBHue: new BoolParam('Random B Hue', false,
                'Randomize secondary color hue in HSV color space. Saturation & value are still respected.'),
            newColors: new EventParam('New Colors', this.newColors.bind(this),
                'Regenerate colors, preserving the current shapes.'),

            unitSize: new FloatParam('Unit Size Px', 20, 10, 100, 1, false,
                'Unit size in pixels. Rectangle size will be set in increments of this unit.'),
            maxWidthUnits: new FloatParam('H Max Units', 10, 1, 30, 1, false,
                'Maximum number of units used for the width of each rectangle.'),
            maxHeightUnits: new FloatParam('V Max Units', 15, 1, 30, 1, false,
                'Maximum number of units used for the height of each rectangle.'),
            newShapes: new EventParam('New Shapes', this.newShapes.bind(this),
                'Regenerate shapes. As a side effect, colors will also be regenerated.'),
        };

        structure = undefined;
        initializationNeeded = true;
        initializeIfNeeded(width, height) {
            // Check params to see if initialization is needed
            if (this.structure) {
                const paramsUpdated = this.structure.configIsDifferent(
                    this.params.unitSize.value,
                    this.params.maxWidthUnits.value,
                    this.params.maxHeightUnits.value,
                    this.params.fillWidth.value,
                    this.params.fillHeight.value);
                this.initializationNeeded = this.initializationNeeded || paramsUpdated;
            }

            // Initialize!
            if (this.initializationNeeded) {
                this.structure = new RectStructure(
                    width,
                    height,
                    this.params.unitSize.value,
                    this.params.maxWidthUnits.value,
                    this.params.maxHeightUnits.value,
                    this.params.fillWidth.value,
                    this.params.fillHeight.value);
                this.initializationNeeded = false;
                this.newColorsNeeded = true;
            }
            
            if (this.structure && this.newColorsNeeded) {
                this.structure.rects.forEach((rect) => {
                    // Generate random values for each rect, to be used when coloring
                    rect.primaryRandom = Math.random();
                    rect.colorRandom = Math.random();
                });
                this.newColorsNeeded = false;
            }
        }

        newShapes() {
            this.initializationNeeded = true;
        }

        newColors() {
            this.newColorsNeeded = true;
        }

        sketchFn = ({}) => {
            return ({ context, width, height }) => {
                // Retrieve param values
                const hBorder = this.params.horizontalBorderSize.value;
                const vBorder = this.params.verticalBorderSize.value;
                const borderColor = this.params.borderColor.value;
                const primaryColor = this.params.primaryColor.value;
                const secondaryColor = this.params.secondaryColor.value;
                const primaryColorLikelihood = this.params.primaryColorLikelihood.value;
                const randomizeSecondaryColor = this.params.randomizeBHue.value;

                // Clear and initialize if needed
                this.initializeIfNeeded(width, height);
                context.fillStyle = borderColor;
                context.rect(0, 0, width, height);
                context.fill();

                // Translate canvas if resized from actual structure dimensions
                const widthScale = width / this.structure.fullWidth;
                const heightScale = height / this.structure.fullHeight;
                if (widthScale < heightScale) {
                    const inset = (height - this.structure.fullHeight * widthScale) / 2;
                    context.translate(0, inset);
                    context.scale(widthScale, widthScale);
                } else {
                    const inset = (width - this.structure.fullWidth * heightScale) / 2;
                    context.translate(inset, 0);
                    context.scale(heightScale, heightScale);
                }

                // Fill shapes
                this.structure.rects.forEach((rect) => {
                    const vertices = [
                        rect.topLeft,
                        rect.topRight,
                        rect.bottomRight,
                        rect.bottomLeft
                    ];
                    let fillStyle;
                    if (rect.primaryRandom < primaryColorLikelihood) {
                        fillStyle = primaryColor;
                    } else if (!randomizeSecondaryColor) {
                        fillStyle = secondaryColor;
                    } else {
                        const secondaryHSL = color.parse(secondaryColor).hsl;
                        fillStyle = 'hsl(' + rect.colorRandom * 360 + ', ' + secondaryHSL[1] + '%, ' + secondaryHSL[2] + '%)';
                    }
                    CanvasUtil.drawShape(context, vertices, fillStyle);
                });

                // Draw boundaries only when not filling full height/width
                const topLeft = new Point(0, 0);
                const bottomRight = new Point(width, height);
                this.structure.rects.forEach((rect) => {
                    // Top
                    if (rect.topLeft.y != topLeft.y) {
                        CanvasUtil.drawLine(context, rect.topLeft, rect.topRight, hBorder, borderColor);
                    }
                    // Right
                    if (rect.topRight.x != bottomRight.x) {
                        CanvasUtil.drawLine(context, rect.topRight, rect.bottomRight, vBorder, borderColor);
                    }
                    // Bottom
                    if (rect.bottomRight.y != bottomRight.y) {
                        CanvasUtil.drawLine(context, rect.bottomRight, rect.bottomLeft, hBorder, borderColor);
                    }
                    // Left
                    if (rect.bottomLeft.x != topLeft.x) {
                        CanvasUtil.drawLine(context, rect.bottomLeft, rect.topLeft, vBorder, borderColor);
                    }
                });
            };
        };
    }

    class RectStructure {
        constructor(
            fullWidth, fullHeight, // dimensions
            unitSize, maxWidthUnits, maxHeightUnits, // configuration (units)
            fillWidth, fillHeight // configuration (ratios)
        ) {
            this.fullWidth = fullWidth;
            this.fullHeight = fullHeight;
            [ // Assign all configuration instance variables:
                this.unitSize,
                this.maxWidthUnits,
                this.maxHeightUnits,
                this.fillWidth,
                this.fillHeight
            ] = this.parseConfig(unitSize, maxWidthUnits, maxHeightUnits, fillWidth, fillHeight);
            this.edgeToEdge = true; // No param for now; fill full space when fillWidth or fillHeight are full
            this.generateRects(this.internalTopLeft);
        }

        get internalWidth() {
            const scaledWidth = this.fullWidth * this.fillWidth;
            const adjustWidth = this.fillWidth != 1 || !this.edgeToEdge;
            const unitOverflow = adjustWidth ? scaledWidth % this.unitSize : 0;
            return scaledWidth - unitOverflow;
        }

        get internalHeight() {
            const scaledHeight = this.fullHeight * this.fillHeight;
            const adjustHeight = this.fillHeight != 1 || !this.edgeToEdge;
            const unitOverflow = adjustHeight ? scaledHeight % this.unitSize : 0;
            return scaledHeight - unitOverflow;
        }

        get internalTopLeft() {
            return new Point(
                Math.floor((this.fullWidth - this.internalWidth) / 2),
                Math.floor((this.fullHeight - this.internalHeight) / 2)
            );
        }

        get internalBottomRight() {
            const topLeft = this.internalTopLeft;
            return new Point(
                this.fullWidth - topLeft.x,
                this.fullHeight - topLeft.y
            );
        }

        configIsDifferent(unitSize, maxWidthUnits, maxHeightUnits, fillWidth, fillHeight) {
            const parsedConfig = this.parseConfig(unitSize, maxWidthUnits, maxHeightUnits, fillWidth, fillHeight);
            return this.unitSize != parsedConfig[0] ||
                this.maxWidthUnits != parsedConfig[1] ||
                this.maxHeightUnits != parsedConfig[2] ||
                this.fillWidth != parsedConfig[3] ||
                this.fillHeight != parsedConfig[4];
        }

        parseConfig(unitSize, maxWidthUnits, maxHeightUnits, fillWidth, fillHeight) {
            return [
                Math.floor(unitSize),
                Math.floor(maxWidthUnits),
                Math.floor(maxHeightUnits),
                fillWidth,
                fillHeight
            ];
        }

        reset() {
            this.quadtree = new Quadtree(this.fullWidth, this.fullHeight); // rects in 2D space
            this.rects = []; // holds same data as quadtree, but keeps addition order
            this.rightOpen = []; // rectangles that do not yet have another on their right
            this.bottomOpen = []; // rectangles that do not yet have another beneath them
        }

        generateRects(fromPoint) {
            // Clear and add first rect
            this.reset();
            this.addRect(fromPoint);
        
            // Iterate through queues of rects with open sides to add more
            while (this.rightOpen.length > 0 || this.bottomOpen.length > 0) {
                if (this.bottomOpen.length > 0) {
                    const topRect = this.bottomOpen.shift();
                    const newOrigin = new Point(topRect.x, topRect.y + topRect.height);
                    this.addRect(newOrigin);
                }
                if (this.rightOpen.length > 0) {
                    const leftRect = this.rightOpen.shift();
                    const newOrigin = new Point(leftRect.x + leftRect.width, leftRect.y);
                    this.addRect(newOrigin);
                }
            }
        }

        addRect(fromPoint) {
            // Calculate maximum possible rect size from this point, or return null if invalid
            const maxRectSize = this.maxRectSize(fromPoint, Math.random() > 0.5);
            if (!maxRectSize) return null;

            // Calculate width for next rect
            const minWidthUnits = 1;
            const maxWidthUnits = this.maxWidthUnits;
            const widthRemaining = this.internalBottomRight.x - fromPoint.x;
            let width = Math.min(
                widthRemaining,
                maxRectSize.x,
                this.unitSize * random.rangeFloor(minWidthUnits, maxWidthUnits)
            );
            const widthLeftover = this.internalBottomRight.x - (fromPoint.x + width);
            if (widthLeftover < this.unitSize * minWidthUnits) {
                width += widthLeftover;
            }

            // Calculate height for next rect
            const minHeightUnits = 1;
            const maxHeightUnits = this.maxHeightUnits;
            const heightRemaining = this.internalBottomRight.y - fromPoint.y;
            let height = Math.min(
                heightRemaining,
                maxRectSize.y,
                this.unitSize * random.rangeFloor(minHeightUnits, maxHeightUnits)
            );
            const heightLeftover = this.internalBottomRight.y - (fromPoint.y + height);
            if (heightLeftover < this.unitSize * minHeightUnits) {
                height += heightLeftover;
            }

            // Add the new rectangle, and add it to queues for neighboring rects as appropriate
            const freshRect = new Rect(fromPoint, width, height);
            this.rects.push(freshRect);
            this.quadtree.insert(fromPoint, freshRect);
            if (width != widthRemaining) {
                this.rightOpen.push(freshRect);
            }
            if (height != heightRemaining) {
                this.bottomOpen.push(freshRect);
            }

            // Return the new rect
            return freshRect;
        }

        maxRectSize(fromPoint, preferWidth = true) {
            // Find all possible rect intersections from quadtree
            const maxRectWidth = this.unitSize * this.maxWidthUnits;
            const maxRectHeight = this.unitSize * this.maxHeightUnits;
            const searchNW = new Point(
                fromPoint.x - maxRectWidth,
                fromPoint.y - maxRectHeight
            );
            const searchSE = new Point(
                fromPoint.x + maxRectWidth,
                fromPoint.y + maxRectHeight
            );
            const candidateRects = this.quadtree.search(searchNW, searchSE);

            // Calculate max width & height straight across & down
            let maxWidth = Infinity;
            let maxHeight = Infinity;
            let originInvalid = false;
            candidateRects.forEach((rect) => {
                const horizontalDistance = rect.x - fromPoint.x;
                const verticalDistance = rect.y - fromPoint.y;
                if ((horizontalDistance > 0) && (verticalDistance <= 0) && (rect.height >= -verticalDistance)) {
                    maxWidth = Math.min(maxWidth, horizontalDistance);
                } else if ((verticalDistance > 0) && (horizontalDistance <= 0) && (rect.width >= -horizontalDistance)) {
                    maxHeight = Math.min(maxHeight, verticalDistance);
                } else if ((verticalDistance <= 0) && (horizontalDistance <= 0) && 
                           (rect.height > -verticalDistance) && (rect.width > -horizontalDistance)) {
                    originInvalid = true;
                }
            });

            // If any existing rectangles fully overlap with fromPoint, the origin is invalid
            if (originInvalid) return null;

            // Unless we're strictly building out our rectangles from the top left, the full
            // rect of size [maxWidth, maxHeight] may still overlap with others, so we prefer
            // width or height and find the maximum height/width from that point.
            candidateRects.forEach((rect) => {
                if (preferWidth) {
                    const horizontalDistance = rect.x - maxWidth;
                    const verticalDistance = rect.y - fromPoint.y;
                    if ((verticalDistance > 0) && (horizontalDistance <= 0) && (rect.width >= -horizontalDistance)) {
                        maxHeight = Math.min(maxHeight, verticalDistance);
                    }
                } else {
                    const horizontalDistance = rect.x - fromPoint.x;
                    const verticalDistance = rect.y - maxHeight;
                    if ((horizontalDistance > 0) && (verticalDistance <= 0) && (rect.height >= -verticalDistance)) {
                        maxWidth = Math.min(maxWidth, horizontalDistance);
                    }
                }
            });

            return new Point(maxWidth, maxHeight);
        }
    }

    var regl = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
        module.exports = factory() ;
    }(commonjsGlobal, (function () {
    var isTypedArray = function (x) {
      return (
        x instanceof Uint8Array ||
        x instanceof Uint16Array ||
        x instanceof Uint32Array ||
        x instanceof Int8Array ||
        x instanceof Int16Array ||
        x instanceof Int32Array ||
        x instanceof Float32Array ||
        x instanceof Float64Array ||
        x instanceof Uint8ClampedArray
      )
    };

    var extend = function (base, opts) {
      var keys = Object.keys(opts);
      for (var i = 0; i < keys.length; ++i) {
        base[keys[i]] = opts[keys[i]];
      }
      return base
    };

    // Error checking and parameter validation.
    //
    // Statements for the form `check.someProcedure(...)` get removed by
    // a browserify transform for optimized/minified bundles.
    //
    /* globals atob */
    var endl = '\n';

    // only used for extracting shader names.  if atob not present, then errors
    // will be slightly crappier
    function decodeB64 (str) {
      if (typeof atob !== 'undefined') {
        return atob(str)
      }
      return 'base64:' + str
    }

    function raise (message) {
      var error = new Error('(regl) ' + message);
      console.error(error);
      throw error
    }

    function check (pred, message) {
      if (!pred) {
        raise(message);
      }
    }

    function encolon (message) {
      if (message) {
        return ': ' + message
      }
      return ''
    }

    function checkParameter (param, possibilities, message) {
      if (!(param in possibilities)) {
        raise('unknown parameter (' + param + ')' + encolon(message) +
              '. possible values: ' + Object.keys(possibilities).join());
      }
    }

    function checkIsTypedArray (data, message) {
      if (!isTypedArray(data)) {
        raise(
          'invalid parameter type' + encolon(message) +
          '. must be a typed array');
      }
    }

    function standardTypeEh (value, type) {
      switch (type) {
        case 'number': return typeof value === 'number'
        case 'object': return typeof value === 'object'
        case 'string': return typeof value === 'string'
        case 'boolean': return typeof value === 'boolean'
        case 'function': return typeof value === 'function'
        case 'undefined': return typeof value === 'undefined'
        case 'symbol': return typeof value === 'symbol'
      }
    }

    function checkTypeOf (value, type, message) {
      if (!standardTypeEh(value, type)) {
        raise(
          'invalid parameter type' + encolon(message) +
          '. expected ' + type + ', got ' + (typeof value));
      }
    }

    function checkNonNegativeInt (value, message) {
      if (!((value >= 0) &&
            ((value | 0) === value))) {
        raise('invalid parameter type, (' + value + ')' + encolon(message) +
              '. must be a nonnegative integer');
      }
    }

    function checkOneOf (value, list, message) {
      if (list.indexOf(value) < 0) {
        raise('invalid value' + encolon(message) + '. must be one of: ' + list);
      }
    }

    var constructorKeys = [
      'gl',
      'canvas',
      'container',
      'attributes',
      'pixelRatio',
      'extensions',
      'optionalExtensions',
      'profile',
      'onDone'
    ];

    function checkConstructor (obj) {
      Object.keys(obj).forEach(function (key) {
        if (constructorKeys.indexOf(key) < 0) {
          raise('invalid regl constructor argument "' + key + '". must be one of ' + constructorKeys);
        }
      });
    }

    function leftPad (str, n) {
      str = str + '';
      while (str.length < n) {
        str = ' ' + str;
      }
      return str
    }

    function ShaderFile () {
      this.name = 'unknown';
      this.lines = [];
      this.index = {};
      this.hasErrors = false;
    }

    function ShaderLine (number, line) {
      this.number = number;
      this.line = line;
      this.errors = [];
    }

    function ShaderError (fileNumber, lineNumber, message) {
      this.file = fileNumber;
      this.line = lineNumber;
      this.message = message;
    }

    function guessCommand () {
      var error = new Error();
      var stack = (error.stack || error).toString();
      var pat = /compileProcedure.*\n\s*at.*\((.*)\)/.exec(stack);
      if (pat) {
        return pat[1]
      }
      var pat2 = /compileProcedure.*\n\s*at\s+(.*)(\n|$)/.exec(stack);
      if (pat2) {
        return pat2[1]
      }
      return 'unknown'
    }

    function guessCallSite () {
      var error = new Error();
      var stack = (error.stack || error).toString();
      var pat = /at REGLCommand.*\n\s+at.*\((.*)\)/.exec(stack);
      if (pat) {
        return pat[1]
      }
      var pat2 = /at REGLCommand.*\n\s+at\s+(.*)\n/.exec(stack);
      if (pat2) {
        return pat2[1]
      }
      return 'unknown'
    }

    function parseSource (source, command) {
      var lines = source.split('\n');
      var lineNumber = 1;
      var fileNumber = 0;
      var files = {
        unknown: new ShaderFile(),
        0: new ShaderFile()
      };
      files.unknown.name = files[0].name = command || guessCommand();
      files.unknown.lines.push(new ShaderLine(0, ''));
      for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];
        var parts = /^\s*#\s*(\w+)\s+(.+)\s*$/.exec(line);
        if (parts) {
          switch (parts[1]) {
            case 'line':
              var lineNumberInfo = /(\d+)(\s+\d+)?/.exec(parts[2]);
              if (lineNumberInfo) {
                lineNumber = lineNumberInfo[1] | 0;
                if (lineNumberInfo[2]) {
                  fileNumber = lineNumberInfo[2] | 0;
                  if (!(fileNumber in files)) {
                    files[fileNumber] = new ShaderFile();
                  }
                }
              }
              break
            case 'define':
              var nameInfo = /SHADER_NAME(_B64)?\s+(.*)$/.exec(parts[2]);
              if (nameInfo) {
                files[fileNumber].name = (nameInfo[1]
                  ? decodeB64(nameInfo[2])
                  : nameInfo[2]);
              }
              break
          }
        }
        files[fileNumber].lines.push(new ShaderLine(lineNumber++, line));
      }
      Object.keys(files).forEach(function (fileNumber) {
        var file = files[fileNumber];
        file.lines.forEach(function (line) {
          file.index[line.number] = line;
        });
      });
      return files
    }

    function parseErrorLog (errLog) {
      var result = [];
      errLog.split('\n').forEach(function (errMsg) {
        if (errMsg.length < 5) {
          return
        }
        var parts = /^ERROR:\s+(\d+):(\d+):\s*(.*)$/.exec(errMsg);
        if (parts) {
          result.push(new ShaderError(
            parts[1] | 0,
            parts[2] | 0,
            parts[3].trim()));
        } else if (errMsg.length > 0) {
          result.push(new ShaderError('unknown', 0, errMsg));
        }
      });
      return result
    }

    function annotateFiles (files, errors) {
      errors.forEach(function (error) {
        var file = files[error.file];
        if (file) {
          var line = file.index[error.line];
          if (line) {
            line.errors.push(error);
            file.hasErrors = true;
            return
          }
        }
        files.unknown.hasErrors = true;
        files.unknown.lines[0].errors.push(error);
      });
    }

    function checkShaderError (gl, shader, source, type, command) {
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var errLog = gl.getShaderInfoLog(shader);
        var typeName = type === gl.FRAGMENT_SHADER ? 'fragment' : 'vertex';
        checkCommandType(source, 'string', typeName + ' shader source must be a string', command);
        var files = parseSource(source, command);
        var errors = parseErrorLog(errLog);
        annotateFiles(files, errors);

        Object.keys(files).forEach(function (fileNumber) {
          var file = files[fileNumber];
          if (!file.hasErrors) {
            return
          }

          var strings = [''];
          var styles = [''];

          function push (str, style) {
            strings.push(str);
            styles.push(style || '');
          }

          push('file number ' + fileNumber + ': ' + file.name + '\n', 'color:red;text-decoration:underline;font-weight:bold');

          file.lines.forEach(function (line) {
            if (line.errors.length > 0) {
              push(leftPad(line.number, 4) + '|  ', 'background-color:yellow; font-weight:bold');
              push(line.line + endl, 'color:red; background-color:yellow; font-weight:bold');

              // try to guess token
              var offset = 0;
              line.errors.forEach(function (error) {
                var message = error.message;
                var token = /^\s*'(.*)'\s*:\s*(.*)$/.exec(message);
                if (token) {
                  var tokenPat = token[1];
                  message = token[2];
                  switch (tokenPat) {
                    case 'assign':
                      tokenPat = '=';
                      break
                  }
                  offset = Math.max(line.line.indexOf(tokenPat, offset), 0);
                } else {
                  offset = 0;
                }

                push(leftPad('| ', 6));
                push(leftPad('^^^', offset + 3) + endl, 'font-weight:bold');
                push(leftPad('| ', 6));
                push(message + endl, 'font-weight:bold');
              });
              push(leftPad('| ', 6) + endl);
            } else {
              push(leftPad(line.number, 4) + '|  ');
              push(line.line + endl, 'color:red');
            }
          });
          if (typeof document !== 'undefined' && !window.chrome) {
            styles[0] = strings.join('%c');
            console.log.apply(console, styles);
          } else {
            console.log(strings.join(''));
          }
        });

        check.raise('Error compiling ' + typeName + ' shader, ' + files[0].name);
      }
    }

    function checkLinkError (gl, program, fragShader, vertShader, command) {
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        var errLog = gl.getProgramInfoLog(program);
        var fragParse = parseSource(fragShader, command);
        var vertParse = parseSource(vertShader, command);

        var header = 'Error linking program with vertex shader, "' +
          vertParse[0].name + '", and fragment shader "' + fragParse[0].name + '"';

        if (typeof document !== 'undefined') {
          console.log('%c' + header + endl + '%c' + errLog,
            'color:red;text-decoration:underline;font-weight:bold',
            'color:red');
        } else {
          console.log(header + endl + errLog);
        }
        check.raise(header);
      }
    }

    function saveCommandRef (object) {
      object._commandRef = guessCommand();
    }

    function saveDrawCommandInfo (opts, uniforms, attributes, stringStore) {
      saveCommandRef(opts);

      function id (str) {
        if (str) {
          return stringStore.id(str)
        }
        return 0
      }
      opts._fragId = id(opts.static.frag);
      opts._vertId = id(opts.static.vert);

      function addProps (dict, set) {
        Object.keys(set).forEach(function (u) {
          dict[stringStore.id(u)] = true;
        });
      }

      var uniformSet = opts._uniformSet = {};
      addProps(uniformSet, uniforms.static);
      addProps(uniformSet, uniforms.dynamic);

      var attributeSet = opts._attributeSet = {};
      addProps(attributeSet, attributes.static);
      addProps(attributeSet, attributes.dynamic);

      opts._hasCount = (
        'count' in opts.static ||
        'count' in opts.dynamic ||
        'elements' in opts.static ||
        'elements' in opts.dynamic);
    }

    function commandRaise (message, command) {
      var callSite = guessCallSite();
      raise(message +
        ' in command ' + (command || guessCommand()) +
        (callSite === 'unknown' ? '' : ' called from ' + callSite));
    }

    function checkCommand (pred, message, command) {
      if (!pred) {
        commandRaise(message, command || guessCommand());
      }
    }

    function checkParameterCommand (param, possibilities, message, command) {
      if (!(param in possibilities)) {
        commandRaise(
          'unknown parameter (' + param + ')' + encolon(message) +
          '. possible values: ' + Object.keys(possibilities).join(),
          command || guessCommand());
      }
    }

    function checkCommandType (value, type, message, command) {
      if (!standardTypeEh(value, type)) {
        commandRaise(
          'invalid parameter type' + encolon(message) +
          '. expected ' + type + ', got ' + (typeof value),
          command || guessCommand());
      }
    }

    function checkOptional (block) {
      block();
    }

    function checkFramebufferFormat (attachment, texFormats, rbFormats) {
      if (attachment.texture) {
        checkOneOf(
          attachment.texture._texture.internalformat,
          texFormats,
          'unsupported texture format for attachment');
      } else {
        checkOneOf(
          attachment.renderbuffer._renderbuffer.format,
          rbFormats,
          'unsupported renderbuffer format for attachment');
      }
    }

    var GL_CLAMP_TO_EDGE = 0x812F;

    var GL_NEAREST = 0x2600;
    var GL_NEAREST_MIPMAP_NEAREST = 0x2700;
    var GL_LINEAR_MIPMAP_NEAREST = 0x2701;
    var GL_NEAREST_MIPMAP_LINEAR = 0x2702;
    var GL_LINEAR_MIPMAP_LINEAR = 0x2703;

    var GL_BYTE = 5120;
    var GL_UNSIGNED_BYTE = 5121;
    var GL_SHORT = 5122;
    var GL_UNSIGNED_SHORT = 5123;
    var GL_INT = 5124;
    var GL_UNSIGNED_INT = 5125;
    var GL_FLOAT = 5126;

    var GL_UNSIGNED_SHORT_4_4_4_4 = 0x8033;
    var GL_UNSIGNED_SHORT_5_5_5_1 = 0x8034;
    var GL_UNSIGNED_SHORT_5_6_5 = 0x8363;
    var GL_UNSIGNED_INT_24_8_WEBGL = 0x84FA;

    var GL_HALF_FLOAT_OES = 0x8D61;

    var TYPE_SIZE = {};

    TYPE_SIZE[GL_BYTE] =
    TYPE_SIZE[GL_UNSIGNED_BYTE] = 1;

    TYPE_SIZE[GL_SHORT] =
    TYPE_SIZE[GL_UNSIGNED_SHORT] =
    TYPE_SIZE[GL_HALF_FLOAT_OES] =
    TYPE_SIZE[GL_UNSIGNED_SHORT_5_6_5] =
    TYPE_SIZE[GL_UNSIGNED_SHORT_4_4_4_4] =
    TYPE_SIZE[GL_UNSIGNED_SHORT_5_5_5_1] = 2;

    TYPE_SIZE[GL_INT] =
    TYPE_SIZE[GL_UNSIGNED_INT] =
    TYPE_SIZE[GL_FLOAT] =
    TYPE_SIZE[GL_UNSIGNED_INT_24_8_WEBGL] = 4;

    function pixelSize (type, channels) {
      if (type === GL_UNSIGNED_SHORT_5_5_5_1 ||
          type === GL_UNSIGNED_SHORT_4_4_4_4 ||
          type === GL_UNSIGNED_SHORT_5_6_5) {
        return 2
      } else if (type === GL_UNSIGNED_INT_24_8_WEBGL) {
        return 4
      } else {
        return TYPE_SIZE[type] * channels
      }
    }

    function isPow2 (v) {
      return !(v & (v - 1)) && (!!v)
    }

    function checkTexture2D (info, mipData, limits) {
      var i;
      var w = mipData.width;
      var h = mipData.height;
      var c = mipData.channels;

      // Check texture shape
      check(w > 0 && w <= limits.maxTextureSize &&
            h > 0 && h <= limits.maxTextureSize,
      'invalid texture shape');

      // check wrap mode
      if (info.wrapS !== GL_CLAMP_TO_EDGE || info.wrapT !== GL_CLAMP_TO_EDGE) {
        check(isPow2(w) && isPow2(h),
          'incompatible wrap mode for texture, both width and height must be power of 2');
      }

      if (mipData.mipmask === 1) {
        if (w !== 1 && h !== 1) {
          check(
            info.minFilter !== GL_NEAREST_MIPMAP_NEAREST &&
            info.minFilter !== GL_NEAREST_MIPMAP_LINEAR &&
            info.minFilter !== GL_LINEAR_MIPMAP_NEAREST &&
            info.minFilter !== GL_LINEAR_MIPMAP_LINEAR,
            'min filter requires mipmap');
        }
      } else {
        // texture must be power of 2
        check(isPow2(w) && isPow2(h),
          'texture must be a square power of 2 to support mipmapping');
        check(mipData.mipmask === (w << 1) - 1,
          'missing or incomplete mipmap data');
      }

      if (mipData.type === GL_FLOAT) {
        if (limits.extensions.indexOf('oes_texture_float_linear') < 0) {
          check(info.minFilter === GL_NEAREST && info.magFilter === GL_NEAREST,
            'filter not supported, must enable oes_texture_float_linear');
        }
        check(!info.genMipmaps,
          'mipmap generation not supported with float textures');
      }

      // check image complete
      var mipimages = mipData.images;
      for (i = 0; i < 16; ++i) {
        if (mipimages[i]) {
          var mw = w >> i;
          var mh = h >> i;
          check(mipData.mipmask & (1 << i), 'missing mipmap data');

          var img = mipimages[i];

          check(
            img.width === mw &&
            img.height === mh,
            'invalid shape for mip images');

          check(
            img.format === mipData.format &&
            img.internalformat === mipData.internalformat &&
            img.type === mipData.type,
            'incompatible type for mip image');

          if (img.compressed) ; else if (img.data) {
            // check(img.data.byteLength === mw * mh *
            // Math.max(pixelSize(img.type, c), img.unpackAlignment),
            var rowSize = Math.ceil(pixelSize(img.type, c) * mw / img.unpackAlignment) * img.unpackAlignment;
            check(img.data.byteLength === rowSize * mh,
              'invalid data for image, buffer size is inconsistent with image format');
          } else if (img.element) ; else if (img.copy) ;
        } else if (!info.genMipmaps) {
          check((mipData.mipmask & (1 << i)) === 0, 'extra mipmap data');
        }
      }

      if (mipData.compressed) {
        check(!info.genMipmaps,
          'mipmap generation for compressed images not supported');
      }
    }

    function checkTextureCube (texture, info, faces, limits) {
      var w = texture.width;
      var h = texture.height;
      var c = texture.channels;

      // Check texture shape
      check(
        w > 0 && w <= limits.maxTextureSize && h > 0 && h <= limits.maxTextureSize,
        'invalid texture shape');
      check(
        w === h,
        'cube map must be square');
      check(
        info.wrapS === GL_CLAMP_TO_EDGE && info.wrapT === GL_CLAMP_TO_EDGE,
        'wrap mode not supported by cube map');

      for (var i = 0; i < faces.length; ++i) {
        var face = faces[i];
        check(
          face.width === w && face.height === h,
          'inconsistent cube map face shape');

        if (info.genMipmaps) {
          check(!face.compressed,
            'can not generate mipmap for compressed textures');
          check(face.mipmask === 1,
            'can not specify mipmaps and generate mipmaps');
        }

        var mipmaps = face.images;
        for (var j = 0; j < 16; ++j) {
          var img = mipmaps[j];
          if (img) {
            var mw = w >> j;
            var mh = h >> j;
            check(face.mipmask & (1 << j), 'missing mipmap data');
            check(
              img.width === mw &&
              img.height === mh,
              'invalid shape for mip images');
            check(
              img.format === texture.format &&
              img.internalformat === texture.internalformat &&
              img.type === texture.type,
              'incompatible type for mip image');

            if (img.compressed) ; else if (img.data) {
              check(img.data.byteLength === mw * mh *
                Math.max(pixelSize(img.type, c), img.unpackAlignment),
              'invalid data for image, buffer size is inconsistent with image format');
            } else if (img.element) ; else if (img.copy) ;
          }
        }
      }
    }

    var check$1 = extend(check, {
      optional: checkOptional,
      raise: raise,
      commandRaise: commandRaise,
      command: checkCommand,
      parameter: checkParameter,
      commandParameter: checkParameterCommand,
      constructor: checkConstructor,
      type: checkTypeOf,
      commandType: checkCommandType,
      isTypedArray: checkIsTypedArray,
      nni: checkNonNegativeInt,
      oneOf: checkOneOf,
      shaderError: checkShaderError,
      linkError: checkLinkError,
      callSite: guessCallSite,
      saveCommandRef: saveCommandRef,
      saveDrawInfo: saveDrawCommandInfo,
      framebufferFormat: checkFramebufferFormat,
      guessCommand: guessCommand,
      texture2D: checkTexture2D,
      textureCube: checkTextureCube
    });

    var VARIABLE_COUNTER = 0;

    var DYN_FUNC = 0;
    var DYN_CONSTANT = 5;
    var DYN_ARRAY = 6;

    function DynamicVariable (type, data) {
      this.id = (VARIABLE_COUNTER++);
      this.type = type;
      this.data = data;
    }

    function escapeStr (str) {
      return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    }

    function splitParts (str) {
      if (str.length === 0) {
        return []
      }

      var firstChar = str.charAt(0);
      var lastChar = str.charAt(str.length - 1);

      if (str.length > 1 &&
          firstChar === lastChar &&
          (firstChar === '"' || firstChar === "'")) {
        return ['"' + escapeStr(str.substr(1, str.length - 2)) + '"']
      }

      var parts = /\[(false|true|null|\d+|'[^']*'|"[^"]*")\]/.exec(str);
      if (parts) {
        return (
          splitParts(str.substr(0, parts.index))
            .concat(splitParts(parts[1]))
            .concat(splitParts(str.substr(parts.index + parts[0].length)))
        )
      }

      var subparts = str.split('.');
      if (subparts.length === 1) {
        return ['"' + escapeStr(str) + '"']
      }

      var result = [];
      for (var i = 0; i < subparts.length; ++i) {
        result = result.concat(splitParts(subparts[i]));
      }
      return result
    }

    function toAccessorString (str) {
      return '[' + splitParts(str).join('][') + ']'
    }

    function defineDynamic (type, data) {
      return new DynamicVariable(type, toAccessorString(data + ''))
    }

    function isDynamic (x) {
      return (typeof x === 'function' && !x._reglType) || (x instanceof DynamicVariable)
    }

    function unbox (x, path) {
      if (typeof x === 'function') {
        return new DynamicVariable(DYN_FUNC, x)
      } else if (typeof x === 'number' || typeof x === 'boolean') {
        return new DynamicVariable(DYN_CONSTANT, x)
      } else if (Array.isArray(x)) {
        return new DynamicVariable(DYN_ARRAY, x.map((y, i) => unbox(y, path + '[' + i + ']')))
      } else if (x instanceof DynamicVariable) {
        return x
      }
      check$1(false, 'invalid option type in uniform ' + path);
    }

    var dynamic = {
      DynamicVariable: DynamicVariable,
      define: defineDynamic,
      isDynamic: isDynamic,
      unbox: unbox,
      accessor: toAccessorString
    };

    /* globals requestAnimationFrame, cancelAnimationFrame */
    var raf = {
      next: typeof requestAnimationFrame === 'function'
        ? function (cb) { return requestAnimationFrame(cb) }
        : function (cb) { return setTimeout(cb, 16) },
      cancel: typeof cancelAnimationFrame === 'function'
        ? function (raf) { return cancelAnimationFrame(raf) }
        : clearTimeout
    };

    /* globals performance */
    var clock = (typeof performance !== 'undefined' && performance.now)
        ? function () { return performance.now() }
        : function () { return +(new Date()) };

    function createStringStore () {
      var stringIds = { '': 0 };
      var stringValues = [''];
      return {
        id: function (str) {
          var result = stringIds[str];
          if (result) {
            return result
          }
          result = stringIds[str] = stringValues.length;
          stringValues.push(str);
          return result
        },

        str: function (id) {
          return stringValues[id]
        }
      }
    }

    // Context and canvas creation helper functions
    function createCanvas (element, onDone, pixelRatio) {
      var canvas = document.createElement('canvas');
      extend(canvas.style, {
        border: 0,
        margin: 0,
        padding: 0,
        top: 0,
        left: 0
      });
      element.appendChild(canvas);

      if (element === document.body) {
        canvas.style.position = 'absolute';
        extend(element.style, {
          margin: 0,
          padding: 0
        });
      }

      function resize () {
        var w = window.innerWidth;
        var h = window.innerHeight;
        if (element !== document.body) {
          var bounds = element.getBoundingClientRect();
          w = bounds.right - bounds.left;
          h = bounds.bottom - bounds.top;
        }
        canvas.width = pixelRatio * w;
        canvas.height = pixelRatio * h;
        extend(canvas.style, {
          width: w + 'px',
          height: h + 'px'
        });
      }

      var resizeObserver;
      if (element !== document.body && typeof ResizeObserver === 'function') {
        // ignore 'ResizeObserver' is not defined
        // eslint-disable-next-line
        resizeObserver = new ResizeObserver(function () {
          // setTimeout to avoid flicker
          setTimeout(resize);
        });
        resizeObserver.observe(element);
      } else {
        window.addEventListener('resize', resize, false);
      }

      function onDestroy () {
        if (resizeObserver) {
          resizeObserver.disconnect();
        } else {
          window.removeEventListener('resize', resize);
        }
        element.removeChild(canvas);
      }

      resize();

      return {
        canvas: canvas,
        onDestroy: onDestroy
      }
    }

    function createContext (canvas, contextAttributes) {
      function get (name) {
        try {
          return canvas.getContext(name, contextAttributes)
        } catch (e) {
          return null
        }
      }
      return (
        get('webgl') ||
        get('experimental-webgl') ||
        get('webgl-experimental')
      )
    }

    function isHTMLElement (obj) {
      return (
        typeof obj.nodeName === 'string' &&
        typeof obj.appendChild === 'function' &&
        typeof obj.getBoundingClientRect === 'function'
      )
    }

    function isWebGLContext (obj) {
      return (
        typeof obj.drawArrays === 'function' ||
        typeof obj.drawElements === 'function'
      )
    }

    function parseExtensions (input) {
      if (typeof input === 'string') {
        return input.split()
      }
      check$1(Array.isArray(input), 'invalid extension array');
      return input
    }

    function getElement (desc) {
      if (typeof desc === 'string') {
        check$1(typeof document !== 'undefined', 'not supported outside of DOM');
        return document.querySelector(desc)
      }
      return desc
    }

    function parseArgs (args_) {
      var args = args_ || {};
      var element, container, canvas, gl;
      var contextAttributes = {};
      var extensions = [];
      var optionalExtensions = [];
      var pixelRatio = (typeof window === 'undefined' ? 1 : window.devicePixelRatio);
      var profile = false;
      var onDone = function (err) {
        if (err) {
          check$1.raise(err);
        }
      };
      var onDestroy = function () {};
      if (typeof args === 'string') {
        check$1(
          typeof document !== 'undefined',
          'selector queries only supported in DOM enviroments');
        element = document.querySelector(args);
        check$1(element, 'invalid query string for element');
      } else if (typeof args === 'object') {
        if (isHTMLElement(args)) {
          element = args;
        } else if (isWebGLContext(args)) {
          gl = args;
          canvas = gl.canvas;
        } else {
          check$1.constructor(args);
          if ('gl' in args) {
            gl = args.gl;
          } else if ('canvas' in args) {
            canvas = getElement(args.canvas);
          } else if ('container' in args) {
            container = getElement(args.container);
          }
          if ('attributes' in args) {
            contextAttributes = args.attributes;
            check$1.type(contextAttributes, 'object', 'invalid context attributes');
          }
          if ('extensions' in args) {
            extensions = parseExtensions(args.extensions);
          }
          if ('optionalExtensions' in args) {
            optionalExtensions = parseExtensions(args.optionalExtensions);
          }
          if ('onDone' in args) {
            check$1.type(
              args.onDone, 'function',
              'invalid or missing onDone callback');
            onDone = args.onDone;
          }
          if ('profile' in args) {
            profile = !!args.profile;
          }
          if ('pixelRatio' in args) {
            pixelRatio = +args.pixelRatio;
            check$1(pixelRatio > 0, 'invalid pixel ratio');
          }
        }
      } else {
        check$1.raise('invalid arguments to regl');
      }

      if (element) {
        if (element.nodeName.toLowerCase() === 'canvas') {
          canvas = element;
        } else {
          container = element;
        }
      }

      if (!gl) {
        if (!canvas) {
          check$1(
            typeof document !== 'undefined',
            'must manually specify webgl context outside of DOM environments');
          var result = createCanvas(container || document.body, onDone, pixelRatio);
          if (!result) {
            return null
          }
          canvas = result.canvas;
          onDestroy = result.onDestroy;
        }
        // workaround for chromium bug, premultiplied alpha value is platform dependent
        if (contextAttributes.premultipliedAlpha === undefined) contextAttributes.premultipliedAlpha = true;
        gl = createContext(canvas, contextAttributes);
      }

      if (!gl) {
        onDestroy();
        onDone('webgl not supported, try upgrading your browser or graphics drivers http://get.webgl.org');
        return null
      }

      return {
        gl: gl,
        canvas: canvas,
        container: container,
        extensions: extensions,
        optionalExtensions: optionalExtensions,
        pixelRatio: pixelRatio,
        profile: profile,
        onDone: onDone,
        onDestroy: onDestroy
      }
    }

    function createExtensionCache (gl, config) {
      var extensions = {};

      function tryLoadExtension (name_) {
        check$1.type(name_, 'string', 'extension name must be string');
        var name = name_.toLowerCase();
        var ext;
        try {
          ext = extensions[name] = gl.getExtension(name);
        } catch (e) {}
        return !!ext
      }

      for (var i = 0; i < config.extensions.length; ++i) {
        var name = config.extensions[i];
        if (!tryLoadExtension(name)) {
          config.onDestroy();
          config.onDone('"' + name + '" extension is not supported by the current WebGL context, try upgrading your system or a different browser');
          return null
        }
      }

      config.optionalExtensions.forEach(tryLoadExtension);

      return {
        extensions: extensions,
        restore: function () {
          Object.keys(extensions).forEach(function (name) {
            if (extensions[name] && !tryLoadExtension(name)) {
              throw new Error('(regl): error restoring extension ' + name)
            }
          });
        }
      }
    }

    function loop (n, f) {
      var result = Array(n);
      for (var i = 0; i < n; ++i) {
        result[i] = f(i);
      }
      return result
    }

    var GL_BYTE$1 = 5120;
    var GL_UNSIGNED_BYTE$2 = 5121;
    var GL_SHORT$1 = 5122;
    var GL_UNSIGNED_SHORT$1 = 5123;
    var GL_INT$1 = 5124;
    var GL_UNSIGNED_INT$1 = 5125;
    var GL_FLOAT$2 = 5126;

    function nextPow16 (v) {
      for (var i = 16; i <= (1 << 28); i *= 16) {
        if (v <= i) {
          return i
        }
      }
      return 0
    }

    function log2 (v) {
      var r, shift;
      r = (v > 0xFFFF) << 4;
      v >>>= r;
      shift = (v > 0xFF) << 3;
      v >>>= shift; r |= shift;
      shift = (v > 0xF) << 2;
      v >>>= shift; r |= shift;
      shift = (v > 0x3) << 1;
      v >>>= shift; r |= shift;
      return r | (v >> 1)
    }

    function createPool () {
      var bufferPool = loop(8, function () {
        return []
      });

      function alloc (n) {
        var sz = nextPow16(n);
        var bin = bufferPool[log2(sz) >> 2];
        if (bin.length > 0) {
          return bin.pop()
        }
        return new ArrayBuffer(sz)
      }

      function free (buf) {
        bufferPool[log2(buf.byteLength) >> 2].push(buf);
      }

      function allocType (type, n) {
        var result = null;
        switch (type) {
          case GL_BYTE$1:
            result = new Int8Array(alloc(n), 0, n);
            break
          case GL_UNSIGNED_BYTE$2:
            result = new Uint8Array(alloc(n), 0, n);
            break
          case GL_SHORT$1:
            result = new Int16Array(alloc(2 * n), 0, n);
            break
          case GL_UNSIGNED_SHORT$1:
            result = new Uint16Array(alloc(2 * n), 0, n);
            break
          case GL_INT$1:
            result = new Int32Array(alloc(4 * n), 0, n);
            break
          case GL_UNSIGNED_INT$1:
            result = new Uint32Array(alloc(4 * n), 0, n);
            break
          case GL_FLOAT$2:
            result = new Float32Array(alloc(4 * n), 0, n);
            break
          default:
            return null
        }
        if (result.length !== n) {
          return result.subarray(0, n)
        }
        return result
      }

      function freeType (array) {
        free(array.buffer);
      }

      return {
        alloc: alloc,
        free: free,
        allocType: allocType,
        freeType: freeType
      }
    }

    var pool = createPool();

    // zero pool for initial zero data
    pool.zero = createPool();

    var GL_SUBPIXEL_BITS = 0x0D50;
    var GL_RED_BITS = 0x0D52;
    var GL_GREEN_BITS = 0x0D53;
    var GL_BLUE_BITS = 0x0D54;
    var GL_ALPHA_BITS = 0x0D55;
    var GL_DEPTH_BITS = 0x0D56;
    var GL_STENCIL_BITS = 0x0D57;

    var GL_ALIASED_POINT_SIZE_RANGE = 0x846D;
    var GL_ALIASED_LINE_WIDTH_RANGE = 0x846E;

    var GL_MAX_TEXTURE_SIZE = 0x0D33;
    var GL_MAX_VIEWPORT_DIMS = 0x0D3A;
    var GL_MAX_VERTEX_ATTRIBS = 0x8869;
    var GL_MAX_VERTEX_UNIFORM_VECTORS = 0x8DFB;
    var GL_MAX_VARYING_VECTORS = 0x8DFC;
    var GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8B4D;
    var GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS = 0x8B4C;
    var GL_MAX_TEXTURE_IMAGE_UNITS = 0x8872;
    var GL_MAX_FRAGMENT_UNIFORM_VECTORS = 0x8DFD;
    var GL_MAX_CUBE_MAP_TEXTURE_SIZE = 0x851C;
    var GL_MAX_RENDERBUFFER_SIZE = 0x84E8;

    var GL_VENDOR = 0x1F00;
    var GL_RENDERER = 0x1F01;
    var GL_VERSION = 0x1F02;
    var GL_SHADING_LANGUAGE_VERSION = 0x8B8C;

    var GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FF;

    var GL_MAX_COLOR_ATTACHMENTS_WEBGL = 0x8CDF;
    var GL_MAX_DRAW_BUFFERS_WEBGL = 0x8824;

    var GL_TEXTURE_2D = 0x0DE1;
    var GL_TEXTURE_CUBE_MAP = 0x8513;
    var GL_TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515;
    var GL_TEXTURE0 = 0x84C0;
    var GL_RGBA = 0x1908;
    var GL_FLOAT$1 = 0x1406;
    var GL_UNSIGNED_BYTE$1 = 0x1401;
    var GL_FRAMEBUFFER = 0x8D40;
    var GL_FRAMEBUFFER_COMPLETE = 0x8CD5;
    var GL_COLOR_ATTACHMENT0 = 0x8CE0;
    var GL_COLOR_BUFFER_BIT$1 = 0x4000;

    var wrapLimits = function (gl, extensions) {
      var maxAnisotropic = 1;
      if (extensions.ext_texture_filter_anisotropic) {
        maxAnisotropic = gl.getParameter(GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT);
      }

      var maxDrawbuffers = 1;
      var maxColorAttachments = 1;
      if (extensions.webgl_draw_buffers) {
        maxDrawbuffers = gl.getParameter(GL_MAX_DRAW_BUFFERS_WEBGL);
        maxColorAttachments = gl.getParameter(GL_MAX_COLOR_ATTACHMENTS_WEBGL);
      }

      // detect if reading float textures is available (Safari doesn't support)
      var readFloat = !!extensions.oes_texture_float;
      if (readFloat) {
        var readFloatTexture = gl.createTexture();
        gl.bindTexture(GL_TEXTURE_2D, readFloatTexture);
        gl.texImage2D(GL_TEXTURE_2D, 0, GL_RGBA, 1, 1, 0, GL_RGBA, GL_FLOAT$1, null);

        var fbo = gl.createFramebuffer();
        gl.bindFramebuffer(GL_FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, readFloatTexture, 0);
        gl.bindTexture(GL_TEXTURE_2D, null);

        if (gl.checkFramebufferStatus(GL_FRAMEBUFFER) !== GL_FRAMEBUFFER_COMPLETE) readFloat = false;

        else {
          gl.viewport(0, 0, 1, 1);
          gl.clearColor(1.0, 0.0, 0.0, 1.0);
          gl.clear(GL_COLOR_BUFFER_BIT$1);
          var pixels = pool.allocType(GL_FLOAT$1, 4);
          gl.readPixels(0, 0, 1, 1, GL_RGBA, GL_FLOAT$1, pixels);

          if (gl.getError()) readFloat = false;
          else {
            gl.deleteFramebuffer(fbo);
            gl.deleteTexture(readFloatTexture);

            readFloat = pixels[0] === 1.0;
          }

          pool.freeType(pixels);
        }
      }

      // detect non power of two cube textures support (IE doesn't support)
      var isIE = typeof navigator !== 'undefined' && (/MSIE/.test(navigator.userAgent) || /Trident\//.test(navigator.appVersion) || /Edge/.test(navigator.userAgent));

      var npotTextureCube = true;

      if (!isIE) {
        var cubeTexture = gl.createTexture();
        var data = pool.allocType(GL_UNSIGNED_BYTE$1, 36);
        gl.activeTexture(GL_TEXTURE0);
        gl.bindTexture(GL_TEXTURE_CUBE_MAP, cubeTexture);
        gl.texImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X, 0, GL_RGBA, 3, 3, 0, GL_RGBA, GL_UNSIGNED_BYTE$1, data);
        pool.freeType(data);
        gl.bindTexture(GL_TEXTURE_CUBE_MAP, null);
        gl.deleteTexture(cubeTexture);
        npotTextureCube = !gl.getError();
      }

      return {
        // drawing buffer bit depth
        colorBits: [
          gl.getParameter(GL_RED_BITS),
          gl.getParameter(GL_GREEN_BITS),
          gl.getParameter(GL_BLUE_BITS),
          gl.getParameter(GL_ALPHA_BITS)
        ],
        depthBits: gl.getParameter(GL_DEPTH_BITS),
        stencilBits: gl.getParameter(GL_STENCIL_BITS),
        subpixelBits: gl.getParameter(GL_SUBPIXEL_BITS),

        // supported extensions
        extensions: Object.keys(extensions).filter(function (ext) {
          return !!extensions[ext]
        }),

        // max aniso samples
        maxAnisotropic: maxAnisotropic,

        // max draw buffers
        maxDrawbuffers: maxDrawbuffers,
        maxColorAttachments: maxColorAttachments,

        // point and line size ranges
        pointSizeDims: gl.getParameter(GL_ALIASED_POINT_SIZE_RANGE),
        lineWidthDims: gl.getParameter(GL_ALIASED_LINE_WIDTH_RANGE),
        maxViewportDims: gl.getParameter(GL_MAX_VIEWPORT_DIMS),
        maxCombinedTextureUnits: gl.getParameter(GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS),
        maxCubeMapSize: gl.getParameter(GL_MAX_CUBE_MAP_TEXTURE_SIZE),
        maxRenderbufferSize: gl.getParameter(GL_MAX_RENDERBUFFER_SIZE),
        maxTextureUnits: gl.getParameter(GL_MAX_TEXTURE_IMAGE_UNITS),
        maxTextureSize: gl.getParameter(GL_MAX_TEXTURE_SIZE),
        maxAttributes: gl.getParameter(GL_MAX_VERTEX_ATTRIBS),
        maxVertexUniforms: gl.getParameter(GL_MAX_VERTEX_UNIFORM_VECTORS),
        maxVertexTextureUnits: gl.getParameter(GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS),
        maxVaryingVectors: gl.getParameter(GL_MAX_VARYING_VECTORS),
        maxFragmentUniforms: gl.getParameter(GL_MAX_FRAGMENT_UNIFORM_VECTORS),

        // vendor info
        glsl: gl.getParameter(GL_SHADING_LANGUAGE_VERSION),
        renderer: gl.getParameter(GL_RENDERER),
        vendor: gl.getParameter(GL_VENDOR),
        version: gl.getParameter(GL_VERSION),

        // quirks
        readFloat: readFloat,
        npotTextureCube: npotTextureCube
      }
    };

    function isNDArrayLike (obj) {
      return (
        !!obj &&
        typeof obj === 'object' &&
        Array.isArray(obj.shape) &&
        Array.isArray(obj.stride) &&
        typeof obj.offset === 'number' &&
        obj.shape.length === obj.stride.length &&
        (Array.isArray(obj.data) ||
          isTypedArray(obj.data)))
    }

    var values = function (obj) {
      return Object.keys(obj).map(function (key) { return obj[key] })
    };

    var flattenUtils = {
      shape: arrayShape$1,
      flatten: flattenArray
    };

    function flatten1D (array, nx, out) {
      for (var i = 0; i < nx; ++i) {
        out[i] = array[i];
      }
    }

    function flatten2D (array, nx, ny, out) {
      var ptr = 0;
      for (var i = 0; i < nx; ++i) {
        var row = array[i];
        for (var j = 0; j < ny; ++j) {
          out[ptr++] = row[j];
        }
      }
    }

    function flatten3D (array, nx, ny, nz, out, ptr_) {
      var ptr = ptr_;
      for (var i = 0; i < nx; ++i) {
        var row = array[i];
        for (var j = 0; j < ny; ++j) {
          var col = row[j];
          for (var k = 0; k < nz; ++k) {
            out[ptr++] = col[k];
          }
        }
      }
    }

    function flattenRec (array, shape, level, out, ptr) {
      var stride = 1;
      for (var i = level + 1; i < shape.length; ++i) {
        stride *= shape[i];
      }
      var n = shape[level];
      if (shape.length - level === 4) {
        var nx = shape[level + 1];
        var ny = shape[level + 2];
        var nz = shape[level + 3];
        for (i = 0; i < n; ++i) {
          flatten3D(array[i], nx, ny, nz, out, ptr);
          ptr += stride;
        }
      } else {
        for (i = 0; i < n; ++i) {
          flattenRec(array[i], shape, level + 1, out, ptr);
          ptr += stride;
        }
      }
    }

    function flattenArray (array, shape, type, out_) {
      var sz = 1;
      if (shape.length) {
        for (var i = 0; i < shape.length; ++i) {
          sz *= shape[i];
        }
      } else {
        sz = 0;
      }
      var out = out_ || pool.allocType(type, sz);
      switch (shape.length) {
        case 0:
          break
        case 1:
          flatten1D(array, shape[0], out);
          break
        case 2:
          flatten2D(array, shape[0], shape[1], out);
          break
        case 3:
          flatten3D(array, shape[0], shape[1], shape[2], out, 0);
          break
        default:
          flattenRec(array, shape, 0, out, 0);
      }
      return out
    }

    function arrayShape$1 (array_) {
      var shape = [];
      for (var array = array_; array.length; array = array[0]) {
        shape.push(array.length);
      }
      return shape
    }

    var arrayTypes =  {
    	"[object Int8Array]": 5120,
    	"[object Int16Array]": 5122,
    	"[object Int32Array]": 5124,
    	"[object Uint8Array]": 5121,
    	"[object Uint8ClampedArray]": 5121,
    	"[object Uint16Array]": 5123,
    	"[object Uint32Array]": 5125,
    	"[object Float32Array]": 5126,
    	"[object Float64Array]": 5121,
    	"[object ArrayBuffer]": 5121
    };

    var int8 = 5120;
    var int16 = 5122;
    var int32 = 5124;
    var uint8 = 5121;
    var uint16 = 5123;
    var uint32 = 5125;
    var float = 5126;
    var float32 = 5126;
    var glTypes = {
    	int8: int8,
    	int16: int16,
    	int32: int32,
    	uint8: uint8,
    	uint16: uint16,
    	uint32: uint32,
    	float: float,
    	float32: float32
    };

    var dynamic$1 = 35048;
    var stream = 35040;
    var usageTypes = {
    	dynamic: dynamic$1,
    	stream: stream,
    	"static": 35044
    };

    var arrayFlatten = flattenUtils.flatten;
    var arrayShape = flattenUtils.shape;

    var GL_STATIC_DRAW = 0x88E4;
    var GL_STREAM_DRAW = 0x88E0;

    var GL_UNSIGNED_BYTE$3 = 5121;
    var GL_FLOAT$3 = 5126;

    var DTYPES_SIZES = [];
    DTYPES_SIZES[5120] = 1; // int8
    DTYPES_SIZES[5122] = 2; // int16
    DTYPES_SIZES[5124] = 4; // int32
    DTYPES_SIZES[5121] = 1; // uint8
    DTYPES_SIZES[5123] = 2; // uint16
    DTYPES_SIZES[5125] = 4; // uint32
    DTYPES_SIZES[5126] = 4; // float32

    function typedArrayCode (data) {
      return arrayTypes[Object.prototype.toString.call(data)] | 0
    }

    function copyArray (out, inp) {
      for (var i = 0; i < inp.length; ++i) {
        out[i] = inp[i];
      }
    }

    function transpose (
      result, data, shapeX, shapeY, strideX, strideY, offset) {
      var ptr = 0;
      for (var i = 0; i < shapeX; ++i) {
        for (var j = 0; j < shapeY; ++j) {
          result[ptr++] = data[strideX * i + strideY * j + offset];
        }
      }
    }

    function wrapBufferState (gl, stats, config, destroyBuffer) {
      var bufferCount = 0;
      var bufferSet = {};

      function REGLBuffer (type) {
        this.id = bufferCount++;
        this.buffer = gl.createBuffer();
        this.type = type;
        this.usage = GL_STATIC_DRAW;
        this.byteLength = 0;
        this.dimension = 1;
        this.dtype = GL_UNSIGNED_BYTE$3;

        this.persistentData = null;

        if (config.profile) {
          this.stats = { size: 0 };
        }
      }

      REGLBuffer.prototype.bind = function () {
        gl.bindBuffer(this.type, this.buffer);
      };

      REGLBuffer.prototype.destroy = function () {
        destroy(this);
      };

      var streamPool = [];

      function createStream (type, data) {
        var buffer = streamPool.pop();
        if (!buffer) {
          buffer = new REGLBuffer(type);
        }
        buffer.bind();
        initBufferFromData(buffer, data, GL_STREAM_DRAW, 0, 1, false);
        return buffer
      }

      function destroyStream (stream$$1) {
        streamPool.push(stream$$1);
      }

      function initBufferFromTypedArray (buffer, data, usage) {
        buffer.byteLength = data.byteLength;
        gl.bufferData(buffer.type, data, usage);
      }

      function initBufferFromData (buffer, data, usage, dtype, dimension, persist) {
        var shape;
        buffer.usage = usage;
        if (Array.isArray(data)) {
          buffer.dtype = dtype || GL_FLOAT$3;
          if (data.length > 0) {
            var flatData;
            if (Array.isArray(data[0])) {
              shape = arrayShape(data);
              var dim = 1;
              for (var i = 1; i < shape.length; ++i) {
                dim *= shape[i];
              }
              buffer.dimension = dim;
              flatData = arrayFlatten(data, shape, buffer.dtype);
              initBufferFromTypedArray(buffer, flatData, usage);
              if (persist) {
                buffer.persistentData = flatData;
              } else {
                pool.freeType(flatData);
              }
            } else if (typeof data[0] === 'number') {
              buffer.dimension = dimension;
              var typedData = pool.allocType(buffer.dtype, data.length);
              copyArray(typedData, data);
              initBufferFromTypedArray(buffer, typedData, usage);
              if (persist) {
                buffer.persistentData = typedData;
              } else {
                pool.freeType(typedData);
              }
            } else if (isTypedArray(data[0])) {
              buffer.dimension = data[0].length;
              buffer.dtype = dtype || typedArrayCode(data[0]) || GL_FLOAT$3;
              flatData = arrayFlatten(
                data,
                [data.length, data[0].length],
                buffer.dtype);
              initBufferFromTypedArray(buffer, flatData, usage);
              if (persist) {
                buffer.persistentData = flatData;
              } else {
                pool.freeType(flatData);
              }
            } else {
              check$1.raise('invalid buffer data');
            }
          }
        } else if (isTypedArray(data)) {
          buffer.dtype = dtype || typedArrayCode(data);
          buffer.dimension = dimension;
          initBufferFromTypedArray(buffer, data, usage);
          if (persist) {
            buffer.persistentData = new Uint8Array(new Uint8Array(data.buffer));
          }
        } else if (isNDArrayLike(data)) {
          shape = data.shape;
          var stride = data.stride;
          var offset = data.offset;

          var shapeX = 0;
          var shapeY = 0;
          var strideX = 0;
          var strideY = 0;
          if (shape.length === 1) {
            shapeX = shape[0];
            shapeY = 1;
            strideX = stride[0];
            strideY = 0;
          } else if (shape.length === 2) {
            shapeX = shape[0];
            shapeY = shape[1];
            strideX = stride[0];
            strideY = stride[1];
          } else {
            check$1.raise('invalid shape');
          }

          buffer.dtype = dtype || typedArrayCode(data.data) || GL_FLOAT$3;
          buffer.dimension = shapeY;

          var transposeData = pool.allocType(buffer.dtype, shapeX * shapeY);
          transpose(transposeData,
            data.data,
            shapeX, shapeY,
            strideX, strideY,
            offset);
          initBufferFromTypedArray(buffer, transposeData, usage);
          if (persist) {
            buffer.persistentData = transposeData;
          } else {
            pool.freeType(transposeData);
          }
        } else if (data instanceof ArrayBuffer) {
          buffer.dtype = GL_UNSIGNED_BYTE$3;
          buffer.dimension = dimension;
          initBufferFromTypedArray(buffer, data, usage);
          if (persist) {
            buffer.persistentData = new Uint8Array(new Uint8Array(data));
          }
        } else {
          check$1.raise('invalid buffer data');
        }
      }

      function destroy (buffer) {
        stats.bufferCount--;

        // remove attribute link
        destroyBuffer(buffer);

        var handle = buffer.buffer;
        check$1(handle, 'buffer must not be deleted already');
        gl.deleteBuffer(handle);
        buffer.buffer = null;
        delete bufferSet[buffer.id];
      }

      function createBuffer (options, type, deferInit, persistent) {
        stats.bufferCount++;

        var buffer = new REGLBuffer(type);
        bufferSet[buffer.id] = buffer;

        function reglBuffer (options) {
          var usage = GL_STATIC_DRAW;
          var data = null;
          var byteLength = 0;
          var dtype = 0;
          var dimension = 1;
          if (Array.isArray(options) ||
              isTypedArray(options) ||
              isNDArrayLike(options) ||
              options instanceof ArrayBuffer) {
            data = options;
          } else if (typeof options === 'number') {
            byteLength = options | 0;
          } else if (options) {
            check$1.type(
              options, 'object',
              'buffer arguments must be an object, a number or an array');

            if ('data' in options) {
              check$1(
                data === null ||
                Array.isArray(data) ||
                isTypedArray(data) ||
                isNDArrayLike(data),
                'invalid data for buffer');
              data = options.data;
            }

            if ('usage' in options) {
              check$1.parameter(options.usage, usageTypes, 'invalid buffer usage');
              usage = usageTypes[options.usage];
            }

            if ('type' in options) {
              check$1.parameter(options.type, glTypes, 'invalid buffer type');
              dtype = glTypes[options.type];
            }

            if ('dimension' in options) {
              check$1.type(options.dimension, 'number', 'invalid dimension');
              dimension = options.dimension | 0;
            }

            if ('length' in options) {
              check$1.nni(byteLength, 'buffer length must be a nonnegative integer');
              byteLength = options.length | 0;
            }
          }

          buffer.bind();
          if (!data) {
            // #475
            if (byteLength) gl.bufferData(buffer.type, byteLength, usage);
            buffer.dtype = dtype || GL_UNSIGNED_BYTE$3;
            buffer.usage = usage;
            buffer.dimension = dimension;
            buffer.byteLength = byteLength;
          } else {
            initBufferFromData(buffer, data, usage, dtype, dimension, persistent);
          }

          if (config.profile) {
            buffer.stats.size = buffer.byteLength * DTYPES_SIZES[buffer.dtype];
          }

          return reglBuffer
        }

        function setSubData (data, offset) {
          check$1(offset + data.byteLength <= buffer.byteLength,
            'invalid buffer subdata call, buffer is too small. ' + ' Can\'t write data of size ' + data.byteLength + ' starting from offset ' + offset + ' to a buffer of size ' + buffer.byteLength);

          gl.bufferSubData(buffer.type, offset, data);
        }

        function subdata (data, offset_) {
          var offset = (offset_ || 0) | 0;
          var shape;
          buffer.bind();
          if (isTypedArray(data) || data instanceof ArrayBuffer) {
            setSubData(data, offset);
          } else if (Array.isArray(data)) {
            if (data.length > 0) {
              if (typeof data[0] === 'number') {
                var converted = pool.allocType(buffer.dtype, data.length);
                copyArray(converted, data);
                setSubData(converted, offset);
                pool.freeType(converted);
              } else if (Array.isArray(data[0]) || isTypedArray(data[0])) {
                shape = arrayShape(data);
                var flatData = arrayFlatten(data, shape, buffer.dtype);
                setSubData(flatData, offset);
                pool.freeType(flatData);
              } else {
                check$1.raise('invalid buffer data');
              }
            }
          } else if (isNDArrayLike(data)) {
            shape = data.shape;
            var stride = data.stride;

            var shapeX = 0;
            var shapeY = 0;
            var strideX = 0;
            var strideY = 0;
            if (shape.length === 1) {
              shapeX = shape[0];
              shapeY = 1;
              strideX = stride[0];
              strideY = 0;
            } else if (shape.length === 2) {
              shapeX = shape[0];
              shapeY = shape[1];
              strideX = stride[0];
              strideY = stride[1];
            } else {
              check$1.raise('invalid shape');
            }
            var dtype = Array.isArray(data.data)
              ? buffer.dtype
              : typedArrayCode(data.data);

            var transposeData = pool.allocType(dtype, shapeX * shapeY);
            transpose(transposeData,
              data.data,
              shapeX, shapeY,
              strideX, strideY,
              data.offset);
            setSubData(transposeData, offset);
            pool.freeType(transposeData);
          } else {
            check$1.raise('invalid data for buffer subdata');
          }
          return reglBuffer
        }

        if (!deferInit) {
          reglBuffer(options);
        }

        reglBuffer._reglType = 'buffer';
        reglBuffer._buffer = buffer;
        reglBuffer.subdata = subdata;
        if (config.profile) {
          reglBuffer.stats = buffer.stats;
        }
        reglBuffer.destroy = function () { destroy(buffer); };

        return reglBuffer
      }

      function restoreBuffers () {
        values(bufferSet).forEach(function (buffer) {
          buffer.buffer = gl.createBuffer();
          gl.bindBuffer(buffer.type, buffer.buffer);
          gl.bufferData(
            buffer.type, buffer.persistentData || buffer.byteLength, buffer.usage);
        });
      }

      if (config.profile) {
        stats.getTotalBufferSize = function () {
          var total = 0;
          // TODO: Right now, the streams are not part of the total count.
          Object.keys(bufferSet).forEach(function (key) {
            total += bufferSet[key].stats.size;
          });
          return total
        };
      }

      return {
        create: createBuffer,

        createStream: createStream,
        destroyStream: destroyStream,

        clear: function () {
          values(bufferSet).forEach(destroy);
          streamPool.forEach(destroy);
        },

        getBuffer: function (wrapper) {
          if (wrapper && wrapper._buffer instanceof REGLBuffer) {
            return wrapper._buffer
          }
          return null
        },

        restore: restoreBuffers,

        _initBuffer: initBufferFromData
      }
    }

    var points = 0;
    var point = 0;
    var lines = 1;
    var line = 1;
    var triangles = 4;
    var triangle = 4;
    var primTypes = {
    	points: points,
    	point: point,
    	lines: lines,
    	line: line,
    	triangles: triangles,
    	triangle: triangle,
    	"line loop": 2,
    	"line strip": 3,
    	"triangle strip": 5,
    	"triangle fan": 6
    };

    var GL_POINTS = 0;
    var GL_LINES = 1;
    var GL_TRIANGLES = 4;

    var GL_BYTE$2 = 5120;
    var GL_UNSIGNED_BYTE$4 = 5121;
    var GL_SHORT$2 = 5122;
    var GL_UNSIGNED_SHORT$2 = 5123;
    var GL_INT$2 = 5124;
    var GL_UNSIGNED_INT$2 = 5125;

    var GL_ELEMENT_ARRAY_BUFFER = 34963;

    var GL_STREAM_DRAW$1 = 0x88E0;
    var GL_STATIC_DRAW$1 = 0x88E4;

    function wrapElementsState (gl, extensions, bufferState, stats) {
      var elementSet = {};
      var elementCount = 0;

      var elementTypes = {
        'uint8': GL_UNSIGNED_BYTE$4,
        'uint16': GL_UNSIGNED_SHORT$2
      };

      if (extensions.oes_element_index_uint) {
        elementTypes.uint32 = GL_UNSIGNED_INT$2;
      }

      function REGLElementBuffer (buffer) {
        this.id = elementCount++;
        elementSet[this.id] = this;
        this.buffer = buffer;
        this.primType = GL_TRIANGLES;
        this.vertCount = 0;
        this.type = 0;
      }

      REGLElementBuffer.prototype.bind = function () {
        this.buffer.bind();
      };

      var bufferPool = [];

      function createElementStream (data) {
        var result = bufferPool.pop();
        if (!result) {
          result = new REGLElementBuffer(bufferState.create(
            null,
            GL_ELEMENT_ARRAY_BUFFER,
            true,
            false)._buffer);
        }
        initElements(result, data, GL_STREAM_DRAW$1, -1, -1, 0, 0);
        return result
      }

      function destroyElementStream (elements) {
        bufferPool.push(elements);
      }

      function initElements (
        elements,
        data,
        usage,
        prim,
        count,
        byteLength,
        type) {
        elements.buffer.bind();
        var dtype;
        if (data) {
          var predictedType = type;
          if (!type && (
            !isTypedArray(data) ||
             (isNDArrayLike(data) && !isTypedArray(data.data)))) {
            predictedType = extensions.oes_element_index_uint
              ? GL_UNSIGNED_INT$2
              : GL_UNSIGNED_SHORT$2;
          }
          bufferState._initBuffer(
            elements.buffer,
            data,
            usage,
            predictedType,
            3);
        } else {
          gl.bufferData(GL_ELEMENT_ARRAY_BUFFER, byteLength, usage);
          elements.buffer.dtype = dtype || GL_UNSIGNED_BYTE$4;
          elements.buffer.usage = usage;
          elements.buffer.dimension = 3;
          elements.buffer.byteLength = byteLength;
        }

        dtype = type;
        if (!type) {
          switch (elements.buffer.dtype) {
            case GL_UNSIGNED_BYTE$4:
            case GL_BYTE$2:
              dtype = GL_UNSIGNED_BYTE$4;
              break

            case GL_UNSIGNED_SHORT$2:
            case GL_SHORT$2:
              dtype = GL_UNSIGNED_SHORT$2;
              break

            case GL_UNSIGNED_INT$2:
            case GL_INT$2:
              dtype = GL_UNSIGNED_INT$2;
              break

            default:
              check$1.raise('unsupported type for element array');
          }
          elements.buffer.dtype = dtype;
        }
        elements.type = dtype;

        // Check oes_element_index_uint extension
        check$1(
          dtype !== GL_UNSIGNED_INT$2 ||
          !!extensions.oes_element_index_uint,
          '32 bit element buffers not supported, enable oes_element_index_uint first');

        // try to guess default primitive type and arguments
        var vertCount = count;
        if (vertCount < 0) {
          vertCount = elements.buffer.byteLength;
          if (dtype === GL_UNSIGNED_SHORT$2) {
            vertCount >>= 1;
          } else if (dtype === GL_UNSIGNED_INT$2) {
            vertCount >>= 2;
          }
        }
        elements.vertCount = vertCount;

        // try to guess primitive type from cell dimension
        var primType = prim;
        if (prim < 0) {
          primType = GL_TRIANGLES;
          var dimension = elements.buffer.dimension;
          if (dimension === 1) primType = GL_POINTS;
          if (dimension === 2) primType = GL_LINES;
          if (dimension === 3) primType = GL_TRIANGLES;
        }
        elements.primType = primType;
      }

      function destroyElements (elements) {
        stats.elementsCount--;

        check$1(elements.buffer !== null, 'must not double destroy elements');
        delete elementSet[elements.id];
        elements.buffer.destroy();
        elements.buffer = null;
      }

      function createElements (options, persistent) {
        var buffer = bufferState.create(null, GL_ELEMENT_ARRAY_BUFFER, true);
        var elements = new REGLElementBuffer(buffer._buffer);
        stats.elementsCount++;

        function reglElements (options) {
          if (!options) {
            buffer();
            elements.primType = GL_TRIANGLES;
            elements.vertCount = 0;
            elements.type = GL_UNSIGNED_BYTE$4;
          } else if (typeof options === 'number') {
            buffer(options);
            elements.primType = GL_TRIANGLES;
            elements.vertCount = options | 0;
            elements.type = GL_UNSIGNED_BYTE$4;
          } else {
            var data = null;
            var usage = GL_STATIC_DRAW$1;
            var primType = -1;
            var vertCount = -1;
            var byteLength = 0;
            var dtype = 0;
            if (Array.isArray(options) ||
                isTypedArray(options) ||
                isNDArrayLike(options)) {
              data = options;
            } else {
              check$1.type(options, 'object', 'invalid arguments for elements');
              if ('data' in options) {
                data = options.data;
                check$1(
                  Array.isArray(data) ||
                    isTypedArray(data) ||
                    isNDArrayLike(data),
                  'invalid data for element buffer');
              }
              if ('usage' in options) {
                check$1.parameter(
                  options.usage,
                  usageTypes,
                  'invalid element buffer usage');
                usage = usageTypes[options.usage];
              }
              if ('primitive' in options) {
                check$1.parameter(
                  options.primitive,
                  primTypes,
                  'invalid element buffer primitive');
                primType = primTypes[options.primitive];
              }
              if ('count' in options) {
                check$1(
                  typeof options.count === 'number' && options.count >= 0,
                  'invalid vertex count for elements');
                vertCount = options.count | 0;
              }
              if ('type' in options) {
                check$1.parameter(
                  options.type,
                  elementTypes,
                  'invalid buffer type');
                dtype = elementTypes[options.type];
              }
              if ('length' in options) {
                byteLength = options.length | 0;
              } else {
                byteLength = vertCount;
                if (dtype === GL_UNSIGNED_SHORT$2 || dtype === GL_SHORT$2) {
                  byteLength *= 2;
                } else if (dtype === GL_UNSIGNED_INT$2 || dtype === GL_INT$2) {
                  byteLength *= 4;
                }
              }
            }
            initElements(
              elements,
              data,
              usage,
              primType,
              vertCount,
              byteLength,
              dtype);
          }

          return reglElements
        }

        reglElements(options);

        reglElements._reglType = 'elements';
        reglElements._elements = elements;
        reglElements.subdata = function (data, offset) {
          buffer.subdata(data, offset);
          return reglElements
        };
        reglElements.destroy = function () {
          destroyElements(elements);
        };

        return reglElements
      }

      return {
        create: createElements,
        createStream: createElementStream,
        destroyStream: destroyElementStream,
        getElements: function (elements) {
          if (typeof elements === 'function' &&
              elements._elements instanceof REGLElementBuffer) {
            return elements._elements
          }
          return null
        },
        clear: function () {
          values(elementSet).forEach(destroyElements);
        }
      }
    }

    var FLOAT = new Float32Array(1);
    var INT = new Uint32Array(FLOAT.buffer);

    var GL_UNSIGNED_SHORT$4 = 5123;

    function convertToHalfFloat (array) {
      var ushorts = pool.allocType(GL_UNSIGNED_SHORT$4, array.length);

      for (var i = 0; i < array.length; ++i) {
        if (isNaN(array[i])) {
          ushorts[i] = 0xffff;
        } else if (array[i] === Infinity) {
          ushorts[i] = 0x7c00;
        } else if (array[i] === -Infinity) {
          ushorts[i] = 0xfc00;
        } else {
          FLOAT[0] = array[i];
          var x = INT[0];

          var sgn = (x >>> 31) << 15;
          var exp = ((x << 1) >>> 24) - 127;
          var frac = (x >> 13) & ((1 << 10) - 1);

          if (exp < -24) {
            // round non-representable denormals to 0
            ushorts[i] = sgn;
          } else if (exp < -14) {
            // handle denormals
            var s = -14 - exp;
            ushorts[i] = sgn + ((frac + (1 << 10)) >> s);
          } else if (exp > 15) {
            // round overflow to +/- Infinity
            ushorts[i] = sgn + 0x7c00;
          } else {
            // otherwise convert directly
            ushorts[i] = sgn + ((exp + 15) << 10) + frac;
          }
        }
      }

      return ushorts
    }

    function isArrayLike (s) {
      return Array.isArray(s) || isTypedArray(s)
    }

    var isPow2$1 = function (v) {
      return !(v & (v - 1)) && (!!v)
    };

    var GL_COMPRESSED_TEXTURE_FORMATS = 0x86A3;

    var GL_TEXTURE_2D$1 = 0x0DE1;
    var GL_TEXTURE_CUBE_MAP$1 = 0x8513;
    var GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 = 0x8515;

    var GL_RGBA$1 = 0x1908;
    var GL_ALPHA = 0x1906;
    var GL_RGB = 0x1907;
    var GL_LUMINANCE = 0x1909;
    var GL_LUMINANCE_ALPHA = 0x190A;

    var GL_RGBA4 = 0x8056;
    var GL_RGB5_A1 = 0x8057;
    var GL_RGB565 = 0x8D62;

    var GL_UNSIGNED_SHORT_4_4_4_4$1 = 0x8033;
    var GL_UNSIGNED_SHORT_5_5_5_1$1 = 0x8034;
    var GL_UNSIGNED_SHORT_5_6_5$1 = 0x8363;
    var GL_UNSIGNED_INT_24_8_WEBGL$1 = 0x84FA;

    var GL_DEPTH_COMPONENT = 0x1902;
    var GL_DEPTH_STENCIL = 0x84F9;

    var GL_SRGB_EXT = 0x8C40;
    var GL_SRGB_ALPHA_EXT = 0x8C42;

    var GL_HALF_FLOAT_OES$1 = 0x8D61;

    var GL_COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83F0;
    var GL_COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83F1;
    var GL_COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83F2;
    var GL_COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83F3;

    var GL_COMPRESSED_RGB_ATC_WEBGL = 0x8C92;
    var GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 0x8C93;
    var GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 0x87EE;

    var GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00;
    var GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01;
    var GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02;
    var GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03;

    var GL_COMPRESSED_RGB_ETC1_WEBGL = 0x8D64;

    var GL_UNSIGNED_BYTE$5 = 0x1401;
    var GL_UNSIGNED_SHORT$3 = 0x1403;
    var GL_UNSIGNED_INT$3 = 0x1405;
    var GL_FLOAT$4 = 0x1406;

    var GL_TEXTURE_WRAP_S = 0x2802;
    var GL_TEXTURE_WRAP_T = 0x2803;

    var GL_REPEAT = 0x2901;
    var GL_CLAMP_TO_EDGE$1 = 0x812F;
    var GL_MIRRORED_REPEAT = 0x8370;

    var GL_TEXTURE_MAG_FILTER = 0x2800;
    var GL_TEXTURE_MIN_FILTER = 0x2801;

    var GL_NEAREST$1 = 0x2600;
    var GL_LINEAR = 0x2601;
    var GL_NEAREST_MIPMAP_NEAREST$1 = 0x2700;
    var GL_LINEAR_MIPMAP_NEAREST$1 = 0x2701;
    var GL_NEAREST_MIPMAP_LINEAR$1 = 0x2702;
    var GL_LINEAR_MIPMAP_LINEAR$1 = 0x2703;

    var GL_GENERATE_MIPMAP_HINT = 0x8192;
    var GL_DONT_CARE = 0x1100;
    var GL_FASTEST = 0x1101;
    var GL_NICEST = 0x1102;

    var GL_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FE;

    var GL_UNPACK_ALIGNMENT = 0x0CF5;
    var GL_UNPACK_FLIP_Y_WEBGL = 0x9240;
    var GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241;
    var GL_UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243;

    var GL_BROWSER_DEFAULT_WEBGL = 0x9244;

    var GL_TEXTURE0$1 = 0x84C0;

    var MIPMAP_FILTERS = [
      GL_NEAREST_MIPMAP_NEAREST$1,
      GL_NEAREST_MIPMAP_LINEAR$1,
      GL_LINEAR_MIPMAP_NEAREST$1,
      GL_LINEAR_MIPMAP_LINEAR$1
    ];

    var CHANNELS_FORMAT = [
      0,
      GL_LUMINANCE,
      GL_LUMINANCE_ALPHA,
      GL_RGB,
      GL_RGBA$1
    ];

    var FORMAT_CHANNELS = {};
    FORMAT_CHANNELS[GL_LUMINANCE] =
    FORMAT_CHANNELS[GL_ALPHA] =
    FORMAT_CHANNELS[GL_DEPTH_COMPONENT] = 1;
    FORMAT_CHANNELS[GL_DEPTH_STENCIL] =
    FORMAT_CHANNELS[GL_LUMINANCE_ALPHA] = 2;
    FORMAT_CHANNELS[GL_RGB] =
    FORMAT_CHANNELS[GL_SRGB_EXT] = 3;
    FORMAT_CHANNELS[GL_RGBA$1] =
    FORMAT_CHANNELS[GL_SRGB_ALPHA_EXT] = 4;

    function objectName (str) {
      return '[object ' + str + ']'
    }

    var CANVAS_CLASS = objectName('HTMLCanvasElement');
    var OFFSCREENCANVAS_CLASS = objectName('OffscreenCanvas');
    var CONTEXT2D_CLASS = objectName('CanvasRenderingContext2D');
    var BITMAP_CLASS = objectName('ImageBitmap');
    var IMAGE_CLASS = objectName('HTMLImageElement');
    var VIDEO_CLASS = objectName('HTMLVideoElement');

    var PIXEL_CLASSES = Object.keys(arrayTypes).concat([
      CANVAS_CLASS,
      OFFSCREENCANVAS_CLASS,
      CONTEXT2D_CLASS,
      BITMAP_CLASS,
      IMAGE_CLASS,
      VIDEO_CLASS
    ]);

    // for every texture type, store
    // the size in bytes.
    var TYPE_SIZES = [];
    TYPE_SIZES[GL_UNSIGNED_BYTE$5] = 1;
    TYPE_SIZES[GL_FLOAT$4] = 4;
    TYPE_SIZES[GL_HALF_FLOAT_OES$1] = 2;

    TYPE_SIZES[GL_UNSIGNED_SHORT$3] = 2;
    TYPE_SIZES[GL_UNSIGNED_INT$3] = 4;

    var FORMAT_SIZES_SPECIAL = [];
    FORMAT_SIZES_SPECIAL[GL_RGBA4] = 2;
    FORMAT_SIZES_SPECIAL[GL_RGB5_A1] = 2;
    FORMAT_SIZES_SPECIAL[GL_RGB565] = 2;
    FORMAT_SIZES_SPECIAL[GL_DEPTH_STENCIL] = 4;

    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_S3TC_DXT1_EXT] = 0.5;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT1_EXT] = 0.5;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT3_EXT] = 1;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT5_EXT] = 1;

    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_ATC_WEBGL] = 0.5;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL] = 1;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL] = 1;

    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG] = 0.5;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG] = 0.25;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG] = 0.5;
    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG] = 0.25;

    FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_ETC1_WEBGL] = 0.5;

    function isNumericArray (arr) {
      return (
        Array.isArray(arr) &&
        (arr.length === 0 ||
        typeof arr[0] === 'number'))
    }

    function isRectArray (arr) {
      if (!Array.isArray(arr)) {
        return false
      }
      var width = arr.length;
      if (width === 0 || !isArrayLike(arr[0])) {
        return false
      }
      return true
    }

    function classString (x) {
      return Object.prototype.toString.call(x)
    }

    function isCanvasElement (object) {
      return classString(object) === CANVAS_CLASS
    }

    function isOffscreenCanvas (object) {
      return classString(object) === OFFSCREENCANVAS_CLASS
    }

    function isContext2D (object) {
      return classString(object) === CONTEXT2D_CLASS
    }

    function isBitmap (object) {
      return classString(object) === BITMAP_CLASS
    }

    function isImageElement (object) {
      return classString(object) === IMAGE_CLASS
    }

    function isVideoElement (object) {
      return classString(object) === VIDEO_CLASS
    }

    function isPixelData (object) {
      if (!object) {
        return false
      }
      var className = classString(object);
      if (PIXEL_CLASSES.indexOf(className) >= 0) {
        return true
      }
      return (
        isNumericArray(object) ||
        isRectArray(object) ||
        isNDArrayLike(object))
    }

    function typedArrayCode$1 (data) {
      return arrayTypes[Object.prototype.toString.call(data)] | 0
    }

    function convertData (result, data) {
      var n = data.length;
      switch (result.type) {
        case GL_UNSIGNED_BYTE$5:
        case GL_UNSIGNED_SHORT$3:
        case GL_UNSIGNED_INT$3:
        case GL_FLOAT$4:
          var converted = pool.allocType(result.type, n);
          converted.set(data);
          result.data = converted;
          break

        case GL_HALF_FLOAT_OES$1:
          result.data = convertToHalfFloat(data);
          break

        default:
          check$1.raise('unsupported texture type, must specify a typed array');
      }
    }

    function preConvert (image, n) {
      return pool.allocType(
        image.type === GL_HALF_FLOAT_OES$1
          ? GL_FLOAT$4
          : image.type, n)
    }

    function postConvert (image, data) {
      if (image.type === GL_HALF_FLOAT_OES$1) {
        image.data = convertToHalfFloat(data);
        pool.freeType(data);
      } else {
        image.data = data;
      }
    }

    function transposeData (image, array, strideX, strideY, strideC, offset) {
      var w = image.width;
      var h = image.height;
      var c = image.channels;
      var n = w * h * c;
      var data = preConvert(image, n);

      var p = 0;
      for (var i = 0; i < h; ++i) {
        for (var j = 0; j < w; ++j) {
          for (var k = 0; k < c; ++k) {
            data[p++] = array[strideX * j + strideY * i + strideC * k + offset];
          }
        }
      }

      postConvert(image, data);
    }

    function getTextureSize (format, type, width, height, isMipmap, isCube) {
      var s;
      if (typeof FORMAT_SIZES_SPECIAL[format] !== 'undefined') {
        // we have a special array for dealing with weird color formats such as RGB5A1
        s = FORMAT_SIZES_SPECIAL[format];
      } else {
        s = FORMAT_CHANNELS[format] * TYPE_SIZES[type];
      }

      if (isCube) {
        s *= 6;
      }

      if (isMipmap) {
        // compute the total size of all the mipmaps.
        var total = 0;

        var w = width;
        while (w >= 1) {
          // we can only use mipmaps on a square image,
          // so we can simply use the width and ignore the height:
          total += s * w * w;
          w /= 2;
        }
        return total
      } else {
        return s * width * height
      }
    }

    function createTextureSet (
      gl, extensions, limits, reglPoll, contextState, stats, config) {
      // -------------------------------------------------------
      // Initialize constants and parameter tables here
      // -------------------------------------------------------
      var mipmapHint = {
        "don't care": GL_DONT_CARE,
        'dont care': GL_DONT_CARE,
        'nice': GL_NICEST,
        'fast': GL_FASTEST
      };

      var wrapModes = {
        'repeat': GL_REPEAT,
        'clamp': GL_CLAMP_TO_EDGE$1,
        'mirror': GL_MIRRORED_REPEAT
      };

      var magFilters = {
        'nearest': GL_NEAREST$1,
        'linear': GL_LINEAR
      };

      var minFilters = extend({
        'mipmap': GL_LINEAR_MIPMAP_LINEAR$1,
        'nearest mipmap nearest': GL_NEAREST_MIPMAP_NEAREST$1,
        'linear mipmap nearest': GL_LINEAR_MIPMAP_NEAREST$1,
        'nearest mipmap linear': GL_NEAREST_MIPMAP_LINEAR$1,
        'linear mipmap linear': GL_LINEAR_MIPMAP_LINEAR$1
      }, magFilters);

      var colorSpace = {
        'none': 0,
        'browser': GL_BROWSER_DEFAULT_WEBGL
      };

      var textureTypes = {
        'uint8': GL_UNSIGNED_BYTE$5,
        'rgba4': GL_UNSIGNED_SHORT_4_4_4_4$1,
        'rgb565': GL_UNSIGNED_SHORT_5_6_5$1,
        'rgb5 a1': GL_UNSIGNED_SHORT_5_5_5_1$1
      };

      var textureFormats = {
        'alpha': GL_ALPHA,
        'luminance': GL_LUMINANCE,
        'luminance alpha': GL_LUMINANCE_ALPHA,
        'rgb': GL_RGB,
        'rgba': GL_RGBA$1,
        'rgba4': GL_RGBA4,
        'rgb5 a1': GL_RGB5_A1,
        'rgb565': GL_RGB565
      };

      var compressedTextureFormats = {};

      if (extensions.ext_srgb) {
        textureFormats.srgb = GL_SRGB_EXT;
        textureFormats.srgba = GL_SRGB_ALPHA_EXT;
      }

      if (extensions.oes_texture_float) {
        textureTypes.float32 = textureTypes.float = GL_FLOAT$4;
      }

      if (extensions.oes_texture_half_float) {
        textureTypes['float16'] = textureTypes['half float'] = GL_HALF_FLOAT_OES$1;
      }

      if (extensions.webgl_depth_texture) {
        extend(textureFormats, {
          'depth': GL_DEPTH_COMPONENT,
          'depth stencil': GL_DEPTH_STENCIL
        });

        extend(textureTypes, {
          'uint16': GL_UNSIGNED_SHORT$3,
          'uint32': GL_UNSIGNED_INT$3,
          'depth stencil': GL_UNSIGNED_INT_24_8_WEBGL$1
        });
      }

      if (extensions.webgl_compressed_texture_s3tc) {
        extend(compressedTextureFormats, {
          'rgb s3tc dxt1': GL_COMPRESSED_RGB_S3TC_DXT1_EXT,
          'rgba s3tc dxt1': GL_COMPRESSED_RGBA_S3TC_DXT1_EXT,
          'rgba s3tc dxt3': GL_COMPRESSED_RGBA_S3TC_DXT3_EXT,
          'rgba s3tc dxt5': GL_COMPRESSED_RGBA_S3TC_DXT5_EXT
        });
      }

      if (extensions.webgl_compressed_texture_atc) {
        extend(compressedTextureFormats, {
          'rgb atc': GL_COMPRESSED_RGB_ATC_WEBGL,
          'rgba atc explicit alpha': GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL,
          'rgba atc interpolated alpha': GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL
        });
      }

      if (extensions.webgl_compressed_texture_pvrtc) {
        extend(compressedTextureFormats, {
          'rgb pvrtc 4bppv1': GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG,
          'rgb pvrtc 2bppv1': GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG,
          'rgba pvrtc 4bppv1': GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG,
          'rgba pvrtc 2bppv1': GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
        });
      }

      if (extensions.webgl_compressed_texture_etc1) {
        compressedTextureFormats['rgb etc1'] = GL_COMPRESSED_RGB_ETC1_WEBGL;
      }

      // Copy over all texture formats
      var supportedCompressedFormats = Array.prototype.slice.call(
        gl.getParameter(GL_COMPRESSED_TEXTURE_FORMATS));
      Object.keys(compressedTextureFormats).forEach(function (name) {
        var format = compressedTextureFormats[name];
        if (supportedCompressedFormats.indexOf(format) >= 0) {
          textureFormats[name] = format;
        }
      });

      var supportedFormats = Object.keys(textureFormats);
      limits.textureFormats = supportedFormats;

      // associate with every format string its
      // corresponding GL-value.
      var textureFormatsInvert = [];
      Object.keys(textureFormats).forEach(function (key) {
        var val = textureFormats[key];
        textureFormatsInvert[val] = key;
      });

      // associate with every type string its
      // corresponding GL-value.
      var textureTypesInvert = [];
      Object.keys(textureTypes).forEach(function (key) {
        var val = textureTypes[key];
        textureTypesInvert[val] = key;
      });

      var magFiltersInvert = [];
      Object.keys(magFilters).forEach(function (key) {
        var val = magFilters[key];
        magFiltersInvert[val] = key;
      });

      var minFiltersInvert = [];
      Object.keys(minFilters).forEach(function (key) {
        var val = minFilters[key];
        minFiltersInvert[val] = key;
      });

      var wrapModesInvert = [];
      Object.keys(wrapModes).forEach(function (key) {
        var val = wrapModes[key];
        wrapModesInvert[val] = key;
      });

      // colorFormats[] gives the format (channels) associated to an
      // internalformat
      var colorFormats = supportedFormats.reduce(function (color, key) {
        var glenum = textureFormats[key];
        if (glenum === GL_LUMINANCE ||
            glenum === GL_ALPHA ||
            glenum === GL_LUMINANCE ||
            glenum === GL_LUMINANCE_ALPHA ||
            glenum === GL_DEPTH_COMPONENT ||
            glenum === GL_DEPTH_STENCIL ||
            (extensions.ext_srgb &&
                    (glenum === GL_SRGB_EXT ||
                     glenum === GL_SRGB_ALPHA_EXT))) {
          color[glenum] = glenum;
        } else if (glenum === GL_RGB5_A1 || key.indexOf('rgba') >= 0) {
          color[glenum] = GL_RGBA$1;
        } else {
          color[glenum] = GL_RGB;
        }
        return color
      }, {});

      function TexFlags () {
        // format info
        this.internalformat = GL_RGBA$1;
        this.format = GL_RGBA$1;
        this.type = GL_UNSIGNED_BYTE$5;
        this.compressed = false;

        // pixel storage
        this.premultiplyAlpha = false;
        this.flipY = false;
        this.unpackAlignment = 1;
        this.colorSpace = GL_BROWSER_DEFAULT_WEBGL;

        // shape info
        this.width = 0;
        this.height = 0;
        this.channels = 0;
      }

      function copyFlags (result, other) {
        result.internalformat = other.internalformat;
        result.format = other.format;
        result.type = other.type;
        result.compressed = other.compressed;

        result.premultiplyAlpha = other.premultiplyAlpha;
        result.flipY = other.flipY;
        result.unpackAlignment = other.unpackAlignment;
        result.colorSpace = other.colorSpace;

        result.width = other.width;
        result.height = other.height;
        result.channels = other.channels;
      }

      function parseFlags (flags, options) {
        if (typeof options !== 'object' || !options) {
          return
        }

        if ('premultiplyAlpha' in options) {
          check$1.type(options.premultiplyAlpha, 'boolean',
            'invalid premultiplyAlpha');
          flags.premultiplyAlpha = options.premultiplyAlpha;
        }

        if ('flipY' in options) {
          check$1.type(options.flipY, 'boolean',
            'invalid texture flip');
          flags.flipY = options.flipY;
        }

        if ('alignment' in options) {
          check$1.oneOf(options.alignment, [1, 2, 4, 8],
            'invalid texture unpack alignment');
          flags.unpackAlignment = options.alignment;
        }

        if ('colorSpace' in options) {
          check$1.parameter(options.colorSpace, colorSpace,
            'invalid colorSpace');
          flags.colorSpace = colorSpace[options.colorSpace];
        }

        if ('type' in options) {
          var type = options.type;
          check$1(extensions.oes_texture_float ||
            !(type === 'float' || type === 'float32'),
          'you must enable the OES_texture_float extension in order to use floating point textures.');
          check$1(extensions.oes_texture_half_float ||
            !(type === 'half float' || type === 'float16'),
          'you must enable the OES_texture_half_float extension in order to use 16-bit floating point textures.');
          check$1(extensions.webgl_depth_texture ||
            !(type === 'uint16' || type === 'uint32' || type === 'depth stencil'),
          'you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures.');
          check$1.parameter(type, textureTypes,
            'invalid texture type');
          flags.type = textureTypes[type];
        }

        var w = flags.width;
        var h = flags.height;
        var c = flags.channels;
        var hasChannels = false;
        if ('shape' in options) {
          check$1(Array.isArray(options.shape) && options.shape.length >= 2,
            'shape must be an array');
          w = options.shape[0];
          h = options.shape[1];
          if (options.shape.length === 3) {
            c = options.shape[2];
            check$1(c > 0 && c <= 4, 'invalid number of channels');
            hasChannels = true;
          }
          check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid width');
          check$1(h >= 0 && h <= limits.maxTextureSize, 'invalid height');
        } else {
          if ('radius' in options) {
            w = h = options.radius;
            check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid radius');
          }
          if ('width' in options) {
            w = options.width;
            check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid width');
          }
          if ('height' in options) {
            h = options.height;
            check$1(h >= 0 && h <= limits.maxTextureSize, 'invalid height');
          }
          if ('channels' in options) {
            c = options.channels;
            check$1(c > 0 && c <= 4, 'invalid number of channels');
            hasChannels = true;
          }
        }
        flags.width = w | 0;
        flags.height = h | 0;
        flags.channels = c | 0;

        var hasFormat = false;
        if ('format' in options) {
          var formatStr = options.format;
          check$1(extensions.webgl_depth_texture ||
            !(formatStr === 'depth' || formatStr === 'depth stencil'),
          'you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures.');
          check$1.parameter(formatStr, textureFormats,
            'invalid texture format');
          var internalformat = flags.internalformat = textureFormats[formatStr];
          flags.format = colorFormats[internalformat];
          if (formatStr in textureTypes) {
            if (!('type' in options)) {
              flags.type = textureTypes[formatStr];
            }
          }
          if (formatStr in compressedTextureFormats) {
            flags.compressed = true;
          }
          hasFormat = true;
        }

        // Reconcile channels and format
        if (!hasChannels && hasFormat) {
          flags.channels = FORMAT_CHANNELS[flags.format];
        } else if (hasChannels && !hasFormat) {
          if (flags.channels !== CHANNELS_FORMAT[flags.format]) {
            flags.format = flags.internalformat = CHANNELS_FORMAT[flags.channels];
          }
        } else if (hasFormat && hasChannels) {
          check$1(
            flags.channels === FORMAT_CHANNELS[flags.format],
            'number of channels inconsistent with specified format');
        }
      }

      function setFlags (flags) {
        gl.pixelStorei(GL_UNPACK_FLIP_Y_WEBGL, flags.flipY);
        gl.pixelStorei(GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL, flags.premultiplyAlpha);
        gl.pixelStorei(GL_UNPACK_COLORSPACE_CONVERSION_WEBGL, flags.colorSpace);
        gl.pixelStorei(GL_UNPACK_ALIGNMENT, flags.unpackAlignment);
      }

      // -------------------------------------------------------
      // Tex image data
      // -------------------------------------------------------
      function TexImage () {
        TexFlags.call(this);

        this.xOffset = 0;
        this.yOffset = 0;

        // data
        this.data = null;
        this.needsFree = false;

        // html element
        this.element = null;

        // copyTexImage info
        this.needsCopy = false;
      }

      function parseImage (image, options) {
        var data = null;
        if (isPixelData(options)) {
          data = options;
        } else if (options) {
          check$1.type(options, 'object', 'invalid pixel data type');
          parseFlags(image, options);
          if ('x' in options) {
            image.xOffset = options.x | 0;
          }
          if ('y' in options) {
            image.yOffset = options.y | 0;
          }
          if (isPixelData(options.data)) {
            data = options.data;
          }
        }

        check$1(
          !image.compressed ||
          data instanceof Uint8Array,
          'compressed texture data must be stored in a uint8array');

        if (options.copy) {
          check$1(!data, 'can not specify copy and data field for the same texture');
          var viewW = contextState.viewportWidth;
          var viewH = contextState.viewportHeight;
          image.width = image.width || (viewW - image.xOffset);
          image.height = image.height || (viewH - image.yOffset);
          image.needsCopy = true;
          check$1(image.xOffset >= 0 && image.xOffset < viewW &&
                image.yOffset >= 0 && image.yOffset < viewH &&
                image.width > 0 && image.width <= viewW &&
                image.height > 0 && image.height <= viewH,
          'copy texture read out of bounds');
        } else if (!data) {
          image.width = image.width || 1;
          image.height = image.height || 1;
          image.channels = image.channels || 4;
        } else if (isTypedArray(data)) {
          image.channels = image.channels || 4;
          image.data = data;
          if (!('type' in options) && image.type === GL_UNSIGNED_BYTE$5) {
            image.type = typedArrayCode$1(data);
          }
        } else if (isNumericArray(data)) {
          image.channels = image.channels || 4;
          convertData(image, data);
          image.alignment = 1;
          image.needsFree = true;
        } else if (isNDArrayLike(data)) {
          var array = data.data;
          if (!Array.isArray(array) && image.type === GL_UNSIGNED_BYTE$5) {
            image.type = typedArrayCode$1(array);
          }
          var shape = data.shape;
          var stride = data.stride;
          var shapeX, shapeY, shapeC, strideX, strideY, strideC;
          if (shape.length === 3) {
            shapeC = shape[2];
            strideC = stride[2];
          } else {
            check$1(shape.length === 2, 'invalid ndarray pixel data, must be 2 or 3D');
            shapeC = 1;
            strideC = 1;
          }
          shapeX = shape[0];
          shapeY = shape[1];
          strideX = stride[0];
          strideY = stride[1];
          image.alignment = 1;
          image.width = shapeX;
          image.height = shapeY;
          image.channels = shapeC;
          image.format = image.internalformat = CHANNELS_FORMAT[shapeC];
          image.needsFree = true;
          transposeData(image, array, strideX, strideY, strideC, data.offset);
        } else if (isCanvasElement(data) || isOffscreenCanvas(data) || isContext2D(data)) {
          if (isCanvasElement(data) || isOffscreenCanvas(data)) {
            image.element = data;
          } else {
            image.element = data.canvas;
          }
          image.width = image.element.width;
          image.height = image.element.height;
          image.channels = 4;
        } else if (isBitmap(data)) {
          image.element = data;
          image.width = data.width;
          image.height = data.height;
          image.channels = 4;
        } else if (isImageElement(data)) {
          image.element = data;
          image.width = data.naturalWidth;
          image.height = data.naturalHeight;
          image.channels = 4;
        } else if (isVideoElement(data)) {
          image.element = data;
          image.width = data.videoWidth;
          image.height = data.videoHeight;
          image.channels = 4;
        } else if (isRectArray(data)) {
          var w = image.width || data[0].length;
          var h = image.height || data.length;
          var c = image.channels;
          if (isArrayLike(data[0][0])) {
            c = c || data[0][0].length;
          } else {
            c = c || 1;
          }
          var arrayShape = flattenUtils.shape(data);
          var n = 1;
          for (var dd = 0; dd < arrayShape.length; ++dd) {
            n *= arrayShape[dd];
          }
          var allocData = preConvert(image, n);
          flattenUtils.flatten(data, arrayShape, '', allocData);
          postConvert(image, allocData);
          image.alignment = 1;
          image.width = w;
          image.height = h;
          image.channels = c;
          image.format = image.internalformat = CHANNELS_FORMAT[c];
          image.needsFree = true;
        }

        if (image.type === GL_FLOAT$4) {
          check$1(limits.extensions.indexOf('oes_texture_float') >= 0,
            'oes_texture_float extension not enabled');
        } else if (image.type === GL_HALF_FLOAT_OES$1) {
          check$1(limits.extensions.indexOf('oes_texture_half_float') >= 0,
            'oes_texture_half_float extension not enabled');
        }

        // do compressed texture  validation here.
      }

      function setImage (info, target, miplevel) {
        var element = info.element;
        var data = info.data;
        var internalformat = info.internalformat;
        var format = info.format;
        var type = info.type;
        var width = info.width;
        var height = info.height;

        setFlags(info);

        if (element) {
          gl.texImage2D(target, miplevel, format, format, type, element);
        } else if (info.compressed) {
          gl.compressedTexImage2D(target, miplevel, internalformat, width, height, 0, data);
        } else if (info.needsCopy) {
          reglPoll();
          gl.copyTexImage2D(
            target, miplevel, format, info.xOffset, info.yOffset, width, height, 0);
        } else {
          gl.texImage2D(target, miplevel, format, width, height, 0, format, type, data || null);
        }
      }

      function setSubImage (info, target, x, y, miplevel) {
        var element = info.element;
        var data = info.data;
        var internalformat = info.internalformat;
        var format = info.format;
        var type = info.type;
        var width = info.width;
        var height = info.height;

        setFlags(info);

        if (element) {
          gl.texSubImage2D(
            target, miplevel, x, y, format, type, element);
        } else if (info.compressed) {
          gl.compressedTexSubImage2D(
            target, miplevel, x, y, internalformat, width, height, data);
        } else if (info.needsCopy) {
          reglPoll();
          gl.copyTexSubImage2D(
            target, miplevel, x, y, info.xOffset, info.yOffset, width, height);
        } else {
          gl.texSubImage2D(
            target, miplevel, x, y, width, height, format, type, data);
        }
      }

      // texImage pool
      var imagePool = [];

      function allocImage () {
        return imagePool.pop() || new TexImage()
      }

      function freeImage (image) {
        if (image.needsFree) {
          pool.freeType(image.data);
        }
        TexImage.call(image);
        imagePool.push(image);
      }

      // -------------------------------------------------------
      // Mip map
      // -------------------------------------------------------
      function MipMap () {
        TexFlags.call(this);

        this.genMipmaps = false;
        this.mipmapHint = GL_DONT_CARE;
        this.mipmask = 0;
        this.images = Array(16);
      }

      function parseMipMapFromShape (mipmap, width, height) {
        var img = mipmap.images[0] = allocImage();
        mipmap.mipmask = 1;
        img.width = mipmap.width = width;
        img.height = mipmap.height = height;
        img.channels = mipmap.channels = 4;
      }

      function parseMipMapFromObject (mipmap, options) {
        var imgData = null;
        if (isPixelData(options)) {
          imgData = mipmap.images[0] = allocImage();
          copyFlags(imgData, mipmap);
          parseImage(imgData, options);
          mipmap.mipmask = 1;
        } else {
          parseFlags(mipmap, options);
          if (Array.isArray(options.mipmap)) {
            var mipData = options.mipmap;
            for (var i = 0; i < mipData.length; ++i) {
              imgData = mipmap.images[i] = allocImage();
              copyFlags(imgData, mipmap);
              imgData.width >>= i;
              imgData.height >>= i;
              parseImage(imgData, mipData[i]);
              mipmap.mipmask |= (1 << i);
            }
          } else {
            imgData = mipmap.images[0] = allocImage();
            copyFlags(imgData, mipmap);
            parseImage(imgData, options);
            mipmap.mipmask = 1;
          }
        }
        copyFlags(mipmap, mipmap.images[0]);

        // For textures of the compressed format WEBGL_compressed_texture_s3tc
        // we must have that
        //
        // "When level equals zero width and height must be a multiple of 4.
        // When level is greater than 0 width and height must be 0, 1, 2 or a multiple of 4. "
        //
        // but we do not yet support having multiple mipmap levels for compressed textures,
        // so we only test for level zero.

        if (
          mipmap.compressed &&
          (
            mipmap.internalformat === GL_COMPRESSED_RGB_S3TC_DXT1_EXT ||
            mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT1_EXT ||
            mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT3_EXT ||
            mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT5_EXT
          )
        ) {
          check$1(mipmap.width % 4 === 0 && mipmap.height % 4 === 0,
            'for compressed texture formats, mipmap level 0 must have width and height that are a multiple of 4');
        }
      }

      function setMipMap (mipmap, target) {
        var images = mipmap.images;
        for (var i = 0; i < images.length; ++i) {
          if (!images[i]) {
            return
          }
          setImage(images[i], target, i);
        }
      }

      var mipPool = [];

      function allocMipMap () {
        var result = mipPool.pop() || new MipMap();
        TexFlags.call(result);
        result.mipmask = 0;
        for (var i = 0; i < 16; ++i) {
          result.images[i] = null;
        }
        return result
      }

      function freeMipMap (mipmap) {
        var images = mipmap.images;
        for (var i = 0; i < images.length; ++i) {
          if (images[i]) {
            freeImage(images[i]);
          }
          images[i] = null;
        }
        mipPool.push(mipmap);
      }

      // -------------------------------------------------------
      // Tex info
      // -------------------------------------------------------
      function TexInfo () {
        this.minFilter = GL_NEAREST$1;
        this.magFilter = GL_NEAREST$1;

        this.wrapS = GL_CLAMP_TO_EDGE$1;
        this.wrapT = GL_CLAMP_TO_EDGE$1;

        this.anisotropic = 1;

        this.genMipmaps = false;
        this.mipmapHint = GL_DONT_CARE;
      }

      function parseTexInfo (info, options) {
        if ('min' in options) {
          var minFilter = options.min;
          check$1.parameter(minFilter, minFilters);
          info.minFilter = minFilters[minFilter];
          if (MIPMAP_FILTERS.indexOf(info.minFilter) >= 0 && !('faces' in options)) {
            info.genMipmaps = true;
          }
        }

        if ('mag' in options) {
          var magFilter = options.mag;
          check$1.parameter(magFilter, magFilters);
          info.magFilter = magFilters[magFilter];
        }

        var wrapS = info.wrapS;
        var wrapT = info.wrapT;
        if ('wrap' in options) {
          var wrap = options.wrap;
          if (typeof wrap === 'string') {
            check$1.parameter(wrap, wrapModes);
            wrapS = wrapT = wrapModes[wrap];
          } else if (Array.isArray(wrap)) {
            check$1.parameter(wrap[0], wrapModes);
            check$1.parameter(wrap[1], wrapModes);
            wrapS = wrapModes[wrap[0]];
            wrapT = wrapModes[wrap[1]];
          }
        } else {
          if ('wrapS' in options) {
            var optWrapS = options.wrapS;
            check$1.parameter(optWrapS, wrapModes);
            wrapS = wrapModes[optWrapS];
          }
          if ('wrapT' in options) {
            var optWrapT = options.wrapT;
            check$1.parameter(optWrapT, wrapModes);
            wrapT = wrapModes[optWrapT];
          }
        }
        info.wrapS = wrapS;
        info.wrapT = wrapT;

        if ('anisotropic' in options) {
          var anisotropic = options.anisotropic;
          check$1(typeof anisotropic === 'number' &&
             anisotropic >= 1 && anisotropic <= limits.maxAnisotropic,
          'aniso samples must be between 1 and ');
          info.anisotropic = options.anisotropic;
        }

        if ('mipmap' in options) {
          var hasMipMap = false;
          switch (typeof options.mipmap) {
            case 'string':
              check$1.parameter(options.mipmap, mipmapHint,
                'invalid mipmap hint');
              info.mipmapHint = mipmapHint[options.mipmap];
              info.genMipmaps = true;
              hasMipMap = true;
              break

            case 'boolean':
              hasMipMap = info.genMipmaps = options.mipmap;
              break

            case 'object':
              check$1(Array.isArray(options.mipmap), 'invalid mipmap type');
              info.genMipmaps = false;
              hasMipMap = true;
              break

            default:
              check$1.raise('invalid mipmap type');
          }
          if (hasMipMap && !('min' in options)) {
            info.minFilter = GL_NEAREST_MIPMAP_NEAREST$1;
          }
        }
      }

      function setTexInfo (info, target) {
        gl.texParameteri(target, GL_TEXTURE_MIN_FILTER, info.minFilter);
        gl.texParameteri(target, GL_TEXTURE_MAG_FILTER, info.magFilter);
        gl.texParameteri(target, GL_TEXTURE_WRAP_S, info.wrapS);
        gl.texParameteri(target, GL_TEXTURE_WRAP_T, info.wrapT);
        if (extensions.ext_texture_filter_anisotropic) {
          gl.texParameteri(target, GL_TEXTURE_MAX_ANISOTROPY_EXT, info.anisotropic);
        }
        if (info.genMipmaps) {
          gl.hint(GL_GENERATE_MIPMAP_HINT, info.mipmapHint);
          gl.generateMipmap(target);
        }
      }

      // -------------------------------------------------------
      // Full texture object
      // -------------------------------------------------------
      var textureCount = 0;
      var textureSet = {};
      var numTexUnits = limits.maxTextureUnits;
      var textureUnits = Array(numTexUnits).map(function () {
        return null
      });

      function REGLTexture (target) {
        TexFlags.call(this);
        this.mipmask = 0;
        this.internalformat = GL_RGBA$1;

        this.id = textureCount++;

        this.refCount = 1;

        this.target = target;
        this.texture = gl.createTexture();

        this.unit = -1;
        this.bindCount = 0;

        this.texInfo = new TexInfo();

        if (config.profile) {
          this.stats = { size: 0 };
        }
      }

      function tempBind (texture) {
        gl.activeTexture(GL_TEXTURE0$1);
        gl.bindTexture(texture.target, texture.texture);
      }

      function tempRestore () {
        var prev = textureUnits[0];
        if (prev) {
          gl.bindTexture(prev.target, prev.texture);
        } else {
          gl.bindTexture(GL_TEXTURE_2D$1, null);
        }
      }

      function destroy (texture) {
        var handle = texture.texture;
        check$1(handle, 'must not double destroy texture');
        var unit = texture.unit;
        var target = texture.target;
        if (unit >= 0) {
          gl.activeTexture(GL_TEXTURE0$1 + unit);
          gl.bindTexture(target, null);
          textureUnits[unit] = null;
        }
        gl.deleteTexture(handle);
        texture.texture = null;
        texture.params = null;
        texture.pixels = null;
        texture.refCount = 0;
        delete textureSet[texture.id];
        stats.textureCount--;
      }

      extend(REGLTexture.prototype, {
        bind: function () {
          var texture = this;
          texture.bindCount += 1;
          var unit = texture.unit;
          if (unit < 0) {
            for (var i = 0; i < numTexUnits; ++i) {
              var other = textureUnits[i];
              if (other) {
                if (other.bindCount > 0) {
                  continue
                }
                other.unit = -1;
              }
              textureUnits[i] = texture;
              unit = i;
              break
            }
            if (unit >= numTexUnits) {
              check$1.raise('insufficient number of texture units');
            }
            if (config.profile && stats.maxTextureUnits < (unit + 1)) {
              stats.maxTextureUnits = unit + 1; // +1, since the units are zero-based
            }
            texture.unit = unit;
            gl.activeTexture(GL_TEXTURE0$1 + unit);
            gl.bindTexture(texture.target, texture.texture);
          }
          return unit
        },

        unbind: function () {
          this.bindCount -= 1;
        },

        decRef: function () {
          if (--this.refCount <= 0) {
            destroy(this);
          }
        }
      });

      function createTexture2D (a, b) {
        var texture = new REGLTexture(GL_TEXTURE_2D$1);
        textureSet[texture.id] = texture;
        stats.textureCount++;

        function reglTexture2D (a, b) {
          var texInfo = texture.texInfo;
          TexInfo.call(texInfo);
          var mipData = allocMipMap();

          if (typeof a === 'number') {
            if (typeof b === 'number') {
              parseMipMapFromShape(mipData, a | 0, b | 0);
            } else {
              parseMipMapFromShape(mipData, a | 0, a | 0);
            }
          } else if (a) {
            check$1.type(a, 'object', 'invalid arguments to regl.texture');
            parseTexInfo(texInfo, a);
            parseMipMapFromObject(mipData, a);
          } else {
            // empty textures get assigned a default shape of 1x1
            parseMipMapFromShape(mipData, 1, 1);
          }

          if (texInfo.genMipmaps) {
            mipData.mipmask = (mipData.width << 1) - 1;
          }
          texture.mipmask = mipData.mipmask;

          copyFlags(texture, mipData);

          check$1.texture2D(texInfo, mipData, limits);
          texture.internalformat = mipData.internalformat;

          reglTexture2D.width = mipData.width;
          reglTexture2D.height = mipData.height;

          tempBind(texture);
          setMipMap(mipData, GL_TEXTURE_2D$1);
          setTexInfo(texInfo, GL_TEXTURE_2D$1);
          tempRestore();

          freeMipMap(mipData);

          if (config.profile) {
            texture.stats.size = getTextureSize(
              texture.internalformat,
              texture.type,
              mipData.width,
              mipData.height,
              texInfo.genMipmaps,
              false);
          }
          reglTexture2D.format = textureFormatsInvert[texture.internalformat];
          reglTexture2D.type = textureTypesInvert[texture.type];

          reglTexture2D.mag = magFiltersInvert[texInfo.magFilter];
          reglTexture2D.min = minFiltersInvert[texInfo.minFilter];

          reglTexture2D.wrapS = wrapModesInvert[texInfo.wrapS];
          reglTexture2D.wrapT = wrapModesInvert[texInfo.wrapT];

          return reglTexture2D
        }

        function subimage (image, x_, y_, level_) {
          check$1(!!image, 'must specify image data');

          var x = x_ | 0;
          var y = y_ | 0;
          var level = level_ | 0;

          var imageData = allocImage();
          copyFlags(imageData, texture);
          imageData.width = 0;
          imageData.height = 0;
          parseImage(imageData, image);
          imageData.width = imageData.width || ((texture.width >> level) - x);
          imageData.height = imageData.height || ((texture.height >> level) - y);

          check$1(
            texture.type === imageData.type &&
            texture.format === imageData.format &&
            texture.internalformat === imageData.internalformat,
            'incompatible format for texture.subimage');
          check$1(
            x >= 0 && y >= 0 &&
            x + imageData.width <= texture.width &&
            y + imageData.height <= texture.height,
            'texture.subimage write out of bounds');
          check$1(
            texture.mipmask & (1 << level),
            'missing mipmap data');
          check$1(
            imageData.data || imageData.element || imageData.needsCopy,
            'missing image data');

          tempBind(texture);
          setSubImage(imageData, GL_TEXTURE_2D$1, x, y, level);
          tempRestore();

          freeImage(imageData);

          return reglTexture2D
        }

        function resize (w_, h_) {
          var w = w_ | 0;
          var h = (h_ | 0) || w;
          if (w === texture.width && h === texture.height) {
            return reglTexture2D
          }

          reglTexture2D.width = texture.width = w;
          reglTexture2D.height = texture.height = h;

          tempBind(texture);

          for (var i = 0; texture.mipmask >> i; ++i) {
            var _w = w >> i;
            var _h = h >> i;
            if (!_w || !_h) break
            gl.texImage2D(
              GL_TEXTURE_2D$1,
              i,
              texture.format,
              _w,
              _h,
              0,
              texture.format,
              texture.type,
              null);
          }
          tempRestore();

          // also, recompute the texture size.
          if (config.profile) {
            texture.stats.size = getTextureSize(
              texture.internalformat,
              texture.type,
              w,
              h,
              false,
              false);
          }

          return reglTexture2D
        }

        reglTexture2D(a, b);

        reglTexture2D.subimage = subimage;
        reglTexture2D.resize = resize;
        reglTexture2D._reglType = 'texture2d';
        reglTexture2D._texture = texture;
        if (config.profile) {
          reglTexture2D.stats = texture.stats;
        }
        reglTexture2D.destroy = function () {
          texture.decRef();
        };

        return reglTexture2D
      }

      function createTextureCube (a0, a1, a2, a3, a4, a5) {
        var texture = new REGLTexture(GL_TEXTURE_CUBE_MAP$1);
        textureSet[texture.id] = texture;
        stats.cubeCount++;

        var faces = new Array(6);

        function reglTextureCube (a0, a1, a2, a3, a4, a5) {
          var i;
          var texInfo = texture.texInfo;
          TexInfo.call(texInfo);
          for (i = 0; i < 6; ++i) {
            faces[i] = allocMipMap();
          }

          if (typeof a0 === 'number' || !a0) {
            var s = (a0 | 0) || 1;
            for (i = 0; i < 6; ++i) {
              parseMipMapFromShape(faces[i], s, s);
            }
          } else if (typeof a0 === 'object') {
            if (a1) {
              parseMipMapFromObject(faces[0], a0);
              parseMipMapFromObject(faces[1], a1);
              parseMipMapFromObject(faces[2], a2);
              parseMipMapFromObject(faces[3], a3);
              parseMipMapFromObject(faces[4], a4);
              parseMipMapFromObject(faces[5], a5);
            } else {
              parseTexInfo(texInfo, a0);
              parseFlags(texture, a0);
              if ('faces' in a0) {
                var faceInput = a0.faces;
                check$1(Array.isArray(faceInput) && faceInput.length === 6,
                  'cube faces must be a length 6 array');
                for (i = 0; i < 6; ++i) {
                  check$1(typeof faceInput[i] === 'object' && !!faceInput[i],
                    'invalid input for cube map face');
                  copyFlags(faces[i], texture);
                  parseMipMapFromObject(faces[i], faceInput[i]);
                }
              } else {
                for (i = 0; i < 6; ++i) {
                  parseMipMapFromObject(faces[i], a0);
                }
              }
            }
          } else {
            check$1.raise('invalid arguments to cube map');
          }

          copyFlags(texture, faces[0]);

          if (!limits.npotTextureCube) {
            check$1(isPow2$1(texture.width) && isPow2$1(texture.height), 'your browser does not support non power or two texture dimensions');
          }

          if (texInfo.genMipmaps) {
            texture.mipmask = (faces[0].width << 1) - 1;
          } else {
            texture.mipmask = faces[0].mipmask;
          }

          check$1.textureCube(texture, texInfo, faces, limits);
          texture.internalformat = faces[0].internalformat;

          reglTextureCube.width = faces[0].width;
          reglTextureCube.height = faces[0].height;

          tempBind(texture);
          for (i = 0; i < 6; ++i) {
            setMipMap(faces[i], GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + i);
          }
          setTexInfo(texInfo, GL_TEXTURE_CUBE_MAP$1);
          tempRestore();

          if (config.profile) {
            texture.stats.size = getTextureSize(
              texture.internalformat,
              texture.type,
              reglTextureCube.width,
              reglTextureCube.height,
              texInfo.genMipmaps,
              true);
          }

          reglTextureCube.format = textureFormatsInvert[texture.internalformat];
          reglTextureCube.type = textureTypesInvert[texture.type];

          reglTextureCube.mag = magFiltersInvert[texInfo.magFilter];
          reglTextureCube.min = minFiltersInvert[texInfo.minFilter];

          reglTextureCube.wrapS = wrapModesInvert[texInfo.wrapS];
          reglTextureCube.wrapT = wrapModesInvert[texInfo.wrapT];

          for (i = 0; i < 6; ++i) {
            freeMipMap(faces[i]);
          }

          return reglTextureCube
        }

        function subimage (face, image, x_, y_, level_) {
          check$1(!!image, 'must specify image data');
          check$1(typeof face === 'number' && face === (face | 0) &&
            face >= 0 && face < 6, 'invalid face');

          var x = x_ | 0;
          var y = y_ | 0;
          var level = level_ | 0;

          var imageData = allocImage();
          copyFlags(imageData, texture);
          imageData.width = 0;
          imageData.height = 0;
          parseImage(imageData, image);
          imageData.width = imageData.width || ((texture.width >> level) - x);
          imageData.height = imageData.height || ((texture.height >> level) - y);

          check$1(
            texture.type === imageData.type &&
            texture.format === imageData.format &&
            texture.internalformat === imageData.internalformat,
            'incompatible format for texture.subimage');
          check$1(
            x >= 0 && y >= 0 &&
            x + imageData.width <= texture.width &&
            y + imageData.height <= texture.height,
            'texture.subimage write out of bounds');
          check$1(
            texture.mipmask & (1 << level),
            'missing mipmap data');
          check$1(
            imageData.data || imageData.element || imageData.needsCopy,
            'missing image data');

          tempBind(texture);
          setSubImage(imageData, GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + face, x, y, level);
          tempRestore();

          freeImage(imageData);

          return reglTextureCube
        }

        function resize (radius_) {
          var radius = radius_ | 0;
          if (radius === texture.width) {
            return
          }

          reglTextureCube.width = texture.width = radius;
          reglTextureCube.height = texture.height = radius;

          tempBind(texture);
          for (var i = 0; i < 6; ++i) {
            for (var j = 0; texture.mipmask >> j; ++j) {
              gl.texImage2D(
                GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + i,
                j,
                texture.format,
                radius >> j,
                radius >> j,
                0,
                texture.format,
                texture.type,
                null);
            }
          }
          tempRestore();

          if (config.profile) {
            texture.stats.size = getTextureSize(
              texture.internalformat,
              texture.type,
              reglTextureCube.width,
              reglTextureCube.height,
              false,
              true);
          }

          return reglTextureCube
        }

        reglTextureCube(a0, a1, a2, a3, a4, a5);

        reglTextureCube.subimage = subimage;
        reglTextureCube.resize = resize;
        reglTextureCube._reglType = 'textureCube';
        reglTextureCube._texture = texture;
        if (config.profile) {
          reglTextureCube.stats = texture.stats;
        }
        reglTextureCube.destroy = function () {
          texture.decRef();
        };

        return reglTextureCube
      }

      // Called when regl is destroyed
      function destroyTextures () {
        for (var i = 0; i < numTexUnits; ++i) {
          gl.activeTexture(GL_TEXTURE0$1 + i);
          gl.bindTexture(GL_TEXTURE_2D$1, null);
          textureUnits[i] = null;
        }
        values(textureSet).forEach(destroy);

        stats.cubeCount = 0;
        stats.textureCount = 0;
      }

      if (config.profile) {
        stats.getTotalTextureSize = function () {
          var total = 0;
          Object.keys(textureSet).forEach(function (key) {
            total += textureSet[key].stats.size;
          });
          return total
        };
      }

      function restoreTextures () {
        for (var i = 0; i < numTexUnits; ++i) {
          var tex = textureUnits[i];
          if (tex) {
            tex.bindCount = 0;
            tex.unit = -1;
            textureUnits[i] = null;
          }
        }

        values(textureSet).forEach(function (texture) {
          texture.texture = gl.createTexture();
          gl.bindTexture(texture.target, texture.texture);
          for (var i = 0; i < 32; ++i) {
            if ((texture.mipmask & (1 << i)) === 0) {
              continue
            }
            if (texture.target === GL_TEXTURE_2D$1) {
              gl.texImage2D(GL_TEXTURE_2D$1,
                i,
                texture.internalformat,
                texture.width >> i,
                texture.height >> i,
                0,
                texture.internalformat,
                texture.type,
                null);
            } else {
              for (var j = 0; j < 6; ++j) {
                gl.texImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + j,
                  i,
                  texture.internalformat,
                  texture.width >> i,
                  texture.height >> i,
                  0,
                  texture.internalformat,
                  texture.type,
                  null);
              }
            }
          }
          setTexInfo(texture.texInfo, texture.target);
        });
      }

      function refreshTextures () {
        for (var i = 0; i < numTexUnits; ++i) {
          var tex = textureUnits[i];
          if (tex) {
            tex.bindCount = 0;
            tex.unit = -1;
            textureUnits[i] = null;
          }
          gl.activeTexture(GL_TEXTURE0$1 + i);
          gl.bindTexture(GL_TEXTURE_2D$1, null);
          gl.bindTexture(GL_TEXTURE_CUBE_MAP$1, null);
        }
      }

      return {
        create2D: createTexture2D,
        createCube: createTextureCube,
        clear: destroyTextures,
        getTexture: function (wrapper) {
          return null
        },
        restore: restoreTextures,
        refresh: refreshTextures
      }
    }

    var GL_RENDERBUFFER = 0x8D41;

    var GL_RGBA4$1 = 0x8056;
    var GL_RGB5_A1$1 = 0x8057;
    var GL_RGB565$1 = 0x8D62;
    var GL_DEPTH_COMPONENT16 = 0x81A5;
    var GL_STENCIL_INDEX8 = 0x8D48;
    var GL_DEPTH_STENCIL$1 = 0x84F9;

    var GL_SRGB8_ALPHA8_EXT = 0x8C43;

    var GL_RGBA32F_EXT = 0x8814;

    var GL_RGBA16F_EXT = 0x881A;
    var GL_RGB16F_EXT = 0x881B;

    var FORMAT_SIZES = [];

    FORMAT_SIZES[GL_RGBA4$1] = 2;
    FORMAT_SIZES[GL_RGB5_A1$1] = 2;
    FORMAT_SIZES[GL_RGB565$1] = 2;

    FORMAT_SIZES[GL_DEPTH_COMPONENT16] = 2;
    FORMAT_SIZES[GL_STENCIL_INDEX8] = 1;
    FORMAT_SIZES[GL_DEPTH_STENCIL$1] = 4;

    FORMAT_SIZES[GL_SRGB8_ALPHA8_EXT] = 4;
    FORMAT_SIZES[GL_RGBA32F_EXT] = 16;
    FORMAT_SIZES[GL_RGBA16F_EXT] = 8;
    FORMAT_SIZES[GL_RGB16F_EXT] = 6;

    function getRenderbufferSize (format, width, height) {
      return FORMAT_SIZES[format] * width * height
    }

    var wrapRenderbuffers = function (gl, extensions, limits, stats, config) {
      var formatTypes = {
        'rgba4': GL_RGBA4$1,
        'rgb565': GL_RGB565$1,
        'rgb5 a1': GL_RGB5_A1$1,
        'depth': GL_DEPTH_COMPONENT16,
        'stencil': GL_STENCIL_INDEX8,
        'depth stencil': GL_DEPTH_STENCIL$1
      };

      if (extensions.ext_srgb) {
        formatTypes['srgba'] = GL_SRGB8_ALPHA8_EXT;
      }

      if (extensions.ext_color_buffer_half_float) {
        formatTypes['rgba16f'] = GL_RGBA16F_EXT;
        formatTypes['rgb16f'] = GL_RGB16F_EXT;
      }

      if (extensions.webgl_color_buffer_float) {
        formatTypes['rgba32f'] = GL_RGBA32F_EXT;
      }

      var formatTypesInvert = [];
      Object.keys(formatTypes).forEach(function (key) {
        var val = formatTypes[key];
        formatTypesInvert[val] = key;
      });

      var renderbufferCount = 0;
      var renderbufferSet = {};

      function REGLRenderbuffer (renderbuffer) {
        this.id = renderbufferCount++;
        this.refCount = 1;

        this.renderbuffer = renderbuffer;

        this.format = GL_RGBA4$1;
        this.width = 0;
        this.height = 0;

        if (config.profile) {
          this.stats = { size: 0 };
        }
      }

      REGLRenderbuffer.prototype.decRef = function () {
        if (--this.refCount <= 0) {
          destroy(this);
        }
      };

      function destroy (rb) {
        var handle = rb.renderbuffer;
        check$1(handle, 'must not double destroy renderbuffer');
        gl.bindRenderbuffer(GL_RENDERBUFFER, null);
        gl.deleteRenderbuffer(handle);
        rb.renderbuffer = null;
        rb.refCount = 0;
        delete renderbufferSet[rb.id];
        stats.renderbufferCount--;
      }

      function createRenderbuffer (a, b) {
        var renderbuffer = new REGLRenderbuffer(gl.createRenderbuffer());
        renderbufferSet[renderbuffer.id] = renderbuffer;
        stats.renderbufferCount++;

        function reglRenderbuffer (a, b) {
          var w = 0;
          var h = 0;
          var format = GL_RGBA4$1;

          if (typeof a === 'object' && a) {
            var options = a;
            if ('shape' in options) {
              var shape = options.shape;
              check$1(Array.isArray(shape) && shape.length >= 2,
                'invalid renderbuffer shape');
              w = shape[0] | 0;
              h = shape[1] | 0;
            } else {
              if ('radius' in options) {
                w = h = options.radius | 0;
              }
              if ('width' in options) {
                w = options.width | 0;
              }
              if ('height' in options) {
                h = options.height | 0;
              }
            }
            if ('format' in options) {
              check$1.parameter(options.format, formatTypes,
                'invalid renderbuffer format');
              format = formatTypes[options.format];
            }
          } else if (typeof a === 'number') {
            w = a | 0;
            if (typeof b === 'number') {
              h = b | 0;
            } else {
              h = w;
            }
          } else if (!a) {
            w = h = 1;
          } else {
            check$1.raise('invalid arguments to renderbuffer constructor');
          }

          // check shape
          check$1(
            w > 0 && h > 0 &&
            w <= limits.maxRenderbufferSize && h <= limits.maxRenderbufferSize,
            'invalid renderbuffer size');

          if (w === renderbuffer.width &&
              h === renderbuffer.height &&
              format === renderbuffer.format) {
            return
          }

          reglRenderbuffer.width = renderbuffer.width = w;
          reglRenderbuffer.height = renderbuffer.height = h;
          renderbuffer.format = format;

          gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer.renderbuffer);
          gl.renderbufferStorage(GL_RENDERBUFFER, format, w, h);

          check$1(
            gl.getError() === 0,
            'invalid render buffer format');

          if (config.profile) {
            renderbuffer.stats.size = getRenderbufferSize(renderbuffer.format, renderbuffer.width, renderbuffer.height);
          }
          reglRenderbuffer.format = formatTypesInvert[renderbuffer.format];

          return reglRenderbuffer
        }

        function resize (w_, h_) {
          var w = w_ | 0;
          var h = (h_ | 0) || w;

          if (w === renderbuffer.width && h === renderbuffer.height) {
            return reglRenderbuffer
          }

          // check shape
          check$1(
            w > 0 && h > 0 &&
            w <= limits.maxRenderbufferSize && h <= limits.maxRenderbufferSize,
            'invalid renderbuffer size');

          reglRenderbuffer.width = renderbuffer.width = w;
          reglRenderbuffer.height = renderbuffer.height = h;

          gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer.renderbuffer);
          gl.renderbufferStorage(GL_RENDERBUFFER, renderbuffer.format, w, h);

          check$1(
            gl.getError() === 0,
            'invalid render buffer format');

          // also, recompute size.
          if (config.profile) {
            renderbuffer.stats.size = getRenderbufferSize(
              renderbuffer.format, renderbuffer.width, renderbuffer.height);
          }

          return reglRenderbuffer
        }

        reglRenderbuffer(a, b);

        reglRenderbuffer.resize = resize;
        reglRenderbuffer._reglType = 'renderbuffer';
        reglRenderbuffer._renderbuffer = renderbuffer;
        if (config.profile) {
          reglRenderbuffer.stats = renderbuffer.stats;
        }
        reglRenderbuffer.destroy = function () {
          renderbuffer.decRef();
        };

        return reglRenderbuffer
      }

      if (config.profile) {
        stats.getTotalRenderbufferSize = function () {
          var total = 0;
          Object.keys(renderbufferSet).forEach(function (key) {
            total += renderbufferSet[key].stats.size;
          });
          return total
        };
      }

      function restoreRenderbuffers () {
        values(renderbufferSet).forEach(function (rb) {
          rb.renderbuffer = gl.createRenderbuffer();
          gl.bindRenderbuffer(GL_RENDERBUFFER, rb.renderbuffer);
          gl.renderbufferStorage(GL_RENDERBUFFER, rb.format, rb.width, rb.height);
        });
        gl.bindRenderbuffer(GL_RENDERBUFFER, null);
      }

      return {
        create: createRenderbuffer,
        clear: function () {
          values(renderbufferSet).forEach(destroy);
        },
        restore: restoreRenderbuffers
      }
    };

    // We store these constants so that the minifier can inline them
    var GL_FRAMEBUFFER$1 = 0x8D40;
    var GL_RENDERBUFFER$1 = 0x8D41;

    var GL_TEXTURE_2D$2 = 0x0DE1;
    var GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 = 0x8515;

    var GL_COLOR_ATTACHMENT0$1 = 0x8CE0;
    var GL_DEPTH_ATTACHMENT = 0x8D00;
    var GL_STENCIL_ATTACHMENT = 0x8D20;
    var GL_DEPTH_STENCIL_ATTACHMENT = 0x821A;

    var GL_FRAMEBUFFER_COMPLETE$1 = 0x8CD5;
    var GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 0x8CD6;
    var GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8CD7;
    var GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 0x8CD9;
    var GL_FRAMEBUFFER_UNSUPPORTED = 0x8CDD;

    var GL_HALF_FLOAT_OES$2 = 0x8D61;
    var GL_UNSIGNED_BYTE$6 = 0x1401;
    var GL_FLOAT$5 = 0x1406;

    var GL_RGB$1 = 0x1907;
    var GL_RGBA$2 = 0x1908;

    var GL_DEPTH_COMPONENT$1 = 0x1902;

    var colorTextureFormatEnums = [
      GL_RGB$1,
      GL_RGBA$2
    ];

    // for every texture format, store
    // the number of channels
    var textureFormatChannels = [];
    textureFormatChannels[GL_RGBA$2] = 4;
    textureFormatChannels[GL_RGB$1] = 3;

    // for every texture type, store
    // the size in bytes.
    var textureTypeSizes = [];
    textureTypeSizes[GL_UNSIGNED_BYTE$6] = 1;
    textureTypeSizes[GL_FLOAT$5] = 4;
    textureTypeSizes[GL_HALF_FLOAT_OES$2] = 2;

    var GL_RGBA4$2 = 0x8056;
    var GL_RGB5_A1$2 = 0x8057;
    var GL_RGB565$2 = 0x8D62;
    var GL_DEPTH_COMPONENT16$1 = 0x81A5;
    var GL_STENCIL_INDEX8$1 = 0x8D48;
    var GL_DEPTH_STENCIL$2 = 0x84F9;

    var GL_SRGB8_ALPHA8_EXT$1 = 0x8C43;

    var GL_RGBA32F_EXT$1 = 0x8814;

    var GL_RGBA16F_EXT$1 = 0x881A;
    var GL_RGB16F_EXT$1 = 0x881B;

    var colorRenderbufferFormatEnums = [
      GL_RGBA4$2,
      GL_RGB5_A1$2,
      GL_RGB565$2,
      GL_SRGB8_ALPHA8_EXT$1,
      GL_RGBA16F_EXT$1,
      GL_RGB16F_EXT$1,
      GL_RGBA32F_EXT$1
    ];

    var statusCode = {};
    statusCode[GL_FRAMEBUFFER_COMPLETE$1] = 'complete';
    statusCode[GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT] = 'incomplete attachment';
    statusCode[GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS] = 'incomplete dimensions';
    statusCode[GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT] = 'incomplete, missing attachment';
    statusCode[GL_FRAMEBUFFER_UNSUPPORTED] = 'unsupported';

    function wrapFBOState (
      gl,
      extensions,
      limits,
      textureState,
      renderbufferState,
      stats) {
      var framebufferState = {
        cur: null,
        next: null,
        dirty: false,
        setFBO: null
      };

      var colorTextureFormats = ['rgba'];
      var colorRenderbufferFormats = ['rgba4', 'rgb565', 'rgb5 a1'];

      if (extensions.ext_srgb) {
        colorRenderbufferFormats.push('srgba');
      }

      if (extensions.ext_color_buffer_half_float) {
        colorRenderbufferFormats.push('rgba16f', 'rgb16f');
      }

      if (extensions.webgl_color_buffer_float) {
        colorRenderbufferFormats.push('rgba32f');
      }

      var colorTypes = ['uint8'];
      if (extensions.oes_texture_half_float) {
        colorTypes.push('half float', 'float16');
      }
      if (extensions.oes_texture_float) {
        colorTypes.push('float', 'float32');
      }

      function FramebufferAttachment (target, texture, renderbuffer) {
        this.target = target;
        this.texture = texture;
        this.renderbuffer = renderbuffer;

        var w = 0;
        var h = 0;
        if (texture) {
          w = texture.width;
          h = texture.height;
        } else if (renderbuffer) {
          w = renderbuffer.width;
          h = renderbuffer.height;
        }
        this.width = w;
        this.height = h;
      }

      function decRef (attachment) {
        if (attachment) {
          if (attachment.texture) {
            attachment.texture._texture.decRef();
          }
          if (attachment.renderbuffer) {
            attachment.renderbuffer._renderbuffer.decRef();
          }
        }
      }

      function incRefAndCheckShape (attachment, width, height) {
        if (!attachment) {
          return
        }
        if (attachment.texture) {
          var texture = attachment.texture._texture;
          var tw = Math.max(1, texture.width);
          var th = Math.max(1, texture.height);
          check$1(tw === width && th === height,
            'inconsistent width/height for supplied texture');
          texture.refCount += 1;
        } else {
          var renderbuffer = attachment.renderbuffer._renderbuffer;
          check$1(
            renderbuffer.width === width && renderbuffer.height === height,
            'inconsistent width/height for renderbuffer');
          renderbuffer.refCount += 1;
        }
      }

      function attach (location, attachment) {
        if (attachment) {
          if (attachment.texture) {
            gl.framebufferTexture2D(
              GL_FRAMEBUFFER$1,
              location,
              attachment.target,
              attachment.texture._texture.texture,
              0);
          } else {
            gl.framebufferRenderbuffer(
              GL_FRAMEBUFFER$1,
              location,
              GL_RENDERBUFFER$1,
              attachment.renderbuffer._renderbuffer.renderbuffer);
          }
        }
      }

      function parseAttachment (attachment) {
        var target = GL_TEXTURE_2D$2;
        var texture = null;
        var renderbuffer = null;

        var data = attachment;
        if (typeof attachment === 'object') {
          data = attachment.data;
          if ('target' in attachment) {
            target = attachment.target | 0;
          }
        }

        check$1.type(data, 'function', 'invalid attachment data');

        var type = data._reglType;
        if (type === 'texture2d') {
          texture = data;
          check$1(target === GL_TEXTURE_2D$2);
        } else if (type === 'textureCube') {
          texture = data;
          check$1(
            target >= GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 &&
            target < GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 + 6,
            'invalid cube map target');
        } else if (type === 'renderbuffer') {
          renderbuffer = data;
          target = GL_RENDERBUFFER$1;
        } else {
          check$1.raise('invalid regl object for attachment');
        }

        return new FramebufferAttachment(target, texture, renderbuffer)
      }

      function allocAttachment (
        width,
        height,
        isTexture,
        format,
        type) {
        if (isTexture) {
          var texture = textureState.create2D({
            width: width,
            height: height,
            format: format,
            type: type
          });
          texture._texture.refCount = 0;
          return new FramebufferAttachment(GL_TEXTURE_2D$2, texture, null)
        } else {
          var rb = renderbufferState.create({
            width: width,
            height: height,
            format: format
          });
          rb._renderbuffer.refCount = 0;
          return new FramebufferAttachment(GL_RENDERBUFFER$1, null, rb)
        }
      }

      function unwrapAttachment (attachment) {
        return attachment && (attachment.texture || attachment.renderbuffer)
      }

      function resizeAttachment (attachment, w, h) {
        if (attachment) {
          if (attachment.texture) {
            attachment.texture.resize(w, h);
          } else if (attachment.renderbuffer) {
            attachment.renderbuffer.resize(w, h);
          }
          attachment.width = w;
          attachment.height = h;
        }
      }

      var framebufferCount = 0;
      var framebufferSet = {};

      function REGLFramebuffer () {
        this.id = framebufferCount++;
        framebufferSet[this.id] = this;

        this.framebuffer = gl.createFramebuffer();
        this.width = 0;
        this.height = 0;

        this.colorAttachments = [];
        this.depthAttachment = null;
        this.stencilAttachment = null;
        this.depthStencilAttachment = null;
      }

      function decFBORefs (framebuffer) {
        framebuffer.colorAttachments.forEach(decRef);
        decRef(framebuffer.depthAttachment);
        decRef(framebuffer.stencilAttachment);
        decRef(framebuffer.depthStencilAttachment);
      }

      function destroy (framebuffer) {
        var handle = framebuffer.framebuffer;
        check$1(handle, 'must not double destroy framebuffer');
        gl.deleteFramebuffer(handle);
        framebuffer.framebuffer = null;
        stats.framebufferCount--;
        delete framebufferSet[framebuffer.id];
      }

      function updateFramebuffer (framebuffer) {
        var i;

        gl.bindFramebuffer(GL_FRAMEBUFFER$1, framebuffer.framebuffer);
        var colorAttachments = framebuffer.colorAttachments;
        for (i = 0; i < colorAttachments.length; ++i) {
          attach(GL_COLOR_ATTACHMENT0$1 + i, colorAttachments[i]);
        }
        for (i = colorAttachments.length; i < limits.maxColorAttachments; ++i) {
          gl.framebufferTexture2D(
            GL_FRAMEBUFFER$1,
            GL_COLOR_ATTACHMENT0$1 + i,
            GL_TEXTURE_2D$2,
            null,
            0);
        }

        gl.framebufferTexture2D(
          GL_FRAMEBUFFER$1,
          GL_DEPTH_STENCIL_ATTACHMENT,
          GL_TEXTURE_2D$2,
          null,
          0);
        gl.framebufferTexture2D(
          GL_FRAMEBUFFER$1,
          GL_DEPTH_ATTACHMENT,
          GL_TEXTURE_2D$2,
          null,
          0);
        gl.framebufferTexture2D(
          GL_FRAMEBUFFER$1,
          GL_STENCIL_ATTACHMENT,
          GL_TEXTURE_2D$2,
          null,
          0);

        attach(GL_DEPTH_ATTACHMENT, framebuffer.depthAttachment);
        attach(GL_STENCIL_ATTACHMENT, framebuffer.stencilAttachment);
        attach(GL_DEPTH_STENCIL_ATTACHMENT, framebuffer.depthStencilAttachment);

        // Check status code
        var status = gl.checkFramebufferStatus(GL_FRAMEBUFFER$1);
        if (!gl.isContextLost() && status !== GL_FRAMEBUFFER_COMPLETE$1) {
          check$1.raise('framebuffer configuration not supported, status = ' +
            statusCode[status]);
        }

        gl.bindFramebuffer(GL_FRAMEBUFFER$1, framebufferState.next ? framebufferState.next.framebuffer : null);
        framebufferState.cur = framebufferState.next;

        // FIXME: Clear error code here.  This is a work around for a bug in
        // headless-gl
        gl.getError();
      }

      function createFBO (a0, a1) {
        var framebuffer = new REGLFramebuffer();
        stats.framebufferCount++;

        function reglFramebuffer (a, b) {
          var i;

          check$1(framebufferState.next !== framebuffer,
            'can not update framebuffer which is currently in use');

          var width = 0;
          var height = 0;

          var needsDepth = true;
          var needsStencil = true;

          var colorBuffer = null;
          var colorTexture = true;
          var colorFormat = 'rgba';
          var colorType = 'uint8';
          var colorCount = 1;

          var depthBuffer = null;
          var stencilBuffer = null;
          var depthStencilBuffer = null;
          var depthStencilTexture = false;

          if (typeof a === 'number') {
            width = a | 0;
            height = (b | 0) || width;
          } else if (!a) {
            width = height = 1;
          } else {
            check$1.type(a, 'object', 'invalid arguments for framebuffer');
            var options = a;

            if ('shape' in options) {
              var shape = options.shape;
              check$1(Array.isArray(shape) && shape.length >= 2,
                'invalid shape for framebuffer');
              width = shape[0];
              height = shape[1];
            } else {
              if ('radius' in options) {
                width = height = options.radius;
              }
              if ('width' in options) {
                width = options.width;
              }
              if ('height' in options) {
                height = options.height;
              }
            }

            if ('color' in options ||
                'colors' in options) {
              colorBuffer =
                options.color ||
                options.colors;
              if (Array.isArray(colorBuffer)) {
                check$1(
                  colorBuffer.length === 1 || extensions.webgl_draw_buffers,
                  'multiple render targets not supported');
              }
            }

            if (!colorBuffer) {
              if ('colorCount' in options) {
                colorCount = options.colorCount | 0;
                check$1(colorCount > 0, 'invalid color buffer count');
              }

              if ('colorTexture' in options) {
                colorTexture = !!options.colorTexture;
                colorFormat = 'rgba4';
              }

              if ('colorType' in options) {
                colorType = options.colorType;
                if (!colorTexture) {
                  if (colorType === 'half float' || colorType === 'float16') {
                    check$1(extensions.ext_color_buffer_half_float,
                      'you must enable EXT_color_buffer_half_float to use 16-bit render buffers');
                    colorFormat = 'rgba16f';
                  } else if (colorType === 'float' || colorType === 'float32') {
                    check$1(extensions.webgl_color_buffer_float,
                      'you must enable WEBGL_color_buffer_float in order to use 32-bit floating point renderbuffers');
                    colorFormat = 'rgba32f';
                  }
                } else {
                  check$1(extensions.oes_texture_float ||
                    !(colorType === 'float' || colorType === 'float32'),
                  'you must enable OES_texture_float in order to use floating point framebuffer objects');
                  check$1(extensions.oes_texture_half_float ||
                    !(colorType === 'half float' || colorType === 'float16'),
                  'you must enable OES_texture_half_float in order to use 16-bit floating point framebuffer objects');
                }
                check$1.oneOf(colorType, colorTypes, 'invalid color type');
              }

              if ('colorFormat' in options) {
                colorFormat = options.colorFormat;
                if (colorTextureFormats.indexOf(colorFormat) >= 0) {
                  colorTexture = true;
                } else if (colorRenderbufferFormats.indexOf(colorFormat) >= 0) {
                  colorTexture = false;
                } else {
                  if (colorTexture) {
                    check$1.oneOf(
                      options.colorFormat, colorTextureFormats,
                      'invalid color format for texture');
                  } else {
                    check$1.oneOf(
                      options.colorFormat, colorRenderbufferFormats,
                      'invalid color format for renderbuffer');
                  }
                }
              }
            }

            if ('depthTexture' in options || 'depthStencilTexture' in options) {
              depthStencilTexture = !!(options.depthTexture ||
                options.depthStencilTexture);
              check$1(!depthStencilTexture || extensions.webgl_depth_texture,
                'webgl_depth_texture extension not supported');
            }

            if ('depth' in options) {
              if (typeof options.depth === 'boolean') {
                needsDepth = options.depth;
              } else {
                depthBuffer = options.depth;
                needsStencil = false;
              }
            }

            if ('stencil' in options) {
              if (typeof options.stencil === 'boolean') {
                needsStencil = options.stencil;
              } else {
                stencilBuffer = options.stencil;
                needsDepth = false;
              }
            }

            if ('depthStencil' in options) {
              if (typeof options.depthStencil === 'boolean') {
                needsDepth = needsStencil = options.depthStencil;
              } else {
                depthStencilBuffer = options.depthStencil;
                needsDepth = false;
                needsStencil = false;
              }
            }
          }

          // parse attachments
          var colorAttachments = null;
          var depthAttachment = null;
          var stencilAttachment = null;
          var depthStencilAttachment = null;

          // Set up color attachments
          if (Array.isArray(colorBuffer)) {
            colorAttachments = colorBuffer.map(parseAttachment);
          } else if (colorBuffer) {
            colorAttachments = [parseAttachment(colorBuffer)];
          } else {
            colorAttachments = new Array(colorCount);
            for (i = 0; i < colorCount; ++i) {
              colorAttachments[i] = allocAttachment(
                width,
                height,
                colorTexture,
                colorFormat,
                colorType);
            }
          }

          check$1(extensions.webgl_draw_buffers || colorAttachments.length <= 1,
            'you must enable the WEBGL_draw_buffers extension in order to use multiple color buffers.');
          check$1(colorAttachments.length <= limits.maxColorAttachments,
            'too many color attachments, not supported');

          width = width || colorAttachments[0].width;
          height = height || colorAttachments[0].height;

          if (depthBuffer) {
            depthAttachment = parseAttachment(depthBuffer);
          } else if (needsDepth && !needsStencil) {
            depthAttachment = allocAttachment(
              width,
              height,
              depthStencilTexture,
              'depth',
              'uint32');
          }

          if (stencilBuffer) {
            stencilAttachment = parseAttachment(stencilBuffer);
          } else if (needsStencil && !needsDepth) {
            stencilAttachment = allocAttachment(
              width,
              height,
              false,
              'stencil',
              'uint8');
          }

          if (depthStencilBuffer) {
            depthStencilAttachment = parseAttachment(depthStencilBuffer);
          } else if (!depthBuffer && !stencilBuffer && needsStencil && needsDepth) {
            depthStencilAttachment = allocAttachment(
              width,
              height,
              depthStencilTexture,
              'depth stencil',
              'depth stencil');
          }

          check$1(
            (!!depthBuffer) + (!!stencilBuffer) + (!!depthStencilBuffer) <= 1,
            'invalid framebuffer configuration, can specify exactly one depth/stencil attachment');

          var commonColorAttachmentSize = null;

          for (i = 0; i < colorAttachments.length; ++i) {
            incRefAndCheckShape(colorAttachments[i], width, height);
            check$1(!colorAttachments[i] ||
              (colorAttachments[i].texture &&
                colorTextureFormatEnums.indexOf(colorAttachments[i].texture._texture.format) >= 0) ||
              (colorAttachments[i].renderbuffer &&
                colorRenderbufferFormatEnums.indexOf(colorAttachments[i].renderbuffer._renderbuffer.format) >= 0),
            'framebuffer color attachment ' + i + ' is invalid');

            if (colorAttachments[i] && colorAttachments[i].texture) {
              var colorAttachmentSize =
                  textureFormatChannels[colorAttachments[i].texture._texture.format] *
                  textureTypeSizes[colorAttachments[i].texture._texture.type];

              if (commonColorAttachmentSize === null) {
                commonColorAttachmentSize = colorAttachmentSize;
              } else {
                // We need to make sure that all color attachments have the same number of bitplanes
                // (that is, the same numer of bits per pixel)
                // This is required by the GLES2.0 standard. See the beginning of Chapter 4 in that document.
                check$1(commonColorAttachmentSize === colorAttachmentSize,
                  'all color attachments much have the same number of bits per pixel.');
              }
            }
          }
          incRefAndCheckShape(depthAttachment, width, height);
          check$1(!depthAttachment ||
            (depthAttachment.texture &&
              depthAttachment.texture._texture.format === GL_DEPTH_COMPONENT$1) ||
            (depthAttachment.renderbuffer &&
              depthAttachment.renderbuffer._renderbuffer.format === GL_DEPTH_COMPONENT16$1),
          'invalid depth attachment for framebuffer object');
          incRefAndCheckShape(stencilAttachment, width, height);
          check$1(!stencilAttachment ||
            (stencilAttachment.renderbuffer &&
              stencilAttachment.renderbuffer._renderbuffer.format === GL_STENCIL_INDEX8$1),
          'invalid stencil attachment for framebuffer object');
          incRefAndCheckShape(depthStencilAttachment, width, height);
          check$1(!depthStencilAttachment ||
            (depthStencilAttachment.texture &&
              depthStencilAttachment.texture._texture.format === GL_DEPTH_STENCIL$2) ||
            (depthStencilAttachment.renderbuffer &&
              depthStencilAttachment.renderbuffer._renderbuffer.format === GL_DEPTH_STENCIL$2),
          'invalid depth-stencil attachment for framebuffer object');

          // decrement references
          decFBORefs(framebuffer);

          framebuffer.width = width;
          framebuffer.height = height;

          framebuffer.colorAttachments = colorAttachments;
          framebuffer.depthAttachment = depthAttachment;
          framebuffer.stencilAttachment = stencilAttachment;
          framebuffer.depthStencilAttachment = depthStencilAttachment;

          reglFramebuffer.color = colorAttachments.map(unwrapAttachment);
          reglFramebuffer.depth = unwrapAttachment(depthAttachment);
          reglFramebuffer.stencil = unwrapAttachment(stencilAttachment);
          reglFramebuffer.depthStencil = unwrapAttachment(depthStencilAttachment);

          reglFramebuffer.width = framebuffer.width;
          reglFramebuffer.height = framebuffer.height;

          updateFramebuffer(framebuffer);

          return reglFramebuffer
        }

        function resize (w_, h_) {
          check$1(framebufferState.next !== framebuffer,
            'can not resize a framebuffer which is currently in use');

          var w = Math.max(w_ | 0, 1);
          var h = Math.max((h_ | 0) || w, 1);
          if (w === framebuffer.width && h === framebuffer.height) {
            return reglFramebuffer
          }

          // resize all buffers
          var colorAttachments = framebuffer.colorAttachments;
          for (var i = 0; i < colorAttachments.length; ++i) {
            resizeAttachment(colorAttachments[i], w, h);
          }
          resizeAttachment(framebuffer.depthAttachment, w, h);
          resizeAttachment(framebuffer.stencilAttachment, w, h);
          resizeAttachment(framebuffer.depthStencilAttachment, w, h);

          framebuffer.width = reglFramebuffer.width = w;
          framebuffer.height = reglFramebuffer.height = h;

          updateFramebuffer(framebuffer);

          return reglFramebuffer
        }

        reglFramebuffer(a0, a1);

        return extend(reglFramebuffer, {
          resize: resize,
          _reglType: 'framebuffer',
          _framebuffer: framebuffer,
          destroy: function () {
            destroy(framebuffer);
            decFBORefs(framebuffer);
          },
          use: function (block) {
            framebufferState.setFBO({
              framebuffer: reglFramebuffer
            }, block);
          }
        })
      }

      function createCubeFBO (options) {
        var faces = Array(6);

        function reglFramebufferCube (a) {
          var i;

          check$1(faces.indexOf(framebufferState.next) < 0,
            'can not update framebuffer which is currently in use');

          var params = {
            color: null
          };

          var radius = 0;

          var colorBuffer = null;
          var colorFormat = 'rgba';
          var colorType = 'uint8';
          var colorCount = 1;

          if (typeof a === 'number') {
            radius = a | 0;
          } else if (!a) {
            radius = 1;
          } else {
            check$1.type(a, 'object', 'invalid arguments for framebuffer');
            var options = a;

            if ('shape' in options) {
              var shape = options.shape;
              check$1(
                Array.isArray(shape) && shape.length >= 2,
                'invalid shape for framebuffer');
              check$1(
                shape[0] === shape[1],
                'cube framebuffer must be square');
              radius = shape[0];
            } else {
              if ('radius' in options) {
                radius = options.radius | 0;
              }
              if ('width' in options) {
                radius = options.width | 0;
                if ('height' in options) {
                  check$1(options.height === radius, 'must be square');
                }
              } else if ('height' in options) {
                radius = options.height | 0;
              }
            }

            if ('color' in options ||
                'colors' in options) {
              colorBuffer =
                options.color ||
                options.colors;
              if (Array.isArray(colorBuffer)) {
                check$1(
                  colorBuffer.length === 1 || extensions.webgl_draw_buffers,
                  'multiple render targets not supported');
              }
            }

            if (!colorBuffer) {
              if ('colorCount' in options) {
                colorCount = options.colorCount | 0;
                check$1(colorCount > 0, 'invalid color buffer count');
              }

              if ('colorType' in options) {
                check$1.oneOf(
                  options.colorType, colorTypes,
                  'invalid color type');
                colorType = options.colorType;
              }

              if ('colorFormat' in options) {
                colorFormat = options.colorFormat;
                check$1.oneOf(
                  options.colorFormat, colorTextureFormats,
                  'invalid color format for texture');
              }
            }

            if ('depth' in options) {
              params.depth = options.depth;
            }

            if ('stencil' in options) {
              params.stencil = options.stencil;
            }

            if ('depthStencil' in options) {
              params.depthStencil = options.depthStencil;
            }
          }

          var colorCubes;
          if (colorBuffer) {
            if (Array.isArray(colorBuffer)) {
              colorCubes = [];
              for (i = 0; i < colorBuffer.length; ++i) {
                colorCubes[i] = colorBuffer[i];
              }
            } else {
              colorCubes = [ colorBuffer ];
            }
          } else {
            colorCubes = Array(colorCount);
            var cubeMapParams = {
              radius: radius,
              format: colorFormat,
              type: colorType
            };
            for (i = 0; i < colorCount; ++i) {
              colorCubes[i] = textureState.createCube(cubeMapParams);
            }
          }

          // Check color cubes
          params.color = Array(colorCubes.length);
          for (i = 0; i < colorCubes.length; ++i) {
            var cube = colorCubes[i];
            check$1(
              typeof cube === 'function' && cube._reglType === 'textureCube',
              'invalid cube map');
            radius = radius || cube.width;
            check$1(
              cube.width === radius && cube.height === radius,
              'invalid cube map shape');
            params.color[i] = {
              target: GL_TEXTURE_CUBE_MAP_POSITIVE_X$2,
              data: colorCubes[i]
            };
          }

          for (i = 0; i < 6; ++i) {
            for (var j = 0; j < colorCubes.length; ++j) {
              params.color[j].target = GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 + i;
            }
            // reuse depth-stencil attachments across all cube maps
            if (i > 0) {
              params.depth = faces[0].depth;
              params.stencil = faces[0].stencil;
              params.depthStencil = faces[0].depthStencil;
            }
            if (faces[i]) {
              (faces[i])(params);
            } else {
              faces[i] = createFBO(params);
            }
          }

          return extend(reglFramebufferCube, {
            width: radius,
            height: radius,
            color: colorCubes
          })
        }

        function resize (radius_) {
          var i;
          var radius = radius_ | 0;
          check$1(radius > 0 && radius <= limits.maxCubeMapSize,
            'invalid radius for cube fbo');

          if (radius === reglFramebufferCube.width) {
            return reglFramebufferCube
          }

          var colors = reglFramebufferCube.color;
          for (i = 0; i < colors.length; ++i) {
            colors[i].resize(radius);
          }

          for (i = 0; i < 6; ++i) {
            faces[i].resize(radius);
          }

          reglFramebufferCube.width = reglFramebufferCube.height = radius;

          return reglFramebufferCube
        }

        reglFramebufferCube(options);

        return extend(reglFramebufferCube, {
          faces: faces,
          resize: resize,
          _reglType: 'framebufferCube',
          destroy: function () {
            faces.forEach(function (f) {
              f.destroy();
            });
          }
        })
      }

      function restoreFramebuffers () {
        framebufferState.cur = null;
        framebufferState.next = null;
        framebufferState.dirty = true;
        values(framebufferSet).forEach(function (fb) {
          fb.framebuffer = gl.createFramebuffer();
          updateFramebuffer(fb);
        });
      }

      return extend(framebufferState, {
        getFramebuffer: function (object) {
          if (typeof object === 'function' && object._reglType === 'framebuffer') {
            var fbo = object._framebuffer;
            if (fbo instanceof REGLFramebuffer) {
              return fbo
            }
          }
          return null
        },
        create: createFBO,
        createCube: createCubeFBO,
        clear: function () {
          values(framebufferSet).forEach(destroy);
        },
        restore: restoreFramebuffers
      })
    }

    var GL_FLOAT$6 = 5126;
    var GL_ARRAY_BUFFER$1 = 34962;

    function AttributeRecord () {
      this.state = 0;

      this.x = 0.0;
      this.y = 0.0;
      this.z = 0.0;
      this.w = 0.0;

      this.buffer = null;
      this.size = 0;
      this.normalized = false;
      this.type = GL_FLOAT$6;
      this.offset = 0;
      this.stride = 0;
      this.divisor = 0;
    }

    function wrapAttributeState (
      gl,
      extensions,
      limits,
      stats,
      bufferState) {
      var NUM_ATTRIBUTES = limits.maxAttributes;
      var attributeBindings = new Array(NUM_ATTRIBUTES);
      for (var i = 0; i < NUM_ATTRIBUTES; ++i) {
        attributeBindings[i] = new AttributeRecord();
      }
      var vaoCount = 0;
      var vaoSet = {};

      var state = {
        Record: AttributeRecord,
        scope: {},
        state: attributeBindings,
        currentVAO: null,
        targetVAO: null,
        restore: extVAO() ? restoreVAO : function () {},
        createVAO: createVAO,
        getVAO: getVAO,
        destroyBuffer: destroyBuffer,
        setVAO: extVAO() ? setVAOEXT : setVAOEmulated,
        clear: extVAO() ? destroyVAOEXT : function () {}
      };

      function destroyBuffer (buffer) {
        for (var i = 0; i < attributeBindings.length; ++i) {
          var record = attributeBindings[i];
          if (record.buffer === buffer) {
            gl.disableVertexAttribArray(i);
            record.buffer = null;
          }
        }
      }

      function extVAO () {
        return extensions.oes_vertex_array_object
      }

      function extInstanced () {
        return extensions.angle_instanced_arrays
      }

      function getVAO (vao) {
        if (typeof vao === 'function' && vao._vao) {
          return vao._vao
        }
        return null
      }

      function setVAOEXT (vao) {
        if (vao === state.currentVAO) {
          return
        }
        var ext = extVAO();
        if (vao) {
          ext.bindVertexArrayOES(vao.vao);
        } else {
          ext.bindVertexArrayOES(null);
        }
        state.currentVAO = vao;
      }

      function setVAOEmulated (vao) {
        if (vao === state.currentVAO) {
          return
        }
        if (vao) {
          vao.bindAttrs();
        } else {
          var exti = extInstanced();
          for (var i = 0; i < attributeBindings.length; ++i) {
            var binding = attributeBindings[i];
            if (binding.buffer) {
              gl.enableVertexAttribArray(i);
              gl.vertexAttribPointer(i, binding.size, binding.type, binding.normalized, binding.stride, binding.offfset);
              if (exti && binding.divisor) {
                exti.vertexAttribDivisorANGLE(i, binding.divisor);
              }
            } else {
              gl.disableVertexAttribArray(i);
              gl.vertexAttrib4f(i, binding.x, binding.y, binding.z, binding.w);
            }
          }
        }
        state.currentVAO = vao;
      }

      function destroyVAOEXT () {
        values(vaoSet).forEach(function (vao) {
          vao.destroy();
        });
      }

      function REGLVAO () {
        this.id = ++vaoCount;
        this.attributes = [];
        var extension = extVAO();
        if (extension) {
          this.vao = extension.createVertexArrayOES();
        } else {
          this.vao = null;
        }
        vaoSet[this.id] = this;
        this.buffers = [];
      }

      REGLVAO.prototype.bindAttrs = function () {
        var exti = extInstanced();
        var attributes = this.attributes;
        for (var i = 0; i < attributes.length; ++i) {
          var attr = attributes[i];
          if (attr.buffer) {
            gl.enableVertexAttribArray(i);
            gl.bindBuffer(GL_ARRAY_BUFFER$1, attr.buffer.buffer);
            gl.vertexAttribPointer(i, attr.size, attr.type, attr.normalized, attr.stride, attr.offset);
            if (exti && attr.divisor) {
              exti.vertexAttribDivisorANGLE(i, attr.divisor);
            }
          } else {
            gl.disableVertexAttribArray(i);
            gl.vertexAttrib4f(i, attr.x, attr.y, attr.z, attr.w);
          }
        }
        for (var j = attributes.length; j < NUM_ATTRIBUTES; ++j) {
          gl.disableVertexAttribArray(j);
        }
      };

      REGLVAO.prototype.refresh = function () {
        var ext = extVAO();
        if (ext) {
          ext.bindVertexArrayOES(this.vao);
          this.bindAttrs();
          state.currentVAO = this;
        }
      };

      REGLVAO.prototype.destroy = function () {
        if (this.vao) {
          var extension = extVAO();
          if (this === state.currentVAO) {
            state.currentVAO = null;
            extension.bindVertexArrayOES(null);
          }
          extension.deleteVertexArrayOES(this.vao);
          this.vao = null;
        }
        if (vaoSet[this.id]) {
          delete vaoSet[this.id];
          stats.vaoCount -= 1;
        }
      };

      function restoreVAO () {
        var ext = extVAO();
        if (ext) {
          values(vaoSet).forEach(function (vao) {
            vao.refresh();
          });
        }
      }

      function createVAO (_attr) {
        var vao = new REGLVAO();
        stats.vaoCount += 1;

        function updateVAO (attributes) {
          check$1(Array.isArray(attributes), 'arguments to vertex array constructor must be an array');
          check$1(attributes.length < NUM_ATTRIBUTES, 'too many attributes');
          check$1(attributes.length > 0, 'must specify at least one attribute');

          var bufUpdated = {};
          var nattributes = vao.attributes;
          nattributes.length = attributes.length;
          for (var i = 0; i < attributes.length; ++i) {
            var spec = attributes[i];
            var rec = nattributes[i] = new AttributeRecord();
            var data = spec.data || spec;
            if (Array.isArray(data) || isTypedArray(data) || isNDArrayLike(data)) {
              var buf;
              if (vao.buffers[i]) {
                buf = vao.buffers[i];
                if (isTypedArray(data) && buf._buffer.byteLength >= data.byteLength) {
                  buf.subdata(data);
                } else {
                  buf.destroy();
                  vao.buffers[i] = null;
                }
              }
              if (!vao.buffers[i]) {
                buf = vao.buffers[i] = bufferState.create(spec, GL_ARRAY_BUFFER$1, false, true);
              }
              rec.buffer = bufferState.getBuffer(buf);
              rec.size = rec.buffer.dimension | 0;
              rec.normalized = false;
              rec.type = rec.buffer.dtype;
              rec.offset = 0;
              rec.stride = 0;
              rec.divisor = 0;
              rec.state = 1;
              bufUpdated[i] = 1;
            } else if (bufferState.getBuffer(spec)) {
              rec.buffer = bufferState.getBuffer(spec);
              rec.size = rec.buffer.dimension | 0;
              rec.normalized = false;
              rec.type = rec.buffer.dtype;
              rec.offset = 0;
              rec.stride = 0;
              rec.divisor = 0;
              rec.state = 1;
            } else if (bufferState.getBuffer(spec.buffer)) {
              rec.buffer = bufferState.getBuffer(spec.buffer);
              rec.size = ((+spec.size) || rec.buffer.dimension) | 0;
              rec.normalized = !!spec.normalized || false;
              if ('type' in spec) {
                check$1.parameter(spec.type, glTypes, 'invalid buffer type');
                rec.type = glTypes[spec.type];
              } else {
                rec.type = rec.buffer.dtype;
              }
              rec.offset = (spec.offset || 0) | 0;
              rec.stride = (spec.stride || 0) | 0;
              rec.divisor = (spec.divisor || 0) | 0;
              rec.state = 1;

              check$1(rec.size >= 1 && rec.size <= 4, 'size must be between 1 and 4');
              check$1(rec.offset >= 0, 'invalid offset');
              check$1(rec.stride >= 0 && rec.stride <= 255, 'stride must be between 0 and 255');
              check$1(rec.divisor >= 0, 'divisor must be positive');
              check$1(!rec.divisor || !!extensions.angle_instanced_arrays, 'ANGLE_instanced_arrays must be enabled to use divisor');
            } else if ('x' in spec) {
              check$1(i > 0, 'first attribute must not be a constant');
              rec.x = +spec.x || 0;
              rec.y = +spec.y || 0;
              rec.z = +spec.z || 0;
              rec.w = +spec.w || 0;
              rec.state = 2;
            } else {
              check$1(false, 'invalid attribute spec for location ' + i);
            }
          }

          // retire unused buffers
          for (var j = 0; j < vao.buffers.length; ++j) {
            if (!bufUpdated[j] && vao.buffers[j]) {
              vao.buffers[j].destroy();
              vao.buffers[j] = null;
            }
          }

          vao.refresh();
          return updateVAO
        }

        updateVAO.destroy = function () {
          for (var j = 0; j < vao.buffers.length; ++j) {
            if (vao.buffers[j]) {
              vao.buffers[j].destroy();
            }
          }
          vao.buffers.length = 0;
          vao.destroy();
        };

        updateVAO._vao = vao;
        updateVAO._reglType = 'vao';

        return updateVAO(_attr)
      }

      return state
    }

    var GL_FRAGMENT_SHADER = 35632;
    var GL_VERTEX_SHADER = 35633;

    var GL_ACTIVE_UNIFORMS = 0x8B86;
    var GL_ACTIVE_ATTRIBUTES = 0x8B89;

    function wrapShaderState (gl, stringStore, stats, config) {
      // ===================================================
      // glsl compilation and linking
      // ===================================================
      var fragShaders = {};
      var vertShaders = {};

      function ActiveInfo (name, id, location, info) {
        this.name = name;
        this.id = id;
        this.location = location;
        this.info = info;
      }

      function insertActiveInfo (list, info) {
        for (var i = 0; i < list.length; ++i) {
          if (list[i].id === info.id) {
            list[i].location = info.location;
            return
          }
        }
        list.push(info);
      }

      function getShader (type, id, command) {
        var cache = type === GL_FRAGMENT_SHADER ? fragShaders : vertShaders;
        var shader = cache[id];

        if (!shader) {
          var source = stringStore.str(id);
          shader = gl.createShader(type);
          gl.shaderSource(shader, source);
          gl.compileShader(shader);
          check$1.shaderError(gl, shader, source, type, command);
          cache[id] = shader;
        }

        return shader
      }

      // ===================================================
      // program linking
      // ===================================================
      var programCache = {};
      var programList = [];

      var PROGRAM_COUNTER = 0;

      function REGLProgram (fragId, vertId) {
        this.id = PROGRAM_COUNTER++;
        this.fragId = fragId;
        this.vertId = vertId;
        this.program = null;
        this.uniforms = [];
        this.attributes = [];
        this.refCount = 1;

        if (config.profile) {
          this.stats = {
            uniformsCount: 0,
            attributesCount: 0
          };
        }
      }

      function linkProgram (desc, command, attributeLocations) {
        var i, info;

        // -------------------------------
        // compile & link
        // -------------------------------
        var fragShader = getShader(GL_FRAGMENT_SHADER, desc.fragId);
        var vertShader = getShader(GL_VERTEX_SHADER, desc.vertId);

        var program = desc.program = gl.createProgram();
        gl.attachShader(program, fragShader);
        gl.attachShader(program, vertShader);
        if (attributeLocations) {
          for (i = 0; i < attributeLocations.length; ++i) {
            var binding = attributeLocations[i];
            gl.bindAttribLocation(program, binding[0], binding[1]);
          }
        }

        gl.linkProgram(program);
        check$1.linkError(
          gl,
          program,
          stringStore.str(desc.fragId),
          stringStore.str(desc.vertId),
          command);

        // -------------------------------
        // grab uniforms
        // -------------------------------
        var numUniforms = gl.getProgramParameter(program, GL_ACTIVE_UNIFORMS);
        if (config.profile) {
          desc.stats.uniformsCount = numUniforms;
        }
        var uniforms = desc.uniforms;
        for (i = 0; i < numUniforms; ++i) {
          info = gl.getActiveUniform(program, i);
          if (info) {
            if (info.size > 1) {
              for (var j = 0; j < info.size; ++j) {
                var name = info.name.replace('[0]', '[' + j + ']');
                insertActiveInfo(uniforms, new ActiveInfo(
                  name,
                  stringStore.id(name),
                  gl.getUniformLocation(program, name),
                  info));
              }
            } else {
              insertActiveInfo(uniforms, new ActiveInfo(
                info.name,
                stringStore.id(info.name),
                gl.getUniformLocation(program, info.name),
                info));
            }
          }
        }

        // -------------------------------
        // grab attributes
        // -------------------------------
        var numAttributes = gl.getProgramParameter(program, GL_ACTIVE_ATTRIBUTES);
        if (config.profile) {
          desc.stats.attributesCount = numAttributes;
        }

        var attributes = desc.attributes;
        for (i = 0; i < numAttributes; ++i) {
          info = gl.getActiveAttrib(program, i);
          if (info) {
            insertActiveInfo(attributes, new ActiveInfo(
              info.name,
              stringStore.id(info.name),
              gl.getAttribLocation(program, info.name),
              info));
          }
        }
      }

      if (config.profile) {
        stats.getMaxUniformsCount = function () {
          var m = 0;
          programList.forEach(function (desc) {
            if (desc.stats.uniformsCount > m) {
              m = desc.stats.uniformsCount;
            }
          });
          return m
        };

        stats.getMaxAttributesCount = function () {
          var m = 0;
          programList.forEach(function (desc) {
            if (desc.stats.attributesCount > m) {
              m = desc.stats.attributesCount;
            }
          });
          return m
        };
      }

      function restoreShaders () {
        fragShaders = {};
        vertShaders = {};
        for (var i = 0; i < programList.length; ++i) {
          linkProgram(programList[i], null, programList[i].attributes.map(function (info) {
            return [info.location, info.name]
          }));
        }
      }

      return {
        clear: function () {
          var deleteShader = gl.deleteShader.bind(gl);
          values(fragShaders).forEach(deleteShader);
          fragShaders = {};
          values(vertShaders).forEach(deleteShader);
          vertShaders = {};

          programList.forEach(function (desc) {
            gl.deleteProgram(desc.program);
          });
          programList.length = 0;
          programCache = {};

          stats.shaderCount = 0;
        },

        program: function (vertId, fragId, command, attribLocations) {
          check$1.command(vertId >= 0, 'missing vertex shader', command);
          check$1.command(fragId >= 0, 'missing fragment shader', command);

          var cache = programCache[fragId];
          if (!cache) {
            cache = programCache[fragId] = {};
          }
          var prevProgram = cache[vertId];
          if (prevProgram) {
            prevProgram.refCount++;
            if (!attribLocations) {
              return prevProgram
            }
          }
          var program = new REGLProgram(fragId, vertId);
          stats.shaderCount++;
          linkProgram(program, command, attribLocations);
          if (!prevProgram) {
            cache[vertId] = program;
          }
          programList.push(program);
          return extend(program, {
            destroy: function () {
              program.refCount--;
              if (program.refCount <= 0) {
                gl.deleteProgram(program.program);
                var idx = programList.indexOf(program);
                programList.splice(idx, 1);
                stats.shaderCount--;
              }
              // no program is linked to this vert anymore
              if (cache[program.vertId].refCount <= 0) {
                gl.deleteShader(vertShaders[program.vertId]);
                delete vertShaders[program.vertId];
                delete programCache[program.fragId][program.vertId];
              }
              // no program is linked to this frag anymore
              if (!Object.keys(programCache[program.fragId]).length) {
                gl.deleteShader(fragShaders[program.fragId]);
                delete fragShaders[program.fragId];
                delete programCache[program.fragId];
              }
            }
          })
        },

        restore: restoreShaders,

        shader: getShader,

        frag: -1,
        vert: -1
      }
    }

    var GL_RGBA$3 = 6408;
    var GL_UNSIGNED_BYTE$7 = 5121;
    var GL_PACK_ALIGNMENT = 0x0D05;
    var GL_FLOAT$7 = 0x1406; // 5126

    function wrapReadPixels (
      gl,
      framebufferState,
      reglPoll,
      context,
      glAttributes,
      extensions,
      limits) {
      function readPixelsImpl (input) {
        var type;
        if (framebufferState.next === null) {
          check$1(
            glAttributes.preserveDrawingBuffer,
            'you must create a webgl context with "preserveDrawingBuffer":true in order to read pixels from the drawing buffer');
          type = GL_UNSIGNED_BYTE$7;
        } else {
          check$1(
            framebufferState.next.colorAttachments[0].texture !== null,
            'You cannot read from a renderbuffer');
          type = framebufferState.next.colorAttachments[0].texture._texture.type;

          if (extensions.oes_texture_float) {
            check$1(
              type === GL_UNSIGNED_BYTE$7 || type === GL_FLOAT$7,
              'Reading from a framebuffer is only allowed for the types \'uint8\' and \'float\'');

            if (type === GL_FLOAT$7) {
              check$1(limits.readFloat, 'Reading \'float\' values is not permitted in your browser. For a fallback, please see: https://www.npmjs.com/package/glsl-read-float');
            }
          } else {
            check$1(
              type === GL_UNSIGNED_BYTE$7,
              'Reading from a framebuffer is only allowed for the type \'uint8\'');
          }
        }

        var x = 0;
        var y = 0;
        var width = context.framebufferWidth;
        var height = context.framebufferHeight;
        var data = null;

        if (isTypedArray(input)) {
          data = input;
        } else if (input) {
          check$1.type(input, 'object', 'invalid arguments to regl.read()');
          x = input.x | 0;
          y = input.y | 0;
          check$1(
            x >= 0 && x < context.framebufferWidth,
            'invalid x offset for regl.read');
          check$1(
            y >= 0 && y < context.framebufferHeight,
            'invalid y offset for regl.read');
          width = (input.width || (context.framebufferWidth - x)) | 0;
          height = (input.height || (context.framebufferHeight - y)) | 0;
          data = input.data || null;
        }

        // sanity check input.data
        if (data) {
          if (type === GL_UNSIGNED_BYTE$7) {
            check$1(
              data instanceof Uint8Array,
              'buffer must be \'Uint8Array\' when reading from a framebuffer of type \'uint8\'');
          } else if (type === GL_FLOAT$7) {
            check$1(
              data instanceof Float32Array,
              'buffer must be \'Float32Array\' when reading from a framebuffer of type \'float\'');
          }
        }

        check$1(
          width > 0 && width + x <= context.framebufferWidth,
          'invalid width for read pixels');
        check$1(
          height > 0 && height + y <= context.framebufferHeight,
          'invalid height for read pixels');

        // Update WebGL state
        reglPoll();

        // Compute size
        var size = width * height * 4;

        // Allocate data
        if (!data) {
          if (type === GL_UNSIGNED_BYTE$7) {
            data = new Uint8Array(size);
          } else if (type === GL_FLOAT$7) {
            data = data || new Float32Array(size);
          }
        }

        // Type check
        check$1.isTypedArray(data, 'data buffer for regl.read() must be a typedarray');
        check$1(data.byteLength >= size, 'data buffer for regl.read() too small');

        // Run read pixels
        gl.pixelStorei(GL_PACK_ALIGNMENT, 4);
        gl.readPixels(x, y, width, height, GL_RGBA$3,
          type,
          data);

        return data
      }

      function readPixelsFBO (options) {
        var result;
        framebufferState.setFBO({
          framebuffer: options.framebuffer
        }, function () {
          result = readPixelsImpl(options);
        });
        return result
      }

      function readPixels (options) {
        if (!options || !('framebuffer' in options)) {
          return readPixelsImpl(options)
        } else {
          return readPixelsFBO(options)
        }
      }

      return readPixels
    }

    function slice (x) {
      return Array.prototype.slice.call(x)
    }

    function join (x) {
      return slice(x).join('')
    }

    function createEnvironment () {
      // Unique variable id counter
      var varCounter = 0;

      // Linked values are passed from this scope into the generated code block
      // Calling link() passes a value into the generated scope and returns
      // the variable name which it is bound to
      var linkedNames = [];
      var linkedValues = [];
      function link (value) {
        for (var i = 0; i < linkedValues.length; ++i) {
          if (linkedValues[i] === value) {
            return linkedNames[i]
          }
        }

        var name = 'g' + (varCounter++);
        linkedNames.push(name);
        linkedValues.push(value);
        return name
      }

      // create a code block
      function block () {
        var code = [];
        function push () {
          code.push.apply(code, slice(arguments));
        }

        var vars = [];
        function def () {
          var name = 'v' + (varCounter++);
          vars.push(name);

          if (arguments.length > 0) {
            code.push(name, '=');
            code.push.apply(code, slice(arguments));
            code.push(';');
          }

          return name
        }

        return extend(push, {
          def: def,
          toString: function () {
            return join([
              (vars.length > 0 ? 'var ' + vars.join(',') + ';' : ''),
              join(code)
            ])
          }
        })
      }

      function scope () {
        var entry = block();
        var exit = block();

        var entryToString = entry.toString;
        var exitToString = exit.toString;

        function save (object, prop) {
          exit(object, prop, '=', entry.def(object, prop), ';');
        }

        return extend(function () {
          entry.apply(entry, slice(arguments));
        }, {
          def: entry.def,
          entry: entry,
          exit: exit,
          save: save,
          set: function (object, prop, value) {
            save(object, prop);
            entry(object, prop, '=', value, ';');
          },
          toString: function () {
            return entryToString() + exitToString()
          }
        })
      }

      function conditional () {
        var pred = join(arguments);
        var thenBlock = scope();
        var elseBlock = scope();

        var thenToString = thenBlock.toString;
        var elseToString = elseBlock.toString;

        return extend(thenBlock, {
          then: function () {
            thenBlock.apply(thenBlock, slice(arguments));
            return this
          },
          else: function () {
            elseBlock.apply(elseBlock, slice(arguments));
            return this
          },
          toString: function () {
            var elseClause = elseToString();
            if (elseClause) {
              elseClause = 'else{' + elseClause + '}';
            }
            return join([
              'if(', pred, '){',
              thenToString(),
              '}', elseClause
            ])
          }
        })
      }

      // procedure list
      var globalBlock = block();
      var procedures = {};
      function proc (name, count) {
        var args = [];
        function arg () {
          var name = 'a' + args.length;
          args.push(name);
          return name
        }

        count = count || 0;
        for (var i = 0; i < count; ++i) {
          arg();
        }

        var body = scope();
        var bodyToString = body.toString;

        var result = procedures[name] = extend(body, {
          arg: arg,
          toString: function () {
            return join([
              'function(', args.join(), '){',
              bodyToString(),
              '}'
            ])
          }
        });

        return result
      }

      function compile () {
        var code = ['"use strict";',
          globalBlock,
          'return {'];
        Object.keys(procedures).forEach(function (name) {
          code.push('"', name, '":', procedures[name].toString(), ',');
        });
        code.push('}');
        var src = join(code)
          .replace(/;/g, ';\n')
          .replace(/}/g, '}\n')
          .replace(/{/g, '{\n');
        var proc = Function.apply(null, linkedNames.concat(src));
        return proc.apply(null, linkedValues)
      }

      return {
        global: globalBlock,
        link: link,
        block: block,
        proc: proc,
        scope: scope,
        cond: conditional,
        compile: compile
      }
    }

    // "cute" names for vector components
    var CUTE_COMPONENTS = 'xyzw'.split('');

    var GL_UNSIGNED_BYTE$8 = 5121;

    var ATTRIB_STATE_POINTER = 1;
    var ATTRIB_STATE_CONSTANT = 2;

    var DYN_FUNC$1 = 0;
    var DYN_PROP$1 = 1;
    var DYN_CONTEXT$1 = 2;
    var DYN_STATE$1 = 3;
    var DYN_THUNK = 4;
    var DYN_CONSTANT$1 = 5;
    var DYN_ARRAY$1 = 6;

    var S_DITHER = 'dither';
    var S_BLEND_ENABLE = 'blend.enable';
    var S_BLEND_COLOR = 'blend.color';
    var S_BLEND_EQUATION = 'blend.equation';
    var S_BLEND_FUNC = 'blend.func';
    var S_DEPTH_ENABLE = 'depth.enable';
    var S_DEPTH_FUNC = 'depth.func';
    var S_DEPTH_RANGE = 'depth.range';
    var S_DEPTH_MASK = 'depth.mask';
    var S_COLOR_MASK = 'colorMask';
    var S_CULL_ENABLE = 'cull.enable';
    var S_CULL_FACE = 'cull.face';
    var S_FRONT_FACE = 'frontFace';
    var S_LINE_WIDTH = 'lineWidth';
    var S_POLYGON_OFFSET_ENABLE = 'polygonOffset.enable';
    var S_POLYGON_OFFSET_OFFSET = 'polygonOffset.offset';
    var S_SAMPLE_ALPHA = 'sample.alpha';
    var S_SAMPLE_ENABLE = 'sample.enable';
    var S_SAMPLE_COVERAGE = 'sample.coverage';
    var S_STENCIL_ENABLE = 'stencil.enable';
    var S_STENCIL_MASK = 'stencil.mask';
    var S_STENCIL_FUNC = 'stencil.func';
    var S_STENCIL_OPFRONT = 'stencil.opFront';
    var S_STENCIL_OPBACK = 'stencil.opBack';
    var S_SCISSOR_ENABLE = 'scissor.enable';
    var S_SCISSOR_BOX = 'scissor.box';
    var S_VIEWPORT = 'viewport';

    var S_PROFILE = 'profile';

    var S_FRAMEBUFFER = 'framebuffer';
    var S_VERT = 'vert';
    var S_FRAG = 'frag';
    var S_ELEMENTS = 'elements';
    var S_PRIMITIVE = 'primitive';
    var S_COUNT = 'count';
    var S_OFFSET = 'offset';
    var S_INSTANCES = 'instances';
    var S_VAO = 'vao';

    var SUFFIX_WIDTH = 'Width';
    var SUFFIX_HEIGHT = 'Height';

    var S_FRAMEBUFFER_WIDTH = S_FRAMEBUFFER + SUFFIX_WIDTH;
    var S_FRAMEBUFFER_HEIGHT = S_FRAMEBUFFER + SUFFIX_HEIGHT;
    var S_VIEWPORT_WIDTH = S_VIEWPORT + SUFFIX_WIDTH;
    var S_VIEWPORT_HEIGHT = S_VIEWPORT + SUFFIX_HEIGHT;
    var S_DRAWINGBUFFER = 'drawingBuffer';
    var S_DRAWINGBUFFER_WIDTH = S_DRAWINGBUFFER + SUFFIX_WIDTH;
    var S_DRAWINGBUFFER_HEIGHT = S_DRAWINGBUFFER + SUFFIX_HEIGHT;

    var NESTED_OPTIONS = [
      S_BLEND_FUNC,
      S_BLEND_EQUATION,
      S_STENCIL_FUNC,
      S_STENCIL_OPFRONT,
      S_STENCIL_OPBACK,
      S_SAMPLE_COVERAGE,
      S_VIEWPORT,
      S_SCISSOR_BOX,
      S_POLYGON_OFFSET_OFFSET
    ];

    var GL_ARRAY_BUFFER$2 = 34962;
    var GL_ELEMENT_ARRAY_BUFFER$1 = 34963;

    var GL_FRAGMENT_SHADER$1 = 35632;
    var GL_VERTEX_SHADER$1 = 35633;

    var GL_TEXTURE_2D$3 = 0x0DE1;
    var GL_TEXTURE_CUBE_MAP$2 = 0x8513;

    var GL_CULL_FACE = 0x0B44;
    var GL_BLEND = 0x0BE2;
    var GL_DITHER = 0x0BD0;
    var GL_STENCIL_TEST = 0x0B90;
    var GL_DEPTH_TEST = 0x0B71;
    var GL_SCISSOR_TEST = 0x0C11;
    var GL_POLYGON_OFFSET_FILL = 0x8037;
    var GL_SAMPLE_ALPHA_TO_COVERAGE = 0x809E;
    var GL_SAMPLE_COVERAGE = 0x80A0;

    var GL_FLOAT$8 = 5126;
    var GL_FLOAT_VEC2 = 35664;
    var GL_FLOAT_VEC3 = 35665;
    var GL_FLOAT_VEC4 = 35666;
    var GL_INT$3 = 5124;
    var GL_INT_VEC2 = 35667;
    var GL_INT_VEC3 = 35668;
    var GL_INT_VEC4 = 35669;
    var GL_BOOL = 35670;
    var GL_BOOL_VEC2 = 35671;
    var GL_BOOL_VEC3 = 35672;
    var GL_BOOL_VEC4 = 35673;
    var GL_FLOAT_MAT2 = 35674;
    var GL_FLOAT_MAT3 = 35675;
    var GL_FLOAT_MAT4 = 35676;
    var GL_SAMPLER_2D = 35678;
    var GL_SAMPLER_CUBE = 35680;

    var GL_TRIANGLES$1 = 4;

    var GL_FRONT = 1028;
    var GL_BACK = 1029;
    var GL_CW = 0x0900;
    var GL_CCW = 0x0901;
    var GL_MIN_EXT = 0x8007;
    var GL_MAX_EXT = 0x8008;
    var GL_ALWAYS = 519;
    var GL_KEEP = 7680;
    var GL_ZERO = 0;
    var GL_ONE = 1;
    var GL_FUNC_ADD = 0x8006;
    var GL_LESS = 513;

    var GL_FRAMEBUFFER$2 = 0x8D40;
    var GL_COLOR_ATTACHMENT0$2 = 0x8CE0;

    var blendFuncs = {
      '0': 0,
      '1': 1,
      'zero': 0,
      'one': 1,
      'src color': 768,
      'one minus src color': 769,
      'src alpha': 770,
      'one minus src alpha': 771,
      'dst color': 774,
      'one minus dst color': 775,
      'dst alpha': 772,
      'one minus dst alpha': 773,
      'constant color': 32769,
      'one minus constant color': 32770,
      'constant alpha': 32771,
      'one minus constant alpha': 32772,
      'src alpha saturate': 776
    };

    // There are invalid values for srcRGB and dstRGB. See:
    // https://www.khronos.org/registry/webgl/specs/1.0/#6.13
    // https://github.com/KhronosGroup/WebGL/blob/0d3201f5f7ec3c0060bc1f04077461541f1987b9/conformance-suites/1.0.3/conformance/misc/webgl-specific.html#L56
    var invalidBlendCombinations = [
      'constant color, constant alpha',
      'one minus constant color, constant alpha',
      'constant color, one minus constant alpha',
      'one minus constant color, one minus constant alpha',
      'constant alpha, constant color',
      'constant alpha, one minus constant color',
      'one minus constant alpha, constant color',
      'one minus constant alpha, one minus constant color'
    ];

    var compareFuncs = {
      'never': 512,
      'less': 513,
      '<': 513,
      'equal': 514,
      '=': 514,
      '==': 514,
      '===': 514,
      'lequal': 515,
      '<=': 515,
      'greater': 516,
      '>': 516,
      'notequal': 517,
      '!=': 517,
      '!==': 517,
      'gequal': 518,
      '>=': 518,
      'always': 519
    };

    var stencilOps = {
      '0': 0,
      'zero': 0,
      'keep': 7680,
      'replace': 7681,
      'increment': 7682,
      'decrement': 7683,
      'increment wrap': 34055,
      'decrement wrap': 34056,
      'invert': 5386
    };

    var shaderType = {
      'frag': GL_FRAGMENT_SHADER$1,
      'vert': GL_VERTEX_SHADER$1
    };

    var orientationType = {
      'cw': GL_CW,
      'ccw': GL_CCW
    };

    function isBufferArgs (x) {
      return Array.isArray(x) ||
        isTypedArray(x) ||
        isNDArrayLike(x)
    }

    // Make sure viewport is processed first
    function sortState (state) {
      return state.sort(function (a, b) {
        if (a === S_VIEWPORT) {
          return -1
        } else if (b === S_VIEWPORT) {
          return 1
        }
        return (a < b) ? -1 : 1
      })
    }

    function Declaration (thisDep, contextDep, propDep, append) {
      this.thisDep = thisDep;
      this.contextDep = contextDep;
      this.propDep = propDep;
      this.append = append;
    }

    function isStatic (decl) {
      return decl && !(decl.thisDep || decl.contextDep || decl.propDep)
    }

    function createStaticDecl (append) {
      return new Declaration(false, false, false, append)
    }

    function createDynamicDecl (dyn, append) {
      var type = dyn.type;
      if (type === DYN_FUNC$1) {
        var numArgs = dyn.data.length;
        return new Declaration(
          true,
          numArgs >= 1,
          numArgs >= 2,
          append)
      } else if (type === DYN_THUNK) {
        var data = dyn.data;
        return new Declaration(
          data.thisDep,
          data.contextDep,
          data.propDep,
          append)
      } else if (type === DYN_CONSTANT$1) {
        return new Declaration(
          false,
          false,
          false,
          append)
      } else if (type === DYN_ARRAY$1) {
        var thisDep = false;
        var contextDep = false;
        var propDep = false;
        for (var i = 0; i < dyn.data.length; ++i) {
          var subDyn = dyn.data[i];
          if (subDyn.type === DYN_PROP$1) {
            propDep = true;
          } else if (subDyn.type === DYN_CONTEXT$1) {
            contextDep = true;
          } else if (subDyn.type === DYN_STATE$1) {
            thisDep = true;
          } else if (subDyn.type === DYN_FUNC$1) {
            thisDep = true;
            var subArgs = subDyn.data;
            if (subArgs >= 1) {
              contextDep = true;
            }
            if (subArgs >= 2) {
              propDep = true;
            }
          } else if (subDyn.type === DYN_THUNK) {
            thisDep = thisDep || subDyn.data.thisDep;
            contextDep = contextDep || subDyn.data.contextDep;
            propDep = propDep || subDyn.data.propDep;
          }
        }
        return new Declaration(
          thisDep,
          contextDep,
          propDep,
          append)
      } else {
        return new Declaration(
          type === DYN_STATE$1,
          type === DYN_CONTEXT$1,
          type === DYN_PROP$1,
          append)
      }
    }

    var SCOPE_DECL = new Declaration(false, false, false, function () {});

    function reglCore (
      gl,
      stringStore,
      extensions,
      limits,
      bufferState,
      elementState,
      textureState,
      framebufferState,
      uniformState,
      attributeState,
      shaderState,
      drawState,
      contextState,
      timer,
      config) {
      var AttributeRecord = attributeState.Record;

      var blendEquations = {
        'add': 32774,
        'subtract': 32778,
        'reverse subtract': 32779
      };
      if (extensions.ext_blend_minmax) {
        blendEquations.min = GL_MIN_EXT;
        blendEquations.max = GL_MAX_EXT;
      }

      var extInstancing = extensions.angle_instanced_arrays;
      var extDrawBuffers = extensions.webgl_draw_buffers;

      // ===================================================
      // ===================================================
      // WEBGL STATE
      // ===================================================
      // ===================================================
      var currentState = {
        dirty: true,
        profile: config.profile
      };
      var nextState = {};
      var GL_STATE_NAMES = [];
      var GL_FLAGS = {};
      var GL_VARIABLES = {};

      function propName (name) {
        return name.replace('.', '_')
      }

      function stateFlag (sname, cap, init) {
        var name = propName(sname);
        GL_STATE_NAMES.push(sname);
        nextState[name] = currentState[name] = !!init;
        GL_FLAGS[name] = cap;
      }

      function stateVariable (sname, func, init) {
        var name = propName(sname);
        GL_STATE_NAMES.push(sname);
        if (Array.isArray(init)) {
          currentState[name] = init.slice();
          nextState[name] = init.slice();
        } else {
          currentState[name] = nextState[name] = init;
        }
        GL_VARIABLES[name] = func;
      }

      // Dithering
      stateFlag(S_DITHER, GL_DITHER);

      // Blending
      stateFlag(S_BLEND_ENABLE, GL_BLEND);
      stateVariable(S_BLEND_COLOR, 'blendColor', [0, 0, 0, 0]);
      stateVariable(S_BLEND_EQUATION, 'blendEquationSeparate',
        [GL_FUNC_ADD, GL_FUNC_ADD]);
      stateVariable(S_BLEND_FUNC, 'blendFuncSeparate',
        [GL_ONE, GL_ZERO, GL_ONE, GL_ZERO]);

      // Depth
      stateFlag(S_DEPTH_ENABLE, GL_DEPTH_TEST, true);
      stateVariable(S_DEPTH_FUNC, 'depthFunc', GL_LESS);
      stateVariable(S_DEPTH_RANGE, 'depthRange', [0, 1]);
      stateVariable(S_DEPTH_MASK, 'depthMask', true);

      // Color mask
      stateVariable(S_COLOR_MASK, S_COLOR_MASK, [true, true, true, true]);

      // Face culling
      stateFlag(S_CULL_ENABLE, GL_CULL_FACE);
      stateVariable(S_CULL_FACE, 'cullFace', GL_BACK);

      // Front face orientation
      stateVariable(S_FRONT_FACE, S_FRONT_FACE, GL_CCW);

      // Line width
      stateVariable(S_LINE_WIDTH, S_LINE_WIDTH, 1);

      // Polygon offset
      stateFlag(S_POLYGON_OFFSET_ENABLE, GL_POLYGON_OFFSET_FILL);
      stateVariable(S_POLYGON_OFFSET_OFFSET, 'polygonOffset', [0, 0]);

      // Sample coverage
      stateFlag(S_SAMPLE_ALPHA, GL_SAMPLE_ALPHA_TO_COVERAGE);
      stateFlag(S_SAMPLE_ENABLE, GL_SAMPLE_COVERAGE);
      stateVariable(S_SAMPLE_COVERAGE, 'sampleCoverage', [1, false]);

      // Stencil
      stateFlag(S_STENCIL_ENABLE, GL_STENCIL_TEST);
      stateVariable(S_STENCIL_MASK, 'stencilMask', -1);
      stateVariable(S_STENCIL_FUNC, 'stencilFunc', [GL_ALWAYS, 0, -1]);
      stateVariable(S_STENCIL_OPFRONT, 'stencilOpSeparate',
        [GL_FRONT, GL_KEEP, GL_KEEP, GL_KEEP]);
      stateVariable(S_STENCIL_OPBACK, 'stencilOpSeparate',
        [GL_BACK, GL_KEEP, GL_KEEP, GL_KEEP]);

      // Scissor
      stateFlag(S_SCISSOR_ENABLE, GL_SCISSOR_TEST);
      stateVariable(S_SCISSOR_BOX, 'scissor',
        [0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight]);

      // Viewport
      stateVariable(S_VIEWPORT, S_VIEWPORT,
        [0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight]);

      // ===================================================
      // ===================================================
      // ENVIRONMENT
      // ===================================================
      // ===================================================
      var sharedState = {
        gl: gl,
        context: contextState,
        strings: stringStore,
        next: nextState,
        current: currentState,
        draw: drawState,
        elements: elementState,
        buffer: bufferState,
        shader: shaderState,
        attributes: attributeState.state,
        vao: attributeState,
        uniforms: uniformState,
        framebuffer: framebufferState,
        extensions: extensions,

        timer: timer,
        isBufferArgs: isBufferArgs
      };

      var sharedConstants = {
        primTypes: primTypes,
        compareFuncs: compareFuncs,
        blendFuncs: blendFuncs,
        blendEquations: blendEquations,
        stencilOps: stencilOps,
        glTypes: glTypes,
        orientationType: orientationType
      };

      check$1.optional(function () {
        sharedState.isArrayLike = isArrayLike;
      });

      if (extDrawBuffers) {
        sharedConstants.backBuffer = [GL_BACK];
        sharedConstants.drawBuffer = loop(limits.maxDrawbuffers, function (i) {
          if (i === 0) {
            return [0]
          }
          return loop(i, function (j) {
            return GL_COLOR_ATTACHMENT0$2 + j
          })
        });
      }

      var drawCallCounter = 0;
      function createREGLEnvironment () {
        var env = createEnvironment();
        var link = env.link;
        var global = env.global;
        env.id = drawCallCounter++;

        env.batchId = '0';

        // link shared state
        var SHARED = link(sharedState);
        var shared = env.shared = {
          props: 'a0'
        };
        Object.keys(sharedState).forEach(function (prop) {
          shared[prop] = global.def(SHARED, '.', prop);
        });

        // Inject runtime assertion stuff for debug builds
        check$1.optional(function () {
          env.CHECK = link(check$1);
          env.commandStr = check$1.guessCommand();
          env.command = link(env.commandStr);
          env.assert = function (block, pred, message) {
            block(
              'if(!(', pred, '))',
              this.CHECK, '.commandRaise(', link(message), ',', this.command, ');');
          };

          sharedConstants.invalidBlendCombinations = invalidBlendCombinations;
        });

        // Copy GL state variables over
        var nextVars = env.next = {};
        var currentVars = env.current = {};
        Object.keys(GL_VARIABLES).forEach(function (variable) {
          if (Array.isArray(currentState[variable])) {
            nextVars[variable] = global.def(shared.next, '.', variable);
            currentVars[variable] = global.def(shared.current, '.', variable);
          }
        });

        // Initialize shared constants
        var constants = env.constants = {};
        Object.keys(sharedConstants).forEach(function (name) {
          constants[name] = global.def(JSON.stringify(sharedConstants[name]));
        });

        // Helper function for calling a block
        env.invoke = function (block, x) {
          switch (x.type) {
            case DYN_FUNC$1:
              var argList = [
                'this',
                shared.context,
                shared.props,
                env.batchId
              ];
              return block.def(
                link(x.data), '.call(',
                argList.slice(0, Math.max(x.data.length + 1, 4)),
                ')')
            case DYN_PROP$1:
              return block.def(shared.props, x.data)
            case DYN_CONTEXT$1:
              return block.def(shared.context, x.data)
            case DYN_STATE$1:
              return block.def('this', x.data)
            case DYN_THUNK:
              x.data.append(env, block);
              return x.data.ref
            case DYN_CONSTANT$1:
              return x.data.toString()
            case DYN_ARRAY$1:
              return x.data.map(function (y) {
                return env.invoke(block, y)
              })
          }
        };

        env.attribCache = {};

        var scopeAttribs = {};
        env.scopeAttrib = function (name) {
          var id = stringStore.id(name);
          if (id in scopeAttribs) {
            return scopeAttribs[id]
          }
          var binding = attributeState.scope[id];
          if (!binding) {
            binding = attributeState.scope[id] = new AttributeRecord();
          }
          var result = scopeAttribs[id] = link(binding);
          return result
        };

        return env
      }

      // ===================================================
      // ===================================================
      // PARSING
      // ===================================================
      // ===================================================
      function parseProfile (options) {
        var staticOptions = options.static;
        var dynamicOptions = options.dynamic;

        var profileEnable;
        if (S_PROFILE in staticOptions) {
          var value = !!staticOptions[S_PROFILE];
          profileEnable = createStaticDecl(function (env, scope) {
            return value
          });
          profileEnable.enable = value;
        } else if (S_PROFILE in dynamicOptions) {
          var dyn = dynamicOptions[S_PROFILE];
          profileEnable = createDynamicDecl(dyn, function (env, scope) {
            return env.invoke(scope, dyn)
          });
        }

        return profileEnable
      }

      function parseFramebuffer (options, env) {
        var staticOptions = options.static;
        var dynamicOptions = options.dynamic;

        if (S_FRAMEBUFFER in staticOptions) {
          var framebuffer = staticOptions[S_FRAMEBUFFER];
          if (framebuffer) {
            framebuffer = framebufferState.getFramebuffer(framebuffer);
            check$1.command(framebuffer, 'invalid framebuffer object');
            return createStaticDecl(function (env, block) {
              var FRAMEBUFFER = env.link(framebuffer);
              var shared = env.shared;
              block.set(
                shared.framebuffer,
                '.next',
                FRAMEBUFFER);
              var CONTEXT = shared.context;
              block.set(
                CONTEXT,
                '.' + S_FRAMEBUFFER_WIDTH,
                FRAMEBUFFER + '.width');
              block.set(
                CONTEXT,
                '.' + S_FRAMEBUFFER_HEIGHT,
                FRAMEBUFFER + '.height');
              return FRAMEBUFFER
            })
          } else {
            return createStaticDecl(function (env, scope) {
              var shared = env.shared;
              scope.set(
                shared.framebuffer,
                '.next',
                'null');
              var CONTEXT = shared.context;
              scope.set(
                CONTEXT,
                '.' + S_FRAMEBUFFER_WIDTH,
                CONTEXT + '.' + S_DRAWINGBUFFER_WIDTH);
              scope.set(
                CONTEXT,
                '.' + S_FRAMEBUFFER_HEIGHT,
                CONTEXT + '.' + S_DRAWINGBUFFER_HEIGHT);
              return 'null'
            })
          }
        } else if (S_FRAMEBUFFER in dynamicOptions) {
          var dyn = dynamicOptions[S_FRAMEBUFFER];
          return createDynamicDecl(dyn, function (env, scope) {
            var FRAMEBUFFER_FUNC = env.invoke(scope, dyn);
            var shared = env.shared;
            var FRAMEBUFFER_STATE = shared.framebuffer;
            var FRAMEBUFFER = scope.def(
              FRAMEBUFFER_STATE, '.getFramebuffer(', FRAMEBUFFER_FUNC, ')');

            check$1.optional(function () {
              env.assert(scope,
                '!' + FRAMEBUFFER_FUNC + '||' + FRAMEBUFFER,
                'invalid framebuffer object');
            });

            scope.set(
              FRAMEBUFFER_STATE,
              '.next',
              FRAMEBUFFER);
            var CONTEXT = shared.context;
            scope.set(
              CONTEXT,
              '.' + S_FRAMEBUFFER_WIDTH,
              FRAMEBUFFER + '?' + FRAMEBUFFER + '.width:' +
              CONTEXT + '.' + S_DRAWINGBUFFER_WIDTH);
            scope.set(
              CONTEXT,
              '.' + S_FRAMEBUFFER_HEIGHT,
              FRAMEBUFFER +
              '?' + FRAMEBUFFER + '.height:' +
              CONTEXT + '.' + S_DRAWINGBUFFER_HEIGHT);
            return FRAMEBUFFER
          })
        } else {
          return null
        }
      }

      function parseViewportScissor (options, framebuffer, env) {
        var staticOptions = options.static;
        var dynamicOptions = options.dynamic;

        function parseBox (param) {
          if (param in staticOptions) {
            var box = staticOptions[param];
            check$1.commandType(box, 'object', 'invalid ' + param, env.commandStr);

            var isStatic = true;
            var x = box.x | 0;
            var y = box.y | 0;
            var w, h;
            if ('width' in box) {
              w = box.width | 0;
              check$1.command(w >= 0, 'invalid ' + param, env.commandStr);
            } else {
              isStatic = false;
            }
            if ('height' in box) {
              h = box.height | 0;
              check$1.command(h >= 0, 'invalid ' + param, env.commandStr);
            } else {
              isStatic = false;
            }

            return new Declaration(
              !isStatic && framebuffer && framebuffer.thisDep,
              !isStatic && framebuffer && framebuffer.contextDep,
              !isStatic && framebuffer && framebuffer.propDep,
              function (env, scope) {
                var CONTEXT = env.shared.context;
                var BOX_W = w;
                if (!('width' in box)) {
                  BOX_W = scope.def(CONTEXT, '.', S_FRAMEBUFFER_WIDTH, '-', x);
                }
                var BOX_H = h;
                if (!('height' in box)) {
                  BOX_H = scope.def(CONTEXT, '.', S_FRAMEBUFFER_HEIGHT, '-', y);
                }
                return [x, y, BOX_W, BOX_H]
              })
          } else if (param in dynamicOptions) {
            var dynBox = dynamicOptions[param];
            var result = createDynamicDecl(dynBox, function (env, scope) {
              var BOX = env.invoke(scope, dynBox);

              check$1.optional(function () {
                env.assert(scope,
                  BOX + '&&typeof ' + BOX + '==="object"',
                  'invalid ' + param);
              });

              var CONTEXT = env.shared.context;
              var BOX_X = scope.def(BOX, '.x|0');
              var BOX_Y = scope.def(BOX, '.y|0');
              var BOX_W = scope.def(
                '"width" in ', BOX, '?', BOX, '.width|0:',
                '(', CONTEXT, '.', S_FRAMEBUFFER_WIDTH, '-', BOX_X, ')');
              var BOX_H = scope.def(
                '"height" in ', BOX, '?', BOX, '.height|0:',
                '(', CONTEXT, '.', S_FRAMEBUFFER_HEIGHT, '-', BOX_Y, ')');

              check$1.optional(function () {
                env.assert(scope,
                  BOX_W + '>=0&&' +
                  BOX_H + '>=0',
                  'invalid ' + param);
              });

              return [BOX_X, BOX_Y, BOX_W, BOX_H]
            });
            if (framebuffer) {
              result.thisDep = result.thisDep || framebuffer.thisDep;
              result.contextDep = result.contextDep || framebuffer.contextDep;
              result.propDep = result.propDep || framebuffer.propDep;
            }
            return result
          } else if (framebuffer) {
            return new Declaration(
              framebuffer.thisDep,
              framebuffer.contextDep,
              framebuffer.propDep,
              function (env, scope) {
                var CONTEXT = env.shared.context;
                return [
                  0, 0,
                  scope.def(CONTEXT, '.', S_FRAMEBUFFER_WIDTH),
                  scope.def(CONTEXT, '.', S_FRAMEBUFFER_HEIGHT)]
              })
          } else {
            return null
          }
        }

        var viewport = parseBox(S_VIEWPORT);

        if (viewport) {
          var prevViewport = viewport;
          viewport = new Declaration(
            viewport.thisDep,
            viewport.contextDep,
            viewport.propDep,
            function (env, scope) {
              var VIEWPORT = prevViewport.append(env, scope);
              var CONTEXT = env.shared.context;
              scope.set(
                CONTEXT,
                '.' + S_VIEWPORT_WIDTH,
                VIEWPORT[2]);
              scope.set(
                CONTEXT,
                '.' + S_VIEWPORT_HEIGHT,
                VIEWPORT[3]);
              return VIEWPORT
            });
        }

        return {
          viewport: viewport,
          scissor_box: parseBox(S_SCISSOR_BOX)
        }
      }

      function parseAttribLocations (options, attributes) {
        var staticOptions = options.static;
        var staticProgram =
          typeof staticOptions[S_FRAG] === 'string' &&
          typeof staticOptions[S_VERT] === 'string';
        if (staticProgram) {
          if (Object.keys(attributes.dynamic).length > 0) {
            return null
          }
          var staticAttributes = attributes.static;
          var sAttributes = Object.keys(staticAttributes);
          if (sAttributes.length > 0 && typeof staticAttributes[sAttributes[0]] === 'number') {
            var bindings = [];
            for (var i = 0; i < sAttributes.length; ++i) {
              check$1(typeof staticAttributes[sAttributes[i]] === 'number', 'must specify all vertex attribute locations when using vaos');
              bindings.push([staticAttributes[sAttributes[i]] | 0, sAttributes[i]]);
            }
            return bindings
          }
        }
        return null
      }

      function parseProgram (options, env, attribLocations) {
        var staticOptions = options.static;
        var dynamicOptions = options.dynamic;

        function parseShader (name) {
          if (name in staticOptions) {
            var id = stringStore.id(staticOptions[name]);
            check$1.optional(function () {
              shaderState.shader(shaderType[name], id, check$1.guessCommand());
            });
            var result = createStaticDecl(function () {
              return id
            });
            result.id = id;
            return result
          } else if (name in dynamicOptions) {
            var dyn = dynamicOptions[name];
            return createDynamicDecl(dyn, function (env, scope) {
              var str = env.invoke(scope, dyn);
              var id = scope.def(env.shared.strings, '.id(', str, ')');
              check$1.optional(function () {
                scope(
                  env.shared.shader, '.shader(',
                  shaderType[name], ',',
                  id, ',',
                  env.command, ');');
              });
              return id
            })
          }
          return null
        }

        var frag = parseShader(S_FRAG);
        var vert = parseShader(S_VERT);

        var program = null;
        var progVar;
        if (isStatic(frag) && isStatic(vert)) {
          program = shaderState.program(vert.id, frag.id, null, attribLocations);
          progVar = createStaticDecl(function (env, scope) {
            return env.link(program)
          });
        } else {
          progVar = new Declaration(
            (frag && frag.thisDep) || (vert && vert.thisDep),
            (frag && frag.contextDep) || (vert && vert.contextDep),
            (frag && frag.propDep) || (vert && vert.propDep),
            function (env, scope) {
              var SHADER_STATE = env.shared.shader;
              var fragId;
              if (frag) {
                fragId = frag.append(env, scope);
              } else {
                fragId = scope.def(SHADER_STATE, '.', S_FRAG);
              }
              var vertId;
              if (vert) {
                vertId = vert.append(env, scope);
              } else {
                vertId = scope.def(SHADER_STATE, '.', S_VERT);
              }
              var progDef = SHADER_STATE + '.program(' + vertId + ',' + fragId;
              check$1.optional(function () {
                progDef += ',' + env.command;
              });
              return scope.def(progDef + ')')
            });
        }

        return {
          frag: frag,
          vert: vert,
          progVar: progVar,
          program: program
        }
      }

      function parseDraw (options, env) {
        var staticOptions = options.static;
        var dynamicOptions = options.dynamic;

        function parseElements () {
          if (S_ELEMENTS in staticOptions) {
            var elements = staticOptions[S_ELEMENTS];
            if (isBufferArgs(elements)) {
              elements = elementState.getElements(elementState.create(elements, true));
            } else if (elements) {
              elements = elementState.getElements(elements);
              check$1.command(elements, 'invalid elements', env.commandStr);
            }
            var result = createStaticDecl(function (env, scope) {
              if (elements) {
                var result = env.link(elements);
                env.ELEMENTS = result;
                return result
              }
              env.ELEMENTS = null;
              return null
            });
            result.value = elements;
            return result
          } else if (S_ELEMENTS in dynamicOptions) {
            var dyn = dynamicOptions[S_ELEMENTS];
            return createDynamicDecl(dyn, function (env, scope) {
              var shared = env.shared;

              var IS_BUFFER_ARGS = shared.isBufferArgs;
              var ELEMENT_STATE = shared.elements;

              var elementDefn = env.invoke(scope, dyn);
              var elements = scope.def('null');
              var elementStream = scope.def(IS_BUFFER_ARGS, '(', elementDefn, ')');

              var ifte = env.cond(elementStream)
                .then(elements, '=', ELEMENT_STATE, '.createStream(', elementDefn, ');')
                .else(elements, '=', ELEMENT_STATE, '.getElements(', elementDefn, ');');

              check$1.optional(function () {
                env.assert(ifte.else,
                  '!' + elementDefn + '||' + elements,
                  'invalid elements');
              });

              scope.entry(ifte);
              scope.exit(
                env.cond(elementStream)
                  .then(ELEMENT_STATE, '.destroyStream(', elements, ');'));

              env.ELEMENTS = elements;

              return elements
            })
          }

          return null
        }

        var elements = parseElements();

        function parsePrimitive () {
          if (S_PRIMITIVE in staticOptions) {
            var primitive = staticOptions[S_PRIMITIVE];
            check$1.commandParameter(primitive, primTypes, 'invalid primitve', env.commandStr);
            return createStaticDecl(function (env, scope) {
              return primTypes[primitive]
            })
          } else if (S_PRIMITIVE in dynamicOptions) {
            var dynPrimitive = dynamicOptions[S_PRIMITIVE];
            return createDynamicDecl(dynPrimitive, function (env, scope) {
              var PRIM_TYPES = env.constants.primTypes;
              var prim = env.invoke(scope, dynPrimitive);
              check$1.optional(function () {
                env.assert(scope,
                  prim + ' in ' + PRIM_TYPES,
                  'invalid primitive, must be one of ' + Object.keys(primTypes));
              });
              return scope.def(PRIM_TYPES, '[', prim, ']')
            })
          } else if (elements) {
            if (isStatic(elements)) {
              if (elements.value) {
                return createStaticDecl(function (env, scope) {
                  return scope.def(env.ELEMENTS, '.primType')
                })
              } else {
                return createStaticDecl(function () {
                  return GL_TRIANGLES$1
                })
              }
            } else {
              return new Declaration(
                elements.thisDep,
                elements.contextDep,
                elements.propDep,
                function (env, scope) {
                  var elements = env.ELEMENTS;
                  return scope.def(elements, '?', elements, '.primType:', GL_TRIANGLES$1)
                })
            }
          }
          return null
        }

        function parseParam (param, isOffset) {
          if (param in staticOptions) {
            var value = staticOptions[param] | 0;
            check$1.command(!isOffset || value >= 0, 'invalid ' + param, env.commandStr);
            return createStaticDecl(function (env, scope) {
              if (isOffset) {
                env.OFFSET = value;
              }
              return value
            })
          } else if (param in dynamicOptions) {
            var dynValue = dynamicOptions[param];
            return createDynamicDecl(dynValue, function (env, scope) {
              var result = env.invoke(scope, dynValue);
              if (isOffset) {
                env.OFFSET = result;
                check$1.optional(function () {
                  env.assert(scope,
                    result + '>=0',
                    'invalid ' + param);
                });
              }
              return result
            })
          } else if (isOffset && elements) {
            return createStaticDecl(function (env, scope) {
              env.OFFSET = '0';
              return 0
            })
          }
          return null
        }

        var OFFSET = parseParam(S_OFFSET, true);

        function parseVertCount () {
          if (S_COUNT in staticOptions) {
            var count = staticOptions[S_COUNT] | 0;
            check$1.command(
              typeof count === 'number' && count >= 0, 'invalid vertex count', env.commandStr);
            return createStaticDecl(function () {
              return count
            })
          } else if (S_COUNT in dynamicOptions) {
            var dynCount = dynamicOptions[S_COUNT];
            return createDynamicDecl(dynCount, function (env, scope) {
              var result = env.invoke(scope, dynCount);
              check$1.optional(function () {
                env.assert(scope,
                  'typeof ' + result + '==="number"&&' +
                  result + '>=0&&' +
                  result + '===(' + result + '|0)',
                  'invalid vertex count');
              });
              return result
            })
          } else if (elements) {
            if (isStatic(elements)) {
              if (elements) {
                if (OFFSET) {
                  return new Declaration(
                    OFFSET.thisDep,
                    OFFSET.contextDep,
                    OFFSET.propDep,
                    function (env, scope) {
                      var result = scope.def(
                        env.ELEMENTS, '.vertCount-', env.OFFSET);

                      check$1.optional(function () {
                        env.assert(scope,
                          result + '>=0',
                          'invalid vertex offset/element buffer too small');
                      });

                      return result
                    })
                } else {
                  return createStaticDecl(function (env, scope) {
                    return scope.def(env.ELEMENTS, '.vertCount')
                  })
                }
              } else {
                var result = createStaticDecl(function () {
                  return -1
                });
                check$1.optional(function () {
                  result.MISSING = true;
                });
                return result
              }
            } else {
              var variable = new Declaration(
                elements.thisDep || OFFSET.thisDep,
                elements.contextDep || OFFSET.contextDep,
                elements.propDep || OFFSET.propDep,
                function (env, scope) {
                  var elements = env.ELEMENTS;
                  if (env.OFFSET) {
                    return scope.def(elements, '?', elements, '.vertCount-',
                      env.OFFSET, ':-1')
                  }
                  return scope.def(elements, '?', elements, '.vertCount:-1')
                });
              check$1.optional(function () {
                variable.DYNAMIC = true;
              });
              return variable
            }
          }
          return null
        }

        return {
          elements: elements,
          primitive: parsePrimitive(),
          count: parseVertCount(),
          instances: parseParam(S_INSTANCES, false),
          offset: OFFSET
        }
      }

      function parseGLState (options, env) {
        var staticOptions = options.static;
        var dynamicOptions = options.dynamic;

        var STATE = {};

        GL_STATE_NAMES.forEach(function (prop) {
          var param = propName(prop);

          function parseParam (parseStatic, parseDynamic) {
            if (prop in staticOptions) {
              var value = parseStatic(staticOptions[prop]);
              STATE[param] = createStaticDecl(function () {
                return value
              });
            } else if (prop in dynamicOptions) {
              var dyn = dynamicOptions[prop];
              STATE[param] = createDynamicDecl(dyn, function (env, scope) {
                return parseDynamic(env, scope, env.invoke(scope, dyn))
              });
            }
          }

          switch (prop) {
            case S_CULL_ENABLE:
            case S_BLEND_ENABLE:
            case S_DITHER:
            case S_STENCIL_ENABLE:
            case S_DEPTH_ENABLE:
            case S_SCISSOR_ENABLE:
            case S_POLYGON_OFFSET_ENABLE:
            case S_SAMPLE_ALPHA:
            case S_SAMPLE_ENABLE:
            case S_DEPTH_MASK:
              return parseParam(
                function (value) {
                  check$1.commandType(value, 'boolean', prop, env.commandStr);
                  return value
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      'typeof ' + value + '==="boolean"',
                      'invalid flag ' + prop, env.commandStr);
                  });
                  return value
                })

            case S_DEPTH_FUNC:
              return parseParam(
                function (value) {
                  check$1.commandParameter(value, compareFuncs, 'invalid ' + prop, env.commandStr);
                  return compareFuncs[value]
                },
                function (env, scope, value) {
                  var COMPARE_FUNCS = env.constants.compareFuncs;
                  check$1.optional(function () {
                    env.assert(scope,
                      value + ' in ' + COMPARE_FUNCS,
                      'invalid ' + prop + ', must be one of ' + Object.keys(compareFuncs));
                  });
                  return scope.def(COMPARE_FUNCS, '[', value, ']')
                })

            case S_DEPTH_RANGE:
              return parseParam(
                function (value) {
                  check$1.command(
                    isArrayLike(value) &&
                    value.length === 2 &&
                    typeof value[0] === 'number' &&
                    typeof value[1] === 'number' &&
                    value[0] <= value[1],
                    'depth range is 2d array',
                    env.commandStr);
                  return value
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      env.shared.isArrayLike + '(' + value + ')&&' +
                      value + '.length===2&&' +
                      'typeof ' + value + '[0]==="number"&&' +
                      'typeof ' + value + '[1]==="number"&&' +
                      value + '[0]<=' + value + '[1]',
                      'depth range must be a 2d array');
                  });

                  var Z_NEAR = scope.def('+', value, '[0]');
                  var Z_FAR = scope.def('+', value, '[1]');
                  return [Z_NEAR, Z_FAR]
                })

            case S_BLEND_FUNC:
              return parseParam(
                function (value) {
                  check$1.commandType(value, 'object', 'blend.func', env.commandStr);
                  var srcRGB = ('srcRGB' in value ? value.srcRGB : value.src);
                  var srcAlpha = ('srcAlpha' in value ? value.srcAlpha : value.src);
                  var dstRGB = ('dstRGB' in value ? value.dstRGB : value.dst);
                  var dstAlpha = ('dstAlpha' in value ? value.dstAlpha : value.dst);
                  check$1.commandParameter(srcRGB, blendFuncs, param + '.srcRGB', env.commandStr);
                  check$1.commandParameter(srcAlpha, blendFuncs, param + '.srcAlpha', env.commandStr);
                  check$1.commandParameter(dstRGB, blendFuncs, param + '.dstRGB', env.commandStr);
                  check$1.commandParameter(dstAlpha, blendFuncs, param + '.dstAlpha', env.commandStr);

                  check$1.command(
                    (invalidBlendCombinations.indexOf(srcRGB + ', ' + dstRGB) === -1),
                    'unallowed blending combination (srcRGB, dstRGB) = (' + srcRGB + ', ' + dstRGB + ')', env.commandStr);

                  return [
                    blendFuncs[srcRGB],
                    blendFuncs[dstRGB],
                    blendFuncs[srcAlpha],
                    blendFuncs[dstAlpha]
                  ]
                },
                function (env, scope, value) {
                  var BLEND_FUNCS = env.constants.blendFuncs;

                  check$1.optional(function () {
                    env.assert(scope,
                      value + '&&typeof ' + value + '==="object"',
                      'invalid blend func, must be an object');
                  });

                  function read (prefix, suffix) {
                    var func = scope.def(
                      '"', prefix, suffix, '" in ', value,
                      '?', value, '.', prefix, suffix,
                      ':', value, '.', prefix);

                    check$1.optional(function () {
                      env.assert(scope,
                        func + ' in ' + BLEND_FUNCS,
                        'invalid ' + prop + '.' + prefix + suffix + ', must be one of ' + Object.keys(blendFuncs));
                    });

                    return func
                  }

                  var srcRGB = read('src', 'RGB');
                  var dstRGB = read('dst', 'RGB');

                  check$1.optional(function () {
                    var INVALID_BLEND_COMBINATIONS = env.constants.invalidBlendCombinations;

                    env.assert(scope,
                      INVALID_BLEND_COMBINATIONS +
                               '.indexOf(' + srcRGB + '+", "+' + dstRGB + ') === -1 ',
                      'unallowed blending combination for (srcRGB, dstRGB)'
                    );
                  });

                  var SRC_RGB = scope.def(BLEND_FUNCS, '[', srcRGB, ']');
                  var SRC_ALPHA = scope.def(BLEND_FUNCS, '[', read('src', 'Alpha'), ']');
                  var DST_RGB = scope.def(BLEND_FUNCS, '[', dstRGB, ']');
                  var DST_ALPHA = scope.def(BLEND_FUNCS, '[', read('dst', 'Alpha'), ']');

                  return [SRC_RGB, DST_RGB, SRC_ALPHA, DST_ALPHA]
                })

            case S_BLEND_EQUATION:
              return parseParam(
                function (value) {
                  if (typeof value === 'string') {
                    check$1.commandParameter(value, blendEquations, 'invalid ' + prop, env.commandStr);
                    return [
                      blendEquations[value],
                      blendEquations[value]
                    ]
                  } else if (typeof value === 'object') {
                    check$1.commandParameter(
                      value.rgb, blendEquations, prop + '.rgb', env.commandStr);
                    check$1.commandParameter(
                      value.alpha, blendEquations, prop + '.alpha', env.commandStr);
                    return [
                      blendEquations[value.rgb],
                      blendEquations[value.alpha]
                    ]
                  } else {
                    check$1.commandRaise('invalid blend.equation', env.commandStr);
                  }
                },
                function (env, scope, value) {
                  var BLEND_EQUATIONS = env.constants.blendEquations;

                  var RGB = scope.def();
                  var ALPHA = scope.def();

                  var ifte = env.cond('typeof ', value, '==="string"');

                  check$1.optional(function () {
                    function checkProp (block, name, value) {
                      env.assert(block,
                        value + ' in ' + BLEND_EQUATIONS,
                        'invalid ' + name + ', must be one of ' + Object.keys(blendEquations));
                    }
                    checkProp(ifte.then, prop, value);

                    env.assert(ifte.else,
                      value + '&&typeof ' + value + '==="object"',
                      'invalid ' + prop);
                    checkProp(ifte.else, prop + '.rgb', value + '.rgb');
                    checkProp(ifte.else, prop + '.alpha', value + '.alpha');
                  });

                  ifte.then(
                    RGB, '=', ALPHA, '=', BLEND_EQUATIONS, '[', value, '];');
                  ifte.else(
                    RGB, '=', BLEND_EQUATIONS, '[', value, '.rgb];',
                    ALPHA, '=', BLEND_EQUATIONS, '[', value, '.alpha];');

                  scope(ifte);

                  return [RGB, ALPHA]
                })

            case S_BLEND_COLOR:
              return parseParam(
                function (value) {
                  check$1.command(
                    isArrayLike(value) &&
                    value.length === 4,
                    'blend.color must be a 4d array', env.commandStr);
                  return loop(4, function (i) {
                    return +value[i]
                  })
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      env.shared.isArrayLike + '(' + value + ')&&' +
                      value + '.length===4',
                      'blend.color must be a 4d array');
                  });
                  return loop(4, function (i) {
                    return scope.def('+', value, '[', i, ']')
                  })
                })

            case S_STENCIL_MASK:
              return parseParam(
                function (value) {
                  check$1.commandType(value, 'number', param, env.commandStr);
                  return value | 0
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      'typeof ' + value + '==="number"',
                      'invalid stencil.mask');
                  });
                  return scope.def(value, '|0')
                })

            case S_STENCIL_FUNC:
              return parseParam(
                function (value) {
                  check$1.commandType(value, 'object', param, env.commandStr);
                  var cmp = value.cmp || 'keep';
                  var ref = value.ref || 0;
                  var mask = 'mask' in value ? value.mask : -1;
                  check$1.commandParameter(cmp, compareFuncs, prop + '.cmp', env.commandStr);
                  check$1.commandType(ref, 'number', prop + '.ref', env.commandStr);
                  check$1.commandType(mask, 'number', prop + '.mask', env.commandStr);
                  return [
                    compareFuncs[cmp],
                    ref,
                    mask
                  ]
                },
                function (env, scope, value) {
                  var COMPARE_FUNCS = env.constants.compareFuncs;
                  check$1.optional(function () {
                    function assert () {
                      env.assert(scope,
                        Array.prototype.join.call(arguments, ''),
                        'invalid stencil.func');
                    }
                    assert(value + '&&typeof ', value, '==="object"');
                    assert('!("cmp" in ', value, ')||(',
                      value, '.cmp in ', COMPARE_FUNCS, ')');
                  });
                  var cmp = scope.def(
                    '"cmp" in ', value,
                    '?', COMPARE_FUNCS, '[', value, '.cmp]',
                    ':', GL_KEEP);
                  var ref = scope.def(value, '.ref|0');
                  var mask = scope.def(
                    '"mask" in ', value,
                    '?', value, '.mask|0:-1');
                  return [cmp, ref, mask]
                })

            case S_STENCIL_OPFRONT:
            case S_STENCIL_OPBACK:
              return parseParam(
                function (value) {
                  check$1.commandType(value, 'object', param, env.commandStr);
                  var fail = value.fail || 'keep';
                  var zfail = value.zfail || 'keep';
                  var zpass = value.zpass || 'keep';
                  check$1.commandParameter(fail, stencilOps, prop + '.fail', env.commandStr);
                  check$1.commandParameter(zfail, stencilOps, prop + '.zfail', env.commandStr);
                  check$1.commandParameter(zpass, stencilOps, prop + '.zpass', env.commandStr);
                  return [
                    prop === S_STENCIL_OPBACK ? GL_BACK : GL_FRONT,
                    stencilOps[fail],
                    stencilOps[zfail],
                    stencilOps[zpass]
                  ]
                },
                function (env, scope, value) {
                  var STENCIL_OPS = env.constants.stencilOps;

                  check$1.optional(function () {
                    env.assert(scope,
                      value + '&&typeof ' + value + '==="object"',
                      'invalid ' + prop);
                  });

                  function read (name) {
                    check$1.optional(function () {
                      env.assert(scope,
                        '!("' + name + '" in ' + value + ')||' +
                        '(' + value + '.' + name + ' in ' + STENCIL_OPS + ')',
                        'invalid ' + prop + '.' + name + ', must be one of ' + Object.keys(stencilOps));
                    });

                    return scope.def(
                      '"', name, '" in ', value,
                      '?', STENCIL_OPS, '[', value, '.', name, ']:',
                      GL_KEEP)
                  }

                  return [
                    prop === S_STENCIL_OPBACK ? GL_BACK : GL_FRONT,
                    read('fail'),
                    read('zfail'),
                    read('zpass')
                  ]
                })

            case S_POLYGON_OFFSET_OFFSET:
              return parseParam(
                function (value) {
                  check$1.commandType(value, 'object', param, env.commandStr);
                  var factor = value.factor | 0;
                  var units = value.units | 0;
                  check$1.commandType(factor, 'number', param + '.factor', env.commandStr);
                  check$1.commandType(units, 'number', param + '.units', env.commandStr);
                  return [factor, units]
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      value + '&&typeof ' + value + '==="object"',
                      'invalid ' + prop);
                  });

                  var FACTOR = scope.def(value, '.factor|0');
                  var UNITS = scope.def(value, '.units|0');

                  return [FACTOR, UNITS]
                })

            case S_CULL_FACE:
              return parseParam(
                function (value) {
                  var face = 0;
                  if (value === 'front') {
                    face = GL_FRONT;
                  } else if (value === 'back') {
                    face = GL_BACK;
                  }
                  check$1.command(!!face, param, env.commandStr);
                  return face
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      value + '==="front"||' +
                      value + '==="back"',
                      'invalid cull.face');
                  });
                  return scope.def(value, '==="front"?', GL_FRONT, ':', GL_BACK)
                })

            case S_LINE_WIDTH:
              return parseParam(
                function (value) {
                  check$1.command(
                    typeof value === 'number' &&
                    value >= limits.lineWidthDims[0] &&
                    value <= limits.lineWidthDims[1],
                    'invalid line width, must be a positive number between ' +
                    limits.lineWidthDims[0] + ' and ' + limits.lineWidthDims[1], env.commandStr);
                  return value
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      'typeof ' + value + '==="number"&&' +
                      value + '>=' + limits.lineWidthDims[0] + '&&' +
                      value + '<=' + limits.lineWidthDims[1],
                      'invalid line width');
                  });

                  return value
                })

            case S_FRONT_FACE:
              return parseParam(
                function (value) {
                  check$1.commandParameter(value, orientationType, param, env.commandStr);
                  return orientationType[value]
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      value + '==="cw"||' +
                      value + '==="ccw"',
                      'invalid frontFace, must be one of cw,ccw');
                  });
                  return scope.def(value + '==="cw"?' + GL_CW + ':' + GL_CCW)
                })

            case S_COLOR_MASK:
              return parseParam(
                function (value) {
                  check$1.command(
                    isArrayLike(value) && value.length === 4,
                    'color.mask must be length 4 array', env.commandStr);
                  return value.map(function (v) { return !!v })
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      env.shared.isArrayLike + '(' + value + ')&&' +
                      value + '.length===4',
                      'invalid color.mask');
                  });
                  return loop(4, function (i) {
                    return '!!' + value + '[' + i + ']'
                  })
                })

            case S_SAMPLE_COVERAGE:
              return parseParam(
                function (value) {
                  check$1.command(typeof value === 'object' && value, param, env.commandStr);
                  var sampleValue = 'value' in value ? value.value : 1;
                  var sampleInvert = !!value.invert;
                  check$1.command(
                    typeof sampleValue === 'number' &&
                    sampleValue >= 0 && sampleValue <= 1,
                    'sample.coverage.value must be a number between 0 and 1', env.commandStr);
                  return [sampleValue, sampleInvert]
                },
                function (env, scope, value) {
                  check$1.optional(function () {
                    env.assert(scope,
                      value + '&&typeof ' + value + '==="object"',
                      'invalid sample.coverage');
                  });
                  var VALUE = scope.def(
                    '"value" in ', value, '?+', value, '.value:1');
                  var INVERT = scope.def('!!', value, '.invert');
                  return [VALUE, INVERT]
                })
          }
        });

        return STATE
      }

      function parseUniforms (uniforms, env) {
        var staticUniforms = uniforms.static;
        var dynamicUniforms = uniforms.dynamic;

        var UNIFORMS = {};

        Object.keys(staticUniforms).forEach(function (name) {
          var value = staticUniforms[name];
          var result;
          if (typeof value === 'number' ||
              typeof value === 'boolean') {
            result = createStaticDecl(function () {
              return value
            });
          } else if (typeof value === 'function') {
            var reglType = value._reglType;
            if (reglType === 'texture2d' ||
                reglType === 'textureCube') {
              result = createStaticDecl(function (env) {
                return env.link(value)
              });
            } else if (reglType === 'framebuffer' ||
                       reglType === 'framebufferCube') {
              check$1.command(value.color.length > 0,
                'missing color attachment for framebuffer sent to uniform "' + name + '"', env.commandStr);
              result = createStaticDecl(function (env) {
                return env.link(value.color[0])
              });
            } else {
              check$1.commandRaise('invalid data for uniform "' + name + '"', env.commandStr);
            }
          } else if (isArrayLike(value)) {
            result = createStaticDecl(function (env) {
              var ITEM = env.global.def('[',
                loop(value.length, function (i) {
                  check$1.command(
                    typeof value[i] === 'number' ||
                    typeof value[i] === 'boolean',
                    'invalid uniform ' + name, env.commandStr);
                  return value[i]
                }), ']');
              return ITEM
            });
          } else {
            check$1.commandRaise('invalid or missing data for uniform "' + name + '"', env.commandStr);
          }
          result.value = value;
          UNIFORMS[name] = result;
        });

        Object.keys(dynamicUniforms).forEach(function (key) {
          var dyn = dynamicUniforms[key];
          UNIFORMS[key] = createDynamicDecl(dyn, function (env, scope) {
            return env.invoke(scope, dyn)
          });
        });

        return UNIFORMS
      }

      function parseAttributes (attributes, env) {
        var staticAttributes = attributes.static;
        var dynamicAttributes = attributes.dynamic;

        var attributeDefs = {};

        Object.keys(staticAttributes).forEach(function (attribute) {
          var value = staticAttributes[attribute];
          var id = stringStore.id(attribute);

          var record = new AttributeRecord();
          if (isBufferArgs(value)) {
            record.state = ATTRIB_STATE_POINTER;
            record.buffer = bufferState.getBuffer(
              bufferState.create(value, GL_ARRAY_BUFFER$2, false, true));
            record.type = 0;
          } else {
            var buffer = bufferState.getBuffer(value);
            if (buffer) {
              record.state = ATTRIB_STATE_POINTER;
              record.buffer = buffer;
              record.type = 0;
            } else {
              check$1.command(typeof value === 'object' && value,
                'invalid data for attribute ' + attribute, env.commandStr);
              if ('constant' in value) {
                var constant = value.constant;
                record.buffer = 'null';
                record.state = ATTRIB_STATE_CONSTANT;
                if (typeof constant === 'number') {
                  record.x = constant;
                } else {
                  check$1.command(
                    isArrayLike(constant) &&
                    constant.length > 0 &&
                    constant.length <= 4,
                    'invalid constant for attribute ' + attribute, env.commandStr);
                  CUTE_COMPONENTS.forEach(function (c, i) {
                    if (i < constant.length) {
                      record[c] = constant[i];
                    }
                  });
                }
              } else {
                if (isBufferArgs(value.buffer)) {
                  buffer = bufferState.getBuffer(
                    bufferState.create(value.buffer, GL_ARRAY_BUFFER$2, false, true));
                } else {
                  buffer = bufferState.getBuffer(value.buffer);
                }
                check$1.command(!!buffer, 'missing buffer for attribute "' + attribute + '"', env.commandStr);

                var offset = value.offset | 0;
                check$1.command(offset >= 0,
                  'invalid offset for attribute "' + attribute + '"', env.commandStr);

                var stride = value.stride | 0;
                check$1.command(stride >= 0 && stride < 256,
                  'invalid stride for attribute "' + attribute + '", must be integer betweeen [0, 255]', env.commandStr);

                var size = value.size | 0;
                check$1.command(!('size' in value) || (size > 0 && size <= 4),
                  'invalid size for attribute "' + attribute + '", must be 1,2,3,4', env.commandStr);

                var normalized = !!value.normalized;

                var type = 0;
                if ('type' in value) {
                  check$1.commandParameter(
                    value.type, glTypes,
                    'invalid type for attribute ' + attribute, env.commandStr);
                  type = glTypes[value.type];
                }

                var divisor = value.divisor | 0;
                if ('divisor' in value) {
                  check$1.command(divisor === 0 || extInstancing,
                    'cannot specify divisor for attribute "' + attribute + '", instancing not supported', env.commandStr);
                  check$1.command(divisor >= 0,
                    'invalid divisor for attribute "' + attribute + '"', env.commandStr);
                }

                check$1.optional(function () {
                  var command = env.commandStr;

                  var VALID_KEYS = [
                    'buffer',
                    'offset',
                    'divisor',
                    'normalized',
                    'type',
                    'size',
                    'stride'
                  ];

                  Object.keys(value).forEach(function (prop) {
                    check$1.command(
                      VALID_KEYS.indexOf(prop) >= 0,
                      'unknown parameter "' + prop + '" for attribute pointer "' + attribute + '" (valid parameters are ' + VALID_KEYS + ')',
                      command);
                  });
                });

                record.buffer = buffer;
                record.state = ATTRIB_STATE_POINTER;
                record.size = size;
                record.normalized = normalized;
                record.type = type || buffer.dtype;
                record.offset = offset;
                record.stride = stride;
                record.divisor = divisor;
              }
            }
          }

          attributeDefs[attribute] = createStaticDecl(function (env, scope) {
            var cache = env.attribCache;
            if (id in cache) {
              return cache[id]
            }
            var result = {
              isStream: false
            };
            Object.keys(record).forEach(function (key) {
              result[key] = record[key];
            });
            if (record.buffer) {
              result.buffer = env.link(record.buffer);
              result.type = result.type || (result.buffer + '.dtype');
            }
            cache[id] = result;
            return result
          });
        });

        Object.keys(dynamicAttributes).forEach(function (attribute) {
          var dyn = dynamicAttributes[attribute];

          function appendAttributeCode (env, block) {
            var VALUE = env.invoke(block, dyn);

            var shared = env.shared;
            var constants = env.constants;

            var IS_BUFFER_ARGS = shared.isBufferArgs;
            var BUFFER_STATE = shared.buffer;

            // Perform validation on attribute
            check$1.optional(function () {
              env.assert(block,
                VALUE + '&&(typeof ' + VALUE + '==="object"||typeof ' +
                VALUE + '==="function")&&(' +
                IS_BUFFER_ARGS + '(' + VALUE + ')||' +
                BUFFER_STATE + '.getBuffer(' + VALUE + ')||' +
                BUFFER_STATE + '.getBuffer(' + VALUE + '.buffer)||' +
                IS_BUFFER_ARGS + '(' + VALUE + '.buffer)||' +
                '("constant" in ' + VALUE +
                '&&(typeof ' + VALUE + '.constant==="number"||' +
                shared.isArrayLike + '(' + VALUE + '.constant))))',
                'invalid dynamic attribute "' + attribute + '"');
            });

            // allocate names for result
            var result = {
              isStream: block.def(false)
            };
            var defaultRecord = new AttributeRecord();
            defaultRecord.state = ATTRIB_STATE_POINTER;
            Object.keys(defaultRecord).forEach(function (key) {
              result[key] = block.def('' + defaultRecord[key]);
            });

            var BUFFER = result.buffer;
            var TYPE = result.type;
            block(
              'if(', IS_BUFFER_ARGS, '(', VALUE, ')){',
              result.isStream, '=true;',
              BUFFER, '=', BUFFER_STATE, '.createStream(', GL_ARRAY_BUFFER$2, ',', VALUE, ');',
              TYPE, '=', BUFFER, '.dtype;',
              '}else{',
              BUFFER, '=', BUFFER_STATE, '.getBuffer(', VALUE, ');',
              'if(', BUFFER, '){',
              TYPE, '=', BUFFER, '.dtype;',
              '}else if("constant" in ', VALUE, '){',
              result.state, '=', ATTRIB_STATE_CONSTANT, ';',
              'if(typeof ' + VALUE + '.constant === "number"){',
              result[CUTE_COMPONENTS[0]], '=', VALUE, '.constant;',
              CUTE_COMPONENTS.slice(1).map(function (n) {
                return result[n]
              }).join('='), '=0;',
              '}else{',
              CUTE_COMPONENTS.map(function (name, i) {
                return (
                  result[name] + '=' + VALUE + '.constant.length>' + i +
                  '?' + VALUE + '.constant[' + i + ']:0;'
                )
              }).join(''),
              '}}else{',
              'if(', IS_BUFFER_ARGS, '(', VALUE, '.buffer)){',
              BUFFER, '=', BUFFER_STATE, '.createStream(', GL_ARRAY_BUFFER$2, ',', VALUE, '.buffer);',
              '}else{',
              BUFFER, '=', BUFFER_STATE, '.getBuffer(', VALUE, '.buffer);',
              '}',
              TYPE, '="type" in ', VALUE, '?',
              constants.glTypes, '[', VALUE, '.type]:', BUFFER, '.dtype;',
              result.normalized, '=!!', VALUE, '.normalized;');
            function emitReadRecord (name) {
              block(result[name], '=', VALUE, '.', name, '|0;');
            }
            emitReadRecord('size');
            emitReadRecord('offset');
            emitReadRecord('stride');
            emitReadRecord('divisor');

            block('}}');

            block.exit(
              'if(', result.isStream, '){',
              BUFFER_STATE, '.destroyStream(', BUFFER, ');',
              '}');

            return result
          }

          attributeDefs[attribute] = createDynamicDecl(dyn, appendAttributeCode);
        });

        return attributeDefs
      }

      function parseVAO (options, env) {
        var staticOptions = options.static;
        var dynamicOptions = options.dynamic;
        if (S_VAO in staticOptions) {
          var vao = staticOptions[S_VAO];
          if (vao !== null && attributeState.getVAO(vao) === null) {
            vao = attributeState.createVAO(vao);
          }
          return createStaticDecl(function (env) {
            return env.link(attributeState.getVAO(vao))
          })
        } else if (S_VAO in dynamicOptions) {
          var dyn = dynamicOptions[S_VAO];
          return createDynamicDecl(dyn, function (env, scope) {
            var vaoRef = env.invoke(scope, dyn);
            return scope.def(env.shared.vao + '.getVAO(' + vaoRef + ')')
          })
        }
        return null
      }

      function parseContext (context) {
        var staticContext = context.static;
        var dynamicContext = context.dynamic;
        var result = {};

        Object.keys(staticContext).forEach(function (name) {
          var value = staticContext[name];
          result[name] = createStaticDecl(function (env, scope) {
            if (typeof value === 'number' || typeof value === 'boolean') {
              return '' + value
            } else {
              return env.link(value)
            }
          });
        });

        Object.keys(dynamicContext).forEach(function (name) {
          var dyn = dynamicContext[name];
          result[name] = createDynamicDecl(dyn, function (env, scope) {
            return env.invoke(scope, dyn)
          });
        });

        return result
      }

      function parseArguments (options, attributes, uniforms, context, env) {
        var staticOptions = options.static;
        var dynamicOptions = options.dynamic;

        check$1.optional(function () {
          var KEY_NAMES = [
            S_FRAMEBUFFER,
            S_VERT,
            S_FRAG,
            S_ELEMENTS,
            S_PRIMITIVE,
            S_OFFSET,
            S_COUNT,
            S_INSTANCES,
            S_PROFILE,
            S_VAO
          ].concat(GL_STATE_NAMES);

          function checkKeys (dict) {
            Object.keys(dict).forEach(function (key) {
              check$1.command(
                KEY_NAMES.indexOf(key) >= 0,
                'unknown parameter "' + key + '"',
                env.commandStr);
            });
          }

          checkKeys(staticOptions);
          checkKeys(dynamicOptions);
        });

        var attribLocations = parseAttribLocations(options, attributes);

        var framebuffer = parseFramebuffer(options);
        var viewportAndScissor = parseViewportScissor(options, framebuffer, env);
        var draw = parseDraw(options, env);
        var state = parseGLState(options, env);
        var shader = parseProgram(options, env, attribLocations);

        function copyBox (name) {
          var defn = viewportAndScissor[name];
          if (defn) {
            state[name] = defn;
          }
        }
        copyBox(S_VIEWPORT);
        copyBox(propName(S_SCISSOR_BOX));

        var dirty = Object.keys(state).length > 0;

        var result = {
          framebuffer: framebuffer,
          draw: draw,
          shader: shader,
          state: state,
          dirty: dirty,
          scopeVAO: null,
          drawVAO: null,
          useVAO: false,
          attributes: {}
        };

        result.profile = parseProfile(options);
        result.uniforms = parseUniforms(uniforms, env);
        result.drawVAO = result.scopeVAO = parseVAO(options);
        // special case: check if we can statically allocate a vertex array object for this program
        if (!result.drawVAO && shader.program && !attribLocations && extensions.angle_instanced_arrays) {
          var useVAO = true;
          var staticBindings = shader.program.attributes.map(function (attr) {
            var binding = attributes.static[attr];
            useVAO = useVAO && !!binding;
            return binding
          });
          if (useVAO && staticBindings.length > 0) {
            var vao = attributeState.getVAO(attributeState.createVAO(staticBindings));
            result.drawVAO = new Declaration(null, null, null, function (env, scope) {
              return env.link(vao)
            });
            result.useVAO = true;
          }
        }
        if (attribLocations) {
          result.useVAO = true;
        } else {
          result.attributes = parseAttributes(attributes, env);
        }
        result.context = parseContext(context);
        return result
      }

      // ===================================================
      // ===================================================
      // COMMON UPDATE FUNCTIONS
      // ===================================================
      // ===================================================
      function emitContext (env, scope, context) {
        var shared = env.shared;
        var CONTEXT = shared.context;

        var contextEnter = env.scope();

        Object.keys(context).forEach(function (name) {
          scope.save(CONTEXT, '.' + name);
          var defn = context[name];
          var value = defn.append(env, scope);
          if (Array.isArray(value)) {
            contextEnter(CONTEXT, '.', name, '=[', value.join(), '];');
          } else {
            contextEnter(CONTEXT, '.', name, '=', value, ';');
          }
        });

        scope(contextEnter);
      }

      // ===================================================
      // ===================================================
      // COMMON DRAWING FUNCTIONS
      // ===================================================
      // ===================================================
      function emitPollFramebuffer (env, scope, framebuffer, skipCheck) {
        var shared = env.shared;

        var GL = shared.gl;
        var FRAMEBUFFER_STATE = shared.framebuffer;
        var EXT_DRAW_BUFFERS;
        if (extDrawBuffers) {
          EXT_DRAW_BUFFERS = scope.def(shared.extensions, '.webgl_draw_buffers');
        }

        var constants = env.constants;

        var DRAW_BUFFERS = constants.drawBuffer;
        var BACK_BUFFER = constants.backBuffer;

        var NEXT;
        if (framebuffer) {
          NEXT = framebuffer.append(env, scope);
        } else {
          NEXT = scope.def(FRAMEBUFFER_STATE, '.next');
        }

        if (!skipCheck) {
          scope('if(', NEXT, '!==', FRAMEBUFFER_STATE, '.cur){');
        }
        scope(
          'if(', NEXT, '){',
          GL, '.bindFramebuffer(', GL_FRAMEBUFFER$2, ',', NEXT, '.framebuffer);');
        if (extDrawBuffers) {
          scope(EXT_DRAW_BUFFERS, '.drawBuffersWEBGL(',
            DRAW_BUFFERS, '[', NEXT, '.colorAttachments.length]);');
        }
        scope('}else{',
          GL, '.bindFramebuffer(', GL_FRAMEBUFFER$2, ',null);');
        if (extDrawBuffers) {
          scope(EXT_DRAW_BUFFERS, '.drawBuffersWEBGL(', BACK_BUFFER, ');');
        }
        scope(
          '}',
          FRAMEBUFFER_STATE, '.cur=', NEXT, ';');
        if (!skipCheck) {
          scope('}');
        }
      }

      function emitPollState (env, scope, args) {
        var shared = env.shared;

        var GL = shared.gl;

        var CURRENT_VARS = env.current;
        var NEXT_VARS = env.next;
        var CURRENT_STATE = shared.current;
        var NEXT_STATE = shared.next;

        var block = env.cond(CURRENT_STATE, '.dirty');

        GL_STATE_NAMES.forEach(function (prop) {
          var param = propName(prop);
          if (param in args.state) {
            return
          }

          var NEXT, CURRENT;
          if (param in NEXT_VARS) {
            NEXT = NEXT_VARS[param];
            CURRENT = CURRENT_VARS[param];
            var parts = loop(currentState[param].length, function (i) {
              return block.def(NEXT, '[', i, ']')
            });
            block(env.cond(parts.map(function (p, i) {
              return p + '!==' + CURRENT + '[' + i + ']'
            }).join('||'))
              .then(
                GL, '.', GL_VARIABLES[param], '(', parts, ');',
                parts.map(function (p, i) {
                  return CURRENT + '[' + i + ']=' + p
                }).join(';'), ';'));
          } else {
            NEXT = block.def(NEXT_STATE, '.', param);
            var ifte = env.cond(NEXT, '!==', CURRENT_STATE, '.', param);
            block(ifte);
            if (param in GL_FLAGS) {
              ifte(
                env.cond(NEXT)
                  .then(GL, '.enable(', GL_FLAGS[param], ');')
                  .else(GL, '.disable(', GL_FLAGS[param], ');'),
                CURRENT_STATE, '.', param, '=', NEXT, ';');
            } else {
              ifte(
                GL, '.', GL_VARIABLES[param], '(', NEXT, ');',
                CURRENT_STATE, '.', param, '=', NEXT, ';');
            }
          }
        });
        if (Object.keys(args.state).length === 0) {
          block(CURRENT_STATE, '.dirty=false;');
        }
        scope(block);
      }

      function emitSetOptions (env, scope, options, filter) {
        var shared = env.shared;
        var CURRENT_VARS = env.current;
        var CURRENT_STATE = shared.current;
        var GL = shared.gl;
        sortState(Object.keys(options)).forEach(function (param) {
          var defn = options[param];
          if (filter && !filter(defn)) {
            return
          }
          var variable = defn.append(env, scope);
          if (GL_FLAGS[param]) {
            var flag = GL_FLAGS[param];
            if (isStatic(defn)) {
              if (variable) {
                scope(GL, '.enable(', flag, ');');
              } else {
                scope(GL, '.disable(', flag, ');');
              }
            } else {
              scope(env.cond(variable)
                .then(GL, '.enable(', flag, ');')
                .else(GL, '.disable(', flag, ');'));
            }
            scope(CURRENT_STATE, '.', param, '=', variable, ';');
          } else if (isArrayLike(variable)) {
            var CURRENT = CURRENT_VARS[param];
            scope(
              GL, '.', GL_VARIABLES[param], '(', variable, ');',
              variable.map(function (v, i) {
                return CURRENT + '[' + i + ']=' + v
              }).join(';'), ';');
          } else {
            scope(
              GL, '.', GL_VARIABLES[param], '(', variable, ');',
              CURRENT_STATE, '.', param, '=', variable, ';');
          }
        });
      }

      function injectExtensions (env, scope) {
        if (extInstancing) {
          env.instancing = scope.def(
            env.shared.extensions, '.angle_instanced_arrays');
        }
      }

      function emitProfile (env, scope, args, useScope, incrementCounter) {
        var shared = env.shared;
        var STATS = env.stats;
        var CURRENT_STATE = shared.current;
        var TIMER = shared.timer;
        var profileArg = args.profile;

        function perfCounter () {
          if (typeof performance === 'undefined') {
            return 'Date.now()'
          } else {
            return 'performance.now()'
          }
        }

        var CPU_START, QUERY_COUNTER;
        function emitProfileStart (block) {
          CPU_START = scope.def();
          block(CPU_START, '=', perfCounter(), ';');
          if (typeof incrementCounter === 'string') {
            block(STATS, '.count+=', incrementCounter, ';');
          } else {
            block(STATS, '.count++;');
          }
          if (timer) {
            if (useScope) {
              QUERY_COUNTER = scope.def();
              block(QUERY_COUNTER, '=', TIMER, '.getNumPendingQueries();');
            } else {
              block(TIMER, '.beginQuery(', STATS, ');');
            }
          }
        }

        function emitProfileEnd (block) {
          block(STATS, '.cpuTime+=', perfCounter(), '-', CPU_START, ';');
          if (timer) {
            if (useScope) {
              block(TIMER, '.pushScopeStats(',
                QUERY_COUNTER, ',',
                TIMER, '.getNumPendingQueries(),',
                STATS, ');');
            } else {
              block(TIMER, '.endQuery();');
            }
          }
        }

        function scopeProfile (value) {
          var prev = scope.def(CURRENT_STATE, '.profile');
          scope(CURRENT_STATE, '.profile=', value, ';');
          scope.exit(CURRENT_STATE, '.profile=', prev, ';');
        }

        var USE_PROFILE;
        if (profileArg) {
          if (isStatic(profileArg)) {
            if (profileArg.enable) {
              emitProfileStart(scope);
              emitProfileEnd(scope.exit);
              scopeProfile('true');
            } else {
              scopeProfile('false');
            }
            return
          }
          USE_PROFILE = profileArg.append(env, scope);
          scopeProfile(USE_PROFILE);
        } else {
          USE_PROFILE = scope.def(CURRENT_STATE, '.profile');
        }

        var start = env.block();
        emitProfileStart(start);
        scope('if(', USE_PROFILE, '){', start, '}');
        var end = env.block();
        emitProfileEnd(end);
        scope.exit('if(', USE_PROFILE, '){', end, '}');
      }

      function emitAttributes (env, scope, args, attributes, filter) {
        var shared = env.shared;

        function typeLength (x) {
          switch (x) {
            case GL_FLOAT_VEC2:
            case GL_INT_VEC2:
            case GL_BOOL_VEC2:
              return 2
            case GL_FLOAT_VEC3:
            case GL_INT_VEC3:
            case GL_BOOL_VEC3:
              return 3
            case GL_FLOAT_VEC4:
            case GL_INT_VEC4:
            case GL_BOOL_VEC4:
              return 4
            default:
              return 1
          }
        }

        function emitBindAttribute (ATTRIBUTE, size, record) {
          var GL = shared.gl;

          var LOCATION = scope.def(ATTRIBUTE, '.location');
          var BINDING = scope.def(shared.attributes, '[', LOCATION, ']');

          var STATE = record.state;
          var BUFFER = record.buffer;
          var CONST_COMPONENTS = [
            record.x,
            record.y,
            record.z,
            record.w
          ];

          var COMMON_KEYS = [
            'buffer',
            'normalized',
            'offset',
            'stride'
          ];

          function emitBuffer () {
            scope(
              'if(!', BINDING, '.buffer){',
              GL, '.enableVertexAttribArray(', LOCATION, ');}');

            var TYPE = record.type;
            var SIZE;
            if (!record.size) {
              SIZE = size;
            } else {
              SIZE = scope.def(record.size, '||', size);
            }

            scope('if(',
              BINDING, '.type!==', TYPE, '||',
              BINDING, '.size!==', SIZE, '||',
              COMMON_KEYS.map(function (key) {
                return BINDING + '.' + key + '!==' + record[key]
              }).join('||'),
              '){',
              GL, '.bindBuffer(', GL_ARRAY_BUFFER$2, ',', BUFFER, '.buffer);',
              GL, '.vertexAttribPointer(', [
                LOCATION,
                SIZE,
                TYPE,
                record.normalized,
                record.stride,
                record.offset
              ], ');',
              BINDING, '.type=', TYPE, ';',
              BINDING, '.size=', SIZE, ';',
              COMMON_KEYS.map(function (key) {
                return BINDING + '.' + key + '=' + record[key] + ';'
              }).join(''),
              '}');

            if (extInstancing) {
              var DIVISOR = record.divisor;
              scope(
                'if(', BINDING, '.divisor!==', DIVISOR, '){',
                env.instancing, '.vertexAttribDivisorANGLE(', [LOCATION, DIVISOR], ');',
                BINDING, '.divisor=', DIVISOR, ';}');
            }
          }

          function emitConstant () {
            scope(
              'if(', BINDING, '.buffer){',
              GL, '.disableVertexAttribArray(', LOCATION, ');',
              BINDING, '.buffer=null;',
              '}if(', CUTE_COMPONENTS.map(function (c, i) {
                return BINDING + '.' + c + '!==' + CONST_COMPONENTS[i]
              }).join('||'), '){',
              GL, '.vertexAttrib4f(', LOCATION, ',', CONST_COMPONENTS, ');',
              CUTE_COMPONENTS.map(function (c, i) {
                return BINDING + '.' + c + '=' + CONST_COMPONENTS[i] + ';'
              }).join(''),
              '}');
          }

          if (STATE === ATTRIB_STATE_POINTER) {
            emitBuffer();
          } else if (STATE === ATTRIB_STATE_CONSTANT) {
            emitConstant();
          } else {
            scope('if(', STATE, '===', ATTRIB_STATE_POINTER, '){');
            emitBuffer();
            scope('}else{');
            emitConstant();
            scope('}');
          }
        }

        attributes.forEach(function (attribute) {
          var name = attribute.name;
          var arg = args.attributes[name];
          var record;
          if (arg) {
            if (!filter(arg)) {
              return
            }
            record = arg.append(env, scope);
          } else {
            if (!filter(SCOPE_DECL)) {
              return
            }
            var scopeAttrib = env.scopeAttrib(name);
            check$1.optional(function () {
              env.assert(scope,
                scopeAttrib + '.state',
                'missing attribute ' + name);
            });
            record = {};
            Object.keys(new AttributeRecord()).forEach(function (key) {
              record[key] = scope.def(scopeAttrib, '.', key);
            });
          }
          emitBindAttribute(
            env.link(attribute), typeLength(attribute.info.type), record);
        });
      }

      function emitUniforms (env, scope, args, uniforms, filter) {
        var shared = env.shared;
        var GL = shared.gl;

        var infix;
        for (var i = 0; i < uniforms.length; ++i) {
          var uniform = uniforms[i];
          var name = uniform.name;
          var type = uniform.info.type;
          var arg = args.uniforms[name];
          var UNIFORM = env.link(uniform);
          var LOCATION = UNIFORM + '.location';

          var VALUE;
          if (arg) {
            if (!filter(arg)) {
              continue
            }
            if (isStatic(arg)) {
              var value = arg.value;
              check$1.command(
                value !== null && typeof value !== 'undefined',
                'missing uniform "' + name + '"', env.commandStr);
              if (type === GL_SAMPLER_2D || type === GL_SAMPLER_CUBE) {
                check$1.command(
                  typeof value === 'function' &&
                  ((type === GL_SAMPLER_2D &&
                    (value._reglType === 'texture2d' ||
                    value._reglType === 'framebuffer')) ||
                  (type === GL_SAMPLER_CUBE &&
                    (value._reglType === 'textureCube' ||
                    value._reglType === 'framebufferCube'))),
                  'invalid texture for uniform ' + name, env.commandStr);
                var TEX_VALUE = env.link(value._texture || value.color[0]._texture);
                scope(GL, '.uniform1i(', LOCATION, ',', TEX_VALUE + '.bind());');
                scope.exit(TEX_VALUE, '.unbind();');
              } else if (
                type === GL_FLOAT_MAT2 ||
                type === GL_FLOAT_MAT3 ||
                type === GL_FLOAT_MAT4) {
                check$1.optional(function () {
                  check$1.command(isArrayLike(value),
                    'invalid matrix for uniform ' + name, env.commandStr);
                  check$1.command(
                    (type === GL_FLOAT_MAT2 && value.length === 4) ||
                    (type === GL_FLOAT_MAT3 && value.length === 9) ||
                    (type === GL_FLOAT_MAT4 && value.length === 16),
                    'invalid length for matrix uniform ' + name, env.commandStr);
                });
                var MAT_VALUE = env.global.def('new Float32Array([' +
                  Array.prototype.slice.call(value) + '])');
                var dim = 2;
                if (type === GL_FLOAT_MAT3) {
                  dim = 3;
                } else if (type === GL_FLOAT_MAT4) {
                  dim = 4;
                }
                scope(
                  GL, '.uniformMatrix', dim, 'fv(',
                  LOCATION, ',false,', MAT_VALUE, ');');
              } else {
                switch (type) {
                  case GL_FLOAT$8:
                    check$1.commandType(value, 'number', 'uniform ' + name, env.commandStr);
                    infix = '1f';
                    break
                  case GL_FLOAT_VEC2:
                    check$1.command(
                      isArrayLike(value) && value.length === 2,
                      'uniform ' + name, env.commandStr);
                    infix = '2f';
                    break
                  case GL_FLOAT_VEC3:
                    check$1.command(
                      isArrayLike(value) && value.length === 3,
                      'uniform ' + name, env.commandStr);
                    infix = '3f';
                    break
                  case GL_FLOAT_VEC4:
                    check$1.command(
                      isArrayLike(value) && value.length === 4,
                      'uniform ' + name, env.commandStr);
                    infix = '4f';
                    break
                  case GL_BOOL:
                    check$1.commandType(value, 'boolean', 'uniform ' + name, env.commandStr);
                    infix = '1i';
                    break
                  case GL_INT$3:
                    check$1.commandType(value, 'number', 'uniform ' + name, env.commandStr);
                    infix = '1i';
                    break
                  case GL_BOOL_VEC2:
                    check$1.command(
                      isArrayLike(value) && value.length === 2,
                      'uniform ' + name, env.commandStr);
                    infix = '2i';
                    break
                  case GL_INT_VEC2:
                    check$1.command(
                      isArrayLike(value) && value.length === 2,
                      'uniform ' + name, env.commandStr);
                    infix = '2i';
                    break
                  case GL_BOOL_VEC3:
                    check$1.command(
                      isArrayLike(value) && value.length === 3,
                      'uniform ' + name, env.commandStr);
                    infix = '3i';
                    break
                  case GL_INT_VEC3:
                    check$1.command(
                      isArrayLike(value) && value.length === 3,
                      'uniform ' + name, env.commandStr);
                    infix = '3i';
                    break
                  case GL_BOOL_VEC4:
                    check$1.command(
                      isArrayLike(value) && value.length === 4,
                      'uniform ' + name, env.commandStr);
                    infix = '4i';
                    break
                  case GL_INT_VEC4:
                    check$1.command(
                      isArrayLike(value) && value.length === 4,
                      'uniform ' + name, env.commandStr);
                    infix = '4i';
                    break
                }
                scope(GL, '.uniform', infix, '(', LOCATION, ',',
                  isArrayLike(value) ? Array.prototype.slice.call(value) : value,
                  ');');
              }
              continue
            } else {
              VALUE = arg.append(env, scope);
            }
          } else {
            if (!filter(SCOPE_DECL)) {
              continue
            }
            VALUE = scope.def(shared.uniforms, '[', stringStore.id(name), ']');
          }

          if (type === GL_SAMPLER_2D) {
            check$1(!Array.isArray(VALUE), 'must specify a scalar prop for textures');
            scope(
              'if(', VALUE, '&&', VALUE, '._reglType==="framebuffer"){',
              VALUE, '=', VALUE, '.color[0];',
              '}');
          } else if (type === GL_SAMPLER_CUBE) {
            check$1(!Array.isArray(VALUE), 'must specify a scalar prop for cube maps');
            scope(
              'if(', VALUE, '&&', VALUE, '._reglType==="framebufferCube"){',
              VALUE, '=', VALUE, '.color[0];',
              '}');
          }

          // perform type validation
          check$1.optional(function () {
            function emitCheck (pred, message) {
              env.assert(scope, pred,
                'bad data or missing for uniform "' + name + '".  ' + message);
            }

            function checkType (type) {
              check$1(!Array.isArray(VALUE), 'must not specify an array type for uniform');
              emitCheck(
                'typeof ' + VALUE + '==="' + type + '"',
                'invalid type, expected ' + type);
            }

            function checkVector (n, type) {
              if (Array.isArray(VALUE)) {
                check$1(VALUE.length === n, 'must have length ' + n);
              } else {
                emitCheck(
                  shared.isArrayLike + '(' + VALUE + ')&&' + VALUE + '.length===' + n,
                  'invalid vector, should have length ' + n, env.commandStr);
              }
            }

            function checkTexture (target) {
              check$1(!Array.isArray(VALUE), 'must not specify a value type');
              emitCheck(
                'typeof ' + VALUE + '==="function"&&' +
                VALUE + '._reglType==="texture' +
                (target === GL_TEXTURE_2D$3 ? '2d' : 'Cube') + '"',
                'invalid texture type', env.commandStr);
            }

            switch (type) {
              case GL_INT$3:
                checkType('number');
                break
              case GL_INT_VEC2:
                checkVector(2);
                break
              case GL_INT_VEC3:
                checkVector(3);
                break
              case GL_INT_VEC4:
                checkVector(4);
                break
              case GL_FLOAT$8:
                checkType('number');
                break
              case GL_FLOAT_VEC2:
                checkVector(2);
                break
              case GL_FLOAT_VEC3:
                checkVector(3);
                break
              case GL_FLOAT_VEC4:
                checkVector(4);
                break
              case GL_BOOL:
                checkType('boolean');
                break
              case GL_BOOL_VEC2:
                checkVector(2);
                break
              case GL_BOOL_VEC3:
                checkVector(3);
                break
              case GL_BOOL_VEC4:
                checkVector(4);
                break
              case GL_FLOAT_MAT2:
                checkVector(4);
                break
              case GL_FLOAT_MAT3:
                checkVector(9);
                break
              case GL_FLOAT_MAT4:
                checkVector(16);
                break
              case GL_SAMPLER_2D:
                checkTexture(GL_TEXTURE_2D$3);
                break
              case GL_SAMPLER_CUBE:
                checkTexture(GL_TEXTURE_CUBE_MAP$2);
                break
            }
          });

          var unroll = 1;
          switch (type) {
            case GL_SAMPLER_2D:
            case GL_SAMPLER_CUBE:
              var TEX = scope.def(VALUE, '._texture');
              scope(GL, '.uniform1i(', LOCATION, ',', TEX, '.bind());');
              scope.exit(TEX, '.unbind();');
              continue

            case GL_INT$3:
            case GL_BOOL:
              infix = '1i';
              break

            case GL_INT_VEC2:
            case GL_BOOL_VEC2:
              infix = '2i';
              unroll = 2;
              break

            case GL_INT_VEC3:
            case GL_BOOL_VEC3:
              infix = '3i';
              unroll = 3;
              break

            case GL_INT_VEC4:
            case GL_BOOL_VEC4:
              infix = '4i';
              unroll = 4;
              break

            case GL_FLOAT$8:
              infix = '1f';
              break

            case GL_FLOAT_VEC2:
              infix = '2f';
              unroll = 2;
              break

            case GL_FLOAT_VEC3:
              infix = '3f';
              unroll = 3;
              break

            case GL_FLOAT_VEC4:
              infix = '4f';
              unroll = 4;
              break

            case GL_FLOAT_MAT2:
              infix = 'Matrix2fv';
              break

            case GL_FLOAT_MAT3:
              infix = 'Matrix3fv';
              break

            case GL_FLOAT_MAT4:
              infix = 'Matrix4fv';
              break
          }

          scope(GL, '.uniform', infix, '(', LOCATION, ',');
          if (infix.charAt(0) === 'M') {
            var matSize = Math.pow(type - GL_FLOAT_MAT2 + 2, 2);
            var STORAGE = env.global.def('new Float32Array(', matSize, ')');
            if (Array.isArray(VALUE)) {
              scope(
                'false,(',
                loop(matSize, function (i) {
                  return STORAGE + '[' + i + ']=' + VALUE[i]
                }), ',', STORAGE, ')');
            } else {
              scope(
                'false,(Array.isArray(', VALUE, ')||', VALUE, ' instanceof Float32Array)?', VALUE, ':(',
                loop(matSize, function (i) {
                  return STORAGE + '[' + i + ']=' + VALUE + '[' + i + ']'
                }), ',', STORAGE, ')');
            }
          } else if (unroll > 1) {
            scope(loop(unroll, function (i) {
              return Array.isArray(VALUE) ? VALUE[i] : VALUE + '[' + i + ']'
            }));
          } else {
            check$1(!Array.isArray(VALUE), 'uniform value must not be an array');
            scope(VALUE);
          }
          scope(');');
        }
      }

      function emitDraw (env, outer, inner, args) {
        var shared = env.shared;
        var GL = shared.gl;
        var DRAW_STATE = shared.draw;

        var drawOptions = args.draw;

        function emitElements () {
          var defn = drawOptions.elements;
          var ELEMENTS;
          var scope = outer;
          if (defn) {
            if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
              scope = inner;
            }
            ELEMENTS = defn.append(env, scope);
          } else {
            ELEMENTS = scope.def(DRAW_STATE, '.', S_ELEMENTS);
          }
          if (ELEMENTS) {
            scope(
              'if(' + ELEMENTS + ')' +
              GL + '.bindBuffer(' + GL_ELEMENT_ARRAY_BUFFER$1 + ',' + ELEMENTS + '.buffer.buffer);');
          }
          return ELEMENTS
        }

        function emitCount () {
          var defn = drawOptions.count;
          var COUNT;
          var scope = outer;
          if (defn) {
            if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
              scope = inner;
            }
            COUNT = defn.append(env, scope);
            check$1.optional(function () {
              if (defn.MISSING) {
                env.assert(outer, 'false', 'missing vertex count');
              }
              if (defn.DYNAMIC) {
                env.assert(scope, COUNT + '>=0', 'missing vertex count');
              }
            });
          } else {
            COUNT = scope.def(DRAW_STATE, '.', S_COUNT);
            check$1.optional(function () {
              env.assert(scope, COUNT + '>=0', 'missing vertex count');
            });
          }
          return COUNT
        }

        var ELEMENTS = emitElements();
        function emitValue (name) {
          var defn = drawOptions[name];
          if (defn) {
            if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
              return defn.append(env, inner)
            } else {
              return defn.append(env, outer)
            }
          } else {
            return outer.def(DRAW_STATE, '.', name)
          }
        }

        var PRIMITIVE = emitValue(S_PRIMITIVE);
        var OFFSET = emitValue(S_OFFSET);

        var COUNT = emitCount();
        if (typeof COUNT === 'number') {
          if (COUNT === 0) {
            return
          }
        } else {
          inner('if(', COUNT, '){');
          inner.exit('}');
        }

        var INSTANCES, EXT_INSTANCING;
        if (extInstancing) {
          INSTANCES = emitValue(S_INSTANCES);
          EXT_INSTANCING = env.instancing;
        }

        var ELEMENT_TYPE = ELEMENTS + '.type';

        var elementsStatic = drawOptions.elements && isStatic(drawOptions.elements);

        function emitInstancing () {
          function drawElements () {
            inner(EXT_INSTANCING, '.drawElementsInstancedANGLE(', [
              PRIMITIVE,
              COUNT,
              ELEMENT_TYPE,
              OFFSET + '<<((' + ELEMENT_TYPE + '-' + GL_UNSIGNED_BYTE$8 + ')>>1)',
              INSTANCES
            ], ');');
          }

          function drawArrays () {
            inner(EXT_INSTANCING, '.drawArraysInstancedANGLE(',
              [PRIMITIVE, OFFSET, COUNT, INSTANCES], ');');
          }

          if (ELEMENTS) {
            if (!elementsStatic) {
              inner('if(', ELEMENTS, '){');
              drawElements();
              inner('}else{');
              drawArrays();
              inner('}');
            } else {
              drawElements();
            }
          } else {
            drawArrays();
          }
        }

        function emitRegular () {
          function drawElements () {
            inner(GL + '.drawElements(' + [
              PRIMITIVE,
              COUNT,
              ELEMENT_TYPE,
              OFFSET + '<<((' + ELEMENT_TYPE + '-' + GL_UNSIGNED_BYTE$8 + ')>>1)'
            ] + ');');
          }

          function drawArrays () {
            inner(GL + '.drawArrays(' + [PRIMITIVE, OFFSET, COUNT] + ');');
          }

          if (ELEMENTS) {
            if (!elementsStatic) {
              inner('if(', ELEMENTS, '){');
              drawElements();
              inner('}else{');
              drawArrays();
              inner('}');
            } else {
              drawElements();
            }
          } else {
            drawArrays();
          }
        }

        if (extInstancing && (typeof INSTANCES !== 'number' || INSTANCES >= 0)) {
          if (typeof INSTANCES === 'string') {
            inner('if(', INSTANCES, '>0){');
            emitInstancing();
            inner('}else if(', INSTANCES, '<0){');
            emitRegular();
            inner('}');
          } else {
            emitInstancing();
          }
        } else {
          emitRegular();
        }
      }

      function createBody (emitBody, parentEnv, args, program, count) {
        var env = createREGLEnvironment();
        var scope = env.proc('body', count);
        check$1.optional(function () {
          env.commandStr = parentEnv.commandStr;
          env.command = env.link(parentEnv.commandStr);
        });
        if (extInstancing) {
          env.instancing = scope.def(
            env.shared.extensions, '.angle_instanced_arrays');
        }
        emitBody(env, scope, args, program);
        return env.compile().body
      }

      // ===================================================
      // ===================================================
      // DRAW PROC
      // ===================================================
      // ===================================================
      function emitDrawBody (env, draw, args, program) {
        injectExtensions(env, draw);
        if (args.useVAO) {
          if (args.drawVAO) {
            draw(env.shared.vao, '.setVAO(', args.drawVAO.append(env, draw), ');');
          } else {
            draw(env.shared.vao, '.setVAO(', env.shared.vao, '.targetVAO);');
          }
        } else {
          draw(env.shared.vao, '.setVAO(null);');
          emitAttributes(env, draw, args, program.attributes, function () {
            return true
          });
        }
        emitUniforms(env, draw, args, program.uniforms, function () {
          return true
        });
        emitDraw(env, draw, draw, args);
      }

      function emitDrawProc (env, args) {
        var draw = env.proc('draw', 1);

        injectExtensions(env, draw);

        emitContext(env, draw, args.context);
        emitPollFramebuffer(env, draw, args.framebuffer);

        emitPollState(env, draw, args);
        emitSetOptions(env, draw, args.state);

        emitProfile(env, draw, args, false, true);

        var program = args.shader.progVar.append(env, draw);
        draw(env.shared.gl, '.useProgram(', program, '.program);');

        if (args.shader.program) {
          emitDrawBody(env, draw, args, args.shader.program);
        } else {
          draw(env.shared.vao, '.setVAO(null);');
          var drawCache = env.global.def('{}');
          var PROG_ID = draw.def(program, '.id');
          var CACHED_PROC = draw.def(drawCache, '[', PROG_ID, ']');
          draw(
            env.cond(CACHED_PROC)
              .then(CACHED_PROC, '.call(this,a0);')
              .else(
                CACHED_PROC, '=', drawCache, '[', PROG_ID, ']=',
                env.link(function (program) {
                  return createBody(emitDrawBody, env, args, program, 1)
                }), '(', program, ');',
                CACHED_PROC, '.call(this,a0);'));
        }

        if (Object.keys(args.state).length > 0) {
          draw(env.shared.current, '.dirty=true;');
        }
      }

      // ===================================================
      // ===================================================
      // BATCH PROC
      // ===================================================
      // ===================================================

      function emitBatchDynamicShaderBody (env, scope, args, program) {
        env.batchId = 'a1';

        injectExtensions(env, scope);

        function all () {
          return true
        }

        emitAttributes(env, scope, args, program.attributes, all);
        emitUniforms(env, scope, args, program.uniforms, all);
        emitDraw(env, scope, scope, args);
      }

      function emitBatchBody (env, scope, args, program) {
        injectExtensions(env, scope);

        var contextDynamic = args.contextDep;

        var BATCH_ID = scope.def();
        var PROP_LIST = 'a0';
        var NUM_PROPS = 'a1';
        var PROPS = scope.def();
        env.shared.props = PROPS;
        env.batchId = BATCH_ID;

        var outer = env.scope();
        var inner = env.scope();

        scope(
          outer.entry,
          'for(', BATCH_ID, '=0;', BATCH_ID, '<', NUM_PROPS, ';++', BATCH_ID, '){',
          PROPS, '=', PROP_LIST, '[', BATCH_ID, '];',
          inner,
          '}',
          outer.exit);

        function isInnerDefn (defn) {
          return ((defn.contextDep && contextDynamic) || defn.propDep)
        }

        function isOuterDefn (defn) {
          return !isInnerDefn(defn)
        }

        if (args.needsContext) {
          emitContext(env, inner, args.context);
        }
        if (args.needsFramebuffer) {
          emitPollFramebuffer(env, inner, args.framebuffer);
        }
        emitSetOptions(env, inner, args.state, isInnerDefn);

        if (args.profile && isInnerDefn(args.profile)) {
          emitProfile(env, inner, args, false, true);
        }

        if (!program) {
          var progCache = env.global.def('{}');
          var PROGRAM = args.shader.progVar.append(env, inner);
          var PROG_ID = inner.def(PROGRAM, '.id');
          var CACHED_PROC = inner.def(progCache, '[', PROG_ID, ']');
          inner(
            env.shared.gl, '.useProgram(', PROGRAM, '.program);',
            'if(!', CACHED_PROC, '){',
            CACHED_PROC, '=', progCache, '[', PROG_ID, ']=',
            env.link(function (program) {
              return createBody(
                emitBatchDynamicShaderBody, env, args, program, 2)
            }), '(', PROGRAM, ');}',
            CACHED_PROC, '.call(this,a0[', BATCH_ID, '],', BATCH_ID, ');');
        } else {
          if (args.useVAO) {
            if (args.drawVAO) {
              if (isInnerDefn(args.drawVAO)) {
                // vao is a prop
                inner(env.shared.vao, '.setVAO(', args.drawVAO.append(env, inner), ');');
              } else {
                // vao is invariant
                outer(env.shared.vao, '.setVAO(', args.drawVAO.append(env, outer), ');');
              }
            } else {
              // scoped vao binding
              outer(env.shared.vao, '.setVAO(', env.shared.vao, '.targetVAO);');
            }
          } else {
            outer(env.shared.vao, '.setVAO(null);');
            emitAttributes(env, outer, args, program.attributes, isOuterDefn);
            emitAttributes(env, inner, args, program.attributes, isInnerDefn);
          }
          emitUniforms(env, outer, args, program.uniforms, isOuterDefn);
          emitUniforms(env, inner, args, program.uniforms, isInnerDefn);
          emitDraw(env, outer, inner, args);
        }
      }

      function emitBatchProc (env, args) {
        var batch = env.proc('batch', 2);
        env.batchId = '0';

        injectExtensions(env, batch);

        // Check if any context variables depend on props
        var contextDynamic = false;
        var needsContext = true;
        Object.keys(args.context).forEach(function (name) {
          contextDynamic = contextDynamic || args.context[name].propDep;
        });
        if (!contextDynamic) {
          emitContext(env, batch, args.context);
          needsContext = false;
        }

        // framebuffer state affects framebufferWidth/height context vars
        var framebuffer = args.framebuffer;
        var needsFramebuffer = false;
        if (framebuffer) {
          if (framebuffer.propDep) {
            contextDynamic = needsFramebuffer = true;
          } else if (framebuffer.contextDep && contextDynamic) {
            needsFramebuffer = true;
          }
          if (!needsFramebuffer) {
            emitPollFramebuffer(env, batch, framebuffer);
          }
        } else {
          emitPollFramebuffer(env, batch, null);
        }

        // viewport is weird because it can affect context vars
        if (args.state.viewport && args.state.viewport.propDep) {
          contextDynamic = true;
        }

        function isInnerDefn (defn) {
          return (defn.contextDep && contextDynamic) || defn.propDep
        }

        // set webgl options
        emitPollState(env, batch, args);
        emitSetOptions(env, batch, args.state, function (defn) {
          return !isInnerDefn(defn)
        });

        if (!args.profile || !isInnerDefn(args.profile)) {
          emitProfile(env, batch, args, false, 'a1');
        }

        // Save these values to args so that the batch body routine can use them
        args.contextDep = contextDynamic;
        args.needsContext = needsContext;
        args.needsFramebuffer = needsFramebuffer;

        // determine if shader is dynamic
        var progDefn = args.shader.progVar;
        if ((progDefn.contextDep && contextDynamic) || progDefn.propDep) {
          emitBatchBody(
            env,
            batch,
            args,
            null);
        } else {
          var PROGRAM = progDefn.append(env, batch);
          batch(env.shared.gl, '.useProgram(', PROGRAM, '.program);');
          if (args.shader.program) {
            emitBatchBody(
              env,
              batch,
              args,
              args.shader.program);
          } else {
            batch(env.shared.vao, '.setVAO(null);');
            var batchCache = env.global.def('{}');
            var PROG_ID = batch.def(PROGRAM, '.id');
            var CACHED_PROC = batch.def(batchCache, '[', PROG_ID, ']');
            batch(
              env.cond(CACHED_PROC)
                .then(CACHED_PROC, '.call(this,a0,a1);')
                .else(
                  CACHED_PROC, '=', batchCache, '[', PROG_ID, ']=',
                  env.link(function (program) {
                    return createBody(emitBatchBody, env, args, program, 2)
                  }), '(', PROGRAM, ');',
                  CACHED_PROC, '.call(this,a0,a1);'));
          }
        }

        if (Object.keys(args.state).length > 0) {
          batch(env.shared.current, '.dirty=true;');
        }
      }

      // ===================================================
      // ===================================================
      // SCOPE COMMAND
      // ===================================================
      // ===================================================
      function emitScopeProc (env, args) {
        var scope = env.proc('scope', 3);
        env.batchId = 'a2';

        var shared = env.shared;
        var CURRENT_STATE = shared.current;

        emitContext(env, scope, args.context);

        if (args.framebuffer) {
          args.framebuffer.append(env, scope);
        }

        sortState(Object.keys(args.state)).forEach(function (name) {
          var defn = args.state[name];
          var value = defn.append(env, scope);
          if (isArrayLike(value)) {
            value.forEach(function (v, i) {
              scope.set(env.next[name], '[' + i + ']', v);
            });
          } else {
            scope.set(shared.next, '.' + name, value);
          }
        });

        emitProfile(env, scope, args, true, true)

        ;[S_ELEMENTS, S_OFFSET, S_COUNT, S_INSTANCES, S_PRIMITIVE].forEach(
          function (opt) {
            var variable = args.draw[opt];
            if (!variable) {
              return
            }
            scope.set(shared.draw, '.' + opt, '' + variable.append(env, scope));
          });

        Object.keys(args.uniforms).forEach(function (opt) {
          var value = args.uniforms[opt].append(env, scope);
          if (Array.isArray(value)) {
            value = '[' + value.join() + ']';
          }
          scope.set(
            shared.uniforms,
            '[' + stringStore.id(opt) + ']',
            value);
        });

        Object.keys(args.attributes).forEach(function (name) {
          var record = args.attributes[name].append(env, scope);
          var scopeAttrib = env.scopeAttrib(name);
          Object.keys(new AttributeRecord()).forEach(function (prop) {
            scope.set(scopeAttrib, '.' + prop, record[prop]);
          });
        });

        if (args.scopeVAO) {
          scope.set(shared.vao, '.targetVAO', args.scopeVAO.append(env, scope));
        }

        function saveShader (name) {
          var shader = args.shader[name];
          if (shader) {
            scope.set(shared.shader, '.' + name, shader.append(env, scope));
          }
        }
        saveShader(S_VERT);
        saveShader(S_FRAG);

        if (Object.keys(args.state).length > 0) {
          scope(CURRENT_STATE, '.dirty=true;');
          scope.exit(CURRENT_STATE, '.dirty=true;');
        }

        scope('a1(', env.shared.context, ',a0,', env.batchId, ');');
      }

      function isDynamicObject (object) {
        if (typeof object !== 'object' || isArrayLike(object)) {
          return
        }
        var props = Object.keys(object);
        for (var i = 0; i < props.length; ++i) {
          if (dynamic.isDynamic(object[props[i]])) {
            return true
          }
        }
        return false
      }

      function splatObject (env, options, name) {
        var object = options.static[name];
        if (!object || !isDynamicObject(object)) {
          return
        }

        var globals = env.global;
        var keys = Object.keys(object);
        var thisDep = false;
        var contextDep = false;
        var propDep = false;
        var objectRef = env.global.def('{}');
        keys.forEach(function (key) {
          var value = object[key];
          if (dynamic.isDynamic(value)) {
            if (typeof value === 'function') {
              value = object[key] = dynamic.unbox(value);
            }
            var deps = createDynamicDecl(value, null);
            thisDep = thisDep || deps.thisDep;
            propDep = propDep || deps.propDep;
            contextDep = contextDep || deps.contextDep;
          } else {
            globals(objectRef, '.', key, '=');
            switch (typeof value) {
              case 'number':
                globals(value);
                break
              case 'string':
                globals('"', value, '"');
                break
              case 'object':
                if (Array.isArray(value)) {
                  globals('[', value.join(), ']');
                }
                break
              default:
                globals(env.link(value));
                break
            }
            globals(';');
          }
        });

        function appendBlock (env, block) {
          keys.forEach(function (key) {
            var value = object[key];
            if (!dynamic.isDynamic(value)) {
              return
            }
            var ref = env.invoke(block, value);
            block(objectRef, '.', key, '=', ref, ';');
          });
        }

        options.dynamic[name] = new dynamic.DynamicVariable(DYN_THUNK, {
          thisDep: thisDep,
          contextDep: contextDep,
          propDep: propDep,
          ref: objectRef,
          append: appendBlock
        });
        delete options.static[name];
      }

      // ===========================================================================
      // ===========================================================================
      // MAIN DRAW COMMAND
      // ===========================================================================
      // ===========================================================================
      function compileCommand (options, attributes, uniforms, context, stats) {
        var env = createREGLEnvironment();

        // link stats, so that we can easily access it in the program.
        env.stats = env.link(stats);

        // splat options and attributes to allow for dynamic nested properties
        Object.keys(attributes.static).forEach(function (key) {
          splatObject(env, attributes, key);
        });
        NESTED_OPTIONS.forEach(function (name) {
          splatObject(env, options, name);
        });

        var args = parseArguments(options, attributes, uniforms, context, env);

        emitDrawProc(env, args);
        emitScopeProc(env, args);
        emitBatchProc(env, args);

        return extend(env.compile(), {
          destroy: function () {
            args.shader.program.destroy();
          }
        })
      }

      // ===========================================================================
      // ===========================================================================
      // POLL / REFRESH
      // ===========================================================================
      // ===========================================================================
      return {
        next: nextState,
        current: currentState,
        procs: (function () {
          var env = createREGLEnvironment();
          var poll = env.proc('poll');
          var refresh = env.proc('refresh');
          var common = env.block();
          poll(common);
          refresh(common);

          var shared = env.shared;
          var GL = shared.gl;
          var NEXT_STATE = shared.next;
          var CURRENT_STATE = shared.current;

          common(CURRENT_STATE, '.dirty=false;');

          emitPollFramebuffer(env, poll);
          emitPollFramebuffer(env, refresh, null, true);

          // Refresh updates all attribute state changes
          var INSTANCING;
          if (extInstancing) {
            INSTANCING = env.link(extInstancing);
          }

          // update vertex array bindings
          if (extensions.oes_vertex_array_object) {
            refresh(env.link(extensions.oes_vertex_array_object), '.bindVertexArrayOES(null);');
          }
          for (var i = 0; i < limits.maxAttributes; ++i) {
            var BINDING = refresh.def(shared.attributes, '[', i, ']');
            var ifte = env.cond(BINDING, '.buffer');
            ifte.then(
              GL, '.enableVertexAttribArray(', i, ');',
              GL, '.bindBuffer(',
              GL_ARRAY_BUFFER$2, ',',
              BINDING, '.buffer.buffer);',
              GL, '.vertexAttribPointer(',
              i, ',',
              BINDING, '.size,',
              BINDING, '.type,',
              BINDING, '.normalized,',
              BINDING, '.stride,',
              BINDING, '.offset);'
            ).else(
              GL, '.disableVertexAttribArray(', i, ');',
              GL, '.vertexAttrib4f(',
              i, ',',
              BINDING, '.x,',
              BINDING, '.y,',
              BINDING, '.z,',
              BINDING, '.w);',
              BINDING, '.buffer=null;');
            refresh(ifte);
            if (extInstancing) {
              refresh(
                INSTANCING, '.vertexAttribDivisorANGLE(',
                i, ',',
                BINDING, '.divisor);');
            }
          }
          refresh(
            env.shared.vao, '.currentVAO=null;',
            env.shared.vao, '.setVAO(', env.shared.vao, '.targetVAO);');

          Object.keys(GL_FLAGS).forEach(function (flag) {
            var cap = GL_FLAGS[flag];
            var NEXT = common.def(NEXT_STATE, '.', flag);
            var block = env.block();
            block('if(', NEXT, '){',
              GL, '.enable(', cap, ')}else{',
              GL, '.disable(', cap, ')}',
              CURRENT_STATE, '.', flag, '=', NEXT, ';');
            refresh(block);
            poll(
              'if(', NEXT, '!==', CURRENT_STATE, '.', flag, '){',
              block,
              '}');
          });

          Object.keys(GL_VARIABLES).forEach(function (name) {
            var func = GL_VARIABLES[name];
            var init = currentState[name];
            var NEXT, CURRENT;
            var block = env.block();
            block(GL, '.', func, '(');
            if (isArrayLike(init)) {
              var n = init.length;
              NEXT = env.global.def(NEXT_STATE, '.', name);
              CURRENT = env.global.def(CURRENT_STATE, '.', name);
              block(
                loop(n, function (i) {
                  return NEXT + '[' + i + ']'
                }), ');',
                loop(n, function (i) {
                  return CURRENT + '[' + i + ']=' + NEXT + '[' + i + '];'
                }).join(''));
              poll(
                'if(', loop(n, function (i) {
                  return NEXT + '[' + i + ']!==' + CURRENT + '[' + i + ']'
                }).join('||'), '){',
                block,
                '}');
            } else {
              NEXT = common.def(NEXT_STATE, '.', name);
              CURRENT = common.def(CURRENT_STATE, '.', name);
              block(
                NEXT, ');',
                CURRENT_STATE, '.', name, '=', NEXT, ';');
              poll(
                'if(', NEXT, '!==', CURRENT, '){',
                block,
                '}');
            }
            refresh(block);
          });

          return env.compile()
        })(),
        compile: compileCommand
      }
    }

    function stats () {
      return {
        vaoCount: 0,
        bufferCount: 0,
        elementsCount: 0,
        framebufferCount: 0,
        shaderCount: 0,
        textureCount: 0,
        cubeCount: 0,
        renderbufferCount: 0,
        maxTextureUnits: 0
      }
    }

    var GL_QUERY_RESULT_EXT = 0x8866;
    var GL_QUERY_RESULT_AVAILABLE_EXT = 0x8867;
    var GL_TIME_ELAPSED_EXT = 0x88BF;

    var createTimer = function (gl, extensions) {
      if (!extensions.ext_disjoint_timer_query) {
        return null
      }

      // QUERY POOL BEGIN
      var queryPool = [];
      function allocQuery () {
        return queryPool.pop() || extensions.ext_disjoint_timer_query.createQueryEXT()
      }
      function freeQuery (query) {
        queryPool.push(query);
      }
      // QUERY POOL END

      var pendingQueries = [];
      function beginQuery (stats) {
        var query = allocQuery();
        extensions.ext_disjoint_timer_query.beginQueryEXT(GL_TIME_ELAPSED_EXT, query);
        pendingQueries.push(query);
        pushScopeStats(pendingQueries.length - 1, pendingQueries.length, stats);
      }

      function endQuery () {
        extensions.ext_disjoint_timer_query.endQueryEXT(GL_TIME_ELAPSED_EXT);
      }

      //
      // Pending stats pool.
      //
      function PendingStats () {
        this.startQueryIndex = -1;
        this.endQueryIndex = -1;
        this.sum = 0;
        this.stats = null;
      }
      var pendingStatsPool = [];
      function allocPendingStats () {
        return pendingStatsPool.pop() || new PendingStats()
      }
      function freePendingStats (pendingStats) {
        pendingStatsPool.push(pendingStats);
      }
      // Pending stats pool end

      var pendingStats = [];
      function pushScopeStats (start, end, stats) {
        var ps = allocPendingStats();
        ps.startQueryIndex = start;
        ps.endQueryIndex = end;
        ps.sum = 0;
        ps.stats = stats;
        pendingStats.push(ps);
      }

      // we should call this at the beginning of the frame,
      // in order to update gpuTime
      var timeSum = [];
      var queryPtr = [];
      function update () {
        var ptr, i;

        var n = pendingQueries.length;
        if (n === 0) {
          return
        }

        // Reserve space
        queryPtr.length = Math.max(queryPtr.length, n + 1);
        timeSum.length = Math.max(timeSum.length, n + 1);
        timeSum[0] = 0;
        queryPtr[0] = 0;

        // Update all pending timer queries
        var queryTime = 0;
        ptr = 0;
        for (i = 0; i < pendingQueries.length; ++i) {
          var query = pendingQueries[i];
          if (extensions.ext_disjoint_timer_query.getQueryObjectEXT(query, GL_QUERY_RESULT_AVAILABLE_EXT)) {
            queryTime += extensions.ext_disjoint_timer_query.getQueryObjectEXT(query, GL_QUERY_RESULT_EXT);
            freeQuery(query);
          } else {
            pendingQueries[ptr++] = query;
          }
          timeSum[i + 1] = queryTime;
          queryPtr[i + 1] = ptr;
        }
        pendingQueries.length = ptr;

        // Update all pending stat queries
        ptr = 0;
        for (i = 0; i < pendingStats.length; ++i) {
          var stats = pendingStats[i];
          var start = stats.startQueryIndex;
          var end = stats.endQueryIndex;
          stats.sum += timeSum[end] - timeSum[start];
          var startPtr = queryPtr[start];
          var endPtr = queryPtr[end];
          if (endPtr === startPtr) {
            stats.stats.gpuTime += stats.sum / 1e6;
            freePendingStats(stats);
          } else {
            stats.startQueryIndex = startPtr;
            stats.endQueryIndex = endPtr;
            pendingStats[ptr++] = stats;
          }
        }
        pendingStats.length = ptr;
      }

      return {
        beginQuery: beginQuery,
        endQuery: endQuery,
        pushScopeStats: pushScopeStats,
        update: update,
        getNumPendingQueries: function () {
          return pendingQueries.length
        },
        clear: function () {
          queryPool.push.apply(queryPool, pendingQueries);
          for (var i = 0; i < queryPool.length; i++) {
            extensions.ext_disjoint_timer_query.deleteQueryEXT(queryPool[i]);
          }
          pendingQueries.length = 0;
          queryPool.length = 0;
        },
        restore: function () {
          pendingQueries.length = 0;
          queryPool.length = 0;
        }
      }
    };

    var GL_COLOR_BUFFER_BIT = 16384;
    var GL_DEPTH_BUFFER_BIT = 256;
    var GL_STENCIL_BUFFER_BIT = 1024;

    var GL_ARRAY_BUFFER = 34962;

    var CONTEXT_LOST_EVENT = 'webglcontextlost';
    var CONTEXT_RESTORED_EVENT = 'webglcontextrestored';

    var DYN_PROP = 1;
    var DYN_CONTEXT = 2;
    var DYN_STATE = 3;

    function find (haystack, needle) {
      for (var i = 0; i < haystack.length; ++i) {
        if (haystack[i] === needle) {
          return i
        }
      }
      return -1
    }

    function wrapREGL (args) {
      var config = parseArgs(args);
      if (!config) {
        return null
      }

      var gl = config.gl;
      var glAttributes = gl.getContextAttributes();
      var contextLost = gl.isContextLost();

      var extensionState = createExtensionCache(gl, config);
      if (!extensionState) {
        return null
      }

      var stringStore = createStringStore();
      var stats$$1 = stats();
      var extensions = extensionState.extensions;
      var timer = createTimer(gl, extensions);

      var START_TIME = clock();
      var WIDTH = gl.drawingBufferWidth;
      var HEIGHT = gl.drawingBufferHeight;

      var contextState = {
        tick: 0,
        time: 0,
        viewportWidth: WIDTH,
        viewportHeight: HEIGHT,
        framebufferWidth: WIDTH,
        framebufferHeight: HEIGHT,
        drawingBufferWidth: WIDTH,
        drawingBufferHeight: HEIGHT,
        pixelRatio: config.pixelRatio
      };
      var uniformState = {};
      var drawState = {
        elements: null,
        primitive: 4, // GL_TRIANGLES
        count: -1,
        offset: 0,
        instances: -1
      };

      var limits = wrapLimits(gl, extensions);
      var bufferState = wrapBufferState(
        gl,
        stats$$1,
        config,
        destroyBuffer);
      var attributeState = wrapAttributeState(
        gl,
        extensions,
        limits,
        stats$$1,
        bufferState);
      function destroyBuffer (buffer) {
        return attributeState.destroyBuffer(buffer)
      }
      var elementState = wrapElementsState(gl, extensions, bufferState, stats$$1);
      var shaderState = wrapShaderState(gl, stringStore, stats$$1, config);
      var textureState = createTextureSet(
        gl,
        extensions,
        limits,
        function () { core.procs.poll(); },
        contextState,
        stats$$1,
        config);
      var renderbufferState = wrapRenderbuffers(gl, extensions, limits, stats$$1, config);
      var framebufferState = wrapFBOState(
        gl,
        extensions,
        limits,
        textureState,
        renderbufferState,
        stats$$1);
      var core = reglCore(
        gl,
        stringStore,
        extensions,
        limits,
        bufferState,
        elementState,
        textureState,
        framebufferState,
        uniformState,
        attributeState,
        shaderState,
        drawState,
        contextState,
        timer,
        config);
      var readPixels = wrapReadPixels(
        gl,
        framebufferState,
        core.procs.poll,
        contextState,
        glAttributes, extensions, limits);

      var nextState = core.next;
      var canvas = gl.canvas;

      var rafCallbacks = [];
      var lossCallbacks = [];
      var restoreCallbacks = [];
      var destroyCallbacks = [config.onDestroy];

      var activeRAF = null;
      function handleRAF () {
        if (rafCallbacks.length === 0) {
          if (timer) {
            timer.update();
          }
          activeRAF = null;
          return
        }

        // schedule next animation frame
        activeRAF = raf.next(handleRAF);

        // poll for changes
        poll();

        // fire a callback for all pending rafs
        for (var i = rafCallbacks.length - 1; i >= 0; --i) {
          var cb = rafCallbacks[i];
          if (cb) {
            cb(contextState, null, 0);
          }
        }

        // flush all pending webgl calls
        gl.flush();

        // poll GPU timers *after* gl.flush so we don't delay command dispatch
        if (timer) {
          timer.update();
        }
      }

      function startRAF () {
        if (!activeRAF && rafCallbacks.length > 0) {
          activeRAF = raf.next(handleRAF);
        }
      }

      function stopRAF () {
        if (activeRAF) {
          raf.cancel(handleRAF);
          activeRAF = null;
        }
      }

      function handleContextLoss (event) {
        event.preventDefault();

        // set context lost flag
        contextLost = true;

        // pause request animation frame
        stopRAF();

        // lose context
        lossCallbacks.forEach(function (cb) {
          cb();
        });
      }

      function handleContextRestored (event) {
        // clear error code
        gl.getError();

        // clear context lost flag
        contextLost = false;

        // refresh state
        extensionState.restore();
        shaderState.restore();
        bufferState.restore();
        textureState.restore();
        renderbufferState.restore();
        framebufferState.restore();
        attributeState.restore();
        if (timer) {
          timer.restore();
        }

        // refresh state
        core.procs.refresh();

        // restart RAF
        startRAF();

        // restore context
        restoreCallbacks.forEach(function (cb) {
          cb();
        });
      }

      if (canvas) {
        canvas.addEventListener(CONTEXT_LOST_EVENT, handleContextLoss, false);
        canvas.addEventListener(CONTEXT_RESTORED_EVENT, handleContextRestored, false);
      }

      function destroy () {
        rafCallbacks.length = 0;
        stopRAF();

        if (canvas) {
          canvas.removeEventListener(CONTEXT_LOST_EVENT, handleContextLoss);
          canvas.removeEventListener(CONTEXT_RESTORED_EVENT, handleContextRestored);
        }

        shaderState.clear();
        framebufferState.clear();
        renderbufferState.clear();
        textureState.clear();
        elementState.clear();
        bufferState.clear();
        attributeState.clear();

        if (timer) {
          timer.clear();
        }

        destroyCallbacks.forEach(function (cb) {
          cb();
        });
      }

      function compileProcedure (options) {
        check$1(!!options, 'invalid args to regl({...})');
        check$1.type(options, 'object', 'invalid args to regl({...})');

        function flattenNestedOptions (options) {
          var result = extend({}, options);
          delete result.uniforms;
          delete result.attributes;
          delete result.context;
          delete result.vao;

          if ('stencil' in result && result.stencil.op) {
            result.stencil.opBack = result.stencil.opFront = result.stencil.op;
            delete result.stencil.op;
          }

          function merge (name) {
            if (name in result) {
              var child = result[name];
              delete result[name];
              Object.keys(child).forEach(function (prop) {
                result[name + '.' + prop] = child[prop];
              });
            }
          }
          merge('blend');
          merge('depth');
          merge('cull');
          merge('stencil');
          merge('polygonOffset');
          merge('scissor');
          merge('sample');

          if ('vao' in options) {
            result.vao = options.vao;
          }

          return result
        }

        function separateDynamic (object, useArrays) {
          var staticItems = {};
          var dynamicItems = {};
          Object.keys(object).forEach(function (option) {
            var value = object[option];
            if (dynamic.isDynamic(value)) {
              dynamicItems[option] = dynamic.unbox(value, option);
              return
            } else if (useArrays && Array.isArray(value)) {
              for (var i = 0; i < value.length; ++i) {
                if (dynamic.isDynamic(value[i])) {
                  dynamicItems[option] = dynamic.unbox(value, option);
                  return
                }
              }
            }
            staticItems[option] = value;
          });
          return {
            dynamic: dynamicItems,
            static: staticItems
          }
        }

        // Treat context variables separate from other dynamic variables
        var context = separateDynamic(options.context || {}, true);
        var uniforms = separateDynamic(options.uniforms || {}, true);
        var attributes = separateDynamic(options.attributes || {}, false);
        var opts = separateDynamic(flattenNestedOptions(options), false);

        var stats$$1 = {
          gpuTime: 0.0,
          cpuTime: 0.0,
          count: 0
        };

        var compiled = core.compile(opts, attributes, uniforms, context, stats$$1);

        var draw = compiled.draw;
        var batch = compiled.batch;
        var scope = compiled.scope;

        // FIXME: we should modify code generation for batch commands so this
        // isn't necessary
        var EMPTY_ARRAY = [];
        function reserve (count) {
          while (EMPTY_ARRAY.length < count) {
            EMPTY_ARRAY.push(null);
          }
          return EMPTY_ARRAY
        }

        function REGLCommand (args, body) {
          var i;
          if (contextLost) {
            check$1.raise('context lost');
          }
          if (typeof args === 'function') {
            return scope.call(this, null, args, 0)
          } else if (typeof body === 'function') {
            if (typeof args === 'number') {
              for (i = 0; i < args; ++i) {
                scope.call(this, null, body, i);
              }
            } else if (Array.isArray(args)) {
              for (i = 0; i < args.length; ++i) {
                scope.call(this, args[i], body, i);
              }
            } else {
              return scope.call(this, args, body, 0)
            }
          } else if (typeof args === 'number') {
            if (args > 0) {
              return batch.call(this, reserve(args | 0), args | 0)
            }
          } else if (Array.isArray(args)) {
            if (args.length) {
              return batch.call(this, args, args.length)
            }
          } else {
            return draw.call(this, args)
          }
        }

        return extend(REGLCommand, {
          stats: stats$$1,
          destroy: function () {
            compiled.destroy();
          }
        })
      }

      var setFBO = framebufferState.setFBO = compileProcedure({
        framebuffer: dynamic.define.call(null, DYN_PROP, 'framebuffer')
      });

      function clearImpl (_, options) {
        var clearFlags = 0;
        core.procs.poll();

        var c = options.color;
        if (c) {
          gl.clearColor(+c[0] || 0, +c[1] || 0, +c[2] || 0, +c[3] || 0);
          clearFlags |= GL_COLOR_BUFFER_BIT;
        }
        if ('depth' in options) {
          gl.clearDepth(+options.depth);
          clearFlags |= GL_DEPTH_BUFFER_BIT;
        }
        if ('stencil' in options) {
          gl.clearStencil(options.stencil | 0);
          clearFlags |= GL_STENCIL_BUFFER_BIT;
        }

        check$1(!!clearFlags, 'called regl.clear with no buffer specified');
        gl.clear(clearFlags);
      }

      function clear (options) {
        check$1(
          typeof options === 'object' && options,
          'regl.clear() takes an object as input');
        if ('framebuffer' in options) {
          if (options.framebuffer &&
              options.framebuffer_reglType === 'framebufferCube') {
            for (var i = 0; i < 6; ++i) {
              setFBO(extend({
                framebuffer: options.framebuffer.faces[i]
              }, options), clearImpl);
            }
          } else {
            setFBO(options, clearImpl);
          }
        } else {
          clearImpl(null, options);
        }
      }

      function frame (cb) {
        check$1.type(cb, 'function', 'regl.frame() callback must be a function');
        rafCallbacks.push(cb);

        function cancel () {
          // FIXME:  should we check something other than equals cb here?
          // what if a user calls frame twice with the same callback...
          //
          var i = find(rafCallbacks, cb);
          check$1(i >= 0, 'cannot cancel a frame twice');
          function pendingCancel () {
            var index = find(rafCallbacks, pendingCancel);
            rafCallbacks[index] = rafCallbacks[rafCallbacks.length - 1];
            rafCallbacks.length -= 1;
            if (rafCallbacks.length <= 0) {
              stopRAF();
            }
          }
          rafCallbacks[i] = pendingCancel;
        }

        startRAF();

        return {
          cancel: cancel
        }
      }

      // poll viewport
      function pollViewport () {
        var viewport = nextState.viewport;
        var scissorBox = nextState.scissor_box;
        viewport[0] = viewport[1] = scissorBox[0] = scissorBox[1] = 0;
        contextState.viewportWidth =
          contextState.framebufferWidth =
          contextState.drawingBufferWidth =
          viewport[2] =
          scissorBox[2] = gl.drawingBufferWidth;
        contextState.viewportHeight =
          contextState.framebufferHeight =
          contextState.drawingBufferHeight =
          viewport[3] =
          scissorBox[3] = gl.drawingBufferHeight;
      }

      function poll () {
        contextState.tick += 1;
        contextState.time = now();
        pollViewport();
        core.procs.poll();
      }

      function refresh () {
        textureState.refresh();
        pollViewport();
        core.procs.refresh();
        if (timer) {
          timer.update();
        }
      }

      function now () {
        return (clock() - START_TIME) / 1000.0
      }

      refresh();

      function addListener (event, callback) {
        check$1.type(callback, 'function', 'listener callback must be a function');

        var callbacks;
        switch (event) {
          case 'frame':
            return frame(callback)
          case 'lost':
            callbacks = lossCallbacks;
            break
          case 'restore':
            callbacks = restoreCallbacks;
            break
          case 'destroy':
            callbacks = destroyCallbacks;
            break
          default:
            check$1.raise('invalid event, must be one of frame,lost,restore,destroy');
        }

        callbacks.push(callback);
        return {
          cancel: function () {
            for (var i = 0; i < callbacks.length; ++i) {
              if (callbacks[i] === callback) {
                callbacks[i] = callbacks[callbacks.length - 1];
                callbacks.pop();
                return
              }
            }
          }
        }
      }

      var regl = extend(compileProcedure, {
        // Clear current FBO
        clear: clear,

        // Short cuts for dynamic variables
        prop: dynamic.define.bind(null, DYN_PROP),
        context: dynamic.define.bind(null, DYN_CONTEXT),
        this: dynamic.define.bind(null, DYN_STATE),

        // executes an empty draw command
        draw: compileProcedure({}),

        // Resources
        buffer: function (options) {
          return bufferState.create(options, GL_ARRAY_BUFFER, false, false)
        },
        elements: function (options) {
          return elementState.create(options, false)
        },
        texture: textureState.create2D,
        cube: textureState.createCube,
        renderbuffer: renderbufferState.create,
        framebuffer: framebufferState.create,
        framebufferCube: framebufferState.createCube,
        vao: attributeState.createVAO,

        // Expose context attributes
        attributes: glAttributes,

        // Frame rendering
        frame: frame,
        on: addListener,

        // System limits
        limits: limits,
        hasExtension: function (name) {
          return limits.extensions.indexOf(name.toLowerCase()) >= 0
        },

        // Read pixels
        read: readPixels,

        // Destroy regl and all associated resources
        destroy: destroy,

        // Direct GL state manipulation
        _gl: gl,
        _refresh: refresh,

        poll: function () {
          poll();
          if (timer) {
            timer.update();
          }
        },

        // Current time
        now: now,

        // regl Statistics Information
        stats: stats$$1
      });

      config.onDone(null, regl);

      return regl
    }

    return wrapREGL;

    })));

    });

    var primitiveQuad_1 = primitiveQuad;

    function primitiveQuad (scale) {
      scale = typeof scale !== 'undefined' ? scale : 1;
      if (!Array.isArray(scale)) {
        scale = [scale, scale];
      }

      var positions = [
        [-scale[0], -scale[1], 0],
        [scale[0], -scale[1], 0],
        [scale[0], scale[1], 0],
        [-scale[0], scale[1], 0]
      ];
      var cells = [
        [0, 1, 2],
        [2, 3, 0]
      ];
      var uvs = [[0, 0], [1, 0], [1, 1], [0, 1]];
      var n = [0, 0, -1];
      var normals = [ n.slice(), n.slice(), n.slice(), n.slice() ];
      return {
        positions: positions,
        cells: cells,
        uvs: uvs,
        normals: normals
      }
    }

    /* MIT license */
    var conversions = {
      rgb2hsl: rgb2hsl,
      rgb2hsv: rgb2hsv,
      rgb2hwb: rgb2hwb,
      rgb2cmyk: rgb2cmyk,
      rgb2keyword: rgb2keyword,
      rgb2xyz: rgb2xyz,
      rgb2lab: rgb2lab,
      rgb2lch: rgb2lch,

      hsl2rgb: hsl2rgb,
      hsl2hsv: hsl2hsv,
      hsl2hwb: hsl2hwb,
      hsl2cmyk: hsl2cmyk,
      hsl2keyword: hsl2keyword,

      hsv2rgb: hsv2rgb,
      hsv2hsl: hsv2hsl,
      hsv2hwb: hsv2hwb,
      hsv2cmyk: hsv2cmyk,
      hsv2keyword: hsv2keyword,

      hwb2rgb: hwb2rgb,
      hwb2hsl: hwb2hsl,
      hwb2hsv: hwb2hsv,
      hwb2cmyk: hwb2cmyk,
      hwb2keyword: hwb2keyword,

      cmyk2rgb: cmyk2rgb,
      cmyk2hsl: cmyk2hsl,
      cmyk2hsv: cmyk2hsv,
      cmyk2hwb: cmyk2hwb,
      cmyk2keyword: cmyk2keyword,

      keyword2rgb: keyword2rgb,
      keyword2hsl: keyword2hsl,
      keyword2hsv: keyword2hsv,
      keyword2hwb: keyword2hwb,
      keyword2cmyk: keyword2cmyk,
      keyword2lab: keyword2lab,
      keyword2xyz: keyword2xyz,

      xyz2rgb: xyz2rgb,
      xyz2lab: xyz2lab,
      xyz2lch: xyz2lch,

      lab2xyz: lab2xyz,
      lab2rgb: lab2rgb,
      lab2lch: lab2lch,

      lch2lab: lch2lab,
      lch2xyz: lch2xyz,
      lch2rgb: lch2rgb
    };


    function rgb2hsl(rgb) {
      var r = rgb[0]/255,
          g = rgb[1]/255,
          b = rgb[2]/255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          delta = max - min,
          h, s, l;

      if (max == min)
        h = 0;
      else if (r == max)
        h = (g - b) / delta;
      else if (g == max)
        h = 2 + (b - r) / delta;
      else if (b == max)
        h = 4 + (r - g)/ delta;

      h = Math.min(h * 60, 360);

      if (h < 0)
        h += 360;

      l = (min + max) / 2;

      if (max == min)
        s = 0;
      else if (l <= 0.5)
        s = delta / (max + min);
      else
        s = delta / (2 - max - min);

      return [h, s * 100, l * 100];
    }

    function rgb2hsv(rgb) {
      var r = rgb[0],
          g = rgb[1],
          b = rgb[2],
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          delta = max - min,
          h, s, v;

      if (max == 0)
        s = 0;
      else
        s = (delta/max * 1000)/10;

      if (max == min)
        h = 0;
      else if (r == max)
        h = (g - b) / delta;
      else if (g == max)
        h = 2 + (b - r) / delta;
      else if (b == max)
        h = 4 + (r - g) / delta;

      h = Math.min(h * 60, 360);

      if (h < 0)
        h += 360;

      v = ((max / 255) * 1000) / 10;

      return [h, s, v];
    }

    function rgb2hwb(rgb) {
      var r = rgb[0],
          g = rgb[1],
          b = rgb[2],
          h = rgb2hsl(rgb)[0],
          w = 1/255 * Math.min(r, Math.min(g, b)),
          b = 1 - 1/255 * Math.max(r, Math.max(g, b));

      return [h, w * 100, b * 100];
    }

    function rgb2cmyk(rgb) {
      var r = rgb[0] / 255,
          g = rgb[1] / 255,
          b = rgb[2] / 255,
          c, m, y, k;

      k = Math.min(1 - r, 1 - g, 1 - b);
      c = (1 - r - k) / (1 - k) || 0;
      m = (1 - g - k) / (1 - k) || 0;
      y = (1 - b - k) / (1 - k) || 0;
      return [c * 100, m * 100, y * 100, k * 100];
    }

    function rgb2keyword(rgb) {
      return reverseKeywords[JSON.stringify(rgb)];
    }

    function rgb2xyz(rgb) {
      var r = rgb[0] / 255,
          g = rgb[1] / 255,
          b = rgb[2] / 255;

      // assume sRGB
      r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
      g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
      b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

      var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
      var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
      var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

      return [x * 100, y *100, z * 100];
    }

    function rgb2lab(rgb) {
      var xyz = rgb2xyz(rgb),
            x = xyz[0],
            y = xyz[1],
            z = xyz[2],
            l, a, b;

      x /= 95.047;
      y /= 100;
      z /= 108.883;

      x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
      y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
      z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

      l = (116 * y) - 16;
      a = 500 * (x - y);
      b = 200 * (y - z);

      return [l, a, b];
    }

    function rgb2lch(args) {
      return lab2lch(rgb2lab(args));
    }

    function hsl2rgb(hsl) {
      var h = hsl[0] / 360,
          s = hsl[1] / 100,
          l = hsl[2] / 100,
          t1, t2, t3, rgb, val;

      if (s == 0) {
        val = l * 255;
        return [val, val, val];
      }

      if (l < 0.5)
        t2 = l * (1 + s);
      else
        t2 = l + s - l * s;
      t1 = 2 * l - t2;

      rgb = [0, 0, 0];
      for (var i = 0; i < 3; i++) {
        t3 = h + 1 / 3 * - (i - 1);
        t3 < 0 && t3++;
        t3 > 1 && t3--;

        if (6 * t3 < 1)
          val = t1 + (t2 - t1) * 6 * t3;
        else if (2 * t3 < 1)
          val = t2;
        else if (3 * t3 < 2)
          val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
        else
          val = t1;

        rgb[i] = val * 255;
      }

      return rgb;
    }

    function hsl2hsv(hsl) {
      var h = hsl[0],
          s = hsl[1] / 100,
          l = hsl[2] / 100,
          sv, v;

      if(l === 0) {
          // no need to do calc on black
          // also avoids divide by 0 error
          return [0, 0, 0];
      }

      l *= 2;
      s *= (l <= 1) ? l : 2 - l;
      v = (l + s) / 2;
      sv = (2 * s) / (l + s);
      return [h, sv * 100, v * 100];
    }

    function hsl2hwb(args) {
      return rgb2hwb(hsl2rgb(args));
    }

    function hsl2cmyk(args) {
      return rgb2cmyk(hsl2rgb(args));
    }

    function hsl2keyword(args) {
      return rgb2keyword(hsl2rgb(args));
    }


    function hsv2rgb(hsv) {
      var h = hsv[0] / 60,
          s = hsv[1] / 100,
          v = hsv[2] / 100,
          hi = Math.floor(h) % 6;

      var f = h - Math.floor(h),
          p = 255 * v * (1 - s),
          q = 255 * v * (1 - (s * f)),
          t = 255 * v * (1 - (s * (1 - f))),
          v = 255 * v;

      switch(hi) {
        case 0:
          return [v, t, p];
        case 1:
          return [q, v, p];
        case 2:
          return [p, v, t];
        case 3:
          return [p, q, v];
        case 4:
          return [t, p, v];
        case 5:
          return [v, p, q];
      }
    }

    function hsv2hsl(hsv) {
      var h = hsv[0],
          s = hsv[1] / 100,
          v = hsv[2] / 100,
          sl, l;

      l = (2 - s) * v;
      sl = s * v;
      sl /= (l <= 1) ? l : 2 - l;
      sl = sl || 0;
      l /= 2;
      return [h, sl * 100, l * 100];
    }

    function hsv2hwb(args) {
      return rgb2hwb(hsv2rgb(args))
    }

    function hsv2cmyk(args) {
      return rgb2cmyk(hsv2rgb(args));
    }

    function hsv2keyword(args) {
      return rgb2keyword(hsv2rgb(args));
    }

    // http://dev.w3.org/csswg/css-color/#hwb-to-rgb
    function hwb2rgb(hwb) {
      var h = hwb[0] / 360,
          wh = hwb[1] / 100,
          bl = hwb[2] / 100,
          ratio = wh + bl,
          i, v, f, n;

      // wh + bl cant be > 1
      if (ratio > 1) {
        wh /= ratio;
        bl /= ratio;
      }

      i = Math.floor(6 * h);
      v = 1 - bl;
      f = 6 * h - i;
      if ((i & 0x01) != 0) {
        f = 1 - f;
      }
      n = wh + f * (v - wh);  // linear interpolation

      switch (i) {
        default:
        case 6:
        case 0: r = v; g = n; b = wh; break;
        case 1: r = n; g = v; b = wh; break;
        case 2: r = wh; g = v; b = n; break;
        case 3: r = wh; g = n; b = v; break;
        case 4: r = n; g = wh; b = v; break;
        case 5: r = v; g = wh; b = n; break;
      }

      return [r * 255, g * 255, b * 255];
    }

    function hwb2hsl(args) {
      return rgb2hsl(hwb2rgb(args));
    }

    function hwb2hsv(args) {
      return rgb2hsv(hwb2rgb(args));
    }

    function hwb2cmyk(args) {
      return rgb2cmyk(hwb2rgb(args));
    }

    function hwb2keyword(args) {
      return rgb2keyword(hwb2rgb(args));
    }

    function cmyk2rgb(cmyk) {
      var c = cmyk[0] / 100,
          m = cmyk[1] / 100,
          y = cmyk[2] / 100,
          k = cmyk[3] / 100,
          r, g, b;

      r = 1 - Math.min(1, c * (1 - k) + k);
      g = 1 - Math.min(1, m * (1 - k) + k);
      b = 1 - Math.min(1, y * (1 - k) + k);
      return [r * 255, g * 255, b * 255];
    }

    function cmyk2hsl(args) {
      return rgb2hsl(cmyk2rgb(args));
    }

    function cmyk2hsv(args) {
      return rgb2hsv(cmyk2rgb(args));
    }

    function cmyk2hwb(args) {
      return rgb2hwb(cmyk2rgb(args));
    }

    function cmyk2keyword(args) {
      return rgb2keyword(cmyk2rgb(args));
    }


    function xyz2rgb(xyz) {
      var x = xyz[0] / 100,
          y = xyz[1] / 100,
          z = xyz[2] / 100,
          r, g, b;

      r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
      g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
      b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

      // assume sRGB
      r = r > 0.0031308 ? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
        : r = (r * 12.92);

      g = g > 0.0031308 ? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
        : g = (g * 12.92);

      b = b > 0.0031308 ? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
        : b = (b * 12.92);

      r = Math.min(Math.max(0, r), 1);
      g = Math.min(Math.max(0, g), 1);
      b = Math.min(Math.max(0, b), 1);

      return [r * 255, g * 255, b * 255];
    }

    function xyz2lab(xyz) {
      var x = xyz[0],
          y = xyz[1],
          z = xyz[2],
          l, a, b;

      x /= 95.047;
      y /= 100;
      z /= 108.883;

      x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
      y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
      z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

      l = (116 * y) - 16;
      a = 500 * (x - y);
      b = 200 * (y - z);

      return [l, a, b];
    }

    function xyz2lch(args) {
      return lab2lch(xyz2lab(args));
    }

    function lab2xyz(lab) {
      var l = lab[0],
          a = lab[1],
          b = lab[2],
          x, y, z, y2;

      if (l <= 8) {
        y = (l * 100) / 903.3;
        y2 = (7.787 * (y / 100)) + (16 / 116);
      } else {
        y = 100 * Math.pow((l + 16) / 116, 3);
        y2 = Math.pow(y / 100, 1/3);
      }

      x = x / 95.047 <= 0.008856 ? x = (95.047 * ((a / 500) + y2 - (16 / 116))) / 7.787 : 95.047 * Math.pow((a / 500) + y2, 3);

      z = z / 108.883 <= 0.008859 ? z = (108.883 * (y2 - (b / 200) - (16 / 116))) / 7.787 : 108.883 * Math.pow(y2 - (b / 200), 3);

      return [x, y, z];
    }

    function lab2lch(lab) {
      var l = lab[0],
          a = lab[1],
          b = lab[2],
          hr, h, c;

      hr = Math.atan2(b, a);
      h = hr * 360 / 2 / Math.PI;
      if (h < 0) {
        h += 360;
      }
      c = Math.sqrt(a * a + b * b);
      return [l, c, h];
    }

    function lab2rgb(args) {
      return xyz2rgb(lab2xyz(args));
    }

    function lch2lab(lch) {
      var l = lch[0],
          c = lch[1],
          h = lch[2],
          a, b, hr;

      hr = h / 360 * 2 * Math.PI;
      a = c * Math.cos(hr);
      b = c * Math.sin(hr);
      return [l, a, b];
    }

    function lch2xyz(args) {
      return lab2xyz(lch2lab(args));
    }

    function lch2rgb(args) {
      return lab2rgb(lch2lab(args));
    }

    function keyword2rgb(keyword) {
      return cssKeywords[keyword];
    }

    function keyword2hsl(args) {
      return rgb2hsl(keyword2rgb(args));
    }

    function keyword2hsv(args) {
      return rgb2hsv(keyword2rgb(args));
    }

    function keyword2hwb(args) {
      return rgb2hwb(keyword2rgb(args));
    }

    function keyword2cmyk(args) {
      return rgb2cmyk(keyword2rgb(args));
    }

    function keyword2lab(args) {
      return rgb2lab(keyword2rgb(args));
    }

    function keyword2xyz(args) {
      return rgb2xyz(keyword2rgb(args));
    }

    var cssKeywords = {
      aliceblue:  [240,248,255],
      antiquewhite: [250,235,215],
      aqua: [0,255,255],
      aquamarine: [127,255,212],
      azure:  [240,255,255],
      beige:  [245,245,220],
      bisque: [255,228,196],
      black:  [0,0,0],
      blanchedalmond: [255,235,205],
      blue: [0,0,255],
      blueviolet: [138,43,226],
      brown:  [165,42,42],
      burlywood:  [222,184,135],
      cadetblue:  [95,158,160],
      chartreuse: [127,255,0],
      chocolate:  [210,105,30],
      coral:  [255,127,80],
      cornflowerblue: [100,149,237],
      cornsilk: [255,248,220],
      crimson:  [220,20,60],
      cyan: [0,255,255],
      darkblue: [0,0,139],
      darkcyan: [0,139,139],
      darkgoldenrod:  [184,134,11],
      darkgray: [169,169,169],
      darkgreen:  [0,100,0],
      darkgrey: [169,169,169],
      darkkhaki:  [189,183,107],
      darkmagenta:  [139,0,139],
      darkolivegreen: [85,107,47],
      darkorange: [255,140,0],
      darkorchid: [153,50,204],
      darkred:  [139,0,0],
      darksalmon: [233,150,122],
      darkseagreen: [143,188,143],
      darkslateblue:  [72,61,139],
      darkslategray:  [47,79,79],
      darkslategrey:  [47,79,79],
      darkturquoise:  [0,206,209],
      darkviolet: [148,0,211],
      deeppink: [255,20,147],
      deepskyblue:  [0,191,255],
      dimgray:  [105,105,105],
      dimgrey:  [105,105,105],
      dodgerblue: [30,144,255],
      firebrick:  [178,34,34],
      floralwhite:  [255,250,240],
      forestgreen:  [34,139,34],
      fuchsia:  [255,0,255],
      gainsboro:  [220,220,220],
      ghostwhite: [248,248,255],
      gold: [255,215,0],
      goldenrod:  [218,165,32],
      gray: [128,128,128],
      green:  [0,128,0],
      greenyellow:  [173,255,47],
      grey: [128,128,128],
      honeydew: [240,255,240],
      hotpink:  [255,105,180],
      indianred:  [205,92,92],
      indigo: [75,0,130],
      ivory:  [255,255,240],
      khaki:  [240,230,140],
      lavender: [230,230,250],
      lavenderblush:  [255,240,245],
      lawngreen:  [124,252,0],
      lemonchiffon: [255,250,205],
      lightblue:  [173,216,230],
      lightcoral: [240,128,128],
      lightcyan:  [224,255,255],
      lightgoldenrodyellow: [250,250,210],
      lightgray:  [211,211,211],
      lightgreen: [144,238,144],
      lightgrey:  [211,211,211],
      lightpink:  [255,182,193],
      lightsalmon:  [255,160,122],
      lightseagreen:  [32,178,170],
      lightskyblue: [135,206,250],
      lightslategray: [119,136,153],
      lightslategrey: [119,136,153],
      lightsteelblue: [176,196,222],
      lightyellow:  [255,255,224],
      lime: [0,255,0],
      limegreen:  [50,205,50],
      linen:  [250,240,230],
      magenta:  [255,0,255],
      maroon: [128,0,0],
      mediumaquamarine: [102,205,170],
      mediumblue: [0,0,205],
      mediumorchid: [186,85,211],
      mediumpurple: [147,112,219],
      mediumseagreen: [60,179,113],
      mediumslateblue:  [123,104,238],
      mediumspringgreen:  [0,250,154],
      mediumturquoise:  [72,209,204],
      mediumvioletred:  [199,21,133],
      midnightblue: [25,25,112],
      mintcream:  [245,255,250],
      mistyrose:  [255,228,225],
      moccasin: [255,228,181],
      navajowhite:  [255,222,173],
      navy: [0,0,128],
      oldlace:  [253,245,230],
      olive:  [128,128,0],
      olivedrab:  [107,142,35],
      orange: [255,165,0],
      orangered:  [255,69,0],
      orchid: [218,112,214],
      palegoldenrod:  [238,232,170],
      palegreen:  [152,251,152],
      paleturquoise:  [175,238,238],
      palevioletred:  [219,112,147],
      papayawhip: [255,239,213],
      peachpuff:  [255,218,185],
      peru: [205,133,63],
      pink: [255,192,203],
      plum: [221,160,221],
      powderblue: [176,224,230],
      purple: [128,0,128],
      rebeccapurple: [102, 51, 153],
      red:  [255,0,0],
      rosybrown:  [188,143,143],
      royalblue:  [65,105,225],
      saddlebrown:  [139,69,19],
      salmon: [250,128,114],
      sandybrown: [244,164,96],
      seagreen: [46,139,87],
      seashell: [255,245,238],
      sienna: [160,82,45],
      silver: [192,192,192],
      skyblue:  [135,206,235],
      slateblue:  [106,90,205],
      slategray:  [112,128,144],
      slategrey:  [112,128,144],
      snow: [255,250,250],
      springgreen:  [0,255,127],
      steelblue:  [70,130,180],
      tan:  [210,180,140],
      teal: [0,128,128],
      thistle:  [216,191,216],
      tomato: [255,99,71],
      turquoise:  [64,224,208],
      violet: [238,130,238],
      wheat:  [245,222,179],
      white:  [255,255,255],
      whitesmoke: [245,245,245],
      yellow: [255,255,0],
      yellowgreen:  [154,205,50]
    };

    var reverseKeywords = {};
    for (var key in cssKeywords) {
      reverseKeywords[JSON.stringify(cssKeywords[key])] = key;
    }

    var convert = function() {
       return new Converter();
    };

    for (var func in conversions) {
      // export Raw versions
      convert[func + "Raw"] =  (function(func) {
        // accept array or plain args
        return function(arg) {
          if (typeof arg == "number")
            arg = Array.prototype.slice.call(arguments);
          return conversions[func](arg);
        }
      })(func);

      var pair = /(\w+)2(\w+)/.exec(func),
          from = pair[1],
          to = pair[2];

      // export rgb2hsl and ["rgb"]["hsl"]
      convert[from] = convert[from] || {};

      convert[from][to] = convert[func] = (function(func) { 
        return function(arg) {
          if (typeof arg == "number")
            arg = Array.prototype.slice.call(arguments);
          
          var val = conversions[func](arg);
          if (typeof val == "string" || val === undefined)
            return val; // keyword

          for (var i = 0; i < val.length; i++)
            val[i] = Math.round(val[i]);
          return val;
        }
      })(func);
    }


    /* Converter does lazy conversion and caching */
    var Converter = function() {
       this.convs = {};
    };

    /* Either get the values for a space or
      set the values for a space, depending on args */
    Converter.prototype.routeSpace = function(space, args) {
       var values = args[0];
       if (values === undefined) {
          // color.rgb()
          return this.getValues(space);
       }
       // color.rgb(10, 10, 10)
       if (typeof values == "number") {
          values = Array.prototype.slice.call(args);        
       }

       return this.setValues(space, values);
    };
      
    /* Set the values for a space, invalidating cache */
    Converter.prototype.setValues = function(space, values) {
       this.space = space;
       this.convs = {};
       this.convs[space] = values;
       return this;
    };

    /* Get the values for a space. If there's already
      a conversion for the space, fetch it, otherwise
      compute it */
    Converter.prototype.getValues = function(space) {
       var vals = this.convs[space];
       if (!vals) {
          var fspace = this.space,
              from = this.convs[fspace];
          vals = convert[fspace][space](from);

          this.convs[space] = vals;
       }
      return vals;
    };

    ["rgb", "hsl", "hsv", "cmyk", "keyword"].forEach(function(space) {
       Converter.prototype[space] = function(vals) {
          return this.routeSpace(space, arguments);
       };
    });

    var colorConvert = convert;

    var parseColor = function (cstr) {
        var m, conv, parts, alpha;
        if (m = /^((?:rgb|hs[lv]|cmyk|xyz|lab)a?)\s*\(([^\)]*)\)/.exec(cstr)) {
            var name = m[1];
            var base = name.replace(/a$/, '');
            var size = base === 'cmyk' ? 4 : 3;
            conv = colorConvert[base];
            
            parts = m[2].replace(/^\s+|\s+$/g, '')
                .split(/\s*,\s*/)
                .map(function (x, i) {
                    if (/%$/.test(x) && i === size) {
                        return parseFloat(x) / 100;
                    }
                    else if (/%$/.test(x)) {
                        return parseFloat(x);
                    }
                    return parseFloat(x);
                })
            ;
            if (name === base) parts.push(1);
            alpha = parts[size] === undefined ? 1 : parts[size];
            parts = parts.slice(0, size);
            
            conv[base] = function () { return parts };
        }
        else if (/^#[A-Fa-f0-9]+$/.test(cstr)) {
            var base = cstr.replace(/^#/,'');
            var size = base.length;
            conv = colorConvert.rgb;
            parts = base.split(size === 3 ? /(.)/ : /(..)/);
            parts = parts.filter(Boolean)
                .map(function (x) {
                    if (size === 3) {
                        return parseInt(x + x, 16);
                    }
                    else {
                        return parseInt(x, 16)
                    }
                })
            ;
            alpha = 1;
            conv.rgb = function () { return parts };
            if (!parts[0]) parts[0] = 0;
            if (!parts[1]) parts[1] = 0;
            if (!parts[2]) parts[2] = 0;
        }
        else {
            conv = colorConvert.keyword;
            conv.keyword = function () { return cstr };
            parts = cstr;
            alpha = 1;
        }
        
        var res = {
            rgb: undefined,
            hsl: undefined,
            hsv: undefined,
            cmyk: undefined,
            keyword: undefined,
            hex: undefined
        };
        try { res.rgb = conv.rgb(parts); } catch (e) {}
        try { res.hsl = conv.hsl(parts); } catch (e) {}
        try { res.hsv = conv.hsv(parts); } catch (e) {}
        try { res.cmyk = conv.cmyk(parts); } catch (e) {}
        try { res.keyword = conv.keyword(parts); } catch (e) {}
        
        if (res.rgb) res.hex = '#' + res.rgb.map(function (x) {
            var s = x.toString(16);
            if (s.length === 1) return '0' + s;
            return s;
        }).join('');
        
        if (res.rgb) res.rgba = res.rgb.concat(alpha);
        if (res.hsl) res.hsla = res.hsl.concat(alpha);
        if (res.hsv) res.hsva = res.hsv.concat(alpha);
        if (res.cmyk) res.cmyka = res.cmyk.concat(alpha);
        
        return res;
    };

    var shader = createShader;

    function createShader (opt) {
      opt = opt || {};
      if (!opt.gl) {
        throw new Error('Must specify { context: "webgl" } in sketch settings, or a WebGL-enabled canvas');
      }

      var gl = opt.gl;
      var reglOpts = { gl: gl };

      // regl is strict on what options you pass in
      if (typeof opt.extensions !== 'undefined') reglOpts.extensions = opt.extensions;
      if (typeof opt.optionalExtensions !== 'undefined') reglOpts.optionalExtensions = opt.optionalExtensions;
      if (typeof opt.profile !== 'undefined') reglOpts.profile = opt.profile;
      if (typeof opt.onDone !== 'undefined') reglOpts.onDone = opt.onDone;

      // Create regl for handling GL stuff
      var regl$1 = regl(reglOpts);

      // A mesh for a flat plane
      var quad = primitiveQuad_1();

      var textureMap = new Map();

      // Wire up user uniforms nicely
      var uniformsMap = opt.uniforms || {};
      var uniforms = Object.assign({}, uniformsMap);
      Object.keys(uniformsMap).forEach(function (key) {
        var value = uniformsMap[key];
        if (typeof value === 'function') {
          uniforms[key] = function (state, props, batchID) {
            var result = value.call(uniformsMap, props, batchID);
            // If user is using a function to wrap an image,
            // then we need to make sure we re-upload to same GL texture
            if (isTextureLike(result)) {
              if (textureMap.has(value)) {
                // Texture is already created, re-upload
                var prevTex = textureMap.get(value);
                prevTex(result);

                // Return the texture
                result = prevTex;
              } else {
                // Creating the texture for the first time
                var texture = regl$1.texture(result);
                textureMap.set(value, texture);

                // Return the texture, not the image
                result = texture;
              }
            }
            return result;
          };
        } else if (isTextureLike(value)) {
          uniforms[key] = regl$1.texture(value);
        } else {
          uniforms[key] = value;
        }
      });

      // Get the drawing command
      var drawQuadCommand;
      try {
        drawQuadCommand = createDrawQuad();
      } catch (err) {
        handleError(err);
      }

      // Nicely get a clear color for the canvas
      var clearColor = defined(opt.clearColor, 'black');
      if (typeof clearColor === 'string') {
        var parsed = parseColor(clearColor);
        if (!parsed.rgb) {
          throw new Error('Error parsing { clearColor } color string "' + clearColor + '"');
        }
        clearColor = parsed.rgb.slice(0, 3).map(function (n) {
          return n / 255;
        });
      } else if (clearColor && (!Array.isArray(clearColor) || clearColor.length < 3)) {
        throw new Error('Error with { clearColor } option, must be a string or [ r, g, b ] float array');
      }

      var clearAlpha = defined(opt.clearAlpha, 1);
      var clear = clearColor ? clearColor.concat([ clearAlpha || 0 ]) : false;

      // Return a renderer object
      return {
        render: function (props) {
          // On each tick, update regl timers and sizes
          regl$1.poll();

          // Clear backbuffer with color
          if (clear) {
            regl$1.clear({
              color: clear,
              depth: 1,
              stencil: 0
            });
          }

          // Submit draw command
          drawQuad(props);

          // Flush pending GL calls for this frame
          gl.flush();
        },
        regl: regl$1,
        drawQuad: drawQuad,
        unload: function () {
          // Remove GL texture mappings
          textureMap.clear();
          // Unload the current regl instance
          // TODO: We should probably also destroy textures created from this module!
          regl$1.destroy();
        }
      };

      // A user-friendly draw command that spits out errors
      function drawQuad (props) {
        props = props || {};
        // Draw generative / shader art
        if (drawQuadCommand) {
          try {
            drawQuadCommand(props);
          } catch (err) {
            if (handleError(err)) {
              if (props == null) {
                console.warn('Warning: shader.render() is not called with any "props" parameter');
              }
            }
          }
        }
      }

      // Draw command
      function createDrawQuad () {
        return regl$1({
          scissor: opt.scissor ? {
            enable: true,
            box: {
              x: regl$1.prop('scissorX'),
              y: regl$1.prop('scissorY'),
              width: regl$1.prop('scissorWidth'),
              height: regl$1.prop('scissorHeight')
            }
          } : false,
          // Pass down props from javascript
          uniforms: uniforms,
          // Fall back to a simple fragment shader
          frag: opt.frag || [
            'precision highp float;',
            '',
            'void main () {',
            '  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);',
            '}'
          ].join('\n'),
          // Fall back to a simple vertex shader
          vert: opt.vert || [
            'precision highp float;',
            'attribute vec3 position;',
            'varying vec2 vUv;',
            '',
            'void main () {',
            '  gl_Position = vec4(position.xyz, 1.0);',
            '  vUv = gl_Position.xy * 0.5 + 0.5;',
            '}'
          ].join('\n'),
          // Setup transparency blending
          blend: opt.blend !== false ? {
            enable: true,
            func: {
              srcRGB: 'src alpha',
              srcAlpha: 1,
              dstRGB: 'one minus src alpha',
              dstAlpha: 1
            }
          } : undefined,
          // Send mesh vertex attributes to shader
          attributes: {
            position: quad.positions
          },
          // The indices for the quad mesh
          elements: quad.cells
        });
      }

      function handleError (err) {
        if (/^\(regl\)/.test(err.message)) {
          // Regl already logs a message to the console :\
          // so let's just avoid re-printing the same thing
          return true;
        } else {
          throw err;
        }
      }
    }

    function isTextureLike (data) {
      return data && !Array.isArray(data) && typeof data === 'object';
    }

    var shaderString$1 = "precision highp float;\n\nuniform float time;\nuniform vec2 renderSize;\n\nuniform float innerSize;\nuniform float outerSize;\nuniform float wobbleShape1;\nuniform float wobbleFactor1;\nuniform float wobbleShape2;\nuniform float wobbleFactor2;\nuniform vec4 centerColor;\nuniform vec4 color1;\nuniform vec4 color2;\nuniform vec4 color3;\nuniform vec4 backgroundColor;\n\nvarying vec2 vUv;\n\nconst float smoothing = 0.005;\nconst int layerCount = 12;\nconst int colorCount = 3;\nconst float wobbleMotion1 = 1.0;\nconst float wobbleMotion2 = -1.0;\n\nfloat incrementalMask(float r, float theta, float threshold) {\n    float borderOffset1 = sin(theta * floor(wobbleShape1) + wobbleMotion1 * time) * wobbleFactor1;\n    float borderOffset2 = sin(theta * floor(wobbleShape2) + wobbleMotion2 * time) * wobbleFactor2;\n    float border = threshold + borderOffset1 + borderOffset2;\n    return smoothstep(border + smoothing / 2., border - smoothing / 2., r);\n}\n\nvec4 blend(vec4 top, vec4 bottom) {\n    return vec4(mix(bottom.rgb, top.rgb, top.a), bottom.a);\n}\n\nvoid main()\t{\n\tfloat aspectRatio = float(renderSize.x) / float(renderSize.y);\n\tvec2 uv = vUv;\n\tuv = uv * 2.0 - 1.;\n\tuv.x *= aspectRatio;\n\n    float r = sqrt(uv.x * uv.x + uv.y * uv.y);\n    float theta = atan(uv.y, uv.x);\n\n    vec4 color = backgroundColor;\n    for (int layer = layerCount; layer >= 0; layer -= 1) {\n        float layerSize = (outerSize - innerSize) / float(layerCount);\n        float mask = incrementalMask(r, theta, float(layer) * layerSize + innerSize);\n        int layerDegree = int(mod(float(layer), float(colorCount)));\n        vec3 currentColor = (layerDegree == 0) ? color3.rgb : ((layerDegree == 1) ? color1.rgb : color2.rgb);\n        currentColor = (layer == 0) ? centerColor.rgb : currentColor;\n        color = blend(vec4(currentColor, mask), color);\n    }\n\t\n\tgl_FragColor = color;\n}\n";

    var presetsObject$1 = {
    	"A Friendly Visitor": {
    	innerSize: 0.35,
    	outerSize: 0.7,
    	wobbleShape1: 7,
    	wobbleFactor1: 0.05,
    	wobbleShape2: 3,
    	wobbleFactor2: 0.1,
    	centerColor: "#000000",
    	color1: "#ffffff",
    	color2: "#ffffff",
    	color3: "#000000",
    	backgroundColor: "#ff8585"
    },
    	"Don't Fall In": {
    	innerSize: 0.2,
    	outerSize: 0.9,
    	wobbleShape1: 10,
    	wobbleFactor1: 0.06,
    	wobbleShape2: 4,
    	wobbleFactor2: 0.07,
    	centerColor: "#042f2a",
    	color1: "#008f7e",
    	color2: "#3bcebd",
    	color3: "#042f2a",
    	backgroundColor: "#b3fff6"
    },
    	"Foldable Flavors": {
    	innerSize: 0.3,
    	outerSize: 0.8,
    	wobbleShape1: 7,
    	wobbleFactor1: 0.05,
    	wobbleShape2: 9,
    	wobbleFactor2: 0.02,
    	centerColor: "#1db408",
    	color1: "#f3ff4d",
    	color2: "#f13c01",
    	color3: "#883a21",
    	backgroundColor: "#d9f5d6"
    }
    };

    /** Imports assume file is contained within Sketches **/

    class FloppyDisk extends Sketch {
        name = 'Floppy Disk';
        type = SketchType.Shader;
        date = new Date('4/08/22');
        description = `
        A wobbly warpy floppy disk. Ported over to Sketchbook from the <a href="https://editor.isf.video/shaders/62506e017917e40014095a49">original version</a> on ISF.video.
    `;

        settings = {
            context: 'webgl',
            scaleToView: true,
            animate: true
        };
        bundledPresets = presetsObject$1;

        params = {
            innerSize: new FloatParam('Inner Size', 0.3, 0.0, 1.0),
            outerSize: new FloatParam('Outer Size', 0.8, 0.0, 1.0),
            wobbleShape1: new FloatParam('Shape 1', 5.0, 3.0, 10.0, 1.0),
            wobbleFactor1: new FloatParam('Factor 1', 0.02, 0.0, 0.2),
            wobbleShape2: new FloatParam('Shape 2', 8.0, 3.0, 10.0, 1.0),
            wobbleFactor2: new FloatParam('Factor 2', 0.02, 0.0, 0.2),
            centerColor: new ColorParam('Center Color', '#431F0E'),
            color1: new ColorParam('Color 1', '#CC8154'),
            color2: new ColorParam('Color 2', '#96542E'),
            color3: new ColorParam('Color 3', '#622E0F'),
            backgroundColor: new ColorParam('BG Color', '#431F0E'),
        };

        sketchFn = ({ gl }) => {
            const frag = shaderString$1;
            return shader({
                gl,
                frag,
                uniforms: {
                    time: ({ time }) => time,
                    renderSize: ({}) => [window.innerWidth, window.innerHeight],
                    innerSize: ({}) => this.params.innerSize.value,
                    outerSize: ({}) => this.params.outerSize.value,
                    wobbleShape1: ({}) => this.params.wobbleShape1.value,
                    wobbleFactor1: ({}) => this.params.wobbleFactor1.value,
                    wobbleShape2: ({}) => this.params.wobbleShape2.value,
                    wobbleFactor2: ({}) => this.params.wobbleFactor2.value,
                    centerColor: ({}) => this.params.centerColor.vec4,
                    color1: ({}) => this.params.color1.vec4,
                    color2: ({}) => this.params.color2.vec4,
                    color3: ({}) => this.params.color3.vec4,
                    backgroundColor: ({}) => this.params.backgroundColor.vec4
                }
            });
        };
    }

    var shaderString = "precision highp float;\n\nuniform float time;\nuniform vec2 resolution;\n\nuniform float zoom;\nuniform vec2 renderOffset;\nuniform float colorCycles;\n\nvarying vec2 vUv;\n\nconst float PI = 3.1415926535897932384626433832795;\nconst int interationSize = 300;\nconst vec2 zoomBounds = vec2(-1.0, 12.0);\nconst float timeMultiplier = -18.0;\n\nvec3 hsv(float h, float s, float v) {\n    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n    vec3 p = abs(fract(vec3(h) + K.xyz) * 6.0 - K.www);\n    return v * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), s);\n}\n\n// References:\n// - https://en.wikibooks.org/wiki/Fractals/shadertoy#Mandelbrot_set\n// - https://www.codingame.com/playgrounds/2358/how-to-plot-the-mandelbrot-set/adding-some-colors\nfloat mandelbrot(vec2 c) {\n    vec2 z = vec2(0.0);\n    int escapeTime = 0;\n    float sqrZ = 0.0;\n    for (int i = 0; i < interationSize; i++) {\n        sqrZ = z.x * z.x + z.y * z.y;\n        if (sqrZ >= 4.) break;\n        z = vec2(z.x * z.x - z.y * z.y, 2. * z.x * z.y) + c;\n        escapeTime += 1;\n    }\n\n    if (escapeTime == interationSize) {\n        return float(interationSize);\n    } else {\n        return float(escapeTime) + 1.0 - log(log2(sqrt(sqrZ)));\n    }\n}\n\nvoid main(void) {\n    vec2 c = vUv;\n\n    // Normalize coordinates\n    c = c * 2. - 1.0;\n    c.x *= resolution.x / resolution.y;\n\n    // Zoom in\n    float zoomGenerator = zoom;\n    float zoomLevel = (zoomBounds.y - zoomBounds.x) * zoomGenerator + zoomBounds.x;\n    c = c / pow(2.0, zoomLevel);\n    c += renderOffset;\n\n    // Calculate Mandelbrot color\n    float escapeTime = mandelbrot(c);\n    float escapeModulator = float(interationSize) / colorCycles;\n    vec3 color = hsv(mod(escapeTime, escapeModulator) / escapeModulator + time / timeMultiplier, 1.0, 0.95);\n    if (escapeTime == float(interationSize)) gl_FragColor = vec4(vec3(0.0), 1.0);\n    else gl_FragColor = vec4(color, 1.0);\n}\n";

    var Glowflake = {
    	zoom: 0.5,
    	xOffset: 0.14,
    	yOffset: 0.65,
    	colorCycles: 8
    };
    var presetsObject = {
    	"Bloom Boom": {
    	zoom: 0.64,
    	xOffset: -0.22,
    	yOffset: 0.65,
    	colorCycles: 4
    },
    	Glowflake: Glowflake,
    	"Dragon's Salute": {
    	zoom: 0.73,
    	xOffset: -0.02,
    	yOffset: 0.71,
    	colorCycles: 2
    },
    	"Somewhere Between": {
    	zoom: 0.79,
    	xOffset: -0.69,
    	yOffset: 0.38,
    	colorCycles: 90.52
    },
    	"Porous Another": {
    	zoom: 0.82,
    	xOffset: 0.33,
    	yOffset: -0.04,
    	colorCycles: 28
    }
    };

    /** Imports assume file is contained within Sketches **/

    class Mandelbrot extends Sketch {
        name = "Mandelbrot Set";
        type = SketchType.Shader;
        date = new Date("9/29/22");
        description = `
        Standard Mandelbrot fare, with basic navigation and a little bit extra. Look, a rainbow! 
    `
        bundledPresets = presetsObject;

        settings = {
            context: 'webgl',
            scaleToView: true,
            animate: true
        };

        params = {
            zoom: new FloatParam('Zoom', 0.07, 0, 1),
            xOffset: new FloatParam('X Offset', -0.7, -1, 1),
            yOffset: new FloatParam('Y Offset', 0.0, -1, 1),
            colorCycles: new FloatParam('Color Cycles', 42, 1, 100),
        };

        sketchFn = ({ gl }) => {
            const frag = shaderString;
            return shader({
                gl,
                frag,
                uniforms: {
                    time: ({ time }) => time,
                    resolution: ({}) => [window.innerWidth, window.innerHeight],
                    zoom: () => this.params.zoom.value,
                    renderOffset: () => [this.params.xOffset.value, this.params.yOffset.value],
                    colorCycles: () => this.params.colorCycles.value,
                }
            });
        };
    }

    const sketches = [
        new Mandelbrot(),
        new Rectilinear(),
        new NoSignal(),
        new FloppyDisk(),
    ];

    /* src/App.svelte generated by Svelte v3.49.0 */
    const file = "src/App.svelte";

    // (76:8) 
    function create_left_slot(ctx) {
    	let span;
    	let leftpanel;
    	let current;

    	leftpanel = new LeftPanel({
    			props: {
    				sketches,
    				selected: /*currentSketch*/ ctx[1]
    			},
    			$$inline: true
    		});

    	leftpanel.$on("selection", /*sketchSelection*/ ctx[3]);

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(leftpanel.$$.fragment);
    			attr_dev(span, "slot", "left");
    			add_location(span, file, 75, 8, 2921);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(leftpanel, span, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const leftpanel_changes = {};
    			if (dirty & /*currentSketch*/ 2) leftpanel_changes.selected = /*currentSketch*/ ctx[1];
    			leftpanel.$set(leftpanel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(leftpanel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(leftpanel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			destroy_component(leftpanel);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_left_slot.name,
    		type: "slot",
    		source: "(76:8) ",
    		ctx
    	});

    	return block;
    }

    // (83:8) 
    function create_right_slot(ctx) {
    	let span;
    	let rightpanel;
    	let current;

    	rightpanel = new RightPanel({
    			props: { sketch: /*currentSketch*/ ctx[1] },
    			$$inline: true
    		});

    	rightpanel.$on("update", /*update*/ ctx[4]);

    	const block = {
    		c: function create() {
    			span = element("span");
    			create_component(rightpanel.$$.fragment);
    			attr_dev(span, "slot", "right");
    			add_location(span, file, 82, 8, 3126);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			mount_component(rightpanel, span, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rightpanel_changes = {};
    			if (dirty & /*currentSketch*/ 2) rightpanel_changes.sketch = /*currentSketch*/ ctx[1];
    			rightpanel.$set(rightpanel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rightpanel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rightpanel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			destroy_component(rightpanel);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_right_slot.name,
    		type: "slot",
    		source: "(83:8) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let viewer;
    	let current;

    	let viewer_props = {
    		sketch: /*currentSketch*/ ctx[1],
    		directLink: /*initialDirectLink*/ ctx[2],
    		$$slots: {
    			right: [create_right_slot],
    			left: [create_left_slot]
    		},
    		$$scope: { ctx }
    	};

    	viewer = new Viewer({ props: viewer_props, $$inline: true });
    	/*viewer_binding*/ ctx[5](viewer);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(viewer.$$.fragment);
    			attr_dev(main, "class", "svelte-44v59k");
    			add_location(main, file, 73, 0, 2811);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(viewer, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const viewer_changes = {};
    			if (dirty & /*currentSketch*/ 2) viewer_changes.sketch = /*currentSketch*/ ctx[1];
    			if (dirty & /*initialDirectLink*/ 4) viewer_changes.directLink = /*initialDirectLink*/ ctx[2];

    			if (dirty & /*$$scope, currentSketch*/ 258) {
    				viewer_changes.$$scope = { dirty, ctx };
    			}

    			viewer.$set(viewer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(viewer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(viewer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			/*viewer_binding*/ ctx[5](null);
    			destroy_component(viewer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let viewerComponent;
    	let currentSketch;

    	// Select sketch on page load, and on hash change (fwd/back nav etc)
    	let initialDirectLink = false;

    	loadInitialSketch();
    	window.onhashchange = loadInitialSketch;

    	// Restore state for all loaded sketches
    	sketches.forEach(sketch => {
    		sketch.restoreParamValues();
    		sketch.restorePresets();
    	});

    	// Select directly linked sketch OR last viewed sketch
    	function loadInitialSketch() {
    		const normalizeString = input => {
    			let output = input.toLowerCase();
    			output = output.replace(/\s+/g, '');
    			output = output.replace(/-+/g, '');
    			output = output.replace(/_+/g, '');
    			return output;
    		};

    		const normalizedLinkName = window.location.hash
    		? normalizeString(window.location.hash.substring(1))
    		: undefined;

    		if (normalizedLinkName) $$invalidate(2, initialDirectLink = true);
    		const storedName = localStorage.getItem('currentSketchName');
    		const normalizedStoredName = storedName ? normalizeString(storedName) : undefined;
    		let linkedIndex, storedIndex, firstNonWIPIndex;

    		sketches.forEach((sketch, currentIndex) => {
    			const normalizedSketchName = normalizeString(sketch.name);
    			if (normalizedSketchName === normalizedLinkName) linkedIndex = currentIndex;
    			if (normalizedSketchName === normalizedStoredName) storedIndex = currentIndex;
    			if (sketch.date && firstNonWIPIndex == undefined) firstNonWIPIndex = currentIndex;
    		});

    		const sketchToLoadIndex = linkedIndex ?? storedIndex ?? firstNonWIPIndex;
    		selectSketch(sketches[sketchToLoadIndex]);
    	}

    	// Select sketch and update local state, navigation, etc.
    	function selectSketch(selectedSketch) {
    		if (selectedSketch != currentSketch) {
    			$$invalidate(1, currentSketch = selectedSketch);
    			localStorage.setItem('currentSketchName', currentSketch.name);
    			document.title = currentSketch.name;
    			const hashName = '#' + currentSketch.name.toLowerCase().replace(/\s+/g, '-');
    			location.hash = hashName;
    		}
    	}

    	function sketchSelection(event) {
    		const selectedSketch = event.detail.sketch;
    		selectSketch(selectedSketch);
    	}

    	function update(event) {
    		if (!event.detail || !event.detail.incomplete) {
    			currentSketch.storeParamValues();
    			currentSketch.updatePresetModified();
    		}

    		viewerComponent.update();
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function viewer_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			viewerComponent = $$value;
    			$$invalidate(0, viewerComponent);
    		});
    	}

    	$$self.$capture_state = () => ({
    		Viewer,
    		LeftPanel,
    		RightPanel,
    		sketches,
    		viewerComponent,
    		currentSketch,
    		initialDirectLink,
    		loadInitialSketch,
    		selectSketch,
    		sketchSelection,
    		update
    	});

    	$$self.$inject_state = $$props => {
    		if ('viewerComponent' in $$props) $$invalidate(0, viewerComponent = $$props.viewerComponent);
    		if ('currentSketch' in $$props) $$invalidate(1, currentSketch = $$props.currentSketch);
    		if ('initialDirectLink' in $$props) $$invalidate(2, initialDirectLink = $$props.initialDirectLink);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		viewerComponent,
    		currentSketch,
    		initialDirectLink,
    		sketchSelection,
    		update,
    		viewer_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var app = new App({
        target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
