
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import type { b2WorldId } from "../../box2d.js";
import {

	AddSpriteToWorld,
	CreateWorld,
	DYNAMIC,
	b2BodyType,
	SetWorldScale,
	UpdateWorldSprites,
	WorldStep,
	b2CreateBody,
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
			this.scene.events.emit("gema-clicked", this.x, this.y);
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

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
