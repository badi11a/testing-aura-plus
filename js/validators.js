const AuraValidators = {
    validarRUT(rut) {
        const limpio = rut.replace(/\./g, '').replace(/-/g, '').trim().toUpperCase();
        if (!/^\d{7,8}[0-9K]$/.test(limpio)) return false;
        const cuerpo = limpio.slice(0, -1);
        const dvIngresado = limpio.slice(-1);
        let suma = 0, multiplo = 2;
        for (let i = cuerpo.length - 1; i >= 0; i--) {
            suma += parseInt(cuerpo[i]) * multiplo;
            multiplo = multiplo === 7 ? 2 : multiplo + 1;
        }
        const resultado = 11 - (suma % 11);
        const dvCalculado = resultado === 11 ? '0' : resultado === 10 ? 'K' : String(resultado);
        return dvIngresado === dvCalculado;
    },

    validarMonto(valor) {
        const montoFloat = parseFloat(valor);
        const monto = parseInt(valor, 10);
        if (!valor || isNaN(montoFloat) || montoFloat <= 0)
            return { ok: false, error: 'El monto debe ser mayor a $0' };
        if (montoFloat !== monto)
            return { ok: false, error: 'El monto no puede contener decimales' };
        if (monto > AURA_CONFIG.MONTO_MAXIMO)
            return { ok: false, error: `El monto máximo es $${AURA_CONFIG.MONTO_MAXIMO.toLocaleString(AURA_CONFIG.LOCALE)}` };
        return { ok: true, monto };
    },

    validarNombre: (nombre) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(nombre),

    validarNumeroCuenta: (numero) => /^\d+$/.test(numero)
};
