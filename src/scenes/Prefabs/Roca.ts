
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import Gema from "./Gema";
import {

	AddSpriteToWorld,
	RemoveSpriteFromWorld,
	b2DestroyShape,
	b2BodyType,
	b2CreateBody,
	b2DestroyBody,
	b2DefaultBodyDef,
	b2DefaultShapeDef,
	b2Body_SetLinearVelocity,
	b2Body_SetAngularVelocity,
	b2CreateCircleShape,
	b2Circle,
	b2Shape_SetCircle,
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
			type: b2BodyType.b2_dynamicBody, 
			position: pxmVec2(this.x, -this.y), 
			linearDamping: 1, 
			gravityScale: 10
		});

		// add body_2 to this
		AddSpriteToWorld((this.scene as any).worldId, this, { bodyId: body_2 });

		// shape_3
		const shape_3 = b2CreateCircleShape(body_2, { 
			...b2DefaultShapeDef()
		}, new b2Circle(new b2Vec2(pxm(0), pxm(0)), pxm(70)));

		/* START-USER-CTR-CODE */
		this.bodyId = body_2;
		this.colliderShapeId = shape_3;
		this.initializeRock();
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	// Write your code here.
	private bodyId!: any;
	private colliderShapeId: any = null;
	private hitParticles: any = null;
	private remainingHits = 0;
	private sizeMultiplier = 1;
	private destroyed = false;
	private readonly baseScale = 0.2939291756479111;
	private readonly baseRadius = 70.10210839202679;
	private readonly minSplitMultiplier = 0.45;
	private readonly childSizeMultiplier = 0.65;
	private readonly splitChance = 0.7;
	private readonly smallRockGemChance = 0.45;

	private initializeRock(sizeMultiplier = this.randomSizeMultiplier(), hitPoints = this.randomHitCount()) {
		this.createHitParticles();
		this.configureRock(sizeMultiplier, hitPoints);
		this.setInteractive({ useHandCursor: true });
		this.on("pointerdown", this.hitRock, this);
	}

	private configureRock(sizeMultiplier: number, hitPoints: number) {
		this.sizeMultiplier = sizeMultiplier;
		this.remainingHits = hitPoints;
		this.scaleX = this.baseScale * this.sizeMultiplier;
		this.scaleY = this.baseScale * this.sizeMultiplier;
		this.refreshCollider();
	}

	private createHitParticles() {
		if (this.hitParticles) {
			return;
		}

		this.ensureHitParticleTexture();

		this.hitParticles = this.scene.add.particles(0, 0, "rock-hit-particle", {
			quantity: 0,
			frequency: -1,
			lifespan: { min: 140, max: 240 },
			speedX: { min: -60, max: 60 },
			speedY: { min: -120, max: 20 },
			gravityY: 320,
			scale: { start: 0.7, end: 0 },
			alpha: { start: 1, end: 0 },
			tint: [0xf2efe8, 0xc8c8c8, 0xa7a7a7],
		});
		this.hitParticles.setBlendMode(Phaser.BlendModes.ADD);
	}

	private ensureHitParticleTexture() {
		if (this.scene.textures.exists("rock-hit-particle")) {
			return;
		}

		const graphics = this.scene.add.graphics();
		graphics.fillStyle(0xffffff, 1);
		graphics.fillRoundedRect(0, 0, 8, 8, 2);
		graphics.generateTexture("rock-hit-particle", 8, 8);
		graphics.destroy();
	}

	private refreshCollider() {
		if (!this.bodyId) {
			return;
		}

		if (!this.colliderShapeId) {
			return;
		}

		b2Shape_SetCircle(this.colliderShapeId, new b2Circle(new b2Vec2(pxm(0), pxm(0)), pxm(this.baseRadius * this.sizeMultiplier)));
	}

	private playHitFeedback() {
		if (!this.scene || this.destroyed) {
			return;
		}

		this.hitParticles?.explode(7, this.x, this.y);

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
		} else if (this.sizeMultiplier > this.childSizeMultiplier || Math.random() < this.smallRockGemChance) {
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
			child.configureRock(childSize, this.randomHitCount());
			this.scene.add.existing(child);
			this.applyBreakImpulse(child, Math.sign(offsetX) || 1, 1.5 + Math.random() * 0.8);
		}
	}

	private spawnGemReward() {
		const gem = new Gema(this.scene, this.x, this.y);
		this.scene.add.existing(gem);
		this.applyBreakImpulse(gem, Math.random() < 0.5 ? -1 : 1, 2 + Math.random() * 0.5);
		(this.scene as any).registerGem?.(gem);
	}

	private applyBreakImpulse(target: object, horizontalDirection: number, verticalSpeed: number) {
		const bodyId = (target as any).bodyId;
		if (!bodyId) {
			return;
		}

		const horizontalSpeed = 2.5 * horizontalDirection + (Math.random() - 0.5) * 0.75;
		b2Body_SetLinearVelocity(bodyId, new b2Vec2(pxm(horizontalSpeed * 40), pxm(verticalSpeed * 40)));
		b2Body_SetAngularVelocity(bodyId, (Math.random() - 0.5) * 3);
	}

	private removeFromWorld() {
		if (!this.bodyId) {
			return;
		}

		if (this.colliderShapeId) {
			b2DestroyShape(this.colliderShapeId);
		}
		this.colliderShapeId = null;

		RemoveSpriteFromWorld((this.scene as any).worldId, this, false);
		b2DestroyBody(this.bodyId);
		this.bodyId = null;
	}

	private destroySprite() {
		this.disableInteractive();
		if (this.hitParticles) {
			this.hitParticles.destroy();
			this.hitParticles = null;
		}
		super.destroy();
	}

	private randomHitCount() {
		return 3 + Math.floor(Math.random() * 2);
	}

	private randomSizeMultiplier() {
		return 0.6 + Math.random() * 0.5;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
