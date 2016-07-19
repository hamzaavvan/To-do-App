class ToDo {
	private task:string = "";
	private taskList:string[];
	protected taskNo:number;

	constructor(list) {
		var cookies = this.getCookie('task-');

		this.getTaskList(list);

		if (cookies.length > 0) {
			var cookLen = cookies.length;
			document.getElementById('small').remove();

			for (var i=0; i<cookLen; i++) {
				var cookie = cookies[i].split('=');
				var name = cookie[0];
				var task = cookie[1];
				var taskNo = (name.split('-').pop());

				this.addHtml(task, taskNo, list);
			}
		}
	}

	getTaskList(list) {
		var elm = list[0].childNodes;
		var taskList = [];

		for (var i=0; i < elm.length; i++) {
			if (elm[i].nodeName == 'UL') {
				taskList.push(elm[i]);
			}
		}

		this.taskNo = taskList.length;
		this.taskList = taskList;

	}

	getTask(task) {
		var val = task.value;

		if (val.length > 0) {
			this.task = val;
		}
	}

	addTask(list, message, taskBox) {
		var task = this.task;		
		var err = this.alert('danger', 'Please type in the task field');
		var success = this.alert('success', 'Task added successfully');
		
		if (task.length > 0) {
			message.innerHTML = success

			setTimeout(function () {
				message.innerHTML = "";
			}, 5000);

			this.getTaskList(list);

			var taskList = this.taskList;
			var taskNo = this.taskNo+1;

			if (taskNo > 0) {
	    		document.cookie = "task-"+taskNo+"="+task;
				this.addHtml(task, taskNo, list);
				taskBox.value = "";
				this.task = "";
				document.getElementById('small').remove();
			}
		}else {
			message.innerHTML = err;
		}
	}

	addHtml(task:string, taskNo:number, list) {
		var ul = document.createElement("ul");
		ul.setAttribute('class', 'task-'+taskNo);

		var name = document.createElement("li");
		var dlt = document.createElement("li");

		var taskName = document.createTextNode(task);
		
		var dltbtn = document.createElement('button');
		dltbtn.setAttribute('class', 'round btn btn-danger');
		dltbtn.setAttribute('task-id', 'task-'+taskNo);

		var icon = document.createElement('i');
		icon.setAttribute('class', 'glyphicon glyphicon-trash');
		icon.setAttribute('task-id', 'task-'+taskNo);

		dltbtn.appendChild(icon);
          

		name.appendChild(taskName);
		dlt.appendChild(dltbtn);
		
		ul.appendChild(name);
		ul.appendChild(dlt);

		list[0].appendChild(ul);
		
	}

	deleteTask(list) {
		var tasks = list[0];

		tasks.onclick = (e) => {
			var target = e.target || e.srcElement;
			var cookie = target.attributes[1].value;
			var now = <any>new Date();

			if (cookie.indexOf('task-') == 0) {
				now.setDate(now.getDate());

				cookies = this.getCookie(cookie, 'yes');
				// name = cookie[0];
				var value = cookie[1];
				
				// now.toGMTString()
				if (document.cookie = cookie+"="+value+";expires="+now.toGMTString()) {
					var success = "<small class='delete-success alert alert-success'>";
						success += "<i class='glyphicon glyphicon-ok'></i>";
						success += " Your task deleted successfully</small>";
					
					document.getElementsByClassName(cookie)[0].innerHTML = success;
					
					this.getTaskList(list);

					setTimeout(function (taskNo) {
						document.getElementsByClassName(cookie)[0].remove();
						taskNo--;

						if (taskNo == 0) {
							tasks.innerHTML = "<small id='small'>Nothing at the moment</small>";								
						}
					}, 2000, this.taskNo);
				}

			}
		};
	}

	getCookie(name, split = 'no') {
		var cookie = document.cookie;
		var pieces = <any>cookie.split(';');
		var array = [];

		for (var i=0; i<pieces.length; i++) {
			var found = pieces[i].trim();
			if (found.indexOf(name) == 0) {
				if (split == 'yes') {
					var piece = found.split('=');
				}else {
					array.push(found);
				}

			}
		}

		return (split == 'yes') ? piece : array;
	}

	alert(type:string, message:string) {
		var icon = (type == 'danger') ? 'exclamation-sign' : 'ok' ;

		var html = "<p class='alet alert-"+type+"'>";
			html += "<span class='step size-21' aria-hidden='true'>";
		    html += "<i class='glyphicon glyphicon-"+icon+"'></i>";
			html += "</span> "+message+"</p>";

		return html;
	}
}

window.onload = () => {
	var task = document.getElementById('task');
	var add = document.getElementById('btn');
	var message = document.getElementById('message');
	var list = document.getElementsByClassName('list');
	
	var todo = new ToDo(list);

	task.onkeyup = () => {
		todo.getTask(task);

		add.onclick = () => {
			todo.addTask(list, message, task);
		};


		window.onmouseover = () => {
			if (list[0].childElementCount == 0) {
				list[0].innerHTML = "<small id='small'>Nothing at the moment</small>";
			}
		}
	};

	todo.deleteTask(list);
};