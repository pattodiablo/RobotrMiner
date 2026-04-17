
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import type { b2WorldId } from "../../box2d.js";
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
	b2Shape_EnableContactEvents,
	b2Shape_SetCircle,
	b2Vec2,
	pxm,
	pxmVec2,
	} from "../../box2d.js";

/* END-USER-IMPORTS */

export default class Coin extends Phaser.GameObjects.Image {
	private bodyId!: any;
	private destroyed = false;
	private fadeTimer?: Phaser.Time.TimerEvent;
	private blinkTween?: Phaser.Tweens.Tween;

	constructor(scene: Phaser.Scene, x?: number, y?: number, texture?: string, frame?: number | string) {
		super(scene, x ?? 0, y ?? 0, texture || "coin", frame);

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
		b2Body_SetLinearVelocity(this.bodyId, new b2Vec2((Math.random() * 2 - 1) * 2, 1 + Math.random() * 2));
		b2Body_SetAngularVelocity(this.bodyId, (Math.random() * 2 - 1) * 6);
		this.setScale(0.85);
		this.setDepth(1000);

		// shape
		const shape = b2CreateCircleShape(body, { 
			...b2DefaultShapeDef()
		}, new b2Circle(new b2Vec2(pxm(0), pxm(0)), pxm(17.5)));

		/* START-USER-CTR-CODE */
		// Write your code here.
		this.startRewardLifecycle();
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	// Write your code here.
	private startRewardLifecycle() {
		const blinkDelay = 900 + Math.random() * 700;
		this.fadeTimer = this.scene.time.delayedCall(blinkDelay, () => {
			if (this.destroyed) {
				return;
			}

			this.blinkTween = this.scene.tweens.add({
				targets: this,
				alpha: { from: 1, to: 0.15 },
				duration: 80,
				yoyo: true,
				repeat: 5,
				onComplete: () => this.destroyCoin(),
			});
		});
	}

	private destroyCoin() {
		if (this.destroyed) {
			return;
		}

		this.destroyed = true;
		this.fadeTimer?.remove(false);
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
