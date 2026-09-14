/** @odoo-module **/

// =========================================================
// ELEMENTOS DEL DOM
// =========================================================

const buttons = document.querySelectorAll(
    ".r3d-machine-button"
);

const machineName = document.querySelector(
    ".r3d-summary h2"
);

const machineImage = document.querySelector(
    ".r3d-machine-image"
);

const priceElement = document.querySelector(
    ".r3d-total strong"
);

const configurationBlocks = document.querySelectorAll(
    ".r3d-machine-options"
);

const summaryConfigurationBlocks = document.querySelectorAll(
    ".r3d-summary-machine-options"
);

const quoteButton = document.querySelector(
    ".r3d-quote-button"
);

const quoteForm = document.querySelector(
    ".r3d-quote-form"
);

const quoteClose = document.querySelector(
    ".r3d-quote-close"
);

const quoteSubmit = document.querySelector(
    ".r3d-quote-submit"
);


// =========================================================
// ELEMENTOS VISUALES DE LA MÁQUINA
// =========================================================

const visualMachineName = document.querySelector(
    ".r3d-visual-machine-name"
);

const visualMachineDescription = document.querySelector(
    ".r3d-visual-machine-description"
);

const featureThird = document.querySelector(
    ".r3d-feature-third"
);


// =========================================================
// FORMATEAR PRECIO
// =========================================================

function formatPrice(price) {

    return price.toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }) + " €";
}


// =========================================================
// CALCULAR PRECIO TOTAL
// =========================================================

function calculateTotal() {

    const activeButton = document.querySelector(
        ".r3d-machine-button.active"
    );

    if (!activeButton) {
        return;
    }


    // -----------------------------------------------------
    // PRECIO BASE DE LA MÁQUINA
    // -----------------------------------------------------

    let total = Number(
        activeButton.dataset.machinePrice
    ) || 0;


    // -----------------------------------------------------
    // CONFIGURACIÓN ACTIVA
    // -----------------------------------------------------

    const activeConfiguration = document.querySelector(
        ".r3d-machine-options.active"
    );


    // -----------------------------------------------------
    // SUMAR EXTRAS SELECCIONADOS
    // -----------------------------------------------------

    if (activeConfiguration) {

        const selectedExtras =
            activeConfiguration.querySelectorAll(
                ".r3d-extra-option:checked"
            );

        selectedExtras.forEach((extra) => {

            total += Number(
                extra.dataset.price
            ) || 0;

        });
    }


    // -----------------------------------------------------
    // MOSTRAR TOTAL
    // -----------------------------------------------------

    if (priceElement) {

        priceElement.textContent =
            formatPrice(total);
    }
}


// =========================================================
// CERRAR FORMULARIO DE OFERTA
// =========================================================

function closeQuoteForm() {

    if (quoteForm) {

        quoteForm.style.display =
            "none";
    }

    if (quoteButton) {

        quoteButton.style.display =
            "";
    }
}


// =========================================================
// ACTUALIZAR PARTE VISUAL DE LA MÁQUINA
// =========================================================

function updateMachineVisual(name) {

    if (name === "IDENTITY HT") {


        // -------------------------------------------------
        // IMAGEN
        // -------------------------------------------------

        if (machineImage) {

            machineImage.src =
                "/r3d_machine_configurator/static/src/img/identity_ht.png";

            machineImage.alt =
                "R3DIMENSION IDENTITY HT";
        }


        // -------------------------------------------------
        // NOMBRE VISUAL
        // -------------------------------------------------

        if (visualMachineName) {

            visualMachineName.textContent =
                "IDENTITY HT";
        }


        // -------------------------------------------------
        // DESCRIPCIÓN
        // -------------------------------------------------

        if (visualMachineDescription) {

            visualMachineDescription.textContent =
                "Fabricación aditiva industrial de gran formato con control térmico avanzado para materiales técnicos.";
        }


        // -------------------------------------------------
        // TERCERA CARACTERÍSTICA
        // -------------------------------------------------

        if (featureThird) {

            featureThird.textContent =
                "ALTA TEMPERATURA";
        }

    } else {


        // -------------------------------------------------
        // IMAGEN
        // -------------------------------------------------

        if (machineImage) {

            machineImage.src =
                "/r3d_machine_configurator/static/src/img/identity.png";

            machineImage.alt =
                "R3DIMENSION IDENTITY";
        }


        // -------------------------------------------------
        // NOMBRE VISUAL
        // -------------------------------------------------

        if (visualMachineName) {

            visualMachineName.textContent =
                "IDENTITY";
        }


        // -------------------------------------------------
        // DESCRIPCIÓN
        // -------------------------------------------------

        if (visualMachineDescription) {

            visualMachineDescription.textContent =
                "Fabricación aditiva industrial de gran formato, diseñada para producción y piezas funcionales.";
        }


        // -------------------------------------------------
        // TERCERA CARACTERÍSTICA
        // -------------------------------------------------

        if (featureThird) {

            featureThird.textContent =
                "ALTA VELOCIDAD";
        }
    }
}


