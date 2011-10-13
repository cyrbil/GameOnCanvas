function game(rectangle, antialiasing) {
	console.info("Log: Game Instancied");
	var rectangle;
	var loaded = false;
	
	game.prototype.init = function(dim, antialiasing){
		if(dim != undefined && dim.x != undefined && dim.y != undefined && dim.w != undefined && dim.h != undefined)
			this.rectangle = dim;
		else
			return console.error("Error: No dimensions precised.\nHint: game(new rectangle(x,y,w,h);");
		
		console.info("Log: Making canvas: "+dim.w+"x"+dim.h);
		base = this; // save this, because onload overwrite this.
		window.onload = function(){
			if(base.div == null){
				// search game div.
				base.div = document.getElementById("game");
				if(base.div == null){
					console.warn("Alert: Could not found div 'game'.\nUsing body instead");
					base.div = document.body;
					if(base.div == null){
						return console.error("Error: <body> not found !\nHint: Create basic html page with body and div 'game' balises or set game.div to correct div.");
					}
				}
			}
			
			// create canvas
			base.div.innerHTML='<!--[if lt IE 9]><script type="text/javascript" src="js/excanvas.js"></script><![endif]-->';
			
			canvas = document.createElement('canvas');
			
			canvas.setAttribute('id','canvas');
			canvas.setAttribute('width', dim.w+'px');
			canvas.setAttribute('height', dim.h+'px');
			canvas.style.position = 'relative';
			canvas.style.left = dim.x;
			canvas.style.top = dim.y;
			canvas.innerHTML = "Votre navigateur ne supporte pas HTML5, veuillez le mettre à jour ou en changer.";
			if(antialiasing>1){
				canvas.style.width = (dim.w/antialiasing)+'px';
				canvas.style.height = (dim.h/antialiasing)+'px';
			}
			
			base.div.appendChild(canvas);
			base.canvas = document.getElementById('canvas');
			
			base.ctx = base.canvas.getContext('2d');
			base.ctx.fillRect(0,0, dim.w, dim.h);
			base.ctx.font = "14pt Verdana";
			base.ctx.fillStyle = "#CCC";
			base.ctx.fillText("GameOnCanvas", 15, 30, dim.h);
			base.ctx.fillText("V0.37 Alpha", 15, 55, dim.h);
			base.ctx.fillText("Copyright Cyrbil 2011", 15, 80, dim.h);
			
			console.dir(base.canvas);
			console.dir(base.ctx);
			if(base.ressource!=false ) { base.ready=true; setTimeout(function(a){a.loading(a.ressources);}, 5, base);}
			else setTimeout(function(a){a.loop();}, 5, base);
		}
	};
	
	game.prototype.loading = function(components,timeout){
		if(components == false)
			return console.info("No ressources to load");
		console.log("Loading ressources");
		if(typeof components != "object")
			return console.error("Ressources are not an objects");
		this.ctx.font = "11pt Verdana";
		this.ctx.fillStyle = "#CCC";
		this.ctx.fillText("Loading ...", 50, 120);
		console.log(components);
		var size=0;
		for (key in components) {
			this.ctx.fillStyle = "#CCC";
			this.ctx.fillText("_ "+key+" ... ", 60, 140+size*15);
			
			this.ressources[key] = new ressource(components[key]);
			size++;
		}
		
		var base = this; var loadStart = new Date().getTime();
		var loader = window.setInterval(function(){
				var i = 0; var loaded=0;
				for (key in components) {
					if (base.ressources[key].loaded) {
						loaded++;
						base.ctx.fillStyle = "#0C0";
						base.ctx.fillText("OK !", 350, 140+i*15);
					} 
					i++;
				}
				if (loaded == size){
					console.log("Load complete :D !");
					loadEnd();
				}
			}
		, 25);
		
		loadEnd = function(){
			clearInterval(loader); // stop loading
			clearTimeout(loadEndTimeout);// stop loader timeout
			var loaded = 0; var i = 0;
			for (key in components){
				if (base.ressources[key].loaded)
					loaded++;
				else {
					base.ctx.fillStyle = "#C00";
					base.ctx.fillText("FAIL !", 350, 140+i*15);
					console.error("Fail to load \""+key+"\"",base.ressources[key]);
				}
				i++;
			}
			
			if(loaded != size){
				base.error=1;
				console.error("All ressources can not be loaded !");
				base.ctx.fillStyle = "#C00";
				base.ctx.fillText("All ressources can not be loaded ! ☹", 100, 150+(size+1)*15);
			}else{
				base.ctx.fillStyle = "#0C0";
				base.ctx.fillText("All ressources has been loaded ! ☺", 100, 150+(size+1)*15);
				base.ready = true;
				base.loop();
			}
		}
		loadEndTimeout = window.setTimeout(loadEnd, (timeout!=null)?timeout:500 * size + 100);
	}
	
	game.prototype.loop = function(tick, date, frames){
		if(tick==null||date==null||frames==null)
			return this.loop(new Date().getTime(),new Date().getTime(),0);
		if(this.error) {console.error("Error detect, ended game now !"); return;} // if an error will loading
		
		//if tick inf, loop OR if game aren't ready yet (still loading)
		if((new Date().getTime()) - tick < (1000/document.getElementById("fps").value) || !this.ready)
			return setTimeout(function(a,t,d,f){a.loop(t,d,f);}, 1, this, tick, date, frames);// prevent "Maximum call stack size exceeded" error
		
		//else do game runtime
		this.events();  // manage events
		this.main();    // game operations
		this.display(); // display frame
		frames++;
		//if date is bigger than one second, reinitialise
		if((new Date().getTime()) > date + 1000)
		{
			this.fps = frames;
			return setTimeout(function(a,t,d,f){a.loop(t,d,f);}, 1, this, new Date().getTime(), new Date().getTime(), 0);
		}
		// else, tick
		return this.loop((new Date().getTime()), date, frames);
	}
	
	game.prototype.events = function(){
		
	}
	
	game.prototype.display = function(){
		if(this.debug == true){
			game.ctx.fillStyle = "#000";
			game.ctx.fillRect (++i%100 + game.rectangle.w - 100,0,5,50);
			game.ctx.fillStyle = "#488";
			game.ctx.fillRect (++i%100 + game.rectangle.w - 100,50-(game.fps+3)/3,5,(game.fps+3)/3);
			game.ctx.fillStyle = "#000";
			game.ctx.fillRect (game.rectangle.w - 66, 0, 64, 18);
			game.ctx.fillStyle = "#FFF";
			game.ctx.fillText(game.fps+" FPS", game.rectangle.w - 65, 15);
		}
	}
	
	//constructeur
	game.prototype.rectangle = rectangle;
	game.prototype.div = null;
	game.prototype.canvas = null;
	game.prototype.ctx = null;
	game.prototype.ready = false;
	game.prototype.main = null
	game.prototype.ressources = false;
	game.prototype.fps = 0;
	game.prototype.currentScene = new scene();
	if(rectangle != undefined && rectangle.x != undefined && rectangle.y != undefined && rectangle.w != undefined && rectangle.h != undefined)
		this.init(rectangle,antialiasing);
}

