// ficha.js

// -------------------------------------------------
// Fracción: numerador / denominador (con simplificación)
// -------------------------------------------------
export class Fraccion {
    constructor(num, den) {
        if (den === 0) {
            throw new Error("Denominador no puede ser 0");
        }
        const divisor = this.mcd(num, den);
        this.num = num / divisor;
        this.den = den / divisor;
    }

    mcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b !== 0) {
            const t = b;
            b = a % b;
            a = t;
        }
        return a || 1;
    }

    equals(otra) {
        if (!(otra instanceof Fraccion)) return false;
        return this.num * otra.den === otra.num * this.den;
    }

    toNumber() {
        return this.num / this.den;
    }

    toString() {
        return `${this.num}/${this.den}`;
    }
}


// -------------------------------------------------
// Formateo de número (formato argentino)
// -------------------------------------------------
function formatearNumero(numStr) {
    numStr = String(numStr).trim();

    let entero, decimales;
    if (numStr.includes('.')) {
        [entero, decimales] = numStr.split('.');
    } else {
        entero = numStr;
        decimales = null;
    }

    // Separador de miles usando toLocaleString
    const enteroNum = parseInt(entero, 10);
    const enteroFormateado = enteroNum.toLocaleString('es-AR');

    if (decimales !== null) {
        return enteroFormateado + ',' + decimales;
    }
    return enteroFormateado;
}


// -------------------------------------------------
// Ficha
// -------------------------------------------------
export class Ficha {
    constructor(valor1, valor2) {
        // valor1 y valor2 son [numStr, denStr]
        // Ejemplos: ["50", "100"], ["0.50", "1"]

        // -------------------------------------------------
        // Valores matemáticos
        // -------------------------------------------------
        this.valores = {};
        this.valores["O"] = this._aFraccion(valor1[0], valor1[1]);
        this.valores["E"] = this._aFraccion(valor2[0], valor2[1]);
        this.valores["N"] = null;
        this.valores["S"] = null;

        // -------------------------------------------------
        // Textos para mostrar
        // -------------------------------------------------
        this.textos = {};
        this.textos["O"] = this._formatearTexto(valor1[0], valor1[1]);
        this.textos["E"] = this._formatearTexto(valor2[0], valor2[1]);
        this.textos["N"] = null;
        this.textos["S"] = null;

        this.orientacion = "horizontal";
        this.casilla = null;
        this.estado = "pozo";
        this.duenio = null;
    }

    _aFraccion(numStr, denStr) {
        const num = parseFloat(numStr);
        const den = parseFloat(denStr);
        return new Fraccion(num, den);
    }

    _formatearTexto(numStr, denStr) {
        const den = parseFloat(denStr);
        const numFmt = formatearNumero(numStr);

        if (den === 1) {
            // Solo el número (decimal), sin línea de fracción
            return numFmt;
        } else {
            // Fracción con línea
            const denFmt = formatearNumero(denStr);
            return `${numFmt}\n${denFmt}`;
        }
    }

    girar_90() {
        const O = this.valores["O"];
        const E = this.valores["E"];
        const N = this.valores["N"];
        const S = this.valores["S"];

        const texto_O = this.textos["O"];
        const texto_E = this.textos["E"];
        const texto_N = this.textos["N"];
        const texto_S = this.textos["S"];

        this.valores["N"] = E;
        this.valores["O"] = N;
        this.valores["S"] = O;
        this.valores["E"] = S;

        this.textos["N"] = texto_E;
        this.textos["O"] = texto_N;
        this.textos["S"] = texto_O;
        this.textos["E"] = texto_S;

        if (this.orientacion === "horizontal") {
            this.orientacion = "vertical";
        } else {
            this.orientacion = "horizontal";
        }
    }

    mostrar_ficha() {
        console.log(
            this.orientacion,
            `O:${this.textos["O"]}`,
            `E:${this.textos["E"]}`,
            `N:${this.textos["N"]}`,
            `S:${this.textos["S"]}`
        );
    }

    mostrar_valores() {
        if (this.orientacion === "horizontal") {
            return `[${this.textos["O"]} | ${this.textos["E"]}]`.replace(/\n/g, '/');
        } else {
            return `[${this.textos["N"]} | ${this.textos["S"]}]`.replace(/\n/g, '/');
        }
    }

    toString() {
        return this.mostrar_valores();
    }
}