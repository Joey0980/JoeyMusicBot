import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default class DB {
    static async getDJRolesMap (): Promise<Map<string, { DJEnabled: boolean, ids: string[] }>> { // serverId, roleIds
        let server = await prisma.server.findMany({
            select: {
                djRoles: {
                    select: {
                        id: true
                    }
                },
                djModeEnabled: true,
                id: true
            }
        });

        let map = new Map<string, { DJEnabled: boolean, ids: string[] }>();

        for (const s of server) {
            let ids: string[] = [];
            for (const r of s.djRoles) {
                ids.push(r.id);
            }
            map.set(s.id, { DJEnabled: s.djModeEnabled, ids: ids });
        }

        return map;
    }

    static async getDJRolesArray(serverId: string): Promise<string[]> {
        let server = await prisma.server.findUnique({
            where: {
                id: serverId
            },
            select: {
                djRoles: {
                    select: {
                        id: true
                    }
                }
            }
        });

        let ids: string[] = [];
        for (const r of server!.djRoles) {
            ids.push(r.id);
        }

        return ids;
    }

    static async getDJModeEnabled(serverId: string): Promise<boolean> {
        return prisma.server.findUnique({
            where: {
                id: serverId
            },
            select: {
                djModeEnabled: true
            }
        }).then(s => s!.djModeEnabled);
    }

    static async setEnabled(serverId: string, enabled: boolean): Promise<boolean> {
        await this.confirmServer(serverId);
        try {
            let server = await prisma.server.findUnique({
                where: {
                    id: serverId
                },
                select: {
                    djModeEnabled: true
                }
            });

            if (server!.djModeEnabled === enabled) return false;

            await prisma.server.update({
                where: {
                    id: serverId
                },
                data: {
                    djModeEnabled: enabled
                }
            });

            return true;
        } catch (e) {
            return false;
        }

    }

    static async addRole(serverId: string, roleId: string): Promise<boolean> {
        await this.confirmServer(serverId);
        try {
            if (await prisma.role.findUnique({
                where: {
                    id: roleId
                }
            })) {
                return false;
            }
            await prisma.role.create({
                data: {
                    serverId: serverId,
                    id: roleId
                }
            });

            return true;
        } catch (e) {
            return false;
        }
    }

    static async removeRole(serverId: string, roleId: string): Promise<boolean> {
        await this.confirmServer(serverId);
        try {
            if (!await prisma.role.findUnique({
                where: {
                    id: roleId
                }
            })) {
                return false;
            }
            await prisma.role.delete({
                where: {
                    id: roleId
                }
            });
            return true;
        } catch (e) {
            return false;
        }
    }


    static async createServer(serverId: string): Promise<void> {
        await prisma.server.create({
            data: {
                id: serverId
            }
        });

        return;
    }

    static async confirmServer(serverId: string): Promise<void> {
        if (!await prisma.server.findUnique({
            where: {
                id: serverId
            }
        })) {
            await DB.createServer(serverId);
        }
    }

    static async getServerLocalizations(): Promise<Map<string, string>> {
        let servers = await prisma.server.findMany({
            select: {
                localizationId: true,
                id: true
            }
        });

        let map = new Map<string, string>();

        for (const s of servers) {
            if (s.localizationId) {
                map.set(s.id, s.localizationId);
            }
        }

        return map;
    }

    static async setServerLocalization(serverId: string, localizationId: string): Promise<void> {
        await this.confirmServer(serverId);
        await prisma.server.update({
            where: {
                id: serverId
            },
            data: {
                localizationId: localizationId
            }
        });
    }
}

export { prisma };