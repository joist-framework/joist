!(function (e) {
  var t = {};
  function n(s) {
    if (t[s]) return t[s].exports;
    var o = (t[s] = { i: s, l: !1, exports: {} });
    return e[s].call(o.exports, o, o.exports, n), (o.l = !0), o.exports;
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
        for (var o in e)
          n.d(
            s,
            o,
            function (t) {
              return e[t];
            }.bind(null, o)
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
    class o {
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
    function i(e = []) {
      return (r = new o({ providers: e })), r;
    }
    function a(e, t, n, s) {
      var o,
        r = arguments.length,
        i = r < 3 ? t : null === s ? (s = Object.getOwnPropertyDescriptor(t, n)) : s;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        i = Reflect.decorate(e, t, n, s);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (o = e[a]) && (i = (r < 3 ? o(i) : r > 3 ? o(t, n, i) : o(t, n)) || i);
      return r > 3 && i && Object.defineProperty(t, n, i), i;
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
    const d = new WeakMap(),
      u = (e) => 'function' == typeof e && d.has(e),
      h =
        'undefined' != typeof window &&
        null != window.customElements &&
        void 0 !== window.customElements.polyfillWrapFlushCallback,
      p = (e, t, n = null) => {
        for (; t !== n; ) {
          const n = t.nextSibling;
          e.removeChild(t), (t = n);
        }
      },
      m = {},
      g = {},
      f = `{{lit-${String(Math.random()).slice(2)}}}`,
      b = `\x3c!--${f}--\x3e`,
      v = new RegExp(`${f}|${b}`);
    class _ {
      constructor(e, t) {
        (this.parts = []), (this.element = t);
        const n = [],
          s = [],
          o = document.createTreeWalker(t.content, 133, null, !1);
        let r = 0,
          i = -1,
          a = 0;
        const {
          strings: l,
          values: { length: c },
        } = e;
        for (; a < c; ) {
          const e = o.nextNode();
          if (null !== e) {
            if ((i++, 1 === e.nodeType)) {
              if (e.hasAttributes()) {
                const t = e.attributes,
                  { length: n } = t;
                let s = 0;
                for (let e = 0; e < n; e++) y(t[e].name, '$lit$') && s++;
                for (; s-- > 0; ) {
                  const t = l[a],
                    n = E.exec(t)[2],
                    s = n.toLowerCase() + '$lit$',
                    o = e.getAttribute(s);
                  e.removeAttribute(s);
                  const r = o.split(v);
                  this.parts.push({ type: 'attribute', index: i, name: n, strings: r }),
                    (a += r.length - 1);
                }
              }
              'TEMPLATE' === e.tagName && (s.push(e), (o.currentNode = e.content));
            } else if (3 === e.nodeType) {
              const t = e.data;
              if (t.indexOf(f) >= 0) {
                const s = e.parentNode,
                  o = t.split(v),
                  r = o.length - 1;
                for (let t = 0; t < r; t++) {
                  let n,
                    r = o[t];
                  if ('' === r) n = w();
                  else {
                    const e = E.exec(r);
                    null !== e &&
                      y(e[2], '$lit$') &&
                      (r = r.slice(0, e.index) + e[1] + e[2].slice(0, -'$lit$'.length) + e[3]),
                      (n = document.createTextNode(r));
                  }
                  s.insertBefore(n, e), this.parts.push({ type: 'node', index: ++i });
                }
                '' === o[r] ? (s.insertBefore(w(), e), n.push(e)) : (e.data = o[r]), (a += r);
              }
            } else if (8 === e.nodeType)
              if (e.data === f) {
                const t = e.parentNode;
                (null !== e.previousSibling && i !== r) || (i++, t.insertBefore(w(), e)),
                  (r = i),
                  this.parts.push({ type: 'node', index: i }),
                  null === e.nextSibling ? (e.data = '') : (n.push(e), i--),
                  a++;
              } else {
                let t = -1;
                for (; -1 !== (t = e.data.indexOf(f, t + 1)); )
                  this.parts.push({ type: 'node', index: -1 }), a++;
              }
          } else o.currentNode = s.pop();
        }
        for (const e of n) e.parentNode.removeChild(e);
      }
    }
    const y = (e, t) => {
        const n = e.length - t.length;
        return n >= 0 && e.slice(n) === t;
      },
      x = (e) => -1 !== e.index,
      w = () => document.createComment(''),
      E = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
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
    class B {
      constructor(e, t, n) {
        (this.__parts = []), (this.template = e), (this.processor = t), (this.options = n);
      }
      update(e) {
        let t = 0;
        for (const n of this.__parts) void 0 !== n && n.setValue(e[t]), t++;
        for (const e of this.__parts) void 0 !== e && e.commit();
      }
      _clone() {
        const e = h
            ? this.template.element.content.cloneNode(!0)
            : document.importNode(this.template.element.content, !0),
          t = [],
          n = this.template.parts,
          s = document.createTreeWalker(e, 133, null, !1);
        let o,
          r = 0,
          i = 0,
          a = s.nextNode();
        for (; r < n.length; )
          if (((o = n[r]), x(o))) {
            for (; i < o.index; )
              i++,
                'TEMPLATE' === a.nodeName && (t.push(a), (s.currentNode = a.content)),
                null === (a = s.nextNode()) && ((s.currentNode = t.pop()), (a = s.nextNode()));
            if ('node' === o.type) {
              const e = this.processor.handleTextExpression(this.options);
              e.insertAfterNode(a.previousSibling), this.__parts.push(e);
            } else
              this.__parts.push(
                ...this.processor.handleAttributeExpressions(a, o.name, o.strings, this.options)
              );
            r++;
          } else this.__parts.push(void 0), r++;
        return h && (document.adoptNode(e), customElements.upgrade(e)), e;
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
     */ const N = ` ${f} `;
    class V {
      constructor(e, t, n, s) {
        (this.strings = e), (this.values = t), (this.type = n), (this.processor = s);
      }
      getHTML() {
        const e = this.strings.length - 1;
        let t = '',
          n = !1;
        for (let s = 0; s < e; s++) {
          const e = this.strings[s],
            o = e.lastIndexOf('\x3c!--');
          n = (o > -1 || n) && -1 === e.indexOf('--\x3e', o + 1);
          const r = E.exec(e);
          t +=
            null === r ? e + (n ? N : b) : e.substr(0, r.index) + r[1] + r[2] + '$lit$' + r[3] + f;
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
    const S = (e) => null === e || !('object' == typeof e || 'function' == typeof e),
      C = (e) => Array.isArray(e) || !(!e || !e[Symbol.iterator]);
    class k {
      constructor(e, t, n) {
        (this.dirty = !0),
          (this.element = e),
          (this.name = t),
          (this.strings = n),
          (this.parts = []);
        for (let e = 0; e < n.length - 1; e++) this.parts[e] = this._createPart();
      }
      _createPart() {
        return new T(this);
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
            if (S(e) || !C(e)) n += 'string' == typeof e ? e : String(e);
            else for (const t of e) n += 'string' == typeof t ? t : String(t);
          }
        }
        return (n += e[t]), n;
      }
      commit() {
        this.dirty && ((this.dirty = !1), this.element.setAttribute(this.name, this._getValue()));
      }
    }
    class T {
      constructor(e) {
        (this.value = void 0), (this.committer = e);
      }
      setValue(e) {
        e === m ||
          (S(e) && e === this.value) ||
          ((this.value = e), u(e) || (this.committer.dirty = !0));
      }
      commit() {
        for (; u(this.value); ) {
          const e = this.value;
          (this.value = m), e(this);
        }
        this.value !== m && this.committer.commit();
      }
    }
    class $ {
      constructor(e) {
        (this.value = void 0), (this.__pendingValue = void 0), (this.options = e);
      }
      appendInto(e) {
        (this.startNode = e.appendChild(w())), (this.endNode = e.appendChild(w()));
      }
      insertAfterNode(e) {
        (this.startNode = e), (this.endNode = e.nextSibling);
      }
      appendIntoPart(e) {
        e.__insert((this.startNode = w())), e.__insert((this.endNode = w()));
      }
      insertAfterPart(e) {
        e.__insert((this.startNode = w())),
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
          (this.__pendingValue = m), e(this);
        }
        const e = this.__pendingValue;
        e !== m &&
          (S(e)
            ? e !== this.value && this.__commitText(e)
            : e instanceof V
            ? this.__commitTemplateResult(e)
            : e instanceof Node
            ? this.__commitNode(e)
            : C(e)
            ? this.__commitIterable(e)
            : e === g
            ? ((this.value = g), this.clear())
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
        if (this.value instanceof B && this.value.template === t) this.value.update(e.values);
        else {
          const n = new B(t, e.processor, this.options),
            s = n._clone();
          n.update(e.values), this.__commitNode(s), (this.value = n);
        }
      }
      __commitIterable(e) {
        Array.isArray(this.value) || ((this.value = []), this.clear());
        const t = this.value;
        let n,
          s = 0;
        for (const o of e)
          (n = t[s]),
            void 0 === n &&
              ((n = new $(this.options)),
              t.push(n),
              0 === s ? n.appendIntoPart(this) : n.insertAfterPart(t[s - 1])),
            n.setValue(o),
            n.commit(),
            s++;
        s < t.length && ((t.length = s), this.clear(n && n.endNode));
      }
      clear(e = this.startNode) {
        p(this.startNode.parentNode, e.nextSibling, this.endNode);
      }
    }
    class A {
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
          (this.__pendingValue = m), e(this);
        }
        if (this.__pendingValue === m) return;
        const e = !!this.__pendingValue;
        this.value !== e &&
          (e ? this.element.setAttribute(this.name, '') : this.element.removeAttribute(this.name),
          (this.value = e)),
          (this.__pendingValue = m);
      }
    }
    class L extends k {
      constructor(e, t, n) {
        super(e, t, n), (this.single = 2 === n.length && '' === n[0] && '' === n[1]);
      }
      _createPart() {
        return new D(this);
      }
      _getValue() {
        return this.single ? this.parts[0].value : super._getValue();
      }
      commit() {
        this.dirty && ((this.dirty = !1), (this.element[this.name] = this._getValue()));
      }
    }
    class D extends T {}
    let P = !1;
    (() => {
      try {
        const e = {
          get capture() {
            return (P = !0), !1;
          },
        };
        window.addEventListener('test', e, e), window.removeEventListener('test', e, e);
      } catch (e) {}
    })();
    class I {
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
          (this.__pendingValue = m), e(this);
        }
        if (this.__pendingValue === m) return;
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
          (this.__pendingValue = m);
      }
      handleEvent(e) {
        'function' == typeof this.value
          ? this.value.call(this.eventContext || this.element, e)
          : this.value.handleEvent(e);
      }
    }
    const j = (e) =>
      e && (P ? { capture: e.capture, passive: e.passive, once: e.once } : e.capture);
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
     */ const M = new (class {
      handleAttributeExpressions(e, t, n, s) {
        const o = t[0];
        if ('.' === o) {
          return new L(e, t.slice(1), n).parts;
        }
        return '@' === o
          ? [new I(e, t.slice(1), s.eventContext)]
          : '?' === o
          ? [new A(e, t.slice(1), n)]
          : new k(e, t, n).parts;
      }
      handleTextExpression(e) {
        return new $(e);
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
     */ function O(e) {
      let t = R.get(e.type);
      void 0 === t &&
        ((t = { stringsArray: new WeakMap(), keyString: new Map() }), R.set(e.type, t));
      let n = t.stringsArray.get(e.strings);
      if (void 0 !== n) return n;
      const s = e.strings.join(f);
      return (
        (n = t.keyString.get(s)),
        void 0 === n && ((n = new _(e, e.getTemplateElement())), t.keyString.set(s, n)),
        t.stringsArray.set(e.strings, n),
        n
      );
    }
    const R = new Map(),
      F = new WeakMap();
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
    const W = (e, ...t) => new V(e, t, 'html', M);
    class Y extends c {
      render(e, t) {
        ((e, t, n) => {
          let s = F.get(t);
          void 0 === s &&
            (p(t, t.firstChild),
            F.set(t, (s = new $(Object.assign({ templateFactory: O }, n)))),
            s.appendInto(t)),
            s.setValue(e),
            s.commit();
        })(e, t.shadowRoot || t);
      }
    }
    i([{ provide: c, useClass: Y }]);
    function H(e) {
      return function (t, n) {
        const s = t.constructor;
        (s.handlers = s.handlers || {}),
          (s.handlers[e] = s.handlers[e] || []),
          s.handlers[e].push(n);
      };
    }
    function G(e = {}) {
      return function (t) {
        Object.defineProperty(t, 'componentDef', { get: () => e });
      };
    }
    class z {}
    function U(e, t, n) {
      s(z)(e, t, n);
    }
    function K(e, t, n) {
      s(q)(e, t, n);
    }
    class q {
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
    function J(e, t = {}) {
      var n;
      const s = e.props || [];
      const a = (function (e) {
          return e.componentDef || {};
        })(e),
        l = a.providers || [],
        d =
          (((n = class extends (t.extends || HTMLElement) {
            constructor() {
              super(),
                (this.componentInjector = new o(
                  {
                    providers: l.concat([
                      { provide: z, useFactory: () => this, deps: [] },
                      { provide: q, useFactory: () => new q(a.state), deps: [] },
                    ]),
                    bootstrap: l.map((e) => e.provide),
                  },
                  t.root || r || i()
                )),
                (this.componentInstance = this.componentInjector.create(e)),
                a.useShadowDom && this.attachShadow({ mode: 'open' });
            }
            connectedCallback() {
              !(function (e, t) {
                const n = e.componentInstance.constructor.handlers || {},
                  s = e.componentInjector.get(c),
                  o = e.componentInjector.get(q),
                  r = (t, s) => (o) => {
                    t in n &&
                      n[t].forEach((t) => {
                        e.componentInstance[t].call(e.componentInstance, o, s);
                      });
                  },
                  i = (t, n) => () => {
                    e.dispatchEvent(new CustomEvent(t, n));
                  },
                  a = (n) => {
                    t.render && s.render(t.render({ state: n, run: r, dispatch: i, host: e }), e);
                  };
                a(o.value),
                  o.onChange((e) => {
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
        Object.defineProperty(d.prototype, t, {
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
      return d;
    }
    let Q = (() => {
      let e = class {
        constructor(e, t) {
          (this.elRef = e), (this.state = t), (this.selectedBands = []);
        }
        onPropChanges() {
          this.state.setValue({ bandLimit: this.bandLimit, selectedBands: this.selectedBands });
        }
        onBandSelected(e, t) {
          this.elRef.dispatchEvent(new CustomEvent('band_count_selected', { detail: t }));
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
          'bandLimit',
          void 0
        ),
        a(
          [
            function (e, t) {
              (e.constructor.props = e.constructor.props || []), e.constructor.props.push(t);
            },
          ],
          e.prototype,
          'selectedBands',
          void 0
        ),
        a([H('BAND_SELECTED')], e.prototype, 'onBandSelected', null),
        (e = a(
          [
            G({
              state: { bandLimit: 0, selectedBands: [] },
              useShadowDom: !0,
              render: ({ state: e, run: t }) => W`
      <style>
        :host {
          display: block;
          position: relative;
        }

        res-animator {
          position: absolute;
          left: 0.5rem;
          right: 0.5rem;
          top: 0;
        }

        button {
          background: var(--color-primary);
          border: none;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
          padding: 1rem;
          cursor: pointer;
          color: #fff;
          font-size: 1rem;
          display: block;
          width: 100%;
          margin-bottom: 1rem;
          border-radius: 0.4rem;
        }

        .band-buttons {
          display: flex;
        }

        .band-buttons button {
          flex-grow: 1;
          margin-right: 1rem;
          margin-bottom: 0;
        }

        .band-buttons button:last-child {
          margin-right: 0;
        }

        .scale-in {
          animation: scale-in 0.3s;
        }

        @keyframes scale-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }

          100% {
            transform: translateY(1);
            opacity: 1;
          }
        }
      </style>

      ${
        e.bandLimit
          ? W` <button class="scale-in" @click=${t('BAND_SELECTED', 0)}>clear</button> `
          : W`
            <div class="band-buttons scale-in">
              <button @click=${t('BAND_SELECTED', 4)}>4 Bands</button>
              <button @click=${t('BAND_SELECTED', 5)}>5 Bands</button>
              <button @click=${t('BAND_SELECTED', 6)}>6 Bands</button>
            </div>
          `
      }
    `,
            }),
            l(0, U),
            l(1, K),
          ],
          e
        )),
        e
      );
    })();
    customElements.define('select-band-count', J(Q));
    let X = (() => {
      let e = class {
        constructor(e) {
          (this.state = e), (this.bands = []);
        }
        onPropChanges() {
          this.state.setValue(this.bands);
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
          'bands',
          void 0
        ),
        (e = a(
          [
            G({
              state: [],
              useShadowDom: !0,
              render: ({ state: e }) => W`
      <style>
        :host {
          display: flex;
          align-items: center;
          --border: solid 1px gray;
          --background: linear-gradient(
            to bottom,
            rgb(224, 224, 224) 0%,
            rgba(204, 204, 204, 1) 100%
          );
        }

        :host::before,
        :host::after {
          content: '';
          height: 0.4rem;
          background: gray;
          width: 1.5rem;
        }

        .middle {
          background: var(--background);
          height: 5rem;
          margin: 0 -30px;
          position: relative;
          flex-grow: 1;
          display: flex;
          justify-content: space-between;
        }

        .start,
        .end {
          background: var(--background);
          border-radius: 50%;
          width: 6rem;
          height: 5.5rem;
        }

        @keyframes grow {
          0% {
            transform: scaleY(0);
          }

          100% {
            transform: scaleY(1);
          }
        }

        .band {
          animation: grow;
          animation-duration: 300ms;
          width: 0.5rem;
          height: 100%;
        }

        .band:last-child {
          margin-right: 0;
        }
      </style>

      <section class="start"></section>

      <section class="middle">
        ${e.map((e) => W` <div class="band" .style="background: ${e.color}"></div> `)}
      </section>

      <section class="end"></section>
    `,
            }),
            l(0, K),
          ],
          e
        )),
        e
      );
    })();
    customElements.define('resistor-value', J(X));
    let Z = (() => {
      let e = class {
        constructor(e, t) {
          (this.elRef = e), (this.state = t), (this.bands = []);
        }
        onPropChanges() {
          this.state.setValue({ bands: this.bands });
        }
        onBandSelected(e, t) {
          this.elRef.dispatchEvent(new CustomEvent('band_selected', { detail: t }));
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
          'bands',
          void 0
        ),
        a([H('BAND_SELECTED')], e.prototype, 'onBandSelected', null),
        (e = a(
          [
            G({
              state: { bands: [] },
              useShadowDom: !0,
              render: ({ state: e, run: t }) => W`
      <style>
        :host {
          display: block;
          position: relative;
          padding: 0.5rem 0;
          background: #fff;
          box-shadow: 0 -7px 6px rgba(0, 0, 0, 0.05);
          overflow-y: auto;
        }

        button {
          align-items: center;
          background: none;
          font-size: 1rem;
          display: flex;
          padding: 0.5rem 1rem;
          border: none;
          width: 100%;
          cursor: pointer;
        }

        .color-block {
          border-radius: 10px;
          height: 2rem;
          width: 5rem;
          display: inline-block;
          margin-right: 1rem;
        }
      </style>

      ${e.bands.map(
        (e) => W`
          <button @click=${t('BAND_SELECTED', e)}>
            <div class="color-block" .style="background: ${e.color}"></div>

            <span>${e.color}</span>
          </button>
        `
      )}
    `,
            }),
            l(0, U),
            l(1, K),
          ],
          e
        )),
        e
      );
    })();
    var ee;
    function te(e, t, n) {
      s(ne)(e, t, n);
    }
    customElements.define('select-band-color', J(Z)),
      (function (e) {
        (e.Black = 'black'),
          (e.Brown = 'brown'),
          (e.Red = 'red'),
          (e.Organge = 'orange'),
          (e.Yellow = 'yellow'),
          (e.Green = 'green'),
          (e.Blue = 'blue'),
          (e.Violet = 'violet'),
          (e.Grey = 'grey'),
          (e.White = 'white'),
          (e.Gold = 'gold'),
          (e.Silver = 'silver');
      })(ee || (ee = {}));
    let ne = (() => {
        let e = class {
          constructor() {
            this.bands = [
              { color: ee.Black, value: 0, multiplier: 1 },
              { color: ee.Brown, value: 1, multiplier: 10, tolerance: 1 },
              { color: ee.Red, value: 2, multiplier: 100, tolerance: 2 },
              { color: ee.Organge, value: 3, multiplier: 1e3 },
              { color: ee.Yellow, value: 4, multiplier: 1e4 },
              { color: ee.Green, value: 5, multiplier: 1e5, tolerance: 0.5 },
              { color: ee.Blue, value: 6, multiplier: 1e6, tolerance: 0.25 },
              { color: ee.Violet, value: 7, multiplier: 1e7, tolerance: 0.1 },
              { color: ee.Grey, value: 8, tolerance: 0.05 },
              { color: ee.White, value: 9 },
              { color: ee.Gold, multiplier: 0.1, tolerance: 5 },
              { color: ee.Silver, multiplier: 0.01, tolerance: 10 },
            ];
          }
          getResistorBands() {
            return this.bands;
          }
          getValueBands() {
            return this.bands.filter((e) => void 0 !== e.value);
          }
          getMultiplierBands() {
            return this.bands.filter((e) => !!e.multiplier);
          }
          getToleranceBands() {
            return this.bands.filter((e) => !!e.tolerance);
          }
          getResistorValue(e, t) {
            const n = e[t - 2],
              s = e[t - 1],
              o = this.getValue(e, t),
              r = this.multiply(o, n),
              i = this.getReadableValue(r);
            return this.getTolerance(i, s);
          }
          getValue(e, t) {
            return Number(e.filter((e, n) => n + 2 < t).reduce((e, t) => e + t.value, ''));
          }
          multiply(e, t) {
            return t && t.multiplier ? e * t.multiplier : e;
          }
          getReadableValue(e) {
            return e >= 1e6
              ? (e / 1e6).toString() + 'M'
              : e >= 1e3
              ? (e / 1e3).toString() + 'K'
              : e.toString();
          }
          getTolerance(e, t) {
            return t ? e + ' ±' + t.tolerance : e;
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
      })(),
      se = (() => {
        let e = class {
          constructor(e, t) {
            (this.resistor = e), (this.state = t);
          }
          connectedCallback() {
            const e = this.resistor.getResistorBands();
            this.state.patchValue({ bands: e });
          }
          onBandCountSelected(e) {
            const t = e.detail;
            this.state.patchValue({
              selectedBands: [],
              resistorValue: void 0,
              bandLimit: t,
              displayColors: t > 0,
              availableBands: this.getAvailableBands([], t),
            });
          }
          onBandSelected(e) {
            if (this.state.value.selectedBands.length >= this.state.value.bandLimit) return;
            const t = [...this.state.value.selectedBands, e.detail];
            this.state.patchValue({
              selectedBands: t,
              availableBands: this.getAvailableBands(t, this.state.value.bandLimit),
              resistorValue: this.resistor.getResistorValue(t, this.state.value.bandLimit),
            });
          }
          getAvailableBands(e, t) {
            return e.length + 1 === t - 1
              ? this.resistor.getMultiplierBands()
              : e.length + 1 === t
              ? this.resistor.getToleranceBands()
              : this.resistor.getValueBands();
          }
        };
        return (
          a([H('BAND_COUNT_SELECTED')], e.prototype, 'onBandCountSelected', null),
          a([H('BAND_SELECTED')], e.prototype, 'onBandSelected', null),
          (e = a(
            [
              G({
                state: {
                  bandLimit: 0,
                  bands: [],
                  selectedBands: [],
                  availableBands: [],
                  displayColors: !1,
                },
                useShadowDom: !0,
                render: ({ state: e, run: t }) => W`
      <style>
        select-band-color {
          position: absolute;
          top: 20rem;
          left: 0;
          right: 0;
          bottom: 0;
        }

        resistor-value {
          margin: 1.3rem 0;
        }

        select-band-count {
          margin: 0 1rem;
        }

        .value {
          text-align: center;
          font-size: 2rem;
        }

        .slide-up {
          animation: slide-up 0.2s;
          transform: translateY(0);
          display: block;
        }

        .slide-down {
          animation: slide-down 0.2s;
          transform: translateY(150%);
        }

        @keyframes slide-up {
          0% {
            transform: translateY(100%);
          }

          100% {
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          0% {
            display: block;
            transform: translateY(0);
          }

          100% {
            display: none;
            transform: translateY(100%);
          }
        }
      </style>

      <div class="value">
        ${
          e.displayColors
            ? e.selectedBands.length < e.bandLimit
              ? W` <span>${e.selectedBands.length}/${e.bandLimit} Bands</span> `
              : W` <span>${e.resistorValue} &#8486;</span> `
            : W` <span>Select Resistor Bands</span> `
        }
      </div>

      <resistor-value .bands=${e.selectedBands}></resistor-value>

      <select-band-count
        .bandLimit=${e.bandLimit}
        .selectedBands=${e.selectedBands}
        @band_count_selected=${t('BAND_COUNT_SELECTED')}
      ></select-band-count>

      <select-band-color
        class="${e.displayColors ? 'slide-up' : 'slide-down'}"
        .bands=${e.availableBands}
        @band_selected=${t('BAND_SELECTED')}
      ></select-band-color>
    `,
              }),
              l(0, te),
              l(1, K),
            ],
            e
          )),
          e
        );
      })();
    customElements.define('app-root', J(se)),
      navigator.serviceWorker.register('/service-worker.js').then(
        function (e) {
          console.log('ServiceWorker registration successful with scope: ', e.scope);
        },
        function (e) {
          console.log('ServiceWorker registration failed: ', e);
        }
      );
  },
});
