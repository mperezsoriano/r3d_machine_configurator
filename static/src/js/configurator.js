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


    // Precio base de la máquina
    let total = Number(
        activeButton.dataset.machinePrice
    ) || 0;


    // Configuración activa
    const activeConfiguration = document.querySelector(
        ".r3d-machine-options.active"
    );


    // Sumar extras seleccionados
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


    // Mostrar total
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
        quoteForm.style.display = "none";
    }

    if (quoteButton) {
        quoteButton.style.display = "";
    }
}


// =========================================================
// SELECCIONAR MÁQUINA
// =========================================================

function selectMachine(button) {

    // Si el formulario de oferta estaba abierto,
    // lo cerramos al cambiar de máquina
    closeQuoteForm();


    // -----------------------------------------------------
    // BOTÓN ACTIVO
    // -----------------------------------------------------

    buttons.forEach((btn) => {
        btn.classList.remove("active");
    });

    button.classList.add("active");


    // -----------------------------------------------------
    // DATOS DE LA MÁQUINA
    // -----------------------------------------------------

    const machineId =
        button.dataset.machineId;

    const name =
        button.dataset.machineName;


    // -----------------------------------------------------
    // NOMBRE EN EL RESUMEN
    // -----------------------------------------------------

    if (machineName) {

        machineName.textContent =
            name;
    }


    // -----------------------------------------------------
    // IMAGEN
    // -----------------------------------------------------

    if (machineImage) {

        if (name === "IDENTITY HT") {

            machineImage.src =
                "/r3d_machine_configurator/static/src/img/identity_ht.png";

            machineImage.alt =
                "R3DIMENSION IDENTITY HT";

        } else {

            machineImage.src =
                "/r3d_machine_configurator/static/src/img/identity.png";

            machineImage.alt =
                "R3DIMENSION IDENTITY";
        }
    }


    // -----------------------------------------------------
    // CONFIGURACIÓN CORRESPONDIENTE
    // -----------------------------------------------------

    configurationBlocks.forEach((block) => {

        if (
            block.dataset.machineId ===
            machineId
        ) {

            block.style.display = "";

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

            calculateTotal();
        }
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

if (quoteSubmit) {

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

            quoteSubmit.disabled = true;

            quoteSubmit.textContent =
                "ENVIANDO...";


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
                            jsonrpc: "2.0",
                            method: "call",
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
                            id: Date.now(),
                        }),
                    }
                );


                const data =
                    await response.json();


                const result =
                    data.result;


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


// Calcular precio inicial
calculateTotal();