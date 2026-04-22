
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
	b2Body_SetAwake,
	b2Body_SetType,
	b2DefaultFilter,
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
	b2Shape_SetFilter,

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

		// paredLateral
		const paredLateral = this.add.image(803, 192, "paredLateral");

		// body_5
		const body_5 = b2CreateBody(this.worldId, { 
			...b2DefaultBodyDef(), 
			position: pxmVec2(803, -192)
		});

		// add body_5 to paredLateral
		AddSpriteToWorld(this.worldId, paredLateral, { bodyId: body_5 });

		// shape_6
		const shape_6 = b2CreatePolygonShape(body_5, { 
			...b2DefaultShapeDef()
		}, b2MakeBox(pxm(39), pxm(360)));

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

		// levelBase
		const levelBase = this.add.image(272, 435, "levelBase");

		// body_1
		const body_1 = b2CreateBody(this.worldId, { 
			...b2DefaultBodyDef(), 
			position: pxmVec2(272, -435)
		});

		// add body_1 to levelBase
		AddSpriteToWorld(this.worldId, levelBase, { bodyId: body_1 });

		// shape_1
		const shape_1 = b2CreatePolygonShape(body_1, { 
			...b2DefaultShapeDef()
		}, b2MakeBox(pxm(570.5), pxm(60)));

		// levelBase2
		const levelBase2 = this.add.image(515, 846, "levelBase");

		// body_2
		const body_2 = b2CreateBody(this.worldId, { 
			...b2DefaultBodyDef(), 
			position: pxmVec2(515, -846)
		});

		// add body_2 to levelBase2
		AddSpriteToWorld(this.worldId, levelBase2, { bodyId: body_2 });

		// shape_3
		const shape_3 = b2CreatePolygonShape(body_2, { 
			...b2DefaultShapeDef()
		}, b2MakeBox(pxm(570.5), pxm(60)));

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

		// leveler
		const leveler = new Leveler(this, 1024, 1248);
		this.add.existing(leveler);

		// levelBase3
		const levelBase3 = this.add.image(272, -192, "levelBase");

		// body_4
		const body_4 = b2CreateBody(this.worldId, { 
			...b2DefaultBodyDef(), 
			position: pxmVec2(272, 192)
		});

		// add body_4 to levelBase3
		AddSpriteToWorld(this.worldId, levelBase3, { bodyId: body_4 });

		// shape_5
		const shape_5 = b2CreatePolygonShape(body_4, { 
			...b2DefaultShapeDef()
		}, b2MakeBox(pxm(570.5), pxm(60)));

		// dropPlace
		const dropPlace = this.add.rectangle(961, 873, 128, 128);
		dropPlace.scaleX = 1.9458565461085149;
		dropPlace.scaleY = 2.9950810927399374;
		dropPlace.alpha = 0;
		dropPlace.isFilled = true;

		// generatorCore
		const generatorCore = this.add.ellipse(494, -456, 132, 132);
		generatorCore.alpha = 0;
		generatorCore.isFilled = true;

		// rockGenZone
		const rockGenZone = this.add.rectangle(388, -67, 128, 128);
		rockGenZone.scaleX = 5.26101723313505;
		rockGenZone.scaleY = -0.38227944214497694;
		rockGenZone.alpha = 0;
		rockGenZone.isFilled = true;

		// console
		const console = this.add.image(479, 467, "console");
		console.scaleX = 0.7;
		console.scaleY = 0.7;

		// coreBtn
		const coreBtn = this.add.image(87, 476, "CoreBtn");
		coreBtn.scaleX = 0.7;
		coreBtn.scaleY = 0.7;

		// clearrocksBtn
		const clearrocksBtn = this.add.image(711, 476, "ClearrocksBtn");
		clearrocksBtn.scaleX = 0.7;
		clearrocksBtn.scaleY = 0.7;

		// ovenBtn
		const ovenBtn = this.add.image(501, 476, "ovenBtn");
		ovenBtn.scaleX = 0.7;
		ovenBtn.scaleY = 0.7;

		// miningBtn
		const miningBtn = this.add.image(293, 476, "MiningBtn");
		miningBtn.scaleX = 0.7;
		miningBtn.scaleY = 0.7;

		this.body_1 = body_1;
		this.levelBase = levelBase;
		this.body_2 = body_2;
		this.levelBase2 = levelBase2;
		this.levelBar = levelBar;
		this.body_4 = body_4;
		this.levelBase3 = levelBase3;
		this.dropPlace = dropPlace;
		this.generatorCore = generatorCore;
		this.rockGenZone = rockGenZone;
		this.console = console;
		this.coreBtn = coreBtn;
		this.clearrocksBtn = clearrocksBtn;
		this.ovenBtn = ovenBtn;
		this.miningBtn = miningBtn;
		this.processBtn = ovenBtn;
		this.returnBtn = clearrocksBtn;
		this.checkBtn = coreBtn;
		this.returnBtn2 = miningBtn;

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
	private levelBar!: GemLevelBar;
	private body_4!: b2BodyId;
	private levelBase3!: Phaser.GameObjects.Image;
	private dropPlace!: Phaser.GameObjects.Rectangle;
	private generatorCore!: Phaser.GameObjects.Ellipse;
	private rockGenZone!: Phaser.GameObjects.Rectangle;
	private console!: Phaser.GameObjects.Image;
	private coreBtn!: Phaser.GameObjects.Image;
	private clearrocksBtn!: Phaser.GameObjects.Image;
	private ovenBtn!: Phaser.GameObjects.Image;
	private miningBtn!: Phaser.GameObjects.Image;
	private processBtn!: Phaser.GameObjects.Image;
	private returnBtn!: Phaser.GameObjects.Image;
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
	private reactorEnergy = 100;
	private reactorEnergyText!: Phaser.GameObjects.Text;
	private reactorEnergyBarBg!: Phaser.GameObjects.Rectangle;
	private reactorEnergyBarFill!: Phaser.GameObjects.Rectangle;
	private readonly reactorEnergyDrainPerSecond = 0.625;

	private readonly rockSpawnMinDelay = 2600;
	private readonly rockSpawnMaxDelay = 7500;
	private readonly rockSpawnRampSpawns = 18;
	private readonly rockSpawnVariance = 0.32;
	private readonly maxVisibleRocks = 20;
	private readonly levelerSpawnX = 960;
	private readonly levelerSpawnY = 1312;
	private readonly levelerSpawnInterval = 10000;
	private readonly maxLevelerInstances = 12;
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
	private generatorReviewActive = false;
	private levelBaseInitialX = 0;
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
		this.setupClearRocksButton();
		this.createMoneyHud();
		this.createReactorHud();
		this.events.on("gema-drag-start", this.beginGemCarry, this);
		this.input.on("pointermove", this.handlePointerMove, this);
		this.input.on("pointerup", this.handlePointerUp, this);
		this.scheduleNextRockSpawn();
		this.debugToggleKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.F3);
		this.levelBaseInitialX = this.levelBase.x;

		this.levelBaseBodyId = this.body_1;
		this.levelBase2BodyId = this.body_2; 


	}

	update(_time: number, delta: number) {
		if (Phaser.Input.Keyboard.JustDown(this.debugToggleKey)) {
			this.setBox2DDebugEnabled(!this.debugEnabled);
		}

		this.updateCarriedGem();
		this.updateReactorEnergy(delta);
		WorldStep({ worldId: this.worldId, deltaTime: delta / 1000 });
		this.handleSecondLevelRocks();
		this.handleGemMerges();
		this.handleGeneratorCoreGems();
		this.cleanupFallenObjects();
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

	public getMaxGemLevelReached() {
		return Math.max(1, this.maxGemLevelReached);
	}

	private resetGemUnlockProgress() {
		this.maxGemLevelReached = 0;
		this.levelBar.resetMaxGemLevel();
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

	public spawnRewardCoins(x: number, y: number, gemValue: number, burstStrength = 4) {
		const coinCount = Math.max(1, Math.min(8, Math.floor(Math.log2(Math.max(1, gemValue / 10))) + 1));
		const angleOffset = Math.random() * Math.PI * 2;

		for (let index = 0; index < coinCount; index += 1) {
			const angle = angleOffset + (index / coinCount) * Math.PI * 2;
			const spreadDistance = 10 + Math.random() * 18;
			const speed = burstStrength * (0.75 + Math.random() * 0.75);
			const coinX = x + Math.cos(angle) * spreadDistance;
			const coinY = y + Math.sin(angle) * spreadDistance;
			const velocity = {
				x: Math.cos(angle) * speed,
				y: Math.sin(angle) * speed,
			};
			const coin = new Coin(this, coinX, coinY, "coin", undefined, this.splitGemValue(gemValue, coinCount, index), velocity);
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

	private createReactorHud() {
		this.reactorEnergyText = this.add.text(16, 78, this.formatReactorEnergy(), {
			fontFamily: "Courier New, monospace",
			fontSize: "22px",
			color: "#8ef7b2",
			stroke: "#0d1d12",
			strokeThickness: 5,
			align: "left",
		});
		this.reactorEnergyText.setScrollFactor(0);
		this.reactorEnergyText.setDepth(2000);

		this.reactorEnergyBarBg = this.add.rectangle(16, 112, 220, 16, 0x1a1205, 0.9);
		this.reactorEnergyBarBg.setOrigin(0, 0.5);
		this.reactorEnergyBarBg.setScrollFactor(0);
		this.reactorEnergyBarBg.setDepth(1999);

		this.reactorEnergyBarFill = this.add.rectangle(16, 112, 220, 16, 0x59d98a, 1);
		this.reactorEnergyBarFill.setOrigin(0, 0.5);
		this.reactorEnergyBarFill.setScrollFactor(0);
		this.reactorEnergyBarFill.setDepth(2000);
		this.updateReactorHud();
	}

	public addReactorEnergy(gemValue: number) {
		const energyGain = Math.max(2, Math.round(gemValue / 5));
		this.reactorEnergy = Math.min(100, this.reactorEnergy + energyGain);
		this.updateReactorHud();
	}

	private updateReactorEnergy(delta: number) {
		this.reactorEnergy = Math.max(0, this.reactorEnergy - this.reactorEnergyDrainPerSecond * (delta / 1000));
		this.updateReactorHud();
	}

	private updateReactorHud() {
		const energyPercent = Math.round(this.reactorEnergy);
		this.reactorEnergyText.setText(this.formatReactorEnergy());
		this.reactorEnergyBarFill.setScale(energyPercent / 100, 1);
		const fillColor = energyPercent > 66 ? 0x59d98a : energyPercent > 33 ? 0xf7c548 : 0xf26d6d;
		this.reactorEnergyBarFill.setFillStyle(fillColor, 1);
	}

	private formatReactorEnergy() {
		return `REACTOR ${Math.round(this.reactorEnergy)}%`;
	}

	private setupProcessButton() {
		this.processBtn.setScrollFactor(0);
		this.processBtn.setInteractive({ useHandCursor: true });
		this.processBtn.setDepth(2000);
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
		this.checkBtn.setScrollFactor(0);
		this.checkBtn.setInteractive({ useHandCursor: true });
		this.checkBtn.setDepth(2000);
		this.checkBtn.on("pointerdown", this.moveCameraUp, this);
	}

	private setupReturnButton2() {
		this.returnBtn2.setScrollFactor(0);
		this.returnBtn2.setInteractive({ useHandCursor: true });
		this.returnBtn2.setDepth(2000);
		this.returnBtn2.on("pointerdown", this.moveCameraDown, this);
	}

	private setupClearRocksButton() {
		this.clearrocksBtn.setScrollFactor(0);
		this.clearrocksBtn.setDepth(2000);
		this.clearrocksBtn.disableInteractive();
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
		this.generatorReviewActive = true;
		this.moveCameraTo(this.initialCameraScrollY - this.checkCameraOffset);
	}

	private moveCameraDown() {
		this.generatorReviewActive = false;
		this.moveCameraTo(this.initialCameraScrollY);
	}

	private moveCameraTo(targetScrollY: number) {
		this.checkCameraTween?.stop();

		const startScrollY = this.cameras.main.scrollY;
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

	public isGeneratorReviewActive() {
		return this.generatorReviewActive;
	}

	private openLevelAccess() {

		if (this.levelOpened) {
			return;
		}

		this.generatorReviewActive = false;
		this.wakeProcessBodies();
		this.resetGemUnlockProgress();
		this.levelOpened = true;
		this.processBtn.disableInteractive();
		this.returnBtn.disableInteractive();
		this.levelAutoCloseTimer?.remove(false);
		const targetX = this.levelBaseInitialX - (this.scale.width + this.levelOpenShiftX);
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
		const targetX = this.levelBaseInitialX;
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
		const targetX = this.levelBaseInitialX;
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

	private cleanupFallenObjects() {
		const cleanupY = this.levelBase.y + this.scale.height * 2;

		for (const gem of [...this.gems]) {
			(gem as any).cleanupIfBelowY?.(cleanupY);
		}

		for (const child of [...this.children.list]) {
			if (!(child instanceof Roca)) {
				continue;
			}

			(child as any).cleanupIfBelowY?.(cleanupY);
		}
	}


	private wakeProcessBodies() {
		for (const gem of this.gems) {
			const bodyId = (gem as any).bodyId;
			if (bodyId) {
				b2Body_SetAwake(bodyId, true);
			}
		}

		for (const child of this.children.list) {
			if (!(child instanceof Roca)) {
				continue;
			}

			const bodyId = (child as any).bodyId;
			if (bodyId) {
				b2Body_SetAwake(bodyId, true);
			}
		}
	}

	private handleGeneratorCoreGems() {
		if (!this.generatorReviewActive) {
			return;
		}

		const bounds = this.generatorCore.getBounds();
		for (const gem of this.gems) {
			if (!gem || (gem as any).destroyed) {
				continue;
			}

			if (gem.x < bounds.left || gem.x > bounds.right || gem.y < bounds.top || gem.y > bounds.bottom) {
				continue;
			}

			(gem as any).beginGeneratorCoreConsumption?.();
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
			const spawnPoint = this.getRockGenZonePoint();
			const x = spawnPoint.x;
			const y = spawnPoint.y;
			this.spawnRock(x, y);
			this.scheduleNextRockSpawn();
		});
	}

	private getRockGenZonePoint() {
		const bounds = this.rockGenZone.getBounds();
		return {
			x: bounds.left + Math.random() * bounds.width,
			y: bounds.top + Math.random() * bounds.height,
		};
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
