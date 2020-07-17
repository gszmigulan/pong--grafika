
// vertex shader 
var vertexShaderSrc= ""+
    "attribute vec4 aVertexPosition; \n"+
    "uniform vec3 uMove; \n"+
    "void main( void ) { \n"+
    "  gl_PointSize=16.0; \n"+
    "  gl_Position= aVertexPosition+ vec4( uMove, 0); \n"+
    "} \n";

// fragment shader 
var fragmentShaderSrc= ""+
    "precision mediump float; \n"+ 
    "uniform vec3 uColorRGB; \n"+ 
    "void main( void ) { \n"+
    "  gl_FragColor = vec4( uColorRGB, 1.0 ); \n"+
    "} \n";



var gl; 
var glObjects; 
var html; 
var data; 
var palette_height= 0.3;
var palette_width=0.02;

var dataInit= function(){
    data={};
    data.background=[0,0,0,1];
    data.object1={};
    data.object1.speed=0.0005; 
    data.object1.direction= [1,0,0];
    data.object1.position=[0.95,0,0];
    data.object1.colorRGB=[1.0, 1.0, 1.0];
    data.object1.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data.object1.bufferId );
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0, 0,palette_height, palette_width, 0, palette_width, palette_height]) , gl.STATIC_DRAW ); // load object's shape
    data.object1.floatsPerVertex=2;
    data.object1.NumberOfVertices=4;
    data.object1.drawMode=gl.TRIANGLE_STRIP;

    data.AI={};
    data.AI.speed=0.0005; 
    data.AI.direction= [1,0,0];
    data.AI.position=[-0.95,0,0];
    data.AI.colorRGB=[1.0, 1.0, 1.0];
    data.AI.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data.AI.bufferId );
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0, 0,palette_height, palette_width, 0, palette_width, palette_height]) , gl.STATIC_DRAW ); // load object's shape
    data.AI.floatsPerVertex=2;
    data.AI.NumberOfVertices=4;
    data.AI.drawMode=gl.TRIANGLE_STRIP;

    data.ball={};
    data.ball.speed_x=0.0005; 
    data.ball.speed_y=0.0005;
    data.ball.direction= [1,0,0];
    data.ball.position=[0,0,0];
    data.ball.colorRGB=[1.0, 1.0, 1.0];
    data.ball.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data.ball.bufferId );
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0]) , gl.STATIC_DRAW ); 
    data.ball.floatsPerVertex=2;
    data.ball.NumberOfVertices=1;
    data.ball.drawMode=gl.POINTS;

    data.object2={};
    data.object2.position=[0,0,- 0.7];
    data.object2.colorRGB=[0.0, 0.6, 0.9];
    data.object2.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data.object2.bufferId );
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array([ -0.95,  -0.95, 
				      -0.95,  0.95, 
				      0.97,  -0.97,
				      0.97, 0.97] ) , gl.STATIC_DRAW ); 
    data.object2.floatsPerVertex=2;
    data.object2.NumberOfVertices=4;
    data.object2.drawMode=gl.LINE_LOOP;

   
    data.object3={};
    data.object3.position=[0,0, -0.7];
    data.object3.colorRGB=[0.0, 0.6, 0.9];
    data.object3.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data.object3.bufferId );
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array([ -0.70,  -0.7, 
				      -0.70,  0.7, 
				      0.70,  -0.7,
				      0.70, 0.7, 
				     -0.25,  -0.25,
                      -0.25,  0.25,
                       0.25, -0.25,
                       0.25, 0.25 ] ) , gl.STATIC_DRAW ); 
    data.object3.floatsPerVertex=2;
    data.object3.NumberOfVertices=8;
    data.object3.drawMode=gl.LINES;



    data.object4={};
    data.object4.position=[0,0, 0.7];
    data.object4.colorRGB=[0.0, 0.2, 0.2];
    data.object4.bufferId = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, data.object4.bufferId );
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array([ 0,  0.5, 
                      -0.5,  0,
                      0.5,  0,
                       0,  -0.5,
                      
                      ] ) , gl.STATIC_DRAW ); 
    data.object4.floatsPerVertex=2;
    data.object4.NumberOfVertices=4;
    data.object4.drawMode=gl.TRIANGLE_STRIP;
    data.animation={};
    data.animation.requestId=0;

}

var drawObject=function( obj ) {
    gl.useProgram( glObjects.shaderProgram );
    gl.lineWidth(3);
    gl.enableVertexAttribArray(glObjects.aVertexPositionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.bufferId ); 
    gl.vertexAttribPointer(glObjects.aVertexPositionLocation, obj.floatsPerVertex, gl.FLOAT, false, 0 , 0 );
    gl.uniform3fv( glObjects.uMoveLocation, obj.position );
    gl.uniform3fv( glObjects.uColorRGBLocation, obj.colorRGB );
    gl.drawArrays(obj.drawMode, 0 , obj.NumberOfVertices);
}

