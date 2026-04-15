
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import type { b2WorldId } from "../../box2d.js";
import {

	AddSpriteToWorld,
	RemoveSpriteFromWorld,
	CreateWorld,
	DYNAMIC,
	b2BodyType,
	SetWorldScale,
	UpdateWorldSprites,
	WorldStep,
	b2CreateBody,
	b2DestroyBody,
	b2DefaultBodyDef,
	b2DefaultWorldDef,
	b2CreatePolygonShape,
	b2DefaultShapeDef,
	b2ComputeHull,
	b2MakeOffsetPolygon,
	b2Transform,
	b2MakeRot,
	b2MakeBox,
	b2DebugDraw as PhaserDebugDraw,
	b2World_Draw,
	b2Body_SetTransform,
	b2Body_GetPosition,
	b2Body_SetLinearVelocity,
	b2Body_SetAngularVelocity,

	b2Vec2,
	pxm,
	pxmVec2,
	} from "../../box2d.js";
/* END-USER-IMPORTS */

export default class Gema extends Phaser.GameObjects.Image {

	constructor(scene: Phaser.Scene, x?: number, y?: number, texture?: string, frame?: number | string) {
		super(scene, x ?? 0, y ?? 0, texture || "gema", frame);
		this.setInteractive({ useHandCursor: true });
		this.on("pointerdown", () => {
			this.scene.events.emit("gema-clicked", this, this.x, this.y);
		});

		// body
		const body = b2CreateBody((this.scene as any).worldId, { 
			...b2DefaultBodyDef(), 
			type: b2BodyType.b2_dynamicBody, 
			position: pxmVec2(this.x, -this.y), 
			gravityScale: 10
		});

		// add body to this
		AddSpriteToWorld((this.scene as any).worldId, this, { bodyId: body });
		this.bodyId = body;

		// shape
		const shape = b2CreatePolygonShape(body, { 
			...b2DefaultShapeDef()
		}, b2MakeOffsetPolygon(b2ComputeHull([new b2Vec2(pxm(-43), pxm(-41)), new b2Vec2(pxm(43), pxm(-41)), new b2Vec2(pxm(43), pxm(41)), new b2Vec2(pxm(-43), pxm(41))], 4), pxm(0), new b2Transform(new b2Vec2(pxm(0), pxm(0)), b2MakeRot(0))));

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	// Write your code here.
	private bodyId!: any;
	private held = false;
	private heldRobotBodyId: any = null;
	private destroyed = false;

	beginHold(robotBodyId: any) {
		if (this.destroyed) {
			return;
		}

		this.held = true;
		this.heldRobotBodyId = robotBodyId;
		b2Body_SetLinearVelocity(this.bodyId, new b2Vec2(0, 0));
		b2Body_SetAngularVelocity(this.bodyId, 0);
	}

	updateHold() {
		if (this.destroyed || !this.heldRobotBodyId || !this.bodyId) {
			return;
		}

		const robotPosition = b2Body_GetPosition(this.heldRobotBodyId);
		b2Body_SetTransform(this.bodyId, new b2Vec2(robotPosition.x, robotPosition.y - pxm(120)), b2MakeRot(0));
	}

	destroyGem() {
		if (this.destroyed) {
			return;
		}

		this.destroyed = true;
		this.held = false;
		this.heldRobotBodyId = null;
		(this.scene as any).unregisterGem?.(this);
		RemoveSpriteFromWorld((this.scene as any).worldId, this, false);
		if (this.bodyId) {
			b2DestroyBody(this.bodyId);
			this.bodyId = null;
		}
		super.destroy();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
