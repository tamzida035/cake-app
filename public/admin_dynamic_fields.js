document.getElementById('addButton').addEventListener('click', function() {
  // Create a new div element to hold the new input field
  var newFormGroup = document.createElement('div');
  newFormGroup.className = 'form-group';

  // Create a new input element
  var newField = document.createElement('input');
  newField.type = 'text';
  newField.name = 'dynamicField';

  // Append the new input element to the new div
  newFormGroup.appendChild(newField);

  // Append the new div to the form
  document.getElementById('dynamicForm').appendChild(newFormGroup);
});

document.getElementById('add_dynamic_field').addEventListener('click', function() {
  console.log("I am here");
  // Create the top level div element to hold the new input field
  var topLevelDiv = document.createElement('div');
  topLevelDiv.className = 'contact_1ril';

  // Create the bottom level div element to hold the new input field
  var bottomLevelDiv = document.createElement('div');
  bottomLevelDiv.className = 'border_light';

  // Create a new input element
  var newField = document.createElement('input');
  newField.type = 'text';
  newField.name = 'dynamicField';
  newField.className="form-control border-0";
  newField.placeholder="alternative ingredient";

  // Append the new input element to the new div
  bottomLevelDiv.appendChild(newField);

  // Append the new div to the form
  document.getElementById('dynamic_field').appendChild(topLevelDiv).appendChild(bottomLevelDiv);
});