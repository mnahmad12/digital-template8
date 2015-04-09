window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    /*
		Game Overview:
			Theme: Stranger's Cell Phone
			...One day you are walking to school and discover a phone on the sidewalk,
				just when you are about to move on it rings...
				
				.."Hello George, a zombie outbreak is happening now in your city, you have to find the vial
					of cure, they are coming George, hurry! ..
					
					..what do you mean..who are you..."1 hour George, hurry they are on the way"
	
			Game details: 
				1) You start in the middle of the map and can shoot
				2) The map is dark and you can't see around, you have a flashlight that lights up an area
				3) There are zombies (in red) that are moving around the map, if they run into you, you
					lose a life point
				4) Find the zombies, kill them
				5) There is a vial somewhere on the map, if you find it you cure the city if you dont (within 2 min)
					you die, everyone becomes a zombie..
	
	*/
	
	var P2Game = {};
	
	P2Game.StateA = function (game) {

		
		
	};
	
	P2Game.StateA.prototype = 
	{
		//PRELOAD
		preload: function()
		{
			
			
		},
		

		update: function()
		{
					
		},
		
		
		
		
		
		//Go To State B
		gotoStateB: function () 
		{

			this.state.start('StateB');

		}
	
	}
	
	
	
	
	
	

    //STATE B
	
	P2Game.StateB = function(game)
		{
			
			this.keys;
			this.text;
			this.style;
			this.people;
			this.rect;
			this.beds;
			this.text2;
			this.bedXCord=70;
			this.bedYCord=400;
			this.xCord=50;
			this.yCord=100;
			this.bedsFull=false;
			this.patientArray=[];
			this.bedText;
			this.bedArray=[];
			this.timer;
			this.colorArray=[0x00CC00,0xFFFF00,0xFF6600,0xFF0000]
		}
	
	
	
	P2Game.StateB.prototype=
	{
		preload: function() 
		{
        //pre-loading the zombies
			this.load.spritesheet('people', 'assets/block.png');
			this.load.spritesheet('beds','assets/bed.png');
			this.load.spritesheet('redBed','assets/redBed.png');
			this.load.spritesheet('orangeBed','assets/orangeBed.png');
			this.load.spritesheet('yellowBed','assets/yellowBed.png');
			this.load.spritesheet('greenBed','assets/greenBed.png');
			this.load.spritesheet('rect','assets/rect.png');
			this.load.spritesheet('bedText','assets/bedText.png')
			this.game.stage.backgroundColor = '#FFFFFF';
		},
    

	
		create: function() 
		{
			
		//world boundary
			this.world.setBounds(0,0,800,600);
			
		//starting physics:
			this.game.physics.startSystem(Phaser.Physics.ARCADE);
		
		//creating the patients
			this.people = this.add.group();
			this.people.enableBody=true;
			//&beds
			this.beds = this.add.group();
			
		//creating 10 patients that show up in a random fashion	
		
		
			this.people.createMultiple(10,"people",0,false);
			
			this.beds.createMultiple(4,'beds',0,false)
			this.game.physics.enable(this.people,Phaser.Physics.ARCADE);
		
		//spawning patients			
			this.resurrect();
			
			//placing 4 beds:
			this.placeBeds();
			this.placeBeds();
			this.placeBeds();
			this.placeBeds();
			
			
			//window.alert('adfd');
			this.game.time.events.repeat(Phaser.Timer.SECOND*this.rnd.integerInRange(5, 9),10, this.resurrect,this );
			
		//er rect
			this.rect = this.add.sprite(390, 370, 'rect');
			this.game.physics.enable(this.rect,Phaser.Physics.ARCADE);
			this.rect.enableBody=true;
			//rect.scale.setTo(2.0, 3.0);
	
			this.bedText=this.add.sprite(100,480,'bedText');
		// Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
			this.style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
			this.text = this.add.text( this.world.centerX, 15, "Welcome to the ER.", this.style );
	
			this.text.anchor.setTo( 0.5, 0.0 );
		
			
		
			this.keys = this.input.keyboard.createCursorKeys();
		
			this.timer = this.game.time.create(this.game);
			
		},
	
		Bed: function(fullStatus,x,y)
		{
			var fullStat;
			this.fullStat=fullStatus;
			var bedX,bedY;
			this.bedX=x;
			this.bedY=y;
		},
		
		Patient: function(colorStatus)
		{
			var status;
			this.status=colorStatus;
			
			//colorStatus: 0=>Green, 1=> Yellow, 2=> Orange, 3=>Red
			var timer;
			
		},
	
		placeBeds: function()
		{
			var bedItem = this.beds.getFirstDead();
			if(bedItem)
			{
				bedItem.reset(this.bedXCord,this.bedYCord);
				bedItem=new this.Bed(false,this.bedXCord,this.bedYCord);
				this.bedArray.push(bedItem);
			}
			
			this.bedXCord=this.bedXCord+50;
		},
		
		changeBedColor: function(bed,color,bedNum)
		{
			
			if(color==3)
			{
				//window.alert(bed.bedX);
				this.add.sprite(bed.bedX,bed.bedY,'redBed');
				
				var bedItem=new this.Bed(true,bed.bedXCord,bed.bedYCord);
				this.bedArray[bedNum]=bedItem
				
				this.timer.add(Phaser.Timer.SECOND*30,this.clearBed,this,bedNum,bed);
				this.timer.start();
			}
			else if(color==2)
			{
				//window.alert(bed.bedX);
				this.add.sprite(bed.bedX,bed.bedY,'orangeBed');
				
				var bedItem=new this.Bed(true,bed.bedXCord,bed.bedYCord);
				this.bedArray[bedNum]=bedItem
				
				this.timer.add(Phaser.Timer.SECOND*20,this.clearBed,this,bedNum,bed);
				this.timer.start();
			}
			else if(color==1)
			{
				//window.alert(bed.bedX);
				this.add.sprite(bed.bedX,bed.bedY,'yellowBed');
				
				var bedItem=new this.Bed(true,bed.bedXCord,bed.bedYCord);
				this.bedArray[bedNum]=bedItem
				
				this.timer.add(Phaser.Timer.SECOND*15,this.clearBed,this,bedNum,bed);
				this.timer.start();
			}
			else if(color==0)
			{
				//window.alert(bed.bedX);
				this.add.sprite(bed.bedX,bed.bedY,'greenBed');
				
				var bedItem=new this.Bed(true,bed.bedXCord,bed.bedYCord);
				this.bedArray[bedNum]=bedItem
				
				this.timer.add(Phaser.Timer.SECOND*10,this.clearBed,this,bedNum,bed);
				this.timer.start();
			}
		},
		
		clearBed: function(bedNum,bed)
		{
			
			this.add.sprite(bed.bedX,bed.bedY,'beds');
			
			
			var bedItem=new this.Bed(false,bed.bedX,bed.bedY);
			this.bedArray[bedNum]=bedItem
		},
		emptyBed: function()
		{
			var i=0;
			for(i;i<this.bedArray.length;i++)
			{
				if(this.bedArray[i].fullStat==false)
				{
					return i;
				}
			}
			return false;
		},
		
		resurrect: function()
		{
			
			
			this.timer = this.game.time.create(this.game);
		 //Get the first not-currently spawned item
			var item = this.people.getFirstDead();
			
			
			
			if (item)
			{
				if(this.xCord>700)
				{
					this.yCord=this.yCord+75;
					this.xCord=55;
				}
				//And bring it back to life
				//window.alert(this.xCord);
				item.reset(this.xCord+75,this.yCord);
				this.physics.arcade.enable(item);
				item.inputEnabled=true;
				item.input.enableDrag();
				var colorStatus=this.rnd.integerInRange(0,3);
				item.tint=this.colorArray[colorStatus];
				item.exists=true;
				//window.alert(this.people.getChildIndex(item));
				item.events.onDragStop.add(this.collisionHandler,this);
				
				item=new this.Patient(colorStatus);
				this.patientArray.push(item);
				
				this.xCord=this.xCord+100;
				
				if(colorStatus==3)
				{
					//window.alert('1');
					this.timer.add(Phaser.Timer.SECOND*15,this.diePatient,this,item);
					this.timer.start();
				}
				
				if(colorStatus==2)
				{
					this.timer.add(Phaser.Timer.SECOND*20,this.diePatient,this,item);
					this.timer.start();
				}
				
				if(colorStatus==1)
				{
					this.timer.add(Phaser.Timer.SECOND*30,this.diePatient,this,item);
					this.timer.start();
				}
				
				if(colorStatus==0)
				{
					this.timer.add(Phaser.Timer.SECOND*40,this.diePatient,this,item);
					this.timer.start();
				}
				
			}
			//window.alert(this.people.getChildIndex(this.people.cursor));
			
		},
	
		diePatient: function(patient,pointer)
		{
			//window.alert(this.people.getChildIndex(patient));
			patient.exists=false;
			patient.visible=false;
		},
		
		update: function()
		{
			
			
		
		},
		
		collisionHandler (item, pointer) 
		{
			
			
			if(this.physics.arcade.overlap(this.rect,item,null,null,this))
				{
					var bedNum=this.emptyBed();
					//window.alert(bedNum);
					if(Number.isInteger(bedNum)!=false)
					{
						//window.alert(bedNum);
						//window.alert(this.patientArray[this.people.getChildIndex(item)].status);
						this.changeBedColor(this.bedArray[bedNum],this.patientArray[this.people.getChildIndex(item)].status,bedNum);
						
						item.exists=false;
						
					}
				}
			

		},

		
		goToStateC: function () 
		{

			this.state.start('StateC');

		},
		
		goToStateD: function () 
		{

			this.state.start('StateD');

		}
	}
	
		P2Game.StateC = function (game) {

		this.message;
		this.cursors;
		this.logo;
		this.text;
		this.style;
		
	};
	
	//STATE C: END GAME STATE
	
	P2Game.StateC.prototype = 
	{
		
		
		 gotoStateB: function () 
		{

			this.state.start('StateB');

		},
		
		
	
		
		update: function()
		{
			
			this.cursors = this.input.keyboard.createCursorKeys();
			
			this.style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
			this.text = this.add.text( this.world.centerX, 15, "You Lose! Want to Play Again? Press The Left Arrow!", this.style );
			this.text.anchor.setTo( 0.5, 0.0 );
			
			if (this.cursors.left.isDown)
			{
				this.gotoStateB();
			}
		
		}
	
	}
	
	P2Game.StateD=function(game){
		this.cursors;
		this.style;
		this.text;
	}
	
	P2Game.StateD.prototype=
	{
		gotoStateA: function () 
		{

			this.state.start('StateA');

		},
		
		update: function()
		{
			
			this.cursors = this.input.keyboard.createCursorKeys();
			
			this.style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
			this.text = this.add.text( this.world.centerX, 15, "You Win!\nTo play the next level please\nSend your credit card info to mahmad15@gmu.edu\n(To Restart press the left arrow)", this.style );
			this.text.anchor.setTo( 0.5, 0.0 );
			
			if (this.cursors.left.isDown)
			{
				this.gotoStateA();
			}
			
			
		}
	
	}
	
	var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game' );
    
	//game.state.add('StateA', P2Game.StateA);
	game.state.add('StateB', P2Game.StateB);
	game.state.add('StateC', P2Game.StateC);
	game.state.add('StateD', P2Game.StateD);
	game.state.start('StateB');
    
    
 };