// =========================================================
// SINCRONIZAR CHECK DEL RESUMEN
// =========================================================

function updateSummaryCheck(extra) {

    const configurationId =
        extra.dataset.configurationId;

    if (!configurationId) {
        return;
    }


    // -----------------------------------------------------
    // BUSCAR OPCIÓN CORRESPONDIENTE EN EL RESUMEN
    // -----------------------------------------------------

    const summaryOption =
        document.querySelector(
            `.r3d-summary-option-selectable[data-configuration-id="${configurationId}"]`
        );

    if (!summaryOption) {
        return;
    }


    // -----------------------------------------------------
    // ACTIVAR / DESACTIVAR CHECK
    // -----------------------------------------------------

    summaryOption.classList.toggle(
        "selected",
        extra.checked
    );
}


// =========================================================
// SINCRONIZAR TODOS LOS CHECKS
// =========================================================

function updateAllSummaryChecks() {

    document.querySelectorAll(
        ".r3d-extra-option"
    ).forEach((extra) => {

        updateSummaryCheck(extra);

    });
}


// =========================================================
// SELECCIONAR MÁQUINA
// =========================================================

function selectMachine(button) {

    // Cerrar formulario al cambiar de máquina
    closeQuoteForm();


    // -----------------------------------------------------
    // BOTÓN ACTIVO
    // -----------------------------------------------------

    buttons.forEach((btn) => {

        btn.classList.remove(
            "active"
        );

    });

    button.classList.add(
        "active"
    );


    // -----------------------------------------------------
    // DATOS DE LA MÁQUINA
    // -----------------------------------------------------

    const machineId =
        button.dataset.machineId;

    const name =
        button.dataset.machineName;


    // -----------------------------------------------------
    // NOMBRE EN EL PANEL DERECHO
    // -----------------------------------------------------

    if (machineName) {

        machineName.textContent =
            name;
    }


    // -----------------------------------------------------
    // IMAGEN + INFORMACIÓN VISUAL
    // -----------------------------------------------------

    updateMachineVisual(
        name
    );


    // -----------------------------------------------------
    // CONFIGURACIÓN IZQUIERDA CORRESPONDIENTE
    // -----------------------------------------------------

    configurationBlocks.forEach((block) => {

        if (
            block.dataset.machineId ===
            machineId
        ) {

            block.style.display =
                "";

            block.classList.add(
                "active"
            );

        } else {

            block.style.display =
                "none";

            block.classList.remove(
                "active"
            );
        }
    });


    // -----------------------------------------------------
    // RESUMEN DERECHO CORRESPONDIENTE
    // -----------------------------------------------------

    summaryConfigurationBlocks.forEach((block) => {

        if (
            block.dataset.machineId ===
            machineId
        ) {

            block.classList.add(
                "active"
            );

        } else {

            block.classList.remove(
                "active"
            );
        }
    });


    // -----------------------------------------------------
    // SINCRONIZAR CHECKS DEL RESUMEN
    // -----------------------------------------------------

    updateAllSummaryChecks();


    // -----------------------------------------------------
    // RECALCULAR PRECIO
    // -----------------------------------------------------

    calculateTotal();
}


// =========================================================
// EVENTOS DE LAS MÁQUINAS
// =========================================================

buttons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            selectMachine(
                button
            );
        }
    );

});


// =========================================================
// EVENTOS DE LOS EXTRAS
// =========================================================

document.querySelectorAll(
    ".r3d-extra-option"
).forEach((extra) => {

    extra.addEventListener(
        "change",
        () => {


            // ---------------------------------------------
            // ACTUALIZAR PRECIO
            // ---------------------------------------------

            calculateTotal();


            // ---------------------------------------------
            // ACTUALIZAR CHECK DEL RESUMEN
            // ---------------------------------------------

            updateSummaryCheck(
                extra
            );

        }
    );


    // -----------------------------------------------------
    // SINCRONIZAR ESTADO INICIAL
    // -----------------------------------------------------

    updateSummaryCheck(
        extra
    );

});


