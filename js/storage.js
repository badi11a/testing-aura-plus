const AuraStorage = {
    getUsuario: () => localStorage.getItem('auraUsuario'),
    setUsuario: (email) => localStorage.setItem('auraUsuario', email),
    removeUsuario: () => localStorage.removeItem('auraUsuario'),

    getSaldo() {
        const raw = localStorage.getItem('auraSaldo');
        return raw !== null ? parseInt(raw, 10) : 0;
    },
    setSaldo: (monto) => localStorage.setItem('auraSaldo', String(monto)),
    removeSaldo: () => localStorage.removeItem('auraSaldo'),

    getHistorial() {
        try { return JSON.parse(localStorage.getItem('auraHistorial')) || []; }
        catch { return []; }
    },
    pushMovimiento(movimiento) {
        const historial = AuraStorage.getHistorial();
        historial.unshift(movimiento);
        if (historial.length > AURA_CONFIG.HISTORIAL_MAX) historial.splice(AURA_CONFIG.HISTORIAL_MAX);
        localStorage.setItem('auraHistorial', JSON.stringify(historial));
    },
    removeHistorial: () => localStorage.removeItem('auraHistorial'),

    getContactos() {
        try { return JSON.parse(localStorage.getItem('auraContactos')) || []; }
        catch { return []; }
    },
    setContactos: (contactos) => localStorage.setItem('auraContactos', JSON.stringify(contactos))
};
