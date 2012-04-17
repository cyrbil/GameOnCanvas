# GameOnCanvas

**GameOnCanvas** (or GOC) is a small, free JavaScript frameword for manipulating
canvas elements to create animations or game for recent navigators. 
It�s fully oriented object and included many kickass functionalities.

The GOC�s main purpose is to go beyond the standard canvas API for browser. 
It improves compatibility and come with many objects that can be draw and 
easily animated.


### Fonctionnalities
This is an exemple file wich as been use during the developpement as a 
model. 

    // create a new game
    // rectangle is an internal class that contains position and size
    var game = new gameOnCanvas(new rectangle(0,0,800,600));
    
    // preload resources, not necessary but speed up next load (in game)
    game.resources = {
	background: "http://www.mywebsite.com/images/backgrounnd.png ",
	ball: "img/ball.jpg"
    }
    
    // create our first scene that just contains the background...
    // we add a new object to the scene, coming from the in game resource �background�
    var gameScene = new scene([
    // preloaded resources are in game�s �resources� object
    new obj(game.resources.background)
    ]);
    // obj can be image, resources or shapes
    
    // display this scene
    game.currentScene = gameScene;
    // currentScene is the scene that will be drawed in the next frame render
    
    // here start the real game code
    // main function is called right before render and display
    game.main = function(){
    // if we click, add a ball at mouse coord
    if(game.mouse.left){ // mouse object contain coord and button� state
    // create new object from the ball image
    var ball = new obj(game.ressources["ball"]);
    ball.x = game.mouse.x; // set coord to current mouse coord
    ball.y = game.mouse.y;
    ball.v = new vector(1, Math.random()*360); // random direction ... speed 1
    // add an event called for each frame (because balls are always moving in our example)
    ball.onMove = function(){
    if(this.touch(gameScene[0]))// if the ball touch one background border
    this.vector.direction += ((this.vector.direction%180>90)?280:90)%360; // reverse direction
    }
    // finally // add the new ball object to the current animated scene.
    game.currentScene.add(ball);
    }
    };