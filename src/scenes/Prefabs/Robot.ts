
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
	b2Body_SetAngularVelocity,
	b2Body_SetType,

	b2Vec2,
	pxm,
	pxmVec2,
	} from "../../box2d.js";
/* END-USER-IMPORTS */

export default class Robot extends SpineGameObject {

	constructor(scene: Phaser.Scene, plugin: SpinePlugin, x: number, y: number, dataKey?: string, atlasKey?: string, skin?: string, boundsProvider?: SpineGameObjectBoundsProvider, xargs?: any) {
		super(scene, plugin, x ?? 0, y ?? 0, dataKey ?? "mainCharacter", atlasKey ?? "mainCharacter-atlas", boundsProvider ?? new SkinsAndAnimationBoundsProvider("idle", ["default"]));
		this.liftDistance = pxm(this.scene.scale.height + 200);

		this.skeleton.setSkinByName(skin ?? "default");
		this.blinkSlot = this.skeleton.findSlot("blink");
		this.sadSlot = this.skeleton.findSlot("sad");
		this.setBlinkVisible(false);
		this.setSadVisible(false);
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
		this.homePosition = pxmVec2(this.x, -this.y);
		this.targetPosition = pxmVec2(this.x, -this.y);
		this.animationState.setAnimation(0, "idle", true);
		this.scene.events.on("update", this.handleSceneUpdate, this);
		this.scene.events.on("robot-gem-stolen", this.handleGemStolen, this);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	
	/* START-USER-CODE */

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
	private liftDistance = pxm(900);
	private readonly returnThreshold = 0.05;
	private homePosition = new b2Vec2(0, 0);
	private idleWanderTarget: { x: number; y: number } | null = null;
	private idleWanderPause = 0;
	private readonly idleWanderRadius = pxm(180);
	private readonly idleWanderSpeed = 4;
	private readonly idleWanderEnterMinMs = 1200;
	private readonly idleWanderEnterMaxMs = 2800;
	private readonly idlePauseMinMs = 450;
	private readonly idlePauseMaxMs = 1400;
	private readonly idleViewportMargin = pxm(80);
	private readonly sadMinMs = 1400;
	private readonly sadMaxMs = 2400;
	private isGrabbing = false;
	private isHolding = false;
	private heldGem: any = null;
	private pickupTarget: { x: number; y: number } | null = null;
	private isLifting = false;
	private isReturning = false;
	private idleWanderStartDelay = 0;
	private lastKnownPosition = new b2Vec2(0, 0);
	private isSad = false;
	private sadTimeLeft = 0;
	private sadSlot: any;

	private handleSceneUpdate(_time: number, delta: number) {
		if (this.isSad) {
			this.updateSad(delta);
			return;
		}

		this.updateMovement(delta);
	}

	private handleGemStolen(robotBodyId: any) {
		if (robotBodyId !== this.bodyId) {
			return;
		}

		this.enterSadState();
	}

	private enterSadState() {
		this.isSad = true;
		this.sadTimeLeft = this.randomSadDuration();
		this.isGrabbing = false;
		this.isHolding = false;
		this.isLifting = false;
		this.isReturning = false;
		this.heldGem = null;
		this.pickupTarget = null;
		this.idleWanderTarget = null;
		this.idleWanderPause = 0;
		this.idleWanderStartDelay = 0;
		b2Body_SetLinearVelocity(this.bodyId, new b2Vec2(0, 0));
		this.animationState.setAnimation(0, "idle", true);
		(this.animationState as any).timeScale = 0;
		this.setBlinkVisible(false);
		this.setSadVisible(true);
	}

	private updateSad(delta: number) {
		b2Body_SetLinearVelocity(this.bodyId, new b2Vec2(0, 0));
		b2Body_SetAngularVelocity(this.bodyId, 0);
		this.sadTimeLeft -= delta;
		if (this.sadTimeLeft > 0) {
			return;
		}

		this.exitSadState();
	}

	private exitSadState() {
		this.isSad = false;
		this.sadTimeLeft = 0;
		(this.animationState as any).timeScale = 1;
		this.setSadVisible(false);
		this.setBlinkVisible(false);
		this.animationState.setAnimation(0, "idle", true);
		this.idleWanderStartDelay = this.randomIdleEnterDelay();
	}

	// Write your code here.
	private onGemaClicked = (gem: any, x: number, y: number) => {
		if (this.isGrabbing || this.isHolding || this.isLifting || this.isReturning) {
			return;
		}

		this.startGemPickup(gem, x, y);
	};

	private startGemPickup(gem: any, x?: number, y?: number) {
		if (this.isGrabbing || this.isHolding || this.isLifting || this.isReturning) {
			return;
		}

		if (!gem || !gem.reserveForRobot?.(this.bodyId)) {
			return;
		}

		this.isGrabbing = true;
		this.heldGem = gem;
		this.pickupTarget = { x: x ?? gem.x, y: (y ?? gem.y) - 100 };
		this.moveTo(this.pickupTarget.x, this.pickupTarget.y);
	}

	private updatePickupTargetFromGem() {
		if (!this.isGrabbing || !this.heldGem || this.heldGem.destroyed || !this.heldGem.bodyId) {
			return;
		}

		if (this.pickupTarget) {
			this.moveTo(this.pickupTarget.x, this.pickupTarget.y);
		}
	}

	private abortPickup() {
		if (this.heldGem?.releaseRobotReservation) {
			this.heldGem.releaseRobotReservation(this.bodyId);
		}

		this.isGrabbing = false;
		this.isHolding = false;
		this.isLifting = false;
		this.isReturning = false;
		this.heldGem = null;
		this.pickupTarget = null;
		this.targetPosition = this.homePosition;
		this.idleWanderTarget = null;
		this.idleWanderPause = 0;
		this.idleWanderStartDelay = this.randomIdleEnterDelay();
		this.animationState.setAnimation(0, "idle", true);
		b2Body_SetLinearVelocity(this.bodyId, new b2Vec2(0, 0));
	}

	private tryAutoAcquireNearestGem() {
		if (this.isGrabbing || this.isHolding || this.isLifting || this.isReturning) {
			return false;
		}

		if ((this.scene as any).isGemBeingCarried?.()) {
			return false;
		}

		const gems = (this.scene as any).gems as any[] | undefined;
		if (!gems || gems.length === 0) {
			return false;
		}

		const currentPosition = b2Body_GetPosition(this.bodyId);
		let nearestGem: any = null;
		let nearestDistance = Number.POSITIVE_INFINITY;

		for (const gem of gems) {
			if (!gem || gem.destroyed || !gem.bodyId || !gem.canBeTargetedByRobot?.(this.bodyId)) {
				continue;
			}

			const deltaX = gem.x - currentPosition.x;
			const deltaY = gem.y - currentPosition.y;
			const distance = deltaX * deltaX + deltaY * deltaY;
			if (distance < nearestDistance) {
				nearestDistance = distance;
				nearestGem = gem;
			}
		}

		if (!nearestGem) {
			return false;
		}

		this.startGemPickup(nearestGem);
		return true;
	}

	moveTo(x: number, y: number) {
		const currentPosition = b2Body_GetPosition(this.bodyId);
		this.setFacing(currentPosition.x, pxm(x));
		this.targetPosition = pxmVec2(x, -y);
	}

	private setFacing(referenceX: number, targetX: number) {
		const currentFacing = this.scaleX < 0 ? -1 : 1;
		const desiredFacing = targetX < referenceX ? 1 : -1;

		if (currentFacing === desiredFacing) {
			return;
		}

		this.scaleX = Math.abs(this.scaleX) * desiredFacing;
	}

	private updateMovement(delta: number) {
		this.lastKnownPosition = b2Body_GetPosition(this.bodyId);

		if (!this.isGrabbing && !this.isHolding && !this.isLifting && !this.isReturning) {
			if (this.tryAutoAcquireNearestGem()) {
				return;
			}

			this.updateIdleWander(delta);
			return;
		}

		if (this.isGrabbing) {
			if (!this.heldGem || this.heldGem.destroyed || !this.heldGem.bodyId) {
				this.abortPickup();
				return;
			}

			this.updatePickupTargetFromGem();
		}

		const currentPosition = b2Body_GetPosition(this.bodyId);
		const deltaX = this.targetPosition.x - currentPosition.x;
		const deltaY = this.targetPosition.y - currentPosition.y;
		const distance = Math.hypot(deltaX, deltaY);
		const maxTravel = this.moveSpeed * (delta / 1000);

		if (distance <= Math.max(this.movementThreshold, maxTravel)) {
			b2Body_SetLinearVelocity(this.bodyId, new b2Vec2(0, 0));
			b2Body_SetTransform(this.bodyId, this.targetPosition, b2MakeRot(0));
			if (this.isGrabbing) {
				if (!this.heldGem || this.heldGem.destroyed || !this.heldGem.bodyId) {
					this.abortPickup();
					return;
				}

				this.isGrabbing = false;
				this.isHolding = true;
				this.pickupTarget = null;
				this.playGrabAnimation();
				this.scene.events.emit("robot-finished-gem-move", this);
			} else if (this.isLifting) {
				this.finishLift();
			} else if (this.isReturning) {
				this.finishReturn();
			}
			this.updateBlink(delta, this.isReturning || (!this.isGrabbing && !this.isHolding && !this.isLifting));
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

	private setSadVisible(visible: boolean) {
		if (!this.sadSlot) {
			return;
		}

		this.sadSlot.color.a = visible ? 1 : 0;
	}

	private playGrabAnimation() {
		const grabEntry = this.animationState.setAnimation(0, "agarrar", false);
		grabEntry.listener = {
			complete: () => {
				this.animationState.setAnimation(0, "agarrando", true);
				if (this.heldGem) {
					this.heldGem.beginHold(this.bodyId);
					const liftBasePosition = this.isValidPosition(this.lastKnownPosition)
						? this.lastKnownPosition
						: b2Body_GetPosition(this.bodyId);
					const offscreenLiftY = this.getOffscreenLiftTargetY();
					const targetLiftY = Math.max(liftBasePosition.y + this.liftDistance, offscreenLiftY);
					this.targetPosition = new b2Vec2(liftBasePosition.x, targetLiftY);
					this.isLifting = true;
				}
			}
		};
	}

	private getOffscreenLiftTargetY() {
		return pxm(this.scene.scale.height + 1400);
	}

	private isValidPosition(position: { x: number; y: number }) {
		return !(position.x === 0 && position.y === 0);
	}

	private finishLift() {
		this.isLifting = false;
		this.isHolding = false;
		this.animationState.setAnimation(0, "idle", true);

		if (this.heldGem) {
			this.heldGem.destroyGem();
			this.heldGem = null;
		}

		this.targetPosition = this.homePosition;
		this.isReturning = true;
	}

	private finishReturn() {
		this.isReturning = false;
		this.isHolding = false;
		this.isGrabbing = false;
		this.pickupTarget = null;
		this.idleWanderTarget = null;
		this.idleWanderPause = 0;
		this.idleWanderStartDelay = this.randomIdleEnterDelay();
		this.animationState.setAnimation(0, "idle", true);
	}

	private updateIdleWander(delta: number) {
		if (this.idleWanderStartDelay > 0) {
			this.idleWanderStartDelay -= delta;
			b2Body_SetLinearVelocity(this.bodyId, new b2Vec2(0, 0));
			this.updateBlink(delta, true);
			return;
		}

		if (this.idleWanderPause > 0) {
			this.idleWanderPause -= delta;
			b2Body_SetLinearVelocity(this.bodyId, new b2Vec2(0, 0));
			this.updateBlink(delta, true);
			return;
		}

		const currentPosition = b2Body_GetPosition(this.bodyId);
		if (!this.idleWanderTarget) {
			this.chooseIdleWanderTarget(currentPosition);
		}

		if (!this.idleWanderTarget) {
			this.updateBlink(delta, true);
			return;
		}

		const deltaX = this.idleWanderTarget.x - currentPosition.x;
		const deltaY = this.idleWanderTarget.y - currentPosition.y;
		const distance = Math.hypot(deltaX, deltaY);
		const maxTravel = this.idleWanderSpeed * (delta / 1000);
		this.setFacing(currentPosition.x, this.idleWanderTarget.x);

		if (distance <= Math.max(this.movementThreshold, maxTravel)) {
			b2Body_SetLinearVelocity(this.bodyId, new b2Vec2(0, 0));
			b2Body_SetTransform(this.bodyId, this.idleWanderTarget, b2MakeRot(0));
			this.idleWanderTarget = null;
			this.idleWanderPause = this.randomIdlePause();
			this.updateBlink(delta, true);
			return;
		}

		const velocityX = (deltaX / distance) * this.idleWanderSpeed;
		const velocityY = (deltaY / distance) * this.idleWanderSpeed;
		b2Body_SetLinearVelocity(this.bodyId, new b2Vec2(velocityX, velocityY));
		this.updateBlink(delta, true);
	}

	private chooseIdleWanderTarget(_currentPosition: { x: number; y: number }) {
		const offsetX = (Math.random() * 2 - 1) * this.idleWanderRadius;
		const offsetY = (Math.random() * 2 - 1) * this.idleWanderRadius * 0.35;
		const targetX = this.clamp(
			this.homePosition.x + offsetX,
			this.idleViewportMargin,
			pxm(this.scene.scale.width) - this.idleViewportMargin
		);
		const targetY = this.clamp(
			this.homePosition.y + offsetY,
			-pxm(this.scene.scale.height) + this.idleViewportMargin,
			-this.idleViewportMargin
		);
		this.idleWanderTarget = new b2Vec2(targetX, targetY);
		b2Body_SetLinearVelocity(this.bodyId, new b2Vec2(0, 0));
	}

	private randomIdlePause() {
		return this.idlePauseMinMs + Math.random() * (this.idlePauseMaxMs - this.idlePauseMinMs);
	}

	private randomIdleEnterDelay() {
		return this.idleWanderEnterMinMs + Math.random() * (this.idleWanderEnterMaxMs - this.idleWanderEnterMinMs);
	}

	private clamp(value: number, min: number, max: number) {
		return Math.min(max, Math.max(min, value));
	}

	private randomBlinkDelay() {
		return this.blinkMinDelay + Math.random() * (this.blinkMaxDelay - this.blinkMinDelay);
	}

	private randomSadDuration() {
		return this.sadMinMs + Math.random() * (this.sadMaxMs - this.sadMinMs);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
