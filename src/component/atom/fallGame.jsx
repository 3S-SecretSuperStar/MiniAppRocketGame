import {
  Application,
  Sprite,
  Assets,
  Text,
  Container,
} from "pixi.js";
import cnst from "./constants";
import { Img } from "../../assets/image/index.jsx"

class FallGame {
  constructor(gameId) {
    this.gameId = gameId;
    this.started = false;
    this.lastId = 0;
    this.elements = [];
    this.startPauseCont = null;
    this.startPauseText = null;
    this.scoreText = null;
    this.lostelements = 0;
    this.score = 0;
    this.eventListeners = [];
    this.timer = 0;
    this.craterTOId = null;
    this.craterTOStart = null;
    this.craterTOLeft = null;
    this.score = 0;

    this.app = new Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: 0,
      resizeTo: window,

    });
    this.app.renderer.view.style.position = "absolute";
    this.view = this.app.view;
    this.app.stage.sortableChildren = true; // to sort everything by zIndex
    this.setup();
  }

  setup = async () => {
    // well there's gotta be a better way to do this...
    await this.loadAssets();

    if (!this.gameId) return;

    this.restartGame()

    this.app.ticker.add((d) => this.loop(d));
  };


  loadAssets = async () => {
    const textures = await Promise.all([
      Assets.load(Img.meteor),
      Assets.load(Img.crater),
      Assets.load(Img.destroy),
      Assets.load(Img.ufo)
    ]);
    this.meteorTexture = textures[0];
    this.craterTexture = textures[1];
    this.destroyTextrue = textures[2];
    this.ufoTexture = textures[3]
  };
  getScore = () => {
    return this.score
  }


  loop = (d) => {
    if (this.started == false) return;
    const elementsToRemove = [];
    for (let i = 0; i < this.elements.length; i++) {
      if (this.elements[i].type === "ufo") {
        const ufo = this.elements[i];
        if (ufo.isDestroyed === 0) {
          if (ufo.isLeft === 1) {
            ufo.x += ufo.xSpeed * d;
          } else {
            ufo.x -= ufo.xSpeed * d;
          }
          ufo.y += ufo.ySpeed * d;
          ufo.xSpeed += ufo.accSpeed * 0.5;
        } else if (Date.now() - ufo.destroyedTime > 500) {
          elementsToRemove.push(ufo);
        }
        if (ufo.y >= this.app.screen.height || ufo.x >= this.app.screen.width) {
          elementsToRemove.push(ufo);
        }
      }
      else {
        const meteor = this.elements[i];
        if (meteor.isDestroyed === 0) {

          meteor.y += meteor.speed * d;
        } else if (Date.now() - meteor.destroyedTime > 500) {
          elementsToRemove.push(meteor);
        }
        if (meteor.y >= this.app.screen.height || meteor.x >= this.app.screen.width) {
          elementsToRemove.push(meteor);
        }
      }


    }
    for (let i = 0; i < elementsToRemove.length; i++) {

      const crater = elementsToRemove[i];
      let _elements = [...this.elements];
      _elements = _elements.filter((_crater) => _crater.id !== crater.id);
      this.elements = [..._elements];
      this.app.stage.removeChild(crater);

    }
  };

  restartGame = () => {
    clearTimeout(this.craterTOId);
    this.started = true;
    this.lostelements = 0;
    this.updateScore(0);
    for (let i = 0; i < this.elements.length; i++) {
      this.app.stage.removeChild(this.elements[i]);
    }
    this.elements = [];
    this.generateElement();
    this.timer = 0;
  };

  updateScore = (newScore) => {
    this.score = newScore;
  };


  generateElement = () => {
    if (this.elements.length < cnst.MAX_Element_IN_PLAY) {
      const crater = Sprite.from(this.craterTexture);
      crater.interactive = true;
      crater.eventMode = 'dynamic';
      crater.cursor = 'pointer';
      crater.isDestroyed = 0;
      crater.destroyedTime = 0;
      crater.type = "crater"
      crater.id = this.lastId++;
      crater.ySpeed =
        (Math.random() * cnst.MAX_ADDITIONAL_SPEED + cnst.MIN_FALLING_SPEED);
      crater.xSpeed = crater.ySpeed / 2;

      const time = this.app.screen.height / crater.ySpeed;
      crater.accSpeed = (this.app.screen.width - crater.xSpeed * time) * 2 / Math.pow(time, 2);
      crater.scale = {
        x: Math.max(Math.min(this.app.screen.width / 1200, 0.1), 0.2),
        y: Math.max(Math.min(this.app.screen.width / 1200, 0.1), 0.2),
      };
      crater.x = Math.max(
        Math.min(
          this.app.screen.width - crater.width - cnst.MIN_CRATER_SIDE_OFFSET,
          Math.floor(Math.random() * this.app.screen.width)
        ),
        cnst.MIN_CRATER_SIDE_OFFSET
      );
      crater.isLeft = crater.x > this.app.screen.width / 2 ? 0 : 1;
      crater.y = 20;
      crater.zIndex = 1;
      crater.on('pointerdown', () => {
        if (crater.isDestroyed === 0) {
          crater.texture = this.destroyTextrue;
          crater.isDestroyed = 1;
          crater.destroyedTime = Date.now();
          crater.scale = {
            x: 0.5,
            y: 0.5,
          };
          crater.x -= crater.width / 2;
          crater.y -= crater.height / 2;
          this.updateScore(this.score + 0.2)
        }
      });

      const meteor = Sprite.from(this.meteorTexture);
      meteor.interactive = true;
      meteor.eventMode = 'dynamic';
      meteor.cursor = 'pointer';
      meteor.isDestroyed = 0;
      meteor.destroyedTime = 0;
      meteor.type = "meteor"
      meteor.id = this.lastId++;
      meteor.speed =
        (Math.random() * Math.random() / Math.random() * cnst.MAX_ADDITIONAL_SPEED + cnst.MIN_FALLING_SPEED);

      meteor.scale = {
        x: Math.max(Math.min(this.app.screen.width / 1200, 0.05), 0.1),
        y: Math.max(Math.min(this.app.screen.width / 1200, 0.05), 0.1),
      };
      meteor.x = Math.max(
        Math.min(
          this.app.screen.width - meteor.width - cnst.MIN_CRATER_SIDE_OFFSET,
          Math.floor(Math.random() * this.app.screen.width)
        ),
        cnst.MIN_CRATER_SIDE_OFFSET
      );
      meteor.isLeft = meteor.x > this.app.screen.width / 2 ? 0 : 1;
      meteor.y = 20;
      meteor.zIndex = 1;
      meteor.on('pointerdown', () => {
        if (meteor.isDestroyed === 0) {
          meteor.texture = this.destroyTextrue;
          meteor.isDestroyed = 1;
          meteor.destroyedTime = Date.now();
          meteor.scale = {
            x: 0.5,
            y: 0.5,
          };
          meteor.x -= meteor.width / 2;
          meteor.y -= meteor.height / 2;
          this.updateScore(this.score + 0.1)
        }
      });


      const ufo = Sprite.from(this.ufoTexture);
      ufo.interactive = true;
      ufo.eventMode = 'dynamic';
      ufo.cursor = 'pointer';
      ufo.isDestroyed = 0;
      ufo.destroyedTime = 0;
      ufo.type = "ufo"
      ufo.id = this.lastId++;
      ufo.ySpeed =
        (Math.random() * cnst.MAX_ADDITIONAL_SPEED + cnst.MIN_FALLING_SPEED);
      ufo.xSpeed = ufo.ySpeed / 2;

      const ufotime = this.app.screen.height / ufo.ySpeed;
      ufo.accSpeed = (this.app.screen.width - ufo.xSpeed * ufotime) * 2 / Math.pow(ufotime, 2);
      ufo.scale = {
        x: Math.max(Math.min(this.app.screen.width / 1200, 0.1), 0.2),
        y: Math.max(Math.min(this.app.screen.width / 1200, 0.1), 0.2),
      };
      ufo.x = Math.max(
        Math.min(
          this.app.screen.width - ufo.width - cnst.MIN_UFO_SIDE_OFFSET,
          Math.floor(Math.random() * this.app.screen.width)
        ),
        cnst.MIN_UFO_SIDE_OFFSET
      );
      ufo.isLeft = ufo.x > this.app.screen.width / 2 ? 0 : 1;
      ufo.y = 20;
      ufo.zIndex = 1;
      ufo.on('pointerdown', () => {
        if (ufo.isDestroyed === 0) {
          ufo.texture = this.destroyTextrue;
          ufo.isDestroyed = 1;
          ufo.destroyedTime = Date.now();
          ufo.scale = {
            x: 0.5,
            y: 0.5,
          };
          ufo.x -= ufo.width / 2;
          ufo.y -= ufo.height / 2;
          this.updateScore(this.score + 0.5)
        }
      });

      this.elements.push(crater);
      this.elements.push(meteor);
      this.elements.push(ufo)
      this.app.stage.addChild(crater);
      this.app.stage.addChild(meteor);
      this.app.stage.addChild(ufo);
    }

    const spawnInterval =
      Math.random() * cnst.MAX_SPAWN_TIME + cnst.MIN_SPAWN_TIME;
    this.craterTOLeft = spawnInterval;
    this.craterTOStart = Date.now();
    this.craterTOId = setTimeout(() => {
      this.generateElement();
    }, spawnInterval);
  };

  destroy = () => {
    this.gameId = undefined;
    this.eventListeners.forEach((eL) => {
      eL.object.removeEventListener(eL.key, eL.cb);
    });
    this.app.destroy(true, true);
  };
}

export default FallGame;
