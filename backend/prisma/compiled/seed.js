"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcrypt = __importStar(require("bcrypt"));
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var organization, passwordHash, admin, teamLead, employee1, employee2, engineeringTeam, designTeam, sprintBoard, designBoard, todoList, inProgressList, reviewList, doneList, today;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🌱 Seeding database...');
                    // Clean database
                    return [4 /*yield*/, prisma.dailyExportLog.deleteMany()];
                case 1:
                    // Clean database
                    _a.sent();
                    return [4 /*yield*/, prisma.integrationConfig.deleteMany()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.notification.deleteMany()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, prisma.dailyStatus.deleteMany()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, prisma.activityLog.deleteMany()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, prisma.comment.deleteMany()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, prisma.card.deleteMany()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, prisma.list.deleteMany()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, prisma.boardMember.deleteMany()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, prisma.board.deleteMany()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, prisma.teamMember.deleteMany()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, prisma.team.deleteMany()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, prisma.user.deleteMany()];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, prisma.organization.deleteMany()];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, prisma.organization.create({
                            data: {
                                name: 'Acme Corporation',
                                settings: {
                                    defaultWorkHours: 8,
                                    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                                },
                            },
                        })];
                case 15:
                    organization = _a.sent();
                    console.log('✅ Created organization:', organization.name);
                    return [4 /*yield*/, bcrypt.hash('password123', 10)];
                case 16:
                    passwordHash = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                organizationId: organization.id,
                                email: 'admin@acme.com',
                                passwordHash: passwordHash,
                                name: 'Admin User',
                                role: client_1.UserRole.ORG_ADMIN,
                                position: 'CTO',
                            },
                        })];
                case 17:
                    admin = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                organizationId: organization.id,
                                email: 'lead@acme.com',
                                passwordHash: passwordHash,
                                name: 'John Team Lead',
                                role: client_1.UserRole.TEAM_LEAD,
                                position: 'Engineering Manager',
                            },
                        })];
                case 18:
                    teamLead = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                organizationId: organization.id,
                                email: 'alice@acme.com',
                                passwordHash: passwordHash,
                                name: 'Alice Developer',
                                role: client_1.UserRole.EMPLOYEE,
                                position: 'Senior Developer',
                            },
                        })];
                case 19:
                    employee1 = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                organizationId: organization.id,
                                email: 'bob@acme.com',
                                passwordHash: passwordHash,
                                name: 'Bob Designer',
                                role: client_1.UserRole.EMPLOYEE,
                                position: 'UX Designer',
                            },
                        })];
                case 20:
                    employee2 = _a.sent();
                    console.log('✅ Created 4 users');
                    return [4 /*yield*/, prisma.team.create({
                            data: {
                                organizationId: organization.id,
                                name: 'Engineering',
                                description: 'Software development team',
                            },
                        })];
                case 21:
                    engineeringTeam = _a.sent();
                    return [4 /*yield*/, prisma.team.create({
                            data: {
                                organizationId: organization.id,
                                name: 'Design',
                                description: 'Product design team',
                            },
                        })];
                case 22:
                    designTeam = _a.sent();
                    console.log('✅ Created 2 teams');
                    // Add team members
                    return [4 /*yield*/, prisma.teamMember.createMany({
                            data: [
                                { teamId: engineeringTeam.id, userId: teamLead.id },
                                { teamId: engineeringTeam.id, userId: employee1.id },
                                { teamId: designTeam.id, userId: employee2.id },
                            ],
                        })];
                case 23:
                    // Add team members
                    _a.sent();
                    console.log('✅ Added team members');
                    return [4 /*yield*/, prisma.board.create({
                            data: {
                                organizationId: organization.id,
                                teamId: engineeringTeam.id,
                                name: 'Sprint 24 - Q1 2025',
                                description: 'Current sprint board for engineering team',
                                createdBy: teamLead.id,
                            },
                        })];
                case 24:
                    sprintBoard = _a.sent();
                    return [4 /*yield*/, prisma.board.create({
                            data: {
                                organizationId: organization.id,
                                teamId: designTeam.id,
                                name: 'Design Projects',
                                description: 'Design team projects and tasks',
                                createdBy: admin.id,
                            },
                        })];
                case 25:
                    designBoard = _a.sent();
                    console.log('✅ Created 2 boards');
                    // Add board members
                    return [4 /*yield*/, prisma.boardMember.createMany({
                            data: [
                                { boardId: sprintBoard.id, userId: teamLead.id, role: 'OWNER' },
                                { boardId: sprintBoard.id, userId: employee1.id, role: 'MEMBER' },
                                { boardId: designBoard.id, userId: admin.id, role: 'OWNER' },
                                { boardId: designBoard.id, userId: employee2.id, role: 'MEMBER' },
                            ],
                        })];
                case 26:
                    // Add board members
                    _a.sent();
                    return [4 /*yield*/, prisma.list.create({
                            data: {
                                boardId: sprintBoard.id,
                                name: 'To Do',
                                position: 0,
                            },
                        })];
                case 27:
                    todoList = _a.sent();
                    return [4 /*yield*/, prisma.list.create({
                            data: {
                                boardId: sprintBoard.id,
                                name: 'In Progress',
                                position: 1,
                            },
                        })];
                case 28:
                    inProgressList = _a.sent();
                    return [4 /*yield*/, prisma.list.create({
                            data: {
                                boardId: sprintBoard.id,
                                name: 'Review',
                                position: 2,
                            },
                        })];
                case 29:
                    reviewList = _a.sent();
                    return [4 /*yield*/, prisma.list.create({
                            data: {
                                boardId: sprintBoard.id,
                                name: 'Done',
                                position: 3,
                            },
                        })];
                case 30:
                    doneList = _a.sent();
                    console.log('✅ Created 4 lists');
                    // Create Cards
                    return [4 /*yield*/, prisma.card.createMany({
                            data: [
                                {
                                    boardId: sprintBoard.id,
                                    listId: todoList.id,
                                    title: 'Implement user authentication',
                                    description: 'Add JWT-based authentication to the API',
                                    assigneeId: employee1.id,
                                    status: client_1.CardStatus.TODO,
                                    priority: client_1.CardPriority.HIGH,
                                    estimateHours: 8,
                                    dueDate: new Date('2025-01-25'),
                                    createdBy: teamLead.id,
                                    position: 0,
                                },
                                {
                                    boardId: sprintBoard.id,
                                    listId: todoList.id,
                                    title: 'Design database schema',
                                    description: 'Create comprehensive database schema for all entities',
                                    assigneeId: employee1.id,
                                    status: client_1.CardStatus.TODO,
                                    priority: client_1.CardPriority.MEDIUM,
                                    estimateHours: 4,
                                    dueDate: new Date('2025-01-22'),
                                    createdBy: teamLead.id,
                                    position: 1,
                                },
                                {
                                    boardId: sprintBoard.id,
                                    listId: inProgressList.id,
                                    title: 'Build Kanban board UI',
                                    description: 'Implement drag-and-drop Kanban board interface',
                                    assigneeId: employee2.id,
                                    status: client_1.CardStatus.IN_PROGRESS,
                                    priority: client_1.CardPriority.HIGH,
                                    estimateHours: 12,
                                    dueDate: new Date('2025-01-28'),
                                    createdBy: teamLead.id,
                                    position: 0,
                                },
                                {
                                    boardId: sprintBoard.id,
                                    listId: doneList.id,
                                    title: 'Set up project repository',
                                    description: 'Initialize Git repository and project structure',
                                    assigneeId: employee1.id,
                                    status: client_1.CardStatus.DONE,
                                    priority: client_1.CardPriority.MEDIUM,
                                    estimateHours: 2,
                                    createdBy: teamLead.id,
                                    position: 0,
                                },
                            ],
                        })];
                case 31:
                    // Create Cards
                    _a.sent();
                    console.log('✅ Created 4 cards');
                    today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return [4 /*yield*/, prisma.dailyStatus.createMany({
                            data: [
                                {
                                    userId: employee1.id,
                                    date: today,
                                    summary: 'Working on authentication module. Made good progress on JWT implementation.',
                                    blockers: 'None',
                                    mood: 'HAPPY',
                                },
                                {
                                    userId: employee2.id,
                                    date: today,
                                    summary: 'Designing the Kanban board interface. Created wireframes and mockups.',
                                    blockers: 'Waiting for design system approval',
                                    mood: 'NEUTRAL',
                                },
                            ],
                        })];
                case 32:
                    _a.sent();
                    console.log('✅ Created daily statuses');
                    // Create Integration Config
                    return [4 /*yield*/, prisma.integrationConfig.create({
                            data: {
                                organizationId: organization.id,
                                type: 'SOAP',
                                endpointUrl: 'https://external-hr-system.com/soap/endpoint',
                                credentials: {
                                    username: 'acme_user',
                                    password: 'encrypted_password',
                                },
                                isActive: false, // Disabled by default
                            },
                        })];
                case 33:
                    // Create Integration Config
                    _a.sent();
                    console.log('✅ Created integration config');
                    console.log('\n🎉 Seed completed successfully!\n');
                    console.log('📋 Demo Login Credentials:');
                    console.log('   Admin:     admin@acme.com / password123');
                    console.log('   Team Lead: lead@acme.com / password123');
                    console.log('   Employee:  alice@acme.com / password123');
                    console.log('   Employee:  bob@acme.com / password123\n');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
