/*
    GameOnCanvas is under http://www.cecill.info/licences/Licence_CeCILL_V2-en.txt licence
    Copyright Demingeon Cyril 2011
    https://github.com/cyrbil/GameOnCanvas
*/

var GOC = {
    game: function(p1,p2,p3,p4){
        console.log("Log: Game Instancied");
        
        // constructor
        GOC.game.prototype.construct = function(obj){
            console.log("Log: Constructor: Params to parse:",obj);
            for(var i in obj){
                switch(i){
                    case "div":          if(typeof(obj[i]) == "HTMLDivElement") this.div          = obj[i]; break;
                    case "fps":          if(1*obj[i] > 0)                       this.fps          = obj[i]; break;
                    case "ressources":   if(typeof(obj[i]) == "object")         this.ressources   = obj[i]; break;
                    case "r":            if(typeof(obj[i]) == "object")         this.ressources   = obj[i]; break; // alias
                    case "canvas_inner": if(typeof(obj[i]) == "string")         this.canvas_inner = obj[i]; break;
                    case "scene":        if(typeof(obj[i]) == "object")         this.scene        = obj[i]; break;
                    case "debug":        if(typeof(obj[i]) == "boolean")        this.debug        = obj[i]; break;
                    case "main":         if(typeof(obj[i]) == "function")       this.main         = obj[i]; break;
                    case "antialiasing": if(1*obj[i] > 1)                       this.antialiasing = obj[i]; break;
                    case "a":            if(1*obj[i] > 1)                       this.antialiasing = obj[i]; break; // alias
                    case "canvas_rect":  if(typeof(obj[i]) == "object")         this.canvas_rect  = obj[i]; break;
                    case "r":            if(typeof(obj[i]) == "object")         this.canvas_rect  = obj[i]; break; // alias
                    case "ie_support":   if(typeof(obj[i]) == "boolean")        this.ie_support   = obj[i]; break;
                }
            }
            if(obj.w*1>0||obj.width*1>0)
                this.canvas_rect.width = obj.w || obj.width;
            if(obj.h*1>0||obj.height*1>0)
                this.canvas_rect.height = obj.h || obj.height;
        }
        
        
         // public vars goes here
        GOC.game.prototype.canvas_rect  = new GOC.rectangle(0,0,600,400); // dimensions of canvas
        GOC.game.prototype.antialiasing = 1;                          // no antialiasing
        GOC.game.prototype.div          = null; // div that contain game data + canvas
        GOC.game.prototype.canvas       = null; // LE canvas
        GOC.game.prototype.ctx          = null; // context of canvas
        GOC.game.prototype.fps          = 30;   // number of frame per seconds targeted
        GOC.game.prototype.ressources   = ({}); // object of string to load before launch main loop (preload) 
        GOC.game.prototype.canvas_inner = "Your web browser is to old to let you play. Please update or change it."; // between <canvas> balises
        GOC.game.prototype.scene        = null;  // scene that will be printed once game launch
        GOC.game.prototype.debug        = false; // display debug corner
        GOC.game.prototype.ie_support   = false; // use excanvas to make canvas work on ie
        
        
        // parse params and update default params, yeah that's a lot of various parameters ...
        if(p1.constructor.name == "rectangle"){
            this.canvas_rect = p1;
            if((typeof(p2) == "number" || typeof(p2) == "string") && 1*p2 > 1)
                this.antialiasing = p2;
                if(typeof(p3) == "object")
                    this.construct(p3);
            else if(typeof(p2) == "object")
                this.construct(p2);
        }else if((typeof(p1) == "number"|| typeof(p1) == "string") || (typeof(p2) == "number"|| typeof(p2) == "string")){
            this.canvas_rect.width  = (p1*1>0)?p1*1:this.canvas_rect.width;  // number cast
            this.canvas_rect.height = (p2*1>0)?p2*1:this.canvas_rect.height; // number cast
            if((typeof(p3) == "number" || typeof(p3) == "string") && 1*p3 > 1)
                this.antialiasing = p3;
                if(typeof(p4)  == "object")
                    this.construct(p4);
            else if(typeof(p3) == "object")
                this.construct(p3);
        }else if(typeof(p1) == "object")
            this.construct(p1);
        else
            console.log("Warn: No parameters precised, will use default parameters.");
        
        
        
        
        // 'Read-only' vars goes here
        GOC.game.prototype.keyboard     = {shift:false,ctrl:false,alt:false,altG:false,code:null,ascii:null};
        GOC.game.prototype.mouse        = {left:false,middle:false,right:false,x:0,y:0};
        GOC.game.prototype.debug_fps    = 0;
        GOC.game.prototype.array_fps    = [];
        GOC.game.prototype.width        = 0;
        GOC.game.prototype.height       = 0;
        GOC.game.prototype.version      = "V1.1.0 Release";
        
        
        // methods goes here
        
        // game function, user define
        GOC.game.prototype.main = function(){};
        
        // create the canvas
        GOC.game.prototype.init = function(){
        
            // search game div
            if(typeof(this.div) != "HTMLDivElement"){
                console.log("Warn: No game div precised, will use body instead.\nHint: Set game.div to correct div.");
                this.div = document.body;
                if(this.div == null) // actually it's not possible ... but test in case
                    return console.log("Error: <body> not found !\nHint: Create basic html page with body balise or set game.div to correct div.");
            }
            
            
            if(!(this.canvas_rect.width > 0)) this.canvas_rect.width = 600;
            if(!(this.canvas_rect.height > 0)) this.canvas_rect.height = 400;
            // making canvas in div
            console.log("Log: Making canvas with dim: "+this.canvas_rect.width+"x"+this.canvas_rect.height+", antialiasing: "+this.antialiasing)
            canvas = document.createElement('canvas');
            // id is this name or a random name (avoid multiple unamed div conflict)
            var id = 'GOC-'+((typeof(this.name) == "string")?this.name:Math.floor(Math.random()*9999999+1000000));
            canvas.setAttribute('id',id);
            // canvas size are bigger than real size if antialiasing is on
            canvas.setAttribute('width',  (this.canvas_rect.width  * this.antialiasing)+'px');
            canvas.setAttribute('height', (this.canvas_rect.height * this.antialiasing)+'px');
            this.width  = this.canvas_rect.width  * this.antialiasing;
            this.height = this.canvas_rect.height * this.antialiasing;
            // displayed size
            canvas.style.width  = this.canvas_rect.width + "px";
            canvas.style.height = this.canvas_rect.height+ "px";
            canvas.innerHTML = this.canvas_inner;
            // add to div
            this.div.appendChild(canvas);
            this.canvas = document.getElementById(id);
            
            // catch events
            var that = this; // mandatory because this is overwritted by event caller
            window.onkeydown        = function(e){that.events(e,that);};
            this.canvas.onmousemove = function(e){that.events(e,that);};
            this.canvas.onmousedown = function(e){that.events(e,that);};
            this.canvas.onmouseup   = function(e){that.events(e,that);};
            
            // if we want ie support and browser is ie (experimental)
            if(this.ie_support && /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)){
                var head = document.getElementsByTagName("head")[0];         
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'http://explorercanvas.googlecode.com/svn/trunk/excanvas.js';
                head.appendChild(script);
            }
            // get context
            if(!this.canvas.getContext) 
                return console.log("Error: This web browser does not support canvas.");
            this.ctx = this.canvas.getContext('2d');
            
            this.draw_credit();        
            
            // see if there is ressources to load before start
            if(this.ressources !== null && typeof(this.ressources) == "object"){
                for (var tmp in this.ressources) { // look if not empty
                    return this.load();
                }
            }
            
            // start game loop youhou
            console.log("Log: Start ticker");
            this.ticker();
        }
        
        
        // load ressources then launch game loop
        GOC.game.prototype.load = function(timeout){
            if(typeof(this.ressources) != "object")
                return console.log("Warn: Bad ressources param, skipping load");
            if(timeout == null) timeout = 2000; // timeout is 2 seconds
            
            var object = {};  // object of images
            var complete = 0; // object fully loaded
            var object_size = 0;
            // methods
            // wait for ressource to load or die if timeout.
            this.load.loaded = function(date,obj,that){
                if((date + timeout < new Date().getTime()) || obj.img.complete){ // if img loaded or timeout
                    console.log("Element:",obj," is loaded ? ",(obj.img.width>0));
                    that.load.check(date,that);
                    return (obj.loaded = (obj.img.width>0)); //
                }
                setTimeout(function(date,obj,that){that.load.loaded(date,obj,that);},50,date,obj,that); // test see if this is game.load
            }
            
            // check objects
            this.load.check = function(date,that){
                complete++; // inc compteur
                // look if all loaded or timeout
                if(complete == object_size || (date + timeout < new Date().getTime())){
                    for (i in object) {
                        if(object[i].loaded != true)
                            console.log("Warn: Element '"+i+"' can not be loaded in time.",object[i]);
                    }
                    // start game loop youhou (bis)
                    console.log("Log: Start ticker");
                    that.ticker();
                }
            }
            
            // okay code start here
            // for each ressource, try to load them
            for (var i in this.ressources) {
                if(typeof(this.ressources[i]) != "string"){ // skipping if not a string
                    console.log("Warn: Ressource '"+i+"' is not an url string:", this.ressources[i]);
                }else{
                    // load ressource
                    object[i] = new GOC.elem(this.ressources[i]);
                    object_size++;
                    this.load.loaded(new Date().getTime(), object[i],this);// test see if this is game.load
                }
            }
            this.load.check(); // start cheking here (case no usable ressources, script must continue)
            
        }
        
        
        // game loop, it tick every frame
        GOC.game.prototype.ticker = function(tick, date, frames, that){
            if(tick==null||date==null||frames==null) // initial launch
                return this.ticker(new Date().getTime(),new Date().getTime(),0, this);
            if(this.error) return console.error("Error detect, ended game now !"); // if an error will loading
            
            //if tick inf, loop OR if game aren't ready yet (still loading)
            if((new Date().getTime()) - tick < (1000/this.fps))
                //return setTimeout(function(a,t,d,f){a.ticker(t,d,f);}, 1, this, tick, date, frames);// prevent "Maximum call stack size exceeded" error
                return setTimeout(function(){that.ticker(tick, date, frames,that);}, 1);
                
            //else do game runtime
            this.main();    // game operations
            this.display(); // display frame
            this.events();  // reset events
            frames++;
            //if date is bigger than one second, reinitialise
            if((new Date().getTime()) > date + 1000)
            {
                this.debug_fps = frames;
                //return setTimeout(function(a,t,d,f){a.ticker(t,d,f);}, 1, this, new Date().getTime(), new Date().getTime(), 0);
                return setTimeout(function(){that.ticker(new Date().getTime(), new Date().getTime(), 0,that);}, 1);
            }
            // else, tick
            return this.ticker((new Date().getTime()), date, frames,that);
        }
        
        // reset or format events
        GOC.game.prototype.events = function(e,that){ // if no e, reset event
            
            if(e == undefined){
                this.keyboard = {shift:false,ctrl:false,alt:false,altG:false,code:null,ascii:null};
                return;
            }
            
            var e=window.event || e;
            if(e.type=="keydown"){ // if keyboard event
                var c = e.charCode || e.keyCode || null;
                
                that.keyboard = {
                    shift:   e.shiftKey,
                    ctrl:    e.ctrlKey,
                    alt:     e.altKey,
                    altG:    e.altGraphKey,
                    code:    c,
                    ascii:   String.fromCharCode(c)
                };
            }
            else if(e.type == "mousemove" || e.type == "mousedown" || e.type == "mouseup"){
                var x,y;
                if (e.pageX || e.pageY) { 
                  x = e.pageX;
                  y = e.pageY;
                }
                else { 
                  x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
                  y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
                }
                
                if(e.type == "mousedown"){
                     that.mouse = {
                        left:   (e.button == 0),
                        middle: (e.button == 1),
                        right:  (e.button == 2),
                        x:x-canvas.offsetLeft,
                        y:y-canvas.offsetTop
                    };
                }
                else if(e.type == "mouseup"){
                    that.mouse = {
                        left:   (that.mouse.left   && e.button == 0)?false:that.mouse.left,
                        middle: (that.mouse.middle && e.button == 1)?false:that.mouse.middle,
                        right:  (that.mouse.right  && e.button == 2)?false:that.mouse.right,
                        x:x-canvas.offsetLeft,
                        y:y-canvas.offsetTop
                    };
                }
            }
        }
        
        
        // manage current scene then display
        GOC.game.prototype.display = function(){
            this.ctx.save(); // save ctx
            var w = this.canvas_rect.width  * this.antialiasing;
            var h = this.canvas_rect.height  * this.antialiasing;
            
            // erase canvas
            this.ctx.clearRect (0, 0, w, h);
            this.draw_credit();
            // call show() for each element in current scene
            //if(this.scene.constructor.name == "scene"){ // TO FIX
                this.scene.tick();
                this.scene.draw(this.ctx);
            //}
            
            // if debug is on, show debug infos
            if(this.debug){
                this.array_fps.push(this.debug_fps);
                // draw a half dark rect
                this.ctx.fillStyle = "rgba(80,80,80,0.5)";
                this.ctx.fillRect (w - 200, 0, h, 100);
                // draw fps as diagram bar
                while(this.array_fps.length > 50)//erase over flow
                    this.array_fps.shift();
                this.ctx.fillStyle = "rgba(0,255,0,0.8)"; 
                for(var i = 0; i < this.array_fps.length; i++){
                    this.ctx.fillRect(
                        w - this.array_fps.length * 4 + i*4,
                        55-30*this.array_fps[i]/this.fps-3, 
                        4, 
                        30*this.array_fps[i]/this.fps+3);
                }
                // write debug infos
                this.ctx.font = "14pt Verdana";
                this.ctx.fillStyle = "rgba(255,255,255,0.8)";
                this.ctx.fillText("Debug:", w - 196, 17);
                this.ctx.fillText(this.debug_fps+"/"+this.fps+" FPS", w - 50 - 13*((""+this.debug_fps).length+(""+this.fps).length), 17);
                this.ctx.fillText(
                    "KS-"+((this.keyboard.shift)?"T":"F")+
                    ",A-"+((this.keyboard.alt)?"T":"F")+
                    ",C-"+((this.keyboard.ctrl)?"T":"F")+
                    ",\""+((this.keyboard.code!=null)?this.keyboard.code:"")+"\"", w - 196, 72);
                this.ctx.fillText(
                    "L-"+((this.mouse.left)?"T":"F")+
                    ",M-"+((this.mouse.middle)?"T":"F")+
                    ",R-"+((this.mouse.right)?"T":"F")+
                    " "+this.mouse.x+"x"+this.mouse.y, w - 196, 92);
            }
            // this.error=true;
            this.ctx.restore();
        }
        
        
        // draw credit ...
        GOC.game.prototype.draw_credit = function(){
            this.ctx.fillStyle = "rgba(0,0,0,1)";
            this.ctx.fillRect(0,0, this.canvas_rect.width  * this.antialiasing, this.canvas_rect.height * this.antialiasing);
            this.ctx.font = "14pt Verdana";
            this.ctx.fillStyle = "#CCC";
            this.ctx.fillText("GameOnCanvas", 15, 30);
            this.ctx.fillText(this.version, 15, 55);
            this.ctx.fillText("Copyright Cyrbil 2011", 15, 80);
        }
        
        
        var that = this;
        window.onload = function(){ // wait for all script loaded before launch
            that.init(); // this refer to window, so use that ...
        }
    },

    rectangle: function(x,y,w,h){ // simple object to manage coord
        GOC.rectangle.prototype.width  = (w==undefined)?0:w;
        GOC.rectangle.prototype.height = (h==undefined)?0:h;
        GOC.rectangle.prototype.left   = (x==undefined)?0:x;
        GOC.rectangle.prototype.top    = (y==undefined)?0:y;
        GOC.rectangle.prototype.w = function(){return this.width;}
        GOC.rectangle.prototype.h = function(){return this.height;}
        GOC.rectangle.prototype.x = function(){return this.left;}
        GOC.rectangle.prototype.y = function(){return this.top;}
    },
    
    elem: function(from){
        // load data depend of from
        GOC.elem.prototype.img = {complete:true};
        GOC.elem.prototype.loaded = false;
        GOC.elem.prototype.x = 0;
        GOC.elem.prototype.y = 0;
        GOC.elem.prototype.w = 0;
        GOC.elem.prototype.y = 0;
        GOC.elem.prototype.speed = 0;
        GOC.elem.prototype.direction = 0;
        GOC.elem.prototype.id = "elem-"+Math.floor(Math.random()*10000000000000000);
        
        // method call every frame, it's for multiples frames things like smooth move
        // it update position/size ... etc.
        GOC.elem.prototype.tick = function(){
            //console.log("tick(s:",this.speed,",d:",this.direction,") = {x:",Math.cos(this.direction*Math.PI/180),",y:",Math.sin(this.direction*Math.PI/180),"}");
            this.x += Math.cos(this.direction*Math.PI/180)*this.speed;
            this.y += Math.sin(this.direction*Math.PI/180)*this.speed;
        }
        
        // just draw on canvas
        GOC.elem.prototype.draw = function(ctx){
            
        }
    },
    
    scene: function(){
        GOC.scene.prototype.elems = new Array();
        GOC.scene.prototype.count = 0;
        GOC.scene.prototype.id = "scene-"+Math.floor(Math.random()*10000000000);
        // method call every frame, it's for multiples frames things like smooth move
        // it update position/size ... etc.
        GOC.scene.prototype.tick = function(){
            for(var i = 0; i < this.elems.length;i++){
                this.elems[i].tick();
            }
        }
        
        // just draw on canvas
        GOC.scene.prototype.draw = function(ctx){
            for(var i = 0; i < this.elems.length;i++){
                this.elems[i].draw(ctx);
            }
        }
        
        GOC.scene.prototype.add = function(obj){
            this.count++;
            this.elems.push(obj);
        }
        GOC.scene.prototype.del = function(obj){
            alert("Exception: NotImplementedYet");
        }
    }
}