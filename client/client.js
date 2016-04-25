$(function(){
  // add tasks
  $("#addTask").on('click', function(event){
    // prevent page refresh on form submit
    event.preventDefault();
    // grab value from text input
    var taskString = $("#taskInput").val();
    // initialize variables
    var taskList = [];
    var taskDisplay = "";

    // build object
    var taskObject = {name: taskString, completed: false};

    // POST new task to database
    $.ajax({
      url: '/tasks',
      method: 'POST',
      data: taskObject
    }).done(function(response){
      // after we've posted, get all values from database for display
      getTasks();
      $("#taskInput").val("");
    }).fail(function(response){
      console.log('ajax call response fail:', response);
    });
  });

  // mark task as completed
  $(document).on("click", ".completeButton", function(){
    console.log('completeButton this', $(this).attr("id"));
    // pull out numbers from string to use as params
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

  // remove task
  $(document).on("click", ".removeButton", function(){
    // show confirmation modal
    $("#confirmModal").modal('show');
    // pull out number from string to use as params
    var taskID = getID($(this));
    $(document).on("click", "#yesDelete", function(){
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
  });

  // get tasks from database when page loads
  getTasks();

  function getTasks(){
    $.ajax({
      url: '/tasks',
      method: 'GET'
    }).done(function(response){
      console.log('ajax get call worked:', response);
      taskList = response;
      // create html elements based on returned array
      taskDisplay = displayTasks(taskList);
      // add elements to DOM
      $(".taskContainer").html(taskDisplay);
    }).fail(function(response){
      console.log('ajax get call failed', response);
    });
  }

  // this function builds html elements based on an array input
  function displayTasks(list){
    var str = '';
    list.map(function(object){
      var completeButtonAttribute = '';
      var liClass = '';
      if(object.completed){
        completeButtonAttribute = 'disabled';
        liClass = 'taskItem disabled';
      } else {
        liClass = 'taskItem';
      }
      str = str + "<li class=\"" + liClass + "\"><button id=\"completeID" + object.id + "\" class=\"btn completeButton\"" + completeButtonAttribute + " aria-label=\"Completed\"><span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span></button><button id=\"removeID" + object.id + "\" class=\"btn removeButton\" aria-label=\"Remove\"><span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></button>" + object.name + "</li>";
    });
    return str;
  }

  function getID(button){
    // use regular expression to match all digits, string.match() returns an array unless it's just a single digit
    var taskArray = button.attr("id").match(/\d/g);
    var taskID = '';
    if (taskArray.length > 1){
      // if taskArray is indeed an array, loop through it and concatenate all items into one string
      taskArray.map(function(number){
        taskID += number;
      });
    } else {
      // if taskArray is actually a string (single digit) pass string to taskID
      taskID = taskArray;
    }

    return taskID;
  }

});
