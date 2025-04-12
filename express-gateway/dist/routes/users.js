"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
const FUNCTION_URL = 'https://my-azure-function-getusers-dev.azurewebsites.net/api/getusers';
router.get('/users', async (req, res) => {
    try {
        const response = await axios_1.default.get(FUNCTION_URL);
        res.status(200).json(response.data);
    }
    catch (err) {
        console.error('Error calling Azure Function:', err.message);
        res.status(500).json({ error: 'Unable to fetch users' });
    }
});
exports.default = router;
