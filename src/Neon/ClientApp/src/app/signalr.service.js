"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalrService = void 0;
var signalR = require("@microsoft/signalr");
var rxjs_1 = require("rxjs");
var SignalrService = /** @class */ (function () {
    function SignalrService() {
    }
    SignalrService.prototype.startConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.hubConnection = new signalR.HubConnectionBuilder()
                    .withUrl('/lobbyHub')
                    .build();
                this.users = new rxjs_1.BehaviorSubject([]);
                this.users$ = this.users.asObservable();
                this.topics = new rxjs_1.BehaviorSubject([
                    { id: '1', name: 'Science', description: '' },
                    { id: '2', name: 'History', description: '' },
                    { id: '3', name: 'Sport', description: '' },
                    { id: '4', name: 'Random', description: '' }
                ]);
                this.topics$ = this.topics.asObservable();
                this.hubConnection.on("userConnected", function (id, username) {
                    if (_this.users.getValue().filter(function (u) { return u.id === id; }).length === 0) {
                        var user = {
                            id: id,
                            name: username,
                            imageUrl: "https://graph.facebook.com/" + id + "/picture?type=normal",
                            profileUrl: "https://facebook.com/" + id
                        };
                        _this.users.next(__spreadArrays(_this.users.getValue(), [user]));
                    }
                });
                this.hubConnection.on("userDisconnected", function (id) {
                    console.log(id);
                });
                this.hubConnection.start().then(function () {
                    window['FB'].getLoginStatus(function (response) {
                        if (response.status === 'connected') {
                            // The user is logged in and has authenticated your
                            // app, and response.authResponse supplies
                            // the user's ID, a valid access token, a signed
                            // request, and the time the access token 
                            _this.newFbUserOnline();
                        }
                        else {
                            window['FB'].login(function (response) {
                                console.log('login response', response);
                                if (response.authResponse) {
                                    _this.newFbUserOnline();
                                }
                                else {
                                    console.log('User login failed');
                                }
                            }, { scope: 'email' });
                        }
                    });
                }).catch(function (err) { return document.write(err); });
                return [2 /*return*/];
            });
        });
    };
    SignalrService.prototype.newFbUserOnline = function () {
        var _this = this;
        window['FB'].api('/me', { fields: 'id, last_name, first_name, email' }, function (userInfo) {
            _this.hubConnection.send("NewOnlineUser", userInfo.id, userInfo.first_name + " " + userInfo.last_name);
        });
    };
    return SignalrService;
}());
exports.SignalrService = SignalrService;
//# sourceMappingURL=signalr.service.js.map