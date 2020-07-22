!(function (t) {
  var e = {};
  function s(n) {
    if (e[n]) return e[n].exports;
    var i = (e[n] = { i: n, l: !1, exports: {} });
    return t[n].call(i.exports, i, i.exports, s), (i.l = !0), i.exports;
  }
  (s.m = t),
    (s.c = e),
    (s.d = function (t, e, n) {
      s.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: n });
    }),
    (s.r = function (t) {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(t, '__esModule', { value: !0 });
    }),
    (s.t = function (t, e) {
      if ((1 & e && (t = s(t)), 8 & e)) return t;
      if (4 & e && 'object' == typeof t && t && t.__esModule) return t;
      var n = Object.create(null);
      if (
        (s.r(n),
        Object.defineProperty(n, 'default', { enumerable: !0, value: t }),
        2 & e && 'string' != typeof t)
      )
        for (var i in t)
          s.d(
            n,
            i,
            function (e) {
              return t[e];
            }.bind(null, i)
          );
      return n;
    }),
    (s.n = function (t) {
      var e =
        t && t.__esModule
          ? function () {
              return t.default;
            }
          : function () {
              return t;
            };
      return s.d(e, 'a', e), e;
    }),
    (s.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }),
    (s.p = ''),
    s((s.s = 2));
})({
  2: function (t, e, s) {
    'use strict';
    s.r(e);
    function n(t, e, s, n) {
      var i,
        r = arguments.length,
        o = r < 3 ? e : null === n ? (n = Object.getOwnPropertyDescriptor(e, s)) : n;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        o = Reflect.decorate(t, e, s, n);
      else
        for (var a = t.length - 1; a >= 0; a--)
          (i = t[a]) && (o = (r < 3 ? i(o) : r > 3 ? i(e, s, o) : i(e, s)) || o);
      return r > 3 && o && Object.defineProperty(e, s, o), o;
    }
    Object.create;
    Object.create;
    class i {
      constructor(t = {}, e) {
        (this.opts = t),
          (this.parent = e),
          (this.providerMap = new WeakMap()),
          this.opts.bootstrap && this.opts.bootstrap.forEach((t) => this.get(t));
      }
      has(t) {
        return !!this.providerMap.has(t) || (!!this.parent && this.parent.has(t));
      }
      get(t) {
        if (this.providerMap.has(t)) return this.providerMap.get(t);
        let e = this.resolve(t);
        return this.providerMap.set(t, e), e;
      }
      create(t) {
        return new t(...(t.deps || []).map((t) => this.get(t)));
      }
      resolve(t) {
        const e = this.findProvider(t);
        return e
          ? this.create(e.use)
          : this.parent &&
            ((function (t) {
              return t.provideInRoot || !1;
            })(t) ||
              this.parent.has(t))
          ? this.parent.get(t)
          : this.create(t);
      }
      findProvider(t) {
        if (this.opts.providers) return this.opts.providers.find((e) => e.provide === t);
      }
    }
    let r;
    function o() {
      return (
        r ||
        (function (t = []) {
          return (r = new i({ providers: t })), r;
        })()
      );
    }
    class a {
      constructor(t) {
        (this.listeners = []), (this.currentState = t);
      }
      get value() {
        return this.currentState;
      }
      setValue(t) {
        return Promise.resolve(t).then((t) => {
          (this.currentState = t), this.listeners.forEach((t) => t(this.value));
        });
      }
      patchValue(t) {
        return Promise.resolve(t).then((e) => {
          try {
            this.setValue({ ...this.value, ...e });
          } catch (e) {
            throw new Error('cannot patch state that is of type ' + typeof t);
          }
        });
      }
      onChange(t) {
        return (
          this.listeners.push(t),
          () => {
            this.listeners = this.listeners.filter((e) => e !== t);
          }
        );
      }
    }
    function l(t = {}) {
      return function (e) {
        Object.defineProperty(e, 'componentDef', { get: () => t });
      };
    }
    function h(t) {
      return function (e, s) {
        Object.defineProperty(e, s, {
          get() {
            return this.injector.get(t);
          },
        });
      };
    }
    class u extends HTMLElement {
      constructor() {
        super(), (this.componentDef = this.constructor.componentDef || {});
        const t = this.componentDef.state,
          e = this.componentDef.providers || [];
        this.injector = new i(
          {
            providers: e.concat([
              {
                provide: a,
                use: class extends a {
                  constructor() {
                    super(t);
                  }
                },
              },
            ]),
            bootstrap: e.map((t) => t.provide),
          },
          o()
        );
      }
      connectedCallback() {
        const t = this.constructor.handlers || {};
        const e = this.injector.get(a),
          s = {
            state: e.value,
            run: (e, s) => (n) => {
              e in t &&
                t[e].forEach((t) => {
                  this[t].call(this, n, s);
                });
            },
            dispatch: (t, e) => () => {
              this.dispatchEvent(new CustomEvent(t, e));
            },
            host: this,
          },
          n = (t) => {
            (s.state = t), this.componentDef.render && this.componentDef.render(s);
          };
        n(e.value),
          e.onChange((t) => {
            n(t);
          });
      }
    }
    function c(t, e) {
      void 0 === e && (e = {});
      for (
        var s = (function (t) {
            for (var e = [], s = 0; s < t.length; ) {
              var n = t[s];
              if ('*' !== n && '+' !== n && '?' !== n)
                if ('\\' !== n)
                  if ('{' !== n)
                    if ('}' !== n)
                      if (':' !== n)
                        if ('(' !== n) e.push({ type: 'CHAR', index: s, value: t[s++] });
                        else {
                          var i = 1,
                            r = '';
                          if ('?' === t[(a = s + 1)])
                            throw new TypeError('Pattern cannot start with "?" at ' + a);
                          for (; a < t.length; )
                            if ('\\' !== t[a]) {
                              if (')' === t[a]) {
                                if (0 === --i) {
                                  a++;
                                  break;
                                }
                              } else if ('(' === t[a] && (i++, '?' !== t[a + 1]))
                                throw new TypeError('Capturing groups are not allowed at ' + a);
                              r += t[a++];
                            } else r += t[a++] + t[a++];
                          if (i) throw new TypeError('Unbalanced pattern at ' + s);
                          if (!r) throw new TypeError('Missing pattern at ' + s);
                          e.push({ type: 'PATTERN', index: s, value: r }), (s = a);
                        }
                      else {
                        for (var o = '', a = s + 1; a < t.length; ) {
                          var l = t.charCodeAt(a);
                          if (
                            !(
                              (l >= 48 && l <= 57) ||
                              (l >= 65 && l <= 90) ||
                              (l >= 97 && l <= 122) ||
                              95 === l
                            )
                          )
                            break;
                          o += t[a++];
                        }
                        if (!o) throw new TypeError('Missing parameter name at ' + s);
                        e.push({ type: 'NAME', index: s, value: o }), (s = a);
                      }
                    else e.push({ type: 'CLOSE', index: s, value: t[s++] });
                  else e.push({ type: 'OPEN', index: s, value: t[s++] });
                else e.push({ type: 'ESCAPED_CHAR', index: s++, value: t[s++] });
              else e.push({ type: 'MODIFIER', index: s, value: t[s++] });
            }
            return e.push({ type: 'END', index: s, value: '' }), e;
          })(t),
          n = e.prefixes,
          i = void 0 === n ? './' : n,
          r = '[^' + d(e.delimiter || '/#?') + ']+?',
          o = [],
          a = 0,
          l = 0,
          h = '',
          u = function (t) {
            if (l < s.length && s[l].type === t) return s[l++].value;
          },
          c = function (t) {
            var e = u(t);
            if (void 0 !== e) return e;
            var n = s[l],
              i = n.type,
              r = n.index;
            throw new TypeError('Unexpected ' + i + ' at ' + r + ', expected ' + t);
          },
          p = function () {
            for (var t, e = ''; (t = u('CHAR') || u('ESCAPED_CHAR')); ) e += t;
            return e;
          };
        l < s.length;

      ) {
        var f = u('CHAR'),
          m = u('NAME'),
          v = u('PATTERN');
        if (m || v) {
          var g = f || '';
          -1 === i.indexOf(g) && ((h += g), (g = '')),
            h && (o.push(h), (h = '')),
            o.push({
              name: m || a++,
              prefix: g,
              suffix: '',
              pattern: v || r,
              modifier: u('MODIFIER') || '',
            });
        } else {
          var _ = f || u('ESCAPED_CHAR');
          if (_) h += _;
          else if ((h && (o.push(h), (h = '')), u('OPEN'))) {
            g = p();
            var x = u('NAME') || '',
              y = u('PATTERN') || '',
              E = p();
            c('CLOSE'),
              o.push({
                name: x || (y ? a++ : ''),
                pattern: x && !y ? r : y,
                prefix: g,
                suffix: E,
                modifier: u('MODIFIER') || '',
              });
          } else c('END');
        }
      }
      return o;
    }
    function p(t, e) {
      var s = [];
      return (function (t, e, s) {
        void 0 === s && (s = {});
        var n = s.decode,
          i =
            void 0 === n
              ? function (t) {
                  return t;
                }
              : n;
        return function (s) {
          var n = t.exec(s);
          if (!n) return !1;
          for (
            var r = n[0],
              o = n.index,
              a = Object.create(null),
              l = function (t) {
                if (void 0 === n[t]) return 'continue';
                var s = e[t - 1];
                '*' === s.modifier || '+' === s.modifier
                  ? (a[s.name] = n[t].split(s.prefix + s.suffix).map(function (t) {
                      return i(t, s);
                    }))
                  : (a[s.name] = i(n[t], s));
              },
              h = 1;
            h < n.length;
            h++
          )
            l(h);
          return { path: r, index: o, params: a };
        };
      })(v(t, s, e), s, e);
    }
    function d(t) {
      return t.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
    }
    function f(t) {
      return t && t.sensitive ? '' : 'i';
    }
    function m(t, e, s) {
      return (function (t, e, s) {
        void 0 === s && (s = {});
        for (
          var n = s.strict,
            i = void 0 !== n && n,
            r = s.start,
            o = void 0 === r || r,
            a = s.end,
            l = void 0 === a || a,
            h = s.encode,
            u =
              void 0 === h
                ? function (t) {
                    return t;
                  }
                : h,
            c = '[' + d(s.endsWith || '') + ']|$',
            p = '[' + d(s.delimiter || '/#?') + ']',
            m = o ? '^' : '',
            v = 0,
            g = t;
          v < g.length;
          v++
        ) {
          var _ = g[v];
          if ('string' == typeof _) m += d(u(_));
          else {
            var x = d(u(_.prefix)),
              y = d(u(_.suffix));
            if (_.pattern)
              if ((e && e.push(_), x || y))
                if ('+' === _.modifier || '*' === _.modifier) {
                  var E = '*' === _.modifier ? '?' : '';
                  m +=
                    '(?:' +
                    x +
                    '((?:' +
                    _.pattern +
                    ')(?:' +
                    y +
                    x +
                    '(?:' +
                    _.pattern +
                    '))*)' +
                    y +
                    ')' +
                    E;
                } else m += '(?:' + x + '(' + _.pattern + ')' + y + ')' + _.modifier;
              else m += '(' + _.pattern + ')' + _.modifier;
            else m += '(?:' + x + y + ')' + _.modifier;
          }
        }
        if (l) i || (m += p + '?'), (m += s.endsWith ? '(?=' + c + ')' : '$');
        else {
          var b = t[t.length - 1],
            w = 'string' == typeof b ? p.indexOf(b[b.length - 1]) > -1 : void 0 === b;
          i || (m += '(?:' + p + '(?=' + c + '))?'), w || (m += '(?=' + p + '|' + c + ')');
        }
        return new RegExp(m, f(s));
      })(c(t, s), e, s);
    }
    function v(t, e, s) {
      return t instanceof RegExp
        ? (function (t, e) {
            if (!e) return t;
            var s = t.source.match(/\((?!\?)/g);
            if (s)
              for (var n = 0; n < s.length; n++)
                e.push({ name: n, prefix: '', suffix: '', modifier: '', pattern: '' });
            return t;
          })(t, e)
        : Array.isArray(t)
        ? (function (t, e, s) {
            var n = t.map(function (t) {
              return v(t, e, s).source;
            });
            return new RegExp('(?:' + n.join('|') + ')', f(s));
          })(t, e, s)
        : m(t, e, s);
    }
    class g extends a {}
    let _ = class {
      constructor() {
        (this.listeners = []),
          (this.root = '/'),
          window.addEventListener('popstate', () => {
            this.notifyListeners();
          });
      }
      getFragment() {
        let t = '';
        return (
          (t = this.normalize(location.pathname)),
          (t = '/' !== this.root ? t.replace(this.root, '') : t),
          this.normalize(t)
        );
      }
      navigate(t) {
        history.pushState(null, '', this.root + this.normalize(t)), this.notifyListeners();
      }
      listen(t) {
        return (
          this.listeners.push(t),
          () => {
            const e = this.listeners.indexOf(t);
            this.listeners.splice(e, 1);
          }
        );
      }
      match(t) {
        return p(this.normalize(t), { decode: decodeURIComponent });
      }
      normalize(t) {
        return t.toString().replace(/^\/|\/$/g, '');
      }
      notifyListeners() {
        this.listeners.forEach((t) => {
          t();
        });
      }
    };
    _ = n(
      [
        function (t) {
          t.provideInRoot = !0;
        },
      ],
      _
    );
    class x extends u {
      constructor() {
        super(...arguments),
          (this.path = this.getAttribute('path') || ''),
          (this.pathMatch = this.getAttribute('path-match') || 'startsWith'),
          (this.activeClass = this.getAttribute('active-class') || 'active'),
          (this.normalizedPath = this.router.normalize(this.path));
      }
      connectedCallback() {
        this.removeListener = this.router.listen(() => {
          this.setActiveClass();
        });
        const t = this.children[0];
        t &&
          t instanceof HTMLAnchorElement &&
          ((this.path = t.pathname), (this.normalizedPath = this.router.normalize(this.path))),
          (this.onclick = (t) => {
            t.preventDefault(), this.router.navigate(this.normalizedPath);
          }),
          this.setActiveClass();
      }
      disconnectedCallback() {
        this.removeListener && this.removeListener();
      }
      setActiveClass() {
        const t = this.router.getFragment();
        'full' === this.pathMatch
          ? t === this.normalizedPath
            ? this.classList.add(this.activeClass)
            : this.classList.remove(this.activeClass)
          : t.startsWith(this.normalizedPath)
          ? this.classList.add(this.activeClass)
          : this.classList.remove(this.activeClass);
      }
    }
    n([h(_)], x.prototype, 'router', void 0);
    let y = class extends u {
      constructor() {
        super(...arguments), (this.__routes__ = []), (this.matchers = []);
      }
      set routes(t) {
        (this.__routes__ = t),
          (this.matchers = this.routes.map((t) => this.router.match(t.path))),
          this.check();
      }
      get routes() {
        return this.__routes__;
      }
      connectedCallback() {
        this.removeListener = this.router.listen(() => {
          this.check();
        });
      }
      disconnectedCallback() {
        this.removeListener && this.removeListener();
      }
      onPropChanges() {
        (this.matchers = this.routes.map((t) => this.router.match(t.path))), this.check();
      }
      check() {
        const t = this.router.getFragment();
        let e = null,
          s = null,
          n = null;
        for (
          let i = 0;
          i < this.matchers.length &&
          ((e = this.routes[i]), (s = this.matchers[i]), (n = s(t)), !n);
          i++
        );
        return e && s && n
          ? this.state.value.activeRoute && this.state.value.activeRoute.path === e.path
            ? Promise.resolve(void 0)
            : this.resolve(e, n)
          : this.state.setValue({});
      }
      resolve(t, e) {
        return Promise.resolve(t.component()).then((s) => {
          if ('componentInjector' in s) {
            return s.injector
              .get(g)
              .setValue(e)
              .then(() => this.state.setValue({ element: s, activeRoute: t }));
          }
          return this.state.setValue({ element: s, activeRoute: t });
        });
      }
    };
    n([h(a)], y.prototype, 'state', void 0),
      n([h(_)], y.prototype, 'router', void 0),
      (y = n(
        [
          l({
            state: {},
            render({ state: t, host: e }) {
              let s = e.lastElementChild;
              for (; s; ) e.removeChild(s), (s = e.lastElementChild);
              t.element && e.append(t.element);
            },
          }),
        ],
        y
      )),
      customElements.define('router-link', x),
      customElements.define('router-outlet', y);
    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const E = new WeakMap(),
      b = (t) => 'function' == typeof t && E.has(t),
      w =
        'undefined' != typeof window &&
        null != window.customElements &&
        void 0 !== window.customElements.polyfillWrapFlushCallback,
      N = (t, e, s = null) => {
        for (; e !== s; ) {
          const s = e.nextSibling;
          t.removeChild(e), (e = s);
        }
      },
      A = {},
      C = {},
      V = `{{lit-${String(Math.random()).slice(2)}}}`,
      T = `\x3c!--${V}--\x3e`,
      P = new RegExp(`${V}|${T}`);
    class M {
      constructor(t, e) {
        (this.parts = []), (this.element = e);
        const s = [],
          n = [],
          i = document.createTreeWalker(e.content, 133, null, !1);
        let r = 0,
          o = -1,
          a = 0;
        const {
          strings: l,
          values: { length: h },
        } = t;
        for (; a < h; ) {
          const t = i.nextNode();
          if (null !== t) {
            if ((o++, 1 === t.nodeType)) {
              if (t.hasAttributes()) {
                const e = t.attributes,
                  { length: s } = e;
                let n = 0;
                for (let t = 0; t < s; t++) O(e[t].name, '$lit$') && n++;
                for (; n-- > 0; ) {
                  const e = l[a],
                    s = R.exec(e)[2],
                    n = s.toLowerCase() + '$lit$',
                    i = t.getAttribute(n);
                  t.removeAttribute(n);
                  const r = i.split(P);
                  this.parts.push({ type: 'attribute', index: o, name: s, strings: r }),
                    (a += r.length - 1);
                }
              }
              'TEMPLATE' === t.tagName && (n.push(t), (i.currentNode = t.content));
            } else if (3 === t.nodeType) {
              const e = t.data;
              if (e.indexOf(V) >= 0) {
                const n = t.parentNode,
                  i = e.split(P),
                  r = i.length - 1;
                for (let e = 0; e < r; e++) {
                  let s,
                    r = i[e];
                  if ('' === r) s = S();
                  else {
                    const t = R.exec(r);
                    null !== t &&
                      O(t[2], '$lit$') &&
                      (r = r.slice(0, t.index) + t[1] + t[2].slice(0, -'$lit$'.length) + t[3]),
                      (s = document.createTextNode(r));
                  }
                  n.insertBefore(s, t), this.parts.push({ type: 'node', index: ++o });
                }
                '' === i[r] ? (n.insertBefore(S(), t), s.push(t)) : (t.data = i[r]), (a += r);
              }
            } else if (8 === t.nodeType)
              if (t.data === V) {
                const e = t.parentNode;
                (null !== t.previousSibling && o !== r) || (o++, e.insertBefore(S(), t)),
                  (r = o),
                  this.parts.push({ type: 'node', index: o }),
                  null === t.nextSibling ? (t.data = '') : (s.push(t), o--),
                  a++;
              } else {
                let e = -1;
                for (; -1 !== (e = t.data.indexOf(V, e + 1)); )
                  this.parts.push({ type: 'node', index: -1 }), a++;
              }
          } else i.currentNode = n.pop();
        }
        for (const t of s) t.parentNode.removeChild(t);
      }
    }
    const O = (t, e) => {
        const s = t.length - e.length;
        return s >= 0 && t.slice(s) === e;
      },
      k = (t) => -1 !== t.index,
      S = () => document.createComment(''),
      R = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    class L {
      constructor(t, e, s) {
        (this.__parts = []), (this.template = t), (this.processor = e), (this.options = s);
      }
      update(t) {
        let e = 0;
        for (const s of this.__parts) void 0 !== s && s.setValue(t[e]), e++;
        for (const t of this.__parts) void 0 !== t && t.commit();
      }
      _clone() {
        const t = w
            ? this.template.element.content.cloneNode(!0)
            : document.importNode(this.template.element.content, !0),
          e = [],
          s = this.template.parts,
          n = document.createTreeWalker(t, 133, null, !1);
        let i,
          r = 0,
          o = 0,
          a = n.nextNode();
        for (; r < s.length; )
          if (((i = s[r]), k(i))) {
            for (; o < i.index; )
              o++,
                'TEMPLATE' === a.nodeName && (e.push(a), (n.currentNode = a.content)),
                null === (a = n.nextNode()) && ((n.currentNode = e.pop()), (a = n.nextNode()));
            if ('node' === i.type) {
              const t = this.processor.handleTextExpression(this.options);
              t.insertAfterNode(a.previousSibling), this.__parts.push(t);
            } else
              this.__parts.push(
                ...this.processor.handleAttributeExpressions(a, i.name, i.strings, this.options)
              );
            r++;
          } else this.__parts.push(void 0), r++;
        return w && (document.adoptNode(t), customElements.upgrade(t)), t;
      }
    }
    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */ const $ = ` ${V} `;
    class j {
      constructor(t, e, s, n) {
        (this.strings = t), (this.values = e), (this.type = s), (this.processor = n);
      }
      getHTML() {
        const t = this.strings.length - 1;
        let e = '',
          s = !1;
        for (let n = 0; n < t; n++) {
          const t = this.strings[n],
            i = t.lastIndexOf('\x3c!--');
          s = (i > -1 || s) && -1 === t.indexOf('--\x3e', i + 1);
          const r = R.exec(t);
          e +=
            null === r ? t + (s ? $ : T) : t.substr(0, r.index) + r[1] + r[2] + '$lit$' + r[3] + V;
        }
        return (e += this.strings[t]), e;
      }
      getTemplateElement() {
        const t = document.createElement('template');
        return (t.innerHTML = this.getHTML()), t;
      }
    }
    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const H = (t) => null === t || !('object' == typeof t || 'function' == typeof t),
      D = (t) => Array.isArray(t) || !(!t || !t[Symbol.iterator]);
    class I {
      constructor(t, e, s) {
        (this.dirty = !0),
          (this.element = t),
          (this.name = e),
          (this.strings = s),
          (this.parts = []);
        for (let t = 0; t < s.length - 1; t++) this.parts[t] = this._createPart();
      }
      _createPart() {
        return new W(this);
      }
      _getValue() {
        const t = this.strings,
          e = t.length - 1;
        let s = '';
        for (let n = 0; n < e; n++) {
          s += t[n];
          const e = this.parts[n];
          if (void 0 !== e) {
            const t = e.value;
            if (H(t) || !D(t)) s += 'string' == typeof t ? t : String(t);
            else for (const e of t) s += 'string' == typeof e ? e : String(e);
          }
        }
        return (s += t[e]), s;
      }
      commit() {
        this.dirty && ((this.dirty = !1), this.element.setAttribute(this.name, this._getValue()));
      }
    }
    class W {
      constructor(t) {
        (this.value = void 0), (this.committer = t);
      }
      setValue(t) {
        t === A ||
          (H(t) && t === this.value) ||
          ((this.value = t), b(t) || (this.committer.dirty = !0));
      }
      commit() {
        for (; b(this.value); ) {
          const t = this.value;
          (this.value = A), t(this);
        }
        this.value !== A && this.committer.commit();
      }
    }
    class F {
      constructor(t) {
        (this.value = void 0), (this.__pendingValue = void 0), (this.options = t);
      }
      appendInto(t) {
        (this.startNode = t.appendChild(S())), (this.endNode = t.appendChild(S()));
      }
      insertAfterNode(t) {
        (this.startNode = t), (this.endNode = t.nextSibling);
      }
      appendIntoPart(t) {
        t.__insert((this.startNode = S())), t.__insert((this.endNode = S()));
      }
      insertAfterPart(t) {
        t.__insert((this.startNode = S())),
          (this.endNode = t.endNode),
          (t.endNode = this.startNode);
      }
      setValue(t) {
        this.__pendingValue = t;
      }
      commit() {
        if (null === this.startNode.parentNode) return;
        for (; b(this.__pendingValue); ) {
          const t = this.__pendingValue;
          (this.__pendingValue = A), t(this);
        }
        const t = this.__pendingValue;
        t !== A &&
          (H(t)
            ? t !== this.value && this.__commitText(t)
            : t instanceof j
            ? this.__commitTemplateResult(t)
            : t instanceof Node
            ? this.__commitNode(t)
            : D(t)
            ? this.__commitIterable(t)
            : t === C
            ? ((this.value = C), this.clear())
            : this.__commitText(t));
      }
      __insert(t) {
        this.endNode.parentNode.insertBefore(t, this.endNode);
      }
      __commitNode(t) {
        this.value !== t && (this.clear(), this.__insert(t), (this.value = t));
      }
      __commitText(t) {
        const e = this.startNode.nextSibling,
          s = 'string' == typeof (t = null == t ? '' : t) ? t : String(t);
        e === this.endNode.previousSibling && 3 === e.nodeType
          ? (e.data = s)
          : this.__commitNode(document.createTextNode(s)),
          (this.value = t);
      }
      __commitTemplateResult(t) {
        const e = this.options.templateFactory(t);
        if (this.value instanceof L && this.value.template === e) this.value.update(t.values);
        else {
          const s = new L(e, t.processor, this.options),
            n = s._clone();
          s.update(t.values), this.__commitNode(n), (this.value = s);
        }
      }
      __commitIterable(t) {
        Array.isArray(this.value) || ((this.value = []), this.clear());
        const e = this.value;
        let s,
          n = 0;
        for (const i of t)
          (s = e[n]),
            void 0 === s &&
              ((s = new F(this.options)),
              e.push(s),
              0 === n ? s.appendIntoPart(this) : s.insertAfterPart(e[n - 1])),
            s.setValue(i),
            s.commit(),
            n++;
        n < e.length && ((e.length = n), this.clear(s && s.endNode));
      }
      clear(t = this.startNode) {
        N(this.startNode.parentNode, t.nextSibling, this.endNode);
      }
    }
    class z {
      constructor(t, e, s) {
        if (
          ((this.value = void 0),
          (this.__pendingValue = void 0),
          2 !== s.length || '' !== s[0] || '' !== s[1])
        )
          throw new Error('Boolean attributes can only contain a single expression');
        (this.element = t), (this.name = e), (this.strings = s);
      }
      setValue(t) {
        this.__pendingValue = t;
      }
      commit() {
        for (; b(this.__pendingValue); ) {
          const t = this.__pendingValue;
          (this.__pendingValue = A), t(this);
        }
        if (this.__pendingValue === A) return;
        const t = !!this.__pendingValue;
        this.value !== t &&
          (t ? this.element.setAttribute(this.name, '') : this.element.removeAttribute(this.name),
          (this.value = t)),
          (this.__pendingValue = A);
      }
    }
    class B extends I {
      constructor(t, e, s) {
        super(t, e, s), (this.single = 2 === s.length && '' === s[0] && '' === s[1]);
      }
      _createPart() {
        return new U(this);
      }
      _getValue() {
        return this.single ? this.parts[0].value : super._getValue();
      }
      commit() {
        this.dirty && ((this.dirty = !1), (this.element[this.name] = this._getValue()));
      }
    }
    class U extends W {}
    let q = !1;
    (() => {
      try {
        const t = {
          get capture() {
            return (q = !0), !1;
          },
        };
        window.addEventListener('test', t, t), window.removeEventListener('test', t, t);
      } catch (t) {}
    })();
    class G {
      constructor(t, e, s) {
        (this.value = void 0),
          (this.__pendingValue = void 0),
          (this.element = t),
          (this.eventName = e),
          (this.eventContext = s),
          (this.__boundHandleEvent = (t) => this.handleEvent(t));
      }
      setValue(t) {
        this.__pendingValue = t;
      }
      commit() {
        for (; b(this.__pendingValue); ) {
          const t = this.__pendingValue;
          (this.__pendingValue = A), t(this);
        }
        if (this.__pendingValue === A) return;
        const t = this.__pendingValue,
          e = this.value,
          s =
            null == t ||
            (null != e &&
              (t.capture !== e.capture || t.once !== e.once || t.passive !== e.passive)),
          n = null != t && (null == e || s);
        s &&
          this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options),
          n &&
            ((this.__options = J(t)),
            this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options)),
          (this.value = t),
          (this.__pendingValue = A);
      }
      handleEvent(t) {
        'function' == typeof this.value
          ? this.value.call(this.eventContext || this.element, t)
          : this.value.handleEvent(t);
      }
    }
    const J = (t) =>
      t && (q ? { capture: t.capture, passive: t.passive, once: t.once } : t.capture);
    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */ const K = new (class {
      handleAttributeExpressions(t, e, s, n) {
        const i = e[0];
        if ('.' === i) {
          return new B(t, e.slice(1), s).parts;
        }
        return '@' === i
          ? [new G(t, e.slice(1), n.eventContext)]
          : '?' === i
          ? [new z(t, e.slice(1), s)]
          : new I(t, e, s).parts;
      }
      handleTextExpression(t) {
        return new F(t);
      }
    })();
    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */ function Q(t) {
      let e = X.get(t.type);
      void 0 === e &&
        ((e = { stringsArray: new WeakMap(), keyString: new Map() }), X.set(t.type, e));
      let s = e.stringsArray.get(t.strings);
      if (void 0 !== s) return s;
      const n = t.strings.join(V);
      return (
        (s = e.keyString.get(n)),
        void 0 === s && ((s = new M(t, t.getTemplateElement())), e.keyString.set(n, s)),
        e.stringsArray.set(t.strings, s),
        s
      );
    }
    const X = new Map(),
      Y = new WeakMap();
    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    'undefined' != typeof window &&
      (window.litHtmlVersions || (window.litHtmlVersions = [])).push('1.2.1');
    const Z = (t, ...e) => new j(t, e, 'html', K);
    let tt = class extends u {};
    var et;
    (tt = n(
      [
        l({
          state: { title: 'Page2Component Works!' },
          render:
            ((et = ({ state: t }) => Z` <h3>${t.title}</h3> `),
            (t) =>
              ((t, e, s) => {
                let n = Y.get(e);
                void 0 === n &&
                  (N(e, e.firstChild),
                  Y.set(e, (n = new F(Object.assign({ templateFactory: Q }, s)))),
                  n.appendInto(e)),
                  n.setValue(t),
                  n.commit();
              })(et(t), t.host.shadowRoot || t.host)),
        }),
      ],
      tt
    )),
      customElements.define('page-2-component', tt);
    const st = [{ path: '/foo/bar', component: () => document.createElement('page-2-element') }];
    let nt = class extends u {};
    (nt = n(
      [
        l({
          state: { title: 'Page1Component Works!' },
          render: ({ state: t }) => Z`
      <h2>${t.title}</h2>

      <router-outlet .routes=${st}></router-outlet>
    `,
        }),
      ],
      nt
    )),
      customElements.define('page-1-element', nt);
    const it = [
      {
        path: '/test',
        component: () => {
          const t = document.createElement('div');
          return (t.innerHTML = 'Hello World'), t;
        },
      },
      { path: '/foo(.*)', component: () => document.createElement('page-1-element') },
    ];
    let rt = class extends u {};
    (rt = n(
      [
        l({
          state: { title: 'Hello World' },
          render: ({ state: t }) => Z`
      <header>
        <h1>${t.title}</h1>
      </header>

      <router-link path-match="full">
        <a href="/">HOME</a>
      </router-link>

      <router-link>
        <a href="/foo">FOO</a>
      </router-link>

      <router-link>
        <a href="/foo/bar">BAR</a>
      </router-link>

      <router-outlet .routes=${it}></router-outlet>

      <footer>The Footer</footer>
    `,
        }),
      ],
      rt
    )),
      customElements.define('app-root', rt);
  },
});
