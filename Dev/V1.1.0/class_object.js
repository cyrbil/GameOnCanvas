function elem(from){
    // load data depend of from
    
    
    
    elem.prototype.img = {complete:true};
    elem.prototype.loaded = false;
    elem.prototype.x = 0;
    elem.prototype.y = 0;
    elem.prototype.w = 0;
    elem.prototype.y = 0;
    elem.prototype.speed = 0;
    elem.prototype.direction = 0;
    elem.prototype.id = "elem-"+Math.floor(Math.random()*10000000000000000);
    
    // method call every frame, it's for multiples frames things like smooth move
    // it update position/size ... etc.
    elem.prototype.tick = function(){
        //console.log("tick(s:",this.speed,",d:",this.direction,") = {x:",Math.cos(this.direction*Math.PI/180),",y:",Math.sin(this.direction*Math.PI/180),"}");
        this.x += Math.cos(this.direction*Math.PI/180)*this.speed;
        this.y += Math.sin(this.direction*Math.PI/180)*this.speed;
    }
    
    // just draw on canvas
    elem.prototype.draw = function(ctx){
        
    }
}