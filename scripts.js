$(function(){

var todos=[
  {
    task:'reading',
    iscomp: false
  },
  {
    task:'eating',
    iscomp: true
  },
  {
    task:'sleeping',
    iscomp: false
  },
];
var app={
  showTodos:function(){
    var todoListEl = $('#todo-list');
    todoListEl.html(' ');
    todos.forEach(function(todo){
      var taskClasses = (todo.iscomp ? 'is-completed':'todo-task');
      todoListEl.append('\<tr>\<td class="'+ taskClasses +'" style="font-size:22px;padding:0px 27px 0px 0px;" id="tasks">' + todo.task +
      '</td>\<td>\
      <button class="edit-button button-edit btstyling">Edit</button>\
      <button class="delete-button button-delete btstyling">Delete</button>\
      <button class="save-button btstyling";>Save</button>\
      <button class="cancel-button btstyling">Cancel</button>\
      </td>\</tr>' );
    });
  },

toggleTodo:function(){
  todos.forEach(function(todo){
    if(todo.task === $(this).text())
    {
       todo.iscomp = !todo.iscomp;
    }

  }.bind(this));
  app.showTodos();
},
addTask:function(event){
  event.preventDefault();
  var createInput = $('#create-input');
  var createInputValue = createInput.val();
  if(createInputValue===''){
    alert("task is empty");
    return;
  }

  var status = true;
  todos.forEach(function(todo){
    if(createInputValue===todo.task) {
        alert("Task already exists");
        status = false;
    }
  });
  if(status){
    todos.push({
      task: createInputValue,
      iscomp:false
    });
    $.ajax({
           data: todos,
           type: "post",
           url: "process.php",
           success: function(data){
                alert("Data Save: " + data);
           }
  }
  createInput.val('');
  app.showTodos();
},
enterEditMode:function(){
  var actionCell = $(this).closest('td');
  var taskCell = actionCell.prev();
  actionCell.find('.save-button').show();
  actionCell.find('.cancel-button').show();
  actionCell.find('.edit-button').hide();
  actionCell.find('.delete-button').hide();
  taskCell.removeClass('todo-task');
  app.currentTask = taskCell.text();
  taskCell.html('<input type="text" class="edit-input" size="15" value="'+app.currentTask+'"/>');

},
exitEditMode:function(){
  var actionCell = $(this).closest('td');
  var taskCell = actionCell.prev();
  actionCell.find('.save-button').hide();
  actionCell.find('.cancel-button').hide();
  actionCell.find('.edit-button').show();
  actionCell.find('.delete-button').show();
  taskCell.addClass('todo-task');
  taskCell.html(app.currentTask);
},
save:function(){
  console.log(this);
  var newTask=$('.edit-input').val();
  todos.forEach(function(todo){
    if(todo.task === app.currentTask)
    {
       todo.task = newTask;
    }

  });
  app.currentTask=newTask;
  app.exitEditMode.call(this);
},
deleteTask:function(){
  var todoDelete = $(this).parent('td').prev().text();
  var found = false;
  todos.forEach(function(todo,index){
    if(!found && todoDelete===todo.task){
    todos.splice(index,1);
    found = true;
  }
  });
  app.showTodos();
}


};
app.showTodos();
$('#create-form').on('submit',app.addTask);
$('table').on('click','#tasks',app.toggleTodo);
$('table').on('click', '.edit-button' ,app.enterEditMode);
$('table').on('click', '.cancel-button' ,app.exitEditMode);
$('table').on('click', '.save-button' ,app.save);
$('table').on('click', '.delete-button' ,app.deleteTask);
$(document).on('click','#save',function(e) {
  var data = $("#form-search").serialize();
  $.ajax({
         data: data,
         type: "post",
         url: "insertmail.php",
         success: function(data){
              alert("Data Save: " + data);
         }
});
});
