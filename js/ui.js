const AuraUI = {
    formatCLP(monto) {
        return '$' + monto.toLocaleString(AURA_CONFIG.LOCALE, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    },

    escape(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(String(str)));
        return div.innerHTML;
    },

    mostrarError(selector, mensaje, duracion = 0) {
        const $alert = $(selector);
        $alert.removeClass('alert-success').addClass('alert-danger');
        $alert.html(`<i class="fas fa-exclamation-circle"></i> ${mensaje}`);
        $alert.slideDown();
        if (duracion > 0) setTimeout(() => $alert.slideUp(), duracion);
    },

    mostrarExito(selector, mensaje, duracion = 0) {
        const $alert = $(selector);
        $alert.removeClass('alert-danger').addClass('alert-success');
        $alert.html(`<i class="fas fa-check-circle"></i> ${mensaje}`);
        $alert.slideDown();
        if (duracion > 0) setTimeout(() => $alert.slideUp(), duracion);
    }
};
