// Created By https://github.com/DTwigs
// Source: https://github.com/DTwigs/FilterDiff
//
// Collaborators:
// https://github.com/maxjustus
// 2014

+function () {
  var fileObjects = $('.meta[data-path]'),
      fileContainer = $('.file').parent(),


  gesUtils = {
    clean: function (arr, deleteValue) {
      // Remove empty array values
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == deleteValue) {
          arr.splice(i, 1);
          i--;
        }
      }
      return arr;
    },

    getUnique: function(arr){
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
  },


  // ********* GES FILE FILTER TOOL ************
  // Creates a select box that filters the visible code changes by file type.
  gesFileFilter = {
    init: function (){
      if (fileObjects.length <= 1)
        return;

      fileTypes = this.getFileTypes();
      this.buildGFFContainer(fileTypes);
    },

    getFileTypes: function () {
      var fileTypes = [];
      fileObjects.each( function () {
        fileTypes.push(gesFileFilter.getFileTypeName($(this).data('path').trim()));
      });
      return gesUtils.getUnique(fileTypes);
    },

    getFileTypeName: function (fileName) {
      fileNameArr = fileName.split('.');
      if (fileNameArr.length == 1) {
        fileNameArr = fileName.split(' ');
        return fileNameArr.pop().trim();
      } else {
        return "." + fileNameArr.pop().trim();
      }
    },

    buildGFFContainer: function () {
      // Create the Filter container and its child elements
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
        gesUtils.clean(fileTypes, "");

      //loop through the file types and add them to the select box as options.
      for (var i = 0, fileType; fileType = fileTypes[i++];) {
        select.append($("<option>").attr('value', fileType).text(fileType));
      }
    },

    setText: function (filterVal) {
      // Text info field to display filter results.
      if (filterVal == "")
        filterVal = "ALL";
      totalFiles = $(".file", fileContainer).length;
      shownFiles = $(".file:visible", fileContainer).length;
      $('.filter-diff-text').html("Showing <strong>" + filterVal + "</strong> files. <em><strong>" + shownFiles + "</strong> out of <strong>" + totalFiles + "</strong> files displayed.</em>");
    }
  },

  // ********* GES COOMMIT COMPARE TOOL ************
  // Places an arrow next to every commit in a pull request that compares that commit with the latest commit in the PR
  gesCommitCompare = {
    init: function () {
      this.buildRangeDiffLinks();
    },

    buildRangeDiffLinks: function() {
      var repoUrl = location.pathname.match(/\/.*?\/.*?\//)[0];
      var lastSha = $('.commit-id').last().text();
      var title = 'Diff from here down'

      $('.commit-id').each(function() {
        var sha = $(this).text();
        if (sha == lastSha) { return }
        var diffUrl = repoUrl + "compare/" + sha + "..." + lastSha;
        var diffLink = $("<a class='octicon octicon-arrow-down fd-diff-range' title='" + title + "'></a>").attr('href', diffUrl);
        $(this).parent().after(diffLink);
      });
    }
  },

  // Determine if the current page should load up Github Enhancement Suite
  checkPage = function () {
    return location.pathname.match(/^(?=.*pull)||(?=.*commit)/)
  },

  bindEvents = function () {
    $("#filter-diff").change(function (e) {
      var filterVal = $(this).val();
      $("[data-path]", fileContainer).closest(".file").show();
      if (filterVal != "") {
        $("[data-path]:not([data-path$='" + filterVal + "'])", fileContainer).closest('.file').hide();
      }
      gesFileFilter.setText(filterVal);
    });
  },

  init = function () {
    if(checkPage()) {
      gesFileFilter.init();
      gesCommitCompare.init();
      bindEvents();
    }
  };

  init();
}();
