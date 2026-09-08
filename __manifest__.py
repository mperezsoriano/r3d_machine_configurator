{
    "name": "R3D Machine Configurator",
    "version": "19.0.1.0.0",
    "summary": "Configurador de impresoras 3D R3DIMENSION",
    "description": """
        Configurador de impresoras industriales R3DIMENSION.

        Gestiona modelos de máquinas, configuraciones, opciones
        y la integración con el configurador web.
    """,
    "author": "R3DIMENSION",
    "website": "https://r3dimension.com",
    "category": "Sales",
    "license": "LGPL-3",

    "depends": [
        "base",
        "website",
        "crm",
    ],

    "data": [
        "security/ir.model.access.csv",
        "views/machine_views.xml",
        "views/configurator_templates.xml",
    ],

    "assets": {
        "web.assets_frontend": [
            "r3d_machine_configurator/static/src/css/configurator.css",
            "r3d_machine_configurator/static/src/js/configurator.js",
        ],
    },

    "installable": True,
    "application": True,
    "auto_install": False,
}