export const endpoint = {
    "/Services": {
        "get": {
            "tags": [
                "Service"
            ],
            "description": "Create new user in system",
            "produces": [
                "application/json"
            ],
            "responses": {
                "200": {
                    "description": "Done",
                    "schema": {
                        "$ref": "#/definitions/Services"
                    }
                }
            }
        }
    }
};
