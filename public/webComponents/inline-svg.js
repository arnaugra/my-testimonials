class InlineSVG extends HTMLElement {
  static get observedAttributes() {
    return ['src'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (this.hasAttribute('src')) {
      this.loadSVG(this.getAttribute('src'));
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'src' && oldValue !== newValue) {
      this.loadSVG(newValue);
    }
  }

  async loadSVG(path) {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Error al cargar SVG: ${response.status}`);
      const svgText = await response.text();

      // Incrustamos el SVG dentro del shadow DOM
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
            width: 100%;
            height: auto;
          }
          svg {
            width: 100%;
            height: 100%;
            fill: currentColor; /* permite heredar el color */
          }
        </style>
        ${svgText}
      `;
    } catch (err) {
      console.error(err);
      this.shadowRoot.innerHTML = `<span style="color: red;">⚠️ Error al cargar SVG</span>`;
    }
  }
}

// Registrar el componente
customElements.define('inline-svg', InlineSVG);