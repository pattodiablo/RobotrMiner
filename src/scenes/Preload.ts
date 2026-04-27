
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import Phaser from "../phaser";
/* END-USER-IMPORTS */

export default class Preload extends Phaser.Scene {

	constructor() {
		super("Preload");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// progressBar
		const progressBar = this.add.rectangle(553.0120849609375, 361, 256, 20);
		progressBar.setOrigin(0, 0);
		progressBar.isFilled = true;
		progressBar.fillColor = 14737632;

		// progressBarBg
		const progressBarBg = this.add.rectangle(553.0120849609375, 361, 256, 20);
		progressBarBg.setOrigin(0, 0);
		progressBarBg.fillColor = 14737632;
		progressBarBg.isStroked = true;

		// loadingText
		const loadingText = this.add.text(552.0120849609375, 329, "", {});
		loadingText.text = "Loading...";
		loadingText.setStyle({ "color": "#e0e0e0", "fontFamily": "arial", "fontSize": "20px" });

		this.progressBar = progressBar;

		this.events.emit("scene-awake");
	}

	private progressBar!: Phaser.GameObjects.Rectangle;

	/* START-USER-CODE */

	// Write your code here
	private readonly assetPackUrl = new URL("../../static/assets/asset-pack.json", import.meta.url).toString();
	private preloadBarTrack?: Phaser.GameObjects.Rectangle;
	private preloadBarFrame?: Phaser.GameObjects.Rectangle;
	private preloadStatusText?: Phaser.GameObjects.Text;
	private preloadPercentText?: Phaser.GameObjects.Text;
	private preloadStatusTimer?: Phaser.Time.TimerEvent;
	private preloadStatusIndex = -1;
	private readonly preloadBarWidth = 520;
	private readonly preloadBarHeight = 28;
	private readonly preloadStatusMessages = [
		"Preloading machines",
		"Cleaning shovels",
		"Sharpening drill bits",
		"Sorting ore samples",
		"Calibrating scanners",
		"Fueling mining carts",
		"Checking conveyor belts",
		"Waking up worker bots",
	];

	preload() {

		this.editorCreate();
		this.setupCustomPreloadUi();

		this.load.pack("asset-pack", this.assetPackUrl);

		const width = this.progressBar.width;

		this.load.on("progress", (value: number) => {

			this.progressBar.width = width * value;
			this.preloadPercentText?.setText(`${Math.round(value * 100)}%`);

			const targetIndex = Phaser.Math.Clamp(
				Math.floor(value * this.preloadStatusMessages.length),
				0,
				this.preloadStatusMessages.length - 1,
			);

			if (targetIndex > this.preloadStatusIndex) {
				this.setNextPreloadStatus(targetIndex);
			}
		});

		this.load.once("complete", () => {
			this.preloadStatusTimer?.remove(false);
			this.preloadStatusTimer = undefined;
			this.preloadStatusText?.setText("Launching the mine");
			this.preloadPercentText?.setText("100%");
		});

		this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.handlePreloadShutdown, this);
		this.events.once(Phaser.Scenes.Events.DESTROY, this.handlePreloadShutdown, this);
	}

	create() {

		if (process.env.NODE_ENV === "development") {

			const start = new URLSearchParams(location.search).get("start");

			if (start) {

				console.log(`Development: jump to ${start}`);
				this.scene.start(start);

				return;
			}
		}

		this.scene.start("Tutorial");
	}

	private setupCustomPreloadUi() {
		const centerX = this.scale.width * 0.5;
		const centerY = this.scale.height * 0.5;
		const barX = centerX - this.preloadBarWidth * 0.5;
		const barY = centerY + 84;

		this.hideLegacyPreloadUi();

		const logo = this.getPreloadLogo();
		logo?.setPosition(centerX, centerY - 70);
		logo?.setScale(0.4);

		this.preloadBarFrame = this.add.rectangle(centerX, barY, this.preloadBarWidth + 18, this.preloadBarHeight + 18, 0x130f0b, 0.92);
		this.preloadBarFrame.setStrokeStyle(3, 0xe0c37a, 1);

		this.preloadBarTrack = this.add.rectangle(centerX, barY, this.preloadBarWidth, this.preloadBarHeight, 0x2c2217, 0.95);

		this.progressBar.setOrigin(0, 0.5);
		this.progressBar.setPosition(barX, barY);
		this.progressBar.setSize(this.preloadBarWidth, this.preloadBarHeight);
		this.progressBar.width = 0;
		this.progressBar.fillColor = 0xf2c14e;
		this.progressBar.setDepth(3);

		this.preloadBarFrame.setDepth(1);
		this.preloadBarTrack.setDepth(2);

		this.preloadStatusText = this.add.text(centerX, barY - 54, "", {
			fontFamily: "Courier New, monospace",
			fontSize: "30px",
			color: "#f4e3b2",
			stroke: "#1a1208",
			strokeThickness: 6,
			align: "center",
		});
		this.preloadStatusText.setOrigin(0.5);

		this.preloadPercentText = this.add.text(centerX, barY + 48, "0%", {
			fontFamily: "Courier New, monospace",
			fontSize: "20px",
			color: "#d7c7a0",
			stroke: "#1a1208",
			strokeThickness: 4,
			align: "center",
		});
		this.preloadPercentText.setOrigin(0.5);

		this.setNextPreloadStatus(0);
		this.preloadStatusTimer = this.time.addEvent({
			delay: 900,
			loop: true,
			callback: () => {
				this.setNextPreloadStatus();
			},
		});
	}

	private hideLegacyPreloadUi() {
		for (const child of [...this.children.list]) {
			if (child instanceof Phaser.GameObjects.Text && child.text === "Loading...") {
				child.destroy();
				continue;
			}

			if (
				child instanceof Phaser.GameObjects.Rectangle &&
				child !== this.progressBar &&
				child.width === 256 &&
				child.height === 20
			) {
				child.destroy();
			}
		}
	}

	private getPreloadLogo() {
		for (const child of this.children.list) {
			if (child instanceof Phaser.GameObjects.Image && child.texture?.key === "guapen") {
				return child;
			}
		}

		return undefined;
	}

	private setNextPreloadStatus(forcedIndex?: number) {
		if (!this.preloadStatusText) {
			return;
		}

		if (typeof forcedIndex === "number") {
			this.preloadStatusIndex = forcedIndex;
		} else {
			this.preloadStatusIndex = (this.preloadStatusIndex + 1) % this.preloadStatusMessages.length;
		}

		this.preloadStatusText.setText(this.preloadStatusMessages[this.preloadStatusIndex]);
	}

	private handlePreloadShutdown() {
		this.preloadStatusTimer?.remove(false);
		this.preloadStatusTimer = undefined;
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
