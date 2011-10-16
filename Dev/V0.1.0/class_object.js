function elem(from){
    // load data depend of from
    
    
    
    elem.prototype.img = {complete:true};
    elem.prototype.loaded = false;
    elem.prototype.rect = new rectangle(0,0,0,0);
    
    
    // method call every frame, it's for multiples frames things like smooth move
    // it update position/size ... etc.
    elem.prototype.tick = function(){
        
    }
    
    // just draw on canvas
    elem.prototype.draw = function(canvas){
        
    }
}