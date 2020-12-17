"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const middlewares_1 = require("./middlewares");
const package_json_1 = __importDefault(require("../package.json"));
const { version, name } = package_json_1.default;
class Server {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.routes();
        this.middlewares();
    }
    config() {
        const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(__dirname, 'access.log'), { flags: 'a' });
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use(express_1.default.json({ limit: '5mb' }));
        this.app.use(cookie_parser_1.default());
        this.app.use(morgan_1.default('common', { stream: accessLogStream }));
        this.app.use(compression_1.default());
        this.app.use(helmet_1.default());
        this.app.use(cors_1.default());
        this.app.use((_, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials x-access-token');
            res.header('Access-Control-Allow-Credentials', 'true');
            next();
        });
    }
    routes() {
        this.app.get('/', (_req, res) => res.json({ version, name }));
    }
    middlewares() {
        this.app.use(middlewares_1.notFound);
        this.app.use(middlewares_1.errorHandler);
    }
}
exports.default = new Server().app;
