declare module "phaser-box2d/dist/PhaserBox2D.js" {
	export const DYNAMIC: number;
	export function AddSpriteToWorld(worldId: any, sprite: any, body: any): void;
	export function CreateWorld(data: any): { worldId: any };
	export function SetWorldScale(scale: number): void;
	export function UpdateWorldSprites(worldId: any): void;
	export function WorldStep(data: any): number;
	export function b2CreateBody(worldId: any, bodyDef: any): any;
	export function b2DefaultBodyDef(): any;
	export function b2DefaultWorldDef(): any;
	export function pxmVec2(x: number, y: number): any;
}