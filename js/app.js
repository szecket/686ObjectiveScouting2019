jQuery(document).foundation();
console.log('js is running')

var interval=false;
var timer=15;
var $csv = [];
var $data = [];
var $matchNumber = 0;
var $forms = 0;
var $teams = [];
var $scouts = [];
var $authkey;
var $schedule;
var $event;
var $eventEntered;
var $requiredSatisfied = false;
var $position;
var $teamsParsed = false;

auto=true;

jQuery( document ).ready(function( $ ) {
  clearValues();
  $('#formCount').html($forms);
  clearValues();
});

$('#parse').click(function(){
  parseTeams();
});

function parseTeams(){
  $event = $('#event').val()
  var call;
  $authkey = 'aRkTBqsZnxKNEFzO5rz7ueL7LD1VnxLfQrlOVOQce8LylefHk5lUpA7XJmX7L8hA';
  call = "https://www.thebluealliance.com/api/v3/event/2019"+$event.toLowerCase()+"/matches/simple?X-TBA-Auth-Key="+$authkey
  $.getJSON( call,function( data ) {
    const keys = Object.keys(data)
    var matches={};
    var alliances;
    for (const key of keys) {
      console.log('comp',data[key].comp_level)
      if (data[key].comp_level=='qm'){
      alliances = data[key].alliances.blue.team_keys.join(',')+','+data[key].alliances.red.team_keys.join(',');
      matches[data[key].match_number]={
        'match':data[key].match_number,
        'teams':alliances.split(','),
      };
    }
    }
    $schedule = matches;
    console.log('DATA',data);
    console.log('define schedule',$schedule)
    $('#position').attr('disabled',true);
    $('#teamNumber').attr('readonly',true);
    $('#teamNumber').val('');
    checkReq();
    $teamsParsed = true;
  });
}
function setTime(val){
	$('#'+val).val(timer);
}
function countUp(id){
	var Val = Number($('#'+id+'Val').val())+1;
	$('#'+id+'Val').val(Number(Val));
}
function countDown(id){
	var currentVal = Number($('#'+id+'Val').val());
	var Val;
	if (currentVal > 0) {
  	Val = currentVal-1;
  } else {
  	Val = currentVal;
  }
	console.log('countUp',id,Val)
	$('#'+id+'Val').val(Number(Val));
}
function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function check() {
  $("form :input").each(function() {
  	if ($(this).val == null) {
  		console.log('this',$(this))
			$(this).val('empty');
  	}
  });
}
function writeToCSV(){
  var scoutnmae;
  var teamname;
  if ($('#scoutName').val()){
    scoutname = $('#scoutName').val().replace(/(\r\n|\n|\r)/gm, "");
  }else {
    scoutname = '';
  }
  if ($eventEntered){
    teamname =  $('select[name=teamNumber]').val();
  } else {
    teamname =  $('input[name=teamNumber]').val();
  }
  $data = [
    $('#matchNumber').val(),
    teamname ,
    scoutname,
    $('input[name=attendance]:checked').val()=='on' ? 'Yes' : 'No',
    $('input[name=sand-qd]:checked').val(),
    $('input[name=sand-hp]:checked').val(),
    $('input[name=sand-cb]:checked').val(),
    $('input[name=ch-cargo]:checked').val(),
    $('input[name=ch-low-rocket]:checked').val(),
    $('input[name=ch-middle-rocket]:checked').val(),
    $('input[name=ch-high-rocket]:checked').val(),
    $('input[name=cc-cargo]:checked').val(),
    $('input[name=cc-low-rocket]:checked').val(),
    $('input[name=cc-middle-rocket]:checked').val(),
    $('input[name=cc-high-rocket]:checked').val(),
    $('input[name=maneuverability-ds]:checked').val(),
    $('input[name=maneuverability-being-attacked]:checked').val(),
    $('input[name=maneuverability-attacking]:checked').val(),
    $('input[name=end-hab1]:checked').val(),
    $('input[name=end-hab2]:checked').val(),
    $('input[name=end-hab3]:checked').val(),
    $('input[name=neg-foul]:checked').val()=='on' ? 'Yes (Checked)' : 'No',
    $('input[name=neg-stuck]:checked').val()=='on' ? 'Yes (Checked)' : 'No',
    $('input[name=neg-tipped]:checked').val()=='on' ? 'Yes (Checked)' : 'No',
    $('input[name=neg-damage]:checked').val()=='on' ? 'Yes (Checked)' : 'No',
    $('input[name=neg-stopped]:checked').val()=='on' ? 'Yes (Checked)' : 'No',
    $('input[name=performance]:checked').val(),
    $('textarea[name=endgameComments]').val(),



  ];
  console.log('RAW DATA',$data)
  $csv.push(String($data));
  console.log('$CSV DATA',$csv)
  // $('#csv').append($data.join(", "));
  // $('#csv').append("\n");
  $('#csv').html($csv.join('\n'));
  console.log('CSV TEXTAREA DATA',$('#csv').html())
  // $('#csv').append($csv.join('&#13;\n\r'));
}