function rectangle(x,y,w,h){
	this.width = w;scene.prototype.add
	this.height = h;
	this.left = x;
	this.top = y;
	this.w = w;
	this.h = h;
	this.x = x;
	this.y = y;
}

function ressource(url,timeout){
	this.url = url;
	this.img = new Image();
	this.img.src = url;
	this.rect = new rectangle(0,0,this.img.width,this.img.height);
	var loadingStartDate = new Date().getTime();
	ressource.prototype.load = function(date,img,base){
		if((date + 500 < new Date().getTime()) || img.complete){
			return (base.loaded = (img.width>0));
		}
		 setTimeout(function(date,img,base){base.load(date,img,base);},5,date,img,base);
	};
	this.load(new Date().getTime(), this.img, this);// verifie img can be loaded
}

function obj(from){ // image or ressource
	obj.prototype.draw = function(rect){
		console.error("Error: No draw method for object: ",this);
	}
	obj.prototype.move = function(x,y){
		this.rect.x = x;
		this.rect.y = y;
	}
	obj.prototype.size = function(w,h){
		this.rect.w = w;
		this.rect.xh = h;
	}
	obj.prototype.crop = function(x,y,w,h){
		
	}
	
	obj.prototype.alpha=1;
	
	obj.prototype.rect = new rectangle(0,0,0,0);
	
	obj.prototype.visible = true;
	
	//object => ressource (.prototype.constructor.name to verify)
	//string => img
	
	// assume it's a preloaded ressource
	if(typeof from == "object" && from.prototype.constructeur.name ==  "ressource"){
		obj.prototype.ressource = from;
	}else if(typeof from == "string"){ // assume it's an url
		obj.prototype.ressource = new ressource(from);
	}
	
}

function scene(obj){
	scene.prototype.objects = []; // array of children
	scene.prototype.add = function(res){
		console.log(this);
		this.objects.push(res);
	};
	if (typeof obj == "object")
	{
		this.objects = obj;
	}
	scene.prototype.count = function(){ return this.objects.lenght; };
}
