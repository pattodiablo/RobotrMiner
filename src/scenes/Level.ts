
// You can write more code here

/* START OF COMPILED CODE */

import Gema from "./Prefabs/Gema";
import Robot from "./Prefabs/Robot";
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

		// gema
		const gema = new Gema(this, 337, 187);
		this.add.existing(gema);

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

		// mainCharacter
		const mainCharacter = new Robot(this, this.spine, 718, 290);
		this.add.existing(mainCharacter);
		mainCharacter.scaleX = 0.6501425353183732;
		mainCharacter.scaleY = 0.6501425353183732;

		this.gems.push(gema);
		this.mainCharacter = mainCharacter;

		this.events.emit("scene-awake");
	}

	updateWorld(time: number, delta: number) {

		WorldStep({ worldId: this.worldId, deltaTime: delta });
		UpdateWorldSprites(this.worldId);
	}

	private gems: Gema[] = [];
	private mainCharacter!: Robot;
	public worldId!: b2WorldId;
	private readonly gemSpawnMinDelay = 4000;
	private readonly gemSpawnMaxDelay = 10000;

	/* START-USER-CODE */

	// Write your code here

	create() {
		SetWorldScale(40);

		const worldDef = b2DefaultWorldDef();
		worldDef.gravity = new b2Vec2(0, -10);

		const world = CreateWorld({ worldDef });
		this.worldId = world.worldId;
		this.editorCreate();
		this.mainCharacter.animationState.setAnimation(0, "idle", true);
		this.events.on("robot-finished-gem-move", () => {
			// Hook for when the robot reaches the gem-requested target.
		});
		this.scheduleNextGemSpawn();




	}

	update(_time: number, delta: number) {
		this.mainCharacter.updateMovement(delta);
		WorldStep({ worldId: this.worldId, deltaTime: delta / 1000 });
		this.gems.forEach((gem) => gem.updateHold());
		UpdateWorldSprites(this.worldId);

	}

	/* END-USER-CODE */

	private spawnGem(x: number, y: number) {
		const gem = new Gema(this, x, y);
		this.add.existing(gem);
		this.gems.push(gem);
		return gem;
	}

	private scheduleNextGemSpawn() {
		const delay = this.gemSpawnMinDelay + Math.random() * (this.gemSpawnMaxDelay - this.gemSpawnMinDelay);
		this.time.delayedCall(delay, () => {
			const margin = 80;
			const width = this.scale.width;
			const height = this.scale.height;
			const x = margin + Math.random() * Math.max(0, width - margin * 2);
			const y = margin + Math.random() * Math.max(0, height - margin * 2);
			this.spawnGem(x, y);
			this.scheduleNextGemSpawn();
		});
	}
}

/* END OF COMPILED CODE */

// You can write more code here
