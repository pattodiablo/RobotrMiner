
// You can write more code here

/* START OF COMPILED CODE */

import Robot from "./Prefabs/Robot";
/* START-USER-IMPORTS */
import Gema from "./Prefabs/Gema";
import Roca from "./Prefabs/Roca";
import Phaser from "../phaser";
import type { b2WorldId } from "../box2d.js";
import {

	AddSpriteToWorld,
	CreateWorld,
	CreateDebugDraw,
	DYNAMIC,
	b2BodyType,
	SetWorldScale,
	UpdateWorldSprites,
	WorldStep,
	b2CreateBody,
	b2CreateCircleShape,
	b2Circle,
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
	b2World_GetContactEvents,
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

		// piso
		const piso = b2CreateBody(this.worldId, { 
			...b2DefaultBodyDef(), 
			position: pxmVec2(494, -629)
		});

		// shape_1
		const shape_1 = b2CreatePolygonShape(piso, { 
			...b2DefaultShapeDef(), 
			restitution: 0.5
		}, b2MakeBox(pxm(800), pxm(100)));

		// mainCharacter
		const mainCharacter = new Robot(this, this.spine, 718, 290);
		this.add.existing(mainCharacter);
		mainCharacter.scaleX = 0.6501425353183732;
		mainCharacter.scaleY = 0.6501425353183732;

		// pared1
		const pared1 = b2CreateBody(this.worldId, { 
			...b2DefaultBodyDef(), 
			position: pxmVec2(-100, -246)
		});

		// shape
		const shape = b2CreatePolygonShape(pared1, { 
			...b2DefaultShapeDef(), 
			restitution: 0.5
		}, b2MakeBox(pxm(100), pxm(600)));

		// pared
		const pared = b2CreateBody(this.worldId, { 
			...b2DefaultBodyDef(), 
			position: pxmVec2(1139, -246)
		});

		// shape_2
		const shape_2 = b2CreatePolygonShape(pared, { 
			...b2DefaultShapeDef(), 
			restitution: 0.5
		}, b2MakeBox(pxm(100), pxm(600)));

		this.mainCharacter = mainCharacter;

		this.events.emit("scene-awake");
	}

	updateWorld(time: number, delta: number) {

		WorldStep({ worldId: this.worldId, deltaTime: delta });
		UpdateWorldSprites(this.worldId);
	}

	private mainCharacter!: Robot;
	public worldId!: b2WorldId;

	/* START-USER-CODE */

	// Write your code here
	private gems: Gema[] = [];

	private readonly rockSpawnMinDelay = 4000;
	private readonly rockSpawnMaxDelay = 10000;
	private debugCanvas: HTMLCanvasElement | null = null;
	private debugContext: CanvasRenderingContext2D | null = null;
	private debugDraw: any = null;
	private debugEnabled = false;
	private debugToggleKey!: Phaser.Input.Keyboard.Key;
	private createLevelBounds() {
		const b2body = b2CreateBody(this.worldId, {
			...b2DefaultBodyDef(),
			position: pxmVec2(-102, -307),
			rotation: b2MakeRot(Phaser.Math.DegToRad(90))
		});

		b2CreatePolygonShape(b2body, {
			...b2DefaultShapeDef(),
			restitution: 0.5
		}, b2MakeBox(pxm(800), pxm(100)));

		const b2body_2 = b2CreateBody(this.worldId, {
			...b2DefaultBodyDef(),
			position: pxmVec2(1142, -307),
			rotation: b2MakeRot(Phaser.Math.DegToRad(90))
		});

		b2CreatePolygonShape(b2body_2, {
			...b2DefaultShapeDef(),
			restitution: 0.5
		}, b2MakeBox(pxm(800), pxm(100)));
	}
	create() {
		SetWorldScale(40);

		const worldDef = b2DefaultWorldDef();
		worldDef.gravity = new b2Vec2(0, -10);

		const world = CreateWorld({ worldDef });
		this.worldId = world.worldId;
		this.editorCreate();
		this.createLevelBounds();
		this.setupBox2DDebug();
		this.mainCharacter.animationState.setAnimation(0, "idle", true);
		this.events.on("robot-finished-gem-move", () => {
			// Hook for when the robot reaches the gem-requested target.
		});
		this.scheduleNextRockSpawn();
		this.debugToggleKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.F3);




	}

	update(_time: number, delta: number) {
		if (Phaser.Input.Keyboard.JustDown(this.debugToggleKey)) {
			this.setBox2DDebugEnabled(!this.debugEnabled);
		}

		this.mainCharacter.updateMovement(delta);
		WorldStep({ worldId: this.worldId, deltaTime: delta / 1000 });
		this.handleGemMerges();
		this.handleRockImpacts();
		this.gems.forEach((gem) => gem.updateHold());
		UpdateWorldSprites(this.worldId);

		if (this.debugEnabled && this.debugContext && this.debugCanvas && this.debugDraw) {
			this.debugContext.clearRect(0, 0, this.debugCanvas.width, this.debugCanvas.height);
			b2World_Draw(this.worldId, this.debugDraw);
		}

	}

	private setupBox2DDebug() {
		const enabledFromUrl = new URLSearchParams(location.search).get("debugBox2D") === "1";
		this.setBox2DDebugEnabled(enabledFromUrl);
	}

	private setBox2DDebugEnabled(enabled: boolean) {
		this.debugEnabled = enabled;

		if (!enabled) {
			if (this.debugCanvas) {
				this.debugCanvas.style.display = "none";
			}
			return;
		}

		if (!this.debugCanvas) {
			this.debugCanvas = document.createElement("canvas");
			this.debugCanvas.width = this.scale.width;
			this.debugCanvas.height = this.scale.height;
			this.debugCanvas.style.position = "absolute";
			this.debugCanvas.style.left = "0";
			this.debugCanvas.style.top = "0";
			this.debugCanvas.style.width = "100%";
			this.debugCanvas.style.height = "100%";
			this.debugCanvas.style.pointerEvents = "none";
			this.debugCanvas.style.zIndex = "20";
			this.game.canvas.parentElement?.appendChild(this.debugCanvas);
			this.debugContext = this.debugCanvas.getContext("2d");
		}

		if (this.debugCanvas) {
			this.debugCanvas.style.display = "block";
		}

		if (!this.debugDraw) {
			this.debugDraw = CreateDebugDraw(this.debugCanvas, this.debugContext, 40);
			this.debugDraw.drawShapes = true;
			this.debugDraw.drawJoints = true;
			this.debugDraw.drawAABBs = false;
			this.debugDraw.drawMass = false;
			this.debugDraw.drawContacts = true;
			this.debugDraw.drawContactNormals = false;
			this.debugDraw.drawContactImpulses = false;
			this.debugDraw.drawFrictionImpulses = false;
		}
	}

	private spawnRock(x: number, y: number) {
		const rock = new Roca(this, x, y);
		this.add.existing(rock);
		return rock;
	}

	public registerGem(gem: Gema) {
		if (!this.gems.includes(gem)) {
			this.gems.push(gem);
		}
	}

	public unregisterGem(gem: Gema) {
		this.gems = this.gems.filter((currentGem) => currentGem !== gem);
	}

	private handleGemMerges() {
		const contactEvents = b2World_GetContactEvents(this.worldId);
		if (!contactEvents.beginEvents || contactEvents.beginCount === 0) {
			return;
		}

		for (let index = 0; index < contactEvents.beginCount; index += 1) {
			const contact = contactEvents.beginEvents[index];
			const gemA = this.findGemByShapeId(contact.shapeIdA);
			const gemB = this.findGemByShapeId(contact.shapeIdB);

			if (!gemA || !gemB || gemA === gemB) {
				continue;
			}

			if (gemA.getBirthType() !== gemB.getBirthType()) {
				continue;
			}

			this.mergeGems(gemA, gemB);
		}
	}

	private handleRockImpacts() {
		const contactEvents = b2World_GetContactEvents(this.worldId);
		if (!contactEvents.beginEvents || contactEvents.beginCount === 0) {
			return;
		}

		const contactedRocks = new Set<Roca>();

		for (let index = 0; index < contactEvents.beginCount; index += 1) {
			const contact = contactEvents.beginEvents[index];
			const rockA = this.findRockByShapeId(contact.shapeIdA);
			const rockB = this.findRockByShapeId(contact.shapeIdB);

			if (!rockA || !rockB || rockA === rockB) {
				continue;
			}

			if (rockA.canBreakFromCollision()) {
				rockA.breakFromCollision();
			}

			if (rockB.canBreakFromCollision()) {
				rockB.breakFromCollision();
			}

			contactedRocks.add(rockA);
			contactedRocks.add(rockB);
		}

		for (let index = 0; index < contactEvents.beginCount; index += 1) {
			const contact = contactEvents.beginEvents[index];
			const rockA = this.findRockByShapeId(contact.shapeIdA);
			const rockB = this.findRockByShapeId(contact.shapeIdB);

			if (rockA && rockB) {
				continue;
			}

			const rock = rockA || rockB;
			if (!rock || contactedRocks.has(rock)) {
				continue;
			}

			rock.disarmCollisionBreak();
		}
	}

	private findGemByShapeId(shapeId: any) {
		for (const gem of this.gems) {
			const gemShapeId = gem.getShapeId();
			if (gemShapeId && this.sameShapeId(gemShapeId, shapeId)) {
				return gem;
			}
		}

		return null;
	}

	private findRockByShapeId(shapeId: any) {
		for (const object of this.children.list) {
			if (!(object instanceof Roca)) {
				continue;
			}

			const rockShapeId = object.getShapeId?.();
			if (rockShapeId && this.sameShapeId(rockShapeId, shapeId)) {
				return object;
			}
		}

		return null;
	}

	private sameShapeId(a: any, b: any) {
		if (a === b) {
			return true;
		}

		if (!a || !b) {
			return false;
		}

		return a.index1 === b.index1 && a.revision === b.revision;
	}

	private mergeGems(gemA: Gema, gemB: Gema) {
		const mergedX = (gemA.x + gemB.x) / 2;
		const mergedY = (gemA.y + gemB.y) / 2;
		const textureKey = gemA.getNextBirthTextureKey();

		if (!textureKey) {
			return;
		}

		gemA.destroyGem();
		gemB.destroyGem();

		const mergedGem = new Gema(this, mergedX, mergedY, textureKey);
		this.add.existing(mergedGem);
		this.registerGem(mergedGem);
	}

	private scheduleNextRockSpawn() {
		const delay = this.rockSpawnMinDelay + Math.random() * (this.rockSpawnMaxDelay - this.rockSpawnMinDelay);
		this.time.delayedCall(delay, () => {
			const margin = 80;
			const width = this.scale.width;
			const x = -margin + Math.random() * (width + margin * 2);
			const y = -margin - Math.random() * margin;
			this.spawnRock(x, y);
			this.scheduleNextRockSpawn();
		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
