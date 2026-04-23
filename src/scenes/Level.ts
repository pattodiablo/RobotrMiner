
// You can write more code here

/* START OF COMPILED CODE */

import Robot from "./Prefabs/Robot";
import GemLevelBar from "./Prefabs/GemLevelBar";
import Leveler from "./Prefabs/Leveler";
/* START-USER-IMPORTS */
import Gema from "./Prefabs/Gema";
import Coin from "./Prefabs/Coin";
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
	b2Body_SetLinearVelocity,
	b2Body_SetAngularVelocity,
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

		// pared1
		const pared1 = b2CreateBody(this.worldId, { 
			...b2DefaultBodyDef(), 
			position: pxmVec2(-100, -440)
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
		const levelBase2 = this.add.image(515, 1051, "levelBase");

		// body_2
		const body_2 = b2CreateBody(this.worldId, { 
			...b2DefaultBodyDef(), 
			position: pxmVec2(515, -1051)
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
		const dropPlace = this.add.rectangle(961, 810, 128, 128);
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
		clearrocksBtn.visible = false;

		// ovenBtn
		const ovenBtn = this.add.image(501, 476, "ovenBtn");
		ovenBtn.scaleX = 0.7;
		ovenBtn.scaleY = 0.7;

		// miningBtn
		const miningBtn = this.add.image(293, 476, "MiningBtn");
		miningBtn.scaleX = 0.7;
		miningBtn.scaleY = 0.7;

		// degradadoOven
		const degradadoOven = this.add.image(453, 915, "degradadoOven");
		degradadoOven.scaleX = 9.792633136475096;

		// HudAlert
		const hudAlert = this.add.image(432, 272, "HUDAlert");
		hudAlert.scaleX = 9.164778234247432;
		hudAlert.scaleY = 0.6225647197887229;

		// robot_1
		const robot_1 = new Robot(this, this.spine, 446, 185);
		this.add.existing(robot_1);
		robot_1.scaleX = 0.6136006445175658;
		robot_1.scaleY = 0.6136006445175658;

		// leveler1
		const leveler1 = this.add.image(937, 1168, "_MISSING");
		leveler1.alpha = 0;
		leveler1.alphaTopLeft = 0;
		leveler1.alphaTopRight = 0;
		leveler1.alphaBottomLeft = 0;
		leveler1.alphaBottomRight = 0;

		// leveler2
		const leveler2 = this.add.image(954, -410, "_MISSING");
		leveler2.alpha = 0;
		leveler2.alphaTopLeft = 0;
		leveler2.alphaTopRight = 0;
		leveler2.alphaBottomLeft = 0;
		leveler2.alphaBottomRight = 0;

		// leveler3
		const leveler3 = this.add.image(-113, -410, "_MISSING");
		leveler3.alpha = 0;
		leveler3.alphaTopLeft = 0;
		leveler3.alphaTopRight = 0;
		leveler3.alphaBottomLeft = 0;
		leveler3.alphaBottomRight = 0;

		// leveler4
		const leveler4 = this.add.image(-113, 1182, "_MISSING");
		leveler4.alpha = 0;
		leveler4.alphaTopLeft = 0;
		leveler4.alphaTopRight = 0;
		leveler4.alphaBottomLeft = 0;
		leveler4.alphaBottomRight = 0;

		this.body_1 = body_1;
		this.levelBase = levelBase;
		this.body_2 = body_2;
		this.levelBase2 = levelBase2;
		this.levelBar = levelBar;
		this.powerMachine = powerMachine;
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
		this.hudAlert = hudAlert;
		this.leveler1 = leveler1;
		this.leveler2 = leveler2;
		this.leveler3 = leveler3;
		this.leveler4 = leveler4;

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
	private powerMachine!: Phaser.GameObjects.Image;
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
	private hudAlert!: Phaser.GameObjects.Image;
	private leveler1!: Phaser.GameObjects.Image;
	private leveler2!: Phaser.GameObjects.Image;
	private leveler3!: Phaser.GameObjects.Image;
	private leveler4!: Phaser.GameObjects.Image;
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
	private energyDemandLabel!: Phaser.GameObjects.Text;
	private energyDemandLights!: Phaser.GameObjects.Ellipse[];
	private energyDemandPressure = 0;
	private energyDemandTargetPressure = 0;
	private energyDemandRetargetTimer = 0;
	private energyDemandNextRetargetDelay = 0;
	private readonly reactorEnergyDrainPerSecond = 0.625;
	private readonly energyDemandRisePerSecond = 0.72;
	private readonly energyDemandFallPerSecond = 0.58;
	private readonly energyDemandRetargetIntervalMinMs = 120000;
	private readonly energyDemandRetargetIntervalMaxMs = 240000;
	private readonly energyDemandTargetMin = 8;
	private readonly energyDemandTargetMax = 100;

	private readonly rockSpawnMinDelay = 2600;
	private readonly rockSpawnMaxDelay = 7500;
	private readonly rockSpawnRampSpawns = 18;
	private readonly rockSpawnVariance = 0.32;
	private readonly maxVisibleRocks = 20;
	private readonly levelerSpawnX = 960;
	private readonly levelerSpawnY = 1312;
	private readonly levelerSpawnInterval = 10000;
	private readonly maxLevelerInstances = 12;
	private readonly levelerSpawnSpacingX = 220;
	private readonly levelerSpawnSpacingY = 72;
	private debugCanvas: HTMLCanvasElement | null = null;
	private debugContext: CanvasRenderingContext2D | null = null;
	private debugDraw: any = null;
	private bloomEffect?: Phaser.Types.Actions.AddEffectBloomReturn;
	private powerMachinePulseTween?: Phaser.Tweens.Tween;
	private hudAlertPulseTween?: Phaser.Tweens.Tween;
	private buttonBaseScales = new Map<Phaser.GameObjects.Image, { scaleX: number; scaleY: number }>();
	private debugEnabled = false;
	private debugToggleKey!: Phaser.Input.Keyboard.Key;
	private levelOpened = false;
	private levelOpenTween?: Phaser.Tweens.Tween;
	private checkCameraTween?: Phaser.Tweens.Tween;
	private levelerSpawnTimer?: Phaser.Time.TimerEvent;
	private levelerInstanceCount = 1;
	private levelAutoCloseTimer?: Phaser.Time.TimerEvent;
	private ambienceTimer?: Phaser.Time.TimerEvent;
	private miningButtonHintTimer?: Phaser.Time.TimerEvent;
	private ovenRockCollisionTimer?: Phaser.Time.TimerEvent;
	private gameOverDelayTimer?: Phaser.Time.TimerEvent;
	private primaryLeveler?: Leveler;
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
	private readonly ambienceInitialDelayMin = 12000;
	private readonly ambienceInitialDelayMax = 26000;
	private readonly ambienceRepeatDelayMin = 18000;
	private readonly ambienceRepeatDelayMax = 42000;
	private readonly miningButtonHintRockThreshold = 5;
	private readonly rockCollisionCategoryBit = 0x0008;
	private readonly gameOverDelayMs = 10000;
	private hudAlertBaseScaleX = 0;
	private hudAlertBaseScaleY = 0;
	private pointerMinedRockCount = 0;
	private lowEnergyAlarmActive = false;
	private gameOverTriggered = false;
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
		this.primaryLeveler = this.getPrimaryLeveler();
		this.primaryLeveler?.setRoutePoints(this.getLevelerRoutePoints());
		this.console.setScrollFactor(0);
		this.console.setDepth(1498);
		this.createLevelBounds();
		this.initialCameraScrollY = this.cameras.main.scrollY;
		this.secondLevelGemMinY = this.levelBase2.y - 240;
		this.setupBloomEffect();
		this.setupPowerMachinePulse();
		this.setupProcessButton();
		this.setupReturnButton();
		this.setupCheckButton();
		this.setupReturnButton2();
		this.scheduleLevelerSpawns();
		this.setupBox2DDebug();
		this.setupClearRocksButton();
		this.createMoneyHud();
		this.createReactorHud();
		this.setupAmbienceSounds();
		const bgMusic = this.sound.get("bgMusic");
		if (!bgMusic || !bgMusic.isPlaying) {
			this.sound.play("bgMusic", {
				volume: 0.35,
				loop: true,
			});
		}
		this.sound.play("coreRestart", {
			volume: 0.55,
			loop: false,
		});
		this.events.on("gema-drag-start", this.beginGemCarry, this);
		this.events.on("rock-pointer-mined", this.handlePointerMinedRock, this);
		this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.handleSceneShutdown, this);
		this.events.once(Phaser.Scenes.Events.DESTROY, this.handleSceneShutdown, this);
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
		this.updateEnergyDemand(delta);
		this.updateReactorEnergy(delta);
		WorldStep({ worldId: this.worldId, deltaTime: delta / 1000 });
		this.handleSecondLevelRocks();
		this.handleGemMerges();
		this.handleGeneratorCoreGems();
		this.cleanupFallenObjects();
		this.handleRockImpacts();
		this.gems.forEach((gem) => {
			gem.updateHold();
			gem.updateOvenState();
		});
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

	private setupPowerMachinePulse() {
		this.powerMachinePulseTween = this.tweens.add({
			targets: this.powerMachine,
			scaleX: { from: this.powerMachine.scaleX, to: this.powerMachine.scaleX * 1.03 },
			scaleY: { from: this.powerMachine.scaleY, to: this.powerMachine.scaleY * 1.03 },
			alpha: { from: 0.92, to: 1 },
			duration: 1300,
			yoyo: true,
			repeat: -1,
			ease: "Sine.easeInOut",
		});
	}

	private setupAmbienceSounds() {
		this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.stopAmbienceSounds, this);
		this.events.once(Phaser.Scenes.Events.DESTROY, this.stopAmbienceSounds, this);
		this.scheduleNextAmbienceSound(true);
	}

	private scheduleNextAmbienceSound(initial = false) {
		this.ambienceTimer?.remove(false);
		const delay = initial
			? Phaser.Math.Between(this.ambienceInitialDelayMin, this.ambienceInitialDelayMax)
			: Phaser.Math.Between(this.ambienceRepeatDelayMin, this.ambienceRepeatDelayMax);

		this.ambienceTimer = this.time.delayedCall(delay, () => {
			this.playRandomAmbienceSound();
			this.scheduleNextAmbienceSound(false);
		});
	}

	private playRandomAmbienceSound() {
		const soundKey = Math.random() < 0.5 ? "ambience1" : "ambience2";
		this.sound.play(soundKey, {
			volume: 0.35,
			rate: 1,
			loop: false,
		});
	}

	private stopAmbienceSounds() {
		this.ambienceTimer?.remove(false);
		this.ambienceTimer = undefined;
	}

	private updatePowerMachinePulseRate(energyPercent: number) {
		if (!this.powerMachinePulseTween) {
			return;
		}

		const normalizedEnergy = Phaser.Math.Clamp(energyPercent / 100, 0, 1);
		this.powerMachinePulseTween.timeScale = Phaser.Math.Linear(0.7, 1.25, normalizedEnergy);
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

				const spawnIndex = this.levelerInstanceCount;
				const spawnOffsetX = (spawnIndex % 3) * this.levelerSpawnSpacingX;
				const spawnOffsetY = Math.floor(spawnIndex / 3) * this.levelerSpawnSpacingY;
				const leveler = new Leveler(this, this.levelerSpawnX + spawnOffsetX, this.levelerSpawnY + spawnOffsetY);
				this.add.existing(leveler);
				leveler.setRoutePoints(this.getLevelerRoutePoints());
				this.levelerInstanceCount += 1;
			},
		});
	}

	private getPrimaryLeveler() {
		for (const child of this.children.list) {
			if (child instanceof Leveler) {
				return child;
			}
		}

		return undefined;
	}

	private getLevelerRoutePoints() {
		const markers = [this.leveler1, this.leveler2, this.leveler3, this.leveler4];
		const routePoints: Array<{ x: number; y: number }> = [];

		for (const marker of markers) {
			if (!marker) {
				continue;
			}

			routePoints.push({
				x: pxm(marker.x),
				y: -pxm(marker.y),
			});
		}

		return routePoints;
	}

	public registerGem(gem: Gema) {
		if (!this.gems.includes(gem)) {
			gem.setSecondLevelMinY(this.secondLevelGemMinY);
			this.gems.push(gem);
		}

		if (!(gem as any).isOvened?.()) {
			this.updateGemLevelBar(gem.getBirthType());
		}
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
		this.sound.play("coinfall", {
			volume: 0.45,
			loop: false,
		});

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
			fontFamily: "arial",
			fontSize: "28px",
			color: "#f8d66d",
			stroke: "#684205",
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
		this.energyDemandTargetPressure = Phaser.Math.Between(18, 42);
		this.energyDemandNextRetargetDelay = Phaser.Math.Between(this.energyDemandRetargetIntervalMinMs, this.energyDemandRetargetIntervalMaxMs);

		this.hudAlertBaseScaleX = this.hudAlert.scaleX;
		this.hudAlertBaseScaleY = this.hudAlert.scaleY;
		this.hudAlert.setScrollFactor(0);
		this.hudAlert.setDepth(1998);
		this.hudAlert.setVisible(false);
		this.hudAlert.setAlpha(0);
		this.hudAlert.setScale(this.hudAlertBaseScaleX, this.hudAlertBaseScaleY);

		this.reactorEnergyText = this.add.text(16, 84, this.formatReactorEnergy(), {
			fontFamily: "arial",
			fontSize: "12px",
			color: "#ffffff",
		
		
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

		this.energyDemandLabel = this.add.text(258, 84, "ENERGY DEMAND", {
			fontFamily: "arial",
			fontSize: "12px",
			color: "#ffffff",
			
			align: "left",
		});
		this.energyDemandLabel.setScrollFactor(0);
		this.energyDemandLabel.setDepth(2000);

		this.energyDemandLights = [
			this.add.ellipse(268, 112, 18, 18, 0x2e8f4e, 1),
			this.add.ellipse(294, 112, 18, 18, 0xbca63b, 1),
			this.add.ellipse(320, 112, 18, 18, 0xb43a2d, 1),
		];

		for (const light of this.energyDemandLights) {
			light.setStrokeStyle(3, 0x1a1205, 1);
			light.setScrollFactor(0);
			light.setDepth(2000);
		}

		this.updateEnergyDemandHud();
	}

	public addReactorEnergy(gemValue: number) {
		const wasDepleted = this.reactorEnergy <= 0;
		const energyGain = Math.max(2, Math.round(gemValue / 5));
		this.reactorEnergy = Math.min(100, this.reactorEnergy + energyGain);
		if (wasDepleted && this.reactorEnergy > 0) {
			this.sound.play("coreRestart", {
				volume: 0.55,
				loop: false,
			});
		}
		this.updateReactorHud();
	}

	private updateEnergyDemand(delta: number) {
		const deltaSeconds = delta / 1000;
		this.energyDemandRetargetTimer += delta;

		if (this.energyDemandNextRetargetDelay <= 0 || this.energyDemandRetargetTimer >= this.energyDemandNextRetargetDelay) {
			this.energyDemandRetargetTimer = 0;
			this.energyDemandNextRetargetDelay = Phaser.Math.Between(this.energyDemandRetargetIntervalMinMs, this.energyDemandRetargetIntervalMaxMs);
			this.energyDemandTargetPressure = Phaser.Math.Between(this.energyDemandTargetMin, this.energyDemandTargetMax);
		}

		const riseStep = this.energyDemandRisePerSecond * deltaSeconds;
		const fallStep = this.energyDemandFallPerSecond * deltaSeconds;
		if (this.energyDemandPressure < this.energyDemandTargetPressure) {
			this.energyDemandPressure = Math.min(this.energyDemandTargetPressure, this.energyDemandPressure + riseStep);
		} else if (this.energyDemandPressure > this.energyDemandTargetPressure) {
			this.energyDemandPressure = Math.max(this.energyDemandTargetPressure, this.energyDemandPressure - fallStep);
		}

		this.energyDemandPressure = Phaser.Math.Clamp(this.energyDemandPressure, 0, 100);

		this.updateEnergyDemandHud();
	}

	private updateReactorEnergy(delta: number) {
		const energyMultiplier = this.getEnergyDemandMultiplier();
		this.reactorEnergy = Math.max(0, this.reactorEnergy - this.reactorEnergyDrainPerSecond * energyMultiplier * (delta / 1000));
		this.updateReactorHud();
	}

	private getEnergyDemandLevel() {
		if (this.energyDemandPressure < 34) {
			return 0;
		}

		if (this.energyDemandPressure < 68) {
			return 1;
		}

		return 2;
	}

	private getEnergyDemandMultiplier() {
		const level = this.getEnergyDemandLevel();
		if (level === 0) {
			return 1;
		}

		if (level === 1) {
			return 2.1;
		}

		return 3.4;
	}

	private updateReactorHud() {
		const energyPercent = Math.round(this.reactorEnergy);
		this.reactorEnergyText.setText(this.formatReactorEnergy());
		this.reactorEnergyBarFill.setScale(energyPercent / 100, 1);
		const fillColor = energyPercent > 66 ? 0x59d98a : energyPercent > 33 ? 0xf7c548 : 0xf26d6d;
		this.reactorEnergyBarFill.setFillStyle(fillColor, 1);
		this.updatePowerMachinePulseRate(energyPercent);
		if (energyPercent <= 20) {
			if (!this.lowEnergyAlarmActive) {
				this.lowEnergyAlarmActive = true;
				this.sound.play("alarm", {
					volume: 0.55,
					loop: false,
				});
			}
		} else {
			this.lowEnergyAlarmActive = false;
		}
		const alertAlpha = Phaser.Math.Clamp((20 - energyPercent) / 20, 0, 1);
		this.hudAlert.setAlpha(alertAlpha);
		this.updateHudAlertPulse(alertAlpha, energyPercent);

		if (energyPercent <= 0 && !this.gameOverTriggered) {
			this.scheduleGameOver();
		} else if (energyPercent > 0) {
			this.cancelScheduledGameOver();
		}
	}

	private scheduleGameOver() {
		if (this.gameOverTriggered || this.gameOverDelayTimer) {
			return;
		}

		this.gameOverDelayTimer = this.time.delayedCall(this.gameOverDelayMs, () => {
			this.gameOverDelayTimer = undefined;
			if (this.reactorEnergy <= 0 && !this.gameOverTriggered) {
				this.triggerGameOver();
			}
		});
	}

	private cancelScheduledGameOver() {
		this.gameOverDelayTimer?.remove(false);
		this.gameOverDelayTimer = undefined;
	}

	private updateHudAlertPulse(alertAlpha: number, energyPercent: number) {
		if (alertAlpha <= 0) {
			this.hudAlertPulseTween?.stop();
			this.hudAlertPulseTween = undefined;
			this.hudAlert.setAlpha(0);
			this.hudAlert.setVisible(false);
			this.hudAlert.setScale(this.hudAlertBaseScaleX, this.hudAlertBaseScaleY);
			return;
		}

		const shouldBlink = energyPercent <= 10;
		const targetDuration = shouldBlink ? 230 : 900;
		const targetAlphaFrom = shouldBlink ? Math.max(0.18, alertAlpha * 0.35) : alertAlpha;
		const targetAlphaTo = shouldBlink ? Math.min(1, alertAlpha + 0.3) : alertAlpha;

		this.hudAlert.setVisible(true);
		if (!this.hudAlertPulseTween || this.hudAlertPulseTween.duration !== targetDuration) {
			this.hudAlertPulseTween?.stop();
			this.hudAlertPulseTween = this.tweens.add({
				targets: this.hudAlert,
				alpha: { from: targetAlphaFrom, to: targetAlphaTo },
				scaleX: { from: this.hudAlertBaseScaleX, to: this.hudAlertBaseScaleX * 1.03 },
				scaleY: { from: this.hudAlertBaseScaleY, to: this.hudAlertBaseScaleY * 1.03 },
				duration: targetDuration,
				yoyo: true,
				repeat: -1,
				ease: "Sine.easeInOut",
			});
		}
	}

	private triggerGameOver() {
		this.gameOverTriggered = true;
		this.cancelScheduledGameOver();
		this.input.enabled = false;
		this.levelOpenTween?.stop();
		this.checkCameraTween?.stop();
		this.levelAutoCloseTimer?.remove(false);
		this.ambienceTimer?.remove(false);
		this.ovenRockCollisionTimer?.remove(false);
		this.sound.stopByKey("bgMusic");
		this.cameras.main.fadeOut(900, 0, 0, 0);
		this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
			this.scene.start("GameOver");
		});
	}

	private updateEnergyDemandHud() {
		const level = this.getEnergyDemandLevel();
		const colors = [0x2e8f4e, 0xbca63b, 0xb43a2d];
		for (let index = 0; index < this.energyDemandLights.length; index += 1) {
			const light = this.energyDemandLights[index];
			const active = index === level;
			const tintColor = colors[index];
			light.setFillStyle(tintColor, active ? 1 : 0.2);
			light.setAlpha(active ? 1 : 0.35);
		}
	}

	private formatReactorEnergy() {
		return `REACTOR ${Math.round(this.reactorEnergy)}%`;
	}

	private registerButtonBaseScale(button: Phaser.GameObjects.Image) {
		this.buttonBaseScales.set(button, {
			scaleX: button.scaleX,
			scaleY: button.scaleY,
		});
	}

	private playButtonPressEffect(button: Phaser.GameObjects.Image) {
		const baseScale = this.buttonBaseScales.get(button) ?? {
			scaleX: button.scaleX,
			scaleY: button.scaleY,
		};

		this.tweens.killTweensOf(button);
		button.setScale(baseScale.scaleX, baseScale.scaleY);
		this.tweens.add({
			targets: button,
			scaleX: { from: baseScale.scaleX, to: baseScale.scaleX * 0.92 },
			scaleY: { from: baseScale.scaleY, to: baseScale.scaleY * 0.92 },
			duration: 70,
			yoyo: true,
			ease: "Sine.easeOut",
		});
	}

	private playMiningButtonHint() {
		this.miningButtonHintTimer?.remove(false);
		this.playButtonPressEffect(this.miningBtn);
		this.miningButtonHintTimer = this.time.delayedCall(260, () => {
			this.playButtonPressEffect(this.miningBtn);
			this.miningButtonHintTimer = undefined;
		});
	}

	private handlePointerMinedRock() {
		if (!this.isAtMiningArea()) {
			this.pointerMinedRockCount = 0;
			return;
		}

		this.pointerMinedRockCount += 1;
		if (this.pointerMinedRockCount < this.miningButtonHintRockThreshold) {
			return;
		}

		this.pointerMinedRockCount = 0;
		this.playMiningButtonHint();
	}

	private handleSceneShutdown() {
		this.miningButtonHintTimer?.remove(false);
		this.miningButtonHintTimer = undefined;
		this.cancelScheduledGameOver();
		this.events.off("rock-pointer-mined", this.handlePointerMinedRock, this);
	}

	private setupProcessButton() {
		this.ovenBtn.setScrollFactor(0);
		this.ovenBtn.setInteractive({ useHandCursor: true });
		this.ovenBtn.setDepth(2000);
		this.registerButtonBaseScale(this.ovenBtn);
		this.ovenBtn.on("pointerdown", () => {
			this.playButtonPressEffect(this.ovenBtn);
			this.openLevelAccess();
		});
	}

	private setupReturnButton() {
		this.clearrocksBtn.setScrollFactor(0);
		this.clearrocksBtn.setDepth(2000);
		this.clearrocksBtn.disableInteractive();
	}

	private setupCheckButton() {
		this.coreBtn.setScrollFactor(0);
		this.coreBtn.setInteractive({ useHandCursor: true });
		this.coreBtn.setDepth(2000);
		this.registerButtonBaseScale(this.coreBtn);
		this.coreBtn.on("pointerdown", () => {
			this.playButtonPressEffect(this.coreBtn);
			this.moveCameraUp();
		});
	}

	private setupReturnButton2() {
		this.miningBtn.setScrollFactor(0);
		this.miningBtn.setInteractive({ useHandCursor: true });
		this.miningBtn.setDepth(2000);
		this.registerButtonBaseScale(this.miningBtn);
		this.miningBtn.on("pointerdown", () => {
			this.playButtonPressEffect(this.miningBtn);
			this.handleMiningButtonPress();
		});
	}

	private setupClearRocksButton() {
		this.clearrocksBtn.setScrollFactor(0);
		this.clearrocksBtn.setDepth(2000);
		this.clearrocksBtn.disableInteractive();
	}

	private getLevelBaseBodyId() {
		return this.levelBaseBodyId ?? (this.levelBase as any).bodyId;
	}

	private getLevelBaseShapeId() {
		const bodyId = this.getLevelBaseBodyId();
		if (!bodyId) {
			return null;
		}

		const shapeIds: any[] = [];
		const shapeCount = b2Body_GetShapes(bodyId, shapeIds);
		return shapeCount > 0 ? shapeIds[0] : null;
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

	private setLevelBaseRockCollisionEnabled(enabled: boolean) {
		const levelBaseShapeId = this.getLevelBaseShapeId();
		if (!levelBaseShapeId) {
			return;
		}

		const filter = b2DefaultFilter();
		filter.maskBits = enabled
			? filter.maskBits
			: filter.maskBits & ~this.rockCollisionCategoryBit;
		b2Shape_SetFilter(levelBaseShapeId, filter);
	}

	private animateLevelBase(targetX: number, targetScrollY: number, onComplete: () => void) {
		this.levelOpenTween?.stop();

		const levelBaseBodyId = this.getLevelBaseBodyId();
		const levelBase2BodyId = this.getLevelBase2BodyId();
		if (!levelBaseBodyId || !levelBase2BodyId) {
			this.ovenBtn.setInteractive({ useHandCursor: true });
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

	private handleMiningButtonPress() {
		this.pointerMinedRockCount = 0;
		if (!this.isAtMiningArea()) {
			this.moveCameraDown();
			return;
		}

		this.mineAllRocks();
	}

	private isAtMiningArea() {
		return Math.abs(this.cameras.main.scrollY - this.initialCameraScrollY) < 8;
	}

	private mineAllRocks() {
		for (const object of this.children.list) {
			if (!(object instanceof Roca)) {
				continue;
			}

			(object as Roca).mineRock();
		}
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

		const soundKey = Math.random() < 0.5 ? "rocksFall" : "rocksFalls2";
		this.sound.play(soundKey, {
			volume: 0.55,
			loop: false,
		});

		this.generatorReviewActive = false;
		this.wakeProcessBodies();
		this.ovenRockCollisionTimer?.remove(false);
		this.setLevelBaseRockCollisionEnabled(true);
		this.ovenRockCollisionTimer = this.time.delayedCall(1000, () => {
			this.setLevelBaseRockCollisionEnabled(false);
			this.ovenRockCollisionTimer = undefined;
		});
		this.resetGemUnlockProgress();
		this.levelOpened = true;
		this.ovenBtn.disableInteractive();
		this.levelAutoCloseTimer?.remove(false);
		const targetX = this.levelBaseInitialX - (this.scale.width + this.levelOpenShiftX);
		const targetScrollY = this.initialCameraScrollY + this.levelOpenCameraOffset;

		this.animateLevelBase(targetX, targetScrollY, () => {
			this.ovenBtn.disableInteractive();
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
		this.ovenRockCollisionTimer?.remove(false);
		this.ovenRockCollisionTimer = undefined;
		this.setLevelBaseRockCollisionEnabled(true);
		this.levelAutoCloseTimer?.remove(false);
		this.levelAutoCloseTimer = undefined;
		this.levelOpened = false;
		this.ovenBtn.disableInteractive();
		const targetX = this.levelBaseInitialX;
		const targetScrollY = this.initialCameraScrollY;

		this.animateLevelBase(targetX, targetScrollY, () => {
			this.ovenBtn.setInteractive({ useHandCursor: true });
		});

		if (!this.levelOpenTween) {
			this.ovenBtn.setInteractive({ useHandCursor: true });
		}
	}

	private closeLevelAccess(restoreCamera: boolean) {
		if (!this.levelOpened) {
			return;
		}

		this.ovenRockCollisionTimer?.remove(false);
		this.ovenRockCollisionTimer = undefined;
		this.setLevelBaseRockCollisionEnabled(true);
		this.levelOpened = false;
		this.levelAutoCloseTimer?.remove(false);
		this.levelAutoCloseTimer = undefined;
		const targetX = this.levelBaseInitialX;
		const targetScrollY = restoreCamera ? this.initialCameraScrollY : this.cameras.main.scrollY;

		this.ovenBtn.disableInteractive();
		this.animateLevelBase(targetX, targetScrollY, () => {
			this.ovenBtn.setInteractive({ useHandCursor: true });
		});

		if (!this.levelOpenTween) {
			this.ovenBtn.setInteractive({ useHandCursor: true });
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

			if ((gemA as any).isOvened?.() !== (gemB as any).isOvened?.()) {
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
		if (this.carriedGem) {
			this.carriedGem.forceProcessFall?.();
			this.carriedGem = null;
		}

		for (const gem of this.gems) {
			gem.forceProcessFall?.();
		}

		for (const child of this.children.list) {
			if (!(child instanceof Roca)) {
				continue;
			}

			const bodyId = (child as any).bodyId;
			if (bodyId) {
				b2Body_SetType(bodyId, b2BodyType.b2_dynamicBody);
				b2Body_SetAwake(bodyId, true);
				b2Body_SetLinearVelocity(bodyId, new b2Vec2(0, pxm(-8)));
				b2Body_SetAngularVelocity(bodyId, 0);
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
		const mergeSoundKey = gemA.getBirthType() >= 8
			? (Math.random() < 0.5 ? "PowerGem1" : "PowerGem2")
			: "gemFusion";

		if (!textureKey) {
			return;
		}

		this.sound.play(mergeSoundKey, {
			volume: 0.5,
			loop: false,
		});

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
