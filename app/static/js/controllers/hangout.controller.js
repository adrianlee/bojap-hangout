'use strict';

angular.module('bojap')
.controller('Hangout', function ($scope) {
  $(function () {
      gapi.hangout.render('start_hangout', {
          'render': 'createhangout',
          'topic': "Adrian's Room",
          'hangout_type': 'normal',
          'initial_apps': [],
          'widget_size': 175
      });
  });

  fetchRooms();
  setInterval(fetchRooms, 10000);

  function fetchRooms() {
    $.get("http://api.bojap.com/rooms", function (data) {
      if (!data) return false;
      // console.log("rooms online: " + data.length);
      var list = document.getElementById("list_rooms");
      var html = "";

      for (var i in data) {
          html += "<tr>";
          html += "<td>" + data[i].local_participant.person.displayName + "</td>";
          html += "<td>" + data[i].topic + "</td>";
          html += "<td>" + data[i].participants.length + "/8</td>";
          // html += "<td>" + "online" + "</td>";
          html += "<td>" + "<a class='button pure-button pure-button-xsmall pure-button-secondary' href='" + data[i].url + "' target='_blank'>join</a>" + "</td>";
          html += "</tr>";
      }

      list.innerHTML = html;
    });
  }
});