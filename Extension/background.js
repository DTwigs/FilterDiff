// Created By https://github.com/DTwigs
// 2014

+function () {
  //Determine if the current page should load up Github File Filter
  var checkPage = function () {
    return location.pathname.match(/^(?=.*pull)||(?=.*commit)/)
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

  var getUnique = function(arr){
    var u = {}, a = [];
    for(var i = 0, l = arr.length; i < l; ++i){
      if(u.hasOwnProperty(arr[i])) {
        continue;
      }
      a.push(arr[i]);
      u[arr[i]] = 1;
    }
    return a;
  }

  var getFileTypes = function () {
    var fileTypes = [];
    $('.meta[data-path]').each( function () {
      fileTypes.push(getFileTypeName($(this).data('path').trim()));
    });
    return getUnique(fileTypes);
  }

  var getFileTypeName = function (fileName) {
    fileNameArr = fileName.split('.');
    if (fileNameArr.length == 1) {
      fileNameArr = fileName.split(' ');
      return fileNameArr.pop().trim();
    } else {
      return "." + fileNameArr.pop().trim();
    }
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
    // #toc is a github page element
    $('#toc').after(container);

    if (fileTypes.length > 0)
      clean(fileTypes, "");

    //loop through the file types and add them to the select box as options.
    for (var i = 0, fileType; fileType = fileTypes[i++];) {
      select.append($("<option>").attr('value', fileType).text(fileType));
    }
  }

  var fileContainer = $('.file').parent();

  var bindEvents = function () {
    $("#filter-diff").change(function (e) {
      var filterVal = $(this).val();
      $("[data-path]", fileContainer).closest(".file").show();
      if (filterVal != "") {
        $("[data-path]:not([data-path$='" + filterVal + "'])", fileContainer).closest('.file').hide();
      }
      setText(filterVal);
    });
  }

  // Text info field to display filter results.
  var setText = function (filterVal) {
    if (filterVal == "")
      filterVal = "ALL";
    totalFiles = $(".file", fileContainer).length;
    shownFiles = $(".file:visible", fileContainer).length;
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
