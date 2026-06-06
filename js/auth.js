const AuraAuth = {
    requireSesion() {
        if (!AuraStorage.getUsuario()) {
            window.location.replace('login.html');
            return false;
        }
        return true;
    },

    logout() {
        AuraStorage.removeUsuario();
        AuraStorage.removeSaldo();
        AuraStorage.removeHistorial();
        window.location.href = 'login.html';
    }
};
