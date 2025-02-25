function limpiarEntrada(input) {
    // Expresión regular para eliminar todas las etiquetas HTML
    var inputLimpio = input.replace(/<[^>]*>/g, "");

    // Si se eliminaron etiquetas, se muestra una alerta y se limpia el campo
    if (input !== inputLimpio) {
        alert("Se han detectado y eliminado etiquetas HTML.");
    }

    return inputLimpio;
}

function validar(form) {
    // Validar nombre
    var nombre = limpiarEntrada(form.nombre.value.trim());
    if (nombre === "") {
        alert("Por favor, ingrese su nombre.");
        form.nombre.value = "";  // Borra el contenido del input
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