// =========================================================
// FORMULARIO SOLICITAR OFERTA
// =========================================================

if (quoteButton && quoteForm) {

    quoteButton.addEventListener(
        "click",
        () => {

            quoteForm.style.display =
                "block";

            quoteButton.style.display =
                "none";
        }
    );
}


// =========================================================
// CERRAR FORMULARIO
// =========================================================

if (quoteClose) {

    quoteClose.addEventListener(
        "click",
        () => {

            closeQuoteForm();
        }
    );
}


// =========================================================
// ENVIAR SOLICITUD A ODOO
// =========================================================

if (quoteSubmit && quoteForm) {

    quoteSubmit.addEventListener(
        "click",
        async () => {

            const customerName =
                quoteForm.querySelector(
                    '[name="customer_name"]'
                ).value.trim();

            const companyName =
                quoteForm.querySelector(
                    '[name="company_name"]'
                ).value.trim();

            const email =
                quoteForm.querySelector(
                    '[name="email"]'
                ).value.trim();

            const phone =
                quoteForm.querySelector(
                    '[name="phone"]'
                ).value.trim();

            const comments =
                quoteForm.querySelector(
                    '[name="comments"]'
                ).value.trim();


            // ---------------------------------------------
            // VALIDACIÓN
            // ---------------------------------------------

            if (!customerName || !email) {

                alert(
                    "Por favor, introduce tu nombre y email."
                );

                return;
            }


            const activeButton =
                document.querySelector(
                    ".r3d-machine-button.active"
                );

            const activeConfiguration =
                document.querySelector(
                    ".r3d-machine-options.active"
                );

            if (
                !activeButton ||
                !activeConfiguration
            ) {

                return;
            }


            // ---------------------------------------------
            // EXTRAS SELECCIONADOS
            // ---------------------------------------------

            const extras = [];

            activeConfiguration
                .querySelectorAll(
                    ".r3d-extra-option:checked"
                )
                .forEach((extra) => {

                    extras.push({

                        configuration_id:
                            extra.dataset.configurationId,

                    });

                });


            // ---------------------------------------------
            // BLOQUEAR BOTÓN
            // ---------------------------------------------

            const originalText =
                quoteSubmit.textContent;

            quoteSubmit.disabled =
                true;

            quoteSubmit.textContent =
                "ENVIANDO...";


            // ---------------------------------------------
            // ENVIAR A ODOO
            // ---------------------------------------------

            try {

                const response = await fetch(
                    "/configurador/solicitar-oferta",
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                        },

                        body: JSON.stringify({

                            jsonrpc:
                                "2.0",

                            method:
                                "call",

                            params: {

                                machine_id:
                                    activeButton.dataset.machineId,

                                extras:
                                    extras,

                                customer_name:
                                    customerName,

                                company_name:
                                    companyName,

                                email:
                                    email,

                                phone:
                                    phone,

                                comments:
                                    comments,
                            },

                            id:
                                Date.now(),

                        }),
                    }
                );


                const data =
                    await response.json();

                const result =
                    data.result;


                // -----------------------------------------
                // ÉXITO
                // -----------------------------------------

                if (
                    result &&
                    result.success
                ) {

                    quoteForm.innerHTML = `
                        <div class="r3d-quote-success">

                            <h3>
                                Solicitud enviada
                            </h3>

                            <p>
                                Hemos recibido tu configuración.
                                Nuestro equipo comercial se pondrá
                                en contacto contigo.
                            </p>

                        </div>
                    `;

                } else {

                    alert(
                        result?.message ||
                        "No se ha podido enviar la solicitud."
                    );

                    quoteSubmit.disabled =
                        false;

                    quoteSubmit.textContent =
                        originalText;
                }

            } catch (error) {

                console.error(
                    "Error enviando solicitud:",
                    error
                );

                alert(
                    "Se ha producido un error al enviar la solicitud."
                );

                quoteSubmit.disabled =
                    false;

                quoteSubmit.textContent =
                    originalText;
            }
        }
    );
}


// =========================================================
// ESTADO INICIAL
// =========================================================

configurationBlocks.forEach((block) => {

    if (
        !block.classList.contains(
            "active"
        )
    ) {

        block.style.display =
            "none";
    }

});


// =========================================================
// SINCRONIZAR RESUMEN INICIAL
// =========================================================

updateAllSummaryChecks();


// =========================================================
// PRECIO INICIAL
// =========================================================

calculateTotal();