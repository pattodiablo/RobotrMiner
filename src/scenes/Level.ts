
// You can write more code here

/* START OF COMPILED CODE */

import Coin from "./Prefabs/Coin";
import Robot from "./Prefabs/Robot";
import GemLevelBar from "./Prefabs/GemLevelBar";
import Leveler from "./Prefabs/Leveler";
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
	b2Body_SetTransform,
	b2Body_SetType,
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
	b2Body_GetShapes,
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

type b2BodyId = {
	index1: number;
	revision: number;
};

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
		const background = this.add.image(-224, -1120, "background");
		background.scaleX = 1.4447549335068692;
		background.scaleY = 1.3284569248044262;
		background.setOrigin(0, 0);

		// pared1
		const pared1 = b2CreateBody(this.worldId, { 
			...b2DefaultBodyDef(), 
			position: pxmVec2(-100, -604)
		});

		// shape
		const shape = b2CreatePolygonShape(pared1, { 
			...b2DefaultShapeDef(), 
			restitution: 0.5
		}, b2MakeBox(pxm(100), pxm(600)));

		// pared
		const pared = b2CreateBody(this.worldId, { 
			...b2DefaultBodyDef(), 
			position: pxmVec2(1139, -604)
		});

		// shape_2
		const shape_2 = b2CreatePolygonShape(pared, { 
			...b2DefaultShapeDef(), 
			restitution: 0.5
		}, b2MakeBox(pxm(100), pxm(600)));

		// coin
		const coin = new Coin(this, -252, 129);
		this.add.existing(coin);

		// levelBase
		const levelBase = this.add.image(515, 499, "levelBase");

		// body_1
		const body_1 = b2CreateBody(this.worldId, { 
			...b2DefaultBodyDef(), 
			position: pxmVec2(515, -499)
		});

		// add body_1 to levelBase
		AddSpriteToWorld(this.worldId, levelBase, { bodyId: body_1 });

		// shape_1
		const shape_1 = b2CreatePolygonShape(body_1, { 
			...b2DefaultShapeDef()
		}, b2MakeBox(pxm(570.5), pxm(60)));

		// levelBase2
		const levelBase2 = this.add.image(515, 1132, "levelBase");

		// body_2
		const body_2 = b2CreateBody(this.worldId, { 
			...b2DefaultBodyDef(), 
			position: pxmVec2(515, -1132)
		});

		// add body_2 to levelBase2
		AddSpriteToWorld(this.worldId, levelBase2, { bodyId: body_2 });

		// shape_3
		const shape_3 = b2CreatePolygonShape(body_2, { 
			...b2DefaultShapeDef()
		}, b2MakeBox(pxm(570.5), pxm(60)));

		// processBtn
		const processBtn = this.add.image(515, 494, "ProcessBtn");

		// returnBtn
		const returnBtn = this.add.image(528, 1136, "ReturnBtn");

		// robot
		const robot = new Robot(this, this.spine, 160, 192);
		this.add.existing(robot);
		robot.scaleX = 0.6136006445175658;
		robot.scaleY = 0.6136006445175658;

		// levelBar
		const levelBar = new GemLevelBar(this, 16, 16);
		this.add.existing(levelBar);

		// powerMachine
		const powerMachine = this.add.image(496, -416, "PowerMachine");
		powerMachine.scaleX = 0.7614161849074168;
		powerMachine.scaleY = 0.7614161849074168;

		// levelBase3
		const levelBase3 = this.add.image(512, -208, "levelBase");

		// leveler
		const leveler = new Leveler(this, 864, 784);
		this.add.existing(leveler);

		// checkBtn
		const checkBtn = this.add.image(112, 496, "CheckBtn");

		// returnBtn2
		const returnBtn2 = this.add.image(528, -208, "ReturnBtn");

		this.body_1 = body_1;
		this.levelBase = levelBase;
		this.body_2 = body_2;
		this.levelBase2 = levelBase2;
		this.processBtn = processBtn;
		this.returnBtn = returnBtn;
		this.levelBar = levelBar;
		this.levelBase3 = levelBase3;
		this.checkBtn = checkBtn;
		this.returnBtn2 = returnBtn2;

		this.events.emit("scene-awake");
	}

	updateWorld(time: number, delta: number) {

		WorldStep({ worldId: this.worldId, deltaTime: delta });
		UpdateWorldSprites(this.worldId);
	}

	private body_1!: b2BodyId;
	private levelBase!: Phaser.GameObjects.Image;
	private body_2!: b2BodyId;
	private levelBase2!: Phaser.GameObjects.Image;
	private processBtn!: Phaser.GameObjects.Image;
	private returnBtn!: Phaser.GameObjects.Image;
	private levelBar!: GemLevelBar;
	private levelBase3!: Phaser.GameObjects.Image;
	private checkBtn!: Phaser.GameObjects.Image;
	private returnBtn2!: Phaser.GameObjects.Image;
	public worldId!: b2WorldId;

	/* START-USER-CODE */

	// Write your code here

	private gems: Gema[] = [];
	private carriedGem: Gema | null = null;
	private rockSpawnCount = 0;
	private moneyValue = 0;
	private moneyDisplayValue = 0;
	private moneyText!: Phaser.GameObjects.Text;
	private moneyTween?: Phaser.Tweens.Tween;

	private readonly rockSpawnMinDelay = 2600;
	private readonly rockSpawnMaxDelay = 7500;
	private readonly rockSpawnRampSpawns = 18;
	private readonly rockSpawnVariance = 0.32;
	private readonly maxVisibleRocks = 20;
	private readonly levelerSpawnX = 960;
	private readonly levelerSpawnY = 1312;
	private readonly levelerSpawnInterval = 10000;
	private readonly maxLevelerInstances = 6;
	private debugCanvas: HTMLCanvasElement | null = null;
	private debugContext: CanvasRenderingContext2D | null = null;
	private debugDraw: any = null;
	private bloomEffect?: Phaser.Types.Actions.AddEffectBloomReturn;
	private debugEnabled = false;
	private debugToggleKey!: Phaser.Input.Keyboard.Key;
	private levelOpened = false;
	private levelOpenTween?: Phaser.Tweens.Tween;
	private checkCameraTween?: Phaser.Tweens.Tween;
	private levelerSpawnTimer?: Phaser.Time.TimerEvent;
	private levelerInstanceCount = 1;
	private levelAutoCloseTimer?: Phaser.Time.TimerEvent;
	private initialCameraScrollY = 0;
	private secondLevelGemMinY = 0;
	private levelBaseBodyId!: any;
	private maxGemLevelReached = 0;
	private levelBase2BodyId!: any;
	private readonly levelOpenShiftX = 240;
	private readonly levelOpenCameraOffset = 650;
	private readonly checkCameraOffset = 650;
	private readonly levelOpenDuration = 1500;
	private readonly levelHoldDuration = 2200;
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
		this.initialCameraScrollY = this.cameras.main.scrollY;
		this.secondLevelGemMinY = this.levelBase2.y - 240;
		this.setupBloomEffect();
		this.setupProcessButton();
		this.setupReturnButton();
		this.setupCheckButton();
		this.setupReturnButton2();
		this.scheduleLevelerSpawns();
		this.setupBox2DDebug();
		this.createMoneyHud();
		this.events.on("gema-drag-start", this.beginGemCarry, this);
		this.input.on("pointermove", this.handlePointerMove, this);
		this.input.on("pointerup", this.handlePointerUp, this);
		this.scheduleNextRockSpawn();
		this.debugToggleKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.F3);

		this.levelBaseBodyId = this.body_1;
		this.levelBase2BodyId = this.body_2; 


	}

	update(_time: number, delta: number) {
		if (Phaser.Input.Keyboard.JustDown(this.debugToggleKey)) {
			this.setBox2DDebugEnabled(!this.debugEnabled);
		}

		this.updateCarriedGem();
		WorldStep({ worldId: this.worldId, deltaTime: delta / 1000 });
		this.handleSecondLevelRocks();
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

	private setupBloomEffect() {
		this.bloomEffect?.parallelFilters.destroy();
		const bloomEffects = Phaser.Actions.AddEffectBloom(this.cameras.main, {
			threshold: 0.2,
			blurRadius: 0.1,
			blurSteps: 1,
			blurQuality: 2,
			blendAmount: 0.85,
			blendMode: Phaser.BlendModes.SCREEN,
		});
		this.bloomEffect = bloomEffects[0];
	}

	private handleSecondLevelRocks() {
		for (const child of this.children.list) {
			if (!(child instanceof Roca)) {
				continue;
			}

			child.breakIfInSecondLevel(this.secondLevelGemMinY);
		}
	}

	private spawnRock(x: number, y: number) {
		if (this.countVisibleRocks() >= this.maxVisibleRocks) {
			return null;
		}

		const rock = new Roca(this, x, y);
		this.add.existing(rock);
		return rock;
	}

	private countVisibleRocks() {
		const camera = this.cameras.main as any;
		const view = camera.worldView ?? {
			x: camera.scrollX,
			y: camera.scrollY,
			width: this.scale.width,
			height: this.scale.height,
		};
		const left = view.x;
		const top = view.y;
		const right = view.x + view.width;
		const bottom = view.y + view.height;

		let visibleRockCount = 0;
		for (const object of this.children.list) {
			if (!(object instanceof Roca)) {
				continue;
			}

			if ((object as any).isRockDestroyed?.()) {
				continue;
			}

			const halfWidth = object.displayWidth / 2;
			const halfHeight = object.displayHeight / 2;
			const rockLeft = object.x - halfWidth;
			const rockRight = object.x + halfWidth;
			const rockTop = object.y - halfHeight;
			const rockBottom = object.y + halfHeight;

			if (rockRight < left || rockLeft > right || rockBottom < top || rockTop > bottom) {
				continue;
			}

			visibleRockCount += 1;
		}

		return visibleRockCount;
	}

	private scheduleLevelerSpawns() {
		this.levelerSpawnTimer?.remove(false);
		this.levelerSpawnTimer = this.time.addEvent({
			delay: this.levelerSpawnInterval,
			loop: true,
			callback: () => {
				if (this.levelerInstanceCount >= this.maxLevelerInstances) {
					this.levelerSpawnTimer?.remove(false);
					this.levelerSpawnTimer = undefined;
					return;
				}

				const leveler = new Leveler(this, this.levelerSpawnX, this.levelerSpawnY);
				this.add.existing(leveler);
				this.levelerInstanceCount += 1;
			},
		});
	}

	public registerGem(gem: Gema) {
		if (!this.gems.includes(gem)) {
			gem.setSecondLevelMinY(this.secondLevelGemMinY);
			this.gems.push(gem);
		}
		this.updateGemLevelBar(gem.getBirthType());
	}

	private updateGemLevelBar(level: number) {
		this.maxGemLevelReached = Math.max(this.maxGemLevelReached, level);
		this.levelBar.setMaxGemLevel(this.maxGemLevelReached);
	}

	public unregisterGem(gem: Gema) {
		this.gems = this.gems.filter((currentGem) => currentGem !== gem);
		if (this.carriedGem === gem) {
			this.carriedGem = null;
		}
	}

	public isGemBeingCarried() {
		return this.carriedGem !== null;
	}

	public spawnRewardCoins(x: number, y: number, gemValue: number) {
		const coinCount = Math.max(1, Math.min(8, Math.floor(Math.log2(Math.max(1, gemValue / 10))) + 1));
		const horizontalSpread = 28;
		const verticalStart = 120;

		for (let index = 0; index < coinCount; index += 1) {
			const offsetX = (Math.random() * 2 - 1) * horizontalSpread;
			const offsetY = Math.random() * 40;
			const coin = new Coin(this, x + offsetX, -(verticalStart + offsetY), "coin", undefined, this.splitGemValue(gemValue, coinCount, index));
			this.add.existing(coin);
		}
	}

	private splitGemValue(totalValue: number, coinCount: number, index: number) {
		const baseValue = Math.floor(totalValue / coinCount);
		const remainder = totalValue % coinCount;
		return baseValue + (index < remainder ? 1 : 0);
	}

	private createMoneyHud() {
		this.moneyText = this.add.text(this.scale.width - 28, 24, this.formatMoneyValue(this.moneyDisplayValue), {
			fontFamily: "Courier New, monospace",
			fontSize: "28px",
			color: "#f8d66d",
			stroke: "#1a1205",
			strokeThickness: 6,
			align: "right",
		});
		this.moneyText.setOrigin(1, 0);
		this.moneyText.setScrollFactor(0);
		this.moneyText.setDepth(2000);
	}

	public collectCoinReward(amount: number) {
		if (amount <= 0) {
			return;
		}

		this.moneyValue += amount;
		this.animateMoneyHud();
	}

	private animateMoneyHud() {
		this.moneyTween?.stop();
		const startValue = this.moneyDisplayValue;
		const targetValue = this.moneyValue;
		this.levelBar.setMaxGemLevel(this.maxGemLevelReached);
		const tweenState = { value: startValue };

		this.moneyTween = this.tweens.addCounter({
			from: startValue,
			to: targetValue,
			duration: 260,
			ease: "Cubic.easeOut",
			onUpdate: (tween) => {
				const nextValue = Math.round(Number(tween.getValue() ?? 0));
				this.moneyDisplayValue = nextValue;
				this.moneyText.setText(this.formatMoneyValue(nextValue));
				this.moneyText.setScale(1.02);
			},
			onComplete: () => {
				this.moneyDisplayValue = targetValue;
				this.moneyText.setText(this.formatMoneyValue(targetValue));
				this.moneyText.setScale(1);
			},
		});

		this.tweens.add({
			targets: this.moneyText,
			scaleX: { from: 1, to: 1.07 },
			scaleY: { from: 1, to: 1.07 },
			duration: 90,
			yoyo: true,
			ease: "Sine.easeOut",
		});
	}

	private setupProcessButton() {
		this.processBtn.setScrollFactor(1);
		this.processBtn.setInteractive({ useHandCursor: true });
		this.processBtn.setDepth(1500);
		this.processBtn.on("pointerdown", this.openLevelAccess, this);
	}

	private setupReturnButton() {
		this.returnBtn.setScrollFactor(1);
		this.returnBtn.setInteractive({ useHandCursor: true });
		this.returnBtn.setDepth(1500);
		this.returnBtn.disableInteractive();
		this.returnBtn.on("pointerdown", this.returnToInitialScene, this);
	}

	private setupCheckButton() {
		this.checkBtn.setScrollFactor(1);
		this.checkBtn.setInteractive({ useHandCursor: true });
		this.checkBtn.setDepth(1500);
		this.checkBtn.on("pointerdown", this.moveCameraUp, this);
	}

	private setupReturnButton2() {
		this.returnBtn2.setScrollFactor(1);
		this.returnBtn2.setInteractive({ useHandCursor: true });
		this.returnBtn2.setDepth(1500);
		this.returnBtn2.on("pointerdown", this.moveCameraDown, this);
	}

	private getLevelBaseBodyId() {
		return this.levelBaseBodyId ?? (this.levelBase as any).bodyId;
	}

	private getLevelBase2BodyId() {
		return this.levelBase2BodyId ?? (this.levelBase2 as any).bodyId;
	}

	private getLevelBase2ShapeId() {
		const bodyId = this.getLevelBase2BodyId();
		if (!bodyId) {
			return null;
		}

		const shapeIds: any[] = [];
		const shapeCount = b2Body_GetShapes(bodyId, shapeIds);
		return shapeCount > 0 ? shapeIds[0] : null;
	}

	private animateLevelBase(targetX: number, targetScrollY: number, onComplete: () => void) {
		this.levelOpenTween?.stop();

		const levelBaseBodyId = this.getLevelBaseBodyId();
		const levelBase2BodyId = this.getLevelBase2BodyId();
		if (!levelBaseBodyId || !levelBase2BodyId) {
			this.processBtn.setInteractive({ useHandCursor: true });
			return;
		}

		const startX = this.levelBase.x;
		const startScrollY = this.cameras.main.scrollY;

		b2Body_SetType(levelBaseBodyId, b2BodyType.b2_kinematicBody);
		b2Body_SetType(levelBase2BodyId, b2BodyType.b2_staticBody);

		this.levelOpenTween = this.tweens.addCounter({
			from: 0,
			to: 1,
			duration: this.levelOpenDuration,
			ease: "Cubic.easeInOut",
			onUpdate: (tween) => {
				const progress = Number(tween.getValue() ?? 0);
				const nextX = Phaser.Math.Linear(startX, targetX, progress);
				const nextScrollY = Phaser.Math.Linear(startScrollY, targetScrollY, progress);

				this.levelBase.x = nextX;
				b2Body_SetTransform(levelBaseBodyId, pxmVec2(nextX, -this.levelBase.y), b2MakeRot(0));
				this.cameras.main.scrollY = nextScrollY;
			},
			onComplete: () => {
				this.levelBase.x = targetX;
				b2Body_SetTransform(levelBaseBodyId, pxmVec2(targetX, -this.levelBase.y), b2MakeRot(0));
				this.cameras.main.scrollY = targetScrollY;
				this.levelOpenTween = undefined;
				onComplete();
			},
		});

		return;
	}

	private moveCameraUp() {
		this.checkCameraTween?.stop();

		const startScrollY = this.cameras.main.scrollY;
		const targetScrollY = startScrollY - this.checkCameraOffset;

		this.checkCameraTween = this.tweens.addCounter({
			from: 0,
			to: 1,
			duration: 900,
			ease: "Cubic.easeInOut",
			onUpdate: (tween) => {
				const progress = Number(tween.getValue() ?? 0);
				this.cameras.main.scrollY = Phaser.Math.Linear(startScrollY, targetScrollY, progress);
			},
			onComplete: () => {
				this.cameras.main.scrollY = targetScrollY;
				this.checkCameraTween = undefined;
			},
		});
	}

	private moveCameraDown() {
		this.checkCameraTween?.stop();

		const startScrollY = this.cameras.main.scrollY;
		const targetScrollY = startScrollY + this.checkCameraOffset;

		this.checkCameraTween = this.tweens.addCounter({
			from: 0,
			to: 1,
			duration: 900,
			ease: "Cubic.easeInOut",
			onUpdate: (tween) => {
				const progress = Number(tween.getValue() ?? 0);
				this.cameras.main.scrollY = Phaser.Math.Linear(startScrollY, targetScrollY, progress);
			},
			onComplete: () => {
				this.cameras.main.scrollY = targetScrollY;
				this.checkCameraTween = undefined;
			},
		});
	}

	private openLevelAccess() {

		if (this.levelOpened) {
			return;
		}

		this.levelOpened = true;
		this.processBtn.disableInteractive();
		this.returnBtn.disableInteractive();
		this.levelAutoCloseTimer?.remove(false);
		const targetX = this.levelBase.x - (this.scale.width + this.levelOpenShiftX);
		const targetScrollY = this.initialCameraScrollY + this.levelOpenCameraOffset;

		this.animateLevelBase(targetX, targetScrollY, () => {
			this.processBtn.disableInteractive();
			this.returnBtn.setInteractive({ useHandCursor: true });
			this.levelAutoCloseTimer?.remove(false);
			this.levelAutoCloseTimer = this.time.delayedCall(this.levelHoldDuration, () => {
				this.closeLevelAccess(false);
			});
		});

		if (!this.levelOpenTween) {
			this.levelOpened = false;
		}
	}

	private returnToInitialScene() {
		this.levelAutoCloseTimer?.remove(false);
		this.levelAutoCloseTimer = undefined;
		this.levelOpened = false;
		this.returnBtn.disableInteractive();
		this.processBtn.disableInteractive();
		const targetX = 515;
		const targetScrollY = this.initialCameraScrollY;

		this.animateLevelBase(targetX, targetScrollY, () => {
			this.processBtn.setInteractive({ useHandCursor: true });
			this.returnBtn.disableInteractive();
		});

		if (!this.levelOpenTween) {
			this.processBtn.setInteractive({ useHandCursor: true });
			this.returnBtn.disableInteractive();
		}
	}

	private closeLevelAccess(restoreCamera: boolean) {
		if (!this.levelOpened) {
			return;
		}

		this.levelOpened = false;
		this.levelAutoCloseTimer?.remove(false);
		this.levelAutoCloseTimer = undefined;
		this.returnBtn.disableInteractive();
		const targetX = 515;
		const targetScrollY = restoreCamera ? this.initialCameraScrollY : this.cameras.main.scrollY;

		this.processBtn.disableInteractive();
		this.animateLevelBase(targetX, targetScrollY, () => {
			this.processBtn.setInteractive({ useHandCursor: true });
			if (restoreCamera) {
				this.returnBtn.disableInteractive();
			} else {
				this.returnBtn.setInteractive({ useHandCursor: true });
			}
		});

		if (!this.levelOpenTween) {
			this.processBtn.setInteractive({ useHandCursor: true });
			if (restoreCamera) {
				this.returnBtn.disableInteractive();
			} else {
				this.returnBtn.setInteractive({ useHandCursor: true });
			}
		}
	}

	private formatMoneyValue(value: number) {
		const rawValue = Math.max(0, Math.floor(value)).toString().padStart(9, "0");
		return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}

	private beginGemCarry(gem: Gema) {
		if (this.carriedGem && this.carriedGem !== gem) {
			this.carriedGem.endMouseCarry();
		}

		this.carriedGem = gem;
		gem.beginMouseCarry();
	}

	private handlePointerMove(pointer: Phaser.Input.Pointer) {
		if (!this.carriedGem || !pointer.isDown) {
			return;
		}

		this.carriedGem.updateMouseCarry(pointer.worldX, pointer.worldY);
	}

	private handlePointerUp() {
		if (!this.carriedGem) {
			return;
		}

		this.carriedGem.endMouseCarry();
		this.carriedGem = null;
	}

	private updateCarriedGem() {
		if (!this.carriedGem) {
			return;
		}

		const pointer = this.input.activePointer;
		if (!pointer.isDown) {
			this.handlePointerUp();
			return;
		}

		this.carriedGem.updateMouseCarry(pointer.worldX, pointer.worldY);
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

			if (gemA.isInSecondLevel() || gemB.isInSecondLevel()) {
				continue;
			}

			if (!gemA.canMerge() || !gemB.canMerge()) {
				continue;
			}

			if (gemA.getBirthType() !== gemB.getBirthType()) {
				continue;
			}

			this.mergeGems(gemA, gemB);
		}
	}

	private handleRockImpacts() {
		return;
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

		gemA.beginMergeAttraction(mergedX, mergedY, 220);
		gemB.beginMergeAttraction(mergedX, mergedY, 220);

		this.time.delayedCall(220, () => {
			gemA.destroyGem();
			gemB.destroyGem();

			const mergedGem = new Gema(this, mergedX, mergedY);
			mergedGem.configureBirthTexture(textureKey);
			mergedGem.setScale(0.82);
			this.add.existing(mergedGem);
			this.registerGem(mergedGem);
			this.tweens.add({
				targets: mergedGem,
				scaleX: 1,
				scaleY: 1,
				duration: 180,
				ease: "Back.easeOut",
			});
		});
	}

	private computeNextRockSpawnDelay() {
		const progress = Math.min(1, this.rockSpawnCount / this.rockSpawnRampSpawns);
		const easedProgress = Math.sqrt(progress);
		const trendDelay = this.rockSpawnMaxDelay - (this.rockSpawnMaxDelay - this.rockSpawnMinDelay) * easedProgress;
		const jitter = (Math.random() * 2 - 1) * trendDelay * this.rockSpawnVariance;
		return Math.max(this.rockSpawnMinDelay, Math.min(this.rockSpawnMaxDelay, trendDelay + jitter));
	}

	private scheduleNextRockSpawn() {
		const delay = this.computeNextRockSpawnDelay();
		this.time.delayedCall(delay, () => {
			if (this.countVisibleRocks() >= this.maxVisibleRocks) {
				this.scheduleNextRockSpawn();
				return;
			}

			this.rockSpawnCount += 1;
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
