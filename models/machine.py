from odoo import fields, models

description = fields.Text(string="Descripción")
base_price = fields.Float(string="Precio base")

configuration_ids = fields.One2many(
    "r3d.machine.configuration",
    "machine_id",
    string="Configuración",
)

class R3DMachine(models.Model):
    _name = "r3d.machine"
    _description = "R3D Machine"
    _order = "sequence, name"

    name = fields.Char(string="Nombre", required=True)
    code = fields.Char(string="Código", required=True)
    sequence = fields.Integer(string="Orden", default=10)
    active = fields.Boolean(string="Activo", default=True)
    description = fields.Text(string="Descripción")
    base_price = fields.Float(string="Precio base")

    configuration_ids = fields.One2many(
        "r3d.machine.configuration",
        "machine_id",
        string="Configuración",
    )


class R3DMachineOptionGroup(models.Model):
    _name = "r3d.machine.option.group"
    _description = "R3D Machine Option Group"
    _order = "sequence, name"

    name = fields.Char(string="Nombre", required=True)
    sequence = fields.Integer(string="Orden", default=10)

    selection_type = fields.Selection(
        [
            ("single", "Selección única"),
            ("multiple", "Selección múltiple"),
        ],
        string="Tipo de selección",
        required=True,
        default="multiple",
    )

    option_ids = fields.One2many(
        "r3d.machine.option",
        "group_id",
        string="Opciones",
    )


class R3DMachineOption(models.Model):
    _name = "r3d.machine.option"
    _description = "R3D Machine Option"
    _order = "sequence, name"

    name = fields.Char(string="Nombre", required=True)
    sequence = fields.Integer(string="Orden", default=10)

    group_id = fields.Many2one(
        "r3d.machine.option.group",
        string="Grupo",
        required=True,
        ondelete="cascade",
    )

    description = fields.Text(string="Descripción")
    active = fields.Boolean(string="Activo", default=True)


class R3DMachineConfiguration(models.Model):
    _name = "r3d.machine.configuration"
    _description = "R3D Machine Configuration"
    _order = "sequence, id"

    sequence = fields.Integer(string="Orden", default=10)

    machine_id = fields.Many2one(
        "r3d.machine",
        string="Máquina",
        required=True,
        ondelete="cascade",
    )

    option_id = fields.Many2one(
        "r3d.machine.option",
        string="Opción",
        required=True,
        ondelete="cascade",
    )

    price = fields.Float(
        string="Precio adicional",
        default=0.0,
    )

    included = fields.Boolean(
        string="Incluido de serie",
        default=False,
    )

    available = fields.Boolean(
        string="Disponible",
        default=True,
    )