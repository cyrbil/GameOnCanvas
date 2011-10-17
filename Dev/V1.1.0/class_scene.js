function scene(){
    scene.prototype.elems = new Array();
    scene.prototype.count = 0;
    scene.prototype.id = "scene-"+Math.floor(Math.random()*10000000000);
    // method call every frame, it's for multiples frames things like smooth move
    // it update position/size ... etc.
    scene.prototype.tick = function(){
        for(var i = 0; i < this.elems.length;i++){
            this.elems[i].tick();
        }
    }
    
    // just draw on canvas
    scene.prototype.draw = function(ctx){
        for(var i = 0; i < this.elems.length;i++){
            this.elems[i].draw(ctx);
        }
    }
    
    scene.prototype.add = function(obj){
        this.count++;
        this.elems.push(obj);
    }
    scene.prototype.del = function(obj){
        alert("Exception: NotImplementedYet");
    }
}