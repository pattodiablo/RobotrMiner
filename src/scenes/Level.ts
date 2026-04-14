
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import Phaser from "../phaser";
import type { b2WorldId } from "../box2d.js";
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

	b2Vec2,
	pxm,
	pxmVec2,
	} from "../box2d.js";
/* END-USER-IMPORTS */

export default class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {
		// Box2D world creation
		SetWorldScale(40);
		const world = CreateWorld({ worldDef: { 
			...b2DefaultWorldDef()
		}});
		this.worldId = world.worldId;

		// background
		const background = this.add.image(-40, -59, "background");
		background.scaleX = 0.5427640102953456;
		background.scaleY = 0.5427640102953456;
		background.setOrigin(0, 0);

		// playerBot
		this.add.image(583, 306, "PlayerBot");

		// gema
		const gema = this.add.image(337, 187, "gema");

		// body
		const body = b2CreateBody(this.worldId, { 
			...b2DefaultBodyDef(), 
			type: b2BodyType.b2_dynamicBody, 
			position: pxmVec2(337, -187), 
			gravityScale: 10
		});

		// add body to gema
		AddSpriteToWorld(this.worldId, gema, { bodyId: body });

		// shape
		const shape = b2CreatePolygonShape(body, { 
			...b2DefaultShapeDef()
		}, b2MakeOffsetPolygon(b2ComputeHull([new b2Vec2(pxm(-43), pxm(-41)), new b2Vec2(pxm(43), pxm(-41)), new b2Vec2(pxm(43), pxm(41)), new b2Vec2(pxm(-43), pxm(41))], 4), pxm(0), new b2Transform(new b2Vec2(pxm(0), pxm(0)), b2MakeRot(0))));

		// b2body_1
		const b2body_1 = b2CreateBody(this.worldId, { 
			...b2DefaultBodyDef(), 
			position: pxmVec2(494, -629)
		});

		// shape_1
		const shape_1 = b2CreatePolygonShape(b2body_1, { 
			...b2DefaultShapeDef(), 
			restitution: 0.5
		}, b2MakeBox(pxm(800), pxm(100)));

		this.gema = gema;

		this.events.emit("scene-awake");
	}

	updateWorld(time: number, delta: number) {

		WorldStep({ worldId: this.worldId, deltaTime: delta });
		UpdateWorldSprites(this.worldId);
	}

	private gema!: Phaser.GameObjects.Image;
	public worldId!: b2WorldId;

	/* START-USER-CODE */

	// Write your code here

	create() {
		SetWorldScale(40);

		const worldDef = b2DefaultWorldDef();
		worldDef.gravity = new b2Vec2(0, -10);

		const world = CreateWorld({ worldDef });
		this.worldId = world.worldId;
		this.editorCreate();





	}

	update(_time: number, delta: number) {
		WorldStep({ worldId: this.worldId, deltaTime: delta / 1000 });
		UpdateWorldSprites(this.worldId);

	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
