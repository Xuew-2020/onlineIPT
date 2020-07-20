/**
 * 在线图像处理页面配置
 * @author 薛望
 * 2020/07/20
 */

let pageConfig = {
	$ : function(el){
		return document.querySelectorAll(el);
	},
	bindEvent : function(){
		let that = this;

		/* 页面顶部控件事件绑定 */

		// 导航栏事件绑定

		menus = that.$('#header-nav .nav-sub');

		// 图像 
		let tx_els = ["#txbh","#txzq"];
		menus[1].querySelectorAll('li').forEach((el,index)=>{
			el.addEventListener('click',function(){
				that.$(tx_els[index])[0].click();
			});
		});

		// 滤镜
		menus[2].querySelectorAll('li').forEach((el)=>{
			el.addEventListener('click',function(){
				that.$('#lj')[0].click();
			});
		});

		// 模糊
		menus[3].querySelectorAll('li').forEach((el)=>{
			el.addEventListener('click',function(){
				that.$('#mh')[0].click();
			});
		});

		//工具
		let gj_els = ["#jq","#kt","#hb","#cz","#xpc","#ssq","#wbgj","#htgj"];
		menus[4].querySelectorAll('li').forEach((el,index)=>{
			el.addEventListener('click',function(){
				that.$(gj_els[index])[0].click();
			});
		});
		

		// 右侧切换显示
		let toggle_flag = 0;
		that.$("#toggle")[0].addEventListener('click',function(){
			that.toggleShow(that.$(".toggle-show")[0],"flex");
			that.toggleShow(that.$(".toggle-show")[1],"block");
			toggle_flag ^= 1;
			icons = that.$("#toggle>span");
			icons[toggle_flag].style.display = "none";
			icons[toggle_flag^1].style.display = "inline";
		});


		/* 页面中间控件事件绑定 */

		// 功能面板切换显示
		that.$('#main-panel span.close')[0].addEventListener('click',function(){
			that.toggleShow(that.$("#main-panel")[0],"flex");
		});
		that.$('#main-nav>ul>li').forEach((el)=>{
			el.addEventListener('click',function(){
				that.$("#main-panel")[0].style.display = "flex";
				that.$("#main-panel-title")[0].innerText = el.title;
			});
		});
		that.$('#main-panel-oper>button').forEach((el)=>{
			el.addEventListener('click',function(){
				that.toggleShow(that.$("#main-panel")[0],"flex");
			});
		});


		// 选择
		let selected = (el,index,arrays)=>{
			el.addEventListener('click',function(){
				arrays.forEach((el)=>{
					el.classList.remove('active');
				});
				el.classList.add('active');
			});
		};
		//历史记录选择
		let history_content = that.$('#history-content>ul>li');
		let history_oper = that.$(".history-oper");
		history_content.forEach(selected);
		history_oper[0].addEventListener('click',function(){
			Array.prototype.some.call(history_content,(el,index,arrays)=>{
				if(index!==0 && el.classList.contains('active')){
					el.classList.remove('active');
					arrays[index-1].classList.add('active');
					arrays[index-1].scrollIntoViewIfNeeded();
					return true;
				};
			});
		});
		history_oper[1].addEventListener('click',function(){
			Array.prototype.some.call(history_content,(el,index,arrays)=>{
				if(index!==history_content.length-1 && el.classList.contains('active')){
					el.classList.remove('active');
					arrays[index+1].classList.add('active');
					arrays[index+1].scrollIntoViewIfNeeded();
					return true;
				};
			});
		});

		// 图层选择
		that.$('#layer-content>ul>li').forEach(selected);


		/* 页面底部控件事件绑定 */

		// 工作区缩放相关控件事件绑定 
		let scale_range = that.$('#scale input[type=range]')[0];
		let scale_text = that.$('#scale input[type=text]')[0];
		function scale_range_event(){
			if(that.workSpaceScale(scale_range.value)){
				scale_text.value = `${Number.parseInt(scale_range.value*100)}%`;
			}
		}
		scale_range.addEventListener('input',scale_range_event);
		scale_text.addEventListener('input',function(){
			let value = Number.parseFloat(this.value)/100;
			if(that.workSpaceScale(value)){
				scale_range.value = value;
			}
		});
		that.$('#scale span.iconfont')[0].addEventListener('click',function(){
			let value = Number.parseFloat(scale_range.value,10) - 0.1;
			scale_range.value = value;
			scale_range_event();
		});
		that.$('#scale span.iconfont')[1].addEventListener('click',function(){
			let value = Number.parseFloat(scale_range.value,10) + 0.1;
			scale_range.value = value;
			scale_range_event();
		});

	},

	/* 切换显示 */
	toggleShow : function(el,mode){
		if(el.style.display === "none"){
			el.style.display = mode;
		}else{
			el.style.display = "none";
		}
	},

	/* 工作区缩放 */
	workSpaceScale : function(value){
		value = Number.parseFloat(value,10);
		if(Number.isNaN(value)){
			return false;
		}
		let contains = document.querySelector("#contains");
		let main = document.querySelector("#main-content");
		if(value<=1){
			contains.style.transformOrigin = "50% 50% 0";
		}else{
			contains.style.transformOrigin = "0 0 0";
		}
		contains.style.transform = `scale(${value})`;
		main.scrollTo(100000,100000);
		let height = main.scrollTop/2;
		let width = main.scrollLeft/2;
		main.scrollTo(width,height);
		return true;
	}
}