
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import {

	AddSpriteToWorld,
	RemoveSpriteFromWorld,
	b2BodyType,
	b2CreateBody,
	b2DestroyBody,
	b2DefaultBodyDef,
	b2DefaultShapeDef,
	b2Body_SetLinearVelocity,
	b2Body_SetAngularVelocity,
	b2CreateCircleShape,
	b2Circle,
	b2Vec2,
	pxm,
	pxmVec2,
	} from "../../box2d.js";

/* END-USER-IMPORTS */

export default class Debree extends Phaser.GameObjects.Image {
	private bodyId!: any;
	private destroyed = false;
	private lifeTimer?: Phaser.Time.TimerEvent;
	private blinkTween?: Phaser.Tweens.Tween;

	constructor(scene: Phaser.Scene, x?: number, y?: number, texture?: string, frame?: number | string) {
		super(scene, x ?? 0, y ?? 0, texture || "debree1", frame);

		const scale = 0.28 + Math.random() * 0.35;
		this.setScale(scale);
		this.setDepth(950);

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

		const angle = Math.random() * Math.PI * 2;
		const speed = 2.2 + Math.random() * 4.8;
		const upwardBoost = 1.8 + Math.random() * 2.6;
		const velocityX = Math.cos(angle) * speed;
		const velocityY = Math.sin(angle) * speed + upwardBoost;
		b2Body_SetLinearVelocity(this.bodyId, new b2Vec2(pxm(velocityX * 40), pxm(velocityY * 40)));
		b2Body_SetAngularVelocity(this.bodyId, (Math.random() * 2 - 1) * 9);

		// shape
		const shape = b2CreateCircleShape(body, { 
			...b2DefaultShapeDef()
		}, new b2Circle(new b2Vec2(pxm(0), pxm(0)), pxm(8)));

		/* START-USER-CTR-CODE */
		// Write your code here.
		this.startLifeCycle();
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	// Write your code here.
	private startLifeCycle() {
		const lifeMs = 700 + Math.random() * 800;
		this.lifeTimer = this.scene.time.delayedCall(lifeMs, () => {
			if (this.destroyed) {
				return;
			}

			this.blinkTween = this.scene.tweens.add({
				targets: this,
				alpha: { from: 1, to: 0.2 },
				duration: 80,
				yoyo: true,
				repeat: 5,
				onComplete: () => this.destroyDebree(),
			});
		});
	}

	private destroyDebree() {
		if (this.destroyed) {
			return;
		}

		this.destroyed = true;
		this.lifeTimer?.remove(false);
		this.blinkTween?.remove();
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
