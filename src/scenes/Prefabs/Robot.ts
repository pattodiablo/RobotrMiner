
// You can write more code here

/* START OF COMPILED CODE */

import { SpineGameObject } from "@esotericsoftware/spine-phaser";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";
import { SpineGameObjectBoundsProvider } from "@esotericsoftware/spine-phaser";
import { SkinsAndAnimationBoundsProvider } from "@esotericsoftware/spine-phaser";
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

export default class Robot extends SpineGameObject {

	constructor(scene: Phaser.Scene, plugin: SpinePlugin, x: number, y: number, dataKey?: string, atlasKey?: string, skin?: string, boundsProvider?: SpineGameObjectBoundsProvider, xargs?: any) {
		super(scene, plugin, x ?? 0, y ?? 0, dataKey ?? "mainCharacter", atlasKey ?? "mainCharacter-atlas", boundsProvider ?? new SkinsAndAnimationBoundsProvider("idle", ["default"]));
		this.scene.events.on("gema-clicked", this.onGemaClicked, this);

		this.skeleton.setSkinByName(skin ?? "default");
		this.blinkSlot = this.skeleton.findSlot("blink");
		this.setBlinkVisible(false);
		this.blinkCooldown = this.randomBlinkDelay();

		// body_1
		const body_1 = b2CreateBody((this.scene as any).worldId, { 
			...b2DefaultBodyDef(), 
			type: b2BodyType.b2_kinematicBody, 
			position: pxmVec2(this.x, -this.y)
		});
		this.bodyId = body_1;

		// add body_1 to this
		AddSpriteToWorld((this.scene as any).worldId, this, { bodyId: body_1 });
		this.targetPosition = pxmVec2(this.x, -this.y);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	public worldId!: b2WorldId;
	private bodyId!: any;
	private targetPosition = new b2Vec2(0, 0);
	private moveSpeed = 8;
	private blinkSlot: any;
	private blinkCooldown = 0;
	private blinkDuration = 0;
	private blinking = false;
	private readonly blinkMinDelay = 1800;
	private readonly blinkMaxDelay = 4200;
	private readonly blinkVisibleMs = 140;
	private readonly movementThreshold = 0.05;

	/* START-USER-CODE */

	// Write your code here.
	private onGemaClicked = (x: number, y: number) => {
		this.moveTo(x, y-100);
	};

	moveTo(x: number, y: number) {
		this.setFacing(x);
		this.targetPosition = pxmVec2(x, -y);
	}

	private setFacing(targetX: number) {
		const currentFacing = this.scaleX < 0 ? -1 : 1;
		const desiredFacing = targetX < this.x ? 1 : -1;

		if (currentFacing === desiredFacing) {
			return;
		}

		this.scaleX = Math.abs(this.scaleX) * desiredFacing;
	}

	updateMovement(delta: number) {
		const currentPosition = b2Body_GetPosition(this.bodyId);
		const deltaX = this.targetPosition.x - currentPosition.x;
		const deltaY = this.targetPosition.y - currentPosition.y;
		const distance = Math.hypot(deltaX, deltaY);
		const maxTravel = this.moveSpeed * (delta / 1000);

		if (distance <= Math.max(this.movementThreshold, maxTravel)) {
			b2Body_SetLinearVelocity(this.bodyId, new b2Vec2(0, 0));
			b2Body_SetTransform(this.bodyId, this.targetPosition, b2MakeRot(0));
			this.updateBlink(delta, true);
			return;
		}

		const velocityX = (deltaX / distance) * this.moveSpeed;
		const velocityY = (deltaY / distance) * this.moveSpeed;
		b2Body_SetLinearVelocity(this.bodyId, new b2Vec2(velocityX, velocityY));
		this.updateBlink(delta, false);
	}

	private updateBlink(delta: number, isIdle: boolean) {
		if (!isIdle) {
			this.blinking = false;
			this.blinkDuration = 0;
			this.blinkCooldown = this.randomBlinkDelay();
			this.setBlinkVisible(false);
			return;
		}

		if (this.blinking) {
			this.blinkDuration -= delta;
			if (this.blinkDuration <= 0) {
				this.blinking = false;
				this.setBlinkVisible(false);
				this.blinkCooldown = this.randomBlinkDelay();
			}
			return;
		}

		this.blinkCooldown -= delta;
		if (this.blinkCooldown <= 0) {
			this.blinking = true;
			this.blinkDuration = this.blinkVisibleMs;
			this.setBlinkVisible(true);
		}
	}

	private setBlinkVisible(visible: boolean) {
		if (!this.blinkSlot) {
			return;
		}

		this.blinkSlot.color.a = visible ? 1 : 0;
	}

	private randomBlinkDelay() {
		return this.blinkMinDelay + Math.random() * (this.blinkMaxDelay - this.blinkMinDelay);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
