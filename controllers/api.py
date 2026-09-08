from odoo import http
from odoo.http import request


class R3DMachineConfigurator(http.Controller):

    # =====================================================
    # PÁGINA DEL CONFIGURADOR
    # =====================================================

    @http.route(
        "/configurador",
        type="http",
        auth="public",
        website=True,
    )
    def configurator(self, **kwargs):

        machines = request.env["r3d.machine"].sudo().search(
            [("active", "=", True)],
            order="sequence, name",
        )

        return request.render(
            "r3d_machine_configurator.configurator_page",
            {
                "machines": machines,
            },
        )

    # =====================================================
    # SOLICITUD DE OFERTA
    # =====================================================

    @http.route(
        "/configurador/solicitar-oferta",
        type="jsonrpc",
        auth="public",
        website=True,
    )
    def request_quote(
        self,
        machine_id=None,
        extras=None,
        customer_name=None,
        company_name=None,
        email=None,
        phone=None,
        comments=None,
    ):

        # -------------------------------------------------
        # VALIDACIÓN
        # -------------------------------------------------

        if not customer_name or not email:
            return {
                "success": False,
                "message": "Nombre y email son obligatorios.",
            }

        try:
            machine_id = int(machine_id)

        except (TypeError, ValueError):

            return {
                "success": False,
                "message": "Máquina no válida.",
            }

        # -------------------------------------------------
        # BUSCAR MÁQUINA
        # -------------------------------------------------

        machine = request.env[
            "r3d.machine"
        ].sudo().browse(machine_id)

        if not machine.exists() or not machine.active:

            return {
                "success": False,
                "message": "Máquina no encontrada.",
            }

        # -------------------------------------------------
        # PRECIO BASE
        # -------------------------------------------------

        total = machine.base_price

        extras = extras or []

        extras_text = []

        # -------------------------------------------------
        # VALIDAR EXTRAS CONTRA ODOO
        # -------------------------------------------------

        available_configs = (
            machine.configuration_ids.filtered(
                lambda c:
                    c.available
                    and not c.included
            )
        )

        available_by_id = {
            config.id: config
            for config in available_configs
        }

        for extra in extras:

            try:

                config_id = int(
                    extra.get(
                        "configuration_id"
                    )
                )

            except (
                TypeError,
                ValueError,
                AttributeError,
            ):

                continue

            config = available_by_id.get(
                config_id
            )

            if not config:
                continue

            total += config.price

            extras_text.append(
                "- %s: + %.2f €"
                % (
                    config.option_id.name,
                    config.price,
                )
            )

        # -------------------------------------------------
        # EQUIPAMIENTO INCLUIDO
        # -------------------------------------------------

        included_configs = (
            machine.configuration_ids.filtered(
                lambda c:
                    c.available
                    and c.included
            )
        )

        included_text = [
            "- %s" % config.option_id.name
            for config in included_configs
        ]

        # -------------------------------------------------
        # DESCRIPCIÓN DE LA OPORTUNIDAD
        # -------------------------------------------------

        description_parts = [

            "<h3>"
            "Configuración solicitada desde la web"
            "</h3>",

            "<p>"
            "<strong>Máquina:</strong> %s"
            "</p>"
            % machine.name,

            "<p>"
            "<strong>Precio base:</strong> %.2f €"
            "</p>"
            % machine.base_price,
        ]

        # Equipamiento incluido

        if included_text:

            description_parts.append(
                "<p>"
                "<strong>Equipamiento incluido:</strong>"
                "<br/>"
                + "<br/>".join(included_text)
                + "</p>"
            )

        # Extras seleccionados

        if extras_text:

            description_parts.append(
                "<p>"
                "<strong>Extras seleccionados:</strong>"
                "<br/>"
                + "<br/>".join(extras_text)
                + "</p>"
            )

        else:

            description_parts.append(
                "<p>"
                "<strong>Extras seleccionados:</strong> "
                "Ninguno"
                "</p>"
            )

        # Precio total

        description_parts.append(
            "<p>"
            "<strong>Precio configurado:</strong> "
            "%.2f €"
            "</p>"
            % total
        )

        # Empresa

        if company_name:

            description_parts.append(
                "<p>"
                "<strong>Empresa:</strong> %s"
                "</p>"
                % company_name
            )

        # Comentarios

        if comments:

            description_parts.append(
                "<p>"
                "<strong>Comentarios del cliente:</strong>"
                "<br/>%s"
                "</p>"
                % comments
            )

        description = "".join(
            description_parts
        )

        # -------------------------------------------------
        # NOMBRE DE LA OPORTUNIDAD
        # -------------------------------------------------

        lead_name = (
            "Configurador web - %s - %s"
            % (
                machine.name,
                company_name
                or customer_name,
            )
        )

       
        # =================================================
        # BUSCAR / CREAR EMPRESA Y CONTACTO
        # =================================================

        Partner = request.env["res.partner"].sudo()

        company_partner = False

        # -------------------------------------------------
        # EMPRESA
        # -------------------------------------------------

        if company_name:

            company_partner = Partner.search(
                [
                    ("name", "=ilike", company_name),
                    ("is_company", "=", True),
                ],
                limit=1,
            )

            # Si la empresa no existe, crearla
            if not company_partner:

                company_partner = Partner.create({
                    "name": company_name,
                    "is_company": True,
                    "company_type": "company",
                })

        # -------------------------------------------------
        # PERSONA DE CONTACTO
        # -------------------------------------------------

        partner = Partner.search(
            [
                ("email", "=ilike", email),
                ("is_company", "=", False),
            ],
            limit=1,
        )

        # -------------------------------------------------
        # SI LA PERSONA NO EXISTE
        # -------------------------------------------------

        if not partner:

            partner_values = {
                "name": customer_name,
                "email": email,
                "phone": phone or False,
                "is_company": False,
                "company_type": "person",
            }

            # Vincular persona a la empresa
            if company_partner:

                partner_values["parent_id"] = (
                    company_partner.id
                )

            partner = Partner.create(
                partner_values
            )

        # -------------------------------------------------
        # SI LA PERSONA YA EXISTE
        # -------------------------------------------------

        else:

            values_to_update = {}

            # Completar teléfono si no lo tenía
            if phone and not partner.phone:

                values_to_update["phone"] = phone

            # Vincular a empresa si se ha indicado
            # y todavía no tenía empresa
            if company_partner and not partner.parent_id:

                values_to_update["parent_id"] = (
                    company_partner.id
                )

            if values_to_update:

                partner.write(
                    values_to_update
                )


        # =================================================
        # CREAR OPORTUNIDAD CRM
        # =================================================

        lead = request.env[
            "crm.lead"
        ].sudo().create({

            "name":
                lead_name,

            "type":
                "opportunity",

            # ---------------------------------------------
            # CONTACTO REAL DE ODOO
            # ---------------------------------------------

            "partner_id":
                partner.id,

            "contact_name":
                customer_name,

            "partner_name":
                company_name or False,

            "email_from":
                email,

            "phone":
                phone or False,

            # ---------------------------------------------
            # CONFIGURACIÓN
            # ---------------------------------------------

            "description":
                description,

            "expected_revenue":
                total,
        })

        # =================================================
        # RESPUESTA
        # =================================================

        return {
            "success": True,
            "lead_id": lead.id,
            "partner_id": partner.id,
        }