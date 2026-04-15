import Phaser from "./phaser";
import Level from "./scenes/Level";
import Preload from "./scenes/Preload";
import {
	AddSpriteToWorld,
	CreateWorld,
	DYNAMIC,
	SetWorldScale,
	UpdateWorldSprites,
	WorldStep,
	b2CreateBody,
	b2DefaultBodyDef,
	b2DefaultWorldDef,
	pxmVec2,
	} from "./box2d.js";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";

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
		backgroundColor: "#2f2f2f", antialias: true,           // puedes dejarlo en true
		scale: {
			mode: Phaser.Scale.ScaleModes.FIT,
			autoCenter: Phaser.Scale.Center.CENTER_BOTH
		},plugins: { 
            scene: [{
                key: "spine.SpinePlugin",
                plugin: SpinePlugin,
                mapping: "spine"
            }]
        },
	    physics: {
        default: 'box2d'
        
    },
		scene: [Boot, Preload, Level]
	});

	game.scene.start("Boot");
});