function copyToClipboard(element) {
  var $temp = $("<textarea>");
  var brRegex = /<br\s*[\/]?>/gi;
  $("body").append($temp);
  $temp.val($(element).html().replace(brRegex, "\r\n")).select();
  document.execCommand("copy");
  $temp.remove();
}
function textToClipboard (text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}
function checkReq(){
    // if ($teamsParsed){
      if ($('#matchNumber').val()==0){
        $('#teamNumber').attr('readonly',false);
      } else {
        if ($teamsParsed){
          $('#teamNumber').attr('readonly',true);
        }
      }
      try {
      $('#teamNumber').val($schedule[$('#matchNumber').val()].teams[$('#position').val()].slice(3));
      } catch(err){}
    // }
  $matchNumber = Number($('#matchNumber').val());
  if(
    ($('#teamNumber').val()!='') && $('#matchNumber').val()!=''){
    $('.alert').removeClass('alert');
    $requiredSatisfied = true;
    $('#submit-form').val('Send Info');
  }
  else {
    $('#submit-form').addClass('alert');
    $('#submit-form').val('Fill in Team# and Match#');
    $requiredSatisfied = false;
  }
}


function hintTeams(){
  $('#teamNumber option').css('display','visible');
  $('.highlighted').removeClass('highlighted');
  if ($schedule[$matchNumber]!=undefined){
    console.log('match',$matchNumber,'schedule',$schedule[$matchNumber])
    $('#teamNumber option').css('display','none');
    for (var team in $schedule[$matchNumber].teams){
      var numericTeam = $schedule[$matchNumber].teams[team].slice(3);
      console.log('team',$schedule[$matchNumber].teams[team],numericTeam)
      $('option[value='+numericTeam+']').addClass('highlighted');
      $('option[value='+numericTeam+']').css('display','block');
    }
  } else {
      console.log('not messing with team#s')
  }
}
$('#teamNumber').on("change paste keyup",function(){
  checkReq();
})
$('#position').on("change paste keyup",function(){
  checkReq();
})
$('input[name=matchNumber]').on("change paste keyup",function(){
  checkReq();
})
$('#triedToClimb').on("change",function(){
  climbTest();
})
function climbTest(){
  $('#triedToClimb').prop('checked') ? $('#climbl1').show() : $('#climbl1').hide()
  $('#triedToClimb').prop('checked') ? $('#climbl2').show() : $('#climbl2').hide()
  $('#triedToClimb').prop('checked') ? $('#climbl3').show() : $('#climbl3').hide()
  $('#triedToClimb').prop('checked') ? $('#climbSuccess').show() : $('#climbSuccess').hide()
}

$('input[name=climb]').on("change",function(){
  console.log($('input[name=climb]').val());
})

function clearValues(){
  $requiredSatisfied = false;
  var matchNumber = Number($('#matchNumber').val());
  var teamNumber = Number($('#teamNumber').val());
  var scoutName = $('#scoutName').val();
  console.log('team number', teamNumber);
  $position = $('#position').val();
  $('input[type=number]').val('0');
  $('input[type=text]').val('');
  $('input[type=checkbox]').prop( "checked",false );
  $('textarea').val('')
  $('#teamNumber').val('');
  if (matchNumber>0){
    $('#matchNumber').val(matchNumber+1);
  }
  $('input').prop( "checked",false );
  $('select').prop( "checked",false );
  $('#scoutName').val(scoutName);
  $('#level1').prop('checked', true);

  // $('#event').val('MDOWI');

}

  // variable to hold request
  var request;

