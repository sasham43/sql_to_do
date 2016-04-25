$(function(){
  $("#addTask").on('click', function(event){
    event.preventDefault();
    var taskString = $("#taskInput").val();
    var taskList = [];
    var taskDisplay = "";

    var taskObject = {name: taskString, completed: false};

    $.ajax({
      url: '/tasks',
      method: 'POST',
      data: taskObject
    }).done(function(response){
      console.log('ajax call response:', response);
      getTasks();
      $("#taskInput").val("");
    }).fail(function(response){
      console.log('ajax call response fail:', response);
    });
  });

  $(document).on("click", ".completeButton", function(){
    console.log('completeButton this', $(this).attr("id"));
    var taskID = getID($(this));
    console.log('taskID', taskID);
    $.ajax({
      url: '/tasks/' + taskID,
      method: 'PUT'
    }).done(function(response){
      console.log('ajax put call worked', response);
      getTasks();
    }).fail(function(response){
      console.log('ajax put call failed', response);
    });
  });

  $(document).on("click", ".removeButton", function(){
    var taskID = getID($(this));
    $.ajax({
      url: '/tasks/' + taskID,
      method: 'DELETE'
    }).done(function(response){
      console.log('ajax delete call worked', response);
      getTasks();
    }).fail(function(response){
      console.log('ajax put call failed', response);
    });
  });

  getTasks();

  function getTasks(){
    $.ajax({
      url: '/tasks',
      method: 'GET'
    }).done(function(response){
      console.log('ajax get response:', response);
      taskList = response;
      console.log('taskList', taskList);
      taskDisplay = displayTasks(taskList);
      $(".taskContainer").html(taskDisplay);
    }).fail(function(response){
      console.log('ajax get call failed', response);
    });
  }

  function displayTasks(list){
    console.log('list', list);
    var str = '';
    list.map(function(object){
      var completeButtonAttribute = '';
      var removeButtonAttribute = '';
      var liClass = '';
      if(object.completed){
        completeButtonAttribute = 'disabled';
        //removeButtonAttribute = 'disabled';
        liClass = 'taskItem disabled';
      } else {
        liClass = 'taskItem';
      }
      str = str + "<li class=\"" + liClass + "\"><button id=\"completeID" + object.id + "\" class=\"btn completeButton\"" + completeButtonAttribute + " aria-label=\"Completed\"><span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span></button><button id=\"removeID" + object.id + "\" class=\"btn removeButton\"" + removeButtonAttribute + " aria-label=\"Remove\"><span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></button>" + object.name + "</li>";
    });
    return str;
  }

  function getID(button){
    var taskArray = button.attr("id").match(/\d/g);
    var taskID = '';
    if (taskArray.length > 1){
      taskArray.map(function(number){
        taskID += number;
      });
    } else {
      taskID = taskArray;
    }

    return taskID;
  }

});
