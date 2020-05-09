(function(window){
	"use strict"  

	const PATH = []; 			//存放路径
	let radius = 5;				//顶点半径
	let color = "red";			//默认颜色红色
	function operPoint(x,y){
		this.x = x;
		this.y = y;
	}
	operPoint.prototype.draw = function(cxt){
		cxt.save();
		cxt.beginPath();
		cxt.arc(this.x,this.y,radius,0,2*Math.PI);
		cxt.fillStyle = "#ffffff";
		cxt.closePath();
		cxt.fill();
		cxt.stroke();
		cxt.restore();
	}
	operPoint.drawPath = function(canvas){
		let cxt = canvas.getContext('2d');
		cxt.clearRect(0,0,canvas.width,canvas.height);

		cxt.beginPath();
		PATH.forEach((value)=>{
			cxt.lineTo(value.x,value.y);
		});
		cxt.closePath();
		cxt.fillStyle = color;
		cxt.fill();
	}

	function move(canvas,check){

		canvas.onmousedown = function(e){
			let info = this.getBoundingClientRect();
			e = e || window.event;
			let oldX = e.clientX - info.x;
			let oldY = e.clientY - info.y;
			if(check(this,oldX,oldY)){
				this.style.cursor = "move";
				this.onmousemove = function(e){
					let newX = e.clientX - info.x;
					let newY = e.clientY - info.y;
					let offsetX = newX - oldX;
					let offsetY = newY - oldY;
					[oldX,oldY] = [newX,newY];
					PATH.forEach(function(value,index,array){
						array[index].x += offsetX;
						array[index].y += offsetY;
					}); 
				 	operPoint.drawPath(this);
				}
			}
			this.onmouseup = function(){
				this.onmousemove = null;
				this.style.cursor = "default";
			}
			this.onmouseout = function(){
				this.onmousemove = null;
				this.style.cursor = "default";
			}
		}
	}

	function isInPath(canvas,x,y){

		let cxt = canvas.getContext("2d");
		cxt.beginPath();
		PATH.forEach((value)=>{
			cxt.lineTo(value.x,value.y);
		});
		cxt.closePath();
		if(cxt.isPointInPath(x,y)){
			return true;
		}
		return false;
	}

	
	/************* 属性和方法私有化 *************/
	const PRIVATE = {
		status:Symbol("status"),
	};

	/************* 几何图形构造函数 *************/
	function GraphLayer(parentNode){
		this.parentNode = parentNode;
		this.graphArea = document.createElement("canvas");
		this.graphCxt = this.graphArea.getContext("2d");
		this[PRIVATE.status] = false;  // 画布状态 --- 是否绘制了图形

		/*** 初始化 ***/
		this.parentNode.style.position = "relative";
		let parentInfo = this.parentNode.getBoundingClientRect();
		this.graphArea.width = parentInfo.width;
		this.graphArea.height = parentInfo.height;
		this.graphArea.style.position = "absolute";
		this.graphArea.style.left = "0";
		this.graphArea.style.top = "0";
		this.graphArea.style.zIndex = "1001";
		this.parentNode.appendChild(this.graphArea);


	}

	//************* 绘制几何图形 *************/
	GraphLayer.prototype.rectangle = function(){ //矩形
		if(this[PRIVATE.status] === true){
			return;
		}
		this[PRIVATE.status] = true;
		PATH.splice(0,PATH.length);
		console.log(1);
		this.graphArea.onmousedown = function(e){
			let info = this.getBoundingClientRect();
			e = e || window.event;
			let x = e.clientX - info.x;
			let y = e.clientY - info.y;

			PATH.push(new operPoint(x,y));
			PATH.push(new operPoint(x,y));
			PATH.push(new operPoint(x,y));
			PATH.push(new operPoint(x,y));

			this.onmousemove = function(e){
				e = e || window.event;
				let x = e.clientX - info.x;
				let y = e.clientY - info.y;

				PATH[2].x = x;
				PATH[2].y = y;
				PATH[1].x = x;
				PATH[3].y = y;
				operPoint.drawPath(this);
			}

			let nextOper = ()=>{
				this.onmousemove = null;
				this.onmousedown = null;
				this.onmouseup = null;
				this.onmouseout = null;
				move(this,isInPath);
			}
			this.onmouseup = nextOper;
			this.onmouseout = nextOper;


		}
	}
	window.GraphLayer = GraphLayer;
})(window);