function limpiarEntrada(input) {
    // Expresión regular para eliminar <script>...</script> y cualquier intento de inyección
    return input.replace(/<script.*?>.*?<\/script>/gi, "").replace(/[<>\/]/g, "");
}

function validar(form) {
    // Validar nombre
    var nombre = limpiarEntrada(form.nombre.value.trim());
    if (nombre === "") {
        alert("Por favor, ingrese su nombre.");
        return false;
    }

    // Validar edad
    var edad = limpiarEntrada(form.edad.value.trim());
    if (edad === "" || isNaN(edad) || edad <= 0) {
        alert("Por favor, ingrese una edad válida.");
        return false;
    }

    // Validar selección de sexo
    var sexo = limpiarEntrada(form.sexo.value);
    if (sexo === "") {
        alert("Por favor, seleccione su sexo.");
        return false;
    }

    // Validar deporte favorito
    var deporte = limpiarEntrada(form.deporte.value);
    if (deporte === "ninguno") {
        alert("Por favor, seleccione un deporte favorito.");
        return false;
    }

    // Si todo es válido
    return true;
}
