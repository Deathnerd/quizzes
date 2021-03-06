/*
 * Create.js
 * Author: Wes Gilleland, 2013
 * This will control the page to create quizzes
 */

//Globals
var hover_id = ''; //store the current div being hovered over
var current_choice_count = 1; //how many choices are in the current, working question?
var current_question_count = 1; //how many questions have we created?
var body = $('body');
//construct the url string for the ajax request
var site = function (file) {
	var url = "http://";
	var pathArray = window.location['href'].split('/');
	for (var i = 2; i < pathArray.length - 1; i++) {
		url = url + pathArray[i] + '/';
	}
	return url + file;
};
//ready the JSON template
var jsonReady = function () {
	var json = {};
	json["_quizName"] = "blank";
	json["quiz"] = {};
	json.quiz["questions"] = [];
	return json;
};
//remove those pesky nulls in the JSON
var removeNull = function (json) {
	var questions = json.quiz.questions;
	for (var i = 0; i < questions.length; i++) {
		questions[i].choices.slice(1); //remove that pesky null at the beginning of the choices array
	}
	return json;
};
$(document).ready(function () {

	//fix up the selection box
	var option = $('option');
	var options = option.splice(0, option.length);
	//loop through each of the options and trim off the preceding directory name and following file extension
	$.each(options, function (index) {
		var word = options[index].value;
		var slashSplit = word.split('/');
		var dotSplit = slashSplit[1].split('.');
		options[index].text = dotSplit[0];
	});
	//ready the JSON template
	var json = jsonReady();
	//append choices to the question
	$(document).on({
		click: function () {
			current_choice_count++;
			//html for a new choice. Broken up for readability
			var html = '<tr><td width="30"><div align="center" id="choiceLabel">' + current_choice_count + '</div></td>' +
				'<td width="323"><input type="text" class="choice" value="Enter choice"></td>' +
				'<td width="58"><div align="center"><input name="" type="checkbox" class="correctBox" value=""></div></td>' +
				'<td><input type="button" value="Remove Choice" class="remove_inline_choice" id="' + current_choice_count + '"></td></tr>';
			$(html).appendTo('#' + hover_id + ' > table');
		}
	}, '.choice_add');
	//remove the last choice
	$(document).on({
		click: function () {
			var question = $('#' + hover_id);
			//find the number of current <tr> elements in the question div and remove the last one
			var rows = question.find('tr');
			if (rows.length > 2) {	//if there's only one choice in the question, then we don't need to remove it
				rows[rows.length - 1].remove();
				current_choice_count--;
			}
		}
	}, '.choice_remove');
	//remove the inline choice
	$(document).on({
		click: function () {
			$(this).closest('tr').remove();	//find the closest <tr> element and remove it
			//re-number the labels
			var labels = $('#' + hover_id + ' td > #choiceLabel'); //find only the labels in the current question
			var val = 2; //we start numbering at 2 since we skip the first choice
			for (var x = 0; x < labels.length; x++) {
				$(labels[x]).text(val);
				val++;
			}
		}
	}, '.remove_inline_choice');
	//remove a question from the current div
	$(document).on({
		click: function () {
			$('#question_' + current_question_count).remove();
			current_question_count--;
		}
	}, '.question_remove');
	//set the hover_id to the current question being modified. Clear the hover_id when we're not in the div
	$(document).on({
		mouseenter: function () {
			hover_id = $(this).attr('id');
			current_choice_count = $(this).find('.choice').length; //find the current number of choices in the selected div
		},
		mouseleave: function () {
			hover_id = '';
		}
	}, '.question');
	//generate a new question div
	$(document).on({
		click: function () {
			current_question_count++;
			//html for a new question. Broken up for readability
			var html = '<div class="question" id="question_' + current_question_count + '">' +
				'<p class="question_label">Question ' + current_question_count + '</p><br>' +
				'<input type="button" class="remove_inline_question" value="Remove this question" /><br>' +
				'<textarea name="prompt" cols="40" rows="5">Input some text here</textarea><br>' +
				'<input type="button" value="Add Choice" id="add_choice" class="choice_add" />' +
				'<input type="button" value="Remove Last Choice" id="remove_choice" class="choice_remove" /><br>' +
				'<table width="430" border="0" cellspacing="0" cellpadding="0">' +
				'<tr>' +
				'<th width="30" scope="col">#</th>' +
				'<th width="323" scope="col">Value</th>' +
				'<th width="58" scope="col">Correct?</th>' +
				'</tr>' +
				'<tr>' +
				'<td width="30"><div align="center">1</div></td>' +
				'<td width="323"><input type="text" class="choice" value="Enter choice"></td>' +
				'<td width="58"><div align="center">' +
				'<input name="" type="checkbox" class="correctBox" value="">' +
				'</div></td>' +
				'</tr>' +
				'</table>' +
				'</div>';
			body.append(html);
		}
	}, '.question_add');
	//remove an inline question
	$(document).on({
		click: function () {
			$('#' + hover_id).remove(); //remove the currently hovered over div
			//reorder the divs
			var divs = $(document).find('.question');
			$.each(divs, function (index) {
				var num = index + 1;
				var divIndex = $(divs[index]);
				divIndex.attr('id', 'question_' + num);
				divIndex.find('.question_label').text("Question " + num);
			});
			current_question_count = $('.question').length;
		}
	}, '.remove_inline_question');
	//construct the json from the input fields (works first time! yay!)
	$(document).on({
		click: function () {
			json.courseId = "CSC185";
			json._quizName = $('#quizName').val(); //grab the quiz name
			var questions = $('.question'); //find all the questions
			for (var i = 0; i < questions.length; i++) { //for all the questions in the page
				json.quiz.questions[i] = {}; //create a new object to contain the choices
				var questions_json = json.quiz.questions[i];
				questions_json.prompt = $(questions_json[i]).find('textarea').val(); //there's only one textarea
				questions_json.choices = [];//create a new array for choices
				var choices = $(questions_json[i]).find('tr'); //find all the choices within the question
				for (var j = 1; j < choices.length; j++) { //loop through the question's choices; start at 1 to skip the header
					questions_json.choices[j] = {}; //
					var choices_j = questions_json.choices[j];
					choices_j.value = $(choices_j[j]).find('[type=text]').val(); //fetch the value of the choice
					choices_j.correct = $(choices_j[j].find('[type=checkbox]:checked').length > 0);
					{ //if the checkbox is checked set the json property to true
					}
				}
				json = removeNull(json);
				console.log(json);
				//send the ajax request with the JSON payload
				$.ajax({
					dataType: "json",
					url: site("post.php"),
					data: {
						data: JSON.stringify(json)
					},
					crossDomain: true,
					success: function (data) {
						if (data != "Request empty") {
							alert("Quiz saved");
						}
						else {
							alert("Quiz not saved with error: " + data);
						}
						console.log(data);
						location.reload(true); //reload the page. Quick hack to update the select box. Need to do it AJAX style
					}
				});
			}
		}
	}, '#saveQuiz');
	//function to populate the page from an existing quiz
	var populate = function (json) {
		$.each($(document).find('.question'), function () {
			$(this).remove();
		});//this will delete all questions on the page
		//Make the questions
		console.log('Making questions');
		console.log(json._quizName);
		$('#quizName').attr('value', json._quizName);
		//make the first question without the inline removal button
		html = '<div class="question" id="question_1">' +
		'<p class="question_label">Question 1</p>' +
		'<textarea name="prompt" cols="40" rows="5">Input some text here</textarea><br>' +
		'<input type="button" value="Add Choice" id="add_choice" class="choice_add" />' +
		'<input type="button" value="Remove Last Choice" id="remove_choice" class="choice_remove" /><br>' +
		'<table width="430" border="0" cellspacing="0" cellpadding="0">' +
		'<tr>' +
		'<th width="30" scope="col">#</th>' +
		'<th width="323" scope="col">Value</th>' +
		'<th width="58" scope="col">Correct?</th>' +
		'</tr>' +
		'</table>' +
		'</div>';
		body.append(html);
		var i = 2;
		while (i <= json.quiz.questions.length) {
			var html = '<div class="question" id="question_' + i + '">' +
				'<p class="question_label">Question ' + i + '</p>' +
				'<input type="button" class="remove_inline_question" value="Remove this question" /><br>' +
				'<textarea name="prompt" cols="40" rows="5">Input some text here</textarea><br>' +
				'<input type="button" value="Add Choice" id="add_choice" class="choice_add" />' +
				'<input type="button" value="Remove Last Choice" id="remove_choice" class="choice_remove" /><br>' +
				'<table width="430" border="0" cellspacing="0" cellpadding="0">' +
				'<tr>' +
				'<th width="30" scope="col">#</th>' +
				'<th width="323" scope="col">Value</th>' +
				'<th width="58" scope="col">Correct?</th>' +
				'</tr>' +
				'</table>' +
				'</div>';
			body.append(html);
			i++;
			current_question_count++;
		}
		console.log("Questions complete");
		//make the choices
		console.log("Making choices");
		$.each($(document).find('.question'), function (index) { //loop through the questions
			var question = json.quiz.questions[index];
			$(this).children('textarea').val(question.prompt); //fill in the prompt
			//add choices in this question's choice table
			var c = 1;
			for (var i = 0; i < question.choices.length; i++) {
				//append the html for the row
				if (question.choices[i] === null) {
					continue;
				}
				var html = '<tr>' +
					'<td width="30"><div align="center">' + c + '</div></td>' +
					'<td width="323"><input type="text" class="choice" value="Enter choice"></td>' +
					'<td width="58"><div align="center">' +
					'<input name="" type="checkbox" class="correctBox" value="">' +
					'</div></td>' +
					'</tr>';
				$(this).children('table').append(html);
				//fill in the values
				console.log("Filling in Values");
				var tr = $(this).find('tr'); //find all the current table rows
				var td = $(tr[c]).find('td');
				$(td[0]).val(c); //fill in the question # label
				$(tr[c]).find('.choice').attr('value', question.choices[i].value);//change the value of the input box of the current choice
				$(tr[c]).find('input[type=checkbox]').prop('checked', question.choices[i].correct);//change the checkbox
				c++;
			}
		});
	};
	//action to fetch a test
	$(document).on({
		click: function () {
			var value = $('select').val();
			$.ajax({
				dataType: 'json',
				url: site("fetch.php"),
				data: {
					data: value
				},
				success: function (data) {
					console.log(data);
					populate(data);
				},
				crossDomain: true
			});
		}
	}, '#load');
	//handle the delete button
	$(document).on({
		click: function () {
			if (!confirm("Are you sure you wish to delete this quiz? This action cannot be undone")) {
				return;
			}
			var value = $('select').val();
			$.ajax({
				dataType: 'json',
				url: site('delete.php'),
				success: function (data) {
					if (data === "File not found!") {
						console.log("Error. No data received");
						return;
					}
					console.log(data);
					alert("Quiz deleted successfully");
					location.reload(true); //dirty hack. Do this AJAX style in the future
				},
				data: {
					data: value
				},
				crossDomain: true
			});
		}
	}, "#delete");
	//handle the download button
	$(document).on({
		click: function () {
			window.open(site('zip.php'));
		}
	}, '#download');
});