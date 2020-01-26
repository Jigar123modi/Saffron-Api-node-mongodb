"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const endpoint = exports.endpoint = {
    "/Services": {
        "get": {
            "tags": ["Service"],
            "description": "Create new user in system",
            "produces": ["application/json"],
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
//# sourceMappingURL=Swagger_Service.js.map
