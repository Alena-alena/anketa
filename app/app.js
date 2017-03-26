'use strict';

var app = angular.module('myApp', []);
app.controller('mainCtrl', function($scope,$http) {
  $scope.countries = [];
  $scope.countriesToShow = [];
  $scope.cities = [];
  $scope.imgSrc = "";
  $scope.disabledBtnNext = false;
  $scope.step = 1;
  $scope.stepVisibility = [true, false, false, false];
  $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;

  $http.get('cities.json').success(function(data) {
    $scope.cities = Object.values(data);
  });

  $http.get('countries.json').success(function(data) {
    for (var countryKey in data) {
      $scope.countries.push({
        id: countryKey,
        name: data[countryKey],
      });
      $scope.countriesToShow.push(data[countryKey]);
    }
  });

  $scope.user = {
    personalDetails: {
      name: "",
      email: ""      
    },
    locationDetails: {
      country: "",
      city: ""
    },
    socialDetails: {
      link_fb: "",
      link_vk: "",
      link_tw: "",
      link_od: ""
    }
  }

  $scope.userForm = {
    personalDetails: {
      name: "",
      email: ""      
    },
    locationDetails: {
      country: "",
      city: ""
    },
    socialDetails: {
      link_fb: "",
      link_vk: "",
      link_tw: "",
      link_od: ""
    },
    socialCheckbox: {
      checked_fb: false,
      checked_vk: false,
      checked_tw: false,
      checked_od: false
    }
  }

  $scope.firstStepClicked = function() {
    $scope.userForm.personalDetails = angular.copy($scope.user.personalDetails);
    $scope.step = 1;
    $scope.showEmptyName = false;
    $scope.showEmptyEmail = false;
  }

  $scope.secondStepClicked = function() {
    $scope.userForm.locationDetails = angular.copy($scope.user.locationDetails);
    //$scope.citiesToShow = [];
    $scope.step = 2;
  }

  $scope.thirdStepClicked = function() {
    $scope.userForm.socialDetails = angular.copy($scope.user.socialDetails);
    $scope.userForm.socialCheckbox.checked_fb = $scope.userForm.socialDetails.link_fb.length > 0
    $scope.userForm.socialCheckbox.checked_vk = $scope.userForm.socialDetails.link_vk.length > 0
    $scope.userForm.socialCheckbox.checked_tw = $scope.userForm.socialDetails.link_tw.length > 0
    $scope.userForm.socialCheckbox.checked_od = $scope.userForm.socialDetails.link_od.length > 0
    $scope.step = 3;
  }

  $scope.fourthStepClicked = function() {
    $scope.step = 4
  }

  $scope.onCountrySelect = function() {
    var country = $scope.userForm.locationDetails.country;
    var id = $scope.countries.find(elem => elem.name === country).id;
    $scope.citiesToShow = $scope.cities.filter(city => city.country === Number(id)).map(e => e.name);
  };

  $scope.nextStep = function(user) {
    switch ($scope.step) {
      case 1:
      $scope.showEmptyName = false;
      $scope.showEmptyEmail = false;
      var name = $scope.userForm.personalDetails.name;
      var email = $scope.userForm.personalDetails.email;
      if (name.trim().length < 1) {
        $scope.showEmptyName = true;
      }
      if (email.trim().length < 1) {
        $scope.showEmptyEmail = true;
      }
      if (name.length > 0 && email.length > 0 && $scope.emailFormat.test(email)) {
        $scope.user.personalDetails = angular.copy($scope.userForm.personalDetails);       
        $scope.step = 2;
        $scope.showEmptyEmail = false;
        $scope.showEmptyName = false;
        $scope.stepVisibility[1] = true;
      }
      break;
      case 2:
      $scope.citiesToShow = [];
      if ($scope.userForm.locationDetails.country.length < 1) {
        $scope.showEmptyCountry = true;
      } else {
        $scope.user.locationDetails = angular.copy($scope.userForm.locationDetails);
        $scope.showEmptyCountry = false;
        $scope.stepVisibility[2] = true;
        $scope.step = 3;        
      }
      break;
      case 3:
      if ($scope.userForm.socialCheckbox.checked_fb == true) {
        $scope.user.socialDetails.link_fb = $scope.userForm.socialDetails.link_fb;
      } else {
        $scope.user.socialDetails.link_fb = "";
      }
      if ($scope.userForm.socialCheckbox.checked_vk == true) {
        $scope.user.socialDetails.link_vk = $scope.userForm.socialDetails.link_vk;
      } else {
        $scope.user.socialDetails.link_vk = "";
      }
      if ($scope.userForm.socialCheckbox.checked_tw == true) {
        $scope.user.socialDetails.link_tw = $scope.userForm.socialDetails.link_tw;
      } else {
        $scope.user.socialDetails.link_tw = "";
      }
      if ($scope.userForm.socialCheckbox.checked_od == true) {
        $scope.user.socialDetails.link_od = $scope.userForm.socialDetails.link_od;
      } else {
        $scope.user.socialDetails.link_od = "";
      }
      $scope.stepVisibility[3] = true;
      $scope.step = 4;
      break;
      case 4:
      if ($scope.imgSrc.length < 1) {
        $scope.showChooseTxt = true;
        $scope.disabledBtnNext = true;
      } else {
        $scope.step = 5;
      }
      break;
      default:
      break;
    }
  };

  $scope.prevStep = function() {
    switch ($scope.step) {
      case 1:
      break;
      case 2:
      $scope.firstStepClicked();
      break;
      case 3:
      $scope.secondStepClicked();
      break;
      case 4:
      $scope.thirdStepClicked();
      break;
      case 5:
      $scope.fourthStepClicked();
      break;
      default:
      break;
    }
  };

  $scope.clickImg = function(event) {
    var imgClick = angular.element(document.querySelectorAll('.img_choose'));
    imgClick.removeClass('click-pic');
    event.currentTarget.className = event.currentTarget.className + " " + "click-pic";
    $scope.imgSrc = event.currentTarget.src;
    $scope.showDogTxt = false;
    $scope.showChooseTxt = false;
    $scope.disabledBtnNext = false;
    if (event.currentTarget.id == 'dog') {
      $scope.showDogTxt = true;
      $scope.disabledBtnNext = true;
    }
    if ($scope.imgSrc.length < 1) {
      $scope.showChooseTxt = true;
      $scope.disabledBtnNext = true;
    }
  };

  $scope.tryAgain = function() {
    $scope.user.personalDetails.name = "";
    $scope.user.personalDetails.email = "";
    $scope.user.locationDetails.country = "";
    $scope.user.locationDetails.city = "";
    $scope.user.socialDetails.link_fb = "";
    $scope.user.socialDetails.link_vk = "";
    $scope.user.socialDetails.link_tw = "";
    $scope.user.socialDetails.link_od = "";
    $scope.userForm = angular.copy($scope.user);
    // $scope.userForm.socialCheckbox.checked_fb = false;
    // $scope.userForm.socialCheckbox.checked_vk = false;
    // $scope.userForm.socialCheckbox.checked_tw = false;
    // $scope.userForm.socialCheckbox.checked_od = false;
    $scope.citiesToShow = [];
    $scope.stepVisibility = [true, false, false, false];
    $scope.step = 1;
  };

});