$('#submit-form').click(function(){
  if ($requiredSatisfied) {

    // Prevent default posting of form - put here to work in case of errors
    event.preventDefault();

    // Abort any pending request
    if (request) {
      request.abort();
    }

    // setup some local variables
    var $form = $(this);


    // Let's select and cache all the fields
    var $inputs = $form.find("input, select, textarea");


    var attempt;
    var success;
    console.log('inputs',$inputs)
    var cl2, cl3;
    console.log('paddle',$('#climbsuccess').val())
    if($('#climb1').prop('checked')){
      attempt = '1';
    } else if ($('#climb2').prop('checked')){
      attempt = '2';
    } else if($('#climb3').prop('checked')){
      attempt = '3';
    } else {
      attempt = '0';
    }
    if ($('#climbsuccess').prop('checked')){
        success = 'true';
      } else {
        success = 'false';
      }


    var params = {
      teamNumber:$('#teamNumber').val(),
      scoutName:$('#scoutName').val(),
      matchNumber:$('#matchNumber').val(),
      triedToClimb:$('#triedToClimb').prop('checked'),
      level2:cl2,
      level3:cl3,
      climbAttempt:attempt,
      climbSucceeded:success,
      defense:$('#defense').val(),  
      fouls:$('#foulsVal').val(),
      cargoLowFailed:$('#cargoLowFailedVal').val(),
      cargoLowWorked:$('#cargoLowWorkedVal').val(),
      cargoHighWorked:$('#cargoHighWorkedVal').val(),
    	cargoHighFailed:$('#cargoHighFailedVal').val(),
    	cargoMechanismBroke:$('#cargoBroke').prop('checked'),
    	hatchLowFailed:$('#hatchLowFailedVal').val(),
    	hatchLowWorked:$('#hatchLowWorkedVal').val(),
    	hatchHighFailed:$('#hatchHighFailedVal').val(),
    	hatchHighWorked:$('#hatchHighWorkedVal').val(),
    	hatchMechanismBroke:$('#hatchBroke').prop('checked'),
    	ssHatch:$('#ssHatchVal').val(),
    	ssCargo:$('#sscargoVal').val(),
    	startLevel:$('input[name=startLevel]:checked').val(),
    	ssSide:$('#ssside').prop('checked'),
      comments:$('textarea[name=endgameComments]').val(),
      nosand:$('#nosand').prop('checked'),
      drivetrainBroke:$('#drivetrainbroke').prop('checked'),
      elevatorBroke:$('#elevatorbroke').prop('checked'),
    }
    params[]
    var serializedData = $.param(params);
    console.log('serializedData',serializedData)



    // Let's disable the inputs for the duration of the Ajax request.
    // Note: we disable elements AFTER the form data has been serialized.
    // Disabled form elements will not be serialized.
    $inputs.prop("disabled", true);

    // fire off the request to /form.php
    request = $.ajax({
      // url: "https://script.google.com/macros/s/AKfycbz8mbc54K-JZ3dGSlEFzo4Qwml5DrOkGLyxSm0wgLmpcVBE5h5r/exec",
      url: "https://script.google.com/macros/s/AKfycbwisPKkeIkCy--549HAwe0UQ6wtcT53loR5QNqTndjTckPDY8U/exec",
      type: "GET",
      crossDomain: true,
      dataType: 'json',
      data: serializedData
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
      // Log a message to the console
      console.log("Hooray, it worked!");
      // var scoutName = $('#scoutName').val();
      // var matchNumber = Number($('#matchNumber').val());
      // console.log('match',matchNumber)
      // $('input[type=number]').val('0')
      // $('input[type=text]').val(' ')
      // $('textarea').val(' ')
      // $('#foul').html('0');
      // $('#techFoul').html('0');
      // $('#scoutName').val(scoutName);
      // $('input').prop( "checked",false );
      // $('#event').val($event);
      // if (matchNumber>0){
      //   $('#matchNumber').val(matchNumber+1);
      // } else {
      //   $
      // };
      $requiredSatisfied = false;
      clearValues();
      climbTest();
      checkReq();
      clearInterval(interval);
      interval=false;
      timer=15;
      $('#time').html(timer);
      auto=true;


    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
      // Log the error to the console
      console.error(
        "The following error occurred: "+
        textStatus, errorThrown
      );
    });

    // Callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function () {
      // Reenable the inputs
      $inputs.prop("disabled", false);

    });
} else {
  checkReq();
}
});
