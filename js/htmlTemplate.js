//准备文件区域的html结构
function fileItem (fileData) {
	var str = `
		<div class="file-item" data-file-id="${fileData.id}">
			<label class="check-box"></label>
			<div class="file-ico">
				<i></i>
			</div>
			<p class="file-name">
				<span class="file-title">${fileData.title}</span>
				<span class="file-edtor">
					<input type="text" class="edtor" value="${fileData.title}" />
				</span>
			</p>
		</div>
	`;
	return str;
}
function fileList (fileData) {
	var html = `
		<div class="item">
			${fileItem(fileData)}
		</div>
	`;
	return html;
}
//新建单个文件
function createFileElement (fileData) {
	var newDiv = document.createElement("div");
	newDiv.className = "item";
	newDiv.innerHTML = fileItem(fileData);
	return newDiv;
}


//准备菜单区域的html结构
function fileTree (data,treeId) {
	
	var childs = dataControl.getChildById(data,treeId);
	var treeHtml = "<ul>";
	childs.forEach(function (item) {
		//获取当前元素层级
		var level = dataControl.getLevelById(data,item.id);
		//判断当前元素下是否有子元素
		var hasChild = dataControl.hasChilds(data,item.id);
		var className = hasChild ? "spot" : "spot-none"; 
		
		treeHtml += `
				<li>
					<div class="tree-line" data-file-id="${item.id}" style="padding-left:${level*14}px;">
						<i class="${className}"></i>
						<span class="file">${item.title}</span>
					</div>
					${fileTree(data,item.id)}
				</li>
		`;
	})
	treeHtml += "</ul>";
	
	return treeHtml;
}

//菜单定位
function positionTreeById (positionId) {
	
	var ele = document.querySelector(".tree-line[data-file-id='"+positionId+"']");
	tools.addClass(ele,"active");
	
}
//渲染导航区域
function createFileNav (datas,fileId) {
	
	//获取当前元素所有父级
	var parents = dataControl.getParents(datas,fileId).reverse();
	var len = parents.length;
	var navHtml = "";
	
	parents.forEach(function (item,index) {
		if (index === parents.length-1) return ;
			
		navHtml += `
			<a href="javascript:void(0);" data-file-id="${item.id}" style="z-index: ${len--};">${item.title}</a>
		`;
	})
	//当前层级的导航内容
	navHtml +=`
		<span class="nav-tag" data-file-id="${parents[parents.length-1].id}" style="z-index: ${len--};">${parents[parents.length-1].title}</span>
	`;
	
	return navHtml;
}
//渲染文件区域
function createFileList (datas,renderId) {
	var childs = dataControl.getChildById(datas,renderId);
	
	var listHtml = "";

	childs.forEach(function (item) {
		listHtml += fileList(item);
	});
	return listHtml;
}