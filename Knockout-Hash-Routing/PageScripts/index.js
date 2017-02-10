
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

    HashRouting.Register("navId", vm.NavigationId);

    ko.applyBindings(vm);
});