var redraw = function() {
    var bg = data.background;
    gl.clearColor(bg[0], bg[1], bg[2], bg[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawObject(data.object1);
    drawObject(data.object2);
    drawObject(data.object3);
    drawObject(data.object4);
    drawObject(data.ball);
    drawObject(data.AI);

}

var animate=function( time ) {
    var timeDelta= time-data.animation.lastTime;
    data.animation.lastTime= time ;
 
   data.object1.position[1]=data.object1.position[1]+data.object1.direction[1]* data.object1.speed*timeDelta;
   data.AI.position[1]=data.AI.position[1]+data.AI.direction[1]* data.AI.speed*timeDelta;

    data.ball.position[0]= data.ball.position[0]+ data.ball.speed_x*timeDelta;
    data.ball.position[1]= data.ball.position[1]+ data.ball.speed_y*timeDelta;

    if (data.ball.position[1] >= 1 || data.ball.position[1] <= -1) {
        data.ball.speed_y = -data.ball.speed_y;
      }

     
      if (data.object1.position[1] + palette_height > 1){
        data.object1.direction=[0,-1];
      }
      if (data.object1.position[1] < -1){
        data.object1.direction=[0,1];
    }


      if (data.AI.position[1] < data.ball.position[1]) {
        if (data.AI.position[1] < 1 - palette_height)
        data.AI.position[1] += data.AI.speed*timeDelta;
      } else {
        if (data.AI.position[1]  > -1) data.AI.position[1] -= data.AI.speed*timeDelta;
      }

   if ( 
        (data.ball.position[0] < data.object1.position[0] + palette_width &&
          data.ball.position[0] + 0.03 > data.object1.position[0] &&
          data.ball.position[1] < data.object1.position[1]  + palette_height  &&
          0.03 + data.ball.position[1]  > data.object1.position[1] ) ||
        (data.ball.position[0] < data.AI.position[0] + palette_width &&
          data.ball.position[0]  + 0.03 > data.AI.position[0] &&
          data.ball.position[1]  < data.AI.position[1] + palette_height &&
          0.03 +  data.ball.position[1] > data.AI.position[1] )
      ) {
         data.ball.speed_x  = -data.ball.speed_x; redraw();
      }

      if (data.ball.position[0] > 1 || data.ball.position[0] < -1) {
        data.ball.position[0]=0; data.ball.position[1]=0;data.ball.speed_x = -data.ball.speed_x;
      }

    redraw();
    gl.finish();
    data.animation.requestId = window.requestAnimationFrame(animate);
}

var animationStart= function(){
    data.animation.lastTime = window.performance.now();
    data.animation.requestId = window.requestAnimationFrame(animate);
}

var animationStop= function(){
    if (data.animation.requestId)
	window.cancelAnimationFrame(data.animation.requestId);
    data.animation.requestId = 0;
    redraw();
}





var htmlInit= function() {
    html={};
    html.html=document.querySelector('#htmlId');
    html.canvas= document.querySelector('#canvasId');
};

var glInit= function(canvas) {
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    glObjects={}; 

    glObjects.shaderProgram=compileAndLinkShaderProgram( gl, vertexShaderSrc, fragmentShaderSrc );
    glObjects.aVertexPositionLocation = gl.getAttribLocation(glObjects.shaderProgram, "aVertexPosition");
    glObjects.uMoveLocation = gl.getUniformLocation(glObjects.shaderProgram, "uMove");
    glObjects.uColorRGBLocation = gl.getUniformLocation(glObjects.shaderProgram, "uColorRGB");

};

var compileAndLinkShaderProgram=function ( gl, vertexShaderSource, fragmentShaderSource ){
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
	console.log(gl.getShaderInfoLog(vertexShader));
	console.log(gl);
	return null;
    }

    var fragmentShader =gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
	console.log(gl.getShaderInfoLog(fragmentShader));
	console.log(gl);
	return null;
    }

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	console.log("Could not initialise shaders");
	console.log(gl);
	return null;
    }
    return shaderProgram;
};


var callbackOnKeyDown =function (e){
    var code= e.which || e.keyCode;
    switch(code)
    {
    case 38: // up
    case 73: // I
        data.object1.direction=[0,1];
       
	if( data.animation.requestId == 0) animationStart();
	break;
    case 40: // down
    case 75: // K
        data.object1.direction=[0,-1];
       
	if( data.animation.requestId == 0) animationStart();
	break;
    
    case 32: // space
	if( data.animation.requestId == 0) { 
        animationStart();
        data.object4.colorRGB=[0.0, 0.2, 0.2];
	} else {
        animationStop();
        data.object4.colorRGB=[0,0.6,0.5];
        redraw();
	} 
	break;
    }
}

window.onload= function(){
    htmlInit();
    glInit( html.canvas );
    dataInit();


    redraw(); 
    window.onkeydown=callbackOnKeyDown;
};


