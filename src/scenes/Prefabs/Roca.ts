
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import Gema from "./Gema";
import type { b2WorldId } from "../../box2d.js";
import {

	AddSpriteToWorld,
	RemoveSpriteFromWorld,
	b2DestroyShape,
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
	b2CreateCircleShape,
	b2Circle,
	b2Vec2,
	pxm,
	pxmVec2,
	} from "../../box2d.js";

/* END-USER-IMPORTS */

export default class Roca extends Phaser.GameObjects.Image {

	constructor(scene: Phaser.Scene, x?: number, y?: number, texture?: string, frame?: number | string) {
		super(scene, x ?? 0, y ?? 0, texture || "roca1", frame);

		this.scaleX = 0.2939291756479111;
		this.scaleY = 0.2939291756479111;

		// body_2
		const body_2 = b2CreateBody((this.scene as any).worldId, { 
			...b2DefaultBodyDef(), 
			type: b2BodyType.b2_kinematicBody, 
			position: pxmVec2(this.x, -this.y), 
			gravityScale: 10
		});

		// add body_2 to this
		AddSpriteToWorld((this.scene as any).worldId, this, { bodyId: body_2 });

		// shape_3
		const shape_3 = b2CreateCircleShape(body_2, { 
			...b2DefaultShapeDef()
		}, new b2Circle(new b2Vec2(pxm(0), pxm(0)), pxm(0)));

		/* START-USER-CTR-CODE */
		this.initializeRock();
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	// Write your code here.
	private bodyId!: any;
	private colliderShapeId: any = null;
	private remainingHits = 0;
	private sizeMultiplier = 1;
	private destroyed = false;
	private readonly baseScale = 0.2939291756479111;
	private readonly baseRadius = 70.10210839202679;
	private readonly minSplitMultiplier = 0.45;
	private readonly childSizeMultiplier = 0.65;
	private readonly splitChance = 0.7;

	private initializeRock(sizeMultiplier = this.randomSizeMultiplier(), hitPoints = this.randomHitCount()) {
		this.sizeMultiplier = sizeMultiplier;
		this.remainingHits = hitPoints;
		this.scaleX = this.baseScale * this.sizeMultiplier;
		this.scaleY = this.baseScale * this.sizeMultiplier;
		this.refreshCollider();
		this.setInteractive({ useHandCursor: true });
		this.on("pointerdown", this.hitRock, this);
	}

	private refreshCollider() {
		if (!this.bodyId) {
			return;
		}

		if (this.colliderShapeId) {
			b2DestroyShape(this.colliderShapeId);
		}

		this.colliderShapeId = b2CreateCircleShape(this.bodyId, {
			...b2DefaultShapeDef()
		}, new b2Circle(new b2Vec2(pxm(0), pxm(0)), pxm(this.baseRadius * this.sizeMultiplier)));
	}

	private playHitFeedback() {
		if (!this.scene || this.destroyed) {
			return;
		}

		this.scene.tweens.killTweensOf(this);
		this.scene.tweens.add({
			targets: this,
			angle: { from: -2.5, to: 2.5 },
			duration: 35,
			yoyo: true,
			repeat: 2,
			ease: "Sine.easeInOut",
		});

		this.scene.tweens.add({
			targets: this,
			alpha: { from: 1, to: 0.92 },
			duration: 35,
			yoyo: true,
			repeat: 1,
			ease: "Sine.easeOut",
		});

		const squashScaleX = Math.max(this.scaleX - 0.1, this.scaleX * 0.85);
		const squashScaleY = Math.max(this.scaleY - 0.1, this.scaleY * 0.85);
		this.scene.tweens.add({
			targets: this,
			scaleX: { from: this.scaleX, to: squashScaleX },
			scaleY: { from: this.scaleY, to: squashScaleY },
			duration: 40,
			yoyo: true,
			repeat: 1,
			ease: "Sine.easeOut",
		});

		this.setTint(0xd8d8d8);
		this.scene.time.delayedCall(90, () => {
			if (!this.destroyed) {
				this.clearTint();
			}
		});
	}

	private hitRock() {
		if (this.destroyed) {
			return;
		}

		this.playHitFeedback();
		this.remainingHits -= 1;
		if (this.remainingHits > 0) {
			return;
		}

		this.breakRock();
	}

	private breakRock() {
		if (this.destroyed) {
			return;
		}

		this.destroyed = true;
		this.removeFromWorld();

		if (this.sizeMultiplier > this.minSplitMultiplier && Math.random() < this.splitChance) {
			this.spawnChildRocks();
		} else {
			this.spawnGemReward();
		}

		this.destroySprite();
	}

	private spawnChildRocks() {
		const childCount = 2 + Math.floor(Math.random() * 2);
		const childSize = this.sizeMultiplier * this.childSizeMultiplier;
		const spread = 42 * this.sizeMultiplier;

		for (let index = 0; index < childCount; index += 1) {
			const angle = (Math.PI * 2 * index) / childCount + Math.random() * 0.4;
			const offsetX = Math.cos(angle) * spread;
			const offsetY = Math.sin(angle) * spread * 0.6;
			const child = new Roca(this.scene, this.x + offsetX, this.y + offsetY, this.texture.key);
			child.sizeMultiplier = childSize;
			child.remainingHits = this.randomHitCount();
			child.scaleX = child.baseScale * child.sizeMultiplier;
			child.scaleY = child.baseScale * child.sizeMultiplier;
			this.scene.add.existing(child);
		}
	}

	private spawnGemReward() {
		const gem = new Gema(this.scene, this.x, this.y);
		this.scene.add.existing(gem);
		(this.scene as any).registerGem?.(gem);
	}

	private removeFromWorld() {
		if (!this.bodyId) {
			return;
		}

		RemoveSpriteFromWorld((this.scene as any).worldId, this, false);
		b2DestroyBody(this.bodyId);
		this.bodyId = null;
	}

	private destroySprite() {
		this.disableInteractive();
		super.destroy();
	}

	private randomHitCount() {
		return 4 + Math.floor(Math.random() * 3);
	}

	private randomSizeMultiplier() {
		return 0.6 + Math.random() * 0.5;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
