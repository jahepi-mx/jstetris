class Scene {
    
    constructor(canvas) {
        this.canvas = canvas;
        this.board = new Board();
        this.startGame = false;
        document.onkeydown = this.onKeyDown.bind(this);
        document.onkeyup = this.onKeyUp.bind(this);
        this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.startButton = new Button(200, 400, 8, "start");
        this.music = null;
        this.assets = Assets.getInstance();
        this.atlas = Atlas.getInstance();
    }
    
    update(deltatime) {
        this.board.update(deltatime);
        if (this.board.isOver) {
            this.startButton.visible = true;
            this.startGame = false;
            if (this.music !== null) {
                this.music.stop();
            }
        }
    }
    
    render(context) {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        context.imageSmoothingEnabled = false;
        this.board.render(context);
        this.startButton.render(context);
        // render board pieces queue
        var xOffset = this.board.width * this.board.tileSize;
        var size = 150;
        for (var a = 0; a < this.board.queue.length; a++) {
            context.drawImage(this.assets.spritesAtlas, this.atlas.sprites["s0"].x, this.atlas.sprites["s0"].y, this.atlas.sprites["s0"].width, this.atlas.sprites["s0"].height, xOffset, a * size, size, size);
            var piece = this.board.queue[a];
            var pieceTileSize = 20;
            var width = piece.size * pieceTileSize;
            var centerX = xOffset + (size / 2) - (width / 2);
            var centerY = a * size + (size / 2) - (width / 2);
            for (var b = 0; b < piece.size * piece.size; b++) {
                if (piece.matrix[b] === 1) {
                    var name = "s" + piece.type;
                    context.drawImage(this.assets.spritesAtlas, this.atlas.sprites[name].x, this.atlas.sprites[name].y, this.atlas.sprites[name].width, this.atlas.sprites[name].height, centerX + (b % piece.size) * pieceTileSize, centerY + Math.floor(b / piece.size) * pieceTileSize, pieceTileSize, pieceTileSize);
                }
            }  
        }
        
        context.font = "130px joystix";
        context.fillStyle = "rgba(255, 0, 0, 255)";
        context.textAlign = "left";
        context.fillText("JSTetris", xOffset + 30, this.board.height * this.board.tileSize - 50);
        
        context.font = "90px joystix";
        context.fillStyle = "rgba(30, 144, 255, 255)";
        context.fillText("time", xOffset + size + 10, 55);
        
        context.fillStyle = "rgba(176, 224, 230, 255)";
        var minutes = Math.floor(this.board.time / 60);
        var seconds = Math.floor(this.board.time % 60);
        var hours = Math.floor(minutes / 60);
        var minutesLeft = minutes % 60;
        context.font = "80px joystix";
        context.fillText((hours < 10 ? "0" + hours : hours) + ":" + (minutesLeft < 10 ? "0" + minutesLeft : minutesLeft) + ":" + (seconds < 10 ? "0" + seconds : seconds), xOffset + size + 10, 105);
        context.font = "90px joystix";
        context.fillStyle = "rgba(255, 255, 0, 255)";
        context.fillText("lines", xOffset + size + 10, 105 * 2);
        context.fillStyle = "rgba(255, 250, 205, 255)";
        context.fillText(this.board.lines, xOffset + size + 10, 105 * 2.5);
        
        context.fillStyle = "rgba(255, 20, 147, 255)";
        context.fillText("speed", xOffset + size + 10, 105 * 3.5);
        context.fillStyle = "rgba(255, 105, 180, 255)";
        context.fillText(this.board.getCurrentSpeed() + "x", xOffset + size + 10, 105 * 4);
    }
    
    onMouseDown(evt) {
        var rect = this.canvas.getBoundingClientRect();
        var x = evt.clientX - rect.left;
        var y = evt.clientY - rect.top;
        if (this.startButton.collide(x, y)) {
            this.startButton.visible = false;
            this.startGame = true;
            this.board.reset();
            this.music = this.assets.playAudio(this.assets.tetris, true, 0.5);
        }
    }
    
    onMouseUp(evt) {
        console.log(evt);
    }
    
    onKeyDown(event) {
        
        if (!this.startGame) {
            return;
        }
        
        var evt = event || window.event;      
        if (evt.keyCode === 37) {
            this.board.left(true);
        }
        if (evt.keyCode === 39) {
            this.board.right(true);
        }
        if (evt.keyCode === 38) {
            this.board.rotate(true);
        }
        if (evt.keyCode === 40) {
            this.board.down(true);
        }
    }
    
    onKeyUp(event) {
        
        if (!this.startGame) {
            return;
        }
        
        var evt = event || window.event;
        if (evt.keyCode === 37) {
            this.board.left(false);
        }
        if (evt.keyCode === 39) {
            this.board.right(false);
        }
        if (evt.keyCode === 38) {
            this.board.rotate(false);
        }
        if (evt.keyCode === 40) {
            this.board.down(false);
        }
    }
}


