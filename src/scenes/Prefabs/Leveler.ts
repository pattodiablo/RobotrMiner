
// You can write more code here

/* START OF COMPILED CODE */

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
	b2DefaultFilter,
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
	b2Shape_SetFilter,

	b2Vec2,
	pxm,
	pxmVec2,
	} from "../../box2d.js";
/* END-USER-IMPORTS */

export default class Leveler extends Phaser.GameObjects.Image {

	constructor(scene: Phaser.Scene, x?: number, y?: number, texture?: string, frame?: number | string) {
		super(scene, x ?? 0, y ?? 0, texture || "leveler", frame);

		this.flipX = true;

		// body_3
		const body_3 = b2CreateBody((this.scene as any).worldId, { 
			...b2DefaultBodyDef(), 
			type: b2BodyType.b2_dynamicBody, 
			position: pxmVec2(this.x, -this.y), 
			gravityScale: 0
		});

		// add body_3 to this
		AddSpriteToWorld((this.scene as any).worldId, this, { bodyId: body_3 });
		b2Body_SetType(body_3, b2BodyType.b2_kinematicBody);

		// shape_4
		const shape_4 = b2CreatePolygonShape(body_3, { 
			...b2DefaultShapeDef()
		}, b2MakeBox(pxm(114.5), pxm(38)));
		this.bodyId = body_3;
		this.shapeId = shape_4;
		this.startX = b2Body_GetPosition(body_3).x;
		this.startY = b2Body_GetPosition(body_3).y;

		this.scene.events.on("update", this.handleSceneUpdate, this);
		this.once(Phaser.GameObjects.Events.DESTROY, this.handleDestroy, this);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	// Write your code here.
	private bodyId!: any;
	private shapeId!: any;
	private readonly travelSpeed = pxm(70);
	private readonly snapThreshold = pxm(0.58);
	private readonly targetY = 10;
	private readonly targetX = 0;
	private startX!: number;
	private startY!: number;
	private movementPhase = 0;
	private carriedGem: any = null;

	private handleSceneUpdate() {
		if (!this.bodyId) {
			return;
		}

		const position = b2Body_GetPosition(this.bodyId);
		if (this.movementPhase === 0) {
			const deltaY = this.targetY - position.y;

			if (Math.abs(deltaY) <= this.snapThreshold) {
				this.setBodyPosition(position.x, this.targetY);
				this.setBodyVelocity(0, 0);
				this.movementPhase = 1;
				b2Body_SetAngularVelocity(this.bodyId, 0);
				return;
			}

			this.setBodyVelocity(0, Math.sign(deltaY) * this.travelSpeed);
			b2Body_SetAngularVelocity(this.bodyId, 0);
			return;
		}

		if (this.movementPhase === 1) {
			const deltaX = this.targetX - position.x;

			if (Math.abs(deltaX) <= this.snapThreshold) {
				this.setBodyPosition(this.targetX, position.y);
				this.setBodyVelocity(0, 0);
				this.movementPhase = 2;
				b2Body_SetAngularVelocity(this.bodyId, 0);
				return;
			}

			this.setBodyVelocity(Math.sign(deltaX) * this.travelSpeed, 0);
			b2Body_SetAngularVelocity(this.bodyId, 0);
			return;
		}

		if (this.movementPhase === 2) {
			const deltaY = this.startY - position.y;

			if (Math.abs(deltaY) <= this.snapThreshold) {
				this.setBodyPosition(this.targetX, this.startY);
				this.setBodyVelocity(0, 0);
				this.movementPhase = 3;
				b2Body_SetAngularVelocity(this.bodyId, 0);
				return;
			}

			this.setBodyVelocity(0, Math.sign(deltaY) * this.travelSpeed);
			b2Body_SetAngularVelocity(this.bodyId, 0);
			return;
		}

		const deltaX = this.startX - position.x;

		if (Math.abs(deltaX) <= this.snapThreshold) {
			this.setBodyPosition(this.startX, this.startY);
			this.setBodyVelocity(0, 0);
			this.movementPhase = 0;
			b2Body_SetAngularVelocity(this.bodyId, 0);
			return;
		}

		this.setBodyVelocity(Math.sign(deltaX) * this.travelSpeed, 0);
		b2Body_SetAngularVelocity(this.bodyId, 0);
	}

	private setBodyPosition(x: number, y: number) {
		b2Body_SetTransform(this.bodyId, new b2Vec2(x, y), b2MakeRot(0));
	}

	getShapeId() {
		return this.shapeId;
	}

	canCarryGem() {
		return this.carriedGem === null;
	}

	tryCarryGem(gem: any) {
		if (!this.canCarryGem()) {
			return false;
		}

		if (!gem?.beginLevelerCarry?.(this.bodyId)) {
			return false;
		}

		this.carriedGem = gem;
		return true;
	}

	private setBodyVelocity(x: number, y: number) {
		b2Body_SetLinearVelocity(this.bodyId, new b2Vec2(x, y));
	}

	private handleDestroy() {
		this.scene.events.off("update", this.handleSceneUpdate, this);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
