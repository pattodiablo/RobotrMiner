
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
	b2Vec2,
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
