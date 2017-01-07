(function () {
	//高度自适应
	
	var oContent = tools.$(".content")[0];
	var headerH = tools.$(".header")[0].offsetHeight;
	
	changeHeight();
	
	function changeHeight () {
		var viewHeight = document.documentElement.clientHeight;
		oContent.style.height = viewHeight - headerH + "px";
	}
	window.onresize = changeHeight;
	
	//需要处理的数据
	var datas = data.files;
	var fileId = 0;
	//渲染导航区域
	var pathNav = tools.$(".path-nav")[0]; 
	pathNav.innerHTML = createFileNav(datas,0);
	//渲染文件区域
	var fileBox = tools.$(".file-box")[0];
	var fileList = tools.$(".file-list")[0];
	var empty = tools.$(".file-empty")[0];

	fileList.innerHTML = createFileList(datas,0);

	//渲染菜单区域
	var menuTree = tools.$(".file-tree")[0];
	menuTree.innerHTML = fileTree(datas,-1);
	//初始化定位
	positionTreeById(0);
	
	//利用事件委托，点击树形菜单区域，找到事件源
	tools.addEvent(menuTree,"click",function (ev) {
		var target = ev.target;
		//定位到每一个div上
		if (target = tools.parents(target,".tree-line")) {
			//找到div上的Id值
			fileId = target.dataset.fileId;
			changeFileById(fileId);
			
		}
		
	});
	
	//点击导航区域，改变菜单及文件
	tools.addEvent(pathNav,"click",function (ev) {
		var target = ev.target;
		if (target = tools.parents(target,"a")) {
			fileId = target.dataset.fileId;
			changeFileById(fileId);
		}
	})
	
	//点击文件区域，改变菜单及导航
	tools.addEvent(fileList,"click",function (ev) {
		var target = ev.target;
		if (target = tools.parents(target,".file-item")) {
			fileId = target.dataset.fileId;
			changeFileById(fileId);
		}
	})
	
	function changeFileById (id) {
		//改变导航内容
		pathNav.innerHTML = createFileNav(datas,fileId);
		
		//如果没有子数据，则改变文件区域样式
		var hasChild = dataControl.hasChilds(datas,fileId);
		if (hasChild) {
			//改变文件区域内容
			empty.style.display = "none";
			fileList.innerHTML = createFileList(datas,fileId);
		}else{
			//无文件提示
			empty.style.display = "block";
		}
		//菜单定位
		var old = tools.$(".active",menuTree)[0];
		tools.removeClass(old,"active");
		positionTreeById(fileId);
		//文件添加事件
		tools.each(fileItem,function (item,index) {
			fileHandle(item);
		})
		if (tools.hasClass(checkAll,"checked")) {
			tools.removeClass(checkAll,"checked");
		}
		
	}
	//文件移入、移出，单选
	function fileHandle (item) {
		var checkBox = tools.$(".check-box",item)[0];
		tools.addEvent(item,"mouseenter",function () {
			tools.addClass(this,"file-over");
			checkBox.style.display = "block";
		})
		tools.addEvent(item,"mouseleave",function () {
			if (!tools.hasClass(checkBox,"checked")) {
				tools.removeClass(this,"file-over");
				checkBox.style.display = "none";
			}
		})
		tools.addEvent(checkBox,"click",function (ev) {
			var isChecked = tools.toggleClass(this,"checked");
			if (isChecked) {
				//文件全部勾选，则添加全选图标
				if ( fileChecked().length == checkBoxs.length ) {
					tools.addClass(checkAll,"checked");
				}
			} else{
				//有一项未勾选，则取消全选图标
				tools.removeClass(checkAll,"checked");
			}
			//阻止冒泡，防止触发filelist下的点击事件
			ev.stopPropagation();
		})
	}
	
		//文件单选
		var fileItem = tools.$(".file-item",fileList);
		var checkBoxs = tools.$(".check-box",fileList);
		
		tools.each(fileItem,function (item,index) {
			fileHandle(item);
		})
		//文件全选
		var checkAll = tools.$(".check-all")[0];
		tools.addEvent(checkAll,"click",function () {
			//toggleClass返回布尔值
			var isChecked = tools.toggleClass(this,"checked");
			if (isChecked) {
				tools.each(fileItem,function (item,index) {
					tools.addClass(item,"file-over");
					checkBoxs[index].style.display = "block";
					tools.addClass(checkBoxs[index],"checked");
				})
			} else{
				tools.each(fileItem,function (item,index) {
					tools.removeClass(item,"file-over");
					checkBoxs[index].style.display = "none";
					tools.removeClass(checkBoxs[index],"checked");
				})
			}
		})
	
	function fileChecked () {
		var arr = [];
		tools.each(checkBoxs,function (checkBox,index) {
			if (tools.hasClass(checkBox,"checked")) {
				arr.push(fileItem[index]);
			}
		});
		
		return arr;
	}
	
	//新建文件夹
	var create = tools.$(".new")[0];
	
	tools.addEvent(create,"mouseup",function (ev) {
		var newItem = createFileElement({
			title : "",
			id : new Date().getTime()
		});
		
		fileList.insertBefore(newItem,fileList.firstElementChild);
		
		var fileTitle = tools.$(".file-title",newItem)[0];
		var fileEdtor = tools.$(".file-edtor",newItem)[0];
		var edtor = tools.$(".edtor",fileEdtor)[0];
		
		fileTitle.style.display = "none";
		fileEdtor.style.display = "block";
		//自动选中光标
		edtor.select();
		ev.stopPropagation();
		//创建文件时添加状态
		create.isCreateFile = true;
	})
	tools.addEvent(document,"mousedown",function () {
		//
		if (create.isCreateFile) {
			var firstItem = fileList.firstElementChild;
			var fileTitle = tools.$(".file-title",firstItem)[0];
			var fileEdtor = tools.$(".file-edtor",firstItem)[0];
			var edtor = tools.$(".edtor",fileEdtor)[0];
			var value = edtor.value.trim();
			
			fileTitle.style.display = "block";
			fileEdtor.style.display = "none";
			if ( value === "") {
				fileTitle.innerHTML = "新建文件夹";
			}else{
				fileTitle.innerHTML = value;
			}
			
			create.isCreateFile = false;
			
			fileHandle(firstItem);
		} 
	})
	
}())
