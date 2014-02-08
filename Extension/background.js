// Created By https://github.com/DTwigs
// 2014

+function () {
  //Determine if the current page should load up Github File Filter
  var checkPage = function () {
    return location.pathname.match(/^(?=.*pull)/)
  }

  // Remove empty array values
  var clean = function (arr, deleteValue) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == deleteValue) {
        arr.splice(i, 1);
        i--;
      }
    }
    return arr;
  }

  var getFileTypes = function () {
    var fileTypes = [];
    $('.meta .info .js-selectable-text').each( function () {
      fileTypes.push($(this).text().split('.').pop().trim());
    });
    return $.unique(fileTypes);
  }

  // Create the Filter container and its child elements
  var buildGFFContainer = function (fileTypes) {
    var container = $('<div class="filter-diff-container"/>');
    var selectContainer = $('<div class="fd-style-select"/>')
    var select = $('<select id="filter-diff"/>');
    var infoText = $('<p class="explain filter-diff-text"/>').html('Showing <strong>ALL</strong> files.');
    select.append($("<option>").attr('value', "").text("ALL"));
    selectContainer.append(select)
    container.append(selectContainer).append(infoText)
    $('#toc').after(container);

    if (fileTypes.length > 0)
      clean(fileTypes, "");

    //loop through the file types and add them to the select box as options.
    for (var i = 0, fileType; fileType = fileTypes[i++];) {
      select.append($("<option>").attr('value', fileType).text(fileType));
    }
  }

  var bindEvents = function () {
    $("#filter-diff").change(function (e) {
      var filterVal = $(this).val();
      $("#files [data-path]").closest(".file").show();
      if (filterVal != "") {
        $("#files [data-path]:not([data-path$='." + filterVal + "'])").closest('.file').hide();
      }
      setText(filterVal);
    });
  }

  // Text info field to display filter results.
  var setText = function (filterVal) {
    if (filterVal == "")
      filterVal = "ALL";
    totalFiles = $("#files .file").length;
    shownFiles = $("#files .file:visible").length;
    $('.filter-diff-text').html("Showing <strong>" + filterVal + "</strong> files. <em><strong>" + shownFiles + "</strong> out of <strong>" + totalFiles + "</strong> files displayed.</em>");
  }

  var init = function () {
    if(checkPage()) {
      buildGFFContainer(getFileTypes());
      bindEvents();
    }
  }

  init();
}();
