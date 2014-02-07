

+function () {

  var checkPage = function () {
    return location.pathname.match(/^(?=.*pull)(?=.*files)/)
  }

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

  var buildFilterSelect = function (fileTypes) {
    var container = $('<div class="filter-diff-container"/>');
    var select = $('<select id="filter-diff" class="minibutton"/>');
    select.append($("<option>").attr('value', "").text("all"));
    var imgDiv = $("<div class='filter-diff-img'/>");
    container.append(select).append(imgDiv)

    $('#toc').after(container);

    if (fileTypes.length > 0)
      clean(fileTypes, "");

    for (var i = 0, fileType; fileType = fileTypes[i++];) {
      select.append($("<option>").attr('value', fileType).text(fileType));
    }
  }

  var bindEvents = function () {
    $("#filter-diff-img")
    $("#filter-diff").change(function (e) {
      var filterVal = $(this).val();
      $("[data-path]").parent().show();
      if (filterVal != "") {
        $("[data-path]:not([data-path$='." + filterVal + "'])").parent().hide();
      }
    });
  }

  var init = function () {
    buildFilterSelect(getFileTypes());
    bindEvents();
  }
  if(checkPage()) {
    init();
  }
}();



// $("tr.file-diff-line.gi").length (additions)
// $("tr.file-diff-line.gd").length (deletions)