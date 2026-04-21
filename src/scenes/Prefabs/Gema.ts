// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import type { b2WorldId } from "../../box2d.js";
import {
	AddSpriteToWorld,
	RemoveSpriteFromWorld,
	CreateWorld,
	DYNAMIC,
	b2BodyType,
	SetWorldScale,
	UpdateWorldSprites,
	WorldStep,
	b2CreateBody,
	b2DestroyBody,
	b2DefaultFilter,
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
	b2Body_SetAwake,
	b2Body_SetLinearVelocity,
	b2Body_SetAngularVelocity,
	b2Body_SetType,
	b2Shape_SetFilter,
	b2Shape_EnableContactEvents,

	b2Vec2,
	pxm,
	pxmVec2,
	} from "../../box2d.js";

const BIRTH_TEXTURE_KEYS = [
	"gem1",
	"gem2",
	"gem3",
	"gem4",
	"gem5",
	"gem6",
	"gem7",
	"gem8",
	"gem9",
	"gem10",
	"gem11",
	"gem12",
	"gem13",
	"gem14",
] as const;

/* END-USER-IMPORTS */

export default class Gema extends Phaser.GameObjects.Image {

	constructor(scene: Phaser.Scene, x?: number, y?: number, texture?: string, frame?: number | string) {
		super(scene, x ?? 0, y ?? 0, "gem1", frame);

		const body = b2CreateBody((this.scene as any).worldId, {
			...b2DefaultBodyDef(),
			type: b2BodyType.b2_dynamicBody,
			position: pxmVec2(this.x, -this.y),
			gravityScale: 10
		});

		AddSpriteToWorld((this.scene as any).worldId, this, { bodyId: body });
		this.bodyId = body;

		const shape = b2CreatePolygonShape(body, {
			...b2DefaultShapeDef()
		}, b2MakeOffsetPolygon(b2ComputeHull(this.createCollisionPoints(), 4), pxm(0), new b2Transform(new b2Vec2(pxm(0), pxm(0)), b2MakeRot(0))));
		this.shapeId = shape;
		b2Shape_EnableContactEvents(this.shapeId, true);

		/* START-USER-CTR-CODE */
		this.setInteractive({ useHandCursor: true });
		this.on("pointerdown", () => {
			this.scene.events.emit("gema-drag-start", this);
		});
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	private bodyId!: any;
	private shapeId!: any;
	private readonly dynamicBodyType = b2BodyType.b2_dynamicBody;
	private birthTextureKey = "gem1";
	private birthType = 1;
	private held = false;
	private heldRobotBodyId: any = null;
	private reservedByRobotBodyId: any = null;
	private destroyed = false;
	private merging = false;
	private mergeTween?: Phaser.Tweens.Tween;
	private mouseCarried = false;
	private collisionsDisabled = false;
	private secondLevelMinY = Number.POSITIVE_INFINITY;

	setSecondLevelMinY(minY: number) {
		this.secondLevelMinY = minY;
	}

	isInSecondLevel() {
		return this.y >= this.secondLevelMinY;
	}

	getBirthType() {
		return this.birthType;
	}

	getBirthTextureKey() {
		return this.birthTextureKey;
	}

	getShapeId() {
		return this.shapeId;
	}

	getNextBirthTextureKey() {
		const currentIndex = BIRTH_TEXTURE_KEYS.indexOf(this.getBirthTextureKey() as typeof BIRTH_TEXTURE_KEYS[number]);
		if (currentIndex < 0 || currentIndex >= BIRTH_TEXTURE_KEYS.length - 1) {
			return null;
		}

		return BIRTH_TEXTURE_KEYS[currentIndex + 1];
	}

	getRewardValue() {
		return 10 * Math.pow(2, this.birthType - 1);
	}

	configureBirthTexture(textureKey: string = this.texture.key) {
		this.birthTextureKey = textureKey;
		const birthIndex = BIRTH_TEXTURE_KEYS.indexOf(textureKey as typeof BIRTH_TEXTURE_KEYS[number]);
		this.birthType = birthIndex >= 0 ? birthIndex + 1 : 1;
		this.setTexture(textureKey);
	}

	canMerge() {
		return !this.destroyed && !this.merging && !this.mouseCarried;
	}

	canBeTargetedByRobot(robotBodyId: any) {
		if (this.destroyed || this.merging || this.mouseCarried || this.held) {
			return false;
		}

		if (this.isInsideDropPlace()) {
			return false;
		}

		if (!this.isInSecondLevel()) {
			return false;
		}

		return !this.reservedByRobotBodyId || this.reservedByRobotBodyId === robotBodyId;
	}

	reserveForRobot(robotBodyId: any) {
		if (this.destroyed || this.merging || this.mouseCarried || this.held) {
			return false;
		}

		if (this.reservedByRobotBodyId && this.reservedByRobotBodyId !== robotBodyId) {
			return false;
		}

		this.reservedByRobotBodyId = robotBodyId;
		this.freezeForReservation();
		return true;
	}

	releaseRobotReservation(robotBodyId?: any) {
		if (robotBodyId && this.reservedByRobotBodyId && this.reservedByRobotBodyId !== robotBodyId) {
			return;
		}

		this.reservedByRobotBodyId = null;
		this.restoreDynamicsAfterReservation();
	}

	private freezeForReservation() {
		if (!this.bodyId) {
			return;
		}

		b2Body_SetLinearVelocity(this.bodyId, new b2Vec2(0, 0));
		b2Body_SetAngularVelocity(this.bodyId, 0);
		b2Body_SetType(this.bodyId, b2BodyType.b2_kinematicBody);
		b2Body_SetAwake(this.bodyId, true);
	}

	private restoreDynamicsAfterReservation() {
		if (!this.bodyId || this.destroyed || this.mouseCarried || this.held) {
			return;
		}

		b2Body_SetType(this.bodyId, this.dynamicBodyType);
		b2Body_SetAwake(this.bodyId, true);
	}

	private setCollisionsEnabled(enabled: boolean) {
		if (!this.shapeId) {
			return;
		}

		if (!enabled) {
			if (this.collisionsDisabled) {
				return;
			}

			const disabledFilter = b2DefaultFilter();
			disabledFilter.maskBits = 0;
			b2Shape_SetFilter(this.shapeId, disabledFilter);
			this.collisionsDisabled = true;
			return;
		}

		if (!this.collisionsDisabled) {
			return;
		}

		b2Shape_SetFilter(this.shapeId, b2DefaultFilter());
		this.collisionsDisabled = false;
	}

	beginMergeAttraction(targetX: number, targetY: number, durationMs = 220) {
		if (this.destroyed || this.merging) {
			return;
		}

		this.merging = true;
		this.disableInteractive();
		this.setDepth(1200);
		this.setCollisionsEnabled(false);
		b2Body_SetType(this.bodyId, b2BodyType.b2_kinematicBody);
		b2Body_SetLinearVelocity(this.bodyId, new b2Vec2(0, 0));
		b2Body_SetAngularVelocity(this.bodyId, 0);
		const startX = this.x;
		const startY = this.y;
		const startScaleX = this.scaleX;
		const startScaleY = this.scaleY;

		this.scene.tweens.killTweensOf(this);
		this.mergeTween = this.scene.tweens.addCounter({
			from: 0,
			to: 1,
			duration: durationMs,
			ease: "Cubic.easeInOut",
			onUpdate: (tween) => {
				const progress = Number(tween.getValue() ?? 0);
				const easedProgress = progress * progress * (3 - 2 * progress);
				const nextX = Phaser.Math.Linear(startX, targetX, easedProgress);
				const nextY = Phaser.Math.Linear(startY, targetY, easedProgress);
				const pulseScale = 1 + Math.sin(progress * Math.PI) * 0.12;
				this.setPosition(nextX, nextY);
				this.setScale(startScaleX * pulseScale, startScaleY * pulseScale);
				b2Body_SetTransform(this.bodyId, new b2Vec2(pxm(nextX), -pxm(nextY)), b2MakeRot(0));
				b2Body_SetAwake(this.bodyId, true);
			},
			onComplete: () => {
				this.mergeTween = undefined;
			},
		});
	}

	beginMouseCarry() {
		if (this.destroyed) {
			return;
		}

		if (this.heldRobotBodyId) {
			(this.scene as any).events.emit("robot-gem-stolen", this.heldRobotBodyId, this);
		}

		this.releaseRobotReservation();
		this.mouseCarried = true;
		this.held = false;
		this.heldRobotBodyId = null;
		this.merging = false;
		this.setAlpha(1);
		this.setScale(1);
		this.setDepth(1000);
		this.setCollisionsEnabled(false);
		b2Body_SetType(this.bodyId, this.dynamicBodyType);
		b2Body_SetAwake(this.bodyId, true);
		b2Body_SetLinearVelocity(this.bodyId, new b2Vec2(0, 0));
		b2Body_SetAngularVelocity(this.bodyId, 0);
	}

	updateMouseCarry(x: number, y: number) {
		if (this.destroyed || !this.mouseCarried || !this.bodyId) {
			return;
		}

		b2Body_SetTransform(this.bodyId, new b2Vec2(pxm(x), -pxm(y)), b2MakeRot(0));
		b2Body_SetAwake(this.bodyId, true);
	}

	endMouseCarry() {
		if (this.destroyed) {
			return;
		}

		this.mouseCarried = false;
		this.setCollisionsEnabled(true);
		b2Body_SetAwake(this.bodyId, true);
		b2Body_SetLinearVelocity(this.bodyId, new b2Vec2(0, 0));
	}

	beginHold(robotBodyId: any) {
		if (this.destroyed) {
			return;
		}

		this.held = true;
		this.heldRobotBodyId = robotBodyId;
		this.reservedByRobotBodyId = null;
		this.setCollisionsEnabled(false);
		b2Body_SetType(this.bodyId, this.dynamicBodyType);
		b2Body_SetLinearVelocity(this.bodyId, new b2Vec2(0, 0));
		b2Body_SetAngularVelocity(this.bodyId, 0);
	}

	releaseFromRobotHold(x: number, y: number) {
		if (this.destroyed) {
			return;
		}

		this.held = false;
		this.heldRobotBodyId = null;
		this.releaseRobotReservation();
		this.setCollisionsEnabled(true);
		b2Body_SetType(this.bodyId, this.dynamicBodyType);
		b2Body_SetTransform(this.bodyId, new b2Vec2(x, y), b2MakeRot(0));
		b2Body_SetLinearVelocity(this.bodyId, new b2Vec2(0, 0));
		b2Body_SetAngularVelocity(this.bodyId, 0);
		b2Body_SetAwake(this.bodyId, true);
	}

	private isInsideDropPlace() {
		const dropPlace = (this.scene as any).dropPlace as Phaser.GameObjects.Rectangle | undefined;
		if (!dropPlace) {
			return false;
		}

		const bounds = dropPlace.getBounds();
		return this.x >= bounds.left && this.x <= bounds.right && this.y >= bounds.top && this.y <= bounds.bottom;
	}

	updateHold() {
		if (this.destroyed || !this.heldRobotBodyId || !this.bodyId) {
			return;
		}

		const robotPosition = b2Body_GetPosition(this.heldRobotBodyId);
		b2Body_SetTransform(this.bodyId, new b2Vec2(robotPosition.x, robotPosition.y - pxm(120)), b2MakeRot(0));
	}

	destroyGem() {
		if (this.destroyed) {
			return;
		}

		if (this.held) {
			(this.scene as any).spawnRewardCoins?.(this.x, this.y, this.getRewardValue());
		}

		this.destroyed = true;
		this.mergeTween?.remove();
		this.mergeTween = undefined;
		this.releaseRobotReservation();
		this.held = false;
		this.heldRobotBodyId = null;
		this.mouseCarried = false;
		this.collisionsDisabled = false;
		(this.scene as any).unregisterGem?.(this);
		RemoveSpriteFromWorld((this.scene as any).worldId, this, false);
		if (this.bodyId) {
			b2DestroyBody(this.bodyId);
			this.bodyId = null;
		}
		this.mouseCarried = false;
		super.destroy();
	}

	private createCollisionPoints() {
		return [
			new b2Vec2(pxm(-43), pxm(-41)),
			new b2Vec2(pxm(43), pxm(-41)),
			new b2Vec2(pxm(43), pxm(41)),
			new b2Vec2(pxm(-43), pxm(41))
		];
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
