$(function(){
  $("#addTask").on('click', function(event){
    event.preventDefault();
    var taskString = $("#taskInput").val();
    var taskList = [];
    var taskDisplay = "";

    var taskObject = {name: taskString, completed: false};

    $.ajax({
      url: '/task',
      method: 'POST',
      data: taskObject
    }).done(function(response){
      console.log('ajax call response:', response);
      //$(".taskContainer").append("<li>" + response.name + "</li>") // replace with get call
      getTasks();
      $("#taskInput").val("");
    }).fail(function(response){
      console.log('ajax call response fail:', response);
    });
  });

  getTasks();

  function getTasks(){
    $.ajax({
      url: '/all',
      method: 'GET'
    }).done(function(response){
      console.log('ajax get response:', response);
      taskList = response;
      console.log('taskList', taskList);
      taskDisplay = displayTasks(taskList);
      $(".taskContainer").html(taskDisplay);
    })
  }

  function displayTasks(list){
    console.log('list', list);
    var str = '';
    list.map(function(object){
      str = str + "<li>"  + object.name + "</li>";
    });
    return str;
  }

});
