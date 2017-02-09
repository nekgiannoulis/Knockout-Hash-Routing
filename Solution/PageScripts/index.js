
$(document).ready(function () {

    var vm = {
        NavigationId: ko.observable("welcome"),

        Navigate: function (name) {
            vm.NavigationId(name);
        },

        GoBack: function () {
            window.history.back();
        }
    };

    HashListener.Register("navId", vm.NavigationId);

    ko.applyBindings(vm);
});


