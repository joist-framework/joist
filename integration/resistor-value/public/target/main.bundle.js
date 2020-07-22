!(function (e) {
  var t = {};
  function s(n) {
    if (t[n]) return t[n].exports;
    var i = (t[n] = { i: n, l: !1, exports: {} });
    return e[n].call(i.exports, i, i.exports, s), (i.l = !0), i.exports;
  }
  (s.m = e),
    (s.c = t),
    (s.d = function (e, t, n) {
      s.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: n });
    }),
    (s.r = function (e) {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(e, '__esModule', { value: !0 });
    }),
    (s.t = function (e, t) {
      if ((1 & t && (e = s(e)), 8 & t)) return e;
      if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
      var n = Object.create(null);
      if (
        (s.r(n),
        Object.defineProperty(n, 'default', { enumerable: !0, value: e }),
        2 & t && 'string' != typeof e)
      )
        for (var i in e)
          s.d(
            n,
            i,
            function (t) {
              return e[t];
            }.bind(null, i)
          );
      return n;
    }),
    (s.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return s.d(t, 'a', t), t;
    }),
    (s.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (s.p = ''),
    s((s.s = 2));
})({
  2: function (e, t, s) {
    'use strict';
    s.r(t);
    function n(e, t, s, n) {
      var i,
        r = arguments.length,
        o = r < 3 ? t : null === n ? (n = Object.getOwnPropertyDescriptor(t, s)) : n;
      if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
        o = Reflect.decorate(e, t, s, n);
      else
        for (var a = e.length - 1; a >= 0; a--)
          (i = e[a]) && (o = (r < 3 ? i(o) : r > 3 ? i(t, s, o) : i(t, s)) || o);
      return r > 3 && o && Object.defineProperty(t, s, o), o;
    }
    Object.create;
    Object.create;
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
          ? this.create(t.use)
          : this.parent &&
            ((function (e) {
              return e.provideInRoot || !1;
            })(e) ||
              this.parent.has(e))
          ? this.parent.get(e)
          : this.create(e);
      }
      findProvider(e) {
        if (this.opts.providers) return this.opts.providers.find((t) => t.provide === e);
      }
    }
    let r;
    function o() {
      return (
        r ||
        (function (e = []) {
          return (r = new i({ providers: e })), r;
        })()
      );
    }
    class a {
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
            this.setValue({ ...this.value, ...t });
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
    function l(e = {}) {
      return function (t) {
        Object.defineProperty(t, 'componentDef', { get: () => e });
      };
    }
    function c(e) {
      return function (t, s) {
        const n = t.constructor;
        (n.handlers = n.handlers || {}),
          (n.handlers[e] = n.handlers[e] || []),
          n.handlers[e].push(s);
      };
    }
    function d(e) {
      return function (t, s) {
        Object.defineProperty(t, s, {
          get() {
            return this.injector.get(e);
          },
        });
      };
    }
    class u extends HTMLElement {
      constructor() {
        super(), (this.componentDef = this.constructor.componentDef || {});
        const e = this.componentDef.state,
          t = this.componentDef.providers || [];
        this.injector = new i(
          {
            providers: t.concat([
              {
                provide: a,
                use: class extends a {
                  constructor() {
                    super(e);
                  }
                },
              },
            ]),
            bootstrap: t.map((e) => e.provide),
          },
          o()
        );
      }
      connectedCallback() {
        const e = this.constructor.handlers || {};
        const t = this.injector.get(a),
          s = {
            state: t.value,
            run: (t, s) => (n) => {
              t in e &&
                e[t].forEach((e) => {
                  this[e].call(this, n, s);
                });
            },
            dispatch: (e, t) => () => {
              this.dispatchEvent(new CustomEvent(e, t));
            },
            host: this,
          },
          n = (e) => {
            (s.state = e), this.componentDef.render && this.componentDef.render(s);
          };
        n(t.value),
          t.onChange((e) => {
            n(e);
          });
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
     */ const h = new WeakMap(),
      p = (e) => 'function' == typeof e && h.has(e),
      m =
        'undefined' != typeof window &&
        null != window.customElements &&
        void 0 !== window.customElements.polyfillWrapFlushCallback,
      g = (e, t, s = null) => {
        for (; t !== s; ) {
          const s = t.nextSibling;
          e.removeChild(t), (t = s);
        }
      },
      v = {},
      b = {},
      f = `{{lit-${String(Math.random()).slice(2)}}}`,
      _ = `\x3c!--${f}--\x3e`;
    new RegExp(`${f}|${_}`);
    const y = (e) => -1 !== e.index,
      x = () => document.createComment(''),
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
    class V {
      constructor(e, t, s) {
        (this.__parts = []), (this.template = e), (this.processor = t), (this.options = s);
      }
      update(e) {
        let t = 0;
        for (const s of this.__parts) void 0 !== s && s.setValue(e[t]), t++;
        for (const e of this.__parts) void 0 !== e && e.commit();
      }
      _clone() {
        const e = m
            ? this.template.element.content.cloneNode(!0)
            : document.importNode(this.template.element.content, !0),
          t = [],
          s = this.template.parts,
          n = document.createTreeWalker(e, 133, null, !1);
        let i,
          r = 0,
          o = 0,
          a = n.nextNode();
        for (; r < s.length; )
          if (((i = s[r]), y(i))) {
            for (; o < i.index; )
              o++,
                'TEMPLATE' === a.nodeName && (t.push(a), (n.currentNode = a.content)),
                null === (a = n.nextNode()) && ((n.currentNode = t.pop()), (a = n.nextNode()));
            if ('node' === i.type) {
              const e = this.processor.handleTextExpression(this.options);
              e.insertAfterNode(a.previousSibling), this.__parts.push(e);
            } else
              this.__parts.push(
                ...this.processor.handleAttributeExpressions(a, i.name, i.strings, this.options)
              );
            r++;
          } else this.__parts.push(void 0), r++;
        return m && (document.adoptNode(e), customElements.upgrade(e)), e;
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
    class B {
      constructor(e, t, s, n) {
        (this.strings = e), (this.values = t), (this.type = s), (this.processor = n);
      }
      getHTML() {
        const e = this.strings.length - 1;
        let t = '',
          s = !1;
        for (let n = 0; n < e; n++) {
          const e = this.strings[n],
            i = e.lastIndexOf('\x3c!--');
          s = (i > -1 || s) && -1 === e.indexOf('--\x3e', i + 1);
          const r = w.exec(e);
          t +=
            null === r ? e + (s ? N : _) : e.substr(0, r.index) + r[1] + r[2] + '$lit$' + r[3] + f;
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
    const E = (e) => null === e || !('object' == typeof e || 'function' == typeof e),
      k = (e) => Array.isArray(e) || !(!e || !e[Symbol.iterator]);
    class S {
      constructor(e, t, s) {
        (this.dirty = !0),
          (this.element = e),
          (this.name = t),
          (this.strings = s),
          (this.parts = []);
        for (let e = 0; e < s.length - 1; e++) this.parts[e] = this._createPart();
      }
      _createPart() {
        return new $(this);
      }
      _getValue() {
        const e = this.strings,
          t = e.length - 1;
        let s = '';
        for (let n = 0; n < t; n++) {
          s += e[n];
          const t = this.parts[n];
          if (void 0 !== t) {
            const e = t.value;
            if (E(e) || !k(e)) s += 'string' == typeof e ? e : String(e);
            else for (const t of e) s += 'string' == typeof t ? t : String(t);
          }
        }
        return (s += e[t]), s;
      }
      commit() {
        this.dirty && ((this.dirty = !1), this.element.setAttribute(this.name, this._getValue()));
      }
    }
    class $ {
      constructor(e) {
        (this.value = void 0), (this.committer = e);
      }
      setValue(e) {
        e === v ||
          (E(e) && e === this.value) ||
          ((this.value = e), p(e) || (this.committer.dirty = !0));
      }
      commit() {
        for (; p(this.value); ) {
          const e = this.value;
          (this.value = v), e(this);
        }
        this.value !== v && this.committer.commit();
      }
    }
    class T {
      constructor(e) {
        (this.value = void 0), (this.__pendingValue = void 0), (this.options = e);
      }
      appendInto(e) {
        (this.startNode = e.appendChild(x())), (this.endNode = e.appendChild(x()));
      }
      insertAfterNode(e) {
        (this.startNode = e), (this.endNode = e.nextSibling);
      }
      appendIntoPart(e) {
        e.__insert((this.startNode = x())), e.__insert((this.endNode = x()));
      }
      insertAfterPart(e) {
        e.__insert((this.startNode = x())),
          (this.endNode = e.endNode),
          (e.endNode = this.startNode);
      }
      setValue(e) {
        this.__pendingValue = e;
      }
      commit() {
        if (null === this.startNode.parentNode) return;
        for (; p(this.__pendingValue); ) {
          const e = this.__pendingValue;
          (this.__pendingValue = v), e(this);
        }
        const e = this.__pendingValue;
        e !== v &&
          (E(e)
            ? e !== this.value && this.__commitText(e)
            : e instanceof B
            ? this.__commitTemplateResult(e)
            : e instanceof Node
            ? this.__commitNode(e)
            : k(e)
            ? this.__commitIterable(e)
            : e === b
            ? ((this.value = b), this.clear())
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
          s = 'string' == typeof (e = null == e ? '' : e) ? e : String(e);
        t === this.endNode.previousSibling && 3 === t.nodeType
          ? (t.data = s)
          : this.__commitNode(document.createTextNode(s)),
          (this.value = e);
      }
      __commitTemplateResult(e) {
        const t = this.options.templateFactory(e);
        if (this.value instanceof V && this.value.template === t) this.value.update(e.values);
        else {
          const s = new V(t, e.processor, this.options),
            n = s._clone();
          s.update(e.values), this.__commitNode(n), (this.value = s);
        }
      }
      __commitIterable(e) {
        Array.isArray(this.value) || ((this.value = []), this.clear());
        const t = this.value;
        let s,
          n = 0;
        for (const i of e)
          (s = t[n]),
            void 0 === s &&
              ((s = new T(this.options)),
              t.push(s),
              0 === n ? s.appendIntoPart(this) : s.insertAfterPart(t[n - 1])),
            s.setValue(i),
            s.commit(),
            n++;
        n < t.length && ((t.length = n), this.clear(s && s.endNode));
      }
      clear(e = this.startNode) {
        g(this.startNode.parentNode, e.nextSibling, this.endNode);
      }
    }
    class L {
      constructor(e, t, s) {
        if (
          ((this.value = void 0),
          (this.__pendingValue = void 0),
          2 !== s.length || '' !== s[0] || '' !== s[1])
        )
          throw new Error('Boolean attributes can only contain a single expression');
        (this.element = e), (this.name = t), (this.strings = s);
      }
      setValue(e) {
        this.__pendingValue = e;
      }
      commit() {
        for (; p(this.__pendingValue); ) {
          const e = this.__pendingValue;
          (this.__pendingValue = v), e(this);
        }
        if (this.__pendingValue === v) return;
        const e = !!this.__pendingValue;
        this.value !== e &&
          (e ? this.element.setAttribute(this.name, '') : this.element.removeAttribute(this.name),
          (this.value = e)),
          (this.__pendingValue = v);
      }
    }
    class C extends S {
      constructor(e, t, s) {
        super(e, t, s), (this.single = 2 === s.length && '' === s[0] && '' === s[1]);
      }
      _createPart() {
        return new M(this);
      }
      _getValue() {
        return this.single ? this.parts[0].value : super._getValue();
      }
      commit() {
        this.dirty && ((this.dirty = !1), (this.element[this.name] = this._getValue()));
      }
    }
    class M extends $ {}
    let A = !1;
    (() => {
      try {
        const e = {
          get capture() {
            return (A = !0), !1;
          },
        };
        window.addEventListener('test', e, e), window.removeEventListener('test', e, e);
      } catch (e) {}
    })();
    class P {
      constructor(e, t, s) {
        (this.value = void 0),
          (this.__pendingValue = void 0),
          (this.element = e),
          (this.eventName = t),
          (this.eventContext = s),
          (this.__boundHandleEvent = (e) => this.handleEvent(e));
      }
      setValue(e) {
        this.__pendingValue = e;
      }
      commit() {
        for (; p(this.__pendingValue); ) {
          const e = this.__pendingValue;
          (this.__pendingValue = v), e(this);
        }
        if (this.__pendingValue === v) return;
        const e = this.__pendingValue,
          t = this.value,
          s =
            null == e ||
            (null != t &&
              (e.capture !== t.capture || e.once !== t.once || e.passive !== t.passive)),
          n = null != e && (null == t || s);
        s &&
          this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options),
          n &&
            ((this.__options = j(e)),
            this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options)),
          (this.value = e),
          (this.__pendingValue = v);
      }
      handleEvent(e) {
        'function' == typeof this.value
          ? this.value.call(this.eventContext || this.element, e)
          : this.value.handleEvent(e);
      }
    }
    const j = (e) =>
      e && (A ? { capture: e.capture, passive: e.passive, once: e.once } : e.capture);
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
     */ const O = new (class {
      handleAttributeExpressions(e, t, s, n) {
        const i = t[0];
        if ('.' === i) {
          return new C(e, t.slice(1), s).parts;
        }
        return '@' === i
          ? [new P(e, t.slice(1), n.eventContext)]
          : '?' === i
          ? [new L(e, t.slice(1), s)]
          : new S(e, t, s).parts;
      }
      handleTextExpression(e) {
        return new T(e);
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
     */ new Map(), new WeakMap();
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
    const R = (e, ...t) => new B(e, t, 'html', O);
    let D = class extends u {
      constructor() {
        super(), this.attachShadow({ mode: 'open' });
      }
      set bandLimit(e) {
        this.state.patchValue({ bandLimit: e });
      }
      set selectedBands(e) {
        this.state.patchValue({ selectedBands: e });
      }
    };
    n([d(a)], D.prototype, 'state', void 0),
      (D = n(
        [
          l({
            state: { bandLimit: 0, selectedBands: [] },
            render: ({ state: e, dispatch: t }) => R`
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
          ? R`
            <button class="scale-in" @click=${t('band_count_selected', { detail: 0 })}>
              clear
            </button>
          `
          : R`
            <div class="band-buttons scale-in">
              <button @click=${t('band_count_selected', { detail: 4 })}>4 Bands</button>
              <button @click=${t('band_count_selected', { detail: 5 })}>5 Bands</button>
              <button @click=${t('band_count_selected', { detail: 6 })}>6 Bands</button>
            </div>
          `
      }
    `,
          }),
        ],
        D
      )),
      customElements.define('select-band-count', D);
    let Y = class extends u {
      constructor() {
        super(), this.attachShadow({ mode: 'open' });
      }
      set bands(e) {
        this.state.setValue(e);
      }
      get bands() {
        return this.state.value;
      }
    };
    n([d(a)], Y.prototype, 'state', void 0),
      (Y = n(
        [
          l({
            state: [],
            render: ({ state: e }) => R`
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
        ${e.map((e) => R` <div class="band" .style="background: ${e.color}"></div> `)}
      </section>

      <section class="end"></section>
    `,
          }),
        ],
        Y
      )),
      customElements.define('resistor-value', Y);
    let W = class extends u {
      constructor() {
        super(), this.attachShadow({ mode: 'open' });
      }
      set bands(e) {
        this.state.setValue({ bands: e });
      }
      get bands() {
        return this.state.value.bands;
      }
    };
    var H;
    n([d(a)], W.prototype, 'state', void 0),
      (W = n(
        [
          l({
            state: { bands: [] },
            render: ({ state: e, dispatch: t }) => R`
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
        (e) => R`
          <button @click=${t('band_selected', { detail: e })}>
            <div class="color-block" .style="background: ${e.color}"></div>

            <span>${e.color}</span>
          </button>
        `
      )}
    `,
          }),
        ],
        W
      )),
      customElements.define('select-band-color', W),
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
      })(H || (H = {}));
    let I = class {
      constructor() {
        this.bands = [
          { color: H.Black, value: 0, multiplier: 1 },
          { color: H.Brown, value: 1, multiplier: 10, tolerance: 1 },
          { color: H.Red, value: 2, multiplier: 100, tolerance: 2 },
          { color: H.Organge, value: 3, multiplier: 1e3 },
          { color: H.Yellow, value: 4, multiplier: 1e4 },
          { color: H.Green, value: 5, multiplier: 1e5, tolerance: 0.5 },
          { color: H.Blue, value: 6, multiplier: 1e6, tolerance: 0.25 },
          { color: H.Violet, value: 7, multiplier: 1e7, tolerance: 0.1 },
          { color: H.Grey, value: 8, tolerance: 0.05 },
          { color: H.White, value: 9 },
          { color: H.Gold, multiplier: 0.1, tolerance: 5 },
          { color: H.Silver, multiplier: 0.01, tolerance: 10 },
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
        const s = e[t - 2],
          n = e[t - 1],
          i = this.getValue(e, t),
          r = this.multiply(i, s),
          o = this.getReadableValue(r);
        return this.getTolerance(o, n);
      }
      getValue(e, t) {
        return Number(e.filter((e, s) => s + 2 < t).reduce((e, t) => e + t.value, ''));
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
    I = n(
      [
        function (e) {
          e.provideInRoot = !0;
        },
      ],
      I
    );
    let G = class extends u {
      constructor() {
        super(), this.attachShadow({ mode: 'open' });
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
    n([d(a)], G.prototype, 'state', void 0),
      n([d(I)], G.prototype, 'resistor', void 0),
      n([c('BAND_COUNT_SELECTED')], G.prototype, 'onBandCountSelected', null),
      n([c('BAND_SELECTED')], G.prototype, 'onBandSelected', null),
      (G = n(
        [
          l({
            state: {
              bandLimit: 0,
              bands: [],
              selectedBands: [],
              availableBands: [],
              displayColors: !1,
            },
            render: ({ state: e, run: t }) => R`
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
              ? R` <span>${e.selectedBands.length}/${e.bandLimit} Bands</span> `
              : R` <span>${e.resistorValue} &#8486;</span> `
            : R` <span>Select Resistor Bands</span> `
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
        ],
        G
      )),
      customElements.define('app-root', G),
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
