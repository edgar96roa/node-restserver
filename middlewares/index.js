const validateFields        = require('../middlewares/validateFields');
const validateFileUpload    = require('../middlewares/validate-file');
const validateJWT           = require('../middlewares/validate-jwt');
const validateRoles         = require('../middlewares/validate-roles');

module.exports = {
    ...validateFileUpload,
    ...validateFields,
    ...validateJWT,
    ...validateRoles
}
