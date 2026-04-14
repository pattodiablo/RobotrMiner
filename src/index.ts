import Phaser from "./phaser";
import Level from "./scenes/Level";
import Preload from "./scenes/Preload";

const preloadAssetPackUrl = new URL("../static/assets/preload-asset-pack.json", import.meta.url).toString();

class Boot extends Phaser.Scene {

    constructor() {
        super("Boot");
    }

    preload() {
		console.log("Boot scene preload");
        this.load.pack("pack", preloadAssetPackUrl);
    }

    create() {

       this.scene.start("Preload");
    }
}

window.addEventListener('load', function () {
	
	const game = new Phaser.Game({
		width: 1031,
		height: 530,
		backgroundColor: "#2f2f2f",
		scale: {
			mode: Phaser.Scale.ScaleModes.FIT,
			autoCenter: Phaser.Scale.Center.CENTER_BOTH
		},
		scene: [Boot, Preload, Level]
	});

	game.scene.start("Boot");
});