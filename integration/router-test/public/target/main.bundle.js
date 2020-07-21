!(function (e) {
  var t = {};
  function n(s) {
    if (t[s]) return t[s].exports;
    var i = (t[s] = { i: s, l: !1, exports: {} });
    return e[s].call(i.exports, i, i.exports, n), (i.l = !0), i.exports;
  }
  (n.m = e),
    (n.c = t),
    (n.d = function (e, t, s) {
      n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: s });
    }),
    (n.r = function (e) {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(e, '__esModule', { value: !0 });
    }),
    (n.t = function (e, t) {
      if ((1 & t && (e = n(e)), 8 & t)) return e;
      if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
      var s = Object.create(null);
      if (
        (n.r(s),
        Object.defineProperty(s, 'default', { enumerable: !0, value: e }),
        2 & t && 'string' != typeof e)
      )
        for (var i in e)
          n.d(
            s,
            i,
            function (t) {
              return e[t];
            }.bind(null, i)
          );
      return s;
    }),
    (n.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return n.d(t, 'a', t), t;
    }),
    (n.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (n.p = ''),
    n((n.s = 2));
})({
  2: function (e, t, n) {
    'use strict';
    n.r(t);
    function s(e) {
      return function (t, n, s) {
        (t.deps = t.deps || []), (t.deps[s] = e);
      };
    }
    class i {
      constructor(e = {}, t) {
        (this.opts = e),
          (this.parent = t),
          (this.providerMap = new WeakMap()),
          this.opts.bootstrap && this.opts.bootstrap.forEach((e) => this.get(e));
      }
      has(e) {
        return !!this.providerMap.has(e) || (!!this.parent && this.parent.has(e));
      }
      get(e) {
        if (this.providerMap.has(e)) return this.providerMap.get(e);
        let t = this.resolve(e);
        return this.providerMap.set(e, t), t;
      }
      create(e) {
        return new e(...(e.deps || []).map((e) => this.get(e)));
      }
      resolve(e) {
        const t = this.findProvider(e);
        return t
          ? this.createFromProvider(t)
          : this.parent &&
            ((function (e) {
              return e.provideInRoot || !1;
            })(e) ||
              this.parent.has(e))
          ? this.parent.get(e)
          : this.create(e);
      }
      createFromProvider(e) {
        return 'useClass' in e
          ? this.create(e.useClass)
          : 'useFactory' in e
          ? this.createFromFactory(e)
          : null;
      }
      createFromFactory(e) {
        return e.useFactory.apply(
          e,
          e.deps.map((e) => this.get(e))
        );
      }
      findProvider(e) {
        return (this.opts.providers && this.opts.providers.find((t) => t.provide === e)) || null;
      }
    }
    let r;
    function o(e = []) {
      return (r = new i({ providers: e })), r;
    }
    function a(e, t, n, s) {
      var i,
        r = arguments.length,
        o = r < 3 ? t : null === s ? (s = Object.getOwnPropertyDescriptor(t, n)) : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        o = Reflect.decorate(e, t, n, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (i = e[a]) && (o = (r < 3 ? i(o) : r > 3 ? i(t, n, o) : i(t, n)) || o);
      return r > 3 && o && Object.defineProperty(t, n, o), o;
    }
    function l(e, t) {
      return function (n, s) {
        t(n, s, e);
      };
    }
    Object.create;
    Object.create;
    let c = (() => {
      let e = class {
        render(e, t) {}
      };
      return (
        (e = a(
          [
            function (e) {
              e.provideInRoot = !0;
            },
          ],
          e
        )),
        e
      );
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
     */
    const h = new WeakMap(),
      u = (e) => 'function' == typeof e && h.has(e),
      p =
        'undefined' != typeof window &&
        null != window.customElements &&
        void 0 !== window.customElements.polyfillWrapFlushCallback,
      d = (e, t, n = null) => {
        for (; t !== n; ) {
          const n = t.nextSibling;
          e.removeChild(t), (t = n);
        }
      },
      f = {},
      m = {},
      v = `{{lit-${String(Math.random()).slice(2)}}}`,
      g = `\x3c!--${v}--\x3e`,
      _ = new RegExp(`${v}|${g}`);
    class x {
      constructor(e, t) {
        (this.parts = []), (this.element = t);
        const n = [],
          s = [],
          i = document.createTreeWalker(t.content, 133, null, !1);
        let r = 0,
          o = -1,
          a = 0;
        const {
          strings: l,
          values: { length: c },
        } = e;
        for (; a < c; ) {
          const e = i.nextNode();
          if (null !== e) {
            if ((o++, 1 === e.nodeType)) {
              if (e.hasAttributes()) {
                const t = e.attributes,
                  { length: n } = t;
                let s = 0;
                for (let e = 0; e < n; e++) y(t[e].name, '$lit$') && s++;
                for (; s-- > 0; ) {
                  const t = l[a],
                    n = w.exec(t)[2],
                    s = n.toLowerCase() + '$lit$',
                    i = e.getAttribute(s);
                  e.removeAttribute(s);
                  const r = i.split(_);
                  this.parts.push({ type: 'attribute', index: o, name: n, strings: r }),
                    (a += r.length - 1);
                }
              }
              'TEMPLATE' === e.tagName && (s.push(e), (i.currentNode = e.content));
            } else if (3 === e.nodeType) {
              const t = e.data;
              if (t.indexOf(v) >= 0) {
                const s = e.parentNode,
                  i = t.split(_),
                  r = i.length - 1;
                for (let t = 0; t < r; t++) {
                  let n,
                    r = i[t];
                  if ('' === r) n = E();
                  else {
                    const e = w.exec(r);
                    null !== e &&
                      y(e[2], '$lit$') &&
                      (r = r.slice(0, e.index) + e[1] + e[2].slice(0, -'$lit$'.length) + e[3]),
                      (n = document.createTextNode(r));
                  }
                  s.insertBefore(n, e), this.parts.push({ type: 'node', index: ++o });
                }
                '' === i[r] ? (s.insertBefore(E(), e), n.push(e)) : (e.data = i[r]), (a += r);
              }
            } else if (8 === e.nodeType)
              if (e.data === v) {
                const t = e.parentNode;
                (null !== e.previousSibling && o !== r) || (o++, t.insertBefore(E(), e)),
                  (r = o),
                  this.parts.push({ type: 'node', index: o }),
                  null === e.nextSibling ? (e.data = '') : (n.push(e), o--),
                  a++;
              } else {
                let t = -1;
                for (; -1 !== (t = e.data.indexOf(v, t + 1)); )
                  this.parts.push({ type: 'node', index: -1 }), a++;
              }
          } else i.currentNode = s.pop();
        }
        for (const e of n) e.parentNode.removeChild(e);
      }
    }
    const y = (e, t) => {
        const n = e.length - t.length;
        return n >= 0 && e.slice(n) === t;
      },
      b = (e) => -1 !== e.index,
      E = () => document.createComment(''),
      w = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
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
    class C {
      constructor(e, t, n) {
        (this.__parts = []), (this.template = e), (this.processor = t), (this.options = n);
      }
      update(e) {
        let t = 0;
        for (const n of this.__parts) void 0 !== n && n.setValue(e[t]), t++;
        for (const e of this.__parts) void 0 !== e && e.commit();
      }
      _clone() {
        const e = p
            ? this.template.element.content.cloneNode(!0)
            : document.importNode(this.template.element.content, !0),
          t = [],
          n = this.template.parts,
          s = document.createTreeWalker(e, 133, null, !1);
        let i,
          r = 0,
          o = 0,
          a = s.nextNode();
        for (; r < n.length; )
          if (((i = n[r]), b(i))) {
            for (; o < i.index; )
              o++,
                'TEMPLATE' === a.nodeName && (t.push(a), (s.currentNode = a.content)),
                null === (a = s.nextNode()) && ((s.currentNode = t.pop()), (a = s.nextNode()));
            if ('node' === i.type) {
              const e = this.processor.handleTextExpression(this.options);
              e.insertAfterNode(a.previousSibling), this.__parts.push(e);
            } else
              this.__parts.push(
                ...this.processor.handleAttributeExpressions(a, i.name, i.strings, this.options)
              );
            r++;
          } else this.__parts.push(void 0), r++;
        return p && (document.adoptNode(e), customElements.upgrade(e)), e;
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
     */ const N = ` ${v} `;
    class A {
      constructor(e, t, n, s) {
        (this.strings = e), (this.values = t), (this.type = n), (this.processor = s);
      }
      getHTML() {
        const e = this.strings.length - 1;
        let t = '',
          n = !1;
        for (let s = 0; s < e; s++) {
          const e = this.strings[s],
            i = e.lastIndexOf('\x3c!--');
          n = (i > -1 || n) && -1 === e.indexOf('--\x3e', i + 1);
          const r = w.exec(e);
          t +=
            null === r ? e + (n ? N : g) : e.substr(0, r.index) + r[1] + r[2] + '$lit$' + r[3] + v;
        }
        return (t += this.strings[e]), t;
      }
      getTemplateElement() {
        const e = document.createElement('template');
        return (e.innerHTML = this.getHTML()), e;
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
    const P = (e) => null === e || !('object' == typeof e || 'function' == typeof e),
      V = (e) => Array.isArray(e) || !(!e || !e[Symbol.iterator]);
    class T {
      constructor(e, t, n) {
        (this.dirty = !0),
          (this.element = e),
          (this.name = t),
          (this.strings = n),
          (this.parts = []);
        for (let e = 0; e < n.length - 1; e++) this.parts[e] = this._createPart();
      }
      _createPart() {
        return new R(this);
      }
      _getValue() {
        const e = this.strings,
          t = e.length - 1;
        let n = '';
        for (let s = 0; s < t; s++) {
          n += e[s];
          const t = this.parts[s];
          if (void 0 !== t) {
            const e = t.value;
            if (P(e) || !V(e)) n += 'string' == typeof e ? e : String(e);
            else for (const t of e) n += 'string' == typeof t ? t : String(t);
          }
        }
        return (n += e[t]), n;
      }
      commit() {
        this.dirty && ((this.dirty = !1), this.element.setAttribute(this.name, this._getValue()));
      }
    }
    class R {
      constructor(e) {
        (this.value = void 0), (this.committer = e);
      }
      setValue(e) {
        e === f ||
          (P(e) && e === this.value) ||
          ((this.value = e), u(e) || (this.committer.dirty = !0));
      }
      commit() {
        for (; u(this.value); ) {
          const e = this.value;
          (this.value = f), e(this);
        }
        this.value !== f && this.committer.commit();
      }
    }
    class k {
      constructor(e) {
        (this.value = void 0), (this.__pendingValue = void 0), (this.options = e);
      }
      appendInto(e) {
        (this.startNode = e.appendChild(E())), (this.endNode = e.appendChild(E()));
      }
      insertAfterNode(e) {
        (this.startNode = e), (this.endNode = e.nextSibling);
      }
      appendIntoPart(e) {
        e.__insert((this.startNode = E())), e.__insert((this.endNode = E()));
      }
      insertAfterPart(e) {
        e.__insert((this.startNode = E())),
          (this.endNode = e.endNode),
          (e.endNode = this.startNode);
      }
      setValue(e) {
        this.__pendingValue = e;
      }
      commit() {
        if (null === this.startNode.parentNode) return;
        for (; u(this.__pendingValue); ) {
          const e = this.__pendingValue;
          (this.__pendingValue = f), e(this);
        }
        const e = this.__pendingValue;
        e !== f &&
          (P(e)
            ? e !== this.value && this.__commitText(e)
            : e instanceof A
            ? this.__commitTemplateResult(e)
            : e instanceof Node
            ? this.__commitNode(e)
            : V(e)
            ? this.__commitIterable(e)
            : e === m
            ? ((this.value = m), this.clear())
            : this.__commitText(e));
      }
      __insert(e) {
        this.endNode.parentNode.insertBefore(e, this.endNode);
      }
      __commitNode(e) {
        this.value !== e && (this.clear(), this.__insert(e), (this.value = e));
      }
      __commitText(e) {
        const t = this.startNode.nextSibling,
          n = 'string' == typeof (e = null == e ? '' : e) ? e : String(e);
        t === this.endNode.previousSibling && 3 === t.nodeType
          ? (t.data = n)
          : this.__commitNode(document.createTextNode(n)),
          (this.value = e);
      }
      __commitTemplateResult(e) {
        const t = this.options.templateFactory(e);
        if (this.value instanceof C && this.value.template === t) this.value.update(e.values);
        else {
          const n = new C(t, e.processor, this.options),
            s = n._clone();
          n.update(e.values), this.__commitNode(s), (this.value = n);
        }
      }
      __commitIterable(e) {
        Array.isArray(this.value) || ((this.value = []), this.clear());
        const t = this.value;
        let n,
          s = 0;
        for (const i of e)
          (n = t[s]),
            void 0 === n &&
              ((n = new k(this.options)),
              t.push(n),
              0 === s ? n.appendIntoPart(this) : n.insertAfterPart(t[s - 1])),
            n.setValue(i),
            n.commit(),
            s++;
        s < t.length && ((t.length = s), this.clear(n && n.endNode));
      }
      clear(e = this.startNode) {
        d(this.startNode.parentNode, e.nextSibling, this.endNode);
      }
    }
    class I {
      constructor(e, t, n) {
        if (
          ((this.value = void 0),
          (this.__pendingValue = void 0),
          2 !== n.length || '' !== n[0] || '' !== n[1])
        )
          throw new Error('Boolean attributes can only contain a single expression');
        (this.element = e), (this.name = t), (this.strings = n);
      }
      setValue(e) {
        this.__pendingValue = e;
      }
      commit() {
        for (; u(this.__pendingValue); ) {
          const e = this.__pendingValue;
          (this.__pendingValue = f), e(this);
        }
        if (this.__pendingValue === f) return;
        const e = !!this.__pendingValue;
        this.value !== e &&
          (e ? this.element.setAttribute(this.name, '') : this.element.removeAttribute(this.name),
          (this.value = e)),
          (this.__pendingValue = f);
      }
    }
    class M extends T {
      constructor(e, t, n) {
        super(e, t, n), (this.single = 2 === n.length && '' === n[0] && '' === n[1]);
      }
      _createPart() {
        return new O(this);
      }
      _getValue() {
        return this.single ? this.parts[0].value : super._getValue();
      }
      commit() {
        this.dirty && ((this.dirty = !1), (this.element[this.name] = this._getValue()));
      }
    }
    class O extends R {}
    let S = !1;
    (() => {
      try {
        const e = {
          get capture() {
            return (S = !0), !1;
          },
        };
        window.addEventListener('test', e, e), window.removeEventListener('test', e, e);
      } catch (e) {}
    })();
    class L {
      constructor(e, t, n) {
        (this.value = void 0),
          (this.__pendingValue = void 0),
          (this.element = e),
          (this.eventName = t),
          (this.eventContext = n),
          (this.__boundHandleEvent = (e) => this.handleEvent(e));
      }
      setValue(e) {
        this.__pendingValue = e;
      }
      commit() {
        for (; u(this.__pendingValue); ) {
          const e = this.__pendingValue;
          (this.__pendingValue = f), e(this);
        }
        if (this.__pendingValue === f) return;
        const e = this.__pendingValue,
          t = this.value,
          n =
            null == e ||
            (null != t &&
              (e.capture !== t.capture || e.once !== t.once || e.passive !== t.passive)),
          s = null != e && (null == t || n);
        n &&
          this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options),
          s &&
            ((this.__options = j(e)),
            this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options)),
          (this.value = e),
          (this.__pendingValue = f);
      }
      handleEvent(e) {
        'function' == typeof this.value
          ? this.value.call(this.eventContext || this.element, e)
          : this.value.handleEvent(e);
      }
    }
    const j = (e) =>
      e && (S ? { capture: e.capture, passive: e.passive, once: e.once } : e.capture);
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
     */ const $ = new (class {
      handleAttributeExpressions(e, t, n, s) {
        const i = t[0];
        if ('.' === i) {
          return new M(e, t.slice(1), n).parts;
        }
        return '@' === i
          ? [new L(e, t.slice(1), s.eventContext)]
          : '?' === i
          ? [new I(e, t.slice(1), n)]
          : new T(e, t, n).parts;
      }
      handleTextExpression(e) {
        return new k(e);
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
     */ function F(e) {
      let t = H.get(e.type);
      void 0 === t &&
        ((t = { stringsArray: new WeakMap(), keyString: new Map() }), H.set(e.type, t));
      let n = t.stringsArray.get(e.strings);
      if (void 0 !== n) return n;
      const s = e.strings.join(v);
      return (
        (n = t.keyString.get(s)),
        void 0 === n && ((n = new x(e, e.getTemplateElement())), t.keyString.set(s, n)),
        t.stringsArray.set(e.strings, n),
        n
      );
    }
    const H = new Map(),
      W = new WeakMap();
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
    const D = (e, ...t) => new A(e, t, 'html', $);
    class z extends c {
      render(e, t) {
        ((e, t, n) => {
          let s = W.get(t);
          void 0 === s &&
            (d(t, t.firstChild),
            W.set(t, (s = new k(Object.assign({ templateFactory: F }, n)))),
            s.appendInto(t)),
            s.setValue(e),
            s.commit();
        })(e, t.shadowRoot || t);
      }
    }
    o([{ provide: c, useClass: z }]);
    class B {}
    function U(e, t, n) {
      s(B)(e, t, n);
    }
    function q(e, t, n) {
      s(G)(e, t, n);
    }
    class G {
      constructor(e) {
        (this.listeners = []), (this.currentState = e);
      }
      get value() {
        return this.currentState;
      }
      setValue(e) {
        return Promise.resolve(e).then((e) => {
          (this.currentState = e), this.listeners.forEach((e) => e(this.value));
        });
      }
      patchValue(e) {
        return Promise.resolve(e).then((t) => {
          try {
            this.setValue(Object.assign(Object.assign({}, this.value), t));
          } catch (t) {
            throw new Error('cannot patch state that is of type ' + typeof e);
          }
        });
      }
      onChange(e) {
        return (
          this.listeners.push(e),
          () => {
            this.listeners = this.listeners.filter((t) => t !== e);
          }
        );
      }
    }
    function J(e = {}) {
      return function (t) {
        Object.defineProperty(t, 'componentDef', { get: () => e });
      };
    }
    function K(e, t = {}) {
      var n;
      const s = e.props || [];
      const a = (function (e) {
          return e.componentDef || {};
        })(e),
        l = a.providers || [],
        h =
          (((n = class extends (t.extends || HTMLElement) {
            constructor() {
              super(),
                (this.componentInjector = new i(
                  {
                    providers: l.concat([
                      { provide: B, useFactory: () => this, deps: [] },
                      { provide: G, useFactory: () => new G(a.state), deps: [] },
                    ]),
                    bootstrap: l.map((e) => e.provide),
                  },
                  t.root || r || o()
                )),
                (this.componentInstance = this.componentInjector.create(e)),
                a.useShadowDom && this.attachShadow({ mode: 'open' });
            }
            connectedCallback() {
              !(function (e, t) {
                const n = e.componentInstance.constructor.handlers || {},
                  s = e.componentInjector.get(c),
                  i = e.componentInjector.get(G),
                  r = (t, s) => (i) => {
                    t in n &&
                      n[t].forEach((t) => {
                        e.componentInstance[t].call(e.componentInstance, i, s);
                      });
                  },
                  o = (t, n) => () => {
                    e.dispatchEvent(new CustomEvent(t, n));
                  },
                  a = (n) => {
                    t.render && s.render(t.render({ state: n, run: r, dispatch: o, host: e }), e);
                  };
                a(i.value),
                  i.onChange((e) => {
                    a(e);
                  });
              })(this, a),
                this.componentInstance.connectedCallback &&
                  this.componentInstance.connectedCallback();
            }
            disconnectedCallback() {
              this.componentInstance.disconnectedCallback &&
                this.componentInstance.disconnectedCallback();
            }
            attributeChangedCallback(e, t, n) {
              this.componentInstance.attributeChangedCallback &&
                this.componentInstance.attributeChangedCallback(e, t, n);
            }
          }).observedAttributes = a.observedAttributes),
          n);
      for (let e = 0; e < s.length; e++) {
        const t = s[e];
        Object.defineProperty(h.prototype, t, {
          set(e) {
            const n = this.componentInstance,
              s = n[t];
            (n[t] = e), n.onPropChanges && n.onPropChanges(t, s, e);
          },
          get() {
            return this.componentInstance[t];
          },
        });
      }
      return h;
    }
    function Q(e, t) {
      void 0 === t && (t = {});
      for (
        var n = (function (e) {
            for (var t = [], n = 0; n < e.length; ) {
              var s = e[n];
              if ('*' !== s && '+' !== s && '?' !== s)
                if ('\\' !== s)
                  if ('{' !== s)
                    if ('}' !== s)
                      if (':' !== s)
                        if ('(' !== s) t.push({ type: 'CHAR', index: n, value: e[n++] });
                        else {
                          var i = 1,
                            r = '';
                          if ('?' === e[(a = n + 1)])
                            throw new TypeError('Pattern cannot start with "?" at ' + a);
                          for (; a < e.length; )
                            if ('\\' !== e[a]) {
                              if (')' === e[a]) {
                                if (0 === --i) {
                                  a++;
                                  break;
                                }
                              } else if ('(' === e[a] && (i++, '?' !== e[a + 1]))
                                throw new TypeError('Capturing groups are not allowed at ' + a);
                              r += e[a++];
                            } else r += e[a++] + e[a++];
                          if (i) throw new TypeError('Unbalanced pattern at ' + n);
                          if (!r) throw new TypeError('Missing pattern at ' + n);
                          t.push({ type: 'PATTERN', index: n, value: r }), (n = a);
                        }
                      else {
                        for (var o = '', a = n + 1; a < e.length; ) {
                          var l = e.charCodeAt(a);
                          if (
                            !(
                              (l >= 48 && l <= 57) ||
                              (l >= 65 && l <= 90) ||
                              (l >= 97 && l <= 122) ||
                              95 === l
                            )
                          )
                            break;
                          o += e[a++];
                        }
                        if (!o) throw new TypeError('Missing parameter name at ' + n);
                        t.push({ type: 'NAME', index: n, value: o }), (n = a);
                      }
                    else t.push({ type: 'CLOSE', index: n, value: e[n++] });
                  else t.push({ type: 'OPEN', index: n, value: e[n++] });
                else t.push({ type: 'ESCAPED_CHAR', index: n++, value: e[n++] });
              else t.push({ type: 'MODIFIER', index: n, value: e[n++] });
            }
            return t.push({ type: 'END', index: n, value: '' }), t;
          })(e),
          s = t.prefixes,
          i = void 0 === s ? './' : s,
          r = '[^' + Y(t.delimiter || '/#?') + ']+?',
          o = [],
          a = 0,
          l = 0,
          c = '',
          h = function (e) {
            if (l < n.length && n[l].type === e) return n[l++].value;
          },
          u = function (e) {
            var t = h(e);
            if (void 0 !== t) return t;
            var s = n[l],
              i = s.type,
              r = s.index;
            throw new TypeError('Unexpected ' + i + ' at ' + r + ', expected ' + e);
          },
          p = function () {
            for (var e, t = ''; (e = h('CHAR') || h('ESCAPED_CHAR')); ) t += e;
            return t;
          };
        l < n.length;

      ) {
        var d = h('CHAR'),
          f = h('NAME'),
          m = h('PATTERN');
        if (f || m) {
          var v = d || '';
          -1 === i.indexOf(v) && ((c += v), (v = '')),
            c && (o.push(c), (c = '')),
            o.push({
              name: f || a++,
              prefix: v,
              suffix: '',
              pattern: m || r,
              modifier: h('MODIFIER') || '',
            });
        } else {
          var g = d || h('ESCAPED_CHAR');
          if (g) c += g;
          else if ((c && (o.push(c), (c = '')), h('OPEN'))) {
            v = p();
            var _ = h('NAME') || '',
              x = h('PATTERN') || '',
              y = p();
            u('CLOSE'),
              o.push({
                name: _ || (x ? a++ : ''),
                pattern: _ && !x ? r : x,
                prefix: v,
                suffix: y,
                modifier: h('MODIFIER') || '',
              });
          } else u('END');
        }
      }
      return o;
    }
    function X(e, t) {
      var n = [];
      return (function (e, t, n) {
        void 0 === n && (n = {});
        var s = n.decode,
          i =
            void 0 === s
              ? function (e) {
                  return e;
                }
              : s;
        return function (n) {
          var s = e.exec(n);
          if (!s) return !1;
          for (
            var r = s[0],
              o = s.index,
              a = Object.create(null),
              l = function (e) {
                if (void 0 === s[e]) return 'continue';
                var n = t[e - 1];
                '*' === n.modifier || '+' === n.modifier
                  ? (a[n.name] = s[e].split(n.prefix + n.suffix).map(function (e) {
                      return i(e, n);
                    }))
                  : (a[n.name] = i(s[e], n));
              },
              c = 1;
            c < s.length;
            c++
          )
            l(c);
          return { path: r, index: o, params: a };
        };
      })(te(e, n, t), n, t);
    }
    function Y(e) {
      return e.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
    }
    function Z(e) {
      return e && e.sensitive ? '' : 'i';
    }
    function ee(e, t, n) {
      return (function (e, t, n) {
        void 0 === n && (n = {});
        for (
          var s = n.strict,
            i = void 0 !== s && s,
            r = n.start,
            o = void 0 === r || r,
            a = n.end,
            l = void 0 === a || a,
            c = n.encode,
            h =
              void 0 === c
                ? function (e) {
                    return e;
                  }
                : c,
            u = '[' + Y(n.endsWith || '') + ']|$',
            p = '[' + Y(n.delimiter || '/#?') + ']',
            d = o ? '^' : '',
            f = 0,
            m = e;
          f < m.length;
          f++
        ) {
          var v = m[f];
          if ('string' == typeof v) d += Y(h(v));
          else {
            var g = Y(h(v.prefix)),
              _ = Y(h(v.suffix));
            if (v.pattern)
              if ((t && t.push(v), g || _))
                if ('+' === v.modifier || '*' === v.modifier) {
                  var x = '*' === v.modifier ? '?' : '';
                  d +=
                    '(?:' +
                    g +
                    '((?:' +
                    v.pattern +
                    ')(?:' +
                    _ +
                    g +
                    '(?:' +
                    v.pattern +
                    '))*)' +
                    _ +
                    ')' +
                    x;
                } else d += '(?:' + g + '(' + v.pattern + ')' + _ + ')' + v.modifier;
              else d += '(' + v.pattern + ')' + v.modifier;
            else d += '(?:' + g + _ + ')' + v.modifier;
          }
        }
        if (l) i || (d += p + '?'), (d += n.endsWith ? '(?=' + u + ')' : '$');
        else {
          var y = e[e.length - 1],
            b = 'string' == typeof y ? p.indexOf(y[y.length - 1]) > -1 : void 0 === y;
          i || (d += '(?:' + p + '(?=' + u + '))?'), b || (d += '(?=' + p + '|' + u + ')');
        }
        return new RegExp(d, Z(n));
      })(Q(e, n), t, n);
    }
    function te(e, t, n) {
      return e instanceof RegExp
        ? (function (e, t) {
            if (!t) return e;
            var n = e.source.match(/\((?!\?)/g);
            if (n)
              for (var s = 0; s < n.length; s++)
                t.push({ name: s, prefix: '', suffix: '', modifier: '', pattern: '' });
            return e;
          })(e, t)
        : Array.isArray(e)
        ? (function (e, t, n) {
            var s = e.map(function (e) {
              return te(e, t, n).source;
            });
            return new RegExp('(?:' + s.join('|') + ')', Z(n));
          })(e, t, n)
        : ee(e, t, n);
    }
    class ne extends G {}
    function se(e, t, n) {
      s(ie)(e, t, n);
    }
    let ie = (() => {
      let e = class {
        constructor() {
          (this.listeners = []),
            (this.root = '/'),
            window.addEventListener('popstate', () => {
              this.notifyListeners();
            });
        }
        getFragment() {
          let e = '';
          return (
            (e = this.normalize(location.pathname)),
            (e = '/' !== this.root ? e.replace(this.root, '') : e),
            this.normalize(e)
          );
        }
        navigate(e) {
          history.pushState(null, '', this.root + this.normalize(e)), this.notifyListeners();
        }
        listen(e) {
          return (
            this.listeners.push(e),
            () => {
              const t = this.listeners.indexOf(e);
              this.listeners.splice(t, 1);
            }
          );
        }
        match(e) {
          return X(this.normalize(e), { decode: decodeURIComponent });
        }
        normalize(e) {
          return e.toString().replace(/^\/|\/$/g, '');
        }
        notifyListeners() {
          this.listeners.forEach((e) => {
            e();
          });
        }
      };
      return (
        (e = a(
          [
            function (e) {
              e.provideInRoot = !0;
            },
          ],
          e
        )),
        e
      );
    })();
    const re = K(
      (() => {
        let e = class {
          constructor(e, t) {
            (this.router = e),
              (this.elRef = t),
              (this.path = this.elRef.getAttribute('path') || ''),
              (this.pathMatch = this.elRef.getAttribute('path-match') || 'startsWith'),
              (this.activeClass = this.elRef.getAttribute('active-class') || 'active'),
              (this.normalizedPath = this.router.normalize(this.path));
          }
          connectedCallback() {
            this.removeListener = this.router.listen(() => {
              this.setActiveClass();
            });
            const e = this.elRef.children[0];
            e &&
              e instanceof HTMLAnchorElement &&
              ((this.path = e.pathname), (this.normalizedPath = this.router.normalize(this.path))),
              (this.elRef.onclick = (e) => {
                e.preventDefault(), this.router.navigate(this.normalizedPath);
              }),
              this.setActiveClass();
          }
          disconnectedCallback() {
            this.removeListener && this.removeListener();
          }
          setActiveClass() {
            const e = this.router.getFragment();
            'full' === this.pathMatch
              ? e === this.normalizedPath
                ? this.elRef.classList.add(this.activeClass)
                : this.elRef.classList.remove(this.activeClass)
              : e.startsWith(this.normalizedPath)
              ? this.elRef.classList.add(this.activeClass)
              : this.elRef.classList.remove(this.activeClass);
          }
        };
        return (e = a([l(0, se), l(1, U)], e)), e;
      })()
    );
    const oe = K(
      (() => {
        let e = class {
          constructor(e, t) {
            (this.state = e), (this.router = t), (this.routes = []), (this.matchers = []);
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
            (this.matchers = this.routes.map((e) => this.router.match(e.path))), this.check();
          }
          check() {
            const e = this.router.getFragment();
            let t = null,
              n = null,
              s = null;
            for (
              let i = 0;
              i < this.matchers.length &&
              ((t = this.routes[i]), (n = this.matchers[i]), (s = n(e)), !s);
              i++
            );
            return t && n && s
              ? this.state.value.activeRoute && this.state.value.activeRoute.path === t.path
                ? Promise.resolve(void 0)
                : this.resolve(t, s)
              : this.state.setValue({});
          }
          resolve(e, t) {
            return Promise.resolve(e.component()).then((n) => {
              if ('componentInjector' in n) {
                return n.componentInjector
                  .get(ne)
                  .setValue(t)
                  .then(() => this.state.setValue({ element: n, activeRoute: e }));
              }
              return this.state.setValue({ element: n, activeRoute: e });
            });
          }
        };
        return (
          a(
            [
              function (e, t) {
                (e.constructor.props = e.constructor.props || []), e.constructor.props.push(t);
              },
            ],
            e.prototype,
            'routes',
            void 0
          ),
          (e = a(
            [
              J({
                providers: [{ provide: c, useClass: class extends c {} }],
                state: {},
                render({ state: e, host: t }) {
                  let n = t.lastElementChild;
                  for (; n; ) t.removeChild(n), (n = t.lastElementChild);
                  e.element && t.append(e.element);
                },
              }),
              l(0, q),
              l(1, se),
            ],
            e
          )),
          e
        );
      })()
    );
    customElements.define('router-link', re), customElements.define('router-outlet', oe);
    let ae = (() => {
      let e = class {};
      return (
        (e = a(
          [
            J({
              state: { title: 'Page2Component Works!' },
              render: ({ state: e }) => D` <h3>${e.title}</h3> `,
            }),
          ],
          e
        )),
        e
      );
    })();
    customElements.define('page-2-component', K(ae));
    const le = [{ path: '/foo/bar', component: () => document.createElement('page-2-component') }];
    let ce = (() => {
      let e = class {};
      return (
        (e = a(
          [
            J({
              state: { title: 'Page1Component Works!' },
              render: ({ state: e }) => D`
      <h2>${e.title}</h2>

      <router-outlet .routes=${le}></router-outlet>
    `,
            }),
          ],
          e
        )),
        e
      );
    })();
    customElements.define('page-1-component', K(ce));
    const he = [
      {
        path: '/test',
        component: () => {
          const e = document.createElement('div');
          return (e.innerHTML = 'Hello World'), e;
        },
      },
      { path: '/foo(.*)', component: () => document.createElement('page-1-component') },
    ];
    let ue = (() => {
      let e = class {};
      return (
        (e = a(
          [
            J({
              state: { title: 'Hello World' },
              render: ({ state: e }) => D`
      <header>
        <h1>${e.title}</h1>
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

      <router-outlet .routes=${he}></router-outlet>

      <footer>The Footer</footer>
    `,
            }),
          ],
          e
        )),
        e
      );
    })();
    customElements.define('app-root', K(ue));
  },
});
